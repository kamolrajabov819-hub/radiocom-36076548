import type { ReactNode, CSSProperties } from "react";

export function Section({
  children,
  className = "",
  tight = false,
  bleed = false,
  style,
  id,
}: {
  children: ReactNode;
  className?: string;
  tight?: boolean;
  bleed?: boolean;
  style?: CSSProperties;
  id?: string;
}) {
  const pad = tight ? "py-16 md:py-24" : "py-24 md:py-32";
  return (
    <section id={id} style={style} className={`${pad} ${className}`}>
      <div className={bleed ? "" : "max-w-[1200px] mx-auto px-6 md:px-10"}>{children}</div>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  sub,
  align = "center",
  invert = false,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  align?: "center" | "left";
  invert?: boolean;
}) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`${alignCls} max-w-3xl ${align === "center" ? "" : "max-w-full"} mb-14`}>
      {eyebrow && (
        <div className="eyebrow-sweep text-[13px] tracking-wide font-medium mb-4">{eyebrow}</div>
      )}
      <h2
        className={`headline ${invert ? "text-white" : "text-crisp"}`}
        style={{ fontSize: "clamp(2.25rem, 5.5vw, 4.5rem)" }}
      >
        {title}
      </h2>
      {sub && (
        <p className={`subhead mt-4 text-lg ${align === "center" ? "mx-auto max-w-2xl" : ""}`}>
          {sub}
        </p>
      )}
    </div>
  );
}
