import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { m as motion } from "../_libs/motion.mjs";
import { l as CircleCheck, bc as Lock } from "../_libs/lucide-react.mjs";
function CountdownCard({
  totalSeconds,
  elapsed,
  steps,
  leadCode,
  holdLabel,
  holdSub
}) {
  const remaining = Math.max(0, totalSeconds - elapsed);
  const pct = Math.min(100, elapsed / totalSeconds * 100);
  const activeIdx = steps.reduce(
    (acc, s, i) => elapsed >= s.at ? i : acc,
    0
  );
  const holding = elapsed >= totalSeconds && (holdLabel || holdSub);
  const base = steps[activeIdx];
  const active = holding ? { ...base, label: holdLabel ?? base.label, sub: holdSub ?? base.sub } : base;
  const ActiveIcon = active.icon;
  const pipCols = Math.min(steps.length, 6);
  const smGridClass = pipCols <= 2 ? "sm:grid-cols-2" : pipCols === 3 ? "sm:grid-cols-3" : pipCols === 4 ? "sm:grid-cols-4" : pipCols === 5 ? "sm:grid-cols-5" : "sm:grid-cols-6";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative mx-auto max-w-2xl px-4 py-12 md:py-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 -z-10 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          className: "absolute -top-32 -left-24 w-96 h-96 rounded-full bg-brand-navy/10 blur-3xl",
          animate: { scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] },
          transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          className: "absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl",
          animate: { scale: [1.1, 1, 1.1], opacity: [0.3, 0.6, 0.3] },
          transition: { duration: 7, repeat: Infinity, ease: "easeInOut" }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        className: "rounded-3xl border border-border bg-card/85 backdrop-blur shadow-2xl p-8 md:p-12 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto w-32 h-32", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                className: "absolute inset-0 rounded-full border-[3px] border-brand-navy/10",
                animate: { rotate: 360 },
                transition: { duration: 8, repeat: Infinity, ease: "linear" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                className: "absolute inset-0 rounded-full border-[3px] border-transparent",
                style: {
                  borderTopColor: "hsl(var(--brand-navy, 215 60% 25%))",
                  borderRightColor: "hsl(var(--brand-navy, 215 60% 25%))"
                },
                animate: { rotate: 360 },
                transition: { duration: 1.8, repeat: Infinity, ease: "linear" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                className: "absolute inset-3 rounded-full border-[2px] border-transparent border-b-amber-400 border-l-amber-400",
                animate: { rotate: -360 },
                transition: { duration: 2.4, repeat: Infinity, ease: "linear" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                className: "w-14 h-14 rounded-full bg-brand-navy/5 flex items-center justify-center",
                animate: { scale: [1, 1.08, 1] },
                transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    initial: { opacity: 0, scale: 0.6, rotate: -20 },
                    animate: { opacity: 1, scale: 1, rotate: 0 },
                    transition: { duration: 0.45, ease: "easeOut" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ActiveIcon, { className: "w-7 h-7 text-brand-navy" })
                  },
                  active.label
                )
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.h1,
            {
              initial: { opacity: 0, y: 8 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.4 },
              className: "mt-8 text-2xl md:text-3xl font-bold font-display text-foreground",
              children: active.label
            },
            active.label
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.p,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { duration: 0.4, delay: 0.1 },
              className: "mt-2 text-sm text-muted-foreground",
              children: active.sub
            },
            active.sub
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-5xl font-bold font-display text-brand-navy tabular-nums", children: [
              remaining,
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl text-muted-foreground font-normal", children: "s" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 h-2 w-full rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                className: "h-full bg-gradient-to-r from-brand-navy via-brand-navy-deep to-amber-500",
                animate: { width: `${pct}%` },
                transition: { duration: 0.9, ease: "linear" }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-muted-foreground", children: "Please don't close or refresh this window." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mt-8 grid grid-cols-2 ${smGridClass} gap-3`, children: steps.map((s, i) => {
            const done = i < activeIdx;
            const isActive = i === activeIdx;
            const Icon = s.icon;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0.4 },
                animate: {
                  opacity: done || isActive ? 1 : 0.45,
                  scale: isActive ? 1.04 : 1
                },
                transition: { duration: 0.3 },
                className: `rounded-xl border px-3 py-3 text-[11px] font-medium leading-tight flex flex-col items-center gap-1.5 ${done ? "border-emerald-300 bg-emerald-50 text-emerald-700" : isActive ? "border-brand-navy bg-brand-navy/5 text-brand-navy shadow-sm" : "border-border bg-background text-muted-foreground"}`,
                children: [
                  done ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s.label })
                ]
              },
              s.label
            );
          }) }),
          leadCode && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-[11px] text-muted-foreground font-mono", children: [
            "Ref:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold tracking-wider", children: leadCode })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-[11px] text-muted-foreground inline-flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3 h-3" }),
            " End-to-end encrypted · ISO 27001 aligned"
          ] })
        ]
      }
    )
  ] });
}
export {
  CountdownCard as C
};
