import type { Transition } from "framer-motion";

/**
 * Apple-style motion system.
 *
 * Two springs only:
 *  - `spring`   — critically damped (no overshoot), ~0.4s response. Default for all UI.
 *  - `springBounce` — slight overshoot, reserved for momentum-carrying interactions
 *    (drag release, flick, sheet dismissal).
 *
 * Framer Motion's `bounce` + `duration` API maps directly onto Apple's
 * damping-ratio + response parameters.
 */
export const spring: Transition = { type: "spring", bounce: 0, duration: 0.4 };
export const springSoft: Transition = { type: "spring", bounce: 0, duration: 0.6 };
export const springFast: Transition = { type: "spring", bounce: 0, duration: 0.28 };
export const springBounce: Transition = { type: "spring", bounce: 0.2, duration: 0.4 };
export const easeOut: Transition = { duration: 0.7, ease: [0.22, 1, 0.36, 1] };

/** Standard section reveal: opacity + 16px rise, once. */
export const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: spring,
};

/** Staggered variant of the standard reveal — 60ms per index. */
export function fadeUpAt(index: number) {
  return {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { ...spring, delay: index * 0.06 },
  };
}
