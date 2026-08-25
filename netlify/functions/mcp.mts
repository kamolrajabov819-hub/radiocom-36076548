import type { Config } from "@netlify/functions";
import catalog from "./_catalog.json" with { type: "json" };

/**
 * A Model Context Protocol server for the RADIOCOM catalogue.
 *
 * Read-only, stateless, and hand-written.
 *
 * **Why not `@modelcontextprotocol/sdk`.** Adding it rewrites `bun.lock`, which
 * syncs to Lovable and to a build environment we cannot verify from here — the
 * same standing constraint that kept out `vite-imagetools`, `sharp` and
 * `turndown`. The surface an agent needs from a read-only tool server is five
 * JSON-RPC methods, which is less code than the dependency's own type
 * declarations.
 *
 * **Why the data is a generated JSON file.** `src/data/products.ts` carries
 * roughly two hundred `.webp` imports so the site can build a `srcSet`. A
 * function bundler has no business resolving those. `scripts/generate-seo.ts`
 * projects the catalogue into `_catalog.json` with the image graph left behind,
 * and `verify-agent-discovery.ts` fails the build if the two drift.
 *
 * **Why nothing here writes.** There is deliberately no `request_test` or
 * `submit_lead` tool. An unattended agent posting into the sales pipeline is
 * spam with extra steps; the tools hand back the contact URL and let a person
 * decide. The browser-side twin in `src/lib/webmcp.ts` *does* offer to open the
 * lead form, which is safe for the opposite reason: a human is sitting there.
 *
 * Transport: Streamable HTTP. A single JSON object is returned rather than an
 * SSE stream, which the spec permits, and no `Mcp-Session-Id` is issued —
 * session assignment is optional for servers and there is no state to keep.
 *
 * Verify with:
 *   curl -sX POST https://radiocom.uz/mcp \
 *     -H 'content-type: application/json' \
 *     -H 'accept: application/json, text/event-stream' \
 *     -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
 */

const PROTOCOL_VERSION = "2025-06-18";
const SERVER_VERSION = "1.0.0";

type Lang = "ru" | "en" | "uz";
type L = Record<string, string>;
type Product = (typeof catalog.products)[number];

const LANGS: Lang[] = ["ru", "en", "uz"];
const asLang = (v: unknown): Lang => (LANGS.includes(v as Lang) ? (v as Lang) : "ru");
const pick = (l: L | null | undefined, lang: Lang): string => (l ? (l[lang] ?? l.ru) : "");

/** Сум, grouped. `null` means the model is quoted on request — never guess. */
function money(price: number | null, lang: Lang): string {
  if (price == null) return lang === "en" ? "on request" : lang === "uz" ? "so'rov bo'yicha" : "по запросу";
  const grouped = price.toLocaleString("ru-RU");
  return lang === "en" ? `${grouped} UZS` : `${grouped} сум`;
}

/** One model as a compact block. The verbose form is `get_radio`. */
function brief(p: Product, lang: Lang): string {
  const range = [
    p.rangeCity ? `city ${pick(p.rangeCity, lang)}` : "",
    p.rangeOpen ? `open ${pick(p.rangeOpen, lang)}` : "",
  ]
    .filter(Boolean)
    .join(", ");
  return [
    `## ${p.name}`,
    `- slug: ${p.slug} (brand: ${p.brand})`,
    `- price: ${money(p.price, lang)}`,
    range && `- range: ${range}`,
    p.tags.length ? `- tags: ${p.tags.join(", ")}` : "",
    `- ${pick(p.blurb, lang)}`,
    `- ${p.url[lang] ?? p.url.ru}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function full(p: Product, lang: Lang): string {
  const out = [brief(p, lang)];
  if (p.specs) {
    if (p.specs.rows.length) {
      out.push(
        "\n### Specifications\n" +
          p.specs.rows.map((r) => `- ${pick(r.label, lang)}: ${pick(r.value, lang)}`).join("\n"),
      );
    }
    if (p.specs.inBox.length) {
      out.push(
        "\n### In the box\n" +
          p.specs.inBox
            .map((b) => `- ${pick(b.item, lang)}${b.qty != null ? ` x${b.qty}` : ""}`)
            .join("\n"),
      );
    }
    if (p.specs.features.length) {
      out.push("\n### Features\n" + p.specs.features.map((f) => `- ${pick(f, lang)}`).join("\n"));
    }
  }
  return out.join("\n");
}

const langProp = {
  type: "string",
  enum: LANGS,
  description: "Response language. Defaults to ru, the site's primary market.",
} as const;

const TOOLS = [
  {
    name: "list_radios",
    description:
      "List every two-way radio RADIOCOM sells, with price, range and tags. Start here when you do not know what is in the catalogue.",
    inputSchema: { type: "object", properties: { lang: langProp } },
  },
  {
    name: "search_radios",
    description:
      "Find radios by free text (model name or description), brand, capability tag such as DMR, GPS or IP67, or a maximum price in сум.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Free text matched against name, blurb and tags." },
        brand: { type: "string", enum: ["radiocom", "motorola"] },
        tag: { type: "string", description: "A capability tag, e.g. DMR, GPS, IP67, PMR446." },
        maxPrice: { type: "number", description: "Upper bound in сум. Models quoted on request are excluded." },
        lang: langProp,
      },
    },
  },
  {
    name: "get_radio",
    description:
      "Full detail for one model: every manufacturer specification, what ships in the box, and the capability list.",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "Model slug, e.g. rcd-70. Use list_radios to find one." },
        lang: langProp,
      },
      required: ["slug"],
    },
  },
  {
    name: "compare_radios",
    description: "Put two to four models side by side on price, range, tags and shared specifications.",
    inputSchema: {
      type: "object",
      properties: {
        slugs: {
          type: "array",
          items: { type: "string" },
          minItems: 2,
          maxItems: 4,
          description: "Model slugs, e.g. [\"rcd-70\", \"rcd-50\"].",
        },
        lang: langProp,
      },
      required: ["slugs"],
    },
  },
] as const;

const bySlug = (slug: string) => catalog.products.find((p) => p.slug === slug);

const CONTACT = `Prices and availability: ${catalog.site}. RADIOCOM does not take orders through this server — a person handles every enquiry.`;

function runTool(name: string, args: Record<string, unknown>): string {
  const lang = asLang(args.lang);

  switch (name) {
    case "list_radios":
      return (
        `${catalog.products.length} models.\n\n` +
        catalog.products.map((p) => brief(p, lang)).join("\n\n") +
        `\n\n${CONTACT}`
      );

    case "search_radios": {
      const q = typeof args.query === "string" ? args.query.trim().toLowerCase() : "";
      const brand = typeof args.brand === "string" ? args.brand : "";
      const tag = typeof args.tag === "string" ? args.tag.toLowerCase() : "";
      const maxPrice = typeof args.maxPrice === "number" ? args.maxPrice : null;

      const hits = catalog.products.filter((p) => {
        if (brand && p.brandSlug !== brand) return false;
        if (tag && !p.tags.some((t) => t.toLowerCase() === tag)) return false;
        // A model quoted on request cannot satisfy a price ceiling, so it is
        // excluded rather than silently treated as free.
        if (maxPrice != null && (p.price == null || p.price > maxPrice)) return false;
        if (!q) return true;
        const hay = [p.name, p.slug, ...p.tags, ...LANGS.map((l) => pick(p.blurb, l))]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      });

      if (!hits.length) {
        return `No model matches. ${catalog.products.length} models are in the catalogue — call list_radios to see them.`;
      }
      return (
        `${hits.length} of ${catalog.products.length} models match.\n\n` +
        hits.map((p) => brief(p, lang)).join("\n\n") +
        `\n\n${CONTACT}`
      );
    }

    case "get_radio": {
      const slug = typeof args.slug === "string" ? args.slug : "";
      const p = bySlug(slug);
      if (!p) {
        return `No model with slug "${slug}". Known slugs: ${catalog.products.map((x) => x.slug).join(", ")}.`;
      }
      return `${full(p, lang)}\n\n${CONTACT}`;
    }

    case "compare_radios": {
      const slugs = Array.isArray(args.slugs) ? args.slugs.filter((x): x is string => typeof x === "string") : [];
      if (slugs.length < 2) return "Give at least two slugs to compare.";
      const found = slugs.map((s) => ({ s, p: bySlug(s) }));
      const missing = found.filter((f) => !f.p).map((f) => f.s);
      if (missing.length) {
        return `Unknown slug(s): ${missing.join(", ")}. Known slugs: ${catalog.products.map((x) => x.slug).join(", ")}.`;
      }
      const models = found.map((f) => f.p!);
      const lines = [
        `Comparing ${models.length} models.`,
        "",
        ...models.map(
          (p) =>
            `### ${p.name} (${p.slug})\n- price: ${money(p.price, lang)}\n- city: ${pick(p.rangeCity, lang)}` +
            (p.rangeOpen ? `\n- open ground: ${pick(p.rangeOpen, lang)}` : "") +
            (p.tags.length ? `\n- tags: ${p.tags.join(", ")}` : ""),
        ),
      ];
      // Only rows every model actually carries — a half-empty table invites a
      // reader to infer that a blank means "does not have it".
      const labelSets = models.map(
        (p) => new Set((p.specs?.rows ?? []).map((r) => pick(r.label, "ru"))),
      );
      const shared = [...(labelSets[0] ?? [])].filter((l) => labelSets.every((s) => s.has(l)));
      if (shared.length) {
        lines.push("", "### Shared specifications");
        for (const label of shared) {
          const cells = models.map((p) => {
            const row = (p.specs?.rows ?? []).find((r) => pick(r.label, "ru") === label);
            return `${p.slug}: ${row ? pick(row.value, lang) : "—"}`;
          });
          const shown = models[0].specs?.rows.find((r) => pick(r.label, "ru") === label);
          lines.push(`- ${shown ? pick(shown.label, lang) : label} — ${cells.join(" | ")}`);
        }
      }
      return `${lines.join("\n")}\n\n${CONTACT}`;
    }

    default:
      throw Object.assign(new Error(`Unknown tool: ${name}`), { code: -32602 });
  }
}

type Rpc = { jsonrpc?: string; id?: string | number | null; method?: string; params?: Record<string, unknown> };

const ok = (id: Rpc["id"], result: unknown) => ({ jsonrpc: "2.0", id, result });
const err = (id: Rpc["id"], code: number, message: string) => ({
  jsonrpc: "2.0",
  id,
  error: { code, message },
});

function handle(msg: Rpc): object | null {
  const { id = null, method, params = {} } = msg;

  switch (method) {
    case "initialize":
      return ok(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: { name: "radiocom-catalog", version: SERVER_VERSION },
        instructions:
          "Read-only access to the RADIOCOM two-way radio catalogue: models, manufacturer specifications, box contents and prices in сум. Every figure comes from the same data the website renders. Nothing here places an order.",
      });

    // Notifications carry no id and expect no reply.
    case "notifications/initialized":
    case "notifications/cancelled":
      return null;

    case "ping":
      return ok(id, {});

    case "tools/list":
      return ok(id, { tools: TOOLS });

    case "tools/call": {
      const name = typeof params.name === "string" ? params.name : "";
      const args = (params.arguments ?? {}) as Record<string, unknown>;
      try {
        return ok(id, { content: [{ type: "text", text: runTool(name, args) }] });
      } catch (e) {
        // A tool that fails reports through `isError`, not a JSON-RPC error:
        // the call itself succeeded, the tool did not. That is what lets a
        // model read the message and try something else.
        return ok(id, {
          content: [{ type: "text", text: e instanceof Error ? e.message : String(e) }],
          isError: true,
        });
      }
    }

    default:
      return err(id, -32601, `Method not found: ${method}`);
  }
}

export default async (req: Request) => {
  if (req.method === "GET") {
    // No server-initiated stream to offer. 405 is the spec's answer for a
    // server that does not support GET on the endpoint.
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { allow: "POST, OPTIONS" },
    });
  }
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-headers": "content-type, mcp-protocol-version",
      },
    });
  }
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: { allow: "POST, OPTIONS" } });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json(err(null, -32700, "Parse error"), { status: 400 });
  }

  const headers = {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
    "mcp-protocol-version": PROTOCOL_VERSION,
  };

  // A client may batch. Replies to notifications are dropped, and a batch of
  // nothing but notifications gets 202 with no body.
  if (Array.isArray(body)) {
    const replies = body.map((m) => handle(m as Rpc)).filter((r): r is object => r !== null);
    return replies.length ? Response.json(replies, { headers }) : new Response(null, { status: 202 });
  }

  const reply = handle(body as Rpc);
  return reply ? Response.json(reply, { headers }) : new Response(null, { status: 202 });
};

export const config: Config = {
  path: "/mcp",
};
