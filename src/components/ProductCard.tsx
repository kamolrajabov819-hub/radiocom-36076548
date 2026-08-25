import { motion } from "framer-motion";
import { LocaleLink } from "@/components/LocaleLink";
import { brandCase } from "@/lib/brand";
import { useTranslation } from "react-i18next";
import { formatPrice, type Product } from "@/data/products";
import { pick } from "@/data/spec-dict";
import { spring } from "@/lib/springs";
import { TiltCard } from "@/components/TiltCard";

/**
 * Apple "All models" style product card:
 * name on top, product photo centered in a rounded well, price + CTA pill at the bottom.
 *
 * The whole card is a link to the product page — the same affordance apple.com uses
 * on its "All models" grid.
 */
export function ProductCard({
  p,
  lang,
  idx = 0,
}: {
  p: Product;
  lang: "ru" | "en" | "uz";
  idx?: number;
}) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ ...spring, delay: (idx % 8) * 0.05 }}
      className="group h-full"
    >
      <TiltCard className="h-full" max={5}>
        <LocaleLink
          to="/$brand/$model"
          params={{ brand: p.brandSlug, model: p.slug }}
          aria-label={p.name}
          className="relative flex h-full w-full flex-col overflow-hidden rounded-[20px] bg-popover p-6 md:p-7 text-left shadow-[0_1px_3px_rgba(0,0,0,0.06)] ring-1 ring-border transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)]"
        >
          <span className="pointer-events-none absolute inset-x-0 -top-1/2 h-[200%] translate-x-[-120%] rotate-12 bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--signal)_10%,transparent),transparent)] transition-transform duration-[900ms] ease-out group-hover:translate-x-[120%]" />

          <span className="inline-flex w-fit items-center rounded-full bg-charcoal px-2.5 py-1 text-[12px] font-medium uppercase tracking-wider text-cool">
            {p.brand}
          </span>

          <h3 className="mt-3 line-clamp-2 text-[19px] md:text-[21px] font-semibold leading-tight tracking-tight text-crisp">
            {brandCase(p.name)}
          </h3>

          <div className="relative my-7 flex flex-1 items-center justify-center">
            <div className="pointer-events-none absolute inset-0 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_55%,color-mix(in_oklab,var(--signal)_22%,transparent),transparent_70%)]" />
            <img
              src={p.image}
              /* The card renders this at 180-210px tall — roughly 187px wide —
                 and it had no `srcSet` and no `sizes` at all, so every card
                 downloaded the full 1080px or 1600px product photo. Measured on
                 a fully-scrolled home page that was 516 KB across eight files,
                 the largest 8.6x wider than the slot it lands in. Lighthouse
                 never reported it because its run does not scroll far enough to
                 load them.

                 Both DPR 1 and DPR 2 want the 400w candidate here, so this is
                 the rare case where the small file is also the correct one. */
              srcSet={
                p.imageSmall
                  ? [
                      p.imageTiny && `${p.imageTiny} 400w`,
                      `${p.imageSmall} 800w`,
                      `${p.image} 1600w`,
                    ]
                      .filter(Boolean)
                      .join(", ")
                  : undefined
              }
              /* A flat 260px, measured rather than guessed: the widest this
                 image ever renders is 253px, on a 390px viewport where the card
                 is nearly full-bleed. Declaring the breakpoint-shaped
                 "240px / 200px" under-stated it, and at DPR 2 that made the
                 browser pick 400w where it needed 800w — trading sharpness for
                 bytes, which is not the trade. At 260px, DPR 1 picks 400w and
                 DPR 2 picks 800w, which is right on both. */
              sizes={p.imageSmall ? "260px" : undefined}
              alt={p.name}
              width={1024}
              height={1024}
              loading="lazy"
              className={`relative h-[180px] md:h-[210px] w-auto max-w-[85%] object-contain mix-blend-multiply transition-all duration-700 ease-out group-hover:scale-[1.06] ${
                p.gallery?.length ? "group-hover:opacity-0" : ""
              }`}
              style={{ transform: "translateZ(40px)" }}
            />
            {p.gallery?.length ? (
              <img
                src={p.gallery[0]}
                /* Same 187px slot as the card's main shot, and it had the same
                   problem: the full 1080px kit photo fetched for a decorative
                   hover state. It is `aria-hidden` and purely visual, so the
                   400w file is all it ever needs. */
                srcSet={
                  p.galleryTiny?.[0] && p.gallerySmall?.[0]
                    ? `${p.galleryTiny[0]} 400w, ${p.gallerySmall[0]} 800w, ${p.gallery[0]} 1600w`
                    : p.galleryTiny?.[0]
                      ? `${p.galleryTiny[0]} 400w, ${p.gallery[0]} 1600w`
                      : undefined
                }
                sizes={p.galleryTiny?.[0] ? "260px" : undefined}
                alt=""
                loading="lazy"
                width={1024}
                height={1024}
                aria-hidden
                className="pointer-events-none absolute inset-0 m-auto h-[180px] md:h-[210px] w-auto max-w-[85%] object-contain mix-blend-multiply opacity-0 transition-all duration-700 ease-out group-hover:scale-[1.06] group-hover:opacity-100"
              />
            ) : null}
            {p.gallery?.length ? (
              <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 gap-1.5">
                {[p.image, ...p.gallery].slice(0, 4).map((_, di) => (
                  <span
                    key={di}
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${di === 0 ? "bg-crisp/40 group-hover:bg-crisp/20" : "bg-crisp/15 group-hover:bg-signal"}`}
                  />
                ))}
              </div>
            ) : null}
          </div>

          {/* Stacked below `sm`, side by side above it.
          
              Side by side at 390px the pill takes ~150 of the card's 258px of
              inner width, leaving 108px for a range figure and a price — and
              the price list's city figures are long ("до 2 км в городе"), so
              both wrapped to two lines each and the card's foot turned into
              four cramped rows. Stacking gives each the full width. */}
          <div className="mt-auto flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <div className="text-[13px] leading-snug text-cool">{pick(p.rangeCity, lang)}</div>
              <div className="mt-1 text-[15px] font-medium text-crisp">
                {formatPrice(p.price, lang)}
              </div>
            </div>
            <span className="pill pill-sm pill-accent shrink-0">{t("product.more")}</span>
          </div>
        </LocaleLink>
      </TiltCard>
    </motion.div>
  );
}
