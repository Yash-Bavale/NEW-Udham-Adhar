import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { j as useServerFn, aB as resendOrderCertificate, P as Dialog, aC as DialogTrigger, H as Button, Q as DialogContent, U as DialogHeader, V as DialogTitle, I as Input, X as DialogFooter, a1 as Badge } from "./router-QgJicixe.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-CjqxMl2c.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { ai as Award, aA as Upload, L as LoaderCircle, v as Search, ad as Eye, as as Send, R as RefreshCw } from "../_libs/lucide-react.mjs";
import { o as object, s as string, _ as _enum, l as literal } from "../_libs/zod.mjs";
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
const listCertificates = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator(object({
  delivered: _enum(["all", "yes", "no"]).default("all"),
  search: string().optional()
})).handler(createSsrRpc("26df7c1b1a423bf7c42658254ed6b651ee07d1de42e46c1e09b1218df0663944"));
const uploadCertificate = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator(object({
  applicationId: string().min(1),
  fileBase64: string(),
  fileName: string(),
  mimeType: string().default("application/pdf"),
  certificateNumber: string().optional()
})).handler(createSsrRpc("9352d2ec2b46ff7b350730511f0b0a82b0d8c6480019ebf5fb71c7f0afbaa949"));
const deliverCertificate = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator(object({
  certificateId: string().uuid(),
  ccEmail: string().trim().email("Invalid CC email address").optional().or(literal("")).nullable()
})).handler(createSsrRpc("8653215103488ed2133d5e7492fd1f25d23d87c6ef76b4daadce2b038c321bd8"));
const getCertificateUrl = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator(object({
  certificateId: string().uuid()
})).handler(createSsrRpc("5f79241810afb35f15333acf891852373067a4611a11ef85db1ad852c27d498b"));
function CertificatesPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listCertificates);
  const uploadFn = useServerFn(uploadCertificate);
  const deliverFn = useServerFn(deliverCertificate);
  const urlFn = useServerFn(getCertificateUrl);
  const resendFn = useServerFn(resendOrderCertificate);
  const [filter, setFilter] = reactExports.useState("all");
  const [search, setSearch] = reactExports.useState("");
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin.certificates", filter, search],
    queryFn: () => listFn({
      data: {
        delivered: filter,
        search: search || void 0
      }
    })
  });
  const [uploadOpen, setUploadOpen] = reactExports.useState(false);
  const [appId, setAppId] = reactExports.useState("");
  const [certNumber, setCertNumber] = reactExports.useState("");
  const [file, setFile] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(false);
  const handleUpload = async () => {
    if (!file || !appId) {
      toast.error("Application ID and file required");
      return;
    }
    setBusy(true);
    try {
      const arr = await file.arrayBuffer();
      const b64 = btoa(String.fromCharCode(...new Uint8Array(arr)));
      await uploadFn({
        data: {
          applicationId: appId,
          fileBase64: b64,
          fileName: file.name,
          mimeType: file.type || "application/pdf",
          certificateNumber: certNumber || void 0
        }
      });
      toast.success("Certificate uploaded");
      setUploadOpen(false);
      setFile(null);
      setAppId("");
      setCertNumber("");
      qc.invalidateQueries({
        queryKey: ["admin.certificates"]
      });
    } catch (e) {
      toast.error(e?.message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  };
  const handleDeliver = async (id) => {
    const ccInput = window.prompt("Optional: Enter CC email address (leave blank to send only to registered email):");
    if (ccInput === null) return;
    const ccEmail = ccInput.trim() || void 0;
    try {
      await deliverFn({
        data: {
          certificateId: id,
          ccEmail
        }
      });
      toast.success("Delivered & emailed");
      qc.invalidateQueries({
        queryKey: ["admin.certificates"]
      });
    } catch (e) {
      toast.error(e?.message ?? "Failed");
    }
  };
  const handlePreview = async (id) => {
    try {
      const {
        url
      } = await urlFn({
        data: {
          certificateId: id
        }
      });
      if (url) window.open(url, "_blank", "noopener");
    } catch (e) {
      toast.error(e?.message ?? "Failed");
    }
  };
  const handleResend = async (applicationId) => {
    if (!applicationId) {
      toast.error("This certificate is not linked to an order.");
      return;
    }
    const ccInput = window.prompt("Optional: Enter CC email address (leave blank to send only to registered email):");
    if (ccInput === null) return;
    const ccEmail = ccInput.trim() || void 0;
    try {
      const res = await resendFn({
        data: {
          orderId: applicationId,
          ccEmail
        }
      });
      toast.success(`Certificate resent to ${res.resentTo}`);
      qc.invalidateQueries({
        queryKey: ["admin.certificates"]
      });
    } catch (e) {
      toast.error(e?.message ?? "Resend failed");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "w-6 h-6" }),
          " Certificates"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 mt-1", children: "Upload Udyam certificates and deliver to customers." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: uploadOpen, onOpenChange: setUploadOpen, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
          " Upload Certificate"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Upload New Certificate" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium uppercase text-slate-500", children: "Application ID (UUID)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: appId, onChange: (e) => setAppId(e.target.value), placeholder: "Paste application UUID from list" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium uppercase text-slate-500", children: "Certificate Number (optional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: certNumber, onChange: (e) => setCertNumber(e.target.value), placeholder: "UDYAM-XX-00-0000000" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-medium uppercase text-slate-500", children: "PDF File" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "file", accept: "application/pdf,image/png,image/jpeg", onChange: (e) => setFile(e.target.files?.[0] || null) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setUploadOpen(false), disabled: busy, children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleUpload, disabled: busy, children: [
              busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }) : null,
              "Upload"
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "py-3 border-b bg-slate-50/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold", children: [
          "All Certificates (",
          data?.rows.length ?? 0,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search…", className: "pl-8 h-8 w-48" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: filter, onChange: (e) => setFilter(e.target.value), className: "h-8 rounded-md border px-2 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "no", children: "Pending Delivery" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "yes", children: "Delivered" })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin mx-auto" }) }) : data?.rows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-sm text-slate-400 italic", children: "No certificates yet. Upload your first one above." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 px-4", children: "Number" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left", children: "Customer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left", children: "Application" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left", children: "Issued" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-2 px-4", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y", children: data?.rows.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-slate-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-4 font-mono text-xs", children: c.certificate_number || "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: c.lead ? /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/leads/$leadId", params: {
            leadId: c.lead.id
          }, className: "hover:underline", children: c.lead.name }) : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-xs font-mono", children: c.application?.application_code || "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-xs text-slate-500", children: c.issued_at ? new Date(c.issued_at).toLocaleDateString("en-IN") : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: c.delivered_at ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-emerald-50 text-emerald-700 border-emerald-200", children: "Delivered" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-amber-600", children: "Pending" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-3 px-4 text-right space-x-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "h-7 text-xs", onClick: () => handlePreview(c.id), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3 h-3 mr-1" }),
              "View"
            ] }),
            !c.delivered_at && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "h-7 text-xs text-emerald-600", onClick: () => handleDeliver(c.id), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-3 h-3 mr-1" }),
              "Deliver"
            ] }),
            c.delivered_at && c.application_id && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "h-7 text-xs text-blue-600", onClick: () => handleResend(c.application_id), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3 mr-1" }),
              "Resend"
            ] })
          ] })
        ] }, c.id)) })
      ] }) })
    ] })
  ] });
}
export {
  CertificatesPage as component
};
