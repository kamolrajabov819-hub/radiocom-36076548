# Project skills

One hundred and four skills — 29 design/UX and art direction, 26 SEO, 21 animation/3D,
17 browser automation and GTM research, 5 accessibility and 6 React/frontend engineering —
plus 18 SEO sub-agents,
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
| `frontend-design` | Anthropic's original: aesthetic direction, typography and layout choices that don't read as templated defaults. The three `bencium-*` skills below are opinionated forks of it — reach for this one when you want the unforked reference. |
| `bencium-impact-designer` | Distinctive production-grade frontend that avoids generic AI aesthetics. |
| `bencium-innovative-ux-designer` | Same brief, more experimental direction. |
| `bencium-controlled-ux-designer` | Same brief, but asks before each visual decision — use when you want to stay in the loop. |
| `renaissance-architecture` | First-principles UI/architecture thinking; anti-derivative-work check. |

### Taste and art direction — 13 skills

From [leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill). Anti-slop design skills:
the premise is that a model left to its own devices produces templated, centred, gradient-on-white
layouts, and each of these constrains it out of that. They overlap the `bencium-*` and
`frontend-design` set above — reach for these when you want a *named aesthetic* enforced rather
than general design judgement.

| Skill | Use it for |
| --- | --- |
| `design-taste-frontend` | The default of the set (upstream v2, experimental). Reads the brief, infers a design language, tunes three dials — VARIANCE / MOTION / DENSITY — and ships landing pages, portfolios and redesigns. Carries a design-system map, GSAP skeletons and a hard-rules pre-flight check. The largest skill in the repo at ~87 KB. |
| `design-taste-frontend-v1` | The preserved v1, for exact backward compatibility. Don't start here. |
| `gpt-taste` | Awwwards-level direction: enforced layout randomisation, AIDA page structure, wide editorial type, gapless bento, strict ScrollTrigger pinning and scrubbing. |
| `redesign-existing-projects` | Audit-then-upgrade an existing site: finds the generic AI patterns and replaces them without breaking behaviour. The closest match to work on *this* repo. |
| `high-end-visual-design` | The "expensive" look — premium fonts, whitespace, depth, restrained motion. Blocks the defaults that read as cheap. |
| `minimalist-ui` | Notion/Linear editorial register: warm monochrome, typographic contrast, flat bento, no gradients or heavy shadow. |
| `industrial-brutalist-ui` | Swiss print × military terminal. Rigid grids, extreme scale contrast, analog degradation. Beta upstream. |
| `stitch-design-taste` | Emits a `DESIGN.md` of semantic rules for Google Stitch and other AI UI generators to consume. |
| `image-to-code` | Image-first loop: generate the design reference, analyse it, then implement to match. |
| `imagegen-frontend-web` | Generates premium website reference images — one horizontal image *per section*. Writes no code. |
| `imagegen-frontend-mobile` | Same, for mobile screens and flows in phone mockups. Writes no code. |
| `brandkit` | Brand-guidelines boards: logo systems, palettes, type, mockups. Writes no code. |
| `full-output-enforcement` | Not a design skill — a behavioural one. Bans `// ... rest of the code` placeholders and truncated output. Apply to any task that must come back complete. |

The three `imagegen-*`/`brandkit` skills and `image-to-code` need an image-generation backend
(Gemini/nanobanana or equivalent); none is wired up here, so they will describe prompts rather
than produce files until one is. `taste-skill-llms.txt` is upstream's one-line index of the set.


## Accessibility — 5 skills

From [accesslint/claude-marketplace](https://github.com/accesslint/claude-marketplace) v0.10.2
(MIT). A tiered WCAG 2.2 toolkit — the first accessibility coverage in this repo that isn't
incidental to `apple-design-hig` or `ui-ux-pro-max`.

| Skill | Use it for |
| --- | --- |
| `accessibility-scan` | One page, automated: runs the `@accesslint/core` rule engine over CDP against a live page and returns violations grounded to DOM selector and source `file:line`. |
| `accessibility-inspect` | One page, hands-on: keyboard operation and focus order, screen-reader names/roles/states, reflow and zoom at 200%, reduced motion, target size — the things a rule engine can't decide. |
| `accessibility-audit` | Whole site, WCAG-EM methodology: samples pages and flows, runs both tiers, produces one conformance report. |
| `accessibility-fix` | Applies mechanical remediations from a worklist and re-verifies. Leaves TODOs where the call needs human judgment. |
| `accessibility-diff` | Regression gate: new vs. fixed violations against uncommitted changes or a branch. |

`accessibility-shared/` holds the `methodology.md` all five cite (severity rubric, the
no-proxy boundary, grounding rules). It has no `SKILL.md`, so skill discovery ignores it —
it is a reference sibling, not a stray directory. Don't delete it.

**Runtime:** these shell out to `npx @accesslint/{chrome,cli,core}`, downloaded on first use,
driving a debuggable Chrome. Verified working here: `npx -y @accesslint/cli --help` reports
v0.12.0 / engine 0.16.0. Nothing is added to `package.json`. `accesslint init` scaffolds an
`accesslint.config.json` with named targets (dev, prod) if you want to stop passing URLs.

## React and frontend engineering — 6 skills

| Skill | Use it for |
| --- | --- |
| `vercel-react-best-practices` | 70 rules across 8 categories, ordered by impact — waterfalls, bundle size, server perf, re-renders, rendering, JS micro-perf. `rules/<name>.md` per rule; `AGENTS.md` is the compiled whole. The project is React 19.2, so all of it applies except the Next.js-specific server rules. |
| `vercel-composition-patterns` | Compound components, children over render props, killing boolean-prop proliferation, React 19's no-`forwardRef` change. Aimed straight at `src/components/`. |
| `vercel-react-view-transitions` | React's `<ViewTransition>` API, `addTransitionType`, CSS pseudo-element recipes. Usable on React 19.2. Its `references/nextjs.md` covers App Router — routing here is TanStack Router, so read that file for the concepts, not the API. |
| `web-design-guidelines` | Vercel's Web Interface Guidelines — 100+ a11y/perf/UX rules, terse `file:line` output. Good first pass before the deeper `accessibility-*` tiers. |
| `webapp-testing` | Playwright driver for a locally running app: click through flows, capture screenshots, read console logs. Bundled `scripts/with_server.py` starts `bun dev` and waits for the port. **This project has no test tooling at all** — no Playwright, no Vitest — so this is the one new skill that adds a capability rather than knowledge. Needs Python + Playwright installed; this container already has Chromium at `/opt/pw-browsers/chromium`. |
| `frontend-design` | Listed under *Craft and review* above. |

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

## SEO — 26 skills + 18 sub-agents

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

`seo-geo-aeo` is a separate skill from a different author
([SNLabat/SEO-GEO-AEO-Skill](https://github.com/SNLabat/SEO-GEO-AEO-Skill)) — a standalone,
end-to-end audit that scores a site 1–10 on each of SEO, GEO and AEO and emits a formatted
`.docx` + `.pdf` client report. It overlaps `seo-geo` and both trigger on "GEO" / "AI
Overviews" / "Perplexity": prefer `seo-geo` when the output feeds `seo-audit`'s fan-out,
`seo-geo-aeo` when you want the standalone scored deliverable. Its report step needs the Node
`docx` package and LibreOffice — see the "Local setup" block at the top of its `SKILL.md`.

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

## Browser automation and GTM research — 17 skills

From [browserbase/skills](https://github.com/browserbase/skills) (MIT). Two clusters that share
one dependency.

**All of these need `BROWSERBASE_API_KEY` (most also `BROWSERBASE_PROJECT_ID`) and the `browse`
CLI (`npm install -g browse`).** Neither is configured in this repo — the skills are installed
but inert until you add credentials. `safe-browser` and `autobrowse` additionally want
`ANTHROPIC_API_KEY`. Note that this project already has a local Playwright + Chromium setup
(`shot.mjs`, `shot-el.mjs`, and the `webapp-testing` skill) that needs no account — prefer it
for straightforward local screenshots and DOM checks, and reach for these when you need a
remote browser, residential proxies, CAPTCHA handling or a persistent authenticated session.

### Browser control

| Skill | Use it for |
| --- | --- |
| `browser` | The core one: drive a page in natural language — navigate, click, fill, extract, screenshot. Remote Browserbase sessions with verified browsers, CAPTCHA solving and proxies. |
| `fetch` | Retrieve a URL *without* a browser — HTML/JSON, status codes, headers, redirects. Cheaper than `browser` when nothing needs rendering. |
| `search` | Web search returning structured results (title, URL, author, date). No page content. |
| `cookie-sync` | Push local Chrome cookies into a Browserbase persistent context, so a remote session browses as you. Already written against this repo's `.claude/skills/` layout. |
| `browser-trace` | Full CDP trace of a run — network, console, DOM dumps, screenshots — bisected into per-page buckets. The debugging companion to everything else here. |
| `browser-to-api` | Turn a `browser-trace` capture into a best-effort OpenAPI 3.1 spec. Reverse-engineers a site's XHR surface. |
| `ui-test` | Adversarial UI QA driven off a git diff — tests only what changed, covering correctness, a11y, responsive layout and UX heuristics. Works against `localhost`, so it is the most immediately usable of the set. |
| `autobrowse` | Self-improving loop: run a task, read the trace, rewrite the navigation strategy, repeat until it passes reliably. |
| `functions` | Deploy an automation to Browserbase as a scheduled/webhook cloud function. |
| `safe-browser` | Build a constrained-browser agent: a `safe_browser` tool owns CDP and enforces a domain allowlist, so the runtime agent never gets raw shell or CDP. |
| `browser-use-to-stagehand` | Port `browser-use` (Python) scripts to Stagehand v3 (TypeScript). |
| `webmcp-gen` | Author and validate site-specific WebMCP init scripts from a target URL. |
| `agent-experience` | Drop several subagents at a product, SDK, docs site or `SKILL.md` with only a thin prompt, capture their traces, and grade the onboarding A–F. Useful for auditing this repo's own skills. |
| `optimize-agent-prompt` | Autobrowse-style outer loop for tuning a Browserbase Agent system prompt to convergence. |

### GTM research

| Skill | Use it for |
| --- | --- |
| `company-research` | Discover target companies, deep-research each, score ICP fit → HTML report + CSV. |
| `competitor-analysis` | Auto-discover competitors, research on four lanes, compile an overview / deep-dive / feature-pricing matrix / mentions feed. |
| `event-prospecting` | Take a conference speakers URL, filter the companies against your ICP, deep-research the fits. |

These three are sales-prospecting tools rather than site-building tools; they are the least
related to this project's day-to-day work, kept for completeness of the upstream set. Their
output lands in a gitignored `gtm-reports/` at the project root (see modification 13 below).


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
| [SNLabat/SEO-GEO-AEO-Skill](https://github.com/SNLabat/SEO-GEO-AEO-Skill) | `seo-geo-aeo` |
| [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (MIT) | `vercel-react-best-practices`, `vercel-composition-patterns`, `vercel-react-view-transitions`, `web-design-guidelines` |
| [anthropics/skills](https://github.com/anthropics/skills) → `skills/` | `frontend-design`, `webapp-testing` |
| [accesslint/claude-marketplace](https://github.com/accesslint/claude-marketplace) (MIT) → `plugins/accesslint/skills/` | the 5 `accessibility-*` skills + `accessibility-shared/` |
| [leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill) (MIT) @ `843c8dd` → `skills/` | the 13 taste/art-direction skills + `taste-skill-llms.txt` |
| [browserbase/skills](https://github.com/browserbase/skills) (MIT) @ `d15a21f` → `skills/` | the 17 browser-automation and GTM skills |

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

Four more were needed for this round of installs:

8. **The `accesslint` skills invoke each other by plugin name.** Upstream ships as a Claude Code
   *plugin*, so all 20 cross-references read `accesslint:accessibility-scan`. That namespace
   does not exist for project skills and the invocations would not resolve, so the
   `accesslint:` prefix is stripped throughout. Their shared `shared/methodology.md` is
   vendored as `accessibility-shared/methodology.md` — `shared/` alone reads as stray inside a
   skills directory — and the five `../shared/…` links were repointed to match.
9. **`seo-geo-aeo` hardcoded one author's Claude sandbox.** Five paths pointed at
   `/sessions/wizardly-charming-thompson/mnt/…`, which exists on no other machine: the report
   output directory, the `docx` skill's `validate.py` and `soffice.py`, and two `computer://`
   download links. Reports now go to a gitignored `seo-reports/` in the project root, the
   validator paths resolve through a `$DOCX_SKILL` variable, and a "Local setup" block at the
   top of the file explains how to resolve it and how to fall back to plain `soffice`.
10. **`web-design-guidelines` fetched its own rules over the network on every run.** Upstream is
    a ~50-line stub that `WebFetch`es `vercel-labs/web-interface-guidelines/main/command.md`,
    which fails offline, behind a proxy, and in Lovable. That file is vendored to
    `references/web-interface-guidelines.md` and the skill now reads it first, treating the
    live URL as an optional freshness check.
11. **`AGENTS.md` rule cross-links were broken in both Vercel rule skills.** The compiled
    `AGENTS.md` copies links verbatim out of `rules/*.md`, where `./async-defer-await.md`
    resolves; at the skill root it does not. Those links now point at `rules/`. The two
    `_template.md` / `_sections.md` scaffolding files, `metadata.json` and each skill's
    authoring `README.md` were dropped — they only exist to compile the rules.

Deliberately not installed from these four repos:

- **vercel-labs**: `vercel-optimize`, `deploy-to-vercel`, `vercel-cli-with-tokens` — this site
  deploys to Netlify (`netlify.toml`). `react-native-skills` — no mobile app.
  `writing-guidelines` — a technical-docs voice guide; the copy here is marketing in three
  locales.
- **anthropics/skills**: `docx`, `pdf`, `pptx`, `xlsx`, `skill-creator`, `claude-api` are
  already available from the account's own synced skills, and the four document skills are
  source-available rather than open source, so vendoring them into a repo is the wrong move
  regardless. `theme-factory`, `canvas-design`, `brand-guidelines`, `web-artifacts-builder`,
  `algorithmic-art` duplicate `design-system` / `ui-ux-pro-max` / `ui-styling` / `brand`.
  `mcp-builder`, `slack-gif-creator`, `internal-comms`, `doc-coauthoring`, `academy-guide`,
  `discernment-nudge` are unrelated to this site.
- **accesslint**: `plugins/accesslint/.mcp.json` and `.claude-plugin/`. The skills call
  `npx @accesslint/*` directly and do not need the MCP server; installing it would add an MCP
  process to every session for no gain.

Three more came with the taste-skill and browserbase sets:

12. **Every `taste-skill` directory name disagreed with its own frontmatter.** Upstream ships
    `skills/soft-skill/SKILL.md` declaring `name: high-end-visual-design`, and so on for 10 of
    the 13. Claude Code keys a project skill on its directory, so each would have loaded under
    the wrong name or not at all — Browserbase's own validator treats the same mismatch as a
    hard error. Each is installed under its frontmatter name, which upstream's `CHANGELOG.md`
    calls the "install name" anyway: `soft-skill` → `high-end-visual-design`, `taste-skill` →
    `design-taste-frontend`, `output-skill` → `full-output-enforcement`, `brutalist-skill` →
    `industrial-brutalist-ui`, `minimalist-skill` → `minimalist-ui`, `redesign-skill` →
    `redesign-existing-projects`, `stitch-skill` → `stitch-design-taste`, `gpt-tasteskill` →
    `gpt-taste`, `image-to-code-skill` → `image-to-code`, `taste-skill-v1` →
    `design-taste-frontend-v1`. The other three already agreed. The repo's MIT `LICENSE` is
    copied into each as `LICENSE.txt`, matching how the browserbase skills ship.
13. **Three browserbase GTM skills wrote to somebody else's Desktop.** `event-prospecting`
    hardcoded `OUTPUT_DIR=/Users/jay/Desktop/…`, which on any non-macOS machine `mkdir -p`s a
    stranger's path at the filesystem root; `company-research` and `competitor-analysis` used
    `~/Desktop/…`, which does not exist in a headless container. All three now resolve
    `"$PWD/gtm-reports/…"` — a full literal path, which is what those skills require, without
    the `~`/`$HOME` expansion they explicitly forbid. `gtm-reports/` is gitignored alongside
    `seo-reports/`. The `{SKILL_DIR}` examples in `event-prospecting` were repointed off
    `/Users/jay/skills/` as well.
14. **`safe-browser` copied its template from a repo-root path.** Its quick-start ran
    `cp -R skills/safe-browser/templates/…`, correct only inside the upstream checkout; it now
    reads `.claude/skills/safe-browser/templates/…`, matching what `cookie-sync` already did.

Upstream's `skills/llms.txt` from taste-skill is installed as `taste-skill-llms.txt` — the name
`llms.txt` is already taken in this directory by the GSAP set's index.

Four of the requested sources were already installed and were left untouched, since the
local patches above would be lost by a re-clone: `nextlevelbuilder/ui-ux-pro-max-skill`,
`AgricIDaniel/claude-seo`, `dickwu/apple-design-skill`, `bencium/bencium-claude-code-design-skill`.
