import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { listApplications, updateApplication } from "@/lib/crm/applications.functions";
import { APPLICATION_STATUSES } from "@/lib/crm/types";

export const Route = createFileRoute("/admin/applications")({ component: ApplicationsPage });

function ApplicationsPage() {
  const listFn = useServerFn(listApplications);
  const updateFn = useServerFn(updateApplication);
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin.applications", page, status],
    queryFn: () => listFn({ data: { page, pageSize: 25, status: (status || undefined) as never } }),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Applications</h1>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="rounded border px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {APPLICATION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="rounded-lg border bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2 text-left">App ID</th>
              <th className="px-3 py-2 text-left">Lead</th>
              <th className="px-3 py-2 text-left">Customer</th>
              <th className="px-3 py-2 text-left">Service</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={6} className="px-3 py-6 text-center text-slate-500">Loading…</td></tr>}
            {data?.rows.map((r) => {
              const lead = r.leads as { lead_code?: string; name?: string; email?: string; service?: string } | null;
              return (
                <tr key={r.id} className="border-t hover:bg-slate-50">
                  <td className="px-3 py-2 font-mono text-xs">{r.application_code}</td>
                  <td className="px-3 py-2 font-mono text-xs">
                    <Link to="/admin/leads/$leadId" params={{ leadId: r.lead_id }} className="text-blue-700 hover:underline">
                      {lead?.lead_code ?? r.lead_id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-xs">{lead?.name}</td>
                  <td className="px-3 py-2 text-xs">{lead?.service}</td>
                  <td className="px-3 py-2">
                    <select
                      value={r.application_status}
                      onChange={async (e) => {
                        await updateFn({ data: { id: r.id, application_status: e.target.value as never } });
                        await qc.invalidateQueries({ queryKey: ["admin.applications"] });
                      }}
                      className="rounded border px-2 py-1 text-xs"
                    >
                      {APPLICATION_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-500">{new Date(r.created_at).toLocaleString("en-IN")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center text-sm">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded border px-3 py-1 disabled:opacity-40">Prev</button>
        <div>Page {page}</div>
        <button disabled={!data || data.rows.length < 25} onClick={() => setPage(page + 1)} className="rounded border px-3 py-1 disabled:opacity-40">Next</button>
      </div>
    </div>
  );
}
