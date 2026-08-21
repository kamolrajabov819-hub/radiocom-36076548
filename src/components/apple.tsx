import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { fadeUpAt } from "@/lib/springs";

/**
 * Apple.com section primitives.
 *
 * These encode the three layouts apple.com reuses across every page, so sections
 * across this site share one rhythm instead of each route inventing its own:
 *
 *  - `FeatureCard`  — white card on a grey band: small grey eyebrow, bold
 *                     two-line headline, short body, media, round corner button.
 *  - `ScrollRow`    — the horizontally snapping row those cards sit in.
 *
 * The section heading itself lives in `Section.tsx` as `SectionHead`.
 */

/* ── 2. Feature card ───────────────────────────────────────── */

/** Column span within a `BentoGrid`. Ignored below `lg`, where cards stack. */
export type Span = 1 | 2;

export function FeatureCard({
  eyebrow,
  title,
  body,
  media,
  backdrop,
  action,
  tone = "light",
  idx = 0,
  span = 1,
  tall = false,
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  /** Sits below the copy, inside the card's padding. Icons, floating products. */
  media?: ReactNode;
  /**
   * Sits behind the copy, ignoring the card's padding, so a photograph can run
   * to the card's rounded edge. Position it yourself (`absolute inset-y-0
   * right-0 w-1/2`); the card clips whatever overflows.
   */
  backdrop?: ReactNode;
  action?: { label: string; onClick: () => void };
  tone?: "light" | "dark";
  idx?: number;
  span?: Span;
  tall?: boolean;
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <motion.article
      {...fadeUpAt(Math.min(idx, 6))}
      className={`group card-interactive relative flex flex-col overflow-hidden rounded-[28px] p-7 md:p-8 ${
        dark ? "is-dark bg-black text-[#f5f5f7]" : "bg-pitch text-crisp"
      } ${span === 2 ? "lg:col-span-2" : ""} ${tall ? "lg:row-span-2" : ""} ${className}`}
    >
      {backdrop ? (
        <div className="pointer-events-none absolute inset-0 [&_img]:transition-transform [&_img]:duration-700 [&_img]:ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[&_img]:scale-[1.04]">
          {backdrop}
        </div>
      ) : null}

      {eyebrow ? (
        <div className={`relative text-[14px] font-medium ${dark ? "text-white/60" : "text-cool"}`}>
          {eyebrow}
        </div>
      ) : null}

      <h3 className="relative mt-1.5 hyphens-auto break-words text-[22px] font-semibold leading-[1.15] tracking-[-0.02em] md:text-[26px]">
        {title}
      </h3>

      {body ? (
        <p
          className={`relative mt-3 text-[15px] leading-relaxed ${dark ? "text-white/70" : "text-cool"}`}
        >
          {body}
        </p>
      ) : null}

      {media ? (
        <div className="relative mt-6 flex flex-1 items-end justify-center [&_img]:transition-transform [&_img]:duration-700 [&_img]:ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[&_img]:scale-[1.04]">
          {media}
        </div>
      ) : null}

      {action ? (
        <button
          onClick={action.onClick}
          aria-label={action.label}
          className={`absolute bottom-6 right-6 flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-200 hover:scale-110 active:scale-95 ${
            dark ? "bg-white/15 text-white" : "bg-charcoal text-crisp"
          }`}
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      ) : null}
    </motion.article>
  );
}

/**
 * Asymmetric card mosaic.
 *
 * A plain `grid-cols-3` of equal tiles is what made the value shelf read as
 * filler — every cell the same weight, so the eye has nothing to land on. This
 * grid lets one or two cards claim `span={2}` or `tall`, which is how apple.com
 * builds the same kind of section. Below `lg` it collapses to a single column
 * and the spans stop applying.
 */
export function BentoGrid({ children, cols = 3 }: { children: ReactNode; cols?: 2 | 3 }) {
  return (
    <div
      className={`grid auto-rows-[minmax(240px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 ${
        cols === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3"
      }`}
    >
      {children}
    </div>
  );
}

/* ── 3. Scroll row ─────────────────────────────────────────── */

/**
 * Horizontally snapping row. Below `lg` it scrolls with snap points the way the
 * apple.com card shelves do; at `lg` and up it settles into a plain grid so
 * nothing is hidden off-screen on desktop.
 */
export function ScrollRow({ children, cols = 4 }: { children: ReactNode; cols?: 3 | 4 }) {
  return (
    <div
      className={`no-scrollbar bleed-x flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:mx-0 lg:grid lg:snap-none lg:overflow-visible lg:px-0 ${
        cols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
      }`}
    >
      {children}
    </div>
  );
}

/** One cell of a ScrollRow — fixed width while scrolling, auto in the grid. */
export function ScrollItem({ children }: { children: ReactNode }) {
  return (
    <div className="w-[78vw] shrink-0 snap-start sm:w-[52vw] md:w-[38vw] lg:w-auto lg:shrink">
      {children}
    </div>
  );
}

/* ── 4. Compare table ──────────────────────────────────────── */

export type CompareColumn = {
  id: string;
  /** Column heading — a product or option name. */
  name: string;
  /** One-line positioning under the name. */
  tagline?: string;
  /** Optional image sitting above the heading. */
  media?: ReactNode;
  /** Footnote under the heading block, e.g. a price. */
  note?: string;
  /** Row id -> cell value. A missing key renders an em dash. */
  values: Record<string, string | undefined>;
  highlight?: boolean;
};

/**
 * apple.com's "Which one is right for you?" table.
 *
 * Columns are products, rows are specs, and a value the column does not have
 * renders as an em dash rather than being left blank — the absence is the
 * comparison. Scrolls horizontally on small screens so cells never wrap into
 * illegible columns.
 */
export function CompareTable({
  columns,
  rows,
  caption,
}: {
  columns: CompareColumn[];
  rows: { id: string; label: string }[];
  caption?: string;
}) {
  return (
    <div className="no-scrollbar bleed-x overflow-x-auto md:mx-0 md:px-0">
      <table className="w-full min-w-[640px] border-collapse text-center">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr>
            <th scope="col" className="w-[1%] whitespace-nowrap p-0 text-left" />
            {columns.map((c) => (
              <th key={c.id} scope="col" className="px-3 pb-8 align-bottom md:px-5">
                {c.media ? <div className="mb-4 flex justify-center">{c.media}</div> : null}
                <div
                  className={`text-[19px] font-semibold tracking-[-0.02em] md:text-[21px] ${
                    c.highlight ? "text-signal" : "text-crisp"
                  }`}
                >
                  {c.name}
                </div>
                {c.tagline ? (
                  <div className="mx-auto mt-1.5 max-w-[15rem] text-[13px] font-normal leading-snug text-cool">
                    {c.tagline}
                  </div>
                ) : null}
                {c.note ? (
                  <div className="mt-2 text-[13px] font-normal text-cool">{c.note}</div>
                ) : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-border">
              <th
                scope="row"
                className="whitespace-nowrap py-5 pr-6 text-left text-[13px] font-normal text-cool"
              >
                {r.label}
              </th>
              {columns.map((c) => (
                <td
                  key={c.id}
                  className="px-3 py-5 align-top text-[15px] leading-snug text-crisp md:px-5"
                >
                  {c.values[r.id] ?? <span className="text-cool">—</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
