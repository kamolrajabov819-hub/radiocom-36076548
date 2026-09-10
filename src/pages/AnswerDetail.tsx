import { useParams } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useScrollChoreography } from "@/lib/motion";
import { LocaleLink } from "@/components/LocaleLink";
import { brandCase } from "@/lib/brand";
import { Section, SectionHead } from "@/components/Section";
import { Faq } from "@/components/Faq";
import { ProductCard } from "@/components/ProductCard";
import { openLead } from "@/components/LeadFormSheet";
import { answerBySlug, answerPicks } from "@/data/answers";
import { visibleProducts } from "@/data/products";
import { pick } from "@/data/spec-dict";
import { fadeUpAt, spring } from "@/lib/springs";

/**
 * One answers page.
 *
 * The order is fixed and is the whole point: question, then the answer, then
 * the reasoning. Most pages of this kind open with three paragraphs of throat
 * clearing and put the answer under a subheading halfway down, which is why so
 * few of them win a featured snippet — the extractable passage has to be the
 * first thing after the `h1`.
 *
 * `data-direct-answer` on that paragraph is the hook `articleSchema()` marks
 * `speakable` and `verify-answers` asserts exists. It is one attribute doing
 * three jobs, so it is deliberately not removed as "unused markup".
 */
export function AnswerDetailPage() {
  const { slug } = useParams({ strict: false }) as { slug: string };
  const { t, i18n } = useTranslation();
  const lang = (i18n.language.slice(0, 2) as "ru" | "en" | "uz") || "ru";
  const page = useScrollChoreography();

  const a = answerBySlug(slug);
  // The route guard 404s an unknown slug before this renders, so this is the
  // belt to that braces — it keeps the component total rather than throwing
  // during hydration if the two ever disagree.
  if (!a) return null;

  const picks = answerPicks(a, visibleProducts);
  const faq = a.faq.map((f) => ({ q: pick(f.q, lang), a: pick(f.a, lang) }));

  return (
    <div ref={page} className="page-anim page-tight">
      {/* ── Question and the direct answer ─────────────────────── */}
      <Section band="plain">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
        >
          <LocaleLink to="/answers" className="pill-link mb-6 inline-flex">
            ← {t("answers.back")}
          </LocaleLink>
          <h1 className="type-display text-crisp">{brandCase(pick(a.question, lang))}</h1>
          {/* The passage an answer engine quotes. Sized up from body copy
              because it is the answer, not an intro. */}
          <p
            data-direct-answer
            className="subhead measure mt-6 text-[19px] leading-relaxed text-crisp md:text-[23px]"
          >
            {brandCase(pick(a.answer, lang))}
          </p>
        </motion.div>
      </Section>

      {/* ── Steps, where the page is a procedure ───────────────── */}
      {a.steps?.length ? (
        <Section band="soft" tight>
          <SectionHead align="left" spacing="tight" title={t("answers.steps_title")} />
          <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {a.steps.map((s, i) => (
              <motion.li
                key={i}
                id={`step-${i + 1}`}
                {...fadeUpAt(i)}
                className="card-interactive rounded-[28px] bg-pitch p-6"
              >
                <div className="type-caption text-signal">
                  {t("answers.step_label", { n: i + 1, defaultValue: String(i + 1) })}
                </div>
                <h3 className="type-title mt-2 text-crisp">{brandCase(pick(s.name, lang))}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-cool">
                  {brandCase(pick(s.text, lang))}
                </p>
              </motion.li>
            ))}
          </ol>
        </Section>
      ) : null}

      {/* ── The reasoning ──────────────────────────────────────── */}
      <Section band="plain">
        <div className="flex flex-col gap-14">
          {a.sections.map((s, i) => (
            <motion.div key={i} {...fadeUpAt(i)} className="measure">
              <h2 className="type-headline text-crisp">{brandCase(pick(s.heading, lang))}</h2>
              <p className="subhead mt-4 text-[17px] leading-relaxed">
                {brandCase(pick(s.body, lang))}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── Follow-up questions ────────────────────────────────── */}
      {faq.length ? (
        <Section band="soft" tight>
          <div className="mx-auto max-w-3xl">
            <SectionHead align="center" spacing="tight" title={t("industries.faq_title")} />
            <Faq items={faq} />
          </div>
        </Section>
      ) : null}

      {/* ── The models that answer it ──────────────────────────── */}
      {picks.length ? (
        <Section band="plain" tight>
          <SectionHead
            align="left"
            spacing="tight"
            title={t("industries.recommended")}
            link={{ label: t("industries.compare_all"), to: "/compare" }}
          />
          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
            {picks.map((p, i) => (
              <ProductCard key={p.id} p={p} lang={lang} idx={i} />
            ))}
          </div>
        </Section>
      ) : null}

      {/* ── Sibling answers, so the section reads as a cluster ─── */}
      {a.related.length ? (
        <Section band="soft" tight>
          <SectionHead align="left" spacing="tight" title={t("answers.related_title")} />
          <div className="grid gap-4 md:grid-cols-3">
            {a.related.map((slug, i) => {
              const r = answerBySlug(slug);
              if (!r) return null;
              return (
                <motion.div key={slug} {...fadeUpAt(i)}>
                  <LocaleLink
                    to="/answers/$slug"
                    params={{ slug }}
                    className="card-interactive block rounded-[28px] bg-pitch p-6"
                  >
                    <h3 className="type-title text-crisp">{brandCase(pick(r.question, lang))}</h3>
                    <span className="pill-link mt-4 inline-flex">
                      {t("px.learn_more")} <ChevronRight className="h-4 w-4" aria-hidden />
                    </span>
                  </LocaleLink>
                </motion.div>
              );
            })}
          </div>
        </Section>
      ) : null}

      {/* ── Closing CTA ────────────────────────────────────────── */}
      <Section band="dark" tight>
        <div className="text-center">
          <h2 className="type-headline text-white">{t("industries.banner_title")}</h2>
          <p className="mt-4 text-lg text-white/60">{t("industries.banner_sub")}</p>
          <button
            onClick={() => openLead({ title: pick(a.question, lang) })}
            className="pill pill-invert mt-8"
          >
            {t("industries.cta")}
          </button>
        </div>
      </Section>
    </div>
  );
}
