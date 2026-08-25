/**
 * Route meta for `/{lang}/{brand}/{model}/specs`, deliberately outside the page module.
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
  productPath,
  productSpecsPath,
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

  const path = productSpecsPath(p);
  const spec = specs[p.id];

  const title = t("meta.specs.title", { name: p.name });
  const description = t("meta.specs.desc", {
    name: p.name,
    price: formatPrice(p.price, params.lang),
  });

  return {
    meta: pageMeta({
      lang: params.lang,
      title,
      description,
      path,
      ogCard: `product-${p.slug}`,
      type: "product",
    }),
    links: localeLinks(params.lang, path),
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
            { name: p.name, path: productPath(p) },
            { name: t("meta.crumb.specs"), path },
          ],
          params.lang,
        ),
      ),
    ],
  };
};
