/**
 * Horizontal-overflow sweep.
 *
 * A page that scrolls sideways on a phone is the single most obvious
 * responsiveness failure, and it is invisible on a desktop where every layout
 * has room. This walks every page type at six widths and reports the widest
 * offending element by its tag and first few classes, so the fix is a lookup
 * rather than a hunt.
 *
 * 1px of slack: sub-pixel rounding on a transformed element routinely reports
 * a fractional overhang that never renders as a scrollbar.
 *
 *   bun scripts/qa-overflow.mjs [baseUrl]
 */
import { chromium } from "playwright-core";

const BASE = process.argv[2] ?? "http://127.0.0.1:4173";
const WIDTHS = [390, 430, 768, 1024, 1440, 1920];
const ROUTES = [
  "",
  "/radiocom",
  "/motorola",
  "/poc",
  "/radiocom/rcd-70",
  "/radiocom/rcd-70/specs",
  "/service",
  "/compare",
  "/industries",
  "/industries/construction",
];

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});

let failures = 0;
for (const width of WIDTHS) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  for (const route of ROUTES) {
    await page.goto(`${BASE}/ru${route}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(250);
    const result = await page.evaluate((vw) => {
      const doc = document.documentElement;
      if (doc.scrollWidth <= vw + 1) return null;
      let worst = null;
      for (const el of document.querySelectorAll("*")) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.right > vw + 1 && (!worst || r.right > worst.right)) {
          const cls = String(el.className || "").split(/\s+/).filter(Boolean).slice(0, 3).join(".");
          worst = { sel: el.tagName.toLowerCase() + (cls ? "." + cls : ""), right: Math.round(r.right) };
        }
      }
      return { scrollWidth: doc.scrollWidth, worst };
    }, width);
    if (result) {
      failures++;
      console.log(
        `OVERFLOW ${String(width).padStart(4)}  /ru${route || "/"}  →  ${result.scrollWidth}px` +
          `   widest: ${result.worst?.sel} @${result.worst?.right}`,
      );
    }
  }
  await page.close();
}
await browser.close();

console.log(
  failures === 0
    ? `qa-overflow: ok — no horizontal overflow across ${ROUTES.length} routes × ${WIDTHS.length} widths`
    : `qa-overflow: ${failures} overflowing route/width combinations`,
);
process.exit(failures ? 1 : 0);
