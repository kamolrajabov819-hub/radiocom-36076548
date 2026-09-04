/**
 * Every translation key is reachable from the code.
 *
 * This gate exists because a dead key silently broke a live one. `hero.*` was
 * superseded by `home.hero.*` and left behind — eight strings no visitor could
 * ever see. The tenure check in `verify-seo.ts` was then written against
 * `hero.sub`, so it guarded invisible copy while the hero people actually read
 * went unguarded. Nothing could tell the two apart, because nothing knew which
 * keys were live.
 *
 * Roughly 15% of `ru.json` was in that state: whole groups (`marquee`, most of
 * `catalog`, most of `product`) kept in step by `verify-i18n`'s parity check
 * across three locales, translated on every pass, and rendered nowhere.
 *
 * **Matching is the hard part, and it has three traps**, each of which produced
 * a confidently wrong answer while this was being written:
 *
 *   1. A key may be built from a template — `industries.${slug}.name`. Compare
 *      segment by segment, treating an interpolated segment as a wildcard.
 *   2. An interpolation can itself contain a dot — `meta.section.${sec.key}_name`.
 *      Splitting that on "." yields four segments, not three, and the reference
 *      then matches nothing. Interpolations are masked before splitting.
 *   3. i18next resolves `x` with `{count}` to `x_one` / `x_few` / `x_many`, so a
 *      plural variant is live whenever its base is.
 *
 * The self-check below is the guard against getting those wrong again: a short
 * list of keys known to be live, asserted before any verdict is reported. A
 * matcher that breaks fails loudly rather than proposing that several hundred
 * live strings be deleted.
 *
 * **The wildcard is also this check's blind spot, and it hid five dead keys.**
 * `Sitemap.tsx` renders `` t(`nav.${brand}`) ``. That single interpolated call
 * makes `nav.•WILD•` match *every* key under `nav`, so `nav.contact`,
 * `nav.download`, `nav.theme_light`, `nav.theme_dark` and `nav.tradein_badge`
 * were reported live while rendering nowhere — the same shape as the `hero.sub`
 * bug this file was written for, one level up.
 *
 * Two of the five hid particularly well: their text is identical to a live key's
 * («Скачать каталог» is also `industries.cta_secondary`, «Trade-In» is also
 * `home.bento.tradein.title`), so grepping the rendered pages for the string
 * finds it and looks satisfied. Duplicate values are not a defect in themselves,
 * but they do mask dead keys from any text-based check.
 *
 * There is no sound fix inside a regex matcher — resolving `${brand}` needs the
 * values, which live in a const array in another module. So instead the hole is
 * **counted and ratcheted**: `WILDCARD_ONLY_BUDGET` records how many keys are
 * currently reachable *only* through an interpolated reference. The number may
 * fall freely; if it rises, the build fails and someone looks at the new ones.
 * That cannot prove a key is live, but it does stop the blind spot growing in
 * silence, which is what let these five sit there.
 *
 * Run: bun scripts/verify-i18n-usage.ts
 */
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const ru = JSON.parse(readFileSync("src/i18n/ru.json", "utf8")) as Record<string, unknown>;

/** Every leaf path in the locale file, plus array parents (reachable wholesale). */
const leaves: string[] = [];
(function walk(node: Record<string, unknown>, path: string) {
  for (const [k, v] of Object.entries(node)) {
    const p = path ? `${path}.${k}` : k;
    if (Array.isArray(v)) {
      leaves.push(p);
      v.forEach((item, i) =>
        item && typeof item === "object"
          ? walk(item as Record<string, unknown>, `${p}.${i}`)
          : leaves.push(`${p}.${i}`),
      );
    } else if (v && typeof v === "object") {
      walk(v as Record<string, unknown>, p);
    } else {
      leaves.push(p);
    }
  }
})(ru, "");

/**
 * `src/` and `scripts/` are read separately on purpose.
 *
 * A key referenced only from `scripts/` is not live — nobody renders it. That
 * is the precise shape of the bug this gate was written for: `hero.sub` was
 * dead UI copy that stayed "reachable" solely because a build check asserted
 * against it. A test keeping its own subject alive proves nothing, so those are
 * reported separately rather than counted as used.
 */
/**
 * Comments are stripped first. A JSDoc line reading `` `hero.sub` `` is prose
 * about a key, not a use of it — and counting it as one is how `hero.sub`
 * escaped this gate on the first run, the very string the gate exists to catch.
 */
const stripComments = (code: string) =>
  code.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|[^:])\/\/[^\n]*/g, "$1 ");

const read = (dir: string) =>
  execSync(
    `find ${dir} -type f \\( -name '*.ts' -o -name '*.tsx' -o -name '*.mts' \\) -not -path '*/node_modules/*'`,
    { encoding: "utf8" },
  )
    .trim()
    .split("\n")
    .map((f) => stripComments(readFileSync(f, "utf8")))
    .join("\n");

const src = read("src");
const scriptsSrc = read("scripts");

/** Any quoted or backticked dotted token that could name a key. */
const KEY_RE = /["'`]([a-zA-Z_][\w-]*(?:\.(?:\$\{[^}]*\}|[\w-]+)+)+)["'`]/g;

// Trap 2: mask interpolations to a dot-free sentinel before splitting.
const WILD = "•WILD•";
const segsOf = (text: string) =>
  [...text.matchAll(KEY_RE)].map((m) => m[1].replace(/\$\{[^}]*\}/g, WILD).split("."));

const refSegs = segsOf(src);
const scriptSegs = segsOf(scriptsSrc);

const matches = (keySegs: string[], refSeg: string[]) =>
  refSeg.length === keySegs.length &&
  refSeg.every((seg, i) => seg.includes(WILD) || seg === keySegs[i]);

const PLURAL = /_(zero|one|two|few|many|other)$/;

function reachableIn(key: string, segs: string[][]): boolean {
  const parts = key.split(".");
  // Reachable if the key or any ancestor is referenced — an ancestor may be
  // pulled wholesale with `returnObjects: true`.
  for (let i = parts.length; i > 0; i--) {
    if (segs.some((r) => matches(parts.slice(0, i), r))) return true;
  }
  return false;
}

function used(key: string): boolean {
  if (PLURAL.test(key) && used(key.replace(PLURAL, ""))) return true;
  return reachableIn(key, refSegs);
}

/** Referenced by a build script but rendered nowhere. */
function scriptOnly(key: string): boolean {
  if (used(key)) return false;
  if (PLURAL.test(key) && scriptOnly(key.replace(PLURAL, ""))) return true;
  return reachableIn(key, scriptSegs);
}

const MUST_BE_LIVE = [
  "industries.horeca.name", // built from `industries.${slug}.name`
  "industries.construction.faq.0.q", // reached via returnObjects on the array
  "meta.section.poc_name", // interpolation containing a dot
  "meta.brand.radiocom_desc", // interpolation plus literal suffix
  "meta.brand.radiocom_desc_many", // i18next plural variant
  "meta.industry.title",
];
const broken = MUST_BE_LIVE.filter((k) => !used(k));
if (broken.length) {
  console.log(
    "FAIL self-check — the matcher reports provably live keys as unreferenced:\n     " +
      broken.join("\n     ") +
      "\n     Fix the matcher; do not delete these.",
  );
  process.exit(2);
}

const dead = leaves.filter((k) => !used(k) && !scriptOnly(k));
const testOnly = leaves.filter((k) => scriptOnly(k));

/**
 * Keys no literal reference reaches — only an interpolated one.
 *
 * `matches()` with no wildcard segment is the strict form: it is what the check
 * would say if nothing were ever built from a template. The difference between
 * the two answers is exactly the set this check cannot vouch for.
 */
const literalOnly = (keySegs: string[], refSeg: string[]) =>
  refSeg.length === keySegs.length && refSeg.every((seg, i) => seg === keySegs[i]);

const reachedLiterally = (key: string) => {
  const parts = key.split(".");
  for (let i = parts.length; i > 0; i--) {
    if (refSegs.some((r) => literalOnly(parts.slice(0, i), r))) return true;
  }
  return PLURAL.test(key) && reachedLiterally(key.replace(PLURAL, ""));
};

const wildcardOnly = leaves.filter((k) => used(k) && !reachedLiterally(k));

/**
 * The high-water mark, not a target. Lower it whenever the real number drops —
 * the check prints it — and never raise it without reading the keys it lets in.
 */
const WILDCARD_ONLY_BUDGET = 249;

if (wildcardOnly.length > WILDCARD_ONLY_BUDGET) {
  const byGroup: Record<string, number> = {};
  for (const k of wildcardOnly) byGroup[k.split(".")[0]] = (byGroup[k.split(".")[0]] ?? 0) + 1;
  console.log(
    `FAIL ${wildcardOnly.length} keys are reachable only through an interpolated\n` +
      `     reference, up from the recorded ${WILDCARD_ONLY_BUDGET}. This check cannot tell\n` +
      "     whether those render at all — one interpolated key vouches for every\n" +
      "     key in its group, which is how five dead nav.* keys survived it.\n\n" +
      Object.entries(byGroup)
        .sort((a, b) => b[1] - a[1])
        .map(([g, n]) => `     ${g}: ${n}`)
        .join("\n") +
      `\n\n     Reference the new keys literally, or lower the budget if they really\n` +
      `     do need a template.`,
  );
  process.exit(1);
}

if (testOnly.length) {
  console.log(
    `FAIL ${testOnly.length} key(s) are referenced only by build scripts, never rendered:\n     ` +
      testOnly.join("\n     ") +
      "\n     A check asserting against copy no visitor sees guards nothing.\n" +
      "     Point the check at the live key, then delete these.",
  );
}

if (dead.length) {
  const byGroup: Record<string, string[]> = {};
  for (const k of dead) (byGroup[k.split(".")[0]] ??= []).push(k);
  console.log(`FAIL ${dead.length} translation key(s) are never referenced from src/:`);
  for (const [g, ks] of Object.entries(byGroup).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`     ${g} (${ks.length}): ${ks.map((k) => k.slice(g.length + 1)).join(", ")}`);
  }
  console.log(
    "\n     Delete them from ru.json, en.json and uz.json, or reference them.\n" +
      "     A key nobody renders is still translated, reviewed and kept in step\n" +
      "     by verify-i18n — cost with no reader.",
  );
  process.exit(1);
}

if (testOnly.length) process.exit(1);

console.log(
  `ok  all ${leaves.length} translation keys are rendered from src/` +
    ` (${wildcardOnly.length}/${WILDCARD_ONLY_BUDGET} reached only via an interpolated key)`,
);
