// Phase 3 — CountdownChip: shows time until fires_at, updates every 30s.
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  firesAt: string | Date | null | undefined;
  label?: string;
  className?: string;
}

export function CountdownChip({ firesAt, label, className }: Props) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);

  if (!firesAt) return null;
  const target = new Date(firesAt).getTime();
  if (Number.isNaN(target)) return null;

  const diff = target - now;
  const overdue = diff <= 0;
  const abs = Math.abs(diff);
  const mins = Math.round(abs / 60_000);
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  const days = Math.floor(hrs / 24);
  const remHrs = hrs % 24;

  const pretty =
    days > 0 ? `${days}d ${remHrs}h` :
    hrs > 0 ? `${hrs}h ${remMins}m` :
    `${mins}m`;

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
