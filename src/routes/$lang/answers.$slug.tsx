import { createFileRoute, notFound } from "@tanstack/react-router";
import { head } from "@/pages/AnswerDetail.meta";
import { AnswerDetailPage } from "@/pages/AnswerDetail";
import { ANSWER_SLUGS } from "@/data/answers";

/**
 * `/{lang}/answers/{slug}`.
 *
 * The guard is in `beforeLoad` for the same reason as the industry and specs
 * routes: in SSR a `notFound()` thrown during render arrives after the response
 * has already committed 200, so the router can only swap the body — a soft 404
 * that Google indexes as a real page. Thrown here, the status is right.
 *
 * `ANSWER_SLUGS` is the *published* list, so a draft answer 404s exactly like a
 * slug that never existed.
 */
export const Route = createFileRoute("/$lang/answers/$slug")({
  beforeLoad: ({ params }) => {
    if (!ANSWER_SLUGS.includes(params.slug)) throw notFound();
  },
  head,
  component: AnswerDetailPage,
});
