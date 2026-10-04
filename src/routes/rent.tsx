import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_LANG } from "@/lib/i18n";

/** Unprefixed `/rent` → the Russian page, permanently — see `routes/service.tsx`. */
export const Route = createFileRoute("/rent")({
  beforeLoad: () => {
    throw redirect({
      to: "/$lang/rent",
      params: { lang: DEFAULT_LANG },
      statusCode: 301,
    });
  },
});
