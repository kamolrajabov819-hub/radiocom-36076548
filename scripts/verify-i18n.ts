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

import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { I18nextProvider, useTranslation } from "react-i18next";
import { getI18n, LANGS, type Lang } from "../src/lib/i18n";
import { products } from "../src/data/products";
import { pick, type L } from "../src/data/spec-dict";
import { OG_LOCALE, pageMeta, breadcrumbSchema, productSchema, SITE_URL } from "../src/lib/seo";

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

if (!code("src/routes/__root.tsx").includes("I18nextProvider"))
  bad("__root.tsx no longer mounts I18nextProvider — the chrome will stop translating");
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

console.log(fail === 0 ? "\nALL I18N CHECKS PASSED" : `\n${fail} FAILURES`);
process.exit(fail ? 1 : 0);
