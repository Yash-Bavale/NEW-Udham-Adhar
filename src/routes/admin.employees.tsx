import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { UserCog, UserPlus, Pencil, Power, Search } from "lucide-react";
import { toast } from "sonner";
import {
  listStaffUsers, inviteEmployee, updateEmployee, setEmployeeActive,
} from "@/lib/crm/users-admin.functions";
import { ASSIGNABLE_ROLES, ROLE_LABELS, type Role } from "@/lib/roles";
import { useRole } from "@/hooks/useRole";
import { SectionCard } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LeadAssignmentTab } from "@/components/admin/LeadAssignmentTab";

export const Route = createFileRoute("/admin/employees")({
  head: () => ({ meta: [{ title: "Employees — Udyam Ops OS" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: EmployeesPage,
});

const ROLE_COLOR: Record<string, string> = {
  super_admin: "#b91c1c",
  admin: "#1d4ed8",
  manager: "#7c3aed",
  executive: "#0891b2",
  support: "#d97706",
  accounts: "#059669",
  finance: "#16a34a",
  operations: "#0ea5e9",
};

function RoleBadge({ role }: { role: string }) {
  const c = ROLE_COLOR[role] ?? "#64748b";
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{ background: `${c}1a`, color: c }}>
      <span className="size-1.5 rounded-full" style={{ background: c }} />
      {ROLE_LABELS[role as Role] ?? role.replace(/_/g, " ")}
    </span>
  );
}

function StatusPill({ active }: { active: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{
        background: active ? "rgba(16,185,129,0.12)" : "rgba(100,116,139,0.12)",
        color: active ? "#047857" : "#475569",
      }}>
      <span className="size-1.5 rounded-full" style={{ background: active ? "#10b981" : "#94a3b8" }} />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function formatIST(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    const fmt = new Intl.DateTimeFormat("en-IN", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: true,
      timeZone: "Asia/Kolkata",
    }).formatToParts(d);
    const get = (t: string) => fmt.find((p) => p.type === t)?.value ?? "";
    return `${get("day")}-${get("month")}-${get("year")} ${get("hour")}:${get("minute")} ${get("dayPeriod").toUpperCase()}`;
  } catch { return "—"; }
}

type Row = {
  id: string; email: string; full_name: string | null; mobile: string | null;
  is_active: boolean; created_at: string; last_sign_in_at: string | null | undefined; roles: string[];
};

function EmployeesPage() {
  const role = useRole();
  const qc = useQueryClient();
  const listFn = useServerFn(listStaffUsers);

  const { data, isLoading } = useQuery({ queryKey: ["admin.employees"], queryFn: () => listFn() });

  const [query, setQuery] = useState("");
  const rows: Row[] = data?.rows ?? [];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      (r.full_name ?? "").toLowerCase().includes(q) ||
      (r.email ?? "").toLowerCase().includes(q) ||
      (r.mobile ?? "").toLowerCase().includes(q) ||
      r.roles.some((x) => x.toLowerCase().includes(q)),
    );
  }, [rows, query]);

  const [addOpen, setAddOpen] = useState(false);
  const [editRow, setEditRow] = useState<Row | null>(null);
  const [deactivateRow, setDeactivateRow] = useState<Row | null>(null);

  const canManage = role.access("employees") === "full";
  if (!role.loading && !canManage) {
    return (
      <SectionCard>
        <div className="p-8 text-center">
          <UserCog className="size-10 mx-auto mb-3" style={{ color: "var(--admin-fg-subtle)" }} />
          <div className="text-sm font-medium">You don't have access to Employees.</div>
          <div className="text-xs mt-1" style={{ color: "var(--admin-fg-muted)" }}>
            Ask a super admin to grant you the admin role.
          </div>
        </div>
      </SectionCard>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-medium tracking-tight" style={{ color: "var(--admin-fg)" }}>Employees</h1>
          <p className="text-sm" style={{ color: "var(--admin-fg-muted)" }}>
            Staff directory. Invite new members, assign a role, deactivate access.
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="gap-1.5">
          <UserPlus className="size-4" /> Add Employee
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--admin-fg-subtle)" }} />
        <Input value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email, mobile, role…" className="pl-9" />
      </div>

      <SectionCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide" style={{ color: "var(--admin-fg-muted)" }}>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Mobile</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Last Login</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && Array.from({ length: 5 }).map((_, i) => (
                <tr key={`sk-${i}`} className="border-t" style={{ borderColor: "var(--admin-border)" }}>
                  {Array.from({ length: 7 }).map((__, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-3 rounded animate-pulse" style={{ background: "var(--admin-surface-2)" }} />
                    </td>
                  ))}
                </tr>
              ))}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center">
                  <UserCog className="size-8 mx-auto mb-2" style={{ color: "var(--admin-fg-subtle)" }} />
                  <div className="text-sm">No employees match.</div>
                  <Button size="sm" className="mt-3 gap-1.5" onClick={() => setAddOpen(true)}>
                    <UserPlus className="size-3.5" /> Add Employee
                  </Button>
                </td></tr>
              )}
              {!isLoading && filtered.map((u, i) => (
                <tr key={u.id} className="border-t" style={{ borderColor: "var(--admin-border)", background: i % 2 ? "var(--admin-surface-2)" : "transparent" }}>
                  <td className="px-4 py-2.5">{u.full_name ?? <span style={{ color: "var(--admin-fg-subtle)" }}>—</span>}</td>
                  <td className="px-4 py-2.5">{u.email}</td>
                  <td className="px-4 py-2.5">{u.mobile ?? <span style={{ color: "var(--admin-fg-subtle)" }}>—</span>}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex flex-wrap gap-1">
                      {u.roles.length === 0 ? <span className="text-xs" style={{ color: "var(--admin-fg-subtle)" }}>—</span>
                        : u.roles.map((r) => <RoleBadge key={r} role={r} />)}
                    </div>
                  </td>
                  <td className="px-4 py-2.5"><StatusPill active={u.is_active && u.roles.length > 0} /></td>
                  <td className="px-4 py-2.5 text-xs" style={{ color: "var(--admin-fg-muted)" }}>
                    {formatIST(u.last_sign_in_at)}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="inline-flex gap-1">
                      <Button size="sm" variant="ghost" className="h-7 gap-1" onClick={() => setEditRow(u)}>
                        <Pencil className="size-3.5" /> Edit
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 gap-1"
                        style={{ color: u.is_active ? "#b91c1c" : "#047857" }}
                        onClick={() => setDeactivateRow(u)}>
                        <Power className="size-3.5" /> {u.is_active ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <AddEmployeeDialog open={addOpen} onOpenChange={setAddOpen}
        onCreated={() => qc.invalidateQueries({ queryKey: ["admin.employees"] })} />

      <EditEmployeeDialog row={editRow} onClose={() => setEditRow(null)}
        onSaved={() => qc.invalidateQueries({ queryKey: ["admin.employees"] })} />

      <DeactivateDialog row={deactivateRow} onClose={() => setDeactivateRow(null)}
        onDone={() => qc.invalidateQueries({ queryKey: ["admin.employees"] })} />
    </div>
  );
}

function AddEmployeeDialog({ open, onOpenChange, onCreated }:
  { open: boolean; onOpenChange: (v: boolean) => void; onCreated: () => void }) {
  const inviteFn = useServerFn(inviteEmployee);
  const [full_name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRoleVal] = useState<Role>("executive");
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  function reset() { setName(""); setEmail(""); setMobile(""); setRoleVal("executive"); setErrs({}); }

  async function submit() {
    const e: Record<string, string> = {};
    if (!full_name.trim()) e.full_name = "Full name is required.";
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Valid email is required.";
    setErrs(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      await inviteFn({ data: { full_name, email, mobile: mobile || null, role } });
      toast.success(`Invitation sent to ${email}`);
      reset();
      onOpenChange(false);
      onCreated();
    } catch (err) {
      toast.error((err as Error).message);
    } finally { setBusy(false); }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Employee</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Field label="Full Name" error={errs.full_name}>
            <Input value={full_name} onChange={(e) => setName(e.target.value)} placeholder="Asha Sharma" />
          </Field>
          <Field label="Email" error={errs.email}>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="asha@udyamadhar.in" type="email" />
          </Field>
          <Field label="Mobile">
            <Input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="9876543210" />
          </Field>
          <Field label="Role">
            <Select value={role} onValueChange={(v) => setRoleVal(v as Role)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ASSIGNABLE_ROLES.map((r) => (
                  <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <p className="text-xs" style={{ color: "var(--admin-fg-muted)" }}>
            An invite email will be sent. The employee sets their own password on first login.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={busy}>{busy ? "Sending…" : "Send Invite"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditEmployeeDialog({ row, onClose, onSaved }:
  { row: Row | null; onClose: () => void; onSaved: () => void }) {
  const updateFn = useServerFn(updateEmployee);
  const [full_name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRoleVal] = useState<Role>("executive");
  const [busy, setBusy] = useState(false);

  // Reset when row changes
  useMemoOnRow(row, (r) => {
    setName(r.full_name ?? "");
    setMobile(r.mobile ?? "");
    setRoleVal((r.roles[0] as Role) ?? "executive");
  });

  if (!row) return null;

  async function submit() {
    if (!row) return;
    setBusy(true);
    try {
      await updateFn({ data: { user_id: row.id, full_name, mobile: mobile || null, role } });
      toast.success("Employee updated.");
      onSaved();
      onClose();
    } catch (e) { toast.error((e as Error).message); }
    finally { setBusy(false); }
  }

  return (
    <Dialog open onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Employee</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Field label="Email"><Input value={row.email} disabled /></Field>
          <Field label="Full Name">
            <Input value={full_name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Mobile">
            <Input value={mobile} onChange={(e) => setMobile(e.target.value)} />
          </Field>
          <Field label="Role">
            <Select value={role} onValueChange={(v) => setRoleVal(v as Role)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ASSIGNABLE_ROLES.map((r) => (
                  <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={busy}>{busy ? "Saving…" : "Save Changes"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeactivateDialog({ row, onClose, onDone }:
  { row: Row | null; onClose: () => void; onDone: () => void }) {
  const fn = useServerFn(setEmployeeActive);
  const [busy, setBusy] = useState(false);
  if (!row) return null;
  const willActivate = !row.is_active;
  async function go() {
    if (!row) return;
    setBusy(true);
    try {
      await fn({ data: { user_id: row.id, is_active: willActivate } });
      toast.success(willActivate ? "Employee activated." : "Employee deactivated.");
      onDone();
      onClose();
    } catch (e) { toast.error((e as Error).message); }
    finally { setBusy(false); }
  }
  return (
    <AlertDialog open onOpenChange={(v) => { if (!v) onClose(); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{willActivate ? "Activate" : "Deactivate"} {row.full_name ?? row.email}?</AlertDialogTitle>
          <AlertDialogDescription>
            {willActivate
              ? <>This will restore login access for <b>{row.email}</b>. Their previous roles remain assigned.</>
              : <>This will block <b>{row.email}</b> from signing in. Their roles stay assigned and can be restored anytime.</>}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={go} disabled={busy}
            style={willActivate ? undefined : { background: "#b91c1c" }}>
            {busy ? "Working…" : willActivate ? "Activate" : "Deactivate"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      {children}
      {error && <div className="text-[11px]" style={{ color: "#b91c1c" }}>{error}</div>}
    </div>
  );
}

// Tiny helper to seed form state when row changes.
import { useEffect } from "react";
function useMemoOnRow(row: Row | null, cb: (r: Row) => void) {
  useEffect(() => { if (row) cb(row); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [row?.id]);
}
