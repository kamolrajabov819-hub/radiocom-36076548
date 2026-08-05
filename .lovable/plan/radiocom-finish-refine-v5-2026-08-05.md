# Radiocom — Finish & Refine (v5)

Four fixes: complete the missing copy, swap the palette back to Radiocom red, rebuild product cards in the Apple "All models" style, and put the real logo in the header/footer.

## 1. Finish the unfinished text

Nine keys render as raw placeholders on screen (e.g. `catalog.title`, `service.flow_title`):

- `catalog.title`
- `service.flow_title`
- `home.hero.eyebrow`, `home.featured.eyebrow`, `home.bento.eyebrow`, `industries.eyebrow`
- `home.bento.network.eyebrow`, `home.bento.network.title`, `home.bento.network.sub`

Write real, sales-oriented copy for each in RU, UZ and EN, then sweep every route for other placeholder/lorem strings and fill those too. Also fix the hero hydration flicker so the headline text matches on first paint.

## 2. Palette: red and white, not blue

Brand accent becomes Radiocom red (`#E30613`, with a slightly brighter tint for dark mode) everywhere the current blue is used: buttons, eyebrows, icons, focus rings, pulse motif, gradients. Base stays near-white in light mode / near-black in dark. Backgrounds move to Apple's layered greys (`#FFFFFF` surfaces on `#F5F5F7` sections) so cards read as objects on a page.

## 3. Product cards — Apple "All models" style

New shared card used on the homepage best-sellers row, the catalog grid and industry recommendation grids:

- White rounded card (~20px radius), generous padding, soft shadow, equal heights
- Product name at the **top** in bold display type (2-line clamp)
- Product photo centered in the middle of the card, transparent-style on a light well, subtle zoom on hover
- Short spec/price line at the bottom left, red pill CTA ("Request quote") bottom right
- Category/brand badge as a small pill above the name
- One card per row below 640px; horizontal snap-scroll carousel on the homepage row like Apple's

## 4. Real logo

Upload the supplied transparent RADIOCOM logo to CDN assets and use it in the nav (replacing the hand-drawn SVG mark + wordmark) and in the footer, with a colour-inverted treatment for dark mode. Also reuse it as the favicon.

## 5. Photography refresh

Regenerate the weak images as matched light/dark pairs on clean Apple-style seamless backdrops: hero radio, product shots (Motorola / Hytera / Baofeng / PoC), network bento, service bench, and the three industry photos. Consistent lighting, soft shadow under each device, no busy backgrounds.

## Technical notes

- Tokens live in `src/styles.css` (`--signal`, surfaces, shadows) — no component-level hex values.
- New `src/components/ProductCard.tsx` consumed by `index.tsx`, `catalog.tsx`, `industries.$slug.tsx`.
- Copy added to all three dictionaries in `src/i18n/{ru,uz,en}.json` via a deep merge so nothing existing is lost.
- Logo goes through `lovable-assets` as a `.asset.json` pointer.
- No changes to routes, data model, lead-gen, or maps.
