import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { j as useServerFn, I as Input, H as Button } from "./router-QgJicixe.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { S as SectionCard } from "./ui-BVv-e2FI.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { ay as CalendarCheck, D as Download, y as ChevronDown, s as ChevronRight } from "../_libs/lucide-react.mjs";
import { o as object, s as string } from "../_libs/zod.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/cookie-es.mjs";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "./constants-CKRzJJF_.mjs";
import "./client.functions-WMvtjq1i.mjs";
import "./customer-access-core-Bd_9lLsD.mjs";
import "./brand-DLB0j9eh.mjs";
import "../_libs/tanstack__zod-adapter.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "./datetime-DvkGwlJs.mjs";
import "./orders-filter-CXWoZisU.mjs";
import "./computeOrderStage-D7ejTUnj.mjs";
import "./consultation-asWR5IET.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./roles-CFhgFhhh.mjs";
import "./permissions.functions-DO0h7DgB.mjs";
import "./client-BX5UfqqR.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/lovable.dev__webhooks-js.mjs";
import "../_libs/lovable.dev__email-js.mjs";
import "./registry-DV_lUXjY.mjs";
import "../_libs/react-email__html.mjs";
import "../_libs/react-email__head.mjs";
import "../_libs/react-email__preview.mjs";
import "../_libs/react-email__body.mjs";
import "../_libs/react-email__container.mjs";
import "../_libs/react-email__heading.mjs";
import "../_libs/react-email__text.mjs";
import "../_libs/react-email__section.mjs";
import "../_libs/react-email__button.mjs";
import "../_libs/react-email__hr.mjs";
import "../_libs/date-fns.mjs";
import "../_libs/react-day-picker.mjs";
import "../_libs/date-fns__tz.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/motion.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const getMonthlyAttendance = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  month: string().regex(/^\d{4}-\d{2}$/)
}).parse(d)).handler(createSsrRpc("aabf2ace5da0bceb6608f833d01e2f87a0b5c943a88ce256e84f68af7333d2a6"));
const hm = (s) => {
  const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60);
  return s <= 0 ? "—" : `${h}h ${m}m`;
};
const time = (iso) => iso ? new Date(iso).toLocaleTimeString("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true
}) : "—";
const weekday = (d) => (/* @__PURE__ */ new Date(`${d}T12:00:00+05:30`)).toLocaleDateString("en-IN", {
  weekday: "short",
  timeZone: "Asia/Kolkata"
});
const STATUS = {
  full: {
    label: "Full Day",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200"
  },
  half: {
    label: "Half Day",
    cls: "bg-amber-50 text-amber-700 border-amber-200"
  },
  absent: {
    label: "Absent / Off",
    cls: "bg-slate-100 text-slate-500 border-slate-200"
  }
};
function currentMonth() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit"
  }).format(/* @__PURE__ */ new Date()).slice(0, 7);
}
function exportCsv(month, rows) {
  const lines = [["Employee", "Code", "Date", "Day", "Status", "First", "Last", "Worked", "Active", "Idle", "Completed", "Closed", "Actions"].join(",")];
  for (const e of rows) {
    for (const d of e.days) {
      lines.push([`"${e.name}"`, e.employee_code ?? "", d.date, weekday(d.date), STATUS[d.status].label, time(d.first_at), time(d.last_at), hm(d.worked_seconds), hm(d.active_seconds), hm(d.idle_seconds), d.completed, d.closed, d.actions].join(","));
    }
    lines.push([`"${e.name} TOTAL"`, e.employee_code ?? "", "", "", `Full ${e.full_days} / Half ${e.half_days} / Absent ${e.absent_days}`, "", "", "", hm(e.active_seconds), hm(e.idle_seconds), e.completed, e.closed, e.actions].join(","));
  }
  const blob = new Blob([lines.join("\n")], {
    type: "text/csv"
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `attendance-payroll-${month}.csv`;
  a.click();
}
function AttendancePage() {
  const [month, setMonth] = reactExports.useState(currentMonth());
  const [open, setOpen] = reactExports.useState(null);
  const fn = useServerFn(getMonthlyAttendance);
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ["admin.attendance", month],
    queryFn: () => fn({
      data: {
        month
      }
    }),
    staleTime: 6e4
  });
  const rows = data?.employees ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 p-4 md:p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "flex items-center gap-2 text-xl font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarCheck, { className: "size-5" }),
          " Attendance & Payroll"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Full day = 6h+ worked. Half day = less than 6h, or any order work. Click an employee for the day-by-day view." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "month", value: month, max: currentMonth(), onChange: (e) => e.target.value && setMonth(e.target.value), className: "w-40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", disabled: !rows.length, onClick: () => exportCsv(month, rows), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-1 size-4" }),
          " Export CSV"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b text-left text-[11px] uppercase tracking-wider text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Employee" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-center", children: "Days Worked" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-center", children: "Full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-center", children: "Half" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-center", children: "Absent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-center", children: "Completed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-center", children: "Closed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-center", children: "Active" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-center", children: "Idle" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 9, className: "px-3 py-8 text-center text-xs text-muted-foreground", children: "Loading…" }) }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 9, className: "px-3 py-8 text-center text-xs text-destructive", children: error.message }) }),
        !isLoading && !error && rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 9, className: "px-3 py-8 text-center text-xs text-muted-foreground", children: "No data for this month." }) }),
        rows.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "cursor-pointer border-b hover:bg-muted/40", onClick: () => setOpen(open === e.employee_id ? null : e.employee_id), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 font-medium", children: [
                open === e.employee_id ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4" }),
                e.name
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pl-5 font-mono text-[11px] text-muted-foreground", children: e.employee_code ?? "" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-center font-semibold", children: e.days_worked }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-center text-emerald-700", children: e.full_days }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-center text-amber-700", children: e.half_days }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-center text-muted-foreground", children: e.absent_days }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-center", children: e.completed }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-center", children: e.closed }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-center", children: hm(e.active_seconds) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-center", children: hm(e.idle_seconds) })
          ] }),
          open === e.employee_id && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 9, className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left text-[10px] uppercase tracking-wider text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-1", children: "Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-1", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-1", children: "First" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-1", children: "Last" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-1", children: "Worked" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-1", children: "Active" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-1", children: "Idle" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-1", children: "Completed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-1", children: "Closed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-1", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: e.days.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-2 py-1", children: [
                d.date,
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: weekday(d.date) === "Sun" ? "text-destructive" : "text-muted-foreground", children: weekday(d.date) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STATUS[d.status].cls}`, children: STATUS[d.status].label }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1", children: time(d.first_at) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1", children: time(d.last_at) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1", children: hm(d.worked_seconds) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1", children: hm(d.active_seconds) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1", children: hm(d.idle_seconds) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1", children: d.completed || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1", children: d.closed || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-1", children: d.actions || "—" })
            ] }, d.date)) })
          ] }) }) })
        ] }, e.employee_id))
      ] })
    ] }) }) })
  ] });
}
export {
  AttendancePage as component
};
