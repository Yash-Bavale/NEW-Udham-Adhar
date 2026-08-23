import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import {
  Search,
  RefreshCw,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader2,
  Mail,
  User,
  Sparkles,
  Inbox,
} from "lucide-react";
import { listTickets, type TicketStatus, type TicketPriority } from "@/lib/crm/tickets.functions";
import { SupportSidebar, type TicketScopeView } from "@/components/admin/tickets/SupportSidebar";

export const Route = createFileRoute("/admin/support/tickets/")({
  head: () => ({
    meta: [
      { title: "Support Tickets — BHS Helpdesk" },
      { name: "description", content: "Modern Helpdesk Ticket Inbox" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: HelpdeskInboxPage,
});

const STATUS_BADGE: Record<TicketStatus, { bg: string; fg: string; border: string; label: string }> = {
  open: { bg: "bg-blue-50", fg: "text-blue-700", border: "border-blue-200", label: "Open" },
  in_progress: { bg: "bg-purple-50", fg: "text-purple-700", border: "border-purple-200", label: "In Progress" },
  waiting_customer: { bg: "bg-amber-50", fg: "text-amber-700", border: "border-amber-200", label: "Waiting Customer" },
  resolved: { bg: "bg-emerald-50", fg: "text-emerald-700", border: "border-emerald-200", label: "Resolved" },
  closed: { bg: "bg-slate-100", fg: "text-slate-600", border: "border-slate-200", label: "Closed" },
};

const PRIORITY_BADGE: Record<TicketPriority, { bg: string; fg: string; label: string }> = {
  urgent: { bg: "bg-red-100", fg: "text-red-800", label: "Urgent" },
  high: { bg: "bg-orange-100", fg: "text-orange-800", label: "High" },
  medium: { bg: "bg-blue-100", fg: "text-blue-800", label: "Normal" },
  low: { bg: "bg-slate-100", fg: "text-slate-700", label: "Low" },
};

function relTime(iso: string | null | undefined) {
  if (!iso) return "—";
  const sec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (sec < 60) return `${sec}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}

function HelpdeskInboxPage() {
  const navigate = useNavigate();
  const listFn = useServerFn(listTickets);

  const [scope, setScope] = useState<TicketScopeView>("all");
  const [searchRaw, setSearchRaw] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  // 300ms Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setSearchDebounced(searchRaw);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchRaw]);

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["helpdesk-tickets-table", { scope, searchDebounced, page, pageSize, statusFilter, priorityFilter }],
    queryFn: () =>
      listFn({
        data: {
          page,
          pageSize,
          q: searchDebounced,
          scope,
          status: statusFilter === "all" ? undefined : (statusFilter as TicketStatus),
          priority: priorityFilter === "all" ? undefined : (priorityFilter as TicketPriority),
          sort: "newest",
        },
      }),
    refetchInterval: 25_000,
  });

  const tickets = data?.tickets ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="h-full flex overflow-hidden bg-slate-50 font-sans">
      {/* ── Left Navigation Sidebar (Reference 1) ── */}
      <SupportSidebar
        activeScope={scope}
        onSelectScope={(s) => {
          setScope(s);
          setPage(1);
        }}
      />

      {/* ── Main Content Area ── */}
      <div className="flex-1 min-w-0 flex flex-col h-full bg-white">
        {/* Top Action Bar (Reference 1 Top Header) */}
        <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-white">
          {/* Search Input */}
          <div className="relative w-80 max-w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchRaw}
              onChange={(e) => setSearchRaw(e.target.value)}
              placeholder="Search Ticket ID, Customer, Email, Subject..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            {searchRaw && (
              <button
                onClick={() => setSearchRaw("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filters & Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Entries Per Page */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>Show:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting_customer">Waiting Customer</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Normal</option>
              <option value="low">Low</option>
            </select>

            {/* Refresh */}
            <button
              onClick={() => refetch()}
              disabled={isRefetching}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
              title="Refresh tickets"
            >
              <RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin text-indigo-600" : ""}`} />
            </button>
          </div>
        </div>

        {/* ── Ticket Table View (Reference 1 Table Layout) ── */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              <span className="text-xs">Loading helpdesk inbox…</span>
            </div>
          ) : tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <Inbox className="w-6 h-6" />
              </div>
              <div className="font-semibold text-sm text-slate-800">No tickets found</div>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                {searchDebounced ? `No tickets matching "${searchDebounced}"` : "Your inbox is clear for this view filter."}
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">S.No</th>
                  <th className="py-3 px-4 w-36">Ticket ID</th>
                  <th className="py-3 px-4 w-48">Name</th>
                  <th className="py-3 px-4 w-56">Email</th>
                  <th className="py-3 px-4 min-w-[220px]">Subject</th>
                  <th className="py-3 px-4 w-32">Status</th>
                  <th className="py-3 px-4 w-24">Priority</th>
                  <th className="py-3 px-4 w-28 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {tickets.map((t, idx) => {
                  const sNo = (page - 1) * pageSize + idx + 1;
                  const st = STATUS_BADGE[t.status] || STATUS_BADGE.open;
                  const pr = PRIORITY_BADGE[t.priority] || PRIORITY_BADGE.medium;
                  const unread =
                    t.last_customer_message_at &&
                    (!t.last_staff_message_at ||
                      new Date(t.last_customer_message_at) > new Date(t.last_staff_message_at));

                  return (
                    <tr
                      key={t.id}
                      onClick={() => navigate({ to: "/admin/support/tickets/$ticketId", params: { ticketId: t.id } })}
                      className="hover:bg-indigo-50/40 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 text-center">
                        {String(sNo).padStart(2, "0")}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] font-bold text-indigo-600 group-hover:underline">
                        {t.ticket_number}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-900 truncate max-w-[180px]">
                        <div className="flex items-center gap-1.5">
                          {unread && <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />}
                          <span className="truncate">{t.customer_name || "Customer"}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px] truncate max-w-[200px]">
                        {t.customer_email || "—"}
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-900 max-w-[320px]">
                        <div className="truncate">{t.subject || "(No Subject)"}</div>
                        {t.description && (
                          <div className="text-[11px] text-slate-400 truncate mt-0.5 font-normal">
                            {t.description.slice(0, 80)}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${st.bg} ${st.fg} ${st.border}`}>
                          {st.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${pr.bg} ${pr.fg}`}>
                          {pr.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {relTime(t.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Table Footer & Pagination (Reference 1 Footer) ── */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-800">{total > 0 ? (page - 1) * pageSize + 1 : 0}</span> to{" "}
            <span className="font-semibold text-slate-800">{Math.min(page * pageSize, total)}</span> of{" "}
            <span className="font-semibold text-slate-800">{total}</span> tickets
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition-colors inline-flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>

            <span className="px-3 py-1 font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg">
              {page} / {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition-colors inline-flex items-center gap-1"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
