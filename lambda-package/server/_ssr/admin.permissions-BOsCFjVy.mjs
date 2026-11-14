import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { j as useServerFn, D as listStaffUsers, I as Input, H as Button, aD as Checkbox } from "./router-QgJicixe.mjs";
import { C as Card } from "./card-CjqxMl2c.mjs";
import { S as Switch } from "./switch-DIr13Mej.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { l as listWebsiteTree } from "./websites-admin.functions-Czg-Mjvg.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { w as ShieldCheck, v as Search, L as LoaderCircle, az as Trash2, aw as Plus } from "../_libs/lucide-react.mjs";
import { o as object, s as string, b as boolean, a as array } from "../_libs/zod.mjs";
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
import "./client.functions-WMvtjq1i.mjs";
import "./customer-access-core-Bd_9lLsD.mjs";
import "./brand-DLB0j9eh.mjs";
import "../_libs/tanstack__zod-adapter.mjs";
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
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
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
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/radix-ui__react-switch.mjs";
const listPermissionModules = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("c29f5abce8f2a9cb7ee57f729379634a8bd561e2b67985444ff482ae458f6843"));
const listUserPermissions = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  userId: string().uuid()
}).parse(i)).handler(createSsrRpc("8a403c3ce936ae0eb8897b725fc850af5ac7f520462b211a30858458f63d6907"));
const UpsertPermInput = object({
  userId: string().uuid(),
  moduleKey: string().min(1),
  canView: boolean(),
  canCreate: boolean(),
  canEdit: boolean(),
  canDelete: boolean(),
  scopeAll: boolean()
});
const upsertUserPermission = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => UpsertPermInput.parse(i)).handler(createSsrRpc("2a3092ab1cf8736be4399e2cada97c33d646b58aec7abf0a1c445e6d9fadf422"));
const SetScopesInput = object({
  userId: string().uuid(),
  moduleKey: string().min(1),
  scopes: array(object({
    websiteId: string().uuid().nullable().optional(),
    categoryId: string().uuid().nullable().optional(),
    serviceId: string().uuid().nullable().optional()
  }))
});
const setUserPermissionScopes = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => SetScopesInput.parse(i)).handler(createSsrRpc("707953d2d06d17bb45d798506ce509ddb8729000e6ff89a38888a4a02101e905"));
const bulkResetUserPermissions = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  userId: string().uuid(),
  grantAll: boolean().default(false)
}).parse(i)).handler(createSsrRpc("f0dbedb5ec593c70f8c791dc2d475f702ed7a73c86c64fe807681bf6377e6d84"));
const deleteUserPermissions = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  userId: string().uuid()
}).parse(i)).handler(createSsrRpc("792ee45aa2a1d4bed897cb8ac4e2e2dd9c95391e9cd29143c26854a49c16095f"));
function PermissionsPage() {
  const qc = useQueryClient();
  const staffFn = useServerFn(listStaffUsers);
  const modulesFn = useServerFn(listPermissionModules);
  const treeFn = useServerFn(listWebsiteTree);
  const staffQ = useQuery({
    queryKey: ["perm-staff"],
    queryFn: () => staffFn()
  });
  const modulesQ = useQuery({
    queryKey: ["perm-modules"],
    queryFn: () => modulesFn()
  });
  const treeQ = useQuery({
    queryKey: ["perm-tree"],
    queryFn: () => treeFn()
  });
  const [selectedUser, setSelectedUser] = reactExports.useState(null);
  const [search, setSearch] = reactExports.useState("");
  const staffList = Array.isArray(staffQ.data) ? staffQ.data : staffQ.data?.rows ?? [];
  const filteredStaff = reactExports.useMemo(() => {
    const q = search.trim().toLowerCase();
    return staffList.filter((u) => {
      if (!q) return true;
      return (u.email ?? "").toLowerCase().includes(q) || (u.display_name ?? "").toLowerCase().includes(q) || (u.full_name ?? "").toLowerCase().includes(q);
    });
  }, [staffList, search]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-6 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-5 w-5 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold", children: "Permissions" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Grant per-module View / Create / Edit / Delete rights, then optionally restrict access to specific websites, categories or services." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-3 h-fit", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search staff…", value: search, onChange: (e) => setSearch(e.target.value), className: "pl-8" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-[70vh] overflow-y-auto divide-y", children: [
          staffQ.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 text-sm text-muted-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
            " Loading…"
          ] }),
          filteredStaff.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelectedUser(u.id), className: `w-full text-left px-2 py-2 hover:bg-muted/50 rounded ${selectedUser === u.id ? "bg-primary/10" : ""}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: u.display_name || u.full_name || u.email }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: u.email }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5", children: (u.roles ?? []).join(", ") || "no role" })
          ] }, u.id)),
          !staffQ.isLoading && filteredStaff.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 text-sm text-muted-foreground", children: "No matching staff." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
        !selectedUser && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Select an employee on the left to edit permissions." }),
        selectedUser && /* @__PURE__ */ jsxRuntimeExports.jsx(PermissionMatrix, { userId: selectedUser, userRoles: staffList.find((u) => u.id === selectedUser)?.roles ?? [], modules: modulesQ.data ?? [], tree: treeQ.data, onSaved: () => qc.invalidateQueries({
          queryKey: ["user-permissions", selectedUser]
        }) })
      ] })
    ] })
  ] });
}
function defaultViewForUser(roles, moduleKey) {
  const isOps = roles.some((r) => ["admin", "super_admin", "manager", "operations", "executive"].includes(r));
  const isFinance = roles.some((r) => ["admin", "super_admin", "finance", "accounts"].includes(r));
  if (["leads", "orders", "documents", "tasks"].includes(moduleKey)) return isOps;
  if (["invoices", "payments"].includes(moduleKey)) return isFinance;
  return roles.some((r) => ["admin", "super_admin"].includes(r));
}
function PermissionMatrix({
  userId,
  userRoles,
  modules,
  tree,
  onSaved
}) {
  const qc = useQueryClient();
  const listFn = useServerFn(listUserPermissions);
  const upsertFn = useServerFn(upsertUserPermission);
  const scopesFn = useServerFn(setUserPermissionScopes);
  const resetFn = useServerFn(bulkResetUserPermissions);
  const deleteFn = useServerFn(deleteUserPermissions);
  const q = useQuery({
    queryKey: ["user-permissions", userId],
    queryFn: () => listFn({
      data: {
        userId
      }
    })
  });
  const permsByModule = /* @__PURE__ */ new Map();
  for (const p of q.data?.permissions ?? []) permsByModule.set(p.module_key, p);
  const scopesByModule = /* @__PURE__ */ new Map();
  for (const s of q.data?.scopes ?? []) {
    const arr = scopesByModule.get(s.module_key) ?? [];
    arr.push(s);
    scopesByModule.set(s.module_key, arr);
  }
  const savePerm = useMutation({
    mutationFn: (input) => upsertFn({
      data: {
        userId,
        ...input
      }
    }),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["user-permissions", userId]
      });
      qc.invalidateQueries({
        queryKey: ["my-permissions"]
      });
      onSaved();
    },
    onError: (e) => toast.error(e.message)
  });
  const bulkReset = useMutation({
    mutationFn: (grantAll) => resetFn({
      data: {
        userId,
        grantAll
      }
    }),
    onSuccess: (_r, grantAll) => {
      qc.invalidateQueries({
        queryKey: ["user-permissions", userId]
      });
      qc.invalidateQueries({
        queryKey: ["my-permissions"]
      });
      toast.success(grantAll ? "Granted full access to all modules" : "Revoked all access");
    },
    onError: (e) => toast.error(e.message)
  });
  const clearDefaults = useMutation({
    mutationFn: () => deleteFn({
      data: {
        userId
      }
    }),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["user-permissions", userId]
      });
      qc.invalidateQueries({
        queryKey: ["my-permissions"]
      });
      toast.success("Restored standard role defaults");
    },
    onError: (e) => toast.error(e.message)
  });
  if (q.isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
      " Loading permissions…"
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 pb-3 border-b", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => bulkReset.mutate(true), disabled: bulkReset.isPending, children: "Grant full access" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => clearDefaults.mutate(), disabled: clearDefaults.isPending, children: "Restore role defaults" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => bulkReset.mutate(false), disabled: bulkReset.isPending, children: "Revoke all" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs uppercase text-muted-foreground border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-2 pr-2", children: "Module" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 text-center", children: "View" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 text-center", children: "Create" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 text-center", children: "Edit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 text-center", children: "Delete" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pl-2 text-left", children: "Scope" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: modules.map((m) => {
        const defaultView = defaultViewForUser(userRoles, m.key);
        const p = permsByModule.get(m.key) ?? {
          module_key: m.key,
          can_view: defaultView,
          can_create: defaultView,
          can_edit: defaultView,
          can_delete: false,
          scope_all: true
        };
        return /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleRow, { module: m, perm: p, scopes: scopesByModule.get(m.key) ?? [], tree, onChange: (patch) => savePerm.mutate({
          moduleKey: m.key,
          canView: patch.can_view ?? p.can_view,
          canCreate: patch.can_create ?? p.can_create,
          canEdit: patch.can_edit ?? p.can_edit,
          canDelete: patch.can_delete ?? p.can_delete,
          scopeAll: patch.scope_all ?? p.scope_all
        }), onScopesChanged: async (next) => {
          await scopesFn({
            data: {
              userId,
              moduleKey: m.key,
              scopes: next
            }
          });
          qc.invalidateQueries({
            queryKey: ["user-permissions", userId]
          });
          toast.success(`Updated ${m.label} scopes`);
        } }, m.key);
      }) })
    ] }) })
  ] });
}
function ModuleRow({
  module,
  perm,
  scopes,
  tree,
  onChange,
  onScopesChanged
}) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const [draft, setDraft] = reactExports.useState(scopes.map((s) => ({
    websiteId: s.website_id,
    categoryId: s.category_id,
    serviceId: s.service_id
  })));
  const websites = tree?.websites ?? [];
  const categories = tree?.categories ?? [];
  const services = tree?.services ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: `border-b ${!perm.can_view ? "opacity-60 bg-rose-50/20" : ""}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-2 pr-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium flex items-center gap-1.5", children: [
          module.label,
          !perm.can_view && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase font-bold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded", children: "Disabled" })
        ] }),
        module.description && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: module.description })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: perm.can_view, onCheckedChange: (v) => onChange({
        can_view: !!v,
        can_create: !!v ? perm.can_create : false,
        can_edit: !!v ? perm.can_edit : false,
        can_delete: !!v ? perm.can_delete : false
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: perm.can_create, onCheckedChange: (v) => onChange({
        can_create: !!v,
        can_view: !!v ? true : perm.can_view
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: perm.can_edit, onCheckedChange: (v) => onChange({
        can_edit: !!v,
        can_view: !!v ? true : perm.can_view
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: perm.can_delete, onCheckedChange: (v) => onChange({
        can_delete: !!v,
        can_view: !!v ? true : perm.can_view
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "pl-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: perm.scope_all, onCheckedChange: (v) => onChange({
          scope_all: v,
          can_view: v ? true : perm.can_view
        }), "aria-label": "Scope all" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: perm.scope_all ? "All" : "Custom" }),
        !perm.scope_all && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", onClick: () => setExpanded((x) => !x), children: expanded ? "Hide" : `Edit (${draft.length})` })
      ] }) })
    ] }),
    !perm.scope_all && expanded && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "bg-muted/30 p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      draft.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "border rounded px-2 py-1 text-sm bg-background", value: s.websiteId ?? "", onChange: (e) => {
          const v = e.target.value || null;
          setDraft((d) => d.map((x, ix) => ix === i ? {
            ...x,
            websiteId: v,
            categoryId: null,
            serviceId: null
          } : x));
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— any website —" }),
          websites.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: w.id, children: w.name }, w.id))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "border rounded px-2 py-1 text-sm bg-background", value: s.categoryId ?? "", onChange: (e) => {
          const v = e.target.value || null;
          setDraft((d) => d.map((x, ix) => ix === i ? {
            ...x,
            categoryId: v,
            serviceId: null
          } : x));
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— any category —" }),
          categories.filter((c) => !s.websiteId || c.website_id === s.websiteId).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.id, children: c.name }, c.id))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "border rounded px-2 py-1 text-sm bg-background", value: s.serviceId ?? "", onChange: (e) => {
          const v = e.target.value || null;
          setDraft((d) => d.map((x, ix) => ix === i ? {
            ...x,
            serviceId: v
          } : x));
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— any service —" }),
          services.filter((sv) => (!s.websiteId || sv.website_id === s.websiteId) && (!s.categoryId || sv.category_id === s.categoryId)).map((sv) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: sv.id, children: sv.service_name }, sv.id))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => setDraft((d) => d.filter((_, ix) => ix !== i)), "aria-label": "Remove scope", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
      ] }, i)),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => setDraft((d) => [...d, {
          websiteId: null,
          categoryId: null,
          serviceId: null
        }]), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
          " Add scope"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => onScopesChanged(draft), children: "Save scopes" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Leave deeper fields blank to include everything under the chosen level (e.g. website only = every category & service on that site)." })
    ] }) }) })
  ] });
}
export {
  PermissionsPage as component
};
