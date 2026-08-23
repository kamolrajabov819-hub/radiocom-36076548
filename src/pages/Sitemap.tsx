import { useTranslation } from "react-i18next";
import { LocaleLink } from "@/components/LocaleLink";
import { Section, SectionHead } from "@/components/Section";
import { useScrollChoreography } from "@/lib/motion";
import { productsOfBrand } from "@/data/products";
import { INDUSTRY_SLUGS } from "@/data/industries";
import { useLang } from "@/lib/locale";
import {
  breadcrumbSchema,
  jsonLd,
  localeLinks,
  pageMeta,
  webPageSchema,
  type SeoLang,
} from "@/lib/seo";
import { tFor } from "@/lib/i18n";

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
export const routeOptions = {
  head: ({ params }: { params: { lang: SeoLang } }) => {
    const t = tFor(params.lang);
    const path = "/sitemap";
    return {
      meta: pageMeta({
        lang: params.lang,
        title: `${t("sitemap.title")} — Radiocom`,
        description: t("sitemap.sub"),
        path,
        ogCard: "sitemap",
      }),
      links: localeLinks(params.lang, path),
      scripts: [
        jsonLd(
          webPageSchema({
            name: t("sitemap.title"),
            description: t("sitemap.sub"),
            path,
            lang: params.lang,
          }),
        ),
        jsonLd(
          breadcrumbSchema(
            [
              { name: t("nav.home"), path: "/" },
              { name: t("sitemap.title"), path },
            ],
            params.lang,
          ),
        ),
      ],
    };
  },
  component: SitemapPage,
};

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
        <SectionHead align="left" title={t("sitemap.title")} sub={t("sitemap.sub")} />

        <div className="grid grid-cols-1 gap-x-12 gap-y-14 md:grid-cols-3">
          <nav aria-labelledby="sm-pages">
            <h2 id="sm-pages" className="type-title mb-5 text-crisp">
              {t("sitemap.pages")}
            </h2>
            <ul className="space-y-1">
              {PAGES.map((p) => (
                <li key={p.to}>
                  <LocaleLink
                    to={p.to}
                    className="inline-flex min-h-11 items-center text-[15px] text-cool transition-colors hover:text-crisp"
                  >
                    {t(p.key)}
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
                  {t(`nav.${brand}`)}
                </h3>
                <ul className="space-y-1">
                  {productsOfBrand(brand).map((p) => (
                    <li key={p.id}>
                      <LocaleLink
                        to="/$brand/$model"
                        params={{ brand: p.brandSlug, model: p.slug }}
                        className="inline-flex min-h-11 items-center text-[15px] text-cool transition-colors hover:text-crisp"
                      >
                        {p.name}
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
            <ul className="space-y-1">
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
