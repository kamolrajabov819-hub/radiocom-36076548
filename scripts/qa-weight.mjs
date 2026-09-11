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
 * So this gate asserts three things, in descending order of how much each one
 * actually tells you:
 *
 *   1. **The eager baseline stays under `BASELINE_CEILING`.** What the lightest
 *      route fetches is what every visitor pays before the page they asked for.
 *      A chrome component that starts importing `products.ts`, or a page body
 *      that leaks back into the entry chunk, moves this number and nothing else.
 *   2. **The routes are not all identical.** The specific signature of the
 *      splitter failing open. A ceiling alone would not catch it — the old
 *      956.1 KB would have passed a generous ceiling quite happily while being
 *      exactly the bug.
 *   3. **No route exceeds `CEILING`.** A coarse backstop. It cannot tell a leak
 *      from a page that legitimately carries its own content, which is why it is
 *      third rather than first: it spent this branch failing on a new section
 *      that was behaving correctly while the real leak, on another commit, sat
 *      just under it.
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
 * The eager baseline: what the *lightest* route fetches.
 *
 * This is the sharp instrument, and it was added after the per-route ceiling
 * below turned out to be a blunt one. Every route pays this — it is the entry
 * chunk plus the site chrome — so it moves only when something enters the eager
 * path, and it does not move when a new page arrives carrying its own chunk.
 * That is exactly the distinction the ceiling cannot draw.
 *
 * It has already earned itself once, retroactively. The answers section's route
 * guard imported the full data module, and route files are eager, so 39.5 KB of
 * body copy sat in the entry chunk serving every visitor on every page. The
 * ceiling caught that only because the site happened to be near it; this catches
 * it directly and says why.
 *
 * Both numbers are measured, not estimated. The lightest route is /ru/industries
 * at 859.5 KB (842.3 KB on main, before the answers section). Reintroducing the
 * leak deliberately and rebuilding puts it at 896.8 KB, so 880 KB sits above
 * healthy and below broken with roughly 20 KB either side.
 */
const BASELINE_CEILING = 880 * 1024;

/**
 * The per-route maximum. A coarse backstop — see `BASELINE_CEILING` for the
 * check that actually detects a leak.
 *
 * Raised from 930 KB, and the reason is worth writing down because "the gate
 * failed so I raised the gate" is usually the wrong move.
 *
 * The old value carried two anchors, and both went stale. It was set when the
 * worst route measured 898 KB, and it was held below 956.1 KB because that was
 * the number every route fetched when the splitter failed open. Measuring `main`
 * at 765868d today: the worst route is 924.3 KB, so normal growth had eaten 26
 * of the 32 KB of headroom before this branch added anything, and the ceiling
 * had quietly become a tripwire on any new eager byte rather than a leak
 * detector. The 956.1 KB anchor is stale in the other direction: the site now
 * ships 1258 KB of JS in total, so a splitter failing open today would read
 * ~1258 KB per route, not 956.1.
 *
 * Measured maximum on this branch is 943.9 KB (/ru/answers/how-to-choose, which
 * carries its own 43 KB of body copy — the section adds a flat 17.2 KB to every
 * other route). 970 KB sits above that with room for a page to grow, and far
 * below what a broken split would produce. The spread check below catches that
 * failure directly in any case, independent of this number.
 */
const CEILING = 970 * 1024;

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
  "/ru/answers",
  "/ru/answers/how-to-choose",
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

// The eager baseline. The lightest route is the closest thing to "what every
// visitor pays before the page they asked for", so it is the one number that
// rises when something leaks into the entry chunk and stays flat when a new
// page brings its own weight.
const lightest = totals.reduce((a, b) => (b.bytes < a.bytes ? b : a));
if (lightest.bytes > BASELINE_CEILING) {
  problems.push(
    `the eager baseline is ${(lightest.bytes / 1024).toFixed(1)} KB (lightest route ` +
      `${lightest.route}), over the ${(BASELINE_CEILING / 1024).toFixed(0)} KB baseline ceiling. ` +
      `Every route pays this, so something has entered the eager path — most likely a route ` +
      `file or a .meta.ts importing a data module it only needs on one page.`,
  );
}

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
    `${(spread / 1024).toFixed(0)} KB spread between lightest and heaviest\n` +
    // Printed on success on purpose: the baseline is the number that matters,
    // and a gate that only speaks when it fails lets it drift a kilobyte a
    // commit until the day it fails all at once with no history to read.
    `           eager baseline ${(lightest.bytes / 1024).toFixed(1)} KB of ` +
    `${(BASELINE_CEILING / 1024).toFixed(0)} KB, heaviest ` +
    `${(Math.max(...totals.map((t) => t.bytes)) / 1024).toFixed(1)} KB of ${(CEILING / 1024).toFixed(0)} KB`,
);
