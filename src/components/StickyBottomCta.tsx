import { useTranslation } from "react-i18next";
import { useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { openLead } from "./LeadFormSheet";
import { spring } from "@/lib/springs";

export function StickyBottomCta() {
  const { t } = useTranslation();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  // Every URL carries a locale prefix now ("/ru", "/en/radiocom"), so comparing
  // against the bare paths matched nothing and this CTA had stopped rendering
  // on every page. Strip the prefix first, the way Nav does.
  const path = pathname.replace(/^\/(ru|en|uz)(?=\/|$)/, "") || "/";
  // Home plus the whole product tree: brand pages, story pages and specs
  // pages are all buy-intent surfaces.
  const shouldShow =
    path === "/" ||
    path.startsWith("/radiocom") ||
    path.startsWith("/motorola") ||
    path.startsWith("/compare");

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ ...spring, delay: 0.4 }}
          className="lg:hidden fixed bottom-4 left-4 right-4 z-40"
        >
          <button
            onClick={() => openLead({ title: t("lead.sticky_cta") })}
            className="pill pill-accent w-full py-4 shadow-2xl"
          >
            {t("lead.sticky_cta")}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
