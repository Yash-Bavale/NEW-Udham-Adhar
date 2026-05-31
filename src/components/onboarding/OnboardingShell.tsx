import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

type Step = 1 | 2 | 3;

export function OnboardingShell({
  leadCode,
  step,
  title,
  subtitle,
  children,
}: {
  leadCode: string;
  step: Step;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const steps: { n: Step; label: string }[] = [
    { n: 1, label: "Details" },
    { n: 2, label: "Documents" },
    { n: 3, label: "Done" },
  ];
  return (
    <section className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <div className="mb-6 text-center">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Reference <span className="font-mono">{leadCode}</span>
        </p>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-1">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">{subtitle}</p>}
      </div>

      <ol className="flex items-center justify-center gap-2 mb-8 text-xs">
        {steps.map((s, i) => {
          const done = step > s.n;
          const active = step === s.n;
          return (
            <li key={s.n} className="flex items-center gap-2">
              <span
                className={
                  "inline-flex items-center justify-center w-7 h-7 rounded-full border text-[11px] font-semibold " +
                  (done
                    ? "bg-brand-navy text-white border-brand-navy"
                    : active
                    ? "bg-background text-brand-navy border-brand-navy"
                    : "bg-background text-muted-foreground border-border")
                }
              >
                {done ? <Check className="w-3.5 h-3.5" /> : s.n}
              </span>
              <span className={active ? "font-semibold text-foreground" : "text-muted-foreground"}>{s.label}</span>
              {i < steps.length - 1 && <span className="w-8 h-px bg-border mx-1" />}
            </li>
          );
        })}
      </ol>

      <div className="rounded-2xl border border-border bg-card shadow-sm p-5 md:p-8">{children}</div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Need help? <Link to="/contact" className="text-brand-navy underline">Contact our team</Link>.
      </p>
    </section>
  );
}
