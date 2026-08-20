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

This repo vendors 74 skills under `.claude/skills/` and 18 SEO sub-agents under
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
- **SEO** → `seo` orchestrates; `seo-audit` fans out to the sub-agents. The site already has
  hreflang, self-canonicals, a 105-URL sitemap, robots/llms.txt and Organization, LocalBusiness,
  Product, Service, FAQPage and BreadcrumbList schema — check `src/lib/seo.ts` before assuming
  something is missing. `bun run verify` gates all of it and runs as part of `build`.
  Still open: no responsive images (`srcset`/WebP) for the CDN product photos, no code
  splitting, Google Fonts render-blocking, and no blog or location pages.
  Script-backed skills need a one-time `.claude/skills/seo/bin/claude-seo setup`, which builds
  its own venv and leaves `bun`/`node` alone.
- **Accessibility** → `accessibility-scan` (one page, automated), `accessibility-inspect`
  (keyboard and screen reader), `accessibility-fix`. The scanner needs a debuggable Chrome:
  `CHROME_PATH=<chromium> chromium --headless=new --remote-debugging-port=9222`.
  Note it reads the DOM without scrolling, so anything still waiting on a scroll reveal is
  measured at `opacity: 0` and reported as a 1:1 contrast failure — verify before "fixing".

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
- **Layout** — `shell` is the one container: it owns the horizontal inset and the max width,
  and publishes `--gutter` so shelves and wide tables can bleed past it with `bleed-x`. Use
  `<Section>`; never hand-roll `px-4 md:px-6` on a section, which is how the left edge came to
  move four times down one scroll.
- **Components** — `pill` + `pill-primary` / `pill-ghost` / `pill-accent` / `pill-link` for
  actions, `card-interactive` for the hover/press behaviour every card shares, `bento-card`
  and `spotlight-card` for surfaces, `frost-nav` for the header, `elev-1` / `elev-2` for
  elevation. `ProductShot` handles product photography — it centralises the studio-white
  `mix-blend-multiply` convention and its `cover` / `shadow` options.
- **Product photography** — the catalogue shots are studio images on a *white sweep*, and
  multiply is what removes that sweep. It only works on a light ground: on a dark card the
  sweep survives as a white slab, and a dark-background source multiplied onto white survives
  as a black one. Put the product on a light plate inside a dark card rather than blending it.
- **Motion** — easing is `cubic-bezier(0.22, 1, 0.36, 1)` throughout; springs live in
  `src/lib/springs.ts`. Animate `transform` and `opacity` only. The global
  `prefers-reduced-motion` block at the bottom of `styles.css` neutralises everything, so
  don't re-implement reduced-motion per component.
- The site is light-mode only. `@custom-variant dark` is declared but no `.dark` token block
  exists, so `dark:` utilities have nothing to resolve against — use `band-dark` for dark
  sections instead of `dark:` variants.
