import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Loader2, Check } from "lucide-react";
import { spring } from "@/lib/springs";

type Ctx = { open: boolean; title?: string; product?: string };
let listeners: Array<(c: Ctx) => void> = [];
let state: Ctx = { open: false };

export function openLead(opts: { title?: string; product?: string } = {}) {
  state = { open: true, ...opts };
  listeners.forEach((l) => l(state));
}
function closeLead() {
  state = { ...state, open: false };
  listeners.forEach((l) => l(state));
}

export function LeadFormSheet() {
  const { t } = useTranslation();
  const [ctx, setCtx] = useState<Ctx>(state);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const l = (c: Ctx) => setCtx({ ...c });
    listeners.push(l);
    return () => { listeners = listeners.filter((x) => x !== l); };
  }, []);

  useEffect(() => {
    if (!ctx.open) {
      const t = setTimeout(() => setSent(false), 400);
      return () => clearTimeout(t);
    }
  }, [ctx.open]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      await fetch("/api/send-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, product: ctx.product, source: "lead-sheet" }),
      });
    } catch (err) {
      console.error("[lead] failed to send", err);
    }
    setSending(false);
    setSent(true);
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
                  className="h-9 w-9 flex items-center justify-center rounded-full bg-charcoal text-crisp hover:opacity-70"
                  aria-label="Close"
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
                  <form onSubmit={submit} className="space-y-4">
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
                      {t("form.submit")}
                    </button>
                    <div className="text-center text-[12px] text-cool pt-2">{t("form.trust_line")}</div>
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
  name, label, required, type = "text", textarea,
}: { name: string; label: string; required?: boolean; type?: string; textarea?: boolean }) {
  const cls =
    "w-full rounded-2xl bg-charcoal border border-transparent focus:border-signal focus:bg-pitch outline-none px-4 py-3 text-[15px] text-crisp placeholder-cool transition-colors";
  return (
    <label className="block">
      <span className="block text-[13px] text-cool mb-1.5">
        {label}{required && <span className="text-signal ml-0.5">*</span>}
      </span>
      {textarea ? (
        <textarea name={name} rows={3} className={cls + " resize-none"} />
      ) : (
        <input name={name} type={type} required={required} min={type === "number" ? 1 : undefined} className={cls} />
      )}
    </label>
  );
}
