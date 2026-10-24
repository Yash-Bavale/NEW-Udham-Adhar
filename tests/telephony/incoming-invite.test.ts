import { describe, it, expect } from "vitest";
import { callerFromInvite } from "@/lib/telephony/callerdesk-webrtc.engine";
import { nextState } from "@/lib/telephony/callerdesk-webrtc.config";
const inv = (h: Record<string, string>, user?: string) => ({ request: { getHeader: (n: string) => h[n] ?? null }, remoteIdentity: { uri: { user }, displayName: "" } });
describe("incoming INVITE", () => {
  it("prefers P-Asserted-Identity", () => expect(callerFromInvite(inv({ "P-Asserted-Identity": "<sip:9876543210@x>" }, "asterisk"))).toBe("9876543210"));
  it("falls back to From user", () => expect(callerFromInvite(inv({}, "09561396866"))).toBe("09561396866"));
  it("returns null without a number", () => expect(callerFromInvite(inv({}, "asterisk"))).toBeNull());
  it("ringing → connected on accept, ended on cancel/reject", () => {
    expect(nextState("REGISTERED", "incoming")).toBe("RINGING");
    expect(nextState("RINGING", "accepted")).toBe("CONNECTED");
    expect(nextState("RINGING", "rejected")).toBe("ENDED");
    expect(nextState("ENDED", "reset")).toBe("REGISTERED");
  });
  it("outbound still dials from Ready", () => expect(nextState("REGISTERED", "dial")).toBe("CALLING"));
});
