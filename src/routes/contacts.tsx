import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_LANG } from "@/lib/i18n";

/** Unprefixed `/contacts` → the Russian page, permanently — see `routes/service.tsx`. */
export const Route = createFileRoute("/contacts")({
  beforeLoad: () => {
    throw redirect({
      to: "/$lang/contacts",
      params: { lang: DEFAULT_LANG },
      statusCode: 301,
    });
  },
});
