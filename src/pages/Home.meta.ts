/**
 * Route meta for `/$lang/`, deliberately outside the page module.
 *
 * `head` is the one route property TanStack cannot code-split: it is absent
 * from the plugin's `splitRouteIdentNodes` because SSR needs it synchronously
 * to render the document head. Whatever it imports is therefore eager for
 * every visitor on every route. Kept in the page module, the route file had to
 * import that module to reach `head`, which dragged the whole page body into
 * the entry chunk behind it.
 */
import heroImage from "@/assets/hero-rcd60-cutout.webp";
import heroImage800 from "@/assets/hero-rcd60-cutout@800.webp";
import { tFor } from "@/lib/i18n";
import {
  SITE_SECTIONS,
  jsonLd,
  localeLinks,
  pageMeta,
  preloadImage,
  siteNavigationSchema,
  type SeoLang,
} from "@/lib/seo";

export const head = ({ params }: { params: { lang: SeoLang } }) => {
  const t = tFor(params.lang);
  const title = t("meta.home.title");
  const description = t("meta.home.desc");

  return {
    meta: pageMeta({ lang: params.lang, title, description, path: "/", ogCard: "home" }),
    links: [
      ...localeLinks(params.lang, "/"),
      // The hero cutout is the LCP element here. Candidate set and sizes must
      // match the <img> below exactly, or the browser picks a different
      // candidate and downloads the image twice.
      preloadImage({
        src: heroImage,
        small: heroImage800,
        sizes: "(min-width: 768px) 597px, 94vw",
      }),
    ],
    // The section graph lives on the homepage: it is the page Google reads
    // hierarchy from when it generates sitelinks, and only here can the URLs
    // be locale-correct (the root route's head() has no params).
    scripts: [
      jsonLd(
        siteNavigationSchema(
          SITE_SECTIONS.map((sec) => ({
            name: t(`meta.section.${sec.key}_name`),
            description: t(`meta.section.${sec.key}_desc`),
            path: sec.path,
          })),
          params.lang,
        ),
      ),
    ],
  };
};
