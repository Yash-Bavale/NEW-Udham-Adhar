import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  listEmployeeSessionsAdmin,
  forceLogoutSessionAdmin,
  forceLogoutAllSessionsAdmin,
  getEmployeeSecurityDetailAdmin,
  type ListEmployeeSessionsAdminResult,
  type OperatorSessionRow,
  type EmployeeSecurityDetailResult,
} from "@/lib/crm/employee-sessions.functions";
import {
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Search,
  Power,
  Monitor,
  Laptop,
  Smartphone,
  Eye,
  History,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/sessions")({
  head: () => ({
    meta: [
      { title: "Employee Sessions & Security Center — Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminSessionsPage,
});

type PresenceFilter = "all" | "active" | "idle" | "away" | "offline";

function AdminSessionsPage() {
  const [statusFilter, setStatusFilter] = useState<PresenceFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(false);

  const qc = useQueryClient();
  const listFn = useServerFn(listEmployeeSessionsAdmin);
  const forceLogoutFn = useServerFn(forceLogoutSessionAdmin);
  const forceLogoutAllFn = useServerFn(forceLogoutAllSessionsAdmin);

  const { data, isLoading, refetch, isFetching } = useQuery<ListEmployeeSessionsAdminResult>({
    queryKey: ["admin.sessions", statusFilter, searchQuery],
    queryFn: () => listFn({ data: { statusFilter, searchQuery, limit: 100 } }),
    refetchInterval: 15_000,
  });

  const handleSync = () => {
    setIsRotating(true);
    refetch();
    setTimeout(() => setIsRotating(false), 700);
  };

  const handleForceLogout = async (sessionId: string, name: string) => {
    if (!confirm(`Are you sure you want to force logout ${name}'s session?`)) return;
    try {
      await forceLogoutFn({ data: { sessionId, reason: "Terminated by administrator from Security Center" } });
      toast.success(`Session for ${name} has been terminated.`);
      qc.invalidateQueries({ queryKey: ["admin.sessions"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to terminate session");
    }
  };

  const handleForceLogoutAll = async (employeeId: string, name: string) => {
    if (!confirm(`Force logout ALL active sessions for ${name}?`)) return;
    try {
      const res: any = await forceLogoutAllFn({
        data: { employeeId, reason: "Admin terminated all active sessions" },
      });
      toast.success(`Terminated ${res?.terminated_count || 0} active sessions for ${name}.`);
      qc.invalidateQueries({ queryKey: ["admin.sessions"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to terminate all sessions");
    }
  };

  const rows: OperatorSessionRow[] = data?.rows ?? [];

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Header */}
      <section className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Employee Sessions &amp; Security Fleet
              </h1>
              <p className="text-xs text-slate-500">
                Live presence telemetry, device tracking, active vs idle working time, and administrative session termination.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSync}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs transition"
          >
            <RefreshCw
              className={cn(
                "h-3.5 w-3.5 text-indigo-600 transition-transform duration-500",
                (isRotating || isFetching) && "rotate-180 animate-spin",
              )}
            />
            <span>Sync Fleet</span>
          </button>
        </div>
      </section>

      {/* KPI Overview Cards */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Total Monitored
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {isLoading ? "--" : (data?.totalStaffCount ?? 0)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Registered operators</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
            <span>Active</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {isLoading ? "--" : (data?.activeCount ?? 0)}
          </div>
          <div className="text-[11px] text-emerald-600 mt-0.5">Interacting in CRM</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
            Idle
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-1">
            {isLoading ? "--" : (data?.idleCount ?? 0)}
          </div>
          <div className="text-[11px] text-amber-600 mt-0.5">&gt;10m paused</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-orange-700 uppercase tracking-wider">
            Away
          </div>
          <div className="text-2xl font-bold text-orange-700 mt-1">
            {isLoading ? "--" : (data?.awayCount ?? 0)}
          </div>
          <div className="text-[11px] text-orange-600 mt-0.5">Tab unfocused / meal</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Offline
          </div>
          <div className="text-2xl font-bold text-slate-700 mt-1">
            {isLoading ? "--" : (data?.offlineCount ?? 0)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">No active session</div>
        </div>
      </section>

      {/* Main Sessions Table */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: "all", label: "All Operators" },
                { id: "active", label: "Active Only" },
                { id: "idle", label: "Idle" },
                { id: "away", label: "Away" },
                { id: "offline", label: "Offline" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-semibold transition",
                  statusFilter === tab.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search operator, email, role…"
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-60"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-100">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-2.5 px-3">Operator</th>
                <th className="py-2.5 px-3">Presence</th>
                <th className="py-2.5 px-3">Login Method</th>
                <th className="py-2.5 px-3">Session Time</th>
                <th className="py-2.5 px-3">Active / Idle</th>
                <th className="py-2.5 px-3">Device / Browser</th>
                <th className="py-2.5 px-3">IP Address</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No operators found matching the filter.
                  </td>
                </tr>
              ) : (
                rows.map((r: OperatorSessionRow) => (
                  <tr key={r.employeeId} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{r.name}</div>
                      <div className="text-[11px] text-slate-400">{r.email}</div>
                      <div className="text-[10px] text-indigo-600 font-medium capitalize mt-0.5">
                        {r.primaryRole}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase",
                          r.presenceStatus === "active" && "bg-emerald-100 text-emerald-800",
                          r.presenceStatus === "idle" && "bg-amber-100 text-amber-800",
                          r.presenceStatus === "away" && "bg-orange-100 text-orange-800",
                          r.presenceStatus === "offline" && "bg-slate-100 text-slate-600",
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            r.presenceStatus === "active" && "bg-emerald-500 animate-pulse",
                            r.presenceStatus === "idle" && "bg-amber-500",
                            r.presenceStatus === "away" && "bg-orange-500",
                            r.presenceStatus === "offline" && "bg-slate-400",
                          )}
                        />
                        {r.presenceStatus}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      {r.loginMethod ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium capitalize">
                          {r.loginMethod}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      {r.presenceStatus !== "offline" ? (
                        <div className="font-medium text-slate-800">
                          {Math.floor(r.totalSessionMinutes / 60)}h {r.totalSessionMinutes % 60}m
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      {r.presenceStatus !== "offline" ? (
                        <div className="space-y-0.5">
                          <span className="text-emerald-700 font-semibold">{r.activeMinutes}m active</span>
                          <span className="text-slate-300"> / </span>
                          <span className="text-amber-700 font-medium">{r.idleMinutes}m idle</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        {r.deviceType === "Mobile" ? (
                          <Smartphone className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                        ) : (
                          <Laptop className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                        )}
                        <span>{r.os || "—"}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">{r.browser || "—"}</div>
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                      {r.ipAddress || "—"}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs gap-1"
                          onClick={() => setSelectedEmpId(r.employeeId)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Audit</span>
                        </Button>

                        {r.presenceStatus !== "offline" && r.sessionId && (
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-7 text-xs gap-1"
                            onClick={() => handleForceLogout(r.sessionId!, r.name)}
                          >
                            <Power className="h-3.5 w-3.5" />
                            <span>Force Out</span>
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          onClick={() => handleForceLogoutAll(r.employeeId, r.name)}
                          title="Terminate all active devices"
                        >
                          <span>Kick All</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Security & Audit Detail Dialog */}
      {selectedEmpId && (
        <SecurityAuditDialog
          employeeId={selectedEmpId}
          onClose={() => setSelectedEmpId(null)}
        />
      )}
    </div>
  );
}

function SecurityAuditDialog({
  employeeId,
  onClose,
}: {
  employeeId: string;
  onClose: () => void;
}) {
  const getDetailFn = useServerFn(getEmployeeSecurityDetailAdmin);
  const { data, isLoading } = useQuery<EmployeeSecurityDetailResult>({
    queryKey: ["admin.employee.security-detail", employeeId],
    queryFn: () => getDetailFn({ data: { employeeId } }),
  });

  const p = data?.profile;
  const sessions = data?.activeSessions ?? [];
  const loginHist = data?.loginHistory ?? [];
  const secEvents = data?.securityEvents ?? [];

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-indigo-600" />
            <span>Security &amp; Audit Profile — {p?.full_name || p?.display_name || p?.email}</span>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-12 text-center text-slate-400 text-sm">Loading security events…</div>
        ) : (
          <div className="space-y-6 text-xs text-slate-700">
            {/* Operator Quick Stats */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Email</span>
                <div className="font-semibold text-slate-900">{p?.email}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Employee Code</span>
                <div className="font-semibold text-slate-900">{p?.employee_code || "—"}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Account Status</span>
                <div className="font-semibold text-emerald-700">
                  {p?.is_active !== false ? "Active Staff" : "Suspended"}
                </div>
              </div>
            </div>

            {/* Active Sessions */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Monitor className="h-4 w-4 text-slate-500" />
                <span>Recent Sessions ({sessions.length})</span>
              </h4>
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Session</th>
                      <th className="py-2 px-3">Device / OS</th>
                      <th className="py-2 px-3">Active / Idle</th>
                      <th className="py-2 px-3">Login Time</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sessions.map((s: any) => (
                      <tr key={s.id}>
                        <td className="py-2 px-3 font-mono text-[11px]">{s.session_id.slice(0, 14)}…</td>
                        <td className="py-2 px-3">{s.operating_system} &bull; {s.browser}</td>
                        <td className="py-2 px-3 font-semibold text-emerald-700">
                          {Math.round(s.active_seconds / 60)}m / {Math.round((s.idle_seconds + s.away_seconds) / 60)}m
                        </td>
                        <td className="py-2 px-3">{new Date(s.login_at).toLocaleString("en-IN")}</td>
                        <td className="py-2 px-3 capitalize font-medium">{s.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Login History */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <History className="h-4 w-4 text-slate-500" />
                <span>Login History ({loginHist.length})</span>
              </h4>
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Time</th>
                      <th className="py-2 px-3">Method</th>
                      <th className="py-2 px-3">IP Address</th>
                      <th className="py-2 px-3">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loginHist.map((h: any) => (
                      <tr key={h.id}>
                        <td className="py-2 px-3">{new Date(h.login_at).toLocaleString("en-IN")}</td>
                        <td className="py-2 px-3 capitalize">{h.login_method}</td>
                        <td className="py-2 px-3 font-mono">{h.ip_address || "—"}</td>
                        <td className="py-2 px-3">
                          {h.success ? (
                            <span className="text-emerald-700 font-bold">Success</span>
                          ) : (
                            <span className="text-rose-600 font-bold">Failed ({h.failure_reason})</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Security Events */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-slate-500" />
                <span>Security Events Audit Trail</span>
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {secEvents.map((e: any) => (
                  <div key={e.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{e.event_type}</span>
                      <span className="text-slate-400 ml-2">{new Date(e.created_at).toLocaleString("en-IN")}</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500">
                      {JSON.stringify(e.metadata || {})}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
