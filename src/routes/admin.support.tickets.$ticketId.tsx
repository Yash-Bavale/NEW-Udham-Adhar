import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import DOMPurify from "dompurify";
import {
  ArrowLeft, ChevronDown, CornerDownLeft, Loader2, Mail, MoreHorizontal,
  RotateCcw, Send, StickyNote, X, User, Package, Info, History,
  ExternalLink, AlertTriangle, MessageSquare, CheckCircle2, Clock,
} from "lucide-react";
import { getTicketWorkspace } from "@/lib/crm/ticket-workspace.functions";
import { replyToTicket, updateTicket, type TicketStatus, type TicketPriority } from "@/lib/crm/tickets.functions";
import {
  closeTicketNormalT001, closeTicketRestartT001,
  closeTicketConsultationT001, closeTicketReplyReasonT002,
} from "@/lib/tickets/ticket-actions.functions";
import { listCannedResponses } from "@/lib/tickets/canned-responses.functions";
import { listStaffForAssignment } from "@/lib/crm/tasks.functions";
import { ReasonPicker } from "@/components/admin/workspace/ReasonPicker";
import type { OrderCloseReason } from "@/lib/orders/actions/reasons.functions";
import { useRealtimeTable } from "@/hooks/useRealtimeTable";
import { parseEmailReply } from "@/lib/support/emailParser";
import { useRole } from "@/hooks/useRole";

export const Route = createFileRoute("/admin/support/tickets/$ticketId")({
  head: ({ params }) => ({
    meta: [
      { title: `Ticket ${params.ticketId.slice(0, 8)} — BHS CRM` },
      { name: "description", content: "Support ticket conversation." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: TicketWorkspace,
});

// ── formatters ─────────────────────────────────────────────

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

function ist(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  }).format(new Date(iso)).replace(",", "");
}

function istDate(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric",
  }).format(new Date(iso));
}

function rel(iso: string | null | undefined) {
  if (!iso) return "";
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return `${Math.floor(s / 604800)}w ago`;
}

function initials(name: string | null | undefined) {
  if (!name) return "?";
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

function decodeEntities(s: string) {
  return s
    .replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<").replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"').replace(/&#39;/gi, "'");
}

// ── unified message type ───────────────────────────────────

type Msg =
  | {
      kind: "inbound";
      id: string;
      created_at: string;
      from_email: string | null;
      subject: string | null;
      body_text: string;
      body_html: string | null;
    }
  | {
      kind: "outbound";
      id: string;
      created_at: string;
      from_email: string | null;
      subject: string | null;
      body_html: string | null;
      body_text: string;
      template_hint: string | null;
      status: string | null;
      author_name?: string | null;
    }
  | {
      kind: "note";
      id: string;
      created_at: string;
      author_name: string;
      body_text: string;
    };

// Extract likely template code from subject or body ("[E003 – … ]" or "Order Hold Intimation").
function extractTemplateHint(subject: string | null, bodyHtml: string | null): string | null {
  const src = `${subject ?? ""} ${bodyHtml ?? ""}`;
  const m = src.match(/\b(E0\d{2}|T0\d{2}|TB0\d{2})\b/i);
  return m ? m[1].toUpperCase() : null;
}

// ── main component ─────────────────────────────────────────

function TicketWorkspace() {
  const { ticketId } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const role = useRole();
  const isSupportOnly = role?.role === "support";

  const loadFn = useServerFn(getTicketWorkspace);
  const replyFn = useServerFn(replyToTicket);
  const updateFn = useServerFn(updateTicket);
  const cannedFn = useServerFn(listCannedResponses);
  const staffFn = useServerFn(listStaffForAssignment);

  const closeNormal = useServerFn(closeTicketNormalT001);
  const closeRestart = useServerFn(closeTicketRestartT001);
  const closeConsult = useServerFn(closeTicketConsultationT001);
  const closeReply = useServerFn(closeTicketReplyReasonT002);

  const { data, isLoading } = useQuery({
    queryKey: ["support-workspace", ticketId],
    queryFn: () => loadFn({ data: { ticketId } }),
  });

  const { data: canned } = useQuery({
    queryKey: ["canned-responses-active"],
    queryFn: () => cannedFn({ data: { activeOnly: true } }),
  });

  const { data: staff } = useQuery({
    queryKey: ["staff-for-assignment"],
    queryFn: () => staffFn({ data: {} } as any),
  });

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["support-workspace", ticketId] });

  // Realtime — refresh on new inbound emails / replies
  useRealtimeTable({
    channel: `support-ticket-${ticketId}`,
    table: "ticket_replies",
    filter: `ticket_id=eq.${ticketId}`,
    onChange: invalidate,
  } as any);
  const appId = data?.ticket?.application_id ?? null;
  useRealtimeTable({
    channel: `support-ticket-emails-${ticketId}`,
    table: "email_logs",
    filter: appId ? `application_id=eq.${appId}` : undefined,
    onChange: invalidate,
    enabled: !!appId,
  } as any);

  const messages: Msg[] = useMemo(() => {
    if (!data) return [];
    const out: Msg[] = [];

    // Inbound: prefer ticket_replies (matcher already filed them), fall back
    // to email_logs inbound that didn't sync into replies.
    for (const r of data.replies ?? []) {
      if (r.is_internal) {
        out.push({
          kind: "note",
          id: `n-${r.id}`,
          created_at: r.created_at,
          author_name: (r as any).author_name ?? "Staff",
          body_text: r.reply_text ?? "",
        });
      } else if (r.direction === "inbound") {
        out.push({
          kind: "inbound",
          id: `ri-${r.id}`,
          created_at: r.created_at,
          from_email: (data.ticket as any)?.customers?.primary_email ?? null,
          subject: null,
          body_text: r.reply_text ?? "",
          body_html: null,
        });
      }
    }
    for (const e of (data as any).inboundEmails ?? []) {
      out.push({
        kind: "inbound",
        id: `ie-${e.id}`,
        created_at: e.created_at,
        from_email: e.from_email,
        subject: e.subject,
        body_text: e.body_text ?? "",
        body_html: e.body_html ?? null,
      });
    }

    // Outbound — always use email_logs so we can render the full HTML template.
    for (const e of (data as any).outboundEmails ?? []) {
      out.push({
        kind: "outbound",
        id: `oe-${e.id}`,
        created_at: e.sent_at ?? e.created_at,
        from_email: e.from_email,
        subject: e.subject,
        body_html: e.body_html,
        body_text: e.body_text ?? "",
        template_hint: extractTemplateHint(e.subject, e.body_html),
        status: e.status,
      });
    }

    out.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    return out;
  }, [data]);

  const threadRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [messages.length]);

  // ── composer state ───────────────────────────────────────
  const [composeMode, setComposeMode] = useState<"reply" | "note" | null>(null);
  const [body, setBody] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedTemplateName, setSelectedTemplateName] = useState<string | null>(null);
  const composerRef = useRef<HTMLTextAreaElement | null>(null);

  const openReply = () => {
    setComposeMode("reply");
    setTimeout(() => composerRef.current?.focus(), 50);
  };
  const openNote = () => {
    setComposeMode("note");
    setTimeout(() => composerRef.current?.focus(), 50);
  };

  const applyTemplate = (id: string) => {
    const t = (canned ?? []).find((c: any) => c.id === id);
    if (!t) return;
    const ticket = data?.ticket as any;
    const cust = ticket?.customers ?? {};
    const app = ticket?.applications ?? {};
    const filled = (t.body ?? "")
      .replace(/\{\{customer_name\}\}/gi, cust.name ?? "[MISSING: customer_name]")
      .replace(/\{\{order_number\}\}/gi, app.application_code ?? "[MISSING: order_number]")
      .replace(/\{\{ticket_number\}\}/gi, ticket?.ticket_number ?? "");
    setBody(filled);
    setSelectedTemplateId(id);
    setSelectedTemplateName(t.title);
    setComposeMode("reply");
    setTimeout(() => composerRef.current?.focus(), 50);
  };

  const sendReply = useMutation({
    mutationFn: () =>
      replyFn({
        data: {
          ticketId,
          message: body.trim(),
          isInternal: composeMode === "note",
          armAutoclose: false,
        },
      }),
    onSuccess: (r: any) => {
      if (composeMode === "note") {
        toast.success("Internal note added");
      } else if (r?.emailed === false) {
        toast.warning(`Reply saved but email not sent: ${r.reason ?? "unknown"}`);
      } else {
        toast.success("Reply sent");
      }
      setBody("");
      setSelectedTemplateId(null);
      setSelectedTemplateName(null);
      setComposeMode(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // ── ticket-level mutations ───────────────────────────────
  const changeStatus = useMutation({
    mutationFn: (status: TicketStatus) => updateFn({ data: { id: ticketId, status } }),
    onSuccess: () => { toast.success("Status updated"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const changePriority = useMutation({
    mutationFn: (priority: TicketPriority) => updateFn({ data: { id: ticketId, priority } }),
    onSuccess: () => { toast.success("Priority updated"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const changeAssignee = useMutation({
    mutationFn: (userId: string | null) =>
      updateFn({ data: { id: ticketId, assigned_to: userId } }),
    onSuccess: () => { toast.success("Assignee updated"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const doCloseNormal = useMutation({
    mutationFn: () => closeNormal({ data: { ticketId } }),
    onSuccess: () => { toast.success("Ticket closed"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const doCloseRestart = useMutation({
    mutationFn: () => closeRestart({ data: { ticketId } }),
    onSuccess: () => { toast.success("Order restarted & ticket closed"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const doCloseConsult = useMutation({
    mutationFn: (remarks?: string) =>
      closeConsult({ data: { ticketId, remarks: remarks || undefined } }),
    onSuccess: () => { toast.success("T001 sent & ticket closed"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const doCloseReply = useMutation({
    mutationFn: (v: { reason: OrderCloseReason; note?: string }) =>
      closeReply({ data: { ticketId, reason: v.reason, note: v.note } }),
    onSuccess: () => { toast.success("T002 sent — 24h auto-close armed"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  // ── dialogs ──────────────────────────────────────────────
  const [closeMenuOpen, setCloseMenuOpen] = useState(false);
  const [restartConfirm, setRestartConfirm] = useState(false);
  const [consultOpen, setConsultOpen] = useState(false);
  const [consultNote, setConsultNote] = useState("");
  const [reasonOpen, setReasonOpen] = useState(false);
  const [tab, setTab] = useState<"details" | "customer" | "order" | "history">("details");

  if (isLoading || !data) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  const ticket = data.ticket as any;
  const cust = ticket.customers ?? {};
  const app = ticket.applications ?? {};
  const statusPill = STATUS_PILL[ticket.status as TicketStatus];
  const priorityPill = PRIORITY_PILL[(ticket.priority as TicketPriority) ?? "medium"];
  const isClosed = ["closed", "resolved"].includes(ticket.status);

  // date dividers
  const rendered: Array<{ divider?: string; msg?: Msg }> = [];
  let lastDate = "";
  let lastTime = 0;
  for (const m of messages) {
    const d = istDate(m.created_at);
    const t = new Date(m.created_at).getTime();
    if (d !== lastDate || (lastTime && t - lastTime > 24 * 3600 * 1000)) {
      rendered.push({ divider: d });
      lastDate = d;
    }
    lastTime = t;
    rendered.push({ msg: m });
  }

  return (
    <div className="h-full flex bg-slate-50 min-w-0">
      {/* ── Column B — Conversation ───────────────────────── */}
      <section className="flex-1 min-w-0 flex flex-col bg-white border-r border-slate-200">
        {/* B1: Sticky header */}
        <header className="border-b border-slate-200 px-4 py-3 shrink-0">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <button
              onClick={() => navigate({ to: "/admin/support/tickets" })}
              className="md:hidden inline-flex items-center gap-1 text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="font-mono text-slate-500">{ticket.ticket_number}</span>
            <StatusBadge status={ticket.status} onChange={(s) => changeStatus.mutate(s)} />
            <PriorityBadge
              priority={(ticket.priority as TicketPriority) ?? "medium"}
              onChange={(p) => changePriority.mutate(p)}
            />
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] uppercase tracking-wide">
              {ticket.source ?? "internal"}
            </span>
            <span className="text-slate-400 inline-flex items-center gap-1">
              <Clock className="h-3 w-3" /> {ist(ticket.created_at)}
            </span>
          </div>
          <h2 className="mt-2 text-[15px] font-semibold text-slate-900 leading-snug">
            {ticket.subject || "(no subject)"}
          </h2>
          <div className="mt-1 text-xs text-slate-500 flex items-center gap-3 flex-wrap">
            <span className="font-mono">{ticket.ticket_email ?? cust.primary_email ?? "—"}</span>
            {ticket.first_response_at && (
              <span>First reply {rel(ticket.first_response_at)}</span>
            )}
          </div>
        </header>

        {/* B2: Action bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-2 flex-wrap shrink-0">
          <button
            onClick={openReply}
            disabled={isClosed}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1e3a5f] text-white text-xs font-medium hover:bg-[#152b47] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CornerDownLeft className="h-3.5 w-3.5" /> Reply
          </button>
          <button
            onClick={openNote}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50"
          >
            <StickyNote className="h-3.5 w-3.5" /> Internal Note
          </button>

          <AssigneePicker
            currentId={ticket.assigned_to}
            currentName={ticket.assigned_name}
            staff={(staff as any) ?? []}
            onPick={(id) => changeAssignee.mutate(id)}
          />

          <div className="flex-1" />

          {!isClosed && (
            <>
              <div className="relative">
                <button
                  onClick={() => setCloseMenuOpen((v) => !v)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-white border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Close <ChevronDown className="h-3 w-3" />
                </button>
                {closeMenuOpen && (
                  <div
                    className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-md shadow-lg z-20 text-xs"
                    onMouseLeave={() => setCloseMenuOpen(false)}
                  >
                    <button
                      onClick={() => { setCloseMenuOpen(false); doCloseNormal.mutate(); }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <X className="h-3.5 w-3.5 text-slate-500" /> Close — No Action
                    </button>
                    <button
                      onClick={() => { setCloseMenuOpen(false); setReasonOpen(true); }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Mail className="h-3.5 w-3.5 text-slate-500" /> Close with Reply (TB02)
                    </button>
                    <button
                      onClick={() => { setCloseMenuOpen(false); setRestartConfirm(true); }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <RotateCcw className="h-3.5 w-3.5 text-slate-500" /> Close &amp; Restart Order
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setRestartConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Restart Order
              </button>
              <button
                onClick={() => setConsultOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-teal-600 text-white text-xs font-medium hover:bg-teal-700"
              >
                TB01: Consultation Done
              </button>
              <button
                onClick={() => setReasonOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-rose-600 text-white text-xs font-medium hover:bg-rose-700"
              >
                TB02: Reply w/ Reason (24h)
              </button>
              <button
                title="More actions (coming soon)"
                className="p-1.5 rounded-md border border-slate-300 text-slate-500 hover:bg-slate-50"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>

        {/* B3: Thread */}
        <div ref={threadRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
          {rendered.length === 0 && (
            <div className="text-center py-16 text-sm text-slate-500 flex flex-col items-center gap-2">
              <MessageSquare className="h-8 w-8 text-slate-300" />
              No messages yet. Start the conversation by clicking Reply.
            </div>
          )}
          {rendered.map((r, i) =>
            r.divider ? (
              <div key={`d-${i}`} className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                  {r.divider}
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
            ) : (
              <MessageBubble key={r.msg!.id} msg={r.msg!} customerName={cust.name} />
            )
          )}
        </div>

        {/* B4: Composer */}
        <div className="border-t border-slate-200 bg-white shrink-0">
          {composeMode === null ? (
            <button
              onClick={openReply}
              disabled={isClosed}
              className="w-full text-left px-4 py-3 text-xs text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <CornerDownLeft className="h-3.5 w-3.5" />
              {isClosed ? "Ticket is closed — reopen to reply" : "Reply to customer…"}
            </button>
          ) : (
            <div className="p-3">
              <div className="flex items-center gap-2 mb-2 text-xs">
                <button
                  onClick={() => setComposeMode("reply")}
                  className={`px-2 py-1 rounded ${composeMode === "reply" ? "bg-[#1e3a5f] text-white" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  <CornerDownLeft className="h-3 w-3 inline mr-1" /> Reply
                </button>
                <button
                  onClick={() => setComposeMode("note")}
                  className={`px-2 py-1 rounded ${composeMode === "note" ? "bg-amber-500 text-white" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  <StickyNote className="h-3 w-3 inline mr-1" /> Internal Note
                </button>
                {composeMode === "reply" && (
                  <span className="text-slate-500 ml-2">
                    To: <span className="font-mono">{ticket.ticket_email ?? cust.primary_email ?? "—"}</span>
                  </span>
                )}
                <button
                  onClick={() => { setComposeMode(null); setBody(""); setSelectedTemplateId(null); setSelectedTemplateName(null); }}
                  className="ml-auto text-slate-400 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {composeMode === "reply" && (canned?.length ?? 0) > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap mb-2">
                  <span className="text-[11px] text-slate-500 font-medium">📌 Templates:</span>
                  {(canned ?? []).slice(0, 8).map((c: any) => (
                    <button
                      key={c.id}
                      onClick={() => applyTemplate(c.id)}
                      className={`text-[11px] px-2 py-1 rounded-full border transition-colors ${
                        selectedTemplateId === c.id
                          ? "bg-blue-100 border-blue-400 text-blue-800"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {c.title}
                    </button>
                  ))}
                </div>
              )}

              {selectedTemplateName && (
                <div className="mb-2 text-[11px] bg-blue-50 border border-blue-200 text-blue-800 px-2 py-1 rounded flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3" /> Using template: {selectedTemplateName}
                </div>
              )}

              <textarea
                ref={composerRef}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={composeMode === "note" ? "Add an internal note (only staff can see this)…" : "Reply to customer…"}
                rows={5}
                className={`w-full text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-1 resize-y ${
                  composeMode === "note"
                    ? "bg-amber-50 border-amber-200 focus:ring-amber-400 focus:border-amber-400"
                    : "border-slate-200 focus:ring-blue-500 focus:border-blue-500"
                }`}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && body.trim()) {
                    sendReply.mutate();
                  }
                }}
              />

              {body.includes("[MISSING:") && (
                <div className="mt-2 text-[11px] bg-red-50 border border-red-200 text-red-700 px-2 py-1 rounded flex items-center gap-1.5">
                  <AlertTriangle className="h-3 w-3" /> Missing variables — please review before sending.
                </div>
              )}

              <div className="mt-2 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Ctrl+Enter to send</span>
                <button
                  onClick={() => sendReply.mutate()}
                  disabled={!body.trim() || sendReply.isPending}
                  title={!body.trim() ? "Type a message first" : ""}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1e3a5f] text-white text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#152b47]"
                >
                  {sendReply.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  {composeMode === "note" ? "Add Note" : "Send Reply"}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Column C — Info Panel ─────────────────────────── */}
      <aside className="hidden lg:flex w-[340px] shrink-0 flex-col bg-white">
        <div className="flex border-b border-slate-200 text-xs shrink-0">
          {(["details", "customer", "order", "history"] as const).map((t) => {
            const Icon = t === "details" ? Info : t === "customer" ? User : t === "order" ? Package : History;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 flex items-center justify-center gap-1 capitalize font-medium transition-colors ${
                  tab === t
                    ? "text-blue-700 border-b-2 border-blue-600 bg-blue-50/50"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="h-3.5 w-3.5" /> {t}
              </button>
            );
          })}
        </div>
        <div className="flex-1 overflow-y-auto p-4 text-xs">
          {tab === "details" && (
            <DetailsTab
              ticket={ticket}
              slaHours={Math.floor((Date.now() - new Date(ticket.created_at).getTime()) / 3600000)}
            />
          )}
          {tab === "customer" && (
            <CustomerTab
              cust={cust}
              customerStats={(data as any).customerStats}
              hideFinancial={isSupportOnly}
            />
          )}
          {tab === "order" && <OrderTab app={app} />}
          {tab === "history" && (
            <HistoryTab
              previous={(data as any).previousTickets ?? []}
              currentId={ticket.id}
            />
          )}
        </div>
      </aside>

      {/* ── Dialogs ─────────────────────────────────────────── */}
      {restartConfirm && (
        <ConfirmDialog
          title="Restart Order?"
          body="This will close the ticket and return the order to Form Submitted stage. Any pending customer-delay closure timer will be cancelled."
          confirmLabel="Restart Order"
          confirmTone="emerald"
          onConfirm={() => { setRestartConfirm(false); doCloseRestart.mutate(); }}
          onClose={() => setRestartConfirm(false)}
        />
      )}

      {consultOpen && (
        <ConsultDialog
          value={consultNote}
          onChange={setConsultNote}
          onCancel={() => { setConsultOpen(false); setConsultNote(""); }}
          onSend={() => {
            setConsultOpen(false);
            doCloseConsult.mutate(consultNote);
            setConsultNote("");
          }}
        />
      )}

      {reasonOpen && (
        <ReasonPicker
          open={reasonOpen}
          onClose={() => setReasonOpen(false)}
          onConfirm={(payload) => {
            setReasonOpen(false);
            doCloseReply.mutate({ reason: payload.reason, note: payload.note });
          }}
          title="Close with Reply (TB02)"
          description="A reason-templated email will be sent to the customer and a 24-hour auto-close timer will start."
        />
      )}
    </div>
  );
}

// ── message bubble ─────────────────────────────────────────

function MessageBubble({ msg, customerName }: { msg: Msg; customerName?: string | null }) {
  if (msg.kind === "note") {
    return (
      <div className="max-w-3xl mx-auto">
        <div
          className="rounded-lg p-3 shadow-sm"
          style={{ background: "#fffbeb", borderLeft: "3px solid #f59e0b" }}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-amber-900">
              👁 {msg.author_name}
              <span className="ml-2 text-[10px] font-medium bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded uppercase">
                Internal Note
              </span>
            </span>
            <span className="text-amber-700/70">{ist(msg.created_at)}</span>
          </div>
          <div className="text-sm text-amber-950 whitespace-pre-wrap leading-relaxed">
            {msg.body_text}
          </div>
        </div>
      </div>
    );
  }

  if (msg.kind === "inbound") {
    const parsed = parseEmailReply(decodeEntities(msg.body_text || stripHtml(msg.body_html || "")));
    return (
      <div className="max-w-3xl mr-auto">
        <div
          className="bg-white rounded-lg p-3 shadow-sm"
          style={{ borderLeft: "3px solid #22c55e" }}
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="h-6 w-6 rounded-full flex items-center justify-center text-white text-[10px] font-semibold shrink-0"
                style={{ background: "#16a34a" }}
              >
                {initials(customerName)}
              </span>
              <div className="min-w-0">
                <div className="font-semibold text-slate-900 truncate">
                  {customerName || "Customer"}
                  <span className="ml-1.5 text-[10px] font-medium bg-green-100 text-green-800 px-1.5 py-0.5 rounded uppercase">
                    Customer
                  </span>
                </div>
                <div className="text-slate-500 font-mono text-[10px] truncate">{msg.from_email ?? "—"}</div>
              </div>
            </div>
            <span className="text-slate-400 shrink-0 ml-2">{rel(msg.created_at)}</span>
          </div>
          <div className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
            {parsed.newContent || "(no content)"}
          </div>
          {parsed.hasQuotedContent && (
            <QuotedToggle text={parsed.quotedContent} />
          )}
        </div>
      </div>
    );
  }

  // outbound
  return (
    <div className="max-w-3xl ml-auto">
      <div
        className="rounded-lg p-3 shadow-sm"
        style={{ background: "#eff6ff", borderRight: "3px solid #1e3a5f" }}
      >
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="h-6 w-6 rounded-full flex items-center justify-center text-white text-[10px] font-semibold shrink-0"
              style={{ background: "#1e3a5f" }}
            >
              BHS
            </span>
            <div className="min-w-0">
              <div className="font-semibold text-slate-900 truncate flex items-center gap-1.5 flex-wrap">
                Business Help Services
                {msg.template_hint && (
                  <span className="text-[10px] font-medium bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-mono">
                    {msg.template_hint}
                  </span>
                )}
                <span className="text-[10px] font-medium bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded uppercase">
                  Template
                </span>
              </div>
              <div className="text-slate-500 font-mono text-[10px] truncate">{msg.from_email ?? "help@businesshelpservices.com"}</div>
            </div>
          </div>
          <span className="text-slate-400 shrink-0 ml-2">{rel(msg.created_at)}</span>
        </div>
        {msg.subject && (
          <div className="text-xs font-semibold text-slate-700 mb-1.5">
            {msg.subject}
          </div>
        )}
        <EmailIframe html={msg.body_html} fallback={msg.body_text} />
      </div>
    </div>
  );
}

function stripHtml(html: string) {
  return html.replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function QuotedToggle({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-2 border-t border-slate-100 pt-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
      >
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
        {open ? "Hide quoted text" : "Show quoted text"}
      </button>
      {open && (
        <div className="mt-1.5 pl-2 border-l-2 border-slate-200 text-[12px] text-slate-500 whitespace-pre-wrap leading-relaxed">
          {text}
        </div>
      )}
    </div>
  );
}

function EmailIframe({ html, fallback }: { html: string | null; fallback: string }) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState(0);

  if (!html) {
    return (
      <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
        {fallback || "(no body)"}
      </div>
    );
  }

  const safe = DOMPurify.sanitize(html, {
    WHOLE_DOCUMENT: true,
    ADD_ATTR: ["target"],
  });

  const collapsed = !expanded && height > 260;

  return (
    <div className="rounded border border-slate-200 bg-white overflow-hidden">
      <div style={{ maxHeight: collapsed ? 260 : "none", overflow: "hidden", position: "relative" }}>
        <iframe
          ref={iframeRef}
          title="email-preview"
          srcDoc={safe}
          sandbox="allow-same-origin"
          style={{ width: "100%", border: "none", height: height ? `${height}px` : "260px", display: "block" }}
          onLoad={(e) => {
            const iframe = e.currentTarget as HTMLIFrameElement;
            try {
              const h = iframe.contentDocument?.body?.scrollHeight ?? 260;
              setHeight(Math.max(200, h + 16));
            } catch {
              /* noop */
            }
          }}
        />
        {collapsed && (
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>
      {height > 260 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full text-[11px] text-blue-700 hover:bg-blue-50 py-1.5 border-t border-slate-200"
        >
          {expanded ? "Show less ↑" : "Show full email ↓"}
        </button>
      )}
    </div>
  );
}

// ── header badges with dropdowns ───────────────────────────

function StatusBadge({ status, onChange }: { status: TicketStatus; onChange: (s: TicketStatus) => void }) {
  const [open, setOpen] = useState(false);
  const pill = STATUS_PILL[status];
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full"
        style={{ background: pill.bg, color: pill.fg }}
      >
        ● {pill.label} <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <div
          className="absolute left-0 top-full mt-1 bg-white border border-slate-200 rounded shadow-lg z-20 text-xs"
          onMouseLeave={() => setOpen(false)}
        >
          {(Object.keys(STATUS_PILL) as TicketStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => { setOpen(false); onChange(s); }}
              className="block w-full text-left px-3 py-1.5 hover:bg-slate-50 whitespace-nowrap"
            >
              {STATUS_PILL[s].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PriorityBadge({ priority, onChange }: { priority: TicketPriority; onChange: (p: TicketPriority) => void }) {
  const [open, setOpen] = useState(false);
  const pill = PRIORITY_PILL[priority];
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full"
        style={{ background: pill.bg, color: pill.fg }}
      >
        {pill.label} <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <div
          className="absolute left-0 top-full mt-1 bg-white border border-slate-200 rounded shadow-lg z-20 text-xs"
          onMouseLeave={() => setOpen(false)}
        >
          {(Object.keys(PRIORITY_PILL) as TicketPriority[]).map((p) => (
            <button
              key={p}
              onClick={() => { setOpen(false); onChange(p); }}
              className="block w-full text-left px-3 py-1.5 hover:bg-slate-50 whitespace-nowrap"
            >
              {PRIORITY_PILL[p].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AssigneePicker({
  currentId, currentName, staff, onPick,
}: {
  currentId: string | null;
  currentName: string | null;
  staff: Array<{ id: string; full_name?: string; email?: string; display_name?: string }>;
  onPick: (id: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
      >
        <User className="h-3 w-3" />
        {currentName || (currentId ? "Assigned" : "Unassigned")}
        <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <div
          className="absolute left-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded shadow-lg z-20 text-xs max-h-64 overflow-y-auto"
          onMouseLeave={() => setOpen(false)}
        >
          <button
            onClick={() => { setOpen(false); onPick(null); }}
            className="block w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-500"
          >
            Unassigned
          </button>
          {(staff ?? []).map((s) => (
            <button
              key={s.id}
              onClick={() => { setOpen(false); onPick(s.id); }}
              className="block w-full text-left px-3 py-1.5 hover:bg-slate-50 truncate"
            >
              {s.full_name || s.display_name || s.email || "Staff"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── info tabs ──────────────────────────────────────────────

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5 border-b border-slate-100 last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-800 text-right font-medium max-w-[200px] truncate">{value}</span>
    </div>
  );
}

function DetailsTab({ ticket, slaHours }: { ticket: any; slaHours: number }) {
  const slaColor = slaHours < 24 ? "text-emerald-600" : slaHours < 72 ? "text-amber-600" : "text-rose-600";
  return (
    <div className="space-y-4">
      <section>
        <h4 className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Ticket</h4>
        <Row label="ID" value={<span className="font-mono">{ticket.ticket_number}</span>} />
        <Row label="Status" value={STATUS_PILL[ticket.status as TicketStatus].label} />
        <Row label="Priority" value={PRIORITY_PILL[(ticket.priority as TicketPriority) ?? "medium"].label} />
        <Row label="Source" value={ticket.source ?? "—"} />
        <Row label="Assigned to" value={ticket.assigned_name || "Unassigned"} />
        <Row label="Category" value={ticket.services?.service_name ?? "—"} />
        <Row label="Created" value={ist(ticket.created_at)} />
        <Row label="Updated" value={ist(ticket.updated_at)} />
        {ticket.first_response_at && <Row label="First response" value={rel(ticket.first_response_at)} />}
        <Row label="SLA age" value={<span className={slaColor}>{slaHours}h</span>} />
      </section>
    </div>
  );
}

function CustomerTab({ cust, customerStats, hideFinancial }: {
  cust: any; customerStats: any; hideFinancial: boolean;
}) {
  return (
    <div className="space-y-2">
      <div>
        <div className="text-base font-semibold text-slate-900">{cust?.name ?? "—"}</div>
        <div className="text-xs text-slate-600 font-mono">{cust?.primary_email ?? "—"}</div>
        <div className="text-xs text-slate-600 font-mono">{cust?.primary_mobile ?? "—"}</div>
      </div>
      <div className="pt-2">
        <Row label="State" value={cust?.state ?? "—"} />
        <Row label="Total orders" value={customerStats?.totalOrders ?? 0} />
        {!hideFinancial && (
          <Row
            label="Lifetime value"
            value={new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(customerStats?.lifetimeValue ?? 0)}
          />
        )}
        <Row label="Open tickets" value={customerStats?.openTickets ?? 0} />
      </div>
      {cust?.id && (
        <Link
          to="/admin/customers/$customerId"
          params={{ customerId: cust.id }}
          className="inline-flex items-center gap-1 text-xs text-blue-700 hover:underline mt-2"
        >
          View customer profile <ExternalLink className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}

function OrderTab({ app }: { app: any }) {
  if (!app?.id) {
    return <div className="text-slate-500 italic">No linked order.</div>;
  }
  return (
    <div>
      <Row label="Order No." value={<span className="font-mono">{app.application_code}</span>} />
      <Row label="Service" value={app.services?.service_name ?? "—"} />
      <Row label="Status" value={app.order_status ?? "—"} />
      <Row label="Stage" value={app.fulfillment_status ?? "—"} />
      <Row label="Created" value={ist(app.created_at)} />
      <Link
        to="/admin/orders/$applicationId"
        params={{ applicationId: app.id }}
        className="inline-flex items-center gap-1 text-xs text-blue-700 hover:underline mt-3"
      >
        Open order workspace <ExternalLink className="h-3 w-3" />
      </Link>
    </div>
  );
}

function HistoryTab({ previous, currentId }: { previous: any[]; currentId: string }) {
  if (!previous || previous.length === 0) {
    return <div className="text-slate-500 italic">No previous tickets for this customer.</div>;
  }
  return (
    <ul className="space-y-2">
      {previous.map((t) => {
        const pill = STATUS_PILL[t.status as TicketStatus];
        const isCurrent = t.id === currentId;
        return (
          <li key={t.id}>
            <Link
              to="/admin/support/tickets/$ticketId"
              params={{ ticketId: t.id }}
              className={`block p-2 rounded border ${isCurrent ? "bg-blue-50 border-blue-200" : "border-slate-200 hover:bg-slate-50"}`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono text-slate-600">{t.ticket_number}</span>
                <span
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                  style={{ background: pill.bg, color: pill.fg }}
                >
                  {pill.label}
                </span>
              </div>
              <div className="mt-0.5 text-xs text-slate-800 truncate">{t.subject}</div>
              <div className="mt-0.5 text-[10px] text-slate-400">{istDate(t.created_at)}</div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

// ── dialogs ────────────────────────────────────────────────

function ConfirmDialog({ title, body, confirmLabel, confirmTone, onConfirm, onClose }: {
  title: string; body: string; confirmLabel: string;
  confirmTone: "emerald" | "rose";
  onConfirm: () => void; onClose: () => void;
}) {
  const tone = confirmTone === "emerald"
    ? "bg-emerald-600 hover:bg-emerald-700"
    : "bg-rose-600 hover:bg-rose-700";
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{body}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 rounded-md text-sm text-slate-700 hover:bg-slate-100">Cancel</button>
          <button onClick={onConfirm} className={`px-3 py-1.5 rounded-md text-sm text-white ${tone}`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

function ConsultDialog({ value, onChange, onCancel, onSend }: {
  value: string; onChange: (v: string) => void; onCancel: () => void; onSend: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-semibold text-slate-900">Consultation Done (TB01)</h3>
        <p className="mt-1 text-sm text-slate-600">
          Sends the T001 consultation-completed email to the customer and closes the ticket.
        </p>
        <label className="block mt-3 text-xs font-medium text-slate-700">Employee remarks (optional)</label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          placeholder="Anything to include in the email…"
          className="mt-1 w-full text-sm px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-1.5 rounded-md text-sm text-slate-700 hover:bg-slate-100">Cancel</button>
          <button onClick={onSend} className="px-3 py-1.5 rounded-md text-sm text-white bg-teal-600 hover:bg-teal-700">Send & Close</button>
        </div>
      </div>
    </div>
  );
}
