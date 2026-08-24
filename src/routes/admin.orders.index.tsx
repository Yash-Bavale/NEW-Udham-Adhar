import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Search, ChevronLeft, ChevronRight, RotateCcw, X, Filter, Loader2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { formatIST } from "@/lib/datetime";

import { listOrdersV2 } from "@/lib/crm/orders-v2.functions";
import { listStaff } from "@/lib/crm/leads-admin.functions";
import { listServices } from "@/lib/crm/services-admin.functions";
import { STAGE_META, type OrderStage } from "@/lib/crm/computeOrderStage";

import { Input } from "@/components/ui/input";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useRole } from "@/hooks/useRole";
import { useRealtimeTable } from "@/hooks/useRealtimeTable";
import { usePreserveScroll, saveModuleFilterState, getModuleFilterState, clearModuleFilterState } from "@/hooks/usePreserveScroll";

export const Route = createFileRoute("/admin/orders/")({
  head: () => ({ meta: [{ title: "Orders — Udyam Ops OS" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: OrdersListPage,
});

type Bucket = "all" | "needs_action" | "pending" | "completed" | "closed" | "exception";

const CLOSED_FS = new Set<string>([
  "application_rejected", "certificate_rejected", "order_closed", "cancelled",
]);
const COMPLETED_FS = new Set<string>([
  "consultation_completed", "order_completed", "completed",
]);
const EXCEPTION_STAGES: OrderStage[] = ["refund_requested", "refunded", "uninterested"];
const NEEDS_ACTION_STAGES: OrderStage[] = ["lead_received", "payment_done", "form_submitted"];

function bucketOfRow(row: { fulfillment_status?: string | null; stage: OrderStage }): Exclude<Bucket, "all"> {
  const fs = row.fulfillment_status ?? "";
  if (CLOSED_FS.has(fs) || row.stage === "closed") return "closed";
  if (COMPLETED_FS.has(fs) || row.stage === "completed") return "completed";
  if (EXCEPTION_STAGES.includes(row.stage)) return "exception";
  if (NEEDS_ACTION_STAGES.includes(row.stage)) return "needs_action";
  return "pending";
}

function isPendingRow(row: { fulfillment_status?: string | null; stage: OrderStage }): boolean {
  const b = bucketOfRow(row);
  return b === "pending" || b === "needs_action";
}

const BUCKETS: { id: Bucket; label: string }[] = [
  { id: "all",          label: "All" },
  { id: "needs_action", label: "Needs Action" },
  { id: "pending",      label: "Pending" },
  { id: "completed",    label: "Completed" },
  { id: "closed",       label: "Closed" },
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

function OrdersListPage() {
  const listFn = useServerFn(listOrdersV2);
  const staffFn = useServerFn(listStaff);
  const svcFn = useServerFn(listServices);
  const role = useRole();
  const hideMoney = role.hideMoney();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const savedState = useMemo(() => getModuleFilterState("admin.orders"), []);

  const [search, setSearch] = useState<string>(savedState?.search ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState<string>(savedState?.debouncedSearch ?? "");
  const [fulfillmentStatus, setFulfillmentStatus] = useState<string>(savedState?.fulfillmentStatus ?? "all");
  const [serviceId, setServiceId] = useState<string>(savedState?.serviceId ?? "all");
  const [assignedTo, setAssignedTo] = useState<string>(savedState?.assignedTo ?? "all");
  const [paymentStatus, setPaymentStatus] = useState<string>(savedState?.paymentStatus ?? "all");
  const [actionStatusFilter, setActionStatusFilter] = useState<string>(savedState?.actionStatusFilter ?? "all");
  const [dateFrom, setDateFrom] = useState<string>(savedState?.dateFrom ?? "");
  const [dateTo, setDateTo] = useState<string>(savedState?.dateTo ?? "");
  const [bucket, setBucket] = useState<Bucket>(savedState?.bucket ?? "all");
  const [pendingAge, setPendingAge] = useState<PendingAge>(savedState?.pendingAge ?? "any");
  const [customDays, setCustomDays] = useState<string>(savedState?.customDays ?? "");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(savedState?.sortOrder ?? "desc");
  const [page, setPage] = useState<number>(savedState?.page ?? 1);
  const pageSize = 50;
  const isInitialMount = useRef(true);

  // Persist state across navigation
  useEffect(() => {
    saveModuleFilterState("admin.orders", {
      search, debouncedSearch, fulfillmentStatus, serviceId, assignedTo,
      paymentStatus, actionStatusFilter, dateFrom, dateTo, bucket, pendingAge,
      customDays, sortOrder, page,
    });
  }, [search, debouncedSearch, fulfillmentStatus, serviceId, assignedTo, paymentStatus, actionStatusFilter, dateFrom, dateTo, bucket, pendingAge, customDays, sortOrder, page]);

  // Debounce search input by 350ms
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  // Reset page to 1 whenever filters change (skip on initial mount to preserve Page 2/3 when returning via Back button)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setPage(1);
  }, [fulfillmentStatus, serviceId, assignedTo, paymentStatus, actionStatusFilter, dateFrom, dateTo, bucket, pendingAge, customDays]);

  // Listener to reset all filters when clicking "Orders" in leftbar
  useEffect(() => {
    const handleReset = () => {
      clearModuleFilterState("admin.orders");
      setSearch("");
      setDebouncedSearch("");
      setFulfillmentStatus("all");
      setServiceId("all");
      setAssignedTo("all");
      setPaymentStatus("all");
      setActionStatusFilter("all");
      setDateFrom("");
      setDateTo("");
      setBucket("all");
      setPendingAge("any");
      setCustomDays("");
      setSortOrder("desc");
      setPage(1);
      const container = document.getElementById("admin-main-scroll");
      if (container) container.scrollTop = 0;
    };

    window.addEventListener("reset-orders-filters", handleReset);
    return () => window.removeEventListener("reset-orders-filters", handleReset);
  }, []);

  // Hydrate filters from URL query params (deep-links from dashboard KPIs).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const flt = sp.get("filter");
    if (!flt) return;
    switch (flt) {
      case "pending": setBucket("pending"); break;
      case "closed": setBucket("closed"); break;
      case "completed": setBucket("completed"); break;
      case "delayed_3d": setBucket("pending"); setPendingAge("3"); break;
      case "delayed_7d": setBucket("pending"); setPendingAge("7"); break;
      case "not_contacted": setBucket("needs_action"); break;
      case "not_contacted_5h": setBucket("needs_action"); break;
      case "technical_delay": setFulfillmentStatus("technical_delay"); break;
      case "customer_delay": setFulfillmentStatus("customer_delay"); break;
      case "form_not_submitted": setFulfillmentStatus("form_pending"); break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: staffData } = useQuery({ queryKey: ["admin.staff"], queryFn: () => staffFn() });
  const { data: svcData } = useQuery({ queryKey: ["admin.services.list"], queryFn: () => svcFn() });

  const queryPayload = useMemo(() => ({
    page, pageSize,
    fulfillmentStatus: fulfillmentStatus === "all" ? undefined : fulfillmentStatus,
    serviceId: serviceId === "all" ? undefined : serviceId,
    assignedTo: assignedTo === "all" ? undefined : assignedTo,
    paymentStatus: paymentStatus === "all" ? undefined : paymentStatus,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    search: debouncedSearch || undefined,
    sortOrder,
  }), [page, pageSize, fulfillmentStatus, serviceId, assignedTo, paymentStatus, dateFrom, dateTo, debouncedSearch, sortOrder]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["admin.orders.v2", page, debouncedSearch, fulfillmentStatus, serviceId, assignedTo, paymentStatus, dateFrom, dateTo, sortOrder],
    queryFn: () => listFn({ data: queryPayload }),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const allRows = (data?.rows ?? []) as any[];

  // Preserve scroll position when navigating back from order detail view
  usePreserveScroll("admin.orders", !isLoading);

  // Real-time subscription to auto-refresh order cache silently when new orders/payments arrive
  useRealtimeTable("applications", () => {
    qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
  });
  useRealtimeTable("payments", () => {
    qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
  });

  // Background prefetch for next page
  useEffect(() => {
    const totalPages = Math.ceil((data?.total ?? 0) / pageSize);
    if (page < totalPages) {
      const nextPagePayload = { ...queryPayload, page: page + 1 };
      qc.prefetchQuery({
        queryKey: ["admin.orders.v2", page + 1, debouncedSearch, fulfillmentStatus, serviceId, assignedTo, paymentStatus, dateFrom, dateTo],
        queryFn: () => listFn({ data: nextPagePayload }),
        staleTime: 30 * 1000,
      });
    }
  }, [page, data?.total, queryPayload, debouncedSearch, fulfillmentStatus, serviceId, assignedTo, paymentStatus, dateFrom, dateTo, qc, listFn, pageSize]);



  const isAdmin = role.hasAny(["admin", "super_admin"]);
  // Base columns (Order #, Created, Customer, Service, Action Status, Stage) = 6
  // Plus Amount (1) and Assigned (1) = 8 total columns
  const colCount = 6 + (isAdmin ? 1 : 0) + (hideMoney ? 0 : 1);

  // Compute pending-age threshold in days from filter selection.
  const minDays: number | null = useMemo(() => {
    if (pendingAge === "any") return null;
    if (pendingAge === "custom") {
      const n = parseInt(customDays, 10);
      return Number.isFinite(n) && n > 0 ? n : null;
    }
    return parseInt(pendingAge, 10);
  }, [pendingAge, customDays]);

  const ageFiltered = useMemo(() => {
    if (minDays == null) return allRows;
    return allRows.filter((r) => {
      if (!isPendingRow(r)) return true;
      return daysSince(r.created_at) >= minDays;
    });
  }, [allRows, minDays]);

  const counts = useMemo(() => {
    const c: Record<Bucket, number> = { all: ageFiltered.length, needs_action: 0, pending: 0, completed: 0, closed: 0, exception: 0 };
    for (const r of ageFiltered) c[bucketOfRow(r)]++;
    return c;
  }, [ageFiltered]);

  const ageBuckets = useMemo(() => {
    const b = { d1: 0, d2: 0, d3: 0, d7: 0, older: 0 };
    for (const r of ageFiltered) {
      if (!isPendingRow(r)) continue;
      const d = daysSince(r.created_at);
      if (d >= 7) b.older++;
      else if (d >= 3) b.d7++;
      else if (d >= 2) b.d3++;
      else if (d >= 1) b.d2++;
      else b.d1++;
    }
    return b;
  }, [ageFiltered]);

  const bucketRows = bucket === "all" ? ageFiltered : ageFiltered.filter((r) => bucketOfRow(r) === bucket);

  const rows = useMemo(() => {
    if (actionStatusFilter === "all") return bucketRows;
    return bucketRows.filter((r) => {
      const st = getOrderActionStatus(r);
      if (actionStatusFilter === "action_required") return st.tone === "red";
      if (actionStatusFilter === "processed") return st.tone === "green" || st.tone === "blue";
      return true;
    });
  }, [bucketRows, actionStatusFilter]);

  const total = data?.total ?? 0;

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

  const isFilterActive =
    search !== "" ||
    fulfillmentStatus !== "all" ||
    serviceId !== "all" ||
    assignedTo !== "all" ||
    paymentStatus !== "all" ||
    actionStatusFilter !== "all" ||
    dateFrom !== "" ||
    dateTo !== "" ||
    pendingAge !== "any" ||
    bucket !== "all";

  const resetFilters = () => {
    setSearch("");
    setFulfillmentStatus("all");
    setServiceId("all");
    setAssignedTo("all");
    setPaymentStatus("all");
    setActionStatusFilter("all");
    setDateFrom("");
    setDateTo("");
    setPendingAge("any");
    setCustomDays("");
    setBucket("all");
  };

  return (
    <div className="w-full space-y-4">
      {/* Header & Reset Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Orders</h1>
            {isFetching && !isLoading && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full animate-pulse">
                <Loader2 className="size-3 animate-spin text-indigo-600" /> Updating…
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {total.toLocaleString("en-IN")} total · payment-successful customers only · times in IST
          </p>
        </div>
        {isFilterActive && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
          >
            <RotateCcw className="size-3.5" /> Reset Filters
          </button>
        )}
      </div>

      {/* Modern Filter Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs space-y-3">
        <div className="flex flex-wrap gap-2.5 items-center">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
            <Input
              placeholder="Search order #, customer, mobile, lead code…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-8 h-9 text-xs bg-slate-50/50 border-slate-200 focus:bg-white transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Action Status Filter */}
          <Select value={actionStatusFilter} onValueChange={setActionStatusFilter}>
            <SelectTrigger className="h-9 w-[150px] text-xs bg-slate-50/50 border-slate-200"><SelectValue placeholder="Action Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Action Status</SelectItem>
              <SelectItem value="action_required">Action Required (Red)</SelectItem>
              <SelectItem value="processed">Completed / Action Taken</SelectItem>
            </SelectContent>
          </Select>

          {/* Services Filter */}
          <Select value={serviceId} onValueChange={setServiceId}>
            <SelectTrigger className="h-9 w-[160px] text-xs bg-slate-50/50 border-slate-200"><SelectValue placeholder="All services" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All services</SelectItem>
              {(svcData?.rows ?? []).map((s: any) => (
                <SelectItem key={s.id} value={s.id}>{s.service_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Assignees Filter (Admin only) */}
          {role.hasAny(["admin", "super_admin"]) && (
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger className="h-9 w-[150px] text-xs bg-slate-50/50 border-slate-200"><SelectValue placeholder="All assignees" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All assignees</SelectItem>
                {(staffData?.profiles ?? []).map((s: any) => (
                  <SelectItem key={s.id} value={s.id}>{s.display_name || s.email}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Payment Status Filter */}
          <Select value={paymentStatus} onValueChange={setPaymentStatus}>
            <SelectTrigger className="h-9 w-[130px] text-xs bg-slate-50/50 border-slate-200"><SelectValue placeholder="All payment" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All payment</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Partially Paid">Partially paid</SelectItem>
              <SelectItem value="Refunded">Refunded</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          <DateRangePicker
            value={{
              from: dateFrom ? new Date(dateFrom) : undefined,
              to: dateTo ? new Date(dateTo) : undefined,
            }}
            onChange={(range) => {
              setDateFrom(range.from ? range.from.toISOString().slice(0, 10) : "");
              setDateTo(range.to ? range.to.toISOString().slice(0, 10) : "");
            }}
          />

          {/* Pending Age */}
          <Select value={pendingAge} onValueChange={(v) => setPendingAge(v as PendingAge)}>
            <SelectTrigger className="h-9 w-[140px] text-xs bg-slate-50/50 border-slate-200">
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
              className="h-9 w-[80px] text-xs bg-slate-50/50 border-slate-200"
            />
          {/* Sort Order */}
          <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as "asc" | "desc")}>
            <SelectTrigger className="h-9 w-[145px] text-xs bg-slate-50/50 border-slate-200">
              <ArrowUpDown className="w-3.5 h-3.5 mr-1 text-slate-500 shrink-0" />
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Latest First (Newest)</SelectItem>
              <SelectItem value="asc">Older First (Oldest)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pending ageing summary */}
      {(bucket === "pending" || minDays != null) && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/60 px-3.5 py-2 text-[11px] text-amber-900 shadow-xs">
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
              className={`inline-flex items-center gap-2 h-8 px-3.5 rounded-full text-xs font-medium transition-all border shadow-xs ${
                active
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <span>{b.label}</span>
              <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${active ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600"}`}>
                {counts[b.id]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <ScrollableTable>
          <table className="w-full text-sm min-w-[950px]">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-200">
                <th className="text-left font-semibold px-3 py-2.5">Order #</th>
                <th
                  onClick={() => setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))}
                  className="text-left font-semibold px-3 py-2.5 cursor-pointer hover:bg-slate-100/80 transition-colors select-none group"
                  title="Click to toggle sorting (Latest vs Older orders)"
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Created</span>
                    {sortOrder === "desc" ? (
                      <ArrowDown className="w-3 h-3 text-indigo-600" />
                    ) : (
                      <ArrowUp className="w-3 h-3 text-indigo-600" />
                    )}
                  </div>
                </th>
                <th className="text-left font-semibold px-3 py-2.5">Customer</th>
                <th className="text-left font-semibold px-3 py-2.5">Service</th>
                <th className="text-left font-semibold px-3 py-2.5">Action Status</th>
                <th className="text-left font-semibold px-3 py-2.5">Stage</th>
                {!hideMoney && <th className="text-right font-semibold px-3 py-2.5">Amount</th>}
                {isAdmin && <th className="text-left font-semibold px-3 py-2.5">Assigned</th>}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={colCount} className="px-4 py-12 text-center text-slate-500">Loading orders…</td></tr>
              )}
              {!isLoading && rows.length === 0 && (
                <tr><td colSpan={colCount} className="px-4 py-12 text-center text-slate-500">No orders in this view.</td></tr>
              )}
              {!isLoading && groups.map(([day, items]) => (
                <Fragment key={`g-${day}`}>
                  <tr className="bg-slate-900 text-white border-b border-slate-800">
                    <td colSpan={colCount} className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider">
                      {formatDayHeader(day)}
                    </td>
                  </tr>
                  {items.map((r) => (
                    <OrderRow key={r.id} order={r} hideMoney={hideMoney} isAdmin={isAdmin} onOpen={(id) => navigate({ to: "/admin/orders/$orderId", params: { orderId: id } })} />
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </ScrollableTable>
      </div>

      {/* Mobile Touch-Friendly Card View */}
      <div className="block md:hidden space-y-4">
        {isLoading && (
          <div className="p-8 text-center text-sm text-slate-500 bg-white rounded-xl border border-slate-200">
            Loading orders…
          </div>
        )}
        {!isLoading && rows.length === 0 && (
          <div className="p-8 text-center text-sm text-slate-500 bg-white rounded-xl border border-slate-200">
            No orders match the selected filters.
          </div>
        )}
        {!isLoading && groups.map(([day, items]) => (
          <div key={`m-g-${day}`} className="space-y-2">
            <div className="sticky top-0 z-10 bg-slate-900 text-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider rounded-lg shadow-xs">
              {formatDayHeader(day)}
            </div>
            <div className="space-y-2.5">
              {items.map((r) => (
                <OrderCardMobile key={r.id} order={r} hideMoney={hideMoney} isAdmin={isAdmin} onOpen={(id) => navigate({ to: "/admin/orders/$orderId", params: { orderId: id } })} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination bar (Bottom) */}
      {total > pageSize && (
        <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-600 shadow-xs mt-2">
          <div>
            Page {page} of {Math.max(1, Math.ceil(total / pageSize))} · {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total.toLocaleString("en-IN")}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isLoading}
              className="inline-flex items-center gap-1 h-7 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
            >
              <ChevronLeft className="size-3.5" /> Prev
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => (p * pageSize < total ? p + 1 : p))}
              disabled={page * pageSize >= total || isLoading}
              className="inline-flex items-center gap-1 h-7 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
            >
              Next <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderCardMobile({ order, hideMoney, isAdmin, onOpen }: { order: any; hideMoney: boolean; isAdmin: boolean; onOpen: (id: string) => void }) {
  const stage: OrderStage = order.stage;
  const meta = STAGE_META[stage];
  const actionStatus = getOrderActionStatus(order);

  const stageToneMap: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber:   "bg-amber-50 text-amber-700 border-amber-200",
    rose:    "bg-rose-50 text-rose-700 border-rose-200",
    slate:   "bg-slate-100 text-slate-700 border-slate-200",
    blue:    "bg-sky-50 text-sky-700 border-sky-200",
    indigo:  "bg-indigo-50 text-indigo-700 border-indigo-200",
    violet:  "bg-violet-50 text-violet-700 border-violet-200",
  };
  const stageTone = stageToneMap[meta?.tone ?? "emerald"] ?? "bg-emerald-50 text-emerald-700 border-emerald-200";

  return (
    <div
      onClick={() => onOpen(order.id)}
      className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-2.5 active:bg-slate-50 cursor-pointer"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-slate-800">{order.application_code}</span>
          {(!order.fulfillment_status || order.fulfillment_status === "order_received") && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
              {formatOrderAge(Date.now() - new Date(order.created_at).getTime())}
            </span>
          )}
        </div>
        {!hideMoney && (
          <span className="font-semibold text-slate-900 text-sm">
            {`₹${Number(order.total_amount ?? 0).toLocaleString("en-IN")}`}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2">
        <div>
          <span className="font-medium text-slate-900">{order.customer_name ?? "—"}</span>
          {order.customer_mobile && <span className="ml-1.5 text-slate-500">({order.customer_mobile})</span>}
        </div>
        <div className="text-[11px] text-slate-400">
          {formatIST(order.created_at, { dateOnly: true })} {formatIST(order.created_at, { timeOnly: true })}
        </div>
      </div>

      <div className="text-xs text-slate-700 font-medium">
        {order.service_name ?? "—"}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          {actionStatus.tone === "red" && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              <span className="size-1.5 rounded-full bg-rose-600 animate-pulse" />
              {actionStatus.label}
            </span>
          )}
          {actionStatus.tone === "green" && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              {actionStatus.label}
            </span>
          )}
          {actionStatus.tone === "blue" && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-sky-50 text-sky-700 border border-sky-200">
              <span className="size-1.5 rounded-full bg-sky-500" />
              {actionStatus.label}
            </span>
          )}

          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${stageTone}`}>
            {meta?.label ?? stage}
          </span>
        </div>

        {isAdmin && (
          <span className="text-[11px] text-slate-500 font-medium">
            {order.assigned_name ? `Assigned: ${order.assigned_name}` : "Unassigned"}
          </span>
        )}
      </div>
    </div>
  );
}

function formatOrderAge(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return "just now";
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
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

export function getOrderActionStatus(order: any): { label: string; tone: "red" | "green" | "blue" } {
  const fs = order.fulfillment_status ?? "order_received";
  const stage = order.stage;

  // Closed states -> Subtle Green "Order Closed"
  if (fs === "order_closed" || fs === "cancelled" || stage === "closed") {
    return { label: "Order Closed", tone: "green" };
  }

  // Terminal / completed states -> Subtle Green "Completed"
  const greenStatuses = new Set([
    "application_approved",
    "consultation_completed",
    "order_completed",
    "completed",
  ]);

  if (greenStatuses.has(fs) || stage === "completed") {
    return { label: "Completed", tone: "green" };
  }

  // Action taken / in-progress states -> Subtle Blue "Action Taken"
  const blueStatuses = new Set([
    "government_processing",
    "technical_delay",
    "customer_delay",
    "application_rejected",
    "certificate_rejected",
    "under_processing",
    "application_submitted",
    "verification_pending",
    "documents_received",
    "waiting_for_customer_submission",
    "awaiting_customer_form",
    "form_link_sent",
    "form_pending",
  ]);

  const blueStages = new Set([
    "technical_delay",
    "customer_delay",
    "consultation_completed",
    "under_review",
    "in_progress",
    "submitted_to_govt",
    "under_processing",
    "certificate_ready",
    "refunded",
    "refund_requested",
  ]);

  if (blueStatuses.has(fs) || blueStages.has(stage) || Boolean((order as any).form_link_sent_at)) {
    return { label: "Action Taken", tone: "blue" };
  }

  // Untouched / initial unhandled states -> Red
  return { label: "Action Required", tone: "red" };
}

function OrderRow({ order, hideMoney, isAdmin, onOpen }: { order: any; hideMoney: boolean; isAdmin: boolean; onOpen: (id: string) => void }) {
  const stage: OrderStage = order.stage;
  const meta = STAGE_META[stage];
  
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
  const actionStatus = getOrderActionStatus(order);

  return (
    <tr
      className="border-t border-slate-100 hover:bg-slate-50/60 cursor-pointer"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("input,a,button,select,textarea,label,[data-no-row-click]")) return;
        const sel = typeof window !== "undefined" ? window.getSelection?.() : null;
        if (sel && sel.toString().trim().length > 0) return;
        onOpen(order.id);
      }}
    >
      {/* 1. Order # */}
      <td className="px-2 py-2.5 font-mono text-[12px] text-slate-600 whitespace-nowrap">{order.application_code}</td>

      {/* 2. Created */}
      <td className="px-2 py-2.5 text-[11px] text-slate-600 whitespace-nowrap leading-tight">
        <div className="flex items-center gap-1.5">
          <div>
            <div>{formatIST(order.created_at, { dateOnly: true })}</div>
            <div className="text-slate-400">{formatIST(order.created_at, { timeOnly: true })} IST</div>
          </div>
          {(!order.fulfillment_status || order.fulfillment_status === "order_received") && (
            <span
              className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200"
              title="Time since order created — clears once first action is taken"
            >
              {formatOrderAge(Date.now() - new Date(order.created_at).getTime())}
            </span>
          )}
        </div>
      </td>

      {/* 3. Customer */}
      <td className="px-2 py-2.5 min-w-[160px]">
        <div className="font-medium text-slate-900 leading-tight text-[13px]">{order.customer_name ?? "—"}</div>
        {order.customer_mobile && (
          <div className="text-[11px] text-slate-500 mt-0.5">{order.customer_mobile}</div>
        )}
      </td>

      {/* 4. Service */}
      <td className="px-2 py-2.5 text-slate-700 whitespace-nowrap text-[13px]">{order.service_name ?? "—"}</td>

      {/* 5. Action Status */}
      <td className="px-2 py-2.5 whitespace-nowrap">
        {actionStatus.tone === "red" && (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="size-1.5 rounded-full bg-rose-600 animate-pulse" />
            {actionStatus.label}
          </span>
        )}
        {actionStatus.tone === "green" && (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {actionStatus.label}
          </span>
        )}
        {actionStatus.tone === "blue" && (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-sky-50 text-sky-700 border border-sky-200">
            <span className="size-1.5 rounded-full bg-sky-500" />
            {actionStatus.label}
          </span>
        )}
      </td>

      {/* 6. Stage */}
      <td className="px-2 py-2.5 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${stageTone}`}>
            {meta?.label ?? stage}
          </span>
          {isPendingRow(order) && (() => {
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

      {/* 7. Amount */}
      {!hideMoney && (
        <td className="px-2 py-2.5 text-right font-semibold text-slate-900 whitespace-nowrap text-[13px]">
          {`₹${Number(order.total_amount ?? 0).toLocaleString("en-IN")}`}
        </td>
      )}

      {/* 8. Assigned */}
      {isAdmin && <td className="px-2 py-2.5 text-slate-600 whitespace-nowrap text-[12px]">{order.assigned_name ?? "Unassigned"}</td>}
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
