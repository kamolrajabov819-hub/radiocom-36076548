import { notFound, useParams } from "@tanstack/react-router";
import { LocaleLink } from "@/components/LocaleLink";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  ChevronRight,
  Plus,
  Minus,
  FileDown,
  Check,
  Quote,
  Radio,
  Repeat,
  Wrench,
} from "lucide-react";
import { INDUSTRY_SLUGS, industryPicks, type IndustrySlug } from "@/data/industries";
import { products, formatPrice } from "@/data/products";
import { openLead } from "@/components/LeadFormSheet";
import { CountUp } from "@/components/CountUp";
import catalogAsset from "@/assets/radiocom-catalog.pdf.asset.json";
import horecaImg from "@/assets/industry-horeca.jpg";
import constructionImg from "@/assets/industry-construction.jpg";
import securityImg from "@/assets/industry-security.jpg";
import miningImg from "@/assets/industry-mining.jpg";
import transportImg from "@/assets/industry-transport.jpg";
import manufacturingImg from "@/assets/industry-manufacturing.jpg";
import { spring } from "@/lib/springs";
import { assetUrl } from "@/lib/asset";
import {
  absolute,
  breadcrumbSchema,
  faqSchema,
  jsonLd,
  localeLinks,
  type SeoLang,
} from "@/lib/seo";
import ruCopy from "@/i18n/ru.json";

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
    // head() runs outside React, so the Russian copy is read straight from the
    // bundle. That is also the correct language here: the SSR pass renders `ru`,
    // so Russian is the only variant crawlers ever see, and JSON-LD has to match
    // the visible text.
    const copy = ruCopy.industries[slug];
    const name = copy?.name ?? slug;
    const title = `Рации для ${name.toLowerCase()} — подбор и внедрение | Radiocom`;
    const description = copy?.desc ?? `Решения радиосвязи для ${name} в Узбекистане.`;
    const path = `/industries/${slug}`;
    const faq = (copy?.faq ?? []) as { q: string; a: string }[];

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: absolute(path) },
        { property: "og:locale", content: "ru_RU" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: localeLinks(params.lang, path),
      scripts: [
        ...(faq.length ? [jsonLd(faqSchema(faq))] : []),
        jsonLd(
          breadcrumbSchema([
            { name: "Radiocom", path: "/" },
            { name: "Отрасли", path: "/industries" },
            { name, path },
          ]),
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
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products;

  const outcomes = (t(`industries.${s}.outcomes`, { returnObjects: true }) as Outcome[]) || [];
  const faq = (t(`industries.${s}.faq`, { returnObjects: true }) as FAQ[]) || [];
  const industryName = t(`industries.${s}.name`);

  return (
    <div className="page-anim">
      {/* Cinematic hero */}

      <section className="relative min-h-[85vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.08, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img src={IMAGES[s]} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
        </motion.div>
        <div className="relative pt-40 md:pt-56 pb-24 px-6 max-w-[1200px] mx-auto text-white">
          <LocaleLink to="/industries" className="text-white/70 text-[13px] hover:text-white">
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
            className="mt-6 max-w-xl text-lg md:text-xl text-white/80"
          >
            {t(`industries.${s}.desc`)}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.4 }}
            className="mt-8 flex flex-col sm:flex-row gap-3"
          >
            <button
              onClick={() => openLead({ title: `${t("industries.cta")} · ${industryName}` })}
              className="pill"
              style={{ background: "#fff", color: "#000" }}
            >
              {t("industries.cta")}
            </button>
            <a
              href={assetUrl(catalogAsset)}
              download="radiocom-catalog.pdf"
              className="pill pill-ghost text-white"
              style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
            >
              <FileDown className="w-4 h-4" /> {t("industries.cta_secondary")}
            </a>
          </motion.div>
        </div>
      </section>

      {/* Problem / Solution — sticky-story pattern */}
      <section className="bg-pitch section px-6 md:px-10">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <StoryCard
            kicker={t("industries.problem_title")}
            body={t(`industries.${s}.problem`)}
            tone="light"
          />
          <StoryCard
            kicker={t("industries.solution_title")}
            body={t(`industries.${s}.solution`)}
            tone="accent"
          />
        </div>
      </section>

      {/* What you get — 3 offers */}
      <section className="bg-charcoal section px-6 md:px-10">
        <div className="max-w-[1200px] mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={spring}
            className="headline text-crisp text-4xl md:text-6xl"
          >
            {t("industries.offers.title")}
          </motion.h2>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            {(
              [
                { k: "test", Icon: Radio },
                { k: "tradein", Icon: Repeat },
                { k: "service", Icon: Wrench },
              ] as const
            ).map((o, i) => (
              <motion.div
                key={o.k}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ ...spring, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="group bento-card p-10 text-left relative overflow-hidden"
                style={{ background: "var(--pitch)" }}
              >
                <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(70%_60%_at_50%_0%,color-mix(in_oklab,var(--signal)_16%,transparent),transparent_70%)]" />
                <motion.span
                  initial={{ scale: 0.6, opacity: 0, rotate: -12 }}
                  whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...spring, delay: 0.15 + i * 0.1 }}
                  className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-signal/10 text-signal"
                >
                  <o.Icon className="h-6 w-6" />
                </motion.span>
                <div className="relative headline text-crisp text-2xl mt-6 leading-tight">
                  {t(`industries.offers.${o.k}.t`)}
                </div>
                <p className="relative subhead text-[15px] mt-3">
                  {t(`industries.offers.${o.k}.d`)}
                </p>
                <button
                  onClick={() => openLead({ title: t(`industries.offers.${o.k}.t`) })}
                  className="relative pill-link mt-6"
                >
                  {t(`industries.offers.${o.k}.c`)} <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended */}
      <section className="bg-pitch section px-6 md:px-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <h2 className="headline text-crisp text-4xl md:text-5xl">
              {t("industries.recommended")}
            </h2>
            <LocaleLink to="/catalog" className="pill-link">
              {t("industries.compare_all")}
            </LocaleLink>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 items-stretch">
            {picks.slice(0, 6).map((p, i) => (
              <motion.button
                key={p.id}
                onClick={() => openLead({ product: p.name })}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ ...spring, delay: (i % 3) * 0.06 }}
                className="bento-card p-6 md:p-8 text-left group flex flex-col h-full min-h-[340px] hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="aspect-square flex items-center justify-center mb-6 bg-pitch rounded-2xl overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="max-h-[85%] max-w-[85%] object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="text-[12px] text-cool uppercase tracking-wide">{p.brand}</div>
                <h3 className="text-[15px] font-semibold text-crisp mt-1 leading-tight flex-1">
                  {p.name}
                </h3>
                <div className="text-[13px] text-cool mt-1">{formatPrice(p.price, lang)}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-charcoal py-24 md:py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Quote className="w-10 h-10 text-signal mx-auto mb-6" strokeWidth={1.5} />
          <p className="headline text-crisp text-2xl md:text-4xl leading-[1.2]">
            {t(`industries.${s}.quote`)}
          </p>
          <div className="mt-6 text-cool text-[13px]">— {t(`industries.${s}.quote_author`)}</div>
        </div>
      </section>

      {/* FAQ */}
      {faq.length > 0 && (
        <section className="bg-pitch section px-6 md:px-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="headline text-crisp text-4xl md:text-5xl text-center mb-12">
              {t("industries.faq_title")}
            </h2>
            <div className="rounded-3xl bg-charcoal overflow-hidden">
              {faq.map((f, i) => (
                <FaqRow key={i} q={f.q} a={f.a} first={i === 0} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="bg-black text-white py-24 md:py-40 px-6 text-center">
        <h2
          className="headline text-white mx-auto max-w-3xl"
          style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
        >
          {t("industries.cta")}.
        </h2>
        <p className="mt-4 text-lg text-white/60 max-w-xl mx-auto">{t("form.trust_line")}</p>
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => openLead({ title: `${t("industries.cta")} · ${industryName}` })}
            className="pill"
            style={{ background: "#fff", color: "#000" }}
          >
            {t("industries.cta")}
          </button>
          <LocaleLink
            to="/catalog"
            className="text-signal text-[15px] inline-flex items-center gap-1"
          >
            {t("industries.compare_all")} <ChevronRight className="w-4 h-4" />
          </LocaleLink>
        </div>
      </section>
    </div>
  );
}

function StoryCard({
  kicker,
  body,
  tone,
}: {
  kicker: string;
  body: string;
  tone: "light" | "accent";
}) {
  const isAccent = tone === "accent";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={spring}
      className="rounded-3xl p-8 md:p-12"
      style={{
        background: isAccent ? "var(--signal)" : "var(--charcoal)",
        color: isAccent ? "#fff" : "var(--crisp)",
      }}
    >
      <div className={`text-[13px] mb-4 ${isAccent ? "text-white/70" : "text-cool"}`}>{kicker}</div>
      <p className="headline text-2xl md:text-3xl leading-[1.2]">{body}</p>
      {isAccent && <Check className="w-6 h-6 mt-6 opacity-80" />}
    </motion.div>
  );
}

function OutcomeNumber({ value }: { value: string }) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (match) {
    const n = parseFloat(match[1]);
    const suffix = match[2];
    if (n < 10000 && Number.isFinite(n)) {
      return (
        <div
          className="text-crisp font-semibold tracking-tight"
          style={{ fontSize: "clamp(3rem, 7vw, 5rem)", lineHeight: 1 }}
        >
          <CountUp to={n} />
          {suffix}
        </div>
      );
    }
  }
  return (
    <div
      className="text-crisp font-semibold tracking-tight"
      style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", lineHeight: 1 }}
    >
      {value}
    </div>
  );
}

function FaqRow({ q, a, first }: { q: string; a: string; first: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={first ? "" : "border-t border-border"}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-6 px-6 md:px-8 py-6 text-left"
      >
        <span className="text-[16px] md:text-lg font-medium text-crisp">{q}</span>
        <span className="shrink-0 h-8 w-8 rounded-full bg-pitch flex items-center justify-center text-crisp">
          {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <p className="px-6 md:px-8 pb-6 text-[15px] text-cool leading-relaxed">{a}</p>
      </motion.div>
    </div>
  );
}
