/**
 * Acceptance gate for the broken-image fix.
 *
 * Walks every route in all three locales at both device pixel ratios and both
 * the desktop and mobile widths that select different `srcset` candidates, and
 * asserts:
 *   - no <img> ends up with naturalWidth === 0 (the broken state)
 *   - no request under /assets/ returns >= 400
 *   - no page errors
 *
 * DPR 1 at 1440 is the case that was failing: ~630 CSS px of layout picks the
 * 800w candidate, which did not exist. DPR 2 masked it by selecting 1600w.
 *
 * Usage: node scripts/qa-images.mjs http://localhost:4173
 */
import { chromium } from "playwright-core";

const BASE = process.argv[2] ?? "http://localhost:4173";
const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const ROUTES = [
  "",
  "/radiocom",
  "/motorola",
  "/compare",
  "/radiocom/rcd-60",
  "/radiocom/rcd-60/specs",
  "/motorola/t82/specs",
  "/poc",
  "/service",
  "/industries",
  "/industries/horeca",
];
const LOCALES = ["ru", "en", "uz"];
const VIEWPORTS = [
  { width: 390, height: 844, dpr: 2, label: "390@2x" },
  { width: 768, height: 1024, dpr: 1, label: "768@1x" },
  { width: 1440, height: 900, dpr: 1, label: "1440@1x" },
  { width: 1440, height: 900, dpr: 2, label: "1440@2x" },
];

const browser = await chromium.launch({ executablePath: CHROME });
let failures = 0;
let checked = 0;
let imgTotal = 0;

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dpr,
  });
  for (const lang of LOCALES) {
    for (const route of ROUTES) {
      const url = `${BASE}/${lang}${route}`;
      const page = await ctx.newPage();
      const bad = [];
      const errs = [];
      page.on("pageerror", (e) => errs.push(String(e).slice(0, 160)));
      page.on("response", (r) => {
        if (r.status() >= 400 && /\/assets\/|\.(webp|png|jpe?g|avif|svg)$/i.test(r.url())) {
          bad.push(`${r.status()} ${r.url().replace(BASE, "")}`);
        }
      });

      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
      // Scroll the whole page so lazy images actually commit to a candidate.
      await page.evaluate(async () => {
        const step = innerHeight * 0.5;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 90));
        }
        scrollTo(0, 0);
      });
      await page.waitForTimeout(700);

      const broken = await page.evaluate(() =>
        [...document.images]
          .filter((i) => i.complete && i.naturalWidth === 0)
          .map((i) => ({
            src: (i.currentSrc || i.src).split("/").pop(),
            srcset: (i.srcset || "").slice(0, 120),
          })),
      );
      const count = await page.evaluate(() => document.images.length);
      imgTotal += count;
      checked++;

      if (broken.length || bad.length || errs.length) {
        failures++;
        console.log(`\n✗ ${vp.label}  /${lang}${route}`);
        for (const b of broken) console.log(`    broken img: ${b.src}\n      srcset: ${b.srcset}`);
        for (const b of bad) console.log(`    ${b}`);
        for (const e of errs) console.log(`    pageerror: ${e}`);
      }
      await page.close();
    }
  }
  await ctx.close();
  console.log(`  ${vp.label}: done`);
}
await browser.close();

console.log(`\n${checked} page loads, ${imgTotal} <img> elements, ${failures} failing\n`);
process.exit(failures ? 1 : 0);
