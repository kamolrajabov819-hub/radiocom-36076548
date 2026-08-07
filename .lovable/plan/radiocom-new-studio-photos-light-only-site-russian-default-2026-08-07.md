# Radiocom — new studio photos, light-only site, Russian default

## 1. New hero + product photography (same style as the old hero)

Re-create the cinematic studio look of the original hero shot — floating black radios, soft white studio backdrop, subtle red rim light, soft ground shadow — but featuring the Radiocom RCD-60 model (screen + keypad body) you sent instead of the "RUGGED" units.

Images to generate in that one consistent style:
- Hero: two floating RCD-60 units (front + back three-quarter), white studio backdrop, red rim light.
- Product/brand shots used across the catalog and cards: Motorola-style handheld, Hytera handheld, PoC/LTE unit, compact radio — all as floating black radios on the same white studio backdrop with red rim light.
- Section imagery that shows radios (PoC section, service section) refreshed to match the same look.

Everything gets the same lighting, framing, shadow and background so the whole site feels like one photo shoot.

## 2. Remove dark mode

- Delete the theme toggle from the header and mobile menu.
- Remove theme storage/hydration logic, drop the `dark` class handling, and strip dark-mode styling and dark image variants.
- Replace the two-image cross-fade component usages with single light images (dark-only files deleted).
- Site renders light-only, always, no flash on load.

## 3. Russian as the main language

- Default and fallback language becomes Russian for first visits and for server-rendered HTML, so no English flash before switching.
- The RU/UZ/EN switcher stays; a saved choice still wins on return visits.
- `<html lang>` set to the active language.

## Technical notes

- New images generated into `src/assets/`, referenced by the existing imports; obsolete `*-dark.jpg` assets removed.
- Remove `src/components/ThemeToggle.tsx`, `src/lib/theme.ts`, `src/components/ThemedImage.tsx`; update `src/routes/__root.tsx`, `Nav.tsx`, `Footer.tsx`, `index.tsx`, `poc.tsx`, `service.tsx`, `ProductCard.tsx`, and `src/styles.css` (drop `.dark` token block and `dark:` utilities).
- `src/lib/i18n.ts` already inits with `lng: "ru"`; verify hydration order so the RU strings render first and localStorage override applies after mount.
