import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { j as useServerFn } from "./router-QgJicixe.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { l as listWebsiteTree, u as upsertWebsite, d as deleteWebsite, a as upsertServiceCategory, b as deleteServiceCategory } from "./websites-admin.functions-Czg-Mjvg.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import { G as Globe, aw as Plus, y as ChevronDown, s as ChevronRight, au as ExternalLink, bw as FolderPlus, aP as Pencil, az as Trash2, bx as Folder, B as Briefcase } from "../_libs/lucide-react.mjs";
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
function emptyWebsite() {
  return {
    name: "",
    domain: "",
    description: "",
    is_active: true,
    allow_admin: true,
    sort_order: 0,
    contentful_space_id: "",
    contentful_delivery_token_secret: "CONTENTFUL_API_KEY",
    sanity_project_id: "",
    sanity_dataset: ""
  };
}
function emptyCategory(website_id) {
  return {
    website_id,
    name: "",
    is_active: true,
    sort_order: 0
  };
}
function WebsitesPage() {
  const listFn = useServerFn(listWebsiteTree);
  const upsertWebFn = useServerFn(upsertWebsite);
  const delWebFn = useServerFn(deleteWebsite);
  const upsertCatFn = useServerFn(upsertServiceCategory);
  const delCatFn = useServerFn(deleteServiceCategory);
  const qc = useQueryClient();
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin.websites.tree"],
    queryFn: () => listFn()
  });
  const [webForm, setWebForm] = reactExports.useState(null);
  const [catForm, setCatForm] = reactExports.useState(null);
  const [expanded, setExpanded] = reactExports.useState({});
  const websites = data?.websites ?? [];
  const categories = data?.categories ?? [];
  const services = data?.services ?? [];
  const byWebsite = reactExports.useMemo(() => {
    const m = {};
    for (const w of websites) {
      m[w.id] = {
        categories: [],
        unassigned: [],
        svcByCat: {}
      };
    }
    for (const c of categories) {
      m[c.website_id]?.categories.push(c);
      if (m[c.website_id]) m[c.website_id].svcByCat[c.id] = [];
    }
    for (const s of services) {
      const bucket = m[s.website_id];
      if (!bucket) continue;
      if (s.category_id && bucket.svcByCat[s.category_id]) bucket.svcByCat[s.category_id].push(s);
      else bucket.unassigned.push(s);
    }
    return m;
  }, [websites, categories, services]);
  async function refresh() {
    await qc.invalidateQueries({
      queryKey: ["admin.websites.tree"]
    });
    await qc.invalidateQueries({
      queryKey: ["admin.services"]
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "size-6" }),
          " Websites"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 mt-0.5", children: "Manage domains, service categories, and the services under each." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setWebForm(emptyWebsite()), className: "inline-flex items-center gap-1.5 rounded bg-slate-900 text-white px-3 py-1.5 text-sm hover:bg-slate-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
        " New Website"
      ] })
    ] }),
    webForm && /* @__PURE__ */ jsxRuntimeExports.jsxs(FormCard, { title: webForm.id ? "Edit website" : "Add website", onCancel: () => setWebForm(null), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Name", value: webForm.name, onChange: (v) => setWebForm({
          ...webForm,
          name: v
        }), placeholder: "Udyam Adhar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Domain (no https://, no www.)", value: webForm.domain, onChange: (v) => setWebForm({
          ...webForm,
          domain: v
        }), placeholder: "example.in" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Sort order", type: "number", value: String(webForm.sort_order), onChange: (v) => setWebForm({
          ...webForm,
          sort_order: Number(v) || 0
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: webForm.is_active, onChange: (e) => setWebForm({
            ...webForm,
            is_active: e.target.checked
          }) }),
          "Active"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-start gap-2 text-sm md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "mt-1", checked: webForm.allow_admin, onChange: (e) => setWebForm({
            ...webForm,
            allow_admin: e.target.checked
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Allow staff panel on this domain",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-xs text-slate-500", children: "Off = /admin and /admin-login return 404 on this domain. Keep it off for public-facing brand sites." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 mb-1", children: "Description (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: webForm.description ?? "", onChange: (e) => setWebForm({
            ...webForm,
            description: e.target.value
          }), rows: 2, placeholder: "Short internal note about this website", className: "w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900/10" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 border-t pt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2", children: "Contentful (per-site CMS)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Contentful Space ID", value: webForm.contentful_space_id ?? "", onChange: (v) => setWebForm({
              ...webForm,
              contentful_space_id: v
            }), placeholder: "Leave blank to use the project default" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 mb-1", children: "Delivery token secret" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: webForm.contentful_delivery_token_secret ?? "CONTENTFUL_API_KEY", onChange: (e) => setWebForm({
                ...webForm,
                contentful_delivery_token_secret: e.target.value
              }), className: "w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900/10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "CONTENTFUL_API_KEY", children: "CONTENTFUL_API_KEY (default connection)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "CONTENTFUL_API_KEY_1", children: "CONTENTFUL_API_KEY_1 (second connection)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "CONTENTFUL_API_KEY_2", children: "CONTENTFUL_API_KEY_2 (third connection)" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 border-t pt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2", children: "Sanity (live CMS)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Sanity Project ID", value: webForm.sanity_project_id ?? "", onChange: (v) => setWebForm({
              ...webForm,
              sanity_project_id: v
            }), placeholder: "519jq1ws" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Sanity Dataset", value: webForm.sanity_dataset ?? "", onChange: (v) => setWebForm({
              ...webForm,
              sanity_dataset: v
            }), placeholder: "production" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
          try {
            await upsertWebFn({
              data: webForm
            });
            await refresh();
            setWebForm(null);
          } catch (e) {
            alert(e.message);
          }
        }, className: "rounded bg-slate-900 text-white px-4 py-2 text-sm hover:bg-slate-800", children: "Save" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setWebForm(null), className: "rounded border px-4 py-2 text-sm", children: "Cancel" })
      ] })
    ] }),
    catForm && /* @__PURE__ */ jsxRuntimeExports.jsxs(FormCard, { title: catForm.id ? "Edit category" : "Add category", onCancel: () => setCatForm(null), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Category name", value: catForm.name, onChange: (v) => setCatForm({
          ...catForm,
          name: v
        }), placeholder: "Udyam / GST / FSSAI…" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Sort order", type: "number", value: String(catForm.sort_order), onChange: (v) => setCatForm({
          ...catForm,
          sort_order: Number(v) || 0
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: catForm.is_active, onChange: (e) => setCatForm({
            ...catForm,
            is_active: e.target.checked
          }) }),
          "Active"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
          try {
            await upsertCatFn({
              data: catForm
            });
            await refresh();
            setCatForm(null);
          } catch (e) {
            alert(e.message);
          }
        }, className: "rounded bg-slate-900 text-white px-4 py-2 text-sm hover:bg-slate-800", children: "Save" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCatForm(null), className: "rounded border px-4 py-2 text-sm", children: "Cancel" })
      ] })
    ] }),
    isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border bg-white p-6 text-center text-sm text-slate-500", children: "Loading…" }),
    !isLoading && websites.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-dashed bg-white p-8 text-center text-sm text-slate-500", children: [
      "No websites yet. Click ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "+ New Website" }),
      " to add one."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: websites.map((w) => {
      const bucket = byWebsite[w.id];
      const isOpen = expanded[w.id] ?? true;
      const totalServices = (bucket?.unassigned.length ?? 0) + Object.values(bucket?.svcByCat ?? {}).reduce((a, b) => a + b.length, 0);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-white overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2.5 bg-slate-50 border-b", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setExpanded((e) => ({
            ...e,
            [w.id]: !isOpen
          })), className: "p-1 hover:bg-slate-200 rounded", "aria-label": isOpen ? "Collapse" : "Expand", children: isOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "size-4 text-slate-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: w.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `https://${w.domain}`, target: "_blank", rel: "noopener noreferrer", className: "text-xs text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-0.5", children: [
                w.domain,
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "size-3" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-500", children: [
              bucket?.categories.length ?? 0,
              " categories · ",
              totalServices,
              " services"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { active: w.is_active }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setCatForm(emptyCategory(w.id)), className: "inline-flex items-center gap-1 rounded border px-2 py-1 text-xs hover:bg-white", title: "Add category", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FolderPlus, { className: "size-3.5" }),
            " Category"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/website-content/$websiteId", params: {
            websiteId: w.id
          }, className: "inline-flex items-center gap-1 px-2 py-1 text-xs rounded border border-slate-300 hover:bg-slate-200", title: "Edit site content (nav, footer, homepage)", children: "Content" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setWebForm({
            id: w.id,
            name: w.name,
            domain: w.domain,
            description: w.description ?? "",
            is_active: w.is_active,
            allow_admin: w.allow_admin ?? true,
            sort_order: w.sort_order,
            contentful_space_id: w.contentful_space_id ?? "",
            contentful_delivery_token_secret: w.contentful_delivery_token_secret ?? "CONTENTFUL_API_KEY",
            sanity_project_id: w.sanity_project_id ?? "",
            sanity_dataset: w.sanity_dataset ?? ""
          }), className: "p-1.5 hover:bg-slate-200 rounded", title: "Edit website", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-3.5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
            if (!confirm(`Delete website "${w.name}"? Only allowed when no services are attached.`)) return;
            try {
              await delWebFn({
                data: {
                  id: w.id
                }
              });
              await refresh();
            } catch (e) {
              alert(e.message);
            }
          }, className: "p-1.5 hover:bg-red-100 text-red-700 rounded", title: "Delete website", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }) })
        ] }),
        isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-3 space-y-3", children: [
          bucket?.categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2 bg-slate-50/60 border-b", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "size-4 text-amber-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: c.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-slate-500", children: [
                  bucket.svcByCat[c.id]?.length ?? 0,
                  " services"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { active: c.is_active }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCatForm({
                id: c.id,
                website_id: c.website_id,
                name: c.name,
                is_active: c.is_active,
                sort_order: c.sort_order
              }), className: "p-1 hover:bg-slate-200 rounded", title: "Edit", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-3.5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
                if (!confirm(`Delete category "${c.name}"? Services will be unlinked (not deleted).`)) return;
                try {
                  await delCatFn({
                    data: {
                      id: c.id
                    }
                  });
                  await refresh();
                } catch (e) {
                  alert(e.message);
                }
              }, className: "p-1 hover:bg-red-100 text-red-700 rounded", title: "Delete", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ServiceList, { services: bucket.svcByCat[c.id] ?? [] })
          ] }, c.id)),
          (bucket?.unassigned.length ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded border border-dashed", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2 bg-slate-50/40 border-b text-xs uppercase tracking-wide text-slate-500", children: "Uncategorised services" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ServiceList, { services: bucket?.unassigned ?? [] })
          ] }),
          (bucket?.categories.length ?? 0) === 0 && (bucket?.unassigned.length ?? 0) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-sm text-slate-500 py-4", children: [
            "No categories or services yet.",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/services", className: "text-indigo-600 hover:underline", children: "Add a service →" })
          ] })
        ] })
      ] }, w.id);
    }) })
  ] });
}
function ServiceList({
  services
}) {
  if (services.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-3 text-xs text-slate-400 italic", children: "No services in this category." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y", children: services.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2 px-3 py-2 hover:bg-slate-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "size-3.5 text-slate-400" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: s.service_name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 font-mono", children: s.service_code })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-600", children: [
      "₹",
      Number(s.total_amount).toFixed(0)
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { active: s.is_active }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/services/$serviceCode", params: {
      serviceCode: s.service_code
    }, className: "text-xs text-emerald-700 hover:underline", children: "Configure" })
  ] }, s.id)) });
}
function StatusPill({
  active
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium border ${active ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-slate-100 text-slate-600 border-slate-200"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `size-1.5 rounded-full ${active ? "bg-emerald-600" : "bg-slate-400"}` }),
    active ? "Active" : "Inactive"
  ] });
}
function FormCard({
  title,
  onCancel,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-white p-4 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onCancel, className: "text-xs text-slate-500 hover:text-slate-700", children: "Close" })
    ] }),
    children
  ] });
}
function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 mb-1", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type, value, placeholder, onChange: (e) => onChange(e.target.value), className: "w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900/10" })
  ] });
}
export {
  WebsitesPage as component
};
