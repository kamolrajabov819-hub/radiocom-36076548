import { Instagram, Facebook, Send } from "lucide-react";
import { useTranslation } from "react-i18next";

const links = [
  { href: "https://www.instagram.com/radiocom_uzb", Icon: Instagram, label: "Instagram" },
  {
    href: "https://www.facebook.com/people/Radiocom-%D0%A0%D0%B0%D1%86%D0%B8%D0%B8-Motorola-%D0%B2-%D0%A3%D0%B7%D0%B1%D0%B5%D0%BA%D0%B8%D1%81%D1%82%D0%B0%D0%BD%D0%B5/100085709424020/",
    Icon: Facebook,
    label: "Facebook",
  },
  { href: "https://t.me/uz_Radiocom", Icon: Send, label: "Telegram" },
];

export function Socials() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t("footer.follow")} ${l.label}`}
          className="h-9 w-9 flex items-center justify-center rounded-full bg-pitch text-crisp/70 hover:text-signal transition-colors"
        >
          <l.Icon className="w-4 h-4" />
        </a>
      ))}
    </div>
  );
}
