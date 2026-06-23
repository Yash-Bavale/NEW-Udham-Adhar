import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  ShieldCheck,
  FileCheck2,
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
  { at: 0,  icon: ShieldCheck,  label: "Payment received securely",   sub: "Confirming transaction with bank" },
  { at: 15, icon: FileCheck2,   label: "Preparing your onboarding form", sub: "Setting up your secure form" },
  { at: 30, icon: Sparkles,     label: "Personalising your application", sub: "Tailoring fields to your service" },
  { at: 45, icon: CheckCircle2, label: "Almost ready",                sub: "Opening your form in a moment" },
] as const;

function SuccessPage() {
  const { leadCode } = Route.useParams();
  const navigate = useNavigate();
  const getSummary = useServerFn(getApplicationSummary);

  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);

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
      navigate({ to: "/payment-pending/$leadCode", params: { leadCode }, replace: true });
    })();

    return () => {
      cancelled = true;
    };
  }, [leadCode, getSummary, navigate]);

  useEffect(() => {
    if (!confirmed || error) return;
    if (elapsed >= TOTAL_SECONDS) {
      trackEvent("post_payment_auto_redirect", { leadCode, cancelled: false });
      navigate({ to: "/onboarding/$leadCode", params: { leadCode }, replace: true });
      return;
    }
    const t = setTimeout(() => setElapsed((s) => s + 1), 1000);
    return () => clearTimeout(t);
  }, [confirmed, error, elapsed, leadCode, navigate]);

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

  if (!confirmed) {
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

  const pct = Math.min(100, (elapsed / TOTAL_SECONDS) * 100);
  const remaining = Math.max(0, TOTAL_SECONDS - elapsed);
  const activeIdx = STEPS.reduce(
    (acc, s, i) => (elapsed >= s.at ? i : acc),
    0,
  );
  const active = STEPS[activeIdx];

  return (
    <div>
      <section className="relative mx-auto max-w-2xl px-4 py-12 md:py-20">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-brand-navy/10 blur-3xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl"
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-border bg-card/85 backdrop-blur shadow-2xl p-8 md:p-12 text-center"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold uppercase tracking-wider px-3 py-1 mb-6">
            <CheckCircle2 className="w-3.5 h-3.5" /> Payment Successful
          </div>

          <div className="relative mx-auto w-32 h-32">
            <motion.div
              className="absolute inset-0 rounded-full border-[3px] border-brand-navy/10"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-[3px] border-transparent"
              style={{
                borderTopColor: "hsl(var(--brand-navy, 215 60% 25%))",
                borderRightColor: "hsl(var(--brand-navy, 215 60% 25%))",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-3 rounded-full border-[2px] border-transparent border-b-emerald-400 border-l-emerald-400"
              animate={{ rotate: -360 }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-14 h-14 rounded-full bg-brand-navy/5 flex items-center justify-center"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div
                  key={active.label}
                  initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                >
                  <active.icon className="w-7 h-7 text-brand-navy" />
                </motion.div>
              </motion.div>
            </div>
          </div>

          <motion.h1
            key={active.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-8 text-2xl md:text-3xl font-bold font-display text-foreground"
          >
            {active.label}
          </motion.h1>
          <motion.p
            key={active.sub}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-2 text-sm text-muted-foreground"
          >
            {active.sub}
          </motion.p>

          <div className="mt-8">
            <div className="text-5xl font-bold font-display text-brand-navy tabular-nums">
              {remaining}<span className="text-2xl text-muted-foreground font-normal">s</span>
            </div>
            <div className="mt-5 h-2 w-full rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-brand-navy via-brand-navy-deep to-emerald-500"
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.9, ease: "linear" }}
              />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Please don't close or refresh this window. Your form is being prepared.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STEPS.map((s, i) => {
              const done = i < activeIdx;
              const isActive = i === activeIdx;
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0.4 }}
                  animate={{
                    opacity: done || isActive ? 1 : 0.45,
                    scale: isActive ? 1.04 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-xl border px-3 py-3 text-[11px] font-medium leading-tight flex flex-col items-center gap-1.5 ${
                    done
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : isActive
                      ? "border-brand-navy bg-brand-navy/5 text-brand-navy shadow-sm"
                      : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {done ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  <span>{s.label}</span>
                </motion.div>
              );
            })}
          </div>

          <p className="mt-8 text-[11px] text-muted-foreground inline-flex items-center gap-1.5">
            <Lock className="w-3 h-3" /> End-to-end encrypted · ISO 27001 aligned
          </p>
          <p className="mt-3 text-[11px] text-slate-400 font-mono">
            Ref: <span className="text-brand-navy font-semibold">{leadCode}</span>
          </p>
        </motion.div>
      </section>
      <TrustBlock />
    </div>
  );
}
