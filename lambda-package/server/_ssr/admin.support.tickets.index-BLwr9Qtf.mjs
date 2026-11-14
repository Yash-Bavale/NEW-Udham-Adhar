import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { _ as useRole, aE as usePermissions, j as useServerFn, aM as listStaff, ap as listServices, aN as Route$x, a3 as useRealtimeTable, a7 as isVisibleService, a4 as Tabs, a5 as TabsList, a6 as TabsTrigger, a0 as DateRangePicker, H as Button, J as Select, K as SelectTrigger, M as SelectValue, N as SelectContent, O as SelectItem, aO as SelectGroup, aP as SelectLabel, aD as Checkbox, P as Dialog, Q as DialogContent, U as DialogHeader, V as DialogTitle, I as Input, X as DialogFooter, aJ as formatMobile55 } from "./router-QgJicixe.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { i as istDateKey, f as formatIST } from "./datetime-DvkGwlJs.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { l as listTickets, g as getTicketStats, b as bulkAssignTickets, a as bulkUpdateTicketStatus, c as bulkUpdateTicketPriority, d as bulkMarkTicketsRead, D as DropdownMenu, e as DropdownMenuTrigger, f as DropdownMenuContent, h as DropdownMenuItem, i as DropdownMenuSeparator, P as PRIORITIES, T as TICKET_STATUSES, j as createTicket, s as searchCustomerOptions, k as checkOpenTicketForOrder } from "./dropdown-menu-Df4J-w-0.mjs";
import { listSupportFolders, createSupportFolder, renameSupportFolder, deleteSupportFolder, toggleTicketStar, bulkToggleTicketStar, moveTicketsToFolder, removeTicketsFromFolder } from "./support-folders.functions-DPzEQYcA.mjs";
import { S as STAGE_META } from "./computeOrderStage-D7ejTUnj.mjs";
import { d as searchOrderOptions, l as listStaffForAssignment } from "./tasks.functions-D6mit-5h.mjs";
import "../_libs/seroval.mjs";
import "./index.mjs";
import { I as Inbox, L as LoaderCircle, f as RotateCcw, aw as Plus, bT as Star, bx as Folder, bU as EllipsisVertical, bV as Pen, az as Trash2, bw as FolderPlus, g as ArrowUpDown, r as ChevronLeft, s as ChevronRight, o as UserCheck, bt as Tag, bN as Flag, X, l as CircleCheck, C as Clock, ad as Eye, E as Check, bW as MailCheck, bX as MailX, bc as Lock } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/cookie-es.mjs";
import "node:stream";
import "./constants-CKRzJJF_.mjs";
import "./createSsrRpc-BO-AEXHh.mjs";
import "./server-BFjd5iLF.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./client.functions-WMvtjq1i.mjs";
import "./customer-access-core-Bd_9lLsD.mjs";
import "./brand-DLB0j9eh.mjs";
import "../_libs/tanstack__zod-adapter.mjs";
import "../_libs/zod.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "./orders-filter-CXWoZisU.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./roles-CFhgFhhh.mjs";
import "./permissions.functions-DO0h7DgB.mjs";
import "./client-BX5UfqqR.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/lovable.dev__webhooks-js.mjs";
import "../_libs/lovable.dev__email-js.mjs";
import "./registry-DV_lUXjY.mjs";
import "../_libs/react-email__html.mjs";
import "../_libs/react-email__head.mjs";
import "../_libs/react-email__preview.mjs";
import "../_libs/react-email__body.mjs";
import "../_libs/react-email__container.mjs";
import "../_libs/react-email__heading.mjs";
import "../_libs/react-email__text.mjs";
import "../_libs/react-email__section.mjs";
import "../_libs/react-email__button.mjs";
import "../_libs/react-email__hr.mjs";
import "../_libs/date-fns.mjs";
import "../_libs/react-day-picker.mjs";
import "../_libs/date-fns__tz.mjs";
import "./consultation-asWR5IET.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
function AddTicketDialog({
  open: controlled,
  onOpenChange,
  defaultCustomerId = null,
  defaultCustomerLabel = null,
  defaultApplicationId = null,
  defaultApplicationLabel = null,
  triggerLabel = "New Ticket",
  onCreated
}) {
  const [internal, setInternal] = reactExports.useState(false);
  const open = controlled ?? internal;
  const setOpen = (v) => {
    if (controlled === void 0) setInternal(v);
    onOpenChange?.(v);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    controlled === void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen(true),
        className: "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium",
        style: { background: "var(--admin-accent)", color: "var(--admin-accent-fg)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }),
          triggerLabel
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Body,
      {
        onClose: () => setOpen(false),
        defaultCustomerId,
        defaultCustomerLabel,
        defaultApplicationId,
        defaultApplicationLabel,
        onCreated
      }
    )
  ] });
}
function Body({
  onClose,
  defaultCustomerId,
  defaultCustomerLabel,
  defaultApplicationId,
  defaultApplicationLabel,
  onCreated
}) {
  const qc = useQueryClient();
  const createFn = useServerFn(createTicket);
  const custFn = useServerFn(searchCustomerOptions);
  const orderFn = useServerFn(searchOrderOptions);
  const staffFn = useServerFn(listStaffForAssignment);
  const [subject, setSubject] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [priority, setPriority] = reactExports.useState("medium");
  const [category, setCategory] = reactExports.useState(
    defaultApplicationId ? "order_related" : "technical"
  );
  const [attachmentUrl, setAttachmentUrl] = reactExports.useState("");
  const [assignedTo, setAssignedTo] = reactExports.useState("");
  const [customerId, setCustomerId] = reactExports.useState(defaultCustomerId);
  const [customerLabel, setCustomerLabel] = reactExports.useState(defaultCustomerLabel);
  const [customerEmail, setCustomerEmail] = reactExports.useState(null);
  const [custQ, setCustQ] = reactExports.useState("");
  const [orderId, setOrderId] = reactExports.useState(defaultApplicationId);
  const [orderLabel, setOrderLabel] = reactExports.useState(defaultApplicationLabel);
  const [orderQ, setOrderQ] = reactExports.useState("");
  const [errors, setErrors] = reactExports.useState({});
  const [allowDuplicate, setAllowDuplicate] = reactExports.useState(false);
  const checkDupFn = useServerFn(checkOpenTicketForOrder);
  const { data: existingOpen } = useQuery({
    queryKey: ["ticket-dup", orderId],
    queryFn: () => checkDupFn({ data: { applicationId: orderId } }),
    enabled: !!orderId
  });
  const { data: staffData } = useQuery({
    queryKey: ["staff-assign"],
    queryFn: () => staffFn(),
    staleTime: 6e4
  });
  const { data: custOpts } = useQuery({
    queryKey: ["ticket-cust", custQ],
    queryFn: () => custFn({ data: { q: custQ } }),
    enabled: !customerId
  });
  const { data: orderOpts } = useQuery({
    queryKey: ["ticket-order", orderQ],
    queryFn: () => orderFn({ data: { q: orderQ } }),
    enabled: !orderId
  });
  const mut = useMutation({
    mutationFn: async () => createFn({
      data: {
        subject: subject.trim(),
        description: description.trim() || void 0,
        priority,
        assignedTo: assignedTo || null,
        customerId,
        applicationId: orderId,
        allowDuplicate,
        category,
        attachmentUrl: attachmentUrl.trim() || null
      }
    }),
    onSuccess: (res) => {
      if (res?.reused) {
        toast.success(`Reusing existing open ticket ${res.ticket_number}`);
      } else {
        toast.success(`Ticket ${res.ticket_number} created`);
      }
      qc.invalidateQueries({ queryKey: ["tickets-list"] });
      onCreated?.(res.id);
      onClose();
    },
    onError: (e) => toast.error(e?.message ?? "Failed to create ticket")
  });
  function validate() {
    const errs = {};
    if (subject.trim().length < 3) errs.subject = "Subject is required (min 3 chars).";
    if (!customerId) errs.customerId = "Customer is required.";
    else if (!customerEmail)
      errs.customerId = "This customer has no email on file. Add an email to the customer profile first.";
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
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium", style: { color: "var(--admin-fg)" }, children: "New Support Ticket" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "rounded p-1 hover:bg-[var(--admin-surface-2)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 px-4 py-4 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Customer", required: true, error: errors.customerId, children: customerId && customerLabel ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                Chip,
                {
                  label: customerLabel,
                  onClear: () => {
                    setCustomerId(null);
                    setCustomerLabel(null);
                    setCustomerEmail(null);
                    setOrderId(null);
                    setOrderLabel(null);
                  }
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                Combo,
                {
                  value: custQ,
                  onChange: setCustQ,
                  placeholder: "Search by name, mobile, email",
                  options: (custOpts?.rows ?? []).map((r) => ({
                    id: r.id,
                    label: `${r.customer_code ?? ""} — ${r.name ?? "—"}`,
                    sub: [r.primary_mobile, r.primary_email].filter(Boolean).join(" · "),
                    meta: { email: r.primary_email ?? null }
                  })),
                  onPick: (id, label, meta) => {
                    setCustomerId(id);
                    setCustomerLabel(label);
                    setCustomerEmail(meta?.email ?? null);
                  }
                }
              ) }),
              customerId && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs",
                  style: {
                    borderColor: customerEmail ? "var(--admin-border)" : "rgba(220,38,38,0.4)",
                    background: customerEmail ? "var(--admin-surface-2)" : "rgba(220,38,38,0.06)",
                    color: customerEmail ? "var(--admin-fg)" : "#b91c1c"
                  },
                  children: [
                    customerEmail ? /* @__PURE__ */ jsxRuntimeExports.jsx(MailCheck, { className: "size-3.5", style: { color: "#15803d" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MailX, { className: "size-3.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-1 uppercase tracking-wide text-[10px]", style: { color: "var(--admin-fg-muted)" }, children: "Sends to" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: customerEmail ?? "No email on file — please add one to the customer profile." })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "size-3", style: { color: "var(--admin-fg-muted)" } })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Linked Order (optional)", children: orderId && orderLabel ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                Chip,
                {
                  label: orderLabel,
                  onClear: () => {
                    setOrderId(null);
                    setOrderLabel(null);
                  }
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                Combo,
                {
                  value: orderQ,
                  onChange: setOrderQ,
                  placeholder: "Search by order code",
                  options: (orderOpts?.rows ?? []).map((r) => ({
                    id: r.id,
                    label: `${r.application_code} — ${r.service_name ?? ""}`,
                    sub: r.fulfillment_status
                  })),
                  onPick: (id, label) => {
                    setOrderId(id);
                    setOrderLabel(label);
                  }
                }
              ) }),
              orderId && existingOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-md border p-2.5 text-xs",
                  style: {
                    borderColor: "rgba(217,119,6,0.4)",
                    background: "rgba(217,119,6,0.06)",
                    color: "#92400e"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: "Open ticket already exists for this order" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Link,
                      {
                        to: "/admin/tickets/$ticketId",
                        params: { ticketId: existingOpen.id },
                        onClick: onClose,
                        className: "rounded px-1.5 py-0.5 text-[11px] font-medium underline",
                        style: { color: "#b45309" },
                        children: [
                          existingOpen.ticket_number,
                          " · ",
                          existingOpen.subject
                        ]
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "mt-2 flex items-center gap-1.5 text-[11px]", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: allowDuplicate,
                          onChange: (e) => setAllowDuplicate(e.target.checked)
                        }
                      ),
                      "Create additional ticket anyway (audited)"
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Subject", required: true, error: errors.subject, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  value: subject,
                  onChange: (e) => setSubject(e.target.value),
                  className: "w-full rounded border bg-transparent px-2.5 py-1.5 text-sm",
                  style: { borderColor: "var(--admin-border)", color: "var(--admin-fg)" },
                  placeholder: "Brief summary of the issue"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Category", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: category,
                  onChange: (e) => setCategory(e.target.value),
                  className: "w-full rounded border bg-transparent px-2 py-1.5 text-sm",
                  style: { borderColor: "var(--admin-border)", color: "var(--admin-fg)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "technical", children: "Technical work related help" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "order_related", children: "Order related help" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "suggestion_to_owner", children: "Suggestion / other help to owner" })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Description", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  value: description,
                  onChange: (e) => setDescription(e.target.value),
                  rows: 3,
                  className: "w-full rounded border bg-transparent px-2.5 py-1.5 text-sm",
                  style: { borderColor: "var(--admin-border)", color: "var(--admin-fg)" },
                  placeholder: "Describe the problem in detail"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Image / Attachment URL (optional)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  value: attachmentUrl,
                  onChange: (e) => setAttachmentUrl(e.target.value),
                  className: "w-full rounded border bg-transparent px-2.5 py-1.5 text-sm",
                  style: { borderColor: "var(--admin-border)", color: "var(--admin-fg)" },
                  placeholder: "https://…",
                  type: "url"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Priority", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    value: priority,
                    onChange: (e) => setPriority(e.target.value),
                    className: "w-full rounded border bg-transparent px-2 py-1.5 text-sm",
                    style: { borderColor: "var(--admin-border)", color: "var(--admin-fg)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "urgent", children: "Urgent" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "high", children: "High" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "medium", children: "Medium" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "low", children: "Low" })
                    ]
                  }
                ) }),
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
                ) })
              ] })
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
                      disabled: mut.isPending || !!existingOpen && !allowDuplicate,
                      onClick: () => {
                        if (validate()) mut.mutate();
                      },
                      className: "inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium disabled:opacity-50",
                      style: { background: "var(--admin-accent)", color: "var(--admin-accent-fg)" },
                      children: [
                        mut.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3 animate-spin" }),
                        existingOpen && !allowDuplicate ? "Open existing ticket instead" : "Create Ticket"
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
              onPick(o.id, o.label, o.meta);
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
const RANGE_PRESETS = [{
  value: "today",
  label: "Today"
}, {
  value: "yesterday",
  label: "Yesterday"
}, {
  value: "7d",
  label: "7 days"
}, {
  value: "15d",
  label: "15 days"
}, {
  value: "30d",
  label: "30 days"
}, {
  value: "mtd",
  label: "This month"
}, {
  value: "custom",
  label: "Custom"
}];
const BUCKETS = [{
  id: "all",
  label: "All Tickets"
}, {
  id: "need_action",
  label: "Need Action"
}, {
  id: "backlog",
  label: "Backlog"
}, {
  id: "reopened",
  label: "Reopened"
}, {
  id: "refund",
  label: "Refund"
}, {
  id: "closed",
  label: "Closed"
}];
const STATUS_PILL = {
  open: {
    bg: "bg-blue-50",
    fg: "text-blue-700",
    border: "border-blue-200",
    label: "Open"
  },
  in_progress: {
    bg: "bg-purple-50",
    fg: "text-purple-700",
    border: "border-purple-200",
    label: "In Progress"
  },
  waiting_customer: {
    bg: "bg-amber-50",
    fg: "text-amber-800",
    border: "border-amber-200",
    label: "Waiting Customer"
  },
  resolved: {
    bg: "bg-emerald-50",
    fg: "text-emerald-700",
    border: "border-emerald-200",
    label: "Resolved"
  },
  closed: {
    bg: "bg-slate-100",
    fg: "text-slate-600",
    border: "border-slate-200",
    label: "Closed"
  }
};
const PRIORITY_PILL = {
  urgent: {
    bg: "bg-rose-100",
    fg: "text-rose-800",
    border: "border-rose-300",
    label: "Urgent"
  },
  high: {
    bg: "bg-orange-50",
    fg: "text-orange-800",
    border: "border-orange-200",
    label: "High"
  },
  medium: {
    bg: "bg-blue-50",
    fg: "text-blue-700",
    border: "border-blue-200",
    label: "Medium"
  },
  low: {
    bg: "bg-slate-100",
    fg: "text-slate-600",
    border: "border-slate-200",
    label: "Low"
  }
};
const STAGE_FILTER_OPTIONS = [{
  id: "all",
  label: "All Order Stages"
}, {
  id: "payment_done",
  label: "Incomplete Form"
}, {
  id: "form_not_submitted",
  label: "Form Not Submitted Delay"
}, {
  id: "form_submitted",
  label: "Form Submitted"
}, {
  id: "technical_delay",
  label: "Technical Delay"
}, {
  id: "customer_delay",
  label: "Customer Delay"
}, {
  id: "submitted_to_govt",
  label: "Submitted to Govt"
}, {
  id: "certificate_ready",
  label: "Certificate Ready"
}, {
  id: "completed",
  label: "Completed"
}, {
  id: "closed",
  label: "Order Closed"
}];
function formatDayHeader(day) {
  const d = new Date(day);
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const yest = new Date(today);
  yest.setDate(today.getDate() - 1);
  const target = new Date(d);
  target.setHours(0, 0, 0, 0);
  const base = d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).toUpperCase();
  if (target.getTime() === today.getTime()) return `${base} · TODAY`;
  if (target.getTime() === yest.getTime()) return `${base} · YESTERDAY`;
  return base;
}
function formatAge(dateInput) {
  if (!dateInput) return "just now";
  const d = typeof dateInput === "number" && dateInput < 1e12 ? new Date(Date.now() - dateInput) : new Date(dateInput);
  if (isNaN(d.getTime())) return "just now";
  const now = /* @__PURE__ */ new Date();
  const ms = now.getTime() - d.getTime();
  if (ms < 0) return "just now";
  const todayKey = istDateKey(now);
  const targetKey = istDateKey(d);
  if (todayKey === targetKey) {
    const s = Math.floor(ms / 1e3);
    if (s < 60) return `${Math.max(1, s)}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    return `${h}h ago`;
  }
  const [tY, tM, tD] = todayKey.split("-").map(Number);
  const [cY, cM, cD] = targetKey.split("-").map(Number);
  const todayMidnight = Date.UTC(tY, tM - 1, tD);
  const targetMidnight = Date.UTC(cY, cM - 1, cD);
  const calendarDays = Math.max(1, Math.round((todayMidnight - targetMidnight) / (24 * 60 * 60 * 1e3)));
  return `${calendarDays}d ago`;
}
function getResponseStateBadge(ticket) {
  if (ticket.status === "closed" || ticket.status === "resolved") {
    return {
      label: "Closed",
      tone: "slate",
      pillClass: "bg-slate-100 text-slate-600 border-slate-200",
      dotClass: "bg-slate-400"
    };
  }
  if (ticket.is_new) {
    return {
      label: "NEW",
      tone: "rose",
      pillClass: "bg-rose-50 text-rose-700 border-rose-200 font-bold",
      dotClass: "bg-rose-600 animate-pulse"
    };
  }
  if (ticket.response_state === "awaiting_action" || ticket.is_unread) {
    return {
      label: "Action Required",
      tone: "rose",
      pillClass: "bg-rose-50 text-rose-700 border-rose-200 font-semibold",
      dotClass: "bg-rose-600 animate-pulse"
    };
  }
  if (ticket.response_state === "awaiting_customer") {
    return {
      label: "Awaiting Customer",
      tone: "amber",
      pillClass: "bg-amber-50 text-amber-800 border-amber-200 font-medium",
      dotClass: "bg-amber-500"
    };
  }
  if (ticket.response_state === "replied") {
    return {
      label: "Replied",
      tone: "emerald",
      pillClass: "bg-emerald-50 text-emerald-700 border-emerald-200 font-medium",
      dotClass: "bg-emerald-500"
    };
  }
  return {
    label: "Open",
    tone: "blue",
    pillClass: "bg-blue-50 text-blue-700 border-blue-200 font-medium",
    dotClass: "bg-blue-500"
  };
}
function SupportTicketsOperationsPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const role = useRole();
  usePermissions();
  role.hasAny(["admin", "super_admin"]);
  const listFn = useServerFn(listTickets);
  const statsFn = useServerFn(getTicketStats);
  const staffFn = useServerFn(listStaff);
  const svcFn = useServerFn(listServices);
  const bulkAssignFn = useServerFn(bulkAssignTickets);
  const bulkStatusFn = useServerFn(bulkUpdateTicketStatus);
  const bulkPriorityFn = useServerFn(bulkUpdateTicketPriority);
  const bulkReadFn = useServerFn(bulkMarkTicketsRead);
  const foldersFn = useServerFn(listSupportFolders);
  const createFolderFn = useServerFn(createSupportFolder);
  const renameFolderFn = useServerFn(renameSupportFolder);
  const deleteFolderFn = useServerFn(deleteSupportFolder);
  const toggleStarFn = useServerFn(toggleTicketStar);
  const bulkStarFn = useServerFn(bulkToggleTicketStar);
  const moveTicketsFn = useServerFn(moveTicketsToFolder);
  const removeTicketsFromFolderFn = useServerFn(removeTicketsFromFolder);
  const routeSearch = Route$x.useSearch();
  const todayKey = reactExports.useMemo(() => istDateKey(/* @__PURE__ */ new Date()), []);
  const [viewMode, setViewMode] = reactExports.useState(() => {
    if (routeSearch.isStarred) return "starred";
    if (routeSearch.folderId) return "folder";
    return "all";
  });
  const [activeFolderId, setActiveFolderId] = reactExports.useState(() => routeSearch.folderId ?? null);
  const [createFolderOpen, setCreateFolderOpen] = reactExports.useState(false);
  const [newFolderName, setNewFolderName] = reactExports.useState("");
  const [newFolderColor, setNewFolderColor] = reactExports.useState("slate");
  const [folderToRename, setFolderToRename] = reactExports.useState(null);
  const [renameInput, setRenameInput] = reactExports.useState("");
  const [renameColor, setRenameColor] = reactExports.useState("slate");
  const [folderToDelete, setFolderToDelete] = reactExports.useState(null);
  const [datePreset, setDatePreset] = reactExports.useState(() => {
    if (routeSearch.preset && ["today", "yesterday", "7d", "15d", "30d", "mtd", "custom"].includes(routeSearch.preset)) {
      return routeSearch.preset;
    }
    if (routeSearch.dateFrom && routeSearch.dateFrom !== istDateKey(/* @__PURE__ */ new Date())) return "custom";
    return "today";
  });
  const [bucket, setBucketState] = reactExports.useState(() => {
    if (routeSearch.bucket && ["all", "need_action", "backlog", "reopened", "refund", "closed"].includes(routeSearch.bucket)) {
      return routeSearch.bucket;
    }
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("bhs_support_active_bucket");
        if (saved && ["all", "need_action", "backlog", "reopened", "refund", "closed"].includes(saved)) {
          return saved;
        }
      } catch {
      }
    }
    return "need_action";
  });
  const setBucket = reactExports.useCallback((newBucket) => {
    setBucketState(newBucket);
    try {
      sessionStorage.setItem("bhs_support_active_bucket", newBucket);
    } catch {
    }
    navigate({
      search: ((prev) => ({
        ...prev,
        bucket: newBucket
      })),
      replace: true
    });
  }, [navigate]);
  const [search, setSearch] = reactExports.useState(routeSearch.search ?? "");
  const [debouncedSearch, setDebouncedSearch] = reactExports.useState(routeSearch.search ?? "");
  const [statusFilter, setStatusFilter] = reactExports.useState(routeSearch.status ?? "all");
  const [responseStateFilter, setResponseStateFilter] = reactExports.useState(routeSearch.responseState ?? "all");
  const [priorityFilter, setPriorityFilter] = reactExports.useState(routeSearch.priority ?? "all");
  const [assignedTo, setAssignedTo] = reactExports.useState(routeSearch.assignedTo ?? "all");
  const [serviceId, setServiceId] = reactExports.useState(routeSearch.serviceId ?? "all");
  const [stageFilter, setStageFilter] = reactExports.useState(routeSearch.stage ?? "all");
  const [dateFrom, setDateFrom] = reactExports.useState(() => {
    if (routeSearch.dateFrom) return routeSearch.dateFrom;
    if (routeSearch.preset === "yesterday") return istDateKey(new Date(Date.now() - 864e5));
    if (routeSearch.preset === "7d") return istDateKey(new Date(Date.now() - 6 * 864e5));
    if (routeSearch.preset === "15d") return istDateKey(new Date(Date.now() - 14 * 864e5));
    if (routeSearch.preset === "30d") return istDateKey(new Date(Date.now() - 29 * 864e5));
    if (routeSearch.preset === "custom") return "";
    return todayKey;
  });
  const [dateTo, setDateTo] = reactExports.useState(() => {
    if (routeSearch.dateTo) return routeSearch.dateTo;
    if (routeSearch.preset === "yesterday") return istDateKey(new Date(Date.now() - 864e5));
    if (routeSearch.preset === "custom") return "";
    return todayKey;
  });
  const [sortField, setSortField] = reactExports.useState("last_activity");
  const [page, setPage] = reactExports.useState(1);
  const pageSize = 50;
  const [selectedTicketIds, setSelectedTicketIds] = reactExports.useState([]);
  const [addTicketOpen, setAddTicketOpen] = reactExports.useState(false);
  const applyDatePreset = reactExports.useCallback((p) => {
    setDatePreset(p);
    const now = /* @__PURE__ */ new Date();
    const tKey = istDateKey(now);
    if (p === "today") {
      setDateFrom(tKey);
      setDateTo(tKey);
    } else if (p === "yesterday") {
      const yKey = istDateKey(new Date(now.getTime() - 864e5));
      setDateFrom(yKey);
      setDateTo(yKey);
    } else if (p === "7d") {
      const startKey = istDateKey(new Date(now.getTime() - 6 * 864e5));
      setDateFrom(startKey);
      setDateTo(tKey);
    } else if (p === "15d") {
      const startKey = istDateKey(new Date(now.getTime() - 14 * 864e5));
      setDateFrom(startKey);
      setDateTo(tKey);
    } else if (p === "30d") {
      const startKey = istDateKey(new Date(now.getTime() - 29 * 864e5));
      setDateFrom(startKey);
      setDateTo(tKey);
    } else if (p === "mtd") {
      const ist = new Date(now.getTime() + 5.5 * 3600 * 1e3);
      const monthStart = new Date(Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), 1));
      setDateFrom(istDateKey(monthStart));
      setDateTo(tKey);
    }
  }, []);
  const dateRangeValue = reactExports.useMemo(() => ({
    from: dateFrom ? new Date(dateFrom.includes("T") ? dateFrom : `${dateFrom}T00:00:00+05:30`) : void 0,
    to: dateTo ? new Date(dateTo.includes("T") ? dateTo : `${dateTo}T23:59:59+05:30`) : void 0
  }), [dateFrom, dateTo]);
  reactExports.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);
  reactExports.useEffect(() => {
    if (routeSearch.status) {
      if (routeSearch.status === "closed") setBucket("closed");
      else if (routeSearch.status === "open" || routeSearch.status === "need_action") setBucket("need_action");
      else setStatusFilter(routeSearch.status);
    }
    if (routeSearch.responseState) setResponseStateFilter(routeSearch.responseState);
    if (routeSearch.priority) setPriorityFilter(routeSearch.priority);
    if (routeSearch.assignedTo) setAssignedTo(routeSearch.assignedTo);
    if (routeSearch.serviceId) setServiceId(routeSearch.serviceId);
    if (routeSearch.stage) setStageFilter(routeSearch.stage);
    if (routeSearch.search) setSearch(routeSearch.search);
    if (routeSearch.preset && ["today", "yesterday", "7d", "15d", "30d", "mtd", "custom"].includes(routeSearch.preset)) {
      applyDatePreset(routeSearch.preset);
    }
    if (routeSearch.dateFrom) setDateFrom(routeSearch.dateFrom);
    if (routeSearch.dateTo) setDateTo(routeSearch.dateTo);
  }, [routeSearch, applyDatePreset]);
  reactExports.useEffect(() => {
    setPage(1);
    setSelectedTicketIds([]);
  }, [bucket, debouncedSearch, statusFilter, responseStateFilter, priorityFilter, assignedTo, serviceId, stageFilter, dateFrom, dateTo, sortField]);
  const invalidate = () => {
    qc.invalidateQueries({
      queryKey: ["support-tickets-ops"]
    });
    qc.invalidateQueries({
      queryKey: ["support-ticket-stats"]
    });
  };
  useRealtimeTable("support_tickets", invalidate);
  useRealtimeTable("ticket_replies", invalidate);
  const {
    data: staffData
  } = useQuery({
    queryKey: ["admin.staff"],
    queryFn: () => staffFn()
  });
  const staffProfiles = reactExports.useMemo(() => {
    if (Array.isArray(staffData)) return staffData;
    if (Array.isArray(staffData?.profiles)) return staffData.profiles;
    if (Array.isArray(staffData?.staff)) return staffData.staff;
    return [];
  }, [staffData]);
  const {
    data: svcData
  } = useQuery({
    queryKey: ["admin.services.list"],
    queryFn: () => svcFn()
  });
  const servicesList = reactExports.useMemo(() => {
    if (Array.isArray(svcData)) return svcData;
    if (Array.isArray(svcData?.rows)) return svcData.rows;
    if (Array.isArray(svcData?.services)) return svcData.services;
    return [];
  }, [svcData]);
  const groupedServices = reactExports.useMemo(() => {
    const raw = servicesList;
    const activeOnly = raw.filter((s) => isVisibleService(s));
    const map = /* @__PURE__ */ new Map();
    for (const s of activeOnly) {
      const webId = s.website_id || s.website?.id || "main";
      const webName = s.website?.name || s.website?.domain || "Main Website";
      const domain = s.website?.domain || "";
      if (!map.has(webId)) {
        map.set(webId, {
          websiteName: webName,
          domain,
          services: []
        });
      }
      map.get(webId).services.push(s);
    }
    return Array.from(map.entries()).map(([id, group]) => ({
      id,
      ...group
    }));
  }, [servicesList]);
  const {
    data: statsData
  } = useQuery({
    queryKey: ["support-ticket-stats"],
    queryFn: () => statsFn(),
    refetchInterval: 15e3
  });
  const queryPayload = reactExports.useMemo(() => {
    const isCustomView = viewMode === "folder" || viewMode === "starred";
    let effectiveStatus = void 0;
    let effectiveStatuses = void 0;
    let effectiveRespState = "all";
    let effectiveDateFrom = dateFrom || void 0;
    let effectiveDateTo = dateTo || void 0;
    if (isCustomView) {
      effectiveStatuses = void 0;
      effectiveStatus = void 0;
      effectiveRespState = "all";
      effectiveDateFrom = datePreset === "custom" ? dateFrom || void 0 : void 0;
      effectiveDateTo = datePreset === "custom" ? dateTo || void 0 : void 0;
    } else if (bucket === "all") {
      effectiveStatuses = void 0;
      effectiveStatus = void 0;
      effectiveRespState = "all";
      effectiveDateFrom = dateFrom || void 0;
    } else if (bucket === "need_action") {
      effectiveStatuses = ["open", "in_progress", "waiting_customer"];
      effectiveRespState = "all";
      effectiveDateFrom = void 0;
    } else if (bucket === "reopened") {
      effectiveStatuses = void 0;
      effectiveRespState = "all";
      effectiveDateFrom = dateFrom || void 0;
    } else if (bucket === "refund") {
      effectiveStatuses = void 0;
      effectiveRespState = "all";
      effectiveDateFrom = dateFrom || void 0;
    } else if (bucket === "closed") {
      effectiveStatuses = ["resolved", "closed"];
      effectiveDateFrom = dateFrom || void 0;
    }
    if (statusFilter !== "all") {
      effectiveStatus = statusFilter;
      effectiveStatuses = void 0;
    }
    if (responseStateFilter !== "all") {
      effectiveRespState = responseStateFilter;
    }
    return {
      isStarred: viewMode === "starred" ? true : void 0,
      folderId: viewMode === "folder" && activeFolderId ? activeFolderId : void 0,
      page,
      pageSize,
      q: debouncedSearch,
      bucket: isCustomView ? "all" : bucket,
      status: effectiveStatus,
      statuses: isCustomView ? void 0 : effectiveStatuses,
      responseState: effectiveRespState,
      priority: priorityFilter === "all" ? void 0 : priorityFilter,
      assignedTo: assignedTo === "all" ? void 0 : assignedTo,
      serviceId: serviceId === "all" ? void 0 : serviceId,
      stage: stageFilter === "all" ? void 0 : stageFilter,
      dateFrom: effectiveDateFrom,
      dateTo: effectiveDateTo,
      sort: sortField,
      scope: "all"
    };
  }, [page, pageSize, debouncedSearch, bucket, statusFilter, responseStateFilter, priorityFilter, assignedTo, serviceId, stageFilter, dateFrom, dateTo, datePreset, sortField, viewMode, activeFolderId]);
  const {
    data,
    isLoading,
    isFetching
  } = useQuery({
    queryKey: ["support-tickets-ops", queryPayload],
    queryFn: () => listFn({
      data: queryPayload
    })
  });
  const tickets = data?.tickets ?? [];
  const total = data?.total ?? 0;
  const groups = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const t of tickets) {
      const dateVal = bucket === "closed" ? t.closed_at || t.updated_at || t.created_at : t.created_at;
      const key = istDateKey(new Date(dateVal));
      const arr = map.get(key) ?? [];
      arr.push(t);
      map.set(key, arr);
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [tickets, bucket]);
  const {
    data: foldersData,
    refetch: refetchFolders
  } = useQuery({
    queryKey: ["support-ticket-folders"],
    queryFn: () => foldersFn()
  });
  const folders = foldersData?.folders ?? [];
  const starredCount = foldersData?.starredCount ?? 0;
  const toggleStarMutation = useMutation({
    mutationFn: (variables) => toggleStarFn({
      data: variables
    }),
    onSuccess: (res) => {
      invalidate();
      refetchFolders();
      toast.success(res.isStarred ? "Ticket starred" : "Ticket unstarred");
    },
    onError: (e) => toast.error(e.message)
  });
  const bulkStarMutation = useMutation({
    mutationFn: (variables) => bulkStarFn({
      data: variables
    }),
    onSuccess: (res) => {
      invalidate();
      refetchFolders();
      setSelectedTicketIds([]);
      const isStarred = res.isStarred ?? res.star;
      toast.success(isStarred ? `${res.count} tickets starred` : `${res.count} tickets unstarred`);
    },
    onError: (e) => toast.error(e.message)
  });
  const moveTicketsMutation = useMutation({
    mutationFn: (variables) => moveTicketsFn({
      data: variables
    }),
    onSuccess: (res) => {
      invalidate();
      refetchFolders();
      setSelectedTicketIds([]);
      toast.success(`${res.count} ticket(s) moved to folder`);
    },
    onError: (e) => toast.error(e.message)
  });
  const removeTicketsMutation = useMutation({
    mutationFn: (variables) => removeTicketsFromFolderFn({
      data: variables
    }),
    onSuccess: (res) => {
      invalidate();
      refetchFolders();
      setSelectedTicketIds([]);
      toast.success(`${res.count} ticket(s) removed from folder`);
    },
    onError: (e) => toast.error(e.message)
  });
  const createFolderMutation = useMutation({
    mutationFn: (variables) => createFolderFn({
      data: variables
    }),
    onSuccess: (res) => {
      refetchFolders();
      setCreateFolderOpen(false);
      setNewFolderName("");
      toast.success(`Folder "${res.folder.name}" created`);
    },
    onError: (e) => toast.error(e.message)
  });
  const renameFolderMutation = useMutation({
    mutationFn: (variables) => renameFolderFn({
      data: variables
    }),
    onSuccess: (res) => {
      refetchFolders();
      setFolderToRename(null);
      toast.success(`Folder renamed to "${res.folder.name}"`);
    },
    onError: (e) => toast.error(e.message)
  });
  const deleteFolderMutation = useMutation({
    mutationFn: (folderId) => deleteFolderFn({
      data: {
        folderId
      }
    }),
    onSuccess: () => {
      refetchFolders();
      invalidate();
      if (activeFolderId === folderToDelete?.id) {
        setViewMode("all");
        setActiveFolderId(null);
        navigate({
          search: ((prev) => ({
            ...prev,
            isStarred: void 0,
            folderId: void 0
          })),
          replace: true
        });
      }
      setFolderToDelete(null);
      toast.success("Folder deleted (tickets preserved)");
    },
    onError: (e) => toast.error(e.message)
  });
  const assignMutation = useMutation({
    mutationFn: (assignedTo2) => bulkAssignFn({
      data: {
        ticketIds: selectedTicketIds,
        assignedTo: assignedTo2
      }
    }),
    onSuccess: (r) => {
      toast.success(`${r.count} tickets assigned successfully`);
      setSelectedTicketIds([]);
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  const statusMutation = useMutation({
    mutationFn: (status) => bulkStatusFn({
      data: {
        ticketIds: selectedTicketIds,
        status
      }
    }),
    onSuccess: (r) => {
      toast.success(`${r.count} tickets status updated`);
      setSelectedTicketIds([]);
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  const priorityMutation = useMutation({
    mutationFn: (priority) => bulkPriorityFn({
      data: {
        ticketIds: selectedTicketIds,
        priority
      }
    }),
    onSuccess: (r) => {
      toast.success(`${r.count} tickets priority updated`);
      setSelectedTicketIds([]);
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  const readMutation = useMutation({
    mutationFn: () => bulkReadFn({
      data: {
        ticketIds: selectedTicketIds
      }
    }),
    onSuccess: (r) => {
      toast.success(`${r.count} tickets marked as read`);
      setSelectedTicketIds([]);
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  const handleResetFilters = () => {
    setViewMode("all");
    setActiveFolderId(null);
    setBucket("need_action");
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setResponseStateFilter("all");
    setPriorityFilter("all");
    setAssignedTo("all");
    setServiceId("all");
    setStageFilter("all");
    applyDatePreset("today");
    setSortField("last_activity");
    setPage(1);
    setSelectedTicketIds([]);
    navigate({
      search: ((prev) => ({
        ...prev,
        isStarred: void 0,
        folderId: void 0
      })),
      replace: true
    });
  };
  const isFiltering = viewMode !== "all" || bucket !== "need_action" || search !== "" || statusFilter !== "all" || responseStateFilter !== "all" || priorityFilter !== "all" || assignedTo !== "all" || serviceId !== "all" || stageFilter !== "all" || datePreset !== "today" || dateFrom !== "" && dateFrom !== todayKey || dateTo !== "" && dateTo !== todayKey || sortField !== "last_activity";
  const colCount = 14;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 space-y-4 w-full min-w-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2.5 rounded-xl bg-[#1e3a5f] text-white shadow-sm flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Inbox, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-slate-900 tracking-tight", children: "Support / Tickets" }),
          isFetching && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full animate-pulse", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3 animate-spin text-indigo-600" }),
            " Updating…"
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tabs, { value: datePreset, onValueChange: (v) => applyDatePreset(v), children: /* @__PURE__ */ jsxRuntimeExports.jsx(TabsList, { className: "h-9", children: RANGE_PRESETS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: p.value, className: "text-xs px-2.5", children: p.label }, p.value)) }) }),
        datePreset === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsx(DateRangePicker, { value: dateRangeValue, onChange: (range) => {
          if (!range.from) {
            setDateFrom("");
            setDateTo("");
          } else {
            setDateFrom(istDateKey(range.from));
            setDateTo(range.to ? istDateKey(range.to) : istDateKey(range.from));
          }
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => {
          invalidate();
          toast.success("Refreshing tickets…");
        }, disabled: isFetching, className: "h-9 gap-1.5 text-xs text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border-slate-200 shadow-2xs", title: "Refresh tickets", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: `size-3.5 ${isFetching && !isLoading ? "animate-spin text-indigo-600" : "text-slate-500"}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Refresh" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => setAddTicketOpen(true), className: "h-9 px-4 text-xs font-semibold bg-[#1e3a5f] hover:bg-[#152b47] text-white shadow-xs rounded-lg transition-all", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5 mr-1.5" }),
          "New Ticket"
        ] }),
        isFiltering && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handleResetFilters, className: "inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "size-3.5" }),
          " Reset Filters"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1", children: BUCKETS.map((b) => {
      const active = viewMode === "all" && bucket === b.id;
      let count = 0;
      let subBadge = "";
      if (b.id === "all") {
        count = statsData?.total ?? 0;
      } else if (b.id === "need_action") {
        count = statsData?.need_action ?? statsData?.open ?? 0;
      } else if (b.id === "backlog") {
        count = statsData?.backlog ?? 0;
      } else if (b.id === "reopened") {
        count = statsData?.reopened ?? 0;
      } else if (b.id === "refund") {
        count = statsData?.refund ?? 0;
      } else if (b.id === "closed") {
        count = statsData?.closed ?? 0;
      }
      const themeMap = {
        all: {
          bg: "bg-white",
          border: "border-slate-200",
          activeBorder: "ring-2 ring-slate-900 border-slate-900 bg-slate-50",
          text: "text-slate-600",
          countColor: "text-slate-900",
          icon: "📁"
        },
        need_action: {
          bg: "bg-blue-50/40 hover:bg-blue-50",
          border: "border-blue-100",
          activeBorder: "ring-2 ring-blue-600 border-blue-500 bg-blue-50",
          text: "text-blue-700",
          countColor: "text-blue-700",
          icon: "📬"
        },
        backlog: {
          bg: "bg-orange-50/50 hover:bg-orange-50",
          border: "border-orange-100",
          activeBorder: "ring-2 ring-orange-600 border-orange-500 bg-orange-50",
          text: "text-orange-800",
          countColor: "text-orange-800",
          icon: "⏳"
        },
        reopened: {
          bg: "bg-violet-50/50 hover:bg-violet-50",
          border: "border-violet-100",
          activeBorder: "ring-2 ring-violet-600 border-violet-500 bg-violet-50",
          text: "text-violet-700",
          countColor: "text-violet-700",
          icon: "🔥"
        },
        refund: {
          bg: "bg-amber-50/50 hover:bg-amber-50",
          border: "border-amber-100",
          activeBorder: "ring-2 ring-amber-600 border-amber-500 bg-amber-50",
          text: "text-amber-800",
          countColor: "text-amber-800",
          icon: "💳"
        },
        closed: {
          bg: "bg-emerald-50/40 hover:bg-emerald-50",
          border: "border-emerald-100",
          activeBorder: "ring-2 ring-emerald-600 border-emerald-500 bg-emerald-50",
          text: "text-emerald-700",
          countColor: "text-emerald-700",
          icon: "✅"
        }
      };
      const theme = themeMap[b.id] ?? themeMap.all;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
        setViewMode("all");
        setActiveFolderId(null);
        setBucket(b.id);
        setStatusFilter("all");
        setResponseStateFilter("all");
        setPage(1);
      }, className: `p-3 rounded-xl text-left transition-all border shadow-2xs cursor-pointer flex flex-col justify-between ${theme.bg} ${active ? theme.activeBorder : theme.border}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-1 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[11px] font-semibold truncate ${theme.text}`, children: b.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs opacity-75", children: theme.icon })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-xl font-extrabold tracking-tight ${theme.countColor}`, children: count.toLocaleString("en-IN") }),
          subBadge
        ] })
      ] }, b.id);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl border border-slate-200 bg-white shadow-2xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
          setViewMode("all");
          setActiveFolderId(null);
          navigate({
            search: ((prev) => ({
              ...prev,
              isStarred: void 0,
              folderId: void 0
            })),
            replace: true
          });
        }, className: `inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold transition-all ${viewMode === "all" ? "bg-slate-900 text-white shadow-xs" : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Inbox, { className: "size-3.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "All Tickets" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
          setViewMode("starred");
          setActiveFolderId(null);
          navigate({
            search: ((prev) => ({
              ...prev,
              isStarred: true,
              folderId: void 0
            })),
            replace: true
          });
        }, className: `inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold transition-all ${viewMode === "starred" ? "bg-amber-500 text-white shadow-xs" : "bg-amber-50/60 text-amber-800 hover:bg-amber-100 hover:text-amber-900 border border-amber-200"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `size-3.5 ${viewMode === "starred" ? "fill-white" : "fill-amber-400 text-amber-500"}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Starred" }),
          starredCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-1.5 py-0.2 rounded-full text-[10px] font-bold ${viewMode === "starred" ? "bg-white/20 text-white" : "bg-amber-200/80 text-amber-900"}`, children: starredCount })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-px bg-slate-200 mx-1 hidden sm:block" }),
        folders.map((f) => {
          const isFolderActive = viewMode === "folder" && activeFolderId === f.id;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group inline-flex items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => {
              setViewMode("folder");
              setActiveFolderId(f.id);
              navigate({
                search: ((prev) => ({
                  ...prev,
                  isStarred: void 0,
                  folderId: f.id
                })),
                replace: true
              });
            }, className: `inline-flex items-center gap-1.5 h-8 pl-3 pr-2 rounded-lg text-xs font-semibold transition-all ${isFolderActive ? "bg-indigo-600 text-white shadow-xs" : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: `size-3.5 ${isFolderActive ? "text-white" : "text-indigo-500"}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "max-w-[130px] truncate", children: f.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `px-1.5 py-0.2 rounded-full text-[10px] font-bold ${isFolderActive ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-700"}`, children: f.ticket_count ?? 0 })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: `h-8 px-1 rounded-r-lg -ml-1 flex items-center justify-center transition-colors ${isFolderActive ? "text-white/80 hover:text-white hover:bg-indigo-700" : "text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"}`, title: `Manage folder ${f.name}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { className: "size-3" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "w-40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => {
                  setFolderToRename(f);
                  setRenameInput(f.name);
                  setRenameColor(f.color || "slate");
                }, className: "text-xs cursor-pointer", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "size-3.5 mr-2 text-slate-500" }),
                  "Rename Folder"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => setFolderToDelete({
                  id: f.id,
                  name: f.name
                }), className: "text-xs text-rose-600 focus:text-rose-600 cursor-pointer", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5 mr-2 text-rose-500" }),
                  "Delete Folder"
                ] })
              ] })
            ] })
          ] }, f.id);
        })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", size: "sm", variant: "outline", onClick: () => {
        setNewFolderName("");
        setNewFolderColor("slate");
        setCreateFolderOpen(true);
      }, className: "h-8 px-2.5 text-xs font-semibold text-slate-700 border-slate-200 hover:bg-slate-50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FolderPlus, { className: "size-3.5 mr-1.5 text-indigo-600" }),
        "New Folder"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-slate-200 bg-white p-2.5 sm:p-3 shadow-2xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: serviceId, onValueChange: (v) => {
          setServiceId(v);
          setPage(1);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8 w-[150px] text-xs bg-slate-50/60 border-slate-200 hover:bg-slate-50 font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Services" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "max-h-[380px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", className: "font-bold text-slate-700", children: "All Services" }),
            groupedServices.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectGroup, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectLabel, { className: "px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50/80 rounded-md my-1 flex items-center gap-1", children: "Udyam Aadhar Services" }),
              g.services.map((svc) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: svc.id, className: "pl-3 text-xs", children: svc.service_name }, svc.id))
            ] }, g.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: stageFilter, onValueChange: (v) => {
          setStageFilter(v);
          setPage(1);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8 w-[145px] text-xs bg-slate-50/60 border-slate-200 hover:bg-slate-50 font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Order Stages" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: STAGE_FILTER_OPTIONS.map((st) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: st.id, children: st.label }, st.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: priorityFilter, onValueChange: (v) => {
          setPriorityFilter(v);
          setPage(1);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8 w-[125px] text-xs bg-slate-50/60 border-slate-200 hover:bg-slate-50 font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Priorities" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Priorities" }),
            PRIORITIES.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p, children: PRIORITY_PILL[p].label }, p))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: statusFilter, onValueChange: (v) => {
          setStatusFilter(v);
          setPage(1);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8 w-[130px] text-xs bg-slate-50/60 border-slate-200 hover:bg-slate-50 font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Statuses" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Statuses" }),
            TICKET_STATUSES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: STATUS_PILL[s].label }, s))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: assignedTo, onValueChange: (v) => {
          setAssignedTo(v);
          setPage(1);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8 w-[130px] text-xs bg-slate-50/60 border-slate-200 hover:bg-slate-50 font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Staff" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Staff" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "unassigned", children: "❌ Unassigned" }),
            staffProfiles.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: s.id, children: [
              "👤 ",
              s.display_name || s.name || s.email
            ] }, s.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: responseStateFilter, onValueChange: (v) => {
          setResponseStateFilter(v);
          setPage(1);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8 w-[140px] text-xs bg-slate-50/60 border-slate-200 hover:bg-slate-50 font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Responses" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Responses" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "new", children: "NEW (Unreplied)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "unread", children: "Unread by Staff" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "awaiting_action", children: "Awaiting Action" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "awaiting_customer", children: "Awaiting Customer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "replied", children: "Staff Replied" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "closed", children: "Closed" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: sortField, onValueChange: (v) => setSortField(v), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectTrigger, { className: "h-8 w-[155px] text-xs bg-slate-50/60 border-slate-200 hover:bg-slate-50 font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "w-3.5 h-3.5 mr-1 text-slate-500 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Sort order" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "last_activity", children: "Latest Activity First" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "newest", children: "Created (Newest)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "oldest", children: "Created (Oldest)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "highest_priority", children: "Highest Priority" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "unassigned", children: "Unassigned First" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "updated", children: "Recently Updated" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-slate-500 shrink-0 ml-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-slate-700 whitespace-nowrap", children: [
          total.toLocaleString("en-IN"),
          " ",
          total === 1 ? "ticket" : "tickets"
        ] }),
        total > pageSize && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setPage((p) => Math.max(1, p - 1)), disabled: page <= 1 || isLoading, className: "size-7 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-600", "aria-label": "Previous page", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "size-3.5" }) }),
          Array.from({
            length: Math.min(5, Math.ceil(total / pageSize))
          }, (_, i) => {
            const pNum = i + 1;
            return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setPage(pNum), className: `size-7 rounded-md text-xs font-medium transition-all ${page === pNum ? "bg-slate-900 text-white font-bold" : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"}`, children: pNum }, pNum);
          }),
          Math.ceil(total / pageSize) > 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1 text-slate-400", children: "…" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setPage(Math.ceil(total / pageSize)), className: `size-7 rounded-md text-xs font-medium ${page === Math.ceil(total / pageSize) ? "bg-slate-900 text-white font-bold" : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"}`, children: Math.ceil(total / pageSize) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setPage((p) => p * pageSize < total ? p + 1 : p), disabled: page * pageSize >= total || isLoading, className: "size-7 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-600", "aria-label": "Next page", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3.5" }) })
        ] })
      ] })
    ] }) }),
    selectedTicketIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-2 z-30 flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 text-sm font-medium", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-indigo-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full", children: selectedTicketIds.length }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: selectedTicketIds.length === 1 ? "Ticket Selected" : "Tickets Selected" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: (val) => assignMutation.mutate(val === "unassign" ? null : val), disabled: assignMutation.isPending, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectTrigger, { className: "h-8 text-xs bg-slate-800 border-slate-700 text-white w-[170px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "size-3.5 mr-1.5 text-indigo-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: assignMutation.isPending ? "Assigning…" : "Assign Staff…" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "unassign", children: "❌ Unassign" }),
            staffProfiles.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: s.id, children: [
              "👤 ",
              s.display_name || s.name || s.email
            ] }, s.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: (val) => statusMutation.mutate(val), disabled: statusMutation.isPending, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectTrigger, { className: "h-8 text-xs bg-slate-800 border-slate-700 text-white w-[150px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "size-3.5 mr-1.5 text-emerald-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: statusMutation.isPending ? "Updating…" : "Set Status…" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: TICKET_STATUSES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: STATUS_PILL[s].label }, s)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: (val) => priorityMutation.mutate(val), disabled: priorityMutation.isPending, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectTrigger, { className: "h-8 text-xs bg-slate-800 border-slate-700 text-white w-[140px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "size-3.5 mr-1.5 text-amber-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: priorityMutation.isPending ? "Updating…" : "Set Priority…" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: PRIORITIES.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p, children: PRIORITY_PILL[p].label }, p)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => bulkStarMutation.mutate({
          ticketIds: selectedTicketIds,
          isStarred: true
        }), disabled: bulkStarMutation.isPending, className: "h-8 text-xs bg-slate-800 border-slate-700 text-white hover:bg-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "size-3.5 mr-1 text-amber-400 fill-amber-400" }),
          "Star"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => bulkStarMutation.mutate({
          ticketIds: selectedTicketIds,
          isStarred: false
        }), disabled: bulkStarMutation.isPending, className: "h-8 text-xs bg-slate-800 border-slate-700 text-white hover:bg-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "size-3.5 mr-1 text-slate-400" }),
          "Unstar"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", disabled: moveTicketsMutation.isPending, className: "h-8 text-xs bg-slate-800 border-slate-700 text-white hover:bg-slate-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "size-3.5 mr-1.5 text-indigo-400" }),
            "Move to Folder…"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "w-52", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider", children: "Select Destination Folder" }),
            folders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 py-2 text-xs text-slate-400 italic", children: "No folders created yet" }) : folders.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => moveTicketsMutation.mutate({
              ticketIds: selectedTicketIds,
              folderId: f.id
            }), className: "text-xs cursor-pointer flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 truncate", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "size-3.5 text-indigo-600" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: f.name })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-slate-400", children: [
                "(",
                f.ticket_count ?? 0,
                ")"
              ] })
            ] }, f.id)),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => removeTicketsMutation.mutate({
              ticketIds: selectedTicketIds
            }), className: "text-xs text-rose-600 cursor-pointer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5 mr-2" }),
              " Remove from folder"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => readMutation.mutate(), disabled: readMutation.isPending, className: "h-8 text-xs bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:text-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3.5 mr-1 text-sky-400" }),
          "Mark Read"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", onClick: () => setSelectedTicketIds([]), className: "h-8 text-xs text-slate-300 hover:text-white hover:bg-slate-800", children: "Clear" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm min-w-[1250px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-[10px] uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "w-10 px-3 py-2.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: tickets.length > 0 && selectedTicketIds.length === tickets.length, onCheckedChange: (checked) => setSelectedTicketIds(checked ? tickets.map((r) => r.id) : []), "aria-label": "Select all tickets" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "w-8 px-1 py-2.5 text-center", title: "Starred" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-semibold px-3 py-2.5", children: "Ticket #" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-semibold px-3 py-2.5", children: bucket === "closed" ? "Closed Date" : "Created" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-semibold px-3 py-2.5", children: "Customer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-semibold px-3 py-2.5 min-w-[220px]", children: "Subject" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-semibold px-3 py-2.5", children: "Order & Service" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-semibold px-3 py-2.5", children: "Stage" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-semibold px-3 py-2.5", children: "Ticket Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-semibold px-3 py-2.5", children: "Response State" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-semibold px-3 py-2.5", children: "Priority" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-semibold px-3 py-2.5", children: "Assigned" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-semibold px-3 py-2.5", children: "Last Activity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "w-10 px-2 py-2.5 text-center" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: colCount, className: "px-4 py-16 text-center text-slate-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-6 animate-spin text-slate-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: "Loading support tickets…" })
        ] }) }) }),
        !isLoading && tickets.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: colCount, className: "px-4 py-16 text-center text-slate-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center max-w-sm mx-auto space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Inbox, { className: "size-6" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-slate-800", children: "No tickets found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "There are no support tickets matching your current filters." }),
          isFiltering && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: handleResetFilters, className: "mt-2 text-xs", children: "Clear Filters" })
        ] }) }) }),
        !isLoading && groups.map(([day, items]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "bg-slate-900 text-white border-b border-slate-800", children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: colCount, className: "px-3 py-2 text-[11px] font-semibold uppercase tracking-wider", children: formatDayHeader(day) }) }),
          items.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(TicketTableRow, { ticket: t, bucket, selected: selectedTicketIds.includes(t.id), folders, onToggleSelect: (id, checked) => setSelectedTicketIds((prev) => checked ? [...prev, id] : prev.filter((x) => x !== id)), onToggleStar: (id, isStarred) => toggleStarMutation.mutate({
            ticketId: id,
            isStarred
          }), onMoveToFolder: (id, folderId) => moveTicketsMutation.mutate({
            ticketIds: [id],
            folderId
          }), onRemoveFromFolder: (id) => removeTicketsMutation.mutate({
            ticketIds: [id]
          }), onOpen: (id) => {
            try {
              sessionStorage.setItem("bhs_ticket_ids_context", JSON.stringify(tickets.map((x) => x.id)));
            } catch {
            }
            navigate({
              to: `/admin/support/tickets/${id}`
            });
          } }, t.id))
        ] }, `g-${day}`))
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "block md:hidden space-y-3", children: [
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-5 animate-spin mx-auto mb-2 text-slate-400" }),
        "Loading tickets…"
      ] }),
      !isLoading && tickets.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200", children: "No tickets match your filters." }),
      !isLoading && groups.map(([day, items]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 z-10 bg-slate-900 text-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider rounded-lg shadow-xs", children: formatDayHeader(day) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: items.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(TicketMobileCard, { ticket: t, bucket, selected: selectedTicketIds.includes(t.id), folders, onToggleSelect: (id, checked) => setSelectedTicketIds((prev) => checked ? [...prev, id] : prev.filter((x) => x !== id)), onToggleStar: (id, isStarred) => toggleStarMutation.mutate({
          ticketId: id,
          isStarred
        }), onOpen: (id) => {
          try {
            sessionStorage.setItem("bhs_ticket_ids_context", JSON.stringify(tickets.map((x) => x.id)));
          } catch {
          }
          navigate({
            to: `/admin/support/tickets/${id}`
          });
        } }, t.id)) })
      ] }, `m-g-${day}`))
    ] }),
    total > pageSize && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-600 shadow-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        "Page ",
        page,
        " of ",
        Math.max(1, Math.ceil(total / pageSize)),
        " · ",
        (page - 1) * pageSize + 1,
        "–",
        Math.min(page * pageSize, total),
        " of ",
        total.toLocaleString("en-IN")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setPage((p) => Math.max(1, p - 1)), disabled: page <= 1 || isLoading, className: "inline-flex items-center gap-1 h-7 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "size-3.5" }),
          " Prev"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setPage((p) => p * pageSize < total ? p + 1 : p), disabled: page * pageSize >= total || isLoading, className: "inline-flex items-center gap-1 h-7 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium", children: [
          "Next ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3.5" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AddTicketDialog, { open: addTicketOpen, onOpenChange: setAddTicketOpen, onCreated: (id) => {
      invalidate();
      navigate({
        to: `/admin/support/tickets/${id}`
      });
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: createFolderOpen, onOpenChange: setCreateFolderOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-base font-bold text-slate-900 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FolderPlus, { className: "size-5 text-indigo-600" }),
        "Create New Folder"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-slate-700 block mb-1.5", children: "Folder Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: newFolderName, onChange: (e) => setNewFolderName(e.target.value), placeholder: "e.g. VIP Inquiries, Escalated, Urgent GST", className: "h-9 text-xs", autoFocus: true, onKeyDown: (e) => {
          if (e.key === "Enter" && newFolderName.trim()) {
            createFolderMutation.mutate({
              name: newFolderName.trim(),
              color: newFolderColor
            });
          }
        } })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex justify-end gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", size: "sm", onClick: () => setCreateFolderOpen(false), className: "text-xs", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "sm", disabled: !newFolderName.trim() || createFolderMutation.isPending, onClick: () => createFolderMutation.mutate({
          name: newFolderName.trim(),
          color: newFolderColor
        }), className: "text-xs bg-indigo-600 hover:bg-indigo-700 text-white", children: createFolderMutation.isPending ? "Creating…" : "Create Folder" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!folderToRename, onOpenChange: (open) => !open && setFolderToRename(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-base font-bold text-slate-900 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "size-5 text-indigo-600" }),
        "Rename Folder"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-semibold text-slate-700 block mb-1.5", children: "Folder Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: renameInput, onChange: (e) => setRenameInput(e.target.value), placeholder: "Folder name", className: "h-9 text-xs", autoFocus: true, onKeyDown: (e) => {
          if (e.key === "Enter" && renameInput.trim() && folderToRename) {
            renameFolderMutation.mutate({
              folderId: folderToRename.id,
              name: renameInput.trim(),
              color: renameColor
            });
          }
        } })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex justify-end gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", size: "sm", onClick: () => setFolderToRename(null), className: "text-xs", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "sm", disabled: !renameInput.trim() || renameFolderMutation.isPending, onClick: () => {
          if (folderToRename && renameInput.trim()) {
            renameFolderMutation.mutate({
              folderId: folderToRename.id,
              name: renameInput.trim(),
              color: renameColor
            });
          }
        }, className: "text-xs bg-indigo-600 hover:bg-indigo-700 text-white", children: renameFolderMutation.isPending ? "Saving…" : "Save Changes" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!folderToDelete, onOpenChange: (open) => !open && setFolderToDelete(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-base font-bold text-slate-900 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-5 text-rose-600" }),
        "Delete Folder"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-2 text-xs text-slate-600", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "Are you sure you want to delete folder ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-slate-900 font-semibold", children: folderToDelete?.name }),
          "?"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Safe deletion guarantee:" }),
          " Deleting this folder will NOT delete any underlying emails, tickets, attachments, or conversation history. Tickets will simply return to the default unorganized view."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex justify-end gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", size: "sm", onClick: () => setFolderToDelete(null), className: "text-xs", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "sm", disabled: deleteFolderMutation.isPending, onClick: () => {
          if (folderToDelete) {
            deleteFolderMutation.mutate(folderToDelete.id);
          }
        }, className: "text-xs bg-rose-600 hover:bg-rose-700 text-white", children: deleteFolderMutation.isPending ? "Deleting…" : "Delete Folder" })
      ] })
    ] }) })
  ] });
}
function TicketTableRow({
  ticket,
  bucket,
  selected,
  folders,
  onToggleSelect,
  onToggleStar,
  onMoveToFolder,
  onRemoveFromFolder,
  onOpen
}) {
  const statusPill = STATUS_PILL[ticket.status] ?? STATUS_PILL.open;
  const priorityPill = PRIORITY_PILL[ticket.priority] ?? PRIORITY_PILL.medium;
  const responseBadge = getResponseStateBadge(ticket);
  const stage = ticket.order_stage;
  const stageMeta = stage ? STAGE_META[stage] : null;
  const stageToneMap = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    blue: "bg-sky-50 text-sky-700 border-sky-200",
    sky: "bg-sky-50 text-sky-700 border-sky-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200"
  };
  const stageTone = stageToneMap[stageMeta?.tone ?? "emerald"] ?? "bg-slate-100 text-slate-700 border-slate-200";
  const isUnreadOrNew = ticket.is_unread || ticket.is_new;
  const displayDate = bucket === "closed" && ticket.closed_at ? ticket.closed_at : ticket.created_at;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: `border-t border-slate-100 hover:bg-slate-50/70 cursor-pointer transition-colors ${selected ? "bg-indigo-50/40" : isUnreadOrNew ? "bg-blue-50/20" : ""}`, onClick: (e) => {
    if (e.target.closest("input,a,button,select,textarea,label,[data-no-row-click]")) return;
    const sel = typeof window !== "undefined" ? window.getSelection?.() : null;
    if (sel && sel.toString().trim().length > 0) return;
    onOpen(ticket.id);
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "w-10 px-3 py-2.5 text-center", "data-no-row-click": true, onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: !!selected, onCheckedChange: (v) => onToggleSelect?.(ticket.id, !!v), "aria-label": `Select ticket ${ticket.ticket_number}` }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "w-8 px-1 py-2.5 text-center", "data-no-row-click": true, onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onToggleStar?.(ticket.id, !ticket.is_starred), className: "size-7 rounded-md flex items-center justify-center transition-colors mx-auto text-slate-300 hover:text-amber-500", title: ticket.is_starred ? "Unstar ticket" : "Star ticket", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `size-4 transition-transform hover:scale-110 ${ticket.is_starred ? "fill-amber-400 text-amber-500" : "text-slate-300 hover:text-amber-400"}` }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 font-mono text-[12px] whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
      ticket.is_unread && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-2 rounded-full bg-blue-600 shrink-0", title: "Unread customer message" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/support/tickets/$ticketId", params: {
        ticketId: ticket.id
      }, className: "font-bold text-indigo-600 hover:text-indigo-800 hover:underline", children: ticket.ticket_number }),
      ticket.is_new && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase tracking-wide bg-rose-600 text-white", children: "NEW" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 text-[11px] text-slate-600 whitespace-nowrap leading-tight", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: formatIST(displayDate, {
          dateOnly: true
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-slate-400", children: [
          formatIST(displayDate, {
            timeOnly: true
          }),
          " IST"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200", title: bucket === "closed" ? "Time since closed" : "Time since ticket created", children: formatAge(displayDate) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2.5 min-w-[170px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-900 leading-tight text-[13px]", children: ticket.customer_name ?? "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 font-mono mt-0.5 truncate max-w-[190px]", children: ticket.customer_email ?? ticket.ticket_email ?? "—" }),
      ticket.customer_mobile && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-400 mt-0.5", children: formatMobile55(ticket.customer_mobile) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-2.5 max-w-[280px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[13px] leading-snug truncate ${isUnreadOrNew ? "font-bold text-slate-950" : "font-normal text-slate-700"}`, title: ticket.subject || "(no subject)", children: ticket.subject || "(no subject)" }),
        ticket.folder_name && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0", title: `In folder: ${ticket.folder_name}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "size-2.5 text-indigo-500" }),
          ticket.folder_name
        ] })
      ] }),
      ticket.description && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400 truncate mt-0.5", children: ticket.description })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 min-w-[150px] whitespace-nowrap", children: ticket.application_code ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/orders/$orderId", params: {
        orderId: ticket.application_id
      }, className: "font-mono text-xs font-semibold text-indigo-600 hover:underline inline-flex items-center gap-1", "data-no-row-click": true, onClick: (e) => e.stopPropagation(), children: ticket.application_code }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 truncate max-w-[170px] mt-0.5", children: ticket.service_name ?? "—" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-400 italic", children: "No linked order" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 whitespace-nowrap", children: stageMeta ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${stageTone}`, children: stageMeta.label }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 text-xs", children: "—" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusPill.bg} ${statusPill.fg} ${statusPill.border}`, children: statusPill.label }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] border ${responseBadge.pillClass}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `size-1.5 rounded-full ${responseBadge.dotClass}` }),
      responseBadge.label
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${priorityPill.bg} ${priorityPill.fg} ${priorityPill.border}`, children: priorityPill.label }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 whitespace-nowrap text-[12px]", children: ticket.assigned_name ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-slate-800", children: ticket.assigned_name }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 italic", children: "Unassigned" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2.5 whitespace-nowrap text-[11px] text-slate-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-3 text-slate-400" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        ticket.last_activity_actor === "customer" ? "Customer " : "Staff ",
        formatAge(ticket.last_activity_at)
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "w-10 px-2 py-2.5 text-center whitespace-nowrap", "data-no-row-click": true, onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "size-7 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors mx-auto", title: "Ticket options", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { className: "size-4" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "w-48", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => onOpen(ticket.id), className: "text-xs cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-3.5 mr-2 text-slate-500" }),
          " Open Ticket"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => onToggleStar?.(ticket.id, !ticket.is_starred), className: "text-xs cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `size-3.5 mr-2 ${ticket.is_starred ? "fill-amber-400 text-amber-500" : "text-slate-400"}` }),
          ticket.is_starred ? "Unstar Ticket" : "Star Ticket"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider", children: "Move to Folder" }),
        folders && folders.length > 0 ? folders.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => onMoveToFolder?.(ticket.id, f.id), className: "text-xs cursor-pointer flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 truncate", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "size-3 text-indigo-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: f.name })
          ] }),
          ticket.folder_id === f.id && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3 text-emerald-600" })
        ] }, f.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 py-1 text-[11px] text-slate-400 italic", children: "No folders created" }),
        ticket.folder_id && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => onRemoveFromFolder?.(ticket.id), className: "text-xs text-rose-600 cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5 mr-2" }),
            " Remove from folder"
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
function TicketMobileCard({
  ticket,
  bucket,
  selected,
  folders,
  onToggleSelect,
  onToggleStar,
  onOpen
}) {
  const statusPill = STATUS_PILL[ticket.status] ?? STATUS_PILL.open;
  const priorityPill = PRIORITY_PILL[ticket.priority] ?? PRIORITY_PILL.medium;
  const responseBadge = getResponseStateBadge(ticket);
  const displayDate = bucket === "closed" && ticket.closed_at ? ticket.closed_at : ticket.created_at;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: (e) => {
    if (e.target.closest("input,a,button,select,textarea,label,[data-no-row-click]")) return;
    onOpen(ticket.id);
  }, className: `p-3.5 bg-white rounded-xl border shadow-xs transition-all space-y-2.5 active:bg-slate-50 cursor-pointer ${selected ? "border-indigo-500 bg-indigo-50/40" : "border-slate-200 hover:border-slate-300"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-no-row-click": true, onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: !!selected, onCheckedChange: (v) => onToggleSelect?.(ticket.id, !!v) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "data-no-row-click": true, onClick: (e) => {
          e.stopPropagation();
          onToggleStar?.(ticket.id, !ticket.is_starred);
        }, className: "p-1 -ml-1 text-slate-300 hover:text-amber-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `size-3.5 ${ticket.is_starred ? "fill-amber-400 text-amber-500" : "text-slate-300"}` }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-bold text-indigo-600", children: ticket.ticket_number }),
        ticket.is_new && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-rose-600 text-white", children: "NEW" }),
        ticket.folder_name && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "size-2 text-indigo-500" }),
          ticket.folder_name
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-slate-400", children: formatAge(displayDate) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold text-slate-900", children: ticket.customer_name ?? "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 font-mono", children: ticket.customer_email ?? ticket.ticket_email })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-800 font-medium leading-snug line-clamp-2", children: ticket.subject || "(no subject)" }),
    ticket.application_code && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-medium text-indigo-600", children: ticket.application_code }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[150px]", children: ticket.service_name })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 pt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border ${responseBadge.pillClass}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `size-1.5 rounded-full ${responseBadge.dotClass}` }),
          responseBadge.label
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusPill.bg} ${statusPill.fg} ${statusPill.border}`, children: statusPill.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${priorityPill.bg} ${priorityPill.fg} ${priorityPill.border}`, children: priorityPill.label })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-slate-500 font-medium", children: ticket.assigned_name ? `Assigned: ${ticket.assigned_name}` : "Unassigned" })
    ] })
  ] });
}
export {
  SupportTicketsOperationsPage as component
};
