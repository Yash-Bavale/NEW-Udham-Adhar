import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  Copy,
  Mail,
  Eye,
  Download,
  Loader2,
  FileText,
  AlertTriangle,
} from "lucide-react";
import {
  getFormSubmissionForApplication,
  resendFormLink,
} from "@/lib/crm/submissions-admin.functions";
import { getDocumentSignedUrl } from "@/lib/onboarding/onboarding.functions";
import { getSchema } from "@/lib/onboarding/schemas";
import { Button } from "@/components/ui/button";

// Sensitive numbers (Aadhaar, bank account) are shown in full to staff —
// masking was removed per business decision so operations can verify values.
function mask(_field: string, value: unknown): string {
  const v = String(value ?? "");
  if (!v) return "—";
  return v;
}


function formatIST(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

type SectionGroup = { label: string; fields: { key: string; label: string }[] };

function groupFieldsBySection(serviceCode: string | null): SectionGroup[] {
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

export function FormSubmissionPanel({
  applicationId,
}: {
  applicationId: string;
}) {
  const getFn = useServerFn(getFormSubmissionForApplication);
  const resendFn = useServerFn(resendFormLink);
  const urlFn = useServerFn(getDocumentSignedUrl);
  const [resending, setResending] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin.formSubmission", applicationId],
    queryFn: () => getFn({ data: { applicationId } }),
  });

  const formLink = data?.lead?.lead_code
    ? `${(typeof window !== "undefined" && window.location?.origin) || "https://udyamadhar.in"}/onboarding/${data.lead.lead_code}`
    : "";

  const handleCopy = async () => {
    if (!formLink) return;
    await navigator.clipboard.writeText(formLink);
    toast.success("Form link copied");
  };

  const handleResend = async () => {
    if (!data?.lead?.id) return;
    setResending(true);
    try {
      const res = await resendFn({ data: { leadId: data.lead.id } });
      toast.success(`Form link sent to ${res.email}`);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to send");
    } finally {
      setResending(false);
    }
  };

  const handleOpenDoc = async (id: string, mode: "preview" | "download" = "preview") => {
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
    } catch (e: any) {
      toast.error(e?.message ?? "Could not open document");
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-white p-5 text-sm text-slate-500">
        Loading form submission…
      </div>
    );
  }
  if (!data) return null;

  const { submission, documents, requiredDocs, serviceCode, lead } = data as any;

  // Build a "submitted" status pill
  const statusPill = submission ? (
    <span
      className={
        "text-[11px] rounded-full px-2 py-0.5 font-medium border " +
        (submission.status === "submitted"
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-amber-50 text-amber-700 border-amber-200")
      }
    >
      {submission.status}
    </span>
  ) : (
    <span className="text-[11px] rounded-full px-2 py-0.5 font-medium border bg-slate-100 text-slate-600 border-slate-200">
      not submitted
    </span>
  );

  const sections = groupFieldsBySection(serviceCode);
  const formData: Record<string, any> = submission?.form_data ?? {};
  const renderedKeys = new Set(sections.flatMap((s) => s.fields.map((f) => f.key)));
  const extras = Object.keys(formData).filter((k) => !renderedKeys.has(k));

  // Documents matching
  const uploadedByType = new Map(documents.map((d: any) => [d.doc_type, d]));
  const matchedRequired = requiredDocs.length ? requiredDocs : [];
  const missingRequired = matchedRequired.filter(
    (r: any) => r.required && !uploadedByType.has(r.key),
  );

  return (
    <div className="rounded-lg border bg-white overflow-hidden" style={{ borderColor: "var(--admin-border, #e5e7eb)" }}>
      {/* Header */}
      <div className="px-5 py-3 border-b bg-slate-50 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <FileText className="size-4 text-slate-600 shrink-0" />
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-slate-800">Form Submission</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {submission ? (
                <>Submitted {formatIST(submission.submitted_at ?? submission.updated_at)}</>
              ) : (
                <>Customer hasn't submitted the service form yet.</>
              )}
            </p>
          </div>
          {statusPill}
        </div>
        <div className="flex items-center gap-2">
          {submission && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs"
              onClick={async () => {
                // "Copy All Details" — flat text dump of all submitted fields
                // grouped by section, easy to paste into WhatsApp/email.
                const lines: string[] = [];
                lines.push(`Lead: ${lead?.name ?? "—"} (${lead?.lead_code ?? "—"})`);
                if (lead?.mobile) lines.push(`Mobile: ${lead.mobile}`);
                if (lead?.email)  lines.push(`Email: ${lead.email}`);
                lines.push("");
                for (const section of sections) {
                  const visible = section.fields.filter((f) => {
                    const v = formData[f.key];
                    return v !== undefined && v !== null && String(v).trim() !== "";
                  });
                  if (!visible.length) continue;
                  lines.push(`— ${section.label} —`);
                  for (const f of visible) lines.push(`${f.label}: ${mask(f.key, formData[f.key])}`);
                  lines.push("");
                }
                if (extras.length) {
                  lines.push("— Other —");
                  for (const k of extras) lines.push(`${k.replace(/_/g, " ")}: ${mask(k, formData[k])}`);
                }
                try {
                  await navigator.clipboard.writeText(lines.join("\n").trim());
                  toast.success("All details copied to clipboard");
                } catch {
                  toast.error("Clipboard blocked by browser");
                }
              }}
            >
              <Copy className="size-3.5 mr-1.5" /> Copy All Details
            </Button>
          )}
          {formLink && (
            <Button size="sm" variant="outline" onClick={handleCopy} className="h-8 text-xs">
              <Copy className="size-3.5 mr-1.5" /> Copy link
            </Button>
          )}
          {lead?.id && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleResend}
              disabled={resending}
              className="h-8 text-xs"
            >
              {resending ? (
                <Loader2 className="size-3.5 mr-1.5 animate-spin" />
              ) : (
                <Mail className="size-3.5 mr-1.5" />
              )}
              Resend form link
            </Button>
          )}
        </div>
      </div>

      {/* Body */}
      {!submission ? (
        <div className="p-5">
          <div className="rounded-md bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
            The customer has not opened or filled the onboarding form yet. Use
            <b className="mx-1">Resend form link</b> or share the copy-link with them on WhatsApp.
          </div>
        </div>
      ) : (
        <>
          <div className="divide-y">
            {sections.map((section) => {
              if (!section.fields.length) return null;
              return (
                <div key={section.label} className="px-5 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
                    {section.label}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                    {section.fields.map((f) => (
                      <div key={f.key} className="flex flex-col min-w-0">
                        <span className="text-[11px] text-slate-400">{f.label}</span>
                        <span className="text-sm text-slate-800 font-medium mt-0.5 break-words">
                          {mask(f.key, formData[f.key])}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}


            {extras.length > 0 && (
              <div className="px-5 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
                  Other fields
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  {extras.map((k) => (
                    <div key={k} className="flex flex-col min-w-0">
                      <span className="text-[11px] text-slate-400">
                        {k.replace(/_/g, " ")}
                      </span>
                      <span className="text-sm text-slate-800 font-medium mt-0.5 break-words">
                        {mask(k, formData[k])}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Documents */}
      <div className="px-5 py-4 border-t bg-white">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Documents Uploaded
          </p>
          <span className="text-xs text-slate-500">
            {matchedRequired.length > 0
              ? `${documents.length} of ${matchedRequired.length} expected`
              : `${documents.length} uploaded`}
          </span>
        </div>

        {matchedRequired.length === 0 && documents.length === 0 && (
          <div className="text-sm text-slate-500">No documents required or uploaded.</div>
        )}

        {matchedRequired.length > 0 && (
          <ul className="space-y-1.5">
            {matchedRequired.map((req: any) => {
              const u = uploadedByType.get(req.key) as any;
              return (
                <li
                  key={req.key}
                  className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 gap-3"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {u ? (
                      <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="size-4 text-red-400 shrink-0" />
                    )}
                    <span className="text-sm text-slate-700 truncate">{req.label}</span>
                    {!req.required && (
                      <span className="text-[10px] text-slate-400 shrink-0">(optional)</span>
                    )}
                  </div>
                  {u ? (
                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className="text-[11px] text-slate-500 truncate max-w-[160px]"
                        title={u.file_name}
                      >
                        {u.file_name}
                      </span>
                      <button
                        onClick={() => handleOpenDoc(u.id, "preview")}
                        className="text-slate-500 hover:text-slate-900"
                        title="Preview"
                      >
                        <Eye className="size-4" />
                      </button>
                      <button
                        onClick={() => handleOpenDoc(u.id, "download")}
                        className="text-slate-500 hover:text-slate-900"
                        title="Download"
                      >
                        <Download className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400">—</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {/* Show any uploaded docs that aren't in the required list */}
        {documents
          .filter((d: any) => !matchedRequired.some((r: any) => r.key === d.doc_type))
          .map((d: any) => (
            <div
              key={d.id}
              className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 gap-3"
            >
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span className="text-sm text-slate-700 truncate">
                  {d.doc_type.replace(/_/g, " ")}
                </span>
                <span className="text-[10px] text-slate-400 shrink-0">(extra)</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span
                  className="text-[11px] text-slate-500 truncate max-w-[160px]"
                  title={d.file_name}
                >
                  {d.file_name}
                </span>
                <button
                  onClick={() => handleOpenDoc(d.id, "preview")}
                  className="text-slate-500 hover:text-slate-900"
                  title="Preview"
                >
                  <Eye className="size-4" />
                </button>
                <button
                  onClick={() => handleOpenDoc(d.id, "download")}
                  className="text-slate-500 hover:text-slate-900"
                  title="Download"
                >
                  <Download className="size-4" />
                </button>
              </div>
            </div>
          ))}

        {missingRequired.length > 0 && (
          <div className="mt-3 flex items-start gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-2 rounded">
            <AlertTriangle className="size-4 shrink-0 mt-0.5" />
            <div>
              <b>{missingRequired.length} required document(s) still missing:</b>{" "}
              {missingRequired.map((m: any) => m.label).join(", ")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
