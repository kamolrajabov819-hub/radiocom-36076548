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
 * And, since phones were given their own choreography, the harder half of that
 * bargain: at 390px the reveal must *actually play* while the GSAP count stays
 * at zero. Either half alone is a regression waiting to happen — motion that
 * quietly costs 27 KB, or an optimisation that quietly costs the motion. The
 * `revealed` column is what makes the first visible and `gsap=0` the second.
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
  "/sitemap",
  "/search?q=RCD",
];

const CASES = [
  {
    label: "desktop 1440",
    viewport: { width: 1440, height: 900 },
    reduced: false,
    wantGsap: true,
    wantPhoneReveal: false,
  },
  {
    label: "phone 390",
    viewport: { width: 390, height: 844 },
    reduced: false,
    wantGsap: false,
    wantPhoneReveal: true,
  },
  {
    label: "reduced motion 1440",
    viewport: { width: 1440, height: 900 },
    reduced: true,
    wantGsap: false,
    wantPhoneReveal: false,
  },
  {
    // The phone layer has its own reduced-motion bail, separate from the one in
    // front of `loadGsap`, so it needs its own row here.
    label: "reduced motion 390",
    viewport: { width: 390, height: 844 },
    reduced: true,
    wantGsap: false,
    wantPhoneReveal: false,
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
      // `Section` marks its shell with this by default, so it is the bulk of
      // the phone layer's coverage and has to count as choreography markup.
      // Without it a page built entirely from `Section`s reads as unmarked.
      declared: document.querySelectorAll("[data-reveal]").length,
      // Anything the phone layer marked, and how much of it has played. A
      // `.reveal` that never gains `.is-in` is content the reader cannot see.
      reveal: document.querySelectorAll(".reveal").length,
      revealed: document.querySelectorAll(".reveal.is-in").length,
      invisible: [
        ...document.querySelectorAll("[data-stagger] > *, [data-scrub-in], .reveal"),
      ].filter((el) => Number(getComputedStyle(el).opacity) < 0.05).length,
    }));

    const problems = [];
    if (c.wantGsap && gsapRequests === 0) problems.push("GSAP never loaded");
    if (!c.wantGsap && gsapRequests > 0)
      problems.push(`GSAP loaded (${gsapRequests}x) but is unused here`);
    if (marks.invisible > 0) problems.push(`${marks.invisible} animated items stuck invisible`);
    if (marks.parallax + marks.stagger + marks.scrub + marks.declared === 0)
      problems.push("no choreography markup on this page at all");

    const marked = marks.stagger + marks.scrub + marks.declared;
    if (c.wantPhoneReveal) {
      // Only assert a reveal where there is something to reveal: `data-parallax`
      // alone is handled entirely in CSS and produces no `.reveal` nodes.
      // A page can legitimately mark nothing: if every marked block sits above
      // the fold the layer skips it on purpose (see the LCP note in motion.ts),
      // and a section can opt out with `reveal={false}` where its own children
      // already animate. So this only fails when there is markup *below* the
      // fold that produced no reveal at all.
      const belowFold = await page.evaluate(
        () =>
          [...document.querySelectorAll("[data-reveal], [data-scrub-in], [data-stagger]")].filter(
            (el) => el.getBoundingClientRect().top + scrollY > innerHeight,
          ).length,
      );
      if (marked > 0 && belowFold > 0 && marks.reveal === 0)
        problems.push(`${belowFold} blocks below the fold but none revealed`);
      if (marks.reveal > 0 && marks.revealed === 0)
        problems.push(`${marks.reveal} elements marked but none played`);
    } else if (marks.reveal > 0) {
      problems.push(`phone reveal ran where it should not (${marks.reveal} elements)`);
    }

    if (problems.length) failures += problems.length;
    console.log(
      `  ${problems.length ? "FAIL" : "ok  "} ${(route || "/").padEnd(26)}` +
        ` gsap=${gsapRequests} parallax=${marks.parallax} stagger=${marks.stagger}` +
        ` scrub=${marks.scrub} declared=${marks.declared}` +
        ` revealed=${marks.revealed}/${marks.reveal}` +
        (problems.length ? `\n         ${problems.join("; ")}` : ""),
    );
    await ctx.close();
  }
}
await browser.close();

console.log(
  failures === 0
    ? `\nqa-motion: ok — choreography on all ${ROUTES.length} routes at both sizes, zero GSAP on phones or under reduced motion`
    : `\nqa-motion: ${failures} problems`,
);
process.exit(failures ? 1 : 0);
