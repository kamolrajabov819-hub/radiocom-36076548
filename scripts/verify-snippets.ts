/**
 * Every page's <title> and meta description must be a length Google will
 * actually display.
 *
 * This gate exists because its absence shipped a real defect. All six industry
 * pages carried a 37-character description — «Крупные объекты. IP67, дальняя
 * связь.» — because `IndustryDetail.meta` preferred the card blurb over the
 * longer template beneath it. Nothing caught it: every check in `verify-seo`
 * asks whether a tag is *present* and *consistent*, and that one was both.
 *
 * The bounds are display limits, not house style. Google truncates titles at
 * roughly 580-600px and descriptions at roughly 155-160 characters. A
 * 37-character description is not truncated — it is a snippet Google will
 * usually discard and rewrite from the page body, which throws away the one
 * piece of search copy the site controls. Titles are allowed to 65 because the
 * pixel limit is what binds, and 62 narrow Cyrillic characters still fit.
 *
 * Driven through each route's real `head()`, not through the helpers those
 * heads call: asserting that `pageMeta` *can* produce a good description proves
 * nothing about what any page asks it for. That is exactly the gap the industry
 * pages fell through.
 *
 * ── Why this is a separate script from `verify-seo.ts` ──────────────────────
 *
 * It began life inside `verify-seo`, and adding it there pushed that script's
 * import graph past a threshold Bun 1.3.11 does not survive: the process dies
 * before any gate runs, trying to parse `rcd-70-hero.webp` as JavaScript.
 *
 * It is the size of the module graph, not this file. Removing any one of the
 * eight page-meta imports fixed it, and so did replacing one import with a
 * comment of exactly the same byte length — same file size, one fewer module,
 * no crash. Splitting the gate into its own process gives each script a graph
 * Bun handles, and costs nothing but one more line in the build chain.
 *
 * Run: bun scripts/verify-snippets.ts
 */
import { LANGS } from "../src/lib/seo";
import { INDUSTRY_SLUGS } from "../src/data/industries";
import { productsOfBrand } from "../src/data/products";
import { head as homeHead } from "../src/pages/Home.meta";
import { head as serviceHead } from "../src/pages/Service.meta";
import { head as pocHead } from "../src/pages/Poc.meta";
import { head as compareHead } from "../src/pages/Compare.meta";
import { head as industriesIndexHead } from "../src/pages/IndustriesIndex.meta";
import { head as industryHead } from "../src/pages/IndustryDetail.meta";
import { head as sitemapHead } from "../src/pages/Sitemap.meta";
import { head as searchHead } from "../src/pages/Search.meta";
import { head as answersHead } from "../src/pages/Answers.meta";
import { head as answerHead } from "../src/pages/AnswerDetail.meta";
import { publishedAnswers } from "../src/data/answers";
import { brandHead } from "../src/pages/Brand.meta";
import { head as productHead } from "../src/pages/ProductStory.meta";

const TITLE_MAX = 65;
const DESC_MIN = 70;
const DESC_MAX = 160;

type Head = { meta?: { name?: string; property?: string; content?: string }[] };

/** og:title rather than the raw title, because that is the tag every page emits. */
const read = (h: Head) => {
  const m = h.meta ?? [];
  return {
    title: m.find((x) => x.property === "og:title")?.content ?? "",
    desc: m.find((x) => x.name === "description")?.content ?? "",
  };
};

const cases: { label: string; head: Head }[] = [];
for (const lang of LANGS) {
  cases.push({ label: `${lang} /`, head: homeHead({ params: { lang } }) as Head });
  cases.push({ label: `${lang} /service`, head: serviceHead({ params: { lang } }) as Head });
  cases.push({ label: `${lang} /poc`, head: pocHead({ params: { lang } }) as Head });
  cases.push({ label: `${lang} /compare`, head: compareHead({ params: { lang } }) as Head });
  cases.push({
    label: `${lang} /industries`,
    head: industriesIndexHead({ params: { lang } }) as Head,
  });
  cases.push({ label: `${lang} /sitemap`, head: sitemapHead({ params: { lang } }) as Head });
  // The bare /search form, not a results page — `?q=` results are
  // noindex, follow, so they have no snippet to size.
  cases.push({
    label: `${lang} /search`,
    head: searchHead({ params: { lang }, match: { search: {} } }) as Head,
  });
  for (const slug of INDUSTRY_SLUGS)
    cases.push({
      label: `${lang} /industries/${slug}`,
      head: industryHead({ params: { lang, slug } }) as Head,
    });
  // The answers section. Every published page, not a sample: each one carries
  // its own hand-written title and description rather than a shared template,
  // so one page overflowing says nothing about the next.
  cases.push({ label: `${lang} /answers`, head: answersHead({ params: { lang } }) as Head });
  for (const a of publishedAnswers)
    cases.push({
      label: `${lang} /answers/${a.slug}`,
      head: answerHead({ params: { lang, slug: a.slug } }) as Head,
    });
  // `brandHead` is curried by brand, unlike the others.
  for (const brand of ["radiocom", "motorola"] as const) {
    cases.push({
      label: `${lang} /${brand}`,
      head: brandHead(brand)({ params: { lang } }) as Head,
    });
    // Two models per brand rather than the whole catalogue: title and
    // description each come from one template, so a fifth model tests nothing
    // a second does not. The longest names are what matter, and
    // `productsOfBrand` is ordered with the flagships first.
    for (const p of productsOfBrand(brand).slice(0, 2))
      cases.push({
        label: `${lang} /${brand}/${p.slug}`,
        head: productHead({ params: { lang, brand, model: p.slug } }) as Head,
      });
  }
}

const problems: string[] = [];
for (const { label, head } of cases) {
  const { title, desc } = read(head);
  // `[...s].length` counts code points, not UTF-16 units — «Рации» is 5
  // characters and 10 bytes, and the display limit is about characters.
  if (!title) problems.push(`${label}: no og:title`);
  else if ([...title].length > TITLE_MAX)
    problems.push(`${label}: title is ${[...title].length} chars (max ${TITLE_MAX}) — "${title}"`);
  if (!desc) problems.push(`${label}: no meta description`);
  else if ([...desc].length < DESC_MIN)
    problems.push(
      `${label}: description is only ${[...desc].length} chars (min ${DESC_MIN}) — "${desc}"`,
    );
  else if ([...desc].length > DESC_MAX)
    problems.push(
      `${label}: description is ${[...desc].length} chars (max ${DESC_MAX}) — "${desc}"`,
    );
}

if (problems.length) {
  console.log(`FAIL snippet lengths:\n     ${problems.join("\n     ")}`);
  console.log(`\n${problems.length} FAILURES`);
  process.exit(1);
}
console.log(
  `ok  title <= ${TITLE_MAX} and description ${DESC_MIN}-${DESC_MAX} chars across ${cases.length} page/locale pairs`,
);
console.log("\nALL SNIPPET CHECKS PASSED");
