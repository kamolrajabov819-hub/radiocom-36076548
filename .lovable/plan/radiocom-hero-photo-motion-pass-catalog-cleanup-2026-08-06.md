# Radiocom — hero photo, motion pass, catalog cleanup

## 1. Hero photo → real Radiocom radio

The homepage hero currently shows a generic "RUGGED"-branded handset (`hero-radio-light.jpg` / `hero-radio-dark.jpg`). Replace it with the uploaded RADIOCOM RCD-60 photo so the hero shows our own brand on the device.

- Upload the RCD-60 photo as a CDN asset and use it for the light hero.
- Produce a matching dark-mode version (same device, dark studio backdrop with red rim light) so the light/dark cross-fade still works.
- Keep the same hero layout, sizing and scroll-scale animation; only the source images change.
- Also reuse the RCD-60 shot for the Radiocom RC products in the catalog, which currently borrow the Motorola photo.

## 2. More animation, cooler feel

Adds motion without changing content or layout:

- Hero: parallax on the device as you scroll, soft signal-pulse rings behind it, and a subtle floating idle drift.
- Section headlines: word-by-word reveal on scroll instead of a single fade.
- Cards (products, industries, bento): 3D tilt-on-hover with light following the cursor, plus a smoother lift.
- Scroll progress bar in red at the top of the page.
- Sticky number/stat counters animate when they enter view; brand marquee gets a smoother easing.
- Page transitions: quick fade + slight rise between routes.
- All of it respects "reduce motion" system settings and stays light on mobile.

## 3. Catalog: remove Baofeng

We don't sell Baofeng. Remove it everywhere:

- Drop "Baofeng" from the brand list used by catalog filters.
- Remove it from the brand marquee strip.
- Remove the Baofeng mention from the RU / UZ / EN copy that lists distributed brands.
- Rename the internal `product-baofeng.jpg` image usage so no product references a Baofeng-named asset (the Decross and baby-monitor items keep their photos, just under a neutral filename).
- No products currently carry the Baofeng brand, so no catalog items are lost.

## Technical notes

- Assets go through `lovable-assets` pointers; dark hero variant generated with the image tool.
- Animation work stays in `src/components/*` and route files using existing Framer Motion + `src/lib/springs.ts` tokens; new shared helpers (`TiltCard`, `ScrollProgress`, `WordReveal`) live in `src/components/`.
- Brand removal touches `src/data/products.ts` (`allBrands`, `Brand` union), `src/components/BrandsStrip.tsx`, and `src/i18n/{ru,en,uz}.json`.
- Fix the outstanding hydration mismatch on the hero eyebrow (server renders EN, client renders RU) as part of the hero rework.
