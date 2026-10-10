import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Headset, Mic, MicOff, Phone, PhoneOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWebRtcSession, getWebRtcStatus } from "@/lib/telephony/callerdesk-webrtc.functions";
import type { CallerDeskWebRtcEngine, EngineSnapshot } from "@/lib/telephony/callerdesk-webrtc.engine";
import { fmtDuration } from "./TelephonyPanel";
import { logWebRtcEvent } from "@/lib/telephony/webrtc-diag.functions";
import { WebRtcDiagnostics } from "./WebRtcDiagnostics";

const LABEL: Record<string, string> = {
  DISCONNECTED: "Disconnected", CHECKING_CONFIGURATION: "Checking setup…", SETUP_INCOMPLETE: "Setup incomplete",
  CONNECTING: "Connecting…", REGISTERED: "Ready", RECONNECTING: "Reconnecting…", CALLING: "Calling…",
  RINGING: "Incoming call", CONNECTED: "Connected", ENDED: "Call ended", FAILED: "Failed",
};
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

/** Browser phone (CallerDesk WebRTC). Rendered only for the authorised test agent. */
export function WebRtcPhone() {
  const fetchStatus = useServerFn(getWebRtcStatus);
  const fetchSession = useServerFn(getWebRtcSession);
  const logEvent = useServerFn(logWebRtcEvent);
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
            <div className="flex items-center gap-2 text-sm font-semibold"><Headset className="h-4 w-4" />Browser phone <span className="rounded bg-muted px-1.5 text-[10px] font-normal">Test</span></div>
            <button aria-label="Hide" onClick={() => setOpen(false)}><X className="h-4 w-4" /></button>
          </div>
          <div className="flex items-center gap-2 text-xs"><span className={`h-2 w-2 rounded-full ${dot}`} />{LABEL[state]}</div>

          {!status.canRegister && !snap ? (
            <p className="text-xs text-muted-foreground">
              WebRTC setup incomplete — waiting for CallerDesk VPN and agent SIP credentials.
              {status.missing.length ? ` Missing: ${status.missing.join(", ")}.` : ""}{!status.enabled ? " Browser calling is switched off." : ""}
            </p>
          ) : null}
          {snap?.error ? <p className="text-xs text-destructive">{snap.error}</p> : null}

          {status.canRegister && (state === "DISCONNECTED" || state === "FAILED") ? (
            <Button size="sm" className="w-full" onClick={connect}>Connect (FortiClient VPN must be on)</Button>
          ) : null}

          {state === "RINGING" ? (
            <div className="space-y-2">
              <p className="text-sm">Incoming: <span className="font-mono">{snap?.remoteNumber ?? "Unknown"}</span></p>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" onClick={() => engine.current?.answer()}><Phone className="h-4 w-4" />Answer</Button>
                <Button size="sm" variant="destructive" onClick={() => engine.current?.reject()}><PhoneOff className="h-4 w-4" />Reject</Button>
              </div>
            </div>
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
              <Button size="sm" className="w-full" onClick={() => engine.current?.dial(num)}><Phone className="h-4 w-4" />Call from browser</Button>
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
