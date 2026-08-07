# Radiocom — real product photos, hero rework, brands & PoC redesign

## 1. Real product photos + trimmed catalog

The uploaded photo library (bucket `catalog-other-photos`) covers these models:

- Motorola: T42 (red / blue / Triple / Quad), T62 (red / blue), T72 Go Active, T82, T82 Extreme, T82 Extreme Quad, XT185, XT420, TLKR-T92 H2O
- Radiocom: RC-10, RC-20, RC-50, RCD-30, RCD-40, RCD-50, RCD-60, RCD-70

Actions:
- Make the photo storage publicly readable so the site can load the images, with read-only public access (no public writes).
- Rewrite `src/data/products.ts` so the catalog contains only the models above, each pointing to its own real photo (best/cleanest shot per model).
- Add the Radiocom models that exist as photos but are missing today (RC-20, RCD-30/40/50/60/70) with sensible category, range and price fields; drop RC-5D / RC-21 which have no photo.
- Everything else is removed: Hytera, Decross, Caltta, all DMR/mobile/repeater Motorola models, baby monitors and the industrial PDA.
- Follow-on cleanup so nothing breaks: brand list and filters shrink to Motorola + Radiocom RC, industry pages' recommended products re-map to surviving models, and unused product images are deleted.

## 2. Hero photo

- Show the radio much larger and full-bleed, filling more of the viewport with a tighter crop so it reads as a product statement rather than a small floating object.
- Remove the white photo box: the product will be cut out to a transparent background so it sits directly on the page with the signal-pulse motif visible behind it, plus a soft contact shadow underneath.
- Keep the scroll-scale / parallax and idle float, tuned to the new size.

## 3. "Бренды в нашем портфеле" section

Full redesign of the marquee strip:
- Two counter-scrolling rows of brand tiles with soft glass cards, red glow on hover, and a live count of models per brand.
- A large brand wordmark treatment with a signal-wave line animating through the strip, plus edge fades and pause-on-hover.
- Section header gets a word-by-word reveal and the copy becomes localized (currently hardcoded English "Authorized distribution").

## 4. PoC page hero

Current hero renders a hard black band behind the headline and a wide flat image; it breaks on mobile.
- Replace with a centered composition: kicker pill, gradient-masked headline that no longer paints a black rectangle, subhead, and two CTAs.
- The PoC device photo becomes a floating cut-out with a soft glow and animated coverage rings instead of a boxed 16:8 image.
- Mobile: single column, fluid headline sizing, no horizontal overflow, image scaled down and stacked.

## 5. Site-wide motion pass

- Scroll-linked parallax on section imagery, word-reveal headlines applied consistently.
- Cards get springier hover lift + tilt, buttons keep magnetic pull.
- Section entrances staggered; counters animate on view; route transitions get a quick fade-rise.
- All motion respects reduced-motion preferences and stays light on mobile.

## Technical notes

- Bucket flipped to public via the storage tool; product image URLs built from the public storage URL, no binaries added to the repo.
- `src/data/products.ts` rewritten (Brand union narrowed), `allBrands` updated; `src/components/BrandsStrip.tsx` and `src/routes/poc.tsx` rewritten.
- Hero cut-out produced with the image tool as a transparent PNG asset pointer.
- New/removed i18n keys mirrored across `src/i18n/{ru,en,uz}.json`.
