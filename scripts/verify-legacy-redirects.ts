/**
 * Every old radiocom.uz URL lands, in one hop, on a page that exists — with the
 * visit's ad parameters intact.
 *
 * When DNS moves from the WordPress site to this build, the old URLs that rank
 * (`/?products_category=pmr&lang=ru` ranks for «купить рацию в Ташкенте") are
 * what search engines and old links will request. Each one has to 301 straight
 * to its replacement: a chain of two redirects dilutes the signal, a redirect
 * to a page that 404s throws it away, and a mass redirect to the home page is
 * read as a soft 404. And a click from an ad must keep its `gclid`/`yclid`
 * through the hop, or the conversion it leads to is unattributable.
 *
 * For every URL in `scripts/fixtures/legacy-urls.txt` this asserts:
 *   1. `resolveLegacy` gives exactly the expected target (or `gone`);
 *   2. the target is a live page — a sitemap path in some locale — so there is
 *      no second hop and no dead end;
 *   3. with ad parameters appended, the mapping does not change, the redirect
 *      carries every marketing segment byte for byte (a 19-digit `yclid`, a
 *      `%20`, Cyrillic), and no WordPress parameter survives.
 *
 * Plus the rule from the brief in its plainest form:
 * `/?gclid=x&utm_source=y` must reach `/ru?gclid=x&utm_source=y`.
 *
 * `--md` prints the decision table for `docs/seo/legacy-redirects.md`.
 *
 * Imports stay lean on purpose — see `verify-contacts.ts` for the Bun
 * transpiler-cache failure that large scripts hit. No `pages/*.meta` here.
 *
 * Run: bun scripts/verify-legacy-redirects.ts [--md]
 */
import { readFileSync } from "node:fs";
import { LANGS, localePath, productPath } from "../src/lib/seo";
import { visibleProducts } from "../src/data/products";
import { entries } from "./lib/sitemap";
import { WORDPRESS_KEYS, resolveLegacy } from "../src/lib/legacy-redirects";
import { isMarketingKey, rewriteLocation } from "../src/lib/marketing-params";

const ORIGIN = "https://radiocom.uz";
const SAMPLE =
  "gclid=Cj0KCQ-T_x&yclid=5034856438827851775&utm_term=%D1%80%D0%B0%D1%86%D0%B8%D1%8F%20motorola&utm_source=ya+direct";
const WP_KEYS = new Set<string>(WORDPRESS_KEYS);

const live = new Set<string>(["/sitemap.xml"]);
for (const e of entries) for (const l of LANGS) live.add(localePath(l, e.path));
// Every visible product page is live, including the red T62/T42 that name a
// blue twin as canonical and so are not in the sitemap: they answer 200, and
// an old «t62-красная» URL belongs on the red page, not the blue one.
for (const p of visibleProducts) for (const l of LANGS) live.add(localePath(l, productPath(p)));

const problems: string[] = [];
const rows: { url: string; target: string }[] = [];

/** What a request for this URL ends up at, as the server would answer it. */
function outcome(url: URL): string {
  const r = resolveLegacy(url);
  if (r === "gone") return "gone";
  if (r === null) return url.pathname === "/" ? "/ru" : "(router)";
  return r.path;
}

const lines = readFileSync("scripts/fixtures/legacy-urls.txt", "utf8")
  .replace(/\r/g, "")
  .split("\n")
  .filter((l) => l.trim() && !l.startsWith("#"));

for (const line of lines) {
  const [raw, expected] = line.split("\t");
  if (!raw || !expected) {
    problems.push(`malformed fixture line: ${JSON.stringify(line)}`);
    continue;
  }
  const got = outcome(new URL(raw, ORIGIN));
  rows.push({ url: raw, target: got });

  if (got !== expected) {
    problems.push(`${raw} → ${got}, expected ${expected}`);
    continue;
  }
  if (got === "gone") continue;

  const pathOnly = got.split("?")[0];
  if (!live.has(pathOnly)) problems.push(`${raw} → ${got}, which is not a live page`);

  const tagged = `${raw}${raw.includes("?") ? "&" : "?"}${SAMPLE}`;
  const taggedGot = outcome(new URL(tagged, ORIGIN));
  if (taggedGot !== got) problems.push(`${raw}: ad parameters changed the target to ${taggedGot}`);

  const location = rewriteLocation(got, ORIGIN + tagged);
  // The fixture URL's own ad parameters first, as written, then the sample.
  const own = (raw.split("?")[1] ?? "")
    .split("&")
    .filter((seg) => isMarketingKey(seg.split("=")[0]));
  const want = `${got}${got.includes("?") ? "&" : "?"}${[...own, SAMPLE].join("&")}`;
  if (location !== want) problems.push(`${raw}: Location ${location}, expected ${want}`);

  const keys = [...new URL(location ?? "/", ORIGIN).searchParams.keys()];
  const leaked = keys.filter((k) => WP_KEYS.has(k));
  if (leaked.length)
    problems.push(`${raw}: WordPress parameter(s) ${leaked} survived the redirect`);
}

// The rule as the brief states it, and the edges of byte-exactness.
const exact: [string, string, string][] = [
  ["/ru", "/?gclid=x&utm_source=y", "/ru?gclid=x&utm_source=y"],
  ["/ru", "/?yclid=5034856438827851775", "/ru?yclid=5034856438827851775"],
  // The router's own (corrupted) copy is replaced, not doubled.
  ["/ru?yclid=5034856438827852000", "/?yclid=5034856438827851775", "/ru?yclid=5034856438827851775"],
  ["/ru/poc", "/poc?utm_term=a+b&utm_content=%D0%B0", "/ru/poc?utm_term=a+b&utm_content=%D0%B0"],
  ["/ru/search?q=rcd", "/?s=rcd&gclid=g", "/ru/search?q=rcd&gclid=g"],
  ["/ru", "/?ysclid=lt8&products=x&lang=ru", "/ru?ysclid=lt8"],
  ["/ru", "/", "/ru"],
];
for (const [location, request, want] of exact) {
  const got = rewriteLocation(location, ORIGIN + request);
  if (got !== want)
    problems.push(`rewriteLocation(${location}, ${request}) = ${got}, expected ${want}`);
}
if (rewriteLocation("https://example.com/x", `${ORIGIN}/?gclid=x`) !== null)
  problems.push("rewriteLocation rewrote a redirect to another origin");

if (process.argv.includes("--md")) {
  console.log("| Old URL | Goes to |\n|---|---|");
  for (const r of rows) {
    const shown = decodeURIComponent(r.url).replace(/\|/g, "\\|");
    console.log(`| \`${shown}\` | ${r.target === "gone" ? "**410 gone**" : `\`${r.target}\``} |`);
  }
  process.exit(problems.length ? 1 : 0);
}

if (problems.length) {
  console.log(`FAIL legacy redirects:\n     ${problems.join("\n     ")}`);
  console.log(`\n${problems.length} FAILURES`);
  process.exit(1);
}
const gone = rows.filter((r) => r.target === "gone").length;
console.log(
  `ok  ${rows.length} legacy URLs: ${rows.length - gone} land on a live page in one hop, ${gone} answer 410`,
);
console.log(`ok  ad parameters survive every redirect byte for byte; no WordPress parameter does`);
console.log("\nALL LEGACY REDIRECT CHECKS PASSED");
