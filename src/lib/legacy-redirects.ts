/**
 * The old WordPress site's URLs, and where each one goes now.
 *
 * radiocom.uz still serves WordPress, and some of its URLs rank: the old site
 * answers «купить рацию в Ташкенте» with `/?products_category=pmr&lang=ru`.
 * WordPress addressed almost everything through the query string on `/` —
 * `?products=…`, `?products_category=…`, `?page_id=…`, `?lang=…` — so on this
 * build every one of those URLs used to land on the home page, which search
 * engines treat as a soft 404 and stop ranking.
 *
 * `resolveLegacy` maps an old URL to the page that replaces it, in one hop:
 *
 *   { path }  301 to this path (marketing parameters are added by the caller)
 *   "gone"    no equivalent exists — answered 410, never sent to the home page
 *   null      not a WordPress URL; the normal routing applies
 *
 * It reads the raw request URL (`src/start.ts` calls it before the router
 * runs). The router only sees a re-stringified search, in which a numeric
 * value is already a Number and a 19-digit ID is already rounded.
 *
 * Pure and dependency-free on purpose: `scripts/verify-legacy-redirects.ts`
 * runs every URL in `scripts/fixtures/legacy-urls.txt` through it at build
 * time and fails if any target is not a live page. That check is also why the
 * product targets are spelled out here rather than read from `products.ts` —
 * importing the catalogue would put it in the server bundle's hot path for no
 * gain, and the gate catches a target that stops existing.
 *
 * The decisions, URL by URL, are in `docs/seo/legacy-redirects.md`.
 */

export type Locale = "ru" | "uz" | "en";
export type LegacyResult = { path: string } | "gone" | null;

/**
 * WordPress's own query keys. Only these make a `/?…` URL a WordPress URL;
 * anything else — `utm_*`, `gclid`, `ysclid`, a parameter nobody here has seen
 * — falls through to the normal `/` → `/ru`. An unrecognised parameter must
 * never turn the home page into a 404.
 */
export const WORDPRESS_KEYS = [
  "products",
  "products_category",
  "page_id",
  "post_type",
  "lang",
  "paged",
  "p",
  "s",
  "cat",
  "tag",
  "attachment_id",
  "author",
  "m",
  "feed",
  "preview",
] as const;

const WP_KEY_SET: ReadonlySet<string> = new Set(WORDPRESS_KEYS);

/** True when any of these query keys is one of WordPress's. */
export function hasWordPressKey(keys: Iterable<string>): boolean {
  for (const k of keys) if (WP_KEY_SET.has(k.toLowerCase())) return true;
  return false;
}

/* ─── Normalisation ─────────────────────────────────────────── */

/**
 * Cyrillic letters that look exactly like Latin ones. The old catalogue has a
 * product slug typed with a Cyrillic «с» — `rс-10` — which reads as `rc-10` and
 * matches nothing. Folded only inside tokens that already contain Latin letters
 * or digits, so `красная` stays Russian and `rс-10` becomes `rc-10`.
 */
const HOMOGLYPHS: Record<string, string> = {
  а: "a",
  е: "e",
  к: "k",
  о: "o",
  р: "p",
  с: "c",
  у: "y",
  х: "x",
};

function fold(slug: string): string {
  return slug
    .split("-")
    .map((tok) => (/[a-z0-9]/.test(tok) ? tok.replace(/[аекорсух]/g, (c) => HOMOGLYPHS[c]) : tok))
    .join("-");
}

/** Decoded, trimmed, NFC, lower case, no trailing slash. */
function clean(value: string | null): string {
  if (!value) return "";
  return value.normalize("NFC").trim().toLowerCase().replace(/\/+$/, "");
}

/**
 * The language a WordPress URL was in. `lang=oz` is the old site's Uzbek
 * (partly in Cyrillic); a missing or malformed value — the old pagination
 * produced `lang=rupage/2` — is read by its prefix and defaults to Russian.
 */
function localeOf(lang: string): Locale | null {
  if (lang.startsWith("ru")) return "ru";
  if (lang.startsWith("oz") || lang.startsWith("uz")) return "uz";
  if (lang.startsWith("en")) return "en";
  return null;
}

/* ─── The maps ──────────────────────────────────────────────── */

type Section = "" | "radiocom" | "motorola" | "compare" | "poc" | "service" | "about";
const at = (l: Locale, section: Section) => ({ path: section ? `/${l}/${section}` : `/${l}` });
const product = (l: Locale, brand: "radiocom" | "motorola", model: string) => ({
  path: `/${l}/${brand}/${model}`,
});

/** `?page_id=` — each id belonged to one language, which wins over a missing `lang`. */
const PAGE_IDS: Record<string, { lang: Locale; section: Section }> = {
  // «О компании» → the About page the keyword pass built (until then these
  // went to the language home, the nearest real equivalent).
  "1249": { lang: "ru", section: "about" },
  "1270": { lang: "en", section: "about" },
  "628": { lang: "uz", section: "about" },
  // PoC
  "94": { lang: "ru", section: "poc" },
  "1292": { lang: "en", section: "poc" },
  "635": { lang: "uz", section: "poc" },
  // «Сервис центр»
  "1639": { lang: "ru", section: "service" },
  "1644": { lang: "en", section: "service" },
  "1642": { lang: "uz", section: "service" },
};

/** `?products_category=` → section, or "gone" for ranges the site does not carry. */
const CATEGORIES: Record<string, Section | "gone"> = {
  motorola: "motorola",
  rc: "radiocom",
  poc: "poc",
  hytera: "poc",
  // The licence-free PMR and amateur range spans both brands. Until a
  // catalogue hub exists, the compare page is the one page that lists all of
  // it side by side.
  pmr: "compare",
  amateur_stations: "compare",
  "ҳаваскор-радиостанциялар": "compare",
  "decross-ru": "compare",
  // The professional range is the Radiocom RCD DMR line.
  prof: "radiocom",
  professional_set: "radiocom",
  профессионалрадиостанциялар: "radiocom",
  // Accessories, baby and video monitors and industrial PDAs have no page on
  // this site. Answered as gone, not sent somewhere unrelated.
  access: "gone",
  accessories: "gone",
  aксессуарлар: "gone", // sic: a Latin "a" and Cyrillic after it, as the old site spelled it
  аксессуарлар: "gone",
  "radio-videonyani": "gone",
  radio_video_baby: "gone",
  "радио-видео-енага": "gone",
  kpk: "gone",
};

/** Products the site does not sell: answered as gone, before any model match. */
const NOT_SOLD = [
  // Baby and video monitors
  /(^|-)(am2[14]|mbp\d+[a-z]*|vm\d+|peekabo|radionyan|videonyan|радионян|видеонян|радио-видео)/,
  // Accessories — checked before model tokens, so "headset-for-t82" is an
  // accessory that has gone, not the T82 itself.
  /(^|-)(headset|earpiece|garnitur|гарнитур|clip|klips|клипс|battery|akkumulyator|аккумулятор|charger|zaryad|зарядн|наушник|chexol|чехол)/,
];

/**
 * Radiocom models. Matched before anything strips a WordPress de-dup suffix:
 * the digits in `rc-50`, `rc-21` and `rcd-30` are model names.
 */
function radiocomModel(s: string): string | null {
  const rcd = s.match(/(?:^|-)rcd-?(30|40|50|60|70)(?:-|$)/);
  if (rcd) return `rcd-${rcd[1]}`;
  // The RC-5D was renamed; its successor in the line is the RCD-40 PRO.
  if (/(?:^|-)rc-?5d(?:-|$)/.test(s)) return "rcd-40";
  const rc = s.match(/(?:^|-)rc-?(10|20|21|50)(?:-|$)/);
  if (rc) return rc[1] === "21" ? "rc-20" : `rc-${rc[1]}`;
  return null;
}

const RED = /(?:^|-)(red|красн[а-я]*|қизил|qizil)(?:-|$)/;
const BLUE = /(?:^|-)(blue|син[а-я]*|кўк|ko-?k)(?:-|$)/;

/** Motorola models, with WordPress's `-2` … `-8` de-dup suffix already removed. */
function motorolaModel(s: string): string | "brand" | null {
  const has = (re: RegExp) => re.test(s);
  if (has(/(?:^|-)t82-?extreme-?rsm(?:-|$)/)) return "brand"; // hidden model, no page
  if (has(/(?:^|-)t82-?extreme-?quad(?:-|$)/)) return "t82-extreme-quad";
  if (has(/(?:^|-)t82-?extreme(?:-|$)/)) return "t82-extreme";
  if (has(/(?:^|-)t82(?:-|$)/)) return "t82";
  if (has(/(?:^|-)t72(?:-|$)/)) return "t72";
  if (has(/(?:^|-)t62(?:-|$)/)) return has(RED) ? "t62-red" : "t62-blue";
  if (has(/(?:^|-)t42(?:-|$)/)) {
    if (has(/(?:^|-)triple(?:-|$)/)) return "t42-triple";
    if (has(/(?:^|-)quad(?:-|$)/)) return "t42-quad";
    if (has(RED)) return "t42-red";
    if (has(BLUE)) return "t42-blue";
    return "brand"; // colour unknown — the brand page lists both
  }
  if (has(/(?:^|-)(tlkr-?)?t92-?(h2o)?(?:-|$)/)) return "tlkr-t92h2o";
  if (has(/(?:^|-)xt-?185(?:-|$)/)) return "xt185";
  if (has(/(?:^|-)xt-?420(?:-|$)/)) return "xt420";
  // Models the site names but has no page for, and the professional range it
  // does not list: the brand page.
  if (
    has(
      /(?:^|-)(xt-?665d?|cl[pk]-?446|dp-?\d+\w*|dm-?\d+\w*|slr-?\d+\w*|ретранслятор\w*|repeater)(?:-|$)/,
    )
  )
    return "brand";
  return null;
}

/* ─── Resolution ────────────────────────────────────────────── */

function resolveProduct(slug: string, l: Locale): LegacyResult {
  const s = fold(slug);
  if (NOT_SOLD.some((re) => re.test(s))) return "gone";
  const rc = radiocomModel(s);
  if (rc) return product(l, "radiocom", rc);
  if (/(?:^|-)hytera(?:-|$)/.test(s)) return at(l, "poc");
  const moto = motorolaModel(s.replace(/-[2-8]$/, ""));
  if (moto === "brand") return at(l, "motorola");
  if (moto) return product(l, "motorola", moto);
  // A model nobody mapped, under a brand the site carries: that brand's page.
  if (/motorola|моторола|talkabout/.test(s)) return at(l, "motorola");
  if (/radiocom|радиоком/.test(s)) return at(l, "radiocom");
  return "gone";
}

/** WordPress's file and feed paths, and its sitemaps. */
function resolvePath(pathname: string): LegacyResult {
  const p = pathname.toLowerCase();
  if (/^\/(wp-sitemap[\w-]*|sitemap_index|[\w-]+-sitemap\d*)\.xml$/.test(p))
    return { path: "/sitemap.xml" };
  if (/^\/(wp-content|wp-includes|wp-admin|wp-json)(\/|$)/.test(p)) return "gone";
  // Archive pages of a blog the new site does not have.
  if (/^\/(category|tag|author)\/./.test(p)) return "gone";
  if (/^\/(wp-login\.php|xmlrpc\.php|feed|comments\/feed)\/?$/.test(p)) return "gone";
  return null;
}

export function resolveLegacy(url: URL): LegacyResult {
  const pathname = url.pathname;
  if (pathname !== "/" && pathname !== "/index.php") return resolvePath(pathname);

  const q = url.searchParams;
  if (!hasWordPressKey(q.keys())) return pathname === "/index.php" ? at("ru", "") : null;

  const get = (k: string) => clean(q.get(k));
  const explicit = localeOf(get("lang"));
  const l: Locale = explicit ?? "ru";

  const pageId = get("page_id");
  if (pageId) {
    const page = PAGE_IDS[pageId];
    return page ? at(explicit ?? page.lang, page.section) : "gone";
  }
  const postType = get("post_type");
  if (postType) return postType === "services" ? at(l, "service") : "gone";

  const category = get("products_category");
  if (category) {
    const target = CATEGORIES[category];
    if (target === "gone" || target === undefined) return "gone";
    return at(l, target);
  }

  const productSlug = get("products");
  if (productSlug) return resolveProduct(productSlug, l);

  const search = q.get("s");
  if (search !== null) {
    const term = search.trim();
    return { path: term ? `/${l}/search?q=${encodeURIComponent(term)}` : `/${l}/search` };
  }

  // A post, a tag, an author or an attachment: the new site has no blog.
  if (["p", "cat", "tag", "attachment_id", "author", "m", "feed", "preview"].some((k) => q.has(k)))
    return "gone";

  // `?lang=X` on its own, with or without `&paged=N`: that language's home.
  return at(l, "");
}
