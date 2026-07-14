import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Clock, Plus, Minus, Search, Microscope, Cog, ClipboardCheck } from "lucide-react";
import serviceLight from "@/assets/service-tech-light.jpg";
import serviceDark from "@/assets/service-tech-dark.jpg";
import { openLead } from "@/components/LeadFormSheet";
import { MapEmbed } from "@/components/MapEmbed";
import { ThemedImage } from "@/components/ThemedImage";
import { spring } from "@/lib/springs";


export const Route = createFileRoute("/service")({
  head: () => ({
    meta: [
      { title: "Authorized Service Center — Radio Repair Tashkent | Radiocom" },
      { name: "description", content: "Warranty and post-warranty repair for Motorola, Hytera and Vertex Standard radios. Original parts, certified technicians, fixed pricing." },
      { property: "og:title", content: "Authorized Service Center — Radiocom" },
      { property: "og:description", content: "Certified radio repair with original parts and fixed pricing in Tashkent." },
    ],
  }),
  component: ServicePage,
});

function ServicePage() {
  return (
    <div className="page-anim">
      <Hero />
      <BenchStrip />
      <Flow />
      <Advantages />
      <Policy />
      <Visit />
    </div>
  );
}

function BenchStrip() {
  return (
    <section className="bg-pitch px-6 md:px-10">
      <div className="max-w-[1200px] mx-auto">
        <div className="rounded-3xl overflow-hidden aspect-[16/7] bg-charcoal relative">
          <ThemedImage light={serviceLight} dark={serviceDark} alt="" width={1400} height={1000} className="absolute inset-0 h-full w-full" />
        </div>
      </div>
    </section>
  );
}


function Hero() {
  const { t } = useTranslation();
  return (
    <section className="pt-40 md:pt-56 pb-16 md:pb-24 bg-pitch px-6 text-center">
      <div className="max-w-3xl mx-auto">
        <div className="text-signal text-[13px] mb-4">{t("service.kicker")}</div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="headline text-crisp"
          style={{ fontSize: "clamp(2.75rem, 8vw, 6rem)" }}
        >
          {t("service.title_a")} {t("service.title_b")}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.1 }}
          className="subhead mt-5 text-lg md:text-xl"
        >
          {t("service.sub")}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.2 }}
          className="mt-8 flex items-center justify-center gap-4 flex-wrap"
        >
          <button onClick={() => openLead({ title: t("service.request_repair") })} className="pill pill-accent">
            {t("service.request_repair")}
          </button>
          <a href="tel:+998935050719" className="pill-link">+998 93 505-07-19</a>
        </motion.div>
      </div>
    </section>
  );
}

function Flow() {
  const { t } = useTranslation();
  const steps = t("service.flow", { returnObjects: true }) as string[];
  const icons = [Search, Microscope, ClipboardCheck, Cog];
  return (
    <section className="bg-charcoal section-tight px-6 md:px-10">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="headline text-crisp text-3xl md:text-5xl text-center mb-16">
          {t("service.flow_title")}
        </h2>
        <div className="relative">
          <div className="absolute top-8 left-8 right-8 h-px bg-border hidden md:block" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {steps.map((s, i) => {
              const Icon = icons[i] ?? Search;
              return (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ ...spring, delay: i * 0.08 }}
                  className="relative text-center flex flex-col items-center"
                >
                  <div className="h-16 w-16 rounded-full bg-pitch flex items-center justify-center relative z-10">
                    <Icon className="w-6 h-6 text-signal" strokeWidth={1.75} />
                  </div>
                  <div className="text-[12px] text-cool mt-4">Step {i + 1}</div>
                  <div className="headline text-lg md:text-xl text-crisp mt-1">{s}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Advantages() {
  const { t } = useTranslation();
  const keys = ["certified", "parts", "fast", "fixed"] as const;
  return (
    <section className="bg-pitch section px-6 md:px-10">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {keys.map((k, i) => (
          <motion.div
            key={k}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ ...spring, delay: i * 0.06 }}
            className="bento-card p-8"
          >
            <div className="text-signal text-[12px]">0{i + 1}</div>
            <div className="headline text-2xl text-crisp mt-3">{t(`service.advantages.${k}`)}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Policy() {
  const { t } = useTranslation();
  const rows = t("service.policy", { returnObjects: true }) as Array<{ q: string; a: string }>;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-pitch section px-6 md:px-10">
      <div className="max-w-3xl mx-auto">
        <h2 className="headline text-crisp text-3xl md:text-5xl text-center mb-12">
          {t("service.policy_title")}
        </h2>
        <div className="rounded-3xl bg-charcoal overflow-hidden">
          {rows.map((r, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className={i === 0 ? "" : "border-t border-border"}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full text-left px-6 md:px-8 py-6 flex items-center justify-between gap-6"
                >
                  <span className="text-crisp text-[16px] md:text-lg font-medium">{r.q}</span>
                  <span className="shrink-0 h-8 w-8 rounded-full bg-pitch flex items-center justify-center text-crisp">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-6 md:px-8 pb-6 text-cool text-[15px] leading-relaxed">{r.a}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Visit() {
  const { t } = useTranslation();
  return (
    <section className="bg-charcoal section px-6 md:px-10">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="headline text-crisp text-4xl md:text-6xl">{t("service.visit_title")}</h2>
          <div className="mt-8 space-y-5">
            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-signal mt-0.5 shrink-0" />
              <p className="text-crisp text-[16px]">{t("footer.address")}</p>
            </div>
            <div className="flex items-start gap-4">
              <Clock className="w-5 h-5 text-signal mt-0.5 shrink-0" />
              <p className="text-crisp text-[16px]">{t("footer.hours")}</p>
            </div>
          </div>
          <div className="mt-8">
            <button onClick={() => openLead({ title: t("service.request_repair") })} className="pill pill-accent">
              {t("service.request_repair")}
            </button>
          </div>
        </div>
        <div>
          <MapEmbed />
        </div>
      </div>
    </section>
  );
}
