import {
  localeLinks,
  localePath,
  LANGS,
  DEFAULT_SEO_LANG,
  SITE_URL,
  brandPath,
  collectionPageSchema,
  productPath,
  faqSchema,
  preloadImage,
  productSpecsPath,
  webPageSchema,
  jsonLd,
  webSiteSchema,
  absolute,
  organizationSchema,
  localBusinessSchema,
  ORG_LOGO,
  BUSINESS_IMAGE,
  ORG_DESCRIPTION,
  CONTENT_DATE,
} from "../src/lib/seo";
import { productSchema } from "../src/lib/seo-product";
// `visibleProducts` is what the site advertises; `products` is the full
// record, which stays larger because hidden models keep their /catalog 301s.
import {
  legacyCatalogTarget,
  products,
  productsOfBrand,
  visibleProducts,
} from "../src/data/products";
import { specs } from "../src/data/specs";
import { INDUSTRY_SLUGS } from "../src/data/industries";
import { tFor } from "../src/lib/i18n";
import { SPEC } from "../src/data/spec-dict";
import { entries } from "./lib/sitemap";
// The real search route, so the indexability gate below exercises the code
// that actually ships rather than the helper it calls.
// The `.meta` modules, not the pages. These gates drive the real `head()` a
// visitor gets, and since the route split those live beside the page rather
// than inside it — which also means this script no longer imports eleven
// React page components just to check their meta tags.
import { head as searchHead } from "../src/pages/Search.meta";
import { head as industryHead } from "../src/pages/IndustryDetail.meta";
import { existsSync, readFileSync, readdirSync } from "node:fs";
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
  // `image` is an array of ImageObject now, not bare URLs — the object form
  // carries a caption and marks the representative frame. The assertion this
  // gate exists for is unchanged: every URL must be absolute, because a
  // relative one in JSON-LD resolves against Google's crawler, not the site.
  for (const img of s.image) {
    if (img["@type"] !== "ImageObject") bad(`product ${p.id} image is not an ImageObject`);
    for (const field of ["url", "contentUrl"]) {
      if (typeof img[field] !== "string" || !img[field].startsWith("https://"))
        bad(`product ${p.id} ImageObject.${field} is not an absolute URL`);
    }
  }
  if (s.image[0] && s.image[0].representativeOfPage !== true)
    bad(`product ${p.id} hero is not marked representativeOfPage`);
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
    console.log(`ok  image sitemap wired (${withImages.length} entries) + IndexNow key published`);
}

// 14. No 301 may point at a URL that 404s. A hidden model's product page 404s
//     by design, so pointing its already-indexed /catalog URL there produced a
//     301 -> 404 chain — which Google reports as a broken redirect and which
//     throws away the signal the old URL still carries.
{
  const problems: string[] = [];
  const liveProductPaths = new Set(visibleProducts.map(productPath));
  const brandPaths = new Set(["radiocom", "motorola"].map(brandPath));

  for (const p of products) {
    const target = legacyCatalogTarget(p.id);
    if (!target) {
      problems.push(`${p.id}: legacyCatalogTarget returned null for a real product`);
      continue;
    }
    const dest = "model" in target ? `/${target.brand}/${target.model}` : `/${target.brand}`;

    if (p.hidden) {
      if ("model" in target)
        problems.push(`${p.id} is hidden but redirects to ${dest}, which 404s`);
      else if (!brandPaths.has(dest)) problems.push(`${p.id}: ${dest} is not a brand page`);
    } else if (!liveProductPaths.has(dest)) {
      problems.push(`${p.id}: redirect target ${dest} is not a live product page`);
    }
  }

  // The router and netlify.toml must agree. They only can by sharing the
  // decision, so this checks that netlify.toml was generated from it.
  const toml = readFileSync("netlify.toml", "utf8");
  for (const p of products.filter((x) => x.hidden)) {
    if (toml.includes(`/ru/catalog/${p.id}"`) && toml.includes(`to = "/ru/motorola/${p.slug}"`))
      problems.push(`netlify.toml still sends hidden ${p.id} to its own product page`);
  }

  if (problems.length)
    bad(`legacy redirects point at dead URLs:\n     ${problems.join("\n     ")}`);
  else
    console.log(
      `ok  all ${products.length} legacy /catalog redirects resolve to a page that answers 200`,
    );
}

// 15. No build script may hardcode a nitro output directory.
//
//     Nitro's output path is preset-dependent: `.output/public` under
//     cloudflare and node-server, `dist` under the netlify preset that Netlify
//     itself picks. `finalize-sitemap.ts` was written against `.output/public`
//     because every local build put it there — and it threw on Netlify, which
//     failed the deploy. Nothing local could have caught that, so this gate is
//     the thing that does.
{
  const problems: string[] = [];
  for (const f of readdirSync("scripts").filter((n) => /\.(ts|mjs)$/.test(n))) {
    const path = join("scripts", f);
    const raw = readFileSync(path, "utf8");
    // Comments explain *why* the paths differ; a gate that cannot tell an
    // explanation from a live path would force those comments out.
    const code = raw.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
    for (const m of code.matchAll(/["'`](\.output\/public|dist)\/[^"'`]*["'`]/g)) {
      const line = raw.slice(0, m.index).split("\n").length;
      problems.push(`${path}:~${line} hardcodes ${m[1]}/ — use scripts/lib/output-dir.ts`);
    }
  }
  if (problems.length)
    bad(`build scripts assume an output directory:\n     ${problems.join("\n     ")}`);
  else console.log("ok  no build script hardcodes a preset-dependent output directory");
}

// 16. Every page type emits a WebPage node tied to the site and to its image.
//     Without it the Product, the breadcrumb and the FAQ float unattached and
//     `primaryImageOfPage` — how Google picks a result thumbnail — has nowhere
//     to live.
{
  const problems: string[] = [];
  const sample = visibleProducts[0];
  const cases = [
    { what: "product", path: productPath(sample), image: sample.image },
    { what: "specs", path: productSpecsPath(sample), image: sample.image },
    { what: "brand", path: brandPath("radiocom"), image: sample.image },
  ];
  for (const c of cases) {
    const w = webPageSchema({
      lang: "ru",
      path: c.path,
      name: "n",
      description: "d",
      image: c.image,
    }) as Record<string, unknown>;
    if (w["@type"] !== "WebPage") problems.push(`${c.what}: not a WebPage`);
    if (!String(w.url ?? "").startsWith(SITE_URL)) problems.push(`${c.what}: url not absolute`);
    const isPartOf = w.isPartOf as { "@id"?: string } | undefined;
    if (isPartOf?.["@id"] !== `${SITE_URL}/#website`)
      problems.push(`${c.what}: isPartOf does not point at the WebSite node`);
    const primary = w.primaryImageOfPage as { url?: string } | undefined;
    if (!primary?.url?.startsWith("https://"))
      problems.push(`${c.what}: primaryImageOfPage missing or relative`);
  }

  // No FAQPage on product pages. Structured data must describe content the
  // visitor can see, and these pages render no FAQ — emitting one would be a
  // policy violation, not an optimisation. Adding a real FAQ means writing real
  // questions, which is copy this repo does not have.
  const storySrc = readFileSync("src/pages/ProductStory.tsx", "utf8");
  if (/faqSchema\(/.test(storySrc))
    problems.push(
      "ProductStory emits FAQPage but renders no FAQ — schema must match visible content",
    );

  if (problems.length) bad(`WebPage graph:\n     ${problems.join("\n     ")}`);
  else console.log("ok  WebPage node on product, specs and brand pages, tied to the site graph");
}

// 17. Coverage must agree between the two files that state it.
//
// `products.ts` holds `rangeCity` / `rangeOpen` — what the card, the schema and
// the compare table quote. `specs.ts` holds the `Радиус действия` row on the
// spec sheet. They are authored separately and, until the price list was
// applied, disagreed on eleven models: the spec sheets mostly quoted the
// open-country figure alone, which is the flattering half of the pair, and
// three of them quoted a distance the price list does not support at all.
//
// Nothing in the type system connects the two, so this gate does: every model
// with a coverage figure must state the same one in both places, and any model
// quoting a range must carry the line-of-sight disclaimer with it.
{
  const problems: string[] = [];
  for (const p of products) {
    const spec = specs[p.id];
    if (!spec) {
      problems.push(`${p.id}: no spec sheet`);
      continue;
    }
    const row = spec.rows.find((r) => r.label.ru === SPEC.range.ru);
    if (!row) {
      problems.push(`${p.id}: spec sheet quotes no coverage figure`);
      continue;
    }
    // The spec row is built from the same builders as the product fields, so
    // the product's own strings must appear inside it verbatim.
    for (const [field, value] of [
      ["rangeCity", p.rangeCity],
      ["rangeOpen", p.rangeOpen],
    ] as const) {
      if (!value) continue;
      for (const lang of LANGS) {
        // `inCity()` wraps the city figure, so compare on the bare number.
        const needle = value[lang];
        if (!row.value[lang].includes(needle))
          problems.push(`${p.id}.${field}[${lang}]: "${needle}" absent from the spec row`);
      }
    }
    if (!spec.rangeNote)
      problems.push(`${p.id}: quotes coverage but omits the line-of-sight disclaimer`);
  }
  if (problems.length) bad(`coverage:\n     ${problems.join("\n     ")}`);
  else console.log("ok  coverage agrees between products.ts and specs.ts on all 24 models");
}

// 18. Every price the site shows must be the price the schema emits.
//
// What this catches is a regression in `productSchema` — a dropped `price`, a
// currency typo, an Offer growing a price on a model whose price is "on
// request". All three are silent in the browser and expensive in search: a
// merchant result advertising a figure the page does not show gets the whole
// result suppressed once Google notices.
//
// What it cannot catch is a wrong number in `products.ts` itself, because the
// Offer is generated from exactly that. Nothing in the repo can. The price list
// is the only authority for those, and `TODO-content.md` records which figures
// came from where.
{
  const problems: string[] = [];
  for (const p of visibleProducts) {
    const schema = productSchema(p, "ru") as {
      offers?: { price?: unknown; priceCurrency?: unknown };
    };
    const offer = schema.offers;
    if (p.price === null) {
      if (offer && "price" in offer)
        problems.push(`${p.id}: price is "on request" but the Offer carries one`);
      continue;
    }
    if (Number(offer?.price) !== p.price)
      problems.push(`${p.id}: Offer price ${String(offer?.price)} != products.ts ${p.price}`);
    if (offer?.priceCurrency !== "UZS")
      problems.push(`${p.id}: Offer currency is ${String(offer?.priceCurrency)}, expected UZS`);
  }
  if (problems.length) bad(`offer prices:\n     ${problems.join("\n     ")}`);
  else console.log("ok  every Offer price matches products.ts, in UZS");
}

// 19. The sitelinks searchbox must point at a route that exists.
//
// The previous `SearchAction` advertised `/ru/catalog?q=` while the catalogue
// validated only `cat` and `brand` — it described an endpoint that was not
// there, which is the kind of claim that costs trust in the rest of the graph.
// It was removed with a note to reinstate it only alongside a real search
// route. This gate is what keeps that promise honest: the target has to be a
// path the sitemap ships, the route file has to exist, and the page has to
// read the `q` parameter the template names.
{
  const problems: string[] = [];
  const site = webSiteSchema() as {
    potentialAction?: { target?: { urlTemplate?: string }; "query-input"?: string };
  };
  const template = site.potentialAction?.target?.urlTemplate ?? "";
  const m = /^https:\/\/[^/]+(\/[a-z]{2}\/[a-z-]+)\?([a-z_]+)=\{search_term_string\}$/.exec(
    template,
  );
  if (!m) {
    problems.push(`urlTemplate is not a "<path>?<param>={search_term_string}" URL: ${template}`);
  } else {
    const [, path, param] = m;
    const bare = path.replace(/^\/[a-z]{2}/, "");
    if (!entries.some((e) => e.path === bare))
      problems.push(`SearchAction targets ${bare}, which the sitemap does not ship`);
    const routeFile = `src/routes/$lang${bare}.tsx`;
    if (!existsSync(routeFile)) problems.push(`no route file at ${routeFile}`);
    // Both halves of the route: `validateSearch` and the `head` that reads the
    // parsed value live in the `.meta` module (they are eager, so they must),
    // while the form that submits the param lives in the page. The question
    // this gate asks — "is the template Google is told about backed by real
    // parsing?" — spans the pair, so it reads the pair.
    const pageSrc =
      readFileSync("src/pages/Search.meta.ts", "utf8") +
      readFileSync("src/pages/Search.tsx", "utf8");
    if (!pageSrc.includes("validateSearch"))
      problems.push("the search page does not validate its search params");
    // Specifically: the parameter has to be read off the *search params*, not
    // merely appear somewhere in the file. `name="q"` on an input satisfies a
    // bare word match while the page ignores the URL entirely, which is the
    // exact failure this gate exists to catch.
    if (!new RegExp(`search\\.${param}\\b|search\\["${param}"\\]`).test(pageSrc))
      problems.push(
        `the search page never reads search.${param} — the parameter the template names`,
      );
    if (!new RegExp(`\\{\\s*${param}\\s*[},]`).test(pageSrc))
      problems.push(`the search page never destructures "${param}" from its search params`);
    if (!/role="search"/.test(pageSrc))
      problems.push("the search page renders no role=search form for Google to find");
  }
  if (site.potentialAction && site["query-input" as keyof typeof site] === undefined) {
    // `query-input` lives on the action, not the site node.
    if (!site.potentialAction["query-input"]?.includes("search_term_string"))
      problems.push("SearchAction is missing its query-input binding");
  }
  if (problems.length) bad(`sitelinks searchbox:\n     ${problems.join("\n     ")}`);
  else console.log("ok  SearchAction points at a real, param-reading search route");
}

// 20. Related products must resolve to pages that exist and are not the model
//     itself. A self-reference tells Google the entity is its own alternative,
//     and a link to a hidden model points at a 404.
{
  const problems: string[] = [];
  const visibleUrls = new Set(
    visibleProducts.map((p) => `${absolute(localePath("ru", productPath(p)))}#product`),
  );
  for (const p of visibleProducts) {
    const schema = productSchema(p, "ru") as { "@id"?: string; isRelatedTo?: { "@id": string }[] };
    for (const rel of schema.isRelatedTo ?? []) {
      if (rel["@id"] === schema["@id"]) problems.push(`${p.id}: isRelatedTo includes itself`);
      if (!visibleUrls.has(rel["@id"]))
        problems.push(`${p.id}: isRelatedTo points at ${rel["@id"]}, which is not a visible model`);
    }
  }
  if (problems.length) bad(`isRelatedTo:\n     ${problems.join("\n     ")}`);
  else console.log("ok  isRelatedTo resolves to visible sibling models only");
}

// 21. Every route's social card must exist, and be the size it claims to be.
//
//     `pageMeta` emits `og:image:width` 1200 and `og:image:height` 630 next to
//     every `og:image`, because a scraper told the wrong dimensions either
//     letterboxes the card or drops it. That pairing is only honest while the
//     file on disk actually is 1200x630 — and the file is a build artifact from
//     `scripts/build-og-images.ts`, generated from photography and catalogue
//     filenames, so a renamed image or a new model silently breaks it.
//
//     Reads the JPEG's own SOF marker rather than trusting the filename. There
//     is no image library in this toolchain (deliberately — see the note in
//     build-og-images.ts), and a JPEG's dimensions are four bytes at a known
//     offset, so parsing is cheaper than a dependency.
{
  const jpegSize = (file: string): [number, number] | null => {
    const b = readFileSync(file);
    if (b[0] !== 0xff || b[1] !== 0xd8) return null;
    let i = 2;
    while (i < b.length - 9) {
      if (b[i] !== 0xff) {
        i++;
        continue;
      }
      const marker = b[i + 1];
      // SOF0/1/2/3 and 5-7, 9-11, 13-15 all carry height/width at the same
      // offset. DHT (c4), DAC (cc) and RSTn (d0-d7) share the range and do not.
      const isSof =
        marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
      if (isSof) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
      i += 2 + b.readUInt16BE(i + 2);
    }
    return null;
  };

  // Every card a route can ask for, derived the same way the pages derive it.
  const wanted = new Set<string>([
    "home",
    "radiocom",
    "motorola",
    "compare",
    "poc",
    "service",
    "industries",
    "search",
    "sitemap",
    ...INDUSTRY_SLUGS.map((s) => `industries-${s}`),
    ...visibleProducts.map((p) => `product-${p.slug}`),
  ]);

  const problems: string[] = [];
  for (const slug of wanted) {
    const file = join("public/og", `${slug}.jpg`);
    if (!existsSync(file)) {
      problems.push(`${slug}.jpg is missing — run: bun scripts/build-og-images.ts`);
      continue;
    }
    const size = jpegSize(file);
    if (!size) problems.push(`${slug}.jpg is not a readable JPEG`);
    else if (size[0] !== 1200 || size[1] !== 630)
      problems.push(`${slug}.jpg is ${size[0]}x${size[1]}, but every page declares 1200x630`);
  }
  if (problems.length) bad(`social cards:\n     ${problems.join("\n     ")}`);
  else console.log(`ok  all ${wanted.size} social cards exist at the 1200x630 they declare`);
}

// 22. Titles and descriptions must be unique within a locale, and the right
//     length.
//
//     Two pages sharing a <title> is how Google decides one of them is not
//     worth indexing separately, and it is easy to do by accident here because
//     every title is an i18n key and several read alike. Length matters for a
//     duller reason: a title past ~60 characters is truncated in the result,
//     so the part that distinguishes it from its siblings is the part that
//     disappears.
//
//     Descriptions are bounded but not failed on the upper end alone — Google
//     rewrites long ones rather than penalising them. An *empty* or near-empty
//     one is the real defect, because then it writes its own from the page.
{
  const problems: string[] = [];
  for (const lang of LANGS) {
    const t = tFor(lang);
    const seen = new Map<string, string>();
    const check = (label: string, title: string, description: string) => {
      const prevT = seen.get(`t:${title}`);
      if (prevT) problems.push(`${lang}: "${title}" is the title of both ${prevT} and ${label}`);
      else seen.set(`t:${title}`, label);

      const prevD = seen.get(`d:${description}`);
      if (prevD) problems.push(`${lang}: ${label} and ${prevD} share a description word for word`);
      else seen.set(`d:${description}`, label);

      if (title.length > 65) problems.push(`${lang}: ${label} title is ${title.length} chars`);
      if (description.length < 70)
        problems.push(`${lang}: ${label} description is only ${description.length} chars`);
    };

    check("/", t("meta.home.title"), t("meta.home.desc"));
    check(
      "/compare",
      t("meta.compare.title", { count: visibleProducts.length }),
      t("meta.compare.desc"),
    );
    check("/poc", t("meta.poc.title"), t("meta.poc.desc"));
    check("/service", t("meta.service.title"), t("meta.service.desc"));
    check("/industries", t("meta.industries.title"), t("meta.industries.desc"));
    check("/search", t("meta.search.title"), t("meta.search.desc"));
    for (const b of ["radiocom", "motorola"] as const)
      check(
        `/${b}`,
        t(`meta.brand.${b}_title`),
        t(`meta.brand.${b}_desc`, { count: productsOfBrand(b).length }),
      );
  }
  if (problems.length) bad(`meta uniqueness/length:\n     ${problems.join("\n     ")}`);
  else console.log("ok  every page title and description is distinct and correctly sized");
}

// 23. The two identity images have to be big enough for the surfaces that
//     render them.
//
//     Both used to point at `/favicon.png`, and both silently fell below spec
//     when the icon set was rebuilt around the cropped signal mark: the favicon
//     went from a 64x64 wordmark to a 32x32 glyph. Google documents 112x112 as
//     the floor for an Organization logo and drops anything smaller without
//     saying so, and a LocalBusiness image at 32px is unusable in the map pack.
//     Nothing on the page changes when this breaks, which is exactly why it
//     needs a gate rather than a review.
{
  const problems: string[] = [];
  const pngSize = (buf: Buffer) => ({
    // IHDR width/height live at fixed offsets in every PNG.
    w: buf.readUInt32BE(16),
    h: buf.readUInt32BE(20),
  });
  const jpegSize = (buf: Buffer) => {
    let i = 2;
    while (i < buf.length) {
      if (buf[i] !== 0xff) {
        i++;
        continue;
      }
      const marker = buf[i + 1];
      // SOF0/1/2 carry the dimensions; skip the other segments by their length.
      if (marker >= 0xc0 && marker <= 0xc2)
        return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
      i += 2 + buf.readUInt16BE(i + 2);
    }
    return { w: 0, h: 0 };
  };
  const measure = (rel: string) => {
    const file = join("public", rel.replace(/^\//, ""));
    if (!existsSync(file)) return null;
    const buf = readFileSync(file);
    return rel.endsWith(".png") ? pngSize(buf) : jpegSize(buf);
  };

  // Google's documented minimum for an Organization logo.
  const LOGO_MIN = 112;
  // A business photo below this is too small for the surfaces that render it.
  const IMAGE_MIN = 320;

  const org = organizationSchema() as { logo?: string };
  const biz = localBusinessSchema() as { image?: string };

  if (org.logo !== absolute(ORG_LOGO))
    problems.push(`Organization.logo is ${org.logo}, expected ${absolute(ORG_LOGO)}`);
  if (biz.image !== absolute(BUSINESS_IMAGE))
    problems.push(`LocalBusiness.image is ${biz.image}, expected ${absolute(BUSINESS_IMAGE)}`);

  const logo = measure(ORG_LOGO);
  if (!logo) problems.push(`${ORG_LOGO} is missing from public/`);
  else if (Math.min(logo.w, logo.h) < LOGO_MIN)
    problems.push(
      `Organization.logo ${ORG_LOGO} is ${logo.w}x${logo.h}, under Google's ${LOGO_MIN}px floor`,
    );

  const image = measure(BUSINESS_IMAGE);
  if (!image) problems.push(`${BUSINESS_IMAGE} is missing from public/`);
  else if (Math.min(image.w, image.h) < IMAGE_MIN)
    problems.push(`LocalBusiness.image ${BUSINESS_IMAGE} is only ${image.w}x${image.h}`);

  if (problems.length) bad(`identity images:\n     ${problems.join("\n     ")}`);
  else
    console.log(
      `ok  Organization.logo (${logo?.w}x${logo?.h}) and LocalBusiness.image ` +
        `(${image?.w}x${image?.h}) clear their minimums`,
    );
}

// 24. Internal search results are noindexed; the search form is not.
//
//     `/search?q=…` answers 200 for any string anyone types, so left indexable
//     it is an unbounded set of thin near-duplicates of the catalogue — the
//     case Google's guidance on internal search results is written about. The
//     bare form is the opposite: one real page, linked from the chrome, and the
//     URL the SearchAction advertises, so it stays indexable and stays in the
//     sitemap. Getting either half backwards is invisible on the page.
{
  const problems: string[] = [];
  const robotsOf = (meta: { name?: string; content?: string }[]) =>
    meta.find((m) => m.name === "robots")?.content;

  // Drive the *route's own* head(), not `pageMeta` directly.
  //
  // The first version of this gate called `pageMeta({noindex:true})` and
  // asserted the tag came back — which only proves the helper works. Mutating
  // `Search.tsx` to `noindex: false` left the gate green while every results
  // page went indexable again, so it was testing the wrong thing entirely.
  // Calling the real `head()` is what ties the check to the behaviour.
  const headFor = (q?: string) => {
    const head = searchHead({
      params: { lang: "ru" as const },
      match: { search: q ? { q } : {} },
    }) as { meta: { name?: string; content?: string }[] };
    return robotsOf(head.meta);
  };
  const form = headFor();
  const results = headFor("rcd");

  if (form !== undefined) problems.push(`the bare /search form emits robots="${form}"`);
  if (results !== "noindex, follow")
    problems.push(`/search?q= emits robots="${results ?? "(none)"}", expected "noindex, follow"`);

  // The form must stay in the sitemap; a noindex results page must never be
  // listed. Both halves of that pairing are asserted, not assumed.
  const listed = entries.some((e) => e.path === "/search");
  if (!listed) problems.push("the /search form is missing from the sitemap");

  // A robots.txt disallow would hide the noindex from the crawler that needs
  // to read it — the classic way this fix gets undone.
  const robotsTxt = existsSync("public/robots.txt")
    ? readFileSync("public/robots.txt", "utf8")
    : "";
  if (/^\s*Disallow:\s*\/(?:\w+\/)?search/im.test(robotsTxt))
    problems.push("robots.txt disallows /search, so its noindex can never be read");

  if (problems.length) bad(`search indexability:\n     ${problems.join("\n     ")}`);
  else console.log("ok  /search form indexable and in the sitemap, ?q= results noindex, follow");
}

// 25. A page that calls itself an article must carry the article namespace.
//
//     The industry pages have declared `og:type: article` since they were
//     built, and emitted nothing else from that namespace — a content type
//     announced with no section to file it under and no date to sort it by.
//     Either half is a decision: the type could have been dropped instead. It
//     was not, because these pages carry real editorial content (the pain
//     list, the outcomes, a per-industry FAQ), so the fix is to finish the
//     declaration rather than retract it.
//
//     Driven through the route's own `head()`, for the reason check 24
//     documents at length: asserting that `pageMeta` *can* emit the tags proves
//     nothing about whether any page asks it to.
{
  const problems: string[] = [];
  for (const slug of INDUSTRY_SLUGS) {
    const head = industryHead({ params: { lang: "ru" as const, slug } }) as {
      meta: { property?: string; content?: string }[];
    };
    const prop = (k: string) => head.meta.find((m) => m.property === k)?.content;

    if (prop("og:type") !== "article") continue; // not an article; nothing owed.

    const section = prop("article:section");
    const modified = prop("article:modified_time");
    const name = tFor("ru")(`industries.${slug}.name`);

    if (!section) problems.push(`${slug}: og:type is article but article:section is missing`);
    else if (section !== name)
      problems.push(`${slug}: article:section is "${section}", the page is titled "${name}"`);

    // What this can and cannot see, stated plainly rather than implied.
    //
    // The shipped value is injected by the vite define in `vite.config.ts`.
    // This script runs under Bun with no define, so `CONTENT_DATE` here is the
    // fallback in `src/lib/seo.ts` — which means the comparison below pins the
    // *plumbing*, not the date: it proves the page emits the one shared
    // constant instead of computing a date of its own, which is the mistake
    // that would let `article:modified_time` and `<lastmod>` drift apart.
    //
    // That the define itself lands is not assertable from here and is not
    // asserted. It does not need to be: when the define is missing, both the
    // sitemap and the page fall back to the build date, which is exactly the
    // behaviour that shipped before any of this existed.
    if (!modified)
      problems.push(`${slug}: og:type is article but article:modified_time is missing`);
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(modified))
      problems.push(`${slug}: article:modified_time "${modified}" is not an ISO date`);
    else if (modified !== CONTENT_DATE)
      problems.push(
        `${slug}: article:modified_time is ${modified}, not the shared CONTENT_DATE (${CONTENT_DATE}) the sitemap's lastmod also comes from`,
      );
  }
  if (problems.length) bad(`article metadata:\n     ${problems.join("\n     ")}`);
  else console.log("ok  every article page carries article:section and a real modified_time");
}

// 26. The Organization description must be the site's own published words.
//
//     Google cross-checks a knowledge-panel description against what the page
//     says about itself, so a schema description written separately from the
//     home meta is two claims about one business. Pinning the constant to
//     `meta.home.desc` means the copywriter can rewrite the description without
//     knowing the schema exists, and the build tells them if the two drift.
{
  const problems: string[] = [];
  const org = organizationSchema() as { description?: string };
  const published = tFor("ru")("meta.home.desc");

  if (!org.description) problems.push("Organization has no description");
  else if (org.description !== published)
    problems.push(
      `Organization.description does not match meta.home.desc\n       schema: ${org.description}\n       ru.json: ${published}`,
    );
  if (ORG_DESCRIPTION !== published)
    problems.push("ORG_DESCRIPTION has drifted from ru.json's meta.home.desc");

  if (problems.length) bad(`organization description:\n     ${problems.join("\n     ")}`);
  else console.log("ok  Organization.description is the published home description, verbatim");
}

console.log(fail === 0 ? "\nALL SEO CHECKS PASSED" : `\n${fail} FAILURES`);
process.exit(fail ? 1 : 0);
