import { createFileRoute, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getGstReport, exportGstReportCsv, exportGstr1Csv } from "@/lib/finance/gst-report.functions";

export const Route = createFileRoute("/admin/finance/gst")({
  beforeLoad: async () => {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/admin-login" });
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .in("role", ["admin", "super_admin", "finance", "accounts"]);
    if (!data || data.length === 0) throw redirect({ to: "/admin/my-work" });
  },
  component: GstReportPage,
});

function GstReportPage() {
  const today = new Date();
  const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const [month, setMonth] = useState(defaultMonth);
  const getFn = useServerFn(getGstReport);
  const exportFn = useServerFn(exportGstReportCsv);
  const gstr1Fn = useServerFn(exportGstr1Csv);

  const { data, isLoading } = useQuery({
    queryKey: ["admin.gst", month],
    queryFn: () => getFn({ data: { month } }),
  });

  const fmt = (n: number) => `₹${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-semibold">GST Report</h1>
        <div className="flex gap-2 items-center">
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)}
            className="rounded border px-3 py-1.5 text-sm" />
          <button
            onClick={async () => {
              const res = await exportFn({ data: { month } });
              const blob = new Blob([res.csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url; a.download = res.filename; a.click();
              URL.revokeObjectURL(url);
            }}
            className="rounded bg-slate-900 text-white px-3 py-1.5 text-sm">Export CSV</button>
          <button
            onClick={async () => {
              const res = await gstr1Fn({ data: { month } });
              const blob = new Blob([res.csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url; a.download = res.filename; a.click();
              URL.revokeObjectURL(url);
            }}
            className="rounded border border-slate-900 px-3 py-1.5 text-sm">Export GSTR-1</button>
        </div>
      </div>

      {isLoading || !data ? (
        <div className="text-sm text-slate-500">Loading…</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <KPI label="Taxable" value={fmt(data.summary.taxable)} />
            <KPI label="CGST" value={fmt(data.summary.cgst)} />
            <KPI label="SGST" value={fmt(data.summary.sgst)} />
            <KPI label="IGST" value={fmt(data.summary.igst)} />
            <KPI label={`Total (${data.summary.count})`} value={fmt(data.summary.total)} />
          </div>

          <Card title="By place of supply">
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500 uppercase"><tr>
                <th className="text-left py-1">State</th><th className="text-right">#</th>
                <th className="text-right">Taxable</th><th className="text-right">CGST</th>
                <th className="text-right">SGST</th><th className="text-right">IGST</th>
                <th className="text-right">Total</th>
              </tr></thead>
              <tbody>
                {data.byState.map((s) => (
                  <tr key={s.state} className="border-t">
                    <td className="py-1">{s.state}</td>
                    <td className="text-right">{s.count}</td>
                    <td className="text-right">{fmt(s.taxable)}</td>
                    <td className="text-right">{fmt(s.cgst)}</td>
                    <td className="text-right">{fmt(s.sgst)}</td>
                    <td className="text-right">{fmt(s.igst)}</td>
                    <td className="text-right font-medium">{fmt(s.total)}</td>
                  </tr>
                ))}
                {data.byState.length === 0 && (
                  <tr><td colSpan={7} className="py-3 text-center text-slate-500">No invoices in this month.</td></tr>
                )}
              </tbody>
            </table>
          </Card>
        </>
      )}
    </div>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-white p-3">
      <div className="text-[11px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className="text-lg font-semibold mt-1">{value}</div>
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
