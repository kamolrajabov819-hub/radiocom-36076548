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

import type { Product } from "@/data/products";
import { pick } from "@/data/spec-dict";

export const LANGS = ["ru", "en", "uz"] as const;
export type SeoLang = (typeof LANGS)[number];
export const DEFAULT_SEO_LANG: SeoLang = "ru";

/** Production origin. Used for canonicals, sitemap entries and absolute schema URLs. */
export const SITE_URL = "https://radiocom.uz";

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
  image?: string;
  type?: "website" | "article" | "product";
}) {
  const url = absolute(localePath(opts.lang, opts.path));
  const type = opts.type ?? "website";

  return [
    { title: opts.title },
    { name: "description", content: opts.description },
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
    ...(opts.image ? [{ property: "og:image", content: absolute(opts.image) }] : []),
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: opts.title },
    { name: "twitter:description", content: opts.description },
    ...(opts.image ? [{ name: "twitter:image", content: absolute(opts.image) }] : []),
  ];
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
    logo: absolute("/favicon.png"),
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
    image: absolute("/favicon.png"),
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
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/ru/catalog?q={search_term_string}`,
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
export function productSchema(
  p: Product,
  lang: SeoLang,
  extra?: { specs?: { name: string; value: string }[] },
) {
  const url = absolute(localePath(lang, `/catalog/${p.id}`));
  const offer: Record<string, unknown> = {
    "@type": "Offer",
    url,
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: { "@id": `${SITE_URL}/#organization` },
  };
  if (p.price != null) {
    offer.price = p.price;
    offer.priceCurrency = "UZS";
  }

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: p.name,
    sku: p.id,
    description: pick(p.blurb, lang),
    inLanguage: lang,
    image: [absolute(p.image), ...(p.gallery ?? []).map(absolute)],
    brand: { "@type": "Brand", name: p.brand },
    category:
      p.category === "professional" ? "Professional two-way radios" : "Consumer two-way radios",
    offers: offer,
    ...(extra?.specs?.length
      ? {
          additionalProperty: extra.specs.map(({ name, value }) => ({
            "@type": "PropertyValue",
            name,
            value,
          })),
        }
      : {}),
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
  { key: "catalog", path: "/catalog" },
  { key: "poc", path: "/poc" },
  { key: "service", path: "/service" },
  { key: "industries", path: "/industries" },
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
      url: absolute(localePath(lang, `/catalog/${p.id}`)),
      name: p.name,
    })),
  };
}
