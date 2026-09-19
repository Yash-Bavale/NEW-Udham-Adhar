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
  Paperclip, Link2, Copy, Check, ChevronUp, Sparkles, MoreVertical, Eye, Phone
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
  const isSupportOnly = role.roles.includes("support") && role.roles.length === 1;

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
  useRealtimeTable("ticket_replies", invalidate, { filter: `ticket_id=eq.${ticketId}` });
  const appId = data?.ticket?.application_id ?? null;
  useRealtimeTable("email_logs", invalidate, appId ? { filter: `application_id=eq.${appId}` } : undefined);

  const messages: Msg[] = useMemo(() => {
    if (!data) return [];
    const out: Msg[] = [];
    const t = data.ticket as any;
    const cust = t?.customers ?? {};

    // 1. Initial ticket description (if present and not duplicated by the first reply)
    const desc = (t?.description ?? "").trim();
    const firstReply = data.replies?.[0];
    const firstReplyText = (firstReply?.reply_text ?? "").trim();
    const isFirstReplySameAsDesc =
      Boolean(desc && firstReplyText && (firstReplyText === desc || firstReplyText.includes(desc)));

    if (desc && !isFirstReplySameAsDesc) {
      const isStaffCreated = t.source === "staff";
      if (isStaffCreated) {
        out.push({
          kind: "note",
          id: `ticket-desc-${t.id}`,
          created_at: t.created_at,
          author_name: t.assigned_name || "Staff",
          body_text: desc,
        });
      } else {
        out.push({
          kind: "inbound",
          id: `ticket-desc-${t.id}`,
          created_at: t.created_at,
          from_email: t.ticket_email ?? cust.primary_email ?? null,
          subject: t.subject ?? null,
          body_text: desc,
          body_html: null,
        });
      }
    }

    // 2. All ticket replies
    for (const r of (data.replies ?? []) as any[]) {
      if (r.is_internal || r.direction === "note") {
        out.push({
          kind: "note",
          id: `n-${r.id}`,
          created_at: r.created_at,
          author_name: r.author_name ?? "Staff",
          body_text: r.reply_text ?? "",
        });
      } else if (r.direction === "inbound") {
        out.push({
          kind: "inbound",
          id: `ri-${r.id}`,
          created_at: r.created_at,
          from_email: r.from_email ?? t.ticket_email ?? cust.primary_email ?? null,
          subject: r.subject ?? null,
          body_text: r.reply_text ?? "",
          body_html: r.body_html ?? null,
        });
      } else {
        out.push({
          kind: "outbound",
          id: `ro-${r.id}`,
          created_at: r.emailed_at ?? r.created_at,
          from_email: r.from_email ?? "help@businesshelpservices.com",
          subject: r.subject ?? null,
          body_html: r.body_html ?? null,
          body_text: r.reply_text ?? "",
          template_hint: r.template_code ?? extractTemplateHint(r.subject, r.body_html),
          status: r.email_status ?? (r.emailed_at ? "sent" : null),
          author_name: r.author_name ?? "Business Help Services",
        });
      }
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
    mutationFn: (v: { reasonId: string | null; reasonLabel: string; replyBody: string }) =>
      closeReply({ data: { ticketId, reasonId: v.reasonId, reasonLabel: v.reasonLabel, replyBody: v.replyBody } }),
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
      <div className="h-[calc(100dvh-3.5rem)] -m-4 md:-m-6 -mb-24 md:-mb-6 flex items-center justify-center bg-slate-50">
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
  const [sidebarView, setSidebarView] = useState<"overview" | "tabs">("overview");

  return (
    <div className="h-[calc(100dvh-3.5rem)] -m-4 md:-m-6 -mb-24 md:-mb-6 flex bg-slate-100 min-w-0 overflow-hidden">
      {/* ── Center Section — Conversation ─────────────────── */}
      <section className="flex-1 min-w-0 flex flex-col h-full bg-white border-r border-slate-200 overflow-hidden">
        {/* B1: Modern Header (Matching Mockup) */}
        <header className="border-b border-slate-200 px-5 py-3.5 shrink-0 bg-white shadow-2xs">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                onClick={() => navigate({ to: "/admin/support/tickets" })}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                title="Back to tickets list"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
              
              <h2 className="text-base font-bold text-slate-900 tracking-tight truncate flex items-center gap-2">
                <span>{ticket.subject || "(no subject)"}</span>
                {ticket.is_new && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold uppercase tracking-wide bg-rose-600 text-white shrink-0">
                    NEW
                  </span>
                )}
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                {ticket.ticket_number}
              </span>
              <StatusBadge status={ticket.status} onChange={(s) => changeStatus.mutate(s)} />
              <PriorityBadge
                priority={(ticket.priority as TicketPriority) ?? "medium"}
                onChange={(p) => changePriority.mutate(p)}
              />
            </div>
          </div>

          {/* Customer Metadata Strip */}
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-4 flex-wrap">
            <span className="font-semibold text-slate-900 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-slate-400" />
              {cust.name ?? "Customer"}
            </span>
            <span className="font-mono text-slate-600 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              {ticket.ticket_email ?? cust.primary_email ?? "—"}
            </span>
            {cust.primary_mobile && (
              <span className="font-mono text-slate-600 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                {cust.primary_mobile}
              </span>
            )}
            {app.application_code && (
              <Link
                to="/admin/orders/$orderId"
                params={{ orderId: app.id }}
                className="font-mono text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline bg-indigo-50/70 px-2 py-0.5 rounded-md border border-indigo-100 inline-flex items-center gap-1"
              >
                <Package className="h-3.5 w-3.5 text-indigo-500" />
                Order: {app.application_code}
              </Link>
            )}
            <span className="text-slate-400 inline-flex items-center gap-1 ml-auto text-[11px]">
              <Clock className="h-3 w-3" /> Created: {ist(ticket.created_at)}
            </span>
          </div>
        </header>

        {/* B2: Action Bar (Matching Mockup) */}
        <div className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur-sm border-b border-slate-200 px-5 py-2.5 flex items-center gap-2 flex-wrap shrink-0">
          <button
            onClick={openReply}
            disabled={isClosed}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1e3a5f] text-white text-xs font-semibold hover:bg-[#152b47] disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs transition-all"
          >
            <CornerDownLeft className="h-3.5 w-3.5" /> Reply
          </button>
          
          <button
            onClick={openNote}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50 shadow-2xs transition-all"
          >
            <StickyNote className="h-3.5 w-3.5 text-amber-500" /> Internal Note
          </button>

          <AssigneePicker
            currentId={ticket.assigned_to}
            currentName={ticket.assigned_name}
            staff={(((staff as any)?.staff ?? []) as Array<{ id: string; name: string }>).map((s) => ({ id: s.id, full_name: s.name }))}
            onPick={(id) => changeAssignee.mutate(id)}
          />

          {!isClosed && (
            <>
              <div className="relative">
                <button
                  onClick={() => setCloseMenuOpen((v) => !v)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-2xs transition-all"
                >
                  Close <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                </button>
                {closeMenuOpen && (
                  <div
                    className="absolute left-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-20 text-xs py-1 animate-in fade-in"
                    onMouseLeave={() => setCloseMenuOpen(false)}
                  >
                    <button
                      onClick={() => { setCloseMenuOpen(false); doCloseNormal.mutate(); }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                    >
                      <X className="h-3.5 w-3.5 text-slate-400" /> Close — No Action
                    </button>
                    <button
                      onClick={() => { setCloseMenuOpen(false); setReasonOpen(true); }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-rose-700 font-medium"
                    >
                      <Mail className="h-3.5 w-3.5 text-rose-500" /> Close with Reply (TB02)
                    </button>
                    <button
                      onClick={() => { setCloseMenuOpen(false); setRestartConfirm(true); }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-emerald-700 font-medium"
                    >
                      <RotateCcw className="h-3.5 w-3.5 text-emerald-500" /> Close &amp; Restart Order
                    </button>
                  </div>
                )}
              </div>

              <div className="h-4 w-px bg-slate-300 mx-1 hidden sm:block" />

              <button
                onClick={() => setRestartConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium shadow-2xs transition-all"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Restart Order
              </button>
              
              <button
                onClick={() => setConsultOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium shadow-2xs transition-all"
              >
                TB01: Consultation Done
              </button>
              
              <button
                onClick={() => setReasonOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium shadow-2xs transition-all"
              >
                TB02: Reply w/ Reason (24h)
              </button>
            </>
          )}

          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={() => invalidate()}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs"
              title="Refresh messages"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* B3: Conversation Thread Feed (Matching Mockup) */}
        <div ref={threadRef} className="flex-1 min-h-0 overflow-y-auto px-5 py-5 space-y-4 bg-slate-50/60">
          {rendered.length === 0 && (
            <div className="text-center py-20 text-sm text-slate-500 flex flex-col items-center gap-2">
              <MessageSquare className="h-10 w-10 text-slate-300" />
              <p className="font-semibold text-slate-700">No messages in this ticket yet</p>
              <p className="text-xs text-slate-400">Click Reply below to send an email to the customer.</p>
            </div>
          )}
          {rendered.map((r, i) =>
            r.divider ? (
              <div key={`d-${i}`} className="flex items-center gap-3 my-3">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/60">
                  {r.divider}
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
            ) : (
              <MessageBubble
                key={r.msg!.id}
                msg={r.msg!}
                customerName={cust.name}
                customerEmail={ticket.ticket_email ?? cust.primary_email}
              />
            )
          )}
        </div>

        {/* B4: Redesigned Composer (Matching Mockup) */}
        <div className="border-t border-slate-200 bg-white shrink-0 shadow-lg">
          {composeMode === null ? (
            <div className="p-3 bg-slate-50/50 flex items-center justify-between gap-3">
              <button
                onClick={openReply}
                disabled={isClosed}
                className="flex-1 text-left px-4 py-2.5 text-xs text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-2xs transition-all font-medium"
              >
                <CornerDownLeft className="h-3.5 w-3.5 text-slate-400" />
                {isClosed ? "Ticket is closed — reopen to reply" : "Click to reply to customer…"}
              </button>

              <button
                onClick={openNote}
                className="px-3.5 py-2.5 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg flex items-center gap-1.5 shadow-2xs transition-all"
              >
                <StickyNote className="h-3.5 w-3.5 text-amber-600" /> Note
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {/* Composer Header & Recipient Info */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5 text-xs">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => setComposeMode("reply")}
                    className={`px-3 py-1 rounded-md font-semibold transition-all ${
                      composeMode === "reply"
                        ? "bg-[#1e3a5f] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <CornerDownLeft className="h-3 w-3 inline mr-1" /> Reply
                  </button>
                  <button
                    onClick={() => setComposeMode("note")}
                    className={`px-3 py-1 rounded-md font-semibold transition-all ${
                      composeMode === "note"
                        ? "bg-amber-500 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <StickyNote className="h-3 w-3 inline mr-1" /> Internal Note
                  </button>
                </div>

                {composeMode === "reply" && (
                  <div className="flex items-center gap-2 text-slate-500">
                    <span>To:</span>
                    <span className="font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px] font-medium">
                      {ticket.ticket_email ?? cust.primary_email ?? "—"}
                    </span>
                    <span className="text-[11px] text-slate-400">Cc Bcc</span>
                  </div>
                )}

                <button
                  onClick={() => {
                    setComposeMode(null);
                    setBody("");
                    setSelectedTemplateId(null);
                    setSelectedTemplateName(null);
                  }}
                  className="size-7 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors ml-auto"
                  title="Close composer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Template pills / selector */}
              {composeMode === "reply" && (canned?.length ?? 0) > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                    <Sparkles className="size-3 text-indigo-500" /> Templates:
                  </span>
                  {(canned ?? []).slice(0, 8).map((c: any) => (
                    <button
                      key={c.id}
                      onClick={() => applyTemplate(c.id)}
                      className={`text-[11px] px-2.5 py-1 rounded-full border transition-all font-medium ${
                        selectedTemplateId === c.id
                          ? "bg-indigo-100 border-indigo-400 text-indigo-900 font-bold"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-2xs"
                      }`}
                    >
                      {c.title}
                    </button>
                  ))}
                </div>
              )}

              {selectedTemplateName && (
                <div className="text-[11px] bg-indigo-50 border border-indigo-200 text-indigo-900 px-3 py-1.5 rounded-lg flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" /> Applied template: {selectedTemplateName}
                  </span>
                  <button
                    onClick={() => { setSelectedTemplateId(null); setSelectedTemplateName(null); }}
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    Clear
                  </button>
                </div>
              )}

              {/* Textarea */}
              <textarea
                ref={composerRef}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={composeMode === "note" ? "Add an internal note (only visible to staff)…" : "Type your reply here…"}
                rows={4}
                className={`w-full text-sm px-3.5 py-2.5 border rounded-xl focus:outline-none focus:ring-2 resize-y transition-all ${
                  composeMode === "note"
                    ? "bg-amber-50/40 border-amber-200 focus:ring-amber-400 focus:border-amber-400"
                    : "bg-white border-slate-200 focus:ring-blue-500 focus:border-blue-500"
                }`}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && body.trim()) {
                    sendReply.mutate();
                  }
                }}
              />

              {body.includes("[MISSING:") && (
                <div className="text-[11px] bg-rose-50 border border-rose-200 text-rose-700 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-500" /> Missing variables found in template — please fill before sending.
                </div>
              )}

              {/* Bottom Composer Toolbar */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 shadow-2xs font-medium"
                    title="Attach file (coming soon)"
                  >
                    <Paperclip className="size-3.5" /> Attach
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 shadow-2xs font-medium"
                    title="Insert link (coming soon)"
                  >
                    <Link2 className="size-3.5" /> Insert Link
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[10px] text-slate-600">Ctrl+Enter</kbd> to send
                  </span>

                  <button
                    onClick={() => sendReply.mutate()}
                    disabled={!body.trim() || sendReply.isPending}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1e3a5f] text-white text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#152b47] shadow-xs transition-all"
                  >
                    {sendReply.isPending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                    {composeMode === "note" ? "Add Note" : "Send"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Column C — Info Panel (Matching Mockup) ───────── */}
      <aside className="hidden lg:flex w-[340px] xl:w-[380px] shrink-0 flex-col h-full bg-slate-50 border-l border-slate-200 overflow-hidden">
        {/* View Switcher Top Bar */}
        <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setSidebarView("overview")}
              className={`px-3 py-1 rounded-md transition-all ${
                sidebarView === "overview"
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSidebarView("tabs")}
              className={`px-3 py-1 rounded-md transition-all ${
                sidebarView === "tabs"
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Tabs &amp; Details
            </button>
          </div>

          <span className="text-[11px] font-mono font-bold text-slate-400">
            {ticket.ticket_number}
          </span>
        </div>

        {/* Sidebar Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 text-xs">
          {sidebarView === "overview" ? (
            <>
              {/* Card 1: Order & Ticket Details (Matching Image 3) */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    Order &amp; Ticket
                    {app.id && (
                      <Link
                        to="/admin/orders/$orderId"
                        params={{ orderId: app.id }}
                        className="text-slate-400 hover:text-indigo-600 transition-colors"
                        title="Open order"
                      >
                        <ExternalLink className="size-3.5" />
                      </Link>
                    )}
                  </h3>
                  <button className="text-slate-400 hover:text-slate-600">
                    <MoreHorizontal className="size-3.5" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  {/* Order Number */}
                  <div className="flex items-center justify-between gap-2 py-0.5">
                    <span className="text-slate-500">Order Number</span>
                    {app.application_code ? (
                      <span className="font-mono font-bold text-indigo-600 flex items-center gap-1">
                        {app.application_code}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(app.application_code);
                            toast.success("Order number copied");
                          }}
                          className="text-slate-400 hover:text-slate-700"
                          title="Copy order number"
                        >
                          <Copy className="size-3" />
                        </button>
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">—</span>
                    )}
                  </div>

                  {/* Customer Name */}
                  <div className="flex items-center justify-between gap-2 py-0.5">
                    <span className="text-slate-500">Customer Name</span>
                    <span className="font-semibold text-slate-900 truncate max-w-[180px]">
                      {cust.name ?? "—"}
                    </span>
                  </div>

                  {/* Email */}
                  <div className="flex items-center justify-between gap-2 py-0.5">
                    <span className="text-slate-500">Email</span>
                    <span className="font-mono text-slate-700 truncate max-w-[180px]" title={ticket.ticket_email ?? cust.primary_email}>
                      {ticket.ticket_email ?? cust.primary_email ?? "—"}
                    </span>
                  </div>

                  {/* Service */}
                  <div className="flex items-center justify-between gap-2 py-0.5">
                    <span className="text-slate-500">Service</span>
                    <span className="font-medium text-slate-800 truncate max-w-[180px]">
                      {ticket.services?.service_name ?? app.services?.service_name ?? "—"}
                    </span>
                  </div>

                  {/* Order Stage */}
                  <div className="flex items-center justify-between gap-2 py-0.5">
                    <span className="text-slate-500">Order Stage</span>
                    {app.fulfillment_status ? (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200 capitalize">
                        {app.fulfillment_status.replace(/_/g, " ")}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </div>

                  {/* Order Status */}
                  <div className="flex items-center justify-between gap-2 py-0.5">
                    <span className="text-slate-500">Order Status</span>
                    {app.order_status ? (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 capitalize">
                        {app.order_status}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </div>

                  {/* Ticket Status */}
                  <div className="flex items-center justify-between gap-2 py-0.5">
                    <span className="text-slate-500">Ticket Status</span>
                    <span
                      className="px-2 py-0.5 rounded-full text-[11px] font-bold border"
                      style={{ background: statusPill.bg, color: statusPill.fg }}
                    >
                      {statusPill.label}
                    </span>
                  </div>

                  {/* Created At */}
                  <div className="flex items-center justify-between gap-2 py-0.5">
                    <span className="text-slate-500">Created At</span>
                    <span className="text-slate-700">{ist(ticket.created_at)}</span>
                  </div>

                  {/* Last Reply */}
                  <div className="flex items-center justify-between gap-2 py-0.5">
                    <span className="text-slate-500">Last Reply</span>
                    <span className="text-slate-700">
                      {ticket.last_activity_at ? ist(ticket.last_activity_at) : "—"}
                    </span>
                  </div>

                  {/* Assigned To */}
                  <div className="flex items-center justify-between gap-2 py-0.5">
                    <span className="text-slate-500">Assigned To</span>
                    <span className="font-medium text-slate-800">
                      {ticket.assigned_name || "Unassigned"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Activity Timeline (Matching Image 3) */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-slate-900 text-sm">Activity</h3>
                  <button
                    onClick={() => setSidebarView("tabs")}
                    className="text-xs font-semibold text-blue-700 hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3.5 pl-1 pt-1">
                  {/* Event 1: Sent email / confirmation */}
                  <div className="flex items-start gap-2.5">
                    <div className="size-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <CheckCircle2 className="size-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-slate-900 text-xs leading-tight">
                        Order confirmation sent
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {ist(ticket.created_at)}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Automated email (Template)
                      </div>
                    </div>
                  </div>

                  {/* Event 2: Customer replied */}
                  {ticket.first_response_at && (
                    <div className="flex items-start gap-2.5">
                      <div className="size-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        <Mail className="size-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-slate-900 text-xs leading-tight">
                          Customer replied
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {ist(ticket.first_response_at)}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          Email from {ticket.ticket_email ?? cust.primary_email}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Event 3: Ticket created */}
                  <div className="flex items-start gap-2.5">
                    <div className="size-6 rounded-full bg-slate-400 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="size-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-slate-900 text-xs leading-tight">
                        Ticket created
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {ist(ticket.created_at)}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        From {ticket.source ?? "email channel"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Quick Actions (Matching Image 3) */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2.5">
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                  Quick Actions
                </h3>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {app.id ? (
                    <Link
                      to="/admin/orders/$orderId"
                      params={{ orderId: app.id }}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shadow-2xs"
                    >
                      <Package className="size-3.5 text-slate-500" />
                      View Order
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 text-xs cursor-not-allowed"
                    >
                      <Package className="size-3.5" /> No Order
                    </button>
                  )}

                  {cust.id ? (
                    <Link
                      to="/admin/customers/$customerId"
                      params={{ customerId: cust.id }}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shadow-2xs"
                    >
                      <User className="size-3.5 text-slate-500" />
                      Customer
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 text-xs cursor-not-allowed"
                    >
                      <User className="size-3.5" /> No Profile
                    </button>
                  )}
                </div>

                {app.id && (
                  <Link
                    to="/admin/orders/$orderId"
                    params={{ orderId: app.id }}
                    target="_blank"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 font-semibold text-xs transition-colors shadow-2xs"
                  >
                    <ExternalLink className="size-3.5" />
                    Open Order in New Tab
                  </Link>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex border-b border-slate-200 text-xs shrink-0 bg-white rounded-lg p-1 border">
                {(["details", "customer", "order", "history"] as const).map((t) => {
                  const Icon = t === "details" ? Info : t === "customer" ? User : t === "order" ? Package : History;
                  return (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`flex-1 py-1.5 flex items-center justify-center gap-1 capitalize font-medium rounded-md transition-colors ${
                        tab === t
                          ? "text-blue-700 bg-blue-50 font-bold shadow-2xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" /> {t}
                    </button>
                  );
                })}
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
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
            </div>
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
        <ReasonPickerDialog
          onCancel={() => setReasonOpen(false)}
          onSend={(v: { reasonId: string | null; reasonLabel: string; replyBody: string }) => {
            setReasonOpen(false);
            doCloseReply.mutate(v);
          }}
        />
      )}
    </div>
  );
}

// ── message bubble ─────────────────────────────────────────

function MessageBubble({
  msg,
  customerName,
  customerEmail,
}: {
  msg: Msg;
  customerName?: string | null;
  customerEmail?: string | null;
}) {
  const hasHtml = Boolean((msg as any).body_html && (msg as any).body_html.trim());
  const [viewMode, setViewMode] = useState<"html" | "text">(hasHtml ? "html" : "text");
  const [showFullEmail, setShowFullEmail] = useState(false);

  if (msg.kind === "note") {
    return (
      <div className="max-w-4xl mx-auto w-full">
        <div className="rounded-xl p-4 shadow-2xs border border-amber-200/90 bg-amber-50/60 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-amber-900 flex items-center gap-2">
              <span className="p-1 rounded bg-amber-200 text-amber-950 text-[10px]">👁</span>
              {msg.author_name}
              <span className="text-[10px] font-bold bg-amber-200/90 text-amber-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Internal Note
              </span>
            </span>
            <span className="text-amber-800/70 text-[11px] font-medium">{ist(msg.created_at)}</span>
          </div>
          <div className="text-sm text-amber-950 whitespace-pre-wrap leading-relaxed">
            {msg.body_text}
          </div>
        </div>
      </div>
    );
  }

  if (msg.kind === "inbound") {
    const plain = decodeEntities(msg.body_text || "");
    const parsed = parseEmailReply(plain || (msg.body_html ? stripHtml(msg.body_html) : ""));

    return (
      <div className="max-w-4xl mr-auto w-full">
        <div className="bg-white rounded-xl shadow-2xs border-2 border-emerald-500/80 overflow-hidden">
          {/* Header Bar */}
          <div className="bg-emerald-50/40 border-b border-emerald-100 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="size-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 bg-emerald-600 shadow-2xs">
                {initials(customerName)}
              </span>
              <div className="min-w-0">
                <div className="font-bold text-slate-900 truncate flex items-center gap-2">
                  <span>{customerName || "Customer"}</span>
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Customer
                  </span>
                  <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    Email
                  </span>
                </div>
                <div className="text-slate-500 text-[11px] truncate">
                  To: <span className="font-mono text-slate-700">help@businesshelpservices.com</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-500 text-[11px] font-medium" title={ist(msg.created_at)}>
                {ist(msg.created_at)}
              </span>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreVertical className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Subject & Body */}
          <div className="p-4 space-y-2.5">
            {msg.subject && (
              <div className="text-xs font-bold text-slate-900 leading-snug">
                {msg.subject}
              </div>
            )}

            {/* Message Content */}
            <div className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-normal">
              {parsed.newContent || plain || "(no content)"}
            </div>

            {/* Expand / Quoted toggle */}
            {(hasHtml || parsed.hasQuotedContent) && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setShowFullEmail((v) => !v)}
                  className="text-xs font-semibold text-blue-700 hover:text-blue-800 hover:underline flex items-center gap-1"
                >
                  {showFullEmail ? "Hide full email ↑" : "Show full email ↓"}
                </button>

                {hasHtml && (
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      onClick={() => setViewMode("html")}
                      className={`px-2 py-0.5 rounded ${viewMode === "html" ? "bg-slate-100 text-slate-900 font-bold" : "text-slate-500"}`}
                    >
                      Rich
                    </button>
                    <button
                      onClick={() => setViewMode("text")}
                      className={`px-2 py-0.5 rounded ${viewMode === "text" ? "bg-slate-100 text-slate-900 font-bold" : "text-slate-500"}`}
                    >
                      Plain
                    </button>
                  </div>
                )}
              </div>
            )}

            {showFullEmail && (
              <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                {hasHtml && viewMode === "html" ? (
                  <EmailIframe html={msg.body_html} fallback={parsed.newContent} />
                ) : parsed.hasQuotedContent ? (
                  <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 font-mono whitespace-pre-wrap">
                    {parsed.quotedContent}
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 whitespace-pre-wrap">
                    {plain}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // outbound
  const plain = decodeEntities(msg.body_text || "");
  const parsed = parseEmailReply(plain || (msg.body_html ? stripHtml(msg.body_html) : ""));
  const isOrderReceipt = (msg.subject || "").toLowerCase().includes("order confirmation") || (msg.template_hint === "E003" || msg.template_hint === "T001");

  return (
    <div className="max-w-4xl mr-auto w-full">
      <div className="bg-white rounded-xl shadow-2xs border border-slate-200/90 overflow-hidden">
        {/* Top Header Bar */}
        <div className="bg-slate-50/80 border-b border-slate-100 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="size-7 rounded-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0 bg-[#1e3a5f] shadow-2xs">
              BHS
            </span>
            <div className="min-w-0">
              <div className="font-bold text-slate-900 truncate flex items-center gap-2">
                <span>{msg.author_name || "Business Help Services"}</span>
                {msg.template_hint ? (
                  <span className="text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full font-mono">
                    {msg.template_hint}
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full">
                    Automated
                  </span>
                )}
                <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  Email
                </span>
                {msg.status && (
                  <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full capitalize">
                    {msg.status}
                  </span>
                )}
              </div>
              <div className="text-slate-500 text-[11px] truncate">
                To: <span className="font-mono text-slate-700">{customerEmail || msg.from_email || "customer"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-[11px] font-medium" title={ist(msg.created_at)}>
              {ist(msg.created_at)}
            </span>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreVertical className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3">
          {msg.subject && (
            <div className="text-xs font-bold text-slate-900 leading-snug">
              {msg.subject}
            </div>
          )}

          {/* Dark Navy Banner matching Image 3 */}
          {isOrderReceipt && (
            <div className="bg-[#1e3a5f] text-white px-4 py-2.5 rounded-lg font-bold text-xs tracking-wide shadow-2xs flex items-center justify-between">
              <span>Order Successfully Received</span>
              <CheckCircle2 className="size-3.5 text-emerald-400" />
            </div>
          )}

          {/* Message Content */}
          <div className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-normal">
            {parsed.newContent || msg.body_text || "(no content)"}
          </div>

          {/* Expand / Quoted toggle */}
          {(hasHtml || parsed.hasQuotedContent) && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setShowFullEmail((v) => !v)}
                className="text-xs font-semibold text-blue-700 hover:text-blue-800 hover:underline flex items-center gap-1"
              >
                {showFullEmail ? "Hide full email ↑" : "Show full email ↓"}
              </button>

              {hasHtml && (
                <div className="flex items-center gap-1 text-[11px]">
                  <button
                    onClick={() => setViewMode("html")}
                    className={`px-2 py-0.5 rounded ${viewMode === "html" ? "bg-slate-100 text-slate-900 font-bold" : "text-slate-500"}`}
                  >
                    Rich
                  </button>
                  <button
                    onClick={() => setViewMode("text")}
                    className={`px-2 py-0.5 rounded ${viewMode === "text" ? "bg-slate-100 text-slate-900 font-bold" : "text-slate-500"}`}
                  >
                    Plain
                  </button>
                </div>
              )}
            </div>
          )}

          {showFullEmail && (
            <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
              {hasHtml && viewMode === "html" ? (
                <EmailIframe html={msg.body_html} fallback={msg.body_text} />
              ) : parsed.hasQuotedContent ? (
                <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 font-mono whitespace-pre-wrap">
                  {parsed.quotedContent}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 whitespace-pre-wrap">
                  {plain}
                </div>
              )}
            </div>
          )}
        </div>
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
        className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
      >
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
        {open ? "Hide quoted text" : "Show quoted text"}
      </button>
      {open && (
        <div className="mt-1.5 pl-2 border-l-2 border-slate-200 text-[12px] text-slate-500 whitespace-pre-wrap leading-relaxed font-sans">
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

  const clean = DOMPurify.sanitize(html, {
    WHOLE_DOCUMENT: true,
    ADD_ATTR: ["target"],
  });

  // Give bare-HTML mails a readable base style so previews don't collapse into
  // unstyled walls of text.
  const safe = /<html[\s>]/i.test(clean)
    ? clean
    : `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
        html,body{margin:0;padding:0;background:#fff}
        body{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#0f172a;padding:14px}
        img{max-width:100%;height:auto}
        table{max-width:100%}
        a{color:#1d4ed8}
      </style></head><body>${clean}</body></html>`;

  const collapsed = !expanded && height > 380;

  return (
    <div className="rounded border border-slate-200 bg-white overflow-hidden shadow-2xs">
      <div style={{ maxHeight: collapsed ? 380 : "none", overflow: "hidden", position: "relative" }}>
        <iframe
          ref={iframeRef}
          title="email-preview"
          srcDoc={safe}
          sandbox="allow-same-origin allow-popups"
          style={{ width: "100%", border: "none", height: height ? `${height}px` : "260px", display: "block" }}
          onLoad={(e) => {
            const iframe = e.currentTarget as HTMLIFrameElement;
            try {
              const h = iframe.contentDocument?.body?.scrollHeight ?? 260;
              setHeight(Math.max(180, h + 20));
            } catch {
              /* noop */
            }
          }}
        />
        {collapsed && (
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        )}
      </div>
      {height > 380 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full text-xs font-medium text-blue-700 hover:bg-blue-50 py-2 border-t border-slate-200 transition-colors flex items-center justify-center gap-1 bg-slate-50/50"
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
        to="/admin/orders/$orderId"
        params={{ orderId: app.id }}
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

function ReasonPickerDialog({
  onCancel, onSend,
}: {
  onCancel: () => void;
  onSend: (v: { reasonId: string | null; reasonLabel: string; replyBody: string }) => void;
}) {
  const [reasonId, setReasonId] = useState<string | null>(null);
  const [reasonLabel, setReasonLabel] = useState<string>("");
  const [reply, setReply] = useState<string>("");
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-5" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-semibold text-slate-900">Close with Reply (TB02)</h3>
        <p className="mt-1 text-sm text-slate-600">
          Pick a reason. The T002 email will be sent to the customer with the reply below and a
          24-hour auto-close timer will start.
        </p>
        <div className="mt-4">
          <ReasonPicker
            value={reasonId}
            onChange={(id, reason) => {
              setReasonId(id);
              setReasonLabel(reason?.label ?? "");
            }}
            reply={reply}
            onReplyChange={setReply}
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-1.5 rounded-md text-sm text-slate-700 hover:bg-slate-100">Cancel</button>
          <button
            onClick={() => onSend({ reasonId, reasonLabel, replyBody: reply })}
            disabled={!reasonId || !reply.trim()}
            className="px-3 py-1.5 rounded-md text-sm text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send & Arm 24h Close
          </button>
        </div>
      </div>
    </div>
  );
}
