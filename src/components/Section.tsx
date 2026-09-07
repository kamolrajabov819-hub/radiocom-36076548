import type { ReactNode, CSSProperties } from "react";
import { ChevronRight } from "lucide-react";
import { LocaleLink } from "@/components/LocaleLink";
import { brandCase } from "@/lib/brand";
import { WordReveal } from "@/components/WordReveal";

/**
 * Band background classes, spelled out as literals.
 *
 * These were built as a template — `band-${band}` — which Tailwind v4 cannot
 * see: it only emits an `@utility` rule when the class name appears verbatim in
 * a scanned source file. Three of the four happened to be written out elsewhere;
 * `band-dark` was not, so the dark closing block on all six industry pages
 * rendered as white text on a white background.
 */
const BAND_CLASS = {
  plain: "band-plain",
  soft: "band-soft",
  dark: "band-dark",
  tint: "band-tint",
} as const;

/**
 * The page's one section wrapper.
 *
 * `band` picks the background from the plain/soft/dark alternation, `tight`
 * picks the vertical rhythm step, and the inner `.shell` supplies the single
 * horizontal inset the whole site shares. Use this instead of hand-rolling a
 * `<section className="px-4 md:px-6">` — that is how the left edge drifted to
 * four different values in the first place.
 *
 * `bleed` drops the inset for full-width media, but still publishes `--gutter`
 * so children can re-pad themselves with `.shell` or `.bleed-x`.
 *
 * The inner shell carries `data-reveal`, which is how phones get their section
 * motion. GSAP is gated behind `(min-width: 768px)` *before* its dynamic import
 * so a phone never downloads the 27 KB chunk, and that gate left phones with
 * nothing but Framer's per-card entrances — which is why the site read as
 * motionless on a phone. `data-reveal` is read only by the CSS/observer layer
 * in `src/lib/motion.ts`, so marking it here changes nothing on a desktop.
 *
 * Marking it once, here, rather than per section is deliberate: a section that
 * has to be remembered is a section that gets forgotten, and the pages that
 * measured most static were the ones nobody had marked.
 */
export function Section({
  children,
  className = "",
  band,
  tight = false,
  bleed = false,
  wide = false,
  reveal = true,
  style,
  id,
}: {
  children: ReactNode;
  className?: string;
  band?: "plain" | "soft" | "dark" | "tint";
  tight?: boolean;
  bleed?: boolean;
  wide?: boolean;
  /**
   * Opt out of the phone reveal. For a section whose own children already
   * animate as the section's entrance, where a wrapper fade on top would read
   * as two beats instead of one.
   */
  reveal?: boolean;
  style?: CSSProperties;
  id?: string;
}) {
  const rhythm = tight ? "section-tight" : "section";
  const bandClass = band ? BAND_CLASS[band] : "";
  return (
    <section id={id} style={style} className={`${bandClass} ${rhythm} ${className}`}>
      <div
        data-reveal={reveal ? "" : undefined}
        className={bleed ? "shell !px-0" : `shell ${wide ? "shell-wide" : ""}`}
      >
        {children}
      </div>
    </section>
  );
}

/**
 * Section header.
 *
 * `link` renders apple.com's trailing action ("Shop Mac >") on the baseline of a
 * left-aligned heading; `spacing="tight"` matches the closer heading-to-content
 * gap Apple uses on card shelves, against the roomier default for editorial
 * sections.
 */
export function SectionHead({
  eyebrow,
  title,
  sub,
  align = "center",
  invert = false,
  link,
  spacing = "loose",
  as = "h2",
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  align?: "center" | "left";
  /**
   * The heading level this title renders at.
   *
   * `h2` is right almost everywhere — a `SectionHead` names a section inside a
   * page that already has its own `h1`. The exceptions are the pages whose
   * *only* title is a `SectionHead`: the sitemap and the search page both
   * opened with an `h2` and shipped no `h1` at all, which leaves a crawler and
   * a screen reader without the one element that says what the page is.
   */
  as?: "h1" | "h2";
  invert?: boolean;
  link?: {
    label: string;
    /** Internal route, locale-resolved. Prefer this over href for site links. */
    to?:
      | "/radiocom"
      | "/motorola"
      | "/compare"
      | "/poc"
      | "/service"
      | "/industries"
      | "/search"
      | "/sitemap";
    href?: string;
    onClick?: () => void;
  };
  spacing?: "loose" | "tight";
}) {
  const centred = align === "center";
  const gap = spacing === "tight" ? "mb-8 md:mb-10" : "mb-14";

  const heading = (
    <div className={centred ? "text-center mx-auto max-w-3xl" : "text-left"}>
      {eyebrow && (
        <div className="eyebrow-sweep text-[13px] tracking-wide font-medium mb-4">
          {brandCase(eyebrow)}
        </div>
      )}
      {/*
        `headline` carries weight, tracking and leading but deliberately no
        font-size, and no call site was supplying one — so every section title
        on the site rendered at the 16px body size while the sections that
        hand-rolled their own <h2> got 52px. `type-headline` is the tier these
        were always meant to sit in.
      */}
      <WordReveal
        as={as}
        text={title}
        className={`type-headline block ${invert ? "text-white" : "text-crisp"}`}
      />
      {sub && (
        <p className={`subhead mt-4 text-lg ${centred ? "mx-auto max-w-2xl" : ""}`}>
          {brandCase(sub)}
        </p>
      )}
    </div>
  );

  if (!link) return <div className={gap}>{heading}</div>;

  return (
    <div className={`${gap} flex flex-wrap items-end justify-between gap-4`}>
      {heading}
      {link.to ? (
        <LocaleLink to={link.to} className="pill-link shrink-0">
          {brandCase(link.label)} <ChevronRight className="w-4 h-4" aria-hidden />
        </LocaleLink>
      ) : link.href ? (
        <a href={link.href} className="pill-link shrink-0">
          {brandCase(link.label)} <ChevronRight className="w-4 h-4" aria-hidden />
        </a>
      ) : (
        <button onClick={link.onClick} className="pill-link shrink-0">
          {brandCase(link.label)} <ChevronRight className="w-4 h-4" aria-hidden />
        </button>
      )}
    </div>
  );
}
