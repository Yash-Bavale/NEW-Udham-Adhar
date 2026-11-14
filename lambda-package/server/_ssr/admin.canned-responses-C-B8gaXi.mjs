import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { j as useServerFn } from "./router-QgJicixe.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { l as listCannedResponses, c as createCannedResponse, u as updateCannedResponse, d as deleteCannedResponse } from "./canned-responses.functions-Dq1BoixE.mjs";
import { S as SectionCard } from "./ui-BVv-e2FI.mjs";
import "../_libs/seroval.mjs";
import "./index.mjs";
import { L as LoaderCircle, aw as Plus, az as Trash2 } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/cookie-es.mjs";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "./constants-CKRzJJF_.mjs";
import "./createSsrRpc-BO-AEXHh.mjs";
import "./server-BFjd5iLF.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
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
import "./datetime-DvkGwlJs.mjs";
import "./orders-filter-CXWoZisU.mjs";
import "./computeOrderStage-D7ejTUnj.mjs";
import "./consultation-asWR5IET.mjs";
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
import "../_libs/motion.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function CannedResponsesPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listCannedResponses);
  const createFn = useServerFn(createCannedResponse);
  const updateFn = useServerFn(updateCannedResponse);
  const deleteFn = useServerFn(deleteCannedResponse);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["canned-responses", "all"],
    queryFn: () => listFn({
      data: {
        activeOnly: false
      }
    })
  });
  const invalidate = () => qc.invalidateQueries({
    queryKey: ["canned-responses"]
  });
  const createMut = useMutation({
    mutationFn: (payload) => createFn({
      data: {
        ...payload,
        sort_order: 0,
        is_active: true
      }
    }),
    onSuccess: () => {
      toast.success("Canned response added");
      invalidate();
    },
    onError: (e) => toast.error(e.message)
  });
  const [title, setTitle] = reactExports.useState("");
  const [body, setBody] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl space-y-4 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-semibold", style: {
        color: "var(--admin-fg)"
      }, children: "Canned Responses" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: {
        color: "var(--admin-fg-muted)"
      }, children: "Reusable reply snippets available on every ticket." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SectionCard, { title: "Add new", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "rounded border px-2 py-1.5 text-sm", style: {
          background: "var(--admin-surface-2)",
          borderColor: "var(--admin-border)",
          color: "var(--admin-fg)"
        }, placeholder: "Title (e.g. Payment received)", value: title, onChange: (e) => setTitle(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "rounded border px-2 py-1.5 text-sm", style: {
          background: "var(--admin-surface-2)",
          borderColor: "var(--admin-border)",
          color: "var(--admin-fg)"
        }, placeholder: "Category (optional)", value: category, onChange: (e) => setCategory(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
          if (!title.trim() || !body.trim()) return;
          createMut.mutate({
            title: title.trim(),
            body: body.trim(),
            category: category.trim() || void 0
          }, {
            onSuccess: () => {
              setTitle("");
              setBody("");
              setCategory("");
            }
          });
        }, disabled: createMut.isPending || !title.trim() || !body.trim(), className: "inline-flex items-center justify-center gap-1 rounded px-3 py-1.5 text-sm font-medium disabled:opacity-50", style: {
          background: "var(--admin-accent)",
          color: "var(--admin-accent-fg)"
        }, children: [
          createMut.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3" }),
          "Add"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 4, className: "mt-2 w-full rounded border px-2 py-1.5 text-sm", style: {
        background: "var(--admin-surface-2)",
        borderColor: "var(--admin-border)",
        color: "var(--admin-fg)"
      }, placeholder: "Body — this is the reply text staff can insert.", value: body, onChange: (e) => setBody(e.target.value) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { title: `All (${data?.length ?? 0})`, children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", style: {
      color: "var(--admin-fg-muted)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3 animate-spin" }),
      " Loading…"
    ] }) : !data || data.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", style: {
      color: "var(--admin-fg-muted)"
    }, children: "No canned responses yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: data.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { row: c, onSaved: invalidate, updateFn, deleteFn }, c.id)) }) })
  ] });
}
function Row({
  row,
  onSaved,
  updateFn,
  deleteFn
}) {
  const [title, setTitle] = reactExports.useState(row.title);
  const [body, setBody] = reactExports.useState(row.body);
  const [category, setCategory] = reactExports.useState(row.category ?? "");
  const [active, setActive] = reactExports.useState(row.is_active);
  const updateMut = useMutation({
    mutationFn: () => updateFn({
      data: {
        id: row.id,
        title,
        body,
        category: category || null,
        is_active: active
      }
    }),
    onSuccess: () => {
      toast.success("Saved");
      onSaved();
    },
    onError: (e) => toast.error(e.message)
  });
  const deleteMut = useMutation({
    mutationFn: () => deleteFn({
      data: {
        id: row.id
      }
    }),
    onSuccess: () => {
      toast.success("Deleted");
      onSaved();
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded border p-3", style: {
    borderColor: "var(--admin-border)",
    background: "var(--admin-surface-2)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "rounded border px-2 py-1.5 text-sm md:col-span-2", style: {
        background: "var(--admin-surface)",
        borderColor: "var(--admin-border)",
        color: "var(--admin-fg)"
      }, value: title, onChange: (e) => setTitle(e.target.value) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "rounded border px-2 py-1.5 text-sm", style: {
        background: "var(--admin-surface)",
        borderColor: "var(--admin-border)",
        color: "var(--admin-fg)"
      }, value: category, onChange: (e) => setCategory(e.target.value), placeholder: "Category" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 3, className: "mt-2 w-full rounded border px-2 py-1.5 text-sm", style: {
      background: "var(--admin-surface)",
      borderColor: "var(--admin-border)",
      color: "var(--admin-fg)"
    }, value: body, onChange: (e) => setBody(e.target.value) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-2 text-xs", style: {
        color: "var(--admin-fg-muted)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: active, onChange: (e) => setActive(e.target.checked) }),
        "Active"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => deleteMut.mutate(), disabled: deleteMut.isPending, className: "inline-flex items-center gap-1 rounded border px-2 py-1 text-xs disabled:opacity-50", style: {
          borderColor: "var(--admin-border)",
          color: "#b91c1c"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3" }),
          " Delete"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => updateMut.mutate(), disabled: updateMut.isPending, className: "rounded px-3 py-1 text-xs font-medium disabled:opacity-50", style: {
          background: "var(--admin-accent)",
          color: "var(--admin-accent-fg)"
        }, children: updateMut.isPending ? "Saving…" : "Save" })
      ] })
    ] })
  ] });
}
export {
  CannedResponsesPage as component
};
