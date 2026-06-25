import { useEffect, useRef, useState } from "react";

const TRAIL = 12;

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);

  const headRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouse = useRef({ x: -100, y: -100 });
  const dots = useRef(
    Array.from({ length: TRAIL }, () => ({ x: -100, y: -100 })),
  );
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setEnabled(mq.matches);
    const onChange = () => setEnabled(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      const isInteractive =
        !!t &&
        (["a", "button", "input", "textarea", "select"].includes(
          t.tagName?.toLowerCase(),
        ) ||
          t.closest("a,button,[role='button'],label,input,textarea,select") !==
            null);
      setHover(isInteractive);
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    const loop = () => {
      // Each trail dot eases toward the point ahead of it, forming a
      // smooth comet tail that follows the cursor.
      let prevX = mouse.current.x;
      let prevY = mouse.current.y;
      for (let i = 0; i < TRAIL; i++) {
        const d = dots.current[i];
        d.x += (prevX - d.x) * 0.32;
        d.y += (prevY - d.y) * 0.32;
        prevX = d.x;
        prevY = d.y;
        const el = dotRefs.current[i];
        if (el) {
          el.style.transform = `translate3d(${d.x}px, ${d.y}px, 0) translate(-50%, -50%)`;
        }
      }
      if (headRef.current) {
        headRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0)`;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* Comet trail */}
      {Array.from({ length: TRAIL }).map((_, i) => {
        const t = 1 - i / TRAIL;
        const size = 1.5 + t * 5;
        return (
          <div
            key={i}
            aria-hidden
            ref={(el) => {
              dotRefs.current[i] = el;
            }}
            className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full bg-primary"
            style={{
              width: size,
              height: size,
              opacity: t * 0.4,
              boxShadow: "0 0 8px oklch(0.78 0.17 305 / 0.7)",
            }}
          />
        );
      })}

      {/* Arrow pointer head (SVG tip anchored at the real cursor point) */}
      <div
        ref={headRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[101]"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 18 22"
          fill="none"
          className="transition-transform duration-150 ease-out"
          style={{
            transform: `scale(${down ? 0.82 : hover ? 1.25 : 1})`,
            transformOrigin: "top left",
            filter: "drop-shadow(0 0 6px oklch(0.78 0.17 305 / 0.85))",
          }}
        >
          <path
            d="M1 1L1 16.5L5.2 12.6L8.4 19.8L11.2 18.5L8 11.5L13.5 11.5Z"
            fill="oklch(0.82 0.16 310)"
            stroke="oklch(0.98 0.01 300)"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  );
}
