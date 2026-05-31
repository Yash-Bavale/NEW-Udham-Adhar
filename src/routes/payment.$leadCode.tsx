import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lock, CreditCard, Smartphone, Building2 } from "lucide-react";

export const Route = createFileRoute("/payment/$leadCode")({
  head: () => ({
    meta: [
      { title: "Complete Payment — Business Help Services Consultancy" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: PaymentPage,
});

type Method = "upi" | "card" | "netbanking";

function PaymentPage() {
  const { leadCode } = Route.useParams();
  const navigate = useNavigate();
  const [method, setMethod] = useState<Method>("upi");
  const [busy, setBusy] = useState(false);

  const amount = 116.82;

  function pay() {
    setBusy(true);
    setTimeout(() => {
      navigate({ to: "/success/$leadCode", params: { leadCode } });
    }, 1500);
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="bg-form-header text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold font-display">Secure Payment</h1>
            <p className="text-xs text-white/80">Ref: {leadCode}</p>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Lock className="w-3.5 h-3.5" /> Encrypted
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="rounded-lg border border-border bg-muted/30 p-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Amount Payable</span>
            <span className="text-2xl font-bold font-display text-brand-navy">
              ₹{amount.toFixed(2)}
            </span>
          </div>

          <div>
            <p className="text-sm font-semibold mb-3">Select Payment Method</p>
            <div className="grid grid-cols-3 gap-2">
              <MethodBtn active={method === "upi"} onClick={() => setMethod("upi")} icon={<Smartphone className="w-5 h-5" />} label="UPI" />
              <MethodBtn active={method === "card"} onClick={() => setMethod("card")} icon={<CreditCard className="w-5 h-5" />} label="Card" />
              <MethodBtn active={method === "netbanking"} onClick={() => setMethod("netbanking")} icon={<Building2 className="w-5 h-5" />} label="Net Banking" />
            </div>
          </div>

          {method === "upi" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">UPI ID</label>
              <input className="w-full rounded-md border border-border px-4 py-3 text-sm" placeholder="yourname@upi" />
            </div>
          )}
          {method === "card" && (
            <div className="space-y-3">
              <input className="w-full rounded-md border border-border px-4 py-3 text-sm" placeholder="Card number" />
              <div className="grid grid-cols-2 gap-3">
                <input className="rounded-md border border-border px-4 py-3 text-sm" placeholder="MM / YY" />
                <input className="rounded-md border border-border px-4 py-3 text-sm" placeholder="CVV" />
              </div>
            </div>
          )}
          {method === "netbanking" && (
            <select className="w-full rounded-md border border-border px-4 py-3 text-sm" defaultValue="">
              <option value="" disabled>Select your bank</option>
              <option>State Bank of India</option>
              <option>HDFC Bank</option>
              <option>ICICI Bank</option>
              <option>Axis Bank</option>
              <option>Punjab National Bank</option>
            </select>
          )}

          <button
            onClick={pay}
            disabled={busy}
            className="w-full rounded-full bg-brand-navy hover:bg-brand-navy-deep text-white font-semibold py-3 transition-colors disabled:opacity-60"
          >
            {busy ? "Processing Payment…" : `Pay ₹${amount.toFixed(2)}`}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            This is a demo payment page. No real money will be charged.
          </p>
        </div>
      </div>
    </section>
  );
}

function MethodBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 rounded-lg border-2 px-2 py-3 text-xs font-medium transition-colors ${
        active ? "border-brand-navy bg-brand-navy/5 text-brand-navy" : "border-border text-foreground/70 hover:border-brand-navy/40"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
