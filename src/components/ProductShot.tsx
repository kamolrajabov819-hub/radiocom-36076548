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
 * `fit` picks between the two ways a photo can sit in a card:
 *   - `"contain"` floats the product on the card's own background. Needs the
 *     source's sweep to be near-pure white, or multiply leaves a grey box.
 *   - `"cover"` crops the photograph edge to edge and blends nothing. Use it
 *     for compositions — flat-lays, scenes — where the frame is the point.
 *
 * `srcSet` is built from the `@800` sibling the asset pipeline emits next to
 * every full-size WebP, so cards on phones fetch a third of the bytes.
 */
export function ProductShot({
  src,
  alt,
  width,
  height,
  className = "",
  imgClassName = "",
  blend,
  fit = "contain",
  tone = "light",
  priority = false,
  sizes = "(max-width: 768px) 90vw, 45vw",
  style,
}: {
  /** Full-size image. A `foo@800.webp` sibling is used for the small source. */
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  imgClassName?: string;
  /** Defaults to true for `contain`, false for `cover`. */
  blend?: boolean;
  fit?: "contain" | "cover";
  tone?: "light" | "dark";
  /** Set on the LCP image so the browser fetches it ahead of the rest. */
  priority?: boolean;
  sizes?: string;
  style?: CSSProperties;
}) {
  const cover = fit === "cover";
  const small = src.replace(/\.webp$/, "@800.webp");
  const shouldBlend = blend ?? !cover;
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

  return (
    // The `stage` contact shadow belongs under a floating product, not under a
    // cropped photograph — a cover image would cast it onto its own frame.
    <div
      className={`${cover ? `overflow-hidden ${positioned ? "" : "relative"}` : "stage"} ${className}`}
      style={style}
    >
      <img
        src={src}
        srcSet={small === src ? undefined : `${small} 800w, ${src} 1600w`}
        sizes={sizes}
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
