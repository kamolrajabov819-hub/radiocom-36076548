/**
 * Analytics: one tag manager, one `dataLayer`, and the events the marketer
 * configures against. `docs/seo/TRACKING.md` is the contract for every event
 * and parameter named here — change one and change the other.
 *
 * The site loads Google Tag Manager and nothing else. GA4, Yandex Metrica,
 * Google Ads conversions and the Meta Pixel are configured inside the GTM
 * container by whoever runs the ads, so a new pixel is a container change, not
 * a deploy. The site's whole job is a clean `dataLayer`.
 *
 * Personal data never goes into the `dataLayer`: no name, no phone number, no
 * message text. The lead itself goes to `/api/send-lead`; the `dataLayer` only
 * learns that one happened, from which form and which call to action.
 */

/**
 * The container ID, from `VITE_GTM_ID` at build time — or nothing.
 *
 * The same contract as `verificationMeta()` in `seo.ts`: no ID, no tag, and
 * the ID is never written into the repository. It is read through
 * `import.meta.env` rather than `process.env` because Vite inlines it into the
 * client bundle and the server bundle alike, so both render the same `<head>`
 * and hydration has nothing to reconcile. Set it in Netlify for the production
 * context only; a deploy preview that loads the live container sends test
 * traffic into the real reports.
 */
export function gtmId(): string | null {
  const id = (import.meta.env.VITE_GTM_ID as string | undefined)?.trim();
  return id && /^GTM-[A-Z0-9]{4,12}$/.test(id) ? id : null;
}

/** The standard GTM loader, for an ID that has already passed `gtmId()`'s format check. */
export function gtmSnippet(id: string): string {
  return (
    "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});" +
    "var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';" +
    "j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);" +
    `})(window,document,'script','dataLayer','${id}');`
  );
}

export type AnalyticsEvent =
  | "lead_form_open"
  | "generate_lead"
  | "lead_error"
  | "click_call"
  | "click_telegram"
  | "click_email"
  | "file_download"
  | "virtual_page_view";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

/**
 * Push one event. SSR-safe: on the server there is no `window` and this does
 * nothing.
 *
 * Works whether or not GTM is installed or has loaded yet — events queue in
 * the array, and GTM replays them when it arrives.
 */
export function track(event: AnalyticsEvent, params: Params = {}): void {
  if (typeof window === "undefined") return;
  try {
    (window.dataLayer ??= []).push({ event, ...params });
  } catch {
    /* analytics must never be the reason an interaction fails */
  }
}

/** The page the visitor is on, as a path with no query string. */
export function currentPage(): string {
  return typeof window === "undefined" ? "" : window.location.pathname;
}

/** Where on the page a click happened — the nearest `data-placement`, else "page". */
function placementOf(el: Element): string {
  return el.closest<HTMLElement>("[data-placement]")?.dataset.placement ?? "page";
}

/**
 * One delegated listener for every outbound contact click on the site: `tel:`,
 * `mailto:`, Telegram, and file downloads.
 *
 * Delegated rather than wired per link, so a phone number added to any page
 * next year is tracked without anyone remembering to tag it. The capture phase
 * means a link that stops propagation is still counted. Returns its own
 * cleanup.
 */
export function installClickTracking(): () => void {
  const onClick = (e: MouseEvent) => {
    const target = e.target instanceof Element ? e.target : null;
    const a = target?.closest<HTMLAnchorElement>("a[href]");
    if (!a) return;
    const href = a.getAttribute("href") ?? "";
    const placement = placementOf(a);
    const page = currentPage();

    if (href.startsWith("tel:")) {
      track("click_call", { number: href.slice(4), placement, page });
    } else if (href.startsWith("mailto:")) {
      track("click_email", { placement, page });
    } else if (/^https?:\/\/(t\.me|telegram\.me)\//i.test(href)) {
      track("click_telegram", { placement, page });
    } else if (a.hasAttribute("download") || /\.pdf(?:$|[?#])/i.test(href)) {
      const file = a.getAttribute("download") || href.split(/[?#]/)[0].split("/").pop() || href;
      track("file_download", { file, placement, page });
    }
  };
  document.addEventListener("click", onClick, { capture: true });
  return () => document.removeEventListener("click", onClick, { capture: true });
}

/**
 * A page view for every client-side navigation.
 *
 * After the first load the site navigates as an SPA, so GTM's own page view
 * fires once per visit unless something says otherwise. This is that
 * something. Configure GA4 and Metrica to count `virtual_page_view` and turn
 * off GA4's "page changes based on browser history events", or every SPA
 * navigation is counted twice. The first page view is GTM's own, so this
 * skips the initial load.
 */
let lastHref = "";
export function trackPageView(href: string, title: string, lang: string): void {
  if (href === lastHref) return;
  lastHref = href;
  track("virtual_page_view", { page_path: href, page_title: title, lang });
}
/** Seed the de-duplication with the landing URL, which GTM has already counted. */
export function seedPageView(href: string): void {
  lastHref = href;
}
