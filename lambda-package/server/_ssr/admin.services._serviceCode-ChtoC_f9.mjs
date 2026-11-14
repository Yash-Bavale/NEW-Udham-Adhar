import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { aK as Route$M, j as useServerFn } from "./router-QgJicixe.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { o as object, s as string, a as array, b as boolean, n as number, _ as _enum } from "../_libs/zod.mjs";
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
import "../_libs/lucide-react.mjs";
import "../_libs/date-fns.mjs";
import "../_libs/react-day-picker.mjs";
import "../_libs/date-fns__tz.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const FieldSchema = object({
  key: string().trim().min(1).max(80).regex(/^[a-zA-Z0-9_]+$/),
  label: string().trim().min(1).max(200),
  type: _enum(["text", "textarea", "number", "email", "tel", "date", "select", "radio", "checkbox", "file"]),
  required: boolean().default(false),
  placeholder: string().max(200).optional().nullable(),
  help: string().max(500).optional().nullable(),
  options: array(object({
    value: string().max(120),
    label: string().max(200)
  })).max(50).optional(),
  validation: object({
    min: number().optional(),
    max: number().optional(),
    pattern: string().max(200).optional()
  }).optional(),
  group: string().max(80).optional().nullable()
});
const DocumentSchema = object({
  key: string().trim().min(1).max(80).regex(/^[a-zA-Z0-9_]+$/),
  label: string().trim().min(1).max(200),
  required: boolean().default(false),
  accept: string().max(120).default("image/*,application/pdf"),
  max_size_mb: number().min(1).max(25).default(5),
  help: string().max(500).optional().nullable()
});
const FormSchemaInput = object({
  id: string().uuid().optional(),
  service_code: string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/),
  title: string().trim().min(2).max(200),
  description: string().max(2e3).nullable().optional(),
  is_active: boolean().default(true),
  schema: object({
    fields: array(FieldSchema).max(120)
  }),
  documents: array(DocumentSchema).max(40)
});
const StatusStep = object({
  key: string().trim().min(1).max(80).regex(/^[a-z0-9_]+$/),
  label: string().trim().min(1).max(120),
  description: string().max(500).optional().nullable(),
  color: string().max(40).optional().nullable(),
  is_terminal: boolean().default(false),
  sla_hours: number().int().min(0).max(1e4).optional().nullable()
});
const WorkflowInput = object({
  id: string().uuid().optional(),
  service_code: string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/),
  display_name: string().trim().min(2).max(160),
  default_assignee_role: string().max(40).nullable().optional(),
  is_active: boolean().default(true),
  application_statuses: array(StatusStep).min(1).max(40)
});
const getServiceConfig = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  service_code: string().min(1).max(80)
}).parse(i)).handler(createSsrRpc("8e754c3cf31d97400ffb9aef78976823e9d72bc96ed695a8aa6dd04528879078"));
const saveFormSchema = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => FormSchemaInput.parse(i)).handler(createSsrRpc("ea362e5d4ecad5f10c7442bec5a9cfb3a003b07e978efa45b1f7a96f1710e728"));
createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  service_code: string().min(1).max(80)
}).parse(i)).handler(createSsrRpc("3631af097aa13afc2311d9e01dbab1705e423c2c8a616799195236876da4b667"));
const saveWorkflow = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => WorkflowInput.parse(i)).handler(createSsrRpc("28ed152f44893ab0695188e3cddaa5c57cb165cd4da635ef96dada136daeada8"));
const DEFAULT_STATUSES = [{
  key: "awaiting_payment",
  label: "Awaiting Payment",
  color: "amber",
  is_terminal: false
}, {
  key: "form_pending",
  label: "Form Pending",
  color: "amber",
  is_terminal: false
}, {
  key: "documents_pending",
  label: "Documents Pending",
  color: "amber",
  is_terminal: false
}, {
  key: "under_review",
  label: "Under Review",
  color: "blue",
  is_terminal: false,
  sla_hours: 24
}, {
  key: "processing",
  label: "Processing",
  color: "blue",
  is_terminal: false,
  sla_hours: 48
}, {
  key: "certificate_issued",
  label: "Certificate Issued",
  color: "green",
  is_terminal: true
}];
function ServiceBuilderPage() {
  const {
    serviceCode
  } = Route$M.useParams();
  const getFn = useServerFn(getServiceConfig);
  const saveFormFn = useServerFn(saveFormSchema);
  const saveWfFn = useServerFn(saveWorkflow);
  const qc = useQueryClient();
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin.service-config", serviceCode],
    queryFn: () => getFn({
      data: {
        service_code: serviceCode
      }
    })
  });
  const [tab, setTab] = reactExports.useState("form");
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [fields, setFields] = reactExports.useState([]);
  const [docs, setDocs] = reactExports.useState([]);
  const [statuses, setStatuses] = reactExports.useState([]);
  const [wfName, setWfName] = reactExports.useState("");
  const [wfRole, setWfRole] = reactExports.useState("operations");
  reactExports.useEffect(() => {
    if (!data) return;
    const fs = data.formSchema;
    setTitle(fs?.title ?? data.service?.service_name ?? "");
    setDescription(fs?.description ?? "");
    setFields(fs?.schema?.fields ?? []);
    setDocs(fs?.documents ?? []);
    const wf = data.workflow;
    setWfName(wf?.display_name ?? data.service?.service_name ?? "");
    setWfRole(wf?.default_assignee_role ?? "operations");
    setStatuses(wf?.application_statuses?.length ? wf.application_statuses : DEFAULT_STATUSES);
  }, [data]);
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-sm text-slate-500", children: "Loading service…" });
  if (!data?.service) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-sm text-red-600", children: "Service not found." });
  async function publishForm() {
    try {
      const res = await saveFormFn({
        data: {
          service_code: serviceCode,
          title: title || data.service.service_name,
          description: description || null,
          is_active: true,
          schema: {
            fields
          },
          documents: docs
        }
      });
      toast.success(`Form published (v${res.version})`);
      qc.invalidateQueries({
        queryKey: ["admin.service-config", serviceCode]
      });
    } catch (e) {
      toast.error(e.message);
    }
  }
  async function publishWorkflow() {
    try {
      await saveWfFn({
        data: {
          service_code: serviceCode,
          display_name: wfName,
          default_assignee_role: wfRole || null,
          is_active: true,
          application_statuses: statuses
        }
      });
      toast.success("Workflow saved");
      qc.invalidateQueries({
        queryKey: ["admin.service-config", serviceCode]
      });
    } catch (e) {
      toast.error(e.message);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/services", className: "text-xs text-slate-500 hover:underline", children: "← All services" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold mt-1", children: data.service.service_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-slate-500", children: serviceCode })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        tab !== "workflow" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: publishForm, className: "rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800", children: "Publish Form (new version)" }),
        tab === "workflow" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: publishWorkflow, className: "rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800", children: "Save Workflow" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b flex gap-6 text-sm", children: ["form", "documents", "workflow"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab(t), className: `pb-2 capitalize ${tab === t ? "border-b-2 border-slate-900 font-semibold" : "text-slate-500"}`, children: t === "form" ? "Form Fields" : t === "documents" ? "Documents" : "Workflow" }, t)) }),
    tab === "form" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-white p-4 grid md:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TextInput, { label: "Form title", value: title, onChange: setTitle }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TextInput, { label: "Description (optional)", value: description, onChange: setDescription })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        fields.map((f, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(FieldEditor, { field: f, onChange: (nf) => setFields(fields.map((x, i) => i === idx ? nf : x)), onRemove: () => setFields(fields.filter((_, i) => i !== idx)), onMove: (dir) => {
          const j = idx + dir;
          if (j < 0 || j >= fields.length) return;
          const copy = [...fields];
          [copy[idx], copy[j]] = [copy[j], copy[idx]];
          setFields(copy);
        } }, idx)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFields([...fields, {
          key: `field_${fields.length + 1}`,
          label: "New field",
          type: "text",
          required: false
        }]), className: "rounded-lg border-2 border-dashed w-full py-3 text-sm text-slate-600 hover:bg-slate-50", children: "+ Add field" })
      ] })
    ] }),
    tab === "documents" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      docs.map((d, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(DocumentEditor, { doc: d, onChange: (nd) => setDocs(docs.map((x, i) => i === idx ? nd : x)), onRemove: () => setDocs(docs.filter((_, i) => i !== idx)) }, idx)),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDocs([...docs, {
        key: `doc_${docs.length + 1}`,
        label: "New document",
        required: true,
        accept: "image/*,application/pdf",
        max_size_mb: 5
      }]), className: "rounded-lg border-2 border-dashed w-full py-3 text-sm text-slate-600 hover:bg-slate-50", children: "+ Add document requirement" })
    ] }),
    tab === "workflow" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-white p-4 grid md:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TextInput, { label: "Workflow name", value: wfName, onChange: setWfName }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 mb-1", children: "Default assignee role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: wfRole, onChange: (e) => setWfRole(e.target.value), className: "w-full rounded border px-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "operations", children: "Operations" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "support", children: "Support" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "accounts", children: "Accounts" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "super_admin", children: "Super Admin" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        statuses.map((s, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusEditor, { step: s, index: idx, onChange: (ns) => setStatuses(statuses.map((x, i) => i === idx ? ns : x)), onRemove: () => setStatuses(statuses.filter((_, i) => i !== idx)), onMove: (dir) => {
          const j = idx + dir;
          if (j < 0 || j >= statuses.length) return;
          const copy = [...statuses];
          [copy[idx], copy[j]] = [copy[j], copy[idx]];
          setStatuses(copy);
        } }, idx)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStatuses([...statuses, {
          key: `status_${statuses.length + 1}`,
          label: "New status",
          is_terminal: false
        }]), className: "rounded-lg border-2 border-dashed w-full py-3 text-sm text-slate-600 hover:bg-slate-50", children: "+ Add workflow step" })
      ] })
    ] })
  ] });
}
function TextInput({
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
function FieldEditor({
  field,
  onChange,
  onRemove,
  onMove
}) {
  const needsOptions = field.type === "select" || field.type === "radio";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-white p-4 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onMove(-1), className: "text-xs text-slate-500 hover:text-slate-900", children: "↑" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onMove(1), className: "text-xs text-slate-500 hover:text-slate-900", children: "↓" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onRemove, className: "text-xs text-red-600 hover:underline", children: "Remove" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TextInput, { label: "Field key", value: field.key, onChange: (v) => onChange({
        ...field,
        key: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TextInput, { label: "Label", value: field.label, onChange: (v) => onChange({
        ...field,
        label: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 mb-1", children: "Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: field.type, onChange: (e) => onChange({
          ...field,
          type: e.target.value
        }), className: "w-full rounded border px-3 py-2", children: ["text", "textarea", "number", "email", "tel", "date", "select", "radio", "checkbox", "file"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t, children: t }, t)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TextInput, { label: "Placeholder", value: field.placeholder ?? "", onChange: (v) => onChange({
        ...field,
        placeholder: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TextInput, { label: "Help text", value: field.help ?? "", onChange: (v) => onChange({
        ...field,
        help: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TextInput, { label: "Group / section", value: field.group ?? "", onChange: (v) => onChange({
        ...field,
        group: v
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-2 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: field.required, onChange: (e) => onChange({
        ...field,
        required: e.target.checked
      }) }),
      "Required"
    ] }),
    needsOptions && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t pt-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 mb-2", children: "Options" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        (field.options ?? []).map((opt, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "flex-1 rounded border px-2 py-1 text-sm", placeholder: "value", value: opt.value, onChange: (e) => {
            const next = [...field.options ?? []];
            next[i] = {
              ...next[i],
              value: e.target.value
            };
            onChange({
              ...field,
              options: next
            });
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "flex-1 rounded border px-2 py-1 text-sm", placeholder: "label", value: opt.label, onChange: (e) => {
            const next = [...field.options ?? []];
            next[i] = {
              ...next[i],
              label: e.target.value
            };
            onChange({
              ...field,
              options: next
            });
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onChange({
            ...field,
            options: (field.options ?? []).filter((_, j) => j !== i)
          }), className: "text-xs text-red-600", children: "×" })
        ] }, i)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onChange({
          ...field,
          options: [...field.options ?? [], {
            value: "",
            label: ""
          }]
        }), className: "text-xs text-slate-600 hover:underline", children: "+ Add option" })
      ] })
    ] })
  ] });
}
function DocumentEditor({
  doc,
  onChange,
  onRemove
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-white p-4 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onRemove, className: "text-xs text-red-600 hover:underline", children: "Remove" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TextInput, { label: "Document key", value: doc.key, onChange: (v) => onChange({
        ...doc,
        key: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TextInput, { label: "Label", value: doc.label, onChange: (v) => onChange({
        ...doc,
        label: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TextInput, { label: "Accepted types", value: doc.accept, onChange: (v) => onChange({
        ...doc,
        accept: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TextInput, { label: "Max size (MB)", type: "number", value: String(doc.max_size_mb), onChange: (v) => onChange({
        ...doc,
        max_size_mb: Number(v) || 5
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TextInput, { label: "Help text", value: doc.help ?? "", onChange: (v) => onChange({
        ...doc,
        help: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: doc.required, onChange: (e) => onChange({
          ...doc,
          required: e.target.checked
        }) }),
        "Required"
      ] })
    ] })
  ] });
}
function StatusEditor({
  step,
  index,
  onChange,
  onRemove,
  onMove
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-white p-4 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-500", children: [
        "Step ",
        index + 1
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onMove(-1), className: "text-xs text-slate-500 hover:text-slate-900", children: "↑" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onMove(1), className: "text-xs text-slate-500 hover:text-slate-900", children: "↓" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onRemove, className: "text-xs text-red-600 hover:underline", children: "Remove" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TextInput, { label: "Status key", value: step.key, onChange: (v) => onChange({
        ...step,
        key: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TextInput, { label: "Label", value: step.label, onChange: (v) => onChange({
        ...step,
        label: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 mb-1", children: "Color" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: step.color ?? "", onChange: (e) => onChange({
          ...step,
          color: e.target.value || null
        }), className: "w-full rounded border px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "(none)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "amber", children: "Amber" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "blue", children: "Blue" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "green", children: "Green" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "red", children: "Red" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "slate", children: "Slate" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TextInput, { label: "SLA hours", type: "number", value: step.sla_hours == null ? "" : String(step.sla_hours), onChange: (v) => onChange({
        ...step,
        sla_hours: v === "" ? null : Number(v)
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TextInput, { label: "Description", value: step.description ?? "", onChange: (v) => onChange({
        ...step,
        description: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: step.is_terminal, onChange: (e) => onChange({
          ...step,
          is_terminal: e.target.checked
        }) }),
        "Terminal step"
      ] })
    ] })
  ] });
}
export {
  ServiceBuilderPage as component
};
