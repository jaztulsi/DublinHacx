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
 * Event start: Saturday, September 12, 2026 at 9:00 AM Pacific.
 * (Date is approximate — adjust when finalized.)
 */
export const EVENT_START = new Date("2026-09-12T09:00:00-07:00");

export const schedule: ScheduleItem[] = [
  { offsetMin: 0,    time: "9:00 AM",  title: "Check-In",            description: "Arrive, sign in, grab your badge & swag bag.",                tag: "Event" },
  { offsetMin: 60,   time: "10:00 AM", title: "Waitlist Check-In",   description: "Last call for waitlisted hackers if spots open up.",          tag: "Event" },
  { offsetMin: 120,  time: "11:00 AM", title: "Opening Ceremony",    description: "Sponsors intro, judging criteria, and the green light.",     tag: "Event" },
  { offsetMin: 180,  time: "12:00 PM", title: "Hacking Begins",      description: "24 hours start now. Build, ship, repeat.",                   tag: "Event" },
  { offsetMin: 300,  time: "2:00 PM",  title: "Workshops",           description: "Beginner-friendly sessions on web, AI, and hardware.",       tag: "Fun" },
  { offsetMin: 540,  time: "6:00 PM",  title: "Dinner",              description: "Hot meal to keep you fueled through the long haul.",         tag: "Food" },
  { offsetMin: 780,  time: "10:00 PM", title: "Mini-Events",         description: "Trivia, smash tournaments, and surprise activities.",        tag: "Fun" },
  { offsetMin: 1080, time: "3:00 AM",  title: "Late Night Snacks",   description: "Pizza, energy drinks, and cosmic vibes.",                    tag: "Food" },
  { offsetMin: 1500, time: "10:00 AM", title: "Day 2 Submissions",   description: "Final commits, demo prep, and devpost uploads.",             tag: "Event" },
  { offsetMin: 1620, time: "12:00 PM", title: "Judging",             description: "Show your project to industry mentors.",                     tag: "Event" },
  { offsetMin: 1800, time: "3:00 PM",  title: "Awards Ceremony",     description: "Winners announced. Prizes handed out. Confetti.",            tag: "Event" },
];

export const EVENT_END_MIN = 1800 + 60; // ~4:00 PM Sunday

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
