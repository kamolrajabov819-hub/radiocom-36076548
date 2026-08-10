# Image paths audit + "free testing" wording fix

## 1. Image paths (production build safety)

Audit result: no component uses a relative `./image.jpg` or `./public/...` reference. Images come from two sources today:
- ES imports from `src/assets` (e.g. `service-tech-light.jpg`)
- CDN asset pointers (`*.asset.json`) referenced via their `url` field, which is already an absolute `/__l5e/...` path

The only file in `public/` is `favicon.png`.

Action: verify each `<img>`/`background-image` across routes and components once more and normalize anything that isn't either an explicit import or an absolute `/`-prefixed URL. If nothing needs changing, report that instead of inventing edits. No behavior change intended.

## 2. Offer wording — drop the "7 days / 1 week"

Change the free-trial offer wording to plain "free testing" in all three dictionaries (`src/i18n/ru.json`, `uz.json`, `en.json`):

- `hero.cta_primary` (line 22)
- FAQ answer about on-site test (line 94)
- `sticky_cta` (line 518)
- home/subhead mentioning a 7-day trial (line 524)
- offer card title (line 554)

Resulting copy:
- RU: "Бесплатное тестирование" / "Да, бесплатный тест на вашем объекте."
- UZ: "Bepul sinov" / "Ha — ob'ektingizda bepul sinov."
- EN: "Free testing" / "Yes — free test on your site."

Left untouched (not the offer): deployment timeline "2–7 days", warranty timeline "from 7 days", and the customer quote mentioning a week.

## Technical notes

- Edits limited to the three i18n JSON files, plus any image-path normalization found during the audit.
- Keys stay the same, so no component changes are needed for the copy.
