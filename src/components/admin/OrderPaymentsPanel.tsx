import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Download, Mail, RefreshCw } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { useState } from "react";
import { getInvoiceSignedUrl, regenerateInvoice, resendInvoiceEmail } from "@/lib/crm/invoices.functions";

export function OrderPaymentsPanel({ payments }: { payments: any[] }) {
  const getUrlFn = useServerFn(getInvoiceSignedUrl);
  const regenFn = useServerFn(regenerateInvoice);
  const resendFn = useServerFn(resendInvoiceEmail);
  const [busy, setBusy] = useState<string | null>(null);

  const handleDownload = async (p: any) => {
    try {
      setBusy(`dl-${p.id}`);
      // Try by invoice id via payment lookup
      const invoiceId = p.invoice_id ?? null;
      if (!invoiceId) {
        // Resend will regenerate if missing; but for download we need an invoiceId.
        await regenFn({ data: { paymentId: p.id } as any }).catch(() => null);
      }
      const id = invoiceId ?? p.invoice_id;
      if (!id) {
        toast.error("Invoice not generated yet. Click Regenerate first.");
        return;
      }
      const { url } = await getUrlFn({ data: { invoiceId: id } });
      window.open(url, "_blank");
    } catch (e: any) {
      toast.error(e?.message ?? "Download failed");
    } finally {
      setBusy(null);
    }
  };
  const handleResend = async (p: any) => {
    try {
      setBusy(`mail-${p.id}`);
      await resendFn({ data: { paymentId: p.id } });
      toast.success("Invoice email queued with PDF attached.");
    } catch (e: any) {
      toast.error(e?.message ?? "Email failed");
    } finally {
      setBusy(null);
    }
  };
  const handleRegen = async (p: any) => {
    try {
      setBusy(`gen-${p.id}`);
      if (p.invoice_id) await regenFn({ data: { invoiceId: p.invoice_id } });
      else {
        // We don't have a direct generate-by-payment server fn exposed here; resend triggers regen+email.
        await resendFn({ data: { paymentId: p.id } });
      }
      toast.success("Invoice PDF regenerated.");
    } catch (e: any) {
      toast.error(e?.message ?? "Regenerate failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="rounded-lg border bg-white p-5" style={{ borderColor: "var(--admin-border)" }}>
      <div className="flex items-center gap-2 mb-3">
        <CreditCard className="size-4 text-slate-600" />
        <h3 className="text-sm font-semibold">Payments & Invoices</h3>
      </div>
      {payments.length === 0 ? (
        <div className="text-sm text-slate-500 italic">No payments recorded.</div>
      ) : (
        <table className="w-full text-xs">
          <thead className="text-slate-500 uppercase tracking-wider">
            <tr className="text-left">
              <th className="py-1.5">Date</th>
              <th>Amount</th>
              <th>Gateway</th>
              <th>Ref</th>
              <th>Status</th>
              <th className="text-right">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => {
              const amt = Number(p.amount || 0);
              const isRefund = !!p.parent_payment_id || amt < 0;
              const isPaid = String(p.status).toLowerCase() === "paid" && !isRefund;
              return (
                <tr key={p.id} className={`border-t ${isRefund ? "bg-rose-50/50" : ""}`}>
                  <td className="py-1.5 text-slate-600">
                    {p.payment_date
                      ? new Date(p.payment_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })
                      : new Date(p.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })}
                  </td>
                  <td className={`font-medium ${isRefund ? "text-rose-700" : "text-slate-800"}`}>
                    {isRefund ? "Refund · " : ""}
                    ₹{Math.abs(amt).toLocaleString("en-IN")}
                  </td>
                  <td className="text-slate-600 capitalize">{p.gateway_name ?? "—"}</td>
                  <td className="font-mono text-[10px] text-slate-500">{p.transaction_id ?? "—"}</td>
                  <td>
                    <Badge variant="secondary" className={`text-[10px] ${isRefund ? "bg-rose-100 text-rose-700" : ""}`}>
                      {String(p.status).replace(/_/g, " ")}
                    </Badge>
                  </td>
                  <td className="text-right">
                    {isPaid ? (
                      <div className="inline-flex items-center gap-1">
                        <Button
                          size="sm" variant="outline" className="h-7 px-2"
                          disabled={busy === `dl-${p.id}`}
                          onClick={() => handleDownload(p)}
                          title="Download invoice PDF"
                        >
                          <Download className="size-3.5" />
                        </Button>
                        <Button
                          size="sm" variant="outline" className="h-7 px-2"
                          disabled={busy === `mail-${p.id}`}
                          onClick={() => handleResend(p)}
                          title="Email invoice again (with PDF attachment)"
                        >
                          <Mail className="size-3.5" />
                        </Button>
                        <Button
                          size="sm" variant="outline" className="h-7 px-2"
                          disabled={busy === `gen-${p.id}`}
                          onClick={() => handleRegen(p)}
                          title="Regenerate invoice PDF"
                        >
                          <RefreshCw className="size-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[10px]">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
