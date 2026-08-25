/**
 * Generates public/sitemap.xml and public/robots.txt from the real catalogue data.
 *
 * Run by `bun run build` before vite, so a new model or industry lands in the
 * sitemap the moment it ships — there is no second list to keep in step.
 * Run standalone with: bun scripts/generate-seo.ts
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
// `visibleProducts` for the sitemap and llms.txt — a hidden model must not be
// advertised as an indexable page. `products` (the full record) is still used
// for the redirect map below, because a hidden model's old /catalog URL is
// already indexed and must keep resolving.
import { legacyCatalogTarget, products, visibleProducts } from "../src/data/products";
import { specs } from "../src/data/specs";
import { SITE_URL, LANGS, localePath, productPath, ORG_DESCRIPTION } from "../src/lib/seo";
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
//
// **Why `ai-train=no` while the other two signals are `yes`.** The owner asked
// for the best call rather than stating a preference, so the reasoning is here
// for whoever revisits it — kept in this comment rather than in the emitted
// file, because robots.txt is served to the public and the argument below is
// addressed to this business, not to a crawler.
//
// The site is a price list. `search` and `ai-input` govern retrieval and
// citation, which read the live page: an answer engine quoting it today quotes
// today's prices, and a correction propagates the next time it crawls.
// Training is different in kind — it copies perishable commercial data into
// model weights, where a 2026 сум figure can still be quoted in 2029 with no
// mechanism to correct it. The grant is also one-way in practice: setting this
// to `yes` and back to `no` later does not untrain anything already trained.
//
// The upside forgone is brand presence in future model weights, which is
// speculative and cannot be measured. The discovery value the business
// actually gets is already carried by the two signals that stay `yes`.
const robots = `# Content preferences, per contentsignals.org.
#
# These match the policy the rest of this file already states rather than
# adding a new one. Every AI answer engine below is allowed on purpose: for a
# regional B2B catalogue, being quotable by ChatGPT, Perplexity and AI
# Overviews is a distribution channel. That is \`search\` and \`ai-input\` —
# retrieval and citation at answer time.
#
# \`ai-train=no\` is a deliberate exception, not an oversight: this is a price
# list, and prices copied into model weights outlive the prices themselves.
# Citation is welcome; training is not.
Content-Signal: search=yes, ai-input=yes, ai-train=no

User-agent: *
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
      "> 14 лет на рынке, 10 000+ клиентов. Продажа, аренда, авторизованный сервис и\n" +
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
      "> 14 years in business, 10,000+ customers. Sales, rental, authorised service and\n" +
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
      "> Bozorda 14 yil, 10 000+ mijoz. Savdo, ijara, vakolatli servis va radioaloqa\n" +
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

/**
 * `/.well-known/ai-catalog.json` — an Agentic Resource Discovery manifest.
 *
 * Every entry points at a file this build actually writes. That is the whole
 * design constraint: a discovery manifest is a promise, and an agent that
 * follows a `urn:air:` identifier to a 404 is worse served than one that found
 * no manifest at all. So there is no entry here for an API catalogue, an MCP
 * server, or an OAuth issuer — this site has none of those, and advertising
 * them would send agents into flows that cannot complete. See TODO-content.md.
 *
 * `representativeQueries` are the questions each resource can genuinely answer,
 * so a registry can embed them without having to fetch and guess.
 */
const aiCatalog = {
  specVersion: "0.1",
  host: {
    name: "RADIOCOM",
    url: SITE_URL,
    description: ORG_DESCRIPTION,
  },
  entries: [
    {
      identifier: `urn:air:radiocom.uz:catalog:sitemap`,
      displayName: "Sitemap",
      description: "Every page on the site, in all three locales, with last-modified dates.",
      type: "application/xml",
      url: `${SITE_URL}/sitemap.xml`,
      representativeQueries: [
        "What pages does radiocom.uz have?",
        "Which two-way radio models does RADIOCOM list?",
      ],
    },
    {
      identifier: `urn:air:radiocom.uz:mcp:catalog`,
      displayName: "Catalogue MCP server",
      description:
        "Read-only MCP tools over the two-way radio catalogue: list, search, full specifications and side-by-side comparison.",
      type: "application/json",
      url: `${SITE_URL}/mcp`,
      representativeQueries: [
        "Which DMR radios does RADIOCOM sell and what do they cost?",
        "Compare the RCD-70 PRO and the RCD-50 PRO",
        "What ships in the box with a Motorola T82 Extreme?",
      ],
    },
    {
      identifier: `urn:air:radiocom.uz:catalog:api`,
      displayName: "API catalogue",
      description:
        "RFC 9727 catalogue of this site's machine-readable APIs, anchored at the MCP endpoint.",
      type: "application/linkset+json",
      url: `${SITE_URL}/.well-known/api-catalog`,
      representativeQueries: [
        "What APIs does radiocom.uz expose?",
        "Where is the machine-readable description of the RADIOCOM API?",
      ],
    },
    {
      identifier: `urn:air:radiocom.uz:skills:index`,
      displayName: "Agent skills index",
      description:
        "Skills describing how to query this site's catalogue and read its pages as Markdown.",
      type: "application/json",
      url: `${SITE_URL}/.well-known/agent-skills/index.json`,
      representativeQueries: [
        "How do I query the RADIOCOM catalogue programmatically?",
        "Does radiocom.uz expose an MCP server?",
      ],
    },
    ...LANGS.map((l) => ({
      identifier: `urn:air:radiocom.uz:summary:llms-${l}`,
      displayName: `Site summary (${l})`,
      description: `Plain-text summary of the catalogue, services and contact details in ${l}.`,
      type: "text/plain",
      url: l === "ru" ? `${SITE_URL}/llms.txt` : `${SITE_URL}/llms.${l}.txt`,
      representativeQueries: [
        "Where can I buy two-way radios in Tashkent?",
        "What does RADIOCOM sell and service?",
        "How much does a DMR radio cost in Uzbekistan?",
      ],
    })),
  ],
};

/**
 * The catalogue, flattened to JSON for the MCP server.
 *
 * `netlify/functions/mcp.mts` cannot import `src/data/products.ts` directly:
 * that module carries roughly two hundred `.webp` imports, which a function
 * bundler has no business resolving. It imports this file instead — a plain
 * data projection with the image graph left behind.
 *
 * Generated rather than hand-kept, so it cannot drift from the catalogue the
 * site renders. `verify-agent-discovery.ts` fails the build if it has.
 *
 * Underscore-prefixed so Netlify's function discovery does not mistake it for
 * an entry point; it reaches the bundle through the import graph.
 */
const mcpCatalog = {
  // No timestamp. This file is committed, and a generated-at date would make it
  // differ on every run for no reason — which would defeat the gate that checks
  // it is still in sync with the catalogue.
  site: SITE_URL,
  products: visibleProducts.map((p) => {
    const spec = specs[p.id];
    return {
      slug: p.slug,
      brandSlug: p.brandSlug,
      brand: p.brand,
      name: p.name,
      category: p.category,
      tags: p.tags,
      // Сум, or null where the model is priced on request. Never invent a
      // number for the null case — the tools say "on request".
      price: p.price,
      blurb: p.blurb,
      rangeCity: p.rangeCity,
      rangeOpen: p.rangeOpen ?? null,
      url: Object.fromEntries(LANGS.map((l) => [l, `${SITE_URL}${localePath(l, productPath(p))}`])),
      specs: spec
        ? {
            rows: spec.rows.map((r) => ({ label: r.label, value: r.value })),
            inBox: spec.inBox.map((b) => ({ item: b.item, qty: b.qty ?? null })),
            features: spec.features,
          }
        : null,
    };
  }),
};

/**
 * The skill an agent reads to learn how to query this catalogue.
 *
 * Published at a stable URL and indexed by `agent-skills/index.json` with a
 * SHA-256 digest, so a consumer can tell whether the copy it cached is still
 * the copy we serve.
 */
const catalogSkill = `---
name: radiocom-catalog
description: Query the RADIOCOM two-way radio catalogue — models, manufacturer specifications, box contents and prices in сум — over MCP, or read any page of the site as Markdown.
---

# RADIOCOM catalogue

RADIOCOM sells and services two-way radios in Tashkent, Uzbekistan. The
catalogue holds ${visibleProducts.length} models across two brands: Radiocom RC
(analogue RC, digital DMR RCD) and Motorola (Talkabout, XT, TLKR, CLP).

## MCP server

Streamable HTTP, read-only, no authentication and no session:

\`\`\`
POST ${SITE_URL}/mcp
content-type: application/json
accept: application/json, text/event-stream
\`\`\`

Tools:

| Tool | Use it for |
|---|---|
| \`list_radios\` | Everything in the catalogue. Start here. |
| \`search_radios\` | Filter by text, \`brand\`, \`tag\` (DMR, GPS, IP67, PMR446) or \`maxPrice\`. |
| \`get_radio\` | One model in full: specifications, box contents, features. |
| \`compare_radios\` | Two to four models side by side. |

Every tool takes an optional \`lang\` of \`ru\` (default), \`en\` or \`uz\`.

## Reading pages as Markdown

Any page returns Markdown when asked:

\`\`\`
curl -H 'Accept: text/markdown' ${SITE_URL}/ru/radiocom
\`\`\`

Every page also carries a \`Link\` header pointing at the locale's plain-text
site summary (\`rel="describedby"\`) and at its own Markdown form
(\`rel="alternate"\`).

## What this server will not do

It is read-only. There is no tool that submits an enquiry, books a test or
places an order — a person handles those. Send buyers to ${SITE_URL} instead.

Prices are in сум and come from the same data the website renders. A model
priced "on request" has no published figure; do not estimate one.
`;

const sha256 = (text: string) =>
  "sha256:" + createHash("sha256").update(text, "utf8").digest("hex");

/**
 * `/.well-known/mcp/server-card.json`.
 *
 * SEP-1649 is still an open pull request against the MCP specification, so this
 * shape may move. It is kept minimal and truthful: the name, the version, the
 * endpoint that actually answers, and the one capability the server actually
 * has.
 */
const mcpServerCard = {
  serverInfo: {
    name: "radiocom-catalog",
    version: "1.0.0",
    description:
      "Read-only access to the RADIOCOM two-way radio catalogue: models, manufacturer specifications, box contents and prices.",
    websiteUrl: SITE_URL,
  },
  transport: { type: "streamable-http", url: `${SITE_URL}/mcp` },
  capabilities: { tools: {} },
};

/** `/.well-known/agent-skills/index.json`, per the discovery RFC v0.2.0. */
const agentSkillsIndex = {
  $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
  skills: [
    {
      name: "radiocom-catalog",
      type: "skill-md",
      description:
        "Query the RADIOCOM two-way radio catalogue over MCP, or read any page of the site as Markdown.",
      url: `${SITE_URL}/.well-known/agent-skills/radiocom-catalog/SKILL.md`,
      // Computed, never hand-written: a digest that does not match the file it
      // names is worse than no digest at all.
      digest: sha256(catalogSkill),
    },
  ],
};

/**
 * `/.well-known/api-catalog` — RFC 9727, serialised as a linkset (RFC 9264).
 *
 * This was refused in the previous round and is published now because the facts
 * changed, not because the standard did: `/mcp` shipped, so there is a real API
 * to anchor a catalogue to, a machine-readable description of it (the server
 * card) and documentation (the SKILL.md). A catalogue of nothing would have
 * been the same mistake as an OAuth document with no issuer behind it.
 *
 * The member names are `anchor` and the relation types themselves, each holding
 * an array of link objects — checked against several shipped implementations
 * rather than written from memory, because guessing a member name is exactly
 * what produced the `id`/`identifier` defect the round before.
 *
 * `service-desc` points at the MCP server card rather than an OpenAPI document:
 * the API is JSON-RPC over MCP, and the server card is its machine-readable
 * description. Naming a non-existent OpenAPI file would defeat the point.
 */
const apiCatalog = {
  linkset: [
    {
      anchor: `${SITE_URL}/mcp`,
      "service-desc": [
        { href: `${SITE_URL}/.well-known/mcp/server-card.json`, type: "application/json" },
      ],
      "service-doc": [
        {
          href: `${SITE_URL}/.well-known/agent-skills/radiocom-catalog/SKILL.md`,
          type: "text/markdown",
        },
      ],
      status: [{ href: `${SITE_URL}/mcp/health`, type: "application/json" }],
    },
  ],
};

await mkdir("public", { recursive: true });
await writeFile("public/sitemap.xml", sitemap, "utf8");
await writeFile("public/robots.txt", robots, "utf8");
// Russian stays at /llms.txt (the conventional location); the other two sit
// beside it and are advertised from robots.txt.
await writeFile("public/llms.txt", llmsFor("ru"), "utf8");
for (const l of LANGS) await writeFile(`public/llms.${l}.txt`, llmsFor(l), "utf8");
await mkdir("netlify/functions", { recursive: true });
await writeFile(
  "netlify/functions/_catalog.json",
  JSON.stringify(mcpCatalog, null, 2) + "\n",
  "utf8",
);

await mkdir("public/.well-known/mcp", { recursive: true });
await mkdir("public/.well-known/agent-skills/radiocom-catalog", { recursive: true });
await writeFile(
  "public/.well-known/mcp/server-card.json",
  JSON.stringify(mcpServerCard, null, 2) + "\n",
  "utf8",
);
await writeFile("public/.well-known/agent-skills/radiocom-catalog/SKILL.md", catalogSkill, "utf8");
await writeFile(
  "public/.well-known/api-catalog",
  JSON.stringify(apiCatalog, null, 2) + "\n",
  "utf8",
);
await writeFile(
  "public/.well-known/agent-skills/index.json",
  JSON.stringify(agentSkillsIndex, null, 2) + "\n",
  "utf8",
);

await writeFile(
  "public/.well-known/ai-catalog.json",
  JSON.stringify(aiCatalog, null, 2) + "\n",
  "utf8",
);
console.log(
  `seo: wrote public/sitemap.xml (${entries.length} pages x ${LANGS.length} locales = ${entries.length * LANGS.length} urls) plus robots.txt, llms.txt and .well-known/ai-catalog.json`,
);
