import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { LocaleLink } from "@/components/LocaleLink";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { products } from "@/data/products";
import { CountUp } from "@/components/CountUp";
import { ProductShot } from "@/components/ProductShot";
import { SectionHead } from "@/components/Section";
import { fadeUpAt, spring } from "@/lib/springs";
import rcdFrontBack from "@/assets/product/rcd-front-back.webp";
import radiosPair from "@/assets/product/radios-pair.webp";

/**
 * Authorised distribution, staged the way apple.com stages a lineup.
 *
 * Not a row of cards. Apple gives each product its own full-width chapter and
 * alternates which side the photograph sits on, so the page reads as a rhythm
 * rather than a grid of boxes, and each brand gets the whole width of the
 * screen instead of half a card. Two cards side by side is what made the
 * earlier version look generated: whatever you put in them, they mirror each
 * other.
 *
 * The bands alternate white and grey rather than light and dark. These are
 * studio shots on a white sweep, and the multiply that removes that sweep only
 * works on a light ground — on a dark band the sweep survives as a white slab.
 * Apple's own product chapters are overwhelmingly light for the same reason.
 */
const BRANDS = [
  {
    key: "Radiocom RC" as const,
    i18n: "rc",
    shot: rcdFrontBack,
    w: 1600,
    h: 2212,
    band: "band-plain",
  },
  { key: "Motorola" as const, i18n: "mot", shot: radiosPair, w: 1226, h: 1632, band: "band-soft" },
];

export function BrandsStrip() {
  const { t } = useTranslation();

  // The marquee shows real catalogue photography. Duplicated once so the
  // translateX(-50%) loop in `marquee-track` meets itself seamlessly.
  const shots = products.filter((p) => p.image).slice(0, 12);
  const loop = [...shots, ...shots];

  return (
    <>
      <section className="band-plain section-tight pb-0">
        <div className="shell">
          <SectionHead
            align="center"
            spacing="tight"
            eyebrow={t("brands_title")}
            title={t("brands.headline")}
            sub={t("brands.sub")}
          />
        </div>
      </section>

      {BRANDS.map((b, i) => {
        const count = products.filter((p) => p.brand === b.key).length;
        const flip = i % 2 === 1;
        return (
          <section key={b.key} className={`${b.band} overflow-hidden py-16 md:py-24`}>
            <div className="shell">
              <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
                <motion.div
                  {...fadeUpAt(0)}
                  className={flip ? "md:order-2 md:pl-6" : "md:order-1 md:pr-6"}
                >
                  <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-signal">
                    <BadgeCheck className="h-4 w-4" aria-hidden />
                    {t("brands.official")}
                  </div>

                  <h3 className="type-display mt-5 text-crisp">{b.key}</h3>

                  <p className="subhead mt-5 max-w-md text-[17px]">{t(`brands.${b.i18n}_desc`)}</p>

                  <div className="mt-10 flex items-end gap-10">
                    <div>
                      <div className="text-5xl font-semibold tracking-tight text-crisp md:text-6xl">
                        <CountUp to={count} />
                      </div>
                      <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-cool">
                        {t("brands.models")}
                      </div>
                    </div>
                    <LocaleLink to="/catalog" className="pill-link mb-1 shrink-0">
                      {t("brands.view")} <ArrowRight className="h-4 w-4" aria-hidden />
                    </LocaleLink>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ ...spring, duration: 0.7 }}
                  className={flip ? "md:order-1" : "md:order-2"}
                >
                  <ProductShot
                    src={b.shot}
                    alt={b.key}
                    width={b.w}
                    height={b.h}
                    shadow
                    sizes="(max-width: 768px) 88vw, 46vw"
                    className="h-[340px] w-full md:h-[460px]"
                  />
                </motion.div>
              </div>
            </div>
          </section>
        );
      })}

      {/* The full range, shown rather than listed. */}
      <section className="band-plain pb-20 pt-6 md:pb-28">
        <div className="group relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-pitch to-transparent md:w-32" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-pitch to-transparent md:w-32" />

          <div className="marquee-track flex gap-4 will-change-transform">
            {loop.map((p, i) => (
              <div
                key={`${p.id}-${i}`}
                className="flex h-[124px] w-[124px] shrink-0 items-center justify-center rounded-3xl bg-charcoal p-4 transition-colors duration-300 hover:bg-[#ececef]"
              >
                <img
                  src={p.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={124}
                  height={124}
                  className="h-full w-full object-contain mix-blend-multiply"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
