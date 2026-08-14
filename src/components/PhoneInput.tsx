import { useState } from "react";
import { UZ_PHONE_PREFIX, UZ_PHONE_PATTERN, formatUzPhoneDigits, extractUzDigits } from "@/lib/phone";

/**
 * Phone input that keeps the "+998" country code fixed and formats the rest
 * as the user types, so every lead form collects numbers in a consistent
 * Uzbekistan format ("+998 XX XXX-XX-XX").
 */
export function PhoneInput({
  name, required, className, id,
}: { name: string; required?: boolean; className?: string; id?: string }) {
  const [digits, setDigits] = useState("");
  const value = UZ_PHONE_PREFIX + formatUzPhoneDigits(digits);

  const clampCaret = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const el = e.currentTarget;
    requestAnimationFrame(() => {
      if (el.selectionStart !== null && el.selectionStart < UZ_PHONE_PREFIX.length) {
        el.setSelectionRange(UZ_PHONE_PREFIX.length, UZ_PHONE_PREFIX.length);
      }
    });
  };

  return (
    <input
      id={id}
      type="tel"
      inputMode="tel"
      name={name}
      required={required}
      pattern={UZ_PHONE_PATTERN}
      title={UZ_PHONE_PREFIX + "XX XXX-XX-XX"}
      className={className}
      value={value}
      onFocus={clampCaret}
      onClick={clampCaret}
      onChange={(e) => {
        const raw = e.target.value;
        const tail = raw.startsWith(UZ_PHONE_PREFIX) ? raw.slice(UZ_PHONE_PREFIX.length) : raw;
        setDigits(extractUzDigits(tail));
      }}
      onKeyDown={(e) => {
        const el = e.currentTarget;
        const { selectionStart, selectionEnd } = el;
        if (selectionStart === null || selectionEnd === null) return;
        if (e.key === "Backspace" && selectionStart <= UZ_PHONE_PREFIX.length && selectionEnd <= UZ_PHONE_PREFIX.length) {
          e.preventDefault();
        }
        if (e.key === "Delete" && selectionStart < UZ_PHONE_PREFIX.length) {
          e.preventDefault();
        }
      }}
    />
  );
}
