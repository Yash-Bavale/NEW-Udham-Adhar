import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { j as useServerFn, a as cn, H as Button, P as Dialog, Q as DialogContent, U as DialogHeader, V as DialogTitle, X as DialogFooter } from "./router-QgJicixe.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { supabase } from "./client-BX5UfqqR.mjs";
import { a as listEmployeeSessionsAdmin, f as forceLogoutSessionAdmin, b as forceLogoutAllSessionsAdmin, g as getOrCreateSessionId, c as getEmployeeSecurityDetailAdmin } from "./useEmployeePresence-CFzdQNvG.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "./index.mjs";
import { w as ShieldCheck, R as RefreshCw, v as Search, bg as Smartphone, bh as Laptop, ad as Eye, bb as Power, bc as Lock, bi as Monitor, ak as History, e as ShieldAlert } from "../_libs/lucide-react.mjs";
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
function AdminSessionsPage() {
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [selectedEmpId, setSelectedEmpId] = reactExports.useState(null);
  const [isRotating, setIsRotating] = reactExports.useState(false);
  const [currentAuthUserId, setCurrentAuthUserId] = reactExports.useState(null);
  const [clientSessionId, setClientSessionId] = reactExports.useState(null);
  const qc = useQueryClient();
  const listFn = useServerFn(listEmployeeSessionsAdmin);
  const forceLogoutFn = useServerFn(forceLogoutSessionAdmin);
  const forceLogoutAllFn = useServerFn(forceLogoutAllSessionsAdmin);
  const {
    data,
    isLoading,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ["admin.sessions", statusFilter, searchQuery],
    queryFn: () => listFn({
      data: {
        statusFilter,
        searchQuery,
        limit: 100
      }
    }),
    refetchInterval: 15e3
  });
  reactExports.useEffect(() => {
    setClientSessionId(getOrCreateSessionId());
    supabase.auth.getUser().then(({
      data: authData
    }) => {
      if (authData?.user) {
        setCurrentAuthUserId(authData.user.id);
      }
    });
    const channel = supabase.channel("realtime:employee_sessions").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "employee_sessions"
    }, () => {
      qc.invalidateQueries({
        queryKey: ["admin.sessions"]
      });
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);
  const handleSync = () => {
    setIsRotating(true);
    refetch();
    setTimeout(() => setIsRotating(false), 700);
  };
  const handleForceLogout = async (sessionId, name) => {
    if (!confirm(`Are you sure you want to force logout ${name}'s session?`)) return;
    try {
      await forceLogoutFn({
        data: {
          sessionId,
          reason: "Terminated by administrator from Security Center"
        }
      });
      toast.success(`Session for ${name} has been terminated.`);
      qc.invalidateQueries({
        queryKey: ["admin.sessions"]
      });
    } catch (err) {
      toast.error(err.message || "Failed to terminate session");
    }
  };
  const handleForceLogoutAll = async (employeeId, name) => {
    if (!confirm(`Force logout ALL active sessions for ${name}?`)) return;
    try {
      const res = await forceLogoutAllFn({
        data: {
          employeeId,
          reason: "Admin terminated all active sessions"
        }
      });
      toast.success(`Terminated ${res?.terminated_count || 0} active sessions for ${name}.`);
      qc.invalidateQueries({
        queryKey: ["admin.sessions"]
      });
    } catch (err) {
      toast.error(err.message || "Failed to terminate all sessions");
    }
  };
  const rows = data?.rows ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full space-y-6 pb-20", children: [
    false,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-indigo-50 text-indigo-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-slate-900", children: "Employee Sessions & Security Fleet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "Live presence telemetry, device tracking, active vs idle working time, and administrative session termination." })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleSync, type: "button", className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: cn("h-3.5 w-3.5 text-indigo-600 transition-transform duration-500", (isRotating || isFetching) && "rotate-180 animate-spin") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sync Fleet" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid grid-cols-2 md:grid-cols-5 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-4 border border-slate-200 shadow-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-bold text-slate-500 uppercase tracking-wider", children: "Total Monitored" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-slate-900 mt-1", children: isLoading ? "--" : data?.totalStaffCount ?? 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400 mt-0.5", children: "Registered operators" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-4 border border-slate-200 shadow-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[11px] font-bold text-emerald-700 uppercase tracking-wider", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Active" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-ping" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-emerald-700 mt-1", children: isLoading ? "--" : data?.activeCount ?? 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-emerald-600 mt-0.5", children: "Interacting in CRM" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-4 border border-slate-200 shadow-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-bold text-amber-700 uppercase tracking-wider", children: "Idle" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-amber-700 mt-1", children: isLoading ? "--" : data?.idleCount ?? 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-amber-600 mt-0.5", children: ">10m paused" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-4 border border-slate-200 shadow-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-bold text-orange-700 uppercase tracking-wider", children: "Away" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-orange-700 mt-1", children: isLoading ? "--" : data?.awayCount ?? 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-orange-600 mt-0.5", children: "Tab unfocused / meal" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl p-4 border border-slate-200 shadow-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-bold text-slate-500 uppercase tracking-wider", children: "Offline" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-slate-700 mt-1", children: isLoading ? "--" : data?.offlineCount ?? 0 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400 mt-0.5", children: "No active session" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden p-5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-1.5", children: [{
          id: "all",
          label: "All Operators"
        }, {
          id: "active",
          label: "Active Only"
        }, {
          id: "idle",
          label: "Idle"
        }, {
          id: "away",
          label: "Away"
        }, {
          id: "offline",
          label: "Offline"
        }].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setStatusFilter(tab.id), className: cn("px-3 py-1 rounded-lg text-xs font-semibold transition", statusFilter === tab.id ? "bg-slate-900 text-white shadow-xs" : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"), children: tab.label }, tab.id)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Search operator, email, role…", className: "pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-60" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-lg border border-slate-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs text-slate-600", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-[11px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3", children: "Operator" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3", children: "Presence" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3", children: "Login Method" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3", children: "Session Time" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3", children: "Active / Idle" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3", children: "Device / Browser" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3", children: "IP Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-3 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-slate-100", children: rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 8, className: "py-8 text-center text-slate-400", children: "No operators found matching the filter." }) }) : rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/60 transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-3 px-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-slate-900", children: r.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400", children: r.email }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-indigo-600 font-medium capitalize mt-0.5", children: r.primaryRole })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase", r.presenceStatus === "active" && "bg-emerald-100 text-emerald-800", r.presenceStatus === "idle" && "bg-amber-100 text-amber-800", r.presenceStatus === "away" && "bg-orange-100 text-orange-800", r.presenceStatus === "offline" && "bg-slate-100 text-slate-600"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("w-1.5 h-1.5 rounded-full", r.presenceStatus === "active" && "bg-emerald-500 animate-pulse", r.presenceStatus === "idle" && "bg-amber-500", r.presenceStatus === "away" && "bg-orange-500", r.presenceStatus === "offline" && "bg-slate-400") }),
            r.presenceStatus
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-3", children: r.loginMethod ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium capitalize", children: r.loginMethod }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: "—" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-3", children: r.presenceStatus !== "offline" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-slate-800", children: [
            Math.floor(r.totalSessionMinutes / 60),
            "h ",
            r.totalSessionMinutes % 60,
            "m"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: "—" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-3", children: r.presenceStatus !== "offline" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-emerald-700 font-semibold", children: [
              r.activeMinutes,
              "m active"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300", children: " / " }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-amber-700 font-medium", children: [
              r.idleMinutes,
              "m idle"
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: "—" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-3 px-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-slate-700 font-medium", children: [
              r.deviceType === "Mobile" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-3.5 w-3.5 text-slate-400 flex-shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Laptop, { className: "h-3.5 w-3.5 text-slate-400 flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: r.os || "—" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400", children: r.browser || "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-3 font-mono text-[11px] text-slate-600", children: r.ipAddress || "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "h-7 text-xs gap-1", onClick: () => setSelectedEmpId(r.employeeId), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Audit" })
            ] }),
            r.presenceStatus !== "offline" && r.sessionId && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "destructive", className: "h-7 text-xs gap-1", onClick: () => handleForceLogout(r.sessionId, r.name), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: "h-3.5 w-3.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Force Out" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", className: "h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50", onClick: () => handleForceLogoutAll(r.employeeId, r.name), title: "Terminate all active devices", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Kick All" }) })
          ] }) })
        ] }, r.employeeId)) })
      ] }) })
    ] }),
    selectedEmpId && /* @__PURE__ */ jsxRuntimeExports.jsx(SecurityAuditDialog, { employeeId: selectedEmpId, onClose: () => setSelectedEmpId(null) })
  ] });
}
function SecurityAuditDialog({
  employeeId,
  onClose
}) {
  const getDetailFn = useServerFn(getEmployeeSecurityDetailAdmin);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin.employee.security-detail", employeeId],
    queryFn: () => getDetailFn({
      data: {
        employeeId
      }
    })
  });
  const p = data?.profile;
  const sessions = data?.activeSessions ?? [];
  const loginHist = data?.loginHistory ?? [];
  const secEvents = data?.securityEvents ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-3xl max-h-[85vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-5 w-5 text-indigo-600" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Security & Audit Profile — ",
        p?.full_name || p?.display_name || p?.email
      ] })
    ] }) }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-12 text-center text-slate-400 text-sm", children: "Loading security events…" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 text-xs text-slate-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400 uppercase font-bold", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-900", children: p?.email })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400 uppercase font-bold", children: "Employee Code" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-900", children: p?.employee_code || "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400 uppercase font-bold", children: "Account Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-emerald-700", children: p?.is_active !== false ? "Active Staff" : "Suspended" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-bold text-slate-900 text-sm flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { className: "h-4 w-4 text-slate-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Recent Sessions (",
            sessions.length,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-slate-200 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3", children: "Session" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3", children: "Device / OS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3", children: "Active / Idle" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3", children: "Login Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3", children: "Status" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-slate-100", children: sessions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-2 px-3 font-mono text-[11px]", children: [
              s.session_id.slice(0, 14),
              "…"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-2 px-3", children: [
              s.operating_system,
              " • ",
              s.browser
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-2 px-3 font-semibold text-emerald-700", children: [
              Math.round(s.active_seconds / 60),
              "m / ",
              Math.round((s.idle_seconds + s.away_seconds) / 60),
              "m"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-3", children: new Date(s.login_at).toLocaleString("en-IN") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-3 capitalize font-medium", children: s.status })
          ] }, s.id)) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-bold text-slate-900 text-sm flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-4 w-4 text-slate-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Login History (",
            loginHist.length,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-slate-200 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3", children: "Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3", children: "Method" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3", children: "IP Address" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 px-3", children: "Result" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-slate-100", children: loginHist.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-3", children: new Date(h.login_at).toLocaleString("en-IN") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-3 capitalize", children: h.login_method }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-3 font-mono", children: h.ip_address || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 px-3", children: h.success ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-700 font-bold", children: "Success" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-rose-600 font-bold", children: [
              "Failed (",
              h.failure_reason,
              ")"
            ] }) })
          ] }, h.id)) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-bold text-slate-900 text-sm flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-4 w-4 text-slate-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Security Events Audit Trail" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5 max-h-48 overflow-y-auto", children: secEvents.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-slate-900", children: e.event_type }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 ml-2", children: new Date(e.created_at).toLocaleString("en-IN") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-slate-500", children: JSON.stringify(e.metadata || {}) })
        ] }, e.id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Close" }) })
  ] }) });
}
export {
  AdminSessionsPage as component
};
