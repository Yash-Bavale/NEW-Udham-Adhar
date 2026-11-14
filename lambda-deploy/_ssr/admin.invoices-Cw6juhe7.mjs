import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { Y as useFinancialVisibility, j as useServerFn, I as Input, a0 as DateRangePicker, H as Button, a1 as Badge } from "./router-QgJicixe.mjs";
import { a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { listInvoicesAdmin, getPaymentsFilterMeta, getInvoiceSignedUrl, regenerateInvoice, updateInvoiceGstin } from "./invoices.functions-CoU4f0R2.mjs";
import "../_libs/seroval.mjs";
import "./index.mjs";
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
import "../_libs/tanstack__query-core.mjs";
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
const fmtDate = (s) => s ? new Date(s).toLocaleDateString("en-IN", {
  day: "2-digit",
  month: "short",
  year: "2-digit"
}) : "—";
function InvoicesPage() {
  const {
    formatINR
  } = useFinancialVisibility();
  const listFn = useServerFn(listInvoicesAdmin);
  const metaFn = useServerFn(getPaymentsFilterMeta);
  const urlFn = useServerFn(getInvoiceSignedUrl);
  const regenFn = useServerFn(regenerateInvoice);
  const gstinFn = useServerFn(updateInvoiceGstin);
  const [filters, setFilters] = reactExports.useState({
    q: "",
    gstType: "",
    serviceId: "",
    from: "",
    to: "",
    page: 1
  });
  const meta = useQuery({
    queryKey: ["payments.meta"],
    queryFn: () => metaFn()
  });
  const {
    data,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["admin.invoices", filters],
    queryFn: () => listFn({
      data: {
        q: filters.q || void 0,
        gstType: filters.gstType || void 0,
        serviceId: filters.serviceId || void 0,
        from: filters.from || void 0,
        to: filters.to || void 0,
        page: filters.page,
        pageSize: 25
      }
    })
  });
  const regen = useMutation({
    mutationFn: (invoiceId) => regenFn({
      data: {
        invoiceId
      }
    }),
    onSuccess: () => {
      toast.success("Invoice PDF regenerated");
      refetch();
    },
    onError: (e) => toast.error(e.message ?? "Could not regenerate")
  });
  const gstinMut = useMutation({
    mutationFn: (v) => gstinFn({
      data: {
        ...v,
        sendEmail: false
      }
    }),
    onSuccess: (r) => {
      toast.success(`GSTIN ${r.gstin} saved — invoice regenerated (no email sent)`);
      refetch();
    },
    onError: (e) => toast.error(e.message ?? "Could not update GSTIN")
  });
  const openPdf = async (invoiceId) => {
    try {
      const r = await urlFn({
        data: {
          invoiceId
        }
      });
      window.open(r.url, "_blank", "noopener,noreferrer");
    } catch (e) {
      toast.error(e.message ?? "Could not open PDF");
    }
  };
  const gstBadge = (t) => {
    if (t === "igst") return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "bg-violet-100 text-violet-700 text-[10px]", children: "IGST 18%" });
    if (t === "cgst_sgst") return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "bg-sky-100 text-sky-700 text-[10px]", children: "CGST+SGST 18%" });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px]", children: "—" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold", children: "Invoices" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500", children: data ? `${data.total} invoices` : "" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border bg-white p-3", style: {
      borderColor: "var(--admin-border)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-6 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search invoice no, customer, code…", value: filters.q, onChange: (e) => setFilters({
        ...filters,
        q: e.target.value,
        page: 1
      }), className: "md:col-span-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: filters.gstType, onChange: (e) => setFilters({
        ...filters,
        gstType: e.target.value,
        page: 1
      }), className: "rounded border px-2 py-1.5 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All GST types" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "cgst_sgst", children: "CGST + SGST" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "igst", children: "IGST" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: filters.serviceId, onChange: (e) => setFilters({
        ...filters,
        serviceId: e.target.value,
        page: 1
      }), className: "rounded border px-2 py-1.5 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All services" }),
        meta.data?.services.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.id, children: s.service_name }, s.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DateRangePicker, { value: {
        from: filters.from ? new Date(filters.from) : void 0,
        to: filters.to ? new Date(filters.to) : void 0
      }, onChange: (range) => setFilters({
        ...filters,
        from: range.from ? range.from.toISOString().slice(0, 10) : "",
        to: range.to ? range.to.toISOString().slice(0, 10) : "",
        page: 1
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border bg-white overflow-x-auto", style: {
      borderColor: "var(--admin-border)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-slate-500 uppercase tracking-wider", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Invoice No" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Order No" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Customer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Service" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "Base" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "GST" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "GST Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "PDF" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 11, className: "px-3 py-6 text-center text-slate-500", children: "Loading…" }) }),
        !isLoading && data?.rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 11, className: "px-3 py-6 text-center text-slate-500", children: "No invoices found." }) }),
        data?.rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t hover:bg-slate-50/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono", children: r.invoice_number }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: r.application_id ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/orders/$orderId", params: {
            orderId: r.application_id
          }, className: "text-sky-700 hover:underline font-mono", children: r.application_code ?? "view" }) : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: r.customer_name || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-500", children: r.lead_code }),
            r.customer_gstin_snapshot && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] font-mono font-semibold text-emerald-700", children: [
              "GSTIN: ",
              r.customer_gstin_snapshot
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: r.service }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-slate-600", children: fmtDate(r.issued_at) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right", children: formatINR(r.base_amount, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right", children: formatINR(r.gst_amount, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right font-semibold", children: formatINR(r.total_amount, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: gstBadge(r.gst_type) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: r.pdf_path ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openPdf(r.id), className: "text-sky-700 hover:underline text-[11px]", children: "Download" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: "—" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", className: "h-6 text-[10px]", disabled: regen.isPending, onClick: () => regen.mutate(r.id), children: "Regenerate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", className: "h-6 text-[10px]", disabled: gstinMut.isPending, title: r.customer_gstin_snapshot ? `GSTIN: ${r.customer_gstin_snapshot}` : "Add customer GSTIN", onClick: () => {
              const v = window.prompt("Customer GSTIN (15 characters). The invoice will be regenerated. No email will be sent.", r.customer_gstin_snapshot ?? "");
              if (v && v.trim()) gstinMut.mutate({
                invoiceId: r.id,
                gstin: v.trim()
              });
            }, children: r.customer_gstin_snapshot ? "Edit GSTIN" : "Add GSTIN" })
          ] }) })
        ] }, r.id))
      ] })
    ] }) }),
    data && data.total > 25 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-slate-500", children: [
        "Page ",
        filters.page,
        " of ",
        Math.max(1, Math.ceil(data.total / 25))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", disabled: filters.page <= 1, onClick: () => setFilters({
          ...filters,
          page: filters.page - 1
        }), children: "Previous" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", disabled: filters.page * 25 >= data.total, onClick: () => setFilters({
          ...filters,
          page: filters.page + 1
        }), children: "Next" })
      ] })
    ] })
  ] });
}
export {
  InvoicesPage as component
};
