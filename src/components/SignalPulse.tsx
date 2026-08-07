import { motion } from "framer-motion";

/**
 * Radiocom signature motif: concentric radio-signal rings.
 * Purely decorative; place inside a relatively positioned parent.
 */
export function SignalPulse({
  className = "",
  rings = 5,
  size = 900,
  color = "var(--signal)",
  opacity = 0.35,
}: {
  className?: string;
  rings?: number;
  size?: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 400 400"
        className="max-w-none"
        style={{ opacity }}
      >
        <defs>
          <radialGradient id="pulseFade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.9" />
            <stop offset="70%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="4" fill={color} opacity="0.25" />
        {Array.from({ length: rings }).map((_, i) => (
          <motion.circle
            key={i}
            cx="200"
            cy="200"
            r="20"
            fill="none"
            stroke="url(#pulseFade)"
            strokeWidth="1.25"
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: [0.2, 9], opacity: [0, 0.9, 0] }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              delay: i * (5.5 / rings),
              ease: "easeOut",
            }}
            style={{ transformOrigin: "200px 200px" }}
          />
        ))}
      </svg>
    </div>
  );
}
