import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { j as useServerFn } from "./router-QgJicixe.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { F as FilterChip, S as SectionCard, T as TableSkeleton, b as StatusBadge } from "./ui-BVv-e2FI.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { v as Search, au as ExternalLink, ak as History, aO as Image, Q as FileText, D as Download, X } from "../_libs/lucide-react.mjs";
import { o as object, n as number, s as string } from "../_libs/zod.mjs";
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
import "../_libs/motion.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const FilterSchema = object({
  q: string().optional(),
  docType: string().optional(),
  status: string().optional(),
  limit: number().int().min(1).max(500).optional()
});
const listAllDocuments = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => FilterSchema.parse(i ?? {})).handler(createSsrRpc("fca32a96b48069d020f83144113a38487b271af9a04ccc4bc08ec77924394c18"));
const getDocumentSignedUrl = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  path: string().min(1)
}).parse(i)).handler(createSsrRpc("d05b611db77fb7cdd3c2dfecce657c3a154cfb520b2b66def6f7ebbcd8a1e086"));
const getDocumentVersions = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  docType: string(),
  leadId: string().uuid()
}).parse(i)).handler(createSsrRpc("dbb3a693497cad78d5e6db0526d3841c660eea21e060983617138bd55fa1e199"));
function fileIcon(mime) {
  if (mime?.startsWith("image/")) return /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "size-4" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-4" });
}
function DocumentsPage() {
  const listFn = useServerFn(listAllDocuments);
  const [docType, setDocType] = reactExports.useState();
  const [status, setStatus] = reactExports.useState();
  const [q, setQ] = reactExports.useState("");
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin.documents", {
      docType,
      status,
      q
    }],
    queryFn: () => listFn({
      data: {
        docType,
        status,
        q
      }
    }),
    refetchInterval: 6e4
  });
  const rows = data?.rows ?? [];
  const docTypes = data?.docTypes ?? [];
  const counts = reactExports.useMemo(() => {
    const c = {
      all: rows.length,
      approved: 0,
      pending: 0,
      rejected: 0
    };
    rows.forEach((r) => {
      if (r.status === "approved") c.approved++;
      else if (r.status === "rejected") c.rejected++;
      else c.pending++;
    });
    return c;
  }, [rows]);
  const [previewDoc, setPreviewDoc] = reactExports.useState(null);
  const [versionsFor, setVersionsFor] = reactExports.useState(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-medium tracking-tight", style: {
        color: "var(--admin-fg)"
      }, children: "Document Management" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: {
        color: "var(--admin-fg-muted)"
      }, children: "Every customer document, across every order. Preview, download, audit versions." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(FilterChip, { active: !status, onClick: () => setStatus(void 0), children: [
        "All (",
        counts.all,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(FilterChip, { active: status === "approved", onClick: () => setStatus("approved"), children: [
        "Approved (",
        counts.approved,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(FilterChip, { active: status === "pending", onClick: () => setStatus("pending"), children: [
        "Pending (",
        counts.pending,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(FilterChip, { active: status === "rejected", onClick: () => setStatus("rejected"), children: [
        "Rejected (",
        counts.rejected,
        ")"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionCard, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex flex-wrap items-center gap-3 border-b", style: {
        borderColor: "var(--admin-border)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-md border px-3 h-9 flex-1 min-w-[240px] max-w-md", style: {
          borderColor: "var(--admin-border)",
          background: "var(--admin-surface-2)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4", style: {
            color: "var(--admin-fg-muted)"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search file, customer, lead, order…", className: "flex-1 bg-transparent text-sm outline-none" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: docType ?? "", onChange: (e) => setDocType(e.target.value || void 0), className: "h-9 rounded-md border bg-transparent px-2 text-sm", style: {
          borderColor: "var(--admin-border)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All document types" }),
          docTypes.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t, children: t }, t))
        ] })
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableSkeleton, { rows: 8, cols: 6 }) : rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center text-sm", style: {
        color: "var(--admin-fg-muted)"
      }, children: "No documents match your filters." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "sticky top-0", style: {
          background: "var(--admin-surface-2)"
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left", style: {
          color: "var(--admin-fg-muted)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-4 font-medium text-[11px] uppercase tracking-wide", children: "Document" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-4 font-medium text-[11px] uppercase tracking-wide", children: "Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-4 font-medium text-[11px] uppercase tracking-wide", children: "Customer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-4 font-medium text-[11px] uppercase tracking-wide", children: "Order" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-4 font-medium text-[11px] uppercase tracking-wide", children: "Uploaded" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-4 font-medium text-[11px] uppercase tracking-wide", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2.5 px-4 font-medium text-[11px] uppercase tracking-wide text-right", children: "Action" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t", style: {
          borderColor: "var(--admin-border)",
          background: i % 2 ? "var(--admin-surface-2)" : "transparent"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 rounded-md p-1.5", style: {
              background: "var(--admin-surface)",
              color: "var(--admin-primary)"
            }, children: fileIcon(r.mime_type) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate font-medium", style: {
                color: "var(--admin-fg)"
              }, children: r.file_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px]", style: {
                color: "var(--admin-fg-muted)"
              }, children: [
                "v",
                r.version,
                " · ",
                r.mime_type
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-4", children: r.doc_type }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate max-w-[180px]", children: r.customer_name ?? r.lead_name ?? "—" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-4 font-mono text-xs", children: r.application_code ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-4 text-xs whitespace-nowrap", style: {
            color: "var(--admin-fg-muted)"
          }, children: new Date(r.uploaded_at).toLocaleDateString("en-IN") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: r.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPreviewDoc(r), className: "rounded-md p-1.5 hover:bg-[var(--admin-surface)]", title: "Preview", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "size-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setVersionsFor(r), className: "rounded-md p-1.5 hover:bg-[var(--admin-surface)]", title: "Version history", children: /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "size-3.5" }) })
          ] }) })
        ] }, r.id)) })
      ] }) })
    ] }),
    previewDoc && /* @__PURE__ */ jsxRuntimeExports.jsx(PreviewModal, { doc: previewDoc, onClose: () => setPreviewDoc(null) }),
    versionsFor && /* @__PURE__ */ jsxRuntimeExports.jsx(VersionsModal, { doc: versionsFor, onClose: () => setVersionsFor(null) })
  ] });
}
function PreviewModal({
  doc,
  onClose
}) {
  const signFn = useServerFn(getDocumentSignedUrl);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["doc-signed", doc.file_path],
    queryFn: () => signFn({
      data: {
        path: doc.file_path
      }
    })
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-5xl h-[85vh] rounded-lg flex flex-col", style: {
    background: "var(--admin-surface)"
  }, onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between px-4 py-3 border-b", style: {
      borderColor: "var(--admin-border)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-sm font-medium", style: {
          color: "var(--admin-fg)"
        }, children: doc.file_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px]", style: {
          color: "var(--admin-fg-muted)"
        }, children: [
          doc.doc_type,
          " · v",
          doc.version,
          " · ",
          doc.customer_name ?? doc.lead_name ?? "—"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        data?.url && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: data.url, target: "_blank", rel: "noopener noreferrer", download: doc.file_name, className: "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs", style: {
          borderColor: "var(--admin-border)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-3" }),
          " Download"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "rounded-md p-1.5 hover:bg-[var(--admin-surface-2)]", "aria-label": "Close", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto", style: {
      background: "var(--admin-bg)"
    }, children: isLoading || !data?.url ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-10 text-center text-sm", style: {
      color: "var(--admin-fg-muted)"
    }, children: "Loading preview…" }) : doc.mime_type?.startsWith("image/") ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: data.url, alt: doc.file_name, className: "mx-auto max-h-full" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { src: data.url, title: doc.file_name, className: "w-full h-full" }) })
  ] }) });
}
function VersionsModal({
  doc,
  onClose
}) {
  const fn = useServerFn(getDocumentVersions);
  const signFn = useServerFn(getDocumentSignedUrl);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["doc-versions", doc.doc_type, doc.lead_id],
    queryFn: () => fn({
      data: {
        docType: doc.doc_type,
        leadId: doc.lead_id
      }
    })
  });
  async function openVersion(path) {
    const {
      url
    } = await signFn({
      data: {
        path
      }
    });
    window.open(url, "_blank", "noopener,noreferrer");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-2xl rounded-lg", style: {
    background: "var(--admin-surface)"
  }, onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between px-4 py-3 border-b", style: {
      borderColor: "var(--admin-border)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium", style: {
          color: "var(--admin-fg)"
        }, children: [
          "Version history — ",
          doc.doc_type
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px]", style: {
          color: "var(--admin-fg-muted)"
        }, children: doc.customer_name ?? doc.lead_name ?? "—" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "rounded-md p-1.5 hover:bg-[var(--admin-surface-2)]", "aria-label": "Close", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[60vh] overflow-y-auto", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableSkeleton, { rows: 3, cols: 3 }) : (data?.versions ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-sm", style: {
      color: "var(--admin-fg-muted)"
    }, children: "No versions found." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y", style: {
      borderColor: "var(--admin-border)"
    }, children: data.versions.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "px-4 py-3 flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded bg-[var(--admin-surface-2)] px-1.5 py-0.5 text-[11px] font-mono", children: [
            "v",
            v.version
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", style: {
            color: "var(--admin-fg)"
          }, children: v.file_name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] mt-0.5", style: {
          color: "var(--admin-fg-muted)"
        }, children: [
          "Uploaded ",
          new Date(v.uploaded_at).toLocaleString("en-IN"),
          v.verified_at && ` · verified ${new Date(v.verified_at).toLocaleDateString("en-IN")}`
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: v.status }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => openVersion(v.file_path), className: "rounded-md border px-2 py-1 text-xs", style: {
          borderColor: "var(--admin-border)"
        }, children: "Open" })
      ] })
    ] }, v.id)) }) })
  ] }) });
}
export {
  DocumentsPage as component
};
