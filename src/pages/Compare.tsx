import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";
import { LocaleLink } from "@/components/LocaleLink";
import { Section, SectionHead } from "@/components/Section";
import { CompareTable, type CompareColumn } from "@/components/apple";
import {
  formatPrice,
  visibleProducts,
  productsOfBrand,
  type BrandSlug,
  type Product,
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
 */
const COMPARE_ROWS = [
  "Стандарт",
  "Режим работы",
  "Радиус действия",
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

  return (
    <div className="page-anim">
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
            <LocaleLink to="/radiocom" className="pill pill-primary">
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
  const answers = (labelRu: string) =>
    list.filter((p) => rowValue(p, labelRu, "ru") !== undefined).length;

  const rows = COMPARE_ROWS.filter((labelRu) => answers(labelRu) * 2 >= list.length).map(
    (labelRu) => {
      const sample = list
        .flatMap((p) => specs[p.id]?.rows ?? [])
        .find((r) => r.label.ru === labelRu);
      return { id: labelRu, label: sample ? pick(sample.label, lang) : rowLabel(labelRu, lang, t) };
    },
  );

  const columns: CompareColumn[] = list.map((p) => columnFor(p, rows, lang));

  return (
    <Section band={band} tight>
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
        className="pill pill-sm pill-primary"
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
 * One cell's value, by the Russian spec label.
 *
 * "Радиус действия" is deliberately special-cased. Range is the single figure a
 * two-way radio is chosen on, and it lives on the `Product` record as
 * `rangeCity`/`rangeOpen` — not in `specs[].rows`, where only one model happens
 * to repeat it. Reading only the spec rows left that row seven-eighths empty on
 * the Radiocom table: the most important line in the comparison, blank for
 * every model that has the data.
 */
function rowValue(p: Product, labelRu: string, lang: Lang): string | undefined {
  if (labelRu === "Радиус действия") {
    return pick(p.rangeCity, lang);
  }
  const row = specs[p.id]?.rows.find((r) => r.label.ru === labelRu);
  return row ? pick(row.value, lang) : undefined;
}

/**
 * Fallback heading for a row no spec sheet supplies a label for — currently
 * only the synthesised range row, which takes the site's own wording.
 */
function rowLabel(labelRu: string, lang: Lang, t: (k: string) => string): string {
  return labelRu === "Радиус действия" ? t("px.range_city") : labelRu;
}

function columnFor(p: Product, rows: { id: string }[], lang: Lang): CompareColumn {
  return {
    id: p.id,
    // The brand is already the table's heading, so repeating it in every
    // column just eats horizontal room that the specs need.
    name: p.name.replace(/^Radiocom |^Motorola /, ""),
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
