import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { j as useServerFn, au as readAccessToken } from "./router-QgJicixe.mjs";
import { m as motion } from "../_libs/motion.mjs";
import { r as requestFormHelp } from "./onboarding.functions-DdT_CVNt.mjs";
import { D as Download, E as Check, L as LoaderCircle } from "../_libs/lucide-react.mjs";
const ALL_STEPS = [
  { n: 1, label: "Details" },
  { n: 2, label: "Documents" },
  { n: 3, label: "Done" }
];
function OnboardingShell({
  leadCode,
  step,
  totalSteps = 3,
  title,
  subtitle,
  sampleFormUrl,
  sampleFormLabel,
  children
}) {
  const STEPS = totalSteps === 2 ? [ALL_STEPS[0], { n: 3, label: "Done" }] : ALL_STEPS;
  const activeIndex = STEPS.findIndex((s) => s.n === step);
  const progress = Math.max(activeIndex, 0) / (STEPS.length - 1) * 100;
  const displayNumber = (s) => STEPS.findIndex((x) => x.n === s.n) + 1;
  const navigate = useNavigate();
  const callHelp = useServerFn(requestFormHelp);
  const [helpBusy, setHelpBusy] = reactExports.useState(false);
  async function onAskHelp() {
    if (helpBusy) return;
    setHelpBusy(true);
    try {
      await callHelp({ data: { leadCode, accessToken: readAccessToken(leadCode, "ob") ?? "" } });
    } catch {
    }
    navigate({
      to: "/onboarding/$leadCode/done",
      params: { leadCode },
      search: { help: 1 }
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-3xl px-4 py-8 md:py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: [
        "Reference ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: leadCode })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl font-display font-bold text-foreground mt-1", children: title }),
      subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2 max-w-xl mx-auto", children: subtitle }),
      sampleFormUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: sampleFormUrl,
          target: "_blank",
          rel: "noreferrer",
          className: "mt-3 inline-flex items-center gap-1.5 rounded-full border border-brand-navy/30 bg-brand-navy/5 px-3 py-1.5 text-xs font-semibold text-brand-navy hover:bg-brand-navy/10 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5" }),
            sampleFormLabel || "Download sample form"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 max-w-md mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { width: 0 },
        animate: { width: `${progress}%` },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        className: "h-full bg-gradient-to-r from-brand-navy to-brand-navy-deep"
      }
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "flex items-center justify-center gap-1.5 sm:gap-2 mb-8 text-xs flex-wrap", children: STEPS.map((s, i) => {
      const isLast = s.n === 3;
      const done = step > s.n || isLast && step === 3;
      const active = step === s.n && !done;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-1.5 sm:gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.span,
          {
            initial: false,
            animate: { scale: active ? 1.08 : 1 },
            transition: { type: "spring", stiffness: 280, damping: 22 },
            className: "inline-flex items-center justify-center w-7 h-7 rounded-full border text-[11px] font-semibold " + (done ? "bg-brand-navy text-white border-brand-navy" : active ? "bg-background text-brand-navy border-brand-navy ring-4 ring-brand-navy/10" : "bg-background text-muted-foreground border-border"),
            children: done ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3.5 h-3.5" }) : displayNumber(s)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: done || active ? "font-semibold text-foreground" : "text-muted-foreground", children: s.label }),
        i < STEPS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-5 sm:w-8 h-px bg-border mx-0.5" })
      ] }, s.n);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
        className: "rounded-2xl border border-border bg-card shadow-sm p-5 md:p-8",
        children
      },
      String(step)
    ),
    step !== 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-center text-xs text-muted-foreground", children: [
      "Need help submitting the form?",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: onAskHelp,
          disabled: helpBusy,
          className: "text-brand-navy underline font-medium inline-flex items-center gap-1 disabled:opacity-60",
          children: [
            helpBusy && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 animate-spin" }),
            "Contact our team for help"
          ]
        }
      )
    ] })
  ] });
}
export {
  OnboardingShell as O
};
