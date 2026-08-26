import { createFileRoute, notFound } from "@tanstack/react-router";
import { head } from "@/pages/IndustryDetail.meta";
import { IndustryPage } from "@/pages/IndustryDetail";
import { INDUSTRY_SLUGS, type IndustrySlug } from "@/data/industries";

/** `/{lang}/industries/{slug}` — see the specs route for why the guard lives here. */
export const Route = createFileRoute("/$lang/industries/$slug")({
  beforeLoad: ({ params }) => {
    // This ran nowhere for a while. The check was written into
    // `IndustryDetail.meta.ts` as a bare `beforeLoad:` statement, which
    // JavaScript parses as a *label* on a function expression rather than an
    // object property — so it was never exported, never called, and every
    // unknown slug answered 200 with `industries.<slug>.name` printed raw in
    // the title, on a route that accepts any string. `eslint` had been calling
    // it out as `no-unused-labels` the whole time, under 197 MB of noise from
    // linting vendored skill packages.
    //
    // Thrown here rather than in the component for the same reason as the specs
    // route: in SSR a `notFound()` during render arrives after the response has
    // committed 200, so the router can only swap the body — a soft 404.
    if (!INDUSTRY_SLUGS.includes(params.slug as IndustrySlug)) throw notFound();
  },
  head,
  component: IndustryPage,
});
