import { useTranslation } from "react-i18next";
import { useLoaderData } from "@tanstack/react-router";
import { useScrollChoreography } from "@/lib/motion";
import { InfoHero } from "@/components/InfoHero";
import { SeoText } from "@/components/SeoText";
import { FaqBlock } from "@/components/FaqBlock";
import { TrustedBy } from "@/components/TrustedBy";

/**
 * /rent — «аренда раций в Ташкенте». The page is its copy module
 * (`src/data/copy/pages/rent.ts`): the README's rental offer, nothing priced.
 */
export function RentPage() {
  const { t } = useTranslation();
  const page = useScrollChoreography();
  const copy = useLoaderData({ from: "/$lang/rent" });
  return (
    <div ref={page} className="page-anim page-tight">
      {copy.hero ? <InfoHero {...copy.hero} cta={t("poc.rental.cta")} /> : null}
      <SeoText sections={copy.sections} band="soft" />
      <FaqBlock items={copy.faq} band="plain" />
      <TrustedBy />
    </div>
  );
}
