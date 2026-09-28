import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, keepPreviousData, useQueryClient } from "@tanstack/react-query";
import { Fragment, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, X, Filter, Loader2, ArrowUpDown, ArrowUp, ArrowDown, ShieldAlert, Flame, PhoneCall, PhoneForwarded, Clock, Server, LayoutGrid, Inbox, Bell, Hourglass, CheckCircle2, CheckCheck, AlertTriangle, UserX, UserCheck, Scale, Sparkles, RefreshCw, LifeBuoy } from "lucide-react";
import { formatIST, istDateKey } from "@/lib/datetime";
import { toast } from "sonner";

import {
  listOrdersV2,
  bucketOfRow,
  isPendingRow,
  isTechnicalDelayOrder,
  isCustomerDelayOrder,
  isCallbackScheduledOrder,
  isActionTakenOrder,
} from "@/lib/crm/orders-v2.functions";
import { normalizeOrdersFilter, getOrdersQueryKey } from "@/lib/orders/orders-filter";
import { listAssignmentStaff, listAllHistoricalStaff } from "@/lib/crm/leads-admin.functions";
import { listServices } from "@/lib/crm/services-admin.functions";
import { bulkAssignOrders } from "@/lib/crm/orders.functions";
import { autoDistributeSelectedOrders } from "@/lib/crm/assignment-history.functions";
import { STAGE_META, type OrderStage } from "@/lib/crm/computeOrderStage";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useRole } from "@/hooks/useRole";
import { usePermissions } from "@/hooks/usePermissions";
import { useRealtimeTable } from "@/hooks/useRealtimeTable";
import { usePreserveScroll, saveModuleFilterState, getModuleFilterState, clearModuleFilterState } from "@/hooks/usePreserveScroll";
import { formatMobile55, cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/orders/")({
  validateSearch: (
    search: Record<string, unknown>
  ): {
    filter?: string;
    preset?: string;
    dateFrom?: string;
    dateTo?: string;
    stage?: string;
    search?: string;
  } => ({
    filter: typeof search.filter === "string" ? search.filter : undefined,
    preset: typeof search.preset === "string" ? search.preset : undefined,
    dateFrom: typeof search.dateFrom === "string" ? search.dateFrom : undefined,
    dateTo: typeof search.dateTo === "string" ? search.dateTo : undefined,
    stage: typeof search.stage === "string" ? search.stage : undefined,
    search: typeof search.search === "string" ? search.search : undefined,
  }),
  head: () => ({ meta: [{ title: "Orders — Udyam Ops OS" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: OrdersListPage,
});

type Bucket =
  | "all"
  | "needs_action"
  | "hot_orders"
  | "reminders" // Call Back Scheduled
  | "technical_delay"
  | "backlog"
  | "customer_delay"
  | "pending" // Action Taken
  | "completed"
  | "closed"
  | "exception";

const CLOSED_FS = new Set<string>([
  "application_rejected", "certificate_rejected", "order_closed", "cancelled",
]);
const COMPLETED_FS = new Set<string>([
  "consultation_completed",
  "order_completed",
  "completed",
  "certificate_ready",
  "certificate_delivered",
  "certificate_uploaded",
  "service_completed",
  "application_approved",
  "approved",
]);
const EXCEPTION_STAGES: OrderStage[] = ["refund_requested", "refunded", "uninterested"];
const NEEDS_ACTION_STAGES: OrderStage[] = ["lead_received", "payment_done", "form_submitted", "form_not_submitted"];

interface BucketCardItem {
  id: Bucket;
  label: string;
  shortLabel?: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: {
    text: string;
    pillClass: string;
  };
  tone?: "default" | "rose" | "indigo" | "emerald" | "amber" | "sky";
  adminOnly?: boolean;
}

const BUCKET_CARDS: BucketCardItem[] = [
  {
    id: "all",
    label: "ALL ORDERS",
    subtitle: "All in Range",
    icon: LayoutGrid,
    adminOnly: true,
  },
  {
    id: "needs_action",
    label: "NEEDS ACTION",
    subtitle: "Touch SLA Pending",
    icon: Inbox,
    tone: "rose",
  },
  {
    id: "hot_orders",
    label: "HOT ORDERS",
    subtitle: "<15m Critical SLA",
    icon: Flame,
    badge: {
      text: "Due Now",
      pillClass: "bg-rose-500 text-white font-bold",
    },
    tone: "rose",
  },
  {
    id: "backlog",
    label: "BACKLOG",
    subtitle: "Oldest Untouched",
    icon: Clock,
    badge: {
      text: "Oldest First",
      pillClass: "bg-amber-600 text-white font-bold",
    },
    tone: "amber",
  },
  {
    id: "technical_delay",
    label: "TECHNICAL DELAY",
    subtitle: "NIC/Gov Portal Down",
    icon: Server,
    tone: "sky",
  },
  {
    id: "reminders",
    label: "CALL BACK SCHEDULED",
    subtitle: "Active Callbacks",
    icon: PhoneForwarded,
    badge: {
      text: "Active",
      pillClass: "bg-blue-600 text-white font-bold",
    },
    tone: "indigo",
  },
  {
    id: "customer_delay",
    label: "CUSTOMER DELAY",
    subtitle: "Pending OTP/Docs",
    icon: UserX,
    tone: "amber",
  },
  {
    id: "pending",
    label: "ACTION TAKEN",
    subtitle: "In-Progress & Delays",
    icon: Hourglass,
    tone: "amber",
  },
  {
    id: "completed",
    label: "COMPLETED",
    subtitle: "Fulfilled in range",
    icon: CheckCircle2,
    tone: "emerald",
  },
  {
    id: "closed",
    label: "CLOSED",
    subtitle: "Archived in range",
    icon: CheckCheck,
  },
];

const STAGE_FILTER_OPTIONS: Array<{ id: string; label: string; tone: string }> = [
  { id: "all", label: "All Stages", tone: "slate" },
  { id: "payment_done", label: "Order Received", tone: "emerald" },
  { id: "form_not_submitted", label: "Form Not Submitted", tone: "amber" },
  { id: "order_reopened", label: "Order Reopened", tone: "violet" },
  { id: "form_submitted", label: "Form Submitted", tone: "indigo" },
  { id: "technical_delay", label: "Technical Delay", tone: "sky" },
  { id: "customer_delay", label: "Customer Delay", tone: "amber" },
  { id: "submitted_to_govt", label: "Submitted to Govt", tone: "indigo" },
  { id: "certificate_ready", label: "Certificate Ready", tone: "emerald" },
  { id: "completed", label: "Completed", tone: "emerald" },
  { id: "closed", label: "Order Closed", tone: "rose" },
];

type PendingAge = "any" | "1" | "2" | "3" | "7" | "custom";
const PENDING_AGE_OPTIONS: { id: PendingAge; label: string }[] = [
  { id: "any", label: "Any age" },
  { id: "1", label: "1 day+ pending" },
  { id: "2", label: "2 days+ pending" },
  { id: "3", label: "3 days+ pending" },
  { id: "7", label: "7 days+ pending" },
  { id: "custom", label: "Custom days…" },
];

type RangePreset = "today" | "yesterday" | "7d" | "15d" | "30d" | "mtd" | "custom";
const RANGE_PRESETS: { value: RangePreset; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7d", label: "7 days" },
  { value: "15d", label: "15 days" },
  { value: "30d", label: "30 days" },
  { value: "mtd", label: "This month" },
  { value: "custom", label: "Custom" },
];

function daysSince(iso: string | null | undefined): number {
  if (!iso) return 0;
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return 0;
  return Math.max(0, Math.floor((Date.now() - t) / 86_400_000));
}

function OrdersListPage() {
  const listFn = useServerFn(listOrdersV2);
  const assignStaffFn = useServerFn(listAssignmentStaff);
  const historicalStaffFn = useServerFn(listAllHistoricalStaff);
  const svcFn = useServerFn(listServices);
  const role = useRole();
  const userPerms = usePermissions();
  const isAdmin = role.hasAny(["admin", "super_admin"]) || Boolean(userPerms.perms?.isAdmin);

  const hideMoney = role.hideMoney();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const savedState = useMemo(() => getModuleFilterState("admin.orders"), []);

  const todayKey = useMemo(() => istDateKey(new Date()), []);

  const [datePreset, setDatePreset] = useState<RangePreset>(() => {
    if (savedState?.datePreset) return savedState.datePreset;
    if (savedState?.dateFrom && savedState.dateFrom !== todayKey) return "custom";
    return "today";
  });
  const [fulfillmentStatus, setFulfillmentStatus] = useState<string>(savedState?.fulfillmentStatus ?? "all");
  const [serviceId, setServiceId] = useState<string>(savedState?.serviceId ?? "all");
  const [assignedTo, setAssignedTo] = useState<string>(savedState?.assignedTo ?? "all");
  const [paymentStatus, setPaymentStatus] = useState<string>(savedState?.paymentStatus ?? "all");
  const [actionStatusFilter, setActionStatusFilter] = useState<string>(savedState?.actionStatusFilter ?? "all");
  const [stageFilter, setStageFilter] = useState<string>(savedState?.stageFilter ?? "all");
  const [dateFrom, setDateFrom] = useState<string>(savedState?.dateFrom ?? todayKey);
  const [dateTo, setDateTo] = useState<string>(savedState?.dateTo ?? todayKey);
  const [bucket, setBucket] = useState<Bucket>(savedState?.bucket ?? (isAdmin ? "all" : "needs_action"));
  const [pendingAge, setPendingAge] = useState<PendingAge>(savedState?.pendingAge ?? "any");
  const [customDays, setCustomDays] = useState<string>(savedState?.customDays ?? "");
  const [sortField, setSortField] = useState<"created_at" | "stage" | "stage_journey">(savedState?.sortField ?? "created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(savedState?.sortOrder ?? "desc");
  const [page, setPage] = useState<number>(savedState?.page ?? 1);
  const pageSize = 50;
  const isInitialMount = useRef(true);

  const applyDatePreset = useCallback((p: RangePreset) => {
    setDatePreset(p);
    const now = new Date();
    const tKey = istDateKey(now);
    if (p === "today") {
      setDateFrom(tKey);
      setDateTo(tKey);
    } else if (p === "yesterday") {
      const yKey = istDateKey(new Date(now.getTime() - 86400000));
      setDateFrom(yKey);
      setDateTo(yKey);
    } else if (p === "7d") {
      const startKey = istDateKey(new Date(now.getTime() - 6 * 86400000));
      setDateFrom(startKey);
      setDateTo(tKey);
    } else if (p === "15d") {
      const startKey = istDateKey(new Date(now.getTime() - 14 * 86400000));
      setDateFrom(startKey);
      setDateTo(tKey);
    } else if (p === "30d") {
      const startKey = istDateKey(new Date(now.getTime() - 29 * 86400000));
      setDateFrom(startKey);
      setDateTo(tKey);
    } else if (p === "mtd") {
      const ist = new Date(now.getTime() + 5.5 * 3600 * 1000);
      const monthStart = new Date(Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), 1));
      setDateFrom(istDateKey(monthStart));
      setDateTo(tKey);
    }
  }, []);

  // Persist state across navigation
  useEffect(() => {
    saveModuleFilterState("admin.orders", {
      datePreset, fulfillmentStatus, serviceId, assignedTo,
      paymentStatus, actionStatusFilter, stageFilter, dateFrom, dateTo, bucket, pendingAge,
      customDays, sortField, sortOrder, page,
    });
  }, [datePreset, fulfillmentStatus, serviceId, assignedTo, paymentStatus, actionStatusFilter, stageFilter, dateFrom, dateTo, bucket, pendingAge, customDays, sortField, sortOrder, page]);

  // Reset page to 1 whenever filters change (skip on initial mount to preserve Page 2/3 when returning via Back button)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setPage(1);
  }, [fulfillmentStatus, serviceId, assignedTo, paymentStatus, actionStatusFilter, stageFilter, dateFrom, dateTo, bucket, pendingAge, customDays, sortField, sortOrder]);

  const routeSearch = Route.useSearch();
  const lastProcessedSearchRef = useRef<string>("");

  // Hydrate filters from URL query params (deep-links from dashboard KPIs) ONLY when URL search actually changes.
  useEffect(() => {
    const searchSerialized = JSON.stringify(routeSearch ?? {});
    if (lastProcessedSearchRef.current === searchSerialized) {
      return;
    }
    lastProcessedSearchRef.current = searchSerialized;

    // Only apply if routeSearch actually contains keys
    if (Object.keys(routeSearch ?? {}).length === 0) return;

    if (routeSearch.filter) {
      switch (routeSearch.filter) {
        case "pending": setBucket("pending"); break;
        case "closed": setBucket("closed"); break;
        case "completed": setBucket("completed"); break;
        case "delayed_3d": setBucket("pending"); setPendingAge("3"); break;
        case "delayed_7d": setBucket("pending"); setPendingAge("7"); break;
        case "not_contacted": setBucket("needs_action"); break;
        case "not_contacted_5h": setBucket("needs_action"); break;
        case "technical_delay": setStageFilter("technical_delay"); break;
        case "customer_delay": setStageFilter("customer_delay"); break;
        case "form_not_submitted": setStageFilter("form_not_submitted"); break;
      }
    }
    if (routeSearch.preset) {
      if (["today", "yesterday", "7d", "15d", "30d", "mtd", "custom"].includes(routeSearch.preset)) {
        applyDatePreset(routeSearch.preset as RangePreset);
      }
    }
    if (routeSearch.dateFrom) setDateFrom(routeSearch.dateFrom);
    if (routeSearch.dateTo) setDateTo(routeSearch.dateTo);
    if (routeSearch.stage) setStageFilter(routeSearch.stage);
  }, [routeSearch, applyDatePreset]);

  const dateRangeValue = useMemo(() => ({
    from: dateFrom ? new Date(dateFrom.includes("T") ? dateFrom : `${dateFrom}T00:00:00+05:30`) : undefined,
    to: dateTo ? new Date(dateTo.includes("T") ? dateTo : `${dateTo}T23:59:59+05:30`) : undefined,
  }), [dateFrom, dateTo]);

  const { data: assignStaffData } = useQuery({
    queryKey: ["admin.staff.assignment"],
    queryFn: () => assignStaffFn(),
    staleTime: 30 * 1000,
  });
  const { data: historicalStaffData } = useQuery({
    queryKey: ["admin.staff.historical"],
    queryFn: () => historicalStaffFn(),
    staleTime: 60 * 1000,
  });
  const assignStaffProfiles: Array<{
    id: string;
    display_name?: string;
    email?: string;
    name?: string;
    full_name?: string;
    is_eligible?: boolean;
    is_on_leave?: boolean;
    presence_status?: string;
    unavailability_reason?: string;
  }> = useMemo(() => {
    return (assignStaffData?.profiles ?? []) as any[];
  }, [assignStaffData]);

  const { activeStaffList, inactiveStaffList } = useMemo(() => {
    const hist = (historicalStaffData?.profiles ?? []) as any[];
    const liveMap = new Map((assignStaffProfiles ?? []).map((s: any) => [s.id, s]));

    const active: any[] = [];
    const inactive: any[] = [];

    for (const h of hist) {
      const live = liveMap.get(h.id);
      const isAct = h.is_active !== false && h.employment_status !== "ARCHIVED" && h.employment_status !== "TERMINATED" && h.employment_status !== "INACTIVE";
      if (isAct) {
        active.push({
          ...h,
          presence_status: live?.presence_status ?? "OFFLINE",
          is_on_leave: live?.is_on_leave ?? false,
          is_eligible: live?.is_eligible ?? true,
          unavailability_reason: live?.unavailability_reason,
        });
      } else {
        inactive.push(h);
      }
    }

    // Also include any in liveMap not in hist
    for (const s of assignStaffProfiles) {
      if (!active.some((a) => a.id === s.id) && !inactive.some((i) => i.id === s.id)) {
        active.push(s);
      }
    }

    active.sort((a, b) => (a.display_name || a.name || "").localeCompare(b.display_name || b.name || ""));
    inactive.sort((a, b) => (a.display_name || a.name || "").localeCompare(b.display_name || b.name || ""));

    return { activeStaffList: active, inactiveStaffList: inactive };
  }, [historicalStaffData, assignStaffProfiles]);
  const { data: svcData } = useQuery({
    queryKey: ["admin.services.list"],
    queryFn: () => svcFn(),
    staleTime: 5 * 60 * 1000,
  });

  // Group active services website-wise
  const groupedServices = useMemo(() => {
    const raw = (svcData?.rows ?? []) as any[];
    const activeOnly = raw.filter((s) => s.is_active !== false);
    const map = new Map<string, { websiteName: string; domain: string; services: any[] }>();

    for (const s of activeOnly) {
      const webId = s.website_id || s.website?.id || "main";
      const webName = s.website?.name || s.website?.domain || "Main Website";
      const domain = s.website?.domain || "";

      if (!map.has(webId)) {
        map.set(webId, { websiteName: webName, domain, services: [] });
      }
      map.get(webId)!.services.push(s);
    }

    return Array.from(map.entries()).map(([id, group]) => ({
      id,
      ...group,
    }));
  }, [svcData]);

  const queryPayload = useMemo(() => ({
    page,
    pageSize,
    fulfillmentStatus: fulfillmentStatus === "all" ? undefined : fulfillmentStatus,
    serviceId: serviceId === "all" ? undefined : serviceId,
    assignedTo: assignedTo === "all" ? undefined : assignedTo,
    paymentStatus: paymentStatus === "all" ? undefined : paymentStatus,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    bucket: bucket || "all",
    stage: stageFilter === "all" ? undefined : stageFilter,
    actionStatus: actionStatusFilter || "all",
    pendingAge: pendingAge === "any" ? undefined : pendingAge,
    customDays: customDays || undefined,
    sortField,
    sortOrder,
  }), [page, pageSize, fulfillmentStatus, serviceId, assignedTo, paymentStatus, dateFrom, dateTo, bucket, stageFilter, actionStatusFilter, pendingAge, customDays, sortField, sortOrder]);

  const normalizedFilter = useMemo(() => normalizeOrdersFilter(queryPayload), [queryPayload]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: getOrdersQueryKey(normalizedFilter, page),
    queryFn: () => listFn({ data: queryPayload }),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
    refetchInterval: 15_000,
    gcTime: 10 * 60 * 1000,
  });

  const rows = (data?.rows ?? []) as any[];
  const total = data?.total ?? 0;
  const counts = (data?.counts as any) ?? {
    all: 0,
    needs_action: 0,
    pending: 0,
    completed: 0,
    closed: 0,
    exception: 0,
    actionRequired: 0,
    processed: 0,
    reminders: 0,
    hot_orders: 0,
    technical_delay: 0,
    customer_delay: 0,
    totalAll: 0,
  };
  const ageBuckets = data?.ageBuckets ?? { d1: 0, d2: 0, d3: 0, d7: 0, older: 0 };


// Preserve scroll position when navigating back from order detail view
usePreserveScroll("admin.orders", !isLoading);

// Real-time subscription with debouncing to prevent spamming queries
const invalidateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
const scheduleDebouncedInvalidation = useCallback(() => {
  if (invalidateTimeoutRef.current) {
    clearTimeout(invalidateTimeoutRef.current);
  }
  invalidateTimeoutRef.current = setTimeout(() => {
    invalidateTimeoutRef.current = null;
    qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
  }, 6000);
}, [qc]);

useEffect(() => {
  return () => {
    if (invalidateTimeoutRef.current) {
      clearTimeout(invalidateTimeoutRef.current);
    }
  };
}, []);

useRealtimeTable("applications", scheduleDebouncedInvalidation);
useRealtimeTable("payments", scheduleDebouncedInvalidation);
useRealtimeTable("order_schedulers", scheduleDebouncedInvalidation);
useRealtimeTable("order_callback_history", scheduleDebouncedInvalidation);
useRealtimeTable("assignment_pool", () => {
  qc.invalidateQueries({ queryKey: ["admin.staff.assignment"] });
  scheduleDebouncedInvalidation();
});

// Background prefetch for next page
useEffect(() => {
  const totalPages = Math.ceil(total / pageSize);
  if (page < totalPages) {
    const nextPagePayload = { ...queryPayload, page: page + 1 };
    qc.prefetchQuery({
      queryKey: getOrdersQueryKey(normalizedFilter, page + 1),
      queryFn: () => listFn({ data: nextPagePayload }),
      staleTime: 30 * 1000,
    });
  }
}, [page, total, queryPayload, normalizedFilter, qc, listFn, pageSize]);

const bulkAssignFn = useServerFn(bulkAssignOrders);
const autoDistributeFn = useServerFn(autoDistributeSelectedOrders);
const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
const [assigningBusy, setAssigningBusy] = useState(false);

async function handleAutoDistribute() {
  if (!selectedOrderIds.length) return;
  setAssigningBusy(true);
  try {
    const res = await autoDistributeFn({
      data: {
        applicationIds: selectedOrderIds,
        reason: "Equally distributed by Admin across active staff",
      },
    });
    if (res.success) {
      toast.success(res.summaryMessage || `Equally distributed ${res.distributedCount} order(s)!`);
      setSelectedOrderIds([]);
      qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
      qc.invalidateQueries({ queryKey: ["admin.assignment.metrics"] });
      qc.invalidateQueries({ queryKey: ["admin.assignment.history"] });
    } else {
      toast.error(res.summaryMessage || "Failed to distribute orders");
    }
  } catch (e) {
    toast.error((e as Error).message || "Failed to auto-distribute orders");
  } finally {
    setAssigningBusy(false);
  }
}

async function handleBulkReassign(targetStaffId: string) {
  if (!selectedOrderIds.length) return;
  if (targetStaffId === "auto_distribute") {
    return handleAutoDistribute();
  }
  setAssigningBusy(true);
  try {
    const assignedTo = targetStaffId === "unassign" ? null : targetStaffId;
    await bulkAssignFn({ data: { applicationIds: selectedOrderIds, assignedTo } });
    const staffObj = assignStaffProfiles.find((s: any) => s.id === targetStaffId);
    const name = targetStaffId === "unassign" ? "Unassigned" : (staffObj?.display_name || staffObj?.name || staffObj?.email || "staff");
    toast.success(`Successfully reassigned ${selectedOrderIds.length} order(s) to ${name}`);
    setSelectedOrderIds([]);
    qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
    qc.invalidateQueries({ queryKey: ["admin.assignment.metrics"] });
    qc.invalidateQueries({ queryKey: ["admin.assignment.history"] });
  } catch (e) {
    toast.error((e as Error).message || "Failed to reassign orders");
  } finally {
    setAssigningBusy(false);
  }
}

// Base columns (Order #, Created, Customer, Service, Action Status, Stage) = 6
// Plus Checkbox (1) + Amount (1) + Assigned (1) = 9 total columns for Admin
const colCount = 6 + (isAdmin ? 2 : 0) + (hideMoney ? 0 : 1);

const groups = useMemo(() => {
  const g = new Map<string, any[]>();
  const list = bucket === "needs_action" ? rows.filter((r) => !r.is_hot) : rows;

  for (const r of list) {
    const rawKey =
      bucket === "completed"
        ? (r.completed_at || r.created_at)
        : bucket === "closed"
          ? (r.closed_at || r.created_at)
          : r.created_at;
    const key = istDateKey(rawKey) || "Unknown";
    const arr = g.get(key) ?? [];
    arr.push(r);
    g.set(key, arr);
  }

  return Array.from(g.entries());
}, [rows, bucket]);

const hotRows = useMemo(() => {
  return bucket === "needs_action" ? rows.filter((r) => r.is_hot) : [];
}, [rows, bucket]);

  const isFilterActive =
    fulfillmentStatus !== "all" ||
    serviceId !== "all" ||
    assignedTo !== "all" ||
    paymentStatus !== "all" ||
    actionStatusFilter !== "all" ||
    stageFilter !== "all" ||
    datePreset !== "today" ||
    (dateFrom !== "" && dateFrom !== todayKey) ||
    (dateTo !== "" && dateTo !== todayKey) ||
    pendingAge !== "any" ||
    bucket !== (isAdmin ? "all" : "needs_action");

  const resetFilters = () => {
    setFulfillmentStatus("all");
    setServiceId("all");
    setAssignedTo("all");
    setPaymentStatus("all");
    setActionStatusFilter("all");
    setStageFilter("all");
    applyDatePreset("today");
    setPendingAge("any");
    setCustomDays("");
    setSortField("created_at");
    setSortOrder("desc");
    setBucket(isAdmin ? "all" : "needs_action");
    setPage(1);
  };

  useEffect(() => {
    const handleReset = () => resetFilters();
    window.addEventListener("reset-orders-filters", handleReset);
    return () => window.removeEventListener("reset-orders-filters", handleReset);
  }, [isAdmin]);

  const handleSortToggle = (field: "created_at" | "stage") => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortField(field);
      setSortOrder(field === "created_at" ? "desc" : "asc");
    }
  };

if (!userPerms.isLoading && !userPerms.can("orders", "view")) {
  return (
    <div className="p-8 text-center bg-white rounded-xl border border-slate-200 space-y-3 my-6">
      <ShieldAlert className="size-10 text-rose-500 mx-auto" />
      <h2 className="text-lg font-bold text-slate-900">Access Denied</h2>
      <p className="text-sm text-slate-500 max-w-md mx-auto">
        You do not have permission to view the Orders module. Please contact your administrator if you need access.
      </p>
    </div>
  );
}

return (
  <div className="w-full space-y-4">
    {/* Header & Date Range Selector */}
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Orders</h1>
          {isFetching && !isLoading && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full animate-pulse">
              <Loader2 className="size-3 animate-spin text-indigo-600" /> Updating…
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Tabs
          value={datePreset}
          onValueChange={(v) => applyDatePreset(v as RangePreset)}
        >
          <TabsList className="h-9">
            {RANGE_PRESETS.map((p) => (
              <TabsTrigger
                key={p.value}
                value={p.value}
                className="text-xs px-2.5"
              >
                {p.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {datePreset === "custom" && (
          <DateRangePicker
            value={dateRangeValue}
            onChange={(range) => {
              if (!range.from) {
                setDateFrom("");
                setDateTo("");
              } else {
                setDateFrom(istDateKey(range.from));
                setDateTo(range.to ? istDateKey(range.to) : istDateKey(range.from));
              }
            }}
          />
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
            toast.success("Refreshing orders…");
          }}
          className="h-9 gap-1.5 text-xs text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border-slate-200 shadow-2xs"
          title="Refresh orders"
        >
          <RefreshCw className={`size-3.5 ${isFetching && !isLoading ? "animate-spin text-indigo-600" : "text-slate-500"}`} />
          <span>Refresh</span>
        </Button>

        {isFilterActive && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
          >
            <RotateCcw className="size-3.5" /> Reset Filters
          </button>
        )}
      </div>
    </div>

    {/* Modern Filter Card */}
    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs space-y-3">
      <div className="flex flex-wrap gap-2.5 items-center">
        {/* Stage Filter */}
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="h-9 w-[160px] text-xs bg-slate-50/50 border-slate-200">
            <SelectValue placeholder="All Stages" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {STAGE_FILTER_OPTIONS.map((st) => (
              <SelectItem key={st.id} value={st.id}>
                <div className="flex items-center gap-1.5">
                  {st.id !== "all" && (
                    <span className={`size-2 rounded-full ${st.tone === "emerald" ? "bg-emerald-500" :
                        st.tone === "amber" ? "bg-amber-500" :
                          st.tone === "indigo" ? "bg-indigo-500" :
                            st.tone === "violet" ? "bg-violet-500" :
                              st.tone === "sky" ? "bg-sky-500" :
                                st.tone === "rose" ? "bg-rose-500" : "bg-slate-400"
                      }`} />
                  )}
                  <span>{st.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Action Status Filter */}
        <Select value={actionStatusFilter} onValueChange={setActionStatusFilter}>
          <SelectTrigger className="h-9 w-[170px] text-xs bg-slate-50/50 border-slate-200"><SelectValue placeholder="Action Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Action Status</SelectItem>
            <SelectItem value="hot_orders">🔥 Hot Orders (Call Due Now)</SelectItem>
            <SelectItem value="scheduled_callback">⏱ Scheduled Callbacks</SelectItem>
            <SelectItem value="action_required">Action Required (Red)</SelectItem>
            <SelectItem value="processed">Completed / Action Taken</SelectItem>
          </SelectContent>
        </Select>

        {/* Services Filter */}
        <Select value={serviceId} onValueChange={setServiceId}>
          <SelectTrigger className="h-9 w-[220px] text-xs bg-slate-50/50 border-slate-200">
            <SelectValue placeholder="All services" />
          </SelectTrigger>
          <SelectContent className="max-h-[380px]">
            <SelectItem value="all" className="font-bold text-slate-700">All services</SelectItem>
            {groupedServices.map((g) => (
              <SelectGroup key={g.id}>
                <SelectLabel className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50/80 rounded-md my-1 flex items-center gap-1">
                  🌐 {g.websiteName} {g.domain ? `(${g.domain})` : ""}
                </SelectLabel>
                {g.services.map((s: any) => (
                  <SelectItem key={s.id} value={s.id} className="pl-3 text-xs">
                    {s.service_name}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>

        {/* Assignees Filter (Admin & Staff) */}
        {role.hasAny(["admin", "super_admin", "operations", "manager", "executive", "support"]) && (
          <Select value={assignedTo} onValueChange={setAssignedTo}>
            <SelectTrigger className="h-9 w-[190px] text-xs bg-slate-50/50 border-slate-200">
              <SelectValue placeholder="All assignees" />
            </SelectTrigger>
            <SelectContent className="max-h-[380px]">
              <SelectItem value="all" className="font-bold text-slate-800">All assignees</SelectItem>
              <SelectItem value="unassigned" className="text-slate-600">Unassigned</SelectItem>
              
              {activeStaffList.length > 0 && (
                <SelectGroup>
                  <SelectLabel className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50/80 rounded-md my-1 flex items-center gap-1">
                    🟢 Active Workforce ({activeStaffList.length})
                  </SelectLabel>
                  {activeStaffList.map((s: any) => (
                    <SelectItem key={s.id} value={s.id} className="pl-3 text-xs">
                      {s.display_name || s.full_name || s.name || s.email}
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}

              {inactiveStaffList.length > 0 && (
                <SelectGroup>
                  <SelectLabel className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50/80 rounded-md my-1 flex items-center gap-1">
                    ⚪ Inactive / Exited Staff ({inactiveStaffList.length})
                  </SelectLabel>
                  {inactiveStaffList.map((s: any) => (
                    <SelectItem key={s.id} value={s.id} className="pl-3 text-xs text-slate-600">
                      <div className="flex items-center justify-between gap-1.5 w-full">
                        <span>{s.display_name || s.name || s.email}</span>
                        <span className="text-[9px] text-rose-500 font-mono ml-1 uppercase">[{s.employment_status || "INACTIVE"}]</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
            </SelectContent>
          </Select>
        )}

        {/* Payment Status Filter */}
        <Select value={paymentStatus} onValueChange={setPaymentStatus}>
          <SelectTrigger className="h-9 w-[140px] text-xs bg-slate-50/50 border-slate-200"><SelectValue placeholder="Payment status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All payments</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Partially Paid">Partially Paid</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Refunded">Refunded</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        {/* Fulfillment Stage Dropdown */}
        <Select value={fulfillmentStatus} onValueChange={setFulfillmentStatus}>
          <SelectTrigger className="h-9 w-[180px] text-xs bg-slate-50/50 border-slate-200">
            <SelectValue placeholder="Fulfillment stage" />
          </SelectTrigger>
          <SelectContent className="max-h-[360px]">
            <SelectItem value="all">All Fulfillment Stages</SelectItem>
            <SelectGroup>
              <SelectLabel className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">In Progress</SelectLabel>
              <SelectItem value="order_received">Order Received</SelectItem>
              <SelectItem value="order_reopened">Order Reopened</SelectItem>
              <SelectItem value="form_submitted">Form Submitted</SelectItem>
              <SelectItem value="technical_delay">Technical Delay</SelectItem>
              <SelectItem value="customer_delay">Customer Delay</SelectItem>
              <SelectItem value="application_submitted">Application Submitted (Govt)</SelectItem>
              <SelectItem value="consultation_completed">Consultation Completed</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 px-2 py-1">Completed</SelectLabel>
              <SelectItem value="application_approved">Application Approved</SelectItem>
              <SelectItem value="order_completed">Order Completed</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel className="text-[10px] font-bold uppercase tracking-wider text-rose-600 px-2 py-1">Closed / Cancelled</SelectLabel>
              <SelectItem value="application_rejected">Application Rejected</SelectItem>
              <SelectItem value="order_closed">Order Closed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

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
        )}
        {/* Sort Selector */}
        <Select
          value={
            sortField === "created_at"
              ? sortOrder === "desc" ? "created_desc" : "created_asc"
              : sortField === "stage"
                ? sortOrder === "asc" ? "stage_asc" : "stage_desc"
                : "stage_journey_asc"
          }
          onValueChange={(v) => {
            if (v === "created_desc") { setSortField("created_at"); setSortOrder("desc"); }
            else if (v === "created_asc") { setSortField("created_at"); setSortOrder("asc"); }
            else if (v === "stage_asc") { setSortField("stage"); setSortOrder("asc"); }
            else if (v === "stage_desc") { setSortField("stage"); setSortOrder("desc"); }
            else if (v === "stage_journey_asc") { setSortField("stage_journey"); setSortOrder("asc"); }
          }}
        >
          <SelectTrigger className="h-9 w-[170px] text-xs bg-slate-50/50 border-slate-200">
            <ArrowUpDown className="w-3.5 h-3.5 mr-1 text-slate-500 shrink-0" />
            <SelectValue placeholder="Sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_desc">
              {bucket === "completed" ? "Latest Completed (Newest)" : bucket === "closed" ? "Latest Closed (Newest)" : "Latest First (Newest)"}
            </SelectItem>
            <SelectItem value="created_asc">
              {bucket === "completed" ? "Older Completed (Oldest)" : bucket === "closed" ? "Older Closed (Oldest)" : "Older First (Oldest)"}
            </SelectItem>
            <SelectItem value="stage_asc">Stage (A → Z)</SelectItem>
            <SelectItem value="stage_desc">Stage (Z → A)</SelectItem>
            <SelectItem value="stage_journey_asc">Stage (Journey Order)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    {/* Pending ageing summary */}
    {(bucket === "pending" || pendingAge !== "any") && (
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/60 px-3.5 py-2 text-[11px] text-amber-900 shadow-xs">
        <span className="font-semibold uppercase tracking-wider text-[10px] text-amber-700">Pending ageing</span>
        <AgeChip label="< 1d" n={ageBuckets.d1} />
        <AgeChip label="1d+" n={ageBuckets.d2} />
        <AgeChip label="2d+" n={ageBuckets.d3} />
        <AgeChip label="3d+" n={ageBuckets.d7} />
        <AgeChip label="7d+" n={ageBuckets.older} tone="rose" />
      </div>
    )}

    {/* KPI Cards Row */}
    <div className={cn(
      "grid gap-2 w-full",
      isAdmin
        ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10"
        : "grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9"
    )}>
      {(isAdmin ? BUCKET_CARDS : BUCKET_CARDS.filter((b) => !b.adminOnly)).map((b) => {
        const active = bucket === b.id;
        const countVal = Number((counts as any)[b.id] ?? 0);
        const IconComponent = b.icon;

        let cardContainerCls = "bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50/70";
        let headerCls = "text-slate-500";
        let iconCls = "text-slate-400";
        let countCls = "text-slate-900";
        let subtitleCls = "text-slate-400";

        if (b.id === "needs_action") {
          cardContainerCls = active
            ? "bg-red-50 border-red-500 text-red-950 shadow-sm ring-2 ring-red-300"
            : "bg-red-50/40 border-red-200/80 text-red-950 hover:bg-red-50 hover:border-red-300";
          headerCls = "text-red-600 font-bold";
          iconCls = "text-red-500";
          countCls = "text-red-600";
          subtitleCls = "text-red-500/80";
        } else if (b.id === "hot_orders") {
          cardContainerCls = active
            ? "bg-rose-50 border-rose-400 text-rose-950 shadow-sm ring-2 ring-rose-300"
            : "bg-rose-50/70 border-rose-200/90 text-rose-950 hover:bg-rose-100/70 hover:border-rose-300";
          headerCls = "text-rose-600 font-bold";
          iconCls = "text-rose-600";
          countCls = "text-rose-700";
          subtitleCls = "text-rose-500/80";
        } else if (b.id === "reminders") {
          cardContainerCls = active
            ? "bg-indigo-50 border-indigo-400 text-indigo-950 shadow-sm ring-2 ring-indigo-300"
            : "bg-indigo-50/40 border-indigo-200/90 text-indigo-950 hover:bg-indigo-50/80 hover:border-indigo-300";
          headerCls = "text-indigo-600 font-bold";
          iconCls = "text-indigo-600";
          countCls = "text-indigo-950";
          subtitleCls = "text-indigo-600/70";
        } else if (b.id === "technical_delay") {
          cardContainerCls = active
            ? "bg-sky-100/80 border-sky-500 text-sky-950 shadow-sm ring-2 ring-sky-300"
            : "bg-sky-50/60 border-sky-200/90 text-sky-950 hover:bg-sky-100/60 hover:border-sky-300";
          headerCls = "text-sky-700 font-bold";
          iconCls = "text-sky-600";
          countCls = "text-sky-900";
          subtitleCls = "text-sky-600/80";
        } else if (b.id === "backlog") {
          cardContainerCls = active
            ? "bg-amber-100 border-amber-500 text-amber-950 shadow-sm ring-2 ring-amber-300"
            : "bg-amber-50/60 border-amber-200/90 text-amber-950 hover:bg-amber-100/60 hover:border-amber-300";
          headerCls = "text-amber-800 font-bold";
          iconCls = "text-amber-700";
          countCls = "text-amber-950";
          subtitleCls = "text-amber-700/80";
        } else if (b.id === "customer_delay") {
          cardContainerCls = active
            ? "bg-orange-50 border-orange-500 text-orange-950 shadow-sm ring-2 ring-orange-300"
            : "bg-orange-50/40 border-orange-200/80 text-orange-950 hover:bg-orange-50 hover:border-orange-300";
          headerCls = "text-orange-700 font-bold";
          iconCls = "text-orange-600";
          countCls = "text-orange-950";
          subtitleCls = "text-orange-600/70";
        } else if (b.id === "pending") {
          cardContainerCls = active
            ? "bg-amber-50 border-amber-500 text-amber-950 shadow-sm ring-2 ring-amber-300"
            : "bg-amber-50/50 border-amber-200/90 text-amber-950 hover:bg-amber-100/60 hover:border-amber-300";
          headerCls = "text-amber-700 font-bold";
          iconCls = "text-amber-600 animate-[spin_3s_ease-in-out_infinite]";
          countCls = "text-amber-950";
          subtitleCls = "text-amber-600/80";
        } else if (b.id === "completed") {
          cardContainerCls = active
            ? "bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm ring-2 ring-emerald-300"
            : "bg-emerald-50/40 border-emerald-200/80 text-emerald-950 hover:bg-emerald-50 hover:border-emerald-300";
          headerCls = "text-emerald-700 font-bold";
          iconCls = "text-emerald-600";
          countCls = "text-emerald-900";
          subtitleCls = "text-emerald-600/80";
        } else if (b.id === "closed") {
          cardContainerCls = active
            ? "bg-slate-200 border-slate-400 text-slate-900 shadow-sm ring-2 ring-slate-300"
            : "bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300";
          headerCls = "text-slate-600 font-bold";
          iconCls = "text-slate-500";
          countCls = "text-slate-800";
          subtitleCls = "text-slate-500";
        } else if (active) {
          cardContainerCls = "bg-slate-900 text-white border-slate-900 shadow-sm";
          headerCls = "text-slate-300";
          iconCls = "text-slate-300";
          countCls = "text-white";
          subtitleCls = "text-slate-400";
        }

        return (
          <button
            key={b.id}
            type="button"
            onClick={() => {
              setBucket(b.id);
              setPage(1);
            }}
            className={cn(
              "flex flex-col justify-between p-2.5 sm:p-3 rounded-xl min-h-[82px] border transition-all duration-150 cursor-pointer select-none text-left group shadow-xs hover:shadow-sm",
              cardContainerCls
            )}
          >
            {/* Top row: Label & Icon */}
            <div className="flex items-center justify-between gap-1 w-full">
              <div className="flex items-center gap-1.5 min-w-0">
                {b.id === "hot_orders" && countVal > 0 && (
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                  </span>
                )}
                <span
                  className={cn("text-[10px] font-bold tracking-wider uppercase truncate", headerCls)}
                  title={b.label}
                >
                  {b.shortLabel || b.label}
                </span>
              </div>
              <IconComponent className={cn("w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110", iconCls)} />
            </div>

            {/* Middle row: Count & Badge */}
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className={cn("text-lg sm:text-xl font-black tracking-tight", countCls)}>
                {countVal.toLocaleString()}
              </span>
              {b.id === "pending" && (counts as any).pending_actions_total > countVal ? (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded leading-none shrink-0 bg-purple-600 text-white shadow-2xs" title={`${(counts as any).pending_actions_total} total manual actions performed across these orders`}>
                  {(counts as any).pending_actions_total} Actions
                </span>
              ) : b.badge ? (
                <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded leading-none shrink-0", b.badge.pillClass)}>
                  {b.badge.text}
                </span>
              ) : null}
            </div>

            {/* Bottom row: Subtitle */}
            <div
              className={cn("text-[9.5px] font-medium truncate mt-0.5", subtitleCls)}
              title={b.id === "pending" && (counts as any).pending_actions_total > countVal ? `${countVal} unique orders · ${(counts as any).pending_actions_total} total actions performed` : b.subtitle}
            >
              {b.id === "pending" && (counts as any).pending_actions_total > countVal
                ? `${(counts as any).pending_actions_total} Total Actions`
                : b.subtitle}
            </div>
          </button>
        );
      })}
    </div>

    {/* Bulk Action Bar (SuperAdmin & Admin) */}
    {isAdmin && selectedOrderIds.length > 0 && (
      <div className="sticky top-2 z-30 flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-2">
        <div className="flex items-center gap-2.5 text-sm font-medium">
          <span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
            {selectedOrderIds.length}
          </span>
          <span>{selectedOrderIds.length === 1 ? "Order Selected" : "Orders Selected"}</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            onClick={handleAutoDistribute}
            disabled={assigningBusy}
            className="h-8 text-xs font-bold gap-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-xs border border-indigo-400/30 transition-all duration-150 active:scale-95"
          >
            {assigningBusy ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Scale className="size-3.5" />
            )}
            Equally Distribute
          </Button>

          <Select onValueChange={(val) => handleBulkReassign(val)} disabled={assigningBusy}>
            <SelectTrigger className="h-8 text-xs bg-slate-800 border-slate-700 text-white w-[190px]">
              <UserCheck className="size-3.5 mr-1.5 text-indigo-400" />
              <SelectValue placeholder={assigningBusy ? "Reassigning…" : "Reassign Staff…"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto_distribute" className="font-semibold text-indigo-600 dark:text-indigo-400">
                ⚖️ Auto-Balance / Equally Distribute
              </SelectItem>
              <SelectItem value="unassign">❌ Unassign Order</SelectItem>
              {activeStaffList.map((s: any) => {
                const statusTag = s.is_on_leave
                  ? " [🌴 On Leave]"
                  : s.presence_status === "AVAILABLE"
                    ? " [🟢 Online]"
                    : s.presence_status === "IDLE"
                      ? " [🟡 Idle]"
                      : s.presence_status === "AWAY"
                        ? " [🟠 Away]"
                        : " [⚪ Offline]";
                return (
                  <SelectItem key={s.id} value={s.id}>
                    👤 {s.display_name || s.name || s.email}
                    <span className="text-[10px] opacity-75 font-mono ml-1">{statusTag}</span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSelectedOrderIds([])}
            className="h-8 text-xs text-slate-300 hover:text-white hover:bg-slate-800"
          >
            Clear Selection
          </Button>
        </div>
      </div>
    )}

    {/* Desktop Table View */}
    <div className="hidden md:block rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
      <ScrollableTable>
        <table className="w-full text-sm min-w-[950px]">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-200">
              {isAdmin && (
                <th className="w-10 px-3 py-2.5 text-center">
                  <Checkbox
                    checked={rows.length > 0 && selectedOrderIds.length === rows.length}
                    onCheckedChange={(checked) =>
                      setSelectedOrderIds(checked ? rows.map((r) => r.id) : [])
                    }
                    aria-label="Select all orders"
                  />
                </th>
              )}
              <th className="text-left font-semibold px-3 py-2.5">Order #</th>
              <th
                onClick={() => handleSortToggle("created_at")}
                className="text-left font-semibold px-3 py-2.5 cursor-pointer hover:bg-slate-100/80 transition-colors select-none group"
                title={`Click to toggle sorting by ${bucket === "completed" ? "Completed" : bucket === "closed" ? "Closed" : "Created"} time`}
              >
                <div className="inline-flex items-center gap-1">
                  <span>{bucket === "completed" ? "Completed" : bucket === "closed" ? "Closed" : "Created"}</span>
                  {sortField === "created_at" ? (
                    sortOrder === "desc" ? (
                      <ArrowDown className="w-3 h-3 text-indigo-600" />
                    ) : (
                      <ArrowUp className="w-3 h-3 text-indigo-600" />
                    )
                  ) : (
                    <ArrowUpDown className="w-3 h-3 text-slate-300 group-hover:text-slate-500" />
                  )}
                </div>
              </th>
              <th className="text-left font-semibold px-3 py-2.5">Customer</th>
              <th className="text-left font-semibold px-3 py-2.5">Service</th>
              <th className="text-left font-semibold px-3 py-2.5">Action Status</th>
              <th
                onClick={() => handleSortToggle("stage")}
                className="text-left font-semibold px-3 py-2.5 cursor-pointer hover:bg-slate-100/80 transition-colors select-none group"
                title="Click to toggle sorting by Stage"
              >
                <div className="inline-flex items-center gap-1">
                  <span>Stage</span>
                  {sortField === "stage" ? (
                    sortOrder === "desc" ? (
                      <ArrowDown className="w-3 h-3 text-indigo-600" />
                    ) : (
                      <ArrowUp className="w-3 h-3 text-indigo-600" />
                    )
                  ) : sortField === "stage_journey" ? (
                    <ArrowDown className="w-3 h-3 text-indigo-600" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 text-slate-300 group-hover:text-slate-500" />
                  )}
                </div>
              </th>
              {isAdmin && <th className="text-left font-semibold px-3 py-2.5">Assigned</th>}
              {!hideMoney && <th className="text-right font-semibold px-3 py-2.5">Amount</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={colCount} className="px-4 py-12 text-center text-slate-500">Loading orders…</td></tr>
            )}
            {!isLoading && rows.length === 0 && (
              <tr><td colSpan={colCount} className="px-4 py-12 text-center text-slate-500">No orders in this view.</td></tr>
            )}
            {!isLoading && bucket === "hot_orders" &&
              rows.map((r) => (
                <OrderRow
                  key={r.id}
                  order={r}
                  bucket={bucket}
                  hideMoney={hideMoney}
                  isAdmin={isAdmin}
                  selected={selectedOrderIds.includes(r.id)}
                  onToggleSelect={(id, checked) =>
                    setSelectedOrderIds((prev) =>
                      checked ? [...prev, id] : prev.filter((x) => x !== id),
                    )
                  }
                  onOpen={(id) => navigate({ to: `/admin/orders/${id}` as any })}
                />
              ))}
            {!isLoading && bucket === "needs_action" && (
              <>
                {hotRows.map((r) => (
                  <OrderRow
                    key={r.id}
                    order={r}
                    bucket={bucket}
                    hideMoney={hideMoney}
                    isAdmin={isAdmin}
                    selected={selectedOrderIds.includes(r.id)}
                    onToggleSelect={(id, checked) =>
                      setSelectedOrderIds((prev) =>
                        checked ? [...prev, id] : prev.filter((x) => x !== id),
                      )
                    }
                    onOpen={(id) => navigate({ to: `/admin/orders/${id}` as any })}
                  />
                ))}
                {groups.map(([day, items]) => (
                  <Fragment key={`g-${day}`}>
                    <tr className="bg-slate-900 text-white border-b border-slate-800">
                      <td colSpan={colCount} className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider">
                        {formatDayHeader(day)}
                      </td>
                    </tr>
                    {items.map((r) => (
                      <OrderRow
                        key={r.id}
                        order={r}
                        bucket={bucket}
                        hideMoney={hideMoney}
                        isAdmin={isAdmin}
                        selected={selectedOrderIds.includes(r.id)}
                        onToggleSelect={(id, checked) =>
                          setSelectedOrderIds((prev) =>
                            checked ? [...prev, id] : prev.filter((x) => x !== id),
                          )
                        }
                        onOpen={(id) => navigate({ to: `/admin/orders/${id}` as any })}
                      />
                    ))}
                  </Fragment>
                ))}
              </>
            )}
            {!isLoading && bucket !== "hot_orders" && bucket !== "needs_action" && groups.map(([day, items]) => (
              <Fragment key={`g-${day}`}>
                <tr className="bg-slate-900 text-white border-b border-slate-800">
                  <td colSpan={colCount} className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider">
                    {formatDayHeader(day)}
                  </td>
                </tr>
                {items.map((r) => (
                  <OrderRow
                    key={r.id}
                    order={r}
                    bucket={bucket}
                    hideMoney={hideMoney}
                    isAdmin={isAdmin}
                    selected={selectedOrderIds.includes(r.id)}
                    onToggleSelect={(id, checked) =>
                      setSelectedOrderIds((prev) =>
                        checked ? [...prev, id] : prev.filter((x) => x !== id),
                      )
                    }
                    onOpen={(id) => navigate({ to: `/admin/orders/${id}` as any })}
                  />
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
      {!isLoading && bucket === "hot_orders" && (
        <div className="space-y-2.5">
          {rows.map((r) => (
            <OrderCardMobile
              key={r.id}
              order={r}
              bucket={bucket}
              hideMoney={hideMoney}
              isAdmin={isAdmin}
              selected={selectedOrderIds.includes(r.id)}
              onToggleSelect={(id, checked) =>
                setSelectedOrderIds((prev) =>
                  checked ? [...prev, id] : prev.filter((x) => x !== id),
                )
              }
              onOpen={(id) => navigate({ to: `/admin/orders/${id}` as any })}
            />
          ))}
        </div>
      )}
      {!isLoading && bucket === "needs_action" && (
        <div className="space-y-2.5">
          {hotRows.map((r) => (
            <OrderCardMobile
              key={r.id}
              order={r}
              bucket={bucket}
              hideMoney={hideMoney}
              isAdmin={isAdmin}
              selected={selectedOrderIds.includes(r.id)}
              onToggleSelect={(id, checked) =>
                setSelectedOrderIds((prev) =>
                  checked ? [...prev, id] : prev.filter((x) => x !== id),
                )
              }
              onOpen={(id) => navigate({ to: `/admin/orders/${id}` as any })}
            />
          ))}
          {groups.map(([day, items]) => (
            <div key={`m-g-${day}`} className="space-y-2">
              <div className="sticky top-0 z-10 bg-slate-900 text-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider rounded-lg shadow-xs">
                {formatDayHeader(day)}
              </div>
              <div className="space-y-2.5">
                {items.map((r) => (
                  <OrderCardMobile
                    key={r.id}
                    order={r}
                    bucket={bucket}
                    hideMoney={hideMoney}
                    isAdmin={isAdmin}
                    selected={selectedOrderIds.includes(r.id)}
                    onToggleSelect={(id, checked) =>
                      setSelectedOrderIds((prev) =>
                        checked ? [...prev, id] : prev.filter((x) => x !== id),
                      )
                    }
                    onOpen={(id) => navigate({ to: `/admin/orders/${id}` as any })}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {!isLoading && bucket !== "hot_orders" && bucket !== "needs_action" && groups.map(([day, items]) => (
        <div key={`m-g-${day}`} className="space-y-2">
          <div className="sticky top-0 z-10 bg-slate-900 text-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider rounded-lg shadow-xs">
            {formatDayHeader(day)}
          </div>
          <div className="space-y-2.5">
            {items.map((r) => (
              <OrderCardMobile
                key={r.id}
                order={r}
                bucket={bucket}
                hideMoney={hideMoney}
                isAdmin={isAdmin}
                selected={selectedOrderIds.includes(r.id)}
                onToggleSelect={(id, checked) =>
                  setSelectedOrderIds((prev) =>
                    checked ? [...prev, id] : prev.filter((x) => x !== id),
                  )
                }
                onOpen={(id) => navigate({ to: `/admin/orders/${id}` as any })}
              />
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

function OrderActionHistoryBadge({ order }: { order: any }) {
  const isReopened =
    order.stage === "order_reopened" ||
    order.fulfillment_status === "order_reopened" ||
    Boolean(order.ticket_source?.isReopenedFromTicket);
  if (isReopened) return null;

  const history = order.action_history ?? [];
  const count = order.action_count ?? history.length;
  if (!count || count <= 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          data-no-row-click
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors shadow-2xs cursor-pointer select-none shrink-0",
            count > 1
              ? "bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100 hover:border-purple-400"
              : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
          )}
          title={`Click to view timeline of ${count} manual action${count === 1 ? "" : "s"} taken on this order`}
        >
          <RotateCcw className="size-2.5 text-purple-600 shrink-0" />
          <span>{count > 1 ? `${count} Actions` : "1 Action"}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        data-no-row-click
        onClick={(e) => e.stopPropagation()}
        align="start"
        className="w-80 p-3 bg-white border border-slate-200 shadow-xl rounded-xl space-y-2.5 z-50 text-left"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <RotateCcw className="size-3.5 text-purple-600" />
            Action Activity Timeline ({count})
          </span>
          <span className="text-[10px] font-mono text-slate-400 font-semibold">{order.application_code}</span>
        </div>
        <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1 divide-y divide-slate-100">
          {history.length === 0 ? (
            <div className="text-xs text-slate-500 py-2">Manual action recorded on order.</div>
          ) : (
            history.map((act: any, idx: number) => (
              <div key={act.id || idx} className="pt-2 first:pt-0 space-y-1">
                <div className="flex items-center justify-between text-[11px] gap-1">
                  <span className="font-semibold text-slate-800">{act.title}</span>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {formatIST(act.created_at, { dateOnly: true })} {formatIST(act.created_at, { timeOnly: true })}
                  </span>
                </div>
                <div className="text-[10px] text-purple-700 font-medium">
                  By {act.staff_name || "Staff"}
                </div>
                {act.note && (
                  <div className="text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-100">
                    {act.note}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function OrderCardMobile({
  order,
  bucket,
  hideMoney,
  isAdmin,
  selected,
  onToggleSelect,
  onOpen,
}: {
  order: any;
  bucket?: Bucket;
  hideMoney: boolean;
  isAdmin: boolean;
  selected?: boolean;
  onToggleSelect?: (id: string, checked: boolean) => void;
  onOpen: (id: string) => void;
}) {
  const stage: OrderStage = order.stage;
  const meta = STAGE_META[stage];
  const actionStatus = getOrderActionStatus(order);

  const isCompletedView = bucket === "completed";
  const isClosedView = bucket === "closed";
  const dateToShow = isCompletedView
    ? (order.completed_at || order.created_at)
    : isClosedView
      ? (order.closed_at || order.created_at)
      : order.created_at;

  const stageToneMap: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    blue: "bg-sky-50 text-sky-700 border-sky-200",
    sky: "bg-sky-50 text-sky-700 border-sky-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
  };
  const stageTone = stageToneMap[meta?.tone ?? "emerald"] ?? "bg-emerald-50 text-emerald-700 border-emerald-200";

  return (
    <div
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("input,a,button,select,textarea,label,[data-no-row-click]")) return;
        onOpen(order.id);
      }}
      className={`p-3.5 bg-white rounded-xl border shadow-xs transition-all space-y-2.5 active:bg-slate-50 cursor-pointer ${
        order.is_hot
          ? "border-l-4 border-l-rose-500 bg-rose-50/25 border-rose-200"
          : selected
            ? "border-indigo-500 bg-indigo-50/40"
            : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {isAdmin && (
            <div data-no-row-click onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={!!selected}
                onCheckedChange={(v) => onToggleSelect?.(order.id, !!v)}
              />
            </div>
          )}
          <span className="font-mono text-xs font-bold text-slate-900">{order.application_code}</span>
          {order.ticket_source && (
            <span className="inline-flex items-center gap-1 rounded bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 text-[9px] font-bold">
              <LifeBuoy className="size-2.5 text-purple-600" />
              {order.ticket_source.ticketNumber ? `Ticket #${order.ticket_source.ticketNumber}` : "From Ticket"}
            </span>
          )}
          {order.is_hot && (
            <span className="inline-flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 rounded bg-rose-600 px-1.5 py-0.5 text-[9px] font-black uppercase text-white shadow-xs">
                <Flame className="size-2.5" /> HOT ORDER NOW
              </span>
              {(order as any).hot_started_at && (
                <span
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200"
                  title={`Time since order became HOT / escalated: ${formatOrderAge(Date.now() - new Date((order as any).hot_started_at).getTime())}`}
                >
                  {formatOrderAge(Date.now() - new Date((order as any).hot_started_at).getTime())}
                </span>
              )}
            </span>
          )}
          {!isCompletedView && !isClosedView && !order.is_terminal && (
            <span
              className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200"
              title={`Time since order created: ${formatOrderAge(Date.now() - new Date(order.created_at).getTime())}`}
            >
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
          {formatIST(dateToShow, { dateOnly: true })} {formatIST(dateToShow, { timeOnly: true })} IST
        </div>
      </div>

      <div className="text-xs text-slate-700 font-medium">
        {order.service_name ?? "—"}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          {order.is_hot ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
              {order.fulfillment_status === "technical_delay" || order.callback_reminder?.remarks?.channel === "technical_delay" ? (
                <>
                  <Server className="size-3 text-rose-600" />
                  Tech Delay Due
                </>
              ) : (
                <>
                  <PhoneCall className="size-3 text-rose-600" />
                  Call Due Now
                </>
              )}
            </span>
          ) : order.is_callback_scheduled ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {order.fulfillment_status === "technical_delay" || order.callback_reminder?.remarks?.channel === "technical_delay" ? (
                <>
                  <Server className="size-3 text-indigo-600" />
                  Tech Delay Scheduled
                </>
              ) : (
                <>
                  <PhoneForwarded className="size-3 text-indigo-600" />
                  Scheduled Callback
                </>
              )}
            </span>
          ) : actionStatus.tone === "red" ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              <span className="size-1.5 rounded-full bg-rose-600 animate-pulse" />
              {actionStatus.label}
            </span>
          ) : actionStatus.tone === "green" ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              {actionStatus.label}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-sky-50 text-sky-700 border border-sky-200">
              <span className="size-1.5 rounded-full bg-sky-500" />
              {actionStatus.label}
            </span>
          )}

          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${stageTone}`}>
            {meta?.label ?? stage}
          </span>

          <OrderActionHistoryBadge order={order} />
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

function formatDayHeader(dayKey: string): string {
  if (!dayKey || dayKey === "Unknown") return "UNKNOWN DATE";
  const todayKey = istDateKey(new Date());
  const yestKey = istDateKey(new Date(Date.now() - 86400000));
  const d = new Date(dayKey.includes("T") ? dayKey : `${dayKey}T00:00:00+05:30`);
  const base = d.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
  if (dayKey === todayKey) return `${base} · TODAY`;
  if (dayKey === yestKey) return `${base} · YESTERDAY`;
  return base;
}

export function getOrderActionStatus(order: any): { label: string; tone: "red" | "green" | "blue" } {
  const fs = order.fulfillment_status ?? "order_received";
  const stage = order.stage;

  // 1. Completed / Fulfilled states -> Green "Order Completed"
  const greenStatuses = new Set([
    "application_approved",
    "consultation_completed",
    "order_completed",
    "completed",
  ]);

  if (greenStatuses.has(fs) || stage === "completed" || Boolean(order.in_range_completed)) {
    return { label: "Order Completed", tone: "green" };
  }

  // 2. Closed / Cancelled states -> Red "Order Closed"
  const closedStatuses = new Set([
    "order_closed",
    "cancelled",
    "closed",
  ]);

  if (closedStatuses.has(fs) || stage === "closed" || Boolean(order.in_range_closed)) {
    return { label: "Order Closed", tone: "red" };
  }

  const isTechDelay = order.fulfillment_status === "technical_delay" || order.callback_reminder?.remarks?.channel === "technical_delay";
  if (order.is_hot) {
    return { label: isTechDelay ? "Tech Delay Due" : "Call Due Now", tone: "red" };
  }
  if (order.is_callback_scheduled) {
    return { label: isTechDelay ? "Tech Delay Scheduled" : "Scheduled Callback", tone: "blue" };
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

function OrderRow({
  order,
  bucket,
  hideMoney,
  isAdmin,
  selected,
  onToggleSelect,
  onOpen,
}: {
  order: any;
  bucket?: Bucket;
  hideMoney: boolean;
  isAdmin: boolean;
  selected?: boolean;
  onToggleSelect?: (id: string, checked: boolean) => void;
  onOpen: (id: string) => void;
}) {
  const stage: OrderStage = order.stage;
  const meta = STAGE_META[stage];

  const isCompletedView = bucket === "completed";
  const isClosedView = bucket === "closed";
  const dateToShow = isCompletedView
    ? (order.completed_at || order.created_at)
    : isClosedView
      ? (order.closed_at || order.created_at)
      : order.created_at;

  const stageToneMap: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
    slate: "bg-slate-100 text-slate-700",
    blue: "bg-sky-50 text-sky-700",
    sky: "bg-sky-50 text-sky-700",
    indigo: "bg-indigo-50 text-indigo-700",
    violet: "bg-violet-50 text-violet-700",
  };
  const stageTone = stageToneMap[meta?.tone ?? "emerald"] ?? "bg-emerald-50 text-emerald-700";
  const actionStatus = getOrderActionStatus(order);

  return (
    <tr
      className={`border-t border-slate-100 hover:bg-slate-50/60 cursor-pointer ${
        order.is_hot
          ? "border-l-4 border-l-rose-500 bg-rose-50/30 hover:bg-rose-50/50"
          : selected
            ? "bg-indigo-50/40"
            : ""
      }`}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("input,a,button,select,textarea,label,[data-no-row-click]")) return;
        const sel = typeof window !== "undefined" ? window.getSelection?.() : null;
        if (sel && sel.toString().trim().length > 0) return;
        onOpen(order.id);
      }}
    >
      {/* Checkbox Column */}
      {isAdmin && (
        <td className="w-10 px-3 py-2.5 text-center" data-no-row-click>
          <Checkbox
            checked={!!selected}
            onCheckedChange={(v) => onToggleSelect?.(order.id, !!v)}
            aria-label={`Select order ${order.application_code}`}
          />
        </td>
      )}

      {/* 1. Order # */}
      <td className="px-2 py-2.5 font-mono text-[12px] whitespace-nowrap">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-slate-900">{order.application_code}</span>
            {order.ticket_source && (
              <span className="inline-flex items-center gap-1 rounded bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 text-[9px] font-bold">
                <LifeBuoy className="size-2.5 text-purple-600" />
                {order.ticket_source.ticketNumber ? `Ticket #${order.ticket_source.ticketNumber}` : "From Ticket"}
              </span>
            )}
          </div>
          {order.is_hot && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 rounded bg-rose-600 px-1.5 py-0.5 text-[9px] font-black uppercase text-white shadow-xs">
                <Flame className="size-2.5" /> HOT ORDER NOW
              </span>
              {(order as any).hot_started_at && (
                <span
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200"
                  title={`Time since order became HOT / escalated: ${formatOrderAge(Date.now() - new Date((order as any).hot_started_at).getTime())}`}
                >
                  {formatOrderAge(Date.now() - new Date((order as any).hot_started_at).getTime())}
                </span>
              )}
            </div>
          )}
        </div>
      </td>

      {/* 2. Created / Completed / Closed */}
      <td className="px-2 py-2.5 text-[11px] text-slate-600 whitespace-nowrap leading-tight">
        <div className="flex items-center gap-1.5">
          <div>
            <div>{formatIST(dateToShow, { dateOnly: true })}</div>
            <div className="text-slate-400">{formatIST(dateToShow, { timeOnly: true })} IST</div>
          </div>
          {!isCompletedView && !isClosedView && !order.is_terminal && (
            <span
              className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200"
              title={`Time since order created: ${formatOrderAge(Date.now() - new Date(order.created_at).getTime())}`}
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
          <div className="text-[11px] text-slate-500 mt-0.5">{formatMobile55(order.customer_mobile)}</div>
        )}
      </td>

      {/* 4. Service */}
      <td className="px-2 py-2.5 text-slate-700 whitespace-nowrap text-[13px]">{order.service_name ?? "—"}</td>

      {/* 5. Action Status & Repeat Actions */}
      <td className="px-2 py-2.5 whitespace-nowrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {order.is_hot ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs">
              {order.fulfillment_status === "technical_delay" || order.callback_reminder?.remarks?.channel === "technical_delay" ? (
                <>
                  <Server className="size-3 text-rose-600" />
                  Tech Delay Due
                </>
              ) : (
                <>
                  <PhoneCall className="size-3 text-rose-600" />
                  Call Due Now
                </>
              )}
            </span>
          ) : order.is_callback_scheduled ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {order.fulfillment_status === "technical_delay" || order.callback_reminder?.remarks?.channel === "technical_delay" ? (
                <>
                  <Server className="size-3 text-indigo-600" />
                  Tech Delay Scheduled
                </>
              ) : (
                <>
                  <PhoneForwarded className="size-3 text-indigo-600" />
                  Scheduled Callback
                </>
              )}
            </span>
          ) : actionStatus.tone === "red" ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              <span className="size-1.5 rounded-full bg-rose-600 animate-pulse" />
              {actionStatus.label}
            </span>
          ) : actionStatus.tone === "green" ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              {actionStatus.label}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-sky-50 text-sky-700 border border-sky-200">
              <span className="size-1.5 rounded-full bg-sky-500" />
              {actionStatus.label}
            </span>
          )}

          <OrderActionHistoryBadge order={order} />
        </div>
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

      {/* 7. Assigned */}
      {isAdmin && <td className="px-2 py-2.5 text-slate-600 whitespace-nowrap text-[12px]">{order.assigned_name ?? "Unassigned"}</td>}

      {/* 8. Amount */}
      {!hideMoney && (
        <td className="px-2 py-2.5 text-right font-semibold text-slate-900 whitespace-nowrap text-[13px]">
          {`₹${Number(order.total_amount ?? 0).toLocaleString("en-IN")}`}
        </td>
      )}
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
