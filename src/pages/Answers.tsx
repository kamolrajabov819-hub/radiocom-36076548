import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useScrollChoreography } from "@/lib/motion";
import { LocaleLink } from "@/components/LocaleLink";
import { brandCase } from "@/lib/brand";
import { Section, SectionHead } from "@/components/Section";
import { publishedAnswers } from "@/data/answers";
import { pick } from "@/data/spec-dict";
import { fadeUpAt, spring } from "@/lib/springs";
import { TrustedBy } from "@/components/TrustedBy";

/**
 * The answers index.
 *
 * Each card carries the question *and* the first sentence of its answer, not a
 * teaser. A reader who only ever sees this page should still leave knowing
 * something, and a crawler reading it gets seven answered questions rather than
 * seven links — which is what makes the index worth indexing on its own.
 */
export function AnswersPage() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language.slice(0, 2) as "ru" | "en" | "uz") || "ru";
  const page = useScrollChoreography();

  return (
    <div ref={page} className="page-anim page-tight">
      <Section band="plain">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
        >
          <div className="eyebrow-sweep mb-4 text-[13px] font-medium tracking-wide">
            {t("answers.eyebrow")}
          </div>
          <h1 className="type-display text-crisp">{t("answers.title")}</h1>
          <p className="subhead measure mt-5 text-[17px] leading-relaxed md:text-[21px]">
            {brandCase(t("answers.sub"))}
          </p>
        </motion.div>
      </Section>

      <Section band="soft">
        <div className="grid gap-4 md:grid-cols-2">
          {publishedAnswers.map((a, i) => (
            <motion.div key={a.slug} {...fadeUpAt(i)}>
              <LocaleLink
                to="/answers/$slug"
                params={{ slug: a.slug }}
                className="card-interactive flex h-full flex-col rounded-[28px] bg-pitch p-7"
              >
                <h2 className="type-title text-crisp">{brandCase(pick(a.question, lang))}</h2>
                {/* The first sentence of the real answer, not a summary of it.
                    Split on the sentence end so the card never cuts mid-clause. */}
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-cool">
                  {brandCase(pick(a.answer, lang).split(". ")[0] + ".")}
                </p>
                <span className="pill-link mt-5 inline-flex">
                  {t("px.learn_more")} <ChevronRight className="h-4 w-4" aria-hidden />
                </span>
              </LocaleLink>
            </motion.div>
          ))}
        </div>
      </Section>

      <TrustedBy />
    </div>
  );
}
