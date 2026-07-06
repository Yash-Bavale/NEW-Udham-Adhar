import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, Loader2, Lock, Mail, MailCheck, MailX, Send, Sparkles, PlayCircle, CheckCircle2, RotateCcw, XCircle, Package } from "lucide-react";
import { getTicket, updateTicket, replyToTicket, type TicketStatus } from "@/lib/crm/tickets.functions";
import { getTicketOrderContext, resolveTicketAndResumeOrder } from "@/lib/tickets/ticket-actions.functions";
import { listStaffForAssignment } from "@/lib/crm/tasks.functions";
import { listCannedResponses } from "@/lib/tickets/canned-responses.functions";
import { SectionCard } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/tickets/$ticketId")({
  head: () => ({
    meta: [{ title: "Ticket — Udyam Ops OS" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: TicketDetailPage,
});

const TICKET_STATUSES: TicketStatus[] = [
  "open",
  "in_progress",
  "waiting_customer",
  "resolved",
  "closed",
];

const STATUS_COLOR: Record<TicketStatus, { bg: string; fg: string }> = {
  open: { bg: "rgba(2,132,199,0.12)", fg: "#0369a1" },
  in_progress: { bg: "rgba(217,119,6,0.14)", fg: "#b45309" },
  waiting_customer: { bg: "rgba(139,92,246,0.14)", fg: "#6d28d9" },
  resolved: { bg: "rgba(22,163,74,0.14)", fg: "#15803d" },
  closed: { bg: "rgba(100,116,139,0.14)", fg: "#475569" },
};

function TicketDetailPage() {
  const { ticketId } = Route.useParams();
  const qc = useQueryClient();
  const getFn = useServerFn(getTicket);
  const updFn = useServerFn(updateTicket);
  const replyFn = useServerFn(replyToTicket);
  const staffFn = useServerFn(listStaffForAssignment);
  const orderCtxFn = useServerFn(getTicketOrderContext);
  const resumeFn = useServerFn(resolveTicketAndResumeOrder);

  const { data, isLoading } = useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: () => getFn({ data: { id: ticketId } }),
  });
  const { data: staffData } = useQuery({
    queryKey: ["staff-assign"],
    queryFn: () => staffFn(),
    staleTime: 60_000,
  });
  const cannedFn = useServerFn(listCannedResponses);
  const { data: canned } = useQuery({
    queryKey: ["canned-responses", "active"],
    queryFn: () => cannedFn({ data: { activeOnly: true } }),
    staleTime: 60_000,
  });

  const [reply, setReply] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [showCanned, setShowCanned] = useState(false);

  const updMut = useMutation({
    mutationFn: (patch: { status?: TicketStatus; assignedTo?: string | null; priority?: "urgent" | "high" | "medium" | "low" }) =>
      updFn({ data: { id: ticketId, ...patch } }),
    onSuccess: () => {
      toast.success("Ticket updated");
      qc.invalidateQueries({ queryKey: ["ticket", ticketId] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Update failed"),
  });

  const applicationId = (data as any)?.ticket?.application_id ?? null;
  const { data: orderCtx } = useQuery({
    queryKey: ["ticket-order-ctx", applicationId],
    queryFn: () => orderCtxFn({ data: { orderId: applicationId! } }),
    enabled: !!applicationId,
  });

  const [resumeOpen, setResumeOpen] = useState(false);
  const [resumeTo, setResumeTo] = useState<"IN_PROCESSING" | "SUBMITTED_TO_GOVT">("IN_PROCESSING");
  const [resumeNote, setResumeNote] = useState("");
  const resumeMut = useMutation({
    mutationFn: () => resumeFn({ data: { ticketId, resumeTo, note: resumeNote.trim() || undefined } }),
    onSuccess: (res: any) => {
      setResumeOpen(false);
      setResumeNote("");
      toast.success(`Ticket resolved · order resumed → ${res.resumeTo.replace(/_/g, " ")}`);
      qc.invalidateQueries({ queryKey: ["ticket", ticketId] });
      qc.invalidateQueries({ queryKey: ["ticket-order-ctx", applicationId] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Resume failed"),
  });


  const replyMut = useMutation({
    mutationFn: () =>
      replyFn({
        data: { ticketId, message: reply.trim(), isInternal },
      }),
    onSuccess: (res: any) => {
      setReply("");
      if (isInternal) {
        toast.success("Internal note added");
      } else if (res?.emailed) {
        toast.success(`Reply sent to ${res.recipient}`);
      } else if (res?.reason === "no_recipient_email") {
        toast.warning("Reply saved, but customer has no email on file — nothing was sent.");
      } else {
        toast.warning("Reply saved but email failed to send. Check the email queue.");
      }
      qc.invalidateQueries({ queryKey: ["ticket", ticketId] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Reply failed"),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div
          className="h-32 animate-pulse rounded-lg border"
          style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface-2)" }}
        />
        <div
          className="h-64 animate-pulse rounded-lg border"
          style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface-2)" }}
        />
      </div>
    );
  }
  if (!data) return null;

  const { ticket, replies } = data;
  const sc = STATUS_COLOR[(ticket.status ?? "open") as TicketStatus];

  return (
    <div className="space-y-5">
      <Link
        to="/admin/tickets"
        className="inline-flex items-center text-sm"
        style={{ color: "var(--admin-fg-muted)" }}
      >
        <ChevronLeft className="size-4" /> Back to tickets
      </Link>

      <SectionCard>
        <div className="grid gap-4 px-4 py-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs" style={{ color: "var(--admin-fg-muted)" }}>
                {ticket.ticket_number}
              </span>
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize"
                style={{ background: sc.bg, color: sc.fg }}
              >
                <span className="size-1.5 rounded-full" style={{ background: sc.fg }} />
                {(ticket.status ?? "open").replace(/_/g, " ")}
              </span>
            </div>
            <h1
              className="mt-1 text-xl font-medium leading-snug"
              style={{ color: "var(--admin-fg)" }}
            >
              {ticket.subject}
            </h1>
            {ticket.description && (
              <p
                className="mt-2 whitespace-pre-line text-sm"
                style={{ color: "var(--admin-fg-muted)" }}
              >
                {ticket.description}
              </p>
            )}
            <div
              className="mt-3 flex flex-wrap gap-4 text-xs"
              style={{ color: "var(--admin-fg-muted)" }}
            >
              <span>
                Customer:{" "}
                {ticket.customer_id ? (
                  <Link
                    to="/admin/customers/$customerId"
                    params={{ customerId: ticket.customer_id }}
                    style={{ color: "var(--admin-accent)" }}
                  >
                    {(ticket as any).customers?.name ?? "—"}
                  </Link>
                ) : (
                  "—"
                )}
              </span>
              {ticket.application_id && (
                <span>
                  Order:{" "}
                  <Link
                    to="/admin/orders/$orderId"
                    params={{ orderId: ticket.application_id }}
                    style={{ color: "var(--admin-accent)" }}
                  >
                    {(ticket as any).applications?.application_code ?? ticket.application_id.slice(0, 8)}
                  </Link>
                </span>
              )}
              {ticket.resolved_at && (
                <span>
                  Resolved {formatIST(ticket.resolved_at)} by {ticket.resolved_name ?? "—"}
                </span>
              )}
            </div>

            {/* Locked recipient email — this is where every reply lands */}
            <div
              className="mt-3 inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs"
              style={{
                borderColor: (ticket as any).ticket_email ? "var(--admin-border)" : "rgba(220,38,38,0.4)",
                background: (ticket as any).ticket_email ? "var(--admin-surface-2)" : "rgba(220,38,38,0.06)",
                color: (ticket as any).ticket_email ? "var(--admin-fg)" : "#b91c1c",
              }}
              title="This is the customer's registered email — same address that receives order confirmations and invoices. Locked to prevent typos."
            >
              {(ticket as any).ticket_email ? (
                <MailCheck className="size-3.5" style={{ color: "#15803d" }} />
              ) : (
                <MailX className="size-3.5" />
              )}
              <span className="font-medium">
                {(ticket as any).ticket_email ?? "No customer email on file — replies will not be delivered."}
              </span>
              {(ticket as any).ticket_email && (
                <span
                  className="ml-1 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide"
                  style={{ background: "rgba(15,118,110,0.14)", color: "#0f766e" }}
                >
                  same as invoice
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs">
              <span
                className="text-[11px] font-medium uppercase tracking-wide"
                style={{ color: "var(--admin-fg-muted)" }}
              >
                Status
              </span>
              <select
                value={ticket.status ?? "open"}
                onChange={(e) => updMut.mutate({ status: e.target.value as TicketStatus })}
                className="mt-1 w-full rounded border bg-transparent px-2 py-1.5 text-sm"
                style={{ borderColor: "var(--admin-border)", color: "var(--admin-fg)" }}
              >
                {TICKET_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs">
              <span
                className="text-[11px] font-medium uppercase tracking-wide"
                style={{ color: "var(--admin-fg-muted)" }}
              >
                Assigned To
              </span>
              <select
                value={ticket.assigned_to ?? ""}
                onChange={(e) =>
                  updMut.mutate({ assignedTo: e.target.value || null })
                }
                className="mt-1 w-full rounded border bg-transparent px-2 py-1.5 text-sm"
                style={{ borderColor: "var(--admin-border)", color: "var(--admin-fg)" }}
              >
                <option value="">Unassigned</option>
                {(staffData?.staff ?? []).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Conversation">
        <div className="space-y-3 px-4 py-4">
          {replies.length === 0 && (
            <div
              className="rounded border border-dashed py-8 text-center text-xs"
              style={{ borderColor: "var(--admin-border)", color: "var(--admin-fg-muted)" }}
            >
              No replies yet. Be the first to respond.
            </div>
          )}
          {replies.map((r: any) => (
            <article
              key={r.id}
              className="rounded-md border p-3"
              style={{
                borderColor: r.is_internal ? "rgba(217,119,6,0.35)" : "var(--admin-border)",
                background: r.is_internal ? "rgba(217,119,6,0.06)" : "var(--admin-surface)",
              }}
            >
              <header
                className="flex flex-wrap items-center gap-2 text-[11px]"
                style={{ color: "var(--admin-fg-muted)" }}
              >
                <span className="font-medium" style={{ color: "var(--admin-fg)" }}>
                  {r.author_name}
                </span>
                <span>·</span>
                <span>{formatIST(r.created_at)}</span>
                {r.is_internal && (
                  <span
                    className="ml-1 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                    style={{ background: "rgba(217,119,6,0.18)", color: "#b45309" }}
                  >
                    <Lock className="size-2.5" /> Internal Note
                  </span>
                )}
                {r.direction === "inbound" && (
                  <span
                    className="ml-1 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                    style={{ background: "rgba(2,132,199,0.14)", color: "#0369a1" }}
                  >
                    <Mail className="size-2.5" /> Inbound Email
                  </span>
                )}
                {!r.is_internal && r.direction !== "inbound" && r.emailed_at && (ticket as any).ticket_email && (
                  <span
                    className="ml-1 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                    style={{ background: "rgba(22,163,74,0.14)", color: "#15803d" }}
                    title={`Delivered to ${(ticket as any).ticket_email}`}
                  >
                    <MailCheck className="size-2.5" /> Emailed to customer
                  </span>
                )}
              </header>
              <p
                className="mt-1.5 whitespace-pre-line text-sm"
                style={{ color: "var(--admin-fg)" }}
              >
                {r.reply_text}
              </p>
            </article>
          ))}

          <div
            className="rounded-md border p-3"
            style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface-2)" }}
          >
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={3}
              placeholder={isInternal ? "Write an internal note (not visible to customer)…" : "Write a reply to the customer…"}
              className="w-full resize-none bg-transparent text-sm outline-none"
              style={{ color: "var(--admin-fg)" }}
            />
            <div className="mt-2 flex items-center justify-between">
              <label
                className="inline-flex items-center gap-2 text-xs"
                style={{ color: "var(--admin-fg-muted)" }}
              >
                <button
                  type="button"
                  onClick={() => setIsInternal(false)}
                  className="rounded px-2 py-1"
                  style={{
                    background: !isInternal ? "var(--admin-accent)" : "transparent",
                    color: !isInternal ? "var(--admin-accent-fg)" : "var(--admin-fg-muted)",
                  }}
                >
                  Customer Reply
                </button>
                <button
                  type="button"
                  onClick={() => setIsInternal(true)}
                  className="rounded px-2 py-1"
                  style={{
                    background: isInternal ? "#b45309" : "transparent",
                    color: isInternal ? "#fff" : "var(--admin-fg-muted)",
                  }}
                >
                  Internal Note
                </button>
                {canned && canned.length > 0 && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCanned((v) => !v)}
                      className="inline-flex items-center gap-1 rounded px-2 py-1"
                      style={{ color: "var(--admin-fg-muted)", border: "1px dashed var(--admin-border)" }}
                    >
                      <Sparkles className="size-3" /> Canned
                    </button>
                    {showCanned && (
                      <div
                        className="absolute left-0 top-full z-10 mt-1 max-h-64 w-72 overflow-auto rounded-md border p-1 shadow-lg"
                        style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
                      >
                        {canned.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setReply((prev) => (prev ? prev + "\n\n" + c.body : c.body));
                              setShowCanned(false);
                            }}
                            className="block w-full rounded px-2 py-1.5 text-left text-xs hover:bg-black/5"
                            style={{ color: "var(--admin-fg)" }}
                          >
                            <div className="font-medium">{c.title}</div>
                            {c.category && (
                              <div className="text-[10px]" style={{ color: "var(--admin-fg-muted)" }}>
                                {c.category}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </label>
              <button
                type="button"
                disabled={!reply.trim() || replyMut.isPending}
                onClick={() => replyMut.mutate()}
                className="inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium disabled:opacity-50"
                style={{ background: "var(--admin-accent)", color: "var(--admin-accent-fg)" }}
              >
                {replyMut.isPending ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Send className="size-3" />
                )}
                Send
              </button>
            </div>
          </div>
        </div>
      </SectionCard>
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
