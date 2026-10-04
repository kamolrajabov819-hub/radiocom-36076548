import { useTranslation } from "react-i18next";
import { useLoaderData } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone, Send, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useScrollChoreography } from "@/lib/motion";
import { InfoHero } from "@/components/InfoHero";
import { Section } from "@/components/Section";
import { SeoText } from "@/components/SeoText";
import { FaqBlock } from "@/components/FaqBlock";
import {
  EMAIL_INFO,
  EMAIL_SALES,
  PHONE_LANDLINE,
  PHONE_PRIMARY,
  PHONE_SERVICE,
  TELEGRAM_HANDLE,
  TELEGRAM_URL,
  telHref,
} from "@/lib/contacts";

/**
 * /contacts — «Radiocom адрес и контакты».
 *
 * Every number with what it is for, which the site-wide contact block (form and
 * map, rendered below this page by the root layout) has no room to say: the
 * main line, the landline, the service centre's own number, Telegram, both
 * mailboxes. All of it comes from `lib/contacts.ts`, so this page cannot drift
 * from the header, the footer or the schema.
 */
export function ContactsPage() {
  const { t } = useTranslation();
  const page = useScrollChoreography();
  const copy = useLoaderData({ from: "/$lang/contacts" });

  const rows: { Icon: LucideIcon; label: string; value: string; href?: string }[] = [
    { Icon: MapPin, label: t("contacts.address"), value: t("footer.address") },
    { Icon: Clock, label: t("contacts.hours"), value: t("footer.hours") },
    {
      Icon: Phone,
      label: t("contacts.main"),
      value: PHONE_PRIMARY.display,
      href: telHref(PHONE_PRIMARY),
    },
    {
      Icon: Phone,
      label: t("contacts.landline"),
      value: PHONE_LANDLINE.display,
      href: telHref(PHONE_LANDLINE),
    },
    {
      Icon: Wrench,
      label: t("contacts.service"),
      value: PHONE_SERVICE.display,
      href: telHref(PHONE_SERVICE),
    },
    {
      Icon: Send,
      label: "Telegram",
      value: TELEGRAM_HANDLE,
      href: TELEGRAM_URL,
    },
    {
      Icon: Mail,
      label: t("contacts.email"),
      value: `${EMAIL_SALES} · ${EMAIL_INFO}`,
      href: `mailto:${EMAIL_SALES}`,
    },
  ];

  return (
    <div ref={page} className="page-anim page-tight">
      {copy.hero ? <InfoHero {...copy.hero} /> : null}
      <Section band="soft" tight>
        <address className="not-italic" data-placement="contacts-page">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map(({ Icon, label, value, href }) => (
              <div key={label} className="rounded-[28px] bg-pitch p-7">
                <dt className="flex items-center gap-2 text-[13px] text-cool">
                  <Icon className="h-4 w-4 text-signal" aria-hidden />
                  {label}
                </dt>
                <dd className="mt-3 text-[17px] text-crisp">
                  {href ? (
                    <a
                      href={href}
                      className="link-inline"
                      {...(href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </address>
      </Section>
      <SeoText sections={copy.sections} />
      <FaqBlock items={copy.faq} band="soft" />
    </div>
  );
}
