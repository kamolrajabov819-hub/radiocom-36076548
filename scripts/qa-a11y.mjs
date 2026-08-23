/**
 * WCAG 2.2 A/AA scan across every page type, in every locale.
 *
 * Runs axe-core in a real browser rather than through a CDP-managed Chrome,
 * because the sandbox this repo builds in cannot open a debugging port —
 * Playwright's bundled Chromium is already here and is the same engine.
 *
 * **Reduced motion is forced on, and the page is given time to settle.** Both
 * are needed, and the second is easy to miss. Without the preference, roughly
 * 127 of 154 reported "violations" are elements caught mid-fade: axe measures
 * contrast against the composited pixel, so a heading two frames into a 600ms
 * entrance fails a check it passes the moment it lands.
 *
 * But `reducedMotion` only sets the media query, and the site's reduced-motion
 * CSS block collapses *CSS* animation durations — Framer Motion drives opacity
 * from JavaScript, so those entrances still run. Scanning at 400ms reported a
 * red button at #ec565f (3.46:1) that is #e30613 at rest, and a grey pill at
 * 4.41:1 that is black. Both disappeared at 2000ms. WCAG contrast is a property
 * of the page at rest, so that is when to measure it.
 *
 *   bun scripts/qa-a11y.mjs [baseUrl]
 */
import { chromium } from "playwright-core";
import { readFileSync } from "node:fs";
import { globSync } from "node:fs";

const BASE = process.argv[2] ?? "http://127.0.0.1:4173";

// One representative of each page type. Locales differ in text length, which
// is what changes wrapping and therefore contrast against a photograph.
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
  "/search",
  "/sitemap",
];
const LOCALES = ["ru", "en", "uz"];

const axeCandidates = globSync("/root/.npm/_npx/*/node_modules/axe-core/axe.min.js");
if (!axeCandidates.length) {
  console.error("axe-core not found. Run: npx -y @accesslint/cli@latest --version");
  process.exit(1);
}
const axeSource = readFileSync(axeCandidates[0], "utf8");

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
const page = await ctx.newPage();

const byRule = new Map();
let total = 0;

for (const lang of LOCALES) {
  for (const route of ROUTES) {
    await page.goto(`${BASE}/${lang}${route}`, { waitUntil: "domcontentloaded" });
    // See the note above: 2000ms, not 400 — Framer entrances are not CSS
    // animations and outlive the reduced-motion override.
    await page.waitForTimeout(2000);
    await page.addScriptTag({ content: axeSource });
    const result = await page.evaluate(async () => {
      // @ts-expect-error injected
      return await window.axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
        resultTypes: ["violations"],
      });
    });
    for (const v of result.violations) {
      total += v.nodes.length;
      const key = `${v.id} (${v.impact})`;
      const entry = byRule.get(key) ?? { count: 0, help: v.help, where: new Set() };
      entry.count += v.nodes.length;
      for (const n of v.nodes.slice(0, 3))
        entry.where.add(`/${lang}${route || "/"}  ${n.target.join(" ")}`);
      byRule.set(key, entry);
    }
  }
}
await browser.close();

if (!byRule.size) {
  console.log(
    `qa-a11y: ok — no WCAG 2.2 A/AA violations across ${ROUTES.length} routes x ${LOCALES.length} locales`,
  );
  process.exit(0);
}

console.log(`${total} violation instances across ${byRule.size} rules\n`);
for (const [rule, e] of [...byRule].sort((a, b) => b[1].count - a[1].count)) {
  console.log(`${String(e.count).padStart(4)}  ${rule}\n      ${e.help}`);
  for (const w of [...e.where].slice(0, 3)) console.log(`      ${w}`);
}
process.exit(1);
