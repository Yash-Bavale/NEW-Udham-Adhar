import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { j as useServerFn, I as Input$1, H as Button } from "./router-QgJicixe.mjs";
import { b as useMutation } from "../_libs/tanstack__react-query.mjs";
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
const Input = object({
  from: string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: string().regex(/^\d{4}-\d{2}-\d{2}$/)
});
const buildZohoInvoiceExport = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => Input.parse(d)).handler(createSsrRpc("ac679de14a5b764361c735386d9a75e188d5fff75537c94e13874a0f5ecc16d6"));
const inr = (n) => "₹" + n.toLocaleString("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
const csvCell = (v) => /[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
function download(name, lines) {
  const blob = new Blob(["\uFEFF" + lines.map((l) => l.map(csvCell).join(",")).join("\r\n")], {
    type: "text/csv;charset=utf-8"
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5e3);
}
function ZohoExportPage() {
  const today = new Date(Date.now() + 5.5 * 36e5).toISOString().slice(0, 10);
  const [from, setFrom] = reactExports.useState(today.slice(0, 8) + "01");
  const [to, setTo] = reactExports.useState(today);
  const fn = useServerFn(buildZohoInvoiceExport);
  const m = useMutation({
    mutationFn: () => fn({
      data: {
        from,
        to
      }
    }),
    onError: (e) => toast.error(e?.message ?? "Validation failed")
  });
  const r = m.data;
  const cards = r ? [["Total Invoices", String(r.summary.totalInvoices)], ["Valid", String(r.summary.valid)], ["Errors", String(r.summary.errors)], ["Taxable Value", inr(r.summary.taxable)], ["CGST", inr(r.summary.cgst)], ["SGST", inr(r.summary.sgst)], ["IGST", inr(r.summary.igst)], ["Total", inr(r.summary.total)]] : [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Zoho Books Invoice Export" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "GST / Accounting → Zoho. Reads CRM invoices only; nothing is changed." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end gap-3 rounded-2xl border bg-card p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-sm", children: [
        "From",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input$1, { type: "date", value: from, onChange: (e) => {
          setFrom(e.target.value);
          m.reset();
        } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-sm", children: [
        "To",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input$1, { type: "date", value: to, onChange: (e) => {
          setTo(e.target.value);
          m.reset();
        } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => m.mutate(), disabled: m.isPending, children: m.isPending ? "Validating…" : "Fetch & Validate" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "secondary", disabled: !r || r.rows.length === 0, onClick: () => r && download(`zoho-invoices_${from}_${to}.csv`, [r.columns, ...r.rows.map((row) => r.columns.map((c) => row[c] ?? ""))]), children: [
        "Download Zoho Import File",
        r ? ` (${r.rows.length})` : ""
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "secondary", disabled: !r || !r.paymentRows?.length, onClick: () => r && download(`zoho-payments_${from}_${to}.csv`, [r.paymentColumns, ...r.paymentRows.map((row) => r.paymentColumns.map((c) => row[c] ?? ""))]), children: [
        "Download Zoho Payments File",
        r ? ` (${r.paymentRows?.length ?? 0})` : ""
      ] }),
      r && r.issues.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => download(`zoho-errors_${from}_${to}.csv`, [["Invoice Number", "Field", "Error"], ...r.issues.map((i) => [i.invoice_number, i.field, i.error])]), children: "Download Error Report" })
    ] }),
    r && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-4", children: cards.map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border bg-card p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: k }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mt-1 text-lg font-semibold ${k === "Errors" && r.summary.errors ? "text-destructive" : ""}`, children: v })
      ] }, k)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Export file contains only valid invoices — reconciles to Taxable ",
        inr(r.validTotals.taxable),
        ", CGST ",
        inr(r.validTotals.cgst),
        ", SGST ",
        inr(r.validTotals.sgst),
        ", IGST ",
        inr(r.validTotals.igst),
        ", Total ",
        inr(r.validTotals.total),
        "."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b p-4 font-medium", children: [
          "Error Report (",
          r.issues.length,
          ")"
        ] }),
        r.issues.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "p-4 text-sm text-muted-foreground", children: "All invoices passed validation." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[480px] overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "sticky top-0 bg-muted text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "Invoice Number" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "Field" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "Error" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: r.issues.map((i, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 font-mono", children: i.invoice_number }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2", children: i.field }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 text-destructive", children: i.error })
          ] }, idx)) })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  ZohoExportPage as component
};
