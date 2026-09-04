/**
 * Every product named in the copy is one the catalogue actually sells.
 *
 * Twice now the site has sold something that does not exist. `meta.service`
 * advertised **Vertex Standard** repair; the brand and HoReCa copy sold
 * **Motorola CLP 446 / CLK 446** with exact figures — 7400 m² of coverage, 68 g.
 * None of the three is in `products.ts`, and the figures came from nowhere. Both
 * were caught by reading, which is not a method that scales to 475 strings in
 * three languages.
 *
 * A customer who reads "we service Vertex" and carries one in has been told
 * something untrue by the company. Care in the next round does not prevent the
 * third instance, so it is checked instead.
 *
 * **Precision came from measuring before writing.** A model-code shape
 * (`[A-Z]{1,6}` then digits) across all three locales matches exactly ten tokens:
 * five real models and five standards — AES-256, IP67, PMR446 and spelling
 * variants of those. Naming the five standards is the entire allowlist, so this
 * runs with no false positives rather than a wall of them that teaches people to
 * skip it.
 *
 * **Why this is not in `verify-seo.ts`, where it belongs.** It was, and it broke
 * the file: Bun 1.3.11 dies on that script's import graph past a certain size,
 * abandoning the run before any check executes and reporting a parse error in
 * `rcd-70-hero.webp`, a WebP image it decided was JavaScript. `verify-snippets.ts`
 * was split out of the same file for the same reason and documents the
 * diagnosis. This file therefore imports `products.ts` and nothing else, and
 * reads the locale files as text.
 *
 * Run: bun scripts/verify-models.ts
 */
import { readFileSync, readdirSync } from "node:fs";
import { visibleProducts } from "../src/data/products";

/**
 * Every way a *sellable* model is written: full name, slug, each word of the name.
 *
 * `visibleProducts`, not `products` — and that distinction is the check.
 * Mutation-testing this file with the original CLP 446 copy restored, it passed:
 * `products.ts` still holds `clp446` and `clk446` as hidden entries, so checking
 * against the full list vouched for the exact copy the check exists to catch.
 * A hidden product is one the site does not sell, which is the whole point of
 * hiding it; naming one in customer-facing copy is the same promise as naming a
 * make nobody stocks.
 */
const known = new Set<string>();
for (const p of visibleProducts) {
  for (const form of [p.name, p.slug]) {
    known.add(form.toUpperCase());
    known.add(form.toUpperCase().replace(/[-\s]/g, ""));
  }
  // "RCD-70 PRO" is written as bare "RCD-70" throughout the copy.
  for (const part of p.name.toUpperCase().split(/\s+/)) known.add(part);
}

/** Not models: radio standards, ingress ratings and ciphers. */
const STANDARDS = new Set(["AES-256", "AES256", "IP67", "IP55", "IPX4", "PMR-446", "PMR446"]);

/**
 * Radio makes the catalogue does not carry.
 *
 * Naming one in customer-facing copy is selling it. Vertex is on the list
 * because it was on the site.
 */
const NOT_SOLD = [
  "Vertex",
  "Hytera",
  "Kenwood",
  "Icom",
  "Baofeng",
  "Retevis",
  "Yaesu",
  "Midland",
  "Alinco",
  "Entel",
  "Sepura",
  "Tait",
];

// The locale list comes from the directory, so a fourth language is covered the
// day it is added rather than the day someone remembers this file.
const locales = readdirSync("src/i18n")
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""));

const strings: { key: string; text: string }[] = [];
for (const lang of locales) {
  const walk = (node: unknown, path: string) => {
    if (typeof node === "string") strings.push({ key: `${lang}:${path}`, text: node });
    else if (Array.isArray(node)) node.forEach((v, i) => walk(v, `${path}.${i}`));
    else if (node && typeof node === "object")
      for (const [k, v] of Object.entries(node)) walk(v, path ? `${path}.${k}` : k);
  };
  walk(JSON.parse(readFileSync(`src/i18n/${lang}.json`, "utf8")), "");
}

const CODE = /\b[A-Z]{1,6}[- ]?\d{2,4}(?:[A-Z0-9]{0,4})?\b/g;
const unknown = new Map<string, string>();
const foreign = new Map<string, string>();

for (const { key, text } of strings) {
  for (const raw of text.match(CODE) ?? []) {
    const token = raw.toUpperCase().replace(/\s+/g, "-");
    if (STANDARDS.has(token)) continue;
    if (
      known.has(token) ||
      known.has(token.replace(/-/g, "")) ||
      known.has(token.replace(/-/g, " "))
    )
      continue;
    if (!unknown.has(token)) unknown.set(token, key);
  }
  for (const make of NOT_SOLD) {
    if (new RegExp(`\\b${make}\\b`, "i").test(text) && !foreign.has(make)) foreign.set(make, key);
  }
}

const lines = [
  ...[...unknown].map(([t, k]) => `${t} — model-shaped, not in products.ts (${k})`),
  ...[...foreign].map(([m, k]) => `${m} — a make the catalogue does not carry (${k})`),
];

if (lines.length) {
  console.log(
    `FAIL copy names ${lines.length} product(s) the catalogue does not have:\n     ` +
      lines.join("\n     ") +
      "\n\n     Add it to products.ts, or take it out of the copy. If it is a standard\n" +
      "     rather than a model, add it to STANDARDS in this file.",
  );
  process.exit(1);
}

console.log(
  `ok  every model named in copy across ${locales.length} locales is in products.ts` +
    ` (${strings.length} strings scanned)`,
);
