import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ChevronRight, FileDown } from "lucide-react";
import { products, categoryLabels, allBrands, formatPrice, type Brand, type Category, type Product } from "@/data/products";
import { openLead } from "@/components/LeadFormSheet";
import catalogAsset from "@/assets/radiocom-catalog.pdf.asset.json";
import { spring } from "@/lib/springs";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: [
      { title: "Catalog — Motorola, Hytera, PoC & Amateur Radios | Radiocom" },
      { name: "description", content: "Filterable multi-brand catalog: professional and amateur radios, PoC devices, accessories, PDAs and baby monitors." },
      { property: "og:title", content: "Radiocom Catalog — Multi-brand radio systems" },
      { property: "og:description", content: "Professional and amateur radios from Motorola, Hytera, Radiocom RC, Caltta and more." },
    ],
  }),
  component: CatalogPage,
});

function CatalogPage() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language.slice(0, 2) as "ru" | "en" | "uz") || "ru";
  const [cat, setCat] = useState<Category | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);

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
              <FilterChip active={!cat && !brand} onClick={() => { setCat(null); setBrand(null); }}>
                {t("catalog.all")}
              </FilterChip>
              {categories.map((c) => (
                <FilterChip key={c} active={cat === c} onClick={() => setCat(cat === c ? null : c)}>
                  {categoryLabels[c][lang]}
                </FilterChip>
              ))}
              <div className="mx-2 h-4 w-px bg-border shrink-0" />
              {allBrands.map((b) => (
                <FilterChip key={b} active={brand === b} onClick={() => setBrand(brand === b ? null : b)}>
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
              href={catalogAsset.url}
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
                <ProductCard key={p.id} p={p} lang={lang} idx={i} onOpen={() => setSelected(p)} />
              ))}
            </div>
          )}
        </div>
      </section>

      <ProductPanel product={selected} lang={lang} onClose={() => setSelected(null)} />
    </div>
  );

}

function ProductGallery({ product }: { product: Product }) {
  const shots = [product.image, ...(product.gallery ?? [])];
  const [i, setI] = useState(0);
  const idx = Math.min(i, shots.length - 1);
  return (
    <div className="mb-8">
      <div className="relative rounded-3xl bg-charcoal aspect-[4/3] flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={shots[idx]}
            src={shots[idx]}
            alt={product.name}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="max-h-full max-w-full object-contain mix-blend-multiply"
          />
        </AnimatePresence>
        {shots.length > 1 && (
          <>
            <GalleryArrow side="left" onClick={() => setI((idx - 1 + shots.length) % shots.length)} />
            <GalleryArrow side="right" onClick={() => setI((idx + 1) % shots.length)} />
          </>
        )}
      </div>
      {shots.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {shots.map((src, si) => (
            <button
              key={src}
              onClick={() => setI(si)}
              aria-label={`${product.name} ${si + 1}`}
              className={`h-16 w-16 shrink-0 rounded-xl bg-charcoal p-1.5 ring-1 transition-colors ${
                si === idx ? "ring-signal" : "ring-border hover:ring-crisp/30"
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-contain mix-blend-multiply" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function GalleryArrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={side}
      className={`absolute top-1/2 -translate-y-1/2 ${side === "left" ? "left-3" : "right-3"} h-9 w-9 rounded-full bg-popover/90 ring-1 ring-border flex items-center justify-center text-crisp hover:bg-popover`}
    >
      <ChevronRight className={`w-4 h-4 ${side === "left" ? "rotate-180" : ""}`} />
    </button>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {

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

function ProductPanel({
  product, lang, onClose,
}: { product: Product | null; lang: "ru" | "en" | "uz"; onClose: () => void }) {
  const { t } = useTranslation();
  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-[90]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
          <motion.aside
            className="absolute right-0 top-0 h-full w-full max-w-[600px] bg-pitch overflow-y-auto md:rounded-l-3xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={spring}
          >
            <div className="p-8 md:p-10">
              <div className="flex items-start justify-between mb-8">
                <div className="text-[13px] text-signal">{product.brand}</div>
                <button
                  onClick={onClose}
                  className="h-9 w-9 flex items-center justify-center rounded-full bg-charcoal text-crisp hover:opacity-70"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ProductGallery product={product} />

              <h2 className="headline text-3xl md:text-4xl text-crisp">{product.name}</h2>
              <div className="text-[13px] text-cool mt-2">{categoryLabels[product.category][lang]}</div>
              <div className="text-2xl text-crisp mt-4 font-semibold">{formatPrice(product.price, lang)}</div>
              <p className="subhead text-[15px] mt-4">{product.blurb}</p>

              <div className="mt-8 rounded-2xl bg-charcoal p-5">
                <div className="text-[13px] text-cool mb-3">{t("product.spec")}</div>
                <dl className="space-y-2">
                  <SpecRow label={t("product.range_city")} val={product.rangeCity} />
                  {product.rangeOpen && <SpecRow label={t("product.range_open")} val={product.rangeOpen} />}
                </dl>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {product.tags.map((tg) => (
                  <span key={tg} className="text-[12px] rounded-full bg-charcoal px-3 py-1.5 text-crisp/80 inline-flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-signal" /> {tg}
                  </span>
                ))}
              </div>

              <button
                onClick={() => { onClose(); setTimeout(() => openLead({ product: product.name }), 350); }}
                className="pill pill-accent w-full mt-8"
              >
                {t("product.cta")}
              </button>
              <div className="mt-3 text-center text-[12px] text-cool">{t("form.trust_line")}</div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SpecRow({ label, val }: { label: string; val: string }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-[14px]">
      <dt className="text-cool">{label}</dt>
      <dd className="text-crisp text-right">{val}</dd>
    </div>
  );
}
