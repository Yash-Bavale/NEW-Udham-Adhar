import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { C as CustomerRefGate, u as useCustomerLeadCode } from "./CustomerRefGate-B4GXNjz6.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { j as useServerFn, au as readAccessToken } from "./router-QgJicixe.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as getOnboarding, b as requestDocumentUpload, c as confirmDocumentUpload } from "./onboarding.functions-DdT_CVNt.mjs";
import { u as useOnboardingAccess } from "./useOnboardingAccess-zWvfHOOA.mjs";
import { S as SecureLinkNotice } from "./SecureLinkNotice-SV_fcG-2.mjs";
import { O as OnboardingShell } from "./OnboardingShell-CB9pLMMA.mjs";
import { m as motion } from "../_libs/motion.mjs";
import { ALLOWED_DOC_MIME, MAX_DOC_SIZE_BYTES } from "./schemas-DClqju6h.mjs";
import "../_libs/seroval.mjs";
import "./index.mjs";
import { L as LoaderCircle, aO as Image, Q as FileText, aA as Upload, D as Download, l as CircleCheck, aI as CircleX, C as Clock } from "../_libs/lucide-react.mjs";
import { A as AnimatePresence } from "../_libs/framer-motion.mjs";
import "./customer-access.functions-N17nWKMW.mjs";
import "./createSsrRpc-BO-AEXHh.mjs";
import "./server-BFjd5iLF.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
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
import "../_libs/zod.mjs";
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
import "../_libs/date-fns.mjs";
import "../_libs/react-day-picker.mjs";
import "../_libs/date-fns__tz.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function DocumentUploader({
  leadCode,
  docs,
  existing,
  onChanged
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    docs.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No documents required for this service." }),
    docs.map((d) => {
      const existingDoc = existing.find((e) => e.doc_type === d.key);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(DocRow, { leadCode, def: d, existing: existingDoc, onChanged }, d.key);
    })
  ] });
}
function DocRow({
  leadCode,
  def,
  existing,
  onChanged
}) {
  const reqUpload = useServerFn(requestDocumentUpload);
  const confirm = useServerFn(confirmDocumentUpload);
  const [busy, setBusy] = reactExports.useState(false);
  const [progress, setProgress] = reactExports.useState(0);
  const [err, setErr] = reactExports.useState(null);
  const [dragOver, setDragOver] = reactExports.useState(false);
  const [localPreview, setLocalPreview] = reactExports.useState(null);
  const inputRef = reactExports.useRef(null);
  reactExports.useEffect(() => () => {
    if (localPreview) URL.revokeObjectURL(localPreview);
  }, [localPreview]);
  async function handleFile(file) {
    setErr(null);
    if (!ALLOWED_DOC_MIME.includes(file.type)) {
      setErr("Unsupported type. Use PDF, JPG, PNG or WEBP.");
      return;
    }
    if (file.size > MAX_DOC_SIZE_BYTES) {
      setErr(`Too large. Max ${Math.round(MAX_DOC_SIZE_BYTES / 1024 / 1024)} MB.`);
      return;
    }
    if (file.type.startsWith("image/")) {
      if (localPreview) URL.revokeObjectURL(localPreview);
      setLocalPreview(URL.createObjectURL(file));
    }
    setBusy(true);
    setProgress(0);
    try {
      const { path, signedUrl } = await reqUpload({
        data: {
          leadCode,
          accessToken: readAccessToken(leadCode, "ob") ?? "",
          docType: def.key,
          fileName: file.name,
          mimeType: file.type,
          sizeBytes: file.size
        }
      });
      await uploadWithProgress(signedUrl, file, (p) => setProgress(p));
      await confirm({
        data: {
          leadCode,
          accessToken: readAccessToken(leadCode, "ob") ?? "",
          docType: def.key,
          filePath: path,
          fileName: file.name,
          mimeType: file.type,
          sizeBytes: file.size
        }
      });
      setProgress(100);
      await onChanged();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed.");
      setLocalPreview(null);
    } finally {
      setBusy(false);
      setTimeout(() => setProgress(0), 600);
    }
  }
  const status = existing?.status;
  const StatusBadge = status === "verified" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3" }),
    " Verified"
  ] }) : status === "rejected" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-full px-2 py-0.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3 h-3" }),
    " Rejected"
  ] }) : status === "pending" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
    " Awaiting review"
  ] }) : null;
  const isImage = (existing?.mime_type ?? "").startsWith("image/") || localPreview != null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 6 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.25 },
      onDragOver: (e) => {
        e.preventDefault();
        if (!busy) setDragOver(true);
      },
      onDragLeave: () => setDragOver(false),
      onDrop: (e) => {
        e.preventDefault();
        setDragOver(false);
        if (busy) return;
        const f = e.dataTransfer.files?.[0];
        if (f) void handleFile(f);
      },
      className: "rounded-xl border bg-card p-4 flex flex-col gap-2 transition-all " + (dragOver ? "border-brand-navy bg-brand-navy/5 ring-2 ring-brand-navy/15" : "border-border"),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0", children: localPreview ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: localPreview, alt: "", className: "w-full h-full object-cover" }) : isImage ? /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "w-4 h-4 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-semibold text-foreground truncate", children: [
                def.label,
                def.required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: " *" })
              ] }),
              existing && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: existing.file_name })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            StatusBadge,
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => inputRef.current?.click(),
                disabled: busy,
                className: "inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium rounded-full border border-border bg-background hover:bg-muted px-3 py-1.5 transition-colors disabled:opacity-60",
                children: [
                  busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-3.5 h-3.5" }),
                  existing ? "Replace" : "Upload"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: inputRef,
                type: "file",
                hidden: true,
                accept: ALLOWED_DOC_MIME.join(","),
                disabled: busy,
                onChange: (e) => {
                  const f = e.target.files?.[0];
                  if (f) void handleFile(f);
                  e.target.value = "";
                }
              }
            )
          ] })
        ] }),
        !existing && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Drop file here or click ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Upload" }),
          ". PDF / JPG / PNG / WEBP, max ",
          Math.round(MAX_DOC_SIZE_BYTES / 1024 / 1024),
          " MB."
        ] }),
        def.help && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: def.help }),
        def.sample_url && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: def.sample_url,
            target: "_blank",
            rel: "noreferrer",
            className: "inline-flex items-center gap-1.5 text-xs font-semibold text-brand-navy hover:underline w-fit",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5" }),
              def.sample_label || "Download template"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: busy && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, height: 0 },
            animate: { opacity: 1, height: "auto" },
            exit: { opacity: 0, height: 0 },
            className: "overflow-hidden",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 rounded-full bg-muted overflow-hidden mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                animate: { width: `${progress}%` },
                transition: { duration: 0.15 },
                className: "h-full bg-brand-navy"
              }
            ) })
          }
        ) }),
        existing?.remarks && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1", children: [
          "Reviewer note: ",
          existing.remarks
        ] }),
        err && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: err })
      ]
    }
  );
}
function uploadWithProgress(url, file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.setRequestHeader("x-upsert", "true");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round(e.loaded / e.total * 100));
    };
    xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status}). Please retry.`));
    xhr.onerror = () => reject(new Error("Network error during upload. Please retry."));
    xhr.send(file);
  });
}
function DocsPage() {
  const leadCode = useCustomerLeadCode();
  const navigate = useNavigate();
  const fetchFn = useServerFn(getOnboarding);
  const accessToken = useOnboardingAccess(leadCode);
  const {
    data,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ["onboarding", leadCode, accessToken],
    queryFn: () => fetchFn({
      data: {
        leadCode,
        accessToken
      }
    }),
    enabled: !!accessToken,
    retry: false
  });
  const hasNoDocuments = data ? (data.schema.documents?.length ?? 0) === 0 : false;
  reactExports.useEffect(() => {
    if (!hasNoDocuments) return;
    navigate({
      to: "/onboarding/$leadCode/done",
      params: {
        leadCode
      },
      replace: true
    });
  }, [hasNoDocuments, leadCode, navigate]);
  if (accessToken === null || isError) return /* @__PURE__ */ jsxRuntimeExports.jsx(SecureLinkNotice, { leadCode });
  if (accessToken === void 0 || isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-3xl px-4 py-20 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-6 h-6 animate-spin mx-auto text-muted-foreground" }) });
  }
  if (!data) return null;
  if (hasNoDocuments) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-3xl px-4 py-20 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-6 h-6 animate-spin mx-auto text-muted-foreground" }) });
  }
  const requiredDocs = data.schema.documents.filter((d) => d.required);
  const allRequiredUploaded = requiredDocs.every((d) => data.documents.some((u) => u.doc_type === d.key));
  const instructions = data.schema.documentsInstructions;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(OnboardingShell, { leadCode, step: 2, totalSteps: 3, title: "Upload supporting documents", subtitle: "Clear photos or scans only. Max 5 MB each. PDF, JPG, PNG or WEBP.", children: [
    instructions && (instructions.lines.length > 0 || instructions.downloadUrl) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 rounded-xl border-2 border-red-300 bg-red-50 p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-red-700 uppercase tracking-wide", children: "Please read carefully" }),
      instructions.lines.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-disc pl-5 space-y-1 text-sm text-red-700 font-medium", children: instructions.lines.map((line, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: line }, i)) }),
      instructions.downloadUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: instructions.downloadUrl, download: true, className: "inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 text-sm transition-colors", children: [
        "⬇ ",
        instructions.downloadLabel ?? "Download Standard Form"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DocumentUploader, { leadCode, docs: data.schema.documents, existing: data.documents, onChanged: async () => {
      await refetch();
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col-reverse sm:flex-row gap-3 justify-between items-stretch sm:items-center pt-6 mt-6 border-t border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/onboarding/$leadCode", params: {
        leadCode
      }, className: "text-sm text-brand-navy hover:underline text-center sm:text-left", children: "← Edit details" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: !allRequiredUploaded && requiredDocs.length > 0, onClick: () => {
        toast.success("Documents step completed");
        navigate({
          to: "/onboarding/$leadCode/done",
          params: {
            leadCode
          },
          replace: true
        });
      }, className: "rounded-full bg-brand-navy hover:bg-brand-navy-deep text-white font-semibold px-8 py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed", children: requiredDocs.length === 0 || allRequiredUploaded ? "Continue" : "Upload required documents to continue" })
    ] })
  ] });
}
function DocsPageGated() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CustomerRefGate, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DocsPage, {}) });
}
export {
  DocsPageGated as component
};
