import { Fragment, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";
import { LocaleLink } from "@/components/LocaleLink";
import { brandCase } from "@/lib/brand";
import { SignalPulse } from "@/components/SignalPulse";
// The hero cutout was a 590 KB RGBA PNG and the LCP element on the home page —
// on its own it was more than half the page's weight and held LCP at 6.3s.
// WebP carries the same alpha at 68 KB, with a 316px candidate for phones.
import heroImage from "@/assets/hero-rcd60-cutout.webp";
import heroImage800 from "@/assets/hero-rcd60-cutout@800.webp";
// The cutout set. Every one of these was previously a studio photograph with a
// backdrop — #f9f9f9 on the kit flat-lay, #dae3e7 on the macro — which is why
// the cards around them needed grey panels and blend modes to stop the
// backdrop reading as a pasted-on rectangle. With real alpha the panels go and
// the product sits on the band directly.
//
// They are also cropped to their subject: the source frames carried up to 75%
// transparent margin, so a radio that looked small in its slot was small in the
// file, not in the layout.
// The grille macro that used to be a CDN pointer. This cutout is the same
// subject shot properly: alpha, so it can float on a tinted band.
// Hands presenting a sealed RCD-70 PRO box, plus a hand offering the radio —
// the delivery claim, photographed. Shared with the brand pages, which use the
// same frame for the warranty card.
import { YEARS_TRADING } from "@/lib/seo";
import { INDUSTRY_IMAGE_SRCSET, INDUSTRY_IMAGES } from "@/data/industry-images";
import { INDUSTRY_SLUGS } from "@/data/industries";
import { openLead } from "@/components/LeadFormSheet";
import { WhyUs } from "@/components/WhyUs";
import { Section, SectionHead } from "@/components/Section";
import { BentoGrid, FeatureCard, StackedTile } from "@/components/apple";
import { ProductShot } from "@/components/ProductShot";
import { Magnetic } from "@/components/Magnetic";
import { visibleProducts } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { CountUp } from "@/components/CountUp";
import { TrustedBy } from "@/components/TrustedBy";
import { spring, fadeUpAt } from "@/lib/springs";
import { DESKTOP, useGsap, useScrollChoreography } from "@/lib/motion";

export function HomePage() {
  const page = useScrollChoreography();

  return (
    <div ref={page} className="page-anim">
      {/* Six sections, in the order a customer actually asks things.

          What is this / are you real -> what do I need it for -> which models
          and what do they cost -> why buy here -> who else trusts you.

          It was nine, and three of them said what another already had:
          `FeatureDark` printed the same two strings the bento reprinted lower
          down, `NetworkSplit` was a compressed copy of the PoC page's own
          network section, and `FinalCta` made the same ask as the ContactBlock
          rendered directly beneath this component by the root layout. The five
          promises that were scattered across the bento now live in `WhyUs`,
          which the brand pages share rather than restate. */}
      <Hero />
      <Proof />
      <IndustriesTeaser />
      <FeaturedCatalog />
      <WhyUs />
      <TrustedBy />
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
  // Two lines, in this order, because that is the reading the client asked
  // for: the adjective lands first and the product follows it. Two keys
  // rather than one string with a separator, so a translator can see where
  // the break falls instead of having to encode it.
  const lines = [t("home.hero.title_a"), t("home.hero.title_b")];

  useGsap(
    // `gsap` arrives through the callback rather than a module import: it is
    // loaded on demand, so a static import here would put it back in this
    // page's chunk and undo the split.
    ({ gsap }) => {
      // Desktop only. On a phone this pinned for 90% of the viewport — 760px of
      // thumb-scrolling during which the page appears not to move, and 760px of
      // blank pin-spacer in any full-page capture. `matchMedia` builds the
      // trigger only above 768px and reverts it cleanly on rotation.
      gsap.matchMedia().add(DESKTOP, () => {
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
      });
    },
    scope,
    [],
    // Gate the *download*, not just the trigger. `matchMedia` inside the
    // callback still costs a phone the 27 KB chunk before deciding it wants
    // none of it; this was the one route still fetching GSAP at 390px.
    DESKTOP,
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
          {lines.map((line, li) => (
            // `block`, so the second line always starts on its own row rather
            // than wherever the first happens to run out. The word spans stay
            // per-line so the reveal still plays left to right across both.
            <Fragment key={li}>
              {/* Whitespace between two block-level lines collapses to nothing
                  visually, but it is the only thing separating the two halves of
                  the h1 in textContent — without it the title extracts as
                  "Несокрушимые,профессиональные рации." */}
              {li > 0 && " "}
              <span className="block">
                {line.split(" ").map((w, i) => (
                  <Fragment key={i}>
                    {/* A real space, not a margin. See the note in WordReveal:
                      faking the gap in CSS served this h1 to crawlers and
                      screen readers as one unbroken word. */}
                    {i > 0 && " "}
                    <motion.span
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...spring, delay: 0.1 + (li * 2 + i) * 0.04 }}
                      className="inline-block"
                    >
                      {w}
                    </motion.span>
                  </Fragment>
                ))}
              </span>
            </Fragment>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.35 }}
          className="subhead mx-auto mt-6 max-w-3xl text-lg md:text-2xl"
        >
          {brandCase(t("home.hero.sub"))}
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
            srcSet={`${heroImage800} 316w, ${heroImage} 597w`}
            sizes="(min-width: 768px) 597px, 94vw"
            alt="Radiocom RCD-60 professional two-way radios"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            width={597}
            height={753}
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
    { n: YEARS_TRADING, suffix: "", label: t("stats.years") },
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
function IndustriesTeaser() {
  const { t } = useTranslation();
  // All six, driven from the shared map rather than three hand-picked imports.
  // The subheading has always promised "6 ключевых отраслей" while the grid
  // showed three, and this is the section a customer is most likely to use as
  // their way in — it answers "what is this for" before "what is it called".
  const items = INDUSTRY_SLUGS.map((slug) => ({ slug, img: INDUSTRY_IMAGES[slug] }));
  return (
    <Section band="soft">
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
                  /* From the shared map, which carries the 400w rung as well.
                     A phone at DPR 1 in this 346px slot now takes the 400px
                     file instead of the 800px one. */
                  srcSet={INDUSTRY_IMAGE_SRCSET[it.slug]}
                  sizes="(min-width: 768px) 456px, 92vw"
                  alt=""
                  loading="lazy"
                  width={1400}
                  height={900}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <h3 className="text-[26px] font-semibold leading-tight tracking-[-0.02em] text-white">
                    {t(`industries.${it.slug}.name`)}
                  </h3>
                  <span className="mt-2 inline-flex items-center gap-1 text-[14px] text-white/85">
                    {t("product.more")}
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
    <Section band="plain">
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
