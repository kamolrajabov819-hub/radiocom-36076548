import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LocaleLink } from "@/components/LocaleLink";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { products } from "@/data/products";
import { CountUp } from "@/components/CountUp";
import { ProductShot } from "@/components/ProductShot";
import { SectionHead } from "@/components/Section";
import { spring, springFast } from "@/lib/springs";
import rcdFrontBack from "@/assets/product/rcd-front-back.webp";
import radiosPair from "@/assets/product/radios-pair.webp";

/**
 * Authorised distribution, as a switcher rather than a list.
 *
 * Two brands presented side by side — as cards or as stacked chapters — read as
 * filler however they are styled, because the second half only repeats the
 * shape of the first. Apple solves the same problem by making the lineup
 * something you operate: one stage, a segmented control, and the product,
 * count and range all changing under it.
 *
 * The control is real `<button>`s carrying `aria-pressed`, per the UX rules for
 * compact controls: a clickable div with a class on it is not a control. State
 * is set directly rather than waiting on a transition to finish, so a fast
 * double-switch cannot leave the stage showing one brand and the copy another.
 */
const BRANDS = [
  { key: "Radiocom RC" as const, i18n: "rc", shot: rcdFrontBack, w: 1600, h: 2212 },
  { key: "Motorola" as const, i18n: "mot", shot: radiosPair, w: 1226, h: 1632 },
];

export function BrandsStrip() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const brand = BRANDS[active];

  const models = products.filter((p) => p.brand === brand.key);

  return (
    <section className="band-soft section-tight overflow-hidden">
      <div className="shell">
        <SectionHead
          align="center"
          spacing="tight"
          eyebrow={t("brands_title")}
          title={t("brands.headline")}
          sub={t("brands.sub")}
        />

        {/* Segmented control — apple.com's model picker. */}
        <div
          role="group"
          aria-label={t("brands.headline")}
          className="mx-auto mb-10 flex w-fit items-center gap-1 rounded-full bg-pitch p-1 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
        >
          {BRANDS.map((b, i) => {
            const on = i === active;
            return (
              <button
                key={b.key}
                type="button"
                aria-pressed={on}
                onClick={() => setActive(i)}
                className={`relative rounded-full px-5 py-2.5 text-[15px] font-medium transition-colors duration-200 md:px-7 ${
                  on ? "text-white" : "text-cool hover:text-crisp"
                }`}
              >
                {on ? (
                  <motion.span
                    layoutId="brand-pill"
                    transition={springFast}
                    className="absolute inset-0 rounded-full bg-crisp"
                  />
                ) : null}
                <span className="relative">{b.key}</span>
              </button>
            );
          })}
        </div>

        {/* Stage — product left, the brand's case right. */}
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-14">
          <div className="relative h-[300px] md:h-[420px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={brand.key}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={spring}
                className="absolute inset-0"
              >
                <ProductShot
                  src={brand.shot}
                  alt={brand.key}
                  width={brand.w}
                  height={brand.h}
                  shadow
                  sizes="(max-width: 768px) 88vw, 46vw"
                  className="h-full w-full"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={brand.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={spring}
            >
              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-signal">
                <BadgeCheck className="h-4 w-4" aria-hidden />
                {t("brands.official")}
              </div>

              <h3 className="type-headline mt-4 text-crisp">{brand.key}</h3>

              <p className="subhead mt-4 max-w-md text-[17px]">{t(`brands.${brand.i18n}_desc`)}</p>

              <div className="mt-8 flex items-end gap-10">
                <div>
                  <div className="text-5xl font-semibold tracking-tight text-crisp">
                    <CountUp to={models.length} />
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-cool">
                    {t("brands.models")}
                  </div>
                </div>
                <LocaleLink to="/catalog" className="pill-link mb-1 shrink-0">
                  {t("brands.view")} <ArrowRight className="h-4 w-4" aria-hidden />
                </LocaleLink>
              </div>

              {/* The switched brand's actual range, not a generic strip. */}
              <ul className="mt-8 flex flex-wrap gap-2">
                {models.slice(0, 6).map((m) => (
                  <li
                    key={m.id}
                    className="rounded-full bg-pitch px-4 py-2 text-[13px] text-cool transition-colors duration-300 hover:text-crisp"
                  >
                    {m.name.replace(/^(Motorola|Radiocom) /, "")}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
