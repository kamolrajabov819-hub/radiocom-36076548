import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Search, Cog, ClipboardCheck } from "lucide-react";
import serviceLight from "@/assets/service-tech-light.jpg";
// One distinct photograph per repair stage — the brief's rule is never to
// reuse a shot for two slots on the same page, and a lucide icon alone in
// white space is what these cards looked like before.
import stageIntake from "@/assets/radio-on-white.webp";
import stageAnalysis from "@/assets/radios-lineup-seven.webp";
import stageRepair from "@/assets/radios-four-aligned.webp";
import stageTest from "@/assets/hands-tradein-pair.webp";
import advCertified from "@/assets/hands-two-radios-front.webp";
import { openLead } from "@/components/LeadFormSheet";
import { spring } from "@/lib/springs";
import { ProductShot } from "@/components/ProductShot";
import { SectionHead } from "@/components/Section";
import { Faq } from "@/components/Faq";
import { BentoGrid, FeatureCard, HighlightsShelf } from "@/components/apple";

/** A title plus its supporting line. Both the repair stages and the
 *  advantages tiles use this shape; a bare string is what made them read as
 *  filler. */
type FlowStep = { t: string; d: string };
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
/* ─── Как проходит ремонт — horizontal highlights shelf ───────
   Was a pinned GSAP scrub that hijacked the page scroll sideways on narrow
   screens and did nothing on wide ones. See HighlightsShelf for why this is a
   scroll-snap row instead. Each stage now carries a photograph and a
   supporting line — a numbered card with one noun in it is what read as
   filler. */
function Flow() {
  const { t } = useTranslation();
  const steps = (t("service.flow", { returnObjects: true }) as FlowStep[]) || [];
  const shots = [
    { src: stageIntake, alt: "" },
    { src: stageAnalysis, alt: "" },
    { src: stageRepair, alt: "" },
    { src: stageTest, alt: "" },
  ];

  return (
    <section className="band-soft section-tight">
      <div className="shell">
        <SectionHead align="left" spacing="tight" title={t("service.flow_title")} />
        <HighlightsShelf label={t("service.flow_title")}>
          {steps.map((step, i) => {
            const shot = shots[i] ?? shots[0];
            return (
              <article
                key={step.t}
                className="group card-interactive relative flex w-[78vw] shrink-0 snap-start flex-col overflow-hidden rounded-[28px] bg-pitch sm:w-[46vw] lg:w-[calc((100%-3rem)/4)]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-charcoal">
                  <ProductShot
                    src={shot.src}
                    alt={shot.alt}
                    width={1600}
                    height={1200}
                    fit="cover"
                    sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 300px"
                    className="absolute inset-0 [&_img]:transition-transform [&_img]:duration-700 [&_img]:ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[&_img]:scale-[1.04]"
                  />
                  <div
                    aria-hidden
                    className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-crisp/85 text-[15px] font-semibold text-pitch backdrop-blur-sm"
                  >
                    {i + 1}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-[19px] font-semibold leading-[1.2] tracking-[-0.01em] text-crisp">
                    {step.t}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-cool">{step.d}</p>
                </div>
              </article>
            );
          })}
        </HighlightsShelf>
      </div>
    </section>
  );
}

/* ─── Почему сюда — asymmetric bento ──────────────────────────
   Four identical squares with one icon each is the shape the brief called AI
   filler. This is one wide photographic tile, two narrow ones and a single
   dark accent — and every tile carries a headline *and* a supporting line. */
function Advantages() {
  const { t } = useTranslation();
  const adv = t("service.advantages", { returnObjects: true }) as Record<string, FlowStep>;

  return (
    <section className="band-plain section-tight">
      <div className="shell">
        <SectionHead align="left" spacing="tight" title={t("service.advantages_title")} />
        <BentoGrid>
          {/* Wide photographic tile — the authorised-centre claim, which is the
              one worth showing rather than stating. */}
          <FeatureCard
            idx={0}
            span={2}
            title={adv.certified?.t}
            body={adv.certified?.d}
            className="min-h-[300px]"
            copyClassName="max-w-[56%] lg:max-w-[48%]"
            backdrop={
              <ProductShot
                src={advCertified}
                alt=""
                width={1600}
                height={1200}
                fit="cover"
                sizes="(max-width: 1024px) 90vw, 620px"
                className="absolute inset-y-0 right-0 w-[52%]"
              />
            }
          />

          {/* The one dark tile in the section. */}
          <FeatureCard
            idx={1}
            tone="dark"
            title={adv.fixed?.t}
            body={adv.fixed?.d}
            className="min-h-[300px]"
            media={<Cog className="h-9 w-9 text-white" strokeWidth={1.5} aria-hidden />}
          />

          <FeatureCard
            idx={2}
            title={adv.parts?.t}
            body={adv.parts?.d}
            className="min-h-[240px]"
            media={<ClipboardCheck className="h-9 w-9 text-signal" strokeWidth={1.5} aria-hidden />}
          />
          <FeatureCard
            idx={3}
            title={adv.fast?.t}
            body={adv.fast?.d}
            className="min-h-[240px]"
            media={<Search className="h-9 w-9 text-signal" strokeWidth={1.5} aria-hidden />}
          />
          <FeatureCard
            idx={4}
            title={t("service.request_repair")}
            body={t("service.request_repair_sub")}
            className="min-h-[240px]"
            action={{
              label: t("service.request_repair"),
              onClick: () => openLead({ title: t("service.request_repair") }),
            }}
          />
        </BentoGrid>
      </div>
    </section>
  );
}

function Policy() {
  const { t } = useTranslation();
  const rows = t("service.policy", { returnObjects: true }) as Array<{ q: string; a: string }>;
  return (
    <section className="band-soft section">
      <div className="mx-auto max-w-3xl">
        <SectionHead align="center" spacing="tight" title={t("service.policy_title")} />
        <Faq items={rows} />
      </div>
    </section>
  );
}
