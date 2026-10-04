import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_LANG } from "@/lib/i18n";

/** Unprefixed `/about` → the Russian page, permanently — see `routes/service.tsx`. */
export const Route = createFileRoute("/about")({
  beforeLoad: () => {
    throw redirect({
      to: "/$lang/about",
      params: { lang: DEFAULT_LANG },
      statusCode: 301,
    });
  },
});
