# Apple-grade design pass (v11)

Rebuild the presentation layer of the whole site so it reads like apple.com — hyper-minimal, generous whitespace, edge-to-edge product photography, spring-driven motion — and regenerate the product imagery in Apple's studio style, with the PoC page as the showcase.

Content, routes, product data, i18n keys and lead-gen logic stay as they are. Only visuals, layout and motion change (plus new image assets and any new copy strings, added in RU/UZ/EN).

## 1. Design foundations (src/styles.css)

- Type scale in Apple's steps: display `clamp(2.75rem, 7vw, 5.5rem)` with `-0.035em` tracking and `1.03` leading; headline, title, body, caption tiers. Tracking tightens as size grows, body sits near `0`.
- Vertical rhythm on a strict scale: 96 / 128 / 160px desktop, 64 / 80px mobile. Every section uses one of these — no ad-hoc padding.
- Neutral surface ladder: pure white, `#f5f5f7` alternating bands, near-black `#1d1d1f`. Signal red stays reserved for accents and one CTA per screen.
- Corner radii standardised to 18 / 28 / 44px by element size. Shadows soft and wide only, never hard.
- Translucent chrome: nav and sticky CTA become `backdrop-filter` layers with content scrolling underneath, plus a scroll-edge fade instead of a border line.

## 2. Motion system (src/lib/springs.ts + components)

- Replace the current mixed transitions with two springs: a default critically damped one (no overshoot, ~0.4s response) and a momentum spring with slight bounce for anything the user drags or flicks.
- Standard reveal for every section: opacity + 16px rise, staggered by 60ms, triggered once.
- Hover: lift plus a subtle image scale, spring-driven, interruptible.
- Reduced-motion path replaces every slide/scale with a short cross-fade.

## 3. Page rebuilds

**Home** — full-bleed hero on seamless white with the product large and centred, headline above, two-CTA row Apple-style (filled pill + text link). Below: alternating white / `#f5f5f7` bands, a bento grid with equal-height tiles, and a product rail with uniform 1:1 imagery.

**Catalog** — Apple "All models" grid: equal cards, product centred on white, name, one spec line, price/pill, buy link. Sticky translucent filter bar; single column below 640px.

**PoC (showcase page)** — full rework:
- Hero: large product on a seamless white stage, subtle contact shadow, slow float, scroll parallax, headline reveal.
- Comparison: two equal-height quiet panels on a light band, no heavy borders.
- Network design: numbered steps as a clean five-up grid on white.
- Rental: full-bleed black band with a rim-lit product shot, mirrored layout.

**Industries + Service** — same section band rhythm, equal-height cards, unified icon sizing and spacing. Service timeline becomes a light horizontal Apple-style flow.

## 4. Imagery

Generate a new coherent set in Apple studio style — seamless pure-white background, soft top-light, faint contact shadow, product dead-centre, generous margin:

- PoC hero (RCD-60) — large, front three-quarter, white.
- PoC rental (RCD-70) — dark field, rim-lit, matching black band.
- Home hero (RCD-60 pair) — white, wide framing.
- Two supporting lifestyle/detail shots for the bento tiles.

Existing catalog photos stay; they already sit on white.

## 5. i18n

Any new or reworded string is added to `src/i18n/ru.json`, `uz.json`, `en.json` in the same turn. No new hardcoded text.

## Technical notes

- Tokens and utilities live in `src/styles.css`; components use semantic classes only — no hardcoded colour utilities.
- Springs centralised in `src/lib/springs.ts`; components import from there rather than declaring inline transitions.
- New images generated to `src/assets/`, uploaded as CDN asset pointers and referenced via the existing `assetUrl()` helper so Netlify builds keep working.
- No changes to `src/data/products.ts`, routing, or lead-gen logic.
