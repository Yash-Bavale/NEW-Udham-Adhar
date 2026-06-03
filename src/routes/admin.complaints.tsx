import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { SectionCard, TableSkeleton, StatusBadge } from "@/components/admin/ui";
import { listComplaints, updateComplaintStatus } from "@/lib/crm/complaints.functions";

export const Route = createFileRoute("/admin/complaints")({ component: ComplaintsPage });

const STATUSES = ["pending", "in_progress", "resolved", "closed"] as const;
type Status = (typeof STATUSES)[number];

function ComplaintsPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listComplaints);
  const updateFn = useServerFn(updateComplaintStatus);
  const { data, isLoading } = useQuery({
    queryKey: ["admin.complaints"],
    queryFn: () => listFn(),
  });
  const [busyId, setBusyId] = useState<string | null>(null);

  async function setStatus(id: string, status: Status) {
    setBusyId(id);
    try {
      await updateFn({ data: { id, status } });
      await qc.invalidateQueries({ queryKey: ["admin.complaints"] });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Complaints</h1>
        <p className="text-sm" style={{ color: "var(--admin-fg-muted)" }}>
          Grievances submitted via the complaint form.
        </p>
      </div>

      <SectionCard>
        <div className="p-5">
          {isLoading ? (
            <TableSkeleton rows={6} cols={6} />
          ) : (data?.rows ?? []).length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: "var(--admin-fg-muted)" }}>
              No complaints yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b" style={{ borderColor: "var(--admin-border)" }}>
                    <th className="py-2 pr-3 font-medium">Complaint #</th>
                    <th className="py-2 pr-3 font-medium">Submitted</th>
                    <th className="py-2 pr-3 font-medium">Name</th>
                    <th className="py-2 pr-3 font-medium">Contact</th>
                    <th className="py-2 pr-3 font-medium">Message</th>
                    <th className="py-2 pr-3 font-medium">Status</th>
                    <th className="py-2 pr-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data!.rows.map((c) => (
                    <tr key={c.id} className="border-b align-top" style={{ borderColor: "var(--admin-border)" }}>
                      <td className="py-3 pr-3 font-mono text-xs">{c.complaint_number ?? "—"}</td>
                      <td className="py-3 pr-3 text-xs whitespace-nowrap">
                        {new Date(c.submitted_at ?? c.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 pr-3">{c.lead?.name ?? "—"}</td>
                      <td className="py-3 pr-3 text-xs">
                        <div>{c.lead?.email ?? "—"}</div>
                        <div style={{ color: "var(--admin-fg-muted)" }}>
                          {c.lead?.mobile ? `+91 ${c.lead.mobile}` : ""}
                        </div>
                      </td>
                      <td className="py-3 pr-3 max-w-md">
                        <div className="text-xs whitespace-pre-wrap break-words line-clamp-4">
                          {c.notes ?? "—"}
                        </div>
                      </td>
                      <td className="py-3 pr-3">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="py-3 pr-3">
                        <select
                          value={c.status}
                          disabled={busyId === c.id}
                          onChange={(e) => setStatus(c.id, e.target.value as Status)}
                          className="text-xs rounded-md border px-2 py-1 bg-transparent"
                          style={{ borderColor: "var(--admin-border)" }}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
