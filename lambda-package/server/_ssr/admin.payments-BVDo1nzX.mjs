import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { Y as useFinancialVisibility, j as useServerFn, a7 as isVisibleService, I as Input, a0 as DateRangePicker, H as Button, a1 as Badge } from "./router-QgJicixe.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { listPaymentsAdmin, getPaymentsFilterMeta, generateInvoice, getInvoiceSignedUrl } from "./invoices.functions-CoU4f0R2.mjs";
import "../_libs/seroval.mjs";
import "./index.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/cookie-es.mjs";
import "node:stream";
import "./constants-CKRzJJF_.mjs";
import "./createSsrRpc-BO-AEXHh.mjs";
import "./server-BFjd5iLF.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
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
function PaymentsPage() {
  const {
    formatINR
  } = useFinancialVisibility();
  const listFn = useServerFn(listPaymentsAdmin);
  const metaFn = useServerFn(getPaymentsFilterMeta);
  const genFn = useServerFn(generateInvoice);
  const urlFn = useServerFn(getInvoiceSignedUrl);
  const qc = useQueryClient();
  const [filters, setFilters] = reactExports.useState({
    q: "",
    status: "",
    gateway: "",
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
    isLoading
  } = useQuery({
    queryKey: ["admin.payments", filters],
    queryFn: () => listFn({
      data: {
        q: filters.q || void 0,
        status: filters.status || void 0,
        gateway: filters.gateway || void 0,
        serviceId: filters.serviceId || void 0,
        from: filters.from || void 0,
        to: filters.to || void 0,
        page: filters.page,
        pageSize: 25
      }
    })
  });
  const gen = useMutation({
    mutationFn: (paymentId) => genFn({
      data: {
        paymentId
      }
    }),
    onSuccess: () => {
      toast.success("Invoice generated");
      qc.invalidateQueries({
        queryKey: ["admin.payments"]
      });
    },
    onError: (e) => toast.error(e.message ?? "Could not generate invoice")
  });
  const openInvoice = async (invoiceId) => {
    try {
      const r = await urlFn({
        data: {
          invoiceId
        }
      });
      window.open(r.url, "_blank", "noopener,noreferrer");
    } catch (e) {
      toast.error(e.message ?? "Could not open invoice");
    }
  };
  const statusBadge = (s) => {
    const map = {
      paid: "bg-emerald-100 text-emerald-700",
      failed: "bg-rose-100 text-rose-700",
      refunded: "bg-amber-100 text-amber-700",
      attempted: "bg-sky-100 text-sky-700",
      created: "bg-slate-100 text-slate-600"
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: `text-[10px] ${map[s] ?? ""}`, children: s.replace(/_/g, " ") });
  };
  const groupedServices = reactExports.useMemo(() => {
    const raw = meta.data?.services ?? [];
    const activeOnly = raw.filter((s) => isVisibleService(s));
    const map = /* @__PURE__ */ new Map();
    for (const s of activeOnly) {
      const webId = s.website_id || s.website?.id || "main";
      const webName = s.website?.name || s.website?.domain || "Main Website";
      const domain = s.website?.domain || "";
      if (!map.has(webId)) {
        map.set(webId, {
          websiteName: webName,
          domain,
          services: []
        });
      }
      map.get(webId).services.push(s);
    }
    return Array.from(map.entries()).map(([id, group]) => ({
      id,
      ...group
    }));
  }, [meta.data?.services]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold", children: "Payments Audit & Ledger" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "Every Razorpay, PayU, CCAvenue, Cashfree webhook + system receipt" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500", children: data ? `${data.total} payments` : "" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border bg-white p-3", style: {
      borderColor: "var(--admin-border)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-6 gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search name, email, mobile, ref…", value: filters.q, onChange: (e) => setFilters({
        ...filters,
        q: e.target.value,
        page: 1
      }), className: "md:col-span-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: filters.status, onChange: (e) => setFilters({
        ...filters,
        status: e.target.value,
        page: 1
      }), className: "rounded border px-2 py-1.5 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All status" }),
        meta.data?.statuses.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, s))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: filters.gateway, onChange: (e) => setFilters({
        ...filters,
        gateway: e.target.value,
        page: 1
      }), className: "rounded border px-2 py-1.5 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All gateways" }),
        meta.data?.gateways.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: g, children: g }, g))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: filters.serviceId, onChange: (e) => setFilters({
        ...filters,
        serviceId: e.target.value,
        page: 1
      }), className: "rounded border px-2 py-1.5 text-sm max-w-[220px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All active services" }),
        groupedServices.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx("optgroup", { label: "Udyam Aadhar Services", children: g.services.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.id, children: s.service_name }, s.id)) }, g.id))
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Payment Ref" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Order No" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Customer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Service" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "Amount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "GST" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Gateway" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Invoice" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 11, className: "px-3 py-6 text-center text-slate-500", children: "Loading…" }) }),
        !isLoading && data?.rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 11, className: "px-3 py-6 text-center text-slate-500", children: "No payments match these filters." }) }),
        data?.rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t hover:bg-slate-50/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono text-[10px]", children: r.transaction_id ?? r.id.slice(0, 8) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: r.application_id ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/orders/$orderId", params: {
            orderId: r.application_id
          }, className: "text-sky-700 hover:underline font-mono", children: r.application_code ?? "view" }) : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: r.customer_name || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-500", children: r.lead_code })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: r.service }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right", children: formatINR(r.base_amount, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right", children: formatINR(r.gst_amount, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right font-semibold", children: formatINR(r.amount, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 capitalize", children: r.gateway_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: statusBadge(r.status) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-slate-600", children: fmtDate(r.payment_date ?? r.created_at) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: r.invoice_id && r.has_pdf ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openInvoice(r.invoice_id), className: "text-sky-700 hover:underline text-[11px]", children: r.invoice_number ?? "View PDF" }) : r.status === "paid" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", className: "h-6 text-[10px]", disabled: gen.isPending, onClick: () => gen.mutate(r.id), children: gen.isPending && gen.variables === r.id ? "Generating…" : "Generate" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: "—" }) })
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
  PaymentsPage as component
};
