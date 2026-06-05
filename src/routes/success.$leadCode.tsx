import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  CheckCircle2,
  AlertCircle,
  History,
  Sparkles,
  Loader2,
  ShieldCheck,
  FileText,
  Clock,
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
const REDIRECT_SECONDS = 30;

type Phase = "processing" | "verifying" | "preparing" | "almost" | "confirmed" | "action";

// Rotating messages every 5 seconds across the 30s timer.
// Window = [maxSecondsLeft, minSecondsLeft) inclusive on max.
const PHASE_STEPS: Array<{
  phase: Phase;
  max: number; // when secondsLeft <= max && > min, this phase shows
  min: number;
  title: string;
  subtitle: string;
  chip: string;
}> = [
  { phase: "processing", max: 30, min: 25, title: "Processing your payment…", subtitle: "Please wait while we securely confirm your transaction with the bank.", chip: "Step 1 of 6" },
  { phase: "verifying", max: 25, min: 20, title: "Verifying transaction details", subtitle: "Matching your payment with our records. This only takes a moment.", chip: "Step 2 of 6" },
  { phase: "preparing", max: 20, min: 15, title: "Preparing your application", subtitle: "Setting up your secure onboarding form with your details.", chip: "Step 3 of 6" },
  { phase: "almost", max: 15, min: 10, title: "Almost ready…", subtitle: "Finalising everything so you can fill the remaining details smoothly.", chip: "Step 4 of 6" },
  { phase: "confirmed", max: 10, min: 5, title: "Payment Successful ✓", subtitle: "Thank you! We have received your payment. Getting your form ready…", chip: "Step 5 of 6" },
  { phase: "action", max: 5, min: -1, title: "Please fill the remaining details", subtitle: "Your form is still incomplete. We need a few more details to file your application. Opening your form in a moment — please don't leave this page.", chip: "Step 6 of 6" },
];

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

  // Determine current phase from rotating 5-second windows.
  const step =
    PHASE_STEPS.find((s) => secondsLeft <= s.max && secondsLeft > s.min) ??
    PHASE_STEPS[PHASE_STEPS.length - 1];
  const phase = step.phase;
  const ringCirc = 2 * Math.PI * 44;
  const ringProgress = ringCirc * (1 - secondsLeft / REDIRECT_SECONDS);

  const palettes: Record<Phase, {
    bg: string; border: string; accent: string; ring: string; chipBg: string; pulseBg: string; titleColor: string;
  }> = {
    processing: {
      bg: "from-sky-50 to-blue-50/60", border: "border-sky-300", accent: "text-sky-600",
      ring: "stroke-sky-500", chipBg: "bg-sky-100 text-sky-700", pulseBg: "bg-sky-400/25", titleColor: "text-sky-700",
    },
    verifying: {
      bg: "from-indigo-50 to-violet-50/60", border: "border-indigo-300", accent: "text-indigo-600",
      ring: "stroke-indigo-500", chipBg: "bg-indigo-100 text-indigo-700", pulseBg: "bg-indigo-400/25", titleColor: "text-indigo-700",
    },
    preparing: {
      bg: "from-teal-50 to-cyan-50/60", border: "border-teal-300", accent: "text-teal-600",
      ring: "stroke-teal-500", chipBg: "bg-teal-100 text-teal-700", pulseBg: "bg-teal-400/25", titleColor: "text-teal-700",
    },
    almost: {
      bg: "from-lime-50 to-green-50/60", border: "border-lime-300", accent: "text-lime-700",
      ring: "stroke-lime-500", chipBg: "bg-lime-100 text-lime-800", pulseBg: "bg-lime-400/25", titleColor: "text-lime-800",
    },
    confirmed: {
      bg: "from-emerald-50 to-green-50/60", border: "border-emerald-300", accent: "text-emerald-600",
      ring: "stroke-emerald-500", chipBg: "bg-emerald-100 text-emerald-700", pulseBg: "bg-emerald-400/25", titleColor: "text-emerald-700",
    },
    action: {
      bg: "from-amber-50 to-orange-50", border: "border-amber-400", accent: "text-brand-red",
      ring: "stroke-brand-red", chipBg: "bg-amber-100 text-amber-800", pulseBg: "bg-brand-red/20", titleColor: "text-brand-navy",
    },
  };
  const palette = palettes[phase];

  const Icon = ({ phase }: { phase: Phase }) => {
    switch (phase) {
      case "processing": return <Loader2 className={`w-20 h-20 ${palette.accent} animate-spin`} />;
      case "verifying": return <ShieldCheck className={`w-20 h-20 ${palette.accent}`} />;
      case "preparing": return <FileText className={`w-20 h-20 ${palette.accent}`} />;
      case "almost": return <Clock className={`w-20 h-20 ${palette.accent}`} />;
      case "confirmed": return <CheckCircle2 className={`w-20 h-20 ${palette.accent} drop-shadow`} />;
      case "action": return <AlertCircle className={`w-20 h-20 ${palette.accent} motion-safe:animate-pulse`} />;
    }
  };

  return (
    <div>
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 bg-gradient-to-b from-slate-50 to-white">
      <Card
        className={`w-full max-w-lg border-2 ${palette.border} bg-gradient-to-br ${palette.bg} shadow-2xl overflow-hidden transition-colors duration-700`}
      >
        <div className="p-8 sm:p-10 flex flex-col items-center text-center">
          <div className={`text-[10px] uppercase tracking-[0.18em] font-bold px-3 py-1 rounded-full ${palette.chipBg} mb-6 transition-colors duration-500`}>
            {step.chip}
          </div>

          {/* Center stage: ring + icon */}
          <div className="relative w-44 h-44 mb-6">
            <motion.div
              aria-hidden
              className={`absolute inset-0 rounded-full ${palette.pulseBg} blur-xl transition-colors duration-700`}
              animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.85, 0.5] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <svg className="w-44 h-44 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" strokeWidth="6" className="stroke-slate-200" />
              <circle
                cx="50" cy="50" r="44" fill="none" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={ringCirc}
                strokeDashoffset={ringProgress}
                style={{ transition: "stroke-dashoffset 1s linear" }}
                className={`${palette.ring} transition-colors duration-700`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={phase}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <Icon phase={phase} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Phase-specific message */}
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="min-h-[110px]"
            >
              {phase === "action" && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red text-white text-[11px] uppercase tracking-widest font-bold mb-3 motion-safe:animate-pulse">
                  <Sparkles className="w-3.5 h-3.5" /> Your Form Is Incomplete
                </div>
              )}
              <h1 className={`text-2xl sm:text-3xl font-bold font-display mb-2 leading-tight ${palette.titleColor}`}>
                {step.title}
              </h1>
              <p className="text-sm text-slate-700 max-w-sm mx-auto">
                {step.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Countdown line */}
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
