import { useTranslation } from "react-i18next";
import { Section, SectionHead } from "@/components/Section";
import { BentoGrid, FeatureCard } from "@/components/apple";
import whyWarranty from "@/assets/cutout/hand-retail-box-cutout@800.webp";
import whyDelivery from "@/assets/cutout/pair-floating-cutout@800.webp";
import whyService from "@/assets/cutout/radios-fan-cutout@800.webp";
import whyTest from "@/assets/cutout/hands-compare-cutout@800.webp";
import whyTradein from "@/assets/cutout/hands-tradein-cutout@800.webp";

/**
 * The five reasons to buy here, said once, in one place.
 *
 * Before this component they were said in seven: the home bento, the brand
 * pages' «Почему через нас» shelf, the two `DuoCard`s directly beneath that
 * shelf, the product page's price note, the specs page's buy card, the industry
 * pages' offers grid, and the compare page's closing block. Three different
 * wordings of the same five promises, drifting apart on every edit.
 *
 * That happened because no page had one job. When a page is not sure what it is
 * for, everything looks like it belongs on it — so warranty, delivery, the free
 * test, trade-in and service ended up on all of them. Centralising the block is
 * the mechanical half of the fix; the other half is that pages now link here
 * instead of restating it.
 *
 * The wording kept is the clearest of each set, and two real defects died with
 * the old brand shelf: its "delivery" card carried the *trial* line as its title
 * and the *compare* line as its body, and its "test" card said the same sentence
 * twice.
 */
export function WhyUs({ band = "soft" }: { band?: "plain" | "soft" }) {
  const { t } = useTranslation();

  // Order is deliberate: the two promises that remove risk before you buy come
  // first, then what happens after you buy.
  const cards = [
    {
      key: "test",
      eyebrow: t("home.bento.test.title"),
      title: t("home.bento.test.sub"),
      image: whyTest,
      span: 2 as const,
    },
    {
      key: "warranty",
      eyebrow: t("home.bento.warranty.title"),
      title: t("home.bento.warranty.sub"),
      image: whyWarranty,
    },
    {
      key: "delivery",
      eyebrow: t("home.bento.delivery.title"),
      title: t("home.bento.delivery.sub"),
      image: whyDelivery,
    },
    {
      key: "service",
      eyebrow: t("home.bento.service.title"),
      title: t("home.bento.service.sub"),
      image: whyService,
    },
    {
      key: "tradein",
      eyebrow: t("home.bento.tradein.title"),
      title: t("home.bento.tradein.sub"),
      image: whyTradein,
    },
  ];

  return (
    <Section band={band}>
      <SectionHead
        eyebrow={t("home.bento.eyebrow")}
        title={t("home.bento.title")}
        sub={t("home.bento.sub")}
        align="left"
        spacing="tight"
      />
      <BentoGrid cols={3}>
        {cards.map((c, i) => (
          <FeatureCard
            key={c.key}
            idx={i}
            eyebrow={c.eyebrow}
            title={c.title}
            span={c.span}
            figure={
              <img
                src={c.image}
                alt=""
                width={800}
                height={600}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain"
              />
            }
          />
        ))}
      </BentoGrid>
    </Section>
  );
}
