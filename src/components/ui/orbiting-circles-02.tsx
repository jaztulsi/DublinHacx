"use client";

import React, { useEffect, useRef, useState } from "react";
import ParticleSphereAnimation from "@/components/ui/orbiting-circles-02-utils/particalsphear";

type Sponsor = {
  src: string;
  alt: string;
  /** true → white plate (dark marks), false → dark plate (light marks). */
  plate?: boolean;
  /** Logo carries its own shape; render it without a plate. */
  bare?: boolean;
};

// Every current sponsor. More sponsors than orbit slots is deliberate: the
// slots cycle through this pool so the globe stays sparse but everyone shows.
const sponsors: Sponsor[] = [
  { src: "/context66-logo.png", alt: "Context66", plate: true },
  { src: "/cywarden-logo.webp", alt: "Cywarden", plate: true },
  { src: "/dream-college-path-logo.png", alt: "Dream College Path", plate: false },
  { src: "/crakd-logo.jpeg", alt: "Crakd", plate: true },
  { src: "/exea-labs-logo.webp", alt: "Exea Labs", plate: false },
  { src: "/codecrafters-badge.png", alt: "CodeCrafters", bare: true },
  { src: "/featherless-mark.svg", alt: "Featherless.ai", plate: true },
  { src: "/nordvpn-logo.png", alt: "NordVPN", plate: true },
  { src: "/nordpass-logo.png", alt: "NordPass", plate: true },
  { src: "/coveron-logo.png", alt: "Coveron", plate: true },
  { src: "/incogni-logo.png", alt: "Incogni", plate: true },
  { src: "/saily-logo.png", alt: "Saily", plate: true },
  { src: "/n8n-logo.png", alt: "n8n", plate: false },
  { src: "/elevenlabs-logo.svg", alt: "ElevenLabs", plate: true },
  { src: "/yri-science-logo.png", alt: "YRI Science", plate: true },
  { src: "/xyz-logo.png", alt: ".xyz", plate: true },
  { src: "/pcbway-logo.png", alt: "PCBWay", plate: true },
  { src: "/kariaa-logo.svg", alt: "Kariaa", plate: true },
];

// Each ring is a fraction of --gd (the outer-ring diameter), itself
// viewport-relative, so the globe scales fluidly instead of snapping at
// breakpoints. Angles are spread evenly to keep each ring balanced.
const rings = [
  { scale: 0.68, duration: 18, angles: [0, 120, 240] },
  { scale: 0.83, duration: 24, angles: [0, 90, 180, 270] },
  { scale: 1, duration: 30, angles: [45, 135, 225, 315] },
];

const SLOT_COUNT = rings.reduce((n, r) => n + r.angles.length, 0);
/** How often a single slot swaps to a new sponsor. */
const SWAP_MS = 3200;

/**
 * Holds which sponsor sits in each orbit slot, swapping one slot at a time so
 * the globe changes gradually rather than all at once. Incoming sponsors skip
 * anyone already on screen, so no logo is ever shown twice.
 */
function useRotatingSlots() {
  const [assigned, setAssigned] = useState(() =>
    Array.from({ length: SLOT_COUNT }, (_, i) => i % sponsors.length),
  );
  const nextUp = useRef(SLOT_COUNT % sponsors.length);
  const tick = useRef(0);

  useEffect(() => {
    if (sponsors.length <= SLOT_COUNT) return;
    const id = setInterval(() => {
      setAssigned((prev) => {
        const slot = tick.current % SLOT_COUNT;
        let candidate = nextUp.current;
        for (let i = 0; i < sponsors.length; i++) {
          const c = (nextUp.current + i) % sponsors.length;
          if (!prev.some((s, idx) => s === c && idx !== slot)) {
            candidate = c;
            break;
          }
        }
        nextUp.current = (candidate + 1) % sponsors.length;
        tick.current += 1;
        const next = [...prev];
        next[slot] = candidate;
        return next;
      });
    }, SWAP_MS);
    return () => clearInterval(id);
  }, []);

  return assigned;
}

export default function OrbitingCirclesGlobeDemo() {
  const assigned = useRotatingSlots();
  let slot = -1;

  return (
    <div
      className="relative w-full overflow-hidden flex justify-center"
      style={
        {
          // Outer-ring diameter: caps at 1040px, otherwise viewport width minus
          // a FIXED 9rem so the ~64px side logo plates always clear the edges —
          // the plates don't scale with %, so the margin can't be a % either.
          "--gd": "min(100vw - 9rem, 1040px)",
          // Semicircle sits at the bottom, so it's half a diameter tall + room
          // for the plates that poke above the top of the outer ring.
          height: "calc(var(--gd) / 2 + 3.5rem)",
        } as React.CSSProperties
      }
    >
      <style>{`
        @keyframes orbit-cw {
          from { transform: rotate(var(--start-angle)) }
          to   { transform: rotate(calc(var(--start-angle) + 360deg)) }
        }
        @keyframes orbit-ccw {
          from { transform: rotate(var(--start-angle)) }
          to   { transform: rotate(calc(var(--start-angle) - 360deg)) }
        }
        @keyframes counter-cw {
          from { transform: rotate(var(--counter-offset, 0deg)) }
          to   { transform: rotate(calc(var(--counter-offset, 0deg) - 360deg)) }
        }
        @keyframes counter-ccw {
          from { transform: rotate(var(--counter-offset, 0deg)) }
          to   { transform: rotate(calc(var(--counter-offset, 0deg) + 360deg)) }
        }
        @keyframes globe-swap {
          from { opacity: 0; transform: scale(0.6) }
          to   { opacity: 1; transform: scale(1) }
        }
      `}</style>

      {/* Center particle globe */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 aspect-square pointer-events-none z-10"
        style={{ width: "calc(var(--gd) * 0.547)" }}
      >
        <ParticleSphereAnimation />
      </div>

      {/* Orbiting rings */}
      {rings.map((ring, index) => {
        const isCW = index % 2 === 0;
        const orbitAnim = isCW ? "orbit-cw" : "orbit-ccw";
        const counterAnim = isCW ? "counter-cw" : "counter-ccw";

        return (
          <div
            key={index}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full border border-primary/40"
            style={{
              width: `calc(var(--gd) * ${ring.scale})`,
              height: `calc(var(--gd) * ${ring.scale})`,
            }}
          >
            {ring.angles.map((angle) => {
              slot += 1;
              const sponsor = sponsors[assigned[slot]];
              return (
                <div
                  key={angle}
                  className="absolute top-0 left-1/2 h-1/2 -ml-8 origin-bottom flex flex-col justify-start items-center"
                  style={
                    {
                      "--start-angle": `${angle}deg`,
                      animation: `${orbitAnim} ${ring.duration}s linear infinite`,
                    } as React.CSSProperties
                  }
                >
                  <div
                    className={
                      sponsor.bare
                        ? "-mt-8 relative z-10"
                        : `p-3 sm:p-4 border border-border rounded-full -mt-8 relative z-10 ${sponsor.plate ? "bg-white/95" : "bg-background"}`
                    }
                    style={
                      {
                        "--counter-offset": `${-angle}deg`,
                        animation: `${counterAnim} ${ring.duration}s linear infinite`,
                      } as React.CSSProperties
                    }
                  >
                    {/* Keyed on src so a swap remounts the image and replays the fade. */}
                    <img
                      key={sponsor.src}
                      src={sponsor.src}
                      alt={sponsor.alt}
                      title={sponsor.alt}
                      width={32}
                      height={32}
                      className={`object-contain [animation:globe-swap_600ms_ease-out] ${
                        sponsor.bare ? "w-12 h-12 md:w-16 md:h-16" : "w-6 h-6 md:w-8 md:h-8"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
