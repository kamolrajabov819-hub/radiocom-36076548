# SEO: the part that is not in this repository

Everything inside this codebase is done. The technical layer is gated by
`bun run verify` — 28 checks covering schema, hreflang, sitemap, snippet
lengths, agent discovery and now the answers section — and the content layer
now has pages that answer questions rather than only sell products.

What is left decides rankings more than any of it, and none of it can be done
from a git repository. This file is that list, in the order worth doing it.

**A note on expectations, once.** No amount of this guarantees a first
position. Rankings depend on competitors, on how long the domain has been
trusted, and on links other people choose to give you. What follows is the work
that reliably moves the needle; treat anyone who promises a position as selling
something.

---

## 1. Claim the properties — do this first, this week

Nothing else can be measured until these exist. Right now nobody can see which
queries the site appears for.

| What | Where | Then |
|---|---|---|
| **Google Search Console** | search.google.com/search-console | Add property `radiocom.uz`, verify, submit `https://radiocom.uz/sitemap.xml` |
| **Yandex.Webmaster** | webmaster.yandex.com | Same. Yandex holds real share in Uzbekistan and indexes independently of Google |
| **Bing Webmaster** | bing.com/webmasters | Cheap to add; also feeds ChatGPT's search results |

Both Google and Yandex verify by meta tag, and the repo is already wired for
it. Set these in Netlify → Site settings → Environment variables and redeploy;
the tags appear on every page automatically. Do not commit the values.

```
GOOGLE_SITE_VERIFICATION=<the token Google gives you>
YANDEX_VERIFICATION=<the token Yandex gives you>
```

`src/lib/seo.ts` → `verificationMeta()` emits them only when set, so an unset
variable is simply no tag rather than a broken one.

## 2. Google Business Profile and Yandex Business

For a Tashkent business with a walk-in office, the map pack outranks the
website for a lot of local searches. This is the highest-value item after §1.

- Claim **Google Business Profile** for Uzbekiston Ovozi 2, and **Yandex
  Business** for the same address.
- The name, address and phone must match `src/lib/seo.ts` → `BUSINESS`
  **character for character**. Both engines cross-check, and a mismatched suite
  number or a differently formatted phone weakens the match:
  - Radiocom · ул. Узбекистон Овози, 2 (Гостиница Тата, 1 этаж), Ташкент
  - +998 78 113-16-18
  - Mon–Fri 09:00–18:00
- Add the real photographs — the office, the service bench, the shelf of
  stock. Profiles with photos convert far better than profiles without.

**Then send me the profile URLs.** `BUSINESS.sameAs` currently lists only
Telegram and Instagram. A Google Business Profile and a Yandex Business link
belong in it, and that is a two-line change once the URLs exist. I did not
guess at them.

## 3. Reviews

The single strongest local signal you are not currently sending. You have
10 000+ clients and, as far as this repo knows, no review programme.

- Ask after a delivery or a completed repair, when the customer is happiest.
- Send the direct review link — not "find us on Google".
- Answer every review, including the bad ones. A calm reply to a complaint
  reads better to the next customer than an unbroken wall of fives.
- Aim for a steady trickle rather than thirty in one week; a burst looks bought
  to both engines.

## 4. Links

Nothing here is buyable without risk. These are the ones that are both real and
achievable for a distributor in Tashkent:

- **Manufacturer dealer listings.** Motorola's partner locator and any Radiocom
  distributor page. These are the most relevant links you can get, and you have
  a legitimate claim to both as an authorised dealer.
- **Your own clients.** Uz-Kor Gas Chemical, ERIELL, ENTER Engineering,
  HYUNDAI Engineering and SAMSUNG Engineering are already named on the mining
  page. A supplier credit or a case study on their site is worth more than a
  hundred directory entries.
- **Uzbek business directories** — the established ones only. A link from a
  directory nobody uses is worth nothing and a link farm is worth less than
  nothing.
- **Trade press and industry associations** — construction, mining and HoReCa
  publications in Uzbekistan.

## 5. Once Search Console has data — about a month out

Come back to me with the export and I can act on it. Specifically:

- **Queries ranking 5–15.** These are the cheap wins: the page already ranks,
  and usually a title and an added section move it up. This is where the next
  round of work should go.
- **Queries with impressions but no clicks.** The page ranks and the snippet is
  not being clicked — a title and description problem, which is quick to fix.
- **Queries with no page.** Each one is a candidate for another answers page.
  The existing seven were chosen from the catalogue, not from data, because
  this environment has no network access and I could not measure. Your Search
  Console can.
- **Coverage errors.** Anything Google could not index.

## 6. Blocked in the repo, waiting on you

Two things are written and deliberately not shipped:

- **`/answers/radio-licence-uzbekistan`** — "Do you need a licence for a radio
  in Uzbekistan" is the highest-value question in the section, and the page is
  written and held as a draft. What it needs is the actual Госкомсвязи РУз
  rule: whether 446 MHz is licence-exempt, whether there is a power limit, and
  what the four models with no published frequency (RCD-70, RCD-60, RCD-50,
  Motorola T72) require. Confirm those and the page publishes with a one-line
  change. `verify-answers` fails the build if the draft flag is removed while
  `TODO-LEGAL` markers remain.
- **CLP 446 / CLK 446** are `hidden: true` in `products.ts` — you sell them, so
  the HoReCa page naming them is true, but they have no photograph and are
  absent from the price list, so a visitor cannot click through to buy. A photo
  and a price fixes it.

## 7. Run this against production

```
bun scripts/smoke-deployed.ts https://radiocom.uz
```

The build environment blocks all outbound network access, so this is the one
check that has never run against the live site.
