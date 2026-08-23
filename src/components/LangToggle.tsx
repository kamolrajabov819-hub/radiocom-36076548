import { useRouter, useRouterState } from "@tanstack/react-router";
import { LANGS, type Lang } from "@/lib/i18n";
import { useLang } from "@/lib/locale";

/**
 * Language switcher.
 *
 * Switching language is a navigation, not a state change: each language has its
 * own URL, so the toggle rewrites the locale segment of the current path and
 * keeps the reader on the same page. That is what makes all three languages
 * separately linkable and indexable — the previous version wrote localStorage,
 * which left every language sharing one URL and invisible to search.
 *
 * Rendered as real anchors so the alternates are crawlable and open-in-new-tab
 * works, with the click intercepted for client-side navigation.
 *
 * Each chip is a 44px tap target on touch. The visible pill stays the same
 * compact size — a 44px-tall toggle would dominate the header — so the target
 * is extended with vertical padding that the pill's own background does not
 * paint. WCAG 2.5.8 asks for 24px minimum and Apple's own guidance for 44pt;
 * this was 37x26, which fails the second and passes the first only by a
 * whisker, on the one control every visitor in a three-language market needs.
 */
export function LangToggle() {
  const router = useRouter();
  const current = useLang();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const hrefFor = (l: Lang) => {
    const rest = pathname.replace(/^\/(ru|en|uz)(?=\/|$)/, "");
    return `/${l}${rest || "/"}`;
  };

  return (
    <div className="flex items-center rounded-full bg-charcoal p-0.5 text-[13px]">
      {LANGS.map((l) => {
        const href = hrefFor(l);
        return (
          <a
            key={l}
            href={href}
            hrefLang={l}
            aria-current={current === l ? "true" : undefined}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
              e.preventDefault();
              router.navigate({ href });
            }}
            className={`relative flex min-w-[40px] items-center justify-center rounded-full px-3 py-1.5 transition-colors after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2 after:content-[''] ${
              current === l ? "bg-pitch text-crisp shadow-sm" : "text-cool hover:text-crisp"
            }`}
          >
            {l.toUpperCase()}
          </a>
        );
      })}
    </div>
  );
}
