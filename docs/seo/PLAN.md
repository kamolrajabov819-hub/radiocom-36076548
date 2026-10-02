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

| Phase | What                                                                                       | State                               |
| ----- | ------------------------------------------------------------------------------------------ | ----------------------------------- |
| 0     | This plan, owner questions                                                                 | done                                |
| 1     | Ads readiness: tracking, forms, parameters, contact paths, counters, first screen, caching | PR (a)                              |
| 2     | WordPress → new site redirects                                                             | PR (b), stacked on (a)              |
| 3     | Keyword map                                                                                | **waiting on `seo-input/` exports** |
| 4     | Landing-page copy                                                                          | after the Phase 3 checkpoint        |
| 5     | New pages (catalogue hub, About, maybe rental)                                             | proposed after Phase 3              |
| 6     | Verify and hand off                                                                        | —                                   |

`seo-input/` was empty at the start of this session, and outbound access to
radiocom.uz is blocked from the build environment. Phases 0–2 need neither.

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

Local `node-server` build, Lighthouse 12.8.2, simulated mobile throttling,
`/opt/pw-browsers` Chromium. The local server sends no compression, so absolute
numbers are worse than on Netlify (SEOptimer measured FCP 3.5 s / LCP 5.8 s on
the staging host); the comparison between columns is what matters.

| Page                        | Score before | FCP before | LCP before | CLS before | Score after | FCP after | LCP after | CLS after |
| --------------------------- | ------------ | ---------- | ---------- | ---------- | ----------- | --------- | --------- | --------- |
| /ru                         | 0.60         | 6.5 s      | 8.3 s      | 0          |             |           |           |           |
| /uz                         | 0.60         | 6.5 s      | 8.3 s      | 0          |             |           |           |           |
| /ru/radiocom                | 0.60         | 6.1 s      | 8.6 s      | 0.031      |             |           |           |           |
| /ru/motorola                | 0.60         | 6.0 s      | 8.9 s      | 0.036      |             |           |           |           |
| /ru/poc                     | 0.60         | 6.4 s      | 7.6 s      | 0          |             |           |           |           |
| /ru/service                 | 0.60         | 6.3 s      | 8.3 s      | 0          |             |           |           |           |
| /ru/industries/horeca       | 0.59         | 6.7 s      | 8.2 s      | 0          |             |           |           |           |
| /ru/industries/construction | 0.59         | 6.7 s      | 8.2 s      | 0          |             |           |           |           |
| /ru/radiocom/rcd-70         | 0.61         | 6.2 s      | 6.9 s      | 0          |             |           |           |           |

GTM's cost cannot be measured here (no container ID, and googletagmanager.com
is unreachable). Measure it on a deploy preview once `VITE_GTM_ID` is set; the
target is no regression in LCP.

## What waits on the exports

Put these in `seo-input/` (git-ignored) and say so:

- `legacy/sitemap.xml` — the 251 old URLs. `bun scripts/import-legacy-urls.ts`
  merges them into the redirect fixture and lists any that do not map.
- `ahrefs/` — Top pages decides which "no equivalent" URLs earn a parent
  redirect instead of a 410; Organic keywords and Content gap feed Phase 3.
- `wordstat/`, `gkp/`, `gsc/`, `ads/` — the keyword map, and the real list of ad
  landing pages.
