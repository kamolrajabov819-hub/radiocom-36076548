import { useTranslation } from "react-i18next";
import { useScrollChoreography } from "@/lib/motion";
import { notFound, useParams } from "@tanstack/react-router";
import { Check, ChevronRight } from "lucide-react";
import { LocaleLink } from "@/components/LocaleLink";
import { Section, SectionHead } from "@/components/Section";
import { LeadInCaption, StatPanel, TintedHeadline } from "@/components/apple";
import { openLead } from "@/components/LeadFormSheet";
import { Magnetic } from "@/components/Magnetic";
import {
  categoryLabels,
  formatPrice,
  isBrandSlug,
  productBySlug,
  type BrandSlug,
  type Product,
} from "@/data/products";
import { specs, RANGE_NOTE } from "@/data/specs";
import { pick, type Lang } from "@/data/spec-dict";
import {
  breadcrumbSchema,
  brandPath,
  jsonLd,
  localeLinks,
  pageMeta,
  productPath,
  productSchema,
  productSpecsPath,
  webPageSchema,
  type SeoLang,
} from "@/lib/seo";
import { tFor } from "@/lib/i18n";
import { useLang } from "@/lib/locale";

/**
 * Specs and price — the apple.com/shop/buy-mac analogue.
 *
 * The counterpart to the story page. Someone arriving here has already decided
 * they want this model and needs three things: what it costs, what is in the
 * box, and the full table. So the page opens with the configuration summary and
 * the price rather than with a photograph, and the table is complete rather
 * than curated — this is the page for the reader who wants the numbers.
 *
 * The story page and this one share a canonical pair: each links to the other,
 * and both carry the same `Product` schema, differentiated by URL. The offer
 * lives on both because either can be the page a buyer lands on from search.
 */
export function productSpecsRouteOptions() {
  return {
    head: ({ params }: { params: { lang: SeoLang; brand: string; model: string } }) => {
      if (!isBrandSlug(params.brand)) return {};
      const brandSlug = params.brand;
      const t = tFor(params.lang);
      const p = productBySlug(brandSlug, params.model);
      if (!p) return {};

      const path = productSpecsPath(p);
      const spec = specs[p.id];

      const title = t("meta.specs.title", { name: p.name });
      const description = t("meta.specs.desc", {
        name: p.name,
        price: formatPrice(p.price, params.lang),
      });

      return {
        meta: pageMeta({
          lang: params.lang,
          title,
          description,
          path,
          ogCard: `product-${p.slug}`,
          type: "product",
        }),
        links: localeLinks(params.lang, path),
        scripts: [
          jsonLd(
            webPageSchema({
              lang: params.lang,
              path,
              name: title,
              description,
              image: p.image,
            }),
          ),
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
                { name: p.name, path: productPath(p) },
                { name: t("meta.crumb.specs"), path },
              ],
              params.lang,
            ),
          ),
        ],
      };
    },
    component: ProductSpecsPage,
  };
}

export function ProductSpecsPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const { brand, model } = useParams({ strict: false }) as { brand: string; model: string };
  const brandSlug = brand as BrandSlug;
  const p = productBySlug(brandSlug, model);
  if (!p) throw notFound();

  const spec = specs[p.id];

  const page = useScrollChoreography();

  return (
    <div ref={page} className="page-anim">
      {/* ── Configuration summary + price ─────────────────── */}
      <Section band="plain">
        <nav aria-label="Breadcrumb" className="mb-8 text-[14px] text-cool">
          <LocaleLink
            to={brandSlug === "radiocom" ? "/radiocom" : "/motorola"}
            className="inline-flex min-h-11 items-center hover:text-crisp"
          >
            {t(`meta.crumb.${brandSlug}`)}
          </LocaleLink>
          <span className="mx-2" aria-hidden>
            /
          </span>
          <LocaleLink
            to="/$brand/$model"
            params={{ brand: p.brandSlug, model: p.slug }}
            className="inline-flex min-h-11 items-center hover:text-crisp"
          >
            {p.name}
          </LocaleLink>
          <span className="mx-2" aria-hidden>
            /
          </span>
          <span className="text-crisp">{t("meta.crumb.specs")}</span>
        </nav>

        {/* Buy card left, specification right.
        
            The DOM order is deliberately unchanged: the `<h1>` and the summary
            still come first in source, so a screen reader and the crawler both
            meet the product's name before its price. Only the *visual* order
            moves, via `lg:order-*` — reordering the source to achieve this
            would have put a price card ahead of the page's heading. Below `lg`
            the columns stack and source order governs, which is the order that
            reads correctly on a phone. */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          <div className="lg:order-2">
            <TintedHeadline as="h1" className="type-headline text-crisp">
              {p.name}
            </TintedHeadline>
            <p className="subhead mt-4 max-w-xl text-[17px]">{pick(p.blurb, lang)}</p>

            {/* At-a-glance only — deliberately *not* the first four rows of
                the table below it. Repeating them verbatim a screen apart reads
                as a rendering fault rather than a summary. What belongs here is
                what the table does not carry: the range figures, the segment,
                and the capability tags. */}
            <dl className="mt-10 border-t border-border">
              <SummaryRow label={t("px.range_city")} value={pick(p.rangeCity, lang)} />
              {p.rangeOpen ? (
                <SummaryRow label={t("px.range_open")} value={pick(p.rangeOpen, lang)} />
              ) : null}
              <SummaryRow label={t("px.config")} value={pick(categoryLabels[p.category], lang)} />
              {p.tags.length ? (
                <SummaryRow label={t("px.features")} value={p.tags.join(" · ")} />
              ) : null}
            </dl>
          </div>

          {/* Buy card. Sticky on desktop so the price stays with the reader
              while they scroll the full table below. */}
          <aside className="lg:order-1 lg:sticky lg:top-24">
            <div className="rounded-[28px] bg-charcoal p-7 md:p-8">
              <div className="flex justify-center">
                <img
                  src={p.image}
                  alt=""
                  width={1024}
                  height={1024}
                  loading="eager"
                  decoding="sync"
                  fetchPriority="high"
                  className="h-[180px] w-auto object-contain mix-blend-multiply"
                />
              </div>

              <div className="mt-6 text-[13px] font-medium uppercase tracking-wider text-cool">
                {t("px.config")}
              </div>
              <div className="mt-1 text-[26px] font-semibold leading-[1.1] tracking-[-0.02em] text-crisp">
                {p.price != null ? formatPrice(p.price, lang) : t("px.price_on_request")}
              </div>

              <ul className="mt-6 space-y-3">
                {[t("px.warranty"), t("px.delivery"), t("px.trial")].map((line) => (
                  <li key={line} className="flex items-start gap-2.5 text-[15px] text-crisp">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-signal" aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              {/* Side by side, not stacked.
              
                  `Magnetic` renders an `inline-flex` span, so *it* is the flex
                  item this row sees — a `flex-1` on the button inside would
                  resolve against a shrink-wrapped parent and do nothing. That
                  is why the class is on the wrapper.
              
                  `flex-wrap` rather than a breakpoint: the card is capped at
                  420px on desktop and goes full width below `lg`, so the pair
                  fits at both. If a locale's wording ever outgrows the row —
                  Uzbek runs longest — it wraps to the old stacked layout on its
                  own instead of overflowing the card. */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Magnetic className="flex-1">
                  <button
                    onClick={() => openLead({ title: p.name })}
                    className="pill pill-accent w-full justify-center py-3.5"
                  >
                    {t("px.buy")}
                  </button>
                </Magnetic>

                <LocaleLink
                  to="/$brand/$model"
                  params={{ brand: p.brandSlug, model: p.slug }}
                  className="pill-link shrink-0"
                >
                  {t("px.story_link")} <ChevronRight className="h-4 w-4" aria-hidden />
                </LocaleLink>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {/* ── Full specification table ──────────────────────── */}
      {spec?.rows?.length ? (
        <Section band="plain">
          <SectionHead align="left" spacing="tight" title={t("px.spec_table")} />

          {/* The two or three figures that decide the purchase, lifted out of
              the table and stated at display size — apple.com's tech-specs
              pages open the same way. They are not a summary of the table: a
              spec sheet answers thirty questions with equal weight, and this
              answers the three a buyer came with. Every value is read straight
              out of the same rows rendered below, so the two can never
              disagree. */}
          <HeadlineFigures p={p} lang={lang} />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left">
              <caption className="sr-only">
                {t("px.spec_table")} — {p.name}
              </caption>
              <tbody>
                {spec.rows.map((r) => (
                  <tr key={pick(r.label, lang)} className="border-b border-border">
                    <th
                      scope="row"
                      className="w-[42%] py-5 pr-6 align-top text-[15px] font-normal text-cool"
                    >
                      {pick(r.label, lang)}
                    </th>
                    <td className="py-5 align-top text-[17px] text-crisp">{pick(r.value, lang)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 max-w-2xl text-[13px] leading-relaxed text-cool">
            {pick(RANGE_NOTE, lang)}
          </p>
        </Section>
      ) : null}

      {/* ── In the box ────────────────────────────────────── */}
      {spec?.inBox?.length ? (
        <Section band="plain">
          <SectionHead align="left" spacing="tight" title={t("px.in_box")} />
          <ul className="grid grid-cols-1 gap-x-10 border-t border-border sm:grid-cols-2 lg:grid-cols-3">
            {spec.inBox.map((line) => (
              <li
                key={pick(line.item, lang)}
                className="flex items-baseline justify-between gap-4 border-b border-border py-5"
              >
                <span className="text-[17px] text-crisp">{pick(line.item, lang)}</span>
                {/* Always shown, including ×1 — see ProductStory.tsx's InBox
                    for why: an omitted count read as ambiguous, not as one. */}
                <span className="shrink-0 text-[15px] tabular-nums text-cool">×{line.qty ?? 1}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* ── Closing CTA ───────────────────────────────────── */}
      <Section band="plain">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="type-headline text-crisp">{t("px.buy")}</h2>
          <p className="subhead mt-4 text-[17px]">{t("px.trial")}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Magnetic>
              <button onClick={() => openLead({ title: p.name })} className="pill pill-accent">
                {t("px.buy")}
              </button>
            </Magnetic>
            <LocaleLink to="/compare" className="pill-link">
              {t("brand.compare_cta")} <ChevronRight className="h-4 w-4" aria-hidden />
            </LocaleLink>
          </div>
        </div>
      </Section>
    </div>
  );
}

/**
 * Range, ingress rating and battery life, as three panels.
 *
 * Which rows appear is data-driven and matched on the Russian label, because
 * that is the join key `specs.ts` is written against — matching on the rendered
 * label would silently return nothing the moment the page is read in English.
 * A model missing a row simply contributes no panel; nothing is substituted or
 * estimated.
 */
function HeadlineFigures({ p, lang }: { p: Product; lang: Lang }) {
  const { t } = useTranslation();
  const rows = specs[p.id]?.rows ?? [];
  const find = (re: RegExp) => rows.find((r) => re.test(r.label.ru));

  const protection = find(/Класс защиты/i);
  const battery = find(/Время работы от аккумулятора/i);

  const panels = [
    { key: "range", value: pick(p.rangeCity, lang), label: t("px.range_city") },
    ...(p.rangeOpen
      ? [{ key: "open", value: pick(p.rangeOpen, lang), label: t("px.range_open") }]
      : []),
    ...(protection
      ? [
          {
            key: "ip",
            value: pick(protection.value, lang),
            label: pick(protection.label, lang),
          },
        ]
      : []),
    ...(battery
      ? [{ key: "batt", value: pick(battery.value, lang), label: pick(battery.label, lang) }]
      : []),
  ].slice(0, 3);

  if (panels.length < 2) return null;

  return (
    <div className="mb-12 md:mb-14">
      <div
        data-stagger
        className={`grid grid-cols-1 gap-4 ${
          panels.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"
        }`}
      >
        {panels.map((s) => (
          <StatPanel key={s.key} value={s.value} label={s.label} />
        ))}
      </div>
      <LeadInCaption className="mt-5 max-w-[62ch]" lead={t("px.range_lead")}>
        {t("px.spec_note")}
      </LeadInCaption>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-border py-4">
      <dt className="text-[15px] text-cool">{label}</dt>
      <dd className="text-right text-[17px] font-medium text-crisp">{value}</dd>
    </div>
  );
}

export type { Product };
