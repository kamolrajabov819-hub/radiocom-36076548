import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_LANG, isLang } from "@/lib/i18n";
import { legacyCatalogTarget } from "@/data/products";

/**
 * `/{lang}/catalog/{id}` -> `/{lang}/{brand}/{model}`, permanently.
 *
 * The map is derived from `products` rather than written out, so a model added
 * or renamed in the data layer cannot leave a dangling old URL behind. An id
 * that no longer exists falls through to the brand page rather than 404ing:
 * these are indexed URLs, and the nearest relevant page keeps the visitor and
 * passes the signal on, where a 404 throws both away.
 *
 * `legacyCatalogTarget` also handles the hidden models, whose product pages
 * 404 by design — sending them to their own product URL made a 301 -> 404
 * chain. It is shared with `scripts/generate-seo.ts` so the router and the
 * host redirect table cannot disagree about where an old URL goes.
 */
export const Route = createFileRoute("/$lang/catalog/$id")({
  beforeLoad: ({ params }) => {
    // `params.lang` is a raw string off the URL; narrow it so an invented
    // locale lands on the default rather than propagating an unknown code
    // into a 301 target.
    const lang = isLang(params.lang) ? params.lang : DEFAULT_LANG;
    const target = legacyCatalogTarget(params.id);
    if (target && "model" in target) {
      throw redirect({
        to: "/$lang/$brand/$model",
        params: { lang, brand: target.brand, model: target.model },
        statusCode: 301,
      });
    }
    throw redirect({
      to: target?.brand === "motorola" ? "/$lang/motorola" : "/$lang/radiocom",
      params: { lang },
      statusCode: 301,
    });
  },
});
