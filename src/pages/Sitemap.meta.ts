/**
 * Route meta for `/$lang/sitemap`, deliberately outside the page module.
 *
 * `head` is the one route property TanStack cannot code-split: it is absent
 * from the plugin's `splitRouteIdentNodes` because SSR needs it synchronously
 * to render the document head. Whatever it imports is therefore eager for
 * every visitor on every route. Kept in the page module, the route file had to
 * import that module to reach `head`, which dragged the whole page body into
 * the entry chunk behind it.
 */
import { tFor } from "@/lib/i18n";
import {
  breadcrumbSchema,
  jsonLd,
  localeLinks,
  pageMeta,
  type SeoLang,
  webPageSchema,
} from "@/lib/seo";

export const head = ({ params }: { params: { lang: SeoLang } }) => {
  const t = tFor(params.lang);
  const path = "/sitemap";
  return {
    meta: pageMeta({
      lang: params.lang,
      title: `${t("sitemap.title")} — Radiocom`,
      // `meta.sitemap.desc`, not `sitemap.sub`. The subtitle is one short line
      // written to sit under a heading — «Все страницы Radiocom в одном
      // списке.», 37 characters — which is too little for Google to use as a
      // snippet. The `sitemap.sub` on the page itself is unchanged.
      description: t("meta.sitemap.desc"),
      path,
      ogCard: "sitemap",
    }),
    links: localeLinks(params.lang, path),
    scripts: [
      jsonLd(
        webPageSchema({
          name: t("sitemap.title"),
          description: t("sitemap.sub"),
          path,
          lang: params.lang,
        }),
      ),
      jsonLd(
        breadcrumbSchema(
          [
            { name: t("nav.home"), path: "/" },
            { name: t("sitemap.title"), path },
          ],
          params.lang,
        ),
      ),
    ],
  };
};
