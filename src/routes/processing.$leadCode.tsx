import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ShieldCheck, FileCheck2, Lock, Sparkles, Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics/track";

export const Route = createFileRoute("/processing/$leadCode")({
  head: () => ({
    meta: [
      { title: "Generating Your Application — Please Wait" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ProcessingPage,
});

const TOTAL_SECONDS = 25;

const STEPS = [
  { at: 0, icon: ShieldCheck, label: "Securing your details" },
  { at: 6, icon: FileCheck2, label: "Validating application data" },
  { at: 12, icon: Sparkles, label: "Generating reference ID" },
  { at: 18, icon: Lock, label: "Preparing secure payment session" },
] as const;

function ProcessingPage() {
  const { leadCode } = Route.useParams();
  const navigate = useNavigate();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    trackEvent("processing_viewed", {}, { lead_id: null });
  }, []);

  useEffect(() => {
    if (elapsed >= TOTAL_SECONDS) {
      navigate({ to: "/payment/$leadCode", params: { leadCode } });
      return;
    }
    const t = setTimeout(() => setElapsed((s) => s + 1), 1000);
    return () => clearTimeout(t);
  }, [elapsed, leadCode, navigate]);

  const pct = Math.min(100, (elapsed / TOTAL_SECONDS) * 100);
  const remaining = Math.max(0, TOTAL_SECONDS - elapsed);
  const activeIdx = [...STEPS].reverse().find((s) => elapsed >= s.at);
  const activeKey = activeIdx?.label ?? STEPS[0].label;

  return (
    <section className="relative mx-auto max-w-2xl px-4 py-12 md:py-20">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-brand-navy/10 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl border border-border bg-card/80 backdrop-blur shadow-xl p-8 md:p-12 text-center"
      >
        <div className="relative mx-auto w-28 h-28">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-brand-navy/15"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-navy border-r-brand-navy"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-brand-navy animate-spin" />
          </div>
        </div>

        <motion.h1
          key={activeKey}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8 text-2xl md:text-3xl font-bold font-display text-foreground"
        >
          {activeKey}
        </motion.h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Please do not close or refresh this page.
        </p>

        <div className="mt-8">
          <div className="text-4xl font-bold font-display text-brand-navy tabular-nums">
            {remaining}s
          </div>
          <div className="mt-4 h-2 w-full rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-navy to-brand-navy-deep"
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.9, ease: "linear" }}
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Reference: <span className="font-mono">{leadCode}</span>
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STEPS.map((s, i) => {
            const done = elapsed >= (STEPS[i + 1]?.at ?? TOTAL_SECONDS);
            const active = elapsed >= s.at && !done;
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: done ? 1 : active ? 1 : 0.4, scale: active ? 1.05 : 1 }}
                className={`rounded-xl border px-3 py-3 text-[11px] font-medium leading-tight flex flex-col items-center gap-1.5 ${
                  done
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                    : active
                    ? "border-brand-navy bg-brand-navy/5 text-brand-navy"
                    : "border-border bg-background text-muted-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{s.label}</span>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-8 text-[11px] text-muted-foreground inline-flex items-center gap-1.5">
          <Lock className="w-3 h-3" /> Your data is encrypted end-to-end
        </p>
      </motion.div>
    </section>
  );
}
