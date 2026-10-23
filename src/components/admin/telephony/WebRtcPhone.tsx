import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { Headset, Mic, MicOff, Phone, PhoneOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { endWebRtcCall, getWebRtcSession, getWebRtcStatus, initiateWebRtcCall, lookupIncomingCaller, recordInboundWebRtcCall } from "@/lib/telephony/callerdesk-webrtc.functions";
import type { CallerDeskWebRtcEngine, EngineSnapshot } from "@/lib/telephony/callerdesk-webrtc.engine";
import { fmtDuration } from "./TelephonyPanel";
import { logWebRtcEvent } from "@/lib/telephony/webrtc-diag.functions";
import { WebRtcDiagnostics } from "./WebRtcDiagnostics";

type CallerLookup = Awaited<ReturnType<typeof lookupIncomingCaller>>;

function CallerCard({ loading, error, data, selected, onSelect }: { loading: boolean; error: boolean; data: CallerLookup | null; selected: string | null; onSelect: (id: string) => void }) {
  if (loading) return <p className="animate-pulse rounded-md border px-2 py-1.5 text-xs text-muted-foreground">Looking up caller…</p>;
  if (error) return <p className="rounded-md border px-2 py-1.5 text-xs text-muted-foreground">Caller lookup failed — the call is unaffected.</p>;
  if (!data) return null;
  if (data.kind === "invalid" || data.kind === "unknown") return <p className="rounded-md border px-2 py-1.5 text-xs">Unknown caller{data.number ? ` · ${data.number}` : ""}</p>;
  const order = data.orders.find((o) => o.id === selected) ?? null;
  const active = data.orders.filter((o) => o.active), closed = data.orders.filter((o) => !o.active);
  const pill = (o: CallerLookup["orders"][number]) => (
    <button key={o.id} onClick={() => onSelect(o.id)} className={`rounded-full border px-2 py-0.5 font-mono text-[11px] ${o.id === selected ? "border-primary bg-primary text-primary-foreground" : o.active ? "" : "text-muted-foreground"}`}>{o.code ?? "Order"}</button>
  );
  return (
    <div className="space-y-1.5 rounded-md border p-2 text-xs">
      <div className="flex justify-between"><span className="font-semibold">{data.customerName ?? "Customer"}</span><span className="font-mono">{data.number}</span></div>
      {data.orders.length > 1 ? (
        <div className="space-y-1">
          {active.length ? <div className="flex flex-wrap gap-1">{active.map(pill)}</div> : null}
          {closed.length ? <div className="flex flex-wrap items-center gap-1"><span className="text-[10px] text-muted-foreground">Closed:</span>{closed.map(pill)}</div> : null}
          {!order ? <p className="text-[11px] text-muted-foreground">{data.orders.length} orders found — pick the one this call is about.</p> : null}
        </div>
      ) : null}
      {order ? (
        <div className="space-y-0.5">
          <div><span className="font-mono">{order.code}</span>{!order.active ? <span className="ml-1 text-muted-foreground">(closed)</span> : null}</div>
          <div>{order.service ?? "—"} · {order.status.replace(/_/g, " ").toLowerCase()}</div>
          <div className="text-muted-foreground">Assigned: {order.assignee ?? "Unassigned"}</div>
          <Link to="/admin/orders/$orderId" params={{ orderId: order.id }} target="_blank" className="text-primary underline">Open order</Link>
        </div>
      ) : !data.orders.length && data.lead ? (
        <div className="space-y-0.5">
          <div>Lead <span className="font-mono">{data.lead.code ?? ""}</span> · {data.lead.name}</div>
          <div>{data.lead.service ?? "—"} · {data.lead.status.replace(/_/g, " ")}</div>
          <div className="text-muted-foreground">Assigned: {data.lead.assignee ?? "Unassigned"}</div>
        </div>
      ) : null}
    </div>
  );
}

const LABEL: Record<string, string> = {
  DISCONNECTED: "Disconnected", CHECKING_CONFIGURATION: "Checking setup…", SETUP_INCOMPLETE: "Setup incomplete",
  CONNECTING: "Connecting…", REGISTERED: "Ready", RECONNECTING: "Reconnecting…", CALLING: "Calling…",
  RINGING: "Incoming call", CONNECTED: "Connected", ENDED: "Call ended", FAILED: "Failed",
};
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

/** Browser phone (CallerDesk WebRTC). Rendered only for employees with a browser phone account. */
export function WebRtcPhone() {
  const fetchStatus = useServerFn(getWebRtcStatus);
  const fetchSession = useServerFn(getWebRtcSession);
  const logEvent = useServerFn(logWebRtcEvent);
  const startCall = useServerFn(initiateWebRtcCall);
  const finishCall = useServerFn(endWebRtcCall);
  const lookup = useServerFn(lookupIncomingCaller);
  const recordInbound = useServerFn(recordInboundWebRtcCall);
  const callRow = useRef<{ id: string; answeredAt: number | null } | null>(null);
  const [diag, setDiag] = useState(false);
  const { data: status } = useQuery({ queryKey: ["webrtc-status"], queryFn: () => fetchStatus(), staleTime: 300_000 });
  const engine = useRef<CallerDeskWebRtcEngine | null>(null);
  const [snap, setSnap] = useState<EngineSnapshot | null>(null);
  const [open, setOpen] = useState(false);
  const [num, setNum] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => { if (snap?.state !== "CONNECTED") return; const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, [snap?.state]);
  useEffect(() => () => { void engine.current?.stop(); }, []);
  useEffect(() => { if (snap?.state === "RINGING") setOpen(true); }, [snap?.state]);
  // Close the pre-recorded browser call row when the SIP session ends (the provider report may enrich it later).
  useEffect(() => {
    const c = callRow.current; if (!c) return;
    if (snap?.state === "CONNECTED" && snap.connectedAt) c.answeredAt = snap.connectedAt;
    if (snap?.state === "ENDED" || snap?.state === "FAILED" || snap?.state === "DISCONNECTED" || snap?.state === "REGISTERED") {
      callRow.current = null;
      void finishCall({ data: { callRowId: c.id, answeredAt: c.answeredAt } }).catch(() => {});
    }
  }, [snap?.state, snap?.connectedAt]);

  // Incoming caller identification + inbound call record. Runs in the background: never delays ringing or Answer/Reject.
  const inboundKey = useRef<string | null>(null);
  const [caller, setCaller] = useState<{ loading: boolean; error: boolean; data: CallerLookup | null }>({ loading: false, error: false, data: null });
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  useEffect(() => {
    if (snap?.state !== "RINGING" || snap.direction !== "inbound" || inboundKey.current) return;
    const key = crypto.randomUUID(); inboundKey.current = key;
    const number = snap.remoteNumber ?? "";
    setSelectedOrder(null); setCaller({ loading: true, error: false, data: null });
    lookup({ data: { number } })
      .then((d) => { if (inboundKey.current !== key) return; setCaller({ loading: false, error: false, data: d }); if (d.orders.length === 1) setSelectedOrder(d.orders[0].id); })
      .catch(() => { if (inboundKey.current === key) setCaller({ loading: false, error: true, data: null }); });
    recordInbound({ data: { key, number, applicationId: null } })
      .then((r) => { if (inboundKey.current === key && !callRow.current) callRow.current = { id: r.callRowId, answeredAt: null }; })
      .catch(() => { /* the call still works; the provider report creates the record */ });
  }, [snap?.state, snap?.direction, snap?.remoteNumber]);
  useEffect(() => {
    if (snap?.state === "ENDED" || snap?.state === "FAILED" || snap?.state === "DISCONNECTED" || snap?.state === "REGISTERED") inboundKey.current = null;
  }, [snap?.state]);
  function selectOrder(id: string) {
    setSelectedOrder(id);
    const key = inboundKey.current;
    if (key) void recordInbound({ data: { key, number: snap?.remoteNumber ?? "", applicationId: id } }).catch(() => {});
  }

  async function dial() {
    const digits = num.replace(/\D/g, "");
    if (!/^\d{10,13}$/.test(digits)) { void engine.current?.dial(num); return; }
    try { const r = await startCall({ data: { number: digits } }); callRow.current = { id: r.callRowId, answeredAt: null }; }
    catch { /* calling still works; the provider report will create the record */ }
    await engine.current?.dial(num);
  }

  if (!status?.authorized) return null;

  async function connect() {
    if (!engine.current) {
      const { CallerDeskWebRtcEngine } = await import("@/lib/telephony/callerdesk-webrtc.engine");
      engine.current = new CallerDeskWebRtcEngine();
      engine.current.subscribe(setSnap);
      engine.current.onLog = (e) => { void logEvent({ data: e }).catch(() => {}); };
    }
    await engine.current.start(() => fetchSession());
  }

  const state = snap?.state ?? (status.canRegister ? "DISCONNECTED" : "SETUP_INCOMPLETE");
  const ready = state === "REGISTERED" || state === "ENDED";
  const dot = state === "REGISTERED" || state === "CONNECTED" ? "bg-primary" : state === "FAILED" ? "bg-destructive" : "bg-muted-foreground";

  return (
    <div className="fixed bottom-14 right-4 z-40">
      {!open ? (
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs shadow">
          <Headset className="h-3.5 w-3.5" /><span className={`h-2 w-2 rounded-full ${dot}`} />Browser phone: {LABEL[state]}
        </button>
      ) : (
        <div className="w-[320px] max-h-[85vh] overflow-auto space-y-3 rounded-xl border bg-card p-4 text-card-foreground shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold"><Headset className="h-4 w-4" />Browser phone </div>
            <button aria-label="Hide" onClick={() => setOpen(false)}><X className="h-4 w-4" /></button>
          </div>
          <div className="flex items-center gap-2 text-xs"><span className={`h-2 w-2 rounded-full ${dot}`} />{LABEL[state]}</div>

          {!status.canRegister && !snap ? (
            <p className="text-xs text-muted-foreground">
              {status.message}
              {status.missing.length ? ` Missing: ${status.missing.join(", ")}.` : ""}{!status.enabled ? " Browser calling is switched off." : ""}
            </p>
          ) : null}
          {snap?.error ? <p className="text-xs text-destructive">{snap.error}</p> : null}

          {status.canRegister && (state === "DISCONNECTED" || state === "FAILED" || state === "RECONNECTING") ? (
            <Button size="sm" className="w-full" onClick={connect}>Connect (FortiClient VPN must be on)</Button>
          ) : null}
          {snap?.error?.startsWith("Browser blocked call audio") ? <Button size="sm" variant="outline" className="w-full" onClick={() => engine.current?.resumeAudio()}>Enable call audio</Button> : null}

          {state === "RINGING" ? (
            <div className="space-y-2">
              <p className="text-sm">Incoming: <span className="font-mono">{snap?.remoteNumber ?? "Unknown"}</span></p>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" onClick={() => engine.current?.answer()}><Phone className="h-4 w-4" />Answer</Button>
                <Button size="sm" variant="destructive" onClick={() => engine.current?.reject()}><PhoneOff className="h-4 w-4" />Reject</Button>
              </div>
            </div>
          ) : null}
          {snap?.direction === "inbound" && (state === "RINGING" || state === "CONNECTED") ? (
            <CallerCard loading={caller.loading} error={caller.error} data={caller.data} selected={selectedOrder} onSelect={selectOrder} />
          ) : null}

          {state === "CALLING" || state === "CONNECTED" ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="font-mono">{snap?.remoteNumber}</span><span className="font-mono">{state === "CONNECTED" && snap?.connectedAt ? fmtDuration((now - snap.connectedAt) / 1000) : "Ringing…"}</span></div>
              {state === "CONNECTED" ? (
                <div className="grid grid-cols-3 gap-1">{KEYS.map((k) => <Button key={k} size="sm" variant="outline" onClick={() => engine.current?.sendDtmf(k)}>{k}</Button>)}</div>
              ) : null}
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" disabled={state !== "CONNECTED"} onClick={() => engine.current?.setMuted(!snap?.muted)}>
                  {snap?.muted ? <><MicOff className="h-4 w-4" />Unmute</> : <><Mic className="h-4 w-4" />Mute</>}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => engine.current?.hangup()}><PhoneOff className="h-4 w-4" />Hang up</Button>
              </div>
            </div>
          ) : null}

          {ready ? (
            <div className="space-y-2">
              <input className="w-full rounded-md border bg-background px-2 py-1.5 font-mono text-sm" inputMode="tel" placeholder="Number to call" value={num} onChange={(e) => setNum(e.target.value.replace(/[^\d+]/g, ""))} />
              <div className="grid grid-cols-3 gap-1">{KEYS.slice(0, 11).map((k) => <Button key={k} size="sm" variant="outline" onClick={() => setNum((n) => n + k)}>{k}</Button>)}
                <Button size="sm" variant="outline" onClick={() => setNum((n) => n.slice(0, -1))}>⌫</Button></div>
              <Button size="sm" className="w-full" onClick={() => void dial()}><Phone className="h-4 w-4" />Call from browser</Button>
              <button className="w-full text-[11px] text-muted-foreground underline" onClick={() => engine.current?.stop()}>Disconnect</button>
            </div>
          ) : null}
          <button className="w-full text-[11px] underline" onClick={() => setDiag((d) => !d)}>{diag ? "Hide diagnostics" : "Diagnostics & test log"}</button>
          {diag ? <WebRtcDiagnostics currentStatus={LABEL[state]} currentError={snap?.error ?? null} /> : null}
          <p className="text-[10px] text-muted-foreground">Call history and recordings update from CallerDesk call reports.</p>
        </div>
      )}
    </div>
  );
}
