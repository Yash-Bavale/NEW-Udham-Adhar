import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { ao as Sparkles } from "../_libs/lucide-react.mjs";
function ComingSoon({
  title,
  subtitle,
  phase,
  children,
  fallbackHref,
  fallbackLabel
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", style: { color: "var(--admin-fg)" }, children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", style: { color: "var(--admin-fg-muted)" }, children: subtitle })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border p-8 flex items-start gap-4",
        style: { borderColor: "var(--admin-border)", background: "var(--admin-surface)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "size-10 shrink-0 rounded-lg flex items-center justify-center",
              style: { background: "var(--admin-accent-soft)", color: "var(--admin-accent)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", style: { color: "var(--admin-fg-muted)" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", style: { color: "var(--admin-fg)" }, children: [
              "Shipping in ",
              phase,
              "."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              "The navigation, shell, and routing for this surface are live. The full workspace lands as part of ",
              phase,
              " of the Udyam Operations OS rollout."
            ] }),
            fallbackHref && fallbackLabel && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "pt-2", children: [
              "In the meantime, use",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: fallbackHref,
                  className: "underline underline-offset-4",
                  style: { color: "var(--admin-accent)" },
                  children: fallbackLabel
                }
              ),
              "."
            ] }),
            children
          ] })
        ]
      }
    )
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsxRuntimeExports.jsx(ComingSoon, { title: "Application Pipeline", subtitle: "Drag-and-drop Kanban across every workflow column with revenue and SLA roll-ups.", phase: "5.5f", fallbackHref: "/admin/applications", fallbackLabel: "the flat Application Queue" });
export {
  SplitComponent as component
};
