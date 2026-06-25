export type ScheduleTag = "Food" | "Event" | "Fun";

export interface ScheduleItem {
  /** Offset in minutes from the event start (0 = doors open). */
  offsetMin: number;
  time: string;
  title: string;
  description: string;
  tag: ScheduleTag;
}

/**
 * The event date is final: Saturday, October 10, 2026 at Emerald High School.
 * EVENT_DATE_TBD is false, so the live countdown is shown.
 */
export const EVENT_DATE_TBD = false;

/**
 * Event start anchor: 10:00 AM Pacific (PDT, UTC-7) on October 10, 2026. Used by
 * the relative schedule math and the countdown logic.
 */
export const EVENT_START = new Date("2026-10-10T10:00:00-07:00");

export const schedule: ScheduleItem[] = [
  { offsetMin: 0,   time: "10:00 AM", title: "Check-In",                    description: "Arrive, sign in, grab your badge & swag bag.",            tag: "Event" },
  { offsetMin: 30,  time: "10:30 AM", title: "Opening Ceremony",           description: "Sponsors intro, judging criteria, and the green light.", tag: "Event" },
  { offsetMin: 60,  time: "11:00 AM", title: "Hacking Begins",             description: "12 hours start now. Build, ship, repeat.",               tag: "Event" },
  { offsetMin: 180, time: "1:00 PM",  title: "Lunch",                      description: "Hot meal to keep you fueled for the afternoon.",         tag: "Food" },
  { offsetMin: 300, time: "3:00 PM",  title: "Workshops",                  description: "Beginner-friendly sessions on web, AI, and hardware.",   tag: "Fun" },
  { offsetMin: 480, time: "6:00 PM",  title: "Dinner",                     description: "Refuel for the final stretch of building.",              tag: "Food" },
  { offsetMin: 600, time: "8:00 PM",  title: "Hacking Ends / Submissions Due", description: "Final commits, demo prep, and devpost uploads.",     tag: "Event" },
  { offsetMin: 630, time: "8:30 PM",  title: "Judging",                    description: "Show your project to industry mentors.",                 tag: "Event" },
  { offsetMin: 690, time: "9:30 PM",  title: "Awards Ceremony",            description: "Winners announced. Prizes handed out. Confetti.",        tag: "Event" },
  { offsetMin: 720, time: "10:00 PM", title: "Event Ends",                 description: "Pack up, say goodbyes, and head home.",                  tag: "Event" },
];

export const EVENT_END_MIN = 720; // 10:00 PM — end of the 12-hour day

export interface LiveStatus {
  /** "before" | "live" | "ended" */
  phase: "before" | "live" | "ended";
  /** Index of current event (during live phase) or next event (during before phase). */
  currentIdx: number;
  /** Milliseconds until event start (during before phase). */
  msToStart: number;
  /** Now */
  now: Date;
}

export function computeLiveStatus(now: Date = new Date()): LiveStatus {
  const startMs = EVENT_START.getTime();
  const elapsedMin = (now.getTime() - startMs) / 60000;
  if (elapsedMin < 0) {
    return {
      phase: "before",
      currentIdx: 0,
      msToStart: startMs - now.getTime(),
      now,
    };
  }
  if (elapsedMin > EVENT_END_MIN) {
    return { phase: "ended", currentIdx: schedule.length - 1, msToStart: 0, now };
  }
  // Find the latest event whose offsetMin <= elapsedMin
  let idx = 0;
  for (let i = 0; i < schedule.length; i++) {
    if (schedule[i].offsetMin <= elapsedMin) idx = i;
    else break;
  }
  return { phase: "live", currentIdx: idx, msToStart: 0, now };
}

export function formatCountdown(ms: number): { d: number; h: number; m: number; s: number } {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(totalSec / 86400),
    h: Math.floor((totalSec % 86400) / 3600),
    m: Math.floor((totalSec % 3600) / 60),
    s: totalSec % 60,
  };
}
