import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, MessageSquare, StickyNote } from "lucide-react";

import { getOrderDetailV2, updateOrderAssignee, addOrderNoteV2 } from "@/lib/crm/orders-v2.functions";
import { listStaff } from "@/lib/crm/leads-admin.functions";
import { queueDocumentReminder } from "@/lib/crm/reminders.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { FulfillmentStatusUpdater } from "@/components/admin/FulfillmentStatusUpdater";
import { OrderDocumentsPanel } from "@/components/admin/OrderDocumentsPanel";
import { OrderPaymentsPanel } from "@/components/admin/OrderPaymentsPanel";
import { FormSubmissionPanel } from "@/components/admin/FormSubmissionPanel";
import { AddTaskDialog } from "@/components/admin/AddTaskDialog";
import { OrderCommandHeader } from "@/components/admin/OrderCommandHeader";
import { OrderActionBar } from "@/components/admin/OrderActionBar";
import { ProcessTracker } from "@/components/admin/ProcessTracker";
import { ProcessingChecklist } from "@/components/admin/ProcessingChecklist";
import { UnifiedTimeline } from "@/components/admin/UnifiedTimeline";
import { WorkflowTimelinePanel } from "@/components/admin/WorkflowTimelinePanel";
import { StageActionsPanel } from "@/components/admin/StageActionsPanel";
import { ConvertConsultationPanel } from "@/components/admin/ConvertConsultationPanel";
import { computeOrderStage, STAGE_META, type OrderStage } from "@/lib/crm/computeOrderStage";
import { isConvertedConsultationLead, isUnconvertedConsultationLead } from "@/lib/crm/consultation";
import type { FulfillmentStatus } from "@/lib/crm/fulfillment-transitions";
import { useRole } from "@/hooks/useRole";
import { formatIST } from "@/lib/datetime";

export const Route = createFileRoute("/admin/orders/$orderId")({ component: OrderDetailPage });

function OrderDetailPage() {
  const { orderId } = Route.useParams();
  const qc = useQueryClient();
  const role = useRole();
  const detailFn = useServerFn(getOrderDetailV2);
  const staffFn = useServerFn(listStaff);
  const assignFn = useServerFn(updateOrderAssignee);
  const reminderFn = useServerFn(queueDocumentReminder);

  const { data, isLoading } = useQuery({
    queryKey: ["admin.order", orderId],
    queryFn: () => detailFn({ data: { orderId } }),
  });
  const { data: staffData } = useQuery({
    queryKey: ["admin.staff"],
    queryFn: () => staffFn(),
  });

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-16 rounded-xl" style={{ background: "var(--admin-surface-2)" }} />
        <div className="h-12 rounded-xl" style={{ background: "var(--admin-surface-2)" }} />
        <div className="h-24 rounded-xl" style={{ background: "var(--admin-surface-2)" }} />
      </div>
    );
  }
  if (!data) return null;

  const { application, lead, customer, service, payments, paymentStatus, paymentSuccessfulAt, total, documents, events, stageMeta } = data as any;
  const current = (application.fulfillment_status ?? "order_received") as FulfillmentStatus;
  const stage: OrderStage = computeOrderStage({ ...(lead ?? {}), payment_successful_at: paymentSuccessfulAt }, application);
  const selectStep = !!lead?.id && !!lead?.lead_code && isUnconvertedConsultationLead(lead);
  const awaitingSecondPayment =
    !!lead?.id && !!lead?.lead_code &&
    isConvertedConsultationLead(lead) &&
    (application as any)?.application_status === "awaiting_payment";
  const showConsultationPanel = selectStep || awaitingSecondPayment;
  const consultationMode: "select" | "awaiting_payment" = selectStep ? "select" : "awaiting_payment";

  // Default-hide money: only finance/admin roles see rupee figures.
  // Using role.hideMoney() ensures the UI is hidden during role-loading too.
  const hideAmount = role.hideMoney();

  // Build timestamps for the process tracker tooltips
  const timestamps: Partial<Record<OrderStage, string | null>> = {
    lead_received: application.created_at,
    payment_done: paymentSuccessfulAt ?? null,
    form_submitted: application?.form_submitted_at ?? null,
    under_review: stageMeta?.verification_pending?.at ?? null,
    in_progress: stageMeta?.documents_received?.at ?? null,
    submitted_to_govt: stageMeta?.application_submitted?.at ?? null,
    certificate_ready: application?.certificate_uploaded_at ?? null,
    completed: stageMeta?.completed?.at ?? null,
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const setAssignee = async (v: string | null) => {
    try {
      await assignFn({ data: { orderId, assignedTo: v } });
      toast.success("Assignee updated");
      qc.invalidateQueries({ queryKey: ["admin.order", orderId] });
    } catch (e: any) { toast.error(e?.message ?? "Failed"); }
  };

  const requestDocs = async () => {
    if (!lead?.id) { toast.error("No lead linked"); return; }
    try {
      await reminderFn({ data: { leadId: lead.id } });
      toast.success("Reminder queued");
    } catch (e: any) { toast.error(e?.message ?? "Failed"); }
  };

  return (
    <div className="space-y-4 -mt-2">
      <div className="flex items-center justify-between">
        <Link to="/admin/orders" className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: "var(--admin-fg-muted)" }}>
          <ChevronLeft className="w-3.5 h-3.5" /> Back to orders
        </Link>
        <AddTaskDialog defaultApplicationId={orderId} defaultLeadId={application.lead_id ?? null} />
      </div>

      {/* Sticky workspace header */}
      <OrderCommandHeader
        orderCode={application.application_code}
        customerName={customer?.name ?? lead?.name ?? "—"}
        customerMobile={customer?.primary_mobile ?? lead?.mobile}
        serviceName={service?.service_name ?? lead?.service ?? "—"}
        stage={stage}
        paymentStatus={paymentStatus}
        total={total}
        createdAt={application.created_at}
        assignedTo={application.assigned_to ?? null}
        staff={staffData?.profiles ?? []}
        onAssign={setAssignee}
        leadId={lead?.id ?? null}
        hideAmount={hideAmount}
      />

      {/* Persistent action bar */}
      <OrderActionBar
        customerMobile={customer?.primary_mobile ?? lead?.mobile}
        customerEmail={customer?.primary_email ?? lead?.email}
        serviceName={service?.service_name ?? lead?.service}
        orderCode={application.application_code}
        canComplete={!role.has("support")}
        onRequestDocs={requestDocs}
        onUploadCert={() => scrollTo("order-fulfillment")}
        onComplete={() => scrollTo("order-fulfillment")}
      />

      {/* Process tracker */}
      <ProcessTracker stage={stage} timestamps={timestamps} />

      {/* Stage-aware next step */}
      <StageActionsPanel
        stage={stage}
        leadId={lead?.id ?? null}
        leadCode={lead?.lead_code ?? null}
        onScrollTo={(t) => scrollTo(`order-${t}`)}
      />

      {/* Workspace canvas */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {showConsultationPanel && (
            <div id="order-consultation" className="scroll-mt-32 space-y-3">
              <ConsultationContactStrip
                name={customer?.name ?? lead?.name ?? "—"}
                mobile={customer?.primary_mobile ?? lead?.mobile ?? null}
                email={customer?.primary_email ?? lead?.email ?? null}
              />
              <ConvertConsultationPanel leadId={lead.id} leadCode={lead.lead_code} />
            </div>
          )}

          {/* Talk-to-Expert orders have no onboarding form / fulfillment until staff
              calls the customer and picks the real service. Hide both panels until then. */}
          {!showConsultationPanel && (
            <>
              <div id="order-form" className="scroll-mt-32">
                <FormSubmissionPanel applicationId={application.id} />
              </div>

              <div id="order-fulfillment" className="scroll-mt-32">
                <FulfillmentStatusUpdater orderId={application.id} current={current} />
              </div>

              <ProcessingChecklist payments={payments} documents={documents} application={application} hideAmount={hideAmount} />
            </>
          )}

          <div id="order-workflow" className="scroll-mt-32">
            <WorkflowTimelinePanel applicationId={application.id} workflowStatus={(application as any).workflow_status} />
          </div>

          <UnifiedTimeline
            events={events}
            payments={hideAmount ? [] : payments}
            documents={documents}
            createdAt={application.created_at}
          />


          <div id="order-notes" className="scroll-mt-32">
            <InternalNotes orderId={orderId} />
          </div>
        </div>

        <div className="space-y-4">
          {/* Customer mini-profile — always show full contact (name, mobile, email) */}
          {(() => {
            const cName = customer?.name ?? lead?.name ?? "—";
            const cMobile = customer?.primary_mobile ?? lead?.mobile ?? null;
            const cEmail = customer?.primary_email ?? lead?.email ?? null;
            const waPhone = cMobile ? String(cMobile).replace(/\D/g, "") : "";
            const waUrl = waPhone ? `https://wa.me/${waPhone.length === 10 ? "91" + waPhone : waPhone}` : null;
            return (
              <div className="rounded-xl border bg-white p-5" style={{ borderColor: "var(--admin-border)" }}>
                <div className="text-[10px] uppercase tracking-[0.14em] font-semibold mb-2" style={{ color: "var(--admin-fg-muted)" }}>Customer</div>
                <div className="text-sm font-semibold">{cName}</div>
                {cMobile && <div className="text-xs mt-0.5 font-mono" style={{ color: "var(--admin-fg-muted)" }}>{cMobile}</div>}
                {cEmail && <div className="text-xs mt-0.5 break-all" style={{ color: "var(--admin-fg-muted)" }}>{cEmail}</div>}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {cMobile && <a href={`tel:${cMobile}`} className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50">Call</a>}
                  {waUrl && <a href={waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 hover:bg-emerald-100">WhatsApp</a>}
                  {cEmail && <a href={`mailto:${cEmail}`} className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50">Email</a>}
                </div>
                {customer?.id && (
                  <Link
                    to="/admin/customers/$customerId"
                    params={{ customerId: customer.id }}
                    className="mt-3 inline-block text-xs font-medium text-blue-600 hover:underline"
                  >
                    Open full profile →
                  </Link>
                )}
              </div>
            );
          })()}

          <div id="order-documents" className="scroll-mt-32">
            <OrderDocumentsPanel
              orderId={orderId}
              documents={documents}
              deletedAt={application.documents_deleted_at}
              deletedReason={application.documents_deleted_reason}
              hideMoney={hideAmount}
            />
          </div>

          {!hideAmount && <OrderPaymentsPanel payments={payments} />}

          <StageSummaryCard stage={stage} timestamps={timestamps} />
        </div>
      </div>
    </div>
  );
}

function ConsultationContactStrip({
  name, mobile, email,
}: { name: string; mobile: string | null; email: string | null }) {
  const waPhone = mobile ? String(mobile).replace(/\D/g, "") : "";
  const waUrl = waPhone ? `https://wa.me/${waPhone.length === 10 ? "91" + waPhone : waPhone}` : null;
  return (
    <div className="rounded-xl border bg-white p-4 flex flex-wrap items-center gap-x-5 gap-y-2" style={{ borderColor: "var(--admin-border)" }}>
      <div>
        <div className="text-[10px] uppercase tracking-[0.14em] font-semibold" style={{ color: "var(--admin-fg-muted)" }}>Customer</div>
        <div className="text-sm font-semibold">{name}</div>
      </div>
      {mobile && (
        <div>
          <div className="text-[10px] uppercase tracking-[0.14em] font-semibold" style={{ color: "var(--admin-fg-muted)" }}>Mobile</div>
          <div className="text-sm font-mono">{mobile}</div>
        </div>
      )}
      {email && (
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.14em] font-semibold" style={{ color: "var(--admin-fg-muted)" }}>Email</div>
          <div className="text-sm break-all">{email}</div>
        </div>
      )}
      <div className="flex flex-wrap gap-1.5 ml-auto">
        {mobile && <a href={`tel:${mobile}`} className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50">Call</a>}
        {waUrl && <a href={waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100">WhatsApp</a>}
        {email && <a href={`mailto:${email}`} className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50">Email</a>}
      </div>
    </div>
  );
}

function StageSummaryCard({
  stage, timestamps,
}: { stage: OrderStage; timestamps: Partial<Record<OrderStage, string | null>> }) {
  const meta = STAGE_META[stage];
  return (
    <div className="rounded-xl border bg-white p-5" style={{ borderColor: "var(--admin-border)" }}>
      <div className="text-[10px] uppercase tracking-[0.14em] font-semibold mb-2" style={{ color: "var(--admin-fg-muted)" }}>
        Current Stage
      </div>
      <div className="text-base font-bold" style={{ color: "var(--admin-fg)" }}>{meta.label}</div>
      <div className="text-xs mt-1" style={{ color: "var(--admin-fg-muted)" }}>
        Entered {formatIST(timestamps[stage])}
      </div>
    </div>
  );
}

function InternalNotes({ orderId }: { orderId: string }) {
  const qc = useQueryClient();
  const noteFn = useServerFn(addOrderNoteV2);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!note.trim()) return;
    setBusy(true);
    try {
      await noteFn({ data: { orderId, note: note.trim() } });
      setNote("");
      qc.invalidateQueries({ queryKey: ["admin.order", orderId] });
      toast.success("Note added");
    } catch (e: any) { toast.error(e?.message ?? "Failed"); }
    finally { setBusy(false); }
  };

  return (
    <div className="rounded-xl border bg-white p-5 space-y-3" style={{ borderColor: "var(--admin-border)" }}>
      <div className="flex items-center gap-2">
        <StickyNote className="size-4" style={{ color: "var(--admin-fg-muted)" }} />
        <h3 className="text-sm font-semibold">Add Internal Note</h3>
      </div>
      <Label className="text-[10px] uppercase tracking-wider" style={{ color: "var(--admin-fg-muted)" }}>
        <MessageSquare className="size-3 inline mr-1" />
        Visible to staff only — appears in the Timeline
      </Label>
      <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Type a note…" rows={3} />
      <div className="flex justify-end">
        <Button size="sm" disabled={busy || !note.trim()} onClick={submit}>
          {busy ? "Saving…" : "Add Note"}
        </Button>
      </div>
    </div>
  );
}
