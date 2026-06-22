import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Upload, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";

import {
  FULFILLMENT_BADGE, FULFILLMENT_LABEL,
  getAllowedFulfillmentTransitions, type FulfillmentStatus,
} from "@/lib/crm/fulfillment-transitions";
import {
  updateFulfillmentStatus, requestOrderDocumentUpload, confirmOrderDocumentUpload,
} from "@/lib/crm/orders-v2.functions";

export function FulfillmentStatusUpdater({
  orderId, current,
}: { orderId: string; current: FulfillmentStatus }) {
  const qc = useQueryClient();
  const updateFn = useServerFn(updateFulfillmentStatus);
  const allowed = getAllowedFulfillmentTransitions(current);

  const [target, setTarget] = useState<FulfillmentStatus | "">("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [certOpen, setCertOpen] = useState(false);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin.order", orderId] });
  };

  const doUpdate = async (certificateDocumentId?: string) => {
    if (!target) return;
    setBusy(true);
    try {
      await updateFn({
        data: {
          orderId,
          toStatus: target,
          note: note || undefined,
          certificateDocumentId,
        },
      });
      toast.success(`Status → ${FULFILLMENT_LABEL[target as FulfillmentStatus]}`);
      setTarget(""); setNote(""); setCertOpen(false);
      refresh();
    } catch (e: any) {
      toast.error(e?.message ?? "Update failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="rounded-lg border bg-white p-5 space-y-3" style={{ borderColor: "var(--admin-border)" }}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-1.5">Fulfillment Status</div>
          <span className={`inline-flex items-center px-3 py-1.5 rounded-md border text-sm font-semibold ${FULFILLMENT_BADGE[current]}`}>
            {FULFILLMENT_LABEL[current]}
          </span>
        </div>
      </div>

      {allowed.length === 0 ? (
        <div className="text-sm text-slate-500 italic">Terminal status — no further transitions.</div>
      ) : (
        <div className="space-y-2">
          <Label className="text-xs">Move to</Label>
          <div className="flex flex-wrap gap-2">
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value as FulfillmentStatus)}
              className="flex-1 min-w-[200px] rounded-md border px-2 py-1.5 text-sm bg-white"
            >
              <option value="">Select next stage…</option>
              {allowed.map((s) => (
                <option key={s} value={s}>{FULFILLMENT_LABEL[s]}</option>
              ))}
            </select>
            <Button
              size="sm"
              disabled={!target || busy}
              onClick={() => {
                if (target === "completed") setCertOpen(true);
                else doUpdate();
              }}
              className="bg-[#1e3a5f] hover:bg-[#1e3a5f]/90"
            >
              {busy && <Loader2 className="size-3 animate-spin mr-1" />}
              Update Status
            </Button>
          </div>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note for the activity timeline"
            rows={2}
            className="text-xs"
          />
        </div>
      )}

      <CertificateUploadDialog
        open={certOpen}
        onOpenChange={setCertOpen}
        orderId={orderId}
        busy={busy}
        onConfirm={(docId) => doUpdate(docId)}
      />
    </div>
  );
}

function CertificateUploadDialog({
  open, onOpenChange, orderId, busy, onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  orderId: string;
  busy: boolean;
  onConfirm: (docId: string) => void;
}) {
  const requestFn = useServerFn(requestOrderDocumentUpload);
  const confirmFn = useServerFn(confirmOrderDocumentUpload);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const upload = async () => {
    if (!file) { toast.error("Pick a file first"); return; }
    setUploading(true);
    try {
      const { path, token } = await requestFn({
        data: {
          orderId,
          docType: "certificate",
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
        },
      });
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase.storage.from("documents").uploadToSignedUrl(path, token, file, {
        contentType: file.type || undefined,
        upsert: true,
      });
      if (error) throw error;
      const { documentId } = await confirmFn({
        data: {
          orderId,
          docType: "certificate",
          filePath: path,
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
        },
      });
      onConfirm(documentId);
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="size-4" /> Upload Completion Certificate
          </DialogTitle>
          <DialogDescription>
            Upload the certificate/acknowledgement before marking this order complete.
            Customer documents will be permanently deleted afterwards (only the certificate is kept).
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          {file && (
            <div className="text-xs text-slate-600">
              {file.name} · {(file.size / 1024).toFixed(0)} KB
            </div>
          )}
          <div className="rounded-md bg-amber-50 border border-amber-200 p-2 text-xs text-amber-800 flex gap-2">
            <AlertTriangle className="size-3.5 mt-0.5 flex-shrink-0" />
            <div>This action also closes the parent lead and queues the order-completed email.</div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={uploading || busy}>Cancel</Button>
          <Button onClick={upload} disabled={uploading || busy || !file} className="bg-[#1e3a5f] hover:bg-[#1e3a5f]/90">
            {uploading || busy ? <><Loader2 className="size-3 animate-spin mr-1" /> Uploading…</> : "Upload & Complete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
