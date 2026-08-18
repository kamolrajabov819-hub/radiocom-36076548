import type { ReactNode, CSSProperties } from "react";
import { ChevronRight } from "lucide-react";
import { LocaleLink } from "@/components/LocaleLink";
import { WordReveal } from "@/components/WordReveal";

export function Section({
  children,
  className = "",
  tight = false,
  bleed = false,
  style,
  id,
}: {
  children: ReactNode;
  className?: string;
  tight?: boolean;
  bleed?: boolean;
  style?: CSSProperties;
  id?: string;
}) {
  const pad = tight ? "py-16 md:py-24" : "py-24 md:py-32";
  return (
    <section id={id} style={style} className={`${pad} ${className}`}>
      <div className={bleed ? "" : "max-w-[1200px] mx-auto px-6 md:px-10"}>{children}</div>
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
    to?: "/catalog" | "/poc" | "/service" | "/industries";
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
      <WordReveal
        as="h2"
        text={title}
        className={`headline block ${invert ? "text-white" : "text-crisp"}`}
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
