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
 * Two checks, both cheap and both static:
 *
 *   1. No source file may synthesise an image URL by string manipulation.
 *      Every responsive variant must be a real `import`, which is what makes
 *      Vite emit and fingerprint it.
 *   2. Every `@800` sibling referenced by an import must exist on disk, and
 *      every `ProductShot` call passing `srcSmall` must pass an identifier
 *      (an import binding) rather than a computed expression.
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

if (errors.length) {
  console.error(`\nverify-assets: ${errors.length} problem(s)\n`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error("");
  process.exit(1);
}
console.log("verify-assets: ok — no synthesised image URLs, all imports resolve");
