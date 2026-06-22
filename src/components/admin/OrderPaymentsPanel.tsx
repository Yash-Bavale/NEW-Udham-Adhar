import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";

export function OrderPaymentsPanel({ payments }: { payments: any[] }) {
  return (
    <div className="rounded-lg border bg-white p-5" style={{ borderColor: "var(--admin-border)" }}>
      <div className="flex items-center gap-2 mb-3">
        <CreditCard className="size-4 text-slate-600" />
        <h3 className="text-sm font-semibold">Payments</h3>
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
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => {
              const amt = Number(p.amount || 0);
              const isRefund = !!p.parent_payment_id || amt < 0;
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
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
