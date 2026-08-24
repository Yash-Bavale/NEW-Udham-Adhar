import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { formatIST } from "@/lib/datetime";

export function DateRangePicker({
  from,
  to,
  onChange,
  className,
}: {
  from?: Date;
  to?: Date;
  onChange: (range: { from?: Date; to?: Date }) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [draftRange, setDraftRange] = useState<DateRange | undefined>(() => (from ? { from, to } : undefined));

  const displayFrom = draftRange?.from ?? from;
  const displayTo = draftRange?.to ?? to;

  const label =
    displayFrom && displayTo
      ? `${formatIST(displayFrom, { dateOnly: true })} – ${formatIST(displayTo, { dateOnly: true })}`
      : displayFrom
        ? `${formatIST(displayFrom, { dateOnly: true })} – Pick end`
        : "Pick a date range";

  return (
    <Popover
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (v) setDraftRange(from ? { from, to } : undefined);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("h-9 gap-2 font-semibold text-xs rounded-xl border border-slate-200 bg-white shadow-xs hover:bg-slate-50", className)}
        >
          <CalendarIcon className="size-4 opacity-70 text-slate-500" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 pointer-events-auto rounded-2xl shadow-2xl border border-slate-200" align="end">
        <Calendar
          mode="range"
          numberOfMonths={2}
          defaultMonth={from ?? new Date()}
          selected={draftRange}
          onSelect={(r) => {
            setDraftRange(r);
            if (r?.from && r?.to) {
              const toEnd = new Date(r.to.getFullYear(), r.to.getMonth(), r.to.getDate(), 23, 59, 59);
              onChange({ from: r.from, to: toEnd });
              setOpen(false);
            }
          }}
          disabled={{ after: new Date() }}
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
}
