/**
 * Browser call engine: SIP over WSS to CallerDesk's Asterisk using SIP.js (loaded lazily, browser only).
 * Holds no CRM/DB logic. Final call status/duration/recording come from CallerDesk webhooks.
 */
import { canDial, nextState, registrationError, type PhoneEvent, type PhoneState } from "./callerdesk-webrtc.config";

export type SessionConfig = { wssUrl: string; sipDomain: string; extension: string; password: string; displayName: string };
export type EngineSnapshot = { state: PhoneState; error: string | null; remoteNumber: string | null; muted: boolean; connectedAt: number | null; direction: "inbound" | "outbound" | null };
type Listener = (s: EngineSnapshot) => void;
export type DiagEvent = { event: string; state?: string; sipCode?: number | null; reason?: string | null; number?: string | null; detail?: string | null };

/** User-facing message for a failed/dropped ICE (media) path. */
export function iceError(state: string): string | null {
  if (state === "failed") return "Call audio path failed (no media). Check FortiClient VPN and retry.";
  if (state === "disconnected") return "Call audio path interrupted. Check FortiClient VPN.";
  return null;
}

export class CallerDeskWebRtcEngine {
  private snap: EngineSnapshot = { state: "DISCONNECTED", error: null, remoteNumber: null, muted: false, connectedAt: null, direction: null };
  private listeners = new Set<Listener>();
  private ua: any = null;
  private registerer: any = null;
  private session: any = null;
  private inFlight = false;
  private audio: HTMLAudioElement | null = null;
  private sip: any = null;
  private domain = "";
  onLog: ((e: DiagEvent) => void) | null = null;
  private log(e: DiagEvent) { try { this.onLog?.({ state: this.snap.state, ...e }); } catch { /* ignore */ } }

  get snapshot() { return this.snap; }
  subscribe(l: Listener) { this.listeners.add(l); l(this.snap); return () => { this.listeners.delete(l); }; }

  private emit(e: PhoneEvent, patch: Partial<EngineSnapshot> = {}) {
    this.snap = { ...this.snap, ...patch, state: nextState(this.snap.state, e) };
    this.listeners.forEach((l) => l(this.snap));
  }

  async start(loadConfig: () => Promise<SessionConfig>) {
    this.emit("check", { error: null });
    this.log({ event: "REGISTER_ATTEMPT" });
    let cfg: SessionConfig;
    try { cfg = await loadConfig(); } catch (err: any) {
      const msg = String(err?.message ?? "Configuration unavailable");
      return this.emit(/incomplete/i.test(msg) ? "config_missing" : "register_failed", { error: msg });
    }
    this.emit("config_ok");
    this.domain = cfg.sipDomain;
    try {
      this.sip = await import("sip.js");
      const { UserAgent, Registerer, RegistererState } = this.sip;
      const uri = UserAgent.makeURI(`sip:${cfg.extension}@${cfg.sipDomain}`);
      if (!uri) throw new Error("Invalid SIP extension or domain.");
      this.ua = new UserAgent({
        uri, displayName: cfg.displayName, authorizationUsername: cfg.extension, authorizationPassword: cfg.password,
        transportOptions: { server: cfg.wssUrl, connectionTimeout: 8 }, logLevel: "error",
        delegate: {
          onInvite: (inv: any) => this.onInvite(inv),
          onDisconnect: (e?: Error) => { this.log({ event: "TRANSPORT_LOST", reason: e?.message ?? null }); this.emit("transport_lost", { error: "Connection to CallerDesk lost. Check that FortiClient VPN is connected." }); },
        },
      });
      await this.ua.start().catch(() => { throw new Error("Cannot reach CallerDesk phone server. Connect FortiClient VPN and retry."); });
      this.registerer = new Registerer(this.ua);
      this.registerer.stateChange.addListener((s: any) => {
        if (s === RegistererState.Registered) { this.emit("registered", { error: null }); this.log({ event: "REGISTER_SUCCESS" }); }
        else if (s === RegistererState.Unregistered && this.snap.state === "CONNECTING") this.emit("register_failed", { error: "CallerDesk rejected the agent registration." });
      });
      await this.registerer.register({ requestDelegate: { onReject: (r: any) => { const c = r?.message?.statusCode; this.log({ event: "REGISTER_FAILED", sipCode: c, reason: r?.message?.reasonPhrase }); this.emit("register_failed", { error: registrationError(c) }); } } });
    } catch (err: any) {
      const m = String(err?.message ?? "Registration failed");
      this.log({ event: "REGISTER_FAILED", reason: m });
      this.emit("register_failed", { error: m });
    }
  }

  private async mic(): Promise<boolean> {
    try { const s = await navigator.mediaDevices.getUserMedia({ audio: true }); s.getTracks().forEach((t) => t.stop()); return true; }
    catch (e: any) {
      this.snap = { ...this.snap, error: e?.name === "NotAllowedError" ? "Microphone permission denied. Allow microphone access in the browser." : "No microphone or headset found." };
      this.listeners.forEach((l) => l(this.snap));
      return false;
    }
  }

  private wire(session: any) {
    const { SessionState } = this.sip;
    this.session = session;
    // Hook the peer connection as soon as SIP.js creates it, so early remote tracks are caught.
    session.delegate = { ...(session.delegate ?? {}), onSessionDescriptionHandler: () => this.watchPeer(session) };
    session.stateChange.addListener((s: any) => {
      if (s === SessionState.Established) { this.log({ event: "CALL_CONNECTED", number: this.snap.remoteNumber }); this.attachAudio(session); this.emit("accepted", { connectedAt: Date.now() }); }
      if (s === SessionState.Establishing) this.watchPeer(session);
      if (s === SessionState.Terminated) {
        this.releaseMedia(session);
        this.session = null; this.inFlight = false;
        const wasConnected = this.snap.state === "CONNECTED";
        this.log({ event: wasConnected ? "CALL_ENDED" : "CALL_NOT_CONNECTED", number: this.snap.remoteNumber, detail: wasConnected && this.snap.connectedAt ? `talk ${Math.round((Date.now() - this.snap.connectedAt) / 1000)}s` : null });
        this.emit(this.snap.state === "CONNECTED" ? "hangup" : "rejected", { muted: false });
      }
    });
  }

  /** Stops microphone and remote tracks so no device stays in use after a call. */
  private releaseMedia(session: any) {
    const pc: RTCPeerConnection | undefined = session?.sessionDescriptionHandler?.peerConnection;
    try {
      pc?.getSenders().forEach((s) => s.track?.stop());
      pc?.getReceivers().forEach((r) => r.track?.stop());
    } catch { /* already closed */ }
    this.remote?.getTracks().forEach((t) => t.stop());
    this.remote = null;
    if (this.audio) { this.audio.pause(); this.audio.srcObject = null; }
  }

  private remote: MediaStream | null = null;
  private watched = new WeakSet<object>();

  /** Hooks ontrack + ICE state on the call's peer connection (idempotent). */
  private watchPeer(session: any) {
    const pc: RTCPeerConnection | undefined = session?.sessionDescriptionHandler?.peerConnection;
    if (!pc || this.watched.has(pc)) return;
    this.watched.add(pc);
    pc.addEventListener("track", (ev: RTCTrackEvent) => { if (ev.track.kind === "audio") this.addRemoteTrack(ev.track); });
    pc.addEventListener("iceconnectionstatechange", () => {
      const st = pc.iceConnectionState;
      this.log({ event: "ICE_STATE", detail: st, number: this.snap.remoteNumber });
      if (st === "failed" || st === "disconnected") {
        this.snap = { ...this.snap, error: iceError(st) };
        this.listeners.forEach((l) => l(this.snap));
      } else if ((st === "connected" || st === "completed") && this.snap.error && /audio path/i.test(this.snap.error)) {
        this.snap = { ...this.snap, error: null };
        this.listeners.forEach((l) => l(this.snap));
      }
    });
  }

  private addRemoteTrack(track: MediaStreamTrack) {
    this.remote ??= new MediaStream();
    if (!this.remote.getTracks().some((t) => t.id === track.id)) this.remote.addTrack(track);
    this.audio ??= new Audio();
    if (this.audio.srcObject !== this.remote) this.audio.srcObject = this.remote;
    void this.playAudio();
  }

  private async playAudio() {
    if (!this.audio) return;
    try { await this.audio.play(); }
    catch (e: any) {
      if (e?.name === "AbortError") return; // superseded by a newer play()
      this.log({ event: "AUDIO_PLAYBACK_FAILED", reason: e?.name ?? "unknown" });
      this.snap = { ...this.snap, error: "Browser blocked call audio. Click anywhere on the page, then check your headset/speaker." };
      this.listeners.forEach((l) => l(this.snap));
    }
  }

  private attachAudio(session: any) {
    this.watchPeer(session);
    const pc: RTCPeerConnection | undefined = session.sessionDescriptionHandler?.peerConnection;
    if (!pc) { this.log({ event: "MEDIA_MISSING", reason: "no peer connection" }); return; }
    pc.getReceivers().forEach((r) => r.track?.kind === "audio" && this.addRemoteTrack(r.track));
    if (!this.remote?.getAudioTracks().length) this.log({ event: "MEDIA_PENDING", reason: "no remote audio track yet" });
  }

  private onInvite(inv: any) {
    if (this.session) { void inv.reject({ statusCode: 486 }); return; }
    const from = inv.remoteIdentity?.uri?.user ?? null;
    this.wire(inv);
    this.emit("incoming", { remoteNumber: from, direction: "inbound", error: null, connectedAt: null });
  }

  async dial(number: string) {
    const digits = number.replace(/\D/g, "");
    if (!/^\d{10,13}$/.test(digits)) { this.snap = { ...this.snap, error: "Enter a valid phone number." }; this.listeners.forEach((l) => l(this.snap)); return; }
    if (!canDial(this.snap.state, this.inFlight) || !this.ua) return;
    this.inFlight = true;
    if (!(await this.mic())) { this.inFlight = false; this.log({ event: "CALL_FAILED", reason: this.snap.error, number: digits }); return; }
    const { Inviter, UserAgent } = this.sip;
    const target = UserAgent.makeURI(`sip:${digits}@${this.domain}`);
    const inviter = new Inviter(this.ua, target, { sessionDescriptionHandlerOptions: { constraints: { audio: true, video: false } } });
    this.wire(inviter);
    this.emit("dial", { remoteNumber: digits, direction: "outbound", error: null, connectedAt: null });
    this.log({ event: "CALL_DIALED", number: digits, detail: `sip:${digits}@${this.domain}` });
    await inviter.invite({
      requestDelegate: {
        onReject: (r: any) => {
          const c = r?.message?.statusCode; const why = r?.message?.reasonPhrase ?? "";
          this.log({ event: "CALL_REJECTED", sipCode: c, reason: why, number: digits });
          this.snap = { ...this.snap, error: `CallerDesk ended the call: ${c ?? "?"} ${why}`.trim() };
          this.listeners.forEach((l) => l(this.snap));
        },
      },
    }).catch((e: any) => { this.inFlight = false; this.log({ event: "CALL_FAILED", reason: String(e?.message ?? e), number: digits }); this.emit("rejected", { error: "Call could not be placed." }); });
  }

  async answer() {
    if (this.snap.state !== "RINGING" || !this.session) return;
    if (!(await this.mic())) return;
    await this.session.accept({ sessionDescriptionHandlerOptions: { constraints: { audio: true, video: false } } });
  }
  async reject() { if (this.snap.state === "RINGING" && this.session) await this.session.reject(); }
  async hangup() {
    const s = this.session; if (!s) return;
    const { SessionState } = this.sip;
    if (s.state === SessionState.Established) await s.bye();
    else if (typeof s.cancel === "function") await s.cancel();
  }
  setMuted(muted: boolean) {
    const pc: RTCPeerConnection | undefined = this.session?.sessionDescriptionHandler?.peerConnection;
    if (!pc || this.snap.state !== "CONNECTED") return;
    pc.getSenders().forEach((s) => { if (s.track) s.track.enabled = !muted; });
    this.snap = { ...this.snap, muted }; this.listeners.forEach((l) => l(this.snap));
  }
  sendDtmf(tone: string) { if (this.snap.state === "CONNECTED") this.session?.sessionDescriptionHandler?.sendDtmf?.(tone); }
  async stop() {
    try { if (this.session) await this.hangup(); } catch { /* ignore */ }
    this.releaseMedia(this.session);
    try { await this.registerer?.unregister(); } catch { /* ignore */ }
    try { await this.ua?.stop(); } catch { /* ignore */ }
    this.ua = null; this.registerer = null; this.session = null; this.inFlight = false;
    this.emit("disconnect", { error: null, remoteNumber: null, connectedAt: null, muted: false, direction: null });
  }
}
