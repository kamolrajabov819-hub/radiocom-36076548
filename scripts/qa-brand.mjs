/**
 * Every visible "Radiocom" on the site must render as RADIOCOM.
 *
 * The wordmark in the header is all-caps. Body copy that reads "Radiocom" next
 * to it is the site disagreeing with its own logo, and auditing that by hand
 * across three locales and ~115 translation strings is how one gets missed.
 *
 * The check is on what the reader sees, not on what the source says: walk every
 * text node in the body, and for each one containing the brand as a proper
 * noun, ask the browser what `text-transform` it resolved to. That passes only
 * when the glyphs are actually capitals — a `brandCase()` call site that got
 * dropped, a new string added to `ru.json` and rendered raw, or a CSS change
 * that stopped applying all fail here, and none of them are visible to a
 * source-level grep.
 *
 * `<script>` and `<style>` are skipped: the JSON-LD `Product.name` is supposed
 * to keep its real casing, and so are `<title>`, `og:` meta and the sitemap.
 * That split is the whole point — see `src/lib/brand.tsx`. `.sr-only` text is
 * skipped for the same reason from the other direction: nobody sees it, and a
 * voice engine reads "Radiocom" better than it reads "RADIOCOM".
 *
 *   bun scripts/qa-brand.mjs [baseUrl]
 */
import { chromium } from "playwright-core";

const BASE = process.argv[2] ?? "http://127.0.0.1:4173";
const ROUTES = [
  "",
  "/radiocom",
  "/motorola",
  "/poc",
  "/radiocom/rcd-70",
  "/radiocom/rcd-70/specs",
  "/motorola/dp-4400e",
  "/service",
  "/compare",
  "/industries",
  "/industries/construction",
  "/answers",
  "/answers/how-to-choose",
  "/search",
  "/sitemap",
  "/contacts",
];

const b = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });

let bad = 0;
let seen = 0;
for (const lang of ["ru", "en", "uz"]) {
  for (const r of ROUTES) {
    const url = `${BASE}/${lang}${r}`;
    const res = await p.goto(url, { waitUntil: "domcontentloaded" });
    if (!res || res.status() >= 400) continue;
    await p.waitForTimeout(300);
    const found = await p.evaluate(() => {
      const out = [];
      let total = 0;

      // A space that the layout ate is invisible to a text check.
      //
      // Wrapping the brand in its own element inside a flex container makes it
      // a flex item, and a flex container strips leading and trailing
      // whitespace from every item — so `<span>Radiocom</span> RCD-70 PRO`
      // inside the `inline-flex` breadcrumb rendered "RADIOCOMRCD-70 PRO"
      // while `textContent` still read correctly. Measuring the space is the
      // only way to see it: a `Range` over one collapsed character has zero
      // width.
      for (const span of document.querySelectorAll("span.uppercase")) {
        const next = span.nextSibling;
        if (!next || next.nodeType !== Node.TEXT_NODE) continue;
        const after = next.textContent ?? "";
        const lead = after.match(/^\s+/);
        if (!lead) continue;
        // Where does the first real character land? A space that falls on a
        // line break legitimately has no width, so only a gap that never
        // happened *on the same line* is a fault.
        const r = document.createRange();
        r.setStart(next, lead[0].length);
        r.setEnd(next, lead[0].length + 1);
        const word = r.getBoundingClientRect();
        const brand = span.getBoundingClientRect();
        if (!word.width || Math.abs(word.top - brand.top) > 2) continue;
        if (word.left - brand.right < 1) {
          out.push({
            text: (span.parentElement?.textContent ?? "").trim().slice(0, 90),
            where: `${span.parentElement?.tagName.toLowerCase()} — space after the brand collapsed`,
          });
        }
      }
      const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = walk.nextNode())) {
        const text = n.textContent ?? "";
        if (!/\bRadiocom\b/.test(text)) continue;
        const el = n.parentElement;
        if (!el) continue;
        // The document's own machine-readable copies keep their real casing.
        if (el.closest("script, style, noscript, template")) continue;
        // So does anything only a screen reader ever reaches. A table
        // `<caption class="sr-only">` is never seen, and several voice engines
        // spell an all-caps token out letter by letter — "Radiocom" is the
        // better string there, not a miss.
        if (el.closest(".sr-only") || !el.getClientRects().length) continue;
        total += 1;
        if (getComputedStyle(el).textTransform !== "uppercase") {
          out.push({
            text: text.trim().slice(0, 90),
            where: `${el.tagName.toLowerCase()}${el.className ? "." + String(el.className).split(/\s+/).slice(0, 3).join(".") : ""}`,
          });
        }
      }
      return { out, total };
    });
    seen += found.total;
    for (const f of found.out) {
      bad += 1;
      console.log(`  ✗ ${lang}${r || "/"}  <${f.where}>  "${f.text}"`);
    }
  }
}
await b.close();

if (bad) {
  console.log(`\nqa-brand: ${bad} visible "Radiocom" not rendered as RADIOCOM`);
  process.exit(1);
}
console.log(`qa-brand: ok — all ${seen} visible brand mentions render as RADIOCOM`);
