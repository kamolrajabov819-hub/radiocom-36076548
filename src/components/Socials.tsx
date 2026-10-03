import { Instagram, Facebook, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FACEBOOK_URL, INSTAGRAM_URL, TELEGRAM_URL } from "@/lib/contacts";

const links = [
  { href: INSTAGRAM_URL, Icon: Instagram, label: "Instagram" },
  { href: FACEBOOK_URL, Icon: Facebook, label: "Facebook" },
  { href: TELEGRAM_URL, Icon: Send, label: "Telegram" },
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
          className="flex h-11 w-11 items-center justify-center rounded-full bg-pitch text-crisp/70 hover:text-signal transition-colors"
        >
          <l.Icon className="w-4 h-4" />
        </a>
      ))}
    </div>
  );
}
