import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { listGateways, updateGateway, checkCcavenueCredentials, uploadGatewayLogo } from "@/lib/payments/gateways.functions";

export const Route = createFileRoute("/admin/gateways")({ component: GatewaysPage });

function GatewaysPage() {
  const listFn = useServerFn(listGateways);
  const updFn = useServerFn(updateGateway);
  const uploadFn = useServerFn(uploadGatewayLogo);
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
          Toggle gateways, upload custom gateway logos, and set default gateway priority.
        </p>
      </div>

      <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <div className="font-semibold">How CCAvenue callbacks are verified</div>
        <p className="mt-1">
          CCAvenue's standard checkout does not sign callbacks with HMAC. Instead we decrypt CCAvenue's encrypted
          response with the working key — only someone holding the working key can produce a valid response, so a
          forged callback can't mark an order paid. Checkout runs entirely from the website domain and needs no IP
          whitelisting. The Order Status API is used only as an extra re-check for ambiguous results (awaited /
          amount mismatch) and for admin refunds; it is optional and its absence does not block payments. PayU
          webhooks remain fully signature-verified.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={async () => {
              setCcavChecking(true);
              setCcavResult(null);
              try {
                setCcavResult(await ccavCheckFn({}));
              } catch (e) {
                setCcavResult({ ok: false, message: (e as Error).message });
              } finally {
                setCcavChecking(false);
              }
            }}
            disabled={ccavChecking}
            className="rounded bg-amber-900 text-white px-3 py-1 text-xs disabled:opacity-40"
          >
            {ccavChecking ? "Checking…" : "Test CCAvenue credentials"}
          </button>
          {ccavResult && (
            <span className={`text-xs ${ccavResult.ok ? "text-emerald-700" : "text-red-700"}`}>
              {ccavResult.message}
            </span>
          )}
        </div>
        <p className="mt-2 text-xs">
          Response &amp; cancel URL to configure in the CCAvenue dashboard:{" "}
          <code className="font-mono">https://udyamadhar.in/api/public/webhooks/ccavenue</code>
        </p>
      </div>



      <div className="overflow-x-auto rounded-md border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="p-3">Gateway Name</th>
              <th className="p-3">Gateway Logo</th>
              <th className="p-3 w-28 text-center">Default</th>
              <th className="p-3 w-24">Priority</th>
              <th className="p-3 w-28">Status</th>
              <th className="p-3 w-28"></th>
            </tr>
          </thead>
          <tbody>
            {(data?.rows ?? []).map((g: any) => (
              <GatewayRow
                key={g.id}
                row={g}
                busy={busy === g.id}
                onUploadLogo={async (file) => {
                  setBusy(g.id);
                  setMsg(null);
                  try {
                    const reader = new FileReader();
                    const base64Promise = new Promise<string>((resolve, reject) => {
                      reader.onload = () => {
                        const res = reader.result as string;
                        const b64 = res.split(",")[1] || res;
                        resolve(b64);
                      };
                      reader.onerror = reject;
                    });
                    reader.readAsDataURL(file);
                    const fileBase64 = await base64Promise;
                    const res = await uploadFn({
                      data: {
                        id: g.id,
                        fileBase64,
                        fileName: file.name,
                        mimeType: file.type || "image/png",
                      },
                    });
                    await qc.invalidateQueries({ queryKey: ["admin.gateways"] });
                    setMsg(`Uploaded logo for ${g.display_name}.`);
                    return res.logoUrl;
                  } catch (e) {
                    setMsg((e as Error).message);
                    return null;
                  } finally {
                    setBusy(null);
                  }
                }}
                onSave={async (patch) => {
                  setBusy(g.id);
                  setMsg(null);
                  try {
                    await updFn({ data: { id: g.id, ...patch } });
                    await qc.invalidateQueries({ queryKey: ["admin.gateways"] });
                    setMsg(`Saved ${patch.display_name || g.display_name}.`);
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
      {msg && <p className="text-xs text-slate-600 font-medium">{msg}</p>}
    </div>
  );
}

type Row = {
  id: string;
  name: string;
  display_name: string;
  is_enabled: boolean;
  priority: number;
  config?: any;
  webhook_secret_name: string | null;
  updated_at: string;
};

function GatewayRow({
  row,
  busy,
  onSave,
  onUploadLogo,
}: {
  row: Row;
  busy: boolean;
  onSave: (p: { display_name: string; logo_url: string | null; is_default: boolean; is_enabled: boolean; priority: number }) => Promise<void>;
  onUploadLogo: (file: File) => Promise<string | null>;
}) {
  const curConfig = row.config || {};
  const [displayName, setDisplayName] = useState(row.display_name);
  const [logoUrl, setLogoUrl] = useState(curConfig.logo_url || "");
  const [isDefault, setIsDefault] = useState(Boolean(curConfig.is_default));
  const [enabled, setEnabled] = useState(row.is_enabled);
  const [priority, setPriority] = useState(row.priority);
  const [uploading, setUploading] = useState(false);

  const dirty =
    displayName !== row.display_name ||
    logoUrl !== (curConfig.logo_url || "") ||
    isDefault !== Boolean(curConfig.is_default) ||
    enabled !== row.is_enabled ||
    priority !== row.priority;

  return (
    <tr className="border-t">
      <td className="p-3">
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full font-medium text-slate-900 border border-slate-300 rounded px-2.5 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
          placeholder="Display Name"
        />
        <div className="text-xs text-slate-400 font-mono mt-1 px-0.5">Code: {row.name}</div>
      </td>
      <td className="p-3">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt={displayName} className="h-8 w-auto max-w-24 object-contain rounded shrink-0 border bg-white p-1" />
          ) : (
            <div className="h-8 w-16 rounded border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400 shrink-0">No logo</div>
          )}
          
          <div className="flex items-center gap-2">
            <label className="cursor-pointer rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs px-2.5 py-1.5 font-medium transition-colors inline-flex items-center gap-1.5">
              <span>{uploading ? "Uploading…" : "Upload Logo"}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading || busy}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploading(true);
                  try {
                    const newUrl = await onUploadLogo(file);
                    if (newUrl) setLogoUrl(newUrl);
                  } finally {
                    setUploading(false);
                  }
                }}
              />
            </label>

            {logoUrl && (
              <button
                type="button"
                onClick={() => setLogoUrl("")}
                className="text-xs text-rose-600 hover:underline"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </td>
      <td className="p-3 text-center">
        <label className="inline-flex items-center gap-1 cursor-pointer">
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            className="rounded text-brand-navy focus:ring-brand-navy"
          />
          <span className={`text-xs px-2 py-0.5 rounded font-semibold ${isDefault ? "bg-amber-100 text-amber-900 border border-amber-300" : "text-slate-400"}`}>
            {isDefault ? "★ Default" : "Set Default"}
          </span>
        </label>
      </td>
      <td className="p-3">
        <input
          type="number"
          min={0}
          max={999}
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
          className="w-16 rounded border border-slate-300 px-2 py-1 text-sm font-mono text-center"
        />
      </td>
      <td className="p-3">
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
          <span className={`text-xs px-2 py-0.5 rounded font-medium ${enabled ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
            {enabled ? "Enabled" : "Disabled"}
          </span>
        </label>
      </td>
      <td className="p-3">
        <button
          disabled={!dirty || busy}
          onClick={() => onSave({ display_name: displayName, logo_url: logoUrl || null, is_default: isDefault, is_enabled: enabled, priority })}
          className="rounded bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 text-xs font-semibold disabled:opacity-40 transition-colors"
        >
          {busy ? "Saving…" : "Save Changes"}
        </button>
      </td>
    </tr>
  );
}
