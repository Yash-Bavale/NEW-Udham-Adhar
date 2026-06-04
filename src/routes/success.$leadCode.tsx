import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  History,
  Sparkles,
} from "lucide-react";
import { getApplicationSummary } from "@/lib/payments/gateways.functions";
import { trackEvent } from "@/lib/analytics/track";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrustBlock } from "@/components/site/TrustBlock";

export const Route = createFileRoute("/success/$leadCode")({
  head: () => ({
    meta: [
      { title: "Payment Successful — Start Onboarding" },
      { name: "description", content: "Your payment was received. Complete a quick onboarding to file your application." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: SuccessPage,
});

const PAID_STATUSES = new Set(["payment_successful", "under_process", "completed"]);
const REDIRECT_SECONDS = 15;

type Phase = "confirming" | "confirmed" | "action";

function SuccessPage() {
  const { leadCode } = Route.useParams();
  const navigate = useNavigate();
  const getSummary = useServerFn(getApplicationSummary);

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);

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
            setData(res);
            setIsLoading(false);
            return;
          }
        } catch (err: any) {
          if (cancelled) return;
          setError(err?.message || "Failed to load details");
          setIsLoading(false);
          return;
        }
        await new Promise((r) => setTimeout(r, 2000));
      }
      if (cancelled) return;
      navigate({ to: "/payment-pending/$leadCode", params: { leadCode }, replace: true });
    })();

    return () => {
      cancelled = true;
    };
  }, [leadCode, getSummary, navigate]);

  // Countdown — starts once payment confirmed.
  useEffect(() => {
    if (isLoading || error || !data) return;
    if (secondsLeft <= 0) {
      trackEvent("post_payment_auto_redirect", { leadCode, cancelled: false });
      navigate({ to: "/onboarding/$leadCode", params: { leadCode }, replace: true });
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [isLoading, error, data, secondsLeft, leadCode, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
          <p className="text-brand-navy font-semibold">Confirming payment…</p>
          <p className="text-xs text-slate-500">This can take a few seconds.</p>
        </div>
      </div>
    );
  }

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

  if (!data) return null;

  // Phase derived from countdown — confirming (15-11) → confirmed (10-6) → action (5-0)
  const elapsed = REDIRECT_SECONDS - secondsLeft;
  const phase: Phase = elapsed < 5 ? "confirming" : elapsed < 10 ? "confirmed" : "action";
  const ringCirc = 2 * Math.PI * 44;
  const ringProgress = ringCirc * (1 - secondsLeft / REDIRECT_SECONDS);

  const palette = {
    confirming: {
      bg: "from-slate-50 to-blue-50/60",
      border: "border-slate-300",
      accent: "text-blue-600",
      ring: "stroke-blue-500",
      chipBg: "bg-blue-100 text-blue-700",
      chipLabel: "Step 1 of 3",
    },
    confirmed: {
      bg: "from-emerald-50 to-green-50/60",
      border: "border-emerald-300",
      accent: "text-emerald-600",
      ring: "stroke-emerald-500",
      chipBg: "bg-emerald-100 text-emerald-700",
      chipLabel: "Step 2 of 3",
    },
    action: {
      bg: "from-amber-50 to-orange-50",
      border: "border-amber-400",
      accent: "text-brand-red",
      ring: "stroke-brand-red",
      chipBg: "bg-amber-100 text-amber-800",
      chipLabel: "Step 3 of 3",
    },
  }[phase];

  return (
    <div>
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 bg-gradient-to-b from-slate-50 to-white">
      <Card
        className={`w-full max-w-lg border-2 ${palette.border} bg-gradient-to-br ${palette.bg} shadow-2xl overflow-hidden transition-colors duration-700`}
      >
        <div className="p-8 sm:p-10 flex flex-col items-center text-center">
          <div className={`text-[10px] uppercase tracking-[0.18em] font-bold px-3 py-1 rounded-full ${palette.chipBg} mb-6`}>
            {palette.chipLabel}
          </div>

          {/* Center stage: ring + icon */}
          <div className="relative w-44 h-44 mb-6">
            <svg className="w-44 h-44 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" strokeWidth="6" className="stroke-slate-200" />
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={ringCirc}
                strokeDashoffset={ringProgress}
                style={{ transition: "stroke-dashoffset 1s linear" }}
                className={palette.ring}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              {phase === "confirming" && (
                <Loader2 className={`w-16 h-16 ${palette.accent} animate-spin`} key="confirming" />
              )}
              {phase === "confirmed" && (
                <div key="confirmed" className="animate-in zoom-in-50 fade-in duration-500">
                  <CheckCircle2 className={`w-20 h-20 ${palette.accent} drop-shadow`} />
                </div>
              )}
              {phase === "action" && (
                <div key="action" className="animate-in zoom-in-75 fade-in duration-300 motion-safe:animate-pulse">
                  <AlertCircle className={`w-20 h-20 ${palette.accent}`} />
                </div>
              )}
            </div>
          </div>

          {/* Phase-specific message */}
          {phase === "confirming" && (
            <div key="t-confirming" className="animate-in fade-in duration-500">
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-brand-navy mb-2">
                Confirming your payment…
              </h1>
              <p className="text-sm text-slate-600 max-w-sm">
                Please wait while we verify your transaction with the gateway. Do not close or refresh this page.
              </p>
            </div>
          )}
          {phase === "confirmed" && (
            <div key="t-confirmed" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-emerald-700 mb-2">
                Payment confirmed ✓
              </h1>
              <p className="text-sm text-slate-700 max-w-sm">
                Thank you! Your application fee has been received. Preparing your onboarding form…
              </p>
            </div>
          )}
          {phase === "action" && (
            <div key="t-action" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red text-white text-[11px] uppercase tracking-widest font-bold mb-3 motion-safe:animate-pulse">
                <Sparkles className="w-3.5 h-3.5" /> Action Needed
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-brand-navy mb-2 leading-tight">
                Fill incomplete information
              </h1>
              <p className="text-sm text-slate-700 max-w-sm">
                Our experts need a few more details to file your application. Opening the form automatically — please don't leave this page.
              </p>
            </div>
          )}

          {/* Countdown line — always visible, becomes urgent in phase 3 */}
          <div className="mt-7 flex items-baseline gap-2">
            <span
              className={`text-5xl font-bold font-display tabular-nums transition-colors duration-500 ${palette.accent}`}
            >
              {secondsLeft}
            </span>
            <span className="text-xs uppercase tracking-widest font-semibold text-slate-500">
              {phase === "action" ? "Opening form" : "seconds"}
            </span>
          </div>

          <p className="mt-6 text-[11px] text-slate-400 font-mono">
            Ref: <span className="text-brand-navy font-semibold">{leadCode}</span>
          </p>
        </div>
      </Card>
    </div>
    <TrustBlock />
    </div>
  );
}
