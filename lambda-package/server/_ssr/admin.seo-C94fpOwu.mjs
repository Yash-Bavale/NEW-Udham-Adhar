import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { j as useServerFn } from "./router-QgJicixe.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { G as Globe, R as RefreshCw, aB as Copy, au as ExternalLink, L as LoaderCircle, v as Search, ax as TriangleAlert, l as CircleCheck } from "../_libs/lucide-react.mjs";
import { o as object, s as string, b as boolean } from "../_libs/zod.mjs";
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
import "../_libs/date-fns.mjs";
import "../_libs/react-day-picker.mjs";
import "../_libs/date-fns__tz.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const listSitemapWebsites = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("83f9ebf8b7f99e8945909ea37614c16e76dc59de78a1b838e05496a15cbeef8b"));
const getSitemapManagerData = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => object({
  websiteId: string().uuid()
}).parse(input)).handler(createSsrRpc("7b3ce6f652105ed2102023205023891b0c7f4be4fdcd15ba1931be4948433a49"));
const setSitemapInclusion = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => object({
  websiteId: string().uuid(),
  slug: string().trim().min(1).max(300),
  included: boolean()
}).parse(input)).handler(createSsrRpc("b08fbdd9d88ccbe5e6a2b1eb82bfbe5632066df4623ed1444654c3482652d493"));
const checkLiveSitemap = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => object({
  websiteId: string().uuid()
}).parse(input)).handler(createSsrRpc("c0f2bf63f75667a3bd0890ba0e616e01daca561a9a899023d27d88c2e47e2622"));
const SOURCES = ["ALL", "Contentful CMS", "Database SEO Page", "Static Route"];
function SitemapManagerPage() {
  const sitesFn = useServerFn(listSitemapWebsites);
  const dataFn = useServerFn(getSitemapManagerData);
  const toggleFn = useServerFn(setSitemapInclusion);
  const checkFn = useServerFn(checkLiveSitemap);
  const qc = useQueryClient();
  const [websiteId, setWebsiteId] = reactExports.useState("");
  const [filter, setFilter] = reactExports.useState("");
  const [source, setSource] = reactExports.useState("ALL");
  const [check, setCheck] = reactExports.useState(null);
  const [checking, setChecking] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const sitesQ = useQuery({
    queryKey: ["admin.sitemap.sites"],
    queryFn: () => sitesFn()
  });
  const sites = sitesQ.data ?? [];
  const activeId = websiteId || sites[0]?.id || "";
  const activeSite = sites.find((s) => s.id === activeId);
  const pagesQ = useQuery({
    queryKey: ["admin.sitemap.pages", activeId],
    queryFn: () => dataFn({
      data: {
        websiteId: activeId
      }
    }),
    enabled: !!activeId
  });
  const items = pagesQ.data ?? [];
  const shown = reactExports.useMemo(() => {
    const f = filter.trim().toLowerCase();
    return items.filter((i) => (source === "ALL" || i.source === source) && (!f || i.slug.includes(f) || i.label.toLowerCase().includes(f)));
  }, [items, filter, source]);
  const includedCount = items.filter((i) => i.included).length;
  async function toggle(slug, included) {
    setError(null);
    try {
      await toggleFn({
        data: {
          websiteId: activeId,
          slug,
          included
        }
      });
      await qc.invalidateQueries({
        queryKey: ["admin.sitemap.pages", activeId]
      });
    } catch (e) {
      setError(e.message);
    }
  }
  async function runCheck() {
    setChecking(true);
    setError(null);
    setCheck(null);
    try {
      setCheck(await checkFn({
        data: {
          websiteId: activeId
        }
      }));
    } catch (e) {
      setError(e.message);
    } finally {
      setChecking(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "size-6" }),
          " Sitemap Manager"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 mt-0.5", children: "Every page across all websites, with live sitemap checking. Pages published in Contentful appear here and in the sitemap automatically." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => qc.invalidateQueries({
        queryKey: ["admin.sitemap.pages", activeId]
      }), className: "inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-sm hover:bg-slate-50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-4" }),
        " Refresh"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: sites.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
      setWebsiteId(s.id);
      setCheck(null);
    }, className: `rounded-full border px-4 py-1.5 text-sm ${s.id === activeId ? "bg-slate-900 text-white border-slate-900" : "bg-white hover:bg-slate-50"}`, children: [
      s.name,
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-60 ml-1.5 text-xs", children: s.domain })
    ] }, s.id)) }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm", children: error }),
    activeSite && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-white p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "rounded bg-slate-100 px-2 py-1 text-xs", children: activeSite.sitemapUrl }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => navigator.clipboard.writeText(activeSite.sitemapUrl), className: "inline-flex items-center gap-1 rounded border px-2 py-1 text-xs hover:bg-slate-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "size-3.5" }),
          " Copy"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: activeSite.sitemapUrl, target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-1 rounded border px-2 py-1 text-xs hover:bg-slate-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "size-3.5" }),
          " Open XML"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: runCheck, disabled: checking, className: "inline-flex items-center gap-1.5 rounded bg-slate-900 text-white px-3 py-1.5 text-sm hover:bg-slate-800 disabled:opacity-60", children: [
          checking ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4" }),
          "Check live sitemap"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500", children: "Submit this URL in Google Search Console → Sitemaps." })
      ] }),
      check && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "HTTP", value: String(check.status), bad: !check.ok }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "URLs", value: String(check.urlCount), bad: check.urlCount === 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Valid XML", value: check.parsed ? "Yes" : "No", bad: !check.parsed }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Missing", value: String(check.missing.length), bad: check.missing.length > 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Should be excluded", value: String(check.unexpected.length), bad: check.unexpected.length > 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Wrong host", value: String(check.wrongHost.length), bad: check.wrongHost.length > 0 })
        ] }),
        check.error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-red-700 flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-4" }),
          " ",
          check.error
        ] }),
        !check.error && check.missing.length === 0 && check.unexpected.length === 0 && check.wrongHost.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-emerald-700 flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4" }),
          " Live sitemap matches this website exactly."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(IssueList, { title: "Missing from live sitemap", items: check.missing }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(IssueList, { title: "Listed but excluded here", items: check.unexpected }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(IssueList, { title: "URLs on another host", items: check.wrongHost })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 border-b p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: filter, onChange: (e) => setFilter(e.target.value), placeholder: "Search slug or title…", className: "rounded border px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-slate-900/10" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: source, onChange: (e) => setSource(e.target.value), className: "rounded border px-3 py-1.5 text-sm", children: SOURCES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s === "ALL" ? "All sources" : s }, s)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-slate-500 ml-auto", children: [
          items.length,
          " pages · ",
          includedCount,
          " in sitemap ·",
          " ",
          items.length - includedCount,
          " excluded"
        ] })
      ] }),
      pagesQ.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-sm text-slate-500", children: "Loading pages…" }) : shown.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-sm text-slate-500", children: "No pages found." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-left text-xs uppercase text-slate-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Page" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Source" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2", children: "Last modified" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "In sitemap" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: shown.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: i.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: activeSite ? `https://${activeSite.domain}${i.slug}` : i.slug, target: "_blank", rel: "noreferrer", className: "text-xs text-slate-500 hover:underline", children: i.slug })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-slate-100 px-2 py-0.5 text-xs", children: i.source }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-xs text-slate-500", children: i.lastmod || "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-2 cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: i.included, onChange: (e) => toggle(i.slug, e.target.checked) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500", children: i.included ? "Included" : "Excluded" })
          ] }) })
        ] }, i.slug)) })
      ] }) })
    ] })
  ] });
}
function Stat({
  label,
  value,
  bad
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase text-slate-500", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `font-semibold ${bad ? "text-red-600" : "text-slate-900"}`, children: value })
  ] });
}
function IssueList({
  title,
  items
}) {
  if (items.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold uppercase text-slate-500 mb-1", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "max-h-48 overflow-y-auto rounded border bg-slate-50 p-2 text-xs space-y-0.5", children: items.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "font-mono", children: p }, p)) })
  ] });
}
export {
  SitemapManagerPage as component
};
