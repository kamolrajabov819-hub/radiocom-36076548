import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useScrollChoreography } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { brandCase } from "@/lib/brand";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Check, Radio, MapPin, MessagesSquare, Layers, Coins, Wifi } from "lucide-react";
// The hero — the pair shot you asked for, as its cutout rather than as
// `product/radios-pair.webp`.
//
// They are the same photograph; I compared them side by side before swapping.
// The difference matters here because the hero sits on a tinted band, and the
// white-sweep version cannot blend into one: `mix-blend-multiply` composites
// against the nearest stacking context, and the parallax wrapper around this
// image has a `transform`, which creates one. Inside it the backdrop is
// transparent, so the blend has nothing to multiply against and the sweep
// renders as a hard white rectangle on the tint. The cutout has no sweep, so
// there is nothing to blend and nothing to go wrong.
//
// `poc-hero-v13.png`, which this replaces, was a 1.19 MB opaque PNG rendered
// at 560 CSS px — the heaviest single file on the site and this page's LCP.
import heroPair from "@/assets/cutout/pair-crossed-cutout.webp";
import heroPair800 from "@/assets/cutout/pair-crossed-cutout@800.webp";
// Three more cutouts for the feature sequence, one for the rental close.
// The PoC set, normalised by `scripts/build-poc-cutouts.ts` — see there for why
// the uploads needed a pass before they could be used: a sparse alpha veil that
// hid where each subject actually was, and subject scale running from 36% to
// 86% of canvas, which is what made four photographs of the same product read
// as four unrelated stock shots.
import shotMedia from "@/assets/cutout/poc-handover-box-cutout.webp";
import shotMedia800 from "@/assets/cutout/poc-handover-box-cutout@800.webp";
import shotGps from "@/assets/cutout/poc-radio-in-hand-cutout.webp";
import shotGps800 from "@/assets/cutout/poc-radio-in-hand-cutout@800.webp";
import shotScale from "@/assets/cutout/poc-fleet-fan-cutout.webp";
import shotScale800 from "@/assets/cutout/poc-fleet-fan-cutout@800.webp";
import radioInHand from "@/assets/cutout/poc-radio-held-cutout.webp";
import radioInHand800 from "@/assets/cutout/poc-radio-held-cutout@800.webp";
import { openLead } from "@/components/LeadFormSheet";
import { Section, SectionHead } from "@/components/Section";
import {
  CompareTable,
  HighlightsShelf,
  StatPanel,
  statRowTier,
  type CompareColumn,
} from "@/components/apple";
import { ProductShot } from "@/components/ProductShot";
import { TrustedBy } from "@/components/TrustedBy";
import { spring, fadeUpAt } from "@/lib/springs";

/**
 * The six rows of the PoC-vs-PMR matrix.
 *
 * This page has exactly one body of real copy — `poc.rows.*` paired with
 * `poc.poc_vals.*` and `poc.pmr_vals.*` — and the page is built from it. Every
 * apple.com product page carries bespoke prose per section; inventing that here
 * is what the brief rules out, so the same six facts do three jobs instead:
 * three become the stat band, three become the feature sequence, and all six
 * stay in the comparison table where a buyer can read down one axis.
 */
const ROW_IDS = ["coverage", "infra", "media", "gps", "scale", "cost"] as const;

export function PoCPage() {
  const page = useScrollChoreography();

  return (
    <div ref={page} className="page-anim page-tight">
      <PocHero />
      <StatBand />
      <FeatureSequence />
      <Compare />
      <NetworkDesign />
      <Rental />
      <TrustedBy />
    </div>
  );
}

/* ─── Hero — a device on a tinted stage ───────────────────── */
/**
 * `band-tint` rather than `band-plain`.
 *
 * apple.com does not stand a product hero on flat white — the MacBook Air page
 * washes the top of the band with colour that resolves to white before the next
 * section, so the product appears to sit *in* a space rather than on a sheet.
 * This page was the last one still on the flat treatment, which is much of why
 * it read as a different site from the product pages.
 *
 * The stage is also far larger. A 560px cap on a 1440 display is a thumbnail by
 * apple.com's standards; `min(78vw, 1080px)` is the proportion a product hero
 * actually wants, and it is what you asked for.
 */
function PocHero() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const deviceY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -70]);
  const deviceScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.04]);

  return (
    <section ref={ref} className="relative overflow-hidden band-tint pt-32 pb-20 md:pt-44 md:pb-28">
      <div className="relative shell text-center">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="text-[13px] font-medium tracking-tight text-signal"
        >
          {t("poc.kicker")}
        </motion.div>

        <h1 className="type-display mt-4 text-crisp">
          {[t("poc.title_a"), t("poc.title_b")].map((line, li) => (
            <span key={li} className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
              <motion.span
                className="inline-block max-w-full"
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ ...spring, delay: 0.08 + li * 0.09 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.26 }}
          className="subhead type-body measure mx-auto mt-5 font-light"
        >
          {t("poc.sub")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.34 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
        >
          <button onClick={() => openLead({ title: t("poc.kicker") })} className="pill pill-accent">
            {t("poc.cta_primary")}
          </button>
          <a href="#poc-compare" className="pill-link">
            {t("poc.cta_secondary")}
          </a>
        </motion.div>

        <motion.div
          style={{ y: deviceY, scale: deviceScale }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.2 }}
          className="relative mx-auto mt-10 w-[min(78vw,1080px)] md:mt-14"
        >
          <ProductShot
            src={heroPair}
            srcSmall={heroPair800}
            cutout
            alt={t("poc.title_a")}
            width={889}
            height={1380}
            priority
            sizes="(max-width: 768px) 86vw, 720px"
            className={`w-full ${reduced ? "" : "float-slow"}`}
            imgClassName="max-h-[62vh]"
          />
        </motion.div>

        {/* Quiet spec row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-[14px] text-cool md:mt-10">
          {[
            { Icon: Wifi, label: "LTE + WiFi" },
            { Icon: MapPin, label: "GPS" },
            { Icon: MessagesSquare, label: t("poc.poc_vals.media") },
          ].map((c, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring, delay: i * 0.06 }}
              className="inline-flex items-center gap-2"
            >
              <c.Icon className="h-4 w-4 shrink-0 text-signal" aria-hidden />
              {c.label}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── The three headline figures ──────────────────────────── */
/**
 * apple.com's stat band, fed from the comparison matrix rather than from
 * invented numbers. Coverage, scale and infrastructure are the three rows where
 * PoC differs from PMR by a category rather than a degree, so they are the
 * three worth stating at size.
 */
function StatBand() {
  const { t } = useTranslation();
  const stats = ["coverage", "scale", "infra"] as const;
  // One size for the row, from its longest value. These three differ enough in
  // length ("Не требуется" against "Глобальная (LTE / WiFi)") to land in three
  // different tiers if each panel sized itself.
  const size = statRowTier(stats.map((id) => t(`poc.poc_vals.${id}`)));

  return (
    <Section band="plain" tight>
      {/* GSAP owns this row, not Framer.
      
          `data-stagger` batches every panel that crosses the fold in one frame
          into a single staggered gesture, which is what apple.com's stat bands
          do. Layering it over a Framer `fadeUpAt` would have both libraries
          writing opacity and transform on the same node, which is a flicker
          rather than a richer animation — so the Framer wrapper is gone. */}
      <div data-stagger className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((id) => (
          <StatPanel
            key={id}
            value={t(`poc.poc_vals.${id}`)}
            label={t(`poc.rows.${id}`)}
            size={size}
          />
        ))}
      </div>
    </Section>
  );
}

/* ─── Feature sequence — alternating copy and product ─────── */
/**
 * Three full-width beats, image and copy swapping sides.
 *
 * The lucide icons this replaces were the section's whole visual content: a
 * 40px glyph in a card, five times. apple.com gives each claim a photograph at
 * a scale you can read, and alternates the side so the page has a rhythm rather
 * than a column.
 *
 * The copy is the matrix again — the row label as the eyebrow, the PoC value as
 * the headline, the PMR value as the counterpoint underneath. Those values are
 * already written as short declaratives, which is the shape an Apple section
 * headline takes.
 */
/**
 * `w`/`h` are each file's real intrinsic size after the cutout pass, and they
 * have to be: the browser reserves its box from this ratio, and the handover
 * frame that now fills the `media` slot is landscape where the shot it replaced
 * was portrait — left at the old 955x1600 the row would reserve a tall box and
 * jump as the image decoded.
 *
 * `cap` is the width each frame is allowed. `object-contain` sizes by whichever
 * edge binds first, so a 1.9:1 scene capped at the same 480px as a 0.65 portrait
 * lands 254px tall against the portrait's 420 — the devices inside it render
 * around half the size and the row stops reading as one set. The wide frame gets
 * the column's full width back so its subject carries comparable weight.
 */
const FEATURES = [
  { id: "media", src: shotMedia, small: shotMedia800, w: 1600, h: 847, cap: "max-w-[560px]" },
  { id: "gps", src: shotGps, small: shotGps800, w: 1038, h: 1600, cap: "max-w-[480px]" },
  { id: "scale", src: shotScale, small: shotScale800, w: 1317, h: 1274, cap: "max-w-[480px]" },
] as const;

function FeatureSequence() {
  const { t } = useTranslation();

  return (
    <Section band="soft">
      <div className="flex flex-col gap-20 md:gap-28">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.id}
            {...fadeUpAt(0)}
            className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-16"
          >
            <div className={i % 2 === 1 ? "md:order-2" : ""}>
              <div className="text-[13px] font-medium uppercase tracking-[0.16em] text-signal">
                {t(`poc.rows.${f.id}`)}
              </div>
              <h2 className="type-headline mt-3 text-crisp">{t(`poc.poc_vals.${f.id}`)}</h2>
              {/* The counterpoint, from the same matrix. "PMR / DMR" is the
                  standard's own name — the literal the compare table's column
                  header uses — so it carries across all three locales as is. */}
              <p className="subhead measure mt-5 text-[17px]">
                PMR / DMR — {t(`poc.pmr_vals.${f.id}`)}
              </p>
            </div>
            <div className={i % 2 === 1 ? "md:order-1" : ""} data-parallax="0.09">
              <ProductShot
                src={f.src}
                srcSmall={f.small}
                cutout
                alt=""
                width={f.w}
                height={f.h}
                sizes="(max-width: 768px) 84vw, 560px"
                className={cn("mx-auto w-full", f.cap)}
                imgClassName="max-h-[420px]"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────
   PoC vs PMR — apple.com's "which one is right for you?" table

   The vendor copy is already a comparison matrix (rows x poc_vals x pmr_vals),
   so it belongs in a table rather than two cards: side-by-side columns let a
   buyer read down one axis, which is the whole point of the section.
   ───────────────────────────────────────────────────────────── */
function Compare() {
  const { t } = useTranslation();

  const rows = ROW_IDS.map((id) => ({ id, label: t(`poc.rows.${id}`) }));
  const columns: CompareColumn[] = [
    {
      id: "poc",
      name: "PoC",
      tagline: t("poc.compare.poc.title"),
      highlight: true,
      media: <Wifi className="h-8 w-8 text-signal" strokeWidth={1.5} aria-hidden />,
      values: Object.fromEntries(ROW_IDS.map((id) => [id, t(`poc.poc_vals.${id}`)])),
    },
    {
      id: "pmr",
      name: "PMR / DMR",
      tagline: t("poc.compare.pmr.title"),
      media: <Radio className="h-8 w-8 text-cool" strokeWidth={1.5} aria-hidden />,
      values: Object.fromEntries(ROW_IDS.map((id) => [id, t(`poc.pmr_vals.${id}`)])),
    },
  ];

  return (
    <section id="poc-compare" className="band-plain section">
      <div className="shell">
        <SectionHead align="center" title={t("poc.vs_title")} sub={t("poc.vs_sub")} />
        <motion.div {...fadeUpAt(1)}>
          <CompareTable
            columns={columns}
            rows={rows}
            caption={t("poc.vs_title")}
            rowHeaderLabel={t("px.spec_column")}
          />
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Network design — the five steps as a shelf ──────────── */
/**
 * Five steps do not divide into a three-column grid, and the earlier attempts
 * both showed it: first as a grid with an empty cell in the second row, then as
 * a list, which turned a five-beat sequence into a wall of rules.
 *
 * A shelf is what apple.com uses when the count does not fit the grid — the
 * cards run off the right edge and scroll, so the layout never has to resolve
 * into rows at all. Each card carries its step number as a large ghost numeral
 * behind the copy, which is the sequence made visible rather than stated.
 *
 * It uses `HighlightsShelf` now rather than a hand-rolled `overflow-x-auto`:
 * that component already owns the arrows, the scroll-position sync, the
 * focusable region and the accessible name this row was reimplementing.
 */
function NetworkDesign() {
  const { t } = useTranslation();
  const steps = (t("poc.design.steps", { returnObjects: true }) as string[]) || [];
  const icons = [MapPin, Layers, Radio, Check, Coins];

  return (
    <Section band="soft">
      <SectionHead align="left" eyebrow={t("poc.design.kicker")} title={t("poc.design.title")} />
      <HighlightsShelf label={t("poc.design.title")}>
        {steps.map((step, i) => {
          const Icon = icons[i] ?? Check;
          return (
            <article
              key={step}
              className="card-interactive group relative flex min-h-[360px] w-[78vw] shrink-0 snap-start flex-col overflow-hidden rounded-[28px] bg-pitch p-8 sm:w-[46vw] lg:w-[calc((100%-3rem)/4)]"
            >
              {/* The step number, at a scale you read as position, not as text. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-8 -right-3 select-none text-[150px] font-semibold leading-none tracking-[-0.05em] text-crisp/[0.05] transition-colors duration-500 group-hover:text-signal/[0.09]"
              >
                {i + 1}
              </span>

              <Icon
                className="relative h-9 w-9 text-signal transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                strokeWidth={1.5}
                aria-hidden
              />

              <div className="relative mt-auto">
                <div className="text-[13px] font-medium uppercase tracking-[0.16em] text-cool">
                  {t("poc.design.step_label", {
                    defaultValue: String(i + 1).padStart(2, "0"),
                    n: i + 1,
                  })}
                </div>
                <h3 className="type-title mt-2 hyphens-auto break-words text-crisp">{step}</h3>
              </div>
            </article>
          );
        })}
      </HighlightsShelf>
    </Section>
  );
}

/* ─── Rental — product on a stage, copy alongside ─────────── */
/**
 * The image here used to be rendered with `mix-blend-multiply` inside a
 * `bg-pitch` card — and `--pitch` is white, despite the name. Multiply removes
 * white and keeps black, so a dark-background source came through as a hard
 * black rectangle sitting in a white box.
 *
 * It is a cutout now, so there is no sweep to knock out and no blend at all —
 * see the note on `ProductShot`'s `cutout` prop for why blending one is worse
 * than leaving it alone.
 */
function Rental() {
  const { t } = useTranslation();
  return (
    <Section band="plain">
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-16">
        <motion.div {...fadeUpAt(0)} className="order-2 md:order-1">
          <div className="text-[13px] font-medium uppercase tracking-[0.16em] text-signal">
            {t("poc.rental.kicker")}
          </div>
          <h2 className="type-headline mt-3 text-crisp">{t("poc.rental.title")}</h2>
          <p className="subhead measure mt-5 text-[17px]">{brandCase(t("poc.rental.desc"))}</p>
          <button
            onClick={() => openLead({ title: t("poc.rental.cta") })}
            className="pill pill-accent mt-8"
          >
            {t("poc.rental.cta")}
          </button>
        </motion.div>

        <motion.div {...fadeUpAt(1)} className="order-1 md:order-2" data-parallax="0.08">
          <ProductShot
            src={radioInHand}
            srcSmall={radioInHand800}
            cutout
            alt={t("poc.rental.title")}
            width={1042}
            height={1600}
            sizes="(max-width: 768px) 84vw, 520px"
            className="mx-auto w-full max-w-[440px]"
            imgClassName="max-h-[460px]"
          />
        </motion.div>
      </div>
    </Section>
  );
}
