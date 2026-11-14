import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { at as Route$L, j as useServerFn } from "./router-QgJicixe.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { b as getSubmission, u as updateSubmissionStatus } from "./submissions-admin.functions-bHLflT8I.mjs";
import "../_libs/seroval.mjs";
import "./index.mjs";
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
import "../_libs/lucide-react.mjs";
import "../_libs/date-fns.mjs";
import "../_libs/react-day-picker.mjs";
import "../_libs/date-fns__tz.mjs";
function validateField(field, value) {
  if (field.required && (value == null || value === "" || Array.isArray(value) && value.length === 0)) {
    return {
      ok: false,
      reason: "Required field is empty"
    };
  }
  if (value == null || value === "") return {
    ok: true
  };
  if (field.type === "email" && typeof value === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return {
      ok: false,
      reason: "Invalid email format"
    };
  }
  if (field.type === "tel" && typeof value === "string" && !/^[+\d][\d\s\-()]{6,}$/.test(value)) {
    return {
      ok: false,
      reason: "Invalid phone number"
    };
  }
  if (field.type === "number") {
    const n = Number(value);
    if (Number.isNaN(n)) return {
      ok: false,
      reason: "Not a number"
    };
    if (field.validation?.min != null && n < field.validation.min) return {
      ok: false,
      reason: `Min ${field.validation.min}`
    };
    if (field.validation?.max != null && n > field.validation.max) return {
      ok: false,
      reason: `Max ${field.validation.max}`
    };
  }
  if (field.validation?.pattern && typeof value === "string") {
    try {
      if (!new RegExp(field.validation.pattern).test(value)) return {
        ok: false,
        reason: "Pattern mismatch"
      };
    } catch {
    }
  }
  return {
    ok: true
  };
}
function SubmissionDetailPage() {
  const {
    submissionId
  } = Route$L.useParams();
  const getFn = useServerFn(getSubmission);
  const updateFn = useServerFn(updateSubmissionStatus);
  const qc = useQueryClient();
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin.submission", submissionId],
    queryFn: () => getFn({
      data: {
        id: submissionId
      }
    })
  });
  const [note, setNote] = reactExports.useState("");
  const fields = reactExports.useMemo(() => data?.formSchema?.schema?.fields ?? [], [data]);
  const docDefs = reactExports.useMemo(() => data?.formSchema?.documents ?? [], [data]);
  const formData = data?.submission?.form_data ?? {};
  const documents = data?.documents ?? [];
  const validation = reactExports.useMemo(() => {
    if (!fields.length) return [];
    return fields.map((f) => ({
      field: f,
      value: formData[f.key],
      result: validateField(f, formData[f.key])
    }));
  }, [fields, formData]);
  const failedCount = validation.filter((v) => !v.result.ok).length;
  const filledCount = validation.filter((v) => v.value != null && v.value !== "").length;
  const docStatus = reactExports.useMemo(() => {
    return docDefs.map((d) => {
      const uploaded = documents.find((doc) => doc.doc_type === d.key);
      return {
        def: d,
        uploaded
      };
    });
  }, [docDefs, documents]);
  const workflow = data?.workflow;
  const currentStatus = data?.application?.application_status ?? data?.lead?.status ?? "—";
  const steps = workflow?.application_statuses ?? [];
  const currentIdx = steps.findIndex((s) => s.key === currentStatus);
  async function review(status) {
    try {
      await updateFn({
        data: {
          id: submissionId,
          status,
          notes: note || void 0
        }
      });
      toast.success(`Marked ${status.replace("_", " ")}`);
      setNote("");
      qc.invalidateQueries({
        queryKey: ["admin.submission", submissionId]
      });
      qc.invalidateQueries({
        queryKey: ["admin.submissions"]
      });
    } catch (e) {
      toast.error(e.message);
    }
  }
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-sm text-slate-500", children: "Loading submission…" });
  if (!data) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-sm text-red-600", children: "Submission not found." });
  const lead = data.lead;
  const customer = data.customer;
  const application = data.application;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/submissions", className: "text-xs text-slate-500 hover:underline", children: "← All submissions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold", children: lead?.name ?? "Unknown customer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-500", children: [
            data.submission.service_code,
            " · ",
            lead?.mobile ?? "",
            " · ",
            lead?.email ?? ""
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full bg-slate-900 text-white px-3 py-1 text-xs font-medium", children: data.submission.status })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Customer", children: customer ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/customers/$customerId", params: {
        customerId: customer.id
      }, className: "block hover:bg-slate-50 -m-2 p-2 rounded", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs text-emerald-700", children: customer.customer_code }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium mt-1", children: customer.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-500 mt-1", children: [
          customer.total_applications,
          " apps · ₹",
          Number(customer.lifetime_value).toLocaleString()
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400", children: "Not linked" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Lead", children: lead ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/leads/$leadId", params: {
        leadId: lead.id
      }, className: "block hover:bg-slate-50 -m-2 p-2 rounded", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs text-blue-700", children: lead.lead_code }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm mt-1", children: lead.service }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 mt-1", children: lead.status })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400", children: "No lead" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Application", children: application ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/applications/$applicationId", params: {
        applicationId: application.id
      }, className: "block hover:bg-slate-50 -m-2 p-2 rounded", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs text-purple-700", children: application.application_code }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm mt-1", children: application.application_status }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-500 mt-1", children: [
          "form: ",
          application.form_status,
          " · docs: ",
          application.document_status
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-400", children: "No application yet" }) })
    ] }),
    steps.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-white p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wide text-slate-500 mb-3", children: "Workflow" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 overflow-x-auto pb-1", children: steps.map((s, i) => {
        const isCurrent = i === currentIdx;
        const isDone = currentIdx >= 0 && i < currentIdx;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `px-3 py-1.5 rounded-full text-xs font-medium ${isCurrent ? "bg-slate-900 text-white" : isDone ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`, children: s.label }),
          i < steps.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-px bg-slate-200" })
        ] }, s.key);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-3 gap-3 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Fields filled", value: `${filledCount} / ${fields.length}`, tone: "slate" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Validation errors", value: String(failedCount), tone: failedCount ? "red" : "green" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Documents uploaded", value: `${documents.length} / ${docDefs.length || "any"}`, tone: "blue" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-b flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Form responses" }),
        fields.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400", children: "No schema configured" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y", children: [
        fields.length === 0 && Object.entries(formData).map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 grid grid-cols-3 gap-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-500 font-mono text-xs", children: k }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2 break-all", children: renderValue(v) })
        ] }, k)),
        validation.map(({
          field,
          value,
          result
        }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 grid grid-cols-12 gap-3 text-sm items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: field.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs text-slate-400", children: [
              field.key,
              " · ",
              field.type,
              field.required ? " · required" : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-6 break-all", children: renderValue(value) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2 text-right", children: result.ok ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-xs", children: "✓ Valid" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center rounded-full bg-red-50 text-red-700 px-2 py-0.5 text-xs", title: result.reason, children: [
            "✗ ",
            result.reason
          ] }) })
        ] }, field.key))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Documents" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y", children: [
        docStatus.length === 0 && documents.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-6 text-center text-sm text-slate-400", children: "No documents uploaded." }),
        docStatus.map(({
          def,
          uploaded
        }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 grid grid-cols-12 gap-3 text-sm items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: def.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs text-slate-400", children: [
              def.key,
              def.required ? " · required" : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-6 text-xs text-slate-600", children: uploaded ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: uploaded.file_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-slate-400", children: [
              (Number(uploaded.size_bytes) / 1024).toFixed(0),
              " KB · ",
              uploaded.status
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: "Not uploaded" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2 text-right", children: uploaded ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-xs", children: "✓ Uploaded" }) : def.required ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full bg-red-50 text-red-700 px-2 py-0.5 text-xs", children: "Missing" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full bg-slate-100 text-slate-500 px-2 py-0.5 text-xs", children: "Optional" }) })
        ] }, def.key)),
        documents.filter((d) => !docDefs.find((dd) => dd.key === d.doc_type)).map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 grid grid-cols-12 gap-3 text-sm items-center bg-amber-50/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: d.file_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs text-slate-400", children: [
              d.doc_type,
              " · unmapped"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-6 text-xs text-slate-600", children: [
            (Number(d.size_bytes) / 1024).toFixed(0),
            " KB · ",
            d.status
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-xs", children: "Extra" }) })
        ] }, d.id))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-white p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Review decision" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: note, onChange: (e) => setNote(e.target.value), placeholder: "Optional internal note for activity log…", rows: 3, className: "w-full rounded border px-3 py-2 text-sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => review("approved"), className: "rounded bg-emerald-600 text-white px-4 py-2 text-sm font-medium hover:bg-emerald-700", children: "Approve" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => review("needs_changes"), className: "rounded bg-amber-500 text-white px-4 py-2 text-sm font-medium hover:bg-amber-600", children: "Request Changes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => review("rejected"), className: "rounded bg-red-600 text-white px-4 py-2 text-sm font-medium hover:bg-red-700", children: "Reject" })
      ] })
    ] })
  ] });
}
function renderValue(v) {
  if (v == null || v === "") return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: "—" });
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "object") return /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "text-xs", children: JSON.stringify(v, null, 2) });
  return String(v);
}
function Card({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-white p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wide text-slate-500 mb-2", children: title }),
    children
  ] });
}
function Stat({
  label,
  value,
  tone
}) {
  const tones = {
    slate: "bg-slate-50 text-slate-900",
    red: "bg-red-50 text-red-700",
    green: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-lg border p-4 ${tones[tone]}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wide opacity-70", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-semibold mt-1", children: value })
  ] });
}
export {
  SubmissionDetailPage as component
};
