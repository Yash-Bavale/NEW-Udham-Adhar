import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDashboardPrivacy } from "@/hooks/useDashboardPrivacy";
import { cn } from "@/lib/utils";

export interface DashboardPrivacyToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function DashboardPrivacyToggle({
  className,
  showLabel = true,
}: DashboardPrivacyToggleProps) {
  const { isPrivacyEnabled, togglePrivacy } = useDashboardPrivacy();

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={togglePrivacy}
            aria-label={isPrivacyEnabled ? "Show dashboard and order values" : "Hide dashboard and order values"}
            aria-pressed={isPrivacyEnabled}
            className={cn(
              "h-8 inline-flex items-center gap-1.5 px-2.5 rounded-lg border text-xs font-semibold transition-all duration-150 cursor-pointer select-none shrink-0 shadow-2xs active:scale-95",
              isPrivacyEnabled
                ? "border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 hover:border-amber-400 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-200"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
              className
            )}
          >
            {isPrivacyEnabled ? (
              <>
                <EyeOff className="size-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                {showLabel && (
                  <span className="hidden sm:inline-block tracking-tight font-bold">
                    Values Hidden
                  </span>
                )}
                <span className="size-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
              </>
            ) : (
              <>
                <Eye className="size-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                {showLabel && (
                  <span className="hidden sm:inline-block tracking-tight text-slate-600 dark:text-slate-300">
                    Hide Values
                  </span>
                )}
              </>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="end" className="text-xs max-w-xs text-center">
          {isPrivacyEnabled
            ? "Privacy Mode is ON — Executive dashboard and order KPI counts are hidden. Click to reveal."
            : "Hide all executive dashboard values & order KPI counts (Privacy Mode)"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default DashboardPrivacyToggle;
