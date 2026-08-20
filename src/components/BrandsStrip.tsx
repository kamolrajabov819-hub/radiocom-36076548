import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { LocaleLink } from "@/components/LocaleLink";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { products } from "@/data/products";
import { CountUp } from "@/components/CountUp";
import { ProductShot } from "@/components/ProductShot";
import { Section, SectionHead } from "@/components/Section";
import { spring } from "@/lib/springs";
import rcdFrontBack from "@/assets/product/rcd-front-back.webp";
import radiosPair from "@/assets/product/radios-pair.webp";

/**
 * Authorised distribution.
 *
 * The previous version read as generic because the two brands were rendered
 * identically: two white cards on a white page, distinguished only by the
 * brand name set in plain type, over a decorative sine wave that animated once
 * and then sat frozen, above a marquee of text-only chips.
 *
 * Three changes fix that. The panels are no longer mirror images — one is dark,
 * one light, which is how apple.com separates two things it is presenting side
 * by side. Each carries the product rather than only its name. And the marquee
 * shows the radios themselves, so the strip reads as a catalogue rather than a
 * wall of words.
 */
const BRANDS = [
  { key: "Radiocom RC" as const, i18n: "rc", shot: rcdFrontBack, tone: "dark" as const },
  { key: "Motorola" as const, i18n: "mot", shot: radiosPair, tone: "light" as const },
];

export function BrandsStrip() {
  const { t } = useTranslation();

  // The marquee shows real catalogue photography. Duplicated once so the
  // translateX(-50%) loop in `marquee-track` meets itself seamlessly.
  const shots = products.filter((p) => p.image).slice(0, 12);
  const loop = [...shots, ...shots];

  return (
    <Section band="plain" tight>
      <SectionHead
        align="center"
        spacing="tight"
        eyebrow={t("brands_title")}
        title={t("brands.headline")}
        sub={t("brands.sub")}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        {BRANDS.map((b, i) => {
          const count = products.filter((p) => p.brand === b.key).length;
          const dark = b.tone === "dark";
          return (
            <motion.div
              key={b.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ ...spring, delay: i * 0.08 }}
              className={`group card-interactive relative flex min-h-[420px] flex-col overflow-hidden rounded-[28px] p-8 text-left md:p-10 ${
                dark ? "is-dark bg-black text-[#f5f5f7]" : "bg-charcoal text-crisp"
              }`}
            >
              <div
                className={`relative inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] ${
                  dark ? "text-white" : "text-signal"
                }`}
              >
                <BadgeCheck className="h-4 w-4" aria-hidden />
                {t("brands.official")}
              </div>

              <div className="headline relative mt-4 text-3xl tracking-tight md:text-5xl">
                {b.key}
              </div>
              <p
                className={`relative mt-3 max-w-sm text-[15px] leading-relaxed ${
                  dark ? "text-white/70" : "text-cool"
                }`}
              >
                {t(`brands.${b.i18n}_desc`)}
              </p>

              {/*
                The product sits on its own light plate rather than floating on
                the card. These are studio shots on a white sweep, and the
                multiply that knocks that white out only works against a light
                ground — blended onto the black card the sweep survives as a
                white rectangle. The plate also keeps the photo clear of the
                copy, which it used to overlap.
              */}
              <div
                className={`relative mt-8 min-h-[210px] flex-1 overflow-hidden rounded-3xl ${
                  dark ? "bg-[#f5f5f7]" : "bg-pitch"
                }`}
              >
                <ProductShot
                  src={b.shot}
                  alt=""
                  width={1600}
                  height={2212}
                  sizes="(max-width: 768px) 80vw, 460px"
                  className="absolute inset-0 h-full w-full p-5"
                  imgClassName="object-contain"
                />
              </div>

              <div className="relative flex items-end justify-between gap-4 pt-8">
                <div>
                  <div className="text-4xl font-semibold tracking-tight md:text-5xl">
                    <CountUp to={count} />
                  </div>
                  <div
                    className={`mt-1 text-[11px] uppercase tracking-[0.18em] ${
                      dark ? "text-white/50" : "text-cool"
                    }`}
                  >
                    {t("brands.models")}
                  </div>
                </div>
                <LocaleLink
                  to="/catalog"
                  className={`pill-link shrink-0 ${dark ? "!text-white" : "text-signal"}`}
                >
                  {t("brands.view")} <ArrowRight className="h-4 w-4" aria-hidden />
                </LocaleLink>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Catalogue marquee — the range, shown rather than listed. */}
      <div className="group relative mt-10">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-pitch to-transparent md:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-pitch to-transparent md:w-32" />

        <div className="marquee-track flex gap-4 will-change-transform">
          {loop.map((p, i) => (
            <div
              key={`${p.id}-${i}`}
              className="flex h-[132px] w-[132px] shrink-0 items-center justify-center rounded-3xl bg-charcoal p-4 transition-colors duration-300 hover:bg-[#ececef]"
            >
              <img
                src={p.image}
                alt=""
                loading="lazy"
                decoding="async"
                width={132}
                height={132}
                className="h-full w-full object-contain mix-blend-multiply"
              />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
