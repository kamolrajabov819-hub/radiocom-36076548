import { Link } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";
import { useLang } from "@/lib/locale";

type LinkProps = ComponentProps<typeof Link>;

/**
 * A `Link` that keeps the reader inside their language.
 *
 * Call it with the unprefixed path — `to="/radiocom"` — and it resolves to the
 * locale route, injecting the current `lang` param. Without this every internal
 * link would drop the visitor back to Russian.
 *
 * The `to` union is deliberately closed rather than `string`: it is what makes
 * a stale link a type error instead of a 404 found in production. Removing
 * `/catalog` from it is what surfaced every internal reference during the
 * migration to the brand-first tree.
 */
export function LocaleLink({
  to,
  params,
  children,
  ...rest
}: Omit<LinkProps, "to" | "params"> & {
  to:
    | "/"
    | "/radiocom"
    | "/motorola"
    | "/$brand/$model"
    | "/$brand/$model/specs"
    | "/compare"
    | "/poc"
    | "/service"
    | "/industries"
    | "/industries/$slug";
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
