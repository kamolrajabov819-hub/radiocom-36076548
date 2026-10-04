/**
 * The company's contact details — the one place they are written down.
 *
 * Every phone number and Telegram link on the site, in the schema and in
 * `llms.txt` reads from here. They used to be typed out in six files, and they
 * drifted: the contact block, the footer, the service page and the schema each
 * carried a different set of numbers, and the visible Telegram link pointed at
 * a different account from the one the schema named. `verify-seo` now fails
 * the build if a phone number or a `t.me/` link appears anywhere else in
 * `src/`.
 *
 * The values are the owner's answers of 2026-10-02 (docs/seo/OWNER-QUESTIONS.md):
 * the mobile is the primary number, the landline second, and 980-07-10 is the
 * service line. Google Business Profile and Yandex Business must list the
 * primary number exactly as `display` writes it.
 */

export type Phone = {
  /** `tel:` form — digits with the country code, no spaces. */
  e164: string;
  /** How the number is printed. */
  display: string;
};

/** Sales and general enquiries — the header, the sticky call button, schema `telephone`. */
export const PHONE_PRIMARY: Phone = { e164: "+998933890710", display: "+998 93 389-07-10" };
/** The office landline. */
export const PHONE_LANDLINE: Phone = { e164: "+998781131618", display: "+998 78 113-16-18" };
/** Repairs — the service page and the `Service` schema. */
export const PHONE_SERVICE: Phone = { e164: "+998939800710", display: "+998 93 980-07-10" };

export const telHref = (p: Phone) => `tel:${p.e164}`;

/** The manager's direct chat, and the company's only Telegram presence. */
export const TELEGRAM_URL = "https://t.me/DiyorRadiocom";
/** The same account as a handle, for text that names it rather than links it. */
export const TELEGRAM_HANDLE = "@DiyorRadiocom";
export const INSTAGRAM_URL = "https://www.instagram.com/radiocom_uzb";
export const FACEBOOK_URL =
  "https://www.facebook.com/people/Radiocom-%D0%A0%D0%B0%D1%86%D0%B8%D0%B8-Motorola-%D0%B2-%D0%A3%D0%B7%D0%B1%D0%B5%D0%BA%D0%B8%D1%81%D1%82%D0%B0%D0%BD%D0%B5/100085709424020/";

export const EMAIL_SALES = "sales@radiocom.uz";
export const EMAIL_INFO = "info@radiocom.uz";
