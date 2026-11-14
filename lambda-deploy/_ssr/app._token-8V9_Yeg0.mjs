import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link, N as Navigate } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { aF as Route$16, j as useServerFn, p as storeAccessToken, ah as SiteShell } from "./router-QgJicixe.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { o as object, s as string, n as number, _ as _enum } from "../_libs/zod.mjs";
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
import "../_libs/tanstack__query-core.mjs";
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
import "../_libs/lucide-react.mjs";
import "../_libs/date-fns.mjs";
import "../_libs/react-day-picker.mjs";
import "../_libs/date-fns__tz.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const LINK_PURPOSES = ["status", "resume", "pay", "upload", "certificate"];
const CreateInput = object({
  leadId: string().uuid(),
  applicationId: string().uuid().optional(),
  purpose: _enum(LINK_PURPOSES),
  ttlHours: number().min(1).max(24 * 30).default(72)
});
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => CreateInput.parse(i)).handler(createSsrRpc("044194b71fb61b46c1d41d35a74a8fc9431765d51c255b3af3e0f62a3ffe29f0"));
const ResolveInput = object({
  token: string().min(8).max(128)
});
const resolveApplicationLink = createServerFn({
  method: "POST"
}).inputValidator((i) => ResolveInput.parse(i)).handler(createSsrRpc("935b085390b565f0181d2bf15cefb3bfebbbe896c480ad26b69ba6a1c4caac05"));
function AppTokenPage() {
  const {
    token
  } = Route$16.useParams();
  const resolve = useServerFn(resolveApplicationLink);
  const navigate = useNavigate();
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["app-link", token],
    queryFn: () => resolve({
      data: {
        token
      }
    }),
    staleTime: 3e4
  });
  reactExports.useEffect(() => {
    if (!data || !data.ok) return;
    if (data.lead?.lead_code) storeAccessToken(data.lead.lead_code, data.accessToken);
    if (data.purpose === "resume" && data.lead?.lead_code) {
      navigate({
        to: "/onboarding/$leadCode",
        params: {
          leadCode: data.lead.lead_code
        },
        replace: true
      });
    }
  }, [data, navigate]);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SiteShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-xl px-4 py-20 text-center text-sm text-muted-foreground", children: "Loading…" }) });
  }
  if (!data?.ok) {
    const reason = data?.reason ?? "unknown";
    const labels = {
      not_found: "This link is invalid.",
      used: "This link has already been used.",
      expired: "This link has expired.",
      unknown: "This link cannot be opened."
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SiteShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-xl px-4 py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-brand-navy", children: "Link unavailable" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: labels[reason] ?? labels.unknown }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "mt-6 inline-block text-sm text-brand-red underline", children: "Go to home" })
    ] }) });
  }
  const {
    purpose,
    lead,
    application
  } = data;
  if (purpose === "pay" && lead?.lead_code) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/payment/$leadCode", params: {
      leadCode: lead.lead_code
    }, replace: true });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SiteShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-2xl px-4 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border bg-white p-8 shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Secure application link" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-2xl font-bold text-brand-navy", children: lead?.name ?? "Your application" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-6 grid grid-cols-2 gap-x-4 gap-y-3 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Order" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: application?.application_code ?? lead?.lead_code }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Service" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: lead?.service ?? "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Status" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-medium capitalize", children: application?.application_status?.replace(/_/g, " ") ?? lead?.status?.replace(/_/g, " ") ?? "—" }),
      application?.form_status && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Form" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "capitalize", children: application.form_status })
      ] }),
      application?.document_status && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-muted-foreground", children: "Documents" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "capitalize", children: application.document_status })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
      purpose === "upload" && lead?.lead_code && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/onboarding/$leadCode/documents", params: {
        leadCode: lead.lead_code
      }, className: "rounded bg-brand-navy px-4 py-2 text-sm font-medium text-white", children: "Upload documents" }),
      purpose === "status" && lead?.lead_code && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/processing/$leadCode", params: {
        leadCode: lead.lead_code
      }, className: "rounded border border-brand-navy px-4 py-2 text-sm font-medium text-brand-navy", children: "View live status" }),
      purpose === "certificate" && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", onClick: (e) => {
        e.preventDefault();
        alert("Certificate download link will be enabled after ops upload completes.");
      }, className: "rounded bg-brand-green px-4 py-2 text-sm font-medium text-white", children: "Download certificate" })
    ] })
  ] }) }) });
}
export {
  AppTokenPage as component
};
