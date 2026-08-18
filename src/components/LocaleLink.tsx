import { Link } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";
import { useLang } from "@/lib/locale";

type LinkProps = ComponentProps<typeof Link>;

/**
 * A `Link` that keeps the reader inside their language.
 *
 * Call it with the unprefixed path — `to="/catalog"` — and it resolves to the
 * locale route, injecting the current `lang` param. Without this every internal
 * link would drop the visitor back to Russian.
 */
export function LocaleLink({
  to,
  params,
  children,
  ...rest
}: Omit<LinkProps, "to" | "params"> & {
  to: "/" | "/catalog" | "/catalog/$id" | "/poc" | "/service" | "/industries" | "/industries/$slug";
  params?: Record<string, string>;
  children?: ReactNode;
}) {
  const lang = useLang();
  const target = to === "/" ? "/$lang" : `/$lang${to}`;
  return (
    <Link {...(rest as Record<string, unknown>)} to={target} params={{ lang, ...(params ?? {}) }}>
      {children}
    </Link>
  );
}
