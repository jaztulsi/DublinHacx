import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import logo from "@/assets/dublin-hacx-logo.svg";

interface Props {
  onDone: () => void;
}

const ORBS = [
  { label: "BUILD", hue: 305, top: "38%" },
  { label: "SHIP", hue: 60, top: "50%" },
  { label: "DEMO", hue: 280, top: "62%" },
];

/**
 * Intro: 3 slow, glossy labeled orbs sweep across a starry sky,
 * then the Dublin Hacx logo materializes. ~5.5s total.
 */
export function IntroOverlay({ onDone }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 800);
    }, 5200);
    return () => clearTimeout(t);
  }, [onDone]);

  // Allow user to skip
  useEffect(() => {
    const skip = () => {
      setVisible(false);
      setTimeout(onDone, 500);
    };
    window.addEventListener("click", skip);
    window.addEventListener("keydown", skip);
    return () => {
      window.removeEventListener("click", skip);
      window.removeEventListener("keydown", skip);
    };
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[90] overflow-hidden bg-background"
    >
      {/* Starry backdrop */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.14 0.06 285) 0%, oklch(0.04 0.02 280) 75%)",
        }}
      />
      <svg className="absolute inset-0 h-full w-full opacity-80" viewBox="0 0 100 60" preserveAspectRatio="none">
        {Array.from({ length: 90 }).map((_, i) => {
          const r3 = (n: number) => Math.round(n * 1000) / 1000;
          const x = r3(Math.abs((Math.sin(i * 9301 + 49297) * 233280) % 1) * 100);
          const y = r3(Math.abs((Math.sin(i * 7919 + 12345) * 233280) % 1) * 60);
          const r = r3(0.08 + (i % 5) * 0.04);
          const o = r3(0.4 + (i % 4) * 0.15);
          return (
            <circle key={i} cx={x} cy={y} r={r} fill="white" opacity={o}>
              <animate
                attributeName="opacity"
                values={`${o};${o * 0.3};${o}`}
                dur={`${2.5 + (i % 5)}s`}
                repeatCount="indefinite"
              />
            </circle>
          );
        })}
      </svg>

      {/* 3 slow labeled orbs sweeping left -> right */}
      <div className="absolute inset-0">
        {ORBS.map((orb, i) => (
          <motion.div
            key={orb.label}
            initial={{ x: "-40vw", opacity: 0 }}
            animate={{ x: "110vw", opacity: [0, 1, 1, 1, 0] }}
            transition={{
              duration: 4.2,
              delay: i * 0.45,
              ease: [0.4, 0, 0.6, 1],
              times: [0, 0.15, 0.5, 0.85, 1],
            }}
            className="absolute"
            style={{ top: orb.top }}
          >
            <div className="relative">
              <div
                className="h-28 w-28 rounded-full sm:h-36 sm:w-36 md:h-44 md:w-44"
                style={{
                  background: `radial-gradient(circle at 30% 28%, oklch(0.55 0.16 ${orb.hue}) 0%, oklch(0.18 0.07 ${orb.hue}) 50%, oklch(0.05 0.02 ${orb.hue}) 85%)`,
                  boxShadow: `inset -12px -16px 36px oklch(0.04 0.02 ${orb.hue}), 0 0 80px oklch(0.7 0.18 ${orb.hue} / 0.5)`,
                }}
              />
              {/* label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="font-display text-sm font-extrabold uppercase tracking-[0.25em] text-white sm:text-base md:text-lg"
                  style={{ textShadow: `0 0 18px oklch(0.85 0.18 ${orb.hue} / 0.9)` }}
                >
                  {orb.label}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Logo reveal — appears after the orbs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: [0, 0, 1, 1], scale: [0.9, 0.9, 1, 1] }}
        transition={{ duration: 5, times: [0, 0.6, 0.78, 1], ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-center px-6"
      >
        <img
          src={logo}
          alt="Dublin Hacx"
          className="h-auto w-[min(82vw,560px)] drop-shadow-[0_0_50px_oklch(0.78_0.17_305_/_0.65)]"
        />
      </motion.div>

      {/* Skip hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 0.5 : 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
      >
        Tap anywhere to skip
      </motion.p>
    </motion.div>
  );
}
