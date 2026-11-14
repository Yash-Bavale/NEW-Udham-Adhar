import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { O as Outlet, L as Link, e as useNavigate, b as useRouterState } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery, u as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { bm as DashboardPrivacyProvider, bn as FinancialVisibilityProvider, j as useServerFn, H as Button, _ as useRole, aE as usePermissions, a as cn, bl as clearModuleFilterState, bh as useDashboardPrivacy, a3 as useRealtimeTable, P as Dialog, Q as DialogContent } from "./router-QgJicixe.mjs";
import { supabase } from "./client-BX5UfqqR.mjs";
import { _ as _e } from "../_libs/cmdk.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { getSidebarNotificationCounts, getUnreadNotificationCount, listMyNotifications, markNotificationRead, markAllNotificationsRead } from "./notifications.functions-DjXHSykb.mjs";
import { u as useNotifications, p as playNotificationSound } from "./useNotifications-DFr-oGCL.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { getDueRemindersSummary } from "./callback-reminder.functions-6OwGV8Nj.mjs";
import { g as getGlobalReminderSoundSettings } from "./app-settings.functions-ChQcgAgv.mjs";
import { s as syncGlobalSoundSettings, p as preloadAudio, a as playReminderSound, b as showDesktopNotification } from "./reminder-sounds-CO-4eTIZ.mjs";
import { T as TooltipProvider, a as Tooltip, b as TooltipTrigger, c as TooltipContent } from "./tooltip-BG9UXFMb.mjs";
import { u as useEmployeePresence } from "./useEmployeePresence-CFzdQNvG.mjs";
import { T as TelephonyPanel, f as fmtDuration } from "./TelephonyPanel-D6XzoNFj.mjs";
import { b as browserPhone } from "./browser-phone-bus-CwJqzKkc.mjs";
import { c as cleanDialInput, d as dialTarget } from "./wrapup-DFQBFJJL.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { W as PhoneIncoming, P as Phone, Y as PhoneOff, Z as Bell, _ as BellOff, $ as Headset, X, a0 as MicOff, a1 as Mic, a2 as Play, a3 as Pause, a4 as Grid3x3, a5 as Volume2, a6 as Delete, a7 as LayoutDashboard, I as Inbox, a8 as ShoppingBag, J as Users, K as LifeBuoy, a9 as MessageSquareWarning, aa as UserCog, ab as GraduationCap, ac as CircleUserRound, Q as FileText, ad as Eye, ae as ListChecks, a as Mail, G as Globe, B as Briefcase, af as Receipt, ag as CreditCard, ah as Banknote, ai as Award, aj as ChartColumn, e as ShieldAlert, ak as History, al as ScrollText, am as Activity, w as ShieldCheck, b as MessageCircle, an as Settings, M as Menu, ao as Sparkles, R as RefreshCw, ap as LogOut, v as Search, L as LoaderCircle, aq as EyeOff, i as Flame, j as Server, A as ArrowRight, N as PhoneCall } from "../_libs/lucide-react.mjs";
import { o as object, s as string, n as number } from "../_libs/zod.mjs";
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
import "../_libs/radix-ui__react-tooltip.mjs";
const ThemeCtx = reactExports.createContext({ theme: "light", toggle: () => {
} });
const KEY = "admin-theme";
function AdminThemeProvider({ children }) {
  const [theme, setTheme] = reactExports.useState("light");
  reactExports.useEffect(() => {
    const stored = typeof window !== "undefined" && localStorage.getItem(KEY);
    const initial = stored ?? "light";
    setTheme(initial);
  }, []);
  reactExports.useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    try {
      localStorage.setItem(KEY, theme);
    } catch {
    }
  }, [theme]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeCtx.Provider, { value: { theme, toggle: () => setTheme((t) => t === "dark" ? "light" : "dark") }, children });
}
const url = "/__l5e/assets-v1/8fb081ee-8519-4055-997d-61c10da9056c/bhs-logo.png";
const bhsLogo = {
  url
};
const Command = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e,
  {
    ref,
    className: cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    ),
    ...props
  }
));
Command.displayName = _e.displayName;
const CommandDialog = ({ children, ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "overflow-hidden p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Command, { className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5", children }) }) });
};
const CommandInput = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center border-b px-3", "cmdk-input-wrapper": "", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    _e.Input,
    {
      ref,
      className: cn(
        "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props
    }
  )
] }));
CommandInput.displayName = _e.Input.displayName;
const CommandList = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e.List,
  {
    ref,
    className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
    ...props
  }
));
CommandList.displayName = _e.List.displayName;
const CommandEmpty = reactExports.forwardRef((props, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(_e.Empty, { ref, className: "py-6 text-center text-sm", ...props }));
CommandEmpty.displayName = _e.Empty.displayName;
const CommandGroup = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e.Group,
  {
    ref,
    className: cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    ),
    ...props
  }
));
CommandGroup.displayName = _e.Group.displayName;
const CommandSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e.Separator,
  {
    ref,
    className: cn("-mx-1 h-px bg-border", className),
    ...props
  }
));
CommandSeparator.displayName = _e.Separator.displayName;
const CommandItem = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className
    ),
    ...props
  }
));
CommandItem.displayName = _e.Item.displayName;
const globalSearch = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => d).handler(createSsrRpc("2d26bf8c5f184ba93641072c9b44eb0595bbfbc2205945769a060fa190880939"));
const QUICK_NAV = [
  { to: "/admin/my-work", label: "My Work", icon: LayoutDashboard, group: "Go to", shortcut: "g w" },
  { to: "/admin/dashboard", label: "Executive Dashboard", icon: LayoutDashboard, group: "Go to", shortcut: "g d" },
  { to: "/admin/notifications", label: "Notifications", icon: Mail, group: "Go to" },
  { to: "/admin/customers", label: "Customer Directory", icon: Users, group: "Go to", shortcut: "g c" },
  { to: "/admin/leads", label: "Leads", icon: Users, group: "Go to", shortcut: "g l" },
  { to: "/admin/pipeline", label: "Application Pipeline", icon: FileText, group: "Applications" },
  { to: "/admin/applications", label: "Application Queue", icon: FileText, group: "Applications", shortcut: "g a" },
  { to: "/admin/review", label: "Document Review", icon: FileText, group: "Applications" },
  { to: "/admin/submissions", label: "Submissions", icon: FileText, group: "Applications" },
  { to: "/admin/tasks", label: "Tasks", icon: Activity, group: "Operations" },
  { to: "/admin/support/tickets", label: "Support Tickets", icon: LifeBuoy, group: "Operations", shortcut: "g t" },
  { to: "/admin/complaints", label: "Complaints", icon: MessageSquareWarning, group: "Operations" },
  { to: "/admin/certificates", label: "Certificates", icon: Award, group: "Operations" },
  { to: "/admin/services", label: "Service Catalog", icon: Briefcase, group: "Services" },
  { to: "/admin/finance", label: "Revenue Dashboard", icon: Receipt, group: "Finance" },
  { to: "/admin/finance/gst", label: "GST Reports", icon: Receipt, group: "Finance" },
  { to: "/admin/finance/settlements", label: "Settlements", icon: Receipt, group: "Finance" },
  { to: "/admin/emails", label: "Email Center", icon: Mail, group: "Communications" },
  { to: "/admin/employees", label: "Employees", icon: UserCog, group: "People" },
  { to: "/admin/gateways", label: "Payment Gateways", icon: CreditCard, group: "System" },
  { to: "/admin/activity", label: "Activity Logs", icon: Activity, group: "System" },
  { to: "/admin/audit", label: "Audit Logs", icon: ShieldCheck, group: "System" },
  { to: "/admin/seo", label: "SEO Pages", icon: Settings, group: "System" }
];
function CommandPalette({ open, onOpenChange }) {
  const navigate = useNavigate();
  const search = useServerFn(globalSearch);
  const [q, setQ] = reactExports.useState("");
  const [hits, setHits] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (!open) {
      setQ("");
      setHits([]);
      return;
    }
  }, [open]);
  reactExports.useEffect(() => {
    if (q.trim().length < 2) {
      setHits([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const r = await search({ data: { q } });
        setHits(r.hits);
      } catch {
      }
    }, 200);
    return () => clearTimeout(t);
  }, [q, search]);
  const go = reactExports.useCallback((href) => {
    onOpenChange(false);
    navigate({ to: href });
  }, [navigate, onOpenChange]);
  const grouped = QUICK_NAV.reduce((acc, n) => {
    (acc[n.group] ||= []).push(n);
    return acc;
  }, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandDialog, { open, onOpenChange, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CommandInput,
      {
        placeholder: "Search orders, leads, invoices… or jump to a page",
        value: q,
        onValueChange: setQ
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandList, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CommandEmpty, { children: "No results." }),
      hits.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CommandGroup, { heading: "Results", children: hits.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandItem, { value: `${h.kind}-${h.title}-${h.id}`, onSelect: () => go(h.href), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(KindIcon, { kind: h.kind }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: h.title }),
          h.subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs opacity-60", children: h.subtitle })
        ] }, `${h.kind}-${h.id}`)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CommandSeparator, {})
      ] }),
      Object.entries(grouped).map(([group, items]) => /* @__PURE__ */ jsxRuntimeExports.jsx(CommandGroup, { heading: group, children: items.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandItem, { value: `${group}-${n.label}`, onSelect: () => go(n.to), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(n.icon, { className: "size-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: n.label }),
        n.shortcut && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-[10px] opacity-50", children: n.shortcut })
      ] }, n.to)) }, group))
    ] })
  ] });
}
function KindIcon({ kind }) {
  const map = {
    customer: Users,
    lead: Users,
    application: FileText,
    invoice: Receipt,
    certificate: Award,
    complaint: MessageSquareWarning,
    ticket: LifeBuoy
  };
  const Icon = map[kind] || FileText;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" });
}
const ROUTES = {
  d: "/admin/dashboard",
  c: "/admin/customers",
  l: "/admin/leads",
  a: "/admin/applications",
  s: "/admin/services",
  e: "/admin/users",
  t: "/admin/complaints",
  f: "/admin/finance/gst"
};
function useKeyboardShortcuts(openPalette, openHelp) {
  const navigate = useNavigate();
  const lastG = reactExports.useRef(0);
  reactExports.useEffect(() => {
    function isTyping(t) {
      const el = t;
      if (!el) return false;
      const tag = el.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
    }
    function onKey(e) {
      if (isTyping(e.target)) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openPalette();
        return;
      }
      if (e.key === "?") {
        e.preventDefault();
        return;
      }
      if (e.key.toLowerCase() === "g") {
        lastG.current = Date.now();
        return;
      }
      if (Date.now() - lastG.current < 1200) {
        const route = ROUTES[e.key.toLowerCase()];
        if (route) {
          e.preventDefault();
          lastG.current = 0;
          navigate({ to: route });
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, openPalette, openHelp]);
}
function useNewLeadsWatcher() {
  const [unseen, setUnseen] = reactExports.useState(0);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { notify } = useNotifications();
  const qc = useQueryClient();
  const role = useRole();
  const userPerms = usePermissions();
  const isSuperAdmin = role.has("super_admin");
  const isManager = role.has("manager");
  const isAdm = isSuperAdmin || role.has("admin") && !isManager;
  const isLoaded = !role.loading && !userPerms.isLoading;
  const canSeeLeads = isLoaded && (isAdm || isManager || role.can("leads") && userPerms.can("leads", "view"));
  const canSeeOrders = isLoaded && (isAdm || isManager || role.can("orders") && userPerms.can("orders", "view"));
  const livePermsRef = reactExports.useRef({
    isSuperAdmin,
    isManager,
    isAdmin: isAdm,
    canSeeLeads,
    canSeeOrders,
    rolesLoading: !isLoaded
  });
  reactExports.useEffect(() => {
    livePermsRef.current = {
      isSuperAdmin,
      isManager,
      isAdmin: isAdm,
      canSeeLeads,
      canSeeOrders,
      rolesLoading: !isLoaded
    };
  }, [isSuperAdmin, isManager, isAdm, canSeeLeads, canSeeOrders, isLoaded]);
  const notifiedKeysRef = reactExports.useRef(/* @__PURE__ */ new Map());
  reactExports.useEffect(() => {
    if (path.startsWith("/admin/leads")) setUnseen(0);
  }, [path]);
  reactExports.useEffect(() => {
    let cancelled = false;
    let channel = null;
    const invalidateLeadsData = () => {
      qc.invalidateQueries({ queryKey: ["admin.leads"] });
      qc.invalidateQueries({ queryKey: ["admin.leadCounts"] });
      qc.invalidateQueries({ queryKey: ["my-work"] });
    };
    const invalidateOrdersData = () => {
      qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
      qc.invalidateQueries({ queryKey: ["admin.orders"] });
      qc.invalidateQueries({ queryKey: ["my-work"] });
    };
    const triggerNotification = (dedupeKey, title, body, url2, kind = "lead") => {
      const now = Date.now();
      const lastTime = notifiedKeysRef.current.get(dedupeKey) ?? 0;
      if (now - lastTime < 1e4) return;
      notifiedKeysRef.current.set(dedupeKey, now);
      for (const [k, t] of notifiedKeysRef.current.entries()) {
        if (now - t > 6e4) notifiedKeysRef.current.delete(k);
      }
      if (kind === "lead") {
        setUnseen((n) => n + 1);
        invalidateLeadsData();
      } else {
        invalidateOrdersData();
      }
      if (kind === "lead") return;
      const soundEnabled = localStorage.getItem("udyam.sound.orders") !== "false";
      if (soundEnabled) {
        playNotificationSound(kind);
      }
      notify({ title, body, url: url2, tag: dedupeKey });
      const toastEnabled = localStorage.getItem("udyam.toast.orders") !== "false";
      if (toastEnabled) {
        toast.info(title, {
          description: body,
          duration: 6e3,
          action: { label: "View Details", onClick: () => {
            window.location.href = url2;
          } }
        });
      }
    };
    (async () => {
      const { data } = await supabase.auth.getUser();
      const uid = data.user?.id;
      if (!uid || cancelled) return;
      const topic = `user:${uid}:crm:watcher:${Math.random().toString(36).slice(2)}`;
      channel = supabase.channel(topic).on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        () => {
          invalidateLeadsData();
        }
      ).on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "leads" },
        (payload) => {
          const { isAdmin: isAdm2, canSeeLeads: canLeads, rolesLoading } = livePermsRef.current;
          if (rolesLoading || !canLeads) return;
          const lead = payload.new ?? {};
          if (!isAdm2 && lead.assigned_to !== uid) return;
          const dedupeKey = lead.id ? `lead-${lead.id}` : `lead-${lead.name}-${lead.phone}`;
          const title = "🔔 New lead received!";
          const body = [lead.name || lead.full_name, lead.service_slug, lead.phone].filter(Boolean).join(" · ") || "Open the leads queue";
          const url2 = lead.id ? `/admin/leads/${lead.id}` : "/admin/leads";
          triggerNotification(dedupeKey, title, body, url2, "lead");
        }
      ).on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "leads" },
        (payload) => {
          const { canSeeLeads: canLeads, rolesLoading } = livePermsRef.current;
          if (rolesLoading || !canLeads) return;
          const newLead = payload.new ?? {};
          const oldLead = payload.old ?? {};
          invalidateLeadsData();
          if (newLead.assigned_to === uid && oldLead.assigned_to !== uid) {
            const dedupeKey = newLead.id ? `lead-assigned-${newLead.id}` : `lead-assigned-${Date.now()}`;
            const title = "🎯 Lead Assigned to You";
            const body = `Lead ${newLead.name || newLead.full_name || newLead.lead_code || ""} is now assigned to your queue.`;
            const url2 = newLead.id ? `/admin/leads/${newLead.id}` : "/admin/leads";
            triggerNotification(dedupeKey, title, body, url2, "lead");
          }
        }
      ).on(
        "postgres_changes",
        { event: "*", schema: "public", table: "applications" },
        () => {
          invalidateOrdersData();
        }
      ).on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "applications" },
        (payload) => {
          const { isSuperAdmin: isSuper, isManager: isMgr, canSeeOrders: canOrders, rolesLoading } = livePermsRef.current;
          if (rolesLoading || !canOrders) return;
          const app = payload.new ?? {};
          if (isMgr || !isSuper) {
            if (app.assigned_to !== uid) return;
          }
          const dedupeKey = app.id ? `app-${app.id}` : `app-${Date.now()}`;
          const title = "🔔 New Order Received!";
          const body = `Order ${app.application_code || ""} has arrived in the system.`;
          const url2 = app.id ? `/admin/orders/${app.id}` : "/admin/orders";
          triggerNotification(dedupeKey, title, body, url2, "order");
        }
      ).on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "applications" },
        (payload) => {
          const { canSeeOrders: canOrders, rolesLoading } = livePermsRef.current;
          if (rolesLoading || !canOrders) return;
          const newApp = payload.new ?? {};
          const oldApp = payload.old ?? {};
          invalidateOrdersData();
          if (newApp.assigned_to === uid && oldApp.assigned_to !== uid) {
            const dedupeKey = newApp.id ? `order-assigned-${newApp.id}` : `order-assigned-${Date.now()}`;
            const title = "🎯 Order Assigned to You";
            const body = `Order ${newApp.application_code || ""} is now assigned to your queue.`;
            const url2 = newApp.id ? `/admin/orders/${newApp.id}` : "/admin/orders";
            triggerNotification(dedupeKey, title, body, url2, "order");
          }
        }
      ).on(
        "postgres_changes",
        { event: "*", schema: "public", table: "onboarding_submissions" },
        () => {
          invalidateLeadsData();
        }
      ).on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${uid}` },
        (payload) => {
          const notif = payload.new ?? {};
          qc.invalidateQueries({ queryKey: ["notifications"] });
          qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
          const { canSeeOrders: canOrders, canSeeLeads: canLeads, rolesLoading } = livePermsRef.current;
          if (notif.kind === "order_assigned") {
            if (rolesLoading || !canOrders) return;
            const dedupeKey = notif.entity_id ? `order-assigned-${notif.entity_id}` : `notif-${notif.id}`;
            const title = notif.title || "🎯 Order Assigned to You";
            const body = notif.body || "A new order has been assigned to your queue.";
            const url2 = notif.href || "/admin/orders";
            triggerNotification(dedupeKey, title, body, url2, "order");
          } else if (notif.kind === "lead_assigned" || notif.kind === "new_lead") {
            if (rolesLoading || !canLeads) return;
            const dedupeKey = notif.entity_id ? `lead-assigned-${notif.entity_id}` : `notif-${notif.id}`;
            const title = notif.title || "🎯 Lead Assigned to You";
            const body = notif.body || "A new lead has been assigned to your queue.";
            const url2 = notif.href || "/admin/leads";
            triggerNotification(dedupeKey, title, body, url2, "lead");
          }
        }
      ).subscribe();
    })();
    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, [notify, qc]);
  return { unseen };
}
function NotificationsOptIn() {
  const { supported, canPrompt, dismissed, request, dismissBanner, notify, granted } = useNotifications();
  if (!supported || dismissed || granted || !canPrompt) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "mb-4 flex items-center gap-3 rounded-xl border px-4 py-3",
      style: { background: "var(--admin-accent-soft)", borderColor: "var(--admin-border)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "size-4 shrink-0", style: { color: "var(--admin-primary)" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", style: { color: "var(--admin-fg)" }, children: "Turn on desktop notifications" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs", style: { color: "var(--admin-fg-muted)" }, children: "Get notified instantly when new leads come in — even when this tab is in the background." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: async () => {
              const result = await request();
              if (result === "granted") {
                notify({ title: "Notifications enabled", body: "You'll get a ping for new leads.", tag: "welcome" });
              }
            },
            className: "rounded-md px-3 py-1.5 text-xs font-medium text-white",
            style: { background: "var(--admin-primary)" },
            children: "Enable"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: dismissBanner,
            className: "rounded-md p-1.5 hover:bg-[var(--admin-surface-2)]",
            "aria-label": "Dismiss",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5", style: { color: "var(--admin-fg-muted)" } })
          }
        )
      ]
    }
  );
}
const NOTIFIED_STORAGE_KEY = "bhs.notified.reminders.v2";
function loadNotifiedIds() {
  if (typeof window === "undefined") return /* @__PURE__ */ new Set();
  try {
    const raw = localStorage.getItem(NOTIFIED_STORAGE_KEY);
    if (!raw) return /* @__PURE__ */ new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return /* @__PURE__ */ new Set();
  }
}
function saveNotifiedId(id) {
  if (typeof window === "undefined" || !id) return;
  try {
    const current = loadNotifiedIds();
    current.add(id);
    const arr = Array.from(current).slice(-500);
    localStorage.setItem(NOTIFIED_STORAGE_KEY, JSON.stringify(arr));
  } catch {
  }
}
function ReminderNotificationManager() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const getSummaryFn = useServerFn(getDueRemindersSummary);
  const getSoundSettingsFn = useServerFn(getGlobalReminderSoundSettings);
  const notifiedIdsRef = reactExports.useRef(loadNotifiedIds());
  const scheduledTimeoutsRef = reactExports.useRef(/* @__PURE__ */ new Map());
  const isInitialLoadRef = reactExports.useRef(true);
  const { data: globalSound } = useQuery({
    queryKey: ["global-reminder-sound-settings"],
    queryFn: () => getSoundSettingsFn(),
    staleTime: 5 * 6e4,
    refetchInterval: 10 * 6e4
  });
  reactExports.useEffect(() => {
    if (globalSound) {
      syncGlobalSoundSettings({
        enabled: globalSound.enabled,
        tone: globalSound.tone,
        volume: globalSound.volume,
        desktopNotifications: globalSound.desktopNotifications,
        customAudioUrl: globalSound.customAudioUrl,
        customAudioName: globalSound.customAudioName
      });
      if (globalSound.customAudioUrl) {
        preloadAudio(globalSound.customAudioUrl);
      }
    }
  }, [globalSound]);
  const triggerDueAlert = (reminder) => {
    if (!reminder.id || notifiedIdsRef.current.has(reminder.id)) return;
    notifiedIdsRef.current.add(reminder.id);
    saveNotifiedId(reminder.id);
    playReminderSound(
      globalSound?.tone,
      globalSound?.volume,
      globalSound?.customAudioUrl
    );
    qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
    qc.invalidateQueries({ queryKey: ["active-order-callback"] });
    qc.invalidateQueries({ queryKey: ["due-reminders-summary"] });
    qc.invalidateQueries({ queryKey: ["orders-v2"] });
    const isTechDelay = reminder.remarks?.channel === "technical_delay";
    const reasonText = reminder.remarks?.reasonLabel || (isTechDelay ? "Technical Delay Follow-Up" : "Customer Follow-Up");
    const customerInfo = `${reminder.customer_name} ${reminder.customer_mobile ? `(${reminder.customer_mobile})` : ""}`.trim();
    const orderCode = reminder.application_code || "Order";
    showDesktopNotification(
      `🔥 Hot Order: ${isTechDelay ? "Technical Delay Reminder Due!" : "Callback Due Now!"}`,
      {
        body: `${orderCode} · ${customerInfo} · Reason: ${reasonText}`
      },
      `/admin/orders/${reminder.application_id}`
    );
    toast.custom(
      (t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-full max-w-md items-start justify-between gap-3 rounded-2xl border-2 border-rose-500 bg-gradient-to-br from-rose-950 via-rose-900 to-slate-900 p-4 text-white shadow-2xl animate-in slide-in-from-top-4 duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid size-11 shrink-0 place-items-center rounded-xl bg-rose-500/30 border border-rose-400/50 text-rose-300 shadow-inner", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-6 animate-bounce text-rose-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-rose-600 px-2 py-0.5 text-[10px] font-black uppercase text-white shadow-xs tracking-wider", children: "🔥 HOT ORDER NOW" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-slate-200", children: orderCode })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold text-white", children: customerInfo }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-rose-200 font-medium", children: [
            "Reason: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-white", children: reasonText })
          ] }),
          reminder.remarks?.note && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-slate-300 italic line-clamp-2", children: [
            '"',
            reminder.remarks.note,
            '"'
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                toast.dismiss(t);
                if (reminder.application_id) {
                  navigate({ to: `/admin/orders/${reminder.application_id}` });
                }
              },
              className: "inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-1.5 text-xs font-bold text-slate-900 shadow-md hover:bg-slate-100 transition cursor-pointer",
              children: isTechDelay ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { className: "size-3.5 text-rose-600" }),
                " Open & View Technical Delay ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-3" })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneCall, { className: "size-3.5 text-rose-600" }),
                " Open & Call Customer ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-3" })
              ] })
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => toast.dismiss(t),
            className: "grid size-6 place-items-center rounded-md text-slate-400 hover:bg-white/10 hover:text-white transition cursor-pointer",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" })
          }
        )
      ] }),
      {
        duration: 45e3,
        // Stay visible for 45s
        id: `due-reminder-${reminder.id}`
      }
    );
  };
  useRealtimeTable("order_schedulers", () => {
    qc.invalidateQueries({ queryKey: ["due-reminders-summary"] });
    qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
    qc.invalidateQueries({ queryKey: ["active-order-callback"] });
  });
  const { data } = useQuery({
    queryKey: ["due-reminders-summary"],
    queryFn: () => getSummaryFn({ data: {} }),
    refetchInterval: 6e4,
    refetchIntervalInBackground: false,
    staleTime: 3e4
  });
  reactExports.useEffect(() => {
    if (!data) return;
    const dueList = data.dueReminders ?? [];
    const upcomingList = data.upcomingReminders ?? [];
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      for (const reminder of dueList) {
        if (reminder.id) {
          notifiedIdsRef.current.add(reminder.id);
          saveNotifiedId(reminder.id);
        }
      }
    } else {
      for (const reminder of dueList) {
        if (reminder.id && !notifiedIdsRef.current.has(reminder.id)) {
          triggerDueAlert(reminder);
        }
      }
    }
    for (const upcoming of upcomingList) {
      if (!upcoming.id || !upcoming.fires_at) continue;
      if (notifiedIdsRef.current.has(upcoming.id)) continue;
      if (scheduledTimeoutsRef.current.has(upcoming.id)) continue;
      const diffMs = new Date(upcoming.fires_at).getTime() - Date.now();
      if (diffMs <= 0) {
        triggerDueAlert(upcoming);
      } else if (diffMs <= 24 * 60 * 6e4) {
        const timerId = setTimeout(() => {
          scheduledTimeoutsRef.current.delete(upcoming.id);
          triggerDueAlert(upcoming);
        }, diffMs);
        scheduledTimeoutsRef.current.set(upcoming.id, timerId);
      }
    }
    return () => {
    };
  }, [data]);
  return null;
}
function DashboardPrivacyToggle({ className }) {
  const { isPrivacyEnabled, togglePrivacy } = useDashboardPrivacy();
  const role = useRole();
  const userPerms = usePermissions();
  const isSuperAdmin = role.has("super_admin") || role.has("super");
  const isAdminUser = isSuperAdmin || role.has("admin") || Boolean(userPerms.perms?.isAdmin);
  if (!isAdminUser) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { delayDuration: 150, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: togglePrivacy,
        "aria-label": isPrivacyEnabled ? "Reveal dashboard and order values" : "Hide dashboard and order values",
        "aria-pressed": isPrivacyEnabled,
        className: cn(
          "relative size-8 inline-flex items-center justify-center rounded-lg border transition-all duration-150 cursor-pointer select-none shrink-0 shadow-2xs active:scale-95",
          isPrivacyEnabled ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:border-amber-400 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-200" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
          className
        ),
        children: isPrivacyEnabled ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "size-4 text-amber-600 dark:text-amber-400 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-0.5 -right-0.5 size-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-4 text-slate-500 dark:text-slate-400 shrink-0" })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { side: "bottom", align: "end", className: "text-xs", children: isPrivacyEnabled ? "Values Hidden — Click to reveal" : "Hide values & KPI counts" })
  ] }) });
}
const ALL_STAFF_ROLES = ["admin", "super_admin", "manager", "operations", "executive", "support", "finance", "accounts"];
const FINANCE_ROLES = ["admin", "super_admin", "finance", "accounts"];
const SUPPORT_ROLES = ["admin", "super_admin", "support"];
const ADMIN_ROLES = ["admin", "super_admin"];
const NAV = [
  {
    id: "overview",
    label: "Overview",
    items: [
      { to: "/admin/dashboard", label: "Executive Dashboard", icon: LayoutDashboard, module: "dashboard", requireAnyRole: ADMIN_ROLES },
      { to: "/admin/my-work", label: "My Dashboard", icon: Inbox },
      { to: "/admin/orders", label: "Orders", icon: ShoppingBag, module: "orders", requireAnyRole: ALL_STAFF_ROLES },
      { to: "/admin/team-orders", label: "Team Orders", icon: Users, module: "orders", requireAnyRole: ["admin", "super_admin", "manager"] },
      { to: "/admin/tickets", label: "Support Tickets", icon: LifeBuoy, module: "tickets", requireAnyRole: SUPPORT_ROLES },
      { to: "/admin/complaints", label: "Complaints & Contact Forms", icon: MessageSquareWarning, module: "complaints", requireAnyRole: SUPPORT_ROLES },
      { to: "/admin/employees", label: "Employees", icon: UserCog, module: "employees", requireAnyRole: ADMIN_ROLES }
    ]
  },
  {
    id: "work",
    label: "Work",
    items: [
      { to: "/admin/leads", label: "Leads", icon: Users, module: "leads", requireAnyRole: ADMIN_ROLES },
      { to: "/admin/training", label: "Training", icon: GraduationCap, requireAnyRole: ALL_STAFF_ROLES },
      { to: "/admin/customers", label: "Customers", icon: CircleUserRound, module: "customers", requireAnyRole: ADMIN_ROLES },
      { to: "/admin/documents", label: "Documents", icon: FileText, module: "documents", requireAnyRole: ADMIN_ROLES },
      { to: "/admin/review", label: "Doc Review", icon: Eye, module: "documents", requireAnyRole: ADMIN_ROLES },
      { to: "/admin/tasks", label: "Tasks", icon: ListChecks, module: "tasks", requireAnyRole: ADMIN_ROLES }
    ]
  },
  {
    id: "service",
    label: "Service",
    items: [
      { to: "/admin/canned-responses", label: "Canned Responses", icon: LifeBuoy, module: "tickets", requireAnyRole: SUPPORT_ROLES },
      { to: "/admin/quarantine", label: "Email Quarantine", icon: Mail, module: "tickets", requireAnyRole: SUPPORT_ROLES },
      { to: "/admin/websites", label: "Websites", icon: Globe, requireAnyRole: ADMIN_ROLES },
      { to: "/admin/services", label: "Services", icon: Briefcase, requireAnyRole: ADMIN_ROLES }
    ]
  },
  {
    id: "finance",
    label: "Finance",
    items: [
      { to: "/admin/invoices", label: "Invoices", icon: Receipt, module: "invoices", requireAnyRole: FINANCE_ROLES },
      { to: "/admin/zoho-export", label: "Zoho Export", icon: Receipt, module: "invoices", requireAnyRole: FINANCE_ROLES },
      { to: "/admin/payments", label: "Payments", icon: CreditCard, module: "payments", requireAnyRole: FINANCE_ROLES },
      { to: "/admin/payment-audit", label: "Payment Audit", icon: CreditCard, module: "payments", requireAnyRole: FINANCE_ROLES },
      { to: "/admin/gateways", label: "Gateways", icon: Banknote, module: "payments", requireAnyRole: ADMIN_ROLES },
      { to: "/admin/finance", label: "Finance (GST)", icon: Banknote, module: "payments", requireAnyRole: FINANCE_ROLES },
      { to: "/admin/refunds", label: "Refund Review", icon: Banknote, requireAnyRole: FINANCE_ROLES },
      { to: "/admin/certificates", label: "Certificates", icon: Award, requireAnyRole: ADMIN_ROLES }
    ]
  },
  {
    id: "insights",
    label: "Insights",
    items: [
      { to: "/admin/reports", label: "Reports", icon: ChartColumn, module: "reports", requireAnyRole: ADMIN_ROLES },
      { to: "/admin/dispute-manager", label: "Dispute Manager", icon: ShieldAlert, requireAnyRole: SUPPORT_ROLES },
      { to: "/admin/performance", label: "Employee Performance", icon: ChartColumn, requireAnyRole: ADMIN_ROLES },
      { to: "/admin/attendance", label: "Attendance & Payroll", icon: History, requireAnyRole: ADMIN_ROLES },
      { to: "/admin/audit", label: "Audit Log", icon: ScrollText, module: "audit_log", requireAnyRole: ADMIN_ROLES },
      { to: "/admin/seo", label: "SEO", icon: Globe, requireAnyRole: ADMIN_ROLES }
    ]
  },
  {
    id: "admin",
    label: "System",
    items: [
      { to: "/admin/assignment-history", label: "Assignment & Leaves", icon: History, requireAnyRole: ADMIN_ROLES },
      { to: "/admin/live-calls", label: "Live Calls", icon: Activity, requireAnyRole: ADMIN_ROLES },
      { to: "/admin/sessions", label: "Sessions & Security", icon: ShieldAlert, requireAnyRole: ADMIN_ROLES },
      { to: "/admin/users", label: "Users & Roles", icon: ShieldCheck, module: "employees", requireAnyRole: ADMIN_ROLES },
      { to: "/admin/permissions", label: "Permissions", icon: ShieldCheck, requireAnyRole: ADMIN_ROLES },
      { to: "/admin/emails", label: "Email System", icon: Mail, requireAnyRole: ADMIN_ROLES },
      { to: "/admin/email-templates", label: "Email Templates", icon: Mail, module: "email_templates", requireAnyRole: ADMIN_ROLES },
      { to: "/admin/whatsapp-templates", label: "WhatsApp Templates", icon: MessageCircle, requireAnyRole: ADMIN_ROLES },
      { to: "/admin/super", label: "Super Admin", icon: ShieldAlert, requireRole: "super_admin" },
      { to: "/admin/settings", label: "Settings", icon: Settings, requireAnyRole: ADMIN_ROLES }
    ]
  }
];
NAV.flatMap((g) => g.items);
function AdminShell({ children, email }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminThemeProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shell, { email, children }) });
}
function Shell({ children, email }) {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const role = useRole();
  const userPerms = usePermissions();
  const [mobileOpen, setMobileOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setMobileOpen(false);
  }, [path]);
  const isSuperAdmin = role.has("super_admin") || role.has("super");
  const isAdminUser = isSuperAdmin || role.has("admin") || Boolean(userPerms.perms?.isAdmin);
  const visibleNav = NAV.map((g) => ({
    ...g,
    items: g.items.filter((it) => {
      if (isAdminUser) {
        if (it.requireRole === "super_admin" && !isSuperAdmin) return false;
        return true;
      }
      if (it.requireRole && !role.has(it.requireRole)) return false;
      if (it.requireAnyRole && !it.requireAnyRole.some((r) => role.has(r))) return false;
      if (it.module) {
        if (userPerms.can(it.module, "view")) return true;
        if (role.can(it.module)) return true;
        return false;
      }
      return true;
    })
  })).filter((g) => g.items.length > 0);
  const defaultEmployeeNav = [
    {
      id: "overview",
      label: "Overview",
      items: [
        { to: "/admin/my-work", label: "My Dashboard", icon: Inbox }
      ]
    },
    {
      id: "work",
      label: "Work",
      items: [
        { to: "/admin/orders", label: "Orders", icon: ShoppingBag, module: "orders" },
        { to: "/admin/training", label: "Training", icon: GraduationCap }
      ]
    }
  ];
  const displayNav = visibleNav.length > 0 ? visibleNav : defaultEmployeeNav;
  const flatVisible = displayNav.flatMap((g) => g.items);
  const [paletteOpen, setPaletteOpen] = reactExports.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = reactExports.useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("bhs.admin.sidebarCollapsed") === "1";
  });
  reactExports.useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("bhs.admin.sidebarCollapsed", sidebarCollapsed ? "1" : "0");
  }, [sidebarCollapsed]);
  const { unseen: newLeads } = useNewLeadsWatcher();
  const fetchSidebarCounts = useServerFn(getSidebarNotificationCounts);
  const { data: sidebarCounts } = useQuery({
    queryKey: ["sidebar-notification-counts"],
    queryFn: () => fetchSidebarCounts(),
    refetchInterval: 12e4,
    refetchIntervalInBackground: false,
    staleTime: 6e4
  });
  const CLEARABLE_PATHS = reactExports.useMemo(
    () => [
      "/admin/orders",
      "/admin/review",
      "/admin/tasks",
      "/admin/complaints",
      "/admin/tickets",
      "/admin/quarantine",
      "/admin/refunds"
    ],
    []
  );
  const currentPath = path ?? "";
  const [visitedPaths, setVisitedPaths] = reactExports.useState(() => /* @__PURE__ */ new Set());
  reactExports.useEffect(() => {
    if (!currentPath) return;
    const matched = CLEARABLE_PATHS.find(
      (p) => currentPath === p || currentPath.startsWith(p + "/")
    );
    if (matched) {
      setVisitedPaths((prev) => {
        if (prev.has(matched)) return prev;
        const next = new Set(prev);
        next.add(matched);
        return next;
      });
    }
  }, [currentPath, CLEARABLE_PATHS]);
  const getSidebarBadge = (to) => {
    if (to === "/admin/notifications") return 0;
    if (to === "/admin/leads") return newLeads > 0 ? newLeads : 0;
    if (visitedPaths.has(to)) return 0;
    if (!sidebarCounts) return 0;
    if (to === "/admin/orders") return sidebarCounts.orders;
    if (to === "/admin/review") return sidebarCounts.docReview;
    if (to === "/admin/tasks") return sidebarCounts.tasks;
    if (to === "/admin/complaints") return sidebarCounts.complaints;
    if (to === "/admin/tickets") return sidebarCounts.tickets;
    if (to === "/admin/quarantine") return sidebarCounts.quarantine;
    if (to === "/admin/refunds") return sidebarCounts.refunds;
    return 0;
  };
  useKeyboardShortcuts(() => setPaletteOpen(true), () => {
  });
  const isActive = (to) => !!currentPath && (currentPath === to || to !== "/admin/dashboard" && currentPath.startsWith(to + "/"));
  const renderNavLinks = (isMobile = false) => /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex-1 overflow-y-auto py-3 px-2", children: [
    displayNav.map((group, gi) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      gi > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-2 mx-2 h-px", style: { background: "var(--admin-border)" } }),
      (!sidebarCollapsed || isMobile) && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "px-2.5 pt-1 pb-1 text-[10px] uppercase tracking-wider",
          style: { color: "var(--admin-sidebar-muted)" },
          children: group.label
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-0.5", children: group.items.map((n) => {
        const active = isActive(n.to);
        const Icon = n.icon;
        const badge = getSidebarBadge(n.to);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: n.to,
            onClick: () => {
              if (isMobile) setMobileOpen(false);
              if (n.to === "/admin/orders") {
                clearModuleFilterState("admin.orders");
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("reset-orders-filters"));
                }
              }
              if (n.to === "/admin/team-orders") {
                clearModuleFilterState("admin.team-orders");
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("reset-orders-filters"));
                }
              }
            },
            title: sidebarCollapsed && !isMobile ? `${n.label}${badge > 0 ? ` (${badge} new)` : ""}` : void 0,
            className: cn(
              "relative flex items-center gap-2.5 rounded-md py-1.5 text-[13px] transition-colors",
              sidebarCollapsed && !isMobile ? "justify-center px-1.5" : "px-2.5"
            ),
            style: {
              background: active ? "var(--admin-accent-soft)" : "transparent",
              color: active ? "var(--admin-primary)" : "var(--admin-sidebar-fg)",
              fontWeight: active ? 500 : 400
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" }),
                sidebarCollapsed && !isMobile && badge > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "absolute -top-1 -right-1 size-2 rounded-full ring-2 ring-[var(--admin-sidebar)]",
                    style: { background: "var(--admin-danger)" }
                  }
                )
              ] }),
              (!sidebarCollapsed || isMobile) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate flex-1", children: n.label }),
              (!sidebarCollapsed || isMobile) && badge > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-semibold flex items-center justify-center shrink-0",
                  style: { background: "var(--admin-danger)", color: "#fff" },
                  children: badge > 99 ? "99+" : badge
                }
              )
            ]
          },
          n.to
        );
      }) })
    ] }, group.id)),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-2 mx-2 h-px", style: { background: "var(--admin-border)" } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: async () => {
          if (isMobile) setMobileOpen(false);
          try {
            window.sessionStorage.removeItem("crm_employee_session_id");
          } catch {
          }
          await supabase.auth.signOut({ scope: "local" });
          navigate({ to: "/admin-login" });
        },
        title: sidebarCollapsed && !isMobile ? "Logout" : void 0,
        className: cn(
          "w-full flex items-center gap-2.5 rounded-md py-1.5 text-[13px] transition-colors hover:bg-[var(--admin-surface-2)] cursor-pointer",
          sidebarCollapsed && !isMobile ? "justify-center px-1.5" : "px-2.5"
        ),
        style: { color: "var(--admin-sidebar-fg)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "size-4 shrink-0" }),
          (!sidebarCollapsed || isMobile) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: "Logout" })
        ]
      }
    )
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex w-full", style: { background: "var(--admin-bg)", color: "var(--admin-fg)" }, children: [
    mobileOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 md:hidden flex", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "fixed inset-0 bg-black/60 backdrop-blur-2xs transition-opacity",
          onClick: () => setMobileOpen(false)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "aside",
        {
          className: "relative flex flex-col w-[260px] max-w-[85vw] h-full shadow-2xl z-50 animate-in slide-in-from-left duration-200",
          style: {
            background: "var(--admin-sidebar)",
            color: "var(--admin-sidebar-fg)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between px-3.5 h-14 border-b shrink-0",
                style: { borderColor: "var(--admin-border)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: bhsLogo.url, alt: "Business Help Services", className: "size-8 rounded-md object-contain shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium leading-tight truncate", children: "Business Help" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider", style: { color: "var(--admin-sidebar-muted)" }, children: "ADMIN" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setMobileOpen(false),
                      className: "p-1.5 rounded-lg hover:bg-[var(--admin-surface-2)] text-[var(--admin-sidebar-fg)] cursor-pointer",
                      "aria-label": "Close sidebar",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5" })
                    }
                  )
                ]
              }
            ),
            renderNavLinks(true)
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "aside",
      {
        className: "hidden md:flex shrink-0 h-screen sticky top-0 flex-col border-r transition-[width] duration-200 z-30",
        style: {
          width: sidebarCollapsed ? 64 : 220,
          background: "var(--admin-sidebar)",
          color: "var(--admin-sidebar-fg)",
          borderColor: "var(--admin-border)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-2 px-3 h-14 border-b shrink-0",
              style: { borderColor: "var(--admin-border)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setSidebarCollapsed((v) => !v),
                    "aria-label": sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar",
                    className: "shrink-0 rounded-full p-2 hover:bg-[var(--admin-surface-2)] cursor-pointer",
                    style: { color: "var(--admin-sidebar-fg)" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "size-5" })
                  }
                ),
                !sidebarCollapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: bhsLogo.url, alt: "Business Help Services", className: "size-8 rounded-md object-contain shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium leading-tight truncate", children: "Business Help" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider", style: { color: "var(--admin-sidebar-muted)" }, children: "ADMIN" })
                  ] })
                ] })
              ]
            }
          ),
          renderNavLinks(false)
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 flex flex-col min-h-screen", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "header",
        {
          className: "sticky top-0 z-20 flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 md:px-6 h-14 border-b shrink-0",
          style: { background: "var(--admin-surface)", borderColor: "var(--admin-border)" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 md:hidden shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setMobileOpen(true),
                  "aria-label": "Open sidebar menu",
                  className: "p-1.5 rounded-lg hover:bg-[var(--admin-surface-2)] text-[var(--admin-fg)] cursor-pointer",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "size-5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none", style: { color: "var(--admin-primary)" }, children: "Business Help" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 max-w-2xl min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GlobalSearchInput, { onOpenPalette: () => setPaletteOpen(true) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 sm:gap-2 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationsBell, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserMenu, { email, onSignOut: async () => {
                try {
                  window.sessionStorage.removeItem("crm_employee_session_id");
                } catch {
                }
                await supabase.auth.signOut({ scope: "local" });
                navigate({ to: "/admin-login" });
              } }),
              isAdminUser && /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardPrivacyToggle, {})
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { id: "admin-main-scroll", className: "flex-1 min-w-0 p-4 md:p-6 pb-24 md:pb-6 w-full max-w-[1600px] mx-auto space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationsOptIn, {}),
        children
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "nav",
      {
        className: "md:hidden fixed bottom-0 inset-x-0 z-30 border-t flex items-stretch justify-around",
        style: { background: "var(--admin-surface)", borderColor: "var(--admin-border)" },
        children: flatVisible.slice(0, 6).map((n) => {
          const active = isActive(n.to);
          const Icon = n.icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: n.to,
              className: "flex-1 flex items-center justify-center py-2.5",
              style: {
                color: active ? "var(--admin-primary)" : "var(--admin-fg-muted)",
                background: active ? "var(--admin-accent-soft)" : "transparent"
              },
              "aria-label": n.label,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-5" })
            },
            n.to
          );
        })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CommandPalette, { open: paletteOpen, onOpenChange: setPaletteOpen }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ReminderNotificationManager, {})
  ] });
}
function GlobalSearchInput({ onOpenPalette }) {
  const [q, setQ] = reactExports.useState("");
  const [open, setOpen] = reactExports.useState(false);
  const search = useServerFn(globalSearch);
  const wrapRef = reactExports.useRef(null);
  const navigate = useNavigate();
  const { data, isFetching } = useQuery({
    queryKey: ["global-search", q],
    queryFn: () => search({ data: { q } }),
    enabled: q.trim().length >= 2,
    staleTime: 5e3
  });
  reactExports.useEffect(() => {
    function onClick(e) {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);
  const hits = data?.hits ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: wrapRef, className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-2 rounded-md border px-3 h-9",
        style: { borderColor: "var(--admin-border)", background: "var(--admin-surface-2)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 shrink-0", style: { color: "var(--admin-fg-muted)" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: q,
              onChange: (e) => {
                setQ(e.target.value);
                setOpen(true);
              },
              onFocus: () => q.length >= 2 && setOpen(true),
              onKeyDown: (e) => {
                if (e.key === "Escape") {
                  setOpen(false);
                  e.target.blur();
                }
              },
              placeholder: "Search orders, leads, mobiles, complaints, Udyam no…",
              className: "flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--admin-fg-subtle)]",
              "aria-label": "Global search"
            }
          ),
          isFetching && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 animate-spin", style: { color: "var(--admin-fg-muted)" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: onOpenPalette,
              className: "hidden sm:inline-flex rounded border px-1.5 py-0.5 text-[10px] font-mono",
              style: { borderColor: "var(--admin-border)", color: "var(--admin-fg-muted)" },
              "aria-label": "Open command palette",
              children: "⌘K"
            }
          )
        ]
      }
    ),
    open && q.trim().length >= 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute left-0 right-0 mt-1 rounded-md border max-h-[420px] overflow-y-auto z-40",
        style: { background: "var(--admin-surface)", borderColor: "var(--admin-border)" },
        children: hits.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-4 text-xs", style: { color: "var(--admin-fg-muted)" }, children: isFetching ? "Searching…" : "No matches." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "py-1", children: hits.map((h) => {
          const isApp = h.kind === "application";
          const isLead = h.kind === "lead";
          const formattedDate = h.created_at ? new Intl.DateTimeFormat("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
          }).format(new Date(h.created_at)).replace(",", "") : null;
          if (isApp || isLead) {
            return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => {
                  setOpen(false);
                  setQ("");
                  navigate({ to: h.href });
                },
                className: "w-full text-left px-3.5 py-2.5 hover:bg-[var(--admin-surface-2)] flex items-start gap-2.5 transition-colors border-b border-slate-100/80 last:border-0",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "shrink-0 mt-0.5 rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wide font-bold",
                      style: { background: "var(--admin-surface-2)", color: "var(--admin-fg-muted)" },
                      children: isApp ? "ORDER" : "LEAD"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-sm truncate", style: { color: "var(--admin-fg)" }, children: h.name || h.code }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs shrink-0 font-mono", style: { color: "var(--admin-fg-muted)" }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: h.code }),
                        formattedDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                          "· ",
                          formattedDate
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] truncate mt-0.5", style: { color: "var(--admin-fg-muted)" }, children: [
                      h.mobile ? `+91 ${h.mobile}` : null,
                      h.email || null,
                      h.service || null,
                      isApp ? h.assignee || "Unassigned" : null
                    ].filter(Boolean).join(" · ") })
                  ] })
                ]
              }
            ) }, `${h.kind}-${h.id}`);
          }
          return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => {
                setOpen(false);
                setQ("");
                navigate({ to: h.href });
              },
              className: "w-full text-left px-3 py-2 hover:bg-[var(--admin-surface-2)] flex items-start gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "shrink-0 mt-0.5 rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wide font-medium",
                    style: { background: "var(--admin-surface-2)", color: "var(--admin-fg-muted)" },
                    children: h.kind
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-sm truncate", style: { color: "var(--admin-fg)" }, children: h.title }),
                  h.subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[11px] truncate", style: { color: "var(--admin-fg-muted)" }, children: h.subtitle })
                ] })
              ]
            }
          ) }, `${h.kind}-${h.id}`);
        }) })
      }
    )
  ] });
}
const MUTE_KEY = "bhs.notif.muted";
function playChime() {
  try {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(MUTE_KEY) === "1") return;
    if (localStorage.getItem("udyam.sound.enabled") === "false") return;
    if (localStorage.getItem("udyam.sound.leads") === "false" && localStorage.getItem("udyam.sound.orders") === "false") return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.09);
    gain.gain.setValueAtTime(1e-4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(1e-4, ctx.currentTime + 0.35);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.36);
    osc.onended = () => ctx.close().catch(() => {
    });
  } catch {
  }
}
function NotificationsBell() {
  const navigate = useNavigate();
  useServerFn(getUnreadNotificationCount);
  const qc = useQueryClient();
  const [hasSession, setHasSession] = reactExports.useState(false);
  const [muted, setMuted] = reactExports.useState(false);
  const lastCountRef = reactExports.useRef(0);
  const primedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (typeof window !== "undefined") {
      const isMuted = localStorage.getItem(MUTE_KEY) === "1" || localStorage.getItem("udyam.sound.enabled") === "false";
      setMuted(isMuted);
    }
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setHasSession(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e2, session) => {
      setHasSession(!!session);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);
  const count = 0;
  reactExports.useEffect(() => {
    if (!primedRef.current) {
      primedRef.current = true;
      lastCountRef.current = count;
      return;
    }
    if (count > lastCountRef.current) {
      const isMuted = typeof window !== "undefined" && (localStorage.getItem(MUTE_KEY) === "1" || localStorage.getItem("udyam.sound.enabled") === "false" || localStorage.getItem("udyam.sound.leads") === "false" && localStorage.getItem("udyam.sound.orders") === "false");
      if (!isMuted) {
        playChime();
      }
    }
    lastCountRef.current = count;
  }, [count]);
  const [open, setOpen] = reactExports.useState(false);
  const wrapRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!open) return;
    function onClick(e) {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  const fetchList = useServerFn(listMyNotifications);
  const markRead = useServerFn(markNotificationRead);
  const markAll = useServerFn(markAllNotificationsRead);
  const { data: listData, refetch: refetchList } = useQuery({
    queryKey: ["notifications", "recent"],
    queryFn: () => fetchList({ data: { limit: 20 } }),
    enabled: hasSession && open,
    staleTime: 15e3
  });
  const rawRecent = listData?.rows ?? [];
  const recent = reactExports.useMemo(() => {
    const seen = /* @__PURE__ */ new Set();
    return rawRecent.filter((n) => {
      const key = `${n.title.trim().toLowerCase()}|${(n.body ?? "").trim().toLowerCase()}|${n.href ?? n.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [rawRecent]);
  const markOneMut = useMutation({
    mutationFn: (id) => markRead({ data: { id } }),
    onSuccess: () => {
      refetchList();
      qc.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    }
  });
  const markAllMut = useMutation({
    mutationFn: () => markAll(),
    onSuccess: () => {
      refetchList();
      qc.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    }
  });
  function relative(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 6e4);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    return `${Math.floor(h / 24)}d`;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: wrapRef, className: "relative flex items-center gap-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => {
          const next = !muted;
          setMuted(next);
          try {
            localStorage.setItem(MUTE_KEY, next ? "1" : "0");
          } catch {
          }
        },
        className: "rounded-md p-1.5 hover:bg-[var(--admin-surface-2)] transition-colors text-[10px]",
        style: { color: "var(--admin-fg-muted)" },
        "aria-label": muted ? "Unmute notifications" : "Mute notifications",
        title: muted ? "Notification sound muted — click to unmute" : "Mute notification sound",
        children: muted ? "🔕" : "🔔"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setOpen((o) => !o),
        className: "relative rounded-md p-2 hover:bg-[var(--admin-surface-2)] transition-colors",
        "aria-label": "Notifications",
        "aria-expanded": open,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "size-4" }),
          count > 0
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "absolute right-0 top-full mt-1 w-[380px] rounded-lg border shadow-xl z-50 overflow-hidden",
        style: { background: "var(--admin-surface)", borderColor: "var(--admin-border)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 py-2 border-b", style: { borderColor: "var(--admin-border)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-semibold", style: { color: "var(--admin-fg)" }, children: [
              "Notifications ",
              count > 0
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => markAllMut.mutate(),
                disabled: markAllMut.isPending,
                className: "text-[11px] font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed",
                children: "Mark all read"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[440px] overflow-y-auto", children: recent.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-10 text-center text-xs", style: { color: "var(--admin-fg-muted)" }, children: "You're all caught up." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y", style: { borderColor: "var(--admin-border)" }, children: recent.map((n) => {
            const unread = !n.read_at;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "li",
              {
                className: `px-3 py-2.5 hover:bg-[var(--admin-surface-2)] transition-colors cursor-pointer ${unread ? "bg-indigo-50/40" : ""}`,
                onClick: () => {
                  if (unread) markOneMut.mutate(n.id);
                  if (n.href) {
                    setOpen(false);
                    navigate({ to: n.href });
                  }
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                  unread && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1.5 size-1.5 rounded-full bg-indigo-500 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[13px] font-medium truncate", style: { color: "var(--admin-fg)" }, children: n.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto text-[10px] shrink-0", style: { color: "var(--admin-fg-muted)" }, children: relative(n.created_at) })
                    ] }),
                    n.body && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] mt-0.5 line-clamp-2", style: { color: "var(--admin-fg-muted)" }, children: n.body })
                  ] })
                ] })
              },
              n.id
            );
          }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2 border-t text-center", style: { borderColor: "var(--admin-border)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/admin/notifications",
              onClick: () => setOpen(false),
              className: "text-[11px] font-medium text-indigo-600 hover:text-indigo-700",
              children: "View all notifications →"
            }
          ) })
        ]
      }
    )
  ] });
}
function UserMenu({ email, onSignOut }) {
  const [open, setOpen] = reactExports.useState(false);
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    function onClick(e) {
      if (!ref.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);
  const initial = (email ?? "U").slice(0, 1).toUpperCase();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref, className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setOpen((o) => !o),
        className: "size-8 rounded-full flex items-center justify-center text-xs font-medium",
        style: { background: "var(--admin-primary)", color: "#fff" },
        "aria-label": "Account menu",
        children: initial
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "absolute right-0 mt-1 w-56 rounded-md border z-40",
        style: { background: "var(--admin-surface)", borderColor: "var(--admin-border)" },
        children: [
          email && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2 border-b text-xs truncate", style: { borderColor: "var(--admin-border)", color: "var(--admin-fg-muted)" }, children: email }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: onSignOut,
              className: "w-full text-left px-3 py-2 text-sm hover:bg-[var(--admin-surface-2)] flex items-center gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "size-3.5" }),
                "Sign out"
              ]
            }
          )
        ]
      }
    )
  ] });
}
const getWebRtcStatus = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("29a99c679947ba05957c8271fb172fd2e5c439cb712a41fcd78059f308cf01b8"));
const getWebRtcSession = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("ce294dc403958b755c35bbbda8af5e1651efab537079d4b894d07b29b5d21200"));
const initiateWebRtcCall = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  number: string().regex(/^\+?\d{8,15}$/),
  customerId: string().uuid().nullable().optional(),
  leadId: string().uuid().nullable().optional(),
  applicationId: string().uuid().nullable().optional()
}).parse(d)).handler(createSsrRpc("2254d21959939138c2885aeea81793d8c2b2d400be0d57f36de4f8d3bc6d2219"));
const endWebRtcCall = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  callRowId: string().uuid(),
  answeredAt: number().int().positive().nullable()
}).parse(d)).handler(createSsrRpc("06b5e65179bc3fbf45e5866dc6006ec12b0f38ae33fd2e3b4d1bdfa03c6d6f62"));
const lookupIncomingCaller = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  number: string().max(40)
}).parse(d)).handler(createSsrRpc("0dfd70de5fb5f7a6a39736984be95c5bda5f56ea5fee84caab42019e2a0ec5e0"));
const recordInboundWebRtcCall = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  key: string().uuid(),
  number: string().max(40),
  applicationId: string().uuid().nullable()
}).parse(d)).handler(createSsrRpc("e1a2200e76ec3de9445b40eb5525e6673c81b4f21b5ef049052ae61f0b5ebf7b"));
const EventSchema = object({
  event: string().min(1).max(40),
  state: string().max(40).optional(),
  sipCode: number().int().optional().nullable(),
  reason: string().max(500).optional().nullable(),
  number: string().max(20).optional().nullable(),
  detail: string().max(1e3).optional().nullable()
});
const logWebRtcEvent = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => EventSchema.parse(d)).handler(createSsrRpc("dd7d46b7ea327b08659aa3a559ab2cfe54293fef562482d2e87559d88c4790fb"));
const listWebRtcEvents = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("b334d85b2e2ac82f4b29429a685679c429122c575d02ac976438df598dc74425"));
const troubleshootWebRtc = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  status: string().max(200),
  details: string().max(3e3)
}).parse(d)).handler(createSsrRpc("59672288ea477c51778b4b3b38d79bd5f6259e5785a195f4834e47e90c5b14c2"));
function WebRtcDiagnostics({ currentStatus, currentError }) {
  const fetchLog = useServerFn(listWebRtcEvents);
  const ask = useServerFn(troubleshootWebRtc);
  const log = useQuery({ queryKey: ["webrtc-diag"], queryFn: () => fetchLog(), refetchInterval: 1e4 });
  const [status, setStatus] = reactExports.useState(currentStatus);
  const [details, setDetails] = reactExports.useState(currentError ?? "");
  const [advice, setAdvice] = reactExports.useState(null);
  const [err, setErr] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(false);
  async function analyse() {
    setBusy(true);
    setErr(null);
    setAdvice(null);
    try {
      const r = await ask({ data: { status: status || currentStatus, details } });
      setAdvice(r.advice);
    } catch (e) {
      setErr(String(e?.message ?? "Could not get advice."));
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 border-t pt-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "w-full rounded-md border bg-background px-2 py-1 text-xs", placeholder: "Status (e.g. Ready, Failed)", value: status, onChange: (e) => setStatus(e.target.value) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "h-16 w-full rounded-md border bg-background px-2 py-1 text-xs", placeholder: "What happened? Paste the error…", value: details, onChange: (e) => setDetails(e.target.value) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "w-full", disabled: busy, onClick: analyse, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5" }),
        busy ? "Thinking…" : "Suggest next steps"
      ] }),
      err ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: err }) : null,
      advice ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-48 overflow-auto whitespace-pre-wrap rounded-md bg-muted p-2 text-xs", children: advice }) : null
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs font-semibold", children: [
      "Test log",
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { "aria-label": "Refresh log", onClick: () => log.refetch(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3 w-3" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "max-h-40 space-y-1 overflow-auto text-[11px]", children: [
      (log.data ?? []).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded bg-muted/50 px-1.5 py-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: new Date(r.created_at).toLocaleTimeString() }),
        " ",
        r.activity_description,
        r.metadata?.number ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
          " · ",
          r.metadata.number
        ] }) : null,
        r.metadata?.detail ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "break-words text-muted-foreground", children: r.metadata.detail }) : null
      ] }, r.id)),
      log.data && !log.data.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-muted-foreground", children: "No attempts logged yet." }) : null,
      log.error ? /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-destructive", children: String(log.error.message) }) : null
    ] })
  ] });
}
function CallerCard({ loading, error, data, selected, onSelect }) {
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "animate-pulse rounded-md border px-2 py-1.5 text-xs text-muted-foreground", children: "Looking up caller…" });
  if (error) return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-md border px-2 py-1.5 text-xs text-muted-foreground", children: "Caller lookup failed — the call is unaffected." });
  if (!data) return null;
  if (data.kind === "invalid" || data.kind === "unknown") return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border px-2 py-1.5 text-xs", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
      "Unknown caller",
      data.number ? ` · ${data.number}` : ""
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/leads", target: "_blank", className: "text-primary underline", children: "Create a lead in Leads" })
  ] });
  const order = data.orders.find((o) => o.id === selected) ?? null;
  const active = data.orders.filter((o) => o.active), closed = data.orders.filter((o) => !o.active);
  const pill = (o) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onSelect(o.id), className: `rounded-full border px-2 py-0.5 font-mono text-[11px] ${o.id === selected ? "border-primary bg-primary text-primary-foreground" : o.active ? "" : "text-muted-foreground"}`, children: o.code ?? "Order" }, o.id);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 rounded-md border p-2 text-xs", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: data.customerName ?? "Customer" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: data.number })
    ] }),
    data.orders.length > 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      active.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: active.map(pill) }) : null,
      closed.length ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "Closed:" }),
        closed.map(pill)
      ] }) : null,
      !order ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
        data.orders.length,
        " orders found — pick the one this call is about."
      ] }) : null
    ] }) : null,
    order ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: order.code }),
        !order.active ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-muted-foreground", children: "(closed)" }) : null
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        order.service ?? "—",
        " · ",
        order.status.replace(/_/g, " ").toLowerCase()
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-muted-foreground", children: [
        "Assigned: ",
        order.assignee ?? "Unassigned"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/orders/$orderId", params: { orderId: order.id }, target: "_blank", className: "text-primary underline", children: "Open order" })
    ] }) : !data.orders.length && data.lead ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        "Lead ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: data.lead.code ?? "" }),
        " · ",
        data.lead.name
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        data.lead.service ?? "—",
        " · ",
        data.lead.status.replace(/_/g, " ")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-muted-foreground", children: [
        "Assigned: ",
        data.lead.assignee ?? "Unassigned"
      ] })
    ] }) : null
  ] });
}
const LABEL = {
  DISCONNECTED: "Disconnected",
  CHECKING_CONFIGURATION: "Checking setup…",
  SETUP_INCOMPLETE: "Setup incomplete",
  CONNECTING: "Connecting…",
  REGISTERED: "Ready",
  RECONNECTING: "Reconnecting…",
  CALLING: "Calling…",
  RINGING: "Incoming call",
  CONNECTED: "Connected",
  ENDED: "Call ended",
  FAILED: "Not connected"
};
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];
function WebRtcPhone() {
  const fetchStatus = useServerFn(getWebRtcStatus);
  const fetchSession = useServerFn(getWebRtcSession);
  const logEvent = useServerFn(logWebRtcEvent);
  const startCall = useServerFn(initiateWebRtcCall);
  const finishCall = useServerFn(endWebRtcCall);
  const lookup = useServerFn(lookupIncomingCaller);
  const recordInbound = useServerFn(recordInboundWebRtcCall);
  const callRow = reactExports.useRef(null);
  const [diag, setDiag] = reactExports.useState(false);
  const { data: status } = useQuery({ queryKey: ["webrtc-status"], queryFn: () => fetchStatus(), staleTime: 3e5 });
  const engine = reactExports.useRef(null);
  const [snap, setSnap] = reactExports.useState(null);
  const [open, setOpen] = reactExports.useState(false);
  const [num, setNum] = reactExports.useState("");
  const [link, setLink] = reactExports.useState(null);
  const [keypad, setKeypad] = reactExports.useState(false);
  const [dtmf, setDtmf] = reactExports.useState("");
  const [outputs, setOutputs] = reactExports.useState([]);
  const [output, setOutput] = reactExports.useState("");
  const [now, setNow] = reactExports.useState(Date.now());
  const dialing = reactExports.useRef(false);
  const state = snap?.state ?? (status?.canRegister ? "DISCONNECTED" : "SETUP_INCOMPLETE");
  const ready = state === "REGISTERED" || state === "ENDED";
  reactExports.useEffect(() => {
    if (state !== "CONNECTED" && state !== "RINGING") return;
    const t = setInterval(() => setNow(Date.now()), 1e3);
    return () => clearInterval(t);
  }, [state]);
  reactExports.useEffect(() => () => {
    browserPhone.setReady(false);
    browserPhone.register(null);
    void engine.current?.stop();
  }, []);
  reactExports.useEffect(() => {
    if (state === "RINGING" || state === "CALLING") setOpen(true);
    if (state !== "CONNECTED") {
      setKeypad(false);
      setDtmf("");
    }
  }, [state]);
  reactExports.useEffect(() => {
    browserPhone.setReady(ready);
  }, [ready]);
  reactExports.useEffect(() => {
    if (snap?.notice) toast.info(snap.notice);
  }, [snap?.notice]);
  reactExports.useEffect(() => {
    const on = () => engine.current?.onNetworkOnline();
    window.addEventListener("online", on);
    return () => window.removeEventListener("online", on);
  }, []);
  reactExports.useEffect(() => {
    if (state !== "CONNECTED" && state !== "CALLING" && state !== "RINGING") return;
    const h = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [state]);
  reactExports.useEffect(() => {
    const c = callRow.current;
    if (!c) return;
    if (snap?.state === "CONNECTED" && snap.connectedAt) c.answeredAt = snap.connectedAt;
    if (snap?.state === "ENDED" || snap?.state === "FAILED" || snap?.state === "DISCONNECTED" || snap?.state === "REGISTERED") {
      callRow.current = null;
      void finishCall({ data: { callRowId: c.id, answeredAt: c.answeredAt } }).catch(() => {
      });
    }
  }, [snap?.state, snap?.connectedAt]);
  const inboundKey = reactExports.useRef(null);
  const [caller, setCaller] = reactExports.useState({ loading: false, error: false, data: null });
  const [selectedOrder, setSelectedOrder] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (snap?.state !== "RINGING" || snap.direction !== "inbound" || inboundKey.current) return;
    const key = crypto.randomUUID();
    inboundKey.current = key;
    const number2 = snap.remoteNumber ?? "";
    setSelectedOrder(null);
    setCaller({ loading: true, error: false, data: null });
    lookup({ data: { number: number2 } }).then((d) => {
      if (inboundKey.current !== key) return;
      setCaller({ loading: false, error: false, data: d });
      if (d.orders.length === 1) setSelectedOrder(d.orders[0].id);
    }).catch(() => {
      if (inboundKey.current === key) setCaller({ loading: false, error: true, data: null });
    });
    recordInbound({ data: { key, number: number2, applicationId: null } }).then((r) => {
      if (inboundKey.current === key && !callRow.current) callRow.current = { id: r.callRowId, answeredAt: null };
    }).catch(() => {
    });
  }, [snap?.state, snap?.direction, snap?.remoteNumber]);
  reactExports.useEffect(() => {
    if (snap?.state === "ENDED" || snap?.state === "FAILED" || snap?.state === "DISCONNECTED" || snap?.state === "REGISTERED") inboundKey.current = null;
  }, [snap?.state]);
  function selectOrder(id) {
    setSelectedOrder(id);
    const key = inboundKey.current;
    if (key) void recordInbound({ data: { key, number: snap?.remoteNumber ?? "", applicationId: id } }).catch(() => {
    });
  }
  async function dial(raw = num, ctx = link) {
    if (dialing.current) return;
    const target = dialTarget(raw);
    if (!target) {
      toast.error("Enter a valid phone number (10-digit mobile, STD landline or +country number).");
      return;
    }
    dialing.current = true;
    try {
      try {
        const r = await startCall({ data: { number: target, customerId: ctx?.customerId ?? null, leadId: ctx?.leadId ?? null, applicationId: ctx?.applicationId ?? null } });
        callRow.current = { id: r.callRowId, answeredAt: null };
      } catch (e) {
        if (/not available/i.test(String(e?.message))) {
          toast.error(e.message);
          return;
        }
      }
      await engine.current?.dial(target);
    } finally {
      dialing.current = false;
    }
  }
  reactExports.useEffect(() => {
    browserPhone.register((r) => {
      setOpen(true);
      setNum(cleanDialInput(r.number));
      setLink({ customerId: r.customerId, leadId: r.leadId, applicationId: r.applicationId });
      void dial(r.number, { customerId: r.customerId, leadId: r.leadId, applicationId: r.applicationId });
    });
    return () => browserPhone.register(null);
  });
  const stateRef = reactExports.useRef(state);
  stateRef.current = state;
  reactExports.useEffect(() => {
    browserPhone.setControls({
      answer: () => {
        void engine.current?.answer();
      },
      reject: () => {
        void engine.current?.reject();
      },
      hangup: () => {
        void engine.current?.hangup();
      },
      state: () => stateRef.current
    });
    return () => browserPhone.setControls(null);
  }, []);
  async function loadOutputs() {
    try {
      const all = await navigator.mediaDevices.enumerateDevices();
      setOutputs(all.filter((d) => d.kind === "audiooutput"));
    } catch {
      setOutputs([]);
    }
  }
  reactExports.useEffect(() => {
    if (state === "CONNECTED") void loadOutputs();
  }, [state]);
  if (!status?.authorized) return null;
  async function connect() {
    if (!engine.current) {
      const { CallerDeskWebRtcEngine } = await import("./callerdesk-webrtc.engine-B50Wuopq.mjs");
      engine.current = new CallerDeskWebRtcEngine();
      engine.current.subscribe(setSnap);
      engine.current.onLog = (e) => {
        void logEvent({ data: e }).catch(() => {
        });
      };
    }
    await engine.current.start(() => fetchSession());
  }
  const dot = state === "REGISTERED" || state === "CONNECTED" ? "bg-primary" : state === "FAILED" ? "bg-destructive" : "bg-muted-foreground";
  const canPickOutput = typeof HTMLMediaElement !== "undefined" && "setSinkId" in HTMLMediaElement.prototype && outputs.length > 1;
  const inCall = state === "CALLING" || state === "CONNECTED";
  const talk = snap?.connectedAt ? fmtDuration((now - snap.connectedAt) / 1e3) : "00:00";
  const ringFor = snap?.ringingSince ? fmtDuration((now - snap.ringingSince) / 1e3) : "00:00";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    state === "RINGING" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { role: "alertdialog", "aria-label": "Incoming call", className: "fixed inset-x-0 top-4 z-[60] mx-auto w-[min(420px,calc(100vw-2rem))] space-y-3 rounded-2xl border-2 border-primary bg-card p-5 text-card-foreground shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneIncoming, { className: "h-5 w-5 text-primary" }),
          "Incoming call"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
          "Ringing ",
          ringFor
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-2xl", children: snap?.remoteNumber ?? "Unknown number" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CallerCard, { loading: caller.loading, error: caller.error, data: caller.data, selected: selectedOrder, onSelect: selectOrder }),
      snap?.error ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: snap.error }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { autoFocus: true, onClick: () => engine.current?.answer(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4" }),
          "Accept"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "destructive", onClick: () => engine.current?.reject(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneOff, { className: "h-4 w-4" }),
          "Reject"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "flex items-center gap-1 text-xs text-muted-foreground underline", onClick: () => engine.current?.setRingMuted(!snap?.ringMuted), children: snap?.ringMuted ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-3.5 w-3.5" }),
        "Turn ringtone on"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BellOff, { className: "h-3.5 w-3.5" }),
        "Silence ringtone"
      ] }) })
    ] }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-14 right-4 z-40", children: !open ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen(true), className: "flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs shadow", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Headset, { className: "h-3.5 w-3.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-2 w-2 rounded-full ${dot}` }),
      "Browser phone: ",
      snap?.held ? "On hold" : LABEL[state],
      state === "CONNECTED" ? ` · ${talk}` : ""
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-[320px] max-h-[85vh] overflow-auto space-y-3 rounded-xl border bg-card p-4 text-card-foreground shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Headset, { className: "h-4 w-4" }),
          "Browser phone"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { "aria-label": "Hide phone", onClick: () => setOpen(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs", "aria-live": "polite", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-2 w-2 rounded-full ${dot}` }),
        snap?.held ? "On hold" : LABEL[state],
        snap?.muted ? " · muted" : ""
      ] }),
      !status.canRegister && !snap ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        status.message,
        status.missing.length ? ` Missing: ${status.missing.join(", ")}.` : "",
        !status.enabled ? " Browser calling is switched off." : ""
      ] }) : null,
      snap?.error ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: snap.error }) : null,
      status.canRegister && (state === "DISCONNECTED" || state === "FAILED" || state === "RECONNECTING") ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "w-full", onClick: connect, children: [
        state === "RECONNECTING" ? "Reconnect now" : "Connect",
        " (FortiClient VPN must be on)"
      ] }) : null,
      snap?.error?.startsWith("Browser blocked call audio") ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", className: "w-full", onClick: () => engine.current?.resumeAudio(), children: "Enable call audio" }) : null,
      snap?.direction === "inbound" && state === "CONNECTED" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CallerCard, { loading: caller.loading, error: caller.error, data: caller.data, selected: selectedOrder, onSelect: selectOrder }) : null,
      inCall ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: snap?.remoteNumber }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: state === "CONNECTED" ? talk : "Ringing…" })
        ] }),
        state === "CONNECTED" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: snap?.muted ? "default" : "outline", "aria-pressed": !!snap?.muted, onClick: () => engine.current?.setMuted(!snap?.muted), children: snap?.muted ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MicOff, { className: "h-4 w-4" }),
            "Unmute"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "h-4 w-4" }),
            "Mute"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: snap?.held ? "default" : "outline", "aria-pressed": !!snap?.held, onClick: () => engine.current?.setHeld(!snap?.held), children: snap?.held ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4" }),
            "Resume"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "h-4 w-4" }),
            "Hold"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: keypad ? "default" : "outline", "aria-pressed": keypad, onClick: () => setKeypad((k) => !k), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Grid3x3, { className: "h-4 w-4" }),
            "Keypad"
          ] })
        ] }) : null,
        state === "CONNECTED" && keypad ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "min-h-5 text-center font-mono text-sm", children: dtmf }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1", children: KEYS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => {
            engine.current?.sendDtmf(k);
            setDtmf((d) => (d + k).slice(-20));
          }, children: k }, k)) })
        ] }) : null,
        state === "CONNECTED" && canPickOutput ? /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "h-3.5 w-3.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "h-8 flex-1 rounded-md border bg-background px-1 text-xs", value: output, onChange: (e) => {
            setOutput(e.target.value);
            void engine.current?.setOutputDevice(e.target.value);
          }, children: outputs.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: d.deviceId, children: d.label || `Speaker ${i + 1}` }, d.deviceId || i)) })
        ] }) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "destructive", className: "w-full", onClick: () => engine.current?.hangup(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneOff, { className: "h-4 w-4" }),
          state === "CALLING" ? "Cancel call" : "End call"
        ] })
      ] }) : null,
      ready ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              "aria-label": "Number to call",
              className: "w-full rounded-md border bg-background px-2 py-1.5 font-mono text-sm",
              inputMode: "tel",
              placeholder: "Number to call",
              value: num,
              onChange: (e) => {
                setNum(cleanDialInput(e.target.value));
                setLink(null);
              },
              onPaste: (e) => {
                e.preventDefault();
                setNum(cleanDialInput(e.clipboardData.getData("text")));
                setLink(null);
              },
              onKeyDown: (e) => {
                if (e.key === "Enter") void dial();
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", "aria-label": "Delete last digit", onClick: () => setNum((n) => n.slice(0, -1)), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Delete, { className: "h-4 w-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1", children: KEYS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => setNum((n) => cleanDialInput(n + k)), children: k }, k)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "w-full", disabled: !num, onClick: () => void dial(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4" }),
          "Call"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[11px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/live-calls", className: "underline", children: "Recent calls" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "text-muted-foreground underline", onClick: () => engine.current?.stop(), children: "Disconnect" })
        ] })
      ] }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-full text-[11px] underline", onClick: () => setDiag((d) => !d), children: diag ? "Hide diagnostics" : "Diagnostics & test log" }),
      diag ? /* @__PURE__ */ jsxRuntimeExports.jsx(WebRtcDiagnostics, { currentStatus: LABEL[state], currentError: snap?.error ?? null }) : null
    ] }) })
  ] });
}
function AdminLayout() {
  const [email, setEmail] = reactExports.useState();
  useEmployeePresence();
  reactExports.useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.clarity) return;
    (function(c, l, a, r, i, t, y) {
      c[a] = c[a] || function() {
        (c[a].q = c[a].q || []).push(arguments);
      };
      t = l.createElement(r);
      t.async = 1;
      t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0];
      if (y && y.parentNode) {
        y.parentNode.insertBefore(t, y);
      } else {
        l.head.appendChild(t);
      }
    })(window, document, "clarity", "script", "yntk765ksf");
  }, []);
  reactExports.useEffect(() => {
    void import("./client-BX5UfqqR.mjs").then(({
      supabase: supabase2
    }) => supabase2.auth.getUser().then(({
      data
    }) => setEmail(data.user?.email ?? void 0)));
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardPrivacyProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(FinancialVisibilityProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminShell, { email, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TelephonyPanel, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(WebRtcPhone, {})
  ] }) }) });
}
export {
  AdminLayout as component
};
