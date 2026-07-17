// CountdownChip: shows time until fires_at, updates every 30s.
// `paused` freezes the display and shows a "Paused" pill (used when a
// support ticket pauses the customer-delay countdown). When `paused` and no
// `firesAt` is available, `remainingSeconds` is rendered as the frozen
// remaining time so paused rows stay informative.
import { useEffect, useState } from "react";
import { Clock, PauseCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  firesAt: string | Date | null | undefined;
  label?: string;
  className?: string;
  paused?: boolean;
  pausedLabel?: string;
  /** Seconds left when paused; used only when firesAt is missing. */
  remainingSeconds?: number | null;
}

function prettyFromMs(ms: number): { pretty: string; overdue: boolean } {
  const overdue = ms <= 0;
  const abs = Math.abs(ms);
  const mins = Math.round(abs / 60_000);
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  const days = Math.floor(hrs / 24);
  const remHrs = hrs % 24;
  const pretty =
    days > 0 ? `${days}d ${remHrs}h` :
    hrs > 0 ? `${hrs}h ${remMins}m` :
    `${mins}m`;
  return { pretty, overdue };
}

export function CountdownChip({ firesAt, label, className, paused, pausedLabel, remainingSeconds }: Props) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, [paused]);

  const target = firesAt ? new Date(firesAt).getTime() : NaN;
  const hasTarget = !Number.isNaN(target);

  if (paused) {
    let pretty = "";
    let overdue = false;
    if (hasTarget) {
      const p = prettyFromMs(target - now);
      pretty = p.pretty; overdue = p.overdue;
    } else if (typeof remainingSeconds === "number" && remainingSeconds > 0) {
      const p = prettyFromMs(remainingSeconds * 1000);
      pretty = p.pretty; overdue = false;
    }
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
          "bg-violet-50 text-violet-700 ring-violet-200 animate-pulse",
          className,
        )}
      >
        <PauseCircle className="h-3 w-3" />
        {pausedLabel ?? "Paused — ticket open"}
        {pretty ? (
          <>
            <span className="text-violet-400">·</span>
            <span className="tabular-nums opacity-70">
              {overdue ? `${pretty} overdue` : `${pretty} left`}
            </span>
          </>
        ) : null}
      </span>
    );
  }

  if (!hasTarget) return null;
  const { pretty, overdue } = prettyFromMs(target - now);
  const mins = Math.round(Math.abs(target - now) / 60_000);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        overdue
          ? "bg-red-50 text-red-700 ring-red-200"
          : mins < 60
          ? "bg-amber-50 text-amber-700 ring-amber-200"
          : "bg-slate-50 text-slate-700 ring-slate-200",
        className,
      )}
    >
      <Clock className="h-3 w-3" />
      {label ? <span className="text-slate-500">{label}:</span> : null}
      {overdue ? `${pretty} overdue` : `in ${pretty}`}
    </span>
  );
}
