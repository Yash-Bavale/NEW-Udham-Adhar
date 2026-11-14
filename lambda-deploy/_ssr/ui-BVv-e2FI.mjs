import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { m as motion } from "../_libs/motion.mjs";
function StatCard({
  label,
  value,
  delta,
  icon,
  gradient,
  index = 0,
  loading,
  hint
}) {
  const tone = gradient === "success" ? "var(--admin-success)" : gradient === "warn" ? "var(--admin-warn)" : gradient === "danger" ? "var(--admin-danger)" : "var(--admin-primary)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, delay: index * 0.04, ease: "easeOut" },
      className: "relative rounded-lg border p-4",
      style: { background: "var(--admin-surface)", borderColor: "var(--admin-border)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-wide font-medium", style: { color: "var(--admin-fg-muted)" }, children: label }),
          icon && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md p-1.5", style: { background: "var(--admin-surface-2)", color: tone }, children: icon })
        ] }),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 h-7 w-20 animate-pulse rounded", style: { background: "var(--admin-surface-2)" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-2xl font-medium tabular-nums", style: { color: "var(--admin-fg)" }, children: typeof value === "number" ? value.toLocaleString("en-IN") : value }),
        hint && !loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[11px]", style: { color: "var(--admin-fg-muted)" }, children: hint }),
        delta && !loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs font-medium", style: { color: delta.positive ? "var(--admin-success)" : "var(--admin-danger)" }, children: [
          delta.positive ? "▲" : "▼",
          " ",
          Math.abs(delta.value),
          "%"
        ] })
      ]
    }
  );
}
function SectionCard({ title, action, children, className = "" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.section,
    {
      initial: { opacity: 0, y: 6 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
      className: `rounded-lg border ${className}`,
      style: { background: "var(--admin-surface)", borderColor: "var(--admin-border)" },
      children: [
        (title || action) && /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between px-4 py-3 border-b", style: { borderColor: "var(--admin-border)" }, children: [
          title && /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium", style: { color: "var(--admin-fg)" }, children: title }),
          action
        ] }),
        children
      ]
    }
  );
}
function TableSkeleton({ rows = 6, cols = 6 }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y", style: { borderColor: "var(--admin-border)" }, children: Array.from({ length: rows }).map((_, r) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 px-3 py-3", children: Array.from({ length: cols }).map((_2, c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "h-3 flex-1 animate-pulse rounded",
      style: { background: "var(--admin-surface-2)", animationDelay: `${(r * cols + c) * 30}ms` }
    },
    c
  )) }, r)) });
}
const STATUS_COLORS = {
  new: "bg-rose-100 text-rose-800 border border-rose-300 font-semibold dark:bg-rose-950 dark:text-rose-200",
  new_lead: "bg-rose-100 text-rose-800 border border-rose-300 font-semibold dark:bg-rose-950 dark:text-rose-200",
  lead_created: "bg-rose-100 text-rose-800 border border-rose-300 font-semibold dark:bg-rose-950 dark:text-rose-200",
  contacted: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300",
  in_progress: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  payment_pending: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
  payment_successful: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  payment_received: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  rejected: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
  cancelled: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
  pending: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
};
function StatusBadge({ status }) {
  const cls = STATUS_COLORS[status] ?? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${cls}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-1.5 rounded-full bg-current opacity-70" }),
    status.replace(/_/g, " ")
  ] });
}
function FilterChip({ active, onClick, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick,
      className: `rounded-full border px-3 py-1 text-xs font-medium transition-all ${active ? "shadow-sm" : "hover:bg-[var(--admin-surface-2)]"}`,
      style: {
        borderColor: active ? "var(--admin-accent)" : "var(--admin-border)",
        background: active ? "var(--admin-accent)" : "var(--admin-surface)",
        color: active ? "var(--admin-accent-fg)" : "var(--admin-fg)"
      },
      children
    }
  );
}
function Timeline({ items }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "relative ml-3 border-l", style: { borderColor: "var(--admin-border)" }, children: items.map((it, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.li,
    {
      initial: { opacity: 0, x: -6 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.25, delay: i * 0.02 },
      className: "relative pl-5 pb-5",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "absolute -left-[5px] top-1.5 size-2.5 rounded-full ring-4",
            style: { background: "var(--admin-accent)", boxShadow: "0 0 0 3px var(--admin-surface)" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-baseline gap-x-3 gap-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("time", { className: "text-[11px] font-medium", style: { color: "var(--admin-fg-muted)" }, children: new Date(it.time).toLocaleString("en-IN") }),
          it.type && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-[var(--admin-surface-2)] px-1.5 py-0.5 text-[10px] uppercase tracking-wide", style: { color: "var(--admin-fg-muted)" }, children: it.type })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm", style: { color: "var(--admin-fg)" }, children: it.description }),
        it.meta && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children: it.meta })
      ]
    },
    it.id
  )) });
}
export {
  FilterChip as F,
  SectionCard as S,
  TableSkeleton as T,
  Timeline as a,
  StatusBadge as b,
  StatCard as c
};
