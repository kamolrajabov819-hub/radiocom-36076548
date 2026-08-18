import { useParams } from "@tanstack/react-router";
import { DEFAULT_LANG, isLang, type Lang } from "@/lib/i18n";

/**
 * The locale of the current route, read from the URL.
 *
 * `strict: false` so this works from shared chrome (Nav, Footer, cards) that
 * renders under many different routes, and falls back to the default on the
 * legacy unprefixed paths that only exist to redirect.
 */
export function useLang(): Lang {
  const params = useParams({ strict: false }) as { lang?: string };
  return isLang(params.lang) ? params.lang : DEFAULT_LANG;
}
