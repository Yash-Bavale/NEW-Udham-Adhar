import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { motion } from "motion/react";

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
  // For 2-step flows (no documents), use Details + Done only.
  const STEPS = totalSteps === 2
    ? [ALL_STEPS[0], { n: 3 as Step, label: "Done" }]
    : ALL_STEPS;
  const activeIndex = STEPS.findIndex((s) => s.n === step);
  const progress = (Math.max(activeIndex, 0) / (STEPS.length - 1)) * 100;
  // Display number is the 1-based position within the (possibly collapsed) STEPS list.
  const displayNumber = (s: { n: Step }) => STEPS.findIndex((x) => x.n === s.n) + 1;
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
                animate={{
                  scale: active ? 1.08 : 1,
                  backgroundColor: done ? "hsl(var(--primary))" : active ? "hsl(var(--background))" : "hsl(var(--background))",
                }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className={
                  "inline-flex items-center justify-center w-7 h-7 rounded-full border text-[11px] font-semibold " +
                  (done
                    ? "bg-brand-navy text-white border-brand-navy"
                    : active
                      ? "text-brand-navy border-brand-navy ring-4 ring-brand-navy/10"
                      : "text-muted-foreground border-border")
                }
              >
                {done ? <Check className="w-3.5 h-3.5" /> : s.n}
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

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Need help? <Link to="/contact" className="text-brand-navy underline">Contact our team</Link>.
      </p>
    </section>
  );
}
