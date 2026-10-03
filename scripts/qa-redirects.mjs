/**
 * Redirects, over HTTP: the status, and the exact `Location`, for the URLs
 * that matter when radiocom.uz moves to this build.
 *
 * `verify-legacy-redirects.ts` proves the mapping at build time; this proves
 * the server actually answers it — the middleware runs, the router does not
 * get in first, a dead URL says 410 rather than 404 or a redirect home, and
 * ad parameters arrive byte for byte. `qa-status.mjs` cannot see any of this:
 * it follows redirects and checks only where it ends up.
 *
 * Every URL in `scripts/fixtures/legacy-urls.txt` is requested with ad
 * parameters appended, plus the cases below. Also checked: a tagged landing
 * URL answers 200 with a parameter-free canonical, and only clean requests are
 * allowed into the CDN cache.
 *
 * Under the local node-server build there is no Netlify redirect table, so
 * `netlify.toml`'s `/catalog` rules are not exercised here; the router covers
 * the same paths.
 *
 * Usage: node scripts/qa-redirects.mjs [base-url]
 */
import { readFileSync } from "node:fs";

const BASE = process.argv[2] ?? "http://127.0.0.1:4173";
const AD =
  "gclid=QA-g_1&yclid=5034856438827851775&utm_term=%D1%80%D0%B0%D1%86%D0%B8%D1%8F%20motorola";
const problems = [];

const get = (path, init = {}) => fetch(BASE + path, { redirect: "manual", ...init });

// The fixture, every line, tagged.
const lines = readFileSync("scripts/fixtures/legacy-urls.txt", "utf8")
  .replace(/\r/g, "")
  .split("\n")
  .filter((l) => l.trim() && !l.startsWith("#"));
let checked = 0;
for (const line of lines) {
  const [raw, expected] = line.split("\t");
  const tagged = `${raw}${raw.includes("?") ? "&" : "?"}${AD}`;
  const res = await get(tagged);
  checked++;
  if (expected === "gone") {
    if (res.status !== 410) problems.push(`${raw}: ${res.status}, expected 410`);
    continue;
  }
  const location = res.headers.get("location") ?? "";
  const own = (raw.split("?")[1] ?? "")
    .split("&")
    .filter((seg) => /^(utm_[^=]*|gclid|gbraid|wbraid|yclid|fbclid|ysclid)=/i.test(seg));
  const want = `${expected}${expected.includes("?") ? "&" : "?"}${[...own, AD].join("&")}`;
  if (res.status !== 301) problems.push(`${raw}: ${res.status}, expected 301 → ${want}`);
  else if (location !== want) problems.push(`${raw}: Location ${location}, expected ${want}`);
}

// Redirects that are not WordPress's.
const cases = [
  ["/?gclid=x&utm_source=y", 301, "/ru?gclid=x&utm_source=y"],
  ["/?yclid=5034856438827851775", 301, "/ru?yclid=5034856438827851775"],
  ["/poc?utm_source=ig&utm_campaign=spring", 301, "/ru/poc?utm_source=ig&utm_campaign=spring"],
  ["/ru/poc/?yclid=5034856438827851775", 301, "/ru/poc?yclid=5034856438827851775"],
  ["/catalog/rcd-70?gclid=abc", 301, "/ru/radiocom/rcd-70?gclid=abc"],
  ["/industries/horeca?utm_medium=cpc&foo=bar", 301, "/ru/industries/horeca?utm_medium=cpc"],
];
for (const [path, status, location] of cases) {
  const res = await get(path);
  const got = res.headers.get("location");
  if (res.status !== status || got !== location)
    problems.push(`${path}: ${res.status} ${got}, expected ${status} ${location}`);
}

// A tagged landing page: 200, canonical without the parameters, not cached.
{
  const res = await get("/ru/industries/construction?gclid=QA&utm_source=qa");
  const html = await res.text();
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (res.status !== 200) problems.push(`tagged landing: ${res.status}`);
  if (canonical !== "https://radiocom.uz/ru/industries/construction")
    problems.push(`tagged landing: canonical ${canonical}`);
  if (res.headers.get("netlify-cdn-cache-control"))
    problems.push("tagged landing: a request with a query string was allowed into the CDN cache");
}
{
  const res = await get("/ru/industries/construction");
  await res.arrayBuffer();
  if (!res.headers.get("netlify-cdn-cache-control")?.includes("durable"))
    problems.push("clean landing: no Netlify-CDN-Cache-Control");
  if (res.headers.get("netlify-vary") !== "query=q,header=Accept")
    problems.push(`clean landing: Netlify-Vary ${res.headers.get("netlify-vary")}`);
}
for (const path of ["/", "/?products=motorola-am21"]) {
  const res = await get(path);
  if (res.headers.get("netlify-cdn-cache-control"))
    problems.push(`${path}: a ${res.status} was marked cacheable`);
}

if (problems.length) {
  console.log(`qa-redirects: ${problems.length} problem(s)\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(
  `qa-redirects: ok — ${checked} legacy URLs and ${cases.length} other redirects answer as mapped, ` +
    "ad parameters intact; tagged pages stay out of the CDN cache",
);
