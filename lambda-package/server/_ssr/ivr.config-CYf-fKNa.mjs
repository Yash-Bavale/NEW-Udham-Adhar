import { o as object, n as number, l as literal, a as array, s as string, b as boolean, _ as _enum } from "../_libs/zod.mjs";
const audio = string().trim().max(2e3).refine((v) => !v || /^https:\/\//i.test(v), "Use an HTTPS audio URL or leave it blank.");
const destination = object({
  kind: _enum(["member", "queue", "department", "number", "terminate"]),
  value: string().trim().max(100)
}).superRefine((d, ctx) => {
  if (d.kind !== "terminate" && !d.value) ctx.addIssue({ code: "custom", message: "Enter the provider destination." });
  if ((d.kind === "member" || d.kind === "number") && !/^\+?\d+$/.test(d.value)) ctx.addIssue({ code: "custom", message: "Member IDs and numbers must contain digits only (optional leading +)." });
  if (d.kind === "number" && !/^\+?\d{10,13}$/.test(d.value)) ctx.addIssue({ code: "custom", message: "Enter a 10–13 digit destination number." });
});
const IvrDraftSchema = object({
  enabled: boolean(),
  businessNumber: string().trim().max(20).refine((v) => !v || /^\+?\d{10,13}$/.test(v), "Enter a valid business number."),
  greetingAudio: audio,
  menuAudio: audio,
  afterHoursAudio: audio,
  invalidInputAudio: audio,
  noInputAudio: audio,
  unavailableAudio: audio,
  menu: array(object({ key: string().regex(/^[0-9*#]$/), label: string().trim().min(1).max(80), destination })).max(12),
  businessHours: array(object({ day: number().int().min(0).max(6), open: string().regex(/^([01]\d|2[0-3]):[0-5]\d$/), close: string().regex(/^([01]\d|2[0-3]):[0-5]\d$/) })).max(7),
  timezone: literal("Asia/Kolkata"),
  retries: number().int().min(0).max(5),
  timeoutSeconds: number().int().min(3).max(60),
  noAnswerSeconds: number().int().min(5).max(120),
  afterHours: destination,
  fallback: destination
}).superRefine((c, ctx) => {
  if (new Set(c.menu.map((m) => m.key)).size !== c.menu.length) ctx.addIssue({ code: "custom", message: "Each menu key must be unique." });
  if (new Set(c.businessHours.map((h) => h.day)).size !== c.businessHours.length) ctx.addIssue({ code: "custom", message: "Each weekday may appear only once." });
  if (c.businessHours.some((h) => h.open >= h.close)) ctx.addIssue({ code: "custom", message: "Closing time must be after opening time. Split overnight schedules in the provider portal." });
  if (c.enabled && (!c.businessNumber || !c.greetingAudio || !c.menuAudio || !c.menu.length || !c.businessHours.length)) ctx.addIssue({ code: "custom", message: "An enabled draft requires a business number, greeting, menu audio, menu choices and business hours." });
});
const EMPTY_IVR_DRAFT = {
  enabled: false,
  businessNumber: "",
  greetingAudio: "",
  menuAudio: "",
  afterHoursAudio: "",
  invalidInputAudio: "",
  noInputAudio: "",
  unavailableAudio: "",
  menu: [],
  businessHours: [],
  timezone: "Asia/Kolkata",
  retries: 2,
  timeoutSeconds: 10,
  noAnswerSeconds: 30,
  afterHours: { kind: "terminate", value: "" },
  fallback: { kind: "terminate", value: "" }
};
async function requireTelephonyAdmin(ctx) {
  const roles = await Promise.all(["admin", "super_admin"].map((_role) => ctx.supabase.rpc("has_role", { _user_id: ctx.userId, _role })));
  if (!roles.some((r) => !r.error && r.data === true)) throw new Error("Only administrators can manage IVR settings.");
}
export {
  EMPTY_IVR_DRAFT as E,
  IvrDraftSchema as I,
  requireTelephonyAdmin as r
};
