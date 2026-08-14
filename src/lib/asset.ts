/**
 * Asset URL resolver.
 *
 * Binary assets (product photos, logos, catalog PDF) live on the Lovable CDN and
 * are referenced through `*.asset.json` pointers whose `url` is a root-relative
 * path (`/__l5e/assets-v1/...`). That path is only served by Lovable hosting —
 * on any other host (e.g. a Netlify deployment) it 404s and the images vanish.
 *
 * Resolving pointers through this helper prefixes them with the canonical CDN
 * origin so they render identically in every deployment target.
 */
const ASSET_ORIGIN = "https://radiocom.lovable.app";

export type AssetPointer = { url: string };

export function assetUrl(pointer: AssetPointer | string): string {
  const url = typeof pointer === "string" ? pointer : pointer.url;
  if (/^https?:\/\//i.test(url)) return url;
  const path = url.startsWith("/") ? url : `/${url}`;

  // On Lovable hosting (preview, published) and in local dev the CDN path is
  // served from the same origin — keep it relative so freshly uploaded assets
  // resolve immediately. Only foreign hosts need the absolute CDN origin.
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const sameOrigin =
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.endsWith("lovable.app") ||
      host.endsWith("lovableproject.com");
    if (sameOrigin) return path;
    return `${ASSET_ORIGIN}${path}`;
  }
  return path;
}
