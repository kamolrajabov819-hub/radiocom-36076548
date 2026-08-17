<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Skills

This repo vendors 42 skills under `.claude/skills/` and 18 SEO sub-agents under
`.claude/agents/`. Claude Code picks them up automatically at session start, so design, motion
and SEO work here should go through them rather than improvising. See
[`.claude/skills/README.md`](.claude/skills/README.md) for the full map.

Fast path:

- **Changing how something looks or feels** → `apple-design` (motion, materials, springs)
- **Which Framer Motion prop or hook** → `framer-motion` (API reference; `apple-design` decides
  whether and how it should move, this one tells you the call)
- **Auditing what's already there** → `design-audit`
- **Looking up an Apple convention** → `apple-design-hig` (`references/hig/`, 56 topics)
- **Picking a palette or type pairing** → `ui-ux-pro-max`, which is a searchable database,
  not a prose guide: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system`
- **shadcn/Tailwind component work** → `ui-styling` (matches this stack exactly)
- **Any generated UI text** → `ui-typography` applies silently (real quotes, correct dashes)
- **SEO** → `seo` orchestrates; `seo-audit` fans out to the sub-agents. The ones that bite
  hardest on this site: `seo-hreflang` (three locales, no hreflang tags, `<html lang>` hardcoded
  to `ru`), `seo-local` (Uzbekistan-only business), `seo-schema` (no `Product`/`LocalBusiness`
  markup yet), `seo-sitemap` (none exists), `seo-technical`, `seo-images`.
  Script-backed skills need a one-time `.claude/skills/seo/bin/claude-seo setup`, which builds
  its own venv and leaves `bun`/`node` alone.

## Design system

`src/styles.css` is the single source of truth for visual tokens, and it is deliberately
Apple-flavoured. Extend it; don't add parallel CSS.

- **Palette** — `--pitch` (page white), `--charcoal` (raised surface), `--panel`, `--cool`
  (secondary text), `--crisp` (ink), `--signal` (Radiocom red `#e30613`). shadcn's semantic
  tokens (`--background`, `--primary`, …) are aliases over these, so use the shadcn names in
  components and the raw names only inside `styles.css`.
- **Type tiers** — `type-display`, `type-headline`, `type-title`, `type-body`, `type-caption`,
  plus `headline` / `headline-hero` / `subhead`. All fluid via `clamp()`; never hardcode a
  `text-[Npx]` for headings.
- **Rhythm** — `section` (96/128px), `section-tight`, `section-lg`, and the `band-plain` /
  `band-soft` / `band-dark` alternation. Compose sections from bands so the page keeps its
  vertical cadence.
- **Components** — `pill` + `pill-primary` / `pill-ghost` / `pill-accent` / `pill-link` for
  actions, `bento-card` and `spotlight-card` for surfaces, `frost-nav` for the header,
  `stage` for product shots, `elev-1` / `elev-2` for elevation.
- **Motion** — easing is `cubic-bezier(0.22, 1, 0.36, 1)` throughout; springs live in
  `src/lib/springs.ts`. Animate `transform` and `opacity` only. The global
  `prefers-reduced-motion` block at the bottom of `styles.css` neutralises everything, so
  don't re-implement reduced-motion per component.
- The site is light-mode only. `@custom-variant dark` is declared but no `.dark` token block
  exists, so `dark:` utilities have nothing to resolve against — use `band-dark` for dark
  sections instead of `dark:` variants.
