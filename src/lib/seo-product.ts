/**
 * The schema builders that genuinely need the catalogue at runtime.
 *
 * Split out of `seo.ts` because that module is imported by every route's
 * `head()`, and `head()` is eager by construction — so a single runtime
 * reference to `visibleProducts` there put all 27 KB of `products.ts` and 27 KB
 * of `spec-dict.ts` into the entry chunk for `/service`, `/sitemap` and every
 * other page that never names a product.
 *
 * Only two things actually needed them: `relatedProducts`, which reads the
 * catalogue to find cross-shop candidates, and `productSchema`, which reads a
 * localised blurb through `pick`. Everything else in `seo.ts` used `Product`
 * purely as a type, which erases at compile time and costs nothing. With these
 * two moved, `seo.ts` imports `type Product` and nothing else from the data
 * layer.
 */

import { visibleProducts, type Product } from "@/data/products";
import { pick } from "@/data/spec-dict";
import {
  SITE_URL,
  absolute,
  localePath,
  priceValidUntil,
  productPath,
  productSpecsPath,
  returnPolicy,
  shippingDetails,
  type SeoLang,
} from "./seo";

/**
 * The models a buyer would cross-shop against this one: same brand, same tier,
 * capped at four so the node stays a hint rather than a dump of the catalogue.
 */
function relatedProducts(p: Product): Product[] {
  return visibleProducts
    .filter((o) => o.id !== p.id && o.brandSlug === p.brandSlug && o.category === p.category)
    .slice(0, 4);
}

export function productSchema(
  p: Product,
  lang: SeoLang,
  extra?: { specs?: { name: string; value: string }[] },
) {
  const url = absolute(localePath(lang, productPath(p)));
  const offer: Record<string, unknown> = {
    "@type": "Offer",
    url,
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: { "@id": `${SITE_URL}/#organization` },
    shippingDetails: shippingDetails(),
    hasMerchantReturnPolicy: returnPolicy(),
  };
  if (p.price != null) {
    offer.price = p.price;
    offer.priceCurrency = "UZS";
    offer.priceValidUntil = priceValidUntil();
  }

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: p.name,
    sku: p.id,
    description: pick(p.blurb, lang),
    inLanguage: lang,
    // `ImageObject` rather than bare URLs. Both are valid, but the object form
    // carries `caption` and marks the hero as the representative frame, which
    // is what Google Images uses to decide which of a product's photographs to
    // show. The bare-URL form gives it no way to tell them apart.
    image: [p.image, ...(p.gallery ?? [])].map((src, i) => ({
      "@type": "ImageObject",
      url: absolute(src),
      contentUrl: absolute(src),
      caption: i === 0 ? p.name : `${p.name} — ${i + 1}`,
      representativeOfPage: i === 0,
    })),
    brand: { "@type": "Brand", name: p.brand },
    category:
      p.category === "professional" ? "Professional two-way radios" : "Consumer two-way radios",
    // The specs page is the same product at a second URL. Declaring it as
    // `subjectOf` rather than leaving it to be discovered stops Google reading
    // the pair as duplicate product pages competing for one entity.
    subjectOf: {
      "@type": "WebPage",
      "@id": `${absolute(localePath(lang, productSpecsPath(p)))}#webpage`,
      url: absolute(localePath(lang, productSpecsPath(p))),
    },
    offers: offer,
    // The rest of the family, as `isRelatedTo`.
    //
    // Google resolves a catalogue into entities and needs to know which of 21
    // product pages are alternatives to each other. Without this it infers the
    // grouping from breadcrumbs and internal links, which gets the brand right
    // and the tier wrong — an RC-10 and an RCD-70 PRO share a brand page but
    // answer different queries. Related within a category, not within a brand,
    // is the grouping a buyer actually shops.
    isRelatedTo: relatedProducts(p).map((r) => ({
      "@type": "Product",
      "@id": `${absolute(localePath(lang, productPath(r)))}#product`,
      name: r.name,
      url: absolute(localePath(lang, productPath(r))),
    })),
    ...(extra?.specs?.length
      ? {
          additionalProperty: extra.specs.map(({ name, value }) => ({
            "@type": "PropertyValue",
            name,
            value,
          })),
        }
      : {}),
  };
}
