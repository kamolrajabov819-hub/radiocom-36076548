import { createFileRoute, notFound } from "@tanstack/react-router";
import { head } from "@/pages/AnswerDetail.meta";
import { AnswerDetailPage } from "@/pages/AnswerDetail";
import { ANSWER_SLUGS, type AnswerSlug } from "@/data/answer-slugs";
import { loadAnswerContent } from "@/data/answers-content";
import { pickDeep } from "@/data/copy/pick";
import { DEFAULT_LANG, isLang } from "@/lib/i18n";

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
    if (!(ANSWER_SLUGS as readonly string[]).includes(params.slug)) throw notFound();
  },
  // This page's body, in this language only: the one answer module the reader
  // downloads, and on the server-rendered view it arrives inside the HTML.
  loader: async ({ params }) => {
    const lang = isLang(params.lang) ? params.lang : DEFAULT_LANG;
    return pickDeep(await loadAnswerContent(params.slug as AnswerSlug), lang);
  },
  head,
  component: AnswerDetailPage,
});
