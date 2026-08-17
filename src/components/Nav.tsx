import { Link, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { LangToggle } from "./LangToggle";
import { openLead } from "./LeadFormSheet";
import { INDUSTRY_SLUGS } from "@/data/industries";
import logoAsset from "@/assets/radiocom-logo.png.asset.json";
import { assetUrl } from "@/lib/asset";
import { spring, springFast } from "@/lib/springs";

export function Nav() {
  const { t } = useTranslation();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const industriesRef = useRef<HTMLDivElement>(null);
  const industriesBtnRef = useRef<HTMLButtonElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setIndustriesOpen(false);
  }, [pathname]);

  // `pointerdown` rather than `mousedown` so a touch outside also dismisses.
  useEffect(() => {
    const onDoc = (e: PointerEvent) => {
      if (industriesRef.current && !industriesRef.current.contains(e.target as Node))
        setIndustriesOpen(false);
    };
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, []);

  // Escape closes whichever layer is open and returns focus to its trigger, so
  // keyboard users are never trapped (apple-design §16, wayfinding).
  useEffect(() => {
    if (!industriesOpen && !mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (mobileOpen) {
        setMobileOpen(false);
        menuBtnRef.current?.focus();
      } else if (industriesOpen) {
        setIndustriesOpen(false);
        industriesBtnRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [industriesOpen, mobileOpen]);

  // The mobile sheet covers the viewport, so freeze the page behind it — otherwise
  // the background scrolls under the overlay.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/catalog", label: t("nav.catalog") },
    { to: "/poc", label: t("nav.poc") },
    { to: "/service", label: t("nav.service") },
  ] as const;

  return (
    <>
      <header className="frost-nav fixed top-0 left-0 right-0 z-40">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-12 flex items-center justify-between gap-4">
          {/* Left nav */}
          <nav
            aria-label={t("footer.nav_col")}
            className="hidden lg:flex items-center gap-6 flex-1"
          >
            {links.map((l) => {
              const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`text-[13px] font-normal transition-opacity ${active ? "text-crisp" : "text-crisp/80 hover:text-crisp"}`}
                >
                  {l.label}
                </Link>
              );
            })}
            <div ref={industriesRef} className="relative">
              <button
                ref={industriesBtnRef}
                onClick={() => setIndustriesOpen((v) => !v)}
                aria-expanded={industriesOpen}
                aria-haspopup="menu"
                aria-controls="nav-industries-menu"
                className={`text-[13px] flex items-center gap-0.5 transition-opacity ${
                  pathname.startsWith("/industries")
                    ? "text-crisp"
                    : "text-crisp/80 hover:text-crisp"
                }`}
              >
                {t("nav.industries")}
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${industriesOpen ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>
              <AnimatePresence>
                {industriesOpen && (
                  <motion.div
                    id="nav-industries-menu"
                    role="menu"
                    aria-label={t("nav.industries")}
                    // Scales out of the trigger rather than fading in place, and
                    // exits back along the same path (apple-design §7). Spring, not
                    // a fixed tween, so it can be interrupted mid-flight (§3, §4).
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={springFast}
                    style={{ transformOrigin: "top left" }}
                    className="absolute top-full left-0 mt-2 w-64 rounded-2xl bg-popover shadow-xl border border-border p-2"
                  >
                    <Link
                      to="/industries"
                      className="block px-4 py-2.5 rounded-xl text-[13px] text-signal hover:bg-charcoal"
                    >
                      {t("industries.view_all")}
                    </Link>
                    {INDUSTRY_SLUGS.map((s) => (
                      <Link
                        key={s}
                        to="/industries/$slug"
                        params={{ slug: s }}
                        className="block px-4 py-2.5 rounded-xl text-[13px] text-crisp/80 hover:text-crisp hover:bg-charcoal"
                      >
                        {t(`industries.${s}.name`)}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Center wordmark */}
          <Link
            to="/"
            className="flex items-center lg:absolute lg:left-1/2 lg:-translate-x-1/2"
            aria-label="Radiocom"
          >
            <img
              src={assetUrl(logoAsset)}
              alt="Radiocom"
              width={180}
              height={32}
              className="h-[22px] w-auto"
            />
          </Link>

          {/* Right actions */}
          <div className="hidden lg:flex items-center justify-end gap-3 flex-1">
            <LangToggle />
            <button
              onClick={() => openLead({ title: t("nav.get_quote") })}
              className="pill pill-sm pill-accent"
            >
              {t("nav.get_quote")}
            </button>
          </div>

          {/* Mobile */}
          <div className="lg:hidden flex items-center gap-2">
            <LangToggle />
            <button
              ref={menuBtnRef}
              onClick={() => setMobileOpen(true)}
              className="h-9 w-9 flex items-center justify-center text-crisp"
              aria-label={t("nav.menu")}
              aria-expanded={mobileOpen}
              aria-controls="nav-mobile-sheet"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="nav-mobile-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={t("nav.menu")}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={spring}
            className="fixed inset-0 z-50 lg:hidden bg-pitch"
          >
            <div className="flex items-center justify-between px-5 h-12 border-b border-border">
              <img
                src={assetUrl(logoAsset)}
                alt="Radiocom"
                width={150}
                height={26}
                className="h-[20px] w-auto"
              />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label={t("nav.close")}
                className="text-crisp"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <motion.nav
              aria-label={t("nav.menu")}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.06 }}
              className="px-6 pt-8 pb-10 flex flex-col gap-6 overflow-y-auto h-[calc(100vh-3rem)]"
            >
              {links.map((l) => (
                <Link key={l.to} to={l.to} className="headline text-4xl text-crisp">
                  {l.label}
                </Link>
              ))}
              <div className="pt-6 border-t border-border">
                <div className="text-cool text-[13px] mb-4">{t("nav.industries")}</div>
                <div className="flex flex-col gap-3">
                  {INDUSTRY_SLUGS.map((s) => (
                    <Link
                      key={s}
                      to="/industries/$slug"
                      params={{ slug: s }}
                      className="text-crisp/90 text-lg"
                    >
                      {t(`industries.${s}.name`)}
                    </Link>
                  ))}
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  openLead({ title: t("nav.get_quote") });
                }}
                className="pill pill-accent w-full mt-4"
              >
                {t("nav.get_quote")}
              </button>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
