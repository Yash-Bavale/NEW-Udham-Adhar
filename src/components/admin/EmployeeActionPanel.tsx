/**
 * Employee Action Panel — contextual buttons for the current order status.
 *
 * Shows only actions that are legal for `order_status` (per PRD Part 7).
 * Each button calls one atomic server fn that combines transition + email +
 * scheduler side-effects.
 */
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

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
import {
  REFUND_ELIGIBLE_STATUSES,
  STATUS_ACTIONS,
  STATUS_ACTION_META,
  type StatusActionKey,
} from "@/lib/orders/order-actions-map";

// Local alias so we don't rename the whole file.
type ActionKey = StatusActionKey;
const ALL_ACTIONS = STATUS_ACTION_META;

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
  openActionKey,
  onOpenActionHandled,
}: {
  orderId: string;
  status: OrderStatus;
  /** External trigger (from TabStatusHeader "next step" button). */
  openActionKey?: ActionKey | null;
  onOpenActionHandled?: () => void;
}) {
  const qc = useQueryClient();
  const role = useRole();
  const [openAction, setOpenAction] = useState<ActionKey | null>(null);

  const actions = useMemo(() => {
    const base = STATUS_ACTIONS[status] ?? [];
    if (!role.has("super_admin")) {
      return base.filter((a) => a !== "request_refund" && a !== "reopen");
    }
    const canRefund = REFUND_ELIGIBLE_STATUSES.includes(status);
    return canRefund && !base.includes("request_refund") ? [...base, "request_refund" as ActionKey] : base;
  }, [status, role]);

  // Honor external "open this action" requests (from TabStatusHeader).
  useEffect(() => {
    if (openActionKey && actions.includes(openActionKey)) {
      setOpenAction(openActionKey);
      onOpenActionHandled?.();
    } else if (openActionKey) {
      // Requested action isn't available in this status — nudge the user.
      toast.error(`"${STATUS_ACTION_META[openActionKey].label}" isn't available in this status.`);
      onOpenActionHandled?.();
    }
  }, [openActionKey, actions, onOpenActionHandled]);

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
