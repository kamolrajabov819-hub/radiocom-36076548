import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ChevronRight, Search as SearchIcon } from "lucide-react";
import { LocaleLink } from "@/components/LocaleLink";
import { Section, SectionHead } from "@/components/Section";
import { ProductCard } from "@/components/ProductCard";
import { useScrollChoreography } from "@/lib/motion";
import { visibleProducts, type Product } from "@/data/products";
import { specs } from "@/data/specs";
import { pick, type Lang } from "@/data/spec-dict";
import {
  breadcrumbSchema,
  itemListSchema,
  jsonLd,
  localeLinks,
  pageMeta,
  webPageSchema,
  type SeoLang,
} from "@/lib/seo";
import { tFor } from "@/lib/i18n";
import { useLang } from "@/lib/locale";

/**
 * Catalogue search.
 *
 * This page exists for two reasons, and the second is the one that made it
 * worth building.
 *
 * It is a real convenience: 21 models across two families, and a buyer who
 * already knows they need IP67 or DMR should not have to work out which family
 * that lives in first.
 *
 * And it is what a sitelinks searchbox requires. Google's searchbox result is
 * driven by a `SearchAction` on the `WebSite` node pointing at a query URL, and
 * `webSiteSchema()` deliberately omitted one — the old markup advertised
 * `/ru/catalog?q=` while the catalogue only ever validated `cat` and `brand`,
 * so it described an endpoint that did not exist. The comment there said to
 * reinstate it only alongside a real search route. This is that route.
 *
 * No backend. The whole catalogue — names, spec rows, features, box contents —
 * is static data already in the bundle, so the search runs where the reader is
 * and answers instantly.
 */

/** Everything about a model that a query could reasonably match. */
function haystack(p: Product, lang: Lang): string {
  const spec = specs[p.id];
  const parts: string[] = [
    p.name,
    p.brand,
    p.category,
    ...p.tags,
    pick(p.blurb, lang),
    pick(p.rangeCity, lang),
    p.rangeOpen ? pick(p.rangeOpen, lang) : "",
  ];
  if (spec) {
    for (const row of spec.rows) parts.push(pick(row.label, lang), pick(row.value, lang));
    for (const f of spec.features) parts.push(pick(f, lang));
    for (const line of spec.inBox) parts.push(pick(line.item, lang));
  }
  return parts.join(" ").toLowerCase();
}

/**
 * Every term must match, in any order and anywhere in the text.
 *
 * "ip67 dmr" should find the models that are both, not the union of each —
 * which is what a naive `some()` would return and what makes most on-site
 * search feel useless. Order-independence matters because a spec sheet writes
 * "класс защиты IP67" while a person types "ip67 защита".
 */
function matches(text: string, terms: string[]): boolean {
  return terms.every((term) => text.includes(term));
}

export const routeOptions = {
  validateSearch: (search: Record<string, unknown>): { q?: string } => {
    const q = typeof search.q === "string" ? search.q.slice(0, 120) : undefined;
    return q ? { q } : {};
  },
  head: ({ params }: { params: { lang: SeoLang } }) => {
    const t = tFor(params.lang);
    const path = "/search";
    return {
      meta: pageMeta({
        lang: params.lang,
        title: t("meta.search.title"),
        description: t("meta.search.desc"),
        path,
        ogCard: "search",
      }),
      links: localeLinks(params.lang, path),
      scripts: [
        jsonLd(
          webPageSchema({
            name: t("meta.search.title"),
            description: t("meta.search.desc"),
            path,
            lang: params.lang,
          }),
        ),
        jsonLd(itemListSchema(visibleProducts, params.lang)),
        jsonLd(
          breadcrumbSchema(
            [
              { name: t("nav.home"), path: "/" },
              { name: t("meta.crumb.search"), path },
            ],
            params.lang,
          ),
        ),
      ],
    };
  },
  component: SearchPage,
};

export function SearchPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const navigate = useNavigate();
  const { q } = useSearch({ strict: false }) as { q?: string };
  const page = useScrollChoreography();

  const query = (q ?? "").trim();
  const terms = useMemo(() => query.toLowerCase().split(/\s+/).filter(Boolean), [query]);

  const results = useMemo(
    () => (terms.length ? visibleProducts.filter((p) => matches(haystack(p, lang), terms)) : []),
    [terms, lang],
  );

  return (
    <div ref={page} className="page-anim">
      <Section band="plain">
        <SectionHead align="left" title={t("search.title")} sub={t("search.sub")} />

        {/* A real GET form, not a controlled input.
        
            Submitting navigates to `?q=…`, which means every result set has its
            own URL: shareable, linkable, back-button-correct, and — the reason
            this shape matters — exactly the contract the `SearchAction` in
            `webSiteSchema()` advertises to Google. A JS-only input that never
            changed the URL would make that markup a lie. */}
        <form
          role="search"
          className="flex max-w-2xl flex-wrap items-center gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            const value = String(new FormData(e.currentTarget).get("q") ?? "").trim();
            void navigate({
              to: "/$lang/search",
              params: { lang },
              search: value ? { q: value } : {},
            });
          }}
        >
          <label htmlFor="q" className="sr-only">
            {t("search.label")}
          </label>
          <div className="relative min-w-0 flex-1">
            <SearchIcon
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cool"
              aria-hidden
            />
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={query}
              autoComplete="off"
              placeholder={t("search.placeholder")}
              className="h-14 w-full rounded-full bg-charcoal pl-12 pr-5 text-[17px] text-crisp outline-none ring-signal placeholder:text-cool focus-visible:ring-2"
            />
          </div>
          <button type="submit" className="pill pill-accent">
            {t("search.submit")}
          </button>
        </form>

        <div className="mt-10">
          {!terms.length ? (
            <p className="subhead measure text-[17px]">{t("search.prompt")}</p>
          ) : results.length ? (
            <>
              <p className="text-[15px] text-cool">
                {t("search.results", { count: results.length })}
              </p>
              <div
                data-stagger
                className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {results.map((p) => (
                  <div key={p.id} className="h-full">
                    <ProductCard p={p} lang={lang} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="measure">
              <h2 className="type-title text-crisp">{t("search.empty_title")}</h2>
              <p className="subhead mt-3 text-[17px]">{t("search.empty_sub")}</p>
              <LocaleLink to="/compare" className="pill-link mt-4">
                {t("search.all")} <ChevronRight className="h-4 w-4" aria-hidden />
              </LocaleLink>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}
