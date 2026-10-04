# Launch checklist — moving radiocom.uz from WordPress to this build

Do these in order. Steps 1–3 happen before anyone touches DNS; the old site
keeps serving until step 4.

## 1. Netlify: domain, HTTPS, environment, region

- **Custom domain.** Add `radiocom.uz` as the primary domain and
  `www.radiocom.uz` as an alias. With the apex primary, Netlify answers `www`
  with a 301 to `https://radiocom.uz`, which is what the canonicals already
  say. Do not make `www` primary.
- **HTTPS.** Let Netlify issue the certificate and confirm HTTPS is enforced.
  After launch, check that `https://radiocom.uz/ru` sends a
  `Strict-Transport-Security` header; without it every first visit from an
  `http://` link pays an extra redirect.
- **Environment variables** (Site configuration → Environment variables):
  - `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` — already used by the lead form.
  - `VITE_GTM_ID` — **production context only** (step 3).
  - `GOOGLE_SITE_VERIFICATION`, `YANDEX_VERIFICATION` — see `SEO-OFFSITE.md` §1.
- **Functions region.** Every page is rendered by a Netlify Function, and the
  default region is in the US — a long way from Tashkent for every uncached
  page. If the plan offers it, pick Frankfurt in the site's Functions settings.
  It is a dashboard setting; nothing in the repository controls it. The CDN
  cache (see `PLAN.md`, finding 10) means most page views never reach the
  function, but the ones that do should not cross an ocean.

## 2. Test every old URL on a deploy preview

On the preview of the merged branch:

```
node scripts/qa-redirects.mjs https://deploy-preview-<N>--radiocomuz.netlify.app
bun scripts/smoke-deployed.ts https://deploy-preview-<N>--radiocomuz.netlify.app
```

`qa-redirects` requests every URL in `scripts/fixtures/legacy-urls.txt` with ad
parameters appended and checks the status (301 or 410) and the exact
`Location`. Then, by hand:

- request a page twice with `curl -sI` and confirm the second answer comes
  from the CDN (`cache-status` mentions a hit);
- request it with `?gclid=test` and confirm it is still served, and that the
  response carries no `Netlify-CDN-Cache-Control`.

If the 251-URL legacy sitemap has arrived by then, import it first
(`bun scripts/import-legacy-urls.ts seo-input/legacy/sitemap.xml --write`),
review the new fixture lines, and rerun.

## 3. Turn on tracking

- Set `VITE_GTM_ID` (production only) and redeploy.
- Build the container as `TRACKING.md` describes, and check it in GTM Preview:
  a phone click fires `click_call`; a test lead fires `generate_lead` only after
  the Telegram message arrives; navigating between pages fires one
  `virtual_page_view` each.
- In GA4, turn off "page changes based on browser history events", or every
  page view counts twice.

## 4. Switch DNS

- A day before, lower the TTL on the records you will change.
- Point `radiocom.uz` and `www` at Netlify (Netlify DNS, or the A/ALIAS and
  CNAME records Netlify gives you).
- **Do not touch the mail records.** `sales@radiocom.uz` and
  `info@radiocom.uz` depend on the domain's MX, SPF, DKIM and DMARC records;
  copy every existing record across if you move the zone to Netlify DNS.
- Keep the WordPress host running, unlinked, for a week, in case you need to
  roll back.

## 5. Search Console and Yandex.Webmaster

- Submit `https://radiocom.uz/sitemap.xml` in both (the new site's — 195 URLs
  with hreflang).
- For two weeks, check daily:
  - Search Console → Pages → _Not found (404)_ and _Page with redirect_;
  - Yandex.Webmaster → Индексирование → «Исключённые страницы» and the 404
    report.
- Any old URL that shows up there unmapped: add it to `legacy-redirects.ts`
  and the fixture, and redeploy. A URL answering 410 that still gets clicks
  goes to its nearest category instead (see `legacy-redirects.md`).

## 6. Smoke test production

```
bun scripts/smoke-deployed.ts https://radiocom.uz
node scripts/qa-redirects.mjs https://radiocom.uz
```

## 7. Ads point at final URLs

- Change every ad's final URL in Google Ads and Yandex Direct to the new path,
  in full: `https://radiocom.uz/ru/…` (or `/uz/…`). Never the bare domain and
  never an old WordPress URL. The redirects keep the parameters, but each hop
  costs a phone time before the page starts loading.
- Keep auto-tagging on in Google Ads (gclid), and in Yandex Direct keep link
  tagging for Metrica on (yclid).
- Update the links in the Instagram and Telegram profiles the same way.
