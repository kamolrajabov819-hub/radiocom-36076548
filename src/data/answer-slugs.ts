/**
 * The published answer slugs, and nothing else.
 *
 * Separate from `answers.ts` for one measured reason: the route guard in
 * `routes/$lang/answers.$slug.tsx` needs this list synchronously in
 * `beforeLoad`, and **route files are eager** — they are the module graph
 * TanStack builds the router from, so nothing they import can be code-split.
 *
 * Taking the slug list from a module that also holds the prose therefore pulled
 * the body copy of every answer page, in three languages, into the entry chunk
 * — and so onto every route on the site, including every route that never shows
 * an answer. Reintroducing that import deliberately and rebuilding measures it:
 * the entry chunk goes 611 -> 649 KB and `qa-weight`'s eager baseline goes
 * 859.5 -> 896.8 KB, which is 37 KB charged to every visitor of every page.
 *
 * The page components import the prose instead, and those *are* code-split, so
 * it now ships only to a reader who opens an answers page. `verify-answers`
 * asserts this list still matches `publishedAnswers`, so the two cannot drift.
 */
export const ANSWER_SLUGS = [
  "how-to-choose",
  "real-range",
  "analog-or-digital",
  "how-many-radios",
  "radio-price-tashkent",
  "pmr-or-poc",
  "warranty-and-repair",
] as const;
