import { notFound, useParams } from "@tanstack/react-router";
import { LocaleLink } from "@/components/LocaleLink";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Check, FileDown } from "lucide-react";
import { products, categoryLabels, formatPrice, type Product } from "@/data/products";
import { getSpec, RANGE_NOTE, type ProductSpec } from "@/data/specs";
import { formatBoxLine, pick, type Lang } from "@/data/spec-dict";
import { openLead } from "@/components/LeadFormSheet";
import { spring, springSoft, fadeUpAt } from "@/lib/springs";
import { ProductCard } from "@/components/ProductCard";
import { FeatureCard, ScrollRow, ScrollItem } from "@/components/apple";
import { SectionHead } from "@/components/Section";
import catalogAsset from "@/assets/radiocom-catalog.pdf.asset.json";
import { assetUrl } from "@/lib/asset";
import {
  SITE_NAME,
  breadcrumbSchema,
  jsonLd,
  localeLinks,
  pageMeta,
  productSchema,
  type SeoLang,
} from "@/lib/seo";
import { tFor } from "@/lib/i18n";

export const routeOptions = {
  loader: ({ params }: { params: { lang: string; id: string } }) => {
    const product = products.find((p) => p.id === params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({
    params,
    loaderData,
  }: {
    params: { lang: SeoLang; id: string };
    loaderData?: { product: Product };
  }) => {
    const p = loaderData?.product;
    if (!p) return {};
    const t = tFor(params.lang);
    const path = `/catalog/${p.id}`;
    const title = t("meta.product.title", { name: p.name });
    const description = t("meta.product.desc", {
      name: p.name,
      blurb: pick(p.blurb, params.lang),
      range: pick(p.rangeCity, params.lang),
      price: formatPrice(p.price, params.lang),
    });
    const spec = getSpec(p.id);

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
            specNames: spec?.rows.map((r) => pick(r.label, params.lang)),
          }),
        ),
        jsonLd(
          breadcrumbSchema(
            [
              { name: SITE_NAME, path: "/" },
              { name: t("meta.crumb.catalog"), path: "/catalog" },
              { name: p.name, path },
            ],
            params.lang,
          ),
        ),
      ],
    };
  },
  component: ProductPage,
};

/** Spec rows worth surfacing as tiles beside the gallery, in priority order. */
const HERO_SPEC_LABELS = [
  "Радиус действия",
  "Количество каналов",
  "Класс защиты",
  "Время работы от аккумулятора",
  "Мощность передатчика",
  "Зоны и каналы",
];

export function ProductPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const product = products.find((p) => p.id === id)!;
  const { i18n } = useTranslation();
  const lang = ((i18n.language.slice(0, 2) as Lang) || "ru") satisfies Lang;
  const spec = getSpec(product.id);

  return (
    <div className="page-anim">
      <ProductSubNav product={product} lang={lang} />
      <Breadcrumbs product={product} />
      <ProductMain product={product} lang={lang} spec={spec} />
      {spec && spec.features.length > 0 && <Highlights spec={spec} lang={lang} />}
      {spec && <InBox product={product} spec={spec} lang={lang} />}
      {spec && <TechSpecs product={product} spec={spec} lang={lang} />}
      <Related product={product} lang={lang} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Sticky product sub-nav — name left, price and buy right
   ───────────────────────────────────────────────────────────── */

function ProductSubNav({ product, lang }: { product: Product; lang: Lang }) {
  const { t } = useTranslation();
  const links = [
    { href: "#highlights", label: t("product.features") },
    { href: "#in-box", label: t("product.in_box") },
    { href: "#specs", label: t("product.tech_specs") },
  ];
  return (
    <div className="sticky top-12 z-30 frost-nav">
      <div className="mx-auto flex max-w-[1200px] items-center gap-4 px-4 py-2.5 md:px-8">
        <LocaleLink
          to="/catalog"
          className="flex shrink-0 items-center gap-1 text-[13px] text-cool transition-opacity hover:opacity-70"
          aria-label={t("product.all_models")}
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
        </LocaleLink>
        <div className="min-w-0 flex-1 truncate text-[15px] font-semibold tracking-tight text-crisp">
          {product.name}
        </div>
        <nav aria-label={t("product.overview")} className="hidden items-center gap-5 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] text-cool transition-colors hover:text-crisp"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden text-[13px] text-cool sm:block">
          {formatPrice(product.price, lang)}
        </div>
        <button
          onClick={() => openLead({ product: product.name })}
          className="pill pill-accent pill-sm shrink-0"
        >
          {t("product.cta")}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Breadcrumbs
   ───────────────────────────────────────────────────────────── */

function Breadcrumbs({ product }: { product: Product }) {
  const { t } = useTranslation();
  return (
    <nav aria-label={t("product.breadcrumb")} className="band-plain px-6 pt-8">
      <ol className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-1.5 text-[12px] text-cool">
        <li>
          <LocaleLink to="/" className="transition-colors hover:text-crisp">
            {t("nav.home")}
          </LocaleLink>
        </li>
        <li aria-hidden className="opacity-40">
          /
        </li>
        <li>
          <LocaleLink to="/catalog" className="transition-colors hover:text-crisp">
            {t("nav.catalog")}
          </LocaleLink>
        </li>
        <li aria-hidden className="opacity-40">
          /
        </li>
        <li aria-current="page" className="text-crisp">
          {product.name}
        </li>
      </ol>
    </nav>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main — apple.com product layout: gallery left, buy panel right
   ───────────────────────────────────────────────────────────── */

function ProductMain({
  product,
  lang,
  spec,
}: {
  product: Product;
  lang: Lang;
  spec?: ProductSpec;
}) {
  const { t } = useTranslation();
  const shots = [product.image, ...(product.gallery ?? [])];
  const [i, setI] = useState(0);
  const idx = Math.min(i, shots.length - 1);
  const reduced = useReducedMotion();

  const heroSpecs = (spec?.rows ?? [])
    .filter((r) => HERO_SPEC_LABELS.includes(r.label.ru))
    .sort((a, b) => HERO_SPEC_LABELS.indexOf(a.label.ru) - HERO_SPEC_LABELS.indexOf(b.label.ru))
    .slice(0, 4);

  return (
    <section className="band-plain px-4 pb-16 pt-8 md:px-6 md:pb-24">
      <div className="mx-auto grid max-w-[1200px] items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        {/* Gallery — sticks while the buy panel scrolls */}
        <div className="lg:sticky lg:top-28">
          <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[28px] bg-charcoal md:aspect-[5/4]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={shots[idx]}
                src={shots[idx]}
                alt={`${product.name} — ${idx + 1}`}
                width={1024}
                height={1024}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={spring}
                className={`max-h-[78%] max-w-[78%] object-contain mix-blend-multiply ${
                  reduced ? "" : "float-slow"
                }`}
              />
            </AnimatePresence>

            {shots.length > 1 && (
              <>
                <GalleryArrow
                  side="left"
                  label={t("product.prev")}
                  onClick={() => setI((idx - 1 + shots.length) % shots.length)}
                />
                <GalleryArrow
                  side="right"
                  label={t("product.next")}
                  onClick={() => setI((idx + 1) % shots.length)}
                />
                <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
                  {shots.map((s, si) => (
                    <button
                      key={s}
                      onClick={() => setI(si)}
                      aria-label={`${product.name} — ${si + 1}`}
                      aria-current={si === idx}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        si === idx ? "bg-crisp" : "bg-crisp/25 hover:bg-crisp/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {shots.length > 1 && (
            <div className="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto">
              {shots.map((src, si) => (
                <button
                  key={src}
                  onClick={() => setI(si)}
                  aria-label={`${product.name} — ${si + 1}`}
                  className={`h-16 w-16 shrink-0 rounded-2xl bg-charcoal p-2 ring-1 transition-all duration-300 ${
                    si === idx ? "ring-2 ring-signal" : "ring-border hover:ring-crisp/30"
                  }`}
                >
                  <img
                    width={1200}
                    height={900}
                    src={src}
                    alt=""
                    className="h-full w-full object-contain mix-blend-multiply"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Buy panel */}
        <div className="lg:pt-4">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springSoft}
          >
            <div className="type-caption uppercase tracking-[0.14em] text-signal">
              {product.brand} · {categoryLabels[product.category][lang]}
            </div>

            <h1 className="type-title mt-2 text-[34px] leading-[1.08] text-crisp md:text-[44px]">
              {product.name}
            </h1>

            <p className="subhead mt-3 text-[17px]">{pick(product.blurb, lang)}</p>

            {spec?.intro ? (
              <p className="mt-4 text-[15px] leading-relaxed text-cool">{pick(spec.intro, lang)}</p>
            ) : null}

            <div className="mt-6 text-[28px] font-semibold tracking-tight text-crisp">
              {formatPrice(product.price, lang)}
            </div>

            {/* Key specs as tiles — the apple.com storage-picker shape, read-only */}
            {heroSpecs.length > 0 && (
              <dl className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {heroSpecs.map((r) => (
                  <div key={r.label.ru} className="rounded-2xl border border-border px-4 py-3.5">
                    <dt className="text-[12px] text-cool">{pick(r.label, lang)}</dt>
                    <dd className="mt-0.5 text-[15px] font-medium leading-snug text-crisp">
                      {pick(r.value, lang)}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            {spec?.colour ? (
              <div className="mt-4 flex items-center gap-2 text-[14px] text-cool">
                <span>{t("product.colour")}:</span>
                <span className="text-crisp">{pick(spec.colour, lang)}</span>
              </div>
            ) : null}

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() => openLead({ product: product.name })}
                className="pill pill-accent flex-1 sm:flex-none"
              >
                {t("product.cta")}
              </button>
              <a
                href={assetUrl(catalogAsset)}
                download="radiocom-catalog.pdf"
                className="pill pill-ghost"
              >
                <FileDown className="h-4 w-4" aria-hidden /> {t("nav.download")}
              </a>
            </div>

            <p className="mt-3 text-[12px] text-cool">{t("form.trust_line")}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function GalleryArrow({
  side,
  onClick,
  label,
}: {
  side: "left" | "right";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 -translate-y-1/2 ${
        side === "left" ? "left-4" : "right-4"
      } flex h-10 w-10 items-center justify-center rounded-full bg-popover/80 text-crisp ring-1 ring-border backdrop-blur-xl transition-transform duration-200 hover:scale-105 active:scale-95`}
    >
      <ChevronRight className={`h-4 w-4 ${side === "left" ? "rotate-180" : ""}`} aria-hidden />
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   Highlights — feature cards on a grey band
   ───────────────────────────────────────────────────────────── */

function Highlights({ spec, lang }: { spec: ProductSpec; lang: Lang }) {
  const { t } = useTranslation();
  const cards = spec.features.slice(0, 4);
  const rest = spec.features.slice(4);

  return (
    <section id="highlights" className="band-soft section-tight px-4 md:px-6">
      <div className="mx-auto max-w-[1200px]">
        <SectionHead title={t("product.features")} align="left" spacing="tight" />

        <ScrollRow cols={4}>
          {cards.map((f, i) => (
            <ScrollItem key={`${f.ru}-${i}`}>
              <FeatureCard
                idx={i}
                tone={i === 1 ? "dark" : "light"}
                eyebrow={String(i + 1).padStart(2, "0")}
                title={pick(f, lang)}
                className="h-full min-h-[220px]"
              />
            </ScrollItem>
          ))}
        </ScrollRow>

        {rest.length > 0 && (
          <motion.ul
            {...fadeUpAt(1)}
            className="mt-8 grid gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {rest.map((f, i) => (
              <li key={`${f.ru}-${i}`} className="flex items-start gap-2.5 text-[15px] text-crisp">
                <Check className="mt-1 h-4 w-4 shrink-0 text-signal" aria-hidden />
                <span className="leading-snug">{pick(f, lang)}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   In the box
   ───────────────────────────────────────────────────────────── */

function InBox({ product, spec, lang }: { product: Product; spec: ProductSpec; lang: Lang }) {
  const { t } = useTranslation();
  return (
    <section id="in-box" className="band-plain section-tight px-4 md:px-6">
      <div className="mx-auto max-w-[1200px]">
        <SectionHead title={t("product.in_box")} align="left" spacing="tight" />
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div
            {...fadeUpAt(0)}
            className="flex aspect-[4/3] items-center justify-center rounded-[28px] bg-charcoal"
          >
            <img
              width={1200}
              height={900}
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="max-h-[70%] max-w-[70%] object-contain mix-blend-multiply"
            />
          </motion.div>

          <motion.ul {...fadeUpAt(1)} className="divide-y divide-border">
            {spec.inBox.map((line, i) => (
              <li
                key={`${line.item.ru}-${i}`}
                className="flex items-start gap-3 py-3.5 text-[16px] text-crisp"
              >
                <Check className="mt-1 h-4 w-4 shrink-0 text-signal" aria-hidden />
                <span className="leading-snug">{formatBoxLine(line, lang)}</span>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Tech specs
   ───────────────────────────────────────────────────────────── */

function TechSpecs({ product, spec, lang }: { product: Product; spec: ProductSpec; lang: Lang }) {
  const { t } = useTranslation();
  return (
    <section id="specs" className="band-soft section-tight px-4 md:px-6">
      <div className="mx-auto max-w-[900px]">
        <SectionHead title={t("product.tech_specs")} align="left" spacing="tight" />

        <motion.dl {...fadeUpAt(1)} className="divide-y divide-border border-t border-border">
          {spec.rows.map((r, i) => (
            <div
              key={`${r.label.ru}-${i}`}
              className="grid gap-1 py-4 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-6"
            >
              <dt className="text-[14px] text-cool">{pick(r.label, lang)}</dt>
              <dd className="text-[15px] leading-snug text-crisp">{pick(r.value, lang)}</dd>
            </div>
          ))}
          <div className="grid gap-1 py-4 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-6">
            <dt className="text-[14px] text-cool">{t("catalog.price")}</dt>
            <dd className="text-[15px] font-medium text-crisp">
              {formatPrice(product.price, lang)}
            </dd>
          </div>
        </motion.dl>

        {spec.rangeNote && (
          <motion.p {...fadeUpAt(2)} className="mt-6 text-[13px] leading-relaxed text-cool">
            <span aria-hidden>* </span>
            {pick(RANGE_NOTE, lang)}
          </motion.p>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Related
   ───────────────────────────────────────────────────────────── */

function Related({ product, lang }: { product: Product; lang: Lang }) {
  const { t } = useTranslation();
  const related = products
    .filter((p) => p.id !== product.id && p.brand === product.brand)
    .sort(
      (a, b) =>
        Math.abs((a.price ?? 0) - (product.price ?? 0)) -
        Math.abs((b.price ?? 0) - (product.price ?? 0)),
    )
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="band-plain section-tight px-4 md:px-6">
      <div className="mx-auto max-w-[1200px]">
        <SectionHead title={t("product.related")} align="left" spacing="tight" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p, i) => (
            <ProductCard key={p.id} p={p} lang={lang} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
