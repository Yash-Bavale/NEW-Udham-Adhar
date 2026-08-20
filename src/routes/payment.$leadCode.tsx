import { useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Lock, Loader2, Clock } from "lucide-react";
import { initiatePayment, type InitiatePaymentResult } from "@/lib/payments/initiate.functions";
import { getApplicationSummary } from "@/lib/payments/gateways.functions";
import { trackEvent } from "@/lib/analytics/track";

const PAID_STATUSES = new Set(["payment_successful", "under_process", "completed"]);

export const Route = createFileRoute("/payment/$leadCode")({
  head: () => ({
    meta: [
      { title: "Your Application Is Ready — Business Help Services" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: PaymentPage,
});

function PaymentPage() {
  const { leadCode } = Route.useParams();
  const navigate = useNavigate();
  const createOrder = useServerFn(initiatePayment);
  const getSummary = useServerFn(getApplicationSummary);
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Awaited<ReturnType<typeof createPayUOrder>> | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    trackEvent("payment_page_viewed", { leadCode });
    (async () => {
      try {
        const res = await getSummary({ data: { leadCode } });
        const hasPendingLink = (res as any)?.hasPendingLink || (res as any)?.pendingAmount > 0;
        const isPaid = !hasPendingLink && (!!res?.lead?.payment || PAID_STATUSES.has(res?.lead?.status));
        if (isPaid) {
          navigate({ to: "/success/$leadCode", params: { leadCode }, replace: true });
        }
      } catch { /* ignore */ }
    })();
  }, [leadCode, getSummary, navigate]);

  async function pay() {
    setBusy(true);
    setError(null);
    trackEvent("payment_initiated", { gateway: "payu", leadCode });
    try {
      const res = await createOrder({ data: { leadCode } });
      setOrder(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start payment.");
      setBusy(false);
    }
  }

  // Auto-submit hidden form once we have order fields
  useEffect(() => {
    if (order && formRef.current) {
      formRef.current.submit();
    }
  }, [order]);

  return (
    <section className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="bg-form-header text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold font-display">Your Application Is Ready</h1>
            <p className="text-xs text-white/80">Ref: {leadCode}</p>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Lock className="w-3.5 h-3.5" /> 256-bit Encrypted
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            You'll be redirected to PayU's secure gateway to complete payment by UPI, Card, Net Banking or Wallets.
          </p>

          {!order && (
            <>
              <button
                onClick={pay}
                disabled={busy}
                className="w-full rounded-full bg-brand-navy hover:bg-brand-navy-deep text-white font-semibold py-3 transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
              >
                {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Starting secure session…</> : "Pay Now"}
              </button>
              <DummyUrgencyTimer />
            </>
          )}

          {order && (
            <div className="text-center text-sm text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
              Redirecting to PayU…
            </div>
          )}

          <p className="text-center text-[11px] text-muted-foreground">
            We never see or store your card or UPI credentials.
          </p>
        </div>
      </div>

      {/* Hidden auto-submit form posting to PayU */}
      {order && (
        <form ref={formRef} method="POST" action={order.actionUrl} className="hidden">
          {Object.entries(order.fields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
        </form>
      )}
    </section>
  );
}

function DummyUrgencyTimer() {
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatted = String(seconds).padStart(2, "0");

  return (
    <div className="rounded-xl border border-red-200 bg-red-50/90 py-3.5 px-4 text-center font-bold text-red-600 text-sm md:text-base flex items-center justify-center gap-2 shadow-sm">
      <Clock className="w-5 h-5 text-red-600 animate-pulse shrink-0" />
      <span>Complete Your Payment In: 00:{formatted}</span>
    </div>
  );
}
