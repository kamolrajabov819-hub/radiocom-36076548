import { useTranslation } from "react-i18next";
import { useLoaderData } from "@tanstack/react-router";
import { useScrollChoreography } from "@/lib/motion";
import { InfoHero } from "@/components/InfoHero";
import { ProductShot } from "@/components/ProductShot";
import { Section } from "@/components/Section";
import { SeoText } from "@/components/SeoText";
import { FaqBlock } from "@/components/FaqBlock";
import { TrustedBy } from "@/components/TrustedBy";
import lineup from "@/assets/cutout/lineup-seven-cutout.webp";
import lineup800 from "@/assets/cutout/lineup-seven-cutout@800.webp";

/**
 * /about — «компания Radiocom». README history only (see the copy module's
 * header for what was left out and why), then the client logos, which are the
 * page's real evidence.
 */
export function AboutPage() {
  const { t } = useTranslation();
  const page = useScrollChoreography();
  const copy = useLoaderData({ from: "/$lang/about" });
  return (
    <div ref={page} className="page-anim page-tight">
      {copy.hero ? <InfoHero {...copy.hero} cta={t("home.hero.cta_primary")} /> : null}
      <Section band="plain" tight>
        <ProductShot
          src={lineup}
          srcSmall={lineup800}
          cutout
          alt={t("alt.lineup")}
          width={1600}
          height={758}
          sizes="(max-width: 768px) 92vw, 960px"
          className="mx-auto w-full max-w-[960px]"
        />
      </Section>
      <SeoText sections={copy.sections} band="soft" />
      <TrustedBy />
      <FaqBlock items={copy.faq} band="soft" />
    </div>
  );
}
