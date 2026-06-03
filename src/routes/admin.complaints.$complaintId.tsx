import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getComplaintDetail, updateComplaintNotes } from "@/lib/crm/complaints-detail.functions";
import { StatusTransition } from "@/components/admin/StatusTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MessageSquareWarning, User, FileText, History, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/complaints/$complaintId")({ component: ComplaintDetailPage });

function ComplaintDetailPage() {
  const { complaintId } = Route.useParams();
  const qc = useQueryClient();
  const fetchFn = useServerFn(getComplaintDetail);
  const saveNotesFn = useServerFn(updateComplaintNotes);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin.complaint", complaintId],
    queryFn: () => fetchFn({ data: { id: complaintId } }),
  });

  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  if (isLoading) return <div className="p-10 text-center text-slate-500">Loading complaint…</div>;
  if (!data) return null;
  const { complaint, audits } = data;
  if (notes === "" && complaint.notes) setNotes(complaint.notes);

  const handleSaveNotes = async () => {
    setBusy(true);
    try {
      await saveNotesFn({ data: { id: complaintId, notes } });
      toast.success("Notes saved");
      qc.invalidateQueries({ queryKey: ["admin.complaint", complaintId] });
    } catch (e: any) { toast.error(e?.message ?? "Failed"); }
    finally { setBusy(false); }
  };

  return (
    <div className="space-y-6">
      <Link to="/admin/complaints" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900">
        <ChevronLeft className="w-4 h-4" /> Back to complaints
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
            <MessageSquareWarning className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-mono">{complaint.complaint_number || "Complaint"}</h1>
            <p className="text-sm text-slate-500 mt-1">Submitted {new Date(complaint.submitted_at || complaint.created_at).toLocaleString("en-IN")}</p>
          </div>
        </div>
        <StatusTransition kind="complaint" entityId={complaintId} current={complaint.status} onChanged={refetch} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="py-3 border-b bg-slate-50/50">
            <CardTitle className="text-sm font-semibold">Internal Notes</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              placeholder="Add resolution notes, investigation findings, customer communication summary…"
              className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
            <Button onClick={handleSaveNotes} disabled={busy} size="sm">
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : null} Save Notes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3 border-b bg-slate-50/50">
            <CardTitle className="text-sm font-semibold flex items-center gap-2"><User className="w-4 h-4" /> Linked</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {complaint.lead && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Lead</div>
                <Link to="/admin/leads/$leadId" params={{ leadId: complaint.lead.id }} className="text-sm font-semibold hover:underline">{complaint.lead.name}</Link>
                <div className="text-xs text-slate-500">{complaint.lead.email}</div>
                <div className="text-xs text-slate-500 font-mono">{complaint.lead.lead_code}</div>
              </div>
            )}
            {complaint.application && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Application</div>
                <Link to="/admin/applications/$applicationId" params={{ applicationId: complaint.application.id }} className="text-sm font-mono hover:underline flex items-center gap-1">
                  <FileText className="w-3 h-3" /> {complaint.application.application_code}
                </Link>
                <Badge variant="outline" className="mt-1 text-[10px] uppercase">{complaint.application.application_status?.replace(/_/g, " ")}</Badge>
              </div>
            )}
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Reminders Sent</div>
              <div className="text-sm">{complaint.reminder_count || 0}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="py-3 border-b bg-slate-50/50">
          <CardTitle className="text-sm font-semibold flex items-center gap-2"><History className="w-4 h-4" /> Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {audits.length === 0 ? (
            <div className="p-6 text-sm text-center text-slate-400 italic">No activity yet.</div>
          ) : (
            <ul className="divide-y">
              {audits.map((a: any) => (
                <li key={a.id} className="py-3 px-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{a.action.replace(/_/g, " ")}</span>
                    <span className="text-[11px] text-slate-400">{new Date(a.created_at).toLocaleString("en-IN")}</span>
                  </div>
                  {a.actor_email && <div className="text-[11px] text-slate-500 mt-1">by {a.actor_email}</div>}
                  {(a.old_value || a.new_value) && (
                    <details className="mt-2 text-[11px]">
                      <summary className="cursor-pointer text-slate-500">Show changes</summary>
                      <pre className="mt-1 p-2 bg-slate-50 rounded text-[10px] overflow-auto">{JSON.stringify({ before: a.old_value, after: a.new_value }, null, 2)}</pre>
                    </details>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
