import { motion } from "framer-motion";
import { useScrollChoreography } from "@/lib/motion";
import { useTranslation } from "react-i18next";
import { Search, Cog, ClipboardCheck } from "lucide-react";
import serviceLight from "@/assets/service-tech-light.jpg";
// One distinct photograph per repair stage — the brief's rule is never to
// reuse a shot for two slots on the same page, and a lucide icon alone in
// white space is what these cards looked like before.
import stageIntake from "@/assets/cutout/radio-single-cutout.webp";
import stageIntake800 from "@/assets/cutout/radio-single-cutout@800.webp";
import stageAnalysis from "@/assets/cutout/lineup-seven-cutout.webp";
import stageAnalysis800 from "@/assets/cutout/lineup-seven-cutout@800.webp";
import stageRepair from "@/assets/cutout/four-aligned-cutout.webp";
import stageRepair800 from "@/assets/cutout/four-aligned-cutout@800.webp";
import stageTest from "@/assets/cutout/hands-tradein-cutout.webp";
import stageTest800 from "@/assets/cutout/hands-tradein-cutout@800.webp";
import advCertified from "@/assets/cutout/hands-compare-cutout.webp";
import advCertified800 from "@/assets/cutout/hands-compare-cutout@800.webp";
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
        ogCard: "service",
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
  const page = useScrollChoreography();

  return (
    <div ref={page} className="page-anim">
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
            data-parallax="0.16"
            className="absolute inset-0 h-full w-full scale-110 object-cover"
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
          {t("service.title_a")}
          <br />
          <span className="whitespace-nowrap">{t("service.title_b")}</span>
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
  // Four cutouts of four different proportions — a single radio at 990x1104,
  // a seven-wide lineup at 1600x758. `cover` would crop each of them
  // differently in the same 4:3 slot, which is what made the row read as
  // inconsistent. `contain` on a shared soft panel lets each shot keep its own
  // shape while the panels stay identical.
  const shots = [
    { src: stageIntake, small: stageIntake800, alt: "" },
    { src: stageAnalysis, small: stageAnalysis800, alt: "" },
    { src: stageRepair, small: stageRepair800, alt: "" },
    { src: stageTest, small: stageTest800, alt: "" },
  ];

  return (
    <section className="band-soft section">
      <div className="shell">
        <div data-scrub-in>
          <SectionHead align="left" spacing="tight" title={t("service.flow_title")} />
        </div>
        <HighlightsShelf label={t("service.flow_title")} stagger>
          {steps.map((step, i) => {
            const shot = shots[i] ?? shots[0];
            return (
              <article
                key={step.t}
                className="group card-interactive relative flex w-[78vw] shrink-0 snap-start flex-col overflow-hidden rounded-[28px] bg-pitch sm:w-[46vw] lg:w-[calc((100%-3rem)/4)]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-charcoal p-5">
                  <ProductShot
                    src={shot.src}
                    cutout
                    srcSmall={shot.small}
                    alt={shot.alt}
                    width={1600}
                    height={1200}
                    fit="contain"
                    sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 320px"
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
    <section className="band-plain section">
      <div className="shell">
        <div data-scrub-in>
          <SectionHead align="left" spacing="tight" title={t("service.advantages_title")} />
        </div>
        <BentoGrid>
          {/* Wide photographic tile — the authorised-centre claim, which is the
              one worth showing rather than stating. */}
          <FeatureCard
            idx={0}
            span={2}
            title={adv.certified?.t}
            body={adv.certified?.d}
            className="min-h-[300px]"
            // `sm:` prefixed. Below that the photograph is under the copy, so
            // narrowing the copy for it would break the headline mid-word for
            // no reason — which is exactly what the unprefixed version did.
            copyClassName="sm:max-w-[56%] lg:max-w-[48%]"
            figure={
              <div data-parallax="0.06" className="flex h-full w-full items-center justify-center">
                <ProductShot
                  src={advCertified}
                  cutout
                  srcSmall={advCertified800}
                  alt=""
                  width={1600}
                  height={1600}
                  fit="contain"
                  sizes="(max-width: 640px) 78vw, (max-width: 1024px) 44vw, 300px"
                  className="w-full max-w-[300px] sm:max-w-none"
                  imgClassName="max-h-[220px] sm:max-h-[260px] drop-shadow-[0_18px_28px_rgba(0,0,0,0.12)]"
                />
              </div>
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
      {/* `.shell` supplies the site's one horizontal inset. Without it the FAQ
          rows ran edge-to-edge on mobile while the heading above them sat on
          the normal grid. */}
      <div className="shell">
        <div className="mx-auto max-w-3xl">
          <div data-scrub-in>
            <SectionHead align="center" spacing="tight" title={t("service.policy_title")} />
          </div>
          <Faq items={rows} />
        </div>
      </div>
    </section>
  );
}
