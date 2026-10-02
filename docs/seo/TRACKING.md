# Tracking — what the site sends, and what to build in GTM

The site loads **Google Tag Manager and nothing else**. GA4, Yandex Metrica,
Google Ads conversions and the Meta Pixel are configured inside the GTM
container, so adding or changing a pixel is a container change, not a deploy.
The site's job is a clean `dataLayer`; this file is the contract for it. The
code side is `src/lib/analytics.ts`, `src/lib/attribution.ts` and
`src/lib/lead.ts`.

## 1. Turning it on

1. Netlify → Site configuration → Environment variables → add
   **`VITE_GTM_ID`** = `GTM-XXXXXXX`, scoped to the **Production** context only
   (a deploy preview that loads the live container sends test traffic into the
   real reports).
2. Trigger a production deploy. The ID is inlined at build time; changing it
   needs a redeploy.
3. No ID, or one that does not look like `GTM-` plus 4–12 letters and digits,
   means no tag at all. Nothing is hardcoded in the repository.

Which container to use is owner question 6 (`OWNER-QUESTIONS.md`): the old
WordPress site loads `GTM-N8XPP97H`.

## 2. Events

Every event is a `dataLayer.push({ event, ...params })`. No event ever carries
a name, a phone number or message text.

| Event               | When                                                                                                                        | Parameters                                                                            |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `lead_form_open`    | The request sheet opens (any «Оставить заявку», «Бесплатное тестирование», product «Купить» button)                         | `cta` — the button's label · `product` — set only from the agent tool · `page` — path |
| `generate_lead`     | **Only** after `/api/send-lead` answered 2xx                                                                                | `form` — `lead-sheet` or `contact-block` · `cta` · `product` · `page`                 |
| `lead_error`        | The lead did not go through (non-2xx, network error, 15 s timeout). The form stays filled and offers the phone and Telegram | same as `generate_lead`                                                               |
| `click_call`        | Any `tel:` link                                                                                                             | `number` (e.g. `+998933890710`) · `placement` · `page`                                |
| `click_telegram`    | Any `t.me/` link                                                                                                            | `placement` · `page`                                                                  |
| `click_email`       | Any `mailto:` link                                                                                                          | `placement` · `page`                                                                  |
| `file_download`     | The price-list PDF, or any `download` link                                                                                  | `file` · `placement` · `page`                                                         |
| `virtual_page_view` | Every client-side navigation **after** the first page                                                                       | `page_path` (no query string) · `page_title` · `lang` (`ru`/`uz`/`en`)                |

`placement` says where on the page the click was: `header`, `mobile-menu`,
`hero`, `sticky` (the phone's bottom bar), `contact` (the contact block above
the footer), `footer`, `form-error` (the fallback after a failed lead),
`lead-sheet`, `buy-box` (product page), or `page` when none of these applies.

A bot that fills the hidden honeypot field gets a 200 from the server, but the
client does not fire `generate_lead` for it.

## 3. GTM container — what to create

**Variables** (Data Layer Variable, version 2): `cta`, `product`, `page`,
`form`, `number`, `placement`, `file`, `page_path`, `page_title`, `lang`.

**Triggers** (Custom Event, event name equals):
`lead_form_open`, `generate_lead`, `lead_error`, `click_call`,
`click_telegram`, `click_email`, `file_download`, `virtual_page_view`.

### GA4

- Configuration tag (Google tag) on _Initialization — All Pages_.
- In the GA4 data stream → Enhanced measurement → Page views → **turn off
  "Page changes based on browser history events"**. The site sends
  `virtual_page_view` instead; with both on, every SPA navigation counts twice.
- Event tag on `virtual_page_view` → GA4 event `page_view` with `page_location`
  = `{{Page Hostname}}` + `{{page_path}}` and `page_title` = `{{page_title}}`.
- Event tags with the same names for the other seven events, passing their
  parameters.
- **Key events** (conversions) in GA4: `generate_lead` (primary),
  `click_call`, `click_telegram`.

### Yandex Metrica (via GTM — recommended)

- Custom HTML tag with the Metrica counter code on _All Pages_; turn on
  Webvisor and click map as wanted. Do not also add a counter directly to the
  site, or every visit counts twice (owner question 7).
- Custom HTML tag on `virtual_page_view`:
  `<script>ym(COUNTER_ID, 'hit', {{page_path}}, { title: {{page_title}} });</script>`
- Custom HTML tag per goal: `<script>ym(COUNTER_ID, 'reachGoal', '{{Event}}');</script>`
  on the triggers below, and in Metrica create **JavaScript event** goals with
  exactly these identifiers:

| Metrica goal ID  | Trigger          | Use                                               |
| ---------------- | ---------------- | ------------------------------------------------- |
| `generate_lead`  | `generate_lead`  | Primary goal; Direct's strategy optimises on this |
| `click_call`     | `click_call`     | Secondary                                         |
| `click_telegram` | `click_telegram` | Secondary                                         |
| `lead_form_open` | `lead_form_open` | Micro-conversion, for diagnosis                   |
| `file_download`  | `file_download`  | Micro-conversion                                  |

Metrica reads `yclid` and `ysclid` from the landing URL itself. The site keeps
both intact through every redirect, byte for byte (see `PLAN.md`, finding 2a).

### Google Ads

- Conversion Linker tag on _All Pages_ (it reads `gclid`/`gbraid`/`wbraid`).
- Conversion tag **"Лид — форма"** on `generate_lead` — primary, count: one.
- Conversion tag **"Звонок с сайта"** on `click_call` — secondary.

### Meta Pixel

- Base code on _All Pages_, `PageView` also on `virtual_page_view`.
- `fbq('track', 'Lead')` on `generate_lead`; `fbq('track', 'Contact')` on
  `click_call` and `click_telegram`.

## 4. Attribution on every lead

On the first document load of a visit, the site stores where the visitor came
from (`localStorage` key `rc_attr_v1`; in memory if storage is blocked):

- **first touch** — written once, never replaced;
- **last touch** — replaced only by a visit that carries a marketing parameter
  or arrives from another site, so a reload does not erase the source.

Each touch holds `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`,
`utm_content`, `gclid`, `gbraid`, `wbraid`, `yclid`, `fbclid` (whichever were
present), the landing page and the external referrer. Both touches go with
every lead to `/api/send-lead`, and the Telegram message prints them:

```
Last touch: utm_source=yandex, utm_medium=cpc, utm_campaign=…, yclid=…
  landing: /ru/industries/construction?utm_source=…
```

**Offline conversions.** Leads close by phone, often days later. The click ID
in the Telegram message is what lets a closed deal be uploaded back:
Google Ads → Conversions → Uploads (gclid + conversion time), Yandex →
Metrica offline conversions (yclid or ClientID). That turns "a form was sent"
into "a sale happened" as the thing the bidding optimises for.

## 5. Ad URLs

- Use final URLs: `https://radiocom.uz/ru/…`, never the bare domain. Each
  redirect hop costs a phone 0.3–1 s before the page starts.
- Parameters survive the redirects that do happen (`/` → `/ru`, old WordPress
  URLs), but a final URL avoids the hop entirely.
- Every page answers with a parameter-free canonical, so tagged URLs do not
  become duplicate pages. Yandex additionally gets a `Clean-param` line in
  `robots.txt` for the same keys.

## 6. Consent

The site sets no analytics cookie itself; GTM and the tags inside it do.
Whether a consent notice is needed under Uzbekistan's personal-data law is a
legal question (owner question 11). If one is required, it belongs in the GTM
container as Consent Mode defaults plus a banner, and the site needs no change
beyond loading it.

## 7. Checking it

- GTM → Preview, open the site, click a phone number: `click_call` appears with
  `placement`.
- In the browser console: `dataLayer` lists every event pushed so far.
- Send a test lead from the contact block: `generate_lead` appears only after
  the Telegram message is delivered.
