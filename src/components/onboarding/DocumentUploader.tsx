import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, FileText, Upload, XCircle, Loader2, Clock } from "lucide-react";
import { requestDocumentUpload, confirmDocumentUpload } from "@/lib/onboarding/onboarding.functions";
import { ALLOWED_DOC_MIME, MAX_DOC_SIZE_BYTES, type DocDef } from "@/lib/onboarding/schemas";

type ExistingDoc = {
  id: string;
  doc_type: string;
  file_name: string;
  status: string;
  remarks: string | null;
};

export function DocumentUploader({
  leadCode,
  docs,
  existing,
  onChanged,
}: {
  leadCode: string;
  docs: DocDef[];
  existing: ExistingDoc[];
  onChanged: () => void | Promise<void>;
}) {
  return (
    <div className="space-y-3">
      {docs.length === 0 && (
        <p className="text-sm text-muted-foreground">No documents required for this service.</p>
      )}
      {docs.map((d) => {
        const existingDoc = existing.find((e) => e.doc_type === d.key);
        return (
          <DocRow key={d.key} leadCode={leadCode} def={d} existing={existingDoc} onChanged={onChanged} />
        );
      })}
    </div>
  );
}

function DocRow({
  leadCode,
  def,
  existing,
  onChanged,
}: {
  leadCode: string;
  def: DocDef;
  existing?: ExistingDoc;
  onChanged: () => void | Promise<void>;
}) {
  const reqUpload = useServerFn(requestDocumentUpload);
  const confirm = useServerFn(confirmDocumentUpload);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleFile(file: File) {
    setErr(null);
    if (!ALLOWED_DOC_MIME.includes(file.type)) {
      setErr("Unsupported type. Use PDF, JPG, PNG or WEBP.");
      return;
    }
    if (file.size > MAX_DOC_SIZE_BYTES) {
      setErr(`Too large. Max ${Math.round(MAX_DOC_SIZE_BYTES / 1024 / 1024)} MB.`);
      return;
    }
    setBusy(true);
    try {
      const { path, signedUrl } = await reqUpload({
        data: {
          leadCode,
          docType: def.key,
          fileName: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
        },
      });
      const up = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type, "x-upsert": "true" },
        body: file,
      });
      if (!up.ok) throw new Error("Upload failed. Please retry.");
      await confirm({
        data: {
          leadCode,
          docType: def.key,
          filePath: path,
          fileName: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
        },
      });
      await onChanged();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  const status = existing?.status;
  const StatusBadge =
    status === "verified" ? (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
        <CheckCircle2 className="w-3 h-3" /> Verified
      </span>
    ) : status === "rejected" ? (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
        <XCircle className="w-3 h-3" /> Rejected
      </span>
    ) : status === "pending" ? (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
        <Clock className="w-3 h-3" /> Awaiting review
      </span>
    ) : null;

  return (
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-foreground truncate">
              {def.label}
              {def.required && <span className="text-destructive"> *</span>}
            </div>
            {existing && (
              <div className="text-xs text-muted-foreground truncate">{existing.file_name}</div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {StatusBadge}
          <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium rounded-full border border-border bg-background hover:bg-muted px-3 py-1.5 transition-colors">
            {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            {existing ? "Replace" : "Upload"}
            <input
              type="file"
              hidden
              accept={ALLOWED_DOC_MIME.join(",")}
              disabled={busy}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleFile(f);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </div>
      {def.help && <p className="text-xs text-muted-foreground">{def.help}</p>}
      {existing?.remarks && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
          Reviewer note: {existing.remarks}
        </p>
      )}
      {err && <p className="text-xs text-destructive">{err}</p>}
    </div>
  );
}
