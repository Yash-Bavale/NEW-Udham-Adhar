import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { UserCog, UserPlus, Pencil, Power, Search, KeyRound, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import {
  listStaffUsers, inviteEmployee, updateEmployee, setEmployeeActive, resetEmployeePassword,
  getEmployeeWorkAccess, setEmployeeWorkAccess, deleteEmployee,
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
import { AssignmentManagementView } from "@/components/admin/reassignment/AssignmentManagementView";
import { Trash2, Copy, Check } from "lucide-react";

export const Route = createFileRoute("/admin/employees")({
  head: () => ({ meta: [{ title: "Employees — Udyam Ops OS" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: EmployeesPage,
});

type RoleColorMap = Record<string, string>;
const ROLE_COLOR: RoleColorMap = {
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

type Perf = {
  assignedLeads: number;
  openLeads: number;
  assignedApps: number;
  openApps: number;
  completedThisMonth: number;
  avgTurnaroundHours: number | null;
};
type Row = {
  id: string; email: string; full_name: string | null; mobile: string | null;
  is_active: boolean; created_at: string; last_sign_in_at: string | null | undefined; roles: string[];
  employee_code?: string | null; department?: string | null; joining_date?: string | null;
  perf?: Perf;
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
  const [deleteRow, setDeleteRow] = useState<Row | null>(null);
  const [resetPwRow, setResetPwRow] = useState<Row | null>(null);
  const [accessRow, setAccessRow] = useState<Row | null>(null);


  const canManage = role.access("employees") === "full";
  const canSee = role.access("employees") !== "none";
  const isSuper = role.has("super_admin");
  if (!role.loading && !canSee) {
    return (
      <SectionCard>
        <div className="p-8 text-center">
          <UserCog className="size-10 mx-auto mb-3" style={{ color: "var(--admin-fg-subtle)" }} />
          <div className="text-sm font-medium">You don't have access to Employees.</div>
          <div className="text-xs mt-1" style={{ color: "var(--admin-fg-muted)" }}>
            Ask a super admin to grant you access.
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
            Staff directory and lead-assignment pool.
          </p>
        </div>
      </div>

      <Tabs defaultValue="directory">
        <TabsList>
          <TabsTrigger value="directory">Directory</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="assignment">Auto-Assignment Pool</TabsTrigger>
          <TabsTrigger value="leaves">Leaves & Reassignment</TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="space-y-4 mt-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="relative max-w-md flex-1">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--admin-fg-subtle)" }} />
              <Input value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, email, mobile, role…" className="pl-9" />
            </div>
            {canManage && (
              <Button onClick={() => setAddOpen(true)} className="gap-1.5">
                <UserPlus className="size-4" /> Add Employee
              </Button>
            )}
          </div>

          <SectionCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide" style={{ color: "var(--admin-fg-muted)" }}>
                <th className="px-4 py-2">Emp ID</th>
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
                  {Array.from({ length: 8 }).map((__, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-3 rounded animate-pulse" style={{ background: "var(--admin-surface-2)" }} />
                    </td>
                  ))}
                </tr>
              ))}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-10 text-center">
                  <UserCog className="size-8 mx-auto mb-2" style={{ color: "var(--admin-fg-subtle)" }} />
                  <div className="text-sm">No employees match.</div>
                  <Button size="sm" className="mt-3 gap-1.5" onClick={() => setAddOpen(true)}>
                    <UserPlus className="size-3.5" /> Add Employee
                  </Button>
                </td></tr>
              )}
              {!isLoading && filtered.map((u, i) => (
                <tr key={u.id} className="border-t" style={{ borderColor: "var(--admin-border)", background: i % 2 ? "var(--admin-surface-2)" : "transparent" }}>
                  <td className="px-4 py-2.5 font-mono text-xs" style={{ color: "var(--admin-fg-muted)" }}>
                    {u.employee_code ?? <span style={{ color: "var(--admin-fg-subtle)" }}>—</span>}
                  </td>
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
                      {canManage && (
                        <Button size="sm" variant="ghost" className="h-7 gap-1" onClick={() => setEditRow(u)}>
                          <Pencil className="size-3.5" /> Edit
                        </Button>
                      )}
                      {canManage && (
                        <Button size="sm" variant="ghost" className="h-7 gap-1"
                          style={{ color: "#7c3aed" }}
                          onClick={() => setAccessRow(u)}>
                          <ShieldCheck className="size-3.5" /> Work Access
                        </Button>
                      )}

                      {isSuper && (
                        <Button size="sm" variant="ghost" className="h-7 gap-1"
                          style={{ color: "#1d4ed8" }}
                          onClick={() => setResetPwRow(u)}>
                          <KeyRound className="size-3.5" /> Password
                        </Button>
                      )}
                      {canManage && (
                        <Button size="sm" variant="ghost" className="h-7 gap-1"
                          style={{ color: u.is_active ? "#b91c1c" : "#047857" }}
                          onClick={() => setDeactivateRow(u)}>
                          <Power className="size-3.5" /> {u.is_active ? "Deactivate" : "Activate"}
                        </Button>
                      )}
                      {canManage && (
                        <Button size="sm" variant="ghost" className="h-7 gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setDeleteRow(u)}>
                          <Trash2 className="size-3.5" /> Delete
                        </Button>
                      )}
                      {!canManage && !isSuper && (
                        <span className="text-xs" style={{ color: "var(--admin-fg-subtle)" }}>—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          </SectionCard>

          {addOpen && (
            <AddEmployeeDialog open={addOpen} onOpenChange={setAddOpen}
              onCreated={() => qc.invalidateQueries({ queryKey: ["admin.employees"] })} />
          )}

          {editRow && (
            <EditEmployeeDialog row={editRow} onClose={() => setEditRow(null)}
              onSaved={() => qc.invalidateQueries({ queryKey: ["admin.employees"] })} />
          )}

          {deactivateRow && (
            <DeactivateDialog row={deactivateRow} onClose={() => setDeactivateRow(null)}
              onDone={() => qc.invalidateQueries({ queryKey: ["admin.employees"] })} />
          )}

          {deleteRow && (
            <DeleteEmployeeDialog row={deleteRow} onClose={() => setDeleteRow(null)}
              onDone={() => qc.invalidateQueries({ queryKey: ["admin.employees"] })} />
          )}

          {resetPwRow && (
            <ResetPasswordDialog row={resetPwRow} onClose={() => setResetPwRow(null)} />
          )}

          {accessRow && (
            <WorkAccessDialog row={accessRow} onClose={() => setAccessRow(null)} />
          )}

        </TabsContent>

        <TabsContent value="performance" className="mt-4">
          <PerformanceTab rows={filtered} loading={isLoading} />
        </TabsContent>

        <TabsContent value="assignment" className="mt-4">
          <LeadAssignmentTab />
        </TabsContent>

        <TabsContent value="leaves" className="mt-4">
          <AssignmentManagementView />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PerformanceTab({ rows, loading }: { rows: Row[]; loading: boolean }) {
  // Staff only (must have at least one role), then sort by month completions desc.
  const staff = useMemo(
    () => rows.filter((r) => r.roles.length > 0).slice().sort((a, b) =>
      (b.perf?.completedThisMonth ?? 0) - (a.perf?.completedThisMonth ?? 0),
    ),
    [rows],
  );
  const totals = useMemo(() => {
    return staff.reduce(
      (acc, r) => {
        const p = r.perf;
        if (!p) return acc;
        acc.assignedLeads += p.assignedLeads;
        acc.openLeads += p.openLeads;
        acc.completedThisMonth += p.completedThisMonth;
        return acc;
      },
      { assignedLeads: 0, openLeads: 0, completedThisMonth: 0 },
    );
  }, [staff]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Active staff" value={staff.filter((s) => s.is_active).length} />
        <KpiCard label="Open leads (team)" value={totals.openLeads} />
        <KpiCard label="Assigned leads (team)" value={totals.assignedLeads} />
        <KpiCard label="Completed this month" value={totals.completedThisMonth} />
      </div>

      <SectionCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide" style={{ color: "var(--admin-fg-muted)" }}>
                <th className="px-4 py-2">Employee</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2 text-right">Open Leads</th>
                <th className="px-4 py-2 text-right">Open Apps</th>
                <th className="px-4 py-2 text-right">Assigned Leads</th>
                <th className="px-4 py-2 text-right">Completed (month)</th>
                <th className="px-4 py-2 text-right">Avg Turnaround</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && Array.from({ length: 5 }).map((_, i) => (
                <tr key={`pf-sk-${i}`} className="border-t" style={{ borderColor: "var(--admin-border)" }}>
                  {Array.from({ length: 8 }).map((__, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-3 rounded animate-pulse" style={{ background: "var(--admin-surface-2)" }} />
                    </td>
                  ))}
                </tr>
              ))}
              {!loading && staff.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-sm" style={{ color: "var(--admin-fg-muted)" }}>
                  No staff with roles yet.
                </td></tr>
              )}
              {!loading && staff.map((u, i) => {
                const p = u.perf ?? { assignedLeads: 0, openLeads: 0, assignedApps: 0, openApps: 0, completedThisMonth: 0, avgTurnaroundHours: null };
                return (
                  <tr key={u.id} className="border-t" style={{ borderColor: "var(--admin-border)", background: i % 2 ? "var(--admin-surface-2)" : "transparent" }}>
                    <td className="px-4 py-2.5">
                      <div className="font-medium">{u.full_name ?? u.email}</div>
                      <div className="text-xs" style={{ color: "var(--admin-fg-muted)" }}>{u.email}</div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {u.roles.map((r) => <RoleBadge key={r} role={r} />)}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono">{p.openLeads}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{p.openApps}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{p.assignedLeads}</td>
                    <td className="px-4 py-2.5 text-right font-mono font-semibold" style={{ color: p.completedThisMonth > 0 ? "#047857" : undefined }}>
                      {p.completedThisMonth}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono">
                      {p.avgTurnaroundHours == null ? "—" : `${p.avgTurnaroundHours}h`}
                    </td>
                    <td className="px-4 py-2.5"><StatusPill active={u.is_active} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <p className="text-xs" style={{ color: "var(--admin-fg-muted)" }}>
        Performance is computed live from assigned leads and applications. "Avg turnaround" is the mean time
        from application creation to completion across all completed work for each employee.
      </p>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border p-4" style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface)" }}>
      <div className="text-[11px] uppercase tracking-wider" style={{ color: "var(--admin-fg-muted)" }}>{label}</div>
      <div className="text-2xl font-semibold mt-1" style={{ color: "var(--admin-fg)" }}>
        {new Intl.NumberFormat("en-IN").format(value)}
      </div>
    </div>
  );
}

function AddEmployeeDialog({ open, onOpenChange, onCreated }:
  { open: boolean; onOpenChange: (v: boolean) => void; onCreated: () => void }) {
  const inviteFn = useServerFn(inviteEmployee);
  const [full_name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [role, setRoleVal] = useState<Role>("executive");
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [createdInfo, setCreatedInfo] = useState<{ email: string; temp_password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  function reset() {
    setName(""); setEmail(""); setMobile(""); setPassword(""); setShowPw(false);
    setRoleVal("executive"); setErrs({}); setCreatedInfo(null); setCopied(false);
  }

  async function submit() {
    const e: Record<string, string> = {};
    if (!full_name.trim()) e.full_name = "Full name is required.";
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Valid email is required.";
    if (password && password.length < 8) e.password = "Password must be at least 8 characters.";
    setErrs(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      const res = await inviteFn({ data: { full_name, email, mobile: mobile || null, role, password: password || undefined } });
      toast.success(`Employee account created for ${email}`);
      setCreatedInfo({ email, temp_password: res.temp_password });
      onCreated();
    } catch (err) {
      toast.error((err as Error).message);
    } finally { setBusy(false); }
  }

  const handleCopy = () => {
    if (!createdInfo) return;
    const text = `Udyam Ops Login Credentials:\nEmail: ${createdInfo.email}\nPassword: ${createdInfo.temp_password}\nLogin URL: ${window.location.origin}/login`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Login credentials copied to clipboard!");
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{createdInfo ? "Employee Account Created" : "Add Employee"}</DialogTitle>
        </DialogHeader>

        {createdInfo ? (
          <div className="space-y-4 py-2">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs space-y-1">
              <div className="font-semibold text-emerald-900">✔ Account Activated Instantly</div>
              <p>Email verification is bypassed. The employee can sign in right now with the credentials below:</p>
            </div>

            <div className="space-y-2 bg-slate-50 p-3 rounded-lg border text-sm font-mono">
              <div><span className="text-xs text-slate-500 font-sans uppercase">Email:</span> <span className="font-bold">{createdInfo.email}</span></div>
              <div><span className="text-xs text-slate-500 font-sans uppercase">Password:</span> <span className="font-bold text-indigo-600">{createdInfo.temp_password}</span></div>
            </div>

            <Button onClick={handleCopy} className="w-full gap-2">
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Copied to Clipboard!" : "Copy Login Credentials"}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Field label="Full Name" error={errs.full_name}>
              <Input value={full_name} onChange={(e) => setName(e.target.value)} placeholder="Asha Sharma" />
            </Field>
            <Field label="Email" error={errs.email}>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="asha@udyamadhar.in" type="email" />
            </Field>
            <Field label="Password (Manual)" error={errs.password}>
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Set custom password (or leave blank for auto)"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
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
            <p className="text-xs text-muted-foreground">
              Account will be created directly without email verification required.
            </p>
          </div>
        )}

        <DialogFooter>
          {createdInfo ? (
            <Button onClick={() => { reset(); onOpenChange(false); }}>Done</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={submit} disabled={busy}>{busy ? "Creating…" : "Create Employee Account"}</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditEmployeeDialog({ row, onClose, onSaved }:
  { row: Row; onClose: () => void; onSaved: () => void }) {
  const updateFn = useServerFn(updateEmployee);
  const [full_name, setName] = useState(row.full_name ?? "");
  const [mobile, setMobile] = useState(row.mobile ?? "");
  const [role, setRoleVal] = useState<Role>((row.roles[0] as Role) ?? "executive");
  const [department, setDepartment] = useState(row.department ?? "");
  const [joiningDate, setJoiningDate] = useState(row.joining_date ?? "");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!row) return;
    setBusy(true);
    try {
      await updateFn({ data: {
        user_id: row.id, full_name, mobile: mobile || null, role,
        department: department || null,
        joining_date: joiningDate || null,
      } });
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
          <div className="grid grid-cols-2 gap-3">
            <Field label="Employee ID">
              <Input value={row.employee_code ?? "—"} disabled />
            </Field>
            <Field label="Email"><Input value={row.email} disabled /></Field>
          </div>
          <Field label="Full Name">
            <Input value={full_name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Mobile">
              <Input value={mobile} onChange={(e) => setMobile(e.target.value)} />
            </Field>
            <Field label="Department">
              <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Operations, Sales…" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Joining Date">
              <Input type="date" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} />
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

function DeleteEmployeeDialog({ row, onClose, onDone }:
  { row: Row | null; onClose: () => void; onDone: () => void }) {
  const deleteFn = useServerFn(deleteEmployee);
  const [busy, setBusy] = useState(false);
  if (!row) return null;

  async function go() {
    if (!row) return;
    setBusy(true);
    try {
      await deleteFn({ data: { user_id: row.id } });
      toast.success(`Employee ${row.full_name ?? row.email} permanently deleted.`);
      onDone();
      onClose();
    } catch (e) { toast.error((e as Error).message); }
    finally { setBusy(false); }
  }

  return (
    <AlertDialog open onOpenChange={(v) => { if (!v) onClose(); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {row.full_name ?? row.email} permanently?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the user account for <b>{row.email}</b>, including their profile, assigned roles, and module permissions. <b>This action cannot be undone.</b>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={go} disabled={busy} className="bg-red-600 hover:bg-red-700">
            {busy ? "Deleting…" : "Delete Employee"}
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

function ResetPasswordDialog({ row, onClose }: { row: Row | null; onClose: () => void }) {
  const fn = useServerFn(resetEmployeePassword);
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!row) return null;

  function reset() { setPw(""); setConfirm(""); setShow(false); setErr(null); }

  async function submit() {
    if (!row) return;
    setErr(null);
    if (pw.length < 8) { setErr("Password must be at least 8 characters."); return; }
    if (pw !== confirm) { setErr("Passwords do not match."); return; }
    setBusy(true);
    try {
      await fn({ data: { user_id: row.id, new_password: pw } });
      toast.success(`Password reset for ${row.email}. Share it with the employee securely.`);
      reset();
      onClose();
    } catch (e) {
      toast.error((e as Error).message);
    } finally { setBusy(false); }
  }

  return (
    <Dialog open onOpenChange={(v) => { if (!v) { reset(); onClose(); } }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset password — {row.full_name ?? row.email}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Field label="Email"><Input value={row.email} disabled /></Field>
          <Field label="New password">
            <div className="relative">
              <Input
                type={show ? "text" : "password"}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="At least 8 characters"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </Field>
          <Field label="Confirm new password">
            <Input
              type={show ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter password"
              autoComplete="new-password"
            />
          </Field>
          {err && <div className="text-[12px]" style={{ color: "#b91c1c" }}>{err}</div>}
          <p className="text-xs" style={{ color: "var(--admin-fg-muted)" }}>
            The employee will be able to sign in immediately with the new password. No email is sent — share it through a secure channel.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { reset(); onClose(); }} disabled={busy}>Cancel</Button>
          <Button onClick={submit} disabled={busy}>{busy ? "Resetting…" : "Set Password"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const WORK_MODULES = [
  { key: "work.leads", label: "Leads" },
  { key: "work.orders", label: "Orders" },
  { key: "work.support", label: "Support" },
  { key: "work.finance", label: "Finance" },
] as const;

function WorkAccessDialog({ row, onClose }: { row: Row | null; onClose: () => void }) {
  const getFn = useServerFn(getEmployeeWorkAccess);
  const saveFn = useServerFn(setEmployeeWorkAccess);
  const qc = useQueryClient();
  const enabled = !!row;
  const { data, isLoading } = useQuery({
    queryKey: ["admin.employee.workAccess", row?.id],
    queryFn: () => getFn({ data: { user_id: row!.id } }),
    enabled,
  });

  const [work, setWork] = useState<Record<string, boolean>>({});
  const [websites, setWebsites] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!data) return;
    setWork({ ...(data.permissions as Record<string, boolean>) });
    // Union of website scopes across enabled modules → shown as one set (Phase 4 simple model)
    const w = new Set<string>();
    const s = new Set<string>();
    for (const m of WORK_MODULES) {
      for (const id of (data.websiteScopes as Record<string, string[]>)[m.key] ?? []) w.add(id);
      for (const id of (data.serviceScopes as Record<string, string[]>)[m.key] ?? []) s.add(id);
    }
    setWebsites(Array.from(w));
    setServices(Array.from(s));
  }, [data]);

  if (!row) return null;

  const websitesList: Array<{ id: string; name: string; domain: string; is_active: boolean }> =
    (data?.websites as never) ?? [];
  const servicesList: Array<{ id: string; service_code: string; service_name: string; website_id: string; is_active: boolean }> =
    (data?.services as never) ?? [];
  const filteredServices = websites.length
    ? servicesList.filter((s) => websites.includes(s.website_id))
    : servicesList;

  function toggle(list: string[], id: string): string[] {
    return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  }

  async function save() {
    setBusy(true);
    try {
      await saveFn({ data: {
        user_id: row!.id,
        work: {
          "work.leads":   !!work["work.leads"],
          "work.orders":  !!work["work.orders"],
          "work.support": !!work["work.support"],
          "work.finance": !!work["work.finance"],
        },
        websites, services,
      } });
      toast.success("Work access updated.");
      qc.invalidateQueries({ queryKey: ["admin.employee.workAccess", row!.id] });
      onClose();
    } catch (e) { toast.error((e as Error).message); }
    finally { setBusy(false); }
  }

  return (
    <Dialog open onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Work Access — {row.full_name ?? row.email}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="py-6 text-center text-sm" style={{ color: "var(--admin-fg-muted)" }}>Loading…</div>
        ) : (
          <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
            <section>
              <div className="text-xs uppercase tracking-wide mb-2" style={{ color: "var(--admin-fg-muted)" }}>Work types they can receive</div>
              <div className="grid grid-cols-2 gap-2">
                {WORK_MODULES.map((m) => (
                  <label key={m.key} className="flex items-center gap-2 rounded border px-3 py-2 text-sm cursor-pointer hover:bg-slate-50">
                    <input type="checkbox" checked={!!work[m.key]} onChange={() => setWork({ ...work, [m.key]: !work[m.key] })} />
                    {m.label}
                  </label>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs uppercase tracking-wide" style={{ color: "var(--admin-fg-muted)" }}>Websites</div>
                <div className="text-[11px]" style={{ color: "var(--admin-fg-subtle)" }}>Empty = all websites</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {websitesList.map((w) => (
                  <label key={w.id} className="flex items-center gap-2 rounded border px-3 py-2 text-sm cursor-pointer hover:bg-slate-50">
                    <input type="checkbox" checked={websites.includes(w.id)} onChange={() => setWebsites(toggle(websites, w.id))} />
                    <span className="truncate">{w.name} <span className="text-xs text-slate-400">{w.domain}</span></span>
                  </label>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs uppercase tracking-wide" style={{ color: "var(--admin-fg-muted)" }}>Services</div>
                <div className="text-[11px]" style={{ color: "var(--admin-fg-subtle)" }}>Empty = all services in selected websites</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {filteredServices.map((s) => (
                  <label key={s.id} className="flex items-center gap-2 rounded border px-3 py-2 text-sm cursor-pointer hover:bg-slate-50">
                    <input type="checkbox" checked={services.includes(s.id)} onChange={() => setServices(toggle(services, s.id))} />
                    <span className="truncate">{s.service_name} <span className="text-[11px] font-mono text-slate-400">{s.service_code}</span></span>
                  </label>
                ))}
                {filteredServices.length === 0 && (
                  <div className="col-span-full text-xs italic" style={{ color: "var(--admin-fg-subtle)" }}>No services in selected websites.</div>
                )}
              </div>
            </section>

            <p className="text-[11px]" style={{ color: "var(--admin-fg-muted)" }}>
              Auto-assignment will only route new items to this employee when the item's website and service match their scopes.
              Employees with no work types enabled will keep receiving assignments the same way they do today.
            </p>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={busy || isLoading}>{busy ? "Saving…" : "Save Access"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
