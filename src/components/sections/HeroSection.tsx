import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import heroImg from "@/assets/hero-night.jpg";
import logo from "@/assets/dublin-hacks-logo.png";

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

export function HeroSection({ onApply, onLearnMore }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Subtle parallax on the night-sky image
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
        {/* readability overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/40 to-background" />
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
          <img
            src={logo}
            alt="Dublin Hacks"
            className="mx-auto h-14 w-auto sm:h-16 md:h-20 drop-shadow-[0_0_30px_oklch(0.78_0.17_305_/_0.5)]"
          />
        </motion.div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary backdrop-blur-sm"
        >
          <span className="inline-block h-1.5 w-1.5 animate-pulse-glow rounded-full bg-primary" />
          Dublin, CA · September 2026 · Overnight
        </motion.p>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="font-display text-6xl font-extrabold leading-[0.9] tracking-tight text-foreground sm:text-7xl md:text-[8rem] lg:text-[10rem]"
        >
          DUBLIN
          <br />
          <span className="text-gradient-primary text-glow">HACKS</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="mx-auto mt-8 max-w-2xl text-base text-muted-foreground md:text-lg"
        >
          Dublin, CA's first overnight high school hackathon. 24 hours to build,
          break, ship, and meet your future co-founders.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={4}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <button
            onClick={onApply}
            className="group relative overflow-hidden rounded-full bg-primary px-8 py-4 font-semibold text-primary-foreground purple-glow transition-transform hover:scale-105"
          >
            <span className="relative z-10">Apply to Hack →</span>
          </button>
          <button
            onClick={onLearnMore}
            className="rounded-full border border-border bg-background/40 px-8 py-4 font-semibold text-foreground backdrop-blur-md transition-colors hover:bg-secondary/50"
          >
            Learn More
          </button>
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
