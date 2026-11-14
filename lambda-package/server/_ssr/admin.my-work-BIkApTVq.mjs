import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { j as useServerFn, _ as useRole, aE as usePermissions, a3 as useRealtimeTable } from "./router-QgJicixe.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { supabase } from "./client-BX5UfqqR.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { I as Inbox, b2 as PackageOpen, ao as Sparkles, Z as Bell, b3 as FileCheckCorner, A as ArrowRight } from "../_libs/lucide-react.mjs";
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
const getMyWorkSummary = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("3a5efc86063dd66664308eb1b4250b747d1d01d5b94c6732444a760364f0ee12"));
function MyWorkPage() {
  const fetchSummary = useServerFn(getMyWorkSummary);
  const [hasSession, setHasSession] = reactExports.useState(false);
  const role = useRole();
  const {
    can
  } = usePermissions();
  reactExports.useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({
      data: data2
    }) => {
      if (active) setHasSession(!!data2.session);
    });
    const {
      data: sub
    } = supabase.auth.onAuthStateChange((_e, session) => setHasSession(!!session));
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);
  const {
    data,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["my-work"],
    queryFn: () => fetchSummary(),
    enabled: hasSession
  });
  useRealtimeTable("notifications", () => refetch());
  useRealtimeTable("applications", () => refetch());
  useRealtimeTable("documents", () => refetch());
  useRealtimeTable("leads", () => refetch());
  const counters = data?.counters;
  const isAdmin = role.hasAny(["super_admin", "admin"]);
  const canOrders = isAdmin || can("orders");
  const canLeads = isAdmin || can("leads");
  const cards = reactExports.useMemo(() => {
    const base = [{
      label: "Total Leads",
      value: counters?.totalLeads ?? 0,
      icon: Inbox,
      accent: "var(--admin-accent)",
      to: "/admin/leads",
      search: isAdmin ? void 0 : {
        assignee: "me"
      },
      show: canLeads
    }, {
      label: "Orders",
      value: counters?.orderReceived ?? 0,
      icon: PackageOpen,
      accent: "#F97316",
      to: "/admin/orders",
      search: isAdmin ? {
        fulfillment: "order_received"
      } : {
        assignee: "me",
        fulfillment: "order_received"
      },
      show: canOrders
    }, {
      label: "Active Leads",
      value: counters?.assignedLeads ?? 0,
      icon: Sparkles,
      accent: "var(--admin-success)",
      to: "/admin/leads",
      search: isAdmin ? {
        status: "new_lead"
      } : {
        assignee: "me",
        status: "new_lead"
      },
      show: canLeads
    }, {
      label: "Unread notifications",
      value: counters?.unreadNotifications ?? 0,
      icon: Bell,
      accent: "var(--admin-accent)",
      to: "/admin/notifications",
      show: true
    }];
    if (isAdmin) {
      base.splice(3, 0, {
        label: "Documents to review",
        value: counters?.pendingDocs ?? 0,
        icon: FileCheckCorner,
        accent: "var(--admin-warn)",
        to: "/admin/review",
        show: true
      });
    }
    return base.filter((c) => c.show);
  }, [counters, isAdmin, canOrders, canLeads]);
  const hasAssignedOrders = (data?.assignedApplications?.length ?? 0) > 0;
  const OrdersSection = canOrders ? /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Paid orders — process now", subtitle: "Payment received. Start the fulfillment workflow.", empty: "No assigned orders — you're clear.", href: "/admin/orders", children: [...data?.assignedApplications ?? []].sort((a, b) => {
    const actNow = ["order_received", "S01", "S02", "awaiting_customer_form"];
    const aFresh = actNow.includes(a.fulfillment_status ?? "order_received") ? 0 : 1;
    const bFresh = actNow.includes(b.fulfillment_status ?? "order_received") ? 0 : 1;
    if (aFresh !== bFresh) return aFresh - bFresh;
    return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
  }).slice(0, 12).map((a) => {
    const actNow = ["order_received", "S01", "S02", "awaiting_customer_form"];
    const fresh = actNow.includes(a.fulfillment_status ?? "order_received");
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/applications/$applicationId", params: {
      applicationId: a.id
    }, className: "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm border", style: fresh ? {
      background: "rgba(249, 115, 22, 0.10)",
      borderColor: "rgba(249, 115, 22, 0.45)"
    } : {
      borderColor: "transparent"
    }, children: [
      fresh && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded", style: {
        background: "#F97316",
        color: "white"
      }, children: "Start now" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-[11px] px-1.5 py-0.5 rounded", style: {
        background: "var(--admin-surface-2)",
        color: "var(--admin-fg-muted)"
      }, children: a.application_code ?? a.id.slice(0, 8) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium truncate flex-1", style: {
        color: fresh ? "#F97316" : "var(--admin-fg)"
      }, children: a.lead?.name ?? "Unknown" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: a.fulfillment_status ?? a.application_status, fresh }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px]", style: {
        color: "var(--admin-fg-muted)"
      }, children: formatRelative(a.updated_at) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-3.5", style: {
        color: "var(--admin-fg-subtle)"
      } })
    ] }, a.id);
  }) }, "orders") : null;
  const LeadsSection = canLeads ? /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Active leads — contact now", subtitle: "Not-contacted leads, oldest first. Red = >3h, amber = >1h", empty: "No uncontacted leads assigned.", href: "/admin/leads", children: (data?.assignedLeads ?? []).slice(0, 12).map((l) => {
    const ageMs = Date.now() - new Date(l.created_at).getTime();
    const overdue3h = ageMs > 3 * 3600 * 1e3;
    const overdue1h = !overdue3h && ageMs > 1 * 3600 * 1e3;
    const tone = overdue3h ? {
      fg: "#EF4444",
      label: "3h+"
    } : overdue1h ? {
      fg: "#F59E0B",
      label: "1h+"
    } : null;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/leads/$leadId", params: {
      leadId: l.id
    }, className: "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[var(--admin-surface-2)] transition-colors text-sm border border-transparent", children: [
      tone && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded text-white", style: {
        background: tone.fg
      }, children: tone.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-[11px] px-1.5 py-0.5 rounded", style: {
        background: "var(--admin-surface-2)",
        color: "var(--admin-fg-muted)"
      }, children: l.lead_code ?? l.id.slice(0, 8) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium truncate flex-1", style: {
        color: "var(--admin-fg)"
      }, children: l.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs truncate max-w-[200px]", style: {
        color: "var(--admin-fg-muted)"
      }, children: l.service }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { status: l.status }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px]", style: {
        color: "var(--admin-fg-muted)"
      }, children: formatRelative(l.created_at) })
    ] }, l.id);
  }) }, "leads") : null;
  const orderedSections = hasAssignedOrders ? [OrdersSection, LeadsSection] : [LeadsSection, OrdersSection];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end justify-between gap-4 flex-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", style: {
        color: "var(--admin-fg)"
      }, children: "My Work" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", style: {
        color: "var(--admin-fg-muted)"
      }, children: "Your personal queue — assignments, leads, and live alerts." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-3", children: cards.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: c.to, search: c.search, className: "rounded-xl border p-4 transition-colors hover:border-[var(--admin-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]", style: {
      borderColor: "var(--admin-border)",
      background: "var(--admin-surface)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] uppercase tracking-wider", style: {
          color: "var(--admin-fg-muted)"
        }, children: c.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(c.icon, { className: "size-4", style: {
          color: c.accent
        } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-semibold mt-1", style: {
        color: "var(--admin-fg)"
      }, children: isLoading ? "—" : c.value })
    ] }, c.label)) }),
    orderedSections,
    isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Documents pending review", subtitle: "Oldest uploads first", empty: "No pending documents.", href: "/admin/review", children: (data?.pendingDocuments ?? []).slice(0, 8).map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/review", className: "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[var(--admin-surface-2)] transition-colors text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FileCheckCorner, { className: "size-4", style: {
        color: "var(--admin-warn)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium truncate flex-1", style: {
        color: "var(--admin-fg)"
      }, children: d.doc_type }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs truncate max-w-[260px]", style: {
        color: "var(--admin-fg-muted)"
      }, children: d.file_name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px]", style: {
        color: "var(--admin-fg-muted)"
      }, children: formatRelative(d.uploaded_at) })
    ] }, d.id)) })
  ] });
}
function Section({
  title,
  subtitle,
  children,
  empty,
  href
}) {
  const arr = Array.isArray(children) ? children : [children];
  const hasContent = arr.filter(Boolean).length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-xl border overflow-hidden", style: {
    borderColor: "var(--admin-border)",
    background: "var(--admin-surface)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between px-4 py-3 border-b", style: {
      borderColor: "var(--admin-border)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold", style: {
          color: "var(--admin-fg)"
        }, children: title }),
        subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px]", style: {
          color: "var(--admin-fg-muted)"
        }, children: subtitle })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: href, className: "text-xs flex items-center gap-1 hover:underline", style: {
        color: "var(--admin-accent)"
      }, children: [
        "View all ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-3" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2", children: hasContent ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-0.5", children }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-6 text-center text-xs", style: {
      color: "var(--admin-fg-muted)"
    }, children: empty }) })
  ] });
}
function StatusPill({
  status,
  fresh
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border", style: fresh ? {
    borderColor: "rgba(249,115,22,0.5)",
    color: "#F97316",
    background: "rgba(249,115,22,0.10)"
  } : {
    borderColor: "var(--admin-border)",
    color: "var(--admin-fg-muted)",
    background: "var(--admin-surface-2)"
  }, children: status.replace(/_/g, " ") });
}
function formatRelative(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 6e4);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}
export {
  MyWorkPage as component
};
