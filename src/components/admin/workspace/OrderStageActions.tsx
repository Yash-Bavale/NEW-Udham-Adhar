// Phase 3 — Stage-aware action panel wired to the Phase 2 server functions.
// Renders alongside the legacy OrderActionRail during transition; owns the new
// buttons: Form Pending, Form Received, Technical Hold (external/internal),
// Await Govt, Resume from Hold, System Close (E010), Govt Rejected.

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Send, CheckCircle2, Pause, Landmark, PlayCircle, XOctagon, AlertOctagon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

import { ReasonPicker } from "./ReasonPicker";
import { ReminderCadencePicker } from "./ReminderCadencePicker";

import {
  markFormPending, markFormReceived, startTechnicalHold, markAwaitingGovt,
  resumeFromHold,
} from "@/lib/orders/actions/hold-actions.functions";
import {
  closeOrderSystem, handleGovtRejected,
} from "@/lib/orders/actions/close-actions.functions";
import type { OrderStatus } from "@/lib/orders/order-status.functions";

type ActionKind =
  | "form_pending" | "form_received"
  | "tech_hold" | "await_govt" | "resume"
  | "close_system" | "govt_rejected";

interface Props {
  orderId: string;
  currentStatus: OrderStatus;
  onChanged?: () => void;
}

export function OrderStageActions({ orderId, currentStatus, onChanged }: Props) {
  const qc = useQueryClient();
  const [openAction, setOpenAction] = useState<ActionKind | null>(null);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["order", orderId] });
    qc.invalidateQueries({ queryKey: ["applications"] });
    qc.invalidateQueries({ queryKey: ["workflow-timers", orderId] });
    onChanged?.();
  };

  const runFormPending = useServerFn(markFormPending);
  const runFormReceived = useServerFn(markFormReceived);

  const formPendingMut = useMutation({
    mutationFn: () => runFormPending({ data: { orderId, transitionOnly: false } }),
    onSuccess: () => { toast.success("Form Pending — nudge in 4h, auto-close in 8h"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const formReceivedMut = useMutation({
    mutationFn: () => runFormReceived({ data: { orderId } }),
    onSuccess: () => { toast.success("Form marked received"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const buttons = getStageButtons(currentStatus);
  if (buttons.length === 0) return null;

  return (
    <Card className="p-4">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Stage actions
      </div>
      <div className="flex flex-wrap gap-2">
        {buttons.includes("form_pending") && (
          <Button size="sm" variant="outline" onClick={() => formPendingMut.mutate()} disabled={formPendingMut.isPending}>
            <Send className="h-4 w-4 mr-1.5" /> Form Pending
          </Button>
        )}
        {buttons.includes("form_received") && (
          <Button size="sm" variant="outline" onClick={() => formReceivedMut.mutate()} disabled={formReceivedMut.isPending}>
            <CheckCircle2 className="h-4 w-4 mr-1.5" /> Form Received
          </Button>
        )}
        {buttons.includes("tech_hold") && (
          <Button size="sm" variant="outline" onClick={() => setOpenAction("tech_hold")}>
            <Pause className="h-4 w-4 mr-1.5" /> Technical Hold
          </Button>
        )}
        {buttons.includes("await_govt") && (
          <Button size="sm" variant="outline" onClick={() => setOpenAction("await_govt")}>
            <Landmark className="h-4 w-4 mr-1.5" /> Awaiting Govt
          </Button>
        )}
        {buttons.includes("resume") && (
          <Button size="sm" variant="outline" onClick={() => setOpenAction("resume")}>
            <PlayCircle className="h-4 w-4 mr-1.5" /> Resume
          </Button>
        )}
        {buttons.includes("close_system") && (
          <Button size="sm" variant="outline" onClick={() => setOpenAction("close_system")}>
            <XOctagon className="h-4 w-4 mr-1.5" /> System Close
          </Button>
        )}
        {buttons.includes("govt_rejected") && (
          <Button size="sm" variant="destructive" onClick={() => setOpenAction("govt_rejected")}>
            <AlertOctagon className="h-4 w-4 mr-1.5" /> Govt Rejected
          </Button>
        )}
      </div>

      {openAction === "tech_hold" && (
        <TechnicalHoldDialog orderId={orderId} onDone={() => { invalidate(); setOpenAction(null); }} onClose={() => setOpenAction(null)} />
      )}
      {openAction === "await_govt" && (
        <AwaitGovtDialog orderId={orderId} onDone={() => { invalidate(); setOpenAction(null); }} onClose={() => setOpenAction(null)} />
      )}
      {openAction === "resume" && (
        <ResumeDialog orderId={orderId} onDone={() => { invalidate(); setOpenAction(null); }} onClose={() => setOpenAction(null)} />
      )}
      {openAction === "close_system" && (
        <SystemCloseDialog orderId={orderId} onDone={() => { invalidate(); setOpenAction(null); }} onClose={() => setOpenAction(null)} />
      )}
      {openAction === "govt_rejected" && (
        <GovtRejectedDialog orderId={orderId} onDone={() => { invalidate(); setOpenAction(null); }} onClose={() => setOpenAction(null)} />
      )}
    </Card>
  );
}

// ── stage → button map ────────────────────────────────────────────
function getStageButtons(status: OrderStatus): ActionKind[] {
  switch (status) {
    case "NEW_ORDER":
    case "PAYMENT_RECEIVED":
    case "ORDER_RECEIVED":
      return ["form_pending"];
    case "FORM_PENDING":
      return ["form_received", "close_system"];
    case "FORM_RECEIVED":
    case "INFO_RECEIVED":
    case "IN_PROCESSING":
      return ["tech_hold", "await_govt", "close_system"];
    case "TECHNICAL_HOLD_EXTERNAL":
    case "TECHNICAL_HOLD_INTERNAL":
    case "CUSTOMER_HOLD":
      return ["resume", "close_system"];
    case "SUBMITTED_TO_GOVT":
      return ["await_govt", "govt_rejected", "close_system"];
    case "AWAITING_GOVT_APPROVAL":
    case "CHECKING_STATUS":
      return ["govt_rejected", "close_system"];
    default:
      return [];
  }
}

// ── dialogs ───────────────────────────────────────────────────────
function TechnicalHoldDialog({ orderId, onDone, onClose }: { orderId: string; onDone: () => void; onClose: () => void }) {
  const run = useServerFn(startTechnicalHold);
  const [kind, setKind] = useState<"external" | "internal">("internal");
  const [reasonId, setReasonId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [minutes, setMinutes] = useState(60 * 4); // default 4h
  const mut = useMutation({
    mutationFn: () => run({ data: { orderId, kind, reasonId: reasonId!, reminderMinutes: minutes, remarks: reply || null } }),
    onSuccess: () => { toast.success(`Technical Hold (${kind}) armed`); onDone(); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Start Technical Hold</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="text-xs uppercase tracking-wider text-slate-500">Hold type</div>
            <Select value={kind} onValueChange={(v) => setKind(v as "external" | "internal")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="external">External — Govt / Portal (customer notified)</SelectItem>
                <SelectItem value="internal">Internal — Our team (silent)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ReasonPicker
            value={reasonId}
            onChange={(id) => setReasonId(id)}
            reply={reply}
            onReplyChange={setReply}
            hideReply={kind === "internal"}
          />
          <ReminderCadencePicker value={minutes} onChange={setMinutes} />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button disabled={!reasonId || mut.isPending} onClick={() => mut.mutate()}>Start hold</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AwaitGovtDialog({ orderId, onDone, onClose }: { orderId: string; onDone: () => void; onClose: () => void }) {
  const run = useServerFn(markAwaitingGovt);
  const [minutes, setMinutes] = useState(60 * 24); // default 1d
  const mut = useMutation({
    mutationFn: () => run({ data: { orderId, reminderMinutes: minutes } }),
    onSuccess: () => { toast.success("Awaiting Govt Approval — internal reminders armed"); onDone(); },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Awaiting Govt Approval</DialogTitle></DialogHeader>
        <p className="text-sm text-slate-600">Reminders are internal-only — the customer is not emailed.</p>
        <ReminderCadencePicker value={minutes} onChange={setMinutes} label="Internal reminder cadence" />
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button disabled={mut.isPending} onClick={() => mut.mutate()}>Arm reminder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ResumeDialog({ orderId, onDone, onClose }: { orderId: string; onDone: () => void; onClose: () => void }) {
  const run = useServerFn(resumeFromHold);
  const [target, setTarget] = useState<"IN_PROCESSING" | "FORM_RECEIVED" | "INFO_RECEIVED">("IN_PROCESSING");
  const mut = useMutation({
    mutationFn: () => run({ data: { orderId, target } }),
    onSuccess: () => { toast.success(`Resumed → ${target}`); onDone(); },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Resume from hold</DialogTitle></DialogHeader>
        <Select value={target} onValueChange={(v) => setTarget(v as typeof target)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="IN_PROCESSING">In Processing</SelectItem>
            <SelectItem value="FORM_RECEIVED">Form Received</SelectItem>
            <SelectItem value="INFO_RECEIVED">Info Received</SelectItem>
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button disabled={mut.isPending} onClick={() => mut.mutate()}>Resume</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SystemCloseDialog({ orderId, onDone, onClose }: { orderId: string; onDone: () => void; onClose: () => void }) {
  const run = useServerFn(closeOrderSystem);
  const [reasonId, setReasonId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const mut = useMutation({
    mutationFn: () => run({ data: { orderId, reasonId: reasonId!, remarks: reply || null, source: "manual_override" } }),
    onSuccess: () => { toast.success("Order closed (E010 sent)"); onDone(); },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>System Close — sends E010</DialogTitle></DialogHeader>
        <ReasonPicker value={reasonId} onChange={(id) => setReasonId(id)} reply={reply} onReplyChange={setReply} />
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" disabled={!reasonId || mut.isPending} onClick={() => mut.mutate()}>Close order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function GovtRejectedDialog({ orderId, onDone, onClose }: { orderId: string; onDone: () => void; onClose: () => void }) {
  const run = useServerFn(handleGovtRejected);
  const [reasonId, setReasonId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const mut = useMutation({
    mutationFn: () => run({ data: { orderId, reasonId: reasonId!, remarks: reply || null } }),
    onSuccess: () => { toast.success("Govt rejection recorded, order closed"); onDone(); },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Government Rejected — forced close</DialogTitle></DialogHeader>
        <p className="text-sm text-slate-600">No resubmit loop. Customer must reorder if needed.</p>
        <ReasonPicker value={reasonId} onChange={(id) => setReasonId(id)} reply={reply} onReplyChange={setReply} />
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" disabled={!reasonId || mut.isPending} onClick={() => mut.mutate()}>Confirm rejection</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
