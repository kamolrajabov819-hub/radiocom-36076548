# Project design skills

Sixteen design/UX skills vendored into this repo as **project skills**. Claude Code
discovers anything at `.claude/skills/<name>/SKILL.md` automatically at session start —
nothing to install per machine, and they travel with the repo (including to Lovable).

Invoke one by name (`/design-audit`, `/apple-design`, …) or just describe the work and let
the matching skill trigger on its own.

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

## Sources

| Source | Skills taken |
| --- | --- |
| [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | `ui-ux-pro-max`, `ui-styling`, `design`, `design-system`, `brand`, `banner-design`, `slides` |
| [bencium/bencium-claude-code-design-skill](https://github.com/bencium/bencium-claude-code-design-skill) | `bencium-impact-designer`, `bencium-innovative-ux-designer`, `bencium-controlled-ux-designer`, `design-audit`, `ui-typography`, `renaissance-architecture` |
| [emilkowalski/skills](https://github.com/emilkowalski/skills/tree/main/skills/apple-design) | `apple-design` |
| [dickwu/apple-design-skill](https://github.com/dickwu/apple-design-skill) | `apple-design-hig` |
| uploaded `aphloappledesign.zip` | `apple-design-web` |

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

Skills from the bencium repo that are not design work were left out deliberately:
`bencium-code-conventions` (another developer's personal style rules, which would conflict
with this project's), `bencium-aeo`, `adaptive-communication`, `human-architect-mindset`,
`negentropy-lens`, `vanity-engineering-review`, `relationship-design`, `insurgent-campaign`,
`eu-ai-act-reviewer`, `hungarian-humanizer`, and the `emotion-statusline` hook. They are one
`cp -R` away from the upstream clone if wanted.
