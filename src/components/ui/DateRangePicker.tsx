"use client";

import * as React from "react";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, differenceInDays } from "date-fns";
import { Calendar as CalendarIcon, X, Check, RotateCcw } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type DateRangePresetKey =
  | "today"
  | "yesterday"
  | "7d"
  | "15d"
  | "30d"
  | "this_week"
  | "last_week"
  | "this_month"
  | "last_month"
  | "this_fy"
  | "custom";

export interface PresetOption {
  key: DateRangePresetKey;
  label: string;
}

export const DEFAULT_DATE_PRESETS: PresetOption[] = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "7d", label: "Last 7 Days" },
  { key: "15d", label: "Last 15 Days" },
  { key: "30d", label: "Last 30 Days" },
  { key: "this_week", label: "This Week" },
  { key: "last_week", label: "Last Week" },
  { key: "this_month", label: "This Month" },
  { key: "last_month", label: "Last Month" },
  { key: "this_fy", label: "This FY" },
  { key: "custom", label: "Custom Range" },
];

export function getPresetRange(key: DateRangePresetKey): { from: Date; to: Date } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (key) {
    case "today":
      return { from: today, to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59) };

    case "yesterday": {
      const y = subDays(today, 1);
      return { from: y, to: new Date(y.getFullYear(), y.getMonth(), y.getDate(), 23, 59, 59) };
    }

    case "7d":
      return { from: subDays(today, 6), to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59) };

    case "15d":
      return { from: subDays(today, 14), to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59) };

    case "30d":
      return { from: subDays(today, 29), to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59) };

    case "this_week": {
      const start = startOfWeek(today, { weekStartsOn: 1 });
      return { from: start, to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59) };
    }

    case "last_week": {
      const prevWeekDate = subDays(today, 7);
      const start = startOfWeek(prevWeekDate, { weekStartsOn: 1 });
      const end = endOfWeek(prevWeekDate, { weekStartsOn: 1 });
      return { from: start, to: new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59) };
    }

    case "this_month": {
      const start = startOfMonth(today);
      return { from: start, to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59) };
    }

    case "last_month": {
      const prevMonth = subMonths(today, 1);
      const start = startOfMonth(prevMonth);
      const end = endOfMonth(prevMonth);
      return { from: start, to: new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59) };
    }

    case "this_fy": {
      const year = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
      const start = new Date(year, 3, 1);
      return { from: start, to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59) };
    }

    case "custom":
    default:
      return { from: subDays(today, 29), to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59) };
  }
}

export interface DateRangePickerProps {
  value?: { from?: Date; to?: Date };
  onChange?: (range: { from?: Date; to?: Date }, presetKey?: DateRangePresetKey) => void;
  preset?: DateRangePresetKey;
  onPresetChange?: (presetKey: DateRangePresetKey) => void;
  presets?: PresetOption[];
  className?: string;
  align?: "start" | "center" | "end";
  placeholder?: string;
}

export function DateRangePicker({
  value,
  onChange,
  preset = "custom",
  onPresetChange,
  presets = DEFAULT_DATE_PRESETS,
  className,
  align = "start",
  placeholder = "Select date range",
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [activePreset, setActivePreset] = React.useState<DateRangePresetKey>(preset);

  const [draftRange, setDraftRange] = React.useState<DateRange | undefined>(() => {
    if (value?.from || value?.to) {
      return { from: value.from, to: value.to };
    }
    return getPresetRange(preset);
  });

  React.useEffect(() => {
    setActivePreset(preset);
    if (preset !== "custom") {
      const calc = getPresetRange(preset);
      setDraftRange({ from: calc.from, to: calc.to });
    } else if (value?.from || value?.to) {
      setDraftRange({ from: value.from, to: value.to });
    }
  }, [preset, value?.from, value?.to]);

  const handleSelectPreset = (key: DateRangePresetKey) => {
    setActivePreset(key);
    onPresetChange?.(key);
    if (key !== "custom") {
      const computed = getPresetRange(key);
      setDraftRange({ from: computed.from, to: computed.to });
      onChange?.({ from: computed.from, to: computed.to }, key);
      setOpen(false);
    }
  };

  const handleApply = () => {
    if (draftRange?.from) {
      const from = draftRange.from;
      const to = draftRange.to || draftRange.from;
      const toEnd = new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59);
      onChange?.({ from, to: toEnd }, activePreset);
    }
    setOpen(false);
  };

  const handleRangeSelect = (range: DateRange | undefined) => {
    setDraftRange(range);
    setActivePreset("custom");
    onPresetChange?.("custom");
    if (range?.from && range?.to) {
      const from = range.from;
      const to = range.to;
      const toEnd = new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59);
      onChange?.({ from, to: toEnd }, "custom");
      setOpen(false);
    }
  };

  const displayLabel = React.useMemo(() => {
    if (activePreset !== "custom") {
      const pObj = presets.find((p) => p.key === activePreset);
      if (pObj) {
        if (draftRange?.from && draftRange?.to) {
          return `${pObj.label} (${format(draftRange.from, "d MMM")} – ${format(draftRange.to, "d MMM")})`;
        }
        return pObj.label;
      }
    }
    if (value?.from && value?.to) {
      return `${format(value.from, "d MMM yyyy")} — ${format(value.to, "d MMM yyyy")}`;
    }
    if (draftRange?.from && draftRange?.to) {
      return `${format(draftRange.from, "d MMM yyyy")} — ${format(draftRange.to, "d MMM yyyy")}`;
    }
    return placeholder;
  }, [activePreset, presets, value?.from, value?.to, draftRange?.from, draftRange?.to, placeholder]);

  const daysCount = React.useMemo(() => {
    if (draftRange?.from && draftRange?.to) {
      return differenceInDays(draftRange.to, draftRange.from) + 1;
    }
    return 0;
  }, [draftRange?.from, draftRange?.to]);

  // Default left month to previous month when showing past date range filter
  const initialMonth = React.useMemo(() => {
    const targetDate = draftRange?.to ?? value?.to ?? new Date();
    return subMonths(targetDate, 1);
  }, [draftRange?.to, value?.to]);

  return (
    <div className={cn("inline-flex items-center", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "h-9 px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center gap-2",
              open && "border-blue-500 ring-2 ring-blue-500/20",
            )}
          >
            <CalendarIcon className="size-3.5 text-slate-500" />
            <span className="truncate max-w-[280px]">{displayLabel}</span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align={align}
          className="w-auto p-0 rounded-2xl border border-slate-200/80 bg-white shadow-2xl overflow-hidden z-50 min-w-[340px] md:min-w-[700px]"
        >
          <div className="flex flex-col md:flex-row">
            {/* Left Sidebar: Presets (Enterprise UX Standard) */}
            <div className="w-full md:w-48 bg-slate-50/70 border-b md:border-b-0 md:border-r border-slate-100 p-3 flex flex-col justify-between shrink-0">
              <div>
                <div className="px-2.5 py-1 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Quick Presets
                </div>
                <div className="flex flex-row md:flex-col gap-1 overflow-x-auto no-scrollbar md:overflow-visible pb-1 md:pb-0">
                  {presets.map((p) => {
                    const isActive = activePreset === p.key;
                    return (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => handleSelectPreset(p.key)}
                        className={cn(
                          "w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center justify-between",
                          isActive
                            ? "bg-blue-600 text-white shadow-xs font-bold"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                        )}
                      >
                        <span>{p.label}</span>
                        {isActive && <Check className="size-3 shrink-0 hidden md:block" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Header: Date Readout & Status */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-white">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold border border-slate-200/60">
                      {draftRange?.from ? format(draftRange.from, "MMM d, yyyy") : "Start Date"}
                    </span>
                    <span className="text-slate-400 font-medium">to</span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold border border-slate-200/60">
                      {draftRange?.to ? format(draftRange.to, "MMM d, yyyy") : "End Date"}
                    </span>
                  </div>

                  {daysCount > 0 && (
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                      {daysCount} {daysCount === 1 ? "day" : "days"}
                    </span>
                  )}
                </div>

                {draftRange?.from && (
                  <button
                    type="button"
                    onClick={() => {
                      setDraftRange(undefined);
                      setActivePreset("custom");
                    }}
                    className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 hover:bg-slate-100 px-2 py-1 rounded-md transition-colors font-medium"
                  >
                    <RotateCcw className="size-3" /> Reset
                  </button>
                )}
              </div>

              {/* Dual Month Calendar View */}
              <div className="p-4 bg-white flex justify-center">
                <Calendar
                  mode="range"
                  selected={draftRange}
                  onSelect={handleRangeSelect}
                  numberOfMonths={2}
                  defaultMonth={initialMonth}
                  showOutsideDays={false}
                  disabled={{ after: new Date() }}
                  className="p-0 font-sans"
                />
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50">
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  Click start date then end date to set custom range
                </span>
                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setOpen(false)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 h-8 px-3 rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleApply}
                    disabled={!draftRange?.from}
                    className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white h-8 px-4 rounded-lg shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Check className="size-3.5" /> Apply Filter
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
