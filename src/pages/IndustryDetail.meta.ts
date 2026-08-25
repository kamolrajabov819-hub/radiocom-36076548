/**
 * Route meta for `/$lang/industries/$slug`, deliberately outside the page module.
 *
 * `head` is the one route property TanStack cannot code-split: it is absent
 * from the plugin's `splitRouteIdentNodes` because SSR needs it synchronously
 * to render the document head. Whatever it imports is therefore eager for
 * every visitor on every route. Kept in the page module, the route file had to
 * import that module to reach `head`, which dragged the whole page body into
 * the entry chunk behind it.
 */
import { INDUSTRY_SLUGS, type IndustrySlug } from "@/data/industries";
import { tFor } from "@/lib/i18n";
import {
  SITE_NAME,
  breadcrumbSchema,
  faqSchema,
  jsonLd,
  localeLinks,
  pageMeta,
  type SeoLang,
} from "@/lib/seo";
import { notFound } from "@tanstack/react-router";

beforeLoad: ({ params }: { params: { lang: string; slug: string } }) => {
  if (!INDUSTRY_SLUGS.includes(params.slug as IndustrySlug)) throw notFound();
};

export const head = ({ params }: { params: { slug: string; lang: SeoLang } }) => {
  const slug = params.slug as IndustrySlug;
  const t = tFor(params.lang);

  const name = t(`industries.${slug}.name`);
  // `.seo` is the industry as it reads inside a sentence: Russian needs the
  // genitive ("Рации для строительства", not "для строительство"), and the
  // display names carry "·" separators that do not belong in a page title.
  const inTitle = t(`industries.${slug}.seo`, { defaultValue: name });
  const title = t("meta.industry.title", { name: inTitle });
  // `.meta_desc`, not `.desc`.
  //
  // `.desc` is the card blurb — «Крупные объекты. IP67, дальняя связь.», 37
  // characters. It was being preferred over the generic template beneath it,
  // so all six industry pages shipped a meta description a third of the length
  // Google will display, and the better string never ran. `.meta_desc` is
  // written for the search result: one sentence naming the industry, two or
  // three figures that are actually on the page, and what a visitor gets.
  const description =
    t(`industries.${slug}.meta_desc`, { defaultValue: "" }) ||
    t("meta.industry.desc", { name: inTitle });
  const path = `/industries/${slug}`;

  // The FAQ pairs must be this locale's — schema that disagrees with the
  // rendered text counts as mismatched markup.
  const faq = (t(`industries.${slug}.faq`, { returnObjects: true, defaultValue: [] }) ?? []) as {
    q: string;
    a: string;
  }[];

  return {
    meta: pageMeta({
      lang: params.lang,
      title,
      description,
      path,
      type: "article",
      ogCard: `industries-${slug}`,
      // `name`, not `inTitle`. The section is a label a scraper files the
      // page under, so it wants the industry as it is displayed — the `.seo`
      // variant exists only to read correctly inside a Russian sentence.
      article: { section: name },
    }),
    links: localeLinks(params.lang, path),
    scripts: [
      ...(Array.isArray(faq) && faq.length ? [jsonLd(faqSchema(faq, params.lang))] : []),
      jsonLd(
        breadcrumbSchema(
          [
            { name: SITE_NAME, path: "/" },
            { name: t("meta.crumb.industries"), path: "/industries" },
            { name, path },
          ],
          params.lang,
        ),
      ),
    ],
  };
};
