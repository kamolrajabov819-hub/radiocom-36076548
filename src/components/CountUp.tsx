import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { useLang } from "@/lib/locale";

export function CountUp({
  to,
  duration = 1.6,
  className = "",
}: {
  to: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const lang = useLang();
  const mv = useMotionValue(0);
  // `toLocaleString()` with no argument formats in the *runtime's* locale, not
  // the page's — which is `en-US` here, so every counted figure got a comma
  // thousands separator. In Russian and Uzbek the comma is the **decimal**
  // separator, so «3,600 мА·ч» read as "3.6 mAh" and «7,400 м²» as "7.4 m²" to
  // exactly the readers those pages are written for. Both locales want a space.
  const locale = lang === "en" ? "en-US" : lang === "uz" ? "uz-UZ" : "ru-RU";
  const rounded = useTransform(mv, (v) => Math.round(v).toLocaleString(locale));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, { duration, ease: [0.22, 1, 0.36, 1] });
    return controls.stop;
  }, [inView, to, duration, mv]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{rounded}</motion.span>
    </span>
  );
}
