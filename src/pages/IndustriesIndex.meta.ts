/**
 * Route meta for `/$lang/industries/`, deliberately outside the page module.
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
  SITE_NAME,
  breadcrumbSchema,
  jsonLd,
  localeLinks,
  pageMeta,
  type SeoLang,
} from "@/lib/seo";

export const head = ({ params }: { params: { lang: SeoLang } }) => {
  const t = tFor(params.lang);
  return {
    meta: pageMeta({
      lang: params.lang,
      title: t("meta.industries.title"),
      description: t("meta.industries.desc"),
      path: "/industries",
      ogCard: "industries",
    }),
    links: localeLinks(params.lang, "/industries"),
    scripts: [
      jsonLd(
        breadcrumbSchema(
          [
            { name: SITE_NAME, path: "/" },
            { name: t("meta.crumb.industries"), path: "/industries" },
          ],
          params.lang,
        ),
      ),
    ],
  };
};
