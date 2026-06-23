import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  ShieldCheck,
  FileText,
  Sparkles,
  CheckCircle2,
  Lock,
  History,
} from "lucide-react";
import { getApplicationSummary } from "@/lib/payments/gateways.functions";
import { trackEvent } from "@/lib/analytics/track";
import { Button } from "@/components/ui/button";
import { TrustBlock } from "@/components/site/TrustBlock";

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

const STEPS = [
  { at: 0,  icon: ShieldCheck,  label: "Verifying payment",              sub: "Confirming transaction with bank" },
  { at: 15, icon: FileText,     label: "Preparing your application",     sub: "Setting up your secure onboarding form with your details" },
  { at: 30, icon: Sparkles,     label: "Personalising your form",        sub: "Tailoring fields to your selected service" },
  { at: 45, icon: CheckCircle2, label: "Almost ready",                   sub: "Opening your form in a moment" },
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

  const pct = Math.min(100, (elapsed / TOTAL_SECONDS) * 100);
  const remaining = Math.max(0, TOTAL_SECONDS - elapsed);
  const activeIdx = STEPS.reduce(
    (acc, s, i) => (elapsed >= s.at ? i : acc),
    0,
  );
  const baseActive = STEPS[activeIdx];
  const holding = elapsed >= TOTAL_SECONDS && !confirmed && !pendingFallback;
  const active = holding
    ? { ...baseActive, label: "Almost ready", sub: "Finalising confirmation with your bank…" }
    : baseActive;
  const ActiveIcon = active.icon;

  // SVG ring geometry
  const SIZE = 220;
  const STROKE = 10;
  const R = (SIZE - STROKE) / 2;
  const C = 2 * Math.PI * R;
  const dash = C * (pct / 100);

  return (
    <div>
      <section className="relative mx-auto max-w-xl px-4 py-12 md:py-20">
        {/* ambient background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-emerald-300/20 blur-3xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-teal-300/20 blur-3xl"
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50/60 via-white to-white shadow-[0_10px_40px_-15px_rgba(16,185,129,0.35)] p-8 md:p-12 text-center"
        >
          {/* Step pill */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-[0.14em] px-3.5 py-1.5 mb-8">
            Step {activeIdx + 1} of {STEPS.length}
          </div>

          {/* Single elegant ring with icon */}
          <div className="relative mx-auto" style={{ width: SIZE, height: SIZE }}>
            <svg width={SIZE} height={SIZE} className="-rotate-90">
              {/* track */}
              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                fill="none"
                stroke="rgb(209 250 229)"
                strokeWidth={STROKE}
              />
              {/* progress */}
              <motion.circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                fill="none"
                stroke="rgb(13 148 136)"
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={C}
                animate={{ strokeDashoffset: C - dash }}
                transition={{ duration: 0.9, ease: "linear" }}
              />
            </svg>

            {/* center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                key={active.label}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="w-24 h-24 rounded-full bg-white border border-emerald-100 shadow-sm flex items-center justify-center"
              >
                <ActiveIcon className="w-11 h-11 text-teal-700" strokeWidth={1.8} />
              </motion.div>
            </div>
          </div>

          {/* Heading + sub */}
          <motion.h1
            key={active.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-10 text-2xl md:text-[28px] font-bold font-display text-teal-900 leading-tight"
          >
            {active.label}
          </motion.h1>
          <motion.p
            key={active.sub}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-2 text-sm text-slate-600 max-w-sm mx-auto"
          >
            {active.sub}
          </motion.p>

          {/* Big seconds */}
          <div className="mt-10 flex items-end justify-center gap-2">
            <span className="text-6xl md:text-7xl font-bold font-display text-teal-700 tabular-nums leading-none">
              {remaining}
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 pb-2">
              Seconds
            </span>
          </div>

          {/* Slim progress bar */}
          <div className="mt-6 mx-auto max-w-xs h-1.5 rounded-full bg-emerald-100 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500"
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.9, ease: "linear" }}
            />
          </div>

          <p className="mt-5 text-[11px] text-slate-500">
            Please don't close or refresh this window.
          </p>

          {/* Ref */}
          <p className="mt-8 text-[11px] text-slate-400 font-mono">
            Ref:{" "}
            <span className="text-teal-800 font-semibold tracking-wider">
              {leadCode}
            </span>
          </p>

          <div className="mt-6 pt-5 border-t border-emerald-100/70 flex items-center justify-center gap-4 text-[10.5px] text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Lock className="w-3 h-3" /> End-to-end encrypted
            </span>
            <span className="text-slate-300">·</span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> ISO 27001 aligned
            </span>
          </div>
        </motion.div>
      </section>
      <TrustBlock />
    </div>
  );
}
