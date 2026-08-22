/**
 * Console and chunk-loading gate.
 *
 * Two things this catches that `qa-images.mjs` cannot:
 *
 *   1. Runtime errors that leave the page looking fine. A thrown effect, a
 *      failed dynamic import, a hydration mismatch — all render a page that
 *      screenshots correctly and is broken.
 *   2. Whether a code-split chunk actually stayed split. `gsapChunk` reports
 *      whether GSAP was fetched on that route. It must be true on the home
 *      page, which pins its hero, and false everywhere else — a regression to
 *      a static import would silently make it true on all of them, and no
 *      other check would notice.
 *
 * Usage: node scripts/qa-console.mjs <url> [url...]
 * Exits non-zero on any console error or failed request.
 */
import { chromium } from "playwright-core";

const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const urls = process.argv.slice(2);
if (!urls.length) {
  console.error("usage: node scripts/qa-console.mjs <url> [url...]");
  process.exit(2);
}

const browser = await chromium.launch({ executablePath: CHROME });
let bad = 0;

for (const url of urls) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  const errors = [];
  const failed = [];
  // Every image request, so a preload whose candidate set does not match its
  // <img> shows up as the same file fetched twice — the failure mode a
  // mismatched `imagesrcset` produces, which is strictly worse than shipping
  // no preload at all.
  const imageRequests = [];
  page.on("request", (r) => {
    if (r.resourceType() === "image") imageRequests.push(new URL(r.url()).pathname);
  });
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(`PAGEERROR ${e.message}`));
  page.on("requestfailed", (r) => {
    // Third-party hosts only fail here because the sandbox blocks outbound
    // requests — the embedded map is the whole set. Counting those would make
    // this gate red on every run and therefore useless as a gate.
    if (new URL(r.url()).host !== new URL(url).host) return;
    failed.push(`${r.url()} ${r.failure()?.errorText}`);
  });

  const response = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
  const status = response?.status() ?? 0;

  // A 404 route is *supposed* to answer 404, and Chrome logs the document's own
  // non-2xx status as a console error. Counting that would make the 404 page
  // permanently red and the gate unusable on exactly the route whose status
  // code matters most.
  if (status >= 400) {
    const own = `status of ${status}`;
    for (let i = errors.length - 1; i >= 0; i--) {
      if (errors[i].includes("Failed to load resource") && errors[i].includes(own))
        errors.splice(i, 1);
    }
  }
  // Scroll: the deferred chunk is fetched from an effect, and ScrollTrigger
  // only does anything once the page has actually moved.
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(1500);

  const gsapChunk = await page.evaluate(() =>
    performance.getEntriesByType("resource").some((r) => /\/assets\/gsap-[^/]*\.js$/.test(r.name)),
  );

  const seen = new Map();
  for (const p of imageRequests) seen.set(p, (seen.get(p) ?? 0) + 1);
  const doubled = [...seen].filter(([, n]) => n > 1);

  const label = url.replace(/^https?:\/\/[^/]+/, "") || "/";
  console.log(
    `${label.padEnd(36)} http=${status} errors=${errors.length} failedReq=${failed.length} ` +
      `gsapChunk=${gsapChunk} doubleFetched=${doubled.length}`,
  );
  for (const [p, n] of doubled.slice(0, 4)) console.log(`    DUP x${n} ${p}`);
  for (const e of errors.slice(0, 4)) console.log(`    ERR ${e.slice(0, 200)}`);
  for (const f of failed.slice(0, 4)) console.log(`    REQ ${f.slice(0, 200)}`);

  bad += errors.length + failed.length + doubled.length;
  await ctx.close();
}

await browser.close();
console.log(bad ? `\n${bad} problem(s)` : "\nclean");
process.exit(bad ? 1 : 0);
