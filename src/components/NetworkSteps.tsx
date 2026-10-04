import { useTranslation } from "react-i18next";
import { Check, Coins, Layers, MapPin, Radio } from "lucide-react";
import { Section, SectionHead } from "@/components/Section";
import { HighlightsShelf } from "@/components/apple";

/**
 * The five steps of a radio network project, from the site visit to handover.
 * Moved here from the PoC page when the keyword map gave «организация
 * радиосвязи» to /solutions; the strings stay `poc.design.*`.
 *
 * Original note:
 *
 * Five steps do not divide into a three-column grid, and the earlier attempts
 * both showed it: first as a grid with an empty cell in the second row, then as
 * a list, which turned a five-beat sequence into a wall of rules.
 *
 * A shelf is what apple.com uses when the count does not fit the grid — the
 * cards run off the right edge and scroll, so the layout never has to resolve
 * into rows at all. Each card carries its step number as a large ghost numeral
 * behind the copy, which is the sequence made visible rather than stated.
 *
 * It uses `HighlightsShelf` now rather than a hand-rolled `overflow-x-auto`:
 * that component already owns the arrows, the scroll-position sync, the
 * focusable region and the accessible name this row was reimplementing.
 */
export function NetworkSteps() {
  const { t } = useTranslation();
  const steps = (t("poc.design.steps", { returnObjects: true }) as string[]) || [];
  const icons = [MapPin, Layers, Radio, Check, Coins];

  return (
    <Section band="soft">
      <SectionHead align="left" eyebrow={t("poc.design.kicker")} title={t("poc.design.title")} />
      <HighlightsShelf label={t("poc.design.title")}>
        {steps.map((step, i) => {
          const Icon = icons[i] ?? Check;
          return (
            <article
              key={step}
              className="card-interactive group relative flex min-h-[360px] w-[78vw] shrink-0 snap-start flex-col overflow-hidden rounded-[28px] bg-pitch p-8 sm:w-[46vw] lg:w-[calc((100%-3rem)/4)]"
            >
              {/* The step number, at a scale you read as position, not as text. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-8 -right-3 select-none text-[150px] font-semibold leading-none tracking-[-0.05em] text-crisp/[0.05] transition-colors duration-500 group-hover:text-signal/[0.09]"
              >
                {i + 1}
              </span>

              <Icon
                className="relative h-9 w-9 text-signal transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
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
                <h3 className="type-title mt-2 hyphens-auto break-words text-crisp">{step}</h3>
              </div>
            </article>
          );
        })}
      </HighlightsShelf>
    </Section>
  );
}
