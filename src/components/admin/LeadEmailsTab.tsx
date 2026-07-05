import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { listLeadEmails, sendLeadEmail } from "@/lib/crm/emails-admin.functions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Send, History, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

export function LeadEmailsTab({ leadId, leadService, orderId }: { leadId: string; leadService: string; orderId?: string }) {
  const qc = useQueryClient();
  const listFn = useServerFn(listLeadEmails);
  const sendFn = useServerFn(sendLeadEmail);

  const { data, isLoading } = useQuery({
    queryKey: ["admin.lead.emails", leadId],
    queryFn: () => listFn({ data: { leadId } }),
  });

  const [sendOpen, setSendOpen] = useState(false);
  const [sending, setSending] = useState(false);
  
  // Map service names to the uploaded template's keys
  const getInitialServiceKey = () => {
    const s = leadService.toLowerCase();
    if (s.includes("new")) return "new_udyam";
    if (s.includes("update")) return "update_udyam";
    if (s.includes("download")) return "download_udyam";
    if (s.includes("migrate")) return "migrate_udyam";
    if (s.includes("forgot")) return "forgot_contact";
    if (s.includes("correct")) return "correct_pan";
    return "talk_expert";
  };

  const [serviceKey, setServiceKey] = useState(getInitialServiceKey());

  const handleSend = async () => {
    setSending(true);
    try {
      await sendFn({
        data: {
          leadId,
          templateCode: "client-info-request",
          variables: { serviceKey },
        },
      });
      toast.success("Email queued for delivery");
      setSendOpen(false);
      qc.invalidateQueries({ queryKey: ["admin.lead.emails", leadId] });
      if (orderId) qc.invalidateQueries({ queryKey: ["admin.order", orderId] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send email");
    } finally {
      setSending(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>;

  // Dedupe: every successful send creates a row in BOTH email_queue and email_logs.
  // Prefer the email_logs row (it has the final sent status); key by queue_id when present.
  const dedupMap = new Map<string, any>();
  for (const q of (data?.queue || [])) dedupMap.set(`q:${q.id}`, q);
  for (const l of (data?.logs || [])) {
    const key = l.queue_id ? `q:${l.queue_id}` : `l:${l.id}`;
    dedupMap.set(key, l);
  }
  const history = Array.from(dedupMap.values()).sort(
    (a: any, b: any) => new Date(b.sent_at || b.created_at || 0).getTime() - new Date(a.sent_at || a.created_at || 0).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <History className="w-4 h-4" /> Email History
        </h3>
        <Dialog open={sendOpen} onOpenChange={setSendOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Send className="w-4 h-4" /> Send Email
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Client Info Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Template Variant</label>
                <Select value={serviceKey} onValueChange={setServiceKey}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select variant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new_udyam">New Udyam Registration</SelectItem>
                    <SelectItem value="update_udyam">Update Udyam Certificate</SelectItem>
                    <SelectItem value="download_udyam">Download Udyam Certificate</SelectItem>
                    <SelectItem value="migrate_udyam">Udyog Aadhaar to Udyam Migration</SelectItem>
                    <SelectItem value="forgot_contact">Forgot Mobile / Email Recovery</SelectItem>
                    <SelectItem value="correct_pan">PAN / Aadhaar Correction</SelectItem>
                    <SelectItem value="talk_expert">Talk to Expert</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  This uses the high-converting template you provided. Pre-fills order number, name, and form link.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSendOpen(false)} disabled={sending}>
                Cancel
              </Button>
              <Button onClick={handleSend} disabled={sending}>
                {sending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
                Queue Email
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No emails sent yet.
                </TableCell>
              </TableRow>
            ) : (
              history.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <StatusIcon status={item.status} />
                  </TableCell>
                  <TableCell className="max-w-xs truncate font-medium">
                    {item.subject}
                  </TableCell>
                  <TableCell className="text-xs">{item.to_email}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(item.sent_at || item.created_at || Date.now()).toLocaleString("en-IN")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "sent":
      return (
        <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-200 gap-1 font-medium">
          <CheckCircle2 className="w-3 h-3" /> Sent
        </Badge>
      );
    case "failed":
    case "bounced":
    case "dlq":
      return (
        <Badge variant="outline" className="text-rose-600 bg-rose-50 border-rose-200 gap-1 font-medium">
          <XCircle className="w-3 h-3" /> Failed
        </Badge>
      );
    case "queued":
    case "sending":
      return (
        <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200 gap-1 font-medium">
          <Clock className="w-3 h-3" /> {status}
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
