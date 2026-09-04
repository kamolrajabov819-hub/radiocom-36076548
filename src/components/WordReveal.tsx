import { Fragment } from "react";
import { motion } from "framer-motion";
import { spring } from "@/lib/springs";
import { brandCase } from "@/lib/brand";

/**
 * Reveals a headline word by word as it scrolls into view.
 *
 * **The space between words is a real space.** It reads like a detail and is
 * not: the first version of this component split on `" "` and then dropped the
 * space, faking the gap with `mr-[0.25em]` on each word. It looked right and was
 * wrong everywhere the pixels are not what is read. `SectionHead` renders every
 * section title on the site through here, so the served HTML said
 *
 *     <h1>Несокрушимые,Профессиональныерации.</h1>
 *     <h2>Рациидлябизнеса</h2>
 *
 * — 31 headings across the 15 routes sampled, in all three locales, in the
 * server-rendered markup rather than only after hydration. That is the string a
 * screen reader announces, the string a crawler indexes, the string that lands
 * when someone selects the heading and copies it, and the string the
 * `text/markdown` negotiation path serves to agents. The two headings on the
 * home page that read correctly were the two that hand-rolled their own `<h2>`
 * instead of coming through here.
 *
 * A text node between the word boxes fixes all of it at once, and costs nothing
 * visually: a normal word space is what the gap was imitating. It is also the
 * better line-break behaviour, since a space at a wrap point collapses where a
 * right margin would hang.
 */
export function WordReveal({
  text,
  className = "",
  delay = 0,
  as = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "span" | "h2" | "h1" | "h3";
}) {
  const Tag = motion[as] as typeof motion.span;
  const words = text.split(" ");

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
    >
      {words.map((w, i) => (
        <Fragment key={i}>
          {/* Outside the clipping box, so the reveal never eats it. */}
          {i > 0 && " "}
          <span className="inline-block overflow-hidden align-bottom">
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: "110%", opacity: 0 },
                show: { y: "0%", opacity: 1 },
              }}
              transition={{ ...spring, delay: delay + i * 0.05 }}
            >
              {brandCase(w)}
            </motion.span>
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}
