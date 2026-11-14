import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { j as useServerFn } from "./router-QgJicixe.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { b as createTask, l as listStaffForAssignment, s as searchLeadOptions, d as searchOrderOptions } from "./tasks.functions-D6mit-5h.mjs";
import { aw as Plus, X, L as LoaderCircle } from "../_libs/lucide-react.mjs";
function AddTaskDialog({
  open: controlled,
  onOpenChange,
  defaultLeadId = null,
  defaultApplicationId = null,
  triggerLabel = "Add Task",
  triggerClassName,
  onCreated
}) {
  const [internalOpen, setInternalOpen] = reactExports.useState(false);
  const open = controlled ?? internalOpen;
  const setOpen = (v) => {
    if (controlled === void 0) setInternalOpen(v);
    onOpenChange?.(v);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    controlled === void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen(true),
        className: triggerClassName ?? "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium",
        style: {
          background: "var(--admin-accent)",
          color: "var(--admin-accent-fg)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }),
          triggerLabel
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx(
      DialogBody,
      {
        onClose: () => setOpen(false),
        defaultLeadId,
        defaultApplicationId,
        onCreated
      }
    )
  ] });
}
function DialogBody({
  onClose,
  defaultLeadId,
  defaultApplicationId,
  onCreated
}) {
  const qc = useQueryClient();
  const createFn = useServerFn(createTask);
  const staffFn = useServerFn(listStaffForAssignment);
  const leadFn = useServerFn(searchLeadOptions);
  const orderFn = useServerFn(searchOrderOptions);
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [assignedTo, setAssignedTo] = reactExports.useState("");
  const [dueAt, setDueAt] = reactExports.useState(defaultDue());
  const [priority, setPriority] = reactExports.useState("medium");
  const [leadQuery, setLeadQuery] = reactExports.useState("");
  const [leadId, setLeadId] = reactExports.useState(defaultLeadId);
  const [orderQuery, setOrderQuery] = reactExports.useState("");
  const [orderId, setOrderId] = reactExports.useState(defaultApplicationId);
  const [errors, setErrors] = reactExports.useState({});
  const { data: staffData } = useQuery({
    queryKey: ["staff-assign"],
    queryFn: () => staffFn(),
    staleTime: 6e4
  });
  const { data: leadOpts } = useQuery({
    queryKey: ["task-lead-search", leadQuery],
    queryFn: () => leadFn({ data: { q: leadQuery } })
  });
  const { data: orderOpts } = useQuery({
    queryKey: ["task-order-search", orderQuery, leadId],
    queryFn: () => orderFn({ data: { q: orderQuery, leadId: leadId ?? void 0 } })
  });
  const selectedLead = reactExports.useMemo(
    () => leadOpts?.rows.find((r) => r.id === leadId) ?? null,
    [leadOpts, leadId]
  );
  const selectedOrder = reactExports.useMemo(
    () => orderOpts?.rows.find((r) => r.id === orderId) ?? null,
    [orderOpts, orderId]
  );
  const mut = useMutation({
    mutationFn: async () => {
      return createFn({
        data: {
          title: title.trim(),
          description: description.trim() || void 0,
          assignedTo: assignedTo || null,
          dueAt: new Date(dueAt).toISOString(),
          priority,
          leadId: leadId ?? null,
          applicationId: orderId ?? null
        }
      });
    },
    onSuccess: () => {
      toast.success("Task created");
      qc.invalidateQueries({ queryKey: ["tasks-board"] });
      onCreated?.();
      onClose();
    },
    onError: (e) => toast.error(e?.message ?? "Failed to create task")
  });
  function validate() {
    const errs = {};
    if (title.trim().length < 2) errs.title = "Title is required (min 2 chars).";
    if (!dueAt) errs.dueAt = "Due date is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }
  reactExports.useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      style: { background: "rgba(0,0,0,0.45)" },
      onClick: onClose,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "w-full max-w-lg rounded-lg border shadow-lg",
          style: { background: "var(--admin-surface)", borderColor: "var(--admin-border)" },
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "header",
              {
                className: "flex items-center justify-between border-b px-4 py-3",
                style: { borderColor: "var(--admin-border)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium", style: { color: "var(--admin-fg)" }, children: "New Task" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "rounded p-1 hover:bg-[var(--admin-surface-2)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 px-4 py-4 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Title", error: errors.title, required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  value: title,
                  onChange: (e) => setTitle(e.target.value),
                  className: "w-full rounded border bg-transparent px-2.5 py-1.5 text-sm",
                  style: { borderColor: "var(--admin-border)", color: "var(--admin-fg)" },
                  placeholder: "Call back to confirm details"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Description", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  value: description,
                  onChange: (e) => setDescription(e.target.value),
                  rows: 2,
                  className: "w-full rounded border bg-transparent px-2.5 py-1.5 text-sm",
                  style: { borderColor: "var(--admin-border)", color: "var(--admin-fg)" }
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Assign To", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    value: assignedTo,
                    onChange: (e) => setAssignedTo(e.target.value),
                    className: "w-full rounded border bg-transparent px-2 py-1.5 text-sm",
                    style: { borderColor: "var(--admin-border)", color: "var(--admin-fg)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Unassigned" }),
                      (staffData?.staff ?? []).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.id, children: s.name }, s.id))
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Priority", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    value: priority,
                    onChange: (e) => setPriority(e.target.value),
                    className: "w-full rounded border bg-transparent px-2 py-1.5 text-sm",
                    style: { borderColor: "var(--admin-border)", color: "var(--admin-fg)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "high", children: "High" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "medium", children: "Medium" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "low", children: "Low" })
                    ]
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Due Date & Time", error: errors.dueAt, required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "datetime-local",
                  value: dueAt,
                  onChange: (e) => setDueAt(e.target.value),
                  className: "w-full rounded border bg-transparent px-2.5 py-1.5 text-sm",
                  style: { borderColor: "var(--admin-border)", color: "var(--admin-fg)" }
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Link to Lead (optional)", children: selectedLead ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                Chip,
                {
                  label: `${selectedLead.lead_code} — ${selectedLead.name ?? "—"}`,
                  onClear: () => {
                    setLeadId(null);
                    setOrderId(null);
                  }
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                Combo,
                {
                  value: leadQuery,
                  onChange: setLeadQuery,
                  placeholder: "Search by name, mobile, or lead code",
                  options: (leadOpts?.rows ?? []).map((r) => ({
                    id: r.id,
                    label: `${r.lead_code} — ${r.name ?? "—"}`,
                    sub: [r.mobile, r.service].filter(Boolean).join(" · ")
                  })),
                  onPick: (id) => {
                    setLeadId(id);
                    setOrderId(null);
                  }
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Link to Order (optional)", children: selectedOrder ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                Chip,
                {
                  label: `${selectedOrder.application_code} — ${selectedOrder.service_name ?? "—"}`,
                  onClear: () => setOrderId(null)
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                Combo,
                {
                  value: orderQuery,
                  onChange: setOrderQuery,
                  placeholder: "Search by order code",
                  options: (orderOpts?.rows ?? []).map((r) => ({
                    id: r.id,
                    label: `${r.application_code} — ${r.service_name ?? "—"}`,
                    sub: r.fulfillment_status
                  })),
                  onPick: (id) => setOrderId(id)
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "footer",
              {
                className: "flex items-center justify-end gap-2 border-t px-4 py-3",
                style: { borderColor: "var(--admin-border)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: onClose,
                      className: "rounded px-3 py-1.5 text-xs font-medium",
                      style: { color: "var(--admin-fg-muted)" },
                      children: "Cancel"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      disabled: mut.isPending,
                      onClick: () => {
                        if (validate()) mut.mutate();
                      },
                      className: "inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium disabled:opacity-50",
                      style: { background: "var(--admin-accent)", color: "var(--admin-accent-fg)" },
                      children: [
                        mut.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3 animate-spin" }),
                        "Create Task"
                      ]
                    }
                  )
                ]
              }
            )
          ]
        }
      )
    }
  );
}
function Field({
  label,
  required,
  error,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block space-y-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        className: "text-[11px] font-medium uppercase tracking-wide",
        style: { color: "var(--admin-fg-muted)" },
        children: [
          label,
          required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--admin-danger)" }, children: " *" })
        ]
      }
    ),
    children,
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-[11px]", style: { color: "var(--admin-danger)" }, children: error })
  ] });
}
function Chip({ label, onClear }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center justify-between rounded border px-2.5 py-1.5 text-xs",
      style: { borderColor: "var(--admin-border)", background: "var(--admin-surface-2)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--admin-fg)" }, children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onClear,
            className: "rounded p-0.5 hover:bg-[var(--admin-surface)]",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3" })
          }
        )
      ]
    }
  );
}
function Combo({
  value,
  onChange,
  placeholder,
  options,
  onPick
}) {
  const [focused, setFocused] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        value,
        onChange: (e) => onChange(e.target.value),
        onFocus: () => setFocused(true),
        onBlur: () => setTimeout(() => setFocused(false), 150),
        placeholder,
        className: "w-full rounded border bg-transparent px-2.5 py-1.5 text-sm",
        style: { borderColor: "var(--admin-border)", color: "var(--admin-fg)" }
      }
    ),
    focused && options.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded border shadow-lg",
        style: { background: "var(--admin-surface)", borderColor: "var(--admin-border)" },
        children: options.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onMouseDown: (e) => {
              e.preventDefault();
              onPick(o.id);
              onChange("");
            },
            className: "block w-full px-3 py-1.5 text-left text-xs hover:bg-[var(--admin-surface-2)]",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "var(--admin-fg)" }, children: o.label }),
              o.sub && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px]", style: { color: "var(--admin-fg-muted)" }, children: o.sub })
            ]
          },
          o.id
        ))
      }
    )
  ] });
}
function defaultDue() {
  const d = /* @__PURE__ */ new Date();
  d.setHours(d.getHours() + 24, 0, 0, 0);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`;
}
export {
  AddTaskDialog as A
};
