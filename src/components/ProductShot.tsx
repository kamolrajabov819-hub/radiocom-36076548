import type { CSSProperties } from "react";

/**
 * A product photograph on a stage.
 *
 * Every product image on this site is a studio shot on a white sweep, so the
 * house technique is `mix-blend-multiply` to knock the white out and let the
 * radio sit on whatever the band's colour is. That only works while the
 * container is light: multiply keeps dark pixels dark, so a dark-background
 * source rendered this way stays a hard black rectangle — which is exactly what
 * went wrong with the PoC rental image.
 *
 * So the blend is opt-out (`blend={false}`) rather than something each call site
 * re-derives, and `tone="dark"` switches to `screen`, which is multiply's
 * counterpart for dark grounds.
 *
 * `cutout` is the third case, and the one to reach for with the files in
 * `src/assets/cutout/`: a source that carries a real alpha channel. Those need
 * no blend at all — there is no sweep to knock out — and blending one is not
 * merely redundant. Multiply darkens the contact shadow into a smudge, and on
 * a dark card either mode erases the subject outright: multiply keeps the dark
 * pixels of a black radio and drops it into the black card, screen turns it
 * white. `cutout` switches the blend off and turns the contact shadow on,
 * which is the pair that actually belongs together.
 *
 * `fit` picks between the two ways a photo can sit in a card:
 *   - `"contain"` floats the product on the card's own background. Needs the
 *     source's sweep to be near-pure white, or multiply leaves a grey box.
 *   - `"cover"` crops the photograph edge to edge and blends nothing. Use it
 *     for compositions — flat-lays, scenes — where the frame is the point.
 *
 * `srcSet` is only emitted when the caller passes `srcSmall` — an **explicit
 * import** of the `@800` sibling. It is never derived from `src`.
 *
 * That distinction is the whole point. `src` is a Vite-fingerprinted URL by the
 * time it reaches this component (`/assets/radio-kit-wide-BpJOK2JT.webp`), so
 * deriving the small variant by string surgery produced
 * `…-BpJOK2JT@800.webp`, which is not a real build artefact — and because
 * nothing imported the `@800` files, Vite never emitted them at all. Per the
 * HTML spec an `<img>` whose chosen `srcset` candidate fails goes to its broken
 * state and does *not* fall back to `src`, so those cards rendered as a broken
 * glyph at DPR 1 on desktop (where ~630 CSS px selects the 800w candidate) and
 * correctly at DPR 2 (where 1600w wins). Importing the sibling is what makes
 * Vite emit and fingerprint it.
 */
export function ProductShot({
  src,
  srcSmall,
  srcTiny,
  alt,
  width,
  height,
  className = "",
  imgClassName = "",
  blend,
  cutout = false,
  fit = "contain",
  shadow = false,
  tone = "light",
  priority = false,
  sizes = "(max-width: 768px) 90vw, 45vw",
  style,
}: {
  /** Full-size image, imported so Vite fingerprints and emits it. */
  src: string;
  /**
   * The `@800` variant, also imported. Omit when no such file exists — the
   * image then ships a single source rather than advertising a candidate that
   * 404s.
   */
  srcSmall?: string;
  /**
   * The `@400` variant, also imported. Same rule as `srcSmall`: omit it when
   * the file does not exist rather than advertising a candidate that 404s.
   *
   * This exists because the smallest candidate on offer was 800w, and several
   * of these render far smaller than that. Lighthouse measured the home page's
   * cutouts arriving at 574x800 for a 289x403 slot and 731x800 for 384x420 —
   * roughly 164 KB of pixels the layout never used. A 400w candidate is chosen
   * at DPR 1 and ignored at DPR 2, where 800w is still the correct pick, so
   * nothing gets softer on a phone.
   */
  srcTiny?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  imgClassName?: string;
  /** Defaults to true for `contain`, false for `cover`. */
  blend?: boolean;
  /**
   * The source carries an alpha channel. Switches the blend off and the
   * contact shadow on — see the note above on why blending a cutout is not
   * merely a no-op.
   */
  cutout?: boolean;
  fit?: "contain" | "cover";
  /** Adds the `stage` contact shadow. Only for a product floating on a band. */
  shadow?: boolean;
  tone?: "light" | "dark";
  /** Set on the LCP image so the browser fetches it ahead of the rest. */
  priority?: boolean;
  sizes?: string;
  style?: CSSProperties;
}) {
  const cover = fit === "cover";
  const shouldBlend = blend ?? (!cover && !cutout);
  const withShadow = shadow || cutout;
  const blendClass = shouldBlend
    ? tone === "dark"
      ? "mix-blend-screen"
      : "mix-blend-multiply"
    : "";

  // The wrapper only supplies `relative` when the caller has not positioned it
  // itself. Emitting both `relative` and the caller's `absolute` leaves the
  // winner to whichever rule Tailwind happens to emit last, which is how the
  // lead card's photograph ended up on the wrong side of the card.
  const positioned = /(?:^|\s)(?:absolute|fixed|sticky)(?:\s|$)/.test(className);

  // Always flex-centred, never the `stage` grid. `stage` centres with
  // `place-items: center`, which leaves the image content-sized, so `h-full`
  // has no definite height to resolve against and the photo renders at natural
  // size and overflows its frame. The contact shadow is drawn here instead of
  // borrowed from `stage` so that opting into it cannot drag that sizing bug
  // back in with it.
  const frame = cover ? "overflow-hidden" : "flex items-center justify-center";

  return (
    <div className={`${frame} ${positioned ? "" : "relative"} ${className}`} style={style}>
      {withShadow ? (
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[6%] left-1/2 h-[5%] w-[46%] -translate-x-1/2 rounded-[50%] bg-black/20 blur-[26px]"
        />
      ) : null}
      <img
        src={src}
        srcSet={
          srcSmall
            ? [srcTiny && `${srcTiny} 400w`, `${srcSmall} 800w`, `${src} 1600w`]
                .filter(Boolean)
                .join(", ")
            : undefined
        }
        sizes={srcSmall ? sizes : undefined}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : undefined}
        className={`h-full w-full ${cover ? "object-cover" : "object-contain"} ${blendClass} ${imgClassName}`}
      />
    </div>
  );
}
