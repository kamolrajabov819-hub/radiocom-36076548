import {
  localeLinks,
  localePath,
  LANGS,
  DEFAULT_SEO_LANG,
  SITE_URL,
  brandPath,
  collectionPageSchema,
  faqSchema,
  preloadImage,
  productSchema,
  productSpecsPath,
  jsonLd,
} from "../src/lib/seo";
// `visibleProducts` is what the site advertises; `products` is the full
// record, which stays larger because hidden models keep their /catalog 301s.
import { products, productsOfBrand, visibleProducts } from "../src/data/products";
import { entries } from "./lib/sitemap";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

let fail = 0;
const bad = (m: string) => {
  console.log("FAIL " + m);
  fail++;
};

// 1. Every locale of a page must advertise the identical alternate set (reciprocity).
for (const path of ["/", "/radiocom", "/poc", "/radiocom/rcd-60", "/radiocom/rcd-60/specs"]) {
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
console.log(
  `ok  ${products.length} products produce valid Product schema (${visibleProducts.length} visible)`,
);

// 4. robots + llms
const robots = readFileSync("public/robots.txt", "utf8");
if (!robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) bad("robots.txt missing sitemap");
const llms = readFileSync("public/llms.txt", "utf8");
if ((llms.match(/^- \[/gm) || []).length !== visibleProducts.length)
  bad("llms.txt product count drifted");
// Each locale's llms.txt must carry the whole catalogue in that language, or
// an answer engine asked in Uzbek gets a Russian answer or none at all.
for (const l of LANGS) {
  const f = l === "ru" ? "public/llms.txt" : `public/llms.${l}.txt`;
  const text = readFileSync(f, "utf8");
  if ((text.match(/^- \[/gm) || []).length !== visibleProducts.length)
    bad(`${f} product count drifted`);
  if (!text.includes(`${SITE_URL}/${l}/radiocom/`) && !text.includes(`${SITE_URL}/${l}/motorola/`))
    bad(`${f} links the wrong locale`);
}
console.log(`ok  robots.txt + llms.txt (x${LANGS.length}) consistent with catalogue`);

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

// 7. JSON-LD must render as a typed <script>, not as executable JavaScript.
//    TanStack's <Scripts> maps each head().scripts entry with
//    `({ children, ...script }) => ({ tag: "script", attrs: { ...script } })`,
//    spreading every non-`children` key straight onto the element. A nested
//    `{ attrs: { type } }` therefore emits `attrs="[object Object]"` and never
//    sets the type — at which point the browser executes the JSON as JS
//    (`SyntaxError: Unexpected token ':'`) and crawlers see no structured data
//    at all. This shipped. Assert the flat shape so it cannot come back.
const ld = jsonLd({ "@type": "Thing" }) as Record<string, unknown>;
if (ld.type !== "application/ld+json")
  bad('jsonLd() must set a top-level `type: "application/ld+json"`');
if ("attrs" in ld) bad("jsonLd() must be flat — a nested `attrs` renders as a literal attribute");
if (typeof ld.children !== "string") bad("jsonLd() must carry the payload as a `children` string");
console.log("ok  jsonLd() emits a flat, correctly typed ld+json script tag");

// 8. Nothing may still point at /catalog.
//    The route is gone and only exists as a 301. A surviving internal link
//    would send a reader — and a crawler — through a redirect on every visit,
//    which is exactly the crawl waste the migration was meant to remove. This
//    walks the actual files rather than trusting that every reference was
//    found by hand.
//
//    `src/routes/**` and `scripts/generate-seo.ts` are exempt: the redirect
//    routes are *supposed* to name the old path, and this file has to name it
//    to test for it.
{
  const offenders: string[] = [];
  const skip = /node_modules|routeTree\.gen\.ts|\/routes\/|generate-seo\.ts|verify-seo\.ts/;
  const walk = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name);
      if (skip.test(full)) continue;
      if (e.isDirectory()) walk(full);
      else if (/\.(ts|tsx|json|txt|xml|toml)$/.test(e.name)) {
        const raw = readFileSync(full, "utf8");
        // Comments are stripped first. Several files explain *why* /catalog is
        // gone, and a gate that cannot tell an explanation from a live link
        // would force those comments to be deleted — losing the reasoning to
        // satisfy a lint.
        //
        // `src/assets/catalog/` is exempt separately: that is a directory of
        // product photographs that happens to share the name, not a route.
        const text = raw
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/(^|[^:])\/\/.*$/gm, "$1")
          .replace(/assets\/catalog\//g, "");
        for (const m of text.matchAll(/\/catalog(?=["'`/\s<)]|$)/g)) {
          const line = raw.slice(0, m.index).split("\n").length;
          offenders.push(`${full}:~${line}`);
        }
      }
    }
  };
  for (const root of ["src", "public"]) walk(root);
  if (offenders.length)
    bad(
      `/catalog still referenced in ${offenders.length} place(s):\n     ${offenders.join("\n     ")}`,
    );
  else console.log("ok  no /catalog path survives in src/ or public/");
}

/* ─────────────────────────────────────────────────────────────
   Phase C gates. Every assertion below covers something added
   for search that has no visible symptom when it breaks — a
   missing Offer field, a preload that stopped matching its
   <img>, a speakable selector pointing at markup that was
   renamed. All of it would ship silently without these.
   ───────────────────────────────────────────────────────────── */

// 9. Offer completeness. Google drops a merchant rich result whose price has no
//    validity window, and shipping and returns cannot be inferred from prose.
{
  const priced = visibleProducts.filter((p) => p.price != null);
  if (!priced.length) bad("no priced products — Offer gate cannot run");

  const problems: string[] = [];
  for (const p of priced) {
    const schema = productSchema(p, "ru") as {
      offers: Record<string, unknown>;
      subjectOf?: { url?: string };
    };
    const o = schema.offers;

    if (typeof o.priceValidUntil !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(o.priceValidUntil))
      problems.push(`${p.id}: priceValidUntil missing or not YYYY-MM-DD`);
    // A date already in the past reads to Google as a stale price and
    // suppresses the result — the exact failure a hardcoded date would cause.
    else if (o.priceValidUntil <= new Date().toISOString().slice(0, 10))
      problems.push(`${p.id}: priceValidUntil ${o.priceValidUntil} is not in the future`);

    if (!o.shippingDetails) problems.push(`${p.id}: no shippingDetails`);
    if (!o.hasMerchantReturnPolicy) problems.push(`${p.id}: no hasMerchantReturnPolicy`);
    if (o.priceCurrency !== "UZS") problems.push(`${p.id}: priceCurrency is not UZS`);
    if (!schema.subjectOf?.url?.includes(productSpecsPath(p)))
      problems.push(`${p.id}: subjectOf does not point at the specs page`);
  }

  // No aggregateRating or review anywhere. There are no real reviews; emitting
  // either is a Google policy violation and invented data.
  const anySchema = JSON.stringify(productSchema(visibleProducts[0], "ru"));
  if (/aggregateRating|"review"/.test(anySchema))
    problems.push("Product schema carries rating or review markup with no real reviews behind it");

  if (problems.length) bad(`Offer/Product schema incomplete:\n     ${problems.join("\n     ")}`);
  else
    console.log(
      `ok  ${priced.length} priced Offers carry validity, shipping, returns and no fake ratings`,
    );
}

// 10. AggregateOffer bounds must come from the products actually on the page.
{
  const problems: string[] = [];
  for (const brandSlug of ["radiocom", "motorola"] as const) {
    const list = productsOfBrand(brandSlug);
    const page = collectionPageSchema({
      items: list,
      lang: "ru",
      path: brandPath(brandSlug),
      name: brandSlug,
      description: "d",
    }) as {
      offers?: { lowPrice: number; highPrice: number; offerCount: number };
      mainEntity: { numberOfItems: number };
    };
    const prices = list.map((p) => p.price).filter((n): n is number => n != null);

    if (!page.offers) problems.push(`${brandSlug}: no AggregateOffer`);
    else {
      if (page.offers.lowPrice !== Math.min(...prices))
        problems.push(`${brandSlug}: lowPrice ${page.offers.lowPrice} != ${Math.min(...prices)}`);
      if (page.offers.highPrice !== Math.max(...prices))
        problems.push(`${brandSlug}: highPrice ${page.offers.highPrice} != ${Math.max(...prices)}`);
    }
    if (page.mainEntity.numberOfItems !== list.length)
      problems.push(`${brandSlug}: numberOfItems != ${list.length}`);
    // A hidden model must never leak into a brand page's price range.
    if (list.some((p) => p.hidden)) problems.push(`${brandSlug}: a hidden model is in the list`);
  }
  if (problems.length)
    bad(`CollectionPage/AggregateOffer wrong:\n     ${problems.join("\n     ")}`);
  else console.log("ok  both brand pages emit CollectionPage with a correct AggregateOffer");
}

// 11. `speakable` selectors must match markup that actually exists. A rename in
//     Faq.tsx would otherwise leave an assistant reading the nav aloud.
{
  const faqSrc = readFileSync("src/components/Faq.tsx", "utf8");
  const schema = faqSchema([{ q: "q", a: "a" }], "ru") as {
    speakable?: { cssSelector?: string[] };
  };
  const selectors = schema.speakable?.cssSelector ?? [];
  if (!selectors.length) bad("faqSchema emits no speakable selectors");

  const attrs = [
    ...new Set(selectors.flatMap((sel) => [...sel.matchAll(/\[([\w-]+)\]/g)].map((m) => m[1]))),
  ];
  const missing = attrs.filter((a) => !new RegExp(`\\b${a}\\b`).test(faqSrc));
  if (missing.length)
    bad(`speakable selectors reference attributes absent from Faq.tsx: ${missing.join(", ")}`);
  else console.log(`ok  speakable selectors resolve to real markup (${attrs.join(", ")})`);
}

// 12. A preload must carry the same candidate set as the <img> that consumes
//     it. When it does not, the browser fetches the image twice — strictly
//     worse than no preload, and invisible in every screenshot.
{
  const p = visibleProducts.find((x) => x.imageSmall);
  if (!p) bad("no product with an imageSmall — preload gate cannot run");
  else {
    const tag = preloadImage({ src: p.image, small: p.imageSmall });
    const problems: string[] = [];
    if (tag.rel !== "preload" || tag.as !== "image") problems.push("not a rel=preload as=image");
    if (tag.fetchPriority !== "high") problems.push("fetchPriority is not high");
    // Absolute URLs are the bug this gate exists for: they resolve to the same
    // bytes but are a different candidate string from the <img>'s.
    for (const [k, v] of Object.entries(tag)) {
      if (typeof v === "string" && /^https?:\/\//.test(v))
        problems.push(`${k} is absolute — must match the <img>'s relative path`);
    }
    if (tag.imageSrcSet !== `${p.imageSmall} 800w, ${p.image} 1600w`)
      problems.push("imageSrcSet does not match the ProductShot src/srcSmall contract");
    if (!tag.imageSizes) problems.push("imageSizes missing — required alongside imageSrcSet");

    if (problems.length) bad(`preloadImage wrong:\n     ${problems.join("\n     ")}`);
    else console.log("ok  LCP preload is relative and matches the <img> candidate set");
  }
}

// 13. The image sitemap is written post-build by finalize-sitemap.ts, so what
//     this can check is that the wiring is in place — the build step exists and
//     the entries carry source images for it to resolve.
{
  const pkg = JSON.parse(readFileSync("package.json", "utf8")) as {
    scripts: Record<string, string>;
  };
  const problems: string[] = [];
  if (!pkg.scripts.build.includes("finalize-sitemap"))
    problems.push("package.json build does not run scripts/finalize-sitemap.ts after vite");
  if (!/vite build.*finalize-sitemap/.test(pkg.scripts.build))
    problems.push("finalize-sitemap must run AFTER vite build — it reads the emitted assets");

  const withImages = entries.filter((e) => e.images?.length);
  if (withImages.length < visibleProducts.length)
    problems.push(
      `only ${withImages.length} sitemap entries carry images; expected at least ${visibleProducts.length}`,
    );
  // The pre-build sitemap must contain no image nodes at all: at that point the
  // paths are filesystem paths, and emitting them advertises 404s to Google.
  if (readFileSync("public/sitemap.xml", "utf8").includes("<image:"))
    problems.push("public/sitemap.xml carries image nodes — those paths are unresolved");

  // IndexNow's key must be fetchable at /<key>.txt containing itself, or every
  // submission is rejected. The key is hardcoded in scripts/indexnow.ts, so the
  // two can drift; this is the only thing that would notice.
  const indexnowSrc = readFileSync("scripts/indexnow.ts", "utf8");
  const keyMatch = indexnowSrc.match(/const KEY = "([0-9a-f]{8,64})"/);
  if (!keyMatch) problems.push("scripts/indexnow.ts has no parseable KEY");
  else {
    const key = keyMatch[1];
    let keyFile: string | null = null;
    try {
      keyFile = readFileSync(`public/${key}.txt`, "utf8").trim();
    } catch {
      problems.push(`public/${key}.txt is missing — IndexNow cannot verify the host`);
    }
    if (keyFile !== null && keyFile !== key)
      problems.push(`public/${key}.txt does not contain the key itself`);
    if (!pkg.scripts.build.includes("indexnow"))
      problems.push("package.json build does not run scripts/indexnow.ts");
  }

  if (problems.length) bad(`image sitemap / IndexNow wiring:\n     ${problems.join("\n     ")}`);
  else
    console.log(
      `ok  image sitemap wired (${withImages.length} entries) + IndexNow key published`,
    );
}

console.log(fail === 0 ? "\nALL SEO CHECKS PASSED" : `\n${fail} FAILURES`);
process.exit(fail ? 1 : 0);
