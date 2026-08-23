import { motion } from "framer-motion";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fadeUpAt } from "@/lib/springs";
import { cn } from "@/lib/utils";

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
  figure,
  action,
  tone = "light",
  idx = 0,
  span = 1,
  tall = false,
  className = "",
  copyClassName = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  /** Sits below the copy, inside the card's padding. Icons, floating products. */
  media?: ReactNode;
  /**
   * A photograph beside the copy on a wide card, and beneath it on a narrow
   * one. Pass the bare `<img>`/`<ProductShot>`; the card positions it.
   *
   * It replaces a `backdrop` slot that could not do this job. Three cards on
   * the site used that slot with hand-tuned geometry — `w-[44%]`, `w-[48%]`, `top-[42%]` — against copy
   * capped at `max-w-[52%]`. Those numbers work on a 900px card. At 390px the
   * card is ~340px wide, so 44% is ~150px of photograph pressed against ~180px
   * of text: the headline breaks mid-word ("Сертифицирован / ные техники"), the
   * radios overlap the copy, and the space below both sits empty. Every one of
   * the three failed the same way because every one of them was solving the
   * same unsolvable problem with a different constant.
   *
   * Stacking below `sm` is what makes the geometry solvable at all: the phone
   * gets one column and the full card width for each of copy and photograph,
   * and the desktop keeps the side-by-side split. Call sites therefore write
   * their copy constraint as `sm:max-w-[…]` rather than `max-w-[…]`, so the
   * phone's copy is never narrowed for a photograph that is no longer beside it.
   *
   * **Placement follows `span`, and that is not a shortcut.** A `span={2}` card
   * is two grid columns wide and has room for copy and photograph side by side.
   * A single-column card does not: in this bento that column is ~250px at
   * 1440, and half of it is ~125px — narrow enough that "Обменяй" breaks after
   * "Обмен". So a narrow card stacks at *every* width, which is also what its
   * `tall` proportion wants. Deriving this rather than passing it means a card
   * cannot be given a layout its own geometry cannot carry.
   */
  figure?: ReactNode;
  action?: { label: string; onClick: () => void };
  tone?: "light" | "dark";
  idx?: number;
  span?: Span;
  tall?: boolean;
  className?: string;
  /**
   * Constrains the copy column. A `backdrop` photograph occupies part of the
   * card, and long headlines — Russian runs ~15% longer than English, Uzbek
   * longer still — will happily run underneath it. Give the copy an explicit
   * max-width whenever a backdrop covers a side.
   */
  copyClassName?: string;
}) {
  const dark = tone === "dark";
  return (
    <motion.article
      {...fadeUpAt(Math.min(idx, 6))}
      // `cn()`, not template concatenation. Concatenating let a call site's
      // `className` sit alongside the tone classes rather than replacing them,
      // so `tone="dark"` + `className="bg-charcoal"` emitted both `bg-black`
      // and `bg-charcoal` and the later rule in Tailwind's output won —
      // rendering `#f5f5f7` text on a `#f5f5f7` card. `twMerge` resolves the
      // conflict by intent instead: the caller's background replaces the
      // tone's, and the text colour it was paired with survives.
      className={cn(
        "group card-interactive relative flex flex-col overflow-hidden rounded-[28px] p-7 md:p-8",
        dark ? "is-dark bg-black text-[#f5f5f7]" : "bg-pitch text-crisp",
        span === 2 && "lg:col-span-2",
        tall && "lg:row-span-2",
        className,
      )}
    >
      <div className={cn("relative", copyClassName)}>
        {eyebrow ? (
          <div className={cn("text-[14px] font-medium", dark ? "text-white/60" : "text-cool")}>
            {eyebrow}
          </div>
        ) : null}

        <h3 className="type-title mt-2 hyphens-auto break-words">{title}</h3>

        {body ? (
          <p
            className={cn("mt-3 text-[15px] leading-relaxed", dark ? "text-white/70" : "text-cool")}
          >
            {body}
          </p>
        ) : null}
      </div>

      {figure ? (
        <div
          className={cn(
            // Under the copy: a real layout child, full card width, its own
            // height. Nothing overlaps anything. This is the phone layout for
            // every card, and the only layout for a single-column card.
            "pointer-events-none relative mt-6 flex w-full flex-1 items-end justify-center",
            // Beside the copy, on a card wide enough to hold both.
            span === 2 &&
              "sm:absolute sm:inset-y-0 sm:right-0 sm:mt-0 sm:w-[46%] sm:flex-none sm:items-center sm:justify-center",
            "[&_img]:transition-transform [&_img]:duration-700 [&_img]:ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[&_img]:scale-[1.04]",
          )}
        >
          {figure}
        </div>
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
          className={`absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-200 hover:scale-110 active:scale-95 ${
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
 * A card whose photograph sits *below* its copy, running the card's full width
 * and anchored to the bottom edge.
 *
 * This is apple.com's "Switch to Mac" / "Mac essentials" tile: centred or
 * left-aligned text at the top, then the product beneath it with room to
 * breathe. It reads as one object, where a side-by-side split reads as two
 * columns that happen to share a border.
 *
 * The photo is `object-contain` and bottom-anchored rather than `cover`,
 * because these are cut-out product shots — cropping them to fill a frame
 * slices the product. Use `FeatureCard` with a `backdrop` when the art is a
 * full-bleed composition and the frame *is* the point.
 */
export function StackedTile({
  eyebrow,
  title,
  body,
  idx = 0,
  span = 1,
  tall = false,
  align = "left",
  className = "",
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  idx?: number;
  span?: Span;
  tall?: boolean;
  align?: "left" | "center";
  className?: string;
  /** The photograph. Rendered into the bottom-anchored media well. */
  children: ReactNode;
}) {
  const centred = align === "center";
  return (
    <motion.article
      {...fadeUpAt(Math.min(idx, 6))}
      className={cn(
        "group card-interactive relative flex flex-col overflow-hidden rounded-[28px] bg-pitch text-crisp",
        "px-7 pt-7 md:px-8 md:pt-8",
        span === 2 && "lg:col-span-2",
        tall && "lg:row-span-2",
        className,
      )}
    >
      <div className={cn("relative", centred && "text-center")}>
        {eyebrow ? <div className="text-[14px] font-medium text-cool">{eyebrow}</div> : null}
        <h3 className="type-title mt-2 hyphens-auto break-words">{title}</h3>
        {body ? (
          <p
            className={cn(
              "mt-3 text-[15px] leading-relaxed text-cool",
              centred && "mx-auto max-w-[46ch]",
            )}
          >
            {body}
          </p>
        ) : null}
      </div>

      {/* `min-h-0` so the well can actually shrink inside the flex column —
          without it the image's intrinsic height wins and overflows the card. */}
      <div className="relative mt-6 flex min-h-0 flex-1 items-end justify-center pb-7 md:pb-8 [&_img]:transition-transform [&_img]:duration-700 [&_img]:ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[&_img]:scale-[1.03]">
        {children}
      </div>
    </motion.article>
  );
}

/**
 * The horizontal highlights shelf, with arrow controls.
 *
 * This is apple.com's "Get the highlights" / "Get to know Mac" row (see
 * refs/apple/screenshot-p4.png and p8): equal-height cards scrolling
 * horizontally, snapping, bleeding past the container to the viewport edge,
 * with two circular controls centred *below* the shelf rather than floating
 * over the content.
 *
 * It deliberately replaces a pinned GSAP scrub. That approach hijacked the
 * page scroll to drive the row sideways, which meant the whole document froze
 * on narrow screens for the duration — and did nothing at all on wide ones,
 * where the cards already fit and the pin was skipped. A scroll-snap row
 * behaves identically at every width, costs no JavaScript to scroll, works
 * with a trackpad swipe, a shift-wheel, a drag or the arrow buttons, and
 * leaves the page scroll alone.
 *
 * `scrollBy` respects `prefers-reduced-motion` by asking for `auto` behaviour
 * when the user has asked for less movement.
 */
export function HighlightsShelf({
  children,
  label,
  stagger = false,
}: {
  children: ReactNode;
  /** Accessible name for the scrollable region and its controls. */
  label: string;
  /**
   * Mark the track for `useScrollChoreography`, so the cards visible on first
   * paint enter as one staggered gesture rather than all at once.
   *
   * Opt-in, because several shelves hold `motion` components that already
   * animate themselves — two libraries writing opacity on one node is a
   * flicker. Only set this where the cards are plain elements.
   */
  stagger?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = track.current;
    if (!el) return;
    // 2px of slack: sub-pixel layout means scrollLeft rarely hits the exact
    // maximum, and without it the trailing arrow never disables.
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      ro.disconnect();
    };
  }, [sync]);

  const page = (dir: -1 | 1) => {
    const el = track.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    // Advance by one card plus the gap, so a page lands on a snap point
    // instead of halfway across two cards.
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * step, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div>
      <div
        ref={track}
        role="group"
        aria-label={label}
        tabIndex={0}
        data-stagger={stagger || undefined}
        // `scroll-p-[--gutter]` is load-bearing: the snapport defaults to the
        // padding box, so a `snap-start` card aligned to the track's content
        // edge makes the browser scroll by exactly the re-pad amount — the
        // first card then sits flush against the viewport edge and reads as a
        // missing margin. Moving the snapport in by the gutter keeps the
        // re-pad visible at rest.
        className="no-scrollbar bleed-x flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth scroll-p-[var(--gutter)] pb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
      >
        {children}
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        {([-1, 1] as const).map((dir) => {
          const disabled = dir === -1 ? atStart : atEnd;
          const Icon = dir === -1 ? ChevronLeft : ChevronRight;
          return (
            <button
              key={dir}
              type="button"
              onClick={() => page(dir)}
              disabled={disabled}
              aria-label={`${label}: ${dir === -1 ? "previous" : "next"}`}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full bg-charcoal text-crisp",
                "transition-[opacity,transform] duration-200",
                "hover:scale-105 active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2",
                disabled && "pointer-events-none opacity-30",
              )}
            >
              <Icon className="h-5 w-5" aria-hidden />
            </button>
          );
        })}
      </div>
    </div>
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
      className={`no-scrollbar bleed-x flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-p-[var(--gutter)] pb-2 lg:mx-0 lg:grid lg:snap-none lg:overflow-visible lg:px-0 ${
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
  /**
   * Links out of the column, rendered as a footer row beneath the table.
   *
   * apple.com's "Which laptop is right for you?" puts Buy and Learn more under
   * every column, and it is not decoration: a comparison table exists to end in
   * a choice, and a table with no way to act on the choice sends the reader
   * back to search. It is also the densest internal-link surface on the site —
   * every model, twice, from one page.
   */
  actions?: ReactNode;
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
  rowHeaderLabel,
}: {
  columns: CompareColumn[];
  rows: { id: string; label: string }[];
  caption?: string;
  /**
   * Accessible name for the top-left cell — the column of row labels.
   *
   * It has to be named. The cell is a `<th scope="col">` with no text, which is
   * a WCAG failure (`empty-table-header`) because a screen reader announcing
   * the table's columns reads a blank one and gives the listener nothing to
   * anchor the row labels to. It stays visually empty; the label is `sr-only`.
   */
  rowHeaderLabel?: string;
}) {
  return (
    <div className="no-scrollbar bleed-x overflow-x-auto md:mx-0 md:px-0">
      <table className="w-full min-w-[640px] border-collapse text-center">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr>
            <th scope="col" className="w-[1%] whitespace-nowrap p-0 text-left">
              <span className="sr-only">{rowHeaderLabel ?? "Specification"}</span>
            </th>
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
        {columns.some((c) => c.actions) ? (
          <tfoot>
            <tr className="border-t border-border">
              <td className="p-0" />
              {columns.map((c) => (
                <td key={c.id} className="px-3 pt-8 align-top md:px-5">
                  {c.actions ? (
                    <div className="flex flex-col items-center gap-3">{c.actions}</div>
                  ) : null}
                </td>
              ))}
            </tr>
          </tfoot>
        ) : null}
      </table>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   apple.com's typographic and layout devices

   These are the details that separate "uses Apple's greys" from "reads as
   apple.com". Each one is lifted from a specific place in the reference
   captures under refs/apple/, and each is annotated with where.
   ══════════════════════════════════════════════════════════════ */

/**
 * A headline whose closing phrase takes a lighter tint.
 *
 * "Might takes *flight*." "Get the *highlights*." "Built to go *places*."
 * apple.com does this on almost every section head, and it is doing real work:
 * the tint marks where the claim turns from subject to promise, so the eye
 * lands on the verb rather than reading a flat line of bold text.
 *
 * `tintFrom` counts words from the END, because that is where the device
 * always sits and counting backwards survives translation — Russian and Uzbek
 * reorder the sentence but keep the payload late.
 *
 * The tint is `--cool` (#6e6e73), Apple's own secondary grey, not the brand
 * red: red at headline size reads as an error state, and the accent is spent
 * on actions.
 */
export function TintedHeadline({
  children,
  tintFrom = 1,
  as: Tag = "h2",
  className = "",
}: {
  children: string;
  /** How many trailing words take the tint. */
  tintFrom?: number;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  const words = children.trim().split(/\s+/);
  const split = Math.max(0, words.length - Math.max(1, tintFrom));
  const lead = words.slice(0, split).join(" ");
  const tail = words.slice(split).join(" ");

  return (
    <Tag className={cn("text-balance", className)}>
      {lead ? `${lead} ` : null}
      <span className="text-cool">{tail}</span>
    </Tag>
  );
}

/**
 * The price-and-buy pair from the MacBook Air hero.
 *
 * A grey pill carrying the price sits immediately left of a solid accent
 * button. Apple pairs them so the number and the commitment are one object —
 * a price floating alone above a button reads as a caption, and the two
 * separated read as two unrelated decisions.
 */
export function PricePill({
  price,
  action,
  note,
}: {
  price: string;
  action: { label: string; onClick: () => void };
  /** Optional second line inside the pill, e.g. a warranty note. */
  note?: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <div className="rounded-full bg-charcoal px-5 py-2.5 text-center">
        <div className="text-[15px] font-medium leading-tight text-crisp">{price}</div>
        {note ? <div className="text-[12px] leading-tight text-cool">{note}</div> : null}
      </div>
      <button onClick={action.onClick} className="pill pill-accent">
        {action.label}
      </button>
    </div>
  );
}

/**
 * A figure stated at display size on its own panel.
 *
 * The MacBook Air design section renders `13"` / `15"` as 64px numerals on a
 * light grey panel, with the unit beneath at body size. It works because the
 * number is the argument — surrounding it with prose would bury it.
 *
 * Use for the two or three figures that actually decide a purchase (range,
 * ingress rating, battery), never for a whole spec table.
 */
export function StatPanel({
  value,
  label,
  caption,
  className = "",
  children,
}: {
  value: string;
  label?: string;
  /** Sits below the panel, outside it — apple.com's caption position. */
  caption?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <figure className={cn("m-0", className)}>
      <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[28px] bg-charcoal px-8 py-12 text-center">
        {/* `text-balance` and `hyphens-none`: a value like "up to 900 m" broke
            across two lines at narrow panel widths, splitting the unit off the
            number it belongs to. The figure is the whole point of the panel. */}
        <div className="text-balance hyphens-none text-[clamp(2.5rem,5.5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-crisp">
          {value}
        </div>
        {label ? <div className="mt-2 text-[17px] text-cool">{label}</div> : null}
        {children}
      </div>
      {caption ? <figcaption className="mt-5 max-w-[52ch]">{caption}</figcaption> : null}
    </figure>
  );
}

/**
 * apple.com's caption: a bold lead-in clause, then regular prose.
 *
 * "**Two perfectly portable sizes.** The 13-inch MacBook Air is the ultimate
 * on-the-go laptop…" — the bold half is the claim, the rest is the evidence.
 * It lets a scanning reader take only the bold and still learn something,
 * which a uniformly-weighted caption does not.
 */
export function LeadInCaption({
  lead,
  children,
  className = "",
}: {
  lead: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-[15px] leading-relaxed text-cool", className)}>
      <span className="font-semibold text-crisp">{lead}</span>
      {children ? <> {children}</> : null}
    </p>
  );
}

/**
 * The segmented filter above apple.com/mac's lineup ("All products · Laptops ·
 * Desktops · Displays").
 *
 * The chips were already right — a solid dark pill for the selection, plain
 * text for the rest, because a row of grey pills with one darker one takes a
 * second look to parse. What was missing is the **track**: on apple.com the
 * whole row sits inside one pill-shaped light-grey container, and that
 * container is the control's entire visual signature. Without it the chips
 * float on the band and the group reads as four unrelated buttons.
 *
 * `LangToggle` already had this exact construction, including the trick that
 * makes it work: the chip stays compact (34px, 13px text — a 44px-tall filter
 * row would out-shout the lineup it filters) while a transparent `::after`
 * overlay extends the tap target to the 44px a thumb needs. Painting the chip
 * at 44px and extending nothing is what made the previous version chunky.
 *
 * One row, scrolling rather than wrapping. `no-scrollbar` and `mask-fade-x`
 * were written for precisely this and had been orphaned since the row became
 * `flex-wrap` — a wrapped second row of chips breaks the track's pill shape.
 *
 * Still `role="radiogroup"` over buttons rather than real `<input type=radio>`:
 * the filtering is instant and the set is small. Arrow-key navigation is
 * implemented explicitly below, because `role="radio"` promises it and a bare
 * button group does not deliver it.
 */
export function FilterPills<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  /** Accessible name for the group. */
  label: string;
  className?: string;
}) {
  // Roving tabindex: only the selected chip is tabbable, and the arrow keys
  // move the selection. That is the contract `role="radiogroup"` advertises,
  // and the previous version advertised it without honouring it — Tab stepped
  // through all four chips and the arrows did nothing.
  const move = (delta: number) => {
    const i = options.findIndex((o) => o.value === value);
    if (i < 0) return;
    const next = options[(i + delta + options.length) % options.length];
    onChange(next.value);
  };

  return (
    /* `no-scrollbar` on the *scrolling* element, and deliberately no
       `mask-fade-x`: the track is a discrete rounded object, and fading its
       edges would dissolve the very corners that give it its pill shape. */
    <div className={cn("no-scrollbar max-w-full overflow-x-auto", className)}>
      <div
        role="radiogroup"
        aria-label={label}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            e.preventDefault();
            move(1);
          } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            e.preventDefault();
            move(-1);
          }
        }}
        // A translucent ink tint, not `bg-charcoal`. The lineup sits on the
        // `soft` band, which *is* `--charcoal` — so a charcoal track was
        // #f5f5f7 on #f5f5f7 and the container disappeared entirely, which is
        // the whole reason the row read as loose chips in the first place. A
        // 5% tint darkens whatever it is placed on, so the track survives a
        // section moving between white and soft.
        className={cn(
          "inline-flex w-max items-center gap-1 rounded-full p-1",
          "bg-[color-mix(in_oklab,var(--crisp)_5%,transparent)]",
        )}
      >
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(o.value)}
              className={cn(
                "relative flex items-center justify-center whitespace-nowrap rounded-full px-4 py-1.5",
                "text-[13px] font-medium leading-[1.4] transition-colors duration-200",
                // The tap target, not the chip. `::after` paints nothing and
                // sits outside the track's 4px padding, so three of these
                // overlapping is harmless — a touch still lands on whichever
                // chip's centre is nearest.
                "after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-['']",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2",
                active ? "bg-crisp text-pitch" : "text-cool hover:text-crisp",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * The thumbnail nav that sits directly under the family name on apple.com/mac.
 *
 * Nine small product cutouts with an 11px label beneath each, in a row that
 * scrolls when it runs out of room. Apple puts it above the fold on every
 * family page for one reason: a visitor who arrived on `/mac` looking for a
 * Mac mini can leave for it without reading a word of the lineup.
 *
 * The same argument applies harder here. A visitor landing on `/motorola` from
 * «Motorola рации Ташкент» has thirteen models to sort through, and the strip
 * is the only control on the page that lets them jump straight to the one they
 * came for. It is real anchor links, not a carousel widget, so it also gives
 * the crawler a dense in-page link mesh to the model URLs.
 */
export function ModelStrip({ children, label }: { children: ReactNode; label: string }) {
  return (
    <nav aria-label={label} className="bleed-x">
      {/* gap-6, not gap-8. At 1440 the Radiocom row is nine chips wide and
          needs 1192px against the 1164px the shell gives it — a 28px overflow,
          just enough to clip the last label's final letter. The row is a
          scroller and longer families (Motorola has fifteen) scroll properly,
          but a row that almost fits and clips one glyph reads as a bug rather
          than as an invitation to scroll. `pr-2` keeps the last chip off the
          clip edge when it does scroll. */}
      <ul className="no-scrollbar flex gap-5 overflow-x-auto pb-1 pr-2 md:gap-6">{children}</ul>
    </nav>
  );
}

/**
 * One cell of a `ModelStrip`: a small cutout above a label.
 *
 * Split out from `ModelStrip` because the link element itself has to come from
 * the caller — `LocaleLink` needs typed route params this file has no business
 * knowing about — while the internals stay identical everywhere.
 */
export function ModelStripItem({
  image,
  imageSmall,
  label,
}: {
  image: string;
  imageSmall?: string;
  label: string;
}) {
  return (
    <span className="flex w-[104px] flex-col items-center gap-3 text-center">
      {/* 96px, not 52. apple.com/mac's chip row renders each model around 110px
          tall — big enough to tell an Air from a Pro at a glance, which is the
          row's entire job. At 52px these were indistinguishable black
          rectangles and the row read as decoration. */}
      <span className="flex h-[96px] items-end justify-center">
        <img
          src={image}
          srcSet={imageSmall ? `${imageSmall} 800w, ${image} 1600w` : undefined}
          sizes={imageSmall ? "104px" : undefined}
          alt=""
          width={152}
          height={104}
          loading="lazy"
          decoding="async"
          className="max-h-[96px] w-auto object-contain mix-blend-multiply transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
        />
      </span>
      <span className="text-[12px] leading-tight text-crisp">{label}</span>
    </span>
  );
}

/**
 * A card whose detail is behind a `+` control in its bottom-right corner.
 *
 * apple.com uses this wherever a claim needs a footnote that would otherwise
 * bury the claim — «Сделано из 55% переработанного материала» reads in one
 * glance, and the paragraph explaining the certification is one tap away.
 *
 * Implemented as a real `<button>` driving `aria-expanded` over a
 * `grid-template-rows: 0fr → 1fr` disclosure, which is the same mechanism the
 * FAQ accordion uses. The detail stays in the DOM in both states, so it is
 * indexable and findable with ⌘F even while collapsed — a `display:none`
 * panel is neither.
 */
export function ExpandCard({
  eyebrow,
  title,
  body,
  detail,
  media,
  idx = 0,
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  /** Revealed by the `+`. Omit and the control is not rendered. */
  detail?: ReactNode;
  media?: ReactNode;
  idx?: number;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.article
      {...fadeUpAt(idx)}
      className={cn(
        "relative flex flex-col overflow-hidden rounded-[18px] bg-pitch p-6",
        "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-16px_rgba(0,0,0,0.18)]",
        className,
      )}
    >
      {eyebrow ? (
        <div className="mb-2 text-[12px] font-medium leading-tight text-cool">{eyebrow}</div>
      ) : null}
      <h3 className="text-[17px] font-semibold leading-[1.25] tracking-[-0.01em] text-crisp">
        {title}
      </h3>
      {body ? <p className="mt-2 text-[13px] leading-relaxed text-cool">{body}</p> : null}

      {detail ? (
        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          {/* `min-h-0` is what lets the 0fr row actually collapse; without it
              the row floors at the content's min-content height and the card
              never closes. */}
          <div className="min-h-0 overflow-hidden">
            <p className="mt-3 text-[13px] leading-relaxed text-cool">{detail}</p>
          </div>
        </div>
      ) : null}

      {media ? <div className="mt-5 flex flex-1 items-end justify-center">{media}</div> : null}

      {detail ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className={cn(
            "absolute bottom-4 right-4 flex h-7 w-7 items-center justify-center rounded-full",
            "bg-crisp text-pitch transition-transform duration-300",
            "hover:scale-110 active:scale-95",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2",
            open && "rotate-45",
          )}
        >
          {/* Drawn rather than an icon import: one glyph that rotates 45° to
              become a close control is smaller than shipping both Plus and X. */}
          <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" aria-hidden>
            <path
              d="M7 1v12M1 7h12"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <span className="sr-only">{open ? "−" : "+"}</span>
        </button>
      ) : null}
    </motion.article>
  );
}

/**
 * A figure tinted inside a running sentence.
 *
 * The environment cards on apple.com read «Сделано из **55% переработанного
 * материала** по весу» with only the quantity in colour — the sentence stays a
 * sentence, but the number is what the eye takes on a scan. Bolding it instead
 * would shout; a separate stat panel would break the sentence apart.
 *
 * Not the brand red. Red on a claim reads as a warning, so this uses the same
 * ink as the surrounding text at full weight while the rest sits at `--cool`,
 * which produces the same figure-ground separation without the alarm.
 */
export function TintTag({ children }: { children: ReactNode }) {
  return <span className="font-medium text-crisp">{children}</span>;
}

/**
 * The tall poster card from apple.com/mac's "Get to know Mac" shelf.
 *
 * A 2:3 portrait frame filled edge to edge by a photograph, with a small
 * eyebrow and a two-line headline set over the top-left corner and an optional
 * `+` bottom-right. Apple runs eight of them in a scrolling row, and they are
 * what stops a long page from being an unbroken sequence of white cards.
 *
 * The headline sits on the photograph, so legibility cannot be left to luck: a
 * top-down scrim runs under the copy on every card regardless of how light the
 * frame is. Without it a headline over a bright sky is unreadable, and the
 * failure only shows up on the one photograph nobody checked.
 */
export function PosterCard({
  eyebrow,
  title,
  image,
  href,
  idx = 0,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  image: string;
  /** The whole card is the link target; the caller supplies the element. */
  href?: ReactNode;
  idx?: number;
  className?: string;
}) {
  return (
    <motion.article
      {...fadeUpAt(Math.min(idx, 6))}
      className={cn(
        "group relative isolate flex aspect-[2/3] flex-col overflow-hidden rounded-[18px] bg-charcoal",
        className,
      )}
    >
      <img
        src={image}
        alt=""
        loading="lazy"
        decoding="async"
        width={600}
        height={900}
        sizes="(min-width: 1024px) 220px, 54vw"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
      />
      {/* The scrim is not decoration — it is what makes the copy legible over
          an arbitrary photograph. Top-weighted, because that is where the copy
          is, and it fades out before the middle so the subject stays clear. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-black/70 to-transparent"
      />
      {/* `p-4` below `sm`. On a phone these sit two to a row, so the card is
          165px wide and 20px of padding each side left 125px for the title —
          "Добыча · Нефть · Газ" broke across two 93px lines. 16px of padding
          gives it the width to sit on one. */}
      <div className="relative z-10 p-4 sm:p-5">
        {eyebrow ? (
          <div className="text-[12px] font-medium leading-tight text-white/85">{eyebrow}</div>
        ) : null}
        {/* `max-w-[15ch]` from `sm` up only. It exists to stop a long sector
            name running a desktop card's full width, but on a 210px phone card
            15ch is ~130px — narrower than the card — so "Добыча · Нефть · Газ"
            broke across two 93px lines for no reason. */}
        <h3 className="mt-1 text-[15px] font-semibold leading-[1.2] tracking-[-0.01em] text-white sm:max-w-[15ch] sm:text-[17px]">
          {title}
        </h3>
      </div>
      {href}
    </motion.article>
  );
}

/**
 * The 2-up card from apple.com/mac's "Switch to Mac" and "Mac essentials".
 *
 * Centred copy at the top — title, one line of body, a text link — and a
 * photograph filling the bottom half. Apple uses it for the two or three
 * things it wants to say after the lineup has done its work, and the centring
 * is what separates it from the left-aligned cards above: it reads as a
 * closing pair rather than more of the same list.
 */
export function DuoCard({
  title,
  body,
  link,
  media,
  idx = 0,
  tone = "light",
  className = "",
}: {
  title: string;
  body?: string;
  link?: ReactNode;
  media?: ReactNode;
  idx?: number;
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <motion.article
      {...fadeUpAt(Math.min(idx, 6))}
      className={cn(
        "group card-interactive flex flex-col overflow-hidden rounded-[28px] pt-9 text-center md:pt-11",
        dark ? "is-dark bg-black text-[#f5f5f7]" : "bg-pitch text-crisp",
        className,
      )}
    >
      <div className="px-7 md:px-9">
        <h3 className="type-title mx-auto max-w-[22ch]">{title}</h3>
        {body ? (
          <p
            className={cn(
              "mx-auto mt-3 max-w-[38ch] text-[14px] leading-relaxed",
              dark ? "text-white/60" : "text-cool",
            )}
          >
            {body}
          </p>
        ) : null}
        {link ? <div className="mt-4 flex justify-center">{link}</div> : null}
      </div>
      {media ? (
        <div className="mt-7 flex min-h-0 flex-1 items-end justify-center overflow-hidden">
          {media}
        </div>
      ) : null}
    </motion.article>
  );
}
