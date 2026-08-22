import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_LANG, isLang } from "@/lib/i18n";
import { products } from "@/data/products";

/**
 * `/{lang}/catalog/{id}` -> `/{lang}/{brand}/{model}`, permanently.
 *
 * The map is derived from `products` rather than written out, so a model added
 * or renamed in the data layer cannot leave a dangling old URL behind. An id
 * that no longer exists falls through to the brand page rather than 404ing:
 * these are indexed URLs, and the nearest relevant page keeps the visitor and
 * passes the signal on, where a 404 throws both away.
 */
export const Route = createFileRoute("/$lang/catalog/$id")({
  beforeLoad: ({ params }) => {
    // `params.lang` is a raw string off the URL; narrow it so an invented
    // locale lands on the default rather than propagating an unknown code
    // into a 301 target.
    const lang = isLang(params.lang) ? params.lang : DEFAULT_LANG;
    const p = products.find((x) => x.id === params.id);
    if (p) {
      throw redirect({
        to: "/$lang/$brand/$model",
        params: { lang, brand: p.brandSlug, model: p.slug },
        statusCode: 301,
      });
    }
    throw redirect({
      to: "/$lang/radiocom",
      params: { lang },
      statusCode: 301,
    });
  },
});
