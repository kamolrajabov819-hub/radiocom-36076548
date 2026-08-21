/**
 * Generates public/sitemap.xml and public/robots.txt from the real catalogue data.
 *
 * Run by `bun run build` before vite, so a new model or industry lands in the
 * sitemap the moment it ships — there is no second list to keep in step.
 * Run standalone with: bun scripts/generate-seo.ts
 */

import { mkdir, writeFile } from "node:fs/promises";
import { products } from "../src/data/products";
import { INDUSTRY_SLUGS } from "../src/data/industries";
import { SITE_URL, LANGS, DEFAULT_SEO_LANG, localePath } from "../src/lib/seo";

type Entry = { path: string; changefreq: string; priority: string };

const entries: Entry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/catalog", changefreq: "weekly", priority: "0.9" },
  { path: "/poc", changefreq: "monthly", priority: "0.8" },
  { path: "/service", changefreq: "monthly", priority: "0.8" },
  { path: "/industries", changefreq: "monthly", priority: "0.7" },
  ...INDUSTRY_SLUGS.map((slug) => ({
    path: `/industries/${slug}`,
    changefreq: "monthly",
    priority: "0.7",
  })),
  // Product pages carry the long-tail model queries — the highest-intent traffic.
  ...products.map((p) => ({
    path: `/catalog/${p.id}`,
    changefreq: "weekly",
    priority: "0.8",
  })),
];

const lastmod = new Date().toISOString().slice(0, 10);

// Every page is emitted once per locale, and each entry advertises the full
// alternate set including itself — Google discards an hreflang cluster whose
// members do not all point at each other.
const urls = entries.flatMap((e) =>
  LANGS.map((lang) => {
    const alternates = [
      ...LANGS.map(
        (l) =>
          `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE_URL}${localePath(l, e.path)}"/>`,
      ),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${localePath(DEFAULT_SEO_LANG, e.path)}"/>`,
    ].join("\n");

    return (
      `  <url>\n` +
      `    <loc>${SITE_URL}${localePath(lang, e.path)}</loc>\n` +
      `${alternates}\n` +
      `    <lastmod>${lastmod}</lastmod>\n` +
      `    <changefreq>${e.changefreq}</changefreq>\n` +
      `    <priority>${e.priority}</priority>\n` +
      `  </url>`
    );
  }),
);

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
  `        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
  urls.join("\n") +
  `\n</urlset>\n`;

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
const byBrand = products.reduce<Record<string, typeof products>>((acc, p) => {
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

${c.catalogue(products.length)}
${Object.entries(byBrand)
  .map(
    ([brand, list]) =>
      `### ${brand}\n` +
      list
        .map(
          (p) =>
            `- [${p.name}](${SITE_URL}/${lang}/catalog/${p.id}) — ${p.blurb[lang]} ${c.range(
              p.rangeCity[lang],
            )}`,
        )
        .join("\n"),
  )
  .join("\n\n")}

${c.sections}
${entries
  .filter((e) => !e.path.startsWith("/catalog/"))
  .map((e) => `- ${SITE_URL}/${lang}${e.path === "/" ? "" : e.path}`)
  .join("\n")}

${c.note}
`;
};

await mkdir("public", { recursive: true });
await writeFile("public/sitemap.xml", sitemap, "utf8");
await writeFile("public/robots.txt", robots, "utf8");
// Russian stays at /llms.txt (the conventional location); the other two sit
// beside it and are advertised from robots.txt.
await writeFile("public/llms.txt", llmsFor("ru"), "utf8");
for (const l of LANGS) await writeFile(`public/llms.${l}.txt`, llmsFor(l), "utf8");
console.log(
  `seo: wrote public/sitemap.xml (${entries.length} pages x ${LANGS.length} locales = ${urls.length} urls) plus robots.txt and llms.txt`,
);
