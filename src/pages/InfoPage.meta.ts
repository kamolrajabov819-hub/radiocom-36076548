/**
 * Route meta for the four pages added with the keyword map — /rent,
 * /solutions, /about, /contacts — kept out of the page modules for the reason
 * every `.meta.ts` here is: `head` is the one route property TanStack cannot
 * code-split, so whatever it imports is eager on every route. This imports
 * `@/lib/seo` and `@/lib/i18n` and nothing else; the pages' copy (and the FAQ
 * the copy carries) stays in the code-split module, and the page component
 * emits the FAQPage.
 */
import { tFor } from "@/lib/i18n";
import { PHONE_PRIMARY } from "@/lib/contacts";
import {
  SITE_NAME,
  SITE_URL,
  breadcrumbSchema,
  jsonLd,
  localeLinks,
  pageMeta,
  serviceSchema,
  webPageSchema,
  type InfoPage,
  type SeoLang,
} from "@/lib/seo";

/** The schema each page states about itself, beyond the WebPage node. */
const PAGE: Record<InfoPage, { type: "WebPage" | "AboutPage" | "ContactPage"; service?: string }> =
  {
    rent: { type: "WebPage", service: "Two-way radio rental" },
    solutions: { type: "WebPage", service: "Radio network design and installation" },
    about: { type: "AboutPage" },
    contacts: { type: "ContactPage" },
  };

export const infoHead =
  (key: InfoPage) =>
  ({ params }: { params: { lang: SeoLang } }) => {
    const t = tFor(params.lang);
    const path = `/${key}`;
    const title = t(`meta.${key}.title`);
    const description = t(`meta.${key}.desc`);
    const page = PAGE[key];

    return {
      meta: pageMeta({ lang: params.lang, title, description, path, ogCard: key }),
      links: localeLinks(params.lang, path),
      scripts: [
        jsonLd(
          webPageSchema({
            lang: params.lang,
            path,
            name: title,
            description,
            type: page.type,
            // The about and contacts pages are *about* the business; say which
            // node, so they join the identity graph rather than float beside it.
            ...(key === "about" ? { about: `${SITE_URL}/#organization` } : {}),
            ...(key === "contacts" ? { about: `${SITE_URL}/#localbusiness` } : {}),
          }),
        ),
        ...(page.service
          ? [
              jsonLd(
                serviceSchema(
                  {
                    name: title,
                    description,
                    path,
                    serviceType: page.service,
                    phone: PHONE_PRIMARY.e164,
                  },
                  params.lang,
                ),
              ),
            ]
          : []),
        jsonLd(
          breadcrumbSchema(
            [
              { name: SITE_NAME, path: "/" },
              { name: t(`meta.crumb.${key}`), path },
            ],
            params.lang,
          ),
        ),
      ],
    };
  };
