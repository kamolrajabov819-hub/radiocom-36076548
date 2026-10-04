import { useTranslation } from "react-i18next";
import { useRouterState } from "@tanstack/react-router";
import { Phone, Send } from "lucide-react";
import { openLead } from "./LeadFormSheet";
import { PHONE_PRIMARY, TELEGRAM_URL, telHref } from "@/lib/contacts";

/**
 * The phone's always-there contact bar: call, Telegram, request.
 *
 * Shown on every page a visitor might land on from an ad or a search — home,
 * both brands and every product, compare, the industries, PoC, service and the
 * answers — and nowhere it would only be in the way (search, the HTML sitemap,
 * a 404). It used to cover only home, the brand trees and compare, which left
 * out the industry pages most likely to be ad landing pages.
 *
 * Rendered in the server HTML at full opacity, with a CSS rise for the
 * entrance. It was an `AnimatePresence` slide from `opacity: 0`, so on a slow
 * phone the one fixed call to action on the screen appeared only after
 * hydration.
 */
const COMMERCIAL = [
  "/radiocom",
  "/motorola",
  "/compare",
  "/industries",
  "/poc",
  "/service",
  "/answers",
  "/rent",
  "/solutions",
  "/contacts",
];

export function StickyBottomCta() {
  const { t } = useTranslation();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  // Every URL carries a locale prefix ("/ru", "/en/radiocom"); strip it first,
  // the way Nav does.
  const path = pathname.replace(/^\/(ru|en|uz)(?=\/|$)/, "") || "/";
  const shouldShow = path === "/" || COMMERCIAL.some((p) => path === p || path.startsWith(`${p}/`));
  if (!shouldShow) return null;

  const round =
    "flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-pitch text-crisp shadow-2xl ring-1 ring-border";

  return (
    <div
      data-placement="sticky"
      className="hero-rise lg:hidden fixed bottom-4 left-4 right-4 z-40 flex items-center gap-2"
    >
      <a
        href={telHref(PHONE_PRIMARY)}
        aria-label={`${t("contact.call")} ${PHONE_PRIMARY.display}`}
        className={round}
      >
        <Phone className="h-5 w-5" aria-hidden />
      </a>
      <a
        href={TELEGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("contact.telegram")}
        className={round}
      >
        <Send className="h-5 w-5" aria-hidden />
      </a>
      <button
        onClick={() => openLead({ title: t("lead.float") })}
        className="pill pill-accent min-w-0 flex-1 py-4 shadow-2xl"
      >
        {/* «Бесплатный тест», not «Бесплатное тестирование»: beside the call
            and Telegram buttons a 360px phone has room for about fifteen
            characters, and the long form was cut to «Бесплатное тестир…». */}
        <span className="truncate">{t("lead.float")}</span>
      </button>
    </div>
  );
}
