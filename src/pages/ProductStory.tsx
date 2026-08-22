import { useTranslation } from "react-i18next";
import { notFound, useParams } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { LocaleLink } from "@/components/LocaleLink";
import { Section, SectionHead } from "@/components/Section";
import { BentoGrid, FeatureCard, HighlightsShelf } from "@/components/apple";
import { openLead } from "@/components/LeadFormSheet";
import { Magnetic } from "@/components/Magnetic";
import {
  formatPrice,
  isBrandSlug,
  productBySlug,
  type BrandSlug,
  type Product,
} from "@/data/products";
import { specs } from "@/data/specs";
import { INDUSTRY_SLUGS } from "@/data/industries";
import { pick } from "@/data/spec-dict";
import {
  breadcrumbSchema,
  brandPath,
  jsonLd,
  localeLinks,
  pageMeta,
  productPath,
  productSchema,
  type SeoLang,
} from "@/lib/seo";
import { tFor } from "@/lib/i18n";
import { useLang } from "@/lib/locale";

/**
 * Product story page — the apple.com/macbook-air analogue.
 *
 * The split this page is one half of matters more than any single section on
 * it: apple.com separates *why you would want this* from *what it costs and
 * what is in it*. The story page argues; the specs page answers. Merging them,
 * which is what the old `/catalog/{id}` did, produces a page that does neither
 * well — a spec table interrupts the argument, and marketing copy gets in the
 * way of someone who arrived already knowing what they want.
 *
 * Every fact rendered here comes from `products.ts` and `specs.ts`. Nothing on
 * this page is written copy about the product: the highlights are derived from
 * the manufacturer's own spec rows, the feature bento from `specs[].features`,
 * the box list from `specs[].inBox`, and the industries from the existing
 * two-way `industryPicks` map. That is deliberate — invented product claims on
 * a supplier's site are worse than a thinner page.
 */
export function productStoryRouteOptions() {
  return {
    head: ({ params }: { params: { lang: SeoLang; brand: string; model: string } }) => {
      if (!isBrandSlug(params.brand)) return {};
      const brandSlug = params.brand;
      const t = tFor(params.lang);
      const p = productBySlug(brandSlug, params.model);
      if (!p) return {};

      const path = productPath(p);
      const title = t("meta.product.title", { name: p.name });
      const description = t("meta.product.desc", {
        blurb: pick(p.blurb, params.lang),
        range: pick(p.rangeCity, params.lang),
        price: formatPrice(p.price, params.lang),
      });
      const spec = specs[p.id];

      return {
        meta: pageMeta({
          lang: params.lang,
          title,
          description,
          path,
          image: p.image,
          type: "product",
        }),
        links: localeLinks(params.lang, path),
        scripts: [
          jsonLd(
            productSchema(p, params.lang, {
              specs: (spec?.rows ?? []).map((r) => ({
                name: pick(r.label, params.lang),
                value: pick(r.value, params.lang),
              })),
            }),
          ),
          jsonLd(
            breadcrumbSchema(
              [
                { name: t("nav.home"), path: "/" },
                { name: t(`meta.crumb.${brandSlug}`), path: brandPath(brandSlug) },
                { name: p.name, path },
              ],
              params.lang,
            ),
          ),
        ],
      };
    },
    component: ProductStoryPage,
  };
}

export function ProductStoryPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const { brand, model } = useParams({ strict: false }) as { brand: string; model: string };
  const brandSlug = brand as BrandSlug;
  const p = productBySlug(brandSlug, model);

  // Same contract the old product route used: the router owns the 404 shell in
  // __root.tsx, so an unknown model must throw rather than render a local
  // stand-in — otherwise it would answer 200 with a "not found" body, which is
  // a soft 404 and exactly what Google reports as a crawl problem.
  if (!p) throw notFound();
  const spec = specs[p.id];

  return (
    <div className="page-anim">
      <Hero p={p} lang={lang} />
      <Highlights p={p} lang={lang} />
      {spec?.features?.length ? <Features p={p} lang={lang} /> : null}
      {spec?.inBox?.length ? <InBox p={p} lang={lang} /> : null}
      <WhereUsed p={p} lang={lang} />
      <Closing p={p} lang={lang} />
    </div>
  );
}

/* ── Hero ─────────────────────────────────────────────────── */
function Hero({ p, lang }: { p: Product; lang: "ru" | "en" | "uz" }) {
  const { t } = useTranslation();
  return (
    <Section band="plain">
      <nav aria-label="Breadcrumb" className="mb-8 text-[14px] text-cool">
        <LocaleLink
          to={p.brandSlug === "radiocom" ? "/radiocom" : "/motorola"}
          className="hover:text-crisp"
        >
          {t(`meta.crumb.${p.brandSlug}`)}
        </LocaleLink>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span className="text-crisp">{p.name}</span>
      </nav>

      <div className="mx-auto max-w-3xl text-center">
        <h1 className="headline-hero text-crisp">{p.name}</h1>
        <p className="subhead mx-auto mt-6 max-w-2xl text-[17px] md:text-[21px]">
          {pick(p.blurb, lang)}
        </p>
        <p className="mt-6 text-[17px] font-medium text-crisp">
          {p.price != null
            ? `${t("px.from")} ${formatPrice(p.price, lang)}`
            : t("px.price_on_request")}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Magnetic>
            <button onClick={() => openLead({ title: p.name })} className="pill pill-accent">
              {t("px.buy")}
            </button>
          </Magnetic>
          <LocaleLink
            to="/$brand/$model/specs"
            params={{ brand: p.brandSlug, model: p.slug }}
            className="pill-link"
          >
            {t("px.specs_link")} <ChevronRight className="h-4 w-4" aria-hidden />
          </LocaleLink>
        </div>
      </div>

      <div className="stage relative mt-12 flex h-[42vh] max-h-[520px] items-center justify-center md:mt-16">
        <img
          src={p.image}
          alt={p.name}
          width={1024}
          height={1024}
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          className="h-full w-auto max-w-[88vw] object-contain mix-blend-multiply"
        />
      </div>
    </Section>
  );
}

/* ── Highlights shelf ─────────────────────────────────────── */
/**
 * Built from the manufacturer's own spec rows plus the range figures, rather
 * than from written marketing lines. Every card is therefore a fact we can
 * stand behind, and adding a model to `products.ts` populates this shelf with
 * no further work.
 */
function Highlights({ p, lang }: { p: Product; lang: "ru" | "en" | "uz" }) {
  const { t } = useTranslation();
  const spec = specs[p.id];

  const cards: { label: string; value: string }[] = [
    { label: t("px.range_city"), value: pick(p.rangeCity, lang) },
    ...(p.rangeOpen ? [{ label: t("px.range_open"), value: pick(p.rangeOpen, lang) }] : []),
    ...(spec?.rows ?? []).map((r) => ({
      label: pick(r.label, lang),
      value: pick(r.value, lang),
    })),
  ].slice(0, 8);

  if (!cards.length) return null;

  return (
    <Section band="soft" tight>
      <SectionHead align="left" spacing="tight" title={t("px.highlights")} />
      <HighlightsShelf label={t("px.highlights")}>
        {cards.map((c) => (
          <article
            key={c.label + c.value}
            className="flex w-[64vw] shrink-0 snap-start flex-col justify-between rounded-[28px] bg-pitch p-7 sm:w-[38vw] lg:w-[calc((100%-3rem)/4)]"
          >
            <div className="text-[14px] font-medium text-cool">{c.label}</div>
            <div className="mt-8 text-[26px] font-semibold leading-[1.1] tracking-[-0.02em] text-crisp">
              {c.value}
            </div>
          </article>
        ))}
      </HighlightsShelf>
    </Section>
  );
}

/* ── Feature bento ────────────────────────────────────────── */
/**
 * The old version rendered two lonely cards in an ocean of white. The grid
 * takes whatever `specs[].features` holds and lays it out so the rows stay
 * full: three columns, the tail padded by promoting the first feature to a
 * wide tile when the count would otherwise leave a hole.
 */
function Features({ p, lang }: { p: Product; lang: "ru" | "en" | "uz" }) {
  const { t } = useTranslation();
  const features = specs[p.id]?.features ?? [];
  if (!features.length) return null;

  // With a 3-column grid, a remainder of 1 leaves two holes and a remainder of
  // 2 leaves one. Widening the lead tile shifts the remainder by one column,
  // which closes both cases without dropping or inventing a feature.
  const wideLead = features.length % 3 === 2;

  return (
    <Section band="plain" tight>
      <SectionHead align="left" spacing="tight" title={t("px.features")} />
      <BentoGrid>
        {features.map((f, i) => (
          <FeatureCard
            key={pick(f, lang)}
            idx={i}
            span={wideLead && i === 0 ? 2 : 1}
            tone={i === 1 ? "dark" : "light"}
            title={pick(f, lang)}
            className="min-h-[200px]"
          />
        ))}
      </BentoGrid>
    </Section>
  );
}

/* ── In the box ───────────────────────────────────────────── */
function InBox({ p, lang }: { p: Product; lang: "ru" | "en" | "uz" }) {
  const { t } = useTranslation();
  const inBox = specs[p.id]?.inBox ?? [];
  if (!inBox.length) return null;

  return (
    <Section band="soft" tight>
      <SectionHead align="left" spacing="tight" title={t("px.in_box")} />
      <ul className="grid grid-cols-1 gap-x-10 border-t border-border sm:grid-cols-2 lg:grid-cols-3">
        {inBox.map((line) => (
          <li
            key={pick(line.item, lang)}
            className="flex items-baseline justify-between gap-4 border-b border-border py-5"
          >
            <span className="text-[17px] text-crisp">{pick(line.item, lang)}</span>
            {(line.qty ?? 1) > 1 ? (
              <span className="shrink-0 text-[15px] tabular-nums text-cool">×{line.qty}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ── Where it is used ─────────────────────────────────────── */
function WhereUsed({ p, lang }: { p: Product; lang: "ru" | "en" | "uz" }) {
  const { t } = useTranslation();
  const slugs = p.industries.filter((s) => (INDUSTRY_SLUGS as readonly string[]).includes(s));
  if (!slugs.length) return null;

  return (
    <Section band="plain" tight>
      <SectionHead align="left" spacing="tight" title={t("px.where_used")} />
      <div className="flex flex-wrap gap-3">
        {slugs.map((slug) => (
          <LocaleLink
            key={slug}
            to="/industries/$slug"
            params={{ slug }}
            className="pill pill-ghost"
          >
            {t(`industries.${slug}.title`)}
            <ChevronRight className="h-4 w-4" aria-hidden />
          </LocaleLink>
        ))}
      </div>
      <p className="sr-only">{pick(p.blurb, lang)}</p>
    </Section>
  );
}

/* ── Closing: specs hand-off, compare, enquiry ────────────── */
function Closing({ p, lang }: { p: Product; lang: "ru" | "en" | "uz" }) {
  const { t } = useTranslation();
  return (
    <Section band="soft" tight>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="type-headline text-crisp">{t("px.specs_link")}</h2>
        <p className="subhead mt-4 text-[17px]">
          {p.price != null
            ? `${t("px.from")} ${formatPrice(p.price, lang)} · ${t("px.warranty")}`
            : t("px.price_on_request")}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <LocaleLink
            to="/$brand/$model/specs"
            params={{ brand: p.brandSlug, model: p.slug }}
            className="pill pill-primary"
          >
            {t("px.spec_table")}
          </LocaleLink>
          <LocaleLink to="/compare" className="pill-link">
            {t("brand.compare_cta")} <ChevronRight className="h-4 w-4" aria-hidden />
          </LocaleLink>
        </div>
      </div>
    </Section>
  );
}
