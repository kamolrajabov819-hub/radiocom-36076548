/**
 * A small HTML-to-Markdown extractor for agent responses.
 *
 * Written by hand rather than pulled from npm on purpose. Turndown and its
 * peers are good libraries, but adding one rewrites `bun.lock`, which syncs to
 * Lovable and to a build environment I cannot verify from here — the same
 * reasoning that has kept `vite-imagetools` and `sharp` out of this repo. The
 * job here is also much narrower than a general converter: this site's SSR
 * output is a known shape, and the consumer is a language model that wants the
 * prose and the links, not a faithful round-trip.
 *
 * What it deliberately drops: `script`, `style`, `noscript`, `svg`, `template`,
 * every `aria-hidden` node, and the duplicated half of the client marquee. What
 * it keeps: headings, paragraphs, list items, link targets and image alt text.
 */

/** Entities that actually appear in this site's markup. */
const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  "#39": "'",
  apos: "'",
  nbsp: " ",
  mdash: "—",
  ndash: "–",
  laquo: "«",
  raquo: "»",
  hellip: "…",
  middot: "·",
  times: "×",
  deg: "°",
};

function decode(s: string): string {
  return s.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (m, e: string) => {
    if (e[0] === "#") {
      const code = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[e] ?? m;
  });
}

const stripTags = (s: string) => decode(s.replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();

/**
 * Convert one SSR HTML document to Markdown.
 *
 * @param html   the full document
 * @param origin absolute origin, so relative links resolve for a reader that
 *               only ever sees the Markdown
 */
export function htmlToMarkdown(html: string, origin = ""): string {
  // Title and description first — an agent reading only the head of the file
  // should still learn what the page is.
  const title = stripTags(/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? "");
  const desc = decode(
    /<meta\s+name="description"\s+content="([^"]*)"/i.exec(html)?.[1] ?? "",
  );

  let body = /<body[^>]*>([\s\S]*)<\/body>/i.exec(html)?.[1] ?? html;

  // Whole subtrees that carry no reading value.
  body = body
    .replace(/<(script|style|noscript|template|svg)\b[\s\S]*?<\/\1>/gi, " ")
    // The marquee renders its list twice so the loop is seamless; the copy is
    // `aria-hidden`, and repeating fifty-two company names would be as useless
    // to a model as it is to a screen reader.
    .replace(/<[^>]+\baria-hidden="true"[\s\S]*?<\/[a-zA-Z]+>/gi, " ");

  const out: string[] = [];
  if (title) out.push(`# ${title}`);
  if (desc) out.push(`> ${desc}`);

  // One pass over the block-level elements that carry content, in document
  // order. A regex is enough because the input is generated markup, not
  // arbitrary hand-written HTML.
  const BLOCK = /<(h[1-6]|p|li|figcaption|blockquote)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let m: RegExpExecArray | null;
  const seen = new Set<string>();
  while ((m = BLOCK.exec(body)) !== null) {
    const tag = m[1].toLowerCase();
    // Links become inline Markdown before the remaining tags are stripped, so
    // an agent can follow them.
    const withLinks = m[2].replace(
      /<a\b[^>]*\bhref="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi,
      (_all, href: string, text: string) => {
        const label = stripTags(text);
        if (!label) return "";
        const url = href.startsWith("/") ? origin + href : href;
        return `[${label}](${url})`;
      },
    );
    const text = stripTags(withLinks);
    if (!text) continue;

    if (/^h[1-6]$/.test(tag)) {
      const level = Number(tag[1]);
      // The document already opens with `# title`, so page headings start one
      // level down and the outline stays valid.
      out.push(`${"#".repeat(Math.min(level + 1, 6))} ${text}`);
    } else if (tag === "li") {
      // Nav and footer link lists repeat on every page; one copy is plenty.
      if (seen.has(text)) continue;
      seen.add(text);
      out.push(`- ${text}`);
    } else if (tag === "blockquote") {
      out.push(`> ${text}`);
    } else {
      out.push(text);
    }
  }

  // Consecutive list items join on a single newline — a blank line between
  // them makes it a "loose" list, which renders each item wrapped in its own
  // paragraph. Everything else gets a blank line.
  let md = "";
  for (let i = 0; i < out.length; i++) {
    if (i > 0) md += out[i].startsWith("- ") && out[i - 1].startsWith("- ") ? "\n" : "\n\n";
    md += out[i];
  }
  return md.replace(/\n{3,}/g, "\n\n").trim() + "\n";
}
