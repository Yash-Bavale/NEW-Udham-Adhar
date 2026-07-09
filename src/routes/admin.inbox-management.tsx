import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import {
  getInboxStats,
  getRecentInboxEmails,
  getQuarantinedEmails,
  getAllTickets,
  pollInboxNow,
  getTicketConversation,
  getEmailsByDomain,
} from "@/lib/mail/inbox-admin.functions";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  AlertCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  Inbox,
} from "lucide-react";
import { toast } from "sonner";

function StatsCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm">
      <div className={`text-3xl font-bold ${color}`}>{value.toLocaleString()}</div>
      <div className="text-sm text-slate-600 mt-1">{label}</div>
    </div>
  );
}

function InboxStatsTab() {
  const statsFn = useServerFn(getInboxStats);
  const { data } = useQuery({
    queryKey: ["inbox.stats"],
    queryFn: () => statsFn(),
  });

  if (!data) return <div className="text-sm text-slate-600">Loading stats...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatsCard
          label="Incoming Emails"
          value={data.totals.incomingEmailLogs}
          color="text-blue-600"
        />
        <StatsCard
          label="Support Tickets"
          value={data.totals.supportTickets}
          color="text-emerald-600"
        />
        <StatsCard
          label="Ticket Replies"
          value={data.totals.ticketReplies}
          color="text-indigo-600"
        />
        <StatsCard
          label="Quarantined"
          value={data.totals.quarantinedEmails}
          color="text-orange-600"
        />
        <StatsCard
          label="Outgoing Queue"
          value={data.totals.outgoingQueue}
          color="text-slate-600"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="font-semibold text-sm mb-3">Last 7 Days</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Emails Received:</span>
              <span className="font-semibold">{data.recent7days.emails}</span>
            </div>
            {Object.entries(data.recent7days.statusCounts || {}).map(([status, count]: any) => (
              <div key={status} className="flex justify-between">
                <span className="text-slate-600">{status}:</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="font-semibold text-sm mb-3">Quarantine Reasons</h3>
          <div className="space-y-2 text-sm">
            {Object.entries(data.quarantine.reasonCounts || {}).map(([reason, count]: any) => (
              <div key={reason} className="flex justify-between">
                <span className="text-slate-600">{reason}:</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
        <div className="flex items-start gap-2">
          <Inbox className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-blue-900">Inbox</p>
            <p className="text-blue-800">{data.inbox}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecentEmailsTab() {
  const emailsFn = useServerFn(getRecentInboxEmails);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["inbox.emails", page],
    queryFn: () => emailsFn({ limit: 30, page }),
  });

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Received</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-slate-500">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data?.emails?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-slate-500">
                  No emails found
                </TableCell>
              </TableRow>
            ) : (
              data?.emails?.map((email: any) => (
                <TableRow key={email.id}>
                  <TableCell className="text-xs truncate">{email.from_email}</TableCell>
                  <TableCell className="text-sm truncate">{email.subject}</TableCell>
                  <TableCell>
                    <Badge variant={email.status === "sent" ? "default" : "secondary"}>
                      {email.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    {email.received_at ? new Date(email.received_at).toLocaleString() : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {data?.totalPages && data.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(Math.max(1, page - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-slate-600 py-1 px-3">
            Page {page} of {data.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= data.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

function QuarantineTab() {
  const quarantineFn = useServerFn(getQuarantinedEmails);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["inbox.quarantine", page],
    queryFn: () => quarantineFn({ limit: 30, page }),
  });

  return (
    <div className="space-y-4">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm flex gap-2">
        <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-orange-900">Quarantined Emails</p>
          <p className="text-orange-800">
            {data?.total || 0} emails couldn't be automatically matched to orders or tickets
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Received</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-slate-500">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data?.emails?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-slate-500">
                  No quarantined emails
                </TableCell>
              </TableRow>
            ) : (
              data?.emails?.map((email: any) => (
                <TableRow key={email.id}>
                  <TableCell className="text-xs truncate">{email.from_email}</TableCell>
                  <TableCell className="text-sm truncate">{email.subject}</TableCell>
                  <TableCell>
                    <Badge variant={email.reason === "no_match" ? "destructive" : "secondary"}>
                      {email.reason === "no_match" ? "No Match" : "Sender Mismatch"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    {email.received_at ? new Date(email.received_at).toLocaleString() : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {data?.totalPages && data.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(Math.max(1, page - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-slate-600 py-1 px-3">
            Page {page} of {data.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= data.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

function TicketsTab() {
  const ticketsFn = useServerFn(getAllTickets);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>();

  const { data, isLoading } = useQuery({
    queryKey: ["inbox.tickets", page, status],
    queryFn: () => ticketsFn({ limit: 30, page, status: status as any }),
  });

  const statuses = ["open", "in_progress", "waiting_customer", "resolved", "closed"];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={status === undefined ? "default" : "outline"}
          size="sm"
          onClick={() => { setStatus(undefined); setPage(1); }}
        >
          All
        </Button>
        {statuses.map((s) => (
          <Button
            key={s}
            variant={status === s ? "default" : "outline"}
            size="sm"
            onClick={() => { setStatus(s); setPage(1); }}
          >
            {s.replace(/_/g, " ")}
          </Button>
        ))}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket #</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-slate-500">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data?.tickets?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-slate-500">
                  No tickets found
                </TableCell>
              </TableRow>
            ) : (
              data?.tickets?.map((ticket: any) => (
                <TableRow key={ticket.id}>
                  <TableCell className="text-sm font-mono text-blue-600">{ticket.ticket_number}</TableCell>
                  <TableCell className="text-sm">{ticket.subject}</TableCell>
                  <TableCell>
                    <Badge variant={ticket.status === "open" ? "destructive" : "default"}>
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        ticket.priority === "high" || ticket.priority === "urgent"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    {ticket.created_at ? new Date(ticket.created_at).toLocaleString() : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {data?.totalPages && data.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(Math.max(1, page - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-slate-600 py-1 px-3">
            Page {page} of {data.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= data.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

function PollSection() {
  const pollFn = useServerFn(pollInboxNow);
  const qc = useQueryClient();
  const [loading, setLoading] = useState(false);

  const handlePoll = async () => {
    setLoading(true);
    try {
      const result = await pollFn({ limit: 100 });
      toast.success(result.message);
      await qc.invalidateQueries({ queryKey: ["inbox"] });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-blue-900">Manual Email Poll</p>
          <p className="text-sm text-blue-800">
            Fetch new emails from Zoho inbox (normally runs every 2 minutes automatically)
          </p>
        </div>
        <Button
          onClick={handlePoll}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Polling..." : "Poll Now"}
        </Button>
      </div>
    </div>
  );
}

function InboxManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Inbox Management</h1>
        <p className="text-slate-600">Manage incoming emails, support tickets, and quarantined messages</p>
      </div>

      <PollSection />

      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="emails">Recent Emails</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="quarantine">Quarantine</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="mt-6">
          <InboxStatsTab />
        </TabsContent>

        <TabsContent value="emails" className="mt-6">
          <RecentEmailsTab />
        </TabsContent>

        <TabsContent value="tickets" className="mt-6">
          <TicketsTab />
        </TabsContent>

        <TabsContent value="quarantine" className="mt-6">
          <QuarantineTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export const Route = createFileRoute("/admin/inbox-management")({
  component: InboxManagementPage,
});
