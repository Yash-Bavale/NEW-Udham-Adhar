import { describe, expect, it } from "vitest";

// Mirrors the rule added in OnboardingForm.tsx (client) and
// onboarding.functions.ts (server): commencement must not be after incorporation.
function violatesRule(incorporation?: string, commencement?: string): boolean {
  return Boolean(incorporation && commencement && commencement > incorporation);
}

describe("commencement vs incorporation date rule", () => {
  it("rejects commencement later than incorporation", () => {
    expect(violatesRule("2024-01-10", "2024-06-01")).toBe(true);
  });
  it("allows commencement before incorporation", () => {
    expect(violatesRule("2024-06-01", "2024-01-10")).toBe(false);
  });
  it("allows equal dates", () => {
    expect(violatesRule("2024-03-15", "2024-03-15")).toBe(false);
  });
  it("skips when either date is missing", () => {
    expect(violatesRule(undefined, "2024-01-10")).toBe(false);
    expect(violatesRule("2024-01-10", undefined)).toBe(false);
  });
});
