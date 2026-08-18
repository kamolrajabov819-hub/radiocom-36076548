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
`;

// llms.txt — the emerging convention for telling AI answer engines what a site
// is and where its canonical facts live. Generated from the same catalogue data
// so model counts and names cannot drift from the site.
const byBrand = products.reduce<Record<string, typeof products>>((acc, p) => {
  (acc[p.brand] ??= []).push(p);
  return acc;
}, {});

const llms = `# Radiocom

> Официальный поставщик профессиональных и любительских радиостанций в Узбекистане.
> 11 лет на рынке, 10 000+ клиентов. Продажа, аренда, авторизованный сервис и
> проектирование систем радиосвязи. Офис и сервисный центр в Ташкенте.

Языки: русский (${SITE_URL}/ru), английский (${SITE_URL}/en), узбекский (${SITE_URL}/uz).
Канонический язык — русский.

## Контакты
- Адрес: ул. Узбекистон Овози, 2, Ташкент, Узбекистан
- Телефон: +998 78 113-16-18
- Часы работы: Пн-Пт 09:00-18:00

## Каталог (${products.length} моделей)
${Object.entries(byBrand)
  .map(
    ([brand, list]) =>
      `### ${brand}\n` +
      list
        .map(
          (p) =>
            `- [${p.name}](${SITE_URL}/ru/catalog/${p.id}) — ${p.blurb} Дальность ${p.rangeCity}.`,
        )
        .join("\n"),
  )
  .join("\n\n")}

## Разделы
${entries
  .filter((e) => !e.path.startsWith("/catalog/"))
  .map((e) => `- ${SITE_URL}/ru${e.path === "/" ? "" : e.path}`)
  .join("\n")}

## Примечание о дальности
Указанная дальность рассчитана при прямой видимости и оптимальной погоде.
Фактическая зависит от рельефа, погоды, электромагнитных помех и препятствий.
`;

await mkdir("public", { recursive: true });
await writeFile("public/sitemap.xml", sitemap, "utf8");
await writeFile("public/robots.txt", robots, "utf8");
await writeFile("public/llms.txt", llms, "utf8");
console.log(
  `seo: wrote public/sitemap.xml (${entries.length} pages x ${LANGS.length} locales = ${urls.length} urls) plus robots.txt and llms.txt`,
);
