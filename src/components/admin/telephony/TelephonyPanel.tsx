import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Phone, PhoneOff, PhoneIncoming, User, FileText, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { getMyCallState, saveCallDisposition, DISPOSITIONS, type CallView } from "@/lib/telephony/calls.functions";
import { toast } from "sonner";

export function fmtDuration(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export function useCallTimer(call: Pick<CallView, "answeredAt" | "startedAt" | "durationSeconds" | "status"> | null) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!call || call.status === "ended") return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [call?.status]);
  if (!call) return 0;
  if (call.durationSeconds != null && call.status !== "answered" && call.status !== "ringing") return call.durationSeconds;
  return (now - new Date(call.answeredAt ?? call.startedAt).getTime()) / 1000;
}

const NOT_SUPPORTED = "Answer, reject and hang-up happen on your CallerDesk phone — browser call control is not connected yet.";

/** Persistent employee call panel: incoming popup, active call, after-call disposition, availability. */
export function TelephonyPanel() {
  const qc = useQueryClient();
  const fetchState = useServerFn(getMyCallState);
  const save = useServerFn(saveCallDisposition);
  const [uid, setUid] = useState<string | null>(null);
  const [open, setOpen] = useState(true);
  const [disp, setDisp] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { void supabase.auth.getUser().then(({ data }) => setUid(data.user?.id ?? null)); }, []);
  const { data } = useQuery({ queryKey: ["my-call-state"], queryFn: () => fetchState(), enabled: !!uid, staleTime: 60_000, refetchInterval: false });

  // Realtime: refresh only when one of my calls changes (no polling).
  useEffect(() => {
    if (!uid) return;
    const ch = supabase.channel(`user:${uid}:telephony`)
      .on("postgres_changes", { event: "*", schema: "public", table: "telephony_calls", filter: `employee_id=eq.${uid}` }, () => {
        setOpen(true);
        qc.invalidateQueries({ queryKey: ["my-call-state"] });
      }).subscribe();
    return () => { void supabase.removeChannel(ch); };
  }, [uid, qc]);

  const active = data?.active ?? null;
  const pending = data?.pendingDisposition ?? null;
  const secs = useCallTimer(active);

  async function submit() {
    if (!pending || !disp) return;
    setSaving(true);
    try {
      await save({ data: { id: pending.id, disposition: disp as any, notes } });
      setDisp(""); setNotes("");
      toast.success("Call outcome saved");
      qc.invalidateQueries({ queryKey: ["my-call-state"] });
    } catch (e: any) { toast.error(e?.message ?? "Could not save"); } finally { setSaving(false); }
  }

  if (!active && (!pending || !open)) {
    // Idle badge hidden until browser calling is finalised — only the
    // pending "Log last call" affordance still shows when relevant.
    if (!pending) return null;
    return (
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs shadow">
        <button className="underline" onClick={() => setOpen(true)}>Log last call</button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[340px] rounded-xl border bg-card text-card-foreground shadow-2xl">
      {active ? (
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold">
              <PhoneIncoming className={`h-4 w-4 ${active.status === "ringing" ? "animate-pulse text-primary" : "text-primary"}`} />
              {active.status === "ringing" ? (active.direction === "outbound" ? "Outgoing call" : "Incoming call") : "Active call"}<span className="rounded-full bg-primary/10 px-2 text-[11px] text-primary">On Call</span>
            </div>
            <span className="font-mono text-sm">{active.status === "answered" ? fmtDuration(secs) : active.direction === "outbound" ? "Calling customer…" : "Ringing…"}</span>
          </div>
          <dl className="grid grid-cols-[90px_1fr] gap-y-1 text-sm">
            <dt className="text-muted-foreground">Caller</dt><dd className="font-mono">{active.callerNumber ?? "Unknown"}</dd>
            <dt className="text-muted-foreground">Name</dt><dd>{active.contactName ?? "Not matched"}</dd>
            <dt className="text-muted-foreground">Order</dt><dd>{active.orderCode ? `${active.orderCode}${active.serviceName ? ` · ${active.serviceName}` : ""}` : "—"}</dd>
            <dt className="text-muted-foreground">Assigned</dt><dd>{active.employeeName ?? "—"}</dd>
            <dt className="text-muted-foreground">Status</dt><dd className="capitalize">{active.status}</dd>
          </dl>
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" disabled title={NOT_SUPPORTED}><Phone className="h-4 w-4" />Answer</Button>
            <Button size="sm" variant="destructive" disabled title={NOT_SUPPORTED}><PhoneOff className="h-4 w-4" />{active.status === "ringing" ? "Reject" : "End Call"}</Button>
            {active.customerId ? (
              <Button size="sm" variant="outline" asChild><Link to="/admin/customers/$customerId" params={{ customerId: active.customerId }}><User className="h-4 w-4" />Open Customer</Link></Button>
            ) : <Button size="sm" variant="outline" disabled><User className="h-4 w-4" />Open Customer</Button>}
            {active.applicationId ? (
              <Button size="sm" variant="outline" asChild><Link to="/admin/applications/$applicationId" params={{ applicationId: active.applicationId }}><FileText className="h-4 w-4" />Open Order</Link></Button>
            ) : <Button size="sm" variant="outline" disabled><FileText className="h-4 w-4" />Open Order</Button>}
          </div>
          <p className="text-[11px] text-muted-foreground">{NOT_SUPPORTED}</p>
        </div>
      ) : pending && open ? (
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Call ended · {fmtDuration(pending.durationSeconds ?? 0)}</div>
            <button aria-label="Hide" onClick={() => setOpen(false)}><X className="h-4 w-4" /></button>
          </div>
          <p className="text-sm text-muted-foreground">{pending.contactName ?? pending.callerNumber ?? "Caller"}{pending.orderCode ? ` · ${pending.orderCode}` : ""}</p>
          <div className="flex flex-wrap gap-1.5">
            {DISPOSITIONS.map((d) => (
              <Button key={d} size="sm" variant={disp === d ? "default" : "outline"} onClick={() => setDisp(d)}>{d}</Button>
            ))}
          </div>
          <textarea className="w-full rounded-md border bg-background p-2 text-sm" rows={2} placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
          <Button className="w-full" size="sm" disabled={!disp || saving} onClick={submit}>{saving ? "Saving…" : "Save outcome"}</Button>
        </div>
      ) : null}
    </div>
  );
}

/** Availability derived from existing presence session + live call (no separate system). */
export function useTelephonyAvailability(): "Available" | "On Call" | "Offline" {
  const qc = useQueryClient();
  const s = qc.getQueryData<{ active: CallView | null }>(["my-call-state"]);
  if (s?.active) return "On Call";
  return typeof navigator !== "undefined" && !navigator.onLine ? "Offline" : "Available";
}
