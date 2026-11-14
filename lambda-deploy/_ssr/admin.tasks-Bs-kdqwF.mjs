import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { j as useServerFn } from "./router-QgJicixe.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as listTasks, c as completeTask } from "./tasks.functions-D6mit-5h.mjs";
import { A as AddTaskDialog } from "./AddTaskDialog-4s-_aP2e.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import { aM as CircleAlert, br as CircleDashed, z as Calendar, I as Inbox, l as CircleCheck, ae as ListChecks, ar as User } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "./constants-CKRzJJF_.mjs";
import "./createSsrRpc-BO-AEXHh.mjs";
import "./server-BFjd5iLF.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./client.functions-WMvtjq1i.mjs";
import "./customer-access-core-Bd_9lLsD.mjs";
import "./brand-DLB0j9eh.mjs";
import "../_libs/tanstack__zod-adapter.mjs";
import "../_libs/zod.mjs";
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
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
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
function TasksPage() {
  const [scope, setScope] = reactExports.useState("all");
  const fn = useServerFn(listTasks);
  const completeFn = useServerFn(completeTask);
  const qc = useQueryClient();
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["tasks-board", scope],
    queryFn: () => fn({
      data: {
        scope,
        includeCompleted: false
      }
    }),
    refetchInterval: 6e4
  });
  const buckets = reactExports.useMemo(() => bucketize(data?.tasks ?? []), [data]);
  const completeMut = useMutation({
    mutationFn: (id) => completeFn({
      data: {
        id,
        completed: true
      }
    }),
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["tasks-board"]
    })
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-medium tracking-tight", style: {
          color: "var(--admin-fg)"
        }, children: "Tasks" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: {
          color: "var(--admin-fg-muted)"
        }, children: "Manual to-do items linked to leads, orders, and customers." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex overflow-hidden rounded-md border text-xs font-medium", style: {
          borderColor: "var(--admin-border)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setScope("mine"), className: "px-3 py-1.5", style: {
            background: scope === "mine" ? "var(--admin-accent)" : "var(--admin-surface)",
            color: scope === "mine" ? "var(--admin-accent-fg)" : "var(--admin-fg)"
          }, children: "My Tasks" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setScope("all"), className: "px-3 py-1.5", style: {
            background: scope === "all" ? "var(--admin-accent)" : "var(--admin-surface)",
            color: scope === "all" ? "var(--admin-accent-fg)" : "var(--admin-fg)"
          }, children: "All Tasks" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AddTaskDialog, {})
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Column, { title: "Overdue", count: buckets.overdue.length, tone: "danger", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-4" }), loading: isLoading, tasks: buckets.overdue, onComplete: (id) => completeMut.mutate(id) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Column, { title: "Due Today", count: buckets.today.length, tone: "warn", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleDashed, { className: "size-4" }), loading: isLoading, tasks: buckets.today, onComplete: (id) => completeMut.mutate(id) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Column, { title: "Upcoming (7 days)", count: buckets.upcoming.length, tone: "info", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-4" }), loading: isLoading, tasks: buckets.upcoming, onComplete: (id) => completeMut.mutate(id) })
    ] })
  ] });
}
function bucketize(tasks) {
  const now = /* @__PURE__ */ new Date();
  const startToday = new Date(now);
  startToday.setHours(0, 0, 0, 0);
  const endToday = new Date(startToday);
  endToday.setDate(endToday.getDate() + 1);
  const in7 = new Date(startToday);
  in7.setDate(in7.getDate() + 8);
  const overdue = [];
  const today = [];
  const upcoming = [];
  tasks.forEach((t) => {
    if (!t.due_date) {
      upcoming.push(t);
      return;
    }
    const d = new Date(t.due_date);
    if (d < startToday) overdue.push(t);
    else if (d < endToday) today.push(t);
    else if (d < in7) upcoming.push(t);
  });
  return {
    overdue,
    today,
    upcoming
  };
}
function Column({
  title,
  count,
  tone,
  icon,
  loading,
  tasks,
  onComplete
}) {
  const color = tone === "danger" ? "var(--admin-danger)" : tone === "warn" ? "var(--admin-warn)" : "#0284c7";
  const bg = tone === "danger" ? "rgba(220,38,38,0.08)" : tone === "warn" ? "rgba(217,119,6,0.08)" : "rgba(2,132,199,0.08)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "flex flex-col rounded-lg border", style: {
    borderColor: "var(--admin-border)",
    background: "var(--admin-surface)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between rounded-t-lg border-b px-3 py-2", style: {
      borderColor: "var(--admin-border)",
      background: bg
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-medium", style: {
        color
      }, children: [
        icon,
        title
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full px-2 py-0.5 text-[11px] font-medium", style: {
        background: "var(--admin-surface)",
        color
      }, children: count })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 p-2", children: [
      loading && /* @__PURE__ */ jsxRuntimeExports.jsx(ColumnSkeleton, {}),
      !loading && tasks.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, {}),
      !loading && tasks.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(TaskCard, { task: t, onComplete }, t.id))
    ] })
  ] });
}
function ColumnSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 animate-pulse rounded border", style: {
    background: "var(--admin-surface-2)",
    borderColor: "var(--admin-border)"
  } }, i)) });
}
function Empty() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 rounded border border-dashed py-8 text-center", style: {
    borderColor: "var(--admin-border)",
    color: "var(--admin-fg-muted)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Inbox, { className: "size-5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs", children: "No tasks here." })
  ] });
}
const PRIORITY_STYLE = {
  high: {
    color: "#b91c1c",
    bg: "rgba(220,38,38,0.12)",
    label: "High"
  },
  medium: {
    color: "#b45309",
    bg: "rgba(217,119,6,0.12)",
    label: "Medium"
  },
  low: {
    color: "#475569",
    bg: "rgba(100,116,139,0.12)",
    label: "Low"
  }
};
function TaskCard({
  task,
  onComplete
}) {
  const p = PRIORITY_STYLE[task.priority ?? "medium"];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("article", { className: "group rounded-md border p-3", style: {
    background: "var(--admin-surface)",
    borderColor: "var(--admin-border)"
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onComplete(task.id), className: "mt-0.5 rounded-full p-0.5 hover:bg-[var(--admin-surface-2)]", title: "Mark complete", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4", style: {
      color: "var(--admin-fg-muted)"
    } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium leading-snug", style: {
        color: "var(--admin-fg)"
      }, children: task.title }),
      task.description && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 line-clamp-2 text-xs", style: {
        color: "var(--admin-fg-muted)"
      }, children: task.description }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium", style: {
          background: p.bg,
          color: p.color
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-1.5 rounded-full", style: {
            background: p.color
          } }),
          p.label
        ] }),
        task.lead_code && /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/leads/$leadId", params: {
          leadId: task.lead_id
        }, className: "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px]", style: {
          borderColor: "var(--admin-border)",
          color: "var(--admin-accent)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ListChecks, { className: "size-3" }),
          task.lead_code
        ] }),
        task.application_code && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/applications/$applicationId", params: {
          applicationId: task.application_id
        }, className: "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px]", style: {
          borderColor: "var(--admin-border)",
          color: "var(--admin-accent)"
        }, children: task.application_code }),
        task.assigned_name && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[10px]", style: {
          color: "var(--admin-fg-muted)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-3" }),
          task.assigned_name
        ] }),
        task.due_date && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto inline-flex items-center gap-1 text-[10px]", style: {
          color: "var(--admin-fg-muted)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-3" }),
          formatIST(task.due_date)
        ] })
      ] })
    ] })
  ] }) });
}
function formatIST(iso) {
  const d = new Date(iso);
  const fmt = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
  return fmt.format(d).replace(",", "");
}
export {
  TasksPage as component
};
