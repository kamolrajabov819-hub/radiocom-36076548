import { useTranslation } from "react-i18next";
import { LocaleLink } from "@/components/LocaleLink";
import { Socials } from "./Socials";
import { INDUSTRY_SLUGS } from "@/data/industries";
import logoAsset from "@/assets/radiocom-logo.png.asset.json";
import { assetUrl } from "@/lib/asset";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-charcoal">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 pt-16 pb-10">
        <img src={assetUrl(logoAsset)} alt="Radiocom" width={200} height={34} loading="lazy" className="h-7 w-auto mb-10" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 border-b border-border pb-12">
          <FooterCol title={t("footer.nav_col")}>
            <FLink to="/">{t("nav.home")}</FLink>
            <FLink to="/catalog">{t("nav.catalog")}</FLink>
            <FLink to="/poc">{t("nav.poc")}</FLink>
            <FLink to="/service">{t("nav.service")}</FLink>
            <FLink to="/industries">{t("nav.industries")}</FLink>
          </FooterCol>
          <FooterCol title={t("nav.industries")}>
            {INDUSTRY_SLUGS.map((s) => (
              <li key={s}>
                <LocaleLink to="/industries/$slug" params={{ slug: s }} className="text-[13px] text-crisp/70 hover:text-crisp">
                  {t(`industries.${s}.name`)}
                </LocaleLink>
              </li>
            ))}
          </FooterCol>
          <FooterCol title={t("footer.contact_col")}>
            <li><a href="tel:+998781131618" className="text-[13px] text-crisp/70 hover:text-crisp">+998 78 113-16-18</a></li>
            <li><a href="tel:+998933890710" className="text-[13px] text-crisp/70 hover:text-crisp">+998 93 389-07-10</a></li>
            <li><a href="mailto:info@radiocom.uz" className="text-[13px] text-crisp/70 hover:text-crisp">info@radiocom.uz</a></li>
            <li><a href="mailto:sales@radiocom.uz" className="text-[13px] text-crisp/70 hover:text-crisp">sales@radiocom.uz</a></li>
          </FooterCol>
          <FooterCol title="Radiocom">
            <li className="text-[13px] text-crisp/70 leading-relaxed">{t("footer.address")}</li>
            <li className="text-[13px] text-crisp/70 mt-1">{t("footer.hours")}</li>
            <li className="pt-3"><Socials /></li>
          </FooterCol>
        </div>
        <div className="pt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[12px] text-cool">{t("footer.rights")}</div>
          <div className="text-[12px] text-cool">MOTOROLA · RADIOCOM RC</div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[12px] font-semibold text-crisp mb-4">{title}</div>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  );
}

function FLink({ to, children }: { to: "/" | "/catalog" | "/poc" | "/service" | "/industries"; children: React.ReactNode }) {
  return (
    <li>
      <LocaleLink to={to} className="text-[13px] text-crisp/70 hover:text-crisp transition-colors">
        {children}
      </LocaleLink>
    </li>
  );
}
