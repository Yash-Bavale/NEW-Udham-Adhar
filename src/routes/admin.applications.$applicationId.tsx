import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getApplicationDetail } from "@/lib/crm/applications.functions";
import { StatusTransition } from "@/components/admin/StatusTransition";
import { AdminOnboardingPanel } from "@/components/admin/AdminOnboardingPanel";
import { LeadFinanceTab } from "@/components/admin/LeadFinanceTab";
import { LeadTimeline } from "@/components/admin/LeadTimeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, FileText, User, IndianRupee, Activity, ClipboardList, Award } from "lucide-react";

export const Route = createFileRoute("/admin/applications/$applicationId")({ component: ApplicationDetailPage });

function ApplicationDetailPage() {
  const { applicationId } = Route.useParams();
  const fetchFn = useServerFn(getApplicationDetail);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin.application", applicationId],
    queryFn: () => fetchFn({ data: { applicationId } }),
  });

  if (isLoading) return <div className="p-10 text-center text-slate-500">Loading application…</div>;
  if (!data) return null;
  const { application, lead, certificates } = data as any;

  return (
    <div className="space-y-6">
      <Link to="/admin/applications" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900">
        <ChevronLeft className="w-4 h-4" /> Back to applications
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-mono">{application.application_code}</h1>
          <p className="text-sm text-slate-500 mt-1">Created {new Date(application.created_at).toLocaleString("en-IN")}</p>
        </div>
        <StatusTransition kind="application" entityId={applicationId} current={application.application_status} onChanged={refetch} />
      </div>

      <Card>
        <CardHeader className="py-3 border-b bg-slate-50/50">
          <CardTitle className="text-sm font-semibold flex items-center gap-2"><User className="w-4 h-4" /> Linked Lead</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {lead ? (
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <Link to="/admin/leads/$leadId" params={{ leadId: lead.id }} className="font-semibold hover:underline">{lead.name}</Link>
                <div className="text-xs text-slate-500 mt-1 flex gap-3 flex-wrap">
                  <span>{lead.email}</span><span>{lead.mobile}</span><span className="font-mono">{lead.lead_code}</span>
                </div>
              </div>
              <Badge variant="outline" className="uppercase text-[10px]">{lead.service}</Badge>
            </div>
          ) : <p className="text-sm text-slate-400">No lead linked</p>}
        </CardContent>
      </Card>

      <Tabs defaultValue="onboarding" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-slate-100/50 border mb-6">
          <TabsTrigger value="onboarding" className="gap-2 py-2 px-4"><ClipboardList className="w-4 h-4" /> Onboarding</TabsTrigger>
          <TabsTrigger value="finance" className="gap-2 py-2 px-4"><IndianRupee className="w-4 h-4" /> Finance</TabsTrigger>
          <TabsTrigger value="certificates" className="gap-2 py-2 px-4"><Award className="w-4 h-4" /> Certificates</TabsTrigger>
          <TabsTrigger value="timeline" className="gap-2 py-2 px-4"><Activity className="w-4 h-4" /> Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="onboarding">
          {lead && <AdminOnboardingPanel leadId={lead.id} />}
        </TabsContent>

        <TabsContent value="finance">
          {lead && <LeadFinanceTab leadId={lead.id} />}
        </TabsContent>

        <TabsContent value="certificates">
          <Card>
            <CardHeader className="py-3 border-b bg-slate-50/50">
              <CardTitle className="text-sm font-semibold flex items-center gap-2"><FileText className="w-4 h-4" /> Certificates ({certificates.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {certificates.length === 0 ? (
                <div className="p-8 text-sm text-center text-slate-400 italic">No certificates uploaded yet. Use the Certificates module to upload.</div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                    <tr><th className="text-left py-2 px-4">Number</th><th className="text-left">File</th><th className="text-left">Issued</th><th className="text-left">Delivered</th></tr>
                  </thead>
                  <tbody className="divide-y">
                    {certificates.map((c: any) => (
                      <tr key={c.id}>
                        <td className="py-2 px-4 font-mono text-xs">{c.certificate_number || "—"}</td>
                        <td className="text-xs">{c.file_name}</td>
                        <td className="text-xs text-slate-500">{c.issued_at ? new Date(c.issued_at).toLocaleString("en-IN") : "—"}</td>
                        <td className="text-xs">{c.delivered_at ? <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Delivered</Badge> : <Badge variant="outline">Pending</Badge>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          {lead && <LeadTimeline leadId={lead.id} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
