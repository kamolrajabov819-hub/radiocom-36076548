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
    <div className="text-[12px] flex items-center rounded-full bg-charcoal p-0.5">
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
            className={`px-2.5 py-1 rounded-full transition-colors ${
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
