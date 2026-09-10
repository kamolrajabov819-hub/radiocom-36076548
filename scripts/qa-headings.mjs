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
  "/ru/answers",
  "/ru/answers/how-to-choose",
  "/ru/sitemap",
  "/ru/search",
  "/ru/search?q=RCD",
];

const browser = await chromium.launch({ executablePath: CHROME });
const problems = [];

for (const route of ROUTES) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  const { levels, h1s } = await page.evaluate(() => {
    const all = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")];
    return {
      levels: all.map((e) => Number(e.tagName[1])),
      h1s: all.filter((e) => e.tagName === "H1").map((e) => e.textContent.trim().slice(0, 40)),
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

  const counts = [1, 2, 3].map((n) => `h${n}:${levels.filter((l) => l === n).length}`).join(" ");
  console.log(
    `  ${h1s.length === 1 && !skips.length ? "ok  " : "FAIL"} ${route.padEnd(30)} ${counts}`,
  );
}

await browser.close();

if (problems.length) {
  console.error(`\nqa-headings: ${problems.length} problem(s)`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`\nqa-headings: ok — ${ROUTES.length} routes, one h1 each, no skipped levels`);
