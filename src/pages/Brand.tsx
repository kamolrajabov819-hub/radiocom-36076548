import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";
import { LocaleLink } from "@/components/LocaleLink";
import { useScrollChoreography } from "@/lib/motion";
import { Section } from "@/components/Section";
import {
  DuoCard,
  ExpandCard,
  FilterPills,
  HighlightsShelf,
  ModelStrip,
  ModelStripItem,
  PosterCard,
  TintTag,
} from "@/components/apple";
import { INDUSTRY_SLUGS } from "@/data/industries";
import { INDUSTRY_POSTERS } from "@/data/industry-images";
import { openLead } from "@/components/LeadFormSheet";
import priceListPdf from "@/assets/radiocom-price-list.pdf";
// apple.com's "Why Apple is the best place to shop Mac" cards each carry a
// photograph at the bottom; ours were text with an empty half. These are the
// frames the repo already has that actually depict each claim.
//
// The `@800` variants deliberately. These render at 130-190px tall — Lighthouse
// caught the full-size files costing 315 KB on this page for images displayed
// at a tenth of their width. The small candidates are 95 KB for the set and
// still oversampled at DPR 2.
//
// All five are cutouts now, so none of them carries `mix-blend-multiply` any
// more. Two of the five previously did and should not have: the retail-box
// shot sat on #f8f8f8 and the trade-in pair on #f5f3fb, and multiply cannot
// remove a tone that is not white — both showed a visible panel edge against
// the card.
//
// `whyWarranty` is used twice on this page: on its own why-card and, at your
// request, as the first of the two closing cards. That is deliberate rather
// than an oversight — worth knowing before someone "fixes" the duplicate.
import whyWarranty from "@/assets/cutout/hand-retail-box-cutout@800.webp";
import whyDelivery from "@/assets/cutout/pair-floating-cutout@800.webp";
import whyService from "@/assets/cutout/radios-fan-cutout@800.webp";
import whyTest from "@/assets/cutout/hands-compare-cutout@800.webp";
import whyTradein from "@/assets/cutout/hands-tradein-cutout@800.webp";
import {
  products,
  productsOfBrand,
  shortName,
  priceFrom,
  formatPrice,
  categoryLabels,
  type BrandSlug,
  type Category,
  type Product,
} from "@/data/products";
import { pick, type Lang } from "@/data/spec-dict";
import {
  breadcrumbSchema,
  brandPath,
  collectionPageSchema,
  jsonLd,
  localeLinks,
  pageMeta,
  preloadImage,
  webPageSchema,
  type SeoLang,
} from "@/lib/seo";
import { tFor } from "@/lib/i18n";
import { useLang } from "@/lib/locale";

/**
 * Brand overview — the apple.com/mac analogue.
 *
 * apple.com/mac does one thing above all: it shows the whole family at once, at
 * a glance, each entry carrying just enough to choose by — name, one line, a
 * price floor, and two actions (read more / buy). Everything else on that page
 * is subordinate to the line-up.
 *
 * The page opens the way apple.com/mac opens, and not the way a marketing page
 * usually does: a compact left-aligned family name, then immediately the model
 * strip. No hero, no eyebrow, no centred manifesto. Apple's reasoning is that a
 * visitor on a family page has already chosen the family — the only thing left
 * to do is get them to a model — and it applies harder here, where thirteen
 * Motorola models sit behind one URL.
 *
 * This page replaced `/catalog`, which put both brands and 24 unrelated models
 * behind a single URL with client-side filters — so "Motorola рации Ташкент"
 * and "Radiocom RCD характеристики" competed for the same page and neither
 * ranked. Two brand URLs give each family its own indexable surface.
 */
export function brandRouteOptions(brandSlug: BrandSlug) {
  return {
    head: ({ params }: { params: { lang: SeoLang } }) => {
      const t = tFor(params.lang);
      const list = productsOfBrand(brandSlug);
      const title = t(`meta.brand.${brandSlug}_title`);
      const description = t(`meta.brand.${brandSlug}_desc`, { count: list.length });
      const path = brandPath(brandSlug);

      return {
        meta: pageMeta({ lang: params.lang, title, description, path, ogCard: brandSlug }),
        links: [
          ...localeLinks(params.lang, path),
          // The first lineup card is the LCP element on this page at every
          // width — the model strip above it is 52px thumbnails.
          ...(list[0]
            ? [
                preloadImage({
                  src: list[0].image,
                  small: list[0].imageSmall,
                  sizes: "(min-width: 1280px) 240px, (min-width: 640px) 45vw, 80vw",
                }),
              ]
            : []),
        ],
        scripts: [
          jsonLd(
            webPageSchema({
              lang: params.lang,
              path,
              name: title,
              description,
              image: list[0]?.image,
            }),
          ),
          // `CollectionPage` rather than a bare `ItemList`: it carries the
          // family's real price range as an `AggregateOffer`, which is what a
          // "Motorola рации цена" query is asking and what an ItemList of
          // twelve links cannot answer.
          jsonLd(
            collectionPageSchema({
              items: list,
              lang: params.lang,
              path,
              name: t(`brand.${brandSlug}_title`),
              description,
            }),
          ),
          jsonLd(
            breadcrumbSchema(
              [
                { name: t("nav.home"), path: "/" },
                { name: t(`brand.${brandSlug}_title`), path },
              ],
              params.lang,
            ),
          ),
        ],
      };
    },
    component: () => <BrandPage brandSlug={brandSlug} />,
  };
}

type Facet = Category | "all";

export function BrandPage({ brandSlug }: { brandSlug: BrandSlug }) {
  const { t } = useTranslation();
  const lang = useLang();
  const list = productsOfBrand(brandSlug);
  const floor = priceFrom(list);

  const [facet, setFacet] = useState<Facet>("all");

  // Only offer a filter the data can actually satisfy. Radiocom splits cleanly
  // into RC (amateur) and RCD (professional); if a brand ever ends up entirely
  // one category, showing a control that can only ever return everything or
  // nothing is worse than showing no control.
  const facets = useMemo<{ value: Facet; label: string }[]>(() => {
    const present = (["professional", "amateur"] as const).filter((c) =>
      list.some((p) => p.category === c),
    );
    if (present.length < 2) return [];
    return [
      { value: "all" as const, label: t("catalog.all") },
      ...present.map((c) => ({ value: c as Facet, label: pick(categoryLabels[c], lang) })),
    ];
  }, [list, lang, t]);

  const shown = facet === "all" ? list : list.filter((p) => p.category === facet);

  const page = useScrollChoreography();

  return (
    <div ref={page} className="page-anim">
      {/* ── Family name + model strip ──────────────────────── */}
      <Section band="plain">
        <h1 className="type-display text-crisp">{t(`brand.${brandSlug}_title`)}</h1>
        <p className="subhead measure mt-5 text-[17px] leading-relaxed md:text-[21px]">
          {t(`brand.${brandSlug}_desc`)}
        </p>

        <div className="mt-8">
          <ModelStrip label={t("brand.lineup")}>
            {list.map((p) => (
              <li key={p.id} className="shrink-0">
                <LocaleLink
                  to="/$brand/$model"
                  params={{ brand: p.brandSlug, model: p.slug }}
                  className="group block rounded-[12px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-4"
                >
                  <ModelStripItem
                    image={p.strip ?? p.image}
                    imageSmall={p.strip ? undefined : p.imageSmall}
                    label={shortName(p.name)}
                  />
                </LocaleLink>
              </li>
            ))}
            <li className="shrink-0">
              <LocaleLink
                to="/compare"
                className="group block rounded-[12px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-4"
              >
                <span className="flex w-[104px] flex-col items-center gap-3 text-center">
                  <span className="flex h-[96px] items-end justify-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-charcoal text-crisp transition-transform duration-500 group-hover:scale-110">
                      <ChevronRight className="h-5 w-5" aria-hidden />
                    </span>
                  </span>
                  <span className="text-[12px] leading-tight text-crisp">{t("nav.compare")}</span>
                </span>
              </LocaleLink>
            </li>
          </ModelStrip>
        </div>
      </Section>

      {/* ── The line-up ────────────────────────────────────── */}
      <Section band="soft">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4 md:mb-10">
          <h2 className="type-headline text-crisp">{t("brand.lineup")}</h2>
          {floor != null ? (
            <p className="text-[14px] text-cool">
              {list.length} {t("brand.models")} · {t("px.from")}{" "}
              <TintTag>{formatPrice(floor, lang)}</TintTag>
            </p>
          ) : null}
        </div>

        {/* Left-aligned filter tabs, so the control reads as part of the
            section's start edge rather than a floating centred element. */}
        {facets.length ? (
          <div className="mb-8 flex justify-start">
            <FilterPills
              label={t("catalog.categories")}
              options={facets}
              value={facet}
              onChange={setFacet}
            />
          </div>
        ) : null}

        {/* A horizontal scroll row, as apple.com/mac has it — not the grid this
            replaced. The grid was chosen because thirteen Motorola models would
            sit behind several arrow presses; the model strip at the top of the
            page answers that, since it reaches any model in one click. With
            that escape hatch in place the shelf is the better container: it
            keeps the lineup one screen tall however many models a brand has,
            and it is what the reference actually does. */}
        <HighlightsShelf label={t("brand.lineup")} stagger>
          {shown.map((p, i) => (
            <div
              key={p.id}
              className="w-[74vw] shrink-0 snap-start sm:w-[44vw] lg:w-[calc((100%-3rem)/4)]"
            >
              <LineupCard p={p} lang={lang} idx={i} />
            </div>
          ))}
        </HighlightsShelf>

        <p className="mt-10 text-[14px] text-cool">
          <a
            href={priceListPdf}
            className="pill-link"
            target="_blank"
            rel="noopener"
            download={`radiocom-price-list.pdf`}
          >
            {t("catalog.download")}
            <ChevronRight className="h-4 w-4" aria-hidden />
          </a>
        </p>
      </Section>

      {/* ── Why buy from us ────────────────────────────────── */}
      <Section band="plain">
        <h2 className="type-headline mb-10 max-w-2xl text-crisp md:mb-12">
          {t("brand.why_title")}
        </h2>

        {/* The bento this replaced gave five claims five different weights, so
            the eye landed on whichever tile happened to be widest rather than
            on whichever claim mattered. apple.com's own "Why Apple is the best
            place to shop Mac" is a flat shelf of equal cards with the detail
            behind a `+` — every claim gets the same one-line hearing, and the
            reader opens the one they actually care about. */}
        {/* A shelf, not a grid. There are five reasons and the grid this
            replaced was four columns wide, so the fifth card sat alone against
            three empty cells — which reads as a layout fault, not a design.
            apple.com scrolls this row at every width for the same reason: the
            card count is content, and content should not have to divide evenly
            into a column count. */}
        <HighlightsShelf label={t("brand.why_title")}>
          {WHY_CARDS.map((c, i) => (
            <div
              key={c.key}
              className="w-[74vw] shrink-0 snap-start sm:w-[46vw] lg:w-[calc((100%-3rem)/4)]"
            >
              <ExpandCard
                idx={i}
                className="h-full min-h-[300px]"
                eyebrow={t(c.eyebrow)}
                title={t(c.title)}
                detail={t(c.detail)}
                media={
                  <img
                    src={c.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={c.w}
                    height={c.h}
                    className="max-h-[170px] w-auto object-contain drop-shadow-[0_14px_22px_rgba(0,0,0,0.12)]"
                  />
                }
              />
            </div>
          ))}
        </HighlightsShelf>
      </Section>

      {/* ── Where these radios work — apple.com's poster shelf ─ */}
      {/* Apple fills this row with bespoke art and marketing claims. We have
          neither, and inventing product copy is exactly what the brief rules
          out — so it is fed from the six industries instead: a real photograph,
          the real sector name, the real one-line description, each card a link
          to a page that already exists. Same device, no fiction. */}
      <Section band="plain">
        <h2 className="type-headline mb-10 text-crisp md:mb-12">{t("px.where_used")}</h2>
        <HighlightsShelf label={t("px.where_used")}>
          {INDUSTRY_SLUGS.map((slug, i) => (
            <div
              key={slug}
              className="w-[54vw] shrink-0 snap-start sm:w-[32vw] lg:w-[calc((100%-4rem)/5)]"
            >
              <PosterCard
                idx={i}
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
            </div>
          ))}
        </HighlightsShelf>
      </Section>

      {/* ── The closing pair — apple.com's "Switch to Mac" ────── */}
      <Section band="soft">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DuoCard
            idx={0}
            className="min-h-[300px]"
            title={t("home.bento.service.sub")}
            body={t("service.sub")}
            link={
              <LocaleLink to="/service" className="pill-link text-[13px]">
                {t("nav.service")} <ChevronRight className="h-4 w-4" aria-hidden />
              </LocaleLink>
            }
            media={
              <img
                // You asked for the retail-box frame here. `whyWarranty` is
                // already that exact file, so this reuses the binding rather
                // than importing the same asset a second time under another
                // name — which would emit it twice through Vite.
                src={whyWarranty}
                alt=""
                loading="lazy"
                decoding="async"
                width={800}
                height={372}
                className="max-h-[190px] w-auto object-contain drop-shadow-[0_16px_24px_rgba(0,0,0,0.12)]"
              />
            }
          />
          <DuoCard
            idx={1}
            className="min-h-[300px]"
            title={t("home.bento.tradein.sub")}
            body={t("px.trial")}
            link={
              <button
                type="button"
                onClick={() => openLead({ title: t("home.bento.tradein.title") })}
                className="pill-link text-[13px]"
              >
                {t("px.buy")} <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            }
            media={
              <img
                src={whyTradein}
                alt=""
                loading="lazy"
                decoding="async"
                width={800}
                height={447}
                className="max-h-[190px] w-auto object-contain drop-shadow-[0_16px_24px_rgba(0,0,0,0.12)]"
              />
            }
          />
        </div>
      </Section>

      {/* ── Compare invitation ─────────────────────────────── */}
      <Section band="soft">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="type-headline text-crisp">{t("brand.compare_cta")}</h2>
          <p className="subhead mt-4 text-[17px]">{t("brand.compare_sub")}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <LocaleLink to="/compare" className="pill pill-accent">
              {t("px.compare_title")}
            </LocaleLink>
            <LocaleLink
              to={brandSlug === "radiocom" ? "/motorola" : "/radiocom"}
              className="pill-link"
            >
              {t(`brand.${brandSlug === "radiocom" ? "motorola" : "radiocom"}_title`)}
              <ChevronRight className="h-4 w-4" aria-hidden />
            </LocaleLink>
          </div>
        </div>
      </Section>
    </div>
  );
}

/**
 * The five reasons, as `(eyebrow, title, detail)` triples.
 *
 * Kept as data rather than five inline `<ExpandCard>`s so the `+` detail and
 * its heading cannot drift apart, and so adding a sixth reason is a row here
 * rather than a copy-paste of eleven lines of JSX.
 *
 * `w`/`h` are the image's real intrinsic size. They were a shared 800x600 —
 * the aspect of none of the five — so the browser reserved the wrong box for
 * each and the shelf shifted as the images decoded.
 */
const WHY_CARDS = [
  {
    key: "warranty",
    eyebrow: "home.bento.warranty.title",
    title: "home.bento.warranty.sub",
    detail: "brand.sub",
    image: whyWarranty,
    w: 800,
    h: 372,
  },
  {
    key: "delivery",
    eyebrow: "px.delivery",
    title: "px.trial",
    detail: "brand.compare_sub",
    image: whyDelivery,
    w: 574,
    h: 800,
  },
  {
    key: "service",
    eyebrow: "home.bento.service.title",
    title: "home.bento.service.sub",
    detail: "service.sub",
    image: whyService,
    w: 800,
    h: 536,
  },
  {
    key: "test",
    eyebrow: "home.bento.test.title",
    title: "home.bento.test.sub",
    detail: "px.trial",
    image: whyTest,
    w: 800,
    h: 800,
  },
  {
    key: "tradein",
    eyebrow: "home.bento.tradein.title",
    title: "home.bento.tradein.sub",
    detail: "tradein.desc",
    image: whyTradein,
    w: 800,
    h: 447,
  },
] as const;

/**
 * One model in the line-up — apple.com/mac's card anatomy, in order.
 *
 * Photo, name, one-line tagline, the three facts a buyer actually sorts on,
 * price, then two actions: a solid button to the story page and a text link
 * that starts the enquiry. Apple's own lineup card is not wholly clickable, and
 * copying that here removes the nested-interactive trap the previous version
 * had — an absolutely-positioned card-wide link with two more links stacked on
 * top of it at a higher z-index.
 */
function LineupCard({ p, lang, idx }: { p: Product; lang: Lang; idx: number }) {
  const { t } = useTranslation();
  return (
    <article
      // `h-full` plus `mt-auto` on the action row: without both, a model with a
      // two-line tagline sits its buttons higher than its neighbours and the
      // shelf reads as ragged. apple.com aligns them across the row.
      className="group card-interactive flex h-full flex-col rounded-[18px] bg-pitch p-6 md:p-7"
      style={{ animationDelay: `${Math.min(idx, 8) * 40}ms` }}
    >
      <div className="mb-6 flex min-h-[180px] flex-1 items-center justify-center">
        <img
          src={p.image}
          srcSet={p.imageSmall ? `${p.imageSmall} 800w, ${p.image} 1600w` : undefined}
          sizes={
            p.imageSmall ? "(min-width: 1280px) 240px, (min-width: 640px) 45vw, 80vw" : undefined
          }
          alt=""
          width={1024}
          height={1024}
          loading="lazy"
          decoding="async"
          className="h-[170px] w-auto max-w-[80%] object-contain mix-blend-multiply transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />
      </div>

      {/* The title link stays a title link.
      
          Making the whole card clickable would give a 400px target, but the
          card holds two more controls and stacking them over a card-wide link
          is the nested-interactive trap the comment above records — it was
          removed on purpose and is not worth reintroducing for a target size.
      
          `py-1` with a matching negative margin lifts it from 20px to 28px
          without moving anything, which clears WCAG 2.5.8's 24px bar. The 44px
          version of this exact destination is the "Подробнее" button four lines
          below, which is the equivalent-target case 2.5.8 explicitly allows. */}
      <h3 className="-my-1 text-[17px] font-semibold leading-[1.2] tracking-[-0.01em] text-crisp">
        <LocaleLink
          to="/$brand/$model"
          params={{ brand: p.brandSlug, model: p.slug }}
          className="inline-block rounded-sm py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2"
        >
          {p.name}
        </LocaleLink>
      </h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-cool">{pick(p.blurb, lang)}</p>

      {/* apple.com puts three or four bare spec lines here, unbulleted and
          unlabelled. They are not a spec sheet — they are the axes buyers
          actually compare on, which for a two-way radio is range first. */}
      <ul className="mt-4 space-y-1 text-[13px] leading-snug text-cool">
        <li>
          {t("px.range_city")}: {pick(p.rangeCity, lang)}
        </li>
        {p.tags.length ? <li>{p.tags.slice(0, 3).join(" · ")}</li> : null}
      </ul>

      <div className="mt-auto pt-5 text-[13px] text-cool">
        {p.price != null ? (
          <>
            {t("px.from")} <TintTag>{formatPrice(p.price, lang)}</TintTag>
          </>
        ) : (
          t("px.price_on_request")
        )}
      </div>

      {/* apple.com's exact pairing: a solid accent button to the product page
          and an accent text link to buy.

          An earlier version made the solid button ink, to avoid sixteen reds on
          one screen. The shelf removes that objection — four cards are visible
          at a time, not eight — and matching the reference was the ask. */}
      <div className="mt-5 flex flex-wrap items-center gap-4 text-[13px]">
        <LocaleLink
          to="/$brand/$model"
          params={{ brand: p.brandSlug, model: p.slug }}
          className="pill pill-sm pill-accent"
        >
          {t("px.learn_more")}
        </LocaleLink>
        <button type="button" onClick={() => openLead({ title: p.name })} className="pill-link">
          {t("px.buy")}
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </article>
  );
}

/** Both brand routes share one component; this keeps the export surface small. */
export const radiocomRouteOptions = brandRouteOptions("radiocom");
export const motorolaRouteOptions = brandRouteOptions("motorola");

export { products };
