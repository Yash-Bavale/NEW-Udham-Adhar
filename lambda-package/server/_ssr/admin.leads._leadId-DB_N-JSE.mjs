import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { bj as Route$Q, j as useServerFn, be as getLead, bk as addLeadNote, aM as listStaff, _ as useRole, aE as usePermissions, a1 as Badge, a4 as Tabs, a5 as TabsList, a6 as TabsTrigger, a$ as TabsContent, H as Button, ap as listServices, bi as changeLeadService, a7 as isVisibleService, P as Dialog, Q as DialogContent, U as DialogHeader, V as DialogTitle, as as DialogDescription, W as Label, X as DialogFooter, $ as Textarea, I as Input, b6 as Popover, b7 as PopoverTrigger, a as cn, b8 as PopoverContent, b9 as Calendar$1, J as Select, K as SelectTrigger, M as SelectValue, N as SelectContent, O as SelectItem } from "./router-QgJicixe.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { f as formatIST } from "./datetime-DvkGwlJs.mjs";
import { m as motion } from "../_libs/motion.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { C as CallButton } from "./CallButton-i-5I5V9S.mjs";
import { transitionLeadStatus } from "./lead-status.functions-rIiSyzbQ.mjs";
import { i as isUnconvertedConsultationLead } from "./consultation-asWR5IET.mjs";
import { f as formatLeadSource } from "./format-lead-source-HeQb-2Bz.mjs";
import { A as AddTaskDialog } from "./AddTaskDialog-4s-_aP2e.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-CjqxMl2c.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { e as ShieldAlert, r as ChevronLeft, h as LayoutGrid, ak as History, b6 as MessageSquare, ar as User, bC as ArrowRightLeft, R as RefreshCw, aM as CircleAlert, E as Check, af as Receipt, l as CircleCheck, aI as CircleX, az as Trash2, P as Phone, b as MessageCircle, a as Mail, ao as Sparkles, bD as Link2, z as Calendar, C as Clock, Q as FileText, bE as ChartNoAxesColumn, bF as FilePenLine, ag as CreditCard, am as Activity, L as LoaderCircle, aB as Copy, as as Send } from "../_libs/lucide-react.mjs";
import { f as format } from "../_libs/date-fns.mjs";
import { o as object, s as string, _ as _enum, a as array } from "../_libs/zod.mjs";
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
import "./orders-filter-CXWoZisU.mjs";
import "./computeOrderStage-D7ejTUnj.mjs";
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
import "../_libs/react-day-picker.mjs";
import "../_libs/date-fns__tz.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "./browser-phone-bus-CwJqzKkc.mjs";
import "./lead-transitions-BnGgq5Kd.mjs";
import "./tasks.functions-D6mit-5h.mjs";
const getLeadTimeline = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leadId: string().uuid()
}).parse(i)).handler(createSsrRpc("fecb9b24901ff281edebf8340bde67064997a73b8b8411e126686ab2336d8677"));
const ICONS = {
  activity: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "size-3.5" }),
  note: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "size-3.5" }),
  email: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-3.5" }),
  payment: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "size-3.5" }),
  onboarding: /* @__PURE__ */ jsxRuntimeExports.jsx(FilePenLine, { className: "size-3.5" }),
  document: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-3.5" }),
  analytics: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumn, { className: "size-3.5" })
};
const COLOR = {
  activity: "bg-slate-500",
  note: "bg-violet-500",
  email: "bg-sky-500",
  payment: "bg-emerald-500",
  onboarding: "bg-amber-500",
  document: "bg-indigo-500",
  analytics: "bg-rose-500"
};
function LeadTimeline({ leadId }) {
  const fn = useServerFn(getLeadTimeline);
  const { data, isLoading } = useQuery({
    queryKey: ["admin.lead.timeline", leadId],
    queryFn: () => fn({ data: { leadId } })
  });
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", style: { color: "var(--admin-fg-muted)" }, children: "Loading timeline…" });
  const items = data?.items ?? [];
  if (items.length === 0) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", style: { color: "var(--admin-fg-muted)" }, children: "No activity yet." });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "relative space-y-3 pl-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-1.5 top-1 bottom-1 w-px", style: { background: "var(--admin-border)" } }),
    items.map((it, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.li,
      {
        initial: { opacity: 0, x: -6 },
        animate: { opacity: 1, x: 0 },
        transition: { delay: Math.min(idx * 0.015, 0.4) },
        className: "relative",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `absolute -left-[14px] top-1.5 size-3 rounded-full ring-2 ring-[var(--admin-surface)] ${COLOR[it.kind]} flex items-center justify-center text-white`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "scale-[0.75]", children: ICONS[it.kind] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs", style: { color: "var(--admin-fg-muted)" }, title: new Date(it.at).toLocaleString("en-IN"), children: new Date(it.at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", style: { color: "var(--admin-fg)" }, children: it.title }),
          it.detail && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs mt-0.5", style: { color: "var(--admin-fg-muted)" }, children: it.detail })
        ]
      },
      it.id
    ))
  ] });
}
function CopyButton({ value, label = "Copy", className }) {
  const [done, setDone] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onMouseDown: (e) => e.stopPropagation(),
      onClick: async (e) => {
        e.stopPropagation();
        e.preventDefault();
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          setTimeout(() => setDone(false), 2e3);
        } catch {
        }
      },
      className: cn(
        "inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors",
        className
      ),
      children: [
        done ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5 text-green-600" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "size-3.5" }),
        done ? "Copied" : label
      ]
    }
  );
}
const approveRefund = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leadId: string().uuid(),
  policyNote: string().trim().max(2e3).optional()
}).parse(i)).handler(createSsrRpc("aaf61620faceaf5d5caa71f36233696aa4538dc557db8f4f1f608aeef52f817f"));
const markRefundProcessed = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leadId: string().uuid(),
  gatewayRef: string().trim().min(2).max(200)
}).parse(i)).handler(createSsrRpc("9573e437b1ae63bcb34e0328b56cc0c42a1cc33eea492ff5e2709a9538cd4257"));
const rejectRefund = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leadId: string().uuid(),
  reason: string().trim().min(3).max(2e3)
}).parse(i)).handler(createSsrRpc("db3cc9b5df7abcc9f0342f59301780d8f998bc5570bab41ff7257dcd5e69e901"));
const createFollowUp = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leadId: string().uuid(),
  scheduledAt: string().min(1),
  // ISO string from <input type=datetime-local>
  reason: _enum(["call_back", "documents_pending", "refund_followup", "general", "other"]),
  reasonNote: string().trim().max(500).optional(),
  assignedTo: string().uuid().nullable().optional()
}).parse(i)).handler(createSsrRpc("ff3f815eb40dc4cf12a0087b8034090c17d4ad68f387fbde80aeb24cbf8e22a2"));
const listFollowUpsForLead = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leadId: string().uuid()
}).parse(i)).handler(createSsrRpc("89e64d3af38c4fe97260d131faccea2fbda2dceacc78515f4d22adb466e2b54d"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid(),
  note: string().trim().max(2e3).optional()
}).parse(i)).handler(createSsrRpc("c8ae2564d5472e3ea5314c853ecf9d3784b7d02bd722a3499ed370c7bdd1e4d7"));
const LeadIdInput = object({
  leadId: string().uuid()
});
const createPaymentLink = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => LeadIdInput.parse(i)).handler(createSsrRpc("55e4e459df5a97de1b15a627721410bbd6db007b6b59b1b3eab4ea094ba1f21a"));
const getPaymentLinkStatusForLead = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => LeadIdInput.parse(i)).handler(createSsrRpc("653209a89d50d0dd8515bdd5ea480da2402e5e86d9d4a158bc95426db58a2cc1"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => LeadIdInput.parse(i)).handler(createSsrRpc("b65c4ab724f5f1ed296f3959f7e05191b919e8bff50e754913bd30a636ca001d"));
const sendPaymentLinkEmail = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => LeadIdInput.parse(i)).handler(createSsrRpc("c1edb9a1c3a5f91827d0c6f694520cfd580aba2ebeed3ea28a3b3b8e6f7f2e83"));
const SelectInput = object({
  leadId: string().uuid(),
  serviceId: string().uuid()
});
const LeadOnlyInput = object({
  leadId: string().uuid()
});
const selectConsultationService = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => SelectInput.parse(i)).handler(createSsrRpc("0bb0e419c89be14323e6b6e3c8f36bf2c134fec5be88beb9c37f6ef9919e0029"));
const sendConsultationPaymentLink = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => LeadOnlyInput.parse(i)).handler(createSsrRpc("2fa82cc37dda12c84554a97d188c2c7f6f9eb19a6b5bfb16b46a7ff3832dc8ff"));
const resetConsultationSelection = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => LeadOnlyInput.parse(i)).handler(createSsrRpc("f4ecd300564fbbcf870139dd7ad6854828be6d370f5c200c552c0ae77248d813"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => SelectInput.parse(i)).handler(createSsrRpc("6b3b6c642601f5d318ccda6d2fa4f4ac2a0db5fd6c3c5842e28f2a3c19667862"));
function ConvertConsultationPanel(props) {
  if (props.mode === "awaiting_payment") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AwaitingPaymentStep, { ...props });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SelectServiceStep, { ...props });
}
function SelectServiceStep({ leadId, leadCode }) {
  const qc = useQueryClient();
  const listFn = useServerFn(listServices);
  const selectFn = useServerFn(selectConsultationService);
  const [serviceId, setServiceId] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["admin.services.active"],
    queryFn: () => listFn()
  });
  const services = reactExports.useMemo(
    () => (data?.rows ?? []).filter(
      (s) => s.is_active && s.service_name !== "Expert Consultation" && isVisibleService(s)
    ).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [data]
  );
  const onSave = async () => {
    if (!serviceId) {
      toast.error("Please pick a service first.");
      return;
    }
    setBusy(true);
    try {
      await selectFn({ data: { leadId, serviceId } });
      toast.success("Service saved. Now send or copy the payment link.");
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["admin.order"] }),
        qc.invalidateQueries({ queryKey: ["admin.lead-detail", leadId] }),
        qc.invalidateQueries({ queryKey: ["admin.lead-events", leadId] }),
        qc.invalidateQueries({ queryKey: ["admin.payment-link", leadId] }),
        qc.invalidateQueries({ queryKey: ["lead", leadCode] })
      ]);
    } catch (e) {
      toast.error(e?.message ?? "Could not save service.");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-lg border bg-amber-50 p-4 space-y-3",
      style: { borderColor: "rgb(252 211 77)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-4 text-amber-700" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-amber-900", children: "Step 1 · Set Customer's Service" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-800/90", children: "Customer booked a paid Expert Consultation. After the call, pick the service they actually need. We'll mint a payment link — you'll send or copy it in the next step." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: serviceId, onValueChange: setServiceId, disabled: busy || isLoading, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isLoading ? "Loading services…" : "Select service" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: services.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.id, children: s.service_name }, s.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: onSave,
            disabled: busy || !serviceId,
            size: "sm",
            className: "w-full bg-amber-600 hover:bg-amber-700 text-white",
            children: [
              busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin mr-1.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-4 mr-1.5" }),
              "Save Service & Generate Link"
            ]
          }
        )
      ]
    }
  );
}
function AwaitingPaymentStep({ leadId, leadCode, customerName, customerMobile, service, totalAmount }) {
  const qc = useQueryClient();
  const role = useRole();
  const hideAmount = role.hideMoney();
  const statusFn = useServerFn(getPaymentLinkStatusForLead);
  const sendFn = useServerFn(sendConsultationPaymentLink);
  const resetFn = useServerFn(resetConsultationSelection);
  const [busy, setBusy] = reactExports.useState(false);
  const [lastSentAt, setLastSentAt] = reactExports.useState(null);
  const [resetOpen, setResetOpen] = reactExports.useState(false);
  const { data, refetch, isFetching } = useQuery({
    queryKey: ["admin.payment-link", leadId],
    queryFn: () => statusFn({ data: { leadId } }),
    refetchInterval: 15e3
  });
  reactExports.useEffect(() => {
    if (data?.paid) {
      qc.invalidateQueries({ queryKey: ["admin.order"] });
      qc.invalidateQueries({ queryKey: ["admin.lead-detail", leadId] });
      qc.invalidateQueries({ queryKey: ["admin.lead-events", leadId] });
      qc.invalidateQueries({ queryKey: ["lead", leadCode] });
    }
  }, [data?.paid, leadId, leadCode, qc]);
  if (data?.paid) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-emerald-50 border-emerald-200 p-4 space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-emerald-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Payment Received" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-emerald-700", children: "The onboarding form will now be shown to the customer." })
    ] });
  }
  const link = data?.link;
  const total = Number(totalAmount ?? link?.amount ?? 0);
  const waText = link ? `Dear ${customerName ?? "Customer"}, here is your secure payment link for ${service ?? "your service"}: ${link.payment_url}` : "";
  const waHref = customerMobile && link ? `https://wa.me/91${String(customerMobile).replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(waText)}` : null;
  const canSend = !!link && (!lastSentAt || Date.now() - lastSentAt > 6e4);
  const onCopy = () => {
    if (!link) return;
    navigator.clipboard.writeText(link.payment_url).then(
      () => toast.success("Payment link copied"),
      () => toast.error("Copy failed")
    );
  };
  const onSend = async () => {
    if (!canSend) {
      toast.info("Please wait a moment before resending.");
      return;
    }
    setBusy(true);
    try {
      await sendFn({ data: { leadId } });
      setLastSentAt(Date.now());
      toast.success("Payment link emailed to customer");
    } catch (e) {
      toast.error(e?.message ?? "Send failed");
    } finally {
      setBusy(false);
    }
  };
  const onReset = async () => {
    setResetOpen(false);
    setBusy(true);
    try {
      await resetFn({ data: { leadId } });
      toast.success("Selection cleared. Pick the correct service.");
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["admin.order"] }),
        qc.invalidateQueries({ queryKey: ["admin.lead-detail", leadId] }),
        qc.invalidateQueries({ queryKey: ["admin.payment-link", leadId] })
      ]);
    } catch (e) {
      toast.error(e?.message ?? "Could not reset");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-lg border bg-amber-50 p-4 space-y-3",
      style: { borderColor: "rgb(252 211 77)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "size-4 text-amber-700" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-amber-900", children: "Step 2 · Share Payment Link" })
          ] }),
          isFetching && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 animate-spin text-amber-700/60" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-amber-900/85 rounded-md bg-white/70 p-2.5 border border-amber-200 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Service" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: service ?? "—" })
          ] }),
          !hideAmount && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-semibold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
              "₹",
              total.toFixed(2)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-amber-900/70 pt-1", children: "Customer onboarding form will appear automatically once this payment succeeds." })
        ] }),
        !link ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md bg-white border border-amber-200 px-3 py-2 text-xs text-amber-800", children: 'No active payment link. Use "Change Service" to re-select.' }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { readOnly: true, value: link.payment_url, className: "font-mono text-xs h-9 bg-white" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: onCopy, className: "px-2.5 h-9 bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "size-3.5" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: onSend,
                disabled: busy || !canSend,
                size: "sm",
                className: "bg-amber-600 hover:bg-amber-700 text-white",
                children: [
                  busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin mr-1.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-4 mr-1.5" }),
                  lastSentAt ? "Resend Email" : "Send Payment Link"
                ]
              }
            ),
            waHref ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: waHref,
                target: "_blank",
                rel: "noreferrer",
                className: "inline-flex items-center justify-center gap-1.5 h-9 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "size-3.5" }),
                  " WhatsApp"
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: onCopy, className: "bg-white", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "size-3.5 mr-1.5" }),
              " Copy Link"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-amber-900/70", children: link?.created_at ? `Link generated ${new Date(link.created_at).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}` : "" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setResetOpen(true),
              disabled: busy,
              className: "inline-flex items-center gap-1 text-[11px] font-medium text-amber-900 hover:text-amber-700",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-3" }),
                " Change Service"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: resetOpen, onOpenChange: setResetOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Change customer's service?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "The current payment link will be voided. You'll be able to pick a different service. The original consultation payment is not affected." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setResetOpen(false), children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: onReset, children: "Yes, change service" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => refetch(),
            className: "hidden",
            "aria-hidden": true
          }
        )
      ]
    }
  );
}
const ChannelEnum = _enum(["whatsapp", "email", "call", "note", "sms"]);
const OutcomeEnum = _enum(["connected", "no_answer", "wrong_number", "not_interested", "callback", "converted_intent", "sent"]);
const logLeadContact = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leadId: string().uuid(),
  channel: ChannelEnum.optional(),
  channels: array(ChannelEnum).optional(),
  outcome: OutcomeEnum.optional(),
  outcomes: array(OutcomeEnum).optional(),
  notes: string().max(2e3).optional()
}).parse(i)).handler(createSsrRpc("80587d4fb56b144aae5ab5ea345eb24aefcb446046f09c4e0885a63f469701db"));
const listContactEvents = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leadId: string().uuid()
}).parse(i)).handler(createSsrRpc("58b7a91d1610182e8b4371a6ee55962832af58180208f9764d474149445d9274"));
const RangeInput = object({
  from: string().optional(),
  to: string().optional()
});
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => RangeInput.parse(i)).handler(createSsrRpc("613133925adc584283d224cecd52db52623fca6aadd402cdafada966b2c61c13"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => RangeInput.parse(i)).handler(createSsrRpc("6ecd1857d303905d3ce4fc2f22439ed01140df31740f9060866ed04e3af08849"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  userId: string().uuid(),
  from: string().optional(),
  to: string().optional()
}).parse(i)).handler(createSsrRpc("3048daadd91322fa0a933fbb967fa5958c6067bcdcc67c13a0e4f7b622fd3108"));
const CHANNELS = ["call", "whatsapp", "email", "sms", "note"];
const OUTCOMES = [
  { value: "connected", label: "Connected" },
  { value: "no_answer", label: "No answer" },
  { value: "wrong_number", label: "Wrong number" },
  { value: "not_interested", label: "Not interested" },
  { value: "callback", label: "Callback scheduled" },
  { value: "converted_intent", label: "Ready to pay" },
  { value: "sent", label: "Message sent" }
];
function LogContactDialog({
  leadId,
  open,
  onOpenChange
}) {
  const [channels, setChannels] = reactExports.useState(["call"]);
  const [outcomes, setOutcomes] = reactExports.useState(["connected"]);
  const [notes, setNotes] = reactExports.useState("");
  const qc = useQueryClient();
  const fn = useServerFn(logLeadContact);
  const m = useMutation({
    mutationFn: () => fn({ data: { leadId, channel: channels[0], channels, outcomes, notes: notes.trim() || void 0 } }),
    onSuccess: () => {
      toast.success("Feedback saved");
      qc.invalidateQueries({ queryKey: ["admin.lead-events", leadId] });
      qc.invalidateQueries({ queryKey: ["admin.lead-contact-events", leadId] });
      qc.invalidateQueries({ queryKey: ["perf.me"] });
      setNotes("");
      onOpenChange(false);
    },
    onError: (e) => toast.error(e?.message ?? "Failed")
  });
  const toggleChannel = (value) => {
    setChannels((prev) => {
      if (prev.includes(value)) {
        if (prev.length <= 1) return prev;
        return prev.filter((c) => c !== value);
      }
      return [...prev, value];
    });
  };
  const toggleOutcome = (value) => {
    setOutcomes((prev) => {
      if (prev.includes(value)) {
        if (prev.length <= 1) return prev;
        return prev.filter((o) => o !== value);
      }
      return [...prev, value];
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Log contact attempt" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Channel (select multiple)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400", children: "Click to select multiple" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 flex flex-wrap gap-1.5", children: CHANNELS.map((c) => {
          const isSelected = channels.includes(c);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => toggleChannel(c),
              className: `px-2.5 py-1 rounded-md border text-xs capitalize transition-colors ${isSelected ? "bg-slate-900 text-white border-slate-900 font-medium" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`,
              children: [
                c,
                " ",
                isSelected && "✓"
              ]
            },
            c
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Outcome (select multiple)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400", children: "Click to select multiple" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 flex flex-wrap gap-1.5", children: OUTCOMES.map((o) => {
          const isSelected = outcomes.includes(o.value);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => toggleOutcome(o.value),
              className: `px-2.5 py-1 rounded-md border text-xs transition-colors ${isSelected ? "bg-indigo-600 text-white border-indigo-600 font-medium" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`,
              children: [
                o.label,
                " ",
                isSelected && "✓"
              ]
            },
            o.value
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Notes (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: notes, onChange: (e) => setNotes(e.target.value), rows: 3, placeholder: "What did the customer say?" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { disabled: m.isPending, onClick: () => m.mutate(), children: m.isPending ? "Saving…" : "Save" })
    ] })
  ] }) });
}
function LeadWorkspacePanel({
  lead,
  applications,
  staff
}) {
  const currentStatus = lead.lead_status_v2 ?? "new_lead";
  const role = useRole();
  const hideMoney = role.hideMoney();
  const hasPaidOrder = (applications ?? []).some(
    (a) => a?.application_status && !["awaiting_payment", "payment_pending", "payment_failed", "cancelled"].includes(a.application_status)
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    (currentStatus === "refund_requested" || currentStatus === "refund_approved") && /* @__PURE__ */ jsxRuntimeExports.jsx(RefundDecisionPanel, { lead, currentStatus }),
    isUnconvertedConsultationLead(lead) && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConvertConsultationPanel,
      {
        leadId: lead.id,
        leadCode: lead.lead_code,
        mode: "select",
        customerName: lead.name,
        customerMobile: lead.mobile ?? null,
        service: lead.service ?? null,
        totalAmount: lead.total_amount != null ? Number(lead.total_amount) : null
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 grid-cols-1 lg:grid-cols-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-7", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CustomerQuickCard, { lead }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QuickActionsCard, { lead, currentStatus, hideMoney }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FollowUpScheduler, { leadId: lead.id, staff }) }),
      hasPaidOrder && applications.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LinkedOrderPanel, { applications, hideMoney }) })
    ] })
  ] });
}
function relativeTime(iso) {
  if (!iso) return null;
  const diffMs = Date.now() - new Date(iso).getTime();
  if (diffMs < 0) return null;
  const min = Math.floor(diffMs / 6e4);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  return `${d}d ago`;
}
function buildIntroMessage(customerName, employeeName, leadCode, service) {
  const emp = employeeName || "the Udyam Aadhar Advisory team";
  return `Hi ${customerName}

I'm ${emp} from Udyam Aadhar Advisory.

Lead ID: ${leadCode}   Service: ${service ?? "your service"}

I'm here to assist you with any questions regarding your service.

 Office Hours: 10:00 AM – 6:00 PM

Simply reply to this message or contact us anytime during office hours.`;
}
function buildPaymentLinkMessage(customerName, employeeName, leadCode, service, paymentUrl) {
  const emp = employeeName || "the Udyam Aadhar Advisory team";
  return `Hi ${customerName}

I'm ${emp} from Udyam Aadhar Advisory.

Lead ID: ${leadCode}   Service: ${service ?? "your service"}

Payment Link: ${paymentUrl}

I'm here to assist you with any questions regarding your service.

 Office Hours: 10:00 AM – 6:00 PM

Simply reply to this message or contact us anytime during office hours.`;
}
function waNumber(mobile) {
  const digits = (mobile ?? "").replace(/\D/g, "");
  if (!digits) return "";
  return digits.length === 10 ? "91" + digits : digits;
}
function whatsappUrl(number, message) {
  return `https://api.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(message)}`;
}
function openWhatsApp(url, preparedWindow) {
  if (preparedWindow && !preparedWindow.closed) {
    preparedWindow.location.replace(url);
    return;
  }
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (!opened) window.location.assign(url);
}
function readPaymentUrl(value) {
  return value?.payment_url ?? value?.url ?? value?.short_url ?? value?.link?.payment_url ?? value?.link?.url ?? value?.link?.short_url ?? null;
}
function CustomerQuickCard({ lead }) {
  const number = waNumber(lead.mobile);
  const waUrl = number ? `https://wa.me/${number}` : null;
  const total = lead.total_amount != null ? Number(lead.total_amount) : null;
  const sourceLabel = formatLeadSource(lead.lead_source);
  const rel = relativeTime(lead.created_at);
  const labelCls = "text-[10px] uppercase tracking-wider text-slate-500 font-semibold";
  const valueCls = "text-sm font-semibold text-slate-900 truncate";
  const initials = (lead.name || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase()).join("");
  const kv = (label, value) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5 min-w-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: labelCls, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: valueCls, children: value ?? "—" })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-2xl border bg-white overflow-hidden shadow-sm",
      style: { borderColor: "var(--admin-border)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative bg-gradient-to-br from-indigo-600 via-indigo-500 to-sky-500 text-white px-4 py-4 sm:px-5 sm:py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 sm:size-14 shrink-0 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center text-lg sm:text-xl font-bold", children: initials }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-white/70 font-semibold", children: "Customer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg sm:text-xl font-bold leading-tight truncate", children: lead.name }),
            lead.mobile ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: `tel:${lead.mobile}`,
                className: "mt-1 inline-flex items-center gap-1.5 text-base sm:text-lg font-semibold tabular-nums hover:underline",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "size-4 opacity-80" }),
                  lead.mobile
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm text-white/70", children: "No mobile on file" })
          ] }),
          lead.mobile && /* @__PURE__ */ jsxRuntimeExports.jsx(
            CopyButton,
            {
              value: lead.mobile,
              label: "",
              className: "text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border-white/25"
            }
          )
        ] }) }),
        lead.mobile ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 border-b border-slate-100 bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CallButton, { mobile: lead.mobile, leadId: lead.id, customerId: lead.customer_id ?? null, className: "w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition" }) }) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 border-b border-slate-100", children: [
          lead.mobile ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: `tel:${lead.mobile}`,
              className: "flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-3 text-xs sm:text-sm font-semibold text-indigo-700 bg-indigo-50 active:bg-indigo-100 hover:bg-indigo-100 transition-colors border-r border-slate-100",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "size-4" }),
                " Call"
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "border-r border-slate-100" }),
          waUrl ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: waUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-3 text-xs sm:text-sm font-semibold text-emerald-700 bg-emerald-50 active:bg-emerald-100 hover:bg-emerald-100 transition-colors border-r border-slate-100",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "size-4" }),
                " WhatsApp"
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "border-r border-slate-100" }),
          lead.email ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: `mailto:${lead.email}`,
              className: "flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-3 text-xs sm:text-sm font-semibold text-sky-700 bg-sky-50 active:bg-sky-100 hover:bg-sky-100 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-4" }),
                " Email"
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", {})
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 grid gap-3 grid-cols-1 sm:grid-cols-2", children: [
          kv("Service", lead.service),
          kv("Price", total != null ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums", children: [
            "₹",
            total.toLocaleString("en-IN")
          ] }) : null),
          kv("State", lead.state),
          kv("Language", lead.language),
          kv(
            "Email",
            lead.email ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", title: lead.email, children: lead.email }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CopyButton, { value: lead.email, label: "" })
            ] }) : null
          ),
          kv(
            "Submitted",
            lead.created_at ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex flex-wrap items-baseline gap-x-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatIST(lead.created_at) }),
              rel && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal text-slate-500", children: rel })
            ] }) : null
          )
        ] }),
        sourceLabel && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-4 py-2 border-t border-slate-100 text-[11px] text-slate-500 font-mono truncate",
            title: sourceLabel,
            children: [
              "Source: ",
              sourceLabel
            ]
          }
        ),
        lead.customer_id && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: `/admin/customers/${lead.customer_id}`,
            className: "block text-xs text-indigo-600 hover:underline px-4 py-2 border-t border-slate-100",
            children: "Open customer 360 →"
          }
        )
      ]
    }
  );
}
function QuickActionsCard({
  lead,
  currentStatus,
  hideMoney
}) {
  const qc = useQueryClient();
  const transitionFn = useServerFn(transitionLeadStatus);
  const createLinkFn = useServerFn(createPaymentLink);
  const linkStatusFn = useServerFn(getPaymentLinkStatusForLead);
  const sendPaymentEmailFn = useServerFn(sendPaymentLinkEmail);
  const role = useRole();
  const employeeName = role.displayName;
  const [contactBusy, setContactBusy] = reactExports.useState(false);
  const [linkBusy, setLinkBusy] = reactExports.useState(false);
  const [logOpen, setLogOpen] = reactExports.useState(false);
  const { data: linkStatus } = useQuery({
    queryKey: ["lead.paymentLink", lead.id],
    queryFn: () => linkStatusFn({ data: { leadId: lead.id } }),
    staleTime: 3e4
  });
  const paymentUrl = readPaymentUrl(linkStatus);
  const number = waNumber(lead.mobile);
  const introMsg = buildIntroMessage(lead.name, employeeName, lead.lead_code, lead.service ?? null);
  const introWaUrl = number ? whatsappUrl(number, introMsg) : null;
  const toggleContacted = async () => {
    const next = currentStatus === "contacted" ? "new_lead" : "contacted";
    setContactBusy(true);
    try {
      await transitionFn({ data: { leadId: lead.id, toStatus: next } });
      toast.success(next === "contacted" ? "Marked as Contacted" : "Marked as New Lead");
      qc.invalidateQueries({ queryKey: ["admin.lead", lead.id] });
      qc.invalidateQueries({ queryKey: ["admin.lead-events", lead.id] });
      qc.invalidateQueries({ queryKey: ["admin.leads"] });
    } catch (e) {
      toast.error(e?.message ?? "Failed");
    } finally {
      setContactBusy(false);
    }
  };
  const contactOnWhatsApp = () => {
    if (!number) {
      toast.error("Add a mobile number first");
      return;
    }
    if (!introWaUrl) return;
    openWhatsApp(introWaUrl);
  };
  const ensurePaymentUrl = async () => {
    if (paymentUrl) return paymentUrl;
    setLinkBusy(true);
    try {
      const res = await createLinkFn({ data: { leadId: lead.id } });
      const url = readPaymentUrl(res);
      await qc.invalidateQueries({ queryKey: ["lead.paymentLink", lead.id] });
      return url;
    } catch (e) {
      toast.error(e?.message ?? "Failed to generate link");
      return null;
    } finally {
      setLinkBusy(false);
    }
  };
  const generateLink = async () => {
    const url = await ensurePaymentUrl();
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Payment link copied");
    } catch {
      toast.success("Payment link generated");
    }
  };
  const sendPaymentLinkWhatsApp = async () => {
    if (!number) {
      toast.error("Add a mobile number first");
      return;
    }
    if (paymentUrl) {
      const msg2 = buildPaymentLinkMessage(lead.name, employeeName, lead.lead_code, lead.service ?? null, paymentUrl);
      openWhatsApp(whatsappUrl(number, msg2));
      return;
    }
    const waWin = window.open("about:blank", "_blank");
    const url = await ensurePaymentUrl();
    if (!url) {
      waWin?.close();
      return;
    }
    const msg = buildPaymentLinkMessage(lead.name, employeeName, lead.lead_code, lead.service ?? null, url);
    openWhatsApp(whatsappUrl(number, msg), waWin);
  };
  const sendPaymentLinkEmail$1 = async () => {
    if (!lead.email) {
      toast.error("Add a customer email first");
      return;
    }
    setLinkBusy(true);
    try {
      const res = await sendPaymentEmailFn({ data: { leadId: lead.id } });
      toast.success(res.message || `Payment link email sent to ${lead.email}`);
      qc.invalidateQueries({ queryKey: ["lead.paymentLink", lead.id] });
      qc.invalidateQueries({ queryKey: ["admin.lead-events", lead.id] });
    } catch (e) {
      toast.error(e?.message ?? "Failed to send payment link email");
    } finally {
      setLinkBusy(false);
    }
  };
  const isContacted = currentStatus === "contacted";
  const showContactToggle = currentStatus === "new_lead" || currentStatus === "contacted";
  const btnBase = "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-2 text-xs font-medium justify-start transition-colors";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl border bg-white p-4 space-y-3 h-full shadow-sm",
      style: { borderColor: "var(--admin-border)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-4 text-slate-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Quick Actions" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
          showContactToggle && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              disabled: contactBusy,
              onClick: toggleContacted,
              className: `justify-start text-xs ${isContacted ? "bg-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3.5 mr-1.5" }),
                contactBusy ? "Updating…" : isContacted ? "Contacted ✓ (undo)" : "Mark as Contacted"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              disabled: !number,
              onClick: contactOnWhatsApp,
              className: `${btnBase} border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "size-3.5" }),
                "Send Message on WhatsApp"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => setLogOpen(true), className: "justify-start text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "size-3.5 mr-1.5" }),
            "Add Customer Feedback"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogContactDialog, { leadId: lead.id, open: logOpen, onOpenChange: setLogOpen }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FeedbackList, { leadId: lead.id }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 pt-2 border-t border-slate-100 text-[10px] uppercase tracking-wider text-slate-500 font-semibold", children: "Payment Link" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                disabled: !number || linkBusy,
                onClick: sendPaymentLinkWhatsApp,
                className: `${btnBase} border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "size-3.5" }),
                  linkBusy && !paymentUrl ? "Preparing…" : "Send Payment Link via WhatsApp"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                disabled: !lead.email || linkBusy,
                onClick: sendPaymentLinkEmail$1,
                className: `${btnBase} border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 disabled:opacity-50 disabled:cursor-not-allowed`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-3.5" }),
                  linkBusy && !paymentUrl ? "Preparing…" : "Send Payment Link via Email"
                ]
              }
            ),
            paymentUrl ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[11px] text-slate-600 bg-slate-50 border rounded px-2 py-1.5 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "size-3 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate flex-1", title: paymentUrl, children: paymentUrl }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CopyButton, { value: paymentUrl, label: "" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                disabled: linkBusy,
                onClick: generateLink,
                className: "justify-start text-xs",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "size-3.5 mr-1.5" }),
                  linkBusy ? "Preparing…" : "Copy Payment Link"
                ]
              }
            )
          ] })
        ] }),
        !lead.email && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1.5", children: "Add a customer email to enable email actions." }),
        !lead.mobile && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1.5", children: "Add a mobile number to enable WhatsApp actions." })
      ]
    }
  );
}
const OUTCOME_LABEL = {
  connected: "Connected",
  no_answer: "No answer",
  wrong_number: "Wrong number",
  not_interested: "Not interested",
  callback: "Callback scheduled",
  converted_intent: "Ready to pay",
  sent: "Message sent"
};
const OUTCOME_TONE = {
  connected: "bg-emerald-50 text-emerald-700 border-emerald-200",
  callback: "bg-amber-50 text-amber-700 border-amber-200",
  converted_intent: "bg-indigo-50 text-indigo-700 border-indigo-200",
  sent: "bg-sky-50 text-sky-700 border-sky-200",
  no_answer: "bg-slate-50 text-slate-700 border-slate-200",
  wrong_number: "bg-rose-50 text-rose-700 border-rose-200",
  not_interested: "bg-rose-50 text-rose-700 border-rose-200"
};
function FeedbackList({ leadId }) {
  const fn = useServerFn(listContactEvents);
  const { data, isLoading } = useQuery({
    queryKey: ["admin.lead-contact-events", leadId],
    queryFn: () => fn({ data: { leadId } })
  });
  const rows = data?.rows ?? [];
  const [expanded, setExpanded] = reactExports.useState(false);
  const visible = expanded ? rows : rows.slice(0, 3);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 pt-2 border-t border-slate-100 space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] uppercase tracking-wider text-slate-500 font-semibold", children: [
        "Recent Feedback ",
        rows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-400", children: [
          "(",
          rows.length,
          ")"
        ] })
      ] }),
      rows.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setExpanded((v) => !v),
          className: "text-[11px] text-indigo-600 hover:text-indigo-700",
          children: expanded ? "Show less" : `Show all`
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400", children: "Loading…" }) : rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400 italic", children: "No feedback logged yet. Use “Add Customer Feedback” to record a call or note." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: visible.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded-md border border-slate-200 bg-slate-50/70 p-2 text-[11px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center flex-wrap gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1.5 py-0.5 rounded border bg-white text-slate-700 capitalize text-[10px] font-medium", children: r.channel }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `px-1.5 py-0.5 rounded border text-[10px] font-medium ${OUTCOME_TONE[r.outcome] ?? "bg-slate-50 text-slate-700 border-slate-200"}`,
            children: OUTCOME_LABEL[r.outcome] ?? r.outcome
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-slate-500 tabular-nums", children: formatIST(r.created_at) })
      ] }),
      r.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-slate-700 whitespace-pre-wrap leading-snug", children: r.notes }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 text-[10px] text-slate-400", children: [
        "by ",
        r.staff_name
      ] })
    ] }, r.id)) })
  ] });
}
function RefundDecisionPanel({ lead, currentStatus }) {
  const qc = useQueryClient();
  const role = useRole();
  const approveFn = useServerFn(approveRefund);
  const processedFn = useServerFn(markRefundProcessed);
  const rejectFn = useServerFn(rejectRefund);
  const mayApprove = role.canApproveRefund();
  const [policyNote, setPolicyNote] = reactExports.useState("");
  const [eligible, setEligible] = reactExports.useState(false);
  const [gatewayRef, setGatewayRef] = reactExports.useState("");
  const [rejectReason, setRejectReason] = reactExports.useState("");
  const [rejectOpen, setRejectOpen] = reactExports.useState(false);
  const [busy, setBusy] = reactExports.useState(false);
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin.lead", lead.id] });
    qc.invalidateQueries({ queryKey: ["admin.lead-events", lead.id] });
  };
  const onApprove = async () => {
    if (!confirm(`Approve refund for ${lead.name}?`)) return;
    setBusy(true);
    try {
      await approveFn({ data: { leadId: lead.id, policyNote: policyNote || void 0 } });
      toast.success("Refund approved");
      refresh();
    } catch (e) {
      toast.error(e?.message ?? "Failed");
    } finally {
      setBusy(false);
    }
  };
  const onProcessed = async () => {
    if (!gatewayRef.trim()) {
      toast.error("Gateway reference required");
      return;
    }
    if (!confirm("Confirm refund has been processed at the payment gateway?")) return;
    setBusy(true);
    try {
      await processedFn({ data: { leadId: lead.id, gatewayRef: gatewayRef.trim() } });
      toast.success("Refund processed. Documents will be deleted.");
      refresh();
    } catch (e) {
      toast.error(e?.message ?? "Failed");
    } finally {
      setBusy(false);
    }
  };
  const onReject = async () => {
    if (rejectReason.trim().length < 3) {
      toast.error("Reason required");
      return;
    }
    setBusy(true);
    try {
      await rejectFn({ data: { leadId: lead.id, reason: rejectReason.trim() } });
      toast.success("Refund rejected");
      setRejectOpen(false);
      refresh();
    } catch (e) {
      toast.error(e?.message ?? "Failed");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-amber-50/50 p-5 space-y-3", style: { borderColor: "var(--admin-border)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "size-4 text-amber-700" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-amber-900", children: "Refund Decision" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Customer's stated reason / staff policy note" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          value: policyNote,
          onChange: (e) => setPolicyNote(e.target.value),
          placeholder: "Refund policy note: e.g. eligible per 7-day window, customer never accessed onboarding…",
          rows: 3,
          disabled: currentStatus === "refund_approved"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "checkbox",
          checked: eligible,
          onChange: (e) => setEligible(e.target.checked),
          disabled: currentStatus === "refund_approved"
        }
      ),
      "Customer is refund-eligible per policy"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 pt-1", children: [
      currentStatus === "refund_requested" && mayApprove && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: onApprove, disabled: busy || !eligible, className: "bg-emerald-600 hover:bg-emerald-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4 mr-1" }),
          " Approve Refund"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => setRejectOpen(true), disabled: busy, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-4 mr-1" }),
          " Reject Refund"
        ] })
      ] }),
      currentStatus === "refund_requested" && !mayApprove && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs rounded-md bg-amber-100/70 border border-amber-200 text-amber-900 px-3 py-2", children: "Only Manager, Admin, or Super Admin can approve or reject refunds." }),
      currentStatus === "refund_approved" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md bg-emerald-50 border border-emerald-200 p-2 text-xs text-emerald-800", children: "✓ Refund approved. Process via the payment gateway, then enter the gateway reference below." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: gatewayRef,
              onChange: (e) => setGatewayRef(e.target.value),
              placeholder: "Gateway reference number (e.g. PAYU_REF_XXXX)",
              className: "flex-1"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: onProcessed, disabled: busy || gatewayRef.trim().length < 2, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4 mr-1" }),
            " Mark Processed"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] rounded-md border border-rose-200 bg-rose-50 text-rose-800 px-2 py-1.5 font-medium", children: "⚠ Marking processed will PERMANENTLY DELETE all customer documents from storage (certificates excluded). This cannot be undone." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: rejectOpen, onOpenChange: setRejectOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Reject Refund" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs", children: [
          "Reason for rejection ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: rejectReason, onChange: (e) => setRejectReason(e.target.value), rows: 4 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setRejectOpen(false), disabled: busy, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: onReject, disabled: busy, children: "Reject" })
      ] })
    ] }) })
  ] });
}
function FollowUpScheduler({ leadId, staff }) {
  const role = useRole();
  const canAssign = role.hasAny(["super_admin", "admin", "manager"]);
  const qc = useQueryClient();
  const createFn = useServerFn(createFollowUp);
  const listFn = useServerFn(listFollowUpsForLead);
  const { data } = useQuery({
    queryKey: ["admin.followups", leadId],
    queryFn: () => listFn({ data: { leadId } })
  });
  const [date, setDate] = reactExports.useState(() => /* @__PURE__ */ new Date());
  const [time, setTime] = reactExports.useState("10:00");
  const [reason, setReason] = reactExports.useState("call_back");
  const [reasonNote, setReasonNote] = reactExports.useState("");
  const [assignedTo, setAssignedTo] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const [dateOpen, setDateOpen] = reactExports.useState(false);
  const scheduledAt = reactExports.useMemo(() => {
    if (!date) return "";
    const [h, m] = time.split(":").map((n) => parseInt(n, 10) || 0);
    const dt = new Date(date);
    dt.setHours(h, m, 0, 0);
    return dt.toISOString();
  }, [date, time]);
  const timeOptions = reactExports.useMemo(() => {
    const out = [];
    for (let h = 9; h <= 19; h++) {
      for (const m of [0, 15, 30, 45]) {
        out.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      }
    }
    return out;
  }, []);
  const submit = async () => {
    if (!scheduledAt) {
      toast.error("Pick a date & time");
      return;
    }
    setBusy(true);
    try {
      await createFn({ data: { leadId, scheduledAt, reason, reasonNote: reasonNote.trim() || void 0, assignedTo: assignedTo || null } });
      setDate(/* @__PURE__ */ new Date());
      setTime("10:00");
      setReason("call_back");
      setReasonNote("");
      setAssignedTo("");
      qc.invalidateQueries({ queryKey: ["admin.followups", leadId] });
      qc.invalidateQueries({ queryKey: ["admin.lead", leadId] });
      toast.success("Follow-up scheduled");
    } catch (e) {
      toast.error(e?.message ?? "Failed");
    } finally {
      setBusy(false);
    }
  };
  const upcoming = (data?.rows ?? []).filter((r) => !r.is_completed);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-white p-4 space-y-3 shadow-sm", style: { borderColor: "var(--admin-border)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-4 text-slate-600" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Schedule Follow-up" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] text-slate-500", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open: dateOpen, onOpenChange: setDateOpen, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: cn("w-full justify-start text-left font-normal text-xs", !date && "text-muted-foreground"),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "mr-1.5 size-3.5" }),
                date ? format(date, "dd/MM/yyyy") : "Pick a date"
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { className: "w-auto p-0 pointer-events-auto", align: "start", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Calendar$1,
            {
              mode: "single",
              selected: date,
              onSelect: (d) => {
                setDate(d);
                setDateOpen(false);
              },
              disabled: (d) => d < new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0)),
              initialFocus: true,
              className: "p-3 pointer-events-auto"
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] text-slate-500", children: "Time (IST)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              value: time,
              onChange: (e) => setTime(e.target.value),
              className: "w-full rounded-md border px-7 py-1.5 text-xs bg-white h-8 tabular-nums",
              children: timeOptions.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t, children: t }, t))
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] text-slate-500", children: "Reason" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: reason,
            onChange: (e) => setReason(e.target.value),
            className: "w-full rounded-md border px-2 py-1.5 text-xs bg-white h-8",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "call_back", children: "Call Back" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "documents_pending", children: "Documents Pending" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "refund_followup", children: "Refund Follow-up" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "general", children: "General" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "other", children: "Other" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 sm:col-span-2 lg:col-span-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] text-slate-500", children: "Additional note (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: reasonNote,
            onChange: (e) => setReasonNote(e.target.value),
            placeholder: reason === "other" ? "Describe the reason…" : "Any extra context for this follow-up",
            className: "text-xs h-8",
            maxLength: 500
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] text-slate-500", children: canAssign ? "Assign to" : "Action" }),
        canAssign ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: assignedTo,
            onChange: (e) => setAssignedTo(e.target.value),
            className: "w-full rounded-md border px-2 py-1.5 text-xs bg-white h-8",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Myself" }),
              staff.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.id, children: s.display_name || s.email }, s.id))
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", className: "w-full h-8", disabled: busy || !date, onClick: submit, children: busy ? "Saving…" : "Schedule" })
      ] }),
      canAssign && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:col-span-2 lg:col-span-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", className: "w-full", disabled: busy || !date, onClick: submit, children: busy ? "Saving…" : "Schedule Follow-up" }) })
    ] }),
    upcoming.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 border-t", style: { borderColor: "var(--admin-border)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-wider text-slate-500 mb-1.5", children: "Upcoming" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: upcoming.slice(0, 5).map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-xs flex items-start gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "size-3 mt-0.5 text-slate-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: formatIST(f.scheduled_at) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-500 capitalize", children: f.reason.replace(/_/g, " ") })
        ] })
      ] }, f.id)) })
    ] })
  ] });
}
function LinkedOrderPanel({ applications, hideMoney = false }) {
  if (!applications || applications.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-white p-4", style: { borderColor: "var(--admin-border)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold mb-1", children: "Linked Order" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 italic", children: "No order linked yet." })
    ] });
  }
  const app = applications[0];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-white p-4 space-y-2", style: { borderColor: "var(--admin-border)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-4 text-slate-600" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Linked Order" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Order #", v: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: app.application_code }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Row,
        {
          k: "Fulfillment",
          v: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px]", children: (app.fulfillment_status ?? app.application_status ?? "—").replace(/_/g, " ") })
        }
      ),
      !hideMoney && /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Total", v: `₹${Number(app.total_amount ?? 0).toLocaleString("en-IN")}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `/admin/applications/${app.id}`, className: "block text-xs text-blue-600 hover:underline pt-1", children: "Open order →" })
    ] })
  ] });
}
function Row({ k, v }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: k }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-800 text-right", children: v })
  ] });
}
function ChangeServiceDialog({
  leadId,
  currentService,
  currentAmount,
  disabled = false
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [selectedServiceId, setSelectedServiceId] = reactExports.useState("");
  const qc = useQueryClient();
  const getServicesFn = useServerFn(listServices);
  const changeServiceFn = useServerFn(changeLeadService);
  const { data: servicesData, isLoading: isLoadingServices } = useQuery({
    queryKey: ["admin.services.active"],
    queryFn: () => getServicesFn(),
    enabled: open
  });
  const activeServices = (servicesData?.rows ?? []).filter(
    (s) => isVisibleService(s)
  );
  const selectedService = activeServices.find((s) => s.id === selectedServiceId);
  const mutation = useMutation({
    mutationFn: async () => {
      if (!selectedServiceId) throw new Error("Please select a service");
      return changeServiceFn({
        data: {
          leadId,
          serviceId: selectedServiceId
        }
      });
    },
    onSuccess: (res) => {
      toast.success(`Service changed to ${res.serviceName}! New payment link generated.`);
      qc.invalidateQueries({ queryKey: ["admin.lead", leadId] });
      qc.invalidateQueries({ queryKey: ["admin.order"] });
      qc.invalidateQueries({ queryKey: ["admin.formSubmission"] });
      qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
      qc.invalidateQueries({ queryKey: ["admin.lead.workspace"] });
      qc.invalidateQueries({ queryKey: ["payment-link-status", leadId] });
      qc.invalidateQueries({ queryKey: ["admin.lead-events", leadId] });
      qc.invalidateQueries({ queryKey: ["admin.lead-contact-events", leadId] });
      setOpen(false);
    },
    onError: (err) => {
      toast.error(err?.message ?? "Failed to change service");
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        disabled,
        onClick: () => setOpen(true),
        className: "gap-1.5 border-indigo-200 bg-indigo-50/50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900 font-medium shadow-xs text-xs",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRightLeft, { className: "w-3.5 h-3.5" }),
          "Change Service"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-slate-900", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRightLeft, { className: "w-4 h-4 text-indigo-600" }),
          "Change Customer Service"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-xs text-slate-500", children: "Update the service for this lead. This will instantly update Lead details, linked Applications/Orders, DB records, and generate a new payment link with the new price." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-slate-50 border p-3 text-xs space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-500 font-medium", children: "Current Service" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold text-slate-800 flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: currentService || "Not set" }),
            currentAmount != null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-slate-600", children: [
              "₹",
              Number(currentAmount)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold", children: "Select New Service" }),
          isLoadingServices ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-400 py-2 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5 animate-spin" }),
            " Loading services catalog…"
          ] }) : activeServices.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-amber-600 py-2 flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4" }),
            " No active services found in database."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: selectedServiceId,
              onChange: (e) => setSelectedServiceId(e.target.value),
              className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "-- Choose a service --" }),
                activeServices.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: s.id, children: [
                  s.service_name,
                  " — ₹",
                  s.total_amount
                ] }, s.id))
              ]
            }
          )
        ] }),
        selectedService && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-indigo-100 bg-indigo-50/40 p-3 text-xs space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold text-indigo-900 flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Selected: ",
              selectedService.service_name
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-indigo-700", children: [
              "₹",
              selectedService.total_amount
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-slate-500 grid grid-cols-3 gap-1 pt-1 border-t border-indigo-100/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              "Base: ₹",
              selectedService.base_amount
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              "GST (18%): ₹",
              selectedService.gst_amount
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-bold text-slate-700", children: [
              "Total: ₹",
              selectedService.total_amount
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => setOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            disabled: !selectedServiceId || mutation.isPending,
            onClick: () => mutation.mutate(),
            className: "bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5",
            children: mutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5 animate-spin" }),
              " Updating…"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5" }),
              " Confirm & Change Service"
            ] })
          }
        )
      ] })
    ] }) })
  ] });
}
function LeadDetailPage() {
  const {
    leadId
  } = Route$Q.useParams();
  const qc = useQueryClient();
  const getFn = useServerFn(getLead);
  const noteFn = useServerFn(addLeadNote);
  const staffFn = useServerFn(listStaff);
  const role = useRole();
  const userPerms = usePermissions();
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin.lead", leadId],
    queryFn: () => getFn({
      data: {
        id: leadId
      }
    }),
    enabled: userPerms.can("leads", "view") || userPerms.isLoading
  });
  const {
    data: staffData
  } = useQuery({
    queryKey: ["admin.staff"],
    queryFn: () => staffFn()
  });
  const [note, setNote] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  if (!userPerms.isLoading && !userPerms.can("leads", "view")) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center bg-white rounded-xl border border-slate-200 space-y-3 my-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "size-10 text-rose-500 mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-slate-900", children: "Access Denied" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 max-w-md mx-auto", children: "You do not have permission to view the Leads module. Please contact your administrator if you need access." })
    ] });
  }
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center text-slate-500", children: "Loading lead details…" });
  if (!data) return null;
  const {
    lead,
    applications,
    notes
  } = data;
  const canEditLead = role.hasAny(["super_admin", "operations", "admin", "manager", "executive"]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => window.history.back(), className: "inline-flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
        " Back to leads"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "font-mono text-[11px]", children: lead.lead_code }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "font-sans text-[10px] uppercase tracking-wider bg-slate-50", children: lead.status.replace(/_/g, " ") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChangeServiceDialog, { leadId, currentService: lead.service, currentAmount: lead.total_amount, disabled: !canEditLead }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AddTaskDialog, { defaultLeadId: leadId })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "workspace", className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "w-full justify-start overflow-x-auto h-auto p-1 bg-slate-100/50 border mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "workspace", className: "gap-2 py-2 px-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "w-4 h-4" }),
          " Workspace"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "timeline", className: "gap-2 py-2 px-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "w-4 h-4" }),
          " Timeline"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "notes", className: "gap-2 py-2 px-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-4 h-4" }),
          " Notes"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "workspace", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LeadWorkspacePanel, { lead, applications, staff: (Array.isArray(staffData) ? staffData : staffData?.profiles) ?? [] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "timeline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LeadTimeline, { leadId }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "notes", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold", children: "Internal Notes" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: note, onChange: (e) => setNote(e.target.value), placeholder: "Add an internal note for staff…", className: "flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { disabled: busy || !note.trim(), onClick: async () => {
              setBusy(true);
              try {
                await noteFn({
                  data: {
                    lead_id: leadId,
                    note: note.trim()
                  }
                });
                setNote("");
                toast.success("Note added");
                await qc.invalidateQueries({
                  queryKey: ["admin.lead", leadId]
                });
              } finally {
                setBusy(false);
              }
            }, children: "Add Note" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-4 pt-4", children: [
            notes.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-4 pb-4 border-b last:border-0 last:pb-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4 text-slate-400" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-400 flex items-center gap-2", children: [
                  n.user_id ? "Staff Member" : "System",
                  " • ",
                  formatIST(n.created_at)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100", children: n.note })
              ] })
            ] }, n.id)),
            notes.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-center py-8 text-sm text-slate-400 italic", children: "No internal notes yet." })
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  LeadDetailPage as component
};
