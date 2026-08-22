import { notFound, useParams } from "@tanstack/react-router";
import { LocaleLink } from "@/components/LocaleLink";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronRight, FileDown, Check, Quote, Radio, Repeat, Wrench } from "lucide-react";
import { INDUSTRY_SLUGS, industryPicks, type IndustrySlug } from "@/data/industries";
import { visibleProducts } from "@/data/products";
import { openLead } from "@/components/LeadFormSheet";
import { CountUp } from "@/components/CountUp";
import { ProductCard } from "@/components/ProductCard";
import { Section, SectionHead } from "@/components/Section";
import { Faq } from "@/components/Faq";
import { BentoGrid, FeatureCard } from "@/components/apple";
// The client's own price list, dated 29.06.26. Replaces a CDN pointer to a
// catalogue PDF that only existed on radiocom.lovable.app.
import priceListPdf from "@/assets/radiocom-price-list.pdf";
import horecaImg from "@/assets/industry-horeca.jpg";
import constructionImg from "@/assets/industry-construction.jpg";
import securityImg from "@/assets/industry-security.jpg";
import miningImg from "@/assets/industry-mining.jpg";
import transportImg from "@/assets/industry-transport.jpg";
import manufacturingImg from "@/assets/industry-manufacturing.jpg";
import { fadeUpAt, spring } from "@/lib/springs";
import {
  SITE_NAME,
  breadcrumbSchema,
  faqSchema,
  jsonLd,
  localeLinks,
  pageMeta,
  type SeoLang,
} from "@/lib/seo";
import { tFor } from "@/lib/i18n";

const IMAGES: Record<string, string> = {
  horeca: horecaImg,
  construction: constructionImg,
  security: securityImg,
  mining: miningImg,
  transport: transportImg,
  manufacturing: manufacturingImg,
};

export const routeOptions = {
  beforeLoad: ({ params }: { params: { lang: string; slug: string } }) => {
    if (!INDUSTRY_SLUGS.includes(params.slug as IndustrySlug)) throw notFound();
  },
  head: ({ params }: { params: { slug: string; lang: SeoLang } }) => {
    const slug = params.slug as IndustrySlug;
    const t = tFor(params.lang);

    const name = t(`industries.${slug}.name`);
    // `.seo` is the industry as it reads inside a sentence: Russian needs the
    // genitive ("Рации для строительства", not "для строительство"), and the
    // display names carry "·" separators that do not belong in a page title.
    const inTitle = t(`industries.${slug}.seo`, { defaultValue: name });
    const title = t("meta.industry.title", { name: inTitle });
    const description =
      t(`industries.${slug}.desc`, { defaultValue: "" }) ||
      t("meta.industry.desc", { name: inTitle });
    const path = `/industries/${slug}`;

    // The FAQ pairs must be this locale's — schema that disagrees with the
    // rendered text counts as mismatched markup.
    const faq = (t(`industries.${slug}.faq`, { returnObjects: true, defaultValue: [] }) ?? []) as {
      q: string;
      a: string;
    }[];

    return {
      meta: pageMeta({
        lang: params.lang,
        title,
        description,
        path,
        type: "article",
      }),
      links: localeLinks(params.lang, path),
      scripts: [
        ...(Array.isArray(faq) && faq.length ? [jsonLd(faqSchema(faq, params.lang))] : []),
        jsonLd(
          breadcrumbSchema(
            [
              { name: SITE_NAME, path: "/" },
              { name: t("meta.crumb.industries"), path: "/industries" },
              { name, path },
            ],
            params.lang,
          ),
        ),
      ],
    };
  },
  component: IndustryPage,
};

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

  return (
    <div className="page-anim">
      {/* ── Cinematic hero ─────────────────────────────────── */}
      <section className="relative min-h-[78vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.08, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={IMAGES[s]}
            alt=""
            width={1600}
            height={1067}
            fetchPriority="high"
            decoding="sync"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/25" />
        </motion.div>

        <div className="shell relative pb-24 pt-40 text-white md:pt-56">
          <LocaleLink
            to="/industries"
            className="text-[13px] text-white/70 transition-colors hover:text-white"
          >
            ← {t("industries.view_all")}
          </LocaleLink>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.2 }}
            className="headline-hero mt-6"
          >
            {industryName}.
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
              className="pill bg-white text-black"
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
          <SectionHead align="left" spacing="tight" title={t("industries.outcomes_title")} />
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

      {/* ── What you get ─────────────────────────────────────── */}
      <Section band="plain" tight>
        <SectionHead align="left" spacing="tight" title={t("industries.offers.title")} />
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
              eyebrow={t(`industries.offers.${o.k}.c`)}
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
        <SectionHead
          align="left"
          spacing="tight"
          title={t("industries.recommended")}
          link={{ label: t("industries.compare_all"), to: "/compare" }}
        />
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
            {t("brand.radiocom_title")} <ChevronRight className="h-4 w-4" aria-hidden />
          </LocaleLink>
          <LocaleLink to="/motorola" className="pill-link">
            {t("brand.motorola_title")} <ChevronRight className="h-4 w-4" aria-hidden />
          </LocaleLink>
        </div>
      </Section>

      {/* ── Testimonial ──────────────────────────────────────── */}
      <Section band="plain" tight>
        <figure className="mx-auto max-w-3xl text-center">
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
            <SectionHead align="center" spacing="tight" title={t("industries.faq_title")} />
            <Faq items={faq} />
          </div>
        </Section>
      )}

      {/* ── Closing CTA ──────────────────────────────────────── */}
      <Section band="dark" tight>
        <div className="text-center">
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
              className="pill bg-white text-black"
            >
              {t("industries.cta")}
            </button>
            <LocaleLink to="/compare" className="pill-link">
              {t("industries.compare_all")} <ChevronRight className="h-4 w-4" aria-hidden />
            </LocaleLink>
          </div>
        </div>
      </Section>
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
