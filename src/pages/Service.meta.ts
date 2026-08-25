/**
 * Route meta for `/{lang}/service`, kept out of the page module on purpose.
 *
 * `head` is the one part of a route TanStack cannot code-split — it is absent
 * from the plugin's `splitRouteIdentNodes` because SSR needs it synchronously
 * to render the document head. So whatever `head` imports is eager for every
 * visitor, on every route, forever.
 *
 * Leaving it in `Service.tsx` meant the route file imported that module to
 * reach `head`, which dragged the entire page — framer-motion usage, nine image
 * imports, the whole component tree — into the eager chunk with it. That is why
 * the splitter had nothing to lift. Here it imports `@/lib/seo` and
 * `@/lib/i18n` and nothing else.
 */
import {
  SITE_NAME,
  breadcrumbSchema,
  faqSchema,
  jsonLd,
  localeLinks,
  pageMeta,
  serviceSchema,
  type SeoLang,
} from "@/lib/seo";
import { tFor } from "@/lib/i18n";

export const head = ({ params }: { params: { lang: SeoLang } }) => {
  const t = tFor(params.lang);
  return {
    meta: pageMeta({
      lang: params.lang,
      title: t("meta.service.title"),
      description: t("meta.service.desc"),
      path: "/service",
      ogCard: "service",
    }),
    links: localeLinks(params.lang, "/service"),
    scripts: [
      jsonLd(
        serviceSchema(
          {
            name: t("meta.service.schema_name"),
            description: t("meta.service.schema_desc"),
            path: "/service",
          },
          params.lang,
        ),
      ),
      jsonLd(
        breadcrumbSchema(
          [
            { name: SITE_NAME, path: "/" },
            { name: t("meta.crumb.service"), path: "/service" },
          ],
          params.lang,
        ),
      ),
      // The repair policy accordion is already a list of questions and
      // answers, translated in all three locales — it just was not marked up
      // as one. Free eligibility for an FAQ rich result on the page that
      // answers "how much does a repair cost".
      jsonLd(
        faqSchema(
          t("service.policy", { returnObjects: true }) as { q: string; a: string }[],
          params.lang,
        ),
      ),
    ],
  };
};
