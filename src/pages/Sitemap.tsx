import { useTranslation } from "react-i18next";
import { brandCase } from "@/lib/brand";
import { motion } from "framer-motion";
import { LocaleLink } from "@/components/LocaleLink";
import { Section, SectionHead } from "@/components/Section";
import { useScrollChoreography } from "@/lib/motion";
import { spring } from "@/lib/springs";
import { productsOfBrand } from "@/data/products";
import { INDUSTRY_SLUGS } from "@/data/industries";
import { useLang } from "@/lib/locale";

/**
 * The HTML sitemap.
 *
 * `sitemap.xml` tells a crawler what exists; this tells it — and a reader —
 * how the pages relate. That difference is what makes it worth having: Google
 * generates the sitelinks block under a search result algorithmically, from
 * site structure and internal linking, and a single page that links every
 * route with its real name is the strongest honest signal available. There is
 * no markup that forces sitelinks, and anyone selling you one is wrong.
 *
 * It earns its place for people too. Three brands' worth of models, six
 * sectors and six standalone pages is more than a nav bar can hold, and this
 * is where someone goes when they know the site has a page and cannot find the
 * door.
 */

const PAGES = [
  { to: "/", key: "nav.home" },
  { to: "/radiocom", key: "nav.radiocom" },
  { to: "/motorola", key: "nav.motorola" },
  { to: "/compare", key: "nav.compare" },
  { to: "/poc", key: "nav.poc" },
  { to: "/service", key: "nav.service" },
  { to: "/industries", key: "nav.industries" },
  { to: "/search", key: "nav.search" },
] as const;

export function SitemapPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const page = useScrollChoreography();

  return (
    <div ref={page} className="page-anim">
      <Section band="plain">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
        >
          <SectionHead align="left" title={t("sitemap.title")} sub={t("sitemap.sub")} />
        </motion.div>

        <div className="grid grid-cols-1 gap-x-12 gap-y-14 md:grid-cols-3">
          <nav aria-labelledby="sm-pages">
            <h2 id="sm-pages" className="type-title mb-5 text-crisp">
              {t("sitemap.pages")}
            </h2>
            <ul data-stagger className="space-y-1">
              {PAGES.map((p) => (
                <li key={p.to}>
                  <LocaleLink
                    to={p.to}
                    className="inline-flex min-h-11 items-center text-[15px] text-cool transition-colors hover:text-crisp"
                  >
                    {brandCase(t(p.key))}
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="sm-models">
            <h2 id="sm-models" className="type-title mb-5 text-crisp">
              {t("sitemap.models")}
            </h2>
            {(["radiocom", "motorola"] as const).map((brand) => (
              <div key={brand} className="mb-8 last:mb-0">
                <h3 className="mb-2 text-[13px] font-medium uppercase tracking-[0.14em] text-cool">
                  {brandCase(t(`nav.${brand}`))}
                </h3>
                <ul data-stagger className="space-y-1">
                  {productsOfBrand(brand).map((p) => (
                    <li key={p.id}>
                      <LocaleLink
                        to="/$brand/$model"
                        params={{ brand: p.brandSlug, model: p.slug }}
                        className="inline-flex min-h-11 items-center text-[15px] text-cool transition-colors hover:text-crisp"
                      >
                        {brandCase(p.name)}
                      </LocaleLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <nav aria-labelledby="sm-industries">
            <h2 id="sm-industries" className="type-title mb-5 text-crisp">
              {t("sitemap.industries")}
            </h2>
            <ul data-stagger className="space-y-1">
              {INDUSTRY_SLUGS.map((slug) => (
                <li key={slug}>
                  <LocaleLink
                    to="/industries/$slug"
                    params={{ slug }}
                    className="inline-flex min-h-11 items-center text-[15px] text-cool transition-colors hover:text-crisp"
                  >
                    {t(`industries.${slug}.name`)}
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="sr-only">{lang}</p>
      </Section>
    </div>
  );
}
