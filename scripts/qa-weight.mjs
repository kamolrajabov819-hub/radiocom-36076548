/**
 * Per-route JavaScript weight gate.
 *
 * This exists because of one measurement. Before the route split, every one of
 * the twelve routes fetched **exactly 956.1 KB** of JavaScript — byte-identical,
 * whether you asked for the sitemap or a product page — because TanStack's code
 * splitter was silently lifting nothing. `autoCodeSplitting` was on, the build
 * was green, every other gate passed, and the site shipped its entire page
 * catalogue to anyone who opened any page for months. Nothing noticed.
 *
 * So this gate asserts the two things that were true then and must not become
 * true again:
 *
 *   1. **No route exceeds `CEILING`.** A chrome component that starts importing
 *      `products.ts`, or a page body that leaks back into the entry chunk,
 *      shows up here as a number rather than as a slow site nobody profiles.
 *   2. **The routes are not all identical.** This is the specific signature of
 *      the splitter failing open. A ceiling alone would not catch it — the old
 *      956.1 KB would have passed a generous ceiling quite happily while being
 *      exactly the bug.
 *
 * Sizes are uncompressed, because the preview server does not gzip and a gate
 * that measures different things locally and in CI is worse than no gate. The
 * production numbers are roughly 30% of these.
 *
 * Usage: node scripts/qa-weight.mjs [base-url]
 */
import { chromium } from "playwright-core";

const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const BASE = process.argv[2] ?? "http://localhost:4173";

/**
 * Measured worst route is /ru/industries/construction at ~898 KB; the pre-split
 * failure was 956.1 KB on everything. 930 KB sits above the real maximum with
 * room for a page to grow, and below the number that means the split broke.
 */
const CEILING = 930 * 1024;

/** How close two routes may be before they count as suspiciously identical. */
const IDENTICAL_SLACK = 512;

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
const problems = [];
const totals = [];

for (const route of ROUTES) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const { n, bytes } = await page.evaluate(() => {
    const js = performance.getEntriesByType("resource").filter((e) => /\.js(\?|$)/.test(e.name));
    return { n: js.length, bytes: js.reduce((a, e) => a + (e.decodedBodySize || 0), 0) };
  });
  await page.close();

  totals.push({ route, bytes });
  const over = bytes > CEILING;
  if (over) {
    problems.push(
      `${route}: ${(bytes / 1024).toFixed(1)} KB of JS exceeds the ${(CEILING / 1024).toFixed(0)} KB ceiling`,
    );
  }
  console.log(
    `  ${over ? "FAIL" : "ok  "} ${route.padEnd(30)} ${String(n).padStart(2)} files  ${(bytes / 1024).toFixed(1).padStart(7)} KB`,
  );
}

await browser.close();

// The splitter-failed-open signature: everything the same size.
const spread = Math.max(...totals.map((t) => t.bytes)) - Math.min(...totals.map((t) => t.bytes));
if (spread < IDENTICAL_SLACK) {
  problems.push(
    `every route fetches within ${spread} bytes of the same total — the code splitter is ` +
      `lifting nothing, which is exactly the state this gate was written for`,
  );
}

if (problems.length) {
  console.error(`\nqa-weight: ${problems.length} problem(s)`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

console.log(
  `\nqa-weight: ok — ${ROUTES.length} routes, ` +
    `${(Math.min(...totals.map((t) => t.bytes)) / 1024).toFixed(0)}-${(Math.max(...totals.map((t) => t.bytes)) / 1024).toFixed(0)} KB, ` +
    `${(spread / 1024).toFixed(0)} KB spread between lightest and heaviest`,
);
