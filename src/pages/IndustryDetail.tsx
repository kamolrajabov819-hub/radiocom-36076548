import { useParams } from "@tanstack/react-router";
import { useScrollChoreography } from "@/lib/motion";
import { LocaleLink } from "@/components/LocaleLink";
import { useTranslation } from "react-i18next";
import { brandCase } from "@/lib/brand";
import { motion } from "framer-motion";
import { ChevronRight, FileDown, Check, Quote, Radio, Repeat, Wrench } from "lucide-react";
import { industryPicks, type IndustrySlug } from "@/data/industries";
import {
  INDUSTRY_IMAGES as IMAGES,
  INDUSTRY_IMAGE_SRCSET as SRCSET,
  INDUSTRY_IMAGE_SRCSET_SMALL as SRCSET_SMALL,
} from "@/data/industry-images";
import { visibleProducts } from "@/data/products";
import { openLead } from "@/components/LeadFormSheet";
import { CountUp } from "@/components/CountUp";
import { ProductCard } from "@/components/ProductCard";
import { Section, SectionHead } from "@/components/Section";
import { Faq } from "@/components/Faq";
import { BentoGrid, FeatureCard } from "@/components/apple";
import { TrustedBy } from "@/components/TrustedBy";
// The client's own price list, dated 29.06.26. Replaces a CDN pointer to a
// catalogue PDF that only existed on radiocom.lovable.app.
import priceListPdf from "@/assets/radiocom-price-list.pdf";
import { fadeUpAt, spring } from "@/lib/springs";

type Outcome = { n: string; u: string; l: string };
type FAQ = { q: string; a: string };

export function IndustryPage() {
  const { slug } = useParams({ strict: false }) as { slug: string };
  const { t, i18n } = useTranslation();
  const lang = (i18n.language.slice(0, 2) as "ru" | "en" | "uz") || "ru";
  const s = slug as IndustrySlug;
  const picks = industryPicks[s]
    .map((id) => visibleProducts.find((p) => p.id === id))
    .filter(Boolean) as typeof visibleProducts;

  const outcomes = (t(`industries.${s}.outcomes`, { returnObjects: true }) as Outcome[]) || [];
  const pains = (t(`industries.${s}.pains`, { returnObjects: true }) as string[]) || [];
  const faq = (t(`industries.${s}.faq`, { returnObjects: true }) as FAQ[]) || [];
  const industryName = t(`industries.${s}.name`);

  const page = useScrollChoreography();

  return (
    <div ref={page} className="page-anim page-tight">
      {/* ── Cinematic hero ─────────────────────────────────── */}
      <section className="relative min-h-[78vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.08, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {/* `<picture>`, because on a phone the right answer is not the
              largest file the browser can justify.

              This frame is full-bleed and `scale-110`, so `sizes` is 110vw —
              429 CSS px on a 390px phone, 858 device pixels at DPR 2. That is
              past the 800w candidate, so a plain `<img>` correctly reaches for
              the 1400px master and spends 288 KB on it, on the LCP element of
              six pages.

              Narrowing `sizes` to force a smaller pick would be a lie about
              the layout. Art direction is the honest lever: below 768px the
              menu simply does not include the master, so the browser takes
              800w — 1.86x density across the slot, behind a gradient that runs
              from solid black to black/25. There is nothing there to resolve.
              Wide viewports, where the photograph is actually large and only
              lightly scrimmed at its foot, keep the full set. */}
          <picture>
            <source media="(max-width: 768px)" srcSet={SRCSET_SMALL[s]} sizes="110vw" />
            <img
              src={IMAGES[s]}
              srcSet={SRCSET[s]}
              sizes="110vw"
              alt=""
              width={1400}
              height={900}
              fetchPriority="high"
              decoding="sync"
              data-parallax="0.18"
              className="absolute inset-0 h-full w-full scale-110 object-cover"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/25" />
        </motion.div>

        <div className="shell relative pb-24 pt-40 text-white md:pt-56">
          <LocaleLink
            to="/industries"
            className="-ml-1 inline-flex min-h-11 items-center px-1 text-[13px] text-white/70 transition-colors hover:text-white"
          >
            ← {t("industries.view_all")}
          </LocaleLink>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.2 }}
            className="headline-hero mt-6"
          >
            {/* «Рации для строительства», not «Строительство.»
                
                The bare industry name told a visitor nothing they did not
                already know from clicking, and confirmed nothing for someone
                who arrived from a search for «рации для стройки» — the one
                moment the page has to say "yes, this is the thing you looked
                for". Each industry carries its own written-out h1 rather than a
                `для {{name}}` pattern, because Russian needs the genitive and
                Uzbek a postposition, and neither survives interpolation. */}
            {t(`industries.${s}.h1`)}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.3 }}
            className="mt-6 max-w-xl text-lg text-white/80 md:text-xl"
          >
            {t(`industries.${s}.desc`)}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.4 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <button
              onClick={() => openLead({ title: `${t("industries.cta")} · ${industryName}` })}
              className="pill pill-invert"
            >
              {t("industries.cta")}
            </button>
            <a
              href={priceListPdf}
              download="radiocom-price-list.pdf"
              className="pill bg-white/15 text-white backdrop-blur"
            >
              <FileDown className="h-4 w-4" aria-hidden /> {t("industries.cta_secondary")}
            </a>
          </motion.div>
        </div>
      </section>

      {/*
        ── Outcomes ──────────────────────────────────────────
        These stats are translated in all three locales and were being read into
        a variable that nothing rendered — the page threw away its own numbers.
        Apple opens a product page on the figures, so they open here.
      */}
      {outcomes.length > 0 && (
        <Section band="plain" tight>
          <div data-scrub-in>
            <SectionHead align="left" spacing="tight" title={t("industries.outcomes_title")} />
          </div>
          <dl className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-3">
            {outcomes.map((o, i) => (
              <motion.div key={o.l} {...fadeUpAt(i)}>
                <dt className="sr-only">{o.l}</dt>
                <dd>
                  <OutcomeNumber value={o.n} unit={o.u} />
                  <div className="mt-3 max-w-[16rem] text-[15px] leading-snug text-cool">{o.l}</div>
                </dd>
              </motion.div>
            ))}
          </dl>

          {/* The client line, where an industry has one.
              
              Only the mining page carries it today, and it is the strongest
              thing on that page: a buyer weighing radios for an oil and gas
              site trusts five names they recognise more than any spec row.
              Every industry carries the key, holding an empty string where
              there is nothing to say. That is what keeps `verify-i18n`'s
              dynamic-key check meaningful: it requires an interpolated `t()`
              key to resolve across the whole set it iterates, which is right —
              a key present on one industry and missing on five renders as raw
              text on the other five. Truthiness, not a key comparison. */}
          {t(`industries.${s}.clients`) && (
            <motion.p {...fadeUpAt(3)} className="mt-12 max-w-3xl text-[15px] text-cool">
              {t(`industries.${s}.clients`)}
            </motion.p>
          )}
        </Section>
      )}

      {/* ── Problem → solution ───────────────────────────────── */}
      <Section band="soft" tight>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <StoryCard
            kicker={t("industries.problem_title")}
            body={t(`industries.${s}.problem`)}
            tone="light"
          />
          <StoryCard
            kicker={t("industries.solution_title")}
            body={t(`industries.${s}.solution`)}
            tone="dark"
          />
        </div>

        {/*
          The pain list is the other block that was translated and never shown.
          It is the page's most searchable copy — the words a buyer would
          actually type — so it earns a place rather than staying in the JSON.
        */}
        {pains.length > 0 && (
          <div className="mt-4 rounded-[28px] bg-pitch p-7 md:p-10">
            <h3 className="type-title text-crisp">{t("industries.pains_title")}</h3>
            <ul className="mt-6 grid gap-4 md:grid-cols-3">
              {pains.map((pain, i) => (
                <motion.li key={pain} {...fadeUpAt(i)} className="flex items-start gap-3">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-signal" aria-hidden />
                  <span className="text-[15px] leading-snug text-crisp">{pain}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      {/*
        ── What we take care of ──────────────────────────────
        This and the outcomes section above both used to be titled «Что вы
        получите», one above the other on all six industry pages. Two sections
        with the same name is a reader's problem before it is a crawler's: it
        reads as the page having lost its place. They answer different questions
        and now say so — the one above is what the radios do, this one is what we
        do.
      */}
      <Section band="plain" tight>
        <div data-scrub-in>
          <SectionHead align="left" spacing="tight" title={t("industries.offers.title")} />
        </div>
        <BentoGrid>
          {(
            [
              { k: "test", Icon: Radio },
              { k: "tradein", Icon: Repeat },
              { k: "service", Icon: Wrench },
            ] as const
          ).map((o, i) => (
            <FeatureCard
              key={o.k}
              idx={i}
              tone={i === 1 ? "dark" : "light"}
              // No eyebrow: it held `.c`, the same string as the button below
              // it, so each card printed «Заказать тест» twice.
              title={t(`industries.offers.${o.k}.t`)}
              body={t(`industries.offers.${o.k}.d`)}
              className="min-h-[280px]"
              action={{
                label: t(`industries.offers.${o.k}.c`),
                onClick: () => openLead({ title: t(`industries.offers.${o.k}.t`) }),
              }}
              media={
                <o.Icon
                  className={`h-10 w-10 ${i === 1 ? "text-white" : "text-signal"}`}
                  strokeWidth={1.5}
                  aria-hidden
                />
              }
            />
          ))}
        </BentoGrid>
      </Section>

      {/* ── Recommended models ───────────────────────────────── */}
      <Section band="soft" tight>
        <div data-scrub-in>
          <SectionHead
            align="left"
            spacing="tight"
            title={t("industries.recommended")}
            link={{ label: t("industries.compare_all"), to: "/compare" }}
          />
        </div>
        {/* No `data-stagger` here — `ProductCard` is `motion.div`-rooted with its
            own `whileInView` fade keyed on `idx`, so it already staggers itself.
            A GSAP stagger on this grid would fight that same element's opacity
            every frame — the exact flicker `data-stagger`'s doc comment warns
            against. */}
        <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {picks.slice(0, 6).map((p, i) => (
            <ProductCard key={p.id} p={p} lang={lang} idx={i} />
          ))}
        </div>

        {/* The six picks are a shortlist, not the range. Without these the
            industry pages are a dead end in the link graph: they receive from
            the nav and from every product's "where it is used", and pass
            authority on only to the models they happen to recommend. */}
        <div className="mt-10 flex flex-wrap items-center gap-4 text-[14px]">
          <LocaleLink to="/radiocom" className="pill-link">
            {brandCase(t("brand.radiocom_title"))} <ChevronRight className="h-4 w-4" aria-hidden />
          </LocaleLink>
          <LocaleLink to="/motorola" className="pill-link">
            {t("brand.motorola_title")} <ChevronRight className="h-4 w-4" aria-hidden />
          </LocaleLink>
        </div>
      </Section>

      {/* ── Testimonial ──────────────────────────────────────── */}
      <Section band="plain" tight>
        <figure data-scrub-in className="mx-auto max-w-3xl text-center">
          <Quote className="mx-auto mb-6 h-9 w-9 text-signal" strokeWidth={1.5} aria-hidden />
          <div className="type-caption mb-6 uppercase tracking-[0.18em]">
            {t("industries.quote_kicker")}
          </div>
          <blockquote className="headline text-2xl leading-[1.2] text-crisp md:text-4xl">
            {t(`industries.${s}.quote`)}
          </blockquote>
          <figcaption className="mt-6 text-[13px] text-cool">
            — {t(`industries.${s}.quote_author`)}
          </figcaption>
        </figure>
      </Section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      {faq.length > 0 && (
        <Section band="soft" tight>
          <div className="mx-auto max-w-3xl">
            <div data-scrub-in>
              <SectionHead align="center" spacing="tight" title={t("industries.faq_title")} />
            </div>
            <Faq items={faq} />
          </div>
        </Section>
      )}

      {/* ── Closing CTA ──────────────────────────────────────── */}
      <Section band="dark" tight>
        <div data-scrub-in className="text-center">
          <h2
            className="headline mx-auto max-w-3xl text-white"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
          >
            {t("industries.banner_title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/60">
            {t("industries.banner_sub")}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => openLead({ title: `${t("industries.cta")} · ${industryName}` })}
              className="pill pill-invert"
            >
              {t("industries.cta")}
            </button>
            <LocaleLink to="/compare" className="pill-link">
              {t("industries.compare_all")} <ChevronRight className="h-4 w-4" aria-hidden />
            </LocaleLink>
          </div>
        </div>
      </Section>
      <TrustedBy />
    </div>
  );
}

/**
 * Problem and solution, side by side. The solution panel used to be a solid
 * `--signal` fill, which is the one thing Apple never does with a brand colour —
 * saturated red across a whole panel shouts over the copy on it and fails
 * contrast at body size. Black carries the same weight without either problem.
 */
function StoryCard({
  kicker,
  body,
  tone,
}: {
  kicker: string;
  body: string;
  tone: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <motion.div
      {...fadeUpAt(dark ? 1 : 0)}
      className={`card-interactive rounded-[28px] p-8 md:p-12 ${
        dark ? "is-dark bg-black text-[#f5f5f7]" : "bg-pitch text-crisp"
      }`}
    >
      <div className={`mb-4 text-[13px] ${dark ? "text-white/60" : "text-cool"}`}>{kicker}</div>
      <p className="headline text-2xl leading-[1.2] md:text-3xl">{body}</p>
      {dark && <Check className="mt-6 h-6 w-6 text-white" aria-hidden />}
    </motion.div>
  );
}

/** A stat: the figure animates, the unit stays put beside it. */
function OutcomeNumber({ value, unit }: { value: string; unit?: string }) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const numeric = match ? parseFloat(match[1]) : NaN;
  const canCount = Number.isFinite(numeric) && numeric < 10000;

  return (
    <div className="flex items-baseline gap-2">
      <span
        className="font-semibold tracking-tight text-crisp"
        style={{ fontSize: "clamp(3rem, 6vw, 4.5rem)", lineHeight: 1 }}
      >
        {canCount ? (
          <>
            <CountUp to={numeric} />
            {match![2]}
          </>
        ) : (
          value
        )}
      </span>
      {unit ? <span className="text-[15px] text-cool">{unit}</span> : null}
    </div>
  );
}
