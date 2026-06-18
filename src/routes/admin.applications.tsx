import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { listOrders } from "@/lib/crm/orders.functions";
import { getApplicationCounts } from "@/lib/crm/applications.functions";
import { APPLICATION_STATUSES } from "@/lib/crm/types";
import { SectionCard, TableSkeleton, StatusBadge, FilterChip } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/applications")({ component: OrdersPage });

const PAYMENT_STATUSES = ["Pending", "Paid", "Partially Paid", "Refunded", "Cancelled"] as const;

function paymentTone(s: string) {
  switch (s) {
    case "Paid":
      return { bg: "var(--admin-success)", fg: "#fff" };
    case "Pending":
      return { bg: "var(--admin-warn)", fg: "#fff" };
    case "Partially Paid":
      return { bg: "var(--admin-accent)", fg: "#fff" };
    case "Refunded":
      return { bg: "var(--admin-fg-subtle)", fg: "#fff" };
    case "Cancelled":
      return { bg: "var(--admin-danger)", fg: "#fff" };
    default:
      return { bg: "var(--admin-surface-2)", fg: "var(--admin-fg)" };
  }
}

function OrdersPage() {
  const navigate = useNavigate();
  const listFn = useServerFn(listOrders);
  const countsFn = useServerFn(getApplicationCounts);

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin.orders", page, status, paymentStatus, search],
    queryFn: () =>
      listFn({
        data: {
          page,
          pageSize: 25,
          status: status || undefined,
          paymentStatus: paymentStatus || undefined,
          search: search || undefined,
        },
      }),
  });

  const { data: countsData } = useQuery({
    queryKey: ["admin.applicationCounts"],
    queryFn: () => countsFn(),
  });
  const counts = countsData?.counts ?? {};
  const rows = data?.rows ?? [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="text-sm" style={{ color: "var(--admin-fg-muted)" }}>
          {data?.total ?? 0} total orders
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <FilterChip active={status === ""} onClick={() => { setStatus(""); setPage(1); }}>
          All <span className="ml-1 opacity-60">({counts.all ?? 0})</span>
        </FilterChip>
        {APPLICATION_STATUSES.map((s) => (
          <FilterChip key={s} active={status === s} onClick={() => { setStatus(s); setPage(1); }}>
            {s.replace(/_/g, " ")} <span className="ml-1 opacity-60">({counts[s] ?? 0})</span>
          </FilterChip>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: "var(--admin-fg-muted)" }} />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search order no., customer, email, mobile…"
            className="rounded-lg border pl-9 pr-3 py-2 text-sm w-96 outline-none focus:ring-2"
            style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)", color: "var(--admin-fg)" }}
          />
        </div>
        <select
          value={paymentStatus}
          onChange={(e) => { setPaymentStatus(e.target.value); setPage(1); }}
          className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
          style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)", color: "var(--admin-fg)" }}
        >
          <option value="">All payments</option>
          {PAYMENT_STATUSES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <SectionCard>
        <div className="overflow-x-auto">
          {isLoading ? <TableSkeleton rows={8} cols={9} /> : (
            <table className="w-full text-sm">
              <thead style={{ background: "var(--admin-surface-2)" }}>
                <tr className="text-[11px] uppercase tracking-wide" style={{ color: "var(--admin-fg-muted)" }}>
                  <th className="px-4 py-2.5 text-left font-medium">Order No.</th>
                  <th className="px-4 py-2.5 text-left font-medium">Customer</th>
                  <th className="px-4 py-2.5 text-left font-medium">Service</th>
                  <th className="px-4 py-2.5 text-left font-medium">Date</th>
                  <th className="px-4 py-2.5 text-left font-medium">Assigned Executive</th>
                  <th className="px-4 py-2.5 text-right font-medium">Total (₹)</th>
                  <th className="px-4 py-2.5 text-left font-medium">Payment</th>
                  <th className="px-4 py-2.5 text-left font-medium">Order Status</th>
                  <th className="px-4 py-2.5 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r: any) => {
                  const tone = paymentTone(r.payment_status);
                  return (
                    <tr
                      key={r.id}
                      onClick={() => navigate({ to: "/admin/applications/$applicationId", params: { applicationId: r.id } })}
                      className="border-t cursor-pointer hover:bg-[var(--admin-surface-2)]"
                      style={{ borderColor: "var(--admin-border)" }}
                    >
                      <td className="px-4 py-2.5 font-mono text-xs font-medium" style={{ color: "var(--admin-accent)" }}>
                        {r.application_code}
                      </td>
                      <td className="px-4 py-2.5 text-xs font-medium">
                        <div>{r.customer_name}</div>
                        <div className="text-[10px]" style={{ color: "var(--admin-fg-muted)" }}>{r.customer_mobile}</div>
                      </td>
                      <td className="px-4 py-2.5 text-xs" style={{ color: "var(--admin-fg-muted)" }}>{r.service ?? "—"}</td>
                      <td className="px-4 py-2.5 text-xs" style={{ color: "var(--admin-fg-muted)" }}>
                        {new Date(r.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                      </td>
                      <td className="px-4 py-2.5 text-xs" style={{ color: r.assigned_name ? "var(--admin-fg)" : "var(--admin-fg-muted)" }}>
                        {r.assigned_name ?? "Unassigned"}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-right font-mono" style={{ color: "var(--admin-fg)" }}>
                        {r.total ? `₹${Number(r.total).toLocaleString("en-IN")}` : "—"}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-medium"
                          style={{ background: tone.bg, color: tone.fg }}
                        >
                          {r.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5"><StatusBadge status={r.application_status} /></td>
                      <td className="px-4 py-2.5" onClick={(e) => e.stopPropagation()}>
                        <Link
                          to="/admin/applications/$applicationId"
                          params={{ applicationId: r.id }}
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-[var(--admin-surface-2)]"
                          style={{ color: "var(--admin-accent)" }}
                        >
                          <Eye className="w-3 h-3" /> View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {rows.length === 0 && (
                  <tr><td colSpan={9} className="px-3 py-10 text-center text-sm" style={{ color: "var(--admin-fg-muted)" }}>No orders found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </SectionCard>

      <div className="flex justify-between items-center text-sm">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="flex items-center gap-1 rounded-lg border px-3 py-1.5 disabled:opacity-40 hover:bg-[var(--admin-surface-2)]" style={{ borderColor: "var(--admin-border)" }}>
          <ChevronLeft className="size-4" /> Prev
        </button>
        <div style={{ color: "var(--admin-fg-muted)" }}>Page {page}</div>
        <button disabled={!data || data.rows.length < 25} onClick={() => setPage(page + 1)} className="flex items-center gap-1 rounded-lg border px-3 py-1.5 disabled:opacity-40 hover:bg-[var(--admin-surface-2)]" style={{ borderColor: "var(--admin-border)" }}>
          Next <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
