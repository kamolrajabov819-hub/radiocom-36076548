import { spawnSync } from "node:child_process";

/**
 * The date the site's content last actually changed, as `YYYY-MM-DD`.
 *
 * Two places publish a "this changed on" claim — `<lastmod>` on all 171 sitemap
 * URLs, and `article:modified_time` on the industry pages — and both were, or
 * would have been, `new Date()`. A redeploy that changed one product's price
 * then told a crawler that every page on the site was modified today. Google
 * discounts a `lastmod` it finds does not track real edits, and once discounted
 * it is discounted for the whole sitemap, including the entries where it was
 * true.
 *
 * The last commit touching `src/` is the honest answer available at build time:
 * everything a reader sees is rendered from there — the components, the three
 * locale files, the catalogue data. It is repo-wide rather than per-page, which
 * over-claims for a page that has not changed in months, but a shared commit
 * date is a date something really happened, and a build timestamp is not.
 *
 * Falls back to the build date when git is unavailable — a shallow clone with
 * no history, a tarball deploy — which is exactly the previous behaviour, so
 * the fallback can never be worse than what it replaced.
 */
export function contentDate(): string {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const r = spawnSync("git", ["log", "-1", "--format=%cs", "--", "src"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    const out = r.status === 0 ? r.stdout.trim() : "";
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : today;
  } catch {
    return today;
  }
}
