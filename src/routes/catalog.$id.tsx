import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_LANG } from "@/lib/i18n";
import { products } from "@/data/products";

/**
 * Legacy unprefixed product URL — `/catalog/{id}`.
 *
 * Two things changed since this route was written: everything moved under a
 * locale prefix, and the catalogue was replaced by a brand-first tree. This
 * redirect resolves **both hops at once**, straight to
 * `/ru/{brand}/{model}`.
 *
 * That single-hop landing is the point. Chaining
 * `/catalog/x` -> `/ru/catalog/x` -> `/ru/radiocom/x` would work for a human
 * but each additional hop dilutes what a 301 passes on and burns crawl budget,
 * and Google gives up entirely after a handful. These are the oldest indexed
 * URLs on the site, so they are precisely the ones worth landing in one jump.
 *
 * The redirect lives in the router rather than host config because
 * `netlify.toml` still declares `publish = "dist"` while the build emits to
 * `.output/`, so the host redirect table cannot be relied upon.
 */
export const Route = createFileRoute("/catalog/$id")({
  beforeLoad: ({ params }) => {
    const p = products.find((x) => x.id === params.id);
    if (p) {
      throw redirect({
        to: "/$lang/$brand/$model",
        params: { lang: DEFAULT_LANG, brand: p.brandSlug, model: p.slug },
        statusCode: 301,
      });
    }
    throw redirect({
      to: "/$lang/radiocom",
      params: { lang: DEFAULT_LANG },
      statusCode: 301,
    });
  },
});
