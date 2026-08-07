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

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import "../lib/i18n";
import { hydrateLanguage } from "../lib/i18n";
import { ScrollProgress } from "@/components/ScrollProgress";

import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { LeadFormSheet } from "../components/LeadFormSheet";
import { StickyBottomCta } from "../components/StickyBottomCta";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-pitch px-6">
      <div className="max-w-md text-center">
        <div className="text-signal text-sm mb-4">404</div>
        <h1 className="headline text-5xl md:text-6xl text-crisp">This page can’t be found.</h1>
        <p className="mt-4 text-cool">The link may be broken, or the page may have been moved.</p>
        <Link to="/" className="pill pill-primary mt-8 inline-flex">Go to homepage</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-pitch px-6">
      <div className="max-w-md text-center">
        <div className="text-signal text-sm mb-4">Something went wrong</div>
        <h1 className="headline text-5xl text-crisp">We hit a snag.</h1>
        <p className="mt-4 text-cool">Try again, or head back home.</p>
        <div className="mt-8 flex gap-3 justify-center">
          <button onClick={() => { router.invalidate(); reset(); }} className="pill pill-primary">Retry</button>
          <a href="/" className="pill pill-ghost">Home</a>
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
      { title: "Radiocom — Professional Radio Systems in Uzbekistan" },
      { name: "description", content: "11 years. 10,000+ clients. Motorola, Hytera and PoC radios with authorized service, free testing and nationwide delivery." },
      { property: "og:title", content: "Radiocom — Professional Radio Systems in Uzbekistan" },
      { property: "og:description", content: "11 years. 10,000+ clients. Motorola, Hytera and PoC radios with authorized service, free testing and nationwide delivery." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#ffffff" },
      { name: "twitter:title", content: "Radiocom — Professional Radio Systems in Uzbekistan" },
      { name: "twitter:description", content: "11 years. 10,000+ clients. Motorola, Hytera and PoC radios with authorized service, free testing and nationwide delivery." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/2c10cbb9-e240-4528-a145-b23d0936f9da" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/2c10cbb9-e240-4528-a145-b23d0936f9da" },
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
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => hydrateLanguage()));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-pitch text-crisp">
        <ScrollProgress />
        <Nav />

        <main>
          <Outlet />
        </main>
        <ContactBlock />
        <Footer />

        <StickyBottomCta />
        <LeadFormSheet />
      </div>
    </QueryClientProvider>
  );
}
