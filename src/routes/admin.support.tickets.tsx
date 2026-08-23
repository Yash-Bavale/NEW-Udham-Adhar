import { createFileRoute, Link, Outlet, useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, Filter, Inbox, ChevronDown } from "lucide-react";
import { listTickets, type TicketStatus, type TicketPriority } from "@/lib/crm/tickets.functions";

export const Route = createFileRoute("/admin/support/tickets")({
  head: () => ({
    meta: [
      { title: "Support Tickets — BHS CRM" },
      { name: "description", content: "Customer support tickets with clean email threading." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: SupportTicketsLayout,
});

const STATUS_PILL: Record<TicketStatus, { bg: string; fg: string; label: string }> = {
  open:              { bg: "#dbeafe", fg: "#1d4ed8", label: "Open" },
  in_progress:       { bg: "#ede9fe", fg: "#6d28d9", label: "In Progress" },
  waiting_customer:  { bg: "#fef3c7", fg: "#92400e", label: "Waiting Customer" },
  resolved:          { bg: "#dcfce7", fg: "#15803d", label: "Resolved" },
  closed:            { bg: "#f1f5f9", fg: "#475569", label: "Closed" },
};

const PRIORITY_PILL: Record<TicketPriority, { bg: string; fg: string; label: string }> = {
  urgent: { bg: "#fee2e2", fg: "#991b1b", label: "Urgent" },
  high:   { bg: "#ffedd5", fg: "#9a3412", label: "High" },
  medium: { bg: "#dbeafe", fg: "#1d4ed8", label: "Medium" },
  low:    { bg: "#f1f5f9", fg: "#475569", label: "Low" },
};

function rel(iso: string | null | undefined) {
  if (!iso) return "";
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return `${Math.floor(s / 604800)}w ago`;
}

function SupportTicketsLayout() {
  const listFn = useServerFn(listTickets);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | "all">("all");
  const [sort, setSort] = useState<"newest" | "oldest" | "updated">("newest");
  const [showFilters, setShowFilters] = useState(false);

  const params = useParams({ strict: false }) as { ticketId?: string };
  const activeId = params?.ticketId;

  const { data, isLoading } = useQuery({
    queryKey: ["support-tickets-list", { q, statusFilter, priorityFilter, sort }],
    queryFn: () =>
      listFn({
        data: {
          page: 1,
          pageSize: 100,
          q,
          status: statusFilter === "all" ? undefined : statusFilter,
          priority: priorityFilter === "all" ? undefined : priorityFilter,
          sort,
          scope: "all",
          unassignedOnly: false,
        },
      }),
  });

  const tickets = data?.tickets ?? [];
  const total = data?.total ?? 0;

  const rows = useMemo(() => tickets, [tickets]);

  return (
    <div className="h-[calc(100vh-56px)] flex bg-slate-50">
      {/* ── Column A: Ticket List ─────────────────────────── */}
      <aside className="hidden md:flex w-[300px] shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="p-3 border-b border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
              <Inbox className="h-4 w-4 text-slate-500" /> Tickets
            </h1>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 rounded px-1.5 py-0.5">
              {total}
            </span>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search TKT-… or subject"
              className="w-full pl-7 pr-2 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 px-2 py-1 rounded border border-slate-200 bg-white"
            >
              <Filter className="h-3 w-3" /> Filters
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="ml-auto text-xs text-slate-600 bg-white border border-slate-200 rounded px-1.5 py-1"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="updated">Recently updated</option>
            </select>
          </div>
          {showFilters && (
            <div className="mt-2 space-y-1.5">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full text-xs bg-white border border-slate-200 rounded px-2 py-1"
              >
                <option value="all">All statuses</option>
                {(Object.keys(STATUS_PILL) as TicketStatus[]).map((s) => (
                  <option key={s} value={s}>{STATUS_PILL[s].label}</option>
                ))}
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                className="w-full text-xs bg-white border border-slate-200 rounded px-2 py-1"
              >
                <option value="all">All priorities</option>
                {(Object.keys(PRIORITY_PILL) as TicketPriority[]).map((p) => (
                  <option key={p} value={p}>{PRIORITY_PILL[p].label}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-center text-xs text-slate-500">Loading…</div>
          ) : rows.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">No tickets match.</div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {rows.map((t) => {
                const isActive = t.id === activeId;
                const stPill = STATUS_PILL[t.status];
                const prPill = PRIORITY_PILL[t.priority];
                const unread =
                  t.last_customer_message_at &&
                  (!t.last_staff_message_at ||
                    new Date(t.last_customer_message_at) > new Date(t.last_staff_message_at));
                return (
                  <li key={t.id}>
                    <Link
                      to="/admin/support/tickets/$ticketId"
                      params={{ ticketId: t.id }}
                      className="block relative px-3 py-2.5 hover:bg-slate-50 transition-colors"
                      style={
                        isActive
                          ? { background: "#eff6ff", borderLeft: "3px solid #1e3a5f", paddingLeft: "9px" }
                          : undefined
                      }
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono text-slate-500 truncate">
                          {t.ticket_number}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">{rel(t.updated_at)}</span>
                      </div>
                      <div className="mt-0.5 text-[13px] text-slate-900 truncate leading-snug">
                        {unread && (
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600 align-middle mr-1.5" />
                        )}
                        {t.subject || "(no subject)"}
                      </div>
                      <div className="flex items-center gap-1 mt-1.5">
                        <span
                          className="inline-flex text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                          style={{ background: stPill.bg, color: stPill.fg }}
                        >
                          {stPill.label}
                        </span>
                        <span
                          className="inline-flex text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                          style={{ background: prPill.bg, color: prPill.fg }}
                        >
                          {prPill.label}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>

      {/* ── Column B + C ────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
