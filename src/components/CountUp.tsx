import { useEffect, useRef } from "react";
import { useLang } from "@/lib/locale";

/**
 * Group a whole number the way each locale writes it: a no-break space in
 * Russian and Uzbek («10 000»), a comma in English ("10,000").
 *
 * Hand-rolled rather than `toLocaleString`, because the server and the
 * browser must produce the same characters. ICU data differs between Node and
 * browsers (and some Android builds ship trimmed data), and a hydration
 * mismatch in a text node makes React re-render the document. A comma in
 * Russian would also read as a decimal point: «3,600 мА·ч» is 3.6 mAh.
 */
export function formatCount(n: number, lang: string): string {
  const sep = lang === "en" ? "," : " ";
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}

const EASE_OUT = (p: number) => 1 - Math.pow(1 - p, 4);

/**
 * A figure that counts up when it scrolls into view — and is the real figure
 * everywhere else.
 *
 * It used to start from 0 and count only once in view, so the server HTML
 * said «0+ моделей раций · 0 лет на рынке». That is what Yandex indexed, what a
 * slow phone showed first, and what a reader with JavaScript off saw for good.
 * Now the server renders the final value. On the client the count-up plays
 * only when it can be seen to play: the number drops to 0 just before it
 * scrolls in, then counts to the target. Already on screen at load, or under
 * `prefers-reduced-motion`, it simply stays the real number.
 *
 * One text node, no screen-reader twin: outside a live region the count is not
 * announced as it changes, and a visually hidden copy of the figure would read
 * «3535+» to every crawler that extracts the text.
 */
export function CountUp({
  to,
  duration = 1.6,
  className = "",
}: {
  to: number;
  duration?: number;
  className?: string;
}) {
  const lang = useLang();
  const ref = useRef<HTMLSpanElement>(null);
  const final = formatCount(to, lang);

  useEffect(() => {
    const el = ref.current;
    // Write through React's own text node, never `textContent`: replacing the
    // node would leave React updating a detached one on the next render.
    const node = el?.firstChild;
    if (!el || !node || node.nodeType !== Node.TEXT_NODE) return;
    node.nodeValue = final;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = el.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) return;

    let raf = 0;
    const play = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        play.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const p = Math.min(1, (now - start) / (duration * 1000));
          node.nodeValue = p < 1 ? formatCount(to * EASE_OUT(p), lang) : final;
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    // A quarter of a screen early, so the drop to 0 happens out of sight.
    const arm = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        arm.disconnect();
        node.nodeValue = formatCount(0, lang);
        play.observe(el);
      },
      { rootMargin: "0px 0px 25% 0px" },
    );
    arm.observe(el);
    return () => {
      arm.disconnect();
      play.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration, lang, final]);

  return (
    <span ref={ref} className={className} suppressHydrationWarning>
      {final}
    </span>
  );
}
