import type { ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import { getI18n } from "@/lib/i18n";
import { useLang } from "@/lib/locale";

/**
 * Puts a subtree inside the i18next instance for the language in the URL.
 *
 * react-i18next resolves `useTranslation()` through this provider only — no
 * instance is registered as a global default (see `src/lib/i18n.ts`) — so every
 * component that translates must render underneath one of these.
 *
 * Lives in its own module rather than in `__root.tsx` because the 404 needs it
 * too, and the 404 is reachable from `router.tsx` — which cannot import the
 * root route without cycling through `routeTree.gen`.
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const lang = useLang();
  return <I18nextProvider i18n={getI18n(lang)}>{children}</I18nextProvider>;
}
