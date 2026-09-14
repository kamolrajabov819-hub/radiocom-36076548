/** Route meta for `/$lang/answers`. See `AnswerDetail.meta.ts` for why this is separate. */
import { publishedAnswers } from "@/data/answers";
import { pick } from "@/data/spec-dict";
import { tFor } from "@/lib/i18n";
import {
  SITE_NAME,
  SITE_URL,
  absolute,
  breadcrumbSchema,
  jsonLd,
  localeLinks,
  localePath,
  pageMeta,
  type SeoLang,
} from "@/lib/seo";

export const head = ({ params }: { params: { lang: SeoLang } }) => {
  const lang = params.lang;
  const t = tFor(lang);
  const path = "/answers";
  const url = absolute(localePath(lang, path));

  return {
    meta: pageMeta({
      lang,
      title: t("meta.answers.title"),
      description: t("meta.answers.desc"),
      path,
      ogCard: "answers",
    }),
    links: localeLinks(lang, path),
    scripts: [
      jsonLd({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${url}#collection`,
        name: t("answers.title"),
        description: t("meta.answers.desc"),
        inLanguage: lang,
        url,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        // The list is what makes this page worth indexing rather than just
        // crawlable: it states the seven questions the section answers, in
        // order, each pointing at the page that answers it.
        mainEntity: {
          "@type": "ItemList",
          itemListElement: publishedAnswers.map((a, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: pick(a.question, lang),
            url: absolute(localePath(lang, `/answers/${a.slug}`)),
          })),
        },
      }),
      jsonLd(
        breadcrumbSchema(
          [
            { name: SITE_NAME, path: "/" },
            { name: t("meta.crumb.answers"), path },
          ],
          lang,
        ),
      ),
    ],
  };
};
