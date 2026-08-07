# Radiocom — v8 fixes: featured, PoC hero, industry offers, product galleries, contact block

## 1. Homepage "Рекомендуем." is empty

The featured block still asks for product IDs from the old catalog (`m-dp4400`, `c-e690`, `h-s35-pro-lf`, `rc-21`) — none exist after the catalog cleanup, so nothing renders. Point it at four real bestsellers (Radiocom RCD-60, RCD-70, Motorola T82 Extreme, Motorola XT420) and make it fall back to the first four catalog items if an ID ever goes missing again, so the section can never render empty.

## 2. PoC page hero

Keep the split layout (copy left, floating device right) but raise the quality:
- Larger device, stronger contact shadow and a soft warm-white stage so it doesn't float on flat grey.
- Rework the concentric rings into a cleaner, slower signal-pulse with a subtle grid/gradient backdrop instead of the current pink haze.
- Tighter headline scale and spacing, three small proof chips under the buttons (LTE/WiFi, GPS, group calls).
- Mobile: device above copy, reduced ring size, no horizontal overflow.

## 3. Industry pages — "Что вы получите"

Replace the current stat-number cards with exactly three offer cards per industry, each tailored to that sector:
- Free on-site testing of radios in real conditions
- Trade-in of old radios toward new ones
- Authorized service, setup and programming

Animated: staggered entrance, icon draw-in, hover lift, with a micro-CTA on each card that opens the lead form. New i18n keys per industry in RU, UZ and EN.

## 4. Product cards — multiple photos

Storage holds several photos for most models (T42, T62, T72, T82, TLKR-T92, XT185, RCD-30/40/50/60/70, RC-10/20/50). I will:
- Download all extra shots, whiten backgrounds the same way as the current ones, and publish them as CDN assets.
- Add an `images: string[]` field per product in `src/data/products.ts`.
- Card: cross-fade to the second photo on hover, small dot indicator when more than one image exists.
- Detail panel: photo gallery with thumbnails, arrow keys and swipe on mobile.

## 5. Contact block at the end of every page

New shared section rendered above the footer on all pages (home, catalog, PoC, service, industries):
- Left: headline, address, working hours, phones, email, socials and a short inline lead form (name + phone + submit) using the existing lead pipeline.
- Right: the Google map embed, same as the reference.
- Symmetric two-column desktop layout, stacked on mobile, with fade-up animation.

Small cleanup while there: the footer bottom line still lists discontinued brands (Hytera, Caltta, Decross) — reduce it to Motorola · Radiocom RC.

## Technical notes

- Featured IDs and fallback live in `src/routes/index.tsx`.
- Extra photos become `.asset.json` pointers under `src/assets/catalog/`; no binaries committed.
- New `src/components/ContactBlock.tsx` mounted once in `src/routes/__root.tsx` above `<Footer />`.
- All new strings added to `src/i18n/ru.json`, `uz.json`, `en.json`.
