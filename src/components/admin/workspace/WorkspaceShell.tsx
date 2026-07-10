import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, Copy, Phone, Mail, User2,
  FileText, Workflow, Activity, LifeBuoy, ExternalLink, BadgeDollarSign,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

import { CustomerJourneyMap } from "./CustomerJourneyMap";
import { TabStatusHeader } from "./TabStatusHeader";
import { OrderActionRail } from "./OrderActionRail";
import { FormSubmissionPanel } from "@/components/admin/FormSubmissionPanel";
import { OrderDocumentsPanel } from "@/components/admin/OrderDocumentsPanel";
import { OrderWorkflowPanel } from "./OrderWorkflowPanel";
import { OrderWorkflowLiveStatus } from "./OrderWorkflowLiveStatus";
import { UnifiedTimeline } from "@/components/admin/UnifiedTimeline";
import { ConvertConsultationPanel } from "@/components/admin/ConvertConsultationPanel";
import { LeadEmailsTab } from "@/components/admin/LeadEmailsTab";
import { AddTaskDialog } from "@/components/admin/AddTaskDialog";
import { RefundRequestDialog } from "@/components/admin/RefundRequestDialog";

import { STAGE_META, type OrderStage } from "@/lib/crm/computeOrderStage";
import type { FulfillmentStatus } from "@/lib/crm/fulfillment-transitions";
import type { OrderStatus } from "@/lib/orders/order-status.functions";
import {
  QUICK_ACTIONS,
  tabAvailability,
  type WorkspaceTabId,
} from "@/lib/orders/order-actions-map";
import { formatIST, relativeIST } from "@/lib/datetime";

interface Props {
  orderId: string;
  data: any;
  hideAmount: boolean;
  staff: any[];
  onAssign: (id: string | null) => void;
  stage: OrderStage;
  timestamps: Partial<Record<OrderStage, string | null>>;
  showConsultationPanel: boolean;
  consultationMode: "select" | "awaiting_payment";
  canComplete: boolean;
  notesNode: React.ReactNode;
}

const TAB_DEFS = [
  { id: "workflow" as const, label: "Employee Task",                    icon: Workflow, tooltip: "Move the order through its workflow stages" },
  { id: "form"     as const, label: "Forms & Docs",                     icon: FileText, tooltip: "View the submitted service form and uploaded documents" },
  { id: "emails"   as const, label: "Emails",                           icon: Mail,     tooltip: "All emails sent or received for this order" },
  { id: "activity" as const, label: "Timeline / Activity Log",          icon: Activity, tooltip: "Full chronological activity log for this order" },
  { id: "support"  as const, label: "Internal Help / Support Ticket",   icon: LifeBuoy, tooltip: "Raise or track internal tickets tied to this order" },
];
type TabId = WorkspaceTabId;

export function WorkspaceShell(p: Props) {
  const qc = useQueryClient();
  const [tab, setTab] = useState<TabId>("workflow");
  const [refundOpen, setRefundOpen] = useState(false);
  const { application, lead, customer, service, payments, paymentStatus, total, documents, events, emailLogs, stageMeta } = p.data;
  const govtPortalUrl: string | null = (service as any)?.govt_portal_url ?? null;
  const current = (application.fulfillment_status ?? "order_received") as FulfillmentStatus;
  const orderStatus = (application.order_status ?? null) as OrderStatus | null;
  const meta = STAGE_META[p.stage];
  const availability = tabAvailability(orderStatus, !!lead?.id, p.showConsultationPanel);

  // If the active tab becomes unavailable (status changed), fall back to Workflow.
  useEffect(() => {
    if (!availability[tab].enabled) setTab("workflow");
  }, [availability, tab]);

  const invalidateOrder = useCallback(
    () => qc.invalidateQueries({ queryKey: ["admin.order", p.orderId] }),
    [qc, p.orderId],
  );

  const cName = customer?.name ?? lead?.name ?? "—";
  const cMobile = customer?.primary_mobile ?? lead?.mobile ?? null;
  const cEmail = customer?.primary_email ?? lead?.email ?? null;
  const cLanguage = lead?.language ?? "—";
  const cState = lead?.state ?? "—";
  const cSource = lead?.lead_source ?? "—";
  const cLeadCode = lead?.lead_code ?? "—";
  const svcName = service?.service_name ?? lead?.service ?? "—";

  const waPhone = cMobile ? String(cMobile).replace(/\D/g, "") : "";
  const waUrl = waPhone
    ? `https://wa.me/${waPhone.length === 10 ? "91" + waPhone : waPhone}?text=${encodeURIComponent(
        `Hi ${cName}, this is regarding your ${svcName} application (${application.application_code}).`,
      )}`
    : null;

  const paidAmt = (payments ?? [])
    .filter((x: any) => x?.status === "success" || x?.status === "captured" || x?.status === "paid")
    .reduce((s: number, x: any) => s + Number(x?.amount ?? 0), 0);
  const dueAmt = Math.max(0, Number(total ?? 0) - paidAmt);

  const assignedName =
    p.staff.find((s: any) => s.id === application.assigned_to)?.display_name
    ?? p.staff.find((s: any) => s.id === application.assigned_to)?.email
    ?? "Unassigned";

  const copy = (v: string) => { navigator.clipboard.writeText(v); toast.success("Copied"); };

  /**
   * Central handler for every header quick tile. Always fires a toast so
   * employees get instant feedback, disabled tiles show WHY they're disabled,
   * and system actions (print / copy) confirm success.
   */
  const runQuickAction = useCallback(
    (
      key: string,
      built: { disabledReason?: string | null; toastInfo?: string; toastSuccess?: string },
      exec: () => void,
    ) => {
      if (built.disabledReason) {
        toast.error(built.disabledReason);
        return;
      }
      if (built.toastInfo) toast(built.toastInfo);
      exec();
      if (built.toastSuccess) toast.success(built.toastSuccess);
    },
    [],
  );

  const quickCtx = {
    mobile: cMobile,
    email: cEmail,
    leadId: lead?.id ?? null,
    waUrl,
    applicationCode: application.application_code,
  };

  const paymentPillCls =
    paymentStatus === "Paid" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" :
    paymentStatus === "Refunded" || paymentStatus === "Failed" ? "bg-rose-50 text-rose-700 ring-rose-200" :
    "bg-amber-50 text-amber-800 ring-amber-200";

  const statusPillCls =
    meta.side === "exception" ? "bg-rose-50 text-rose-700 ring-rose-200" :
    meta.tone === "emerald" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" :
    meta.tone === "violet"  ? "bg-violet-50 text-violet-700 ring-violet-200" :
    meta.tone === "amber"   ? "bg-amber-50 text-amber-800 ring-amber-200" :
                              "bg-sky-50 text-sky-700 ring-sky-200";

  return (
    <TooltipProvider delayDuration={200}>
    <div className="space-y-5 pb-10 max-w-[1400px] mx-auto">
      {/* Top row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={govtPortalUrl ?? undefined}
                target={govtPortalUrl ? "_blank" : undefined}
                rel="noopener noreferrer"
                onClick={(e) => { if (!govtPortalUrl) { e.preventDefault(); toast.error("No government portal URL set for this service"); } }}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold border ${govtPortalUrl ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"}`}
              >
                <ExternalLink className="w-3.5 h-3.5" /> Govt Portal
              </a>
            </TooltipTrigger>
            <TooltipContent>{govtPortalUrl ? "Open the government portal for this service in a new tab" : "No government portal URL configured for this service"}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setRefundOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
              >
                <BadgeDollarSign className="w-3.5 h-3.5" /> Refund
              </button>
            </TooltipTrigger>
            <TooltipContent>Log a refund request received from the customer</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <AddTaskDialog defaultApplicationId={p.orderId} defaultLeadId={application.lead_id ?? null} triggerLabel="Add Task / Follow-up" />
              </span>
            </TooltipTrigger>
            <TooltipContent>Schedule a follow-up task for this order</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <RefundRequestDialog applicationId={p.orderId} open={refundOpen} onClose={() => setRefundOpen(false)} />


      {/* Header card */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
        {/* Meta grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
          <HeaderMeta label="Order No.">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[15px] font-extrabold text-slate-900 tracking-tight">
                {application.application_code}
              </span>
              <button onClick={() => copy(application.application_code)} className="text-slate-400 hover:text-indigo-600">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </HeaderMeta>
          <HeaderMeta label="Payment Status">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${paymentPillCls}`}>
              {paymentStatus}
            </span>
          </HeaderMeta>
          <HeaderMeta label="Order Status">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${statusPillCls}`}>
              {meta.label}
            </span>
          </HeaderMeta>
          <HeaderMeta label="Order Created">
            <div className="text-sm text-slate-800">
              {formatIST(application.created_at)}
              <span className="ml-2 text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                {relativeIST(application.created_at)}
              </span>
            </div>
          </HeaderMeta>
        </div>

        <div className="mt-5 border-t border-slate-100 pt-5 grid lg:grid-cols-[minmax(0,1fr)_auto] gap-6">
          {/* Customer fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 min-w-0">
            <InfoRow icon={<User2 className="w-3.5 h-3.5" />} label="Customer Name" value={cName} />
            <InfoRow icon={<Phone className="w-3.5 h-3.5" />} label="Mobile Number" value={cMobile ? <a href={`tel:${cMobile}`} className="font-mono hover:text-indigo-700">{cMobile}</a> : "—"} />
            <InfoRow icon={<Mail className="w-3.5 h-3.5" />} label="Email ID" value={cEmail ? <span className="truncate block">{cEmail}</span> : "—"} />
            <InfoRow label="State" value={cState} />
            <InfoRow label="Language" value={cLanguage} />
            <InfoRow label="Source" value={cSource} />
            <InfoRow label="Selected Service" value={svcName} />
            <InfoRow label="Lead Code" value={<span className="font-mono">{cLeadCode}</span>} />
          </div>

          {/* Unified action area — every tile is map-driven and always toasts. Visually attached to header (no border). */}
          <div className="pl-4 lg:border-l lg:border-slate-100 h-fit min-w-[300px]">
            <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-slate-500 mb-2">Quick Actions</div>
            <div className="grid grid-cols-6 gap-1.5">
              {QUICK_ACTIONS.map((spec) => {
                const built = spec.build(quickCtx);
                const disabled = !!built.disabledReason;
                const onClick = () => {
                  if (spec.key === "print") {
                    runQuickAction(spec.key, built, () => window.print());
                  } else if (spec.key === "copy_code") {
                    runQuickAction(spec.key, built, () =>
                      navigator.clipboard.writeText(quickCtx.applicationCode),
                    );
                  } else {
                    // Contact / link tiles: navigate manually so we can toast first.
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
                return (
                  <Tooltip key={spec.key}>
                    <TooltipTrigger asChild>
                      <span>
                        <QuickTile
                          icon={spec.icon}
                          label={spec.label}
                          tint={spec.tint}
                          disabled={disabled}
                          onClick={onClick}
                        />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>{built.disabledReason ?? spec.tooltip}</TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </div>
        {/* Employee actions live in one place only — inside the Employee Workflow tab
            (OrderWorkflowPanel). This card is header info only. */}
      </section>

      {/* ── EMPLOYEE ACTIONS (single source of truth) ── */}
      <OrderActionRail
        applicationId={application.id}
        leadId={lead?.id ?? null}
        stage={p.stage}
        current={current}
        workflowStatus={(application as any).workflow_status}
        closureStage={(application as any).closure_stage}
        closureNextAt={(application as any).closure_next_at}
        cancellationRequestedAt={(application as any).cancellation_requested_at}
        reasonCode={(application as any).closure_reason_code}
        reasonText={(application as any).closure_reason_text}
        updatedAt={application.updated_at ?? application.created_at}
        onSwitchTab={(id) => setTab(id)}
      />

      {/* Customer Journey */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-indigo-600">
            Customer Journey
          </div>
        </div>
        <OrderWorkflowLiveStatus applicationId={application.id} />
        <CustomerJourneyMap
          stage={p.stage}
          isConsultationOrder={p.showConsultationPanel || !!lead?.lead_code?.startsWith?.("TX")}
          workflowStatus={(application as any).workflow_status}
          closureStage={(application as any).closure_stage}
          closureNextAt={(application as any).closure_next_at}
          closureReasonLabel={(application as any).closure_reason_code}
        />
      </section>


      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as TabId)} className="w-full">
        <TabsList className="w-full justify-start bg-transparent border-b border-slate-200 p-0 h-auto rounded-none gap-1 overflow-x-auto flex-nowrap">
          {TAB_DEFS.map((t) => {
            const Icon = t.icon;
            const state = availability[t.id];
            const tip = !state.enabled && state.reason ? state.reason : t.tooltip;
            const trigger = (
              <TabsTrigger
                key={t.id}
                value={t.id}
                disabled={!state.enabled}
                className="gap-2 px-4 py-2.5 rounded-none border-b-2 border-transparent bg-transparent text-sm font-semibold text-slate-500 hover:text-slate-800 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-700 data-[state=active]:bg-transparent data-[state=active]:shadow-none disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Icon className="size-4" />
                {t.label}
              </TabsTrigger>
            );
            return (
              <Tooltip key={t.id}>
                <TooltipTrigger asChild><span>{trigger}</span></TooltipTrigger>
                <TooltipContent>{tip}</TooltipContent>
              </Tooltip>
            );
          })}
        </TabsList>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-5 mt-5">
          {/* Main */}
          <div className="min-w-0 space-y-5">
            {/* Sticky "where are we + what's next" strip for every tab. Display-only —
                the single action surface lives inside the Employee Workflow tab. */}
            <TabStatusHeader
              applicationCode={application.application_code}
              orderStatus={orderStatus}
              stage={p.stage}
              updatedAt={application.updated_at ?? application.created_at}
            />
            <TabsContent value="workflow" className="space-y-4 mt-0 animate-fade-in">
              {p.showConsultationPanel ? (
                <ConvertConsultationPanel
                  leadId={lead.id} leadCode={lead.lead_code}
                  mode={p.consultationMode}
                  customerName={cName}
                  customerMobile={cMobile}
                  service={svcName}
                  totalAmount={total ?? (lead?.total_amount != null ? Number(lead.total_amount) : null)}
                />
              ) : (
                <>
                  {p.notesNode}

                  <OrderWorkflowPanel
                    applicationId={application.id}
                    current={current}
                    workflowStatus={(application as any).workflow_status}
                    closureStage={(application as any).closure_stage}
                    closureNextAt={(application as any).closure_next_at}
                    cancellationRequestedAt={(application as any).cancellation_requested_at}
                    reasonCode={(application as any).closure_reason_code}
                    reasonText={(application as any).closure_reason_text}
                  />
                </>
              )}
            </TabsContent>

            <TabsContent value="form" className="space-y-4 mt-0 animate-fade-in">
              {p.showConsultationPanel ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
                  This is a <b>Talk-to-Expert</b> order. The service form appears here after the customer's service is picked and the second payment is received.
                </div>
              ) : (
                <FormSubmissionPanel applicationId={application.id} isLocked={current === "completed" || current === "cancelled"} orderId={p.orderId} />
              )}
              <OrderDocumentsPanel
                orderId={p.orderId}
                documents={documents}
                deletedAt={application.documents_deleted_at}
                deletedReason={application.documents_deleted_reason}
                hideMoney={p.hideAmount}
              />
            </TabsContent>

            <TabsContent value="emails" className="space-y-4 mt-0 animate-fade-in">
              {lead?.id ? (
                <LeadEmailsTab leadId={lead.id} leadService={svcName} orderId={p.orderId} />
              ) : (
                <div className="rounded-2xl border bg-white p-6 text-sm text-slate-500">No lead linked.</div>
              )}
            </TabsContent>

            <TabsContent value="activity" className="space-y-4 mt-0 animate-fade-in">
              <UnifiedTimeline
                events={events}
                emailLogs={emailLogs ?? []}
                payments={p.hideAmount ? [] : payments}
                documents={documents}
                createdAt={application.created_at}
                hideMoney={p.hideAmount}
              />
            </TabsContent>

            <TabsContent value="support" className="mt-0 animate-fade-in">
              <OrderTicketsPanel
                orderTickets={p.data.orderTickets ?? []}
                customerTickets={p.data.customerTickets ?? []}
              />
            </TabsContent>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-indigo-600 mb-3">
                Order Summary
              </div>
              <dl className="space-y-2.5 text-sm">
                {!p.hideAmount && (
                  <>
                    <SummaryRow label="Total Amount" value={`₹${Number(total ?? 0).toLocaleString("en-IN")}`} />
                    <SummaryRow label="Paid Amount"  value={<span className="text-emerald-600 font-semibold">₹{paidAmt.toLocaleString("en-IN")}</span>} />
                    <SummaryRow label="Due Amount"   value={<span className={`font-semibold ${dueAmt > 0 ? "text-rose-600" : "text-slate-500"}`}>₹{dueAmt.toLocaleString("en-IN")}</span>} />
                    <div className="h-px bg-slate-100 my-1" />
                  </>
                )}
                <SummaryRow
                  label="Assigned To"
                  value={
                    <select
                      value={application.assigned_to ?? ""}
                      onChange={(e) => p.onAssign(e.target.value || null)}
                      className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium max-w-[160px]"
                    >
                      <option value="">Unassigned</option>
                      {p.staff.map((s: any) => <option key={s.id} value={s.id}>{s.display_name || s.email}</option>)}
                    </select>
                  }
                />
                <SummaryRow label="Last Updated" value={<span className="text-xs">{formatIST(application.updated_at ?? application.created_at)}</span>} />
                <SummaryRow label="Current Stage" value={<span className={`text-xs font-semibold ${meta.side === "exception" ? "text-rose-600" : "text-indigo-600"}`}>{meta.label}</span>} />
              </dl>
          </div>
        </aside>
        </div>
      </Tabs>
    </div>
    </TooltipProvider>
  );
}

// ─── helpers ───

function HeaderMeta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-slate-500 mb-1.5">{label}</div>
      <div>{children}</div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon?: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[130px_minmax(0,1fr)] items-center gap-3 text-sm">
      <div className="flex items-center gap-1.5 text-slate-500">
        {icon}
        <span>{label}</span>
      </div>
      <div className="min-w-0 font-semibold text-slate-800 truncate">{value}</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-800 font-medium">{value}</span>
    </div>
  );
}

function QuickTile({
  onClick, icon: Icon, label, tint, disabled = false,
}: {
  onClick?: () => void;
  icon: any; label: string; tint: "emerald" | "sky" | "violet" | "slate";
  disabled?: boolean;
}) {
  const tintMap = {
    emerald: "text-emerald-600 bg-emerald-50 hover:bg-emerald-100",
    sky:     "text-sky-600 bg-sky-50 hover:bg-sky-100",
    violet:  "text-violet-600 bg-violet-50 hover:bg-violet-100",
    slate:   "text-slate-600 bg-slate-100 hover:bg-slate-200",
  };
  // Note: we do NOT disable the button — it stays clickable so runQuickAction can
  // fire the "why disabled" toast. Visual affordance is dimmed instead.
  const cls = `flex flex-col items-center px-1 py-1.5 rounded-lg transition ${disabled ? "opacity-50" : ""}`;
  return (
    <button type="button" onClick={onClick} className={cls} aria-disabled={disabled}>
      <span className={`w-9 h-9 grid place-items-center rounded-lg ${tintMap[tint]}`}>
        <Icon className="w-4 h-4" />
      </span>
      <span className="text-[11px] font-medium text-slate-600 mt-1">{label}</span>
    </button>
  );
}

// ─────────────────────────── Order Tickets Panel ───────────────────────────

const TICKET_STATUS_TINT: Record<string, string> = {
  open:              "bg-sky-50 text-sky-700 ring-sky-200",
  in_progress:       "bg-amber-50 text-amber-700 ring-amber-200",
  waiting_customer:  "bg-violet-50 text-violet-700 ring-violet-200",
  resolved:          "bg-emerald-50 text-emerald-700 ring-emerald-200",
  closed:            "bg-slate-100 text-slate-600 ring-slate-200",
};
const TICKET_PRIORITY_TINT: Record<string, string> = {
  urgent: "bg-rose-100 text-rose-700",
  high:   "bg-orange-100 text-orange-700",
  medium: "bg-amber-50 text-amber-700",
  low:    "bg-slate-100 text-slate-600",
};

function OrderTicketsPanel({ orderTickets, customerTickets }: { orderTickets: any[]; customerTickets: any[] }) {
  const openCount = orderTickets.filter((t) => ["open", "in_progress", "waiting_customer"].includes(t.status)).length;
  const closedCount = orderTickets.length - openCount;

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <header className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Tickets for this order</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
              {orderTickets.length}
            </span>
            {openCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 font-semibold">
                {openCount} open
              </span>
            )}
            {closedCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                {closedCount} closed
              </span>
            )}
          </div>
        </header>
        {orderTickets.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-slate-500">
            No support tickets on this order yet.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {orderTickets.map((t) => <TicketRow key={t.id} t={t} />)}
          </ul>
        )}
      </section>

      {customerTickets.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <header className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <User2 className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-bold text-slate-900">Other tickets from this customer</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                {customerTickets.length}
              </span>
            </div>
          </header>
          <ul className="divide-y divide-slate-100">
            {customerTickets.map((t) => <TicketRow key={t.id} t={t} showOrderLink />)}
          </ul>
        </section>
      )}
    </div>
  );
}

function TicketRow({ t, showOrderLink }: { t: any; showOrderLink?: boolean }) {
  const statusCls = TICKET_STATUS_TINT[t.status] ?? "bg-slate-100 text-slate-600 ring-slate-200";
  const prCls = TICKET_PRIORITY_TINT[t.priority] ?? "bg-slate-100 text-slate-600";
  return (
    <li>
      <Link
        to="/admin/tickets/$ticketId"
        params={{ ticketId: t.id }}
        className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-slate-50 transition"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-slate-500">{t.ticket_number}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded ring-1 uppercase font-semibold ${statusCls}`}>
              {t.status.replace(/_/g, " ")}
            </span>
            {t.priority && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold ${prCls}`}>
                {t.priority}
              </span>
            )}
            {showOrderLink && t.application_id && (
              <span className="text-[10px] text-slate-400">· other order</span>
            )}
          </div>
          <div className="mt-0.5 text-sm text-slate-800 truncate">{t.subject}</div>
        </div>
        <div className="text-[11px] text-slate-400 whitespace-nowrap">
          {relativeIST(t.created_at)}
        </div>
      </Link>
    </li>
  );
}


