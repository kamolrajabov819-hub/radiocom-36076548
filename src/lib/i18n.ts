import i18next, { type i18n as I18nInstance } from "i18next";
import ru from "@/i18n/ru.json";
import uz from "@/i18n/uz.json";
import en from "@/i18n/en.json";

export const LANGS = ["ru", "en", "uz"] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "ru";

export const isLang = (v: unknown): v is Lang =>
  typeof v === "string" && (LANGS as readonly string[]).includes(v);

const resources = {
  ru: { translation: ru },
  uz: { translation: uz },
  en: { translation: en },
} as const;

/**
 * One immutable i18next instance per language.
 *
 * The previous implementation exported a single shared instance and called
 * `changeLanguage` on it. Under SSR that is a cross-request data race: two
 * concurrent requests for /en/catalog and /uz/poc mutate the same object, so one
 * request can render in the other's language. It never shows up in development,
 * where requests arrive one at a time.
 *
 * Holding a separate instance per language and never mutating it removes the
 * race by construction — concurrent requests for different locales touch
 * different objects — while still avoiding the cost of rebuilding an instance on
 * every render.
 *
 * Deliberately *not* `.use(initReactI18next)`: that registers the instance as
 * react-i18next's global default, so a `useTranslation()` outside
 * `<I18nextProvider>` silently resolves against whichever language was
 * constructed first instead of the one in the URL. That is exactly how the whole
 * site chrome — nav, contacts, footer — ended up stuck in one language while the
 * page body translated. Without the global default such a component throws, so
 * the mistake cannot be made quietly again.
 */
const instances = new Map<Lang, I18nInstance>();

export function getI18n(lang: Lang): I18nInstance {
  const existing = instances.get(lang);
  if (existing) return existing;

  const instance = i18next.createInstance();
  instance.init({
    resources,
    lng: lang,
    fallbackLng: DEFAULT_LANG,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
  instances.set(lang, instance);
  return instance;
}

/** `t()` for code that runs outside React — route `head()`, schema builders, scripts. */
export function tFor(lang: Lang) {
  return getI18n(lang).getFixedT(lang);
}
