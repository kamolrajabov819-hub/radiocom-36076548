/**
 * The sitemap's page list and its XML renderer, shared by the two scripts that
 * need them.
 *
 * Split out of `generate-seo.ts` because the image extension cannot be written
 * in one pass. `generate-seo.ts` runs *before* vite, so at that point a
 * product's `image` is still the filesystem path Bun resolved the import to
 * (`/home/.../src/assets/catalog/rcd-70-hero.webp`) — not the fingerprinted
 * public URL the page will actually serve. Emitting those into a sitemap
 * advertises 404s to Google, which is worse than advertising nothing.
 *
 * So the work is split:
 *
 *   generate-seo.ts     pre-build   page URLs only -> public/sitemap.xml
 *   finalize-sitemap.ts post-build  page URLs + resolved images
 *                                   -> .output/public/sitemap.xml
 *
 * The pre-build file is a complete, valid sitemap on its own. If the finalizer
 * is ever skipped, the site ships a sitemap without image entries rather than
 * one full of broken ones.
 */
import { visibleProducts } from "../../src/data/products";
import { INDUSTRY_SLUGS } from "../../src/data/industries";
import {
  SITE_URL,
  LANGS,
  DEFAULT_SEO_LANG,
  localePath,
  productPath,
  productSpecsPath,
} from "../../src/lib/seo";

/**
 * `images` holds *source* paths. They mean nothing to a browser until
 * `finalize-sitemap.ts` maps them onto the built assets; a renderer with no
 * resolver drops them.
 */
export type Entry = { path: string; changefreq: string; priority: string; images?: string[] };

const imagesOf = (p: (typeof visibleProducts)[number]) => [p.image, ...(p.gallery ?? [])];

export const entries: Entry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  // The catalogue's single URL became two brand pages plus a compare table.
  // Both brands sit at the same priority: neither is a subordinate of the
  // other, and each is the entry point for a different search intent.
  {
    path: "/radiocom",
    changefreq: "weekly",
    priority: "0.9",
    images: visibleProducts.filter((p) => p.brandSlug === "radiocom").flatMap(imagesOf),
  },
  {
    path: "/motorola",
    changefreq: "weekly",
    priority: "0.9",
    images: visibleProducts.filter((p) => p.brandSlug === "motorola").flatMap(imagesOf),
  },
  { path: "/compare", changefreq: "monthly", priority: "0.7" },
  { path: "/poc", changefreq: "monthly", priority: "0.8" },
  { path: "/service", changefreq: "monthly", priority: "0.8" },
  { path: "/industries", changefreq: "monthly", priority: "0.7" },
  ...INDUSTRY_SLUGS.map((slug) => ({
    path: `/industries/${slug}`,
    changefreq: "monthly",
    priority: "0.7",
  })),
  // Product pages carry the long-tail model queries — the highest-intent
  // traffic. Each model now has two: the story page answers "what is this for"
  // and the specs page answers "what does it cost and what is in it". They are
  // separate URLs with separate titles because they serve separate queries
  // ("Radiocom RCD-60" vs "Radiocom RCD-60 характеристики"), and both are
  // built from `productPath`/`productSpecsPath` so the sitemap cannot drift
  // from what the router serves.
  ...visibleProducts.map((p) => ({
    path: productPath(p),
    changefreq: "weekly",
    priority: "0.8",
    images: imagesOf(p),
  })),
  ...visibleProducts.map((p) => ({
    // The specs page shows the hero in its buy card and nothing else, so it
    // advertises only that — listing the gallery here would claim the same
    // photograph belongs to a page that does not show it.
    path: productSpecsPath(p),
    changefreq: "weekly",
    priority: "0.7",
    images: [p.image],
  })),
];

/**
 * @param resolveImage maps a source image path to a site-absolute public path
 *   (`/assets/rcd-70-hero-DkW1gDWO.webp`), or `undefined` if it cannot. Omit it
 *   entirely to render a sitemap with no image extension at all.
 */
export function renderSitemap(
  list: Entry[],
  resolveImage?: (src: string) => string | undefined,
): string {
  const lastmod = new Date().toISOString().slice(0, 10);

  // Every page is emitted once per locale, and each entry advertises the full
  // alternate set including itself — Google discards an hreflang cluster whose
  // members do not all point at each other.
  const urls = list.flatMap((e) =>
    LANGS.map((lang) => {
      const alternates = [
        ...LANGS.map(
          (l) =>
            `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE_URL}${localePath(l, e.path)}"/>`,
        ),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${localePath(DEFAULT_SEO_LANG, e.path)}"/>`,
      ].join("\n");

      // De-duplicated: a model whose hero also appears in its own gallery would
      // otherwise be listed twice under one <url>, which Google treats as a
      // malformed entry rather than ignoring.
      const images = resolveImage
        ? [...new Set(e.images ?? [])]
            .map(resolveImage)
            .filter((u): u is string => Boolean(u))
            .map((u) => `    <image:image><image:loc>${SITE_URL}${u}</image:loc></image:image>`)
            .join("\n")
        : "";

      return (
        `  <url>\n` +
        `    <loc>${SITE_URL}${localePath(lang, e.path)}</loc>\n` +
        `${alternates}\n` +
        (images ? `${images}\n` : "") +
        `    <lastmod>${lastmod}</lastmod>\n` +
        `    <changefreq>${e.changefreq}</changefreq>\n` +
        `    <priority>${e.priority}</priority>\n` +
        `  </url>`
      );
    }),
  );

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
    `        xmlns:xhtml="http://www.w3.org/1999/xhtml"\n` +
    `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
    urls.join("\n") +
    `\n</urlset>\n`
  );
}
