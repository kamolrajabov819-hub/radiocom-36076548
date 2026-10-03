import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Loader2, Check } from "lucide-react";
import { spring } from "@/lib/springs";
import { PhoneInput } from "@/components/PhoneInput";
import { ContactActions, HoneypotField } from "@/components/ContactActions";
import { currentPage, track } from "@/lib/analytics";
import { HONEYPOT_FIELD, submitLead } from "@/lib/lead";
import { useLang } from "@/lib/locale";

type Ctx = { open: boolean; title?: string; product?: string };
let listeners: Array<(c: Ctx) => void> = [];
let state: Ctx = { open: false };

/**
 * Open the request sheet. `title` names the call to action that opened it —
 * every caller already passes one — and it now travels with the lead as `cta`,
 * so the Telegram message says which button produced it.
 */
export function openLead(opts: { title?: string; product?: string } = {}) {
  state = { open: true, ...opts };
  listeners.forEach((l) => l(state));
  track("lead_form_open", { cta: opts.title, product: opts.product, page: currentPage() });
}
function closeLead() {
  state = { ...state, open: false };
  listeners.forEach((l) => l(state));
}

export function LeadFormSheet() {
  const { t } = useTranslation();
  const lang = useLang();
  const [ctx, setCtx] = useState<Ctx>(state);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);
  // A ref as well as the state: two taps inside one frame both read
  // `sending === false` from the same render, and both would post.
  const inFlight = useRef(false);

  useEffect(() => {
    const l = (c: Ctx) => setCtx({ ...c });
    listeners.push(l);
    return () => {
      listeners = listeners.filter((x) => x !== l);
    };
  }, []);

  useEffect(() => {
    if (!ctx.open) {
      const t = setTimeout(() => {
        setSent(false);
        setFailed(false);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [ctx.open]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setSending(true);
    setFailed(false);
    const ok = await submitLead(e.currentTarget, {
      form: "lead-sheet",
      cta: ctx.title,
      product: ctx.product,
      lang,
    });
    inFlight.current = false;
    setSending(false);
    // On failure the form stays mounted with everything the visitor typed, and
    // the error below it offers the phone and Telegram instead.
    if (ok) setSent(true);
    else setFailed(true);
  };

  return (
    <AnimatePresence>
      {ctx.open && (
        <motion.div
          className="fixed inset-0 z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={closeLead} />
          <motion.aside
            data-placement="lead-sheet"
            className="absolute right-0 top-0 h-full w-full max-w-[520px] bg-pitch overflow-y-auto md:rounded-l-3xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={spring}
          >
            <div className="p-8 md:p-10">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="text-signal text-[13px] mb-2">{ctx.title ?? t("form.title")}</div>
                  <h2 className="headline text-3xl md:text-4xl text-crisp">{t("form.title")}</h2>
                </div>
                <button
                  onClick={closeLead}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-charcoal text-crisp hover:opacity-70"
                  aria-label={t("nav.close")}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {sent ? (
                <div className="py-12 text-center">
                  <div className="mx-auto h-14 w-14 rounded-full bg-signal/10 flex items-center justify-center mb-6">
                    <Check className="w-6 h-6 text-signal" strokeWidth={2.5} />
                  </div>
                  <p className="text-crisp text-lg">{t("form.success")}</p>
                </div>
              ) : (
                <>
                  <p className="subhead text-[15px] mb-8">{t("form.sub")}</p>
                  {ctx.product && (
                    <div className="mb-6 rounded-2xl bg-charcoal px-4 py-3 text-[13px] text-crisp">
                      {ctx.product}
                    </div>
                  )}
                  <form onSubmit={submit} className="relative space-y-4">
                    <Field name="name" label={t("form.name")} required />
                    <Field name="phone" label={t("form.phone")} required type="tel" />
                    <Field name="qty" label={t("form.qty")} type="number" />
                    <Field name="message" label={t("form.message")} textarea />
                    <button
                      type="submit"
                      disabled={sending}
                      className="pill pill-accent w-full mt-2 disabled:opacity-70"
                    >
                      {sending && <Loader2 className="w-4 h-4 animate-spin" />}
                      {failed ? t("form.retry") : t("form.submit")}
                    </button>
                    {failed ? (
                      <div role="alert" className="rounded-2xl bg-charcoal p-5">
                        <p className="text-[15px] font-medium text-crisp">
                          {t("form.error_title")}
                        </p>
                        <p className="mt-1 text-[13px] text-cool">{t("form.error_sub")}</p>
                        <ContactActions placement="form-error" className="mt-4" />
                      </div>
                    ) : (
                      <div className="text-center text-[12px] text-cool pt-2">
                        {t("form.trust_line")}
                      </div>
                    )}
                    {/* Last, so `space-y-4` spaces the visible fields as before. */}
                    <HoneypotField name={HONEYPOT_FIELD} />
                  </form>
                </>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  name,
  label,
  required,
  type = "text",
  textarea,
}: {
  name: string;
  label: string;
  required?: boolean;
  type?: string;
  textarea?: boolean;
}) {
  const cls =
    "w-full rounded-2xl bg-charcoal border border-transparent focus:border-signal focus:bg-pitch outline-none px-4 py-3 text-[15px] text-crisp placeholder-cool transition-colors";
  return (
    <label className="block">
      <span className="block text-[13px] text-cool mb-1.5">
        {label}
        {required && <span className="text-signal ml-0.5">*</span>}
      </span>
      {textarea ? (
        <textarea name={name} rows={3} className={cls + " resize-none"} />
      ) : type === "tel" ? (
        <PhoneInput name={name} required={required} className={cls} />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          min={type === "number" ? 1 : undefined}
          className={cls}
        />
      )}
    </label>
  );
}
