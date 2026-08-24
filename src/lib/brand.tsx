import { Fragment, type ReactNode } from "react";

/**
 * Render the brand as RADIOCOM without writing RADIOCOM into the document.
 *
 * The wordmark in the header is all-caps, so body copy that reads "Radiocom"
 * beside it is the site disagreeing with its own logo. This closes that gap.
 *
 * It does it in CSS rather than by uppercasing the string, and the difference
 * matters in three places:
 *
 *  - **Structured data.** Every product page emits `Product.name` as
 *    "Radiocom RCD-70 PRO". Google checks that a schema `name` actually appears
 *    on the page it describes; a DOM that said RADIOCOM while the JSON-LD said
 *    Radiocom would be two different claims about one product. `text-transform`
 *    leaves the text node identical to the markup and changes only the glyphs.
 *  - **Screen readers.** An all-caps token in the DOM is read letter by letter
 *    by several voice engines — "R, A, D, I, O, C, O, M". The accessible name
 *    here stays "Radiocom" and is spoken as a word.
 *  - **Selecting and searching.** Copy pastes as "Radiocom"; find-in-page for
 *    "Radiocom" still matches.
 *
 * The match is deliberately case-sensitive and word-bounded: it takes the
 * brand as a proper noun, and leaves `radiocom.uz`, `@radiocom` and any string
 * already written in caps exactly as the author wrote them.
 */
export function brandCase(text: ReactNode): ReactNode {
  // Takes `ReactNode` rather than `string` so it can sit on a component prop
  // that is already typed loosely — `FeatureCard`'s `title` is a `ReactNode`
  // because a few call sites pass markup. Anything that is not a plain string
  // goes straight back out: this only ever rewrites text it can read.
  if (typeof text !== "string") return text;
  // `split` with a capturing group keeps the separators, so the captures land
  // on the odd indices and the surrounding text is preserved byte for byte.
  const parts = text.split(/\b(Radiocom)\b/g);
  if (parts.length === 1) return text;
  return (
    // The outer span is not decoration. Several call sites render into a flex
    // container — the breadcrumb links are `inline-flex min-h-11 items-center`,
    // to carry a 44px touch target — and a flex container turns each child into
    // a flex item, then strips leading and trailing whitespace from each one.
    // Splitting "Radiocom RCD-70 PRO" into a span plus a text node therefore
    // produced two flex items and ate the space between them: the breadcrumb
    // read "RADIOCOMRCD-70 PRO". Wrapping the pieces back into one element
    // makes them one flex item with ordinary inline layout inside it.
    <span>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="uppercase">
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </span>
  );
}
