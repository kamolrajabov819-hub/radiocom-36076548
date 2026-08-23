import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import type * as gsapNs from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
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

/**
 * GSAP is loaded on demand, not imported.
 *
 * A static `import gsap from "gsap"` here put 250 KB of GSAP plus ScrollTrigger
 * into the root bundle, because `__root.tsx` calls `useSmoothScroll` — so every
 * route paid for it, including the product and specs pages, which animate
 * nothing with GSAP. Only the home page's pinned hero uses it.
 *
 * Dynamic `import()` moves it into its own chunk that loads after paint, on the
 * routes that ask for it. Two consequences fall out for free: nothing is
 * fetched at all under `prefers-reduced-motion` (both entry points bail before
 * calling `loadGsap`), and nothing is fetched during SSR.
 *
 * The promise is memoised, so a page with several animated sections loads the
 * chunk once and every caller awaits the same fetch.
 */
type Gsap = typeof gsapNs.default;
type Loaded = { gsap: Gsap; ScrollTrigger: typeof ScrollTriggerType };

let loading: Promise<Loaded> | null = null;

/**
 * The live Lenis instance, so `useGsap` can hand scroll driving to GSAP's
 * ticker once GSAP has actually loaded. A module-level handle rather than
 * context: there is exactly one Lenis for the document, mounted by the root,
 * and threading a provider through for one object no component renders would
 * be ceremony.
 */
let lenis: Lenis | null = null;
let gsapDriving = false;

/**
 * Moves scroll driving from the plain RAF loop onto GSAP's ticker and syncs
 * ScrollTrigger to it. Idempotent — several animated sections on one page all
 * call it, and only the first does anything.
 */
function driveWithGsap({ gsap, ScrollTrigger }: Loaded) {
  if (gsapDriving || !lenis) return;
  const instance = lenis;
  gsapDriving = true;

  instance.on("scroll", ScrollTrigger.update);
  // Lenis wants milliseconds; the GSAP ticker reports seconds.
  gsap.ticker.add((time: number) => instance.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function loadGsap(): Promise<Loaded> {
  loading ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, st]) => {
    const gsap = g.default;
    gsap.registerPlugin(st.ScrollTrigger);
    return { gsap, ScrollTrigger: st.ScrollTrigger };
  });
  return loading;
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

    // Lenis only. `__root.tsx` calls this on every route, so anything imported
    // here is imported everywhere — the first attempt at this split still
    // pulled GSAP onto the product and specs pages for exactly that reason,
    // just deferred rather than bundled. Lenis is ~9 KB and is the actual
    // site-wide behaviour; GSAP is a home-page behaviour and now loads only
    // where `useGsap` runs.
    const instance = new Lenis({
      duration: 1.05,
      // Long, shallow ease-out — the deceleration curve reads as weight rather
      // than as a slow animation.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    lenis = instance;

    // Lenis animates a virtual scroll position while ScrollTrigger reads the
    // native one. Without a shared clock, pinned sections visibly lag the
    // content. When GSAP is present it takes over the RAF loop and installs
    // the handoff (see `driveWithGsap`); until then Lenis drives itself.
    let frame = requestAnimationFrame(function tick(time) {
      if (!gsapDriving) instance.raf(time);
      frame = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(frame);
      instance.destroy();
      if (lenis === instance) lenis = null;
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
  setup: (ctx: { scope: HTMLElement; gsap: Gsap }) => void,
  scopeRef: RefObject<HTMLElement | null>,
  deps: unknown[] = [],
) {
  useIsomorphicLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope || typeof window === "undefined" || prefersReducedMotion()) return;

    let cancelled = false;
    let ctx: ReturnType<Gsap["context"]> | undefined;

    void loadGsap().then((loaded) => {
      if (cancelled) return;
      driveWithGsap(loaded);
      ctx = loaded.gsap.context(() => setup({ scope, gsap: loaded.gsap }), scope);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, deps);
}

/**
 * Apple's signature move: a section that holds still while its contents advance
 * with the scrollbar. Returns the ref to attach to the pinned section.
 */
export function usePinnedScrub(
  build: (tl: ReturnType<Gsap["timeline"]>, scope: HTMLElement) => void,
  opts: { end?: string; deps?: unknown[] } = {},
) {
  const ref = useRef<HTMLElement>(null);
  useGsap(
    ({ scope, gsap }) => {
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

/**
 * Deliberately no `export { gsap }`. A re-export would let a call site write
 * `import { gsap } from "@/lib/motion"`, which is a static import again and
 * would pull GSAP straight back into whatever chunk that page lives in. The
 * instance reaches call sites through the `setup` callback instead.
 */
export type { Gsap };
