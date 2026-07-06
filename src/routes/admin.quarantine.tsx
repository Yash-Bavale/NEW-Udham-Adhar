import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Mail,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  ExternalLink,
} from "lucide-react";
import {
  listQuarantine,
  approveQuarantine,
  discardQuarantine,
  rerunQuarantineMatch,
  searchTicketsForQuarantine,
  createTicketFromQuarantine,
  type QuarantineRow,
} from "@/lib/tickets/quarantine.functions";
import { pollInboxNow } from "@/lib/mail/inbox-poll.functions";
import { SectionCard } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

export const Route = createFileRoute("/admin/quarantine")({
  head: () => ({
    meta: [
      { title: "Email Quarantine — Udyam Ops OS" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: QuarantinePage,
  errorComponent: ({ error }) => (
    <div className="p-6 text-sm text-red-600">Failed to load quarantine: {error.message}</div>
  ),
  notFoundComponent: () => <div className="p-6 text-sm">Not found</div>,
});

const REASON_META: Record<string, { label: string; tone: "warn" | "danger" | "info" }> = {
  sender_mismatch: { label: "Sender mismatch", tone: "danger" },
  no_match: { label: "No matching ticket", tone: "warn" },
  rematched_pending_review: { label: "Rematched — review", tone: "info" },
};

function reasonBadge(reason: string) {
  const meta = REASON_META[reason] || { label: reason, tone: "info" as const };
  const cls =
    meta.tone === "danger"
      ? "bg-red-50 text-red-700 border-red-200"
      : meta.tone === "warn"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-blue-50 text-blue-700 border-blue-200";
  return <Badge variant="outline" className={cls}>{meta.label}</Badge>;
}

function QuarantinePage() {
  const qc = useQueryClient();
  const [scope, setScope] = useState<"pending" | "reviewed" | "all">("pending");
  const listFn = useServerFn(listQuarantine);
  const rerunFn = useServerFn(rerunQuarantineMatch);
  const approveFn = useServerFn(approveQuarantine);
  const discardFn = useServerFn(discardQuarantine);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["quarantine", scope],
    queryFn: () => listFn({ data: { scope, limit: 100 } }),
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["quarantine"] });

  const rerun = useMutation({
    mutationFn: (id: string) => rerunFn({ data: { id } }),
    onSuccess: (r) => {
      if (r.matched) {
        toast.success(r.senderOk ? "Matched — sender verified" : "Matched, but sender still differs");
      } else {
        toast.info("No ticket match found");
      }
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const approve = useMutation({
    mutationFn: (v: { id: string; ticketId?: string }) => approveFn({ data: v }),
    onSuccess: () => {
      toast.success("Attached to ticket");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const discard = useMutation({
    mutationFn: (v: { id: string; reason?: string }) => discardFn({ data: v }),
    onSuccess: () => {
      toast.success("Discarded");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const rows = data ?? [];

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Mail className="h-6 w-6" /> Email Quarantine
          </h1>
          <p className="text-sm text-muted-foreground">
            Inbound emails that couldn't be safely attached to a ticket. Review and approve, re-run matching, or discard.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      <Tabs value={scope} onValueChange={(v) => setScope(v as typeof scope)}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        <TabsContent value={scope} className="mt-4">
          <SectionCard>
            {isLoading ? (
              <div className="p-8 flex items-center justify-center text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading…
              </div>
            ) : rows.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                Nothing to review. Inbound messages that fail matching or sender verification will show up here.
              </div>
            ) : (
              <div className="divide-y">
                {rows.map((row) => (
                  <QuarantineItem
                    key={row.id}
                    row={row}
                    onRerun={() => rerun.mutate(row.id)}
                    onApprove={(ticketId) => approve.mutate({ id: row.id, ticketId })}
                    onDiscard={(reason) => discard.mutate({ id: row.id, reason })}
                    busy={
                      (rerun.isPending && rerun.variables === row.id) ||
                      (approve.isPending && approve.variables?.id === row.id) ||
                      (discard.isPending && discard.variables?.id === row.id)
                    }
                  />
                ))}
              </div>
            )}
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function QuarantineItem({
  row,
  onRerun,
  onApprove,
  onDiscard,
  busy,
}: {
  row: QuarantineRow;
  onRerun: () => void;
  onApprove: (ticketId?: string) => void;
  onDiscard: (reason?: string) => void;
  busy: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [attachOpen, setAttachOpen] = useState(false);
  const isReviewed = !!row.reviewed_at;
  const canDirectApprove = !!row.matched_ticket_id && row.reason !== "sender_mismatch";
  const senderMismatch = row.reason === "sender_mismatch";

  return (
    <div className="p-4 space-y-2">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            {reasonBadge(row.reason)}
            {row.matched_ticket && (
              <Link
                to="/admin/tickets/$ticketId"
                params={{ ticketId: row.matched_ticket.id }}
                className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                {row.matched_ticket.ticket_number}
                <ExternalLink className="h-3 w-3" />
              </Link>
            )}
            {isReviewed && (
              <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                {row.review_action || "reviewed"}
              </Badge>
            )}
          </div>
          <div className="mt-1 font-medium truncate">{row.subject || "(no subject)"}</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            From <span className="font-mono">{row.from_email || "unknown"}</span>
            {" → "}
            <span className="font-mono">{row.to_email || "-"}</span>
            {" · "}
            {new Date(row.received_at).toLocaleString()}
          </div>
          {senderMismatch && row.matched_ticket_email && (
            <div className="mt-2 text-xs bg-red-50 border border-red-200 text-red-700 rounded p-2 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                Sender <span className="font-mono">{row.from_email}</span> does not match the ticket's registered
                email <span className="font-mono">{row.matched_ticket_email}</span>. Attaching will accept this as
                a customer message anyway.
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" variant="outline" onClick={() => setExpanded((v) => !v)}>
            {expanded ? "Hide" : "View"}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="rounded border bg-muted/40 p-3 text-sm whitespace-pre-wrap max-h-80 overflow-auto">
          {row.body_text || "(no text body)"}
        </div>
      )}

      {!isReviewed && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Button size="sm" variant="outline" onClick={onRerun} disabled={busy}>
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Re-run matching
          </Button>
          {canDirectApprove && (
            <Button size="sm" onClick={() => onApprove()} disabled={busy}>
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Attach to {row.matched_ticket?.ticket_number}
            </Button>
          )}
          {senderMismatch && row.matched_ticket_id && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onApprove(row.matched_ticket_id ?? undefined)}
              disabled={busy}
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Approve anyway
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => setAttachOpen(true)} disabled={busy}>
            <Search className="h-3.5 w-3.5 mr-1.5" /> Attach to different ticket
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onDiscard("spam_or_noise")} disabled={busy}>
            <XCircle className="h-3.5 w-3.5 mr-1.5" /> Discard
          </Button>
          {row.matched_ticket && (
            <Link
              to="/admin/tickets/$ticketId"
              params={{ ticketId: row.matched_ticket.id }}
              className="text-xs text-blue-600 hover:underline ml-auto inline-flex items-center gap-1"
            >
              Open ticket & reply <ExternalLink className="h-3 w-3" />
            </Link>
          )}
        </div>
      )}

      {attachOpen && (
        <AttachToTicketDialog
          open={attachOpen}
          onClose={() => setAttachOpen(false)}
          onPick={(ticketId) => {
            setAttachOpen(false);
            onApprove(ticketId);
          }}
        />
      )}
    </div>
  );
}

function AttachToTicketDialog({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (ticketId: string) => void;
}) {
  const searchFn = useServerFn(searchTicketsForQuarantine);
  const [q, setQ] = useState("");
  const search = useMutation({
    mutationFn: (term: string) => searchFn({ data: { q: term } }),
  });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Attach to ticket</DialogTitle>
          <DialogDescription>
            Search by ticket number, subject, or the ticket's registered email.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <Input
            placeholder="TKT-…, subject, or email"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && q.trim()) search.mutate(q.trim());
            }}
          />
          <Button onClick={() => q.trim() && search.mutate(q.trim())} disabled={search.isPending}>
            {search.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </Button>
        </div>
        <div className="max-h-72 overflow-auto divide-y border rounded">
          {(search.data ?? []).map((t) => (
            <button
              key={t.id}
              onClick={() => onPick(t.id)}
              className="w-full text-left p-3 hover:bg-muted/60"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs">{t.ticket_number}</span>
                <Badge variant="outline" className="text-[10px]">{t.status}</Badge>
              </div>
              <div className="text-sm truncate">{t.subject}</div>
              <div className="text-xs text-muted-foreground font-mono">{t.ticket_email}</div>
            </button>
          ))}
          {search.data && search.data.length === 0 && (
            <div className="p-4 text-sm text-muted-foreground text-center">No tickets found</div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
