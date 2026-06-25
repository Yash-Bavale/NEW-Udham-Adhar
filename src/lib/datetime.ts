// All admin timestamps render in IST (Asia/Kolkata).
// Tiny, no-deps formatter. Use this everywhere instead of bare toLocaleString.

const IST = "Asia/Kolkata" as const;

export function formatIST(
  value: string | number | Date | null | undefined,
  opts: { dateOnly?: boolean; timeOnly?: boolean; withYear?: boolean } = {},
): string {
  if (value === null || value === undefined || value === "") return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";

  if (opts.timeOnly) {
    return d.toLocaleTimeString("en-IN", {
      timeZone: IST, hour: "2-digit", minute: "2-digit", hour12: true,
    });
  }
  if (opts.dateOnly) {
    return d.toLocaleDateString("en-IN", {
      timeZone: IST, day: "2-digit", month: "short", year: opts.withYear === false ? undefined : "numeric",
    });
  }
  return d.toLocaleString("en-IN", {
    timeZone: IST,
    day: "2-digit", month: "short", year: opts.withYear === false ? undefined : "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

export function relativeIST(value: string | number | Date | null | undefined): string {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const diff = Date.now() - d.getTime();
  const sec = Math.round(diff / 1000);
  if (sec < 60) return "just now";
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d ago`;
  return formatIST(d, { dateOnly: true });
}
