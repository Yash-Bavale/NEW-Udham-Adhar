import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Search, ChevronLeft, ChevronRight, ArrowRight, Phone, MessageCircle,
  Clock, AlertTriangle, CheckCircle2, XCircle, Layers, Sparkles,
} from "lucide-react";
import { formatIST, relativeIST } from "@/lib/datetime";

import { listOrdersV2 } from "@/lib/crm/orders-v2.functions";
import { listStaff } from "@/lib/crm/leads-admin.functions";
import { listServices } from "@/lib/crm/services-admin.functions";
import {
  FULFILLMENT_LABEL, FULFILLMENT_STAGES, type FulfillmentStatus,
} from "@/lib/crm/fulfillment-transitions";
import { STAGE_META, type OrderStage } from "@/lib/crm/computeOrderStage";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRole } from "@/hooks/useRole";

export const Route = createFileRoute("/admin/orders/")({
  head: () => ({ meta: [{ title: "Orders — Udyam Ops OS" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: OrdersListPage,
});

type Bucket = "current" | "pending" | "cancelled" | "closed" | "all";

const PENDING_STAGES: OrderStage[] = ["lead_received", "payment_pending", "payment_done", "form_submitted"];
const CURRENT_STAGES: OrderStage[] = ["under_review", "in_progress", "submitted_to_govt", "under_processing", "certificate_ready"];
const CLOSED_STAGES: OrderStage[] = ["completed", "refunded"];
const CANCEL_STAGES: OrderStage[] = ["uninterested", "refund_requested"];

const BUCKETS: { id: Bucket; label: string; hint: string }[] = [
  { id: "current",   label: "Current",   hint: "Active in-progress orders" },
  { id: "pending",   label: "Pending",   hint: "Awaiting customer or first action" },
  { id: "cancelled", label: "Cancelled", hint: "Cancelled or refund requested" },
  { id: "closed",    label: "Closed",    hint: "Completed & refunded" },
  { id: "all",       label: "All",       hint: "Every order" },
];

function bucketOf(stage: OrderStage): Bucket {
  if (CURRENT_STAGES.includes(stage)) return "current";
  if (PENDING_STAGES.includes(stage)) return "pending";
  if (CANCEL_STAGES.includes(stage)) return "cancelled";
  if (CLOSED_STAGES.includes(stage)) return "closed";
  return "current";
}

// Compact 6-dot journey used per row
const JOURNEY_DOTS: { key: FulfillmentStatus; label: string }[] = [
  { key: "order_received",        label: "Order" },
  { key: "documents_received",    label: "Docs" },
  { key: "verification_pending",  label: "Verify" },
  { key: "application_submitted", label: "Submit" },
  { key: "under_processing",      label: "Process" },
  { key: "completed",             label: "Done" },
];

function OrdersListPage() {
  const listFn = useServerFn(listOrdersV2);
  const staffFn = useServerFn(listStaff);
  const svcFn = useServerFn(listServices);
  const role = useRole();
  const hideMoney = role.hideMoney();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [serviceId, setServiceId] = useState<string>("all");
  const [assignedTo, setAssignedTo] = useState<string>("all");
  const [bucket, setBucket] = useState<Bucket>("current");

  const { data: staffData } = useQuery({ queryKey: ["admin.staff"], queryFn: () => staffFn() });
  const { data: svcData } = useQuery({ queryKey: ["admin.services.list"], queryFn: () => svcFn() });

  const { data, isLoading } = useQuery({
    queryKey: ["admin.orders.v2", page, search, serviceId, assignedTo],
    queryFn: () => listFn({
      data: {
        page, pageSize: 50,
        serviceId: serviceId === "all" ? undefined : serviceId,
        assignedTo: assignedTo === "all" ? undefined : assignedTo,
        search: search || undefined,
      },
    }),
  });

  const allRows = (data?.rows ?? []) as any[];
  const filtered = bucket === "all" ? allRows : allRows.filter((r) => bucketOf(r.stage as OrderStage) === bucket);

  // Sort so the orders that need immediate action rise to the top:
  //   1. HIGH_PRIORITY   → red pulsing
  //   2. On hold (OUR_SIDE_DELAY / CUSTOMER_HOLD / external dependency)
  //   3. Brand-new orders (NEW_ORDER / lead_received)
  //   4. Everything else, most recently updated first
  const rowRank = (r: any) => {
    const s = String(r.order_status ?? "").toUpperCase();
    const w = String(r.workflow_status ?? "");
    if (s === "HIGH_PRIORITY") return 0;
    if (s === "OUR_SIDE_DELAY" || s === "CUSTOMER_HOLD" || w === "government_portal_pending" || w === "external_dependency") return 1;
    if (s === "NEW_ORDER" || r.stage === "lead_received") return 2;
    return 3;
  };
  const rows = [...filtered].sort((a, b) => {
    const ra = rowRank(a), rb = rowRank(b);
    if (ra !== rb) return ra - rb;
    return new Date(b.updated_at ?? b.created_at ?? 0).getTime() - new Date(a.updated_at ?? a.created_at ?? 0).getTime();
  });

  const total = data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / 50));

  const counts = useMemo(() => {
    const c: Record<Bucket, number> = { current: 0, pending: 0, cancelled: 0, closed: 0, all: allRows.length };
    for (const r of allRows) c[bucketOf(r.stage as OrderStage)]++;
    return c;
  }, [allRows]);

  const closedToday = useMemo(() => {
    const today = new Date().toDateString();
    return allRows.filter((r) => r.stage === "completed" && r.updated_at && new Date(r.updated_at).toDateString() === today).length;
  }, [allRows]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Orders</h1>
          <p className="text-xs text-slate-500 mt-1">
            {total.toLocaleString("en-IN")} total · times in IST · payment-successful customers only
          </p>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard icon={Layers}       label="Current"          value={counts.current}   tone="info" />
        <KpiCard icon={Clock}         label="Pending action"   value={counts.pending}   tone="warn" />
        <KpiCard icon={AlertTriangle} label="Cancelled / refund" value={counts.cancelled} tone="danger" />
        <KpiCard icon={CheckCircle2}  label="Closed today"     value={closedToday}      tone="success" />
      </div>

      {/* Filters */}
      <Card className="p-3">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
            <Input
              placeholder="Search order #, customer, mobile, lead code…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-8 h-9 text-sm"
            />
          </div>

          <Select value={serviceId} onValueChange={(v) => { setServiceId(v); setPage(1); }}>
            <SelectTrigger className="h-9 w-[180px] text-sm"><SelectValue placeholder="Service" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All services</SelectItem>
              {(svcData?.rows ?? []).map((s: any) => (
                <SelectItem key={s.id} value={s.id}>{s.service_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={assignedTo} onValueChange={(v) => { setAssignedTo(v); setPage(1); }}>
            <SelectTrigger className="h-9 w-[180px] text-sm"><SelectValue placeholder="Assignee" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All assignees</SelectItem>
              {(staffData?.profiles ?? []).map((s: any) => (
                <SelectItem key={s.id} value={s.id}>{s.display_name || s.email}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Bucket tabs */}
      <Tabs value={bucket} onValueChange={(v) => setBucket(v as Bucket)}>
        <TabsList className="h-auto p-1 bg-slate-100">
          {BUCKETS.map((b) => (
            <TabsTrigger key={b.id} value={b.id} className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <span>{b.label}</span>
              <span className={`inline-flex items-center justify-center rounded-full text-[10px] font-semibold px-1.5 min-w-[20px] ${
                bucket === b.id ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-600"
              }`}>{counts[b.id]}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Rows */}
      {isLoading ? (
        <Card className="p-10 text-center text-sm text-slate-500">Loading orders…</Card>
      ) : rows.length === 0 ? (
        <Card className="p-12 text-center">
          <Sparkles className="size-6 mx-auto text-slate-300 mb-2" />
          <div className="text-sm text-slate-500">No orders in this view.</div>
          <div className="text-xs text-slate-400 mt-1">Try a different tab or clear filters.</div>
        </Card>
      ) : (
        <div className="space-y-2">
          {rows.map((r) => (
            <OrderRow key={r.id} order={r} hideMoney={hideMoney} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div>Page {page} / {pages}</div>
        <div className="flex gap-1">
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft className="size-3.5" />
          </Button>
          <Button size="sm" variant="outline" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, tone }: {
  icon: any; label: string; value: number;
  tone: "info" | "warn" | "danger" | "success";
}) {
  const toneMap = {
    info:    "bg-sky-50 text-sky-700 ring-sky-200/60",
    warn:    "bg-amber-50 text-amber-700 ring-amber-200/60",
    danger:  "bg-rose-50 text-rose-700 ring-rose-200/60",
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200/60",
  } as const;
  return (
    <Card className="p-4 flex items-center gap-3">
      <div className={`size-10 rounded-xl grid place-items-center ring-1 ${toneMap[tone]}`}>
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wider font-medium text-slate-500 truncate">{label}</div>
        <div className="text-xl font-semibold text-slate-900 leading-tight">{value.toLocaleString("en-IN")}</div>
      </div>
    </Card>
  );
}

function OrderRow({ order, hideMoney }: { order: any; hideMoney: boolean }) {
  const stage: OrderStage = order.stage;
  const meta = STAGE_META[stage];
  const b = bucketOf(stage);
  const orderStatus = String(order.order_status ?? "").toUpperCase();
  const workflowStatus = String(order.workflow_status ?? "");
  const isPriority = orderStatus === "HIGH_PRIORITY";
  const isOnHold = workflowStatus === "government_portal_pending" || workflowStatus === "external_dependency" || orderStatus === "OUR_SIDE_DELAY" || orderStatus === "CUSTOMER_HOLD";
  const isNew = orderStatus === "NEW_ORDER" || stage === "lead_received";
  const stageTone =
    b === "cancelled" ? "bg-rose-50 text-rose-700 border-rose-200"
    : b === "closed" && stage === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : b === "pending" ? "bg-amber-50 text-amber-700 border-amber-200"
    : "bg-indigo-50 text-indigo-700 border-indigo-200";

  // Left accent bar + optional pulsing badge for priority orders.
  const accentClass =
    isPriority ? "border-l-4 border-l-rose-500"
    : isOnHold ? "border-l-4 border-l-orange-400"
    : isNew ? "border-l-4 border-l-sky-400"
    : b === "current" ? "border-l-4 border-l-indigo-300"
    : "";

  const waPhone = order.customer_mobile ? String(order.customer_mobile).replace(/\D/g, "") : "";
  const waUrl = waPhone ? `https://wa.me/${waPhone.length === 10 ? "91" + waPhone : waPhone}` : null;

  const currentFulfillment = (order.fulfillment_status ?? "order_received") as FulfillmentStatus;
  const fulIdx = FULFILLMENT_STAGES.indexOf(currentFulfillment === "cancelled" ? "order_received" : currentFulfillment);

  const initials = (order.customer_name ?? "?").split(/\s+/).slice(0, 2).map((s: string) => s[0] ?? "").join("").toUpperCase() || "?";
  const assignInitials = (order.assigned_name ?? "").split(/\s+/).slice(0, 2).map((s: string) => s[0] ?? "").join("").toUpperCase();

  return (
    <Link
      to="/admin/orders/$orderId"
      params={{ orderId: order.id }}
      className="block group"
    >
      <Card className={`p-4 hover:shadow-md hover:border-slate-300 transition-all ${accentClass} ${isPriority ? "ring-1 ring-rose-200" : ""}`}>
        <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
          {/* Customer + code */}
          <div className="flex items-center gap-3 min-w-0 md:w-[260px]">
            <Avatar className="size-10 shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="font-medium text-slate-900 truncate">{order.customer_name ?? "—"}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-[11px] text-slate-500">{order.application_code}</span>
                {order.customer_mobile && (
                  <span className="text-[11px] text-slate-400">· {order.customer_mobile}</span>
                )}
              </div>
            </div>
          </div>

          {/* Service */}
          <div className="hidden lg:block text-xs text-slate-600 min-w-0 truncate md:w-[180px]">
            {order.service_name ?? "—"}
          </div>

          {/* Journey dots */}
          <div className="flex-1 min-w-[220px]">
            <div className="flex items-center gap-1">
              {JOURNEY_DOTS.map((d, i) => {
                const done = i < fulIdx;
                const active = i === fulIdx && currentFulfillment !== "cancelled";
                const cancelled = currentFulfillment === "cancelled";
                return (
                  <div key={d.key} className="flex items-center gap-1 flex-1">
                    <div
                      className={`size-2.5 rounded-full shrink-0 transition-all ${
                        cancelled ? "bg-slate-200"
                        : done ? "bg-emerald-500"
                        : active ? "bg-indigo-600 ring-2 ring-indigo-200 animate-pulse"
                        : "bg-slate-200"
                      }`}
                      title={d.label}
                    />
                    {i < JOURNEY_DOTS.length - 1 && (
                      <div className={`h-px flex-1 ${done ? "bg-emerald-300" : "bg-slate-200"}`} />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-1.5 text-[10px] text-slate-500">
              {cancelledLabel(currentFulfillment) ?? FULFILLMENT_LABEL[currentFulfillment]}
            </div>
          </div>

          {/* Status + amount */}
          <div className="flex flex-col items-end gap-1 md:w-[140px]">
            <div className="flex items-center gap-1">
              {isPriority && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">
                  ● Priority
                </span>
              )}
              {isOnHold && !isPriority && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                  On hold
                </span>
              )}
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${stageTone}`}>
                {meta?.label ?? stage}
              </span>
            </div>
            {!hideMoney && (
              <div className="text-sm font-semibold text-slate-900">
                ₹{Number(order.total_amount ?? 0).toLocaleString("en-IN")}
              </div>
            )}
          </div>

          {/* Assignee + updated */}
          <div className="flex items-center gap-2 md:w-[170px]">
            {assignInitials ? (
              <Avatar className="size-6">
                <AvatarFallback className="bg-slate-100 text-slate-700 text-[10px] font-semibold">
                  {assignInitials}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="size-6 rounded-full border-2 border-dashed border-slate-300" />
            )}
            <div className="min-w-0">
              <div className="text-xs text-slate-700 truncate">{order.assigned_name ?? "Unassigned"}</div>
              <div className="text-[10px] text-slate-400">
                {relativeIST(order.updated_at ?? order.created_at)}
              </div>
            </div>
          </div>

          {/* Quick actions — always visible so they're usable on touch and
              during triage; the arrow still hints at row navigation. */}
          <div className="flex items-center gap-1">
            {order.customer_mobile && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `tel:${order.customer_mobile}`; }}
                className="size-8 rounded-lg grid place-items-center bg-sky-50 hover:bg-sky-100 text-sky-600 ring-1 ring-sky-100"
                title="Call"
                aria-label="Call customer"
              >
                <Phone className="size-3.5" />
              </button>
            )}
            {waUrl && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(waUrl, "_blank"); }}
                className="size-8 rounded-lg grid place-items-center bg-emerald-50 hover:bg-emerald-100 text-emerald-600 ring-1 ring-emerald-100"
                title="WhatsApp"
                aria-label="Message on WhatsApp"
              >
                <MessageCircle className="size-3.5" />
              </button>
            )}
            <ArrowRight className="size-4 text-slate-400 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Footer meta row */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>Created {formatIST(order.created_at, { dateOnly: true })}</span>
            {order.payment_status && !hideMoney && (
              <span className="inline-flex items-center gap-1">
                <span className={`size-1.5 rounded-full ${
                  order.payment_status === "Paid" ? "bg-emerald-500"
                  : order.payment_status === "Refunded" || order.payment_status === "Failed" ? "bg-rose-500"
                  : "bg-amber-500"
                }`} />
                {order.payment_status}
              </span>
            )}
          </div>
          {stage === "completed" && <span className="text-emerald-600 font-medium">Delivered</span>}
          {stage === "refund_requested" && <span className="text-rose-600 font-medium flex items-center gap-1"><XCircle className="size-3" />Refund requested</span>}
        </div>
      </Card>
    </Link>
  );
}

function cancelledLabel(s: FulfillmentStatus): string | null {
  return s === "cancelled" ? "Cancelled" : null;
}
