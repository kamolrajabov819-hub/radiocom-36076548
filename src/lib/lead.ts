/**
 * Sending a lead — the one code path both forms use.
 *
 * Both forms used to `await fetch(...)` and then show the success state no
 * matter what came back. A 500 from `/api/send-lead`, a Telegram outage or a
 * dropped connection all told the visitor «Спасибо, мы перезвоним», and the
 * lead was gone. Here only a 2xx is a success; everything else is reported to
 * the caller, which keeps the form filled and offers the phone and Telegram
 * instead.
 *
 * The payload also carries what the server could never see before: which form,
 * which call to action opened it (`cta` is the title every `openLead()` caller
 * already passes), the product, the page, the language, and the visitor's
 * first and last touch from `attribution.ts`.
 */
import { getAttribution } from "@/lib/attribution";
import { currentPage, track } from "@/lib/analytics";

export type LeadForm = "lead-sheet" | "contact-block";

export type LeadContext = {
  form: LeadForm;
  cta?: string;
  product?: string;
  lang: string;
};

/** The name of the honeypot field. Real visitors never see or fill it. */
export const HONEYPOT_FIELD = "website";

const TIMEOUT_MS = 15_000;

export async function submitLead(form: HTMLFormElement, ctx: LeadContext): Promise<boolean> {
  const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
  const honeypot = Boolean(data[HONEYPOT_FIELD]);
  const page = currentPage();
  const eventParams = { form: ctx.form, cta: ctx.cta, product: ctx.product, page };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch("/api/send-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        ...data,
        source: ctx.form,
        cta: ctx.cta,
        product: ctx.product,
        page,
        lang: ctx.lang,
        attribution: getAttribution(),
      }),
    });
    if (!res.ok) throw new Error(`send-lead answered ${res.status}`);
    // A bot that filled the honeypot gets a 200 from the server too; it must
    // not count as a conversion in Ads or Metrica.
    if (!honeypot) track("generate_lead", eventParams);
    return true;
  } catch (err) {
    console.warn("[lead] not delivered", err);
    track("lead_error", eventParams);
    return false;
  } finally {
    clearTimeout(timer);
  }
}
