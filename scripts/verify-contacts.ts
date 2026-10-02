/**
 * Phone numbers and Telegram links are written in exactly one place.
 *
 * They used to be typed out wherever they were shown, and they drifted: the
 * contact block, the footer, the service page and the schema each carried a
 * different set of numbers, and the visible Telegram link named a different
 * account from the schema's `sameAs`. `src/lib/contacts.ts` is now the only
 * file in `src/` allowed to spell one out; everything else imports it.
 * Comments are scanned too — a number in a comment is the next copy waiting to
 * be pasted.
 *
 * ── Why this is not a gate inside `verify-seo.ts` ───────────────────────────
 *
 * It was, for one commit, and the build broke on the second run. Bun caches
 * the transpiled output of any source file over 50 KB (its "runtime transpiler
 * cache", `~/.bun/install/cache/@t@`), and when `verify-seo.ts` itself is the
 * cached entry, the next run dies trying to parse `rcd-70-hero.webp` as
 * JavaScript. That file sits at 51 001 bytes — 199 under the line — and this
 * gate took it to 52 512. A clean run always passes, which is why it looked
 * like a flake: the second run in a build, or any run on a machine whose cache
 * is warm, is the one that fails. Keep `verify-seo.ts` under 51 200 bytes; add
 * new gates as their own scripts.
 *
 * Run: bun scripts/verify-contacts.ts
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const offenders: string[] = [];
const phone = /\+?998[ ()-]*\d{2}[ ()-]*\d{3}[ -]*\d{2}[ -]*\d{2}/g;
const telegram = /t\.me\//g;
const ALLOWED = join("src", "lib", "contacts.ts");

const walk = (dir: string) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (/\.(ts|tsx|json)$/.test(e.name) && full !== ALLOWED) {
      const text = readFileSync(full, "utf8");
      for (const re of [phone, telegram]) {
        for (const m of text.matchAll(re)) {
          const line = text.slice(0, m.index).split("\n").length;
          offenders.push(`${full}:${line} ${m[0]}`);
        }
      }
    }
  }
};
walk("src");

// The guard above only holds while it runs in its own process; see the note
// at the top. Fail loudly if `verify-seo.ts` drifts back over the line.
const verifySeoBytes = readFileSync(join("scripts", "verify-seo.ts")).byteLength;
const problems = [...offenders];
if (verifySeoBytes > 51_200)
  problems.push(
    `scripts/verify-seo.ts is ${verifySeoBytes} bytes; over 51 200, Bun's transpiler cache ` +
      "breaks it on the second run. Move a gate into its own script.",
  );

if (problems.length) {
  console.log(`FAIL contact details / gate size:\n     ${problems.join("\n     ")}`);
  console.log(`\n${problems.length} FAILURES`);
  process.exit(1);
}
console.log("ok  every phone number and Telegram link comes from src/lib/contacts.ts");
console.log(
  `ok  scripts/verify-seo.ts is ${verifySeoBytes} bytes, under Bun's 51 200-byte cache line`,
);
console.log("\nALL CONTACT CHECKS PASSED");
