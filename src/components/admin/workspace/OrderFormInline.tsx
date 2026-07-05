/**
 * Order Form Inline — always-on view of the customer's autosaved form data
 * plus their uploaded documents, mounted inside the workspace's Employee
 * Workflow tab. Mirrors the pattern used on the Lead page
 * (`LeadFormSubmissionInline`) so employees don't need to switch tabs to see
 * the answers they're processing.
 *
 * Uses the existing `getFormSubmissionForApplication` server fn — no new
 * backend surface.
 */
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, Download, Eye, FileText, XCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFormSubmissionForApplication } from "@/lib/crm/submissions-admin.functions";
import { getDocumentSignedUrl } from "@/lib/onboarding/onboarding.functions";
import { getSchema } from "@/lib/onboarding/schemas";
import type { StatusActionKey } from "@/lib/orders/order-actions-map";

function fmtIST(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

type SectionGroup = { label: string; fields: { key: string; label: string }[] };

function groupFields(serviceCode: string | null): SectionGroup[] {
  if (!serviceCode) return [];
  const schema = getSchema(serviceCode);
  if (!schema) return [];
  const groups: SectionGroup[] = [];
  let current: SectionGroup = { label: "Details", fields: [] };
  for (const f of schema.fields) {
    if (f.type === "section") {
      if (current.fields.length) groups.push(current);
      current = { label: f.label, fields: [] };
    } else {
      current.fields.push({ key: f.key, label: f.label });
    }
  }
  if (current.fields.length) groups.push(current);
  return groups;
}

export function OrderFormInline({
  applicationId,
  onAction,
}: {
  applicationId: string;
  onAction?: (key: StatusActionKey) => void;
}) {
  const getFn = useServerFn(getFormSubmissionForApplication);
  const urlFn = useServerFn(getDocumentSignedUrl);

  const { data, isLoading } = useQuery({
    queryKey: ["admin.formSubmission", applicationId],
    queryFn: () => getFn({ data: { applicationId } }),
    staleTime: 30_000,
  });

  const handleOpenDoc = async (id: string, mode: "preview" | "download") => {
    try {
      const { url } = await urlFn({ data: { id } });
      if (mode === "download") {
        const a = document.createElement("a");
        a.href = url; a.download = ""; a.target = "_blank"; a.rel = "noopener";
        document.body.appendChild(a); a.click(); a.remove();
      } else {
        window.open(url, "_blank", "noopener");
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Could not open document");
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
        Loading autosaved form…
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
        No form data yet.
      </div>
    );
  }

  const { submission, documents, requiredDocs, serviceCode } = data as any;
  const sections = groupFields(serviceCode);
  const formData: Record<string, any> = submission?.form_data ?? {};
  const renderedKeys = new Set(sections.flatMap((s) => s.fields.map((f) => f.key)));
  const extras = Object.keys(formData).filter((k) => !renderedKeys.has(k));

  const uploadedByType = new Map<string, any>((documents ?? []).map((d: any) => [d.doc_type, d]));
  const missingRequired = (requiredDocs ?? []).filter((r: any) => r.required && !uploadedByType.has(r.key));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
        <FileText className="size-4 text-indigo-600" />
        <h3 className="text-sm font-bold text-slate-800">Autosaved Form &amp; Documents</h3>
        {submission ? (
          <span
            className={
              "ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold border " +
              (submission.status === "submitted"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200")
            }
          >
            {submission.status} · {fmtIST(submission.submitted_at ?? submission.updated_at)}
          </span>
        ) : (
          <span className="ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold border bg-slate-100 text-slate-600 border-slate-200">
            not submitted
          </span>
        )}
      </div>

      {/* Empty state */}
      {!submission && (
        <div className="px-5 py-6 flex items-center justify-between gap-4 bg-amber-50/60">
          <div className="flex items-start gap-2 text-sm text-amber-900">
            <AlertTriangle className="size-4 mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold">Customer hasn't opened the form yet.</div>
              <div className="text-xs text-amber-800/80">Send them the info-request link to start collecting details.</div>
            </div>
          </div>
          {onAction && (
            <Button
              onClick={() => onAction("send_form_link")}
              className="bg-indigo-600 text-white hover:bg-indigo-700 shrink-0"
              size="sm"
            >
              <Send className="size-3.5 mr-1.5" /> Send Form Link
            </Button>
          )}
        </div>
      )}

      {/* Form data */}
      {submission && (
        <div className="divide-y divide-slate-100">
          {sections.map((section) => {
            const visible = section.fields.filter((f) => {
              const v = formData[f.key];
              return v !== undefined && v !== null && String(v).trim() !== "";
            });
            if (!visible.length) return null;
            return (
              <div key={section.label} className="px-5 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 mb-2">
                  {section.label}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2.5">
                  {visible.map((f) => (
                    <div key={f.key} className="flex flex-col min-w-0">
                      <span className="text-[10px] text-slate-500">{f.label}</span>
                      <span className="text-xs text-slate-800 font-semibold mt-0.5 break-words">
                        {String(formData[f.key] ?? "—")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {extras.length > 0 && (
            <div className="px-5 py-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Other</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2.5">
                {extras.map((k) => (
                  <div key={k} className="flex flex-col min-w-0">
                    <span className="text-[10px] text-slate-500">{k.replace(/_/g, " ")}</span>
                    <span className="text-xs text-slate-800 font-semibold mt-0.5 break-words">
                      {String(formData[k] ?? "—")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Documents */}
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/40">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Documents</p>
          <span className="text-[11px] text-slate-500">
            {(requiredDocs ?? []).length > 0
              ? `${(documents ?? []).length} of ${(requiredDocs ?? []).length} expected`
              : `${(documents ?? []).length} uploaded`}
          </span>
        </div>

        {(requiredDocs ?? []).length === 0 && (documents ?? []).length === 0 && (
          <div className="text-xs text-slate-500">No documents.</div>
        )}

        {(requiredDocs ?? []).length > 0 && (
          <ul className="space-y-1">
            {requiredDocs.map((req: any) => {
              const u = uploadedByType.get(req.key);
              return (
                <li key={req.key} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {u ? <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" /> : <XCircle className="size-3.5 text-rose-400 shrink-0" />}
                    <span className="text-xs text-slate-700 truncate">{req.label}</span>
                    {!req.required && <span className="text-[10px] text-slate-400 shrink-0">(optional)</span>}
                  </div>
                  {u ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-slate-500 truncate max-w-[160px]" title={u.file_name}>{u.file_name}</span>
                      <button onClick={() => handleOpenDoc(u.id, "preview")} className="text-slate-500 hover:text-indigo-600" title="Preview"><Eye className="size-3.5" /></button>
                      <button onClick={() => handleOpenDoc(u.id, "download")} className="text-slate-500 hover:text-indigo-600" title="Download"><Download className="size-3.5" /></button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400">—</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {(documents ?? [])
          .filter((d: any) => !(requiredDocs ?? []).some((r: any) => r.key === d.doc_type))
          .map((d: any) => (
            <div key={d.id} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                <span className="text-xs text-slate-700 truncate">{d.doc_type.replace(/_/g, " ")}</span>
                <span className="text-[10px] text-slate-400 shrink-0">(extra)</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-slate-500 truncate max-w-[160px]" title={d.file_name}>{d.file_name}</span>
                <button onClick={() => handleOpenDoc(d.id, "preview")} className="text-slate-500 hover:text-indigo-600" title="Preview"><Eye className="size-3.5" /></button>
                <button onClick={() => handleOpenDoc(d.id, "download")} className="text-slate-500 hover:text-indigo-600" title="Download"><Download className="size-3.5" /></button>
              </div>
            </div>
          ))}

        {missingRequired.length > 0 && (
          <div className="mt-2 flex items-start gap-1.5 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1.5 rounded">
            <AlertTriangle className="size-3.5 shrink-0 mt-0.5" />
            <div><b>{missingRequired.length} missing:</b> {missingRequired.map((m: any) => m.label).join(", ")}</div>
          </div>
        )}
      </div>
    </div>
  );
}
