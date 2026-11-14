import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { j as useServerFn, y as getAssignmentOperationalMetrics, z as listAssignmentHistoryAdmin, C as listEmployeeLeaves, D as listStaffUsers, E as createEmployeeLeave, F as cancelEmployeeLeave, G as triggerEmployeeReassignment, H as Button, I as Input, J as Select, K as SelectTrigger, M as SelectValue, N as SelectContent, O as SelectItem, P as Dialog, Q as DialogContent, U as DialogHeader, V as DialogTitle, W as Label, X as DialogFooter } from "./router-QgJicixe.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { S as SectionCard } from "./ui-BVv-e2FI.mjs";
import { S as Switch } from "./switch-DIr13Mej.mjs";
import { f as formatIST, r as relativeIST } from "./datetime-DvkGwlJs.mjs";
import { ak as History, R as RefreshCw, aw as Plus, U as UserX, ao as Sparkles, J as Users, ax as TriangleAlert, v as Search, A as ArrowRight, r as ChevronLeft, s as ChevronRight, z as Calendar, l as CircleCheck } from "../_libs/lucide-react.mjs";
const CHANGE_TYPE_CONFIG = {
  AUTO_LEAVE: { label: "Auto: Leave", bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-700 dark:text-amber-300", border: "border-amber-200 dark:border-amber-800" },
  AUTO_UNAVAILABLE: { label: "Auto: Unavailable", bg: "bg-red-50 dark:bg-red-950/40", text: "text-red-700 dark:text-red-300", border: "border-red-200 dark:border-red-800" },
  AUTO_INACTIVITY: { label: "Auto: Inactivity", bg: "bg-orange-50 dark:bg-orange-950/40", text: "text-orange-700 dark:text-orange-300", border: "border-orange-200 dark:border-orange-800" },
  AUTO_CAPACITY: { label: "Auto: Capacity", bg: "bg-purple-50 dark:bg-purple-950/40", text: "text-purple-700 dark:text-purple-300", border: "border-purple-200 dark:border-purple-800" },
  MANUAL: { label: "Manual", bg: "bg-blue-50 dark:bg-blue-950/40", text: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-800" },
  MANUAL_BULK: { label: "Manual Bulk", bg: "bg-indigo-50 dark:bg-indigo-950/40", text: "text-indigo-700 dark:text-indigo-300", border: "border-indigo-200 dark:border-indigo-800" },
  SYSTEM: { label: "System", bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-700 dark:text-slate-300", border: "border-slate-300 dark:border-slate-700" }
};
function AssignmentManagementView() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = reactExports.useState("history");
  const metricsFn = useServerFn(getAssignmentOperationalMetrics);
  const historyFn = useServerFn(listAssignmentHistoryAdmin);
  const leavesFn = useServerFn(listEmployeeLeaves);
  const staffFn = useServerFn(listStaffUsers);
  useServerFn(createEmployeeLeave);
  const cancelLeaveFn = useServerFn(cancelEmployeeLeave);
  const triggerReassignFn = useServerFn(triggerEmployeeReassignment);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [selectedChangeType, setSelectedChangeType] = reactExports.useState("ALL");
  const [selectedEmployeeId, setSelectedEmployeeId] = reactExports.useState("ALL");
  const [selectedPreviousEmpId, setSelectedPreviousEmpId] = reactExports.useState("ALL");
  const [page, setPage] = reactExports.useState(1);
  const pageSize = 20;
  const [leaveModalOpen, setLeaveModalOpen] = reactExports.useState(false);
  const [manualReassignTarget, setManualReassignTarget] = reactExports.useState(null);
  const { data: metrics, isLoading: loadingMetrics, refetch: refetchMetrics } = useQuery({
    queryKey: ["admin.assignment.metrics"],
    queryFn: () => metricsFn(),
    refetchInterval: 3e4
  });
  const { data: historyData, isLoading: loadingHistory, refetch: refetchHistory } = useQuery({
    queryKey: [
      "admin.assignment.history",
      searchQuery,
      selectedChangeType,
      selectedEmployeeId,
      selectedPreviousEmpId,
      page
    ],
    queryFn: () => historyFn({
      data: {
        searchQuery: searchQuery || void 0,
        changeType: selectedChangeType !== "ALL" ? selectedChangeType : void 0,
        employeeId: selectedEmployeeId !== "ALL" ? selectedEmployeeId : void 0,
        previousEmployeeId: selectedPreviousEmpId !== "ALL" ? selectedPreviousEmpId : void 0,
        limit: pageSize,
        offset: (page - 1) * pageSize
      }
    })
  });
  const { data: leavesData, isLoading: loadingLeaves, refetch: refetchLeaves } = useQuery({
    queryKey: ["admin.employee.leaves"],
    queryFn: () => leavesFn()
  });
  const { data: staffList } = useQuery({
    queryKey: ["admin.staff.list"],
    queryFn: () => staffFn()
  });
  const cancelLeaveMutation = useMutation({
    mutationFn: (leaveId) => cancelLeaveFn({ data: { leaveId } }),
    onSuccess: (res) => {
      toast.success("Leave cancelled successfully");
      qc.invalidateQueries({ queryKey: ["admin.employee.leaves"] });
      qc.invalidateQueries({ queryKey: ["admin.assignment.metrics"] });
    }
  });
  const triggerReassignMutation = useMutation({
    mutationFn: (employeeId) => triggerReassignFn({
      data: {
        employeeId,
        reason: "SuperAdmin triggered manual order reassignment",
        changeType: "AUTO_UNAVAILABLE"
      }
    }),
    onSuccess: (res) => {
      toast.success(res.summaryMessage || `Successfully reassigned ${res.reassignedCount} orders!`);
      setManualReassignTarget(null);
      qc.invalidateQueries({ queryKey: ["admin.assignment.metrics"] });
      qc.invalidateQueries({ queryKey: ["admin.assignment.history"] });
      qc.invalidateQueries({ queryKey: ["admin.orders"] });
    }
  });
  const activeLeavesCount = reactExports.useMemo(() => {
    return (leavesData?.rows ?? []).filter((l) => String(l.status).toUpperCase() === "ACTIVE").length;
  }, [leavesData]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "size-6 text-indigo-600" }),
          "Automatic Order Reassignment & Leaves"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400 mt-0.5", children: "Centralized workload redistribution, staff leave scheduling, and immutable assignment transition audit." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: () => {
              refetchMetrics();
              refetchHistory();
              refetchLeaves();
              toast.info("Refreshed assignment data");
            },
            className: "gap-1.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-3.5" }),
              " Refresh"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            className: "gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white",
            onClick: () => setLeaveModalOpen(true),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }),
              " Schedule Leave"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          title: "Staff Unavailable",
          value: metrics?.employeesUnavailableCount ?? 0,
          subtitle: `${activeLeavesCount} on scheduled leave`,
          icon: UserX,
          color: "amber",
          loading: loadingMetrics
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          title: "Reassigned Today",
          value: metrics?.ordersReassignedToday ?? 0,
          subtitle: "Action orders redistributed",
          icon: Sparkles,
          color: "indigo",
          loading: loadingMetrics
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          title: "Auto Reassignments",
          value: metrics?.autoReassignmentsToday ?? 0,
          subtitle: "Engine triggered changes",
          icon: RefreshCw,
          color: "emerald",
          loading: loadingMetrics
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          title: "Manual Assignments",
          value: metrics?.manualReassignmentsToday ?? 0,
          subtitle: "SuperAdmin / Single & Bulk",
          icon: Users,
          color: "blue",
          loading: loadingMetrics
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MetricCard,
        {
          title: "Capacity Alerts",
          value: metrics?.ordersNeedingAssignment ?? 0,
          subtitle: "Orders requiring attention",
          icon: TriangleAlert,
          color: metrics?.ordersNeedingAssignment ? "red" : "slate",
          loading: loadingMetrics
        }
      )
    ] }),
    (metrics?.unavailableEmployees?.length ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-amber-200/80 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900/60 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-4 text-amber-600 dark:text-amber-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200", children: "Unavailable Staff Requiring Workload Redistribution" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3", children: metrics?.unavailableEmployees?.map((emp) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-lg border border-amber-200 dark:border-amber-900/60 shadow-xs",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold text-slate-800 dark:text-slate-200", children: emp.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200", children: emp.unavailabilityReason || "Unavailable" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-slate-500 font-medium", children: [
                  emp.activeActionOrders,
                  " active orders"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "h-7 text-xs border-amber-300 text-amber-900 hover:bg-amber-50",
                onClick: () => triggerReassignMutation.mutate(emp.employeeId),
                disabled: triggerReassignMutation.isPending,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `size-3 mr-1 ${triggerReassignMutation.isPending ? "animate-spin" : ""}` }),
                  "Reassign Now"
                ]
              }
            )
          ]
        },
        emp.employeeId
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setActiveTab("history"),
          className: `px-3 py-1.5 rounded-lg text-sm font-semibold transition ${activeTab === "history" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"}`,
          children: "Assignment Transition History"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setActiveTab("leaves"),
          className: `px-3 py-1.5 rounded-lg text-sm font-semibold transition ${activeTab === "leaves" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"}`,
          children: [
            "Staff Leave Schedule (",
            leavesData?.rows?.length ?? 0,
            ")"
          ]
        }
      )
    ] }),
    activeTab === "history" && /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full md:w-80", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Search order #, customer, ID...",
              value: searchQuery,
              onChange: (e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              },
              className: "pl-9 h-9 text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 w-full md:w-auto flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: selectedChangeType,
              onValueChange: (v) => {
                setSelectedChangeType(v);
                setPage(1);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 w-40 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Change Types" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ALL", children: "All Types" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "AUTO_LEAVE", children: "Auto: Leave" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "AUTO_UNAVAILABLE", children: "Auto: Unavailable" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "AUTO_INACTIVITY", children: "Auto: Inactivity" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "AUTO_CAPACITY", children: "Auto: Capacity" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "MANUAL", children: "Manual" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "MANUAL_BULK", children: "Manual Bulk" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "SYSTEM", children: "System" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: selectedEmployeeId,
              onValueChange: (v) => {
                setSelectedEmployeeId(v);
                setPage(1);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 w-44 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "New Assignee" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ALL", children: "All New Assignees" }),
                  staffList?.rows?.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.id, children: s.full_name || s.email }, s.id))
                ] })
              ]
            }
          ),
          (searchQuery || selectedChangeType !== "ALL" || selectedEmployeeId !== "ALL") && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "ghost",
              onClick: () => {
                setSearchQuery("");
                setSelectedChangeType("ALL");
                setSelectedEmployeeId("ALL");
                setPage(1);
              },
              className: "h-9 text-xs text-slate-500",
              children: "Clear"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Order # / Service" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Customer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Previous Assignee" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center", children: "→" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "New Assignee" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Change Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Reason" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Source / Changed By" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Date / Time (IST)" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-slate-100 dark:divide-slate-800", children: loadingHistory ? Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "animate-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 9, className: "px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-slate-100 dark:bg-slate-800 rounded w-full" }) }) }, i)) : (historyData?.rows?.length ?? 0) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: 9, className: "px-4 py-12 text-center text-slate-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "size-8 mx-auto mb-2 text-slate-300" }),
          "No assignment history records found matching criteria."
        ] }) }) : historyData?.rows?.map((row) => {
          const badge = CHANGE_TYPE_CONFIG[row.changeType] ?? CHANGE_TYPE_CONFIG.SYSTEM;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: `/admin/orders/${row.orderId}`,
                  className: "font-mono font-bold text-indigo-600 dark:text-indigo-400 hover:underline",
                  children: row.applicationCode || "—"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500", children: "Order assignment" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-slate-800 dark:text-slate-200", children: row.customerName || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500", children: row.customerMobile || "" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-600 dark:text-slate-400 font-medium", children: row.previousEmployeeName || "Unassigned" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center text-slate-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-3.5 mx-auto" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-slate-900 dark:text-slate-100", children: row.newEmployeeName || "Unassigned" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`,
                children: badge.label
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-600 dark:text-slate-300 max-w-xs truncate", title: row.reason || "", children: row.reason || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-slate-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-700 dark:text-slate-300", children: row.source || "SYSTEM" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px]", children: row.changedByName })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right text-slate-500 whitespace-nowrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-slate-700 dark:text-slate-300", children: formatIST(row.createdAt) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-400", children: relativeIST(row.createdAt) })
            ] })
          ] }, row.id);
        }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-500", children: [
          "Showing ",
          Math.min(historyData?.total ?? 0, (page - 1) * pageSize + 1),
          " -",
          " ",
          Math.min(page * pageSize, historyData?.total ?? 0),
          " of ",
          historyData?.total ?? 0,
          " events"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              disabled: page <= 1,
              onClick: () => setPage((p) => Math.max(1, p - 1)),
              className: "h-8 gap-1 text-xs",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "size-3.5" }),
                " Previous"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              disabled: page * pageSize >= (historyData?.total ?? 0),
              onClick: () => setPage((p) => p + 1),
              className: "h-8 gap-1 text-xs",
              children: [
                "Next ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3.5" })
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    activeTab === "leaves" && /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-slate-900 dark:text-slate-100", children: "Scheduled & Active Leaves" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "When leave becomes active with auto-reassign enabled, eligible orders are atomically balanced across active staff." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            className: "gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white",
            onClick: () => setLeaveModalOpen(true),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }),
              " Add Leave"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Employee" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Leave Period (IST)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Reason" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Auto Reassign" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Orders Reassigned" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-slate-100 dark:divide-slate-800", children: loadingLeaves ? Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "animate-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-slate-100 dark:bg-slate-800 rounded w-full" }) }) }, i)) : (leavesData?.rows?.length ?? 0) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: 7, className: "px-4 py-10 text-center text-slate-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-8 mx-auto mb-2 text-slate-300" }),
          "No employee leave schedules registered."
        ] }) }) : leavesData?.rows?.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/70 dark:hover:bg-slate-800/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-slate-900 dark:text-slate-100", children: l.employeeName }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-slate-800 dark:text-slate-200", children: [
            formatIST(l.startTime),
            " → ",
            formatIST(l.endTime)
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-slate-600 dark:text-slate-300", children: l.reason || "Scheduled Leave" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: l.autoReassign ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3" }),
            " Enabled"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full", children: "Disabled" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400", children: [
            l.reassignedCount,
            " orders"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${l.status === "active" ? "bg-amber-100 text-amber-800" : l.status === "scheduled" ? "bg-blue-100 text-blue-800" : l.status === "completed" ? "bg-slate-100 text-slate-700" : "bg-red-100 text-red-700"}`,
              children: l.status
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: l.status !== "completed" && l.status !== "cancelled" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "ghost",
              className: "h-7 text-xs text-red-600 hover:bg-red-50",
              onClick: () => cancelLeaveMutation.mutate(l.id),
              disabled: cancelLeaveMutation.isPending,
              children: "Cancel Leave"
            }
          ) })
        ] }, l.id)) })
      ] }) })
    ] }) }),
    leaveModalOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScheduleLeaveDialog,
      {
        open: leaveModalOpen,
        onClose: () => setLeaveModalOpen(false),
        staffList: staffList?.rows ?? [],
        onCreated: () => {
          qc.invalidateQueries({ queryKey: ["admin.employee.leaves"] });
          qc.invalidateQueries({ queryKey: ["admin.assignment.metrics"] });
          qc.invalidateQueries({ queryKey: ["admin.assignment.history"] });
        }
      }
    )
  ] });
}
function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  loading
}) {
  const colorMap = {
    amber: "border-amber-200 bg-amber-50/50 text-amber-800 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/60",
    indigo: "border-indigo-200 bg-indigo-50/50 text-indigo-800 dark:bg-indigo-950/20 dark:text-indigo-300 dark:border-indigo-900/60",
    emerald: "border-emerald-200 bg-emerald-50/50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/60",
    blue: "border-blue-200 bg-blue-50/50 text-blue-800 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-900/60",
    red: "border-red-200 bg-red-50/50 text-red-800 dark:bg-red-950/20 dark:text-red-300 dark:border-red-900/60",
    slate: "border-slate-200 bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-4 rounded-xl border shadow-xs transition ${colorMap[color]}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-wider opacity-80", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4 opacity-70" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-extrabold tracking-tight", children: loading ? "..." : value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] font-medium opacity-75 mt-0.5", children: subtitle })
  ] });
}
function ScheduleLeaveDialog({
  open,
  onClose,
  staffList,
  onCreated
}) {
  const [employeeId, setEmployeeId] = reactExports.useState("");
  const [startTime, setStartTime] = reactExports.useState(() => {
    const now = /* @__PURE__ */ new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
  });
  const [endTime, setEndTime] = reactExports.useState(() => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1e3);
    return new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
  });
  const [reason, setReason] = reactExports.useState("Annual Leave");
  const [autoReassign, setAutoReassign] = reactExports.useState(true);
  const createLeaveFn = useServerFn(createEmployeeLeave);
  const mutation = useMutation({
    mutationFn: () => createLeaveFn({
      data: {
        employeeId,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        reason,
        autoReassign
      }
    }),
    onSuccess: (res) => {
      const reassignedCount = res.redistributionSummary?.reassignedCount ?? 0;
      toast.success(`Leave scheduled! ${reassignedCount ? `${reassignedCount} orders reassigned.` : ""}`);
      onCreated();
      onClose();
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-slate-900 dark:text-slate-100", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-5 text-indigo-600" }),
      "Schedule Employee Leave"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold", children: "Select Employee" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: employeeId, onValueChange: setEmployeeId, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select staff member..." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: staffList.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.id, children: s.full_name || s.email }, s.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold", children: "Start Date & Time" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "datetime-local",
              value: startTime,
              onChange: (e) => setStartTime(e.target.value),
              className: "text-xs"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold", children: "End Date & Time" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "datetime-local",
              value: endTime,
              onChange: (e) => setEndTime(e.target.value),
              className: "text-xs"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold", children: "Reason for Leave" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "e.g. Vacation, Sick Leave, Family Emergency",
            value: reason,
            onChange: (e) => setReason(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-900", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-slate-800 dark:text-slate-200", children: "Auto-Reassign Orders" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500", children: "Instantly redistribute active action-required orders across eligible staff." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: autoReassign, onCheckedChange: setAutoReassign })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => mutation.mutate(),
          disabled: !employeeId || mutation.isPending,
          className: "bg-indigo-600 hover:bg-indigo-700 text-white",
          children: mutation.isPending ? "Scheduling..." : "Schedule Leave"
        }
      )
    ] })
  ] }) });
}
export {
  AssignmentManagementView as A
};
