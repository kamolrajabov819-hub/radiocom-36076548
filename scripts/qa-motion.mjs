/**
 * Proves the scroll choreography is where it should be — and, just as much,
 * that it is *not* where it should not be.
 *
 * Three things are easy to get wrong here and all three are invisible without
 * a check like this:
 *
 *   1. A page with no motion at all. The choreography is opt-in per page, so
 *      forgetting `useScrollChoreography()` on a new page is silent.
 *   2. A phone downloading GSAP. `gsap.matchMedia()` decides *after* the chunk
 *      arrives, so the desktop gate has to sit in front of the network request
 *      instead. If this ever reports a non-zero count at 390px, 27 KB is being
 *      spent on a device that uses none of it.
 *   3. An element left at `opacity: 0`. `data-stagger` sets its children
 *      invisible and relies on a ScrollTrigger batch to bring them back; if the
 *      trigger never fires, the content is simply gone. That is a blank section
 *      in production and it fails silently in every other test.
 *
 * Also checks that GSAP never loads under `prefers-reduced-motion`, which is
 * the one case where hijacked scrolling is not a preference but a symptom.
 *
 *   bun scripts/qa-motion.mjs [baseUrl]
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

const CASES = [
  { label: "desktop 1440", viewport: { width: 1440, height: 900 }, reduced: false, wantGsap: true },
  { label: "phone 390", viewport: { width: 390, height: 844 }, reduced: false, wantGsap: false },
  {
    label: "reduced motion",
    viewport: { width: 1440, height: 900 },
    reduced: true,
    wantGsap: false,
  },
];

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});

let failures = 0;
for (const c of CASES) {
  console.log(`\n── ${c.label}`);
  for (const route of ROUTES) {
    const ctx = await browser.newContext({
      viewport: c.viewport,
      reducedMotion: c.reduced ? "reduce" : "no-preference",
    });
    const page = await ctx.newPage();
    let gsapRequests = 0;
    page.on("request", (r) => {
      if (/\/assets\/gsap-/.test(r.url())) gsapRequests++;
    });

    await page.goto(`${BASE}/ru${route}`, { waitUntil: "domcontentloaded" });
    await page.evaluate(async () => {
      const step = innerHeight * 0.5;
      for (let y = 0; y < Math.min(document.body.scrollHeight, 12000); y += step) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
    });
    await page.waitForTimeout(900);

    const marks = await page.evaluate(() => ({
      parallax: document.querySelectorAll("[data-parallax]").length,
      stagger: document.querySelectorAll("[data-stagger]").length,
      scrub: document.querySelectorAll("[data-scrub-in]").length,
      invisible: [...document.querySelectorAll("[data-stagger] > *")].filter(
        (el) => Number(getComputedStyle(el).opacity) < 0.05,
      ).length,
    }));

    const problems = [];
    if (c.wantGsap && gsapRequests === 0) problems.push("GSAP never loaded");
    if (!c.wantGsap && gsapRequests > 0)
      problems.push(`GSAP loaded (${gsapRequests}x) but is unused here`);
    if (marks.invisible > 0) problems.push(`${marks.invisible} staggered items stuck invisible`);
    if (c.wantGsap && marks.parallax + marks.stagger + marks.scrub === 0)
      problems.push("no choreography markup on this page at all");

    if (problems.length) failures += problems.length;
    console.log(
      `  ${problems.length ? "FAIL" : "ok  "} ${(route || "/").padEnd(26)}` +
        ` gsap=${gsapRequests} parallax=${marks.parallax} stagger=${marks.stagger} scrub=${marks.scrub}` +
        (problems.length ? `\n         ${problems.join("; ")}` : ""),
    );
    await ctx.close();
  }
}
await browser.close();

console.log(
  failures === 0
    ? `\nqa-motion: ok — choreography on all ${ROUTES.length} desktop routes, zero GSAP on phones or under reduced motion`
    : `\nqa-motion: ${failures} problems`,
);
process.exit(failures ? 1 : 0);
