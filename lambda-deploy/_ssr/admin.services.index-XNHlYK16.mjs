import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { j as useServerFn, ap as listServices, aq as upsertService, ar as deleteService, P as Dialog, Q as DialogContent, U as DialogHeader, V as DialogTitle, as as DialogDescription, X as DialogFooter, H as Button } from "./router-QgJicixe.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { l as listWebsiteTree } from "./websites-admin.functions-Czg-Mjvg.mjs";
import { g as getBuilderSchema } from "./form-builder.functions-C25nyyyW.mjs";
import { f as fromTotal, a as fromBase } from "./gst-GVXtnpTB.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "./index.mjs";
import { L as LoaderCircle, au as ExternalLink, ad as Eye, Q as FileText, bP as Settings2, aP as Pencil, az as Trash2, E as Check, X } from "../_libs/lucide-react.mjs";
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
import "../_libs/date-fns.mjs";
import "../_libs/react-day-picker.mjs";
import "../_libs/date-fns__tz.mjs";
function emptyForm() {
  return {
    service_code: "",
    service_name: "",
    base_amount: 0,
    gst_amount: 0,
    total_amount: 0,
    is_active: true,
    sort_order: 0,
    govt_portal_url: "",
    category_id: null,
    expected_processing_days: null,
    journey_key: "default"
  };
}
function ServicesPage() {
  const listFn = useServerFn(listServices);
  const treeFn = useServerFn(listWebsiteTree);
  const upsertFn = useServerFn(upsertService);
  const delFn = useServerFn(deleteService);
  const qc = useQueryClient();
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin.services"],
    queryFn: () => listFn()
  });
  const {
    data: tree
  } = useQuery({
    queryKey: ["admin.websites.tree"],
    queryFn: () => treeFn()
  });
  const [form, setForm] = reactExports.useState(null);
  const [tab, setTab] = reactExports.useState("");
  const [previewTarget, setPreviewTarget] = reactExports.useState(null);
  const websites = tree?.websites ?? [];
  const categories = tree?.categories ?? [];
  const websiteById = reactExports.useMemo(() => Object.fromEntries(websites.map((w) => [w.id, w])), [websites]);
  const categoryById = reactExports.useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c])), [categories]);
  const categoriesForForm = reactExports.useMemo(() => categories.filter((c) => c.website_id === form?.website_id), [categories, form?.website_id]);
  const allRows = data?.rows ?? [];
  const activeTab = tab || websites[0]?.id || "__all__";
  const unassignedCount = allRows.filter((s) => !s.website_id).length;
  const tabs = reactExports.useMemo(() => [...websites.map((w) => ({
    key: w.id,
    label: w.name,
    sub: w.domain,
    count: allRows.filter((s) => s.website_id === w.id).length
  })), ...unassignedCount > 0 ? [{
    key: "__none__",
    label: "Unassigned",
    sub: "no website",
    count: unassignedCount
  }] : [], {
    key: "__all__",
    label: "All websites",
    sub: "",
    count: allRows.length
  }], [websites, allRows, unassignedCount]);
  const visibleRows = reactExports.useMemo(() => {
    if (activeTab === "__all__") return allRows;
    if (activeTab === "__none__") return allRows.filter((s) => !s.website_id);
    return allRows.filter((s) => s.website_id === activeTab);
  }, [allRows, activeTab]);
  const groups = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const s of visibleRows) {
      const key = s.category_id ?? "__uncat__";
      const arr = map.get(key) ?? [];
      arr.push(s);
      map.set(key, arr);
    }
    const entries = [...map.entries()].map(([key, rows]) => ({
      key,
      label: key === "__uncat__" ? "Uncategorised" : categoryById[key]?.name ?? "Uncategorised",
      rows: [...rows].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    }));
    entries.sort((a, b) => a.key === "__uncat__" ? 1 : b.key === "__uncat__" ? -1 : a.label.localeCompare(b.label));
    return entries;
  }, [visibleRows, categoryById]);
  const colCount = 7;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold", children: "Services" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setForm({
        ...emptyForm(),
        website_id: activeTab === "__all__" || activeTab === "__none__" ? websites[0]?.id : activeTab
      }), className: "rounded bg-slate-900 text-white px-3.5 py-2 text-sm font-medium hover:bg-slate-800 transition-colors shadow-xs", children: "+ New Service" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: tabs.map((t) => {
      const on = t.key === activeTab;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTab(t.key), className: `rounded-lg border px-3 py-1.5 text-left text-sm transition ${on ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: t.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `ml-2 rounded-full px-1.5 py-0.5 text-[11px] ${on ? "bg-white/20" : "bg-slate-100 text-slate-600"}`, children: t.count }),
        t.sub && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `block text-[11px] ${on ? "text-white/70" : "text-slate-400"}`, children: t.sub })
      ] }, t.key);
    }) }),
    form && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-white p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Service code", value: form.service_code, onChange: (v) => setForm({
          ...form,
          service_code: v
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Service name", value: form.service_name, onChange: (v) => setForm({
          ...form,
          service_name: v
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Select, { label: "Website", value: form.website_id ?? "", onChange: (v) => setForm({
          ...form,
          website_id: v || void 0,
          category_id: null
        }), options: [{
          value: "",
          label: "— select —"
        }, ...websites.map((w) => ({
          value: w.id,
          label: `${w.name} (${w.domain})`
        }))] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Select, { label: "Category (optional)", value: form.category_id ?? "", onChange: (v) => setForm({
          ...form,
          category_id: v || null
        }), options: [{
          value: "",
          label: "— none —"
        }, ...categoriesForForm.map((c) => ({
          value: c.id,
          label: c.name
        }))] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Total (₹ inclusive of 18% GST)", type: "number", value: String(form.total_amount), onChange: (v) => {
          const {
            base,
            gst,
            total
          } = fromTotal(Number(v));
          setForm({
            ...form,
            total_amount: total,
            base_amount: base,
            gst_amount: gst
          });
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Base (₹) — auto from total", type: "number", value: String(form.base_amount), onChange: (v) => {
          const {
            base,
            gst,
            total
          } = fromBase(Number(v));
          setForm({
            ...form,
            base_amount: base,
            gst_amount: gst,
            total_amount: total
          });
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "GST 18% (₹) — auto", type: "number", value: String(form.gst_amount), onChange: () => {
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Govt Portal URL", value: form.govt_portal_url ?? "", onChange: (v) => setForm({
          ...form,
          govt_portal_url: v
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Sort order", type: "number", value: String(form.sort_order), onChange: (v) => setForm({
          ...form,
          sort_order: Number(v)
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Expected processing days", type: "number", value: form.expected_processing_days == null ? "" : String(form.expected_processing_days), onChange: (v) => setForm({
          ...form,
          expected_processing_days: v === "" ? null : Number(v)
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Journey key", value: form.journey_key ?? "default", onChange: (v) => setForm({
          ...form,
          journey_key: v || "default"
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: form.is_active, onChange: (e) => setForm({
            ...form,
            is_active: e.target.checked
          }) }),
          "Active"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
          try {
            await upsertFn({
              data: form
            });
            await qc.invalidateQueries({
              queryKey: ["admin.services"]
            });
            setForm(null);
            toast.success("Service saved");
          } catch (e) {
            toast.error("Save failed: " + e.message);
          }
        }, className: "rounded bg-slate-900 text-white px-4 py-2 text-sm font-medium", children: "Save" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setForm(null), className: "rounded border px-4 py-2 text-sm font-medium", children: "Cancel" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border bg-white overflow-x-auto shadow-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50/80 text-xs uppercase text-slate-500 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 text-left font-semibold", children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 text-right font-semibold", children: "Base (₹)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 text-right font-semibold", children: "GST 18%" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 text-right font-semibold", children: "Total (₹)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 text-center font-semibold", children: "Sort" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 text-center font-semibold", children: "Active" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 text-right font-semibold", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y", children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: colCount, className: "px-3 py-8 text-center text-slate-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin text-slate-600" }),
          " Loading services…"
        ] }) }) }),
        !isLoading && visibleRows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: colCount, className: "px-3 py-8 text-center text-slate-500", children: "No services for this website yet." }) }),
        groups.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "bg-slate-100/60 border-t border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: colCount, className: "px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-600", children: [
            g.label,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-normal text-slate-400", children: [
              "(",
              g.rows.length,
              ")"
            ] })
          ] }) }),
          g.rows.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/50 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-900", children: s.service_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex flex-wrap items-center gap-1.5 text-[11px]", children: [
                s.website_id && websiteById[s.website_id] && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.5 font-medium", children: websiteById[s.website_id].domain }),
                s.category_id && categoryById[s.category_id] && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1 rounded bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 font-medium", children: categoryById[s.category_id].name }),
                s.govt_portal_url && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: s.govt_portal_url, target: "_blank", rel: "noopener noreferrer", className: "text-xs text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "size-3" }),
                  " Govt Portal"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(InlineBasePriceCell, { service: s, onSave: async (newBase) => {
              const {
                base,
                gst,
                total
              } = fromBase(newBase);
              try {
                await upsertFn({
                  data: {
                    ...s,
                    base_amount: base,
                    gst_amount: gst,
                    total_amount: total
                  }
                });
                await qc.invalidateQueries({
                  queryKey: ["admin.services"]
                });
                toast.success(`Updated base price to ₹${base.toFixed(2)} (Total: ₹${total.toFixed(2)})`);
              } catch (err) {
                toast.error(err.message);
                throw err;
              }
            } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2.5 text-right text-slate-600 font-mono text-xs", children: [
              "₹",
              Number(s.gst_amount).toFixed(2)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2.5 text-right font-bold text-slate-900 font-mono text-xs", children: [
              "₹",
              Number(s.total_amount).toFixed(2)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", defaultValue: s.sort_order ?? 0, onBlur: async (e) => {
              const next = Number(e.target.value);
              if (next === (s.sort_order ?? 0)) return;
              try {
                await upsertFn({
                  data: {
                    ...s,
                    sort_order: next
                  }
                });
                await qc.invalidateQueries({
                  queryKey: ["admin.services"]
                });
                toast.success("Sort order updated");
              } catch (err) {
                toast.error(err.message);
              }
            }, className: "w-14 rounded border border-slate-300 px-2 py-1 text-xs text-center font-medium" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: async () => {
              try {
                await upsertFn({
                  data: {
                    ...s,
                    is_active: !s.is_active
                  }
                });
                await qc.invalidateQueries({
                  queryKey: ["admin.services"]
                });
                toast.success(s.is_active ? "Service deactivated" : "Service activated");
              } catch (e) {
                toast.error(e.message);
              }
            }, className: `inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border transition-colors ${s.is_active ? "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200" : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"}`, title: s.is_active ? "Click to deactivate" : "Click to activate", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `size-1.5 rounded-full ${s.is_active ? "bg-emerald-600" : "bg-slate-400"}` }),
              s.is_active ? "Active" : "Inactive"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-end gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setPreviewTarget({
                code: s.service_code,
                name: s.service_name
              }), className: "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300 transition-colors shadow-2xs", title: "Preview customer application form", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-3.5" }),
                " Preview Form"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/services/forms/$serviceCode", params: {
                serviceCode: s.service_code
              }, className: "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 hover:border-sky-300 transition-colors shadow-2xs", title: "Edit form fields & schema", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-3.5" }),
                " Edit Form"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/services/$serviceCode", params: {
                serviceCode: s.service_code
              }, className: "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-colors shadow-2xs", title: "Configure service settings", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "size-3.5" }),
                " Configure"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setForm(s), className: "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-colors shadow-2xs", title: "Edit service details", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-3.5" }),
                " Edit"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: async () => {
                if (!confirm(`Delete service "${s.service_name}"?`)) return;
                try {
                  await delFn({
                    data: {
                      id: s.id
                    }
                  });
                  await qc.invalidateQueries({
                    queryKey: ["admin.services"]
                  });
                  toast.success("Service deleted");
                } catch (err) {
                  toast.error(err.message);
                }
              }, className: "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:border-rose-300 transition-colors shadow-2xs", title: "Delete service", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }),
                " Delete"
              ] })
            ] }) })
          ] }, s.id))
        ] }, g.key))
      ] })
    ] }) }),
    previewTarget && /* @__PURE__ */ jsxRuntimeExports.jsx(FormPreviewModal, { serviceCode: previewTarget.code, serviceName: previewTarget.name, onClose: () => setPreviewTarget(null) })
  ] });
}
function FormPreviewModal({
  serviceCode,
  serviceName,
  onClose
}) {
  const getSchemaFn = useServerFn(getBuilderSchema);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin.services.form-builder", serviceCode],
    queryFn: () => getSchemaFn({
      data: {
        service_code: serviceCode
      }
    })
  });
  const activeRow = data?.active;
  const rawSchema = activeRow?.schema ?? {};
  const sections = rawSchema.sections?.length ? rawSchema.sections : rawSchema.fields?.length ? [{
    key: "default",
    label: "Details",
    fields: rawSchema.fields
  }] : [];
  const documents = activeRow?.documents ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden gap-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "shrink-0 px-5 py-4 border-b bg-gradient-to-r from-indigo-50 to-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid place-items-center size-9 rounded-full bg-indigo-100 text-indigo-700 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-base font-bold", children: [
          "Form Preview — ",
          serviceName
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { className: "text-xs text-slate-500 font-mono", children: [
          "Code: ",
          serviceCode,
          " (",
          sections.length,
          " section",
          sections.length === 1 ? "" : "s",
          ", ",
          documents.length,
          " doc",
          documents.length === 1 ? "" : "s",
          ")"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto min-h-0 p-6 space-y-6 bg-slate-50/50", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid place-items-center h-48 text-sm text-slate-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-5 animate-spin text-indigo-600 mb-2" }),
      "Loading form schema preview…"
    ] }) : sections.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-10 text-slate-500 text-sm", children: "No sections configured for this form." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      sections.map((sec, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-white p-5 shadow-2xs space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-slate-900 text-sm flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid place-items-center size-5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold", children: idx + 1 }),
            sec.label
          ] }),
          sec.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-1", children: sec.description })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 gap-4", children: sec.fields.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: f.type === "textarea" || f.type === "nic" || f.type === "plants" ? "md:col-span-2" : "", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-xs font-medium text-slate-700 mb-1", children: [
            f.label,
            " ",
            f.required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500", children: "*" })
          ] }),
          f.type === "select" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { disabled: true, className: "w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: f.placeholder || "Select option…" }),
            f.options?.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: o }, o))
          ] }) : f.type === "textarea" ? /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { disabled: true, rows: 2, placeholder: f.placeholder || f.help || "Enter details…", className: "w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-600" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: f.type === "number" ? "number" : f.type === "date" ? "date" : "text", disabled: true, placeholder: f.placeholder || f.help || `Enter ${f.label.toLowerCase()}…`, className: "w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-600" }),
          f.help && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-400 mt-0.5", children: f.help })
        ] }, f.key)) })
      ] }, sec.key || idx)),
      documents.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-white p-5 shadow-2xs space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-slate-900 text-sm flex items-center gap-2 border-b pb-2", children: [
          "Required Documents (",
          documents.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 gap-3", children: documents.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-slate-200 p-3 bg-slate-50/50 flex items-start gap-2 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-4 text-indigo-600 shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-slate-900", children: [
              d.label,
              " ",
              d.required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-rose-500", children: "*" })
            ] }),
            d.help && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 mt-0.5", children: d.help })
          ] })
        ] }, d.key)) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "shrink-0 px-5 py-3 border-t bg-slate-50 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/services/forms/$serviceCode", params: {
        serviceCode
      }, className: "inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "size-3.5" }),
        " Edit this form in Builder →"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: onClose, children: "Close Preview" })
    ] })
  ] }) });
}
function Input({
  label,
  value,
  onChange,
  type = "text"
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 mb-1", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type, value, onChange: (e) => onChange(e.target.value), className: "w-full rounded border px-3 py-2" })
  ] });
}
function Select({
  label,
  value,
  onChange,
  options
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 mb-1", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value, onChange: (e) => onChange(e.target.value), className: "w-full rounded border px-3 py-2 bg-white", children: options.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o.value, children: o.label }, o.value)) })
  ] });
}
function InlineBasePriceCell({
  service,
  onSave
}) {
  const currentBase = Number(service.base_amount ?? 0);
  const [value, setValue] = reactExports.useState(String(currentBase));
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setValue(String(currentBase));
  }, [currentBase]);
  const numericValue = Number(value);
  const isChanged = !isNaN(numericValue) && numericValue >= 0 && numericValue !== currentBase;
  async function handleConfirm() {
    if (!isChanged || saving) return;
    setSaving(true);
    try {
      await onSave(numericValue);
    } finally {
      setSaving(false);
    }
  }
  function handleCancel() {
    setValue(String(currentBase));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center justify-end gap-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400 font-mono", children: "₹" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", step: "1", value, onChange: (e) => setValue(e.target.value), onWheel: (e) => e.target.blur(), onKeyDown: (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          void handleConfirm();
        } else if (e.key === "Escape") {
          handleCancel();
        }
      }, disabled: saving, className: `w-24 rounded border px-2 py-1 text-sm font-semibold text-right transition-colors focus:outline-none ${isChanged ? "border-amber-500 bg-amber-50/70 text-amber-900 focus:ring-2 focus:ring-amber-500/40" : "border-slate-300 bg-white text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"}`, title: "Type new Base Price — click Confirm or press Enter to save" }),
      isChanged && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => void handleConfirm(), disabled: saving, className: "inline-flex items-center gap-1 px-2 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded shadow-xs transition-colors disabled:opacity-50", title: "Confirm price change", children: [
          saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5" }),
          "Confirm"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: handleCancel, disabled: saving, className: "p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors", title: "Cancel changes", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5" }) })
      ] })
    ] })
  ] });
}
export {
  ServicesPage as component
};
