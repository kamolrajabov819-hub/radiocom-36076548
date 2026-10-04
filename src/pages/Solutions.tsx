import { useTranslation } from "react-i18next";
import { useLoaderData } from "@tanstack/react-router";
import { useScrollChoreography } from "@/lib/motion";
import { InfoHero } from "@/components/InfoHero";
import { NetworkSteps } from "@/components/NetworkSteps";
import { ProductShot } from "@/components/ProductShot";
import { Section } from "@/components/Section";
import { SeoText } from "@/components/SeoText";
import { FaqBlock } from "@/components/FaqBlock";
import { TrustedBy } from "@/components/TrustedBy";
import teamRadios from "@/assets/cutout/hands-scattered-cutout.webp";
import teamRadios800 from "@/assets/cutout/hands-scattered-cutout@800.webp";

/**
 * /solutions — «организация радиосвязи на предприятии». The five steps that
 * used to sit on the PoC page, then the copy module's sections and FAQ.
 */
export function SolutionsPage() {
  const { t } = useTranslation();
  const page = useScrollChoreography();
  const copy = useLoaderData({ from: "/$lang/solutions" });
  return (
    <div ref={page} className="page-anim page-tight">
      {copy.hero ? <InfoHero {...copy.hero} cta={t("poc.cta_primary")} /> : null}
      <Section band="plain" tight>
        <ProductShot
          src={teamRadios}
          srcSmall={teamRadios800}
          cutout
          alt={t("alt.team_radios")}
          width={1600}
          height={893}
          sizes="(max-width: 768px) 92vw, 960px"
          className="mx-auto w-full max-w-[960px]"
        />
      </Section>
      <NetworkSteps />
      <SeoText sections={copy.sections} />
      <FaqBlock items={copy.faq} band="soft" />
      <TrustedBy />
    </div>
  );
}
