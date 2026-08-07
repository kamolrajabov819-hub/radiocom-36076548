import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { products } from "@/data/products";
import { CountUp } from "@/components/CountUp";
import { WordReveal } from "@/components/WordReveal";
import { spring } from "@/lib/springs";

const BRANDS = [
  { key: "Radiocom RC" as const, i18n: "rc" },
  { key: "Motorola" as const, i18n: "mot" },
];

export function BrandsStrip() {
  const { t } = useTranslation();
  const models = products.map((p) => p.name);
  const loop = [...models, ...models];

  return (
    <section className="section-tight px-0 bg-pitch overflow-hidden relative">
      {/* animated signal wave behind the section */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-[320px] opacity-[0.10]"
        viewBox="0 0 1200 320"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,160 C150,60 300,260 450,160 C600,60 750,260 900,160 C1050,60 1200,260 1350,160"
          fill="none"
          stroke="var(--signal)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.2, ease: "easeInOut" }}
        />
        <motion.path
          d="M0,190 C150,90 300,290 450,190 C600,90 750,290 900,190 C1050,90 1200,290 1350,190"
          fill="none"
          stroke="var(--signal)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.6, ease: "easeInOut", delay: 0.2 }}
        />
      </svg>

      <div className="max-w-[1200px] mx-auto text-center px-6 md:px-10 mb-12 relative z-10">
        <div className="text-[11px] tracking-[0.24em] uppercase text-cool">
          {t("brands_title")}
        </div>
        <WordReveal
          as="h2"
          text={t("brands.headline")}
          className="headline text-crisp text-3xl md:text-5xl mt-3 block"
        />
        <p className="subhead mt-4 max-w-xl mx-auto">{t("brands.sub")}</p>
      </div>

      {/* Two hero brand cards */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 relative z-10">
        {BRANDS.map((b, i) => {
          const count = products.filter((p) => p.brand === b.key).length;
          return (
            <motion.div
              key={b.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ ...spring, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)] hover:shadow-[0_24px_50px_-20px_rgba(0,0,0,0.22)] transition-shadow duration-500 p-8 md:p-10 text-left"
            >
              <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklab,var(--signal)_22%,transparent),transparent_70%)]" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-signal">
                  <BadgeCheck className="w-4 h-4" />
                  {t("brands.official")}
                </div>
                <div className="headline text-crisp text-3xl md:text-5xl mt-4 tracking-tight">
                  {b.key}
                </div>
                <p className="subhead mt-3 text-[15px] max-w-sm">
                  {t(`brands.${b.i18n}_desc`)}
                </p>
                <div className="mt-8 flex items-end justify-between gap-4">
                  <div>
                    <div className="text-crisp text-4xl md:text-5xl font-semibold tracking-tight">
                      <CountUp to={count} />
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-cool mt-1">
                      {t("brands.models")}
                    </div>
                  </div>
                  <Link
                    to="/catalog"
                    className="pill-link text-signal shrink-0"
                  >
                    {t("brands.view")} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-signal transition-all duration-700 group-hover:w-full" />
            </motion.div>
          );
        })}
      </div>

      {/* Infinite model marquee */}
      <div className="relative group mt-12">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-40 z-10 bg-gradient-to-r from-pitch to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-40 z-10 bg-gradient-to-l from-pitch to-transparent" />

        <div className="flex gap-3 marquee-track will-change-transform">
          {loop.map((name, i) => (
            <div
              key={`${name}-${i}`}
              className="shrink-0 rounded-full border border-black/[0.07] bg-white px-5 py-2.5 text-[13px] text-cool whitespace-nowrap transition-colors duration-300 hover:border-signal/50 hover:text-crisp"
            >
              {name}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee-scroll 55s linear infinite;
          width: max-content;
        }
        .group:hover .marquee-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
    </section>
  );
}
