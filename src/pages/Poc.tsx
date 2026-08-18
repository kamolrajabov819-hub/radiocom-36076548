import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Check, Radio, MapPin, MessagesSquare, Layers, Coins, Wifi } from "lucide-react";
import pocHero from "@/assets/poc-hero-v13.png.asset.json";
import pocRental from "@/assets/poc-rental-v11.png.asset.json";
import { openLead } from "@/components/LeadFormSheet";
import { SectionHead } from "@/components/Section";
import {
  CompareTable,
  FeatureCard,
  ScrollRow,
  ScrollItem,
  type CompareColumn,
} from "@/components/apple";
import { spring, fadeUpAt } from "@/lib/springs";
import { assetUrl } from "@/lib/asset";
import { absolute, localeLinks, type SeoLang } from "@/lib/seo";

export const routeOptions = {
  head: ({ params }: { params: { lang: SeoLang } }) => ({
    meta: [
      { title: "PoC-рации: связь через LTE по всему Узбекистану | Radiocom" },
      {
        name: "description",
        content:
          "Push-to-Talk over Cellular — связь без ретрансляторов по всей стране, GPS, группы и диспетчеризация. Проектирование сети и аренда рации в Ташкенте.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:title",
        content: "PoC-рации: связь через LTE по всему Узбекистану | Radiocom",
      },
      {
        property: "og:description",
        content:
          "Push-to-Talk over Cellular — связь без ретрансляторов по всей стране, GPS, группы и диспетчеризация. Проектирование сети и аренда рации в Ташкенте.",
      },
      { property: "og:url", content: absolute("/poc") },
      { property: "og:locale", content: "ru_RU" },
      { property: "og:locale:alternate", content: "uz_UZ" },
      { property: "og:locale:alternate", content: "en_US" },
      {
        name: "twitter:title",
        content: "PoC-рации: связь через LTE по всему Узбекистану | Radiocom",
      },
      {
        name: "twitter:description",
        content:
          "Push-to-Talk over Cellular — связь без ретрансляторов по всей стране, GPS, группы и диспетчеризация. Проектирование сети и аренда рации в Ташкенте.",
      },
    ],
    links: localeLinks(params.lang, "/poc"),
  }),
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

/* ─── Network design — numbered steps as a card shelf ─────── */
function NetworkDesign() {
  const { t } = useTranslation();
  const steps = (t("poc.design.steps", { returnObjects: true }) as string[]) || [];
  const icons = [MapPin, Layers, Radio, Check, Coins];

  return (
    <section className="band-plain section-tight px-4 md:px-6">
      <div className="mx-auto max-w-[1200px]">
        <SectionHead
          align="left"
          spacing="tight"
          eyebrow={t("poc.design.kicker")}
          title={t("poc.design.title")}
        />
        <ScrollRow cols={3}>
          {steps.map((s, i) => {
            const Icon = icons[i] ?? Check;
            return (
              <ScrollItem key={s}>
                <FeatureCard
                  idx={i}
                  tone={i === 1 ? "dark" : "light"}
                  eyebrow={String(i + 1).padStart(2, "0")}
                  title={s}
                  className="h-full min-h-[230px] ring-1 ring-border"
                  media={<Icon className="h-9 w-9 text-signal" strokeWidth={1.5} aria-hidden />}
                />
              </ScrollItem>
            );
          })}
        </ScrollRow>
      </div>
    </section>
  );
}

/* ─── Rental — image / copy split ─────────────────────────── */
function Rental() {
  const { t } = useTranslation();
  return (
    <section className="band-soft section-tight px-4 md:px-6">
      <div className="mx-auto grid max-w-[1200px] items-center gap-4 md:grid-cols-2">
        <motion.div
          {...fadeUpAt(0)}
          className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[28px] bg-pitch"
        >
          <img
            src={assetUrl(pocRental)}
            alt=""
            loading="lazy"
            width={1200}
            height={900}
            className="max-h-[78%] max-w-[78%] object-contain mix-blend-multiply"
          />
        </motion.div>
        <motion.div {...fadeUpAt(1)} className="px-2 md:px-6">
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
      </div>
    </section>
  );
}
