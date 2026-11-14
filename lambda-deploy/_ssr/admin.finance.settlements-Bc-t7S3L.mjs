import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { j as useServerFn } from "./router-QgJicixe.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { o as object, n as number, s as string, _ as _enum } from "../_libs/zod.mjs";
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
import "./client.functions-WMvtjq1i.mjs";
import "./customer-access-core-Bd_9lLsD.mjs";
import "./brand-DLB0j9eh.mjs";
import "../_libs/tanstack__zod-adapter.mjs";
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
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
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
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const importSettlementCsv = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  gateway: _enum(["payu", "razorpay"]),
  csvText: string().min(10).max(5e6)
}).parse(i)).handler(createSsrRpc("aa29de67b1f16df41ee45a2473cf1af9dade105a78c24f90e6ce43cb50c2977b"));
const listSettlements = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  gateway: string().optional(),
  limit: number().min(1).max(500).default(100)
}).parse(i)).handler(createSsrRpc("d2b513abb725553d7a81750fc3992405be3425757125bf872f711fd4cd389540"));
const getUnreconciledPayments = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("850ac66cc0534b9c4d18a1117e6254021411713aa1646a9e13b28779dd069bba"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leadId: string().uuid()
}).parse(i)).handler(createSsrRpc("821bda134b97d86f0ee4b1f310a659bbea8217187be0096c896d4a1871dfd5c8"));
function SettlementsPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listSettlements);
  const importFn = useServerFn(importSettlementCsv);
  const unrecFn = useServerFn(getUnreconciledPayments);
  const [gateway, setGateway] = reactExports.useState("payu");
  const [csvText, setCsvText] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const [msg, setMsg] = reactExports.useState(null);
  const {
    data
  } = useQuery({
    queryKey: ["settlements"],
    queryFn: () => listFn({
      data: {
        limit: 100
      }
    })
  });
  const {
    data: unrec
  } = useQuery({
    queryKey: ["settlements.unrec"],
    queryFn: () => unrecFn()
  });
  const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold", children: "Settlements" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-white p-4 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: "Import settlement CSV" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: gateway, onChange: (e) => setGateway(e.target.value), className: "rounded border px-3 py-1.5 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "payu", children: "PayU" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "razorpay", children: "Razorpay" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: ".csv", onChange: async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          setCsvText(await f.text());
        }, className: "text-sm" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: busy || !csvText, onClick: async () => {
          setBusy(true);
          setMsg(null);
          try {
            const r = await importFn({
              data: {
                gateway,
                csvText
              }
            });
            setMsg(`Imported ${r.settlementsCreated} settlements, ${r.linksCreated} links, ${r.unmatched} unmatched.`);
            await qc.invalidateQueries({
              queryKey: ["settlements"]
            });
            await qc.invalidateQueries({
              queryKey: ["settlements.unrec"]
            });
          } catch (err) {
            setMsg(err.message);
          }
          setBusy(false);
        }, className: "rounded bg-slate-900 text-white px-3 py-1.5 text-sm disabled:opacity-40", children: "Import" })
      ] }),
      msg && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-600", children: msg })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-2 border-b text-sm font-semibold", children: "Recent settlements" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs text-slate-500 uppercase", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-2", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left", children: "Gateway" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left", children: "Settlement ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right", children: "Gross" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right", children: "Fees" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right", children: "Net" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right", children: "#" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          (data?.rows ?? []).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2", children: new Date(s.settled_at).toLocaleDateString("en-IN") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "uppercase", children: s.gateway }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "font-mono text-xs", children: s.settlement_id }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-right", children: fmt(s.gross) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-right", children: fmt(s.fees + s.tax_on_fees) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-right font-medium", children: fmt(s.net) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-right", children: s.payment_count })
          ] }, s.id)),
          (!data || data.rows.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "p-3 text-center text-slate-500", children: "No settlements imported yet." }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-amber-50 border-amber-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 border-b border-amber-200 text-sm font-semibold", children: [
        "Unreconciled payments (",
        unrec?.rows.length ?? 0,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("table", { className: "w-full text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        (unrec?.rows ?? []).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-amber-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 font-mono text-xs", children: p.transaction_id }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "uppercase", children: p.gateway_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-right p-2", children: fmt(Number(p.amount)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-right p-2 text-xs text-slate-500", children: p.payment_date ? new Date(p.payment_date).toLocaleDateString("en-IN") : "—" })
        ] }, p.id)),
        (!unrec || unrec.rows.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-center text-slate-500", children: "All paid payments older than 7 days are reconciled." }) })
      ] }) })
    ] })
  ] });
}
export {
  SettlementsPage as component
};
