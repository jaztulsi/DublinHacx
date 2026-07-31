"use client";

import * as React from "react";

import { useMeasure } from "@uidotdev/usehooks";
import { type VariantProps, cva } from "class-variance-authority";
import {
  cubicBezier,
  type HTMLMotionProps,
  type MotionValue,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import { cn } from "@/lib/utils";

// Horizontal scroll-pinned tier ladder. Ported from the youcefbnm "Process
// Timeline" (21st.dev) and reskinned to our purple/gold tokens. Cards slide in
// from the right and stack on the left as you scroll, newest on top — so the
// ladder climaxes on the top tier. Second scroll-interpolated interaction on
// the page (Schedule is the first); motion is intentionally eased to match.

// Matches ScheduleSection's smooth-snap feel loosely (easeOutQuint-ish).
const EASE = cubicBezier(0.22, 1, 0.36, 1);
const STACK_OFFSET = 84; // px each stacked card peeks past the previous one

const tierCardVariants = cva(
  "flex overflow-hidden rounded-3xl border backdrop-blur-md",
  {
    variants: {
      variant: {
        default: "border-border bg-card/40",
        silver: "border-gold/25 bg-card/40",
        featured:
          "border-primary/60 bg-gradient-to-br from-primary/15 via-card/50 to-transparent purple-glow",
        gold: "border-gold/50 bg-gradient-to-br from-gold/15 via-card/40 to-transparent gold-glow",
      },
      size: {
        sm: "min-w-[25%] max-w-[25%]",
        md: "min-w-[52%] max-w-[52%]",
        lg: "min-w-[75%] max-w-[75%]",
        xl: "min-w-full max-w-full",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

interface ContainerScrollContextValue {
  scrollYProgress: MotionValue<number>;
}
const ContainerScrollContext = React.createContext<
  ContainerScrollContextValue | undefined
>(undefined);
function useContainerScrollContext() {
  const ctx = React.useContext(ContainerScrollContext);
  if (!ctx)
    throw new Error("useContainerScrollContext must be used within ContainerScroll");
  return ctx;
}

export function ContainerScroll({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  // Map progress 0→1 across the pinned region (sticky child fills the viewport
  // from when the container's top reaches the top until its bottom does), so
  // the four cards reveal evenly while pinned.
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });
  // Smooth the raw scroll progress so the slide reads like Schedule's snap,
  // not a hard 1:1 scrub.
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress: smooth }}>
      <div ref={scrollRef} className={cn("relative", className)} {...props}>
        {children}
      </div>
    </ContainerScrollContext.Provider>
  );
}

export const ContainerSticky = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("sticky left-0 top-0 w-full overflow-hidden", className)}
    {...props}
  />
));
ContainerSticky.displayName = "ContainerSticky";

interface TierCardProps
  extends HTMLMotionProps<"div">,
    VariantProps<typeof tierCardVariants> {
  itemsLength: number;
  index: number;
}

export function TierCard({
  className,
  style,
  variant,
  size,
  itemsLength,
  index,
  ...props
}: TierCardProps) {
  const { scrollYProgress } = useContainerScrollContext();
  const start = index / itemsLength;
  const end = start + 1 / itemsLength;
  const [ref, { width }] = useMeasure();

  // SSR-safe: window is undefined during server render; fall back to a sane
  // desktop width. Cards start fully off-screen right and slide to a left
  // stack offset by index.
  const innerWidth =
    typeof window !== "undefined" ? window.innerWidth : 1440;

  const x = useTransform(
    scrollYProgress,
    [start, end],
    [innerWidth, -((width ?? 0) * index) + STACK_OFFSET * index],
    { ease: EASE },
  );

  return (
    <motion.div
      ref={ref}
      style={{ x: index > 0 ? x : 0, ...style }}
      className={cn(tierCardVariants({ variant, size }), className)}
      {...props}
    />
  );
}
