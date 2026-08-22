import type { ReactNode, CSSProperties } from "react";
import { ChevronRight } from "lucide-react";
import { LocaleLink } from "@/components/LocaleLink";
import { WordReveal } from "@/components/WordReveal";

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
 */
export function Section({
  children,
  className = "",
  band,
  tight = false,
  bleed = false,
  wide = false,
  style,
  id,
}: {
  children: ReactNode;
  className?: string;
  band?: "plain" | "soft" | "dark" | "tint";
  tight?: boolean;
  bleed?: boolean;
  wide?: boolean;
  style?: CSSProperties;
  id?: string;
}) {
  const rhythm = tight ? "section-tight" : "section";
  const bandClass = band ? `band-${band}` : "";
  return (
    <section id={id} style={style} className={`${bandClass} ${rhythm} ${className}`}>
      <div className={bleed ? "shell !px-0" : `shell ${wide ? "shell-wide" : ""}`}>{children}</div>
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
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  align?: "center" | "left";
  invert?: boolean;
  link?: {
    label: string;
    /** Internal route, locale-resolved. Prefer this over href for site links. */
    to?: "/radiocom" | "/motorola" | "/compare" | "/poc" | "/service" | "/industries";
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
        <div className="eyebrow-sweep text-[13px] tracking-wide font-medium mb-4">{eyebrow}</div>
      )}
      {/*
        `headline` carries weight, tracking and leading but deliberately no
        font-size, and no call site was supplying one — so every section title
        on the site rendered at the 16px body size while the sections that
        hand-rolled their own <h2> got 52px. `type-headline` is the tier these
        were always meant to sit in.
      */}
      <WordReveal
        as="h2"
        text={title}
        className={`type-headline block ${invert ? "text-white" : "text-crisp"}`}
      />
      {sub && <p className={`subhead mt-4 text-lg ${centred ? "mx-auto max-w-2xl" : ""}`}>{sub}</p>}
    </div>
  );

  if (!link) return <div className={gap}>{heading}</div>;

  return (
    <div className={`${gap} flex flex-wrap items-end justify-between gap-4`}>
      {heading}
      {link.to ? (
        <LocaleLink to={link.to} className="pill-link shrink-0">
          {link.label} <ChevronRight className="w-4 h-4" aria-hidden />
        </LocaleLink>
      ) : link.href ? (
        <a href={link.href} className="pill-link shrink-0">
          {link.label} <ChevronRight className="w-4 h-4" aria-hidden />
        </a>
      ) : (
        <button onClick={link.onClick} className="pill-link shrink-0">
          {link.label} <ChevronRight className="w-4 h-4" aria-hidden />
        </button>
      )}
    </div>
  );
}
