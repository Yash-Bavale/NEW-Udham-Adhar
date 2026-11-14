import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { j as useServerFn } from "./router-QgJicixe.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { o as object, s as string } from "../_libs/zod.mjs";
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
const getGstReport = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  month: string().regex(/^\d{4}-\d{2}$/),
  state: string().max(80).optional(),
  gateway: string().max(40).optional()
}).parse(i)).handler(createSsrRpc("06a45a72d8e83158e10e99579fe4e990d1c9aa730458601f5d8cff3fc2b5c637"));
const exportGstReportCsv = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  month: string().regex(/^\d{4}-\d{2}$/),
  state: string().max(80).optional(),
  gateway: string().max(40).optional()
}).parse(i)).handler(createSsrRpc("a75af8edf4ef9a2aca7af599d2fe09724a28cd4dd7bda495e06c9fc64872b336"));
const exportGstr1Csv = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  month: string().regex(/^\d{4}-\d{2}$/)
}).parse(i)).handler(createSsrRpc("6b667762696faef5360ae1fd608c648bbafbfebee95e02daed3d0bfe1170f95d"));
const exportGstr1RefundsCsv = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  month: string().regex(/^\d{4}-\d{2}$/)
}).parse(i)).handler(createSsrRpc("0dce889aa6e61c3af60ed70bfec07dc3821ea18a0b0c8a96a8fff0d00f92d239"));
const exportGstRefundReportCsv = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  month: string().regex(/^\d{4}-\d{2}$/),
  state: string().max(80).optional(),
  gateway: string().max(40).optional()
}).parse(i)).handler(createSsrRpc("24a4b844c8e03888a3f66f2d4cee5b97afc9607a88881a00181e5937616c0d81"));
function GstReportPage() {
  const today = /* @__PURE__ */ new Date();
  const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const [month, setMonth] = reactExports.useState(defaultMonth);
  const [activeTab, setActiveTab] = reactExports.useState("invoices");
  const getFn = useServerFn(getGstReport);
  const exportFn = useServerFn(exportGstReportCsv);
  const gstr1Fn = useServerFn(exportGstr1Csv);
  const gstr1RefundsFn = useServerFn(exportGstr1RefundsCsv);
  const exportRefundCsvFn = useServerFn(exportGstRefundReportCsv);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin.gst", month],
    queryFn: () => getFn({
      data: {
        month
      }
    })
  });
  const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
  const formatDate = (iso) => {
    if (!iso) return "—";
    try {
      const d = new Date(new Date(iso).getTime() + 330 * 6e4);
      return `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}/${d.getUTCFullYear()}`;
    } catch {
      return iso;
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold text-slate-900", children: "GST Report" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: "GSTR tax report and refund reports for GST filing & accounting reconciliation." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "month", value: month, onChange: (e) => setMonth(e.target.value), className: "rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm shadow-2xs font-medium text-slate-700" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
          try {
            const res = await exportFn({
              data: {
                month
              }
            });
            downloadCsv(res.csv, res.filename);
          } catch (e) {
            toast.error(e?.message || "Export failed");
          }
        }, className: "rounded-lg bg-slate-900 text-white hover:bg-slate-800 px-3 py-1.5 text-sm font-medium shadow-2xs transition-colors", children: "Export CSV" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
          try {
            const res = await gstr1Fn({
              data: {
                month
              }
            });
            downloadCsv(res.csv, res.filename);
            toast.success(`GSTR-1 exported (${res.count} invoices)`);
          } catch (e) {
            toast.error(e?.message || "GSTR-1 export failed");
          }
        }, className: "rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 px-3 py-1.5 text-sm font-medium shadow-2xs transition-colors", children: "Export GSTR-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
          try {
            const res = await gstr1RefundsFn({
              data: {
                month
              }
            });
            downloadCsv(res.csv, res.filename);
            toast.success(`GSTR-1 Refunds exported (${res.count} orders)`);
          } catch (e) {
            toast.error(e?.message || "GSTR-1 Refunds export failed");
          }
        }, className: "rounded-lg border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:border-rose-400 px-3 py-1.5 text-sm font-semibold shadow-2xs transition-colors", title: "Download refunded orders in standard GSTR-1 format", children: "Export GSTR-1 (Refunds)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
          try {
            const res = await exportRefundCsvFn({
              data: {
                month
              }
            });
            downloadCsv(res.csv, res.filename);
            toast.success(`Refund CSV exported (${res.count} orders)`);
          } catch (e) {
            toast.error(e?.message || "Refund CSV export failed");
          }
        }, className: "rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 text-sm font-medium shadow-2xs transition-colors", title: "Download detailed refund report with invoice and refund dates", children: "Export Refund CSV" })
      ] })
    ] }),
    isLoading || !data ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-sm text-slate-500 bg-white rounded-xl border border-slate-200", children: "Loading GST report…" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-slate-200 pb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setActiveTab("invoices"), className: `px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "invoices" ? "bg-slate-900 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`, children: [
          "All Invoices (",
          data.summary.count,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setActiveTab("refunds"), className: `px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${activeTab === "refunds" ? "bg-rose-600 text-white shadow-xs" : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"}`, children: [
          "Refund Report (",
          data.refundSummary?.count ?? 0,
          ")"
        ] })
      ] }),
      activeTab === "invoices" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { label: "Taxable", value: fmt(data.summary.taxable) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { label: "CGST", value: fmt(data.summary.cgst) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { label: "SGST", value: fmt(data.summary.sgst) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { label: "IGST", value: fmt(data.summary.igst) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { label: `Total (${data.summary.count})`, value: fmt(data.summary.total), highlight: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "By place of supply", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs text-slate-500 uppercase", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-1.5", children: "State" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right", children: "#" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right", children: "Taxable" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right", children: "CGST" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right", children: "SGST" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right", children: "IGST" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right", children: "Total" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-slate-100", children: [
            data.byState.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/60 transition-colors", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 font-medium text-slate-800", children: s.state }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-right text-slate-600", children: s.count }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-right text-slate-600", children: fmt(s.taxable) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-right text-slate-600", children: fmt(s.cgst) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-right text-slate-600", children: fmt(s.sgst) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-right text-slate-600", children: fmt(s.igst) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-right font-bold text-slate-900", children: fmt(s.total) })
            ] }, s.state)),
            data.byState.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "py-6 text-center text-slate-500", children: "No invoices in this month." }) })
          ] })
        ] }) }) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { label: "Refunded Taxable", value: fmt(data.refundSummary?.taxable ?? 0), tone: "rose" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { label: "CGST Reversed", value: fmt(data.refundSummary?.cgst ?? 0), tone: "rose" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { label: "SGST Reversed", value: fmt(data.refundSummary?.sgst ?? 0), tone: "rose" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { label: "IGST Reversed", value: fmt(data.refundSummary?.igst ?? 0), tone: "rose" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { label: `Total Refunded (${data.refundSummary?.count ?? 0})`, value: fmt(data.refundSummary?.total ?? 0), highlight: true, tone: "rose" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: `Refunded Orders (${data.refundSummary?.count ?? 0}) — Matching GSTR Format`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-slate-200 bg-slate-50/70 text-[10px] font-bold text-slate-600 uppercase tracking-wider text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Invoice #" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Invoice Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-rose-700", children: "Refund Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Lead / Order" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Customer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Place Of Supply" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "Taxable Value" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "Rate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right font-bold text-rose-700", children: "Refund Amount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Gateway / Ref" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-slate-100", children: [
            (data.refundRows ?? []).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/70 transition-colors", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono font-medium text-slate-800", children: r.invoice_number }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-slate-600", children: formatDate(r.issued_at) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-rose-600 font-semibold", children: formatDate(r.refund_processed_at) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono text-indigo-600", children: r.lead_code || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-medium text-slate-800", children: r.customer_name || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-slate-600", children: r.place_of_supply || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right text-slate-700 font-medium", children: fmt(r.taxable) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2 text-right text-slate-500", children: [
                r.rate,
                "%"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right font-bold text-rose-700", children: fmt(r.total_amount) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2 text-slate-500 font-mono text-[11px] truncate max-w-[140px]", title: r.refund_gateway_ref || r.transaction_id, children: [
                r.gateway ? `${r.gateway}: ` : "",
                r.refund_gateway_ref || r.transaction_id || "—"
              ] })
            ] }, r.id)),
            (data.refundRows ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 10, className: "py-8 text-center text-slate-500", children: "No refunded orders found for this month (by invoice date or refund processed date)." }) })
          ] })
        ] }) }) })
      ] })
    ] })
  ] });
}
function KPI({
  label,
  value,
  highlight,
  tone
}) {
  const isRose = tone === "rose";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl border p-3.5 shadow-2xs transition-all ${isRose ? highlight ? "bg-rose-50 border-rose-300 text-rose-950" : "bg-white border-rose-200 text-slate-800" : highlight ? "bg-indigo-50/60 border-indigo-200 text-indigo-950" : "bg-white border-slate-200 text-slate-800"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-[11px] font-bold uppercase tracking-wider truncate ${isRose ? "text-rose-600" : "text-slate-500"}`, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-lg font-bold mt-1 tracking-tight truncate ${isRose && highlight ? "text-rose-700" : highlight ? "text-indigo-700" : "text-slate-900"}`, children: value })
  ] });
}
function Card({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 border-b border-slate-200 bg-slate-50/60 text-xs font-bold uppercase tracking-wider text-slate-700", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4", children })
  ] });
}
function downloadCsv(csv, filename) {
  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
export {
  GstReportPage as component
};
