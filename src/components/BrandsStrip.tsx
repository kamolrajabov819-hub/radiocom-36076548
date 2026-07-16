import { useTranslation } from "react-i18next";
import { products } from "@/data/products";

const brands = ["Motorola", "Hytera", "Radiocom RC", "Decross", "Caltta", "Baofeng", "Alinco", "Samcom"] as const;

export function BrandsStrip() {
  const { t } = useTranslation();
  const items = brands.map((b) => ({
    name: b,
    count: products.filter((p) => p.brand === b).length,
  }));
  // duplicate for seamless loop
  const loop = [...items, ...items];

  return (
    <section className="section-tight px-0 bg-pitch overflow-hidden">
      <div className="max-w-[1200px] mx-auto text-center px-6 md:px-10 mb-10">
        <div className="text-[11px] tracking-[0.24em] uppercase text-cool">
          {t("brands_title")}
        </div>
        <h2 className="headline text-crisp text-3xl md:text-5xl mt-3">
          Authorized <span className="text-signal">distribution</span>
        </h2>
      </div>

      <div className="relative group">
        {/* edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-40 z-10 bg-gradient-to-r from-pitch to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-40 z-10 bg-gradient-to-l from-pitch to-transparent" />

        <div className="flex gap-4 md:gap-6 marquee-track will-change-transform">
          {loop.map((b, i) => (
            <div
              key={`${b.name}-${i}`}
              className="shrink-0 w-[240px] md:w-[300px] h-[140px] md:h-[160px] rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.05] to-white/[0.01] backdrop-blur-sm flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500 hover:border-signal/40 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(227,6,19,0.5)]"
            >
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,rgba(227,6,19,0.15),transparent_70%)]" />
              <div className="text-xl md:text-2xl font-semibold tracking-tight text-crisp">
                {b.name}
              </div>
              {b.count > 0 && (
                <div className="text-[11px] text-cool mt-2 tracking-widest uppercase">
                  {b.count} {t("brands.models")}
                </div>
              )}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-signal transition-all duration-500 group-hover:w-full" />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee-scroll 40s linear infinite;
          width: max-content;
        }
        .group:hover .marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>
    </section>
  );
}
