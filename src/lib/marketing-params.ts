/**
 * Marketing parameters — the query keys an ad or a campaign link carries, and
 * the one function that moves them from a request onto a redirect.
 *
 * Why this exists, in one reproduction: TanStack Router parses every search
 * value with `JSON.parse`, so `?yclid=5034856438827851775` becomes the Number
 * 5034856438827852000 — a 19-digit Yandex Direct click ID rounded to a
 * different click. A redirect rebuilt from the router's parsed search ships
 * the wrong ID, and Metrica can no longer join the visit to the ad. So
 * redirects never take marketing values from the router: `rewriteLocation`
 * copies the raw `key=value` segments of the request, byte for byte, by string
 * concatenation. `URLSearchParams` is deliberately not used for output — it
 * re-encodes `%20` as `+` and rewrites percent-encoded Cyrillic.
 *
 * No React, no router, no DOM: `src/start.ts` uses this on the server,
 * `attribution.ts` in the browser, `scripts/generate-seo.ts` for robots.txt and
 * `scripts/verify-legacy-redirects.ts` to prove the byte-exactness at build
 * time.
 */

/** The UTM keys stored with a lead. Any other `utm_*` key still passes through a redirect. */
export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

/**
 * Ad-platform click IDs: Google Ads (gclid, and gbraid/wbraid for iOS),
 * Yandex Direct (yclid), Meta (fbclid). Stored with a lead so it can be
 * uploaded back to the ad platform as an offline conversion.
 */
export const CLICK_ID_KEYS = ["gclid", "gbraid", "wbraid", "yclid", "fbclid"] as const;

/**
 * Passed through redirects but not stored: Yandex appends `ysclid` to clicks
 * from its own search results, and Metrica reads it from the landing URL.
 */
const PASS_THROUGH_ONLY = ["ysclid"] as const;

const EXACT_KEYS = new Set<string>([...CLICK_ID_KEYS, ...PASS_THROUGH_ONLY]);

/** Every key a redirect must carry over, for the robots.txt `Clean-param` line. */
export const MARKETING_KEYS = [...UTM_KEYS, ...CLICK_ID_KEYS, ...PASS_THROUGH_ONLY] as const;

/** True for `utm_*` and the click IDs. Case-insensitive: hand-typed links say `UTM_Source`. */
export function isMarketingKey(key: string): boolean {
  const k = key.toLowerCase();
  return k.startsWith("utm_") || EXACT_KEYS.has(k);
}

/** The key of one raw `key=value` segment, decoded; null when it cannot be decoded. */
function segmentKey(segment: string): string | null {
  const raw = segment.split("=", 1)[0];
  try {
    return decodeURIComponent(raw.replace(/\+/g, " "));
  } catch {
    return null;
  }
}

/** The raw query of a URL or path — between `?` and `#`, without either. */
export function rawQuery(urlOrPath: string): string {
  const q = urlOrPath.indexOf("?");
  if (q === -1) return "";
  const hash = urlOrPath.indexOf("#", q);
  return urlOrPath.slice(q + 1, hash === -1 ? undefined : hash);
}

/** The raw marketing segments of a URL, in their original order, exactly as written. */
export function marketingSegments(urlOrPath: string): string[] {
  return rawQuery(urlOrPath)
    .split("&")
    .filter((seg) => {
      if (!seg) return false;
      const key = segmentKey(seg);
      return key !== null && isMarketingKey(key);
    });
}

/**
 * A redirect target with the request's marketing parameters on it.
 *
 * Marketing segments already on `location` are removed first (the router
 * produced them, from parsed and possibly corrupted values), every other
 * segment of `location` is kept in place, and the request's raw marketing
 * segments are appended after them in their original order.
 *
 * Returns null when `location` is not a same-origin target (an absolute URL on
 * another host, or a protocol-relative `//host`): those are left alone.
 */
export function rewriteLocation(location: string, requestUrl: string): string | null {
  let target = location;
  if (!target.startsWith("/") || target.startsWith("//")) {
    let parsed: URL;
    let origin: string;
    try {
      parsed = new URL(target);
      origin = new URL(requestUrl).origin;
    } catch {
      return null;
    }
    if (parsed.origin !== origin) return null;
    target = target.slice(parsed.origin.length) || "/";
  }

  const hashAt = target.indexOf("#");
  const hash = hashAt === -1 ? "" : target.slice(hashAt);
  const beforeHash = hashAt === -1 ? target : target.slice(0, hashAt);
  const queryAt = beforeHash.indexOf("?");
  const path = queryAt === -1 ? beforeHash : beforeHash.slice(0, queryAt);

  const kept = rawQuery(beforeHash)
    .split("&")
    .filter((seg) => {
      if (!seg) return false;
      const key = segmentKey(seg);
      return key === null || !isMarketingKey(key);
    });
  const segments = [...kept, ...marketingSegments(requestUrl)];
  return path + (segments.length ? `?${segments.join("&")}` : "") + hash;
}
