import { motion } from "motion/react";
import { type LucideIcon, Lock } from "lucide-react";

export type CountdownStep = {
  at: number; // seconds elapsed when this step becomes active
  icon: LucideIcon;
  label: string;
  sub: string;
};

export function CountdownCard({
  totalSeconds,
  elapsed,
  steps,
  leadCode,
  holdLabel,
  holdSub,
}: {
  totalSeconds: number;
  elapsed: number;
  steps: readonly CountdownStep[];
  leadCode?: string;
  holdLabel?: string;
  holdSub?: string;
}) {
  const remaining = Math.max(0, totalSeconds - elapsed);
  const pct = Math.min(100, (elapsed / totalSeconds) * 100);
  const activeIdx = steps.reduce(
    (acc, s, i) => (elapsed >= s.at ? i : acc),
    0,
  );
  const holding = elapsed >= totalSeconds && (holdLabel || holdSub);
  const base = steps[activeIdx];
  const active = holding
    ? { ...base, label: holdLabel ?? base.label, sub: holdSub ?? base.sub }
    : base;

  // SVG ring geometry
  const size = 168;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (pct / 100) * circumference;
  const ActiveIcon = active.icon;

  return (
    <section className="relative mx-auto max-w-md px-4 py-10 md:py-16">
      {/* ambient background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -top-24 -left-20 w-80 h-80 rounded-full bg-emerald-300/20 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-24 -right-20 w-80 h-80 rounded-full bg-teal-200/30 blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="rounded-3xl border-2 border-emerald-300/70 bg-gradient-to-b from-emerald-50/90 via-white to-emerald-50/60 backdrop-blur shadow-[0_20px_60px_-20px_rgba(16,185,129,0.35)] px-6 py-10 md:px-10 md:py-12 text-center"
      >
        {/* Step pill */}
        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold tracking-[0.18em] uppercase">
          Step {activeIdx + 1} of {steps.length}
        </div>

        {/* SVG ring + icon */}
        <div className="relative mx-auto mt-6" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={stroke}
              fill="none"
              className="text-emerald-100"
            />
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={stroke}
              strokeLinecap="round"
              fill="none"
              className="text-emerald-500"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 0.9, ease: "linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              key={active.label}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center"
            >
              <ActiveIcon className="w-8 h-8 text-emerald-600" strokeWidth={2.2} />
            </motion.div>
          </div>
        </div>

        <motion.h1
          key={active.label}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8 text-2xl md:text-[28px] font-bold font-display text-emerald-900"
        >
          {active.label}
        </motion.h1>
        <motion.p
          key={active.sub}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-2 text-sm text-emerald-900/70 max-w-sm mx-auto"
        >
          {active.sub}
        </motion.p>

        <div className="mt-10">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-6xl font-bold font-display text-emerald-700 tabular-nums leading-none">
              {remaining}
            </span>
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-emerald-700/80">
              Seconds
            </span>
          </div>

          <div className="mt-6 h-1.5 w-full max-w-xs mx-auto rounded-full bg-emerald-100 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500"
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.9, ease: "linear" }}
            />
          </div>
        </div>

        {leadCode && (
          <p className="mt-6 text-[11px] text-emerald-900/60 font-mono">
            Ref:{" "}
            <span className="text-emerald-800 font-semibold tracking-wider">
              {leadCode}
            </span>
          </p>
        )}

        <p className="mt-3 text-[11px] text-emerald-900/50 inline-flex items-center gap-1.5">
          <Lock className="w-3 h-3" /> End-to-end encrypted · Please don't close this window
        </p>
      </motion.div>
    </section>
  );
}
