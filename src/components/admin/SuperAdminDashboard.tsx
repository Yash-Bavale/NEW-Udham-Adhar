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

/* ---------------- KPI (modern light) ---------------- */

type Tone = "indigo" | "emerald" | "amber" | "rose" | "sky" | "violet" | "slate" | "teal";

const TONE_STYLES: Record<Tone, { chip: string; ring: string; value: string; barA: string; barB: string }> = {
  indigo:  { chip: "bg-indigo-50 text-indigo-600",   ring: "ring-indigo-100",  value: "text-slate-900", barA: "bg-indigo-500",  barB: "bg-indigo-200"  },
  emerald: { chip: "bg-emerald-50 text-emerald-600", ring: "ring-emerald-100", value: "text-slate-900", barA: "bg-emerald-500", barB: "bg-emerald-200" },
  amber:   { chip: "bg-amber-50 text-amber-600",     ring: "ring-amber-100",   value: "text-slate-900", barA: "bg-amber-500",   barB: "bg-amber-200"   },
  rose:    { chip: "bg-rose-50 text-rose-600",       ring: "ring-rose-100",    value: "text-slate-900", barA: "bg-rose-500",    barB: "bg-rose-200"    },
  sky:     { chip: "bg-sky-50 text-sky-600",         ring: "ring-sky-100",     value: "text-slate-900", barA: "bg-sky-500",     barB: "bg-sky-200"     },
  violet:  { chip: "bg-violet-50 text-violet-600",   ring: "ring-violet-100",  value: "text-slate-900", barA: "bg-violet-500",  barB: "bg-violet-200"  },
  slate:   { chip: "bg-slate-100 text-slate-600",    ring: "ring-slate-200",   value: "text-slate-900", barA: "bg-slate-500",   barB: "bg-slate-200"   },
  teal:    { chip: "bg-teal-50 text-teal-600",       ring: "ring-teal-100",    value: "text-slate-900", barA: "bg-teal-500",    barB: "bg-teal-200"    },
};

function DeltaPill({ d }: { d: { pct: number; up: boolean } | null }) {
  if (!d) return null;
  const Icon = d.up ? TrendingUp : TrendingDown;
  const cls = d.up ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50";
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${cls}`}>
      <Icon className="size-2.5" /> {d.pct}%
    </span>
  );
}

function StatChip({ label, value, tone }: { label: string; value: string | number; tone: "emerald" | "rose" | "amber" | "sky" | "slate" | "indigo" | "violet" | "teal" }) {
  const cls: Record<string, string> = {
    emerald: "text-emerald-700 bg-emerald-50",
    rose: "text-rose-700 bg-rose-50",
    amber: "text-amber-700 bg-amber-50",
    sky: "text-sky-700 bg-sky-50",
    slate: "text-slate-600 bg-slate-100",
    indigo: "text-indigo-700 bg-indigo-50",
    violet: "text-violet-700 bg-violet-50",
    teal: "text-teal-700 bg-teal-50",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${cls[tone]}`}>
      <span className="opacity-70">{label}</span>
      <span className="font-semibold tabular-nums">{typeof value === "number" ? fmtN(value) : value}</span>
    </span>
  );
}

function ModernKpi({
  icon, label, value, tone, delta, subs, footer,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: Tone;
  delta?: { pct: number; up: boolean } | null;
  subs?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const t = TONE_STYLES[tone];
  return (
    <div className={`group relative flex flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:shadow-md hover:border-slate-300 ring-1 ${t.ring}`}>
      <div className="flex items-start justify-between gap-2">
        <div className={`grid size-9 place-items-center rounded-xl ${t.chip}`}>{icon}</div>
        {delta !== undefined && <DeltaPill d={delta ?? null} />}
      </div>
      <div className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-1 text-2xl font-bold leading-tight tabular-nums ${t.value}`}>{value}</div>
      {subs && <div className="mt-2 flex flex-wrap gap-1">{subs}</div>}
      {footer && <div className="mt-2 text-[11px] text-slate-500">{footer}</div>}
    </div>
  );
}

function KpiGrid({ data, loading }: { data?: SuperAdminOverview; loading: boolean }) {
  if (loading || !data) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 13 }).map((_, i) => <Skeleton key={i} className="h-[140px] rounded-2xl" />)}
      </div>
    );
  }
  const m = data.metrics;
  const leadsDelta = pctDelta(m.uniqueLeads, m.uniqueLeadsPrev);
  const paidDelta = pctDelta(m.paidOrders, m.paidOrdersPrev);
  const ticketsDelta = pctDelta(m.ticketsRaised, m.ticketsRaisedPrev);
  const revDelta = pctDelta(m.revenueInclTax, m.revenueInclTaxPrev);
  const convDelta = pctDelta(m.conversionRate, m.conversionRatePrev);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <ModernKpi
        icon={<Users className="size-4" />} label="Unique Leads" value={fmtN(m.uniqueLeads)} tone="indigo" delta={leadsDelta}
        subs={<>
          <StatChip label="Not Contacted" value={m.leadsNotContacted} tone="rose" />
          <StatChip label="Converted" value={m.leadsConvertedAfterContact} tone="emerald" />
        </>}
      />
      <ModernKpi
        icon={<ShoppingBag className="size-4" />} label="Paid Orders" value={fmtN(m.paidOrders)} tone="emerald" delta={paidDelta}
        subs={<>
          <StatChip label="Pending" value={m.paidOrdersPending} tone="amber" />
          <StatChip label="Closed" value={m.paidOrdersClosed} tone="emerald" />
        </>}
      />
      <ModernKpi
        icon={<AlertTriangle className="size-4" />} label="Technical Delay" value={fmtN(m.technicalDelay)}
        tone={m.technicalDelay > 0 ? "amber" : "slate"}
        subs={<>
          <StatChip label="Customer Delay" value={m.customerDelay} tone="rose" />
          <StatChip label="Form Not Submitted" value={m.formNotSubmitted} tone="amber" />
        </>}
      />
      <ModernKpi
        icon={<Bell className="size-4" />} label="Order Alerts" value={fmtN(m.ordersDelayed3d)}
        tone={m.ordersDelayed7d > 0 ? "rose" : m.ordersDelayed3d > 0 ? "amber" : "slate"}
        subs={<>
          <StatChip label="3+ Days" value={m.ordersDelayed3d} tone="amber" />
          <StatChip label="7+ Days" value={m.ordersDelayed7d} tone="rose" />
        </>}
      />
      <ModernKpi
        icon={<ShieldCheck className="size-4" />} label="Support Tickets Raised" value={fmtN(m.ticketsRaised)} tone="sky" delta={ticketsDelta}
        subs={<>
          <StatChip label="Closed" value={m.ticketsClosed} tone="emerald" />
          <StatChip label="Pending 3+d" value={m.ticketsPending3d} tone="rose" />
        </>}
      />
      <ModernKpi
        icon={<RefreshCw className="size-4" />} label="Refund Requests" value={fmtN(m.refundAccepted + m.refundRejected)} tone="violet"
        subs={<>
          <StatChip label="Accepted" value={m.refundAccepted} tone="emerald" />
          <StatChip label="Rejected" value={m.refundRejected} tone="rose" />
        </>}
      />
      <ModernKpi
        icon={<Mail className="size-4" />} label="Email Delivery" value={fmtN(m.emailSent + m.emailQueued + m.emailFailed)}
        tone={m.emailFailed > 0 ? "rose" : "teal"}
        subs={<>
          <StatChip label="Sent" value={m.emailSent} tone="emerald" />
          <StatChip label="Queued" value={m.emailQueued} tone="amber" />
          <StatChip label="Failed" value={m.emailFailed} tone="rose" />
        </>}
      />
      <ModernKpi
        icon={<Briefcase className="size-4" />} label="Active Staff" value={fmtN(m.staffActiveToday)} tone="indigo"
        subs={<>
          <StatChip label="Total" value={m.staffTotal} tone="slate" />
          <StatChip label="Inactive" value={m.staffInactive} tone="rose" />
        </>}
        footer="Signed in today (IST)"
      />
      <ModernKpi
        icon={<UserCheck className="size-4" />} label="Orders Not Contacted" value={fmtN(m.ordersNotContacted3h)}
        tone={m.ordersNotContacted5h > 0 ? "rose" : m.ordersNotContacted3h > 0 ? "amber" : "slate"}
        subs={<>
          <StatChip label="3+ hrs" value={m.ordersNotContacted3h} tone="amber" />
          <StatChip label="5+ hrs" value={m.ordersNotContacted5h} tone="rose" />
        </>}
      />
      <ModernKpi
        icon={<Wallet className="size-4" />} label="Revenue (excl. Tax)" value={fmtShortINR(m.revenueExclTax)} tone="emerald" delta={revDelta}
        subs={<>
          <StatChip label="Incl. Tax" value={fmtShortINR(m.revenueInclTax)} tone="emerald" />
          <StatChip label="Tax" value={fmtShortINR(m.taxCollected)} tone="slate" />
        </>}
      />
      <ModernKpi
        icon={<Target className="size-4" />} label="Conversion %" value={`${m.conversionRate.toFixed(1)}%`} tone="teal" delta={convDelta}
        footer={`Paid ÷ Unique Leads (${fmtN(m.paidOrders)} / ${fmtN(m.uniqueLeads)})`}
      />
      <ModernKpi
        icon={<Activity className="size-4" />} label="Webhook Errors (24h)" value={fmtN(m.webhookErrors24h)}
        tone={m.webhookErrors24h > 0 ? "rose" : "emerald"}
        footer={m.webhookErrors24h > 0 ? "Investigate failures" : "All webhooks healthy"}
      />
      <ModernKpi
        icon={<Globe className="size-4" />} label="Gateway Status" value="PayU"
        tone={m.payuLive && data.payu.isProduction ? "emerald" : "amber"}
        subs={<>
          <StatChip label={data.payu.isProduction ? "LIVE" : data.payu.mode.toUpperCase()} value={m.payuLive ? "●" : "○"} tone={data.payu.isProduction ? "emerald" : "amber"} />
          <StatChip label="Collected" value={fmtShortINR(m.payuRevenue)} tone="slate" />
        </>}
      />
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
