import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link, e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { bB as Route$O, _ as useRole, j as useServerFn, bp as getOrderDetailV2, aM as listStaff, bC as updateOrderAssignee, H as Button, aE as usePermissions, bz as getOrderTimelineEvents, bA as getOrderTickets, bq as updateFulfillmentStatus, bs as resendServiceChangeEmail, a4 as Tabs, a5 as TabsList, a6 as TabsTrigger, a$ as TabsContent, a3 as useRealtimeTable, a as cn, P as Dialog, Q as DialogContent, U as DialogHeader, V as DialogTitle, as as DialogDescription, I as Input$1, W as Label, $ as Textarea, a1 as Badge, X as DialogFooter, aH as requestOrderDocumentUpload, aI as confirmOrderDocumentUpload, aV as getOrderDocumentSignedUrl, bo as getOrderAssignmentHistory, aC as DialogTrigger, J as Select, K as SelectTrigger, M as SelectValue, N as SelectContent, O as SelectItem, bt as Table, bu as TableHeader, bv as TableRow, bw as TableHead, bx as TableBody, by as TableCell, ap as listServices, br as changeOrderService, a7 as isVisibleService } from "./router-QgJicixe.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { f as formatIST, r as relativeIST } from "./datetime-DvkGwlJs.mjs";
import { a as Tooltip, b as TooltipTrigger, c as TooltipContent, T as TooltipProvider } from "./tooltip-BG9UXFMb.mjs";
import { m as mintCustomerLink } from "./customer-access.functions-N17nWKMW.mjs";
import { C as CallButton } from "./CallButton-i-5I5V9S.mjs";
import { c as computeOrderStage, S as STAGE_META } from "./computeOrderStage-D7ejTUnj.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { a as getAppSettings, b as getCallbackReminderPresetSettings, D as DEFAULT_CALLBACK_PRESET_CONFIG } from "./app-settings.functions-ChQcgAgv.mjs";
import { S as ScrollArea } from "./scroll-area-DRnwZlXV.mjs";
import { listCloseReasons } from "./reasons.functions-epqlfHIh.mjs";
import { getActiveOrderCallback, getOrderCallbackHistory, completeOrderCallback, scheduleOrderCallback, cancelOrderCallback } from "./callback-reminder.functions-6OwGV8Nj.mjs";
import { s as sendFormLink, d as markSubmittedToGovt, f as completeOrder, g as reopenOrder, h as sendManualReminder } from "./order-actions.functions-D4YiedPe.mjs";
import { F as FormSubmissionPanel } from "./FormSubmissionPanel-Dg5xuYUg.mjs";
import { getInvoiceSignedUrl, regenerateInvoice, resendInvoiceEmail, previewInvoice, replaceInvoice, updateInvoiceGstin, getInvoiceDetail } from "./invoices.functions-CoU4f0R2.mjs";
import { S as Sheet, a as SheetContent, b as SheetHeader, c as SheetTitle } from "./sheet-BttrtNAS.mjs";
import { supabase } from "./client-BX5UfqqR.mjs";
import { l as listEmailTemplates, m as sendOrderTemplateEmail } from "./emails.functions-Pri3A8op.mjs";
import { A as AddTaskDialog } from "./AddTaskDialog-4s-_aP2e.mjs";
import { i as isUnconvertedConsultationLead, b as isConvertedConsultationLead } from "./consultation-asWR5IET.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import "../_libs/pdf-lib.mjs";
import { e as ShieldAlert, b9 as ArrowLeft, aB as Copy, be as UserRound, P as Phone, a as Mail, b as MessageCircle, bG as Printer, au as ExternalLink, bD as Link2, L as LoaderCircle, as as Send, bH as BadgeDollarSign, i as Flame, K as LifeBuoy, Q as FileText, ak as History, am as Activity, aC as Repeat, X, aI as CircleX, by as ClipboardCheck, l as CircleCheck, f as RotateCcw, bp as VolumeX, N as PhoneCall, C as Clock, j as Server, v as Search, O as ChevronUp, y as ChevronDown, b5 as Info, aO as Image, aA as Upload, R as RefreshCw, az as Trash2, ax as TriangleAlert, b3 as FileCheckCorner, E as Check, bI as CloudUpload, A as ArrowRight, D as Download, aS as Shuffle, o as UserCheck, bJ as GitCommitHorizontal, ag as CreditCard, aF as Cog, ad as Eye, af as Receipt, bK as Replace, w as ShieldCheck, aH as CirclePause, a8 as ShoppingBag, U as UserX, bL as MailWarning, bM as Wrench, bN as Flag, bO as Landmark, I as Inbox, aM as CircleAlert, z as Calendar, ar as User, B as Briefcase, aT as Zap, Y as PhoneOff, b6 as MessageSquare, s as ChevronRight, aa as UserCog, aG as AlarmClock, r as ChevronLeft } from "../_libs/lucide-react.mjs";
import { o as object, _ as _enum, s as string, n as number, b as boolean, r as record, d as any } from "../_libs/zod.mjs";
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
import "./orders-filter-CXWoZisU.mjs";
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
import "./browser-phone-bus-CwJqzKkc.mjs";
import "../_libs/radix-ui__react-scroll-area.mjs";
import "./onboarding.functions-DdT_CVNt.mjs";
import "./schemas-DClqju6h.mjs";
import "./dispute-browser-pdf-B2D_9n6v.mjs";
import "./submissions-admin.functions-bHLflT8I.mjs";
import "./nic-fill-ia8FfFhd.mjs";
import "./tasks.functions-D6mit-5h.mjs";
import "../_libs/pdf-lib__standard-fonts.mjs";
import "../_libs/pako.mjs";
import "../_libs/pdf-lib__upng.mjs";
function OrderAssignmentHistoryTab({ orderId }) {
  const historyFn = useServerFn(getOrderAssignmentHistory);
  const { data, isLoading } = useQuery({
    queryKey: ["order.assignment-history", orderId],
    queryFn: () => historyFn({ data: { orderId } }),
    staleTime: 1e4
  });
  const rows = data?.rows ?? [];
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-3 animate-pulse", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-slate-200 rounded w-1/4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 bg-slate-100 rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 bg-slate-100 rounded-xl" })
    ] });
  }
  if (rows.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center bg-white rounded-xl border border-slate-200/80 shadow-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "size-8 mx-auto mb-2 text-slate-400" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-slate-700", children: "No Assignment History Recorded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mt-1 max-w-sm mx-auto", children: "Assignment transitions (manual reassignments, leave redistributions, and initial intake) will be recorded here automatically." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 sm:p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-slate-100 pb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "size-4 text-indigo-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-slate-800", children: "Assignment History & Transitions" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600", children: [
        rows.length,
        " ",
        rows.length === 1 ? "transition" : "transitions"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200", children: rows.map((r, idx) => {
      const isAuto = r.changeType.startsWith("AUTO");
      const isManual = r.changeType.startsWith("MANUAL");
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "absolute -left-6 top-1.5 size-5 rounded-full border-2 border-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-110",
              isAuto ? "bg-amber-500 text-white" : isManual ? "bg-indigo-600 text-white" : "bg-slate-700 text-white"
            ),
            children: isAuto ? /* @__PURE__ */ jsxRuntimeExports.jsx(Shuffle, { className: "size-2.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "size-2.5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-slate-200/90 bg-slate-50/50 p-3.5 space-y-2 hover:border-slate-300 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                    isAuto ? "bg-amber-100 text-amber-800 border border-amber-200" : isManual ? "bg-indigo-100 text-indigo-800 border border-indigo-200" : "bg-slate-200 text-slate-800"
                  ),
                  children: r.changeType.replace(/_/g, " ")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: "·" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-slate-500 font-medium", children: [
                "By ",
                r.changedByName || "System",
                " (",
                r.source,
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-slate-400 font-mono", children: formatIST(r.createdAt) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold text-slate-800 py-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn(!r.previousEmployeeId ? "text-slate-400 italic font-normal" : "text-slate-700"), children: r.previousEmployeeName || "Unassigned" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-3.5 text-slate-400 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn(!r.newEmployeeId ? "text-slate-400 italic font-normal" : "text-indigo-700 font-bold"), children: r.newEmployeeName || "Unassigned" })
          ] }),
          r.reason && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-600 bg-white/80 p-2 rounded-lg border border-slate-200/60 flex items-start gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 font-medium shrink-0", children: "Reason:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: r.reason })
          ] })
        ] })
      ] }, r.id || idx);
    }) })
  ] });
}
const EventInput = object({
  applicationId: string().uuid(),
  event: any()
  // typed union enforced at call sites
});
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => EventInput.parse(i)).handler(createSsrRpc("e495dab944592aa1efe4387d4e97ff38d2fdf8e0d47eb8bbf4cff069674f7784"));
const getWorkflowState = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  applicationId: string().uuid()
}).parse(i)).handler(createSsrRpc("07a39f5a9f3ef7c4475945a068af14dd1a34903e237e4fe6962e0a316d78f61f"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  timerId: string().uuid(),
  action: _enum(["pause", "resume", "cancel"])
}).parse(i)).handler(createSsrRpc("7a4da3468a8faefe0abed8d77c1ea9cab689d6335c68da1210c6c556c025f2ac"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  automationId: string().uuid(),
  action: _enum(["pause", "resume", "stop"])
}).parse(i)).handler(createSsrRpc("c0dd0783f9d0e940177779c900d504ee31a2c43813e0385051022b44428b3dfe"));
const WORKFLOW_TO_JOURNEY = {
  payment_successful: "payment",
  form: "form",
  verification: "verification",
  government_portal: "govt",
  completed: "completed",
  closed: "completed"
};
const TIMER_LABEL = {
  incomplete_form: "Form nudge",
  closure: "Auto-closure",
  reminder: "Gov reminder",
  custom: "Custom"
};
function deriveEngineView(input) {
  const state = input.state ?? null;
  const timers = input.timers ?? [];
  const automations = input.automations ?? [];
  if (!state) {
    return {
      hasEngine: false,
      stage: null,
      status: null,
      subStatus: null,
      paused: false,
      pauseReason: null,
      activeTicketId: null,
      overallTone: "none",
      overallLabel: "Not initialised",
      activeNode: null,
      nextTimer: null,
      runningAutomations: [],
      timers,
      automations
    };
  }
  const stage = state.stage;
  const activeNode = WORKFLOW_TO_JOURNEY[stage] ?? null;
  const overallTone = stage === "completed" ? "completed" : stage === "closed" ? "stopped" : state.paused ? "paused" : "running";
  const overallLabel = stage === "completed" ? "Completed" : stage === "closed" ? "Stopped" : state.paused ? "Paused" : "Running";
  const running = timers.filter((t) => t.status === "running" && t.fires_at);
  running.sort((a, b) => new Date(a.fires_at).getTime() - new Date(b.fires_at).getTime());
  const nextTimer = running[0] ? { kind: running[0].kind, firesAt: running[0].fires_at } : null;
  return {
    hasEngine: true,
    stage,
    status: state.status ?? null,
    subStatus: state.sub_status ?? null,
    paused: !!state.paused,
    pauseReason: state.pause_reason ?? null,
    activeTicketId: state.active_ticket_id ?? null,
    overallTone,
    overallLabel,
    activeNode,
    nextTimer,
    runningAutomations: automations.filter((a) => a.status === "running").map((a) => ({ code: a.code })),
    timers,
    automations
  };
}
function useOrderWorkflow(applicationId) {
  const qc = useQueryClient();
  const fn = useServerFn(getWorkflowState);
  const key = ["order-workflow-state", applicationId];
  const q = useQuery({
    queryKey: key,
    enabled: !!applicationId,
    queryFn: () => fn({ data: { applicationId } }),
    refetchInterval: 15e3,
    refetchOnWindowFocus: true,
    staleTime: 5e3
  });
  const view = deriveEngineView({
    state: q.data?.state,
    timers: q.data?.timers,
    automations: q.data?.automations
  });
  const refetch = reactExports.useCallback(() => {
    qc.invalidateQueries({ queryKey: key });
  }, [qc, key]);
  return {
    isLoading: q.isLoading,
    view,
    events: q.data?.events ?? [],
    refetch,
    queryKey: key
  };
}
function stageToJourneyIndex(stage) {
  switch (stage) {
    case "lead_received":
      return 0;
    case "payment_pending":
      return 1;
    case "payment_done":
    case "form_not_submitted":
    case "consultation_pending":
      return 2;
    case "consultation_completed":
      return 4;
    case "form_submitted":
    case "order_reopened":
    case "customer_delay":
    case "technical_delay":
    case "in_progress":
    case "under_review":
      return 3;
    case "submitted_to_govt":
      return 4;
    case "under_processing":
    case "certificate_ready":
      return 5;
    case "completed":
      return 6;
    default:
      return 2;
  }
}
function deriveJourneyLiveState(input) {
  const isReopened = input.stage === "order_reopened" || input.fulfillmentStatus === "order_reopened" || input.workflowStatus === "order_reopened";
  const closureStageValue = (input.closureStage ?? "").toLowerCase();
  const isClosed = !isReopened && (input.stage === "closed" || /^(closed|auto_closed|force_closed|order_closed)$/.test(closureStageValue));
  const isConsultationCompleted = input.stage === "consultation_completed";
  const isCompleted = !isReopened && (input.stage === "completed" || isConsultationCompleted);
  const ws = (input.workflowStatus ?? "").toLowerCase();
  const fs = (input.fulfillmentStatus ?? "").toLowerCase();
  const reasonMatch = (input.closureReasonLabel ?? "").match(/\b([ABC]\d{1,2}|RM\d{1,2}|R\d{1,2})\b/i);
  const reasonCode = reasonMatch ? reasonMatch[1].toUpperCase() : null;
  let idx = stageToJourneyIndex(input.stage);
  if (isClosed) {
    if (/consultation/.test(fs) || /consultation/.test(ws)) {
      idx = 4;
    } else if (/submitted_to_govt|government_processing|under_processing|certificate/.test(fs) || /submitted_to_govt|government_processing/.test(ws)) {
      idx = 4;
    } else if (input.formSubmittedAt || /form_submitted|in_progress|under_review|customer_delay|technical_delay/.test(fs) || /form_submitted|customer_delay|technical_delay/.test(ws)) {
      idx = 3;
    } else if (reasonCode === "RM02" || reasonCode === "RM01" || /form_pending_autoclose|form_not_submitted_autoclose/.test(ws)) {
      idx = 2;
    } else {
      idx = 3;
    }
  }
  let activeSubKey = null;
  if (isReopened) {
    activeSubKey = null;
  } else if (isConsultationCompleted) {
    activeSubKey = null;
  } else if (/form_pending|awaiting_form|form_not_submitted/.test(ws) || idx === 2 && !ws && !isClosed) {
    activeSubKey = "form-not-submitted";
  } else if (/customer_hold|customer_side|customer_delay|waiting_for_customer|external_dependency/.test(ws) || input.stage === "customer_delay") {
    activeSubKey = "customer-delay";
  } else if (/technical_hold|external_delay|govt_delay|technical_delay|government_portal_pending/.test(ws) || input.stage === "technical_delay") {
    activeSubKey = "technical-delay";
  } else if (idx === 4 || idx === 5) {
    activeSubKey = "govt-awaiting";
  }
  if (isClosed) {
    if (reasonCode?.startsWith("B") || /govt_reject|rejected/i.test(ws)) {
      activeSubKey = "govt-rejected";
    } else if (reasonCode === "RM02" || reasonCode === "RM01" || /form_pending_autoclose|form_not_submitted_autoclose/.test(ws)) {
      activeSubKey = "form-not-submitted";
    } else {
      activeSubKey = "customer-delay";
    }
  }
  let subStateLabel = "In progress";
  if (isClosed) {
    if (activeSubKey === "govt-rejected") {
      subStateLabel = `Closed (Govt Rejected)${reasonCode ? ` · ${reasonCode}` : ""}`;
    } else if (activeSubKey === "form-not-submitted") {
      subStateLabel = `Closed (Form Not Submitted Delay)${reasonCode ? ` · ${reasonCode}` : ""}`;
    } else if (activeSubKey === "customer-delay" || reasonCode?.startsWith("A") || reasonCode?.startsWith("C")) {
      subStateLabel = `Closed (Customer Delay)${reasonCode ? ` · ${reasonCode}` : ""}`;
    } else {
      subStateLabel = `Closed${reasonCode ? ` · ${reasonCode}` : ""}`;
    }
  } else if (isReopened) {
    subStateLabel = "Order Reopened";
  } else if (isConsultationCompleted) {
    subStateLabel = "Order Completed";
  } else if (activeSubKey === "form-not-submitted") {
    subStateLabel = "Form Not Submitted Delay";
  } else if (activeSubKey === "customer-delay") {
    subStateLabel = `Customer Delay${reasonCode ? ` (${reasonCode})` : ""}`;
  } else if (activeSubKey === "technical-delay") {
    subStateLabel = `Technical Delay${reasonCode ? ` (${reasonCode})` : ""}`;
  } else if (activeSubKey === "govt-awaiting") {
    subStateLabel = "Awaiting Govt Response";
  } else if (isCompleted) {
    subStateLabel = "Completed";
  }
  return {
    currentMainIndex: idx,
    activeSubKey,
    terminal: isClosed ? "closed" : isCompleted ? "completed" : null,
    reasonCode,
    subStateLabel
  };
}
const PHASE_ENABLED_BUTTONS = {
  form_not_submitted: ["B01"],
  form_link_sent: [],
  // S03: waiting
  form_submitted: ["B02", "B04", "B05", "B06", "B07", "B08"],
  // S04
  technical_delay: ["B03"],
  // S05
  post_b03_resume: ["B04", "B05", "B06", "B07", "B08"],
  // S04 post-tech-fix
  customer_delay: ["B04"],
  // S06: B04 acts as "Resume Order" → S04
  govt_processing: ["B04", "B06", "B07", "B08"],
  // S07 (B05 already sent)
  consultation_done: ["B07", "B08"],
  // S08
  application_approved: ["B07"],
  // S09
  application_rejected: ["B07", "B08"],
  // S10
  completed: [],
  // S11
  closed: [],
  // S12
  admin_override: ["B01", "B02", "B03", "B04", "B05", "B06", "B07", "B08"]
};
function derivePhase(i) {
  if (i.adminOverride) return "admin_override";
  if (i.stage === "consultation_completed") return "consultation_done";
  const live = deriveJourneyLiveState({
    stage: i.stage,
    workflowStatus: i.workflowStatus,
    closureStage: i.closureStage,
    closureReasonLabel: i.closureReasonLabel,
    formSubmittedAt: i.formSubmittedAt,
    fulfillmentStatus: i.fulfillmentStatus
  });
  if (live.terminal === "closed") {
    if (live.activeSubKey === "govt-rejected") {
      return "application_rejected";
    }
    return "closed";
  }
  if (live.terminal === "completed") return "completed";
  if (live.activeSubKey === "technical-delay") return "technical_delay";
  if (live.activeSubKey === "customer-delay") return "customer_delay";
  if (live.activeSubKey === "form-not-submitted") {
    return i.formLinkSent ? "form_link_sent" : "form_not_submitted";
  }
  const stage = (i.stage ?? "").toLowerCase();
  const fulfillment = (i.workflowStatus ?? "").toLowerCase();
  if (fulfillment === "application_approved" || fulfillment === "application_accepted") {
    return "application_approved";
  }
  if (fulfillment === "application_rejected" || fulfillment === "certificate_rejected") {
    return "application_rejected";
  }
  const inGovtFlow = /submitted_to_govt|government_processing|processing|certificate|check|final|consultation_completed/.test(stage);
  if (inGovtFlow) {
    if (fulfillment === "consultation_completed" || /consultation_completed|consultation_done/.test(fulfillment)) {
      return "consultation_done";
    }
    return "govt_processing";
  }
  if (i.techDelayResolved) return "post_b03_resume";
  return "form_submitted";
}
const NODE_W = 130;
const NODE_H = 60;
const CANVAS_W = 1720;
const CANVAS_H = 570;
const nodeW = (n) => n.w ?? NODE_W;
const nodeH = (n) => n.h ?? NODE_H;
const NODES = [
  /* ── ROW 1: Main horizontal path ── */
  {
    id: "order_rec",
    x: 20,
    y: 165,
    w: 110,
    h: 60,
    label: "Incomplete Form",
    icon: "shoppingBag",
    kind: "stage",
    tone: "maroon",
    badgeBottom: "E001"
  },
  {
    id: "form_not",
    x: 165,
    y: 165,
    w: 130,
    h: 60,
    label: "Form Not Submitted Delay",
    icon: "fileText",
    kind: "stage",
    tone: "slate"
  },
  {
    id: "form_sub",
    x: 330,
    y: 165,
    w: 130,
    h: 60,
    label: "Form Submitted",
    icon: "fileCheck",
    kind: "stage",
    tone: "slate"
  },
  {
    id: "b02_tech",
    x: 485,
    y: 141,
    w: 125,
    h: 108,
    label: "Technical Delay",
    subtitle: "Select Reason",
    highlightText: "Add Reminder",
    icon: "wrench",
    kind: "action",
    tone: "slate",
    buttonCode: "B02",
    emailCode: "E003",
    badgeTop: "B02",
    badgeBottom: "E003"
  },
  {
    id: "b03_fix",
    x: 630,
    y: 141,
    w: 126,
    h: 108,
    label: "Technical Delay",
    subtitle: "Issue Resolved",
    icon: "rotate",
    kind: "action",
    tone: "slate",
    buttonCode: "B03",
    emailCode: "E011",
    badgeTop: "B03",
    badgeBottom: "E011"
  },
  {
    id: "govt_portal",
    x: 780,
    y: 155,
    w: 292,
    h: 80,
    label: "Application Submitted",
    subtitle: "Govt Portal",
    icon: "landmark",
    kind: "stage",
    tone: "slate"
  },
  {
    id: "consult_stage",
    x: 1125,
    y: 155,
    w: 292,
    h: 80,
    label: "Application Accepted",
    subtitle: "or Closed",
    icon: "clipboard",
    kind: "stage",
    tone: "slate"
  },
  /* ── ROW 2: Sub-cards under Govt Portal ── */
  {
    id: "b05_submit",
    x: 780,
    y: 268,
    w: 140,
    h: 125,
    label: "Application Submitted",
    subtitle: "Waiting for Govt. Approval",
    highlightText: "Add Reminder & Button Press Counter",
    icon: "send",
    kind: "action",
    tone: "slate",
    buttonCode: "B05",
    emailCode: "E006",
    badgeTop: "B05",
    badgeBottom: "E006"
  },
  {
    id: "b06_consult",
    x: 932,
    y: 268,
    w: 140,
    h: 125,
    label: "Consultation Completed",
    subtitle: "Application Submitted to Govt Portal",
    highlightText: "Order Completed",
    icon: "clipboard",
    kind: "action",
    tone: "slate",
    buttonCode: "B06",
    emailCode: "E005",
    badgeTop: "B06",
    badgeBottom: "E005"
  },
  /* ── ROW 2: Sub-cards under Application Accepted or Closed ── */
  {
    id: "b07_accept",
    x: 1125,
    y: 268,
    w: 140,
    h: 125,
    label: "Application Accepted",
    subtitle: "Upload PDF",
    highlightText: "Add Note- Order Completed",
    icon: "upload",
    kind: "action",
    tone: "slate",
    buttonCode: "B07",
    emailCode: "E007",
    badgeTop: "B07",
    badgeBottom: "E007"
  },
  {
    id: "b08_reject",
    x: 1277,
    y: 268,
    w: 140,
    h: 125,
    label: "Application Rejected",
    subtitle: "Select Reason",
    highlightText: "Add Note- Order Closed",
    icon: "xCircle",
    kind: "action",
    tone: "rose",
    buttonCode: "B08",
    emailCode: "E008",
    badgeTop: "B08",
    badgeBottom: "E008"
  },
  /* ── ROW 3: Bottom exception row ── */
  {
    id: "b01_reminder",
    x: 132,
    y: 415,
    w: 196,
    h: 110,
    label: "Form Not Submitted Delay",
    subtitle: "Send information Incomplete mail",
    highlightText: "Order Autoclosed in 8 hrs",
    icon: "mailWarn",
    kind: "action",
    tone: "amber",
    buttonCode: "B01",
    emailCode: "E002",
    badgeTop: "B01",
    badgeBottom: "E002"
  },
  {
    id: "b04_cust",
    x: 870,
    y: 415,
    w: 200,
    h: 110,
    label: "Customer Side Delay",
    subtitle: "Select Reason",
    highlightText: "Order Autoclosed in 8 hrs",
    icon: "userX",
    kind: "action",
    tone: "amber",
    buttonCode: "B04",
    emailCode: "E004",
    badgeTop: "B04",
    badgeBottom: "E004"
  },
  {
    id: "closed_e010",
    x: 1125,
    y: 415,
    w: 180,
    h: 110,
    label: "Order Closed with previous Selected Reason",
    icon: "xCircle",
    kind: "terminal",
    tone: "rose",
    badgeBottom: "E010"
  }
];
const nodeById = Object.fromEntries(NODES.map((n) => [n.id, n]));
const EDGES = [
  /* ── Main horizontal path ── */
  { id: "e_or_fn", from: "order_rec", fromSide: "R", to: "form_not", toSide: "L", mode: "S", branch: "main-1" },
  { id: "e_fn_fs", from: "form_not", fromSide: "R", to: "form_sub", toSide: "L", mode: "S", branch: "main-2" },
  { id: "e_fs_b02", from: "form_sub", fromSide: "R", to: "b02_tech", toSide: "L", mode: "S", branch: "technical" },
  { id: "e_b02_b03", from: "b02_tech", fromSide: "R", to: "b03_fix", toSide: "L", mode: "S", branch: "technical" },
  { id: "e_b03_gv", from: "b03_fix", fromSide: "R", to: "govt_portal", toSide: "L", mode: "S", branch: "technical" },
  { id: "e_gv_cs", from: "govt_portal", fromSide: "R", to: "consult_stage", toSide: "L", mode: "S", branch: "main-4" },
  /* ── Top rectangular loop: starts between form_sub and B02 → govt_portal & consult_stage ── */
  {
    id: "e_top_gv",
    from: "form_sub",
    fromSide: "R",
    to: "govt_portal",
    toSide: "T",
    mode: "S",
    branch: "technical",
    waypoints: [{ x: 460, y: 36 }, { x: 926, y: 36 }]
  },
  {
    id: "e_top_cs",
    from: "form_sub",
    fromSide: "R",
    to: "consult_stage",
    toSide: "T",
    mode: "S",
    branch: "technical",
    waypoints: [{ x: 460, y: 18 }, { x: 1271, y: 18 }]
  },
  /* ── Bottom loop: starts between form_sub and B02 → B05 bottom & B04 left ── */
  {
    id: "e_bot_b04",
    from: "form_sub",
    fromSide: "R",
    to: "b04_cust",
    toSide: "L",
    mode: "S",
    branch: "customer-delay-main",
    waypoints: [{ x: 460, y: 470 }]
  },
  {
    id: "e_b03_b04",
    from: "b03_fix",
    fromSide: "B",
    to: "b04_cust",
    toSide: "L",
    mode: "S",
    branch: "customer-delay-tech",
    waypoints: [{ x: 693, y: 470 }]
  },
  {
    id: "e_b05_b04",
    from: "b05_submit",
    fromSide: "B",
    to: "b04_cust",
    toSide: "L",
    mode: "S",
    branch: "customer-delay-govt",
    waypoints: [{ x: 850, y: 470 }]
  },
  /* ── Vertical drops from govt_portal to sub-cards ── */
  {
    id: "e_gv_b05",
    from: "govt_portal",
    fromSide: "B",
    to: "b05_submit",
    toSide: "T",
    mode: "VH",
    branch: "submit",
    waypoints: [{ x: 926, y: 248 }, { x: 850, y: 248 }]
  },
  {
    id: "e_gv_b06",
    from: "govt_portal",
    fromSide: "B",
    to: "b06_consult",
    toSide: "T",
    mode: "VH",
    branch: "consult",
    waypoints: [{ x: 926, y: 248 }, { x: 1002, y: 248 }]
  },
  /* ── Vertical drops from consult_stage to sub-cards ── */
  {
    id: "e_cs_b07",
    from: "consult_stage",
    fromSide: "B",
    to: "b07_accept",
    toSide: "T",
    mode: "VH",
    branch: "accept",
    waypoints: [{ x: 1271, y: 248 }, { x: 1195, y: 248 }]
  },
  {
    id: "e_cs_b08",
    from: "consult_stage",
    fromSide: "B",
    to: "b08_reject",
    toSide: "T",
    mode: "VH",
    branch: "reject",
    waypoints: [{ x: 1271, y: 248 }, { x: 1347, y: 248 }]
  },
  /* ── B01 form-nag path ── */
  { id: "e_fn_b01", from: "form_not", fromSide: "B", to: "b01_reminder", toSide: "T", mode: "S", branch: "form-nag" },
  {
    id: "e_b01_cl",
    from: "b01_reminder",
    fromSide: "B",
    to: "closed_e010",
    toSide: "B",
    mode: "S",
    branch: "form-nag",
    waypoints: [{ x: 230, y: 553 }, { x: 1215, y: 553 }]
  },
  /* ── B04 customer-delay path to Order Closed ── */
  { id: "e_b04_cl", from: "b04_cust", fromSide: "R", to: "closed_e010", toSide: "L", mode: "S", branch: "customer-delay" },
  /* ── B08 reject → Order Closed right side ── */
  {
    id: "e_b08_cl",
    from: "b08_reject",
    fromSide: "B",
    to: "closed_e010",
    toSide: "R",
    mode: "S",
    branch: "reject",
    waypoints: [{ x: 1347, y: 470 }]
  }
];
function anchor(n, side) {
  const w = nodeW(n), h = nodeH(n);
  switch (side) {
    case "L":
      return { x: n.x, y: n.y + h / 2 };
    case "R":
      return { x: n.x + w, y: n.y + h / 2 };
    case "T":
      return { x: n.x + w / 2, y: n.y };
    case "B":
      return { x: n.x + w / 2, y: n.y + h };
  }
}
function pathD(a, b, mode, waypoints) {
  if (waypoints && waypoints.length) {
    const pts = [a, ...waypoints, b];
    return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  }
  switch (mode) {
    case "S":
      return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
    case "HV":
      return `M ${a.x} ${a.y} L ${b.x} ${a.y} L ${b.x} ${b.y}`;
    case "VH":
      return `M ${a.x} ${a.y} L ${a.x} ${b.y} L ${b.x} ${b.y}`;
    case "HVH": {
      const mx = (a.x + b.x) / 2;
      return `M ${a.x} ${a.y} L ${mx} ${a.y} L ${mx} ${b.y} L ${b.x} ${b.y}`;
    }
    case "VHV": {
      const my = (a.y + b.y) / 2;
      return `M ${a.x} ${a.y} L ${a.x} ${my} L ${b.x} ${my} L ${b.x} ${b.y}`;
    }
  }
}
function activeBranchesFor(phase, terminal, reasonCode, workflowStatus, currentIdx, techDelayResolved) {
  const s = /* @__PURE__ */ new Set();
  switch (phase) {
    case "form_not_submitted":
      s.add("form-nag");
      break;
    case "form_link_sent":
      s.add("form-nag");
      break;
    case "form_submitted":
      break;
    case "technical_delay":
      s.add("technical");
      break;
    case "customer_delay":
      s.add("customer-delay");
      if (currentIdx !== void 0 && currentIdx >= 4) {
        s.add("customer-delay-govt");
      } else if (techDelayResolved) {
        s.add("customer-delay-tech");
      } else {
        s.add("customer-delay-main");
      }
      break;
    case "govt_processing":
      s.add("submit");
      break;
    case "consultation_done":
      s.add("consult");
      break;
    case "application_approved":
      s.add("accept");
      break;
    case "application_rejected":
      s.add("reject");
      break;
    case "post_b03_resume":
      break;
    case "completed":
      s.add("accept");
      break;
    case "closed": {
      const rc = reasonCode?.toUpperCase() ?? "";
      const ws = (workflowStatus ?? "").toLowerCase();
      const reasonText = (rc + " " + ws).toLowerCase();
      const isRejectClose = rc.startsWith("B") || /reject|govt_reject|government_reject/i.test(reasonText);
      const isFormNagClose = (rc === "RM02" || rc === "RM01" || /form_pending_autoclose|form_not_submitted_autoclose/i.test(ws)) && !isRejectClose;
      if (isRejectClose) {
        s.add("reject");
      } else if (isFormNagClose) {
        s.add("form-nag");
      } else {
        s.add("customer-delay");
        if (currentIdx !== void 0 && currentIdx >= 4) {
          s.add("customer-delay-govt");
        } else if (techDelayResolved) {
          s.add("customer-delay-tech");
        } else {
          s.add("customer-delay-main");
        }
      }
      break;
    }
  }
  if (terminal === "completed" && phase !== "consultation_done") s.add("accept");
  return s;
}
function mainDoneEdgesFor(currentIdx, phase, techDelayResolved) {
  const s = /* @__PURE__ */ new Set();
  const holding = phase === "technical_delay" || phase === "customer_delay" || phase === "form_not_submitted" || phase === "form_link_sent";
  const idx = holding && (phase === "form_not_submitted" || phase === "form_link_sent") ? 2 : holding ? 3 : phase === "consultation_done" ? 4 : currentIdx;
  if (idx >= 2) s.add("e_or_fn");
  if (idx >= 3) s.add("e_fn_fs");
  if (idx >= 4) {
    if (techDelayResolved) {
      s.add("e_fs_b02");
      s.add("e_b02_b03");
      s.add("e_b03_gv");
    } else {
      s.add("e_top_gv");
    }
  }
  if (idx >= 5) s.add("e_gv_cs");
  return s;
}
function currentMainEdgesFor(currentIdx, phase, terminal, techDelayResolved) {
  const s = /* @__PURE__ */ new Set();
  if (terminal) return s;
  if (phase === "customer_delay") return s;
  if (phase === "form_not_submitted" || phase === "form_link_sent") {
    s.add("e_or_fn");
    return s;
  }
  if (currentIdx <= 2) s.add("e_or_fn");
  if (currentIdx === 3) {
    if (phase === "technical_delay") {
      s.add("e_fs_b02");
      s.add("e_b02_b03");
    } else if (phase === "post_b03_resume") ;
    else {
      s.add("e_top_gv");
    }
  }
  if (currentIdx === 4) s.add("e_gv_cs");
  return s;
}
function currentStageNodeFor(currentIdx, phase, terminal) {
  if (phase === "consultation_done") return null;
  if (terminal === "completed") return "b07_accept";
  if (terminal === "closed") return "closed_e010";
  if (phase === "technical_delay") return "b02_tech";
  if (phase === "customer_delay") return "b04_cust";
  if (phase === "application_rejected") return "b08_reject";
  if (phase === "form_not_submitted" || phase === "form_link_sent") return "form_not";
  if (currentIdx <= 1) return "order_rec";
  if (currentIdx === 2) return "form_not";
  if (currentIdx === 3) return "form_sub";
  if (currentIdx === 4) return "govt_portal";
  if (currentIdx >= 5) return "consult_stage";
  return null;
}
const RESOLVED_TECH_EDGES = /* @__PURE__ */ new Set(["e_fs_b02", "e_b02_b03", "e_b03_gv"]);
function edgeState(e, i) {
  if (i.phase === "consultation_done" && e.id === "e_gv_b06") return "done";
  if (i.doneMainEdges.has(e.id)) return "done";
  if (i.currentMainEdges && i.currentMainEdges.has(e.id)) return "active";
  if ((i.phase === "form_submitted" || i.phase === "post_b03_resume") && !i.terminal) {
    const POSSIBLE_NEXT_FROM_FORM_SUB = /* @__PURE__ */ new Set([
      "e_fs_b02",
      // Into Technical Delay
      "e_top_gv",
      // Main happy path → Govt Portal
      "e_top_cs",
      // Top loop → Application Accepted/Closed
      "e_bot_b04",
      // Into Customer Side Delay
      "e_gv_b05",
      "e_gv_b06",
      // Govt sub-drops (B05 / B06)
      "e_cs_b07",
      "e_cs_b08"
      // Consult stage sub-drops (B07 / B08)
    ]);
    if (POSSIBLE_NEXT_FROM_FORM_SUB.has(e.id)) return "active";
  }
  if (i.activeBranches.has(e.branch)) {
    if (i.phase === "technical_delay" && e.branch === "technical" && e.id !== "e_fs_b02" && e.id !== "e_b02_b03") {
      return "idle";
    }
    const isClosurePath = e.branch === "form-nag" || e.branch === "customer-delay" || e.branch === "customer-delay-main" || e.branch === "customer-delay-tech" || e.branch === "customer-delay-govt" || e.branch === "reject";
    if (i.terminal === "closed" && isClosurePath) return "closed";
    if (i.terminal === "completed" && (e.branch === "accept" || e.branch === "consult" || e.branch === "submit")) {
      return "done";
    }
    if (e.branch === "form-nag" && !i.terminal) return "active";
    if (isClosurePath && !i.terminal) return "warning";
    return "active";
  }
  if (RESOLVED_TECH_EDGES.has(e.id) && i.phase !== "technical_delay" && (i.currentIdx ?? 0) >= 4 && !i.terminal) {
    return "done";
  }
  if ((e.branch === "submit" || e.branch === "consult") && (i.currentIdx ?? 0) >= 5 && !i.terminal) {
    return "done";
  }
  return "idle";
}
const STAGE_IDX = {
  order_rec: 1,
  form_not: 2,
  form_sub: 3,
  govt_portal: 4,
  consult_stage: 5
};
function nodeState(nodeId, i) {
  if (i.phase === "consultation_done") {
    if (nodeId === "b06_consult") return "done";
    if (nodeId === "govt_portal") return "done";
    const stageIdx2 = STAGE_IDX[nodeId];
    if (stageIdx2 !== void 0 && stageIdx2 <= 4) return "done";
    return "idle";
  }
  if (nodeId === "b07_accept" && i.terminal === "completed") return "terminal-ok";
  if (nodeId === "closed_e010" && i.terminal === "closed") return "terminal-bad";
  if (i.currentStageNode && nodeId === i.currentStageNode && !i.terminal) return "active";
  const stageIdx = STAGE_IDX[nodeId];
  if (stageIdx !== void 0) {
    if (i.terminal === "closed" || i.terminal === "completed" || i.phase === "customer_delay" || i.phase === "technical_delay") {
      if (i.currentIdx >= stageIdx) return "done";
    } else {
      if (i.currentIdx > stageIdx) return "done";
    }
  }
  const incident = EDGES.some(
    (e) => {
      if (!i.activeBranches.has(e.branch)) return false;
      const node = nodeById[nodeId];
      if (node?.kind === "action" || node?.kind === "sub" || node?.kind === "terminal") {
        return e.to === nodeId;
      }
      return e.from === nodeId || e.to === nodeId;
    }
  );
  if (incident) return "active";
  return "idle";
}
const listOrderTickets = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: string().uuid()
}).parse(raw)).handler(createSsrRpc("8446842926479d9bb065c40b7124967c797ca4f270272cc9e07577d7043a6ea3"));
createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  applicationId: string().uuid()
}).parse(d)).handler(createSsrRpc("fe7953f392b66ecd37c4ffb1340a423e171201938de5cea5dfecccc2c236cf5d"));
createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  applicationId: string().uuid()
}).parse(d)).handler(createSsrRpc("0e23263f3aa24b2ca04e233c1028ea0ba3c3304d250b05d9bf39d1fa08281eda"));
const listDelayReasons = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("da9d6d9c3d8004b320f0cf7c11c397ee2dcbf6fa79d35d73f58a42a06073fa80"));
const listClosureReasons = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("21cf5bdf472b1a08d7a6b6a5005857b5d1fc8e3d479943f6396bfaec13cf77d4"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  applicationId: string().uuid(),
  eventType: string().min(1).max(64),
  title: string().min(1).max(200),
  description: string().max(4e3).optional(),
  customerVisible: boolean().optional(),
  metadata: record(string(), any()).optional()
}).parse(d)).handler(createSsrRpc("6af93f738eb386d4b69f4ada2d3ea06b746dcce13ad8028ee779a193d920c102"));
const PRIORITY = _enum(["low", "normal", "high", "urgent"]);
const setExternalDelay = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  applicationId: string().uuid(),
  reasonCode: string().min(1).max(64),
  reasonLabel: string().min(1).max(160),
  internalNote: string().max(4e3).optional(),
  customerNote: string().max(4e3).optional(),
  expectedReviewAt: string().min(1),
  priority: PRIORITY.default("normal"),
  kind: _enum(["external_dependency", "government_portal_pending"]).default("external_dependency"),
  evidence: object({
    fileName: string().trim().min(1).max(255),
    mimeType: string().trim().min(1).max(100),
    base64Data: string().min(1)
  }).optional()
}).parse(d)).handler(createSsrRpc("a5ca012de55c756cbdcd5e32d5729343fa721101501b748ce2589b600869ae27"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  applicationId: string().uuid(),
  note: string().max(2e3).optional()
}).parse(d)).handler(createSsrRpc("88b2c0a30e259b02476c36a336c6e49582e40494fce6ed45c6d1e4edc98640a4"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  applicationId: string().uuid(),
  summary: string().max(2e3).optional()
}).parse(d)).handler(createSsrRpc("ac3259a8b2f79a78c18eef3be950db1a5440f184e23ec5591981811aac4ca088"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  id: string().uuid()
}).parse(d)).handler(createSsrRpc("0badad713f90f6888cfa77b2356fdc2be9a50b04cbd94d1f1a380b93da87827b"));
function fmtDuration(mins) {
  if (mins < 60) return `${mins} min`;
  if (mins < 60 * 24) {
    const h = Math.floor(mins / 60), m = mins % 60;
    return m ? `${h}h ${m}m` : `${h} hour${h === 1 ? "" : "s"}`;
  }
  const d = Math.floor(mins / (60 * 24));
  return `${d} day${d === 1 ? "" : "s"}`;
}
function KeypadIcon({ className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      className,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "18", height: "18", x: "3", y: "3", rx: "4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M7 8h2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M11 8h2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M15 8h2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M7 12h2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M11 12h2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M15 12h2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M7 16h2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M11 16h2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M15 16h2" })
      ]
    }
  );
}
function getReasonVisuals(r) {
  const code = (r.code || "").toLowerCase();
  const label = (r.label || "").toLowerCase();
  if (code.includes("customer_non_responsive") || code.includes("unreachable") || label.includes("unreachable") || label.includes("non-responsive")) {
    return {
      Icon: Phone,
      iconBg: "bg-blue-100 text-blue-600"
    };
  }
  if (code.includes("otp") || code.includes("verification") || label.includes("otp") || label.includes("verification assistance")) {
    return {
      Icon: KeypadIcon,
      iconBg: "bg-purple-100 text-purple-600"
    };
  }
  if (code.includes("user_does_not_wish_to_proceed") || code.includes("change_of_mind") || label.includes("does not wish") || label.includes("wish to proceed") || label.includes("change of mind")) {
    return {
      Icon: CircleX,
      iconBg: "bg-rose-100 text-rose-500"
    };
  }
  if (code.includes("documents_missing") || code.includes("document") || label.includes("document")) {
    return {
      Icon: FileText,
      iconBg: "bg-emerald-100 text-emerald-600"
    };
  }
  if (code.includes("incorrect_information") || label.includes("incorrect") || label.includes("incomplete")) {
    return {
      Icon: UserRound,
      iconBg: "bg-amber-100 text-amber-600"
    };
  }
  if (code.includes("wait") || code.includes("on_hold") || label.includes("wait") || label.includes("on hold")) {
    return {
      Icon: Clock,
      iconBg: "bg-amber-100 text-amber-500"
    };
  }
  if (code.includes("call_not_answered") || label.includes("call not answered") || label.includes("call not")) {
    return {
      Icon: PhoneOff,
      iconBg: "bg-pink-100 text-pink-500"
    };
  }
  if (code.includes("whatsapp") || code.includes("email") || label.includes("whatsapp") || label.includes("email")) {
    return {
      Icon: MessageSquare,
      iconBg: "bg-teal-100 text-teal-600"
    };
  }
  if (code.includes("eligibility") || label.includes("eligibility")) {
    return {
      Icon: TriangleAlert,
      iconBg: "bg-indigo-100 text-indigo-600"
    };
  }
  return {
    Icon: Clock,
    iconBg: "bg-sky-100 text-sky-600"
  };
}
function getBadgeText(r) {
  if (r.email_template_code) {
    return r.email_template_code.toUpperCase().replace(/^BHS_/, "");
  }
  return (r.code || "").toUpperCase();
}
function CustomerDelayDialog({ applicationId, open, onClose }) {
  const qc = useQueryClient();
  const fnReasons = useServerFn(listDelayReasons);
  const fnSubmit = useServerFn(setExternalDelay);
  const fnSettings = useServerFn(getAppSettings);
  const { data: reasons, isLoading: reasonsLoading } = useQuery({
    queryKey: ["workflow-delay-reasons"],
    queryFn: () => fnReasons({ data: {} }),
    enabled: open
  });
  const { data: settings } = useQuery({
    queryKey: ["app-settings"],
    queryFn: () => fnSettings(),
    enabled: open
  });
  const autocloseMinutes = settings?.customerDelayAutocloseMinutes ?? 480;
  const [reasonCode, setReasonCode] = reactExports.useState("");
  const [internalNote, setInternalNote] = reactExports.useState("");
  const [customerNote, setCustomerNote] = reactExports.useState("");
  const [search, setSearch] = reactExports.useState("");
  const [showNotes, setShowNotes] = reactExports.useState(false);
  const allReasons = reasons?.reasons ?? [];
  const filteredReasons = reactExports.useMemo(() => {
    const s = search.trim().toLowerCase();
    return allReasons.filter((r) => (r.side ?? "customer") === "customer").filter(
      (r) => !s || r.label.toLowerCase().includes(s) || (r.description ?? "").toLowerCase().includes(s) || r.code.toLowerCase().includes(s)
    ).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }, [allReasons, search]);
  reactExports.useEffect(() => {
    if (open) {
      setSearch("");
      setInternalNote("");
      setCustomerNote("");
      setReasonCode("");
      setShowNotes(false);
    }
  }, [open]);
  reactExports.useEffect(() => {
    if (open && filteredReasons.length && !filteredReasons.find((r) => r.code === reasonCode)) {
      setReasonCode(filteredReasons[0].code);
    }
  }, [open, reasons]);
  const selected = filteredReasons.find((r) => r.code === reasonCode) ?? null;
  const selectedVisuals = selected ? getReasonVisuals(selected) : null;
  const selectedBadge = selected ? getBadgeText(selected) : "";
  const mut = useMutation({
    mutationFn: async () => {
      const reason = allReasons.find((r) => r.code === reasonCode);
      if (!reason) throw new Error("Please pick a reason");
      const expectedIso = new Date(Date.now() + autocloseMinutes * 6e4).toISOString().slice(0, 10);
      await fnSubmit({
        data: {
          applicationId,
          reasonCode,
          reasonLabel: reason.label,
          internalNote: internalNote || void 0,
          customerNote: customerNote || void 0,
          expectedReviewAt: expectedIso,
          priority: "normal",
          kind: "external_dependency"
        }
      });
    },
    onSuccess: () => {
      toast.success(`Customer notified — auto-closes in ${fmtDuration(autocloseMinutes)} if no reply.`);
      qc.invalidateQueries({ queryKey: ["workflow-events", applicationId] });
      qc.invalidateQueries({ queryKey: ["workflow-reminders", applicationId] });
      qc.invalidateQueries({ queryKey: ["order-detail-v2", applicationId] });
      qc.invalidateQueries({ queryKey: ["order-workflow-state", applicationId] });
      onClose();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to mark delay")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-4xl w-[95vw] md:w-full max-h-[92vh] flex flex-col p-0 overflow-hidden gap-0 rounded-2xl bg-white shadow-2xl border border-slate-200", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "shrink-0 px-6 py-5 border-b border-slate-100 flex-row items-center gap-3.5 space-y-0 text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-2xl bg-blue-50 border border-blue-100/80 text-blue-600 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserRound, { className: "size-6 stroke-[2.2]" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold text-slate-900 tracking-tight", children: "Customer-side delay" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-sm text-slate-500 font-normal mt-0.5", children: "Select the reason for the delay" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 px-6 pt-5 pb-3 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input$1,
          {
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Search customer reasons...",
            className: "pl-10 h-10 text-sm rounded-xl border-slate-200 bg-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-500 shadow-none"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-10 px-4 rounded-xl bg-slate-100/90 border border-slate-200/60 text-slate-600 font-medium text-xs flex items-center justify-center shrink-0", children: [
        filteredReasons.length,
        " reason",
        filteredReasons.length === 1 ? "" : "s"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto min-h-0 px-6 py-2", children: reasonsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid place-items-center h-48 text-sm text-slate-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-6 animate-spin text-blue-600" }) }) : filteredReasons.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-slate-500 py-16 text-center", children: "No matching customer reasons found." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3.5 pb-2", children: filteredReasons.map((r) => {
      const isSelected = r.code === reasonCode;
      const visuals = getReasonVisuals(r);
      const badgeText = getBadgeText(r);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setReasonCode(r.code),
          className: cn(
            "group w-full text-left rounded-2xl p-3.5 transition-all flex items-start gap-3 relative",
            isSelected ? "border-2 border-blue-500 bg-blue-50/25 ring-4 ring-blue-500/10 shadow-sm" : "border border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/50"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: cn(
                  "size-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                  isSelected ? "border-blue-600" : "border-slate-300 group-hover:border-slate-400"
                ),
                children: isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-2.5 rounded-full bg-blue-600" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: cn(
                  "size-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                  visuals.iconBg
                ),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(visuals.Icon, { className: "size-5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[13.5px] font-bold text-slate-900 leading-snug", children: r.label }),
              r.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11.5px] text-slate-500 leading-relaxed mt-1 line-clamp-2", children: r.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex items-center gap-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center text-[10px] font-mono font-semibold text-slate-600 bg-slate-100/90 border border-slate-200/70 px-2 py-0.5 rounded-md tracking-wide", children: badgeText }) })
            ] })
          ]
        },
        r.code
      );
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 border-t border-slate-100 bg-slate-50/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-2.5 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setShowNotes(!showNotes),
            className: "text-xs font-medium text-slate-600 hover:text-blue-600 flex items-center gap-1.5 transition py-0.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-3.5 text-slate-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: showNotes ? "Hide notes & auto-close info" : "+ Add internal or email note (optional)" }),
              showNotes ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "size-3.5 text-slate-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3.5 text-slate-400" }),
              (internalNote || customerNote) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded-full ml-1", children: "Note added" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-slate-400 hidden sm:block", children: [
          "Auto-closes in ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-600", children: fmtDuration(autocloseMinutes) }),
          " if no reply"
        ] })
      ] }),
      showNotes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 pb-4 pt-1 space-y-3 bg-slate-50/80 border-t border-slate-100 animate-in fade-in-50 duration-150", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5 text-xs text-amber-900 bg-amber-50/90 border border-amber-200/80 rounded-xl p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "size-4 shrink-0 text-amber-600 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "leading-snug text-[11.5px]", children: [
            "Customer receives ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: selectedBadge || "E003" }),
            " intimation now. Order auto-closes after",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: fmtDuration(autocloseMinutes) }),
            " of no reply. You can ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Resume" }),
            " anytime before that."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] uppercase tracking-wider font-semibold text-slate-500", children: "Internal note (visible to the team only)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              value: internalNote,
              onChange: (e) => setInternalNote(e.target.value),
              rows: 2,
              className: "mt-1 text-xs bg-white border-slate-200 rounded-lg",
              placeholder: selected?.description ? `e.g. ${selected.description.slice(0, 80)}…` : "Add context for the team"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-[11px] uppercase tracking-wider font-semibold text-slate-500 flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "size-3 text-slate-400" }),
            "Customer-visible note (optional — appended to the email)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              value: customerNote,
              onChange: (e) => setCustomerNote(e.target.value),
              rows: 2,
              className: "mt-1 text-xs bg-white border-slate-200 rounded-lg",
              placeholder: "Will be included at the bottom of the delay email"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 px-6 py-3.5 border-t border-slate-200/80 bg-white flex flex-col sm:flex-row items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full sm:w-auto min-w-0 flex items-center gap-2.5", children: selected && selectedVisuals ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-4 rounded-full border-2 border-blue-600 flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-2 rounded-full bg-blue-600" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-medium text-slate-400", children: "Selected Reason:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: cn(
                  "size-7 rounded-lg flex items-center justify-center shrink-0",
                  selectedVisuals.iconBg
                ),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(selectedVisuals.Icon, { className: "size-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-slate-900 truncate max-w-[280px] md:max-w-[380px]", children: selected.label }),
              selected.description && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 truncate max-w-[280px] md:max-w-[380px]", children: selected.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center text-[9px] font-mono font-semibold text-slate-600 bg-slate-100 border border-slate-200/60 px-1.5 py-0.2 rounded", children: selectedBadge }) })
            ] })
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400", children: "Pick a reason to continue" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 shrink-0 ml-auto w-full sm:w-auto justify-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: onClose,
            className: "h-10 px-5 text-sm font-medium text-slate-700 rounded-xl border-slate-200 hover:bg-slate-100",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            onClick: () => mut.mutate(),
            disabled: mut.isPending || !reasonCode,
            className: "h-10 px-5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition gap-2",
            children: [
              mut.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }),
              "Mark Customer Delay"
            ]
          }
        )
      ] })
    ] })
  ] }) });
}
function fmtFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
function TechnicalDelayDialog({ applicationId, open, onClose }) {
  const qc = useQueryClient();
  const fnReasons = useServerFn(listDelayReasons);
  const fnSubmit = useServerFn(setExternalDelay);
  const { data: reasons, isLoading: reasonsLoading } = useQuery({
    queryKey: ["workflow-delay-reasons"],
    queryFn: () => fnReasons({ data: {} }),
    enabled: open
  });
  const [reasonCode, setReasonCode] = reactExports.useState("");
  const [internalNote, setInternalNote] = reactExports.useState("");
  const [search, setSearch] = reactExports.useState("");
  const [evidence, setEvidence] = reactExports.useState(null);
  const fileInputRef = reactExports.useRef(null);
  const allReasons = reasons?.reasons ?? [];
  const filteredReasons = reactExports.useMemo(() => {
    const s = search.trim().toLowerCase();
    return allReasons.filter((r) => (r.side ?? "customer") === "internal").filter((r) => !s || r.label.toLowerCase().includes(s) || (r.description ?? "").toLowerCase().includes(s)).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }, [allReasons, search]);
  reactExports.useEffect(() => {
    if (open) {
      setSearch("");
      setInternalNote("");
      setReasonCode("");
      setEvidence(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [open]);
  reactExports.useEffect(() => {
    if (open && filteredReasons.length && !filteredReasons.find((r) => r.code === reasonCode)) {
      setReasonCode(filteredReasons[0].code);
    }
  }, [open, reasons]);
  const selected = filteredReasons.find((r) => r.code === reasonCode) ?? null;
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      toast.error("Unsupported file type. Please upload a PNG, JPG, or WEBP image.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File exceeds 5 MB limit. Please upload a smaller image.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      const base64 = evt.target?.result;
      if (base64) {
        setEvidence({
          file,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type || "image/png",
          previewUrl: base64,
          base64Data: base64
        });
        toast.success(`Screenshot attached: ${file.name}`);
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };
  const handleRemoveEvidence = () => {
    setEvidence(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.info("Screenshot removed.");
  };
  const mut = useMutation({
    mutationFn: async () => {
      const reason = allReasons.find((r) => r.code === reasonCode);
      if (!reason) throw new Error("Please pick a reason");
      await fnSubmit({
        data: {
          applicationId,
          reasonCode,
          reasonLabel: reason.label,
          internalNote: internalNote || void 0,
          expectedReviewAt: (/* @__PURE__ */ new Date()).toISOString(),
          priority: "normal",
          kind: "government_portal_pending",
          evidence: evidence ? {
            fileName: evidence.fileName,
            mimeType: evidence.mimeType,
            base64Data: evidence.base64Data
          } : void 0
        }
      });
    },
    onSuccess: () => {
      toast.success(
        evidence ? "Technical delay marked with screenshot evidence attached — customer notified." : "Technical delay marked — order placed on hold."
      );
      qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
      qc.invalidateQueries({ queryKey: ["orders-v2"] });
      qc.invalidateQueries({ queryKey: ["active-order-callback"] });
      qc.invalidateQueries({ queryKey: ["active-order-callback", applicationId] });
      qc.invalidateQueries({ queryKey: ["due-reminders-summary"] });
      qc.invalidateQueries({ queryKey: ["workflow-events", applicationId] });
      qc.invalidateQueries({ queryKey: ["workflow-reminders", applicationId] });
      qc.invalidateQueries({ queryKey: ["order-detail-v2", applicationId] });
      qc.invalidateQueries({ queryKey: ["order-workflow-state", applicationId] });
      qc.invalidateQueries({ queryKey: ["admin.order", applicationId] });
      onClose();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to mark delay")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden gap-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "shrink-0 px-5 py-4 border-b bg-gradient-to-r from-sky-50 to-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid place-items-center size-9 rounded-full bg-sky-100 text-sky-700 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { className: "size-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-base", children: "Our-side (technical) delay — internal follow-up" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-xs", children: "Marks the order on technical hold and notifies the customer with delay details." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto min-h-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_340px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-r", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-3 pb-2 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input$1,
                {
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  placeholder: "Search internal reasons…",
                  className: "pl-8 h-8 text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-[10px]", children: [
              filteredReasons.length,
              " reason",
              filteredReasons.length === 1 ? "" : "s"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-[280px] px-4 pb-4", children: reasonsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid place-items-center h-40 text-sm text-slate-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) }) : filteredReasons.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-slate-500 py-10 text-center", children: "No internal reasons configured." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: filteredReasons.map((r) => {
            const on = r.code === reasonCode;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setReasonCode(r.code),
                className: cn(
                  "w-full text-left rounded-lg border p-2.5 transition",
                  on ? "border-indigo-400 bg-indigo-50/60 ring-1 ring-indigo-200" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                ),
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("mt-0.5 size-4 rounded-full border grid place-items-center shrink-0", on ? "border-indigo-500 bg-indigo-500 text-white" : "border-slate-300 bg-white"), children: on && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[13px] font-medium text-slate-900 leading-snug", children: r.label }),
                    r.description && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11.5px] text-slate-500 leading-snug mt-0.5 line-clamp-2", children: r.description }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9.5px] font-mono uppercase text-slate-400 tracking-wider", children: r.code }),
                      r.email_template_code && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[9px] py-0 px-1 font-mono", children: r.email_template_code.toUpperCase().replace("BHS_", "") })
                    ] })
                  ] })
                ] })
              },
              r.code
            );
          }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-slate-50/40 space-y-3.5 flex flex-col justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-semibold text-slate-900 flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "size-3.5 text-indigo-600" }),
                "Evidence Screenshot ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-normal text-slate-500", children: "(Optional)" })
              ] }),
              evidence && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] text-emerald-700 bg-emerald-50 border-emerald-200", children: fmtFileSize(evidence.fileSize) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "file",
                ref: fileInputRef,
                accept: "image/png,image/jpeg,image/jpg,image/webp",
                onChange: handleFileSelect,
                className: "hidden"
              }
            ),
            !evidence ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => fileInputRef.current?.click(),
                className: "w-full border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/30 rounded-xl p-3.5 text-center transition flex flex-col items-center justify-center gap-1.5 group bg-white",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-full bg-slate-100 group-hover:bg-indigo-100 text-slate-500 group-hover:text-indigo-600 grid place-items-center transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-4" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-slate-700 group-hover:text-indigo-900", children: "Click to attach Portal Error Screenshot" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10.5px] text-slate-400", children: "PNG, JPG, or WEBP up to 5 MB" })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-slate-200 bg-white p-2.5 space-y-2.5 shadow-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative rounded-lg overflow-hidden border border-slate-200 bg-slate-950 aspect-video flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: evidence.previewUrl,
                  alt: "Government Portal Error Preview",
                  className: "w-full h-full object-contain"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-slate-800 truncate", title: evidence.fileName, children: evidence.fileName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10.5px] text-slate-400", children: "Attached as customer email attachment" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      onClick: () => fileInputRef.current?.click(),
                      className: "h-7 px-2 text-[11px] gap-1 bg-white",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-3" }),
                        " Replace"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "ghost",
                      size: "sm",
                      onClick: handleRemoveEvidence,
                      className: "h-7 px-2 text-[11px] text-rose-600 hover:text-rose-700 hover:bg-rose-50",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3" })
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 rounded-lg bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-1.5 leading-snug", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "size-3.5 text-amber-600 shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Make sure the screenshot does not contain any unnecessary internal information before sending it to the customer." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-sky-200 bg-sky-50/70 p-2.5 text-[11px] text-sky-900 flex gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "size-3.5 shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "leading-snug", children: [
              "Customer receives an official delay notification. The order is placed on ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Technical Delay" }),
              " hold until you ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Resume" }),
              " it."
            ] })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3.5 border-t bg-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] uppercase tracking-wider text-slate-500", children: "Internal note / instructions for team" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            value: internalNote,
            onChange: (e) => setInternalNote(e.target.value),
            rows: 2,
            className: "mt-1 text-sm",
            placeholder: selected?.description ? `e.g. ${selected.description}` : "Describe technical issue or next action…"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "shrink-0 px-5 py-3 border-t bg-slate-50 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mr-auto text-[11px] text-slate-500 flex items-center gap-1.5", children: selected ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3 text-sky-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Selected: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-slate-700", children: selected.label })
        ] }),
        evidence && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px] ml-1 bg-indigo-50 text-indigo-700 border-indigo-200", children: "+ Screenshot Attached" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Pick an internal reason to continue" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => mut.mutate(), disabled: mut.isPending || !reasonCode, className: "gap-1.5", children: [
        mut.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3 animate-spin" }),
        "Mark Technical Delay"
      ] })
    ] })
  ] }) });
}
const closeOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  applicationId: string().uuid(),
  reasonCode: string().min(1).max(64),
  reasonLabel: string().min(1).max(160),
  notes: string().max(4e3).optional(),
  silent: boolean().optional().default(false)
}).parse(d)).handler(createSsrRpc("17f0721bc034b4970400a330b29343e6721eb01fe6470405b55eeb1ae991dca2"));
const silentCloseOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  applicationId: string().uuid(),
  reasonCode: string().optional().default("ADMIN_SILENT_CLOSE"),
  reasonLabel: string().optional().default("Silent Close (Admin Override)"),
  notes: string().max(4e3).optional()
}).parse(d)).handler(createSsrRpc("6c00305b8313de356d6fc20dd2f97a12d6bc4d061a267cf63a7fd39f0dfae5cc"));
const createRefundRequest = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  applicationId: string().uuid(),
  paymentId: string().uuid().optional(),
  reason: string().max(2e3).optional(),
  reasonCode: string().max(64).optional(),
  customerNotes: string().max(2e3).optional(),
  refundAmount: number().nonnegative().optional(),
  refundMode: _enum(["full", "partial"]).optional()
}).parse(d)).handler(createSsrRpc("5c84987b4df8a607f9b4726f0d1383b336bfc825713aa01e61f0d1f9dc793d1a"));
createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  status: _enum(["pending", "approved", "rejected", "info_needed", "escalated"]).optional(),
  applicationId: string().uuid().optional()
}).parse(d)).handler(createSsrRpc("8d26cdba261f14f0ab9ac68dd289ccc9a884bbf2e560e508edf5a8195ea09a12"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  id: string().uuid(),
  decision: _enum(["approved", "rejected", "info_needed", "escalated"]),
  adminNotes: string().max(4e3).optional()
}).parse(d)).handler(createSsrRpc("26512d7455b89ae6ebb1899b7cc9642929a509dac6b82725cde3993486c58760"));
function CloseOrderDialog({
  applicationId,
  open,
  adminOverride = false,
  onClose
}) {
  const qc = useQueryClient();
  const role = useRole();
  const isAdmin = role.hasAny(["super_admin", "admin"]);
  const [isSilent, setIsSilent] = reactExports.useState(false);
  const fnStandardReasons = useServerFn(listCloseReasons);
  const fnWfReasons = useServerFn(listClosureReasons);
  const fnClose = useServerFn(closeOrder);
  const { data: stdReasons = [], isLoading: loadingStd } = useQuery({
    queryKey: ["order-close-reasons-std"],
    queryFn: () => fnStandardReasons(),
    enabled: open
  });
  const { data: wfData, isLoading: loadingWf } = useQuery({
    queryKey: ["workflow-closure-reasons"],
    queryFn: () => fnWfReasons({ data: {} }),
    enabled: open
  });
  const allReasons = reactExports.useMemo(() => {
    const list = [];
    const seenCodes = /* @__PURE__ */ new Set();
    for (const r of stdReasons) {
      const code = r.id || `R${r.number}`;
      if (!seenCodes.has(code.toLowerCase())) {
        seenCodes.add(code.toLowerCase());
        list.push({
          id: r.id,
          code,
          label: r.label,
          category: r.category === "A" ? "Customer-Side Delay" : r.category === "B" ? "Government Portal Delay" : r.category === "C" ? "Technical Interruption" : r.category || "Standard Reasons",
          standard_reply: r.standard_reply
        });
      }
    }
    if (wfData?.reasons) {
      for (const r of wfData.reasons) {
        if (!seenCodes.has(r.code.toLowerCase())) {
          seenCodes.add(r.code.toLowerCase());
          list.push({
            id: r.code,
            code: r.code,
            label: r.label,
            category: "Workflow Reasons",
            standard_reply: r.description
          });
        }
      }
    }
    return list;
  }, [stdReasons, wfData]);
  const [selectedCode, setSelectedCode] = reactExports.useState("");
  const [search, setSearch] = reactExports.useState("");
  const [activeCategory, setActiveCategory] = reactExports.useState("ALL");
  const [notes, setNotes] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (open && allReasons.length > 0) {
      if (!selectedCode || !allReasons.some((r) => r.code === selectedCode)) {
        setSelectedCode(allReasons[0].code);
      }
    }
  }, [open, allReasons, selectedCode]);
  const filteredReasons = reactExports.useMemo(() => {
    return allReasons.filter((r) => {
      const matchesSearch = !search.trim() || r.label.toLowerCase().includes(search.toLowerCase()) || r.code.toLowerCase().includes(search.toLowerCase()) || r.standard_reply && r.standard_reply.toLowerCase().includes(search.toLowerCase());
      const matchesCat = activeCategory === "ALL" || activeCategory === "A" && (r.category.includes("Customer") || r.code.startsWith("A")) || activeCategory === "BC" && (r.category.includes("Government") || r.category.includes("Technical") || r.code.startsWith("B") || r.code.startsWith("C"));
      return matchesSearch && matchesCat;
    });
  }, [allReasons, search, activeCategory]);
  const selectedReason = reactExports.useMemo(() => {
    return allReasons.find((r) => r.code === selectedCode) ?? allReasons[0] ?? null;
  }, [allReasons, selectedCode]);
  const mut = useMutation({
    mutationFn: async () => {
      if (!selectedReason) throw new Error("Please select a closure reason.");
      await fnClose({
        data: {
          applicationId,
          reasonCode: selectedReason.code,
          reasonLabel: selectedReason.label,
          notes: notes.trim() || void 0,
          silent: isSilent
        }
      });
    },
    onSuccess: () => {
      toast.success(`Order closed — closure reason: ${selectedReason?.label ?? "Force Closed"}`);
      qc.invalidateQueries({ queryKey: ["admin.order", applicationId] });
      qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
      qc.invalidateQueries({ queryKey: ["order-workflow-state", applicationId] });
      qc.invalidateQueries({ queryKey: ["workflow-events", applicationId] });
      qc.invalidateQueries({ queryKey: ["order-detail-v2", applicationId] });
      qc.invalidateQueries({ queryKey: ["workflow-timers", applicationId] });
      qc.invalidateQueries({ queryKey: ["order-tickets", applicationId] });
      qc.invalidateQueries({ queryKey: ["due-reminders-summary"] });
      onClose();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to force close order")
  });
  if (!open) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-rose-100 bg-gradient-to-r from-rose-50/80 via-slate-50 to-rose-50/40 px-6 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex size-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 font-bold shadow-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "size-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-slate-900", children: "Force Close Order (B10)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "Select a reason to terminate the order, cancel timers, and send closure notice." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onClose,
          className: "rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setActiveCategory("ALL"),
            className: cn(
              "rounded-full px-3 py-1 text-xs font-semibold transition",
              activeCategory === "ALL" ? "bg-slate-900 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            ),
            children: [
              "All Reasons (",
              allReasons.length,
              ")"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setActiveCategory("A"),
            className: cn(
              "rounded-full px-3 py-1 text-xs font-semibold transition",
              activeCategory === "A" ? "bg-amber-600 text-white shadow-xs" : "bg-amber-50 text-amber-800 hover:bg-amber-100"
            ),
            children: "Category A (Customer)"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setActiveCategory("BC"),
            className: cn(
              "rounded-full px-3 py-1 text-xs font-semibold transition",
              activeCategory === "BC" ? "bg-sky-600 text-white shadow-xs" : "bg-sky-50 text-sky-800 hover:bg-sky-100"
            ),
            children: "Category B/C (Govt/Tech)"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-2.5 size-4 text-slate-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Search close reason by name, code or keyword...",
            className: "w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-rose-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 transition"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs font-bold text-slate-700 mb-1.5", children: [
          "Select Closure Reason ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500", children: "*" })
        ] }),
        loadingStd || loadingWf ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center py-6 text-xs text-slate-500 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin text-rose-500" }),
          " Loading reasons list..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            value: selectedCode,
            onChange: (e) => setSelectedCode(e.target.value),
            className: "w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-medium text-slate-900 shadow-xs focus:border-rose-500 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 cursor-pointer",
            children: filteredReasons.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "No matching reasons found" }) : filteredReasons.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: r.code, children: [
              "[",
              r.code,
              "] ",
              r.label
            ] }, r.code))
          }
        )
      ] }),
      selectedReason && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-md bg-indigo-600 px-2 py-0.5 text-[11px] font-mono font-bold text-white shadow-xs", children: selectedReason.code }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-indigo-950", children: selectedReason.label })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-indigo-600 uppercase tracking-wider bg-indigo-100/80 px-2 py-0.5 rounded-full", children: selectedReason.category })
        ] }),
        selectedReason.standard_reply ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-slate-700 bg-white/80 rounded-lg p-2.5 border border-indigo-100 whitespace-pre-wrap leading-relaxed", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 font-bold text-indigo-900 mb-1 text-[11px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-3 text-indigo-600" }),
            " Standard Email Reply Preview (E010):"
          ] }),
          selectedReason.standard_reply
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-500 italic", children: "No standard reply text attached. Standard closure email notice will be sent." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: [
          "Internal Staff Remarks / Remarks for Customer ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 font-normal", children: "(Optional)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: notes,
            onChange: (e) => setNotes(e.target.value),
            rows: 2,
            placeholder: "Add specific remarks or context for closing this order...",
            className: "w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-rose-500 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 transition"
          }
        )
      ] }),
      isAdmin && adminOverride && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-amber-300 bg-amber-50/80 p-3 flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "size-4 text-amber-700 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-amber-900", children: "Silent Close Mode (No Email)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-amber-800", children: "Do not send E010 closure confirmation email to customer." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: isSilent,
              onChange: (e) => setIsSilent(e.target.checked),
              className: "sr-only peer"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600" })
        ] })
      ] }),
      isSilent ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5 rounded-xl bg-slate-900 p-3 border border-slate-700 text-xs text-slate-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "size-4 text-amber-400 shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-white", children: "Silent Closure Active:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-slate-300 leading-tight mt-0.5", children: [
            "This order will be closed silently on the system. ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "No email or notification" }),
            " will be sent to the customer."
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5 rounded-xl bg-amber-50 p-3 border border-amber-200/80 text-xs text-amber-900", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-4 text-amber-600 shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: "Important Notice:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-amber-800/90 leading-tight mt-0.5", children: [
            "Force closing this order will set its status to ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "CLOSED" }),
            ", immediately cancel all running timers, and queue the ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "E010 Closure Notice" }),
            " email to the customer."
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/80 px-6 py-3.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onClose,
          className: "rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer transition select-none",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => mut.mutate(),
          disabled: mut.isPending || !selectedCode,
          className: cn(
            "inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold text-white shadow-md disabled:opacity-50 cursor-pointer transition select-none",
            isSilent ? "bg-amber-600 hover:bg-amber-700" : "bg-rose-600 hover:bg-rose-700"
          ),
          children: [
            mut.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 animate-spin" }),
            mut.isPending ? "Closing…" : isSilent ? "Confirm Silent Close (No Email)" : "Confirm Force Close Order (B10)"
          ]
        }
      )
    ] })
  ] }) });
}
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
const WEEKDAY_NAMES = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
const RECOMMENDED_SLOTS = [
  { id: "morning", label: "Morning Slot", timeStr: "10:30 AM", hour: 10, minute: 30, period: "AM" },
  { id: "post_lunch", label: "Post-Lunch", timeStr: "02:30 PM", hour: 2, minute: 30, period: "PM" },
  { id: "evening", label: "Evening Slot", timeStr: "06:00 PM", hour: 6, minute: 0, period: "PM" },
  { id: "end_of_shift", label: "End of Shift", timeStr: "08:30 PM", hour: 8, minute: 30, period: "PM" }
];
function CustomDateTimePicker({ value, onChange }) {
  const initialDate = value instanceof Date && !isNaN(value.getTime()) ? value : /* @__PURE__ */ new Date();
  const [viewYear, setViewYear] = reactExports.useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = reactExports.useState(initialDate.getMonth());
  const selectedYear = initialDate.getFullYear();
  const selectedMonth = initialDate.getMonth();
  const selectedDay = initialDate.getDate();
  const rawHours = initialDate.getHours();
  const rawMinutes = initialDate.getMinutes();
  const initialPeriod = rawHours >= 12 ? "PM" : "AM";
  const initial12Hour = rawHours % 12 === 0 ? 12 : rawHours % 12;
  const [hour12, setHour12] = reactExports.useState(initial12Hour);
  const [minute, setMinute] = reactExports.useState(rawMinutes);
  const [period, setPeriod] = reactExports.useState(initialPeriod);
  const [hourInput, setHourInput] = reactExports.useState(initial12Hour.toString().padStart(2, "0"));
  const [minuteInput, setMinuteInput] = reactExports.useState(rawMinutes.toString().padStart(2, "0"));
  reactExports.useEffect(() => {
    const rh = value.getHours();
    const rm = value.getMinutes();
    const p = rh >= 12 ? "PM" : "AM";
    const h12 = rh % 12 === 0 ? 12 : rh % 12;
    setHour12(h12);
    setMinute(rm);
    setPeriod(p);
    setHourInput(h12.toString().padStart(2, "0"));
    setMinuteInput(rm.toString().padStart(2, "0"));
  }, [value]);
  const commitChange = (year, month, day, h12, min, pm) => {
    let hours24 = h12 % 12;
    if (pm === "PM") hours24 += 12;
    const newDate = new Date(year, month, day, hours24, min, 0, 0);
    onChange(newDate);
  };
  const handleSelectDate = (year, month, day) => {
    commitChange(year, month, day, hour12, minute, period);
  };
  const handleHourStep = (delta) => {
    let nextH = hour12 + delta;
    if (nextH > 12) nextH = 1;
    if (nextH < 1) nextH = 12;
    setHour12(nextH);
    setHourInput(nextH.toString().padStart(2, "0"));
    commitChange(selectedYear, selectedMonth, selectedDay, nextH, minute, period);
  };
  const handleMinuteStep = (delta) => {
    let nextM = minute + delta;
    if (nextM >= 60) nextM = 0;
    if (nextM < 0) nextM = 59;
    setMinute(nextM);
    setMinuteInput(nextM.toString().padStart(2, "0"));
    commitChange(selectedYear, selectedMonth, selectedDay, hour12, nextM, period);
  };
  const handleHourInputChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 2);
    setHourInput(raw);
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 12) {
      setHour12(parsed);
      commitChange(selectedYear, selectedMonth, selectedDay, parsed, minute, period);
    }
  };
  const handleHourBlur = () => {
    const parsed = parseInt(hourInput, 10);
    let finalH = hour12;
    if (isNaN(parsed) || parsed < 1) finalH = 1;
    else if (parsed > 12) finalH = 12;
    else finalH = parsed;
    setHour12(finalH);
    setHourInput(finalH.toString().padStart(2, "0"));
    commitChange(selectedYear, selectedMonth, selectedDay, finalH, minute, period);
  };
  const handleMinuteInputChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 2);
    setMinuteInput(raw);
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 59) {
      setMinute(parsed);
      commitChange(selectedYear, selectedMonth, selectedDay, hour12, parsed, period);
    }
  };
  const handleMinuteBlur = () => {
    const parsed = parseInt(minuteInput, 10);
    let finalM = minute;
    if (isNaN(parsed) || parsed < 0) finalM = 0;
    else if (parsed > 59) finalM = 59;
    else finalM = parsed;
    setMinute(finalM);
    setMinuteInput(finalM.toString().padStart(2, "0"));
    commitChange(selectedYear, selectedMonth, selectedDay, hour12, finalM, period);
  };
  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    commitChange(selectedYear, selectedMonth, selectedDay, hour12, minute, newPeriod);
  };
  const handleSelectSlot = (slot) => {
    setHour12(slot.hour);
    setMinute(slot.minute);
    setPeriod(slot.period);
    setHourInput(slot.hour.toString().padStart(2, "0"));
    setMinuteInput(slot.minute.toString().padStart(2, "0"));
    commitChange(selectedYear, selectedMonth, selectedDay, slot.hour, slot.minute, slot.period);
  };
  const quickChips = reactExports.useMemo(() => {
    const today = /* @__PURE__ */ new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const plus2 = new Date(today);
    plus2.setDate(today.getDate() + 2);
    const nextMon = new Date(today);
    const dayOfWeek = today.getDay();
    const daysUntilNextMon = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    nextMon.setDate(today.getDate() + daysUntilNextMon);
    const formatChipLabel = (d) => {
      const day = d.getDate();
      const month = d.toLocaleString("en-US", { month: "short" });
      return `${day} ${month}`;
    };
    return [
      {
        id: "today",
        label: `Today (${formatChipLabel(today)})`,
        date: today
      },
      {
        id: "tomorrow",
        label: `Tomorrow (${formatChipLabel(tomorrow)})`,
        date: tomorrow
      },
      {
        id: "plus2",
        label: `+2 Days (${formatChipLabel(plus2)})`,
        date: plus2
      },
      {
        id: "next_monday",
        label: "Next Monday",
        date: nextMon
      }
    ];
  }, []);
  const calendarCells = reactExports.useMemo(() => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();
    const cells = [];
    const now = /* @__PURE__ */ new Date();
    const todayY = now.getFullYear();
    const todayM = now.getMonth();
    const todayD = now.getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevM = viewMonth === 0 ? 11 : viewMonth - 1;
      const prevY = viewMonth === 0 ? viewYear - 1 : viewYear;
      cells.push({
        day: d,
        month: prevM,
        year: prevY,
        isCurrentMonth: false,
        isSelected: prevY === selectedYear && prevM === selectedMonth && d === selectedDay,
        isToday: prevY === todayY && prevM === todayM && d === todayD
      });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        day: d,
        month: viewMonth,
        year: viewYear,
        isCurrentMonth: true,
        isSelected: viewYear === selectedYear && viewMonth === selectedMonth && d === selectedDay,
        isToday: viewYear === todayY && viewMonth === todayM && d === todayD
      });
    }
    const remaining = (cells.length > 35 ? 42 : 35) - cells.length;
    for (let d = 1; d <= remaining; d++) {
      const nextM = viewMonth === 11 ? 0 : viewMonth + 1;
      const nextY = viewMonth === 11 ? viewYear + 1 : viewYear;
      cells.push({
        day: d,
        month: nextM,
        year: nextY,
        isCurrentMonth: false,
        isSelected: nextY === selectedYear && nextM === selectedMonth && d === selectedDay,
        isToday: nextY === todayY && nextM === todayM && d === todayD
      });
    }
    return cells;
  }, [viewYear, viewMonth, selectedYear, selectedMonth, selectedDay]);
  const relativeDiffText = reactExports.useMemo(() => {
    const diffMs = value.getTime() - Date.now();
    if (diffMs <= 0) {
      return "Due right now / immediate trigger";
    }
    const totalMins = Math.round(diffMs / 6e4);
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    const days = Math.floor(hours / 24);
    if (days >= 1) {
      const remHours = hours % 24;
      return `Trigger in ${days} day${days > 1 ? "s" : ""}${remHours > 0 ? ` ${remHours} hr${remHours > 1 ? "s" : ""}` : ""}`;
    }
    if (hours >= 1) {
      return `Trigger in ${hours} hr${hours > 1 ? "s" : ""}${mins > 0 ? ` ${mins} min${mins > 1 ? "s" : ""}` : ""}`;
    }
    return `Trigger in ${totalMins} min${totalMins > 1 ? "s" : ""}`;
  }, [value]);
  const formattedLockedDate = reactExports.useMemo(() => {
    const weekday = value.toLocaleDateString("en-US", { weekday: "long" });
    const day = value.getDate();
    const month = value.toLocaleDateString("en-US", { month: "short" });
    const year = value.getFullYear();
    const h = hour12.toString().padStart(2, "0");
    const m = minute.toString().padStart(2, "0");
    return `${weekday}, ${day} ${month} ${year} at ${h}:${m} ${period}`;
  }, [value, hour12, minute, period]);
  const isCurrentSlotActive = (slot) => {
    return hour12 === slot.hour && minute === slot.minute && period === slot.period;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-blue-100 bg-slate-50/80 p-4 shadow-sm space-y-4 animate-in fade-in duration-200", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex size-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-sm text-slate-900 tracking-tight", children: "Select Custom Callback Date & Time" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 shadow-2xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full bg-amber-500 animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Live Timezone: Asia/Kolkata (IST • UTC +5:30)" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 bg-white border border-slate-200 rounded-xl p-3 shadow-2xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-1.5", children: quickChips.map((chip) => {
          const isChipSelected = selectedYear === chip.date.getFullYear() && selectedMonth === chip.date.getMonth() && selectedDay === chip.date.getDate();
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setViewYear(chip.date.getFullYear());
                setViewMonth(chip.date.getMonth());
                handleSelectDate(
                  chip.date.getFullYear(),
                  chip.date.getMonth(),
                  chip.date.getDate()
                );
              },
              className: cn(
                "px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer select-none",
                isChipSelected ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              ),
              children: chip.label
            },
            chip.id
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-xs text-slate-900 flex items-center gap-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            MONTH_NAMES[viewMonth],
            " ",
            viewYear
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  if (viewMonth === 0) {
                    setViewMonth(11);
                    setViewYear(viewYear - 1);
                  } else {
                    setViewMonth(viewMonth - 1);
                  }
                },
                className: "p-1 rounded-md hover:bg-slate-100 text-slate-600 transition",
                "aria-label": "Previous Month",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "size-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  if (viewMonth === 11) {
                    setViewMonth(0);
                    setViewYear(viewYear + 1);
                  } else {
                    setViewMonth(viewMonth + 1);
                  }
                },
                className: "p-1 rounded-md hover:bg-slate-100 text-slate-600 transition",
                "aria-label": "Next Month",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-1 text-center", children: WEEKDAY_NAMES.map((wd) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold text-slate-400 py-0.5 uppercase tracking-wider", children: wd }, wd)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-1", children: calendarCells.map((cell, idx) => {
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                setViewYear(cell.year);
                setViewMonth(cell.month);
                handleSelectDate(cell.year, cell.month, cell.day);
              },
              className: cn(
                "h-8 w-full rounded-lg text-xs font-semibold flex flex-col items-center justify-center transition select-none cursor-pointer relative",
                cell.isSelected ? "bg-blue-600 text-white font-bold shadow-xs" : cell.isCurrentMonth ? "text-slate-800 hover:bg-blue-50 hover:text-blue-700" : "text-slate-300 hover:bg-slate-50",
                cell.isToday && !cell.isSelected && "border border-blue-400 font-bold text-blue-600"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: cell.day }),
                cell.isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 bg-white rounded-full -mt-0.5" })
              ]
            },
            `${cell.year}-${cell.month}-${cell.day}-${idx}`
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-1 border-t border-slate-100 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                const now = /* @__PURE__ */ new Date();
                setViewYear(now.getFullYear());
                setViewMonth(now.getMonth());
                handleSelectDate(now.getFullYear(), now.getMonth(), now.getDate());
              },
              className: "font-medium text-slate-500 hover:text-slate-800 transition",
              children: "Clear Selection"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                const now = /* @__PURE__ */ new Date();
                setViewYear(now.getFullYear());
                setViewMonth(now.getMonth());
                handleSelectDate(now.getFullYear(), now.getMonth(), now.getDate());
              },
              className: "font-bold text-blue-600 hover:text-blue-800 transition",
              children: "Select Today"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 flex flex-col justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5", children: "Recommended Ops Slots" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: RECOMMENDED_SLOTS.map((slot) => {
            const active = isCurrentSlotActive(slot);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => handleSelectSlot(slot),
                className: cn(
                  "p-2 rounded-xl text-left border transition cursor-pointer select-none",
                  active ? "border-blue-500 bg-blue-50/90 text-blue-900 shadow-2xs" : "border-slate-200 bg-white hover:bg-slate-50 text-slate-800"
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-semibold text-slate-500", children: slot.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("text-xs font-bold mt-0.5", active ? "text-blue-700 font-extrabold" : "text-blue-600"), children: slot.timeStr })
                ]
              },
              slot.id
            );
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-blue-100 bg-blue-50/50 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center mb-2", children: "Exact Callback Hour & Minute" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => handleHourStep(1),
                  className: "p-1 rounded hover:bg-blue-100 text-blue-600 transition",
                  "aria-label": "Increment Hour",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "size-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  inputMode: "numeric",
                  value: hourInput,
                  onChange: handleHourInputChange,
                  onBlur: handleHourBlur,
                  className: "w-14 py-1 bg-white border border-blue-200 rounded-xl text-xl font-bold text-blue-700 text-center shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => handleHourStep(-1),
                  className: "p-1 rounded hover:bg-blue-100 text-blue-600 transition",
                  "aria-label": "Decrement Hour",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5", children: "HRS" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold text-blue-400 pb-4", children: ":" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => handleMinuteStep(1),
                  className: "p-1 rounded hover:bg-blue-100 text-blue-600 transition",
                  "aria-label": "Increment Minute",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "size-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  inputMode: "numeric",
                  value: minuteInput,
                  onChange: handleMinuteInputChange,
                  onBlur: handleMinuteBlur,
                  className: "w-14 py-1 bg-white border border-blue-200 rounded-xl text-xl font-bold text-blue-700 text-center shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => handleMinuteStep(-1),
                  className: "p-1 rounded hover:bg-blue-100 text-blue-600 transition",
                  "aria-label": "Decrement Minute",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5", children: "MIN" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 pl-1 pb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => handlePeriodChange("AM"),
                  className: cn(
                    "px-2.5 py-1 rounded-lg text-xs font-bold transition select-none cursor-pointer",
                    period === "AM" ? "bg-blue-600 text-white shadow-xs" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  ),
                  children: "AM"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => handlePeriodChange("PM"),
                  className: cn(
                    "px-2.5 py-1 rounded-lg text-xs font-bold transition select-none cursor-pointer",
                    period === "PM" ? "bg-blue-600 text-white shadow-xs" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  ),
                  children: "PM"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-blue-200 bg-blue-50/90 p-2.5 flex items-start gap-2 shadow-2xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-4 text-blue-600 shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-800 leading-snug", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Callback locked for " }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "font-bold text-slate-900", children: formattedLockedDate }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] font-semibold text-blue-700 mt-0.5", children: [
              "(",
              relativeDiffText,
              ")"
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function formatTimelineTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric"
  }) + ", " + d.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}
function CallbackHistoryDialog({ orderId, orderCode = "Order", onClose }) {
  const getHistoryFn = useServerFn(getOrderCallbackHistory);
  const { data: history = [], isLoading, error } = useQuery({
    queryKey: ["order-callback-history", orderId],
    queryFn: () => getHistoryFn({ data: { orderId } }),
    staleTime: 5e3
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-[6px] overflow-y-auto",
      id: "callbackHistoryModalWrapper",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 border border-slate-200 flex flex-col max-h-[90vh]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-900 px-6 py-4 flex items-start justify-between gap-4 border-b border-slate-800 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-indigo-950/80 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5 border border-indigo-800/60 shadow-inner", children: /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "size-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-base md:text-lg text-white tracking-tight", children: "Callback History" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-2 py-0.5 rounded-full bg-indigo-900/60 text-indigo-200 text-[11px] font-bold border border-indigo-700/50", children: [
                  history.length,
                  " ",
                  history.length === 1 ? "Record" : "Records"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-300 mt-0.5 leading-snug", children: [
                "Order #",
                orderCode,
                " · Complete chronological audit of callback schedules & reschedules"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              className: "p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 md:p-6 overflow-y-auto flex-1 space-y-4 bg-slate-50/50", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-12 flex flex-col items-center justify-center text-slate-400 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-8 animate-spin text-indigo-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold", children: "Loading callback history..." })
        ] }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-4 text-rose-600 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Failed to load callback history." })
        ] }) : history.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-12 flex flex-col items-center justify-center text-slate-400 space-y-2 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "size-6" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-slate-700", children: "No Historical Records Yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 max-w-sm", children: "Callback scheduling actions for this order will be permanently recorded and displayed here." })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative pl-6 space-y-4 before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200", children: history.map((item, index) => {
          const isRescheduled = item.action_type === "CALLBACK_RESCHEDULED" || item.action_type === "RESCHEDULED";
          const isScheduled = item.action_type === "CALLBACK_SCHEDULED" || item.action_type === "SCHEDULED";
          const isCompleted = item.action_type === "CALLBACK_COMPLETED" || item.action_type === "CALL_COMPLETED";
          const isCancelled = item.action_type === "CALLBACK_CANCELLED" || item.action_type === "CANCELLED";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: cn(
                  "absolute -left-6 top-3 size-3 rounded-full border-2 bg-white ring-4 ring-slate-50 transition-transform group-hover:scale-125",
                  isRescheduled ? "border-amber-500 bg-amber-500" : isScheduled ? "border-indigo-600 bg-indigo-600" : isCompleted ? "border-emerald-600 bg-emerald-600" : "border-slate-400 bg-slate-400"
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 hover:border-indigo-200 hover:shadow-xs transition-all space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: cn(
                        "px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-2xs",
                        isRescheduled ? "bg-amber-100 text-amber-900 border border-amber-300" : isScheduled ? "bg-indigo-100 text-indigo-900 border border-indigo-300" : isCompleted ? "bg-emerald-100 text-emerald-900 border border-emerald-300" : "bg-slate-100 text-slate-800 border border-slate-300"
                      ),
                      children: [
                        isRescheduled && /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-3 text-amber-700" }),
                        isScheduled && /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-3 text-indigo-700" }),
                        isCompleted && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3 text-emerald-700" }),
                        isCancelled && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-3 text-slate-600" }),
                        isRescheduled ? "Callback Rescheduled" : isScheduled ? "Callback Scheduled" : isCompleted ? "Call Completed" : "Callback Cancelled"
                      ]
                    }
                  ),
                  item.channel === "email" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-semibold inline-flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-2.5" }),
                    " Email"
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-semibold inline-flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneCall, { className: "size-2.5" }),
                    " Call"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 font-medium", children: formatTimelineTime(item.created_at) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-slate-700", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 font-medium", children: "By:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-900 font-bold border border-slate-200", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-3 text-slate-600" }),
                  item.actor_name || "Staff"
                ] }),
                item.actor_role && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-slate-500 uppercase font-semibold", children: [
                  "(",
                  item.actor_role,
                  ")"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-800", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-slate-900", children: "Reason:" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-800", children: item.reason_label || item.reason })
                ] }),
                item.note && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100", children: [
                  '"',
                  item.note,
                  '"'
                ] })
              ] }),
              (item.previous_fires_at || item.new_fires_at) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-xs", children: [
                item.previous_fires_at && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-50 rounded-lg p-2 border border-slate-200/80", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase font-bold text-slate-500 block mb-0.5", children: "Previous Schedule" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-700", children: formatTimelineTime(item.previous_fires_at) }),
                  item.previous_reason_label && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "block text-[11px] text-slate-500 truncate mt-0.5", children: [
                    "(",
                    item.previous_reason_label,
                    ")"
                  ] })
                ] }),
                item.new_fires_at && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(
                  "rounded-lg p-2 border",
                  isRescheduled ? "bg-amber-50/60 border-amber-200 text-amber-950" : "bg-indigo-50/60 border-indigo-200 text-indigo-950"
                ), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn(
                    "text-[10px] uppercase font-bold block mb-0.5",
                    isRescheduled ? "text-amber-800" : "text-indigo-800"
                  ), children: isRescheduled ? "New Rescheduled Time" : "Scheduled Time" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-slate-900", children: formatTimelineTime(item.new_fires_at) })
                ] })
              ] })
            ] })
          ] }, item.id || index);
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-slate-500", children: "Immutable callback timeline audit log" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              className: "px-4 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition cursor-pointer shadow-xs",
              children: "Close"
            }
          )
        ] })
      ] })
    }
  );
}
const OUTCOMES = [
  {
    id: "unreachable",
    label: "Customer Unreachable / No Answer",
    description: "Rang 3 times, disconnected or switched off",
    defaultNote: "Customer unreachable after multiple call attempts. Phone ringing / no response.",
    dotClass: "bg-rose-500",
    icon: null
  },
  {
    id: "call_back_later",
    label: "Customer Told: Call Back Later",
    description: "Customer gave explicit preferred time",
    defaultNote: "Customer answered and requested callback later. Will follow up at scheduled time.",
    dotClass: "bg-blue-600 animate-pulse",
    icon: null
  },
  {
    id: "busy_meeting",
    label: "Busy / Driving / In Meeting",
    description: "Customer cannot speak right now",
    defaultNote: "Customer is currently busy / in meeting / driving. Asked to call back shortly.",
    dotClass: null,
    icon: Briefcase,
    iconClass: "text-slate-500"
  },
  {
    id: "docs_pending",
    label: "Document Pending from Customer",
    description: "Fetching Aadhaar / PAN / Bill",
    defaultNote: "Customer fetching required documents (Aadhaar / PAN / Bill). Callback set to collect details.",
    dotClass: null,
    icon: FileText,
    iconClass: "text-emerald-600"
  }
];
function CallbackReminderDialog({
  orderId,
  orderCode: propOrderCode,
  customerName: propCustomerName,
  customerMobile: propCustomerMobile,
  assignedName: propAssignedName,
  initialChannel = "call",
  onClose
}) {
  const qc = useQueryClient();
  const getActiveFn = useServerFn(getActiveOrderCallback);
  const scheduleFn = useServerFn(scheduleOrderCallback);
  const cancelFn = useServerFn(cancelOrderCallback);
  const completeFn = useServerFn(completeOrderCallback);
  const getDetailFn = useServerFn(getOrderDetailV2);
  const getPresetsFn = useServerFn(getCallbackReminderPresetSettings);
  const { data: presetConfig } = useQuery({
    queryKey: ["callback-reminder-presets"],
    queryFn: () => getPresetsFn(),
    staleTime: 6e4
  });
  const quickMinutes = presetConfig?.quickMinutes ?? DEFAULT_CALLBACK_PRESET_CONFIG.quickMinutes;
  const recommendedHours = presetConfig?.recommendedHours ?? DEFAULT_CALLBACK_PRESET_CONFIG.recommendedHours;
  const afternoonHours = presetConfig?.afternoonHours ?? presetConfig?.eveningHours ?? DEFAULT_CALLBACK_PRESET_CONFIG.afternoonHours;
  const beforeShiftEndHours = presetConfig?.beforeShiftEndHours ?? presetConfig?.laterTodayHours ?? DEFAULT_CALLBACK_PRESET_CONFIG.beforeShiftEndHours;
  const tomorrowDefaultTime = presetConfig?.tomorrowDefaultTime ?? DEFAULT_CALLBACK_PRESET_CONFIG.tomorrowDefaultTime;
  const { data: activeCallback } = useQuery({
    queryKey: ["active-order-callback", orderId],
    queryFn: () => getActiveFn({ data: { orderId } }),
    staleTime: 5e3
  });
  const { data: orderDetail } = useQuery({
    queryKey: ["order-detail-v2", orderId],
    queryFn: () => getDetailFn({ data: { orderId } }),
    enabled: !propOrderCode || !propCustomerName,
    staleTime: 6e4
  });
  const orderCode = propOrderCode || orderDetail?.application?.application_code || "Order";
  propCustomerName || orderDetail?.customer?.name || orderDetail?.lead?.name || "Customer";
  const customerMobile = propCustomerMobile || orderDetail?.customer?.primary_mobile || orderDetail?.lead?.mobile || "";
  const staffName = propAssignedName || orderDetail?.assignedStaff?.display_name || orderDetail?.assignedStaff?.email || "Assigned Executive";
  const [selectedOutcome, setSelectedOutcome] = reactExports.useState("call_back_later");
  const [durationPreset, setDurationPreset] = reactExports.useState("recommended");
  const [customDate, setCustomDate] = reactExports.useState(() => new Date(Date.now() + 120 * 6e4));
  const [channel, setChannel] = reactExports.useState(initialChannel);
  const [note, setNote] = reactExports.useState("Customer answered and requested callback. Will keep Aadhaar OTP ready for verification.");
  const [completeNote, setCompleteNote] = reactExports.useState("");
  const [hotOrderSurge, setHotOrderSurge] = reactExports.useState(true);
  const [desktopAlert, setDesktopAlert] = reactExports.useState(true);
  const [whatsappReminder, setWhatsappReminder] = reactExports.useState(true);
  const targetDate = reactExports.useMemo(() => {
    const now = /* @__PURE__ */ new Date();
    if (durationPreset === "quick") {
      return new Date(now.getTime() + quickMinutes * 6e4);
    } else if (durationPreset === "recommended") {
      return new Date(now.getTime() + Math.round(recommendedHours * 60) * 6e4);
    } else if (durationPreset === "afternoon" || durationPreset === "evening") {
      return new Date(now.getTime() + Math.round(afternoonHours * 60) * 6e4);
    } else if (durationPreset === "before_shift_end" || durationPreset === "later_today") {
      return new Date(now.getTime() + Math.round(beforeShiftEndHours * 60) * 6e4);
    } else if (durationPreset === "tomorrow") {
      const t = new Date(now);
      t.setDate(t.getDate() + 1);
      const [h, m] = (tomorrowDefaultTime || "10:30").split(":").map(Number);
      t.setHours(isNaN(h) ? 10 : h, isNaN(m) ? 30 : m, 0, 0);
      return t;
    } else if (durationPreset === "custom") {
      return customDate;
    }
    return new Date(now.getTime() + Math.round(recommendedHours * 60) * 6e4);
  }, [durationPreset, customDate, quickMinutes, recommendedHours, afternoonHours, beforeShiftEndHours, tomorrowDefaultTime]);
  const [showHistory, setShowHistory] = reactExports.useState(false);
  const idempotencyKey = reactExports.useMemo(() => `${orderId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, [orderId]);
  const handleSelectOutcome = (outcomeId) => {
    setSelectedOutcome(outcomeId);
    const found = OUTCOMES.find((o) => o.id === outcomeId);
    if (found?.defaultNote) {
      setNote(found.defaultNote);
    }
  };
  const scheduleMut = useMutation({
    mutationFn: async () => {
      const outcomeObj = OUTCOMES.find((o) => o.id === selectedOutcome) || {
        id: "call_back_later",
        label: "Customer Follow-Up"
      };
      return scheduleFn({
        data: {
          orderId,
          reason: outcomeObj.id,
          reasonLabel: outcomeObj.label,
          customFiresAt: targetDate.toISOString(),
          note: note.trim() || null,
          channel,
          idempotencyKey
        }
      });
    },
    onSuccess: (res) => {
      const isReschedule = res?.actionType === "CALLBACK_RESCHEDULED";
      toast.success(
        isReschedule ? `Callback rescheduled for ${formatIST(targetDate.toISOString())}.` : `Callback scheduled for ${formatIST(targetDate.toISOString())}. Order tagged as HOT.`
      );
      qc.invalidateQueries({ queryKey: ["active-order-callback", orderId] });
      qc.invalidateQueries({ queryKey: ["order-callback-history", orderId] });
      qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
      qc.invalidateQueries({ queryKey: ["order-detail-v2", orderId] });
      qc.invalidateQueries({ queryKey: ["due-reminders-summary"] });
      onClose();
    },
    onError: (err) => {
      toast.error(err?.message ?? "Failed to schedule callback");
    }
  });
  const cancelMut = useMutation({
    mutationFn: async () => cancelFn({ data: { orderId } }),
    onSuccess: () => {
      toast.success("Callback reminder cancelled");
      qc.invalidateQueries({ queryKey: ["active-order-callback", orderId] });
      qc.invalidateQueries({ queryKey: ["order-callback-history", orderId] });
      qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
      qc.invalidateQueries({ queryKey: ["due-reminders-summary"] });
      onClose();
    },
    onError: (err) => toast.error(err?.message ?? "Failed to cancel reminder")
  });
  const completeMut = useMutation({
    mutationFn: async () => completeFn({ data: { orderId, callOutcomeNote: completeNote.trim() || null } }),
    onSuccess: () => {
      toast.success("Callback marked as completed!");
      qc.invalidateQueries({ queryKey: ["active-order-callback", orderId] });
      qc.invalidateQueries({ queryKey: ["order-callback-history", orderId] });
      qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
      qc.invalidateQueries({ queryKey: ["due-reminders-summary"] });
      onClose();
    },
    onError: (err) => toast.error(err?.message ?? "Failed to complete callback")
  });
  const isBusy = scheduleMut.isPending || cancelMut.isPending || completeMut.isPending;
  const formattedTrigger = reactExports.useMemo(() => {
    return formatIST(targetDate.toISOString());
  }, [targetDate]);
  const initials = reactExports.useMemo(() => {
    const parts = staffName.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return staffName.slice(0, 2).toUpperCase();
  }, [staffName]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-[6px] overflow-y-auto",
      id: "callbackModalWrapper",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 border border-slate-200 flex flex-col max-h-[92vh]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-900 px-6 py-4 flex items-start justify-between gap-4 border-b border-slate-800 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-teal-300 shrink-0 mt-0.5 border border-slate-700 shadow-inner", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-6" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-base md:text-lg text-white tracking-tight", children: "Schedule Customer Callback & Reminder" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-300 mt-0.5 leading-snug", children: "Customer is unreachable or requested a later callback. Set reminder timer & hot order trigger." })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-2.5 py-1 rounded-full bg-slate-800 text-slate-200 text-[11px] font-semibold uppercase tracking-wider border border-slate-700", children: [
                "Order #",
                orderCode
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  disabled: isBusy,
                  className: "p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-5 space-y-4 overflow-y-auto flex-1 text-slate-800", children: [
            activeCallback && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(
              "rounded-xl border p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3",
              activeCallback.isDue ? "border-rose-300 bg-rose-50 text-rose-950" : "border-indigo-200 bg-indigo-50/80 text-indigo-950"
            ), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-2", children: (() => {
                  const isTicketSourceHot = Boolean(
                    activeCallback.parsedRemarks?.channel === "email" || activeCallback.parsedRemarks?.reason === "ticket_hot_priority" || activeCallback.parsedRemarks?.reason === "order_reopened" || activeCallback.parsedRemarks?.ticketNumber || activeCallback.parsedRemarks?.origin === "support_ticket" || activeCallback.parsedRemarks?.reasonLabel && activeCallback.parsedRemarks.reasonLabel.toLowerCase().includes("ticket") || activeCallback.parsedRemarks?.note && activeCallback.parsedRemarks.note.toLowerCase().includes("ticket")
                  );
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    activeCallback.isDue ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded bg-rose-600 px-2 py-0.5 text-[10px] font-black uppercase text-white shadow-xs", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-3" }),
                      " ",
                      isTicketSourceHot ? "Email Action Due (HOT ORDER)" : "Call Due Now (HOT ORDER)"
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-black uppercase text-white shadow-xs", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-3" }),
                      " ",
                      isTicketSourceHot ? "Email Action Reminder Active" : "Scheduled Reminder Active"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-slate-900", children: [
                      "Due: ",
                      formatIST(activeCallback.fires_at)
                    ] }),
                    activeCallback.parsedRemarks?.channel === "technical_delay" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-100 text-sky-900 border border-sky-300 text-xs font-bold shadow-2xs", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { className: "size-3.5 text-sky-700" }),
                      " Technical Delay"
                    ] }) : activeCallback.parsedRemarks?.channel === "email" || isTicketSourceHot ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-300 text-xs font-bold shadow-2xs", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-3.5 text-purple-700" }),
                      " Check Email"
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold shadow-2xs", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneCall, { className: "size-3.5 text-amber-700" }),
                      " Check Call"
                    ] })
                  ] });
                })() }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-800", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "font-bold text-slate-900", children: "Reason:" }),
                  " ",
                  activeCallback.parsedRemarks?.reasonLabel || "Follow-up",
                  activeCallback.parsedRemarks?.note ? ` — "${activeCallback.parsedRemarks.note}"` : null
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                (activeCallback.historyCount ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowHistory(true),
                    className: "inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-white px-2.5 py-1 text-xs font-bold text-indigo-700 hover:bg-indigo-50 transition cursor-pointer shadow-2xs",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "size-3.5 text-indigo-600" }),
                      "History (",
                      activeCallback.historyCount,
                      ")"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => cancelMut.mutate(),
                    disabled: isBusy,
                    className: "rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-rose-600 transition cursor-pointer",
                    children: "Cancel Reminder"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => completeMut.mutate(),
                    disabled: isBusy,
                    className: "inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition cursor-pointer",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5" }),
                      " Complete Call"
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-[11px] font-bold", children: "1" }),
                  "Why is callback needed? (Call Outcome)"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-rose-600 font-bold tracking-wide uppercase", children: "Mandatory" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2", children: OUTCOMES.map((item) => {
                const isSelected = selectedOutcome === item.id;
                const Icon = item.icon;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "label",
                  {
                    onClick: () => handleSelectOutcome(item.id),
                    className: cn(
                      "group relative flex items-start gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all border select-none",
                      isSelected ? "bg-blue-50/70 border-blue-500/60 shadow-xs ring-1 ring-blue-500/30" : "bg-slate-50/50 hover:bg-slate-50 border-slate-200"
                    ),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "radio",
                          name: "call_outcome",
                          checked: isSelected,
                          onChange: () => handleSelectOutcome(item.id),
                          className: "mt-0.5 accent-blue-600"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                          item.dotClass && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("w-2.5 h-2.5 rounded-full shrink-0", item.dotClass) }),
                          Icon && /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("size-3.5 shrink-0", item.iconClass) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn(
                            "text-xs font-bold truncate",
                            isSelected ? "text-blue-950" : "text-slate-800"
                          ), children: item.label })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-500 mt-0.5 leading-snug", children: item.description })
                      ] }),
                      isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4 text-blue-600 ml-auto shrink-0 mt-0.5" })
                    ]
                  },
                  item.id
                );
              }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-1.5 mb-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-[11px] font-bold", children: "2" }),
                  "Set Reminder Duration"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs shadow-2xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "size-3 text-indigo-600 fill-indigo-600" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "Calculated Trigger: ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "font-bold text-slate-900", children: formattedTrigger })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 sm:grid-cols-6 gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setDurationPreset("quick"),
                    className: cn(
                      "px-2 py-1.5 rounded-lg text-center transition-colors border select-none cursor-pointer",
                      durationPreset === "quick" ? "bg-blue-600 text-white border-blue-600 shadow-xs font-bold" : "bg-white hover:bg-slate-50 text-slate-800 border-slate-200"
                    ),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("text-[10px] uppercase font-semibold", durationPreset === "quick" ? "text-blue-100" : "text-slate-400"), children: "Quick" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-bold", children: [
                        "+",
                        quickMinutes,
                        " Mins"
                      ] })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setDurationPreset("recommended"),
                    className: cn(
                      "px-2 py-1.5 rounded-lg text-center transition-colors border select-none cursor-pointer",
                      durationPreset === "recommended" ? "bg-blue-600 text-white border-blue-600 shadow-xs font-bold" : "bg-white hover:bg-slate-50 text-slate-800 border-slate-200"
                    ),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("text-[10px] uppercase font-semibold", durationPreset === "recommended" ? "text-blue-100" : "text-blue-600 font-bold"), children: "Recommended" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-bold flex items-center justify-center gap-1", children: [
                        recommendedHours,
                        " ",
                        recommendedHours === 1 ? "Hour" : "Hours",
                        durationPreset === "recommended" && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3" })
                      ] })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setDurationPreset("afternoon"),
                    className: cn(
                      "px-2 py-1.5 rounded-lg text-center transition-colors border select-none cursor-pointer",
                      durationPreset === "afternoon" || durationPreset === "evening" ? "bg-blue-600 text-white border-blue-600 shadow-xs font-bold" : "bg-white hover:bg-slate-50 text-slate-800 border-slate-200"
                    ),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("text-[10px] uppercase font-semibold", durationPreset === "afternoon" || durationPreset === "evening" ? "text-blue-100" : "text-slate-400"), children: "Afternoon" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-bold", children: [
                        afternoonHours,
                        " ",
                        afternoonHours === 1 ? "Hour" : "Hours"
                      ] })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setDurationPreset("before_shift_end"),
                    className: cn(
                      "px-2 py-1.5 rounded-lg text-center transition-colors border select-none cursor-pointer",
                      durationPreset === "before_shift_end" || durationPreset === "later_today" ? "bg-blue-600 text-white border-blue-600 shadow-xs font-bold" : "bg-white hover:bg-slate-50 text-slate-800 border-slate-200"
                    ),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("text-[10px] uppercase font-semibold", durationPreset === "before_shift_end" || durationPreset === "later_today" ? "text-blue-100" : "text-slate-400"), children: "Before Shift End" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-bold", children: [
                        beforeShiftEndHours,
                        " ",
                        beforeShiftEndHours === 1 ? "Hour" : "Hours"
                      ] })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setDurationPreset("tomorrow"),
                    className: cn(
                      "px-2 py-1.5 rounded-lg text-center transition-colors border select-none cursor-pointer",
                      durationPreset === "tomorrow" ? "bg-blue-600 text-white border-blue-600 shadow-xs font-bold" : "bg-white hover:bg-slate-50 text-slate-800 border-slate-200"
                    ),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("text-[10px] uppercase font-semibold", durationPreset === "tomorrow" ? "text-blue-100" : "text-slate-400"), children: "Tomorrow" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold", children: tomorrowDefaultTime || "10:30" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setDurationPreset("custom"),
                    className: cn(
                      "px-2 py-1.5 rounded-lg text-center transition-colors border select-none cursor-pointer flex flex-col items-center justify-center",
                      durationPreset === "custom" ? "bg-blue-600 text-white border-blue-600 shadow-xs font-bold" : "bg-white hover:bg-slate-50 text-slate-800 border-slate-200"
                    ),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: cn("size-3.5 mb-0.5", durationPreset === "custom" ? "text-white" : "text-slate-400") }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold", children: "Custom" })
                    ]
                  }
                )
              ] }),
              durationPreset === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 animate-in fade-in duration-150", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                CustomDateTimePicker,
                {
                  value: customDate,
                  onChange: (d) => setCustomDate(d)
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-[11px] font-bold", children: "3" }),
                    "Employee Calling Note"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "size-3" }),
                    " Auto-generated note from outcome"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-slate-400 font-mono", children: [
                  note.length,
                  " / 500 chars"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-slate-50 border border-slate-200 p-2.5 space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    value: note,
                    onChange: (e) => setNote(e.target.value.slice(0, 500)),
                    rows: 2,
                    className: "w-full bg-transparent text-xs text-slate-900 resize-none focus:outline-none placeholder:text-slate-400 leading-normal",
                    placeholder: "Enter specific notes about the customer call..."
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-1.5 pt-2 border-t border-slate-200/80", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold text-slate-400 mr-0.5", children: "Quick Add:" }),
                    [
                      "Keep Aadhaar ready",
                      "Spoke to spouse",
                      "Switched off",
                      "In meeting",
                      "WhatsApp link sent"
                    ].map((quick) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => setNote((prev) => prev ? `${prev} | ${quick}` : quick),
                        className: "px-2 py-0.5 rounded bg-white hover:bg-blue-600 hover:text-white border border-slate-200 text-[11px] font-medium text-slate-700 transition-colors shadow-2xs cursor-pointer",
                        children: [
                          "+ ",
                          quick
                        ]
                      },
                      quick
                    ))
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[11px] text-slate-500 font-medium ml-auto", children: [
                    customerMobile && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-emerald-700 font-semibold", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-3.5" }),
                      " +91 ",
                      customerMobile
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "• ",
                      staffName
                    ] })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-5 h-5 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-[11px] font-bold", children: "4" }),
                    "Follow-up Mode / Channel Reference"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold text-slate-500", children: "Select whether to check Call or Email history" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "label",
                    {
                      className: cn(
                        "flex items-center gap-2.5 p-2.5 rounded-lg border transition-all cursor-pointer select-none",
                        channel === "call" ? "bg-amber-50/80 border-amber-300 ring-1 ring-amber-400/50 shadow-xs" : "bg-white border-slate-200 hover:bg-slate-50/80"
                      ),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: "radio",
                            name: "callback_channel",
                            value: "call",
                            checked: channel === "call",
                            onChange: () => setChannel("call"),
                            className: "w-4 h-4 rounded-full accent-amber-600 cursor-pointer"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1.5 rounded-md bg-amber-100 text-amber-800", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneCall, { className: "size-4" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-bold text-slate-900 flex items-center gap-1", children: [
                            "Call ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-amber-700 font-mono", children: "(Check Call)" })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-500 truncate", children: "Employee will check phone call history" })
                        ] }),
                        channel === "call" && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4 text-amber-600 shrink-0" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "label",
                    {
                      className: cn(
                        "flex items-center gap-2.5 p-2.5 rounded-lg border transition-all cursor-pointer select-none",
                        channel === "email" ? "bg-purple-50/80 border-purple-300 ring-1 ring-purple-400/50 shadow-xs" : "bg-white border-slate-200 hover:bg-slate-50/80"
                      ),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: "radio",
                            name: "callback_channel",
                            value: "email",
                            checked: channel === "email",
                            onChange: () => setChannel("email"),
                            className: "w-4 h-4 rounded-full accent-purple-600 cursor-pointer"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1.5 rounded-md bg-purple-100 text-purple-800", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-4" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-bold text-slate-900 flex items-center gap-1", children: [
                            "Email ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-purple-700 font-mono", children: "(Check Email)" })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-500 truncate", children: "Employee will check email thread history" })
                        ] }),
                        channel === "email" && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4 text-purple-600 shrink-0" })
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 border-t border-slate-200/80 space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "size-3.5 text-blue-600" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-bold uppercase tracking-wider text-slate-700", children: "Automated System Triggers" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-slate-500", children: [
                    [hotOrderSurge, desktopAlert, whatsappReminder].filter(Boolean).length,
                    " active"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:bg-slate-50/80 transition-colors select-none", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: hotOrderSurge,
                        onChange: (e) => setHotOrderSurge(e.target.checked),
                        className: "w-3.5 h-3.5 rounded accent-rose-600"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-slate-900 truncate", children: "🔥 Hot Order Surge" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-slate-500 truncate", children: [
                        "Top list at ",
                        formatIST(targetDate.toISOString(), { timeOnly: true }),
                        " IST"
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:bg-slate-50/80 transition-colors select-none", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: desktopAlert,
                        onChange: (e) => setDesktopAlert(e.target.checked),
                        className: "w-3.5 h-3.5 rounded accent-blue-600"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-slate-900 truncate", children: "🔔 Desktop Alert + Audio" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-500 truncate", children: "Instant popup & tone" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:bg-slate-50/80 transition-colors select-none", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: whatsappReminder,
                        onChange: (e) => setWhatsappReminder(e.target.checked),
                        className: "w-3.5 h-3.5 rounded accent-emerald-600"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-slate-900 truncate", children: "💬 WhatsApp Reminder" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-500 truncate", children: "Auto-SMS to customer" })
                    ] })
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-50 px-4 md:px-6 py-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-xs font-bold border border-slate-300", children: initials }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-slate-900 leading-tight", children: staffName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-slate-500 leading-tight", children: "Assigned Executive" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  disabled: isBusy,
                  className: "px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => scheduleMut.mutate(),
                  disabled: isBusy,
                  className: "px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold shadow-md flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-4" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: scheduleMut.isPending ? "Setting Timer…" : "Confirm & Set Callback Timer" })
                  ]
                }
              )
            ] })
          ] })
        ] }),
        showHistory && /* @__PURE__ */ jsxRuntimeExports.jsx(
          CallbackHistoryDialog,
          {
            orderId,
            orderCode,
            onClose: () => setShowHistory(false)
          }
        )
      ]
    }
  );
}
function CompletionGateDialogStandalone({
  open,
  onOpenChange,
  orderId,
  busy,
  onConfirm
}) {
  const requestFn = useServerFn(requestOrderDocumentUpload);
  const confirmFn = useServerFn(confirmOrderDocumentUpload);
  const detailFn = useServerFn(getOrderDetailV2);
  const [file, setFile] = reactExports.useState(null);
  const [certNumber, setCertNumber] = reactExports.useState("");
  const [completionNotes, setCompletionNotes] = reactExports.useState("");
  const [ccEmail, setCcEmail] = reactExports.useState("");
  const [showCc, setShowCc] = reactExports.useState(false);
  const [stage, setStage] = reactExports.useState("idle");
  const [dragOver, setDragOver] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [numberTouched, setNumberTouched] = reactExports.useState(false);
  const [uploaded, setUploaded] = reactExports.useState(null);
  const [sendingConfirmed, setSendingConfirmed] = reactExports.useState(false);
  const fileInput = reactExports.useRef(null);
  const closeTimer = reactExports.useRef(null);
  const { data: detail } = useQuery({
    enabled: open,
    queryKey: ["admin.order.recipient", orderId],
    queryFn: () => detailFn({ data: { orderId } }),
    staleTime: 3e4
  });
  const recipientEmail = (detail?.customer?.primary_email ?? "").trim() || (detail?.lead?.email ?? "").trim() || null;
  const serviceName = detail?.service?.service_name || detail?.lead?.service || "this service";
  reactExports.useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);
  reactExports.useEffect(() => {
    if (!open) {
      setFile(null);
      setCertNumber("");
      setCompletionNotes("");
      setCcEmail("");
      setShowCc(false);
      setStage("idle");
      setDragOver(false);
      setError(null);
      setNumberTouched(false);
      setUploaded(null);
      setSendingConfirmed(false);
    }
  }, [open]);
  const MAX_BYTES = 10 * 1024 * 1024;
  const tooBig = file ? file.size > MAX_BYTES : false;
  const isEmpty = file ? file.size === 0 : false;
  const invalidType = file ? !["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(file.type) : false;
  const working = stage === "uploading" || stage === "preparing" || stage === "sending";
  const locked = working || busy || stage === "success";
  const fileError = file && (isEmpty || tooBig || invalidType);
  const chooseFile = (next) => {
    if (locked) return;
    setFile(next);
    setUploaded(null);
    setError(null);
  };
  const formatSize = (bytes) => bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`;
  const submit = async () => {
    if (!file) {
      setError("Upload the certificate file.");
      return;
    }
    if (file.size === 0) {
      setError("The selected file is empty (0 bytes). Please choose a valid certificate file.");
      return;
    }
    if (tooBig || invalidType) {
      setError(tooBig ? "File exceeds 10 MB limit." : "Choose a PDF, JPG, PNG or WEBP file.");
      return;
    }
    if (!certNumber.trim()) {
      setNumberTouched(true);
      setError("Certificate / document number is required.");
      return;
    }
    if (!recipientEmail) {
      setError("Customer has no email on file.");
      return;
    }
    if (ccEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(ccEmail.trim())) {
        setError("Please enter a valid CC email address.");
        return;
      }
    }
    setError(null);
    try {
      let documentId = uploaded?.file === file ? uploaded.documentId : null;
      if (!documentId) {
        setStage("uploading");
        const { path, token } = await requestFn({
          data: {
            orderId,
            docType: "certificate",
            fileName: file.name,
            mimeType: file.type || "application/octet-stream",
            sizeBytes: file.size
          }
        });
        const { supabase: supabase2 } = await import("./client-BX5UfqqR.mjs");
        const { error: uploadError } = await supabase2.storage.from("documents").uploadToSignedUrl(path, token, file, {
          contentType: file.type || void 0,
          upsert: true
        });
        if (uploadError) throw uploadError;
        setStage("preparing");
        const confirmed = await confirmFn({
          data: {
            orderId,
            docType: "certificate",
            filePath: path,
            fileName: file.name,
            mimeType: file.type || "application/octet-stream",
            sizeBytes: file.size
          }
        });
        documentId = confirmed.documentId;
        setUploaded({ file, documentId });
      }
      setStage("sending");
      await onConfirm({
        certificateDocumentId: documentId,
        certificateNumber: certNumber.trim(),
        completionNotes: completionNotes.trim() || void 0,
        ccEmail: ccEmail.trim() || void 0
      });
      setSendingConfirmed(true);
      setStage("success");
      closeTimer.current = setTimeout(() => onOpenChange(false), 1800);
    } catch (e) {
      let msg = e?.message ?? "Could not send the certificate. Please retry.";
      try {
        const parsed = JSON.parse(msg);
        if (Array.isArray(parsed) && parsed[0]) {
          if (parsed[0]?.path?.includes("sizeBytes")) {
            msg = "The selected file is empty (0 bytes). Please upload a valid certificate file.";
          } else if (parsed[0]?.message) {
            msg = parsed[0].message;
          }
        }
      } catch {
      }
      setError(msg);
      toast.error(msg);
      setStage("idle");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (next) => {
    if (!next && locked) return;
    onOpenChange(next);
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { onEscapeKeyDown: (e) => {
    if (locked) e.preventDefault();
  }, onPointerDownOutside: (e) => {
    if (locked) e.preventDefault();
  }, className: `flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-[540px] flex-col gap-0 overflow-hidden border-admin-border bg-admin-surface p-0 text-admin-fg shadow-xl sm:rounded-lg [&>button]:text-admin-fg-muted ${locked ? "[&>button]:pointer-events-none [&>button]:opacity-40" : ""}`, "aria-describedby": "completion-description", children: stage === "success" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-72 flex-col items-center justify-center gap-3 px-6 py-12 text-center", role: "status", "aria-live": "polite", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-12 text-admin-success motion-safe:animate-in motion-safe:zoom-in-75" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl", children: "Certificate sent successfully" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { id: "completion-description", children: "The order has been marked Completed." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-full break-all text-sm font-medium text-admin-fg", children: recipientEmail })
  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "shrink-0 px-6 pb-2 pt-5 pr-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex size-10 shrink-0 items-center justify-center rounded-md bg-completion-soft text-completion-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileCheckCorner, { className: "size-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-lg leading-6", children: "Complete Service" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-admin-fg", children: serviceName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { id: "completion-description", className: "mt-1 text-xs", children: "Upload the certificate, add document number and we’ll send it to the customer." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-0 flex-1 space-y-2.5 overflow-y-auto px-5 pb-3 sm:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1 pb-2 pt-3 text-center", "aria-label": "Completion steps", children: ["Upload Certificate", "Certificate Number", "Send to Customer"].map((label, index) => {
        const done = index === 0 ? Boolean(uploaded) : index === 1 ? Boolean(uploaded && certNumber.trim()) : sendingConfirmed;
        const active = index === 0 ? !uploaded : index === 1 ? Boolean(uploaded && !certNumber.trim()) : Boolean(uploaded && certNumber.trim());
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-w-0 text-[11px]", children: [
          index < 2 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", className: "absolute left-[calc(50%+15px)] right-[calc(-50%+15px)] top-3 h-px bg-completion-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `relative mx-auto flex size-6 items-center justify-center rounded-full text-xs font-semibold ${done ? "bg-admin-success text-primary-foreground" : active ? "bg-completion-primary text-admin-surface shadow-sm" : "bg-admin-surface-2 text-admin-fg-muted"}`, children: done ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5" }) : index + 1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `mt-1 block leading-tight ${active ? "font-semibold text-admin-fg" : "text-admin-fg-muted"}`, children: label })
        ] }, label);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-2 rounded-md border border-admin-border p-2.5", "aria-label": "Upload Certificate", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2 rounded-md bg-completion-soft px-2 py-1 text-[10px] text-completion-primary", children: "STEP 1" }),
              "Upload Certificate"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-[11px] text-admin-fg-muted", children: "Upload the final certificate issued by the government." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-completion-border bg-completion-soft px-2.5 py-1.5 text-[10px] text-completion-primary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 font-semibold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "size-3" }),
              "Accepted formats"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "PDF, JPG, PNG, WEBP · Max 10 MB" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            role: "button",
            tabIndex: locked ? -1 : 0,
            onClick: () => {
              if (!locked) fileInput.current?.click();
            },
            onKeyDown: (e) => {
              if ((e.key === "Enter" || e.key === " ") && !locked) {
                e.preventDefault();
                fileInput.current?.click();
              }
            },
            onDragOver: (e) => {
              e.preventDefault();
              if (!locked) setDragOver(true);
            },
            onDragLeave: () => setDragOver(false),
            onDrop: (e) => {
              e.preventDefault();
              setDragOver(false);
              chooseFile(e.dataTransfer.files?.[0] ?? null);
            },
            className: `group flex min-h-24 flex-col items-center justify-center rounded-md border border-dashed p-3 text-center transition-all ${locked ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-completion-primary hover:bg-completion-soft/60"} ${dragOver ? "border-completion-primary bg-completion-soft" : "border-completion-border bg-admin-surface-2/40"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CloudUpload, { className: "mb-1 size-8 text-completion-primary transition-transform group-hover:scale-110" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-admin-fg group-hover:text-completion-primary transition-colors", children: "Drag & drop your certificate here" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-admin-fg-muted group-hover:underline", children: "or click to browse" })
            ]
          }
        ),
        file && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-2 rounded-md border p-2 ${fileError ? "border-admin-danger bg-destructive/5" : uploaded?.file === file ? "border-admin-success/30 bg-admin-success/5" : "border-completion-border bg-completion-soft/40"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex size-9 shrink-0 items-center justify-center rounded-md bg-admin-surface text-completion-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-xs font-semibold", title: file.name, children: file.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-admin-fg-muted", children: [
              formatSize(file.size),
              " · ",
              uploaded?.file === file ? "Uploaded just now" : "Selected for upload"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `hidden items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold sm:inline-flex ${uploaded?.file === file ? "bg-admin-success/10 text-admin-success" : "bg-completion-soft text-completion-primary"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3" }),
            uploaded?.file === file ? "File uploaded" : "File selected"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "icon", className: "size-7 shrink-0", onClick: () => chooseFile(null), disabled: locked, title: "Remove file", "aria-label": "Remove file", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
        ] }),
        fileError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-admin-danger", role: "alert", children: isEmpty ? "This file is empty. Choose another." : tooBig ? "This file exceeds 10 MB." : "Choose a PDF, JPG, PNG or WEBP file." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileInput, type: "file", accept: ".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp", className: "sr-only", tabIndex: -1, disabled: locked, onChange: (e) => {
          chooseFile(e.target.files?.[0] ?? null);
          e.target.value = "";
        }, "aria-label": "Certificate file" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-2 rounded-md border border-admin-border p-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "completion-cert-number", className: "text-sm font-semibold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2 rounded-md bg-completion-soft px-2 py-1 text-[10px] text-completion-primary", children: "STEP 2" }),
            "Certificate / Document Number"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-[11px] text-admin-fg-muted", children: "Enter the certificate number as mentioned on the document." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "absolute left-3 top-3 size-4 text-admin-fg-muted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input$1, { id: "completion-cert-number", value: certNumber, onChange: (e) => {
            setCertNumber(e.target.value);
            setError(null);
          }, onBlur: () => setNumberTouched(true), disabled: locked, "aria-invalid": numberTouched && !certNumber.trim(), "aria-describedby": numberTouched && !certNumber.trim() ? "completion-number-error" : void 0, placeholder: "e.g. UDYAM-MH-28-0012345", autoComplete: "off", className: "h-10 border-admin-border-strong bg-admin-surface pl-9 pr-9" }),
          certNumber.trim() && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "absolute right-3 top-3 size-4 text-admin-success" })
        ] }),
        numberTouched && !certNumber.trim() && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { id: "completion-number-error", className: "text-xs text-admin-danger", role: "alert", children: "Enter the certificate / document number." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-2 rounded-md border border-admin-border p-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "completion-notes", className: "text-sm font-semibold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-2 rounded-md bg-completion-soft px-2 py-1 text-[10px] text-completion-primary", children: "STEP 3" }),
            "Completion Notes ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-normal text-admin-fg-muted", children: "(Optional)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-[11px] text-admin-fg-muted", children: "Add any important notes that will be included in the customer email." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "completion-notes", value: completionNotes, onChange: (e) => setCompletionNotes(e.target.value), disabled: locked, rows: 2, maxLength: 500, placeholder: "E.g. Certificate downloaded and verified. Sent to customer.", className: "resize-y border-admin-border-strong bg-admin-surface" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-right text-[10px] text-admin-fg-muted", children: [
          completionNotes.length,
          "/500"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-completion-border bg-completion-soft/50 p-3 text-[11px] space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-4 shrink-0 text-completion-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-admin-fg-muted", children: "The certificate will be emailed to (To):" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "break-all font-semibold text-admin-fg", children: recipientEmail ?? "No email on file" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: !showCc && !ccEmail && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              className: "h-7 px-2 text-[10px] text-completion-primary hover:bg-completion-soft",
              onClick: () => setShowCc(true),
              disabled: locked,
              children: "+ Add CC"
            }
          ) })
        ] }),
        (showCc || ccEmail) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 border-t border-completion-border/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "completion-cc-email", className: "text-[11px] font-semibold text-admin-fg", children: [
              "CC Email ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-normal text-admin-fg-muted", children: "(Optional)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "sm",
                className: "h-5 px-1.5 text-[10px] text-admin-fg-muted hover:text-admin-danger",
                onClick: () => {
                  setCcEmail("");
                  setShowCc(false);
                  setError(null);
                },
                disabled: locked,
                children: "Remove CC"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input$1,
            {
              id: "completion-cc-email",
              type: "email",
              value: ccEmail,
              onChange: (e) => {
                setCcEmail(e.target.value);
                setError(null);
              },
              disabled: locked,
              placeholder: "e.g. partner@example.com",
              autoComplete: "off",
              className: "h-8 text-xs border-admin-border-strong bg-admin-surface"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[10px] text-admin-fg-muted", children: "Certificate email will be sent to both the registered customer email and this CC address." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-md border border-admin-warn/30 bg-admin-warn/5 p-2.5 text-[11px] text-admin-fg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "mt-0.5 size-4 shrink-0 text-admin-warn" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "After the certificate email is sent, the order will move to ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "COMPLETED" }),
          ". All other customer documents for this order will then be permanently deleted."
        ] })
      ] }),
      (working || error) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { role: error ? "alert" : "status", "aria-live": "polite", className: `flex items-start gap-2 rounded-md border p-3 text-sm ${error ? "border-admin-danger/40 bg-destructive/5 text-admin-danger" : "border-admin-border bg-admin-accent-soft text-admin-primary"}`, children: [
        error ? /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "mt-0.5 size-4 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mt-0.5 size-4 shrink-0 animate-spin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: error || (stage === "uploading" ? "Uploading certificate…" : stage === "preparing" ? "Preparing certificate email…" : "Sending to customer…") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "shrink-0 flex-row justify-between gap-3 border-t border-admin-border px-5 py-3 sm:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), disabled: locked, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", onClick: () => void submit(), disabled: locked || !file || Boolean(fileError) || !certNumber.trim() || !recipientEmail, className: "min-w-0 bg-completion-primary px-3 text-admin-surface hover:bg-completion-primary/90 sm:min-w-44", children: working ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }),
        stage === "uploading" ? "Uploading certificate…" : stage === "preparing" ? "Preparing email…" : "Sending to customer…"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        "Upload & Send Certificate ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
      ] }) })
    ] }),
    working && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[60] flex items-center justify-center bg-admin-fg/30 p-4", role: "status", "aria-live": "polite", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-72 rounded-md border border-admin-border bg-admin-surface p-5 text-center text-admin-fg shadow-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-completion-soft text-completion-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-1 text-sm font-semibold", children: "Sending Certificate to Customer" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-4 text-xs text-admin-fg-muted", children: "Please wait while we upload the file and send the email to the customer." }),
      [
        ["Uploading file", stage !== "uploading", stage === "uploading" && !uploaded],
        ["Processing document", stage === "sending", stage === "preparing"],
        ["Sending email to customer", false, stage === "sending"],
        ["Updating order status", false, false],
        ["Finalizing", false, false]
      ].map(([label, done, active]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 py-2 text-left text-xs", children: [
        done ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4 shrink-0 text-admin-success" }) : active ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 shrink-0 animate-spin text-completion-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-4 shrink-0 rounded-full border border-admin-border-strong" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-admin-fg-muted", children: done ? "Completed" : active ? "In progress" : "Pending" })
      ] }, label)),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 h-1 overflow-hidden rounded-full bg-completion-soft", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-full bg-completion-primary transition-all duration-300 ${stage === "uploading" && !uploaded ? "w-0" : stage === "preparing" ? "w-1/5" : "w-2/5"}` }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-xs text-admin-fg-muted", children: [
        stage === "uploading" && !uploaded ? "0" : stage === "preparing" ? "1" : "2",
        " of 5 completed"
      ] })
    ] }) })
  ] }) }) });
}
function CountdownChip({ firesAt, label, className, paused, pausedLabel }) {
  const [now, setNow] = reactExports.useState(() => Date.now());
  reactExports.useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setNow(Date.now()), 3e4);
    return () => clearInterval(t);
  }, [paused]);
  if (!firesAt) return null;
  const target = new Date(firesAt).getTime();
  if (Number.isNaN(target)) return null;
  const diff = target - now;
  const overdue = diff <= 0;
  const abs = Math.abs(diff);
  const mins = Math.round(abs / 6e4);
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  const days = Math.floor(hrs / 24);
  const remHrs = hrs % 24;
  const pretty = days > 0 ? `${days}d ${remHrs}h` : hrs > 0 ? `${hrs}h ${remMins}m` : `${mins}m`;
  if (paused) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        className: cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
          "bg-violet-50 text-violet-700 ring-violet-200 animate-pulse",
          className
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePause, { className: "h-3 w-3" }),
          pausedLabel ?? "Paused — ticket open",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-violet-400", children: "·" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums opacity-70", children: overdue ? `${pretty} overdue` : `${pretty} left` })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        overdue ? "bg-red-50 text-red-700 ring-red-200" : mins < 60 ? "bg-amber-50 text-amber-700 ring-amber-200" : "bg-slate-50 text-slate-700 ring-slate-200",
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
        label ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-500", children: [
          label,
          ":"
        ] }) : null,
        overdue ? `${pretty} overdue` : `in ${pretty}`
      ]
    }
  );
}
const OrderId$1 = string().uuid();
const ReminderMinutes = number().int().min(15).max(60 * 24 * 30);
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: OrderId$1,
  transitionOnly: boolean().default(false)
}).parse(raw)).handler(createSsrRpc("3288c9e1299b019af439e0463777f8b816b26134df4450f4250d6876bb37e11f"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: OrderId$1
}).parse(raw)).handler(createSsrRpc("de765927a918f23f14a73bfe49caf9beb4e2576eca3b91277479cb7af7012513"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: OrderId$1,
  kind: _enum(["external", "internal"]),
  reasonId: string().uuid(),
  reminderMinutes: ReminderMinutes,
  remarks: string().max(2e3).optional().nullable()
}).parse(raw)).handler(createSsrRpc("6008aaa579fe8e46dc831e636d555d1e3714c97ea61711a3597552302fd16fcf"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: OrderId$1,
  reminderMinutes: ReminderMinutes
}).parse(raw)).handler(createSsrRpc("ef1afa92e37d48b452fc3de4565b242ec0d19a9206ae450472845b4805100d64"));
const resumeFromHold = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: OrderId$1,
  target: _enum(["IN_PROCESSING", "FORM_RECEIVED", "INFO_RECEIVED"]).default("IN_PROCESSING")
}).parse(raw)).handler(createSsrRpc("ac650ed9879a6610188e82023f4b6d93df44a6571fec15a067ce14e62a24b980"));
const resumeFromCustomerDelay = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: OrderId$1
}).parse(raw)).handler(createSsrRpc("8e98c7980bb07bc1254ec584186b1b881e9ad925ec0a9c7ebbafa104f23f9fc5"));
const resumeReopenedOrder = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: OrderId$1,
  note: string().max(2e3).optional()
}).parse(raw)).handler(createSsrRpc("7a8b51df43aa8522e5dd44e6a245c3e23ad7a0482fcbc5c4c04993ffce956935"));
const OrderId = string().uuid();
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: OrderId,
  reasonId: string().uuid(),
  remarks: string().max(2e3).optional().nullable(),
  source: _enum(["timer", "ticket", "cron", "govt_rejection", "manual_override"])
}).parse(raw)).handler(createSsrRpc("975937810f01a96133e4199fe30d0693dab6d027c1fde165320e566a19e2c75d"));
const handleGovtRejected = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  orderId: OrderId,
  reasonId: string().uuid(),
  remarks: string().max(2e3).optional().nullable()
}).parse(raw)).handler(createSsrRpc("60e9eb2914cc6c98a5084e5fee2694116cae17bdf415eb27866fc316dbaba4d7"));
const Input = object({
  orderId: string().uuid(),
  remarks: string().max(2e3).optional().nullable()
});
const markConsultationCompleted = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => Input.parse(raw)).handler(createSsrRpc("f7fa7f855667dfa7d272f6e9d06ac465d5fa5d25b291788a3de36d3953d5e0cd"));
const ICONS$1 = {
  inbox: Inbox,
  fileText: FileText,
  fileCheck: FileCheckCorner,
  landmark: Landmark,
  search: Search,
  flag: Flag,
  wrench: Wrench,
  rotate: RotateCcw,
  mailWarn: MailWarning,
  userX: UserX,
  send: Send,
  clock: Clock,
  clipboard: ClipboardCheck,
  upload: CloudUpload,
  xCircle: CircleX,
  lifeBuoy: LifeBuoy,
  shoppingBag: ShoppingBag
};
function useResponsiveScale() {
  const wrapRef = reactExports.useRef(null);
  const [scale, setScale] = reactExports.useState(1);
  reactExports.useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      if (!w) return;
      setScale(Math.min(1, w / CANVAS_W));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { wrapRef, scale };
}
function CustomerJourneyMap(p) {
  const qc = useQueryClient();
  const { view, events } = useOrderWorkflow(p.applicationId);
  const live = reactExports.useMemo(() => deriveJourneyLiveState({
    stage: p.stage,
    workflowStatus: p.workflowStatus,
    closureStage: p.closureStage,
    closureReasonLabel: p.closureReasonLabel,
    formSubmittedAt: p.formSubmittedAt,
    fulfillmentStatus: p.fulfillmentStatus
  }), [p.stage, p.workflowStatus, p.closureStage, p.closureReasonLabel, p.formSubmittedAt, p.fulfillmentStatus]);
  const currentIdx = live.currentMainIndex;
  const isTalkToExpert = /talk|expert|consult/i.test(p.serviceCode ?? "") || !!p.isConsultationOrder;
  const closed = live.terminal === "closed";
  const completed = live.terminal === "completed";
  !!p.closureStage && p.closureStage !== "none" && !closed;
  const reminderCount = reactExports.useMemo(
    () => (events ?? []).filter((e) => e?.type === "ReminderScheduled" || e?.type === "ReminderFired").length,
    [events]
  );
  const formLinkKey = `journey.b01Sent:${p.applicationId}`;
  const [formLinkSent, setFormLinkSent] = reactExports.useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(formLinkKey) === "1";
    } catch {
      return false;
    }
  });
  const markFormLinkSent = () => {
    try {
      window.localStorage.setItem(formLinkKey, "1");
    } catch {
    }
    setFormLinkSent(true);
  };
  const clearFormLinkSent = () => {
    try {
      window.localStorage.removeItem(formLinkKey);
    } catch {
    }
    setFormLinkSent(false);
  };
  const techResumeKey = `journey.b03Resumed:${p.applicationId}`;
  const [techDelayResolved, setTechDelayResolved] = reactExports.useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(techResumeKey) === "1";
    } catch {
      return false;
    }
  });
  const markTechDelayResolved = () => {
    try {
      window.localStorage.setItem(techResumeKey, "1");
    } catch {
    }
    setTechDelayResolved(true);
  };
  const clearTechDelayResolved = () => {
    try {
      window.localStorage.removeItem(techResumeKey);
    } catch {
    }
    setTechDelayResolved(false);
  };
  reactExports.useEffect(() => {
    if (formLinkSent && live.activeSubKey !== "form-not-submitted") clearFormLinkSent();
    if (techDelayResolved && (live.activeSubKey === "technical-delay" || currentIdx >= 4)) clearTechDelayResolved();
  }, [live.activeSubKey, currentIdx]);
  const isFormLinkSent = reactExports.useMemo(() => {
    if (formLinkSent) return true;
    const ws = (p.workflowStatus ?? "").toLowerCase();
    if (ws === "waiting_for_customer_submission" || ws === "form_link_sent" || ws === "form_pending") return true;
    if (events && events.some(
      (e) => e?.type === "FormLinkSent" || e?.event_type === "form_link_sent" || e?.event_type === "email_queued" || e?.template_code === "E002" || e?.type === "EmailSent" || e?.type === "WelcomeMailSent"
    )) return true;
    return false;
  }, [formLinkSent, p.workflowStatus, events]);
  const phase = reactExports.useMemo(() => derivePhase({
    stage: p.stage,
    workflowStatus: p.workflowStatus,
    closureStage: p.closureStage,
    closureReasonLabel: p.closureReasonLabel,
    formSubmittedAt: p.formSubmittedAt,
    fulfillmentStatus: p.fulfillmentStatus,
    formLinkSent: isFormLinkSent,
    techDelayResolved,
    adminOverride: p.adminOverride
  }), [p.stage, p.workflowStatus, p.closureStage, p.closureReasonLabel, p.formSubmittedAt, p.fulfillmentStatus, reminderCount, isFormLinkSent, techDelayResolved, p.adminOverride]);
  const enabledCodes = PHASE_ENABLED_BUTTONS[phase];
  const gate = (code) => {
    if (code === "B07" || code === "B08") {
      return enabledCodes.includes(code);
    }
    return enabledCodes.includes(code) && !closed && !completed;
  };
  const timers = view.timers ?? [];
  const findTimer = (kindMatch) => timers.find((t) => kindMatch.test(t?.kind ?? "") && t?.status === "running") ?? null;
  const formAutoCloseTimer = findTimer(/form_pending_autoclose|form_.*8h/);
  const customerHoldTimer = findTimer(/customer_hold|customer_side_autoclose/);
  const technicalHoldTimer = findTimer(/technical_hold|our_side_reminder/);
  const listTickets = useServerFn(listOrderTickets);
  const ticketQ = useQuery({
    queryKey: ["order-tickets", p.applicationId],
    queryFn: () => listTickets({ data: { orderId: p.applicationId } }),
    staleTime: 3e4
  });
  useRealtimeTable("support_tickets", () => ticketQ.refetch(), {
    filter: `application_id=eq.${p.applicationId}`
  });
  const openTicket = (ticketQ.data?.tickets ?? []).find((t) => {
    const s = String(t.status ?? "").toLowerCase();
    return s !== "closed" && s !== "resolved";
  });
  const hasOpenTicket = !!openTicket;
  const currentStageLabel = reactExports.useMemo(() => STAGE_META[p.stage].label, [p.stage]);
  const getActiveCallbackFn = useServerFn(getActiveOrderCallback);
  const activeCallbackQ = useQuery({
    queryKey: ["active-order-callback", p.applicationId],
    queryFn: () => getActiveCallbackFn({ data: { orderId: p.applicationId } }),
    staleTime: 1e4
  });
  const activeCallback = activeCallbackQ.data;
  const getCallbackHistoryFn = useServerFn(getOrderCallbackHistory);
  const callbackHistoryQ = useQuery({
    queryKey: ["order-callback-history", p.applicationId],
    queryFn: () => getCallbackHistoryFn({ data: { orderId: p.applicationId } }),
    staleTime: 5e3
  });
  const callbackHistory = callbackHistoryQ.data ?? [];
  const historyCount = Math.max(
    callbackHistory.length,
    activeCallback?.historyCount ?? 0,
    callbackHistory.filter((h) => h.action_type === "CALLBACK_SCHEDULED" || h.action_type === "CALLBACK_RESCHEDULED").length
  );
  const fnCompleteCallback = useServerFn(completeOrderCallback);
  const mutCompleteCallback = useMutation({
    mutationFn: () => fnCompleteCallback({ data: { orderId: p.applicationId } }),
    onSuccess: () => {
      toast.success("Customer call marked completed — Hot Order removed");
      qc.invalidateQueries({ queryKey: ["active-order-callback", p.applicationId] });
      qc.invalidateQueries({ queryKey: ["order-callback-history", p.applicationId] });
      qc.invalidateQueries({ queryKey: ["admin.order", p.applicationId] });
      qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
      invalidate();
    },
    onError: (e) => toast.error(e?.message ?? "Failed to complete callback")
  });
  const hasCompletedCallback = callbackHistory.some((h) => h.action_type === "CALLBACK_COMPLETED") || (events ?? []).some((e) => String(e?.event_type || "").includes("callback_completed"));
  const isReopenedHot = !closed && !completed && !hasCompletedCallback && (p.stage === "order_reopened" || p.fulfillmentStatus === "order_reopened" || p.workflowStatus === "reopened");
  const role = useRole();
  const isAdmin = role.hasAny(["super_admin", "admin"]);
  const reopenedDetails = reactExports.useMemo(() => {
    if (activeCallback?.parsedRemarks) {
      return {
        reason: activeCallback.parsedRemarks.reasonLabel || activeCallback.parsedRemarks.reason || "Order Reopened & Hot Priority",
        note: activeCallback.parsedRemarks.note || null,
        ticketNumber: activeCallback.parsedRemarks.ticketNumber || null,
        ticketId: activeCallback.parsedRemarks.ticketId || null
      };
    }
    const reopenEvent = (events ?? []).find(
      (e) => e?.event_type === "order_reopened" || e?.event_type === "hot_priority_escalated" || e?.type === "OrderReopened" || e?.metadata?.event === "ORDER_REOPENED_HOT"
    );
    if (reopenEvent) {
      const meta = reopenEvent.metadata || {};
      return {
        reason: reopenEvent.title || "Order Reopened from Support Ticket",
        note: meta.note || reopenEvent.description || null,
        ticketNumber: meta.ticketNumber || null,
        ticketId: meta.ticketId || null
      };
    }
    const historyItem = (callbackHistory ?? []).find(
      (h) => h.reason === "ticket_hot_priority" || h.reason === "order_reopened" || h.reason_label
    );
    if (historyItem) {
      return {
        reason: historyItem.reason_label || "Order Reopened",
        note: historyItem.note || null,
        ticketNumber: historyItem.ticketNumber || null,
        ticketId: historyItem.ticketId || null
      };
    }
    if (openTicket) {
      return {
        reason: `Order Reopened · Support Ticket #${openTicket.ticket_number ?? String(openTicket.id).slice(0, 8)}`,
        note: openTicket.subject || "Customer support escalation",
        ticketNumber: openTicket.ticket_number ?? null,
        ticketId: openTicket.id ?? null
      };
    }
    return {
      reason: p.closureReasonLabel ? `Order Reopened · Prior: ${p.closureReasonLabel}` : "Order Reopened — Urgent Action Required",
      note: null,
      ticketNumber: null,
      ticketId: null
    };
  }, [activeCallback, events, callbackHistory, openTicket, p.closureReasonLabel]);
  const [dialog, setDialog] = reactExports.useState(null);
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin.order", p.applicationId] });
    qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
    qc.invalidateQueries({ queryKey: ["order-workflow-state", p.applicationId] });
    qc.invalidateQueries({ queryKey: ["order-tickets", p.applicationId] });
    qc.invalidateQueries({ queryKey: ["workflow-timers", p.applicationId] });
    qc.invalidateQueries({ queryKey: ["workflow-events", p.applicationId] });
    qc.invalidateQueries({ queryKey: ["due-reminders-summary"] });
    qc.invalidateQueries({ queryKey: ["active-order-callback", p.applicationId] });
    qc.invalidateQueries({ queryKey: ["order-callback-history", p.applicationId] });
    qc.invalidateQueries({ queryKey: ["admin.lead.emails"] });
    qc.invalidateQueries({ queryKey: ["admin.order.timeline", p.applicationId] });
  };
  const fnFormLink = useServerFn(sendFormLink);
  const fnSubmit = useServerFn(markSubmittedToGovt);
  const fnReminder = useServerFn(sendManualReminder);
  const fnComplete = useServerFn(completeOrder);
  const fnUpdateFF = useServerFn(updateFulfillmentStatus);
  const fnResume = useServerFn(resumeFromHold);
  const fnResumeCustomer = useServerFn(resumeFromCustomerDelay);
  const fnResumeReopened = useServerFn(resumeReopenedOrder);
  const fnReopen = useServerFn(reopenOrder);
  const fnConsultation = useServerFn(markConsultationCompleted);
  const mutResume = useMutation({
    mutationFn: () => fnResume({ data: { orderId: p.applicationId, target: "IN_PROCESSING" } }),
    onSuccess: () => {
      toast.success("E011 sent — technical delay resolved, order resumed");
      markTechDelayResolved();
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  const mutResumeCustomer = useMutation({
    mutationFn: () => fnResumeCustomer({ data: { orderId: p.applicationId } }),
    onSuccess: () => {
      toast.success("Order resumed — moved to Form Submitted");
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  const mutResumeReopened = useMutation({
    mutationFn: () => fnResumeReopened({ data: { orderId: p.applicationId } }),
    onSuccess: (res) => {
      toast.success(`Order resumed — moved to ${res?.nextStage === "form_not_submitted" ? "Form Not Submitted Delay" : "Form Submitted"}`);
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  const mutReopen = useMutation({
    mutationFn: () => fnReopen({ data: { orderId: p.applicationId } }),
    onSuccess: () => {
      toast.success("Order reopened successfully — active in Hot Orders");
      invalidate();
      qc.invalidateQueries({ queryKey: ["admin.order", p.applicationId] });
      qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
      qc.invalidateQueries({ queryKey: ["order-workflow-state", p.applicationId] });
      qc.invalidateQueries({ queryKey: ["order-tickets", p.applicationId] });
      qc.invalidateQueries({ queryKey: ["workflow-events", p.applicationId] });
      qc.invalidateQueries({ queryKey: ["due-reminders-summary"] });
    },
    onError: (e) => toast.error(e.message)
  });
  const mutFormLink = useMutation({
    mutationFn: () => fnFormLink({ data: { orderId: p.applicationId, transitionToWaiting: true } }),
    onSuccess: (r) => {
      toast.success(r?.emailQueued ? "E002 — Form link / incomplete-info mail sent" : "Order updated");
      markFormLinkSent();
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  const mutSubmit = useMutation({
    mutationFn: () => fnSubmit({ data: { orderId: p.applicationId } }),
    onSuccess: () => {
      toast.success("E005 sent — application marked submitted to govt");
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  const mutConsultation = useMutation({
    // B06 → S08 Consultation Completed. Stamps fulfillment stage AND enqueues
    // the E005 email with an operator-entered Note ({{employee_remarks}}).
    mutationFn: (remarks) => fnConsultation({ data: { orderId: p.applicationId, remarks: remarks || null } }),
    onSuccess: (r) => {
      toast.success(
        r?.emailQueued ? "S08 · Consultation Completed — E005 sent" : "S08 · Consultation Completed (no customer email on file)"
      );
      setDialog(null);
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  useMutation({
    mutationFn: (note) => fnReminder({ data: { orderId: p.applicationId, note } }),
    onSuccess: () => {
      toast.success("E006 sent + reminder queued");
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  const mutTalkExpert = useMutation({
    mutationFn: () => fnComplete({ data: { orderId: p.applicationId } }),
    onSuccess: () => {
      toast.success("E009 sent — consultation completed");
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  const inCustomerDelay = phase === "customer_delay";
  const isOrderReopened = p.stage === "order_reopened";
  const canResume = !closed && !completed && (inCustomerDelay || phase === "technical_delay" || phase === "form_not_submitted" || phase === "form_link_sent" || isOrderReopened || Boolean(p.adminOverride));
  const buttonHandlers = {
    B01: { onClick: () => mutFormLink.mutate(), pending: mutFormLink.isPending },
    B02: { onClick: () => setDialog({ kind: "technical_delay" }) },
    B03: { onClick: () => mutResume.mutate(), pending: mutResume.isPending },
    B04: inCustomerDelay ? { onClick: () => mutResumeCustomer.mutate(), pending: mutResumeCustomer.isPending, label: "Resume Order" } : { onClick: () => setDialog({ kind: "customer_delay" }) },
    B05: { onClick: () => mutSubmit.mutate(), pending: mutSubmit.isPending },
    B06: { onClick: () => setDialog({ kind: "consultation_completed" }), pending: mutConsultation.isPending },
    B07: { onClick: () => setDialog({ kind: "complete_with_cert" }) },
    B08: { onClick: () => setDialog({ kind: "govt_rejected" }) }
  };
  const activeBranches = reactExports.useMemo(
    () => activeBranchesFor(phase, live.terminal, live.reasonCode, p.workflowStatus, currentIdx, techDelayResolved),
    [phase, live.terminal, live.reasonCode, p.workflowStatus, currentIdx, techDelayResolved]
  );
  const doneMainEdges = reactExports.useMemo(
    () => mainDoneEdgesFor(currentIdx, phase, techDelayResolved),
    [currentIdx, phase, techDelayResolved]
  );
  const currentMainEdges = reactExports.useMemo(
    () => currentMainEdgesFor(currentIdx, phase, live.terminal),
    [currentIdx, phase, live.terminal, techDelayResolved]
  );
  const currentStageNode = reactExports.useMemo(
    () => currentStageNodeFor(currentIdx, phase, live.terminal),
    [currentIdx, phase, live.terminal]
  );
  const visibleEdges = EDGES;
  const { wrapRef, scale } = useResponsiveScale();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 border-b border-slate-100 pb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-700", children: "Customer Journey — Live Path" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Current:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate font-semibold text-indigo-700", children: currentStageLabel }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                  closed ? "bg-rose-100 text-rose-700" : phase === "consultation_done" ? "bg-emerald-100 text-emerald-800" : phase === "technical_delay" ? "bg-sky-100 text-sky-800" : phase === "customer_delay" || phase === "form_not_submitted" || phase === "form_link_sent" ? "bg-amber-100 text-amber-800" : phase === "govt_processing" ? "bg-violet-100 text-violet-800" : completed ? "bg-emerald-100 text-emerald-800" : p.adminOverride ? "bg-orange-100 text-orange-800" : "bg-indigo-100 text-indigo-800"
                ),
                children: [
                  closed ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCheck, { className: "size-3" }),
                  p.adminOverride ? "ADMIN OVERRIDE" : live.subStateLabel
                ]
              }
            ),
            hasOpenTicket && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-800", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LifeBuoy, { className: "size-3" }),
              " Ticket open"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden shrink-0 items-center gap-2 text-[10px] font-semibold text-slate-500 sm:flex", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { cls: "bg-emerald-500", label: "Done" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { cls: "bg-indigo-500", label: "Active" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { cls: "bg-amber-400", label: "Delay" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { cls: "bg-rose-500", label: "Closed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { cls: "bg-slate-300", label: "Idle" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: wrapRef, className: "mt-3 w-full", "data-testid": "journey-canvas-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: {
            width: CANVAS_W * scale,
            height: CANVAS_H * scale,
            position: "relative"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                width: CANVAS_W,
                height: CANVAS_H,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                position: "absolute",
                top: 0,
                left: 0
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "svg",
                  {
                    className: "pointer-events-none absolute inset-0",
                    width: CANVAS_W,
                    height: CANVAS_H,
                    viewBox: `0 0 ${CANVAS_W} ${CANVAS_H}`,
                    "data-testid": "journey-svg",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
                        ["idle", "done", "active", "warning", "closed"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "marker",
                          {
                            id: `arrow-${s}`,
                            viewBox: "0 0 10 10",
                            refX: "9",
                            refY: "5",
                            markerWidth: "6",
                            markerHeight: "6",
                            orient: "auto-start-reverse",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "path",
                              {
                                d: "M 0 0 L 10 5 L 0 10 z",
                                className: s === "done" ? "fill-emerald-500" : s === "active" ? "fill-indigo-500" : s === "warning" ? "fill-amber-500" : s === "closed" ? "fill-rose-500" : "fill-slate-300"
                              }
                            )
                          },
                          s
                        )),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
                    @keyframes flowdash { to { stroke-dashoffset: -24; } }
                    .edge-active { animation: flowdash 1.2s linear infinite; }
                  ` })
                      ] }),
                      visibleEdges.map((e) => {
                        const from = nodeById[e.from];
                        const to = nodeById[e.to];
                        if (!from || !to) return null;
                        const a = anchor(from, e.fromSide);
                        const b = anchor(to, e.toSide);
                        const state = edgeState(e, { activeBranches, doneMainEdges, terminal: live.terminal, currentMainEdges, phase, currentIdx });
                        const cls = state === "done" ? "stroke-emerald-500" : state === "active" ? "stroke-indigo-500 edge-active" : state === "warning" ? "stroke-amber-500 edge-active" : state === "closed" ? "stroke-rose-500 edge-active" : "stroke-slate-300";
                        const strokeWidth = state === "idle" ? 1.5 : 2.5;
                        const dash = state === "active" || state === "warning" || state === "closed" ? "8 4" : void 0;
                        return /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "path",
                          {
                            d: pathD(a, b, e.mode, e.waypoints),
                            fill: "none",
                            className: cls,
                            strokeWidth,
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeDasharray: dash,
                            markerEnd: `url(#arrow-${state})`,
                            "data-edge": e.id,
                            "data-branch": e.branch,
                            "data-state": state
                          },
                          e.id
                        );
                      })
                    ]
                  }
                ),
                NODES.map((n) => {
                  const state = nodeState(n.id, {
                    currentIdx,
                    activeBranches,
                    terminal: live.terminal,
                    phase,
                    currentStageNode
                  });
                  const btnCode = n.buttonCode;
                  const enabled = btnCode ? gate(btnCode) : false;
                  const isSent = btnCode ? !enabled && !closed && !completed && !enabledCodes.includes(btnCode) : false;
                  const handler = btnCode ? buttonHandlers[btnCode] : void 0;
                  let countdown = null;
                  if (n.id === "b01_reminder" && activeBranches.has("form-nag") && (formAutoCloseTimer || p.closureNextAt)) {
                    countdown = /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CountdownChip,
                      {
                        firesAt: formAutoCloseTimer?.fires_at ?? formAutoCloseTimer?.firesAt ?? p.closureNextAt,
                        label: "auto-close"
                      }
                    );
                  } else if (n.id === "b04_cust" && activeBranches.has("customer-delay") && (customerHoldTimer || p.closureNextAt)) {
                    countdown = /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CountdownChip,
                      {
                        firesAt: customerHoldTimer?.fires_at ?? customerHoldTimer?.firesAt ?? p.closureNextAt,
                        label: "auto-close",
                        paused: hasOpenTicket
                      }
                    );
                  } else if (n.id === "b02_tech" && activeBranches.has("technical") && technicalHoldTimer) {
                    countdown = /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CountdownChip,
                      {
                        firesAt: technicalHoldTimer.fires_at ?? technicalHoldTimer.firesAt,
                        label: "reminder"
                      }
                    );
                  }
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    FlowNode,
                    {
                      node: n,
                      state,
                      buttonEnabled: enabled,
                      buttonPending: !!handler?.pending,
                      buttonSent: isSent,
                      buttonLabel: handler?.label,
                      onButtonClick: handler?.onClick,
                      countdown,
                      phaseLabel: phase,
                      ticketOpen: n.id === "ticket_lane" && hasOpenTicket,
                      ticketNumber: n.id === "ticket_lane" ? openTicket?.ticket_number ?? (openTicket?.id ? String(openTicket.id).slice(0, 8) : null) : null,
                      ticketHref: n.id === "ticket_lane" && openTicket?.id ? `/admin/tickets/${openTicket.id}` : null
                    },
                    n.id
                  );
                })
              ]
            }
          )
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap items-center justify-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50/80 px-3.5 py-2.5", children: [
        isTalkToExpert && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => mutTalkExpert.mutate(),
            disabled: closed || completed || mutTalkExpert.isPending,
            className: "inline-flex items-center gap-1.5 rounded-md bg-violet-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-violet-700 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed select-none",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3.5" }),
              "Talk-to-Expert Completed (E009)"
            ]
          }
        ),
        closed || completed ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => mutReopen.mutate(),
            disabled: mutReopen.isPending,
            className: "inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-50 cursor-pointer transition select-none",
            title: "Reopen closed order into dedicated Order Reopened stage",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "size-3.5" }),
              mutReopen.isPending ? "Reopening…" : "Reopen Order (B09)"
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => {
              if (isOrderReopened) {
                mutResumeReopened.mutate();
              } else if (phase === "technical_delay") {
                mutResume.mutate();
              } else {
                mutResumeCustomer.mutate();
              }
            },
            disabled: !canResume || mutResumeCustomer.isPending || mutResume.isPending || mutResumeReopened.isPending,
            className: cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold shadow-xs transition select-none",
              canResume ? "bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer" : "bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed opacity-60"
            ),
            title: canResume ? "Resume order to active workflow processing" : "Resume Order is active when an order is in Order Reopened, Customer Delay, Technical Delay, or On Hold (or when Admin Override is ON)",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "size-3.5" }),
              mutResumeCustomer.isPending || mutResume.isPending || mutResumeReopened.isPending ? "Resuming…" : "Resume Order"
            ]
          }
        ),
        p.onAdminOverrideChange && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => p.onAdminOverrideChange?.(!p.adminOverride),
            className: cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold shadow-xs cursor-pointer transition select-none",
              p.adminOverride ? "bg-orange-600 text-white hover:bg-orange-700" : "bg-slate-200 text-slate-700 hover:bg-slate-300 border border-slate-300"
            ),
            title: "Toggle Admin Override to unlock all stage actions B01–B08",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "size-3.5" }),
              "Admin Override: ",
              p.adminOverride ? "ON" : "OFF"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setDialog({ kind: "force_close" }),
            disabled: closed,
            className: "inline-flex items-center gap-1.5 rounded-md bg-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed select-none",
            title: "Force close order with closure reason and send E010 notification",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-3.5" }),
              "Force Close (B10)"
            ]
          }
        ),
        p.adminOverride && isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setDialog({ kind: "silent_close" }),
            disabled: closed,
            className: "inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-black disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed select-none border border-slate-700 transition",
            title: "Close order silently with NO customer email notification (Admin Override Only)",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "size-3.5 text-amber-400" }),
              "Silent Close (No Email)"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setDialog({ kind: "callback_reminder" }),
            disabled: closed || completed,
            className: cn(
              "inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none",
              activeCallback?.isDue && !closed && !completed ? "bg-rose-600 hover:bg-rose-700 animate-pulse ring-2 ring-rose-400" : activeCallback && !closed && !completed ? "bg-indigo-600 hover:bg-indigo-700" : isReopenedHot ? "bg-rose-600 hover:bg-rose-700 animate-pulse ring-2 ring-rose-400" : "bg-blue-600 hover:bg-blue-700"
            ),
            title: closed || completed ? "Callback reminder is inactive on completed/closed orders" : "Set customer callback reminder (order becomes Hot Order when reminder ends)",
            children: [
              (activeCallback?.isDue || isReopenedHot) && !closed && !completed ? /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneCall, { className: "size-3.5" }),
              (activeCallback?.isDue || isReopenedHot) && !closed && !completed ? activeCallback?.parsedRemarks?.channel === "technical_delay" ? "Tech Delay Due (HOT ORDER)" : activeCallback?.parsedRemarks?.channel === "email" || activeCallback?.parsedRemarks?.reason === "ticket_hot_priority" || activeCallback?.parsedRemarks?.ticketNumber || activeCallback?.parsedRemarks?.origin === "support_ticket" || activeCallback?.parsedRemarks?.reasonLabel && activeCallback.parsedRemarks.reasonLabel.toLowerCase().includes("ticket") || activeCallback?.parsedRemarks?.note && activeCallback.parsedRemarks.note.toLowerCase().includes("ticket") ? "Email Action Due (HOT ORDER)" : "Call Due Now (HOT ORDER)" : activeCallback && !closed && !completed ? activeCallback.parsedRemarks?.channel === "technical_delay" ? "Tech Delay Scheduled" : activeCallback.parsedRemarks?.channel === "email" || activeCallback.parsedRemarks?.reason === "ticket_hot_priority" || activeCallback.parsedRemarks?.ticketNumber ? "Email Reminder Active" : "Callback Scheduled" : "Call Back / Reminder"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setDialog({ kind: "callback_history" }),
            className: "inline-flex items-center gap-1.5 rounded-md border border-indigo-200 bg-white px-3 py-1.5 text-xs font-bold text-indigo-700 shadow-xs hover:bg-indigo-50 hover:border-indigo-300 transition cursor-pointer",
            title: "View complete callback scheduling & audit history",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "size-3.5 text-indigo-600" }),
              "VIEW HISTORY ",
              historyCount > 0 ? `(${historyCount})` : ""
            ]
          }
        )
      ] }),
      activeCallback && !closed && !completed && (() => {
        const isTicketSourceHot = Boolean(
          activeCallback.parsedRemarks?.channel === "email" || activeCallback.parsedRemarks?.reason === "ticket_hot_priority" || activeCallback.parsedRemarks?.reason === "order_reopened" || activeCallback.parsedRemarks?.ticketNumber || activeCallback.parsedRemarks?.origin === "support_ticket" || activeCallback.parsedRemarks?.reasonLabel && activeCallback.parsedRemarks.reasonLabel.toLowerCase().includes("ticket") || activeCallback.parsedRemarks?.note && activeCallback.parsedRemarks.note.toLowerCase().includes("ticket")
        );
        const ticketNum = activeCallback.parsedRemarks?.ticketNumber || reopenedDetails.ticketNumber;
        const ticketId = activeCallback.parsedRemarks?.ticketId || reopenedDetails.ticketId;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(
          "mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-2.5 shadow-xs",
          activeCallback.isDue ? "border-rose-300 bg-rose-50 text-rose-950" : "border-indigo-200 bg-indigo-50/80 text-indigo-950"
        ), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2.5", children: [
            activeCallback.isDue ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-md bg-rose-600 px-2 py-0.5 text-[10px] font-black uppercase text-white shadow-xs tracking-wider", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-3" }),
              " HOT ORDER NOW"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-md bg-indigo-600 px-2 py-0.5 text-[10px] font-black uppercase text-white shadow-xs tracking-wider", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-3" }),
              " ",
              activeCallback.parsedRemarks?.channel === "technical_delay" ? "Tech Delay Reminder" : isTicketSourceHot ? "Email Action Reminder" : "Scheduled Callback"
            ] }),
            ticketNum && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: `/admin/support/tickets/${ticketId || ticketNum}`,
                className: "inline-flex items-center gap-1 rounded-md bg-rose-100 border border-rose-200 px-2 py-0.5 text-xs font-bold text-rose-900 hover:bg-rose-200 transition",
                title: "Open Linked Support Ticket",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-3 text-rose-700" }),
                  "Ticket #",
                  ticketNum
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-slate-900", children: [
              "Due: ",
              formatIST(activeCallback.fires_at)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-slate-800", children: [
              "· ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "font-bold text-slate-900", children: "Reason:" }),
              " ",
              activeCallback.parsedRemarks?.reasonLabel || reopenedDetails.reason || "Follow-up",
              activeCallback.parsedRemarks?.note ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-600", children: [
                " (",
                activeCallback.parsedRemarks.note,
                ")"
              ] }) : null
            ] }),
            activeCallback.parsedRemarks?.channel === "technical_delay" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-900 border border-sky-300 text-xs font-bold shadow-2xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { className: "size-3.5 text-sky-700" }),
              " Technical Delay"
            ] }) : activeCallback.parsedRemarks?.channel === "email" || isTicketSourceHot ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-900 border border-purple-300 text-xs font-bold shadow-2xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-3.5 text-purple-700" }),
              " Check Email"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold shadow-2xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneCall, { className: "size-3.5 text-amber-700" }),
              " Check Call"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 ml-auto flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setDialog({ kind: "callback_history" }),
                className: "inline-flex items-center gap-1.5 rounded-lg border border-indigo-300 bg-white px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-50 hover:border-indigo-400 transition cursor-pointer shadow-xs",
                title: "View callback scheduling & rescheduling history",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "size-3.5 text-indigo-600" }),
                  "VIEW ",
                  historyCount > 0 ? `(${historyCount})` : ""
                ]
              }
            ),
            isTicketSourceHot && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => mutCompleteCallback.mutate(),
                disabled: mutCompleteCallback.isPending,
                className: "inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition cursor-pointer shadow-xs disabled:opacity-50",
                title: "Mark ticket email action completed & remove Hot Order",
                children: [
                  mutCompleteCallback.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3.5" }),
                  "Action Completed"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setDialog({ kind: "callback_reminder" }),
                className: "inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-50 transition cursor-pointer shadow-2xs",
                title: "Reschedule this callback",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-3.5 text-slate-600" }),
                  "Reschedule"
                ]
              }
            )
          ] })
        ] });
      })(),
      !activeCallback && isReopenedHot && !closed && !completed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-300 bg-rose-50 px-4 py-2.5 shadow-xs text-rose-950", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-md bg-rose-600 px-2 py-0.5 text-[10px] font-black uppercase text-white shadow-xs tracking-wider", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-3" }),
            " HOT ORDER NOW"
          ] }),
          reopenedDetails.ticketNumber && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: `/admin/support/tickets/${reopenedDetails.ticketId || reopenedDetails.ticketNumber}`,
              className: "inline-flex items-center gap-1 rounded-md bg-rose-100 border border-rose-200 px-2 py-0.5 text-xs font-bold text-rose-900 hover:bg-rose-200 transition",
              title: "Open Linked Support Ticket",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-3 text-rose-700" }),
                "Ticket #",
                reopenedDetails.ticketNumber
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-slate-900", children: reopenedDetails.reason }),
          reopenedDetails.note && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-slate-700 font-medium", children: [
            "· ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "font-bold text-slate-900", children: "Instructions:" }),
            " ",
            reopenedDetails.note
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 ml-auto flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setDialog({ kind: "callback_history" }),
              className: "inline-flex items-center gap-1.5 rounded-lg border border-indigo-300 bg-white px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-50 hover:border-indigo-400 transition cursor-pointer shadow-xs",
              title: "View callback scheduling & rescheduling history",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "size-3.5 text-indigo-600" }),
                "VIEW ",
                historyCount > 0 ? `(${historyCount})` : ""
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => mutCompleteCallback.mutate(),
              disabled: mutCompleteCallback.isPending,
              className: "inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition cursor-pointer shadow-xs disabled:opacity-50",
              title: "Mark customer contact / action completed & remove Hot Order",
              children: [
                mutCompleteCallback.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3.5" }),
                "Call Completed"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setDialog({ kind: "callback_reminder" }),
              className: "inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-50 transition cursor-pointer shadow-2xs",
              title: "Schedule customer callback",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-3.5 text-slate-600" }),
                "Schedule Callback"
              ]
            }
          )
        ] })
      ] })
    ] }),
    dialog?.kind === "callback_history" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      CallbackHistoryDialog,
      {
        orderId: p.applicationId,
        onClose: () => setDialog(null)
      }
    ),
    dialog?.kind === "callback_reminder" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      CallbackReminderDialog,
      {
        orderId: p.applicationId,
        onClose: () => {
          setDialog(null);
          invalidate();
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CustomerDelayDialog,
      {
        applicationId: p.applicationId,
        open: dialog?.kind === "customer_delay",
        onClose: () => {
          setDialog(null);
          invalidate();
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TechnicalDelayDialog,
      {
        applicationId: p.applicationId,
        open: dialog?.kind === "technical_delay",
        onClose: () => {
          setDialog(null);
          invalidate();
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CloseOrderDialog,
      {
        applicationId: p.applicationId,
        open: dialog?.kind === "force_close",
        onClose: () => {
          setDialog(null);
          invalidate();
        }
      }
    ),
    dialog?.kind === "silent_close" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      SilentCloseInline$1,
      {
        applicationId: p.applicationId,
        onClose: () => {
          setDialog(null);
          invalidate();
        }
      }
    ),
    dialog?.kind === "govt_rejected" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      GovtRejectedInline$1,
      {
        orderId: p.applicationId,
        onClose: () => {
          setDialog(null);
          invalidate();
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CompletionGateDialogStandalone,
      {
        open: dialog?.kind === "complete_with_cert",
        onOpenChange: (v) => {
          if (!v) setDialog(null);
        },
        orderId: p.applicationId,
        busy: false,
        onConfirm: async (payload) => {
          await fnUpdateFF({
            data: {
              orderId: p.applicationId,
              toStatus: "completed",
              certificateDocumentId: payload.certificateDocumentId,
              certificateNumber: payload.certificateNumber,
              completionNotes: payload.completionNotes,
              ccEmail: payload.ccEmail,
              adminOverride: p.adminOverride || void 0
            }
          });
          toast.success("E007 sent — order completed with certificate");
          invalidate();
        }
      }
    ),
    dialog?.kind === "consultation_completed" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConsultationCompletedInline,
      {
        orderId: p.applicationId,
        pending: mutConsultation.isPending,
        onSubmit: (remarks) => mutConsultation.mutate(remarks),
        onClose: () => setDialog(null)
      }
    )
  ] });
}
function ConsultationCompletedInline({
  orderId,
  pending,
  onSubmit,
  onClose
}) {
  const [remarks, setRemarks] = reactExports.useState("");
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4", role: "dialog", "aria-modal": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-1 text-xs font-medium uppercase tracking-wider text-emerald-700", children: "B06 · S08" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-1 text-lg font-bold text-slate-900", children: "Consultation Completed — send E005" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 text-sm text-slate-600", children: [
      "Marks order ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: orderId.slice(0, 8) }),
      " as ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Consultation Completed" }),
      " and emails the customer. Anything you type below appears in the email as the ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Note" }),
      " row."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500", children: "Note to customer (optional)" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        value: remarks,
        onChange: (e) => setRemarks(e.target.value.slice(0, 1e3)),
        rows: 5,
        placeholder: "e.g. Application filed on the Udyam portal on 21 Jul 2026. Kindly monitor your registered mobile/email for OTP or govt communication.",
        className: "w-full resize-y rounded-lg border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-right text-[11px] text-slate-400", children: [
      remarks.length,
      "/1000"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex justify-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onClose,
          disabled: pending,
          className: "rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => onSubmit(remarks.trim()),
          disabled: pending,
          className: "rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50",
          children: pending ? "Sending…" : "Send E005 & mark completed"
        }
      )
    ] })
  ] }) });
}
function getButtonLabel(code) {
  switch (code) {
    case "B01":
      return "Send E002";
    case "B02":
      return "Send E003";
    case "B03":
      return "Send E011";
    case "B04":
      return "Send E004";
    case "B05":
      return "Send E005";
    case "B06":
      return "Send E005";
    case "B07":
      return "Upload PDF";
    case "B08":
      return "Send E008";
    default:
      return "Trigger";
  }
}
const TONE_STYLES = {
  maroon: { border: "border-rose-900", bg: "bg-rose-950", text: "text-white", icon: "text-white", btn: "bg-rose-800 hover:bg-rose-700 text-white cursor-pointer", ring: "ring-rose-400", solid: "bg-rose-900 text-white" },
  slate: { border: "border-slate-400", bg: "bg-white", text: "text-slate-800", icon: "text-slate-600", btn: "bg-slate-700 hover:bg-slate-800 text-white cursor-pointer", ring: "ring-slate-300", solid: "bg-slate-700 text-white" },
  amber: { border: "border-amber-400", bg: "bg-amber-50", text: "text-amber-900", icon: "text-amber-700", btn: "bg-amber-600 hover:bg-amber-700 text-white cursor-pointer", ring: "ring-amber-300", solid: "bg-amber-600 text-white" },
  rose: { border: "border-rose-400", bg: "bg-rose-50", text: "text-rose-900", icon: "text-rose-700", btn: "bg-rose-600 hover:bg-rose-700 text-white cursor-pointer", ring: "ring-rose-300", solid: "bg-rose-600 text-white" },
  sky: { border: "border-sky-400", bg: "bg-sky-50", text: "text-sky-900", icon: "text-sky-700", btn: "bg-sky-600 hover:bg-sky-700 text-white cursor-pointer", ring: "ring-sky-300", solid: "bg-sky-600 text-white" },
  violet: { border: "border-violet-400", bg: "bg-violet-50", text: "text-violet-900", icon: "text-violet-700", btn: "bg-violet-600 hover:bg-violet-700 text-white cursor-pointer", ring: "ring-violet-300", solid: "bg-violet-600 text-white" },
  emerald: { border: "border-emerald-500", bg: "bg-emerald-600", text: "text-white", icon: "text-white", btn: "bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer", ring: "ring-emerald-300", solid: "bg-emerald-600 text-white" },
  indigo: { border: "border-indigo-400", bg: "bg-indigo-50", text: "text-indigo-900", icon: "text-indigo-700", btn: "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer", ring: "ring-indigo-300", solid: "bg-indigo-600 text-white" }
};
function FlowNode({
  node,
  state,
  buttonEnabled,
  buttonPending,
  buttonSent,
  buttonLabel,
  onButtonClick,
  countdown,
  phaseLabel,
  ticketOpen,
  ticketNumber,
  ticketHref
}) {
  const Icon = ICONS$1[node.icon];
  const isAction = node.kind === "action";
  const isTerminal = node.kind === "terminal";
  const isSub = node.kind === "sub";
  let tone = node.tone;
  if (state === "terminal-ok") tone = "emerald";
  else if (state === "terminal-bad") tone = "rose";
  else if (state === "active" && node.id === "form_not") tone = "amber";
  else if (state === "active" && node.kind === "stage") tone = "indigo";
  else if (state === "done" && node.kind === "stage") tone = "emerald";
  else if (state === "idle" && node.kind === "stage" && node.tone !== "maroon") tone = "slate";
  else if (state === "idle" && node.kind === "action" && !buttonEnabled) tone = "slate";
  if ((node.id === "b06_consult" || node.id === "b07_accept") && state === "done") tone = "emerald";
  const t = TONE_STYLES[tone];
  const dim = state === "idle" && !buttonEnabled;
  const active = state === "active" || state === "terminal-ok" || state === "terminal-bad" || node.kind === "action" && buttonEnabled && state !== "done";
  let badgeTopClass = "absolute -top-3 left-1/2 -translate-x-1/2";
  if (node.id === "b05_submit") {
    badgeTopClass = "absolute top-1/2 -translate-y-1/2 -left-6";
  } else if (node.id === "b06_consult" || node.id === "b07_accept") {
    badgeTopClass = "absolute top-1/2 -translate-y-1/2 -right-8";
  } else if (node.id === "b08_reject") {
    badgeTopClass = "absolute top-[35%] -translate-y-1/2 -right-8";
  } else if (node.id === "b04_cust") {
    badgeTopClass = "absolute -top-3 left-[35%] -translate-x-1/2";
  }
  let badgeBottomClass = "absolute -bottom-3 left-1/2 -translate-x-1/2";
  if (node.id === "b08_reject") {
    badgeBottomClass = "absolute top-[65%] -translate-y-1/2 -right-8";
  } else if (node.id === "b04_cust") {
    badgeBottomClass = "absolute -top-3 left-[65%] -translate-x-1/2";
  } else if (node.id === "closed_e010") {
    badgeBottomClass = "absolute top-1/2 -translate-y-1/2 -right-8";
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "absolute flex flex-col justify-between rounded-lg border-2 shadow-sm transition-all text-center p-1.5",
        t.border,
        t.bg,
        active && "ring-2 shadow-md",
        active && t.ring,
        dim && "opacity-80",
        isSub && "border-dashed"
      ),
      style: {
        left: node.x,
        top: node.y,
        width: nodeW(node),
        minHeight: nodeH(node),
        height: nodeH(node)
      },
      "data-node": node.id,
      "data-state": state,
      children: [
        node.badgeTop && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("rounded bg-yellow-300 border border-yellow-400 px-1.5 py-px text-[9px] font-black text-slate-900 shadow-xs z-10 font-mono", badgeTopClass), children: node.badgeTop }),
        node.badgeBottom && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("rounded bg-blue-600 border border-blue-700 px-1.5 py-px text-[9px] font-black text-white shadow-xs z-10 font-mono", badgeBottomClass), children: node.badgeBottom }),
        node.tag && !node.badgeBottom && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-black text-white shadow", children: node.tag }),
        countdown && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap z-20", children: countdown }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("grid size-4.5 place-items-center rounded-full border bg-white shrink-0", t.border), children: state === "done" && node.kind === "stage" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3 text-emerald-600" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("size-3", node.tone === "maroon" || node.tone === "emerald" ? "text-slate-900" : t.icon) }) }),
          active && !isTerminal && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-rose-600 px-1 py-px text-[7px] font-black uppercase tracking-wider text-white", children: "LIVE" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("px-0.5 my-auto", t.text), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-bold leading-tight tracking-tight", children: node.label }),
          node.subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 text-[9px] font-medium leading-tight opacity-90", children: node.subtitle }),
          node.highlightText && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
            "mt-0.5 text-[8.5px] font-extrabold leading-tight",
            node.tone === "emerald" || tone === "emerald" ? "text-amber-200" : "text-rose-600"
          ), children: node.highlightText })
        ] }),
        isAction && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: onButtonClick,
            disabled: !buttonEnabled || buttonPending,
            title: !buttonEnabled ? `${node.buttonCode} locked in phase "${phaseLabel}"` : node.label,
            className: cn(
              "w-full inline-flex items-center justify-center gap-1 rounded px-1 py-0.5 text-[9px] font-bold shadow-xs transition disabled:cursor-not-allowed",
              buttonEnabled ? cn(t.btn, "cursor-pointer") : "bg-slate-100 text-slate-500 border border-slate-200 cursor-not-allowed"
            ),
            children: [
              buttonSent && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-2.5" }),
              buttonPending ? "…" : buttonEnabled ? buttonLabel ?? getButtonLabel(node.buttonCode) : buttonSent ? "Sent" : "Locked"
            ]
          }
        ) }),
        isSub && ticketOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: ticketHref ?? "#",
            className: "inline-flex w-full items-center justify-center gap-1 rounded bg-violet-600 px-1 py-0.5 text-[9px] font-bold text-white shadow-sm hover:bg-violet-700 cursor-pointer",
            children: [
              "#",
              ticketNumber,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-2.5" })
            ]
          }
        ) }),
        isSub && !ticketOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-0.5 text-[8px] italic opacity-60", children: "No open ticket" })
      ]
    }
  );
}
function Legend({ cls, label }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("inline-block size-2.5 rounded-full", cls) }),
    label
  ] });
}
function GovtRejectedInline$1({ orderId, onClose }) {
  const [reasonText, setReasonText] = reactExports.useState("");
  const fn = useServerFn(handleGovtRejected);
  const listReasons = useServerFn(listCloseReasons);
  const [busy, setBusy] = reactExports.useState(false);
  const { data: reasons = [] } = useQuery({
    queryKey: ["close-reasons-all"],
    queryFn: () => listReasons(),
    staleTime: 6e4
  });
  const catB = reasons.filter((r) => r.category === "B");
  const [reasonId, setReasonId] = reactExports.useState(null);
  const submit = async () => {
    if (!reasonId) return toast.error("Pick a Category B reason");
    setBusy(true);
    try {
      await fn({ data: { orderId, reasonId, remarks: reasonText || null } });
      toast.success("E008 sent — order closed (rejected)");
      onClose();
    } catch (e) {
      toast.error(e?.message ?? "Failed");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 grid place-items-center bg-black/60 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-lg rounded-xl border bg-white p-5 shadow-xl space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-slate-900", children: "E008 — Application Rejected by Govt" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-600", children: "Sends E008 to the customer and force-closes this order (no resubmit loop)." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-semibold uppercase tracking-wider text-slate-500", children: "Reason (Category B)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          value: reasonId ?? "",
          onChange: (e) => setReasonId(e.target.value || null),
          className: "w-full rounded-md border px-2 py-1.5 text-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select a reason…" }),
            catB.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: r.id, children: [
              "B",
              r.number,
              " — ",
              r.label
            ] }, r.id))
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-semibold uppercase tracking-wider text-slate-500", children: "Extra remarks (optional)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          value: reasonText,
          onChange: (e) => setReasonText(e.target.value),
          rows: 3,
          className: "w-full rounded-md border px-2 py-1.5 text-sm"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, disabled: busy, className: "rounded-md border px-3 py-1.5 text-sm", children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: submit,
          disabled: busy || !reasonId,
          className: "rounded-md bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50",
          children: "Send E008 & Close"
        }
      )
    ] })
  ] }) });
}
function SilentCloseInline$1({ applicationId, onClose }) {
  const [reasonText, setReasonText] = reactExports.useState("");
  const fnSilent = useServerFn(silentCloseOrder);
  const [busy, setBusy] = reactExports.useState(false);
  const qc = useQueryClient();
  const submit = async () => {
    setBusy(true);
    try {
      await fnSilent({
        data: {
          applicationId,
          reasonCode: "ADMIN_SILENT_CLOSE",
          reasonLabel: "Silent Close (Admin Override)",
          notes: reasonText.trim() || void 0
        }
      });
      toast.success("Order closed silently — no customer email sent");
      qc.invalidateQueries({ queryKey: ["admin.order", applicationId] });
      qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
      qc.invalidateQueries({ queryKey: ["order-workflow-state", applicationId] });
      qc.invalidateQueries({ queryKey: ["order-tickets", applicationId] });
      qc.invalidateQueries({ queryKey: ["workflow-timers", applicationId] });
      qc.invalidateQueries({ queryKey: ["workflow-events", applicationId] });
      qc.invalidateQueries({ queryKey: ["due-reminders-summary"] });
      onClose();
    } catch (e) {
      toast.error(e?.message ?? "Silent close failed");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 grid place-items-center bg-black/60 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-lg rounded-xl border border-slate-700 bg-slate-900 text-white p-5 shadow-2xl space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex size-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "size-4.5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm text-white", children: "Silent Close Order (Admin Override)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400", children: "Close immediately without sending any customer email" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-300", children: [
      "⚠️ ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "No Customer Email:" }),
      " This will transition the order to Closed, cancel all active reminders and hot order alerts, and update the status without sending any emails or notifications to the customer."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-semibold uppercase tracking-wider text-slate-400", children: "Internal Remarks / Reason (Optional)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          value: reasonText,
          onChange: (e) => setReasonText(e.target.value),
          placeholder: "e.g. Offline resolved / test order / client requested silent closure",
          rows: 3,
          className: "w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2 border-t border-slate-800", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onClose,
          disabled: busy,
          className: "rounded-md border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition cursor-pointer",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: submit,
          disabled: busy,
          className: "inline-flex items-center gap-1.5 rounded-md bg-amber-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-amber-500 transition disabled:opacity-50 shadow-md cursor-pointer",
          children: [
            busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "size-3.5" }),
            "Confirm Silent Close"
          ]
        }
      )
    ] })
  ] }) });
}
const TERMINAL_STAGES = /* @__PURE__ */ new Set(["completed", "order_completed", "order_closed", "cancelled"]);
function ChangeServiceButton(p) {
  const [open, setOpen] = reactExports.useState(false);
  const canChange = !TERMINAL_STAGES.has(p.fulfillmentStatus);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          disabled: !canChange,
          onClick: () => setOpen(true),
          className: `inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold border ${canChange ? "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100" : "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Repeat, { className: "w-3.5 h-3.5" }),
            " Change Service"
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: canChange ? "Switch this order to a different service." : "Service cannot be changed on completed or closed orders." })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ChangeServiceDialog,
      {
        orderId: p.orderId,
        currentServiceId: p.currentServiceId,
        currentServiceName: p.currentServiceName,
        onClose: () => setOpen(false)
      }
    )
  ] });
}
function ChangeServiceDialog({
  orderId,
  currentServiceId,
  currentServiceName,
  onClose
}) {
  const qc = useQueryClient();
  const listFn = useServerFn(listServices);
  const changeFn = useServerFn(changeOrderService);
  const resendFn = useServerFn(resendServiceChangeEmail);
  const { data } = useQuery({ queryKey: ["admin.services"], queryFn: () => listFn() });
  const [newId, setNewId] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const [resendingEmail, setResendingEmail] = reactExports.useState(false);
  const [copiedLink, setCopiedLink] = reactExports.useState(null);
  const [result, setResult] = reactExports.useState(null);
  const options = (data?.rows ?? []).filter(
    (s) => s.id !== currentServiceId && isVisibleService(s)
  );
  const currentSvc = (data?.rows ?? []).find((s) => s.id === currentServiceId);
  const selected = options.find((s) => s.id === newId);
  const currentTotal = Number(currentSvc?.total_amount ?? 0);
  const newTotal = Number(selected?.total_amount ?? 0);
  const delta = selected ? Math.round((newTotal - currentTotal) * 100) / 100 : 0;
  const mode = !selected ? null : delta > 0.01 ? "upgrade" : delta < -0.01 ? "downgrade" : "same";
  const modeStyles = {
    same: "border-emerald-200 bg-emerald-50 text-emerald-900",
    downgrade: "border-slate-200 bg-slate-50 text-slate-800",
    upgrade: "border-amber-200 bg-amber-50 text-amber-900"
  };
  const modeLabel = {
    same: "Same price",
    downgrade: "Downgrade",
    upgrade: "Top-up required"
  };
  const submitLabel = busy ? "Applying…" : mode === "upgrade" ? "Change & send balance link" : mode === "downgrade" ? "Change (no refund)" : mode === "same" ? "Change service" : "Apply Change";
  const submit = async () => {
    if (!newId) return;
    setBusy(true);
    try {
      const r = await changeFn({ data: { orderId, newServiceId: newId } });
      setResult(r);
      const priceMsg = r.mode === "upgrade" ? `Top-up of ₹${r.delta.toFixed(2)} required — payment link generated.` : r.mode === "downgrade" ? `Customer overpaid by ₹${Math.abs(r.delta).toFixed(2)} (no refund per policy).` : `Amount unchanged.`;
      toast.success(`Service changed to ${r.newService?.service_name}. ${priceMsg}`);
      qc.invalidateQueries({ queryKey: ["admin.order"] });
      qc.invalidateQueries({ queryKey: ["admin.order", orderId] });
      qc.invalidateQueries({ queryKey: ["admin.formSubmission"] });
      qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
      qc.invalidateQueries({ queryKey: ["admin.lead.workspace"] });
      qc.invalidateQueries({ queryKey: ["admin.lead-emails"] });
      qc.invalidateQueries({ queryKey: ["admin.invoices"] });
      qc.invalidateQueries({ queryKey: ["payment-link-status", orderId] });
    } catch (e) {
      toast.error(e?.message ?? "Failed to change service");
    } finally {
      setBusy(false);
    }
  };
  const handleResendEmail = async () => {
    setResendingEmail(true);
    try {
      const r = await resendFn({ data: { orderId } });
      toast.success(`Service update email resent to ${r.recipient}`);
      qc.invalidateQueries({ queryKey: ["admin.lead-emails"] });
    } catch (e) {
      toast.error(e?.message ?? "Failed to resend email");
    } finally {
      setResendingEmail(false);
    }
  };
  const handleDone = () => {
    qc.invalidateQueries({ queryKey: ["admin.order", orderId] });
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && handleDone(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: result ? "Service Updated Successfully" : "Change Service" }) }),
    result ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-sm py-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-emerald-900 flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 text-emerald-600 shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-bold text-sm text-emerald-950", children: [
            "Switched to ",
            result.newService?.service_name
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            result.mode === "upgrade" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full inline-block mt-0.5", children: [
              "Top-up required: ₹",
              result.delta?.toFixed(2)
            ] }),
            result.mode === "downgrade" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full inline-block mt-0.5", children: [
              "Downgrade (Overpayment ₹",
              Math.abs(result.delta)?.toFixed(2),
              " retained)"
            ] }),
            result.mode === "same" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-0.5", children: [
              "Same Price (₹",
              result.newTotal?.toFixed(2),
              ")"
            ] })
          ] })
        ] })
      ] }),
      result.topUpUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 text-xs font-semibold text-amber-900", children: [
        "Balance payment of ₹",
        result.delta?.toFixed(2),
        " requested — the payment link is sent to the customer by email."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-slate-200 bg-slate-50 p-3.5 flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-medium text-slate-900 flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3.5 h-3.5 text-indigo-600" }),
            "Customer Email Notification"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 truncate", children: result.emailSent ? "Service update & link email delivered to customer" : result.emailError || "Click below to send update email to customer" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            disabled: resendingEmail,
            onClick: handleResendEmail,
            className: "shrink-0 h-8 gap-1.5 text-xs border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100",
            children: resendingEmail ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }),
              " Sending…"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3.5 h-3.5" }),
              " Resend Email"
            ] })
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-slate-200 bg-slate-50 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-slate-500", children: "Current" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-900", children: currentServiceName }),
        currentSvc && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-600 mt-0.5", children: [
          "₹",
          currentTotal.toFixed(2)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase tracking-wider text-slate-500", children: "New service" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: newId,
            onChange: (e) => setNewId(e.target.value),
            className: "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select a service…" }),
              options.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: s.id, children: [
                s.service_name,
                " — ₹",
                Number(s.total_amount).toFixed(2)
              ] }, s.id))
            ]
          }
        )
      ] }),
      selected && mode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-md border p-3 text-xs space-y-2 ${modeStyles[mode]}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold uppercase tracking-wider text-[10px]", children: "Adjustment" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold", children: modeLabel[mode] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Currently paid" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-right font-semibold", children: [
            "₹",
            currentTotal.toFixed(2)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "New total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-right font-semibold", children: [
            "₹",
            newTotal.toFixed(2)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "border-t pt-1 mt-1", children: mode === "upgrade" ? "Balance due" : mode === "downgrade" ? "Overpayment (retained)" : "Difference" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-right font-bold border-t pt-1 mt-1", children: [
            "₹",
            Math.abs(delta).toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "pt-1 leading-relaxed", children: [
          mode === "upgrade" && "A balance payment link will be created and emailed. The onboarding form for the new service unlocks after payment.",
          mode === "downgrade" && "The service will be switched immediately. No refund is issued for the difference (per policy). Onboarding form link for the new service will be emailed.",
          mode === "same" && "The service will be switched immediately. No extra payment needed — onboarding form link for the new service will be emailed."
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: result ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleDone, className: "bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5", children: "Done" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, disabled: busy, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submit, disabled: !newId || busy, children: submitLabel })
    ] }) })
  ] }) });
}
function OrderDocumentsPanel({
  orderId,
  documents,
  deletedAt,
  deletedReason,
  hideMoney = false
}) {
  const qc = useQueryClient();
  const urlFn = useServerFn(getOrderDocumentSignedUrl);
  const [uploadOpen, setUploadOpen] = reactExports.useState(false);
  const visibleDocs = hideMoney ? documents.filter((d) => !/invoice/i.test(String(d.doc_type ?? ""))) : documents;
  const open = async (path) => {
    try {
      const { url, error } = await urlFn({ data: { path } });
      if (!url) {
        toast.error(error ?? "Failed to open document");
        return;
      }
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      toast.error(e?.message ?? "Failed to open document");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-white p-5 space-y-3", style: { borderColor: "var(--admin-border)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-4 text-slate-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Documents" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => setUploadOpen(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-3 mr-1" }),
        " Upload"
      ] })
    ] }),
    deletedAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md bg-rose-50 border border-rose-200 p-2 text-xs text-rose-800", children: [
      "Customer documents deleted on",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: new Date(deletedAt).toLocaleString("en-IN") }),
      deletedReason ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        " — reason: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: deletedReason })
      ] }) : null,
      ".",
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 text-rose-700/80", children: "Privacy policy compliance — only the certificate is retained." })
    ] }),
    visibleDocs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 italic", children: "No documents on file." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y", style: { borderColor: "var(--admin-border)" }, children: visibleDocs.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "py-2 flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-slate-800 truncate", children: d.file_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-slate-500 uppercase tracking-wider", children: [
          d.doc_type,
          " · ",
          (Number(d.size_bytes ?? 0) / 1024).toFixed(0),
          " KB ·",
          " ",
          new Date(d.uploaded_at ?? d.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", onClick: () => open(d.file_path), className: "text-blue-600", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-3 mr-1" }),
        " Open"
      ] })
    ] }, d.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      UploadDialog,
      {
        open: uploadOpen,
        onOpenChange: setUploadOpen,
        orderId,
        onDone: () => qc.invalidateQueries({ queryKey: ["admin.order", orderId] })
      }
    )
  ] });
}
function UploadDialog({
  open,
  onOpenChange,
  orderId,
  onDone
}) {
  const requestFn = useServerFn(requestOrderDocumentUpload);
  const confirmFn = useServerFn(confirmOrderDocumentUpload);
  const [docType, setDocType] = reactExports.useState("acknowledgement");
  const [file, setFile] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(false);
  const submit = async () => {
    if (!file) {
      toast.error("Pick a file");
      return;
    }
    if (file.size === 0) {
      toast.error("The selected file is empty (0 bytes). Please select a valid file.");
      return;
    }
    if (!docType.trim()) {
      toast.error("Doc type required");
      return;
    }
    setBusy(true);
    try {
      const { path, token } = await requestFn({
        data: {
          orderId,
          docType: docType.trim(),
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size
        }
      });
      const { supabase: supabase2 } = await import("./client-BX5UfqqR.mjs");
      const { error } = await supabase2.storage.from("documents").uploadToSignedUrl(path, token, file, {
        contentType: file.type || void 0,
        upsert: true
      });
      if (error) throw error;
      await confirmFn({
        data: {
          orderId,
          docType: docType.trim(),
          filePath: path,
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size
        }
      });
      toast.success("Document uploaded");
      onDone();
      onOpenChange(false);
      setFile(null);
    } catch (e) {
      let msg = e?.message ?? "Upload failed";
      try {
        const parsed = JSON.parse(msg);
        if (Array.isArray(parsed) && parsed[0]) {
          if (parsed[0]?.path?.includes("sizeBytes")) {
            msg = "The selected file is empty (0 bytes). Please upload a valid document.";
          } else if (parsed[0]?.message) {
            msg = parsed[0].message;
          }
        }
      } catch {
      }
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Upload Document" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Document type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input$1, { value: docType, onChange: (e) => setDocType(e.target.value), placeholder: "acknowledgement" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "File (PDF, JPG, PNG, WEBP — max 15 MB)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input$1,
          {
            type: "file",
            accept: ".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*",
            onChange: (e) => setFile(e.target.files?.[0] ?? null)
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), disabled: busy, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submit, disabled: busy || !file, children: busy ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3 animate-spin mr-1" }),
        "Uploading…"
      ] }) : "Upload" })
    ] })
  ] }) });
}
createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("6fa3bf56936c0d26113e7a04809f389b07cf426d5b5c0a3237086c5a0a02d0eb"));
createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("50ef44b91bac83cd17e6535cbde2d041c5bc7de3b2e7615c9f1115f3b16b1f9f"));
createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("a1686ef4b8a37642fb43d1b7dbff9af37c0e23ecf6475e5ec8bf89eb2fce930e"));
const RefundInput = object({
  paymentId: string().uuid(),
  amount: number().positive(),
  reason: string().trim().min(3).max(500)
});
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => RefundInput.parse(i)).handler(createSsrRpc("cb5cd1edb0683d4b8c27db182aaa1e516f1fe2b939d1944801019c7368c7b994"));
const ReconcileInput = object({
  paymentId: string().uuid()
});
const reconcilePaymentStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => ReconcileInput.parse(i)).handler(createSsrRpc("019efab430c8cc2fb376e96fc17c9a1b4d9f9261bdadf738e84ed4b25a5df33d"));
const fmt = (s) => s ? new Date(s).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";
const ICONS = {
  generated: FileText,
  regenerated: RefreshCw,
  replaced: Replace,
  emailed: Mail,
  email_failed: CircleAlert,
  preview: Eye,
  delivery_update: Mail
};
function InvoiceHistoryDrawer({
  invoiceId,
  open,
  onOpenChange
}) {
  const getFn = useServerFn(getInvoiceDetail);
  const { data, isLoading } = useQuery({
    queryKey: ["invoice.detail", invoiceId],
    queryFn: () => getFn({ data: { invoiceId } }),
    enabled: !!invoiceId && open
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { side: "right", className: "w-full sm:max-w-xl overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetTitle, { className: "text-base", children: [
      "Invoice ",
      data?.invoice?.invoice_number ?? "…"
    ] }) }),
    isLoading || !data ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 text-sm text-slate-500", children: "Loading…" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-5 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-slate-50/60 p-3 space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Attachment name", value: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: data.invoice.attachment_name }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Invoice date", value: fmt(data.invoice.issued_at) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "PDF generated", value: fmt(data.invoice.pdf_generated_at) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "PDF status", value: data.invoice.pdf_path ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-emerald-100 text-emerald-700 text-[10px]", children: "Ready" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px]", children: "Pending" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Last emailed", value: fmt(data.invoice.last_emailed_at) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Email attempts", value: String(data.invoice.email_attempts ?? 0) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Last email status", value: data.invoice.last_email_status ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Delivery status", value: data.invoice.delivery_status ?? "—" }),
        data.invoice.replaced_at && /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Replaced at", value: fmt(data.invoice.replaced_at) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2", children: "Lifecycle events" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "space-y-2", children: [
          data.events.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-slate-400 italic", children: "No events." }),
          data.events.map((e) => {
            const Icon = ICONS[e.event_type] ?? FileText;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2.5 border-l-2 border-slate-200 pl-3 py-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-3.5 mt-0.5 text-slate-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium capitalize", children: String(e.event_type).replace(/_/g, " ") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: fmt(e.created_at) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-slate-500", children: [
                  "by ",
                  e.actor_label
                ] }),
                e.detail && Object.keys(e.detail).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "mt-1 text-[10px] bg-slate-50 rounded p-1.5 overflow-x-auto", children: JSON.stringify(e.detail, null, 0) })
              ] })
            ] }, e.id);
          })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2", children: "Email delivery log" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "space-y-2", children: [
          data.emailLogs.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-slate-400 italic", children: "No emails recorded for this lead yet." }),
          data.emailLogs.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2.5 border-l-2 border-slate-200 pl-3 py-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: `size-3.5 mt-0.5 ${l.status === "sent" ? "text-emerald-600" : l.status === "failed" ? "text-rose-600" : "text-slate-500"}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: l.template_code ?? l.subject }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: fmt(l.created_at) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-slate-500", children: [
                l.to_email,
                " · ",
                l.status
              ] }),
              l.error_message && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-rose-600", children: l.error_message })
            ] })
          ] }, l.id))
        ] })
      ] })
    ] })
  ] }) });
}
function Row({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-800", children: value })
  ] });
}
const fmtDate = (s) => s ? new Date(s).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" }) : "—";
function OrderPaymentsPanel({ payments }) {
  const getUrlFn = useServerFn(getInvoiceSignedUrl);
  const regenFn = useServerFn(regenerateInvoice);
  const resendFn = useServerFn(resendInvoiceEmail);
  const previewFn = useServerFn(previewInvoice);
  const replaceFn = useServerFn(replaceInvoice);
  const reconcileFn = useServerFn(reconcilePaymentStatus);
  const gstinFn = useServerFn(updateInvoiceGstin);
  const qc = useQueryClient();
  const handleGstin = async (p) => {
    if (!p.invoice_id) return toast.error("Invoice not generated yet.");
    const v = window.prompt("Customer GSTIN (15 characters). The invoice will be regenerated. No email will be sent.", p.invoice_gstin ?? "");
    if (!v || !v.trim()) return;
    try {
      setBusy(`gst-${p.id}`);
      await gstinFn({ data: { invoiceId: p.invoice_id, gstin: v.trim() } });
      toast.success("GSTIN saved and invoice regenerated. No email sent.");
      qc.invalidateQueries({ queryKey: ["admin.order"] });
    } catch (e) {
      toast.error(e?.message ?? "GSTIN update failed");
    } finally {
      setBusy(null);
    }
  };
  const [busy, setBusy] = reactExports.useState(null);
  const [historyId, setHistoryId] = reactExports.useState(null);
  const fileInputRef = reactExports.useRef(null);
  const replaceTargetRef = reactExports.useRef(null);
  const paidPayments = (payments ?? []).filter((p) => {
    const status = String(p.status ?? "").toLowerCase();
    const isPaidStatus = ["paid", "success", "successful", "refunded"].includes(status);
    return isPaidStatus || !!p.invoice_number || !!p.parent_payment_id;
  });
  const openInvoiceUrl = async (invoiceId) => {
    const { url } = await getUrlFn({ data: { invoiceId } });
    return url;
  };
  const handleDownload = async (p) => {
    if (!p.invoice_id) return toast.error("Invoice not generated yet.");
    try {
      setBusy(`dl-${p.id}`);
      const url = await openInvoiceUrl(p.invoice_id);
      window.open(url, "_blank");
    } catch (e) {
      toast.error(e?.message ?? "Download failed");
    } finally {
      setBusy(null);
    }
  };
  const handlePreview = async (p) => {
    if (!p.invoice_id) return toast.error("Invoice not generated yet.");
    try {
      setBusy(`pv-${p.id}`);
      const { url } = await previewFn({ data: { invoiceId: p.invoice_id } });
      window.open(url, "_blank");
    } catch (e) {
      toast.error(e?.message ?? "Preview failed");
    } finally {
      setBusy(null);
    }
  };
  const handlePrint = async (p) => {
    if (!p.invoice_id) return toast.error("Invoice not generated yet.");
    try {
      setBusy(`pr-${p.id}`);
      const url = await openInvoiceUrl(p.invoice_id);
      const w = window.open(url, "_blank");
      setTimeout(() => {
        try {
          w?.print();
        } catch {
        }
      }, 1200);
    } catch (e) {
      toast.error(e?.message ?? "Print failed");
    } finally {
      setBusy(null);
    }
  };
  const handleResend = async (p) => {
    try {
      setBusy(`mail-${p.id}`);
      await resendFn({ data: { paymentId: p.id } });
      toast.success("Invoice email queued with PDF attached.");
    } catch (e) {
      toast.error(e?.message ?? "Email failed");
    } finally {
      setBusy(null);
    }
  };
  const handleRegen = async (p) => {
    try {
      setBusy(`gen-${p.id}`);
      if (p.invoice_id) await regenFn({ data: { invoiceId: p.invoice_id } });
      else await resendFn({ data: { paymentId: p.id } });
      toast.success("Invoice PDF regenerated.");
    } catch (e) {
      toast.error(e?.message ?? "Regenerate failed");
    } finally {
      setBusy(null);
    }
  };
  const handleReplaceClick = (invoiceId) => {
    replaceTargetRef.current = invoiceId;
    fileInputRef.current?.click();
  };
  const handleReplaceFile = async (e) => {
    const file = e.target.files?.[0];
    const invoiceId = replaceTargetRef.current;
    e.target.value = "";
    if (!file || !invoiceId) return;
    if (file.type !== "application/pdf") return toast.error("Please choose a PDF file.");
    if (file.size > 4 * 1024 * 1024) return toast.error("PDF must be under 4 MB.");
    try {
      setBusy(`rp-${invoiceId}`);
      const buf = await file.arrayBuffer();
      let bin = "";
      const u = new Uint8Array(buf);
      for (let i = 0; i < u.length; i++) bin += String.fromCharCode(u[i]);
      const b64 = btoa(bin);
      await replaceFn({ data: { invoiceId, fileBase64: b64, filename: file.name } });
      toast.success("Invoice PDF replaced.");
    } catch (e2) {
      toast.error(e2?.message ?? "Replace failed");
    } finally {
      setBusy(null);
      replaceTargetRef.current = null;
    }
  };
  const emailBadge = (p) => {
    const s = p.invoice_delivery_status ?? p.invoice_last_email_status;
    if (!s) return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 text-[10px]", children: "—" });
    const color = s === "sent" || s === "delivered" ? "bg-emerald-100 text-emerald-700" : s === "failed" || s === "bounced" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: `text-[10px] ${color}`, children: s });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-white p-5", style: { borderColor: "var(--admin-border)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileInputRef, type: "file", accept: "application/pdf", hidden: true, onChange: handleReplaceFile }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "size-4 text-slate-600" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Payments & Invoices" })
    ] }),
    paidPayments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-slate-500 italic", children: "No paid invoices recorded." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-slate-500 uppercase tracking-wider", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-1.5", children: "Payment Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Amount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Gateway" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Invoice No" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Inv. Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "PDF" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: paidPayments.map((p) => {
        const amt = Number(p.amount || 0);
        const isRefund = amt < 0;
        const isTopUp = !isRefund && !!p.parent_payment_id;
        const isPaid = String(p.status).toLowerCase() === "paid" && !isRefund;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: `border-t ${isRefund ? "bg-rose-50/50" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-1.5 text-slate-600", children: fmtDate(p.payment_date ?? p.created_at) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: `font-medium ${isRefund ? "text-rose-700" : "text-slate-800"}`, children: [
            isRefund ? "Refund · " : isTopUp ? "Top-up · " : "",
            "Rs. ",
            Math.abs(amt).toLocaleString("en-IN")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-slate-600 capitalize", children: p.gateway_name ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "font-mono text-[10px]", children: [
            p.invoice_number ?? "—",
            p.invoice_gstin && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold text-emerald-700", children: [
              "GSTIN: ",
              p.invoice_gstin
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-slate-600", children: fmtDate(p.invoice_issued_at) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: p.has_pdf ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-emerald-100 text-emerald-700 text-[10px]", children: "Ready" }) : isPaid ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "bg-amber-100 text-amber-700 text-[10px]", children: "Pending" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 text-[10px]", children: "—" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: emailBadge(p) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-right", children: isPaid ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { title: "Preview", icon: Eye, loading: busy === `pv-${p.id}`, onClick: () => handlePreview(p) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { title: "Download", icon: Download, loading: busy === `dl-${p.id}`, onClick: () => handleDownload(p) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { title: "Print", icon: Printer, loading: busy === `pr-${p.id}`, onClick: () => handlePrint(p) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { title: "Email again", icon: Mail, loading: busy === `mail-${p.id}`, onClick: () => handleResend(p) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { title: "Regenerate", icon: RefreshCw, loading: busy === `gen-${p.id}`, onClick: () => handleRegen(p) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { title: p.invoice_gstin ? "Edit GSTIN" : "Add GSTIN", icon: Receipt, loading: busy === `gst-${p.id}`, disabled: !p.invoice_id, onClick: () => handleGstin(p) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { title: "Replace PDF", icon: Replace, loading: busy === `rp-${p.invoice_id}`, disabled: !p.invoice_id, onClick: () => p.invoice_id && handleReplaceClick(p.invoice_id) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(IconBtn, { title: "History", icon: History, disabled: !p.invoice_id, onClick: () => p.invoice_id && setHistoryId(p.invoice_id) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center gap-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "h-7 px-2 text-[10px]",
              disabled: busy === `rec-${p.id}`,
              onClick: async () => {
                try {
                  setBusy(`rec-${p.id}`);
                  const r = await reconcileFn({ data: { paymentId: p.id } });
                  if (r.status === "paid") toast.success("Payment verified & marked paid. Invoice + email queued.");
                  else if (r.status === "failed") toast.error("Gateway confirmed this payment failed.");
                  else toast.info(`Still pending at gateway (status: ${r.status}).`);
                } catch (e) {
                  toast.error(e?.message ?? "Verify failed");
                } finally {
                  setBusy(null);
                }
              },
              title: "Ask the payment gateway for the authoritative status",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-3 mr-1" }),
                " Verify"
              ]
            }
          ) }) })
        ] }, p.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(InvoiceHistoryDrawer, { invoiceId: historyId, open: !!historyId, onOpenChange: (v) => !v && setHistoryId(null) })
  ] });
}
function IconBtn({
  icon: Icon,
  title,
  onClick,
  loading,
  disabled
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Button,
    {
      size: "sm",
      variant: "outline",
      className: "h-7 px-2",
      disabled: !!loading || !!disabled,
      onClick,
      title,
      "aria-label": title,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-3.5" })
    }
  );
}
function ButtonActionTag({ code, label, variant = "blue" }) {
  const variantStyles = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    violet: "bg-purple-50 text-purple-700 border-purple-200",
    sky: "bg-sky-50 text-sky-700 border-sky-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200"
  };
  const cls = variantStyles[variant] || variantStyles.blue;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center gap-1 font-sans text-[10.5px] font-semibold px-2 py-0.5 rounded-md border shadow-2xs ${cls}`, children: code ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold tracking-tight", children: code }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-40", children: "·" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }) });
}
function resolveEventButtonTag(e) {
  const et = String(e.event_type || "").toLowerCase();
  const nv = String(e.new_value || "").toLowerCase();
  const note = String(e.note || e.remarks || "").toLowerCase();
  if (et === "application_completed" || et === "complete_with_cert" || nv === "order_completed" || nv === "completed" || note.includes("application accepted")) {
    return { code: "B07", label: "App Accepted", variant: "emerald" };
  }
  if (et === "consultation_completed" || et === "consultation_done" || nv === "consultation_completed" || note.includes("consultation done") || note.includes("consultation completed")) {
    return { code: "B06", label: "Consultation Done", variant: "violet" };
  }
  if (et === "submitted_to_govt" || et === "application_submitted" || nv === "submitted_to_govt" || nv === "application_submitted" || note.includes("submitted to govt")) {
    return { code: "B05", label: "Submitted to Govt", variant: "violet" };
  }
  if (et === "govt_rejected" || et === "application_rejected" || nv === "application_rejected" || note.includes("application rejected") || note.includes("govt rejected")) {
    return { code: "B08", label: "App Rejected", variant: "rose" };
  }
  if (et === "technical_delay" || et === "technical_hold" || nv === "technical_delay" || nv === "technical_hold" || note.includes("technical delay") && !note.includes("resolved")) {
    return { code: "B02", label: "Technical Delay", variant: "sky" };
  }
  if (et === "technical_delay_resumed" || et === "resume_technical_delay" || et === "issue_resolved" || note.includes("issue resolved") || note.includes("technical delay resolved")) {
    return { code: "B03", label: "Issue Resolved", variant: "emerald" };
  }
  if (et === "customer_delay_resumed" || et === "resume_customer_delay" || note.includes("customer responded")) {
    return { code: "B04", label: "Resume Order", variant: "emerald" };
  }
  if (et === "customer_delay" || et === "customer_hold" || nv === "customer_delay" || nv === "customer_hold" || note.includes("customer delay")) {
    return { code: "B04", label: "Customer Delay", variant: "amber" };
  }
  if (et === "form_not_submitted" || et === "form_link_sent" || note.includes("form link sent") || note.includes("form not submitted")) {
    return { code: "B01", label: "Form Not Submitted Delay", variant: "amber" };
  }
  if (et === "order_reopened" || nv === "order_reopened" || note.includes("order reopened")) {
    return { code: "B09", label: "Reopen Order", variant: "indigo" };
  }
  if (et === "order_closed" || et === "workflow_closed" || nv === "order_closed" || nv === "closed" || note.includes("order closed")) {
    return { code: "B10", label: "Force Close", variant: "rose" };
  }
  if (et === "callback_completed") {
    return { label: "Callback Completed", variant: "emerald" };
  }
  if (et === "callback_scheduled" || et === "callback_rescheduled") {
    return { label: "Add Task / Follow-up", variant: "violet" };
  }
  if (et === "service_changed" || note.includes("service changed")) {
    return { label: "Change Service", variant: "blue" };
  }
  if (et === "refund_rejected" || note.includes("refund rejected")) {
    return { label: "Refund Rejected (R002)", variant: "rose" };
  }
  if (et === "refund_approved" || et === "refund_processed" || note.includes("refund approved")) {
    return { label: "Refund Approved", variant: "slate" };
  }
  if (et.includes("refund")) {
    return { label: "Refund", variant: "rose" };
  }
  if (et === "certificate_uploaded" || note.includes("certificate uploaded")) {
    return { label: "Upload Certificate", variant: "emerald" };
  }
  if (et === "document_uploaded" || note.includes("document uploaded")) {
    return { label: "Upload Document", variant: "violet" };
  }
  return null;
}
function resolveEmailButtonTag(templateCode) {
  if (!templateCode) return null;
  const tc = templateCode.toUpperCase();
  if (tc === "E007" || tc === "BHS_E007") return { code: "B07", label: "App Accepted", variant: "emerald" };
  if (tc === "E006" || tc === "BHS_E006") return { code: "B05", label: "Submitted to Govt", variant: "violet" };
  if (tc === "E005" || tc === "BHS_E005") return { code: "B06", label: "Consultation Done", variant: "violet" };
  if (tc === "E003" || tc === "BHS_E003") return { code: "B02", label: "Technical Delay", variant: "sky" };
  if (tc === "E004" || tc === "BHS_E004") return { code: "B04", label: "Customer Delay", variant: "amber" };
  if (tc === "E002" || tc === "BHS_E002") return { code: "B01", label: "Form Not Submitted Delay", variant: "amber" };
  if (tc === "E011" || tc === "BHS_E011") return { code: "B03", label: "Issue Resolved", variant: "emerald" };
  if (tc === "E008" || tc === "BHS_E008") return { code: "B08", label: "App Rejected", variant: "rose" };
  if (tc === "E009" || tc === "E09" || tc === "BHS_E009") return { code: "B09", label: "Reopen Order", variant: "indigo" };
  if (tc === "E010" || tc === "BHS_E010") return { code: "B10", label: "Force Close", variant: "rose" };
  if (tc === "R002" || tc === "BHS_R002") return { label: "Refund Rejected (R002)", variant: "rose" };
  if (tc === "E012" || tc === "BHS_E012") return { label: "Change Service", variant: "blue" };
  if (tc === "E013" || tc === "BHS_E013") return { label: "Payment Received", variant: "emerald" };
  if (tc === "R001" || tc === "BHS_R001") return { label: "Refund Approved", variant: "slate" };
  return null;
}
function resolveWorkflowButtonTag(w) {
  const type = String(w.event_type ?? "");
  if (type === "callback_scheduled") return { label: "Add Task / Follow-up", variant: "violet" };
  if (type === "GovApproved" || type === "CertificateUploaded") return { code: "B07", label: "App Accepted", variant: "emerald" };
  if (type === "GovRejected") return { code: "B08", label: "App Rejected", variant: "rose" };
  if (type === "OrderClosed") return { code: "B10", label: "Force Close", variant: "rose" };
  if (type === "TechnicalDelay") return { code: "B02", label: "Technical Delay", variant: "sky" };
  if (type === "CustomerDelay") return { code: "B04", label: "Customer Delay", variant: "amber" };
  return null;
}
const TONE = {
  blue: { ring: "#bfdbfe", bg: "#eff6ff", fg: "#1d4ed8" },
  emerald: { ring: "#a7f3d0", bg: "#ecfdf5", fg: "#047857" },
  violet: { ring: "#ddd6fe", bg: "#f5f3ff", fg: "#6d28d9" },
  amber: { ring: "#fde68a", bg: "#fffbeb", fg: "#b45309" },
  slate: { ring: "#e2e8f0", bg: "#f8fafc", fg: "#475569" },
  rose: { ring: "#fecaca", bg: "#fff1f2", fg: "#be123c" }
};
function stripReply(s) {
  if (!s) return "";
  return String(s).replace(/^\s*(re|fwd|fw)\s*:\s*/i, "");
}
function UnifiedTimeline({ events, payments, documents, emailLogs, createdAt, hideMoney, applicationId }) {
  const [showAll, setShowAll] = reactExports.useState(false);
  const wf = useOrderWorkflow(applicationId ?? null);
  const workflowEvents = applicationId ? wf.events : [];
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const assigneeIds = Array.from(new Set(
    (events ?? []).filter((e) => e.event_type === "assignment_change").flatMap((e) => [e.old_value, e.new_value]).filter((v) => typeof v === "string" && UUID_RE.test(v))
  )).sort();
  const { data: staffNames } = useQuery({
    queryKey: ["timeline-staff-names", assigneeIds],
    enabled: assigneeIds.length > 0,
    staleTime: 10 * 6e4,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("id, full_name, display_name, email").in("id", assigneeIds);
      const m = {};
      for (const p of data ?? []) m[p.id] = p.display_name || p.full_name || p.email || p.id;
      return m;
    }
  });
  const nameOf = (v) => v ? staffNames?.[v] ?? v : "Unassigned";
  const items = reactExports.useMemo(() => {
    const out = [];
    out.push({
      id: `created-${createdAt}`,
      ts: createdAt,
      icon: GitCommitHorizontal,
      tone: "blue",
      title: "Order created"
    });
    for (const p of payments ?? []) {
      const amt = Number(p.amount || 0);
      const isRefund = amt < 0 || p.status === "refunded";
      const amountStr = hideMoney ? "₹••••" : `₹${Math.abs(amt).toLocaleString("en-IN")}`;
      out.push({
        id: `pay-${p.id}`,
        ts: p.payment_date || p.created_at,
        icon: CreditCard,
        tone: isRefund ? "rose" : "emerald",
        title: isRefund ? "Refund processed" : "Payment received",
        detail: `${amountStr} · ${p.gateway_name ?? "—"} · ${String(p.status).replace(/_/g, " ")}`,
        buttonTag: isRefund ? { label: "Refund", variant: "rose" } : { label: "Payment Paid", variant: "emerald" }
      });
    }
    for (const d of documents ?? []) {
      const isCert = d.doc_type === "certificate";
      out.push({
        id: `doc-${d.id}`,
        ts: d.uploaded_at || d.created_at,
        icon: isCert ? FileCheckCorner : Upload,
        tone: isCert ? "emerald" : "violet",
        title: isCert ? "Certificate uploaded" : "Document uploaded",
        detail: `${d.doc_type?.replace(/_/g, " ")} · ${d.file_name}`,
        buttonTag: isCert ? { label: "Upload Certificate", variant: "emerald" } : { label: "Upload Document", variant: "violet" }
      });
    }
    const emailEventIds = /* @__PURE__ */ new Set();
    for (const l of emailLogs ?? []) {
      const status = String(l.status ?? "").toLowerCase();
      const failed = ["failed", "bounced", "dlq"].includes(status);
      const tone = failed ? "rose" : status === "sent" ? "blue" : "amber";
      const label = failed ? "Email failed" : status === "sent" ? "Email sent" : `Email ${status || "queued"}`;
      out.push({
        id: `mail-${l.id}`,
        ts: l.sent_at || l.created_at,
        icon: Mail,
        tone,
        title: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          label,
          l.template_code && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 font-mono text-[10.5px] px-1 py-0.5 rounded bg-slate-100 text-slate-600", children: l.template_code }),
          !l.template_code && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 font-mono text-[10.5px] px-1 py-0.5 rounded bg-rose-50 text-rose-700", children: "NO_TEMPLATE" }),
          l.template_exists === false && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 text-[10.5px] px-1 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200", children: "unmatched" })
        ] }),
        detail: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-700", children: stripReply(l.subject) || "(no subject)" }),
          l.to_email && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-slate-500", children: [
            "To ",
            l.to_email
          ] }),
          failed && l.error_message && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-rose-600", children: [
            "Error: ",
            String(l.error_message).slice(0, 200)
          ] })
        ] }),
        buttonTag: resolveEmailButtonTag(l.template_code)
      });
    }
    for (const e of events ?? []) {
      let icon = Activity;
      let tone = "slate";
      let title = String(e.event_type).replace(/_/g, " ");
      let detail = null;
      if (e.event_type === "status_change") {
        icon = GitCommitHorizontal;
        tone = "blue";
        title = /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Status changed ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-60", children: "·" }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px] opacity-80", children: e.old_value ?? "—" }),
          " → ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px]", children: e.new_value })
        ] });
      } else if (e.event_type === "assignment_change") {
        icon = UserCog;
        tone = "violet";
        title = "Assignee updated";
        detail = e.old_value || e.new_value ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px]", children: [
          nameOf(e.old_value),
          " → ",
          nameOf(e.new_value)
        ] }) : null;
      } else if (e.event_type === "note_added") {
        icon = MessageSquare;
        tone = "amber";
        title = "Internal note";
        detail = /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "whitespace-pre-wrap", children: e.note });
      } else if (e.event_type === "email_sent") {
        emailEventIds.add(String(e.id));
        continue;
      } else if (e.event_type === "document_uploaded") {
        icon = Upload;
        tone = "violet";
        title = "Document uploaded";
      } else if (e.event_type === "certificate_uploaded") {
        icon = FileCheckCorner;
        tone = "emerald";
        title = "Certificate uploaded";
      } else if (e.event_type === "application_completed" || e.event_type === "complete_with_cert") {
        icon = FileCheckCorner;
        tone = "emerald";
        title = "Application completed";
      } else if (e.event_type === "form_submitted") {
        icon = FileText;
        tone = "emerald";
        title = "Form submitted";
      } else if (e.event_type === "callback_scheduled") {
        icon = PhoneCall;
        tone = "violet";
        title = "Callback scheduled";
        detail = /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "whitespace-pre-wrap text-[11px] font-medium text-slate-700", children: e.note });
      } else if (e.event_type === "callback_completed") {
        icon = PhoneCall;
        tone = "emerald";
        title = "Callback completed";
        detail = /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "whitespace-pre-wrap text-[11px] font-medium text-slate-700", children: e.note });
      }
      if (e.note && !detail) detail = /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "whitespace-pre-wrap text-[11px]", children: e.note });
      out.push({
        id: `ev-${e.id}`,
        ts: e.created_at,
        icon,
        tone,
        title,
        detail,
        actor: e.staff_name ?? null,
        buttonTag: resolveEventButtonTag(e)
      });
    }
    for (const w of workflowEvents ?? []) {
      const type = String(w.event_type ?? "");
      let icon = Cog;
      let tone = "violet";
      let title = w.title ?? type.replaceAll("_", " ");
      if (type === "callback_scheduled") {
        icon = PhoneCall;
        tone = "violet";
        title = w.title || "Callback scheduled";
      } else if (type === "FormTimeout5m" || type === "FormTimeout8h" || type === "ClosureTimerFired" || type === "ReminderFired") {
        icon = AlarmClock;
        tone = "amber";
        const kind = type === "ClosureTimerFired" ? "closure" : type === "ReminderFired" ? "reminder" : "incomplete_form";
        title = /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Timer fired · ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px]", children: TIMER_LABEL[kind] ?? kind })
        ] });
      } else if (type === "email_sent" || type === "email_failed" || type === "email_skipped") {
        continue;
      } else if (type === "OrderClosed" || type === "GovApproved" || type === "GovRejected" || type === "CertificateUploaded") {
        icon = GitCommitHorizontal;
        tone = type === "GovRejected" ? "rose" : "emerald";
      } else if (w.metadata?.event?.type) {
        const evtType = String(w.metadata.event.type);
        title = /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Workflow · ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px]", children: evtType })
        ] });
      }
      out.push({
        id: `wf-${w.id}`,
        ts: w.created_at,
        icon,
        tone,
        title,
        detail: w.description ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "whitespace-pre-wrap text-[11px]", children: w.description }) : w.metadata?.event?.type && w.title !== w.metadata.event.type ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-slate-500", children: w.title }) : null,
        actor: w.actor_name ?? (w.is_system ? "System" : null),
        buttonTag: resolveWorkflowButtonTag(w)
      });
    }
    out.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
    return out;
  }, [events, payments, documents, emailLogs, createdAt, hideMoney, workflowEvents, staffNames]);
  const visible = showAll ? items : items.slice(0, 12);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-white p-5", style: { borderColor: "var(--admin-border)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "size-4", style: { color: "var(--admin-fg-muted)" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Timeline" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "text-[10px] px-1.5 py-0.5 rounded-md font-medium",
          style: { background: "var(--admin-surface-2)", color: "var(--admin-fg-muted)" },
          children: items.length
        }
      )
    ] }) }),
    visible.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs italic", style: { color: "var(--admin-fg-muted)" }, children: "No activity yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          "aria-hidden": true,
          className: "absolute left-[14px] top-2 bottom-2 w-px",
          style: { background: "var(--admin-border)" }
        }
      ),
      visible.map((it) => {
        const tone = TONE[it.tone];
        const Icon = it.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "relative pl-9 pb-4 last:pb-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "absolute left-0 top-0 size-[30px] rounded-full flex items-center justify-center border-2",
              style: { background: tone.bg, color: tone.fg, borderColor: tone.ring },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[13px] leading-snug flex items-center justify-between gap-2 flex-wrap font-medium", style: { color: "var(--admin-fg)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: it.title }),
            it.buttonTag && /* @__PURE__ */ jsxRuntimeExports.jsx(ButtonActionTag, { code: it.buttonTag.code, label: it.buttonTag.label, variant: it.buttonTag.variant })
          ] }) }),
          it.detail && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs mt-0.5", style: { color: "var(--admin-fg-muted)" }, children: it.detail }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10.5px] mt-1", style: { color: "var(--admin-fg-subtle)" }, children: [
            formatIST(it.ts),
            it.actor && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              " · by ",
              it.actor
            ] })
          ] })
        ] }, it.id);
      })
    ] }),
    items.length > 12 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => setShowAll((v) => !v),
        className: "mt-3 text-xs font-medium text-blue-600 hover:underline",
        children: showAll ? "Show less" : `Show ${items.length - 12} earlier events`
      }
    )
  ] });
}
const listLeadEmails = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator(object({
  leadId: string().uuid()
})).handler(createSsrRpc("868b6920182a334ad84e6e0896f18feea08ccd9b69e0fad1f044a6ce276c3337"));
const SendEmailSchema = object({
  leadId: string().uuid(),
  templateCode: string(),
  variables: record(string(), any()),
  toEmail: string().email().optional()
});
const sendLeadEmail = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => SendEmailSchema.parse(i)).handler(createSsrRpc("c6977c6a5c7e6e9f6eec748213346d3cb5b868338abc225d32707e116867bb11"));
function LeadEmailsTab({ leadId, leadService, orderId }) {
  const qc = useQueryClient();
  const listFn = useServerFn(listLeadEmails);
  const sendFn = useServerFn(sendLeadEmail);
  useRealtimeTable("email_logs", () => qc.invalidateQueries({ queryKey: ["admin.lead.emails", leadId] }), {
    filter: `lead_id=eq.${leadId}`
  });
  useRealtimeTable("email_queue", () => qc.invalidateQueries({ queryKey: ["admin.lead.emails", leadId] }), {
    filter: `lead_id=eq.${leadId}`
  });
  const { data, isLoading } = useQuery({
    queryKey: ["admin.lead.emails", leadId],
    queryFn: () => listFn({ data: { leadId } })
  });
  const [sendOpen, setSendOpen] = reactExports.useState(false);
  const [sending, setSending] = reactExports.useState(false);
  const getInitialServiceKey = () => {
    const s = leadService.toLowerCase();
    if (s.includes("new")) return "new_udyam";
    if (s.includes("update")) return "update_udyam";
    if (s.includes("download")) return "download_udyam";
    if (s.includes("migrate")) return "migrate_udyam";
    if (s.includes("forgot")) return "forgot_contact";
    if (s.includes("correct")) return "correct_pan";
    return "talk_expert";
  };
  const [serviceKey, setServiceKey] = reactExports.useState(getInitialServiceKey());
  const handleSend = async () => {
    setSending(true);
    try {
      await sendFn({
        data: {
          leadId,
          templateCode: "client-info-request",
          variables: { serviceKey }
        }
      });
      toast.success("Email queued for delivery");
      setSendOpen(false);
      qc.invalidateQueries({ queryKey: ["admin.lead.emails", leadId] });
      if (orderId) qc.invalidateQueries({ queryKey: ["admin.order", orderId] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send email");
    } finally {
      setSending(false);
    }
  };
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-6 h-6 animate-spin mx-auto" }) });
  const pick = (...vals) => vals.find((v) => typeof v === "string" && v.trim() !== "") ?? null;
  const queueById = /* @__PURE__ */ new Map();
  for (const q of data?.queue || []) queueById.set(q.id, q);
  const logByQueueId = /* @__PURE__ */ new Map();
  for (const l of data?.logs || []) if (l.queue_id) logByQueueId.set(l.queue_id, l);
  const dedupMap = /* @__PURE__ */ new Map();
  const ccOf = (q) => {
    const raw = q?.variables?.__cc;
    if (!raw) return null;
    const list = Array.isArray(raw) ? raw : String(raw).split(/[,;\s]+/);
    const out = list.map((s) => String(s).trim()).filter(Boolean);
    return out.length ? out.join(", ") : null;
  };
  for (const q of data?.queue || []) {
    const l = logByQueueId.get(q.id);
    dedupMap.set(`q:${q.id}`, l ? { ...q, cc_email: ccOf(q), body_html: pick(q.body_html, l.body_html), body_text: pick(q.body_text, l.body_text) } : { ...q, cc_email: ccOf(q) });
  }
  for (const l of data?.logs || []) {
    const key = l.queue_id ? `q:${l.queue_id}` : `l:${l.id}`;
    const q = l.queue_id ? queueById.get(l.queue_id) : null;
    const merged = q ? { ...l, cc_email: ccOf(q), body_html: pick(l.body_html, q.body_html), body_text: pick(l.body_text, q.body_text) } : l;
    dedupMap.set(key, merged);
  }
  const history = Array.from(dedupMap.values()).sort(
    (a, b) => new Date(b.sent_at || b.created_at || 0).getTime() - new Date(a.sent_at || a.created_at || 0).getTime()
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "w-4 h-4" }),
        " Email History"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: sendOpen, onOpenChange: setSendOpen, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4" }),
          " Send Email"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Send Client Info Request" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Select Template Variant" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: serviceKey, onValueChange: setServiceKey, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select variant" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "new_udyam", children: "New Udyam Registration" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "update_udyam", children: "Update Udyam Certificate" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "download_udyam", children: "Download Udyam Certificate" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "migrate_udyam", children: "Udyog Aadhaar to Udyam Migration" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "forgot_contact", children: "Forgot Mobile / Email Recovery" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "correct_pan", children: "PAN / Aadhaar Correction" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "talk_expert", children: "Talk to Expert" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "This uses the high-converting template you provided. Pre-fills order number, name, and form link." })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setSendOpen(false), disabled: sending, children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleSend, disabled: sending, children: [
              sending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-4 h-4 mr-2" }),
              "Queue Email"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ManualTemplateSender, { leadId, orderId })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border rounded-md overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-8" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Subject" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Recipient" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Date" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: history.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 5, className: "text-center py-8 text-muted-foreground", children: "No emails sent yet." }) }) : history.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(EmailRow, { item }, item.id)) })
    ] }) })
  ] });
}
function stripReplyPrefix(s) {
  if (!s) return "";
  return String(s).replace(/^\s*(re|fwd|fw)\s*:\s*/i, "");
}
function EmailRow({ item }) {
  const [open, setOpen] = reactExports.useState(false);
  const isFailure = ["failed", "bounced", "dlq"].includes(String(item.status || "").toLowerCase());
  const err = isFailure ? item.error_message || item.last_error || item.smtp_response : null;
  const providerNote = !isFailure && item.smtp_response ? String(item.smtp_response) : null;
  const bodyHtml = item.body_html;
  const bodyText = item.body_text;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "cursor-pointer hover:bg-slate-50", onClick: () => setOpen((v) => !v), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "w-8", children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4 text-slate-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 text-slate-400" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { status: item.status }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "max-w-xs font-medium", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate", children: stripReplyPrefix(item.subject) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 flex items-center gap-1.5 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-slate-500 truncate", children: item.template_code || "NO_TEMPLATE" }),
          item.template_exists === false && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 rounded bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold text-rose-700 border border-rose-200", children: "unmatched" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: item.to_email }),
        item.cc_email && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground", children: [
          "CC: ",
          item.cc_email
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs text-muted-foreground", children: new Date(item.sent_at || item.created_at || Date.now()).toLocaleString("en-IN") })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 5, className: "bg-slate-50/60 p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MetaCell, { label: "From", value: item.from_email || "system default" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MetaCell, { label: "To", value: item.to_email }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MetaCell, { label: "CC", value: item.cc_email || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MetaCell, { label: "Template", value: item.template_code || "—", mono: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MetaCell, { label: "Template Match", value: item.template_exists === false ? "Missing from Email Templates" : "Matched" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MetaCell, { label: "Attempts", value: String(item.attempt ?? item.attempts ?? 1) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MetaCell, { label: "Message ID", value: item.message_id || "—", mono: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MetaCell, { label: "Direction", value: item.direction || "outbound" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MetaCell, { label: "Queued", value: item.created_at ? new Date(item.created_at).toLocaleString("en-IN") : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MetaCell, { label: "Sent", value: item.sent_at ? new Date(item.sent_at).toLocaleString("en-IN") : "—" })
      ] }),
      err && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-rose-200 bg-rose-50 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[11px] font-bold text-rose-700 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3.5 h-3.5" }),
          " Delivery error"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "text-[11px] text-rose-900 whitespace-pre-wrap font-mono", children: err })
      ] }),
      providerNote && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-emerald-200 bg-emerald-50 p-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider font-bold text-emerald-700 mb-0.5", children: "Provider response" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "text-[11px] text-emerald-900 whitespace-pre-wrap font-mono", children: providerNote })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5", children: "Email body" }),
        bodyHtml ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-slate-200 bg-white overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "iframe",
          {
            title: `email-${item.id}`,
            srcDoc: bodyHtml,
            sandbox: "",
            className: "w-full min-h-[360px] bg-white"
          }
        ) }) : bodyText ? /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "rounded-md border border-slate-200 bg-white p-3 text-[12px] whitespace-pre-wrap", children: bodyText }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[12px] text-slate-500 italic", children: "No body captured for this record." })
      ] })
    ] }) }) })
  ] });
}
function MetaCell({ label, value, mono }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase tracking-wider font-bold text-slate-500 mb-0.5", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-[11px] text-slate-800 break-all ${mono ? "font-mono" : ""}`, children: value })
  ] });
}
function StatusIcon({ status }) {
  switch (status) {
    case "sent":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-emerald-600 bg-emerald-50 border-emerald-200 gap-1 font-medium", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3" }),
        " Sent"
      ] });
    case "failed":
    case "bounced":
    case "dlq":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-rose-600 bg-rose-50 border-rose-200 gap-1 font-medium", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3 h-3" }),
        " Failed"
      ] });
    case "queued":
    case "sending":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-amber-600 bg-amber-50 border-amber-200 gap-1 font-medium", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
        " ",
        status
      ] });
    default:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: status });
  }
}
function ManualTemplateSender({ leadId, orderId }) {
  const qc = useQueryClient();
  const listTpl = useServerFn(listEmailTemplates);
  const sendTpl = useServerFn(sendOrderTemplateEmail);
  const [open, setOpen] = reactExports.useState(false);
  const [code, setCode] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const { data } = useQuery({
    queryKey: ["admin.email-templates.picker"],
    queryFn: () => listTpl({ data: {} }),
    enabled: open
  });
  const rows = (data?.rows ?? []).filter((r) => r.is_enabled);
  const submit = async () => {
    if (!code) return;
    setBusy(true);
    try {
      await sendTpl({ data: { leadId, templateCode: code } });
      toast.success("Email queued for delivery");
      setOpen(false);
      setCode("");
      qc.invalidateQueries({ queryKey: ["admin.lead.emails", leadId] });
      if (orderId) qc.invalidateQueries({ queryKey: ["admin.order", orderId] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to send");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "gap-2 ml-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-4 h-4" }),
      " Send Template"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Send a template to this customer" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Template" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: code, onValueChange: setCode, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Choose a template…" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "max-h-80", children: rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r.code, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
            r.sr_no != null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] text-slate-500", children: [
              "#",
              r.sr_no
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: r.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] rounded-full px-1.5 py-0.5 ${r.dispatch_mode === "manual" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-700"}`, children: r.dispatch_mode === "manual" ? "Manual" : "Auto" })
          ] }) }, r.code)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Manual-dispatch templates are never sent automatically. Use this to send them (or any other template) with this order's context filled in." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setOpen(false), disabled: busy, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: submit, disabled: busy || !code, children: [
          busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4 mr-2" }),
          "Send now"
        ] })
      ] })
    ] })
  ] });
}
function RefundRequestDialog({
  applicationId,
  open,
  onClose
}) {
  const qc = useQueryClient();
  const fn = useServerFn(createRefundRequest);
  const [reason, setReason] = reactExports.useState("");
  const [reasonCode, setReasonCode] = reactExports.useState("changed_mind");
  const [amount, setAmount] = reactExports.useState("");
  const [mode, setMode] = reactExports.useState("full");
  const [notes, setNotes] = reactExports.useState("");
  const mut = useMutation({
    mutationFn: async () => fn({
      data: {
        applicationId,
        reason: reason || void 0,
        reasonCode: reasonCode || void 0,
        customerNotes: notes || void 0,
        refundAmount: amount ? Number(amount) : void 0,
        refundMode: mode
      }
    }),
    onSuccess: () => {
      toast.success("Refund request created — moved to Refund Review.");
      qc.invalidateQueries({ queryKey: ["workflow-events", applicationId] });
      qc.invalidateQueries({ queryKey: ["order-detail-v2", applicationId] });
      qc.invalidateQueries({ queryKey: ["refund-requests"] });
      qc.invalidateQueries({ queryKey: ["refund-stats"] });
      onClose();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed")
  });
  if (!open) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 grid place-items-center bg-black/60 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md rounded-lg border bg-card p-5 shadow-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "Raise refund request" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, "aria-label": "Close", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4 text-muted-foreground" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setMode("full"),
            className: `rounded-md border px-3 py-1.5 text-xs ${mode === "full" ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`,
            children: "Full refund"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setMode("partial"),
            className: `rounded-md border px-3 py-1.5 text-xs ${mode === "partial" ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`,
            children: "Partial refund"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "Reason category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: reasonCode,
            onChange: (e) => setReasonCode(e.target.value),
            className: "mt-1 w-full rounded-md border bg-background px-2 py-1.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "changed_mind", children: "Customer changed mind" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "duplicate_payment", children: "Duplicate payment" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "service_not_delivered", children: "Service not delivered" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "wrong_service", children: "Wrong service selected" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "dissatisfied", children: "Dissatisfied with service" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "cannot_verify_identity", children: "Cannot verify identity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "other", children: "Other" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "Reason (short)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: reason,
            onChange: (e) => setReason(e.target.value),
            className: "mt-1 w-full rounded-md border bg-background px-2 py-1.5",
            placeholder: "Short reason from the customer"
          }
        )
      ] }),
      mode === "partial" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "Refund amount (₹)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: amount,
            onChange: (e) => setAmount(e.target.value),
            inputMode: "decimal",
            className: "mt-1 w-full rounded-md border bg-background px-2 py-1.5",
            placeholder: "e.g. 500"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] text-muted-foreground", children: "Finance can adjust the final amount + deductions at approval." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted-foreground", children: "Customer notes (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: notes,
            onChange: (e) => setNotes(e.target.value),
            rows: 3,
            className: "mt-1 w-full rounded-md border bg-background px-2 py-1.5",
            placeholder: "Anything the customer said / context for finance"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground", children: [
        "Status moves to ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Refund Review" }),
        ". Finance can approve, reject, request more info, or escalate from ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "/admin/refunds" }),
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex justify-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "rounded-md border px-3 py-1.5 text-sm", children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => mut.mutate(),
          disabled: mut.isPending || !reason.trim() || mode === "partial" && !amount,
          className: "rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground inline-flex items-center gap-2 disabled:opacity-50",
          children: [
            mut.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3 animate-spin" }),
            " Create request"
          ]
        }
      )
    ] })
  ] }) });
}
const QUICK_ACTIONS = [
  {
    key: "call",
    label: "Call",
    tooltip: "Dial the customer's mobile number",
    icon: Phone,
    tint: "emerald",
    build: ({ mobile }) => ({
      href: mobile ? `tel:${mobile}` : null,
      disabledReason: mobile ? null : "No mobile number on file",
      toastInfo: mobile ? `Opening dialer for ${mobile}` : void 0
    })
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    tooltip: "Open WhatsApp chat with the customer",
    icon: MessageCircle,
    tint: "emerald",
    build: ({ waUrl }) => ({
      href: waUrl,
      external: true,
      disabledReason: waUrl ? null : "No mobile number on file",
      toastInfo: waUrl ? "Opening WhatsApp…" : void 0
    })
  },
  {
    key: "email",
    label: "Email",
    tooltip: "Compose a new email to the customer",
    icon: Mail,
    tint: "sky",
    build: ({ email }) => ({
      href: email ? `mailto:${email}` : null,
      disabledReason: email ? null : "No email on file",
      toastInfo: email ? "Opening mail client…" : void 0
    })
  },
  {
    key: "open_lead",
    label: "Open Lead",
    tooltip: "Jump to the source lead for this order",
    icon: UserRound,
    tint: "violet",
    build: ({ leadId }) => ({
      to: leadId ? `/admin/leads/${leadId}` : null,
      disabledReason: leadId ? null : "No lead linked to this order",
      toastInfo: leadId ? "Opening lead…" : void 0
    })
  },
  {
    key: "print",
    label: "Print",
    tooltip: "Print this order page",
    icon: Printer,
    tint: "slate",
    build: () => ({ toastSuccess: "Print dialog opened" })
  }
];
function tabAvailability(status, hasLead, showConsultation) {
  const locked = status === "CLOSED" || status === "REFUND_PROCESSED";
  return {
    form: {
      enabled: !showConsultation && hasLead,
      reason: showConsultation ? "Available after service is picked and second payment is received" : !hasLead ? "No lead linked to this order yet" : ""
    },
    customer: { enabled: true, reason: "" },
    assignment: { enabled: true, reason: "" },
    emails: { enabled: hasLead, reason: hasLead ? "" : "No lead linked to this order" },
    invoices: { enabled: true, reason: "" },
    activity: { enabled: true, reason: "" },
    support: { enabled: !locked, reason: locked ? "Order is closed — no new tickets" : "" }
  };
}
const TAB_DEFS = [
  { id: "form", label: "Forms & Docs", icon: FileText, tooltip: "View the submitted service form and uploaded documents" },
  { id: "customer", label: "Customer Details", icon: UserRound, tooltip: "View customer info, contact details and quick actions" },
  { id: "assignment", label: "Assignment History", icon: History, tooltip: "View employee assignment transitions and history" },
  { id: "emails", label: "Emails", icon: Mail, tooltip: "All emails sent or received for this order" },
  { id: "invoices", label: "Invoices", icon: BadgeDollarSign, tooltip: "View, download, resend, or replace invoices for this order", moneyOnly: true },
  { id: "activity", label: "Timeline / Activity Log", icon: Activity, tooltip: "Full chronological activity log for this order" },
  { id: "support", label: "Internal Help / Support Ticket", icon: LifeBuoy, tooltip: "Raise or track internal tickets tied to this order" }
];
function WorkspaceShell(p) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const userPerms = usePermissions();
  const role = useRole();
  const isSuperAdmin = Boolean(p.data?.isSuperAdmin) || Boolean(p.data?.isAdmin) || role.hasAny(["super_admin", "admin", "superadmin", "super"]) || Boolean(userPerms.perms?.isAdmin);
  const isAdmin = isSuperAdmin || role.hasAny(["super_admin", "admin"]);
  const hideForEmployee = p.hideAmount || role.hideMoney();
  const [tab, setTab] = reactExports.useState("form");
  const [refundOpen, setRefundOpen] = reactExports.useState(false);
  const [adminOverride, setAdminOverride] = reactExports.useState(false);
  const [dialog, setDialog] = reactExports.useState(null);
  const { application, lead, customer, service, payments, paymentStatus, total, documents, events, emailLogs, stageMeta } = p.data;
  const timelineFn = useServerFn(getOrderTimelineEvents);
  const ticketsFn = useServerFn(getOrderTickets);
  const { data: timelineData } = useQuery({
    queryKey: ["admin.order.timeline", p.orderId],
    queryFn: () => timelineFn({ data: { orderId: p.orderId } }),
    enabled: tab === "activity",
    staleTime: 6e4
  });
  const { data: ticketsData } = useQuery({
    queryKey: ["admin.order.tickets", p.orderId, application?.customer_id],
    queryFn: () => ticketsFn({ data: { orderId: p.orderId, customerId: application?.customer_id ?? null } }),
    enabled: tab === "support",
    staleTime: 6e4
  });
  const govtPortalUrl = service?.govt_portal_url ?? null;
  const current = application.fulfillment_status ?? "order_received";
  const orderStatus = application.order_status ?? null;
  const meta = STAGE_META[p.stage];
  const availability = tabAvailability(orderStatus, !!lead?.id, p.showConsultationPanel);
  const hasServiceChanged = reactExports.useMemo(
    () => (events ?? []).some((e) => e?.event_type === "service_changed"),
    [events]
  );
  const reminderCount = reactExports.useMemo(
    () => (events ?? []).filter((e) => e?.type === "ReminderScheduled" || e?.type === "ReminderFired").length,
    [events]
  );
  const formLinkKey = `journey.b01Sent:${p.orderId}`;
  const [formLinkSent, setFormLinkSent] = reactExports.useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(formLinkKey) === "1";
    } catch {
      return false;
    }
  });
  const techResumeKey = `journey.b03Resumed:${p.orderId}`;
  const [techDelayResolved, setTechDelayResolved] = reactExports.useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(techResumeKey) === "1";
    } catch {
      return false;
    }
  });
  reactExports.useEffect(() => {
    const live2 = deriveJourneyLiveState({
      stage: p.stage,
      workflowStatus: application.workflow_status,
      closureStage: application.closure_stage,
      closureReasonLabel: application.closure_reason_code
    });
    const currentIdx = live2.currentMainIndex;
    if (formLinkSent && live2.activeSubKey !== "form-not-submitted") {
      try {
        window.localStorage.removeItem(formLinkKey);
      } catch {
      }
      setFormLinkSent(false);
    }
    if (techDelayResolved && (live2.activeSubKey === "technical-delay" || currentIdx >= 4)) {
      try {
        window.localStorage.removeItem(techResumeKey);
      } catch {
      }
      setTechDelayResolved(false);
    }
  }, [p.stage, application.workflow_status, application.closure_stage, application.closure_reason_code, formLinkSent, techDelayResolved, p.orderId]);
  reactExports.useEffect(() => {
    const handleStorageChange = () => {
      try {
        setFormLinkSent(window.localStorage.getItem(formLinkKey) === "1");
        setTechDelayResolved(window.localStorage.getItem(techResumeKey) === "1");
      } catch {
      }
    };
    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(handleStorageChange, 1e3);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [formLinkKey, techResumeKey]);
  reactExports.useMemo(() => derivePhase({
    stage: p.stage,
    workflowStatus: application.workflow_status,
    closureStage: application.closure_stage,
    closureReasonLabel: application.closure_reason_code,
    formLinkSent,
    techDelayResolved,
    adminOverride
  }), [p.stage, application.workflow_status, application.closure_stage, application.closure_reason_code, reminderCount, formLinkSent, techDelayResolved, adminOverride]);
  const live = reactExports.useMemo(() => deriveJourneyLiveState({
    stage: p.stage,
    workflowStatus: application.workflow_status,
    closureStage: application.closure_stage,
    closureReasonLabel: application.closure_reason_code
  }), [p.stage, application.workflow_status, application.closure_stage, application.closure_reason_code]);
  live.terminal === "closed";
  live.terminal === "completed";
  reactExports.useEffect(() => {
    if (!availability[tab].enabled) setTab("form");
  }, [availability, tab]);
  const invalidate = reactExports.useCallback(() => {
    qc.invalidateQueries({ queryKey: ["admin.order", p.orderId] });
    qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
    qc.invalidateQueries({ queryKey: ["order-workflow-state", p.orderId] });
    qc.invalidateQueries({ queryKey: ["order-tickets", p.orderId] });
    qc.invalidateQueries({ queryKey: ["workflow-timers", p.orderId] });
    qc.invalidateQueries({ queryKey: ["workflow-events", p.orderId] });
    qc.invalidateQueries({ queryKey: ["due-reminders-summary"] });
    qc.invalidateQueries({ queryKey: ["admin.lead.emails"] });
    qc.invalidateQueries({ queryKey: ["admin.order.timeline", p.orderId] });
  }, [qc, p.orderId]);
  const [sendingUpdateEmail, setSendingUpdateEmail] = reactExports.useState(false);
  const fnFormLink = useServerFn(sendFormLink);
  const fnSubmit = useServerFn(markSubmittedToGovt);
  useServerFn(completeOrder);
  const fnUpdateFF = useServerFn(updateFulfillmentStatus);
  const fnResume = useServerFn(resumeFromHold);
  const fnResumeCustomer = useServerFn(resumeFromCustomerDelay);
  const fnResumeReopened = useServerFn(resumeReopenedOrder);
  const fnReopen = useServerFn(reopenOrder);
  const fnConsultation = useServerFn(markConsultationCompleted);
  const fnResendServiceEmail = useServerFn(resendServiceChangeEmail);
  useMutation({
    mutationFn: () => fnResume({ data: { orderId: p.orderId, target: "IN_PROCESSING" } }),
    onSuccess: () => {
      toast.success("E011 sent — technical delay resolved, order resumed");
      try {
        window.localStorage.setItem(techResumeKey, "1");
      } catch {
      }
      setTechDelayResolved(true);
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  useMutation({
    mutationFn: () => fnResumeCustomer({ data: { orderId: p.orderId } }),
    onSuccess: () => {
      toast.success("Order resumed — moved to Form Submitted");
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  useMutation({
    mutationFn: () => fnResumeReopened({ data: { orderId: p.orderId } }),
    onSuccess: (res) => {
      toast.success(`Order resumed — moved to ${res?.nextStage === "form_not_submitted" ? "Form Not Submitted Delay" : "Form Submitted"}`);
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  useMutation({
    mutationFn: () => fnFormLink({ data: { orderId: p.orderId, transitionToWaiting: true } }),
    onSuccess: (r) => {
      toast.success(r?.emailQueued ? "E002 — Form link / incomplete-info mail sent" : "Order updated");
      try {
        window.localStorage.setItem(formLinkKey, "1");
      } catch {
      }
      setFormLinkSent(true);
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  useMutation({
    mutationFn: () => fnSubmit({ data: { orderId: p.orderId } }),
    onSuccess: () => {
      toast.success("E005 sent — application marked submitted to govt");
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  useMutation({
    mutationFn: () => fnConsultation({ data: { orderId: p.orderId, remarks: null } }),
    onSuccess: (result) => {
      toast.success(result.emailQueued ? "S08 · Consultation Completed — E005 sent" : "S08 · Consultation Completed — no email found");
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  useMutation({
    mutationFn: () => fnReopen({ data: { orderId: p.orderId } }),
    onSuccess: () => {
      toast.success("Order reopened successfully — active in Hot Orders");
      invalidate();
      qc.invalidateQueries({ queryKey: ["admin.order", p.orderId] });
      qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
      qc.invalidateQueries({ queryKey: ["order-workflow-state", p.orderId] });
      qc.invalidateQueries({ queryKey: ["order-tickets", p.orderId] });
      qc.invalidateQueries({ queryKey: ["workflow-events", p.orderId] });
      qc.invalidateQueries({ queryKey: ["due-reminders-summary"] });
    },
    onError: (e) => toast.error(e.message)
  });
  const cName = lead?.name ?? customer?.name ?? "—";
  const cMobile = lead?.mobile ?? customer?.primary_mobile ?? null;
  const cEmail = lead?.email ?? customer?.primary_email ?? null;
  const cLanguage = lead?.language ?? "—";
  const cState = lead?.state ?? "—";
  const cSource = lead?.lead_source ?? "—";
  const cLeadCode = lead?.lead_code ?? "—";
  const svcName = service?.service_name ?? lead?.service ?? "—";
  const waPhone = cMobile ? String(cMobile).replace(/\D/g, "") : "";
  const waUrl = waPhone ? `https://wa.me/${waPhone.length === 10 ? "91" + waPhone : waPhone}?text=${encodeURIComponent(
    `Hi ${cName}, this is regarding your ${svcName} application (${application.application_code}).`
  )}` : null;
  (payments ?? []).filter((x) => x?.status === "success" || x?.status === "captured" || x?.status === "paid").reduce((s, x) => s + Number(x?.amount ?? 0), 0);
  p.staff.find((s) => s.id === application.assigned_to)?.display_name ?? p.staff.find((s) => s.id === application.assigned_to)?.email ?? p.data?.assignedStaff?.display_name ?? p.data?.assignedStaff?.full_name ?? p.data?.assignedStaff?.email ?? "Unassigned";
  const copy = (v) => {
    navigator.clipboard.writeText(v);
    toast.success("Copied");
  };
  const runQuickAction = reactExports.useCallback(
    (key, built, exec) => {
      if (built.disabledReason) {
        toast.error(built.disabledReason);
        return;
      }
      if (built.toastInfo) toast(built.toastInfo);
      exec();
      if (built.toastSuccess) toast.success(built.toastSuccess);
    },
    []
  );
  const quickCtx = {
    mobile: cMobile,
    email: cEmail,
    leadId: lead?.id ?? null,
    waUrl,
    applicationCode: application.application_code
  };
  const paymentPillCls = paymentStatus === "Paid" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : paymentStatus === "Refunded" || paymentStatus === "Failed" ? "bg-rose-50 text-rose-700 ring-rose-200" : "bg-amber-50 text-amber-800 ring-amber-200";
  const statusPillCls = meta.side === "exception" ? "bg-rose-50 text-rose-700 ring-rose-200" : meta.tone === "emerald" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : meta.tone === "violet" ? "bg-violet-50 text-violet-700 ring-violet-200" : meta.tone === "amber" ? "bg-amber-50 text-amber-800 ring-amber-200" : "bg-sky-50 text-sky-700 ring-sky-200";
  const customerDetailsCard = /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(HeaderMeta, { label: "Order No.", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[15px] font-extrabold text-slate-900 tracking-tight", children: application.application_code }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => copy(application.application_code), className: "text-slate-400 hover:text-indigo-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5" }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HeaderMeta, { label: "Payment Status", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${paymentPillCls}`, children: paymentStatus }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HeaderMeta, { label: "Current Stage", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${statusPillCls}`, children: meta.label }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HeaderMeta, { label: "Order Created", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-slate-800", children: [
        formatIST(application.created_at),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded", children: relativeIST(application.created_at) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 border-t border-slate-100 pt-5 grid lg:grid-cols-[minmax(0,1fr)_auto] gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(UserRound, { className: "w-3.5 h-3.5" }), label: "Customer Name", value: cName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-3.5 h-3.5" }), label: "Mobile Number", value: cMobile ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `tel:${cMobile}`, className: "font-mono hover:text-indigo-700", children: cMobile }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CallButton, { mobile: cMobile, applicationId: p.orderId, leadId: application.lead_id ?? null, customerId: application.customer_id ?? null, compact: true })
        ] }) : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3.5 h-3.5" }), label: "Email ID", value: cEmail ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate block", children: cEmail }) : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "State", value: cState }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Language", value: cLanguage }),
        !hideForEmployee && /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Source", value: cSource }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Selected Service", value: svcName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Lead Code", value: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: cLeadCode }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          InfoRow,
          {
            label: "Assigned To",
            value: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: application.assigned_to ?? "",
                onChange: (e) => p.onAssign(e.target.value || null),
                className: "rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs font-semibold text-slate-800 shadow-xs focus:outline-none focus:ring-1 focus:ring-indigo-500",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Unassigned" }),
                  application.assigned_to && !p.staff.some((s) => s.id === application.assigned_to) && /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: application.assigned_to, children: [
                    p.data?.assignedStaff?.display_name || p.data?.assignedStaff?.full_name || p.data?.assignedStaff?.email || "Archived Staff",
                    " (Archived)"
                  ] }),
                  (Array.isArray(p.staff) ? p.staff : []).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.id, children: s.display_name || s.full_name || s.name || s.email }, s.id))
                ]
              }
            )
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pl-4 lg:border-l lg:border-slate-100 h-fit min-w-[300px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-[0.14em] font-bold text-slate-500 mb-2", children: "Quick Actions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-6 gap-1.5", children: QUICK_ACTIONS.map((spec) => {
          const built = spec.build(quickCtx);
          const disabled = !!built.disabledReason;
          const onClick = () => {
            if (spec.key === "print") {
              runQuickAction(spec.key, built, () => window.print());
            } else {
              runQuickAction(spec.key, built, () => {
                if (built.to) {
                  window.location.assign(built.to);
                } else if (built.href) {
                  if (built.external) {
                    window.open(built.href, "_blank", "noopener,noreferrer");
                  } else {
                    window.location.assign(built.href);
                  }
                }
              });
            }
          };
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              QuickTile,
              {
                icon: spec.icon,
                label: spec.label,
                tint: spec.tint,
                disabled,
                onClick
              }
            ) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: built.disabledReason ?? spec.tooltip })
          ] }, spec.key);
        }) })
      ] })
    ] })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { delayDuration: 200, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 pb-10 max-w-[1400px] mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => {
            if (typeof window !== "undefined" && window.history.length > 1) {
              window.history.back();
            } else {
              navigate({ to: "/admin/orders" });
            }
          },
          className: "inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
            " Back to Orders"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: govtPortalUrl ?? void 0,
              target: govtPortalUrl ? "_blank" : void 0,
              rel: "noopener noreferrer",
              onClick: (e) => {
                if (!govtPortalUrl) {
                  e.preventDefault();
                  toast.error("No government portal URL set for this service");
                }
              },
              className: `inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold border ${govtPortalUrl ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3.5 h-3.5" }),
                " Govt Portal"
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: govtPortalUrl ? "Open the government portal for this service in a new tab" : "No government portal URL configured for this service" })
        ] }),
        isAdmin && cLeadCode && cLeadCode !== "—" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: async () => {
                try {
                  const { url: link } = await mintCustomerLink({ data: { leadCode: cLeadCode, kind: "form" } });
                  await navigator.clipboard.writeText(link);
                  toast.success(`Form link copied for ${cLeadCode}!`);
                } catch {
                  toast.error("Failed to copy form link");
                }
              },
              className: "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5 text-indigo-600" }),
                " Copy Form Link"
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TooltipContent, { children: [
            "Copy customer form link (",
            cLeadCode,
            ") to clipboard"
          ] })
        ] }),
        hasServiceChanged && cLeadCode && cLeadCode !== "—" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: async () => {
                try {
                  const { url: link } = await mintCustomerLink({ data: { leadCode: cLeadCode, kind: "payment" } });
                  await navigator.clipboard.writeText(link);
                  toast.success(`Secure payment link copied for ${cLeadCode}!`);
                } catch {
                  toast.error("Failed to copy payment link");
                }
              },
              className: "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "w-3.5 h-3.5 text-amber-700" }),
                " Copy Payment Link"
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TooltipContent, { children: [
            "Copy customer payment link (",
            cLeadCode,
            ") to clipboard"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ChangeServiceButton,
          {
            orderId: p.orderId,
            currentServiceId: service?.id ?? null,
            currentServiceName: service?.service_name ?? "—",
            fulfillmentStatus: String(current),
            formSubmittedAt: application?.form_submitted_at ?? null
          }
        ),
        hasServiceChanged && /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              disabled: sendingUpdateEmail,
              onClick: async () => {
                setSendingUpdateEmail(true);
                try {
                  const r = await fnResendServiceEmail({ data: { orderId: p.orderId } });
                  toast.success(`Service update email resent to ${r.recipient}`);
                  invalidate();
                } catch (e) {
                  toast.error(e?.message ?? "Failed to resend email");
                } finally {
                  setSendingUpdateEmail(false);
                }
              },
              className: "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold border border-sky-300 bg-sky-50 text-sky-900 hover:bg-sky-100 transition-colors",
              children: [
                sendingUpdateEmail ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-3.5 h-3.5 text-sky-700" }),
                "Resend Update Email"
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: "Resend service update email & payment link to customer" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setRefundOpen(true),
              className: "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeDollarSign, { className: "w-3.5 h-3.5" }),
                " Refund"
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: "Log a refund request received from the customer" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AddTaskDialog, { defaultApplicationId: p.orderId, defaultLeadId: application.lead_id ?? null, triggerLabel: "Add Task / Follow-up" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: "Schedule a follow-up task for this order" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(RefundRequestDialog, { applicationId: p.orderId, open: refundOpen, onClose: () => setRefundOpen(false) }),
    Boolean(p.data?.ticketEscalation?.isEscalated) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-rose-300 bg-rose-50/90 p-4 shadow-sm flex items-start justify-between gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2.5 rounded-xl bg-rose-600 text-white shadow-xs shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-5 animate-pulse fill-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-extrabold text-xs uppercase tracking-wider text-rose-700 bg-rose-100/90 border border-rose-300 px-2 py-0.5 rounded-md flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LifeBuoy, { className: "size-3 text-rose-600" }),
            "Support Ticket Escalation"
          ] }),
          p.data?.ticketEscalation?.ticketNumber && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-bold text-xs text-rose-900 bg-white/80 border border-rose-200 px-2 py-0.5 rounded-md", children: [
            "Ticket #",
            p.data.ticketEscalation.ticketNumber
          ] }),
          p.data?.ticketEscalation?.ticketId && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/admin/support/tickets/$ticketId",
              params: { ticketId: p.data.ticketEscalation.ticketId },
              className: "text-xs font-semibold text-rose-800 underline hover:text-rose-950 flex items-center gap-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "size-3" }),
                " View Ticket"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-rose-900 font-medium", children: [
          "This order was ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: p.data?.ticketEscalation?.isReopened ? "reopened" : "marked Hot Priority" }),
          " from the Support Ticket system."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 text-[11px] font-semibold text-rose-900", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-white/80 border border-rose-200 px-2 py-0.5 rounded-md", children: [
            "1. Ticket created: ",
            formatIST(p.data?.ticketEscalation?.ticketCreatedAt)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-white/80 border border-rose-200 px-2 py-0.5 rounded-md", children: [
            "2. Order reopened: ",
            formatIST(p.data?.ticketEscalation?.ticketReopenedAt)
          ] })
        ] }),
        p.data?.ticketEscalation?.note && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs bg-white/95 border border-rose-200 rounded-lg p-2.5 text-slate-800 mt-1.5 leading-relaxed shadow-2xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-rose-900 block text-[11px] mb-0.5", children: "Instructions from Support:" }),
          p.data.ticketEscalation.note
        ] })
      ] })
    ] }) }),
    isSuperAdmin && customerDetailsCard,
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CustomerJourneyMap,
      {
        applicationId: application.id,
        stage: p.stage,
        isConsultationOrder: p.showConsultationPanel || !!lead?.lead_code?.startsWith?.("TX"),
        serviceCode: service?.service_code ?? service?.code ?? lead?.service ?? null,
        workflowStatus: application.workflow_status,
        closureStage: application.closure_stage,
        closureNextAt: application.closure_next_at,
        closureReasonLabel: application.closure_reason_code || application.closure_reason_text || application.closure_remarks || application.order_close_reasons?.label || application.delay_reasons?.label || application.active_reason_id || null,
        formSubmittedAt: application.form_submitted_at,
        fulfillmentStatus: application.fulfillment_status,
        payments,
        hideAmount: p.hideAmount,
        adminOverride,
        onAdminOverrideChange: setAdminOverride
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CustomerDelayDialog,
      {
        applicationId: application.id,
        open: dialog?.kind === "customer_delay",
        onClose: () => {
          setDialog(null);
          invalidate();
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TechnicalDelayDialog,
      {
        applicationId: application.id,
        open: dialog?.kind === "technical_delay",
        onClose: () => {
          setDialog(null);
          invalidate();
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CloseOrderDialog,
      {
        applicationId: application.id,
        open: dialog?.kind === "force_close",
        adminOverride,
        onClose: () => {
          setDialog(null);
          invalidate();
        }
      }
    ),
    dialog?.kind === "silent_close" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      SilentCloseInline,
      {
        applicationId: application.id,
        onClose: () => {
          setDialog(null);
          invalidate();
        }
      }
    ),
    dialog?.kind === "govt_rejected" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      GovtRejectedInline,
      {
        orderId: application.id,
        onClose: () => {
          setDialog(null);
          invalidate();
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CompletionGateDialogStandalone,
      {
        open: dialog?.kind === "complete_with_cert",
        onOpenChange: (v) => {
          if (!v) setDialog(null);
        },
        orderId: application.id,
        busy: false,
        onConfirm: async (payload) => {
          await fnUpdateFF({
            data: {
              orderId: application.id,
              toStatus: "completed",
              certificateDocumentId: payload.certificateDocumentId,
              certificateNumber: payload.certificateNumber,
              completionNotes: payload.completionNotes,
              ccEmail: payload.ccEmail,
              adminOverride: adminOverride || void 0
            }
          });
          toast.success("E007 sent — order completed with certificate");
          invalidate();
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: tab, onValueChange: (v) => setTab(v), className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsList, { className: "w-full justify-start bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/90 h-auto gap-1.5 overflow-x-auto flex-nowrap shadow-inner", children: TAB_DEFS.filter((t) => !t.moneyOnly || !hideForEmployee).filter((t) => !isSuperAdmin || t.id !== "customer").map((t) => {
        const Icon = t.icon;
        const state = availability[t.id];
        const tip = !state.enabled && state.reason ? state.reason : t.tooltip;
        const trigger = /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsTrigger,
          {
            value: t.id,
            disabled: !state.enabled,
            className: "gap-2 px-4 py-2.5 rounded-xl border border-slate-200/60 bg-white/80 text-sm font-semibold text-slate-700 transition-all duration-150 hover:bg-white hover:text-indigo-900 hover:border-slate-300 hover:shadow-xs data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:border-indigo-700 data-[state=active]:shadow-md data-[state=active]:font-bold disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t.label })
            ]
          },
          t.id
        );
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: trigger }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: tip })
        ] }, t.id);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full mt-5 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "form", className: "space-y-4 mt-0 animate-fade-in", children: [
          p.showConsultationPanel ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900", children: [
            "This is a ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Talk-to-Expert" }),
            " order. The service form appears here after the customer's service is picked and the second payment is received."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FormSubmissionPanel, { applicationId: application.id, isLocked: current === "completed" || current === "cancelled", orderId: p.orderId }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            OrderDocumentsPanel,
            {
              orderId: p.orderId,
              documents,
              deletedAt: application.documents_deleted_at,
              deletedReason: application.documents_deleted_reason,
              hideMoney: p.hideAmount
            }
          )
        ] }),
        !isSuperAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "customer", className: "space-y-4 mt-0 animate-fade-in", children: customerDetailsCard }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "assignment", className: "space-y-4 mt-0 animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsx(OrderAssignmentHistoryTab, { orderId: p.orderId }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "emails", className: "space-y-4 mt-0 animate-fade-in", children: lead?.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(LeadEmailsTab, { leadId: lead.id, leadService: svcName, orderId: p.orderId }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border bg-white p-6 text-sm text-slate-500", children: "No lead linked." }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "activity", className: "space-y-4 mt-0 animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          UnifiedTimeline,
          {
            applicationId: application.id,
            events: timelineData?.events ?? events ?? [],
            emailLogs: timelineData?.emailLogs ?? emailLogs ?? [],
            payments: p.hideAmount ? [] : payments,
            documents,
            createdAt: application.created_at,
            hideMoney: p.hideAmount
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "support", className: "mt-0 animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          OrderTicketsPanel,
          {
            orderTickets: ticketsData?.orderTickets ?? p.data.orderTickets ?? [],
            customerTickets: ticketsData?.customerTickets ?? p.data.customerTickets ?? []
          }
        ) }),
        !hideForEmployee && /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "invoices", className: "space-y-4 mt-0 animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsx(OrderPaymentsPanel, { payments: payments ?? [] }) })
      ] })
    ] })
  ] }) });
}
function HeaderMeta({ label, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-[0.14em] font-bold text-slate-500 mb-1.5", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children })
  ] });
}
function InfoRow({ icon, label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[130px_minmax(0,1fr)] items-center gap-3 text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-slate-500", children: [
      icon,
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-0 font-semibold text-slate-800 truncate", children: value })
  ] });
}
function QuickTile({
  onClick,
  icon: Icon,
  label,
  tint,
  disabled = false
}) {
  const tintMap = {
    emerald: "text-emerald-600 bg-emerald-50 hover:bg-emerald-100",
    sky: "text-sky-600 bg-sky-50 hover:bg-sky-100",
    violet: "text-violet-600 bg-violet-50 hover:bg-violet-100",
    slate: "text-slate-600 bg-slate-100 hover:bg-slate-200"
  };
  const cls = `flex flex-col items-center px-1 py-1.5 rounded-lg transition cursor-pointer ${disabled ? "opacity-50" : ""}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick, className: cls, "aria-disabled": disabled, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `w-9 h-9 grid place-items-center rounded-lg ${tintMap[tint]}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-slate-600 mt-1", children: label })
  ] });
}
const TICKET_STATUS_TINT = {
  open: "bg-sky-50 text-sky-700 ring-sky-200",
  in_progress: "bg-amber-50 text-amber-700 ring-amber-200",
  waiting_customer: "bg-violet-50 text-violet-700 ring-violet-200",
  resolved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  closed: "bg-slate-100 text-slate-600 ring-slate-200"
};
const TICKET_PRIORITY_TINT = {
  urgent: "bg-rose-100 text-rose-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-amber-50 text-amber-700",
  low: "bg-slate-100 text-slate-600"
};
function OrderTicketsPanel({ orderTickets, customerTickets }) {
  const openCount = orderTickets.filter((t) => ["open", "in_progress", "waiting_customer"].includes(t.status)).length;
  const closedCount = orderTickets.length - openCount;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "flex items-center justify-between px-5 py-3 border-b border-slate-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LifeBuoy, { className: "w-4 h-4 text-indigo-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-slate-900", children: "Tickets for this order" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold", children: orderTickets.length }),
        openCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 font-semibold", children: [
          openCount,
          " open"
        ] }),
        closedCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold", children: [
          closedCount,
          " closed"
        ] })
      ] }) }),
      orderTickets.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-8 text-center text-sm text-slate-500", children: "No support tickets on this order yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-slate-100", children: orderTickets.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(TicketRow, { t }, t.id)) })
    ] }),
    customerTickets.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "flex items-center justify-between px-5 py-3 border-b border-slate-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserRound, { className: "w-4 h-4 text-slate-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-slate-900", children: "Other tickets from this customer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold", children: customerTickets.length })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-slate-100", children: customerTickets.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(TicketRow, { t, showOrderLink: true }, t.id)) })
    ] })
  ] });
}
function TicketRow({ t, showOrderLink }) {
  const statusCls = TICKET_STATUS_TINT[t.status] ?? "bg-slate-100 text-slate-600 ring-slate-200";
  const prCls = TICKET_PRIORITY_TINT[t.priority] ?? "bg-slate-100 text-slate-600";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/admin/tickets/$ticketId",
      params: { ticketId: t.id },
      className: "flex items-center justify-between gap-3 px-5 py-3 hover:bg-slate-50 transition",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px] text-slate-500", children: t.ticket_number }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] px-1.5 py-0.5 rounded ring-1 uppercase font-semibold ${statusCls}`, children: t.status.replace(/_/g, " ") }),
            t.priority && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold ${prCls}`, children: t.priority }),
            showOrderLink && t.application_id && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400", children: "· other order" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 text-sm text-slate-800 truncate", children: t.subject })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400 whitespace-nowrap", children: relativeIST(t.created_at) })
      ]
    }
  ) });
}
function GovtRejectedInline({ orderId, onClose }) {
  const [reasonText, setReasonText] = reactExports.useState("");
  const fn = useServerFn(handleGovtRejected);
  const listReasons = useServerFn(listCloseReasons);
  const [busy, setBusy] = reactExports.useState(false);
  const { data: reasons = [] } = useQuery({
    queryKey: ["close-reasons-all"],
    queryFn: () => listReasons(),
    staleTime: 6e4
  });
  const catB = reasons.filter((r) => r.category === "B");
  const [reasonId, setReasonId] = reactExports.useState(null);
  const submit = async () => {
    if (!reasonId) return toast.error("Pick a Category B reason");
    setBusy(true);
    try {
      await fn({ data: { orderId, reasonId, remarks: reasonText || null } });
      toast.success("E008 sent — order closed (rejected)");
      onClose();
    } catch (e) {
      toast.error(e?.message ?? "Failed");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 grid place-items-center bg-black/60 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-lg rounded-xl border bg-white p-5 shadow-xl space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-slate-900", children: "E008 — Application Rejected by Govt" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-600", children: "Sends E008 to the customer and force-closes this order (no resubmit loop)." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-semibold uppercase tracking-wider text-slate-500", children: "Reason (Category B)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "select",
        {
          value: reasonId ?? "",
          onChange: (e) => setReasonId(e.target.value || null),
          className: "w-full rounded-md border px-2 py-1.5 text-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select a reason…" }),
            catB.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: r.id, children: [
              "B",
              r.number,
              " — ",
              r.label
            ] }, r.id))
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-semibold uppercase tracking-wider text-slate-500", children: "Extra remarks (optional)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          value: reasonText,
          onChange: (e) => setReasonText(e.target.value),
          rows: 3,
          className: "w-full rounded-md border px-2 py-1.5 text-sm"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, disabled: busy, className: "rounded-md border px-3 py-1.5 text-sm", children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: submit,
          disabled: busy || !reasonId,
          className: "rounded-md bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50",
          children: "Send E008 & Close"
        }
      )
    ] })
  ] }) });
}
function SilentCloseInline({ applicationId, onClose }) {
  const [reasonText, setReasonText] = reactExports.useState("");
  const fnSilent = useServerFn(silentCloseOrder);
  const [busy, setBusy] = reactExports.useState(false);
  const qc = useQueryClient();
  const submit = async () => {
    setBusy(true);
    try {
      await fnSilent({
        data: {
          applicationId,
          reasonCode: "ADMIN_SILENT_CLOSE",
          reasonLabel: "Silent Close (Admin Override)",
          notes: reasonText.trim() || void 0
        }
      });
      toast.success("Order closed silently — no customer email sent");
      qc.invalidateQueries({ queryKey: ["admin.order", applicationId] });
      qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
      qc.invalidateQueries({ queryKey: ["order-workflow-state", applicationId] });
      qc.invalidateQueries({ queryKey: ["order-tickets", applicationId] });
      qc.invalidateQueries({ queryKey: ["workflow-timers", applicationId] });
      qc.invalidateQueries({ queryKey: ["workflow-events", applicationId] });
      qc.invalidateQueries({ queryKey: ["due-reminders-summary"] });
      onClose();
    } catch (e) {
      toast.error(e?.message ?? "Silent close failed");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 grid place-items-center bg-black/60 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-lg rounded-xl border border-slate-700 bg-slate-900 text-white p-5 shadow-2xl space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex size-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "size-4.5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm text-white", children: "Silent Close Order (Admin Override)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400", children: "Close immediately without sending any customer email" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-300", children: [
      "⚠️ ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "No Customer Email:" }),
      " This will transition the order to Closed, cancel all active reminders and hot order alerts, and update the status without sending any emails or notifications to the customer."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[11px] font-semibold uppercase tracking-wider text-slate-400", children: "Internal Remarks / Reason (Optional)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          value: reasonText,
          onChange: (e) => setReasonText(e.target.value),
          placeholder: "e.g. Offline resolved / test order / client requested silent closure",
          rows: 3,
          className: "w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2 border-t border-slate-800", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: onClose,
          disabled: busy,
          className: "rounded-md border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition cursor-pointer",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: submit,
          disabled: busy,
          className: "inline-flex items-center gap-1.5 rounded-md bg-amber-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-amber-500 transition disabled:opacity-50 shadow-md cursor-pointer",
          children: [
            busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "size-3.5" }),
            "Confirm Silent Close"
          ]
        }
      )
    ] })
  ] }) });
}
function OrderDetailPage() {
  const {
    orderId
  } = Route$O.useParams();
  const qc = useQueryClient();
  const role = useRole();
  const detailFn = useServerFn(getOrderDetailV2);
  const staffFn = useServerFn(listStaff);
  const assignFn = useServerFn(updateOrderAssignee);
  const {
    data,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["admin.order", orderId],
    queryFn: () => detailFn({
      data: {
        orderId
      }
    }),
    retry: false
  });
  const {
    data: staffData
  } = useQuery({
    queryKey: ["admin.staff"],
    queryFn: () => staffFn()
  });
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 animate-pulse", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 rounded-2xl bg-gradient-to-r from-indigo-100 to-cyan-100" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-24 rounded-2xl bg-slate-100" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 rounded-2xl bg-slate-100" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-96 rounded-2xl bg-slate-100" })
    ] });
  }
  if (isError || !data) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center min-h-[50vh] p-8 text-center bg-white rounded-2xl border border-slate-200 mt-6 shadow-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-rose-50 text-rose-600 rounded-full mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "size-10" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-slate-900 mb-2", children: "Access Denied" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 max-w-md mb-6 leading-relaxed", children: error?.message || "You do not have permission to view this order. Employees can only view orders assigned to them." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/orders", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
        " Return to Orders"
      ] }) })
    ] });
  }
  const {
    application,
    lead,
    paymentSuccessfulAt,
    stageMeta
  } = data;
  const stage = computeOrderStage({
    ...lead ?? {},
    payment_successful_at: paymentSuccessfulAt
  }, application);
  const selectStep = !!lead?.id && !!lead?.lead_code && isUnconvertedConsultationLead(lead);
  const awaitingSecondPayment = !!lead?.id && !!lead?.lead_code && isConvertedConsultationLead(lead) && application?.application_status === "awaiting_payment";
  const showConsultationPanel = selectStep || awaitingSecondPayment;
  const consultationMode = selectStep ? "select" : "awaiting_payment";
  const hideAmount = role.hideMoney();
  const timestamps = {
    lead_received: application.created_at,
    payment_done: paymentSuccessfulAt ?? null,
    form_submitted: application?.form_submitted_at ?? null,
    under_review: stageMeta?.verification_pending?.at ?? null,
    in_progress: stageMeta?.documents_received?.at ?? null,
    submitted_to_govt: stageMeta?.application_submitted?.at ?? null,
    certificate_ready: application?.certificate_uploaded_at ?? null,
    completed: stageMeta?.completed?.at ?? null
  };
  const setAssignee = async (v) => {
    try {
      await assignFn({
        data: {
          orderId,
          assignedTo: v
        }
      });
      toast.success("Assignee updated");
      qc.invalidateQueries({
        queryKey: ["admin.order", orderId]
      });
    } catch (e) {
      toast.error(e?.message ?? "Failed");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(WorkspaceShell, { orderId, data, hideAmount, staff: Array.isArray(staffData) ? staffData : staffData?.profiles ?? [], onAssign: setAssignee, stage, timestamps, showConsultationPanel, consultationMode, canComplete: !role.has("support"), notesNode: null });
}
export {
  OrderDetailPage as component
};
