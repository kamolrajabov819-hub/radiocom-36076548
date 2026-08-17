import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Check, Package, FileDown } from "lucide-react";
import { products, categoryLabels, formatPrice, type Product } from "@/data/products";
import { getSpec, RANGE_NOTE, type ProductSpec } from "@/data/specs";
import { formatBoxLine, pick, type Lang } from "@/data/spec-dict";
import { openLead } from "@/components/LeadFormSheet";
import { spring, springSoft, fadeUpAt } from "@/lib/springs";
import { ProductCard } from "@/components/ProductCard";
import catalogAsset from "@/assets/radiocom-catalog.pdf.asset.json";
import { assetUrl } from "@/lib/asset";
import { absolute, breadcrumbSchema, canonical, jsonLd, productSchema } from "@/lib/seo";

export const Route = createFileRoute("/catalog/$id")({
  loader: ({ params }) => {
    const product = products.find((p) => p.id === params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p) return {};
    const path = `/catalog/${p.id}`;
    const title = `${p.name} — ${p.brand} | Radiocom`;
    // Lead the description with the concrete buying facts (range, price, city) —
    // those are the terms local search actually matches on.
    const description = `${p.blurb} Дальность ${p.rangeCity}. ${formatPrice(p.price, "ru")}. Официальная гарантия, доставка по Узбекистану, сервис в Ташкенте.`;
    const spec = getSpec(p.id);

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: absolute(path) },
        { property: "og:image", content: absolute(p.image) },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: absolute(p.image) },
      ],
      links: [canonical(path)],
      scripts: [
        jsonLd(
          productSchema(p, {
            specNames: spec?.rows.map((r) => r.label.ru),
          }),
        ),
        jsonLd(
          breadcrumbSchema([
            { name: "Radiocom", path: "/" },
            { name: "Каталог", path: "/catalog" },
            { name: p.name, path },
          ]),
        ),
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { t, i18n } = useTranslation();
  const lang = ((i18n.language.slice(0, 2) as Lang) || "ru") satisfies Lang;
  const spec = getSpec(product.id);

  return (
    <div className="page-anim">
      <ProductSubNav product={product} lang={lang} />
      <Breadcrumbs product={product} />
      <ProductHero product={product} lang={lang} spec={spec} />
      {spec?.intro && <IntroBand text={pick(spec.intro, lang)} />}
      <Gallery product={product} />
      {spec && <InBox spec={spec} lang={lang} />}
      {spec && spec.features.length > 0 && <Features spec={spec} lang={lang} />}
      {spec && <TechSpecs product={product} spec={spec} lang={lang} />}
      <Related product={product} lang={lang} />
      <BuyBand product={product} lang={lang} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Breadcrumbs — the visible counterpart to the BreadcrumbList schema
   ───────────────────────────────────────────────────────────── */

function Breadcrumbs({ product }: { product: Product }) {
  const { t } = useTranslation();
  return (
    <nav aria-label="Breadcrumb" className="band-soft px-6 pt-6">
      <ol className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-1.5 text-[13px] text-cool">
        <li>
          <Link to="/" className="transition-colors hover:text-crisp">
            {t("nav.home")}
          </Link>
        </li>
        <li aria-hidden className="opacity-40">
          /
        </li>
        <li>
          <Link to="/catalog" className="transition-colors hover:text-crisp">
            {t("nav.catalog")}
          </Link>
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
   Sticky product sub-nav — Apple's second-level bar
   ───────────────────────────────────────────────────────────── */

function ProductSubNav({ product, lang }: { product: Product; lang: Lang }) {
  const { t } = useTranslation();
  const links = [
    { href: "#overview", label: t("product.overview") },
    { href: "#in-box", label: t("product.in_box") },
    { href: "#specs", label: t("product.tech_specs") },
  ];
  return (
    <div className="sticky top-12 z-30 frost-nav">
      <div className="mx-auto flex max-w-[1200px] items-center gap-4 px-4 py-2.5 md:px-8">
        <Link
          to="/catalog"
          className="flex shrink-0 items-center gap-1 text-[13px] text-cool transition-opacity hover:opacity-70"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{t("catalog.title_a")}</span>
        </Link>
        <div className="min-w-0 flex-1 truncate text-[15px] font-semibold tracking-tight text-crisp">
          {product.name}
        </div>
        <nav className="hidden items-center gap-5 lg:flex">
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
   Hero — big type, product on a stage, scroll-linked parallax
   ───────────────────────────────────────────────────────────── */

function ProductHero({
  product,
  lang,
  spec,
}: {
  product: Product;
  lang: Lang;
  spec?: ProductSpec;
}) {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Parallax lift + gentle scale-down as the hero leaves — skipped entirely under reduced motion.
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -70]);
  const scale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1, 0.93]);
  const fade = useTransform(scrollYProgress, [0, 0.85], reduced ? [1, 1] : [1, 0.25]);

  const headline = product.name.replace(/^Motorola |^Radiocom /, "");

  return (
    <section
      id="overview"
      ref={ref}
      className="band-soft relative overflow-hidden pt-14 pb-16 md:pt-20 md:pb-24"
    >
      <div className="hero-glow" aria-hidden />
      <div className="relative mx-auto max-w-[1200px] px-6">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
            className="type-caption uppercase tracking-[0.14em] text-signal"
          >
            {product.brand} · {categoryLabels[product.category][lang]}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springSoft, delay: 0.05 }}
            className="type-display mt-3 text-crisp"
          >
            {headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springSoft, delay: 0.12 }}
            className="subhead mx-auto mt-4 max-w-2xl text-[17px] md:text-xl"
          >
            {product.blurb}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springSoft, delay: 0.18 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          >
            <div className="text-[19px] font-semibold text-crisp">
              {formatPrice(product.price, lang)}
            </div>
            <button
              onClick={() => openLead({ product: product.name })}
              className="pill pill-primary"
            >
              {t("product.cta")}
            </button>
          </motion.div>
        </div>

        {/* Product stage */}
        <motion.div style={{ y, scale, opacity: fade }} className="stage relative mt-10 md:mt-14">
          <motion.img
            src={product.image}
            alt={product.name}
            width={1024}
            height={1024}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...springSoft, delay: 0.1 }}
            className={`h-[300px] w-auto max-w-full object-contain mix-blend-multiply md:h-[440px] ${
              reduced ? "" : "float-slow"
            }`}
          />
        </motion.div>

        {/* Headline spec strip */}
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-6 border-t border-border pt-8 md:mt-14 md:grid-cols-4">
          <HeroStat label={t("product.range_city")} value={product.rangeCity} idx={0} />
          {product.rangeOpen && (
            <HeroStat label={t("product.range_open")} value={product.rangeOpen} idx={1} />
          )}
          {spec?.colour && (
            <HeroStat label={t("product.colour")} value={pick(spec.colour, lang)} idx={2} />
          )}
          <HeroStat
            label={t("product.kit_label")}
            value={String(spec?.inBox.find((b) => b.qty)?.qty ?? 1)}
            idx={3}
          />
        </div>
      </div>
    </section>
  );
}

function HeroStat({ label, value, idx }: { label: string; value: string; idx: number }) {
  return (
    <motion.div {...fadeUpAt(idx)}>
      <div className="type-caption">{label}</div>
      <div className="mt-1 text-[17px] font-medium tracking-tight text-crisp md:text-[19px]">
        {value}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Vendor intro paragraph, set large — Apple's editorial band
   ───────────────────────────────────────────────────────────── */

function IntroBand({ text }: { text: string }) {
  return (
    <section className="band-plain section-tight px-6">
      <motion.p
        {...fadeUpAt(0)}
        className="mx-auto max-w-4xl text-center text-[22px] font-semibold leading-[1.35] tracking-[-0.02em] text-crisp md:text-[32px]"
      >
        {text}
      </motion.p>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Gallery — 1:1 thumb selection, cross-fading main shot
   ───────────────────────────────────────────────────────────── */

function Gallery({ product }: { product: Product }) {
  const { t } = useTranslation();
  const shots = [product.image, ...(product.gallery ?? [])];
  const [i, setI] = useState(0);
  const idx = Math.min(i, shots.length - 1);
  if (shots.length < 2) return null;

  const go = (d: number) => setI((idx + d + shots.length) % shots.length);

  return (
    <section className="band-soft section-tight px-4 md:px-6">
      <div className="mx-auto max-w-[1100px]">
        <motion.h2 {...fadeUpAt(0)} className="type-headline mb-8 text-center text-crisp">
          {t("product.gallery")}
        </motion.h2>

        <motion.div {...fadeUpAt(1)} className="relative">
          <div className="bento-card relative flex aspect-[4/3] items-center justify-center bg-pitch">
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={shots[idx]}
                src={shots[idx]}
                alt={`${product.name} — ${idx + 1}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.01 }}
                transition={spring}
                className="max-h-[85%] max-w-[85%] object-contain mix-blend-multiply"
              />
            </AnimatePresence>

            <GalleryArrow side="left" onClick={() => go(-1)} label={t("product.prev")} />
            <GalleryArrow side="right" onClick={() => go(1)} label={t("product.next")} />
          </div>

          <div className="no-scrollbar mt-4 flex justify-center gap-2.5 overflow-x-auto pb-1">
            {shots.map((src, si) => (
              <button
                key={src}
                onClick={() => setI(si)}
                aria-label={`${product.name} — ${si + 1}`}
                aria-current={si === idx}
                className={`h-16 w-16 shrink-0 rounded-2xl bg-pitch p-2 ring-1 transition-all duration-300 md:h-20 md:w-20 ${
                  si === idx ? "ring-2 ring-signal" : "ring-border hover:ring-crisp/30"
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-contain mix-blend-multiply" />
              </button>
            ))}
          </div>
        </motion.div>
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
        side === "left" ? "left-3 md:left-5" : "right-3 md:right-5"
      } flex h-10 w-10 items-center justify-center rounded-full bg-popover/80 text-crisp ring-1 ring-border backdrop-blur-xl transition-transform duration-200 hover:scale-105 active:scale-95`}
    >
      <ChevronRight className={`h-4 w-4 ${side === "left" ? "rotate-180" : ""}`} />
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   In the box
   ───────────────────────────────────────────────────────────── */

function InBox({ spec, lang }: { spec: ProductSpec; lang: Lang }) {
  const { t } = useTranslation();
  return (
    <section id="in-box" className="band-plain section-tight px-6">
      <div className="mx-auto max-w-[1000px]">
        <motion.div {...fadeUpAt(0)} className="mb-10 text-center">
          <Package className="mx-auto mb-4 h-6 w-6 text-signal" aria-hidden />
          <h2 className="type-headline text-crisp">{t("product.in_box")}</h2>
        </motion.div>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {spec.inBox.map((line, i) => (
            <motion.li
              key={`${line.item.ru}-${i}`}
              {...fadeUpAt(Math.min(i, 8))}
              className="flex items-start gap-3 rounded-2xl bg-charcoal px-5 py-4"
            >
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-signal" aria-hidden />
              <span className="text-[15px] leading-snug text-crisp">
                {formatBoxLine(line, lang)}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Feature list
   ───────────────────────────────────────────────────────────── */

function Features({ spec, lang }: { spec: ProductSpec; lang: Lang }) {
  const { t } = useTranslation();
  return (
    <section className="band-dark section-tight px-6">
      <div className="mx-auto max-w-[1000px]">
        <motion.h2 {...fadeUpAt(0)} className="type-headline mb-10 text-center">
          {t("product.features")}
        </motion.h2>
        <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
          {spec.features.map((f, i) => (
            <motion.li
              key={`${f.ru}-${i}`}
              {...fadeUpAt(Math.min(i, 8))}
              className="flex items-start gap-3 border-b border-white/10 pb-5"
            >
              <Check className="mt-1 h-4 w-4 shrink-0 text-signal" aria-hidden />
              <span className="text-[16px] leading-snug">{pick(f, lang)}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Tech specs table
   ───────────────────────────────────────────────────────────── */

function TechSpecs({ product, spec, lang }: { product: Product; spec: ProductSpec; lang: Lang }) {
  const { t } = useTranslation();
  return (
    <section id="specs" className="band-plain section-tight px-6">
      <div className="mx-auto max-w-[900px]">
        <motion.h2 {...fadeUpAt(0)} className="type-headline mb-10 text-center text-crisp">
          {t("product.tech_specs")}
        </motion.h2>

        <motion.dl {...fadeUpAt(1)} className="divide-y divide-border border-t border-border">
          {spec.rows.map((r, i) => (
            <div
              key={`${r.label.ru}-${i}`}
              className="grid gap-1 py-4 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-6"
            >
              <dt className="text-[14px] text-cool">{pick(r.label, lang)}</dt>
              <dd className="text-[15px] leading-snug text-crisp">{pick(r.value, lang)}</dd>
            </div>
          ))}
          <div className="grid gap-1 py-4 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-6">
            <dt className="text-[14px] text-cool">{t("catalog.price")}</dt>
            <dd className="text-[15px] font-medium text-crisp">
              {formatPrice(product.price, lang)}
            </dd>
          </div>
        </motion.dl>

        {spec.rangeNote && (
          <motion.p {...fadeUpAt(2)} className="mt-8 text-[13px] leading-relaxed text-cool">
            <span aria-hidden>* </span>
            {pick(RANGE_NOTE, lang)}
          </motion.p>
        )}

        <motion.div {...fadeUpAt(3)} className="mt-10 flex flex-wrap justify-center gap-3">
          <button onClick={() => openLead({ product: product.name })} className="pill pill-accent">
            {t("product.cta")}
          </button>
          <a
            href={assetUrl(catalogAsset)}
            download="radiocom-catalog.pdf"
            className="pill pill-ghost"
          >
            <FileDown className="h-4 w-4" /> {t("nav.download")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Related models
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
    <section className="band-soft section-tight px-4 md:px-6">
      <div className="mx-auto max-w-[1200px]">
        <motion.h2 {...fadeUpAt(0)} className="type-headline mb-10 text-center text-crisp">
          {t("product.related")}
        </motion.h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p, i) => (
            <ProductCard key={p.id} p={p} lang={lang} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Closing CTA
   ───────────────────────────────────────────────────────────── */

function BuyBand({ product, lang }: { product: Product; lang: Lang }) {
  const { t } = useTranslation();
  return (
    <section className="band-plain section-tight px-6 text-center">
      <motion.div {...fadeUpAt(0)} className="mx-auto max-w-2xl">
        <h2 className="type-headline text-crisp">{product.name}</h2>
        <div className="mt-3 text-[19px] font-semibold text-crisp">
          {formatPrice(product.price, lang)}
        </div>
        <p className="subhead mt-4 text-[17px]">{t("form.sub")}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button onClick={() => openLead({ product: product.name })} className="pill pill-accent">
            {t("product.cta")}
          </button>
          <Link to="/catalog" className="pill pill-ghost">
            {t("product.all_models")}
          </Link>
        </div>
        <div className="mt-4 text-[12px] text-cool">{t("form.trust_line")}</div>
      </motion.div>
    </section>
  );
}
