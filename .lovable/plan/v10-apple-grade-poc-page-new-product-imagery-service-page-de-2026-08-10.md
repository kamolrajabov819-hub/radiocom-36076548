# v10 — Apple-grade PoC page, new product imagery, service page dedup

## 1. PoC page rebuild (apple.com styling)

The hero currently shows the product photo as a visible white rectangle floating on a near-white page (reference image 1), and the rental section shows the same problem inverted — a white card pasted onto black (reference image 2). Both read as pasted screenshots rather than product photography.

Fix:
- Generate two new hero-grade product images from the existing Radiocom RCD-60 / RCD-70 photography: one on a seamless white studio field with a soft contact shadow for the hero, one on a deep near-black field with a subtle rim light for the rental section. No hard image edges, no visible frame or card.
- Hero: Apple product-page stage — small red kicker, oversized tight-tracking headline, thin grey subhead, two pill CTAs, then the device large and centered on the page background itself with a soft grounded shadow. Remove the concentric ring animation and the white block; keep only a slow parallax rise on scroll.
- Feature chips move under the device as quiet grey text row, not bordered pills.
- "PoC vs PMR": two equal-height quiet panels on a near-white surface, no red-filled card.
- Network design: five-step sequence, equal-height cards, consistent padding.
- Rental: full-bleed black section, dark-field product image bleeding into the background, single white pill CTA.

## 2. Apple.com design consistency across the site

Pass over home, catalog, industries and service:
- Same section rhythm (96 / 128 / 160px), same max width, symmetric centered section headers.
- One typography scale: large tight display headlines, grey secondary text, single accent weight.
- Uniform card treatment: rounded wells, soft shadow, equal heights within a row, image areas that blend into the card background rather than sitting on a lighter rectangle.
- Motion unified on the shared spring: fade/slide-up on scroll, hover lift on cards, reduced-motion respected.

## 3. Service page duplicate contact block

The site-wide contact block (map + address + form) is rendered globally, and the service page renders its own map + contacts section on top of it.

Fix: remove the service page's own map/contacts section and keep the global one, moving the "Запросить ремонт" CTA into the section above so no content is lost.

## Technical notes

- `src/routes/poc.tsx` — hero, compare, network, rental rebuilt; new asset imports.
- New generated images uploaded as CDN asset pointers under `src/assets/`.
- `src/routes/service.tsx` — drop the local `MapEmbed` block (lines ~196–220) and its import.
- Shared spacing/typography in `src/styles.css`; motion from `src/lib/springs.ts`.
- Any new copy added to `src/i18n/ru.json`, `uz.json`, `en.json`.
