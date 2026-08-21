import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Minus, Search, Microscope, Cog, ClipboardCheck } from "lucide-react";
import serviceLight from "@/assets/service-tech-light.jpg";
import { openLead } from "@/components/LeadFormSheet";
import { spring } from "@/lib/springs";
import { gsap, useGsap } from "@/lib/motion";
import { SectionHead } from "@/components/Section";
import { FeatureCard } from "@/components/apple";
import {
  SITE_NAME,
  breadcrumbSchema,
  faqSchema,
  jsonLd,
  localeLinks,
  pageMeta,
  serviceSchema,
  type SeoLang,
} from "@/lib/seo";
import { tFor } from "@/lib/i18n";

export const routeOptions = {
  head: ({ params }: { params: { lang: SeoLang } }) => {
    const t = tFor(params.lang);
    return {
      meta: pageMeta({
        lang: params.lang,
        title: t("meta.service.title"),
        description: t("meta.service.desc"),
        path: "/service",
      }),
      links: localeLinks(params.lang, "/service"),
      scripts: [
        jsonLd(
          serviceSchema(
            {
              name: t("meta.service.schema_name"),
              description: t("meta.service.schema_desc"),
              path: "/service",
            },
            params.lang,
          ),
        ),
        jsonLd(
          breadcrumbSchema(
            [
              { name: SITE_NAME, path: "/" },
              { name: t("meta.crumb.service"), path: "/service" },
            ],
            params.lang,
          ),
        ),
        // The repair policy accordion is already a list of questions and
        // answers, translated in all three locales — it just was not marked up
        // as one. Free eligibility for an FAQ rich result on the page that
        // answers "how much does a repair cost".
        jsonLd(
          faqSchema(
            t("service.policy", { returnObjects: true }) as { q: string; a: string }[],
            params.lang,
          ),
        ),
      ],
    };
  },
  component: ServicePage,
};

export function ServicePage() {
  return (
    <div className="page-anim">
      <Hero />
      <BenchStrip />
      <Flow />
      <Advantages />
      <Policy />
    </div>
  );
}

function BenchStrip() {
  return (
    <section className="bg-pitch">
      <div className="shell">
        <div className="rounded-3xl overflow-hidden aspect-[16/7] bg-charcoal relative">
          <img
            src={serviceLight}
            alt=""
            loading="lazy"
            width={1400}
            height={1000}
            className="absolute inset-0 h-full w-full object-cover"
          />
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
          <button
            onClick={() => openLead({ title: t("service.request_repair") })}
            className="pill pill-accent"
          >
            {t("service.request_repair")}
          </button>
          <a href="tel:+998939800710" className="pill-link">
            +998 93 980-07-10
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Repair flow — a scrub-driven horizontal timeline

   The four stages advance sideways as the section is scrolled through, so the
   process reads as a sequence rather than four disconnected tiles. Pinned via
   GSAP; under reduced motion the hook no-ops and the row simply sits static.
   ───────────────────────────────────────────────────────────── */
function Flow() {
  const { t } = useTranslation();
  const steps = (t("service.flow", { returnObjects: true }) as string[]) || [];
  const icons = [Search, Microscope, ClipboardCheck, Cog];
  const scope = useRef<HTMLElement>(null);

  useGsap(
    () => {
      const track = scope.current?.querySelector("[data-flow-track]");
      if (!track) return;
      // Only pin when the track actually overflows — on wide screens all four
      // stages already fit and pinning would just freeze the page for nothing.
      const overflow = track.scrollWidth - track.clientWidth;
      if (overflow <= 0) return;

      gsap.to(track, {
        x: -overflow,
        ease: "none",
        scrollTrigger: {
          trigger: scope.current,
          start: "top top",
          end: () => `+=${overflow + window.innerHeight * 0.6}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    },
    scope,
    [steps.length],
  );

  return (
    <section ref={scope} className="band-soft section-tight overflow-hidden">
      <div className="shell">
        <SectionHead align="left" spacing="tight" title={t("service.flow_title")} />
        <div data-flow-track className="flex gap-4 will-change-transform">
          {steps.map((s, i) => {
            const Icon = icons[i] ?? Search;
            return (
              <div key={s} className="w-[78vw] shrink-0 sm:w-[46vw] lg:w-[calc((100%-3rem)/4)]">
                <FeatureCard
                  idx={i}
                  tone={i === 1 ? "dark" : "light"}
                  eyebrow={`0${i + 1}`}
                  title={s}
                  className="h-full min-h-[240px] ring-1 ring-border"
                  media={<Icon className="h-10 w-10 text-signal" strokeWidth={1.5} aria-hidden />}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Advantages — white cards on grey ────────────────────── */
function Advantages() {
  const { t } = useTranslation();
  const keys = ["certified", "parts", "fast", "fixed"] as const;
  const icons = [ClipboardCheck, Cog, Search, Microscope];
  return (
    <section className="band-plain section">
      <div className="shell">
        <SectionHead align="left" spacing="tight" title={t("service.advantages_title")} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {keys.map((k, i) => {
            const Icon = icons[i];
            return (
              <FeatureCard
                key={k}
                idx={i}
                tone={i === 3 ? "dark" : "light"}
                title={t(`service.advantages.${k}`)}
                className="min-h-[240px] bg-charcoal"
                media={
                  <Icon
                    className={`h-9 w-9 ${i === 3 ? "text-white" : "text-signal"}`}
                    strokeWidth={1.5}
                    aria-hidden
                  />
                }
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Policy — accordion ──────────────────────────────────── */
function Policy() {
  const { t } = useTranslation();
  const rows = t("service.policy", { returnObjects: true }) as Array<{ q: string; a: string }>;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="band-soft section">
      <div className="mx-auto max-w-3xl">
        <SectionHead align="center" spacing="tight" title={t("service.policy_title")} />
        <div className="divide-y divide-border border-y border-border">
          {rows.map((r, i) => {
            const isOpen = open === i;
            return (
              <div key={r.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <span className="text-[17px] font-medium text-crisp">{r.q}</span>
                  <span className="shrink-0 text-signal" aria-hidden>
                    {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={spring}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-[15px] leading-relaxed text-cool">{r.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
