// Pure, client-safe state machine. Used by both server fns and UI.
// No supabase imports here — must stay tree-shakable into the browser bundle.

import type { LeadStatus, ApplicationStatus, StaffRole } from "./types";

export type ComplaintStatus = "pending" | "in_progress" | "resolved" | "closed";

type RoleSet = readonly StaffRole[];

const ALL_OPS: RoleSet = ["super_admin", "admin", "operations"] as const;
const SUPER: RoleSet = ["super_admin"] as const;

// ---------- LEAD ----------
export const LEAD_TRANSITIONS: Record<LeadStatus, { to: LeadStatus; label: string; roles: RoleSet }[]> = {
  lead_created:       [{ to: "payment_pending",    label: "Send Payment Link",  roles: ALL_OPS }],
  payment_pending:    [
    { to: "payment_completed",  label: "Mark Paid (Manual)", roles: SUPER },
    { to: "abandoned",          label: "Mark Abandoned",     roles: ALL_OPS },
  ],
  payment_completed:  [{ to: "details_pending",    label: "Request Customer Details", roles: ALL_OPS }],
  details_pending:    [{ to: "documents_pending",  label: "Move to Documents",   roles: ALL_OPS }],
  documents_pending:  [{ to: "in_progress",        label: "Start Processing",    roles: ALL_OPS }],
  in_progress:        [
    { to: "completed",          label: "Mark Completed",     roles: ALL_OPS },
    { to: "on_hold",            label: "Put on Hold",        roles: ALL_OPS },
  ],
  on_hold:            [{ to: "in_progress",        label: "Resume",              roles: ALL_OPS }],
  completed:          [],
  abandoned:          [{ to: "lead_created",       label: "Re-open Lead",        roles: SUPER }],
  cancelled:          [],
} as Record<LeadStatus, { to: LeadStatus; label: string; roles: RoleSet }[]>;

// ---------- APPLICATION ----------
export const APP_TRANSITIONS: Record<ApplicationStatus, { to: ApplicationStatus; label: string; roles: RoleSet }[]> = {
  awaiting_payment:   [{ to: "payment_received",   label: "Confirm Payment",     roles: SUPER }],
  payment_received:   [{ to: "details_pending",    label: "Request Details",     roles: ALL_OPS }],
  details_pending:    [{ to: "documents_pending",  label: "Move to Documents",   roles: ALL_OPS }],
  documents_pending:  [{ to: "under_review",       label: "Send for Review",     roles: ALL_OPS }],
  under_review:       [{ to: "under_process",      label: "Start Processing",    roles: ALL_OPS }],
  under_process:      [{ to: "completed",          label: "Mark Completed",      roles: ALL_OPS }],
  completed:          [],
};

// ---------- COMPLAINT ----------
export const COMPLAINT_TRANSITIONS: Record<ComplaintStatus, { to: ComplaintStatus; label: string; roles: RoleSet }[]> = {
  pending:     [{ to: "in_progress", label: "Start Working", roles: ALL_OPS }],
  in_progress: [
    { to: "resolved", label: "Mark Resolved", roles: ALL_OPS },
    { to: "pending",  label: "Back to Pending", roles: ALL_OPS },
  ],
  resolved:    [{ to: "closed",      label: "Close Complaint", roles: ALL_OPS }],
  closed:      [{ to: "in_progress", label: "Re-open",         roles: SUPER }],
};

export type EntityKind = "lead" | "application" | "complaint";

export function getAllowed<S extends string>(
  kind: EntityKind,
  current: S,
  roles: StaffRole[]
): { to: S; label: string }[] {
  const graph: Record<string, { to: string; label: string; roles: RoleSet }[]> =
    kind === "lead" ? (LEAD_TRANSITIONS as any) :
    kind === "application" ? (APP_TRANSITIONS as any) :
    (COMPLAINT_TRANSITIONS as any);
  const list = graph[current] ?? [];
  return list
    .filter((t) => t.roles.some((r) => roles.includes(r)))
    .map((t) => ({ to: t.to as S, label: t.label }));
}

export function isTransitionAllowed(
  kind: EntityKind,
  from: string,
  to: string,
  roles: StaffRole[]
): boolean {
  return getAllowed(kind, from as any, roles).some((t) => t.to === to);
}

// Status badge color helper (Tailwind classes — pure UI utility, safe in shared module)
export function statusTone(status: string): string {
  if (/(completed|resolved|received|paid)/.test(status)) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (/(in_progress|under_|process)/.test(status))       return "bg-sky-50 text-sky-700 border-sky-200";
  if (/(pending|awaiting|created|draft)/.test(status))   return "bg-amber-50 text-amber-700 border-amber-200";
  if (/(hold|review)/.test(status))                      return "bg-violet-50 text-violet-700 border-violet-200";
  if (/(abandoned|cancelled|closed|failed|rejected)/.test(status)) return "bg-rose-50 text-rose-700 border-rose-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
}
