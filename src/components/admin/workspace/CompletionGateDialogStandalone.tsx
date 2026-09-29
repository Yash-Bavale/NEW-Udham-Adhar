import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Upload, AlertTriangle, FileCheck2, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";

import {
  requestOrderDocumentUpload, confirmOrderDocumentUpload, getOrderDetailV2,
} from "@/lib/crm/orders-v2.functions";

export function CompletionGateDialogStandalone({
  open, onOpenChange, orderId, busy, onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  orderId: string;
  busy: boolean;
  onConfirm: (payload: {
    certificateDocumentId: string;
    certificateNumber: string;
    completionNotes?: string;
  }) => void;
}) {
  const requestFn = useServerFn(requestOrderDocumentUpload);
  const confirmFn = useServerFn(confirmOrderDocumentUpload);
  const detailFn = useServerFn(getOrderDetailV2);

  const [file, setFile] = useState<File | null>(null);
  const [certNumber, setCertNumber] = useState("");
  const [completionNotes, setCompletionNotes] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const { data: detail } = useQuery({
    enabled: open,
    queryKey: ["admin.order.recipient", orderId],
    queryFn: () => detailFn({ data: { orderId } }),
    staleTime: 30_000,
  });
  const recipientEmail =
    ((detail as any)?.customer?.primary_email ?? "").trim() ||
    ((detail as any)?.lead?.email ?? "").trim() ||
    null;
  const serviceName =
    (detail as any)?.service?.service_name || (detail as any)?.lead?.service || "this service";

  useEffect(() => {
    if (!open) {
      setFile(null); setCertNumber(""); setCompletionNotes("");
      setUploading(false); setDragOver(false);
    }
  }, [open]);

  const MAX_BYTES = 10 * 1024 * 1024;
  const tooBig = file ? file.size > MAX_BYTES : false;
  const isEmpty = file ? file.size === 0 : false;

  const submit = async () => {
    if (!file) { toast.error("Upload the certificate file."); return; }
    if (file.size === 0) {
      toast.error("The selected file is empty (0 bytes). Please re-download or select a valid certificate file.");
      return;
    }
    if (tooBig) { toast.error("File exceeds 10 MB limit."); return; }
    if (!certNumber.trim()) { toast.error("Certificate / document number is required."); return; }
    if (!recipientEmail) { toast.error("Customer has no email on file."); return; }
    setUploading(true);
    try {
      const { path, token } = await requestFn({
        data: {
          orderId, docType: "certificate", fileName: file.name,
          mimeType: file.type || "application/octet-stream", sizeBytes: file.size,
        },
      });
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase.storage.from("documents").uploadToSignedUrl(path, token, file, {
        contentType: file.type || undefined, upsert: true,
      });
      if (error) throw error;
      const { documentId } = await confirmFn({
        data: {
          orderId, docType: "certificate", filePath: path, fileName: file.name,
          mimeType: file.type || "application/octet-stream", sizeBytes: file.size,
        },
      });
      onConfirm({
        certificateDocumentId: documentId,
        certificateNumber: certNumber.trim(),
        completionNotes: completionNotes.trim() || undefined,
      });
    } catch (e: any) {
      let msg = e?.message ?? "Upload failed";
      try {
        const parsed = JSON.parse(msg);
        if (Array.isArray(parsed) && parsed[0]) {
          if (parsed[0]?.path?.includes("sizeBytes")) {
            msg = "The selected file is empty (0 bytes). Please upload a valid certificate file.";
          } else if (parsed[0]?.message) {
            msg = parsed[0].message;
          }
        }
      } catch {}
      toast.error(msg);
    } finally { setUploading(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCheck2 className="size-4 text-emerald-600" /> Complete Service — {serviceName}
          </DialogTitle>
          <DialogDescription>
            Three quick steps. The order moves to <strong>Completed</strong> only after the certificate email is sent.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Step 1 — Upload Certificate</Label>
            <label
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) setFile(f); }}
              className={`block w-full cursor-pointer rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors ${
                dragOver ? "border-indigo-500 bg-indigo-50/50" : "border-slate-300 bg-slate-50 hover:bg-slate-100"
              }`}>
              <Upload className="size-5 mx-auto mb-1.5 text-slate-500" />
              <div className="text-sm text-slate-700">{file ? "Replace file" : "Drag & drop or click to upload"}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">PDF, JPG, PNG — max 10 MB</div>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*"
                className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </label>
            {file && (
              <div className={`text-xs ${tooBig || isEmpty ? "text-red-600 font-medium" : "text-slate-600"}`}>
                {file.name} · {(file.size / 1024).toFixed(0)} KB
                {tooBig ? " — exceeds 10 MB" : isEmpty ? " — empty file (0 KB), please choose a valid file" : ""}
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Step 2 — Certificate / Document Number <span className="text-red-500">*</span>
            </Label>
            <Input value={certNumber} onChange={(e) => setCertNumber(e.target.value)} placeholder="e.g. UDYAM-MH-28-0012345" autoComplete="off" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Step 3 — Completion Notes <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </Label>
            <Textarea value={completionNotes} onChange={(e) => setCompletionNotes(e.target.value)} rows={3}
              placeholder="Internal notes (included in customer email if filled)" />
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs flex gap-2">
            <Mail className="size-3.5 mt-0.5 text-slate-500 flex-shrink-0" />
            <div className="text-slate-700">
              <div className="font-medium">Certificate will be emailed to:</div>
              <div className="font-mono text-slate-900">{recipientEmail ?? "— no email on file —"}</div>
            </div>
          </div>
          <div className="rounded-md bg-amber-50 border border-amber-200 p-2.5 text-xs text-amber-900 flex gap-2">
            <AlertTriangle className="size-3.5 mt-0.5 flex-shrink-0" />
            <div>The order moves to <strong>COMPLETED</strong> after the certificate email is queued. All other customer documents for this order are then permanently deleted.</div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={uploading || busy}>Cancel</Button>
          <Button onClick={submit} disabled={uploading || busy || !file || tooBig || !certNumber.trim() || !recipientEmail}
            className="bg-indigo-600 hover:bg-indigo-700">
            {uploading || busy ? <><Loader2 className="size-3 animate-spin mr-1" /> Uploading…</> : <>Upload &amp; Send Certificate →</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
