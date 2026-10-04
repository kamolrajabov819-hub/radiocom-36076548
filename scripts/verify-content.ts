/**
 * The long-form copy modules are held to the same rules as the locale JSONs.
 *
 * Long copy does not go in `src/i18n/*.json`: those files are eager (all three
 * are imported by `src/lib/i18n.ts`), so every string in them ships to every
 * visitor on every route, and `qa-weight`'s baseline is what pays. It lives in
 * `{ ru, en, uz }` modules that only a code-split page component imports —
 * `answers-content.ts` and everything under `src/data/copy/` (the industry
 * bodies are `copy/industries/<slug>.ts`).
 *
 * That move would quietly take the copy out from under `verify-i18n`, which
 * only reads the JSONs. So this script walks every such module and applies the
 * same rules to every `{ ru, en, uz }` value it finds:
 *
 *   1. every locale is present and non-empty — except a figure's unit (`.u`),
 *      which some figures do not have («IP67») and Uzbek folds into the
 *      figure itself («10 km gacha»);
 *   2. no Cyrillic in `en` or `uz` — an untranslated Russian sentence;
 *   3. `en`/`uz` are not materially shorter than `ru` (the 0.60 ratio
 *      `verify-i18n` gate 11 measured and documents), so no clause was lost;
 *   4. Uzbek uses the ASCII apostrophe the rest of the site uses (o', g', and
 *      the tutuq belgisi) — not ‘ ’ ʻ ʼ, which split one word into two spellings
 *      for search and for the reader. This rule also covers `uz.json`;
 *   5. every `[anchor](/path)` link in the copy points at a page in the
 *      sitemap, so an internal link can never be a 404.
 *
 * Its own script, not a gate in `verify-seo.ts`: that file sits just under the
 * size at which Bun's transpiler cache breaks it (see `verify-contacts.ts`).
 *
 * Run: bun scripts/verify-content.ts
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { answerContent } from "../src/data/answers-content";
import { entries } from "./lib/sitemap";

const COPY_DIR = join(import.meta.dir, "../src/data/copy");

type L = { ru: string; en: string; uz: string };

let failed = false;
const bad = (msg: string) => {
  console.error(`FAIL ${msg}`);
  failed = true;
};

const isL = (v: unknown): v is L =>
  !!v &&
  typeof v === "object" &&
  !Array.isArray(v) &&
  ["ru", "en", "uz"].every((k) => k in (v as object)) &&
  Object.keys(v as object).length === 3;

/** Every `{ ru, en, uz }` in a module, with a readable path to it. */
function collect(value: unknown, path: string, out: [string, L][]) {
  if (isL(value)) out.push([path, value]);
  else if (Array.isArray(value)) value.forEach((v, i) => collect(v, `${path}[${i}]`, out));
  else if (value && typeof value === "object")
    for (const [k, v] of Object.entries(value)) collect(v, `${path}.${k}`, out);
}

const modules: [string, unknown][] = [["answers-content", answerContent]];
// Everything under src/data/copy, subdirectories included (one module per
// industry lives in copy/industries/). `pick.ts` holds the type, not copy.
const walkDir = (dir: string, rel: string): string[] =>
  readdirSync(dir).flatMap((f) =>
    statSync(join(dir, f)).isDirectory()
      ? walkDir(join(dir, f), `${rel}${f}/`)
      : f.endsWith(".ts") && f !== "pick.ts"
        ? [`${rel}${f}`]
        : [],
  );
for (const file of walkDir(COPY_DIR, "")) {
  modules.push([`copy/${file}`, await import(join(COPY_DIR, file))]);
}

const strings: [string, L][] = [];
for (const [name, mod] of modules) collect(mod, name, strings);

const CYRILLIC = /[Ѐ-ӿ]/;
const CURLY = /[‘’ʻʼ]/;
const RATIO = 0.6;
const LINK = /\[([^\]]+)\]\(([^)]+)\)/g;
const livePaths = new Set(entries.map((e) => e.path));

const problems = { missing: [], cyrillic: [], short: [], curly: [], links: [] } as Record<
  string,
  string[]
>;
for (const [path, l] of strings) {
  const mayBeEmpty = path.endsWith(".u");
  for (const lang of ["ru", "en", "uz"] as const) {
    if (typeof l[lang] !== "string") problems.missing.push(`${path}.${lang}`);
    else if (!l[lang].trim() && !mayBeEmpty) problems.missing.push(`${path}.${lang}`);
  }
  for (const lang of ["en", "uz"] as const) {
    if (CYRILLIC.test(l[lang] ?? "")) problems.cyrillic.push(`${path}.${lang}: ${l[lang]}`);
    if (l.ru.length >= 40 && (l[lang] ?? "").length / l.ru.length < RATIO)
      problems.short.push(
        `${path}.${lang} is ${Math.round(((l[lang] ?? "").length / l.ru.length) * 100)}% of the Russian`,
      );
  }
  if (CURLY.test(l.uz ?? "")) problems.curly.push(`${path}.uz: ${l.uz}`);
  for (const lang of ["ru", "en", "uz"] as const) {
    for (const m of (l[lang] ?? "").matchAll(LINK)) {
      const target = m[2].split("#")[0];
      if (!livePaths.has(target)) problems.links.push(`${path}.${lang}: [${m[1]}](${m[2]})`);
    }
  }
}

// Rule 4 for the locale file itself, which `verify-i18n` does not check.
{
  const walk = (v: unknown, path: string) => {
    if (typeof v === "string") {
      if (CURLY.test(v)) problems.curly.push(`uz.json ${path}: ${v}`);
    } else if (v && typeof v === "object")
      for (const [k, x] of Object.entries(v)) walk(x, path ? `${path}.${k}` : k);
  };
  walk(JSON.parse(readFileSync(join(import.meta.dir, "../src/i18n/uz.json"), "utf8")), "");
}

const report = (key: string, what: string) => {
  const list = problems[key];
  if (list.length) bad(`${list.length} ${what}:\n     ${list.join("\n     ")}`);
};
report("missing", "copy string(s) missing a locale");
report("cyrillic", "en/uz string(s) containing Cyrillic — untranslated text");
report(
  "short",
  "translation(s) materially shorter than the Russian — a clause is probably missing",
);
report("curly", "Uzbek string(s) with a typographic apostrophe — use ASCII '");
report("links", "copy link(s) to a path that is not in the sitemap");

if (failed) process.exit(1);
console.log(
  `ok  ${strings.length} copy strings in ${modules.length} modules: all locales, no stray Cyrillic, ` +
    `none truncated, ASCII apostrophes in Uzbek, every link live`,
);
