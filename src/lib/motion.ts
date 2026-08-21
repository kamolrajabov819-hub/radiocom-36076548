import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * Scroll choreography: Lenis for the inertial feel, GSAP ScrollTrigger for
 * pinned and scrub-driven sections.
 *
 * Two rules hold throughout:
 *
 *  1. **Nothing runs on the server.** Both libraries touch `window` on
 *     construction, so every entry point is guarded and lives in an effect.
 *  2. **Nothing runs under `prefers-reduced-motion`.** Framer Motion is covered
 *     by `MotionConfig reducedMotion="user"` in the root, but that does not
 *     reach Lenis or GSAP — hijacked scrolling is exactly the kind of vestibular
 *     motion the preference exists to switch off, so both no-op entirely.
 */

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** `useLayoutEffect` on the client, `useEffect` on the server (avoids the SSR warning). */
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

let registered = false;
function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

/**
 * Mounts Lenis once for the whole document and drives ScrollTrigger from it.
 *
 * Without the `lenis.on("scroll", ScrollTrigger.update)` handoff the two run on
 * separate clocks: Lenis animates a virtual scroll position while ScrollTrigger
 * reads the native one, and pinned sections visibly lag the content.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion()) return;

    registerGsap();
    const lenis = new Lenis({
      duration: 1.05,
      // Long, shallow ease-out — the deceleration curve reads as weight rather
      // than as a slow animation.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);
}

/**
 * Runs GSAP setup scoped to a container, cleaned up on unmount.
 *
 * `gsap.context()` records every tween and ScrollTrigger created inside the
 * callback so `ctx.revert()` removes all of them — without it, ScrollTriggers
 * survive navigation and stack up on the next page.
 */
export function useGsap(
  setup: (ctx: { scope: HTMLElement }) => void,
  scopeRef: RefObject<HTMLElement | null>,
  deps: unknown[] = [],
) {
  useIsomorphicLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope || typeof window === "undefined" || prefersReducedMotion()) return;

    registerGsap();
    const ctx = gsap.context(() => setup({ scope }), scope);
    return () => ctx.revert();
  }, deps);
}

/**
 * Apple's signature move: a section that holds still while its contents advance
 * with the scrollbar. Returns the ref to attach to the pinned section.
 */
export function usePinnedScrub(
  build: (tl: gsap.core.Timeline, scope: HTMLElement) => void,
  opts: { end?: string; deps?: unknown[] } = {},
) {
  const ref = useRef<HTMLElement>(null);
  useGsap(
    ({ scope }) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: "top top",
          end: opts.end ?? "+=120%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });
      build(tl, scope);
    },
    ref,
    opts.deps ?? [],
  );
  return ref;
}

export { gsap, ScrollTrigger };
