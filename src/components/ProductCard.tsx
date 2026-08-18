import { motion } from "framer-motion";
import { LocaleLink } from "@/components/LocaleLink";
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
          to="/catalog/$id"
          params={{ id: p.id }}
          aria-label={p.name}
          className="relative flex h-full w-full flex-col overflow-hidden rounded-[20px] bg-popover p-6 md:p-7 text-left shadow-[0_1px_3px_rgba(0,0,0,0.06)] ring-1 ring-border transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)]"
        >
          <span className="pointer-events-none absolute inset-x-0 -top-1/2 h-[200%] translate-x-[-120%] rotate-12 bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--signal)_10%,transparent),transparent)] transition-transform duration-[900ms] ease-out group-hover:translate-x-[120%]" />

          <span className="inline-flex w-fit items-center rounded-full bg-charcoal px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-cool">
            {p.brand}
          </span>

          <h3 className="mt-3 line-clamp-2 text-[19px] md:text-[21px] font-semibold leading-tight tracking-tight text-crisp">
            {p.name}
          </h3>

          <div className="relative my-7 flex flex-1 items-center justify-center">
            <div className="pointer-events-none absolute inset-0 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_55%,color-mix(in_oklab,var(--signal)_22%,transparent),transparent_70%)]" />
            <img
              src={p.image}
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

          <div className="mt-auto flex items-end justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[13px] leading-snug text-cool">{pick(p.rangeCity, lang)}</div>
              <div className="mt-1 text-[15px] font-medium text-crisp">
                {formatPrice(p.price, lang)}
              </div>
            </div>
            <span className="pill pill-accent pill-sm shrink-0">{t("product.more")}</span>
          </div>
        </LocaleLink>
      </TiltCard>
    </motion.div>
  );
}
