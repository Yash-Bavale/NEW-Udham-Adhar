import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { formatIST, istDateKey, istDayLabel } from "@/lib/datetime";

import { listOrdersV2 } from "@/lib/crm/orders-v2.functions";
import { listStaff } from "@/lib/crm/leads-admin.functions";
import { listServices } from "@/lib/crm/services-admin.functions";
import {
  FULFILLMENT_BADGE, FULFILLMENT_LABEL, FULFILLMENT_STAGES,
  type FulfillmentStatus,
} from "@/lib/crm/fulfillment-transitions";
import { LEAD_STATUS_BADGE, LEAD_STATUS_LABEL, type LeadStatusV2 } from "@/lib/crm/lead-transitions";
import { STAGE_META, STAGE_BADGE_CLASS, type OrderStage } from "@/lib/crm/computeOrderStage";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/hooks/useRole";

export const Route = createFileRoute("/admin/orders/")({ component: OrdersListPage });

const PAY_STATUSES = ["Pending", "Paid", "Partially Paid", "Refunded", "Failed"];

type StageBucket = "all" | "needs_action" | "active" | "completed" | "exception";
const NEEDS_ACTION: OrderStage[] = ["lead_received", "payment_pending", "payment_done", "form_submitted", "certificate_ready"];
const ACTIVE_STAGES: OrderStage[] = ["under_review", "in_progress", "submitted_to_govt", "under_processing"];
const EXCEPTION_STAGES: OrderStage[] = ["uninterested", "refund_requested", "refunded"];

function OrdersListPage() {
  const listFn = useServerFn(listOrdersV2);
  const staffFn = useServerFn(listStaff);
  const svcFn = useServerFn(listServices);
  const role = useRole();
  const hideMoney = role.hideMoney();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [fulfillmentStatus, setFulfillmentStatus] = useState<string>("");
  const [serviceId, setServiceId] = useState<string>("");
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [stageBucket, setStageBucket] = useState<StageBucket>("all");

  const { data: staffData } = useQuery({
    queryKey: ["admin.staff"],
    queryFn: () => staffFn(),
  });
  const { data: svcData } = useQuery({
    queryKey: ["admin.services.list"],
    queryFn: () => svcFn(),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin.orders.v2", page, search, fulfillmentStatus, serviceId, assignedTo, paymentStatus, dateFrom, dateTo],
    queryFn: () => listFn({
      data: {
        page, pageSize: 25,
        fulfillmentStatus: fulfillmentStatus || undefined,
        serviceId: serviceId || undefined,
        assignedTo: assignedTo || undefined,
        paymentStatus: paymentStatus || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        search: search || undefined,
      },
    }),
  });

  const allRows = data?.rows ?? [];
  const rows = stageBucket === "all"
    ? allRows
    : allRows.filter((r: any) => {
        const stage = r.stage as OrderStage;
        if (stageBucket === "needs_action") return NEEDS_ACTION.includes(stage);
        if (stageBucket === "active") return ACTIVE_STAGES.includes(stage);
        if (stageBucket === "completed") return stage === "completed";
        if (stageBucket === "exception") return EXCEPTION_STAGES.includes(stage);
        return true;
      });
  const total = data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / 25));

  const bucketCount = (b: StageBucket) => {
    if (b === "all") return allRows.length;
    return allRows.filter((r: any) => {
      const stage = r.stage as OrderStage;
      if (b === "needs_action") return NEEDS_ACTION.includes(stage);
      if (b === "active") return ACTIVE_STAGES.includes(stage);
      if (b === "completed") return stage === "completed";
      if (b === "exception") return EXCEPTION_STAGES.includes(stage);
      return false;
    }).length;
  };
  const BUCKETS: { id: StageBucket; label: string }[] = [
    { id: "all", label: "All" },
    { id: "needs_action", label: "Needs Action" },
    { id: "active", label: "Active" },
    { id: "completed", label: "Completed" },
    { id: "exception", label: "Exception" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
          <div className="text-xs text-slate-500 mt-0.5">{total.toLocaleString("en-IN")} total · payment-successful customers only · times in IST</div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-3 space-y-2" style={{ borderColor: "var(--admin-border)" }}>
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
            <Input
              placeholder="Search order #, customer, mobile, lead code…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-8 h-9 text-sm"
            />
          </div>
          <select value={fulfillmentStatus} onChange={(e) => { setFulfillmentStatus(e.target.value); setPage(1); }} className="rounded-md border px-2 py-1.5 text-sm bg-white">
            <option value="">All fulfillment</option>
            {FULFILLMENT_STAGES.concat(["cancelled" as any]).map((s) => (
              <option key={s} value={s}>{FULFILLMENT_LABEL[s as FulfillmentStatus]}</option>
            ))}
          </select>
          <select value={serviceId} onChange={(e) => { setServiceId(e.target.value); setPage(1); }} className="rounded-md border px-2 py-1.5 text-sm bg-white max-w-[200px]">
            <option value="">All services</option>
            {(svcData?.rows ?? []).map((s: any) => (
              <option key={s.id} value={s.id}>{s.service_name}</option>
            ))}
          </select>
          <select value={assignedTo} onChange={(e) => { setAssignedTo(e.target.value); setPage(1); }} className="rounded-md border px-2 py-1.5 text-sm bg-white max-w-[200px]">
            <option value="">All assignees</option>
            {(staffData?.profiles ?? []).map((s: any) => (
              <option key={s.id} value={s.id}>{s.display_name || s.email}</option>
            ))}
          </select>
          {!hideMoney && (
            <select value={paymentStatus} onChange={(e) => { setPaymentStatus(e.target.value); setPage(1); }} className="rounded-md border px-2 py-1.5 text-sm bg-white">
              <option value="">All payment</option>
              {PAY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
          <Input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} className="h-9 text-sm max-w-[150px]" />
          <Input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} className="h-9 text-sm max-w-[150px]" />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {BUCKETS.map((b) => {
          const active = stageBucket === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setStageBucket(b.id)}
              className={
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors " +
                (active
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300")
              }
            >
              {b.label}
              <span className={"ml-1.5 text-[10px] " + (active ? "text-slate-300" : "text-slate-400")}>
                {bucketCount(b.id)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="rounded-lg border bg-white overflow-hidden" style={{ borderColor: "var(--admin-border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="text-left px-3 py-2.5">Order #</th>
                <th className="text-left px-3 py-2.5">Customer</th>
                <th className="text-left px-3 py-2.5">Service</th>
                <th className="text-left px-3 py-2.5">Stage</th>
                <th className="text-left px-3 py-2.5">Fulfillment</th>
                <th className="text-left px-3 py-2.5">Assigned</th>
                {!hideMoney && <th className="text-right px-3 py-2.5">Amount</th>}
                {!hideMoney && <th className="text-left px-3 py-2.5">Payment</th>}
                <th className="text-left px-3 py-2.5">Created</th>
                <th className="px-3 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={10} className="text-center py-10 text-slate-500">Loading orders…</td></tr>
              )}
              {!isLoading && rows.length === 0 && (
                <tr><td colSpan={10} className="text-center py-10 text-slate-500 italic">No orders match.</td></tr>
              )}
              {rows.map((r, idx) => {
                const dKey = istDateKey(r.created_at);
                const prevKey = idx > 0 ? istDateKey((rows as any[])[idx - 1].created_at) : "";
                const showSep = dKey && dKey !== prevKey;
                const sepCols = hideMoney ? 8 : 10;
                return (
                <Fragment key={r.id}>
                  {showSep && (
                    <tr>
                      <td colSpan={sepCols} className="px-3 py-1.5 bg-slate-900 text-white text-[11px] uppercase tracking-wider font-semibold">
                        {istDayLabel(r.created_at)}
                      </td>
                    </tr>
                  )}
                  <tr className="border-t hover:bg-slate-50/60 transition-colors">
                    <td className="px-3 py-2 font-mono text-xs text-slate-700">{r.application_code}</td>
                    <td className="px-3 py-2">
                      <div className="font-medium text-slate-800">{r.customer_name}</div>
                      {r.customer_mobile && <div className="text-[10px] text-slate-500">{r.customer_mobile}</div>}
                    </td>
                    <td className="px-3 py-2 text-slate-700 text-xs">{r.service_name ?? "—"}</td>
                    <td className="px-3 py-2">
                      {(r as any).stage ? (
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${STAGE_BADGE_CLASS[(r as any).stage as OrderStage]}`}>
                          {STAGE_META[(r as any).stage as OrderStage].label}
                        </span>
                      ) : <span className="text-slate-400 text-xs">—</span>}
                    </td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium border ${FULFILLMENT_BADGE[r.fulfillment_status]}`}>
                        {FULFILLMENT_LABEL[r.fulfillment_status]}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-700 text-xs">{r.assigned_name ?? <span className="text-slate-400">Unassigned</span>}</td>
                    {!hideMoney && <td className="px-3 py-2 text-right font-medium">₹{r.total_amount.toLocaleString("en-IN")}</td>}
                    {!hideMoney && <td className="px-3 py-2"><Badge variant="secondary" className="text-[10px]">{r.payment_status}</Badge></td>}
                    <td className="px-3 py-2 text-xs text-slate-500 whitespace-nowrap">
                      <div>{formatIST(r.created_at, { dateOnly: true })}</div>
                      <div className="text-[10px] text-slate-400">{formatIST(r.created_at, { timeOnly: true })} IST</div>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Link to="/admin/orders/$orderId" params={{ orderId: r.id }} className="text-blue-600 hover:underline text-xs inline-flex items-center gap-1">
                        <Eye className="size-3" /> View
                      </Link>
                    </td>
                  </tr>
                </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-3 py-2 border-t" style={{ borderColor: "var(--admin-border)" }}>
          <div className="text-xs text-slate-500">Page {page} / {pages}</div>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="size-3" />
            </Button>
            <Button size="sm" variant="outline" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight className="size-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
