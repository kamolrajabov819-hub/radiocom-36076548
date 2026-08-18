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
 *  1. `SectionHead`  — oversized left-aligned headline ending in a full stop,
 *                      with an optional blue action link on the right.
 *  2. `FeatureCard`  — white card on a grey band: small grey eyebrow, bold
 *                      two-line headline, short body, media, round corner button.
 *  3. `ScrollRow`    — the horizontally snapping row those cards sit in.
 */

/* ── 1. Section header ─────────────────────────────────────── */

export function SectionHead({
  title,
  link,
  align = "left",
  tone = "light",
}: {
  title: ReactNode;
  link?: { label: string; onClick?: () => void; href?: string };
  align?: "left" | "center";
  tone?: "light" | "dark";
}) {
  return (
    <motion.div
      {...fadeUpAt(0)}
      className={`mb-8 flex flex-wrap items-end gap-4 md:mb-10 ${
        align === "center" ? "justify-center text-center" : "justify-between"
      }`}
    >
      <h2 className={`type-headline ${tone === "dark" ? "" : "text-crisp"}`}>{title}</h2>
      {link ? (
        link.href ? (
          <a href={link.href} className="pill-link shrink-0">
            {link.label} <ChevronRight className="h-4 w-4" aria-hidden />
          </a>
        ) : (
          <button onClick={link.onClick} className="pill-link shrink-0">
            {link.label} <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        )
      ) : null}
    </motion.div>
  );
}

/* ── 2. Feature card ───────────────────────────────────────── */

export function FeatureCard({
  eyebrow,
  title,
  body,
  media,
  action,
  tone = "light",
  idx = 0,
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  media?: ReactNode;
  action?: { label: string; onClick: () => void };
  tone?: "light" | "dark";
  idx?: number;
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <motion.article
      {...fadeUpAt(Math.min(idx, 6))}
      className={`group relative flex flex-col overflow-hidden rounded-[28px] p-7 md:p-8 ${
        dark ? "bg-black text-[#f5f5f7]" : "bg-pitch text-crisp"
      } ${className}`}
    >
      {eyebrow ? (
        <div className={`text-[14px] font-medium ${dark ? "text-white/60" : "text-cool"}`}>
          {eyebrow}
        </div>
      ) : null}

      <h3 className="mt-1.5 text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] md:text-[28px]">
        {title}
      </h3>

      {body ? (
        <p className={`mt-3 text-[15px] leading-relaxed ${dark ? "text-white/70" : "text-cool"}`}>
          {body}
        </p>
      ) : null}

      {media ? (
        <div className="relative mt-6 flex flex-1 items-end justify-center">{media}</div>
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

/* ── 3. Scroll row ─────────────────────────────────────────── */

/**
 * Horizontally snapping row. Below `lg` it scrolls with snap points the way the
 * apple.com card shelves do; at `lg` and up it settles into a plain grid so
 * nothing is hidden off-screen on desktop.
 */
export function ScrollRow({ children, cols = 4 }: { children: ReactNode; cols?: 3 | 4 }) {
  return (
    <div
      className={`no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:-mx-6 md:px-6 lg:mx-0 lg:grid lg:snap-none lg:overflow-visible lg:px-0 ${
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
