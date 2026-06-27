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
  const range: DateRange | undefined = from ? { from, to } : undefined;

  const label =
    from && to
      ? `${formatIST(from, { dateOnly: true })} – ${formatIST(to, { dateOnly: true })}`
      : from
        ? `${formatIST(from, { dateOnly: true })} – …`
        : "Pick a date range";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("h-9 gap-2 font-normal", className)}
        >
          <CalendarIcon className="size-4 opacity-70" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 pointer-events-auto" align="end">
        <Calendar
          mode="range"
          numberOfMonths={2}
          defaultMonth={from ?? new Date()}
          selected={range}
          onSelect={(r) => {
            onChange({ from: r?.from, to: r?.to });
            if (r?.from && r?.to) setOpen(false);
          }}
          disabled={(d) => d > new Date()}
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
}
