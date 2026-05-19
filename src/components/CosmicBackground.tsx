import { useMemo } from "react";

/**
 * Lightweight cosmic background — pure CSS + a few SVG stars.
 * Replaces Three.js starfield. Zero canvas, mobile-safe.
 */
export function CosmicBackground() {
  const stars = useMemo(() => {
    const seed = (i: number) => {
      const x = Math.sin(i * 9301 + 49297) * 233280;
      return x - Math.floor(x);
    };
    const r3 = (n: number) => Math.round(n * 1000) / 1000;
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: r3(seed(i) * 100),
      y: r3(seed(i + 100) * 100),
      size: r3(seed(i + 200) * 2 + 0.5),
      opacity: r3(seed(i + 300) * 0.6 + 0.2),
      delay: r3(seed(i + 400) * 6),
    }));
  }, []);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {/* Deep gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, oklch(0.22 0.12 305 / 0.45) 0%, transparent 55%), radial-gradient(ellipse at 80% 100%, oklch(0.18 0.10 280 / 0.45) 0%, transparent 55%), oklch(0.07 0.03 280)",
        }}
      />
      {/* Stars */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {stars.map((s) => (
          <circle
            key={s.id}
            cx={s.x}
            cy={s.y}
            r={s.size * 0.08}
            fill="white"
            opacity={s.opacity}
          >
            <animate
              attributeName="opacity"
              values={`${s.opacity};${s.opacity * 0.3};${s.opacity}`}
              dur={`${4 + s.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>
      {/* Nebula glow */}
      <div
        className="absolute left-1/2 top-1/3 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.7 0.20 305 / 0.5), transparent 70%)" }}
      />
    </div>
  );
}
