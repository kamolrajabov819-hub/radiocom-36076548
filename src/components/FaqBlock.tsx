import { useTranslation } from "react-i18next";
import { Faq } from "@/components/Faq";
import { Section, SectionHead } from "@/components/Section";
import { faqSchema } from "@/lib/seo";
import { useLang } from "@/lib/locale";

/**
 * A page's FAQ section and its `FAQPage` JSON-LD, from one array.
 *
 * Keeping the two together is the point. Schema that quotes text the page does
 * not show is mismatched markup, and the easiest way to ship it is to build
 * the schema in `head` from one source and the visible list from another. Here
 * both come from `items`, in the reader's language, in the server HTML —
 * JSON-LD is as valid in the body as in the head, and `head` cannot import the
 * code-split copy modules these questions live in.
 */
export function FaqBlock({
  items,
  title,
  band = "soft",
  alsoInSchema = [],
}: {
  items: { q: string; a: string }[];
  title?: string;
  band?: "plain" | "soft";
  /**
   * Question rows rendered elsewhere on the same page (the service page's
   * return-policy list), folded into this block's `FAQPage` so a page carries
   * one FAQPage, not two. They must be visible on the page — that is the
   * caller's promise, and the reason this is not a general-purpose prop.
   */
  alsoInSchema?: { q: string; a: string }[];
}) {
  const { t } = useTranslation();
  const lang = useLang();
  if (!items.length) return null;
  return (
    <Section band={band} tight>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema([...items, ...alsoInSchema], lang)),
        }}
      />
      <div className="mx-auto max-w-3xl">
        <div data-scrub-in>
          <SectionHead align="center" spacing="tight" title={title ?? t("industries.faq_title")} />
        </div>
        <Faq items={items} />
      </div>
    </Section>
  );
}
