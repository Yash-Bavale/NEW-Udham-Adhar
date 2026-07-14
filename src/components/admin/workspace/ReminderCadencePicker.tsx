// Phase 3 — Reminder Cadence Picker. Employee-configurable per order.
// Presets: 1h / 2h / 4h / 1d / 2d / 4d, plus a custom input.
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PRESETS: { label: string; minutes: number }[] = [
  { label: "1h", minutes: 60 },
  { label: "2h", minutes: 120 },
  { label: "4h", minutes: 240 },
  { label: "1d", minutes: 60 * 24 },
  { label: "2d", minutes: 60 * 24 * 2 },
  { label: "4d", minutes: 60 * 24 * 4 },
];

interface Props {
  value: number; // minutes
  onChange: (minutes: number) => void;
  label?: string;
  disabled?: boolean;
}

export function ReminderCadencePicker({ value, onChange, label = "Reminder cadence", disabled }: Props) {
  const isPreset = PRESETS.some((p) => p.minutes === value);
  const [customMode, setCustomMode] = useState(!isPreset && value > 0);
  const [customUnit, setCustomUnit] = useState<"h" | "d">(value % (60 * 24) === 0 ? "d" : "h");
  const customAmount = customUnit === "d" ? Math.max(1, Math.round(value / (60 * 24))) : Math.max(1, Math.round(value / 60));

  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wider text-slate-500">{label}</Label>
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <Button
            key={p.label}
            type="button"
            variant={!customMode && value === p.minutes ? "default" : "outline"}
            size="sm"
            disabled={disabled}
            onClick={() => {
              setCustomMode(false);
              onChange(p.minutes);
            }}
          >
            {p.label}
          </Button>
        ))}
        <Button
          type="button"
          variant={customMode ? "default" : "outline"}
          size="sm"
          disabled={disabled}
          onClick={() => setCustomMode(true)}
        >
          Custom
        </Button>
      </div>

      {customMode && (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={1}
            max={customUnit === "d" ? 30 : 720}
            value={customAmount}
            disabled={disabled}
            onChange={(e) => {
              const n = Math.max(1, Number(e.target.value) || 1);
              onChange(customUnit === "d" ? n * 60 * 24 : n * 60);
            }}
            className="w-24"
          />
          <div className="flex rounded-md border border-slate-200 overflow-hidden">
            {(["h", "d"] as const).map((u) => (
              <button
                key={u}
                type="button"
                disabled={disabled}
                onClick={() => {
                  setCustomUnit(u);
                  onChange(u === "d" ? customAmount * 60 * 24 : customAmount * 60);
                }}
                className={cn(
                  "px-3 py-1.5 text-xs",
                  customUnit === u ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-50",
                )}
              >
                {u === "h" ? "hours" : "days"}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-500">= every {formatMinutes(value)}</span>
        </div>
      )}
    </div>
  );
}

function formatMinutes(m: number): string {
  if (m % (60 * 24) === 0) return `${m / (60 * 24)}d`;
  if (m % 60 === 0) return `${m / 60}h`;
  return `${m}m`;
}
