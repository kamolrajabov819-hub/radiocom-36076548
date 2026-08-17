# canvas-fonts (not installed)

The upstream `ui-styling` skill ships ~5.5 MB of `.ttf` binaries here. They are used
only by the optional Python/PIL canvas renderer described in
`../references/canvas-design-system.md` — poster and social-image generation.

They are omitted from this project because Radiocom renders its UI with React +
Tailwind, never with PIL, so the fonts would be dead weight in the repo.

If you ever need the canvas renderer, restore them with:

```sh
git clone --depth 1 https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git /tmp/uiux
cp -R /tmp/uiux/.claude/skills/ui-styling/canvas-fonts/. .claude/skills/ui-styling/canvas-fonts/
```

Everything else in `ui-styling` — the shadcn/ui, Tailwind and theming references and
the `shadcn_add.py` / `tailwind_config_gen.py` scripts — is installed and works as-is.
