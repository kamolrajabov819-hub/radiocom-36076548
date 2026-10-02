# WordPress → new site: where every old URL goes

radiocom.uz still serves the old WordPress site. When DNS moves to this build,
every old URL that search engines or links still request must answer in **one
hop**: a 301 straight to its replacement, or a **410** when nothing replaces it.
Never a redirect to the home page — search engines treat a mass redirect home
as a soft 404 and drop the ranking the URL carried.

How it works:

- `src/lib/legacy-redirects.ts` is the map (a pure function of the URL).
- `src/start.ts` applies it to the **raw** request URL, before the router runs,
  and appends the visit's ad parameters (`utm_*`, `gclid`, `gbraid`, `wbraid`,
  `yclid`, `fbclid`, `ysclid`) byte for byte. WordPress's own parameters are
  never carried over.
- `src/routes/index.tsx` 404s any WordPress parameter that reaches the router,
  and the middleware turns that 404 into a 410 (with the site's 404 page as
  the body).
- `scripts/fixtures/legacy-urls.txt` is the list of URLs; the table below is
  generated from it. `bun run verify` (and therefore every build) fails if any
  of them stops resolving to a live page in one hop, and `node
scripts/qa-redirects.mjs` checks the same over HTTP.

## Rules

| Old                                                                                                                      | New                           | Why                                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `?lang=ru` / `oz` / `en`, with or without `paged`, and the malformed `lang=rupage/2`                                     | `/ru` · `/uz` · `/en`         | The language home page. `oz` was the old site's Uzbek. A missing `lang` is Russian.                                                                                       |
| `?page_id=` 1249 · 1270 · 628 (О компании)                                                                               | `/ru` · `/en` · `/uz`         | There is no About page yet. If Phase 5 builds one, retarget these three.                                                                                                  |
| `?page_id=` 94 · 1292 · 635 (PoC)                                                                                        | `/X/poc`                      | Same page.                                                                                                                                                                |
| `?page_id=` 1639 · 1644 · 1642 (Сервис центр) and `?post_type=services`                                                  | `/X/service`                  | Same page.                                                                                                                                                                |
| `?products_category=motorola` · `rc`                                                                                     | `/X/motorola` · `/X/radiocom` | Brand pages.                                                                                                                                                              |
| `?products_category=poc` · `hytera`                                                                                      | `/X/poc`                      | PoC page.                                                                                                                                                                 |
| `?products_category=pmr` · `amateur_stations` · `ҳаваскор-радиостанциялар` · `decross-ru`                                | `/X/compare`                  | The licence-free range spans both brands; compare is the one page listing all of it. **Retarget to the catalogue hub if Phase 5 builds it.**                              |
| `?products_category=prof` · `professional_set` · `профессионалрадиостанциялар`                                           | `/X/radiocom`                 | The professional range is the Radiocom RCD DMR line.                                                                                                                      |
| `?products_category=` accessories, baby/video monitors, `kpk`                                                            | **410**                       | No page on the site for these.                                                                                                                                            |
| `?products=` a Radiocom model (`rc-5d`, `radiocom-rcd-30` … `rcd-70-pro`, `rc-50`, `rc-21`, `rс-10` with a Cyrillic «с») | that model's page             | RC-5D → RCD-40 PRO, RC-21 → RC-20. Digits are never stripped from these: they are model names.                                                                            |
| `?products=` a Motorola model                                                                                            | that model's page             | WordPress's `-2` … `-8` de-dup suffix is stripped first. T62 without a colour → the blue T62 (**check against the real sitemap**); T42 without a colour → the brand page. |
| `?products=` T82 Extreme RSM, CLP 446, CLK 446, XT 665D, DP/DM/SLR, repeaters                                            | `/X/motorola`                 | Hidden or not listed; the brand page is the nearest.                                                                                                                      |
| `?products=` Hytera                                                                                                      | `/X/poc`                      |                                                                                                                                                                           |
| `?products=` an unknown Motorola or Radiocom model                                                                       | that brand's page             |                                                                                                                                                                           |
| `?products=` baby/video monitors, accessories (headsets, clips, batteries, chargers)                                     | **410**                       | Not sold here. Checked before model names, so "headset-for-t82" is gone, not the T82.                                                                                     |
| `?s=…`                                                                                                                   | `/X/search?q=…`               | Site search.                                                                                                                                                              |
| `?p=`, `?cat=`, `?tag=`, `?attachment_id=`, `?author=`, feeds                                                            | **410**                       | The new site has no blog.                                                                                                                                                 |
| `/wp-sitemap*.xml`, `/sitemap_index.xml`, `/*-sitemap.xml`                                                               | `/sitemap.xml`                |                                                                                                                                                                           |
| `/wp-content/*`, `/wp-includes/*`, `/wp-admin/*`, `/wp-json/*`, `/wp-login.php`, `/xmlrpc.php`, `/feed/`                 | **410**                       |                                                                                                                                                                           |
| Any other parameter on `/` (`utm_*`, `gclid`, `ysclid`, anything unknown)                                                | `/ru`                         | Not a WordPress URL. Never a 404.                                                                                                                                         |

`X` is the URL's language: `lang=ru` → `ru`, `oz` → `uz`, `en` → `en`, none → `ru`.

## Waiting on data

- **The 251-URL legacy sitemap** (`seo-input/legacy/sitemap.xml`): run
  `bun scripts/import-legacy-urls.ts seo-input/legacy/sitemap.xml`. It adds every
  URL not yet in the fixture with its current mapping and lists the ones that
  answer 410, for review. The slugs above come from the brief, not from the
  sitemap itself.
- **Ahrefs Top pages / Search Console**: any URL answering 410 here that still
  gets traffic should go to its nearest parent category instead (the brief's
  rule). Pass the CSV as the second argument to the import script and it flags
  them.

## Every URL in the fixture

Generated: `bun scripts/verify-legacy-redirects.ts --md`. Each one is also
checked with `gclid`, a 19-digit `yclid` and a Cyrillic `utm_term` appended.

| Old URL                                                   | Goes to                                       |
| --------------------------------------------------------- | --------------------------------------------- |
| `/?lang=ru`                                               | `/ru`                                         |
| `/?lang=oz`                                               | `/uz`                                         |
| `/?lang=en`                                               | `/en`                                         |
| `/?lang=ru&paged=2`                                       | `/ru`                                         |
| `/?lang=oz&paged=4`                                       | `/uz`                                         |
| `/?lang=rupage/2`                                         | `/ru`                                         |
| `/?paged=3`                                               | `/ru`                                         |
| `/?page_id=1249`                                          | `/ru`                                         |
| `/?page_id=1270`                                          | `/en`                                         |
| `/?page_id=628`                                           | `/uz`                                         |
| `/?page_id=1249&lang=ru`                                  | `/ru`                                         |
| `/?page_id=94&lang=ru`                                    | `/ru/poc`                                     |
| `/?page_id=1292&lang=en`                                  | `/en/poc`                                     |
| `/?page_id=635&lang=oz`                                   | `/uz/poc`                                     |
| `/?page_id=1639&lang=ru`                                  | `/ru/service`                                 |
| `/?page_id=1644&lang=en`                                  | `/en/service`                                 |
| `/?page_id=1642&lang=oz`                                  | `/uz/service`                                 |
| `/?page_id=99999`                                         | **410 gone**                                  |
| `/?post_type=services`                                    | `/ru/service`                                 |
| `/?post_type=services&lang=oz`                            | `/uz/service`                                 |
| `/?post_type=services&lang=en`                            | `/en/service`                                 |
| `/?post_type=product`                                     | **410 gone**                                  |
| `/?products_category=motorola&lang=ru`                    | `/ru/motorola`                                |
| `/?products_category=motorola&lang=oz`                    | `/uz/motorola`                                |
| `/?products_category=motorola&lang=en`                    | `/en/motorola`                                |
| `/?products_category=rc&lang=ru`                          | `/ru/radiocom`                                |
| `/?products_category=rc&lang=en`                          | `/en/radiocom`                                |
| `/?products_category=poc&lang=ru`                         | `/ru/poc`                                     |
| `/?products_category=hytera&lang=ru`                      | `/ru/poc`                                     |
| `/?products_category=pmr&lang=ru`                         | `/ru/compare`                                 |
| `/?products_category=pmr&lang=oz`                         | `/uz/compare`                                 |
| `/?products_category=amateur_stations&lang=en`            | `/en/compare`                                 |
| `/?products_category=ҳаваскор-радиостанциялар&lang=oz`    | `/uz/compare`                                 |
| `/?products_category=decross-ru&lang=ru`                  | `/ru/compare`                                 |
| `/?products_category=prof&lang=ru`                        | `/ru/radiocom`                                |
| `/?products_category=professional_set&lang=en`            | `/en/radiocom`                                |
| `/?products_category=профессионалрадиостанциялар&lang=oz` | `/uz/radiocom`                                |
| `/?products_category=access&lang=ru`                      | **410 gone**                                  |
| `/?products_category=accessories&lang=en`                 | **410 gone**                                  |
| `/?products_category=aксессуарлар&lang=oz`                | **410 gone**                                  |
| `/?products_category=radio-videonyani&lang=ru`            | **410 gone**                                  |
| `/?products_category=radio_video_baby&lang=en`            | **410 gone**                                  |
| `/?products_category=радио-видео-енага&lang=oz`           | **410 gone**                                  |
| `/?products_category=kpk&lang=ru`                         | **410 gone**                                  |
| `/?products_category=something-new`                       | **410 gone**                                  |
| `/?products=rc-5d&lang=ru`                                | `/ru/radiocom/rcd-40`                         |
| `/?products=radiocom-rcd-30&lang=ru`                      | `/ru/radiocom/rcd-30`                         |
| `/?products=radiocom-rcd-50-pro&lang=ru`                  | `/ru/radiocom/rcd-50`                         |
| `/?products=radiocom-rcd-60-pro&lang=oz`                  | `/uz/radiocom/rcd-60`                         |
| `/?products=radiocom-rcd-70-pro&lang=en`                  | `/en/radiocom/rcd-70`                         |
| `/?products=rc-50&lang=ru`                                | `/ru/radiocom/rc-50`                          |
| `/?products=rc-21&lang=ru`                                | `/ru/radiocom/rc-20`                          |
| `/?products=rс-10&lang=ru`                                | `/ru/radiocom/rc-10`                          |
| `/?products=rc-10&lang=oz`                                | `/uz/radiocom/rc-10`                          |
| `/?products=motorola-talkabout-t42-triple&lang=ru`        | `/ru/motorola/t42-triple`                     |
| `/?products=motorola-talkabout-t42-quad&lang=ru`          | `/ru/motorola/t42-quad`                       |
| `/?products=motorola-talkabout-t42-quad-2&lang=oz`        | `/uz/motorola/t42-quad`                       |
| `/?products=motorola-talkabout-t42&lang=ru`               | `/ru/motorola`                                |
| `/?products=motorola-talkabout-t62-красная&lang=ru`       | `/ru/motorola/t62-red`                        |
| `/?products=motorola-talkabout-t62-қизил&lang=oz`         | `/uz/motorola/t62-red`                        |
| `/?products=motorola-talkabout-t62-red&lang=en`           | `/en/motorola/t62-red`                        |
| `/?products=motorola-talkabout-t62&lang=ru`               | `/ru/motorola/t62-blue`                       |
| `/?products=motorola-talkabout-t72&lang=ru`               | `/ru/motorola/t72`                            |
| `/?products=motorola-talkabout-t82&lang=ru`               | `/ru/motorola/t82`                            |
| `/?products=motorola-talkabout-t82-2&lang=oz`             | `/uz/motorola/t82`                            |
| `/?products=motorola-talkabout-t82-extreme&lang=ru`       | `/ru/motorola/t82-extreme`                    |
| `/?products=motorola-talkabout-t82-extreme-3&lang=ru`     | `/ru/motorola/t82-extreme`                    |
| `/?products=motorola-talkabout-t82-extreme-quad&lang=en`  | `/en/motorola/t82-extreme-quad`               |
| `/?products=motorola-xt185&lang=ru`                       | `/ru/motorola/xt185`                          |
| `/?products=motorola-tlkr-t92h2o&lang=ru`                 | `/ru/motorola/tlkr-t92h2o`                    |
| `/?products=motorola-xt-420&lang=ru`                      | `/ru/motorola/xt420`                          |
| `/?products=motorola-talkabout-t82-extreme-rsm&lang=ru`   | `/ru/motorola`                                |
| `/?products=motorola-clp-446&lang=ru`                     | `/ru/motorola`                                |
| `/?products=motorola-clk-446&lang=en`                     | `/en/motorola`                                |
| `/?products=motorola-xt-665d&lang=ru`                     | `/ru/motorola`                                |
| `/?products=motorola-dp4400e&lang=ru`                     | `/ru/motorola`                                |
| `/?products=motorola-dm4600e&lang=ru`                     | `/ru/motorola`                                |
| `/?products=motorola-slr5500&lang=ru`                     | `/ru/motorola`                                |
| `/?products=ретранслятор-motorola-slr5500&lang=ru`        | `/ru/motorola`                                |
| `/?products=motorola-talkabout-t600&lang=ru`              | `/ru/motorola`                                |
| `/?products=hytera-pnc370&lang=ru`                        | `/ru/poc`                                     |
| `/?products=motorola-am21&lang=ru`                        | **410 gone**                                  |
| `/?products=motorola-am24`                                | **410 gone**                                  |
| `/?products=motorola-mbp481&lang=ru`                      | **410 gone**                                  |
| `/?products=motorola-mbp36xl&lang=en`                     | **410 gone**                                  |
| `/?products=motorola-vm34`                                | **410 gone**                                  |
| `/?products=motorola-vm65-connect`                        | **410 gone**                                  |
| `/?products=motorola-peekabo`                             | **410 gone**                                  |
| `/?products=headset-motorola-t82`                         | **410 gone**                                  |
| `/?products=гарнитура-для-рации&lang=ru`                  | **410 gone**                                  |
| `/?products=clip-for-radio`                               | **410 gone**                                  |
| `/?products=аккумулятор-для-рации&lang=oz`                | **410 gone**                                  |
| `/?products=battery-rc-50`                                | **410 gone**                                  |
| `/?products=unknown-gadget`                               | **410 gone**                                  |
| `/?s=motorola&lang=ru`                                    | `/ru/search?q=motorola`                       |
| `/?s=рация`                                               | `/ru/search?q=%D1%80%D0%B0%D1%86%D0%B8%D1%8F` |
| `/?p=123`                                                 | **410 gone**                                  |
| `/?cat=5`                                                 | **410 gone**                                  |
| `/?attachment_id=77`                                      | **410 gone**                                  |
| `/?utm_source=google&utm_medium=cpc`                      | `/ru`                                         |
| `/?gclid=abc`                                             | `/ru`                                         |
| `/?ysclid=lt8xyz`                                         | `/ru`                                         |
| `/?fbclid=IwAR123`                                        | `/ru`                                         |
| `/?foo=bar`                                               | `/ru`                                         |
| `/index.php`                                              | `/ru`                                         |
| `/index.php?lang=en`                                      | `/en`                                         |
| `/wp-sitemap.xml`                                         | `/sitemap.xml`                                |
| `/wp-sitemap-posts-page-1.xml`                            | `/sitemap.xml`                                |
| `/sitemap_index.xml`                                      | `/sitemap.xml`                                |
| `/post-sitemap.xml`                                       | `/sitemap.xml`                                |
| `/products-sitemap.xml`                                   | `/sitemap.xml`                                |
| `/wp-content/uploads/2023/05/price.pdf`                   | **410 gone**                                  |
| `/wp-admin/`                                              | **410 gone**                                  |
| `/wp-login.php`                                           | **410 gone**                                  |
| `/wp-json/wp/v2/posts`                                    | **410 gone**                                  |
| `/category/news/`                                         | **410 gone**                                  |
| `/tag/motorola/`                                          | **410 gone**                                  |
| `/author/admin/`                                          | **410 gone**                                  |
| `/feed/`                                                  | **410 gone**                                  |
| `/xmlrpc.php`                                             | **410 gone**                                  |
