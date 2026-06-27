// Shared executive / super-admin dashboard. Clean shadcn UI, IST date-range aware.
// Mounted by both /admin/dashboard and /admin/super (super-mode adds quick actions).
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import {
  Activity, AlertTriangle, Award, Bell, Briefcase, Database, FileText, Globe, Mail,
  RefreshCw, Send, ShieldCheck, ShoppingBag, Target, TrendingDown, TrendingUp,
  UserCheck, Users, Wallet,
} from "lucide-react";
import {
  getSuperAdminOverview, processEmailQueueNow, seedMissingEmailTemplates,
  type RangePreset, type SuperAdminOverview,
} from "@/lib/crm/super-admin.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { formatIST } from "@/lib/datetime";
import { DateRangePicker } from "./DateRangePicker";

const fmtN = (n: number) => new Intl.NumberFormat("en-IN").format(n || 0);
const fmtINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);
const fmtShortINR = (n: number) => {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)}Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(2)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}k`;
  return `₹${Math.round(n)}`;
};

function pctDelta(curr: number, prev: number): { pct: number; up: boolean } | null {
  if (!prev && !curr) return null;
  if (!prev) return { pct: 100, up: true };
  const pct = ((curr - prev) / prev) * 100;
  return { pct: Math.abs(Math.round(pct * 10) / 10), up: pct >= 0 };
}

const PRESETS: { value: RangePreset; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "mtd", label: "This month" },
  { value: "custom", label: "Custom" },
];

export type DashboardRange = {
  preset: RangePreset;
  fromIso?: string;
  toIso?: string;
};

export function SuperAdminDashboard({
  superMode = false,
  range,
  onRangeChange,
  title = "Executive Dashboard",
}: {
  superMode?: boolean;
  range: DashboardRange;
  onRangeChange: (r: DashboardRange) => void;
  title?: string;
}) {
  const fetchOverview = useServerFn(getSuperAdminOverview);
  const { data, isLoading, isFetching, refetch } = useQuery<SuperAdminOverview>({
    queryKey: ["super-admin-overview", range.preset, range.fromIso ?? "", range.toIso ?? ""],
    queryFn: () => fetchOverview({ data: range }),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  // Live IST clock
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const customFrom = range.fromIso ? new Date(range.fromIso) : undefined;
  const customTo = range.toIso ? new Date(range.toIso) : undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live · {formatIST(now, { timeOnly: true })} IST
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">
            {data?.range.label ?? "Loading…"} · auto-refresh every 60s
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Tabs
            value={range.preset}
            onValueChange={(v) =>
              onRangeChange({ preset: v as RangePreset, fromIso: range.fromIso, toIso: range.toIso })
            }
          >
            <TabsList className="h-9">
              {PRESETS.map((p) => (
                <TabsTrigger key={p.value} value={p.value} className="text-xs px-2.5">
                  {p.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          {range.preset === "custom" && (
            <DateRangePicker
              from={customFrom}
              to={customTo}
              onChange={(r) =>
                onRangeChange({
                  preset: "custom",
                  fromIso: r.from?.toISOString(),
                  toIso: r.to?.toISOString(),
                })
              }
            />
          )}
          <Button variant="outline" size="sm" onClick={() => refetch()} className="h-9 gap-2">
            <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>
      </div>

      <KpiGrid data={data} loading={isLoading} />

      <div className="grid gap-4 lg:grid-cols-3">
        <TrendCard data={data} loading={isLoading} className="lg:col-span-2" />
        <TopServicesCard data={data} loading={isLoading} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <WorkflowCard data={data} loading={isLoading} />
        <EmailQueueCard data={data} loading={isLoading} />
        <AlertsCard data={data} loading={isLoading} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ActivityCard data={data} loading={isLoading} className={superMode ? "lg:col-span-2" : "lg:col-span-3"} />
        {superMode && <SuperActionsCard onChanged={() => refetch()} />}
      </div>
    </div>
  );
}

/* ---------------- KPI ---------------- */

function KpiCard({
  icon, label, value, sub, tone = "default",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: React.ReactNode;
  tone?: "default" | "good" | "warn" | "bad";
}) {
  const toneClasses = {
    default: "border-border",
    good: "border-emerald-200 dark:border-emerald-900/40",
    warn: "border-amber-200 dark:border-amber-900/40",
    bad: "border-rose-200 dark:border-rose-900/40",
  }[tone];
  const iconBg = {
    default: "bg-muted text-foreground",
    good: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    warn: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    bad: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
  }[tone];
  return (
    <Card className={`overflow-hidden ${toneClasses}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
            <div className="mt-1 truncate text-2xl font-bold tabular-nums">{value}</div>
            {sub && <div className="mt-1 text-[11px] text-muted-foreground">{sub}</div>}
          </div>
          <div className={`rounded-lg p-2 ${iconBg}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function DeltaPill({ d }: { d: { pct: number; up: boolean } | null }) {
  if (!d) return <span className="text-muted-foreground">—</span>;
  const Icon = d.up ? TrendingUp : TrendingDown;
  return (
    <span
      className={`inline-flex items-center gap-0.5 font-semibold ${
        d.up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
      }`}
    >
      <Icon className="size-3" /> {d.pct}%
    </span>
  );
}

function KpiGrid({ data, loading }: { data?: SuperAdminOverview; loading: boolean }) {
  if (loading || !data) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-[100px] rounded-xl" />)}
      </div>
    );
  }
  const k = data.kpis;
  const leadsD = pctDelta(k.leadsCurrent, k.leadsPrev);
  const revD = pctDelta(k.revenueCurrent, k.revenuePrev);
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      <KpiCard icon={<Users className="size-4" />} label="Leads" value={fmtN(k.leadsCurrent)}
        sub={<>vs prev period <DeltaPill d={leadsD} /></>} />
      <KpiCard icon={<Wallet className="size-4" />} label="Revenue" value={fmtShortINR(k.revenueCurrent)}
        sub={<>vs prev <DeltaPill d={revD} /></>} tone="good" />
      <KpiCard icon={<ShoppingBag className="size-4" />} label="Paid Orders" value={fmtN(k.paidPayments)}
        sub={<>AOV {fmtShortINR(k.avgOrderValue)}</>} />
      <KpiCard icon={<Target className="size-4" />} label="Conversion" value={`${k.conversionRate.toFixed(1)}%`}
        sub="paid leads / total" />
      <KpiCard icon={<ShoppingBag className="size-4" />} label="Open Orders" value={fmtN(k.openApplications)}
        sub="in fulfillment" />
      <KpiCard icon={<FileText className="size-4" />} label="Docs Pending" value={fmtN(k.documentsPending)}
        sub="awaiting upload" tone={k.documentsPending > 0 ? "warn" : "default"} />
      <KpiCard icon={<Award className="size-4" />} label="Certificates" value={fmtN(k.certificatesInRange)}
        sub="in range" tone="good" />
      <KpiCard icon={<Mail className="size-4" />} label="Email Queue" value={fmtN(k.emailQueueDepth)}
        sub="queued + failed" tone={k.emailQueueDepth > 0 ? "warn" : "default"} />
      <KpiCard icon={<UserCheck className="size-4" />} label="Customers" value={fmtN(k.totalCustomers)}
        sub="lifetime" />
      <KpiCard icon={<Briefcase className="size-4" />} label="Active Staff" value={fmtN(k.activeStaff)}
        sub="with role" />
      <KpiCard icon={<AlertTriangle className="size-4" />} label="Webhook Errors (24h)" value={fmtN(data.webhookFailures24h)}
        tone={data.webhookFailures24h > 0 ? "bad" : "good"} />
      <KpiCard icon={<Globe className="size-4" />} label="PayU" value={data.payu.mode.toUpperCase()}
        sub={data.payu.isProduction ? "live payments" : "test mode"}
        tone={data.payu.isProduction ? "good" : "bad"} />
    </div>
  );
}

/* ---------------- Trend ---------------- */

function TrendCard({ data, loading, className }: { data?: SuperAdminOverview; loading: boolean; className?: string }) {
  const chartData = useMemo(() => {
    if (!data) return [];
    return data.trend.days.map((d, i) => ({
      day: d.slice(5), // MM-DD
      Leads: data.trend.leads[i] ?? 0,
      Revenue: data.trend.revenueInr[i] ?? 0,
    }));
  }, [data]);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm">Revenue & Leads</CardTitle>
            <p className="text-[11px] text-muted-foreground">All times in IST · paid payments only</p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-indigo-500" /> Leads</span>
            <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-emerald-500" /> Revenue</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[260px] w-full" />
        ) : chartData.length === 0 ? (
          <div className="grid h-[260px] place-items-center text-sm text-muted-foreground">No data in range</div>
        ) : (
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(v) => fmtShortINR(Number(v))}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(value: any, name: any) =>
                    name === "Revenue" ? [fmtINR(Number(value)), name] : [fmtN(Number(value)), name]
                  }
                />
                <Bar yAxisId="left" dataKey="Leads" fill="#6366F1" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Line yAxisId="right" type="monotone" dataKey="Revenue" stroke="#10B981" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ---------------- Top services ---------------- */

function TopServicesCard({ data, loading }: { data?: SuperAdminOverview; loading: boolean }) {
  const rows = data?.topServices ?? [];
  const max = Math.max(1, ...rows.map((r) => r.revenueInr));
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Top Services</CardTitle>
        <p className="text-[11px] text-muted-foreground">By revenue in selected range</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
        ) : rows.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">No orders in range</div>
        ) : (
          rows.map((r) => (
            <div key={r.name}>
              <div className="flex justify-between text-xs">
                <span className="truncate pr-2 font-medium">{r.name}</span>
                <span className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                  {fmtShortINR(r.revenueInr)}
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                  style={{ width: `${(r.revenueInr / max) * 100}%` }}
                />
              </div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">{r.orders} orders</div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

/* ---------------- Workflow ---------------- */

function WorkflowCard({ data, loading }: { data?: SuperAdminOverview; loading: boolean }) {
  const w = data?.workflow;
  const items = [
    { label: "External Delay", value: w?.externalDelay ?? 0 },
    { label: "Waiting on Customer", value: w?.onHold ?? 0 },
    { label: "Refunds Pending", value: w?.refundPending ?? 0 },
    { label: "Reminders Due", value: w?.remindersDue ?? 0 },
    { label: "Closed in Range", value: w?.closedInRange ?? 0 },
  ];
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Activity className="size-4" /> Workflow Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)
          : items.map((it) => (
              <div key={it.label} className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted/50">
                <span className="text-sm text-muted-foreground">{it.label}</span>
                <Badge variant={it.value > 0 ? "secondary" : "outline"} className="tabular-nums">{fmtN(it.value)}</Badge>
              </div>
            ))}
      </CardContent>
    </Card>
  );
}

/* ---------------- Email queue ---------------- */

function EmailQueueCard({ data, loading }: { data?: SuperAdminOverview; loading: boolean }) {
  const q = data?.emailQueue;
  const items = [
    { label: "Queued", value: q?.queued ?? 0, tone: "default" as const },
    { label: "Processing", value: q?.processing ?? 0, tone: "default" as const },
    { label: "Failed", value: q?.failed ?? 0, tone: (q?.failed ?? 0) > 0 ? ("bad" as const) : ("default" as const) },
    { label: "Sent", value: q?.sent ?? 0, tone: "good" as const },
  ];
  const tones: Record<string, string> = {
    default: "",
    good: "text-emerald-600 dark:text-emerald-400",
    bad: "text-rose-600 dark:text-rose-400",
  };
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Mail className="size-4" /> Email Queue
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)
          : items.map((it) => (
              <div key={it.label} className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted/50">
                <span className="text-sm text-muted-foreground">{it.label}</span>
                <span className={`font-semibold tabular-nums ${tones[it.tone]}`}>{fmtN(it.value)}</span>
              </div>
            ))}
      </CardContent>
    </Card>
  );
}

/* ---------------- Alerts ---------------- */

function AlertsCard({ data, loading }: { data?: SuperAdminOverview; loading: boolean }) {
  const alerts = data?.alerts ?? [];
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <ShieldCheck className="size-4" /> System Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading && <Skeleton className="h-16 w-full" />}
        {!loading && alerts.length === 0 && (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
            ✓ All systems healthy. No active alerts.
          </div>
        )}
        {alerts.map((a) => {
          const isHigh = a.severity === "high";
          return (
            <div
              key={a.id}
              className={`flex items-start gap-2 rounded-md border px-3 py-2 text-xs ${
                isHigh
                  ? "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300"
                  : "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300"
              }`}
            >
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
              <span>{a.message}</span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

/* ---------------- Activity ---------------- */

function ActivityCard({
  data, loading, className,
}: {
  data?: SuperAdminOverview; loading: boolean; className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Bell className="size-4" /> Recent Activity
        </CardTitle>
        <p className="text-[11px] text-muted-foreground">All timestamps in IST</p>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <Skeleton className="h-[260px] w-full" />
        ) : (data?.activity.length ?? 0) === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">No recent activity</div>
        ) : (
          <ScrollArea className="h-[260px] pr-3">
            <div className="divide-y divide-border">
              {data?.activity.map((a) => (
                <div key={a.id} className="flex items-start justify-between gap-3 py-2">
                  <span className="text-sm">{a.description}</span>
                  <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
                    {formatIST(a.created_at)}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

/* ---------------- Super actions ---------------- */

function SuperActionsCard({ onChanged }: { onChanged: () => void }) {
  const processQueue = useServerFn(processEmailQueueNow);
  const seed = useServerFn(seedMissingEmailTemplates);

  const processMut = useMutation({
    mutationFn: () => processQueue(),
    onSuccess: () => { toast.success("Email queue processed"); onChanged(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const seedMut = useMutation({
    mutationFn: () => seed(),
    onSuccess: (r) => { toast.success(`Seed complete · ${r.inserted}/${r.total}`); onChanged(); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Database className="size-4" /> Super Actions
        </CardTitle>
        <p className="text-[11px] text-muted-foreground">Super-admin only</p>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          onClick={() => processMut.mutate()}
          disabled={processMut.isPending}
          className="w-full justify-start gap-2"
          size="sm"
        >
          <Send className="size-3.5" />
          {processMut.isPending ? "Processing…" : "Process Email Queue"}
        </Button>
        <Button
          onClick={() => seedMut.mutate()}
          disabled={seedMut.isPending}
          variant="outline"
          className="w-full justify-start gap-2"
          size="sm"
        >
          <Mail className="size-3.5" />
          {seedMut.isPending ? "Seeding…" : "Seed Email Templates"}
        </Button>
        <Separator className="my-2" />
        <Button asChild variant="ghost" size="sm" className="w-full justify-start">
          <a href="/admin/employees">Manage Employees</a>
        </Button>
        <Button asChild variant="ghost" size="sm" className="w-full justify-start">
          <a href="/admin/audit">View Audit Log</a>
        </Button>
      </CardContent>
    </Card>
  );
}
