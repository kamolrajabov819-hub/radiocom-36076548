/**
 * Route meta for `/$lang/search`, deliberately outside the page module.
 *
 * `head` is the one route property TanStack cannot code-split: it is absent
 * from the plugin's `splitRouteIdentNodes` because SSR needs it synchronously
 * to render the document head. Whatever it imports is therefore eager for
 * every visitor on every route. Kept in the page module, the route file had to
 * import that module to reach `head`, which dragged the whole page body into
 * the entry chunk behind it.
 */
import { visibleProducts } from "@/data/products";
import { tFor } from "@/lib/i18n";
import {
  breadcrumbSchema,
  itemListSchema,
  jsonLd,
  localeLinks,
  pageMeta,
  type SeoLang,
  webPageSchema,
} from "@/lib/seo";

export const validateSearch = (search: Record<string, unknown>): { q?: string } => {
  const q = typeof search.q === "string" ? search.q.slice(0, 120) : undefined;
  return q ? { q } : {};
};

export const head = ({
  params,
  match,
}: {
  params: { lang: SeoLang };
  match?: { search?: { q?: string } };
}) => {
  const t = tFor(params.lang);
  const path = "/search";
  // Only a *results* page is noindexed, not the form.
  //
  // The two are different pages wearing one route. `/search` with no query
  // is a real destination: it is linked from the chrome and the HTML
  // sitemap, it is the URL the WebSite node's SearchAction advertises, and
  // there is exactly one of it — so it stays indexable and stays in the
  // sitemap. `/search?q=…` is the opposite: it answers 200 for any string
  // anyone types, which is an unbounded set of thin pages duplicating the
  // catalogue they link to, and it is the case Google's own guidance on
  // internal search results is about.
  //
  // `follow` on both counts: the product links on a results page are real
  // and worth crawling, which is also why this is a meta tag rather than a
  // robots.txt disallow — a blocked URL is one whose noindex is never read.
  const isResults = Boolean(match?.search?.q);
  return {
    meta: pageMeta({
      lang: params.lang,
      title: t("meta.search.title"),
      description: t("meta.search.desc"),
      path,
      ogCard: "search",
      noindex: isResults,
    }),
    links: localeLinks(params.lang, path),
    scripts: [
      jsonLd(
        webPageSchema({
          name: t("meta.search.title"),
          description: t("meta.search.desc"),
          path,
          lang: params.lang,
        }),
      ),
      jsonLd(itemListSchema(visibleProducts, params.lang)),
      jsonLd(
        breadcrumbSchema(
          [
            { name: t("nav.home"), path: "/" },
            { name: t("meta.crumb.search"), path },
          ],
          params.lang,
        ),
      ),
    ],
  };
};
