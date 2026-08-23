/**
 * Finds blended images that cannot blend.
 *
 * `mix-blend-mode` composites against the nearest stacking context, not against
 * the page. Any ancestor with a `transform`, `filter`, `opacity < 1`,
 * `will-change: transform`, `perspective` or `isolation: isolate` opens one —
 * and inside it the backdrop is transparent, so a `mix-blend-multiply` image
 * simply renders as-is. On a white band nobody notices. On a tinted or coloured
 * band it is a hard white rectangle, which is what the PoC hero was.
 *
 * Framer Motion is the usual culprit: every `motion.div` animating `y`, `scale`
 * or `opacity` sets one of those properties, so wrapping a product shot in an
 * entrance animation silently disables its blend.
 *
 * Reports each blended <img> whose nearest blocking ancestor is not the root,
 * together with the band colour behind it — a white band is harmless, anything
 * else is a visible box.
 *
 *   bun scripts/qa-blend.mjs [baseUrl]
 */
import { chromium } from "playwright-core";

const BASE = process.argv[2] ?? "http://127.0.0.1:4173";
const ROUTES = [
  "", "/radiocom", "/motorola", "/poc", "/radiocom/rcd-70", "/radiocom/rcd-70/specs",
  "/service", "/compare", "/industries", "/industries/construction",
];

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

let problems = 0;
for (const route of ROUTES) {
  await page.goto(`${BASE}/ru${route}`, { waitUntil: "domcontentloaded" });
  // Entrance animations settle; a mid-flight `opacity: 0.4` would report as a
  // stacking context that does not exist once the page is at rest.
  await page.waitForTimeout(1400);
  const found = await page.evaluate(() => {
    const opens = (el) => {
      const s = getComputedStyle(el);
      if (s.transform !== "none") return "transform";
      if (s.filter !== "none") return "filter";
      if (s.perspective !== "none") return "perspective";
      if (s.isolation === "isolate") return "isolation";
      if (parseFloat(s.opacity) < 1) return `opacity:${s.opacity}`;
      if (/transform|opacity|filter/.test(s.willChange)) return `will-change:${s.willChange}`;
      return null;
    };
    const out = [];
    for (const img of document.querySelectorAll("img")) {
      const mode = getComputedStyle(img).mixBlendMode;
      if (mode === "normal") continue;
      let cause = null;
      for (let el = img.parentElement; el && el !== document.body; el = el.parentElement) {
        const why = opens(el);
        if (why) {
          const cls = String(el.className || "").split(/\s+/).filter(Boolean).slice(0, 2).join(".");
          cause = { why, sel: el.tagName.toLowerCase() + (cls ? "." + cls : "") };
          break;
        }
      }
      if (!cause) continue;
      // What is actually behind it — a white band hides the failure.
      const r = img.getBoundingClientRect();
      let band = "";
      for (let el = img.parentElement; el; el = el.parentElement) {
        const bg = getComputedStyle(el).backgroundColor;
        if (bg && bg !== "rgba(0, 0, 0, 0)") { band = bg; break; }
      }
      out.push({ src: (img.currentSrc || img.src).split("/").pop(), mode, ...cause, band,
                 size: `${Math.round(r.width)}x${Math.round(r.height)}` });
    }
    return out;
  });
  for (const f of found) {
    const white = /^rgba?\(255,\s*255,\s*255/.test(f.band);
    problems += white ? 0 : 1;
    console.log(
      `${white ? "note" : "FAIL"} /ru${route || "/"}  ${f.src}  ${f.mode} blocked by ${f.why} on ${f.sel}` +
        `   band=${f.band || "?"}  ${f.size}`,
    );
  }
}
await browser.close();

console.log(
  problems === 0
    ? "qa-blend: ok — no blended image sits on a non-white band inside a stacking context"
    : `qa-blend: ${problems} blended images will render as a visible box`,
);
process.exit(problems ? 1 : 0);
