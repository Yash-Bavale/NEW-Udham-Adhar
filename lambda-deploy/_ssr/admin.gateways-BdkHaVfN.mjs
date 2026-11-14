import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { j as useServerFn } from "./router-QgJicixe.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { l as listGateways, u as updateGateway, a as uploadGatewayLogo, c as checkCcavenueCredentials, b as listCashfreeAccounts, s as saveCashfreeAccount, d as setCashfreeAccountActive, e as listWebsiteGateways, f as setWebsiteGateway, g as setWebsiteCashfreeAccount, h as setWebsitePaymentsEnabled } from "./gateways.functions-CnMuOyBZ.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/cookie-es.mjs";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "./constants-CKRzJJF_.mjs";
import "./createSsrRpc-BO-AEXHh.mjs";
import "./server-BFjd5iLF.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./client.functions-WMvtjq1i.mjs";
import "./customer-access-core-Bd_9lLsD.mjs";
import "./brand-DLB0j9eh.mjs";
import "../_libs/tanstack__zod-adapter.mjs";
import "../_libs/zod.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "./datetime-DvkGwlJs.mjs";
import "./orders-filter-CXWoZisU.mjs";
import "./computeOrderStage-D7ejTUnj.mjs";
import "./consultation-asWR5IET.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./roles-CFhgFhhh.mjs";
import "./permissions.functions-DO0h7DgB.mjs";
import "./client-BX5UfqqR.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/lovable.dev__webhooks-js.mjs";
import "../_libs/lovable.dev__email-js.mjs";
import "./registry-DV_lUXjY.mjs";
import "../_libs/react-email__html.mjs";
import "../_libs/react-email__head.mjs";
import "../_libs/react-email__preview.mjs";
import "../_libs/react-email__body.mjs";
import "../_libs/react-email__container.mjs";
import "../_libs/react-email__heading.mjs";
import "../_libs/react-email__text.mjs";
import "../_libs/react-email__section.mjs";
import "../_libs/react-email__button.mjs";
import "../_libs/react-email__hr.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/date-fns.mjs";
import "../_libs/react-day-picker.mjs";
import "../_libs/date-fns__tz.mjs";
const EMPTY = { label: "", accountKey: "", clientId: "", clientSecret: "", mode: "production" };
function MerchantAccountsCard() {
  const listFn = useServerFn(listCashfreeAccounts);
  const saveFn = useServerFn(saveCashfreeAccount);
  const activeFn = useServerFn(setCashfreeAccountActive);
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["admin.cashfree-accounts"], queryFn: () => listFn() });
  const [form, setForm] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(false);
  const [msg, setMsg] = reactExports.useState(null);
  const refresh = async () => {
    await qc.invalidateQueries({ queryKey: ["admin.cashfree-accounts"] });
    await qc.invalidateQueries({ queryKey: ["admin.website-gateways"] });
  };
  async function submit() {
    if (!form) return;
    setSaving(true);
    setMsg(null);
    try {
      const res = await saveFn({ data: { ...form, accountKey: form.accountId ? void 0 : form.accountKey } });
      setMsg({ ok: res.ok, text: res.message });
      if (res.ok) {
        setForm(null);
        await refresh();
      }
    } catch (e) {
      setMsg({ ok: false, text: e.message });
    } finally {
      setForm((f) => f ? { ...f, clientSecret: "" } : f);
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Cashfree merchant accounts (MIDs)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Add each Cashfree account's keys once. Keys are checked with Cashfree, stored encrypted, and never shown again." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        setForm({ ...EMPTY });
        setMsg(null);
      }, className: "rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground", children: "+ Add merchant account" })
    ] }),
    msg ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm ${msg.ok ? "text-primary" : "text-destructive"}`, children: msg.text }) : null,
    form ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 rounded-md border bg-card p-4 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs space-y-1", children: [
        "Account name",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "w-full rounded border bg-background px-2 py-1.5 text-sm",
            value: form.label,
            placeholder: "e.g. GST website MID",
            onChange: (e) => setForm({ ...form, label: e.target.value })
          }
        )
      ] }),
      !form.accountId ? /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs space-y-1", children: [
        "Short code",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "w-full rounded border bg-background px-2 py-1.5 font-mono text-sm uppercase",
            value: form.accountKey,
            placeholder: "e.g. GST_MID",
            onChange: (e) => setForm({ ...form, accountKey: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, "") })
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs space-y-1", children: [
        "App ID (Client ID)",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "w-full rounded border bg-background px-2 py-1.5 font-mono text-sm",
            autoComplete: "off",
            value: form.clientId,
            onChange: (e) => setForm({ ...form, clientId: e.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs space-y-1", children: [
        "Secret Key",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "password",
            className: "w-full rounded border bg-background px-2 py-1.5 font-mono text-sm",
            autoComplete: "new-password",
            value: form.clientSecret,
            onChange: (e) => setForm({ ...form, clientSecret: e.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs space-y-1", children: [
        "Mode",
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            className: "w-full rounded border bg-background px-2 py-1.5 text-sm",
            value: form.mode,
            onChange: (e) => setForm({ ...form, mode: e.target.value }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "production", children: "Live" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "sandbox", children: "Test (sandbox)" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            disabled: saving || !form.label || !form.clientId || !form.clientSecret || !form.accountId && !form.accountKey,
            onClick: submit,
            className: "rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-40",
            children: saving ? "Checking with Cashfree…" : "Test & save"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setForm(null), className: "rounded border px-3 py-1.5 text-xs", children: "Cancel" })
      ] })
    ] }) : null,
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading accounts…" }) : null,
    error ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: "Could not load merchant accounts." }) : null,
    data ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-md border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted text-left text-xs uppercase text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Keys" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Mode" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Websites" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: data.accounts.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: a.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs text-muted-foreground", children: a.key })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-xs", children: a.credentials === "global" ? "Main project keys" : a.credentials === "saved" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: a.clientIdHint }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "Missing" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-xs", children: a.mode === "production" ? "Live" : a.mode === "sandbox" ? "Test" : a.isLegacy ? "Live" : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-xs", children: a.websites }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: a.isActive,
              disabled: a.isLegacy,
              onChange: async (e) => {
                try {
                  await activeFn({ data: { accountId: a.id, isActive: e.target.checked } });
                  await refresh();
                } catch (er) {
                  setMsg({ ok: false, text: er.message });
                }
              }
            }
          ),
          a.isActive ? "Active" : "Off"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right", children: !a.isLegacy ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "rounded border px-2 py-1 text-xs", onClick: () => {
          setForm({ accountId: a.id, label: a.label, accountKey: a.key, clientId: "", clientSecret: "", mode: a.mode ?? "production" });
          setMsg(null);
        }, children: a.credentials === "saved" ? "Replace keys" : "Add keys" }) : null })
      ] }, a.id)) })
    ] }) }) : null
  ] });
}
function GatewaysPage() {
  const listFn = useServerFn(listGateways);
  const updFn = useServerFn(updateGateway);
  const uploadFn = useServerFn(uploadGatewayLogo);
  const ccavCheckFn = useServerFn(checkCcavenueCredentials);
  const [ccavChecking, setCcavChecking] = reactExports.useState(false);
  const [ccavResult, setCcavResult] = reactExports.useState(null);
  const qc = useQueryClient();
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin.gateways"],
    queryFn: () => listFn()
  });
  const [busy, setBusy] = reactExports.useState(null);
  const [msg, setMsg] = reactExports.useState(null);
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-slate-500", children: "Loading…" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold", children: "Payment Gateways" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 mt-1", children: "Toggle gateways, upload custom gateway logos, and set default gateway priority." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "How CCAvenue callbacks are verified" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1", children: "CCAvenue's standard checkout does not sign callbacks with HMAC. Instead we decrypt CCAvenue's encrypted response with the working key — only someone holding the working key can produce a valid response, so a forged callback can't mark an order paid. Checkout runs entirely from the website domain and needs no IP whitelisting. The Order Status API is used only as an extra re-check for ambiguous results (awaited / amount mismatch) and for admin refunds; it is optional and its absence does not block payments. PayU webhooks remain fully signature-verified." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
          setCcavChecking(true);
          setCcavResult(null);
          try {
            setCcavResult(await ccavCheckFn({}));
          } catch (e) {
            setCcavResult({
              ok: false,
              message: e.message
            });
          } finally {
            setCcavChecking(false);
          }
        }, disabled: ccavChecking, className: "rounded bg-amber-900 text-white px-3 py-1 text-xs disabled:opacity-40", children: ccavChecking ? "Checking…" : "Test CCAvenue credentials" }),
        ccavResult && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs ${ccavResult.ok ? "text-emerald-700" : "text-red-700"}`, children: ccavResult.message })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-xs", children: [
        "Response & cancel URL to configure in the CCAvenue dashboard:",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono", children: "https://udyamadhar.in/api/public/webhooks/ccavenue" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MerchantAccountsCard, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(WebsiteGatewaysCard, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold pt-2", children: "All websites (master switch)" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-md border bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-left text-xs uppercase text-slate-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Gateway Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Gateway Logo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 w-28 text-center", children: "Default" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 w-24", children: "Priority" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 w-28", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 w-28" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        (data?.rows ?? []).map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(GatewayRow, { row: g, busy: busy === g.id, onUploadLogo: async (file) => {
          setBusy(g.id);
          setMsg(null);
          try {
            const reader = new FileReader();
            const base64Promise = new Promise((resolve, reject) => {
              reader.onload = () => {
                const res2 = reader.result;
                const b64 = res2.split(",")[1] || res2;
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
                mimeType: file.type || "image/png"
              }
            });
            await qc.invalidateQueries({
              queryKey: ["admin.gateways"]
            });
            setMsg(`Uploaded logo for ${g.display_name}.`);
            return res.logoUrl;
          } catch (e) {
            setMsg(e.message);
            return null;
          } finally {
            setBusy(null);
          }
        }, onSave: async (patch) => {
          setBusy(g.id);
          setMsg(null);
          try {
            await updFn({
              data: {
                id: g.id,
                ...patch
              }
            });
            await qc.invalidateQueries({
              queryKey: ["admin.gateways"]
            });
            setMsg(`Saved ${patch.display_name || g.display_name}.`);
          } catch (e) {
            setMsg(e.message);
          } finally {
            setBusy(null);
          }
        } }, g.id)),
        (data?.rows ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "p-4 text-center text-slate-400", children: "No gateways configured." }) })
      ] })
    ] }) }),
    msg && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-600 font-medium", children: msg })
  ] });
}
function GatewayRow({
  row,
  busy,
  onSave,
  onUploadLogo
}) {
  const curConfig = row.config || {};
  const [displayName, setDisplayName] = reactExports.useState(row.display_name);
  const [logoUrl, setLogoUrl] = reactExports.useState(curConfig.logo_url || "");
  const [isDefault, setIsDefault] = reactExports.useState(Boolean(curConfig.is_default));
  const [enabled, setEnabled] = reactExports.useState(row.is_enabled);
  const [priority, setPriority] = reactExports.useState(row.priority);
  const [uploading, setUploading] = reactExports.useState(false);
  const dirty = displayName !== row.display_name || logoUrl !== (curConfig.logo_url || "") || isDefault !== Boolean(curConfig.is_default) || enabled !== row.is_enabled || priority !== row.priority;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: displayName, onChange: (e) => setDisplayName(e.target.value), className: "w-full font-medium text-slate-900 border border-slate-300 rounded px-2.5 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900", placeholder: "Display Name" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-400 font-mono mt-1 px-0.5", children: [
        "Code: ",
        row.name
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      logoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logoUrl, alt: displayName, className: "h-8 w-auto max-w-24 object-contain rounded shrink-0 border bg-white p-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-16 rounded border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400 shrink-0", children: "No logo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "cursor-pointer rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs px-2.5 py-1.5 font-medium transition-colors inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: uploading ? "Uploading…" : "Upload Logo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", className: "hidden", disabled: uploading || busy, onChange: async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setUploading(true);
            try {
              const newUrl = await onUploadLogo(file);
              if (newUrl) setLogoUrl(newUrl);
            } finally {
              setUploading(false);
            }
          } })
        ] }),
        logoUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setLogoUrl(""), className: "text-xs text-rose-600 hover:underline", children: "Remove" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-1 cursor-pointer", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: isDefault, onChange: (e) => setIsDefault(e.target.checked), className: "rounded text-brand-navy focus:ring-brand-navy" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2 py-0.5 rounded font-semibold ${isDefault ? "bg-amber-100 text-amber-900 border border-amber-300" : "text-slate-400"}`, children: isDefault ? "★ Default" : "Set Default" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 0, max: 999, value: priority, onChange: (e) => setPriority(Number(e.target.value)), className: "w-16 rounded border border-slate-300 px-2 py-1 text-sm font-mono text-center" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-2 cursor-pointer", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: enabled, onChange: (e) => setEnabled(e.target.checked) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2 py-0.5 rounded font-medium ${enabled ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`, children: enabled ? "Enabled" : "Disabled" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: !dirty || busy, onClick: () => onSave({
      display_name: displayName,
      logo_url: logoUrl || null,
      is_default: isDefault,
      is_enabled: enabled,
      priority
    }), className: "rounded bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 text-xs font-semibold disabled:opacity-40 transition-colors", children: busy ? "Saving…" : "Save Changes" }) })
  ] });
}
const SITE_GATEWAYS = [{
  code: "cashfree",
  label: "Cashfree"
}, {
  code: "payu",
  label: "PayU"
}, {
  code: "ccavenue",
  label: "CCAvenue"
}];
function WebsiteGatewaysCard() {
  const listFn = useServerFn(listWebsiteGateways);
  const setFn = useServerFn(setWebsiteGateway);
  const linkFn = useServerFn(setWebsiteCashfreeAccount);
  const payFn = useServerFn(setWebsitePaymentsEnabled);
  const acctFn = useServerFn(listCashfreeAccounts);
  const qc = useQueryClient();
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ["admin.website-gateways"],
    queryFn: () => listFn()
  });
  const {
    data: accts
  } = useQuery({
    queryKey: ["admin.cashfree-accounts"],
    queryFn: () => acctFn()
  });
  const [busy, setBusy] = reactExports.useState(null);
  const [err, setErr] = reactExports.useState(null);
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Loading website payment options…" });
  if (error || !data) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-destructive", children: "Could not load website payment options." });
  const globalOn = (g) => data.globals.find((x) => x.name === g)?.is_enabled === true;
  const rule = (w, g) => data.rules.find((r) => r.website_id === w && r.gateway_name === g);
  const enabled = (w, g) => globalOn(g) && (rule(w, g)?.is_enabled ?? true);
  const siteDefault = (w) => {
    const d = data.rules.find((r) => r.website_id === w && r.is_default && r.is_enabled && globalOn(r.gateway_name));
    return d?.gateway_name ?? null;
  };
  async function save(websiteId, gateway, isEnabled, isDefault) {
    setBusy(`${websiteId}:${gateway}`);
    setErr(null);
    try {
      await setFn({
        data: {
          websiteId,
          gateway,
          isEnabled,
          isDefault
        }
      });
      await qc.invalidateQueries({
        queryKey: ["admin.website-gateways"]
      });
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(null);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Payment options by website" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Choose which payment options customers of each website see, and which one is pre-selected. A gateway switched off in the master list below stays off on every website." })
    ] }),
    err ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: err }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-md border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted text-left text-xs uppercase text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Website" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Taking payments" }),
        SITE_GATEWAYS.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("th", { className: "p-3", children: [
          g.label,
          globalOn(g.code) ? "" : " (off for all)"
        ] }, g.code)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Cashfree account" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: data.websites.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t align-top", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3 font-medium", children: [
          w.name,
          w.isPrimary ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-xs text-muted-foreground", children: "Primary" }) : null,
          !w.isActive ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-xs text-muted-foreground", children: "Inactive" }) : null
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", "aria-label": `Take payments on ${w.name}`, checked: w.paymentsEnabled, disabled: busy === `${w.id}:pay`, onChange: async (e) => {
            setBusy(`${w.id}:pay`);
            setErr(null);
            try {
              await payFn({
                data: {
                  websiteId: w.id,
                  enabled: e.target.checked
                }
              });
              await qc.invalidateQueries({
                queryKey: ["admin.website-gateways"]
              });
            } catch (er) {
              setErr(er.message);
            } finally {
              setBusy(null);
            }
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: w.paymentsEnabled ? "On" : "Off — timer keeps loading" })
        ] }) }),
        SITE_GATEWAYS.map((g) => {
          const on = enabled(w.id, g.code);
          const isDef = siteDefault(w.id) === g.code;
          const key = `${w.id}:${g.code}`;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3 space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", "aria-label": `${g.label} on ${w.name}`, checked: on, disabled: !globalOn(g.code) || busy === key, onChange: (e) => save(w.id, g.code, e.target.checked, e.target.checked ? isDef : false) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: on ? "Shown" : "Hidden" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "radio", name: `default-${w.id}`, "aria-label": `${g.label} default on ${w.name}`, checked: isDef, disabled: !on || busy === key, onChange: () => save(w.id, g.code, true, true) }),
              "Pre-selected"
            ] })
          ] }, g.code);
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3 text-xs space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { "aria-label": `Cashfree account for ${w.name}`, className: "w-full rounded border bg-background px-2 py-1 text-xs", value: w.cashfreeAccountId ?? "", disabled: busy === `${w.id}:acct`, onChange: async (e) => {
            if (!e.target.value) return;
            setBusy(`${w.id}:acct`);
            setErr(null);
            try {
              await linkFn({
                data: {
                  websiteId: w.id,
                  accountId: e.target.value
                }
              });
              await qc.invalidateQueries({
                queryKey: ["admin.website-gateways"]
              });
              await qc.invalidateQueries({
                queryKey: ["admin.cashfree-accounts"]
              });
            } catch (er) {
              setErr(er.message);
            } finally {
              setBusy(null);
            }
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", disabled: true, children: "Choose account…" }),
            (accts?.accounts ?? []).filter((a) => a.isActive && a.credentials !== "missing" || a.id === w.cashfreeAccountId).map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: a.id, children: a.label }, a.id))
          ] }),
          !w.cashfreeAccount ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "Not linked — Cashfree checkout blocked" }) : null
        ] })
      ] }, w.id)) })
    ] }) })
  ] });
}
export {
  GatewaysPage as component
};
