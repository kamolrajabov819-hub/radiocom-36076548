/**
 * SEO primitives: site constants, canonical URLs and Schema.org JSON-LD builders.
 *
 * Structured data is emitted as JSON-LD (Google's preferred format) via a plain
 * `<script type="application/ld+json">` in each route's `head()`. Keeping the
 * builders here — rather than inline per route — means one place governs the
 * business identity that Google reads on every page.
 *
 * Each language has its own URL (/ru, /en, /uz), so every page emits a canonical
 * for its own locale plus the full hreflang cluster — see `localeLinks`.
 */

import type { LinkHTMLAttributes } from "react";
import type { Product } from "@/data/products";

export const LANGS = ["ru", "en", "uz"] as const;
export type SeoLang = (typeof LANGS)[number];
export const DEFAULT_SEO_LANG: SeoLang = "ru";

/** Production origin. Used for canonicals, sitemap entries and absolute schema URLs. */
export const SITE_URL = "https://radiocom.uz";

/**
 * The date the site's content last changed, baked in at build time by
 * `vite.config.ts` from `scripts/lib/content-date.ts` — the same value the
 * sitemap writes into every `<lastmod>`.
 *
 * Declared rather than imported: `head()` runs in the browser as well as on the
 * server, so it cannot reach a Node script. The fallback keeps a dev server
 * that somehow missed the define from emitting the string `undefined` into a
 * date field.
 */
declare const __CONTENT_DATE__: string | undefined;
export const CONTENT_DATE: string =
  typeof __CONTENT_DATE__ === "string" ? __CONTENT_DATE__ : new Date().toISOString().slice(0, 10);

export const SITE_NAME = "Radiocom";

export const BUSINESS = {
  legalName: "Radiocom",
  phones: ["+998781131618", "+998939800710", "+998933890710"],
  street: "ул. Узбекистон Овози, 2 (Гостиница Тата, 1 этаж)",
  city: "Ташкент",
  region: "Toshkent",
  country: "UZ",
  postalCode: "100000",
  /** Office coordinates — Uzbekiston Ovozi 2, Tashkent. */
  geo: { lat: 41.3111, lng: 69.2797 },
  email: "sales@radiocom.uz",
  openingHours: "Mo-Fr 09:00-18:00",
  sameAs: ["https://t.me/radiocom_uz", "https://www.instagram.com/radiocom_uzb"],
} as const;

/**
 * The two images the identity graph points at, named rather than inlined.
 *
 * Both used to be `/favicon.png`, and both broke when the icon set was rebuilt
 * around the cropped signal mark: the favicon went from a 64x64 wordmark to a
 * 32x32 glyph, which is under Google's documented 112x112 floor for an
 * Organization logo and far under anything usable as a LocalBusiness photo.
 * Naming them here means the size contract is stated in one place and
 * `verify-seo` can assert it — see the "identity images are big enough" gate.
 */
export const ORG_LOGO = "/icon-512.png";
export const BUSINESS_IMAGE = "/og-radiocom.jpg";

/**
 * `meta.home.desc` from `ru.json`, verbatim.
 *
 * Kept as a constant rather than read through `tFor("ru")` because
 * `organizationSchema()` is called from the root `head()`, which is
 * language-neutral by construction and holds no i18n instance. `verify-seo`
 * asserts the two strings still match, so the copy cannot drift from the schema
 * without the build saying so.
 */
export const ORG_DESCRIPTION =
  "Официальный поставщик радиостанций в Узбекистане: 11 лет на рынке, 10 000+ клиентов. " +
  "Motorola, Hytera, PoC и Radiocom RC. Бесплатный тест, гарантия, сервис в Ташкенте.";

/** Absolute URL for a site-relative path. */
export function absolute(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Prefix a language-neutral path with its locale segment: "/catalog" -> "/en/catalog". */
export function localePath(lang: SeoLang, path: string): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${lang}${clean}`;
}

/**
 * Canonical plus the full hreflang cluster for one page.
 *
 * Every locale of a page must advertise the same complete set of alternates —
 * including itself — or Google discards the cluster. `x-default` points at
 * Russian, the language the business actually operates in.
 *
 * `path` is language-neutral ("/catalog"); the locale segment is added here.
 */
export function localeLinks(lang: SeoLang, path: string) {
  return [
    { rel: "canonical", href: absolute(localePath(lang, path)) },
    ...LANGS.map((l) => ({
      rel: "alternate",
      hrefLang: l,
      href: absolute(localePath(l, path)),
    })),
    {
      rel: "alternate",
      hrefLang: "x-default",
      href: absolute(localePath(DEFAULT_SEO_LANG, path)),
    },
  ];
}

/** A plain `<link rel="canonical">`, for pages outside the locale tree. */
export function canonical(path: string) {
  return { rel: "canonical", href: absolute(path) };
}

/**
 * Wrap a JSON-LD object for a route's `head().scripts`.
 *
 * The router's `ManifestScript` shape is `{ attrs, children }` — it supplies the
 * `<script>` tag itself and renders `children` as the body.
 */
export function jsonLd(data: unknown) {
  // Flat, deliberately. TanStack's `<Scripts>` maps each `head().scripts` entry
  // with `({ children, ...script }) => ({ tag: "script", attrs: { ...script } })`
  // — it pulls `children` off and spreads **everything else as attributes**.
  //
  // So a nested `{ attrs: { type } }` does not set the type; it renders the
  // literal attribute `attrs="[object Object]"`. That is what shipped, and the
  // consequences were bad in both directions: with no `type`, the browser
  // treats a `<script>` as JavaScript, so each block threw
  // `SyntaxError: Unexpected token ':'` on load, and Google saw no structured
  // data at all — every Organization, LocalBusiness, Product, Service,
  // FAQPage and BreadcrumbList block on the site was invisible.
  //
  // `verify-seo` now asserts the rendered `type` so this cannot regress.
  return {
    type: "application/ld+json",
    children: JSON.stringify(data),
  };
}

/** BCP-47 → Open Graph locale. og:locale wants the underscore form. */
export const OG_LOCALE: Record<SeoLang, string> = {
  ru: "ru_RU",
  en: "en_US",
  uz: "uz_UZ",
};

/**
 * The full meta block for one page in one language.
 *
 * Every page used to hardcode a Russian title and description and pin
 * `og:locale` to `ru_RU`, while hreflang told Google the three locales were
 * distinct language versions. Contradictory signals like that invite Google to
 * fold them together as duplicates — which is exactly what the locale-prefixed
 * URLs were meant to prevent. Titles now come from the `meta.*` i18n keys and
 * everything language-dependent is derived from `lang` here, in one place.
 */
export function pageMeta(opts: {
  lang: SeoLang;
  title: string;
  description: string;
  /** Language-neutral path, e.g. "/catalog". */
  path: string;
  /**
   * The page's social preview card, by slug — a file under `public/og/`, built
   * by `scripts/build-og-images.ts`.
   *
   * Required, deliberately. Before this every route inherited one shared
   * `og-radiocom.jpg` from the root, so a shared product link and a shared
   * service link rendered identically in Telegram and WhatsApp — which is how
   * a catalogue URL actually travels in this market. The two page types that
   * *did* override it pointed at a raw 1024x1024 catalogue `.webp` while the
   * root still declared `og:image:width` 1200 and `height` 630, so scrapers
   * were told dimensions the file does not have.
   *
   * Making it a required argument rather than an optional one is the whole
   * point: a new page cannot quietly fall back to the generic card, because it
   * will not compile until someone has decided what it should share as.
   */
  ogCard: string;
  type?: "website" | "article" | "product";
  /**
   * Emits the Open Graph product namespace. Facebook, Telegram and VK read
   * these to render a price in the link preview, which is most of how a shared
   * product URL performs in the messaging apps this market actually uses.
   */
  product?: { price: number | null; currency?: string; availability?: "instock" | "oos" };
  /**
   * Keep the page out of the index while still following its links.
   *
   * For internal search results, which is the one page type Google's own
   * guidance singles out: `/search?q=…` answers 200 for any query anyone ever
   * types, so left indexable it is an unbounded set of thin, near-duplicate
   * URLs competing with the catalogue pages they link to. `follow` because the
   * links on it are real product links worth crawling.
   */
  noindex?: boolean;
  /**
   * The Open Graph article namespace, for the pages that declare
   * `type: "article"`.
   *
   * The industry pages have declared `og:type: article` since they were built
   * and carried nothing else from the namespace, which leaves a scraper reading
   * a content type it cannot then place: no date, no section, nothing to file
   * it under. `section` is the industry itself, which is exactly what the field
   * means, and the modified time is the site's real content date rather than a
   * per-page one — see `CONTENT_DATE`.
   *
   * Deliberately no `article:published_time` and no `article:author`. Neither
   * has an answer anywhere in this repository, and a first-publication date is
   * not something to guess at.
   */
  article?: { section: string };
}) {
  const url = absolute(localePath(opts.lang, opts.path));
  const type = opts.type ?? "website";

  return [
    { title: opts.title },
    { name: "description", content: opts.description },
    ...(opts.noindex ? [{ name: "robots", content: "noindex, follow" }] : []),
    { property: "og:type", content: type },
    { property: "og:title", content: opts.title },
    { property: "og:description", content: opts.description },
    { property: "og:url", content: url },
    { property: "og:locale", content: OG_LOCALE[opts.lang] },
    // Facebook and LinkedIn read the alternates to offer the other versions.
    ...LANGS.filter((l) => l !== opts.lang).map((l) => ({
      property: "og:locale:alternate",
      content: OG_LOCALE[l],
    })),
    // Width, height and alt travel *with* the image, never separately. The root
    // sets a site-wide default for all four; emitting only the URL here would
    // leave the root's dimensions describing a different file, and a scraper
    // told the wrong size letterboxes the card or drops it.
    { property: "og:image", content: absolute(`/og/${opts.ogCard}.jpg`) },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/jpeg" },
    { property: "og:image:alt", content: opts.title },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: opts.title },
    { name: "twitter:description", content: opts.description },
    { name: "twitter:image", content: absolute(`/og/${opts.ogCard}.jpg`) },
    { name: "twitter:image:alt", content: opts.title },

    // Open Graph product namespace. Only emitted where there is a real number:
    // `product:price:amount` with an empty or invented value is worse than
    // absent, because a scraper will render it.
    ...(opts.product?.price != null
      ? [
          { property: "product:price:amount", content: String(opts.product.price) },
          { property: "product:price:currency", content: opts.product.currency ?? "UZS" },
        ]
      : []),
    ...(opts.product
      ? [{ property: "product:availability", content: opts.product.availability ?? "instock" }]
      : []),

    // Open Graph article namespace, only where the page really is one.
    ...(opts.article
      ? [
          { property: "article:section", content: opts.article.section },
          { property: "article:modified_time", content: CONTENT_DATE },
        ]
      : []),

    // Local intent. Every query this site competes for is geographically bound
    // — «рации в Ташкенте», «ratsiya narxi Toshkent» — and the business has one
    // physical counter. `geo.*` and `ICBM` are read by Yandex, which carries
    // meaningful share in Uzbekistan and is not served by JSON-LD alone.
    { name: "geo.region", content: `${BUSINESS.country}-TK` },
    { name: "geo.placename", content: BUSINESS.city },
    { name: "geo.position", content: `${BUSINESS.geo.lat};${BUSINESS.geo.lng}` },
    { name: "ICBM", content: `${BUSINESS.geo.lat}, ${BUSINESS.geo.lng}` },
  ];
}

/**
 * `<link rel="preload">` for a route's LCP image.
 *
 * On every product page the hero photograph *is* the Largest Contentful Paint.
 * The browser cannot discover it until it has parsed the route's JS, built the
 * component tree and hit the `<img>` — which on a 4G handset is most of a
 * second after the HTML arrived. A preload in the document head starts that
 * fetch in parallel with the JS instead of after it.
 *
 * `imageSrcSet`/`imageSizes` must mirror the `<img>` exactly. A preload whose
 * candidate set differs from the element's makes the browser pick a different
 * candidate and download the image twice — strictly worse than no preload.
 */
export function preloadImage(opts: { src: string; small?: string; sizes?: string }) {
  // Relative, NOT `absolute()`. The browser matches a preload to the element
  // that consumes it by resolved URL *and* by candidate set, and the `<img>`
  // carries the bare `/assets/...` path vite emitted. An absolute
  // `https://radiocom.uz/assets/...` preload resolves to the same bytes but is
  // a different candidate string, so the preload goes unused and the image is
  // fetched twice — strictly worse than no preload, which is exactly what the
  // first version of this shipped.
  //
  // The literal return type matters too: TanStack types `head().links` as
  // React's `LinkHTMLAttributes`, where `fetchPriority` is the union
  // `"high" | "low" | "auto"`. Without the annotation TypeScript widens it to
  // `string` and the whole head object stops assigning.
  const tag: LinkHTMLAttributes<HTMLLinkElement> = {
    rel: "preload",
    as: "image",
    href: opts.src,
    ...(opts.small
      ? {
          imageSrcSet: `${opts.small} 800w, ${opts.src} 1600w`,
          imageSizes: opts.sizes ?? "(min-width: 768px) 520px, 88vw",
        }
      : {}),
    fetchPriority: "high",
  };
  return tag;
}

/* ─────────────────────────────────────────────────────────────
   Organisation-level graph — emitted once, from the root route
   ───────────────────────────────────────────────────────────── */

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: BUSINESS.legalName,
    url: SITE_URL,
    // `/icon-512.png`, not `/favicon.png`.
    //
    // Google documents a hard floor for the Organization logo — the image must
    // be at least 112x112px — and `favicon.png` stopped clearing it the moment
    // the icon set was rebuilt: it used to be a 64x64 wordmark and is now the
    // cropped 32x32 signal mark, which is a third of the required size. A logo
    // below the minimum is dropped from the knowledge panel silently, so
    // nothing about the page would have told us. The 512 is the same mark at
    // the size the manifest already ships.
    logo: absolute(ORG_LOGO),
    // The published home-page description, not a new sentence written for the
    // schema. Google cross-checks a knowledge-panel description against what
    // the site actually says about itself, and two descriptions of one business
    // that do not match is the thing that gets both distrusted.
    //
    // Russian, on every locale, and that is a property of where this node lives
    // rather than a decision made here: the root `head()` has no route params,
    // so it cannot know which language it is rendering — which is why `name`,
    // `legalName` and the whole postal address in this same object are already
    // Russian on the English and Uzbek pages. A description in a fourth
    // language would be the odd one out, not the fix.
    description: ORG_DESCRIPTION,
    // All three lines, not just the first — a caller who finds the business
    // through a knowledge panel should see the number they'd actually reach.
    telephone: BUSINESS.phones[0],
    contactPoint: BUSINESS.phones.map((telephone) => ({
      "@type": "ContactPoint",
      telephone,
      contactType: "sales",
      areaServed: "UZ",
      availableLanguage: ["ru", "uz", "en"],
    })),
    email: BUSINESS.email,
    sameAs: [...BUSINESS.sameAs],
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.street,
      addressLocality: BUSINESS.city,
      addressRegion: BUSINESS.region,
      postalCode: BUSINESS.postalCode,
      addressCountry: BUSINESS.country,
    },
  };
}

/**
 * LocalBusiness for the Tashkent showroom and service centre — this is what
 * feeds the map pack and the knowledge panel for local queries.
 */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ElectronicsStore",
    "@id": `${SITE_URL}/#localbusiness`,
    name: SITE_NAME,
    url: SITE_URL,
    // A 32x32 icon is not a business photograph. Google's LocalBusiness
    // guidance asks for an image "representative of the business", and the
    // map pack renders it at a size a favicon has no pixels for. The social
    // card is the largest real 1200x630 image the site owns and is what every
    // other surface already shares this business as.
    image: absolute(BUSINESS_IMAGE),
    telephone: BUSINESS.phones[0],
    priceRange: "$$",
    currenciesAccepted: "UZS",
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.street,
      addressLocality: BUSINESS.city,
      addressRegion: BUSINESS.region,
      postalCode: BUSINESS.postalCode,
      addressCountry: BUSINESS.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.geo.lat,
      longitude: BUSINESS.geo.lng,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    areaServed: { "@type": "Country", name: "Uzbekistan" },
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
  };
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: ["ru", "uz", "en"],
    publisher: { "@id": `${SITE_URL}/#organization` },
    // The sitelinks searchbox, reinstated — this time against a search that
    // exists.
    //
    // The previous one advertised `/ru/catalog?q={search_term_string}` while
    // the catalogue only ever validated `cat` and `brand`, so it described an
    // endpoint that was not there. It was removed with a note to bring it back
    // only alongside a real search route, and `/{lang}/search` is that route:
    // a GET form whose every result set has its own URL, which is exactly the
    // contract this markup promises Google it can exercise.
    //
    // Russian, because `DEFAULT_SEO_LANG` is the locale the domain serves
    // first and the searchbox takes one target.
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/${DEFAULT_SEO_LANG}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/* ─────────────────────────────────────────────────────────────
   Product-level schema
   ───────────────────────────────────────────────────────────── */

/**
 * Product schema with an Offer. `price` is nullable in the catalogue ("on
 * request"); Google rejects an Offer without a price, so those products get
 * availability and seller only, with no `priceSpecification`.
 */
/**
 * Canonical paths for the product architecture.
 *
 * `/catalog` and `/catalog/{id}` were replaced by a brand-first tree, and these
 * three builders are the only place that knows the new shape. Schema, the
 * sitemap generator, the redirect map, breadcrumbs and every internal link all
 * resolve through them, so the URL structure cannot drift between what we tell
 * Google and what the router actually serves.
 */
export function brandPath(brandSlug: string): string {
  return `/${brandSlug}`;
}

export function productPath(p: Pick<Product, "brandSlug" | "slug">): string {
  return `/${p.brandSlug}/${p.slug}`;
}

export function productSpecsPath(p: Pick<Product, "brandSlug" | "slug">): string {
  return `/${p.brandSlug}/${p.slug}/specs`;
}

/**
 * How long a quoted price is asserted to hold.
 *
 * Google requires `priceValidUntil` on an Offer to show a price in a merchant
 * rich result, and treats an expired one as a stale price — which suppresses
 * the result entirely. A fixed date in a source file would go stale the moment
 * it passed, so this is derived: one year from build, rounded to the end of the
 * month, which is both an honest horizon for a distributor's list price and
 * self-renewing on every deploy.
 */
// Exported for `seo-product.ts`; no product dependency of its own.
export function priceValidUntil(): string {
  const d = new Date();
  // Day 0 of month+13 is the last day of month+12 — i.e. a year out, rounded up
  // to a month boundary rather than landing on an arbitrary build date.
  const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 13, 0));
  return end.toISOString().slice(0, 10);
}

/**
 * Delivery and returns, as schema.org sees them.
 *
 * Both are published policy on the site (free delivery across Uzbekistan; the
 * 5-day return / 24-hour exchange terms in the footer), so emitting them is
 * restating what is already on the page in a form Google can parse — not a new
 * claim. Merchant listings that carry shipping and return details get richer
 * treatment than those that don't, and neither can be inferred from prose.
 */
// Exported for `seo-product.ts`; no product dependency of its own.
export function shippingDetails() {
  return {
    "@type": "OfferShippingDetails",
    shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "UZS" },
    shippingDestination: {
      "@type": "DefinedRegion",
      addressCountry: BUSINESS.country,
    },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
      transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 3, unitCode: "DAY" },
    },
  };
}

// Exported for `seo-product.ts`; no product dependency of its own.
export function returnPolicy() {
  return {
    "@type": "MerchantReturnPolicy",
    applicableCountry: BUSINESS.country,
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 5,
    returnMethod: "https://schema.org/ReturnInStore",
    returnFees: "https://schema.org/FreeReturn",
  };
}

/**
 * `trail` paths are language-neutral ("/catalog"); the locale prefix is added
 * here so the breadcrumb points at the URL that actually serves 200 for this
 * language rather than the unprefixed path, which now 301s.
 */
export function breadcrumbSchema(trail: { name: string; path: string }[], lang: SeoLang) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: step.name,
      item: absolute(localePath(lang, step.path)),
    })),
  };
}

/**
 * FAQPage from question/answer pairs.
 *
 * The pairs must be the ones this locale actually renders — Google treats schema
 * that disagrees with the visible page text as mismatched markup.
 */
export function faqSchema(items: { q: string; a: string }[], lang: SeoLang) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    // A voice assistant reading this page aloud should read the answers, not
    // the nav and the price pills. The CSS selectors point at the FAQ markup
    // `Faq.tsx` emits — the same `data-faq` hook `qa-faq.mjs` scopes to, so a
    // change to the component that broke this would fail QA rather than
    // silently degrade to an assistant reading the wrong text.
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["[data-faq] [data-faq-q]", "[data-faq] [data-faq-a]"],
    },
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** The repair/service offering — feeds "ремонт рации Ташкент" style queries. */
export function serviceSchema(
  opts: { name: string; description: string; path: string },
  lang: SeoLang,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    inLanguage: lang,
    url: absolute(localePath(lang, opts.path)),
    serviceType: "Two-way radio repair and maintenance",
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "Uzbekistan" },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: absolute(localePath(lang, opts.path)),
      servicePhone: BUSINESS.phones[0],
      serviceLocation: { "@id": `${SITE_URL}/#localbusiness` },
    },
  };
}

/**
 * SiteNavigationElement — the main sections, in the order the nav presents them.
 *
 * Google generates sitelinks algorithmically and no markup forces them, but this
 * is the schema that states the site's top-level hierarchy explicitly, and it
 * pairs with the breadcrumb trail and the sitemap to make that hierarchy
 * unambiguous. Titles here match each page's <title> so the signals agree.
 */
export function siteNavigationSchema(
  items: { name: string; description: string; path: string }[],
  lang: SeoLang,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/${lang}#sitenav`,
    name: SITE_NAME,
    inLanguage: lang,
    itemListElement: items.map((item, i) => ({
      "@type": "SiteNavigationElement",
      position: i + 1,
      name: item.name,
      description: item.description,
      url: absolute(localePath(lang, item.path)),
    })),
  };
}

/**
 * The main sections, in nav order, keyed to their `meta.section.*` i18n strings.
 *
 * The nav labels used to be hardcoded Russian here, which meant the
 * SiteNavigationElement graph advertised Russian section names on /en and /uz.
 * Only the paths and keys are structural; the copy is resolved per language at
 * the call site.
 */
export const SITE_SECTIONS = [
  { key: "radiocom", path: "/radiocom" },
  { key: "motorola", path: "/motorola" },
  { key: "compare", path: "/compare" },
  { key: "poc", path: "/poc" },
  { key: "service", path: "/service" },
  { key: "industries", path: "/industries" },
  { key: "search", path: "/search" },
] as const;

/** ItemList for the catalogue grid — helps Google understand the collection page. */
export function itemListSchema(items: Product[], lang: SeoLang) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: items.length,
    inLanguage: lang,
    itemListElement: items.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absolute(localePath(lang, productPath(p))),
      name: p.name,
    })),
  };
}

/**
 * The page itself, as an entity.
 *
 * `Product` describes the thing for sale; nothing described the *page*. Without
 * a `WebPage` node the breadcrumb, the FAQ and the product all float
 * unattached, and `primaryImageOfPage` — which is how Google picks a thumbnail
 * for a result — has nowhere to live.
 *
 * `isPartOf` points at the `WebSite` node the root already emits, so the graph
 * connects rather than repeating itself.
 */
export function webPageSchema(opts: {
  lang: SeoLang;
  path: string;
  name: string;
  description: string;
  image?: string;
}) {
  const url = absolute(localePath(opts.lang, opts.path));
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: opts.name,
    description: opts.description,
    inLanguage: opts.lang,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    ...(opts.image
      ? {
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: absolute(opts.image),
            contentUrl: absolute(opts.image),
          },
        }
      : {}),
  };
}

/**
 * The brand page as a `CollectionPage`, carrying its own price range.
 *
 * A bare `ItemList` tells Google the page contains twelve links. A
 * `CollectionPage` whose `mainEntity` is that list, with an `AggregateOffer`
 * spanning the family's real price floor and ceiling, tells it the page *is*
 * the Motorola range and what that range costs — which is what a "Motorola
 * рации цена" query is actually asking.
 *
 * `lowPrice`/`highPrice` are computed from the same `visibleProducts` the page
 * renders, so a hidden model cannot leak a price into the range, and a model
 * with no published price contributes nothing rather than a zero.
 */
export function collectionPageSchema(opts: {
  items: Product[];
  lang: SeoLang;
  path: string;
  name: string;
  description: string;
}) {
  const url = absolute(localePath(opts.lang, opts.path));
  const prices = opts.items.map((p) => p.price).filter((n): n is number => n != null);

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: opts.name,
    description: opts.description,
    inLanguage: opts.lang,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: opts.items.length,
      itemListElement: opts.items.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absolute(localePath(opts.lang, productPath(p))),
        name: p.name,
      })),
    },
    ...(prices.length
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "UZS",
            lowPrice: Math.min(...prices),
            highPrice: Math.max(...prices),
            offerCount: opts.items.length,
            availability: "https://schema.org/InStock",
            seller: { "@id": `${SITE_URL}/#organization` },
          },
        }
      : {}),
  };
}
