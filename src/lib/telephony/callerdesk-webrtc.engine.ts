/**
 * Browser call engine: SIP over WSS to CallerDesk's Asterisk using SIP.js (loaded lazily, browser only).
 * Holds no CRM/DB logic. Final call status/duration/recording come from CallerDesk webhooks.
 */
import { canDial, nextState, registrationError, type PhoneEvent, type PhoneState } from "./callerdesk-webrtc.config";

export type SessionConfig = { wssUrl: string; sipDomain: string; extension: string; password: string; displayName: string };
export type EngineSnapshot = { state: PhoneState; error: string | null; remoteNumber: string | null; muted: boolean; connectedAt: number | null; direction: "inbound" | "outbound" | null };
type Listener = (s: EngineSnapshot) => void;

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

  get snapshot() { return this.snap; }
  subscribe(l: Listener) { this.listeners.add(l); l(this.snap); return () => { this.listeners.delete(l); }; }

  private emit(e: PhoneEvent, patch: Partial<EngineSnapshot> = {}) {
    this.snap = { ...this.snap, ...patch, state: nextState(this.snap.state, e) };
    this.listeners.forEach((l) => l(this.snap));
  }

  async start(loadConfig: () => Promise<SessionConfig>) {
    this.emit("check", { error: null });
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
          onDisconnect: () => this.emit("transport_lost", { error: "Connection to CallerDesk lost. Check that FortiClient VPN is connected." }),
        },
      });
      await this.ua.start().catch(() => { throw new Error("Cannot reach CallerDesk phone server. Connect FortiClient VPN and retry."); });
      this.registerer = new Registerer(this.ua);
      this.registerer.stateChange.addListener((s: any) => {
        if (s === RegistererState.Registered) this.emit("registered", { error: null });
        else if (s === RegistererState.Unregistered && this.snap.state === "CONNECTING") this.emit("register_failed", { error: "CallerDesk rejected the agent registration." });
      });
      await this.registerer.register({ requestDelegate: { onReject: (r: any) => this.emit("register_failed", { error: registrationError(r?.message?.statusCode) }) } });
    } catch (err: any) {
      this.emit("register_failed", { error: String(err?.message ?? "Registration failed") });
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
    session.stateChange.addListener((s: any) => {
      if (s === SessionState.Established) { this.attachAudio(session); this.emit("accepted", { connectedAt: Date.now() }); }
      if (s === SessionState.Terminated) {
        this.releaseMedia(session);
        this.session = null; this.inFlight = false;
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
    if (this.audio) { this.audio.pause(); this.audio.srcObject = null; }
  }

  private attachAudio(session: any) {
    const pc: RTCPeerConnection | undefined = session.sessionDescriptionHandler?.peerConnection;
    if (!pc) return;
    const stream = new MediaStream();
    pc.getReceivers().forEach((r) => r.track && stream.addTrack(r.track));
    this.audio ??= new Audio();
    this.audio.srcObject = stream; void this.audio.play().catch(() => {});
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
    if (!(await this.mic())) { this.inFlight = false; return; }
    const { Inviter, UserAgent } = this.sip;
    const target = UserAgent.makeURI(`sip:${digits}@${this.domain}`);
    const inviter = new Inviter(this.ua, target, { sessionDescriptionHandlerOptions: { constraints: { audio: true, video: false } } });
    this.wire(inviter);
    this.emit("dial", { remoteNumber: digits, direction: "outbound", error: null, connectedAt: null });
    await inviter.invite().catch(() => { this.inFlight = false; this.emit("rejected", { error: "Call could not be placed." }); });
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
