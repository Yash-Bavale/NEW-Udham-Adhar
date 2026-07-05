/**
 * Employee Action Panel — contextual buttons for the current order status.
 *
 * Shows only actions that are legal for `order_status` (per PRD Part 7).
 * Each button calls one atomic server fn that combines transition + email +
 * scheduler side-effects.
 */
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Send,
  PlayCircle,
  PauseCircle,
  Timer,
  Landmark,
  Award,
  CheckCircle2,
  BadgeDollarSign,
  RotateCcw,
  XCircle,
  Bell,
  AlertTriangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/hooks/useRole";

import {
  ORDER_STATUS_LABELS,
  getDelayReasons,
  type OrderStatus,
} from "@/lib/orders/order-status.functions";
import { customerSideDelay, ourSideDelay } from "@/lib/orders/order-actions.functions";
import {
  sendFormLink,
  startProcessing,
  markSubmittedToGovt,
  markCertificateIssued,
  completeOrder,
  requestRefund,
  reopenOrder,
  closeOrderManual,
  sendManualReminder,
} from "@/lib/orders/order-actions.functions";

// ─────────────────────────── Action map per status ───────────────────────────

type ActionKey =
  | "send_form_link"
  | "manual_reminder"
  | "customer_delay"
  | "our_delay"
  | "start_processing"
  | "submitted_to_govt"
  | "certificate_issued"
  | "complete"
  | "request_refund"
  | "reopen"
  | "close_manual";

const ALL_ACTIONS: Record<ActionKey, { label: string; icon: any; tone: "primary" | "warn" | "danger" | "muted" }> = {
  send_form_link: { label: "Send / Resend Form Link", icon: Send, tone: "primary" },
  manual_reminder: { label: "Send Manual Reminder", icon: Bell, tone: "muted" },
  customer_delay: { label: "Customer-Side Delay", icon: PauseCircle, tone: "warn" },
  our_delay: { label: "Our-Side Delay", icon: Timer, tone: "warn" },
  start_processing: { label: "Start Processing", icon: PlayCircle, tone: "primary" },
  submitted_to_govt: { label: "Mark Submitted to Govt", icon: Landmark, tone: "primary" },
  certificate_issued: { label: "Mark Certificate Issued", icon: Award, tone: "primary" },
  complete: { label: "Complete Order", icon: CheckCircle2, tone: "primary" },
  request_refund: { label: "Request Refund", icon: BadgeDollarSign, tone: "danger" },
  reopen: { label: "Reopen Order", icon: RotateCcw, tone: "muted" },
  close_manual: { label: "Close Order", icon: XCircle, tone: "danger" },
};

/** Which buttons appear for each status. Actions filtered further by role. */
const ACTIONS_BY_STATUS: Record<OrderStatus, ActionKey[]> = {
  NEW_ORDER: ["send_form_link", "customer_delay", "close_manual"],
  WAITING_CUSTOMER_INFO: ["send_form_link", "manual_reminder", "customer_delay", "close_manual"],
  INFO_RECEIVED: ["start_processing", "our_delay", "customer_delay"],
  IN_PROCESSING: ["our_delay", "customer_delay", "submitted_to_govt"],
  CUSTOMER_HOLD: ["send_form_link", "manual_reminder", "start_processing", "close_manual"],
  OUR_SIDE_DELAY: ["start_processing", "submitted_to_govt", "our_delay"],
  SUBMITTED_TO_GOVT: ["certificate_issued", "our_delay"],
  CERTIFICATE_ISSUED: ["complete"],
  COMPLETED: ["reopen"],
  HIGH_PRIORITY: ["start_processing", "submitted_to_govt", "our_delay", "customer_delay"],
  REFUND_REQUESTED: [],
  REFUND_APPROVED: [],
  REFUND_PROCESSED: ["close_manual"],
  CLOSED: ["reopen"],
  REOPENED: ["send_form_link", "start_processing", "customer_delay"],
};

const TONE_CLASSES: Record<string, string> = {
  primary: "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:opacity-90",
  warn: "bg-amber-500 text-white hover:bg-amber-600",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
  muted: "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50",
};

// ─────────────────────────── Panel ───────────────────────────

export function EmployeeActionPanel({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const qc = useQueryClient();
  const role = useRole();
  const [openAction, setOpenAction] = useState<ActionKey | null>(null);

  const actions = useMemo(() => {
    const base = ACTIONS_BY_STATUS[status] ?? [];
    // Refunds gated to super_admin.
    if (!role.has("super_admin")) {
      return base.filter((a) => a !== "request_refund" && a !== "reopen");
    }
    // Add refund entry for statuses where it makes sense.
    const canRefund = ["IN_PROCESSING", "SUBMITTED_TO_GOVT", "CUSTOMER_HOLD", "OUR_SIDE_DELAY", "HIGH_PRIORITY"].includes(
      status,
    );
    return canRefund && !base.includes("request_refund") ? [...base, "request_refund" as ActionKey] : base;
  }, [status, role]);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin.order", orderId] });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Employee Actions</div>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-medium">
              {ORDER_STATUS_LABELS[status]}
            </Badge>
          </div>
        </div>
        {status === "HIGH_PRIORITY" && (
          <div className="flex items-center gap-1 text-rose-600 text-xs font-semibold">
            <AlertTriangle className="size-4" /> Escalated
          </div>
        )}
      </div>

      {actions.length === 0 ? (
        <p className="text-sm text-slate-500 italic">
          No actions available in this status. {role.has("super_admin") ? "" : "Contact a Super Admin."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {actions.map((key) => {
            const meta = ALL_ACTIONS[key];
            const Icon = meta.icon;
            return (
              <Button
                key={key}
                onClick={() => setOpenAction(key)}
                className={`${TONE_CLASSES[meta.tone]} justify-start h-auto py-2.5 px-3 text-sm`}
                variant="ghost"
              >
                <Icon className="size-4 mr-2 shrink-0" />
                <span className="text-left">{meta.label}</span>
              </Button>
            );
          })}
        </div>
      )}

      {openAction && (
        <ActionDialog
          action={openAction}
          orderId={orderId}
          onClose={() => setOpenAction(null)}
          onDone={() => {
            setOpenAction(null);
            invalidate();
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────── Action Dialogs ───────────────────────────

function ActionDialog({
  action,
  orderId,
  onClose,
  onDone,
}: {
  action: ActionKey;
  orderId: string;
  onClose: () => void;
  onDone: () => void;
}) {
  const meta = ALL_ACTIONS[action];

  // Server fns (wrapped once per dialog)
  const fns = {
    send_form_link: useServerFn(sendFormLink),
    manual_reminder: useServerFn(sendManualReminder),
    customer_delay: useServerFn(customerSideDelay),
    our_delay: useServerFn(ourSideDelay),
    start_processing: useServerFn(startProcessing),
    submitted_to_govt: useServerFn(markSubmittedToGovt),
    certificate_issued: useServerFn(markCertificateIssued),
    complete: useServerFn(completeOrder),
    request_refund: useServerFn(requestRefund),
    reopen: useServerFn(reopenOrder),
    close_manual: useServerFn(closeOrderManual),
  };

  const [reasonId, setReasonId] = useState<string>("");
  const [remarks, setRemarks] = useState("");
  const [reference, setReference] = useState("");
  const [reminderNote, setReminderNote] = useState("");
  const [ourMode, setOurMode] = useState<"grace" | "auto" | "manual" | "stop">("grace");
  const [refundReason, setRefundReason] = useState("");

  const needsReason = action === "customer_delay" || action === "our_delay" || action === "close_manual";
  const reasonsFn = useServerFn(getDelayReasons);
  const { data: reasons } = useQuery({
    queryKey: ["admin.delay_reasons"],
    queryFn: () => reasonsFn(),
    enabled: needsReason,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      switch (action) {
        case "send_form_link":
          return await fns.send_form_link({ data: { orderId, transitionToWaiting: true } });
        case "manual_reminder":
          return await fns.manual_reminder({ data: { orderId, note: reminderNote } });
        case "customer_delay":
          if (!reasonId) throw new Error("Pick a reason");
          return await fns.customer_delay({ data: { orderId, reasonId, remarks } });
        case "our_delay":
          if (!reasonId) throw new Error("Pick a reason");
          return await fns.our_delay({ data: { orderId, reasonId, remarks, mode: ourMode } });
        case "start_processing":
          return await fns.start_processing({ data: { orderId } });
        case "submitted_to_govt":
          return await fns.submitted_to_govt({ data: { orderId, referenceNumber: reference || undefined } });
        case "certificate_issued":
          return await fns.certificate_issued({ data: { orderId } });
        case "complete":
          return await fns.complete({ data: { orderId } });
        case "request_refund":
          return await fns.request_refund({ data: { orderId, reason: refundReason } });
        case "reopen":
          return await fns.reopen({ data: { orderId, remarks } });
        case "close_manual":
          return await fns.close_manual({
            data: { orderId, reasonId: reasonId || undefined, remarks: remarks || undefined },
          });
      }
    },
    onSuccess: () => {
      toast.success(`${meta.label} — done`);
      onDone();
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{meta.label}</DialogTitle>
          <DialogDescription>Confirm and submit — this is logged in the timeline.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {needsReason && (
            <div className="space-y-1.5">
              <Label>Reason</Label>
              <Select value={reasonId} onValueChange={setReasonId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pick a reason" />
                </SelectTrigger>
                <SelectContent>
                  {(reasons ?? []).map((r: any) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {action === "our_delay" && (
            <div className="space-y-1.5">
              <Label>Reminder mode</Label>
              <Select value={ourMode} onValueChange={(v) => setOurMode(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grace">30-min grace, then auto every 2h</SelectItem>
                  <SelectItem value="auto">Auto reminder every 2h</SelectItem>
                  <SelectItem value="manual">One-time reminder</SelectItem>
                  <SelectItem value="stop">No reminder (reason only)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                3 unattended auto reminders escalate the order to High Priority.
              </p>
            </div>
          )}

          {action === "submitted_to_govt" && (
            <div className="space-y-1.5">
              <Label>Govt reference / ARN</Label>
              <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Optional" />
            </div>
          )}

          {action === "manual_reminder" && (
            <div className="space-y-1.5">
              <Label>Short note (optional)</Label>
              <Textarea rows={3} value={reminderNote} onChange={(e) => setReminderNote(e.target.value)} />
            </div>
          )}

          {action === "request_refund" && (
            <div className="space-y-1.5">
              <Label>Reason for refund</Label>
              <Textarea rows={3} value={refundReason} onChange={(e) => setRefundReason(e.target.value)} />
            </div>
          )}

          {(action === "customer_delay" ||
            action === "our_delay" ||
            action === "close_manual" ||
            action === "reopen") && (
            <div className="space-y-1.5">
              <Label>Remarks (optional)</Label>
              <Textarea rows={2} value={remarks} onChange={(e) => setRemarks(e.target.value)} />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button
            className={TONE_CLASSES[meta.tone]}
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? "Working…" : meta.label}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
