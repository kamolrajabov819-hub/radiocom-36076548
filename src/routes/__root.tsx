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
import { useTranslation } from "react-i18next";

import appCss from "../styles.css?url";
import {
  jsonLd,
  localBusinessSchema,
  organizationSchema,
  siteNavigationSchema,
  SITE_SECTIONS,
  webSiteSchema,
} from "@/lib/seo";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { useLang } from "@/lib/locale";
import { ScrollProgress } from "@/components/ScrollProgress";

import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { LeadFormSheet } from "../components/LeadFormSheet";
import { StickyBottomCta } from "../components/StickyBottomCta";
import { ContactBlock } from "../components/ContactBlock";

function NotFoundComponent() {
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
        content:
          "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/2c10cbb9-e240-4528-a145-b23d0936f9da",
      },
      {
        name: "twitter:image",
        content:
          "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/2c10cbb9-e240-4528-a145-b23d0936f9da",
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
    // Business identity graph — emitted once for the whole site. Child routes add
    // their own page-level schema (Product, BreadcrumbList, ItemList).
    scripts: [
      jsonLd(organizationSchema()),
      jsonLd(localBusinessSchema()),
      jsonLd(webSiteSchema()),
      jsonLd(siteNavigationSchema([...SITE_SECTIONS])),
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
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
  const { t } = useTranslation();
  const lang = useLang();

  // The shell renders lang="ru" for the server pass; the URL is authoritative, so
  // sync the real document language from the route. Screen readers, hyphenation
  // (`hyphens: auto` on .headline) and search engines all key off this attribute.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <QueryClientProvider client={queryClient}>
      {/*
        reducedMotion="user" makes every Framer Motion component honour
        prefers-reduced-motion: transform and layout animations are dropped,
        opacity ones kept. The global CSS block in styles.css only neutralises
        CSS animation, so without this the JS-driven motion ignored the setting.
      */}
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
    </QueryClientProvider>
  );
}
