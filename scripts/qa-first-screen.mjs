/**
 * First-screen gate: what a visitor sees before — or without — JavaScript.
 *
 * Framer Motion renders `initial={{ opacity: 0 }}` into the server HTML, so a
 * hero built from it arrives invisible and stays that way until the bundle has
 * downloaded and hydrated. On the ad landing pages that meant FCP 6.5 s and
 * LCP 8.3 s on a throttled phone, and with scripts off, a page with no
 * heading, no offer and no button. The counters had the same fault in another
 * form: they rendered «0+ моделей · 0 лет на рынке» until they scrolled into
 * view. None of this shows in a screenshot taken after hydration, which is why
 * it shipped.
 *
 * Two states, on every ad landing page:
 *   pre-hydration  JavaScript on, every script bundle blocked — the first
 *                  seconds on a slow phone. The strict one: the `<noscript>`
 *                  safety net in `__root.tsx` does not apply, so a hero that
 *                  still starts at `opacity: 0` fails here.
 *   no-js          JavaScript off entirely.
 *
 * In both, this checks:
 *   1. the h1 is there and is painted (computed opacity 1 on it and every
 *      ancestor);
 *   2. the first call to action on the first screen — the first button or
 *      pill link after the h1, inside the viewport — is painted too;
 *   3. the primary phone number is in the page as a `tel:` link;
 *   4. on the home page, the counters say 35+, 10 000+ and the years trading,
 *      not 0.
 *
 * Usage: node scripts/qa-first-screen.mjs [base-url]
 */
import { chromium } from "playwright-core";

const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const BASE = process.argv[2] ?? "http://127.0.0.1:4173";
const PHONE = "tel:+998933890710";

const ROUTES = [
  "/ru",
  "/uz",
  "/en",
  "/ru/radiocom",
  "/ru/motorola",
  "/ru/poc",
  "/ru/service",
  "/ru/industries",
  "/ru/industries/horeca",
  "/ru/industries/construction",
  "/uz/industries/security",
  "/ru/radiocom/rcd-70/specs",
  "/ru/answers/how-to-choose",
];

const browser = await chromium.launch({ executablePath: CHROME });
const problems = [];

for (const route of ROUTES) {
  for (const [mode, viewport] of [
    ["pre-hydration", { width: 390, height: 844 }],
    ["pre-hydration", { width: 1440, height: 900 }],
    ["no-js", { width: 390, height: 844 }],
  ]) {
    const ctx = await browser.newContext({ javaScriptEnabled: mode !== "no-js", viewport });
    const page = await ctx.newPage();
    if (mode === "pre-hydration") {
      await page.route(
        (url) => /\.m?js(?:$|\?)/.test(url.pathname),
        (r) => r.abort(),
      );
    }
    const res = await page.goto(BASE + route, { waitUntil: "load" });
    const r = await page.evaluate((phone) => {
      const painted = (el) => {
        for (let n = el; n; n = n.parentElement) {
          if (Number(getComputedStyle(n).opacity) < 0.99) return false;
        }
        return true;
      };
      const h1 = document.querySelector("h1");
      // The first call to action on the first screen: after the h1 in the
      // source, and inside the viewport. Below the fold, content may wait for
      // its scroll reveal — that is not what this gate is about.
      const after = h1
        ? [...document.querySelectorAll("button, a.pill, a.pill-link")].find(
            (el) =>
              h1.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING &&
              el.getBoundingClientRect().top < window.innerHeight,
          )
        : null;
      return {
        h1: h1 ? h1.textContent.trim().slice(0, 50) : null,
        h1Painted: h1 ? painted(h1) : false,
        cta: after ? after.textContent.trim().slice(0, 30) : null,
        ctaPainted: after ? painted(after) : false,
        phone: Boolean(document.querySelector(`a[href="${phone}"]`)),
        counters: [...document.querySelectorAll(".type-title")]
          .map((el) => el.textContent.replace(/\s+/g, " ").trim())
          .filter((s) => /^\d/.test(s)),
      };
    }, PHONE);
    await ctx.close();

    const where = `${route} @${viewport.width} ${mode}`;
    if (res?.status() !== 200) problems.push(`${where}: HTTP ${res?.status()}`);
    if (!r.h1) problems.push(`${where}: no h1 in the server HTML`);
    else if (!r.h1Painted) problems.push(`${where}: h1 «${r.h1}» is not painted without JS`);
    // A page with no call to action on its first screen (the industries
    // index opens on a heading and a grid of links) is not a failure here.
    if (r.cta && !r.ctaPainted) problems.push(`${where}: CTA «${r.cta}» is not painted without JS`);
    if (!r.phone) problems.push(`${where}: no ${PHONE} link`);
    if (/^\/(ru|uz|en)$/.test(route)) {
      if (r.counters.length < 3) problems.push(`${where}: expected 3 counters, saw ${r.counters}`);
      for (const c of r.counters) {
        if (/^0\b/.test(c)) problems.push(`${where}: a counter renders «${c}»`);
      }
    }
    console.log(
      `${where.padEnd(50)} h1=${r.h1Painted ? "painted" : "HIDDEN"} cta=${r.ctaPainted ? "painted" : "HIDDEN"}` +
        (r.counters.length ? ` counters=${r.counters.join(" | ")}` : ""),
    );
  }
}

await browser.close();
if (problems.length) {
  console.log(`\nqa-first-screen: ${problems.length} problem(s)\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(
  `\nqa-first-screen: ok — ${ROUTES.length} routes readable before hydration and without JavaScript`,
);
