import { nextState, registrationError, canDial } from "./callerdesk-webrtc.config-CFRtE2mu.mjs";
function iceError(state) {
  if (state === "failed") return "Call audio path failed (no media). Check FortiClient VPN and retry.";
  if (state === "disconnected") return "Call audio path interrupted. Check FortiClient VPN.";
  return null;
}
function summarizeSdp(sdp) {
  if (!sdp) return "none";
  const audio = sdp.split(/\r?\n(?=m=)/).find((b) => b.startsWith("m=audio"));
  if (!audio) return "no audio m-line";
  const dir = audio.match(/^a=(sendrecv|sendonly|recvonly|inactive)/m)?.[1] ?? "sendrecv(default)";
  const port = audio.match(/^m=audio (\d+)/)?.[1];
  const codecs = [...audio.matchAll(/^a=rtpmap:\d+ ([\w-]+)\//gm)].map((m) => m[1]).filter((c) => !/telephone-event/i.test(c)).slice(0, 4);
  return `dir=${dir} port0=${port === "0"} codecs=${codecs.join(",")}`;
}
function summarizeStats(reports) {
  const all = [...reports];
  const byId = new Map(all.map((r) => [r.id, r]));
  const inb = all.find((r) => r.type === "inbound-rtp" && (r.kind ?? r.mediaType) === "audio");
  const out = all.find((r) => r.type === "outbound-rtp" && (r.kind ?? r.mediaType) === "audio");
  const tr = all.find((r) => r.type === "transport");
  const pair = byId.get(tr?.selectedCandidatePairId) ?? all.find((r) => r.type === "candidate-pair" && (r.selected || r.nominated) && r.state === "succeeded");
  const lc = pair && byId.get(pair.localCandidateId);
  const rc = pair && byId.get(pair.remoteCandidateId);
  return [
    `in: pkts=${inb?.packetsReceived ?? "-"} bytes=${inb?.bytesReceived ?? "-"} lost=${inb?.packetsLost ?? "-"} jitter=${inb?.jitter ?? "-"} level=${inb?.audioLevel ?? "-"}`,
    `out: pkts=${out?.packetsSent ?? "-"} bytes=${out?.bytesSent ?? "-"}`,
    `pair: ${pair ? `${lc?.candidateType ?? "?"}/${lc?.protocol ?? "?"}->${rc?.candidateType ?? "?"} rtt=${pair.currentRoundTripTime ?? "-"}` : "none"}`
  ].join(" | ");
}
function callerFromInvite(inv) {
  const digits = (v) => {
    const d = String(v ?? "").replace(/[^\d+]/g, "");
    return /\d{5,}/.test(d) ? d : null;
  };
  const hdr = (n) => {
    try {
      return inv?.request?.getHeader?.(n) ?? null;
    } catch {
      return null;
    }
  };
  const fromHdr = (h) => {
    const m = h?.match(/sip:([^@;>]+)/i);
    return m ? digits(m[1]) : null;
  };
  return fromHdr(hdr("P-Asserted-Identity")) ?? fromHdr(hdr("Remote-Party-ID")) ?? digits(inv?.remoteIdentity?.uri?.user) ?? digits(inv?.remoteIdentity?.displayName) ?? null;
}
function hasDuplicateRegistration(contacts) {
  const uris = new Set((contacts ?? []).flatMap((h) => String(h).split(/,(?=\s*<)/)).map((c) => c.match(/<([^>]+)>/)?.[1] ?? c.trim()).filter(Boolean));
  return uris.size > 1;
}
function summarizeSipFrame(raw) {
  if (typeof raw !== "string") return null;
  const first = raw.split(/\r?\n/, 1)[0]?.trim() ?? "";
  if (!first) return null;
  const cseq = raw.match(/^CSeq:\s*\d+\s+([A-Z]+)/im)?.[1] ?? null;
  const resp = first.match(/^SIP\/2\.0\s+(\d{3})/);
  if (resp) return { kind: "response", method: cseq ?? "?", code: Number(resp[1]), cseq };
  const req = first.match(/^([A-Z]+)\s+\S+\s+SIP\/2\.0$/);
  if (req) return { kind: "request", method: req[1], code: null, cseq };
  return null;
}
class CallerDeskWebRtcEngine {
  snap = { state: "DISCONNECTED", error: null, remoteNumber: null, muted: false, connectedAt: null, direction: null, held: false, ringMuted: false, ringingSince: null };
  listeners = /* @__PURE__ */ new Set();
  ua = null;
  registerer = null;
  session = null;
  inFlight = false;
  audio = null;
  sip = null;
  domain = "";
  starting = false;
  onLog = null;
  log(e) {
    try {
      this.onLog?.({ state: this.snap.state, ...e });
    } catch {
    }
  }
  get snapshot() {
    return this.snap;
  }
  subscribe(l) {
    this.listeners.add(l);
    l(this.snap);
    return () => {
      this.listeners.delete(l);
    };
  }
  endTimer = null;
  emit(e, patch = {}) {
    const prev = this.snap.state;
    this.snap = { ...this.snap, ...patch, state: nextState(this.snap.state, e) };
    if (this.snap.state !== "RINGING") {
      this.stopRing();
      if (this.snap.ringingSince) this.snap = { ...this.snap, ringingSince: null };
    }
    if (this.snap.state !== "CONNECTED" && this.snap.held) this.snap = { ...this.snap, held: false };
    if (prev !== this.snap.state) this.log({ event: "STATE_CHANGED", detail: `${prev}->${this.snap.state}` });
    if (this.endTimer) {
      clearTimeout(this.endTimer);
      this.endTimer = null;
    }
    if (this.snap.state === "ENDED") this.endTimer = setTimeout(() => {
      this.endTimer = null;
      if (this.snap.state === "ENDED" && !this.session) this.emit("reset");
    }, 4e3);
    this.listeners.forEach((l) => l(this.snap));
  }
  async start(loadConfig) {
    if (this.starting || this.session || this.snap.state === "REGISTERED") return;
    this.starting = true;
    try {
      await this.stop();
      this.emit("check", { error: null });
      this.log({ event: "REGISTER_ATTEMPT" });
      let cfg;
      try {
        cfg = await loadConfig();
      } catch (err) {
        const msg = String(err?.message ?? "Configuration unavailable");
        return this.emit(/incomplete/i.test(msg) ? "config_missing" : "register_failed", { error: msg });
      }
      this.emit("config_ok");
      this.domain = cfg.sipDomain;
      try {
        this.sip = await import("../_libs/sip.js.mjs");
        const { UserAgent, Registerer, RegistererState } = this.sip;
        const uri = UserAgent.makeURI(`sip:${cfg.extension}@${cfg.sipDomain}`);
        if (!uri) throw new Error("Invalid SIP extension or domain.");
        this.ua = new UserAgent({
          uri,
          displayName: cfg.displayName,
          authorizationUsername: cfg.extension,
          authorizationPassword: cfg.password,
          // Register the Contact under the extension (SIP.js otherwise uses a random user part), and
          // deliver INVITEs to onInvite immediately; we send 180 Ringing ourselves.
          contactName: cfg.extension,
          sendInitialProvisionalResponse: false,
          transportOptions: { server: cfg.wssUrl, connectionTimeout: 8 },
          logLevel: "error",
          delegate: {
            onInvite: (inv) => this.onInvite(inv),
            onDisconnect: (e) => {
              this.log({ event: "TRANSPORT_LOST", reason: e?.message ?? null });
              const wasReady = this.snap.state === "REGISTERED";
              this.emit("transport_lost", { error: "Connection to CallerDesk lost. Check that FortiClient VPN is connected." });
              if (wasReady && e) this.scheduleReconnect();
            },
            onConnect: () => {
              this.retries = 0;
            }
          }
        });
        await this.ua.start().catch(() => {
          throw new Error("Cannot reach CallerDesk phone server. Connect FortiClient VPN and retry.");
        });
        this.tapTransport();
        this.claimTab(cfg.extension);
        this.registerer = new Registerer(this.ua);
        this.registerer.stateChange.addListener((s) => {
          if (s === RegistererState.Registered) {
            this.emit("registered", { error: null });
            this.log({ event: "REGISTER_SUCCESS" });
          } else if (s === RegistererState.Unregistered && this.snap.state === "CONNECTING") this.emit("register_failed", { error: "CallerDesk rejected the agent registration." });
        });
        await this.registerer.register({ requestDelegate: {
          onAccept: (r) => this.enforceSingleDevice(r),
          onReject: (r) => {
            const c = r?.message?.statusCode;
            this.log({ event: "REGISTER_FAILED", sipCode: c, reason: r?.message?.reasonPhrase });
            this.emit("register_failed", { error: registrationError(c) });
          }
        } });
      } catch (err) {
        const m = String(err?.message ?? "Registration failed");
        await this.stop();
        this.emit("check");
        this.emit("config_ok");
        this.log({ event: "REGISTER_FAILED", reason: m });
        this.emit("register_failed", { error: m });
      }
    } finally {
      this.starting = false;
    }
  }
  /**
   * Single-device rule: when CallerDesk reports more than one device signed in to this extension,
   * remove every sign-in (Contact: *) and sign this browser back in, so calls ring only here.
   * Limited to once per minute so two fighting devices cannot loop forever.
   */
  lastPurge = 0;
  async enforceSingleDevice(resp) {
    try {
      const contacts = resp?.message?.getHeaders?.("contact") ?? [];
      if (!hasDuplicateRegistration(contacts)) return;
      if (Date.now() - this.lastPurge < 6e4) {
        this.log({ event: "DUPLICATE_REGISTRATION", detail: `${contacts.length} devices, purge skipped (cooldown)` });
        return;
      }
      this.lastPurge = Date.now();
      this.log({ event: "DUPLICATE_REGISTRATION", detail: `${contacts.length} devices on extension, removing others` });
      await new Promise((resolve) => {
        this.registerer?.unregister({ all: true, requestDelegate: { onAccept: () => resolve(), onReject: () => resolve() } }).catch(() => resolve());
        setTimeout(resolve, 5e3);
      });
      await this.registerer?.register({ requestDelegate: {
        onAccept: (r) => {
          const n = (r?.message?.getHeaders?.("contact") ?? []).length;
          this.log({ event: "DUPLICATE_CLEARED", detail: `${n} device(s) now signed in` });
        }
      } });
      this.snap = { ...this.snap, error: null, notice: "Another device was signed in to your phone line and has been disconnected." };
      this.listeners.forEach((l) => l(this.snap));
    } catch (e) {
      this.log({ event: "DUPLICATE_PURGE_FAILED", reason: String(e?.message ?? e).slice(0, 200) });
    }
  }
  /** Only one CRM tab per extension: a newly connecting tab tells older tabs to sign out. */
  tabChannel = null;
  tabId = Math.random().toString(36).slice(2);
  claimTab(extension) {
    try {
      if (typeof BroadcastChannel === "undefined") return;
      this.tabChannel?.close();
      const ch = new BroadcastChannel(`bhs-phone-${extension}`);
      ch.onmessage = (ev) => {
        if (ev.data?.type !== "takeover" || ev.data.tab === this.tabId) return;
        if (this.session) return;
        this.log({ event: "TAB_TAKEOVER", detail: "phone moved to another CRM tab" });
        void this.stop().then(() => this.emit("register_failed", { error: "Your phone is now active in another CRM tab." }));
      };
      ch.postMessage({ type: "takeover", tab: this.tabId });
      this.tabChannel = ch;
    } catch {
    }
  }
  /** TEMPORARY inbound diagnostics: logs SIP frames as method + status only (OPTIONS keep-alives sampled). */
  optionsSeen = 0;
  tapTransport() {
    const t = this.ua?.transport;
    if (!t || t.__bhsTapped) return;
    t.__bhsTapped = true;
    const describe = (f) => f.kind === "request" ? `request ${f.method}` : `response ${f.code} to ${f.method}`;
    const origOnMessage = t.onMessage;
    t.onMessage = (raw) => {
      try {
        const f = summarizeSipFrame(raw);
        if (f) {
          if (f.method === "OPTIONS" && f.kind === "request") {
            this.optionsSeen++;
            if (this.optionsSeen % 20 === 1) this.log({ event: "SIP_IN", detail: `OPTIONS keep-alive (seen ${this.optionsSeen})` });
          } else this.log({ event: "SIP_IN", sipCode: f.code, detail: describe(f) });
        }
      } catch {
      }
      return origOnMessage?.call(t, raw);
    };
    const origSend = t.send.bind(t);
    t.send = (raw) => {
      try {
        const f = summarizeSipFrame(raw);
        if (f && f.method !== "OPTIONS") this.log({ event: "SIP_OUT", sipCode: f.code, detail: describe(f) });
      } catch {
      }
      return origSend(raw);
    };
    this.log({ event: "SIP_TAP_ACTIVE" });
  }
  retries = 0;
  retryTimer = null;
  /** Controlled reconnect: at most 3 attempts (5s, 15s, 45s), then the employee must press Connect. */
  scheduleReconnect() {
    if (this.retryTimer || this.retries >= 3 || !this.ua) return;
    const delay = 5e3 * 3 ** this.retries;
    this.retries++;
    this.log({ event: "RECONNECT_SCHEDULED", detail: `attempt ${this.retries} in ${delay / 1e3}s` });
    this.retryTimer = setTimeout(async () => {
      this.retryTimer = null;
      if (!this.ua || this.snap.state !== "RECONNECTING") return;
      try {
        await this.ua.reconnect();
        await this.registerer?.register();
      } catch {
        if (this.retries < 3) this.scheduleReconnect();
        else this.emit("register_failed", { error: "Could not reconnect to CallerDesk. Check FortiClient VPN, then press Connect." });
      }
    }, delay);
  }
  /** Re-registers after the browser regains network, only if we were waiting to reconnect. */
  onNetworkOnline() {
    if (this.snap.state === "RECONNECTING") {
      this.retries = 0;
      if (this.retryTimer) {
        clearTimeout(this.retryTimer);
        this.retryTimer = null;
      }
      this.scheduleReconnect();
    }
  }
  // Ringtone generated with Web Audio (no audio file). Stops whenever the phone leaves RINGING.
  ringCtx = null;
  ringTimer = null;
  startRing() {
    if (this.ringTimer || this.snap.ringMuted) return;
    try {
      const Ctx = window.AudioContext ?? window.webkitAudioContext;
      if (!Ctx) return;
      this.ringCtx ??= new Ctx();
      const ctx = this.ringCtx;
      void ctx.resume?.();
      const burst = () => {
        const t = ctx.currentTime;
        for (const off of [0, 0.4]) {
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.frequency.value = 440;
          const o2 = ctx.createOscillator();
          o2.frequency.value = 480;
          g.gain.setValueAtTime(1e-4, t + off);
          g.gain.exponentialRampToValueAtTime(0.15, t + off + 0.02);
          g.gain.setValueAtTime(0.15, t + off + 0.35);
          g.gain.exponentialRampToValueAtTime(1e-4, t + off + 0.38);
          o.connect(g);
          o2.connect(g);
          g.connect(ctx.destination);
          o.start(t + off);
          o2.start(t + off);
          o.stop(t + off + 0.4);
          o2.stop(t + off + 0.4);
        }
      };
      burst();
      this.ringTimer = setInterval(burst, 3e3);
    } catch {
    }
  }
  stopRing() {
    if (this.ringTimer) {
      clearInterval(this.ringTimer);
      this.ringTimer = null;
    }
  }
  setRingMuted(m) {
    this.snap = { ...this.snap, ringMuted: m };
    if (m) this.stopRing();
    else if (this.snap.state === "RINGING") this.startRing();
    this.listeners.forEach((l) => l(this.snap));
  }
  /** Hold/resume via SIP re-INVITE (sendonly). Works only if CallerDesk's Asterisk accepts re-INVITE; failure is reported, never faked. */
  async setHeld(held) {
    const s = this.session;
    if (!s || this.snap.state !== "CONNECTED" || held === this.snap.held) return;
    try {
      s.sessionDescriptionHandlerOptionsReInvite = { hold: held };
      await new Promise((resolve, reject) => {
        s.invite({ requestDelegate: { onAccept: () => resolve(), onReject: (r) => reject(new Error(String(r?.message?.statusCode ?? "rejected"))) } }).catch(reject);
      });
      this.log({ event: held ? "CALL_HOLD" : "CALL_RESUME" });
      this.snap = { ...this.snap, held, error: null };
    } catch (e) {
      this.log({ event: "HOLD_FAILED", reason: String(e?.message ?? e) });
      this.snap = { ...this.snap, error: held ? "CallerDesk did not accept hold for this call." : "Could not resume the call." };
    }
    this.listeners.forEach((l) => l(this.snap));
  }
  /** Speaker/headset output. Supported only where the browser implements setSinkId (Chrome/Edge). */
  static outputSelectionSupported() {
    return typeof HTMLMediaElement !== "undefined" && "setSinkId" in HTMLMediaElement.prototype;
  }
  sinkId = "";
  async setOutputDevice(id) {
    this.sinkId = id;
    this.audio ??= new Audio();
    try {
      await this.audio.setSinkId?.(id);
      this.log({ event: "OUTPUT_DEVICE_SET" });
    } catch {
      this.snap = { ...this.snap, error: "Could not switch to that speaker." };
      this.listeners.forEach((l) => l(this.snap));
    }
  }
  async mic() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      s.getTracks().forEach((t) => t.stop());
      return true;
    } catch (e) {
      this.snap = { ...this.snap, error: e?.name === "NotAllowedError" ? "Microphone permission denied. Allow microphone access in the browser." : "No microphone or headset found." };
      this.listeners.forEach((l) => l(this.snap));
      return false;
    }
  }
  wire(session) {
    const { SessionState } = this.sip;
    this.session = session;
    session.delegate = { ...session.delegate ?? {}, onSessionDescriptionHandler: () => this.watchPeer(session) };
    session.stateChange.addListener((s) => {
      if (s === SessionState.Established) {
        this.log({ event: "CALL_CONNECTED", number: this.snap.remoteNumber });
        this.attachAudio(session);
        this.emit("accepted", { connectedAt: Date.now() });
        this.startMediaProbe(session);
      }
      if (s === SessionState.Establishing) this.watchPeer(session);
      if (s === SessionState.Terminated) {
        void this.stopMediaProbe(session);
        this.releaseMedia(session);
        this.session = null;
        this.inFlight = false;
        const wasConnected = this.snap.state === "CONNECTED";
        this.log({ event: wasConnected ? "CALL_ENDED" : "CALL_NOT_CONNECTED", number: this.snap.remoteNumber, detail: wasConnected && this.snap.connectedAt ? `talk ${Math.round((Date.now() - this.snap.connectedAt) / 1e3)}s` : null });
        this.emit(this.snap.state === "CONNECTED" ? "hangup" : "rejected", { muted: false });
      }
    });
  }
  /** Stops microphone and remote tracks so no device stays in use after a call. */
  releaseMedia(session) {
    const pc = session?.sessionDescriptionHandler?.peerConnection;
    try {
      pc?.getSenders().forEach((s) => s.track?.stop());
      pc?.getReceivers().forEach((r) => r.track?.stop());
    } catch {
    }
    this.remote?.getTracks().forEach((t) => t.stop());
    this.remote = null;
    if (this.audio) {
      this.audio.pause();
      this.audio.srcObject = null;
    }
  }
  probe = null;
  /** Logs SDP direction, PC states, track and audio element state, then RTP stats every 4s (first 20s). */
  startMediaProbe(session) {
    const pc = session?.sessionDescriptionHandler?.peerConnection;
    if (!pc) return;
    this.log({ event: "MEDIA_SDP", detail: `local ${summarizeSdp(pc.localDescription?.sdp)} ; remote ${summarizeSdp(pc.remoteDescription?.sdp)}`.slice(0, 1e3) });
    let n = 0;
    const tick = async () => {
      n++;
      const recv = pc.getReceivers().filter((r) => r.track?.kind === "audio").map((r) => `${r.track.readyState}/muted=${r.track.muted}/enabled=${r.track.enabled}`).join(",") || "none";
      const a = this.audio;
      const el = a ? `src=${!!a.srcObject} tracks=${a.srcObject?.getAudioTracks().length ?? 0} paused=${a.paused} muted=${a.muted} vol=${a.volume}` : "no element";
      let st = "stats n/a";
      try {
        st = summarizeStats((await pc.getStats()).values());
      } catch {
      }
      this.log({ event: "MEDIA_PROBE", detail: `#${n} conn=${pc.connectionState} ice=${pc.iceConnectionState} track=${recv} audio[${el}] ${st}`.slice(0, 1e3) });
      if (n >= 5 && this.probe) {
        clearInterval(this.probe);
        this.probe = null;
      }
    };
    if (this.probe) clearInterval(this.probe);
    void tick();
    this.probe = setInterval(() => void tick(), 4e3);
  }
  async stopMediaProbe(session) {
    if (this.probe) {
      clearInterval(this.probe);
      this.probe = null;
    }
    const pc = session?.sessionDescriptionHandler?.peerConnection;
    if (!pc || this.snap.state !== "CONNECTED") return;
    try {
      this.log({ event: "MEDIA_FINAL", detail: summarizeStats((await pc.getStats()).values()).slice(0, 1e3) });
    } catch {
    }
  }
  remote = null;
  watched = /* @__PURE__ */ new WeakSet();
  /** Hooks ontrack + ICE state on the call's peer connection (idempotent). */
  watchPeer(session) {
    const pc = session?.sessionDescriptionHandler?.peerConnection;
    if (!pc || this.watched.has(pc)) return;
    this.watched.add(pc);
    pc.addEventListener("track", (ev) => {
      this.log({ event: "REMOTE_TRACK", detail: `kind=${ev.track.kind} state=${ev.track.readyState} muted=${ev.track.muted} streams=${ev.streams?.length ?? 0}` });
      if (ev.track.kind === "audio") this.addRemoteTrack(ev.track);
    });
    pc.addEventListener("connectionstatechange", () => this.log({ event: "PC_STATE", detail: pc.connectionState }));
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
  addRemoteTrack(track) {
    this.remote ??= new MediaStream();
    if (!this.remote.getTracks().some((t) => t.id === track.id)) this.remote.addTrack(track);
    if (!this.audio) {
      this.audio = new Audio();
      if (this.sinkId) void this.audio.setSinkId?.(this.sinkId).catch(() => {
      });
    }
    if (this.audio.srcObject !== this.remote) this.audio.srcObject = this.remote;
    void this.playAudio();
  }
  async playAudio() {
    if (!this.audio) return;
    try {
      await this.audio.play();
      this.log({ event: "AUDIO_PLAYING", detail: `muted=${this.audio.muted} vol=${this.audio.volume}` });
      if (this.snap.error?.startsWith("Browser blocked call audio")) {
        this.snap = { ...this.snap, error: null };
        this.listeners.forEach((l) => l(this.snap));
      }
    } catch (e) {
      if (e?.name === "AbortError") return;
      this.log({ event: "AUDIO_PLAYBACK_FAILED", reason: e?.name ?? "unknown" });
      this.snap = { ...this.snap, error: "Browser blocked call audio. Press Enable call audio, then check your headset/speaker." };
      this.listeners.forEach((l) => l(this.snap));
    }
  }
  /** Must be called from a user click to recover blocked browser playback. */
  async resumeAudio() {
    await this.playAudio();
  }
  attachAudio(session) {
    this.watchPeer(session);
    const pc = session.sessionDescriptionHandler?.peerConnection;
    if (!pc) {
      this.log({ event: "MEDIA_MISSING", reason: "no peer connection" });
      return;
    }
    pc.getReceivers().forEach((r) => r.track?.kind === "audio" && this.addRemoteTrack(r.track));
    if (!this.remote?.getAudioTracks().length) this.log({ event: "MEDIA_PENDING", reason: "no remote audio track yet" });
  }
  onInvite(inv) {
    this.log({ event: "INBOUND_INVITE_RECEIVED" });
    if (this.session) {
      if (this.session === inv) return;
      this.log({ event: "INBOUND_BUSY", sipCode: 486 });
      void inv.reject({ statusCode: 486 }).catch(() => {
      });
      return;
    }
    const from = callerFromInvite(inv);
    this.log({ event: "INBOUND_CALLER", detail: from ? "number extracted" : "no number" });
    this.wire(inv);
    inv.delegate = { ...inv.delegate ?? {}, onCancel: () => this.log({ event: "INBOUND_CANCELLED" }) };
    this.emit("incoming", { remoteNumber: from, direction: "inbound", error: null, connectedAt: null, ringingSince: Date.now() });
    if (this.snap.state !== "RINGING") {
      this.log({ event: "INBOUND_STATE_MISMATCH", detail: this.snap.state });
      return;
    }
    this.startRing();
    this.log({ event: "INBOUND_RINGING" });
    Promise.resolve().then(() => inv.progress?.()).then(() => this.log({ event: "INBOUND_PROGRESS_SENT" })).catch((e) => this.log({ event: "INBOUND_PROGRESS_FAILED", reason: String(e?.message ?? e) }));
  }
  async dial(number) {
    const digits = number.replace(/\D/g, "");
    if (!/^\d{10,13}$/.test(digits)) {
      this.snap = { ...this.snap, error: "Enter a valid phone number." };
      this.listeners.forEach((l) => l(this.snap));
      return;
    }
    if (!canDial(this.snap.state, this.inFlight) || !this.ua) return;
    this.inFlight = true;
    if (!await this.mic()) {
      this.inFlight = false;
      this.log({ event: "CALL_FAILED", reason: this.snap.error, number: digits });
      return;
    }
    const { Inviter, UserAgent } = this.sip;
    const target = UserAgent.makeURI(`sip:${digits}@${this.domain}`);
    const inviter = new Inviter(this.ua, target, { sessionDescriptionHandlerOptions: { constraints: { audio: true, video: false } } });
    this.wire(inviter);
    this.emit("dial", { remoteNumber: digits, direction: "outbound", error: null, connectedAt: null });
    this.log({ event: "CALL_DIALED", number: digits, detail: `sip:${digits}@${this.domain}` });
    await inviter.invite({
      requestDelegate: {
        onReject: (r) => {
          const c = r?.message?.statusCode;
          const why = r?.message?.reasonPhrase ?? "";
          this.log({ event: "CALL_REJECTED", sipCode: c, reason: why, number: digits });
          this.snap = { ...this.snap, error: `CallerDesk ended the call: ${c ?? "?"} ${why}`.trim() };
          this.listeners.forEach((l) => l(this.snap));
        }
      }
    }).catch((e) => {
      this.inFlight = false;
      this.log({ event: "CALL_FAILED", reason: String(e?.message ?? e), number: digits });
      this.emit("rejected", { error: "Call could not be placed." });
    });
  }
  async answer() {
    if (this.snap.state !== "RINGING" || !this.session || this.answering) return;
    this.answering = true;
    this.stopRing();
    try {
      this.log({ event: "INBOUND_ANSWER" });
      await this.session.accept({ sessionDescriptionHandlerOptions: { constraints: { audio: true, video: false } } });
      this.log({ event: "INBOUND_ACCEPTED" });
    } catch (e) {
      const denied = e?.name === "NotAllowedError" || /permission/i.test(String(e?.message));
      this.snap = { ...this.snap, error: denied ? "Microphone permission denied. Allow microphone access in the browser." : "Could not answer the call. Retry or reject the incoming call." };
      this.listeners.forEach((l) => l(this.snap));
      this.log({ event: "ANSWER_FAILED", reason: e?.name ?? null });
    } finally {
      this.answering = false;
    }
  }
  answering = false;
  async reject() {
    if (this.snap.state !== "RINGING" || !this.session) return;
    this.stopRing();
    this.log({ event: "INBOUND_REJECT" });
    try {
      await this.session.reject();
    } catch {
    }
  }
  async hangup() {
    const s = this.session;
    if (!s) return;
    const { SessionState } = this.sip;
    if (s.state === SessionState.Established) await s.bye();
    else if (typeof s.cancel === "function") await s.cancel();
  }
  setMuted(muted) {
    const pc = this.session?.sessionDescriptionHandler?.peerConnection;
    if (!pc || this.snap.state !== "CONNECTED") return;
    pc.getSenders().forEach((s) => {
      if (s.track) s.track.enabled = !muted;
    });
    this.snap = { ...this.snap, muted };
    this.listeners.forEach((l) => l(this.snap));
  }
  sendDtmf(tone) {
    if (this.snap.state === "CONNECTED") this.session?.sessionDescriptionHandler?.sendDtmf?.(tone);
  }
  async stop() {
    this.stopRing();
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
    this.retries = 0;
    if (this.probe) {
      clearInterval(this.probe);
      this.probe = null;
    }
    try {
      if (this.session) await this.hangup();
    } catch {
    }
    this.releaseMedia(this.session);
    try {
      await this.registerer?.unregister();
    } catch {
    }
    try {
      await this.ua?.stop();
    } catch {
    }
    this.ua = null;
    this.registerer = null;
    this.session = null;
    this.inFlight = false;
    this.emit("disconnect", { error: null, remoteNumber: null, connectedAt: null, muted: false, direction: null, held: false, ringingSince: null });
  }
}
export {
  CallerDeskWebRtcEngine,
  callerFromInvite,
  hasDuplicateRegistration,
  iceError,
  summarizeSdp,
  summarizeSipFrame,
  summarizeStats
};
