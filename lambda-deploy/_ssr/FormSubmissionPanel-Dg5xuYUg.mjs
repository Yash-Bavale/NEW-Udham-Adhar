import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { _ as useRole, aE as usePermissions, j as useServerFn, a3 as useRealtimeTable, aJ as formatMobile55, H as Button, aH as requestOrderDocumentUpload, aI as confirmOrderDocumentUpload, P as Dialog, Q as DialogContent, U as DialogHeader, V as DialogTitle, as as DialogDescription, aD as Checkbox, X as DialogFooter } from "./router-QgJicixe.mjs";
import { m as mintCustomerLink } from "./customer-access.functions-N17nWKMW.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { C as CallButton } from "./CallButton-i-5I5V9S.mjs";
import { g as getDocumentSignedUrl } from "./onboarding.functions-DdT_CVNt.mjs";
import { m as mergeDocumentsInBrowser } from "./dispute-browser-pdf-B2D_9n6v.mjs";
import { a as getFormSubmissionForApplication, r as resendFormLink } from "./submissions-admin.functions-bHLflT8I.mjs";
import { getSchema, isFieldVisible } from "./schemas-DClqju6h.mjs";
import { promoteNicActivities, parseNicActivities } from "./nic-fill-ia8FfFhd.mjs";
import { f as formatIST, a as formatDateDMY } from "./datetime-DvkGwlJs.mjs";
import { E as Check, aB as Copy, L as LoaderCircle, a as Mail, au as ExternalLink, Q as FileText, ax as TriangleAlert, bB as StickyNote, a$ as Layers, l as CircleCheck, aI as CircleX, ad as Eye, D as Download, q as ArrowUp, p as ArrowDown } from "../_libs/lucide-react.mjs";
function rank(d) {
  const s = `${d.doc_type} ${d.label}`.toLowerCase();
  if (/sign|standard.?form|form/.test(s)) return 0;
  if (/aadha?ar/.test(s)) return 1;
  if (/\bpan\b|pan.?card|pan_/.test(s)) return 2;
  return 3;
}
function MergeDocumentsDialog({
  open,
  onOpenChange,
  applicationId,
  applicationCode,
  documents,
  onSaved
}) {
  const urlFn = useServerFn(getDocumentSignedUrl);
  const requestFn = useServerFn(requestOrderDocumentUpload);
  const confirmFn = useServerFn(confirmOrderDocumentUpload);
  const [items, setItems] = reactExports.useState([]);
  const [busy, setBusy] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!open) return;
    setResult(null);
    const sorted = [...documents].filter((d) => !/^merged/i.test(d.doc_type)).sort((a, b) => rank(a) - rank(b));
    setItems(sorted.map((d) => ({ ...d, selected: rank(d) < 3 || sorted.length <= 3 })));
  }, [open, documents]);
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
  };
  const merge = async () => {
    const chosen = items.filter((d) => d.selected);
    if (chosen.length === 0) {
      toast.error("Select at least one document");
      return;
    }
    setBusy(true);
    try {
      const files = [];
      for (const d of chosen) {
        const { url } = await urlFn({ data: { id: d.id } });
        files.push({ url, mimeType: d.mime_type, label: d.label });
      }
      const bytes = await mergeDocumentsInBrowser(files);
      const code = String(applicationCode || applicationId.slice(0, 8)).replace(/[^a-zA-Z0-9_-]/g, "_");
      const fileName = `merged-documents-${code}.pdf`;
      const blob = new Blob([bytes], { type: "application/pdf" });
      const { path, token } = await requestFn({
        data: { orderId: applicationId, docType: "merged_documents", fileName, mimeType: "application/pdf", sizeBytes: blob.size }
      });
      const { supabase } = await import("./client-BX5UfqqR.mjs");
      const { error } = await supabase.storage.from("documents").uploadToSignedUrl(path, token, blob, { contentType: "application/pdf", upsert: true });
      if (error) throw error;
      await confirmFn({
        data: { orderId: applicationId, docType: "merged_documents", filePath: path, fileName, mimeType: "application/pdf", sizeBytes: blob.size }
      });
      setResult({ url: URL.createObjectURL(blob), name: fileName });
      toast.success("Merged PDF saved to the order");
      onSaved();
    } catch (e) {
      toast.error(e?.message ?? "Could not merge documents");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Merge PDF" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Tick the documents to include and arrange the order. Originals stay unchanged." })
    ] }),
    items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No customer documents uploaded yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-1.5", children: items.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2 rounded-md border px-2 py-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Checkbox,
        {
          checked: d.selected,
          onCheckedChange: (v) => setItems(items.map((x, k) => k === i ? { ...x, selected: !!v } : x))
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "w-5 text-xs text-muted-foreground", children: [
        i + 1,
        "."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: d.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground truncate", children: d.file_name })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "size-7", disabled: i === 0, onClick: () => move(i, -1), "aria-label": "Move up", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "size-3.5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "size-7", disabled: i === items.length - 1, onClick: () => move(i, 1), "aria-label": "Move down", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "size-3.5" }) })
    ] }, d.id)) }),
    result && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: result.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => window.open(result.url, "_blank", "noopener"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-3.5 mr-1" }),
          " View"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: result.url, download: result.name, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-3.5 mr-1" }),
          " Download"
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), disabled: busy, children: "Close" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: merge, disabled: busy || items.every((d) => !d.selected), children: busy ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 mr-1 animate-spin" }),
        " Merging…"
      ] }) : "Merge PDF" })
    ] })
  ] }) });
}
function parsePlantsData(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed;
        if (typeof parsed === "object" && parsed !== null) return [parsed];
      } catch {
      }
    }
  }
  return [];
}
function PlantsView({ value }) {
  const items = parsePlantsData(value);
  if (items.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 italic py-1", children: "No additional plant / unit address added (Main enterprise address used)" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 col-span-1 sm:col-span-2 w-full my-1", children: items.map((item, idx) => {
    const fields = [
      { label: "Unit / Plant Name", val: item.unit_name },
      { label: "Flat / Door / Block No.", val: item.address_flat },
      { label: "Name of Premises / Building", val: item.address_premises },
      { label: "Village / Town", val: item.address_village },
      { label: "Block", val: item.address_block },
      { label: "Road / Street / Lane", val: item.address_road },
      { label: "City", val: item.city },
      { label: "PIN Code", val: item.pincode },
      { label: "State", val: item.state },
      { label: "District", val: item.district }
    ].filter((f) => f.val && String(f.val).trim() !== "");
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3 shadow-xs",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-slate-200/80 pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-slate-800 uppercase tracking-wide", children: [
              "Plant / Unit #",
              idx + 1,
              item.unit_name ? ` — ${item.unit_name}` : ""
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full", children: "Unit Address" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 pt-1", children: fields.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-blue-600 font-medium", children: f.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-800 font-semibold mt-0.5 break-words", children: f.val })
          ] }, f.label)) })
        ]
      },
      idx
    );
  }) });
}
function mask(field, value) {
  if (value === null || value === void 0 || value === "") return "—";
  if (field === "plants" && typeof value === "string" && value.trim().startsWith("[")) {
    try {
      const arr = JSON.parse(value);
      if (Array.isArray(arr) && arr.length) {
        return arr.map((p, i) => {
          const line = [
            p.unit_name,
            p.address_flat,
            p.address_premises,
            p.address_village,
            p.address_road,
            p.city,
            p.district,
            p.state,
            p.pincode
          ].filter((x) => x && String(x).trim()).join(", ");
          return `#${i + 1}: ${line || "(empty)"}`;
        }).join("\n");
      }
    } catch {
    }
  }
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return formatDateDMY(value);
  }
  const v = String(value);
  return v || "—";
}
function groupFieldsBySection(serviceCode, activeSchema) {
  let fields = [];
  let sectionsFromSchema = [];
  if (activeSchema?.sections?.length) {
    sectionsFromSchema = activeSchema.sections;
  } else {
    const fallback = serviceCode ? getSchema(serviceCode) : null;
    if (fallback?.fields) fields = fallback.fields;
  }
  if (sectionsFromSchema.length) {
    return sectionsFromSchema.map((sec) => ({
      label: sec.label || "Details",
      fields: (sec.fields || []).map((f) => ({
        key: f.key,
        label: f.label,
        type: f.type,
        help: f.help,
        default: f.default,
        placeholder: f.placeholder
      }))
    }));
  }
  if (!fields.length) return [];
  const groups = [];
  let current = { label: "Details", fields: [] };
  for (const f of fields) {
    if (f.type === "section") {
      if (current.fields.length) groups.push(current);
      current = { label: f.label, fields: [] };
    } else {
      current.fields.push({
        key: f.key,
        label: f.label,
        type: f.type,
        help: f.help,
        default: f.default,
        placeholder: f.placeholder
      });
    }
  }
  if (current.fields.length) groups.push(current);
  return groups;
}
function FormSubmissionPanel({
  applicationId,
  isLocked = false,
  orderId
}) {
  const qc = useQueryClient();
  const role = useRole();
  const userPerms = usePermissions();
  const getFn = useServerFn(getFormSubmissionForApplication);
  const resendFn = useServerFn(resendFormLink);
  const urlFn = useServerFn(getDocumentSignedUrl);
  const [resending, setResending] = reactExports.useState(false);
  const [copiedLink, setCopiedLink] = reactExports.useState(false);
  const [mergeOpen, setMergeOpen] = reactExports.useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["admin.formSubmission", applicationId],
    queryFn: () => getFn({ data: { applicationId } })
  });
  const isSuperAdmin = Boolean(data?.isSuperAdmin) || Boolean(data?.isAdmin) || role.hasAny(["super_admin", "admin", "superadmin", "super"]) || Boolean(userPerms.perms?.isAdmin);
  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin.formSubmission", applicationId] });
  useRealtimeTable("onboarding_submissions", invalidate, {
    filter: `application_id=eq.${applicationId}`
  });
  useRealtimeTable("documents", invalidate, {
    filter: `application_id=eq.${applicationId}`
  });
  const handleCopyFormLink = async () => {
    const leadCode = data?.lead?.lead_code;
    if (!leadCode) {
      toast.error("Form link not available (missing lead code)");
      return;
    }
    let formLink;
    try {
      formLink = (await mintCustomerLink({ data: { leadCode, kind: "form" } })).url;
    } catch {
      toast.error("Could not create a secure form link");
      return;
    }
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(formLink);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = formLink;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedLink(true);
      toast.success("Form link copied to clipboard");
      setTimeout(() => setCopiedLink(false), 2e3);
    } catch (e) {
      toast.error(e?.message ?? "Failed to copy form link");
    }
  };
  const handleResend = async () => {
    if (!data?.lead?.id) return;
    if (isLocked) {
      toast.error("Order is completed — form link is disabled.");
      return;
    }
    setResending(true);
    try {
      const res = await resendFn({ data: { leadId: data.lead.id } });
      toast.success(`Form link sent to ${res.email}`);
      qc.invalidateQueries({ queryKey: ["admin.formSubmission", applicationId] });
      if (orderId) qc.invalidateQueries({ queryKey: ["admin.order", orderId] });
    } catch (e) {
      toast.error(e?.message ?? "Failed to send");
    } finally {
      setResending(false);
    }
  };
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
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border bg-white p-5 text-sm text-slate-500", children: "Loading form submission…" });
  }
  if (!data) return null;
  const { submission, documents, requiredDocs, serviceCode, lead, service, activeSchema } = data;
  const mergeEnabled = !!activeSchema?.meta?.enable_document_merge;
  const serviceLabel = service?.service_name || lead?.service || serviceCode || "Service";
  const isDraft = !!submission && (submission.status !== "submitted" || !submission.submitted_at);
  const customFields = activeSchema?.sections?.length ? activeSchema.sections.flatMap((s) => s.fields ?? []) : [];
  const schemaFields = customFields.length ? customFields : serviceCode ? getSchema(serviceCode)?.fields ?? [] : [];
  const answerValues = submission?.form_data ?? {};
  const visibleKeys = new Set(
    schemaFields.filter((f) => isFieldVisible(f, schemaFields, answerValues)).map((f) => f.key)
  );
  const requiredFields = schemaFields.filter(
    (f) => f.required && f.type !== "section" && f.type !== "note" && visibleKeys.has(f.key)
  );
  const requiredKeys = new Set(requiredFields.map((f) => f.key));
  const isBlank = (v) => v === void 0 || v === null || typeof v === "string" && v.trim() === "";
  const missingRequiredFields = submission ? requiredFields.filter((f) => isBlank((submission.form_data ?? {})[f.key])) : requiredFields;
  const statusPill = submission ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "text-[11px] rounded-full px-2 py-0.5 font-medium border " + (isDraft ? "bg-amber-100 text-amber-800 border-amber-300" : "bg-emerald-50 text-emerald-700 border-emerald-200"),
      children: isDraft ? "DRAFT — not submitted" : "submitted"
    }
  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] rounded-full px-2 py-0.5 font-medium border bg-slate-100 text-slate-600 border-slate-200", children: "not submitted" });
  const sections = groupFieldsBySection(serviceCode, activeSchema);
  const formData = promoteNicActivities(submission?.form_data ?? {});
  const additionalNicActivities = parseNicActivities(typeof formData.nic_activities === "string" ? formData.nic_activities : "");
  const renderedKeys = new Set(sections.flatMap((s) => s.fields.map((f) => f.key)));
  const extras = Object.keys(formData).filter((k) => {
    if (renderedKeys.has(k) || k === "nic_activities") return false;
    if (k.startsWith("section_")) return false;
    const v = formData[k];
    if (v === void 0 || v === null) return false;
    if (typeof v === "string" && v.trim() === "") return false;
    return true;
  });
  const uploadedByType = new Map(documents.map((d) => [d.doc_type, d]));
  const matchedRequired = requiredDocs.length ? requiredDocs : [];
  const missingRequired = matchedRequired.filter(
    (r) => r.required && !uploadedByType.has(r.key)
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-white overflow-hidden", style: { borderColor: "var(--admin-border, #e5e7eb)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 border-b bg-gradient-to-r from-indigo-50/50 via-cyan-50/30 to-white flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap text-base md:text-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 font-medium", children: "Customer:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-900 font-bold", children: lead?.name ?? "—" }),
        lead?.mobile && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300 font-light mx-1", children: "•" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 font-medium", children: "Mobile:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-900 font-bold font-mono", children: formatMobile55(lead.mobile) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CallButton,
          {
            mobile: lead?.mobile ?? null,
            customerId: data?.application?.customer_id ?? null,
            leadId: lead?.id ?? null,
            applicationId,
            label: "Call Customer",
            compact: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        lead?.id && isSuperAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: handleCopyFormLink,
            className: "h-8 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50",
            title: "Copy customer onboarding form link",
            children: [
              copiedLink ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5 mr-1.5 text-emerald-600" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "size-3.5 mr-1.5" }),
              copiedLink ? "Copied Form Link" : "Copy Form Link"
            ]
          }
        ),
        lead?.id && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: handleResend,
            disabled: resending || isLocked,
            className: "h-8 text-xs font-medium",
            title: isLocked ? "Order is completed — form link is disabled" : void 0,
            children: [
              resending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 mr-1.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-3.5 mr-1.5" }),
              "Send form link on Email"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            disabled: !service?.govt_portal_url,
            className: "h-8 text-xs border-indigo-100 text-indigo-700 hover:bg-indigo-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed",
            title: service?.govt_portal_url ? "Open the government portal for this service" : "No government portal URL configured",
            onClick: () => {
              if (service?.govt_portal_url) {
                window.open(service.govt_portal_url, "_blank", "noopener,noreferrer");
              } else {
                toast.error("No government portal URL set for this service");
              }
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "size-3.5 mr-1.5" }),
              " Govt. Portal"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-3 border-b bg-slate-50 flex items-center justify-between gap-3 flex-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-4 text-slate-600 shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap text-base md:text-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 font-medium", children: "Service Name:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-900 font-bold break-words", children: serviceLabel }),
          lead?.state && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300 font-light mx-1", children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 font-medium", children: "State:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-900 font-bold", children: lead.state })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: submission ? isDraft ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Auto-saved draft at ",
          formatIST(submission.updated_at),
          " — customer has NOT pressed Submit."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Submitted ",
          formatIST(submission.submitted_at ?? submission.updated_at)
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Customer hasn't submitted the service form yet." }) })
      ] }),
      statusPill
    ] }) }),
    isLocked && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs text-slate-600", children: "This order is closed (completed or cancelled). The customer form link is disabled and won't be resent." }),
    !submission ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800", children: [
      "The customer has not opened or filled the onboarding form yet. Use",
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "mx-1", children: "Resend form link" }),
      " or share the copy-link with them on WhatsApp."
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      isDraft && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4 bg-amber-50 border-b border-amber-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-5 text-amber-600 shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-amber-900", children: "Customer started filling this form but did NOT submit it." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-800 mt-1", children: [
            "The values below are an auto-saved draft. Required fields validated only run on final submit, so this draft can be incomplete. Use ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Resend form link" }),
            " or WhatsApp them the copy-link to get them to complete the form."
          ] }),
          missingRequiredFields.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-xs text-amber-900", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
              missingRequiredFields.length,
              " required field",
              missingRequiredFields.length > 1 ? "s" : "",
              " still empty:"
            ] }),
            " ",
            missingRequiredFields.map((f) => f.label).join(", ")
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y", children: [
        sections.map((section) => {
          if (!section.fields.length) return null;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3", children: section.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3", children: section.fields.map((f) => {
              if (schemaFields.length && !visibleKeys.has(f.key) && schemaFields.some((x) => x.key === f.key)) return null;
              if (f.type === "note") {
                const noteText = (f.help || f.default || f.placeholder || f.label || "").trim();
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "col-span-1 sm:col-span-2 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50/90 via-amber-50/50 to-orange-50/30 p-4 space-y-2.5 shadow-sm my-1",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 flex-wrap", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-semibold text-xs text-amber-900 uppercase tracking-wide", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(StickyNote, { className: "size-4 text-amber-600 shrink-0" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: f.label || "Internal Staff Note" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-amber-800 font-semibold border border-amber-300 bg-amber-100/90 px-2 py-0.5 rounded-md", children: "Staff Note" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Button,
                          {
                            size: "sm",
                            variant: "outline",
                            className: "h-7 text-xs border-amber-300 bg-white hover:bg-amber-100 text-amber-900 font-medium shadow-none",
                            onClick: async () => {
                              try {
                                await navigator.clipboard.writeText(noteText);
                                toast.success("Note copied to clipboard");
                              } catch {
                                toast.error("Failed to copy note");
                              }
                            },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "size-3 mr-1.5" }),
                              " Copy Note"
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs md:text-sm text-slate-800 font-normal whitespace-pre-line leading-relaxed bg-white/90 p-3 rounded-lg border border-amber-200/80 font-mono", children: noteText || "No note content provided." })
                    ]
                  },
                  f.key
                );
              }
              const v = formData[f.key];
              const required = requiredKeys.has(f.key);
              const blank = isBlank(v);
              if (f.type === "plants" || f.key === "plants") {
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-1 sm:col-span-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-blue-600 select-none font-medium mb-1.5 block", children: f.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(PlantsView, { value: v })
                ] }, f.key);
              }
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-blue-600 select-none font-medium", children: [
                  f.label,
                  required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500 ml-0.5", children: "*" })
                ] }),
                required && blank ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-red-600 mt-0.5 inline-flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-3.5" }),
                  " Required — empty"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-800 font-medium mt-0.5 break-words whitespace-pre-line", children: mask(f.key, v) })
              ] }, f.key);
            }) })
          ] }, section.label);
        }),
        additionalNicActivities.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-t", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold uppercase text-slate-500 mb-3", children: "Additional NIC activities" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full min-w-[550px] text-sm text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "No." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "NIC 2 Digit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "NIC 4 Digit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "NIC 5 Digit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-2", children: "Activity Type" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: additionalNicActivities.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b last:border-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2", children: index + 2 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2", children: item.nic_2_digit }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2", children: item.nic_4_digit }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2", children: item.nic_5_digit }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2", children: item.activity_type })
            ] }, `${item.nic_5_digit}-${index}`)) })
          ] }) })
        ] }),
        extras.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3", children: "Other fields" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3", children: extras.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-blue-600 select-none font-medium", children: k.replace(/_/g, " ") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-800 font-medium mt-0.5 break-words", children: mask(k, formData[k]) })
          ] }, k)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-t bg-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold uppercase tracking-wider text-slate-400", children: "Documents Uploaded" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-500", children: matchedRequired.length > 0 ? `${documents.length} of ${matchedRequired.length} expected` : `${documents.length} uploaded` }),
          mergeEnabled && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "h-7 text-xs", onClick: () => setMergeOpen(true), disabled: documents.length === 0, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "size-3.5 mr-1" }),
            " Merge PDF"
          ] })
        ] })
      ] }),
      mergeEnabled && /* @__PURE__ */ jsxRuntimeExports.jsx(
        MergeDocumentsDialog,
        {
          open: mergeOpen,
          onOpenChange: setMergeOpen,
          applicationId,
          applicationCode: data?.application?.application_code ?? null,
          documents: documents.map((d) => ({
            id: d.id,
            doc_type: d.doc_type,
            file_name: d.file_name,
            mime_type: d.mime_type,
            label: matchedRequired.find((r) => r.key === d.doc_type)?.label ?? String(d.doc_type).replace(/_/g, " ")
          })),
          onSaved: () => {
            qc.invalidateQueries({ queryKey: ["admin.formSubmission", applicationId] });
            if (orderId) qc.invalidateQueries({ queryKey: ["admin.order", orderId] });
          }
        }
      ),
      matchedRequired.length === 0 && documents.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-slate-500", children: "No documents required or uploaded." }),
      matchedRequired.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: matchedRequired.map((req) => {
        const u = uploadedByType.get(req.key);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "li",
          {
            className: "flex items-center justify-between py-2 border-b border-slate-100 last:border-0 gap-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                u ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4 text-emerald-600 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-4 text-red-400 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-700 truncate", children: req.label }),
                !req.required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400 shrink-0", children: "(optional)" })
              ] }),
              u ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[11px] text-slate-500 truncate max-w-[160px]",
                    title: u.file_name,
                    children: u.file_name
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => handleOpenDoc(u.id, "preview"),
                    className: "text-slate-500 hover:text-slate-900",
                    title: "Preview",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => handleOpenDoc(u.id, "download"),
                    className: "text-slate-500 hover:text-slate-900",
                    title: "Download",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4" })
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-slate-400", children: "—" })
            ]
          },
          req.key
        );
      }) }),
      documents.filter((d) => !matchedRequired.some((r) => r.key === d.doc_type)).map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between py-2 border-b border-slate-100 last:border-0 gap-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4 text-emerald-600 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-700 truncate", children: d.doc_type.replace(/_/g, " ") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400 shrink-0", children: "(extra)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-[11px] text-slate-500 truncate max-w-[160px]",
                  title: d.file_name,
                  children: d.file_name
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => handleOpenDoc(d.id, "preview"),
                  className: "text-slate-500 hover:text-slate-900",
                  title: "Preview",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-4" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => handleOpenDoc(d.id, "download"),
                  className: "text-slate-500 hover:text-slate-900",
                  title: "Download",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4" })
                }
              )
            ] })
          ]
        },
        d.id
      )),
      missingRequired.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-start gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-2 rounded", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-4 shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
            missingRequired.length,
            " required document(s) still missing:"
          ] }),
          " ",
          missingRequired.map((m) => m.label).join(", ")
        ] })
      ] })
    ] })
  ] }) });
}
export {
  FormSubmissionPanel as F,
  PlantsView as P
};
