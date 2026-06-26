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
      { title: "Payment Successful — Business Help Services" },
      { name: "description", content: "Your payment was received successfully." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: SuccessPage,
});

const PAID_STATUSES = new Set(["payment_successful", "under_process", "completed"]);
const POST_PAY_SECONDS = 60;
const POST_PAY_STEPS: readonly CountdownStep[] = [
  { at: 0,  icon: ShieldCheck,    label: "Verifying payment",          sub: "Confirming transaction with your bank" },
  { at: 10, icon: CreditCard,     label: "Reconciling transaction",    sub: "Matching payment to your application" },
  { at: 20, icon: FileText,       label: "Preparing your application", sub: "Setting up your secure onboarding form with your details." },
  { at: 32, icon: Sparkles,       label: "Personalising your form",    sub: "Tailoring fields to your selected service" },
  { at: 44, icon: ClipboardCheck, label: "Final compliance checks",    sub: "Aligning with MSME guidelines" },
  { at: 54, icon: CheckCircle2,   label: "Almost ready",               sub: "Opening your form in a moment…" },
] as const;

function SuccessPage() {
  const { leadCode } = Route.useParams();
  const navigate = useNavigate();
  const getSummary = useServerFn(getApplicationSummary);

  const [elapsed, setElapsed] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tick the 60-second countdown immediately on landing.
  useEffect(() => {
    trackEvent("payment_success_page_view", { leadCode });
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [leadCode]);

  // Poll payment confirmation in parallel.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (let attempt = 0; attempt < 30; attempt++) {
        try {
          const res = await getSummary({ data: { leadCode } });
          if (cancelled) return;
          const isPaid =
            !!res?.lead?.payment || PAID_STATUSES.has(res?.lead?.status);
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
    })();
    return () => {
      cancelled = true;
    };
  }, [leadCode, getSummary]);

  // Once both the countdown finished AND payment is confirmed, go to onboarding.
  useEffect(() => {
    if (confirmed && elapsed >= POST_PAY_SECONDS) {
      navigate({
        to: "/onboarding/$leadCode",
        params: { leadCode },
        replace: true,
      });
    }
  }, [confirmed, elapsed, leadCode, navigate]);

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

  const holding = elapsed >= POST_PAY_SECONDS && !confirmed;

  return (
    <div>
      <CountdownCard
        totalSeconds={POST_PAY_SECONDS}
        elapsed={elapsed}
        steps={POST_PAY_STEPS}
        leadCode={leadCode}
        holdLabel={holding ? "Confirming with your bank" : undefined}
        holdSub={holding ? "This usually takes a few more seconds…" : undefined}
      />
      <TrustBlock />
    </div>
  );
}
