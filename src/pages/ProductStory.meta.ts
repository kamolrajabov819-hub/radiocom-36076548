/**
 * Route meta for `/{lang}/{brand}/{model}`, deliberately outside the page module.
 *
 * `head` is the one route property TanStack cannot code-split — it is absent
 * from the plugin's `splitRouteIdentNodes` because SSR needs it synchronously.
 * Keeping it here lets the route files name `component` explicitly, which is
 * what lets the splitter lift the page body into its own chunk.
 */
import { formatPrice, isBrandSlug, productBySlug } from "@/data/products";
import { pick } from "@/data/spec-dict";
import { specs } from "@/data/specs";
import { tFor } from "@/lib/i18n";
import {
  brandPath,
  breadcrumbSchema,
  jsonLd,
  localeLinks,
  pageMeta,
  preloadImage,
  productPath,
  type SeoLang,
  webPageSchema,
} from "@/lib/seo";
import { productSchema } from "@/lib/seo-product";

export const head = ({ params }: { params: { lang: SeoLang; brand: string; model: string } }) => {
  if (!isBrandSlug(params.brand)) return {};
  const brandSlug = params.brand;
  const t = tFor(params.lang);
  const p = productBySlug(brandSlug, params.model);
  if (!p) return {};

  const path = productPath(p);
  const title = t("meta.product.title", { name: p.name });
  const description = t("meta.product.desc", {
    blurb: pick(p.blurb, params.lang),
    range: pick(p.rangeCity, params.lang),
    price: formatPrice(p.price, params.lang),
  });
  const spec = specs[p.id];

  return {
    meta: pageMeta({
      lang: params.lang,
      title,
      description,
      path,
      ogCard: `product-${p.slug}`,
      type: "product",
      product: { price: p.price },
    }),
    links: [
      ...localeLinks(params.lang, path),
      // The hero photograph is the LCP element here, and its candidate set
      // must match the <img> in `Hero` exactly or the browser fetches the
      // image twice.
      preloadImage({
        src: p.image,
        small: p.imageSmall,
        sizes: "(min-width: 768px) 520px, 88vw",
      }),
    ],
    scripts: [
      jsonLd(
        webPageSchema({
          lang: params.lang,
          path,
          name: title,
          description,
          image: p.image,
        }),
      ),
      jsonLd(
        productSchema(p, params.lang, {
          specs: (spec?.rows ?? []).map((r) => ({
            name: pick(r.label, params.lang),
            value: pick(r.value, params.lang),
          })),
        }),
      ),
      jsonLd(
        breadcrumbSchema(
          [
            { name: t("nav.home"), path: "/" },
            { name: t(`meta.crumb.${brandSlug}`), path: brandPath(brandSlug) },
            { name: p.name, path },
          ],
          params.lang,
        ),
      ),
    ],
  };
};
