/**
 * Vocabulary retired on purpose does not come back.
 *
 * The plan for this round asked for a check that "listed acronyms never appear
 * in visible copy without a gloss". That check cannot be written honestly.
 * Deciding whether a sentence glosses a term needs judgement, and the site has
 * legitimate bare uses — `search.placeholder` is «Например: IP67, DMR, RCD-70»,
 * a list of example queries, and a meta description carrying "PoC" is how
 * someone searching for PoC finds the page at all. A gate that flags those
 * teaches people to skip it, which costs more than it saves.
 *
 * So this is the narrow, decidable half: a list of words removed deliberately,
 * with the plain phrase that replaced each one. No judgement, no false
 * positives, and it protects the specific work rather than a general principle.
 *
 * **Scope matters.** `meta.*` is the search surface, not the page — a person
 * hunting for "PoC рации Узбекистан" should still find the page whose visible
 * copy now says «Рации через мобильную сеть». So acronyms banned from the page
 * are allowed in metadata, and the entries below say which.
 *
 * Run: bun scripts/verify-jargon.ts
 */
import { readFileSync, readdirSync } from "node:fs";

/**
 * A word boundary that works in Russian.
 *
 * JavaScript's `\b` is defined against `\w`, which is `[A-Za-z0-9_]` — ASCII
 * only. Between a space and «К» there are two non-word characters and therefore
 * no boundary, so `/\bКП\b/` matches nothing at all. Every Cyrillic pattern in
 * the list below was written that way first and every one of them was inert;
 * the check reported a clean run against copy that had «Запросить КП» in it.
 * Only mutation-testing this file surfaced that, which is the argument for
 * doing it to every gate.
 *
 * `\w` in a quantifier has the same fault: `сквозны\w*` cannot match
 * «сквозные».
 */
const CYR = "А-Яа-яЁё";
const word = (body: string) => new RegExp(`(?<![${CYR}\\w])(?:${body})(?![${CYR}\\w])`, "i");

type Retired = {
  /** What must not reappear. Matched case-insensitively. */
  pattern: RegExp;
  /** What it was, and what replaced it — printed when the check fails. */
  was: string;
  now: string;
  /** Key prefixes exempt from the ban, with the reason. */
  allowIn?: { prefix: string; because: string }[];
};

const RETIRED: Retired[] = [
  {
    pattern: word("ПНР"),
    was: "«ПРОЕКТИРОВАНИЕ · ПНР» — пуско-наладочные работы, an internal abbreviation",
    now: "«ПРОЕКТИРОВАНИЕ · ЗАПУСК»",
  },
  {
    pattern: word("КПК|PDA"),
    was: "«Промышленные КПК» / «rugged PDAs» for warehouse terminals",
    now: "«Складские терминалы со сканером» / «handheld scanners»",
  },
  {
    pattern: word("КП"),
    was: "«Запросить КП» on the lead form — коммерческое предложение, abbreviated on the site's most important button",
    now: "«Запросить цену»",
  },
  {
    pattern: /last-known-position/i,
    was: "English inside Russian and English copy alike",
    now: '«показывает последнюю точку, где поймала сигнал» / "shows the last place it had a signal"',
  },
  {
    pattern: /приёмо-сдаточн|пуско-наладк/i,
    was: "«Пуско-наладка и приёмо-сдаточная документация»",
    now: "«Запускаем сеть и передаём документы»",
  },
  {
    pattern: word("сквозны[а-яё]* частот[а-яё]*|резервным[а-яё]* АКБ"),
    was: "«резервными АКБ и настройкой на собственные сквозные частоты»",
    now: "«с запасными аккумуляторами, уже настроенная на собственные частоты»",
  },
  {
    pattern: word("PUSH-TO-TALK"),
    was: "«PoC · PUSH-TO-TALK ЧЕРЕЗ СОТОВУЮ СЕТЬ» — an acronym, an English phrase, and a translation of the acronym in one line",
    now: "«РАЦИИ ЧЕРЕЗ МОБИЛЬНУЮ СЕТЬ»",
    allowIn: [
      { prefix: "meta.", because: "the search surface, where the term is what people type" },
    ],
  },
  {
    pattern: word("PoC"),
    was: "«PoC-рации», «PoC системы», «PoC против PMR» — never explained anywhere on the site",
    now: "«Рации через мобильную сеть», nav «Связь везде»",
    allowIn: [
      { prefix: "meta.", because: "the search surface, where the term is what people type" },
    ],
  },
];

const locales = readdirSync("src/i18n")
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""));

const strings: { key: string; lang: string; text: string }[] = [];
for (const lang of locales) {
  const walk = (node: unknown, path: string) => {
    if (typeof node === "string") strings.push({ key: path, lang, text: node });
    else if (Array.isArray(node)) node.forEach((v, i) => walk(v, `${path}.${i}`));
    else if (node && typeof node === "object")
      for (const [k, v] of Object.entries(node)) walk(v, path ? `${path}.${k}` : k);
  };
  walk(JSON.parse(readFileSync(`src/i18n/${lang}.json`, "utf8")), "");
}

let fail = 0;
for (const term of RETIRED) {
  const hits = strings.filter(
    (s) =>
      term.pattern.test(s.text) && !(term.allowIn ?? []).some((a) => s.key.startsWith(a.prefix)),
  );
  if (!hits.length) continue;
  fail++;
  console.log(
    `FAIL retired wording is back in ${hits.length} string(s):\n` +
      `     was:  ${term.was}\n` +
      `     now:  ${term.now}\n` +
      hits.map((h) => `       ${h.lang}:${h.key}\n         ${h.text.slice(0, 90)}`).join("\n"),
  );
  if (term.allowIn?.length) {
    console.log(
      `     (allowed under ${term.allowIn.map((a) => a.prefix + "* — " + a.because).join("; ")})`,
    );
  }
}

if (fail) {
  console.log(
    `\n${fail} retired term(s) reappeared. Each was removed for a reason recorded above;\n` +
      "if the reason no longer holds, delete the entry from RETIRED rather than\n" +
      "working around the check.",
  );
  process.exit(1);
}

console.log(
  `ok  none of the ${RETIRED.length} retired terms appear in ${strings.length} strings` +
    ` across ${locales.length} locales`,
);
