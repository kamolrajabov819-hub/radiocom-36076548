import {
  localeLinks,
  localePath,
  LANGS,
  DEFAULT_SEO_LANG,
  SITE_URL,
  productSchema,
} from "../src/lib/seo";
import { products } from "../src/data/products";
import { readFileSync } from "node:fs";

let fail = 0;
const bad = (m: string) => {
  console.log("FAIL " + m);
  fail++;
};

// 1. Every locale of a page must advertise the identical alternate set (reciprocity).
for (const path of ["/", "/catalog", "/poc", "/catalog/rcd-60"]) {
  const sets = LANGS.map((l) => {
    const links = localeLinks(l, path);
    const canon = links.filter((x) => x.rel === "canonical");
    if (canon.length !== 1) bad(`${l}${path}: expected 1 canonical, got ${canon.length}`);
    if (canon[0]?.href !== `${SITE_URL}${localePath(l, path)}`)
      bad(`${l}${path}: canonical not self-referential`);
    return JSON.stringify(
      links
        .filter((x) => x.rel === "alternate")
        .map((x) => [x.hrefLang, x.href])
        .sort(),
    );
  });
  if (new Set(sets).size !== 1)
    bad(`${path}: locales advertise different alternate sets (cluster will be discarded)`);
  const xd = localeLinks("en", path).find((x) => x.hrefLang === "x-default");
  if (xd?.href !== `${SITE_URL}${localePath(DEFAULT_SEO_LANG, path)}`)
    bad(`${path}: x-default not pointing at ${DEFAULT_SEO_LANG}`);
}
console.log(`ok  hreflang reciprocity + self-canonical across ${LANGS.length} locales`);

// 2. Sitemap: one <loc> per page per locale, each with a full cluster.
const sm = readFileSync("public/sitemap.xml", "utf8");
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (new Set(locs).size !== locs.length) bad("sitemap has duplicate <loc> entries");
for (const l of LANGS) {
  const n = locs.filter((u) => u.startsWith(`${SITE_URL}/${l}`)).length;
  if (n !== locs.length / LANGS.length)
    bad(`sitemap: ${l} has ${n} urls, expected ${locs.length / LANGS.length}`);
}
const clusters = (sm.match(/<url>/g) || []).length;
const alts = (sm.match(/xhtml:link/g) || []).length;
if (alts !== clusters * (LANGS.length + 1))
  bad(
    `sitemap: ${alts} alternates for ${clusters} urls, expected ${clusters * (LANGS.length + 1)}`,
  );
console.log(`ok  sitemap ${locs.length} urls, all unique, ${alts} alternates`);

// 3. Every product still yields valid Product JSON-LD with absolute images.
for (const p of products) {
  const s = JSON.parse(JSON.stringify(productSchema(p, "ru")));
  if (s["@type"] !== "Product" || !s.name || !s.sku || !s.offers) bad(`product ${p.id}`);
  for (const img of s.image) if (!img.startsWith("https://")) bad(`product ${p.id} relative image`);
}
console.log(`ok  ${products.length} products produce valid Product schema`);

// 4. robots + llms
const robots = readFileSync("public/robots.txt", "utf8");
if (!robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) bad("robots.txt missing sitemap");
const llms = readFileSync("public/llms.txt", "utf8");
if ((llms.match(/^- \[/gm) || []).length !== products.length) bad("llms.txt product count drifted");
console.log("ok  robots.txt + llms.txt consistent with catalogue");

// 5. The SSR shell must derive <html lang> from the route, not hardcode it.
//    A literal here ships the wrong language to every crawler on /en and /uz
//    while the page's own hreflang and og:locale say otherwise — the client
//    only corrects it after hydration, which no crawler waits for.
const shell = readFileSync("src/routes/__root.tsx", "utf8");
if (/<html\s+lang=["'][a-z]{2}["']/.test(shell))
  bad("__root.tsx hardcodes <html lang> instead of reading the route locale");
console.log("ok  <html lang> is derived from the route, not hardcoded");

// 6. Product specs must reach the schema as values, not bare labels. A
//    PropertyValue carrying only a name is inert.
const withSpecs = productSchema(products[0], "ru", {
  specs: [{ name: "Standard", value: "DMR" }],
}) as Record<string, { value?: string }[]>;
const props = withSpecs.additionalProperty ?? [];
if (!props.length || props.some((x) => !x.value))
  bad("productSchema additionalProperty entries are missing values");
console.log("ok  Product additionalProperty entries carry values");

console.log(fail === 0 ? "\nALL SEO CHECKS PASSED" : `\n${fail} FAILURES`);
process.exit(fail ? 1 : 0);
