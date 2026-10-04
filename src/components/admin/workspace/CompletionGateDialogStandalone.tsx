import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, UploadCloud, AlertTriangle, FileCheck2, Mail, Check, FileText, RefreshCw, Send, CircleCheck } from "lucide-react";

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
  }) => Promise<void>;
}) {
  const requestFn = useServerFn(requestOrderDocumentUpload);
  const confirmFn = useServerFn(confirmOrderDocumentUpload);
  const detailFn = useServerFn(getOrderDetailV2);

  const [file, setFile] = useState<File | null>(null);
  const [certNumber, setCertNumber] = useState("");
  const [completionNotes, setCompletionNotes] = useState("");
  const [stage, setStage] = useState<"idle" | "uploading" | "preparing" | "sending" | "success">("idle");
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [numberTouched, setNumberTouched] = useState(false);
  const [uploaded, setUploaded] = useState<{ file: File; documentId: string } | null>(null);
  const [sendingConfirmed, setSendingConfirmed] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    return () => { if (closeTimer.current) clearTimeout(closeTimer.current); };
  }, []);

  useEffect(() => {
    if (!open) {
      setFile(null); setCertNumber(""); setCompletionNotes("");
      setStage("idle"); setDragOver(false); setError(null);
      setNumberTouched(false); setUploaded(null); setSendingConfirmed(false);
    }
  }, [open]);

  const MAX_BYTES = 10 * 1024 * 1024;
  const tooBig = file ? file.size > MAX_BYTES : false;
  const isEmpty = file ? file.size === 0 : false;
  const invalidType = file ? !["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(file.type) : false;
  const working = stage === "uploading" || stage === "preparing" || stage === "sending";
  const locked = working || busy || stage === "success";
  const fileError = file && (isEmpty || tooBig || invalidType);
  const chooseFile = (next: File | null) => {
    if (locked) return;
    setFile(next); setUploaded(null); setError(null);
  };
  const formatSize = (bytes: number) => bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.ceil(bytes / 1024)} KB`;

  const submit = async () => {
    if (!file) { setError("Upload the certificate file."); return; }
    if (file.size === 0) {
      setError("The selected file is empty (0 bytes). Please choose a valid certificate file.");
      return;
    }
    if (tooBig || invalidType) { setError(tooBig ? "File exceeds 10 MB limit." : "Choose a PDF, JPG, PNG or WEBP file."); return; }
    if (!certNumber.trim()) { setNumberTouched(true); setError("Certificate / document number is required."); return; }
    if (!recipientEmail) { setError("Customer has no email on file."); return; }
    setError(null);
    try {
      let documentId = uploaded?.file === file ? uploaded.documentId : null;
      if (!documentId) {
        setStage("uploading");
        const { path, token } = await requestFn({
          data: {
            orderId, docType: "certificate", fileName: file.name,
            mimeType: file.type || "application/octet-stream", sizeBytes: file.size,
          },
        });
        const { supabase } = await import("@/integrations/supabase/client");
        const { error: uploadError } = await supabase.storage.from("documents").uploadToSignedUrl(path, token, file, {
          contentType: file.type || undefined, upsert: true,
        });
        if (uploadError) throw uploadError;
        setStage("preparing");
        const confirmed = await confirmFn({
          data: {
            orderId, docType: "certificate", filePath: path, fileName: file.name,
            mimeType: file.type || "application/octet-stream", sizeBytes: file.size,
          },
        });
        documentId = confirmed.documentId;
        setUploaded({ file, documentId });
      }
      setStage("sending");
      await onConfirm({
        certificateDocumentId: documentId,
        certificateNumber: certNumber.trim(),
        completionNotes: completionNotes.trim() || undefined,
      });
      setSendingConfirmed(true);
      setStage("success");
      closeTimer.current = setTimeout(() => onOpenChange(false), 1800);
    } catch (e: any) {
      let msg = e?.message ?? "Could not send the certificate. Please retry.";
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
      setError(msg);
      toast.error(msg);
      setStage("idle");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next && locked) return; onOpenChange(next); }}>
      <DialogContent onEscapeKeyDown={(e) => { if (locked) e.preventDefault(); }} onPointerDownOutside={(e) => { if (locked) e.preventDefault(); }} className={`w-[calc(100vw-2rem)] max-w-[560px] gap-0 border-admin-border bg-admin-surface p-0 text-admin-fg shadow-xl sm:rounded-lg [&>button]:text-admin-fg-muted ${locked ? "[&>button]:pointer-events-none [&>button]:opacity-40" : ""}`} aria-describedby="completion-description">
        {stage === "success" ? (
          <div className="flex min-h-72 flex-col items-center justify-center gap-3 px-6 py-12 text-center" role="status" aria-live="polite">
            <CircleCheck className="size-12 text-admin-success motion-safe:animate-in motion-safe:zoom-in-75" />
            <DialogTitle className="text-xl">Certificate sent successfully</DialogTitle>
            <DialogDescription id="completion-description">The order has been marked Completed.</DialogDescription>
            <p className="max-w-full break-all text-sm font-medium text-admin-fg">{recipientEmail}</p>
          </div>
        ) : (
          <>
            <DialogHeader className="px-5 pb-3 pt-5 pr-12 sm:px-6">
              <div className="flex items-start gap-3 text-left">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-admin-accent-soft text-admin-primary"><FileCheck2 className="size-5" /></div>
                <div className="min-w-0">
                  <DialogTitle className="text-xl leading-6">Complete Service</DialogTitle>
                  <p className="mt-1 text-sm font-semibold text-admin-fg">{serviceName}</p>
                  <DialogDescription id="completion-description" className="mt-1 text-xs">Upload the certificate, add document number and we’ll send it to the customer.</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="max-h-[calc(100dvh-170px)] space-y-2.5 overflow-y-auto px-4 pb-3 sm:px-5">
              <div className="grid grid-cols-3 gap-1 py-3 text-center" aria-label="Completion steps">
                {(["Upload Certificate", "Certificate Number", "Send to Customer"] as const).map((label, index) => {
                  const done = index === 0 ? Boolean(uploaded) : index === 1 ? Boolean(certNumber.trim()) : sendingConfirmed;
                  const active = index === 0 ? !uploaded : index === 1 ? Boolean(uploaded && !certNumber.trim()) : Boolean(uploaded && certNumber.trim());
                  return <div key={label} className="relative min-w-0 text-[11px]">
                    {index < 2 && <span aria-hidden="true" className="absolute left-[calc(50%+15px)] right-[calc(-50%+15px)] top-3 h-px bg-admin-border-strong" />}
                    <span className={`relative mx-auto flex size-6 items-center justify-center rounded-full text-xs font-semibold ${done ? "bg-admin-success text-primary-foreground" : active ? "bg-admin-primary text-primary-foreground" : "bg-admin-surface-2 text-admin-fg-muted"}`}>{done ? <Check className="size-3.5" /> : index + 1}</span>
                    <span className={`mt-1 block leading-tight ${active ? "font-semibold text-admin-fg" : "text-admin-fg-muted"}`}>{label}</span>
                  </div>;
                })}
              </div>

              <section className="space-y-2" aria-label="Upload Certificate">
                <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-semibold">01 Upload Certificate</h3><span className="text-[11px] text-admin-fg-muted">PDF, JPG, PNG, WEBP · Max 10 MB</span></div>
                {!file ? (
                  <div onDragOver={(e) => { e.preventDefault(); if (!locked) setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={(e) => { e.preventDefault(); setDragOver(false); chooseFile(e.dataTransfer.files?.[0] ?? null); }}
                    className={`flex min-h-28 flex-col items-center justify-center rounded-md border border-dashed p-4 text-center transition-colors ${dragOver ? "border-admin-primary bg-admin-accent-soft" : "border-admin-border-strong bg-admin-surface-2"}`}>
                    <UploadCloud className="mb-1 size-8 text-admin-primary" />
                    <p className="text-sm font-semibold">Upload Certificate</p>
                    <Button type="button" variant="link" className="h-auto p-0 text-xs text-admin-fg-muted" onClick={() => fileInput.current?.click()} disabled={locked}>Drag &amp; drop or click to browse</Button>
                  </div>
                ) : (
                  <div className={`flex items-center gap-3 rounded-md border p-3 ${fileError ? "border-admin-danger bg-destructive/5" : uploaded?.file === file ? "border-admin-success bg-admin-success/5" : "border-admin-border bg-admin-surface-2"}`}>
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-admin-surface text-admin-primary"><FileText className="size-5" /></div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium" title={file.name}>{file.name}</p>
                      <p className="text-xs text-admin-fg-muted">{formatSize(file.size)} · {uploaded?.file === file ? "Uploaded" : "Selected for upload"}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${uploaded?.file === file ? "bg-admin-success/10 text-admin-success" : "bg-admin-accent-soft text-admin-primary"}`}><Check className="size-3" />{uploaded?.file === file ? "File uploaded" : "File selected"}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => fileInput.current?.click()} disabled={locked} title="Replace file" aria-label="Replace file"><RefreshCw /></Button>
                  </div>
                )}
                {fileError && <p className="text-xs text-admin-danger" role="alert">{isEmpty ? "This file is empty. Choose another." : tooBig ? "This file exceeds 10 MB." : "Choose a PDF, JPG, PNG or WEBP file."}</p>}
                <input ref={fileInput} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp" className="sr-only" tabIndex={-1} disabled={locked} onChange={(e) => { chooseFile(e.target.files?.[0] ?? null); e.target.value = ""; }} aria-label="Certificate file" />
              </section>

              <section className="space-y-2">
                <Label htmlFor="completion-cert-number" className="text-sm font-semibold">02 Certificate / Document Number <span className="text-admin-danger">Required</span></Label>
                <Input id="completion-cert-number" value={certNumber} onChange={(e) => { setCertNumber(e.target.value); setError(null); }} onBlur={() => setNumberTouched(true)} disabled={locked} aria-invalid={numberTouched && !certNumber.trim()} aria-describedby={numberTouched && !certNumber.trim() ? "completion-number-error" : undefined} placeholder="e.g. UDYAM-MH-28-0012345" autoComplete="off" className="h-11 border-admin-border-strong bg-admin-surface" />
                {numberTouched && !certNumber.trim() && <p id="completion-number-error" className="text-xs text-admin-danger" role="alert">Enter the certificate / document number.</p>}
              </section>

              <section className="space-y-2">
                <div className="flex justify-between gap-2"><Label htmlFor="completion-notes" className="text-sm font-semibold">03 Completion Notes <span className="font-normal text-admin-fg-muted">(Optional)</span></Label><span className="text-xs text-admin-fg-muted">{completionNotes.length}/500</span></div>
                <Textarea id="completion-notes" value={completionNotes} onChange={(e) => setCompletionNotes(e.target.value)} disabled={locked} rows={2} maxLength={500} placeholder="Notes to include in the customer email" className="resize-y border-admin-border-strong bg-admin-surface" />
              </section>

              <div className="flex items-start gap-3 rounded-md border border-admin-border bg-admin-accent-soft p-3 text-xs">
                <Mail className="mt-0.5 size-4 shrink-0 text-admin-primary" />
                <div className="min-w-0"><p className="text-admin-fg-muted">The certificate will be emailed to:</p><p className="break-all font-semibold text-admin-fg">{recipientEmail ?? "No email on file"}</p></div>
              </div>
              <div className="flex items-start gap-2 rounded-md border border-admin-warn/30 bg-admin-warn/5 p-3 text-xs text-admin-fg">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-admin-warn" />
                <p>After the certificate email is sent, the order will move to <strong>COMPLETED</strong>. All other customer documents for this order will then be permanently deleted.</p>
              </div>
              {(working || error) && <div role={error ? "alert" : "status"} aria-live="polite" className={`flex items-start gap-2 rounded-md border p-3 text-sm ${error ? "border-admin-danger/40 bg-destructive/5 text-admin-danger" : "border-admin-border bg-admin-accent-soft text-admin-primary"}`}>
                {error ? <AlertTriangle className="mt-0.5 size-4 shrink-0" /> : <Loader2 className="mt-0.5 size-4 shrink-0 animate-spin" />}
                <span>{error || (stage === "uploading" ? "Uploading certificate…" : stage === "preparing" ? "Preparing certificate email…" : "Sending to customer…")}</span>
              </div>}
            </div>
            <DialogFooter className="flex-row justify-between gap-3 border-t border-admin-border px-5 py-4 sm:px-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={locked}>Cancel</Button>
              <Button type="button" onClick={() => void submit()} disabled={locked || !file || Boolean(fileError) || !certNumber.trim() || !recipientEmail} className="min-w-44">
                {working ? <><Loader2 className="animate-spin" />{stage === "uploading" ? "Uploading certificate…" : stage === "preparing" ? "Preparing email…" : "Sending to customer…"}</> : <><Send />Upload &amp; Send Certificate</>}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
