import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Subtle 3D tilt that follows the cursor, with a light sheen tracking the pointer.
 * Falls back to a plain container when the user prefers reduced motion.
 */
export function TiltCard({
  children,
  className = "",
  max = 6,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const srx = useSpring(my, { stiffness: 180, damping: 20 });
  const sry = useSpring(mx, { stiffness: 180, damping: 20 });
  const rotateX = useTransform(srx, [0, 1], [max, -max]);
  const rotateY = useTransform(sry, [0, 1], [-max, max]);

  return (
    <motion.div
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={`[transform-style:preserve-3d] motion-reduce:!transform-none ${className}`}
    >
      {children}
    </motion.div>
  );
}
