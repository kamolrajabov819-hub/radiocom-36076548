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
import { SITE_URL } from "../src/lib/seo";

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

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  entries
    .map(
      (e) =>
        `  <url>\n` +
        `    <loc>${SITE_URL}${e.path}</loc>\n` +
        `    <lastmod>${lastmod}</lastmod>\n` +
        `    <changefreq>${e.changefreq}</changefreq>\n` +
        `    <priority>${e.priority}</priority>\n` +
        `  </url>`,
    )
    .join("\n") +
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

await mkdir("public", { recursive: true });
await writeFile("public/sitemap.xml", sitemap, "utf8");
await writeFile("public/robots.txt", robots, "utf8");
console.log(`seo: wrote public/sitemap.xml (${entries.length} urls) and public/robots.txt`);
