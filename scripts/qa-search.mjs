/**
 * Proves the catalogue search actually searches.
 *
 * The `SearchAction` on the `WebSite` node tells Google it can query this site
 * at `/ru/search?q=…` and get results. `verify-seo.ts` gate 19 checks that
 * contract statically — the route exists, validates the parameter, renders a
 * `role="search"` form — but static analysis cannot tell whether the page then
 * *uses* the value it validated. A page that parses `q` and renders nothing
 * would pass every gate and make the schema a lie.
 *
 * So this drives the real thing: load the URL Google is told to use, and count
 * the results. Also checks that the query survives into the input (a shared
 * link has to show the reader what was searched) and that all three locales
 * answer, since the catalogue text differs per locale and a search that only
 * works in Russian is a search that works for a third of the audience.
 *
 *   bun scripts/qa-search.mjs [baseUrl]
 */
import { chromium } from "playwright-core";

const BASE = process.argv[2] ?? "http://127.0.0.1:4173";

// Each case: a query, the locale, and how many models must come back at least.
// Deliberately drawn from three different fields — a spec-row value, a tag and
// a model name — so a search that only indexes names cannot pass.
const CASES = [
  { lang: "ru", q: "IP67", min: 3, why: "an ingress rating, which lives in a spec row" },
  { lang: "ru", q: "DMR", min: 2, why: "a standard, which lives in a tag and a spec row" },
  { lang: "ru", q: "RCD-70", min: 1, why: "a model name" },
  { lang: "ru", q: "IP67 DMR", min: 1, why: "two terms — every term must match, not any" },
  { lang: "en", q: "IP67", min: 3, why: "the same rating, in English" },
  { lang: "uz", q: "IP67", min: 3, why: "the same rating, in Uzbek" },
  { lang: "ru", q: "zzzznothing", min: 0, why: "a query that should match nothing" },
];

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

let failures = 0;
for (const c of CASES) {
  const url = `${BASE}/${c.lang}/search?q=${encodeURIComponent(c.q)}`;
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(400);

  const seen = await page.evaluate(() => ({
    results: document.querySelectorAll('[data-stagger] a[href*="/"]').length,
    input: document.querySelector("input[name=q]")?.value ?? "",
    hasForm: !!document.querySelector('form[role="search"]'),
  }));

  const problems = [];
  if (!seen.hasForm) problems.push("no role=search form");
  if (seen.input !== c.q) problems.push(`input shows "${seen.input}", expected "${c.q}"`);
  if (c.min === 0 && seen.results > 0)
    problems.push(`${seen.results} results for a nonsense query`);
  if (c.min > 0 && seen.results < c.min)
    problems.push(`${seen.results} results, expected at least ${c.min}`);

  failures += problems.length;
  console.log(
    `${problems.length ? "FAIL" : "ok  "} /${c.lang}?q=${c.q.padEnd(12)} ${String(seen.results).padStart(2)} results  — ${c.why}` +
      (problems.length ? `\n     ${problems.join("; ")}` : ""),
  );
}
await browser.close();

console.log(
  failures === 0
    ? `\nqa-search: ok — the route the SearchAction advertises returns real results in all three locales`
    : `\nqa-search: ${failures} problems`,
);
process.exit(failures ? 1 : 0);
