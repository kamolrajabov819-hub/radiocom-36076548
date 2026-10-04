/**
 * The body copy of the answers pages: its shape, and one loader per page.
 *
 * Split from `answers.ts` for a measured reason, not a stylistic one.
 *
 * `head` is the one route property TanStack cannot code-split, so every
 * `.meta.ts` module — and everything it imports — is eager for every visitor on
 * every route. When the sections, follow-up questions and steps lived alongside
 * the titles in one module, importing that module for `head` pulled the whole
 * body of all eight pages into the entry chunk, and therefore onto pages that
 * never show an answer.
 *
 * Split, this text was a 41 KB route chunk (it is one chunk per page now; see
 * the loaders below). Unsplit — reintroduced deliberately
 * and rebuilt, to check rather than assume — the entry chunk goes 611 -> 649 KB
 * and every route on the site pays 37 KB more, including the ones that have
 * nothing to do with the answers section. `qa-weight`'s baseline check is what
 * measures that, and what fails if this file ever loses its separation.
 *
 * Nothing here is imported by a `.meta.ts`. The answer route's `loader` and
 * `AnswerDetail.tsx` read it, and the bodies behind the loaders are code-split,
 * so this text ships only to a reader who opens that answer page.
 *
 * The consequence for schema: `FAQPage` and `HowTo` need this text and cannot
 * be built in `head`. They are emitted from the page component instead, which
 * is still server-rendered, so a crawler sees them in the delivered HTML —
 * JSON-LD is valid in the body as well as the head.
 */

import type { AnswerSlug } from "@/data/answer-slugs";
import type { L } from "@/data/copy/pick";

export type AnswerContent = {
  /** Body. One `h2` per entry. */
  sections: { heading: L; body: L }[];
  /** Follow-ups, rendered as the shared `Faq` and emitted as `FAQPage`. */
  faq: { q: L; a: L }[];
  /** Ordered steps. Only where the page is genuinely a procedure: emits `HowTo`. */
  steps?: { name: L; text: L }[];
  /** Product ids to show at the foot. Must be visible — `verify-answers` checks. */
  picks: string[];
  /** Sibling pages to link. Keeps the section crawlable as a cluster. */
  related: string[];
  /**
   * The one commercial page this question leads to, linked with that page's
   * primary keyword as the anchor (docs/seo/keyword-map.md) — informational
   * traffic handed to the page that sells. `verify-content` checks the path.
   */
  cta: { path: string; anchor: L };
};

/**
 * One explicit `import()` per page (`src/data/copy/answers/<slug>.ts`), loaded by
 * the route's `loader` for the slug being shown — never all ten at once. As one
 * module the ten bodies put the answer route at 974.5 KB, over its 970 KB
 * `qa-weight` ceiling, once the keyword map's three new pages joined the seven;
 * split, a reader downloads the page they opened. On the server-rendered first
 * view the loader's result travels in the HTML, already narrowed to one
 * language, so the client fetches no chunk until it navigates.
 *
 * Explicit rather than `import.meta.glob` so the same map works under Bun,
 * where `verify-answers` and `verify-content` read every body.
 */
const loaders: Record<AnswerSlug, () => Promise<{ default: AnswerContent }>> = {
  "how-to-choose": () => import("@/data/copy/answers/how-to-choose"),
  "real-range": () => import("@/data/copy/answers/real-range"),
  "analog-or-digital": () => import("@/data/copy/answers/analog-or-digital"),
  "how-many-radios": () => import("@/data/copy/answers/how-many-radios"),
  "radio-price-tashkent": () => import("@/data/copy/answers/radio-price-tashkent"),
  "pmr-or-poc": () => import("@/data/copy/answers/pmr-or-poc"),
  "warranty-and-repair": () => import("@/data/copy/answers/warranty-and-repair"),
  pmr446: () => import("@/data/copy/answers/pmr446"),
  "what-is-dmr": () => import("@/data/copy/answers/what-is-dmr"),
  ip67: () => import("@/data/copy/answers/ip67"),
};

export const loadAnswerContent = async (slug: AnswerSlug) => (await loaders[slug]()).default;

/** Every published body, keyed by slug — for the build-time checks, not for pages. */
export const loadAllAnswerContent = async (): Promise<Record<string, AnswerContent>> =>
  Object.fromEntries(
    await Promise.all(
      (Object.keys(loaders) as AnswerSlug[]).map(async (s) => [s, await loadAnswerContent(s)]),
    ),
  );

/**
 * `picks` as products, in the order given, skipping anything not visible.
 *
 * Lives here rather than in `answers.ts` because its only caller is the detail
 * page, which already imports this module (the module is small now: the type,
 * the loaders and this). Putting it beside the slim module
 * would drag `products.ts`'s `Product` type — and the `picks` arrays — back
 * onto every route through `head`.
 */
export function answerPicks<T extends { id: string }>(
  content: Pick<AnswerContent, "picks">,
  visible: T[],
): T[] {
  return content.picks
    .map((id) => visible.find((p) => p.id === id))
    .filter((p): p is T => p != null);
}
