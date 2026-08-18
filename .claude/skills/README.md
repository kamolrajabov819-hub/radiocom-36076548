# Project skills

Sixty-two skills — 16 design/UX, 25 SEO, and 21 animation/3D — plus 18 SEO sub-agents,
vendored into this repo as **project skills**. Claude Code discovers anything at `.claude/skills/<name>/SKILL.md`
and `.claude/agents/*.md` automatically at session start — nothing to install per machine,
and they travel with the repo (including to Lovable).

Invoke one by name (`/design-audit`, `/apple-design`, `/seo-audit`, …) or just describe the
work and let the matching skill trigger on its own.

## What's installed, and when to reach for it

### Apple design — three complementary angles

| Skill | Use it for |
| --- | --- |
| `apple-design` | Apple's *motion and materials* craft for the web: springs, gesture-driven sheets, interruptible transitions, momentum, translucency, optical typography. The one to use for how things move and feel. |
| `apple-design-hig` | The Human Interface Guidelines corpus (`references/hig/`, 56 topics: color, typography, layout, materials, liquid-glass, dark-mode, motion, accessibility). Reference and audit material — look things up here. |
| `apple-design-web` | A compact Apple-flavoured CSS system: token palette, glass cards, pill buttons, frosted nav, entrance animations. Quick-start recipes rather than principles. |

This project's `src/styles.css` already implements much of `apple-design-web` natively in
Tailwind v4 (`pill`, `frost-nav`, `bento-card`, `type-display`, the `--pitch`/`--crisp`/`--signal`
palette). Prefer extending those utilities over pasting new CSS.

### UI/UX intelligence

| Skill | Use it for |
| --- | --- |
| `ui-ux-pro-max` | Searchable local database — 79 styles, 192 palettes, 74 font pairings, 119 UX guidelines, 105 icons, 25 chart types, 22 stacks. Query it before inventing a palette or type pairing. |
| `ui-styling` | shadcn/ui + Radix + Tailwind implementation patterns, theming, dark mode, accessible component recipes. Matches this project's stack directly. |
| `design-system` | Three-layer token architecture (primitive → semantic → component), spacing/type scales, component specs. |
| `design` | Umbrella creative skill: logos, corporate identity, icons, banners, social images, HTML decks. |
| `brand` | Brand voice, visual identity, messaging frameworks, consistency checklists. |
| `banner-design` | Ad/social/hero banners at platform-correct dimensions. |
| `slides` | Strategic HTML presentations with Chart.js and design tokens. |

### Craft and review

| Skill | Use it for |
| --- | --- |
| `design-audit` | Systematic visual audit of what already exists → phased, implementation-ready plan. Purely visual; touches no logic. Start here for "make it feel more premium". |
| `ui-typography` | Enforcement-mode typographic correctness — real quote marks, correct dashes, spacing, hierarchy. Applies silently whenever UI text is generated. |
| `bencium-impact-designer` | Distinctive production-grade frontend that avoids generic AI aesthetics. |
| `bencium-innovative-ux-designer` | Same brief, more experimental direction. |
| `bencium-controlled-ux-designer` | Same brief, but asks before each visual decision — use when you want to stay in the loop. |
| `renaissance-architecture` | First-principles UI/architecture thinking; anti-derivative-work check. |

## Motion and 3D — 21 skills

The runtime only ships **Lenis + GSAP** alongside the Framer Motion already in the project
(~80 KB added). Three.js, React Spring and Anime.js were deliberately not installed as
dependencies: there are no `.glb` models for these radios (only photos), and the rest duplicate
what GSAP and Framer Motion already do. Client JS was 947 KB before this work, and Core Web
Vitals feed ranking. The skills are all installed regardless — they cost nothing at runtime.

| Skill | Use it for |
| --- | --- |
| `gsap-core`, `gsap-timeline`, `gsap-utils` | GSAP tweens, timelines, helper functions |
| `gsap-scrolltrigger` | Pinned and scrub-driven scroll scenes — the apple.com technique |
| `gsap-react`, `gsap-frameworks` | `gsap.context()` cleanup and React integration |
| `gsap-performance`, `gsap-plugins` | Frame budget, plugin catalogue |
| `motion-framer` | Framer Motion patterns, variants, orchestration |
| `react-spring-physics` | Spring physics reference (library not installed) |
| `threejs-*` (10) | WebGL reference — fundamentals, geometry, materials, shaders, lighting, textures, loaders, animation, interaction, post-processing (library not installed) |
| `framer-motion` | API reference — which prop or hook, variants and stagger, `AnimatePresence`, `layoutId`, `useScroll`/`useTransform`, gesture props, pitfalls. Pairs with `apple-design`: that one decides *whether and how* motion should feel, this one tells you the call. Carries a local addendum pointing at `src/lib/springs.ts` and the Framer-Motion reduced-motion gap. |

## SEO — 25 skills + 18 sub-agents

From [AgricIDaniel/claude-seo](https://github.com/AgricIDaniel/claude-seo) v2.2.4. `seo` is the
orchestrator; the rest are specialists it delegates to. The 18 matching sub-agents live in
`.claude/agents/` and are what `seo-audit` fans out to.

**Most relevant to this site** — a multilingual (`en`/`ru`/`uz`) regional marketing site for
physical products with a service business behind it:

| Skill | Why it fits Radiocom |
| --- | --- |
| `seo-hreflang` | The i18n setup is the single biggest SEO surface here. `src/i18n/` has three locales but `__root.tsx` hardcodes `<html lang="ru">` and emits no `hreflang` tags — this skill audits and generates them. |
| `seo-local` | Uzbekistan-only business: Google Business Profile, NAP consistency, citations, `LocalBusiness` schema, map pack. |
| `seo-schema` | `Product` schema for the catalog, `LocalBusiness` for contact, `Organization` for the brand. Nothing is currently marked up. |
| `seo-technical` | Crawlability, indexability, Core Web Vitals, and JS rendering — this is a TanStack Start SSR app, so rendering behaviour matters. |
| `seo-sitemap` | No sitemap exists yet; this generates one, locale-aware. |
| `seo-page` / `seo-audit` | Single-page deep dive, or a full crawl that delegates to the specialists. |
| `seo-images` | The catalog is image-heavy (`src/assets/catalog/`); covers alt text, WebP/AVIF, CLS, lazy-loading. |
| `seo-geo` | AI Overviews / ChatGPT / Perplexity citability, `llms.txt`. |

**The rest:** `seo-content`, `seo-content-brief`, `seo-cluster`, `seo-competitor-pages`,
`seo-plan`, `seo-programmatic`, `seo-sxo`, `seo-drift`, `seo-backlinks`, `seo-maps`,
`seo-ecommerce`, `seo-flow`, `seo-google`, `seo-dataforseo`, `seo-image-gen`.

### The Python runtime

The SEO skills call helper scripts (SSRF-safe fetchers, headless rendering, HTML parsing,
report generation) through a launcher that manages **its own virtualenv** — it does not touch
this project's `bun`/`node` dependencies:

```sh
.claude/skills/seo/bin/claude-seo doctor   # status
.claude/skills/seo/bin/claude-seo setup    # build the venv (~20 packages, first run only)
.claude/skills/seo/bin/claude-seo run render_page.py <URL> --mode auto --json
```

`setup` has **not** been run — do it when you first need a script-backed skill. Several
skills work fine without it (`seo-hreflang`, `seo-schema`, `seo-plan`, `seo-content-brief`
and the other advisory ones reason over files you already have).

### What needs credentials

These are installed but inert until configured, and each requires an account:

- `seo-google` — Search Console, PageSpeed, CrUX, GA4, Indexing API. See
  `seo/references/auth-setup.md`. PageSpeed/CrUX need only a free API key; the rest need OAuth.
- `seo-dataforseo`, `seo-image-gen` — these are *extension mirrors*. The skill text is here,
  but the MCP server and API key are not. See `seo/docs/MCP-INTEGRATION.md`.
- `seo-backlinks` — degrades gracefully: free tiers (Moz, Bing Webmaster, Common Crawl) work
  standalone; the DataForSEO path needs the extension.

## Sources

| Source | Skills taken |
| --- | --- |
| [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | `ui-ux-pro-max`, `ui-styling`, `design`, `design-system`, `brand`, `banner-design`, `slides` |
| [bencium/bencium-claude-code-design-skill](https://github.com/bencium/bencium-claude-code-design-skill) | `bencium-impact-designer`, `bencium-innovative-ux-designer`, `bencium-controlled-ux-designer`, `design-audit`, `ui-typography`, `renaissance-architecture` |
| [emilkowalski/skills](https://github.com/emilkowalski/skills/tree/main/skills/apple-design) | `apple-design` |
| [dickwu/apple-design-skill](https://github.com/dickwu/apple-design-skill) | `apple-design-hig` |
| uploaded `aphloappledesign.zip` | `apple-design-web` |
| [AgricIDaniel/claude-seo](https://github.com/AgricIDaniel/claude-seo) v2.2.4 | `seo` + 24 `seo-*` skills, 18 agents in `.claude/agents/` |
| [claude-dev-suite/claude-dev-suite](https://github.com/claude-dev-suite/claude-dev-suite) → `skills/animation/framer-motion` | `framer-motion` |
| [greensock/gsap-skills](https://github.com/greensock/gsap-skills) | 8 `gsap-*` skills |
| [cloudai-x/threejs-skills](https://github.com/cloudai-x/threejs-skills) | 10 `threejs-*` skills |
| [freshtechbro/claudedesignskills](https://github.com/freshtechbro/claudedesignskills) | `motion-framer`, `react-spring-physics` |

## Local modifications

Three changes were needed to make upstream copies work as project skills:

1. **`ui-ux-pro-max/SKILL.md`** — upstream ships as a *plugin* and calls its search engine
   through `${CLAUDE_PLUGIN_ROOT}`, which is unset for project skills. All 11 call sites now
   use the repo-relative `.claude/skills/ui-ux-pro-max/scripts/search.py`. Verify with:
   `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "b2b equipment catalog" --design-system`
2. **`apple-design-hig`, `apple-design-web`** — both upstreams declare `name: apple-design`,
   which collides with the emilkowalski skill. Their frontmatter names now match their
   directories. `apple-design-web` also shipped without the `references/`, `templates/`,
   `examples/` and `scripts/` folders its SKILL.md linked to, so those dead links were
   removed and repointed at the sibling skills that do carry that depth.
3. **`ui-styling/canvas-fonts/`** — 5.5 MB of `.ttf` binaries for the optional Python/PIL
   poster renderer, omitted. See that directory's README to restore them.

Four more were needed for the SEO and motion sets:

4. **`claude-seo` installs to `~/.claude/` upstream.** Its `install.sh` targets the user's home
   directory and `sed`s `$HOME` into every doc reference, which would break for anyone else
   cloning this repo. Installed here as project skills instead, with all 133 `claude-seo run`
   references rewritten to the repo-relative `.claude/skills/seo/bin/claude-seo`. The
   orchestrator dir doubles as the plugin root — `scripts/`, `bin/`, `schema/`, `pdf/`, `data/`
   nest inside it, which is what `runtime.py` (`Path(__file__).parent.parent`) and
   `bin/claude-seo` (`dirname/../scripts`) resolve against, so nothing else needed patching.
5. **`data/google-updates.json` was added.** Upstream's `install.sh` never copies `data/`, but
   `scripts/seo_updates.py` reads `<root>/data/google-updates.json` — so that script is broken
   in the official installer and works here.
6. **`claude-seo`'s `hooks/hooks.json` was skipped.** It registers a `PostToolUse` hook on every
   `Edit|Write` to validate schema, wired through `${CLAUDE_PLUGIN_ROOT}` (unset for project
   skills) and requiring a `settings.json` change. Enabling it would run a Python validator on
   every file edit in this repo — ask before adding it.
7. **`framer-motion` shipped with no frontmatter.** Unlike its sibling `styling/tailwindcss`,
   the upstream file starts at `# Framer Motion Skill`, so Claude Code could not discover or
   trigger it. Frontmatter was added in the repo's own house format. Three JSX snippets in its
   "Spring Config" section were also missing a closing brace (`damping: 20 }` → `}}`) and would
   not have compiled if copied; those are fixed, and a clearly-marked local addendum points at
   this project's `src/lib/springs.ts` and the Framer-Motion reduced-motion gap.

`claude-seo`'s `extensions/` (Ahrefs, DataForSEO, Firecrawl, SE Ranking, Profound, Bing
Webmaster, Unlighthouse, banana/Gemini) are not installed — each needs its own paid API key and
MCP server. Its `tests/`, `.github/` and `.devcontainer/` are repo scaffolding and were skipped.
Only `framer-motion` was taken from `claude-dev-suite`; that repo carries several hundred other
skills across unrelated stacks.

Skills from the bencium repo that are not design work were left out deliberately:
`bencium-code-conventions` (another developer's personal style rules, which would conflict
with this project's), `bencium-aeo`, `adaptive-communication`, `human-architect-mindset`,
`negentropy-lens`, `vanity-engineering-review`, `relationship-design`, `insurgent-campaign`,
`eu-ai-act-reviewer`, `hungarian-humanizer`, and the `emotion-statusline` hook. They are one
`cp -R` away from the upstream clone if wanted.
