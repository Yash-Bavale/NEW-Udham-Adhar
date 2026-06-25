// SuperAdmin-only dashboard — premium dark theme.
// Access: super_admin only (defence-in-depth gate below).
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Users, Wallet, ShoppingBag, FileText, Award, Mail, Activity, AlertTriangle, Send, Database,
  ShieldCheck, TrendingUp, TrendingDown, Target, UserCheck, Briefcase, Globe,
} from "lucide-react";
import {
  getSuperAdminOverview, processEmailQueueNow, seedMissingEmailTemplates,
  type SuperAdminOverview,
} from "@/lib/crm/super-admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { formatIST } from "@/lib/datetime";

export const Route = createFileRoute("/admin/super")({
  head: () => ({ meta: [{ title: "Super Admin — Udyam Ops OS" }, { name: "robots", content: "noindex,nofollow" }] }),
  beforeLoad: async () => {
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
const fmtShortINR = (n: number) => {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}k`;
  return `₹${n.toFixed(0)}`;
};

function delta(today: number, yesterday: number): { pct: number; up: boolean } | null {
  if (yesterday === 0) return today > 0 ? { pct: 100, up: true } : null;
  const pct = ((today - yesterday) / yesterday) * 100;
  return { pct: Math.abs(Math.round(pct * 10) / 10), up: pct >= 0 };
}

function SuperAdminPage() {
  const fetchOverview = useServerFn(getSuperAdminOverview);
  const { data, isLoading, refetch } = useQuery<SuperAdminOverview>({
    queryKey: ["super-admin-overview"],
    queryFn: () => fetchOverview(),
    refetchInterval: 30_000,
  });

  return (
    <div className="min-h-screen -m-6 p-6 bg-[#0A0E1A] text-slate-100">
      <header className="flex items-end justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-emerald-400/80 font-semibold">
            <span className="inline-block size-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live · {formatIST(new Date(), { timeOnly: true })} IST
          </div>
          <h1 className="text-3xl font-bold tracking-tight mt-1">Super Admin Command Center</h1>
          <p className="text-sm text-slate-400 mt-0.5">Full system overview · auto-refresh every 30s</p>
        </div>
        <button
          onClick={() => refetch()}
          className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-300"
        >
          Refresh now
        </button>
      </header>

      <KpiGrid data={data} loading={isLoading} />

      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <TrendChart data={data} loading={isLoading} />
        <TopServices data={data} loading={isLoading} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <SystemHealth data={data} loading={isLoading} />
        <SecurityAlerts data={data} loading={isLoading} />
        <SuperActions onChanged={() => refetch()} />
      </div>

      <ActivityFeed data={data} loading={isLoading} />
    </div>
  );
}

/* ---------- KPI tiles ---------- */

function KpiTile({
  icon, label, value, sub, accent = "indigo",
}: {
  icon: React.ReactNode; label: string; value: string; sub?: React.ReactNode;
  accent?: "indigo" | "emerald" | "amber" | "rose" | "sky" | "violet";
}) {
  const tones: Record<string, { ring: string; iconBg: string; iconFg: string }> = {
    indigo: { ring: "from-indigo-500/20 to-indigo-500/0", iconBg: "bg-indigo-500/15", iconFg: "text-indigo-300" },
    emerald: { ring: "from-emerald-500/20 to-emerald-500/0", iconBg: "bg-emerald-500/15", iconFg: "text-emerald-300" },
    amber: { ring: "from-amber-500/20 to-amber-500/0", iconBg: "bg-amber-500/15", iconFg: "text-amber-300" },
    rose: { ring: "from-rose-500/20 to-rose-500/0", iconBg: "bg-rose-500/15", iconFg: "text-rose-300" },
    sky: { ring: "from-sky-500/20 to-sky-500/0", iconBg: "bg-sky-500/15", iconFg: "text-sky-300" },
    violet: { ring: "from-violet-500/20 to-violet-500/0", iconBg: "bg-violet-500/15", iconFg: "text-violet-300" },
  };
  const t = tones[accent]!;
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${t.ring} bg-[#0F1424] p-4`}>
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-400">{label}</div>
          <div className="mt-1.5 text-2xl font-bold tabular-nums text-white truncate">{value}</div>
          {sub && <div className="mt-1 text-[11px] text-slate-400">{sub}</div>}
        </div>
        <div className={`rounded-lg p-2 ${t.iconBg} ${t.iconFg}`}>{icon}</div>
      </div>
    </div>
  );
}

function DeltaPill({ d }: { d: { pct: number; up: boolean } | null }) {
  if (!d) return <span className="text-slate-500">—</span>;
  const Icon = d.up ? TrendingUp : TrendingDown;
  return (
    <span className={`inline-flex items-center gap-0.5 font-semibold ${d.up ? "text-emerald-400" : "text-rose-400"}`}>
      <Icon className="size-3" /> {d.pct}%
    </span>
  );
}

function KpiGrid({ data, loading }: { data?: SuperAdminOverview; loading: boolean }) {
  const k = data?.kpis;
  const leadsDelta = k ? delta(k.leadsToday, k.leadsYesterday) : null;
  const revDelta = k ? delta(k.paymentsTodayInr, k.paymentsYesterdayInr) : null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <KpiTile
        icon={<Users className="size-4" />}
        label="Leads Today"
        value={loading ? "—" : fmtN(k?.leadsToday ?? 0)}
        sub={<>vs yesterday <DeltaPill d={leadsDelta} /></>}
        accent="indigo"
      />
      <KpiTile
        icon={<Wallet className="size-4" />}
        label="Revenue Today"
        value={loading ? "—" : fmtShortINR(k?.paymentsTodayInr ?? 0)}
        sub={<>vs yesterday <DeltaPill d={revDelta} /></>}
        accent="emerald"
      />
      <KpiTile
        icon={<TrendingUp className="size-4" />}
        label="Revenue (30d)"
        value={loading ? "—" : fmtShortINR(k?.revenue30dInr ?? 0)}
        sub="paid transactions"
        accent="emerald"
      />
      <KpiTile
        icon={<Target className="size-4" />}
        label="Conversion (30d)"
        value={loading ? "—" : `${(k?.conversionRate30d ?? 0).toFixed(1)}%`}
        sub="paid leads / total"
        accent="violet"
      />
      <KpiTile
        icon={<ShoppingBag className="size-4" />}
        label="Open Orders"
        value={loading ? "—" : fmtN(k?.openApplications ?? 0)}
        sub="in fulfillment"
        accent="sky"
      />
      <KpiTile
        icon={<FileText className="size-4" />}
        label="Docs Pending"
        value={loading ? "—" : fmtN(k?.documentsPending ?? 0)}
        sub="awaiting upload"
        accent="amber"
      />
      <KpiTile
        icon={<Award className="size-4" />}
        label="Certs Today"
        value={loading ? "—" : fmtN(k?.certificatesToday ?? 0)}
        accent="emerald"
      />
      <KpiTile
        icon={<Mail className="size-4" />}
        label="Email Queue"
        value={loading ? "—" : fmtN(k?.emailQueueDepth ?? 0)}
        sub="queued + failed"
        accent="sky"
      />
      <KpiTile
        icon={<UserCheck className="size-4" />}
        label="Customers"
        value={loading ? "—" : fmtN(k?.totalCustomers ?? 0)}
        sub="lifetime"
        accent="indigo"
      />
      <KpiTile
        icon={<Briefcase className="size-4" />}
        label="Active Staff"
        value={loading ? "—" : fmtN(k?.activeStaff ?? 0)}
        sub="with role"
        accent="violet"
      />
      <KpiTile
        icon={<AlertTriangle className="size-4" />}
        label="Webhook Errors (24h)"
        value={loading ? "—" : fmtN(data?.webhookFailures24h ?? 0)}
        accent={data && data.webhookFailures24h > 0 ? "rose" : "emerald"}
      />
      <KpiTile
        icon={<Globe className="size-4" />}
        label="PayU Mode"
        value={loading ? "—" : (data?.payu.mode.toUpperCase() ?? "—")}
        sub={data?.payu.isProduction ? "live payments" : "test mode"}
        accent={data?.payu.isProduction ? "emerald" : "rose"}
      />
    </div>
  );
}

/* ---------- Trend chart (inline SVG sparkline + bars) ---------- */

function TrendChart({ data, loading }: { data?: SuperAdminOverview; loading: boolean }) {
  const t = data?.trend;
  const { revPath, revMax, leadBars, leadsMax } = useMemo(() => {
    if (!t) return { revPath: "", revMax: 0, leadBars: [] as { x: number; h: number; v: number }[], leadsMax: 0 };
    const W = 100, H = 36;
    const revMax = Math.max(1, ...t.revenueInr);
    const stepX = W / Math.max(1, t.revenueInr.length - 1);
    const pts = t.revenueInr.map((v, i) => `${(i * stepX).toFixed(2)},${(H - (v / revMax) * H).toFixed(2)}`);
    const revPath = `M ${pts.join(" L ")}`;
    const leadsMax = Math.max(1, ...t.leads);
    const barW = 100 / t.leads.length;
    const leadBars = t.leads.map((v, i) => ({
      x: i * barW + barW * 0.15,
      h: (v / leadsMax) * 30,
      v,
    }));
    return { revPath, revMax, leadBars, leadsMax };
  }, [t]);

  return (
    <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#0F1424] p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">7-day Revenue & Lead Trend</h2>
          <p className="text-[11px] text-slate-500">All times in IST · paid payments only</p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-slate-400"><span className="size-2 rounded-full bg-emerald-400" /> Revenue</span>
          <span className="flex items-center gap-1 text-slate-400"><span className="size-2 rounded-sm bg-indigo-400" /> Leads</span>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 h-32 animate-pulse bg-white/5 rounded-md" />
      ) : (
        <div className="mt-4">
          <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-32">
            <defs>
              <linearGradient id="revFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* lead bars */}
            {leadBars.map((b, i) => (
              <rect key={i} x={b.x} y={36 - b.h} width={100 / leadBars.length * 0.7} height={b.h} fill="#6366F1" opacity="0.55" rx="0.6" />
            ))}
            {/* revenue area */}
            {revPath && (
              <>
                <path d={`${revPath} L 100,36 L 0,36 Z`} fill="url(#revFill)" />
                <path d={revPath} fill="none" stroke="#10B981" strokeWidth="0.6" />
              </>
            )}
          </svg>
          <div className="mt-2 grid grid-cols-7 text-[10px] text-slate-500">
            {(t?.days ?? []).map((d) => (
              <div key={d} className="text-center tabular-nums">
                {new Date(d).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short" })}
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[11px] text-slate-500">
            <span>Peak revenue: <span className="text-emerald-400 font-semibold">{fmtShortINR(revMax)}</span></span>
            <span>Peak leads: <span className="text-indigo-400 font-semibold">{leadsMax}</span></span>
          </div>
        </div>
      )}
    </div>
  );
}

function TopServices({ data, loading }: { data?: SuperAdminOverview; loading: boolean }) {
  const rows = data?.topServices ?? [];
  const max = Math.max(1, ...rows.map((r) => r.revenueInr));
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0F1424] p-5">
      <h2 className="text-sm font-semibold text-white">Top Services (30d)</h2>
      <p className="text-[11px] text-slate-500">By revenue</p>
      <div className="mt-4 space-y-3">
        {loading && <div className="text-xs text-slate-500">Loading…</div>}
        {!loading && rows.length === 0 && <div className="text-xs text-slate-500">No orders in last 30 days.</div>}
        {rows.map((r) => (
          <div key={r.name}>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-300 truncate pr-2">{r.name}</span>
              <span className="tabular-nums text-emerald-400 font-semibold">{fmtShortINR(r.revenueInr)}</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: `${(r.revenueInr / max) * 100}%` }} />
            </div>
            <div className="mt-0.5 text-[10px] text-slate-500">{r.orders} orders</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Lower row cards ---------- */

function SystemHealth({ data, loading }: { data?: SuperAdminOverview; loading: boolean }) {
  const q = data?.emailQueue;
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0F1424] p-5">
      <h2 className="text-sm font-semibold text-white flex items-center gap-1.5">
        <Activity className="size-4 text-slate-400" /> System Health
      </h2>
      <div className="mt-3 space-y-2 text-sm">
        <Row label="Email queue · queued" value={loading ? "—" : fmtN(q?.queued ?? 0)} />
        <Row label="Email queue · processing" value={loading ? "—" : fmtN(q?.processing ?? 0)} />
        <Row label="Email queue · failed" value={loading ? "—" : fmtN(q?.failed ?? 0)} tone={(q?.failed ?? 0) > 0 ? "warn" : undefined} />
        <Row label="Email queue · sent" value={loading ? "—" : fmtN(q?.sent ?? 0)} />
        <Row label="PayU mode" value={data?.payu.mode ?? "—"} tone={data?.payu.isProduction ? "ok" : "warn"} />
        <Row label="Webhook errors (24h)" value={loading ? "—" : fmtN(data?.webhookFailures24h ?? 0)} tone={(data?.webhookFailures24h ?? 0) > 0 ? "warn" : "ok"} />
      </div>
    </div>
  );
}

function SecurityAlerts({ data, loading }: { data?: SuperAdminOverview; loading: boolean }) {
  const alerts = data?.alerts ?? [];
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0F1424] p-5">
      <h2 className="text-sm font-semibold text-white flex items-center gap-1.5">
        <ShieldCheck className="size-4 text-slate-400" /> Security Alerts
      </h2>
      <div className="mt-3 space-y-2">
        {loading && <div className="text-xs text-slate-500">Loading…</div>}
        {!loading && alerts.length === 0 && (
          <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
            ✓ All systems healthy. No active alerts.
          </div>
        )}
        {alerts.map((a) => {
          const isHigh = a.severity === "high";
          return (
            <div
              key={a.id}
              className={`rounded-md border px-3 py-2 text-xs flex items-start gap-2 ${
                isHigh ? "border-rose-500/40 bg-rose-500/10 text-rose-200" : "border-amber-500/40 bg-amber-500/10 text-amber-200"
              }`}
            >
              <AlertTriangle className="size-3.5 mt-0.5 shrink-0" />
              <span>{a.message}</span>
            </div>
          );
        })}
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
    onSuccess: (r) => { setToast(`Seed complete · inserted ${r.inserted}/${r.total}`); onChanged(); },
    onError: (e: Error) => setToast(`Error: ${e.message}`),
  });

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0F1424] p-5">
      <h2 className="text-sm font-semibold text-white flex items-center gap-1.5">
        <Database className="size-4 text-slate-400" /> Quick Actions
      </h2>
      {toast && <div className="mt-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-slate-300">{toast}</div>}
      <div className="mt-3 grid gap-2">
        <button
          onClick={() => processMut.mutate()}
          disabled={processMut.isPending}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-medium text-white hover:opacity-95 disabled:opacity-50"
        >
          <Send className="size-3.5" /> {processMut.isPending ? "Processing…" : "Process Email Queue"}
        </button>
        <button
          onClick={() => seedMut.mutate()}
          disabled={seedMut.isPending}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10 disabled:opacity-50"
        >
          <Mail className="size-3.5" /> {seedMut.isPending ? "Seeding…" : "Seed Email Templates"}
        </button>
        <Link
          to="/admin/employees"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
        >
          Manage Employees
        </Link>
        <Link
          to="/admin/audit"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
        >
          View Audit Log
        </Link>
      </div>
    </div>
  );
}

function ActivityFeed({ data, loading }: { data?: SuperAdminOverview; loading: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0F1424] p-5 mt-4">
      <h2 className="text-sm font-semibold text-white">Employee Activity Feed</h2>
      <div className="mt-3 divide-y divide-white/5 max-h-96 overflow-y-auto">
        {loading && <div className="py-2 text-xs text-slate-500">Loading…</div>}
        {!loading && (data?.activity.length ?? 0) === 0 && (
          <div className="py-2 text-xs text-slate-500">No recent activity.</div>
        )}
        {data?.activity.map((a) => (
          <div key={a.id} className="py-2 flex items-start justify-between gap-3">
            <span className="text-sm text-slate-300">{a.description}</span>
            <span className="text-[11px] tabular-nums text-slate-500 shrink-0">
              {formatIST(a.created_at)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: string | number; tone?: "ok" | "warn" }) {
  const color = tone === "warn" ? "text-amber-400" : tone === "ok" ? "text-emerald-400" : "text-slate-200";
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400">{label}</span>
      <span className={`font-semibold tabular-nums ${color}`}>{value}</span>
    </div>
  );
}
