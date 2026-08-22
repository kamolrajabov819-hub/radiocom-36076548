import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { LocaleProvider } from "@/components/LocaleProvider";
import { localePath } from "@/lib/seo";
import { useLang } from "@/lib/locale";

/**
 * The 404 page, in its own module because it has two callers.
 *
 * The root route's `notFoundComponent` covers a `notFound()` thrown from
 * inside a matched route — a hidden model, an unknown brand. It does *not*
 * cover a path that matches no route at all: TanStack falls back to the
 * router's `defaultNotFoundComponent` there, and with none set it renders a
 * bare `<p>Not Found</p>` inside the site chrome. That is what /ru/anything
 * served — correct 404 status, no heading, no navigation, no styling — while
 * /ru/motorola/clp446 got the real page. Both entry points now render this.
 *
 * Living here rather than in `__root.tsx` keeps `router.tsx` from importing the
 * root route, which would cycle back through `routeTree.gen`.
 */
export function NotFoundComponent() {
  return (
    <LocaleProvider>
      <NotFoundBody />
    </LocaleProvider>
  );
}

/**
 * The routes a lost visitor is actually looking for.
 *
 * Deliberately the same list the nav carries, in the same order, rather than a
 * shorter "highlights" set — someone who landed on a dead URL has already been
 * failed once, and guessing which two links they wanted fails them twice. Paths
 * are locale-neutral; `localePath` prefixes them from the URL the 404 was
 * served at, so a Russian visitor's recovery links stay Russian.
 */
const NF_LINKS = [
  { to: "/radiocom", key: "nav.radiocom" },
  { to: "/motorola", key: "nav.motorola" },
  { to: "/compare", key: "nav.compare" },
  { to: "/poc", key: "nav.poc" },
  { to: "/service", key: "nav.service" },
  { to: "/industries", key: "nav.industries" },
] as const;

function NotFoundBody() {
  const { t } = useTranslation();
  const lang = useLang();

  return (
    <div className="flex min-h-screen items-center justify-center bg-pitch px-6 py-24">
      <div className="w-full max-w-2xl text-center">
        <div className="mb-4 text-sm text-signal">{t("error.nf_code")}</div>
        <h1 className="headline text-5xl text-crisp md:text-6xl">{t("error.nf_title")}</h1>
        <p className="mt-4 text-cool">{t("error.nf_sub")}</p>

        {/* A 404 with one link home is a dead end: the visitor's only options
            are to start over or leave, and most leave. Google also reads a
            no-exit error page as a low-quality destination for whatever link
            pointed here. Offering the whole navigation costs nothing and keeps
            the session alive. */}
        <div className="mt-12">
          <div className="text-[13px] font-medium uppercase tracking-wider text-cool">
            {t("error.nf_where")}
          </div>
          <nav aria-label={t("error.nf_where")} className="mt-5">
            <ul className="flex flex-wrap items-center justify-center gap-3">
              {NF_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={localePath(lang, l.to)} className="pill pill-ghost">
                    {t(l.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <Link to={localePath(lang, "/")} className="pill pill-primary">
            {t("error.nf_home")}
          </Link>
          <p className="max-w-sm text-[14px] text-cool">{t("error.nf_search_hint")}</p>
        </div>
      </div>
    </div>
  );
}
