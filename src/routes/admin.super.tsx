// SuperAdmin-only dashboard (Final_CRM Part C).
// Access: super_admin. Other roles bounced by admin.tsx role gate first,
// and again here for defence in depth.
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  Users, Wallet, ShoppingBag, FileText, Award, Mail, Activity, AlertTriangle, Send, Database, ShieldCheck,
} from "lucide-react";
import {
  getSuperAdminOverview,
  processEmailQueueNow,
  seedMissingEmailTemplates,
  type SuperAdminOverview,
} from "@/lib/crm/super-admin.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/super")({
  head: () => ({ meta: [{ title: "Super Admin — Udyam Ops OS" }, { name: "robots", content: "noindex,nofollow" }] }),
  beforeLoad: async () => {
    // Defence-in-depth: the /admin gate already filtered staff; here we require super_admin.
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/admin-login" });
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
    if (!data?.some((r) => r.role === "super_admin")) {
      throw redirect({ to: "/admin/dashboard" });
    }
  },
  component: SuperAdminPage,
});

const fmtN = (n: number) => new Intl.NumberFormat("en-IN").format(n || 0);
const fmtINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

function SuperAdminPage() {
  const fetchOverview = useServerFn(getSuperAdminOverview);
  const { data, isLoading, refetch } = useQuery<SuperAdminOverview>({
    queryKey: ["super-admin-overview"],
    queryFn: () => fetchOverview(),
    refetchInterval: 30_000,
  });

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Super Admin</h1>
          <p className="text-sm text-slate-500">Full system overview · auto-refreshes every 30s.</p>
        </div>
      </header>

      <KpiStrip data={data} loading={isLoading} />

      <div className="grid lg:grid-cols-3 gap-4">
        <SystemHealth data={data} loading={isLoading} onRefresh={() => refetch()} />
        <SecurityAlerts data={data} loading={isLoading} />
        <SuperActions onChanged={() => refetch()} />
      </div>

      <ActivityFeed data={data} loading={isLoading} />
    </div>
  );
}

function KpiCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wide font-semibold text-slate-500">{label}</div>
          <div className="mt-1.5 text-2xl font-semibold tabular-nums text-slate-900">{value}</div>
        </div>
        <div className="rounded-md p-2" style={{ background: accent ?? "#F1F5F9", color: "#0F1F3D" }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function KpiStrip({ data, loading }: { data?: SuperAdminOverview; loading: boolean }) {
  const k = data?.kpis;
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <KpiCard icon={<Users className="size-4" />} label="Leads Today" value={loading ? "—" : fmtN(k?.leadsToday ?? 0)} />
      <KpiCard icon={<Wallet className="size-4" />} label="Payments Today" value={loading ? "—" : fmtINR(k?.paymentsTodayInr ?? 0)} accent="#ECFDF5" />
      <KpiCard icon={<ShoppingBag className="size-4" />} label="Open Applications" value={loading ? "—" : fmtN(k?.openApplications ?? 0)} />
      <KpiCard icon={<FileText className="size-4" />} label="Docs Pending" value={loading ? "—" : fmtN(k?.documentsPending ?? 0)} accent="#FAF5FF" />
      <KpiCard icon={<Award className="size-4" />} label="Certs Issued Today" value={loading ? "—" : fmtN(k?.certificatesToday ?? 0)} accent="#FFFBEB" />
      <KpiCard icon={<Mail className="size-4" />} label="Email Queue" value={loading ? "—" : fmtN(k?.emailQueueDepth ?? 0)} accent="#EFF6FF" />
    </div>
  );
}

function SystemHealth({ data, loading, onRefresh }: { data?: SuperAdminOverview; loading: boolean; onRefresh: () => void }) {
  const q = data?.emailQueue;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
          <Activity className="size-4 text-slate-500" /> System Health
        </h2>
        <button onClick={onRefresh} className="text-[11px] text-slate-500 hover:text-slate-800">Refresh</button>
      </div>
      <div className="mt-3 space-y-2 text-sm">
        <Row label="Email queue · queued" value={loading ? "—" : fmtN(q?.queued ?? 0)} />
        <Row label="Email queue · processing" value={loading ? "—" : fmtN(q?.processing ?? 0)} />
        <Row label="Email queue · failed" value={loading ? "—" : fmtN(q?.failed ?? 0)} tone={(q?.failed ?? 0) > 0 ? "warn" : undefined} />
        <Row label="Email queue · sent (lifetime)" value={loading ? "—" : fmtN(q?.sent ?? 0)} />
        <Row label="PayU mode" value={data?.payu.mode ?? "—"} tone={data?.payu.isProduction ? "ok" : "warn"} />
        <Row label="Webhook failures (24h)" value={loading ? "—" : fmtN(data?.webhookFailures24h ?? 0)} tone={(data?.webhookFailures24h ?? 0) > 0 ? "warn" : undefined} />
      </div>
    </div>
  );
}

function SecurityAlerts({ data, loading }: { data?: SuperAdminOverview; loading: boolean }) {
  const alerts = data?.alerts ?? [];
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
        <ShieldCheck className="size-4 text-slate-500" /> Security Alerts
      </h2>
      <div className="mt-3 space-y-2">
        {loading && <div className="text-xs text-slate-400">Loading…</div>}
        {!loading && alerts.length === 0 && (
          <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-800">
            No alerts. System healthy.
          </div>
        )}
        {alerts.map((a) => (
          <div
            key={a.id}
            className="rounded-md border px-3 py-2 text-xs flex items-start gap-2"
            style={{
              borderColor: a.severity === "high" ? "#FECACA" : "#FED7AA",
              background: a.severity === "high" ? "#FEF2F2" : "#FFFBEB",
              color: a.severity === "high" ? "#991B1B" : "#9A3412",
            }}
          >
            <AlertTriangle className="size-3.5 mt-0.5 shrink-0" />
            <span>{a.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SuperActions({ onChanged }: { onChanged: () => void }) {
  const processQueue = useServerFn(processEmailQueueNow);
  const seed = useServerFn(seedMissingEmailTemplates);
  const [toast, setToast] = useState<string | null>(null);

  const processMut = useMutation({
    mutationFn: () => processQueue(),
    onSuccess: (r) => { setToast(`Queue processed · ${JSON.stringify(r)}`); onChanged(); },
    onError: (e: Error) => setToast(`Error: ${e.message}`),
  });
  const seedMut = useMutation({
    mutationFn: () => seed(),
    onSuccess: (r) => { setToast(`Seed complete · inserted ${r.inserted}/${r.total} missing templates`); onChanged(); },
    onError: (e: Error) => setToast(`Error: ${e.message}`),
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
        <Database className="size-4 text-slate-500" /> Super Admin Actions
      </h2>
      {toast && <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">{toast}</div>}
      <div className="mt-3 grid gap-2">
        <button
          onClick={() => processMut.mutate()}
          disabled={processMut.isPending}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0F1F3D] px-4 py-2 text-sm font-medium text-white hover:opacity-95 disabled:opacity-50"
        >
          <Send className="size-3.5" /> {processMut.isPending ? "Processing…" : "Process Email Queue Now"}
        </button>
        <button
          onClick={() => seedMut.mutate()}
          disabled={seedMut.isPending}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <Mail className="size-3.5" /> {seedMut.isPending ? "Seeding…" : "Seed Missing Email Templates"}
        </button>
        <Link
          to="/admin/users"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Manage Roles
        </Link>
        <Link
          to="/admin/audit"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          View Audit Log
        </Link>
      </div>
    </div>
  );
}

function ActivityFeed({ data, loading }: { data?: SuperAdminOverview; loading: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-slate-900">Employee Activity Feed</h2>
      <div className="mt-3 divide-y divide-slate-100">
        {loading && <div className="py-2 text-xs text-slate-400">Loading…</div>}
        {!loading && (data?.activity.length ?? 0) === 0 && (
          <div className="py-2 text-xs text-slate-400">No recent activity.</div>
        )}
        {data?.activity.map((a) => (
          <div key={a.id} className="py-2 flex items-start justify-between gap-3">
            <span className="text-sm text-slate-700">{a.description}</span>
            <span className="text-[11px] tabular-nums text-slate-400 shrink-0">
              {new Date(a.created_at).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: string | number; tone?: "ok" | "warn" }) {
  const color = tone === "warn" ? "#B45309" : tone === "ok" ? "#15803D" : "#0F172A";
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold tabular-nums" style={{ color }}>{value}</span>
    </div>
  );
}
