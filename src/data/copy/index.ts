/**
 * Loads a landing page's long-form copy for one language.
 *
 * Each page's copy is its own module under `pages/`, reached through an
 * explicit `import()`, so Vite emits it as a chunk of its own and no route pays
 * for another page's text — and none of it enters the eager bundle, which is
 * where the locale JSONs live (see `industries-content.ts` for the
 * measurement that set this pattern).
 *
 * Called from the route `loader`. On the server-rendered first view the result
 * is serialised into the HTML, so it is narrowed to one language and its
 * `{{placeholders}}` are already filled from the catalogue: the client renders
 * it without fetching a chunk, and the FAQ text it shows is the exact text its
 * `FAQPage` quotes.
 */
import { catalogueFacts } from "@/data/copy/facts";
import { fillDeep, pickDeep, type PageCopy } from "@/data/copy/pick";
import { DEFAULT_LANG, isLang } from "@/lib/i18n";

export const pageCopyLoaders = {
  home: () => import("@/data/copy/pages/home"),
  radiocom: () => import("@/data/copy/pages/radiocom"),
  motorola: () => import("@/data/copy/pages/motorola"),
  compare: () => import("@/data/copy/pages/compare"),
  poc: () => import("@/data/copy/pages/poc"),
  service: () => import("@/data/copy/pages/service"),
  industries: () => import("@/data/copy/pages/industries"),
  rent: () => import("@/data/copy/pages/rent"),
  solutions: () => import("@/data/copy/pages/solutions"),
  about: () => import("@/data/copy/pages/about"),
  contacts: () => import("@/data/copy/pages/contacts"),
} satisfies Record<string, () => Promise<{ default: PageCopy }>>;

export type PageCopyKey = keyof typeof pageCopyLoaders;

export async function loadPageCopy(key: PageCopyKey, langParam: string) {
  const lang = isLang(langParam) ? langParam : DEFAULT_LANG;
  const copy = (await pageCopyLoaders[key]()).default;
  return fillDeep(pickDeep(copy, lang), catalogueFacts(lang));
}
