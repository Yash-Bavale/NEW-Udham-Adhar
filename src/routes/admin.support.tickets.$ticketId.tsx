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
  FileText, Download, UserPlus, Phone, Tag, ShieldCheck, Forward, Trash2,
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
import { parseEmailReply, parseHtmlEmailReply } from "@/lib/support/emailParser";
import { useRole } from "@/hooks/useRole";

export const Route = createFileRoute("/admin/support/tickets/$ticketId")({
  head: ({ params }) => ({
    meta: [
      { title: `Ticket ${params.ticketId.slice(0, 8)} — BHS Helpdesk` },
      { name: "description", content: "Support ticket workspace." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: TicketWorkspace,
});

const STATUS_PILL: Record<TicketStatus, { bg: string; fg: string; label: string }> = {
  open: { bg: "bg-blue-100 text-blue-800 border-blue-200", fg: "#1d4ed8", label: "Open" },
  in_progress: { bg: "bg-purple-100 text-purple-800 border-purple-200", fg: "#6d28d9", label: "In Progress" },
  waiting_customer: { bg: "bg-amber-100 text-amber-800 border-amber-200", fg: "#92400e", label: "Waiting Customer" },
  resolved: { bg: "bg-emerald-100 text-emerald-800 border-emerald-200", fg: "#15803d", label: "Resolved" },
  closed: { bg: "bg-slate-200 text-slate-700 border-slate-300", fg: "#475569", label: "Closed" },
};

const PRIORITY_PILL: Record<TicketPriority, { bg: string; fg: string; label: string }> = {
  urgent: { bg: "bg-red-100 text-red-800", fg: "#991b1b", label: "Urgent" },
  high: { bg: "bg-orange-100 text-orange-800", fg: "#9a3412", label: "High" },
  medium: { bg: "bg-blue-100 text-blue-800", fg: "#1d4ed8", label: "Normal" },
  low: { bg: "bg-slate-100 text-slate-700", fg: "#475569", label: "Low" },
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
  return `${Math.floor(s / 86400)}d ago`;
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

function extractTemplateHint(subject: string | null, bodyHtml: string | null): string | null {
  const src = `${subject ?? ""} ${bodyHtml ?? ""}`;
  const m = src.match(/\b(E0\d{2}|T0\d{2}|TB0\d{2})\b/i);
  return m ? m[1].toUpperCase() : null;
}

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

  useRealtimeTable("ticket_replies", invalidate, { filter: `ticket_id=eq.${ticketId}` });
  const appId = data?.ticket?.application_id ?? null;
  useRealtimeTable("email_logs", invalidate, appId ? { filter: `application_id=eq.${appId}` } : undefined);

  const messages: Msg[] = useMemo(() => {
    if (!data) return [];
    const out: Msg[] = [];

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

  const [composeMode, setComposeMode] = useState<"reply" | "note">("reply");
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
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

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
    mutationFn: (assignedTo: string | null) =>
      updateFn({ data: { id: ticketId, assignedTo: assignedTo ?? undefined } }),
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
    onSuccess: () => { toast.success("Ticket closed & order restarted"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const doCloseConsult = useMutation({
    mutationFn: (remarks: string) => closeConsult({ data: { ticketId, remarks } }),
    onSuccess: () => { toast.success("T001 sent & ticket closed"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const doCloseReply = useMutation({
    mutationFn: (v: { reasonId: string | null; reasonLabel: string; replyBody: string }) =>
      closeReply({ data: { ticketId, reasonId: v.reasonId, reasonLabel: v.reasonLabel, replyBody: v.replyBody } }),
    onSuccess: () => { toast.success("T002 sent — 24h auto-close armed"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const [closeMenuOpen, setCloseMenuOpen] = useState(false);
  const [restartConfirm, setRestartConfirm] = useState(false);
  const [consultOpen, setConsultOpen] = useState(false);
  const [consultNote, setConsultNote] = useState("");
  const [reasonOpen, setReasonOpen] = useState(false);

  if (isLoading || !data) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  const ticket = data.ticket as any;
  const cust = ticket.customers ?? {};
  const app = ticket.applications ?? {};
  const isClosed = ["closed", "resolved"].includes(ticket.status);
  const previousTickets = (data as any).previousTickets ?? [];
  const previousOrders = (data as any).previousOrders ?? [];

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
    <div className="h-full flex bg-slate-50 min-w-0 font-sans text-slate-800">
      {/* ── Center Column — Conversation Workspace (Reference 2) ── */}
      <section className="flex-1 min-w-0 flex flex-col bg-white border-r border-slate-200 shadow-2xs">
        {/* Top Action Toolbar (Reference 2) */}
        <header className="border-b border-slate-200 px-6 py-3 bg-white shrink-0">
          <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate({ to: "/admin/support/tickets" })}
                className="lg:hidden p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h1 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Email Conversation</span>
                <span className="text-slate-400 font-normal">·</span>
                <span className="text-indigo-600 text-xs font-semibold">Company Mail</span>
              </h1>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={openReply}
                disabled={isClosed}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all inline-flex items-center gap-1.5 disabled:opacity-50"
              >
                <CornerDownLeft className="w-3.5 h-3.5" /> Reply
              </button>

              <button
                onClick={openNote}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold shadow-xs transition-all inline-flex items-center gap-1.5"
              >
                <StickyNote className="w-3.5 h-3.5" /> Note
              </button>

              <AssigneePicker
                currentId={ticket.assigned_to}
                currentName={ticket.assigned_name}
                staff={(((staff as any)?.staff ?? []) as Array<{ id: string; name: string }>).map((s) => ({ id: s.id, full_name: s.name }))}
                onPick={(id) => changeAssignee.mutate(id)}
              />

              <StatusBadge status={ticket.status} onChange={(s) => changeStatus.mutate(s)} />
              <PriorityBadge priority={(ticket.priority as TicketPriority) ?? "medium"} onChange={(p) => changePriority.mutate(p)} />

              {!isClosed && (
                <div className="relative">
                  <button
                    onClick={() => setCloseMenuOpen((v) => !v)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1"
                  >
                    Close <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {closeMenuOpen && (
                    <div
                      className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-30 text-xs py-1"
                      onMouseLeave={() => setCloseMenuOpen(false)}
                    >
                      <button
                        onClick={() => { setCloseMenuOpen(false); doCloseNormal.mutate(); }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-2"
                      >
                        <X className="w-3.5 h-3.5 text-slate-400" /> Close — No Action
                      </button>
                      <button
                        onClick={() => { setCloseMenuOpen(false); setReasonOpen(true); }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-2"
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-400" /> Close with Reply (TB02)
                      </button>
                      <button
                        onClick={() => { setCloseMenuOpen(false); setRestartConfirm(true); }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-2"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-400" /> Close &amp; Restart Order
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Ticket Title Banner Card (Reference 2 Header Sub-Banner) */}
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-snug">
                {ticket.subject || "(No Subject)"}{" "}
                <span className="font-mono text-xs font-semibold text-indigo-600 ml-1.5">
                  #{ticket.ticket_number}
                </span>
              </h2>
              <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-3">
                <span>Via email to: <strong className="text-slate-600 font-mono">{ticket.ticket_email ?? cust.primary_email ?? "support@businesshelpservices.com"}</strong></span>
                <span>•</span>
                <span>Created {rel(ticket.created_at)} ({ist(ticket.created_at)})</span>
              </div>
            </div>
          </div>
        </header>

        {/* ── Conversation Thread (Reference 2 Middle Area) ── */}
        <div ref={threadRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
          {rendered.length === 0 && (
            <div className="text-center py-20 text-sm text-slate-400 flex flex-col items-center gap-2">
              <MessageSquare className="w-10 h-10 text-slate-300" />
              <span>No messages in this thread yet.</span>
            </div>
          )}

          {rendered.map((r, i) =>
            r.divider ? (
              <div key={`d-${i}`} className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {r.divider}
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
            ) : (
              <MessageCard key={r.msg!.id} msg={r.msg!} customerName={cust.name} />
            )
          )}
        </div>

        {/* ── Composer Toolbar (Reference 2 Bottom Bar) ── */}
        <div className="border-t border-slate-200 bg-white p-4 shrink-0 shadow-lg">
          <div className="flex items-center justify-between gap-2 mb-2 text-xs">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setComposeMode("reply")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  composeMode === "reply"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <CornerDownLeft className="w-3.5 h-3.5 inline mr-1" /> Customer Reply
              </button>
              <button
                type="button"
                onClick={() => setComposeMode("note")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  composeMode === "note"
                    ? "bg-amber-500 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <StickyNote className="w-3.5 h-3.5 inline mr-1" /> Internal Note
              </button>

              {composeMode === "reply" && (
                <span className="text-slate-400 text-[11px] ml-2">
                  To: <strong className="text-slate-700 font-mono">{ticket.ticket_email ?? cust.primary_email ?? "—"}</strong>
                </span>
              )}
            </div>

            {(canned?.length ?? 0) > 0 && composeMode === "reply" && (
              <select
                onChange={(e) => {
                  if (e.target.value) applyTemplate(e.target.value);
                }}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium focus:outline-none"
              >
                <option value="">Insert Canned Response…</option>
                {(canned ?? []).map((c: any) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            )}
          </div>

          <textarea
            ref={composerRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={
              composeMode === "note"
                ? "Add an internal note for your team (visible to staff only)…"
                : "Type your reply to the customer…"
            }
            rows={4}
            className={`w-full text-xs p-3 border rounded-xl focus:outline-none focus:ring-2 resize-y font-sans leading-relaxed ${
              composeMode === "note"
                ? "bg-amber-50/70 border-amber-200 focus:ring-amber-400 text-amber-950"
                : "border-slate-200 focus:ring-indigo-500 text-slate-800"
            }`}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && body.trim()) {
                sendReply.mutate();
              }
            }}
          />

          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">Press Ctrl+Enter to submit</span>
            <button
              type="button"
              onClick={() => sendReply.mutate()}
              disabled={!body.trim() || sendReply.isPending}
              className={`px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                composeMode === "note"
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {sendReply.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              {composeMode === "note" ? "Add Internal Note" : "Send Customer Reply"}
            </button>
          </div>
        </div>
      </section>

      {/* ── Right Column — Customer & Order Context Sidebar (Reference 2) ── */}
      <aside className="hidden lg:flex w-[320px] shrink-0 flex-col bg-white overflow-y-auto border-l border-slate-200 p-5 space-y-6">
        {/* 1. Customer Card */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-sm shrink-0">
              {initials(cust.name)}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-slate-900 truncate">{cust.name || "Customer Profile"}</h3>
              <p className="text-xs text-slate-500 font-mono truncate">{cust.primary_email || ticket.ticket_email || "—"}</p>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200/60">
            {cust.primary_mobile && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Mobile:</span>
                <span className="font-mono font-medium text-slate-800">{cust.primary_mobile}</span>
              </div>
            )}
            {cust.state && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400">State:</span>
                <span className="font-medium text-slate-800">{cust.state}</span>
              </div>
            )}
          </div>

          {cust.id && (
            <Link
              to="/admin/customers/$customerId"
              params={{ customerId: cust.id }}
              className="mt-3 w-full py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-indigo-600 hover:bg-indigo-50 flex items-center justify-center gap-1 transition-colors shadow-2xs"
            >
              <User className="w-3.5 h-3.5" /> View Profile
            </Link>
          )}
        </div>

        {/* 2. Previous Conversations Card (Reference 2) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Previous Conversations</h4>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {previousTickets.length}
            </span>
          </div>

          {previousTickets.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No previous tickets</p>
          ) : (
            <div className="space-y-2.5">
              {previousTickets.slice(0, 4).map((pt: any) => (
                <Link
                  key={pt.id}
                  to="/admin/support/tickets/$ticketId"
                  params={{ ticketId: pt.id }}
                  className="block p-2.5 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 transition-all group"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono font-bold text-indigo-600 group-hover:underline">
                      #{pt.ticket_number}
                    </span>
                    <span className="text-[10px] text-slate-400">{relTime(pt.created_at)}</span>
                  </div>
                  <div className="text-xs font-medium text-slate-800 truncate">{pt.subject || "(No Subject)"}</div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 3. Customer Orders Card (Reference 2) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Customer Orders</h4>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {previousOrders.length}
            </span>
          </div>

          {previousOrders.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No orders found</p>
          ) : (
            <div className="space-y-2.5">
              {previousOrders.slice(0, 4).map((po: any) => (
                <Link
                  key={po.id}
                  to="/admin/orders/$orderId"
                  params={{ orderId: po.id }}
                  className="block p-2.5 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 transition-all group"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono font-bold text-slate-900 group-hover:text-indigo-600">
                      {po.application_code}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {po.order_status || "Active"}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 truncate">{po.services?.service_name || "Service Application"}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* ── Dialogs ── */}
      {restartConfirm && (
        <ConfirmDialog
          title="Restart Order?"
          body="This will close the ticket and return the order to Form Submitted stage."
          confirmLabel="Restart Order"
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

// ── Message Card Renderer (Reference 2 Message Card) ──

function MessageCard({ msg, customerName }: { msg: Msg; customerName?: string | null }) {
  if (msg.kind === "note") {
    return (
      <div className="max-w-3xl mx-auto w-full">
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs mb-2 pb-2 border-b border-amber-200/60">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center">
                ✍
              </span>
              <span className="font-bold text-amber-900">{msg.author_name}</span>
              <span className="text-[9px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full uppercase">
                Internal Note
              </span>
            </div>
            <span className="text-amber-700/70 font-mono text-[11px]">{ist(msg.created_at)}</span>
          </div>
          <div className="text-xs text-amber-950 whitespace-pre-wrap leading-relaxed">
            {msg.body_text}
          </div>
        </div>
      </div>
    );
  }

  const isInbound = msg.kind === "inbound";
  const isHtml = Boolean(msg.body_html && msg.body_html.trim());
  const parsed = isHtml
    ? parseHtmlEmailReply(msg.body_html)
    : parseEmailReply(decodeEntities(msg.body_text || htmlToReadableText(msg.body_html || "")));

  return (
    <div className={`max-w-3xl w-full ${isInbound ? "mr-auto" : "ml-auto"}`}>
      <div
        className={`bg-white rounded-2xl p-5 shadow-xs border transition-all ${
          isInbound
            ? "border-slate-200 border-l-4 border-l-emerald-500"
            : "border-indigo-100 border-l-4 border-l-indigo-600"
        }`}
      >
        {/* Message Header (Reference 2) */}
        <div className="flex items-center justify-between text-xs mb-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-8 h-8 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs ${
                isInbound ? "bg-emerald-600" : "bg-indigo-600"
              }`}
            >
              {isInbound ? initials(customerName) : "BHS"}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-slate-900 truncate flex items-center gap-2">
                <span>{isInbound ? customerName || "Customer" : "Business Help Services"}</span>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    isInbound ? "bg-emerald-100 text-emerald-800" : "bg-indigo-100 text-indigo-800"
                  }`}
                >
                  {isInbound ? "Customer" : "Support Team"}
                </span>
              </div>
              <div className="text-slate-400 font-mono text-[11px] truncate">
                {msg.from_email || (isInbound ? "customer@email.com" : "help@businesshelpservices.com")}
              </div>
            </div>
          </div>

          <span className="text-slate-400 font-mono text-[11px] shrink-0 ml-2">{rel(msg.created_at)}</span>
        </div>

        {/* Message Content */}
        {isHtml ? (
          <EmailIframe html={parsed.newContent} fallback={msg.body_text} />
        ) : (
          <div className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed font-sans">
            {parsed.newContent || htmlToReadableText(msg.body_text) || "(No message content)"}
          </div>
        )}

        {/* Quoted Thread Toggle */}
        {parsed.hasQuotedContent && (
          <QuotedToggle text={parsed.quotedContent} isHtml={isHtml} />
        )}
      </div>
    </div>
  );
}

function htmlToReadableText(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<\/(p|div|tr|h[1-6]|li)>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function QuotedToggle({ text, isHtml }: { text: string; isHtml?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3 pt-3 border-t border-slate-100">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
      >
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        {open ? "Hide quoted thread history" : "Show quoted thread history"}
      </button>
      {open && (
        <div className="mt-2 pl-3 border-l-2 border-slate-200 text-xs text-slate-500">
          {isHtml ? (
            <EmailIframe html={text} fallback={htmlToReadableText(text)} />
          ) : (
            <div className="whitespace-pre-wrap leading-relaxed">{text}</div>
          )}
        </div>
      )}
    </div>
  );
}

function EmailIframe({ html, fallback }: { html: string | null; fallback: string }) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState(0);

  if (!html || !html.trim()) {
    const textFormatted = htmlToReadableText(fallback) || fallback || "(no body)";
    return (
      <div className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed font-sans">
        {textFormatted}
      </div>
    );
  }

  const baseStyle = `<style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 13px; line-height: 1.6; color: #1e293b; margin: 0; padding: 12px; }
    p { margin-top: 0; margin-bottom: 12px; }
    a { color: #2563eb; text-decoration: underline; }
    blockquote { border-left: 3px solid #cbd5e1; margin: 8px 0; padding-left: 12px; color: #64748b; }
    img { max-width: 100%; height: auto; }
    ul, ol { padding-left: 20px; margin-bottom: 12px; }
  </style>`;

  const htmlWithStyle = html.includes("<head>")
    ? html.replace("<head>", `<head>${baseStyle}`)
    : `${baseStyle}${html}`;

  const safe = DOMPurify.sanitize(htmlWithStyle, {
    WHOLE_DOCUMENT: true,
    ADD_ATTR: ["target"],
  });

  const collapsed = !expanded && height > 260;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
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
              setHeight(Math.max(120, h + 16));
            } catch {
              /* noop */
            }
          }}
        />
        {collapsed && (
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none flex items-end justify-center pb-2">
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100/90 backdrop-blur px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
              Email truncated
            </span>
          </div>
        )}
      </div>
      {height > 260 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="w-full text-xs font-semibold text-indigo-600 hover:bg-indigo-50/50 py-1.5 border-t border-slate-200 transition-colors"
        >
          {expanded ? "Show less ↑" : "Show full email ↓"}
        </button>
      )}
    </div>
  );
}

function StatusBadge({ status, onChange }: { status: TicketStatus; onChange: (s: TicketStatus) => void }) {
  const [open, setOpen] = useState(false);
  const pill = STATUS_PILL[status] || STATUS_PILL.open;
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border ${pill.bg}`}
      >
        Status: {pill.label} <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-30 text-xs py-1"
          onMouseLeave={() => setOpen(false)}
        >
          {(Object.keys(STATUS_PILL) as TicketStatus[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => { setOpen(false); onChange(s); }}
              className="block w-full text-left px-3 py-1.5 hover:bg-slate-50 font-medium text-slate-700"
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
  const pill = PRIORITY_PILL[priority] || PRIORITY_PILL.medium;
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg ${pill.bg}`}
      >
        Priority: {pill.label} <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-30 text-xs py-1"
          onMouseLeave={() => setOpen(false)}
        >
          {(Object.keys(PRIORITY_PILL) as TicketPriority[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => { setOpen(false); onChange(p); }}
              className="block w-full text-left px-3 py-1.5 hover:bg-slate-50 font-medium text-slate-700"
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
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
      >
        <User className="w-3.5 h-3.5 text-slate-500" />
        {currentName || (currentId ? "Assigned" : "Unassigned")}
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-30 text-xs max-h-64 overflow-y-auto py-1"
          onMouseLeave={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => { setOpen(false); onPick(null); }}
            className="block w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-500 font-medium"
          >
            Unassigned
          </button>
          {(staff ?? []).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => { setOpen(false); onPick(s.id); }}
              className="block w-full text-left px-3 py-1.5 hover:bg-slate-50 font-medium text-slate-800 truncate"
            >
              {s.full_name || s.display_name || s.email || "Staff"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ConfirmDialog({ title, body, confirmLabel, onConfirm, onClose }: {
  title: string; body: string; confirmLabel: string;
  onConfirm: () => void; onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-xs text-slate-600 leading-relaxed">{body}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
          <button type="button" onClick={onConfirm} className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs">{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

function ConsultDialog({ value, onChange, onCancel, onSend }: {
  value: string; onChange: (v: string) => void; onCancel: () => void; onSend: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-bold text-slate-900">Consultation Done (TB01)</h3>
        <p className="mt-1 text-xs text-slate-600 leading-relaxed">
          Sends T001 consultation email to customer and closes ticket.
        </p>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          placeholder="Employee remarks (optional)…"
          className="mt-3 w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
          <button type="button" onClick={onSend} className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs">Send & Close</button>
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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-bold text-slate-900">Close with Reply (TB02)</h3>
        <p className="mt-1 text-xs text-slate-600 leading-relaxed">
          Pick a closure reason to send T002 email and arm 24h auto-close timer.
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
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
          <button
            type="button"
            onClick={() => onSend({ reasonId, reasonLabel, replyBody: reply })}
            disabled={!reasonId || !reply.trim()}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 shadow-xs"
          >
            Send & Arm 24h Close
          </button>
        </div>
      </div>
    </div>
  );
}

function relTime(iso: string | null | undefined) {
  if (!iso) return "—";
  const sec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (sec < 60) return `${sec}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}
