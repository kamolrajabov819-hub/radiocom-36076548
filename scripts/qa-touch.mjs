/**
 * Tap-target and legibility sweep at phone width.
 *
 * WCAG 2.5.8 (AA) asks for 24x24 CSS px; Apple's own guidance is 44pt, and 44
 * is what a thumb actually needs on a control that matters. This reports
 * anything under 24 as a failure and anything between 24 and 44 as a note, so
 * the two standards stay distinguishable rather than collapsing into one number.
 *
 * Two exemptions, both explicit rather than accidental:
 *   - the skip link, which is 1x1 until focused and full-size after;
 *   - elements whose own `::after` box reaches 44px, which is how a compact
 *     control (the language toggle) extends its target without growing.
 *
 * Also flags text below 13px, which is where Cyrillic at 390px stops being
 * comfortable.
 *
 * There is deliberately no "squeezed column" check. Three versions of one were
 * tried and each measured the wrong thing: characters per line flagged every
 * display headline, since a 96px headline wrapping at eight characters is
 * exactly right; absolute line width flagged poster-card titles, which are
 * narrow because the card is a 2:3 portrait two to a row; and comparing the
 * line box against its container flagged `text-wrap: balance`, whose whole
 * purpose is to wrap earlier than it has to. A squeezed column is a visual
 * judgement, and the 390px screenshots are the tool for it. A gate that cries
 * wolf on correct typography is worse than no gate, because it trains you to
 * skim past it.
 *
 *   bun scripts/qa-touch.mjs [baseUrl]
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
  "/service",
  "/compare",
  "/industries",
  "/industries/construction",
];

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
// `hasTouch`/`isMobile` so `(pointer: coarse)` matches — several controls take
// their full 44px only under that query, which is the whole point of using it.
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  hasTouch: true,
  isMobile: true,
});

let failures = 0;
let notes = 0;

for (const route of ROUTES) {
  await page.goto(`${BASE}/ru${route}`, { waitUntil: "domcontentloaded" });
  await page.evaluate(async () => {
    const step = innerHeight * 0.6;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 70));
    }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(400);

  const found = await page.evaluate(() => {
    const out = [];
    const seen = new Set();

    for (const el of document.querySelectorAll('a,button,[role="button"],input,select')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      // The skip link is 1x1 until it takes focus.
      if (el.className && String(el.className).includes("sr-only")) continue;
      if ((el.textContent || "").trim() === "" && r.width <= 2) continue;

      // A control may extend its target with a pseudo-element rather than by
      // growing — measure that too before calling it small.
      const after = getComputedStyle(el, "::after");
      const pseudoH = after.content !== "none" ? parseFloat(after.height) || 0 : 0;
      const h = Math.max(r.height, pseudoH);
      const w = r.width;
      if (h >= 44 && w >= 44) continue;

      const label = (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 28);
      const key = `${el.tagName}|${label}|${Math.round(w)}x${Math.round(h)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ kind: h < 24 || w < 24 ? "fail" : "note", what: `tap ${key}` });
    }

    const small = new Set();
    for (const el of document.querySelectorAll("p,span,li,div,h1,h2,h3,h4,td,th,a,button")) {
      const hasOwnText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!hasOwnText) continue;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs && fs < 13) small.add(`${fs}px "${el.textContent.trim().slice(0, 26)}"`);
    }
    for (const s of small) out.push({ kind: "note", what: `text ${s}` });

    return out;
  });

  const fails = found.filter((f) => f.kind === "fail");
  const noteList = found.filter((f) => f.kind === "note");
  failures += fails.length;
  notes += noteList.length;
  if (fails.length) {
    console.log(`\nFAIL /ru${route || "/"}`);
    for (const f of fails) console.log(`     ${f.what}`);
  }
  if (noteList.length) {
    console.log(
      `note /ru${route || "/"}  ${noteList.length}: ${noteList
        .slice(0, 4)
        .map((n) => n.what)
        .join(" · ")}`,
    );
  }
}
await browser.close();

console.log(
  failures === 0
    ? `\nqa-touch: ok — nothing under 24px across ${ROUTES.length} routes at 390px (${notes} between 24 and 44)`
    : `\nqa-touch: ${failures} targets under 24px, ${notes} between 24 and 44`,
);
process.exit(failures ? 1 : 0);
