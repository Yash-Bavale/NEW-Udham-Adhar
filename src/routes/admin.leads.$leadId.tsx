import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getLead, updateLead, addLeadNote, listStaff } from "@/lib/crm/leads-admin.functions";
import { LEAD_STATUSES } from "@/lib/crm/types";
import { AdminOnboardingPanel } from "@/components/admin/AdminOnboardingPanel";
import { FormSubmissionPanel } from "@/components/admin/FormSubmissionPanel";
import { LeadTimeline } from "@/components/admin/LeadTimeline";
import { LeadFinanceTab } from "@/components/admin/LeadFinanceTab";
import { LeadEmailsTab } from "@/components/admin/LeadEmailsTab";
import { LeadEditableCard } from "@/components/admin/LeadEditableCard";
import { LeadWorkspacePanel } from "@/components/admin/LeadWorkspacePanel";
import { AddTaskDialog } from "@/components/admin/AddTaskDialog";
import { useRole } from "@/hooks/useRole";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  User,
  FileText,
  Mail,
  IndianRupee,
  Activity,
  History,
  MessageSquare,
  ClipboardList,
  LayoutGrid,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/leads/$leadId")({ component: LeadDetailPage });

function LeadDetailPage() {
  const { leadId } = Route.useParams();
  const qc = useQueryClient();
  const getFn = useServerFn(getLead);
  const updateFn = useServerFn(updateLead);
  const noteFn = useServerFn(addLeadNote);
  const staffFn = useServerFn(listStaff);
  const role = useRole();

  const { data, isLoading } = useQuery({
    queryKey: ["admin.lead", leadId],
    queryFn: () => getFn({ data: { id: leadId } }),
  });

  const { data: staffData } = useQuery({
    queryKey: ["admin.staff"],
    queryFn: () => staffFn(),
  });

  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  if (isLoading) return <div className="p-10 text-center text-slate-500">Loading lead details…</div>;
  if (!data) return null;
  const { lead, applications, notes } = data;
  const canEditLead = role.hasAny(["super_admin", "operations", "admin", "manager", "executive"]);
  const canEditFinance = role.hasAny(["super_admin", "admin", "finance"]);
  const hideMoney = role.hideMoney();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <Link to="/admin/leads" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to leads
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg">
              {lead.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{lead.name}</h1>
              <div className="flex items-center gap-2 text-sm text-slate-500 font-mono">
                {lead.lead_code}
                <Badge variant="outline" className="font-sans text-[10px] uppercase tracking-wider">
                  {lead.status.replace(/_/g, " ")}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={lead.status}
              disabled={busy || !canEditLead}
              onChange={async (e) => {
                setBusy(true);
                try {
                  await updateFn({ data: { id: leadId, status: e.target.value as any } });
                  toast.success("Status updated");
                  await qc.invalidateQueries({ queryKey: ["admin.lead", leadId] });
                } catch (err) {
                  toast.error("Failed to update status");
                } finally {
                  setBusy(false);
                }
              }}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            >
              {LEAD_STATUSES.map((s) => (
                <option
                  key={s}
                  value={s}
                  disabled={s === "completed" && lead.status !== "completed"}
                >
                  {s.replace(/_/g, " ")}{s === "completed" && lead.status !== "completed" ? " (via fulfillment)" : ""}
                </option>
              ))}
            </select>
            <AddTaskDialog defaultLeadId={leadId} />
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-slate-100/50 border mb-6">
          <TabsTrigger value="workspace" className="gap-2 py-2 px-4"><LayoutGrid className="w-4 h-4" /> Workspace</TabsTrigger>
          <TabsTrigger value="overview" className="gap-2 py-2 px-4"><User className="w-4 h-4" /> Overview</TabsTrigger>
          <TabsTrigger value="onboarding" className="gap-2 py-2 px-4"><ClipboardList className="w-4 h-4" /> Onboarding</TabsTrigger>
          <TabsTrigger value="emails" className="gap-2 py-2 px-4"><Mail className="w-4 h-4" /> Emails</TabsTrigger>
          {!hideMoney && <TabsTrigger value="finance" className="gap-2 py-2 px-4"><IndianRupee className="w-4 h-4" /> Finance</TabsTrigger>}
          <TabsTrigger value="timeline" className="gap-2 py-2 px-4"><History className="w-4 h-4" /> Timeline</TabsTrigger>
          <TabsTrigger value="notes" className="gap-2 py-2 px-4"><MessageSquare className="w-4 h-4" /> Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="workspace">
          <LeadWorkspacePanel
            lead={lead as any}
            applications={applications}
            staff={staffData?.profiles ?? []}
          />
        </TabsContent>



        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LeadEditableCard
              title="Customer Contact"
              leadId={leadId}
              data={lead}
              canEdit={canEditLead}
              fields={[
                { key: "name", label: "Full Name" },
                { key: "email", label: "Email Address", type: "email" },
                { key: "mobile", label: "Mobile Number", type: "tel" },
                { key: "state", label: "State" },
                { key: "language", label: "Preferred Language" },
              ]}
            />
            
            <LeadEditableCard
              title="Service & Pricing"
              leadId={leadId}
              data={lead}
              canEdit={canEditFinance}
              fields={[
                { key: "service", label: "Service Type" },
                ...(hideMoney ? [] : [
                  { key: "base_amount", label: "Base Amount", type: "number" as const },
                  { key: "gst_amount", label: "GST Amount", type: "number" as const },
                  { key: "total_amount", label: "Total Amount", type: "number" as const },
                ]),
              ]}
            />

            <LeadEditableCard
              title="Assignment & Source"
              leadId={leadId}
              data={{ ...lead, assigned_to: (lead as any).assignee_name || (lead.assigned_to ? lead.assigned_to.slice(0,8)+"…" : "Unassigned") }}
              canEdit={canEditLead}
              fields={[
                { key: "assigned_to", label: "Assigned To", readOnly: true },
                { key: "lead_source", label: "Lead Source" },
                { key: "created_at", label: "Lead Created", readOnly: true },
                { key: "updated_at", label: "Last Updated", readOnly: true },
              ]}
            />
          </div>

          <Card>
            <CardHeader className="py-3 px-4 border-b bg-slate-50/50">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4" /> Applications ({applications.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {applications.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500 italic">No applications linked yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-50">
                        <th className="text-left py-3 px-4 font-bold">Code</th>
                        <th className="text-left py-3 px-4 font-bold">Status</th>
                        <th className="text-left py-3 px-4 font-bold">Created</th>
                        <th className="text-right py-3 px-4 font-bold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {applications.map((a: any) => (
                        <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 font-mono text-xs">{a.application_code}</td>
                          <td className="py-3 px-4">
                            <Badge variant="secondary" className="font-sans text-[10px] uppercase">{a.application_status.replace(/_/g, " ")}</Badge>
                          </td>
                          <td className="py-3 px-4 text-xs text-slate-500">{new Date(a.created_at).toLocaleString("en-IN")}</td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                              <Link to="/admin/applications/$applicationId" params={{ applicationId: a.id }}>View Details</Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-5">
          {applications && applications.length > 0 && (
            <FormSubmissionPanel applicationId={applications[0].id} />
          )}
          <AdminOnboardingPanel leadId={leadId} />
        </TabsContent>

        <TabsContent value="emails">
          <LeadEmailsTab leadId={leadId} leadService={lead.service} />
        </TabsContent>

        {!hideMoney && (
          <TabsContent value="finance">
            <LeadFinanceTab leadId={leadId} />
          </TabsContent>
        )}

        <TabsContent value="timeline">
          <LeadTimeline leadId={leadId} />
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Internal Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add an internal note for staff…"
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
                <Button
                  disabled={busy || !note.trim()}
                  onClick={async () => {
                    setBusy(true);
                    try {
                      await noteFn({ data: { lead_id: leadId, note: note.trim() } });
                      setNote("");
                      toast.success("Note added");
                      await qc.invalidateQueries({ queryKey: ["admin.lead", leadId] });
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  Add Note
                </Button>
              </div>
              <ul className="space-y-4 pt-4">
                {notes.map((n: any) => (
                  <li key={n.id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        {n.user_id ? "Staff Member" : "System"} • {new Date(n.created_at).toLocaleString("en-IN")}
                      </div>
                      <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {n.note}
                      </div>
                    </div>
                  </li>
                ))}
                {notes.length === 0 && (
                  <li className="text-center py-8 text-sm text-slate-400 italic">No internal notes yet.</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
