import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { j as useServerFn, a3 as useRealtimeTable, H as Button, a4 as Tabs, a5 as TabsList, a6 as TabsTrigger } from "./router-QgJicixe.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { listMyNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification } from "./notifications.functions-DjXHSykb.mjs";
import { C as Card } from "./card-CjqxMl2c.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import { m as CheckCheck, Z as Bell, C as Clock, A as ArrowRight, E as Check, az as Trash2, b4 as AtSign, aQ as UserPlus, ax as TriangleAlert, b5 as Info } from "../_libs/lucide-react.mjs";
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
function classifyFilter(n) {
  const k = (n.kind ?? "").toLowerCase();
  if (k.includes("assign")) return "assignments";
  if (k.includes("customer_hold") || k.includes("form_link") || k.includes("order_status") || k.includes("order_reminder") || k.includes("workflow") || k.includes("delay") || k.includes("customer_reply") || k.includes("form_submitted") || k.includes("order")) {
    return "orders";
  }
  if (k.includes("mention")) return "mentions";
  if (k.includes("sla") || k.includes("overdue") || k.includes("breach") || k.includes("escalat")) return "sla";
  return "system";
}
function kindIcon(n) {
  const f = classifyFilter(n);
  if (f === "mentions") return {
    Icon: AtSign,
    tone: "text-violet-600 bg-violet-50"
  };
  if (f === "assignments") return {
    Icon: UserPlus,
    tone: "text-indigo-600 bg-indigo-50"
  };
  if (f === "orders") return {
    Icon: Clock,
    tone: "text-blue-600 bg-blue-50"
  };
  if (f === "sla") return {
    Icon: TriangleAlert,
    tone: "text-rose-600 bg-rose-50"
  };
  return {
    Icon: Info,
    tone: "text-sky-600 bg-sky-50"
  };
}
function dayGroup(iso) {
  const d = new Date(iso);
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const yest = new Date(today);
  yest.setDate(yest.getDate() - 1);
  const dd = new Date(d);
  dd.setHours(0, 0, 0, 0);
  if (dd.getTime() === today.getTime()) return "Today";
  if (dd.getTime() === yest.getTime()) return "Yesterday";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
function relative(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 6e4);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}
function NotificationsPage() {
  const qc = useQueryClient();
  const fetchList = useServerFn(listMyNotifications);
  const markRead = useServerFn(markNotificationRead);
  const markAll = useServerFn(markAllNotificationsRead);
  const del = useServerFn(deleteNotification);
  const [filter, setFilter] = reactExports.useState("all");
  const {
    data,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ["notifications", "all"],
    queryFn: () => fetchList({
      data: {
        limit: 100
      }
    })
  });
  useRealtimeTable("notifications", () => {
    refetch();
    qc.invalidateQueries({
      queryKey: ["notifications", "unread-count"]
    });
  });
  const markMut = useMutation({
    mutationFn: (id) => markRead({
      data: {
        id
      }
    }),
    onSuccess: () => {
      refetch();
      qc.invalidateQueries({
        queryKey: ["notifications", "unread-count"]
      });
    }
  });
  const markAllMut = useMutation({
    mutationFn: () => markAll(),
    onSuccess: () => {
      refetch();
      qc.invalidateQueries({
        queryKey: ["notifications", "unread-count"]
      });
    }
  });
  const delMut = useMutation({
    mutationFn: (id) => del({
      data: {
        id
      }
    }),
    onSuccess: () => refetch()
  });
  const allRows = data?.rows ?? [];
  const rows = filter === "all" ? allRows : allRows.filter((n) => classifyFilter(n) === filter);
  const unread = allRows.filter((r) => !r.read_at).length;
  const counts = reactExports.useMemo(() => {
    const c = {
      all: allRows.length,
      assignments: 0,
      orders: 0,
      mentions: 0,
      sla: 0,
      system: 0
    };
    for (const n of allRows) c[classifyFilter(n)]++;
    return c;
  }, [allRows]);
  const groups = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const n of rows) {
      const g = dayGroup(n.created_at);
      if (!map.has(g)) map.set(g, []);
      map.get(g).push(n);
    }
    return Array.from(map.entries());
  }, [rows]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between gap-4 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight text-slate-900", children: "Notifications" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 mt-1 flex items-center gap-2", children: unread > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full bg-indigo-500 animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-indigo-700", children: [
              unread,
              " unread"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300", children: "·" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "live updates" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "All caught up · live updates" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => markAllMut.mutate(), disabled: unread === 0 || markAllMut.isPending, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "size-3.5 mr-1.5" }),
        " Mark all read"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Tabs, { value: filter, onValueChange: (v) => setFilter(v), children: /* @__PURE__ */ jsxRuntimeExports.jsx(TabsList, { className: "h-auto p-1 bg-slate-100", children: [{
      id: "all",
      label: "All"
    }, {
      id: "assignments",
      label: "Assignments"
    }, {
      id: "orders",
      label: "Order Updates"
    }, {
      id: "mentions",
      label: "Mentions"
    }, {
      id: "sla",
      label: "SLA / Alerts"
    }, {
      id: "system",
      label: "System"
    }].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: f.id, className: "gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: f.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center justify-center rounded-full text-[10px] font-semibold px-1.5 min-w-[20px] ${filter === f.id ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-600"}`, children: counts[f.id] })
    ] }, f.id)) }) }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-10 text-center text-sm text-slate-500", children: "Loading…" }) : rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-14 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto size-12 rounded-full bg-slate-100 grid place-items-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "size-5 text-slate-400" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-slate-700", children: "You're all caught up" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 mt-1", children: "New alerts will appear here in realtime." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: groups.map(([label, items]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-slate-200" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400", children: items.length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: items.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationItem, { n, onMark: (id) => markMut.mutate(id), onDelete: (id) => delMut.mutate(id) }, n.id)) })
    ] }, label)) })
  ] });
}
function NotificationItem({
  n,
  onMark,
  onDelete
}) {
  const {
    Icon,
    tone
  } = kindIcon(n);
  const unread = !n.read_at;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: `p-3 transition-all group hover:border-slate-300 ${unread ? "border-l-4 border-l-indigo-500 bg-indigo-50/20" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-9 rounded-xl grid place-items-center shrink-0 ${tone}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-slate-900 truncate", children: n.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-slate-400 font-medium", children: n.kind }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-[11px] text-slate-500 inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-3" }),
          " ",
          relative(n.created_at)
        ] })
      ] }),
      n.body && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-600 mt-1 line-clamp-2", children: n.body }),
      n.href && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: n.href, className: "mt-2 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700", children: [
        "Open ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-3" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: [
      unread && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onMark(n.id), className: "p-1.5 rounded hover:bg-slate-100 text-slate-500", title: "Mark read", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onDelete(n.id), className: "p-1.5 rounded hover:bg-rose-50 text-rose-500", title: "Delete", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }) })
    ] })
  ] }) });
}
export {
  NotificationsPage as component
};
