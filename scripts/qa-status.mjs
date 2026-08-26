/**
 * Parameterised routes answer 404 for parameters that do not exist.
 *
 * This gate exists because one of them stopped doing so and nothing noticed.
 * `/{lang}/industries/{slug}` accepts any string, and its guard had been
 * written into `IndustryDetail.meta.ts` as a bare `beforeLoad:` statement —
 * which JavaScript parses as a *label* on a function expression, not an object
 * property. It was never exported and never called. Every unknown slug answered
 * **200** with `industries.<slug>.name` printed raw in the title, which is a
 * soft 404 on an unbounded set of URLs: precisely what Search Console penalises,
 * on a site otherwise built around its SEO.
 *
 * `eslint` had been reporting it as `no-unused-labels` the entire time. Nobody
 * saw it because `bun run lint` took twenty minutes and emitted 197 MB, almost
 * all of it from linting vendored skill packages.
 *
 * Both halves matter here. A gate that only checked the bogus URLs would pass if
 * the whole site started 404ing, so every route is also requested with real
 * parameters and must answer 200.
 *
 * Run: node scripts/qa-status.mjs [baseUrl]
 */
const BASE = process.argv[2] ?? "http://127.0.0.1:4173";

/** [path, expected status, why] */
const CASES = [
  // Real parameters — the control. Without these the gate cannot tell "guards
  // work" from "the server is down".
  ["/ru", 200, "a real locale"],
  ["/ru/industries/construction", 200, "a real industry"],
  ["/ru/radiocom", 200, "a real brand"],
  ["/ru/radiocom/rcd-70", 200, "a real model"],
  ["/ru/radiocom/rcd-70/specs", 200, "a real model's specs"],

  // Parameters that match the route pattern but name nothing.
  ["/ru/industries/not-a-real-industry", 404, "unknown industry slug"],
  ["/ru/industries/../../etc", 404, "unknown industry slug (traversal-shaped)"],
  ["/xx", 404, "unknown locale"],
  ["/ru/notabrand", 404, "unknown brand"],
  ["/ru/radiocom/not-a-model", 404, "unknown model"],
  ["/ru/radiocom/not-a-model/specs", 404, "unknown model's specs"],
  ["/ru/notabrand/rcd-70", 404, "real model under the wrong brand"],
];

let fail = 0;

for (const [path, want, why] of CASES) {
  // `redirect: "manual"` would report the 301s as failures; the locale routes
  // legitimately redirect, and what matters is where a visitor lands.
  let got;
  try {
    got = (await fetch(BASE + path, { redirect: "follow" })).status;
  } catch (e) {
    got = `error: ${e.message}`;
  }
  const ok = got === want;
  if (!ok) fail++;
  console.log(
    `  ${ok ? "ok  " : "FAIL"} ${String(want).padEnd(3)} ${path.padEnd(38)} ${why}` +
      (ok ? "" : `  <- got ${got}`),
  );
}

console.log(
  fail === 0
    ? `\nqa-status: ok — ${CASES.length} routes, every unknown parameter 404s and every real one resolves`
    : `\nqa-status: ${fail} route(s) answered the wrong status`,
);
process.exit(fail ? 1 : 0);
