import { describe, it, expect, afterEach, vi } from "vitest";
import {
  parseMemberList, resolveMemberId, campaignId, callSid, mapCallerDeskStatus, verifyCallerDesk, callerDeskClickToCall,
} from "@/lib/telephony/callerdesk.server";

const LIVE = { type: "success", getmember: [{ member_id: "122142", member_num: "09561396866", member_name: "Sid" }] };

describe("CallerDesk member lookup", () => {
  it("reads getmember and resolves Sid to 122142 by mobile", () => {
    expect(resolveMemberId(parseMemberList(LIVE), "9561396866", null)).toBe("122142");
  });
  it("ignores the old member/data/members keys", () => {
    expect(parseMemberList({ type: "success", member: LIVE.getmember })).toEqual([]);
  });
  it("does not give Sid's id to another employee", () => {
    expect(resolveMemberId(parseMemberList(LIVE), "9876543210", null)).toBeNull();
  });
  it("rejects an explicit mapping that CallerDesk does not know", () => {
    expect(resolveMemberId(parseMemberList(LIVE), "9561396866", "999")).toBeNull();
  });
});

describe("CallerDesk click-to-call", () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
  it("uses click_to_call_v4 with member_id and never v2", async () => {
    vi.stubEnv("CALLERDESK_AUTHCODE", "x"); vi.stubEnv("CALLERDESK_DESKPHONE", "y");
    const urls: string[] = [];
    vi.stubGlobal("fetch", vi.fn(async (u: string) => {
      urls.push(String(u));
      return new Response(JSON.stringify(String(u).includes("getmemberlist") ? LIVE : { type: "success", campid: 555 }), { status: 200 });
    }));
    const r = await callerDeskClickToCall("9561396866", null, "9767100075");
    expect(r).toEqual({ campid: "555", memberId: "122142" });
    expect(urls[1]).toContain("click_to_call_v4");
    expect(urls[1]).toContain("member_id=122142");
    expect(urls.some((u) => u.includes("click_to_call_v2"))).toBe(false);
  });
  it("fails clearly when no member matches (no fallback call)", async () => {
    vi.stubEnv("CALLERDESK_AUTHCODE", "x"); vi.stubEnv("CALLERDESK_DESKPHONE", "y");
    const f = vi.fn(async () => new Response(JSON.stringify(LIVE), { status: 200 }));
    vi.stubGlobal("fetch", f);
    await expect(callerDeskClickToCall("9876543210", null, "9767100075")).rejects.toThrow(/No CallerDesk member/);
    expect(f).toHaveBeenCalledTimes(1);
  });
  it("fails when CallerDesk refuses the call", async () => {
    vi.stubEnv("CALLERDESK_AUTHCODE", "x"); vi.stubEnv("CALLERDESK_DESKPHONE", "y");
    vi.stubGlobal("fetch", vi.fn(async (u: string) => new Response(JSON.stringify(String(u).includes("getmemberlist") ? LIVE : { type: "error", message: "Low balance" }), { status: 200 })));
    await expect(callerDeskClickToCall("9561396866", null, "9767100075")).rejects.toThrow("Call not started: Low balance");
  });
});

describe("CallerDesk webhook parsing", () => {
  afterEach(() => vi.unstubAllEnvs());
  it.each([["Campid"], ["campid"], ["camp_id"]])("reads campaign id from %s", (k) => {
    expect(campaignId({ [k]: "56431323" })).toBe("56431323");
  });
  it("reads CallSid", () => { expect(callSid({ CallSid: "abc" })).toBe("abc"); });
  it("live payload is ringing, answered report is ended, unanswered report is missed", () => {
    expect(mapCallerDeskStatus({ Status: "Ringing" })).toBe("ringing");
    expect(mapCallerDeskStatus({ Status: "ANSWER", EndTime: "2026-10-10 11:00:00", TalkDuration: "30" })).toBe("ended");
    expect(mapCallerDeskStatus({ Status: "NOANSWER", EndTime: "2026-10-10 11:00:00", TalkDuration: "0" })).toBe("missed");
  });
  it("rejects a wrong webhook token", () => {
    vi.stubEnv("CALLERDESK_WEBHOOK_TOKEN", "right-token");
    expect(verifyCallerDesk(new Request("https://x/e?token=wrong-token"))).toBe(false);
    expect(verifyCallerDesk(new Request("https://x/e?token=right-token"))).toBe(true);
  });
});
