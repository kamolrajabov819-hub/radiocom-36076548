/**
 * A class that reaches the DOM has the rule `styles.css` declares for it.
 *
 * Tailwind v4 generates an `@utility` only when it finds that class name as
 * **literal text** in a file it scans. A class assembled at runtime —
 * `` `band-${band}` `` — is invisible to it, so the rule is silently dropped.
 * Silently is the whole problem: the build succeeds, the class still lands on
 * the element, and the element renders with the declaration missing.
 *
 * `Section.tsx` composed its band class exactly that way. Three of the four
 * bands survived by luck, each spelled out somewhere else in the source;
 * `band-dark` was not, so `.band-dark { background: #000 }` was never emitted —
 * while the hand-written `.band-dark .pill-link { color: #f5f5f7 }` beside it,
 * ordinary CSS rather than a utility, was. The one `band="dark"` section on the
 * site is the closing call to action on the industry pages, and it shipped as a
 * blank white band: a `text-white` heading on no background, an invisible
 * subtitle, and a near-white link on white at 1.09:1. Six industries times
 * three locales.
 *
 * **Why this check has to run against the DOM.** Two cheaper versions do not
 * work, and both look like they would:
 *
 *   - Requiring every declared `@utility` to be emitted fails on the ones
 *     nothing uses. Tailwind is right not to emit those, and this repo has
 *     several.
 *   - Looking for the class as literal text in the built JS misses the bug
 *     exactly when it matters. Before the fix, `band-dark` was not literal text
 *     anywhere — that is what caused it.
 *
 * What separates the two cases is whether the class actually reaches an
 * element. So: collect the classes the rendered pages really carry, intersect
 * with what `styles.css` declares, and require a rule for each survivor.
 *
 *   node scripts/qa-css.mjs [baseUrl]
 */
import { chromium } from "playwright-core";
import { readFileSync, readdirSync } from "node:fs";
import { findPublicDir } from "./lib/output-dir.ts";

const BASE = process.argv[2] ?? "http://127.0.0.1:4173";
const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const declared = new Set(
  [...readFileSync("src/styles.css", "utf8").matchAll(/@utility\s+([a-zA-Z0-9_-]+)\s*\{/g)].map(
    (m) => m[1],
  ),
);
if (!declared.size) {
  console.error("qa-css: no @utility declarations found in src/styles.css — has the file moved?");
  process.exit(2);
}

/**
 * The most recent build only — never every candidate directory concatenated.
 *
 * This repo builds under two presets back to back, so `.output/public` and
 * `dist` both exist and one of them is stale. Reading both together would let a
 * rule that survives in the old sheet vouch for a new build that dropped it,
 * which is precisely the failure this file exists to catch.
 */
const publicDir = await findPublicDir();
if (!publicDir) {
  console.error("qa-css: no built output directory found — build first.");
  process.exit(2);
}
// `readdirSync`, not `globSync`: bun and node disagree about the latter's
// pattern handling, and this file runs under bun. It returned an empty list
// under bun for a directory that plainly held the stylesheet.
const sheets = readdirSync(`${publicDir}/assets`)
  .filter((f) => f.endsWith(".css"))
  .map((f) => `${publicDir}/assets/${f}`);
if (!sheets.length) {
  console.error(`qa-css: no stylesheet in ${publicDir}/assets — build first.`);
  process.exit(2);
}
const css = sheets.map((f) => readFileSync(f, "utf8")).join("\n");

/**
 * The utility's own rule, not a descendant of it.
 *
 * The distinction is the point: `.band-dark .pill-link{…}` existed for the
 * whole life of the bug, so a check that merely greps the class name would have
 * reported the missing rule as present.
 */
const hasRule = (name) => new RegExp(`\\.${name}(?![-\\w])\\s*[,{]`).test(css);

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
];

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const seen = new Map(); // class -> first route it appeared on

for (const route of ROUTES) {
  await page.goto(BASE + route, { waitUntil: "domcontentloaded" });
  const classes = await page.evaluate(() => {
    const out = new Set();
    for (const el of document.querySelectorAll("*")) for (const c of el.classList) out.add(c);
    return [...out];
  });
  for (const c of classes) if (declared.has(c) && !seen.has(c)) seen.set(c, route);
}
await browser.close();

const broken = [...seen].filter(([c]) => !hasRule(c));

console.log(
  `  ${broken.length ? "FAIL" : "ok  "} ${seen.size} of ${declared.size} declared utilities reach the DOM` +
    `; ${seen.size - broken.length} have their rule`,
);

if (broken.length) {
  console.error(`\nqa-css: ${broken.length} class(es) render without the rule styles.css declares`);
  for (const [c, route] of broken) {
    console.error(`  - .${c}  (on ${route}) — declared @utility, absent from the built CSS`);
  }
  console.error(
    "\n  Tailwind emits a utility only for class names it finds spelled out in the\n" +
      "  source it scans, so something is composing this one at runtime —\n" +
      "  `className={`prefix-${value}`}` or similar. Write the names out in full\n" +
      "  (a literal lookup map) so the scanner can see them.",
  );
  process.exit(1);
}

console.log(
  `\nqa-css: ok — every utility that reaches the DOM across ${ROUTES.length} routes has its rule`,
);
