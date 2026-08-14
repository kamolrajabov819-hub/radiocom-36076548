export const UZ_PHONE_PREFIX = "+998 ";
export const UZ_PHONE_PATTERN = "\\+998 \\d{2} \\d{3}-\\d{2}-\\d{2}";

export function formatUzPhoneDigits(digits: string): string {
  const d = digits.slice(0, 9);
  let out = "";
  if (d.length > 0) out += d.slice(0, 2);
  if (d.length > 2) out += " " + d.slice(2, 5);
  if (d.length > 5) out += "-" + d.slice(5, 7);
  if (d.length > 7) out += "-" + d.slice(7, 9);
  return out;
}

export function extractUzDigits(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("998")) d = d.slice(3);
  return d.slice(0, 9);
}
