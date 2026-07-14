import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Check, X, Wifi, Radio, MapPin, MessagesSquare, Layers, Coins } from "lucide-react";
import pocLight from "@/assets/poc-hero-light.jpg";
import pocDark from "@/assets/poc-hero-dark.jpg";
import { openLead } from "@/components/LeadFormSheet";
import { ThemedImage } from "@/components/ThemedImage";
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
  const revealTo = useTransform(scrollYProgress, [0, 0.6], [50, 100]);

  return (
    <section ref={ref} className="pt-40 md:pt-56 pb-24 md:pb-32 bg-pitch overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <div className="text-signal text-[13px] mb-6">{t("poc.kicker")}</div>
        <motion.h1
          style={{
            backgroundImage: useTransform(
              revealTo,
              (v) => `linear-gradient(180deg, var(--crisp) 0%, var(--crisp) ${v}%, color-mix(in oklab, var(--crisp) 25%, transparent) 100%)`,
            ) as unknown as string,
          }}
          className="headline-hero text-crisp"
        >
          {t("poc.title_a")}<br />{t("poc.title_b")}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ ...spring, delay: 0.1 }}
          className="subhead mt-6 text-lg md:text-xl max-w-2xl mx-auto"
        >
          {t("poc.sub")}
        </motion.p>
      </div>

      <div className="mt-20 max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="rounded-3xl overflow-hidden aspect-[16/8] bg-charcoal relative">
          <ThemedImage light={pocLight} dark={pocDark} alt="" width={1600} height={1000} className="absolute inset-0 h-full w-full" />
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
    <section className="bg-charcoal section px-6 md:px-10">
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
