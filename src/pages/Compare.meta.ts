/**
 * Route meta for `/$lang/compare`, deliberately outside the page module.
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
} from "@/lib/seo";

export const head = ({ params }: { params: { lang: SeoLang } }) => {
  const t = tFor(params.lang);
  const path = "/compare";
  return {
    meta: pageMeta({
      lang: params.lang,
      title: t("meta.compare.title", { count: visibleProducts.length }),
      description: t("meta.compare.desc"),
      path,
      ogCard: "compare",
    }),
    links: localeLinks(params.lang, path),
    scripts: [
      jsonLd(itemListSchema(visibleProducts, params.lang)),
      jsonLd(
        breadcrumbSchema(
          [
            { name: t("nav.home"), path: "/" },
            { name: t("meta.crumb.compare"), path },
          ],
          params.lang,
        ),
      ),
    ],
  };
};
