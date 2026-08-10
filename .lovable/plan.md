# v9 — Contact form fix, PoC page rebuild, Apple-grade polish

## 1. Contact form is broken

In the closing "Приезжайте в офис" block the three fields sit in one row that overflows its column, so the red "Отправить" button is cut off by the map.

Fix:
- Two-column field grid (name + phone) with a full-width button below on narrow widths, single row only when there is real space.
- Consistent 48px control height, matching radii, focus ring in brand red, inline validation state and a clean success state that replaces the form with a short confirmation.
- No horizontal overflow at any width; button never clipped.

## 2. PoC page redesign (Apple style, real product)

Replace the generated device render with the real Radiocom photography already published in the catalog assets (RCD-60/RCD-70), cut out on white.

New page structure:
- Hero: centered Apple-style stage — oversized headline, thin subhead, two pill CTAs, real radio photo large and centered with a soft contact shadow and one restrained signal-pulse behind it. No pink haze, no busy rings.
- "PoC vs PMR": clean two-panel comparison on white/near-white surfaces, equal-height, quiet typography instead of the current heavy red block.
- Network design: five-step horizontal sequence with scroll-linked progress, equal-height cards.
- Rental: full-bleed dark section with a single product shot and one CTA.

## 3. Apple-style polish and motion across the site

- Vertical rhythm normalized (96/128/160px), consistent max width, symmetric section headers.
- Typography scale tightened: large display headlines, generous line-height on body, one accent weight.
- Motion pass: scroll-driven fade/slide-up with shared spring, hero parallax, hover lift + subtle image zoom on cards, count-up stats, smooth language cross-fade. Everything respects reduced-motion.
- Uniform card treatment (rounded wells, soft shadows) on home, catalog, industries and service pages.

## 4. Mobile

Audit every section at 375/390/430px: single-column product grid, stacked contact block with the map below, hero image above copy with reduced pulse size, no clipped headlines, tap targets at least 44px, and no horizontal scroll anywhere.

## Technical notes

- `src/components/ContactBlock.tsx` — form grid rework.
- `src/routes/poc.tsx` — hero and sections rebuilt; device image swapped to existing `src/assets/catalog/rcd-60*.asset.json` (no new image generation).
- Shared spacing/typography utilities in `src/styles.css`; motion via existing `src/lib/springs.ts`.
- Any new copy added to `src/i18n/ru.json`, `uz.json`, `en.json`.
