import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Check, Radio, MapPin, MessagesSquare, Layers, Coins, Wifi } from "lucide-react";
import pocHero from "@/assets/poc-hero-v13.png.asset.json";
import radioInHand from "@/assets/product/radio-in-hand.webp";
import { openLead } from "@/components/LeadFormSheet";
import { Section, SectionHead } from "@/components/Section";
import { CompareTable, type CompareColumn } from "@/components/apple";
import { ProductShot } from "@/components/ProductShot";
import { spring, fadeUpAt } from "@/lib/springs";
import { assetUrl } from "@/lib/asset";
import {
  breadcrumbSchema,
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
        title: t("meta.poc.title"),
        description: t("meta.poc.desc"),
        path: "/poc",
      }),
      links: localeLinks(params.lang, "/poc"),
      // /poc was the only page on the site emitting no structured data at all,
      // despite being a named product line with its own service offer.
      scripts: [
        jsonLd(
          serviceSchema(
            {
              name: t("poc.design.title"),
              description: t("meta.poc.desc"),
              path: "/poc",
            },
            params.lang,
          ),
        ),
        jsonLd(
          breadcrumbSchema(
            [
              { name: t("nav.home"), path: "/" },
              { name: t("nav.poc"), path: "/poc" },
            ],
            params.lang,
          ),
        ),
      ],
    };
  },
  component: PoCPage,
};

export function PoCPage() {
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
    <section
      ref={ref}
      className="relative overflow-hidden band-plain pt-32 pb-20 md:pt-44 md:pb-28"
    >
      <div className="relative mx-auto max-w-[1100px] px-6 text-center md:px-10">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="text-[13px] font-medium tracking-tight text-signal"
        >
          {t("poc.kicker")}
        </motion.div>

        <h1 className="type-display mt-4 text-crisp">
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
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.26 }}
          className="subhead type-body mx-auto mt-5 max-w-2xl font-light"
        >
          {t("poc.sub")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
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

        {/* Product stage — seamless white, soft contact shadow */}
        <motion.div
          style={{ y: deviceY, scale: deviceScale }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.2 }}
          className="stage relative mx-auto mt-10 max-w-[820px] md:mt-16"
        >
          <img
            src={assetUrl(pocHero)}
            alt="Radiocom RCD-60 PoC push-to-talk radio"
            loading="eager"
            width={1400}
            height={1400}
            className={`relative z-10 h-auto w-[74%] max-w-[560px] object-contain md:w-[86%] ${reduced ? "" : "float-slow"}`}
          />
        </motion.div>

        {/* Quiet spec row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-[14px] text-cool md:mt-10">
          {[
            { Icon: Wifi, label: "LTE + WiFi" },
            { Icon: MapPin, label: "GPS" },
            { Icon: MessagesSquare, label: t("poc.poc_vals.media") },
          ].map((c, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring, delay: i * 0.06 }}
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
/* ─────────────────────────────────────────────────────────────
   PoC vs PMR — apple.com's "which one is right for you?" table

   The vendor copy is already a comparison matrix (rows x poc_vals x pmr_vals),
   so it belongs in a table rather than two cards: side-by-side columns let a
   buyer read down one axis, which is the whole point of the section.
   ───────────────────────────────────────────────────────────── */
function Compare() {
  const { t } = useTranslation();
  const rowIds = ["coverage", "infra", "media", "gps", "scale", "cost"] as const;

  const rows = rowIds.map((id) => ({ id, label: t(`poc.rows.${id}`) }));
  const columns: CompareColumn[] = [
    {
      id: "poc",
      name: "PoC",
      tagline: t("poc.compare.poc.title"),
      highlight: true,
      media: <Wifi className="h-8 w-8 text-signal" strokeWidth={1.5} aria-hidden />,
      values: Object.fromEntries(rowIds.map((id) => [id, t(`poc.poc_vals.${id}`)])),
    },
    {
      id: "pmr",
      name: "PMR / DMR",
      tagline: t("poc.compare.pmr.title"),
      media: <Radio className="h-8 w-8 text-cool" strokeWidth={1.5} aria-hidden />,
      values: Object.fromEntries(rowIds.map((id) => [id, t(`poc.pmr_vals.${id}`)])),
    },
  ];

  return (
    <section id="poc-compare" className="band-soft section-tight px-4 md:px-6">
      <div className="mx-auto max-w-[1000px]">
        <SectionHead
          align="center"
          spacing="tight"
          title={t("poc.vs_title")}
          sub={t("poc.vs_sub")}
        />
        <motion.div {...fadeUpAt(1)}>
          <CompareTable columns={columns} rows={rows} caption={t("poc.vs_title")} />
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Network design — the five steps as a shelf ──────────── */
/**
 * Five steps do not divide into a three-column grid, and the earlier attempts
 * both showed it: first as a grid with an empty cell in the second row, then as
 * a list, which turned a five-beat sequence into a wall of rules.
 *
 * A shelf is what apple.com uses when the count does not fit the grid — the
 * cards run off the right edge and scroll, so the layout never has to resolve
 * into rows at all. Each card carries its step number as a large ghost numeral
 * behind the copy, which is the sequence made visible rather than stated.
 */
function NetworkDesign() {
  const { t } = useTranslation();
  const steps = (t("poc.design.steps", { returnObjects: true }) as string[]) || [];
  const icons = [MapPin, Layers, Radio, Check, Coins];

  return (
    <Section band="soft" tight>
      <SectionHead
        align="left"
        spacing="tight"
        eyebrow={t("poc.design.kicker")}
        title={t("poc.design.title")}
      />

      <ol className="no-scrollbar bleed-x flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
        {steps.map((step, i) => {
          const Icon = icons[i] ?? Check;
          return (
            <motion.li
              key={step}
              {...fadeUpAt(Math.min(i, 4))}
              className="card-interactive group relative flex min-h-[340px] w-[78vw] shrink-0 snap-start flex-col overflow-hidden rounded-[28px] bg-pitch p-7 sm:w-[46vw] md:w-[32vw] lg:w-[23vw] lg:min-w-[260px]"
            >
              {/* The step number, at a scale you read as position, not as text. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-8 -right-3 select-none text-[150px] font-semibold leading-none tracking-[-0.05em] text-crisp/[0.05] transition-colors duration-500 group-hover:text-signal/[0.09]"
              >
                {i + 1}
              </span>

              <Icon
                className="relative h-8 w-8 text-signal transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                strokeWidth={1.5}
                aria-hidden
              />

              <div className="relative mt-auto">
                <div className="text-[13px] font-medium uppercase tracking-[0.16em] text-cool">
                  {t("poc.design.step_label", {
                    defaultValue: String(i + 1).padStart(2, "0"),
                    n: i + 1,
                  })}
                </div>
                <h3 className="mt-2 hyphens-auto break-words text-[21px] font-semibold leading-[1.2] tracking-[-0.02em] text-crisp">
                  {step}
                </h3>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </Section>
  );
}

/* ─── Rental — product on a stage, copy alongside ─────────── */
/**
 * The image here used to be rendered with `mix-blend-multiply` inside a
 * `bg-pitch` card — and `--pitch` is white, despite the name. Multiply removes
 * white and keeps black, so a dark-background source came through as a hard
 * black rectangle sitting in a white box. That is the "black image on white
 * background" in the brief.
 *
 * It now uses a studio shot on a light stage, the same treatment the hero at
 * the top of this page already applied correctly.
 */
function Rental() {
  const { t } = useTranslation();
  return (
    <Section band="soft" tight>
      <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
        <motion.div {...fadeUpAt(0)} className="order-2 md:order-1">
          <div className="text-[13px] font-medium tracking-tight text-signal">
            {t("poc.rental.kicker")}
          </div>
          <h2 className="type-headline mt-3 text-crisp">{t("poc.rental.title")}</h2>
          <p className="subhead mt-5 max-w-md text-[15px] md:text-base">{t("poc.rental.desc")}</p>
          <button
            onClick={() => openLead({ title: t("poc.rental.cta") })}
            className="pill pill-accent mt-7"
          >
            {t("poc.rental.cta")}
          </button>
        </motion.div>

        <motion.div
          {...fadeUpAt(1)}
          className="order-1 overflow-hidden rounded-[28px] bg-pitch md:order-2"
        >
          <ProductShot
            src={radioInHand}
            alt={t("poc.rental.title")}
            width={1600}
            height={2143}
            sizes="(max-width: 768px) 90vw, 520px"
            className="aspect-[4/3] w-full p-6"
          />
        </motion.div>
      </div>
    </Section>
  );
}
