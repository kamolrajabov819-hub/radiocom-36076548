import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { I18nextProvider } from "react-i18next";
import { getI18n, isLang, type Lang } from "@/lib/i18n";

/**
 * Locale layout. Every page lives under /ru, /en or /uz.
 *
 * The URL is the only source of truth for language — there is no localStorage
 * fallback — so each locale has its own crawlable URL and Google can index all
 * three. `getI18n` hands back a language-fixed instance, which is what keeps
 * concurrent SSR renders of different locales from colliding.
 */
export const Route = createFileRoute("/$lang")({
  beforeLoad: ({ params }) => {
    if (!isLang(params.lang)) throw notFound();
    return { lang: params.lang as Lang };
  },
  component: LocaleLayout,
});

function LocaleLayout() {
  const { lang } = Route.useParams();
  return (
    <I18nextProvider i18n={getI18n(lang as Lang)}>
      <Outlet />
    </I18nextProvider>
  );
}
