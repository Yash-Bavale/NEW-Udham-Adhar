import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  ShieldCheck,
  CreditCard,
  FileText,
  Sparkles,
  ClipboardCheck,
  CheckCircle2,
  History,
} from "lucide-react";
import { getApplicationSummary } from "@/lib/payments/gateways.functions";
import { trackEvent } from "@/lib/analytics/track";
import { Button } from "@/components/ui/button";
import { TrustBlock } from "@/components/site/TrustBlock";
import { CountdownCard, type CountdownStep } from "@/components/site/CountdownCard";

export const Route = createFileRoute("/success/$leadCode")({
  head: () => ({
    meta: [
      { title: "Payment Successful — Preparing Your Form" },
      { name: "description", content: "Your payment was received. We're preparing your secure onboarding form." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: SuccessPage,
});

const PAID_STATUSES = new Set(["payment_successful", "under_process", "completed"]);
const TOTAL_SECONDS = 60;

const STEPS: readonly CountdownStep[] = [
  { at: 0,  icon: ShieldCheck,     label: "Verifying payment",          sub: "Confirming transaction with your bank" },
  { at: 10, icon: CreditCard,      label: "Reconciling transaction",    sub: "Matching payment to your application" },
  { at: 20, icon: FileText,        label: "Preparing your application", sub: "Setting up your secure onboarding form with your details." },
  { at: 32, icon: Sparkles,        label: "Personalising your form",    sub: "Tailoring fields to your selected service" },
  { at: 44, icon: ClipboardCheck,  label: "Final compliance checks",    sub: "Aligning with MSME guidelines" },
  { at: 54, icon: CheckCircle2,    label: "Almost ready",               sub: "Opening your form in a moment…" },
] as const;

function SuccessPage() {
  const { leadCode } = Route.useParams();
  const navigate = useNavigate();
  const getSummary = useServerFn(getApplicationSummary);

  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [pendingFallback, setPendingFallback] = useState(false);

  useEffect(() => {
    trackEvent("payment_success_page_view", { leadCode });
    let cancelled = false;

    (async () => {
      const maxAttempts = 15;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          const res = await getSummary({ data: { leadCode } });
          if (cancelled) return;
          const isPaid = !!res?.lead?.payment || PAID_STATUSES.has(res?.lead?.status);
          if (isPaid) {
            setConfirmed(true);
            return;
          }
        } catch (err: any) {
          if (cancelled) return;
          setError(err?.message || "Failed to load details");
          return;
        }
        await new Promise((r) => setTimeout(r, 2000));
      }
      if (cancelled) return;
      setPendingFallback(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [leadCode, getSummary, navigate]);

  useEffect(() => {
    if (error) return;
    if (elapsed >= TOTAL_SECONDS) return;
    const t = setTimeout(() => setElapsed((s) => s + 1), 1000);
    return () => clearTimeout(t);
  }, [elapsed, error]);

  useEffect(() => {
    if (error) return;
    if (pendingFallback && elapsed >= TOTAL_SECONDS) {
      navigate({ to: "/payment-pending/$leadCode", params: { leadCode }, replace: true });
      return;
    }
    if (confirmed && elapsed >= TOTAL_SECONDS) {
      trackEvent("post_payment_auto_redirect", { leadCode, cancelled: false });
      navigate({ to: "/onboarding/$leadCode", params: { leadCode }, replace: true });
    }
  }, [confirmed, pendingFallback, elapsed, error, leadCode, navigate]);

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <History className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-lg font-bold text-brand-navy mb-2">Something went wrong</h2>
          <p className="text-slate-600 text-sm mb-6">{error}</p>
          <Button className="bg-brand-navy" onClick={() => window.location.reload()}>
            Try Refreshing
          </Button>
        </div>
      </div>
    );
  }

  const holding = elapsed >= TOTAL_SECONDS && !confirmed && !pendingFallback;

  return (
    <div>
      <CountdownCard
        totalSeconds={TOTAL_SECONDS}
        elapsed={elapsed}
        steps={STEPS}
        leadCode={leadCode}
        holdLabel={holding ? "Almost ready" : undefined}
        holdSub={holding ? "Finalising confirmation with your bank…" : undefined}
      />
      <TrustBlock />
    </div>
  );
}
