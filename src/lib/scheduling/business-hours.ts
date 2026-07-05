// Business-hours math for internal schedulers.
// All functions are pure and time-zone aware (defaults to Asia/Kolkata).
// A "business second" only ticks Monday–Saturday, 10:00–18:00 IST by default;
// Super Admin can change the window from Settings.

export interface BusinessHoursConfig {
  timezone: string;          // IANA tz, e.g. 'Asia/Kolkata'
  openTime: string;          // 'HH:MM' 24h
  closeTime: string;         // 'HH:MM' 24h
  workingDays: number[];     // 0=Sun..6=Sat
  holidays: string[];        // ISO dates 'YYYY-MM-DD'
}

export const DEFAULT_BUSINESS_HOURS: BusinessHoursConfig = {
  timezone: "Asia/Kolkata",
  openTime: "10:00",
  closeTime: "18:00",
  workingDays: [1, 2, 3, 4, 5, 6],
  holidays: [],
};

// ------------ tz helpers ------------
// Get {y,m,d,dow,hh,mm,ss} for a Date in a given IANA tz without pulling
// in a full date library.
function tzParts(date: Date, tz: string) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour12: false,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    weekday: "short",
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(date).map((p) => [p.type, p.value]),
  );
  const dowMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    y: Number(parts.year),
    mo: Number(parts.month),
    d: Number(parts.day),
    dow: dowMap[parts.weekday as string] ?? 0,
    hh: Number(parts.hour),
    mm: Number(parts.minute),
    ss: Number(parts.second),
  };
}

function parseHM(s: string): { h: number; m: number } {
  const [h, m] = s.split(":").map(Number);
  return { h: h || 0, m: m || 0 };
}

// Given wall-clock y/m/d/h/m/s in `tz`, return the UTC Date that renders as
// that clock reading in tz. Works via a bounded iterative correction because
// JS has no built-in "make Date from wall clock + tz".
function fromTzClock(tz: string, y: number, mo: number, d: number, h: number, m: number, s = 0): Date {
  // Initial guess: treat as UTC.
  let guess = new Date(Date.UTC(y, mo - 1, d, h, m, s));
  for (let i = 0; i < 3; i++) {
    const p = tzParts(guess, tz);
    const diffMin =
      (y - p.y) * 525600 +
      (mo - p.mo) * 43800 +
      (d - p.d) * 1440 +
      (h - p.hh) * 60 +
      (m - p.mm);
    if (diffMin === 0) break;
    guess = new Date(guess.getTime() + diffMin * 60_000);
  }
  return guess;
}

function isoDate(y: number, mo: number, d: number): string {
  return `${y.toString().padStart(4, "0")}-${mo.toString().padStart(2, "0")}-${d.toString().padStart(2, "0")}`;
}

function isWorkingDay(cfg: BusinessHoursConfig, y: number, mo: number, d: number, dow: number): boolean {
  if (!cfg.workingDays.includes(dow)) return false;
  const iso = isoDate(y, mo, d);
  return !cfg.holidays.includes(iso);
}

// ------------ public API ------------

/** Is the wall-clock instant within business hours? */
export function isBusinessHour(date: Date, cfg: BusinessHoursConfig = DEFAULT_BUSINESS_HOURS): boolean {
  const p = tzParts(date, cfg.timezone);
  if (!isWorkingDay(cfg, p.y, p.mo, p.d, p.dow)) return false;
  const { h: oh, m: om } = parseHM(cfg.openTime);
  const { h: ch, m: cm } = parseHM(cfg.closeTime);
  const minutes = p.hh * 60 + p.mm;
  const openMin = oh * 60 + om;
  const closeMin = ch * 60 + cm;
  return minutes >= openMin && minutes < closeMin;
}

/** Next wall-clock instant that lies within business hours (returns `date` unchanged if already inside). */
export function nextBusinessInstant(date: Date, cfg: BusinessHoursConfig = DEFAULT_BUSINESS_HOURS): Date {
  if (isBusinessHour(date, cfg)) return date;
  const { h: oh, m: om } = parseHM(cfg.openTime);
  const { h: ch, m: cm } = parseHM(cfg.closeTime);
  const openMin = oh * 60 + om;
  const closeMin = ch * 60 + cm;

  let cur = new Date(date.getTime());
  for (let i = 0; i < 400; i++) {
    // safety cap ~1yr
    const p = tzParts(cur, cfg.timezone);
    const workingDay = isWorkingDay(cfg, p.y, p.mo, p.d, p.dow);
    const minutes = p.hh * 60 + p.mm;

    if (workingDay && minutes < openMin) {
      return fromTzClock(cfg.timezone, p.y, p.mo, p.d, oh, om, 0);
    }
    if (workingDay && minutes >= openMin && minutes < closeMin) {
      return cur;
    }
    // advance to next day 00:00 tz-local, then loop
    const nextDay = fromTzClock(cfg.timezone, p.y, p.mo, p.d, ch, cm, 0);
    cur = new Date(nextDay.getTime() + 60_000); // step past close, then loop reevaluates day
    // if we just crossed closing, jump straight to 00:00 next day for cleanliness
    cur = new Date(cur.getTime() + (24 * 3600 - (ch * 3600 + cm * 60) - 60) * 1000);
  }
  return cur;
}

/** Add N seconds that only tick during business hours; return the resulting wall-clock instant. */
export function addBusinessSeconds(
  from: Date,
  seconds: number,
  cfg: BusinessHoursConfig = DEFAULT_BUSINESS_HOURS,
): Date {
  if (seconds <= 0) return from;
  const { h: oh, m: om } = parseHM(cfg.openTime);
  const { h: ch, m: cm } = parseHM(cfg.closeTime);
  const openMin = oh * 60 + om;
  const closeMin = ch * 60 + cm;
  const dayCapacitySec = Math.max(0, (closeMin - openMin) * 60);
  if (dayCapacitySec === 0) return from; // misconfigured

  let cursor = nextBusinessInstant(from, cfg);
  let remaining = seconds;

  for (let i = 0; i < 400 && remaining > 0; i++) {
    const p = tzParts(cursor, cfg.timezone);
    const minutes = p.hh * 60 + p.mm;
    const secOfDay = minutes * 60 + p.ss;
    const closeSec = closeMin * 60;
    const secLeftToday = Math.max(0, closeSec - secOfDay);

    if (remaining <= secLeftToday) {
      return new Date(cursor.getTime() + remaining * 1000);
    }
    remaining -= secLeftToday;
    // jump to next business day open
    const closeInstant = fromTzClock(cfg.timezone, p.y, p.mo, p.d, ch, cm, 0);
    cursor = nextBusinessInstant(new Date(closeInstant.getTime() + 60_000), cfg);
  }
  return cursor;
}

/** Business-seconds that elapsed between `a` and `b` (`a <= b`). */
export function businessSecondsBetween(
  a: Date,
  b: Date,
  cfg: BusinessHoursConfig = DEFAULT_BUSINESS_HOURS,
): number {
  if (b.getTime() <= a.getTime()) return 0;
  const { h: oh, m: om } = parseHM(cfg.openTime);
  const { h: ch, m: cm } = parseHM(cfg.closeTime);
  const openMin = oh * 60 + om;
  const closeMin = ch * 60 + cm;

  let total = 0;
  let cursor = nextBusinessInstant(a, cfg);
  if (cursor.getTime() >= b.getTime()) return 0;

  for (let i = 0; i < 800; i++) {
    const p = tzParts(cursor, cfg.timezone);
    const closeInstant = fromTzClock(cfg.timezone, p.y, p.mo, p.d, ch, cm, 0);
    void openMin;
    const segmentEnd = new Date(Math.min(closeInstant.getTime(), b.getTime()));
    total += Math.max(0, Math.floor((segmentEnd.getTime() - cursor.getTime()) / 1000));
    if (segmentEnd.getTime() >= b.getTime()) return total;
    cursor = nextBusinessInstant(new Date(closeInstant.getTime() + 60_000), cfg);
    if (cursor.getTime() >= b.getTime()) return total;
  }
  return total;
}

/** Format helper for UI ("in 17h 32m business time"). */
export function formatBusinessDuration(seconds: number): string {
  if (seconds <= 0) return "due";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}
