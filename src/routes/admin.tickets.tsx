import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Inbox, LifeBuoy, Search } from "lucide-react";
import { listTickets, type TicketStatus } from "@/lib/crm/tickets.functions";
import { AddTicketDialog } from "@/components/admin/AddTicketDialog";
import { SectionCard, TableSkeleton, FilterChip } from "@/components/admin/ui";
import { useRole } from "@/hooks/useRole";

export const Route = createFileRoute("/admin/tickets")({
  head: () => ({
    meta: [{ title: "Support Tickets — Udyam Ops OS" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: TicketsPage,
});

const STATUSES: { value: TicketStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "waiting_customer", label: "Waiting on Customer" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

const STATUS_COLOR: Record<TicketStatus, { bg: string; fg: string }> = {
  open: { bg: "rgba(2,132,199,0.12)", fg: "#0369a1" },
  in_progress: { bg: "rgba(217,119,6,0.14)", fg: "#b45309" },
  waiting_customer: { bg: "rgba(139,92,246,0.14)", fg: "#6d28d9" },
  resolved: { bg: "rgba(22,163,74,0.14)", fg: "#15803d" },
  closed: { bg: "rgba(100,116,139,0.14)", fg: "#475569" },
};

const PRIORITY_COLOR: Record<string, { bg: string; fg: string; label: string }> = {
  high: { bg: "rgba(220,38,38,0.12)", fg: "#b91c1c", label: "High" },
  medium: { bg: "rgba(217,119,6,0.12)", fg: "#b45309", label: "Medium" },
  low: { bg: "rgba(100,116,139,0.12)", fg: "#475569", label: "Low" },
};

function TicketsPage() {
  const role = useRole();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<TicketStatus | "all">("all");
  const [scope, setScope] = useState<"mine" | "all">("all");
  const [q, setQ] = useState("");

  const fn = useServerFn(listTickets);
  const { data, isLoading } = useQuery({
    queryKey: ["tickets-list", page, status, scope, q],
    queryFn: () =>
      fn({
        data: {
          page,
          pageSize: 25,
          status: status === "all" ? undefined : status,
          scope,
          q,
        },
      }),
    refetchInterval: 60_000,
  });

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 25));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-medium tracking-tight" style={{ color: "var(--admin-fg)" }}>
            Support Tickets
          </h1>
          <p className="text-sm" style={{ color: "var(--admin-fg-muted)" }}>
            Customer-raised issues. Track replies, internal notes, and resolution time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="inline-flex overflow-hidden rounded-md border text-xs font-medium"
            style={{ borderColor: "var(--admin-border)" }}
          >
            <button
              onClick={() => setScope("mine")}
              className="px-3 py-1.5"
              style={{
                background: scope === "mine" ? "var(--admin-accent)" : "var(--admin-surface)",
                color: scope === "mine" ? "var(--admin-accent-fg)" : "var(--admin-fg)",
              }}
            >
              My Tickets
            </button>
            <button
              onClick={() => setScope("all")}
              className="px-3 py-1.5"
              style={{
                background: scope === "all" ? "var(--admin-accent)" : "var(--admin-surface)",
                color: scope === "all" ? "var(--admin-accent-fg)" : "var(--admin-fg)",
              }}
            >
              All
            </button>
          </div>
          {role.can("tickets") && <AddTicketDialog />}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search
            className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2"
            style={{ color: "var(--admin-fg-muted)" }}
          />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search ticket number or subject"
            className="w-72 rounded-md border bg-transparent py-1.5 pl-8 pr-3 text-xs"
            style={{ borderColor: "var(--admin-border)", color: "var(--admin-fg)" }}
          />
        </div>
        {STATUSES.map((s) => (
          <FilterChip
            key={s.value}
            active={status === s.value}
            onClick={() => {
              setStatus(s.value);
              setPage(1);
            }}
          >
            {s.label}
          </FilterChip>
        ))}
      </div>

      <SectionCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className="text-left text-[11px] uppercase tracking-wide"
                style={{ color: "var(--admin-fg-muted)" }}
              >
                <th className="px-4 py-2">Ticket No</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Service</th>
                <th className="px-4 py-2">Subject</th>
                <th className="px-4 py-2">Priority</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Assigned</th>
                <th className="px-4 py-2">Created</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={9}>
                    <TableSkeleton rows={6} cols={9} />
                  </td>
                </tr>
              )}
              {!isLoading && (data?.tickets ?? []).length === 0 && (
                <tr>
                  <td colSpan={9}>
                    <Empty />
                  </td>
                </tr>
              )}
              {!isLoading &&
                (data?.tickets ?? []).map((t, i) => {
                  const sc = STATUS_COLOR[t.status];
                  const pc = PRIORITY_COLOR[t.priority];
                  return (
                    <tr
                      key={t.id}
                      className="border-t"
                      style={{
                        borderColor: "var(--admin-border)",
                        background: i % 2 ? "var(--admin-surface-2)" : "transparent",
                      }}
                    >
                      <td className="px-4 py-2.5 font-mono text-xs">{t.ticket_number ?? "—"}</td>
                      <td className="px-4 py-2.5">
                        {t.customer_id ? (
                          <Link
                            to="/admin/customers/$customerId"
                            params={{ customerId: t.customer_id }}
                            style={{ color: "var(--admin-accent)" }}
                          >
                            {t.customer_name ?? "—"}
                          </Link>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-xs" style={{ color: "var(--admin-fg-muted)" }}>
                        {t.service_name ?? "—"}
                      </td>
                      <td className="px-4 py-2.5" style={{ color: "var(--admin-fg)" }}>
                        {t.subject}
                      </td>
                      <td className="px-4 py-2.5">
                        <Pill bg={pc.bg} fg={pc.fg}>
                          {pc.label}
                        </Pill>
                      </td>
                      <td className="px-4 py-2.5">
                        <Pill bg={sc.bg} fg={sc.fg}>
                          {t.status.replace(/_/g, " ")}
                        </Pill>
                      </td>
                      <td className="px-4 py-2.5 text-xs" style={{ color: "var(--admin-fg-muted)" }}>
                        {t.assigned_name ?? "Unassigned"}
                      </td>
                      <td className="px-4 py-2.5 text-xs" style={{ color: "var(--admin-fg-muted)" }}>
                        {formatIST(t.created_at)}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <Link
                          to="/admin/tickets/$ticketId"
                          params={{ ticketId: t.id }}
                          className="text-xs"
                          style={{ color: "var(--admin-accent)" }}
                        >
                          Open →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <footer
          className="flex items-center justify-between border-t px-4 py-2 text-xs"
          style={{ borderColor: "var(--admin-border)", color: "var(--admin-fg-muted)" }}
        >
          <span>
            {total === 0
              ? "0 tickets"
              : `Page ${page} of ${totalPages} · ${total.toLocaleString("en-IN")} tickets`}
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 rounded border px-2 py-1 disabled:opacity-40"
              style={{ borderColor: "var(--admin-border)" }}
            >
              <ChevronLeft className="size-3" /> Prev
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="inline-flex items-center gap-1 rounded border px-2 py-1 disabled:opacity-40"
              style={{ borderColor: "var(--admin-border)" }}
            >
              Next <ChevronRight className="size-3" />
            </button>
          </div>
        </footer>
      </SectionCard>
    </div>
  );
}

function Pill({ bg, fg, children }: { bg: string; fg: string; children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize"
      style={{ background: bg, color: fg }}
    >
      <span className="size-1.5 rounded-full" style={{ background: fg }} />
      {children}
    </span>
  );
}

function Empty() {
  return (
    <div
      className="flex flex-col items-center gap-2 py-12 text-center"
      style={{ color: "var(--admin-fg-muted)" }}
    >
      <div
        className="size-10 rounded-full p-2"
        style={{ background: "var(--admin-surface-2)" }}
      >
        <LifeBuoy className="size-6" />
      </div>
      <div className="text-sm" style={{ color: "var(--admin-fg)" }}>
        No tickets match these filters.
      </div>
      <AddTicketDialog triggerLabel="Create your first ticket" />
    </div>
  );
}

function formatIST(iso: string): string {
  const d = new Date(iso);
  const fmt = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return fmt.format(d).replace(",", "");
}
