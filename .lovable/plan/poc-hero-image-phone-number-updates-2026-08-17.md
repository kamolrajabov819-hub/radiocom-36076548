# PoC hero image + phone number updates

## 1. New PoC hero image

Generate a fresh studio-style product shot for the PoC page hero, in the same visual family as the home page hero (seamless white background, soft contact shadow, Apple-style lighting) but a different composition — a single rugged Radiocom PoC radio at a slight three-quarter angle instead of the current straight-on cutout.

- Save as a new asset and use it only in the PoC hero (`src/routes/poc.tsx`); the home hero stays untouched.
- Keep the existing stage, float animation, parallax and sizing so nothing else in the layout shifts.

## 2. Phone number changes

- Replace `+998 93 387-07-10` with `+998 93 389-07-10` everywhere it appears: the footer and the shared contact block (which shows on every page).
- On the service page, replace the repair contact `+998 93 505-07-19` with `+998 93 980-07-10`.
- Office landline `+998 78 113-16-18` stays as is.

Both `tel:` links and displayed text are updated together.

## Technical notes

Files touched: `src/routes/poc.tsx`, `src/routes/service.tsx`, `src/components/Footer.tsx`, `src/components/ContactBlock.tsx`, plus one new image asset under `src/assets`.
