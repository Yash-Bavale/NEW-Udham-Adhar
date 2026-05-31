import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { listLeads } from "@/lib/crm/leads-admin.functions";
import { LEAD_STATUSES } from "@/lib/crm/types";

export const Route = createFileRoute("/admin/leads")({ component: LeadsPage });

function LeadsPage() {
  const fn = useServerFn(listLeads);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin.leads", page, search, status],
    queryFn: () =>
      fn({
        data: {
          page,
          pageSize: 25,
          search: search || undefined,
          status: (status || undefined) as never,
        },
      }),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Leads</h1>
        <div className="text-sm text-slate-500">{data?.total ?? 0} total</div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search code, name, email, mobile…"
          className="rounded border px-3 py-2 text-sm w-72"
        />
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="rounded border px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="rounded-lg border bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2 text-left">Lead ID</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Email / Mobile</th>
              <th className="px-3 py-2 text-left">Service</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={6} className="px-3 py-6 text-center text-slate-500">Loading…</td></tr>}
            {data?.rows.map((l) => (
              <tr key={l.id} className="border-t hover:bg-slate-50">
                <td className="px-3 py-2 font-mono text-xs">
                  <Link to="/admin/leads/$leadId" params={{ leadId: l.id }} className="text-blue-700 hover:underline">
                    {l.lead_code}
                  </Link>
                </td>
                <td className="px-3 py-2">{l.name}</td>
                <td className="px-3 py-2 text-xs">
                  <div>{l.email}</div>
                  <div className="text-slate-500">{l.mobile}</div>
                </td>
                <td className="px-3 py-2 text-xs max-w-[220px] truncate">{l.service}</td>
                <td className="px-3 py-2"><span className="rounded bg-slate-100 px-2 py-0.5 text-xs">{l.status}</span></td>
                <td className="px-3 py-2 text-xs text-slate-500">{new Date(l.created_at).toLocaleString("en-IN")}</td>
              </tr>
            ))}
            {data && data.rows.length === 0 && (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-slate-500">No leads found.</td></tr>
            )}
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
