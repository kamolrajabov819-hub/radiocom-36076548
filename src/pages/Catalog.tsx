import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FileDown } from "lucide-react";
import {
  products,
  categoryLabels,
  allBrands,
  formatPrice,
  type Brand,
  type Category,
} from "@/data/products";
import catalogAsset from "@/assets/radiocom-catalog.pdf.asset.json";
import { spring, fadeUpAt } from "@/lib/springs";
import { ProductCard } from "@/components/ProductCard";
import { SectionHead } from "@/components/Section";
import { CompareTable, type CompareColumn } from "@/components/apple";
import { getSpec } from "@/data/specs";
import { pick, type Lang } from "@/data/spec-dict";
import { assetUrl } from "@/lib/asset";
import {
  SITE_NAME,
  breadcrumbSchema,
  itemListSchema,
  jsonLd,
  localeLinks,
  pageMeta,
  type SeoLang,
} from "@/lib/seo";
import { tFor } from "@/lib/i18n";

export const routeOptions = {
  head: ({ params }: { params: { lang: SeoLang } }) => {
    const t = tFor(params.lang);
    // Named `count` so i18next selects the Russian numeral form: 24 модели,
    // 25 моделей. A plain interpolation cannot decline the noun.
    const count = products.length;
    const title = t("meta.catalog.title", { count });
    const description = t("meta.catalog.desc", { count });

    return {
      meta: pageMeta({ lang: params.lang, title, description, path: "/catalog" }),
      links: localeLinks(params.lang, "/catalog"),
      scripts: [
        jsonLd(itemListSchema(products, params.lang)),
        jsonLd(
          breadcrumbSchema(
            [
              { name: SITE_NAME, path: "/" },
              { name: t("meta.crumb.catalog"), path: "/catalog" },
            ],
            params.lang,
          ),
        ),
      ],
    };
  },
  component: CatalogPage,
};

export function CatalogPage() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language.slice(0, 2) as "ru" | "en" | "uz") || "ru";
  const [cat, setCat] = useState<Category | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (cat && p.category !== cat) return false;
      if (brand && p.brand !== brand) return false;
      return true;
    });
  }, [cat, brand]);

  const categories = Object.keys(categoryLabels) as Category[];

  return (
    <div className="page-anim">
      {/* Hero */}

      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-pitch px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
            className="type-display text-crisp"
          >
            {t("catalog.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
            className="subhead mt-4 text-lg md:text-xl"
          >
            {t("catalog.sub")}
          </motion.p>
        </div>
      </section>

      {/* Sticky filter bar */}
      <div className="sticky top-12 z-30 frost-nav">
        <div className="shell">
          <div className="overflow-x-auto no-scrollbar mask-fade-x">
            <div className="flex items-center gap-2 py-3 whitespace-nowrap">
              <FilterChip
                active={!cat && !brand}
                onClick={() => {
                  setCat(null);
                  setBrand(null);
                }}
              >
                {t("catalog.all")}
              </FilterChip>
              {categories.map((c) => (
                <FilterChip key={c} active={cat === c} onClick={() => setCat(cat === c ? null : c)}>
                  {categoryLabels[c][lang]}
                </FilterChip>
              ))}
              <div className="mx-2 h-4 w-px bg-border shrink-0" />
              {allBrands.map((b) => (
                <FilterChip
                  key={b}
                  active={brand === b}
                  onClick={() => setBrand(brand === b ? null : b)}
                >
                  {b}
                </FilterChip>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="bg-pitch py-10 md:py-14">
        <div className="shell">
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="text-[13px] text-cool">
              {filtered.length} {t("catalog.results")}
            </div>
            <a
              href={assetUrl(catalogAsset)}
              download="radiocom-catalog.pdf"
              className="pill pill-ghost pill-sm"
            >
              <FileDown className="w-3.5 h-3.5" /> {t("nav.download")}
            </a>
          </div>

          {filtered.length === 0 ? (
            <div className="py-32 text-center text-cool">{t("catalog.empty")}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} p={p} lang={lang} idx={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Compare lang={lang} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   "Which radio is right for you?" — apple.com's compare table

   Four representative models across the range, drawn from the same spec sheets
   the product pages use, so the table cannot drift from the products. A model
   without a given spec shows an em dash — that gap is the comparison.
   ───────────────────────────────────────────────────────────── */
const COMPARE_IDS = ["rc-10", "rcd-30", "rcd-60", "rcd-70"] as const;
const COMPARE_ROWS = [
  "Стандарт",
  "Режим работы",
  "Радиус действия",
  "Количество каналов",
  "Класс защиты",
  "Время работы от аккумулятора",
  "Ёмкость аккумулятора",
] as const;

function Compare({ lang }: { lang: Lang }) {
  const { t } = useTranslation();

  const picked = COMPARE_IDS.map((id) => products.find((p) => p.id === id)).filter(
    Boolean,
  ) as typeof products;
  if (picked.length < 2) return null;

  // Only keep rows at least one model actually answers, so the table never
  // renders a line of nothing but dashes.
  const rows = COMPARE_ROWS.filter((labelRu) =>
    picked.some((p) => getSpec(p.id)?.rows.some((r) => r.label.ru === labelRu)),
  ).map((labelRu) => {
    const sample = picked
      .flatMap((p) => getSpec(p.id)?.rows ?? [])
      .find((r) => r.label.ru === labelRu);
    return { id: labelRu, label: sample ? pick(sample.label, lang) : labelRu };
  });

  const columns: CompareColumn[] = picked.map((p) => {
    const spec = getSpec(p.id);
    return {
      id: p.id,
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
  });

  return (
    <section className="band-soft section-tight">
      <div className="mx-auto max-w-[1200px]">
        <SectionHead
          align="center"
          spacing="tight"
          title={t("catalog.compare_title")}
          sub={t("catalog.compare_sub")}
        />
        <motion.div {...fadeUpAt(1)}>
          <CompareTable columns={columns} rows={rows} caption={t("catalog.compare_title")} />
        </motion.div>
      </div>
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-1.5 text-[13px] transition-colors ${
        active ? "bg-crisp text-pitch" : "bg-charcoal text-crisp/80 hover:text-crisp"
      }`}
    >
      {children}
    </button>
  );
}
