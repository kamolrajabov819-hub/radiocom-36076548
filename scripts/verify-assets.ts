/**
 * Asset integrity gate. Runs inside `bun run verify`, which `build` calls.
 *
 * Guards the exact bug that shipped broken images to production: `ProductShot`
 * derived its `srcSet` small-variant URL by running a regex over `src`. Because
 * `src` is a Vite-fingerprinted URL by then, the derived URL never matched a
 * real artefact, and because nothing *imported* the `@800` files Vite never
 * emitted them either. Per the HTML spec an `<img>` whose selected `srcset`
 * candidate 404s goes to its broken state and does NOT fall back to `src`.
 *
 * Four checks, all cheap and all static:
 *
 *   1. No source file may synthesise an image URL by string manipulation.
 *      Every responsive variant must be a real `import`, which is what makes
 *      Vite emit and fingerprint it.
 *   2. Every `@800` sibling referenced by an import must exist on disk, and
 *      every `ProductShot` call passing `srcSmall` must pass an identifier
 *      (an import binding) rather than a computed expression.
 *   3. Every visible product carries a non-empty `image`. A `hidden` entry is
 *      allowed the empty string — that is how a model with no photograph keeps
 *      its /catalog 301 alive — but a *visible* one with `image: ""` renders a
 *      card with a broken glyph where the radio should be, and nothing else in
 *      the toolchain notices: `qa-images` only loads the routes it knows, and
 *      `verify-seo` gate 21 checks the OG card, not the page.
 *   4. Every file in `src/assets/catalog` is imported by `products.ts`, and
 *      no `*-device.webp` survives there. Those were the
 *      radio cropped back out of a kit flat-lay, for the five Radiocom models
 *      that had no product shot of their own. They are portrait crops, so the
 *      variant pipeline — which scales by the longest edge — gave them an
 *      `@800` only 224px wide, and the call site had to suppress `srcSet`
 *      entirely to avoid lying to the browser. The 15.09.26 shoot gave all five
 *      a real front shot; this stops the workaround coming back.
 *
 * Run: bun scripts/verify-assets.ts
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, relative, dirname, resolve } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const SRC = join(ROOT, "src");

const errors: string[] = [];

function walk(dir: string, acc: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(ts|tsx)$/.test(e.name)) acc.push(p);
  }
  return acc;
}

/** Patterns that build an image URL out of another string at runtime. */
const SYNTHESIS = [
  {
    // .replace(/\.webp$/, "@800.webp") and friends
    re: /\.replace\(\s*\/[^/]*\\?\.(webp|png|jpe?g|avif)[^/]*\/[a-z]*\s*,/gi,
    why: "derives an image URL with .replace() — import the variant instead",
  },
  {
    // `${src}@800.webp` / src + "@800.webp"
    re: /(?:\$\{[^}]*\}|["'`]\s*\+\s*\w+\s*\+\s*["'`])?@\d+\.(webp|png|jpe?g|avif)/gi,
    why: "interpolates a @Nx variant into a string — import the variant instead",
  },
];

for (const file of walk(SRC)) {
  const rel = relative(ROOT, file);
  const text = readFileSync(file, "utf8");

  // Check 1 — no string-built image URLs. Comments are stripped first so the
  // explanatory prose in ProductShot.tsx does not trip its own guard.
  const code = text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

  for (const { re, why } of SYNTHESIS) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(code))) {
      // An `import … from "…@800.webp"` is the correct form, not a violation.
      const line = code.slice(0, m.index).split("\n").length;
      const lineText = code.split("\n")[line - 1] ?? "";
      if (/^\s*import\s/.test(lineText)) continue;
      errors.push(`${rel}:${line} — ${why}\n      ${lineText.trim()}`);
    }
  }

  // Check 2 — every imported asset resolves to a real file.
  const imp = /^\s*import\s+\w+\s+from\s+["'](.+?\.(?:webp|png|jpe?g|avif))["']/gm;
  let m: RegExpExecArray | null;
  while ((m = imp.exec(text))) {
    const spec = m[1];
    const abs = spec.startsWith("@/") ? join(SRC, spec.slice(2)) : resolve(dirname(file), spec);
    if (!existsSync(abs)) {
      const line = text.slice(0, m.index).split("\n").length;
      errors.push(`${rel}:${line} — imports a missing asset: ${spec}`);
    }
  }

  // Check 3 — no image may come back as a CDN pointer.
  //
  // Every product photograph used to be a `.asset.json` file resolving to
  // radiocom.lovable.app. That made the whole catalogue depend on a host
  // outside this repository, and it made responsive variants impossible,
  // because the bytes were somewhere else. They are all real files now. An
  // import of a `.asset.json` would silently reintroduce both problems.
  if (/from\s+["'][^"']*\.asset\.json["']/.test(text)) {
    const line = text.split("\n").findIndex((l) => /\.asset\.json/.test(l)) + 1;
    errors.push(
      `${rel}:${line} — imports a .asset.json CDN pointer; commit the real image instead`,
    );
  }

  // Check 3 — srcSmall must be an identifier, never an expression.
  const ss = /srcSmall=\{([^}]*)\}/g;
  while ((m = ss.exec(text))) {
    const expr = m[1].trim();
    if (!/^[A-Za-z_$][\w$.]*$/.test(expr)) {
      const line = text.slice(0, m.index).split("\n").length;
      errors.push(`${rel}:${line} — srcSmall must be an imported binding, got: ${expr}`);
    }
  }
}

/* ── Check 4 — every visible product has a photograph ──────────────────── */
{
  const { products } = await import("../src/data/products");
  for (const p of products) {
    if (p.hidden) continue;
    if (!p.image || p.image.trim() === "")
      errors.push(
        `src/data/products.ts — "${p.id}" is visible but has an empty image; ` +
          `give it a photograph or mark it hidden`,
      );
  }
}

/* ── Check 6 — no orphan photography in the catalogue ──────────────────── */
{
  // The reverse of Check 2: that one proves every import resolves to a file,
  // this one proves every file is reached by an import. Eighteen stems had gone
  // stale without anyone noticing — superseded heroes, `-alt` frames that were
  // never wired up, and the `-device` crops — 54 files that shipped in every
  // clone and rendered nowhere. Orphans are cheap to create and invisible
  // without a check, so this is the check.
  const dir = join(SRC, "assets", "catalog");
  if (existsSync(dir)) {
    const src = readFileSync(join(SRC, "data", "products.ts"), "utf8");
    const imported = new Set(
      [...src.matchAll(/from\s+["']@\/assets\/catalog\/([^"']+)["']/g)].map((m) => m[1]),
    );
    for (const f of readdirSync(dir)) {
      if (!f.endsWith(".webp") || imported.has(f)) continue;
      errors.push(
        `src/assets/catalog/${f} — on disk but imported by nothing. ` +
          `Wire it into products.ts or delete it`,
      );
    }
  }
}

/* ── Check 5 — the device-crop workaround stays retired ────────────────── */
{
  const dir = join(SRC, "assets", "catalog");
  if (existsSync(dir)) {
    const strays = readdirSync(dir).filter((f) => /-device(@\d+)?\.webp$/.test(f));
    for (const f of strays)
      errors.push(
        `src/assets/catalog/${f} — a '-device' crop is back. Every model has a ` +
          `real '-hero' from build-catalog-photos.ts; use that instead`,
      );
  }
}

if (errors.length) {
  console.error(`\nverify-assets: ${errors.length} problem(s)\n`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error("");
  process.exit(1);
}
console.log(
  "verify-assets: ok — no synthesised image URLs, all imports resolve, " +
    "every visible product has a photograph",
);
