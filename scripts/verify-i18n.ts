/**
 * Translation regression checks.
 *
 * Three defects motivated this script, all of which shipped silently:
 *
 *   1. `I18nextProvider` wrapped only <Outlet />, so the nav, contact block,
 *      footer, sticky CTA and lead form resolved against react-i18next's global
 *      default instance — the site chrome never changed language.
 *   2. Product `blurb` / `rangeCity` / `rangeOpen` were bare Russian strings in
 *      the data layer, so the catalogue and product pages stayed Russian in
 *      every locale.
 *   3. Page <title> and <description> were hardcoded Russian while hreflang told
 *      Google the three locales were distinct language versions.
 *
 * Every one of them renders a perfectly healthy-looking page, which is why they
 * survived review. These assertions are what would have caught them.
 *
 * Run: bun scripts/verify-i18n.ts
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { I18nextProvider, useTranslation } from "react-i18next";
import { getI18n, LANGS, type Lang } from "../src/lib/i18n";
import { products } from "../src/data/products";
import { pick, type L } from "../src/data/spec-dict";
import { OG_LOCALE, pageMeta, breadcrumbSchema, SITE_URL } from "../src/lib/seo";
import { productSchema } from "../src/lib/seo-product";

let fail = 0;
const bad = (m: string) => {
  console.log("FAIL " + m);
  fail++;
};

/* 1 ── key parity: the three files must expose the identical leaf-key set. */
const leaves = (o: unknown, prefix = ""): string[] =>
  o && typeof o === "object" && !Array.isArray(o)
    ? Object.entries(o as Record<string, unknown>).flatMap(([k, v]) =>
        leaves(v, prefix ? `${prefix}.${k}` : k),
      )
    : [prefix];

// Plural suffixes are language-specific by design — Russian carries
// one/few/many/other where English only has one/other — so parity is checked on
// the base key, not on the variants.
const base = (k: string) => k.replace(/_(zero|one|two|few|many|other)$/, "");

const keysets = Object.fromEntries(
  LANGS.map((l) => [
    l,
    new Set(leaves(JSON.parse(readFileSync(`src/i18n/${l}.json`, "utf8"))).map(base)),
  ]),
) as Record<Lang, Set<string>>;

for (const l of LANGS) {
  if (l === "ru") continue;
  for (const k of keysets.ru) if (!keysets[l].has(k)) bad(`${l}.json missing key ${k}`);
  for (const k of keysets[l]) if (!keysets.ru.has(k)) bad(`${l}.json has extra key ${k}`);
}
console.log(`ok  ${keysets.ru.size} keys present in all ${LANGS.length} locale files`);

/* 2 ── every meta.* string must actually differ per language. This is the check
       that fails the moment a page title is hardcoded again.

       Proper nouns are the one honest exception: a breadcrumb reading
       "Motorola" is "Motorola" in Russian, English and Uzbek, and inventing
       three spellings to satisfy a lint would put a wrong brand name in front
       of customers. Anything added here must be a name, never a phrase — if it
       contains a verb or an article it is copy, and copy gets translated. */
const PROPER_NOUNS = new Set(["meta.crumb.radiocom", "meta.crumb.motorola"]);

const identical: string[] = [];
for (const key of [...keysets.ru].filter((k) => k.startsWith("meta.") && !PROPER_NOUNS.has(k))) {
  const rendered = LANGS.map((l) =>
    getI18n(l).t(key, { count: 24, name: "X", blurb: "", price: "", range: "" }),
  );
  if (new Set(rendered).size !== LANGS.length) identical.push(key);
}
if (identical.length)
  bad(`meta keys not distinct across locales:\n     ${identical.join("\n     ")}`);
else
  console.log(
    `ok  every meta.* string is distinct in ru/en/uz (${PROPER_NOUNS.size} proper nouns exempt)`,
  );

/* 3 ── product copy in the data layer must be localised, not Russian everywhere. */
const flat = (v: L) => LANGS.map((l) => pick(v, l));
for (const p of products) {
  for (const [field, value] of [
    ["blurb", p.blurb],
    ["rangeCity", p.rangeCity],
    ...(p.rangeOpen ? ([["rangeOpen", p.rangeOpen]] as const) : []),
  ] as [string, L][]) {
    if (LANGS.some((l) => !value[l])) bad(`${p.id}.${field} missing a language`);
    if (new Set(flat(value)).size !== LANGS.length)
      bad(`${p.id}.${field} identical across locales`);
  }
}
console.log(`ok  ${products.length} products carry distinct ru/en/uz copy`);

/* 3b ── UI copy must differ per locale, not only meta.*.
       `home.bento.models.sub` shipped as "Motorola, Radiocom, Radiocom,
       Radiocom RC." in both en and uz — a find-and-replace that ran over the
       wrong words. Byte-identical in the two files, and so invisible to every
       check above.

       Two exemptions, both structural rather than a list of strings to
       maintain. `outcomes[].n` is the measured value of a stat ("ATEX",
       "99.9%", "15") sitting beside its translated label in `.l`, so it is
       meant to repeat. Short strings are codes and brand names. */
const strings = (o: unknown, prefix = ""): [string, string][] => {
  if (typeof o === "string") return [[prefix, o]];
  if (Array.isArray(o)) return o.flatMap((v, i) => strings(v, `${prefix}[${i}]`));
  if (o && typeof o === "object")
    return Object.entries(o).flatMap(([k, v]) => strings(v, prefix ? `${prefix}.${k}` : k));
  return [];
};

const byLang = Object.fromEntries(
  LANGS.map((l) => [l, new Map(strings(JSON.parse(readFileSync(`src/i18n/${l}.json`, "utf8"))))]),
) as Record<Lang, Map<string, string>>;

const isStatValue = (k: string) => /\.n$/.test(k);

let repeated = 0;
for (const [key, ruValue] of byLang.ru) {
  if (isStatValue(key) || ruValue.length <= 12) continue;
  const values = LANGS.map((l) => byLang[l].get(key));
  if (values.every((v) => v !== undefined) && new Set(values).size === 1) {
    bad(`${key} is byte-identical in all three locales: ${JSON.stringify(ruValue)}`);
    repeated++;
  }
}
if (!repeated) console.log(`ok  no untranslated UI string repeats across all 3 locales`);

/* 3c ── no Cyrillic outside ru. Catches the other half of a sloppy copy-paste:
       uz carried "1С" with a Cyrillic С where the Latin "1C" was meant, which
       looks identical on screen and sorts and searches differently. */
let cyrillic = 0;
for (const l of LANGS) {
  if (l === "ru") continue;
  for (const [key, value] of byLang[l]) {
    if (/[А-Яа-яЁё]/.test(value)) {
      bad(`${l}.json ${key} contains Cyrillic: ${JSON.stringify(value)}`);
      cyrillic++;
    }
  }
}
if (!cyrillic) console.log(`ok  no Cyrillic left in the en/uz locale files`);

/* 4 ── the fail-loud guard. With no instance registered as react-i18next's
       global default, a component rendered outside the provider must throw
       rather than quietly resolve against some other language. */
function Probe() {
  const { t } = useTranslation();
  return createElement("span", null, t("nav.catalog"));
}

// react-i18next warns and falls back to echoing the key rather than throwing.
// Either way the point holds: with no global default there is nothing for an
// unwrapped component to silently resolve against, so the mistake shows up as a
// raw key on screen instead of the wrong language.
const orphan = renderToStaticMarkup(createElement(Probe));
if (!orphan.includes("nav.catalog"))
  bad(
    `useTranslation() outside <I18nextProvider> rendered ${orphan} — a global default ` +
      `instance is registered again, which is what made the chrome bug silent`,
  );

for (const l of LANGS) {
  const html = renderToStaticMarkup(
    createElement(I18nextProvider, { i18n: getI18n(l) }, createElement(Probe)),
  );
  const expected = getI18n(l).t("nav.catalog");
  if (!html.includes(expected)) bad(`provider for ${l} rendered ${html}, expected ${expected}`);
}
console.log(
  "ok  useTranslation resolves through the provider only, and degrades to raw keys without one",
);

/* 5 ── structural: the provider must sit at the root, above the chrome.
       Comments are stripped first — these files explain the rule in prose, and
       matching the prose would make the check pass or fail for the wrong reason. */
const code = (path: string) =>
  readFileSync(path, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");

// `<LocaleProvider`, with the angle bracket, and not a bare name.
//
// This check used to look for the substring "I18nextProvider" anywhere in
// __root.tsx, and it was passing on a *dead import*: the actual mount moved
// into LocaleProvider when that component was extracted, and __root kept an
// unused `import { I18nextProvider }` line that satisfied the match. So the
// gate would have stayed green with the provider genuinely unmounted, and gone
// red on a correct tidy-up of the import. Rendering is the thing that matters,
// so rendering is what is asserted — on both halves of the pair.
if (!code("src/routes/__root.tsx").includes("<LocaleProvider"))
  bad("__root.tsx no longer renders <LocaleProvider> — the chrome will stop translating");
if (!code("src/components/LocaleProvider.tsx").includes("<I18nextProvider"))
  bad("LocaleProvider no longer renders <I18nextProvider> — nothing mounts i18n at all");
if (!code("src/components/LocaleProvider.tsx").includes("getI18n("))
  bad("LocaleProvider no longer builds its instance with getI18n(lang) — see check 4");
if (code("src/routes/$lang.tsx").includes("I18nextProvider"))
  bad(
    "$lang.tsx mounts I18nextProvider again; from there it wraps only <Outlet />, " +
      "leaving nav, contacts, footer and the lead form outside it",
  );
if (code("src/lib/i18n.ts").includes("initReactI18next"))
  bad("i18n.ts registers a global default instance again — see check 4");
console.log("ok  provider mounted at the root, above nav/contacts/footer");

/* 6 ── metadata and schema must carry the locale, not just the copy. */
for (const l of LANGS) {
  const meta = pageMeta({ lang: l, title: "T", description: "D", path: "/catalog" });
  const og = meta.find((m) => "property" in m && m.property === "og:locale") as { content: string };
  if (og?.content !== OG_LOCALE[l])
    bad(`${l}: og:locale is ${og?.content}, expected ${OG_LOCALE[l]}`);
  const url = meta.find((m) => "property" in m && m.property === "og:url") as { content: string };
  if (url?.content !== `${SITE_URL}/${l}/catalog`) bad(`${l}: og:url is ${url?.content}`);

  const crumb = breadcrumbSchema([{ name: "Radiocom", path: "/" }], l);
  if (crumb.itemListElement[0].item !== `${SITE_URL}/${l}`)
    bad(`${l}: breadcrumb points at ${crumb.itemListElement[0].item}, not the locale URL`);

  const prod = productSchema(products[0], l);
  if (!String(prod["@id"]).startsWith(`${SITE_URL}/${l}/`))
    bad(`${l}: product @id ${prod["@id"]} is missing the locale prefix`);
  if (prod.description !== pick(products[0].blurb, l))
    bad(`${l}: product schema description is not this locale's blurb`);
}
console.log("ok  og:locale, canonical URLs and JSON-LD are locale-correct");

/* ─────────────────────────────────────────────────────────────
   Every literal key a component asks for must exist.
   ───────────────────────────────────────────────────────────── */
// The existing checks compare the three locale files against each other, so a
// key that is missing from *all* of them passes: parity holds at zero. That is
// how `service.hero.sub` reached the brand page twice — i18next renders an
// unknown key as the key itself, so the page displayed the literal string
// "service.hero.sub" to visitors and no gate objected.
//
// Only literal `t("...")` calls can be checked. Template keys built at runtime
// (`t(\`industries.${slug}.name\`)) are skipped rather than guessed at.
{
  const ru = JSON.parse(readFileSync("src/i18n/ru.json", "utf8")) as Record<string, unknown>;
  const exists = (dotted: string) => {
    let node: unknown = ru;
    for (const part of dotted.split(".")) {
      if (typeof node !== "object" || node === null) return false;
      node = (node as Record<string, unknown>)[part];
      if (node === undefined) return false;
    }
    return true;
  };

  /**
   * A key counts as present if the literal exists, or if i18next would resolve
   * it through a plural form.
   *
   * `t("brand.models", { count })` is stored as `models_one` / `models_few` /
   * `models_many` with no bare `models`, which is correct i18next and used to
   * fail here as "absent from ru.json". Requiring a base key that i18next never
   * reads would mean either a redundant duplicate or no plurals at all.
   */
  const PLURAL_SUFFIXES = ["_zero", "_one", "_two", "_few", "_many", "_other"];
  const has = (dotted: string) =>
    exists(dotted) || PLURAL_SUFFIXES.some((suffix) => exists(dotted + suffix));

  const missing: string[] = [];
  const walk = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (/\.tsx?$/.test(e.name)) {
        const src = readFileSync(full, "utf8");
        for (const m of src.matchAll(/\bt\(\s*"([a-z][\w.]*?)"([^)]*)/gi)) {
          const key = m[1];
          // A namespace prefix with no dot is not an i18n path.
          if (!key.includes(".")) continue;
          // A call that supplies its own `defaultValue` renders that, not the
          // key, so a missing entry is intentional rather than a bug —
          // `poc.design.step_label` falls back to a zero-padded index.
          if (m[2].includes("defaultValue")) continue;
          if (!has(key)) {
            const line = src.slice(0, m.index).split("\n").length;
            missing.push(`${full}:${line} t("${key}")`);
          }
        }
      }
    }
  };
  walk("src");

  // Template keys: `t(`industries.${slug}.name`)`. The variable cannot be
  // resolved statically, but the shape can: every sibling under the prefix must
  // carry the suffix. That is what catches `industries.${slug}.title` — no
  // industry has a `title`, they have `name` — which the literal check above
  // cannot see and which shipped as visible raw text on every product page.
  const templateMissing: string[] = [];
  const walkTemplates = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name);
      if (e.isDirectory()) walkTemplates(full);
      else if (/\.tsx?$/.test(e.name)) {
        const src = readFileSync(full, "utf8");
        for (const m of src.matchAll(/\bt\(\s*`([\w.]+)\.\$\{[^}]+\}\.([\w.]+)`/g)) {
          const [, prefix, suffix] = m;
          let node: unknown = ru;
          for (const part of prefix.split(".")) {
            node =
              typeof node === "object" && node !== null
                ? (node as Record<string, unknown>)[part]
                : undefined;
          }
          if (typeof node !== "object" || node === null) continue; // prefix not a namespace
          const siblings = Object.values(node as Record<string, unknown>).filter(
            (v) => typeof v === "object" && v !== null,
          ) as Record<string, unknown>[];
          if (!siblings.length) continue;
          const without = siblings.filter((sib) => {
            let cur: unknown = sib;
            for (const part of suffix.split(".")) {
              cur =
                typeof cur === "object" && cur !== null
                  ? (cur as Record<string, unknown>)[part]
                  : undefined;
            }
            return cur === undefined;
          });
          // A majority rule, not "every sibling". The namespace can hold an
          // object that is not one of the interpolated entries — `industries`
          // also contains `offers`, which happens to have a `title` — so
          // demanding that *no* sibling carries the suffix let
          // `industries.${slug}.title` through even though none of the six
          // actual industries has one. Fewer than half carrying it means the
          // key is wrong for the set being iterated.
          if (without.length * 2 > siblings.length) {
            const line = src.slice(0, m.index).split("\n").length;
            templateMissing.push(
              `${full}:${line} t(\`${prefix}.\${...}.${suffix}\`) — no entry under ${prefix} has "${suffix}"`,
            );
          }
        }
      }
    }
  };
  walkTemplates("src");
  missing.push(...templateMissing);

  /*
   * Keys stored as data, not written as `t("...")`.
   *
   * `Brand.tsx` keeps its five "why us" cards as a table of `{ eyebrow, title,
   * detail }` triples whose values are key *strings*, then renders them with
   * `t(c.detail)`. That is the right shape — it stops a card's heading and its
   * disclosure text drifting apart — but it puts the key out of reach of the
   * literal check above, and `detail: "tradein.sub"` shipped to production on
   * both brand pages in all three locales. The reader saw the characters
   * "tradein.sub"; the real key is `tradein.desc`.
   *
   * The heuristic: a string literal that looks like a dotted key path, in a
   * file that calls `t()`, must resolve. Deliberately conservative — it wants
   * at least one dot and only lowercase segments, so CSS classes, file paths
   * and sentences are not candidates.
   */
  const KEY_SHAPE = /^[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*){1,3}$/;
  const walkDataKeys = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name);
      if (e.isDirectory()) {
        walkDataKeys(full);
        continue;
      }
      if (!/\.tsx?$/.test(e.name)) continue;
      const src = readFileSync(full, "utf8");
      if (!/\bt\(/.test(src)) continue;
      for (const m of src.matchAll(/"([a-z][a-z0-9_.]{4,60})"/g)) {
        const key = m[1];
        if (!KEY_SHAPE.test(key)) continue;
        // Only strings that sit in a `key:`-style position — a bare dotted
        // string elsewhere is far more likely to be a path or a MIME type.
        const before = src.slice(Math.max(0, m.index - 40), m.index);
        if (!/[:=]\s*$/.test(before)) continue;
        if (has(key)) continue;
        // A namespace prefix used with template interpolation resolves at
        // runtime; those are the template check's business, not this one.
        if (new RegExp("`" + key.split(".")[0] + "\\.").test(src)) continue;
        const line = src.slice(0, m.index).split("\n").length;
        missing.push(`${full}:${line} "${key}" is stored as a key but is absent from ru.json`);
      }
    }
  };
  walkDataKeys("src");

  if (missing.length)
    bad(
      `${missing.length} t() call(s) reference a key absent from ru.json — these render as the raw key:\n     ` +
        missing.join("\n     "),
    );
  else console.log("ok  every literal t() key resolves against ru.json");
}

/* ─────────────────────────────────────────────────────────────
   11. A translation must not be materially shorter than its source.

   Key parity is green and always was, which is exactly why this went
   unnoticed: every key existed in all three files, and 54 of the Uzbek values
   had quietly dropped a clause or a whole sentence. "Отели, рестораны,
   события. Скрытые гарнитуры, чистый эфир." shipped as "Mehmonxona, restoran,
   tadbirlar." — the second sentence, and the actual product claim, simply gone.
   A reader in Uzbek got a thinner page than a reader in Russian, on a site
   where Uzbek is the national language.

   Uzbek and English both run *longer* than Russian for the same meaning, so a
   translation coming out at well under its source's length is not compression —
   it is missing text.

   The threshold is measured, not guessed, and the first attempt at it was too
   lax to catch the very string that motivated the check: 0.55 passed the
   truncated horeca line at 0.561. Across the corrected file the shortest
   *legitimate* case is 0.636 ("Главный инженер, горнодобывающее предприятие" →
   "Bosh muhandis, kon korxonasi", where Uzbek really is that much tighter), and
   the truncation sat at 0.561, so 0.60 separates them with headroom on both
   sides. Strings under 40 characters are skipped entirely — those are labels,
   where one word against three says nothing about completeness.
   ───────────────────────────────────────────────────────────── */
{
  const RATIO = 0.6;
  const problems: string[] = [];
  for (const lang of ["en", "uz"] as const) {
    for (const [key, ru] of byLang.ru) {
      // Short strings are labels, where a single word in one language against
      // three in another is normal and says nothing about completeness.
      if (ru.length < 40) continue;
      const other = byLang[lang].get(key);
      if (!other) continue;
      const ratio = other.length / ru.length;
      if (ratio < RATIO)
        problems.push(
          `${lang}.${key} is ${Math.round(ratio * 100)}% the length of the Russian — a clause is probably missing\n` +
            `       ru: ${ru}\n` +
            `       ${lang}: ${other}`,
        );
    }
  }
  if (problems.length)
    bad(`${problems.length} translation(s) look truncated:\n     ` + problems.join("\n     "));
  else console.log("ok  no translation is materially shorter than its Russian source");
}

console.log(fail === 0 ? "\nALL I18N CHECKS PASSED" : `\n${fail} FAILURES`);
process.exit(fail ? 1 : 0);
