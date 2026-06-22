import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
} from "recharts";
import {
  Users, UserX, ShoppingBag, Clock, MessageSquareWarning, CheckCircle2,
  PackageCheck, Wallet, AlertTriangle, ChevronDown, ChevronRight, FileText,
  Send, Calendar, LifeBuoy, Activity as ActivityIcon, Bell,
} from "lucide-react";
import { getOpsDashboard, markFollowUpComplete, type OpsDashboardData } from "@/lib/crm/ops-dashboard.functions";
import { SectionCard, TableSkeleton } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Udyam Ops OS" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: DashboardPage,
});

type TimeWindow = "today" | "week" | "month";
const W_LABEL: Record<TimeWindow, string> = { today: "Today", week: "Weekly", month: "Monthly" };

function fmtINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);
}
function fmtN(n: number) {
  return new Intl.NumberFormat("en-IN").format(n || 0);
}

function DashboardPage() {
  const fn = useServerFn(getOpsDashboard);
  const { data, isLoading, error } = useQuery<OpsDashboardData>({
    queryKey: ["ops-dashboard"],
    queryFn: () => fn(),
    refetchInterval: 60_000,
  });

  if (error) return <div className="text-sm" style={{ color: "var(--admin-danger)" }}>{(error as Error).message}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight" style={{ color: "var(--admin-fg)" }}>Dashboard</h1>
        <p className="text-sm" style={{ color: "var(--admin-fg-muted)" }}>
          Live operations overview. Auto-refreshes every minute.
        </p>
      </div>

      {/* 1. KPI cards */}
      <KpiGrid data={data} loading={isLoading} />

      {/* 2. Action Required + 6. Payment Summary side-by-side on wide screens */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ActionRequired data={data} loading={isLoading} />
        </div>
        <PaymentSummary data={data} loading={isLoading} />
      </div>

      {/* 3. Service Pipeline */}
      <ServicePipeline data={data} loading={isLoading} />

      {/* 7. Revenue chart + 8. Top services */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><RevenueChart data={data} loading={isLoading} /></div>
        <TopServices data={data} loading={isLoading} />
      </div>

      {/* 4. Document pending + 5. Complaint tracker + Refund Tracker */}
      <div className="grid lg:grid-cols-3 gap-4">
        <DocumentsPending data={data} loading={isLoading} />
        <ComplaintTracker data={data} loading={isLoading} />
        <RefundTracker data={data} loading={isLoading} />
      </div>

      {/* 9 Staff + 10 Follow-ups + 11 Tickets */}
      <div className="grid lg:grid-cols-3 gap-4">
        <StaffPerformance data={data} loading={isLoading} />
        <FollowUps data={data} loading={isLoading} />
        <SupportTicketSummary data={data} loading={isLoading} />
      </div>

      {/* 12. Activity feed */}
      <RecentActivity data={data} loading={isLoading} />
    </div>
  );
}

/* ---------------- 1. KPI cards ---------------- */

function KpiGrid({ data, loading }: { data?: OpsDashboardData; loading: boolean }) {
  const k = data?.kpis;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <KpiCard label="All Leads" icon={<Users className="size-4" />} timed loading={loading} buckets={k?.allLeads} />
      <KpiCard label="Not Converted Leads" icon={<UserX className="size-4" />} timed loading={loading} buckets={k?.notConvertedLeads} />
      <KpiCard label="New Orders" icon={<ShoppingBag className="size-4" />} timed loading={loading} buckets={k?.newOrders} />
      <KpiCard
        label="Pending Orders"
        icon={<Clock className="size-4" />}
        loading={loading}
        value={k?.pendingOrders.count}
        breakdown={k?.pendingOrders.byReason}
        breakdownTitle="By reason"
      />
      <KpiCard
        label="Complaints (Open)"
        icon={<MessageSquareWarning className="size-4" />}
        loading={loading}
        tone="warn"
        value={k?.complaintsOpen.count}
        breakdown={k?.complaintsOpen.byCategory}
        breakdownTitle="By category"
      />
      <KpiCard
        label="Complaints Resolved"
        icon={<CheckCircle2 className="size-4" />}
        loading={loading}
        tone="success"
        timed
        buckets={k?.complaintsResolved}
        breakdown={k?.complaintsResolved.byCategory}
        breakdownTitle="By category"
      />
      <KpiCard
        label="Orders Completed"
        icon={<PackageCheck className="size-4" />}
        loading={loading}
        tone="success"
        timed
        buckets={k?.ordersCompleted}
        breakdown={k?.ordersCompleted.byService}
        breakdownTitle="By service"
      />
      <KpiCard
        label="Total Sale"
        icon={<Wallet className="size-4" />}
        loading={loading}
        timed
        money
        buckets={k?.totalSale}
        breakdown={k?.totalSale.byService}
        breakdownTitle="By service"
        breakdownMoney
      />
    </div>
  );
}

function KpiCard({
  label, icon, timed, buckets, value, breakdown, breakdownTitle, breakdownMoney, money, loading, tone = "primary",
}: {
  label: string;
  icon: React.ReactNode;
  timed?: boolean;
  buckets?: { today: number; week: number; month: number; total: number };
  value?: number;
  breakdown?: { label: string; value: number }[];
  breakdownTitle?: string;
  breakdownMoney?: boolean;
  money?: boolean;
  loading: boolean;
  tone?: "primary" | "success" | "warn" | "danger";
}) {
  const [win, setWin] = useState<TimeWindow>("today");
  const [open, setOpen] = useState(false);
  const big = timed ? buckets?.[win] ?? 0 : value ?? 0;
  const toneColor =
    tone === "success" ? "var(--admin-success)" :
    tone === "warn" ? "var(--admin-warn)" :
    tone === "danger" ? "var(--admin-danger)" :
    "var(--admin-primary)";
  return (
    <div className="rounded-lg border" style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wide font-medium" style={{ color: "var(--admin-fg-muted)" }}>{label}</div>
            {loading ? (
              <div className="mt-2 h-7 w-20 animate-pulse rounded" style={{ background: "var(--admin-surface-2)" }} />
            ) : (
              <div className="mt-1 text-2xl font-medium tabular-nums" style={{ color: "var(--admin-fg)" }}>
                {money ? fmtINR(big) : fmtN(big)}
              </div>
            )}
          </div>
          <div className="rounded-md p-1.5" style={{ background: "var(--admin-surface-2)", color: toneColor }}>{icon}</div>
        </div>

        {timed && (
          <div className="mt-3 inline-flex rounded-md border p-0.5" style={{ borderColor: "var(--admin-border)" }}>
            {(["today", "week", "month"] as TimeWindow[]).map((w) => (
              <button
                key={w}
                onClick={() => setWin(w)}
                className="px-2 py-0.5 text-[11px] rounded"
                style={{
                  background: win === w ? "var(--admin-primary)" : "transparent",
                  color: win === w ? "#fff" : "var(--admin-fg-muted)",
                  fontWeight: win === w ? 500 : 400,
                }}
              >
                {W_LABEL[w]}
              </button>
            ))}
          </div>
        )}

        {breakdown && breakdown.length > 0 && (
          <button
            onClick={() => setOpen((o) => !o)}
            className="mt-3 flex items-center gap-1 text-[11px]"
            style={{ color: "var(--admin-accent)" }}
          >
            {open ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
            {breakdownTitle ?? "Breakdown"} ({breakdown.length})
          </button>
        )}
      </div>

      {open && breakdown && (
        <div className="border-t px-4 py-2 space-y-1" style={{ borderColor: "var(--admin-border)" }}>
          {breakdown.slice(0, 6).map((b) => (
            <div key={b.label} className="flex items-center justify-between text-[12px]">
              <span className="truncate" style={{ color: "var(--admin-fg-muted)" }}>{b.label.replace(/_/g, " ")}</span>
              <span className="tabular-nums font-medium" style={{ color: "var(--admin-fg)" }}>
                {breakdownMoney ? fmtINR(b.value) : fmtN(b.value)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- 2. Action Required ---------------- */

function ActionRequired({ data, loading }: { data?: OpsDashboardData; loading: boolean }) {
  const a = data?.actionRequired;
  const items = [
    { n: a?.refundDecisionPending ?? 0, label: "Refund requests awaiting decision", href: "/admin/leads?status=refund_requested" },
    { n: a?.docsPendingOver2d ?? 0, label: "Orders waiting for documents > 2 days", href: "/admin/orders?fulfillment=order_received" },
    { n: a?.tasksOverdue ?? 0, label: "Tasks overdue", href: "/admin/tasks" },
    { n: a?.followupsTodayOpen ?? 0, label: "Follow-ups today still open", href: "/admin/tasks" },
  ];
  return (
    <div
      className="rounded-lg border-l-4 border border-[var(--admin-border)] p-4"
      style={{ borderLeftColor: "var(--admin-danger)", background: "var(--admin-surface)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="size-4" style={{ color: "var(--admin-danger)" }} />
        <h3 className="text-sm font-medium" style={{ color: "var(--admin-fg)" }}>Action Required</h3>
      </div>
      {loading ? (
        <TableSkeleton rows={3} cols={1} />
      ) : (
        <ul className="divide-y" style={{ borderColor: "var(--admin-border)" }}>
          {items.map((it) => (
            <li key={it.label} className="flex items-center justify-between py-2 text-sm">
              <span style={{ color: "var(--admin-fg)" }}>
                <span className="font-medium tabular-nums mr-2" style={{ color: "var(--admin-danger)" }}>{it.n}</span>
                {it.label}
              </span>
              <Link to={it.href} className="text-xs" style={{ color: "var(--admin-accent)" }}>View →</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------------- 3. Service Pipeline ---------------- */

function ServicePipeline({ data, loading }: { data?: OpsDashboardData; loading: boolean }) {
  return (
    <SectionCard title="Service Pipeline" action={<Link to="/admin/applications" className="text-xs" style={{ color: "var(--admin-accent)" }}>View applications →</Link>}>
      <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {loading || !data
          ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-20 rounded-md animate-pulse" style={{ background: "var(--admin-surface-2)" }} />)
          : data.servicePipeline.map((s, i) => (
            <div key={s.stage + i} className="rounded-md border p-3" style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface-2)" }}>
              <div className="text-[11px] uppercase tracking-wide" style={{ color: "var(--admin-fg-muted)" }}>{s.stage}</div>
              <div className="mt-1 text-xl font-medium tabular-nums" style={{ color: "var(--admin-primary)" }}>{fmtN(s.count)}</div>
            </div>
          ))}
      </div>
    </SectionCard>
  );
}

/* ---------------- 4. Documents Pending ---------------- */

function DocumentsPending({ data, loading }: { data?: OpsDashboardData; loading: boolean }) {
  return (
    <SectionCard
      title="Documents Pending"
      action={<Link to="/admin/review" className="text-xs" style={{ color: "var(--admin-accent)" }}>Document review →</Link>}
    >
      <div className="p-4 space-y-2 max-h-[420px] overflow-y-auto">
        {loading ? (
          <TableSkeleton rows={4} cols={2} />
        ) : (data?.documentsPending.length ?? 0) === 0 ? (
          <EmptyHint text="All orders have their documents." />
        ) : (
          data!.documentsPending.map((r) => (
            <div key={r.id} className="rounded-md border p-3" style={{ borderColor: "var(--admin-border)" }}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-mono" style={{ color: "var(--admin-fg-muted)" }}>{r.application_code ?? r.id.slice(0, 8)}</div>
                  <div className="text-sm font-medium truncate" style={{ color: "var(--admin-fg)" }}>{r.customer_name ?? "—"}</div>
                  <div className="text-[11px] truncate" style={{ color: "var(--admin-fg-muted)" }}>{r.service ?? "—"}</div>
                </div>
                <button
                  className="shrink-0 inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px]"
                  style={{ borderColor: "var(--admin-border)", color: "var(--admin-fg)" }}
                  title="Send reminder (coming soon)"
                >
                  <Send className="size-3" /> Send reminder
                </button>
              </div>
              {r.missing_docs.length > 0 && (
                <ul className="mt-2 grid grid-cols-2 gap-1 text-[11px]" style={{ color: "var(--admin-fg-muted)" }}>
                  {r.missing_docs.map((d) => (
                    <li key={d} className="flex items-center gap-1">
                      <input type="checkbox" disabled className="accent-[var(--admin-primary)]" />
                      {d}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </div>
    </SectionCard>
  );
}

/* ---------------- 5. Complaint Tracker ---------------- */

function ComplaintTracker({ data, loading }: { data?: OpsDashboardData; loading: boolean }) {
  const c = data?.complaintTracker;
  const pills = c
    ? [
      { label: "Submitted", value: c.counts.submitted },
      { label: "Under Review", value: c.counts.under_review },
      { label: "Awaiting Update", value: c.counts.awaiting_response },
      { label: "Resolved", value: c.counts.resolved },
    ]
    : [];
  return (
    <SectionCard
      title="Complaint Tracker"
      action={<Link to="/admin/complaints" className="text-xs" style={{ color: "var(--admin-accent)" }}>All complaints →</Link>}
    >
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {(loading ? Array.from({ length: 4 }).map((_, i) => ({ label: "…", value: 0, k: i })) : pills).map((p: any, i) => (
            <div key={p.k ?? p.label} className="rounded-md border p-2.5" style={{ borderColor: "var(--admin-border)" }}>
              <div className="text-[10px] uppercase tracking-wide" style={{ color: "var(--admin-fg-muted)" }}>{p.label}</div>
              <div className="text-lg font-medium tabular-nums" style={{ color: "var(--admin-fg)" }}>{loading ? "—" : fmtN(p.value)}</div>
            </div>
          ))}
        </div>
        {loading ? <TableSkeleton rows={4} cols={4} /> : (c?.rows.length ?? 0) === 0 ? (
          <EmptyHint text="No open complaints." />
        ) : (
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left uppercase tracking-wide" style={{ color: "var(--admin-fg-muted)" }}>
                  <th className="py-1.5 pr-3">No.</th>
                  <th className="py-1.5 pr-3">Customer</th>
                  <th className="py-1.5 pr-3">Service</th>
                  <th className="py-1.5 pr-3">Days</th>
                </tr>
              </thead>
              <tbody>
                {c!.rows.map((r, i) => (
                  <tr key={r.id} className="border-t" style={{ borderColor: "var(--admin-border)", background: i % 2 ? "var(--admin-surface-2)" : "transparent" }}>
                    <td className="py-1.5 pr-3 font-mono">{r.complaint_number ?? r.id.slice(0, 8)}</td>
                    <td className="py-1.5 pr-3 truncate max-w-[140px]">{r.customer ?? "—"}</td>
                    <td className="py-1.5 pr-3 truncate max-w-[160px]">{r.service ?? "—"}</td>
                    <td className="py-1.5 pr-3 tabular-nums">{r.days_open}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

/* ---------------- 6. Payment Summary ---------------- */

function PaymentSummary({ data, loading }: { data?: OpsDashboardData; loading: boolean }) {
  const p = data?.paymentSummary;
  const pills = [
    { label: "Today's Collection", value: fmtINR(p?.todayCollection ?? 0), tone: "success" as const },
    { label: "Pending Payments", value: fmtINR(p?.pendingPayments ?? 0), tone: "warn" as const },
    { label: "Refund Requests", value: fmtN(p?.refundRequests ?? 0), tone: "danger" as const },
    { label: "Chargebacks", value: fmtN(p?.chargebacks ?? 0), tone: "danger" as const },
  ];
  const toneColor = (t: "success" | "warn" | "danger") =>
    t === "success" ? "var(--admin-success)" : t === "warn" ? "var(--admin-warn)" : "var(--admin-danger)";
  return (
    <SectionCard title="Payment Summary" action={<Link to="/admin/finance" className="text-xs" style={{ color: "var(--admin-accent)" }}>Payments →</Link>}>
      <div className="p-4 space-y-2">
        {(loading ? Array.from({ length: 4 }).map(() => null) : pills).map((x, i) =>
          x ? (
            <div key={x.label} className="flex items-center justify-between rounded-md border px-3 py-2" style={{ borderColor: "var(--admin-border)" }}>
              <span className="text-[12px]" style={{ color: "var(--admin-fg-muted)" }}>{x.label}</span>
              <span className="text-sm font-medium tabular-nums" style={{ color: toneColor(x.tone) }}>{x.value}</span>
            </div>
          ) : <div key={i} className="h-10 rounded-md animate-pulse" style={{ background: "var(--admin-surface-2)" }} />,
        )}
      </div>
    </SectionCard>
  );
}

/* ---------------- 7. Revenue Chart ---------------- */

function RevenueChart({ data, loading }: { data?: OpsDashboardData; loading: boolean }) {
  const [range, setRange] = useState<"weekly" | "monthly">("weekly");
  const series = useMemo(() => {
    const rows = data?.revenue[range] ?? [];
    return rows.map((r) => ({ label: new Date(r.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }), total: r.total }));
  }, [data, range]);
  return (
    <SectionCard
      title="Revenue"
      action={
        <div className="inline-flex rounded-md border p-0.5" style={{ borderColor: "var(--admin-border)" }}>
          {(["weekly", "monthly"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="px-2 py-0.5 text-[11px] rounded capitalize"
              style={{
                background: range === r ? "var(--admin-primary)" : "transparent",
                color: range === r ? "#fff" : "var(--admin-fg-muted)",
                fontWeight: range === r ? 500 : 400,
              }}
            >
              {r}
            </button>
          ))}
        </div>
      }
    >
      <div className="h-64 p-3">
        {loading || !data ? (
          <div className="h-full w-full animate-pulse rounded" style={{ background: "var(--admin-surface-2)" }} />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={series} margin={{ left: 4, right: 8, top: 8, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--admin-fg-muted)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--admin-fg-muted)" }} tickFormatter={(v) => v >= 1000 ? `${Math.round(v / 1000)}k` : String(v)} />
              <Tooltip
                contentStyle={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", borderRadius: 6, fontSize: 12 }}
                formatter={(v: number) => fmtINR(v)}
              />
              <Bar dataKey="total" radius={[3, 3, 0, 0]}>
                {series.map((_, i) => <Cell key={i} fill="var(--admin-primary)" />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </SectionCard>
  );
}

/* ---------------- 8. Top Services ---------------- */

function TopServices({ data, loading }: { data?: OpsDashboardData; loading: boolean }) {
  const rows = data?.topServices ?? [];
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <SectionCard title="Top Selling Services">
      <div className="p-4 space-y-2">
        {loading ? <TableSkeleton rows={5} cols={1} /> : rows.length === 0 ? <EmptyHint text="No orders yet." /> : rows.map((r, i) => (
          <div key={r.label + i}>
            <div className="flex justify-between text-xs mb-1">
              <span className="truncate font-medium" style={{ color: "var(--admin-fg)" }}>{i + 1}. {r.label}</span>
              <span className="tabular-nums" style={{ color: "var(--admin-fg-muted)" }}>{fmtN(r.value)}</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--admin-surface-2)" }}>
              <div className="h-full" style={{ width: `${(r.value / max) * 100}%`, background: "var(--admin-primary)" }} />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

/* ---------------- 9. Staff Performance ---------------- */

function StaffPerformance({ data, loading }: { data?: OpsDashboardData; loading: boolean }) {
  return (
    <SectionCard title="Staff Performance" action={<Link to="/admin/employees" className="text-xs" style={{ color: "var(--admin-accent)" }}>Employees →</Link>}>
      <div className="p-4">
        {loading ? <TableSkeleton rows={5} cols={4} /> : (data?.staffPerformance.length ?? 0) === 0 ? (
          <EmptyHint text="No assignments yet." />
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left uppercase tracking-wide" style={{ color: "var(--admin-fg-muted)" }}>
                <th className="py-1.5 pr-3">Name</th>
                <th className="py-1.5 pr-3 text-right">Handled</th>
                <th className="py-1.5 pr-3 text-right">Done</th>
                <th className="py-1.5 pr-3 text-right">Open</th>
              </tr>
            </thead>
            <tbody>
              {data!.staffPerformance.map((s, i) => (
                <tr key={s.user_id} style={{ background: i % 2 ? "var(--admin-surface-2)" : "transparent" }} className="border-t" >
                  <td className="py-1.5 pr-3 truncate max-w-[160px]" style={{ borderColor: "var(--admin-border)" }}>{s.name}</td>
                  <td className="py-1.5 pr-3 text-right tabular-nums">{fmtN(s.handled)}</td>
                  <td className="py-1.5 pr-3 text-right tabular-nums" style={{ color: "var(--admin-success)" }}>{fmtN(s.completed)}</td>
                  <td className="py-1.5 pr-3 text-right tabular-nums" style={{ color: "var(--admin-warn)" }}>{fmtN(s.pending)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </SectionCard>
  );
}

/* ---------------- 10. Follow-ups ---------------- */

function FollowUps({ data, loading }: { data?: OpsDashboardData; loading: boolean }) {
  const qc = useQueryClient();
  const mark = useServerFn(markFollowUpComplete);
  const m = useMutation({
    mutationFn: (id: string) => mark({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ops-dashboard"] }),
  });
  return (
    <SectionCard title="Today's Follow-ups" action={<span className="text-[11px]" style={{ color: "var(--admin-fg-muted)" }}><Calendar className="inline size-3 mr-1" />{new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span>}>
      <div className="p-4">
        {loading ? <TableSkeleton rows={4} cols={2} /> : (data?.followUps.length ?? 0) === 0 ? (
          <EmptyHint text="No follow-ups scheduled for today." />
        ) : (
          <ul className="space-y-1.5">
            {data!.followUps.map((f) => (
              <li key={f.id} className="flex items-center gap-2 text-xs">
                <span className="font-mono shrink-0" style={{ color: "var(--admin-fg-muted)" }}>{f.time}</span>
                <span className="font-medium truncate" style={{ color: "var(--admin-fg)" }}>{f.customer}</span>
                <span className="truncate flex-1" style={{ color: "var(--admin-fg-muted)" }}>· {f.reason}{f.assignedTo ? ` · ${f.assignedTo}` : ""}</span>
                <button
                  onClick={() => m.mutate(f.id)}
                  disabled={m.isPending}
                  className="shrink-0 inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] hover:bg-[var(--admin-surface-2)] disabled:opacity-50"
                  style={{ borderColor: "var(--admin-border)" }}
                  title="Mark complete"
                >
                  <CheckCircle2 className="size-3" /> Done
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SectionCard>
  );
}

/* ---------------- Refund Tracker ---------------- */

function RefundTracker({ data, loading }: { data?: OpsDashboardData; loading: boolean }) {
  const r = data?.refundTracker;
  const pills = [
    { label: "Requested", value: r?.requested ?? 0, color: "var(--admin-warn)" },
    { label: "Approved", value: r?.approved ?? 0, color: "var(--admin-info)" },
    { label: "Refunded", value: r?.refunded ?? 0, color: "var(--admin-success)" },
  ];
  return (
    <SectionCard title="Refund Tracker" action={<span className="text-[11px]" style={{ color: "var(--admin-fg-muted)" }}>Last 30 days</span>}>
      <div className="p-4 grid grid-cols-3 gap-2">
        {(loading ? Array.from({ length: 3 }).map(() => null) : pills).map((x, i) => x ? (
          <div key={x.label} className="rounded-md border p-2.5 text-center" style={{ borderColor: "var(--admin-border)" }}>
            <div className="text-[10px] uppercase tracking-wide" style={{ color: "var(--admin-fg-muted)" }}>{x.label}</div>
            <div className="text-lg font-medium tabular-nums" style={{ color: x.color }}>{fmtN(x.value)}</div>
          </div>
        ) : <div key={i} className="h-14 rounded-md animate-pulse" style={{ background: "var(--admin-surface-2)" }} />)}
      </div>
    </SectionCard>
  );
}

/* ---------------- 11. Support Ticket Summary ---------------- */

function SupportTicketSummary({ data, loading }: { data?: OpsDashboardData; loading: boolean }) {
  const t = data?.supportTickets;
  const pills = [
    { label: "Open", value: t?.open ?? 0, color: "var(--admin-info)" },
    { label: "In Progress", value: t?.in_progress ?? 0, color: "var(--admin-warn)" },
    { label: "Resolved", value: t?.resolved ?? 0, color: "var(--admin-success)" },
    { label: "Closed", value: t?.closed ?? 0, color: "var(--admin-fg-muted)" },
  ];
  return (
    <SectionCard title="Support Tickets" action={<Link to="/admin/tickets" className="text-xs" style={{ color: "var(--admin-accent)" }}>All tickets →</Link>}>
      <div className="p-4 space-y-2">
        {(loading ? Array.from({ length: 4 }).map(() => null) : pills).map((x, i) => x ? (
          <div key={x.label} className="flex items-center justify-between rounded-md border px-3 py-2" style={{ borderColor: "var(--admin-border)" }}>
            <span className="flex items-center gap-2 text-[12px]" style={{ color: "var(--admin-fg-muted)" }}>
              <span className="size-1.5 rounded-full" style={{ background: x.color }} />
              {x.label}
            </span>
            <span className="text-sm font-medium tabular-nums" style={{ color: "var(--admin-fg)" }}>{fmtN(x.value)}</span>
          </div>
        ) : <div key={i} className="h-10 rounded-md animate-pulse" style={{ background: "var(--admin-surface-2)" }} />)}
        {!loading && t && t.open + t.in_progress + t.resolved + t.closed === 0 && (
          <p className="text-[11px] pt-1" style={{ color: "var(--admin-fg-muted)" }}>
            <LifeBuoy className="inline size-3 mr-1" />
            Support Tickets module ships next.
          </p>
        )}
      </div>
    </SectionCard>
  );
}

/* ---------------- 12. Recent activity ---------------- */

function RecentActivity({ data, loading }: { data?: OpsDashboardData; loading: boolean }) {
  return (
    <SectionCard title="Recent Activity" action={<Link to="/admin/activity" className="text-xs" style={{ color: "var(--admin-accent)" }}>Full log →</Link>}>
      <div className="p-4 max-h-[320px] overflow-y-auto">
        {loading ? <TableSkeleton rows={6} cols={2} /> : (data?.recentActivity.length ?? 0) === 0 ? (
          <EmptyHint text="No activity yet." />
        ) : (
          <ul className="space-y-1.5 text-xs">
            {data!.recentActivity.map((a) => {
              const ts = new Date(a.created_at).toLocaleString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" });
              const desc = describeEvent(a);
              return (
                <li key={a.id} className="flex items-baseline gap-3 border-b py-1.5" style={{ borderColor: "var(--admin-border)" }}>
                  <time className="font-mono shrink-0 text-[10px]" style={{ color: "var(--admin-fg-muted)" }}>{ts}</time>
                  <span className="rounded bg-[var(--admin-surface-2)] px-1.5 py-0.5 text-[10px] uppercase tracking-wide shrink-0" style={{ color: "var(--admin-fg-muted)" }}>
                    {a.event_type.replace(/_/g, " ")}
                  </span>
                  <span className="truncate" style={{ color: "var(--admin-fg)" }}>
                    {a.staff_name ? <span className="font-medium">{a.staff_name}</span> : <span style={{ color: "var(--admin-fg-muted)" }}>System</span>} — {desc}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </SectionCard>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="text-xs text-center py-6" style={{ color: "var(--admin-fg-muted)" }}>
      <Bell className="inline size-3 mr-1 opacity-50" />
      {text}
    </div>
  );
}

function describeEvent(a: { event_type: string; old_value: string | null; new_value: string | null }): string {
  const arrow = a.old_value && a.new_value ? `${a.old_value} → ${a.new_value}` : (a.new_value ?? a.old_value ?? "");
  const label = a.event_type.replace(/_/g, " ");
  return arrow ? `${label}: ${arrow}` : label;
}

// suppress unused-import warnings for icons referenced only conditionally
void FileText; void ActivityIcon;
