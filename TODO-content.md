# Content and assets needed from you

Everything here is a decision or an asset I deliberately did **not** invent. Nothing on
this list is blocking a phase unless it says so.

## Photography

| Slot | What is there now | What is needed |
|---|---|---|
| Home → "Почему Radiocom" → warranty tile | `product/radio-kit-wide.webp` | **The source photo has the charging cable cropped in half at the bottom-left edge.** It is not a layout bug — the crop is baked into the 1600×900 original. A re-crop with the cable either fully in or fully out would fix it. |
| Everywhere | 55 × `.asset.json` CDN pointers | These resolve to `radiocom.lovable.app` and exist nowhere in this repo. They render in production today. If that Lovable project is ever unpublished, deleted or rate-limited they vanish from the Netlify site with no local copy. See "CDN assets" below. |

## CDN assets — a decision I need from you

~70 images (all product photography, the logo, the catalogue PDF) are `.asset.json`
pointers to Lovable's CDN rather than files in the repo. The brief called localising them
optional, and it is — but two things make it worth deciding now:

1. **They cannot get responsive variants while they are remote.** Phase 1 gave the six
   local WebP files real `srcset` pairs. The CDN images cannot have the same treatment,
   so the product photography — the heaviest images on the site — ships one size to every
   device.
2. **They are a single point of failure outside this repository.**

I could not localise them myself: this sandbox's network policy blocks
`radiocom.lovable.app`, so I cannot download them. **This needs to run somewhere with
access to that host.** Say the word and I will write the script (walk
`src/assets/**/*.asset.json`, fetch each `url`, write the binary alongside, swap the
import, verify byte-for-byte before deleting any pointer).

## Copy reserved from the deleted Brands section

Phase 2 deleted `BrandsStrip` and its `brands.*` i18n keys as instructed. The Russian
copy was good and Phase 5's brand pages want it, so it is parked verbatim in
`docs/_brands-copy-reserved.json` (all three locales) rather than thrown away —
`rc_desc`, `mot_desc`, `official`, `headline`, `sub`, `view`, `models`.

## Still to confirm

- **Prices.** No product page can show "От N сум" until real prices exist in
  `src/data/products.ts`. Currently absent. Phase 5 will leave the price slot empty and
  list every missing model here rather than ship a placeholder number.
- **`seo-dataforseo` credentials** — the skill is installed but inert. Phase 7 will use
  the free-tier paths unless you supply a key.

## Copy I wrote that you should review — Service page

The repair-flow stages and the "Почему сюда" tiles were **single nouns** with nothing
else: `["Диагностика", "Анализ", "Тестирование", "Ремонт"]` and four bare phrases. A big
card with one word in it is exactly what reads as machine-generated, so each now carries a
supporting line.

**I did not invent any claim.** Every supporting line restates something you already
publish on that page — `service.sub` ("Гарантийное и постгарантийное обслуживание…
Оригинальные запчасти, фиксированные цены, диагностика на профильном оборудовании") and
the four advantage labels. No new promises, no turnaround times, no prices.

Still, it is your voice and your commitments, so please read and correct:

- `service.flow[].d` — four lines, one per repair stage (ru / en / uz)
- `service.advantages.*.d` — four supporting lines (ru / en / uz)
- `service.request_repair_sub` — one CTA line (ru / en / uz)

The **Uzbek** wording in particular deserves a native check; it is the locale I am least
able to verify for register and idiom.

## Photography — repair-stage slots

The four repair stages now use real product photography rather than a lucide icon in white
space, and each stage gets a distinct shot:

| Stage | Photo | Note |
|---|---|---|
| Диагностика | `radio-on-white.webp` | single unit, as received |
| Анализ | `radios-lineup-seven.webp` | lineup, reads as comparison |
| Ремонт | `radios-four-aligned.webp` | units and a belt clip |
| Тестирование | `hands-tradein-pair.webp` | two handsets, reads as checking the link |

**These are product shots, not process shots.** Actual bench photography — a technician at
the workbench, a radio open with tools, a unit on a test set — would serve these four slots
far better. If you can shoot four landscape (4:3 or wider) frames, they drop straight in.

## Asset renaming (done)

16 photographs carried generator filenames, four of them containing "Apple"
(`MacBook_Pro_-_Apple_Two_two-way_radios_floating_2K_no_bg.webp`). Shipping those on a site
modelled after apple.com was the specific risk the brief flagged. All 16 are renamed to
`<subject>-<variant>.webp`; nothing in `src/assets/` matches "apple", "macbook" or "iphone"
any more.

---

# Phase 5 — the `/catalog` migration

## `netlify.toml` publish directory — I got this wrong, and it is now corrected

**`publish = "dist"` is correct. Do not change it.** An earlier version of this file
said the opposite; that was wrong, and the correction is worth recording because it
cost a broken deploy.

Nitro's output path is chosen by the preset:

| preset | where the public files land | used by |
|---|---|---|
| `netlify` | `dist/` | Netlify, which auto-detects it |
| `cloudflare` | `.output/public` | a plain local `bun run build` |
| `node-server` | `.output/public` | local QA in this repo |

Every build I could run locally emitted `.output/` and never `dist/`, so `publish = "dist"`
looked like an obvious mistake. It is not — Netlify picks its own preset, and that preset's
`publicDir` is `dist/`. PR #13's deploy preview succeeded with exactly this config.

**What that mistaken belief actually broke.** `scripts/finalize-sitemap.ts` was written
against a hardcoded `.output/public` and threw when the directory was absent. On Netlify it
was absent, so the post-build step failed the deploy on PR #14. Nothing local could catch
it: all three local presets put the files where the script expected.

Fixed two ways. `scripts/lib/output-dir.ts` discovers the directory instead of assuming
one, and `finalize-sitemap` treats "no output directory" as non-fatal — the pre-build
sitemap is already valid, it just carries no image entries, and an enrichment step should
never fail a deploy. Gate 15 in `verify-seo.ts` now fails the build if any script in
`scripts/` hardcodes `.output/public/` or `dist/` again.

**The 301s are duplicated in the router regardless.** The generated `[[redirects]]` in
`netlify.toml` only apply when Netlify serves the build; the router copies
(`src/routes/**/catalog.*`) are preset-independent and are what actually run. All 96
legacy URLs are verified single-hop 301 → 200 — including the three hidden models, which
used to redirect to their own 404ing product pages.

## Product photography is CDN-only — I could not visually verify any product page

Every product photograph is a `.asset.json` pointer to `radiocom.lovable.app`, which this
sandbox blocks. On the brand page all 10 product images fail to load here. **This is a
sandbox limitation, not a code fault** — the same pointers render on the live site today.

But it does mean: **I have not been able to see a single product photo in context.** The
brand lineup cards, the story-page hero, the specs-page buy card and the compare table
columns are all laid out against a broken image in every screenshot I took. The layout is
verified; the *look* of those pages with real photography is not.

This is the strongest argument yet for localising those assets — see "CDN assets" above.

## What the new pages are built from

Nothing on the product pages is invented copy. Sources:

| Section | Source |
|---|---|
| Hero blurb, price, range | `products.ts` — `blurb`, `price`, `rangeCity`, `rangeOpen` |
| Highlights shelf | `specs.ts` `rows` + the range figures |
| Feature bento | `specs.ts` `features` |
| In the box | `specs.ts` `inBox` |
| Where it's used | `products.ts` `industries` |
| Spec table | `specs.ts` `rows` |
| Compare tables | `specs.ts` `rows`, joined on the Russian label |

## Still missing, and deliberately left empty

The brief asked for two sections I could not build from existing data:

- **"Built to go places" design section** — needs a short paragraph per model plus macro
  photography. There is no per-model design copy in the repo and no macro shot per model.
  Inventing either would be exactly the "generated catalogue" failure the brief warns
  about, so the section is absent rather than padded.
- **Compatible accessories** — there is no accessories dataset in the repo. `specs.ts`
  `inBox` lists what ships *with* each radio, which is a different thing.

To add either, I need from you: one paragraph per model (or per family), and a list of
accessory SKUs with which models they fit.

- **Product-page FAQ** — the shared `<Faq>` component is ready, but there are no
  per-model questions in the repo. Give me 3–5 questions per family and it drops in.


---

# Phase A — photography imported

## ✅ PRICE LIST APPLIED — «прайс-лист RADIOCOM от 29.06.2026»

You supplied `final.md` (the 29.06.2026 price list plus the radiocom.uz product cards)
and told me to apply it everywhere. Done. Every figure below now comes from that
document; nothing is inferred.

**Prices changed — 10 of 24 models.**

| Model | Was | Now | Δ |
|---|---|---|---|
| Radiocom RCD-70 PRO | 4 200 000 | **1 900 000** | −2 300 000 |
| Radiocom RCD-60 PRO | 3 600 000 | **1 800 000** | −1 800 000 |
| Radiocom RCD-50 PRO | 3 100 000 | **1 800 000** | −1 300 000 |
| Radiocom RCD-40 PRO | 2 600 000 | **1 600 000** | −1 000 000 |
| Radiocom RCD-30 PRO | 2 200 000 | **1 800 000** | −400 000 |
| Radiocom RC-50 | 1 500 000 | **1 300 000** | −200 000 |
| Radiocom RC-20 | 1 400 000 | **1 600 000** | +200 000 |
| Motorola T82 Extreme RSM ⚠ | 2 100 000 | **1 700 000** | −400 000 |
| Motorola CLP 446 ⚠ | 2 400 000 | **2 300 000** | −100 000 |
| Motorola CLK 446 ⚠ | 2 600 000 | **2 500 000** | −100 000 |

Radiocom RC-10 and the twelve visible Motorola models already matched.

**⚠ marks the three models priced from the radiocom.uz card rather than the price
list** — `final.md` says they are absent from the 29.06.2026 list and that their
prices "требуют подтверждения". They stay hidden on the site (no photography), so
nothing is published, but the number in `products.ts` is unconfirmed. Confirm or
correct those three when you can.

**Names.** RCD-30/40/50/60/70 all take the `PRO` suffix the price list uses. The
site had them bare. `Motorola Talkabout T72 Go Active` → `Motorola Talkabout T72`.
URLs are unaffected — the slug comes from the id, not the name.

**Coverage.** Every one of the 24 models now quotes both figures the price list
gives, city and open country. Previously eight Radiocom sheets quoted none at all,
thirteen Motorola sheets quoted only the open-country number, and three quoted a
distance the list does not support (RCD-50 said 8 km against a listed 2,5/10; T42
said 200–300 m against 300 m; T62 said 700–800 m against 900 m). `verify-seo.ts`
gate 17 now fails the build if `products.ts` and `specs.ts` ever disagree again.

**Two figures corrected from the price list.** XT 420 battery 2150 → **2100 мА·ч**.
RC-20 contradicted itself — a 1700 mAh battery type against an 1800 mAh capacity —
and is now 1800 throughout.

**One kit line still open.** `final.md` flags that the price list ships the TLKR-T92
H2O with a **Type-C кабель** while the site card says a USB car charger, and asks
for the current kit to be confirmed. I have followed the price list. Tell me if the
card is right and it is a one-word change.

## The price list also covers products the site does not sell

- **Hytera** — AP515 LF, BD505 LF, BP515 LF, AP525 LF, S10 mini LF and more, 900 000 –
  2 300 000. An entire brand with no pages.
- **Decross** (2 700 000) and **ALINCO** (1 700 000 – 2 400 000).
- **Accessories** — batteries, chargers, headsets, belt clips, 250 000 – 500 000, including
  parts for Samcom CP500/CP510/CP420/CP210P.

That is a lot of sellable inventory with no indexable page. Worth a conversation once the
current work lands.

## Photography — what landed and what is still thin

45 photographs imported, renamed from `Motorola T42 blue (3).webp` / `rcd 50 .webp` to
`t42-blue-hero.webp` / `rcd-50-kit.webp`. Mapped by **looking at every photograph**: the
`.asset.json` pointers stored the old generated names, so filename matching was impossible.

**Two compositions per model** — a radios-alone hero and a retail-box or kit flat-lay. Heroes
lead the product pages; box shots became gallery images, because an apple.com product hero is
the product, not its packaging.

**Five models have only a kit flat-lay, no single-product shot:** RCD-30, RCD-40, RC-10,
RC-20, RC-50. On the lineup grid they read at a different scale from the models that do have
a clean hero — a radio photographed alone fills the frame, a flat-lay of eight accessories
does not. A single-product frame for each of those five would make the lineup consistent.

**Four files are low resolution** (731×813 where everything else is 4032×3024 or larger):
`t62-red-front`, `t62-red-back`, `tlkr-t92h2o-front`, `tlkr-t92h2o-side`. They are gallery
shots, so it is not urgent, but they will look soft next to their siblings.

## Weight

The upload was camera originals — most Motorola frames 6500×4333, several top-level photos
3 MB each. Re-encoded to a 1600px source plus an 800px `srcSet` candidate:

- `src/assets/catalog/` — **19 MB → 5.0 MB**
- top-level photography — **29 MB → 1.7 MB** (95% smaller)

Originals remain in git history at commit `6f4237d` if a print-resolution copy is ever needed.

## Three models hidden

T82 Extreme RSM, CLP446 and CLK446 have no photograph **and do not appear in the price list**.
They are flagged `hidden: true` rather than deleted, so their already-indexed
`/catalog/m-clp446` URLs keep redirecting. Flip the flag when photos and prices arrive.

---

# Site reorganisation — two product claims I removed, and one I need you to settle

## Vertex Standard — removed from the service copy

The English and Uzbek service pages said the bench repairs **Motorola, Radiocom
and Vertex Standard**. The Russian page said only Motorola and Radiocom. So the
three languages disagreed about what the business does, and the odd one out
named a brand that appears nowhere else on the site and is not in the catalogue.

I aligned all three to the Russian version, which is the same call made about
Hytera in an earlier round: metadata is not the place to introduce a product
line the page itself never mentions.

**If the bench does take Vertex Standard**, the fix is to say so in the visible
service copy first and let the metadata follow — tell me and I will put it back
properly, in all three languages.

## Motorola CLP 446 and CLK 446 — removed, and this one loses real detail

The HoReCa page led with two specific claims:

> **7 400 м²** — Покрытие до 6 этажей — Motorola CLP 446 и CLK 446
> **68 г** — Вес рации: незаметна под формой

Neither model is in `products.ts`, and neither figure is in `specs.ts`. The page
does not even recommend them — its own model list is RC-20, RC-10, XT185,
T62 Red, T82 and RCD-30. `meta.brand.motorola_desc` also advertised "Talkabout,
XT, TLKR и CLP" while the visible brand page correctly said "Talkabout, XT и
TLKR".

I replaced the two statistics with figures that **are** sourced, for models the
page actually recommends:

| Was | Now | Source |
|---|---|---|
| 7 400 м², CLP/CLK | **1,5 км** in town — RC-20 and Motorola T82 | `products.ts` `rangeCity` |
| 68 г | **12 часов** on one charge — RC-20 | `specs.ts` «Время работы от аккумулятора» |

**This is the one I would most like you to check.** Those original numbers read
like they came from a real Motorola datasheet, which suggests you may genuinely
sell CLP 446 and CLK 446 without having catalogued them. If so, the right fix is
not the copy — it is adding the models to `products.ts` with their real specs,
and then the original HoReCa claims can come back verbatim. Send me the price
and spec sheet and I will add them.

Weight is not tracked in `specs.ts` for any model, so «68 г» could not have been
restored even for a catalogued product.

# SEO — things that are live but that you should know about

## IndexNow is switched on

`scripts/indexnow.ts` pings Bing and Yandex whenever the sitemap changes, so a new model gets
crawled in minutes rather than days. Yandex is the reason it is there — it has real share in
Uzbekistan, and Google does not participate in IndexNow at all, so this is additive to the
sitemap rather than a replacement.

Nothing to register. The key is self-issued and published at
`/522cb0c8834b9e0950503fc0e99cbed8.txt`; hosting it is what proves control of the domain.

**It only fires on a Netlify production deploy** (`CONTEXT=production`). Local and preview
builds skip it, because announcing the site to two search engines on every `bun run build`
would get the key throttled. Force one by hand with `INDEXNOW=1 bun scripts/indexnow.ts`.

If it ever fails it logs and the deploy continues — a slow search engine must not fail a
deploy.

## The two search-console verifications are still yours to do

Everything below works without them, but you cannot *see* any of it working until they exist:

1. **Google Search Console** — verify `radiocom.uz`, submit `https://radiocom.uz/sitemap.xml`.
   This is where the Product rich-result and image-indexing reports appear.
2. **Yandex Webmaster** — same, and the more important of the two for this market.

## What is emitted, so you can check it against the report

Per product: `Product` with `Offer` carrying price, `priceValidUntil` (a rolling year, not a
fixed date), free-delivery `shippingDetails` and your published 5-day `hasMerchantReturnPolicy`.
Per brand page: `CollectionPage` with an `AggregateOffer` spanning that family's real price
floor and ceiling. Plus `Organization`, `LocalBusiness`, `WebSite`, `BreadcrumbList`,
`FAQPage` (with `speakable`), `Service` and `SiteNavigationElement`.

**Deliberately absent: `aggregateRating` and `review`.** There are no real reviews behind
them. Emitting either is a Google policy violation that risks a manual action on the whole
domain, and it is exactly the invented data your brief rules out. If you collect real reviews,
that is the moment to add it — `scripts/verify-seo.ts` currently *fails the build* if rating
markup appears, so flip that gate at the same time.

---

## The sitelinks searchbox is live — and what it still cannot do

`/{lang}/search` exists now, and `webSiteSchema()` carries the `SearchAction`
that points at it. That markup was removed in an earlier phase with a note to
reinstate it only alongside a real search route, because the previous version
advertised `/ru/catalog?q=` against a catalogue that validated only `cat` and
`brand` — it described an endpoint that was not there.

Two things you should know about it:

- **Sitelinks themselves are not markup.** Google generates the block of links
  under a search result algorithmically, from site structure and internal
  linking. Nothing forces them, and anyone offering to is wrong. What is
  genuinely in our control is now done: an HTML sitemap at `/{lang}/sitemap`
  linking every route by its real name, `SiteNavigationElement` on the main
  sections, breadcrumbs on every page type, and search reachable from the nav
  and the footer.
- **The searchbox is a Russian target.** A `SearchAction` takes one URL
  template, and `DEFAULT_SEO_LANG` is the locale the domain serves first.

## Three SEO levers left, all needing data only you have

These are the last things on the list, and none of them can be written from the
repo:

- **Reviews and ratings.** `aggregateRating` and `review` are the single
  biggest remaining rich-result win for a product page — stars in the result
  are worth more than any amount of schema tidying. They need real reviews from
  real customers. `verify-seo.ts` currently *fails the build* if rating markup
  appears, precisely so nobody is tempted; flip that gate when the reviews are
  real.
- **GTINs.** `sku` ships (the model id) and `mpn` could follow, but a `gtin13`
  needs the actual barcode from each box. Twenty-one numbers, and Google
  weights merchant listings that carry them.
- **Video.** `VideoObject` is the other format that changes how a result looks.
  There is no video, so there is no markup.

---

## The QA suite — `bun run qa`

`bun run verify` checks the source and the JSON: 20 SEO gates, 10 i18n gates,
the asset manifest. It runs in the build and takes a second.

`bun run qa` is the other half, and it needs a server: it drives a real browser
against a `node-server` build and checks the things that only fail at render
time. Start the server first (`NITRO_PRESET=node-server bun run build` then
`node .output/server/index.mjs`), then:

| script | what only it can catch |
|---|---|
| `qa-images` | an `<img>` in the broken state — 1896 elements across 132 page loads |
| `qa-overflow` | a page that scrolls sideways, at six widths from 390 to 1920 |
| `qa-touch` | a tap target under 24px, with touch emulation on |
| `qa-blend` | a `mix-blend` image stranded inside a stacking context, which renders as a white box on a tinted band |
| `qa-motion` | a page with no scroll choreography, a phone downloading GSAP, or an element left invisible by a stagger that never fired |
| `qa-search` | the route the `SearchAction` advertises returning nothing |
| `qa-i18n-rendered` | a raw key or stray Cyrillic on the rendered page — this is how `tradein.sub` was found after every JSON check passed |
| `qa-a11y` | WCAG 2.2 A/AA, 12 routes × 3 locales |

Two of these exist because a static check let something through to production.
`qa-blend` was written after the PoC hero rendered as a white rectangle, and
then immediately caught the same mistake being made again on the compare table.
`qa-i18n-rendered` was written after `tradein.sub` shipped as visible text on
both brand pages in all three locales, having passed every key-parity check —
because the key was stored as data in a card table rather than written as a
literal `t("...")`. `verify-i18n` now catches that class too.

---

# Performance — measured, and where the ceiling is

Lighthouse, mobile, throttled, across seven page types:

| page | Performance | Accessibility | Best Practices | SEO | LCP |
|---|---|---|---|---|---|
| home | 83 | 100 | 100 | 100 | 3.9 s |
| brand | 84 | 100 | 100 | 100 | 3.8 s |
| product story | 88 | 100 | 100 | 100 | 3.2 s |
| specs | 89 | 100 | 100 | 100 | 3.1 s |
| industry | 87 | 100 | 100 | 100 | 3.4 s |
| compare | 95 | 100 | 100 | 100 | 2.4 s |
| service | 81 | 100 | 100 | 100 | 4.6 s |

**Measure it with compression or the number is meaningless.** The local nitro
preview serves everything uncompressed, so Lighthouse sees an 818 KB script
where Netlify's edge serves ~250 KB gzipped. Run against the raw preview, the
same pages score 58–61 — roughly 25 points of pure measurement artifact. The
table above was taken through a gzip proxy so it reflects what a visitor gets.

## What was actually wrong, and is now fixed

- **~600 KB of Supabase in every page's bundle.** `attachSupabaseAuth` is
  registered as a global function middleware and imported the SDK at module
  scope. There is not one `createServerFn` in this codebase — the lead form
  posts to `/api/send-lead` with plain `fetch` — so it has never run in
  production while costing every visitor the download. The import is dynamic
  now; the middleware still works the day a serverFn is added.
- **A 341 KB PNG logo**, 1793×313, rendered at 22 px tall, downloading ahead of
  the stylesheet on every page. Now 19 KB of WebP with a 300 px candidate.
- **A 590 KB PNG home hero** — on its own, more than half the home page's
  weight, and its LCP element. Now 68 KB of WebP. Home LCP went 6.3 s → 3.9 s.
- **250 KB of GSAP on every route.** Now loaded only where something animates,
  which is the home page. `scripts/qa-console.mjs` asserts this per route.

## The remaining gap to 90 is architectural, not a bug

What is left is a ~250 KB gzipped entry chunk: TanStack Start, React,
framer-motion, i18next with all three locales, and the product data. TanStack's
`autoCodeSplitting` is already on by default, but it cannot split these routes —
each route file is `createFileRoute(path)(importedRouteOptions)`, and the
splitter can only lift a `component` it can see declared in the route file.

Making it split means giving every route file an inline `component` with a lazy
import and moving each page's `head()` into its own module — fourteen files,
each one a chance to break the SSR meta that the whole SEO layer depends on. It
is worth doing, but it is its own piece of work with its own verification, not
something to slip into a QA pass. Expect it to buy roughly 5–8 points.

Removing framer-motion or Lenis would buy more, but that is a design decision
about how the site feels, not a performance fix — so it is yours to make.

## The four new PoC photos — two things I noticed, neither of which I changed

You uploaded four images for the PoC page and asked me to make them look
harmonic. They are now `src/assets/cutout/poc-*-cutout.webp`, normalised by
`scripts/build-poc-cutouts.ts` (renamed into the `<name>` + `<name>@800`
convention the `srcSet` pipeline needs, cropped to the subject, veil cleared).
The harmonising was a scale problem: the four-radio fan filled 39% of its
canvas while the close hand filled 86%, so dropped into equal slots one radio
rendered at roughly half the weight of the other. That is fixed.

Two things in the photographs themselves are yours to decide, not mine:

- **Three of the four show a visible `Caltta` logo** on the radio body — the
  OEM, not a brand the catalogue sells. Every other product photo on the site
  is Radiocom- or Motorola-branded. A buyer who reads the badge and searches it
  lands on a manufacturer you do not name anywhere else on the site.
- **The retail box reads `RCE-300`.** `src/data/products.ts` does not carry an
  RCE-300 — the PoC family in the catalogue is different. So the hero shot of
  the PoC page advertises a model nobody can then find or price.

I shipped them as given, because they are your product photography and
substituting something else quietly is not my call. If either matters, the fix
is new source images, not code.

## Founding year — answered: 2012, and the arithmetic would have been wrong

**Resolved.** The company was founded in **2012**, so it has been trading
**14 years**, and `Organization.foundingDate` is now `"2012"`.

Worth recording why this one was worth asking about rather than working out.
The site said «11 лет на рынке» and never named a year; subtracting 11 from 2026
gives 2015. The real answer is 2012 — the copy had gone stale by three years, so
the arithmetic was off by three. Had that inference gone into the schema
unasked, a wrong founding date would now be sitting in a Google knowledge panel,
which is slow and awkward to correct once indexed.

The tenure figure is no longer written out by hand. `src/lib/seo.ts` holds
`FOUNDED_YEAR = 2012` and derives `YEARS_TRADING` from the current year, and the
home page's counter reads from it, so the number on screen cannot drift from the
schema. The copy in `hero.sub`, `trust_years` and `meta.home.desc` still spells
"14" out in three languages — those are sentences, not counters — so they need a
one-word edit each January.

## Two claims I removed from the industry pages, in case they were true

`industries.offers` on all eight industry pages promised things nothing else on
the site supports. I rewrote the cards to what the rest of the site does say
(see the commit for the reasoning), but if either of these is real, say so and
they go back — with a matching line on the service page so a reader who follows
the link finds the same promise waiting.

- **Подменный фонд / loaner units.** The service card offered one. The service
  page, its four advantages, the repair flow and the FAQ never mention lending a
  device during a repair. If you do run a loaner fleet, that is a genuine
  differentiator and it belongs on `/service` first.
- **«Настройка частот на весь срок службы».** Frequency setup for the lifetime
  of the device, against «Гарантия 12 месяцев» printed beside every buy button.
  If support really does continue past the warranty, tell me the actual term and
  I will write it in both places.

One more, already fixed rather than asked about, because the three locales
disagreed with each other: `tradein.desc` says «со скидкой» in Russian but
promised "a **massive** discount" in English and «**katta** chegirma» in Uzbek.
An English-reading buyer was being told something the Russian original does not
claim. All three now say what the Russian says.

## What is actually in the 256 KB every visitor downloads

Nothing in the repo documented this, so the first thing I did before touching
fifteen route files was measure it. Sourcemapped build, VLQ-decoded mappings,
every generated byte charged to its source module.

| bucket | raw KB | ~gz KB | |
|---|---|---|---|
| react-dom | 174.6 | 52.7 | framework, eager |
| motion-dom + framer-motion | 136.7 | 41.3 | eager — `__root` imports `MotionConfig`; `Nav` and `LeadFormSheet` use it |
| `@tanstack/*` router + query + start | 138.0 | 41.7 | framework, eager |
| **locales ru + en + uz** | 80.3 | 24.3 | eager via `__root`'s `getI18n` — **only one is ever used** |
| **page bodies, all 11** | 69.1 | 20.9 | what route splitting moves out |
| `components/` | 44.9 | 13.6 | much of it page-only, follows the pages out |
| i18next | 41.6 | 12.6 | eager |
| product data | 38.7 | 11.7 | eager via `seo.ts`, which every `head()` uses |
| tailwind-merge · seroval · lenis | 63.3 | 19.2 | eager |

**One caveat worth writing down, because it cost me a wrong answer first time.**
Vite inlines JSON with no sourcemap mappings, so those bytes get charged to
whichever module happens to precede them. My first table blamed 64.9 KB on
`src/lib/lovable-error-reporting.ts` — a file that is **0.8 KB of source**. It
was absorbing the locale JSON sitting next to it. If you ever run a bundle
analyser on this project, distrust any single file whose attributed size is
wildly larger than the file on disk.

### What this means for the TODO note above

That note estimated route splitting was worth "roughly 5–8 points". I can't
stand behind that number. The measured position:

- Route splitting moves **20.9 KB gz** of page bodies plus roughly **9 KB gz**
  of page-only components. Each route then loads its own body (2–4 KB gz)
  instead of all eleven.
- Shipping one locale instead of three saves another **13.7 KB gz**.
- Narrowing `seo.ts` saves up to **11.7 KB gz** on routes that never touch a
  product.

Together that is roughly 256 KB → ~210 KB gz, about 18%. Real, worth doing, and
smaller than the note promised. The three biggest items in the bundle —
react-dom, the motion library, and the TanStack framework — are eager by
construction and no amount of route splitting touches them.

## What is in the JavaScript bundle, and what is not worth doing about it

Nothing in the repo documented this, so here it is, measured rather than
guessed. Attribution of the entry chunk by source module (corrected for Vite
inlining JSON with no sourcemap mappings, which had been charging 65 KB of
locale data to a 0.8 KB error-reporting file):

| | raw | note |
|---|---|---|
| react-dom | 174.6 KB | framework |
| framer-motion + motion-dom | 136.7 KB | eager: `__root` MotionConfig, Nav, LeadFormSheet |
| TanStack router + query + start | 138 KB | framework |
| locales ru+en+uz | 80.3 KB | eager via `getI18n` |
| **page bodies (11 pages)** | **69.1 KB** | now split per route |
| components | 44.9 KB | much of it now follows the pages |
| i18next | 41.6 KB | eager |
| product data | 38.7 KB | eager — see below |

**The route split worked and the baseline is the reason it mattered.** Before
it, every one of the twelve routes fetched *exactly* 956.1 KB of JavaScript.
Identical. Whether you asked for the sitemap or a product page, you got the
whole site. `autoCodeSplitting` was on and lifting nothing, because
`createFileRoute(path)(routeOptions)` hides the `component` key from the
plugin's matcher. Routes now range 823-898 KB and `scripts/qa-weight.mjs`
fails the build if they ever converge again.

### Two things that look like waste and are not worth removing

**The catalogue (53 KB of `products.ts` + `spec-dict.ts`) is eager, and it has
to be.** I tried moving the four route guards from `beforeLoad` to `loader` —
`loader` is code-splittable and `beforeLoad` is not — and verified every 404 and
301 came back identical. It bought exactly zero bytes, so I reverted it. The
real holder is `head()`: a product page's title and its `Product` JSON-LD need
the product, `head` is deliberately not splittable because SSR needs it
synchronously, and the route tree is eager, so all five product-aware `head()`s
are eager on every route. The only ways out are to stop emitting product
structured data — a real SEO loss for 16 KB — or for TanStack to support lazy
per-route `head`. Neither is a trade worth making.

**Shipping one locale instead of three would cost more than it saves.** Only
en+uz is genuinely redundant: 16.7 KB gz, and it is in a content-hashed chunk,
so it downloads once and is reused for the whole session. Injecting the active
locale into the HTML instead would put 10.4 KB gz on *every* page view,
uncached — a net loss after two pages. Awaiting a locale chunk before hydration
would trade the bytes for a round-trip before interactivity. And `LangToggle`
switches with `router.navigate()`, so the other locales would need on-demand
loading anyway, risking a wrong-language flash on the single most-used control
in a three-language market. `src/lib/i18n.ts` also documents at length why it
holds one immutable instance per language — a cross-request SSR race guard worth
considerably more than 16.7 KB.

The remaining eager weight is framework and motion library. Removing
framer-motion or Lenis would buy real bytes, but that is a decision about how
the site feels, not a performance fix, so it stays yours.

## The keyword set the headings are built around

**What this is and is not.** I had no live keyword tool in this session, so there
are no search volumes here and I have not invented any. This is the target set
derived from the vocabulary the catalogue itself uses and the market the site
sells into. Run it through a real tool when you have one — the headings are easy
to adjust once you know which of these actually carry volume in Uzbekistan.

| Intent | RU | UZ | EN |
|---|---|---|---|
| Category | рации, радиостанции, портативные радиостанции | ratsiya, ratsiyalar | two-way radios, walkie-talkies |
| Qualifier | профессиональные рации | professional ratsiyalar | professional two-way radios |
| Technology | цифровые DMR рации, PoC-рации, PMR446 | raqamli DMR, PoC ratsiyalar | digital DMR radios, PoC radios |
| Commercial | купить рацию Ташкент, цена рации | ratsiya narxi Toshkent | buy two-way radios Tashkent |
| Brand | Motorola Ташкент, Radiocom рации | Motorola Toshkent | Motorola Tashkent |
| Service | ремонт раций Ташкент | ratsiya ta'miri | radio repair Tashkent |
| Vertical | рации для стройки / охраны / склада / отеля | qurilish / xavfsizlik uchun ratsiya | radios for construction / security |

**What changed.** The meta titles were already carrying these — «Рации и
радиостанции в Ташкенте», «Ремонт рации в Ташкенте», «PoC-рации». The `h1`s were
not: the home page said «Про-связь. Несокрушимая.», the industry pages said
«Строительство.», and the brand pages said «Motorola». So a visitor arriving on
a title-tag match landed on a heading that confirmed nothing, and the strongest
on-page signal after the title was spent on voice alone.

Every `h1` now leads with the category noun and keeps the two-beat rhythm the
site is written in: «Профессиональные рации. Несокрушимые.», «Рации для
строительства», «Ремонт раций, которому доверяют.» The rule applied throughout —
if a heading reads like it was written for a crawler, it is wrong.

Per-industry `h1`s are written out one by one rather than interpolated from a
`для {{name}}` pattern, because Russian needs the genitive («для
строительства», not «для Строительство») and Uzbek a postposition. A pattern
would have produced ungrammatical headings in two of the three languages.

## The MOTOTRBO shopping list

Your «Что вы получите» rewrite was built around Motorola's professional DMR
line, and none of it is in `products.ts`. The catalogue's Motorola range is
PMR446 consumer and light-commercial: Talkabout T-series, XT185, XT420, CLP 446,
CLK 446. Missing, and named in the drafts:

**DP4600 · DP4800 · DP4400 · DP3441 · DP2600** (handhelds) ·
**DM2600 · DM4600** (mobile stations) · **SLR5500 · SLR8000** (repeaters) ·
**Caltta** PoC radios.

Also unsupported by any line in `products.ts` or `specs.ts`, so not shipped:
the **−30…+60 °C** operating range, **25 W** mobile output, **1000 channels**,
the **FM** intrinsic-safety rating, and lone-worker monitoring.

Adding the DMR line is a data task — names, specs, prices, photos into
`products.ts` and `specs.ts` — after which the six industry pages can carry the
copy you actually wrote. Until then they carry stats that trace to real rows.

### What the pages claimed before, which is why this mattered

The stat blocks were not merely unsupported, they were largely invented, and
several contradicted the catalogue outright:

| Page | Claimed | Reality |
|---|---|---|
| Добыча | `ATEX` искробезопасное | zero occurrences anywhere in the data |
| Добыча | `15 км` range | the catalogue's maximum is **10 km** |
| Добыча | `99.9%` network uptime | invented |
| Добыча | `3 года` warranty | `specs.ts` says **12 месяцев на радиоблок** |
| Строительство | `IP68` | zero occurrences — **IP67** is the real rating |
| Строительство | `8 км с ретранслятором` | no repeater in the catalogue |
| Транспорт | `100% РУз` LTE coverage | a claim about an operator's network |
| Транспорт | `97% покрытия` | same |
| Производство | `40%` less coordination time | invented |
| Производство | `60 дБ` noise cancelling | not in any spec row |
| HoReCa | `3 года` Motorola warranty | 12 months |

The FAQ answers carried the same problem — «поставляем ATEX-версии Motorola
DP4801 Ex» and «Motorola DP4400/DP4600 работают от −30°C до +60°C» both named
products that do not exist here. Those are rewritten too: the mining page now
says plainly that there are no Ex versions in the current catalogue and invites
the buyer to say which class they need.

## The «Нам доверяют» logo strip — what I decided and what is yours

52 client logos, on the home page, both brand pages, PoC, service and every
industry page, immediately above the contact block.

**Four of the 52 are state bodies, not two.** You confirmed МВД (Ichki ishlar
vazirligi) and Прокуратура. Reading the other logos to write alt text turned up
two more of the same kind: the **Ministry of Justice** (Adliya vazirligi) and
the **State Security Service** (Davlat xavfsizlik xizmati). I included all four,
consistently with your decision on the first two — but you only saw two named
when you made it, so say if the other two should come out. They are one line
each in `src/data/clients.ts`.

**Nineteen filenames were unreadable**, so every logo was identified by opening
it. `AB-1` is Asakabank, `CE-1` is Çalık Enerji, `ozv` is Özgüven, `carf` is
Carrefour, `marr` is Courtyard by Marriott, `inrer` is International Hotel
Tashkent, `H-1` is HAVAS, `MC-1` is Magic City. The files are renamed to match,
so `src/assets/companies-trust/` now reads as a list of companies rather than a
list of codes. If I have misread one, the fix is the `name` in
`src/data/clients.ts` — the alt text and the filename both come from there.

This mattered because a glob over the directory would have shipped
`alt="AB-1"`, which is worse than nothing: it tells a screen-reader user
nothing and hands a crawler a string with no meaning. The strip is the best
credibility asset on the site and it should be legible to both.

## Image descriptors: a known inaccuracy that currently costs nothing

`scripts/build-image-variants.ts` scales by the **longest edge**, so a portrait
source's `@800` file is not 800px wide. `rc-50-device@800.webp` is 224px across;
`radio-macro-cutout@800.webp` is 597px; the industry posters' `@800` is 533px.

Most `srcSet` strings in the app declare a flat `400w, 800w, 1600w`, which for
those files overstates what they hold. Where I added new candidates — the
posters, the industry heroes, the service bench strip — the descriptors carry
the **real** widths instead, because those slots are small enough for the
difference to decide which file the browser picks.

**Measured, before changing anything: this has never cost the site a pixel.**
Across all 56 `/ru/` routes at DPR 2, 38 of 624 rendered images were genuinely
under-served, and every single one of them had *no* `srcSet` at all — not one
was under-served because a descriptor lied. Those 38 are now down to 5, and all
five are source-asset ceilings (the master file is simply smaller than a Retina
desktop wants):

| File | Has | Wanted at DPR 2 |
|---|---|---|
| `radios-pair-crossed-cutout.webp` | 889px | 2246px |
| `industry-*.jpg` | 1400px | 3168px |
| `service-tech-light.jpg` | 1264px | 2561px |
| `rcd-70-kit.webp` | 1080px | 2072px |
| `hero-rcd60-cutout.webp` | 597px | 1044px |

Nothing to fix in code — these need larger originals, which is a photography
task. They are all fine at DPR 1 and on phones.

**Why it is worth writing down anyway:** the finding holds for the slot sizes
the pages use *today*. Widen a slot, or drop one of these images into a bigger
frame, and a nominal descriptor could start choosing the wrong file. The durable
fix, if that ever happens, is for the pipeline to emit a manifest of real widths
rather than for call sites to hardcode them.

## SEO sweep — two things only you can answer

**1. Hytera — removed, and the page had already answered it.**

The home page's meta description named **Hytera** among the brands sold. The
catalogue holds 24 models — eight Radiocom and sixteen Motorola — and not one
Hytera. Someone searching «Hytera Ташкент» would have landed on a page that
sells no Hytera.

The service page turned out to be the clearer case. Its metadata and its visible
copy disagreed, in all three locales:

| | Brands named |
|---|---|
| What the page says | Motorola, **Radiocom**, Vertex Standard |
| What the meta description and `Service` schema said | Motorola, **Hytera**, Vertex Standard |

So the page itself never claimed to repair Hytera — the metadata had substituted
it for Radiocom. A snippet promising a brand the page does not mention is a
weak result, and structured data that contradicts the page is against Google's
guidelines outright. Both now match the page: Motorola, Radiocom, Vertex
Standard. Hytera appears nowhere in `src/i18n/` any more.

Nothing needed from you unless the bench *does* take Hytera, in which case the
right fix is to say so in the page copy first and let the metadata follow.

**2. What year was the company founded? — answered: 2012.**

`Organization.foundingDate` is `"2012"` and every tenure string now says
**14 лет / 14 years / 14 yil**. The inference offered here was 2015, from
«11 лет» plus 2026; it was wrong by three years because the copy itself was
three years stale. That is the whole argument for asking instead of computing,
and it is written up under "Founding year" above.

**Still open, and smaller:** «10 000+ клиентов» has never been checked. It sits
in `meta.home.desc` in ru/en/uz and is quoted verbatim into the `Organization`
schema, so if that figure has moved it is the same three-file edit.

## Agent discovery — what is published, and what is still refused

A second isitagentready.com scan, after the first round shipped, found two
defects in that round. Both were the same kind of mistake — a document that
looked right and was never checked against reality — and both are now covered by
`scripts/verify-agent-discovery.ts`, which fails the build:

| Defect | What it was |
|---|---|
| `Link` header absent from every page | Declared in `netlify.toml`. Either Netlify does not apply `[[headers]]` to SSR responses, or the `/ru/*` glob never matched the canonical homepage `/ru`. Now emitted from `agentAcceptMiddleware`, which owns the response. |
| ARD entries all invalid | Used `id`; the spec (§4.2) requires `identifier`. Every entry was rejected. |

### Published

| Goal | What ships |
|---|---|
| MCP server | `POST /mcp` — streamable HTTP, read-only, no auth. Four tools over the real catalogue: `list_radios`, `search_radios`, `get_radio`, `compare_radios`. |
| MCP Server Card | `/.well-known/mcp/server-card.json`, pointing at that endpoint |
| Agent Skills index | `/.well-known/agent-skills/index.json` + a `SKILL.md`, with a computed SHA-256 digest |
| WebMCP | The same tools in the browser, plus `open_lead_form`; behind a feature detect and a dynamic import |
| Markdown for agents | `Accept: text/markdown` returns Markdown |
| Content Signals | `search=yes, ai-input=yes, ai-train=no` |
| `Link` headers | `describedby` → the locale's `llms.txt`; `alternate` → the same URL as Markdown |
| ARD manifest | `/.well-known/ai-catalog.json`, seven entries, all resolvable |
| API catalogue | `/.well-known/api-catalog` (RFC 9727), a linkset anchored on `/mcp` |

**The MCP server is read-only, and that is deliberate.** There is no tool that
submits an enquiry or places an order: an unattended agent posting into the
sales pipeline is spam with extra steps. The browser-side twin *does* offer
`open_lead_form`, for the opposite reason — a person is sitting there and still
presses send.

**`ai-train=no` is a recommendation, not a leftover default.** You asked for the
best call, so here is the reasoning. `search=yes` and `ai-input=yes` stay,
because those are the channels that deliver traffic and they read **live**
pages. Training is different in kind: it freezes content into weights, and this
site is a price list. A model quoting a 2026 сум figure in 2029 misleads a
customer with no way to correct it, and the grant is irreversible in effect even
if the header changes later. The upside — brand presence in future model
weights — is speculative and unmeasurable, and the discovery value is already
captured by the two signals that stay `yes`. Change it later if that trade ever
looks different; it is one word in `scripts/generate-seo.ts`.

### Still refused

| Goal | Why not |
|---|---|
| OAuth/OIDC discovery | There is no authorization server. Publishing `authorization_endpoint` and `token_endpoint` would send agents to URLs that do not resolve. |
| OAuth Protected Resource metadata | Nothing here is a protected resource — `/mcp` is deliberately open and read-only. |
| `auth.md` | Same: there is no agent registration to describe. |

**`api-catalog` moved out of this table because the facts changed, not the
standard.** Last round the honest answer was "there is no public API" — the only
endpoint was `/api/send-lead`, which robots.txt disallows and which takes a lead
form rather than queries. Shipping `/mcp` created a real queryable API, a
machine-readable description of it (the server card) and documentation for it
(the `SKILL.md`), which is exactly the set of things a catalogue links to. So it
is now published, anchored on `/mcp`, with a `status` link to `/mcp/health` that
reports the live model count rather than a hardcoded `ok`.

**The remaining three are one decision away.** They describe authentication, and
`/mcp` is deliberately open and read-only, so today they would name a
`token_endpoint` that 404s and send an agent into a flow that cannot complete —
worse served than finding no document at all. Build an authenticated surface and
all three become publishable the same afternoon.

**DNS-AID is not refused, it is just not in this repo.** It needs SVCB/HTTPS
records under `_agents.radiocom.uz` and the zone signed with DNSSEC, done at the
DNS host by whoever controls the domain. Say the word and I will write the exact
records out to paste.


## The licence question — I could not build the section the plan promised

The plan for this round had one organising idea: **answer the permit question
first.** The pitch was that the catalogue splits cleanly — Motorola is
licence-free, buy it and switch it on; Radiocom reaches further and needs a
frequency permit, which you handle — and that this is the single most useful
thing a buyer can be told, yet the site never says it plainly.

I went to build that section and measured the catalogue first. The split does
not exist.

| Model | Brand | `License-free` tag | Frequency in `specs.ts` |
|---|---|---|---|
| rcd-70, rcd-60, rcd-50 | radiocom | — | **no frequency row at all** |
| rcd-40, rcd-30, rc-50, rc-10 | radiocom | — | 446.0–446.1 МГц |
| rc-20 | radiocom | License-free | 446.0–446.1 МГц |
| t72 | motorola | License-free | no frequency row |
| the other 12 Motorola | motorola | License-free | 446–446.1 МГц |

Two things fall out of it, and they are different kinds of problem.

**1. The tag is wrong on four models — a data bug.** `rcd-40`, `rcd-30`, `rc-50`
and `rc-10` publish 446.0–446.1 МГц on their own spec sheets, the same
licence-exempt PMR446 band as every Motorola in the range, and the same band as
`rc-20`, which *is* tagged. So 18 of 21 models are on the licence-free band while
only 14 say so. Anyone filtering or reading tags gets four wrong answers. This is
worth fixing in `products.ts` whatever you decide about the rest.

**2. There is no evidence in the catalogue that any model needs a permit.** Not
weak evidence — none. The three DMR models that would plausibly be the licensed
ones (`rcd-70`, `rcd-60`, `rcd-50`) carry no frequency data at all, so the
catalogue is silent rather than negative. I am not going to write "needs a
permit, we handle it" onto a page from an absence of data, and I am not going to
infer a band from the fact that a radio is digital.

So the home page does not get the permit fork, and the two-way "which kind do you
need" card pair is not in this PR. What is there instead is the industries row,
which answers the same question — *what is it for* — from data that exists.

**What I need from you, in one line each** (the first is the one that matters —
the others are tidy-ups):

- Do `rcd-70`, `rcd-60` and `rcd-50` operate outside PMR446, and does a customer
  need a frequency permit for them? If yes, give me the band and I will write the
  section as planned — it is a genuinely strong page and the reason the plan led
  with it.
- Should the `License-free` tag be added to `rcd-40`, `rcd-30`, `rc-50` and
  `rc-10`? Their own spec rows say it already.
- ~~Do you actually arrange frequency permits for customers? The plan asserted
  it; nothing in the repo does.~~ **I was wrong about this and have struck it
  out.** The PoC page's network-design steps have said so all along —
  «Согласование частот с Госкомсвязи РУз», now reworded to «Оформляем частоты в
  Госкомсвязи». So the service is real and stated on the site; what is missing is
  only the evidence that any *catalogue model* needs a permit in the first place.
  That makes the first question below the one that decides whether the home-page
  section can be written.
