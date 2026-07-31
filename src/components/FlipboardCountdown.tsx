import { Fragment, useEffect, useRef, useState } from "react";
import { EVENT_START } from "@/lib/schedule";

const FLIP_HALF_MS = 340;

const pad2 = (n: number) => n.toString().padStart(2, "0");

function getRemaining() {
  const diff = Math.max(0, EVENT_START.getTime() - Date.now());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

/**
 * Single split-flap card holding the whole 2-digit value (e.g. "59"). The
 * static top half snaps to the new value at the start of a flip (hidden behind
 * the rotating flap), the rotating flap folds the old value down over the top
 * half, and once it is edge-on (invisible) the static bottom half snaps too.
 */
function FlipCard({ value }: { value: string }) {
  const [display, setDisplay] = useState(value);
  const [flapValue, setFlapValue] = useState(value);
  const [flipping, setFlipping] = useState(false);
  const displayRef = useRef(value);
  displayRef.current = display;
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (value === displayRef.current) return;
    const prev = displayRef.current;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setDisplay(value);
      return;
    }

    setFlapValue(prev);
    setDisplay(value);
    setFlipping(true);

    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [
      // At this instant the flap is edge-on, so the static bottom half can
      // snap to the new value (and the flap can be unmounted) seamlessly.
      window.setTimeout(() => setFlipping(false), FLIP_HALF_MS),
    ];
    return () => timers.current.forEach((t) => window.clearTimeout(t));
  }, [value]);

  const bottomValue = flipping ? flapValue : display;

  return (
    <div className="flip-card" aria-label={value}>
      <div className="flip-card-face flip-card-top">
        <span className="flip-card-digit">{display}</span>
      </div>
      <div className="flip-card-face flip-card-bottom">
        <span className="flip-card-digit">{bottomValue}</span>
      </div>
      {flipping && (
        <div className="flip-flap">
          <span className="flip-card-digit">{flapValue}</span>
        </div>
      )}
      <span className="flip-seam" aria-hidden />
    </div>
  );
}

function FlipUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <FlipCard value={pad2(value)} />
      <span className="flip-label">{label}</span>
    </div>
  );
}

export function FlipboardCountdown() {
  // Start null so SSR HTML and the first client render match, avoiding a
  // hydration mismatch (the live value only differs after mount).
  const [time, setTime] = useState<ReturnType<typeof getRemaining> | null>(null);

  useEffect(() => {
    setTime(getRemaining());
    const id = window.setInterval(() => setTime(getRemaining()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const units = [
    { value: time?.days ?? 0, label: "Days" },
    { value: time?.hours ?? 0, label: "Hours" },
    { value: time?.minutes ?? 0, label: "Minutes" },
    { value: time?.seconds ?? 0, label: "Seconds" },
  ];

  return (
    <div className="flip-clock mx-auto mb-8 w-full max-w-2xl">
      <div className="rounded-3xl border border-primary/40 bg-card/40 p-4 backdrop-blur-md purple-glow sm:p-6">
        <div className="flip-row flex items-center justify-center gap-0.5 sm:gap-2">
          {units.map((u, i) => (
            <Fragment key={u.label}>
              {i > 0 && (
                <span className="flip-colon" aria-hidden>
                  :
                </span>
              )}
              <FlipUnit value={u.value} label={u.label} />
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
