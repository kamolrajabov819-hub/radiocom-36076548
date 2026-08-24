import { useRouter, useRouterState } from "@tanstack/react-router";
import { type Lang } from "@/lib/i18n";
import { useLang } from "@/lib/locale";

/**
 * Display order for the chips, which is deliberately not `LANGS`.
 *
 * `LANGS` is a canonical set, not a presentation list: it drives the hreflang
 * cluster on every page, the `<xhtml:link>` alternates in `sitemap.xml`, and
 * three `verify-seo` gates that count them. Reordering it to move a chip in the
 * header would rewrite the sitemap and change what every page advertises to a
 * crawler — a large, invisible diff in service of a small, visible one.
 *
 * RU, then UZ, then EN is the order the audience arrives in: Russian is the
 * working language of the trade in Tashkent, Uzbek is the state language, and
 * English is third.
 */
const DISPLAY_ORDER = ["ru", "uz", "en"] as const satisfies readonly Lang[];

/**
 * Every `Lang` must appear above.
 *
 * `satisfies` alone only proves each chip is a real locale; it says nothing
 * about a locale that has no chip. This resolves to `never` when the two agree,
 * and to the missing locale otherwise — so adding a fourth language to `LANGS`
 * and forgetting the header is a compile error naming the language, rather than
 * one that silently stops being reachable.
 */
type Unshown = Exclude<Lang, (typeof DISPLAY_ORDER)[number]>;
const _everyLangHasAChip: [Unshown] extends [never] ? true : Unshown = true;
void _everyLangHasAChip;

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
    // `` `/${l}` ``, not `` `/${l}/` ``. On the home page `rest` is empty, and
    // the old fallback produced `/ru/` — which the router 307s to `/ru`. That
    // put a redirect hop on the single most-used control in a three-language
    // market, on the site's most-linked page, and it is the canonical URL the
    // rest of the SEO layer emits everywhere else.
    return `/${l}${rest}`;
  };

  return (
    <div className="flex items-center rounded-full bg-charcoal p-0.5 text-[13px]">
      {DISPLAY_ORDER.map((l) => {
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
