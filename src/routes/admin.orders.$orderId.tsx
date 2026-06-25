import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, ExternalLink, MessageSquare } from "lucide-react";

import { getOrderDetailV2, updateOrderAssignee, addOrderNoteV2 } from "@/lib/crm/orders-v2.functions";
import { listStaff } from "@/lib/crm/leads-admin.functions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";


import { OrderJourneyStepper } from "@/components/admin/OrderJourneyStepper";
import { FulfillmentStatusUpdater } from "@/components/admin/FulfillmentStatusUpdater";
import { OrderDocumentsPanel } from "@/components/admin/OrderDocumentsPanel";
import { OrderPaymentsPanel } from "@/components/admin/OrderPaymentsPanel";
import { FormSubmissionPanel } from "@/components/admin/FormSubmissionPanel";
import { AddTaskDialog } from "@/components/admin/AddTaskDialog";
import { StageJourneyStrip } from "@/components/admin/StageJourneyStrip";
import { StageActionsPanel } from "@/components/admin/StageActionsPanel";
import { computeOrderStage } from "@/lib/crm/computeOrderStage";
import type { FulfillmentStatus } from "@/lib/crm/fulfillment-transitions";

export const Route = createFileRoute("/admin/orders/$orderId")({ component: OrderDetailPage });

function OrderDetailPage() {
  const { orderId } = Route.useParams();
  const qc = useQueryClient();
  const detailFn = useServerFn(getOrderDetailV2);
  const staffFn = useServerFn(listStaff);
  const assignFn = useServerFn(updateOrderAssignee);

  const { data, isLoading } = useQuery({
    queryKey: ["admin.order", orderId],
    queryFn: () => detailFn({ data: { orderId } }),
  });
  const { data: staffData } = useQuery({
    queryKey: ["admin.staff"],
    queryFn: () => staffFn(),
  });

  if (isLoading) return <div className="p-10 text-center text-slate-500">Loading order…</div>;
  if (!data) return null;

  const { application, lead, customer, service, payments, paymentStatus, total, documents, events, assignedStaff, workflowStages, stageMeta } = data as any;
  const current = (application.fulfillment_status ?? "order_received") as FulfillmentStatus;
  const stage = computeOrderStage(lead, application);

  const scrollTo = (target: "fulfillment" | "form" | "documents" | "notes") => {
    const el = document.getElementById(`order-${target}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const setAssignee = async (v: string) => {
    try {
      await assignFn({ data: { orderId, assignedTo: v || null } });
      toast.success("Assignee updated");
      qc.invalidateQueries({ queryKey: ["admin.order", orderId] });
    } catch (e: any) { toast.error(e?.message ?? "Failed"); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Link to="/admin/orders" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900">
          <ChevronLeft className="w-4 h-4" /> Back to orders
        </Link>
        <AddTaskDialog defaultApplicationId={orderId} defaultLeadId={application.lead_id ?? null} />
      </div>

      {/* Summary bar */}
      <div className="rounded-lg border bg-white p-4 grid md:grid-cols-7 gap-4 items-center" style={{ borderColor: "var(--admin-border)" }}>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Order #</div>
          <div className="font-mono text-sm font-semibold text-slate-800">{application.application_code}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Customer</div>
          <div className="text-sm text-slate-800">{customer?.name ?? lead?.name ?? "—"}</div>
          {customer?.primary_mobile && <div className="text-[10px] text-slate-500">{customer.primary_mobile}</div>}
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Service</div>
          <div className="text-sm text-slate-800">{service?.service_name ?? lead?.service ?? "—"}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Created</div>
          <div className="text-sm text-slate-800">
            {new Date(application.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Assigned</div>
          <select
            value={application.assigned_to ?? ""}
            onChange={(e) => setAssignee(e.target.value)}
            className="w-full rounded-md border px-2 py-1 text-xs bg-white"
          >
            <option value="">Unassigned</option>
            {(staffData?.profiles ?? []).map((s: any) => (
              <option key={s.id} value={s.id}>{s.display_name || s.email}</option>
            ))}
          </select>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Total</div>
          <div className="text-sm font-semibold text-slate-800">₹{Number(total ?? 0).toLocaleString("en-IN")}</div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Payment</div>
            <Badge variant="secondary" className="text-[10px]">{paymentStatus}</Badge>
          </div>
          {lead?.id && (
            <Link to="/admin/leads/$leadId" params={{ leadId: lead.id }} className="text-xs text-blue-600 inline-flex items-center gap-1 hover:underline">
              Lead <ExternalLink className="size-3" />
            </Link>
          )}
        </div>
      </div>

      <OrderJourneyStepper current={current} stages={workflowStages} stageMeta={stageMeta} />

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <FulfillmentStatusUpdater orderId={orderId} current={current} />
          <FormSubmissionPanel applicationId={orderId} />
          <InternalActivity orderId={orderId} leadId={application.lead_id} events={events} />
        </div>
        <div className="space-y-5">
          <OrderDocumentsPanel
            orderId={orderId}
            documents={documents}
            deletedAt={application.documents_deleted_at}
            deletedReason={application.documents_deleted_reason}
          />
          <OrderPaymentsPanel payments={payments} />
        </div>
      </div>
    </div>
  );
}

function InternalActivity({
  orderId, events,
}: { orderId: string; leadId?: string | null; events: any[] }) {
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

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: true });

  return (
    <div className="rounded-lg border bg-white p-5 space-y-3" style={{ borderColor: "var(--admin-border)" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-4 text-slate-600" />
          <h3 className="text-sm font-semibold">Internal Notes & Activity</h3>
        </div>
        <span className="text-xs text-slate-500">{events.length} events</span>
      </div>

      {events.length === 0 ? (
        <div className="text-sm text-slate-500 italic">No activity yet.</div>
      ) : (
        <ul className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
          {events.map((e: any) => (
            <li key={e.id} className="border border-l-4 border-l-slate-300 rounded-md p-3 bg-slate-50">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <div>
                  <span className="font-semibold text-slate-700">{e.staff_name ?? "System"}</span>
                  {e.staff_role && <span className="ml-1.5 px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] uppercase">{e.staff_role}</span>}
                </div>
                <div>{fmt(e.created_at)}</div>
              </div>
              <div className="text-sm text-slate-800 mt-1">
                {e.event_type === "status_change" && (<>Fulfillment: <b>{e.old_value ?? "—"}</b> → <b>{e.new_value}</b></>)}
                {e.event_type === "assignment_change" && <>Assignee changed</>}
                {e.event_type === "note_added" && <i>Internal note</i>}
                {!["status_change", "assignment_change", "note_added"].includes(e.event_type) && (
                  <span className="capitalize">{e.event_type.replace(/_/g, " ")}</span>
                )}
              </div>
              {e.note && <div className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">{e.note}</div>}
            </li>
          ))}
        </ul>
      )}

      <div className="pt-3 border-t space-y-2" style={{ borderColor: "var(--admin-border)" }}>
        <Label className="text-xs uppercase tracking-wider text-slate-500">Add Note</Label>
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Internal note (visible to staff only)" rows={2} />
        <div className="flex justify-end">
          <Button size="sm" disabled={busy || !note.trim()} onClick={submit}>
            {busy ? "Saving…" : "Add Note"}
          </Button>
        </div>
      </div>
    </div>
  );
}
