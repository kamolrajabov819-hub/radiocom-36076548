import { useTranslation } from "react-i18next";
import { notFound, useParams } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { LocaleLink } from "@/components/LocaleLink";
import { Section, SectionHead } from "@/components/Section";
import {
  BentoGrid,
  FeatureCard,
  HighlightsShelf,
  LeadInCaption,
  PricePill,
  StatPanel,
  TintedHeadline,
} from "@/components/apple";
import { openLead } from "@/components/LeadFormSheet";
import {
  formatPrice,
  isBrandSlug,
  productBySlug,
  type BrandSlug,
  type Product,
} from "@/data/products";
import { specs } from "@/data/specs";
import { INDUSTRY_SLUGS } from "@/data/industries";
import { pick, type Lang } from "@/data/spec-dict";
import {
  breadcrumbSchema,
  brandPath,
  jsonLd,
  localeLinks,
  pageMeta,
  preloadImage,
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
          product: { price: p.price },
        }),
        links: [
          ...localeLinks(params.lang, path),
          // The hero photograph is the LCP element here, and its candidate set
          // must match the <img> in `Hero` exactly or the browser fetches the
          // image twice.
          preloadImage({
            src: p.image,
            small: p.imageSmall,
            sizes: "(min-width: 768px) 520px, 88vw",
          }),
        ],
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
      <Design p={p} lang={lang} />
      {spec?.features?.length ? <Features p={p} lang={lang} /> : null}
      {spec?.inBox?.length ? <InBox p={p} lang={lang} /> : null}
      <WhereUsed p={p} lang={lang} />
      <Closing p={p} lang={lang} />
    </div>
  );
}

/* ── Hero ─────────────────────────────────────────────────── */
/**
 * apple.com's product hero, structurally: headline, one line of positioning,
 * the product at full size on a tinted band, then the price and the buy control
 * as a single object at the bottom.
 *
 * Two things here are apple.com devices rather than arbitrary styling. The
 * headline tints its trailing phrase — for a model name that is the model
 * number, which is the part a returning visitor is actually scanning for. And
 * the band is a gradient rather than flat white, which is what stops a cutout
 * photograph from looking like it is floating in a void; it resolves to white
 * before the section ends so the next band starts clean.
 */
function Hero({ p, lang }: { p: Product; lang: Lang }) {
  const { t } = useTranslation();
  return (
    <Section band="tint">
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
        <TintedHeadline as="h1" className="headline-hero text-crisp">
          {p.name}
        </TintedHeadline>
        <p className="subhead mx-auto mt-6 max-w-2xl text-[17px] md:text-[21px]">
          {pick(p.blurb, lang)}
        </p>
      </div>

      <div className="stage relative mt-12 flex h-[42vh] max-h-[520px] items-center justify-center md:mt-14">
        <img
          src={p.image}
          srcSet={p.imageSmall ? `${p.imageSmall} 800w, ${p.image} 1600w` : undefined}
          sizes={p.imageSmall ? "(min-width: 768px) 520px, 88vw" : undefined}
          alt={p.name}
          width={1024}
          height={1024}
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          className="h-full w-auto max-w-[88vw] object-contain mix-blend-multiply"
        />
      </div>

      <div className="mt-12 md:mt-14">
        <PricePill
          price={
            p.price != null
              ? `${t("px.from")} ${formatPrice(p.price, lang)}`
              : t("px.price_on_request")
          }
          note={t("px.warranty")}
          action={{ label: t("px.buy"), onClick: () => openLead({ title: p.name }) }}
        />
        <div className="mt-5 flex justify-center">
          <LocaleLink
            to="/$brand/$model/specs"
            params={{ brand: p.brandSlug, model: p.slug }}
            className="pill-link"
          >
            {t("px.specs_link")} <ChevronRight className="h-4 w-4" aria-hidden />
          </LocaleLink>
        </div>
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
 *
 * The cards are deliberately *not* uniform. Eight identical white tiles is what
 * this shelf was, and a reader scanning it had no way to tell which two figures
 * decide the purchase — every fact had the same weight, so none had any.
 * apple.com's "Get the highlights" shelf mixes dark, light and photographic
 * cards for exactly that reason. Here the lead card carries the product
 * photograph, the two range figures go dark because range is what a two-way
 * radio is bought on, and the spec rows fill in behind them in light.
 */
function Highlights({ p, lang }: { p: Product; lang: Lang }) {
  const { t } = useTranslation();
  const spec = specs[p.id];

  const facts: { label: string; value: string; lead?: boolean }[] = [
    { label: t("px.range_city"), value: pick(p.rangeCity, lang), lead: true },
    ...(p.rangeOpen
      ? [{ label: t("px.range_open"), value: pick(p.rangeOpen, lang), lead: true }]
      : []),
    ...(spec?.rows ?? []).map((r) => ({
      label: pick(r.label, lang),
      value: pick(r.value, lang),
    })),
  ].slice(0, 7);

  if (!facts.length) return null;

  const width = "w-[64vw] sm:w-[38vw] lg:w-[calc((100%-3rem)/4)]";

  return (
    <Section band="soft" tight>
      <SectionHead align="left" spacing="tight" title={t("px.highlights")} />
      <HighlightsShelf label={t("px.highlights")}>
        {/* Photographic lead card. It gives the row an anchor and re-states the
            product at the moment the reader starts comparing numbers, which is
            when they have scrolled the hero off-screen.

            Light, not dark, and that is forced by the photography rather than
            chosen: these frames are a mix of true cutouts and white-background
            studio shots. On a dark card `multiply` erases a cutout and `screen`
            turns a studio shot's white background into a white rectangle — the
            first version of this card did exactly that. Only a light card
            renders both correctly under one blend mode, and the two dark range
            cards beside it still give the shelf its mix. */}
        <article
          className={`flex ${width} shrink-0 snap-start flex-col justify-between rounded-[28px] bg-pitch p-7 text-crisp`}
        >
          <div className="flex flex-1 items-center justify-center">
            <img
              src={p.image}
              srcSet={p.imageSmall ? `${p.imageSmall} 800w, ${p.image} 1600w` : undefined}
              sizes={p.imageSmall ? "(min-width: 1024px) 280px, 64vw" : undefined}
              alt=""
              width={1024}
              height={1024}
              loading="lazy"
              decoding="async"
              className="h-[120px] w-auto max-w-[70%] object-contain mix-blend-multiply"
            />
          </div>
          <div className="mt-6">
            <div className="text-[13px] font-medium text-cool">
              {t(`brand.${p.brandSlug}_title`)}
            </div>
            <div className="mt-1 text-[22px] font-semibold leading-[1.15] tracking-[-0.02em]">
              {p.name}
            </div>
          </div>
        </article>

        {facts.map((c) => (
          <article
            key={c.label + c.value}
            className={`flex ${width} shrink-0 snap-start flex-col justify-between rounded-[28px] p-7 ${
              c.lead ? "bg-black text-[#f5f5f7]" : "bg-pitch text-crisp"
            }`}
          >
            <div className={`text-[14px] font-medium ${c.lead ? "opacity-70" : "text-cool"}`}>
              {c.label}
            </div>
            <div className="mt-8 text-[26px] font-semibold leading-[1.1] tracking-[-0.02em]">
              {c.value}
            </div>
          </article>
        ))}
      </HighlightsShelf>
    </Section>
  );
}

/* ── Design ───────────────────────────────────────────────── */
/**
 * apple.com's "Built to go places." — the section that shows the object rather
 * than describing it.
 *
 * Skipped in Phase 5 because every product photograph was a CDN pointer and
 * there was nothing to lay out. Now that the real gallery frames are in the
 * repo it is buildable, and it is the one place on the site where a buyer sees
 * the radio from more than one angle before committing.
 *
 * It renders only when the model actually has gallery frames. Twelve of the
 * twenty-one visible models do; the rest get no section rather than a hero
 * photograph shown twice under a heading promising a closer look. The stat
 * panels underneath carry the two range figures at display size — the numbers
 * that decide the purchase, stated once at a size that matches their weight.
 */
function Design({ p, lang }: { p: Product; lang: Lang }) {
  const { t } = useTranslation();
  const gallery = p.gallery ?? [];
  if (!gallery.length) return null;

  const [wide, ...rest] = gallery;
  const spec = specs[p.id];
  const protection = spec?.rows.find((r) => /Класс защиты/i.test(r.label.ru));

  return (
    <Section band="plain" tight>
      <div className="mb-10 md:mb-12">
        <div className="mb-3 text-[14px] font-medium text-cool">{t("px.design")}</div>
        <TintedHeadline
          as="h2"
          className="text-[34px] font-semibold leading-[1.08] tracking-[-0.02em] text-crisp md:text-[48px]"
        >
          {t("px.design_title")}
        </TintedHeadline>
      </div>

      {/* Full-bleed lead frame, the way apple.com opens a design section. */}
      <figure className="m-0">
        {/* Height-capped, not `h-auto`. The gallery is a mix of 1080-square
            studio frames and 3:2 camera files, and letting each set its own
            height made a square kit shot 1000px tall on desktop — one image
            filling a whole viewport. The cap gives every model the same band
            depth, and `object-contain` means the crop never cuts equipment out
            of a flat-lay. */}
        <div className="flex items-center justify-center overflow-hidden rounded-[28px] bg-charcoal p-6 md:p-10">
          <img
            src={wide}
            alt={`${p.name} — ${t("px.design")}`}
            width={1600}
            height={1067}
            loading="lazy"
            decoding="async"
            // `multiply` for the same reason every other product image on the
            // site carries it: most of these frames are studio shots on white,
            // and without it a white rectangle sits inside the grey panel. On
            // the Motorola cutouts, which have real alpha, multiply is a no-op.
            className="max-h-[460px] w-auto max-w-full object-contain mix-blend-multiply"
          />
        </div>
        <figcaption className="mt-6 max-w-[62ch]">
          <LeadInCaption lead={`${pick(p.blurb, lang)}`}>
            {t("px.range_city")} — {pick(p.rangeCity, lang)}
            {p.rangeOpen
              ? `, ${t("px.range_open").toLowerCase()} — ${pick(p.rangeOpen, lang)}`
              : ""}
            .
          </LeadInCaption>
        </figcaption>
      </figure>

      {/* The figures, at the size their importance deserves. */}
      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
        <StatPanel value={pick(p.rangeCity, lang)} label={t("px.range_city")} />
        {p.rangeOpen ? (
          <StatPanel value={pick(p.rangeOpen, lang)} label={t("px.range_open")} />
        ) : protection ? (
          <StatPanel value={pick(protection.value, lang)} label={pick(protection.label, lang)} />
        ) : null}
      </div>
      <LeadInCaption className="mt-6 max-w-[62ch]" lead={t("px.range_lead")}>
        {protection && p.rangeOpen
          ? `${pick(protection.label, lang)} — ${pick(protection.value, lang)}.`
          : null}
      </LeadInCaption>

      {/* Remaining frames, in the uneven light-panel grid apple.com closes a
          design section with. */}
      {rest.length ? (
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {rest.map((src, i) => (
            <div
              key={src}
              className="flex items-center justify-center overflow-hidden rounded-[28px] bg-charcoal p-6"
            >
              <img
                src={src}
                alt={`${p.name} — ${i + 2}`}
                width={1600}
                height={1067}
                loading="lazy"
                decoding="async"
                className="max-h-[340px] w-auto max-w-full object-contain mix-blend-multiply"
              />
            </div>
          ))}
        </div>
      ) : null}
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
function Features({ p, lang }: { p: Product; lang: Lang }) {
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
function InBox({ p, lang }: { p: Product; lang: Lang }) {
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
function WhereUsed({ p, lang }: { p: Product; lang: Lang }) {
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
function Closing({ p, lang }: { p: Product; lang: Lang }) {
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
