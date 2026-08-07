import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Check, X, Wifi, Radio, MapPin, MessagesSquare, Layers, Coins } from "lucide-react";
import pocDevice from "@/assets/poc-device-cutout.png";
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
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const deviceY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const deviceScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  return (
    <section
      ref={ref}
      className="relative pt-32 md:pt-44 pb-20 md:pb-28 bg-pitch overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8 items-center">
        {/* Copy */}
        <div className="text-center md:text-left order-2 md:order-1">
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
            className="inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/[0.07] px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] text-signal"
          >
            <Wifi className="w-3.5 h-3.5" />
            {t("poc.kicker")}
          </motion.span>

          <h1 className="headline mt-6 text-crisp text-[clamp(1.9rem,3.8vw,3rem)] leading-[1.05] tracking-tight break-words hyphens-auto">
            {[t("poc.title_a"), t("poc.title_b")].map((line, li) => (
              <span key={li} className="block overflow-hidden max-w-full">
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
            transition={{ ...spring, delay: 0.28 }}
            className="subhead mt-6 text-lg md:text-xl max-w-xl mx-auto md:mx-0"
          >
            {t("poc.sub")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.36 }}
            className="mt-9 flex flex-wrap items-center justify-center md:justify-start gap-3"
          >
            <button
              onClick={() => openLead({ title: t("poc.kicker") })}
              className="pill pill-accent"
            >
              {t("poc.cta_primary")}
            </button>
            <a href="#poc-compare" className="pill-link">
              {t("poc.cta_secondary")}
            </a>
          </motion.div>
        </div>

        {/* Device with coverage rings */}
        <motion.div
          style={{ y: deviceY, scale: deviceScale }}
          className="order-1 md:order-2 relative h-[42vh] min-h-[280px] max-h-[560px] md:h-[62vh] flex items-center justify-center"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              aria-hidden
              className="absolute rounded-full border border-signal/25"
              style={{ width: "min(78vw, 460px)", height: "min(78vw, 460px)" }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [0.5, 1.35], opacity: [0.5, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, delay: i * 1.5, ease: "easeOut" }}
            />
          ))}
          <div className="absolute h-[60%] w-[60%] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--signal)_18%,transparent),transparent_70%)] blur-2xl" />
          <motion.img
            src={pocDevice}
            alt="PoC push-to-talk device over LTE"
            loading="eager"
            width={231}
            height={714}
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative h-full w-auto max-w-none object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.3)]"
          />
        </motion.div>
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
      className="rounded-3xl p-8 md:p-12"
      style={{ background: accent ? "var(--signal)" : "var(--pitch)", color: accent ? "#fff" : "var(--crisp)" }}
    >
      <div className={`text-[13px] mb-3 ${accent ? "text-white/70" : "text-cool"}`}>{title}</div>
      <h3 className="headline text-3xl md:text-4xl">{headline}</h3>
      <ul className="mt-8 space-y-4">
        {points.map((p, i) => (
          <li key={i} className="flex items-start gap-4">
            <span
              className="h-9 w-9 rounded-full flex items-center justify-center shrink-0"
              style={{ background: accent ? "rgba(255,255,255,0.18)" : "var(--charcoal)" }}
            >
              {accent ? <Check className="w-4 h-4" /> : <X className="w-4 h-4 text-cool" />}
            </span>
            <div className="flex-1">
              <div className={`text-[15px] ${accent ? "text-white" : "text-crisp"}`}>{p.label}</div>
            </div>
            <p.Icon className={`w-5 h-5 mt-2 shrink-0 ${accent ? "text-white/70" : "text-cool"}`} />
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
    <section className="bg-black text-white py-24 md:py-40 px-6 text-center">
      <div className="max-w-3xl mx-auto">
        <div className="text-signal text-[13px] mb-4">{t("poc.rental.kicker")}</div>
        <h2 className="headline text-white" style={{ fontSize: "clamp(2.25rem, 6vw, 4.5rem)" }}>
          {t("poc.rental.title")}
        </h2>
        <p className="mt-5 text-lg md:text-xl text-white/60">{t("poc.rental.desc")}</p>
        <div className="mt-8">
          <button
            onClick={() => openLead({ title: t("poc.rental.cta") })}
            className="pill"
            style={{ background: "#fff", color: "#000" }}
          >
            {t("poc.rental.cta")}
          </button>
        </div>
      </div>
    </section>
  );
}
