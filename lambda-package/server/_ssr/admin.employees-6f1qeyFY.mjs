import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { _ as useRole, j as useServerFn, D as listStaffUsers, aX as getWorkforceDashboardMetrics, aY as archiveEmployee, aZ as deleteEmployee, a_ as setEmploymentStatus, H as Button, a4 as Tabs, a5 as TabsList, a6 as TabsTrigger, a$ as TabsContent, I as Input, ap as listServices, W as Label, a7 as isVisibleService, b0 as inviteEmployee, P as Dialog, Q as DialogContent, U as DialogHeader, V as DialogTitle, J as Select, K as SelectTrigger, M as SelectValue, N as SelectContent, O as SelectItem, X as DialogFooter, b1 as updateEmployee, b2 as getEmployeeWorkAccess, b3 as setEmployeeWorkAccess, b4 as resetEmployeePassword, a as cn, aW as buttonVariants } from "./router-QgJicixe.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { R as ROLE_LABELS, A as ASSIGNABLE_ROLES } from "./roles-CFhgFhhh.mjs";
import { S as SectionCard } from "./ui-BVv-e2FI.mjs";
import { S as Switch } from "./switch-DIr13Mej.mjs";
import { R as Root2, P as Portal2, C as Content2, T as Title2, D as Description2, a as Cancel, A as Action, O as Overlay2 } from "../_libs/radix-ui__react-alert-dialog.mjs";
import { A as AssignmentManagementView } from "./AssignmentManagementView-CGNmSZco.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { aa as UserCog, J as Users, aQ as UserPlus, aR as CalendarOff, aS as Shuffle, am as Activity, aT as Zap, v as Search, aP as Pencil, w as ShieldCheck, aU as KeyRound, aV as Archive, f as RotateCcw, aw as Plus, aW as UserMinus, aq as EyeOff, ad as Eye, E as Check, aB as Copy } from "../_libs/lucide-react.mjs";
import { o as object, b as boolean, s as string } from "../_libs/zod.mjs";
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
import "../_libs/radix-ui__react-switch.mjs";
const AlertDialog = Root2;
const AlertDialogPortal = Portal2;
const AlertDialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay2,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = Overlay2.displayName;
const AlertDialogContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content2,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = Content2.displayName;
const AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title2,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = Title2.displayName;
const AlertDialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description2,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = Description2.displayName;
const AlertDialogAction = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Action, { ref, className: cn(buttonVariants(), className), ...props }));
AlertDialogAction.displayName = Action.displayName;
const AlertDialogCancel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Cancel,
  {
    ref,
    className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
    ...props
  }
));
AlertDialogCancel.displayName = Cancel.displayName;
const getAssignmentConfig = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("7a5491f1b686526821af7e0777f253b9c18a7199be5912f80bd070c010ae126f"));
const setAutoAssignEnabled = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  enabled: boolean()
}).parse(i)).handler(createSsrRpc("2173c3ce7fa35b79e135fcfc01d86bff963a11da268e97ce97eac7377a71d81c"));
const listAssignmentPool = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("91eaffc162c08d41abe3c48b3f2a8f7b55f78a6f96b03bd9f89300ab54506141"));
const listEligibleEmployees = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("b7ba6a8b7c43e0c7654c19787799e796b414196d1fb8e28d5d4caf2fbfa34200"));
const addToPool = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  userId: string().uuid(),
  serviceId: string().uuid().nullable().optional()
}).parse(i)).handler(createSsrRpc("f77ca8591a43e62b5a1411d9c32b2c9ec2e6fc1360924690709f6e7dec4ed4a8"));
const togglePoolActive = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid(),
  isActive: boolean()
}).parse(i)).handler(createSsrRpc("dc19c53b368fe6f95d5a4d961beeafd20a738cf08324386310c95a2cd5635b72"));
const removeFromPool = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid()
}).parse(i)).handler(createSsrRpc("2274070860800f84c07cd686dab3cdd7ea6c8ecf219cb304973b8f6125073bf8"));
function formatIST$1(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    const fmt = new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata"
    }).formatToParts(d);
    const get = (t) => fmt.find((p) => p.type === t)?.value ?? "";
    return `${get("day")}-${get("month")}-${get("year")} ${get("hour")}:${get("minute")} ${get("dayPeriod").toUpperCase()}`;
  } catch {
    return "—";
  }
}
function LeadAssignmentTab() {
  const qc = useQueryClient();
  const cfgFn = useServerFn(getAssignmentConfig);
  const setEnabledFn = useServerFn(setAutoAssignEnabled);
  const poolFn = useServerFn(listAssignmentPool);
  const eligibleFn = useServerFn(listEligibleEmployees);
  const svcFn = useServerFn(listServices);
  useServerFn(addToPool);
  const toggleFn = useServerFn(togglePoolActive);
  const removeFn = useServerFn(removeFromPool);
  const { data: cfg } = useQuery({ queryKey: ["assign.cfg"], queryFn: () => cfgFn() });
  const { data: pool, isLoading } = useQuery({ queryKey: ["assign.pool"], queryFn: () => poolFn() });
  const { data: eligible } = useQuery({ queryKey: ["assign.eligible"], queryFn: () => eligibleFn() });
  const { data: services } = useQuery({ queryKey: ["admin.services"], queryFn: () => svcFn() });
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const isEnabled = cfg?.config?.is_active ?? false;
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["assign.cfg"] });
    qc.invalidateQueries({ queryKey: ["assign.pool"] });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shuffle, { className: "size-4 text-indigo-600" }),
          " Round-Robin Auto-Assignment for Orders & Leads"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1", style: { color: "var(--admin-fg-muted)" }, children: "When ON, every new lead and paid order is automatically assigned to a dedicated active employee with order access." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: isEnabled ? "ON" : "OFF" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Switch,
          {
            checked: isEnabled,
            onCheckedChange: async (v) => {
              try {
                await setEnabledFn({ data: { enabled: v } });
                toast.success(v ? "Auto-assignment enabled" : "Auto-assignment disabled");
                refresh();
              } catch (e) {
                toast.error(e.message);
              }
            }
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionCard, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: "Assignment Pool" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "gap-1.5", onClick: () => setAddOpen(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }),
          " Add to Pool"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left text-[11px] uppercase tracking-wide", style: { color: "var(--admin-fg-muted)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2", children: "Employee" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2", children: "Role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2", children: "Service" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2", children: "Active" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2", children: "Last Assigned" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2", children: "Total Assigned" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-4 py-6 text-center text-xs", style: { color: "var(--admin-fg-muted)" }, children: "Loading…" }) }),
          !isLoading && (pool?.rows ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: 7, className: "px-4 py-8 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: "No one in the pool yet." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "mt-3 gap-1.5", onClick: () => setAddOpen(true), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }),
              " Add to Pool"
            ] })
          ] }) }),
          (pool?.rows ?? []).map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t", style: { borderColor: "var(--admin-border)", background: i % 2 ? "var(--admin-surface-2)" : "transparent" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: r.user_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs", children: (r.user_roles[0] ?? "—").replace(/_/g, " ") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: r.service_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: r.is_active,
                onCheckedChange: async (v) => {
                  try {
                    await toggleFn({ data: { id: r.id, isActive: v } });
                    refresh();
                  } catch (e) {
                    toast.error(e.message);
                  }
                }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs", style: { color: "var(--admin-fg-muted)" }, children: formatIST$1(r.last_assigned_at) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: r.total_assigned }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "ghost",
                className: "h-7 gap-1",
                style: { color: "#b91c1c" },
                onClick: async () => {
                  if (!confirm(`Remove ${r.user_name} from the assignment pool?`)) return;
                  try {
                    await removeFn({ data: { id: r.id } });
                    toast.success("Removed from pool");
                    refresh();
                  } catch (e) {
                    toast.error(e.message);
                  }
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(UserMinus, { className: "size-3.5" }),
                  " Remove"
                ]
              }
            ) })
          ] }, r.id))
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AddToPoolDialog,
      {
        open: addOpen,
        onClose: () => setAddOpen(false),
        employees: eligible?.rows ?? [],
        services: (services?.rows ?? []).filter((s) => isVisibleService(s)).map((s) => ({ id: s.id, name: s.service_name })),
        onAdded: () => {
          setAddOpen(false);
          refresh();
        }
      }
    )
  ] });
}
function AddToPoolDialog({
  open,
  onClose,
  employees,
  services,
  onAdded
}) {
  const addFn = useServerFn(addToPool);
  const [userId, setUserId] = reactExports.useState("");
  const [serviceId, setServiceId] = reactExports.useState("__all");
  const [busy, setBusy] = reactExports.useState(false);
  async function submit() {
    if (!userId) {
      toast.error("Pick an employee");
      return;
    }
    setBusy(true);
    try {
      await addFn({ data: { userId, serviceId: serviceId === "__all" ? null : serviceId } });
      toast.success("Added to pool");
      setUserId("");
      setServiceId("__all");
      onAdded();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => {
    if (!v) onClose();
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add Employee to Pool" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Employee (executives / managers)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: userId, onValueChange: setUserId, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select employee" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            employees.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "__none", disabled: true, children: "No eligible employees" }),
            employees.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: e.id, children: [
              e.name,
              " · ",
              e.role
            ] }, e.id))
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Service" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: serviceId, onValueChange: setServiceId, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "__all", children: "All Services" }),
            services.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.id, children: s.name }, s.id))
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submit, disabled: busy, children: busy ? "Adding…" : "Add" })
    ] })
  ] }) });
}
const ROLE_COLOR = {
  super_admin: "#b91c1c",
  admin: "#1d4ed8",
  manager: "#7c3aed",
  executive: "#0891b2",
  support: "#d97706",
  accounts: "#059669",
  finance: "#16a34a",
  operations: "#0ea5e9"
};
function RoleBadge({
  role
}) {
  const c = ROLE_COLOR[role] ?? "#64748b";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", style: {
    background: `${c}1a`,
    color: c
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-1.5 rounded-full", style: {
      background: c
    } }),
    ROLE_LABELS[role] ?? role.replace(/_/g, " ")
  ] });
}
function EmploymentStatusBadge({
  status
}) {
  let bg = "bg-slate-100 text-slate-700 border-slate-200";
  let dot = "bg-slate-400";
  if (status === "ACTIVE") {
    bg = "bg-emerald-50 text-emerald-700 border-emerald-200";
    dot = "bg-emerald-500";
  } else if (status === "INACTIVE" || status === "SUSPENDED") {
    bg = "bg-amber-50 text-amber-700 border-amber-200";
    dot = "bg-amber-500";
  } else if (status === "ARCHIVED" || status === "TERMINATED") {
    bg = "bg-rose-50 text-rose-700 border-rose-200";
    dot = "bg-rose-500";
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${bg}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `size-1.5 rounded-full ${dot}` }),
    status
  ] });
}
function formatIST(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    const fmt = new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata"
    }).formatToParts(d);
    const get = (t) => fmt.find((p) => p.type === t)?.value ?? "";
    return `${get("day")}-${get("month")}-${get("year")} ${get("hour")}:${get("minute")} ${get("dayPeriod").toUpperCase()}`;
  } catch {
    return "—";
  }
}
function WorkforcePage() {
  const role = useRole();
  const qc = useQueryClient();
  const listFn = useServerFn(listStaffUsers);
  const metricsFn = useServerFn(getWorkforceDashboardMetrics);
  const archiveFn = useServerFn(archiveEmployee);
  const deleteFn = useServerFn(deleteEmployee);
  const setStatusFn = useServerFn(setEmploymentStatus);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin.workforce.users"],
    queryFn: () => listFn()
  });
  const {
    data: metricsData
  } = useQuery({
    queryKey: ["admin.workforce.metrics"],
    queryFn: () => metricsFn()
  });
  const [query, setQuery] = reactExports.useState("");
  const rows = data?.rows ?? [];
  const activeWorkforce = reactExports.useMemo(() => {
    return rows.filter((r) => r.employment_status === "ACTIVE" && r.is_active);
  }, [rows]);
  const poolMembers = reactExports.useMemo(() => {
    return rows.filter((r) => r.is_in_pool || r.auto_assign_enabled);
  }, [rows]);
  const onLeaveOrUnavailable = reactExports.useMemo(() => {
    return rows.filter((r) => r.is_on_leave || !r.is_active || r.employment_status === "SUSPENDED");
  }, [rows]);
  const archivedOrInactive = reactExports.useMemo(() => {
    return rows.filter((r) => r.employment_status === "ARCHIVED" || r.employment_status === "TERMINATED" || r.employment_status === "INACTIVE");
  }, [rows]);
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [editRow, setEditRow] = reactExports.useState(null);
  const [archiveRow, setArchiveRow] = reactExports.useState(null);
  const [deleteRow, setDeleteRow] = reactExports.useState(null);
  const [resetPwRow, setResetPwRow] = reactExports.useState(null);
  const [accessRow, setAccessRow] = reactExports.useState(null);
  const canManage = role.access("employees") === "full";
  const canSee = role.access("employees") !== "none";
  const isSuper = role.has("super_admin");
  const refreshAll = async () => {
    await Promise.all([qc.invalidateQueries({
      queryKey: ["admin.workforce.users"]
    }), qc.invalidateQueries({
      queryKey: ["admin.workforce.metrics"]
    }), qc.invalidateQueries({
      queryKey: ["admin.employees"]
    }), qc.invalidateQueries({
      queryKey: ["admin.assignment.metrics"]
    })]);
  };
  if (!role.loading && !canSee) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(UserCog, { className: "size-10 mx-auto mb-3", style: {
        color: "var(--admin-fg-subtle)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: "You don't have access to Workforce Management." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs mt-1", style: {
        color: "var(--admin-fg-muted)"
      }, children: "Ask a super admin to grant you access." })
    ] }) });
  }
  const m = metricsData?.workforce || {
    total: 0,
    active: 0,
    onLeave: 0,
    available: 0,
    idle: 0,
    away: 0
  };
  const p = metricsData?.pool || {
    totalMembers: 0,
    available: 0,
    totalCapacity: 0,
    usedCapacity: 0,
    remainingCapacity: 0
  };
  const t = metricsData?.today || {
    autoAssignedToday: 0,
    autoReassignedToday: 0
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-6 text-indigo-600" }),
          " Workforce & Assignment Management"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-1", children: "Authoritative source for employee lifecycle, live availability, assignment pool, capacity, and workload balancing." })
      ] }),
      canManage && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setAddOpen(true), className: "gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "size-4" }),
        " Add Employee"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-2xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Workforce" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-3.5 text-slate-400" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-black text-slate-900 dark:text-white mt-1", children: m.active }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-slate-400 font-medium truncate mt-0.5", children: [
          m.total,
          " total accounts"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 shadow-2xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Available" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full bg-emerald-500 animate-pulse" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-black text-emerald-950 mt-1", children: m.available }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-emerald-700/80 font-medium truncate mt-0.5", children: "Online & active" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-amber-50/60 border border-amber-200 rounded-xl p-3 shadow-2xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] font-bold uppercase tracking-wider text-amber-700 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "On Leave / Away" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarOff, { className: "size-3.5 text-amber-600" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-black text-amber-950 mt-1", children: m.onLeave + m.idle + m.away }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-amber-700/80 font-medium truncate mt-0.5", children: [
          m.onLeave,
          " scheduled leave"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-indigo-50/60 border border-indigo-200 rounded-xl p-3 shadow-2xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] font-bold uppercase tracking-wider text-indigo-700 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Auto Pool" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shuffle, { className: "size-3.5 text-indigo-600" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-black text-indigo-950 mt-1", children: p.available }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-indigo-700/80 font-medium truncate mt-0.5", children: [
          p.totalMembers,
          " in pool config"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-sky-50/60 border border-sky-200 rounded-xl p-3 shadow-2xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] font-bold uppercase tracking-wider text-sky-700 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Capacity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "size-3.5 text-sky-600" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xl font-black text-sky-950 mt-1", children: [
          p.usedCapacity,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-sky-700", children: [
            "/ ",
            p.totalCapacity
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-sky-700/80 font-medium truncate mt-0.5", children: [
          p.remainingCapacity,
          " slots remaining"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-purple-50/60 border border-purple-200 rounded-xl p-3 shadow-2xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] font-bold uppercase tracking-wider text-purple-700 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Assigned Today" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "size-3.5 text-purple-600" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-black text-purple-950 mt-1", children: t.autoAssignedToday + t.autoReassignedToday }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-purple-700/80 font-medium truncate mt-0.5", children: [
          t.autoReassignedToday,
          " auto-reassigned"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "workforce", className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "bg-slate-100 p-1 border border-slate-200 rounded-xl flex flex-wrap gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "workforce", className: "rounded-lg text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-xs", children: [
          "🏢 Active Workforce (",
          activeWorkforce.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "pool", className: "rounded-lg text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-xs", children: [
          "⚖️ Assignment Pool (",
          poolMembers.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "leaves", className: "rounded-lg text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-xs", children: [
          "🌴 On Leave / Reassignment (",
          onLeaveOrUnavailable.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "performance", className: "rounded-lg text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-xs", children: "📊 Workload & Performance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "archived", className: "rounded-lg text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-xs text-slate-500", children: [
          "📦 Inactive / Archived (",
          archivedOrInactive.length,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "workforce", className: "space-y-4 mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-md flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Search active employees by name, email, mobile, role…", className: "pl-9 text-xs bg-white" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200 bg-slate-50/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5", children: "Emp ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5", children: "Name & Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5", children: "Role" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5", children: "Department" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5", children: "Auto Pool" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5", children: "Capacity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-right", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-slate-100", children: [
            isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 8, className: "px-4 py-8 text-center text-xs text-slate-500", children: "Loading workforce records…" }) }),
            !isLoading && activeWorkforce.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 8, className: "px-4 py-10 text-center text-slate-500", children: "No active employees found." }) }),
            activeWorkforce.filter((u) => !query || (u.full_name || "").toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase())).map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/70 transition-colors", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-mono text-xs font-semibold text-slate-600", children: u.employee_code || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold text-slate-900 flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: u.full_name || "—" }),
                  u.smartflo_agent_id && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-50 text-sky-700 border border-sky-200", title: `CallerDesk Member ID: ${u.smartflo_agent_id}`, children: [
                    "CD ",
                    u.smartflo_agent_id
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400 font-mono", children: u.email })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: u.roles.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(RoleBadge, { role: r }, r)) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs text-slate-600", children: u.department || "General" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${u.auto_assign_enabled ? "bg-indigo-50 text-indigo-700 border border-indigo-200" : "bg-slate-100 text-slate-500"}`, children: u.auto_assign_enabled ? "POOL ON" : "OFF" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2.5 text-xs font-semibold text-slate-700", children: [
                u.max_workload,
                " max"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: u.is_on_leave ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200", children: "🌴 ON LEAVE" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmploymentStatusBadge, { status: u.employment_status }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1", children: [
                canManage && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", className: "h-7 text-xs gap-1", onClick: () => setEditRow(u), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-3.5 text-slate-500" }),
                  " Edit"
                ] }),
                canManage && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", className: "h-7 text-xs text-purple-600 gap-1", onClick: () => setAccessRow(u), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-3.5" }),
                  " Work Access"
                ] }),
                isSuper && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", className: "h-7 text-xs text-indigo-600 gap-1", onClick: () => setResetPwRow(u), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "size-3.5" }),
                  " Password"
                ] }),
                canManage && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", className: "h-7 text-xs text-amber-600 gap-1", onClick: () => setArchiveRow(u), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "size-3.5" }),
                  " Archive"
                ] })
              ] }) })
            ] }, u.id))
          ] })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "pool", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LeadAssignmentTab, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "leaves", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AssignmentManagementView, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "performance", className: "mt-4 space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionCard, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-slate-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-sm text-slate-900", children: "Workforce Workload & Capacity Utilization" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: "Live view of effective weighted workloads, hot orders, and turnaround metrics." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200 bg-slate-50/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5", children: "Employee" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5", children: "Auto Pool" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5", children: "Live Presence" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5", children: "Active Action Orders" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5", children: "Hot Orders" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5", children: "Weighted Workload" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5", children: "Capacity Remaining" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5", children: "Avg Turnaround" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-slate-100", children: (metricsData?.workloads ?? []).map((w) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/70", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-900", children: w.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400 font-mono", children: w.email })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${w.isAutoAssignEligible ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-500"}`, children: w.isAutoAssignEligible ? "ELIGIBLE" : "INELIGIBLE" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-slate-700", children: w.presenceStatus }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-bold text-slate-900", children: w.activeActionOrders }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: w.hotOrders > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200", children: [
              w.hotOrders,
              " Hot"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: "0" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-bold text-indigo-600", children: w.effectiveWorkload }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold", children: [
              w.remainingCapacity,
              " / ",
              w.maxWorkload
            ] }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs text-slate-600", children: w.perf?.avgTurnaroundHours ? `${w.perf.avgTurnaroundHours}h` : "—" })
          ] }, w.employeeId)) })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "archived", className: "space-y-4 mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionCard, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-b border-slate-200 flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-sm text-slate-900", children: "Archived & Inactive Employees" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: "Historical staff accounts are safely preserved to maintain foreign keys, audit logs, and past order history." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200 bg-slate-50/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5", children: "Name & Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5", children: "Past Role" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5", children: "Employment Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5", children: "Archived Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-right", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-slate-100", children: [
            archivedOrInactive.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-4 py-8 text-center text-xs text-slate-500", children: "No archived employees." }) }),
            archivedOrInactive.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/70", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-700", children: u.full_name || "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400 font-mono", children: u.email })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: u.roles.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(RoleBadge, { role: r }, r)) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmploymentStatusBadge, { status: u.employment_status }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs text-slate-500", children: formatIST(u.archived_at || u.terminated_at || u.created_at) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1", children: [
                canManage && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "h-7 text-xs gap-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50", onClick: async () => {
                  try {
                    await setStatusFn({
                      data: {
                        user_id: u.id,
                        status: "ACTIVE",
                        reason: "Restored from archive by Admin"
                      }
                    });
                    toast.success(`Restored ${u.full_name || u.email} to Active Workforce`);
                    await refreshAll();
                  } catch (e) {
                    toast.error(e.message);
                  }
                }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "size-3.5" }),
                  " Restore to Active"
                ] }),
                isSuper && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", className: "h-7 text-xs text-rose-600 gap-1 hover:bg-rose-50", onClick: () => setDeleteRow(u), children: "Delete Account" })
              ] }) })
            ] }, u.id))
          ] })
        ] }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AddEmployeeModal, { open: addOpen, onOpenChange: setAddOpen, onCreated: refreshAll }),
    editRow && /* @__PURE__ */ jsxRuntimeExports.jsx(EditEmployeeModal, { row: editRow, open: !!editRow, onOpenChange: (o) => !o && setEditRow(null), onSaved: refreshAll }),
    accessRow && /* @__PURE__ */ jsxRuntimeExports.jsx(WorkAccessModal, { row: accessRow, open: !!accessRow, onOpenChange: (o) => !o && setAccessRow(null), onSaved: refreshAll }),
    resetPwRow && /* @__PURE__ */ jsxRuntimeExports.jsx(ResetPasswordModal, { row: resetPwRow, open: !!resetPwRow, onOpenChange: (o) => !o && setResetPwRow(null) }),
    archiveRow && /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!archiveRow, onOpenChange: (o) => !o && setArchiveRow(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Archive Employee Account?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { className: "space-y-2 text-xs text-slate-600", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "Archiving ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: archiveRow.full_name || archiveRow.email }),
            " will:"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc pl-4 space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Remove them from the Active Workforce and Auto-Assignment Pool." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Automatically redistribute any currently pending action-required orders to eligible staff." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Preserve all historical order assignments, completed orders, and audit logs." }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { className: "bg-amber-600 hover:bg-amber-700 text-white font-semibold", onClick: async () => {
          try {
            await archiveFn({
              data: {
                user_id: archiveRow.id,
                reason: "Archived by Admin"
              }
            });
            toast.success(`Archived ${archiveRow.full_name || archiveRow.email}`);
            setArchiveRow(null);
            refreshAll();
          } catch (e) {
            toast.error(e.message);
          }
        }, children: "Archive & Reassign Open Orders" })
      ] })
    ] }) }),
    deleteRow && /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!deleteRow, onOpenChange: (o) => !o && setDeleteRow(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Permanently Delete Account?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { className: "text-xs text-slate-600", children: [
          "If ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: deleteRow.full_name || deleteRow.email }),
          " has historical orders, they will be safely archived instead to prevent breaking historical records."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { className: "bg-rose-600 hover:bg-rose-700 text-white font-semibold", onClick: async () => {
          try {
            const res = await deleteFn({
              data: {
                user_id: deleteRow.id
              }
            });
            if (res.mode === "archived") {
              toast.info(res.message);
            } else {
              toast.success("Account permanently deleted.");
            }
            setDeleteRow(null);
            refreshAll();
          } catch (e) {
            toast.error(e.message);
          }
        }, children: "Confirm Delete / Archive" })
      ] })
    ] }) })
  ] });
}
function AddEmployeeModal({
  open,
  onOpenChange,
  onCreated
}) {
  const inviteFn = useServerFn(inviteEmployee);
  const [fullName, setFullName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [mobile, setMobile] = reactExports.useState("");
  const [smartfloAgentId, setSmartfloAgentId] = reactExports.useState("");
  const [role, setRole] = reactExports.useState("executive");
  const [department, setDepartment] = reactExports.useState("Operations");
  const [maxWorkload, setMaxWorkload] = reactExports.useState(50);
  const [autoAssignEnabled, setAutoAssignEnabled2] = reactExports.useState(false);
  const [busy, setBusy] = reactExports.useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await inviteFn({
        data: {
          full_name: fullName,
          email,
          mobile: mobile || null,
          smartflo_agent_id: smartfloAgentId || null,
          role,
          department,
          max_workload: maxWorkload,
          auto_assign_enabled: autoAssignEnabled
        }
      });
      toast.success("Employee invited successfully!");
      onOpenChange(false);
      onCreated();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-[480px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-base font-bold", children: "Add New Employee" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-3.5 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Full Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: fullName, onChange: (e) => setFullName(e.target.value), placeholder: "e.g. Rahul Sharma", className: "mt-1" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Email Address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "rahul@company.com", className: "mt-1" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Mobile Number" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: mobile, onChange: (e) => setMobile(e.target.value), placeholder: "+91 9876543210", className: "mt-1" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "CallerDesk Member ID (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: smartfloAgentId, onChange: (e) => setSmartfloAgentId(e.target.value), placeholder: "e.g. 122142 (blank = match by mobile)", className: "mt-1" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: role, onValueChange: (v) => setRole(v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ASSIGNABLE_ROLES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r, children: ROLE_LABELS[r] }, r)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Department" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: department, onChange: (e) => setDepartment(e.target.value), placeholder: "Operations", className: "mt-1" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Max Workload Capacity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 5, max: 200, value: maxWorkload, onChange: (e) => setMaxWorkload(Number(e.target.value)), className: "mt-1" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: autoAssignEnabled, onCheckedChange: setAutoAssignEnabled2 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium", children: "Auto-Assign Pool" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, className: "bg-indigo-600 hover:bg-indigo-700 text-white", children: busy ? "Saving…" : "Add Employee" })
      ] })
    ] })
  ] }) });
}
function EditEmployeeModal({
  row,
  open,
  onOpenChange,
  onSaved
}) {
  const updateFn = useServerFn(updateEmployee);
  const [fullName, setFullName] = reactExports.useState(row.full_name || "");
  const [mobile, setMobile] = reactExports.useState(row.mobile || "");
  const [smartfloAgentId, setSmartfloAgentId] = reactExports.useState(row.smartflo_agent_id || "");
  const [role, setRole] = reactExports.useState(row.roles[0] || "executive");
  const [department, setDepartment] = reactExports.useState(row.department || "Operations");
  const [maxWorkload, setMaxWorkload] = reactExports.useState(row.max_workload || 50);
  const [autoAssignEnabled, setAutoAssignEnabled2] = reactExports.useState(row.auto_assign_enabled ?? false);
  const [busy, setBusy] = reactExports.useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await updateFn({
        data: {
          user_id: row.id,
          full_name: fullName,
          mobile: mobile || null,
          smartflo_agent_id: smartfloAgentId || null,
          role,
          department,
          max_workload: maxWorkload,
          auto_assign_enabled: autoAssignEnabled
        }
      });
      toast.success("Employee updated successfully!");
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-[480px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-base font-bold", children: [
      "Edit Employee: ",
      row.email
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-3.5 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Full Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: fullName, onChange: (e) => setFullName(e.target.value), className: "mt-1" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Mobile Number" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: mobile, onChange: (e) => setMobile(e.target.value), className: "mt-1" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "CallerDesk Member ID (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: smartfloAgentId, onChange: (e) => setSmartfloAgentId(e.target.value), placeholder: "e.g. 122142 (blank = match by mobile)", className: "mt-1" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: role, onValueChange: (v) => setRole(v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ASSIGNABLE_ROLES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r, children: ROLE_LABELS[r] }, r)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Department" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: department, onChange: (e) => setDepartment(e.target.value), className: "mt-1" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Max Workload Capacity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: 5, max: 200, value: maxWorkload, onChange: (e) => setMaxWorkload(Number(e.target.value)), className: "mt-1" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: autoAssignEnabled, onCheckedChange: setAutoAssignEnabled2 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium", children: "Auto-Assign Pool" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy, className: "bg-indigo-600 hover:bg-indigo-700 text-white", children: busy ? "Saving…" : "Save Changes" })
      ] })
    ] })
  ] }) });
}
function WorkAccessModal({
  row,
  open,
  onOpenChange,
  onSaved
}) {
  const getFn = useServerFn(getEmployeeWorkAccess);
  const setFn = useServerFn(setEmployeeWorkAccess);
  const {
    data: accessData,
    isLoading
  } = useQuery({
    queryKey: ["admin.workaccess", row.id],
    queryFn: () => getFn({
      data: {
        user_id: row.id
      }
    }),
    enabled: open
  });
  const [leads, setLeads] = reactExports.useState(false);
  const [orders, setOrders] = reactExports.useState(false);
  const [support, setSupport] = reactExports.useState(false);
  const [finance, setFinance] = reactExports.useState(false);
  const [busy, setBusy] = reactExports.useState(false);
  reactExports.useMemo(() => {
    if (accessData?.permissions) {
      setLeads(!!accessData.permissions["work.leads"]);
      setOrders(!!accessData.permissions["work.orders"]);
      setSupport(!!accessData.permissions["work.support"]);
      setFinance(!!accessData.permissions["work.finance"]);
    }
  }, [accessData]);
  const handleSave = async () => {
    setBusy(true);
    try {
      await setFn({
        data: {
          user_id: row.id,
          work: {
            "work.leads": leads,
            "work.orders": orders,
            "work.support": support,
            "work.finance": finance
          },
          websites: [],
          services: []
        }
      });
      toast.success("Work access permissions updated!");
      onOpenChange(false);
      onSaved();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-[420px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-base font-bold", children: [
      "Work Access: ",
      row.full_name || row.email
    ] }) }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-6 text-center text-xs text-slate-500", children: "Loading access rules…" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-xs py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-2 rounded-lg bg-slate-50 border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-900", children: "Orders Module" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-500 text-[11px]", children: "Process & fulfill customer orders" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: orders, onCheckedChange: setOrders })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-2 rounded-lg bg-slate-50 border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-900", children: "Leads Module" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-500 text-[11px]", children: "Manage customer leads & follow-ups" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: leads, onCheckedChange: setLeads })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-2 rounded-lg bg-slate-50 border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-900", children: "Support & Tickets" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-500 text-[11px]", children: "Handle complaints & tickets" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: support, onCheckedChange: setSupport })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-2 rounded-lg bg-slate-50 border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-900", children: "Finance & Invoices" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-500 text-[11px]", children: "View payments, invoices & revenue" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: finance, onCheckedChange: setFinance })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "mt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleSave, disabled: busy, className: "bg-purple-600 hover:bg-purple-700 text-white", children: busy ? "Saving…" : "Save Access" })
    ] })
  ] }) });
}
const LOGIN_URL = "https://crm.businesshelpservices.com/admin-login";
function clientGeneratePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 12; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out + "!9";
}
function ResetPasswordModal({
  row,
  open,
  onOpenChange
}) {
  const resetFn = useServerFn(resetEmployeePassword);
  const [password, setPassword] = reactExports.useState(() => clientGeneratePassword());
  const [showPw, setShowPw] = reactExports.useState(true);
  const [busy, setBusy] = reactExports.useState(false);
  const [saved, setSaved] = reactExports.useState(false);
  const [copied, setCopied] = reactExports.useState(false);
  const [copiedField, setCopiedField] = reactExports.useState(null);
  const handleOpenChange = (o) => {
    if (o) {
      setPassword(clientGeneratePassword());
      setSaved(false);
      setCopied(false);
      setCopiedField(null);
      setShowPw(true);
    }
    onOpenChange(o);
  };
  const regenerate = () => {
    setPassword(clientGeneratePassword());
    setCopied(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) return;
    setBusy(true);
    try {
      await resetFn({
        data: {
          user_id: row.id,
          new_password: password
        }
      });
      toast.success(`Password reset for ${row.email}`);
      setSaved(true);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };
  const copyField = async (value, field) => {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2e3);
  };
  const copyAll = async () => {
    const text = [`Login URL: ${LOGIN_URL}`, `User ID: ${row.email}`, `Password: ${password}`].join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Credentials copied to clipboard!");
    setTimeout(() => setCopied(false), 3e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: handleOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-[440px] p-0 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pt-5 pb-3 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "size-4 text-indigo-600" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-sm font-bold leading-tight", children: "Reset Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-500 mt-0.5 truncate max-w-[320px]", children: row.email })
      ] })
    ] }) }),
    !saved ? (
      /* ── STEP 1: Set password ── */
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "px-5 py-4 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-slate-700", children: "New Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-slate-400 mb-2", children: "Auto-generated. You can regenerate or type your own." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, type: showPw ? "text" : "password", minLength: 8, value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Minimum 8 characters", className: "pr-9 font-mono text-sm tracking-wider" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPw((v) => !v), className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600", tabIndex: -1, "aria-label": showPw ? "Hide password" : "Show password", children: showPw ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "size-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-3.5" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", size: "sm", onClick: regenerate, className: "px-2.5 text-slate-600 shrink-0", title: "Generate new password", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "size-3.5" }) })
          ] }),
          password.length > 0 && password.length < 8 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-rose-500 mt-1", children: "Minimum 8 characters required." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", size: "sm", onClick: () => handleOpenChange(false), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", size: "sm", disabled: busy || password.length < 8, className: "bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]", children: busy ? "Saving…" : "Save New Password" })
        ] })
      ] })
    ) : (
      /* ── STEP 2: Credentials card shown after successful reset ── */
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold", children: "Password updated successfully!" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 overflow-hidden divide-y divide-slate-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-slate-400 uppercase tracking-wide", children: "Login URL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-700 font-medium truncate mt-0.5", children: LOGIN_URL })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => copyField(LOGIN_URL, "url"), className: "shrink-0 p-1.5 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors", title: "Copy URL", children: copiedField === "url" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5 text-emerald-600" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "size-3.5" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-slate-400 uppercase tracking-wide", children: "User ID (Email)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-700 font-medium truncate mt-0.5", children: row.email })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => copyField(row.email, "email"), className: "shrink-0 p-1.5 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors", title: "Copy email", children: copiedField === "email" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5 text-emerald-600" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "size-3.5" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-slate-400 uppercase tracking-wide", children: "Password" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-700 font-mono tracking-wider mt-0.5", children: showPw ? password : "•".repeat(password.length) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPw((v) => !v), className: "shrink-0 p-1.5 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors", title: showPw ? "Hide" : "Show", children: showPw ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "size-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => copyField(password, "pw"), className: "shrink-0 p-1.5 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors", title: "Copy password", children: copiedField === "pw" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5 text-emerald-600" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "size-3.5" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", onClick: copyAll, className: `w-full text-xs font-semibold transition-colors ${copied ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`, children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5 mr-1.5" }),
          " Credentials Copied!"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "size-3.5 mr-1.5" }),
          " Copy All Credentials"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "sm", className: "text-xs text-slate-500", onClick: () => handleOpenChange(false), children: "Done" }) })
      ] })
    )
  ] }) });
}
export {
  WorkforcePage as component
};
