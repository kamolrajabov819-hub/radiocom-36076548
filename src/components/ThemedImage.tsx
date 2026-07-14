import { useEffect, useState } from "react";

/**
 * Swaps between two image sources based on the current .dark class on <html>.
 * Cross-fades on theme change and follows OS scheme on first paint.
 */
export function ThemedImage({
  light,
  dark,
  alt = "",
  className = "",
  eager = false,
  width,
  height,
}: {
  light: string;
  dark: string;
  alt?: string;
  className?: string;
  eager?: boolean;
  width?: number;
  height?: number;
}) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const el = document.documentElement;
    const update = () => setIsDark(el.classList.contains("dark"));
    update();
    const obs = new MutationObserver(update);
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  return (
    <div className={`relative ${className}`}>
      <img
        src={light}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          isDark ? "opacity-0" : "opacity-100"
        }`}
      />
      <img
        src={dark}
        alt=""
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        aria-hidden
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          isDark ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
