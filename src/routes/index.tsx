import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ChevronRight, Repeat, ShieldCheck, Truck, Wrench, Package, Sparkles, MessageCircle } from "lucide-react";
import { SignalPulse } from "@/components/SignalPulse";
import heroCutout from "@/assets/hero-rcd60-cutout.png";

import bentoNetLight from "@/assets/bento-network-light.jpg";
import horecaImg from "@/assets/industry-horeca.jpg";
import constructionImg from "@/assets/industry-construction.jpg";
import securityImg from "@/assets/industry-security.jpg";
import { openLead } from "@/components/LeadFormSheet";
import { BrandsStrip } from "@/components/BrandsStrip";
import { Section, SectionHead } from "@/components/Section";
import { SpotlightCard } from "@/components/SpotlightCard";
import { Magnetic } from "@/components/Magnetic";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { spring } from "@/lib/springs";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Radiocom — Professional Radio Systems in Uzbekistan" },
      { name: "description", content: "Pro communication. Unbreakable. 11 years, 10,000+ clients. Motorola, Hytera, PoC — authorized service and free testing across Uzbekistan." },
      { property: "og:title", content: "Radiocom — Pro Communication. Unbreakable." },
      { property: "og:description", content: "Motorola, Hytera and PoC radios with authorized service, free testing and nationwide delivery." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="page-anim">
      <Hero />
      <FeatureDark />
      <Bento />
      <IndustriesTeaser />
      <FeaturedCatalog />
      <BrandsStrip />
      <FinalCta />
    </div>
  );
}

/* ─── Hero — split headline reveal + scale-scroll art ───── */
function Hero() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const title = t("home.hero.title");
  const words = title.split(" ");

  return (
    <section ref={ref} className="pt-28 md:pt-32 pb-0 bg-pitch overflow-hidden relative">
      {/* Signature signal-pulse motif behind hero */}
      <div className="absolute inset-x-0 top-0 h-[120vh] pointer-events-none">
        <SignalPulse size={1400} opacity={0.28} />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.05 }}
          className="eyebrow-sweep text-[13px] tracking-wide font-medium mb-5"
        >
          {t("home.hero.eyebrow", { defaultValue: "Radiocom · Uzbekistan" })}
        </motion.div>
        <h1 className="headline-hero text-crisp">
          {words.map((w, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.1 + i * 0.04 }}
              className="inline-block mr-[0.25em]"
            >
              {w}
            </motion.span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.35 }}
          className="subhead mt-6 text-lg md:text-2xl max-w-3xl mx-auto"
        >
          {t("home.hero.sub")}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.45 }}
          className="mt-9 flex items-center justify-center gap-3 md:gap-4 flex-wrap"
        >
          <Magnetic>
            <button onClick={() => openLead({ title: t("home.hero.cta_primary") })} className="pill pill-accent">
              {t("home.hero.cta_primary")}
            </button>
          </Magnetic>
          <Link to="/catalog" className="pill-link">
            {t("home.hero.cta_secondary")} <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      <motion.div
        style={{ scale, opacity, y }}
        className="mt-4 md:mt-6 relative w-full h-[52vh] md:h-[72vh] max-h-[720px]"
      >
        <div className="hero-glow" />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src={heroCutout}
            alt="Radiocom RCD-60 professional two-way radio"
            loading="eager"
            width={1194}
            height={1506}
            className="h-full w-auto max-w-[92vw] object-contain drop-shadow-[0_50px_60px_rgba(0,0,0,0.25)]"
          />
        </motion.div>
        {/* soft contact shadow */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 h-10 w-[46%] rounded-[100%] bg-black/12 blur-2xl" />
      </motion.div>


    </section>
  );
}

/* ─── Dark feature strip ─────────────────────────────────── */
function FeatureDark() {
  const { t } = useTranslation();
  return (
    <section className="bg-black text-white py-28 md:py-40 text-center px-6 md:px-10 overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={spring}
          className="headline text-white mx-auto max-w-4xl"
          style={{ fontSize: "clamp(2.25rem, 6vw, 4.5rem)" }}
        >
          {t("home.feature.title")}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ ...spring, delay: 0.1 }}
          className="mt-5 text-lg md:text-xl text-white/60 max-w-2xl mx-auto"
        >
          {t("home.feature.sub")}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ ...spring, delay: 0.15 }}
          className="mt-9 flex items-center justify-center gap-6 flex-wrap"
        >
          <Magnetic>
            <Link to="/catalog" className="pill" style={{ background: "#fff", color: "#000" }}>
              {t("home.hero.cta_secondary")}
            </Link>
          </Magnetic>
          <Link to="/poc" className="text-signal text-[15px] inline-flex items-center gap-1">
            {t("home.feature.link")} <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Bento grid — symmetric 4-col ─────────────────────── */
function Bento() {
  const { t } = useTranslation();
  const items: { key: string; Icon: typeof Repeat }[] = [
    { key: "tradein", Icon: Repeat },
    { key: "warranty", Icon: ShieldCheck },
    { key: "delivery", Icon: Truck },
    { key: "test", Icon: Sparkles },
    { key: "models", Icon: Package },
    { key: "service", Icon: Wrench },
  ];

  return (
    <Section className="bg-pitch">
      <SectionHead
        eyebrow={t("home.bento.eyebrow", { defaultValue: "Why Radiocom" })}
        title={t("home.bento.title")}
        sub={t("home.bento.sub")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 items-stretch">
        {items.map((it, i) => (
          <motion.div
            key={it.key}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ ...spring, delay: i * 0.06 }}
            className="h-full"
          >
            <SpotlightCard className="h-full p-8 md:p-10 flex flex-col text-left min-h-[280px]">
              <it.Icon className="w-7 h-7 text-signal mb-6" strokeWidth={1.75} />
              <h3 className="headline text-crisp text-xl md:text-2xl">
                {t(`home.bento.${it.key}.title`)}
              </h3>
              <p className="subhead text-[15px] mt-3 flex-1">
                {t(`home.bento.${it.key}.sub`)}
              </p>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>

      {/* Network topology visual — separate symmetric split scene */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={spring}
          className="bento-card aspect-[4/3] md:aspect-auto md:min-h-[420px] relative"
        >
          <img
            src={bentoNetLight}
            alt=""
            loading="lazy"
            width={1400}
            height={1400}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ ...spring, delay: 0.08 }}
          className="bento-card p-10 md:p-14 flex flex-col justify-center relative overflow-hidden"
        >
          <SignalPulse size={700} opacity={0.15} className="!items-end !justify-end" />
          <div className="eyebrow-sweep text-[13px] tracking-wide font-medium mb-4 relative">
            {t("home.bento.network.eyebrow", { defaultValue: "Network Design" })}
          </div>
          <h3 className="headline text-crisp text-3xl md:text-5xl relative">
            {t("home.bento.network.title", { defaultValue: "One system. Every site." })}
          </h3>
          <p className="subhead mt-5 text-[15px] md:text-base max-w-md relative">
            {t("home.bento.network.sub", { defaultValue: "Custom radio network design with repeaters, dispatch and PoC — engineered end-to-end." })}
          </p>
          <Link to="/poc" className="pill-link mt-6 relative">
            {t("home.feature.link")} <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </Section>
  );
}

/* ─── Industries teaser ─────────────────────────────────── */
function IndustriesTeaser() {
  const { t } = useTranslation();
  const items = [
    { slug: "horeca" as const, img: horecaImg },
    { slug: "construction" as const, img: constructionImg },
    { slug: "security" as const, img: securityImg },
  ];
  return (
    <Section className="bg-charcoal">
      <SectionHead
        eyebrow={t("industries.eyebrow", { defaultValue: "Industries" })}
        title={t("industries.title")}
        sub={t("industries.overview_sub")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 items-stretch">
        {items.map((it, i) => (
          <motion.div
            key={it.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ ...spring, delay: i * 0.08 }}
            className="group bg-pitch rounded-3xl overflow-hidden flex flex-col h-full shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.12)] hover:-translate-y-1 hover:shadow-[0_1px_2px_rgba(0,0,0,0.06),0_20px_40px_-16px_rgba(0,0,0,0.2)] transition-all duration-300"
          >
            <Link
              to="/industries/$slug"
              params={{ slug: it.slug }}
              className="block aspect-[4/3] overflow-hidden"
            >
              <img src={it.img} alt={t(`industries.${it.slug}.name`)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[900ms]" loading="lazy" />
            </Link>
            <div className="p-6 md:p-7 flex flex-col flex-1">
              <h3 className="headline text-2xl text-crisp">{t(`industries.${it.slug}.name`)}</h3>
              <p className="subhead text-[15px] mt-2 flex-1">{t(`industries.${it.slug}.desc`)}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => openLead({ title: `${t("industries.cta")} · ${t(`industries.${it.slug}.name`)}` })}
                  className="pill pill-sm pill-accent"
                >
                  {t("industries.cta")}
                </button>
                <Link to="/industries/$slug" params={{ slug: it.slug }} className="pill-link text-[13px]">
                  {t("industries.compare_all", { defaultValue: "See radios" })} <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Closing capture-contact banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={spring}
        className="mt-8 md:mt-10 rounded-3xl bg-pitch p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden"
      >
        <SignalPulse size={600} opacity={0.12} className="!items-start !justify-start" />
        <div className="relative">
          <h3 className="headline text-crisp text-2xl md:text-4xl max-w-xl">
            {t("industries.banner_title", { defaultValue: "Not sure which radio fits your operation?" })}
          </h3>
          <p className="subhead mt-3 text-[15px] max-w-xl">
            {t("industries.banner_sub", { defaultValue: "Tell us your industry — we'll recommend the right system within 15 minutes." })}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 relative">
          <Magnetic>
            <button
              onClick={() => openLead({ title: t("industries.cta") })}
              className="pill pill-accent"
            >
              {t("industries.cta")}
            </button>
          </Magnetic>
          <a
            href="https://t.me/radiocom_uz"
            target="_blank"
            rel="noopener"
            className="pill pill-ghost inline-flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" /> Telegram
          </a>
        </div>
      </motion.div>

      <div className="mt-10 text-center">
        <Link to="/industries" className="pill-link">
          {t("industries.view_all")} <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </Section>
  );
}

/* ─── Featured catalog ──────────────────────────────────── */
function FeaturedCatalog() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language.slice(0, 2) as "ru" | "en" | "uz") || "ru";
  const picked = ["rcd-60", "rcd-70", "m-t82-extreme", "m-xt420"]
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products;
  const featured = picked.length >= 4 ? picked.slice(0, 4) : products.slice(0, 4);


  return (
    <Section className="bg-charcoal">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
        <div>
          <div className="eyebrow-sweep text-[13px] tracking-wide font-medium mb-3">
            {t("home.featured.eyebrow", { defaultValue: "Best sellers" })}
          </div>
          <h2 className="headline text-crisp text-4xl md:text-5xl">{t("home.featured.title")}</h2>
        </div>
        <Link to="/catalog" className="pill-link">
          {t("home.featured.link")} <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 items-stretch">
        {featured.map((p, i) => (
          <ProductCard key={p.id} p={p} lang={lang} idx={i} onOpen={() => openLead({ product: p.name })} />
        ))}
      </div>
    </Section>
  );
}

/* ─── Final CTA ────────────────────────────────────────── */
function FinalCta() {
  const { t } = useTranslation();
  return (
    <section className="bg-black text-white py-28 md:py-40 px-6 md:px-10 text-center">
      <div className="max-w-[1200px] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={spring}
          className="headline text-white mx-auto max-w-3xl"
          style={{ fontSize: "clamp(2.25rem, 6vw, 4.5rem)" }}
        >
          {t("home.final_cta.title")}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ ...spring, delay: 0.1 }}
          className="mt-4 text-lg text-white/60 max-w-2xl mx-auto"
        >
          {t("home.final_cta.sub")}
        </motion.p>
        <div className="mt-9 flex items-center justify-center gap-4 flex-wrap">
          <Magnetic>
            <button
              onClick={() => openLead({ title: t("home.final_cta.button") })}
              className="pill"
              style={{ background: "#fff", color: "#000" }}
            >
              {t("home.final_cta.button")}
            </button>
          </Magnetic>
          <Link to="/service" className="text-signal text-[15px] inline-flex items-center gap-1">
            {t("nav.service")} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
