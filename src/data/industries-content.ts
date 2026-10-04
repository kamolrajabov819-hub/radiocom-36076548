/**
 * The body copy of the six industry pages, keyed by slug.
 *
 * It lived in the locale JSONs until the keyword pass, and the locale JSONs are
 * eager: `src/lib/i18n.ts` imports all three, so every string in them ships to
 * every visitor on every route. These fields are read by one component,
 * `IndustryDetail.tsx`, which is code-split, so here they ship only to someone
 * who opens an industry page. Moved, they took about 27 KB of raw JavaScript
 * out of `qa-weight`'s eager baseline; that is the room the keyword copy on
 * the other pages is written into.
 *
 * One module per industry (`src/data/copy/industries/<slug>.ts`), loaded by the
 * route's `loader` for the slug being shown, never all six at once. As a
 * single module the six bodies put the industry route at 948.7 of its 970 KB
 * `qa-weight` ceiling before any of the keyword copy was written; split, a
 * visitor downloads only the page they opened. On the server-rendered first
 * view the loader's result travels in the HTML, already narrowed to one
 * language, so the client fetches no chunk at all until it navigates.
 *
 * Same contract as `answers-content.ts`:
 *
 *   - Nothing here is imported by a `.meta.ts`. `head()` is the one route
 *     property TanStack cannot split, so anything it imports is eager again.
 *   - `FAQPage` needs the questions, so it is emitted from the page component
 *     rather than from `head` — still in the server HTML, where JSON-LD is valid
 *     in the body as in the head.
 *   - `verify-content.ts` holds these strings to the rules `verify-i18n` holds
 *     the JSON to: every locale present, no Cyrillic in en/uz, no translation
 *     that has lost a clause, ASCII apostrophes in Uzbek.
 *
 * What stays in the JSON is what eager code reads: `name`, `short`, `desc`,
 * `h1`, `seo`, `meta_desc` and `photo_alt` (Nav, Footer, Brand, Home,
 * ProductStory and the industry `head`).
 */
import type { IndustrySlug } from "@/data/industries";
import type { L } from "@/data/copy/pick";

export type IndustryContent = {
  /** «Проблема» panel. */
  problem: L;
  /** «Решение» panel. */
  solution: L;
  /** What the buyer is up against, in their words. */
  pains: L[];
  /** The opening figures: number, unit, label. Whole numbers count up. */
  outcomes: { n: L; u: L; l: L }[];
  quote: L;
  quoteAuthor: L;
  /** The client line, where an industry has one. */
  clients?: L;
  /** Rendered as the shared `Faq` and emitted as `FAQPage`, from the same array. */
  faq: { q: L; a: L }[];
};

/**
 * One explicit `import()` per slug, rather than `import.meta.glob`: the same map
 * then works under Bun, where `verify-content.ts` walks every body, and Vite
 * still emits one chunk per industry.
 */
const loaders: Record<IndustrySlug, () => Promise<{ default: IndustryContent }>> = {
  horeca: () => import("@/data/copy/industries/horeca"),
  construction: () => import("@/data/copy/industries/construction"),
  security: () => import("@/data/copy/industries/security"),
  mining: () => import("@/data/copy/industries/mining"),
  transport: () => import("@/data/copy/industries/transport"),
  manufacturing: () => import("@/data/copy/industries/manufacturing"),
};

export const loadIndustryContent = async (slug: IndustrySlug) => (await loaders[slug]()).default;
