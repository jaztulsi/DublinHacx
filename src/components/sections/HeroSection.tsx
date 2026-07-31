import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import heroImg from "@/assets/hero-night.jpg";
import logo from "@/assets/dublin-hacx-logo.svg";
import { EVENT_DATE_TBD } from "@/lib/schedule";

interface Props {
  onApply: () => void;
  onLearnMore: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: 0.1 + i * 0.1,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

function MagneticButton({
  children,
  onClick,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary";
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    setPos({ x: (e.clientX - cx) * 0.25, y: (e.clientY - cy) * 0.25 });
  };

  const styles =
    variant === "primary"
      ? "bg-primary text-primary-foreground purple-glow"
      : "border border-border bg-background/40 text-foreground backdrop-blur-md hover:bg-secondary/50";

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className={`group relative overflow-hidden rounded-full px-8 py-4 font-semibold transition-shadow ${styles}`}
    >
      {variant === "primary" && (
        <span
          aria-hidden
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

function GlitchText({ children }: { children: string }) {
  return (
    <span className="relative inline-block">
      <span
        aria-hidden
        className="absolute inset-0 text-gradient-primary"
        style={{ transform: "translate(2px, 0)", mixBlendMode: "screen", opacity: 0.6 }}
      >
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          transform: "translate(-2px, 0)",
          color: "var(--gold)",
          mixBlendMode: "screen",
          opacity: 0.5,
        }}
      >
        {children}
      </span>
      <span className="relative text-gradient-primary text-glow-soft">{children}</span>
    </span>
  );
}

// Countdown target — 10:00 AM PDT on October 3, 2026.
const EVENT_TS = new Date("2026-10-03T10:00:00-07:00").getTime();

function getRemaining() {
  const diff = Math.max(0, EVENT_TS - Date.now());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

function Countdown() {
  // Start null so the server-rendered HTML and the first client render match
  // (the live time only differs after mount), avoiding a hydration mismatch.
  const [time, setTime] = useState<ReturnType<typeof getRemaining> | null>(null);

  useEffect(() => {
    setTime(getRemaining());
    const id = setInterval(() => setTime(getRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  const blocks = [
    { value: time?.days ?? 0, label: "Days" },
    { value: time?.hours ?? 0, label: "Hours" },
    { value: time?.minutes ?? 0, label: "Minutes" },
    { value: time?.seconds ?? 0, label: "Seconds" },
  ];

  return (
    <div className="mb-8 flex flex-col items-center gap-4">
      <span className="font-sans text-4xl font-bold text-gold gold-glow sm:text-5xl md:text-6xl">
        October 3, 2026
      </span>
      <div className="flex items-center justify-center gap-3 font-mono sm:gap-5">
      {blocks.map((b, i) => (
        <div key={b.label} className="flex items-center gap-3 sm:gap-5">
          <div className="flex flex-col items-center">
            <span className="font-sans text-4xl font-bold tabular-nums text-gold gold-glow sm:text-5xl md:text-6xl">
              {b.value.toString().padStart(2, "0")}
            </span>
            <span className="mt-1 font-pixel text-xs uppercase tracking-widest text-muted-foreground sm:text-sm">
              {b.label}
            </span>
          </div>
          {i < blocks.length - 1 && (
            <span aria-hidden className="text-2xl text-border sm:text-3xl">
              ·
            </span>
          )}
        </div>
      ))}
      </div>
    </div>
  );
}

export function HeroSection({ onApply, onLearnMore }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yImg = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const scaleImg = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);
  const yStars = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-24"
    >
      {/* Parallax night background */}
      <motion.div
        style={{ y: yImg, scale: scaleImg }}
        className="absolute inset-0 -z-10"
      >
        <img
          src={heroImg}
          alt="Starry night with a wolf on a cliff under a full moon"
          width={1920}
          height={1080}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
      </motion.div>

      {/* Twinkling parallax stars layer */}
      <motion.svg
        aria-hidden
        style={{ y: yStars }}
        className="absolute inset-0 -z-10 h-full w-full opacity-70"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 50 }).map((_, i) => {
          const x = Math.abs((Math.sin(i * 9301 + 49297) * 233280) % 1) * 100;
          const y = Math.abs((Math.sin(i * 7919 + 12345) * 233280) % 1) * 100;
          const o = 0.3 + (i % 5) * 0.12;
          return (
            <circle key={i} cx={x} cy={y} r={0.12} fill="white" opacity={o}>
              <animate
                attributeName="opacity"
                values={`${o};${o * 0.3};${o}`}
                dur={`${3 + (i % 4)}s`}
                repeatCount="indefinite"
              />
            </circle>
          );
        })}
      </motion.svg>

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="mx-auto mb-6 w-fit"
        >
          <motion.img
            src={logo}
            alt="Dublin Hacx"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto h-16 w-auto sm:h-20 md:h-24 drop-shadow-[0_0_40px_oklch(0.78_0.17_305_/_0.65)]"
          />
        </motion.div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="mb-6 font-pixel text-base uppercase tracking-[0.25em] text-primary"
        >
          SAP Office, San Ramon · Oct 3, 2026 · 10am–10pm
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1.5}
        >
          {EVENT_DATE_TBD ? (
            <div className="mb-8 flex items-center justify-center font-mono">
              <span className="font-sans text-4xl font-bold text-gold gold-glow sm:text-5xl md:text-6xl">
                October 3, 2026
              </span>
            </div>
          ) : (
            <Countdown />
          )}
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="font-display text-6xl font-extrabold leading-[0.9] tracking-[-0.07em] text-foreground sm:text-7xl md:text-[8rem] lg:text-[10rem]"
        >
          DUBLIN
          <br />
          <GlitchText>HACX</GlitchText>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="mx-auto mt-8 max-w-2xl text-base text-muted-foreground md:text-lg"
        >
          Dublin's very first Dublin Hacx. 12 hours, 10am to 10pm.
          Walk in with an idea. Walk out with something real.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={4}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <MagneticButton onClick={onApply}>Apply to Hack →</MagneticButton>
          <MagneticButton onClick={onLearnMore} variant="secondary">What's the deal?</MagneticButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Scroll
        </span>
        <div className="relative h-10 w-px overflow-hidden bg-border">
          <motion.div
            animate={{ y: [-40, 40] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute h-5 w-full bg-primary purple-glow"
          />
        </div>
      </motion.div>
    </section>
  );
}
