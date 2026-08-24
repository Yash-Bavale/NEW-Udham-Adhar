"use client";

import * as React from "react";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:2.25rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent select-none",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("relative flex flex-col gap-6 md:flex-row md:gap-8", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-3", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1 z-10 pointer-events-none px-1",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-8 w-8 select-none p-0 aria-disabled:opacity-30 pointer-events-auto rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors shadow-xs",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-8 w-8 select-none p-0 aria-disabled:opacity-30 pointer-events-auto rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors shadow-xs",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex h-9 w-full items-center justify-center px-8 text-sm font-bold text-slate-800 tracking-tight",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "flex h-9 w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn("bg-popover absolute inset-0 opacity-0", defaultClassNames.dropdown),
        caption_label: cn(
          "select-none font-bold text-slate-800 text-sm",
          captionLayout === "label"
            ? "text-sm font-bold text-slate-800"
            : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5",
          defaultClassNames.caption_label,
        ),
        table: "w-full border-collapse",
        weekdays: cn("grid grid-cols-7 w-full border-b border-slate-100 pb-1 mb-1", defaultClassNames.weekdays),
        weekday: cn(
          "text-slate-400 select-none text-[11px] font-bold uppercase text-center h-7 flex items-center justify-center tracking-wider",
          defaultClassNames.weekday,
        ),
        week: cn("grid grid-cols-7 w-full gap-x-0 gap-y-1", defaultClassNames.week),
        week_number_header: cn("w-9 select-none", defaultClassNames.week_number_header),
        week_number: cn(
          "text-muted-foreground select-none text-[0.8rem]",
          defaultClassNames.week_number,
        ),
        day: cn(
          "group/day relative h-9 w-full select-none p-0 text-center flex items-center justify-center data-[range-middle=true]:bg-blue-50/80 data-[range-start=true]:bg-blue-50/80 data-[range-start=true]:rounded-l-lg data-[range-end=true]:bg-blue-50/80 data-[range-end=true]:rounded-r-lg",
          defaultClassNames.day,
        ),
        range_start: cn("bg-blue-50/80 rounded-l-lg", defaultClassNames.range_start),
        range_middle: cn("bg-blue-50/80 text-blue-900 font-medium", defaultClassNames.range_middle),
        range_end: cn("bg-blue-50/80 rounded-r-lg", defaultClassNames.range_end),
        today: cn(
          "font-bold text-blue-600 underline underline-offset-4 decoration-2 decoration-blue-500",
          defaultClassNames.today,
        ),
        outside: cn(
          "text-slate-300 opacity-40 pointer-events-none",
          defaultClassNames.outside,
        ),
        disabled: cn("text-slate-300 pointer-events-none cursor-not-allowed font-normal line-through decoration-slate-200", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />;
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return <ChevronLeftIcon className={cn("size-4", className)} {...props} />;
          }

          if (orientation === "right") {
            return <ChevronRightIcon className={cn("size-4", className)} {...props} />;
          }

          return <ChevronDownIcon className={cn("size-4", className)} {...props} />;
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-9 items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-blue-600 data-[selected-single=true]:text-white data-[selected-single=true]:hover:bg-blue-700 data-[selected-single=true]:shadow-sm data-[range-middle=true]:bg-transparent data-[range-middle=true]:text-blue-900 data-[range-middle=true]:hover:bg-blue-100/70 data-[range-middle=true]:rounded-none data-[range-start=true]:bg-blue-600 data-[range-start=true]:text-white data-[range-start=true]:hover:bg-blue-700 data-[range-start=true]:shadow-sm data-[range-end=true]:bg-blue-600 data-[range-end=true]:text-white data-[range-end=true]:hover:bg-blue-700 data-[range-end=true]:shadow-sm group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex h-9 w-9 items-center justify-center font-semibold text-xs leading-none data-[range-end=true]:rounded-lg data-[range-start=true]:rounded-lg group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[2px] transition-all",
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
