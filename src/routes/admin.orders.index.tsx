import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { formatIST } from "@/lib/datetime";

import { listOrdersV2 } from "@/lib/crm/orders-v2.functions";
import { listStaff } from "@/lib/crm/leads-admin.functions";
import { listServices } from "@/lib/crm/services-admin.functions";
import {
  FULFILLMENT_LABEL, type FulfillmentStatus,
} from "@/lib/crm/fulfillment-transitions";
import { STAGE_META, type OrderStage } from "@/lib/crm/computeOrderStage";

import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useRole } from "@/hooks/useRole";

export const Route = createFileRoute("/admin/orders/")({
  head: () => ({ meta: [{ title: "Orders — Udyam Ops OS" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: OrdersListPage,
});

type Bucket = "all" | "needs_action" | "pending" | "completed" | "exception";

const NEEDS_ACTION_STAGES: OrderStage[] = ["lead_received", "payment_done", "form_submitted"];
const COMPLETED_STAGES: OrderStage[] = ["completed"];
const EXCEPTION_STAGES: OrderStage[] = ["refund_requested", "refunded", "uninterested"];
// Pending = anything not completed and not a terminal exception (closed / refunded / uninterested).
function isPending(stage: OrderStage): boolean {
  return !COMPLETED_STAGES.includes(stage) && !EXCEPTION_STAGES.includes(stage);
}

function bucketOf(stage: OrderStage): Exclude<Bucket, "all"> {
  if (COMPLETED_STAGES.includes(stage)) return "completed";
  if (EXCEPTION_STAGES.includes(stage)) return "exception";
  if (NEEDS_ACTION_STAGES.includes(stage)) return "needs_action";
  return "pending";
}

const BUCKETS: { id: Bucket; label: string }[] = [
  { id: "all",          label: "All" },
  { id: "needs_action", label: "Needs Action" },
  { id: "pending",      label: "Pending" },
  { id: "completed",    label: "Completed" },
  { id: "exception",    label: "Exception" },
];

type PendingAge = "any" | "1" | "2" | "3" | "7" | "custom";
const PENDING_AGE_OPTIONS: { id: PendingAge; label: string }[] = [
  { id: "any",    label: "Any age" },
  { id: "1",      label: "1 day+ pending" },
  { id: "2",      label: "2 days+ pending" },
  { id: "3",      label: "3 days+ pending" },
  { id: "7",      label: "7 days+ pending" },
  { id: "custom", label: "Custom days…" },
];

function daysSince(iso: string | null | undefined): number {
  if (!iso) return 0;
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return 0;
  return Math.max(0, Math.floor((Date.now() - t) / 86_400_000));
}

const PAYMENT_TONE: Record<string, string> = {
  Paid:             "bg-slate-100 text-slate-700",
  "Partially Paid": "bg-amber-50 text-amber-700",
  Refunded:         "bg-rose-50 text-rose-700",
  Pending:          "bg-slate-100 text-slate-600",
  Failed:           "bg-rose-50 text-rose-700",
};

const FULFILL_TONE: Record<string, string> = {
  order_received:        "bg-slate-100 text-slate-700",
  documents_received:    "bg-slate-100 text-slate-700",
  verification_pending:  "bg-amber-50 text-amber-700",
  application_submitted: "bg-sky-50 text-sky-700",
  under_processing:      "bg-indigo-50 text-indigo-700",
  completed:             "bg-emerald-50 text-emerald-700",
  cancelled:             "bg-rose-50 text-rose-700",
};

function OrdersListPage() {
  const listFn = useServerFn(listOrdersV2);
  const staffFn = useServerFn(listStaff);
  const svcFn = useServerFn(listServices);
  const role = useRole();
  const hideMoney = role.hideMoney();

  const [search, setSearch] = useState("");
  const [fulfillmentStatus, setFulfillmentStatus] = useState<string>("all");
  const [serviceId, setServiceId] = useState<string>("all");
  const [assignedTo, setAssignedTo] = useState<string>("all");
  const [paymentStatus, setPaymentStatus] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [bucket, setBucket] = useState<Bucket>("all");
  const [pendingAge, setPendingAge] = useState<PendingAge>("any");
  const [customDays, setCustomDays] = useState<string>("");
  const [page, setPage] = useState(1);
  const pageSize = 100;

  const { data: staffData } = useQuery({ queryKey: ["admin.staff"], queryFn: () => staffFn() });
  const { data: svcData } = useQuery({ queryKey: ["admin.services.list"], queryFn: () => svcFn() });

  const { data, isLoading } = useQuery({
    queryKey: ["admin.orders.v2", page, search, fulfillmentStatus, serviceId, assignedTo, paymentStatus, dateFrom, dateTo],
    queryFn: () => listFn({
      data: {
        page, pageSize,
        fulfillmentStatus: fulfillmentStatus === "all" ? undefined : fulfillmentStatus,
        serviceId: serviceId === "all" ? undefined : serviceId,
        assignedTo: assignedTo === "all" ? undefined : assignedTo,
        paymentStatus: paymentStatus === "all" ? undefined : paymentStatus,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        search: search || undefined,
      },
    }),
  });

  const allRows = (data?.rows ?? []) as any[];

  // Compute pending-age threshold in days from filter selection.
  const minDays: number | null = useMemo(() => {
    if (pendingAge === "any") return null;
    if (pendingAge === "custom") {
      const n = parseInt(customDays, 10);
      return Number.isFinite(n) && n > 0 ? n : null;
    }
    return parseInt(pendingAge, 10);
  }, [pendingAge, customDays]);

  // Age filter applies to pending rows only (rows that are not completed/exception).
  const ageFiltered = useMemo(() => {
    if (minDays == null) return allRows;
    return allRows.filter((r) => {
      if (!isPending(r.stage as OrderStage)) return true; // don't hide completed/exception here
      return daysSince(r.created_at) >= minDays;
    });
  }, [allRows, minDays]);

  const counts = useMemo(() => {
    const c: Record<Bucket, number> = { all: ageFiltered.length, needs_action: 0, pending: 0, completed: 0, exception: 0 };
    for (const r of ageFiltered) c[bucketOf(r.stage as OrderStage)]++;
    return c;
  }, [ageFiltered]);

  // Ageing histogram — shown when Pending bucket is active.
  const ageBuckets = useMemo(() => {
    const b = { d1: 0, d2: 0, d3: 0, d7: 0, older: 0 };
    for (const r of ageFiltered) {
      if (!isPending(r.stage as OrderStage)) continue;
      const d = daysSince(r.created_at);
      if (d >= 7) b.older++;
      else if (d >= 3) b.d7++;
      else if (d >= 2) b.d3++;
      else if (d >= 1) b.d2++;
      else b.d1++;
    }
    return b;
  }, [ageFiltered]);

  const rows = bucket === "all" ? ageFiltered : ageFiltered.filter((r) => bucketOf(r.stage as OrderStage) === bucket);
  const total = data?.total ?? 0;

  // Group by day
  const groups = useMemo(() => {
    const g = new Map<string, any[]>();
    for (const r of rows) {
      const d = new Date(r.created_at);
      const key = d.toDateString();
      const arr = g.get(key) ?? [];
      arr.push(r);
      g.set(key, arr);
    }
    return Array.from(g.entries());
  }, [rows]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Orders</h1>
        <p className="text-xs text-slate-500 mt-1">
          {total.toLocaleString("en-IN")} total · payment-successful customers only · times in IST
        </p>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
          <Input
            placeholder="Search order #, customer, mobile, lead code…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm bg-white"
          />
        </div>
        <Select value={fulfillmentStatus} onValueChange={setFulfillmentStatus}>
          <SelectTrigger className="h-9 w-[160px] text-sm bg-white"><SelectValue placeholder="All fulfillment" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All fulfillment</SelectItem>
            {Object.entries(FULFILLMENT_LABEL).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={serviceId} onValueChange={setServiceId}>
          <SelectTrigger className="h-9 w-[160px] text-sm bg-white"><SelectValue placeholder="All services" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All services</SelectItem>
            {(svcData?.rows ?? []).map((s: any) => (
              <SelectItem key={s.id} value={s.id}>{s.service_name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={assignedTo} onValueChange={setAssignedTo}>
          <SelectTrigger className="h-9 w-[160px] text-sm bg-white"><SelectValue placeholder="All assignees" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All assignees</SelectItem>
            {(staffData?.profiles ?? []).map((s: any) => (
              <SelectItem key={s.id} value={s.id}>{s.display_name || s.email}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={paymentStatus} onValueChange={setPaymentStatus}>
          <SelectTrigger className="h-9 w-[140px] text-sm bg-white"><SelectValue placeholder="All payment" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All payment</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Partially Paid">Partially paid</SelectItem>
            <SelectItem value="Refunded">Refunded</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="h-9 w-[160px] text-sm bg-white"
        />
        <Input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="h-9 w-[160px] text-sm bg-white"
        />
        <Select value={pendingAge} onValueChange={(v) => setPendingAge(v as PendingAge)}>
          <SelectTrigger className="h-9 w-[170px] text-sm bg-white">
            <SelectValue placeholder="Pending age" />
          </SelectTrigger>
          <SelectContent>
            {PENDING_AGE_OPTIONS.map((o) => (
              <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {pendingAge === "custom" && (
          <Input
            type="number"
            min={1}
            value={customDays}
            onChange={(e) => setCustomDays(e.target.value)}
            placeholder="Days"
            className="h-9 w-[90px] text-sm bg-white"
          />
        )}
      </div>

      {/* Pending ageing summary — shown when Pending bucket active or an age filter is applied */}
      {(bucket === "pending" || minDays != null) && (
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-amber-200 bg-amber-50/60 px-3 py-2 text-[11px] text-amber-900">
          <span className="font-semibold uppercase tracking-wider text-[10px] text-amber-700">Pending ageing</span>
          <AgeChip label="< 1d" n={ageBuckets.d1} />
          <AgeChip label="1d+"  n={ageBuckets.d2} />
          <AgeChip label="2d+"  n={ageBuckets.d3} />
          <AgeChip label="3d+"  n={ageBuckets.d7} />
          <AgeChip label="7d+"  n={ageBuckets.older} tone="rose" />
        </div>
      )}

      {/* Bucket chips */}
      <div className="flex flex-wrap gap-2">
        {BUCKETS.map((b) => {
          const active = bucket === b.id;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => setBucket(b.id)}
              className={`inline-flex items-center gap-2 h-8 px-3 rounded-full text-xs font-medium transition-colors border ${
                active
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span>{b.label}</span>
              <span className={`text-[10px] font-semibold ${active ? "text-slate-300" : "text-slate-500"}`}>
                {counts[b.id]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Pagination — top */}
      {total > pageSize && (
        <div className="flex items-center justify-between px-3 py-2 rounded-md border border-slate-200 bg-white text-xs text-slate-600">
          <div>
            Page {page} of {Math.max(1, Math.ceil(total / pageSize))} · {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total.toLocaleString("en-IN")}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isLoading}
              className="inline-flex items-center gap-1 h-7 px-2 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="size-3.5" /> Prev
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => (p * pageSize < total ? p + 1 : p))}
              disabled={page * pageSize >= total || isLoading}
              className="inline-flex items-center gap-1 h-7 px-2 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-slate-200 bg-white">
        <ScrollableTable>
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-slate-500 bg-slate-50">
                <th className="text-left font-medium px-2 py-2.5">Order #</th>
                <th className="text-left font-medium px-2 py-2.5">Customer</th>
                <th className="text-left font-medium px-2 py-2.5">Service</th>
                <th className="text-left font-medium px-2 py-2.5">Stage</th>
                <th className="text-left font-medium px-2 py-2.5">Fulfillment</th>
                <th className="text-left font-medium px-2 py-2.5">Assigned</th>
                <th className="text-right font-medium px-2 py-2.5">Amount</th>
                <th className="text-left font-medium px-2 py-2.5">Created</th>
                <th className="px-2 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={9} className="px-4 py-10 text-center text-slate-500">Loading orders…</td></tr>
              )}
              {!isLoading && rows.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-10 text-center text-slate-500">No orders in this view.</td></tr>
              )}
              {!isLoading && groups.map(([day, items]) => (
                <>
                  <tr key={`h-${day}`} className="bg-slate-900 text-white">
                    <td colSpan={9} className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider">
                      {formatDayHeader(day)}
                    </td>
                  </tr>
                  {items.map((r) => <OrderRow key={r.id} order={r} hideMoney={hideMoney} />)}
                </>
              ))}
            </tbody>
          </table>
        </ScrollableTable>
      </div>
    </div>
  );
}

function formatDayHeader(day: string): string {
  const d = new Date(day);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const yest = new Date(today); yest.setDate(today.getDate() - 1);
  const target = new Date(d); target.setHours(0, 0, 0, 0);
  const base = d.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
  if (target.getTime() === today.getTime()) return `${base} · TODAY`;
  if (target.getTime() === yest.getTime()) return `${base} · YESTERDAY`;
  return base;
}

function OrderRow({ order, hideMoney }: { order: any; hideMoney: boolean }) {
  const stage: OrderStage = order.stage;
  const meta = STAGE_META[stage];
  const fs = (order.fulfillment_status ?? "order_received") as FulfillmentStatus;
  const payTone = PAYMENT_TONE[order.payment_status] ?? "bg-slate-100 text-slate-700";
  const fulTone = FULFILL_TONE[fs] ?? "bg-slate-100 text-slate-700";
  const stageToneMap: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-700",
    amber:   "bg-amber-50 text-amber-700",
    rose:    "bg-rose-50 text-rose-700",
    slate:   "bg-slate-100 text-slate-700",
    blue:    "bg-sky-50 text-sky-700",
    indigo:  "bg-indigo-50 text-indigo-700",
    violet:  "bg-violet-50 text-violet-700",
  };
  const stageTone = stageToneMap[meta?.tone ?? "emerald"] ?? "bg-emerald-50 text-emerald-700";

  return (
    <tr className="border-t border-slate-100 hover:bg-slate-50/60">
      <td className="px-2 py-2.5 font-mono text-[12px] text-slate-600 whitespace-nowrap">{order.application_code}</td>
      <td className="px-2 py-2.5 min-w-[160px]">
        <div className="font-medium text-slate-900 leading-tight text-[13px]">{order.customer_name ?? "—"}</div>
        {order.customer_mobile && (
          <div className="text-[11px] text-slate-500 mt-0.5">{order.customer_mobile}</div>
        )}
      </td>
      <td className="px-2 py-2.5 text-slate-700 whitespace-nowrap text-[13px]">{order.service_name ?? "—"}</td>
      <td className="px-2 py-2.5 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${stageTone}`}>
            {meta?.label ?? stage}
          </span>
          {isPending(stage) && (() => {
            const d = daysSince(order.created_at);
            if (d < 1) return null;
            const tone = d >= 7 ? "bg-rose-50 text-rose-700 border-rose-200"
              : d >= 3 ? "bg-amber-50 text-amber-800 border-amber-200"
              : "bg-slate-100 text-slate-600 border-slate-200";
            return (
              <span
                title={`Pending for ${d} day${d === 1 ? "" : "s"} (since order created)`}
                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${tone}`}
              >
                {d}d
              </span>
            );
          })()}
        </div>
      </td>
      <td className="px-2 py-2.5 whitespace-nowrap">
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${fulTone}`}>
          {FULFILLMENT_LABEL[fs]}
        </span>
      </td>
      <td className="px-2 py-2.5 text-slate-600 whitespace-nowrap text-[12px]">{order.assigned_name ?? "Unassigned"}</td>
      <td className="px-2 py-2.5 text-right font-semibold text-slate-900 whitespace-nowrap text-[13px]">
        {hideMoney ? "—" : `₹${Number(order.total_amount ?? 0).toLocaleString("en-IN")}`}
      </td>
      <td className="px-2 py-2.5 text-[11px] text-slate-600 whitespace-nowrap leading-tight">
        <div>{formatIST(order.created_at, { dateOnly: true })}</div>
        <div className="text-slate-400">{formatIST(order.created_at, { timeOnly: true })} IST</div>
      </td>
      <td className="px-2 py-2.5 whitespace-nowrap text-right">
        <Link
          to="/admin/orders/$orderId"
          params={{ orderId: order.id }}
          className="inline-flex items-center gap-1 text-xs font-medium text-sky-700 hover:text-sky-800"
        >
          <Eye className="size-3.5" /> View
        </Link>
      </td>
    </tr>
  );
}

function ScrollableTable({ children }: { children: React.ReactNode }) {
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = bottomRef.current;
    if (!el) return;
    const measure = () => {
      const t = el.querySelector("table");
      setWidth(t ? t.scrollWidth : 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (el.querySelector("table")) ro.observe(el.querySelector("table")!);
    return () => ro.disconnect();
  }, [children]);

  const syncTop = () => {
    if (topRef.current && bottomRef.current) bottomRef.current.scrollLeft = topRef.current.scrollLeft;
  };
  const syncBottom = () => {
    if (topRef.current && bottomRef.current) topRef.current.scrollLeft = bottomRef.current.scrollLeft;
  };

  return (
    <>
      <div
        ref={topRef}
        onScroll={syncTop}
        className="overflow-x-auto overflow-y-hidden border-b border-slate-200 bg-slate-50/60"
        style={{ height: 12 }}
      >
        <div style={{ width, height: 1 }} />
      </div>
      <div ref={bottomRef} onScroll={syncBottom} className="overflow-x-auto">
        {children}
      </div>
    </>
  );
}

function paymentLabel(s: string): string {
  switch (s) {
    case "paid": return "Paid";
    case "partially_paid": return "Partially Paid";
    case "refunded": return "Refunded";
    case "unpaid": return "Unpaid";
    default: return s || "—";
  }
}

function AgeChip({ label, n, tone = "amber" }: { label: string; n: number; tone?: "amber" | "rose" }) {
  const cls = tone === "rose"
    ? "bg-rose-100 text-rose-800 border-rose-200"
    : "bg-white text-amber-900 border-amber-200";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-medium ${cls}`}>
      <span className="text-[10px] uppercase tracking-wider opacity-70">{label}</span>
      <span className="font-semibold">{n}</span>
    </span>
  );
}
