# SEO and ads-readiness plan

Three goals, in order:

1. Paid traffic (Google Ads, Yandex Direct, Instagram/Telegram) converts, and
   every conversion records where it came from.
2. The site wins organic search in Uzbekistan — Yandex and Google, Russian and
   Uzbek — for the queries in the keyword data.
3. The rankings the old WordPress site already has survive the switch of
   radiocom.uz to this build.

Nobody can guarantee position 1. This work removes every on-site reason not to
rank or convert; `OWNER-QUESTIONS.md` and `SEO-OFFSITE.md` hold what only the
owner can do.

## Status

| Phase | What | State |
| ----- | ---- | ----- |
| 0 | This plan, owner questions | done |
| 1 | Ads readiness: tracking, forms, parameters, contact paths, counters, first screen, caching | merged (#32) |
| 2 | WordPress → new site redirects | #34 (reopened to `main`; #33 had merged into the stale stacked base) |
| 3 | Keyword map | done, from the owner's map: [`keyword-map.md`](keyword-map.md), [`keyword-map.csv`](keyword-map.csv) |
| 4 | Landing-page copy | done: home, both brands, compare, PoC, service, the industries hub and six industries, product pages |
| 5 | New pages | done: /rent, /solutions, /about, /contacts and three answers (pmr446, what-is-dmr, ip67). Not built, with the reason for each: `keyword-map.md` |
| 6 | Verify and hand off | the keyword-content PR |

The Wordstat/GKP/Ahrefs exports never arrived. On 2026-10-04 the owner supplied their own keyword map instead and asked for it to be used, and for the remaining questions to be settled without them (see `OWNER-QUESTIONS.md`). Volumes are still unmeasured; `keyword-map.md` lists the checks to run before ad spend.

## How the keyword copy is built

- **Weight first.** All three locale JSONs ship to every visitor, and the eager baseline was 874.5 of 880 KB. So before any copy was written, the industry body copy moved to code-split modules: the baseline dropped to 847.2 KB.
- **One module per page.** Copy lives in `src/data/copy/pages/*` (and `copy/industries/*`). A route loader narrows it to one language (`src/data/copy/index.ts`), so it ships in the HTML of the page that shows it and in no other route's JavaScript.
- **No typed figures.** Prices, ranges, IP67 lists, DMR lists, battery capacities and run times are `{{placeholders}}` filled from `products.ts` and `specs.ts` (`copy/facts.ts`).
- **`SeoText`** renders 2–4 h2 sections with `[anchor](/path)` links. **`FaqBlock`** renders the FAQ and its FAQPage from the same array.
- **Gates.** `verify-content.ts` holds every copy module to the rules `verify-i18n` holds the JSON to, and adds: every link resolves to a sitemap page, every placeholder is supplied, Uzbek uses ASCII apostrophes and never glues a case suffix to a model list, and the home description's price is still the cheapest.

## Ad landing pages

There is no `seo-input/ads/` export, so these are assumed:

- `/ru`, `/uz` (home)
- `/{lang}/radiocom`, `/{lang}/motorola`
- `/{lang}/poc`, `/{lang}/service`
- `/{lang}/industries/{horeca,construction,security,mining,transport,manufacturing}`
- product pages `/{lang}/{brand}/{model}` for model queries («motorola t82 extreme цена»)

Ads must point at these final URLs (`https://radiocom.uz/ru/…`), never at the
bare domain: each redirect hop costs time on a phone.

## Audit — verified against the code

| #   | Finding                                         | Evidence                                                                                                                                                                                                                                                                                                              | Verdict                                                                           |
| --- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| 1   | WordPress URLs land on the home page            | `src/routes/index.tsx:16-21` sends every `/?…` to `/ru`. Path URLs (`/wp-content/…`, `/feed/`) 404 in `src/routes/$lang.tsx:16`                                                                                                                                                                                       | Confirmed                                                                         |
| 2   | Redirects drop query parameters                 | All 9 legacy routes throw `redirect()` without `search`; router-core 1.171.13 `buildLocation` returns `{}` (`router.js:1140`). Reproduced: `/?gclid=x&utm_source=y` → `Location: /ru`                                                                                                                                 | Confirmed                                                                         |
| 2a  | **New:** keeping `search` would corrupt `yclid` | The default `parseSearch` JSON-parses each value, so `yclid=5034856438827851775` becomes the Number `5034856438827852000`, and a redirect rebuilt from parsed search ships the wrong click ID. The router's own canonical redirect (trailing slash, `router.js:503-519`) is a 307 with the same re-stringified search | Confirmed, fixed in Phase 1                                                       |
| 3   | No analytics                                    | No GTM, gtag, `ym` or `dataLayer` anywhere in `src/`                                                                                                                                                                                                                                                                  | Confirmed                                                                         |
| 4   | Lead forms lose leads and their source          | `LeadFormSheet.tsx:42-57` and `ContactBlock.tsx:19-34` show success without checking `res.ok`. Every `openLead()` caller passes `title`; the payload sends only `product`. `send-lead.mts` prints only `Source: lead-sheet`                                                                                           | Confirmed                                                                         |
| 5   | Contact paths                                   | `Nav.tsx` has no `tel:` link. `StickyBottomCta.tsx` shows only on home, brand pages and compare, and its server HTML is `opacity:0`                                                                                                                                                                                   | Confirmed                                                                         |
| 6   | Counters render 0                               | `CountUp.tsx` starts from `useMotionValue(0)`; server HTML says «0+ моделей раций», «0 лет на рынке». Also, in English, the industry outcome parser counts "7,400" only up to 7 and shows "0.5 W" as "1 W" (`IndustryDetail.tsx:383-405`)                                                                             | Confirmed, plus the English bug                                                   |
| 7   | Content                                         | Titles/descriptions are keyword-led; the home H1 is the slogan «Рации, которые слышит вся смена.»; no FAQ on home, brand pages or PoC; 3 FAQs per industry; no all-models page (`/ru/catalog` 301s to Radiocom)                                                                                                       | Confirmed — Phases 3–5                                                            |
| 8   | Fact conflicts                                  | Phones in `ContactBlock`, `Footer`, `Service`, `seo.ts`, `generate-seo.ts`; Telegram `uz_Radiocom` (`Socials.tsx`) vs `radiocom_uz` (`seo.ts`); «21 модель» (meta) vs «35+» (home)                                                                                                                                    | Confirmed; owner answered                                                         |
| 9   | First screen invisible before JS                | Framer `initial={{ opacity: 0 }}` on the hero eyebrow, H1, subhead and CTAs of Home, Brand, Poc, Service, IndustryDetail, IndustriesIndex — and also ProductSpecs (the whole buy box), Answers, AnswerDetail, the Poc LCP image and the sticky CTA. Every page wrapper also fades in from opacity 0 (`page-anim`)     | Confirmed, wider than reported                                                    |
| 10  | Every HTML page rendered per request            | No cache headers anywhere                                                                                                                                                                                                                                                                                             | Confirmed                                                                         |
| 11  | Redirect hops                                   | `/` → `/ru` runs inside the SSR function                                                                                                                                                                                                                                                                              | Confirmed — ads use final URLs                                                    |
| 12  | Content images with `alt=""`                    | Industry photos, home "Что вы получаете" tiles, service bench photos and others; the marquee duplicate, hover duplicates and model chips are rightly decorative                                                                                                                                                       | Confirmed                                                                         |
| 13  | JavaScript errors on load                       | `qa-console` on 11 landing pages, at 1280px and at 390px with a mobile user agent, against a local build: 0 errors, 0 failed requests                                                                                                                                                                                 | **Not reproduced locally.** Recheck on the deployed site with `smoke-deployed.ts` |

### Checker warnings that are staging artifacts

Not "fixed", because the fix would break production: canonical/hreflang pointing
at radiocom.uz, subdomain hosting, www/non-www, backlinks, "content last updated
2024", "radiocom.uz returns 404", Instagram's 429, nofollow on own profiles, the
search icon's anchor text (it has an `aria-label`), SPF/DMARC on netlify.app DNS.

## Decisions worth knowing

- **Marketing parameters are preserved by the server, byte for byte.** A request
  middleware (`src/start.ts`) re-appends the raw `utm_*`, `gclid`, `gbraid`,
  `wbraid`, `yclid`, `fbclid` and `ysclid` segments to every redirect, because
  the router's parsed search corrupts long numeric IDs (finding 2a). The router
  redirect routes are untouched.
- **WordPress URLs are mapped in that middleware, not in the `/` route's
  `beforeLoad`.** The brief asked for `beforeLoad`, for preset independence. The
  middleware is just as preset-independent, and it is the only place that sees
  the raw URL: the router only sees the re-stringified search. `beforeLoad`
  keeps a fallback that 404s any WordPress key that reaches it.
- **The CDN caches only clean requests.** HTML is cached when the request has
  no query string at all; a visit with `?gclid=` is served from that entry but
  never creates one. `Netlify-Vary: query=q,header=Accept` keeps search results
  and the Markdown variant apart.

## Lighthouse — mobile, before and after

**Method.** Local `node-server` builds of `main` (before) and this branch
(after), each behind a small gzip proxy — Netlify compresses responses and the
bare node server does not, and without compression Lighthouse mostly measures
transfer of uncompressed JavaScript. Lighthouse 12.8.2, mobile form factor,
Playwright's Chromium. TTFB is ~20 ms locally, so these numbers say nothing
about server time; the CDN cache and the Functions region are what fix that
in production (findings 10 and 11).

**Applied throttling** (`--throttling-method=devtools`: the network and CPU
really are slowed, so a heading waiting on hydration really waits). This is
the closest to what a phone sees, and the column the targets apply to.

| Page                  | Score before | LCP before | CLS before | Score after | LCP after | CLS after |
| --------------------- | ------------ | ---------- | ---------- | ----------- | --------- | --------- |
| /ru                   | 0.90         | 2.5 s      | 0          | 0.93        | 2.7 s     | 0.001     |
| /ru/radiocom          | 0.71         | 6.5 s      | 0.032      | 0.95        | 2.0 s     | 0.031     |
| /ru/poc               | 0.78         | 5.2 s      | 0          | 0.96        | 2.4 s     | 0         |
| /ru/industries/horeca | 0.80         | 4.0 s      | 0          | 0.81        | 4.2 s     | 0         |

FCP is 1.9–2.1 s on all four, before and after.

**Simulated throttling** (Lighthouse's default, which models the network from
an unthrottled trace), on every landing page:

| Page                        | Score before | FCP before | LCP before | Score after | FCP after | LCP after |
| --------------------------- | ------------ | ---------- | ---------- | ----------- | --------- | --------- |
| /ru                         | 0.74         | 3.1 s      | 4.7 s      | 0.80        | 2.9 s     | 4.3 s     |
| /uz                         | 0.78         | 2.9 s      | 4.7 s      | 0.80        | 2.9 s     | 4.2 s     |
| /ru/radiocom                | 0.80         | 2.6 s      | 4.6 s      | 0.89        | 2.6 s     | 3.3 s     |
| /ru/motorola                | 0.79         | 2.6 s      | 4.7 s      | 0.86        | 2.6 s     | 3.6 s     |
| /ru/poc                     | 0.85         | 2.8 s      | 3.7 s      | 0.86        | 2.8 s     | 3.6 s     |
| /ru/service                 | 0.78         | 2.8 s      | 4.8 s      | 0.82        | 2.8 s     | 4.1 s     |
| /ru/industries/horeca       | 0.80         | 2.9 s      | 4.4 s      | 0.81        | 3.1 s     | 4.1 s     |
| /ru/industries/construction | 0.81         | 2.9 s      | 4.2 s      | 0.81        | 3.0 s     | 4.1 s     |
| /ru/radiocom/rcd-70         | 0.89         | 2.6 s      | 3.3 s      | 0.89        | 2.6 s     | 3.2 s     |

CLS is unchanged on every page in this table (0, or 0.031–0.036 on the brand
pages).

**What moved, and why.**

- The big wins are the pages whose LCP element was itself held at
  `opacity: 0` until hydration: the brand pages' heading (6.5 s → 2.0 s) and
  the PoC device photo (5.2 s → 2.4 s).
- The home page's LCP is its hero photograph, which was never hidden, so it
  barely moves. Painting the text immediately exposed a font swap the
  invisible hero used to hide: CLS rose to 0.141 when Inter replaced the
  fallback and reflowed the heading. Metric-matched fallback faces
  (`styles.css`, "Inter Fallback") brought it back to 0.001.
- **Still over the 2.5 s target:** home at 2.7 s and the industry pages at
  4.1–4.2 s. On the HoReCa page the 87 KB hero photograph starts at 0.6 s
  together with ~250 KB (gzipped) of JavaScript and both fonts, and shares the
  throttled bandwidth with them until 4.1 s. That is the open "no code
  splitting" item in `AGENTS.md` — Framer Motion, GSAP and the router land in
  every route's eager chunks — and it is the next performance job. It is not
  in this PR.

Without compression (the bare local server) every page scored 0.59–0.61 with
LCP 6.9–8.9 s, before and after alike; transfer of uncompressed JavaScript
swamps everything else in that setup.

GTM's own cost is not in these numbers (no container ID here, and
googletagmanager.com is unreachable). Measure it on a deploy preview once
`VITE_GTM_ID` is set; the target is no LCP regression.

## What still waits on data

- **Keyword volumes.** Run the primary keywords through Wordstat (Uzbekistan) and Keyword Planner, and adjust headings where the volume says so.
- **`legacy/sitemap.xml`**, the 251 old URLs: `bun scripts/import-legacy-urls.ts` merges them into the redirect fixture.
- **Ahrefs Top pages / GSC:** which "no equivalent" URLs should get a parent redirect instead of a 410.
- **The owner questions** in `OWNER-QUESTIONS.md`: repair and rental prices, the accessories range, the unsourced industry testimonials and figures, and the industry photography.

## (Original) What waited on the exports


Put these in `seo-input/` (git-ignored) and say so:

- `legacy/sitemap.xml` — the 251 old URLs. `bun scripts/import-legacy-urls.ts`
  merges them into the redirect fixture and lists any that do not map.
- `ahrefs/` — Top pages decides which "no equivalent" URLs earn a parent
  redirect instead of a 410; Organic keywords and Content gap feed Phase 3.
- `wordstat/`, `gkp/`, `gsc/`, `ads/` — the keyword map, and the real list of ad
  landing pages.
