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
 * `document.documentElement.scrollWidth` alone is not the check. It correctly
 * ignores the site's many deliberate `overflow-x: auto` shelves — a card
 * inside `HighlightsShelf`'s scroll track is *supposed* to sit past the
 * viewport edge, that's the whole mechanism, and the track's own overflow
 * containment is why none of that reaches `scrollWidth`. But that same
 * containment logic swallows real bugs too: the site's nav bar overflowed
 * the viewport by ~135px between 1024 and 1150px wide (six links plus a CTA
 * genuinely didn't fit) with `scrollWidth` reporting no overflow at all and
 * no scrollbar ever appearing, because `header` is `position: fixed`, and a
 * fixed element's descendants don't propagate overflow into the document's
 * scrollWidth the way normal-flow content does either.
 *
 * So detection here is a direct per-element scan against the viewport,
 * walking each candidate's ancestor chain first: if any ancestor between it
 * and `<body>` sets `overflow-x: auto|scroll|hidden`, the overflow is
 * contained by that ancestor's own scroll region and expected — skip it. An
 * element with no such ancestor whose overflow reaches all the way to the
 * document root is genuinely uncontained, whatever positions it, wherever it
 * sits in the tree.
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
  "/answers",
  "/answers/how-to-choose",
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
      const describe = (el) => {
        const cls = String(el.className || "")
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 3)
          .join(".");
        return el.tagName.toLowerCase() + (cls ? "." + cls : "");
      };

      // Contained by some ancestor's own scroll region (an intentional
      // horizontal shelf) — walk up to <body>, not past it, since nothing
      // above that is a per-component container.
      const isContained = (el) => {
        for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
          const ox = getComputedStyle(a).overflowX;
          if (ox === "auto" || ox === "scroll" || ox === "hidden") return true;
        }
        return false;
      };

      let worst = null;
      for (const el of document.querySelectorAll("*")) {
        const r = el.getBoundingClientRect();
        if (r.width === 0) continue;
        const overhang = Math.max(r.right - vw, -r.left);
        if (overhang > 1 && !isContained(el) && (!worst || overhang > worst.overhang)) {
          worst = { sel: describe(el), overhang: Math.round(overhang), right: Math.round(r.right) };
        }
      }

      if (!worst) return null;
      return { scrollWidth: doc.scrollWidth, worst };
    }, width);
    if (result) {
      failures++;
      console.log(
        `OVERFLOW ${String(width).padStart(4)}  /ru${route || "/"}  →  ` +
          `${result.worst.sel} overhangs by ${result.worst.overhang}px @${result.worst.right}` +
          `   (doc.scrollWidth ${result.scrollWidth}px)`,
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
