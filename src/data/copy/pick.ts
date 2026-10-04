/**
 * The `{ ru, en, uz }` shape every long-form copy module is written in, and the
 * one function that narrows a whole module to a single language.
 *
 * A route `loader` narrows before it returns, because whatever it returns is
 * serialised into the server-rendered HTML for hydration: one language there is
 * a third of three.
 */
import type { Lang } from "@/lib/i18n";

/** A string in all three published locales. */
export type L = { ru: string; en: string; uz: string };

/** `T` with every `L` inside it replaced by a plain string. */
export type Picked<T> = T extends L
  ? string
  : T extends readonly (infer U)[]
    ? Picked<U>[]
    : T extends object
      ? { [K in keyof T]: Picked<T[K]> }
      : T;

const isL = (v: unknown): v is L =>
  !!v && typeof v === "object" && !Array.isArray(v) && "ru" in v && "en" in v && "uz" in v;

export function pickDeep<T>(value: T, lang: Lang): Picked<T> {
  if (isL(value)) return value[lang] as Picked<T>;
  if (Array.isArray(value)) return value.map((v) => pickDeep(v, lang)) as Picked<T>;
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, pickDeep(v, lang)]),
    ) as Picked<T>;
  return value as Picked<T>;
}
