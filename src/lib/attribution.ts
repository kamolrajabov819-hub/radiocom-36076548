/**
 * Where a visitor came from, kept until they send a lead.
 *
 * A lead arrives in Telegram and is closed by phone, often days after the ad
 * click and several pages away from the landing page. By then the URL that
 * carried `utm_source` and `gclid` is long gone: the site navigates as an SPA
 * and internal links carry no query string. So the landing parameters are
 * captured once, on the first document load of a visit, and attached to every
 * lead — which is what lets a lead be traced back to its campaign and uploaded
 * to Google Ads or Yandex Direct as an offline conversion.
 *
 * Two touches:
 *   first  the visitor's first recorded arrival. Written once, never replaced.
 *   last   the most recent arrival that came from somewhere: one carrying a
 *          marketing parameter, or one with an external referrer. A reload or
 *          a bookmark (no parameters, no referrer) does not overwrite it, or
 *          every returning visitor would read as "direct".
 *
 * Storage is `localStorage`, behind try/catch throughout: private windows,
 * blocked storage and embedded webviews all throw, and the site has to work
 * regardless. When storage is unavailable the touch is still kept in memory for
 * the rest of the page's life, so a lead sent on the landing page carries it.
 *
 * Values are read from the raw `location.search` with `URLSearchParams`, never
 * from the router, which parses `yclid` into a rounded Number (see
 * `marketing-params.ts`).
 */
import { CLICK_ID_KEYS, UTM_KEYS } from "@/lib/marketing-params";

export type Touch = {
  /** Present keys only: utm_* and click IDs. */
  params: Record<string, string>;
  /** Landing page: path plus query, as the visitor arrived. */
  landing: string;
  /** `document.referrer`, or "" for direct. */
  referrer: string;
  /** ISO 8601. */
  at: string;
};

export type Attribution = { first: Touch | null; last: Touch | null };

const STORAGE_KEY = "rc_attr_v1";
const MAX_VALUE = 300;
let memory: Attribution = { first: null, last: null };

function read(): Attribution {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return memory;
    const parsed = JSON.parse(raw) as Partial<Attribution>;
    return { first: parsed.first ?? null, last: parsed.last ?? null };
  } catch {
    return memory;
  }
}

function write(a: Attribution): void {
  memory = a;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
  } catch {
    /* storage unavailable — the in-memory copy stands in */
  }
}

function externalReferrer(referrer: string): boolean {
  if (!referrer) return false;
  try {
    return new URL(referrer).host !== window.location.host;
  } catch {
    return false;
  }
}

/** Read this document load's touch and fold it into the stored attribution. */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    const search = new URLSearchParams(window.location.search);
    const params: Record<string, string> = {};
    for (const key of [...UTM_KEYS, ...CLICK_ID_KEYS]) {
      const v = search.get(key);
      if (v) params[key] = v.slice(0, MAX_VALUE);
    }
    const referrer = document.referrer.slice(0, MAX_VALUE);
    const touch: Touch = {
      params,
      landing: (window.location.pathname + window.location.search).slice(0, MAX_VALUE),
      referrer: externalReferrer(referrer) ? referrer : "",
      at: new Date().toISOString(),
    };

    const stored = read();
    const fromSomewhere = Object.keys(params).length > 0 || touch.referrer !== "";
    write({
      first: stored.first ?? touch,
      last: fromSomewhere || !stored.last ? touch : stored.last,
    });
  } catch {
    /* attribution is best-effort; never block the page on it */
  }
}

/** What a lead carries. Empty touches when nothing was captured. */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return { first: null, last: null };
  return read();
}
