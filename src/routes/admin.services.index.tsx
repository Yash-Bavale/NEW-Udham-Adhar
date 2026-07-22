import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { listServices, upsertService, deleteService } from "@/lib/crm/services-admin.functions";
import { listWebsiteTree } from "@/lib/crm/websites-admin.functions";
import { fromBase, fromTotal } from "@/lib/pricing/gst";

export const Route = createFileRoute("/admin/services/")({ component: ServicesPage });

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
  govt_portal_url?: string | null;
  website_id?: string;
  category_id?: string | null;
};

function emptyForm(): ServiceForm {
  return { service_code: "", service_name: "", base_amount: 0, gst_amount: 0, total_amount: 0, is_active: true, sort_order: 0, govt_portal_url: "", category_id: null };
}

function ServicesPage() {
  const listFn = useServerFn(listServices);
  const treeFn = useServerFn(listWebsiteTree);
  const upsertFn = useServerFn(upsertService);
  const delFn = useServerFn(deleteService);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin.services"], queryFn: () => listFn() });
  const { data: tree } = useQuery({ queryKey: ["admin.websites.tree"], queryFn: () => treeFn() });

  const [form, setForm] = useState<ServiceForm | null>(null);

  const websites = tree?.websites ?? [];
  const categories = tree?.categories ?? [];
  const websiteById = useMemo(() => Object.fromEntries(websites.map((w) => [w.id, w])), [websites]);
  const categoryById = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c])), [categories]);
  const categoriesForForm = useMemo(
    () => categories.filter((c) => c.website_id === form?.website_id),
    [categories, form?.website_id],
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Services</h1>
        <button onClick={() => setForm({ ...emptyForm(), website_id: websites[0]?.id })} className="rounded bg-slate-900 text-white px-3 py-1.5 text-sm">+ New Service</button>
      </div>

      {form && (
        <div className="rounded-lg border bg-white p-4 space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <Input label="Service code" value={form.service_code} onChange={(v) => setForm({ ...form, service_code: v })} />
            <Input label="Service name" value={form.service_name} onChange={(v) => setForm({ ...form, service_name: v })} />
            <Select
              label="Website"
              value={form.website_id ?? ""}
              onChange={(v) => setForm({ ...form, website_id: v || undefined, category_id: null })}
              options={[{ value: "", label: "— select —" }, ...websites.map((w) => ({ value: w.id, label: `${w.name} (${w.domain})` }))]}
            />
            <Select
              label="Category (optional)"
              value={form.category_id ?? ""}
              onChange={(v) => setForm({ ...form, category_id: v || null })}
              options={[{ value: "", label: "— none —" }, ...categoriesForForm.map((c) => ({ value: c.id, label: c.name }))]}
            />
            <Input
              label="Total (₹ inclusive of 18% GST)"
              type="number"
              value={String(form.total_amount)}
              onChange={(v) => {
                const { base, gst, total } = fromTotal(Number(v));
                setForm({ ...form, total_amount: total, base_amount: base, gst_amount: gst });
              }}
            />
            <Input
              label="Base (₹) — auto from total"
              type="number"
              value={String(form.base_amount)}
              onChange={(v) => {
                const { base, gst, total } = fromBase(Number(v));
                setForm({ ...form, base_amount: base, gst_amount: gst, total_amount: total });
              }}
            />
            <Input label="GST 18% (₹) — auto" type="number" value={String(form.gst_amount)} onChange={() => {}} />
            <Input label="Govt Portal URL" value={form.govt_portal_url ?? ""} onChange={(v) => setForm({ ...form, govt_portal_url: v })} />
            <Input label="Sort order" type="number" value={String(form.sort_order)} onChange={(v) => setForm({ ...form, sort_order: Number(v) })} />
            <label className="flex items-center gap-2 text-sm md:col-span-2">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
              Active
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                try {
                  await upsertFn({ data: form as never });
                  await qc.invalidateQueries({ queryKey: ["admin.services"] });
                  setForm(null);
                } catch (e) {
                  alert("Save failed: " + (e as Error).message);
                }
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
                <td className="px-3 py-2">
                  <div className="font-medium">{s.service_name}</div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1 text-[11px]">
                    {s.website_id && websiteById[s.website_id] && (
                      <span className="inline-flex items-center gap-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.5">
                        {websiteById[s.website_id].domain}
                      </span>
                    )}
                    {s.category_id && categoryById[s.category_id] && (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5">
                        {categoryById[s.category_id].name}
                      </span>
                    )}
                  </div>
                  {s.govt_portal_url && (
                    <a
                      href={s.govt_portal_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-0.5 mt-0.5"
                    >
                      <ExternalLink className="size-3" /> Govt Portal
                    </a>
                  )}
                </td>
                <td className="px-3 py-2 text-right">₹{Number(s.base_amount).toFixed(2)}</td>
                <td className="px-3 py-2 text-right">₹{Number(s.gst_amount).toFixed(2)}</td>
                <td className="px-3 py-2 text-right font-semibold">₹{Number(s.total_amount).toFixed(2)}</td>
                <td className="px-3 py-2 text-center">
                  <button
                    onClick={async () => {
                      try {
                        await upsertFn({ data: { ...(s as ServiceForm), is_active: !s.is_active } as never });
                        await qc.invalidateQueries({ queryKey: ["admin.services"] });
                      } catch (e) { alert((e as Error).message); }
                    }}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border ${s.is_active ? "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200" : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"}`}
                    title={s.is_active ? "Click to deactivate" : "Click to activate"}
                  >
                    <span className={`size-1.5 rounded-full ${s.is_active ? "bg-emerald-600" : "bg-slate-400"}`} />
                    {s.is_active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-3 py-2 text-right">
                  <Link
                    to="/admin/services/$serviceCode"
                    params={{ serviceCode: s.service_code }}
                    className="text-emerald-700 text-xs hover:underline mr-3"
                  >Configure</Link>
                  <Link
                    to="/admin/services/forms/$serviceCode"
                    params={{ serviceCode: s.service_code }}
                    className="text-indigo-700 text-xs hover:underline mr-3"
                  >Edit Form</Link>
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

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="block text-sm">
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded border px-3 py-2 bg-white">
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
