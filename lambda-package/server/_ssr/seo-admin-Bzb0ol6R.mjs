import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { j as useServerFn, m as listAllSeoPages, n as getSitemapPageManagerData, s as submitAllPagesToSitemap, l as upsertSeoPage, o as deleteSeoPage, k as checkIsAdmin } from "./router-QgJicixe.mjs";
import { supabase } from "./client-BX5UfqqR.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import { G as Globe, R as RefreshCw, as as Send, e as ShieldAlert, l as CircleCheck, at as Funnel, au as ExternalLink } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__react-query.mjs";
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
const EMPTY = {
  slug: "",
  label: "",
  enabled: true,
  sort_order: 0
};
function SeoAdminPage() {
  const navigate = useNavigate();
  const list = useServerFn(listAllSeoPages);
  const getSitemapPages = useServerFn(getSitemapPageManagerData);
  const submitAllSitemap = useServerFn(submitAllPagesToSitemap);
  const upsert = useServerFn(upsertSeoPage);
  useServerFn(deleteSeoPage);
  const checkAdmin = useServerFn(checkIsAdmin);
  const [status, setStatus] = reactExports.useState("checking");
  const [activeTab, setActiveTab] = reactExports.useState("sitemap");
  const [pages, setPages] = reactExports.useState([]);
  const [sitemapItems, setSitemapItems] = reactExports.useState([]);
  const [form, setForm] = reactExports.useState(EMPTY);
  const [busy, setBusy] = reactExports.useState(false);
  const [submittingSitemap, setSubmittingSitemap] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [successMsg, setSuccessMsg] = reactExports.useState(null);
  const [filter, setFilter] = reactExports.useState("");
  const [sourceFilter, setSourceFilter] = reactExports.useState("ALL");
  const refresh = async () => {
    try {
      const [dbData, smData] = await Promise.all([list().catch(() => []), getSitemapPages().catch(() => [])]);
      setPages(dbData);
      setSitemapItems(smData);
    } catch (err) {
      setError(err.message || "Failed to load data");
    }
  };
  reactExports.useEffect(() => {
    let cancelled = false;
    (async () => {
      const {
        data
      } = await supabase.auth.getSession();
      if (!data.session) {
        if (!cancelled) setStatus("unauth");
        return;
      }
      try {
        const res = await checkAdmin();
        if (cancelled) return;
        if (!res.isAdmin) {
          setStatus("forbidden");
          return;
        }
        await refresh();
        if (!cancelled) setStatus("ready");
      } catch {
        if (!cancelled) setStatus("forbidden");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  const handleBulkSubmitSitemap = async () => {
    setSubmittingSitemap(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await submitAllSitemap();
      setSuccessMsg(`Successfully synced & submitted ${res.submitted} Contentful pages to sitemap!`);
      await refresh();
    } catch (err) {
      setError(err.message || "Failed to submit pages to sitemap");
    } finally {
      setSubmittingSitemap(false);
    }
  };
  const handleToggleSitemapPage = async (item) => {
    setBusy(true);
    try {
      const cleanSlug = item.slug.replace(/^\/+/, "");
      await upsert({
        data: {
          id: item.source === "Database SEO Page" ? item.id : void 0,
          slug: cleanSlug,
          label: item.label,
          enabled: !item.inSitemap,
          sort_order: 10
        }
      });
      setSuccessMsg(`Updated sitemap inclusion for ${item.slug}`);
      await refresh();
    } catch (err) {
      setError(err.message || "Failed to update page");
    } finally {
      setBusy(false);
    }
  };
  if (status === "checking") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-4xl px-4 py-12 text-sm text-gray-500", children: "Checking access…" });
  }
  if (status === "unauth") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-4 py-12 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-gray-800", children: "You need to sign in as an admin." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin-login", className: "mt-2 inline-block text-brand-navy underline font-medium", children: "Go to admin login →" })
    ] });
  }
  if (status === "forbidden") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-4 py-12 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-600 font-semibold", children: "Your account does not have admin permissions." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: async () => {
        await supabase.auth.signOut();
        navigate({
          to: "/admin-login"
        });
      }, className: "mt-3 rounded bg-brand-navy px-4 py-2 text-white text-xs font-semibold", children: "Sign out" })
    ] });
  }
  const filteredSitemapItems = sitemapItems.filter((item) => {
    const matchesQuery = !filter || item.slug.toLowerCase().includes(filter.toLowerCase()) || item.label.toLowerCase().includes(filter.toLowerCase());
    const matchesSource = sourceFilter === "ALL" || item.source === sourceFilter;
    return matchesQuery && matchesSource;
  });
  const totalPagesCount = sitemapItems.length;
  const inSitemapCount = sitemapItems.filter((i) => i.inSitemap).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-slate-50 text-slate-900 pb-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-slate-900 text-white border-b border-slate-800", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-5 h-5 text-emerald-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold tracking-tight", children: "Sitemap & Page Indexing Manager" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mt-1", children: "Manage 1-to-1 page indexing for sitemap.xml. Internal routes (/admin, /payment, /.well-known) are strictly hidden and excluded." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleBulkSubmitSitemap, disabled: submittingSitemap, className: "inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text.xs text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-50 transition", children: [
        submittingSitemap ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4" }),
        "Submit All Contentful Pages to Sitemap"
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6", children: [
      error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "w-5 h-5 text-red-600 flex-shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: error })
      ] }),
      successMsg && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 text-emerald-600 flex-shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: successMsg })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-emerald-50 text-emerald-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-slate-900", children: "Sensitive Paths Protected" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500 mt-0.5", children: [
              "Routes like ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "bg-slate-100 px-1 py-0.5 rounded", children: "/admin" }),
              ", ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "bg-slate-100 px-1 py-0.5 rounded", children: "/payment" }),
              ", ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "bg-slate-100 px-1 py-0.5 rounded", children: "/.well-known" }),
              ", and ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "bg-slate-100 px-1 py-0.5 rounded", children: "/mcp" }),
              " return 404 to public bots and are automatically excluded from sitemap.xml."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center px-3 py-1.5 rounded-lg bg-slate-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block font-bold text-slate-900 text-sm", children: totalPagesCount }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: "Public Pages" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block font-bold text-emerald-900 text-sm", children: inSitemapCount }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-700", children: "In Sitemap" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center border-b border-slate-200 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveTab("sitemap"), className: `pb-3 text-sm font-semibold border-b-2 transition ${activeTab === "sitemap" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-700"}`, children: [
          "Sitemap Pages List (",
          sitemapItems.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveTab("crud"), className: `pb-3 text-sm font-semibold border-b-2 transition ${activeTab === "crud" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-700"}`, children: "Add Custom SEO Page Slug" })
      ] }),
      activeTab === "sitemap" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full sm:w-80 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Search page slug or title...", value: filter, onChange: (e) => setFilter(e.target.value), className: "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-slate-900 focus:outline-none" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 w-full sm:w-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-3.5 h-3.5 text-slate-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: sourceFilter, onChange: (e) => setSourceFilter(e.target.value), className: "rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ALL", children: "All Sources" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Contentful CMS", children: "Contentful CMS" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Database SEO Page", children: "Database SEO Page" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Static Route", children: "Static Route" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: refresh, className: "rounded-lg border border-slate-300 bg-white p-2 text-slate-600 hover:bg-slate-50", title: "Refresh list", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs text-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-100 text-slate-600 uppercase font-semibold border-b border-slate-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Page Title / Slug" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Source" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Last Modified" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Sitemap Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Action" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-slate-200", children: filteredSitemapItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-4 py-8 text-center text-slate-500", children: "No pages match your filter." }) }) : filteredSitemapItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50 transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-900", children: item.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] font-mono text-slate-500 flex items-center gap-1 mt-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.slug }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: item.slug, target: "_blank", rel: "noreferrer", className: "text-slate-400 hover:text-slate-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3 h-3" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${item.source === "Contentful CMS" ? "bg-purple-50 text-purple-700 border border-purple-200" : item.source === "Database SEO Page" ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-gray-100 text-gray-700 border border-gray-200"}`, children: item.source }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-slate-500", children: item.lastmod }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: item.inSitemap ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3" }),
              " Included in Sitemap"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200", children: "Excluded" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleToggleSitemapPage(item), disabled: busy, className: `px-3 py-1 rounded text-xs font-semibold transition ${item.inSitemap ? "bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-800" : "bg-emerald-600 text-white hover:bg-emerald-500"}`, children: item.inSitemap ? "Exclude" : "Include" }) })
          ] }, item.id)) })
        ] }) })
      ] }),
      activeTab === "crud" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-slate-900", children: "Add or Edit Custom SEO Page Slug" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: async (e) => {
          e.preventDefault();
          setBusy(true);
          setError(null);
          try {
            await upsert({
              data: {
                id: form.id,
                slug: form.slug,
                label: form.label,
                enabled: form.enabled,
                sort_order: form.sort_order
              }
            });
            setForm(EMPTY);
            setSuccessMsg("Custom SEO page saved successfully.");
            await refresh();
          } catch (err) {
            setError(err.message || "Failed to save page");
          } finally {
            setBusy(false);
          }
        }, className: "space-y-4 max-w-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-semibold text-slate-700 mb-1", children: "Page Slug (URL Path)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "e.g. udyam-registration-certificate-download", value: form.slug, onChange: (e) => setForm({
              ...form,
              slug: e.target.value
            }), className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-slate-900 font-mono", required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-semibold text-slate-700 mb-1", children: "Page Label / Title" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "e.g. Udyam Registration Certificate Download Guide", value: form.label, onChange: (e) => setForm({
              ...form,
              label: e.target.value
            }), className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-slate-900", required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", id: "enabled-check", checked: form.enabled, onChange: (e) => setForm({
              ...form,
              enabled: e.target.checked
            }), className: "rounded border-slate-300 text-slate-900 focus:ring-slate-900" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "enabled-check", className: "text-xs font-medium text-slate-700", children: "Include in Sitemap & Enable Page" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: busy, className: "rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50", children: "Save SEO Page" }),
            form.id && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setForm(EMPTY), className: "rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100", children: "Cancel Edit" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  SeoAdminPage as component
};
