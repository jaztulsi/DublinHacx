import { useEffect, useState } from "react";

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hover, setHover] = useState(false);
  const [enabled, setEnabled] = useState(false);

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
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return setHover(false);
      const tag = t.tagName?.toLowerCase();
      const isInteractive =
        tag === "a" ||
        tag === "button" ||
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        t.closest("a,button,[role='button'],label,input,textarea,select") !== null;
      setHover(isInteractive);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div
        aria-hidden
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
          width: hover ? 44 : 14,
          height: hover ? 44 : 14,
        }}
        className="pointer-events-none fixed left-0 top-0 z-[100] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 backdrop-blur-sm transition-[width,height] duration-200 ease-out"
      />
      <div
        aria-hidden
        style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
        className="pointer-events-none fixed left-0 top-0 z-[101] -mt-1 -ml-1 h-2 w-2 rounded-full bg-primary purple-glow"
      />
    </>
  );
}
