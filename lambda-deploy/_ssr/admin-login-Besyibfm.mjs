import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { ax as Route$2t, H as Button, ay as safeNext } from "./router-QgJicixe.mjs";
import { e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { supabase } from "./client-BX5UfqqR.mjs";
import { v as verifyGoogleStaffAccess, g as getOrCreateSessionId, l as logLoginAttempt } from "./useEmployeePresence-CFzdQNvG.mjs";
import "../_libs/seroval.mjs";
import "../_libs/sonner.mjs";
import "./index.mjs";
import "../_libs/tanstack__react-query.mjs";
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
const url = "/__l5e/assets-v1/3d269b27-6d67-429f-a603-8e23e3bad63d/login-office-bg.png";
const officeBg = {
  url
};
function AdminLoginPage() {
  const navigate = useNavigate();
  const {
    next
  } = Route$2t.useSearch();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const [googleBusy, setGoogleBusy] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const goAfterAuth = () => {
    const stored = safeNext(sessionStorage.getItem("admin_login_next"));
    sessionStorage.removeItem("admin_login_next");
    const target = safeNext(next) || stored;
    window.location.href = target || "/admin";
  };
  reactExports.useEffect(() => {
    let cancelled = false;
    const checkAndRedirect = async () => {
      const {
        data,
        error: error2
      } = await supabase.auth.getUser();
      if (cancelled || error2 || !data.user) return;
      try {
        const verification = await verifyGoogleStaffAccess();
        if (!verification.authorized) {
          setError("Your account is not authorized to access this CRM. Contact your administrator.");
          await supabase.auth.signOut();
          return;
        }
        const sessionId = getOrCreateSessionId();
        await logLoginAttempt({
          data: {
            sessionId,
            loginMethod: data.user.app_metadata?.provider === "google" ? "google" : "password",
            browser: "Chrome",
            os: "Windows",
            deviceType: "Desktop"
          }
        });
        goAfterAuth();
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to verify CRM authorization");
      }
    };
    checkAndRedirect();
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await checkAndRedirect();
      }
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [navigate, next]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const {
        error: error2
      } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error2) throw error2;
      const verification = await verifyGoogleStaffAccess();
      if (!verification.authorized) {
        setError("Your account is not authorized to access this CRM.");
        await supabase.auth.signOut();
        return;
      }
      const sessionId = getOrCreateSessionId();
      await logLoginAttempt({
        data: {
          sessionId,
          loginMethod: "password",
          browser: "Chrome",
          os: "Windows",
          deviceType: "Desktop"
        }
      });
      goAfterAuth();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };
  const handleGoogleSignIn = async () => {
    setGoogleBusy(true);
    setError(null);
    try {
      const target = safeNext(next);
      if (target) sessionStorage.setItem("admin_login_next", target);
      const {
        error: oauthErr
      } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/admin-login`,
          queryParams: {
            prompt: "select_account"
          }
        }
      });
      if (oauthErr) throw oauthErr;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google authentication failed");
      setGoogleBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "relative isolate flex min-h-screen items-start justify-center overflow-hidden bg-background px-4 pb-10 pt-[16vh] text-foreground md:px-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: officeBg.url, alt: "", "aria-hidden": "true", width: 1672, height: 941, className: "absolute inset-0 -z-20 h-full w-full object-cover object-[44%_center]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 -z-10 bg-foreground/10 max-md:bg-foreground/35" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "w-full max-w-[370px] overflow-hidden rounded-lg bg-card shadow-2xl md:-translate-x-[4%]", "aria-label": "Staff sign in", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 px-7 pb-5 pt-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-base font-bold text-foreground", children: "Staff Sign In" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", onClick: handleGoogleSignIn, disabled: googleBusy || busy, variant: "outline", className: "h-9 w-full rounded-md border-border bg-card text-xs font-semibold text-foreground shadow-none hover:bg-muted", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "h-4 w-4", viewBox: "0 0 24 24", "aria-hidden": "true", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z", fill: "#4285F4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z", fill: "#34A853" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z", fill: "#FBBC05" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z", fill: "#EA4335" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: googleBusy ? "Connecting to Google…" : "Continue with Google" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-center text-[10px] font-medium uppercase text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px flex-1 bg-border" }),
        "Or sign in with password",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px flex-1 bg-border" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "staff-email", className: "mb-1 block text-[11px] font-semibold text-foreground", children: "Email / Employee ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "staff-email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), placeholder: "grow@businesshelpservices.com", className: "h-9 w-full rounded-md border border-input bg-card px-3 text-xs text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring", autoComplete: "email" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "staff-password", className: "mb-1 block text-[11px] font-semibold text-foreground", children: "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "staff-password", type: "password", required: true, minLength: 8, value: password, onChange: (e) => setPassword(e.target.value), placeholder: "••••••••", className: "h-9 w-full rounded-md border border-input bg-card px-3 text-xs text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring", autoComplete: "current-password" })
        ] }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { role: "alert", className: "rounded-md border border-destructive/25 bg-destructive/10 p-2.5 text-xs font-medium text-destructive", children: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busy || googleBusy, className: "h-9 w-full rounded-md bg-foreground text-xs font-semibold text-background hover:bg-foreground/90", children: busy ? "Signing in…" : "Sign In with Password" })
      ] })
    ] }) })
  ] });
}
export {
  AdminLoginPage as component
};
