import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Check, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { requestFormHelp } from "@/lib/onboarding/onboarding.functions";

type Step = 1 | 2 | 3;

const ALL_STEPS: { n: Step; label: string }[] = [
  { n: 1, label: "Details" },
  { n: 2, label: "Documents" },
  { n: 3, label: "Done" },
];

export function OnboardingShell({
  leadCode,
  step,
  totalSteps = 3,
  title,
  subtitle,
  children,
}: {
  leadCode: string;
  step: Step;
  totalSteps?: 2 | 3;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const STEPS = totalSteps === 2
    ? [ALL_STEPS[0], { n: 3 as Step, label: "Done" }]
    : ALL_STEPS;
  const activeIndex = STEPS.findIndex((s) => s.n === step);
  const progress = (Math.max(activeIndex, 0) / (STEPS.length - 1)) * 100;
  const displayNumber = (s: { n: Step }) => STEPS.findIndex((x) => x.n === s.n) + 1;

  const navigate = useNavigate();
  const callHelp = useServerFn(requestFormHelp);
  const [helpBusy, setHelpBusy] = useState(false);

  async function onAskHelp() {
    if (helpBusy) return;
    setHelpBusy(true);
    try {
      await callHelp({ data: { leadCode } });
    } catch {
      // Even if logging fails, take the customer to the reassurance screen.
    }
    navigate({
      to: "/onboarding/$leadCode/done",
      params: { leadCode },
      search: { help: 1 },
    });
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <div className="mb-6 text-center">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Reference <span className="font-mono">{leadCode}</span>
        </p>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-1">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">{subtitle}</p>}
      </div>

      {/* Animated progress bar */}
      <div className="mb-3 max-w-md mx-auto">
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="h-full bg-gradient-to-r from-brand-navy to-brand-navy-deep"
          />
        </div>
      </div>

      <ol className="flex items-center justify-center gap-1.5 sm:gap-2 mb-8 text-xs flex-wrap">
        {STEPS.map((s, i) => {
          const done = step > s.n;
          const active = step === s.n;
          return (
            <li key={s.n} className="flex items-center gap-1.5 sm:gap-2">
              <motion.span
                initial={false}
                animate={{ scale: active ? 1.08 : 1 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className={
                  "inline-flex items-center justify-center w-7 h-7 rounded-full border text-[11px] font-semibold " +
                  (done
                    ? "bg-brand-navy text-white border-brand-navy"
                    : active
                      ? "bg-background text-brand-navy border-brand-navy ring-4 ring-brand-navy/10"
                      : "bg-background text-muted-foreground border-border")
                }
              >
                {done ? <Check className="w-3.5 h-3.5" /> : displayNumber(s)}
              </motion.span>
              <span className={active ? "font-semibold text-foreground" : "text-muted-foreground"}>
                {s.label}
              </span>
              {i < STEPS.length - 1 && <span className="w-5 sm:w-8 h-px bg-border mx-0.5" />}
            </li>
          );
        })}
      </ol>

      <motion.div
        key={String(step)}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-border bg-card shadow-sm p-5 md:p-8"
      >
        {children}
      </motion.div>

      {step !== 3 && (
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Need help submitting the form?{" "}
          <button
            type="button"
            onClick={onAskHelp}
            disabled={helpBusy}
            className="text-brand-navy underline font-medium inline-flex items-center gap-1 disabled:opacity-60"
          >
            {helpBusy && <Loader2 className="w-3 h-3 animate-spin" />}
            Contact our team for help
          </button>
        </p>
      )}
    </section>
  );
}
