import { useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ChevronRight, Truck, Wrench, Package, Sparkles } from "lucide-react";
import { LocaleLink } from "@/components/LocaleLink";
import { SignalPulse } from "@/components/SignalPulse";
import heroImage from "@/assets/hero-rcd60-cutout.png";
import kitWide from "@/assets/product/radio-kit-wide.webp";
import kitWide800 from "@/assets/product/radio-kit-wide@800.webp";
import macroWide from "@/assets/product/radio-macro-wide.webp";
import macroWide800 from "@/assets/product/radio-macro-wide@800.webp";
import radiosPair from "@/assets/product/radios-pair.webp";
import radiosPair800 from "@/assets/product/radios-pair@800.webp";
// The grille macro that used to be a CDN pointer. This cutout is the same
// subject shot properly: alpha, so it can float on a tinted band.
import bentoDetail from "@/assets/radio-macro-cutout.webp";
import bentoDetail800 from "@/assets/radio-macro-cutout@800.webp";
import horecaImg from "@/assets/industry-horeca.jpg";
import constructionImg from "@/assets/industry-construction.jpg";
import securityImg from "@/assets/industry-security.jpg";
import { openLead } from "@/components/LeadFormSheet";
import { Section, SectionHead } from "@/components/Section";
import { BentoGrid, FeatureCard, StackedTile, ScrollRow, ScrollItem } from "@/components/apple";
import { ProductShot } from "@/components/ProductShot";
import { Magnetic } from "@/components/Magnetic";
import { visibleProducts } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { CountUp } from "@/components/CountUp";
import { spring, fadeUpAt } from "@/lib/springs";
import { gsap, useGsap } from "@/lib/motion";
import {
  SITE_SECTIONS,
  jsonLd,
  localeLinks,
  pageMeta,
  siteNavigationSchema,
  type SeoLang,
} from "@/lib/seo";
import { tFor } from "@/lib/i18n";

export const routeOptions = {
  head: ({ params }: { params: { lang: SeoLang } }) => {
    const t = tFor(params.lang);
    const title = t("meta.home.title");
    const description = t("meta.home.desc");

    return {
      meta: pageMeta({ lang: params.lang, title, description, path: "/" }),
      links: localeLinks(params.lang, "/"),
      // The section graph lives on the homepage: it is the page Google reads
      // hierarchy from when it generates sitelinks, and only here can the URLs
      // be locale-correct (the root route's head() has no params).
      scripts: [
        jsonLd(
          siteNavigationSchema(
            SITE_SECTIONS.map((sec) => ({
              name: t(`meta.section.${sec.key}_name`),
              description: t(`meta.section.${sec.key}_desc`),
              path: sec.path,
            })),
            params.lang,
          ),
        ),
      ],
    };
  },
  component: HomePage,
};

export function HomePage() {
  return (
    <div className="page-anim">
      <Hero />
      <Proof />
      <FeatureDark />
      <ValueShelf />
      <NetworkSplit />
      <IndustriesTeaser />
      <FeaturedCatalog />
      <FinalCta />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Hero — pinned, scrub-driven product hand-off

   The section holds still while the copy recedes and the radio grows into
   frame with the scrollbar. This is the apple.com opening move, and the reason
   it needs GSAP: Framer Motion can scrub, but pinning is what makes the
   sequence read as one continuous scene instead of two stacked ones.
   ───────────────────────────────────────────────────────────── */
function Hero() {
  const { t } = useTranslation();
  const scope = useRef<HTMLElement>(null);
  const title = t("home.hero.title");

  useGsap(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope.current,
          start: "top top",
          end: "+=90%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });
      tl.to("[data-hero-copy]", { y: -70, opacity: 0.15, ease: "none" }, 0).to(
        "[data-hero-art]",
        { scale: 1.18, y: -40, ease: "none" },
        0,
      );
    },
    scope,
    [],
  );

  return (
    <section ref={scope} className="relative overflow-hidden bg-pitch pt-28 md:pt-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[120vh]">
        <SignalPulse size={1400} opacity={0.28} />
      </div>

      <div data-hero-copy className="relative z-10 shell px-6 text-center md:px-10">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.05 }}
          className="eyebrow-sweep mb-5 text-[13px] font-medium tracking-wide"
        >
          {t("home.hero.eyebrow")}
        </motion.div>

        <h1 className="headline-hero text-crisp">
          {title.split(" ").map((w, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.1 + i * 0.04 }}
              className="mr-[0.25em] inline-block"
            >
              {w}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.35 }}
          className="subhead mx-auto mt-6 max-w-3xl text-lg md:text-2xl"
        >
          {t("home.hero.sub")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.45 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3 md:gap-4"
        >
          <Magnetic>
            <button
              onClick={() => openLead({ title: t("home.hero.cta_primary") })}
              className="pill pill-accent"
            >
              {t("home.hero.cta_primary")}
            </button>
          </Magnetic>
          <LocaleLink to="/radiocom" className="pill-link">
            {t("home.hero.cta_secondary")} <ChevronRight className="h-4 w-4" aria-hidden />
          </LocaleLink>
        </motion.div>
      </div>

      <div
        data-hero-art
        className="stage relative mt-6 h-[46vh] max-h-[680px] w-full md:mt-10 md:h-[62vh]"
      >
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <img
            src={heroImage}
            alt="Radiocom RCD-60 professional two-way radios"
            loading="eager"
            width={1600}
            height={1200}
            className="h-full w-auto max-w-[94vw] object-contain"
          />
        </div>
      </div>
    </section>
  );
}

/* ─── Proof bar — the numbers, stated plainly ─────────────── */
function Proof() {
  const { t } = useTranslation();
  const stats = [
    { n: 35, suffix: "+", label: t("stats.types") },
    { n: 10000, suffix: "+", label: t("stats.clients") },
    { n: 11, suffix: "", label: t("stats.years") },
  ];
  return (
    <section className="band-soft border-y border-border py-12 md:py-16">
      <div className="shell grid grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} {...fadeUpAt(i)} className="text-center">
            <div className="type-title text-[28px] font-semibold text-crisp md:text-[44px]">
              <CountUp to={s.n} />
              {s.suffix}
            </div>
            <div className="type-caption mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── Dark statement band ─────────────────────────────────── */
function FeatureDark() {
  const { t } = useTranslation();
  return (
    <section className="band-dark overflow-hidden py-28 text-center md:py-40">
      <div className="shell">
        <motion.h2
          {...fadeUpAt(0)}
          className="mx-auto max-w-4xl font-semibold leading-[1.05] tracking-[-0.03em]"
          style={{ fontSize: "clamp(2.25rem, 6vw, 4.5rem)" }}
        >
          {t("home.feature.title")}
        </motion.h2>
        <motion.p
          {...fadeUpAt(1)}
          className="mx-auto mt-5 max-w-2xl text-lg text-white/60 md:text-xl"
        >
          {t("home.feature.sub")}
        </motion.p>
        <motion.div {...fadeUpAt(2)} className="mt-8">
          <LocaleLink to="/poc" className="pill-link">
            {t("home.feature.link")} <ChevronRight className="h-4 w-4" aria-hidden />
          </LocaleLink>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Value shelf — a bento that closes ──────────────────── */
/**
 * Three rows of three. The wide tiles span two columns and the rest span one,
 * so every row fills exactly and the grid has no ragged edge — the earlier
 * version mixed a `tall` tile into a three-column grid, which left a step in
 * the right-hand column.
 *
 * The two wide tiles put their photograph *beside* the copy rather than behind
 * it. A backdrop image under a headline is only safe when the art has dead
 * space where the text lands, and a flat-lay does not.
 */
function ValueShelf() {
  const { t } = useTranslation();
  const openTest = () => openLead({ title: t("lead.title") });

  return (
    <Section band="soft" tight>
      <SectionHead
        align="left"
        spacing="tight"
        eyebrow={t("home.bento.eyebrow")}
        title={t("home.bento.title")}
        sub={t("home.bento.sub")}
      />
      <BentoGrid>
        {/* Rows 1-2, cols 1-2 — the lead tile: copy, then the kit photograph
            below it running the card's full width. */}
        <StackedTile
          idx={0}
          span={2}
          tall
          eyebrow={t("home.bento.warranty.title")}
          title={t("home.bento.warranty.sub")}
          className="col-span-1 sm:col-span-2"
        >
          <ProductShot
            src={kitWide}
            srcSmall={kitWide800}
            alt=""
            width={1600}
            height={900}
            sizes="(max-width: 640px) 86vw, (max-width: 1024px) 88vw, 700px"
            className="w-full self-end"
            imgClassName="object-bottom"
          />
        </StackedTile>

        {/* Rows 1-2, col 3 — the tall trade-in card. The vertical pair shot
            bleeds to the rounded edge behind the copy. */}
        <FeatureCard
          idx={1}
          tall
          eyebrow={t("home.bento.tradein.title")}
          title={t("home.bento.tradein.sub")}
          className="min-h-[260px]"
          copyClassName="pr-10"
          action={{ label: t("lead.title"), onClick: openTest }}
          backdrop={
            <ProductShot
              src={radiosPair}
              srcSmall={radiosPair800}
              alt=""
              width={1226}
              height={1632}
              fit="cover"
              sizes="(max-width: 1024px) 88vw, 380px"
              className="absolute inset-x-0 bottom-0 top-[52%]"
              imgClassName="object-top"
            />
          }
        />

        {/* Row 3 — three equal tiles. */}
        {[
          { key: "delivery", Icon: Truck },
          { key: "test", Icon: Sparkles },
          { key: "models", Icon: Package },
        ].map((it, i) => (
          <FeatureCard
            key={it.key}
            idx={i + 2}
            eyebrow={t(`home.bento.${it.key}.title`)}
            title={t(`home.bento.${it.key}.sub`)}
            className="min-h-[260px]"
            media={<it.Icon className="h-10 w-10 text-signal" strokeWidth={1.5} aria-hidden />}
          />
        ))}

        {/* Row 4 — the one dark tile, then the workshop close. */}
        <FeatureCard
          idx={5}
          tone="dark"
          eyebrow={t("home.bento.service.title")}
          title={t("home.bento.service.sub")}
          className="min-h-[260px]"
          media={<Wrench className="h-10 w-10 text-white" strokeWidth={1.5} aria-hidden />}
        />
        <FeatureCard
          idx={6}
          span={2}
          eyebrow={t("home.feature.title")}
          title={t("home.feature.sub")}
          className="min-h-[260px]"
          copyClassName="max-w-[52%] lg:max-w-[46%]"
          backdrop={
            <ProductShot
              src={macroWide}
              srcSmall={macroWide800}
              alt=""
              width={1600}
              height={900}
              fit="cover"
              sizes="(max-width: 1024px) 88vw, 620px"
              className="absolute inset-y-0 right-0 w-[52%]"
            />
          }
        />
      </BentoGrid>
    </Section>
  );
}

/* ─── Network design — image / copy split ─────────────────── */
function NetworkSplit() {
  const { t } = useTranslation();
  return (
    <Section band="plain" tight>
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          {...fadeUpAt(0)}
          className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-charcoal md:aspect-auto md:min-h-[440px]"
        >
          <img
            src={bentoDetail}
            alt=""
            loading="lazy"
            width={1400}
            height={1400}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </motion.div>
        <motion.div
          {...fadeUpAt(1)}
          className="relative flex flex-col justify-center overflow-hidden rounded-[28px] bg-charcoal p-10 md:p-14"
        >
          <SignalPulse size={700} opacity={0.15} className="!items-end !justify-end" />
          <div className="eyebrow-sweep relative mb-4 text-[13px] font-medium tracking-wide">
            {t("home.bento.network.eyebrow")}
          </div>
          <h3 className="type-headline relative text-crisp">{t("home.bento.network.title")}</h3>
          <p className="subhead relative mt-5 max-w-md text-[15px] md:text-base">
            {t("home.bento.network.sub")}
          </p>
          <LocaleLink to="/poc" className="pill-link relative mt-6">
            {t("home.feature.link")} <ChevronRight className="h-4 w-4" aria-hidden />
          </LocaleLink>
        </motion.div>
      </div>
    </Section>
  );
}

/* ─── Industries — full-bleed image cards ─────────────────── */
function IndustriesTeaser() {
  const { t } = useTranslation();
  const items = [
    { slug: "horeca" as const, img: horecaImg },
    { slug: "construction" as const, img: constructionImg },
    { slug: "security" as const, img: securityImg },
  ];
  return (
    <Section band="soft" tight>
      <div>
        <SectionHead
          align="left"
          spacing="tight"
          eyebrow={t("industries.kicker")}
          title={t("industries.title")}
          sub={t("industries.overview_sub")}
          link={{ label: t("industries.view_all"), to: "/industries" }}
        />
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((it, i) => (
            <motion.div key={it.slug} {...fadeUpAt(i)}>
              <LocaleLink
                to="/industries/$slug"
                params={{ slug: it.slug }}
                className="group relative block aspect-[3/4] overflow-hidden rounded-[28px] bg-charcoal"
              >
                <img
                  src={it.img}
                  alt=""
                  loading="lazy"
                  width={1200}
                  height={1600}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <h3 className="text-[26px] font-semibold leading-tight tracking-[-0.02em] text-white">
                    {t(`industries.${it.slug}.name`)}
                  </h3>
                  <span className="mt-2 inline-flex items-center gap-1 text-[14px] text-white/85">
                    {t("industries.cta_secondary", { defaultValue: t("product.more") })}
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  </span>
                </div>
              </LocaleLink>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── Featured catalogue shelf ────────────────────────────── */
function FeaturedCatalog() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language.slice(0, 2) as "ru" | "en" | "uz") || "ru";
  const picked = ["rcd-60", "rcd-70", "m-t82-extreme", "m-xt420"]
    .map((id) => visibleProducts.find((p) => p.id === id))
    .filter(Boolean) as typeof visibleProducts;
  const featured = picked.length >= 4 ? picked.slice(0, 4) : visibleProducts.slice(0, 4);

  return (
    <Section band="plain" tight>
      <div>
        <SectionHead
          align="left"
          spacing="tight"
          eyebrow={t("home.featured.eyebrow")}
          title={t("home.featured.title")}
          link={{ label: t("home.featured.link"), to: "/radiocom" }}
        />
        <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.id} p={p} lang={lang} idx={i} />
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─── Closing CTA ─────────────────────────────────────────── */
function FinalCta() {
  const { t } = useTranslation();
  return (
    <section className="band-dark px-6 py-28 text-center md:px-10 md:py-40">
      <div className="shell">
        <motion.h2
          {...fadeUpAt(0)}
          className="mx-auto max-w-3xl font-semibold leading-[1.05] tracking-[-0.03em]"
          style={{ fontSize: "clamp(2.25rem, 6vw, 4.5rem)" }}
        >
          {t("home.final_cta.title")}
        </motion.h2>
        <motion.p {...fadeUpAt(1)} className="mx-auto mt-4 max-w-2xl text-lg text-white/60">
          {t("home.final_cta.sub")}
        </motion.p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Magnetic>
            <button
              onClick={() => openLead({ title: t("home.final_cta.button") })}
              className="pill"
              style={{ background: "#fff", color: "#000" }}
            >
              {t("home.final_cta.button")}
            </button>
          </Magnetic>
          <LocaleLink to="/service" className="pill-link">
            {t("nav.service")} <ChevronRight className="h-4 w-4" aria-hidden />
          </LocaleLink>
        </div>
      </div>
    </section>
  );
}
