import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as SectionCard } from "./ui-BVv-e2FI.mjs";
import { a as useQuery, b as useMutation, u as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { j as useServerFn, _ as useRole } from "./router-QgJicixe.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as addBusinessSeconds } from "./business-hours-B-Ly-oQa.mjs";
import { COMPANY_NAME, SITE_NAME, SUPPORT_EMAIL, BASE_URL } from "./brand-DLB0j9eh.mjs";
import { a as getShiftSettings, s as saveShiftSettings, b as getActiveEmployeeSessions, t as terminateEmployeeSession } from "./employee-presence.functions-CEH9Idxg.mjs";
import { A as AppSettingsCard } from "./AppSettingsCard-Dcme_KWA.mjs";
import { g as getSoundSettings, s as syncGlobalSoundSettings, a as playReminderSound, c as saveSoundSettings, b as showDesktopNotification } from "./reminder-sounds-CO-4eTIZ.mjs";
import { g as getGlobalReminderSoundSettings, s as saveGlobalReminderSoundSettings, u as uploadAlertAudioFile } from "./app-settings.functions-ChQcgAgv.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { bj as Building2, bk as CalendarRange, bh as Laptop, C as Clock, T as Timer, ae as ListChecks, a as Mail, bl as BookOpen, aT as Zap, Z as Bell, ag as CreditCard, bm as Workflow, aw as Plus, J as Users, az as Trash2, l as CircleCheck, R as RefreshCw, bg as Smartphone, bb as Power, b5 as Info, a_ as Save, aP as Pencil, X, L as LoaderCircle, aA as Upload, bn as Music, E as Check, a2 as Play, bo as FileHeadphone, bp as VolumeX, a5 as Volume2, bq as BellRing } from "../_libs/lucide-react.mjs";
import { o as object, s as string, a as array, n as number, _ as _enum, b as boolean, p as preprocess } from "../_libs/zod.mjs";
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
import "../_libs/motion.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./constants-CKRzJJF_.mjs";
import "./client.functions-WMvtjq1i.mjs";
import "./customer-access-core-Bd_9lLsD.mjs";
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
import "./card-CjqxMl2c.mjs";
import "./switch-DIr13Mej.mjs";
import "../_libs/radix-ui__react-switch.mjs";
import "./useNotifications-DFr-oGCL.mjs";
const TableEnum = _enum(["workflow_delay_reasons", "workflow_closure_reasons"]);
const listReasons = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  table: TableEnum
}).parse(d)).handler(createSsrRpc("e9f1f0226d382bcdece75b519f9c4aafc4924c4b13cb57e55922ef46603e5abc"));
const sanitizeCode = (codeStr) => {
  return codeStr.toLowerCase().trim().replace(/[^a-z0-9_]/g, "_").replace(/_+/g, "_").replace(/^_+|_+$/g, "");
};
const ReasonInput = preprocess((raw) => {
  if (raw && typeof raw === "object" && raw !== null) {
    const obj = {
      ...raw
    };
    let codeVal = typeof obj.code === "string" ? obj.code : "";
    if (!codeVal.trim() && typeof obj.label === "string") {
      codeVal = obj.label;
    }
    obj.code = sanitizeCode(codeVal);
    return obj;
  }
  return raw;
}, object({
  table: TableEnum,
  id: string().uuid().optional(),
  code: string().min(1, "Code is required").max(64, "Code must be 64 characters or fewer").regex(/^[a-z0-9_]+$/, "lowercase letters / digits / underscore"),
  label: string().trim().min(1, "Label is required").max(160),
  description: string().max(2e3).optional().nullable(),
  side: _enum(["customer", "internal"]).optional(),
  emailTemplateCode: string().max(160).optional().nullable(),
  isActive: boolean().default(true),
  sortOrder: number().int().min(0).max(9999).default(100)
}));
const upsertReason = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => ReasonInput.parse(d)).handler(createSsrRpc("e4abd237eae812270bb0f90bfb594a9449f902721909a36ce3788bdc8802879c"));
const deleteReason = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  table: TableEnum,
  id: string().uuid()
}).parse(d)).handler(createSsrRpc("58913168768a16ec2e36cc44239d8e725310f4f70d5061e7572da5e669802934"));
const listAutomationRules = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("74bc5c339b9356b9246c172598a75ed5369c4c24a27b5b57f5ed85d20fae4ac6"));
const RuleInput = object({
  id: string().uuid().optional(),
  name: string().min(1).max(160),
  triggerStatus: string().min(1).max(64),
  waitDays: number().int().min(0).max(365),
  actionType: _enum(["send_template", "create_reminder", "notify_executive", "close_order"]),
  templateCode: string().max(160).optional().nullable(),
  repeatCount: number().int().min(1).max(50).default(1),
  isActive: boolean().default(true)
});
const upsertAutomationRule = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => RuleInput.parse(d)).handler(createSsrRpc("bad46058b61ba9640fc451ed9b10c448c81cfd7af68f4de09b8ef28da79aa164"));
const deleteAutomationRule = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  id: string().uuid()
}).parse(d)).handler(createSsrRpc("43787bb4921a8af5061cd4e2fc99d9b6a00a3fbc845fc9701a1728739449a535"));
function ReasonLibraryTab() {
  const [view, setView] = reactExports.useState("customer");
  const table = view === "closure" ? "workflow_closure_reasons" : "workflow_delay_reasons";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 text-sm", children: [
      ["customer", "Customer-side Delay"],
      ["internal", "Our-side Delay"],
      ["closure", "Closure Reasons"]
    ].map(([id, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setView(id),
        className: "rounded-md px-3 py-1.5 border",
        style: {
          background: view === id ? "var(--admin-primary)" : "var(--admin-surface)",
          color: view === id ? "#fff" : "var(--admin-fg)",
          borderColor: "var(--admin-border)"
        },
        children: label
      },
      id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ReasonTable, { table, side: view === "closure" ? void 0 : view })
  ] });
}
function ReasonTable({ table, side }) {
  const qc = useQueryClient();
  const fnList = useServerFn(listReasons);
  const fnDel = useServerFn(deleteReason);
  const [editing, setEditing] = reactExports.useState(null);
  const [open, setOpen] = reactExports.useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["reason-library", table],
    queryFn: () => fnList({ data: { table } })
  });
  const rows = (data?.rows ?? []).filter((r) => !side || (r.side ?? "customer") === side);
  const del = useMutation({
    mutationFn: (id) => fnDel({ data: { table, id } }),
    onSuccess: () => {
      toast.success("Deactivated");
      qc.invalidateQueries({ queryKey: ["reason-library", table] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    SectionCard,
    {
      title: side === "customer" ? "Customer-side Delay Reasons" : side === "internal" ? "Our-side Delay Reasons" : "Closure Reasons",
      action: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => {
            setEditing(null);
            setOpen(true);
          },
          className: "inline-flex items-center gap-1 text-xs rounded-md px-2 py-1 border",
          style: { borderColor: "var(--admin-border)", color: "var(--admin-fg)" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3" }),
            " New"
          ]
        }
      ),
      children: [
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 text-sm text-muted-foreground", children: "Loading…" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-xs", style: { color: "var(--admin-fg-muted)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Code" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Label" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Order" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Active" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
            rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t", style: { borderColor: "var(--admin-border)" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 font-mono text-xs", children: r.code }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: r.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-xs text-muted-foreground", children: r.description || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 tabular-nums", children: r.sort_order }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: r.is_active ? "Yes" : "No" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2 text-right", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
                  setEditing(r);
                  setOpen(true);
                }, className: "text-xs inline-flex items-center gap-1 px-2 py-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-3" }),
                  " Edit"
                ] }),
                r.is_active && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => del.mutate(r.id), className: "text-xs inline-flex items-center gap-1 px-2 py-1 text-rose-600", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3" }),
                  " Deactivate"
                ] })
              ] })
            ] }, r.id)),
            !rows.length && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-4 py-6 text-center text-sm text-muted-foreground", children: "No reasons yet." }) })
          ] })
        ] }),
        open && /* @__PURE__ */ jsxRuntimeExports.jsx(ReasonDialog, { table, side, initial: editing, onClose: () => setOpen(false) })
      ]
    }
  );
}
function parseErrorMessage(e) {
  if (!(e instanceof Error)) return "Failed to save reason";
  const msg = e.message;
  if (msg.startsWith("[") || msg.startsWith("{")) {
    try {
      const parsed = JSON.parse(msg);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const first = parsed[0];
        if (first?.message) {
          const field = Array.isArray(first.path) && first.path.length ? `${first.path.join(".")}: ` : "";
          return `${field}${first.message}`;
        }
      } else if (parsed && typeof parsed === "object" && parsed.message) {
        return parsed.message;
      }
    } catch {
    }
  }
  return msg;
}
function slugifyCode(str) {
  return str.toLowerCase().replace(/[^a-z0-9_]/g, "_").replace(/_+/g, "_");
}
function ReasonDialog({ table, side, initial, onClose }) {
  const qc = useQueryClient();
  const fn = useServerFn(upsertReason);
  const [code, setCode] = reactExports.useState(initial?.code ?? "");
  const [label, setLabel] = reactExports.useState(initial?.label ?? "");
  const [description, setDescription] = reactExports.useState(initial?.description ?? "");
  const [sortOrder, setSortOrder] = reactExports.useState(initial?.sort_order ?? 100);
  const [isActive, setIsActive] = reactExports.useState(initial?.is_active ?? true);
  const [isCodeEdited, setIsCodeEdited] = reactExports.useState(!!initial);
  const handleLabelChange = (val) => {
    setLabel(val);
    if (!initial && !isCodeEdited) {
      setCode(slugifyCode(val).replace(/^_+|_+$/g, ""));
    }
  };
  const handleCodeChange = (val) => {
    setIsCodeEdited(true);
    setCode(slugifyCode(val));
  };
  const mut = useMutation({
    mutationFn: () => {
      const sanitizedCode = slugifyCode(code || label).replace(/^_+|_+$/g, "");
      return fn({
        data: {
          table,
          id: initial?.id,
          code: sanitizedCode,
          label,
          description: description || null,
          side,
          emailTemplateCode: side === "customer" ? "bhs_e003_customer_delay" : "bhs_e004_our_side_delay",
          sortOrder,
          isActive
        }
      });
    },
    onSuccess: () => {
      toast.success("Reason saved successfully");
      qc.invalidateQueries({ queryKey: ["reason-library", table] });
      onClose();
    },
    onError: (e) => toast.error(parseErrorMessage(e))
  });
  const effectiveCode = slugifyCode(code || label).replace(/^_+|_+$/g, "");
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 grid place-items-center bg-black/60 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md rounded-lg border bg-card p-5 shadow-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: initial ? "Edit reason" : "New reason" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Labeled, { label: "Label", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          value: label,
          onChange: (e) => handleLabelChange(e.target.value),
          placeholder: "e.g. Invalid PAN Card Details",
          className: "w-full rounded-md border bg-background px-2 py-1.5"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Labeled, { label: "Code (lowercase, digits, underscore only)", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: code,
            onChange: (e) => handleCodeChange(e.target.value),
            disabled: !!initial,
            placeholder: "e.g. invalid_pan_card",
            className: "w-full rounded-md border bg-background px-2 py-1.5 disabled:opacity-60 font-mono text-xs"
          }
        ),
        effectiveCode && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-[11px] text-muted-foreground", children: [
          "Code key: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono text-primary font-medium", children: effectiveCode })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Labeled, { label: "Description", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), rows: 2, className: "w-full rounded-md border bg-background px-2 py-1.5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Labeled, { label: "Sort order", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: sortOrder, onChange: (e) => setSortOrder(Number(e.target.value) || 0), className: "w-full rounded-md border bg-background px-2 py-1.5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Labeled, { label: "Active", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: isActive ? "y" : "n", onChange: (e) => setIsActive(e.target.value === "y"), className: "w-full rounded-md border bg-background px-2 py-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "y", children: "Yes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "n", children: "No" })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex justify-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "rounded-md border px-3 py-1.5 text-sm", children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => mut.mutate(),
          disabled: mut.isPending || !label.trim() || !effectiveCode,
          className: "rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground inline-flex items-center gap-2 disabled:opacity-50",
          children: [
            mut.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3 animate-spin" }),
            " Save"
          ]
        }
      )
    ] })
  ] }) });
}
function Labeled({ label, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children })
  ] });
}
const STATUSES = [
  "external_dependency",
  "government_portal_pending",
  "waiting_for_customer",
  "waiting_for_documents",
  "customer_non_responsive",
  "pending_closure"
];
const ACTIONS = [
  { code: "send_template", label: "Send email template" },
  { code: "create_reminder", label: "Create follow-up reminder" },
  { code: "notify_executive", label: "Notify assignee" },
  { code: "close_order", label: "Auto-close order" }
];
function AutomationRulesTab() {
  const qc = useQueryClient();
  const fnList = useServerFn(listAutomationRules);
  const fnDel = useServerFn(deleteAutomationRule);
  const [open, setOpen] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const { data, isLoading } = useQuery({
    queryKey: ["automation-rules"],
    queryFn: () => fnList({ data: {} })
  });
  const del = useMutation({
    mutationFn: (id) => fnDel({ data: { id } }),
    onSuccess: () => {
      toast.success("Deactivated");
      qc.invalidateQueries({ queryKey: ["automation-rules"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    SectionCard,
    {
      title: "Automation Rules",
      action: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => {
            setEditing(null);
            setOpen(true);
          },
          className: "inline-flex items-center gap-1 text-xs rounded-md px-2 py-1 border",
          style: { borderColor: "var(--admin-border)", color: "var(--admin-fg)" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3" }),
            " New rule"
          ]
        }
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pt-3 text-xs text-muted-foreground", children: "Rules override the default 3 / 5 / 7-day follow-up cadence for the chosen status. Email templates must already exist (see Email Templates)." }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 text-sm text-muted-foreground", children: "Loading…" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-xs", style: { color: "var(--admin-fg-muted)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Trigger status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Wait" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Action" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Template" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Repeat" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2", children: "Active" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
            (data?.rules ?? []).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t", style: { borderColor: "var(--admin-border)" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: r.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 font-mono text-xs", children: r.trigger_status }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2 tabular-nums", children: [
                r.wait_days,
                "d"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 text-xs", children: ACTIONS.find((a) => a.code === r.action_type)?.label ?? r.action_type }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2 font-mono text-xs", children: r.template_code || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2 tabular-nums", children: [
                r.repeat_count,
                "×"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: r.is_active ? "Yes" : "No" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2 text-right whitespace-nowrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
                  setEditing(r);
                  setOpen(true);
                }, className: "text-xs inline-flex items-center gap-1 px-2 py-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-3" }),
                  " Edit"
                ] }),
                r.is_active && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => del.mutate(r.id), className: "text-xs inline-flex items-center gap-1 px-2 py-1 text-rose-600", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3" }),
                  " Deactivate"
                ] })
              ] })
            ] }, r.id)),
            !data?.rules?.length && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 8, className: "px-4 py-6 text-center text-sm text-muted-foreground", children: "No automation rules yet — engine will use the default 3 / 5 / 7-day cadence." }) })
          ] })
        ] }),
        open && /* @__PURE__ */ jsxRuntimeExports.jsx(RuleDialog, { initial: editing, onClose: () => setOpen(false) })
      ]
    }
  );
}
function RuleDialog({ initial, onClose }) {
  const qc = useQueryClient();
  const fn = useServerFn(upsertAutomationRule);
  const [name, setName] = reactExports.useState(initial?.name ?? "");
  const [triggerStatus, setTriggerStatus] = reactExports.useState(initial?.trigger_status ?? STATUSES[0]);
  const [waitDays, setWaitDays] = reactExports.useState(initial?.wait_days ?? 3);
  const [actionType, setActionType] = reactExports.useState(initial?.action_type ?? "send_template");
  const [templateCode, setTemplateCode] = reactExports.useState(initial?.template_code ?? "");
  const [repeatCount, setRepeatCount] = reactExports.useState(initial?.repeat_count ?? 1);
  const [isActive, setIsActive] = reactExports.useState(initial?.is_active ?? true);
  const mut = useMutation({
    mutationFn: () => fn({
      data: {
        id: initial?.id,
        name,
        triggerStatus,
        waitDays,
        actionType,
        templateCode: templateCode || null,
        repeatCount,
        isActive
      }
    }),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["automation-rules"] });
      onClose();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 grid place-items-center bg-black/60 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-lg rounded-lg border bg-card p-5 shadow-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: initial ? "Edit rule" : "New automation rule" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(L, { label: "Rule name", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: name, onChange: (e) => setName(e.target.value), className: "w-full rounded-md border bg-background px-2 py-1.5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(L, { label: "Trigger status", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: triggerStatus, onChange: (e) => setTriggerStatus(e.target.value), className: "w-full rounded-md border bg-background px-2 py-1.5", children: STATUSES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, s)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(L, { label: "Wait days", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 0, value: waitDays, onChange: (e) => setWaitDays(Number(e.target.value) || 0), className: "w-full rounded-md border bg-background px-2 py-1.5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(L, { label: "Action", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: actionType, onChange: (e) => setActionType(e.target.value), className: "w-full rounded-md border bg-background px-2 py-1.5", children: ACTIONS.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: a.code, children: a.label }, a.code)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(L, { label: "Repeat count", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 1, value: repeatCount, onChange: (e) => setRepeatCount(Number(e.target.value) || 1), className: "w-full rounded-md border bg-background px-2 py-1.5" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(L, { label: "Email template code (only used when action is 'Send email template')", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: templateCode, onChange: (e) => setTemplateCode(e.target.value), placeholder: "e.g. workflow_processing_update_3d", className: "w-full rounded-md border bg-background px-2 py-1.5 font-mono text-xs" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(L, { label: "Active", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: isActive ? "y" : "n", onChange: (e) => setIsActive(e.target.value === "y"), className: "w-full rounded-md border bg-background px-2 py-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "y", children: "Yes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "n", children: "No" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex justify-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "rounded-md border px-3 py-1.5 text-sm", children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => mut.mutate(), disabled: mut.isPending || !name, className: "rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground inline-flex items-center gap-2 disabled:opacity-50", children: [
        mut.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3 animate-spin" }),
        " Save"
      ] })
    ] })
  ] }) });
}
function L({ label, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children })
  ] });
}
const HM = /^([01]\d|2[0-3]):[0-5]\d$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const UpdateInput = object({
  timezone: string().min(3).max(64).default("Asia/Kolkata"),
  openTime: string().regex(HM),
  closeTime: string().regex(HM),
  workingDays: array(number().int().min(0).max(6)).min(1).max(7),
  holidays: array(string().regex(ISO_DATE)).max(365)
});
const getBusinessHoursConfig = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("486a3e3c02066d5821f4be070bc0416f1f50182e06fc3d1b396dcd02a6da32ae"));
const updateBusinessHoursConfig = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => UpdateInput.parse(raw)).handler(createSsrRpc("c59d6a6c5f50ec681c098ce0cb8106520ddf6082b3d485c7d72792ffec2c69e6"));
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TIMEZONES = [
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Singapore",
  "UTC",
  "Europe/London",
  "America/New_York"
];
function BusinessHoursTab() {
  const qc = useQueryClient();
  const getFn = useServerFn(getBusinessHoursConfig);
  const updFn = useServerFn(updateBusinessHoursConfig);
  const { has } = useRole();
  const isSuper = has("super_admin");
  const { data, isLoading } = useQuery({
    queryKey: ["business-hours-config"],
    queryFn: () => getFn(),
    staleTime: 6e4
  });
  const [tz, setTz] = reactExports.useState("Asia/Kolkata");
  const [openTime, setOpenTime] = reactExports.useState("10:00");
  const [closeTime, setCloseTime] = reactExports.useState("18:00");
  const [days, setDays] = reactExports.useState([1, 2, 3, 4, 5, 6]);
  const [holidayInput, setHolidayInput] = reactExports.useState("");
  const [holidays, setHolidays] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (!data?.config) return;
    setTz(data.config.timezone);
    setOpenTime(data.config.openTime);
    setCloseTime(data.config.closeTime);
    setDays(data.config.workingDays);
    setHolidays(data.config.holidays ?? []);
  }, [data]);
  const cfg = reactExports.useMemo(
    () => ({ timezone: tz, openTime, closeTime, workingDays: days, holidays }),
    [tz, openTime, closeTime, days, holidays]
  );
  const now = /* @__PURE__ */ new Date();
  const nextClosureFires = reactExports.useMemo(() => addBusinessSeconds(now, 24 * 3600, cfg), [cfg, now]);
  const nextReminderFires = reactExports.useMemo(() => addBusinessSeconds(now, 2 * 3600, cfg), [cfg, now]);
  const save = useMutation({
    mutationFn: async () => updFn({
      data: {
        timezone: tz,
        openTime,
        closeTime,
        workingDays: [...days].sort(),
        holidays
      }
    }),
    onSuccess: () => {
      toast.success("Business hours updated");
      qc.invalidateQueries({ queryKey: ["business-hours-config"] });
    },
    onError: (e) => toast.error(e?.message ?? "Failed to save")
  });
  function toggleDay(d) {
    setDays((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);
  }
  function addHoliday() {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(holidayInput)) {
      toast.error("Date must be YYYY-MM-DD");
      return;
    }
    if (holidays.includes(holidayInput)) return;
    setHolidays((prev) => [...prev, holidayInput].sort());
    setHolidayInput("");
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: "Business Hours", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-sm text-slate-500", children: "Loading…" }) });
  }
  const readOnly = !isSuper;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: "Office Hours (drives all internal schedulers)", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 -mt-1 text-xs text-indigo-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Applied to every internal timer (24h closure, 2h reminder, ticket auto-close)." })
      ] }),
      !isSuper && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded border-l-4 border-amber-400 bg-amber-50 px-3 py-2 text-xs text-amber-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "size-4 shrink-0 mt-0.5" }),
        "Only Super Admin can edit these settings. You have read-only access."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-sm block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] uppercase tracking-wide text-slate-500", children: "Timezone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              disabled: readOnly,
              value: tz,
              onChange: (e) => setTz(e.target.value),
              className: "mt-1 w-full rounded border border-slate-200 px-2 py-1.5 bg-white disabled:bg-slate-50",
              children: TIMEZONES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: t }, t))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-sm block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] uppercase tracking-wide text-slate-500", children: "Open time" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "time",
              disabled: readOnly,
              value: openTime,
              onChange: (e) => setOpenTime(e.target.value),
              className: "mt-1 w-full rounded border border-slate-200 px-2 py-1.5 disabled:bg-slate-50"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-sm block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] uppercase tracking-wide text-slate-500", children: "Close time" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "time",
              disabled: readOnly,
              value: closeTime,
              onChange: (e) => setCloseTime(e.target.value),
              className: "mt-1 w-full rounded border border-slate-200 px-2 py-1.5 disabled:bg-slate-50"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-wide text-slate-500 mb-1.5", children: "Working days" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 flex-wrap", children: DAYS.map((label, idx) => {
          const active = days.includes(idx);
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              disabled: readOnly,
              onClick: () => toggleDay(idx),
              className: `px-3 py-1.5 rounded-full text-xs font-medium border transition ${active ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"} ${readOnly ? "opacity-70 cursor-not-allowed" : ""}`,
              children: label
            },
            idx
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-wide text-slate-500 mb-1.5", children: "Holidays" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-center flex-wrap", children: [
          holidays.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs", children: [
            h,
            !readOnly && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "text-slate-400 hover:text-rose-600",
                onClick: () => setHolidays((prev) => prev.filter((x) => x !== h)),
                children: "×"
              }
            )
          ] }, h)),
          holidays.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400", children: "No holidays configured" })
        ] }),
        !readOnly && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              placeholder: "YYYY-MM-DD",
              value: holidayInput,
              onChange: (e) => setHolidayInput(e.target.value),
              className: "rounded border border-slate-200 px-2 py-1.5 text-sm"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: addHoliday,
              className: "rounded bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-medium",
              children: "Add holiday"
            }
          )
        ] })
      ] }),
      !readOnly && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => save.mutate(),
          disabled: save.isPending,
          className: "inline-flex items-center gap-1.5 rounded bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 text-sm font-medium shadow-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-4" }),
            save.isPending ? "Saving…" : "Save changes"
          ]
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionCard, { title: "Live preview", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 grid md:grid-cols-3 gap-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PreviewCard, { label: "Right now", value: "🟢 Business hours" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PreviewCard, { label: "24h closure timer would fire", value: fmt(nextClosureFires, tz) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PreviewCard, { label: "2h reminder would fire", value: fmt(nextReminderFires, tz) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-4 text-[11px] text-slate-500", children: "All internal schedulers (customer-side 24h auto-close, our-side 2h reminder engine, ticket auto-close) pause automatically outside these hours and only count business seconds." })
    ] })
  ] });
}
function PreviewCard({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-slate-200 bg-slate-50 px-3 py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wide text-slate-500", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 font-medium text-slate-800", children: value })
  ] });
}
function fmt(d, tz) {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: tz,
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }).format(d);
  } catch {
    return d.toISOString();
  }
}
function ShiftsAndPresenceTab() {
  const getSettingsFn = useServerFn(getShiftSettings);
  const saveSettingsFn = useServerFn(saveShiftSettings);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin.settings.shifts"],
    queryFn: () => getSettingsFn()
  });
  const [shifts, setShifts] = reactExports.useState([]);
  const [thresholds, setThresholds] = reactExports.useState({
    idleThresholdMins: 5,
    awayThresholdMins: 15,
    heartbeatIntervalSeconds: 30,
    sessionTimeoutHours: 9
  });
  const [initialized, setInitialized] = reactExports.useState(false);
  const [saveSuccess, setSaveSuccess] = reactExports.useState(false);
  const [editingShift, setEditingShift] = reactExports.useState(null);
  if (data && !initialized) {
    setShifts(data.shifts);
    setThresholds(data.thresholds);
    setInitialized(true);
  }
  const saveMutation = useMutation({
    mutationFn: async () => {
      return saveSettingsFn({
        data: {
          shifts,
          thresholds
        }
      });
    },
    onSuccess: () => {
      setSaveSuccess(true);
      refetch();
      setTimeout(() => setSaveSuccess(false), 3e3);
    }
  });
  const staffList = data?.staffList ?? [];
  const handleAddShift = () => {
    const newShift = {
      id: `shift_${Date.now()}`,
      name: "New Shift",
      code: "SHF",
      startTime: "09:00",
      endTime: "18:00",
      lunchStart: "13:00",
      lunchEnd: "14:00",
      graceMins: 15,
      isDefault: false,
      assignedUsers: []
    };
    setShifts([...shifts, newShift]);
    setEditingShift(newShift);
  };
  const handleUpdateShift = (id, updates) => {
    setShifts(shifts.map((s) => s.id === id ? { ...s, ...updates } : s));
    if (editingShift && editingShift.id === id) {
      setEditingShift({ ...editingShift, ...updates });
    }
  };
  const handleDeleteShift = (id) => {
    if (shifts.length <= 1) {
      alert("At least one shift must remain configured.");
      return;
    }
    setShifts(shifts.filter((s) => s.id !== id));
    if (editingShift?.id === id) setEditingShift(null);
  };
  if (isLoading && !initialized) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: "Shifts & Presence Configuration", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-slate-500 text-sm", children: "Loading shift policies..." }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: "Operating Shifts & Schedules", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 max-w-xl", children: "Configure daily working shifts, operational windows, lunch break periods, and employee pod assignments in IST (Asia/Kolkata)." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: handleAddShift,
            className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-xs",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Create New Shift" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: shifts.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `p-4 rounded-xl border flex flex-col justify-between transition ${editingShift?.id === s.id ? "border-blue-500 bg-blue-50/20 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700", children: s.code }),
                s.isDefault && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800", children: "Default" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-bold text-slate-900", children: s.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-600 space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 text-blue-600" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    s.startTime,
                    " — ",
                    s.endTime,
                    " IST"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-slate-500", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "Lunch: ",
                    s.lunchStart,
                    " — ",
                    s.lunchEnd
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "• Grace: ",
                    s.graceMins,
                    "m"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-slate-500", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5 text-slate-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    s.assignedUsers.length,
                    " Employees Assigned"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 mt-3 border-t border-slate-100 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setEditingShift(s),
                  className: "text-xs font-semibold text-blue-600 hover:text-blue-700",
                  children: "Edit Shift"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => handleDeleteShift(s.id),
                  className: "text-xs font-semibold text-rose-600 hover:text-rose-700",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                }
              )
            ] })
          ]
        },
        s.id
      )) })
    ] }) }),
    editingShift && /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: `Edit Shift: ${editingShift.name}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-slate-700 font-semibold mb-1", children: "Shift Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: editingShift.name,
              onChange: (e) => handleUpdateShift(editingShift.id, { name: e.target.value }),
              className: "w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-slate-700 font-semibold mb-1", children: "Shift Code" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: editingShift.code,
              onChange: (e) => handleUpdateShift(editingShift.id, { code: e.target.value.toUpperCase() }),
              className: "w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 font-mono"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              id: "isDefaultShift",
              checked: editingShift.isDefault,
              onChange: (e) => {
                const checked = e.target.checked;
                setShifts(shifts.map((s) => ({ ...s, isDefault: s.id === editingShift.id ? checked : false })));
                setEditingShift({ ...editingShift, isDefault: checked });
              },
              className: "h-4 w-4 rounded text-blue-600 border-slate-300"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "isDefaultShift", className: "text-xs text-slate-700 font-medium cursor-pointer", children: "Default Shift for unassigned employees" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-slate-700 font-semibold mb-1", children: "Start Time (IST)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "time",
              value: editingShift.startTime,
              onChange: (e) => handleUpdateShift(editingShift.id, { startTime: e.target.value }),
              className: "w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-slate-700 font-semibold mb-1", children: "End Time (IST)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "time",
              value: editingShift.endTime,
              onChange: (e) => handleUpdateShift(editingShift.id, { endTime: e.target.value }),
              className: "w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-slate-700 font-semibold mb-1", children: "Grace Period (Minutes)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              min: 0,
              max: 60,
              value: editingShift.graceMins,
              onChange: (e) => handleUpdateShift(editingShift.id, { graceMins: Number(e.target.value) || 0 }),
              className: "w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-slate-700 font-semibold mb-1", children: "Lunch Start (IST)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "time",
              value: editingShift.lunchStart,
              onChange: (e) => handleUpdateShift(editingShift.id, { lunchStart: e.target.value }),
              className: "w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-slate-700 font-semibold mb-1", children: "Lunch End (IST)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "time",
              value: editingShift.lunchEnd,
              onChange: (e) => handleUpdateShift(editingShift.id, { lunchEnd: e.target.value }),
              className: "w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-slate-700 font-semibold mb-1 text-xs", children: "Assigned Employees" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 rounded-lg border border-slate-200 bg-slate-50", children: staffList.map((st) => {
          const isAssigned = editingShift.assignedUsers.includes(st.id);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-xs text-slate-700 cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: isAssigned,
                onChange: (e) => {
                  const nextUsers = e.target.checked ? [...editingShift.assignedUsers, st.id] : editingShift.assignedUsers.filter((uid) => uid !== st.id);
                  handleUpdateShift(editingShift.id, { assignedUsers: nextUsers });
                },
                className: "h-3.5 w-3.5 rounded text-blue-600 border-slate-300"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: st.name })
          ] }, st.id);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end gap-2 pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setEditingShift(null),
          className: "px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs",
          children: "Done Editing"
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: "Presence & Idle Detection Thresholds", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500", children: "Configure automated status transitions based on user CRM interactions, window blur, and background heartbeat pings." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-slate-700 font-semibold mb-1", children: "🟡 Idle Threshold (Minutes)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              min: 1,
              max: 60,
              value: thresholds.idleThresholdMins,
              onChange: (e) => setThresholds({ ...thresholds, idleThresholdMins: Number(e.target.value) || 5 }),
              className: "w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400 mt-1 block", children: "No CRM clicks/actions → status turns IDLE" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-slate-700 font-semibold mb-1", children: "🟠 Away Threshold (Minutes)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              min: 2,
              max: 120,
              value: thresholds.awayThresholdMins,
              onChange: (e) => setThresholds({ ...thresholds, awayThresholdMins: Number(e.target.value) || 15 }),
              className: "w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400 mt-1 block", children: "CRM tab minimized/hidden → status turns AWAY" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-slate-700 font-semibold mb-1", children: "Heartbeat Interval (Seconds)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              min: 10,
              max: 120,
              value: thresholds.heartbeatIntervalSeconds,
              onChange: (e) => setThresholds({ ...thresholds, heartbeatIntervalSeconds: Number(e.target.value) || 30 }),
              className: "w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400 mt-1 block", children: "Lightweight client ping frequency (30s)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-slate-700 font-semibold mb-1", children: "Session Expiry (Hours)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "number",
              min: 1,
              max: 24,
              value: thresholds.sessionTimeoutHours,
              onChange: (e) => setThresholds({ ...thresholds, sessionTimeoutHours: Number(e.target.value) || 9 }),
              className: "w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400 mt-1 block", children: "Automatic re-authentication threshold" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: saveSuccess && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-emerald-600 text-xs font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
        "Settings saved and applied across entire system!"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          disabled: saveMutation.isPending,
          onClick: () => saveMutation.mutate(),
          className: "flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs transition shadow-xs",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: saveMutation.isPending ? "Saving..." : "Save Shift & Presence Configuration" })
        }
      )
    ] })
  ] });
}
function ActiveSessionsTab() {
  const getSessionsFn = useServerFn(getActiveEmployeeSessions);
  const terminateSessionFn = useServerFn(terminateEmployeeSession);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin.settings.sessions"],
    queryFn: () => getSessionsFn(),
    refetchInterval: 15e3
  });
  const [terminatingId, setTerminatingId] = reactExports.useState(null);
  const [successMsg, setSuccessMsg] = reactExports.useState(null);
  const terminateMutation = useMutation({
    mutationFn: async (session) => {
      setTerminatingId(session.sessionId);
      return terminateSessionFn({
        data: {
          sessionId: session.sessionId,
          employeeId: session.employeeId
        }
      });
    },
    onSuccess: (_, variables) => {
      setTerminatingId(null);
      setSuccessMsg(`Session for ${variables.employeeName} terminated successfully.`);
      refetch();
      setTimeout(() => setSuccessMsg(null), 3500);
    },
    onError: () => {
      setTerminatingId(null);
      alert("Failed to terminate session.");
    }
  });
  const sessions = data?.sessions ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 font-medium", children: "Total Staff Tracked" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold text-slate-900 mt-1", children: data?.totalCount ?? 0 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl bg-emerald-50 border border-emerald-200 shadow-xs flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-emerald-700 font-medium flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }),
          "🟢 Active Now"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold text-emerald-900 mt-1", children: data?.activeCount ?? 0 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl bg-amber-50 border border-amber-200 shadow-xs flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-amber-700 font-medium flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-amber-500" }),
          "🟡 Idle"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold text-amber-900 mt-1", children: data?.idleCount ?? 0 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500 font-medium", children: "⚫ Offline / Standby" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold text-slate-700 mt-1", children: data?.offlineCount ?? 0 })
      ] })
    ] }),
    successMsg && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-emerald-600" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: successMsg })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionCard, { title: "Live Session Registry & Device Access Control", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-slate-100 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "Realtime session tokens, telemetry heartbeat timestamps, and administrator force-logout controls." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => refetch(),
            className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Poll Telemetry" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-slate-500 font-semibold border-b border-slate-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "Employee" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "Device & Browser" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "Login Time (IST)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "Last Seen" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "Current Module" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-3 px-4 text-right", children: "Action" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-slate-100 text-slate-700 font-normal", children: isLoading && sessions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "py-8 text-center text-slate-400", children: "Loading live sessions..." }) }) : sessions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "py-8 text-center text-slate-400", children: "No active sessions found." }) }) : sessions.map((s) => {
          const isTerminating = terminatingId === s.sessionId;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50/80 transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs", children: s.employeeName[0] || "U" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-900", children: s.employeeName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-400 uppercase tracking-wider", children: s.employeeRole })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-3 px-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-slate-600", children: [
                s.deviceType === "Mobile" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-3.5 w-3.5 text-slate-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Laptop, { className: "h-3.5 w-3.5 text-slate-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  s.browser,
                  " / ",
                  s.os
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-400 font-mono", children: s.ipAddress })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 font-mono text-slate-600", children: new Date(s.loginTime).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-slate-600", children: new Date(s.lastHeartbeat).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium", children: s.currentModule }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-3 px-4", children: [
              s.presenceStatus === "ACTIVE" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px] flex items-center gap-1 max-w-fit", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" }),
                "Active"
              ] }),
              s.presenceStatus === "IDLE" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold text-[10px] flex items-center gap-1 max-w-fit", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-amber-500" }),
                "Idle"
              ] }),
              s.presenceStatus === "AWAY" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-semibold text-[10px] flex items-center gap-1 max-w-fit", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-orange-500" }),
                "Away"
              ] }),
              s.presenceStatus === "OFFLINE" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-semibold text-[10px]", children: "Offline" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                disabled: isTerminating || s.presenceStatus === "OFFLINE",
                onClick: () => {
                  if (confirm(`Force logout and revoke CRM session for ${s.employeeName}?`)) {
                    terminateMutation.mutate(s);
                  }
                },
                className: "flex items-center gap-1 ml-auto px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[11px] transition disabled:opacity-40 disabled:pointer-events-none",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: "h-3 w-3" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isTerminating ? "Terminating..." : "Terminate Session" })
                ]
              }
            ) })
          ] }, s.sessionId);
        }) })
      ] }) })
    ] })
  ] });
}
const BUILTIN_SOUND_OPTIONS = [
  { id: "chime", label: "Harmonic Chime (Default)", description: "3-note melodic chime (pleasant & clear)" },
  { id: "bell", label: "Crystal Bell", description: "High-resonance ringing alert bell" },
  { id: "digital_ring", label: "Digital Ring", description: "Urgent dual-pulse digital beep" },
  { id: "radar", label: "Radar Pulse", description: "Modern sweeping radar ping" },
  { id: "soft_ping", label: "Soft Ping", description: "Subtle non-intrusive soft tone" }
];
function ReminderAudioSettingsCard() {
  const qc = useQueryClient();
  const fetchGlobalSettingsFn = useServerFn(getGlobalReminderSoundSettings);
  const saveGlobalSettingsFn = useServerFn(saveGlobalReminderSoundSettings);
  const uploadAudioFn = useServerFn(uploadAlertAudioFile);
  const [settings, setSettings] = reactExports.useState(getSoundSettings);
  const [hasPermission, setHasPermission] = reactExports.useState(false);
  const [isUploading, setIsUploading] = reactExports.useState(false);
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const fileInputRef = reactExports.useRef(null);
  const { data: serverSettings, isLoading } = useQuery({
    queryKey: ["global-reminder-sound-settings"],
    queryFn: () => fetchGlobalSettingsFn(),
    staleTime: 1e4
  });
  reactExports.useEffect(() => {
    if (serverSettings) {
      const merged = syncGlobalSoundSettings({
        enabled: serverSettings.enabled,
        tone: serverSettings.tone,
        volume: serverSettings.volume,
        desktopNotifications: serverSettings.desktopNotifications,
        customAudioUrl: serverSettings.customAudioUrl,
        customAudioName: serverSettings.customAudioName
      });
      setSettings(merged);
    }
  }, [serverSettings]);
  reactExports.useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setHasPermission(Notification.permission === "granted");
    }
  }, []);
  const handleSave = async (overrideSettings) => {
    const toSave = settings;
    setIsSaving(true);
    try {
      saveSoundSettings(toSave);
      await saveGlobalSettingsFn({
        data: {
          enabled: toSave.enabled,
          tone: toSave.tone,
          volume: toSave.volume,
          desktopNotifications: toSave.desktopNotifications,
          customAudioUrl: toSave.customAudioUrl,
          customAudioName: toSave.customAudioName
        }
      });
      await qc.invalidateQueries({ queryKey: ["global-reminder-sound-settings"] });
      toast.success("✅ Sound settings saved & synced across all employees!");
    } catch (err) {
      console.warn("[ReminderAudioSettingsCard] save error:", err);
      toast.error(err.message || "Failed to save to server");
    } finally {
      setIsSaving(false);
    }
  };
  const update = async (partial) => {
    const updated = saveSoundSettings(partial);
    setSettings(updated);
    try {
      await saveGlobalSettingsFn({
        data: {
          enabled: updated.enabled,
          tone: updated.tone,
          volume: updated.volume,
          desktopNotifications: updated.desktopNotifications,
          customAudioUrl: updated.customAudioUrl,
          customAudioName: updated.customAudioName
        }
      });
      qc.invalidateQueries({ queryKey: ["global-reminder-sound-settings"] });
      toast.success("Sound settings synced");
    } catch (err) {
      console.warn("[ReminderAudioSettingsCard] server save warning:", err);
    }
  };
  const handleTest = (tone) => {
    playReminderSound(tone ?? settings.tone, settings.volume, settings.customAudioUrl);
    toast.info(`Playing preview for ${tone ?? settings.tone}`);
  };
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("audio/") && !file.name.match(/\.(mp3|wav|ogg|m4a|aac)$/i)) {
      toast.error("Please upload a valid audio file (.mp3, .wav, .ogg, .m4a, .aac)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Audio file size should be less than 5MB");
      return;
    }
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result;
      try {
        const res = await uploadAudioFn({
          data: {
            fileName: file.name,
            base64Data: dataUrl,
            target: "reminder"
          }
        });
        const updated = saveSoundSettings({
          customAudioUrl: res.url,
          customAudioName: file.name,
          tone: "custom"
        });
        setSettings(updated);
        qc.invalidateQueries({ queryKey: ["global-reminder-sound-settings"] });
        toast.success(`Custom audio "${file.name}" uploaded and synced across all staff!`);
        playReminderSound("custom", updated.volume, res.url);
      } catch (err) {
        console.warn("[handleFileUpload] backend upload fallback to dataUrl:", err);
        const updated = saveSoundSettings({
          customAudioUrl: dataUrl,
          customAudioName: file.name,
          tone: "custom"
        });
        setSettings(updated);
        toast.success(`Custom audio "${file.name}" applied!`);
        playReminderSound("custom", updated.volume, dataUrl);
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.onerror = () => {
      setIsUploading(false);
      toast.error("Failed to read audio file");
    };
    reader.readAsDataURL(file);
  };
  const handleRemoveCustomAudio = async (e) => {
    e.stopPropagation();
    await update({
      customAudioUrl: null,
      customAudioName: null,
      tone: "chime"
    });
    toast.info("Custom audio removed. Reset to default Harmonic Chime.");
  };
  const requestPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return toast.error("Desktop notifications are not supported in this browser");
    }
    const res = await Notification.requestPermission();
    setHasPermission(res === "granted");
    if (res === "granted") {
      toast.success("Desktop notifications enabled!");
      showDesktopNotification("🔥 Hot Order Alerts Enabled", {
        body: "You will now receive desktop popup notifications when a customer callback is due."
      });
    } else {
      toast.error("Notification permission denied in browser");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SectionCard,
    {
      title: "🔔 Order Callback & Hot Order Audio Alerts",
      action: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => handleTest(),
            className: "inline-flex items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer shadow-2xs",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "size-3.5" }),
              " Test Sound Alert"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            disabled: isSaving || isUploading,
            onClick: () => handleSave(),
            className: "inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition cursor-pointer disabled:opacity-60",
            children: [
              isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5" }),
              isSaving ? "Saving..." : "Save Sound Settings"
            ]
          }
        )
      ] }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-6 text-slate-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-600", children: [
          "Configure the sound and screen notifications triggered on employee laptops whenever a customer callback reminder ends and the order transitions into a ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-rose-600", children: "🔥 Hot Order" }),
          ". Uploaded ringtones automatically synchronize across all staff browsers."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-bold uppercase tracking-wider text-slate-700", children: "Alert Sound Tone & Custom Ringtones" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                disabled: isUploading || isLoading,
                onClick: () => fileInputRef.current?.click(),
                className: "inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg transition shadow-2xs cursor-pointer disabled:opacity-60",
                children: isUploading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 animate-spin text-blue-600" }),
                  " Uploading Sound..."
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-3.5" }),
                  " Upload Custom Audio (.mp3/.wav)"
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: fileInputRef,
                type: "file",
                accept: "audio/*,.mp3,.wav,.ogg,.m4a,.aac",
                onChange: handleFileUpload,
                className: "hidden"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: [
            settings.customAudioUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                onClick: () => {
                  update({ tone: "custom" });
                  playReminderSound("custom", settings.volume, settings.customAudioUrl);
                },
                className: `relative flex flex-col justify-between rounded-xl border p-3.5 transition cursor-pointer select-none ${settings.tone === "custom" ? "border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs" : "border-slate-200 bg-slate-50/40 hover:border-slate-300 hover:bg-slate-50"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 truncate", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Music, { className: "size-3.5 text-emerald-600 shrink-0" }),
                        settings.customAudioName || "Custom Audio Ringtone"
                      ] }),
                      settings.tone === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4 text-emerald-600 shrink-0" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-500 mt-1", children: "Company-wide uploaded alert sound file" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center justify-between gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: handleRemoveCustomAudio,
                        className: "inline-flex items-center gap-1 text-[10px] text-rose-600 hover:text-rose-700 font-semibold p-1 hover:bg-rose-50 rounded cursor-pointer",
                        title: "Remove custom audio",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3" }),
                          " Remove"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: (e) => {
                          e.stopPropagation();
                          handleTest("custom");
                        },
                        className: "inline-flex items-center gap-1 rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700 hover:bg-slate-100 shadow-2xs cursor-pointer",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "size-2.5" }),
                          " Play"
                        ]
                      }
                    )
                  ] })
                ]
              }
            ),
            BUILTIN_SOUND_OPTIONS.map((opt) => {
              const isSelected = settings.tone === opt.id;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  onClick: () => {
                    update({ tone: opt.id });
                    playReminderSound(opt.id, settings.volume);
                  },
                  className: `relative flex flex-col justify-between rounded-xl border p-3.5 transition cursor-pointer select-none ${isSelected ? "border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs" : "border-slate-200 bg-slate-50/40 hover:border-slate-300 hover:bg-slate-50"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-bold ${isSelected ? "text-blue-950" : "text-slate-800"}`, children: opt.label }),
                        isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4 text-blue-600" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-500 mt-1", children: opt.description })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: (e) => {
                          e.stopPropagation();
                          handleTest(opt.id);
                        },
                        className: "inline-flex items-center gap-1 rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700 hover:bg-slate-100 shadow-2xs cursor-pointer",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "size-2.5" }),
                          " Play"
                        ]
                      }
                    ) })
                  ]
                },
                opt.id
              );
            })
          ] }),
          !settings.customAudioUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              onClick: () => fileInputRef.current?.click(),
              className: "flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-3 text-xs text-slate-500 hover:bg-slate-50 hover:border-blue-400 cursor-pointer transition",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileHeadphone, { className: "size-4 text-slate-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Want your own sound? Click here to upload an ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "MP3 / WAV / OGG" }),
                  " custom ringtone for all employee laptops."
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5", children: [
                settings.volume === 0 || !settings.enabled ? /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "size-4 text-slate-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "size-4 text-slate-700" }),
                "Alert Volume (",
                Math.round(settings.volume * 100),
                "%)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => update({ enabled: !settings.enabled }),
                  className: `text-[11px] font-bold px-2 py-0.5 rounded cursor-pointer transition ${settings.enabled ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`,
                  children: settings.enabled ? "Sound: ON" : "Sound: MUTED"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "range",
                min: 0,
                max: 1,
                step: 0.05,
                value: settings.volume,
                onChange: (e) => update({ volume: parseFloat(e.target.value) }),
                className: "w-full accent-blue-600 cursor-pointer"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BellRing, { className: "size-4 text-slate-700" }),
                "Browser Desktop Notifications"
              ] }),
              hasPermission ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200", children: "Allowed" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: requestPermission,
                  className: "rounded bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-blue-700 cursor-pointer",
                  children: "Enable Notifications"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-500", children: "Allows the browser to pop up system banner alerts when callbacks are due, even if you are working on another tab or window." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t border-slate-100 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-500", children: [
            "Current Alert Tone: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "text-slate-800 font-semibold", children: settings.tone === "custom" ? settings.customAudioName || "Custom Uploaded Audio" : BUILTIN_SOUND_OPTIONS.find((o) => o.id === settings.tone)?.label || settings.tone })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              disabled: isSaving || isUploading,
              onClick: () => handleSave(),
              className: "inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-xs font-bold text-white shadow-md transition cursor-pointer disabled:opacity-60",
              children: [
                isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4" }),
                isSaving ? "Saving Settings..." : "Save Sound Settings for All Employees"
              ]
            }
          )
        ] })
      ] })
    }
  );
}
const TABS = [{
  id: "company",
  label: "Company Info",
  icon: Building2
}, {
  id: "shifts",
  label: "Shifts & Presence",
  icon: CalendarRange
}, {
  id: "sessions",
  label: "Active Sessions",
  icon: Laptop
}, {
  id: "hours",
  label: "Business Hours",
  icon: Clock
}, {
  id: "callback_presets",
  label: "Callback Presets & Timers",
  icon: Timer
}, {
  id: "statuses",
  label: "Status Master",
  icon: ListChecks
}, {
  id: "templates",
  label: "Email Templates",
  icon: Mail
}, {
  id: "reasons",
  label: "Reason Library",
  icon: BookOpen
}, {
  id: "automation",
  label: "Automation Rules",
  icon: Zap
}, {
  id: "notifications",
  label: "Notifications",
  icon: Bell
}, {
  id: "gateways",
  label: "Payment Gateways",
  icon: CreditCard
}, {
  id: "workflow",
  label: "Cancellation Flow",
  icon: Workflow
}];
const LEAD_STATUSES = ["New Lead", "Contacted", "Follow-up Required", "Payment Pending/Failed", "Payment Successful", "Welcome Mail Sent", "Documents Pending", "Under Process", "Closed", "Refund Requested", "Refund Status"];
const ORDER_STATUSES = ["NEW LEAD", "PAYMENT RECEIVED", "WELCOME MAIL SENT", "EXPERT ASSIGNED", "INFORMATION COLLECTION", "DOCUMENTS PENDING", "DOCUMENTS VERIFIED", "PROCESSING", "COMPLAINT SUBMITTED", "WAITING AUTHORITY RESPONSE", "COMPLETED", "CUSTOMER DECLINED SERVICE", "CLOSURE NOTICE SENT", "CLOSED", "CANCELLED", "REFUNDED"];
const COMPLAINT_STATUSES = ["Draft", "Submitted", "Under Review", "Awaiting Response", "Resolved", "Closed"];
function SettingsPage() {
  const [tab, setTab] = reactExports.useState("company");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-medium tracking-tight", style: {
        color: "var(--admin-fg)"
      }, children: "Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: {
        color: "var(--admin-fg-muted)"
      }, children: "Configure company info, shifts, sessions, statuses, and automation." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 border-b flex-wrap", style: {
      borderColor: "var(--admin-border)"
    }, children: TABS.map((t) => {
      const Icon = t.icon;
      const active = tab === t.id;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTab(t.id), className: "flex items-center gap-1.5 px-3 py-2 text-sm border-b-2 -mb-px transition-colors", style: {
        borderColor: active ? "var(--admin-primary)" : "transparent",
        color: active ? "var(--admin-primary)" : "var(--admin-fg-muted)",
        fontWeight: active ? 500 : 400
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" }),
        t.label
      ] }, t.id);
    }) }),
    tab === "company" && /* @__PURE__ */ jsxRuntimeExports.jsx(CompanyTab, {}),
    tab === "shifts" && /* @__PURE__ */ jsxRuntimeExports.jsx(ShiftsAndPresenceTab, {}),
    tab === "sessions" && /* @__PURE__ */ jsxRuntimeExports.jsx(ActiveSessionsTab, {}),
    tab === "hours" && /* @__PURE__ */ jsxRuntimeExports.jsx(BusinessHoursTab, {}),
    tab === "callback_presets" && /* @__PURE__ */ jsxRuntimeExports.jsx(AppSettingsCard, {}),
    tab === "statuses" && /* @__PURE__ */ jsxRuntimeExports.jsx(StatusesTab, {}),
    tab === "templates" && /* @__PURE__ */ jsxRuntimeExports.jsx(TemplatesTab, {}),
    tab === "reasons" && /* @__PURE__ */ jsxRuntimeExports.jsx(ReasonLibraryTab, {}),
    tab === "automation" && /* @__PURE__ */ jsxRuntimeExports.jsx(AutomationRulesTab, {}),
    tab === "notifications" && /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationsTab, {}),
    tab === "gateways" && /* @__PURE__ */ jsxRuntimeExports.jsx(GatewaysTab, {}),
    tab === "workflow" && /* @__PURE__ */ jsxRuntimeExports.jsx(WorkflowTab, {})
  ] });
}
function CompanyTab() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionCard, { title: "Company Information", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 grid md:grid-cols-2 gap-4 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Company Name", value: COMPANY_NAME }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Brand", value: SITE_NAME }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Support Email", value: SUPPORT_EMAIL }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Website", value: BASE_URL.replace(/^https?:\/\//, "") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Address", value: "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "GST Number", value: "—" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 border-t text-xs", style: {
      borderColor: "var(--admin-border)",
      color: "var(--admin-fg-muted)"
    }, children: "Read-only display. Edit via your account manager." })
  ] });
}
function TemplatesTab() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: "Email Templates", action: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/email-templates", className: "text-xs", style: {
    color: "var(--admin-accent)"
  }, children: "Open template editor →" }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 text-sm space-y-2", style: {
    color: "var(--admin-fg-muted)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "All workflow emails (delay notices, 3 / 5 / 7-day follow-ups, no-response warnings, closure notice, refund decisions) are managed in the Email Templates editor." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs", children: [
      "Variables available: ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono", children: "{{customer_name}}" }),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono", children: "{{order_id}}" }),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono", children: "{{service_name}}" }),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono", children: "{{reason}}" }),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono", children: "{{date}}" }),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono", children: "{{company_name}}" }),
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "font-mono", children: "{{support_email}}" }),
      "."
    ] })
  ] }) });
}
function StatusesTab() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatusList, { title: "Lead Statuses", items: LEAD_STATUSES }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatusList, { title: "Order Statuses", items: ORDER_STATUSES }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatusList, { title: "Complaint Statuses", items: COMPLAINT_STATUSES })
  ] });
}
function StatusList({
  title,
  items
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "p-2 space-y-0.5 max-h-80 overflow-y-auto", children: items.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between px-2 py-1.5 rounded text-sm", style: {
    background: i % 2 ? "var(--admin-surface-2)" : "transparent"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
      color: "var(--admin-fg)"
    }, children: s }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono", style: {
      color: "var(--admin-fg-subtle)"
    }, children: String(i + 1).padStart(2, "0") })
  ] }, s)) }) });
}
function NotificationsTab() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ReminderAudioSettingsCard, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppSettingsCard, {})
  ] });
}
function GatewaysTab() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: "Payment Gateways", action: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/gateways", className: "text-xs", style: {
    color: "var(--admin-accent)"
  }, children: "Open gateway manager →" }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 grid md:grid-cols-2 gap-3 text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(GatewayCard, { name: "PayU", status: "Connected" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(GatewayCard, { name: "CCAvenue", status: "Connected" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(GatewayCard, { name: "Razorpay", status: "Available" })
  ] }) });
}
function GatewayCard({
  name,
  status
}) {
  const ok = status === "Connected";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border p-3 flex items-center justify-between", style: {
    borderColor: "var(--admin-border)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", style: {
      color: "var(--admin-fg)"
    }, children: name }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs", style: {
      color: ok ? "var(--admin-success)" : "var(--admin-fg-muted)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-1.5 rounded-full", style: {
        background: ok ? "var(--admin-success)" : "var(--admin-fg-subtle)"
      } }),
      status
    ] })
  ] });
}
function WorkflowTab() {
  const [step1, setStep1] = reactExports.useState(7);
  const [step2, setStep2] = reactExports.useState(7);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: "Cancellation Workflow Automation", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-4 text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: {
      color: "var(--admin-fg-muted)"
    }, children: "Configures the automated 3-step closure flow when a customer requests cancellation after payment." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Step, { n: 1, title: "Cancellation Request Received", desc: 'Status set to "Customer Declined Service" and Email 1 sent immediately.', template: "cancellation-request-received" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DayField, { label: "Days before Step 2", value: step1, onChange: setStep1 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Step, { n: 2, title: "Closure Approval Pending", desc: "If no response, status escalates and Email 2 (Final Notice) is sent.", template: "final-notice-before-closure" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DayField, { label: "Days before Step 3", value: step2, onChange: setStep2 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Step, { n: 3, title: "Closure Notice Sent → Closed", desc: "Email 3 (Order Closed) is sent and the order is finalised.", template: "order-closed-notice" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border-l-4 p-3 text-xs", style: {
      borderLeftColor: "var(--admin-warn)",
      background: "var(--admin-surface-2)",
      color: "var(--admin-fg-muted)"
    }, children: "Backend automation (DB columns, cron job, email templates) is queued in Phase 9 and will activate these timers once approved." })
  ] }) });
}
function Step({
  n,
  title,
  desc,
  template
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 rounded-md border p-3", style: {
    borderColor: "var(--admin-border)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-7 shrink-0 rounded-full flex items-center justify-center text-xs font-medium", style: {
      background: "var(--admin-primary)",
      color: "#fff"
    }, children: n }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", style: {
        color: "var(--admin-fg)"
      }, children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs mt-0.5", style: {
        color: "var(--admin-fg-muted)"
      }, children: desc }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] font-mono mt-1", style: {
        color: "var(--admin-accent)"
      }, children: [
        "Template: ",
        template
      ] })
    ] })
  ] });
}
function DayField({
  label,
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3 text-xs", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
      color: "var(--admin-fg-muted)"
    }, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 1, max: 60, value, onChange: (e) => onChange(Math.max(1, Math.min(60, Number(e.target.value) || 1))), className: "w-20 rounded border px-2 py-1 text-sm tabular-nums", style: {
      borderColor: "var(--admin-border)",
      background: "var(--admin-surface)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
      color: "var(--admin-fg-muted)"
    }, children: "days" })
  ] });
}
function Field({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-wide", style: {
      color: "var(--admin-fg-muted)"
    }, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5", style: {
      color: "var(--admin-fg)"
    }, children: value })
  ] });
}
export {
  SettingsPage as component
};
