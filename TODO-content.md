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

## ⚠ `netlify.toml` publish directory — needs your attention

`netlify.toml` declares `publish = "dist"`. **`bun run build` never creates `dist/`** —
it emits `.output/` (nitro). I verified this: after a clean build the repo root has
`.output/` and no `dist/` at all.

That means Netlify is publishing a directory that does not exist, and — the reason it
matters for this phase — **the `[[redirects]]` table in `netlify.toml` may never be
applied**. I generated all 75 rules into it anyway, but I could not verify from here
whether Netlify honours them, because this sandbox's network policy blocks
`radiocomuz.netlify.app`.

**The migration is safe regardless**: every 301 is also implemented in the router
(`src/routes/**/catalog.*`), which is what actually runs. I verified all of them:

```
/ru/catalog        301 -> /ru/radiocom          /catalog          301 -> /ru/radiocom
/ru/catalog/rcd-60 301 -> /ru/radiocom/rcd-60   /catalog/rcd-60   301 -> /ru/radiocom/rcd-60
/ru/catalog/m-t82  301 -> /ru/motorola/t82      /uz/catalog/rc-10 301 -> /uz/radiocom/rc-10
```

All single-hop. The legacy unprefixed URLs resolve both the locale prefix and the brand
move in one redirect rather than chaining.

The likely fix is `publish = ".output/public"` with the nitro `netlify` preset, but that
depends on how the site is configured on Netlify's side. Please check.

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

## ⚠ PRICE LIST vs SITE — 7 mismatches, all Radiocom. Your call.

I extracted every price from «29.06.26 Прайс лист рус» and compared it to
`src/data/products.ts`. **All 12 Motorola prices match exactly**, and so does RC-10. The
Radiocom line does not:

| Model | Site now | Price list | Difference |
|---|---|---|---|
| RC-20 | 1 400 000 | **1 600 000** | site 200 000 **under** |
| RC-50 | 1 500 000 | **1 300 000** | site 200 000 over |
| RCD-30 PRO | 2 200 000 | **1 800 000** | site 400 000 over |
| RCD-40 PRO | 2 600 000 | **1 600 000** | site 1 000 000 over |
| RCD-50 PRO | 3 100 000 | **1 800 000** | site 1 300 000 over |
| RCD-60 PRO | 3 600 000 | **1 800 000** | site 1 800 000 over |
| RCD-70 PRO | 4 200 000 | **1 900 000** | site 2 300 000 over — **2.2×** |

**I have changed nothing.** Either the site has been quoting RCD radios at up to double your
list price, or that PDF is superseded. Only you know which. Tell me and it is a one-line edit
per model — the price is read from `products.ts` everywhere it appears.

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

## Prices are still unreconciled

Seven Radiocom prices differ between the PDF price list and `src/data/products.ts`. The
largest is RCD-70: **4 200 000 on the site, 1 900 000 in the list** — a factor of 2.2. All
twelve Motorola prices match exactly.

I have changed no number. This now matters more than it did: the price is emitted as
structured data with a validity window, so a wrong number is published to Google as a
merchant offer rather than just displayed on a page.

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
