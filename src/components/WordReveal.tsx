import { Fragment } from "react";
import { motion } from "framer-motion";
import { spring } from "@/lib/springs";
import { brandCase } from "@/lib/brand";

/**
 * Reveals a headline word by word as it scrolls into view.
 *
 * The space between words is emitted as a real text node, outside the clipping
 * box. It used to be faked with `mr-[0.25em]` on the inner span, which meant the
 * markup itself carried no separator: a crawler, a screen reader and anyone
 * copying the heading all received `Несокрушимые,Профессиональныерации.` as one
 * run-on word. A natural word space measures 0.22em at this weight, so nothing
 * moves visibly.
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
