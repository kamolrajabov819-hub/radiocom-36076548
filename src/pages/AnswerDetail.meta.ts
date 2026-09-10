/**
 * Route meta for `/$lang/answers/$slug`, outside the page module.
 *
 * Same reason as every other `.meta.ts` here: `head` is the one route property
 * TanStack cannot code-split, so anything it imports is eager for every visitor
 * on every route. Keeping it out of the page module stops the page body being
 * dragged into the entry chunk.
 */
import { answerBySlug } from "@/data/answers";
import { pick } from "@/data/spec-dict";
import { tFor } from "@/lib/i18n";
import {
  SITE_NAME,
  articleSchema,
  breadcrumbSchema,
  jsonLd,
  localeLinks,
  pageMeta,
  type SeoLang,
} from "@/lib/seo";

export const head = ({ params }: { params: { slug: string; lang: SeoLang } }) => {
  const a = answerBySlug(params.slug);
  const t = tFor(params.lang);
  const lang = params.lang;
  const path = `/answers/${params.slug}`;

  // An unknown slug is 404'd by the route guard before `head` matters, but SSR
  // still evaluates this, so it has to return something well-formed rather
  // than throw on a missing entry.
  if (!a) {
    return {
      meta: pageMeta({
        lang,
        title: t("answers.title"),
        description: t("meta.answers.desc"),
        path: "/answers",
        ogCard: "answers",
        noindex: true,
      }),
      links: localeLinks(lang, "/answers"),
    };
  }

  const question = pick(a.question, lang);
  const answer = pick(a.answer, lang);
  const title = pick(a.metaTitle, lang);
  const description = pick(a.metaDesc, lang);

  return {
    meta: pageMeta({
      lang,
      title,
      description,
      path,
      type: "article",
      ogCard: `answers-${a.slug}`,
      article: { section: t("answers.title") },
    }),
    links: localeLinks(lang, path),
    scripts: [
      // Only Article and BreadcrumbList here. `FAQPage` and `HowTo` need the
      // body copy, which is deliberately not importable from a `.meta.ts` —
      // see `answers-content.ts`. Both are emitted from the page component
      // instead, which is server-rendered, so a crawler still receives them in
      // the delivered HTML. JSON-LD is valid in the body as well as the head.
      jsonLd(articleSchema({ headline: question, description, path, answer }, lang)),
      jsonLd(
        breadcrumbSchema(
          [
            { name: SITE_NAME, path: "/" },
            { name: t("meta.crumb.answers"), path: "/answers" },
            { name: question, path },
          ],
          lang,
        ),
      ),
    ],
  };
};
