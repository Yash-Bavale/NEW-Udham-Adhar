import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getLead, updateLead, addLeadNote } from "@/lib/crm/leads-admin.functions";
import { LEAD_STATUSES } from "@/lib/crm/types";
import { AdminOnboardingPanel } from "@/components/admin/AdminOnboardingPanel";
import { LeadTimeline } from "@/components/admin/LeadTimeline";
import { LeadFinanceTab } from "@/components/admin/LeadFinanceTab";

export const Route = createFileRoute("/admin/leads/$leadId")({ component: LeadDetailPage });

function LeadDetailPage() {
  const { leadId } = Route.useParams();
  const qc = useQueryClient();
  const getFn = useServerFn(getLead);
  const updateFn = useServerFn(updateLead);
  const noteFn = useServerFn(addLeadNote);

  const { data, isLoading } = useQuery({
    queryKey: ["admin.lead", leadId],
    queryFn: () => getFn({ data: { id: leadId } }),
  });

  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  if (isLoading) return <div className="text-sm text-slate-500">Loading…</div>;
  if (!data) return null;
  const { lead, applications, notes } = data;

  return (
    <div className="space-y-5">
      <div>
        <Link to="/admin/leads" className="text-sm text-blue-700 hover:underline">← Back to leads</Link>
      </div>
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{lead.name}</h1>
          <div className="text-sm text-slate-500 font-mono">{lead.lead_code}</div>
        </div>
        <select
          value={lead.status}
          disabled={busy}
          onChange={async (e) => {
            setBusy(true);
            await updateFn({ data: { id: leadId, status: e.target.value as never } });
            await qc.invalidateQueries({ queryKey: ["admin.lead", leadId] });
            setBusy(false);
          }}
          className="rounded border px-3 py-1.5 text-sm"
        >
          {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card title="Customer">
          <Row k="Email" v={lead.email} />
          <Row k="Mobile" v={lead.mobile} />
          <Row k="State" v={lead.state} />
          <Row k="Language" v={lead.language} />
          <Row k="Source" v={lead.lead_source ?? "—"} />
        </Card>
        <Card title="Service & Pricing">
          <Row k="Service" v={lead.service} />
          <Row k="Base" v={`₹${Number(lead.base_amount).toFixed(2)}`} />
          <Row k="GST" v={`₹${Number(lead.gst_amount).toFixed(2)}`} />
          <Row k="Total" v={`₹${Number(lead.total_amount).toFixed(2)}`} />
        </Card>
        <Card title="Assignment">
          <Row k="Assigned to" v={lead.assigned_to ?? "Unassigned"} />
          <Row k="Created" v={new Date(lead.created_at).toLocaleString("en-IN")} />
          <Row k="Updated" v={new Date(lead.updated_at).toLocaleString("en-IN")} />
        </Card>
      </div>

      <Card title={`Applications (${applications.length})`}>
        {applications.length === 0 ? (
          <div className="text-sm text-slate-500">No applications yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-500 uppercase">
              <tr><th className="text-left py-1">Code</th><th className="text-left">Status</th><th className="text-left">Created</th></tr>
            </thead>
            <tbody>
              {applications.map((a: any) => (
                <tr key={a.id} className="border-t">
                  <td className="py-1 font-mono text-xs">{a.application_code}</td>
                  <td>{a.application_status}</td>
                  <td className="text-xs text-slate-500">{new Date(a.created_at).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <AdminOnboardingPanel leadId={leadId} />

      <Card title="Internal Notes">
        <div className="flex gap-2 mb-3">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add an internal note…"
            className="flex-1 rounded border px-3 py-2 text-sm"
          />
          <button
            disabled={busy || !note.trim()}
            onClick={async () => {
              setBusy(true);
              await noteFn({ data: { lead_id: leadId, note: note.trim() } });
              setNote("");
              await qc.invalidateQueries({ queryKey: ["admin.lead", leadId] });
              setBusy(false);
            }}
            className="rounded bg-slate-900 text-white px-4 py-2 text-sm disabled:opacity-40"
          >Add</button>
        </div>
        <ul className="space-y-2">
          {notes.map((n: any) => (
            <li key={n.id} className="text-sm border-l-2 border-slate-200 pl-3">
              <div className="text-xs text-slate-500">{new Date(n.created_at).toLocaleString("en-IN")}</div>
              <div>{n.note}</div>
            </li>
          ))}
          {notes.length === 0 && <li className="text-sm text-slate-500">No notes yet.</li>}
        </ul>
      </Card>

      <Card title="Finance">
        <LeadFinanceTab leadId={leadId} />
      </Card>

      <Card title="Timeline">
        <LeadTimeline leadId={leadId} />
      </Card>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-white">
      <div className="px-4 py-2 border-b text-sm font-semibold">{title}</div>
      <div className="p-4">{children}</div>
    </div>
  );
}
function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between text-sm py-1 border-b last:border-0">
      <span className="text-slate-500">{k}</span>
      <span className="font-medium text-right max-w-[60%] truncate">{v}</span>
    </div>
  );
}
