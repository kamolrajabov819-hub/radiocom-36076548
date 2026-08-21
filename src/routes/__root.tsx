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
import { jsonLd, localBusinessSchema, organizationSchema, webSiteSchema } from "@/lib/seo";
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

function NotFoundBody() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen items-center justify-center bg-pitch px-6">
      <div className="max-w-md text-center">
        <div className="text-signal text-sm mb-4">{t("error.nf_code")}</div>
        <h1 className="headline text-5xl md:text-6xl text-crisp">{t("error.nf_title")}</h1>
        <p className="mt-4 text-cool">{t("error.nf_sub")}</p>
        <Link to="/" className="pill pill-primary mt-8 inline-flex">
          {t("error.nf_home")}
        </Link>
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
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
      },
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
