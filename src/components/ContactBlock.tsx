import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Clock, Phone, Mail, Loader2, Check } from "lucide-react";
import { MapEmbed } from "@/components/MapEmbed";
import { Socials } from "@/components/Socials";
import { spring } from "@/lib/springs";

/**
 * Shared closing block for every page: contacts + short lead form on the left,
 * Google map on the right.
 */
export function ContactBlock() {
  const { t } = useTranslation();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      await fetch("/api/send-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "contact-block" }),
      });
    } catch (err) {
      console.error("[lead:contact-block] failed to send", err);
    }
    setSending(false);
    setSent(true);
  };

  return (
    <section className="bg-charcoal px-6 md:px-10 py-20 md:py-28">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14">
        <motion.div
          className="min-w-0"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={spring}
        >
          <div className="eyebrow-sweep mb-3 text-[13px] font-medium tracking-wide">
            {t("contact.eyebrow")}
          </div>
          <h2 className="headline text-crisp text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.05]">
            {t("contact.title")}
          </h2>
          <p className="subhead mt-4 max-w-md text-[15px]">{t("contact.sub")}</p>

          <ul className="mt-8 space-y-3.5">
            <Row Icon={MapPin}>{t("footer.address")}</Row>
            <Row Icon={Clock}>{t("footer.hours")}</Row>
            <Row Icon={Phone}>
              <a href="tel:+998781131618" className="hover:text-signal">+998 78 113-16-18</a>
              <span className="mx-2 text-cool">·</span>
              <a href="tel:+998933870710" className="hover:text-signal">+998 93 387-07-10</a>
            </Row>
            <Row Icon={Mail}>
              <a href="mailto:sales@radiocom.uz" className="hover:text-signal">sales@radiocom.uz</a>
            </Row>
          </ul>

          {sent ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex items-center gap-3 rounded-3xl border border-border bg-popover px-6 py-5"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-signal text-white">
                <Check className="h-4 w-4" />
              </span>
              <span className="text-[15px] text-crisp">{t("form.success")}</span>
            </motion.div>
          ) : (
            <>
              <form onSubmit={submit} className="mt-8 w-full max-w-xl">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <input
                    name="name"
                    required
                    maxLength={80}
                    placeholder={t("form.name")}
                    className="h-12 w-full min-w-0 rounded-full border border-border bg-popover px-5 text-[15px] text-crisp outline-none transition-shadow placeholder:text-cool focus:border-signal focus:ring-2 focus:ring-signal/25"
                  />
                  <input
                    name="phone"
                    required
                    maxLength={30}
                    inputMode="tel"
                    placeholder={t("form.phone")}
                    className="h-12 w-full min-w-0 rounded-full border border-border bg-popover px-5 text-[15px] text-crisp outline-none transition-shadow placeholder:text-cool focus:border-signal focus:ring-2 focus:ring-signal/25"
                  />
                  <input
                    name="qty"
                    type="number"
                    min={1}
                    inputMode="numeric"
                    placeholder={t("form.qty")}
                    className="h-12 w-full min-w-0 rounded-full border border-border bg-popover px-5 text-[15px] text-crisp outline-none transition-shadow placeholder:text-cool focus:border-signal focus:ring-2 focus:ring-signal/25"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="pill pill-accent mt-3 h-12 w-full justify-center sm:w-auto sm:px-10"
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : t("form.submit")}
                </button>
              </form>
              <div className="mt-3 text-[12px] text-cool">{t("form.trust_line")}</div>
            </>
          )}

          <div className="mt-7">
            <Socials />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ ...spring, delay: 0.08 }}
          className="overflow-hidden rounded-[28px] shadow-[0_24px_60px_-30px_rgba(0,0,0,0.4)] ring-1 ring-border"
        >
          <MapEmbed />
        </motion.div>
      </div>
    </section>
  );
}

function Row({ Icon, children }: { Icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-[15px] text-crisp">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
      <span>{children}</span>
    </li>
  );
}
