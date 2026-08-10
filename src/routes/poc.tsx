import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Check, X, Wifi, Radio, MapPin, MessagesSquare, Layers, Coins } from "lucide-react";
import rcd60 from "@/assets/catalog/rcd-60.jpg.asset.json";
import rcd70 from "@/assets/catalog/rcd-70.jpg.asset.json";
import { openLead } from "@/components/LeadFormSheet";
import { spring } from "@/lib/springs";


export const Route = createFileRoute("/poc")({
  head: () => ({
    meta: [
      { title: "PoC Systems & Network Design — Push-to-Talk over Cellular | Radiocom" },
      { name: "description", content: "Push-to-Talk over Cellular systems, PMR comparison, network design and radio rental across Uzbekistan." },
      { property: "og:title", content: "PoC · Global range, zero repeaters" },
      { property: "og:description", content: "Instant group communication over LTE and WiFi with GPS and multimedia." },
    ],
  }),
  component: PoCPage,
});

function PoCPage() {
  return (
    <div className="page-anim">
      <PocHero />
      <Compare />
      <NetworkDesign />
      <Rental />
    </div>
  );
}


function PocHero() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const deviceY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -60]);
  const deviceScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.05]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-background pt-28 pb-20 md:pt-40 md:pb-28"
    >
      <div className="relative mx-auto max-w-[1100px] px-6 text-center md:px-10">
        <motion.span
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-popover px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] text-signal"
        >
          <Wifi className="h-3.5 w-3.5" />
          {t("poc.kicker")}
        </motion.span>

        <h1 className="headline mt-6 text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.02] tracking-tight text-crisp">
          {[t("poc.title_a"), t("poc.title_b")].map((line, li) => (
            <span key={li} className="block overflow-hidden">
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
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.26 }}
          className="subhead mx-auto mt-5 max-w-2xl text-lg md:text-xl"
        >
          {t("poc.sub")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.34 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <button onClick={() => openLead({ title: t("poc.kicker") })} className="pill pill-accent">
            {t("poc.cta_primary")}
          </button>
          <a href="#poc-compare" className="pill-link">
            {t("poc.cta_secondary")}
          </a>
        </motion.div>

        {/* Product stage */}
        <motion.div
          style={{ y: deviceY, scale: deviceScale }}
          className="relative mx-auto mt-12 flex h-[42vh] min-h-[300px] max-w-[820px] items-center justify-center md:mt-16 md:h-[54vh] md:max-h-[560px]"
        >
          {!reduced &&
            [0, 1, 2].map((i) => (
              <motion.span
                key={i}
                aria-hidden
                className="absolute rounded-full border border-signal/15"
                style={{ width: "min(78vw, 520px)", height: "min(78vw, 520px)" }}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: [0.4, 1.15], opacity: [0.4, 0] }}
                transition={{ duration: 7, repeat: Infinity, delay: i * 2.3, ease: "easeOut" }}
              />
            ))}
          <motion.img
            src={rcd60.url}
            alt="Radiocom RCD-60 PoC push-to-talk radio"
            loading="eager"
            animate={reduced ? undefined : { y: [0, -12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="relative h-full w-auto max-w-none object-contain mix-blend-multiply drop-shadow-[0_40px_50px_rgba(0,0,0,0.14)]"
          />
          <span aria-hidden className="absolute bottom-[8%] h-5 w-[38%] rounded-[50%] bg-black/10 blur-2xl" />
        </motion.div>

        {/* Proof chips */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {[
            { Icon: Wifi, label: "LTE + WiFi" },
            { Icon: MapPin, label: "GPS" },
            { Icon: MessagesSquare, label: t("poc.poc_vals.media") },
          ].map((c, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring, delay: i * 0.07 }}
              className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-popover px-4 py-2 text-[13px] text-crisp/80"
            >
              <c.Icon className="h-3.5 w-3.5 shrink-0 text-signal" />
              <span className="truncate">{c.label}</span>
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}




/* PoC vs PMR — dual card comparison, no table */
function Compare() {
  const { t } = useTranslation();

  const pocPoints = [
    { Icon: Wifi, label: t("poc.poc_vals.coverage") },
    { Icon: Layers, label: t("poc.poc_vals.infra") },
    { Icon: MessagesSquare, label: t("poc.poc_vals.media") },
    { Icon: MapPin, label: t("poc.poc_vals.gps") },
  ];
  const pmrPoints = [
    { Icon: Radio, label: t("poc.pmr_vals.coverage") },
    { Icon: Layers, label: t("poc.pmr_vals.infra") },
    { Icon: MessagesSquare, label: t("poc.pmr_vals.media") },
    { Icon: Coins, label: t("poc.pmr_vals.cost") },
  ];

  return (
    <section id="poc-compare" className="bg-charcoal section px-6 md:px-10 scroll-mt-24">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={spring}
          className="text-center mb-14"
        >
          <h2 className="headline text-crisp text-4xl md:text-6xl">{t("poc.vs_title")}</h2>
          <p className="subhead mt-4 text-lg max-w-2xl mx-auto">{t("poc.vs_sub")}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CompareCard
            kind="poc"
            title="PoC"
            headline={t("poc.compare.poc.title")}
            points={pocPoints}
          />
          <CompareCard
            kind="pmr"
            title="PMR / DMR"
            headline={t("poc.compare.pmr.title")}
            points={pmrPoints}
          />
        </div>
      </div>
    </section>
  );
}

function CompareCard({
  kind, title, headline, points,
}: {
  kind: "poc" | "pmr";
  title: string;
  headline: string;
  points: { Icon: React.ComponentType<{ className?: string }>; label: string }[];
}) {
  const accent = kind === "poc";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={spring}
      whileHover={{ y: -4 }}
      className={`flex h-full flex-col rounded-[28px] border p-8 md:p-12 ${
        accent
          ? "border-signal/25 bg-popover shadow-[0_30px_70px_-40px_rgba(227,6,19,0.45)]"
          : "border-border bg-background"
      }`}
    >
      <div className={`mb-3 text-[13px] ${accent ? "text-signal" : "text-cool"}`}>{title}</div>
      <h3 className="headline text-3xl text-crisp md:text-4xl">{headline}</h3>
      <ul className="mt-8 space-y-4">
        {points.map((p, i) => (
          <li key={i} className="flex items-start gap-4">
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                accent ? "bg-signal text-white" : "bg-charcoal text-cool"
              }`}
            >
              {accent ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[15px] text-crisp">{p.label}</div>
            </div>
            <p.Icon className={`mt-2 h-5 w-5 shrink-0 ${accent ? "text-signal/70" : "text-cool"}`} />
          </li>
        ))}
      </ul>
    </motion.div>
  );
}


function NetworkDesign() {
  const { t } = useTranslation();
  const steps = t("poc.design.steps", { returnObjects: true }) as string[];
  return (
    <section className="bg-pitch section px-6 md:px-10">
      <div className="max-w-[1200px] mx-auto text-center">
        <div className="text-signal text-[13px] mb-4">{t("poc.design.kicker")}</div>
        <h2 className="headline text-crisp text-4xl md:text-6xl max-w-3xl mx-auto">
          {t("poc.design.title")}
        </h2>
        <ol className="mt-14 grid grid-cols-1 md:grid-cols-5 gap-3 text-left">
          {steps.map((s, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ ...spring, delay: i * 0.06 }}
              className="bento-card p-6"
            >
              <div className="text-signal text-[13px]">0{i + 1}</div>
              <div className="text-crisp text-[15px] mt-3 leading-snug">{s}</div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Rental() {
  const { t } = useTranslation();
  return (
    <section className="bg-black px-6 py-24 text-white md:py-40">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-12 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={spring}
          className="order-2 min-w-0 text-center md:order-1 md:text-left"
        >
          <div className="mb-4 text-[13px] text-signal">{t("poc.rental.kicker")}</div>
          <h2 className="headline text-white" style={{ fontSize: "clamp(2rem, 5vw, 3.75rem)" }}>
            {t("poc.rental.title")}
          </h2>
          <p className="mt-5 text-lg text-white/60 md:text-xl">{t("poc.rental.desc")}</p>
          <div className="mt-8">
            <button
              onClick={() => openLead({ title: t("poc.rental.cta") })}
              className="pill"
              style={{ background: "#fff", color: "#000" }}
            >
              {t("poc.rental.cta")}
            </button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={spring}
          className="order-1 flex items-center justify-center md:order-2"
        >
          <div className="w-full max-w-[420px] overflow-hidden rounded-[28px] bg-white p-6">
            <img
              src={rcd70.url}
              alt="Radiocom RCD-70 radio available for rent"
              loading="lazy"
              className="mx-auto h-[240px] w-auto object-contain md:h-[320px]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

