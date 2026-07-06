import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import DOMPurify from "dompurify";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft, ChevronRight, Loader2, Lock, Mail, MailCheck, MailX, Send,
  Sparkles, PlayCircle, CheckCircle2, RotateCcw, XCircle, Package, Search,
  Filter, ArrowUpDown, Copy, Printer, Download, AlertTriangle, User, FileText,
  Clock, Zap, MessageSquare, StickyNote, ExternalLink, Paperclip, Bold,
  Italic, Underline as UIcon, List, ListOrdered, Link as LinkIcon, Smile,
  ChevronDown, Building2, IndianRupee, Circle,
} from "lucide-react";
import {
  listTickets, getTicket, updateTicket, replyToTicket,
  type TicketStatus,
} from "@/lib/crm/tickets.functions";
import { getTicketWorkspace } from "@/lib/crm/ticket-workspace.functions";
import { resolveTicketAndResumeOrder } from "@/lib/tickets/ticket-actions.functions";
import { listStaffForAssignment } from "@/lib/crm/tasks.functions";
import { listCannedResponses } from "@/lib/tickets/canned-responses.functions";
import { useRealtimeTable } from "@/hooks/useRealtimeTable";
import { cleanEmailBody } from "@/lib/mail/thread-clean";

export const Route = createFileRoute("/admin/tickets/$ticketId")({
  head: () => ({
    meta: [{ title: "Ticket — Udyam Ops OS" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: TicketWorkspacePage,
});

// ─────────────────────────── tokens ───────────────────────────

const TICKET_STATUSES: TicketStatus[] = ["open", "in_progress", "waiting_customer", "resolved", "closed"];
const PRIORITIES = ["urgent", "high", "medium", "low"] as const;

const STATUS_TONE: Record<string, { bg: string; fg: string; ring: string }> = {
  open:              { bg: "#e0f2fe", fg: "#075985", ring: "#0284c7" },
  in_progress:       { bg: "#fef3c7", fg: "#92400e", ring: "#d97706" },
  waiting_customer:  { bg: "#ede9fe", fg: "#5b21b6", ring: "#7c3aed" },
  resolved:          { bg: "#dcfce7", fg: "#166534", ring: "#16a34a" },
  closed:            { bg: "#f1f5f9", fg: "#475569", ring: "#64748b" },
};

const PRIORITY_TONE: Record<string, { bg: string; fg: string }> = {
  urgent: { bg: "#fee2e2", fg: "#991b1b" },
  high:   { bg: "#ffedd5", fg: "#9a3412" },
  medium: { bg: "#e0f2fe", fg: "#075985" },
  low:    { bg: "#f1f5f9", fg: "#475569" },
};

// ─────────────────────────── formatters ───────────────────────────

function formatIST(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  }).format(new Date(iso)).replace(",", "");
}

function relTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return `${Math.floor(s / 604800)}w ago`;
}

function initials(name: string | null | undefined): string {
  if (!name) return "?";
  return name.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

function avatarBg(seed: string): string {
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return colors[h % colors.length];
}

function inr(n: number | null | undefined): string {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

// ─────────────────────────── main page ───────────────────────────

function TicketWorkspacePage() {
  const { ticketId } = Route.useParams();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const workspaceFn = useServerFn(getTicketWorkspace);
  const { data, isLoading } = useQuery({
    queryKey: ["ticket-workspace", ticketId],
    queryFn: () => workspaceFn({ data: { ticketId } }),
  });

  // Realtime: refresh workspace on any change to this ticket's replies/status.
  useRealtimeTable("ticket_replies", () =>
    qc.invalidateQueries({ queryKey: ["ticket-workspace", ticketId] }),
    { filter: `ticket_id=eq.${ticketId}` }
  );
  useRealtimeTable("support_tickets", () =>
    qc.invalidateQueries({ queryKey: ["ticket-workspace", ticketId] }),
    { filter: `id=eq.${ticketId}` }
  );

  const [leftOpen, setLeftOpen] = useState(() => (typeof window === "undefined" ? true : localStorage.getItem("ticket-left") !== "0"));
  const [rightOpen, setRightOpen] = useState(() => (typeof window === "undefined" ? true : localStorage.getItem("ticket-right") !== "0"));
  useEffect(() => { localStorage.setItem("ticket-left", leftOpen ? "1" : "0"); }, [leftOpen]);
  useEffect(() => { localStorage.setItem("ticket-right", rightOpen ? "1" : "0"); }, [rightOpen]);

  const replyRef = useRef<HTMLTextAreaElement | null>(null);
  const listSearchRef = useRef<HTMLInputElement | null>(null);
  const [composerMode, setComposerMode] = useState<"reply" | "note">("reply");

  // Keyboard shortcuts
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable) return;
      if (e.key === "r" || e.key === "R") { e.preventDefault(); setComposerMode("reply"); replyRef.current?.focus(); }
      else if (e.key === "n" || e.key === "N") { e.preventDefault(); setComposerMode("note"); replyRef.current?.focus(); }
      else if (e.key === "f" || e.key === "F") { e.preventDefault(); listSearchRef.current?.focus(); }
      else if (e.key === "Escape") { e.preventDefault(); navigate({ to: "/admin/tickets" }); }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);

  if (isLoading || !data) {
    return (
      <div className="flex h-[calc(100vh-6rem)] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto size-8 animate-spin" style={{ color: "var(--admin-fg-muted)" }} />
          <p className="mt-3 text-sm" style={{ color: "var(--admin-fg-muted)" }}>Loading ticket…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] gap-3 -mt-2">
      {/* LEFT — ticket list */}
      <AnimatePresence initial={false}>
        {leftOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 overflow-hidden"
          >
            <TicketListRail activeId={ticketId} searchRef={listSearchRef} />
          </motion.aside>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setLeftOpen((v) => !v)}
        className="my-3 flex h-8 w-4 items-center justify-center self-start rounded-r-md border transition-colors hover:bg-black/5"
        style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)", color: "var(--admin-fg-muted)" }}
        title={leftOpen ? "Collapse list" : "Show list"}
      >
        {leftOpen ? <ChevronLeft className="size-3" /> : <ChevronRight className="size-3" />}
      </button>

      {/* CENTER — conversation workspace */}
      <main className="flex flex-1 min-w-0 flex-col overflow-hidden rounded-2xl border shadow-sm"
        style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
      >
        <TicketHeader data={data} ticketId={ticketId} composerMode={composerMode} setComposerMode={setComposerMode} focusReply={() => replyRef.current?.focus()} />
        <TicketThread data={data} />
        <ReplyComposer ticketId={ticketId} data={data} composerMode={composerMode} setComposerMode={setComposerMode} textareaRef={replyRef} />
      </main>

      <button
        type="button"
        onClick={() => setRightOpen((v) => !v)}
        className="my-3 flex h-8 w-4 items-center justify-center self-start rounded-l-md border transition-colors hover:bg-black/5"
        style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)", color: "var(--admin-fg-muted)" }}
        title={rightOpen ? "Collapse details" : "Show details"}
      >
        {rightOpen ? <ChevronRight className="size-3" /> : <ChevronLeft className="size-3" />}
      </button>

      {/* RIGHT — context rail */}
      <AnimatePresence initial={false}>
        {rightOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 360, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 overflow-hidden"
          >
            <TicketContextRail data={data} ticketId={ticketId} />
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LEFT — TicketListRail
// ═══════════════════════════════════════════════════════════════

function TicketListRail({ activeId, searchRef }: { activeId: string; searchRef: React.RefObject<HTMLInputElement | null> }) {
  const listFn = useServerFn(listTickets);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<TicketStatus | "">("");
  const [priority, setPriority] = useState<string>("");
  const [sort, setSort] = useState<"newest" | "oldest" | "updated" | "unassigned">("newest");
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["tickets-rail", q, status, priority, sort],
    queryFn: () => listFn({ data: { page: 1, pageSize: 50, q, status: status || undefined, priority: (priority as any) || undefined, sort } }),
    staleTime: 15_000,
  });

  return (
    <div className="flex h-full flex-col rounded-2xl border shadow-sm overflow-hidden"
      style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
    >
      <header className="border-b px-4 py-3" style={{ borderColor: "var(--admin-border)" }}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold" style={{ color: "var(--admin-fg)" }}>Tickets</h2>
          <span className="text-[11px] tabular-nums" style={{ color: "var(--admin-fg-muted)" }}>
            {data?.total ?? 0}
          </span>
        </div>
        <div className="relative mt-2">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5" style={{ color: "var(--admin-fg-muted)" }} />
          <input
            ref={searchRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search TKT-… or subject  (F)"
            className="w-full rounded-lg border pl-8 pr-2 py-1.5 text-xs outline-none transition-shadow focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]"
            style={{ background: "var(--admin-surface-2)", borderColor: "var(--admin-border)", color: "var(--admin-fg)" }}
          />
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] transition-colors hover:bg-black/5"
            style={{ borderColor: "var(--admin-border)", color: "var(--admin-fg-muted)" }}
          >
            <Filter className="size-3" /> Filters
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="rounded-md border bg-transparent px-2 py-1 text-[11px] outline-none"
            style={{ borderColor: "var(--admin-border)", color: "var(--admin-fg-muted)" }}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="updated">Last Updated</option>
            <option value="unassigned">Unassigned</option>
          </select>
        </div>
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 space-y-1.5">
                <select value={status} onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full rounded-md border bg-transparent px-2 py-1 text-[11px]"
                  style={{ borderColor: "var(--admin-border)", color: "var(--admin-fg)" }}>
                  <option value="">All statuses</option>
                  {TICKET_STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                </select>
                <select value={priority} onChange={(e) => setPriority(e.target.value)}
                  className="w-full rounded-md border bg-transparent px-2 py-1 text-[11px]"
                  style={{ borderColor: "var(--admin-border)", color: "var(--admin-fg)" }}>
                  <option value="">All priorities</option>
                  {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="space-y-2 p-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg" style={{ background: "var(--admin-surface-2)" }} />
            ))}
          </div>
        )}
        {!isLoading && (data?.tickets ?? []).length === 0 && (
          <div className="p-6 text-center text-xs" style={{ color: "var(--admin-fg-muted)" }}>
            No tickets match your filters.
          </div>
        )}
        <ul className="divide-y" style={{ borderColor: "var(--admin-border)" }}>
          {(data?.tickets ?? []).map((t: any) => {
            const isActive = t.id === activeId;
            const unread = t.last_customer_message_at && (!t.last_staff_message_at || new Date(t.last_customer_message_at) > new Date(t.last_staff_message_at));
            const sc = STATUS_TONE[t.status] ?? STATUS_TONE.open;
            const pc = PRIORITY_TONE[t.priority] ?? PRIORITY_TONE.medium;
            return (
              <li key={t.id}>
                <Link
                  to="/admin/tickets/$ticketId"
                  params={{ ticketId: t.id }}
                  className="block px-3 py-2.5 transition-colors"
                  style={{ background: isActive ? "rgba(59,130,246,0.08)" : "transparent" }}
                >
                  <div className="flex items-start gap-2">
                    {isActive && <div className="mt-0.5 h-8 w-0.5 rounded-full" style={{ background: sc.ring }} />}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px]" style={{ color: "var(--admin-fg-muted)" }}>
                          {t.ticket_number}
                        </span>
                        <div className="flex items-center gap-1">
                          {unread && <span className="size-1.5 rounded-full" style={{ background: "#3b82f6" }} title="Unread reply" />}
                          <span className="text-[10px] tabular-nums" style={{ color: "var(--admin-fg-muted)" }}>
                            {relTime(t.created_at)}
                          </span>
                        </div>
                      </div>
                      <p className="mt-0.5 truncate text-[13px] font-medium" style={{ color: "var(--admin-fg)" }}>
                        {t.subject}
                      </p>
                      <p className="truncate text-[11px]" style={{ color: "var(--admin-fg-muted)" }}>
                        {t.customer_name ?? "—"}
                      </p>
                      <div className="mt-1 flex items-center gap-1">
                        <span className="rounded px-1.5 py-0.5 text-[10px] font-medium capitalize"
                          style={{ background: sc.bg, color: sc.fg }}>
                          {t.status.replace(/_/g, " ")}
                        </span>
                        <span className="rounded px-1.5 py-0.5 text-[10px] font-medium capitalize"
                          style={{ background: pc.bg, color: pc.fg }}>
                          {t.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CENTER — Header
// ═══════════════════════════════════════════════════════════════

function TicketHeader({ data, ticketId, composerMode, setComposerMode, focusReply }: {
  data: any; ticketId: string; composerMode: "reply" | "note"; setComposerMode: (m: "reply" | "note") => void; focusReply: () => void;
}) {
  const qc = useQueryClient();
  const t = data.ticket;
  const sc = STATUS_TONE[t.status] ?? STATUS_TONE.open;
  const pc = PRIORITY_TONE[t.priority ?? "medium"];
  const updFn = useServerFn(updateTicket);
  const resumeFn = useServerFn(resolveTicketAndResumeOrder);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [resumeTo, setResumeTo] = useState<"IN_PROCESSING" | "SUBMITTED_TO_GOVT">("IN_PROCESSING");

  const updMut = useMutation({
    mutationFn: (patch: any) => updFn({ data: { id: ticketId, ...patch } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["ticket-workspace", ticketId] }); toast.success("Updated"); },
    onError: (e: any) => toast.error(e?.message ?? "Update failed"),
  });

  const resumeMut = useMutation({
    mutationFn: () => resumeFn({ data: { ticketId, resumeTo } }),
    onSuccess: () => {
      setResumeOpen(false);
      toast.success("Ticket resolved · order resumed");
      qc.invalidateQueries({ queryKey: ["ticket-workspace", ticketId] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Resume failed"),
  });

  const canResume = (t.application_id && (data.ticket.applications?.order_status === "CUSTOMER_HOLD" || data.ticket.applications?.order_status === "OUR_SIDE_DELAY") && !["closed", "resolved"].includes(t.status));

  const staffFn = useServerFn(listStaffForAssignment);
  const { data: staff } = useQuery({ queryKey: ["staff-assign"], queryFn: () => staffFn(), staleTime: 60_000 });

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied");
  };

  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-10 border-b backdrop-blur-md"
        style={{ background: "rgba(255,255,255,0.9)", borderColor: "var(--admin-border)" }}
      >
        {/* Row 1 — Identity */}
        <div className="px-5 pt-3 pb-2">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="font-mono tabular-nums" style={{ color: "var(--admin-fg-muted)" }}>
              {t.ticket_number}
            </span>
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium capitalize"
              style={{ background: sc.bg, color: sc.fg }}
            >
              <span className="size-1.5 rounded-full" style={{ background: sc.ring }} />
              {t.status.replace(/_/g, " ")}
            </span>
            <span
              className="rounded-full px-2 py-0.5 font-medium capitalize"
              style={{ background: pc.bg, color: pc.fg }}
            >
              {t.priority ?? "medium"}
            </span>
            {t.source && (
              <span
                className="rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide"
                style={{ borderColor: "var(--admin-border)", color: "var(--admin-fg-muted)" }}
              >
                {t.source.replace(/_/g, " ")}
              </span>
            )}
            <span className="ml-auto inline-flex items-center gap-1" style={{ color: "var(--admin-fg-muted)" }}>
              <Clock className="size-3" /> {formatIST(t.created_at)}
            </span>
          </div>
          <h1 className="mt-1.5 truncate text-[15px] font-semibold leading-tight" style={{ color: "var(--admin-fg)" }}>
            {t.subject}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px]" style={{ color: "var(--admin-fg-muted)" }}>
            {t.ticket_email ? (
              <span className="inline-flex items-center gap-1">
                <MailCheck className="size-3" style={{ color: "#15803d" }} /> {t.ticket_email}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1" style={{ color: "#b91c1c" }}>
                <MailX className="size-3" /> No customer email
              </span>
            )}
            {t.first_response_at && <span>First reply {relTime(t.first_response_at)}</span>}
          </div>
        </div>

        {/* Row 2 — Actions */}
        <div className="flex items-center gap-1.5 border-t px-5 py-2" style={{ borderColor: "var(--admin-border)" }}>
          <ToolbarBtn onClick={() => { setComposerMode("reply"); focusReply(); }} icon={<MessageSquare className="size-3.5" />} label="Reply" primary />
          <ToolbarBtn onClick={() => { setComposerMode("note"); focusReply(); }} icon={<StickyNote className="size-3.5" />} label="Note" />

          <span className="mx-1 h-4 w-px" style={{ background: "var(--admin-border)" }} />

          <select
            value={t.assigned_to ?? ""}
            onChange={(e) => updMut.mutate({ assignedTo: e.target.value || null })}
            className="max-w-[140px] rounded-md border bg-transparent px-2 py-1 text-[11px] outline-none"
            style={{ borderColor: "var(--admin-border)", color: "var(--admin-fg)" }}
            title="Assignee"
          >
            <option value="">Unassigned</option>
            {(staff?.staff ?? []).map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>

          {canResume && (
            <ToolbarBtn onClick={() => setResumeOpen(true)} icon={<PlayCircle className="size-3.5" />} label="Resume Order" success />
          )}
          {!["resolved", "closed"].includes(t.status) && (
            <ToolbarBtn onClick={() => updMut.mutate({ status: "resolved" })} icon={<CheckCircle2 className="size-3.5" />} label="Resolve" />
          )}
          {t.status !== "closed" && (
            <ToolbarBtn onClick={() => updMut.mutate({ status: "closed" })} icon={<XCircle className="size-3.5" />} label="Close" />
          )}
          {(t.status === "closed" || t.status === "resolved") && (
            <ToolbarBtn onClick={() => updMut.mutate({ status: "open" })} icon={<RotateCcw className="size-3.5" />} label="Reopen" />
          )}

          <div className="relative ml-auto">
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
              className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium hover:bg-slate-50"
              style={{ borderColor: "var(--admin-border)", color: "var(--admin-fg-muted)" }}
              title="More actions"
            >
              More
            </button>
            {moreOpen && (
              <div
                className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-lg border bg-white py-1 shadow-lg"
                style={{ borderColor: "var(--admin-border)" }}
              >
                <MoreItem onClick={() => updMut.mutate({ priority: "urgent" })} icon={<AlertTriangle className="size-3.5" style={{ color: "#dc2626" }} />} label="Escalate to urgent" />
                <MoreItem onClick={copyLink} icon={<Copy className="size-3.5" />} label="Copy link" />
                <MoreItem onClick={() => window.print()} icon={<Printer className="size-3.5" />} label="Print" />
              </div>
            )}
          </div>
        </div>
      </header>

      {resumeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.55)" }} onClick={() => setResumeOpen(false)}>
          <div className="w-full max-w-md rounded-2xl border p-5 shadow-xl" style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-semibold" style={{ color: "var(--admin-fg)" }}>Resolve ticket and resume order</h3>
            <p className="mt-1 text-xs" style={{ color: "var(--admin-fg-muted)" }}>Marks this ticket resolved and moves the linked order out of hold.</p>
            <label className="mt-4 block text-xs">
              <span className="font-medium uppercase tracking-wide" style={{ color: "var(--admin-fg-muted)" }}>Resume order to</span>
              <select value={resumeTo} onChange={(e) => setResumeTo(e.target.value as any)} className="mt-1 w-full rounded-lg border bg-transparent px-2 py-2 text-sm" style={{ borderColor: "var(--admin-border)", color: "var(--admin-fg)" }}>
                <option value="IN_PROCESSING">In Processing</option>
                <option value="SUBMITTED_TO_GOVT">Submitted to Govt</option>
              </select>
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setResumeOpen(false)} className="rounded-lg px-3 py-1.5 text-xs" style={{ color: "var(--admin-fg-muted)" }}>Cancel</button>
              <button type="button" disabled={resumeMut.isPending} onClick={() => resumeMut.mutate()} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50" style={{ background: "#16a34a" }}>
                {resumeMut.isPending ? <Loader2 className="size-3 animate-spin" /> : <PlayCircle className="size-3" />} Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ToolbarBtn({ onClick, icon, label, primary, success, iconOnly }: { onClick: () => void; icon: React.ReactNode; label: string; primary?: boolean; success?: boolean; iconOnly?: boolean }) {
  const style = primary
    ? { background: "#3b82f6", color: "white" }
    : success
    ? { background: "#16a34a", color: "white" }
    : { background: "var(--admin-surface-2)", color: "var(--admin-fg)", border: "1px solid var(--admin-border)" };
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-all hover:scale-[1.03] hover:shadow-sm" style={style} title={label}>
      {icon}
      {!iconOnly && <span>{label}</span>}
    </button>
  );
}

function MoreItem({ onClick, icon, label }: { onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12px] hover:bg-slate-50"
      style={{ color: "var(--admin-fg)" }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════
// CENTER — Thread
// ═══════════════════════════════════════════════════════════════

function TicketThread({ data }: { data: any }) {
  // Merge replies + inbound-only email logs + system events into one timeline
  const items = useMemo(() => {
    const nodes: any[] = [];
    for (const r of data.replies) {
      nodes.push({
        kind: "reply",
        id: `r-${r.id}`,
        created_at: r.created_at,
        payload: r,
      });
    }
    for (const e of data.inboundEmails ?? []) {
      nodes.push({
        kind: "email",
        id: `e-${e.id}`,
        created_at: e.created_at,
        payload: e,
      });
    }
    for (const ev of data.events ?? []) {
      if (["ticket_status_change", "ticket_created", "assignment_change", "order_resumed_from_ticket", "automation_triggered"].includes(ev.event_type)) {
        nodes.push({ kind: "system", id: `s-${ev.id}`, created_at: ev.created_at, payload: ev });
      }
    }
    nodes.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    return nodes;
  }, [data]);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [items.length]);

  const customerName = data.ticket.customers?.name ?? "Customer";
  const customerEmail = data.ticket.ticket_email ?? data.ticket.customers?.primary_email;

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6" style={{ background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)" }}>
      {items.length === 0 && (
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <MessageSquare className="mx-auto size-8" style={{ color: "var(--admin-fg-muted)" }} />
            <p className="mt-2 text-sm font-medium" style={{ color: "var(--admin-fg)" }}>No messages yet</p>
            <p className="text-xs" style={{ color: "var(--admin-fg-muted)" }}>Send the first reply to start the conversation.</p>
          </div>
        </div>
      )}
      <div className="mx-auto max-w-3xl space-y-4">
        {items.map((n, idx) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: Math.min(idx * 0.02, 0.2) }}
          >
            {n.kind === "system" ? (
              <SystemEvent ev={n.payload} />
            ) : n.kind === "email" ? (
              <MessageCard
                kind="customer"
                name={n.payload.from_email ?? customerName}
                email={n.payload.from_email ?? customerEmail}
                createdAt={n.created_at}
                bodyHtml={n.payload.body_html}
                bodyText={n.payload.body_text}
                deliveryStatus={n.payload.status}
              />
            ) : (
              <MessageCard
                kind={n.payload.is_internal ? "note" : n.payload.direction === "inbound" ? "customer" : "agent"}
                name={n.payload.direction === "inbound" ? customerName : n.payload.author_name}
                email={n.payload.direction === "inbound" ? customerEmail : undefined}
                createdAt={n.created_at}
                bodyText={n.payload.reply_text}
                emailed={!!n.payload.emailed_at}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SystemEvent({ ev }: { ev: any }) {
  const label = ev.event_type === "ticket_status_change"
    ? `Status → ${ev.new_value}`
    : ev.event_type === "ticket_created"
    ? `Ticket created`
    : ev.event_type === "assignment_change"
    ? `Assigned`
    : ev.event_type === "order_resumed_from_ticket"
    ? `Order resumed → ${ev.new_value}`
    : ev.event_type.replace(/_/g, " ");
  return (
    <div className="flex items-center gap-2 py-1">
      <div className="h-px flex-1" style={{ background: "var(--admin-border)" }} />
      <div className="inline-flex items-center gap-1.5 rounded-full border bg-white px-2.5 py-1 text-[10px] uppercase tracking-wide" style={{ borderColor: "var(--admin-border)", color: "var(--admin-fg-muted)" }}>
        <Zap className="size-3" style={{ color: "#8b5cf6" }} />
        <span>{label}</span>
        <span>·</span>
        <span>{ev.actor_name}</span>
        <span>·</span>
        <span>{relTime(ev.created_at)}</span>
      </div>
      <div className="h-px flex-1" style={{ background: "var(--admin-border)" }} />
    </div>
  );
}

function MessageCard({ kind, name, email, createdAt, bodyHtml, bodyText, emailed, deliveryStatus }: {
  kind: "customer" | "agent" | "note";
  name: string;
  email?: string | null;
  createdAt: string;
  bodyHtml?: string | null;
  bodyText?: string | null;
  emailed?: boolean;
  deliveryStatus?: string;
}) {
  const isNote = kind === "note";
  const isAgent = kind === "agent";
  const ring = isNote ? "#d97706" : isAgent ? "#10b981" : "#3b82f6";
  const bg = isNote ? "#fffbeb" : "white";
  const border = isNote ? "#fde68a" : "var(--admin-border)";

  const [showQuoted, setShowQuoted] = useState(false);
  const { visible, hidden } = useMemo(() => splitQuoted(bodyText, bodyHtml), [bodyText, bodyHtml]);
  const safeHtml = useMemo(() => (visible.html ? DOMPurify.sanitize(visible.html, { ALLOWED_ATTR: ["href", "src", "alt", "title", "style"] }) : null), [visible.html]);

  return (
    <div className={`flex gap-3 ${isAgent ? "flex-row-reverse" : ""}`}>
      <div className="shrink-0">
        <div className="flex size-9 items-center justify-center rounded-full text-xs font-semibold text-white shadow-sm ring-2 ring-white" style={{ background: avatarBg(name) }}>
          {initials(name)}
        </div>
      </div>
      <div className={`min-w-0 flex-1 ${isAgent ? "text-right" : ""}`}>
        <div className={`inline-block max-w-full rounded-2xl border p-4 text-left shadow-sm ${isAgent ? "" : ""}`} style={{ background: bg, borderColor: border, borderTopLeftRadius: isAgent ? "1rem" : "0.375rem", borderTopRightRadius: isAgent ? "0.375rem" : "1rem" }}>
          <header className="flex flex-wrap items-center gap-2 border-b pb-2 text-[11px]" style={{ borderColor: "var(--admin-border)", color: "var(--admin-fg-muted)" }}>
            <span className="font-semibold" style={{ color: "var(--admin-fg)" }}>{name}</span>
            <span className="rounded px-1.5 py-0.5 text-[10px] uppercase" style={{ background: `${ring}20`, color: ring }}>
              {isNote ? "Internal" : isAgent ? "Agent" : "Customer"}
            </span>
            {email && <span className="truncate">· {email}</span>}
            <span title={formatIST(createdAt)}>· {relTime(createdAt)}</span>
            {emailed && <span className="inline-flex items-center gap-0.5 text-emerald-700"><MailCheck className="size-3" /> sent</span>}
            {deliveryStatus && <span className="rounded bg-slate-100 px-1 text-[10px]">{deliveryStatus}</span>}
          </header>
          <div className="mt-2 text-sm leading-relaxed" style={{ color: "var(--admin-fg)" }}>
            {safeHtml
              ? <div className="prose prose-sm max-w-none [&_a]:text-blue-600" dangerouslySetInnerHTML={{ __html: safeHtml }} />
              : <p className="whitespace-pre-wrap">{visible.text}</p>
            }
            {hidden && (
              <>
                <button type="button" onClick={() => setShowQuoted((v) => !v)} className="mt-2 inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px]" style={{ borderColor: "var(--admin-border)", color: "var(--admin-fg-muted)" }}>
                  <ChevronDown className={`size-3 transition-transform ${showQuoted ? "rotate-180" : ""}`} />
                  {showQuoted ? "Hide" : "Show"} trimmed content
                </button>
                {showQuoted && <div className="mt-2 whitespace-pre-wrap rounded-md border-l-2 pl-3 text-xs" style={{ borderColor: "var(--admin-border)", color: "var(--admin-fg-muted)" }}>{hidden}</div>}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function splitQuoted(text: string | null | undefined, html: string | null | undefined) {
  if (html) return { visible: { html, text: null }, hidden: null as string | null };
  if (!text) return { visible: { html: null, text: "" }, hidden: null };
  const lines = text.split("\n");
  const idx = lines.findIndex((l) => l.trim().startsWith(">") || /^On .+ wrote:$/i.test(l.trim()));
  if (idx > 0 && idx < lines.length - 1) {
    return { visible: { html: null, text: lines.slice(0, idx).join("\n").trimEnd() }, hidden: lines.slice(idx).join("\n") };
  }
  return { visible: { html: null, text }, hidden: null };
}

// ═══════════════════════════════════════════════════════════════
// CENTER — Reply Composer
// ═══════════════════════════════════════════════════════════════

function ReplyComposer({ ticketId, data, composerMode, setComposerMode, textareaRef }: {
  ticketId: string; data: any; composerMode: "reply" | "note"; setComposerMode: (m: "reply" | "note") => void; textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const qc = useQueryClient();
  const replyFn = useServerFn(replyToTicket);
  const updFn = useServerFn(updateTicket);
  const cannedFn = useServerFn(listCannedResponses);
  const { data: canned } = useQuery({ queryKey: ["canned-responses", "active"], queryFn: () => cannedFn({ data: { activeOnly: true } }), staleTime: 60_000 });

  const draftKey = `draft:ticket:${ticketId}:${composerMode}`;
  const [text, setText] = useState("");
  const [cc, setCc] = useState("");
  const [showCanned, setShowCanned] = useState(false);
  const [showCcBcc, setShowCcBcc] = useState(false);

  useEffect(() => {
    setText(typeof window !== "undefined" ? localStorage.getItem(draftKey) ?? "" : "");
  }, [draftKey]);

  useEffect(() => {
    const t = setTimeout(() => { if (text) localStorage.setItem(draftKey, text); else localStorage.removeItem(draftKey); }, 500);
    return () => clearTimeout(t);
  }, [text, draftKey]);

  const substitute = useCallback((body: string) => {
    return body
      .replace(/\{\{customer_name\}\}/g, data.ticket.customers?.name ?? "there")
      .replace(/\{\{order_number\}\}/g, data.ticket.applications?.application_code ?? "")
      .replace(/\{\{ticket_id\}\}/g, data.ticket.ticket_number ?? "")
      .replace(/\{\{service_name\}\}/g, data.ticket.services?.service_name ?? data.ticket.applications?.services?.service_name ?? "");
  }, [data]);

  const replyMut = useMutation({
    mutationFn: (opts: { andThen?: "resolve" | "close" }) => replyFn({ data: { ticketId, message: substitute(text.trim()), isInternal: composerMode === "note" } }).then(async (res) => {
      if (opts.andThen === "resolve") await updFn({ data: { id: ticketId, status: "resolved" } });
      if (opts.andThen === "close") await updFn({ data: { id: ticketId, status: "closed" } });
      return res;
    }),
    onSuccess: (res: any, vars) => {
      setText("");
      localStorage.removeItem(draftKey);
      if (composerMode === "note") toast.success("Internal note added");
      else if (res?.emailed) toast.success(`Reply sent${vars.andThen ? ` · ticket ${vars.andThen}` : ""}`);
      else if (res?.reason === "no_recipient_email") toast.warning("Saved, but customer has no email on file.");
      else toast.warning("Reply saved but email failed. Check the queue.");
      qc.invalidateQueries({ queryKey: ["ticket-workspace", ticketId] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Send failed"),
  });

  const send = (andThen?: "resolve" | "close") => {
    if (!text.trim()) { toast.error("Write a message first"); return; }
    replyMut.mutate({ andThen });
  };

  const applyFormat = (cmd: string, value?: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart, end = ta.selectionEnd;
    const sel = text.slice(start, end);
    let inserted = sel;
    if (cmd === "bold") inserted = `**${sel || "text"}**`;
    else if (cmd === "italic") inserted = `_${sel || "text"}_`;
    else if (cmd === "underline") inserted = `<u>${sel || "text"}</u>`;
    else if (cmd === "ul") inserted = sel.split("\n").map((l) => `- ${l}`).join("\n") || "- ";
    else if (cmd === "ol") inserted = sel.split("\n").map((l, i) => `${i + 1}. ${l}`).join("\n") || "1. ";
    else if (cmd === "link") inserted = `[${sel || "link text"}](${value ?? "https://"})`;
    else if (cmd === "emoji") inserted = value ?? "";
    const next = text.slice(0, start) + inserted + text.slice(end);
    setText(next);
    setTimeout(() => { ta.focus(); ta.setSelectionRange(start + inserted.length, start + inserted.length); }, 0);
  };

  const isNote = composerMode === "note";

  return (
    <div className="sticky bottom-0 border-t bg-white/95 backdrop-blur-md" style={{ borderColor: "var(--admin-border)" }}>
      <div className="mx-auto max-w-3xl px-5 py-3">
        <div className="rounded-2xl border shadow-sm" style={{ borderColor: isNote ? "#fde68a" : "var(--admin-border)", background: isNote ? "#fffbeb" : "white" }}>
          {/* Mode tabs + toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2" style={{ borderColor: isNote ? "#fde68a" : "var(--admin-border)" }}>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setComposerMode("reply")} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium" style={{ background: !isNote ? "#3b82f6" : "transparent", color: !isNote ? "white" : "var(--admin-fg-muted)" }}>
                <MessageSquare className="size-3" /> Reply
              </button>
              <button type="button" onClick={() => setComposerMode("note")} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium" style={{ background: isNote ? "#d97706" : "transparent", color: isNote ? "white" : "var(--admin-fg-muted)" }}>
                <StickyNote className="size-3" /> Internal Note
              </button>
              {!isNote && (
                <button type="button" onClick={() => setShowCcBcc((v) => !v)} className="ml-2 rounded-md border px-2 py-0.5 text-[10px]" style={{ borderColor: "var(--admin-border)", color: "var(--admin-fg-muted)" }}>
                  Cc/Bcc
                </button>
              )}
            </div>
            <div className="flex items-center gap-0.5">
              <FmtBtn onClick={() => applyFormat("bold")} icon={<Bold className="size-3" />} />
              <FmtBtn onClick={() => applyFormat("italic")} icon={<Italic className="size-3" />} />
              <FmtBtn onClick={() => applyFormat("underline")} icon={<UIcon className="size-3" />} />
              <span className="mx-1 h-3 w-px" style={{ background: "var(--admin-border)" }} />
              <FmtBtn onClick={() => applyFormat("ul")} icon={<List className="size-3" />} />
              <FmtBtn onClick={() => applyFormat("ol")} icon={<ListOrdered className="size-3" />} />
              <FmtBtn onClick={() => { const url = prompt("URL:", "https://"); if (url) applyFormat("link", url); }} icon={<LinkIcon className="size-3" />} />
              <span className="mx-1 h-3 w-px" style={{ background: "var(--admin-border)" }} />
              <EmojiBtn onPick={(e) => applyFormat("emoji", e)} />
              <div className="relative">
                <button type="button" onClick={() => setShowCanned((v) => !v)} className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] hover:bg-black/5" style={{ color: "var(--admin-fg-muted)" }} title="Templates">
                  <Sparkles className="size-3" /> Templates
                </button>
                {showCanned && canned && (canned as any[]).length > 0 && (
                  <div className="absolute bottom-full right-0 z-20 mb-1 max-h-72 w-72 overflow-auto rounded-lg border bg-white p-1 shadow-lg" style={{ borderColor: "var(--admin-border)" }}>
                    {(canned as any[]).map((c) => (
                      <button key={c.id} type="button" onClick={() => { setText((t) => (t ? t + "\n\n" : "") + c.body); setShowCanned(false); }} className="block w-full rounded-md px-2 py-1.5 text-left text-xs hover:bg-black/5">
                        <div className="font-medium" style={{ color: "var(--admin-fg)" }}>{c.title}</div>
                        {c.category && <div className="text-[10px]" style={{ color: "var(--admin-fg-muted)" }}>{c.category}</div>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {showCcBcc && !isNote && (
            <div className="border-b px-3 py-1.5" style={{ borderColor: "var(--admin-border)" }}>
              <input
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                placeholder="Cc: email@example.com  (preview — not yet delivered)"
                className="w-full bg-transparent text-xs outline-none"
                style={{ color: "var(--admin-fg)" }}
              />
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder={isNote ? "Write an internal note (visible to staff only)…  Use @name to mention (coming soon)" : "Reply to customer…  Supports **bold**, _italic_, [links](url), and {{customer_name}} variables"}
            className="w-full resize-none bg-transparent px-4 py-3 text-sm outline-none"
            style={{ color: "var(--admin-fg)" }}
            onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); send(); } }}
          />

          <div className="flex flex-wrap items-center justify-between gap-2 border-t px-3 py-2" style={{ borderColor: isNote ? "#fde68a" : "var(--admin-border)" }}>
            <div className="flex items-center gap-2 text-[10px]" style={{ color: "var(--admin-fg-muted)" }}>
              <Paperclip className="size-3" /> Attach (soon)
              <span>· ⌘+Enter to send</span>
              {text && <span className="text-emerald-600">· Draft saved</span>}
            </div>
            <div className="flex items-center gap-1.5">
              {!isNote && (
                <>
                  <button type="button" disabled={!text.trim() || replyMut.isPending} onClick={() => send("resolve")} className="rounded-md border px-3 py-1.5 text-[11px] font-medium disabled:opacity-40" style={{ borderColor: "var(--admin-border)", color: "var(--admin-fg)" }}>
                    Send &amp; Resolve
                  </button>
                  <button type="button" disabled={!text.trim() || replyMut.isPending} onClick={() => send("close")} className="rounded-md border px-3 py-1.5 text-[11px] font-medium disabled:opacity-40" style={{ borderColor: "var(--admin-border)", color: "var(--admin-fg)" }}>
                    Send &amp; Close
                  </button>
                </>
              )}
              <button type="button" disabled={!text.trim() || replyMut.isPending} onClick={() => send()} className="inline-flex items-center gap-1.5 rounded-md px-4 py-1.5 text-[11px] font-semibold text-white disabled:opacity-40" style={{ background: isNote ? "#d97706" : "#3b82f6" }}>
                {replyMut.isPending ? <Loader2 className="size-3 animate-spin" /> : <Send className="size-3" />}
                {isNote ? "Add note" : "Send reply"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FmtBtn({ onClick, icon }: { onClick: () => void; icon: React.ReactNode }) {
  return <button type="button" onClick={onClick} className="rounded p-1 hover:bg-black/5" style={{ color: "var(--admin-fg-muted)" }}>{icon}</button>;
}

function EmojiBtn({ onPick }: { onPick: (e: string) => void }) {
  const [open, setOpen] = useState(false);
  const EMOJIS = ["👍", "🎉", "🙏", "✅", "⚠️", "❤️", "🚀", "🔔", "📧", "📎", "💡", "😊"];
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)} className="rounded p-1 hover:bg-black/5" style={{ color: "var(--admin-fg-muted)" }}><Smile className="size-3" /></button>
      {open && (
        <div className="absolute bottom-full right-0 z-20 mb-1 flex flex-wrap gap-1 rounded-lg border bg-white p-2 shadow-lg" style={{ borderColor: "var(--admin-border)", width: 180 }}>
          {EMOJIS.map((e) => (
            <button key={e} type="button" onClick={() => { onPick(e); setOpen(false); }} className="rounded p-1 text-lg hover:bg-black/5">{e}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// RIGHT — Context Rail (Details / Customer / Order / History)
// ═══════════════════════════════════════════════════════════════

function TicketContextRail({ data, ticketId }: { data: any; ticketId: string }) {
  const [tab, setTab] = useState<"details" | "customer" | "order" | "history">("details");
  const t = data.ticket;
  const hasOrder = !!t.application_id;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm" style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
      <div className="flex border-b" style={{ borderColor: "var(--admin-border)" }}>
        {(["details", "customer", "order", "history"] as const).map((k) => (
          <button
            key={k}
            type="button"
            disabled={k === "order" && !hasOrder}
            onClick={() => setTab(k)}
            className="flex-1 border-b-2 px-2 py-2 text-[11px] font-medium capitalize transition-colors disabled:opacity-40"
            style={{
              borderColor: tab === k ? "#3b82f6" : "transparent",
              color: tab === k ? "var(--admin-fg)" : "var(--admin-fg-muted)",
              background: tab === k ? "rgba(59,130,246,0.04)" : "transparent",
            }}
          >
            {k}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {tab === "details" && <DetailsTab data={data} ticketId={ticketId} />}
        {tab === "customer" && <CustomerTab data={data} />}
        {tab === "order" && hasOrder && <OrderTab data={data} />}
        {tab === "history" && <HistoryTab data={data} />}
      </div>
    </div>
  );
}

function KV({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5 text-xs">
      <span className="shrink-0" style={{ color: "var(--admin-fg-muted)" }}>{label}</span>
      <span className={`text-right ${mono ? "font-mono" : ""}`} style={{ color: "var(--admin-fg)" }}>{value ?? "—"}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mb-4">
      <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--admin-fg-muted)" }}>{title}</h3>
      <div className="rounded-xl border p-3" style={{ background: "var(--admin-surface-2)", borderColor: "var(--admin-border)" }}>
        {children}
      </div>
    </section>
  );
}

function DetailsTab({ data }: { data: any; ticketId: string }) {
  const t = data.ticket;
  const ageMs = Date.now() - new Date(t.created_at).getTime();
  const ageHrs = Math.floor(ageMs / 3600000);
  return (
    <>
      <Section title="Ticket">
        <KV label="ID" value={t.ticket_number} mono />
        <KV label="Status" value={<span className="capitalize">{t.status.replace(/_/g, " ")}</span>} />
        <KV label="Priority" value={<span className="capitalize">{t.priority ?? "medium"}</span>} />
        <KV label="Source" value={<span className="capitalize">{(t.source ?? "").replace(/_/g, " ")}</span>} />
        <KV label="Assigned to" value={t.assigned_name ?? "Unassigned"} />
        <KV label="Category" value={t.services?.service_name ?? t.applications?.services?.service_name ?? "—"} />
        <KV label="Created" value={formatIST(t.created_at)} />
        <KV label="Updated" value={formatIST(t.updated_at)} />
        <KV label="First response" value={t.first_response_at ? relTime(t.first_response_at) : "—"} />
        <KV label="SLA age" value={`${ageHrs}h`} />
      </Section>
    </>
  );
}

function CustomerTab({ data }: { data: any }) {
  const c = data.ticket.customers;
  const s = data.customerStats;
  if (!c) return <p className="text-xs" style={{ color: "var(--admin-fg-muted)" }}>No customer linked.</p>;
  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-14 items-center justify-center rounded-full text-lg font-semibold text-white shadow-md" style={{ background: avatarBg(c.name ?? "?") }}>
          {initials(c.name)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold" style={{ color: "var(--admin-fg)" }}>{c.name}</p>
          <Link to="/admin/customers/$customerId" params={{ customerId: c.id }} className="inline-flex items-center gap-1 text-[11px]" style={{ color: "#3b82f6" }}>
            View profile <ExternalLink className="size-3" />
          </Link>
        </div>
      </div>
      <Section title="Contact">
        <KV label="Email" value={c.primary_email} />
        <KV label="Phone" value={c.primary_mobile} />
        <KV label="State" value={c.state} />
        <KV label="Language" value={c.language} />
        <KV label="Customer since" value={formatIST(c.created_at)} />
      </Section>
      <Section title="Portfolio">
        <div className="grid grid-cols-2 gap-2 text-center">
          <Stat label="Orders" value={s.totalOrders} />
          <Stat label="Completed" value={s.completedOrders} />
          <Stat label="Open Tickets" value={s.openTickets} tone="warn" />
          <Stat label="Closed" value={s.closedTickets} tone="success" />
        </div>
        <div className="mt-3 rounded-lg border p-2 text-center" style={{ background: "white", borderColor: "var(--admin-border)" }}>
          <div className="text-[10px] uppercase tracking-wide" style={{ color: "var(--admin-fg-muted)" }}>Lifetime Value</div>
          <div className="text-lg font-semibold tabular-nums" style={{ color: "#16a34a" }}>{inr(s.lifetimeValue)}</div>
        </div>
      </Section>
    </>
  );
}

function Stat({ label, value, tone }: { label: string; value: number | string; tone?: "success" | "warn" }) {
  const color = tone === "success" ? "#16a34a" : tone === "warn" ? "#d97706" : "var(--admin-fg)";
  return (
    <div className="rounded-lg border p-2" style={{ background: "white", borderColor: "var(--admin-border)" }}>
      <div className="text-lg font-semibold tabular-nums" style={{ color }}>{value}</div>
      <div className="text-[10px] uppercase tracking-wide" style={{ color: "var(--admin-fg-muted)" }}>{label}</div>
    </div>
  );
}

function OrderTab({ data }: { data: any }) {
  const app = data.ticket.applications;
  const latestPay = data.payments?.[0];
  const latestInv = data.invoices?.[0];
  return (
    <>
      <Section title="Order">
        <KV label="Code" value={app.application_code} mono />
        <KV label="Service" value={app.services?.service_name} />
        <KV label="Status" value={<span className="capitalize">{(app.order_status ?? "").replace(/_/g, " ")}</span>} />
        <KV label="Fulfillment" value={<span className="capitalize">{(app.fulfillment_status ?? "").replace(/_/g, " ")}</span>} />
        <KV label="Executive" value={data.ticket.executive_name ?? "—"} />
        <KV label="Created" value={formatIST(app.created_at)} />
        <div className="mt-2">
          <Link to="/admin/orders/$orderId" params={{ orderId: app.id }} className="inline-flex w-full items-center justify-center gap-1 rounded-md py-1.5 text-xs font-medium text-white" style={{ background: "#3b82f6" }}>
            <ExternalLink className="size-3" /> Open order
          </Link>
        </div>
      </Section>
      <Section title="Payment">
        {latestPay ? (
          <>
            <KV label="Latest" value={inr(Number(latestPay.amount))} />
            <KV label="Status" value={<span className="capitalize">{latestPay.status}</span>} />
            <KV label="Gateway" value={latestPay.gateway} />
            <KV label="Paid at" value={formatIST(latestPay.paid_at)} />
          </>
        ) : <p className="text-xs" style={{ color: "var(--admin-fg-muted)" }}>No payments yet.</p>}
        {latestInv && <KV label="Invoice" value={<span className="font-mono">{latestInv.invoice_number}</span>} />}
      </Section>
      <Section title={`Documents (${data.documents?.length ?? 0})`}>
        {(!data.documents || data.documents.length === 0) && (
          <p className="text-xs" style={{ color: "var(--admin-fg-muted)" }}>No documents uploaded.</p>
        )}
        <ul className="space-y-1.5">
          {(data.documents ?? []).slice(0, 8).map((d: any) => (
            <li key={d.id} className="flex items-center gap-2 rounded-md border bg-white p-2 text-xs" style={{ borderColor: "var(--admin-border)" }}>
              <FileText className="size-3.5 shrink-0" style={{ color: "#3b82f6" }} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium" style={{ color: "var(--admin-fg)" }}>{d.file_name ?? d.doc_type}</p>
                <p className="text-[10px]" style={{ color: "var(--admin-fg-muted)" }}>{d.doc_type} · {d.status}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

function HistoryTab({ data }: { data: any }) {
  return (
    <>
      <Section title="Activity">
        <ol className="space-y-2">
          {(data.events ?? []).slice(0, 20).map((ev: any) => (
            <li key={ev.id} className="flex gap-2 text-xs">
              <div className="mt-0.5 size-1.5 shrink-0 rounded-full" style={{ background: "#8b5cf6" }} />
              <div className="min-w-0 flex-1">
                <p className="truncate" style={{ color: "var(--admin-fg)" }}>
                  <span className="font-medium capitalize">{ev.event_type.replace(/_/g, " ")}</span>
                  {ev.new_value && <span style={{ color: "var(--admin-fg-muted)" }}> → {ev.new_value}</span>}
                </p>
                <p className="text-[10px]" style={{ color: "var(--admin-fg-muted)" }}>{ev.actor_name} · {relTime(ev.created_at)}</p>
              </div>
            </li>
          ))}
          {(data.events ?? []).length === 0 && <li className="text-xs" style={{ color: "var(--admin-fg-muted)" }}>No activity yet.</li>}
        </ol>
      </Section>
      <Section title={`Previous tickets (${data.previousTickets?.length ?? 0})`}>
        <ul className="space-y-1">
          {(data.previousTickets ?? []).slice(0, 8).map((r: any) => (
            <li key={r.id}>
              <Link to="/admin/tickets/$ticketId" params={{ ticketId: r.id }} className="block rounded-md border bg-white px-2 py-1.5 text-xs hover:shadow-sm" style={{ borderColor: "var(--admin-border)" }}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px]" style={{ color: "var(--admin-fg-muted)" }}>{r.ticket_number}</span>
                  <span className="text-[10px] capitalize" style={{ color: "var(--admin-fg-muted)" }}>{r.status.replace(/_/g, " ")}</span>
                </div>
                <p className="truncate" style={{ color: "var(--admin-fg)" }}>{r.subject}</p>
              </Link>
            </li>
          ))}
          {(!data.previousTickets || data.previousTickets.length === 0) && <li className="text-xs" style={{ color: "var(--admin-fg-muted)" }}>None.</li>}
        </ul>
      </Section>
      <Section title={`Previous orders (${data.previousOrders?.length ?? 0})`}>
        <ul className="space-y-1">
          {(data.previousOrders ?? []).slice(0, 6).map((o: any) => (
            <li key={o.id}>
              <Link to="/admin/orders/$orderId" params={{ orderId: o.id }} className="flex items-center justify-between rounded-md border bg-white px-2 py-1.5 text-xs hover:shadow-sm" style={{ borderColor: "var(--admin-border)" }}>
                <span className="font-mono text-[10px]" style={{ color: "var(--admin-fg-muted)" }}>{o.application_code}</span>
                <span className="truncate text-[10px]" style={{ color: "var(--admin-fg)" }}>{o.services?.service_name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <Section title={`Complaints (${data.complaints?.length ?? 0})`}>
        <ul className="space-y-1">
          {(data.complaints ?? []).slice(0, 5).map((c: any) => (
            <li key={c.id} className="rounded-md border bg-white px-2 py-1.5 text-xs" style={{ borderColor: "var(--admin-border)" }}>
              <span className="font-mono text-[10px]" style={{ color: "var(--admin-fg-muted)" }}>{c.complaint_number}</span>
              <p className="truncate" style={{ color: "var(--admin-fg)" }}>{c.subject}</p>
            </li>
          ))}
          {(!data.complaints || data.complaints.length === 0) && <li className="text-xs" style={{ color: "var(--admin-fg-muted)" }}>None.</li>}
        </ul>
      </Section>
      <Section title={`Refunds (${data.refunds?.length ?? 0})`}>
        <ul className="space-y-1">
          {(data.refunds ?? []).slice(0, 5).map((r: any) => (
            <li key={r.id} className="flex justify-between rounded-md border bg-white px-2 py-1.5 text-xs" style={{ borderColor: "var(--admin-border)" }}>
              <span style={{ color: "var(--admin-fg)" }}>{inr(Number(r.refund_amount))}</span>
              <span className="capitalize" style={{ color: "var(--admin-fg-muted)" }}>{r.status}</span>
            </li>
          ))}
          {(!data.refunds || data.refunds.length === 0) && <li className="text-xs" style={{ color: "var(--admin-fg-muted)" }}>None.</li>}
        </ul>
      </Section>
    </>
  );
}
