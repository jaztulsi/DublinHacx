"use client";

import React from "react";
import ParticleSphereAnimation from "@/components/ui/orbiting-circles-02-utils/particalsphear";

// Every ring is sized as a fraction of --gd (the outer-ring diameter), which
// is itself viewport-relative — so the whole globe scales fluidly and always
// fits the frame at any screen size instead of snapping at breakpoints.
const orbits = [
  {
    scale: 0.68, // was md:w-180 (180/265)
    duration: 18,
    icons: [
      { src: "/context66-logo.png", alt: "Context66", angle: 0, plate: true },
      // Logo is white-on-transparent → needs the dark plate.
      { src: "/dream-college-path-logo.png", alt: "Dream College Path", angle: 72, plate: false },
      { src: "/codecrafters-badge.png", alt: "CodeCrafters", angle: 144, plate: false, bare: true },
      { src: "/featherless-mark.svg", alt: "Featherless.ai", angle: 216, plate: true },
      { src: "/saily-logo.png", alt: "Saily", angle: 288, plate: true },
    ],
  },
  {
    scale: 0.83, // was md:w-220 (220/265)
    duration: 24,
    icons: [
      { src: "/yri-science-logo.png", alt: "YRI Science", angle: 0, plate: true },
      { src: "/medo-logo.png", alt: "MeDo", angle: 72, plate: true },
      { src: "/nordvpn-logo.png", alt: "NordVPN", angle: 144, plate: true },
      // n8n wordmark is white → needs the dark plate (plate:false === bg-background).
      { src: "/n8n-logo.png", alt: "n8n", angle: 216, plate: false },
      { src: "/nordpass-logo.png", alt: "NordPass", angle: 288, plate: true },
    ],
  },
  {
    scale: 1, // outer ring == --gd
    duration: 30,
    icons: [
      { src: "/pcbway-logo.png", alt: "PCBWay", angle: 0, plate: true },
      { src: "/elevenlabs-logo.svg", alt: "ElevenLabs", angle: 72, plate: true },
      { src: "/xyz-logo.png", alt: ".xyz", angle: 144, plate: true },
      { src: "/coveron-logo.png", alt: "Coveron", angle: 216, plate: true },
      { src: "/incogni-logo.png", alt: "Incogni", angle: 288, plate: true },
    ],
  },
];

export default function OrbitingCirclesGlobeDemo() {
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
      `}</style>

      {/* Center particle globe */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 aspect-square pointer-events-none z-10"
        style={{ width: "calc(var(--gd) * 0.547)" }}
      >
        <ParticleSphereAnimation />
      </div>

      {/* Orbiting rings */}
      {orbits.map((orbit, index) => {
        const isCW = index % 2 === 0;
        const orbitAnim = isCW ? "orbit-cw" : "orbit-ccw";
        const counterAnim = isCW ? "counter-cw" : "counter-ccw";

        const allIcons = [
          ...orbit.icons,
          ...orbit.icons.map((ic) => ({
            ...ic,
            angle: ic.angle + 180,
            alt: `${ic.alt}-mirror`,
          })),
        ];

        return (
          <div
            key={index}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full border border-primary/40"
            style={{
              width: `calc(var(--gd) * ${orbit.scale})`,
              height: `calc(var(--gd) * ${orbit.scale})`,
            }}
          >
            {allIcons.map((iconData, iconIndex) => (
              <div
                key={iconIndex}
                className="absolute top-0 left-1/2 h-1/2 -ml-8 origin-bottom flex flex-col justify-start items-center"
                style={
                  {
                    "--start-angle": `${iconData.angle}deg`,
                    animation: `${orbitAnim} ${orbit.duration}s linear infinite`,
                  } as React.CSSProperties
                }
              >
                <div
                  className={
                    iconData.bare
                      ? "-mt-8 relative z-10"
                      : `p-3 sm:p-4 border border-border rounded-full -mt-8 relative z-10 ${iconData.plate ? "bg-white/95" : "bg-background"}`
                  }
                  style={
                    {
                      "--counter-offset": `${-iconData.angle}deg`,
                      animation: `${counterAnim} ${orbit.duration}s linear infinite`,
                    } as React.CSSProperties
                  }
                >
                  <img
                    src={iconData.src}
                    alt={iconData.alt}
                    title={iconData.alt.replace(/-mirror$/, "")}
                    width={32}
                    height={32}
                    className={
                      iconData.bare
                        ? "w-12 h-12 md:w-16 md:h-16 object-contain"
                        : "w-6 h-6 md:w-8 md:h-8 object-contain"
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
