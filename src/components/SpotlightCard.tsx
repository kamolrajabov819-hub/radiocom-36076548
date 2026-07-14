import { useRef, type ReactNode, type MouseEvent } from "react";

/**
 * Cursor-follow radial spotlight on top of a bento card.
 */
export function SpotlightCard({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "button";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${e.clientX - r.left}px`);
    el.style.setProperty("--sy", `${e.clientY - r.top}px`);
  };
  const props = {
    ref: ref as React.RefObject<HTMLDivElement & HTMLButtonElement>,
    onMouseMove: onMove,
    className: `spotlight-card ${className}`,
  };
  return Tag === "button" ? (
    <button {...props}>{children}</button>
  ) : (
    <div {...props}>{children}</div>
  );
}
