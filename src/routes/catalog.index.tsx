import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FileDown } from "lucide-react";
import { products, categoryLabels, allBrands, type Brand, type Category } from "@/data/products";
import catalogAsset from "@/assets/radiocom-catalog.pdf.asset.json";
import { spring } from "@/lib/springs";
import { ProductCard } from "@/components/ProductCard";
import { assetUrl } from "@/lib/asset";
import { absolute, breadcrumbSchema, canonical, itemListSchema, jsonLd } from "@/lib/seo";

export const Route = createFileRoute("/catalog/")({
  head: () => {
    const title = `Каталог рации — ${products.length} моделей Motorola и Radiocom | Radiocom`;
    const description = `Полный каталог радиостанций в Ташкенте: ${products.length} моделей Motorola Talkabout, TLKR, XT и Radiocom RC/RCD. PMR и DMR, цены в сумах, официальная гарантия, бесплатный тест перед покупкой.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: absolute("/catalog") },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [canonical("/catalog")],
      scripts: [
        jsonLd(itemListSchema(products)),
        jsonLd(
          breadcrumbSchema([
            { name: "Radiocom", path: "/" },
            { name: "Каталог", path: "/catalog" },
          ]),
        ),
      ],
    };
  },
  component: CatalogPage,
});

function CatalogPage() {
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
            className="headline text-crisp text-5xl md:text-7xl"
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
        <div className="max-w-[1200px] mx-auto">
          <div className="overflow-x-auto no-scrollbar mask-fade-x">
            <div className="flex items-center gap-2 px-4 md:px-6 py-3 whitespace-nowrap">
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
      <section className="bg-pitch px-4 md:px-6 py-10 md:py-14">
        <div className="max-w-[1200px] mx-auto">
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
    </div>
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
