import { o as object, s as string, _ as _enum } from "../_libs/zod.mjs";
const CALL_OUTCOMES = [
  "Interested",
  "Follow-up Required",
  "No Answer",
  "Busy",
  "Call Back Later",
  "Customer Not Reachable",
  "Wrong Number",
  "Not Interested",
  "Issue Resolved",
  "Other"
];
const LEGACY_OUTCOMES = ["Customer Query", "Payment Related", "Documents Required", "Technical Issue", "Completed"];
const ALL_OUTCOMES = [...CALL_OUTCOMES, ...LEGACY_OUTCOMES];
const OUTCOMES_NEEDING_FOLLOW_UP = /* @__PURE__ */ new Set(["Follow-up Required", "Call Back Later"]);
const wrapUpInput = object({
  id: string().uuid(),
  disposition: _enum(ALL_OUTCOMES),
  notes: string().max(2e3).optional(),
  nextAction: string().trim().max(300).optional(),
  followUpAt: string().datetime({ offset: true }).nullable().optional(),
  applicationId: string().uuid().nullable().optional()
}).superRefine((v, ctx) => {
  if (OUTCOMES_NEEDING_FOLLOW_UP.has(v.disposition) && !v.followUpAt)
    ctx.addIssue({ code: "custom", path: ["followUpAt"], message: "Pick a follow-up date and time for this outcome." });
});
function cleanDialInput(raw) {
  const t = raw.trim();
  const plus = t.startsWith("+");
  const body = t.replace(/[^\d*#]/g, "");
  return (plus ? "+" : "") + body.slice(0, 15);
}
function dialTarget(raw) {
  if (/[*#]/.test(raw)) return null;
  const d = raw.replace(/\D/g, "");
  if (/^[6-9]\d{9}$/.test(d)) return d;
  if (/^91[6-9]\d{9}$/.test(d)) return d.slice(2);
  if (raw.trim().startsWith("+") && /^\d{8,15}$/.test(d)) return d;
  if (/^0\d{9,11}$/.test(d)) return d;
  return null;
}
export {
  CALL_OUTCOMES as C,
  OUTCOMES_NEEDING_FOLLOW_UP as O,
  cleanDialInput as c,
  dialTarget as d,
  wrapUpInput as w
};
