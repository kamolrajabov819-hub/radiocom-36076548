import { Link, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { LangToggle } from "./LangToggle";
import { ThemeToggle } from "./ThemeToggle";
import { openLead } from "./LeadFormSheet";
import { INDUSTRY_SLUGS } from "@/data/industries";

export function Nav() {
  const { t } = useTranslation();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const industriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setIndustriesOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (industriesRef.current && !industriesRef.current.contains(e.target as Node)) setIndustriesOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

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
          <nav className="hidden lg:flex items-center gap-6 flex-1">
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
                onClick={() => setIndustriesOpen((v) => !v)}
                className={`text-[13px] flex items-center gap-0.5 transition-opacity ${
                  pathname.startsWith("/industries") ? "text-crisp" : "text-crisp/80 hover:text-crisp"
                }`}
              >
                {t("nav.industries")} <ChevronDown className="w-3 h-3" />
              </button>
              <AnimatePresence>
                {industriesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-0 mt-2 w-64 rounded-2xl bg-popover shadow-xl border border-border p-2"
                  >
                    <Link to="/industries" className="block px-4 py-2.5 rounded-xl text-[13px] text-signal hover:bg-charcoal">
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
          <Link to="/" className="flex items-center lg:absolute lg:left-1/2 lg:-translate-x-1/2" aria-label="Radiocom">
            <img
              src={logoAsset.url}
              alt="Radiocom"
              width={180}
              height={32}
              className="h-[22px] w-auto dark:invert dark:brightness-0 dark:contrast-200"
            />
          </Link>

          {/* Right actions */}
          <div className="hidden lg:flex items-center justify-end gap-3 flex-1">
            <LangToggle />
            <ThemeToggle />
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
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(true)}
              className="h-9 w-9 flex items-center justify-center text-crisp"
              aria-label={t("nav.menu")}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden bg-pitch"
          >
            <div className="flex items-center justify-between px-5 h-12 border-b border-border">
              <span className="text-[15px] font-semibold text-crisp">Radiocom</span>
              <button onClick={() => setMobileOpen(false)} aria-label={t("nav.close")} className="text-crisp">
                <X className="w-5 h-5" />
              </button>
            </div>
            <motion.nav
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
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
                    <Link key={s} to="/industries/$slug" params={{ slug: s }} className="text-crisp/90 text-lg">
                      {t(`industries.${s}.name`)}
                    </Link>
                  ))}
                </div>
              </div>
              <button
                onClick={() => { setMobileOpen(false); openLead({ title: t("nav.get_quote") }); }}
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

function RadiocomMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden>
      <path d="M4 20 A10 10 0 0 1 24 20" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <path d="M7.5 20 A6.5 6.5 0 0 1 20.5 20" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      <circle cx="14" cy="20" r="3" fill="var(--signal)" />
    </svg>
  );
}
