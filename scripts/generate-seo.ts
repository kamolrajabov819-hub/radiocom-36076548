/**
 * Generates public/sitemap.xml and public/robots.txt from the real catalogue data.
 *
 * Run by `bun run build` before vite, so a new model or industry lands in the
 * sitemap the moment it ships — there is no second list to keep in step.
 * Run standalone with: bun scripts/generate-seo.ts
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
// `visibleProducts` for the sitemap and llms.txt — a hidden model must not be
// advertised as an indexable page. `products` (the full record) is still used
// for the redirect map below, because a hidden model's old /catalog URL is
// already indexed and must keep resolving.
import { legacyCatalogTarget, products, visibleProducts } from "../src/data/products";
import { SITE_URL, LANGS, localePath, productPath } from "../src/lib/seo";
import { entries, renderSitemap } from "./lib/sitemap";

// The page list and the XML renderer now live in `scripts/lib/sitemap.ts`,
// shared with the post-build finalizer. See that file for why the image
// extension cannot be written in this pass.
//
// No resolver is passed: at this point in the build a product's `image` is
// still the filesystem path Bun resolved the import to, not the fingerprinted
// URL the page will serve. `finalize-sitemap.ts` writes the image-enriched
// version over the build output once vite has produced the hashed names.
const sitemap = renderSitemap(entries);

// AI crawlers are allowed deliberately: for a regional B2B catalogue, being quotable
// by ChatGPT, Perplexity and AI Overviews is a channel, not a leak. Everything here
// is public product information.
const robots = `User-agent: *
Allow: /

# Lead-capture and function endpoints hold nothing indexable.
Disallow: /api/
Disallow: /.netlify/

# AI answer engines — explicitly welcome.
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml

# Machine-readable site summaries, one per locale.
# ${SITE_URL}/llms.txt (ru) · ${SITE_URL}/llms.en.txt · ${SITE_URL}/llms.uz.txt
`;

// llms.txt — the emerging convention for telling AI answer engines what a site
// is and where its canonical facts live. Generated from the same catalogue data
// so model counts and names cannot drift from the site.
const byBrand = visibleProducts.reduce<Record<string, typeof products>>((acc, p) => {
  (acc[p.brand] ??= []).push(p);
  return acc;
}, {});

// One file per locale. The Russian-only version described a trilingual site in
// a single language, so an answer engine asked in Uzbek or English had no
// catalogue to read — the /en and /uz halves of the site were invisible to the
// surface this file exists to serve.
const LLMS_COPY = {
  ru: {
    summary:
      "Официальный поставщик профессиональных и любительских радиостанций в Узбекистане.\n" +
      "> 11 лет на рынке, 10 000+ клиентов. Продажа, аренда, авторизованный сервис и\n" +
      "> проектирование систем радиосвязи. Офис и сервисный центр в Ташкенте.",
    languages: "Языки: русский, английский, узбекский. Канонический язык — русский.",
    contacts: "## Контакты",
    address: "- Адрес: ул. Узбекистон Овози, 2, Ташкент, Узбекистан",
    phone: "- Телефон: +998 78 113-16-18",
    hours: "- Часы работы: Пн-Пт 09:00-18:00",
    catalogue: (n: number) => `## Каталог (${n} моделей)`,
    sections: "## Разделы",
    range: (v: string) => `Дальность ${v}.`,
    note:
      "## Примечание о дальности\nУказанная дальность рассчитана при прямой видимости и оптимальной погоде.\n" +
      "Фактическая зависит от рельефа, погоды, электромагнитных помех и препятствий.",
  },
  en: {
    summary:
      "Authorised supplier of professional and consumer two-way radios in Uzbekistan.\n" +
      "> 11 years in business, 10,000+ customers. Sales, rental, authorised service and\n" +
      "> radio network design. Office and service centre in Tashkent.",
    languages: "Languages: Russian, English, Uzbek. Russian is the canonical language.",
    contacts: "## Contacts",
    address: "- Address: Uzbekiston Ovozi 2, Tashkent, Uzbekistan",
    phone: "- Phone: +998 78 113-16-18",
    hours: "- Opening hours: Mon-Fri 09:00-18:00",
    catalogue: (n: number) => `## Catalogue (${n} models)`,
    sections: "## Sections",
    range: (v: string) => `Range ${v}.`,
    note:
      "## A note on range\nQuoted range assumes line of sight and good conditions.\n" +
      "Actual range depends on terrain, weather, interference and obstructions.",
  },
  uz: {
    summary:
      "O'zbekistonda professional va havaskor radiostansiyalarning rasmiy yetkazib beruvchisi.\n" +
      "> Bozorda 11 yil, 10 000+ mijoz. Savdo, ijara, vakolatli servis va radioaloqa\n" +
      "> tizimlarini loyihalash. Ofis va servis markazi Toshkentda.",
    languages: "Tillar: rus, ingliz, o'zbek. Kanonik til — rus tili.",
    contacts: "## Kontaktlar",
    address: "- Manzil: O'zbekiston Ovozi 2, Toshkent, O'zbekiston",
    phone: "- Telefon: +998 78 113-16-18",
    hours: "- Ish vaqti: Du-Ju 09:00-18:00",
    catalogue: (n: number) => `## Katalog (${n} model)`,
    sections: "## Bo'limlar",
    range: (v: string) => `Masofa ${v}.`,
    note:
      "## Masofa haqida izoh\nKo'rsatilgan masofa to'g'ridan-to'g'ri ko'rinish va qulay ob-havoda hisoblangan.\n" +
      "Haqiqiy masofa relyef, ob-havo, elektromagnit shovqin va to'siqlarga bog'liq.",
  },
} as const;

const llmsFor = (lang: (typeof LANGS)[number]) => {
  const c = LLMS_COPY[lang];
  return `# Radiocom

> ${c.summary}

${c.languages}
${LANGS.map((l) => `- ${SITE_URL}/${l}`).join("\n")}

${c.contacts}
${c.address}
${c.phone}
${c.hours}

${c.catalogue(visibleProducts.length)}
${Object.entries(byBrand)
  .map(
    ([brand, list]) =>
      `### ${brand}\n` +
      list
        .map(
          (p) =>
            `- [${p.name}](${SITE_URL}/${lang}${productPath(p)}) — ${p.blurb[lang]} ${c.range(
              p.rangeCity[lang],
            )}`,
        )
        .join("\n"),
  )
  .join("\n\n")}

${c.sections}
${entries
  // Section list only: the per-model URLs are already listed above, and
  // repeating 48 of them here would bury the six pages that describe what the
  // business actually does.
  .filter((e) => !/^\/(radiocom|motorola)\//.test(e.path))
  .map((e) => `- ${SITE_URL}/${lang}${e.path === "/" ? "" : e.path}`)
  .join("\n")}

${c.note}
`;
};

/* ─────────────────────────────────────────────────────────────
   netlify.toml — the 301 map for the retired /catalog tree
   ─────────────────────────────────────────────────────────────

   One rule per locale for the index, plus one per product per locale, derived
   from the same `products` array the sitemap and the router use. Hand-writing
   72 product rules would guarantee drift the first time a model is renamed.

   These are a **secondary** copy. The authoritative redirects live in the
   router (the catalog.* files under src/routes), because netlify.toml declares
   `publish = "dist"` while the build emits to `.output/` — so this table may
   not be applied at all. Emitting it anyway costs nothing and covers the case
   where the publish directory is corrected later.
*/
const REDIRECT_MARK = "# --- generated:catalog-301 ---";

const redirectRules = [
  ...LANGS.map((l) => ({ from: `/${l}/catalog`, to: `/${l}/radiocom` })),
  // `legacyCatalogTarget` decides the destination, shared with the two router
  // redirect routes — a hidden model's product page 404s, so pointing its old
  // catalogue URL there produced a 301 -> 404 chain. Both tables must agree,
  // and they can only agree by asking the same function.
  ...LANGS.flatMap((l) =>
    products.map((p) => {
      const target = legacyCatalogTarget(p.id);
      return {
        from: `/${l}/catalog/${p.id}`,
        to:
          target && "model" in target
            ? `/${l}/${target.brand}/${target.model}`
            : `/${l}/${target?.brand ?? "radiocom"}`,
      };
    }),
  ),
];

const redirectBlock = [
  REDIRECT_MARK,
  "# Generated by scripts/generate-seo.ts. Do not hand-edit: rerun the script.",
  "# Authoritative copies of these live in the router — see the note above.",
  ...redirectRules.flatMap((r) => [
    "",
    "[[redirects]]",
    `  from = "${r.from}"`,
    `  to = "${r.to}"`,
    "  status = 301",
    "  force = true",
  ]),
  "",
  REDIRECT_MARK,
].join("\n");

const tomlPath = "netlify.toml";
const existingToml = await readFile(tomlPath, "utf8");
const marked = new RegExp(`${REDIRECT_MARK}[\\s\\S]*?${REDIRECT_MARK}`);
const nextToml = marked.test(existingToml)
  ? existingToml.replace(marked, redirectBlock)
  : `${existingToml.trimEnd()}\n\n${redirectBlock}\n`;
await writeFile(tomlPath, nextToml, "utf8");

await mkdir("public", { recursive: true });
await writeFile("public/sitemap.xml", sitemap, "utf8");
await writeFile("public/robots.txt", robots, "utf8");
// Russian stays at /llms.txt (the conventional location); the other two sit
// beside it and are advertised from robots.txt.
await writeFile("public/llms.txt", llmsFor("ru"), "utf8");
for (const l of LANGS) await writeFile(`public/llms.${l}.txt`, llmsFor(l), "utf8");
console.log(
  `seo: wrote public/sitemap.xml (${entries.length} pages x ${LANGS.length} locales = ${entries.length * LANGS.length} urls) plus robots.txt and llms.txt`,
);
