import { createFileRoute, Link, Outlet, useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
import { Search, Filter, Inbox, ArrowLeft, RefreshCw } from "lucide-react";
import { listTickets, type TicketStatus, type TicketPriority } from "@/lib/crm/tickets.functions";

export const Route = createFileRoute("/admin/support/tickets")({
  head: () => ({
    meta: [
      { title: "Support Tickets — BHS Helpdesk" },
      { name: "description", content: "Customer support tickets with clean email threading." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: SupportTicketsLayout,
});

const STATUS_PILL: Record<TicketStatus, { bg: string; fg: string; label: string }> = {
  open: { bg: "bg-blue-50 text-blue-700 border-blue-200", fg: "#1d4ed8", label: "Open" },
  in_progress: { bg: "bg-purple-50 text-purple-700 border-purple-200", fg: "#6d28d9", label: "In Progress" },
  waiting_customer: { bg: "bg-amber-50 text-amber-700 border-amber-200", fg: "#92400e", label: "Waiting Customer" },
  resolved: { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", fg: "#15803d", label: "Resolved" },
  closed: { bg: "bg-slate-100 text-slate-600 border-slate-200", fg: "#475569", label: "Closed" },
};

const PRIORITY_PILL: Record<TicketPriority, { bg: string; fg: string; label: string }> = {
  urgent: { bg: "bg-red-100 text-red-800", fg: "#991b1b", label: "Urgent" },
  high: { bg: "bg-orange-100 text-orange-800", fg: "#9a3412", label: "High" },
  medium: { bg: "bg-blue-100 text-blue-800", fg: "#1d4ed8", label: "Normal" },
  low: { bg: "bg-slate-100 text-slate-700", fg: "#475569", label: "Low" },
};

function rel(iso: string | null | undefined) {
  if (!iso) return "";
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function SupportTicketsLayout() {
  const listFn = useServerFn(listTickets);
  const [qRaw, setQRaw] = useState("");
  const [q, setQ] = useState("");

  const params = useParams({ strict: false }) as { ticketId?: string };
  const activeId = params?.ticketId;

  // 300ms Debounce search in ticket detail sidebar
  useEffect(() => {
    const t = setTimeout(() => setQ(qRaw), 300);
    return () => clearTimeout(t);
  }, [qRaw]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["support-tickets-quick-sidebar", { q }],
    queryFn: () =>
      listFn({
        data: {
          page: 1,
          pageSize: 50,
          q,
          sort: "updated",
          scope: "all",
        },
      }),
    enabled: Boolean(activeId),
    refetchInterval: 20_000,
  });

  const tickets = data?.tickets ?? [];

  // When no ticket is selected, render Outlet directly (Index Table View)
  if (!activeId) {
    return (
      <div className="h-[calc(100vh-56px)] flex-1 min-w-0 bg-slate-50 overflow-hidden">
        <Outlet />
      </div>
    );
  }

  // When a ticket IS opened, show 3-column workspace with compact list on left (Reference 2)
  return (
    <div className="h-[calc(100vh-56px)] flex bg-slate-50 overflow-hidden font-sans">
      {/* ── Left Column: Ticket Switcher List ── */}
      <aside className="hidden lg:flex w-[290px] shrink-0 flex-col border-r border-slate-200 bg-white select-none">
        <div className="p-3 border-b border-slate-200 space-y-2 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <Link
              to="/admin/support/tickets"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Inbox
            </Link>
            <button
              onClick={() => refetch()}
              className="p-1 rounded text-slate-400 hover:text-slate-600 transition-colors"
              title="Refresh list"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              value={qRaw}
              onChange={(e) => setQRaw(e.target.value)}
              placeholder="Search tickets..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {isLoading ? (
            <div className="p-6 text-center text-xs text-slate-400">Loading tickets…</div>
          ) : tickets.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">No matching tickets</div>
          ) : (
            tickets.map((t) => {
              const isActive = t.id === activeId;
              const st = STATUS_PILL[t.status] || STATUS_PILL.open;
              const pr = PRIORITY_PILL[t.priority] || PRIORITY_PILL.medium;
              const unread =
                t.last_customer_message_at &&
                (!t.last_staff_message_at ||
                  new Date(t.last_customer_message_at) > new Date(t.last_staff_message_at));

              return (
                <Link
                  key={t.id}
                  to="/admin/support/tickets/$ticketId"
                  params={{ ticketId: t.id }}
                  className={`block p-3 text-xs transition-all relative ${
                    isActive
                      ? "bg-indigo-50/80 border-l-4 border-indigo-600 shadow-xs"
                      : "hover:bg-slate-50 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-mono text-[11px] font-bold text-slate-600">
                      {t.ticket_number}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">{rel(t.updated_at)}</span>
                  </div>

                  <div className="font-semibold text-slate-900 truncate leading-snug">
                    {unread && <span className="inline-block w-2 h-2 rounded-full bg-indigo-600 mr-1.5" />}
                    {t.customer_name || "Customer"}
                  </div>

                  <div className="text-slate-500 truncate text-[11px] mt-0.5">
                    {t.subject || "(No Subject)"}
                  </div>

                  <div className="flex items-center gap-1.5 mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold border ${st.bg}`}>
                      {st.label}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${pr.bg}`}>
                      {pr.label}
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </aside>

      {/* ── Center & Right Columns (Conversation + Customer Context) ── */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
