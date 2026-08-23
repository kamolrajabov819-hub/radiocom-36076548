import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
  type RefObject,
} from "react";
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
 * `true` when the query matches, `true` always when no query is given.
 *
 * `useSyncExternalStore` rather than an effect-plus-state pair: it gives the
 * server and the first client render the same answer (`false`, so nothing
 * loads during hydration) and subscribes to the query without a second render
 * pass.
 */
function useMediaQuery(query?: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!query || typeof window === "undefined") return () => {};
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => (query ? window.matchMedia(query).matches : true),
    () => false,
  );
}

/**
 * Runs GSAP setup scoped to a container, cleaned up on unmount.
 *
 * `gsap.context()` records every tween and ScrollTrigger created inside the
 * callback so `ctx.revert()` removes all of them — without it, ScrollTriggers
 * survive navigation and stack up on the next page.
 */
export function useGsap(
  setup: (ctx: { scope: HTMLElement; gsap: Gsap; ScrollTrigger: typeof ScrollTriggerType }) => void,
  scopeRef: RefObject<HTMLElement | null>,
  deps: unknown[] = [],
  /**
   * A media query that must match before GSAP is fetched at all.
   *
   * `gsap.matchMedia()` inside `setup` is the right tool for building triggers
   * conditionally, but it runs *after* the chunk has downloaded — so a phone
   * would still pay 27 KB to decide it wants none of it. Passing the query here
   * moves the decision in front of the network request.
   *
   * `useMediaQuery` keeps it live, so resizing a window past the breakpoint
   * re-runs the effect and loads GSAP then.
   */
  when?: string,
) {
  const active = useMediaQuery(when);

  useIsomorphicLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope || typeof window === "undefined" || prefersReducedMotion()) return;
    if (!active) return;

    let cancelled = false;
    let ctx: ReturnType<Gsap["context"]> | undefined;

    void loadGsap().then((loaded) => {
      if (cancelled) return;
      driveWithGsap(loaded);
      ctx = loaded.gsap.context(
        () => setup({ scope, gsap: loaded.gsap, ScrollTrigger: loaded.ScrollTrigger }),
        scope,
      );
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [...deps, active]);
}

/**
 * Apple's signature move: a section that holds still while its contents advance
 * with the scrollbar. Returns the ref to attach to the pinned section.
 *
 * **Desktop only.** A pin is a promise that the scroll is doing something; on a
 * phone it reads as a broken page. The home hero pinned for `+=90%` of the
 * viewport, which on a 844px screen is 760px of thumb-scrolling that leaves the
 * page apparently still — and the pin-spacer renders as 760px of blank band in
 * any full-page capture. apple.com pins on desktop and does not on a phone, for
 * the same reason.
 *
 * `gsap.matchMedia()` is what makes that conditional safe: it creates the
 * ScrollTrigger only while the query matches and reverts everything the moment
 * it stops, so rotating a tablet does not leave a stranded pin behind.
 */
export function usePinnedScrub(
  build: (tl: ReturnType<Gsap["timeline"]>, scope: HTMLElement) => void,
  opts: { end?: string; deps?: unknown[] } = {},
) {
  const ref = useRef<HTMLElement>(null);
  useGsap(
    ({ scope, gsap }) => {
      gsap.matchMedia().add(DESKTOP, () => {
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
      });
    },
    ref,
    opts.deps ?? [],
  );
  return ref;
}

/**
 * The breakpoint pinning is allowed above — the same 768px `md:` the layout
 * uses, so a section never pins at a width where the layout has already gone
 * single-column.
 */
export const DESKTOP = "(min-width: 768px)";

/* ─────────────────────────────────────────────────────────────
   The scroll choreography
   ───────────────────────────────────────────────────────────── */

/**
 * One hook, applied per page, that reads its motion off the markup.
 *
 * Every page but the home page animated with Framer Motion alone, which does
 * one thing: fade a block in once as it enters. That is an *appearance*, and
 * apple.com's pages do not feel the way they do because things appear — they
 * feel that way because things keep moving with the scrollbar after they have
 * arrived. This is the missing half.
 *
 * Three behaviours, opted into with data attributes rather than by threading
 * refs through every section:
 *
 *   `data-parallax="0.1"` — the element drifts against its band as the band
 *     passes. The number is how far, as a fraction of its own height. Product
 *     shots want 0.06-0.12; a full-bleed backdrop can take 0.2.
 *
 *   `data-scrub-in` — the element advances from slightly low and soft into
 *     place across the first third of its band, tied to the scrollbar rather
 *     than to a timer, so scrolling back up runs it backwards.
 *
 *   `data-stagger` on a container — its element children enter in sequence as
 *     the row crosses the fold, via `ScrollTrigger.batch` so the whole visible
 *     run animates together instead of each card firing its own trigger.
 *
 * **One library per element.** Framer owns the one-shot entrance; GSAP owns
 * everything tied to scroll position. Both write `opacity` and `transform`, so
 * an element carrying a Framer `fadeUpAt` *and* a `data-stagger` parent gets
 * two libraries fighting over the same properties — which reads as a flicker,
 * not as a richer animation. Four containers were marked and then unmarked for
 * exactly this: `DuoCard` and `PosterCard` are `motion.article` at the root, so
 * any grid of them already animates item by item.
 *
 * Before adding `data-stagger` to a container, check that its children are not
 * motion components.
 *
 * **Desktop only, including the download.** The whole hook is behind a
 * `(min-width: 768px)` check that runs *before* `loadGsap`, so a phone never
 * fetches the 27 KB chunk at all. Parallax on a short viewport spends most of
 * its life mid-drift, and a scrubbed reveal competes with the momentum of the
 * flick that triggered it — so there is nothing on a phone for that 27 KB to
 * buy. Framer's entrances still run there, as they always did.
 */
export function useScrollChoreography<T extends HTMLElement = HTMLDivElement>() {
  const scopeRef = useRef<T>(null);
  useGsap(
    ({ scope, gsap, ScrollTrigger }) => {
      const mm = gsap.matchMedia();

      mm.add(DESKTOP, () => {
        for (const el of scope.querySelectorAll<HTMLElement>("[data-parallax]")) {
          const depth = Number(el.dataset.parallax) || 0.1;
          const band = el.closest("section") ?? el.parentElement ?? el;
          gsap.fromTo(
            el,
            { yPercent: -depth * 50 },
            {
              yPercent: depth * 50,
              ease: "none",
              scrollTrigger: { trigger: band, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        }

        for (const el of scope.querySelectorAll<HTMLElement>("[data-scrub-in]")) {
          gsap.fromTo(
            el,
            { y: 48, opacity: 0.25 },
            {
              y: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "top 62%", scrub: 0.5 },
            },
          );
        }

        for (const row of scope.querySelectorAll<HTMLElement>("[data-stagger]")) {
          const items = Array.from(row.children) as HTMLElement[];
          if (!items.length) continue;
          gsap.set(items, { y: 28, opacity: 0 });
          // `batch` collects every element crossing the fold within one frame and
          // hands them to a single callback, so a four-card row animates as one
          // gesture. Four independent triggers fire microseconds apart and read
          // as four separate events.
          ScrollTrigger.batch(items, {
            start: "top 88%",
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, {
                y: 0,
                opacity: 1,
                duration: 0.7,
                stagger: 0.08,
                ease: "power2.out",
                overwrite: true,
              }),
          });
        }
      });
    },
    scopeRef,
    [],
    DESKTOP,
  );

  return scopeRef;
}

/**
 * Deliberately no `export { gsap }`. A re-export would let a call site write
 * `import { gsap } from "@/lib/motion"`, which is a static import again and
 * would pull GSAP straight back into whatever chunk that page lives in. The
 * instance reaches call sites through the `setup` callback instead.
 */
export type { Gsap };
