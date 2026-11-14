import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { j as useServerFn, a3 as useRealtimeTable } from "./router-QgJicixe.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { at as Funnel, L as LoaderCircle, b3 as FileCheckCorner, s as ChevronRight, E as Check, X, f as RotateCcw, D as Download } from "../_libs/lucide-react.mjs";
import { o as object, n as number, _ as _enum, s as string, d as any } from "../_libs/zod.mjs";
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
const STATUS_VALUES = ["pending", "approved", "rejected", "re_upload_requested"];
const listReviewDocuments = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((data) => object({
  status: _enum(STATUS_VALUES).optional(),
  limit: number().int().min(1).max(200).optional()
}).optional().parse(data ?? {})).handler(createSsrRpc("aa6aa250901ef03955b14659602fe5d7e436559550243cf8c0b0119642229fbd"));
const getDocumentSignedUrl = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((data) => object({
  documentId: string().uuid()
}).parse(data)).handler(createSsrRpc("c903b98c46cee4bd96d81d71f246de4a4d6d2d10e3c1ae5d1673bbb0ed546efa"));
const approveDocument = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => object({
  documentId: string().uuid(),
  comment: string().max(2e3).optional()
}).parse(data)).handler(createSsrRpc("fceb9da64309818a1d212ce197388584695884910b65324c14ea2f9d8918003b"));
const rejectDocument = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => object({
  documentId: string().uuid(),
  reason: string().min(2).max(2e3)
}).parse(data)).handler(createSsrRpc("006ca1a79a570bc72bd81c598005c1894e1ca6e8d3cad1341a68b673d4c0c889"));
createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((data) => object({
  applicationId: string().uuid()
}).parse(data)).handler(createSsrRpc("5b02e9b200a10df79f3b2eb56e7dc03f781959696691e24bb0b4620b28b10931"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator(object({
  submissionId: string().uuid(),
  fieldKey: string().min(1),
  value: any()
})).handler(createSsrRpc("2d4f9c39697474538e4632647ad3441fe75cd3ea2de23dc9e4580b5a9c861695"));
const requestDocumentReupload = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator(object({
  documentId: string().uuid(),
  reason: string().optional()
})).handler(createSsrRpc("ca0efa78a2921709400effdd574a61007c89e89f77ad52074b659ed03f82e423"));
function DocumentReviewPage() {
  const qc = useQueryClient();
  const [status, setStatus] = reactExports.useState("pending");
  const [selectedId, setSelectedId] = reactExports.useState(null);
  const [comment, setComment] = reactExports.useState("");
  const fetchList = useServerFn(listReviewDocuments);
  const {
    data,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ["review", "docs", status],
    queryFn: () => fetchList({
      data: {
        status,
        limit: 100
      }
    })
  });
  useRealtimeTable("documents", () => refetch());
  const rows = data?.rows ?? [];
  reactExports.useEffect(() => {
    if (rows.length === 0) setSelectedId(null);
    else if (!selectedId || !rows.find((r) => r.id === selectedId)) setSelectedId(rows[0].id);
  }, [rows.length, selectedId]);
  const selected = reactExports.useMemo(() => rows.find((r) => r.id === selectedId) ?? null, [rows, selectedId]);
  const approve = useServerFn(approveDocument);
  const reject = useServerFn(rejectDocument);
  const reupload = useServerFn(requestDocumentReupload);
  const approveMut = useMutation({
    mutationFn: (id) => approve({
      data: {
        documentId: id,
        comment: comment || void 0
      }
    }),
    onSuccess: () => {
      toast.success("Document approved");
      setComment("");
      qc.invalidateQueries({
        queryKey: ["review", "docs"]
      });
    },
    onError: (e) => toast.error(e?.message ?? "Failed to approve")
  });
  const rejectMut = useMutation({
    mutationFn: (id) => {
      if (!comment.trim()) throw new Error("Reason is required to reject");
      return reject({
        data: {
          documentId: id,
          reason: comment
        }
      });
    },
    onSuccess: () => {
      toast.success("Document rejected");
      setComment("");
      qc.invalidateQueries({
        queryKey: ["review", "docs"]
      });
    },
    onError: (e) => toast.error(e?.message ?? "Failed to reject")
  });
  const reuploadMut = useMutation({
    mutationFn: (id) => reupload({
      data: {
        documentId: id,
        reason: comment || void 0
      }
    }),
    onSuccess: () => {
      toast.success("Re-upload requested — email queued");
      setComment("");
      qc.invalidateQueries({
        queryKey: ["review", "docs"]
      });
    },
    onError: (e) => toast.error(e?.message ?? "Failed to request re-upload")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between gap-4 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", style: {
          color: "var(--admin-fg)"
        }, children: "Document Review" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", style: {
          color: "var(--admin-fg-muted)"
        }, children: "Three-pane reviewer · approve, reject, or request re-upload." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 rounded-lg border p-1", style: {
        borderColor: "var(--admin-border)",
        background: "var(--admin-surface)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-3.5 h-3.5 ml-1.5", style: {
          color: "var(--admin-fg-muted)"
        } }),
        ["pending", "re_upload_requested", "approved", "rejected"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStatus(s), className: "text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-md transition-colors", style: {
          background: status === s ? "var(--admin-surface-2)" : "transparent",
          color: status === s ? "var(--admin-fg)" : "var(--admin-fg-muted)"
        }, children: s.replace(/_/g, " ") }, s))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[320px_1fr_320px] gap-3 h-[calc(100vh-200px)] min-h-[560px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "rounded-xl border overflow-hidden flex flex-col", style: {
        borderColor: "var(--admin-border)",
        background: "var(--admin-surface)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "px-3 py-2 border-b flex items-center justify-between", style: {
          borderColor: "var(--admin-border)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold", style: {
            color: "var(--admin-fg)"
          }, children: [
            "Queue (",
            rows.length,
            ")"
          ] }),
          isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 animate-spin", style: {
            color: "var(--admin-fg-muted)"
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center text-xs", style: {
          color: "var(--admin-fg-muted)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileCheckCorner, { className: "w-5 h-5 mx-auto mb-2 opacity-50" }),
          "Nothing in this queue."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: rows.map((d) => {
          const active = d.id === selectedId;
          return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelectedId(d.id), className: "w-full text-left px-3 py-2 border-b transition-colors", style: {
            background: active ? "var(--admin-surface-2)" : "transparent",
            borderColor: "var(--admin-border)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded", style: {
                background: "var(--admin-surface-2)",
                color: "var(--admin-fg-muted)"
              }, children: d.doc_type }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-[10px]", style: {
                color: "var(--admin-fg-muted)"
              }, children: formatRelative(d.uploaded_at) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs font-medium truncate", style: {
              color: "var(--admin-fg)"
            }, children: d.lead?.name ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] truncate", style: {
              color: "var(--admin-fg-muted)"
            }, children: d.file_name })
          ] }) }, d.id);
        }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "rounded-xl border overflow-hidden flex flex-col", style: {
        borderColor: "var(--admin-border)",
        background: "var(--admin-surface)"
      }, children: selected ? /* @__PURE__ */ jsxRuntimeExports.jsx(DocumentViewer, { doc: selected }, selected.id) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 grid place-items-center text-sm", style: {
        color: "var(--admin-fg-muted)"
      }, children: "Select a document to review." }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "rounded-xl border overflow-hidden flex flex-col", style: {
        borderColor: "var(--admin-border)",
        background: "var(--admin-surface)"
      }, children: selected ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3 overflow-y-auto flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider", style: {
              color: "var(--admin-fg-muted)"
            }, children: "Document" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold mt-0.5 break-all", style: {
              color: "var(--admin-fg)"
            }, children: selected.doc_type }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] mt-0.5 break-all", style: {
              color: "var(--admin-fg-muted)"
            }, children: [
              selected.file_name,
              " · v",
              selected.version
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Status", value: selected.status.replace(/_/g, " ") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Uploaded", value: fmtDate(selected.uploaded_at) }),
          selected.verified_at && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Verified", value: fmtDate(selected.verified_at) }),
          selected.verification_comment && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Comment", value: selected.verification_comment }),
          selected.lead && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Lead", valueNode: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/leads/$leadId", params: {
            leadId: selected.lead.id
          }, className: "inline-flex items-center gap-1 hover:underline", style: {
            color: "var(--admin-accent)"
          }, children: [
            selected.lead.name,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3" })
          ] }) }),
          selected.application_id && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Application", valueNode: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/applications/$applicationId", params: {
            applicationId: selected.application_id
          }, className: "inline-flex items-center gap-1 hover:underline", style: {
            color: "var(--admin-accent)"
          }, children: [
            "Open command center ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] uppercase tracking-wider", style: {
              color: "var(--admin-fg-muted)"
            }, children: "Comment / reason" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: comment, onChange: (e) => setComment(e.target.value), rows: 4, placeholder: "Optional for approve · required for reject", className: "mt-1 w-full text-xs rounded-md border p-2 outline-none focus:ring-1", style: {
              background: "var(--admin-bg)",
              borderColor: "var(--admin-border)",
              color: "var(--admin-fg)"
            } })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "p-3 border-t grid grid-cols-3 gap-2", style: {
          borderColor: "var(--admin-border)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ActionButton, { onClick: () => approveMut.mutate(selected.id), busy: approveMut.isPending, icon: Check, label: "Approve", tone: "success" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ActionButton, { onClick: () => rejectMut.mutate(selected.id), busy: rejectMut.isPending, icon: X, label: "Reject", tone: "danger" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ActionButton, { onClick: () => reuploadMut.mutate(selected.id), busy: reuploadMut.isPending, icon: RotateCcw, label: "Re-upload", tone: "warn" })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 grid place-items-center text-xs", style: {
        color: "var(--admin-fg-muted)"
      }, children: "No selection" }) })
    ] })
  ] });
}
function DocumentViewer({
  doc
}) {
  const getUrl = useServerFn(getDocumentSignedUrl);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["review", "doc-url", doc.id],
    queryFn: () => getUrl({
      data: {
        documentId: doc.id
      }
    }),
    staleTime: 6e4 * 5
  });
  const isImage = doc.mime_type?.startsWith("image/");
  const isPdf = doc.mime_type === "application/pdf";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "px-4 py-2 border-b flex items-center justify-between gap-2", style: {
      borderColor: "var(--admin-border)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold truncate", style: {
          color: "var(--admin-fg)"
        }, children: doc.file_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px]", style: {
          color: "var(--admin-fg-muted)"
        }, children: [
          doc.mime_type,
          " · ",
          (doc.size_bytes / 1024).toFixed(1),
          " KB"
        ] })
      ] }),
      data?.url && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: data.url, target: "_blank", rel: "noopener noreferrer", download: doc.file_name, className: "inline-flex items-center gap-1 text-[11px] rounded-md border px-2 py-1 hover:bg-[var(--admin-surface-2)]", style: {
        borderColor: "var(--admin-border)",
        color: "var(--admin-fg)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3 h-3" }),
        " Download"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto", style: {
      background: "var(--admin-bg)"
    }, children: isLoading || !data?.url ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full grid place-items-center text-xs", style: {
      color: "var(--admin-fg-muted)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) }) : isPdf ? /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { src: data.url, title: doc.file_name, className: "w-full h-full bg-white" }) : isImage ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full grid place-items-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: data.url, alt: doc.file_name, className: "max-w-full max-h-full object-contain" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full grid place-items-center text-xs p-6 text-center", style: {
      color: "var(--admin-fg-muted)"
    }, children: "Preview unavailable for this file type. Use Download to inspect." }) })
  ] });
}
function Field({
  label,
  value,
  valueNode
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider", style: {
      color: "var(--admin-fg-muted)"
    }, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs mt-0.5", style: {
      color: "var(--admin-fg)"
    }, children: valueNode ?? value ?? "—" })
  ] });
}
function ActionButton({
  onClick,
  busy,
  icon: Icon,
  label,
  tone
}) {
  const color = tone === "success" ? "var(--admin-success)" : tone === "danger" ? "var(--admin-danger)" : "var(--admin-warn)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick, disabled: busy, className: "flex items-center justify-center gap-1.5 text-xs font-medium rounded-md border py-2 disabled:opacity-50 hover:bg-[var(--admin-surface-2)] transition-colors", style: {
    borderColor: "var(--admin-border)",
    color
  }, children: [
    busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-3.5 h-3.5" }),
    label
  ] });
}
function formatRelative(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 6e4);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}
function fmtDate(iso) {
  return new Date(iso).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}
export {
  DocumentReviewPage as component
};
