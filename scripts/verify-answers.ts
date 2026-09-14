/**
 * The answers section has to stay true to the catalogue it is written from.
 *
 * These pages quote figures — 21 models, 600 000 to 3 100 000 сум, 300 м to
 * 3 км in town — and prose does not update itself when a price list lands. The
 * last price list moved every number on the site; the copy that quoted them
 * moved only where somebody remembered. So this gate re-derives each figure
 * from `products.ts` and fails when the prose and the data disagree, rather
 * than trusting that whoever edits the catalogue also greps the articles.
 *
 * It also holds the line that matters most here: an answers page makes claims
 * in the site's own voice, and one of them — whether a radio needs a licence in
 * Uzbekistan — is a legal question this repository cannot settle. That page is
 * written and marked `draft`, and rule 2 below is what stops it being published
 * by someone deleting the flag without clearing the `TODO-LEGAL` markers.
 *
 * Run: bun scripts/verify-answers.ts
 */
import { publishedAnswers, TODO_LEGAL } from "../src/data/answers";
import { answerContent } from "../src/data/answers-content";
import { draftAnswers, draftContent } from "../src/data/answers-draft";
import { ANSWER_SLUGS } from "../src/data/answer-slugs";
import { visibleProducts } from "../src/data/products";
import { LANGS } from "../src/lib/seo";
import { existsSync } from "node:fs";

const problems: string[] = [];
const bad = (m: string) => problems.push(m);

/**
 * Every rule below runs over drafts as well as published pages.
 *
 * A draft is text waiting on a fact, not text waiting on a proofread, so it is
 * held to the same standard — locale parity, resolvable picks, a real OG source.
 * Rule 2 is the single exception, and inverts: a `TODO-LEGAL` marker is required
 * to be on a draft and forbidden anywhere else.
 */
const answers = [...publishedAnswers, ...draftAnswers];
const allContent: Record<string, (typeof answerContent)[string]> = {
  ...answerContent,
  ...draftContent,
};

/* ── 1. Every field, in every locale, on every page ───────────────────── */
{
  for (const a of answers) {
    const fields: [string, Record<string, string>][] = [
      ["question", a.question],
      ["answer", a.answer],
      ["metaTitle", a.metaTitle],
      ["metaDesc", a.metaDesc],
      ...(allContent[a.slug]?.sections ?? []).flatMap(
        (s, i): [string, Record<string, string>][] => [
          [`sections[${i}].heading`, s.heading],
          [`sections[${i}].body`, s.body],
        ],
      ),
      ...(allContent[a.slug]?.faq ?? []).flatMap((f, i): [string, Record<string, string>][] => [
        [`faq[${i}].q`, f.q],
        [`faq[${i}].a`, f.a],
      ]),
      ...(allContent[a.slug]?.steps ?? []).flatMap((s, i): [string, Record<string, string>][] => [
        [`steps[${i}].name`, s.name],
        [`steps[${i}].text`, s.text],
      ]),
    ];
    for (const [name, value] of fields)
      for (const lang of LANGS) if (!value[lang]?.trim()) bad(`${a.slug}: ${name} has no ${lang}`);
  }
  if (!problems.length)
    console.log(`ok  ${answers.length} answer pages carry all three locales in every field`);
}

/* ── 2. A TODO-LEGAL marker may only exist on a draft ─────────────────── */
{
  const leaked: string[] = [];
  for (const a of publishedAnswers) {
    const blob = JSON.stringify(a);
    if (blob.includes(TODO_LEGAL)) leaked.push(a.slug);
  }
  if (leaked.length)
    bad(
      `${leaked.join(", ")} is published but still contains a ${TODO_LEGAL} marker.\n` +
        `     A ${TODO_LEGAL} marks a claim nobody has confirmed — most likely the licensing\n` +
        `     question, which needs the actual Госкомсвязи РУз rule rather than a better guess.\n` +
        `     Either clear the marker with a confirmed sentence, or restore \`draft: true\`.`,
    );
  else
    console.log(
      `ok  no ${TODO_LEGAL} marker on any published page ` +
        `(${answers.length - publishedAnswers.length} draft held back)`,
    );
}

/* ── 3. Links resolve: picks are visible, related are real ────────────── */
{
  const slugs = new Set(answers.map((a) => a.slug));
  for (const a of answers) {
    // `picks` and `related` live in the content module, which the detail page
    // already imports. Rule 7 proves every answer has an entry there, so a
    // missing one is reported once rather than eight times here.
    const c = allContent[a.slug];
    if (!c) continue;
    if (!c.picks.length)
      bad(`${a.slug}: links no products — the page has no way into the catalogue`);
    for (const id of c.picks)
      if (!visibleProducts.some((p) => p.id === id))
        bad(`${a.slug}: picks "${id}", which is not a visible product`);
    for (const r of c.related) {
      if (!slugs.has(r)) bad(`${a.slug}: related to "${r}", which does not exist`);
      if (r === a.slug) bad(`${a.slug}: related to itself`);
    }
  }
  if (!problems.length)
    console.log("ok  every pick is a visible product and every related slug resolves");
}

/* ── 4. HowTo is used once, and only where there are real steps ───────── */
{
  const withSteps = answers.filter((a) => allContent[a.slug]?.steps?.length);
  if (withSteps.length !== 1)
    bad(
      `${withSteps.length} pages declare steps (${withSteps.map((a) => a.slug).join(", ") || "none"}).\n` +
        `     HowTo is emitted for each, and HowTo on a page that is really an article with\n` +
        `     subheadings is the kind of stretch that gets structured data ignored site-wide.\n` +
        `     If a second page is genuinely a procedure, widen this rule deliberately.`,
    );
  else console.log(`ok  HowTo is emitted for exactly one page (${withSteps[0].slug})`);
}

/* ── 5. The figures in the prose still match the catalogue ────────────── */
/**
 * Only the Russian is checked, and deliberately.
 *
 * Russian is the source these were written from; the other two are translations
 * of it. A figure that drifts drifts in all three at once, because it drifts in
 * `products.ts`. Checking three locales for the same number would triple the
 * failure output without catching anything the first check misses.
 */
{
  const priced = visibleProducts
    .map((p) => p.price)
    .filter((n): n is number => n != null)
    .sort((a, b) => a - b);
  // `toLocaleString("ru-RU")` groups with U+00A0, a non-breaking space, while the
  // prose is typed with an ordinary one, so the separator has to be normalised
  // before comparing. Written as an escape rather than the literal character: a
  // literal NBSP in a character class is invisible in every editor and diff, and
  // losing it would leave this rule matching nothing while still reporting ok.
  const fmt = (n: number) => n.toLocaleString("ru-RU").replace(/[\u00A0 ,]/g, " ");

  const expected: { what: string; needle: string; on: string }[] = [
    {
      what: "visible model count",
      needle: `${visibleProducts.length} модели`,
      on: "how-to-choose",
    },
    {
      what: "visible model count",
      needle: `${visibleProducts.length} модель`,
      on: "radio-price-tashkent",
    },
    { what: "lowest price", needle: fmt(priced[0]), on: "radio-price-tashkent" },
    { what: "highest price", needle: fmt(priced.at(-1)!), on: "radio-price-tashkent" },
  ];

  for (const e of expected) {
    const a = answers.find((x) => x.slug === e.on);
    if (!a) {
      bad(`figure check refers to "${e.on}", which is not an answer page`);
      continue;
    }
    const blob = [
      a.answer.ru,
      a.metaDesc.ru,
      ...(allContent[a.slug]?.sections ?? []).map((s) => s.body.ru),
    ].join(" ");
    if (!blob.includes(e.needle))
      bad(
        `${e.on}: the ${e.what} is now "${e.needle}" in products.ts, and the Russian copy\n` +
          `     on that page does not say it. The catalogue changed and the prose did not.`,
      );
  }
  if (!problems.length)
    console.log("ok  model count and price range in the copy match products.ts");
}

/* ── 6. Every declared OG source image exists ─────────────────────────── */
{
  for (const a of answers)
    if (!existsSync(`src/assets/${a.ogCard}`))
      bad(`${a.slug}: ogCard source src/assets/${a.ogCard} does not exist`);
  if (!problems.length) console.log(`ok  all ${answers.length} OG card sources resolve`);
}

/* ── 7. The split modules still describe the same set of pages ────────── */
{
  // Each half of the split has to hold exactly its own pages, and the direction
  // that matters is the strict one: a draft's body copy sitting in
  // `answers-content.ts` would be imported by the page components and ship to
  // every reader of the section, which is the leak the split exists to prevent.
  const pub = new Set(publishedAnswers.map((a) => a.slug));
  const drafted = new Set(draftAnswers.map((a) => a.slug));
  for (const a of publishedAnswers)
    if (!answerContent[a.slug])
      bad(`${a.slug}: is published but has no body in answers-content.ts`);
  for (const a of draftAnswers)
    if (!draftContent[a.slug]) bad(`${a.slug}: is a draft but has no body in answers-draft.ts`);
  for (const slug of Object.keys(answerContent)) {
    if (drafted.has(slug))
      bad(
        `answers-content.ts carries "${slug}", which is a draft. That module is imported by\n` +
          `     the page components, so its text ships to every reader of the section — the\n` +
          `     draft's body belongs beside its record in answers-draft.ts.`,
      );
    else if (!pub.has(slug)) bad(`answers-content.ts has "${slug}", which is not an answer page`);
  }
  for (const slug of Object.keys(draftContent))
    if (!drafted.has(slug))
      bad(`answers-draft.ts has body copy for "${slug}", which is not a draft`);
  // Nothing about the body copy is mirrored onto the slim record — not the
  // step count, not the picks, not the related slugs. That is deliberate:
  // duplicated state drifts, and every field on the slim record is a field
  // `head` ships to every route on the site. Rules 3 and 4 read the content
  // module directly instead, which is why there is no cross-check to make here.
  //
  // The route guard is the one exception, and it is not free-form: it reads its
  // own tiny slug list, so the router can 404 an unknown slug without pulling
  // the answers data onto every route. That list is duplicated state, so it
  // gets the check.
  const published = publishedAnswers.map((a) => a.slug).join(",");
  if ([...ANSWER_SLUGS].join(",") !== published)
    bad(
      `answer-slugs.ts lists [${[...ANSWER_SLUGS].join(", ")}] but publishedAnswers is\n` +
        `     [${published}]. The route guard and the data have drifted, so a page either\n` +
        `     404s while being listed, or resolves while being unpublished.`,
    );
  if (!problems.length)
    console.log(
      `ok  the four answers modules agree: ${publishedAnswers.length} published, ` +
        `${draftAnswers.length} draft, no body copy on the wrong side`,
    );
}

if (problems.length) {
  console.log(`FAIL answers:\n     ${problems.join("\n     ")}`);
  console.log(`\n${problems.length} FAILURES`);
  process.exit(1);
}
console.log("\nALL ANSWER CHECKS PASSED");
