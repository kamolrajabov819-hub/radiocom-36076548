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

  // Only keep rows at least one model in this table answers, so the table never
  // renders a line of nothing but em dashes.
  const rows = COMPARE_ROWS.filter((labelRu) =>
    list.some((p) => specs[p.id]?.rows.some((r) => r.label.ru === labelRu)),
  ).map((labelRu) => {
    const sample = list.flatMap((p) => specs[p.id]?.rows ?? []).find((r) => r.label.ru === labelRu);
    return { id: labelRu, label: sample ? pick(sample.label, lang) : labelRu };
  });

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
      <CompareTable columns={columns} rows={rows} caption={t(`brand.${brandSlug}_title`)} />
    </Section>
  );
}

function columnFor(p: Product, rows: { id: string }[], lang: Lang): CompareColumn {
  const spec = specs[p.id];
  return {
    id: p.id,
    // The brand is already the table's heading, so repeating it in every
    // column just eats horizontal room that the specs need.
    name: p.name.replace(/^Radiocom |^Motorola /, ""),
    tagline: pick(p.blurb, lang),
    note: formatPrice(p.price, lang),
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
    values: Object.fromEntries(
      rows.map((r) => {
        const row = spec?.rows.find((x) => x.label.ru === r.id);
        return [r.id, row ? pick(row.value, lang) : undefined];
      }),
    ),
  };
}
