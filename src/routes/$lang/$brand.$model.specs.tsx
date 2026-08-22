import { createFileRoute, notFound } from "@tanstack/react-router";
import { productSpecsRouteOptions } from "@/pages/ProductSpecs";
import { isBrandSlug, productBySlug } from "@/data/products";

/** `/{lang}/{brand}/{model}/specs` — see the story route for why this is parameterised. */
export const Route = createFileRoute("/$lang/$brand/$model/specs")({
  beforeLoad: ({ params }) => {
    // Both checks run here, not in the component. A `notFound()` thrown during
    // render is too late in SSR: the response has already committed 200 and the
    // router can only swap the body, which produces a soft 404 — a page that
    // says "not found" while telling crawlers it is a valid page. Throwing in
    // `beforeLoad` lets the router set the real status.
    if (!isBrandSlug(params.brand)) throw notFound();
    if (!productBySlug(params.brand, params.model)) throw notFound();
  },
  ...productSpecsRouteOptions(),
});
