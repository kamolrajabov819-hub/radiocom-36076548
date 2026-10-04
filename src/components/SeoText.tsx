import { Fragment } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { brandCase } from "@/lib/brand";
import { useLang } from "@/lib/locale";
import { fadeUpAt } from "@/lib/springs";
import { Section } from "@/components/Section";
import type { Picked, PageCopy } from "@/data/copy/pick";

type Sections = Picked<PageCopy>["sections"];

/**
 * The prose a landing page answers its search query with: two to four `h2`
 * sections after the commercial blocks and before the FAQ.
 *
 * It renders whatever a `src/data/copy/pages/*` module holds — never the locale
 * JSON, which is eager on every route — and it renders all of it, open, in the
 * server HTML. Collapsed SEO text is text a reader never sees; a search engine
 * discounts it for the same reason.
 *
 * Links are written in the copy as `[anchor](/path)` and resolve in the
 * reader's language. `verify-content.ts` fails the build if a path is not a
 * page in the sitemap, so an internal link here cannot be a 404.
 */
export function SeoText({
  sections,
  band = "plain",
}: {
  sections: Sections;
  band?: "plain" | "soft";
}) {
  if (!sections.length) return null;
  return (
    <Section band={band}>
      <div className="grid grid-cols-1 gap-x-16 gap-y-14 md:grid-cols-2">
        {sections.map((s, i) => (
          <motion.div key={s.heading} {...fadeUpAt(i % 2)} className="measure">
            <h2 className="type-title text-crisp">{brandCase(s.heading)}</h2>
            {s.body.map((para, j) => (
              <p key={j} className="type-body mt-4 text-cool">
                <Rich text={para} />
              </p>
            ))}
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

const LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

/** Plain text with `[anchor](/path)` links, brand names cased as everywhere else. */
export function Rich({ text }: { text: string }) {
  const lang = useLang();
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    const at = m.index ?? 0;
    if (at > last) out.push(<Fragment key={last}>{brandCase(text.slice(last, at))}</Fragment>);
    const path = m[2];
    out.push(
      // A plain path rather than `LocaleLink`'s route union: copy links reach
      // product pages by URL, and the sitemap check above is what keeps them
      // honest instead of the type system.
      <Link
        key={at}
        to={(path === "/" ? `/${lang}` : `/${lang}${path}`) as never}
        className="link-inline"
      >
        {brandCase(m[1])}
      </Link>,
    );
    last = at + m[0].length;
  }
  if (last < text.length) out.push(<Fragment key={last}>{brandCase(text.slice(last))}</Fragment>);
  return <>{out}</>;
}
