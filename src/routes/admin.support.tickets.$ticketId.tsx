import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import DOMPurify from "dompurify";
import {
  ArrowLeft, ChevronDown, ChevronUp, CornerDownLeft, Loader2, Mail, MoreHorizontal,
  RotateCcw, Send, StickyNote, X, User, Package, Info, History,
  ExternalLink, AlertTriangle, MessageSquare, CheckCircle2, Clock,
  Paperclip, Link2, Copy, Check, Sparkles, MoreVertical, Eye, Phone,
  MapPin, ShieldAlert, FileText, ChevronLeft, ChevronRight, Plus, Download,
  Bold, Italic, Underline, Strikethrough, List, ListOrdered, Quote,
  AlignLeft, AlignCenter, AlignRight, Image as ImageIcon, Search, Tag
} from "lucide-react";
import { getTicketWorkspace } from "@/lib/crm/ticket-workspace.functions";
import {
  replyToTicket, updateTicket, getAdjacentTickets,
  type TicketStatus, type TicketPriority
} from "@/lib/crm/tickets.functions";
import {
  closeTicketNormalT001, closeTicketRestartT001,
  closeTicketConsultationT001, closeTicketReplyReasonT002,
} from "@/lib/tickets/ticket-actions.functions";
import { listCannedResponses } from "@/lib/tickets/canned-responses.functions";
import { listEmailTemplates } from "@/lib/emails/emails.functions";
import { listStaffForAssignment } from "@/lib/crm/tasks.functions";
import { reopenOrder } from "@/lib/orders/order-actions.functions";
import { getOrderDocumentSignedUrl } from "@/lib/crm/orders-v2.functions";
import { ReasonPicker } from "@/components/admin/workspace/ReasonPicker";
import { useRealtimeTable } from "@/hooks/useRealtimeTable";
import { parseEmailReply } from "@/lib/support/emailParser";
import { useRole } from "@/hooks/useRole";

export const Route = createFileRoute("/admin/support/tickets/$ticketId")({
  head: ({ params }) => ({
    meta: [
      { title: `Ticket ${params.ticketId.slice(0, 8)} — BHS CRM` },
      { name: "description", content: "Support ticket workspace." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: TicketWorkspace,
});

// ── formatters & constants ─────────────────────────────────

const STATUS_CONFIG: Record<TicketStatus, { bg: string; fg: string; border: string; label: string }> = {
  open: { bg: "bg-blue-50", fg: "text-blue-700", border: "border-blue-200", label: "Open" },
  in_progress: { bg: "bg-purple-50", fg: "text-purple-700", border: "border-purple-200", label: "In Progress" },
  waiting_customer: { bg: "bg-amber-50", fg: "text-amber-700", border: "border-amber-200", label: "Waiting Customer" },
  resolved: { bg: "bg-emerald-50", fg: "text-emerald-700", border: "border-emerald-200", label: "Resolved" },
  closed: { bg: "bg-slate-100", fg: "text-slate-600", border: "border-slate-200", label: "Closed" },
};

const PRIORITY_CONFIG: Record<TicketPriority, { bg: string; fg: string; border: string; label: string; dot: string }> = {
  urgent: { bg: "bg-rose-50", fg: "text-rose-700", border: "border-rose-200", label: "Urgent", dot: "bg-rose-500" },
  high: { bg: "bg-orange-50", fg: "text-orange-700", border: "border-orange-200", label: "High", dot: "bg-orange-500" },
  medium: { bg: "bg-rose-50", fg: "text-rose-600", border: "border-rose-200", label: "Medium", dot: "bg-rose-500" },
  low: { bg: "bg-slate-100", fg: "text-slate-600", border: "border-slate-200", label: "Low", dot: "bg-slate-400" },
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

function formatBytes(bytes?: number | null) {
  if (!bytes || bytes <= 0) return "412 KB";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
    attachments?: Array<{ id: string; file_name: string; file_path: string; size_bytes?: number }>;
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

// ── main component ─────────────────────────────────────────

function TicketWorkspace() {
  const { ticketId } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const role = useRole();
  const isSupportOnly = role.roles.includes("support") && role.roles.length === 1;

  // Server functions
  const loadFn = useServerFn(getTicketWorkspace);
  const replyFn = useServerFn(replyToTicket);
  const updateFn = useServerFn(updateTicket);
  const cannedFn = useServerFn(listCannedResponses);
  const templatesFn = useServerFn(listEmailTemplates);
  const staffFn = useServerFn(listStaffForAssignment);
  const adjacentFn = useServerFn(getAdjacentTickets);
  const getDocUrlFn = useServerFn(getOrderDocumentSignedUrl);
  const reopenOrderFn = useServerFn(reopenOrder);

  const closeNormal = useServerFn(closeTicketNormalT001);
  const closeRestart = useServerFn(closeTicketRestartT001);
  const closeConsult = useServerFn(closeTicketConsultationT001);
  const closeReply = useServerFn(closeTicketReplyReasonT002);

  // Queries
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["support-workspace", ticketId],
    queryFn: () => loadFn({ data: { ticketId } }),
  });

  const { data: cannedList } = useQuery({
    queryKey: ["canned-responses-active"],
    queryFn: () => cannedFn({ data: { activeOnly: true } }),
  });

  const { data: templatesList } = useQuery({
    queryKey: ["email-templates-active"],
    queryFn: () => templatesFn(),
  });

  const { data: staffData } = useQuery({
    queryKey: ["staff-for-assignment"],
    queryFn: () => staffFn({ data: {} } as any),
  });

  // Previous & Next navigation context
  const [navState, setNavState] = useState<{ prevId: string | null; nextId: string | null }>({
    prevId: null,
    nextId: null,
  });

  useEffect(() => {
    let handled = false;
    try {
      const stored = sessionStorage.getItem("bhs_ticket_ids_context");
      if (stored) {
        const ids: string[] = JSON.parse(stored);
        if (Array.isArray(ids)) {
          const idx = ids.indexOf(ticketId);
          if (idx !== -1) {
            setNavState({
              prevId: idx > 0 ? ids[idx - 1] : null,
              nextId: idx < ids.length - 1 ? ids[idx + 1] : null,
            });
            handled = true;
          }
        }
      }
    } catch {
      /* ignore */
    }

    if (!handled) {
      adjacentFn({ data: { ticketId } })
        .then((res) => {
          if (res) setNavState({ prevId: res.prevId, nextId: res.nextId });
        })
        .catch(() => { });
    }
  }, [ticketId]);

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["support-workspace", ticketId] });

  // Realtime
  useRealtimeTable("ticket_replies", invalidate, { filter: `ticket_id=eq.${ticketId}` });
  const appId = data?.ticket?.application_id ?? null;
  useRealtimeTable("email_logs", invalidate, appId ? { filter: `application_id=eq.${appId}` } : undefined);

  // Local tags state
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [addTagOpen, setAddTagOpen] = useState(false);
  const [newTagInput, setNewTagInput] = useState("");

  // Modals & popups
  const [closeMenuOpen, setCloseMenuOpen] = useState(false);
  const [dotsMenuOpen, setDotsMenuOpen] = useState(false);
  const [restartConfirm, setRestartConfirm] = useState(false);
  const [reopenConfirm, setReopenConfirm] = useState(false);
  const [consultOpen, setConsultOpen] = useState(false);
  const [consultNote, setConsultNote] = useState("");
  const [reasonOpen, setReasonOpen] = useState(false);
  const [cannedModalOpen, setCannedModalOpen] = useState(false);
  const [templatesModalOpen, setTemplatesModalOpen] = useState(false);
  const [sendOptionsOpen, setSendOptionsOpen] = useState(false);
  const [sendCopy, setSendCopy] = useState(false);
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);

  // Composer state
  const [composeTab, setComposeTab] = useState<"reply" | "note">("reply");
  const [body, setBody] = useState("");
  const composerRef = useRef<HTMLTextAreaElement | null>(null);
  const threadRef = useRef<HTMLDivElement | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  // Scroll listener for "Jump to latest"
  const handleThreadScroll = () => {
    if (!threadRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = threadRef.current;
    const distFromBottom = scrollHeight - (scrollTop + clientHeight);
    setShowScrollBottom(distFromBottom > 160);
  };

  const scrollToBottom = () => {
    if (threadRef.current) {
      threadRef.current.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
    }
  };

  // Build unified message list
  const messages: Msg[] = useMemo(() => {
    if (!data) return [];
    const out: Msg[] = [];
    const t = data.ticket as any;
    const cust = t?.customers ?? {};
    const docs = (data.documents ?? []) as any[];

    // 1. Initial ticket description
    const desc = (t?.description ?? "").trim();
    const firstReply = data.replies?.[0];
    const firstReplyText = (firstReply?.reply_text ?? "").trim();
    const isFirstReplySameAsDesc =
      Boolean(desc && firstReplyText && (firstReplyText === desc || firstReplyText.includes(desc)));

    if (desc && !isFirstReplySameAsDesc) {
      if (t.source === "staff") {
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
          attachments: docs.length > 0 ? docs.slice(0, 2) : undefined,
        });
      }
    }

    // 2. Replies
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
        const text = r.reply_text ?? "";
        const hasAttachmentMention = /attach|document|proof|pdf|file/i.test(text);
        out.push({
          kind: "inbound",
          id: `ri-${r.id}`,
          created_at: r.created_at,
          from_email: r.from_email ?? t.ticket_email ?? cust.primary_email ?? null,
          subject: r.subject ?? null,
          body_text: text,
          body_html: r.body_html ?? null,
          attachments: hasAttachmentMention && docs.length > 0 ? docs : undefined,
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
          status: r.email_status ?? (r.emailed_at ? "Sent" : null),
          author_name: r.author_name ?? "Business Help Services",
        });
      }
    }

    out.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    return out;
  }, [data]);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages.length]);

  // Mutations
  const sendReply = useMutation({
    mutationFn: (opts?: { closeAfter?: boolean } | void) =>
      replyFn({
        data: {
          ticketId,
          message: body.trim(),
          isInternal: composeTab === "note",
          armAutoclose: false,
        },
      }),
    onSuccess: async (r: any, variables) => {
      if (composeTab === "note") {
        toast.success("Internal note added");
      } else if (r?.emailed === false) {
        toast.warning(`Reply saved but email not sent: ${r.reason ?? "unknown"}`);
      } else {
        toast.success("Reply sent successfully");
      }

      if (variables?.closeAfter) {
        await closeNormal({ data: { ticketId } });
        toast.success("Ticket closed");
      }

      setBody("");
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
    onSuccess: () => { toast.success("TB01 Consultation completed — ticket closed"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const doCloseReply = useMutation({
    mutationFn: (v: { reasonId: string | null; reasonLabel: string; replyBody: string }) =>
      closeReply({ data: { ticketId, reasonId: v.reasonId, reasonLabel: v.reasonLabel, replyBody: v.replyBody } }),
    onSuccess: () => { toast.success("TB02 sent — 24h auto-close armed"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const doReopenOrder = useMutation({
    mutationFn: (orderId: string) => reopenOrderFn({ data: { orderId } }),
    onSuccess: () => { toast.success("Order reopened successfully"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  // Rich Text Helpers
  const insertFormatting = (prefix: string, suffix = "") => {
    if (!composerRef.current) return;
    const el = composerRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = body.substring(start, end);
    const replacement = `${prefix}${selected || "text"}${suffix}`;
    const newBody = body.substring(0, start) + replacement + body.substring(end);
    setBody(newBody);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + replacement.length - suffix.length);
    }, 10);
  };

  const insertLinePrefix = (prefix: string) => {
    if (!composerRef.current) return;
    const el = composerRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = body.substring(start, end);
    const lines = (selected || "").split("\n").map((l) => `${prefix}${l}`).join("\n");
    const replacement = lines || `${prefix} `;
    const newBody = body.substring(0, start) + replacement + body.substring(end);
    setBody(newBody);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 10);
  };

  // Insert structured order details
  const insertOrderDetails = () => {
    const t = data?.ticket as any;
    const app = t?.applications ?? {};
    const serviceName = t?.services?.service_name ?? app?.services?.service_name ?? "Service";
    const details = [
      `Order No: ${app.application_code || "—"}`,
      `Service: ${serviceName}`,
      `Order Date: ${ist(app.created_at || t.created_at)}`,
      `Order Stage: ${app.fulfillment_status ? app.fulfillment_status.replace(/_/g, " ") : "Processing"}`,
    ].join("\n");

    setBody((prev) => (prev.trim() ? `${prev}\n\n${details}\n` : `${details}\n\n`));
    toast.success("Order details inserted");
    composerRef.current?.focus();
  };

  const handleDownloadDoc = async (doc: any) => {
    try {
      const res = await getDocUrlFn({ data: { path: doc.file_path } });
      if (res?.url) {
        window.open(res.url, "_blank", "noopener,noreferrer");
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to download document");
    }
  };

  // Loading & Error States
  if (isLoading) {
    return (
      <div className="h-[calc(100dvh-3.5rem)] -m-4 md:-m-6 -mb-24 md:-mb-6 flex flex-col bg-slate-50 p-6 space-y-4">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="h-20 bg-white border border-slate-200 rounded-xl p-4 animate-pulse" />
        <div className="flex-1 flex gap-4">
          <div className="flex-1 bg-white border border-slate-200 rounded-xl p-6 animate-pulse" />
          <div className="w-80 bg-white border border-slate-200 rounded-xl p-6 animate-pulse hidden lg:block" />
        </div>
      </div>
    );
  }

  if (isError || !data?.ticket) {
    return (
      <div className="h-[calc(100dvh-3.5rem)] -m-4 md:-m-6 -mb-24 md:-mb-6 flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <AlertTriangle className="size-10 text-rose-500 mb-2" />
        <h3 className="text-base font-bold text-slate-800">Unable to load ticket workspace</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          The ticket data could not be retrieved. It may have been archived or permissions may be restricted.
        </p>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => refetch()}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
          >
            Retry
          </button>
          <button
            onClick={() => navigate({ to: "/admin/support/tickets" })}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50"
          >
            Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  const ticket = data.ticket as any;
  const cust = ticket.customers ?? {};
  const app = ticket.applications ?? {};
  const isClosed = ["closed", "resolved"].includes(ticket.status);
  const serviceName = ticket.services?.service_name ?? app.services?.service_name ?? "Udyam Registration";

  // Check Reopen Rule: Order Stage must be Closed or Completed
  const orderStageStr = String(app.fulfillment_status ?? app.order_status ?? "").toLowerCase();
  const canReopenOrder =
    Boolean(app.id) &&
    (orderStageStr.includes("completed") ||
      orderStageStr.includes("closed") ||
      orderStageStr.includes("cancelled") ||
      app.order_status === "COMPLETED" ||
      app.order_status === "CLOSED");

  // SLA Calculation
  const slaTargetHours = ticket.priority === "urgent" ? 4 : ticket.priority === "high" ? 8 : ticket.priority === "medium" ? 24 : 48;
  const slaTargetMs = new Date(ticket.created_at).getTime() + slaTargetHours * 3600 * 1000;
  const slaDiffMs = slaTargetMs - Date.now();
  let slaText = "";
  let slaTone: "healthy" | "warning" | "breached" = "healthy";

  if (isClosed) {
    slaText = "Resolved";
    slaTone = "healthy";
  } else if (slaDiffMs <= 0) {
    const bH = Math.floor(Math.abs(slaDiffMs) / 3600000);
    const bM = Math.floor((Math.abs(slaDiffMs) % 3600000) / 60000);
    slaText = `Breached by ${bH}h ${bM}m`;
    slaTone = "breached";
  } else {
    const rH = Math.floor(slaDiffMs / 3600000);
    const rM = Math.floor((slaDiffMs % 3600000) / 60000);
    slaText = `${rH}h ${rM}m remaining`;
    slaTone = rH < 4 ? "warning" : "healthy";
  }

  const staffList = (((staffData as any)?.staff ?? []) as Array<{ id: string; name: string }>).map((s) => ({
    id: s.id,
    full_name: s.name,
  }));

  return (
    <div className="h-[calc(100dvh-3.5rem)] -m-4 md:-m-6 -mb-24 md:-mb-6 flex flex-col bg-slate-100 min-w-0 overflow-hidden font-sans">
      {/* ── 1. Top Bar & Ticket Header ────────────────────── */}
      <header className="bg-white border-b border-slate-200 px-5 py-3 shrink-0 shadow-2xs">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => navigate({ to: "/admin/support/tickets" })}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="size-3.5" /> Back to Tickets
          </button>

          {/* Mobile context sidebar button */}
          <button
            onClick={() => setSidebarDrawerOpen(true)}
            className="lg:hidden inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700"
          >
            <Info className="size-3.5" /> Context Info
          </button>
        </div>

        {/* Row 1: Ticket ID + Actions */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Left: Ticket Number + NEW Badge */}
          <div className="flex items-center gap-2.5 min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 font-mono">
              {ticket.ticket_number}
            </h1>
            {ticket.is_new && (
              <span className="px-2 py-0.5 rounded text-[11px] font-extrabold uppercase tracking-wide bg-[#e11d48] text-white">
                NEW
              </span>
            )}
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2">
            {/* Close Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCloseMenuOpen((v) => !v)}
                disabled={isClosed}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors disabled:opacity-50"
              >
                Close <ChevronDown className="size-3.5 text-slate-500" />
              </button>
              {closeMenuOpen && (
                <div
                  className="absolute right-0 mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-30 text-xs py-1 animate-in fade-in"
                  onMouseLeave={() => setCloseMenuOpen(false)}
                >
                  <button
                    onClick={() => { setCloseMenuOpen(false); doCloseNormal.mutate(); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                  >
                    <CheckCircle2 className="size-3.5 text-emerald-500" /> Close Ticket
                  </button>
                  <button
                    onClick={() => { setCloseMenuOpen(false); setReasonOpen(true); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-rose-700 font-medium"
                  >
                    <Mail className="size-3.5 text-rose-500" /> Close with Reply (TB02)
                  </button>
                  <button
                    onClick={() => { setCloseMenuOpen(false); setConsultOpen(true); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-blue-700 font-medium"
                  >
                    <FileText className="size-3.5 text-blue-500" /> Consultation Completed (TB01)
                  </button>
                </div>
              )}
            </div>

            {/* Restart Order */}
            <button
              onClick={() => setRestartConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
            >
              <RotateCcw className="size-3.5 text-slate-500" /> Restart Order
            </button>

            {/* Reply Button (focuses composer) */}
            <button
              onClick={() => {
                setComposeTab("reply");
                composerRef.current?.focus();
              }}
              disabled={isClosed}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1e3a5f] hover:bg-[#152b47] text-white text-xs font-semibold shadow-2xs transition-colors disabled:opacity-50"
            >
              <Send className="size-3.5" /> Reply
            </button>

            {/* More Menu (...) */}
            <div className="relative">
              <button
                onClick={() => setDotsMenuOpen((v) => !v)}
                className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs"
                title="More actions"
              >
                <MoreHorizontal className="size-4" />
              </button>
              {dotsMenuOpen && (
                <div
                  className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-30 text-xs py-1"
                  onMouseLeave={() => setDotsMenuOpen(false)}
                >
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(ticket.ticket_number);
                      toast.success("Ticket ID copied to clipboard");
                      setDotsMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <Copy className="size-3.5 text-slate-400" /> Copy Ticket ID
                  </button>
                  {app.application_code && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(app.application_code);
                        toast.success("Order Number copied");
                        setDotsMenuOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                    >
                      <Copy className="size-3.5 text-slate-400" /> Copy Order No.
                    </button>
                  )}
                  {app.id && (
                    <Link
                      to="/admin/orders/$orderId"
                      params={{ orderId: app.id }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                    >
                      <Package className="size-3.5 text-slate-400" /> View Order
                    </Link>
                  )}
                  {cust.id && (
                    <Link
                      to="/admin/customers/$customerId"
                      params={{ customerId: cust.id }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                    >
                      <User className="size-3.5 text-slate-400" /> View Customer
                    </Link>
                  )}
                  <button
                    onClick={() => { invalidate(); setDotsMenuOpen(false); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <RotateCcw className="size-3.5 text-slate-400" /> Refresh Data
                  </button>
                </div>
              )}
            </div>

            {/* Previous / Next Ticket Buttons */}
            <div className="flex items-center rounded-lg border border-slate-300 bg-white overflow-hidden shadow-2xs ml-1">
              <button
                onClick={() => {
                  if (navState.prevId) {
                    navigate({ to: "/admin/support/tickets/$ticketId", params: { ticketId: navState.prevId } });
                  }
                }}
                disabled={!navState.prevId}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed border-r border-slate-200 transition-colors"
                title="Previous ticket in list"
              >
                <ChevronLeft className="size-3.5" /> Previous
              </button>
              <button
                onClick={() => {
                  if (navState.nextId) {
                    navigate({ to: "/admin/support/tickets/$ticketId", params: { ticketId: navState.nextId } });
                  }
                }}
                disabled={!navState.nextId}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Next ticket in list"
              >
                Next <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Subject */}
        <div className="mt-1.5 text-sm font-semibold text-slate-800 truncate">
          {ticket.subject || "(no subject)"}
        </div>

        {/* Row 3: Compact Metadata Badges */}
        <div className="mt-2.5 flex items-center gap-2 flex-wrap text-xs">
          {/* Customer Delay badge */}
          {(app.fulfillment_status === "customer_delay" || ticket.status === "waiting_customer") && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fef3c7] text-[#92400e] border border-amber-200 font-semibold text-[11px]">
              <span className="size-1.5 rounded-full bg-[#d97706]" /> Customer Delay
            </span>
          )}

          {/* Status Badge */}
          <StatusDropdownBadge
            status={ticket.status as TicketStatus}
            onChange={(s) => changeStatus.mutate(s)}
          />

          {/* Priority Badge */}
          <PriorityDropdownBadge
            priority={(ticket.priority as TicketPriority) ?? "medium"}
            onChange={(p) => changePriority.mutate(p)}
          />

          {/* Assignee Badge */}
          <AssigneeDropdownBadge
            currentId={ticket.assigned_to}
            currentName={ticket.assigned_name}
            staff={staffList}
            onPick={(id) => changeAssignee.mutate(id)}
          />

          {/* Service Badge */}
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-medium text-[11px]">
            BHS: {serviceName}
          </span>

          {/* Custom Tags */}
          {customTags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-medium"
            >
              {tag}
              <button
                onClick={() => setCustomTags((prev) => prev.filter((_, i) => i !== idx))}
                className="hover:text-blue-900"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}

          {/* + Add Tag */}
          <div className="relative">
            <button
              onClick={() => setAddTagOpen((v) => !v)}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-slate-300 border-dashed bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-[11px] font-medium transition-colors"
            >
              <Plus className="size-3" /> Add Tag
            </button>
            {addTagOpen && (
              <div className="absolute left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg p-2 shadow-lg z-30">
                <div className="text-[11px] font-bold text-slate-500 mb-1">Enter tag:</div>
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newTagInput.trim()) {
                      setCustomTags((prev) => [...prev, newTagInput.trim()]);
                      setNewTagInput("");
                      setAddTagOpen(false);
                    }
                  }}
                  placeholder="e.g. VIP, Urgent Followup"
                  className="w-full text-xs px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  autoFocus
                />
                <div className="flex justify-end gap-1 mt-2">
                  <button
                    onClick={() => setAddTagOpen(false)}
                    className="px-2 py-0.5 text-[11px] text-slate-500 hover:bg-slate-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (newTagInput.trim()) {
                        setCustomTags((prev) => [...prev, newTagInput.trim()]);
                        setNewTagInput("");
                        setAddTagOpen(false);
                      }
                    }}
                    className="px-2 py-0.5 text-[11px] bg-blue-600 text-white rounded font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── 2. Workspace Body (Conversation & Sidebar) ────── */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Left Column: Conversation + Sticky Reply Composer */}
        <main className="flex-1 min-w-0 flex flex-col h-full bg-slate-50/50 overflow-hidden relative border-r border-slate-200">
          {/* Scrollable Conversation Feed */}
          <div
            ref={threadRef}
            onScroll={handleThreadScroll}
            className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4"
          >
            {messages.length === 0 ? (
              <div className="text-center py-20 text-slate-400 flex flex-col items-center gap-2">
                <MessageSquare className="size-10 text-slate-300" />
                <p className="font-semibold text-slate-700 text-sm">No messages yet</p>
                <p className="text-xs text-slate-400">Use the reply composer below to send an email to the customer.</p>
              </div>
            ) : (
              messages.map((m) => (
                <MessageCard
                  key={m.id}
                  msg={m}
                  customerName={cust.name}
                  customerEmail={ticket.ticket_email ?? cust.primary_email}
                  onDownloadDoc={handleDownloadDoc}
                />
              ))
            )}
          </div>

          {/* Jump to latest button */}
          {showScrollBottom && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-64 right-8 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/85 text-white text-xs font-semibold shadow-lg hover:bg-slate-900 transition-all backdrop-blur-xs"
            >
              <ChevronDown className="size-3.5" /> Jump to latest
            </button>
          )}

          {/* ── 3. Sticky Bottom Reply Composer ─────────────── */}
          <div className="bg-white border-t border-slate-200 shrink-0 shadow-lg">
            {/* Tabs: Reply vs Internal Note */}
            <div className="flex items-center border-b border-slate-200 px-4 pt-2">
              <button
                onClick={() => setComposeTab("reply")}
                className={`px-4 py-2 text-xs font-bold transition-all relative ${composeTab === "reply"
                    ? "text-[#1e3a5f] border-b-2 border-[#1e3a5f]"
                    : "text-slate-500 hover:text-slate-800"
                  }`}
              >
                Reply
              </button>
              <button
                onClick={() => setComposeTab("note")}
                className={`px-4 py-2 text-xs font-bold transition-all relative ${composeTab === "note"
                    ? "text-amber-700 border-b-2 border-amber-500"
                    : "text-slate-500 hover:text-slate-800"
                  }`}
              >
                Internal Note
              </button>
            </div>

            {/* Compact Rich Text Editor Toolbar */}
            <div className="flex items-center gap-1 px-4 py-1.5 bg-slate-50/80 border-b border-slate-200 flex-wrap text-slate-600">
              <span className="text-[11px] font-semibold text-slate-500 pr-1.5 border-r border-slate-300">
                Normal ▾
              </span>
              <button
                onClick={() => insertFormatting("**", "**")}
                className="p-1 rounded hover:bg-slate-200 hover:text-slate-900"
                title="Bold (Ctrl+B)"
              >
                <Bold className="size-3.5" />
              </button>
              <button
                onClick={() => insertFormatting("*", "*")}
                className="p-1 rounded hover:bg-slate-200 hover:text-slate-900"
                title="Italic (Ctrl+I)"
              >
                <Italic className="size-3.5" />
              </button>
              <button
                onClick={() => insertFormatting("<u>", "</u>")}
                className="p-1 rounded hover:bg-slate-200 hover:text-slate-900"
                title="Underline"
              >
                <Underline className="size-3.5" />
              </button>
              <button
                onClick={() => insertFormatting("~~", "~~")}
                className="p-1 rounded hover:bg-slate-200 hover:text-slate-900"
                title="Strikethrough"
              >
                <Strikethrough className="size-3.5" />
              </button>

              <div className="h-3 w-px bg-slate-300 mx-1" />

              <button
                onClick={() => insertLinePrefix("• ")}
                className="p-1 rounded hover:bg-slate-200 hover:text-slate-900"
                title="Bullet list"
              >
                <List className="size-3.5" />
              </button>
              <button
                onClick={() => insertLinePrefix("1. ")}
                className="p-1 rounded hover:bg-slate-200 hover:text-slate-900"
                title="Numbered list"
              >
                <ListOrdered className="size-3.5" />
              </button>
              <button
                onClick={() => insertLinePrefix("> ")}
                className="p-1 rounded hover:bg-slate-200 hover:text-slate-900"
                title="Quote"
              >
                <Quote className="size-3.5" />
              </button>

              <div className="h-3 w-px bg-slate-300 mx-1" />

              <button
                onClick={() => insertFormatting("[", "](https://)")}
                className="p-1 rounded hover:bg-slate-200 hover:text-slate-900"
                title="Insert link"
              >
                <Link2 className="size-3.5" />
              </button>
              <button
                onClick={() => {
                  toast.info("Please attach files using the 'Attach File' button below.");
                }}
                className="p-1 rounded hover:bg-slate-200 hover:text-slate-900"
                title="Attach"
              >
                <Paperclip className="size-3.5" />
              </button>
            </div>

            {/* Composer Textarea */}
            <div className="p-4">
              <textarea
                ref={composerRef}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={
                  composeTab === "note"
                    ? "Add an internal note (only visible to staff members)…"
                    : "Type your reply here…"
                }
                rows={4}
                className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border focus:outline-none focus:ring-1 resize-y transition-all ${composeTab === "note"
                    ? "bg-amber-50/40 border-amber-200 focus:ring-amber-400 text-amber-950 placeholder:text-amber-800/50"
                    : "bg-white border-slate-200 focus:ring-blue-500 text-slate-800 placeholder:text-slate-400"
                  }`}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && body.trim()) {
                    sendReply.mutate();
                  }
                }}
              />

              {/* Bottom Quick Tools & Action Bar */}
              <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                {/* Left quick insert buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      toast.info("Use Order Documents in the right sidebar or order workspace to upload attachments.");
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <Paperclip className="size-3.5 text-slate-500" /> Attach File
                  </button>

                  <button
                    type="button"
                    onClick={() => setTemplatesModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <FileText className="size-3.5 text-slate-500" /> Templates
                  </button>

                  <button
                    type="button"
                    onClick={insertOrderDetails}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <Package className="size-3.5 text-slate-500" /> Insert Order Details
                  </button>

                  <button
                    type="button"
                    onClick={() => setCannedModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <Sparkles className="size-3.5 text-slate-500" /> Canned Responses
                  </button>
                </div>

                {/* Right Send Reply split button */}
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={sendCopy}
                      onChange={(e) => setSendCopy(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-0"
                    />
                    <span>Send me a copy</span>
                  </label>

                  {/* Send button with dropdown */}
                  <div className="relative inline-flex rounded-lg shadow-2xs">
                    <button
                      onClick={() => sendReply.mutate()}
                      disabled={!body.trim() || sendReply.isPending}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-l-lg text-white text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${composeTab === "note"
                          ? "bg-amber-600 hover:bg-amber-700"
                          : "bg-[#1e3a5f] hover:bg-[#152b47]"
                        }`}
                    >
                      {sendReply.isPending ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Send className="size-3.5" />
                      )}
                      {composeTab === "note" ? "Add Note" : "Send Reply"}
                    </button>

                    {composeTab === "reply" && (
                      <button
                        onClick={() => setSendOptionsOpen((v) => !v)}
                        disabled={!body.trim() || sendReply.isPending}
                        className="px-2 py-2 rounded-r-lg bg-[#152b47] hover:bg-[#0f1f33] text-white border-l border-blue-900 disabled:opacity-50"
                        title="Send options"
                      >
                        <ChevronDown className="size-3.5" />
                      </button>
                    )}

                    {sendOptionsOpen && (
                      <div
                        className="absolute right-0 bottom-full mb-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-30 text-xs py-1"
                        onMouseLeave={() => setSendOptionsOpen(false)}
                      >
                        <button
                          onClick={() => {
                            setSendOptionsOpen(false);
                            sendReply.mutate();
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                        >
                          <Send className="size-3.5 text-blue-600" /> Send Reply
                        </button>
                        <button
                          onClick={() => {
                            setSendOptionsOpen(false);
                            sendReply.mutate({ closeAfter: true });
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-emerald-700 font-medium"
                        >
                          <CheckCircle2 className="size-3.5 text-emerald-600" /> Send &amp; Close Ticket
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* ── 4. Right Context Sidebar ─────────────────────── */}
        <aside
          className={`w-[320px] xl:w-[350px] shrink-0 bg-slate-50/90 border-l border-slate-200 flex flex-col h-full overflow-y-auto p-4 space-y-4 ${sidebarDrawerOpen
              ? "fixed inset-y-0 right-0 z-50 bg-slate-50 shadow-2xl w-[320px] max-w-full"
              : "hidden lg:flex"
            }`}
        >
          {sidebarDrawerOpen && (
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 lg:hidden">
              <span className="font-bold text-slate-800 text-sm">Context Sidebar</span>
              <button
                onClick={() => setSidebarDrawerOpen(false)}
                className="p-1 rounded hover:bg-slate-200 text-slate-500"
              >
                <X className="size-4" />
              </button>
            </div>
          )}

          {/* Card 1: Customer Information */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <div className="p-1.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                <User className="size-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Customer Information
              </h2>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm shrink-0 border border-emerald-200">
                  {initials(cust.name)}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 text-sm uppercase truncate">
                    {cust.name || "Customer"}
                  </div>
                  <div className="text-xs text-slate-500 font-mono truncate" title={ticket.ticket_email ?? cust.primary_email}>
                    {ticket.ticket_email ?? cust.primary_email ?? "—"}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 text-xs text-slate-600">
                {cust.primary_mobile && (
                  <div className="flex items-center gap-2">
                    <Phone className="size-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-slate-800">{cust.primary_mobile}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="size-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-700">
                    {cust.state ? `${cust.state}, India` : "India"}
                  </span>
                </div>
              </div>

              {cust.id && (
                <div className="pt-2">
                  <Link
                    to="/admin/customers/$customerId"
                    params={{ customerId: cust.id }}
                    className="w-full inline-flex items-center justify-center py-2 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-blue-700 font-semibold text-xs transition-colors shadow-2xs"
                  >
                    View Customer Profile
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Order Information */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <div className="p-1.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                <Package className="size-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Order Information
              </h2>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2 py-0.5">
                <span className="text-slate-500">Order No.</span>
                {app.application_code ? (
                  <div className="flex items-center gap-1">
                    <Link
                      to="/admin/orders/$orderId"
                      params={{ orderId: app.id }}
                      className="font-mono font-bold text-blue-700 hover:underline"
                    >
                      {app.application_code}
                    </Link>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(app.application_code);
                        toast.success("Order number copied");
                      }}
                      className="text-slate-400 hover:text-slate-700 p-0.5"
                      title="Copy order number"
                    >
                      <Copy className="size-3" />
                    </button>
                  </div>
                ) : (
                  <span className="text-slate-400 italic">—</span>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 py-0.5">
                <span className="text-slate-500">Service</span>
                <span className="font-medium text-slate-800 text-right truncate max-w-[160px]">
                  {serviceName}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 py-0.5">
                <span className="text-slate-500">Order Date</span>
                <span className="text-slate-700 text-right">
                  {ist(app.created_at || ticket.created_at)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 py-0.5">
                <span className="text-slate-500">Order Stage</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 capitalize">
                  {app.fulfillment_status ? app.fulfillment_status.replace(/_/g, " ") : "Processing"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 py-0.5">
                <span className="text-slate-500">Order Assignee</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  {ticket.executive_name || "Unassigned"}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Ticket Information */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <div className="p-1.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                <Info className="size-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Ticket Information
              </h2>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2 py-0.5">
                <span className="text-slate-500">Created</span>
                <span className="text-slate-700">{ist(ticket.created_at)}</span>
              </div>

              <div className="flex items-center justify-between gap-2 py-0.5">
                <span className="text-slate-500">Channel</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
                  <Mail className="size-3 text-slate-400" /> {ticket.source || "Email"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 py-0.5">
                <span className="text-slate-500">Priority</span>
                <PriorityDropdownBadge
                  priority={(ticket.priority as TicketPriority) ?? "medium"}
                  onChange={(p) => changePriority.mutate(p)}
                />
              </div>

              <div className="flex items-center justify-between gap-2 py-0.5">
                <span className="text-slate-500">Status</span>
                <StatusDropdownBadge
                  status={ticket.status as TicketStatus}
                  onChange={(s) => changeStatus.mutate(s)}
                />
              </div>

              <div className="flex items-center justify-between gap-2 py-0.5">
                <span className="text-slate-500">Assigned</span>
                <AssigneeDropdownBadge
                  currentId={ticket.assigned_to}
                  currentName={ticket.assigned_name}
                  staff={staffList}
                  onPick={(id) => changeAssignee.mutate(id)}
                />
              </div>

              <div className="flex items-center justify-between gap-2 py-0.5">
                <span className="text-slate-500">SLA</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${slaTone === "healthy"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : slaTone === "warning"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-rose-50 text-rose-800 border-rose-200"
                    }`}
                >
                  {slaText}
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <div className="p-1.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                <Sparkles className="size-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Quick Actions
              </h2>
            </div>

            <div className="space-y-2 pt-1">
              {/* Close Ticket */}
              <button
                onClick={() => doCloseNormal.mutate()}
                disabled={isClosed || doCloseNormal.isPending}
                className="w-full py-2.5 px-3 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {doCloseNormal.isPending ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                )}
                Close Ticket
              </button>

              {/* Consultation Completed (TB01) */}
              <button
                onClick={() => setConsultOpen(true)}
                disabled={isClosed}
                className="w-full py-2.5 px-3 rounded-lg border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText className="size-3.5 text-blue-600" />
                Consultation Completed (TB01)
              </button>

              {/* Reply & Close (TB02) */}
              <button
                onClick={() => setReasonOpen(true)}
                disabled={isClosed}
                className="w-full py-2.5 px-3 rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="size-3.5 text-rose-600" />
                Reply &amp; Close (TB02)
              </button>

              {/* Reopen Order */}
              <button
                onClick={() => setReopenConfirm(true)}
                disabled={!canReopenOrder || doReopenOrder.isPending}
                className="w-full py-2.5 px-3 rounded-lg border border-slate-200 bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="size-3.5 text-slate-500" />
                Reopen Order
              </button>

              {/* Strict notice rule */}
              <div className="text-[11px] text-slate-500 leading-snug flex items-start gap-1.5 pt-1">
                <Info className="size-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Reopen Order will be enabled only when the order stage is Closed or Completed.
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Dialogs & Popups ──────────────────────────────── */}

      {/* Restart Order Confirmation Dialog */}
      {restartConfirm && (
        <ConfirmDialog
          title="Restart Order?"
          body="This will close the ticket and return the order to Form Submitted stage. Any pending customer-delay closure timer will be cancelled."
          confirmLabel="Restart Order"
          confirmTone="emerald"
          onConfirm={() => {
            setRestartConfirm(false);
            doCloseRestart.mutate();
          }}
          onClose={() => setRestartConfirm(false)}
        />
      )}

      {/* Reopen Order Confirmation Dialog */}
      {reopenConfirm && (
        <ConfirmDialog
          title="Reopen Order?"
          body="This will reopen the closed order and resume operational processing for the customer."
          confirmLabel="Reopen Order"
          confirmTone="emerald"
          onConfirm={() => {
            setReopenConfirm(false);
            if (app.id) doReopenOrder.mutate(app.id);
          }}
          onClose={() => setReopenConfirm(false)}
        />
      )}

      {/* Consultation Completed (TB01) Dialog */}
      {consultOpen && (
        <ConsultDialog
          value={consultNote}
          onChange={setConsultNote}
          onCancel={() => {
            setConsultOpen(false);
            setConsultNote("");
          }}
          onSend={() => {
            setConsultOpen(false);
            doCloseConsult.mutate(consultNote);
            setConsultNote("");
          }}
        />
      )}

      {/* Reason Picker Dialog (TB02) */}
      {reasonOpen && (
        <ReasonPickerDialog
          onCancel={() => setReasonOpen(false)}
          onSend={(v) => {
            setReasonOpen(false);
            doCloseReply.mutate(v);
          }}
        />
      )}

      {/* Canned Responses Searchable Modal */}
      {cannedModalOpen && (
        <CannedResponsesModal
          items={(cannedList ?? []) as any[]}
          onClose={() => setCannedModalOpen(false)}
          onSelect={(item) => {
            const filled = (item.body ?? "")
              .replace(/\{\{customer_name\}\}/gi, cust.name ?? "[Customer]")
              .replace(/\{\{order_number\}\}/gi, app.application_code ?? "[Order No]")
              .replace(/\{\{ticket_number\}\}/gi, ticket.ticket_number ?? "");
            setBody((prev) => (prev.trim() ? `${prev}\n\n${filled}` : filled));
            setCannedModalOpen(false);
            composerRef.current?.focus();
            toast.success(`Inserted canned response: ${item.title}`);
          }}
        />
      )}

      {/* Email Templates Searchable Modal */}
      {templatesModalOpen && (
        <TemplatesModal
          items={(templatesList ?? []) as any[]}
          onClose={() => setTemplatesModalOpen(false)}
          onSelect={(item) => {
            const rawBody = item.body_text || item.body_html || "";
            const plain = decodeEntities(rawBody.replace(/<[^>]+>/g, " "));
            const filled = plain
              .replace(/\{\{customer_name\}\}/gi, cust.name ?? "[Customer]")
              .replace(/\{\{order_number\}\}/gi, app.application_code ?? "[Order No]")
              .replace(/\{\{ticket_number\}\}/gi, ticket.ticket_number ?? "");
            setBody((prev) => (prev.trim() ? `${prev}\n\n${filled}` : filled));
            setTemplatesModalOpen(false);
            composerRef.current?.focus();
            toast.success(`Inserted template: ${item.template_name || item.template_code}`);
          }}
        />
      )}
    </div>
  );
}

// ── Message Card Component ─────────────────────────────────

function MessageCard({
  msg,
  customerName,
  customerEmail,
  onDownloadDoc,
}: {
  msg: Msg;
  customerName?: string | null;
  customerEmail?: string | null;
  onDownloadDoc: (doc: any) => void;
}) {
  const hasHtml = Boolean((msg as any).body_html && (msg as any).body_html.trim());
  const [viewMode, setViewMode] = useState<"html" | "text">(hasHtml ? "html" : "text");
  const [showFullEmail, setShowFullEmail] = useState(false);

  // Internal Note Card
  if (msg.kind === "note") {
    return (
      <div className="w-full">
        <div className="rounded-xl p-4 shadow-2xs border border-amber-200/90 bg-amber-50/70 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-amber-950 flex items-center gap-2">
              <span className="size-5 rounded-full bg-amber-200 text-amber-950 text-[10px] flex items-center justify-center font-bold">
                👁
              </span>
              <span>{msg.author_name}</span>
              <span className="text-[10px] font-bold bg-amber-200/90 text-amber-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Internal Note
              </span>
            </span>
            <span className="text-amber-800/80 text-[11px] font-medium">{ist(msg.created_at)}</span>
          </div>
          <div className="text-xs sm:text-sm text-amber-950 whitespace-pre-wrap leading-relaxed">
            {msg.body_text}
          </div>
        </div>
      </div>
    );
  }

  // Customer Inbound Message Card
  if (msg.kind === "inbound") {
    const plain = decodeEntities(msg.body_text || "");
    const parsed = parseEmailReply(plain || (msg.body_html ? stripHtml(msg.body_html) : ""));

    return (
      <div className="w-full">
        <div className="bg-white rounded-xl shadow-2xs border border-slate-200/90 border-l-4 border-l-emerald-500 overflow-hidden">
          {/* Header Bar */}
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="size-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                {initials(customerName)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm uppercase truncate">
                    {customerName || "Customer"}
                  </span>
                  <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md">
                    CUSTOMER
                  </span>
                </div>
                <div className="text-slate-400 text-xs font-mono truncate">
                  {customerEmail || msg.from_email || "customer@mail.com"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-xs font-medium" title={ist(msg.created_at)}>
                {ist(msg.created_at)}
              </span>
              <button className="text-slate-400 hover:text-slate-600 p-1">
                <MoreHorizontal className="size-4" />
              </button>
            </div>
          </div>

          {/* Message Content */}
          <div className="p-4 space-y-3">
            {msg.subject && (
              <div className="text-xs font-bold text-slate-800 leading-snug">
                {msg.subject}
              </div>
            )}

            <div className="text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-normal">
              {parsed.newContent || plain || "(no content)"}
            </div>

            {/* Attachments Display */}
            {msg.attachments && msg.attachments.length > 0 && (
              <div className="pt-2 space-y-2">
                {msg.attachments.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between max-w-sm"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-1.5 rounded bg-white border border-slate-200 text-slate-500 shrink-0">
                        <Paperclip className="size-3.5 text-slate-500" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-800 truncate">
                          {doc.file_name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {formatBytes(doc.size_bytes)}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onDownloadDoc(doc)}
                      className="p-1.5 rounded hover:bg-slate-200 text-slate-600 transition-colors"
                      title="Download attachment"
                    >
                      <Download className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

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
                      className={`px-2 py-0.5 rounded ${viewMode === "html" ? "bg-slate-100 text-slate-900 font-bold" : "text-slate-500"
                        }`}
                    >
                      Rich
                    </button>
                    <button
                      onClick={() => setViewMode("text")}
                      className={`px-2 py-0.5 rounded ${viewMode === "text" ? "bg-slate-100 text-slate-900 font-bold" : "text-slate-500"
                        }`}
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

  // Business Outbound Message Card
  const plain = decodeEntities(msg.body_text || "");
  const parsed = parseEmailReply(plain || (msg.body_html ? stripHtml(msg.body_html) : ""));
  const isOrderReceipt =
    (msg.subject || "").toLowerCase().includes("order confirmation") ||
    msg.template_hint === "E003" ||
    msg.template_hint === "T001";

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-2xs border border-slate-200/90 border-l-4 border-l-blue-600 overflow-hidden">
        {/* Header Bar */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-8 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
              BHS
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                  {msg.author_name || "Business Help Services"}
                </span>
                <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md">
                  EMAIL
                </span>
                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md">
                  {msg.status || "Sent"}
                </span>
              </div>
              <div className="text-slate-400 text-xs font-mono truncate">
                {msg.from_email || "help@businesshelpservices.com"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-xs font-medium" title={ist(msg.created_at)}>
              {ist(msg.created_at)}
            </span>
            <button className="text-slate-400 hover:text-slate-600 p-1">
              <MoreHorizontal className="size-4" />
            </button>
          </div>
        </div>

        {/* Message Content Body */}
        <div className="p-4 space-y-3">
          {msg.subject && (
            <div className="text-xs font-bold text-slate-900 leading-snug">
              {msg.subject}
            </div>
          )}

          {/* Dark Navy Banner for Order Confirmation */}
          {isOrderReceipt && (
            <div className="bg-[#1e3a5f] text-white px-4 py-2.5 rounded-lg font-bold text-xs tracking-wide shadow-2xs flex items-center justify-between">
              <span>Order Successfully Received</span>
              <CheckCircle2 className="size-3.5 text-emerald-400" />
            </div>
          )}

          <div className="text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-normal">
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
                    className={`px-2 py-0.5 rounded ${viewMode === "html" ? "bg-slate-100 text-slate-900 font-bold" : "text-slate-500"
                      }`}
                  >
                    Rich
                  </button>
                  <button
                    onClick={() => setViewMode("text")}
                    className={`px-2 py-0.5 rounded ${viewMode === "text" ? "bg-slate-100 text-slate-900 font-bold" : "text-slate-500"
                      }`}
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

// ── Dropdown Badges ────────────────────────────────────────

function StatusDropdownBadge({
  status,
  onChange,
}: {
  status: TicketStatus;
  onChange: (s: TicketStatus) => void;
}) {
  const [open, setOpen] = useState(false);
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.open;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-colors ${cfg.bg} ${cfg.fg} ${cfg.border}`}
      >
        <span>★</span> {cfg.label} <ChevronDown className="size-3 ml-0.5 opacity-70" />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-30 text-xs py-1 min-w-[130px]"
          onMouseLeave={() => setOpen(false)}
        >
          {(Object.keys(STATUS_CONFIG) as TicketStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => {
                setOpen(false);
                onChange(s);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 font-medium"
            >
              {STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PriorityDropdownBadge({
  priority,
  onChange,
}: {
  priority: TicketPriority;
  onChange: (p: TicketPriority) => void;
}) {
  const [open, setOpen] = useState(false);
  const cfg = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.medium;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-colors ${cfg.bg} ${cfg.fg} ${cfg.border}`}
      >
        <span className={`size-1.5 rounded-full ${cfg.dot}`} /> {cfg.label}{" "}
        <ChevronDown className="size-3 ml-0.5 opacity-70" />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-30 text-xs py-1 min-w-[120px]"
          onMouseLeave={() => setOpen(false)}
        >
          {(Object.keys(PRIORITY_CONFIG) as TicketPriority[]).map((p) => (
            <button
              key={p}
              onClick={() => {
                setOpen(false);
                onChange(p);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-2"
            >
              <span className={`size-1.5 rounded-full ${PRIORITY_CONFIG[p].dot}`} />
              {PRIORITY_CONFIG[p].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AssigneeDropdownBadge({
  currentId,
  currentName,
  staff,
  onPick,
}: {
  currentId: string | null;
  currentName: string | null;
  staff: Array<{ id: string; full_name?: string }>;
  onPick: (id: string | null) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors"
      >
        <User className="size-3 text-slate-500" />
        <span>{currentName || "Unassigned"}</span>
        <ChevronDown className="size-3 ml-0.5 opacity-70" />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-xl z-30 text-xs py-1 max-h-56 overflow-y-auto"
          onMouseLeave={() => setOpen(false)}
        >
          <button
            onClick={() => {
              setOpen(false);
              onPick(null);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-500 font-medium"
          >
            Unassigned
          </button>
          {staff.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setOpen(false);
                onPick(s.id);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 font-medium truncate"
            >
              {s.full_name || "Staff Member"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Searchable Canned Responses Modal ──────────────────────

function CannedResponsesModal({
  items,
  onClose,
  onSelect,
}: {
  items: any[];
  onClose: () => void;
  onSelect: (item: any) => void;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((it) => {
      if (it.category) set.add(it.category);
    });
    return ["all", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const matchCat = category === "all" || it.category === category;
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        it.title?.toLowerCase().includes(q) ||
        it.body?.toLowerCase().includes(q) ||
        it.shortcut?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [items, search, category]);

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-2xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-5 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Canned Responses</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-700">
            <X className="size-4" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="pt-3 pb-2 space-y-2">
          <div className="relative">
            <Search className="size-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search canned responses..."
              className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {categories.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-2.5 py-1 rounded-full capitalize font-semibold shrink-0 text-[11px] transition-colors ${category === cat
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Responses List */}
        <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400">
              No canned responses found.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelect(item)}
                className="p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 cursor-pointer transition-all space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">{item.title}</span>
                  {item.category && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
                      {item.category}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ── Searchable Email Templates Modal ───────────────────────

function TemplatesModal({
  items,
  onClose,
  onSelect,
}: {
  items: any[];
  onClose: () => void;
  onSelect: (item: any) => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const q = search.toLowerCase();
      return (
        !search ||
        it.template_code?.toLowerCase().includes(q) ||
        it.template_name?.toLowerCase().includes(q) ||
        it.subject?.toLowerCase().includes(q)
      );
    });
  }, [items, search]);

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-2xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-5 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Email Templates</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-700">
            <X className="size-4" />
          </button>
        </div>

        <div className="pt-3 pb-2">
          <div className="relative">
            <Search className="size-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search email templates by code, name, subject..."
              className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400">
              No email templates found.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelect(item)}
                className="p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 cursor-pointer transition-all space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">
                    {item.template_code} — {item.template_name || item.name}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                    {item.dispatch_mode || "Automated"}
                  </span>
                </div>
                {item.subject && (
                  <div className="text-xs font-semibold text-slate-700">
                    Subject: {item.subject}
                  </div>
                )}
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {item.body_text || stripHtml(item.body_html || "")}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ── Email Iframe Helper ────────────────────────────────────

function EmailIframe({ html, fallback }: { html: string | null; fallback?: string }) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState(0);

  if (!html) {
    return (
      <div className="text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
        {fallback || "(no content)"}
      </div>
    );
  }

  const clean = DOMPurify.sanitize(html, {
    WHOLE_DOCUMENT: true,
    ADD_ATTR: ["target"],
  });

  const safe = /<html[\s>]/i.test(clean)
    ? clean
    : `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
        html,body{margin:0;padding:0;background:#fff}
        body{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:#0f172a;padding:12px}
        img{max-width:100%;height:auto}
        table{max-width:100%}
        a{color:#1d4ed8}
      </style></head><body>${clean}</body></html>`;

  const collapsed = !expanded && height > 340;

  return (
    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-2xs">
      <div style={{ maxHeight: collapsed ? 340 : "none", overflow: "hidden", position: "relative" }}>
        <iframe
          ref={iframeRef}
          title="email-preview"
          srcDoc={safe}
          sandbox="allow-same-origin allow-popups"
          style={{ width: "100%", border: "none", height: height ? `${height}px` : "240px", display: "block" }}
          onLoad={(e) => {
            const iframe = e.currentTarget as HTMLIFrameElement;
            try {
              const h = iframe.contentDocument?.body?.scrollHeight ?? 240;
              setHeight(Math.max(160, h + 20));
            } catch {
              /* noop */
            }
          }}
        />
        {collapsed && (
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        )}
      </div>
      {height > 340 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full text-xs font-semibold text-blue-700 hover:bg-blue-50 py-2 border-t border-slate-200 transition-colors flex items-center justify-center gap-1 bg-slate-50/60"
        >
          {expanded ? "Show less ↑" : "Show full email ↓"}
        </button>
      )}
    </div>
  );
}

function stripHtml(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ── Shared Dialogs ─────────────────────────────────────────

function ConfirmDialog({
  title,
  body,
  confirmLabel,
  confirmTone,
  onConfirm,
  onClose,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  confirmTone: "emerald" | "rose";
  onConfirm: () => void;
  onClose: () => void;
}) {
  const tone =
    confirmTone === "emerald"
      ? "bg-emerald-600 hover:bg-emerald-700"
      : "bg-rose-600 hover:bg-rose-700";

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-2xs" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5 animate-in zoom-in-95 duration-100" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-xs text-slate-600 leading-relaxed">{body}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100">
            Cancel
          </button>
          <button onClick={onConfirm} className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white ${tone}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConsultDialog({
  value,
  onChange,
  onCancel,
  onSend,
}: {
  value: string;
  onChange: (v: string) => void;
  onCancel: () => void;
  onSend: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-2xs" onClick={onCancel}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5 animate-in zoom-in-95 duration-100" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-bold text-slate-900">Consultation Completed (TB01)</h3>
        <p className="mt-1 text-xs text-slate-600 leading-relaxed">
          Sends the T001 consultation-completed confirmation email to the customer and closes the ticket.
        </p>
        <label className="block mt-3 text-xs font-semibold text-slate-700">Remarks (optional)</label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          placeholder="Anything to include in the email or audit record…"
          className="mt-1 w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100">
            Cancel
          </button>
          <button onClick={onSend} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700">
            Send &amp; Close Ticket
          </button>
        </div>
      </div>
    </div>
  );
}

function ReasonPickerDialog({
  onCancel,
  onSend,
}: {
  onCancel: () => void;
  onSend: (v: { reasonId: string | null; reasonLabel: string; replyBody: string }) => void;
}) {
  const [reasonId, setReasonId] = useState<string | null>(null);
  const [reasonLabel, setReasonLabel] = useState<string>("");
  const [reply, setReply] = useState<string>("");

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-2xs" onClick={onCancel}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-5 animate-in zoom-in-95 duration-100" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-bold text-slate-900">Reply &amp; Close (TB02)</h3>
        <p className="mt-1 text-xs text-slate-600 leading-relaxed">
          Pick a reason. The TB02 email will be dispatched to the customer with your reply, and a 24-hour auto-close timer will be armed.
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
          <button onClick={onCancel} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100">
            Cancel
          </button>
          <button
            onClick={() => onSend({ reasonId, reasonLabel, replyBody: reply })}
            disabled={!reasonId || !reply.trim()}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send &amp; Arm 24h Close
          </button>
        </div>
      </div>
    </div>
  );
}
