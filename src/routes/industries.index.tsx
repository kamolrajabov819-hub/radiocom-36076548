import { createFileRoute, Link } from "@tanstack/react-router";
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

const IMAGES: Record<string, string> = {
  horeca: horecaImg,
  construction: constructionImg,
  security: securityImg,
  mining: miningImg,
  transport: transportImg,
  manufacturing: manufacturingImg,
};

export const Route = createFileRoute("/industries/")({
  head: () => ({
    meta: [
      { title: "Industries — Radiocom Uzbekistan" },
      { name: "description", content: "Turnkey radio systems for HoReCa, Construction, Security, Mining, Transport and Manufacturing." },
      { property: "og:title", content: "Industries — Radiocom" },
      { property: "og:description", content: "Radio solutions engineered for 6 industries in Uzbekistan." },
    ],
  }),
  component: IndustriesOverview,
});

function IndustriesOverview() {
  const { t } = useTranslation();
  return (
    <>
      <section className="pt-32 md:pt-40 pb-14 md:pb-20 bg-pitch px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
            className="headline text-crisp text-5xl md:text-7xl"
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
              <Link
                to="/industries/$slug"
                params={{ slug: s }}
                className="relative block rounded-3xl overflow-hidden group aspect-[16/10]"
              >
                <img
                  src={IMAGES[s]}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-[900ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="relative h-full flex flex-col justify-end p-8 md:p-10 text-white">
                  <h2 className="headline text-3xl md:text-5xl">{t(`industries.${s}.name`)}</h2>
                  <p className="text-white/75 mt-2 text-[15px] max-w-md">{t(`industries.${s}.desc`)}</p>
                  <div className="mt-4 text-[14px] inline-flex items-center gap-1 text-white">
                    {t("industries.cta")} <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
