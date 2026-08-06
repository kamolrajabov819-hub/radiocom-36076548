import { motion } from "framer-motion";
import { spring } from "@/lib/springs";

/** Reveals a headline word by word as it scrolls into view. */
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
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block mr-[0.25em]"
            variants={{
              hidden: { y: "110%", opacity: 0 },
              show: { y: "0%", opacity: 1 },
            }}
            transition={{ ...spring, delay: delay + i * 0.05 }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
