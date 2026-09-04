/**
 * Heading-structure gate.
 *
 * Two rules, both checked against the **rendered DOM** rather than the source.
 * That distinction is the whole reason this file exists: while writing it I
 * counted `<h1>` three separate ways by grepping the page modules and got three
 * different answers — `<motion.h1>` does not match `<h1`, `<motion.h1` followed
 * by a newline does not match `<h1[ >]`, and a `<h1>` mentioned inside an
 * explanatory comment matches everything. The DOM has no such ambiguity, and it
 * is what a crawler and a screen reader actually receive.
 *
 *   1. **Exactly one `h1` per page.** Zero leaves a crawler and a screen reader
 *      without the one element that says what the page is; the sitemap and the
 *      search page both shipped zero. More than one dilutes it.
 *   2. **No skipped levels.** An `h3` directly after an `h1` breaks the outline
 *      a screen-reader user navigates by, and it is invisible in a screenshot.
 *   3. **What is seen is what is read.** A heading's `textContent` must match the
 *      text a sighted reader sees, spaces included. This exists because the
 *      site's word-reveal animation split headings on `" "` and then dropped the
 *      space, faking the gap with `mr-[0.25em]`. It looked perfect and served
 *      `<h1>Несокрушимые,Профессиональныерации.</h1>` to every screen reader,
 *      crawler, and copy-paste — 31 headings across the 15 routes below, in all
 *      three locales. A screenshot cannot show this and rule 1 and 2 both pass
 *      while it is happening, which is why it survived so long.
 *
 *      The check measures each text run's box and inserts a space wherever the
 *      layout puts one, then compares that against `textContent`. Faking a gap
 *      in CSS makes the two disagree; a real space keeps them identical.
 *
 * Usage: node scripts/qa-headings.mjs [base-url]
 */
import { chromium } from "playwright-core";

const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const BASE = process.argv[2] ?? "http://localhost:4173";

/** Every page type, plus the two search states, which render differently. */
const ROUTES = [
  "/ru/",
  "/ru/radiocom",
  "/ru/motorola",
  "/ru/radiocom/rcd-70",
  "/ru/radiocom/rcd-70/specs",
  "/ru/poc",
  "/ru/service",
  "/ru/compare",
  "/ru/industries",
  "/ru/industries/construction",
  "/ru/sitemap",
  "/ru/search",
  "/ru/search?q=RCD",
];

const browser = await chromium.launch({ executablePath: CHROME });
const problems = [];

for (const route of ROUTES) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  // Transforms are neutralised before measuring. The word reveal translates each
  // word on the Y axis with a staggered delay, so a heading caught mid-animation
  // has its words at different heights and every one of them reads as a new line.
  // Horizontal geometry — the only axis this check uses — is unaffected.
  await page.addStyleTag({
    content:
      "*{transform:none!important;opacity:1!important;transition:none!important;animation:none!important}",
  });
  await page.evaluate(() => document.fonts.ready);
  const { levels, h1s, jammed } = await page.evaluate(() => {
    const all = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")];

    /** The boxes a text node actually paints into, one per visual line. */
    const boxes = (node) => {
      const r = document.createRange();
      r.selectNodeContents(node);
      return [...r.getClientRects()];
    };

    const norm = (s) => s.replace(/\s+/g, " ").trim();
    const jammed = [];
    for (const h of all) {
      const walk = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
      const runs = [];
      for (let n = walk.nextNode(); n; n = walk.nextNode()) {
        if (!n.textContent.trim()) continue;
        const bs = boxes(n);
        if (bs.length) runs.push({ text: n.textContent, first: bs[0], last: bs[bs.length - 1] });
      }
      if (runs.length < 2) continue;

      // Rebuild the heading as the layout presents it: a space wherever
      // consecutive runs are pushed apart horizontally or land on a new line.
      let seen = runs[0].text;
      for (let i = 1; i < runs.length; i++) {
        const a = runs[i - 1].last;
        const b = runs[i].first;
        const separated = b.top > a.top + 2 || b.left - a.right > 1;
        seen += (separated ? " " : "") + runs[i].text;
      }
      if (norm(seen) !== norm(h.textContent)) {
        jammed.push({ read: norm(h.textContent).slice(0, 70), seen: norm(seen).slice(0, 70) });
      }
    }

    return {
      levels: all.map((e) => Number(e.tagName[1])),
      h1s: all.filter((e) => e.tagName === "H1").map((e) => e.textContent.trim().slice(0, 40)),
      jammed,
    };
  });
  await page.close();

  if (h1s.length !== 1) {
    problems.push(
      h1s.length === 0
        ? `${route}: no h1 — nothing tells a crawler or a screen reader what this page is`
        : `${route}: ${h1s.length} h1 elements (${h1s.join(" / ")}) — a page has one subject`,
    );
  }
  const skips = [];
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1] + 1) skips.push(`h${levels[i - 1]} -> h${levels[i]}`);
  }
  if (skips.length) problems.push(`${route}: skipped heading levels (${skips.join(", ")})`);

  for (const j of jammed) {
    problems.push(
      `${route}: heading reads as "${j.read}" but is seen as "${j.seen}" — ` +
        `the gap is CSS, not a space, so screen readers and crawlers get the jammed form`,
    );
  }

  const counts = [1, 2, 3].map((n) => `h${n}:${levels.filter((l) => l === n).length}`).join(" ");
  console.log(
    `  ${h1s.length === 1 && !skips.length && !jammed.length ? "ok  " : "FAIL"} ${route.padEnd(30)} ${counts}`,
  );
}

await browser.close();

if (problems.length) {
  console.error(`\nqa-headings: ${problems.length} problem(s)`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(
  `\nqa-headings: ok — ${ROUTES.length} routes, one h1 each, no skipped levels,` +
    ` every heading read exactly as seen`,
);
