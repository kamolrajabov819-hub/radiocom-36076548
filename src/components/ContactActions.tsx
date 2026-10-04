import { Phone, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PHONE_PRIMARY, TELEGRAM_URL, telHref } from "@/lib/contacts";

/**
 * The two ways to reach a person right now: call the primary number, or open
 * the manager's Telegram chat.
 *
 * Shown wherever a visitor might otherwise be stuck — under the contact form,
 * and in place of a success message when a lead fails to send — so a failed
 * request still ends in a conversation. Both clicks are counted by the
 * delegated listener in `analytics.ts`; `placement` says where it happened.
 */
export function ContactActions({
  placement,
  className,
  secondary = false,
}: {
  placement: string;
  className?: string;
  /**
   * Call as a ghost pill rather than the accent one — for a first screen that
   * already has its own accent action, where two red pills would compete.
   */
  secondary?: boolean;
}) {
  const { t } = useTranslation();
  return (
    // A plain join, not `cn()`: this renders in the site chrome on every page,
    // and `cn` would pull tailwind-merge — 26 KB — into every route's eager
    // bundle for one class list that never conflicts (`qa-weight` caught it).
    <div
      data-placement={placement}
      className={`flex flex-wrap items-center gap-3 ${className ?? ""}`}
    >
      <a
        href={telHref(PHONE_PRIMARY)}
        className={`pill ${secondary ? "pill-ghost" : "pill-accent"}`}
      >
        <Phone className="h-4 w-4" aria-hidden />
        {PHONE_PRIMARY.display}
      </a>
      <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="pill pill-ghost">
        <Send className="h-4 w-4" aria-hidden />
        {t("contact.telegram")}
      </a>
    </div>
  );
}

/**
 * The honeypot: a field no person sees, fills or tabs to. A bot filling every
 * input fills this one too, and `send-lead` then accepts the request silently
 * without forwarding it.
 *
 * Clipped to a 1px box in place (`sr-only`) rather than pushed off-screen: a
 * field parked at `left: -10000px` widens the page's scrollable area, which is
 * precisely what `qa-overflow` exists to catch. `aria-hidden` keeps it from
 * screen readers, which `sr-only` alone would not.
 */
export function HoneypotField({ name }: { name: string }) {
  return (
    <div aria-hidden="true" className="sr-only">
      <label>
        Website
        <input type="text" name={name} tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
