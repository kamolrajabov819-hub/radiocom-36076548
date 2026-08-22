import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";
import { LocaleLink } from "@/components/LocaleLink";
import { Section, SectionHead } from "@/components/Section";
import { BentoGrid, FeatureCard } from "@/components/apple";
import { Magnetic } from "@/components/Magnetic";
import { openLead } from "@/components/LeadFormSheet";
import {
  products,
  productsOfBrand,
  priceFrom,
  formatPrice,
  type BrandSlug,
  type Product,
} from "@/data/products";
import { pick } from "@/data/spec-dict";
import {
  breadcrumbSchema,
  brandPath,
  itemListSchema,
  jsonLd,
  localeLinks,
  pageMeta,
  type SeoLang,
} from "@/lib/seo";
import { tFor } from "@/lib/i18n";
import { useLang } from "@/lib/locale";

/**
 * Brand overview — the apple.com/mac analogue.
 *
 * apple.com/mac does one thing above all: it shows the whole family at once, at
 * a glance, each entry carrying just enough to choose by — name, one line, a
 * price floor, and two actions (read more / buy). Everything else on that page
 * is subordinate to the line-up.
 *
 * That is the structure here. The line-up grid comes first, not after a wall of
 * marketing; the brand's positioning sits above it in two lines, and the
 * why-buy-from-us row and the compare invitation come after, once the reader
 * has seen the range.
 *
 * This page replaced `/catalog`, which put both brands and 24 unrelated models
 * behind a single URL with client-side filters — so "Motorola рации Ташкент"
 * and "Radiocom RCD характеристики" competed for the same page and neither
 * ranked. Two brand URLs give each family its own indexable surface.
 */
export function brandRouteOptions(brandSlug: BrandSlug) {
  return {
    head: ({ params }: { params: { lang: SeoLang } }) => {
      const t = tFor(params.lang);
      const list = productsOfBrand(brandSlug);
      const title = t(`meta.brand.${brandSlug}_title`);
      const description = t(`meta.brand.${brandSlug}_desc`, { count: list.length });
      const path = brandPath(brandSlug);

      return {
        meta: pageMeta({ lang: params.lang, title, description, path }),
        links: localeLinks(params.lang, path),
        scripts: [
          jsonLd(itemListSchema(list, params.lang)),
          jsonLd(
            breadcrumbSchema(
              [
                { name: t("nav.home"), path: "/" },
                { name: t(`brand.${brandSlug}_title`), path },
              ],
              params.lang,
            ),
          ),
        ],
      };
    },
    component: () => <BrandPage brandSlug={brandSlug} />,
  };
}

export function BrandPage({ brandSlug }: { brandSlug: BrandSlug }) {
  const { t } = useTranslation();
  const lang = useLang();
  const list = productsOfBrand(brandSlug);
  const floor = priceFrom(list);

  return (
    <div className="page-anim">
      {/* ── Brand hero ─────────────────────────────────────── */}
      <Section band="plain">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-[14px] font-medium text-signal">{t("brand.eyebrow")}</div>
          <h1 className="headline-hero mt-3 text-crisp">{t(`brand.${brandSlug}_title`)}</h1>
          <p className="subhead mx-auto mt-6 max-w-2xl text-[17px] md:text-[21px]">
            {t(`brand.${brandSlug}_desc`)}
          </p>
          {floor != null ? (
            <p className="mt-5 text-[15px] text-cool">
              {list.length} {t("brand.models")} · {t("px.from")} {formatPrice(floor, lang)}
            </p>
          ) : null}
        </div>
      </Section>

      {/* ── The line-up ────────────────────────────────────── */}
      <Section band="soft" tight>
        <SectionHead align="left" spacing="tight" title={t("brand.lineup")} />
        {/* 1 / 2 / 4 columns, deliberately skipping 3. Radiocom has 8 models
            and Motorola 16: both divide exactly by 2 and by 4, and neither
            divides by 3 — a three-column lineup leaves a hole in the last row
            of every brand page. Column counts are a function of the data here,
            not a default. */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {list.map((p, i) => (
            <LineupCard key={p.id} p={p} lang={lang} idx={i} />
          ))}
        </div>
      </Section>

      {/* ── Why buy from us ────────────────────────────────── */}
      <Section band="plain" tight>
        <SectionHead align="left" spacing="tight" title={t("brand.why_title")} />
        <BentoGrid>
          <FeatureCard
            idx={0}
            span={2}
            title={t("home.bento.warranty.sub")}
            body={t("brand.sub")}
            className="min-h-[240px]"
          />
          <FeatureCard
            idx={1}
            tone="dark"
            title={t("px.delivery")}
            body={t("px.trial")}
            className="min-h-[240px]"
          />
          <FeatureCard
            idx={2}
            title={t("home.bento.service.title")}
            body={t("home.bento.service.sub")}
            className="min-h-[220px]"
          />
          <FeatureCard
            idx={3}
            title={t("home.bento.test.title")}
            body={t("home.bento.test.sub")}
            className="min-h-[220px]"
          />
          <FeatureCard
            idx={4}
            title={t("home.bento.tradein.title")}
            body={t("home.bento.tradein.sub")}
            className="min-h-[220px]"
            action={{ label: t("px.buy"), onClick: () => openLead({ title: t("px.buy") }) }}
          />
        </BentoGrid>
      </Section>

      {/* ── Compare invitation ─────────────────────────────── */}
      <Section band="soft" tight>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="type-headline text-crisp">{t("brand.compare_cta")}</h2>
          <p className="subhead mt-4 text-[17px]">{t("brand.compare_sub")}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <LocaleLink to="/compare" className="pill pill-primary">
              {t("px.compare_title")}
            </LocaleLink>
            <LocaleLink
              to={brandSlug === "radiocom" ? "/motorola" : "/radiocom"}
              className="pill-link"
            >
              {t(`brand.${brandSlug === "radiocom" ? "motorola" : "radiocom"}_title`)}
              <ChevronRight className="h-4 w-4" aria-hidden />
            </LocaleLink>
          </div>
        </div>
      </Section>
    </div>
  );
}

/**
 * One model in the line-up.
 *
 * Two actions, as apple.com does it: the whole card is the "learn more" target,
 * and a separate explicit control starts the enquiry. The price floor is the
 * third piece of information a buyer scans for after the name and the range, so
 * it sits on the card rather than one click away.
 */
function LineupCard({ p, lang, idx }: { p: Product; lang: "ru" | "en" | "uz"; idx: number }) {
  const { t } = useTranslation();
  return (
    <article
      className="group card-interactive relative flex flex-col overflow-hidden rounded-[28px] bg-pitch p-7 text-center md:p-8"
      style={{ animationDelay: `${Math.min(idx, 8) * 40}ms` }}
    >
      <LocaleLink
        to="/$brand/$model"
        params={{ brand: p.brandSlug, model: p.slug }}
        className="absolute inset-0 z-10"
        aria-label={p.name}
      />

      <h3 className="text-[21px] font-semibold leading-[1.15] tracking-[-0.01em] text-crisp">
        {p.name}
      </h3>
      <p className="mx-auto mt-2 max-w-[34ch] text-[15px] leading-relaxed text-cool">
        {pick(p.blurb, lang)}
      </p>

      <div className="relative my-7 flex flex-1 items-center justify-center">
        <img
          src={p.image}
          alt=""
          width={1024}
          height={1024}
          loading="lazy"
          decoding="async"
          className="h-[190px] w-auto max-w-[80%] object-contain mix-blend-multiply transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />
      </div>

      <div className="mt-auto">
        <div className="text-[15px] font-medium text-crisp">
          {p.price != null
            ? `${t("px.from")} ${formatPrice(p.price, lang)}`
            : t("px.price_on_request")}
        </div>
        <div className="mt-4 flex items-center justify-center gap-4 text-[15px]">
          {/* Sits above the card-wide overlay link so it stays independently
              clickable — the card goes to the story page, this goes to price. */}
          <LocaleLink
            to="/$brand/$model/specs"
            params={{ brand: p.brandSlug, model: p.slug }}
            className="relative z-20 pill-link"
          >
            {t("px.specs_link")}
          </LocaleLink>
          <span className="relative z-20 inline-flex items-center gap-1 text-signal">
            {t("px.learn_more")}
            <ChevronRight className="h-4 w-4" aria-hidden />
          </span>
        </div>
      </div>
    </article>
  );
}

/** Both brand routes share one component; this keeps the export surface small. */
export const radiocomRouteOptions = brandRouteOptions("radiocom");
export const motorolaRouteOptions = brandRouteOptions("motorola");

export { products };
