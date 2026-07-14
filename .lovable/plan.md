# v4.1 — Apple Polish Pass

Build on the existing v4 Apple aesthetic. Light mode stays the main experience; dark mode gets its own dedicated imagery so both themes feel intentionally art-directed. Every section gets locked to a symmetric 12-column rhythm and gains cinematic motion.

## 1. Dual-theme photography (light + dark pairs)

Generate matched pairs (light/dark) for each hero surface. Swap via `<picture>` + `prefers-color-scheme` and our theme class so switching the toggle instantly cross-fades.

Assets to generate (all saved into `src/assets/`, streamed):
- `hero-radio-light.jpg` — floating handheld radio on soft warm off-white gradient, top-down studio light, subtle red accent glow.
- `hero-radio-dark.jpg` — same radio, pitch-black stage, rim light + red signal glow.
- `bento-network-light.jpg` / `bento-network-dark.jpg` — abstract topology / repeater tower.
- `bento-service-light.jpg` / `bento-service-dark.jpg` — clean tech bench.
- `industry-{mining,logistics,security,energy,construction,government}-{light,dark}.jpg` — 12 total, cinematic.
- `poc-hero-light.jpg` / `poc-hero-dark.jpg` — dispatcher console.

Delivery: `<picture>` with `<source media="(prefers-color-scheme: dark)">` plus a `.dark img[data-theme-swap]` override so manual toggle also works. Blur-up placeholder + fade on load.

## 2. Symmetric layout system

Add a shared `Section` wrapper enforcing:
- `max-w-[1280px] mx-auto px-6 md:px-10`
- Vertical rhythm: `py-24 md:py-32` for standard, `py-40` for hero.
- Every grid is 12-col with centered content; bento cards use fixed aspect ratios (`aspect-[4/5]`, `aspect-square`, `aspect-[16/9]`) so rows always align.
- Headings centered by default; eyebrow + H2 + sub uses one component `<SectionHead>`.

Refactor `index.tsx`, `catalog.tsx`, `industries.$slug.tsx`, `poc.tsx`, `service.tsx` to use `Section` + `SectionHead`.

## 3. "Blind-your-mind" motion layer

Add to `src/lib/motion.ts` and apply site-wide:
- **Hero scale-scroll**: product image scales `1 → 1.15` and headline splits into per-char stagger reveal on load (Framer Motion `staggerChildren: 0.03`).
- **Sticky pinned scenes** on Home + PoC using `useScroll` + `useTransform` — image stays pinned while captions cross-fade left column.
- **Magnetic CTA** re-introduced (Apple-style subtle, 8px max pull) on primary buttons only.
- **Marquee** for brand strip with hover-pause.
- **Gradient text sweep** on section eyebrows (animated `background-position`).
- **Number counters** on outcomes (already partial) — unify with `useInView`.
- **Page transitions**: fade + 8px rise on route change via `AnimatePresence` in `__root.tsx`.
- **Cursor-follow spotlight** on Bento cards (radial-gradient tracking mouse).
- Respect `prefers-reduced-motion` — disable transforms, keep opacity fades.

## 4. Theme polish

- Keep light as default (`theme.ts` unchanged).
- Refine dark palette: bg `#0A0A0A`, card `#141414`, border `#1F1F1F`, text `#F5F5F7`, accent stays `#E30613`.
- Cross-fade theme toggle: 300ms opacity on `<html>` via CSS `transition: background-color, color`.

## 5. Files touched

New:
- `src/components/Section.tsx`, `src/components/SectionHead.tsx`, `src/components/ThemedImage.tsx`, `src/components/Magnetic.tsx`, `src/components/SpotlightCard.tsx`, `src/lib/motion.ts`.
- 20 new images in `src/assets/`.

Modified:
- All 5 route files → wrapped in Section, ThemedImage swapped in.
- `src/styles.css` → refined dark tokens, added `.eyebrow-sweep`, `.section-y` utilities, reduced-motion guards.
- `src/routes/__root.tsx` → AnimatePresence wrapper.

## Technical notes

Images generated via `imagegen` `standard` quality, 1600x1200 JPG for hero pairs, 1200x1500 for bento. Total ~20 generations — expensive but one-shot. No i18n keys change. No data changes. No backend changes.

## Out of scope

- No new routes, no product data changes, no auth, no CMS.
- Not touching `LeadFormSheet` internals beyond styling.
