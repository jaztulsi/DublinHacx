import { Fragment, useEffect, useRef, useState } from "react";
import { EVENT_START } from "@/lib/schedule";

const FLIP_HALF_MS = 340;
const FLIP_FULL_MS = 680;

const pad2 = (n: number) => n.toString().padStart(2, "0");

const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

function getRemaining() {
  const diff = Math.max(0, EVENT_START.getTime() - Date.now());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

/**
 * Single split-flap digit. The static top half snaps to the new digit at the
 * start of a flip (hidden behind the rotating flap), the rotating flap folds
 * the old digit down over the top half, and once it is edge-on (invisible)
 * the static bottom half snaps to the new digit too.
 */
function FlipCard({ digit }: { digit: number }) {
  const [display, setDisplay] = useState(digit);
  const [flapValue, setFlapValue] = useState(digit);
  const [flipping, setFlipping] = useState(false);
  const displayRef = useRef(digit);
  displayRef.current = display;
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (digit === displayRef.current) return;
    const prev = displayRef.current;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setDisplay(digit);
      return;
    }

    setFlapValue(prev);
    setDisplay(digit);
    setFlipping(true);

    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [
      // At this instant the flap is edge-on, so the static bottom half can
      // snap to the new digit (and the flap can be unmounted) seamlessly.
      window.setTimeout(() => setFlipping(false), FLIP_HALF_MS),
    ];
    return () => timers.current.forEach((t) => window.clearTimeout(t));
  }, [digit]);

  const bottomDigit = flipping ? flapValue : display;

  return (
    <div className="flip-card" aria-label={String(digit)}>
      <div className="flip-card-face flip-card-top">
        <span className="flip-card-digit">{display}</span>
      </div>
      <div className="flip-card-face flip-card-bottom">
        <span className="flip-card-digit">{bottomDigit}</span>
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
  const str = pad2(value);
  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-0.5 md:gap-1.5">
        {str.split("").map((ch, i) => (
          <FlipCard key={`${label}-${i}`} digit={parseInt(ch, 10)} />
        ))}
      </div>
      <span className="flip-label">{label}</span>
    </div>
  );
}

/** Sunday-first grid of the event's month; nulls pad the leading/trailing days. */
function buildMonthGrid(year: number, monthIndex: number): (number | null)[] {
  const leading = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: (number | null)[] = Array.from({ length: leading }, () => null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function CalendarCountdown() {
  // Start null so SSR HTML and the first client render match, avoiding a
  // hydration mismatch (the live value only differs after mount).
  const [time, setTime] = useState<ReturnType<typeof getRemaining> | null>(null);

  useEffect(() => {
    setTime(getRemaining());
    const id = window.setInterval(() => setTime(getRemaining()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const year = EVENT_START.getFullYear();
  const month = EVENT_START.getMonth();
  const day = EVENT_START.getDate();
  const monthName = EVENT_START.toLocaleString("en-US", { month: "long" });
  const cells = buildMonthGrid(year, month);

  const units = [
    { value: time?.days ?? 0, label: "Days" },
    { value: time?.hours ?? 0, label: "Hours" },
    { value: time?.minutes ?? 0, label: "Minutes" },
    { value: time?.seconds ?? 0, label: "Seconds" },
  ];

  return (
    <div className="flip-clock mx-auto mb-8 w-full max-w-2xl">
      <div className="rounded-3xl border border-primary/40 bg-card/40 p-4 backdrop-blur-md purple-glow sm:p-6">
        {/* Calendar */}
        <div className="flex items-center justify-between px-1">
          <p className="font-pixel text-[11px] uppercase tracking-widest text-primary sm:text-xs">
            Save the date
          </p>
          <p className="font-display text-sm font-bold text-muted-foreground sm:text-base">
            {monthName} {year}
          </p>
        </div>

        <div className="mt-3 grid grid-cols-7 gap-y-1 text-center">
          {DAY_LETTERS.map((d, i) => (
            <span
              key={`h-${i}`}
              className="font-pixel text-[10px] uppercase text-muted-foreground/70"
            >
              {d}
            </span>
          ))}
          {cells.map((c, i) =>
            c === null ? (
              <span key={`e-${i}`} />
            ) : (
              <span
                key={`d-${c}`}
                className={`mx-auto flex h-6 w-6 items-center justify-center rounded-full text-xs sm:h-7 sm:w-7 sm:text-sm ${
                  c === day
                    ? "bg-primary font-bold text-primary-foreground purple-glow"
                    : "text-muted-foreground"
                }`}
              >
                {c}
              </span>
            ),
          )}
        </div>

        <div className="my-4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        {/* Flipboard countdown */}
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
