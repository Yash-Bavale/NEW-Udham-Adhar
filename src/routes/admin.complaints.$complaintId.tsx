import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getComplaintDetail, updateComplaintNotes } from "@/lib/crm/complaints-detail.functions";
import { updateComplaint } from "@/lib/crm/complaints.functions";
import { StatusTransition } from "@/components/admin/StatusTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  MessageSquareWarning,
  User,
  FileText,
  History,
  Loader2,
  Save,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  Copy,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/complaints/$complaintId")({
  head: () => ({
    meta: [{ title: "Complaint Details — Udyam Ops OS" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: ComplaintDetailPage,
});

function fmtIST(iso?: string | null) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
    .format(new Date(iso))
    .replace(",", "");
}

function ComplaintDetailPage() {
  const { complaintId } = Route.useParams();
  const qc = useQueryClient();
  const fetchFn = useServerFn(getComplaintDetail);
  const saveNotesFn = useServerFn(updateComplaintNotes);
  const updateFn = useServerFn(updateComplaint);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin.complaint", complaintId],
    queryFn: () => fetchFn({ data: { id: complaintId } }),
  });

  const [notes, setNotes] = useState("");
  const [notesInit, setNotesInit] = useState(false);
  const [busy, setBusy] = useState(false);

  // Authority editable card state
  const [authority, setAuthority] = useState("");
  const [authorityRef, setAuthorityRef] = useState("");
  const [description, setDescription] = useState("");
  const [expected, setExpected] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authInit, setAuthInit] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-32 animate-pulse rounded-lg border" style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface-2)" }} />
        <div className="h-64 animate-pulse rounded-lg border" style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface-2)" }} />
      </div>
    );
  }
  if (!data) return null;
  const { complaint, audits } = data as any;

  if (!notesInit) {
    setNotes(complaint.notes ?? "");
    setNotesInit(true);
  }
  if (!authInit) {
    setAuthority(complaint.authority_name ?? "");
    setAuthorityRef(complaint.authority_ref_number ?? "");
    setDescription(complaint.description ?? "");
    setExpected(complaint.expected_update_at ? complaint.expected_update_at.slice(0, 10) : "");
    setAuthInit(true);
  }

  const handleSaveNotes = async () => {
    setBusy(true);
    try {
      await saveNotesFn({ data: { id: complaintId, notes } });
      toast.success("Notes saved");
      qc.invalidateQueries({ queryKey: ["admin.complaint", complaintId] });
    } catch (e: any) {
      toast.error(e?.message ?? "Failed");
    } finally {
      setBusy(false);
    }
  };

  const handleSaveAuthority = async () => {
    if (!authority.trim()) {
      toast.error("Authority name is required");
      return;
    }
    setAuthBusy(true);
    try {
      await updateFn({
        data: {
          id: complaintId,
          patch: {
            authority_name: authority.trim(),
            authority_ref_number: authorityRef.trim() || null,
            description: description || null,
            expected_update_at: expected || null,
          },
        },
      });
      toast.success("Authority info updated");
      qc.invalidateQueries({ queryKey: ["admin.complaint", complaintId] });
    } catch (e: any) {
      toast.error(e?.message ?? "Failed");
    } finally {
      setAuthBusy(false);
    }
  };

  // Extract application reference if formatted as "Ref: XXXX"
  const extractedRef =
    complaint.application?.application_code ||
    (complaint.notes?.match(/^Ref:\s*([^\n]+)/)?.[1]) ||
    "None Specified";

  // Clean submitted grievance text
  const rawNotes = complaint.notes || complaint.lead?.notes || "";
  const cleanGrievanceText =
    rawNotes.replace(/^Ref:\s*[^\n]+\n*/i, "").trim() ||
    complaint.description ||
    "No detailed text provided.";

  const customerName = complaint.lead?.name || complaint.customer?.name || "Complainant";
  const customerEmail = complaint.lead?.email || complaint.customer?.primary_email || null;
  const customerMobile = complaint.lead?.mobile || complaint.customer?.primary_mobile || null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div className="space-y-6">
      <Link to="/admin/complaints" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900">
        <ChevronLeft className="w-4 h-4" /> Back to complaints & contact forms
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <MessageSquareWarning className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 font-mono">{complaint.complaint_number || "Complaint"}</h1>
              <Badge variant="outline" className="capitalize text-xs font-semibold">
                {complaint.severity || "normal"} severity
              </Badge>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              Submitted on {fmtIST(complaint.submitted_at || complaint.created_at)}
            </p>
          </div>
        </div>
        <StatusTransition kind="complaint" entityId={complaintId} current={complaint.status} onChanged={refetch} />
      </div>

      {/* Primary Card: Original Received Complaint Details (From Public Form) */}
      <Card className="border-rose-200 bg-gradient-to-br from-rose-50/30 via-white to-slate-50/50 shadow-sm">
        <CardHeader className="py-3.5 px-5 border-b border-rose-100 bg-rose-50/50 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold text-rose-950 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            Received Complaint Details (Public Form Submission)
          </CardTitle>
          <span className="text-xs text-rose-700 font-mono font-medium">
            Ref: {extractedRef}
          </span>
        </CardHeader>
        <CardContent className="p-5 space-y-4 text-sm">
          {/* Submitter Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-3.5 rounded-lg border border-slate-200/80 bg-white">
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Full Name</span>
              <span className="text-sm font-semibold text-slate-900">{customerName}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Mobile Number</span>
              {customerMobile ? (
                <a href={`tel:+91${customerMobile}`} className="text-sm font-mono font-semibold text-rose-700 hover:underline flex items-center gap-1">
                  <Phone className="w-3 h-3" /> +91 {customerMobile}
                </a>
              ) : (
                <span className="text-sm text-slate-400">Not provided</span>
              )}
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email Address</span>
              {customerEmail ? (
                <a href={`mailto:${customerEmail}`} className="text-sm font-semibold text-rose-700 hover:underline flex items-center gap-1 truncate block">
                  <Mail className="w-3 h-3" /> {customerEmail}
                </a>
              ) : (
                <span className="text-sm text-slate-400">Not provided</span>
              )}
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Application Ref</span>
              <span className="text-sm font-mono font-semibold text-slate-800">{extractedRef}</span>
            </div>
          </div>

          {/* Received Complaint / Grievance Text */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                Submitted Grievance Message
              </span>
              <button
                onClick={() => copyToClipboard(cleanGrievanceText, "Grievance message")}
                className="text-xs text-rose-700 hover:underline inline-flex items-center gap-1 font-medium"
              >
                <Copy className="w-3 h-3" /> Copy Message
              </button>
            </div>
            <div className="p-4 rounded-lg border border-slate-200 bg-white text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-sans shadow-inner">
              {cleanGrievanceText}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Section: Authority Filing & Escalation Status */}
      <Card>
        <CardHeader className="py-3 border-b bg-slate-50/50 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold">Authority & Filing Details (Internal Ops)</CardTitle>
          <Button onClick={handleSaveAuthority} disabled={authBusy} size="sm" variant="outline">
            {authBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
            Save Filing Info
          </Button>
        </CardHeader>
        <CardContent className="p-4 grid md:grid-cols-2 gap-4 text-sm">
          <label className="block">
            <span className="block text-[11px] uppercase tracking-wide font-medium mb-1 text-slate-500">Authority Name *</span>
            <input
              value={authority}
              onChange={(e) => setAuthority(e.target.value)}
              placeholder="e.g. Ministry of MSME / Grievance Officer"
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="block text-[11px] uppercase tracking-wide font-medium mb-1 text-slate-500">Authority Reference #</span>
            <input
              value={authorityRef}
              onChange={(e) => setAuthorityRef(e.target.value)}
              placeholder="Ticket / Diary / Reference No."
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-mono"
            />
          </label>
          <label className="block">
            <span className="block text-[11px] uppercase tracking-wide font-medium mb-1 text-slate-500">Expected Update Date</span>
            <input
              type="date"
              value={expected}
              onChange={(e) => setExpected(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="block text-[11px] uppercase tracking-wide font-medium mb-1 text-slate-500">Investigation & Action Summary</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Summary of actions taken with authority or resolutions provided"
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="py-3 border-b bg-slate-50/50">
            <CardTitle className="text-sm font-semibold">Internal Ops Notes</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="Internal investigation notes, calls made, customer responses, follow-up reminders…"
              className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
            <Button onClick={handleSaveNotes} disabled={busy} size="sm">
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : null} Save Internal Notes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-3 border-b bg-slate-50/50">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <User className="w-4 h-4" /> Linked CRM Context
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {complaint.lead && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Lead Entry</div>
                <Link
                  to="/admin/leads/$leadId"
                  params={{ leadId: complaint.lead.id }}
                  className="text-sm font-semibold hover:underline text-rose-700"
                >
                  {complaint.lead.name}
                </Link>
                <div className="text-xs text-slate-500">{complaint.lead.email}</div>
                <div className="text-xs text-slate-500 font-mono">{complaint.lead.lead_code}</div>
              </div>
            )}
            {complaint.application && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Linked Order</div>
                <Link
                  to="/admin/orders/$orderId"
                  params={{ orderId: complaint.application.id }}
                  className="text-sm font-mono hover:underline flex items-center gap-1 text-slate-900"
                >
                  <FileText className="w-3 h-3 text-slate-400" /> {complaint.application.application_code}
                </Link>
                <Badge variant="outline" className="mt-1 text-[10px] uppercase">
                  {complaint.application.application_status?.replace(/_/g, " ")}
                </Badge>
              </div>
            )}
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Reminders Sent</div>
              <div className="text-sm font-semibold">{complaint.reminder_count || 0}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="py-3 border-b bg-slate-50/50">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <History className="w-4 h-4" /> Audit & Activity Trail
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {audits.length === 0 ? (
            <div className="p-6 text-sm text-center text-slate-400 italic">No activity logged yet.</div>
          ) : (
            <ul className="divide-y">
              {audits.map((a: any) => (
                <li key={a.id} className="py-3 px-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{a.action.replace(/_/g, " ")}</span>
                    <span className="text-[11px] text-slate-400">{fmtIST(a.created_at)}</span>
                  </div>
                  {a.actor_email && <div className="text-[11px] text-slate-500 mt-1">by {a.actor_email}</div>}
                  {(a.old_value || a.new_value) && (
                    <details className="mt-2 text-[11px]">
                      <summary className="cursor-pointer text-slate-500">Show changes</summary>
                      <pre className="mt-1 p-2 bg-slate-50 rounded text-[10px] overflow-auto">
                        {JSON.stringify({ before: a.old_value, after: a.new_value }, null, 2)}
                      </pre>
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
