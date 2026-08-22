import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { I18nextProvider, useTranslation } from "react-i18next";

import appCss from "../styles.css?url";
import {
  jsonLd,
  localBusinessSchema,
  localePath,
  organizationSchema,
  webSiteSchema,
} from "@/lib/seo";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { getI18n } from "@/lib/i18n";
import { useLang } from "@/lib/locale";
import { useSmoothScroll } from "@/lib/motion";
import { ScrollProgress } from "@/components/ScrollProgress";

import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { LeadFormSheet } from "../components/LeadFormSheet";
import { StickyBottomCta } from "../components/StickyBottomCta";
import { ContactBlock } from "../components/ContactBlock";

/**
 * Puts a subtree inside the i18next instance for the language in the URL.
 *
 * react-i18next resolves `useTranslation()` through this provider only — no
 * instance is registered as a global default (see `src/lib/i18n.ts`) — so every
 * component that translates must render underneath one of these.
 */
function LocaleProvider({ children }: { children: ReactNode }) {
  const lang = useLang();
  return <I18nextProvider i18n={getI18n(lang)}>{children}</I18nextProvider>;
}

function NotFoundComponent() {
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

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <LocaleProvider>
      <ErrorBody error={error} reset={reset} />
    </LocaleProvider>
  );
}

function ErrorBody({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const { t } = useTranslation();
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-pitch px-6">
      <div className="max-w-md text-center">
        <div className="text-signal text-sm mb-4">{t("error.err_code")}</div>
        <h1 className="headline text-5xl text-crisp">{t("error.err_title")}</h1>
        <p className="mt-4 text-cool">{t("error.err_sub")}</p>
        <div className="mt-8 flex gap-3 justify-center">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="pill pill-primary"
          >
            {t("error.err_retry")}
          </button>
          <a href="/" className="pill pill-ghost">
            {t("error.err_home")}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      // Site-wide fallback, in Russian to match the SSR render (i18n lng: "ru").
      // Individual routes override these with page-specific copy.
      { title: "Radiocom — рации и радиостанции в Узбекистане" },
      {
        name: "description",
        content:
          "11 лет на рынке, 10 000+ клиентов. Радиостанции Motorola, Hytera, PoC и Radiocom RC с официальной гарантией, бесплатным тестом и доставкой по Узбекистану.",
      },
      { property: "og:site_name", content: "Radiocom" },
      { property: "og:title", content: "Radiocom — рации и радиостанции в Узбекистане" },
      {
        property: "og:description",
        content:
          "Радиостанции Motorola, Hytera, PoC и Radiocom RC с официальной гарантией, бесплатным тестом и доставкой по Узбекистану.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "ru_RU" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#ffffff" },
      { name: "twitter:title", content: "Radiocom — рации и радиостанции в Узбекистане" },
      {
        name: "twitter:description",
        content:
          "Радиостанции Motorola, Hytera, PoC и Radiocom RC с официальной гарантией, бесплатным тестом и доставкой по Узбекистану.",
      },
      {
        property: "og:image",
        content: "https://radiocom.uz/og-radiocom.jpg",
      },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Radiocom — Motorola и Radiocom RC в Ташкенте" },
      {
        name: "twitter:image",
        content: "https://radiocom.uz/og-radiocom.jpg",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      // Inter is self-hosted — see the @font-face block at the top of
      // styles.css. The three fonts.googleapis.com / fonts.gstatic.com tags
      // that stood here were render-blocking: an extra DNS lookup, TLS
      // handshake and round trip to a third party before any text could
      // paint. The subsets ship from our own origin now, so they are covered
      // by the same connection as the stylesheet that references them.
    ],
    // Business identity graph — emitted once for the whole site, and
    // language-neutral by construction. Child routes add their own page-level
    // schema (Product, BreadcrumbList, ItemList, SiteNavigationElement), which
    // is where anything locale-dependent belongs: the root head() has no route
    // params, so it cannot know which language it is rendering.
    scripts: [jsonLd(organizationSchema()), jsonLd(localBusinessSchema()), jsonLd(webSiteSchema())],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  // The URL is the only source of truth for language, and it is available here
  // on the server — so the server response carries the right `lang` instead of
  // shipping "ru" to every locale and correcting it after hydration. Crawlers
  // read the server HTML and never see the correction; the page was
  // contradicting its own hreflang and og:locale on every /en and /uz URL.
  const lang = useLang();
  return (
    <html lang={lang}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/*
        The provider wraps the *whole* tree, not just <Outlet />. Nav, the
        contact block, the footer, the sticky CTA and the lead form all live out
        here; when the provider sat on the locale route they resolved against
        react-i18next's global default instance instead of the URL's language,
        so switching language translated the page body and nothing around it.
      */}
      <LocaleProvider>
        <SiteChrome />
      </LocaleProvider>
    </QueryClientProvider>
  );
}

function SiteChrome() {
  const { t } = useTranslation();
  const lang = useLang();

  // Lenis + ScrollTrigger, mounted once for the document. No-ops under
  // prefers-reduced-motion and never runs during SSR.
  useSmoothScroll();

  return (
    /*
      reducedMotion="user" makes every Framer Motion component honour
      prefers-reduced-motion: transform and layout animations are dropped,
      opacity ones kept. The global CSS block in styles.css only neutralises
      CSS animation, so without this the JS-driven motion ignored the setting.
    */
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-pitch text-crisp">
        {/*
          Skip link: the first tab stop on every page, visually hidden until
          focused. Without it, keyboard and screen-reader users tab through the
          whole fixed nav on every navigation.
        */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-crisp focus:px-5 focus:py-2.5 focus:text-[14px] focus:font-medium focus:text-pitch focus:outline-none focus:ring-2 focus:ring-signal focus:ring-offset-2"
        >
          {t("nav.skip_to_content")}
        </a>

        <ScrollProgress />
        <Nav />

        <main id="main">
          <Outlet />
        </main>
        <ContactBlock />
        <Footer />

        <StickyBottomCta />
        <LeadFormSheet />
      </div>
    </MotionConfig>
  );
}
