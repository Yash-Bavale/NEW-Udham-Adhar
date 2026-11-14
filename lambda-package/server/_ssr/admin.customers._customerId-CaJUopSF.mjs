import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { aG as Route$V, j as useServerFn, _ as useRole } from "./router-QgJicixe.mjs";
import { a as useQuery, u as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as getCustomer360, b as addCustomerNote, u as updateCustomer, c as uploadCustomerKyc, d as getCustomerKycSignedUrl } from "./customers.functions-CDRqqLIr.mjs";
import { T as TableSkeleton, S as SectionCard, b as StatusBadge, c as StatCard, a as Timeline } from "./ui-BVv-e2FI.mjs";
import { g as getFormSubmissionForLead } from "./submissions-admin.functions-bHLflT8I.mjs";
import { g as getDocumentSignedUrl } from "./onboarding.functions-DdT_CVNt.mjs";
import { getSchema } from "./schemas-DClqju6h.mjs";
import { f as formatIST, a as formatDateDMY } from "./datetime-DvkGwlJs.mjs";
import { P as PlantsView } from "./FormSubmissionPanel-Dg5xuYUg.mjs";
import { c as computeOrderStage, S as STAGE_META, a as STAGE_BADGE_CLASS } from "./computeOrderStage-D7ejTUnj.mjs";
import { C as CallButton } from "./CallButton-i-5I5V9S.mjs";
import "../_libs/seroval.mjs";
import "./index.mjs";
import "../_libs/pdf-lib.mjs";
import { ar as User, a8 as ShoppingBag, bd as IndianRupee, bA as FolderOpen, am as Activity, a9 as MessageSquareWarning, as as Send, b9 as ArrowLeft, a as Mail, P as Phone, c as MapPin, z as Calendar, b as MessageCircle, aD as Wallet, Q as FileText, ai as Award, af as Receipt, aB as Copy, bB as StickyNote, au as ExternalLink, y as ChevronDown, s as ChevronRight, l as CircleCheck, aI as CircleX, ad as Eye, D as Download, ax as TriangleAlert } from "../_libs/lucide-react.mjs";
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
import "./orders-filter-CXWoZisU.mjs";
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
import "./consultation-asWR5IET.mjs";
import "../_libs/motion.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "./customer-access.functions-N17nWKMW.mjs";
import "./dispute-browser-pdf-B2D_9n6v.mjs";
import "./nic-fill-ia8FfFhd.mjs";
import "./browser-phone-bus-CwJqzKkc.mjs";
import "../_libs/pdf-lib__standard-fonts.mjs";
import "../_libs/pako.mjs";
import "../_libs/pdf-lib__upng.mjs";
const fmtIST = (iso) => formatIST(iso);
function renderCell(key, v) {
  if (v === null || v === void 0 || v === "") return "—";
  if (key === "plants" && typeof v === "string" && v.trim().startsWith("[")) {
    try {
      const arr = JSON.parse(v);
      if (Array.isArray(arr) && arr.length) {
        return arr.map((p, i) => {
          const line = [p.unit_name, p.address_flat, p.address_premises, p.address_village, p.address_road, p.city, p.district, p.state, p.pincode].filter((x) => x && String(x).trim()).join(", ");
          return `#${i + 1}: ${line || "(empty)"}`;
        }).join("\n");
      }
    } catch {
    }
  }
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v)) return formatDateDMY(v);
  return String(v);
}
function groupFields(serviceCode) {
  if (!serviceCode) return [];
  const schema = getSchema(serviceCode);
  if (!schema) return [];
  const groups = [];
  let current = { label: "Details", fields: [] };
  for (const f of schema.fields) {
    if (f.type === "section") {
      if (current.fields.length) groups.push(current);
      current = { label: f.label, fields: [] };
    } else {
      current.fields.push({ key: f.key, label: f.label, type: f.type });
    }
  }
  if (current.fields.length) groups.push(current);
  return groups;
}
function LeadFormSubmissionInline({ leadId }) {
  const getFn = useServerFn(getFormSubmissionForLead);
  const urlFn = useServerFn(getDocumentSignedUrl);
  const { data, isLoading } = useQuery({
    queryKey: ["admin.leadFormSubmission", leadId],
    queryFn: () => getFn({ data: { leadId } }),
    staleTime: 6e4
  });
  const handleOpenDoc = async (id, mode = "preview") => {
    try {
      const { url } = await urlFn({ data: { id } });
      if (mode === "download") {
        const a = document.createElement("a");
        a.href = url;
        a.download = "";
        a.target = "_blank";
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        window.open(url, "_blank", "noopener");
      }
    } catch (e) {
      toast.error(e?.message ?? "Could not open document");
    }
  };
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 text-xs text-slate-500", children: "Loading form…" });
  if (!data) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 text-xs text-slate-500", children: "No data." });
  const { submission, documents, requiredDocs, serviceCode } = data;
  const sections = groupFields(serviceCode);
  const formData = submission?.form_data ?? {};
  const renderedKeys = new Set(sections.flatMap((s) => s.fields.map((f) => f.key)));
  const extras = Object.keys(formData).filter((k) => !renderedKeys.has(k));
  const uploadedByType = new Map(documents.map((d) => [d.doc_type, d]));
  const missingRequired = (requiredDocs ?? []).filter((r) => r.required && !uploadedByType.has(r.key));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t bg-slate-50/60", style: { borderColor: "var(--admin-border)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 flex items-center gap-2 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-3.5 text-slate-600" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-700", children: "Form Submission" }),
      submission ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full px-2 py-0.5 font-medium border " + (submission.status === "submitted" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"), children: submission.status }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-500", children: [
          "· ",
          fmtIST(submission.submitted_at ?? submission.updated_at)
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full px-2 py-0.5 font-medium border bg-slate-100 text-slate-600 border-slate-200", children: "not submitted" })
    ] }),
    submission ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y bg-white", children: [
      sections.map((section) => {
        const visible = section.fields.filter((f) => {
          const v = formData[f.key];
          return v !== void 0 && v !== null && String(v).trim() !== "";
        });
        if (!visible.length) return null;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2", children: section.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2", children: visible.map((f) => {
            if (f.type === "plants" || f.key === "plants") {
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-1 sm:col-span-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400 block mb-1", children: f.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(PlantsView, { value: formData[f.key] })
              ] }, f.key);
            }
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400", children: f.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-800 font-medium mt-0.5 break-words whitespace-pre-line", children: renderCell(f.key, formData[f.key]) })
            ] }, f.key);
          }) })
        ] }, section.label);
      }),
      extras.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2", children: "Other" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2", children: extras.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400", children: k.replace(/_/g, " ") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-800 font-medium mt-0.5 break-words whitespace-pre-line", children: renderCell(k, formData[k]) })
        ] }, k)) })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 text-xs text-amber-800 bg-amber-50 border-t border-amber-200", children: "Customer hasn't opened or filled the form yet." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-t bg-white", style: { borderColor: "var(--admin-border)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-slate-400", children: "Documents" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-slate-500", children: requiredDocs.length > 0 ? `${documents.length} of ${requiredDocs.length} expected` : `${documents.length} uploaded` })
      ] }),
      requiredDocs.length === 0 && documents.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500", children: "No documents." }),
      requiredDocs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: requiredDocs.map((req) => {
        const u = uploadedByType.get(req.key);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
            u ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3.5 text-emerald-600 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-3.5 text-red-400 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-700 truncate", children: req.label }),
            !req.required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400 shrink-0", children: "(optional)" })
          ] }),
          u ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 truncate max-w-[140px]", title: u.file_name, children: u.file_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleOpenDoc(u.id, "preview"), className: "text-slate-500 hover:text-slate-900", title: "Preview", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleOpenDoc(u.id, "download"), className: "text-slate-500 hover:text-slate-900", title: "Download", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-3.5" }) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400", children: "—" })
        ] }, req.key);
      }) }),
      documents.filter((d) => !requiredDocs.some((r) => r.key === d.doc_type)).map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3.5 text-emerald-600 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-700 truncate", children: d.doc_type.replace(/_/g, " ") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400 shrink-0", children: "(extra)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 truncate max-w-[140px]", title: d.file_name, children: d.file_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleOpenDoc(d.id, "preview"), className: "text-slate-500 hover:text-slate-900", title: "Preview", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-3.5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleOpenDoc(d.id, "download"), className: "text-slate-500 hover:text-slate-900", title: "Download", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-3.5" }) })
        ] })
      ] }, d.id)),
      missingRequired.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-start gap-1.5 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1.5 rounded", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-3.5 shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
            missingRequired.length,
            " missing:"
          ] }),
          " ",
          missingRequired.map((m) => m.label).join(", ")
        ] })
      ] })
    ] })
  ] });
}
const fmtINR = (n) => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
}).format(Number(n) || 0);
const fmtDT = (s) => s ? new Date(s).toLocaleString("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}) : "—";
const fmtD = (s) => s ? new Date(s).toLocaleDateString("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric"
}) : "—";
const TABS = [{
  key: "overview",
  label: "Overview",
  icon: User
}, {
  key: "orders",
  label: "Orders",
  icon: ShoppingBag
}, {
  key: "payments",
  label: "Payments",
  icon: IndianRupee
}, {
  key: "documents",
  label: "Documents",
  icon: FolderOpen
}, {
  key: "activity",
  label: "Activity",
  icon: Activity
}, {
  key: "complaints",
  label: "Complaints",
  icon: MessageSquareWarning
}, {
  key: "communication",
  label: "Communication",
  icon: Send
}];
function CustomerProfilePage() {
  const {
    customerId
  } = Route$V.useParams();
  const navigate = useNavigate();
  const fn = useServerFn(getCustomer360);
  const role = useRole();
  const hideMoney = role.hideMoney();
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ["admin.customer360", customerId],
    queryFn: () => fn({
      data: {
        customerId
      }
    })
  });
  const visibleTabs = reactExports.useMemo(() => TABS.filter((t) => !(hideMoney && t.key === "payments")), [hideMoney]);
  const [tab, setTab] = reactExports.useState("overview");
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => navigate({
        to: "/admin/customers"
      }), className: "text-sm hover:underline inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-3.5" }),
        " Back to customers"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-red-700", children: error.message })
    ] });
  }
  if (isLoading || !data) return /* @__PURE__ */ jsxRuntimeExports.jsx(TableSkeleton, { rows: 8, cols: 4 });
  const c = data.customer;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/customers", className: "text-sm inline-flex items-center gap-1 hover:underline", style: {
      color: "var(--admin-fg-muted)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-3.5" }),
      " All customers"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight truncate", children: c.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-md border px-2 py-0.5 text-[11px] font-mono", style: {
            borderColor: "var(--admin-border)"
          }, children: c.customer_code ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: c.status })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs", style: {
          color: "var(--admin-fg-muted)"
        }, children: [
          c.primary_email && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-3" }),
            " ",
            c.primary_email,
            /* @__PURE__ */ jsxRuntimeExports.jsx(CopyBtn, { value: c.primary_email })
          ] }),
          c.primary_mobile && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "size-3" }),
            " ",
            c.primary_mobile,
            /* @__PURE__ */ jsxRuntimeExports.jsx(CopyBtn, { value: c.primary_mobile })
          ] }),
          c.state && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-3" }),
            " ",
            c.state
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-3" }),
            " Since ",
            fmtD(c.first_seen_at)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CallButton, { mobile: c.primary_mobile, customerId: c.id }),
        c.primary_mobile && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `tel:${c.primary_mobile}`, className: "rounded-lg border px-3 py-1.5 text-xs inline-flex items-center gap-1.5 hover:bg-[var(--admin-surface-2)]", style: {
          borderColor: "var(--admin-border)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "size-3.5" }),
          " Call"
        ] }),
        c.primary_mobile && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `https://wa.me/${c.primary_mobile.replace(/\D/g, "")}`, target: "_blank", rel: "noreferrer", className: "rounded-lg border px-3 py-1.5 text-xs inline-flex items-center gap-1.5 hover:bg-[var(--admin-surface-2)]", style: {
          borderColor: "var(--admin-border)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "size-3.5" }),
          " WhatsApp"
        ] }),
        c.primary_email && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: `mailto:${c.primary_email}`, className: "rounded-lg border px-3 py-1.5 text-xs inline-flex items-center gap-1.5 hover:bg-[var(--admin-surface-2)]", style: {
          borderColor: "var(--admin-border)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-3.5" }),
          " Email"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
      !hideMoney && /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { index: 0, label: "Lifetime Value", value: fmtINR(Number(c.lifetime_value)), icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "size-4" }), gradient: "primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { index: 1, label: "Orders", value: c.total_applications, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-4" }), gradient: "primary", hint: `${c.completed_applications} completed · ${c.pending_applications} open` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { index: 2, label: "Certificates", value: data.certificates.length, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "size-4" }), gradient: "success" }),
      !hideMoney && /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { index: 3, label: "Invoices", value: data.invoices.length, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "size-4" }), gradient: "warn" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 border-b overflow-x-auto", style: {
      borderColor: "var(--admin-border)"
    }, children: visibleTabs.map((t) => {
      const Icon = t.icon;
      const active = t.key === tab;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTab(t.key), className: "flex items-center gap-1.5 text-sm px-4 py-2.5 border-b-2 -mb-px whitespace-nowrap", style: {
        borderColor: active ? "var(--admin-primary)" : "transparent",
        color: active ? "var(--admin-fg)" : "var(--admin-fg-muted)",
        fontWeight: active ? 600 : 400
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" }),
        " ",
        t.label
      ] }, t.key);
    }) }),
    tab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewTab, { data, customerId, hideMoney }),
    tab === "orders" && /* @__PURE__ */ jsxRuntimeExports.jsx(OrdersTab, { data, hideMoney }),
    tab === "complaints" && /* @__PURE__ */ jsxRuntimeExports.jsx(ComplaintsTab, { data }),
    tab === "payments" && !hideMoney && /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentsTab, { data }),
    tab === "documents" && /* @__PURE__ */ jsxRuntimeExports.jsx(DocumentsTab, { data }),
    tab === "activity" && /* @__PURE__ */ jsxRuntimeExports.jsx(ActivityTab, { data }),
    tab === "communication" && /* @__PURE__ */ jsxRuntimeExports.jsx(CommunicationTab, { data })
  ] });
}
function OverviewTab({
  data,
  customerId,
  hideMoney
}) {
  const qc = useQueryClient();
  const noteFn = useServerFn(addCustomerNote);
  const [noteDraft, setNoteDraft] = reactExports.useState("");
  const noteMut = useMutation({
    mutationFn: () => noteFn({
      data: {
        customerId,
        note: noteDraft
      }
    }),
    onSuccess: () => {
      setNoteDraft("");
      qc.invalidateQueries({
        queryKey: ["admin.customer360", customerId]
      });
      toast.success("Note saved");
    }
  });
  const timeline = reactExports.useMemo(() => {
    const items = [];
    data.applications.forEach((a) => items.push({
      id: `app-${a.id}`,
      time: a.created_at,
      type: "application",
      description: `Order ${a.application_code ?? a.id.slice(0, 8)} (${a.application_status})`
    }));
    if (!hideMoney) {
      data.payments.forEach((p) => items.push({
        id: `pay-${p.id}`,
        time: p.created_at,
        type: "payment",
        description: `Payment ${fmtINR(Number(p.amount))} · ${p.gateway_name} · ${p.status}`
      }));
    }
    data.complaints.forEach((c2) => items.push({
      id: `comp-${c2.id}`,
      time: c2.created_at,
      type: "complaint",
      description: `Complaint ${c2.complaint_number ?? ""} · ${c2.severity}`
    }));
    return items.sort((a, b) => +new Date(b.time) - +new Date(a.time)).slice(0, 30).map((i) => ({
      ...i,
      time: fmtDT(i.time)
    }));
  }, [data, hideMoney]);
  const c = data.customer;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "xl:col-span-2 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(EditableProfileCard, { customer: c, customerId }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: "Stats", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "grid grid-cols-2 md:grid-cols-5 gap-x-4 gap-y-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Total Orders", value: String(c.total_applications ?? 0) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Completed", value: String(c.completed_applications ?? 0) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Pending", value: String(c.pending_applications ?? 0) }),
        !hideMoney && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Lifetime Value", value: fmtINR(Number(c.lifetime_value ?? 0)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Last Order", value: fmtD(c.last_seen_at) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: `Submissions (${data.leads.length})`, action: data.leads.length > 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200", children: [
        "REPEAT CUSTOMER · ",
        data.leads.length,
        " forms"
      ] }) : void 0, children: data.leads.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { label: "No leads linked" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 p-3", children: data.leads.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(ExpandableLeadRow, { lead: l, hideMoney }, l.id)) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionCard, { title: "Internal notes", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: noteDraft, onChange: (e) => setNoteDraft(e.target.value), placeholder: "Add a private staff note…", rows: 3, className: "w-full rounded-lg border px-3 py-2 text-sm bg-transparent resize-none", style: {
          borderColor: "var(--admin-border)"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px]", style: {
            color: "var(--admin-fg-muted)"
          }, children: "Staff-only · audited" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: !noteDraft.trim() || noteMut.isPending, onClick: () => noteMut.mutate(), className: "rounded-lg px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50", style: {
            background: "var(--admin-primary)"
          }, children: noteMut.isPending ? "Saving…" : "Save note" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 pt-3", children: data.notes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { label: "No notes yet" }) : data.notes.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border px-3 py-2", style: {
          borderColor: "var(--admin-border)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[11px]", style: {
            color: "var(--admin-fg-muted)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(StickyNote, { className: "size-3" }),
            " ",
            fmtDT(n.created_at)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm whitespace-pre-wrap", children: n.note })
        ] }, n.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: "Recent activity", action: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "size-3.5 opacity-60" }), children: timeline.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { label: "No activity yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Timeline, { items: timeline }) })
    ] })
  ] });
}
function OrdersTab({
  data,
  hideMoney
}) {
  const leadById = /* @__PURE__ */ new Map();
  for (const l of data.leads ?? []) leadById.set(l.id, l);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: `Orders (${data.applications.length})`, children: data.applications.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { label: "No orders yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left text-xs uppercase tracking-wide", style: {
      color: "var(--admin-fg-muted)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 pr-3", children: "Order No" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 pr-3", children: "Service" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 pr-3", children: "Stage" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 pr-3", children: "Fulfillment" }),
      !hideMoney && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 pr-3 text-right", children: "Amount" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 pr-3", children: "Date" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 pr-3" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: data.applications.map((a) => {
      const lead = a.lead_id ? leadById.get(a.lead_id) : null;
      const stage = computeOrderStage({
        lead_status_v2: lead?.lead_status_v2,
        status: lead?.status,
        payment_successful_at: lead?.payment_successful_at
      }, {
        form_submitted_at: a.form_submitted_at,
        certificate_uploaded_at: a.certificate_uploaded_at,
        fulfillment_status: a.fulfillment_status,
        application_status: a.application_status,
        workflow_status: a.workflow_status
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t hover:bg-[var(--admin-surface-2)]", style: {
        borderColor: "var(--admin-border)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 pr-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/orders/$orderId", params: {
          orderId: a.id
        }, className: "font-mono text-xs hover:underline", children: a.application_code ?? a.id.slice(0, 8) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 pr-3 text-xs", children: lead?.service ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 pr-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${STAGE_BADGE_CLASS[stage]}`, children: STAGE_META[stage].label }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 pr-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: a.fulfillment_status ?? a.application_status }) }),
        !hideMoney && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 pr-3 text-right font-medium", children: fmtINR(Number(a.total_amount ?? lead?.total_amount ?? 0)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 pr-3 text-xs", style: {
          color: "var(--admin-fg-muted)"
        }, children: fmtD(a.created_at) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 pr-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/orders/$orderId", params: {
          orderId: a.id
        }, className: "inline-flex", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "size-3.5 opacity-60" }) }) })
      ] }, a.id);
    }) })
  ] }) }) });
}
function ComplaintsTab({
  data
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: `Complaints (${data.complaints.length})`, children: data.complaints.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { label: "No complaints raised" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: data.complaints.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin/complaints/$complaintId", params: {
    complaintId: c.id
  }, className: "flex items-center justify-between rounded-lg border px-3 py-2 hover:bg-[var(--admin-surface-2)]", style: {
    borderColor: "var(--admin-border)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-sm flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquareWarning, { className: "size-3.5" }),
        c.complaint_number ?? c.id.slice(0, 8)
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px]", style: {
        color: "var(--admin-fg-muted)"
      }, children: [
        c.category ?? "—",
        " · severity ",
        c.severity,
        " · ",
        fmtD(c.created_at)
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: c.status })
  ] }, c.id)) }) });
}
function PaymentsTab({
  data
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: `Payments (${data.payments.length})`, children: data.payments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { label: "No payments captured" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left text-xs uppercase tracking-wide", style: {
        color: "var(--admin-fg-muted)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 pr-3", children: "When" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 pr-3", children: "Gateway" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 pr-3", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 pr-3 text-right", children: "Amount" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: data.payments.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t", style: {
        borderColor: "var(--admin-border)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 pr-3 text-xs", children: fmtDT(p.payment_date ?? p.created_at) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 pr-3 text-xs capitalize", children: p.gateway_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 pr-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: p.status }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 pr-3 text-right font-medium", children: fmtINR(Number(p.amount)) })
      ] }, p.id)) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: `Invoices (${data.invoices.length})`, children: data.invoices.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { label: "No invoices yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left text-xs uppercase tracking-wide", style: {
        color: "var(--admin-fg-muted)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 pr-3", children: "Invoice" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 pr-3", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 pr-3 text-right", children: "Amount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 pr-3", children: "PDF" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: data.invoices.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t", style: {
        borderColor: "var(--admin-border)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 pr-3 font-mono text-xs", children: i.invoice_number ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 pr-3 text-xs", children: fmtD(i.issued_at) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 pr-3 text-right font-medium", children: fmtINR(Number(i.total_amount)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 pr-3 text-xs", style: {
          color: "var(--admin-fg-muted)"
        }, children: i.pdf_path ? "Generated" : "Pending" })
      ] }, i.id)) })
    ] }) }) })
  ] });
}
function DocumentsTab({
  data
}) {
  const deletedOrders = (data.applications ?? []).filter((a) => a.documents_deleted_at);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    deletedOrders.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border px-3 py-2 text-xs", style: {
      borderColor: "var(--admin-border)",
      background: "var(--admin-surface-2)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium mb-1", children: "Documents deleted (privacy policy)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-0.5", children: deletedOrders.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { style: {
        color: "var(--admin-fg-muted)"
      }, children: [
        "Order ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: a.application_code ?? a.id.slice(0, 8) }),
        " — documents deleted on ",
        fmtD(a.documents_deleted_at)
      ] }, a.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: `Documents (${data.documents.length})`, children: data.documents.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { label: "No documents uploaded" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left text-xs uppercase tracking-wide", style: {
        color: "var(--admin-fg-muted)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 pr-3", children: "Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 pr-3", children: "File" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 pr-3", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 pr-3", children: "Uploaded" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "py-2 pr-3", children: "Verified" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: data.documents.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t", style: {
        borderColor: "var(--admin-border)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 pr-3 text-xs font-medium uppercase", children: d.doc_type }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 pr-3 text-xs", children: d.file_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 pr-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: d.status }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 pr-3 text-xs", style: {
          color: "var(--admin-fg-muted)"
        }, children: fmtDT(d.uploaded_at) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 pr-3 text-xs", style: {
          color: "var(--admin-fg-muted)"
        }, children: fmtDT(d.verified_at) })
      ] }, d.id)) })
    ] }) }) })
  ] });
}
function CommunicationTab({
  data
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: `Emails (${data.emails.length})`, children: data.emails.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { label: "No emails sent" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: data.emails.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 rounded-lg border px-3 py-2", style: {
    borderColor: "var(--admin-border)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm truncate", children: e.subject }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px]", style: {
        color: "var(--admin-fg-muted)"
      }, children: [
        "to ",
        e.to_email,
        " · ",
        e.template_code ?? "ad-hoc",
        " · ",
        fmtDT(e.sent_at)
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: e.status })
  ] }, e.id)) }) });
}
function Field({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-[11px] uppercase tracking-wide", style: {
      color: "var(--admin-fg-muted)"
    }, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "mt-0.5 text-sm", children: value || "—" })
  ] });
}
function Empty({
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-sm text-center italic", style: {
    color: "var(--admin-fg-muted)"
  }, children: label });
}
function ExpandableLeadRow({
  lead: l,
  hideMoney
}) {
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border overflow-hidden", style: {
    borderColor: "var(--admin-border)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2 bg-[var(--admin-surface)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setOpen((v) => !v), className: "p-1 rounded hover:bg-[var(--admin-surface-2)] shrink-0", title: open ? "Collapse" : "Expand", "aria-label": "Toggle form details", children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen((v) => !v), className: "flex-1 min-w-0 text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm font-mono", children: l.lead_code ?? l.id.slice(0, 8) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px]", style: {
          color: "var(--admin-fg-muted)"
        }, children: [
          l.service,
          " · ",
          fmtD(l.created_at),
          !hideMoney && ` · ${fmtINR(Number(l.total_amount))}`
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: l.status }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/leads/$leadId", params: {
        leadId: l.id
      }, className: "p-1 rounded hover:bg-[var(--admin-surface-2)] shrink-0", title: "Open lead", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "size-3.5", style: {
        color: "var(--admin-fg-muted)"
      } }) })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx(LeadFormSubmissionInline, { leadId: l.id })
  ] });
}
function CopyBtn({
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
    navigator.clipboard.writeText(value);
    toast.success("Copied");
  }, className: "p-0.5 rounded hover:bg-[var(--admin-surface-2)]", title: "Copy", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "size-3", style: {
    color: "var(--admin-fg-muted)"
  } }) });
}
function ActivityTab({
  data
}) {
  const events = data.events ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: `Activity (${events.length})`, children: events.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { label: "No activity recorded" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-2", children: events.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded-lg border px-3 py-2", style: {
    borderColor: "var(--admin-border)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium capitalize", children: e.event_type.replace(/_/g, " ") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px]", style: {
        color: "var(--admin-fg-muted)"
      }, children: fmtDT(e.created_at) })
    ] }),
    (e.old_value || e.new_value) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs mt-1", style: {
      color: "var(--admin-fg-muted)"
    }, children: [
      e.old_value ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-through", children: e.old_value }),
        " → "
      ] }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", style: {
        color: "var(--admin-fg)"
      }, children: e.new_value ?? "—" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] mt-1", style: {
      color: "var(--admin-fg-muted)"
    }, children: [
      "by ",
      e.staff_name ?? "System",
      e.staff_role ? ` · ${e.staff_role}` : ""
    ] })
  ] }, e.id)) }) });
}
function EditableProfileCard({
  customer,
  customerId
}) {
  const qc = useQueryClient();
  const update = useServerFn(updateCustomer);
  const upload = useServerFn(uploadCustomerKyc);
  const sign = useServerFn(getCustomerKycSignedUrl);
  const save = async (patch) => {
    try {
      await update({
        data: {
          customerId,
          patch
        }
      });
      await qc.invalidateQueries({
        queryKey: ["admin.customer360", customerId]
      });
      toast.success("Saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    }
  };
  const openDoc = async (path) => {
    try {
      const {
        url
      } = await sign({
        data: {
          path
        }
      });
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not open document");
    }
  };
  const handleUpload = async (docType, file) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large (max 10 MB)");
      return;
    }
    const buf = await file.arrayBuffer();
    let bin = "";
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    const base64 = btoa(bin);
    try {
      await upload({
        data: {
          customerId,
          docType,
          fileName: file.name,
          contentType: file.type || "application/octet-stream",
          base64
        }
      });
      await qc.invalidateQueries({
        queryKey: ["admin.customer360", customerId]
      });
      toast.success(`${docType.toUpperCase()} document uploaded`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionCard, { title: "Profile", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(EditField, { label: "Full Name", value: customer.name ?? "", onSave: (v) => save({
        name: v
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(EditField, { label: "Mobile", value: customer.primary_mobile ?? "", onSave: (v) => save({
        primary_mobile: v || null
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(EditField, { label: "Email", type: "email", value: customer.primary_email ?? "", onSave: (v) => save({
        primary_email: v || null
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(EditField, { label: "State", value: customer.state ?? "", onSave: (v) => save({
        state: v || null
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(EditField, { label: "Address", textarea: true, value: customer.address ?? "", onSave: (v) => save({
        address: v || null
      }), className: "md:col-span-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KycField, { label: "PAN Number", number: customer.pan_number ?? "", docPath: customer.pan_doc_path, onSaveNumber: (v) => save({
        pan_number: v || null
      }), onUpload: (f) => handleUpload("pan", f), onOpen: openDoc }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KycField, { label: "Aadhaar Number", number: customer.aadhaar_number ?? "", docPath: customer.aadhaar_doc_path, onSaveNumber: (v) => save({
        aadhaar_number: v || null
      }), onUpload: (f) => handleUpload("aadhaar", f), onOpen: openDoc }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(EditField, { label: "Business Name", value: customer.business_name ?? "", onSave: (v) => save({
        business_name: v || null
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(EditField, { label: "GST Number", value: customer.gst_number ?? "", onSave: (v) => save({
        gst_number: v || null
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(EditField, { label: "Udyam Number", value: customer.udyam_number ?? "", onSave: (v) => save({
        udyam_number: v || null
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 pt-3 border-t", style: {
      borderColor: "var(--admin-border)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(EditField, { label: "Notes", textarea: true, value: customer.notes ?? "", onSave: (v) => save({
      notes: v || null
    }), placeholder: "Free-form notes about this customer…" }) })
  ] });
}
function EditField({
  label,
  value,
  onSave,
  type = "text",
  textarea = false,
  className = "",
  placeholder
}) {
  const [local, setLocal] = reactExports.useState(value);
  reactExports.useEffect(() => {
    setLocal(value);
  }, [value]);
  const commit = () => {
    const trimmed = local.trim();
    if (trimmed === (value ?? "").trim()) return;
    onSave(trimmed);
  };
  const inputClass = "w-full rounded-md border px-2 py-1.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)]/30";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `block ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-wide mb-1", style: {
      color: "var(--admin-fg-muted)"
    }, children: label }),
    textarea ? /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: local, onChange: (e) => setLocal(e.target.value), onBlur: commit, rows: 3, placeholder, className: `${inputClass} resize-none`, style: {
      borderColor: "var(--admin-border)"
    } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type, value: local, onChange: (e) => setLocal(e.target.value), onBlur: commit, placeholder, className: inputClass, style: {
      borderColor: "var(--admin-border)"
    } })
  ] });
}
function KycField({
  label,
  number,
  docPath,
  onSaveNumber,
  onUpload,
  onOpen
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(EditField, { label, value: number, onSave: onSaveNumber }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1.5", children: [
      docPath ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => onOpen(docPath), className: "text-[11px] inline-flex items-center gap-1 rounded border px-2 py-1 hover:bg-[var(--admin-surface-2)]", style: {
        borderColor: "var(--admin-border)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-3" }),
        " View document"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px]", style: {
        color: "var(--admin-fg-muted)"
      }, children: "No document uploaded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[11px] inline-flex items-center gap-1 rounded border px-2 py-1 cursor-pointer hover:bg-[var(--admin-surface-2)]", style: {
        borderColor: "var(--admin-border)"
      }, children: [
        docPath ? "Replace" : "Upload",
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*,application/pdf", className: "hidden", onChange: (e) => {
          const f = e.target.files?.[0];
          if (f) onUpload(f);
          e.target.value = "";
        } })
      ] })
    ] })
  ] });
}
export {
  CustomerProfilePage as component
};
