import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { listGateways, updateGateway, checkCcavenueCredentials } from "@/lib/payments/gateways.functions";

export const Route = createFileRoute("/admin/gateways")({ component: GatewaysPage });

function GatewaysPage() {
  const listFn = useServerFn(listGateways);
  const updFn = useServerFn(updateGateway);
  const ccavCheckFn = useServerFn(checkCcavenueCredentials);
  const [ccavChecking, setCcavChecking] = useState(false);
  const [ccavResult, setCcavResult] = useState<{ ok: boolean; message: string } | null>(null);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin.gateways"], queryFn: () => listFn() });
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  if (isLoading) return <div className="text-sm text-slate-500">Loading…</div>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Payment Gateways</h1>
        <p className="text-sm text-slate-500 mt-1">
          Toggle gateways and set priority (lower number shows first to customers).
          Only PayU is wired end-to-end today; others render as "coming soon" on the customer summary page until you implement them.
        </p>
      </div>

      <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <div className="font-semibold">CCAvenue webhooks are not HMAC-signed</div>
        <p className="mt-1">
          CCAvenue's standard checkout does not sign webhook callbacks with HMAC — verification relies on the
          encrypted response from CCAvenue plus our own order lookup. This is an architectural limitation of the
          provider, not a configuration bug. Keep CCAvenue disabled unless you've reviewed the webhook handler
          and accept this tradeoff. PayU webhooks are fully signature-verified.
        </p>
      </div>


      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="p-3">Gateway</th>
              <th className="p-3">Webhook secret</th>
              <th className="p-3 w-32">Priority</th>
              <th className="p-3 w-28">Enabled</th>
              <th className="p-3 w-32">Updated</th>
              <th className="p-3 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {(data?.rows ?? []).map((g) => (
              <GatewayRow
                key={g.id}
                row={g}
                busy={busy === g.id}
                onSave={async (patch) => {
                  setBusy(g.id);
                  setMsg(null);
                  try {
                    await updFn({ data: { id: g.id, ...patch } });
                    await qc.invalidateQueries({ queryKey: ["admin.gateways"] });
                    setMsg(`Saved ${g.display_name}.`);
                  } catch (e) {
                    setMsg((e as Error).message);
                  } finally {
                    setBusy(null);
                  }
                }}
              />
            ))}
            {(data?.rows ?? []).length === 0 && (
              <tr><td colSpan={6} className="p-4 text-center text-slate-400">No gateways configured.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {msg && <p className="text-xs text-slate-600">{msg}</p>}
    </div>
  );
}

type Row = { id: string; name: string; display_name: string; is_enabled: boolean; priority: number; webhook_secret_name: string | null; updated_at: string };

function GatewayRow({ row, busy, onSave }: { row: Row; busy: boolean; onSave: (p: { is_enabled: boolean; priority: number }) => Promise<void> }) {
  const [enabled, setEnabled] = useState(row.is_enabled);
  const [priority, setPriority] = useState(row.priority);
  const dirty = enabled !== row.is_enabled || priority !== row.priority;
  return (
    <tr className="border-t">
      <td className="p-3">
        <div className="font-medium">{row.display_name}</div>
        <div className="text-xs text-slate-500 font-mono">{row.name}</div>
      </td>
      <td className="p-3 text-xs font-mono text-slate-500">{row.webhook_secret_name ?? "—"}</td>
      <td className="p-3">
        <input
          type="number"
          min={0}
          max={999}
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
          className="w-20 rounded border border-slate-300 px-2 py-1 text-sm"
        />
      </td>
      <td className="p-3">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
          <span className={`text-xs px-2 py-0.5 rounded ${enabled ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
            {enabled ? "Enabled" : "Disabled"}
          </span>
        </label>
      </td>
      <td className="p-3 text-xs text-slate-500">{new Date(row.updated_at).toLocaleString()}</td>
      <td className="p-3">
        <button
          disabled={!dirty || busy}
          onClick={() => onSave({ is_enabled: enabled, priority })}
          className="rounded bg-slate-900 text-white px-3 py-1 text-xs disabled:opacity-40"
        >
          {busy ? "Saving…" : "Save"}
        </button>
      </td>
    </tr>
  );
}
