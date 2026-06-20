import { motion } from "framer-motion";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { schedule } from "@/lib/schedule";

/**
 * Schedule layout:
 *  - Title pinned at the top of the section.
 *  - Left column: sticky dark "time orb". Its time correlates to scroll
 *    position inside the events list, ticking minute-by-minute. When you
 *    stop scrolling it shows whichever event timestamp is closest.
 *  - Right column: internal scroll container — only events scroll.
 */
export function ScheduleSection() {
  return (
    <section id="schedule" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center"
        >
          <h2 className="font-display text-4xl font-extrabold text-center md:text-5xl">
            Here's how 24 hours looks.
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            September 2026 (date TBD) · Dublin, CA
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-xs uppercase tracking-widest text-primary">
            Schedule
          </p>
          <h2 className="font-display text-4xl font-extrabold md:text-6xl">
            24 hours of <span className="text-gradient-primary">building</span>.
          </h2>
        </motion.div>

        <ScheduleTrack />
      </div>
    </section>
  );
}

function formatMinutes(totalMin: number) {
  const m = ((Math.round(totalMin) % (24 * 60)) + 24 * 60) % (24 * 60);
  let h = Math.floor(m / 60);
  const min = m % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${min.toString().padStart(2, "0")} ${ampm}`;
}

function ScheduleTrack() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [displayMinutes, setDisplayMinutes] = useState<number>(
    schedule[0].offsetMin,
  );
  const [isIdle, setIsIdle] = useState(true);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const snapToIndex = (index: number, behavior: ScrollBehavior = "smooth") => {
    const scroller = scrollerRef.current;
    const item = itemRefs.current[index];
    if (!scroller || !item) return;
    const anchor = scroller.clientHeight * 0.25;
    scroller.scrollTo({ top: Math.max(0, item.offsetTop - anchor), behavior });
    setActiveIdx(index);
    setDisplayMinutes(schedule[index].offsetMin);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const nextByKey: Record<string, number> = {
      ArrowDown: Math.min(schedule.length - 1, activeIdx + 1),
      ArrowRight: Math.min(schedule.length - 1, activeIdx + 1),
      ArrowUp: Math.max(0, activeIdx - 1),
      ArrowLeft: Math.max(0, activeIdx - 1),
      Home: 0,
      End: schedule.length - 1,
    };
    if (!(event.key in nextByKey)) return;
    event.preventDefault();
    setIsIdle(true);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    snapToIndex(nextByKey[event.key], "auto");
  };

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const update = () => {
      // Anchor line = 25% from top of scroller (a bit above center)
      const rect = scroller.getBoundingClientRect();
      const anchorY = rect.top + rect.height * 0.25;

      // Find two events bracketing the anchor and interpolate their offsetMin
      let prevIdx = 0;
      let nextIdx = schedule.length - 1;
      let bestDist = Infinity;
      for (let i = 0; i < itemRefs.current.length; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const top = r.top;
        if (top <= anchorY) prevIdx = i;
        if (top >= anchorY) {
          nextIdx = i;
          break;
        }
        const d = Math.abs(top + r.height / 2 - anchorY);
        if (d < bestDist) {
          bestDist = d;
          // closest tracked separately for active highlight
        }
      }
      if (nextIdx <= prevIdx) nextIdx = Math.min(prevIdx + 1, schedule.length - 1);

      const prevEl = itemRefs.current[prevIdx];
      const nextEl = itemRefs.current[nextIdx];
      if (!prevEl || !nextEl) return;
      const prevTop = prevEl.getBoundingClientRect().top;
      const nextTop = nextEl.getBoundingClientRect().top;
      const span = nextTop - prevTop;
      const t = span > 0 ? Math.min(1, Math.max(0, (anchorY - prevTop) / span)) : 0;

      const prevMin = schedule[prevIdx].offsetMin;
      const nextMin = schedule[nextIdx].offsetMin;
      const interpolated = prevMin + (nextMin - prevMin) * t;

      // Active = closer of prev/next
      const closerIdx = t < 0.5 ? prevIdx : nextIdx;
      setActiveIdx(closerIdx);
      setDisplayMinutes(interpolated);

      // Mark scrolling, then snap to closer event when idle
      setIsIdle(false);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        setIsIdle(true);
        setDisplayMinutes(schedule[closerIdx].offsetMin);
        snapToIndex(closerIdx);
      }, 220);
    };

    update();
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      scroller.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  // Convert offsetMin (minutes since event start at 9:00 AM) → time-of-day minutes
  const startOfDayMin = 9 * 60;
  const timeLabel = formatMinutes(startOfDayMin + displayMinutes);
  const hour24 =
    (((startOfDayMin + Math.round(displayMinutes)) % (24 * 60)) + 24 * 60) %
    (24 * 60);
  const hour = Math.floor(hour24 / 60);
  const isNight = hour >= 20 || hour < 6;
  const activeItem = schedule[activeIdx];

  return (
    <div className="relative grid gap-10 md:grid-cols-[280px_1fr] md:gap-16">
      <div>
        <div className="md:sticky md:top-28 flex flex-col items-center md:items-start">
          <p className="mb-4 text-sm font-display font-bold uppercase tracking-widest text-foreground/80">
            {isNight ? "Night" : "Day"} {activeIdx >= 8 ? "2" : "1"}
          </p>
          <ScheduleOrb time={timeLabel} isNight={isNight} pulsing={!isIdle} />
          <p className="sr-only" aria-live="polite" aria-atomic="true">
            Active schedule time: {activeItem.time}, {activeItem.title}.
          </p>
        </div>
      </div>

      <div
        ref={scrollerRef}
        tabIndex={0}
        role="listbox"
        aria-label="Schedule carousel. Use arrow keys to move between events."
        aria-activedescendant={`schedule-event-${activeIdx}`}
        onKeyDown={onKeyDown}
        className="relative h-[70vh] max-h-[640px] overflow-y-auto pr-3 outline-none focus-visible:ring-2 focus-visible:ring-primary/60 md:pr-4"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <ol
          role="presentation"
          className="relative space-y-10 border-l border-border/60 pl-8"
          style={{ paddingTop: "18vh", paddingBottom: "70vh" }}
        >
          {schedule.map((item, i) => (
            <li
              id={`schedule-event-${i}`}
              key={`${item.time}-${item.title}`}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              role="option"
              aria-selected={i === activeIdx}
              aria-label={`${item.time}: ${item.title}. ${item.description}`}
              className={`relative transition-all duration-500 ${
                Math.abs(i - activeIdx) === 0
                  ? "scale-100 opacity-100"
                  : Math.abs(i - activeIdx) <= 2
                    ? "scale-[0.98] opacity-50"
                    : "scale-95 opacity-0"
              }`}
            >
              <span
                className={`absolute -left-[37px] top-2 h-3 w-3 rounded-full border-2 transition-all ${
                  i === activeIdx
                    ? "border-primary bg-primary purple-glow scale-125"
                    : "border-border bg-background"
                }`}
              />
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span
                  className={`font-display text-2xl font-bold tabular-nums md:text-3xl ${
                    i === activeIdx ? "text-primary" : "text-foreground/70"
                  }`}
                >
                  {item.time}
                </span>
                <span className="rounded-full border border-border/60 bg-background/40 px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur-sm">
                  {item.tag}
                </span>
              </div>
              <h3 className="mt-1 font-display text-xl font-bold md:text-2xl">
                {item.title}
              </h3>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

// Deterministic star positions (no Math.random) so SSR + client hydration match.
const ORB_STARS = Array.from({ length: 16 }).map((_, i) => ({
  cx: ((i * 37 + 11) % 100),
  cy: ((i * 53 + 7) % 100),
  r: 0.25 + ((i * 13) % 7) / 18,
  dur: 2 + (i % 4),
}));

function ScheduleOrb({
  time,
  isNight,
  pulsing,
}: {
  time: string;
  isNight: boolean;
  pulsing: boolean;
}) {
  return (
    <div className="relative h-44 w-44 sm:h-56 sm:w-56 md:h-64 md:w-64">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 28%, oklch(0.28 0.02 270) 0%, oklch(0.12 0.02 270) 55%, oklch(0.04 0.01 270) 90%)",
          boxShadow: isNight
            ? "inset -16px -22px 50px oklch(0.02 0 0), 0 0 80px oklch(0.65 0.18 280 / 0.45)"
            : "inset -16px -22px 50px oklch(0.02 0 0), 0 0 60px oklch(0.55 0.15 270 / 0.35)",
        }}
      />

      {!isNight && (
        <div
          aria-hidden
          className="absolute left-[18%] top-[14%] h-[28%] w-[36%] rounded-full opacity-30 blur-xl"
          style={{ background: "oklch(0.85 0.05 260)" }}
        />
      )}

      {isNight && (
        <>
          <div aria-hidden className="absolute inset-0 rounded-full overflow-hidden">
            <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="none">
              {ORB_STARS.map((s, i) => (
                <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="white" opacity={0.7}>
                  <animate
                    attributeName="opacity"
                    values="0.2;1;0.2"
                    dur={`${s.dur}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              ))}
            </svg>
          </div>
          <motion.div
            aria-hidden
            className="absolute right-[14%] top-[16%] h-[22%] w-[22%] rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.95 0.04 90) 0%, oklch(0.7 0.05 90 / 0.4) 60%, transparent 80%)",
            }}
            animate={{ y: [0, -4, 0], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      {/* Subtle ring pulse while user is actively scrolling */}
      {pulsing && (
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-full border border-primary/40"
          animate={{ scale: [1, 1.04, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <motion.span
          key={time}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="font-display text-3xl font-extrabold text-white sm:text-4xl md:text-5xl text-glow tabular-nums"
        >
          {time}
        </motion.span>
        <span className="mt-2 text-[11px] uppercase tracking-[0.2em] text-white/70">
          {isNight ? "Night Build" : "Live Build"}
        </span>
      </div>
    </div>
  );
}
