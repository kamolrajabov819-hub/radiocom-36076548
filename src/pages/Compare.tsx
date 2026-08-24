import { useTranslation } from "react-i18next";
import { useScrollChoreography } from "@/lib/motion";
import { ChevronRight } from "lucide-react";
import { LocaleLink } from "@/components/LocaleLink";
import { Section, SectionHead } from "@/components/Section";
import { CompareTable, type CompareColumn } from "@/components/apple";
import {
  formatPrice,
  productsOfBrand,
  shortName,
  type BrandSlug,
  type Product,
  visibleProducts,
} from "@/data/products";
import { specs } from "@/data/specs";
import { pick, type Lang } from "@/data/spec-dict";
import {
  breadcrumbSchema,
  itemListSchema,
  jsonLd,
  localeLinks,
  pageMeta,
  type SeoLang,
} from "@/lib/seo";
import { tFor } from "@/lib/i18n";
import { useLang } from "@/lib/locale";

/**
 * Cross-model comparison — apple.com's "Which one is right for you?".
 *
 * The old catalogue carried a four-model compare block hardcoded to
 * `["rc-10", "rcd-30", "rcd-60", "rcd-70"]` — all Radiocom, so a visitor
 * weighing a Motorola against an RCD had nothing to read. This page compares
 * both families, one table per brand, on the rows that at least one model in
 * that table actually answers.
 *
 * Rows are keyed by the Russian spec label because that is the join key the
 * spec sheets are written against; the *rendered* label comes from whichever
 * locale the reader is in. Keying by display text would break the join the
 * moment the page is viewed in English.
 *
 * The two ids beginning `__` are the exception, and the prefix is doing real
 * work. Range is the figure a two-way radio is actually chosen on, and it is
 * published as two separate numbers — in a city and on open ground — that the
 * price list quotes separately because they differ by a factor of three or
 * four. A single "Радиус действия" row can only show one of them.
 *
 * They cannot be keyed by their Russian labels like the rest, because both
 * live on the `Product` record rather than in `specs[].rows`, and because
 * "Радиус действия" *is* a real spec label: keying the city row that way makes
 * the label resolver find the generic spec-sheet heading and title both rows
 * "Радиус действия". The `__` prefix guarantees no sample can ever match, so
 * both rows fall through to the explicit labels in `rowLabel`.
 */
const RANGE_CITY = "__range_city";
const RANGE_OPEN = "__range_open";

const COMPARE_ROWS = [
  "Стандарт",
  "Режим работы",
  RANGE_CITY,
  RANGE_OPEN,
  "Количество каналов",
  "Класс защиты",
  "Время работы от аккумулятора",
  "Ёмкость аккумулятора",
] as const;

export const routeOptions = {
  head: ({ params }: { params: { lang: SeoLang } }) => {
    const t = tFor(params.lang);
    const path = "/compare";
    return {
      meta: pageMeta({
        lang: params.lang,
        title: t("meta.compare.title", { count: visibleProducts.length }),
        description: t("meta.compare.desc"),
        path,
        ogCard: "compare",
      }),
      links: localeLinks(params.lang, path),
      scripts: [
        jsonLd(itemListSchema(visibleProducts, params.lang)),
        jsonLd(
          breadcrumbSchema(
            [
              { name: t("nav.home"), path: "/" },
              { name: t("meta.crumb.compare"), path },
            ],
            params.lang,
          ),
        ),
      ],
    };
  },
  component: ComparePage,
};

export function ComparePage() {
  const { t } = useTranslation();
  const lang = useLang();

  const page = useScrollChoreography();

  return (
    <div ref={page} className="page-anim page-tight">
      <Section band="plain">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="headline-hero text-crisp">{t("px.compare_title")}</h1>
          <p className="subhead mx-auto mt-6 max-w-2xl text-[17px] md:text-[21px]">
            {t("px.compare_sub")}
          </p>
        </div>
      </Section>

      <BrandTable brandSlug="radiocom" lang={lang} band="soft" />
      <BrandTable brandSlug="motorola" lang={lang} band="plain" />

      <Section band="soft" tight>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="type-headline text-crisp">{t("brand.compare_cta")}</h2>
          <p className="subhead mt-4 text-[17px]">{t("px.trial")}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <LocaleLink to="/radiocom" className="pill pill-accent">
              {t("brand.radiocom_title")}
            </LocaleLink>
            <LocaleLink to="/motorola" className="pill-link">
              {t("brand.motorola_title")} <ChevronRight className="h-4 w-4" aria-hidden />
            </LocaleLink>
          </div>
        </div>
      </Section>
    </div>
  );
}

function BrandTable({
  brandSlug,
  lang,
  band,
}: {
  brandSlug: BrandSlug;
  lang: Lang;
  band: "plain" | "soft";
}) {
  const { t } = useTranslation();
  const list = productsOfBrand(brandSlug);
  if (list.length < 2) return null;

  // Keep a row only when at least half the models in the table answer it.
  //
  // The old threshold was "at least one", which is not a filter: one model
  // carrying a battery figure kept the row, and the other seven rendered em
  // dashes. A comparison row that is mostly blank does not inform a choice —
  // it reads as missing data and undermines the rows that are complete.
  const answers = (rowId: string) =>
    list.filter((p) => rowValue(p, rowId, "ru") !== undefined).length;

  // `sample` looks the heading up from whichever model actually publishes the
  // row, so the table speaks the spec sheets' own wording. The two `__` range
  // ids can never match a real `label.ru`, which is exactly what routes them to
  // `rowLabel` — a bare "Радиус действия" id would have matched here and given
  // both range rows the same generic heading.
  const rows = COMPARE_ROWS.filter((rowId) => answers(rowId) * 2 >= list.length).map((rowId) => {
    const sample = list.flatMap((p) => specs[p.id]?.rows ?? []).find((r) => r.label.ru === rowId);
    return { id: rowId, label: sample ? pick(sample.label, lang) : rowLabel(rowId, lang, t) };
  });

  const columns: CompareColumn[] = list.map((p) => columnFor(p, rows, lang));

  return (
    <Section band={band} tight>
      <div data-scrub-in>
        <SectionHead
          align="left"
          spacing="tight"
          title={t(`brand.${brandSlug}_title`)}
          sub={t(`brand.${brandSlug}_desc`)}
          link={{
            label: t("brand.all_models"),
            to: brandSlug === "radiocom" ? "/radiocom" : "/motorola",
          }}
        />
      </div>
      {/* Deliberately no `data-scrub-in` on the table.
      
          Every cell in it holds a catalogue photograph rendered with
          `mix-blend-multiply` to knock its white sweep out against the band,
          and a scrub animates `transform`, which opens a stacking context —
          inside one, the blend has no backdrop to multiply against and eight
          product shots turn into white rectangles on the #f5f5f7 band.
          `qa-blend.mjs` caught it. The heading above carries the motion
          instead; the table arrives with it. */}
      <CompareTable
        columns={columns}
        rows={rows}
        caption={t(`brand.${brandSlug}_title`)}
        rowHeaderLabel={t("px.spec_column")}
      />
    </Section>
  );
}

function ColumnActions({ p }: { p: Product }) {
  const { t } = useTranslation();
  return (
    <>
      <LocaleLink
        to="/$brand/$model"
        params={{ brand: p.brandSlug, model: p.slug }}
        className="pill pill-sm pill-accent"
      >
        {t("px.learn_more")}
      </LocaleLink>
      <LocaleLink
        to="/$brand/$model/specs"
        params={{ brand: p.brandSlug, model: p.slug }}
        className="pill-link text-[13px]"
      >
        {t("px.specs_link")} <ChevronRight className="h-4 w-4" aria-hidden />
      </LocaleLink>
    </>
  );
}

/**
 * One cell's value, by row id.
 *
 * The two range rows are special-cased because their data lives on the
 * `Product` record as `rangeCity`/`rangeOpen`, not in `specs[].rows` — where
 * only one model happens to repeat it. Reading only the spec rows left range
 * seven-eighths empty on the Radiocom table: the most important line in the
 * comparison, blank for every model that has the data.
 *
 * `rangeOpen` is optional and stays optional here. Returning `undefined` is
 * what makes a model without one render an em dash *and* what correctly
 * excludes it from the half-coverage filter — the two behaviours a hardcoded
 * fallback string would both get wrong.
 */
function rowValue(p: Product, rowId: string, lang: Lang): string | undefined {
  if (rowId === RANGE_CITY) return pick(p.rangeCity, lang);
  if (rowId === RANGE_OPEN) return p.rangeOpen ? pick(p.rangeOpen, lang) : undefined;
  const row = specs[p.id]?.rows.find((r) => r.label.ru === rowId);
  return row ? pick(row.value, lang) : undefined;
}

/**
 * Heading for a row no spec sheet supplies a label for — the two range rows.
 *
 * These take `product.range_*` ("Дальность в городе") rather than the short
 * `px.range_*` ("В городе") used on the stat panels. A panel label is read
 * directly under the figure it belongs to, so "В городе" is unambiguous there;
 * a table row heading is read on its own down the left-hand column, where "В
 * городе" does not say what is being measured.
 */
function rowLabel(rowId: string, lang: Lang, t: (k: string) => string): string {
  if (rowId === RANGE_CITY) return t("product.range_city");
  if (rowId === RANGE_OPEN) return t("product.range_open");
  return rowId;
}

function columnFor(p: Product, rows: { id: string }[], lang: Lang): CompareColumn {
  return {
    id: p.id,
    // The brand is already the table's heading, so repeating it in every
    // column just eats horizontal room that the specs need.
    name: shortName(p.name),
    tagline: pick(p.blurb, lang),
    note: formatPrice(p.price, lang),
    actions: <ColumnActions p={p} />,
    media: (
      <img
        src={p.image}
        alt={p.name}
        loading="lazy"
        width={512}
        height={512}
        className="h-24 w-auto object-contain mix-blend-multiply md:h-32"
      />
    ),
    values: Object.fromEntries(rows.map((r) => [r.id, rowValue(p, r.id, lang)])),
  };
}
