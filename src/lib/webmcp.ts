import { visibleProducts, formatPrice, type Product } from "@/data/products";
import { specs } from "@/data/specs";
import { pick, type Lang } from "@/data/spec-dict";
import { openLead } from "@/components/LeadFormSheet";

/**
 * WebMCP — the catalogue as browser tools, for an agent driving this page.
 *
 * The same four read tools the MCP server at `/mcp` exposes, plus one the
 * server deliberately does not have: `open_lead_form`. The asymmetry is the
 * point. An unattended agent posting into the sales pipeline is spam, which is
 * why `/mcp` is read-only; an agent *in a browser someone is watching* opening
 * a prefilled form is a convenience, because the person still presses send.
 *
 * **This module is never loaded by an ordinary visitor.** It is behind a
 * `"modelContext" in navigator` check and a dynamic import in `__root.tsx`, so
 * browsers without the API — which today is all of them — never fetch the
 * chunk. That matters here specifically: `qa-weight` caps every route at 930 KB
 * and the heaviest is 921 KB, so nine kilobytes is the entire budget. Static
 * import would have spent it.
 *
 * `navigator.modelContext` is a draft (WebMCP, W3C Web Machine Learning CG).
 * The shape below is typed locally rather than imported because there is no
 * package to import it from yet, and adding one would rewrite `bun.lock`.
 */

type ToolResult = { content: Array<{ type: "text"; text: string }> };

type ToolDefinition = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (args: Record<string, unknown>) => Promise<ToolResult> | ToolResult;
};

declare global {
  interface Navigator {
    modelContext?: { provideContext(ctx: { tools: ToolDefinition[] }): void };
  }
}

const LANGS: Lang[] = ["ru", "en", "uz"];
const asLang = (v: unknown): Lang => (LANGS.includes(v as Lang) ? (v as Lang) : "ru");
const text = (s: string): ToolResult => ({ content: [{ type: "text", text: s }] });

const productUrl = (p: Product, lang: Lang) => `/${lang}/${p.brandSlug}/${p.slug}`;

function brief(p: Product, lang: Lang): string {
  const range = [
    p.rangeCity && `city ${pick(p.rangeCity, lang)}`,
    p.rangeOpen && `open ${pick(p.rangeOpen, lang)}`,
  ]
    .filter(Boolean)
    .join(", ");
  return [
    `## ${p.name}`,
    `- slug: ${p.slug} (${p.brand})`,
    `- price: ${formatPrice(p.price, lang)}`,
    range && `- range: ${range}`,
    p.tags.length && `- tags: ${p.tags.join(", ")}`,
    `- ${pick(p.blurb, lang)}`,
    `- ${productUrl(p, lang)}`,
  ]
    .filter(Boolean)
    .join("\n");
}

const langProp = {
  type: "string",
  enum: LANGS,
  description: "Response language. Defaults to ru, the site's primary market.",
};

function tools(): ToolDefinition[] {
  return [
    {
      name: "list_radios",
      description:
        "List every two-way radio RADIOCOM sells, with price, range and tags. Start here when you do not know what is in the catalogue.",
      inputSchema: { type: "object", properties: { lang: langProp } },
      execute: ({ lang }) => {
        const l = asLang(lang);
        return text(
          `${visibleProducts.length} models.\n\n` +
            visibleProducts.map((p) => brief(p, l)).join("\n\n"),
        );
      },
    },
    {
      name: "search_radios",
      description:
        "Find radios by free text, brand, capability tag such as DMR, GPS or IP67, or a maximum price in сум.",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string" },
          brand: { type: "string", enum: ["radiocom", "motorola"] },
          tag: { type: "string" },
          maxPrice: { type: "number" },
          lang: langProp,
        },
      },
      execute: ({ query, brand, tag, maxPrice, lang }) => {
        const l = asLang(lang);
        const q = typeof query === "string" ? query.trim().toLowerCase() : "";
        const tg = typeof tag === "string" ? tag.toLowerCase() : "";
        const cap = typeof maxPrice === "number" ? maxPrice : null;
        const hits = visibleProducts.filter((p) => {
          if (typeof brand === "string" && brand && p.brandSlug !== brand) return false;
          if (tg && !p.tags.some((t) => t.toLowerCase() === tg)) return false;
          // A model quoted on request cannot satisfy a ceiling, so it is
          // excluded rather than treated as free.
          if (cap != null && (p.price == null || p.price > cap)) return false;
          if (!q) return true;
          return [p.name, p.slug, ...p.tags, ...LANGS.map((x) => pick(p.blurb, x))]
            .join(" ")
            .toLowerCase()
            .includes(q);
        });
        if (!hits.length) {
          return text(
            `No model matches. ${visibleProducts.length} models are in the catalogue — call list_radios to see them.`,
          );
        }
        return text(
          `${hits.length} of ${visibleProducts.length} models match.\n\n` +
            hits.map((p) => brief(p, l)).join("\n\n"),
        );
      },
    },
    {
      name: "get_radio",
      description:
        "Full detail for one model: every manufacturer specification, what ships in the box, and the capability list.",
      inputSchema: {
        type: "object",
        properties: { slug: { type: "string" }, lang: langProp },
        required: ["slug"],
      },
      execute: ({ slug, lang }) => {
        const l = asLang(lang);
        const p = visibleProducts.find((x) => x.slug === slug);
        if (!p) {
          return text(
            `No model with slug "${String(slug)}". Known slugs: ${visibleProducts.map((x) => x.slug).join(", ")}.`,
          );
        }
        const spec = specs[p.id];
        const parts = [brief(p, l)];
        if (spec?.rows.length) {
          parts.push(
            "\n### Specifications\n" +
              spec.rows.map((r) => `- ${pick(r.label, l)}: ${pick(r.value, l)}`).join("\n"),
          );
        }
        if (spec?.inBox.length) {
          parts.push(
            "\n### In the box\n" +
              spec.inBox
                .map((b) => `- ${pick(b.item, l)}${b.qty != null ? ` x${b.qty}` : ""}`)
                .join("\n"),
          );
        }
        if (spec?.features.length) {
          parts.push("\n### Features\n" + spec.features.map((f) => `- ${pick(f, l)}`).join("\n"));
        }
        return text(parts.join("\n"));
      },
    },
    {
      name: "compare_radios",
      description: "Put two to four models side by side on price, range and tags.",
      inputSchema: {
        type: "object",
        properties: {
          slugs: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 4 },
          lang: langProp,
        },
        required: ["slugs"],
      },
      execute: ({ slugs, lang }) => {
        const l = asLang(lang);
        const wanted = Array.isArray(slugs)
          ? slugs.filter((x): x is string => typeof x === "string")
          : [];
        if (wanted.length < 2) return text("Give at least two slugs to compare.");
        const found = wanted.map((s) => visibleProducts.find((p) => p.slug === s));
        const missing = wanted.filter((_, i) => !found[i]);
        if (missing.length) {
          return text(
            `Unknown slug(s): ${missing.join(", ")}. Known slugs: ${visibleProducts.map((x) => x.slug).join(", ")}.`,
          );
        }
        return text(
          `Comparing ${found.length} models.\n\n` +
            (found as Product[]).map((p) => brief(p, l)).join("\n\n"),
        );
      },
    },
    {
      name: "open_lead_form",
      description:
        "Open RADIOCOM's enquiry form on this page, optionally about a specific model. It only opens the form — the person still fills it in and sends it.",
      inputSchema: {
        type: "object",
        properties: {
          product: {
            type: "string",
            description: "Model name to prefill, e.g. Radiocom RCD-70 PRO.",
          },
        },
      },
      execute: ({ product }) => {
        openLead(typeof product === "string" && product ? { product } : {});
        return text("The enquiry form is open. The visitor completes and submits it themselves.");
      },
    },
  ];
}

/** Registers the tools. Call only when `navigator.modelContext` exists. */
export function registerWebMcpTools(): void {
  try {
    navigator.modelContext?.provideContext({ tools: tools() });
  } catch {
    // A draft API that throws must not take the page down with it.
  }
}
