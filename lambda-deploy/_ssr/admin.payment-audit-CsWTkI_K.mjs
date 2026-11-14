import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { Y as useFinancialVisibility, j as useServerFn } from "./router-QgJicixe.mjs";
import { b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/sonner.mjs";
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
const auditOrderPayments = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator(object({
  code: string().min(3)
})).handler(createSsrRpc("cb0dcac84b823bc63911ae523fd36e8bff736727bc7280844feade19352c0107"));
const SEVERITY_STYLES = {
  ok: "border-emerald-200 bg-emerald-50 text-emerald-900",
  warn: "border-amber-200 bg-amber-50 text-amber-900",
  error: "border-red-200 bg-red-50 text-red-900"
};
const VERDICT_LABEL = {
  clean: "No mismatches found",
  review: "Needs review",
  mismatch: "Mismatches found"
};
function fmtDate(s) {
  return s ? new Date(s).toLocaleString("en-IN") : "—";
}
function PaymentAuditPage() {
  const {
    formatINR
  } = useFinancialVisibility();
  const auditFn = useServerFn(auditOrderPayments);
  const [code, setCode] = reactExports.useState("");
  const audit = useMutation({
    mutationFn: (c) => auditFn({
      data: {
        code: c
      }
    })
  });
  const result = audit.data;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold", children: "Payment Audit" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 mt-1", children: "End-to-end reconciliation for one order: gateway references, payment links, invoices, lead status transitions and email sends. Read-only — nothing is modified." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "flex gap-2", onSubmit: (e) => {
      e.preventDefault();
      if (code.trim()) audit.mutate(code.trim());
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: code, onChange: (e) => setCode(e.target.value), placeholder: "AP-2026-008007 or UA-2026-013731", className: "w-80 rounded border border-slate-300 px-3 py-2 text-sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: audit.isPending || !code.trim(), className: "rounded bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-40", children: audit.isPending ? "Auditing…" : "Run audit" })
    ] }),
    audit.isError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800", children: audit.error.message }),
    result && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-md border px-4 py-3 text-sm ${result.verdict === "clean" ? SEVERITY_STYLES["ok"] : result.verdict === "review" ? SEVERITY_STYLES["warn"] : SEVERITY_STYLES["error"]}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold", children: [
          result.code,
          " — ",
          VERDICT_LABEL[result.verdict] ?? result.verdict
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1", children: [
          result.errors,
          " error(s) · ",
          result.warnings,
          " warning(s) · Paid ",
          formatINR(result.totals.paid),
          " · Invoiced",
          " ",
          formatINR(result.totals.invoiced),
          Math.abs(result.totals.delta) > 0.5 ? ` · Δ ${formatINR(result.totals.delta)}` : ""
        ] }),
        result.lead && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs opacity-80", children: [
          "Lead ",
          result.lead.code,
          " · ",
          result.lead.name ?? "—",
          " · ",
          result.lead.email ?? "—",
          " · status",
          " ",
          result.lead.status ?? "—"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-slate-700", children: "Checks" }),
        result.checks.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded border px-3 py-2 text-sm ${SEVERITY_STYLES[c.severity]}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
            c.label,
            ":"
          ] }),
          " ",
          c.detail
        ] }, c.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: `Payments (${result.payments.length})`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Table, { head: ["When", "Amount", "Status", "Gateway", "Reference", "Type", "Invoice"], rows: result.payments.map((p) => [fmtDate(p.at), formatINR(p.amount, {
        maximumFractionDigits: 2
      }), p.status, p.gateway ?? "—", p.reference ?? "—", p.isTopUp ? "Top-up" : "Primary", p.invoice ?? "—"]) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: `Payment links (${result.links.length})`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Table, { head: ["Created", "Txn ID", "Amount", "Status"], rows: result.links.map((l) => [fmtDate(l.createdAt), l.txnid, formatINR(l.amount, {
        maximumFractionDigits: 2
      }), l.status]) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: `Invoices (${result.invoices.length})`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Table, { head: ["Issued", "Number", "Total", "Emailed"], rows: result.invoices.map((i) => [fmtDate(i.issuedAt), i.number ?? "—", formatINR(i.total, {
        maximumFractionDigits: 2
      }), fmtDate(i.emailedAt)]) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: `Status transitions (${result.transitions.length})`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Table, { head: ["When", "From", "To", "Reason"], rows: result.transitions.map((t) => [fmtDate(t.at), t.from ?? "—", t.to, t.reason ?? "—"]) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: `Emails (${result.emails.length})`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Table, { head: ["Sent", "Template", "To", "Subject", "Status"], rows: result.emails.map((e) => [fmtDate(e.at), e.code ?? "—", e.to, e.subject, e.status]) }) })
    ] })
  ] });
}
function Section({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-slate-700", children: title }),
    children
  ] });
}
function Table({
  head,
  rows
}) {
  if (rows.length === 0) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500", children: "None" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded border border-slate-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "min-w-full text-xs", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-slate-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: head.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-medium", children: h }, h)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-t border-slate-100", children: r.map((cell, j) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 align-top", children: cell }, j)) }, i)) })
  ] }) });
}
export {
  PaymentAuditPage as component
};
