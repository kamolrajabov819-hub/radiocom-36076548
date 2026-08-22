import { createFileRoute, notFound } from "@tanstack/react-router";
import { productStoryRouteOptions } from "@/pages/ProductStory";
import { isBrandSlug, productBySlug } from "@/data/products";

/**
 * `/{lang}/{brand}/{model}` — the product story page for either brand.
 *
 * Parameterised rather than duplicated per brand: two literal route files would
 * be identical apart from a string, and the pair would have to be kept in step
 * by hand forever.
 *
 * The dynamic segment is safe here because TanStack ranks static segments above
 * dynamic ones, so `/{lang}/industries/{slug}` and `/{lang}/catalog/{id}` still
 * win their matches. `beforeLoad` rejects anything that is not one of the two
 * real brands, so a stray three-segment URL 404s properly instead of rendering
 * an empty product page and answering 200 — a soft 404 is worse for crawling
 * than a hard one.
 */
export const Route = createFileRoute("/$lang/$brand/$model/")({
  beforeLoad: ({ params }) => {
    // Both checks run here, not in the component. A `notFound()` thrown during
    // render is too late in SSR: the response has already committed 200 and the
    // router can only swap the body, which produces a soft 404 — a page that
    // says "not found" while telling crawlers it is a valid page. Throwing in
    // `beforeLoad` lets the router set the real status.
    if (!isBrandSlug(params.brand)) throw notFound();
    if (!productBySlug(params.brand, params.model)) throw notFound();
  },
  ...productStoryRouteOptions(),
});
