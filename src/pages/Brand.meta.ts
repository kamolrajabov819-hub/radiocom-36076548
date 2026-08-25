/**
 * Route meta for the two brand pages, deliberately outside the page module.
 *
 * `head` is the one route property TanStack cannot code-split — it is absent
 * from the plugin's `splitRouteIdentNodes` because SSR needs it synchronously.
 * Keeping it here lets the route files name `component` explicitly, which is
 * what lets the splitter lift the page body into its own chunk.
 */
import { productsOfBrand, type BrandSlug } from "@/data/products";
import { tFor } from "@/lib/i18n";
import {
  brandPath,
  breadcrumbSchema,
  collectionPageSchema,
  jsonLd,
  localeLinks,
  pageMeta,
  preloadImage,
  type SeoLang,
  webPageSchema,
} from "@/lib/seo";

export const brandHead =
  (brandSlug: BrandSlug) =>
  ({ params }: { params: { lang: SeoLang } }) => {
    const t = tFor(params.lang);
    const list = productsOfBrand(brandSlug);
    const title = t(`meta.brand.${brandSlug}_title`);
    const description = t(`meta.brand.${brandSlug}_desc`, { count: list.length });
    const path = brandPath(brandSlug);

    return {
      meta: pageMeta({ lang: params.lang, title, description, path, ogCard: brandSlug }),
      links: [
        ...localeLinks(params.lang, path),
        // The first lineup card is the LCP element on this page at every
        // width — the model strip above it is 52px thumbnails.
        ...(list[0]
          ? [
              preloadImage({
                src: list[0].image,
                small: list[0].imageSmall,
                sizes: "(min-width: 1280px) 240px, (min-width: 640px) 45vw, 80vw",
              }),
            ]
          : []),
      ],
      scripts: [
        jsonLd(
          webPageSchema({
            lang: params.lang,
            path,
            name: title,
            description,
            image: list[0]?.image,
          }),
        ),
        // `CollectionPage` rather than a bare `ItemList`: it carries the
        // family's real price range as an `AggregateOffer`, which is what a
        // "Motorola рации цена" query is asking and what an ItemList of
        // twelve links cannot answer.
        jsonLd(
          collectionPageSchema({
            items: list,
            lang: params.lang,
            path,
            name: t(`brand.${brandSlug}_title`),
            description,
          }),
        ),
        jsonLd(
          breadcrumbSchema(
            [
              { name: t("nav.home"), path: "/" },
              { name: t(`brand.${brandSlug}_title`), path },
            ],
            params.lang,
          ),
        ),
      ],
    };
  };
