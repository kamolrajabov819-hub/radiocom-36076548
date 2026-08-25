/**
 * Route meta for `/$lang/poc`, deliberately outside the page module.
 *
 * `head` is the one route property TanStack cannot code-split: it is absent
 * from the plugin's `splitRouteIdentNodes` because SSR needs it synchronously
 * to render the document head. Whatever it imports is therefore eager for
 * every visitor on every route. Kept in the page module, the route file had to
 * import that module to reach `head`, which dragged the whole page body into
 * the entry chunk behind it.
 */
import heroPair from "@/assets/cutout/pair-crossed-cutout.webp";
import heroPair800 from "@/assets/cutout/pair-crossed-cutout@800.webp";
import { tFor } from "@/lib/i18n";
import {
  breadcrumbSchema,
  jsonLd,
  localeLinks,
  pageMeta,
  preloadImage,
  serviceSchema,
  type SeoLang,
} from "@/lib/seo";

export const head = ({ params }: { params: { lang: SeoLang } }) => {
  const t = tFor(params.lang);
  return {
    meta: pageMeta({
      lang: params.lang,
      title: t("meta.poc.title"),
      description: t("meta.poc.desc"),
      path: "/poc",
      ogCard: "poc",
    }),
    links: [
      ...localeLinks(params.lang, "/poc"),
      // The hero is this page's LCP element and now ships a real srcset pair,
      // so the preload has to advertise the same candidate set the <img>
      // chooses from — otherwise the browser preloads one file and fetches
      // another. Gate 12 checks exactly this.
      preloadImage({
        src: heroPair,
        small: heroPair800,
        sizes: "(max-width: 768px) 86vw, 720px",
      }),
    ],
    // /poc was the only page on the site emitting no structured data at all,
    // despite being a named product line with its own service offer.
    scripts: [
      jsonLd(
        serviceSchema(
          {
            name: t("poc.design.title"),
            description: t("meta.poc.desc"),
            path: "/poc",
          },
          params.lang,
        ),
      ),
      jsonLd(
        breadcrumbSchema(
          [
            { name: t("nav.home"), path: "/" },
            { name: t("nav.poc"), path: "/poc" },
          ],
          params.lang,
        ),
      ),
    ],
  };
};
