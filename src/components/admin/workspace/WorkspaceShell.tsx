import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, Copy, Phone, MessageCircle, Mail, User2, Printer,
  FileText, Workflow, Activity, LifeBuoy, Check,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

import { CustomerJourneyMap } from "./CustomerJourneyMap";
import { TabStatusHeader } from "./TabStatusHeader";
import { FormSubmissionPanel } from "@/components/admin/FormSubmissionPanel";
import { OrderDocumentsPanel } from "@/components/admin/OrderDocumentsPanel";
import { OrderWorkflowPanel } from "./OrderWorkflowPanel";
import { UnifiedTimeline } from "@/components/admin/UnifiedTimeline";
import { ConvertConsultationPanel } from "@/components/admin/ConvertConsultationPanel";
import { LeadEmailsTab } from "@/components/admin/LeadEmailsTab";
import { AddTaskDialog } from "@/components/admin/AddTaskDialog";
import { EmployeeActionPanel } from "@/components/admin/EmployeeActionPanel";
import { STAGE_META, type OrderStage } from "@/lib/crm/computeOrderStage";
import type { FulfillmentStatus } from "@/lib/crm/fulfillment-transitions";
import type { OrderStatus } from "@/lib/orders/order-status.functions";
import {
  QUICK_ACTIONS,
  tabAvailability,
  type StatusActionKey,
  type WorkspaceTabId,
} from "@/lib/orders/order-actions-map";
import { formatIST, relativeIST } from "@/lib/datetime";

interface Props {
  orderId: string;
  data: any;
  hideAmount: boolean;
  staff: any[];
  onAssign: (id: string | null) => void;
  onRequestDocs: () => void;
  stage: OrderStage;
  timestamps: Partial<Record<OrderStage, string | null>>;
  showConsultationPanel: boolean;
  consultationMode: "select" | "awaiting_payment";
  canComplete: boolean;
  notesNode: React.ReactNode;
}

const TAB_DEFS = [
  { id: "workflow" as const, label: "Employee Workflow", icon: Workflow },
  { id: "form"     as const, label: "Forms & Docs",      icon: FileText },
  { id: "emails"   as const, label: "Emails",            icon: Mail },
  { id: "activity" as const, label: "Timeline",          icon: Activity },
  { id: "support"  as const, label: "Support Ticket",    icon: LifeBuoy },
];
type TabId = WorkspaceTabId;

export function WorkspaceShell(p: Props) {
  const qc = useQueryClient();
  const [tab, setTab] = useState<TabId>("workflow");
  const [pendingActionKey, setPendingActionKey] = useState<StatusActionKey | null>(null);
  const { application, lead, customer, service, payments, paymentStatus, total, documents, events, stageMeta } = p.data;
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

  /** Route the "next step" button (in TabStatusHeader) to the workflow tab + open dialog. */
  const handlePrimaryStep = useCallback((key: StatusActionKey) => {
    setTab("workflow");
    setPendingActionKey(key);
  }, []);

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
    <div className="space-y-5 pb-10 max-w-[1400px] mx-auto">
      {/* Top row */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <AddTaskDialog defaultApplicationId={p.orderId} defaultLeadId={application.lead_id ?? null} triggerLabel="Schedule Follow-up" />
      </div>

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

          {/* Unified action area — every tile is map-driven and always toasts. */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 h-fit min-w-[300px]">
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
                  <QuickTile
                    key={spec.key}
                    icon={spec.icon}
                    label={spec.label}
                    tint={spec.tint}
                    disabled={disabled}
                    onClick={onClick}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Status-driven employee actions — single source of truth */}
        {orderStatus && !p.showConsultationPanel && (
          <div className="mt-4">
            <EmployeeActionPanel
              orderId={p.orderId}
              status={orderStatus}
              openActionKey={pendingActionKey}
              onOpenActionHandled={() => setPendingActionKey(null)}
            />
          </div>
        )}
      </section>

      {/* Customer Journey */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
        <div className="text-[10px] uppercase tracking-[0.14em] font-bold text-indigo-600 mb-4">
          Customer Journey
        </div>
        <CustomerJourneyMap
          application={application}
          paymentSuccessfulAt={(p.data as any).paymentSuccessfulAt}
          stageMeta={stageMeta}
          workflowStatus={(application as any).workflow_status}
          closureStage={(application as any).closure_stage}
          closureNextAt={(application as any).closure_next_at}
          closureReasonLabel={(application as any).closure_reason_code}
        />
      </section>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as TabId)} className="w-full">
        <TabsList className="w-full justify-start bg-transparent border-b border-slate-200 p-0 h-auto rounded-none gap-1 overflow-x-auto flex-nowrap">
          <TooltipProvider delayDuration={200}>
            {TAB_DEFS.map((t) => {
              const Icon = t.icon;
              const state = availability[t.id];
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
              return !state.enabled && state.reason ? (
                <Tooltip key={t.id}>
                  <TooltipTrigger asChild><span>{trigger}</span></TooltipTrigger>
                  <TooltipContent>{state.reason}</TooltipContent>
                </Tooltip>
              ) : trigger;
            })}
          </TooltipProvider>
        </TabsList>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-5 mt-5">
          {/* Main */}
          <div className="min-w-0 space-y-5">
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
                <FormSubmissionPanel applicationId={application.id} isLocked={current === "completed" || current === "cancelled"} />
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
                <LeadEmailsTab leadId={lead.id} leadService={svcName} />
              ) : (
                <div className="rounded-2xl border bg-white p-6 text-sm text-slate-500">No lead linked.</div>
              )}
            </TabsContent>

            <TabsContent value="activity" className="space-y-4 mt-0 animate-fade-in">
              <UnifiedTimeline
                events={events}
                payments={p.hideAmount ? [] : payments}
                documents={documents}
                createdAt={application.created_at}
              />
            </TabsContent>

            <TabsContent value="support" className="mt-0 animate-fade-in">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                Support tickets linked to this order will appear here.
              </div>
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

            <button
              onClick={p.onRequestDocs}
              className="w-full rounded-xl border border-dashed border-indigo-300 bg-indigo-50/40 hover:bg-indigo-50 text-indigo-700 text-sm font-semibold py-3 transition"
            >
              <Check className="w-4 h-4 inline mr-1.5" /> Request Documents
            </button>
          </aside>
        </div>
      </Tabs>
    </div>
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
  href, to, onClick, icon: Icon, label, tint, external,
}: {
  href?: string | null; to?: string | null; onClick?: () => void;
  icon: any; label: string; tint: "emerald" | "sky" | "violet" | "slate"; external?: boolean;
}) {
  const disabled = !href && !to && !onClick;
  const tintMap = {
    emerald: "text-emerald-600 bg-emerald-50 hover:bg-emerald-100",
    sky:     "text-sky-600 bg-sky-50 hover:bg-sky-100",
    violet:  "text-violet-600 bg-violet-50 hover:bg-violet-100",
    slate:   "text-slate-600 bg-slate-100 hover:bg-slate-200",
  };
  const inner = (
    <>
      <span className={`w-9 h-9 grid place-items-center rounded-lg ${tintMap[tint]}`}>
        <Icon className="w-4 h-4" />
      </span>
      <span className="text-[11px] font-medium text-slate-600 mt-1">{label}</span>
    </>
  );
  const cls = `flex flex-col items-center px-1 py-1.5 rounded-lg ${disabled ? "opacity-40 pointer-events-none" : ""}`;
  if (to && !disabled) return <Link to={to} className={cls}>{inner}</Link>;
  if (href && !disabled) return <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className={cls}>{inner}</a>;
  return <button type="button" onClick={onClick} disabled={disabled} className={cls}>{inner}</button>;
}
