import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Clock, Phone, Mail, Loader2, Check, Send } from "lucide-react";
import { MapEmbed } from "@/components/MapEmbed";
import { Socials } from "@/components/Socials";
import { spring } from "@/lib/springs";
import { PhoneInput } from "@/components/PhoneInput";
import { ContactActions, HoneypotField } from "@/components/ContactActions";
import { EMAIL_SALES, PHONE_LANDLINE, PHONE_PRIMARY, TELEGRAM_URL, telHref } from "@/lib/contacts";
import { HONEYPOT_FIELD, submitLead } from "@/lib/lead";
import { useLang } from "@/lib/locale";

/**
 * Shared closing block for every page: contacts + short lead form on the left,
 * Google map on the right.
 */
export function ContactBlock() {
  const { t } = useTranslation();
  const lang = useLang();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);
  const inFlight = useRef(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setSending(true);
    setFailed(false);
    const ok = await submitLead(e.currentTarget, {
      form: "contact-block",
      cta: t("form.submit"),
      lang,
    });
    inFlight.current = false;
    setSending(false);
    if (ok) setSent(true);
    else setFailed(true);
  };

  return (
    <section className="bg-charcoal py-20 md:py-28" data-placement="contact">
      <div className="shell grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14">
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

          {/* `<address>`: the contact information for the business this page
              belongs to, which is what the element is for. `not-italic` undoes
              the browser default. */}
          <address className="not-italic">
            <ul className="mt-8 space-y-3.5">
              <Row Icon={MapPin}>{t("footer.address")}</Row>
              <Row Icon={Clock}>{t("footer.hours")}</Row>
              <Row Icon={Phone}>
                <a
                  href={telHref(PHONE_PRIMARY)}
                  className="inline-flex min-h-11 items-center hover:text-signal"
                >
                  {PHONE_PRIMARY.display}
                </a>
                <span className="mx-2 text-cool">·</span>
                <a
                  href={telHref(PHONE_LANDLINE)}
                  className="inline-flex min-h-11 items-center hover:text-signal"
                >
                  {PHONE_LANDLINE.display}
                </a>
              </Row>
              <Row Icon={Send}>
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center hover:text-signal"
                >
                  {t("contact.telegram")}
                </a>
              </Row>
              <Row Icon={Mail}>
                <a
                  href={`mailto:${EMAIL_SALES}`}
                  className="inline-flex min-h-11 items-center hover:text-signal"
                >
                  {EMAIL_SALES}
                </a>
              </Row>
            </ul>
          </address>

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
              <form onSubmit={submit} className="relative mt-8 w-full max-w-xl">
                <HoneypotField name={HONEYPOT_FIELD} />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <input
                    name="name"
                    aria-label={t("form.name")}
                    required
                    maxLength={80}
                    placeholder={t("form.name")}
                    className="h-12 w-full min-w-0 rounded-full border border-border bg-popover px-5 text-[15px] text-crisp outline-none transition-shadow placeholder:text-cool focus:border-signal focus:ring-2 focus:ring-signal/25"
                  />
                  <PhoneInput
                    name="phone"
                    required
                    className="h-12 w-full min-w-0 rounded-full border border-border bg-popover px-5 text-[15px] text-crisp outline-none transition-shadow placeholder:text-cool focus:border-signal focus:ring-2 focus:ring-signal/25"
                  />
                  <input
                    name="qty"
                    aria-label={t("form.qty")}
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
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : failed ? (
                    t("form.retry")
                  ) : (
                    t("form.submit")
                  )}
                </button>
              </form>
              {failed ? (
                <div role="alert" className="mt-4 max-w-xl rounded-3xl bg-popover p-5">
                  <p className="text-[15px] font-medium text-crisp">{t("form.error_title")}</p>
                  <p className="mt-1 text-[13px] text-cool">{t("form.error_sub")}</p>
                  <ContactActions placement="form-error" className="mt-4" />
                </div>
              ) : (
                <div className="mt-3 text-[12px] text-cool">{t("form.trust_line")}</div>
              )}
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

function Row({
  Icon,
  children,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3 text-[15px] text-crisp">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
      <span>{children}</span>
    </li>
  );
}
