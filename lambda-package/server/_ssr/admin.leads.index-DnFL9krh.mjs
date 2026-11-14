import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { j as useServerFn, ba as listLeads, bb as getLeadCounts, aM as listStaff, _ as useRole, aE as usePermissions, ap as listServices, a7 as isVisibleService, bc as getLeadSourceBreakdown, bd as usePreserveScroll, a3 as useRealtimeTable, a4 as Tabs, a5 as TabsList, a6 as TabsTrigger, a0 as DateRangePicker, H as Button, be as getLead, bf as addLead, bg as findLeadByCodeOrId, P as Dialog, Q as DialogContent, U as DialogHeader, V as DialogTitle, W as Label, I as Input, $ as Textarea, X as DialogFooter, a as cn } from "./router-QgJicixe.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as istDateKey, b as istDayLabel, f as formatIST } from "./datetime-DvkGwlJs.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { l as listWebsiteTree } from "./websites-admin.functions-Czg-Mjvg.mjs";
import { f as fromTotal, a as fromBase } from "./gst-GVXtnpTB.mjs";
import { L as LEAD_STATUSES } from "./types-UrBsAyKK.mjs";
import { F as FilterChip, S as SectionCard, T as TableSkeleton, b as StatusBadge } from "./ui-BVv-e2FI.mjs";
import { m as motion } from "../_libs/motion.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { S as Sheet, a as SheetContent, b as SheetHeader, c as SheetTitle } from "./sheet-BttrtNAS.mjs";
import { I as INDIAN_STATES } from "./constants-CKRzJJF_.mjs";
import { supabase } from "./client-BX5UfqqR.mjs";
import { f as formatLeadSource } from "./format-lead-source-HeQb-2Bz.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { e as ShieldAlert, L as LoaderCircle, R as RefreshCw, f as RotateCcw, D as Download, aw as Plus, v as Search, X, J as Users, r as ChevronLeft, s as ChevronRight, bt as Tag, aa as UserCog, a as Mail, az as Trash2, au as ExternalLink } from "../_libs/lucide-react.mjs";
import { A as AnimatePresence } from "../_libs/framer-motion.mjs";
import { o as object, s as string, a as array, _ as _enum, b as boolean } from "../_libs/zod.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/cookie-es.mjs";
import "node:stream";
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
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
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
import "../_libs/isbot.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const IdsStatusInput = object({
  ids: array(string().uuid()).min(1).max(2e3),
  status: _enum(LEAD_STATUSES)
});
const bulkUpdateLeadStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => IdsStatusInput.parse(i)).handler(createSsrRpc("06fa2a3e0155782bc44d5284fad876fa8de2e7ac8e280c13f44601e6b6595875"));
const IdsAssignInput = object({
  ids: array(string().uuid()).min(1).max(2e3),
  assignee: string().uuid().nullable()
});
const bulkAssignLeads = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => IdsAssignInput.parse(i)).handler(createSsrRpc("ce1e068f5dcf99f7ea2b3a07492e1b45775a96328d70f1c69702279a892dac82"));
const IdsInput = object({
  ids: array(string().uuid()).min(1).max(500)
});
const bulkDeleteLeads = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => IdsInput.parse(i)).handler(createSsrRpc("d1016360f0aa2151eba677d792bd1549b83ef1f0313e829577a3549f7555b732"));
const BulkEmailInput = object({
  ids: array(string().uuid()).min(1).max(500),
  templateCode: string().min(1).max(80)
});
const bulkEmailLeads = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => BulkEmailInput.parse(i)).handler(createSsrRpc("88277d7574050c50789162cf1f7746c4c1bd631711e4c2ffa402c12f5068602c"));
const ExportInput = object({
  ids: array(string().uuid()).optional(),
  search: string().max(200).optional(),
  status: string().optional(),
  source: string().optional(),
  service: string().optional(),
  assignedTo: string().optional(),
  dateFrom: string().optional(),
  dateTo: string().optional()
}).partial();
const exportLeadsCsv = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => ExportInput.parse(i ?? {})).handler(createSsrRpc("2cb45762b7358a631b5702b66598c9526942e2f77228d0a1e3e2d15173e63c23"));
const listEnabledTemplates = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("5a48d0f5e390a8b600bd7325a16d41c6ad86391cdd8bfa0f7cfea416f1014652"));
const listAssignableStaff = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("d6ad71ae21406133fa959e553fabe4b46832fdf0cadfe84258c23eb0fe10f137"));
function BulkEmailDialog({ ids, onClose, onSent }) {
  const listFn = useServerFn(listEnabledTemplates);
  const sendFn = useServerFn(bulkEmailLeads);
  const { data } = useQuery({ queryKey: ["admin.templates.enabled"], queryFn: () => listFn() });
  const [code, setCode] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const [err, setErr] = reactExports.useState(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.97 },
      animate: { opacity: 1, scale: 1 },
      onClick: (e) => e.stopPropagation(),
      className: "w-full max-w-md rounded-xl border shadow-2xl",
      style: { background: "var(--admin-surface)", borderColor: "var(--admin-border)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-3 border-b", style: { borderColor: "var(--admin-border)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold", style: { color: "var(--admin-fg)" }, children: "Send bulk email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1 rounded hover:bg-[var(--admin-surface-2)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", style: { color: "var(--admin-fg-muted)" }, children: [
            "Sending to ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", style: { color: "var(--admin-fg)" }, children: ids.length }),
            " selected lead(s). Suppressed addresses will be skipped."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium", style: { color: "var(--admin-fg)" }, children: "Template" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: code,
              onChange: (e) => setCode(e.target.value),
              className: "w-full rounded-lg border px-3 py-2 text-sm",
              style: { background: "var(--admin-surface-2)", borderColor: "var(--admin-border)", color: "var(--admin-fg)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Select a template —" }),
                (data?.rows ?? []).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: t.code, children: [
                  t.name,
                  " (",
                  t.code,
                  ")"
                ] }, t.code))
              ]
            }
          ),
          err && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-rose-600", children: err })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 px-5 py-3 border-t", style: { borderColor: "var(--admin-border)" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "rounded-lg px-4 py-2 text-sm border", style: { borderColor: "var(--admin-border)", color: "var(--admin-fg)" }, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              disabled: !code || busy,
              onClick: async () => {
                setBusy(true);
                setErr(null);
                try {
                  const res = await sendFn({ data: { ids, templateCode: code } });
                  onSent(res);
                } catch (e) {
                  setErr(e.message);
                } finally {
                  setBusy(false);
                }
              },
              className: "rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 flex items-center gap-2",
              style: { background: "var(--admin-accent)" },
              children: [
                busy && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }),
                " Queue emails"
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
function LeadsBulkBar({
  selectedIds,
  onClear,
  onStatus,
  onAssign,
  onDelete,
  onExport,
  busy
}) {
  const [emailOpen, setEmailOpen] = reactExports.useState(false);
  const [statusOpen, setStatusOpen] = reactExports.useState(false);
  const [assignOpen, setAssignOpen] = reactExports.useState(false);
  const [exportOpen, setExportOpen] = reactExports.useState(false);
  const role = useRole();
  const staffFn = useServerFn(listAssignableStaff);
  const { data: staff } = useQuery({
    queryKey: ["admin.assignableStaff"],
    queryFn: () => staffFn(),
    enabled: assignOpen
  });
  const isAdmin = role.hasAny(["super_admin", "admin"]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { children: [
    selectedIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { y: 60, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: 60, opacity: 0 },
        transition: { type: "spring", stiffness: 320, damping: 28 },
        className: "fixed bottom-4 left-1/2 -translate-x-1/2 z-40 rounded-xl border shadow-xl flex items-center gap-1 px-2 py-2 backdrop-blur",
        style: { background: "var(--admin-surface)", borderColor: "var(--admin-border)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-3 text-sm font-medium", style: { color: "var(--admin-fg)" }, children: [
            selectedIds.length,
            " selected"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-px", style: { background: "var(--admin-border)" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PopBtn, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "size-4" }), label: "Status", onClick: () => {
            setStatusOpen(!statusOpen);
            setAssignOpen(false);
            setExportOpen(false);
          }, active: statusOpen }),
          isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(PopBtn, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(UserCog, { className: "size-4" }), label: "Assign", onClick: () => {
            setAssignOpen(!assignOpen);
            setStatusOpen(false);
            setExportOpen(false);
          }, active: assignOpen }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PopBtn, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-4" }), label: "Email", onClick: () => setEmailOpen(true) }),
          onExport && /* @__PURE__ */ jsxRuntimeExports.jsx(PopBtn, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4 text-emerald-600" }), label: "Export", onClick: () => {
            setExportOpen(!exportOpen);
            setStatusOpen(false);
            setAssignOpen(false);
          }, active: exportOpen }),
          isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(PopBtn, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }), label: "Delete", onClick: onDelete, danger: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClear, className: "ml-1 p-1.5 rounded hover:bg-[var(--admin-surface-2)]", "aria-label": "Clear selection", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) }),
          exportOpen && onExport && /* @__PURE__ */ jsxRuntimeExports.jsxs(Pop, { position: "up", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => {
                  setExportOpen(false);
                  onExport("csv");
                },
                className: "w-full text-left px-3 py-1.5 text-sm rounded hover:bg-[var(--admin-surface-2)] flex items-center gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[10px] bg-emerald-100 text-emerald-800 px-1 rounded", children: "CSV" }),
                  " CSV (.csv)"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => {
                  setExportOpen(false);
                  onExport("excel");
                },
                className: "w-full text-left px-3 py-1.5 text-sm rounded hover:bg-[var(--admin-surface-2)] flex items-center gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[10px] bg-emerald-100 text-emerald-800 px-1 rounded", children: "XLS" }),
                  " Excel (.xls)"
                ]
              }
            )
          ] }),
          assignOpen && (() => {
            const rawRows = staff?.rows;
            const rawProfiles = staff?.profiles;
            const list = Array.isArray(rawRows) ? rawRows : Array.isArray(rawProfiles) ? rawProfiles : [];
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(Pop, { position: "up", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    setAssignOpen(false);
                    onAssign(null);
                  },
                  className: "w-full text-left px-3 py-1.5 text-sm rounded hover:bg-[var(--admin-surface-2)]",
                  children: "Unassign"
                }
              ),
              list.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => {
                    setAssignOpen(false);
                    onAssign(u.id);
                  },
                  className: "w-full text-left px-3 py-1.5 text-sm rounded hover:bg-[var(--admin-surface-2)]",
                  children: u.name || u.display_name || u.email || "(unnamed)"
                },
                u.id
              )),
              staff && list.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2 text-xs", style: { color: "var(--admin-fg-muted)" }, children: "No staff found." })
            ] });
          })()
        ]
      }
    ),
    emailOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      BulkEmailDialog,
      {
        ids: selectedIds,
        onClose: () => setEmailOpen(false),
        onSent: () => {
          setEmailOpen(false);
          onClear();
        }
      }
    )
  ] });
}
function PopBtn({ icon, label, onClick, active, danger }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      onClick,
      className: `flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm transition ${active ? "bg-[var(--admin-surface-2)]" : "hover:bg-[var(--admin-surface-2)]"} ${danger ? "text-rose-600" : ""}`,
      style: { color: danger ? void 0 : "var(--admin-fg)" },
      children: [
        icon,
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
      ]
    }
  );
}
function Pop({ children, position = "up" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: position === "up" ? 6 : -6 },
      animate: { opacity: 1, y: 0 },
      className: "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 rounded-lg border shadow-lg p-1 min-w-[180px] max-h-72 overflow-y-auto",
      style: { background: "var(--admin-surface)", borderColor: "var(--admin-border)" },
      children
    }
  );
}
function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmWord,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger,
  loading,
  onConfirm
}) {
  const [typed, setTyped] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (!open) setTyped("");
  }, [open]);
  if (!open) return null;
  const armed = !confirmWord || typed.trim() === confirmWord;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm",
      onClick: () => !loading && onOpenChange(false),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          role: "dialog",
          "aria-modal": "true",
          className: "rounded-2xl bg-white shadow-2xl max-w-md w-full p-6",
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-slate-900", children: title }),
            description && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-sm text-slate-600", children: description }),
            confirmWord && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-medium uppercase tracking-wide text-slate-500", children: [
                "Type ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: confirmWord }),
                " to confirm"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  autoFocus: true,
                  value: typed,
                  onChange: (e) => setTyped(e.target.value),
                  className: "mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300",
                  disabled: loading
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center justify-end gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  disabled: loading,
                  onClick: () => onOpenChange(false),
                  className: "rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50",
                  children: cancelLabel
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  disabled: loading || !armed,
                  onClick: () => onConfirm(),
                  className: cn(
                    "rounded-xl px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-50",
                    danger ? "bg-red-600 hover:bg-red-700" : "bg-slate-900 hover:bg-slate-800"
                  ),
                  children: loading ? "Working…" : confirmLabel
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
const FilterJsonSchema = object({
  search: string().max(200).optional(),
  status: string().max(40).optional(),
  assignedTo: string().uuid().nullable().optional(),
  dateFrom: string().optional(),
  dateTo: string().optional()
}).partial();
const listSavedFilters = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("b25dd7970bedbdbdff7b3c458bcbdfe08487a7961a260d1d7052e9649ea40b23"));
const CreateInput = object({
  name: string().trim().min(1).max(80),
  filter_json: FilterJsonSchema,
  is_default: boolean().optional()
});
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => CreateInput.parse(i)).handler(createSsrRpc("4839d762df335f667e0b74d5aef107beacc0003ce45065551a880693e02b5f46"));
const UpdateInput = object({
  id: string().uuid(),
  name: string().trim().min(1).max(80).optional(),
  filter_json: FilterJsonSchema.optional(),
  is_default: boolean().optional()
});
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => UpdateInput.parse(i)).handler(createSsrRpc("a530035146e8ddda76500756657e0953cb7b950eee253147a9631c1ed73831f7"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid()
}).parse(i)).handler(createSsrRpc("d3447064a35da20230170714e09da71fe23e6ab0445238d746cad37ec7383e5d"));
function formatAge(ms) {
  if (!Number.isFinite(ms) || ms < 0) return "just now";
  const s = Math.floor(ms / 1e3);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
const RANGE_PRESETS = [{
  value: "all",
  label: "All"
}, {
  value: "today",
  label: "Today"
}, {
  value: "yesterday",
  label: "Yesterday"
}, {
  value: "7d",
  label: "7 days"
}, {
  value: "15d",
  label: "15 days"
}, {
  value: "30d",
  label: "30 days"
}, {
  value: "mtd",
  label: "This month"
}, {
  value: "custom",
  label: "Custom"
}];
function LeadsPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const listFn = useServerFn(listLeads);
  const countsFn = useServerFn(getLeadCounts);
  const exportFn = useServerFn(exportLeadsCsv);
  const statusFn = useServerFn(bulkUpdateLeadStatus);
  const assignFn = useServerFn(bulkAssignLeads);
  const deleteFn = useServerFn(bulkDeleteLeads);
  const savedFn = useServerFn(listSavedFilters);
  const staffFn = useServerFn(listStaff);
  const [page, setPage] = reactExports.useState(1);
  const [searchInput, setSearchInput] = reactExports.useState("");
  const [search, setSearch] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("");
  const [source, setSource] = reactExports.useState("");
  const [assignee, setAssignee] = reactExports.useState("");
  const [service, setService] = reactExports.useState("");
  const [websiteId, setWebsiteId] = reactExports.useState("");
  const [dateFrom, setDateFrom] = reactExports.useState("");
  const [dateTo, setDateTo] = reactExports.useState("");
  const [datePreset, setDatePreset] = reactExports.useState("all");
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [busy, setBusy] = reactExports.useState(false);
  const [defaultApplied, setDefaultApplied] = reactExports.useState(false);
  const [openId, setOpenId] = reactExports.useState(null);
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = reactExports.useState(false);
  const [currentUserId, setCurrentUserId] = reactExports.useState("");
  const [expandedChannel, setExpandedChannel] = reactExports.useState(null);
  const [exporting, setExporting] = reactExports.useState(null);
  const [exportOpen, setExportOpen] = reactExports.useState(false);
  const role = useRole();
  const userPerms = usePermissions();
  const handleExport = async (format, idsToExport) => {
    setExporting(format);
    setExportOpen(false);
    try {
      const res = await exportFn({
        data: {
          ids: idsToExport && idsToExport.length > 0 ? idsToExport : void 0,
          search: search || void 0,
          status: status || void 0,
          service: service || void 0,
          source: source || void 0,
          assignedTo: assignee || void 0,
          dateFrom: dateFrom || void 0,
          dateTo: dateTo || void 0
        }
      });
      if (!res.count) {
        toast.error("No leads match the selected export criteria.");
        return;
      }
      const content = format === "excel" ? res.excelXml : res.csv;
      const mime = format === "excel" ? "application/vnd.ms-excel;charset=utf-8" : "text/csv;charset=utf-8";
      const ext = format === "excel" ? "xls" : "csv";
      const blob = new Blob([content], {
        type: mime
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads_export_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Exported ${res.count} lead(s) to ${format.toUpperCase()}`);
    } catch (e) {
      toast.error(e?.message || `Export failed`);
    } finally {
      setExporting(null);
    }
  };
  reactExports.useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const st = sp.get("status");
    const flt = sp.get("filter");
    if (st && LEAD_STATUSES.includes(st)) {
      setStatus(st);
      setDefaultApplied(true);
      return;
    }
    if (flt === "not_contacted") {
      setStatus("new_lead");
      setDefaultApplied(true);
    } else if (flt === "converted") {
      setStatus("payment_successful");
      setDefaultApplied(true);
    } else if (flt === "contacted") {
      setStatus("contacted");
      setDefaultApplied(true);
    }
  }, []);
  reactExports.useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);
  reactExports.useEffect(() => {
    supabase.auth.getUser().then(({
      data: data2
    }) => {
      const uid = data2.user?.id ?? "";
      setCurrentUserId(uid);
      if (role.hasAny(["super_admin", "admin"])) {
        setAssignee("");
      } else if (uid && !defaultApplied) {
        setAssignee(uid);
      }
    });
  }, [role.roles.join(",")]);
  const servicesFn = useServerFn(listServices);
  const {
    data: servicesData
  } = useQuery({
    queryKey: ["admin.services"],
    queryFn: () => servicesFn()
  });
  const groupedServices = reactExports.useMemo(() => {
    const raw = servicesData?.rows ?? [];
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
  }, [servicesData]);
  const websiteTreeFn = useServerFn(listWebsiteTree);
  const {
    data: websiteTreeData
  } = useQuery({
    queryKey: ["admin.websiteTree"],
    queryFn: () => websiteTreeFn()
  });
  const sourceBreakdownFn = useServerFn(getLeadSourceBreakdown);
  const {
    data: sourceData
  } = useQuery({
    queryKey: ["admin.leads.sourceBreakdown"],
    queryFn: () => sourceBreakdownFn(),
    staleTime: 6e4
  });
  const {
    data: savedData
  } = useQuery({
    queryKey: ["admin.savedFilters"],
    queryFn: () => savedFn()
  });
  reactExports.useEffect(() => {
    if (defaultApplied || !savedData) return;
    const def = savedData.rows.find((r) => r.is_default);
    if (def) {
      const f = def.filter_json;
      setSearchInput(f.search ?? "");
      setSearch(f.search ?? "");
      setStatus(f.status ?? "");
    }
    setDefaultApplied(true);
  }, [savedData, defaultApplied]);
  const {
    data: countsData
  } = useQuery({
    queryKey: ["admin.leadCounts"],
    queryFn: () => countsFn()
  });
  const {
    data: staffData
  } = useQuery({
    queryKey: ["admin.staff"],
    queryFn: () => staffFn()
  });
  const staffProfiles = reactExports.useMemo(() => {
    if (Array.isArray(staffData)) return staffData;
    if (Array.isArray(staffData?.profiles)) return staffData.profiles;
    if (Array.isArray(staffData?.staff)) return staffData.staff;
    return [];
  }, [staffData]);
  reactExports.useMemo(() => ({
    search: search || void 0,
    status: status || void 0
  }), [search, status]);
  const [, setTick] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 15e3);
    return () => clearInterval(timer);
  }, []);
  const applyDatePreset = (p) => {
    setDatePreset(p);
    setPage(1);
    const now = /* @__PURE__ */ new Date();
    const tKey = istDateKey(now);
    if (p === "all") {
      setDateFrom("");
      setDateTo("");
    } else if (p === "today") {
      setDateFrom(tKey);
      setDateTo(tKey);
    } else if (p === "yesterday") {
      const yKey = istDateKey(new Date(now.getTime() - 864e5));
      setDateFrom(yKey);
      setDateTo(yKey);
    } else if (p === "7d") {
      const startKey = istDateKey(new Date(now.getTime() - 6 * 864e5));
      setDateFrom(startKey);
      setDateTo(tKey);
    } else if (p === "15d") {
      const startKey = istDateKey(new Date(now.getTime() - 14 * 864e5));
      setDateFrom(startKey);
      setDateTo(tKey);
    } else if (p === "30d") {
      const startKey = istDateKey(new Date(now.getTime() - 29 * 864e5));
      setDateFrom(startKey);
      setDateTo(tKey);
    } else if (p === "mtd") {
      const ist = new Date(now.getTime() + 5.5 * 3600 * 1e3);
      const monthStart = new Date(Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), 1));
      setDateFrom(istDateKey(monthStart));
      setDateTo(tKey);
    }
  };
  const dateRangeValue = reactExports.useMemo(() => ({
    from: dateFrom ? new Date(dateFrom.includes("T") ? dateFrom : `${dateFrom}T00:00:00+05:30`) : void 0,
    to: dateTo ? new Date(dateTo.includes("T") ? dateTo : `${dateTo}T23:59:59+05:30`) : void 0
  }), [dateFrom, dateTo]);
  const isFilterActive = Boolean(search || status || source || (role.hasAny(["super_admin", "admin"]) ? assignee : assignee !== currentUserId) || service || websiteId || dateFrom || dateTo || datePreset !== "all");
  const resetFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatus("");
    setSource("");
    setAssignee(role.hasAny(["super_admin", "admin"]) ? "" : currentUserId);
    setService("");
    setWebsiteId("");
    setDateFrom("");
    setDateTo("");
    setDatePreset("all");
    setPage(1);
  };
  const {
    data,
    isLoading,
    isFetching
  } = useQuery({
    queryKey: ["admin.leads", page, search, status, source, assignee, service, websiteId, dateFrom, dateTo],
    queryFn: () => listFn({
      data: {
        page,
        pageSize: 25,
        search: search || void 0,
        status: status || void 0,
        source: source || void 0,
        service: service || void 0,
        assignee: assignee || void 0,
        websiteId: websiteId || void 0,
        dateFrom: dateFrom || void 0,
        dateTo: dateTo || void 0
      }
    }),
    refetchInterval: 6e4
  });
  const rows = data?.rows ?? [];
  usePreserveScroll("admin.leads", !isLoading);
  const refresh = () => {
    qc.invalidateQueries({
      queryKey: ["admin.leads"]
    });
    qc.invalidateQueries({
      queryKey: ["admin.leadCounts"]
    });
  };
  useRealtimeTable("leads", refresh);
  const clearSel = () => setSelected(/* @__PURE__ */ new Set());
  const allOnPage = rows.map((l) => l.id);
  const allSelected = allOnPage.length > 0 && allOnPage.every((id) => selected.has(id));
  const counts = countsData?.counts ?? {};
  const handleBulkStatus = async (s) => {
    setBusy(true);
    try {
      await statusFn({
        data: {
          ids: Array.from(selected),
          status: s
        }
      });
      clearSel();
      refresh();
    } finally {
      setBusy(false);
    }
  };
  const handleBulkAssign = async (a) => {
    setBusy(true);
    try {
      await assignFn({
        data: {
          ids: Array.from(selected),
          assignee: a
        }
      });
      clearSel();
      refresh();
    } finally {
      setBusy(false);
    }
  };
  const handleBulkDelete = () => setConfirmDeleteOpen(true);
  const performBulkDelete = async () => {
    setBusy(true);
    try {
      const res = await deleteFn({
        data: {
          ids: Array.from(selected)
        }
      });
      toast.success(`Deleted ${res.deleted} lead(s)${res.blocked ? ` — skipped ${res.blocked} with payments` : ""}.`);
      clearSel();
      refresh();
      setConfirmDeleteOpen(false);
    } catch (e) {
      toast.error(e?.message ?? "Bulk delete failed");
    } finally {
      setBusy(false);
    }
  };
  if (!userPerms.isLoading && !userPerms.can("leads", "view")) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center bg-white rounded-xl border border-slate-200 space-y-3 my-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "size-10 text-rose-500 mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-slate-900", children: "Access Denied" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 max-w-md mx-auto", children: "You do not have permission to view the Leads module. Please contact your administrator if you need access." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight text-slate-900", children: "Leads" }),
          isFetching && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full animate-pulse", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3 animate-spin text-indigo-600" }),
            " Updating…"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500 mt-0.5", children: [
          data?.total ?? 0,
          " total records"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tabs, { value: datePreset, onValueChange: (v) => applyDatePreset(v), children: /* @__PURE__ */ jsxRuntimeExports.jsx(TabsList, { className: "h-9", children: RANGE_PRESETS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: p.value, className: "text-xs px-2.5", children: p.label }, p.value)) }) }),
        datePreset === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsx(DateRangePicker, { value: dateRangeValue, onChange: (range) => {
          if (!range.from) {
            setDateFrom("");
            setDateTo("");
          } else {
            setDateFrom(istDateKey(range.from));
            setDateTo(range.to ? istDateKey(range.to) : istDateKey(range.from));
          }
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => {
          refresh();
          toast.success("Refreshing leads…");
        }, className: "h-9 gap-1.5 text-xs text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border-slate-200 shadow-2xs", title: "Refresh leads", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `size-3.5 ${isFetching && !isLoading ? "animate-spin text-indigo-600" : "text-slate-500"}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Refresh" })
        ] }),
        isFilterActive && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: resetFilters, className: "inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "size-3.5" }),
          " Reset Filters"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setExportOpen(!exportOpen), disabled: !!exporting, className: "inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-2xs cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-3.5 text-emerald-600" }),
            exporting ? "Exporting…" : "Export"
          ] }),
          exportOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-0 mt-1 w-48 rounded-lg border border-slate-200 bg-white shadow-lg py-1 z-30 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => handleExport("csv"), className: "w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer text-slate-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded", children: "CSV" }),
              " CSV Spreadsheet (.csv)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => handleExport("excel"), className: "w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer text-slate-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded", children: "XLS" }),
              " Excel Spreadsheet (.xls)"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setShowAdd(true), className: "inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium text-white hover:opacity-90 shadow-2xs cursor-pointer", style: {
          background: "var(--admin-primary)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }),
          " Add Lead"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap w-full max-w-full items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(FilterChip, { active: status === "" && !assignee, onClick: () => {
        setStatus("");
        setAssignee("");
        setPage(1);
      }, children: [
        "All ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 opacity-60", children: [
          "(",
          counts.all ?? 0,
          ")"
        ] })
      ] }),
      currentUserId && role.hasAny(["super_admin", "admin"]) && /* @__PURE__ */ jsxRuntimeExports.jsx(FilterChip, { active: assignee === currentUserId, onClick: () => {
        setAssignee(assignee === currentUserId ? "" : currentUserId);
        setPage(1);
      }, children: "My Leads" }),
      LEAD_STATUSES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FilterChip, { active: status === s, onClick: () => {
        setStatus(s);
        setPage(1);
      }, children: [
        s.replace(/_/g, " "),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 opacity-60", children: [
          "(",
          counts[s] ?? 0,
          ")"
        ] })
      ] }, s))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-slate-200 bg-white p-3 shadow-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2.5 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-w-[220px] max-w-xs flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: searchInput, onChange: (e) => setSearchInput(e.target.value), placeholder: "Search code, name, email, mobile…", className: "h-9 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-8 pr-7 text-xs text-slate-900 outline-none focus:bg-white focus:border-slate-300 focus:ring-1 focus:ring-slate-300" }),
        searchInput && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
          setSearchInput("");
          setSearch("");
        }, className: "absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: websiteId, onChange: (e) => {
        setWebsiteId(e.target.value);
        setPage(1);
      }, className: "h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 text-xs text-slate-700 outline-none focus:bg-white focus:border-slate-300 focus:ring-1 focus:ring-slate-300 max-w-[170px] truncate", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All websites" }),
        (websiteTreeData?.websites ?? []).map((w) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: w.id, children: w.name }, w.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: source, onChange: (e) => {
        setSource(e.target.value);
        setPage(1);
        expandedChannel && setExpandedChannel(null);
      }, className: "h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 text-xs text-slate-700 outline-none focus:bg-white focus:border-slate-300 focus:ring-1 focus:ring-slate-300 max-w-[200px] truncate", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All sources" }),
        (sourceData?.channels ?? []).map((ch) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: `__channel:${ch.key}`, children: [
          ch.icon,
          " ",
          ch.label,
          " (",
          ch.count,
          ")"
        ] }, ch.key)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("optgroup", { label: "── Specific sources ──", children: (sourceData?.items ?? []).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: item.value, children: [
          item.label,
          " (",
          item.count,
          ")"
        ] }, item.value)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: service, onChange: (e) => {
        setService(e.target.value);
        setPage(1);
      }, className: "h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 text-xs text-slate-700 outline-none focus:bg-white focus:border-slate-300 focus:ring-1 focus:ring-slate-300 max-w-[220px] truncate", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All active services" }),
        groupedServices.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx("optgroup", { label: "Udyam Aadhar Services", children: g.services.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.service_name, children: s.service_name }, s.id)) }, g.id))
      ] }),
      role.hasAny(["super_admin", "admin"]) && /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: assignee, onChange: (e) => {
        setAssignee(e.target.value);
        setPage(1);
      }, className: "h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 text-xs text-slate-700 outline-none focus:bg-white focus:border-slate-300 focus:ring-1 focus:ring-slate-300 max-w-[180px] truncate", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All assignees" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "__unassigned", children: "Unassigned" }),
        staffProfiles.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p.id, children: p.display_name || p.name || p.email }, p.id))
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableSkeleton, { rows: 8, cols: 7 }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { style: {
        background: "var(--admin-surface-2)"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-[11px] uppercase tracking-wide", style: {
        color: "var(--admin-fg-muted)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: allSelected, onChange: () => {
          const next = new Set(selected);
          if (allSelected) allOnPage.forEach((id) => next.delete(id));
          else allOnPage.forEach((id) => next.add(id));
          setSelected(next);
        } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left font-medium", children: "Lead ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left font-medium", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left font-medium", children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left font-medium", children: "Mobile" }),
        role.hasAny(["super_admin", "admin"]) && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left font-medium", children: "Source" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left font-medium", children: "Service" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left font-medium", children: "Current Stage" }),
        role.hasAny(["super_admin", "admin"]) && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left font-medium", children: "Assignee" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        rows.map((l, idx) => {
          const dKey = istDateKey(l.created_at);
          const prevKey = idx > 0 ? istDateKey(rows[idx - 1].created_at) : "";
          const showSep = dKey && dKey !== prevKey;
          const checked = selected.has(l.id);
          const ageMs = Date.now() - new Date(l.created_at).getTime();
          const stale = !l.assigned_to && ageMs > 24 * 60 * 60 * 1e3;
          const rowBg = checked ? "var(--admin-surface-2)" : stale ? "rgba(251, 191, 36, 0.08)" : void 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Fragment, { children: [
            showSep && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 12, className: "px-4 py-1.5 bg-slate-900 text-white text-[11px] uppercase tracking-wider font-semibold", children: istDayLabel(l.created_at) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { onClick: (e) => {
              if (e.target.closest("input,a,button,select,textarea,label,[data-no-row-click]")) return;
              const sel = typeof window !== "undefined" ? window.getSelection?.() : null;
              if (sel && sel.toString().trim().length > 0) return;
              navigate({
                to: "/admin/leads/$leadId",
                params: {
                  leadId: l.id
                }
              });
            }, className: "border-t cursor-pointer hover:bg-[var(--admin-surface-2)] transition-colors", style: {
              borderColor: "var(--admin-border)",
              background: rowBg,
              borderLeft: stale ? "3px solid #F59E0B" : void 0
            }, title: stale ? "Unassigned for over 24h" : void 0, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked, onChange: () => {
                const next = new Set(selected);
                if (checked) next.delete(l.id);
                else next.add(l.id);
                setSelected(next);
              } }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-mono text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", style: {
                color: "var(--admin-accent)"
              }, children: l.lead_code }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs whitespace-nowrap", style: {
                color: "var(--admin-fg-muted)"
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: formatIST(l.created_at, {
                    dateOnly: true
                  }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-slate-400", children: [
                    formatIST(l.created_at, {
                      timeOnly: true
                    }),
                    " IST"
                  ] })
                ] }),
                (l.status === "new_lead" || l.status === "lead_created" || !l.status) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200", title: "Time since lead created", children: formatAge(ageMs) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: l.name }),
                l.is_duplicate && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200", title: "Same mobile/email submitted again — original lead exists", children: "REPEAT" }),
                (l.duplicate_count ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200", title: `Customer resubmitted ${l.duplicate_count} more time(s) after this lead`, children: [
                  "×",
                  (l.duplicate_count ?? 0) + 1
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-sm font-semibold text-slate-900 whitespace-nowrap tracking-wide", children: l.mobile || "—" }),
              role.hasAny(["super_admin", "admin"]) && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs max-w-[260px]", style: {
                color: "var(--admin-fg-muted)"
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 items-start", children: [
                l.website_name && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${l.website_name.toLowerCase().includes("registration") ? "bg-sky-50 text-sky-700 border-sky-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-1.5 rounded-full bg-current" }),
                  l.website_name
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] leading-tight break-words text-slate-600", title: l.lead_source || "", children: formatLeadSource(l.lead_source) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs min-w-[240px] whitespace-normal break-words", style: {
                color: "var(--admin-fg-muted)"
              }, title: l.service || "", children: l.service || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: l.status }) }),
              role.hasAny(["super_admin", "admin"]) && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-xs", style: {
                color: "var(--admin-fg-muted)"
              }, children: l.assignee_name || (l.assigned_to ? "—" : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic", children: "Unassigned" })) })
            ] }, l.id)
          ] }, l.id);
        }),
        rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 12, className: "px-3 py-12 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2", style: {
          color: "var(--admin-fg-muted)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-8 opacity-40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: "No leads match your filters" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs", children: "Try clearing filters, or use “Add Lead” to create one." })
        ] }) }) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: page <= 1, onClick: () => setPage(page - 1), className: "flex items-center gap-1 rounded-lg border px-3 py-1.5 disabled:opacity-40 hover:bg-[var(--admin-surface-2)]", style: {
        borderColor: "var(--admin-border)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "size-4" }),
        " Prev"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        color: "var(--admin-fg-muted)"
      }, children: [
        "Page ",
        page,
        " of ",
        Math.max(1, Math.ceil((data?.total ?? 0) / 25))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: !data || page * 25 >= (data.total ?? 0), onClick: () => setPage(page + 1), className: "flex items-center gap-1 rounded-lg border px-3 py-1.5 disabled:opacity-40 hover:bg-[var(--admin-surface-2)]", style: {
        borderColor: "var(--admin-border)"
      }, children: [
        "Next ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LeadsBulkBar, { selectedIds: Array.from(selected), onClear: clearSel, onStatus: handleBulkStatus, onAssign: handleBulkAssign, onDelete: handleBulkDelete, onExport: (fmt) => handleExport(fmt, Array.from(selected)), busy }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LeadDetailSheet, { leadId: openId, onClose: () => setOpenId(null) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AddLeadDialog, { open: showAdd, onOpenChange: setShowAdd, staff: staffProfiles, onCreated: refresh }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ConfirmModal, { open: confirmDeleteOpen, onOpenChange: setConfirmDeleteOpen, title: `Delete ${selected.size} lead${selected.size === 1 ? "" : "s"}?`, description: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "This permanently removes the selected lead",
        selected.size === 1 ? "" : "s",
        " and all associated notes."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-700", children: "Leads with linked payments will be skipped automatically." })
    ] }), confirmWord: "DELETE", confirmLabel: "Delete leads", danger: true, loading: busy, onConfirm: performBulkDelete })
  ] });
}
function LeadDetailSheet({
  leadId,
  onClose
}) {
  const getFn = useServerFn(getLead);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin.leadQuick", leadId],
    queryFn: () => getFn({
      data: {
        id: leadId
      }
    }),
    enabled: !!leadId
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open: !!leadId, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { side: "right", className: "w-full sm:max-w-md overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { children: "Lead Details" }) }),
    isLoading || !data ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-10 text-center text-sm text-muted-foreground", children: "Loading…" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-4 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs text-muted-foreground", children: data.lead.lead_code }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold", children: data.lead.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: data.lead.status })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", value: data.lead.email }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Mobile", value: data.lead.mobile }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "State", value: data.lead.state }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Language", value: data.lead.language }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Source", value: formatLeadSource(data.lead.lead_source) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Interested Service", value: data.lead.service }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Total Amount", value: `₹${Number(data.lead.total_amount || 0).toLocaleString("en-IN")}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Assigned To", value: data.lead.assignee_name || (data.lead.assigned_to ? "—" : "Unassigned") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Created", value: new Date(data.lead.created_at).toLocaleString("en-IN") }),
      data.lead.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wide text-muted-foreground mb-1", children: "Notes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm rounded-md border p-2 whitespace-pre-wrap", style: {
          borderColor: "var(--admin-border)",
          background: "var(--admin-surface-2)"
        }, children: data.lead.notes })
      ] }),
      data.notes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs", style: {
        color: "var(--admin-fg-muted)"
      }, children: [
        data.notes.length,
        " internal note(s) · ",
        data.applications.length,
        " application(s)"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-3 border-t", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/leads/$leadId", params: {
        leadId
      }, className: "inline-flex items-center gap-1.5 text-sm font-medium hover:underline", style: {
        color: "var(--admin-accent)"
      }, children: [
        "Open full lead page ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "size-3.5" })
      ] }) })
    ] })
  ] }) });
}
function Field({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-3 py-1.5 border-b border-dashed last:border-0", style: {
    borderColor: "var(--admin-border)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right", children: value || "—" })
  ] });
}
function parseFormattedError(e) {
  if (!e) return "An error occurred";
  const msg = typeof e === "string" ? e : e?.message ?? String(e);
  if (typeof msg === "string") {
    const trimmed = msg.trim();
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const first = parsed[0];
          if (first?.message) return first.message;
        } else if (parsed?.message) {
          return parsed.message;
        }
      } catch {
      }
    }
  }
  return msg;
}
function AddLeadDialog({
  open,
  onOpenChange,
  staff,
  onCreated
}) {
  const addFn = useServerFn(addLead);
  const findFn = useServerFn(findLeadByCodeOrId);
  const [fetchId, setFetchId] = reactExports.useState("");
  const [fetching, setFetching] = reactExports.useState(false);
  const doFetch = async () => {
    const q = fetchId.trim();
    if (!q) return;
    setFetching(true);
    try {
      const {
        lead
      } = await findFn({
        data: {
          query: q
        }
      });
      const rawMobile = (lead.mobile ?? "").replace(/\D/g, "");
      const cleanMobile = rawMobile.length > 10 && rawMobile.startsWith("91") ? rawMobile.slice(-10) : rawMobile.slice(0, 10);
      setForm((f) => ({
        ...f,
        name: lead.name ?? f.name,
        email: lead.email ?? f.email,
        mobile: cleanMobile || f.mobile,
        state: lead.state ?? f.state,
        district: lead.district ?? f.district,
        language: lead.language ?? f.language,
        service: lead.service ?? f.service,
        lead_source: lead.lead_source ?? f.lead_source,
        website_id: isAdminUser ? lead.website_id ?? f.website_id : f.website_id,
        base_amount: Number(lead.base_amount ?? f.base_amount) || 0,
        gst_amount: Number(lead.gst_amount ?? f.gst_amount) || 0,
        total_amount: Number(lead.total_amount ?? f.total_amount) || 0
      }));
      toast.success(`Prefilled from ${lead.lead_code ?? lead.id.slice(0, 8)}`);
    } catch (e) {
      toast.error(parseFormattedError(e) || "Lead not found");
    } finally {
      setFetching(false);
    }
  };
  const websitesFn = useServerFn(listWebsiteTree);
  const {
    data: websiteTree
  } = useQuery({
    queryKey: ["admin.websites.tree"],
    queryFn: () => websitesFn(),
    enabled: open
  });
  const websites = websiteTree?.websites ?? [];
  const servicesFn = useServerFn(listServices);
  const [form, setForm] = reactExports.useState({
    name: "",
    email: "",
    mobile: "",
    state: "",
    district: "",
    language: "en",
    service: "",
    lead_source: "Website",
    base_amount: 0,
    gst_amount: 0,
    total_amount: 0,
    notes: "",
    assigned_to: "",
    website_id: ""
  });
  const [busy, setBusy] = reactExports.useState(false);
  const setField = (k, v) => setForm((f) => ({
    ...f,
    [k]: v
  }));
  const {
    data: servicesData
  } = useQuery({
    queryKey: ["admin.services"],
    queryFn: () => servicesFn(),
    enabled: open
  });
  const dialogRole = useRole();
  const isAdminUser = dialogRole.hasAny(["super_admin", "admin"]);
  const filteredServices = reactExports.useMemo(() => {
    const rows = (servicesData?.rows ?? []).filter((s) => isAdminUser ? s?.is_active !== false : isVisibleService(s));
    if (!form.website_id) return rows;
    return rows.filter((s) => (s.website_id ?? s.website?.id) === form.website_id);
  }, [servicesData, form.website_id, isAdminUser]);
  const onServiceChange = (val) => {
    setField("service", val);
    const svc = servicesData?.rows.find((s) => s.service_name === val);
    if (svc) {
      if (isAdminUser && !form.website_id && (svc.website_id ?? svc.website?.id)) setField("website_id", svc.website_id ?? svc.website?.id);
      setField("base_amount", Number(svc.base_amount) || 0);
      setField("gst_amount", Number(svc.gst_amount) || 0);
      setField("total_amount", Number(svc.total_amount) || 0);
    }
  };
  const isMobileValid = /^[6-9]\d{9}$/.test(form.mobile);
  const submit = async () => {
    if (!isMobileValid) {
      toast.error("Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9)");
      return;
    }
    setBusy(true);
    try {
      const res = await addFn({
        data: {
          ...form,
          district: form.district || void 0,
          notes: form.notes || void 0,
          assigned_to: form.assigned_to || void 0,
          website_id: form.website_id || void 0
        }
      });
      if (res.isReturningCustomer) {
        toast.success(`Returning customer — lead ${res.lead_code} added to existing profile`);
      } else {
        toast.success(`Lead created: ${res.lead_code ?? res.id.slice(0, 8)}`);
      }
      onCreated();
      onOpenChange(false);
      setForm({
        name: "",
        email: "",
        mobile: "",
        state: "",
        district: "",
        language: "en",
        service: "",
        lead_source: "Website",
        base_amount: 0,
        gst_amount: 0,
        total_amount: 0,
        notes: "",
        assigned_to: "",
        website_id: ""
      });
    } catch (e) {
      toast.error(parseFormattedError(e) || "Failed to create lead");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-base font-semibold", children: "Add Lead" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 rounded-md border border-dashed border-slate-300 bg-slate-50 p-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[11px] font-semibold uppercase tracking-wider text-slate-500", children: "Prefill from existing lead" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: fetchId, onChange: (e) => setFetchId(e.target.value), placeholder: "Lead code (LD-1234), UUID, mobile, or email", className: "text-xs", onKeyDown: (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            doFetch();
          }
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", size: "sm", onClick: doFetch, disabled: fetching || !fetchId.trim(), children: fetching ? "Fetching…" : "Fetch" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Full Name", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.name, onChange: (e) => setField("name", e.target.value), placeholder: "e.g. Rahul Sharma" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Mobile", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex rounded-md border border-input bg-background text-sm focus-within:ring-1 focus-within:ring-ring focus-within:border-ring", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-2.5 rounded-l-md border-r bg-slate-100 text-xs text-slate-600 font-mono select-none", children: "🇮🇳 +91" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "tel", maxLength: 10, value: form.mobile, onChange: (e) => {
            const raw = e.target.value.replace(/\D/g, "");
            const clean = raw.length > 10 && raw.startsWith("91") ? raw.slice(-10) : raw.slice(0, 10);
            setField("mobile", clean);
          }, placeholder: "9876543210", className: "rounded-l-none border-0 focus-visible:ring-0 shadow-none font-mono" })
        ] }),
        form.mobile.length > 0 && !isMobileValid && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-medium text-red-500", children: "Must be 10 digits starting with 6-9" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Email", required: true, full: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", value: form.email, onChange: (e) => setField("email", e.target.value), placeholder: "customer@domain.com" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "State", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: form.state, onChange: (e) => setField("state", e.target.value), className: "w-full rounded-md border px-3 py-2 text-sm bg-background", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select state…" }),
        INDIAN_STATES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, s))
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "District", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: form.district, onChange: (e) => setField("district", e.target.value), placeholder: "(optional)" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Source", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: form.lead_source, onChange: (e) => setField("lead_source", e.target.value), className: "w-full rounded-md border px-3 py-2 text-sm bg-background", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Website", children: "Website" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "WhatsApp", children: "WhatsApp" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Google Ads", children: "Google Ads" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Instagram", children: "Instagram" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Referral", children: "Referral" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Other", children: "Other" })
      ] }) }),
      isAdminUser && /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Website", full: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: form.website_id, onChange: (e) => {
        setField("website_id", e.target.value);
        setField("service", "");
        setForm((f) => ({
          ...f,
          base_amount: 0,
          gst_amount: 0,
          total_amount: 0
        }));
      }, className: "w-full rounded-md border px-3 py-2 text-sm bg-background", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All websites…" }),
        websites.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: w.id, children: w.name }, w.id))
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Interested Service", required: true, full: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: form.service, onChange: (e) => onServiceChange(e.target.value), className: "w-full rounded-md border px-3 py-2 text-sm bg-background", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select a service…" }),
        filteredServices.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.service_name, children: s.service_name }, s.id))
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Total ₹ (inclusive 18% GST)", full: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: form.total_amount, onChange: (e) => {
        const {
          base,
          gst,
          total
        } = fromTotal(Number(e.target.value));
        setForm((f) => ({
          ...f,
          total_amount: total,
          base_amount: base,
          gst_amount: gst
        }));
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Base ₹ (auto)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: form.base_amount, onChange: (e) => {
        const {
          base,
          gst,
          total
        } = fromBase(Number(e.target.value));
        setForm((f) => ({
          ...f,
          base_amount: base,
          gst_amount: gst,
          total_amount: total
        }));
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "GST 18% ₹ (auto)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: form.gst_amount, readOnly: true, className: "bg-slate-50" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Assign to", full: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: form.assigned_to, onChange: (e) => setField("assigned_to", e.target.value), className: "w-full rounded-md border px-3 py-2 text-sm bg-background", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Unassigned" }),
        staff.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.id, children: s.display_name || s.email }, s.id))
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Notes", full: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: form.notes, onChange: (e) => setField("notes", e.target.value), rows: 2, placeholder: "Any initial notes about this lead…" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), disabled: busy, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: submit, disabled: busy || !form.name.trim() || !form.email.trim() || !isMobileValid || !form.state || !form.service, children: busy ? "Creating…" : "Create Lead" })
    ] })
  ] }) });
}
function Row({
  label,
  children,
  required,
  full
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: full ? "col-span-2 space-y-1" : "space-y-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs", children: [
      label,
      required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: " *" })
    ] }),
    children
  ] });
}
export {
  LeadsPage as component
};
