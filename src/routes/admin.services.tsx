import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { listServices, upsertService, deleteService } from "@/lib/crm/services-admin.functions";

export const Route = createFileRoute("/admin/services")({ component: ServicesPage });

type ServiceForm = {
  id?: string;
  service_code: string;
  service_name: string;
  description?: string | null;
  base_amount: number;
  gst_amount: number;
  total_amount: number;
  is_active: boolean;
  sort_order: number;
};

function emptyForm(): ServiceForm {
  return { service_code: "", service_name: "", base_amount: 0, gst_amount: 0, total_amount: 0, is_active: true, sort_order: 0 };
}

function ServicesPage() {
  const listFn = useServerFn(listServices);
  const upsertFn = useServerFn(upsertService);
  const delFn = useServerFn(deleteService);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin.services"], queryFn: () => listFn() });

  const [form, setForm] = useState<ServiceForm | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Services</h1>
        <button onClick={() => setForm(emptyForm())} className="rounded bg-slate-900 text-white px-3 py-1.5 text-sm">+ New Service</button>
      </div>

      {form && (
        <div className="rounded-lg border bg-white p-4 space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <Input label="Service code" value={form.service_code} onChange={(v) => setForm({ ...form, service_code: v })} />
            <Input label="Service name" value={form.service_name} onChange={(v) => setForm({ ...form, service_name: v })} />
            <Input label="Base (₹)" type="number" value={String(form.base_amount)} onChange={(v) => setForm({ ...form, base_amount: Number(v) })} />
            <Input label="GST (₹)" type="number" value={String(form.gst_amount)} onChange={(v) => setForm({ ...form, gst_amount: Number(v) })} />
            <Input label="Total (₹)" type="number" value={String(form.total_amount)} onChange={(v) => setForm({ ...form, total_amount: Number(v) })} />
            <Input label="Sort order" type="number" value={String(form.sort_order)} onChange={(v) => setForm({ ...form, sort_order: Number(v) })} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
              Active
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                await upsertFn({ data: form as never });
                await qc.invalidateQueries({ queryKey: ["admin.services"] });
                setForm(null);
              }}
              className="rounded bg-slate-900 text-white px-4 py-2 text-sm"
            >Save</button>
            <button onClick={() => setForm(null)} className="rounded border px-4 py-2 text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="rounded-lg border bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2 text-left">Code</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-right">Base</th>
              <th className="px-3 py-2 text-right">GST</th>
              <th className="px-3 py-2 text-right">Total</th>
              <th className="px-3 py-2">Active</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={7} className="px-3 py-6 text-center text-slate-500">Loading…</td></tr>}
            {data?.rows.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="px-3 py-2 font-mono text-xs">{s.service_code}</td>
                <td className="px-3 py-2">{s.service_name}</td>
                <td className="px-3 py-2 text-right">₹{Number(s.base_amount).toFixed(2)}</td>
                <td className="px-3 py-2 text-right">₹{Number(s.gst_amount).toFixed(2)}</td>
                <td className="px-3 py-2 text-right font-semibold">₹{Number(s.total_amount).toFixed(2)}</td>
                <td className="px-3 py-2 text-center">{s.is_active ? "✓" : "—"}</td>
                <td className="px-3 py-2 text-right">
                  <button onClick={() => setForm(s as ServiceForm)} className="text-blue-700 text-xs hover:underline mr-3">Edit</button>
                  <button
                    onClick={async () => {
                      if (!confirm("Delete this service?")) return;
                      await delFn({ data: { id: s.id } });
                      await qc.invalidateQueries({ queryKey: ["admin.services"] });
                    }}
                    className="text-red-700 text-xs hover:underline"
                  >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block text-sm">
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded border px-3 py-2" />
    </label>
  );
}
