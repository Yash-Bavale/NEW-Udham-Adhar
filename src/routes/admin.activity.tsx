import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listActivityLogs } from "@/lib/crm/dashboard.functions";

export const Route = createFileRoute("/admin/activity")({ component: ActivityPage });

function ActivityPage() {
  const fn = useServerFn(listActivityLogs);
  const { data, isLoading } = useQuery({ queryKey: ["admin.activity"], queryFn: () => fn() });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Activity Log</h1>
      <div className="rounded-lg border bg-white divide-y">
        {isLoading && <div className="px-4 py-6 text-center text-sm text-slate-500">Loading…</div>}
        {data?.rows.map((a) => (
          <div key={a.id} className="px-4 py-2 text-sm flex gap-4">
            <span className="text-xs text-slate-500 w-44 shrink-0">{new Date(a.created_at).toLocaleString("en-IN")}</span>
            <span className="text-xs uppercase text-slate-500 w-40 shrink-0">{a.activity_type}</span>
            <span className="flex-1">{a.activity_description}</span>
            {a.lead_id && (
              <Link to="/admin/leads/$leadId" params={{ leadId: a.lead_id }} className="text-xs text-blue-700 hover:underline">view</Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
