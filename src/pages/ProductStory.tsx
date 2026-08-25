import { useTranslation } from "react-i18next";
import { useScrollChoreography } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { brandCase } from "@/lib/brand";
import { notFound, useParams } from "@tanstack/react-router";
import { Check, ChevronRight } from "lucide-react";
import { LocaleLink } from "@/components/LocaleLink";
import { Section, SectionHead } from "@/components/Section";
import {
  BentoGrid,
  FeatureCard,
  HighlightsShelf,
  LeadInCaption,
  PosterCard,
  PricePill,
  StatPanel,
  statRowTier,
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
import { INDUSTRY_SLUGS, type IndustrySlug } from "@/data/industries";
import { INDUSTRY_POSTERS } from "@/data/industry-images";
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
  webPageSchema,
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

  const page = useScrollChoreography();

  return (
    <div ref={page} className="page-anim page-tight">
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
    <Section band="plain">
      <nav aria-label="Breadcrumb" className="mb-8 text-[14px] text-cool">
        <LocaleLink
          to={p.brandSlug === "radiocom" ? "/radiocom" : "/motorola"}
          className="inline-flex min-h-11 items-center hover:text-crisp"
        >
          {brandCase(t(`meta.crumb.${p.brandSlug}`))}
        </LocaleLink>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span className="text-crisp">{brandCase(p.name)}</span>
      </nav>

      <div className="mx-auto max-w-3xl text-center">
        <h1 className="headline-hero text-balance text-crisp">{brandCase(p.name)}</h1>
        <p className="subhead mx-auto mt-6 max-w-2xl text-[17px] md:text-[21px]">
          {pick(p.blurb, lang)}
        </p>
      </div>

      {/* The stage used to reserve 54vh and let the photograph fit inside it,
          which on a phone left a third of the viewport empty above and below a
          small radio. It is now sized to the photograph — a capped, viewport
          relative height with the image filling it — so the product is the
          section rather than a speck in the middle of one. */}
      <div
        data-parallax="0.07"
        className="stage relative mt-8 flex h-[min(42vh,360px)] items-center justify-center md:mt-12 md:h-[min(56vh,560px)]"
      >
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

      <div className="mt-8 md:mt-12">
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

  const factTier = statRowTier(facts.map((c) => c.value));
  const width = "w-[64vw] sm:w-[38vw] lg:w-[calc((100%-3rem)/4)]";

  return (
    <Section band="plain">
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
          className={`flex ${width} shrink-0 snap-start flex-col justify-between rounded-[28px] bg-charcoal p-7 text-crisp`}
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
              className="h-[160px] w-auto max-w-[80%] object-contain mix-blend-multiply md:h-[190px]"
            />
          </div>
          <div className="mt-6">
            <div className="text-[13px] font-medium text-cool">
              {brandCase(t(`brand.${p.brandSlug}_title`))}
            </div>
            <div className="mt-1 text-[22px] font-semibold leading-[1.15] tracking-[-0.02em]">
              {brandCase(p.name)}
            </div>
          </div>
        </article>

        {facts.map((c) => {
          // Same length-aware tiering `StatPanel` uses, at this card's own
          // smaller scale — a spec row can carry any string a model's data
          // happens to have, with no guarantee it is as short as "до 3 км".
          // Taken across the whole shelf rather than per card, so the facts in
          // one row are set alike; see `statRowTier`.
          const sizeClass = {
            lg: "text-[21px] sm:text-[26px]",
            md: "text-[17px] sm:text-[20px]",
            sm: "text-[14px] sm:text-[16px]",
          }[factTier];
          return (
            <article
              key={c.label + c.value}
              className={`flex ${width} shrink-0 snap-start flex-col justify-between rounded-[28px] p-7 ${
                c.lead ? "bg-black text-[#f5f5f7]" : "bg-charcoal text-crisp"
              }`}
            >
              <div className={`text-[14px] font-medium ${c.lead ? "opacity-70" : "text-cool"}`}>
                {c.label}
              </div>
              {/* 26px held a value like «до 3 км, 8 Вт» hard against the card's
                  padding on a 78vw phone card. One step down below `sm`. */}
              <div className={cn("mt-8 font-semibold leading-[1.15] tracking-[-0.02em]", sizeClass)}>
                {c.value}
              </div>
            </article>
          );
        })}
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
  // Nine of the twenty-one visible models have no gallery frames, and for those
  // the whole section used to disappear — the page went from a shelf of numbers
  // straight to the closing CTA and ended abruptly. The hero shot is the one
  // frame every model has, so those pages get the same section built around it:
  // one photograph, the same caption, the same stat panels. Fewer frames, not a
  // missing section.
  const gallery = p.gallery ?? [];
  const [wide, ...rest] = gallery.length ? gallery : [p.image];
  const spec = specs[p.id];
  const protection = spec?.rows.find((r) => /Класс защиты/i.test(r.label.ru));

  return (
    <Section band="plain">
      <div className="mb-10 md:mb-12">
        <div className="mb-3 text-[14px] font-medium text-cool">{t("px.design")}</div>
        <h2 className="type-display text-balance text-crisp">{t("px.design_title")}</h2>
      </div>

      {/* Full-bleed lead frame, the way apple.com opens a design section. */}
      <figure className="m-0">
        {/* The panel spans the column: heading's left edge to the shell's right
            edge, which is how apple.com opens a design section and what the
            annotated screenshot asked for.
        
            An earlier revision did the opposite — `mx-auto w-fit` shrink-wrapped
            the panel to its content — to answer a different complaint, that the
            radio looked small in a wide grey field. That fix traded one problem
            for another: a 3:4 portrait capped at 420px tall is about 315px wide,
            so the panel came out ~443px inside a ~1288px column and left 420px
            of empty white on each side.
        
            Spanning the column *and* dropping the height cap solves both at
            once. The image box is now the panel, so `object-contain` makes a
            wide 3:2 flat-lay fill the panel's width and a 3:4 portrait fill its
            height — strictly larger than before in both cases, and still never
            cropped. The panel height is what keeps a square kit shot from
            becoming a 1000px-tall image filling a whole viewport, which is the
            failure the original cap existed to prevent. */}
        <div className="flex w-full items-center justify-center overflow-hidden rounded-[28px] bg-charcoal px-6 py-10 md:px-16 md:py-14">
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
            className="h-[clamp(280px,48vw,600px)] w-full object-contain mix-blend-multiply"
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

      {/* The figures, at the size their importance deserves.
      
          Built as a list first, then given a column count that matches it. The
          fixed `md:grid-cols-2` put a single panel against an empty half on
          every model that publishes neither an open-country range nor an
          ingress rating — a lone box with a void beside it. */}
      {(() => {
        const panels = [
          { key: "city", value: pick(p.rangeCity, lang), label: t("px.range_city") },
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
        ];
        // One tier for the row — see `statRowTier`. Mixed sizes across a set of
        // like quantities read as unrelated cards rather than one comparison.
        const size = statRowTier(panels.map((s) => s.value));
        return (
          <div
            className={cn(
              "mt-14 grid gap-6",
              // A lone panel spans the column rather than sitting in a narrow
              // box against an empty right half — that read as orphaned, and at
              // 420px "up to 900 m" wrapped onto two lines inside it.
              panels.length === 1 && "grid-cols-1",
              panels.length === 2 && "grid-cols-1 md:grid-cols-2",
              panels.length >= 3 && "grid-cols-1 sm:grid-cols-3",
            )}
          >
            {panels.map((s) => (
              <StatPanel key={s.key} value={s.value} label={s.label} size={size} />
            ))}
          </div>
        );
      })()}
      <LeadInCaption className="mt-6 max-w-[62ch]" lead={t("px.range_lead")}>
        {protection && p.rangeOpen
          ? `${pick(protection.label, lang)} — ${pick(protection.value, lang)}.`
          : null}
      </LeadInCaption>

      {/* Remaining frames, in the uneven light-panel grid apple.com closes a
          design section with. */}
      {rest.length ? (
        <div
          className={cn(
            "mt-14 grid gap-6",
            rest.length === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2",
          )}
        >
          {rest.map((src, i) => (
            /* Same construction as the lead frame: the panel fills its grid
               cell rather than shrink-wrapping and floating in the middle of
               it, so a two-up row reads as two panels and not two islands. */
            <div
              key={src}
              className="flex w-full items-center justify-center overflow-hidden rounded-[28px] bg-charcoal px-6 py-8 md:px-10"
            >
              <img
                src={src}
                alt={`${p.name} — ${i + 2}`}
                width={1600}
                height={1067}
                loading="lazy"
                decoding="async"
                className="h-[clamp(220px,26vw,340px)] w-full object-contain mix-blend-multiply"
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

  return (
    <Section band="plain">
      <SectionHead align="left" spacing="tight" title={t("px.features")} />
      {/* A capability list, sized to its content.
      
          This was a bento of `min-h-[200px]` cards each holding one line of
          text, so every card was mostly empty and a model with eleven features
          produced a wall of near-blank boxes. A feature here is a single phrase
          off the manufacturer's sheet — it does not need a card the size of a
          product tile, it needs to be readable and countable.
          
          Auto-flowing rows with a leading rule per item give the list rhythm
          without pretending each line is a section. The dark accent tile is
          gone with the bento: it was drawing the eye to whichever feature
          happened to be second. */}
      <ul className="grid grid-cols-1 gap-x-10 border-t border-border sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <li
            key={pick(f, lang)}
            className="flex items-start gap-3 border-b border-border py-5 text-[15px] leading-relaxed text-crisp"
          >
            <Check className="mt-1 h-4 w-4 shrink-0 text-signal" strokeWidth={2.5} aria-hidden />
            <span>{pick(f, lang)}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ── In the box ───────────────────────────────────────────── */
function InBox({ p, lang }: { p: Product; lang: Lang }) {
  const { t } = useTranslation();
  const inBox = specs[p.id]?.inBox ?? [];
  if (!inBox.length) return null;

  // The kit shot, where one exists. This section names what is in the box and
  // had nothing to show for it — three columns of hairline-ruled text, the
  // thinnest band on the page. The gallery's last frame is the kit flat-lay
  // for every model that has one, which is the photograph of precisely this
  // list.
  const kit = p.gallery?.[p.gallery.length - 1];

  return (
    <Section band="plain">
      <SectionHead align="left" spacing="tight" title={t("px.in_box")} />
      <div
        className={
          kit
            ? // `items-stretch`, so the kit panel matches the list's height
              // instead of floating short beside it.
              "grid grid-cols-1 items-stretch gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-16"
            : ""
        }
      >
        <ul
          className={`grid grid-cols-1 gap-x-10 border-t border-border sm:grid-cols-2 ${
            kit ? "" : "lg:grid-cols-3"
          }`}
        >
          {inBox.map((line) => (
            <li
              key={pick(line.item, lang)}
              className="flex items-baseline justify-between gap-4 border-b border-border py-5"
            >
              <span className="text-[17px] text-crisp">{pick(line.item, lang)}</span>
              {/* Always shown, including ×1 — a kit line with no count read as
                  an omission, not as "obviously one," and the twin-radio
                  packs on this same list already carry a ×2 right beside it. */}
              <span className="shrink-0 text-[15px] tabular-nums text-cool">×{line.qty ?? 1}</span>
            </li>
          ))}
        </ul>
        {kit ? (
          /* No `data-parallax` here, and `qa-blend` is why.
          
              The kit frames are studio shots on white, knocked out with
              `mix-blend-multiply`. Multiply composites against the nearest
              stacking context, and a transform opens one — so a parallax
              wrapper leaves the blend with no backdrop to knock out. That was
              harmless while this panel was white (multiply on white is a no-op)
              and became a visible white box the moment the panel went grey to
              stay legible on the now-white page. Drift on a static panel inside
              a card is a small thing; the photograph rendering correctly is not. */
          <div className="flex items-center justify-center overflow-hidden rounded-[28px] bg-charcoal p-8">
            <img
              src={kit}
              alt=""
              loading="lazy"
              decoding="async"
              width={1080}
              height={1080}
              className="mx-auto h-auto w-full max-w-[380px] object-contain mix-blend-multiply"
            />
          </div>
        ) : null}
      </div>
    </Section>
  );
}

/* ── Where it is used ─────────────────────────────────────── */
/**
 * The industries this model is specified for, as poster cards.
 *
 * This was a row of two grey pills — the thinnest section on the page, and one
 * that gave a reader deciding between models nothing to look at. It is the same
 * `PosterCard` shelf the brand pages use, so a reader meets one visual language
 * for "where this works" wherever they hit it.
 *
 * It also carried a real bug: the pills read `industries.${slug}.title`, and
 * that key does not exist — the correct one is `.name`. Visitors saw the
 * literal string "industries.horeca.title". `verify-i18n`'s new key check could
 * not catch it because the key is built from a template, so that check now
 * resolves template keys against the slugs they interpolate.
 */
function WhereUsed({ p, lang }: { p: Product; lang: Lang }) {
  const { t } = useTranslation();
  const slugs = p.industries.filter((s): s is IndustrySlug =>
    (INDUSTRY_SLUGS as readonly string[]).includes(s),
  );
  if (!slugs.length) return null;

  return (
    <Section band="plain">
      <SectionHead align="left" spacing="tight" title={t("px.where_used")} />
      {/* Always the scrolling shelf, the way every other card row on the site
          works — one or two industries no longer fall back to a plain grid.
          That branch existed because a shelf whose arrows are permanently
          disabled reads as broken chrome, but `HighlightsShelf` now hides its
          own arrow pair whenever the track has nothing to scroll (see
          `useScrollArrows`'s `canScroll`), so a one-card shelf and a six-card
          shelf both render correctly with no branch needed here — the card
          shape, spacing and shelf chrome stay identical regardless of count,
          which is what "make it like the others" actually asked for. */}
      <HighlightsShelf label={t("px.where_used")}>
        {slugs.map((slug, i) => (
          <PosterCard
            key={slug}
            idx={i}
            className="w-[62vw] shrink-0 snap-start sm:w-[38vw] lg:w-[calc((100%-3rem)/4)]"
            image={INDUSTRY_POSTERS[slug]}
            eyebrow={t(`industries.${slug}.short`)}
            title={t(`industries.${slug}.name`)}
            href={
              <LocaleLink
                to="/industries/$slug"
                params={{ slug }}
                className="absolute inset-0 z-20 rounded-[18px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2"
                aria-label={t(`industries.${slug}.name`)}
              />
            }
          />
        ))}
      </HighlightsShelf>
      <p className="sr-only">{pick(p.blurb, lang)}</p>
    </Section>
  );
}

/* ── Closing: specs hand-off, compare, enquiry ────────────── */
function Closing({ p, lang }: { p: Product; lang: Lang }) {
  const { t } = useTranslation();
  return (
    <Section band="plain">
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
            className="pill pill-accent"
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
