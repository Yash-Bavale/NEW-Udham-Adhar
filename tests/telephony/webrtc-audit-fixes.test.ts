import { describe, it, expect, vi } from "vitest";
import { reportEnrichment } from "@/lib/telephony/callerdesk.server";
import { isDiagAdmin } from "@/lib/telephony/webrtc-diag.functions";
import { CallerDeskWebRtcEngine, iceError } from "@/lib/telephony/callerdesk-webrtc.engine";

const REPORT = { Status: "ANSWER", CallRecordingUrl: "https://rec.example/a.mp3", TalkDuration: "42", EndTime: "2026-10-13 11:00:00", LegB_Picked_time: "2026-10-13 10:59:18" };

describe("webhook Call Report enrichment", () => {
  it("fills recording, duration, end time on an already-ended call", () => {
    const e = reportEnrichment({ status: "ended", recording_url: null, duration_seconds: null, ended_at: null, answered_at: null }, REPORT);
    expect(e.recording_url).toBe("https://rec.example/a.mp3");
    expect(e.duration_seconds).toBe(42);
    expect(e.ended_at).toBe("2026-10-13T05:30:00.000Z");
    expect(e).not.toHaveProperty("status");
  });
  it("repeat delivery of the same report is a duplicate (no fields)", () => {
    const row = { status: "ended", recording_url: "https://rec.example/a.mp3", duration_seconds: 42, ended_at: "2026-10-13T05:30:00.000Z", answered_at: "x", hangup_cause: "ANSWER" };
    expect(reportEnrichment(row, REPORT)).toEqual({});
  });
  it("never overwrites an existing recording or duration", () => {
    const e = reportEnrichment({ recording_url: "https://old", duration_seconds: 10, ended_at: null }, REPORT);
    expect(e.recording_url).toBeUndefined();
    expect(e.duration_seconds).toBeUndefined();
  });
  it("ignores non-http recording urls", () => {
    expect(reportEnrichment({}, { CallRecordingUrl: "javascript:x" }).recording_url).toBeUndefined();
  });
});

describe("diagnostics authorization", () => {
  const ctx = (roles: string[]) => ({ userId: "u", supabase: { rpc: vi.fn(async (_: string, a: any) => ({ data: roles.includes(a._role) })) } });
  it("allows admin", async () => { expect(await isDiagAdmin(ctx(["admin"]))).toBe(true); });
  it("allows super_admin", async () => { expect(await isDiagAdmin(ctx(["super_admin"]))).toBe(true); });
  it("denies ordinary employees", async () => { expect(await isDiagAdmin(ctx(["support", "operations"]))).toBe(false); });
});

describe("engine media handling", () => {
  it("ICE failure / disconnect produce visible errors; connected does not", () => {
    expect(iceError("failed")).toMatch(/audio path failed/);
    expect(iceError("disconnected")).toMatch(/interrupted/);
    expect(iceError("connected")).toBeNull();
  });
  it("attaches remote tracks from ontrack and stops them on release", async () => {
    const stop = vi.fn();
    const track = { id: "t1", kind: "audio", stop } as any;
    class MS { t: any[] = []; addTrack(x: any) { this.t.push(x); } getTracks() { return this.t; } getAudioTracks() { return this.t; } }
    const audio = { srcObject: null as any, play: vi.fn(async () => {}), pause: vi.fn() };
    vi.stubGlobal("MediaStream", MS);
    const handlers: Record<string, Function> = {};
    const pc = { addEventListener: (n: string, f: Function) => { handlers[n] = f; }, getReceivers: () => [], getSenders: () => [], iceConnectionState: "new" };
    const eng: any = new CallerDeskWebRtcEngine(); eng.audio = audio;
    const session = { sessionDescriptionHandler: { peerConnection: pc } };
    eng.watchPeer(session); eng.watchPeer(session); // idempotent
    handlers.track({ track });
    expect(audio.srcObject.getTracks()).toEqual([track]);
    expect(audio.play).toHaveBeenCalled();
    pc.iceConnectionState = "failed"; handlers.iceconnectionstatechange();
    expect(eng.snapshot.error).toMatch(/audio path failed/);
    eng.releaseMedia(session);
    expect(stop).toHaveBeenCalled();
    expect(audio.srcObject).toBeNull();
    vi.unstubAllGlobals();
  });
  it("blocked autoplay is reported, not swallowed", async () => {
    const audio = { srcObject: null, play: vi.fn(async () => { throw Object.assign(new Error("x"), { name: "NotAllowedError" }); }), pause: vi.fn() };
    const eng: any = new CallerDeskWebRtcEngine(); eng.audio = audio;
    const logs: any[] = []; eng.onLog = (e: any) => logs.push(e);
    await eng.playAudio();
    expect(eng.snapshot.error).toMatch(/blocked call audio/);
    expect(logs[0].event).toBe("AUDIO_PLAYBACK_FAILED");
  });
});
