import { LocaleLink } from "@/components/LocaleLink";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { INDUSTRY_SLUGS } from "@/data/industries";
import horecaImg from "@/assets/industry-horeca.jpg";
import constructionImg from "@/assets/industry-construction.jpg";
import securityImg from "@/assets/industry-security.jpg";
import miningImg from "@/assets/industry-mining.jpg";
import transportImg from "@/assets/industry-transport.jpg";
import manufacturingImg from "@/assets/industry-manufacturing.jpg";
import { spring } from "@/lib/springs";
import {
  SITE_NAME,
  breadcrumbSchema,
  jsonLd,
  localeLinks,
  pageMeta,
  type SeoLang,
} from "@/lib/seo";
import { tFor } from "@/lib/i18n";

const IMAGES: Record<string, string> = {
  horeca: horecaImg,
  construction: constructionImg,
  security: securityImg,
  mining: miningImg,
  transport: transportImg,
  manufacturing: manufacturingImg,
};

export const routeOptions = {
  head: ({ params }: { params: { lang: SeoLang } }) => {
    const t = tFor(params.lang);
    return {
      meta: pageMeta({
        lang: params.lang,
        title: t("meta.industries.title"),
        description: t("meta.industries.desc"),
        path: "/industries",
      }),
      links: localeLinks(params.lang, "/industries"),
      scripts: [
        jsonLd(
          breadcrumbSchema(
            [
              { name: SITE_NAME, path: "/" },
              { name: t("meta.crumb.industries"), path: "/industries" },
            ],
            params.lang,
          ),
        ),
      ],
    };
  },
  component: IndustriesOverview,
};

export function IndustriesOverview() {
  const { t } = useTranslation();
  return (
    <>
      <section className="pt-32 md:pt-40 pb-14 md:pb-20 bg-pitch px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
            className="type-display text-crisp"
          >
            {t("industries.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
            className="subhead mt-4 text-lg md:text-xl"
          >
            {t("industries.overview_sub")}
          </motion.p>
        </div>
      </section>

      <section className="bg-pitch px-4 md:px-6 pb-24">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {INDUSTRY_SLUGS.map((s, i) => (
            <motion.div
              key={s}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ ...spring, delay: (i % 6) * 0.06 }}
            >
              <LocaleLink
                to="/industries/$slug"
                params={{ slug: s }}
                className="relative block rounded-3xl overflow-hidden group aspect-[16/10]"
              >
                <img
                  src={IMAGES[s]}
                  alt=""
                  loading={i < 2 ? "eager" : "lazy"}
                  width={1600}
                  height={1000}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="relative h-full flex flex-col justify-end p-8 md:p-10 text-white">
                  <h2 className="type-headline">{t(`industries.${s}.name`)}</h2>
                  <p className="text-white/75 mt-2 text-[15px] max-w-md">
                    {t(`industries.${s}.desc`)}
                  </p>
                  <div className="mt-4 text-[14px] inline-flex items-center gap-1 text-white">
                    {t("industries.cta")} <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </LocaleLink>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
