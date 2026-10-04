import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_LANG } from "@/lib/i18n";

/** Unprefixed `/solutions` → the Russian page, permanently — see `routes/service.tsx`. */
export const Route = createFileRoute("/solutions")({
  beforeLoad: () => {
    throw redirect({
      to: "/$lang/solutions",
      params: { lang: DEFAULT_LANG },
      statusCode: 301,
    });
  },
});
