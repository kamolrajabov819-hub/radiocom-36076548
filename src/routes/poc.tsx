import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Check, X, Radio, MapPin, MessagesSquare, Layers, Coins, Wifi } from "lucide-react";
import pocHero from "@/assets/poc-hero-rcd60.png.asset.json";
import pocRental from "@/assets/poc-rental-rcd70.png.asset.json";
import { openLead } from "@/components/LeadFormSheet";
import { spring } from "@/lib/springs";
import { assetUrl } from "@/lib/asset";


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
  const deviceY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -70]);
  const deviceScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.04]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-background pt-32 pb-20 md:pt-44 md:pb-28">
      <div className="relative mx-auto max-w-[1100px] px-6 text-center md:px-10">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="text-[13px] font-medium tracking-tight text-signal"
        >
          {t("poc.kicker")}
        </motion.div>

        <h1 className="headline mt-4 text-[clamp(2.4rem,6.4vw,5rem)] leading-[1.03] tracking-[-0.03em] text-crisp">
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
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.26 }}
          className="subhead mx-auto mt-5 max-w-2xl text-lg font-light md:text-xl"
        >
          {t("poc.sub")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
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

        {/* Product stage — seamless white, no card */}
        <motion.div
          style={{ y: deviceY, scale: deviceScale }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.2 }}
          className="relative mx-auto mt-10 flex max-w-[760px] items-center justify-center md:mt-14"
        >
          <motion.img
            src={assetUrl(pocHero)}
            alt="Radiocom RCD-60 PoC push-to-talk radio"
            loading="eager"
            width={1400}
            height={1400}
            animate={reduced ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="h-auto w-[78%] max-w-[520px] object-contain md:w-full"
          />
        </motion.div>

        {/* Quiet spec row */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[14px] text-cool md:mt-8">
          {[
            { Icon: Wifi, label: "LTE + WiFi" },
            { Icon: MapPin, label: "GPS" },
            { Icon: MessagesSquare, label: t("poc.poc_vals.media") },
          ].map((c, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring, delay: i * 0.07 }}
              className="inline-flex items-center gap-2"
            >
              <c.Icon className="h-4 w-4 shrink-0 text-signal" />
              {c.label}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}


/* PoC vs PMR — two quiet equal-height panels */
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
    <section id="poc-compare" className="bg-charcoal section scroll-mt-24 px-6 md:px-10">
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={spring}
          className="mb-14 text-center"
        >
          <h2 className="headline text-4xl tracking-[-0.02em] text-crisp md:text-6xl">{t("poc.vs_title")}</h2>
          <p className="subhead mx-auto mt-4 max-w-2xl text-lg font-light">{t("poc.vs_sub")}</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <CompareCard kind="poc" title="PoC" headline={t("poc.compare.poc.title")} points={pocPoints} />
          <CompareCard kind="pmr" title="PMR / DMR" headline={t("poc.compare.pmr.title")} points={pmrPoints} />
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
      className="flex h-full flex-col rounded-[28px] border border-border bg-background p-8 shadow-[0_24px_60px_-48px_rgba(0,0,0,0.35)] md:p-12"
    >
      <div className={`mb-3 text-[13px] ${accent ? "text-signal" : "text-cool"}`}>{title}</div>
      <h3 className="headline text-3xl tracking-[-0.02em] text-crisp md:text-4xl">{headline}</h3>
      <ul className="mt-8 space-y-4">
        {points.map((p, i) => (
          <li key={i} className="flex items-start gap-4">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                accent ? "bg-signal text-white" : "bg-charcoal text-cool"
              }`}
            >
              {accent ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </span>
            <div className="min-w-0 flex-1 text-[15px] leading-relaxed text-crisp">{p.label}</div>
            <p.Icon className={`mt-1.5 h-5 w-5 shrink-0 ${accent ? "text-signal/70" : "text-cool"}`} />
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
      <div className="mx-auto max-w-[1200px] text-center">
        <div className="mb-4 text-[13px] text-signal">{t("poc.design.kicker")}</div>
        <h2 className="headline mx-auto max-w-3xl text-4xl tracking-[-0.02em] text-crisp md:text-6xl">
          {t("poc.design.title")}
        </h2>
        <ol className="mt-14 grid grid-cols-1 gap-3 text-left sm:grid-cols-2 md:grid-cols-5">
          {steps.map((s, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ ...spring, delay: i * 0.06 }}
              className="bento-card h-full p-6"
            >
              <div className="text-[13px] text-signal">0{i + 1}</div>
              <div className="mt-3 text-[15px] leading-snug text-crisp">{s}</div>
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
    <section className="overflow-hidden bg-black px-6 py-24 text-white md:py-40">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={spring}
          className="order-2 min-w-0 text-center md:order-1 md:text-left"
        >
          <div className="mb-4 text-[13px] text-signal">{t("poc.rental.kicker")}</div>
          <h2
            className="headline tracking-[-0.03em] text-white"
            style={{ fontSize: "clamp(2rem, 5vw, 3.75rem)" }}
          >
            {t("poc.rental.title")}
          </h2>
          <p className="mt-5 text-lg font-light text-white/60 md:text-xl">{t("poc.rental.desc")}</p>
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
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={spring}
          className="order-1 flex items-center justify-center md:order-2"
        >
          <img
            src={assetUrl(pocRental)}
            alt="Radiocom RCD-70 radio available for rent"
            loading="lazy"
            width={1400}
            height={1400}
            className="h-auto w-[70%] max-w-[420px] object-contain md:w-full"
          />
        </motion.div>
      </div>
    </section>
  );
}
