import { Q as QueryClientProvider, u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { b as QueryClient, k as keepPreviousData } from "../_libs/tanstack__query-core.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, b as useRouterState, O as Outlet, H as HeadContent, S as Scripts, d as createFileRoute, l as lazyRouteComponent, e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { X as redirect, Y as notFound, L as isRedirect } from "../_libs/tanstack__router-core.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { I as INDIAN_STATES, L as LANGUAGES, N as NAV_LINKS, D as DISCLAIMER_TEXT, S as SERVICES } from "./constants-CKRzJJF_.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { getContentfulSeoArticle as getSanitySeoArticle, getContentfulServicePage as getSanityServicePage, getContentfulLandingPage as getSanityLandingPage, getContentfulFaqs as getSanityFaqs, listContentfulSeoPages as listSanitySeoPages } from "./client.functions-WMvtjq1i.mjs";
import { T as Toaster$1, t as toast } from "../_libs/sonner.mjs";
import { parseTokenKind } from "./customer-access-core-Bd_9lLsD.mjs";
import { BASE_URL, SITE_NAME as SITE_NAME$1, LEGAL_ENTITY, CONTACT_EMAIL } from "./brand-DLB0j9eh.mjs";
import { i as isAbortError } from "./index.mjs";
import { z as zodValidator, f as fallback } from "../_libs/tanstack__zod-adapter.mjs";
import { R as Root2, L as List, T as Trigger, C as Content } from "../_libs/radix-ui__react-tabs.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { S as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { D as Dialog$1, a as DialogPortal$1, c as DialogContent$1, f as DialogClose, d as DialogTitle$1, e as DialogDescription$1, b as DialogOverlay$1, h as DialogTrigger$1 } from "../_libs/radix-ui__react-dialog.mjs";
import { createClient } from "../_libs/supabase__supabase-js.mjs";
import { i as istDateKey, f as formatIST } from "./datetime-DvkGwlJs.mjs";
import { n as normalizeOrdersFilter, g as getOrdersQueryKey } from "./orders-filter-CXWoZisU.mjs";
import { S as STAGE_META } from "./computeOrderStage-D7ejTUnj.mjs";
import { C as Checkbox$1, a as CheckboxIndicator } from "../_libs/radix-ui__react-checkbox.mjs";
import { R as Root2$1, T as Trigger$1, P as Portal, C as Content2 } from "../_libs/radix-ui__react-popover.mjs";
import { S as Select$1, a as SelectValue$1, b as SelectGroup$1, c as SelectTrigger$1, d as SelectIcon, e as SelectPortal, f as SelectContent$1, g as SelectViewport, h as SelectItem$1, i as SelectItemIndicator, j as SelectItemText, k as SelectLabel$1, l as SelectScrollUpButton$1, m as SelectScrollDownButton$1, n as SelectSeparator$1 } from "../_libs/radix-ui__react-select.mjs";
import { h as hideMoneyFor, c as canSeeMoney, d as canApproveRefund, e as canSeeModule, b as bestAccess, A as ASSIGNABLE_ROLES } from "./roles-CFhgFhhh.mjs";
import { a as getMyPermissions } from "./permissions.functions-DO0h7DgB.mjs";
import { supabase } from "./client-BX5UfqqR.mjs";
import { R as Root } from "../_libs/radix-ui__react-label.mjs";
import { v as verifyWebhookRequest, W as WebhookError } from "../_libs/lovable.dev__webhooks-js.mjs";
import { s as sendLovableEmail } from "../_libs/lovable.dev__email-js.mjs";
import { T as TEMPLATES } from "./registry-DV_lUXjY.mjs";
import { G as Globe, M as Menu, X, B as Briefcase, a as Mail, P as Phone, b as MessageCircle, c as MapPin, R as RefreshCw, S as SquareUserRound, F as FingerprintPattern, d as Share2, D as Download, A as ArrowRight, e as ShieldAlert, L as LoaderCircle, f as RotateCcw, g as ArrowUpDown, h as LayoutGrid, I as Inbox, T as Timer, i as Flame, C as Clock, j as Server, k as PhoneForwarded, U as UserX, H as Hourglass, l as CircleCheck, m as CheckCheck, n as Scale, o as UserCheck, p as ArrowDown, q as ArrowUp, r as ChevronLeft, s as ChevronRight, t as FolderSync, u as Ticket, v as Search, w as ShieldCheck, x as House, y as ChevronDown, z as Calendar$1, E as Check, J as Users, K as LifeBuoy, N as PhoneCall, O as ChevronUp, Q as FileText, V as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { H as subMonths, t as isBefore, I as differenceInDays, f as format, J as subDays, E as startOfMonth, l as endOfMonth, F as startOfWeek, m as endOfWeek } from "../_libs/date-fns.mjs";
import { g as getDefaultClassNames, D as DayPicker } from "../_libs/react-day-picker.mjs";
import { Z as ZodError, o as object, g as number, s as string, l as literal, _ as _enum, n as number$1, b as boolean, a as array } from "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/cookie-es.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/radix-ui__react-presence.mjs";
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
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "./consultation-asWR5IET.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
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
import "../_libs/date-fns__tz.mjs";
function useServerFn(serverFn) {
  const router2 = useRouter();
  return reactExports.useCallback(async (...args) => {
    try {
      const res = await serverFn(...args);
      if (isRedirect(res)) throw res;
      return res;
    } catch (err) {
      if (isRedirect(err)) {
        err.options._fromLocation = router2.stores.location.get();
        return router2.navigate(router2.resolveRedirect(err).options);
      }
      throw err;
    }
  }, [router2, serverFn]);
}
const appCss = "/assets/styles-DUhbCEB7.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
const EMPTY = { websiteId: "", headerNav: [], footerNav: [], blocks: {} };
const SiteContentContext = reactExports.createContext(EMPTY);
function SiteContentProvider({
  value,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SiteContentContext.Provider, { value: value ?? EMPTY, children });
}
function useSiteContent() {
  return reactExports.useContext(SiteContentContext);
}
function useNav(group, fallback2) {
  const content = useSiteContent();
  const list = group === "header" ? content.headerNav : content.footerNav;
  return list.length ? list : fallback2;
}
function useBlock(key2, fallback2) {
  const { blocks } = useSiteContent();
  const raw = blocks[key2];
  return raw === void 0 || raw === null ? fallback2 : raw;
}
function useBlockItems(key2, fallback2) {
  const block = useBlock(key2, null);
  const items = block?.items;
  return Array.isArray(items) && items.length ? items : fallback2;
}
const BrandContext = reactExports.createContext(null);
const DEFAULT_BRAND = {
  websiteId: "",
  domain: "udyamadhar.in",
  siteName: "Udyam Aadhar",
  legalEntity: "Business Help Services",
  companyName: "Business Help Services",
  supportEmail: "help@businesshelpservices.com",
  supportPhone: null,
  whatsappNumber: null,
  businessHours: null,
  primaryColor: "#1e3a8a",
  logoAssetUrl: null,
  faviconAssetUrl: null,
  sampleCertificateAssetUrl: null,
  postalAddress: null,
  footerUnlockCode: null,
  legalFooterLine: "Udyam Aadhar is operated by Business Help Services, a private consultancy. We are not affiliated with, authorised by, endorsed by, or associated with any government authority or department.",
  googleSiteVerification: null,
  gtagId: null,
  baseUrl: "https://udyamadhar.in",
  isPrimary: true,
  allowAdmin: true
};
function BrandProvider({
  value,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BrandContext.Provider, { value: value ?? DEFAULT_BRAND, children });
}
function useBrand() {
  return reactExports.useContext(BrandContext) ?? DEFAULT_BRAND;
}
function useOptionalBrand() {
  return reactExports.useContext(BrandContext);
}
const LANGS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" },
  { code: "bn", label: "বাংলা" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ml", label: "മലയാളം" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "sd", label: "سنڌي" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "ur", label: "اردو" }
];
const STORAGE_KEY$2 = "site_lang";
function setGoogTransCookie(lang) {
  const value = `/en/${lang}`;
  document.cookie = `googtrans=${value};path=/`;
  const host = window.location.hostname;
  const parts = host.split(".");
  if (parts.length > 1) {
    const parent = "." + parts.slice(-2).join(".");
    document.cookie = `googtrans=${value};path=/;domain=${parent}`;
  }
  document.cookie = `googtrans=${value};path=/;domain=.${host}`;
}
function readStoredLang() {
  if (typeof window === "undefined") return "en";
  return localStorage.getItem(STORAGE_KEY$2) || "en";
}
function applyLang(lang) {
  const combo = document.querySelector(".goog-te-combo");
  if (!combo) return false;
  combo.value = lang;
  combo.dispatchEvent(new Event("change"));
  return true;
}
function Header() {
  const brand = useBrand();
  const centerTitleBlock = useBlock("header.center_title", null);
  const centerSubtitleBlock = useBlock("header.center_subtitle", null);
  const brandTitleBlock = useBlock("header.brand_title", null);
  const brandSubtitleBlock = useBlock("header.brand_subtitle", null);
  const centerTitle = centerTitleBlock?.text || "सूक्ष्म, लघु और मध्यम उद्यम पंजीकरण सहायता सेवा";
  const centerSubtitle = centerSubtitleBlock?.text || "REGISTRATION ADVISORY FOR MICRO, SMALL & MEDIUM ENTERPRISES";
  const brandTitle = brandTitleBlock?.text || brand.companyName || "Business Help Services";
  const brandSubtitle = brandSubtitleBlock?.text || "Business Consultancy & Assistance Services";
  const [open, setOpen] = reactExports.useState(false);
  const navLinks = useNav(
    "header",
    NAV_LINKS.map((l) => ({ id: `${l.to}-${l.label}`, label: l.label, path: l.to, openInNew: false }))
  );
  const [lang, setLang] = reactExports.useState("en");
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  reactExports.useEffect(() => {
    setLang(readStoredLang());
  }, []);
  function ensureTranslateScript() {
    if (typeof window === "undefined") return;
    if (document.getElementById("google-translate-script")) return;
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: LANGS.map((l) => l.code).join(","),
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        },
        "google_translate_element"
      );
      const stored = readStoredLang();
      if (stored && stored !== "en") {
        const tryApply = (n = 0) => {
          if (applyLang(stored)) return;
          if (n < 20) setTimeout(() => tryApply(n + 1), 200);
        };
        tryApply();
      }
    };
    const s = document.createElement("script");
    s.id = "google-translate-script";
    s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    s.async = true;
    document.body.appendChild(s);
  }
  reactExports.useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = readStoredLang();
    if (stored && stored !== "en") ensureTranslateScript();
  }, []);
  reactExports.useEffect(() => {
    const stored = readStoredLang();
    if (!stored || stored === "en") return;
    setGoogTransCookie(stored);
    const tryApply = (n = 0) => {
      if (applyLang(stored)) return;
      if (n < 25) setTimeout(() => tryApply(n + 1), 200);
    };
    const t = setTimeout(() => tryApply(), 50);
    return () => clearTimeout(t);
  }, [pathname]);
  const onLangChange = (code) => {
    setLang(code);
    localStorage.setItem(STORAGE_KEY$2, code);
    setGoogTransCookie(code);
    if (code === "en") {
      document.cookie = "googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      const host = window.location.hostname;
      const parts = host.split(".");
      if (parts.length > 1) {
        const parent = "." + parts.slice(-2).join(".");
        document.cookie = `googtrans=;path=/;domain=${parent};expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }
      window.location.reload();
      return;
    }
    ensureTranslateScript();
    if (!applyLang(code)) {
      window.location.reload();
    }
  };
  const handleTitleClick = () => {
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate({ to: "/" });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-[#d2e3f3] border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-2 flex items-center justify-center md:justify-end gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-4 h-4 text-brand-navy", "aria-hidden": true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "site-lang", className: "text-xs font-semibold text-brand-navy", children: "Change Language" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "select",
        {
          id: "site-lang",
          value: lang,
          onChange: (e) => onLangChange(e.target.value),
          className: "notranslate rounded-md border border-brand-navy bg-white px-2 py-1 text-xs font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/30",
          children: LANGS.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: l.code, children: l.label }, l.code))
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "google_translate_element", className: "gtranslate-host sr-only", "aria-hidden": true })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "bg-background border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-3 md:py-5 bg-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: handleTitleClick,
            className: "flex-1 text-left bg-transparent p-0 cursor-pointer min-w-0",
            "aria-label": "Go to homepage",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-brand-red font-display leading-snug text-center text-lg", children: centerTitle }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] tracking-wide text-brand-navy font-semibold font-display mt-0.5 leading-tight text-center", children: centerSubtitle })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setOpen(true),
            "aria-label": "Open menu",
            className: "shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-md border-2 border-brand-navy text-brand-navy bg-transparent",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "w-5 h-5" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:grid grid-cols-3 items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/",
            className: "flex flex-col",
            "aria-label": brandTitle,
            title: brandTitle,
            itemScope: true,
            itemType: "https://schema.org/Organization",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  itemProp: "name",
                  className: "text-xl lg:text-2xl font-bold text-brand-red font-display whitespace-nowrap leading-loose",
                  children: brandTitle
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground/80 leading-relaxed", children: brandSubtitle })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: handleTitleClick,
            className: "text-center bg-transparent p-0 cursor-pointer",
            "aria-label": "Go to homepage",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-brand-red font-display leading-tight", children: centerTitle }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs tracking-wider text-brand-navy font-semibold mt-1", children: centerSubtitle })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/contact",
            className: "inline-flex items-center justify-center rounded-md bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy-deep transition-colors",
            children: "Contact Us"
          }
        ) })
      ] })
    ] }) }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/60 md:hidden", onClick: () => setOpen(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "aside",
      {
        className: "absolute right-0 top-0 h-full w-[82%] max-w-sm bg-brand-navy text-white shadow-2xl overflow-y-auto",
        onClick: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-10 bg-brand-navy px-5 py-4 border-b border-white/15 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-lg font-bold", children: "Menu" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setOpen(false),
                "aria-label": "Close menu",
                className: "w-9 h-9 inline-flex items-center justify-center rounded-md hover:bg-white/10",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "px-5 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: navLinks.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: l.path,
              target: l.openInNew ? "_blank" : void 0,
              onClick: () => setOpen(false),
              activeOptions: { exact: l.path === "/" },
              activeProps: { className: "bg-white/10 text-brand-gold" },
              className: "block px-3 py-3 rounded-md text-base font-medium text-white hover:bg-white/10 hover:text-brand-gold transition-colors",
              children: l.label
            }
          ) }, l.id)) }) })
        ]
      }
    ) })
  ] });
}
const FALLBACK_NAV = NAV_LINKS.map((l) => ({
  id: `${l.to}-${l.label}`,
  label: l.label,
  path: l.to,
  openInNew: false
}));
function Nav() {
  const links = useNav("header", FALLBACK_NAV);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden md:block bg-nav-bg border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 bg-[#d2e3f3]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-3 text-sm font-medium text-brand-navy", children: links.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    Link,
    {
      to: l.path,
      target: l.openInNew ? "_blank" : void 0,
      activeOptions: { exact: l.path === "/" },
      activeProps: { className: "text-brand-red font-semibold" },
      className: "hover:text-brand-red transition-colors",
      children: l.label
    }
  ) }, l.id)) }) }) });
}
function DisclaimerBar() {
  const brand = useBrand();
  const block = useBlock("disclaimer.bar", null);
  const text = block?.text || DISCLAIMER_TEXT;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sr-only", "aria-hidden": "false", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Disclaimer:" }),
      " ",
      brand.legalFooterLine
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-[#31547d] text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "marquee-track py-2 text-xs md:text-sm font-medium", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-12", children: text }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-12", children: text })
    ] }) })
  ] });
}
const listPublicSeoPages = createServerFn({
  method: "GET"
}).handler(createSsrRpc("fd963bea4cc60c9f99bb62927d1ff7e65a6f2659027181393ebed6da00cb1db5"));
const listAllSeoPages = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("ead327ebc9c4fbefa84dd85284c0d83b8884e6feeb42e1fba252c8eb6911259e"));
const UpsertInput = object({
  id: string().uuid().optional(),
  website_id: string().uuid().optional(),
  slug: string().trim().min(1).max(160).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  label: string().trim().min(1).max(200),
  enabled: boolean(),
  sort_order: number$1().int().min(0).max(1e5)
});
const upsertSeoPage = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => UpsertInput.parse(input)).handler(createSsrRpc("bf98d6a120e262e69216c45bb7aedba8dd849aa814e7e516140cb1533ed812fe"));
const deleteSeoPage = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => object({
  id: string().uuid()
}).parse(input)).handler(createSsrRpc("602cdfe45c47e09b3bf7c1e91d5d600dc3cd155ca29992a4294b9312b9b5b41a"));
const checkIsAdmin = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("091bb78af65becdc45c0fe332eba528a3e29940a4d33856ad620342c332c2b49"));
const getSitemapPageManagerData = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("176f832daaa17526348ddd41ceee0cc440f5f0d8f0e55254f7150c96a8384443"));
const submitAllPagesToSitemap = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("cb2a013f6771304a32e61c341b866d5ac79f7e61d1b0d819782c58afed8a7cfa"));
const CATEGORIES = [
  { key: "home", label: "Home", isHome: true, childSlugs: [] },
  {
    key: "udyamregistration",
    label: "Udyamregistration",
    childSlugs: ["udyamregistration", "udyam-regn", "udyam", "udyog-aadhar", "udyam-certificate", "register-for-msme", "register-msme", "udyam-aadhar", "udyam-reg-certificate", "udyam-regn-certificate"]
  },
  {
    key: "udyam-regn-certificate",
    label: "Udyam Regn Certificate",
    childSlugs: ["udyog-aadhar-registration", "msme-certificate", "msme-certificate-download", "aadhar-udyog", "udyam-certificate-download", "msme-online-registration", "aadhar-udyam", "udyam-portal", "udyog-aadhar-download", "msme-udyam-download"]
  },
  {
    key: "udyamregistration-gov-in",
    label: "Udyamregistration gov in",
    childSlugs: ["udyog-aadhar-registration-2", "udyam-download", "msme-udyam-registration", "udyam-aadhar-registration", "udyam-registration-certificate-download", "udyam-registration-download", "udyam-registration-form", "udyam-registration-number", "udyam-registration-online", "udyam-registration-portal"]
  },
  {
    key: "aadhar-udyog-registration",
    label: "Aadhar Udyog registration",
    childSlugs: ["aadhar-udyog-registration", "udyog-aadhar-certificate", "udyam-certificate-registration", "msme-certificate-registration", "udyog-aadhaar", "udyog-aadhar-update", "msme-udyog-aadhar", "udyam-online-registration", "msme-udyam-certificate-download", "download-msme-certificate"]
  },
  {
    key: "udyog-aadhar-certificate-download",
    label: "Udyog Aadhar certificate download",
    childSlugs: ["udyog-aadhar-certificate-download", "udyam-register", "udyam-new-registration", "udyam-update", "udyam-certificate-update", "udyam-msme-certificate", "udyam-adhaar", "udyam-number", "aadhar-udyam-certificate", "udyog-aadhaar-number"]
  },
  {
    key: "official-msme-registration-website",
    label: "Official MSME Registration Website",
    childSlugs: ["www-udyamregistration-gov-in", "udyam-aadhaar-registration", "udyog-aadhar-free-registration", "udyam-certificate-apply", "udyam-update-online", "udyam-msme", "msme-certificate-update", "udyam-card", "udyog-aadhar-card", "msme-updation"]
  },
  {
    key: "aadhaar-udyam",
    label: "Aadhaar Udyam",
    childSlugs: ["aadhaar-udyam", "udyam-register-certificate-download", "udyam-download-certificate", "aadhar-udyam-download", "aadhar-udyam-registration", "download-udyam", "free-msme-registration-certificate-download", "msme-registration-charges", "msme-registration-fee", "msme-registration-portal"]
  },
  {
    key: "msme-registration-process",
    label: "MSME Registration Process",
    childSlugs: ["msme-registration-process", "udyam-card-download", "udyam-edit", "udyam-msme-registration", "udyog-aadhaar-government-in", "udyog-aadhaar-no", "udyog-aadhaar-register", "udyog-aadhaar-update", "udyog-aadhaar-govin", "www-udyamregistration"]
  },
  {
    key: "udyam-aadhaar-download-pdf",
    label: "Udyam Aadhaar Download PDF",
    childSlugs: ["udyam-aadhaar-download-pdf", "msme-registration-free", "https-udyamregistration-gov-in", "msme-registration-certificate-download", "download-udyam-certificate", "print-udyam-certificate", "udyam-certificate-print", "udyam-application", "msme-certificate-print", "print-msme-certificate"]
  },
  {
    key: "udyog-aadhar-registration-section",
    label: "Udyog Aadhar Registration",
    childSlugs: ["udhar-aadhar-registration", "udyog-aadhaar-to-udyam-migration", "download-udyam-certificate-online", "udyam-adhar-2", "msme-apply-online", "udyam-certificate-download-pdf", "ms-me-certificate", "msme-cer", "download-udyam-aadhar", "udham-aadhar-download"]
  },
  {
    key: "udhayam-aadhar-download",
    label: "Udhayam Aadhar Download",
    childSlugs: ["udhayam-aadhar-download", "udyam-print", "print-udyam", "udyam-register-print", "udyam-print-download", "udyam-reprint", "udyam-print-certificate", "msme-print-udyam-certificate", "aadhar-udyam-print", "msme-print-certificate"]
  },
  {
    key: "print-msme-udyam-certificate",
    label: "Print MSME Udyam Certificate",
    childSlugs: ["print-msme-udyam-certificate", "print-udyam-certificate-download", "udyam-print-with-annexure", "udyam-adhar-download", "udyog-aadhaar-download", "udyam-aadhaar-verify", "udyam-aadhaar-status", "udyam-registration-number-verify", "udyam-pan-registration", "udyam-aadhaar-login"]
  },
  {
    key: "udyam-registration-online-section",
    label: "Udyam Registration Online",
    childSlugs: ["udyog-aadhar-registration-online", "udyam-apply", "udyam-certificate-apply-online", "msme-registration-login", "udyam-registration-check", "udyam-download-online", "udyam-certificate-status", "udyam-registration-update", "udyam-certificate-reprint", "udyam-msme-certificate-download"]
  }
];
const FOOTER_LINKS = [
  { to: "/terms-conditions", label: "Terms & Conditions" },
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/refund-cancellation-policy", label: "Refund & Cancellation Policy" },
  { to: "/disclaimer", label: "Disclaimer" },
  { to: "/pricing-transparency", label: "Pricing Transparency" },
  { to: "/service-delivery-policy", label: "Service Delivery Policy" },
  { to: "/consent-acknowledgment", label: "Consent & Acknowledgment" },
  { to: "/compliance-statement", label: "Compliance Statement" },
  { to: "/cookie-policy", label: "Cookie Policy" },
  { to: "/aml-anti-fraud-policy", label: "AML / Anti-Fraud Policy" },
  {
    to: "/payment-notice-service-acknowledgment",
    label: "Payment Notice & Service Acknowledgment"
  },
  { to: "/important-notice", label: "Important Notice" },
  { to: "/contact", label: "Contact Us" }
];
function Footer() {
  const brand = useBrand();
  const footerLinks = useNav(
    "footer",
    FOOTER_LINKS.filter((l) => l.to !== "/contact" && l.to !== "/important-notice").map((l) => ({
      id: l.to,
      label: l.label,
      path: l.to,
      openInNew: false
    }))
  );
  const addressBlock = useBlock("footer.address", null);
  const copyrightBlock = useBlock("footer.copyright", null);
  const brandHeadingBlock = useBlock("footer.brand_heading", null);
  const contactNameBlock = useBlock("footer.contact_name", null);
  const footerBrandHeading = brandHeadingBlock?.text || brand.companyName || "Business Help Services";
  const footerContactName = contactNameBlock?.text || brand.companyName || "Business Help Services";
  const address = brand.postalAddress || addressBlock?.text || [brand.companyName, brand.postalAddress].filter(Boolean).join(" ") || "Koregaon Bk, Taluka-Khed, Pune, Maharashtra – 410505, India";
  const loadSeoPages = useServerFn(listPublicSeoPages);
  const loadCfSeoPages = useServerFn(listSanitySeoPages);
  const [pages, setPages] = reactExports.useState(null);
  const [cfPages, setCfPages] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [loadError, setLoadError] = reactExports.useState(false);
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const isUdyamRegistrationsSite = brand.domain?.toLowerCase().includes("udyamregistration") || typeof window !== "undefined" && window.location.hostname.includes("udyamregistration");
  const fetchPagesIfNeeded = () => {
    if (loading) return;
    if (isUdyamRegistrationsSite) {
      if (cfPages !== null) return;
      setLoading(true);
      setLoadError(false);
      loadCfSeoPages().then((data) => setCfPages(data ?? [])).catch(() => {
        setLoadError(true);
        setCfPages([]);
      }).finally(() => setLoading(false));
    } else {
      if (pages !== null) return;
      setLoading(true);
      setLoadError(false);
      loadSeoPages().then((data) => setPages(data ?? [])).catch(() => {
        setLoadError(true);
        setPages([]);
      }).finally(() => setLoading(false));
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "bg-brand-navy-deep text-white mt-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-12 grid gap-10 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-2xl font-bold font-display leading-tight", children: footerBrandHeading }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SeoTree,
          {
            pages,
            cfPages,
            isUdyamRegistrationsSite,
            loading,
            loadError,
            onUnlock: fetchPagesIfNeeded,
            unlockCode: brand.footerUnlockCode || "113355"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-2xl font-bold font-display leading-tight", children: "Useful Links" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-6 space-y-2.5 text-[15px] text-white/90", children: footerLinks.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: l.path, target: l.openInNew ? "_blank" : void 0, className: "hover:text-white hover:underline", children: l.label }) }, l.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-2xl font-bold font-display leading-tight", children: "Get in touch" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-base font-bold text-white", children: footerContactName }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 space-y-4 text-[14.5px] text-white/90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "h-5 w-5 mt-0.5 shrink-0 text-white/80" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Working Hours: ",
              brand.businessHours || "10:00 AM to 05:00 PM (IST) ( Sunday & Public Holidays Off)"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-5 w-5 mt-0.5 shrink-0 text-white/80" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Email:",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `mailto:${brand.supportEmail}`, className: "hover:underline break-all", children: brand.supportEmail })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-5 w-5 mt-0.5 shrink-0 text-white/80" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Phone:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `tel:${(brand.supportPhone || "+91-9767870331").replace(/\s+/g, "")}`, className: "hover:underline", children: brand.supportPhone || "+91-9767870331" })
            ] })
          ] }),
          brand.whatsappNumber && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-5 w-5 mt-0.5 shrink-0 text-white/80" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "WhatsApp:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `https://wa.me/${brand.whatsappNumber.replace(/[^0-9]/g, "")}`, target: "_blank", rel: "noopener noreferrer", className: "hover:underline", children: brand.whatsappNumber })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-5 w-5 mt-0.5 shrink-0 text-white/80" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Address: ",
              address
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 pt-4 border-t border-white/15 text-xs text-white/75 leading-relaxed", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Disclaimer:" }),
          " ",
          brand.legalFooterLine || "Business Help Services is operated as a private consultancy. We are not affiliated with, authorised by, endorsed by, or associated with any government authority or department."
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 py-5 text-center text-sm font-semibold text-white/85", children: copyrightBlock?.text ? copyrightBlock.text.replace("{{year}}", String(year)) : `© ${year} ${brand.companyName}. All Rights Reserved. Operated by ${brand.legalEntity}.` }) })
  ] });
}
function SeoTree({
  pages,
  cfPages,
  isUdyamRegistrationsSite,
  loading,
  loadError,
  onUnlock,
  unlockCode
}) {
  if (isUdyamRegistrationsSite) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ContentfulSeoTree,
      {
        cfPages,
        loading,
        loadError,
        onUnlock,
        unlockCode
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    PrimarySeoTree,
    {
      pages,
      loading,
      loadError,
      onUnlock,
      unlockCode
    }
  );
}
function PrimarySeoTree({
  pages,
  loading,
  loadError,
  onUnlock,
  unlockCode
}) {
  const expandedAll = () => Object.fromEntries(CATEGORIES.filter((c) => !c.isHome).map((c) => [c.key, true]));
  const [mounted, setMounted] = reactExports.useState(false);
  const [unlocked, setUnlocked] = reactExports.useState(false);
  const [expanded, setExpanded] = reactExports.useState({});
  const [clicks, setClicks] = reactExports.useState(0);
  const [showPwd, setShowPwd] = reactExports.useState(false);
  const [pwd, setPwd] = reactExports.useState("");
  const [pwdError, setPwdError] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setMounted(true);
    try {
      if (window.sessionStorage.getItem("udyam_footer_unlock") === "1") {
        setUnlocked(true);
        setExpanded(expandedAll());
        onUnlock();
      }
    } catch {
    }
  }, []);
  const grouped = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    CATEGORIES.forEach((c) => map.set(c.key, []));
    if (!pages) return map;
    const bySlug = new Map(pages.map((p) => [p.slug, p]));
    for (const cat of CATEGORIES) {
      const list = map.get(cat.key);
      for (const slug of cat.childSlugs) {
        const p = bySlug.get(slug);
        if (p) list.push(p);
      }
    }
    return map;
  }, [pages]);
  const articleGroups = reactExports.useMemo(() => {
    const articles = (pages ?? []).filter((p) => p.page_type === "article");
    const groups = [
      {
        key: "art-registration",
        label: "Udyam Registration (Articles)",
        match: (s) => s.startsWith("udyam-registration") && !s.includes("verify") && !s.includes("download") && !s.includes("print") && !s.includes("update") && !s.includes("change") && !s.includes("correction") && !s.includes("renewal") && !s.includes("status") && !s.includes("login")
      },
      {
        key: "art-certificate",
        label: "Udyam Certificate (Articles)",
        match: (s) => s.includes("certificate") || s.includes("aadhar-card") || s.includes("aadhaar-card") || s === "udyam-registration-download-guide" || s === "udyam-registration-print"
      },
      {
        key: "art-verification",
        label: "Udyam Verification & Status (Articles)",
        match: (s) => s.includes("verif") || s.includes("verify") || s.includes("status") || s === "udyam-registration-login" || s === "msme-login"
      },
      {
        key: "art-update",
        label: "Udyam Updates & Changes (Articles)",
        match: (s) => s.includes("update") || s.includes("change") || s.includes("correction") || s.includes("renewal") || s.includes("mobile-number") || s.includes("pan-card") || s.includes("name-change")
      },
      {
        key: "art-forgot",
        label: "Forgot / Recovery (Articles)",
        match: (s) => s.startsWith("forgot-")
      },
      {
        key: "art-msme-other",
        label: "MSME & Other (Articles)",
        match: () => true
      }
    ];
    const used = /* @__PURE__ */ new Set();
    const result = [];
    for (const g of groups) {
      const items = [];
      for (const a of articles) {
        if (used.has(a.slug)) continue;
        if (g.match(a.slug)) {
          items.push(a);
          used.add(a.slug);
        }
      }
      if (items.length) result.push({ key: g.key, label: g.label, items });
    }
    return result;
  }, [pages]);
  const toggle = (key2) => setExpanded((e) => ({ ...e, [key2]: !e[key2] }));
  const homeCat = CATEGORIES.find((c) => c.isHome);
  const restCats = CATEGORIES.filter((c) => !c.isHome);
  function handleHomeRowClick() {
    if (unlocked) return;
    const next = clicks + 1;
    setClicks(next);
    if (next >= 3) {
      setShowPwd(true);
    }
  }
  function submitPwd(e) {
    e.preventDefault();
    if (pwd === unlockCode) {
      try {
        window.sessionStorage.setItem("udyam_footer_unlock", "1");
      } catch {
      }
      setUnlocked(true);
      setExpanded(expandedAll());
      setShowPwd(false);
      setPwd("");
      setPwdError(false);
      onUnlock();
    } else {
      setPwdError(true);
      setPwd("");
      setClicks(0);
      setShowPwd(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "mt-6", "aria-label": "SEO landing pages", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-1 text-[15px] font-semibold leading-snug", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-1 cursor-default select-none",
          onClick: handleHomeRowClick,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex h-6 w-6 items-center justify-center text-white/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "h-3.5 w-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/",
                className: "flex-1 py-1.5 text-white hover:text-brand-gold",
                onClick: (e) => {
                  if (!unlocked) {
                    e.preventDefault();
                    e.stopPropagation();
                    handleHomeRowClick();
                  }
                },
                children: homeCat.label
              }
            )
          ]
        }
      ),
      showPwd && !unlocked && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "form",
        {
          onSubmit: submitPwd,
          className: "ml-6 mt-2 mb-3 flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "password",
                value: pwd,
                onChange: (e) => {
                  setPwd(e.target.value);
                  setPwdError(false);
                },
                autoFocus: true,
                className: `flex-1 rounded-md border bg-white/10 px-2 py-1.5 text-sm text-white outline-none focus:ring-2 ${pwdError ? "border-red-400 ring-red-400/40" : "border-white/30 focus:ring-brand-gold/40"}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "submit",
                className: "rounded-md bg-brand-gold px-3 py-1.5 text-sm font-semibold text-brand-navy-deep hover:bg-brand-gold/90",
                children: "Open"
              }
            )
          ]
        }
      )
    ] }),
    mounted && unlocked && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      loading && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "py-2 text-sm text-white/75", children: "Loading pages…" }),
      loadError && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "py-2 text-sm text-white/75", children: "Could not load SEO pages." }),
      !loading && restCats.map((cat) => {
        const children = grouped.get(cat.key) ?? [];
        const isOpen = expanded[cat.key];
        const hasChildren = children.length > 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            hasChildren ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => toggle(cat.key),
                className: "p-1 text-white/85 hover:text-brand-gold",
                "aria-label": isOpen ? "Collapse" : "Expand",
                "aria-expanded": isOpen,
                children: isOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 stroke-[3]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 stroke-[3]" })
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex h-6 w-6 items-center justify-center text-white/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 py-1.5 text-white font-semibold", children: cat.label })
          ] }),
          hasChildren && isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "ml-6 mt-1 mb-2 space-y-1 border-l border-white/15 pl-3 text-sm font-normal", children: children.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: `/${p.slug}`,
              className: "flex items-start gap-2 py-1 text-white/85 hover:text-brand-gold",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "mt-0.5 h-3.5 w-3.5 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: p.label })
              ]
            }
          ) }, p.id)) })
        ] }, cat.key);
      }),
      !loading && articleGroups.map((cat) => {
        const isOpen = expanded[cat.key];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => toggle(cat.key),
                className: "p-1 text-white/85 hover:text-brand-gold",
                "aria-label": isOpen ? "Collapse" : "Expand",
                "aria-expanded": isOpen,
                children: isOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 stroke-[3]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 stroke-[3]" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 py-1.5 text-white font-semibold", children: cat.label })
          ] }),
          isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "ml-6 mt-1 mb-2 space-y-1 border-l border-white/15 pl-3 text-sm font-normal", children: cat.items.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: `/${p.slug}`,
              className: "flex items-start gap-2 py-1 text-white/85 hover:text-brand-gold",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "mt-0.5 h-3.5 w-3.5 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: p.label })
              ]
            }
          ) }, p.id)) })
        ] }, cat.key);
      })
    ] })
  ] }) });
}
function ContentfulSeoTree({
  cfPages,
  loading,
  loadError,
  onUnlock,
  unlockCode
}) {
  const [mounted, setMounted] = reactExports.useState(false);
  const [unlocked, setUnlocked] = reactExports.useState(false);
  const [clicks, setClicks] = reactExports.useState(0);
  const [showPwd, setShowPwd] = reactExports.useState(false);
  const [pwd, setPwd] = reactExports.useState("");
  const [pwdError, setPwdError] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setMounted(true);
    try {
      if (window.sessionStorage.getItem("udyam_footer_unlock") === "1") {
        setUnlocked(true);
        onUnlock();
      }
    } catch {
    }
  }, []);
  function handleHomeRowClick() {
    if (unlocked) return;
    const next = clicks + 1;
    setClicks(next);
    if (next >= 3) setShowPwd(true);
  }
  function submitPwd(e) {
    e.preventDefault();
    if (pwd === unlockCode) {
      try {
        window.sessionStorage.setItem("udyam_footer_unlock", "1");
      } catch {
      }
      setUnlocked(true);
      setShowPwd(false);
      setPwd("");
      setPwdError(false);
      onUnlock();
    } else {
      setPwdError(true);
      setPwd("");
      setClicks(0);
      setShowPwd(false);
    }
  }
  const sortedPages = reactExports.useMemo(
    () => [...cfPages ?? []].sort((a, b) => a.title.localeCompare(b.title)),
    [cfPages]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "mt-6", "aria-label": "SEO landing pages", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-1 text-[15px] font-semibold leading-snug", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-1 cursor-default select-none",
          onClick: handleHomeRowClick,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex h-6 w-6 items-center justify-center text-white/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "h-3.5 w-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/",
                className: "flex-1 py-1.5 text-white hover:text-brand-gold",
                onClick: (e) => {
                  if (!unlocked) {
                    e.preventDefault();
                    e.stopPropagation();
                    handleHomeRowClick();
                  }
                },
                children: "Home"
              }
            )
          ]
        }
      ),
      showPwd && !unlocked && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submitPwd, className: "ml-6 mt-2 mb-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "password",
            value: pwd,
            onChange: (e) => {
              setPwd(e.target.value);
              setPwdError(false);
            },
            autoFocus: true,
            className: `flex-1 rounded-md border bg-white/10 px-2 py-1.5 text-sm text-white outline-none focus:ring-2 ${pwdError ? "border-red-400 ring-red-400/40" : "border-white/30 focus:ring-brand-gold/40"}`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "rounded-md bg-brand-gold px-3 py-1.5 text-sm font-semibold text-brand-navy-deep hover:bg-brand-gold/90", children: "Open" })
      ] })
    ] }),
    mounted && unlocked && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      loading && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "py-2 text-sm text-white/75", children: "Loading pages…" }),
      loadError && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "py-2 text-sm text-white/75", children: "Could not load SEO pages." }),
      !loading && sortedPages.map((page) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: `/${page.slug}`,
          className: "flex items-center gap-1 py-1 text-white/85 hover:text-brand-gold font-normal text-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5 shrink-0 text-white/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: page.title })
          ]
        }
      ) }, page.slug))
    ] })
  ] }) });
}
function SiteShell({ children }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isApplyOrPaymentPage = path.startsWith("/apply") || path.startsWith("/payment") || path.startsWith("/processing") || path.startsWith("/onboarding") || path.startsWith("/payment-pending") || path.startsWith("/payment-failed");
  const checkoutBlock = useBlock("checkout.disclaimer_footer", null);
  const checkoutPagesEnabled = checkoutBlock?.enabled ?? true;
  const showDisclaimer = !isApplyOrPaymentPage || checkoutPagesEnabled;
  const showFooter = !isApplyOrPaymentPage || checkoutPagesEnabled;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col bg-background bg-[#194170]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    showDisclaimer && /* @__PURE__ */ jsxRuntimeExports.jsx(DisclaimerBar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1", children }),
    showFooter && /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const getCurrentBrand = createServerFn({
  method: "GET"
}).handler(createSsrRpc("3adfbbffa09a08986dadc258d343ab0ad93d2bb4e8b7fd791b5c562740a75971"));
const getSiteContent = createServerFn({
  method: "GET"
}).handler(createSsrRpc("80e8be4ef41e0519ccfb7105125c2dd753e548122d9a8183ae11f4d40a36925d"));
const ALLOWED_EXACT = /* @__PURE__ */ new Set([
  "/",
  "/index.html",
  "/about",
  "/about-us",
  "/contact",
  "/contact-us",
  "/complaint",
  "/other-problem",
  "/talk-to-expert",
  "/unauthorized",
  "/notice",
  "/important-notice",
  "/payment-notice",
  "/payment-notice-service-acknowledgment",
  // Legal / policy set
  "/aml-anti-fraud-policy",
  "/complaint-grievance-policy",
  "/compliance-statement",
  "/consent-acknowledgment",
  "/cookie-policy",
  "/disclaimer",
  "/grievance-redressal-policy",
  "/pricing-transparency",
  "/privacy-policy",
  "/refund-cancellation-policy",
  "/service-delivery-policy",
  "/terms-conditions",
  "/sitemap.xml",
  "/llms.txt",
  "/llms-full.txt"
]);
const ALLOWED_PREFIXES = [
  "/api/",
  "/apply/",
  "/app/",
  "/email/",
  "/lovable/",
  "/onboarding/",
  "/payment/",
  "/payment-failed/",
  "/payment-pending/",
  "/processing/",
  "/resume/",
  "/success/"
];
function isBlockedOnSecondarySite(pathname, extraAllowed) {
  const norm = (p) => p.length > 1 ? p.replace(/\/+$/, "").toLowerCase() : p.toLowerCase();
  const path = norm(pathname);
  if (ALLOWED_EXACT.has(path)) return false;
  if (ALLOWED_PREFIXES.some((p) => path.startsWith(p))) return false;
  if (path.startsWith("/admin")) return false;
  if (extraAllowed) {
    for (const p of extraAllowed) {
      if (p && p.startsWith("/") && norm(p) === path) return false;
    }
  }
  return true;
}
const secondarySiteRoutes = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  isBlockedOnSecondarySite
}, Symbol.toStringTag, { value: "Module" }));
const key = (leadCode, kind) => `bhs_at:${leadCode.toUpperCase()}:${kind}`;
function storeAccessToken(leadCode, token) {
  const kind = parseTokenKind(token);
  if (!kind || typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key(leadCode, kind), token);
  } catch {
  }
}
function captureAccessToken(leadCode) {
  if (typeof window === "undefined") return;
  const hash = window.location.hash || "";
  const m = hash.match(/[#&]t=([A-Za-z0-9_-]+)/);
  if (!m) return;
  storeAccessToken(leadCode, m[1]);
  const clean = window.location.pathname + window.location.search;
  window.history.replaceState(window.history.state, "", clean);
}
function readAccessToken(leadCode, kind) {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key(leadCode, kind));
  } catch {
    return null;
  }
}
function pickAccessToken(leadCode, prefer) {
  for (const k of prefer) {
    const t = readAccessToken(leadCode, k);
    if (t) return t;
  }
  return null;
}
function useAccessToken(leadCode, prefer) {
  const [token, setToken] = reactExports.useState(void 0);
  const preferKey = prefer.join(",");
  reactExports.useEffect(() => {
    captureAccessToken(leadCode);
    setToken(pickAccessToken(leadCode, prefer));
  }, [leadCode, preferKey]);
  return token;
}
function markConversionOnce(leadCode) {
  if (typeof window === "undefined") return false;
  const k = `bhs_conv:${leadCode.toUpperCase()}`;
  try {
    if (window.localStorage.getItem(k)) return false;
    window.localStorage.setItem(k, String(Date.now()));
  } catch {
  }
  return true;
}
const LeadInput = object({
  name: string().trim().min(2).max(120),
  email: string().trim().email().max(160),
  mobile: string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  state: _enum(INDIAN_STATES),
  language: _enum(LANGUAGES),
  service: string().trim().min(1).max(200),
  consent: literal(true, {
    message: "You must accept the terms to proceed"
  }),
  source_page: string().trim().max(300).optional()
});
const createLead = createServerFn({
  method: "POST"
}).inputValidator((input) => LeadInput.parse(input)).handler(createSsrRpc("d09b5def561c97d9af2d33d19dea3fb9e628ab88e1cbc611eb88b776cde547d4"));
const listServices = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((raw) => object({
  includeInactive: boolean().optional(),
  websiteId: string().uuid().optional()
}).optional().parse(raw)).handler(createSsrRpc("b3733e1aceb348de0df1b06cb31a68f96067758e25ebad5406776840c0f87283"));
const listActiveServiceCodes = createServerFn({
  method: "GET"
}).handler(createSsrRpc("d59bbd896d658bff27bd047795a7d69bb88958a4f4de31550366d4b252a431fc"));
const ServiceInput = object({
  id: string().uuid().optional(),
  service_code: string().trim().min(2).max(80).regex(/^[a-zA-Z0-9_-]+$/, "letters, numbers, hyphen or underscore only"),
  service_name: string().trim().min(2).max(160),
  description: string().max(2e3).nullable().optional(),
  base_amount: number$1().min(0).max(1e6),
  gst_amount: number$1().min(0).max(1e6),
  total_amount: number$1().min(0).max(1e6),
  is_active: boolean().default(true),
  sort_order: number$1().int().min(0).max(1e4).default(0),
  govt_portal_url: string().trim().max(1e3).nullable().optional(),
  website_id: string().uuid().optional(),
  category_id: string().uuid().nullable().optional(),
  expected_processing_days: number$1().int().min(0).max(3650).nullable().optional(),
  journey_key: string().trim().max(80).nullable().optional()
});
const upsertService = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => ServiceInput.parse(i)).handler(createSsrRpc("a88444092486de02238a8ce8089bf67dad9c797396759b0a50e2910b6b2aaed7"));
const deleteService = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid()
}).parse(i)).handler(createSsrRpc("5a1caabcc8114771c7e70e14aecc56e363697fa43895278b1aac630da0cd7a22"));
const SESSION_KEY = "bhs_session_id";
function getSessionId() {
  if (typeof window === "undefined") return "ssr";
  try {
    let id = window.sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
      window.sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "no-session";
  }
}
const IGNORED_EVENTS = /* @__PURE__ */ new Set(["form_field_filled"]);
const DEDUPE_KEY = "bhs_tracked_events";
function shouldRecord(event_name) {
  try {
    const raw = window.sessionStorage.getItem(DEDUPE_KEY);
    const seen = raw ? JSON.parse(raw) : [];
    if (seen.includes(event_name)) return false;
    seen.push(event_name);
    window.sessionStorage.setItem(DEDUPE_KEY, JSON.stringify(seen.slice(-40)));
    return true;
  } catch {
    return true;
  }
}
function trackEvent(event_name, metadata = {}, refs) {
  if (typeof window === "undefined") return;
  if (IGNORED_EVENTS.has(event_name)) return;
  if (!shouldRecord(event_name)) return;
  const payload = {
    event_name,
    session_id: getSessionId(),
    lead_id: refs?.lead_id ?? null,
    application_id: refs?.application_id ?? null,
    page_url: window.location.pathname + window.location.search,
    metadata,
    user_agent: window.navigator.userAgent.slice(0, 500)
  };
  void import("./client-BX5UfqqR.mjs").then(
    ({ supabase: supabase2 }) => supabase2.from("analytics_events").insert(payload).then(({ error }) => {
    })
  );
}
function LeadForm({ title = "Fill application" } = {}) {
  const navigate = useNavigate();
  const submitLead = useServerFn(createLead);
  const fetchActiveCodes = useServerFn(listActiveServiceCodes);
  const baseId = reactExports.useId();
  const [activeServices, setActiveServices] = reactExports.useState(null);
  reactExports.useEffect(() => {
    fetchActiveCodes().then((r) => setActiveServices(r.services ?? r.codes.map((c) => ({ code: c, name: c })))).catch(() => setActiveServices(null));
  }, [fetchActiveCodes]);
  const visibleServices = reactExports.useMemo(() => {
    if (activeServices && activeServices.length > 0) {
      return activeServices.map((s) => {
        const staticMatch = SERVICES.find((x) => x.slug === s.code);
        return { slug: s.code, label: s.name || staticMatch?.label || s.code };
      });
    }
    return SERVICES.map((s) => ({ slug: s.slug, label: s.label }));
  }, [activeServices]);
  const [busy, setBusy] = reactExports.useState(false);
  const [err, setErr] = reactExports.useState(null);
  const startedRef = reactExports.useRef(false);
  function onFirstInteract() {
    if (startedRef.current) return;
    startedRef.current = true;
    trackEvent("form_started");
  }
  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const sourcePage = typeof window !== "undefined" ? (window.location.pathname + window.location.search).slice(0, 240) : void 0;
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      mobile: String(fd.get("mobile") ?? "").trim(),
      state: String(fd.get("state") ?? ""),
      language: String(fd.get("language") ?? ""),
      service: String(fd.get("service") ?? ""),
      consent: fd.get("consent") === "on",
      source_page: sourcePage
    };
    trackEvent("form_submitted", { service: payload.service, state: payload.state });
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "form_submission",
        form_type: "lead_form",
        service: payload.service,
        state: payload.state
      });
    }
    try {
      const lead = await submitLead({ data: payload });
      trackEvent("lead_created", { service: payload.service }, { lead_id: lead.leadId ?? null });
      storeAccessToken(lead.leadCode, lead.accessToken);
      navigate({
        to: "/processing/$leadCode",
        params: { leadCode: lead.leadCode }
      });
    } catch (e2) {
      const msg = e2 instanceof Error ? e2.message : "Something went wrong. Please try again.";
      setErr(msg);
      setBusy(false);
    }
  }
  const inputCls = "w-full rounded-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card shadow-sm overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-form-header text-white text-center py-4 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold font-display leading-tight", children: title }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, onFocus: onFirstInteract, className: "p-6 md:p-8 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: `${baseId}-name`, label: "Applicant Name / आवेदक का नाम", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: `${baseId}-name`, name: "name", required: true, className: inputCls, placeholder: "Enter Applicant Name" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: `${baseId}-email`, label: "Email / ईमेल", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: `${baseId}-email`, name: "email", type: "email", required: true, className: inputCls, placeholder: "Enter your email" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: `${baseId}-mobile`, label: "Mobile No / मोबाइल नंबर", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-sm text-foreground/80 font-medium", children: "+91" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: `${baseId}-mobile`,
            name: "mobile",
            required: true,
            inputMode: "numeric",
            pattern: "[6-9][0-9]{9}",
            maxLength: 10,
            className: `${inputCls} pl-14`,
            placeholder: "Enter 10-digit mobile number"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: `${baseId}-state`, label: "State / राज्य", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { id: `${baseId}-state`, name: "state", required: true, defaultValue: "", className: inputCls, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", disabled: true, children: "Select Your State" }),
        INDIAN_STATES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, s))
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: `${baseId}-language`, label: "Language of Assistance / सहायता की भाषा", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { id: `${baseId}-language`, name: "language", required: true, defaultValue: "", className: inputCls, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", disabled: true, children: "Select Language" }),
        LANGUAGES.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: l, children: l }, l))
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { id: `${baseId}-service`, label: "Reason for Help (Assistance) / सहायता का कारण", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { id: `${baseId}-service`, name: "service", required: true, defaultValue: "", className: inputCls, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", disabled: true, children: "Select Reason" }),
        visibleServices.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.slug, children: s.label }, s.slug))
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: `${baseId}-consent`, className: "flex gap-3 items-start text-xs text-foreground/80 leading-relaxed", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: `${baseId}-consent`, type: "checkbox", name: "consent", required: true, className: "mt-1 h-5 w-5 shrink-0 accent-brand-navy-deep border-2 border-brand-navy-deep rounded-sm cursor-pointer", style: { accentColor: "#0a1f44" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "I confirm that I have read and agreed to all applicable",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/terms-conditions", className: "text-brand-navy underline", children: "Terms & Conditions" }),
          ",",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/privacy-policy", className: "text-brand-navy underline", children: "Privacy Policy" }),
          ",",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/refund-cancellation-policy", className: "text-brand-navy underline", children: "Refund & Cancellation Policy" }),
          ",",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/disclaimer", className: "text-brand-navy underline", children: "Disclaimer" }),
          ",",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/pricing-transparency", className: "text-brand-navy underline", children: "Pricing Transparency" }),
          ",",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/consent-acknowledgment", className: "text-brand-navy underline", children: "Consents and Acknowledgements" }),
          " ",
          "and related service policies of this website."
        ] })
      ] }),
      err && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm px-3 py-2", children: err }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "submit",
          disabled: busy,
          className: "w-full rounded-full bg-brand-navy hover:bg-brand-navy-deep text-white font-semibold py-3 transition-colors disabled:opacity-60",
          children: busy ? "Submitting…" : "Submit"
        }
      )
    ] })
  ] });
}
function Field({ id, label, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: id, className: "block text-sm font-semibold text-foreground mb-1.5", children: label }),
    children
  ] });
}
const STEPS$5 = [
  { icon: SquareUserRound, label: "Fill Form & Make Payment", color: "text-brand-navy" },
  { icon: FingerprintPattern, label: "Submit Required Information", color: "text-brand-red" },
  { icon: Share2, label: "Expert Assistance & Verification", color: "text-brand-navy" },
  { icon: Download, label: "Updates Shared via Email", color: "text-green-600" }
];
const FACTS = [
  ["Country", "India"],
  ["Area", "3,287,263 sq. km."],
  ["States", "28"],
  ["Population", "1,46,39,00,000"],
  ["Literacy", "80.9%"]
];
function TrustBlock() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-brand-navy/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-4 py-10 md:py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-center text-2xl md:text-3xl font-bold font-display text-foreground", children: "Udyam Assistance Process – Fast & Simple" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-4 items-start", children: STEPS$5.map((s, i) => {
        const Icon = s.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col items-center text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 md:w-24 md:h-24 rounded-full bg-white shadow-md flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-9 h-9 md:w-11 md:h-11 ${s.color}`, strokeWidth: 2 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 font-bold text-foreground text-sm md:text-base leading-snug max-w-[12ch]", children: s.label }),
          i < STEPS$5.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            ArrowRight,
            {
              className: "hidden md:block absolute top-10 -right-3 w-6 h-6 text-foreground",
              strokeWidth: 2.5,
              "aria-hidden": true
            }
          )
        ] }, i);
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-5xl px-4 py-10 md:py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border overflow-hidden bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted/40 px-6 py-5 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-center text-2xl md:text-3xl font-bold font-display text-foreground", children: "A Vision on India" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 md:p-6 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: "/images/india-map.png",
          alt: "Map of India showing all states where consultancy services are provided",
          className: "w-full max-w-xl h-auto",
          loading: "lazy"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("table", { className: "w-full border-t border-border text-sm md:text-base", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: FACTS.map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border last:border-b-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            scope: "row",
            className: "w-1/2 text-left font-normal text-foreground px-4 md:px-6 py-4 border-r border-border",
            children: k
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 md:px-6 py-4 text-foreground", children: v })
      ] }, k)) }) })
    ] }) })
  ] });
}
const url = "/__l5e/assets-v1/4fb73dad-846b-4c39-879e-ee54d21d1925/udyam-sample-certificate.webp";
const certImg$1 = {
  url
};
function renderParagraph(text, linkPool) {
  const parts = [text];
  for (const [key2, link] of Array.from(linkPool.entries())) {
    let inserted = false;
    for (let i = 0; i < parts.length && !inserted; i++) {
      const part = parts[i];
      if (typeof part !== "string") continue;
      const idx = part.toLowerCase().indexOf(key2.toLowerCase());
      if (idx === -1) continue;
      const before = part.slice(0, idx);
      const match = part.slice(idx, idx + link.anchor.length);
      const after = part.slice(idx + link.anchor.length);
      parts.splice(i, 1, before, { href: link.href, label: match }, after);
      inserted = true;
    }
    if (inserted) linkPool.delete(key2);
  }
  return parts.map(
    (p, i) => typeof p === "string" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: p }, i) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "a",
      {
        href: p.href,
        className: "text-brand-navy underline hover:text-brand-navy-deep",
        children: p.label
      },
      i
    )
  );
}
function CtaBox({ text, tone = "primary" }) {
  const bg = tone === "primary" ? "bg-brand-navy-deep text-white" : "bg-brand-navy/5 text-brand-navy-deep border border-brand-navy/20";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl ${bg} p-6 my-8 shadow-sm`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold leading-snug", children: text }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "a",
      {
        href: "#lead-form",
        className: `mt-4 inline-block rounded-full px-5 py-2 text-sm font-semibold ${tone === "primary" ? "bg-white text-brand-navy-deep hover:bg-white/90" : "bg-brand-navy-deep text-white hover:bg-brand-navy"}`,
        children: "Get expert help"
      }
    )
  ] });
}
function FaqAccordion({ faq }) {
  const [open, setOpen] = reactExports.useState(0);
  if (!faq.length) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: faq.map((item, idx) => {
    const isOpen = open === idx;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setOpen(isOpen ? null : idx),
          className: "flex w-full items-center justify-between gap-4 px-4 py-3 text-left",
          "aria-expanded": isOpen,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: item.question }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": true, className: "text-brand-navy", children: isOpen ? "−" : "+" })
          ]
        }
      ),
      isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border px-4 py-3 text-[15px] leading-relaxed text-foreground/85", children: item.answer })
    ] }, idx);
  }) });
}
function mergeSeoData(local, o) {
  if (!o) return local;
  const nonEmpty = (v, fallback2) => Array.isArray(v) && v.length ? v : fallback2;
  return {
    ...local,
    h1: o.h1?.trim() || local.h1,
    seo: {
      ...local.seo,
      metaTitle: o.metaTitle?.trim() || local.seo.metaTitle,
      metaDescription: o.metaDescription?.trim() || local.seo.metaDescription
    },
    aiOverview: o.aiOverview ? { ...local.aiOverview, ...stripUndef(o.aiOverview) } : local.aiOverview,
    quickFacts: nonEmpty(o.quickFacts, local.quickFacts),
    body: nonEmpty(o.body, local.body),
    eeat: o.eeat ? { ...local.eeat, ...stripUndef(o.eeat) } : local.eeat,
    faq: nonEmpty(o.faq, local.faq),
    internalLinks: nonEmpty(o.internalLinks, local.internalLinks),
    howto: nonEmpty(o.howto, local.howto),
    cta: o.cta ? { ...local.cta, ...stripUndef(o.cta) } : local.cta
  };
}
function stripUndef(o) {
  const out = {};
  for (const k in o) {
    const v = o[k];
    if (v !== void 0 && v !== null && v !== "") out[k] = v;
  }
  return out;
}
function SeoContentPage({
  data,
  overrides
}) {
  const merged = mergeSeoData(data, overrides);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SeoContentPageInner, { data: merged });
}
function SeoContentPageInner({ data }) {
  const formTitle = data.seo.metaTitle || data.h1;
  const linkPool = /* @__PURE__ */ new Map();
  for (const l of data.internalLinks) {
    if (l.anchor && !linkPool.has(l.anchor)) linkPool.set(l.anchor, l);
  }
  const mid = Math.floor(data.body.length / 2);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        id: "lead-form",
        className: "mx-auto max-w-7xl px-4 py-6 md:py-8 grid gap-6 lg:grid-cols-2 items-start",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LeadForm, { title: formTitle }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card shadow-sm overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-form-header text-white text-center py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold font-display", children: "Sample Certificate" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: certImg$1.url,
                  alt: "Sample Udyam Adhar Certificate",
                  width: 800,
                  height: 1035,
                  className: "w-full h-auto rounded-md border border-border",
                  loading: "eager",
                  fetchPriority: "high"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-center text-sm text-muted-foreground text-slate-950", children: "Note: Sample Udyam Adhar Certificate shown for reference purposes only." })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-5xl px-4 pb-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card shadow-sm p-6 md:p-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { "aria-label": "Breadcrumb", className: "mb-4 text-sm text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "flex flex-wrap items-center gap-1", children: data.breadcrumb.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-1", children: [
        i > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": true, children: "›" }),
        i === data.breadcrumb.length - 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-current": "page", className: "text-foreground", children: c.name }) : /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: c.href, className: "hover:underline", children: c.name })
      ] }, i)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl md:text-4xl font-bold text-brand-navy-deep", children: data.h1 }),
      data.aiOverview.short && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-speakable": "ai-overview",
          className: "mt-6 rounded-xl border-l-4 border-brand-navy bg-brand-navy/5 p-5",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[15px] leading-relaxed text-foreground/90", children: data.aiOverview.short })
        }
      ),
      data.cta.hero && /* @__PURE__ */ jsxRuntimeExports.jsx(CtaBox, { text: data.cta.hero, tone: "primary" }),
      data.quickFacts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 rounded-xl border border-border bg-muted/30 p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-brand-navy-deep", children: "Quick Facts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("dl", { className: "mt-3 divide-y divide-border", children: data.quickFacts.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-1 py-2 md:grid-cols-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "font-semibold text-foreground", children: f.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "md:col-span-2 text-foreground/85", children: f.value })
        ] }, i)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prose-body mt-8 space-y-6 text-[15px] leading-relaxed text-foreground/85", children: data.body.map((sec, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-brand-navy-deep", children: sec.heading }),
        sec.paragraphs.map((p, j) => {
          const isHtml = /^<[a-z]/i.test(p.trim());
          return isHtml ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 [&_li]:mt-1 [&_strong]:font-semibold [&_strong]:text-foreground [&_em]:italic [&_a]:text-brand-navy [&_a]:underline",
              dangerouslySetInnerHTML: { __html: p }
            },
            j
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3", children: renderParagraph(p, linkPool) }, j);
        }),
        sec.subsections?.map((sub, k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-semibold text-foreground", children: sub.heading }),
          sub.paragraphs.map((p, j) => {
            const isHtml = /^<[a-z]/i.test(p.trim());
            return isHtml ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "mt-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 [&_li]:mt-1 [&_strong]:font-semibold [&_strong]:text-foreground [&_em]:italic [&_a]:text-brand-navy [&_a]:underline",
                dangerouslySetInnerHTML: { __html: p }
              },
              j
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2", children: renderParagraph(p, linkPool) }, j);
          })
        ] }, k)),
        i === mid && data.cta.middle && /* @__PURE__ */ jsxRuntimeExports.jsx(CtaBox, { text: data.cta.middle, tone: "muted" })
      ] }, i)) }),
      (data.eeat.experience || data.eeat.expertise || data.eeat.trust || data.eeat.disclaimer) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 rounded-xl border border-border bg-card p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-brand-navy-deep", children: "Why trust this guide" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-3 space-y-2 text-[14px] text-foreground/85", children: [
          data.eeat.experience && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "font-semibold text-foreground", children: "Experience" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: data.eeat.experience })
          ] }),
          data.eeat.expertise && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "font-semibold text-foreground", children: "Expertise" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: data.eeat.expertise })
          ] }),
          data.eeat.trust && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "font-semibold text-foreground", children: "Trust" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: data.eeat.trust })
          ] }),
          data.eeat.transparency && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "font-semibold text-foreground", children: "Transparency" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: data.eeat.transparency })
          ] }),
          data.eeat.disclaimer && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-900 mt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "font-semibold", children: "Private consultancy disclaimer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: data.eeat.disclaimer })
          ] })
        ] })
      ] }),
      data.faq.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-brand-navy-deep", children: "Frequently Asked Questions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FaqAccordion, { faq: data.faq }) })
      ] }),
      data.internalLinks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 rounded-xl border border-border bg-muted/30 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-brand-navy-deep", children: "Related guides" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 grid gap-2 sm:grid-cols-2", children: data.internalLinks.map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: l.href,
              className: "text-brand-navy underline hover:text-brand-navy-deep",
              children: l.anchor
            }
          ),
          l.reason && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 text-sm text-muted-foreground", children: [
            "— ",
            l.reason
          ] })
        ] }, i)) })
      ] }),
      data.cta.bottom && /* @__PURE__ */ jsxRuntimeExports.jsx(CtaBox, { text: data.cta.bottom, tone: "primary" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TrustBlock, {})
  ] });
}
function buildSeoJsonLd(data) {
  const url2 = data.canonical;
  const graph = [];
  graph.push({
    "@type": "Organization",
    "@id": "https://udyamadhar.in/#organization",
    name: "Udyam Aadhar",
    alternateName: "Udyamadhar",
    url: "https://udyamadhar.in/",
    logo: "https://udyamadhar.in/favicon.ico",
    description: "Udyam Aadhar is a private MSME and Udyam Registration consultancy assisting Indian small businesses."
  });
  graph.push({
    "@type": "Service",
    serviceType: data.h1,
    provider: { "@id": "https://udyamadhar.in/#organization" },
    areaServed: "India",
    description: data.seo.metaDescription,
    url: url2
  });
  graph.push({
    "@type": "WebPage",
    "@id": url2,
    url: url2,
    name: data.seo.metaTitle,
    description: data.seo.metaDescription,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["[data-speakable=ai-overview]"]
    }
  });
  graph.push({
    "@type": "BreadcrumbList",
    itemListElement: data.breadcrumb.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `https://udyamadhar.in${c.href}`
    }))
  });
  if (data.faq.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: data.faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer }
      }))
    });
  }
  graph.push({
    "@type": "Article",
    headline: data.h1,
    description: data.seo.metaDescription,
    author: { "@type": "Organization", name: "Udyam Aadhar Editorial Team" },
    publisher: { "@id": "https://udyamadhar.in/#organization" },
    mainEntityOfPage: url2
  });
  if (data.howto.length) {
    graph.push({
      "@type": "HowTo",
      name: data.h1,
      step: data.howto.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.name,
        text: s.text
      }))
    });
  }
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
}
function cfToSeoPageData(cf) {
  const slugPath = cf.slug.startsWith("/") ? cf.slug : `/${cf.slug}`;
  const canonical = cf.canonicalUrl || `${BASE_URL}${slugPath}`;
  const title = cf.metaTitle || cf.title;
  return {
    slug: cf.slug,
    canonical,
    h1: cf.title || title,
    seo: {
      metaTitle: title,
      metaDescription: cf.metaDescription ?? "",
      canonical,
      ogTitle: title,
      ogDescription: cf.metaDescription ?? "",
      twitterTitle: title,
      twitterDescription: cf.metaDescription ?? "",
      breadcrumb: cf.title || title
    },
    aiOverview: cf.aiOverview ?? { short: "", medium: "" },
    quickFacts: cf.quickFacts ?? [],
    body: cf.bodySections ?? [],
    eeat: {
      experience: cf.eeat?.experience ?? "",
      expertise: cf.eeat?.expertise ?? "",
      trust: cf.eeat?.trust ?? "",
      transparency: cf.eeat?.transparency ?? "",
      disclaimer: cf.eeat?.disclaimer ?? ""
    },
    faq: (cf.faqs ?? []).map((f) => ({ question: f.question, answer: f.answer })),
    internalLinks: cf.internalLinks ?? [],
    cta: {
      hero: cf.ctas?.hero ?? "",
      middle: cf.ctas?.middle ?? "",
      bottom: cf.ctas?.bottom ?? "",
      trust: cf.ctas?.trust ?? "",
      benefits: cf.ctas?.benefits ?? "",
      why: cf.ctas?.why ?? ""
    },
    howto: cf.howto ?? [],
    breadcrumb: [
      { name: "Home", href: "/" },
      { name: cf.title || title, href: slugPath }
    ]
  };
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  const router2 = useRouter();
  const expectedDisconnect = isAbortError(error);
  reactExports.useEffect(() => {
    if (expectedDisconnect) {
      router2.invalidate().finally(reset);
      return;
    }
    console.error(error);
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error, expectedDisconnect, reset, router2]);
  if (expectedDisconnect) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Restoring page…" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$2z = createRootRouteWithContext()({
  loader: async ({ location }) => {
    const [brand, siteContent] = await Promise.all([getCurrentBrand(), getSiteContent()]);
    let cfArticle = null;
    if (brand?.allowAdmin === false) {
      const navPaths = [
        ...siteContent?.headerNav ?? [],
        ...siteContent?.footerNav ?? []
      ].map((n) => n.path);
      const path = location.pathname;
      if (isBlockedOnSecondarySite(path, navPaths)) {
        const slug = path.replace(/^\/+/, "").replace(/\/+$/, "").toLowerCase();
        if (slug && !slug.includes("/")) {
          cfArticle = await getSanitySeoArticle({ data: { slug } }).catch(() => null);
        }
      }
    }
    return { brand, siteContent, cfArticle };
  },
  head: ({ loaderData }) => {
    const brand = loaderData?.brand;
    const verify = brand?.googleSiteVerification || "RtG2UFXWGV5kl4RjhU7eQd6T3tx_DraF1D0WCFYmDAY";
    const siteName = brand?.siteName || "Udyam Aadhar";
    const baseUrl = brand?.baseUrl || "https://udyamadhar.in";
    const title = `${siteName} | MSME Certificate Download`;
    const description = `Consultancy for ${siteName} / MSME registration, certificate updates, downloads, Udyog Aadhaar migration and related registration assistance.`;
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "google-site-verification", content: verify },
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `${baseUrl}/` },
        { property: "og:site_name", content: siteName },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description }
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "icon", type: "image/x-icon", href: brand?.faviconAssetUrl || "/favicon.ico" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        { rel: "preconnect", href: "https://www.googletagmanager.com", crossOrigin: "anonymous" },
        { rel: "preconnect", href: "https://www.google-analytics.com", crossOrigin: "anonymous" },
        { rel: "dns-prefetch", href: "https://www.googletagmanager.com" },
        { rel: "dns-prefetch", href: "https://www.google-analytics.com" }
      ],
      scripts: [
        // GA/Ads gtag is injected from RootComponent after first paint (idle
        // callback) to keep the critical path light for Core Web Vitals.
      ]
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("head", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("script", { dangerouslySetInnerHTML: {
        __html: `
(function(){
  var p = window.location.pathname;
  if (p.startsWith('/admin') || p === '/admin-login' || p.startsWith('/seo-admin')) return;
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  window.gtag = gtag;
  function gtag_report_conversion(url) {
    var callback = function () {
      if (typeof(url) != 'undefined') { window.location = url; }
    };
    gtag('event', 'conversion', {
      'send_to': 'AW-18336340451/7BVbCOm2p9wcEOOzuadE',
      'event_callback': callback
    });
    return false;
  }
  window.gtag_report_conversion = gtag_report_conversion;

  function loadAnalytics() {
    var h = window.location.hostname || '';
    if (!h.includes('udyamregistration')) {
      (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "y1q0o2w4ya");
    }
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NJK5QPPQ');
    gtag('js', new Date());
    gtag('config', 'G-62JC7PRPMM');
    gtag('config', 'AW-18336340451');
    gtag('event', 'conversion', { 'send_to': 'AW-18336340451/XzVkCPHI7eIcEOOzuadE' });
  }

  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadAnalytics, { timeout: 2500 });
  } else {
    setTimeout(loadAnalytics, 1000);
  }
})();
          `
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("noscript", { dangerouslySetInnerHTML: {
        __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NJK5QPPQ" height="0" width="0" style="display:none;visibility:hidden"></iframe>`
      } }),
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$2z.useRouteContext();
  const { brand, siteContent, cfArticle } = Route$2z.useLoaderData() ?? {};
  const router2 = useRouter();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const leafRouteId = useRouterState({
    select: (s) => String(s.matches[s.matches.length - 1]?.routeId ?? "")
  });
  const isAdminPath = path.startsWith("/admin") || path === "/admin-login";
  const bareLayout = isAdminPath;
  const secondarySite = brand?.allowAdmin === false;
  const adminBlocked = isAdminPath && secondarySite;
  const navPaths = [
    ...siteContent?.headerNav ?? [],
    ...siteContent?.footerNav ?? []
  ].map((n) => n.path);
  const contentBlocked = secondarySite && leafRouteId !== "/$" && isBlockedOnSecondarySite(path, navPaths);
  const seenInitial = reactExports.useRef(false);
  reactExports.useEffect(() => {
    let unsub;
    let cancelled = false;
    void import("./client-BX5UfqqR.mjs").then(({ supabase: supabase2 }) => {
      if (cancelled) return;
      const { data: { subscription } } = supabase2.auth.onAuthStateChange((event) => {
        if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
        if (!seenInitial.current) {
          seenInitial.current = true;
        }
        router2.invalidate();
        if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
      });
      unsub = () => subscription.unsubscribe();
    });
    return () => {
      cancelled = true;
      unsub?.();
    };
  }, [router2, queryClient]);
  reactExports.useEffect(() => {
    if (typeof window === "undefined") return;
    if (isAdminPath) return;
    if (document.querySelector('script[data-gtag="1"]')) return;
    const load = () => {
      const s = document.createElement("script");
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=G-62JC7PRPMM";
      s.setAttribute("data-gtag", "1");
      document.head.appendChild(s);
    };
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [isAdminPath]);
  reactExports.useEffect(() => {
    if (typeof window === "undefined" || isAdminPath) return;
    if (window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-18336340451/XzVkCPHI7eIcEOOzuadE"
      });
    }
  }, [path, isAdminPath]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(BrandProvider, { value: brand, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SiteContentProvider, { value: siteContent, children: [
    adminBlocked ? /* @__PURE__ */ jsxRuntimeExports.jsx(NotFoundComponent, {}) : contentBlocked ? /* @__PURE__ */ jsxRuntimeExports.jsx(SiteShell, { children: cfArticle ? /* @__PURE__ */ jsxRuntimeExports.jsx(SeoContentPage, { data: cfToSeoPageData(cfArticle) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(NotFoundComponent, {}) }) : bareLayout ? /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(SiteShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {})
  ] }) }) });
}
const certImg = "/images/udyam-registration-certificate.png";
const UDYAM_SERVICES_LIST = [
  { title: "New Udyam Registration", path: "/new-udyam-registration" },
  { title: "MSME Registration", path: "/new-udyam-registration" },
  { title: "Udyam Certificate Download", path: "/download-udyam-certificate" },
  { title: "MSME Certificate Download", path: "/download-udyam-certificate" },
  { title: "Update Udyam Registration", path: "/update-udyam-certificate" },
  { title: "Verify Udyam Registration", path: "/update-udyam-certificate" },
  { title: "Check Udyam Registration Status", path: "/update-udyam-certificate" },
  { title: "Forgot Udyam Registration Number", path: "/other-problem" },
  { title: "Print Udyam Certificate", path: "/download-udyam-certificate" },
  { title: "Udyam Registration Correction", path: "/update-udyam-certificate" },
  { title: "Udyam Aadhaar", path: "/new-udyam-registration" },
  { title: "Udyog Aadhaar Migration", path: "/migrate-udyog-aadhaar-to-udyam" }
];
function UdyamRegistrationsSections({ seoPages }) {
  const gridPages = seoPages ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 md:px-6 py-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white rounded-xl border border-border p-6 md:p-8 shadow-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl md:text-2xl lg:text-3xl font-bold font-display text-foreground mb-4 border-b border-border pb-3", children: "Udyam Registration & MSME Registration Services" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-slate-700 text-base md:text-lg leading-relaxed", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Apply for Udyam Registration Online through a simple online application designed for eligible Micro, Small, and Medium Enterprises (MSMEs). Whether you are registering a new business, updating your existing Udyam Registration, downloading your Udyam Certificate, recovering your Udyam Registration Number, or managing any other Udyam-related requirement, you can access multiple registration services from one platform." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Our platform supports a wide range of Udyam and MSME-related applications, including New Udyam Registration, MSME Registration, Udyam Certificate Download, Update Udyam Registration, Print Udyam Certificate, Forgot Udyam Registration Number, Verify Udyam Registration, Check Udyam Registration Status, Udyam Registration Correction, Udyam Aadhaar, Udyog Aadhaar Migration, and other registration-related services." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Instead of searching different websites for different requirements, submit your application through one platform designed to simplify multiple Udyam and MSME registration services. Whether your business is newly established or already registered under the MSME framework, you can choose the required service, complete the online application, and manage different registration requirements from one place." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white rounded-xl border border-border p-6 md:p-8 shadow-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl md:text-2xl lg:text-3xl font-bold font-display text-foreground mb-4 border-b border-border pb-3", children: "Apply for Multiple Udyam Services Online" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-slate-700 text-base md:text-lg leading-relaxed mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Business registration requirements change as enterprises grow. A newly established business may need a New Udyam Registration, while an existing enterprise may require a certificate download, registration update, registration correction, verification, or another copy of the Udyam Certificate. Managing these requirements separately can be time-consuming, which is why multiple Udyam-related services are available through one online platform." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Applications can be submitted for MSME Registration, Udyam Registration, Certificate Download, Certificate Printing, Registration Update, Registration Verification, Registration Status, Forgot Udyam Registration Number, Udyam Aadhaar, Udyog Aadhaar Migration, and other registration-related services." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Whether you need a single service or multiple services over time, every application follows a structured online process designed to make submission easier while keeping all major Udyam requirements available in one place." })
      ] }),
      gridPages.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 pt-2", children: gridPages.map((page) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: `/${page.slug}`,
          className: "group flex items-center justify-between rounded-lg border border-border bg-slate-50/70 p-3.5 hover:bg-white hover:border-brand-navy/50 hover:shadow-sm transition-all duration-150",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-md bg-brand-navy/10 text-brand-navy group-hover:bg-brand-navy group-hover:text-white flex items-center justify-center transition-colors shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground text-sm font-display group-hover:text-brand-navy transition-colors truncate", children: page.title })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "w-4 h-4 text-slate-400 group-hover:text-brand-red transition-colors shrink-0 ml-1.5" })
          ]
        },
        page.slug
      )) }) : (
        /* Fallback: show a single CTA link when no Contentful pages are loaded */
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/new-udyam-registration",
            className: "inline-flex items-center gap-2 rounded-lg border border-brand-navy/30 bg-brand-navy/5 px-5 py-3 text-brand-navy font-semibold hover:bg-brand-navy hover:text-white transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-4 h-4" }),
              "Apply Online Now",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "w-4 h-4" })
            ]
          }
        ) })
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white rounded-xl border border-border p-6 md:p-8 shadow-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl md:text-2xl lg:text-3xl font-bold font-display text-foreground mb-4 border-b border-border pb-3", children: "One Platform for Udyam Registration Requirements" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-slate-700 text-base md:text-lg leading-relaxed", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Different businesses require different Udyam-related services depending on their stage of growth. Some applicants are applying for their first Udyam Registration, while others need to update business information, download their Udyam Certificate, print another copy, verify registration details, recover their registration number, or check their application status." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "This platform brings together the most commonly used Udyam and MSME registration services, allowing applicants to complete different registration requirements without visiting multiple portals. From fresh registrations to updates, certificate services, corrections, verification, and registration status, every service is organised to provide a simple online application experience." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Choose the required service, submit your application, and continue your registration journey through one platform designed to support multiple Udyam and MSME-related requirements." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white rounded-xl border border-border p-6 md:p-8 shadow-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl md:text-2xl lg:text-3xl font-bold font-display text-foreground mb-4 border-b border-border pb-3", children: "Start Your Udyam Registration Online Today" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-slate-700 text-base md:text-lg leading-relaxed", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Begin your Udyam Registration Online by selecting the service that matches your requirement. Whether you are applying for New Udyam Registration, MSME Registration, Udyam Certificate Download, Update Udyam Registration, Print Udyam Certificate, Forgot Udyam Registration Number, Registration Verification, Registration Status, Udyam Aadhaar, Udyog Aadhaar Migration, or Udyam Registration Correction, you can complete your application through one simple online process." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "The platform is designed to support multiple registration requirements for eligible business entities, making it easier to submit applications, manage existing registrations, and access Udyam-related services whenever required. Complete your application today and choose the service that best matches your business requirement." })
      ] })
    ] })
  ] });
}
const SITE = "https://udyamadhar.in";
const orgSchema = (baseUrl = SITE) => {
  const isUdyamRegistrations = baseUrl.toLowerCase().includes("udyamregistration");
  const siteUrl = isUdyamRegistrations ? "https://udyamregistrations.in" : baseUrl.replace(/\/+$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Business Help Services",
    legalName: "Business Help Services",
    url: `${siteUrl}/`,
    logo: `${siteUrl}/logo.png`,
    description: "Udyam Registration portal for MSME services. New Udyam Registration, Download Udyam Certificate, Forgot Udyam Certificate, Forgot Udyog Aadhaar, Udyog Aadhaar to Udyam Migration, MSME Certificate and Udyam Update.",
    areaServed: "India",
    knowsAbout: [
      "Udyam Registration",
      "Udyam Registration Certificate",
      "Udyam Aadhar",
      "Udyam Aadhar Certificate",
      "Udyam Login",
      "Udyam Aadhar Portal",
      "Download Udyam Aadhar",
      "Print Udyam Certificate",
      "Forgot Udyam",
      "Forgot Udyam Certificate",
      "Forgot Udyog Aadhar",
      "MSME Registration",
      "MSME Certificate",
      "Download MSME Certificate",
      "Forgot MSME Certificate",
      "Udyam PAN Aadhar Name Correction",
      "Update Udyam Aadhar",
      "Update MSME",
      "Migrate Udyog to Udyam",
      "Forgot Udyam Register Mobile",
      "Download Udyam Certificate",
      "Reprint Udyam Certificate",
      "Update Udyam Certificate",
      "Update Udyam Registration",
      "Update MSME Registration",
      "Modify Udyam Certificate",
      "Edit Udyam Certificate",
      "Udyam Certificate Correction",
      "Udyam Name Correction",
      "Udyam Mobile Number Update",
      "Udyam PAN Update",
      "Udyam Aadhaar Update",
      "Forgot Udyam Registration",
      "Forgot Udyam Mobile Number",
      "Retrieve Udyam Certificate",
      "Recover Udyam Certificate",
      "Udyam Registration Online",
      "Apply Udyam Registration",
      "Udyam Certificate",
      "MSME Registration Online",
      "Register MSME",
      "Register Udyam",
      "Udyam Portal",
      "Udyam Aadhaar",
      "Udyam Aadhaar Registration",
      "Udyam Aadhaar Certificate",
      "Udyam Number",
      "Udyam Registration Number"
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-9767870331",
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: [
        "English",
        "Hindi",
        "Marathi",
        "Bengali",
        "Gujarati",
        "Kannada",
        "Malayalam",
        "Punjabi",
        "Sindhi",
        "Tamil",
        "Telugu",
        "Urdu"
      ]
    },
    sameAs: ["https://www.linkedin.com/company/business-help-services"],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Koregaon Bk, Taluka-Khed",
      addressLocality: "Pune",
      addressRegion: "Maharashtra",
      postalCode: "410505",
      addressCountry: "IN"
    }
  };
};
const websiteSchema = (baseUrl = SITE) => {
  const isUdyamRegistrations = baseUrl.toLowerCase().includes("udyamregistration");
  const siteUrl = isUdyamRegistrations ? "https://udyamregistrations.in" : baseUrl.replace(/\/+$/, "");
  const name = isUdyamRegistrations ? "Udyam Registration" : "Udyam Aadhar";
  const alternateName = isUdyamRegistrations ? "Udyam Registration Portal" : "Udyam Aadhar Portal";
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    alternateName,
    url: `${siteUrl}/`
  };
};
const faqSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a }
  }))
});
const serviceSchema = (s) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: `${s.name} — Business Help Services`,
  serviceType: s.name,
  provider: {
    "@type": "Organization",
    name: "Business Help Services",
    url: `${SITE}/`
  },
  areaServed: { "@type": "Country", name: "India" },
  url: s.url,
  description: s.description
});
const howToSchema = (input) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: input.name,
  ...input.totalTime ? { totalTime: input.totalTime } : {},
  step: input.steps.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.name,
    text: s.text
  }))
});
const breadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: it.url
  }))
});
const jsonLdScript = (data) => ({
  type: "application/ld+json",
  children: JSON.stringify(data)
});
const FAQS$6 = [
  { id: 1, category: "registration", popular: true, q: "What is Udyam registration and who needs it?", a: "Udyam registration is the official Government of India online system for registering Micro, Small and Medium Enterprises (MSMEs). Any business owner, startup, trader, manufacturer, freelancer or service provider running a small or medium enterprise can register to access government benefits, subsidised loans, priority tenders and MSME subsidies." },
  { id: 2, category: "udyog-aadhaar", q: "Is Udyog Aadhaar still valid or not?", a: "Udyog Aadhaar is technically valid for existing holders, but new registrations are no longer accepted. It is strongly recommended to migrate to Udyam Registration to receive instant certification, updated records and access to all current MSME schemes that Udyog Aadhaar can no longer support." },
  { id: 3, category: "registration", popular: true, q: "How can I register for MSME online?", a: "You can register for MSME online by visiting the official Udyam Registration portal (udyamregistration.gov.in). Using your Aadhaar number and PAN, you fill the registration form, submit your business details, complete OTP verification and receive your Udyam certificate instantly — fully paperless and free." },
  { id: 4, category: "documents", popular: true, q: "What documents are needed for Udyam registration?", a: "For Udyam registration you only need your Aadhaar number, PAN, and basic business details such as business type, address, bank account information and NIC code. No physical documents need to be uploaded — the whole process is online and hassle-free." },
  { id: 5, category: "download-print", q: "Is Udyam certificate free to download?", a: "Yes, the Udyam certificate is completely free and can be downloaded any number of times from the official portal. There are no charges for registration, certificate re-download or updates, making MSME registration accessible for every small business." },
  { id: 6, category: "registration", q: "How long does MSME Udyam registration take?", a: "If all required details are ready, Udyam registration usually takes only 5–10 minutes. Instant Aadhaar OTP verification ensures you receive your Udyam Certificate immediately, with no waiting period or follow-up visits." },
  { id: 7, category: "updates-validity", popular: true, q: "Can I update my Udyam registration certificate online?", a: "Yes, the Udyam portal allows you to edit or update details such as business address, turnover, NIC code or contact information. Keeping your records up to date ensures continued eligibility for government schemes, MSME loans and tender participation." },
  { id: 8, category: "download-print", q: "I lost my MSME certificate, how can I get it again?", a: "You can re-download your Udyam certificate anytime using your Aadhaar number or Udyam Registration Number (URN). The process is free and fully online, so you can retrieve your certificate immediately for loans, bank submissions or tenders." },
  { id: 9, category: "udyog-aadhaar", q: "Is Udyam Aadhaar and Udyog Aadhaar the same thing?", a: "No. Udyog Aadhaar is the older MSME registration system, while Udyam Aadhaar is the updated official system that issues instant certification, supports improved tracking and grants eligibility for current government MSME benefits and schemes." },
  { id: 10, category: "registration", q: "Where can I register MSME officially?", a: "You should register only on the official Government of India portal: udyamregistration.gov.in. Registering on the official site ensures your data is secure, registration is completely free, and your certificate is recognised for every official purpose." },
  { id: 11, category: "udyog-aadhaar", q: "How do I download Udyog Aadhaar certificate?", a: "Existing Udyog Aadhaar holders can download their certificates from the old Udyog Aadhaar portal using their UAN and registered mobile number. However, migrating to Udyam Registration is recommended for updated benefits, modern MSME tracking and access to government schemes." },
  { id: 12, category: "fees-benefits", popular: true, q: "Is Udyam registration free?", a: "Yes, Udyam registration is 100% free for all businesses. There are no hidden charges for application, certificate download, updates or re-prints, making it easy for proprietors, startups and small businesses to register." },
  { id: 13, category: "updates-validity", q: "How can I update my Udyam registration number details?", a: "Log in to the Udyam portal using your URN and Aadhaar-linked mobile number. After OTP verification you can edit details such as business name, address, turnover or bank account easily, without having to reapply." },
  { id: 14, category: "updates-validity", q: "Do I need to renew my Udyam certificate every year?", a: "No, Udyam registration is valid for a lifetime. You only need to update your details when there is a change in business structure, turnover, address or activity, so that you remain eligible for MSME schemes." },
  { id: 15, category: "fees-benefits", q: "What is the use of Udyam certificate?", a: "The Udyam certificate is official proof of your MSME status. It helps you access government subsidies, tax rebates, priority sector lending, GST and trademark concessions, and eligibility to participate in tenders and MSME-only schemes." },
  { id: 16, category: "registration", q: "How to register a startup under MSME Udyam?", a: "Startups, freelancers and new founders can register on the Udyam portal using Aadhaar and PAN. Registration is instant and gives you formal recognition for government schemes, bank loans, MSME-only tenders and easier participation in e-tendering." },
  { id: 17, category: "fees-benefits", q: "Are there any charges for MSME registration?", a: "No, Udyam registration is completely free. You can apply, download and update your certificate without paying any government fee, ensuring smooth access to MSME benefits for every small business." },
  { id: 18, category: "registration", q: "Can I register MSME without a GST number?", a: "Yes — businesses not liable for GST can still register for Udyam. If your business is GST registered, the portal will automatically fetch GST details to make the registration faster and error-free." },
  { id: 19, category: "documents", q: "What is Udyam registration number used for?", a: "The Udyam Registration Number (URN) is your unique MSME identifier. It is required for accessing government subsidies, MSME loans, licences, tender participation and verification under various MSME schemes." },
  { id: 20, category: "download-print", q: "How do I download MSME certificate?", a: "To download your MSME certificate, visit the Udyam portal, enter your Aadhaar or URN, complete OTP verification, and download the certificate as a PDF. This digital certificate is valid for every official purpose." },
  { id: 21, category: "registration", q: "Is MSME registration compulsory for all businesses?", a: "No, MSME registration is not legally mandatory, but it is highly beneficial. Registered MSMEs get government subsidies, low-interest loans, MSME-only tenders and a wide range of growth schemes that unregistered businesses cannot access." },
  { id: 22, category: "download-print", q: "What is Udyam card and how to get it?", a: "The Udyam card is simply the downloadable Udyam certificate. After registration on the portal the certificate is issued instantly in PDF format, which can be printed or used digitally for business, banking and tender purposes." },
  { id: 23, category: "updates-validity", q: "Can I edit Udyam registration if I made a mistake?", a: "Yes, the Udyam portal allows corrections anytime. You can edit your business name, address, NIC codes or turnover to keep your official records accurate, without re-applying for a new registration." },
  { id: 24, category: "udyog-aadhaar", q: "My friend told me about Udyog Aadhaar card. Is that still used?", a: "Udyog Aadhaar is now phased out for new registrations. Existing holders are encouraged to migrate to Udyam Registration so they continue to enjoy accurate records, updated benefits and smooth participation in current MSME schemes." },
  { id: 25, category: "troubleshooting", q: "How to check if my MSME is already registered?", a: "You can check your MSME status by entering your Aadhaar or URN on the Udyam portal. The portal will display your registration details instantly, confirming your MSME certification status." },
  { id: 26, category: "registration", q: "Can I register for Udyam on mobile?", a: "Yes, the Udyam portal is fully mobile friendly. You can complete registration, download certificates and update details from any smartphone, which is especially convenient for business owners on the go." },
  { id: 27, category: "registration", q: "Does Udyam registration link with Aadhaar?", a: "Yes, Aadhaar is the primary verification document for Udyam registration. It ensures secure identity verification and is also used for OTP authentication when downloading, updating or reprinting your certificate." },
  { id: 28, category: "udyog-aadhaar", q: "How can I apply for Udyog Aadhaar free registration?", a: "New Udyog Aadhaar registrations are no longer allowed. All MSME registrations must now be completed through the Udyam portal, which is free and provides instant digital MSME certificates." },
  { id: 29, category: "udyog-aadhaar", q: "Is Udyog Aadhaar number different from Udyam number?", a: "Yes. Udyog Aadhaar Number (UAN) is the old ID, while the Udyam Registration Number (URN) is the current official identifier for MSME registration, loans, subsidies and government schemes." },
  { id: 30, category: "udyog-aadhaar", q: "Can I use old Udyog Aadhaar for MSME loan?", a: "Some banks still accept Udyog Aadhaar, but most lenders now prefer Udyam certification. Migrating ensures smoother approval for MSME loans, tenders and participation in current government programmes." },
  { id: 31, category: "documents", q: "What is udyamregistration.gov.in used for?", a: "udyamregistration.gov.in is the official Government of India portal for MSME registration. It lets businesses apply for Udyam, download certificates, edit details and verify URN numbers securely." },
  { id: 32, category: "troubleshooting", q: "My Udyam download is not working, what to do?", a: "If downloading fails, clear your browser cache or try a different browser. Make sure your Aadhaar-linked mobile is reachable so that OTP verification can complete — only then will the certificate download succeed." },
  { id: 33, category: "troubleshooting", q: "Is there a helpline for Udyam certificate issues?", a: "Yes, the Udyam portal provides support via the email and helpline numbers listed on its homepage. You can reach out for assistance with registration, certificate download or verification issues." },
  { id: 34, category: "registration", q: "What is Aadhaar Udyam registration?", a: "Aadhaar Udyam registration refers to registering your MSME using your Aadhaar card. It is a paperless, secure and instant registration process that issues a unique Udyam Number for accessing government schemes and benefits." },
  { id: 35, category: "download-print", q: "How many times can I download MSME Udyam certificate?", a: "You can download your Udyam certificate unlimited times. There are no charges or restrictions, ensuring you can access it whenever required for banks, tenders or government submissions." },
  { id: 36, category: "fees-benefits", popular: true, q: "What are the benefits of Udyam registration certificate?", a: "Udyam registration offers multiple benefits including lower interest rates on loans, government subsidies, tax rebates, easier statutory compliance, collateral-free credit guarantees and eligibility for priority tender participation." },
  { id: 37, category: "fees-benefits", q: "What if I don’t register my MSME under Udyam?", a: "Without Udyam registration, businesses miss out on government schemes, financial incentives, collateral-free MSME loans and priority in tendering. Registration provides official MSME recognition and continued institutional support." },
  { id: 38, category: "troubleshooting", q: "Does Udyam registration require bank account info?", a: "Yes, bank account details are mandatory during registration. Accurate account information ensures smooth disbursal of loans, subsidies and other MSME-related financial benefits straight to your business." },
  { id: 39, category: "documents", q: "How to check my Udyam status after registration?", a: "Log in to the Udyam portal using your Aadhaar and OTP. Your registration status, certificate and full business details will be displayed instantly, confirming successful Udyam registration." },
  { id: 40, category: "troubleshooting", q: "Is Udyam Aadhaar registration different from Udyam registration certificate?", a: "No, they refer to the same process. Udyam Aadhaar registration results in the issuance of the Udyam Registration Certificate, which is valid proof of your MSME status." },
  { id: 41, category: "download-print", q: "Do I need to carry Udyam certificate physically?", a: "A physical copy is not mandatory. You can keep a digital copy on your device or print it when needed for loans, tenders or government schemes — both digital and printed formats are equally valid." },
  { id: 42, category: "updates-validity", q: "Can I register again if I made a mistake in the first attempt?", a: "No, re-registration is not required. Use the portal’s edit feature to correct any mistakes in your existing Udyam registration so that you maintain a single, valid MSME record." },
  { id: 43, category: "updates-validity", q: "Is there a fee for updating Udyam certificate?", a: "No, all updates to your Udyam registration are free. You can edit business information, turnover or address at any time without any charges via the official portal." },
  { id: 44, category: "udyog-aadhaar", q: "I have Udyog Aadhaar, do I need to re-register?", a: "Yes, it is recommended to migrate to Udyam Registration. Migration ensures updated records, access to current MSME schemes and smoother verification for loans, subsidies and government tender participation." },
  { id: 45, category: "udyog-aadhaar", q: "Where can I download Udyog Aadhaar certificate now?", a: "Existing certificates can still be downloaded from the old Udyog Aadhaar portal archive. However, migrating to Udyam is strongly advised for updated benefits and modern MSME tracking." },
  { id: 46, category: "troubleshooting", q: "Can I register my side-business on Udyam too?", a: "Yes, even small side-businesses, home-based ventures or freelancers can register under Udyam. This helps you access MSME loans, subsidies and official recognition under government schemes." },
  { id: 47, category: "udyog-aadhaar", q: "How can I check Udyog Aadhaar number validity?", a: "Check your Udyog Aadhaar number on the old portal. For accuracy and updated benefits, it is recommended to migrate to Udyam and use the URN for all future verification needs." },
  { id: 48, category: "updates-validity", q: "Can I change my Udyam number?", a: "No, your Udyam Number is permanent. However, you can freely update all other business details — address, turnover, NIC codes, bank account — without affecting your registration number." },
  { id: 49, category: "download-print", q: "Do I get a physical Udyam card by post?", a: "No, Udyam registration is completely digital. The certificate is issued as a PDF which you can download, save or print for official purposes such as tender submissions and bank loans." },
  { id: 50, category: "fees-benefits", q: "Will Udyam help in government eTendering?", a: "Yes, Udyam certification is often mandatory for MSMEs to participate in government eTendering. It verifies your MSME status and grants eligibility for preferential treatment in MSME-only tenders." },
  { id: 51, category: "download-print", q: "How does MSME certificate download process work?", a: "Enter your URN or Aadhaar on the Udyam portal, complete OTP verification, and download your certificate in PDF format. The process is instant, paperless and secure for every business owner." },
  { id: 52, category: "updates-validity", q: "Can I cancel my Udyam registration?", a: "The portal does not allow complete cancellation. However, if operations cease you can update your business status to “inactive” so that your records remain accurate." },
  { id: 53, category: "registration", q: "Is MSME registration same for all states?", a: "Yes, Udyam registration is a central Government of India initiative and is valid across all states and union territories. There are no state-specific variations in the registration process or benefits." },
  { id: 54, category: "troubleshooting", q: "What is the benefit of Udyog Aadhaar update?", a: "Updating Udyog Aadhaar ensures all business information is current, which helps in faster verification for MSME loans, subsidies, tenders and government schemes." },
  { id: 55, category: "updates-validity", q: "My Udyam certificate has an error, what to do?", a: "Log in to the portal using your Aadhaar and use the edit option to correct any errors. This ensures your official records match your current business details without re-applying." },
  { id: 56, category: "download-print", q: "Can I reprint my Udyam registration certificate?", a: "Yes, you can reprint your certificate unlimited times. Simply log in using your URN or Aadhaar, complete OTP verification, and download the PDF for printing." },
  { id: 57, category: "registration", q: "Are traders eligible for Udyam certificate registration?", a: "Yes, traders are now eligible under Udyam registration. They can avail MSME benefits including loans, subsidies and priority access to government schemes and tenders." },
  { id: 58, category: "registration", q: "Can I do Udyam registration without PAN card?", a: "No, PAN is mandatory for Udyam registration. It helps verify business ownership, ensures tax compliance and is used alongside Aadhaar for secure registration." },
  { id: 59, category: "troubleshooting", q: "What happens after Udyam registration is done?", a: "After successful registration, your Udyam Certificate is issued instantly and emailed to you. It can be used for loans, tenders, government schemes and as official proof of MSME status." },
  { id: 60, category: "udyog-aadhaar", q: "Is there an expiry for Udyog Aadhaar certificate?", a: "Udyog Aadhaar is being phased out for new registrations. Users are encouraged to migrate to Udyam for lifetime validity and access to modern MSME benefits." },
  { id: 61, category: "updates-validity", q: "What if I register my MSME multiple times?", a: "Multiple registrations can create conflicts in government databases and may affect your eligibility for loans or subsidies. It is recommended to update your existing Udyam registration rather than applying again." },
  { id: 62, category: "updates-validity", q: "How often should I update my Udyam info?", a: "Update your Udyam registration annually, or whenever there is a significant change in business details such as turnover, address or activity, so MSME benefits are not interrupted." },
  { id: 63, category: "troubleshooting", q: "Can foreign-owned companies get Udyam certificate?", a: "Yes, foreign-owned businesses can register under Udyam if they are legally registered in India and meet MSME criteria. They gain access to government schemes and official MSME recognition." },
  { id: 64, category: "documents", q: "Is GST mandatory for Udyam registration?", a: "GST is not mandatory for every business. Only those liable for GST must provide their GST number — others can register using only Aadhaar and PAN without GST." },
  { id: 65, category: "documents", q: "How many NIC codes can I select in Udyam?", a: "You can select multiple NIC (National Industrial Classification) codes to reflect all your business activities accurately. This ensures correct MSME classification for benefits and scheme eligibility." },
  { id: 66, category: "documents", popular: true, q: "What is the Udyam registration process step-by-step?", a: "Visit udyamregistration.gov.in → enter Aadhaar → verify via OTP → fill business details → submit → download certificate. The whole process is instant, paperless and completely free." },
  { id: 67, category: "registration", q: "Can I register Udyam if I’m unemployed but have a business idea?", a: "Yes, anyone planning to start a business or already operating one can register under Udyam. It helps secure formal MSME recognition and unlocks access to financial and government benefits." },
  { id: 68, category: "fees-benefits", q: "What kind of support do MSMEs get after Udyam registration?", a: "Registered MSMEs enjoy government subsidies, priority lending, tax rebates, easier compliance norms, credit guarantee support and eligibility for MSME-only tender participation." },
  { id: 69, category: "fees-benefits", q: "Can I use Udyam number in my invoice or business card?", a: "Yes, displaying your Udyam Number on invoices, business cards and official documents helps prove MSME status and can improve credibility with banks, suppliers and clients." },
  { id: 70, category: "fees-benefits", q: "Should I keep my Udyam certificate printed or soft copy?", a: "It is advisable to keep both digital and printed copies. The soft copy is useful for quick sharing, while the printed certificate may be required for bank loans or tender submissions." },
  { id: 71, category: "documents", q: "How can I complete the MSME registration process online?", a: "Complete MSME registration via the Udyam portal using Aadhaar, PAN and basic business details. The process is free, instant, paperless and issues a verified MSME certificate immediately." },
  { id: 72, category: "download-print", q: "How do I download my Udyam Card?", a: "Visit the Udyam portal, enter your URN, verify via OTP sent to your Aadhaar-linked mobile, and download the Udyam card in PDF format for official and business use." },
  { id: 73, category: "updates-validity", q: "How can I edit my Udyam Registration details?", a: "Log in to the Udyam portal using your URN or Aadhaar, complete OTP verification, and update business details such as address, turnover and activity. All updates are free and reflected immediately." },
  { id: 74, category: "registration", q: "What is Udyam MSME Registration?", a: "Udyam MSME Registration is the official Government of India system for registering Micro, Small and Medium Enterprises. It issues instant certification and grants access to all current MSME schemes and benefits." },
  { id: 75, category: "registration", q: "Is Udyog Aadhaar still active for MSME registration?", a: "No, Udyog Aadhaar is no longer used for new registrations. Existing holders can check their UAN or migrate to Udyam for updated benefits and seamless verification." },
  { id: 76, category: "udyog-aadhaar", q: "How do I find my Udyog Aadhaar Number (UAN)?", a: "Retrieve your UAN by visiting the Udyog Aadhaar portal and entering your registered mobile number. Verify via OTP to access your existing UAN details instantly." },
  { id: 77, category: "registration", q: "Can I still register under Udyog Aadhaar?", a: "No, Udyog Aadhaar registration is discontinued. All new businesses must register via the Udyam portal for MSME recognition and access to government benefits." },
  { id: 78, category: "udyog-aadhaar", q: "How do I update my Udyog Aadhaar details?", a: "Existing Udyog Aadhaar details can be updated on the old portal using your UAN and mobile OTP. However, migration to Udyam is recommended for all future updates and benefits." },
  { id: 79, category: "udyog-aadhaar", q: "What is the Udyog Aadhaar gov.in portal used for?", a: "The portal was originally used for MSME registration under the old system. Today it helps existing users check UAN details and redirects new applicants to Udyam Registration." },
  { id: 80, category: "registration", q: "What services are available on the Udyam Registration portal?", a: "The portal allows MSME registration, certificate download, detail edits, URN verification and access to government MSME schemes — a single-stop digital platform for MSME management." },
  { id: 81, category: "download-print", q: "How can I download my Udyam Aadhaar certificate in PDF format?", a: "Enter your URN or Aadhaar on the portal, complete OTP verification, and download the certificate instantly in PDF. The file is valid for banks, tenders and government submissions." },
  { id: 82, category: "registration", q: "Is MSME registration completely free?", a: "Yes, Udyam registration is fully free. There are no fees or charges, and all downloads, reprints and updates of the certificate are also free of cost." },
  { id: 83, category: "registration", q: "Is udyamregistration.gov.in the official MSME registration website?", a: "Yes, udyamregistration.gov.in is the only government-authorised portal for MSME registration, certificate download and verification, ensuring secure and authentic records." },
  { id: 84, category: "download-print", q: "How can I download my MSME Registration Certificate?", a: "Enter your Udyam Number or Aadhaar on the portal, complete OTP verification, and download the certificate PDF. It can be printed or saved digitally for official use." },
  { id: 85, category: "download-print", q: "How do I download my Udyam Certificate online?", a: "Visit the Udyam portal, enter your URN, complete OTP verification, and download the certificate PDF instantly. It is recognised for every MSME-related purpose." },
  { id: 86, category: "download-print", q: "How can I print my Udyam Registration Certificate online?", a: "Download the certificate PDF from the portal after OTP verification and print it using any standard printer. The printed copy is valid for bank, tender and government submissions." },
  { id: 87, category: "download-print", q: "What details are required to print my Udyam Certificate?", a: "You need your Udyam Registration Number and access to the mobile number linked to your Aadhaar. OTP verification ensures secure download and printing." },
  { id: 88, category: "registration", q: "How do I submit a new Udyam Application for MSME registration?", a: "Visit the Udyam portal, enter Aadhaar, fill business details and complete OTP verification. Submission is instant, and your MSME registration certificate is generated digitally." },
  { id: 89, category: "download-print", q: "Where can I print my MSME Certificate online?", a: "You can print your certificate directly from the Udyam portal by entering your URN and completing OTP verification. The PDF can be printed for loans, tenders and official documentation." },
  { id: 90, category: "download-print", q: "What should I do if I cannot find my MSME/Udyam Number to print the certificate?", a: "Use the “Forgot Udyam Number” option on the portal. Verify with your mobile OTP, retrieve your Udyam Number, and download the certificate securely." },
  { id: 91, category: "udyog-aadhaar", q: "Can I still apply for a new Udyog Aadhaar Registration today?", a: "No, Udyog Aadhaar is discontinued. New businesses must register under Udyam Registration to access MSME benefits and current government schemes." },
  { id: 92, category: "udyog-aadhaar", q: "How do I migrate my old Udyog Aadhaar (UAN) to the new Udyam Registration system?", a: "Enter your Aadhaar and UAN on the Udyam portal, verify via OTP, update business details and submit. Your new Udyam certificate will be issued instantly upon successful migration." },
  { id: 93, category: "download-print", q: "How can I download my Udyam Registration Certificate online?", a: "Enter your URN or Aadhaar on the portal, complete OTP verification, and download the PDF certificate immediately. It serves as valid MSME proof for banks and government schemes." },
  { id: 94, category: "troubleshooting", q: "What is Udyam Aadhaar in MSME registration?", a: "Udyam Aadhaar is the digital MSME registration system that uses Aadhaar authentication. It provides a unique Udyam Number and enables access to government MSME schemes and benefits." },
  { id: 95, category: "registration", q: "How do I apply for MSME registration online?", a: "Use the Udyam portal, enter Aadhaar, provide basic business details, verify via OTP, and submit. Registration is instant, free and paperless." },
  { id: 96, category: "download-print", q: "Where can I download my Udyam Certificate in PDF format?", a: "Visit the official Udyam portal, enter your URN or Aadhaar, verify via OTP, and download the certificate PDF for official or business use." },
  { id: 97, category: "fees-benefits", q: "What is an MSME Certificate and why is it important?", a: "An MSME Certificate verifies your MSME status under Udyam. It is crucial for applying for loans, subsidies, tenders and availing government support programmes designed for small enterprises." },
  { id: 98, category: "download-print", q: "How can I get my MSME certificate online?", a: "Register on the Udyam portal using Aadhaar, complete OTP verification, and download your MSME certificate in PDF format instantly." },
  { id: 99, category: "download-print", q: "How do I download my Udyam Aadhaar certificate?", a: "Enter your Udyam Number on the portal, complete OTP verification, and download your Aadhaar-linked certificate in PDF for official use." },
  { id: 100, category: "download-print", q: "Can I download my Udyam Aadhaar certificate again if I lost it?", a: "Yes, you can re-download your certificate anytime by verifying via OTP using your registered Aadhaar-linked mobile number." },
  { id: 101, category: "download-print", q: "How can I download my Udyam Aadhaar certificate online?", a: "Visit the Udyam portal, verify your Aadhaar-linked mobile number, and download the certificate in PDF format instantly." },
  { id: 102, category: "download-print", q: "How do I print my Udyam certificate?", a: "After downloading the PDF from the Udyam portal, use any printer to print your certificate for official MSME submissions." },
  { id: 103, category: "download-print", q: "What is the process to print my Udyam Certificate?", a: "Enter your URN, download the PDF after OTP verification, and print it. This printed certificate can be used for loans, tenders or official purposes." },
  { id: 104, category: "download-print", q: "How can I print my Udyam Registration details?", a: "Log in with Aadhaar OTP, download your certificate PDF, and print it for submission to banks, government departments or clients." },
  { id: 105, category: "download-print", q: "Can I download and print my Udyam certificate anytime?", a: "Yes, the certificate can be downloaded and printed at any time via the Udyam portal using URN and OTP verification." },
  { id: 106, category: "download-print", q: "How do I reprint my Udyam Registration certificate?", a: "Reprinting is simple — log in using URN or Aadhaar, complete OTP verification, and download the certificate again for printing." },
  { id: 107, category: "download-print", q: "How can I print the Udyam Certificate for bank submission?", a: "Download the PDF from the portal and print it. Banks accept the printed copy for loan applications, collateral verification and MSME benefits." },
  { id: 108, category: "download-print", q: "Is it possible to print the MSME Udyam Certificate online?", a: "Yes, after OTP verification, download the certificate from the portal and print it for official and business purposes." },
  { id: 109, category: "download-print", q: "Can I print my Udyam Certificate using Aadhaar authentication?", a: "Yes, Aadhaar OTP verification enables secure access to download and print your Udyam certificate digitally." },
  { id: 110, category: "download-print", q: "How do I print my MSME certificate online?", a: "Enter your URN on the portal, complete OTP verification, download the PDF, and print it for government, bank or tender submissions." },
  { id: 111, category: "download-print", q: "How can I print my MSME Udyam certificate?", a: "Download the certificate PDF via OTP verification on the Udyam portal and print it for loans, tenders and official documentation." },
  { id: 112, category: "download-print", q: "Where can I download and print my Udyam Certificate?", a: "Use your URN on the official Udyam portal, verify via OTP, download the certificate PDF, and print it easily." },
  { id: 113, category: "download-print", q: "How do I print my Udyam certificate along with the annexure?", a: "Select the “Print with Annexure” option on the portal after OTP verification to download and print both the certificate and annexure together." },
  { id: 114, category: "download-print", q: "How can I download my updated Udyam Aadhaar certificate?", a: "Verify your Aadhaar-linked mobile, enter your URN, and download the updated certificate PDF from the portal — it will reflect your current business details." },
  { id: 115, category: "udyog-aadhaar", q: "How do I download my old Udyog Aadhaar (UAN) certificate?", a: "Enter your UAN and registered mobile number on the Udyog Aadhaar portal to download it. You can also migrate the details to Udyam for an updated registration." }
];
const $$splitComponentImporter$1I = () => import("./index-Cn86cbaQ.mjs");
const HOMEPAGE_TITLE = "Udyam Registration Online | MSME Portal";
const HOMEPAGE_DESC = "Apply for Udyam Registration online — new MSME registration, certificate download, Udyog Aadhaar migration and Udyam updates, with expert help.";
const Route$2y = createFileRoute()({
  loader: async () => {
    const brand = await getCurrentBrand();
    const isUdyamRegistrationsSite = brand.baseUrl.toLowerCase().includes("udyamregistration");
    const [cms, cfFaqs, cfSeoPages] = await Promise.all([
      getSanityLandingPage({
        data: {
          slug: "home"
        }
      }),
      getSanityFaqs(),
      // Only fetch the full SEO page list for the 2nd website (avoids extra
      // round-trip for every visitor on the primary site).
      isUdyamRegistrationsSite ? listSanitySeoPages().catch(() => []) : Promise.resolve([])
    ]);
    const rawFaqs = cfFaqs.length ? cfFaqs.map((f) => ({
      q: f.question,
      a: f.answer
    })) : cms?.faqs?.length ? cms.faqs.map((f) => ({
      q: f.question,
      a: f.answer
    })) : FAQS$6.map((f) => ({
      q: f.q,
      a: f.a
    }));
    const seen = /* @__PURE__ */ new Set();
    const faqs = rawFaqs.filter((f) => {
      const key2 = f.q.trim().toLowerCase();
      if (!f.q.trim() || !f.a.trim() || seen.has(key2)) return false;
      seen.add(key2);
      return true;
    });
    return {
      cms,
      faqs,
      seoPages: cfSeoPages,
      baseUrl: brand.baseUrl,
      siteName: brand.siteName,
      legalEntity: brand.legalEntity
    };
  },
  head: ({
    loaderData
  }) => {
    const ld = loaderData;
    const cms = ld?.cms;
    const baseUrl = ld?.baseUrl || "https://udyamadhar.in";
    ld?.legalEntity || "Business Help Services";
    const title = cms?.metaTitle || HOMEPAGE_TITLE;
    const desc = cms?.metaDescription || HOMEPAGE_DESC;
    const faqList = ld?.faqs ?? [];
    return {
      meta: [{
        title
      }, {
        name: "description",
        content: desc
      }, {
        property: "og:title",
        content: title
      }, {
        property: "og:description",
        content: desc
      }, {
        property: "og:url",
        content: `${baseUrl}/`
      }],
      links: [
        {
          rel: "canonical",
          href: `${baseUrl}/`
        },
        // Preload the LCP image so the browser fetches it before React mounts.
        {
          rel: "preload",
          as: "image",
          href: certImg.url,
          fetchPriority: "high"
        }
      ],
      scripts: [jsonLdScript(orgSchema(baseUrl)), jsonLdScript(faqSchema(faqList)), jsonLdScript(websiteSchema(baseUrl)), ...baseUrl.toLowerCase().includes("udyamregistration") ? [jsonLdScript({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Udyam & MSME Registration Services",
        "itemListElement": UDYAM_SERVICES_LIST.map((srv, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": srv.title,
          "url": `${baseUrl}${srv.path}`
        }))
      })] : []]
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$1I, "component")
});
function titleize(slug) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}
const getArticleBySlug = createServerFn({
  method: "GET"
}).inputValidator((data) => {
  if (!data?.slug || typeof data.slug !== "string") {
    throw new Error("slug required");
  }
  return {
    slug: data.slug.trim().toLowerCase().slice(0, 200)
  };
}).handler(createSsrRpc("de8a02d50774582b4c08f65e0206f58913670b8d18ea311db23be0e45639c1cb"));
const ALLOWED_TAGS = /* @__PURE__ */ new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "blockquote",
  "code",
  "pre",
  "ul",
  "ol",
  "li",
  "a",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  "hr",
  "span",
  "div"
]);
const DROP_CONTENT_TAGS = /* @__PURE__ */ new Set([
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "noscript",
  "template",
  "svg",
  "math"
]);
const VOID_TAGS = /* @__PURE__ */ new Set(["br", "hr"]);
const IMPLICIT_CLOSE = /* @__PURE__ */ new Set(["li", "p", "tr", "td", "th"]);
const ALLOWED_ATTRS = {
  a: /* @__PURE__ */ new Set(["href", "title", "target", "rel"])
};
const URL_ATTRS = /* @__PURE__ */ new Set(["href"]);
const SAFE_SCHEMES = ["http:", "https:", "mailto:", "tel:"];
function escapeText(text) {
  return text.replace(/</g, "&lt;");
}
function escapeAttr(value) {
  return value.replace(/&(?!#\d+;|#x[0-9a-fA-F]+;|[a-zA-Z][a-zA-Z0-9]{1,31};)/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
function isSafeUrl(raw) {
  const value = raw.trim().replace(/[\u0000-\u0020]/g, "");
  if (value.startsWith("//")) return false;
  if (value.startsWith("#") || value.startsWith("/")) return true;
  const scheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.exec(value);
  if (!scheme) return true;
  return SAFE_SCHEMES.includes(scheme[0].toLowerCase());
}
const ATTR_RE = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'`=<>]+)))?/g;
function buildAttrs(tag, rawAttrs) {
  const allowed = ALLOWED_ATTRS[tag];
  if (!allowed) return "";
  let out = "";
  let m;
  ATTR_RE.lastIndex = 0;
  while (m = ATTR_RE.exec(rawAttrs)) {
    const name = m[1].toLowerCase();
    if (!allowed.has(name)) continue;
    const value = m[2] ?? m[3] ?? m[4] ?? "";
    if (URL_ATTRS.has(name) && !isSafeUrl(value)) continue;
    out += ` ${name}="${escapeAttr(value)}"`;
  }
  if (tag === "a" && /\btarget="_blank"/.test(out) && !/\brel="/.test(out)) {
    out += ' rel="noopener noreferrer"';
  }
  return out;
}
const TAG_RE = /<\/?([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/g;
function sanitizeHtmlLite(input) {
  if (!input) return "";
  const html = String(input);
  let out = "";
  let last = 0;
  let skipping = null;
  const openStack = [];
  const cleaned = html.replace(/<!--[\s\S]*?-->/g, "").replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, "").replace(/<![^>]*>/g, "");
  TAG_RE.lastIndex = 0;
  let match;
  while (match = TAG_RE.exec(cleaned)) {
    const [full, rawName, rawAttrs = ""] = match;
    const tag = rawName.toLowerCase();
    const isClosing = full.startsWith("</");
    const text = cleaned.slice(last, match.index);
    last = match.index + full.length;
    if (skipping) {
      if (isClosing && tag === skipping) skipping = null;
      continue;
    }
    out += escapeText(text);
    if (DROP_CONTENT_TAGS.has(tag)) {
      if (!isClosing && !/\/\s*$/.test(rawAttrs)) skipping = tag;
      continue;
    }
    if (!ALLOWED_TAGS.has(tag)) continue;
    if (isClosing) {
      if (VOID_TAGS.has(tag)) continue;
      const idx = openStack.lastIndexOf(tag);
      if (idx === -1) continue;
      for (let i = openStack.length - 1; i >= idx; i--) out += `</${openStack[i]}>`;
      openStack.length = idx;
      continue;
    }
    if (VOID_TAGS.has(tag)) {
      out += `<${tag} />`;
      continue;
    }
    if (IMPLICIT_CLOSE.has(tag) && openStack[openStack.length - 1] === tag) {
      openStack.pop();
      out += `</${tag}>`;
    }
    openStack.push(tag);
    out += `<${tag}${buildAttrs(tag, rawAttrs)}>`;
  }
  out += escapeText(cleaned.slice(last));
  for (let i = openStack.length - 1; i >= 0; i--) out += `</${openStack[i]}>`;
  return out;
}
function sanitizeHtml(html) {
  return sanitizeHtmlLite(html);
}
const proseClasses = "p-6 md:p-8 space-y-4 text-foreground/85 text-[15px] leading-relaxed [&_h1]:font-display [&_h1]:text-brand-navy-deep [&_h1]:text-2xl md:[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-2 [&_h1]:first:mt-0 [&_h2]:font-display [&_h2]:text-brand-navy-deep [&_h2]:text-xl md:[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-7 [&_h2]:first:mt-0 [&_h3]:font-display [&_h3]:text-foreground [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-5 [&_a]:text-brand-navy [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 [&_p]:my-3 [&_strong]:text-foreground";
function ArticlePageLayout({
  h1,
  intro,
  sections,
  faq,
  coverImageUrl,
  related,
  publishedAt,
  updatedAt
}) {
  const dateLabel = updatedAt ?? publishedAt;
  const keyword = (h1.split(/[:\u2014\u2013\-]/)[0] || h1).trim();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 py-6 md:py-8 grid gap-6 lg:grid-cols-2 items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LeadForm, { title: keyword }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card shadow-sm overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-form-header text-white text-center py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold font-display", children: "Sample Certificate" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: certImg$1.url,
              alt: "Sample Udyam Adhar Certificate",
              className: "w-full h-auto rounded-md border border-border",
              loading: "eager",
              fetchPriority: "high"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-center text-sm text-muted-foreground text-slate-950", children: "Note: Sample Udyam Adhar Certificate shown for reference purposes only." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-5xl px-4 pb-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card shadow-sm overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-form-header text-white text-center py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold font-display", children: keyword }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: proseClasses, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "!text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "", className: "text-brand-navy-deep underline", children: h1 }) }),
        dateLabel ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground !my-1", children: [
          "Updated",
          " ",
          new Date(dateLabel).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric"
          })
        ] }) : null,
        coverImageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: coverImageUrl,
            alt: h1,
            className: "my-4 w-full h-auto rounded-xl border border-border",
            loading: "lazy"
          }
        ) : null,
        intro ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-foreground/85 leading-relaxed", children: intro }) : null,
        sections.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          s.h2 ? /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: s.h2 }) : null,
          s.h3 ? /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: s.h3 }) : null,
          s.body_html ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { dangerouslySetInnerHTML: { __html: sanitizeHtml(s.body_html) } }) : null
        ] }, i)),
        faq && faq.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 not-prose", children: faq.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-lg border border-border bg-muted/30 p-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-brand-navy-deep", children: f.q }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "mt-2 text-foreground/85 text-[15px] leading-relaxed",
                  dangerouslySetInnerHTML: { __html: sanitizeHtml(f.a) }
                }
              )
            ]
          },
          i
        )) }) }) : null,
        related && related.length ? /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { "aria-label": "Related articles", className: "mt-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Related reading" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "grid gap-2 sm:grid-cols-2", children: related.map((r) => {
            const path = r.slug.startsWith("/") ? r.slug : `/${r.slug}`;
            return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: path, children: r.label }) }, r.slug);
          }) })
        ] }) : null
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TrustBlock, {})
  ] });
}
function buildArticleJsonLd(args) {
  const slugPath = args.slug.startsWith("/") ? args.slug : `/${args.slug}`;
  const url2 = `${BASE_URL}${slugPath}`;
  const graph = [
    {
      "@type": "Article",
      "@id": `${url2}#article`,
      headline: args.h1,
      description: args.description ?? void 0,
      image: args.coverImageUrl ?? void 0,
      datePublished: args.publishedAt ?? void 0,
      dateModified: args.updatedAt ?? args.publishedAt ?? void 0,
      mainEntityOfPage: url2,
      publisher: { "@id": `${BASE_URL}/#organization` }
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url2}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL + "/" },
        { "@type": "ListItem", position: 2, name: args.h1, item: url2 }
      ]
    }
  ];
  if (args.faq && args.faq.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url2}#faq`,
      mainEntity: args.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a }
      }))
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
const $$splitComponentImporter$1H = () => import("../_-HD2fyM15.mjs");
const $$splitErrorComponentImporter$3 = () => import("../_-nJYeAPcz.mjs");
const $$splitNotFoundComponentImporter$1 = () => import("../_-CT14qYN8.mjs");
const setGoneStatus = () => {
  void import("./server-BvFUsV4_.mjs").then(({
    setResponseStatus
  }) => setResponseStatus(410));
};
const setUnavailableStatus = () => {
  void import("./server-BvFUsV4_.mjs").then(({
    setResponseStatus
  }) => setResponseStatus(503));
};
const WP_HTML = /* @__PURE__ */ Object.assign({
  "../content/wp/aadhaar-udyam.html": () => import("./aadhaar-udyam-BbjuC1yc.mjs").then((m) => m["default"]),
  "../content/wp/aadhar-udyam-certificate.html": () => import("./aadhar-udyam-certificate-BkbFX9iL.mjs").then((m) => m["default"]),
  "../content/wp/aadhar-udyam-print.html": () => import("./aadhar-udyam-print-vx-dUPxo.mjs").then((m) => m["default"]),
  "../content/wp/aadhar-udyam.html": () => import("./aadhar-udyam-BaKfurdu.mjs").then((m) => m["default"]),
  "../content/wp/aadhar-udyog.html": () => import("./aadhar-udyog-BE8FDAxL.mjs").then((m) => m["default"]),
  "../content/wp/about-us.html": () => import("./about-us-fDsiyqMl.mjs").then((m) => m["default"]),
  "../content/wp/about.html": () => import("./about-BodBLOEI.mjs").then((m) => m["default"]),
  "../content/wp/aml-anti-fraud-policy.html": () => import("./aml-anti-fraud-policy-BwATinwR.mjs").then((m) => m["default"]),
  "../content/wp/complaint-grievance-policy.html": () => import("./complaint-grievance-policy-D8-o7EEu.mjs").then((m) => m["default"]),
  "../content/wp/complaint.html": () => import("./complaint-CJvMwxA7.mjs").then((m) => m["default"]),
  "../content/wp/compliance-statement.html": () => import("./compliance-statement-DdTABtRD.mjs").then((m) => m["default"]),
  "../content/wp/consent-acknowledgment.html": () => import("./consent-acknowledgment-BVWHQJU-.mjs").then((m) => m["default"]),
  "../content/wp/contact-us.html": () => import("./contact-us-BJVvH1s5.mjs").then((m) => m["default"]),
  "../content/wp/contact.html": () => import("./contact-Ks0sDs1e.mjs").then((m) => m["default"]),
  "../content/wp/cookie-policy.html": () => import("./cookie-policy-SMTjjTSj.mjs").then((m) => m["default"]),
  "../content/wp/disclaimer.html": () => import("./disclaimer-_VGUCP7E.mjs").then((m) => m["default"]),
  "../content/wp/download-udyam-aadhar.html": () => import("./download-udyam-aadhar-Dt1tz4L1.mjs").then((m) => m["default"]),
  "../content/wp/download-udyam-certificate-online.html": () => import("./download-udyam-certificate-online-Ch0TbEBi.mjs").then((m) => m["default"]),
  "../content/wp/download-udyam-certificate.html": () => import("./download-udyam-certificate-DYwyO4aV.mjs").then((m) => m["default"]),
  "../content/wp/download-udyam.html": () => import("./download-udyam-Du0nrOkt.mjs").then((m) => m["default"]),
  "../content/wp/free-msme-registration-certificate-download.html": () => import("./free-msme-registration-certificate-download-Bd5TqTyE.mjs").then((m) => m["default"]),
  "../content/wp/grievance-redressal-policy.html": () => import("./grievance-redressal-policy-BcgzKdgN.mjs").then((m) => m["default"]),
  "../content/wp/home.html": () => import("./home-DGmyqiC8.mjs").then((m) => m["default"]),
  "../content/wp/https-udyamregistration-gov-in.html": () => import("./https-udyamregistration-gov-in-QMLtiljU.mjs").then((m) => m["default"]),
  "../content/wp/important-notice.html": () => import("./important-notice-BxX8nfdO.mjs").then((m) => m["default"]),
  "../content/wp/ms-me-certificate.html": () => import("./ms-me-certificate-BnNYRV7c.mjs").then((m) => m["default"]),
  "../content/wp/msme-apply-online.html": () => import("./msme-apply-online-Cc8rGVlG.mjs").then((m) => m["default"]),
  "../content/wp/msme-cer.html": () => import("./msme-cer-Cf7fFU0j.mjs").then((m) => m["default"]),
  "../content/wp/msme-certificate-download.html": () => import("./msme-certificate-download-DEDCNyPn.mjs").then((m) => m["default"]),
  "../content/wp/msme-certificate-print.html": () => import("./msme-certificate-print-LFaz_7t0.mjs").then((m) => m["default"]),
  "../content/wp/msme-certificate-registration.html": () => import("./msme-certificate-registration-DEE0WOzE.mjs").then((m) => m["default"]),
  "../content/wp/msme-certificate-update.html": () => import("./msme-certificate-update-8MrQR_T7.mjs").then((m) => m["default"]),
  "../content/wp/msme-online-registration.html": () => import("./msme-online-registration-Z4JWCgtu.mjs").then((m) => m["default"]),
  "../content/wp/msme-print-certificate.html": () => import("./msme-print-certificate-D-PW4tsm.mjs").then((m) => m["default"]),
  "../content/wp/msme-print-udyam-certificate.html": () => import("./msme-print-udyam-certificate-BrtzcWtV.mjs").then((m) => m["default"]),
  "../content/wp/msme-registration-fee.html": () => import("./msme-registration-fee-DsQdK6-9.mjs").then((m) => m["default"]),
  "../content/wp/msme-registration-portal.html": () => import("./msme-registration-portal-N99jbXjz.mjs").then((m) => m["default"]),
  "../content/wp/msme-registration-process.html": () => import("./msme-registration-process-DoxAGMoT.mjs").then((m) => m["default"]),
  "../content/wp/msme-udyam-certificate-download.html": () => import("./msme-udyam-certificate-download-7HqmVfdH.mjs").then((m) => m["default"]),
  "../content/wp/msme-udyam-download.html": () => import("./msme-udyam-download-oeFYP2tm.mjs").then((m) => m["default"]),
  "../content/wp/msme-updation.html": () => import("./msme-updation-dm9v-T5o.mjs").then((m) => m["default"]),
  "../content/wp/notice.html": () => import("./notice-D5GLvOHz.mjs").then((m) => m["default"]),
  "../content/wp/payment-notice-service-acknowledgment.html": () => import("./payment-notice-service-acknowledgment-CM9Nz_bg.mjs").then((m) => m["default"]),
  "../content/wp/payment-notice.html": () => import("./payment-notice-mLmKPOVW.mjs").then((m) => m["default"]),
  "../content/wp/pricing-transparency.html": () => import("./pricing-transparency-BDEu3zJ-.mjs").then((m) => m["default"]),
  "../content/wp/print-udyam-certificate-download.html": () => import("./print-udyam-certificate-download-CizBkn4s.mjs").then((m) => m["default"]),
  "../content/wp/print-udyam-certificate.html": () => import("./print-udyam-certificate-y75EVaIX.mjs").then((m) => m["default"]),
  "../content/wp/print-udyam.html": () => import("./print-udyam-CjgrSQNb.mjs").then((m) => m["default"]),
  "../content/wp/privacy-policy.html": () => import("./privacy-policy-BO49JWCI.mjs").then((m) => m["default"]),
  "../content/wp/refund-cancellation-policy.html": () => import("./refund-cancellation-policy-DnZul6Tq.mjs").then((m) => m["default"]),
  "../content/wp/register-for-msme.html": () => import("./register-for-msme-SHYl_58x.mjs").then((m) => m["default"]),
  "../content/wp/register-msme.html": () => import("./register-msme-DNUp9zmt.mjs").then((m) => m["default"]),
  "../content/wp/service-delivery-policy.html": () => import("./service-delivery-policy-zXEO4wAR.mjs").then((m) => m["default"]),
  "../content/wp/terms-conditions.html": () => import("./terms-conditions-CQP8ZtVd.mjs").then((m) => m["default"]),
  "../content/wp/udham-aadhar-download.html": () => import("./udham-aadhar-download-CvV8eTlk.mjs").then((m) => m["default"]),
  "../content/wp/udhayam-aadhar-download.html": () => import("./udhayam-aadhar-download-DgLzF0zU.mjs").then((m) => m["default"]),
  "../content/wp/udyam-aadhaar-download-pdf.html": () => import("./udyam-aadhaar-download-pdf-DcmR4p6d.mjs").then((m) => m["default"]),
  "../content/wp/udyam-aadhaar-login.html": () => import("./udyam-aadhaar-login-B9MtQwU9.mjs").then((m) => m["default"]),
  "../content/wp/udyam-aadhaar-status.html": () => import("./udyam-aadhaar-status-Ff9GsUf8.mjs").then((m) => m["default"]),
  "../content/wp/udyam-aadhaar.html": () => import("./udyam-aadhaar-DM2e-TgZ.mjs").then((m) => m["default"]),
  "../content/wp/udyam-aadhar.html": () => import("./udyam-aadhar-BfGs-l5a.mjs").then((m) => m["default"]),
  "../content/wp/udyam-adhaar.html": () => import("./udyam-adhaar-D5qaGGqf.mjs").then((m) => m["default"]),
  "../content/wp/udyam-adhar-download.html": () => import("./udyam-adhar-download-CI8w_0cA.mjs").then((m) => m["default"]),
  "../content/wp/udyam-application.html": () => import("./udyam-application-BIxT6V9b.mjs").then((m) => m["default"]),
  "../content/wp/udyam-apply.html": () => import("./udyam-apply-MpYfPFjv.mjs").then((m) => m["default"]),
  "../content/wp/udyam-card-download.html": () => import("./udyam-card-download-BzK9YRpC.mjs").then((m) => m["default"]),
  "../content/wp/udyam-card.html": () => import("./udyam-card-DrEq0_C7.mjs").then((m) => m["default"]),
  "../content/wp/udyam-certificate-apply-online.html": () => import("./udyam-certificate-apply-online-DZ0_zdfp.mjs").then((m) => m["default"]),
  "../content/wp/udyam-certificate-apply.html": () => import("./udyam-certificate-apply-BWvdmj31.mjs").then((m) => m["default"]),
  "../content/wp/udyam-certificate-download-pdf.html": () => import("./udyam-certificate-download-pdf-CRa6Zg4N.mjs").then((m) => m["default"]),
  "../content/wp/udyam-certificate-download.html": () => import("./udyam-certificate-download-DtPX6cOf.mjs").then((m) => m["default"]),
  "../content/wp/udyam-certificate-print.html": () => import("./udyam-certificate-print-HTNgXSuT.mjs").then((m) => m["default"]),
  "../content/wp/udyam-certificate-registration.html": () => import("./udyam-certificate-registration-CG4oJHNb.mjs").then((m) => m["default"]),
  "../content/wp/udyam-certificate-reprint.html": () => import("./udyam-certificate-reprint-Bgjnz2o-.mjs").then((m) => m["default"]),
  "../content/wp/udyam-certificate-status.html": () => import("./udyam-certificate-status-B_PCI9TY.mjs").then((m) => m["default"]),
  "../content/wp/udyam-certificate-update.html": () => import("./udyam-certificate-update-Frm_0e3X.mjs").then((m) => m["default"]),
  "../content/wp/udyam-certificate.html": () => import("./udyam-certificate-BEjOLfuf.mjs").then((m) => m["default"]),
  "../content/wp/udyam-download-certificate.html": () => import("./udyam-download-certificate-DaTSZ3BS.mjs").then((m) => m["default"]),
  "../content/wp/udyam-download-online.html": () => import("./udyam-download-online-BcyS5Qbc.mjs").then((m) => m["default"]),
  "../content/wp/udyam-download.html": () => import("./udyam-download-vlG9SH1T.mjs").then((m) => m["default"]),
  "../content/wp/udyam-msme-certificate-download.html": () => import("./udyam-msme-certificate-download-Dy68Pa-w.mjs").then((m) => m["default"]),
  "../content/wp/udyam-msme-certificate.html": () => import("./udyam-msme-certificate-gfso_HNk.mjs").then((m) => m["default"]),
  "../content/wp/udyam-msme-registration.html": () => import("./udyam-msme-registration-AdR0Kn0h.mjs").then((m) => m["default"]),
  "../content/wp/udyam-msme.html": () => import("./udyam-msme-aBzzGaDt.mjs").then((m) => m["default"]),
  "../content/wp/udyam-number.html": () => import("./udyam-number-D8OwAcuW.mjs").then((m) => m["default"]),
  "../content/wp/udyam-online-registration.html": () => import("./udyam-online-registration-W6aryDXG.mjs").then((m) => m["default"]),
  "../content/wp/udyam-pan-registration.html": () => import("./udyam-pan-registration-BoLJvqIt.mjs").then((m) => m["default"]),
  "../content/wp/udyam-portal.html": () => import("./udyam-portal-v5S0D4tk.mjs").then((m) => m["default"]),
  "../content/wp/udyam-print-certificate.html": () => import("./udyam-print-certificate-bsJP2MjP.mjs").then((m) => m["default"]),
  "../content/wp/udyam-print-download.html": () => import("./udyam-print-download-bUVZzwSw.mjs").then((m) => m["default"]),
  "../content/wp/udyam-print-with-annexure.html": () => import("./udyam-print-with-annexure-B3MBcz9f.mjs").then((m) => m["default"]),
  "../content/wp/udyam-print.html": () => import("./udyam-print-BA9cqCSP.mjs").then((m) => m["default"]),
  "../content/wp/udyam-reg-certificate.html": () => import("./udyam-reg-certificate-DBQCEs39.mjs").then((m) => m["default"]),
  "../content/wp/udyam-register-print.html": () => import("./udyam-register-print-DyV2_n4Z.mjs").then((m) => m["default"]),
  "../content/wp/udyam-register.html": () => import("./udyam-register-Cuz_zp8J.mjs").then((m) => m["default"]),
  "../content/wp/udyam-registration-check.html": () => import("./udyam-registration-check-f685Ja5I.mjs").then((m) => m["default"]),
  "../content/wp/udyam-registration-number-verify.html": () => import("./udyam-registration-number-verify-CutKSSfG.mjs").then((m) => m["default"]),
  "../content/wp/udyam-registration-number.html": () => import("./udyam-registration-number-oS70ZHnX.mjs").then((m) => m["default"]),
  "../content/wp/udyam-registration-online.html": () => import("./udyam-registration-online-VwktAzka.mjs").then((m) => m["default"]),
  "../content/wp/udyam-registration-update.html": () => import("./udyam-registration-update-D7LfvKyV.mjs").then((m) => m["default"]),
  "../content/wp/udyam-regn-certificate.html": () => import("./udyam-regn-certificate-DYUSSYkt.mjs").then((m) => m["default"]),
  "../content/wp/udyam-regn.html": () => import("./udyam-regn-DQW4m1fJ.mjs").then((m) => m["default"]),
  "../content/wp/udyam-update-online.html": () => import("./udyam-update-online-CmnWyFdJ.mjs").then((m) => m["default"]),
  "../content/wp/udyam-update.html": () => import("./udyam-update-vhsDKkKl.mjs").then((m) => m["default"]),
  "../content/wp/udyam.html": () => import("./udyam-MWd47Pe0.mjs").then((m) => m["default"]),
  "../content/wp/udyamregistration-gov-in.html": () => import("./udyamregistration-gov-in-BBxxpPvy.mjs").then((m) => m["default"]),
  "../content/wp/udyamregistration.html": () => import("./udyamregistration-C4psL_H3.mjs").then((m) => m["default"]),
  "../content/wp/udyog-aadhaar-government-in.html": () => import("./udyog-aadhaar-government-in-BTg_c94P.mjs").then((m) => m["default"]),
  "../content/wp/udyog-aadhaar-govin.html": () => import("./udyog-aadhaar-govin-BUpjsZY1.mjs").then((m) => m["default"]),
  "../content/wp/udyog-aadhaar-no.html": () => import("./udyog-aadhaar-no-CIDpb02Z.mjs").then((m) => m["default"]),
  "../content/wp/udyog-aadhaar-number.html": () => import("./udyog-aadhaar-number-B3734Uu5.mjs").then((m) => m["default"]),
  "../content/wp/udyog-aadhaar-update.html": () => import("./udyog-aadhaar-update-XnNdhsLL.mjs").then((m) => m["default"]),
  "../content/wp/udyog-aadhar-certificate-download.html": () => import("./udyog-aadhar-certificate-download-DYk0f_Nt.mjs").then((m) => m["default"]),
  "../content/wp/udyog-aadhar-registration-online.html": () => import("./udyog-aadhar-registration-online-CqJoIIJX.mjs").then((m) => m["default"]),
  "../content/wp/udyog-aadhar-update.html": () => import("./udyog-aadhar-update-I8-yudNU.mjs").then((m) => m["default"]),
  "../content/wp/www-udyamregistration-gov-in.html": () => import("./www-udyamregistration-gov-in-D14TFO_H.mjs").then((m) => m["default"])
});
const GONE_EXACT = /* @__PURE__ */ new Set(["obc-mahamandal-loan-scheme", "pmfme-scheme", "download-udyam-certificate-2", "annasaheb-patil-loan-scheme-documents", "annasaheb-patil-mahamandal-loan-scheme-details", "annasaheb-patil-customer-care", "annasaheb-patil-business-loan", "annasaheb-patil-loi", "udyam-msme-government-portal-for-msme-registration", "udyam-register-how-to-register-your-business-as-msme", "kviconline-all-services-united-in-one-place", "online-kvic-the-new-face-of-digital-khadi", "home", "home-3", "home-2", "shop-act", "nlm-scheme", "cmegp-scheme", "udyam-registration-form-2", "udyam-registration-certificate-download-2"]);
const GONE_PREFIXES = ["annasaheb-patil-", "wp-", "wp_", "xmlrpc", "pmegp", "pmgp-", "pm-egp", "prime-minister-employment-", "kvic-", "kvic_", "kviconline", "elementor-hf", "feed", "category/", "author/", "tag/", "page/", "?p="];
function isGone(slug) {
  if (GONE_EXACT.has(slug)) return true;
  return GONE_PREFIXES.some((p) => slug.startsWith(p));
}
const Route$2x = createFileRoute()({
  loader: async ({
    params
  }) => {
    const raw = (params._splat ?? "").toString();
    if (!raw || raw.startsWith(".")) {
      throw redirect({
        to: "/"
      });
    }
    const stripped = raw.replace(/\/+$/, "");
    const lower = stripped.toLowerCase();
    const firstSeg = lower.split("/")[0] ?? lower;
    if (isGone(lower) || isGone(firstSeg)) {
      setGoneStatus();
      return {
        gone: true
      };
    }
    if (raw !== lower) {
      if (stripped.includes("/")) {
        throw redirect({
          to: "/"
        });
      }
      throw redirect({
        to: "/$",
        params: {
          _splat: lower
        },
        statusCode: 301
      });
    }
    if (stripped.includes("/")) {
      throw redirect({
        to: "/"
      });
    }
    let cmsDown = false;
    const cf = await getSanitySeoArticle({
      data: {
        slug: lower
      }
    }).catch(() => {
      cmsDown = true;
      return null;
    });
    if (cf) return {
      cfArticle: cf
    };
    let dbDown = false;
    const db = await getArticleBySlug({
      data: {
        slug: lower
      }
    }).catch(() => {
      dbDown = true;
      return null;
    });
    if (db?.article) return db;
    const loadHtml = WP_HTML[`../content/wp/${lower}.html`];
    if (loadHtml) {
      const wpHtml = await loadHtml();
      return {
        wpHtml,
        slug: lower
      };
    }
    if (cmsDown || dbDown) {
      setUnavailableStatus();
      return {
        unavailable: true
      };
    }
    throw notFound();
  },
  head: ({
    loaderData
  }) => {
    const cf = loaderData?.cfArticle;
    if (cf) {
      const d = cfToSeoPageData(cf);
      return {
        meta: [{
          title: d.seo.metaTitle
        }, {
          name: "description",
          content: d.seo.metaDescription
        }, {
          property: "og:title",
          content: d.seo.ogTitle
        }, {
          property: "og:description",
          content: d.seo.ogDescription
        }, {
          property: "og:type",
          content: "article"
        }, {
          property: "og:url",
          content: d.canonical
        }, {
          name: "twitter:card",
          content: "summary_large_image"
        }],
        links: [{
          rel: "canonical",
          href: d.canonical
        }],
        scripts: [{
          type: "application/ld+json",
          children: buildSeoJsonLd(d)
        }]
      };
    }
    const wpSlug = loaderData?.wpHtml ? loaderData.slug : null;
    if (wpSlug) {
      const t = `${titleize(wpSlug)} | Udyam Aadhar`;
      return {
        meta: [{
          title: t
        }, {
          property: "og:title",
          content: t
        }, {
          property: "og:type",
          content: "article"
        }, {
          property: "og:url",
          content: `${BASE_URL}/${wpSlug}`
        }],
        links: [{
          rel: "canonical",
          href: `${BASE_URL}/${wpSlug}`
        }]
      };
    }
    const a = loaderData?.article;
    if (!a) {
      if (loaderData?.gone) {
        return {
          meta: [{
            title: "Gone — Udyam Adhar"
          }, {
            name: "robots",
            content: "noindex"
          }]
        };
      }
      if (loaderData?.unavailable) {
        return {
          meta: [{
            title: "Temporarily unavailable — Udyam Aadhar"
          }, {
            name: "robots",
            content: "noindex"
          }]
        };
      }
      return {};
    }
    const slugPath = a.slug.startsWith("/") ? a.slug : `/${a.slug}`;
    const title = a.meta_title ?? a.h1 ?? a.label;
    const description = a.meta_description ?? "";
    const url2 = `${BASE_URL}${slugPath}`;
    const faq = Array.isArray(a.faq) ? a.faq : [];
    return {
      meta: [{
        title
      }, {
        name: "description",
        content: description
      }, {
        property: "og:title",
        content: title
      }, {
        property: "og:description",
        content: description
      }, {
        property: "og:type",
        content: "article"
      }, {
        property: "og:url",
        content: url2
      }, ...a.cover_image_url ? [{
        property: "og:image",
        content: a.cover_image_url
      }] : []],
      links: [{
        rel: "canonical",
        href: url2
      }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify(buildArticleJsonLd({
          slug: a.slug,
          h1: a.h1 ?? a.label,
          description: a.meta_description,
          coverImageUrl: a.cover_image_url,
          publishedAt: a.published_at,
          updatedAt: a.updated_at,
          faq
        }))
      }]
    };
  },
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter$1, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$3, "errorComponent"),
  component: lazyRouteComponent($$splitComponentImporter$1H, "component")
});
const $$splitComponentImporter$1G = () => import("./about-WEY7nzG1.mjs");
const Route$2w = createFileRoute()({
  head: () => ({
    meta: [{
      title: "About Business Help Services — Private Udyam Consultancy"
    }, {
      name: "description",
      content: "About Business Help Services — an independent private consultancy assisting MSMEs with Udyam registration, updates and certificate downloads across India."
    }, {
      property: "og:title",
      content: "About Business Help Services — Private Udyam Consultancy"
    }, {
      property: "og:description",
      content: "Learn about Business Help Services, an independent Udyam & MSME consultancy assisting Indian entrepreneurs."
    }, {
      property: "og:url",
      content: "https://udyamadhar.in/about"
    }],
    links: [{
      rel: "canonical",
      href: "https://udyamadhar.in/about"
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About Business Help Services",
        url: "https://udyamadhar.in/about",
        mainEntity: {
          "@type": "Organization",
          name: "Business Help Services",
          legalName: "Business Help Services",
          url: "https://udyamadhar.in"
        }
      })
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1G, "component")
});
const $$splitComponentImporter$1F = () => import("./about-us-WEY7nzG1.mjs");
const TITLE$6 = "About Our Udyam & MSME Consultancy Team — Business Help Services";
const DESC$6 = "Meet the Business Help Services team — a private Udyam & MSME consultancy helping Indian entrepreneurs with registration, updates and certificate downloads.";
const Route$2v = createFileRoute()({
  head: () => ({
    meta: [{
      title: TITLE$6
    }, {
      name: "description",
      content: DESC$6
    }, {
      property: "og:title",
      content: TITLE$6
    }, {
      property: "og:description",
      content: DESC$6
    }, {
      property: "og:url",
      content: "https://udyamadhar.in/about-us"
    }],
    links: [{
      rel: "canonical",
      href: "https://udyamadhar.in/about-us"
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: TITLE$6,
        description: DESC$6,
        url: "https://udyamadhar.in/about-us",
        mainEntity: {
          "@type": "Organization",
          name: "Business Help Services",
          legalName: "Business Help Services",
          url: "https://udyamadhar.in"
        }
      })
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1F, "component")
});
const $$splitErrorComponentImporter$2 = () => import("./admin-hLTDkWjF.mjs");
const $$splitComponentImporter$1E = () => import("./admin-B6XIxua6.mjs");
const Route$2u = createFileRoute()({
  // Auth check needs browser localStorage (Supabase stores the session there),
  // so the admin subtree opts out of SSR. Without this, any hard refresh on
  // /admin/* runs beforeLoad on the server with no session → redirects to
  // /admin-login → which bounces back to /admin/dashboard, making deep links
  // and refreshes always land on the dashboard.
  ssr: false,
  head: () => ({
    meta: [{
      title: "Admin — Business Help Services"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  beforeLoad: async () => {
    const {
      supabase: supabase2
    } = await import("./client-BX5UfqqR.mjs");
    const {
      data,
      error
    } = await supabase2.auth.getUser();
    if (error || !data.user) throw redirect({
      to: "/admin-login"
    });
    let isStaff = null;
    let lastErr = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) {
        await new Promise((r) => setTimeout(r, 600 * attempt));
        await supabase2.auth.refreshSession().catch(() => void 0);
      }
      const {
        data: res,
        error: roleErr
      } = await supabase2.rpc("has_any_staff_role", {
        _user_id: data.user.id
      });
      if (!roleErr && typeof res === "boolean") {
        isStaff = res;
        break;
      }
      lastErr = roleErr;
    }
    if (isStaff === false) throw redirect({
      to: "/unauthorized"
    });
    if (isStaff !== true) {
      console.warn("[admin] staff role check failed", lastErr);
      throw new Error("Could not verify your access (connection problem). Please reload the page.");
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$1E, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$2, "errorComponent")
});
function safeNext(value) {
  if (typeof value !== "string") return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}
const $$splitComponentImporter$1D = () => import("./admin-login-Besyibfm.mjs");
const Route$2t = createFileRoute()({
  validateSearch: (s) => {
    const next = safeNext(s.next);
    return next ? {
      next
    } : {};
  },
  head: () => ({
    meta: [{
      title: "Admin Sign In — Business Help Services"
    }, {
      name: "description",
      content: "Sign in to the Business Help Services employee CRM and operations portal."
    }, {
      property: "og:title",
      content: "Admin Sign In — Business Help Services"
    }, {
      property: "og:description",
      content: "Sign in to the Business Help Services employee CRM and operations portal."
    }, {
      property: "og:type",
      content: "website"
    }, {
      name: "twitter:card",
      content: "summary"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1D, "component")
});
const $$splitComponentImporter$1C = () => import("./aml-anti-fraud-policy-Bzr38I_6.mjs");
const Route$2s = createFileRoute()({
  head: () => ({
    meta: [{
      title: "AML / Anti-Fraud Policy — Business Help Services Consultancy"
    }, {
      name: "description",
      content: "Anti-money laundering and anti-fraud policy for Business Help Services."
    }, {
      property: "og:title",
      content: "AML / Anti-Fraud Policy"
    }, {
      property: "og:description",
      content: "Read our AML and anti-fraud commitments."
    }],
    links: [{
      rel: "canonical",
      href: "https://udyamadhar.in/aml-anti-fraud-policy"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1C, "component")
});
const $$splitComponentImporter$1B = () => import("./complaint-BZLkwHC2.mjs");
const Route$2r = createFileRoute()({
  head: () => ({
    meta: [{
      title: "File a Complaint — Business Help Services Consultancy"
    }, {
      name: "description",
      content: "Raise a complaint or grievance about your Udyam / MSME registration application. Our team reviews every submission and responds on your registered mobile number."
    }, {
      property: "og:title",
      content: "File a Complaint — Business Help Services"
    }, {
      property: "og:description",
      content: "Raise a complaint or grievance about your Udyam / MSME registration. We review every submission and respond on your registered mobile number."
    }, {
      property: "og:url",
      content: "https://udyamadhar.in/complaint"
    }],
    links: [{
      rel: "canonical",
      href: "https://udyamadhar.in/complaint"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1B, "component")
});
const $$splitComponentImporter$1A = () => import("./complaint-grievance-policy-BZLkwHC2.mjs");
const Route$2q = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Raise a Complaint — Business Help Services"
    }, {
      name: "description",
      content: "Submit a complaint or grievance to Business Help Services. Our team will review and respond within working hours."
    }, {
      property: "og:title",
      content: "Raise a Complaint — Business Help Services"
    }, {
      property: "og:description",
      content: "Submit a complaint or grievance to Business Help Services."
    }],
    links: [{
      rel: "canonical",
      href: "https://udyamadhar.in/complaint-grievance-policy"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1A, "component")
});
const $$splitComponentImporter$1z = () => import("./compliance-statement-Du0pDurR.mjs");
const Route$2p = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Compliance Statement — Business Help Services Consultancy"
    }, {
      name: "description",
      content: "Compliance statement for Business Help Services regarding Business Help Services consultancy."
    }, {
      property: "og:title",
      content: "Compliance Statement"
    }, {
      property: "og:description",
      content: "Read our compliance commitments and obligations."
    }],
    links: [{
      rel: "canonical",
      href: "https://udyamadhar.in/compliance-statement"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1z, "component")
});
const $$splitComponentImporter$1y = () => import("./consent-acknowledgment-BjA0vrs1.mjs");
const Route$2o = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Consents & Acknowledgements — Business Help Services Consultancy"
    }, {
      name: "description",
      content: "Consents and acknowledgements you provide when using Business Help Services for Business Help Services."
    }, {
      property: "og:title",
      content: "Consents & Acknowledgements"
    }, {
      property: "og:description",
      content: "Read the consents and acknowledgements that apply to using our services."
    }],
    links: [{
      rel: "canonical",
      href: "https://udyamadhar.in/consent-acknowledgment"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1y, "component")
});
const $$splitComponentImporter$1x = () => import("./contact-ErJR7mvl.mjs");
const Route$2n = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Contact Us — Business Help Services"
    }, {
      name: "description",
      content: "Get in touch with Business Help Services for Udyam registration, MSME certificate updates, downloads and Udyog Aadhaar migration support — phone, email and office address."
    }, {
      property: "og:title",
      content: "Contact Us — Business Help Services"
    }, {
      property: "og:description",
      content: "Talk to our consultants about Udyam registration, MSME certificate help and Udyog Aadhaar migration — phone, email and office details."
    }],
    links: [{
      rel: "canonical",
      href: "https://udyamadhar.in/contact"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1x, "component")
});
const $$splitComponentImporter$1w = () => import("./contact-us-ErJR7mvl.mjs");
const Route$2m = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Contact Us — Business Help Services Consultancy"
    }, {
      name: "description",
      content: "Contact Business Help Services for Udyam and MSME consultancy assistance by email, phone, or contact form."
    }, {
      property: "og:title",
      content: "Contact Us — Business Help Services"
    }, {
      property: "og:description",
      content: "Reach Business Help Services for support with Udyam and MSME services."
    }],
    links: [{
      rel: "canonical",
      href: "https://www.udyamadhar.in/contact-us"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1w, "component")
});
const $$splitComponentImporter$1v = () => import("./cookie-policy-k8s-YcUK.mjs");
const Route$2l = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Cookie Policy — Business Help Services Consultancy"
    }, {
      name: "description",
      content: "How we use cookies and similar technologies on this website."
    }, {
      property: "og:title",
      content: "Cookie Policy"
    }, {
      property: "og:description",
      content: "Cookie policy for Business Help Services."
    }],
    links: [{
      rel: "canonical",
      href: "https://udyamadhar.in/cookie-policy"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1v, "component")
});
const $$splitComponentImporter$1u = () => import("./disclaimer-CSOGVhFo.mjs");
const Route$2k = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Disclaimer — Business Help Services Consultancy"
    }, {
      name: "description",
      content: "Disclaimer regarding the private consultancy services offered on this website."
    }, {
      property: "og:title",
      content: "Disclaimer"
    }, {
      property: "og:description",
      content: "Important disclaimer from Business Help Services."
    }],
    links: [{
      rel: "canonical",
      href: "https://udyamadhar.in/disclaimer"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1u, "component")
});
const FAQS$5 = [{
  q: "How can I download my Udyam certificate?",
  a: "You can download your Udyam certificate by providing your Udyam Registration Number (URN) and authenticating via OTP sent to your registered mobile number linked with Aadhaar."
}, {
  q: "What if I forgot my Udyam Registration Number (URN)?",
  a: "If you lost or forgot your URN, our team can help retrieve your Udyam Registration Number using your registered Aadhaar, mobile number, or business details."
}, {
  q: "What if my registered mobile number is no longer active?",
  a: "OTP verification requires an active Aadhaar-linked mobile number. If your mobile number has changed, our experts will assist you with the necessary steps to update your contact details first."
}, {
  q: "Is there a fee for downloading the certificate?",
  a: "The government portal does not charge a download fee. Our fee covers professional consultancy and step-by-step assistance in retrieving, verifying, and delivering your official PDF certificate."
}, {
  q: "How long does it take to receive the downloaded Udyam certificate?",
  a: "Once OTP verification is completed, your official digital Udyam certificate PDF is generated immediately and sent to your registered email address."
}];
const STEPS$4 = [{
  name: "Submit details",
  text: "Provide your Udyam Registration Number (URN) or business details for identification."
}, {
  name: "OTP Verification",
  text: "Coordinate the OTP sent to your Aadhaar-linked mobile number for identity verification."
}, {
  name: "Certificate Retrieval",
  text: "We access and fetch your official Udyam Certificate PDF with complete annexures."
}, {
  name: "Email Delivery",
  text: "Your verified Udyam Certificate is delivered directly to your inbox in high-resolution PDF format."
}];
const $$splitComponentImporter$1t = () => import("./download-udyam-certificate-Cz7--a1O.mjs");
const URL$6 = "https://udyamadhar.in/download-udyam-certificate";
const TITLE$5 = "Download Udyam Certificate Online | MSME Certificate";
const DESC$5 = "Download your Udyam (MSME) certificate online with URN or Aadhaar verification. Fast, secure assistance for misplaced or lost Udyam certificates.";
const BLOCKS$5 = [{
  type: "h2",
  text: "When do you need to download your Udyam certificate?"
}, {
  type: "ul",
  items: ["Misplaced or lost original Udyam Certificate PDF.", "Bank loan application, subsidy request, or statutory compliance submission.", "Government tender participation requiring verified MSME proof.", "Requirement for print copy with Annexure."]
}, {
  type: "h2",
  text: "How we assist with your Udyam certificate download"
}, {
  type: "ol",
  items: STEPS$4.map((s) => `${s.name}: ${s.text}`)
}, {
  type: "h2",
  text: "Requirements for Udyam Certificate Download"
}, {
  type: "ul",
  items: ["Udyam Registration Number (URN) or Registered Business Name.", "Aadhaar card details of the proprietor / authorized partner.", "Access to the registered mobile number / email for OTP verification."]
}, {
  type: "note",
  text: "Business Help Services is an independent private consultancy service. We assist with retrieval and download support for business owners."
}, {
  type: "h2",
  text: "Frequently Asked Questions"
}, {
  type: "faq",
  items: FAQS$5
}];
const Route$2j = createFileRoute()({
  loader: async () => ({
    cms: await getSanityServicePage({
      data: {
        slug: "download-udyam-certificate"
      }
    })
  }),
  head: ({
    loaderData
  }) => {
    const cms = loaderData?.cms;
    return {
      meta: [{
        title: cms?.metaTitle || TITLE$5
      }, {
        name: "description",
        content: cms?.metaDescription || DESC$5
      }, {
        property: "og:title",
        content: cms?.metaTitle || TITLE$5
      }, {
        property: "og:description",
        content: cms?.metaDescription || DESC$5
      }, {
        property: "og:url",
        content: URL$6
      }],
      links: [{
        rel: "canonical",
        href: URL$6
      }],
      scripts: [jsonLdScript(serviceSchema({
        name: "Download Udyam Certificate",
        url: URL$6,
        description: DESC$5
      })), jsonLdScript(howToSchema({
        name: "How to download Udyam MSME Certificate online",
        totalTime: "PT10M",
        steps: STEPS$4
      })), jsonLdScript(faqSchema(FAQS$5)), jsonLdScript(breadcrumbSchema([{
        name: "Home",
        url: "https://udyamadhar.in/"
      }, {
        name: "Download Udyam Certificate",
        url: URL$6
      }]))]
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$1t, "component")
});
const $$splitComponentImporter$1s = () => import("./grievance-redressal-policy-CiIdvBkq.mjs");
const Route$2i = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Grievance Redressal Policy — Business Help Services"
    }, {
      name: "description",
      content: "Complaint and grievance redressal policy for Business Help Services consultancy users."
    }, {
      property: "og:title",
      content: "Grievance Redressal Policy"
    }, {
      property: "og:description",
      content: "Complaint and grievance redressal policy from Business Help Services."
    }],
    links: [{
      rel: "canonical",
      href: "https://www.udyamadhar.in/grievance-redressal-policy"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1s, "component")
});
const $$splitComponentImporter$1r = () => import("./important-notice-CtiIj1n6.mjs");
const Route$2h = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Important Notice — Business Help Services Consultancy"
    }, {
      name: "description",
      content: "Important notice and disclaimer regarding the consultancy services offered on this website."
    }, {
      property: "og:title",
      content: "Important Notice"
    }, {
      property: "og:description",
      content: "Important notice and disclaimer from Business Help Services."
    }],
    links: [{
      rel: "canonical",
      href: "https://udyamadhar.in/important-notice"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1r, "component")
});
const Route$2g = createFileRoute()({
  server: {
    handlers: {
      GET: () => new Response(null, {
        status: 301,
        headers: {
          Location: "https://udyamadhar.in/",
          "Cache-Control": "public, max-age=3600"
        }
      })
    }
  }
});
function stripHtml(s) {
  return s.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<svg[\s\S]*?<\/svg>/gi, "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").replace(/\s+/g, " ").trim();
}
const Route$2f = createFileRoute()({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const out = [];
        out.push(`# ${SITE_NAME$1} — Full Content`);
        out.push("");
        out.push(
          `${SITE_NAME$1} is a private consultancy operated by ${LEGAL_ENTITY}.`
        );
        out.push(`Website: ${BASE_URL}`);
        out.push(`Contact: ${CONTACT_EMAIL}`);
        out.push("");
        out.push("---");
        out.push("");
        try {
          const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
          const site = await (await import("./current-website.server-D9vbN4Zc.mjs")).resolveCurrentWebsite(request);
          let { data } = await supabaseAdmin.from("seo_pages").select(
            "slug, label, page_type, h1, meta_title, meta_description, intro, sections, faq"
          ).eq("website_id", site.id).eq("enabled", true).order("sort_order", { ascending: true });
          if (!data || data.length === 0) {
            const { data: fallbackData } = await supabaseAdmin.from("seo_pages").select(
              "slug, label, page_type, h1, meta_title, meta_description, intro, sections, faq"
            ).eq("enabled", true).order("sort_order", { ascending: true });
            data = fallbackData;
          }
          for (const row of data ?? []) {
            const slugPath = row.slug.startsWith("/") ? row.slug : `/${row.slug}`;
            out.push(`## ${row.h1 ?? row.meta_title ?? row.label}`);
            out.push("");
            out.push(`URL: ${BASE_URL}${slugPath}`);
            if (row.meta_description) {
              out.push(`Summary: ${row.meta_description}`);
            }
            out.push("");
            if (row.intro) {
              out.push(stripHtml(row.intro));
              out.push("");
            }
            const sections = Array.isArray(row.sections) ? row.sections : [];
            for (const s of sections) {
              if (s?.h2) out.push(`### ${s.h2}`);
              if (s?.h3) out.push(`#### ${s.h3}`);
              if (s?.body_html) out.push(stripHtml(String(s.body_html)));
              out.push("");
            }
            const faq = Array.isArray(row.faq) ? row.faq : [];
            if (faq.length) {
              out.push("FAQ:");
              for (const f of faq) {
                if (f?.q) out.push(`Q: ${f.q}`);
                if (f?.a) out.push(`A: ${stripHtml(String(f.a))}`);
              }
              out.push("");
            }
            out.push("---");
            out.push("");
          }
        } catch {
        }
        return new Response(out.join("\n"), {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600"
          }
        });
      }
    }
  }
});
const Route$2e = createFileRoute()({
  server: {
    handlers: {
      GET: async ({ request }) => {
        let seoLinks = [];
        try {
          const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
          const { resolveCurrentWebsite } = await import("./current-website.server-D9vbN4Zc.mjs");
          const site = await resolveCurrentWebsite(request);
          let { data } = await supabaseAdmin.from("seo_pages").select("slug, label, meta_description").eq("website_id", site.id).eq("enabled", true).order("sort_order", { ascending: true });
          if (!data || data.length === 0) {
            const { data: fallbackData } = await supabaseAdmin.from("seo_pages").select("slug, label, meta_description").eq("enabled", true).order("sort_order", { ascending: true });
            data = fallbackData;
          }
          seoLinks = (data ?? []).map((r) => ({
            slug: r.slug,
            label: r.label,
            description: r.meta_description
          }));
        } catch {
        }
        const coreServices = [
          ["/udyam-registration", "New Udyam Registration"],
          ["/update-udyam-certificate", "Update Udyam Certificate"],
          ["/download-udyam-certificate", "Download Udyam Certificate"],
          ["/print-udyam-certificate", "Print Udyam Certificate"],
          ["/migrate-udyog-aadhaar-to-udyam", "Udyog Aadhaar to Udyam Migration"]
        ];
        const lines = [];
        lines.push(`# ${SITE_NAME$1}`);
        lines.push("");
        lines.push(
          `> ${SITE_NAME$1} is a private consultancy operated by ${LEGAL_ENTITY} that helps Indian micro, small, and medium enterprises with Udyam / MSME registration, certificate updates, downloads, and Udyog Aadhaar to Udyam migration. We are not affiliated with any government authority.`
        );
        lines.push("");
        lines.push(`Site: ${BASE_URL}`);
        lines.push(`Contact: ${CONTACT_EMAIL}`);
        lines.push("");
        lines.push("## Core services");
        lines.push("");
        for (const [path, label] of coreServices) {
          lines.push(`- [${label}](${BASE_URL}${path})`);
        }
        lines.push("");
        if (seoLinks.length) {
          lines.push("## All pages");
          lines.push("");
          for (const link of seoLinks) {
            const slugPath = link.slug.startsWith("/") ? link.slug : `/${link.slug}`;
            const desc = link.description ? `: ${link.description}` : "";
            lines.push(`- [${link.label}](${BASE_URL}${slugPath})${desc}`);
          }
          lines.push("");
        }
        lines.push("## Reference");
        lines.push("");
        lines.push(`- [Sitemap](${BASE_URL}/sitemap.xml)`);
        lines.push(`- [Full content for LLMs](${BASE_URL}/llms-full.txt)`);
        lines.push("");
        return new Response(lines.join("\n"), {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600"
          }
        });
      }
    }
  }
});
const Route$2d = createFileRoute()({
  server: {
    handlers: {
      ANY: async () => new Response("Not Found", {
        status: 404,
        headers: { "Content-Type": "text/plain" }
      })
    }
  }
});
const FAQS$4 = [{
  q: "Why must Udyog Aadhar be migrated to Udyam?",
  a: "The Government replaced the Udyog Aadhar Memorandum (UAM) system with the Udyam registration system in 2020. Banks, tender authorities and many ministries now recognise only the Udyam certificate. UAM-based registrations are gradually phased out, which is why migration is necessary to retain MSME benefits."
}, {
  q: "Will my Udyog Aadhar Number (UAN) become my Udyam Number?",
  a: "No. Migration generates a fresh Udyam Registration Number (URN). The old UAN is retained as a reference only. The new Udyam certificate, with the new URN, is the valid MSME certificate going forward."
}, {
  q: "What if my UAM details are outdated?",
  a: "If your business details have changed since the original UAM, you should provide the latest information during migration. Our team verifies your inputs against Aadhaar, PAN and GST records before submission to prevent rejection."
}, {
  q: "Can I migrate without the original UAM acknowledgement?",
  a: "Yes. We can retrieve the UAN using your Aadhaar and registered mobile number on the official portal. The acknowledgement copy is helpful but not mandatory."
}, {
  q: "How long does migration take?",
  a: "Most migration cases are completed within 2 to 3 business days once we have your UAN, Aadhaar, PAN and access to the OTP-linked mobile."
}];
const STEPS$3 = [{
  name: "Retrieve / verify your UAN",
  text: "We confirm your existing Udyog Aadhar Number and the linked Aadhaar / PAN records."
}, {
  name: "Update business information",
  text: "Latest investment, turnover, address, NIC activity and bank account are captured for the migration application."
}, {
  name: "Submission & OTP",
  text: "We submit the migration on the official portal and coordinate the Aadhaar-OTP with you."
}, {
  name: "Issuance of new Udyam certificate",
  text: "The Ministry issues a fresh Udyam certificate with a new URN, which we email to you in PDF."
}];
const $$splitComponentImporter$1q = () => import("./migrate-udyog-aadhaar-to-udyam-BLiOYO2B.mjs");
const URL$5 = "https://udyamadhar.in/migrate-udyog-aadhaar-to-udyam";
const TITLE$4 = "Migrate Udyog Aadhar to Udyam | UAM Migration Assistance";
const DESC$4 = "Migrate your existing Udyog Aadhar (UAM) to the new Udyam registration. Consultancy assistance to validate, re-register and obtain a digitally signed Udyam certificate.";
const BLOCKS$4 = [{
  type: "h2",
  text: "Who should migrate?"
}, {
  type: "p",
  text: "Any business possessing a legacy Udyog Aadhaar Memorandum (UAM) issued prior to July 2020 should convert to Udyam to maintain active MSME status and retain access to government benefits."
}, {
  type: "h2",
  text: "Step-by-step migration process"
}, {
  type: "ol",
  items: STEPS$3.map((s) => `${s.name}: ${s.text}`)
}, {
  type: "h2",
  text: "Frequently Asked Questions"
}, {
  type: "faq",
  items: FAQS$4
}];
const Route$2c = createFileRoute()({
  loader: async () => ({
    cms: await getSanityServicePage({
      data: {
        slug: "migrate-udyog-aadhaar-to-udyam"
      }
    })
  }),
  head: ({
    loaderData
  }) => {
    const cms = loaderData?.cms;
    return {
      meta: [{
        title: cms?.metaTitle || TITLE$4
      }, {
        name: "description",
        content: cms?.metaDescription || DESC$4
      }, {
        property: "og:title",
        content: cms?.metaTitle || TITLE$4
      }, {
        property: "og:description",
        content: cms?.metaDescription || DESC$4
      }, {
        property: "og:url",
        content: URL$5
      }],
      links: [{
        rel: "canonical",
        href: URL$5
      }],
      scripts: [jsonLdScript(serviceSchema({
        name: "Migrate Udyog Aadhaar",
        url: URL$5,
        description: DESC$4
      })), jsonLdScript(howToSchema({
        name: "How to migrate Udyog Aadhaar to Udyam",
        totalTime: "P2D",
        steps: STEPS$3
      })), jsonLdScript(faqSchema(FAQS$4)), jsonLdScript(breadcrumbSchema([{
        name: "Home",
        url: "https://udyamadhar.in/"
      }, {
        name: "Migrate Udyog Aadhaar to Udyam",
        url: URL$5
      }]))]
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$1q, "component")
});
const FAQS$3 = [{
  q: "Is Udyam / MSME registration really free on the government portal?",
  a: "Yes. The Ministry of MSME charges ₹0 for Udyam registration, updates, downloads and migrations on the official portal udyamregistration.gov.in. There is no government fee at any step."
}, {
  q: "Then why do private consultancies charge a fee?",
  a: "Private consultancies like Business Help Services charge a professional service fee for time, document verification, NIC code guidance, application drafting, OTP coordination and delivery — not for the registration itself. This is similar to hiring a CA to file your tax return: the filing portal is free, but the professional service is paid."
}, {
  q: "How much does Business Help Services charge?",
  a: "Our charges are flat fees per service and are published on the Pricing Transparency page. There are no hidden costs and no government fee component embedded in our pricing."
}, {
  q: "Is it safe to pay a consultancy for Udyam registration?",
  a: "Yes, as long as the consultancy is transparent about being private and not government-affiliated. Always confirm: (1) the consultancy clearly states it is private, (2) pricing is published, (3) the consultancy never asks for your Aadhaar OTP outside of the official portal screens."
}, {
  q: "What should I do if someone claims to be a government agent and demands a fee?",
  a: "The Ministry of MSME does not appoint individual agents to collect fees for Udyam. If anyone claims to be from the government and demands payment, treat it as a scam. The official portal is udyamregistration.gov.in and it does not charge."
}];
const $$splitComponentImporter$1p = () => import("./msme-registration-fee-3IxPi38e.mjs");
const URL$4 = "https://udyamadhar.in/msme-registration-fee";
const TITLE$3 = "MSME Registration Fee — Government vs Consultancy Charges Explained";
const DESC$3 = "Is MSME (Udyam) registration free? Yes — government fee is ₹0. Understand the difference between official fees and private consultancy charges. Transparent pricing.";
const BLOCKS$3 = [{
  type: "h2",
  text: "Government MSME registration fee"
}, {
  type: "p",
  text: "The Government of India, through the Ministry of MSME, has made the Udyam (MSME) registration process completely free of cost on the official Udyam portal. There is no fee for new registration, updates, downloads or Udyog Aadhar migration. This is a deliberate policy to encourage small businesses to formalise."
}, {
  type: "h2",
  text: "What you may be paying for — consultancy vs government"
}, {
  type: "table",
  headers: ["Item", "Charged by"],
  rows: [["Udyam registration on the official portal", "Government — ₹0"], ["Certificate update on the official portal", "Government — ₹0"], ["Certificate download / reprint", "Government — ₹0"], ["Professional consultancy time", "Private firm (e.g., Business Help Services)"], ["Document verification & error correction", "Private firm"], ["NIC code advice & application drafting", "Private firm"], ["Coordination & email delivery of PDF", "Private firm"]]
}, {
  type: "h2",
  text: "How Business Help Services prices its assistance"
}, {
  type: "ul",
  items: ["Flat per-service fees — published on our Pricing Transparency page.", "No hidden charges, no surprise add-ons.", "No government fee component (because there is none to pay).", "Refund policy clearly stated for cases where the work has not started."]
}, {
  type: "note",
  text: "Important: Business Help Services is a private consultancy. Our fee is for professional service only. The official Udyam portal at udyamregistration.gov.in does not charge any fee."
}, {
  type: "h2",
  text: "Avoiding fake fee scams"
}, {
  type: "p",
  text: "Several websites and SMS scams falsely demand 'government registration fees' for Udyam. The Ministry of MSME has clarified multiple times that no government fee is payable. If any individual or website demands a 'government fee' and is unwilling to clarify whether the amount is a consultancy charge, do not pay."
}, {
  type: "h2",
  text: "Frequently Asked Questions"
}, {
  type: "faq",
  items: FAQS$3
}];
const Route$2b = createFileRoute()({
  loader: async () => {
    const cms = await getSanityServicePage({
      data: {
        slug: "msme-registration-fee"
      }
    });
    return {
      cms
    };
  },
  head: ({
    loaderData
  }) => {
    const cms = loaderData?.cms;
    const title = cms?.metaTitle || TITLE$3;
    const desc = cms?.metaDescription || DESC$3;
    return {
      meta: [{
        title
      }, {
        name: "description",
        content: desc
      }, {
        property: "og:title",
        content: title
      }, {
        property: "og:description",
        content: desc
      }, {
        property: "og:url",
        content: URL$4
      }],
      links: [{
        rel: "canonical",
        href: URL$4
      }],
      scripts: [jsonLdScript(faqSchema(FAQS$3)), jsonLdScript(breadcrumbSchema([{
        name: "Home",
        url: "https://udyamadhar.in/"
      }, {
        name: "MSME Registration Fee",
        url: URL$4
      }]))]
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$1p, "component")
});
const FAQS$2 = [{
  q: "Is new Udyam registration mandatory for my business?",
  a: "It is not legally mandatory, but it is strongly recommended for any business that qualifies as an MSME. Without Udyam registration, you cannot avail MSME-specific benefits such as collateral-free loans, government tender participation, subsidies and protection under the MSMED Act for delayed payments."
}, {
  q: "Can I register for Udyam if I do not have a GST number?",
  a: "Yes. GST is not mandatory for businesses below the GST threshold. For such businesses, Udyam registration is done using PAN and Aadhaar alone. If your business is required to have GST under the GST Act, then your GSTIN must match the PAN provided in your Udyam application."
}, {
  q: "What is the validity of a Udyam registration certificate?",
  a: "The Udyam certificate is valid for the lifetime of the business and does not require renewal. However, if your investment or turnover changes such that your enterprise category changes (for example, from Micro to Small), the system updates this automatically based on annual data from GST and Income Tax filings."
}, {
  q: "What if my Aadhaar mobile number is not active?",
  a: "Aadhaar OTP is mandatory for the registration process. If your registered mobile number is inactive, you must first update it at the nearest Aadhaar enrolment centre before proceeding. Our team can guide you through this prerequisite step."
}, {
  q: "How does Business Help Services assist with new registration?",
  a: "We collect your documents, verify them for mismatches, file the application on your behalf, handle the OTP coordination with you and deliver the digitally signed Udyam certificate to your email. Our consultancy fee covers professional time and is separate from any government cost (which is zero for Udyam)."
}];
const STEPS$2 = [{
  name: "Eligibility & document review",
  text: "Our team checks your business type, Aadhaar, PAN and bank details to confirm MSME eligibility and identify any document mismatches."
}, {
  name: "Application drafting",
  text: "We capture business activity (NIC code), investment, turnover and address details accurately to avoid rejection."
}, {
  name: "OTP-based submission",
  text: "We coordinate the Aadhaar-OTP step with the registered mobile holder and submit the application on the official portal."
}, {
  name: "Certificate delivery",
  text: "The digitally signed Udyam certificate is shared with you via email, typically within 1 to 2 business days of full document submission."
}];
const $$splitComponentImporter$1o = () => import("./new-udyam-registration-CDtdK-BC.mjs");
const URL$3 = "https://udyamadhar.in/new-udyam-registration";
const TITLE$2 = "New Udyam Registration Online | MSME Certificate Assistance";
const DESC$2 = "Apply for new Udyam (MSME) registration with professional consultancy assistance. Eligibility, documents, fees and timelines explained. Private service — pan-India.";
const BLOCKS$2 = [{
  type: "h2",
  text: "Who needs new Udyam registration?"
}, {
  type: "p",
  text: "New Udyam registration is meant for any business — sole proprietorship, partnership, LLP, private limited or HUF — that has never been registered under Udyam or Udyog Aadhar before and qualifies as a Micro, Small, or Medium Enterprise under the Ministry of MSME's investment and turnover thresholds."
}, {
  type: "h2",
  text: "Documents required"
}, {
  type: "ul",
  items: ["Aadhaar card of the proprietor / authorised signatory (with active mobile linked for OTP).", "PAN card of the business (or proprietor for sole proprietorships).", "Bank account details — account number, IFSC.", "Business address proof, GSTIN (if applicable) and NIC code for primary activity."]
}, {
  type: "h2",
  text: "Step-by-step process we handle for you"
}, {
  type: "ol",
  items: STEPS$2.map((s) => `${s.name}: ${s.text}`)
}, {
  type: "h2",
  text: "Fees & timeline"
}, {
  type: "p",
  text: "Government fee for Udyam registration is ₹0. Our professional consultancy fee is a flat charge published on the Pricing Transparency page. Most applications are completed within 1 to 2 business days from receipt of all verified documents."
}, {
  type: "note",
  text: "We are a private consultancy. We do not represent the Government of India. Any fee we collect is for professional service only and is not paid to the government."
}, {
  type: "h2",
  text: "Frequently Asked Questions"
}, {
  type: "faq",
  items: FAQS$2
}];
const Route$2a = createFileRoute()({
  loader: async () => ({
    cms: await getSanityServicePage({
      data: {
        slug: "new-udyam-registration"
      }
    })
  }),
  head: ({
    loaderData
  }) => {
    const cms = loaderData?.cms;
    return {
      meta: [{
        title: cms?.metaTitle || TITLE$2
      }, {
        name: "description",
        content: cms?.metaDescription || DESC$2
      }, {
        property: "og:title",
        content: cms?.metaTitle || TITLE$2
      }, {
        property: "og:description",
        content: cms?.metaDescription || DESC$2
      }, {
        property: "og:url",
        content: URL$3
      }],
      links: [{
        rel: "canonical",
        href: URL$3
      }],
      scripts: [jsonLdScript(serviceSchema({
        name: "New Udyam Registration",
        url: URL$3,
        description: DESC$2
      })), jsonLdScript(howToSchema({
        name: "How to register for Udyam (MSME) — step by step",
        totalTime: "P2D",
        steps: STEPS$2
      })), jsonLdScript(faqSchema(FAQS$2)), jsonLdScript(breadcrumbSchema([{
        name: "Home",
        url: "https://udyamadhar.in/"
      }, {
        name: "New Udyam Registration",
        url: URL$3
      }]))]
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$1o, "component")
});
const $$splitComponentImporter$1n = () => import("./notice-5At-41Mz.mjs");
const Route$29 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Notice — Business Help Services Consultancy"
    }, {
      name: "description",
      content: "Important notice and service information for Business Help Services consultancy users."
    }, {
      property: "og:title",
      content: "Notice — Business Help Services"
    }, {
      property: "og:description",
      content: "Important notice and service information from Business Help Services."
    }],
    links: [{
      rel: "canonical",
      href: "https://www.udyamadhar.in/notice"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1n, "component")
});
const $$splitComponentImporter$1m = () => import("./other-problem-uY6zvDY0.mjs");
const Route$28 = createFileRoute()({
  loader: async () => ({
    cms: await getSanityServicePage({
      data: {
        slug: "other-problem"
      }
    })
  }),
  head: ({
    loaderData
  }) => {
    const cms = loaderData?.cms;
    return {
      meta: [{
        title: cms?.metaTitle || "Other Udyam Problems — Forgot OTP, Mobile, PAN/Aadhaar Issues"
      }, {
        name: "description",
        content: cms?.metaDescription || "Help with forgotten registered mobile/email, PAN/Aadhaar name mismatch, and other Udyam Adhar issues."
      }, {
        property: "og:title",
        content: cms?.metaTitle || "Other Udyam Adhar Problems"
      }, {
        property: "og:description",
        content: cms?.metaDescription || "Get consultancy help for forgotten OTP, mobile/email recovery, PAN/Aadhaar corrections, and more."
      }],
      links: [{
        rel: "canonical",
        href: "https://udyamadhar.in/other-problem"
      }]
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$1m, "component")
});
const $$splitComponentImporter$1l = () => import("./payment-notice-CUvR7o0N.mjs");
const Route$27 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Payment Notice — Business Help Services Consultancy"
    }, {
      name: "description",
      content: "Payment Notice Important Payment &amp; Service Acknowledgment By proceeding with payment on this website, the User acknowledges, understands, and agrees th"
    }, {
      property: "og:title",
      content: "Payment Notice"
    }, {
      property: "og:description",
      content: "Payment Notice Important Payment &amp; Service Acknowledgment By proceeding with payment on this website, the User acknowledges, understands, and agrees th"
    }],
    links: [{
      rel: "canonical",
      href: "https://udyamadhar.in/payment-notice"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1l, "component")
});
const $$splitComponentImporter$1k = () => import("./payment-notice-service-acknowledgment-B2wPAZHR.mjs");
const Route$26 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Payment Notice & Service Acknowledgment — Business Help Services Consultancy"
    }, {
      name: "description",
      content: "Payment notice and service acknowledgment for Business Help Services."
    }, {
      property: "og:title",
      content: "Payment Notice & Service Acknowledgment"
    }, {
      property: "og:description",
      content: "Payment notice and service acknowledgment details."
    }],
    links: [{
      rel: "canonical",
      href: "https://udyamadhar.in/payment-notice-service-acknowledgment"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1k, "component")
});
const $$splitComponentImporter$1j = () => import("./pricing-transparency-C-8mgIU_.mjs");
const Route$25 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Pricing Transparency — Business Help Services Consultancy"
    }, {
      name: "description",
      content: "Transparent pricing for our Business Help Services consultancy and assistance services."
    }, {
      property: "og:title",
      content: "Pricing Transparency"
    }, {
      property: "og:description",
      content: "How our consultancy fees are structured and disclosed."
    }],
    links: [{
      rel: "canonical",
      href: "https://udyamadhar.in/pricing-transparency"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1j, "component")
});
const $$splitComponentImporter$1i = () => import("./privacy-policy-Dc_GDnRf.mjs");
const Route$24 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Privacy Policy — Business Help Services Consultancy"
    }, {
      name: "description",
      content: "How Business Help Services collects, uses, stores and protects your personal information."
    }, {
      property: "og:title",
      content: "Privacy Policy"
    }, {
      property: "og:description",
      content: "Privacy practices for Business Help Services."
    }],
    links: [{
      rel: "canonical",
      href: "https://udyamadhar.in/privacy-policy"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1i, "component")
});
const $$splitComponentImporter$1h = () => import("./refund-cancellation-policy-Bde4XWlZ.mjs");
const Route$23 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Refund & Cancellation Policy — Business Help Services Consultancy"
    }, {
      name: "description",
      content: "Refund and cancellation policy for Business Help Services consultancy services."
    }, {
      property: "og:title",
      content: "Refund & Cancellation Policy"
    }, {
      property: "og:description",
      content: "When and how refunds may be issued for consultancy fees."
    }],
    links: [{
      rel: "canonical",
      href: "https://udyamadhar.in/refund-cancellation-policy"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1h, "component")
});
const Route$22 = createFileRoute()({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url2 = new URL(request.url);
        const origin = `${url2.protocol}//${url2.host}`;
        const body = `# Allow All Search Engines

User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /

User-agent: Googlebot-News
Allow: /

User-agent: Googlebot-Video
Allow: /

User-agent: GoogleOther
Allow: /

User-agent: Google-InspectionTool
Allow: /

User-agent: AdsBot-Google
Allow: /

User-agent: Mediapartners-Google
Allow: /

User-agent: Bingbot
Allow: /

User-agent: AdIdxBot
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: Applebot
Allow: /

User-agent: YandexBot
Allow: /

User-agent: Baiduspider
Allow: /

User-agent: PetalBot
Allow: /

User-agent: SeznamBot
Allow: /

# OpenAI

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: GPTBot
Allow: /

# Anthropic

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

# Perplexity

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

# Meta

User-agent: FacebookBot
Allow: /

User-agent: meta-externalagent
Allow: /

User-agent: meta-externalfetcher
Allow: /

# Social Media

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: Slackbot
Allow: /

User-agent: Discordbot
Allow: /

User-agent: WhatsApp
Allow: /

User-agent: TelegramBot
Allow: /

User-agent: Pinterestbot
Allow: /

# SEO Crawlers

User-agent: AhrefsBot
Allow: /

User-agent: SemrushBot
Allow: /

User-agent: DotBot
Allow: /

User-agent: MJ12bot
Allow: /

User-agent: Screaming Frog SEO Spider
Allow: /

# Monitoring

User-agent: UptimeRobot
Allow: /

User-agent: Pingdom
Allow: /

User-agent: Better Uptime Bot
Allow: /

User-agent: Lighthouse
Allow: /

User-agent: Google Page Speed Insights
Allow: /

# Block admin / internal paths from all crawlers

User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin-login
Disallow: /seo-admin
Disallow: /onboarding/
Disallow: /payment/
Disallow: /payment-pending/
Disallow: /payment-failed/
Disallow: /processing/
Disallow: /success/
Disallow: /apply/
Disallow: /email/

Sitemap: ${origin}/sitemap.xml
`;
        return new Response(body.trim(), {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=86400"
          }
        });
      }
    }
  }
});
const $$splitComponentImporter$1g = () => import("./seo-admin-Bzb0ol6R.mjs");
const Route$21 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "SEO Pages & Sitemap Manager — Admin"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1g, "component")
});
const $$splitComponentImporter$1f = () => import("./service-delivery-policy-DlmScCFb.mjs");
const Route$20 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Service Delivery Policy — Business Help Services Consultancy"
    }, {
      name: "description",
      content: "Service delivery policy for Business Help Services consultancy services."
    }, {
      property: "og:title",
      content: "Service Delivery Policy"
    }, {
      property: "og:description",
      content: "How we deliver our consultancy and assistance services."
    }],
    links: [{
      rel: "canonical",
      href: "https://udyamadhar.in/service-delivery-policy"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1f, "component")
});
const CANONICAL_CLUSTERS = {
  // ── Cluster: /udyam-registration ────────────────────────────────────────
  "udyam-registration-online": "udyam-registration",
  "udyam-registration-process": "udyam-registration",
  "udyam-registration-portal": "udyam-registration",
  "udyam-online-registration": "udyam-registration",
  "udyam-new-registration": "udyam-registration",
  "udyam-msme-registration": "udyam-registration",
  "msme-udyam-registration": "udyam-registration",
  "msme-registration": "udyam-registration",
  "msme-online-registration": "udyam-registration",
  "msme-registration-portal": "udyam-registration",
  "msme-registration-process": "udyam-registration",
  "msme-apply-online": "udyam-registration",
  "register-msme": "udyam-registration",
  "register-for-msme": "udyam-registration",
  "udyam-application": "udyam-registration",
  "udyam-apply": "udyam-registration",
  "udyam-pan-registration": "udyam-registration",
  "udyam-aadhaar-registration": "udyam-registration",
  "udyam-aadhar-registration": "udyam-registration",
  "aadhar-udyam-registration": "udyam-registration",
  "udyam-registration-free": "udyam-registration",
  "msme-registration-free": "udyam-registration",
  // ── Cluster: /udyam-certificate ─────────────────────────────────────────
  "udyam-registration-certificate": "udyam-certificate",
  "udyam-msme-certificate": "udyam-certificate",
  "msme-certificate": "udyam-certificate",
  "ms-me-certificate": "udyam-certificate",
  "msme-cer": "udyam-certificate",
  "udyam-reg-certificate": "udyam-certificate",
  "udyam-regn-certificate": "udyam-certificate",
  "udyam-card": "udyam-certificate",
  "aadhar-udyam-certificate": "udyam-certificate",
  "msme-certificate-registration": "udyam-certificate",
  "udyam-certificate-registration": "udyam-certificate",
  "udyam-certificate-apply": "udyam-certificate",
  "udyam-certificate-apply-online": "udyam-certificate",
  "udyog-aadhar-certificate": "udyam-certificate",
  // ── Cluster: /download-udyam-certificate (download + print + reprint) ──
  "print-udyam-certificate": "download-udyam-certificate",
  "print-msme-certificate": "download-udyam-certificate",
  "print-msme-udyam-certificate": "download-udyam-certificate",
  "msme-print-certificate": "download-udyam-certificate",
  "msme-print-udyam-certificate": "download-udyam-certificate",
  "print-udyam-certificate-download": "download-udyam-certificate",
  "print-udyam": "download-udyam-certificate",
  "msme-udyam-download": "download-udyam-certificate",
  "msme-udyam-certificate-download": "download-udyam-certificate",
  "msme-certificate-download": "download-udyam-certificate",
  "msme-registration-certificate-download": "download-udyam-certificate",
  "udyam-registration-certificate-download": "download-udyam-certificate",
  "udyam-register-certificate-download": "download-udyam-certificate",
  "udyam-certificate-download": "download-udyam-certificate",
  "udyam-certificate-download-pdf": "download-udyam-certificate",
  "udyam-msme-certificate-download": "download-udyam-certificate",
  "udyam-download-certificate": "download-udyam-certificate",
  "udyam-download": "download-udyam-certificate",
  "udyam-download-online": "download-udyam-certificate",
  "udyam-registration-download": "download-udyam-certificate",
  "udyam-print-certificate": "download-udyam-certificate",
  "udyam-print-download": "download-udyam-certificate",
  "udyam-print": "download-udyam-certificate",
  "udyam-print-with-annexure": "download-udyam-certificate",
  "download-msme-certificate": "download-udyam-certificate",
  "download-udyam-certificate-online": "download-udyam-certificate",
  "download-udyam-aadhar": "download-udyam-certificate",
  "download-udyam": "download-udyam-certificate",
  "free-msme-registration-certificate-download": "download-udyam-certificate",
  "udyam-card-download": "download-udyam-certificate",
  "aadhar-udyam-download": "download-udyam-certificate",
  "aadhar-udyam-print": "download-udyam-certificate",
  "udyam-adhar-download": "download-udyam-certificate",
  "udham-aadhar-download": "download-udyam-certificate",
  "udhayam-aadhar-download": "download-udyam-certificate",
  "udyog-aadhaar-download": "download-udyam-certificate",
  "udyog-aadhar-certificate-download": "download-udyam-certificate",
  "udyog-aadhar-download": "download-udyam-certificate",
  "udyam-aadhaar-download-pdf": "download-udyam-certificate",
  // ── Cluster: /udyam-registration-number ─────────────────────────────────
  "udyam-registration-number-verify": "udyam-registration-number",
  "verify-udyam-certificate": "udyam-registration-number",
  "forgot-udyam-registration-number": "udyam-registration-number",
  "udyam-number": "udyam-registration-number",
  "udyam-aadhaar-verify": "udyam-registration-number",
  "udyam-registration-check": "udyam-registration-number",
  "udyog-aadhaar-no": "udyam-registration-number",
  "udyog-aadhaar-number": "udyam-registration-number",
  // ── Cluster: /udyam-registration-update ─────────────────────────────────
  "udyam-certificate-update": "udyam-registration-update",
  "udyam-update": "udyam-registration-update",
  "udyam-update-online": "udyam-registration-update",
  "udyam-edit": "udyam-registration-update",
  "msme-certificate-update": "udyam-registration-update",
  "msme-updation": "udyam-registration-update",
  "udyog-aadhar-update": "udyam-registration-update",
  "udyog-aadhaar-update": "udyam-registration-update",
  // ── Cluster: /udyam-registration-status ─────────────────────────────────
  "udyam-certificate-status": "udyam-registration-status",
  "udyam-aadhaar-status": "udyam-registration-status",
  // ── Cluster: /udyam-login ───────────────────────────────────────────────
  "msme-registration-login": "udyam-login",
  "udyam-aadhaar-login": "udyam-login",
  // ── Cluster: /udyam-reprint ─────────────────────────────────────────────
  "udyam-certificate-reprint": "udyam-reprint",
  "udyam-certificate-print": "udyam-reprint",
  "udyam-register-print": "udyam-reprint",
  // ── Cluster: /udyog-aadhaar (Udyog Aadhaar / old-portal cluster) ───────
  "udyog-aadhaar-government-in": "udyog-aadhaar",
  "udyog-aadhaar-govin": "udyog-aadhaar",
  "udyog-aadhaar-register": "udyog-aadhaar",
  "udyog-aadhar-card": "udyog-aadhaar",
  "udyog-aadhar": "udyog-aadhaar",
  "udyog-aadhar-free-registration": "udyog-aadhaar",
  "udyog-aadhar-registration": "udyog-aadhaar",
  "udyog-aadhar-registration-2": "udyog-aadhaar",
  "udyog-aadhar-registration-online": "udyog-aadhaar",
  "udhar-aadhar-registration": "udyog-aadhaar",
  "aadhar-udyog-registration": "udyog-aadhaar",
  "aadhar-udyog": "udyog-aadhaar",
  "msme-udyog-aadhar": "udyog-aadhaar",
  "www-udyamregistration": "udyog-aadhaar",
  "www-udyamregistration-gov-in": "udyog-aadhaar",
  "udyamregistration-gov-in": "udyog-aadhaar",
  "udyamregistration": "udyog-aadhaar",
  "https-udyamregistration-gov-in": "udyog-aadhaar",
  "udyam-aadhaar": "udyog-aadhaar",
  "udyam-aadhar": "udyog-aadhaar",
  "udyam-adhaar": "udyog-aadhaar",
  "udyam-adhar-2": "udyog-aadhaar",
  "aadhaar-udyam": "udyog-aadhaar",
  "aadhar-udyam": "udyog-aadhaar",
  "udyam-msme": "udyog-aadhaar",
  "udyam": "udyog-aadhaar",
  "udyam-portal": "udyog-aadhaar",
  // ── Cluster: /migrate-udyog-aadhaar-to-udyam ────────────────────────────
  "udyog-aadhaar-to-udyam-migration": "migrate-udyog-aadhaar-to-udyam",
  // ── Cluster: /msme-registration-fee ─────────────────────────────────────
  "msme-registration-charges": "msme-registration-fee"
};
const VARIANT_SLUGS = new Set(Object.keys(CANONICAL_CLUSTERS));
const EXCLUDED_PREFIXES = [
  "/api",
  "/admin",
  "/admin-login",
  "/seo-admin",
  "/onboarding",
  "/payment",
  "/payment-pending",
  "/payment-failed",
  "/processing",
  "/success",
  "/apply",
  "/email",
  "/lovable",
  "/mcp",
  "/.mcp",
  "/.well-known"
];
const HIGH_PRIORITY = /* @__PURE__ */ new Set([
  "/",
  // Batch 1 SEO pages
  "/udyam-registration",
  "/udyam-registration-online",
  "/udyam-registration-process",
  "/udyam-registration-number",
  "/udyam-registration-status",
  "/udyam-registration-fee",
  "/udyam-registration-free",
  "/udyam-registration-benefits",
  "/udyam-registration-eligibility",
  "/udyam-registration-documents-required",
  "/udyam-registration-certificate",
  "/udyam-registration-update",
  "/udyam-certificate",
  "/udyam-login",
  "/forgot-udyam-registration-number",
  "/download-udyam-certificate",
  "/print-udyam-certificate",
  "/verify-udyam-certificate",
  "/msme-registration",
  "/msme-certificate-benefits",
  // Other top-funnel
  "/udyam-aadhar-registration",
  "/new-udyam-registration",
  "/update-udyam-certificate",
  "/migrate-udyog-aadhaar-to-udyam",
  "/msme-registration-fee"
]);
function isExcluded(p, applyVariantClusters = false) {
  if (p === "/sitemap.xml" || p === "/llms.txt" || p === "/llms-full.txt") return true;
  if (p.includes("$") || p.includes("*") || p.includes("[") || p.includes("]") || p.startsWith("/.") || p.includes("mcp") || p.includes("oauth"))
    return true;
  if (p === "/home" || p === "/index.html" || p === "/unauthorized" || p === "/not-found" || p === "/404") return true;
  const slug = p.replace(/^\/+/, "");
  if (applyVariantClusters && VARIANT_SLUGS.has(slug)) return true;
  return EXCLUDED_PREFIXES.some((pre) => p === pre || p.startsWith(pre + "/"));
}
const BUILTIN_STATIC_ROUTES = [
  "/",
  "/about-us",
  "/contact-us",
  "/terms-conditions",
  "/privacy-policy",
  "/refund-cancellation-policy",
  "/service-delivery-policy",
  "/pricing-transparency",
  "/disclaimer",
  "/cookie-policy",
  "/important-notice",
  "/grievance-redressal-policy",
  "/complaint-grievance-policy",
  "/compliance-statement",
  "/consent-acknowledgment",
  "/aml-anti-fraud-policy",
  "/talk-to-expert",
  "/udyam-registration",
  "/new-udyam-registration",
  "/download-udyam-certificate",
  "/print-udyam-certificate",
  "/verify-udyam-certificate",
  "/update-udyam-certificate",
  "/forgot-udyam-registration-number",
  "/msme-registration",
  "/msme-registration-fee",
  "/migrate-udyog-aadhaar-to-udyam"
];
const Route$1$ = createFileRoute()({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const reqUrl = new URL(request.url);
        const SITE_BASE = `${reqUrl.protocol}//${reqUrl.host}`;
        const { resolveCurrentWebsite } = await import("./current-website.server-D9vbN4Zc.mjs");
        const { isBlockedOnSecondarySite: isBlockedOnSecondarySite2 } = await Promise.resolve().then(() => secondarySiteRoutes);
        const currentSite = await resolveCurrentWebsite(request).catch(() => null);
        const publicOnly = currentSite ? !currentSite.allow_admin : false;
        let navPaths = [];
        if (publicOnly && currentSite?.id) {
          try {
            const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
            const { data } = await supabaseAdmin.from("site_nav_items").select("path").eq("website_id", currentSite.id);
            navPaths = (data ?? []).map((r) => r.path ?? "").filter(Boolean);
          } catch {
          }
        }
        const siteBlocked = (p) => publicOnly && isBlockedOnSecondarySite2(p, navPaths);
        const mod = await Promise.resolve().then(() => routeTree_gen);
        const tree = mod.routeTree;
        const all = [...BUILTIN_STATIC_ROUTES];
        const walk = (node) => {
          if (!node || typeof node !== "object") return;
          const rawPath = node.fullPath || node.id || node.path || node.options?.path;
          if (typeof rawPath === "string" && rawPath && rawPath.startsWith("/")) {
            all.push(rawPath);
          }
          const ch = node.children;
          if (ch) {
            if (Array.isArray(ch)) {
              ch.forEach((child) => walk(child));
            } else if (typeof ch === "object") {
              Object.values(ch).forEach((child) => walk(child));
            }
          }
        };
        walk(tree);
        const routePaths = all.filter((p) => typeof p === "string").map((p) => p.length > 1 ? p.replace(/\/$/, "") : p).map((p) => p.toLowerCase()).filter((p) => !isExcluded(p, false) && !siteBlocked(p));
        const STATIC_LASTMOD = "2026-07-11";
        const entries = /* @__PURE__ */ new Map();
        for (const p of routePaths) entries.set(p, { path: p, lastmod: STATIC_LASTMOD });
        try {
          const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
          let query = supabaseAdmin.from("seo_pages").select("slug, updated_at").eq("enabled", true);
          if (currentSite?.id) {
            query = query.or(`website_id.eq.${currentSite.id},website_id.is.null`);
          }
          const { data } = await query;
          for (const row of data ?? []) {
            const slug = row.slug?.trim().toLowerCase();
            if (!slug) continue;
            let path = slug.startsWith("/") ? slug : `/${slug}`;
            path = path.length > 1 ? path.replace(/\/$/, "") : path;
            if (isExcluded(path, false)) continue;
            const raw = row.updated_at;
            const lastmod = raw ? raw.slice(0, 10) : STATIC_LASTMOD;
            entries.set(path, { path, lastmod });
          }
        } catch {
        }
        try {
          const { listContentfulPageSlugsForWebsite } = await import("./sitemap.server-BRMRj-I2.mjs");
          let cfSlugs = currentSite?.id ? await listContentfulPageSlugsForWebsite(currentSite.id) : [];
          if (!cfSlugs || cfSlugs.length === 0) {
            const { listContentfulSeoSlugs } = await import("./client.functions-WMvtjq1i.mjs");
            const globalCf = await listContentfulSeoSlugs().catch(() => []);
            cfSlugs = globalCf.map((g) => ({
              slug: g.slug,
              title: g.slug,
              canonicalUrl: g.canonicalUrl,
              updatedAt: g.updatedAt,
              contentType: "seoArticle"
            }));
          }
          for (const row of cfSlugs) {
            const path = `/${row.slug.replace(/^\/+/, "")}`;
            if (isExcluded(path, false)) continue;
            if (row.canonicalUrl) {
              let canonicalPath = row.canonicalUrl.trim().toLowerCase();
              canonicalPath = canonicalPath.replace(/^https?:\/\/[^/]+/, "");
              canonicalPath = canonicalPath.replace(/^[^/]+\.[a-z]{2,}/, "");
              if (canonicalPath && !canonicalPath.startsWith("/")) canonicalPath = `/${canonicalPath}`;
              canonicalPath = canonicalPath.replace(/\/$/, "");
              if (canonicalPath && canonicalPath !== path) continue;
            }
            entries.set(path, { path, lastmod: row.updatedAt || STATIC_LASTMOD });
          }
        } catch {
        }
        if (currentSite?.id) {
          try {
            const { loadSitemapExclusions } = await import("./sitemap.server-BRMRj-I2.mjs");
            const excluded = await loadSitemapExclusions(currentSite.id);
            for (const path of excluded) entries.delete(path);
          } catch {
          }
        }
        const sorted = Array.from(entries.values()).sort(
          (a, b) => a.path.localeCompare(b.path)
        );
        const urls = sorted.map((e) => {
          const priority = HIGH_PRIORITY.has(e.path) ? "1.0" : e.path.length < 25 ? "0.8" : "0.6";
          const changefreq = e.path === "/" ? "weekly" : "monthly";
          return [
            "  <url>",
            `    <loc>${SITE_BASE}${e.path}</loc>`,
            `    <lastmod>${e.lastmod}</lastmod>`,
            `    <changefreq>${changefreq}</changefreq>`,
            `    <priority>${priority}</priority>`,
            "  </url>"
          ].join("\n");
        });
        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...urls,
          "</urlset>"
        ].join("\n");
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            // Newly published CMS pages must show up right away, so the
            // sitemap is only briefly cached and always revalidated.
            "Cache-Control": "public, max-age=60, must-revalidate"
          }
        });
      }
    }
  }
});
const $$splitComponentImporter$1e = () => import("./talk-to-expert-BKyQnzxs.mjs");
const Route$1_ = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Talk to an Expert — Udyam / MSME Consultation ₹99"
    }, {
      name: "description",
      content: "Stuck with an Udyam / MSME issue? Book a ₹99 consultation with our expert and get a tailored next step within working hours."
    }, {
      property: "og:title",
      content: "Talk to an Expert — Business Help Services"
    }, {
      property: "og:description",
      content: "Paid expert consultation for Udyam, MSME, PAN/Aadhaar and related issues. ₹99 + GST."
    }],
    links: [{
      rel: "canonical",
      href: "https://udyamadhar.in/talk-to-expert"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1e, "component")
});
const $$splitComponentImporter$1d = () => import("./terms-conditions-Bl5QVRAc.mjs");
const Route$1Z = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Terms & Conditions — Business Help Services Consultancy"
    }, {
      name: "description",
      content: "Terms and conditions governing the use of Business Help Services consultancy services on this website."
    }, {
      property: "og:title",
      content: "Terms & Conditions"
    }, {
      property: "og:description",
      content: "Terms and conditions for Business Help Services."
    }],
    links: [{
      rel: "canonical",
      href: "https://udyamadhar.in/terms-conditions"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1d, "component")
});
const $$splitComponentImporter$1c = () => import("./unauthorized-TKzTz6kb.mjs");
const Route$1Y = createFileRoute()({
  ssr: false,
  head: () => ({
    meta: [{
      title: "Unauthorized — Business Help Services"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1c, "component")
});
const FAQS$1 = [{
  q: "What details can I update on my Udyam certificate?",
  a: "You can update business name, registered address, additional activities (NIC codes), bank account, contact details, organisation type, investment and turnover. Every update is OTP-verified and reflected in a freshly signed certificate."
}, {
  q: "What if my registered mobile number is no longer active?",
  a: "If the mobile linked to your Udyam (or to Aadhaar) is inactive, you cannot receive the OTP. Our team will guide you through the official process to update the Aadhaar mobile first, and then proceed with the Udyam edit."
}, {
  q: "Is updating Udyam a paid government service?",
  a: "The government does not charge a fee for updates. Our charge is a professional consultancy fee for handling the documentation, OTP coordination, submission and certificate delivery."
}, {
  q: "How long does an update take?",
  a: "Most updates are completed within 1 to 2 business days. Updates that involve mobile-number changes or Aadhaar correction can take longer because of the upstream dependencies."
}, {
  q: "Will updating change my Udyam Registration Number (URN)?",
  a: "No. The URN remains the same for the lifetime of your business. Only the details on the certificate change, and a new digitally signed certificate is issued with the same URN."
}];
const STEPS$1 = [{
  name: "Specify what you want to change",
  text: "Share the exact fields to be updated (e.g., new address, additional NIC code)."
}, {
  name: "Document verification",
  text: "Our team checks that the new details match your Aadhaar, PAN, GST and supporting proofs."
}, {
  name: "Portal edit & OTP",
  text: "We submit the edit on the official portal and coordinate the OTP with your registered mobile/email."
}, {
  name: "Updated certificate delivery",
  text: "The freshly signed Udyam certificate is emailed to you with the same URN."
}];
const $$splitComponentImporter$1b = () => import("./update-udyam-certificate-hb9W8s1l.mjs");
const URL$2 = "https://udyamadhar.in/update-udyam-certificate";
const TITLE$1 = "Update Udyam Certificate Online | Edit MSME Details";
const DESC$1 = "Update your Udyam (MSME) certificate — change business name, address, NIC activity, bank or contact details. Professional consultancy assistance, pan-India.";
const BLOCKS$1 = [{
  type: "h2",
  text: "When you should update your Udyam certificate"
}, {
  type: "ul",
  items: ["Business name change or rebrand.", "Shift of registered office address.", "Adding or removing a business activity (NIC code).", "Change of bank account.", "Change of contact mobile or email.", "Change of organisation type (e.g., proprietorship to LLP)."]
}, {
  type: "h2",
  text: "How we handle your update"
}, {
  type: "ol",
  items: STEPS$1.map((s) => `${s.name}: ${s.text}`)
}, {
  type: "h2",
  text: "Documents you should keep ready"
}, {
  type: "ul",
  items: ["Existing Udyam certificate (or URN).", "Aadhaar of the registered proprietor / signatory.", "Proof of new detail being updated (e.g., new address proof).", "Active access to the registered mobile / email for OTP."]
}, {
  type: "note",
  text: "Government fee for updating the Udyam certificate is ₹0. We charge a transparent professional fee published on our Pricing Transparency page."
}, {
  type: "h2",
  text: "Frequently Asked Questions"
}, {
  type: "faq",
  items: FAQS$1
}];
const Route$1X = createFileRoute()({
  loader: async () => ({
    cms: await getSanityServicePage({
      data: {
        slug: "update-udyam-certificate"
      }
    })
  }),
  head: ({
    loaderData
  }) => {
    const cms = loaderData?.cms;
    return {
      meta: [{
        title: cms?.metaTitle || TITLE$1
      }, {
        name: "description",
        content: cms?.metaDescription || DESC$1
      }, {
        property: "og:title",
        content: cms?.metaTitle || TITLE$1
      }, {
        property: "og:description",
        content: cms?.metaDescription || DESC$1
      }, {
        property: "og:url",
        content: URL$2
      }],
      links: [{
        rel: "canonical",
        href: URL$2
      }],
      scripts: [jsonLdScript(serviceSchema({
        name: "Update Udyam Certificate",
        url: URL$2,
        description: DESC$1
      })), jsonLdScript(howToSchema({
        name: "How to update Udyam (MSME) certificate details",
        totalTime: "P2D",
        steps: STEPS$1
      })), jsonLdScript(faqSchema(FAQS$1)), jsonLdScript(breadcrumbSchema([{
        name: "Home",
        url: "https://udyamadhar.in/"
      }, {
        name: "Update Udyam Certificate",
        url: URL$2
      }]))]
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$1b, "component")
});
const FAQS = [{
  q: "How do I verify a Udyam certificate?",
  a: "A Udyam certificate is verified using the 19-character Udyam Registration Number (URN) printed on it, along with the mobile number or email registered with that Udyam application for OTP confirmation."
}, {
  q: "What details are confirmed during verification?",
  a: "Verification confirms the enterprise name, type of organisation, major activity, social category, enterprise classification (micro, small or medium), date of incorporation and date of Udyam registration."
}, {
  q: "Can I verify a supplier's or vendor's Udyam certificate?",
  a: "Yes. Buyers, banks and tender authorities commonly verify a vendor's MSME status before extending MSME benefits or processing payments under the MSME payment rules."
}, {
  q: "What if the verification shows no record?",
  a: "If no record appears, the number may be mistyped, the certificate may relate to an old Udyog Aadhaar that was never migrated, or the registration may have been cancelled. Our team can help you check and correct it."
}, {
  q: "Is verification the same as downloading the certificate?",
  a: "No. Verification only confirms the registration details are genuine. Downloading a fresh PDF copy of the certificate is a separate process that requires OTP authentication on the registered contact."
}];
const STEPS = [{
  name: "Share the URN",
  text: "Provide the 19-character Udyam Registration Number shown on the certificate you want verified."
}, {
  name: "Details check",
  text: "We check the registration record for enterprise name, classification and registration date."
}, {
  name: "OTP confirmation",
  text: "Where required, an OTP on the registered mobile or email confirms ownership of the registration."
}, {
  name: "Verification summary",
  text: "You receive a clear summary of what the record shows, plus next steps if anything is incorrect."
}];
const $$splitComponentImporter$1a = () => import("./verify-udyam-certificate-hw4aPIr5.mjs");
const URL$1 = "https://udyamadhar.in/verify-udyam-certificate";
const TITLE = "Verify Udyam Certificate Online | Check Udyam Registration";
const DESC = "Verify a Udyam (MSME) certificate online using the Udyam Registration Number. Confirm enterprise name, type, category and registration date with expert assistance.";
const BLOCKS = [{
  type: "h2",
  text: "Why verify a Udyam certificate?"
}, {
  type: "ul",
  items: ["Confirm a supplier or vendor genuinely holds MSME status before allowing MSME benefits.", "Support a bank loan, subsidy or tender application that requires proof of registration.", "Check that your own enterprise details are recorded correctly after registration or an update.", "Detect an outdated Udyog Aadhaar that was never migrated to Udyam."]
}, {
  type: "h2",
  text: "How verification works"
}, {
  type: "ol",
  items: STEPS.map((s) => `${s.name}: ${s.text}`)
}, {
  type: "h2",
  text: "What you need"
}, {
  type: "ul",
  items: ["The Udyam Registration Number (URN) from the certificate.", "Access to the mobile number or email registered with the Udyam application, when OTP confirmation is needed.", "The enterprise name as printed on the certificate, for cross-checking."]
}, {
  type: "note",
  text: "Business Help Services is an independent private consultancy. We assist business owners with verification support and are not affiliated with any government department."
}, {
  type: "h2",
  text: "Frequently Asked Questions"
}, {
  type: "faq",
  items: FAQS
}];
const Route$1W = createFileRoute()({
  loader: async () => ({
    cms: await getSanityServicePage({
      data: {
        slug: "verify-udyam-certificate"
      }
    }).catch(() => null)
  }),
  head: ({
    loaderData
  }) => {
    const cms = loaderData?.cms;
    return {
      meta: [{
        title: cms?.metaTitle || TITLE
      }, {
        name: "description",
        content: cms?.metaDescription || DESC
      }, {
        property: "og:title",
        content: cms?.metaTitle || TITLE
      }, {
        property: "og:description",
        content: cms?.metaDescription || DESC
      }, {
        property: "og:type",
        content: "website"
      }, {
        property: "og:url",
        content: URL$1
      }],
      links: [{
        rel: "canonical",
        href: URL$1
      }],
      scripts: [jsonLdScript(serviceSchema({
        name: "Verify Udyam Certificate",
        url: URL$1,
        description: DESC
      })), jsonLdScript(howToSchema({
        name: "How to verify a Udyam MSME certificate online",
        totalTime: "PT10M",
        steps: STEPS
      })), jsonLdScript(faqSchema(FAQS)), jsonLdScript(breadcrumbSchema([{
        name: "Home",
        url: "https://udyamadhar.in/"
      }, {
        name: "Verify Udyam Certificate",
        url: URL$1
      }]))]
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$1a, "component")
});
const Route$1V = createFileRoute()({
  server: {
    handlers: {
      ANY: async () => new Response("Not Found", {
        status: 404,
        headers: { "Content-Type": "text/plain" }
      })
    }
  }
});
const Route$1U = createFileRoute()({
  server: {
    handlers: {
      ANY: async () => new Response("Not Found", {
        status: 404,
        headers: { "Content-Type": "text/plain" }
      })
    }
  }
});
const $$splitComponentImporter$19 = () => import("./admin.index-Yle-HQBj.mjs");
const Route$1T = createFileRoute()({
  component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
const $$splitComponentImporter$18 = () => import("./admin.activity-DIp74GXk.mjs");
const Route$1S = createFileRoute()({
  component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
const Route$1R = createFileRoute()({
  // Only the bare list redirects; child /admin/applications/$id has its own redirect to the order page.
  beforeLoad: ({ location }) => {
    if (location.pathname.replace(/\/$/, "") === "/admin/applications") throw redirect({ to: "/admin/orders" });
  }
});
const $$splitComponentImporter$17 = () => import("./admin.assignment-history-DPGZMDJF.mjs");
const Route$1Q = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Assignment History & Leaves — Udyam Ops OS"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
const $$splitComponentImporter$16 = () => import("./admin.attendance-DlJyL4_D.mjs");
const Route$1P = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Attendance & Payroll — Udyam Ops OS"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
const $$splitComponentImporter$15 = () => import("./admin.audit-dhzWG4TF.mjs");
const Route$1O = createFileRoute()({
  component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
const $$splitComponentImporter$14 = () => import("./admin.canned-responses-C-B8gaXi.mjs");
const Route$1N = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Canned Responses — Udyam Ops OS"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
const $$splitComponentImporter$13 = () => import("./admin.certificates-YN79SL5s.mjs");
const Route$1M = createFileRoute()({
  beforeLoad: async () => {
    const {
      supabase: supabase2
    } = await import("./client-BX5UfqqR.mjs");
    const {
      data: {
        user
      }
    } = await supabase2.auth.getUser();
    if (!user) throw redirect({
      to: "/admin-login"
    });
    const {
      data
    } = await supabase2.from("user_roles").select("role").eq("user_id", user.id).in("role", ["admin", "super_admin"]);
    if (!data || data.length === 0) throw redirect({
      to: "/admin/my-work"
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
const $$splitComponentImporter$12 = () => import("./admin.complaints-54VzYLsU.mjs");
const Route$1L = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Complaints & Contact Submissions — Udyam Ops OS"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
const $$splitComponentImporter$11 = () => import("./admin.customers-DjAwmb44.mjs");
const Route$1K = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Customers — CRM"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  beforeLoad: async () => {
    const {
      supabase: supabase2
    } = await import("./client-BX5UfqqR.mjs");
    const {
      data: u
    } = await supabase2.auth.getUser();
    if (!u.user) throw redirect({
      to: "/admin-login"
    });
    const {
      data: rows
    } = await supabase2.from("user_roles").select("role").eq("user_id", u.user.id);
    const roles = (rows ?? []).map((r) => r.role);
    if (!roles.includes("admin") && !roles.includes("super_admin")) {
      throw redirect({
        to: "/admin/my-work"
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
const $$splitComponentImporter$10 = () => import("./admin.dashboard-DENCBo0P.mjs");
const searchSchema$1 = object({
  preset: fallback(_enum(["today", "yesterday", "7d", "15d", "30d", "mtd", "custom"]), "today").default("today"),
  from: fallback(string().optional(), void 0).optional(),
  to: fallback(string().optional(), void 0).optional()
});
const Route$1J = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Dashboard — Udyam Ops OS"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  validateSearch: zodValidator(searchSchema$1),
  beforeLoad: async () => {
    const {
      supabase: supabase2
    } = await import("./client-BX5UfqqR.mjs");
    const {
      data: u
    } = await supabase2.auth.getUser();
    if (!u.user) return;
    const {
      data: rows
    } = await supabase2.from("user_roles").select("role").eq("user_id", u.user.id);
    const roles = (rows ?? []).map((r) => r.role);
    if (!roles.includes("admin") && !roles.includes("super_admin")) {
      throw redirect({
        to: "/admin/my-work"
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
const $$splitComponentImporter$$ = () => import("./admin.dispute-manager-tu-id2Z_.mjs");
const Route$1I = createFileRoute()({
  beforeLoad: async () => {
    const {
      supabase: supabase2
    } = await import("./client-BX5UfqqR.mjs");
    const {
      data: {
        user
      }
    } = await supabase2.auth.getUser();
    if (!user) throw redirect({
      to: "/admin-login"
    });
    const {
      data
    } = await supabase2.from("user_roles").select("role").eq("user_id", user.id);
    const roles = (data ?? []).map((r) => r.role);
    const allowed = ["super_admin", "admin", "operations", "finance", "accounts", "manager", "executive"];
    if (!roles.some((r) => allowed.includes(r))) {
      throw redirect({
        to: "/admin/my-work"
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$$, "component")
});
const $$splitComponentImporter$_ = () => import("./admin.documents-DvF6jJVy.mjs");
const Route$1H = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Documents — Udyam Ops OS"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  beforeLoad: async () => {
    const {
      supabase: supabase2
    } = await import("./client-BX5UfqqR.mjs");
    const {
      data: u
    } = await supabase2.auth.getUser();
    if (!u.user) throw redirect({
      to: "/admin-login"
    });
    const {
      data: rows
    } = await supabase2.from("user_roles").select("role").eq("user_id", u.user.id);
    const roles = (rows ?? []).map((r) => r.role);
    if (!roles.includes("admin") && !roles.includes("super_admin")) {
      throw redirect({
        to: "/admin/my-work"
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$_, "component")
});
const $$splitComponentImporter$Z = () => import("./admin.email-templates-Cyp00es2.mjs");
const Route$1G = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Email Templates — Udyam Ops OS"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$Z, "component")
});
const $$splitComponentImporter$Y = () => import("./admin.emails-ms98ovLZ.mjs");
const Route$1F = createFileRoute()({
  component: lazyRouteComponent($$splitComponentImporter$Y, "component")
});
const $$splitComponentImporter$X = () => import("./admin.employees-6f1qeyFY.mjs");
const Route$1E = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Workforce Management — Udyam Ops OS"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$X, "component")
});
const $$splitComponentImporter$W = () => import("./admin.finance-BNKy7jOz.mjs");
const Route$1D = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Revenue & Payments — Business Help CRM"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$W, "component")
});
const $$splitComponentImporter$V = () => import("./admin.gateways-BdkHaVfN.mjs");
const Route$1C = createFileRoute()({
  component: lazyRouteComponent($$splitComponentImporter$V, "component")
});
const getPipelineHealth = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("3e692d70973f4a11e54fa6da52e86b5d5cc0d0f8f85eb3d5c75ed9fe3c69ab65"));
const getProcessingErrors = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  status: _enum(["new", "retrying", "resolved", "failed", "dismissed", "all"]).default("new"),
  page: number$1().int().min(1).default(1),
  limit: number$1().int().min(1).max(100).default(30)
}).parse(i)).handler(createSsrRpc("149ee577f7b0a3af6727fea443b5b65c956be4e65a9dd1a4640814fe84c3966a"));
const retryProcessingError = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid()
}).parse(i)).handler(createSsrRpc("9bfeccd8321347372a8a9d8ae37859585d198ac98b49c265ab28fbe3a9735c85"));
const createTicketFromProcessingError = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  id: string().uuid(),
  customerId: string().uuid().optional(),
  applicationId: string().uuid().optional()
}).parse(i)).handler(createSsrRpc("25bd823752ad6f1d56a44ec9b1238c2af05a0553dd118cc4c16c24f012d91820"));
const searchEmailAuditTrace = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  query: string().trim().min(1).max(200)
}).parse(i)).handler(createSsrRpc("4d32bcdb7e184bc01f23d4af7fcf66399d581a4f09cc0d90db737adfc2d8b221"));
const pollInboxNow = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  limit: number$1().int().min(1).max(200).default(50)
}).parse(i ?? {})).handler(createSsrRpc("1adb81ec67c9714414753a32764ba32fca21b9bed5deadf0bec39eeeb2de966b"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  limit: number$1().int().min(1).max(100).default(50),
  page: number$1().int().min(1).default(1),
  direction: _enum(["incoming", "outgoing"]).default("incoming")
}).parse(i)).handler(createSsrRpc("7cb16efe2570f0dabdb180c60727fcb4b0264b5a9e03cba10f27826c405bdfd4"));
const getAllTickets = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  limit: number$1().int().min(1).max(100).default(50),
  page: number$1().int().min(1).default(1),
  status: _enum(["open", "in_progress", "waiting_customer", "resolved", "closed"]).optional(),
  unlinkedOnly: boolean().optional()
}).parse(i)).handler(createSsrRpc("4114b5e00919843cc0d5a1ce0686f19123e81e048eb91f5cf6589f07eb6da8d1"));
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function formatMobile55(mobile) {
  if (!mobile) return "—";
  const raw = String(mobile).trim();
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    const main = digits.slice(2);
    return `+91 ${main.slice(0, 5)} ${main.slice(5)}`;
  }
  return raw;
}
const Tabs = Root2;
const TabsList = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  List,
  {
    ref,
    className: cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = List.displayName;
const TabsTrigger = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = Trigger.displayName;
const TabsContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = Content.displayName;
const Table = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-full overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("table", { ref, className: cn("w-full caption-bottom text-sm", className), ...props }) })
);
Table.displayName = "Table";
const TableHeader = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { ref, className: cn("[&_tr]:border-b", className), ...props }));
TableHeader.displayName = "TableHeader";
const TableBody = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { ref, className: cn("[&_tr:last-child]:border-0", className), ...props }));
TableBody.displayName = "TableBody";
const TableFooter = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "tfoot",
  {
    ref,
    className: cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
    ...props
  }
));
TableFooter.displayName = "TableFooter";
const TableRow = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tr",
    {
      ref,
      className: cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      ),
      ...props
    }
  )
);
TableRow.displayName = "TableRow";
const TableHead = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "th",
  {
    ref,
    className: cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    ),
    ...props
  }
));
TableHead.displayName = "TableHead";
const TableCell = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "td",
  {
    ref,
    className: cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    ),
    ...props
  }
));
TableCell.displayName = "TableCell";
const TableCaption = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("caption", { ref, className: cn("mt-4 text-sm text-muted-foreground", className), ...props }));
TableCaption.displayName = "TableCaption";
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
const Input = reactExports.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const Dialog = Dialog$1;
const DialogTrigger = DialogTrigger$1;
const DialogPortal = DialogPortal$1;
const DialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  DialogOverlay$1,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogOverlay$1.displayName;
const DialogContent = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent$1,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg max-h-[calc(100vh-2rem)] overflow-y-auto",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogClose, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogContent$1.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
const DialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  DialogTitle$1,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = DialogTitle$1.displayName;
const DialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  DialogDescription$1,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogDescription$1.displayName;
function StatsCard({ label, value, color }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-3xl font-bold ${color}`, children: value.toLocaleString() }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-slate-600 mt-1", children: label })
  ] });
}
function PipelineHealthTab() {
  const healthFn = useServerFn(getPipelineHealth);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["inbox.health"],
    queryFn: () => healthFn()
  });
  if (isLoading || !data) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-sm text-slate-500", children: "Loading pipeline health..." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-4 w-4 rounded-full ${data.isHealthy ? "bg-emerald-500 animate-pulse" : "bg-red-500"}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold text-slate-900 flex items-center gap-2", children: [
            "Status: ",
            data.isHealthy ? "Healthy & Operational" : "Action Required",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs font-mono", children: data.mailbox })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-500", children: [
            "Last synchronized: ",
            data.lastSyncAt ? new Date(data.lastSyncAt).toLocaleString() : "Never"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => refetch(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5 mr-1.5" }),
        " Refresh"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-slate-700 mb-3", children: "Today's Ingestion Metrics" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatsCard, { label: "Emails Discovered", value: data.today.discovered, color: "text-blue-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatsCard, { label: "Successfully Ingested", value: data.today.completed, color: "text-emerald-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatsCard, { label: "New Support Tickets", value: data.today.newTickets, color: "text-indigo-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatsCard, { label: "Processing Errors", value: data.today.errors, color: data.today.errors > 0 ? "text-amber-600" : "text-slate-600" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-white shadow-sm overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b flex items-center justify-between bg-slate-50/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-sm flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FolderSync, { className: "h-4 w-4 text-blue-600" }),
          " Monitored Folders & Sync Checkpoints"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-slate-500", children: [
          data.checkpoints.length,
          " folders active"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Folder Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Last Processed Time" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Sync Status" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: data.checkpoints.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 4, className: "text-center py-6 text-slate-500 text-sm", children: 'No checkpoints recorded yet. Click "Poll Now" to discover folders.' }) }) : data.checkpoints.map((cp) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium text-sm", children: cp.folder_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs text-slate-500", children: cp.folder_type || "Custom" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs", children: cp.last_received_time_ms > 0 ? new Date(cp.last_received_time_ms).toLocaleString() : "Initialized" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: cp.status === "active" ? "default" : "destructive", children: cp.status }) })
        ] }, cp.id)) })
      ] })
    ] })
  ] });
}
function ProcessingErrorsTab() {
  const qc = useQueryClient();
  const [page, setPage] = reactExports.useState(1);
  const [status, setStatus] = reactExports.useState("new");
  const [selectedError, setSelectedError] = reactExports.useState(null);
  const errorsFn = useServerFn(getProcessingErrors);
  const retryFn = useServerFn(retryProcessingError);
  const createTicketFn = useServerFn(createTicketFromProcessingError);
  const { data, isLoading } = useQuery({
    queryKey: ["inbox.errors", page, status],
    queryFn: () => errorsFn({ data: { page, limit: 30, status } })
  });
  const retryMut = useMutation({
    mutationFn: (id) => retryFn({ data: { id } }),
    onSuccess: (r) => {
      toast.success(r.message);
      qc.invalidateQueries({ queryKey: ["inbox"] });
      setSelectedError(null);
    },
    onError: (e) => toast.error(e.message)
  });
  const createMut = useMutation({
    mutationFn: (id) => createTicketFn({ data: { id } }),
    onSuccess: (r) => {
      toast.success(`Ticket ${r.ticketNumber} created`);
      qc.invalidateQueries({ queryKey: ["inbox"] });
      setSelectedError(null);
    },
    onError: (e) => toast.error(e.message)
  });
  const errorList = data?.errors;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: ["new", "retrying", "resolved", "failed", "all"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        variant: status === s ? "default" : "outline",
        size: "sm",
        onClick: () => {
          setStatus(s);
          setPage(1);
        },
        children: s.charAt(0).toUpperCase() + s.slice(1)
      },
      s
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border bg-white shadow-sm overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Sender" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Subject" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Stage" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Error Message" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { colSpan: 6, className: "text-center py-6 text-slate-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin inline mr-2" }),
        " Loading errors..."
      ] }) }) : !errorList || errorList.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 6, className: "text-center py-6 text-slate-500 text-sm", children: "No processing errors matching filter." }) }) : errorList.map((err) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs font-mono", children: err.from_email || "unknown" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm truncate max-w-[200px]", children: err.subject || "(no subject)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px]", children: err.error_stage }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs text-red-600 truncate max-w-[260px]", children: err.error_message }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: err.status === "resolved" ? "default" : "destructive", children: err.status }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", onClick: () => setSelectedError(err), children: "Inspect" }) })
      ] }, err.id)) })
    ] }) }),
    selectedError && /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!selectedError, onOpenChange: (v) => !v && setSelectedError(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Email Processing Error" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          "Technical failure on UID ",
          selectedError.zoho_mail_uid,
          " in folder ",
          selectedError.zoho_folder_name
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-sm max-h-[60vh] overflow-y-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 p-3 rounded text-xs font-mono whitespace-pre-wrap", children: [
          selectedError.error_message,
          selectedError.error_stack && `

Stack:
${selectedError.error_stack}`
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-xs text-slate-600", children: "Subject:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: selectedError.subject || "(no subject)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-xs text-slate-600", children: "Body Preview:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-slate-50 border rounded text-xs whitespace-pre-wrap", children: selectedError.body_snippet || "(no body snippet)" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 sm:gap-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            onClick: () => retryMut.mutate(selectedError.id),
            disabled: retryMut.isPending,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-3.5 w-3.5 mr-1.5 ${retryMut.isPending ? "animate-spin" : ""}` }),
              " Retry"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "secondary",
            onClick: () => createMut.mutate(selectedError.id),
            disabled: createMut.isPending,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { className: "h-3.5 w-3.5 mr-1.5" }),
              " Create Ticket Manually"
            ]
          }
        )
      ] })
    ] }) })
  ] });
}
function EmailSearchTab() {
  const [query, setQuery] = reactExports.useState("");
  const searchFn = useServerFn(searchEmailAuditTrace);
  const searchMut = useMutation({
    mutationFn: (q) => searchFn({ data: { query: q } })
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "Search by sender email, subject, Message-ID, or Zoho UID...",
          value: query,
          onChange: (e) => setQuery(e.target.value),
          onKeyDown: (e) => {
            if (e.key === "Enter" && query.trim()) searchMut.mutate(query.trim());
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => query.trim() && searchMut.mutate(query.trim()), disabled: searchMut.isPending, children: [
        searchMut.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 mr-2" }),
        " Search"
      ] })
    ] }),
    searchMut.data && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      searchMut.data.tickets.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-white p-4 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm mb-3", children: "Matched Support Tickets" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y text-sm", children: searchMut.data.tickets.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-2 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/tickets/$ticketId", params: { ticketId: t.id }, className: "font-mono text-blue-600 hover:underline", children: t.ticket_number }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2", children: t.subject }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-slate-500 ml-2", children: [
              "(",
              t.ticket_email,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: t.status })
        ] }, t.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-white shadow-sm overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b bg-slate-50/50 font-medium text-sm flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-emerald-600" }),
          " Lifecycle Audit Events (",
          searchMut.data.auditEvents.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Timestamp" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Stage" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Sender" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Subject" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Folder" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: searchMut.data.auditEvents.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { colSpan: 5, className: "text-center py-6 text-slate-500 text-sm", children: [
            'No audit records found matching "',
            query,
            '".'
          ] }) }) : searchMut.data.auditEvents.map((evt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs text-slate-500", children: new Date(evt.created_at).toLocaleString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] font-mono", children: evt.stage }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs font-mono", children: evt.sender_normalized }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm truncate max-w-[240px]", children: evt.subject }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs text-slate-500", children: evt.zoho_folder_name || "-" })
          ] }, evt.id)) })
        ] })
      ] })
    ] })
  ] });
}
function TicketsListTab() {
  const [unlinkedOnly, setUnlinkedOnly] = reactExports.useState(false);
  const [page, setPage] = reactExports.useState(1);
  const ticketsFn = useServerFn(getAllTickets);
  const { data, isLoading } = useQuery({
    queryKey: ["inbox.allTickets", page, unlinkedOnly],
    queryFn: () => ticketsFn({ data: { page, limit: 30, unlinkedOnly } })
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        variant: unlinkedOnly ? "default" : "outline",
        size: "sm",
        onClick: () => {
          setUnlinkedOnly(!unlinkedOnly);
          setPage(1);
        },
        children: unlinkedOnly ? "Showing: Needs Review / Unlinked" : "Filter: Needs Review / Unlinked"
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border bg-white shadow-sm overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Ticket #" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Subject" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Sender Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Order Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Created" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { colSpan: 6, className: "text-center py-6 text-slate-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin inline mr-2" }),
        " Loading tickets..."
      ] }) }) : data?.tickets?.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/tickets/$ticketId", params: { ticketId: t.id }, className: "text-blue-600 hover:underline", children: t.ticket_number }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm truncate max-w-[200px]", children: t.subject }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs font-mono", children: t.ticket_email }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: t.order_link_status === "needs_review" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "text-[10px]", children: "Needs Order Review" }) : t.is_unlinked ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] text-amber-600 border-amber-300", children: "Unlinked" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] text-emerald-600 border-emerald-300", children: "Linked" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: t.status }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs text-slate-500", children: new Date(t.created_at).toLocaleString() })
      ] }, t.id)) })
    ] }) })
  ] });
}
function InboxManagementPage() {
  const qc = useQueryClient();
  const pollFn = useServerFn(pollInboxNow);
  const [isPolling, setIsPolling] = reactExports.useState(false);
  const handlePoll = async () => {
    setIsPolling(true);
    try {
      const res = await pollFn({ data: { limit: 50 } });
      toast.success(res.message || "Inbox polled successfully");
      await qc.invalidateQueries({ queryKey: ["inbox"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Polling failed");
    } finally {
      setIsPolling(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold flex items-center gap-2 text-slate-900", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-6 w-6 text-blue-600" }),
          " Support Email Ingestion & Health"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500", children: "Deterministic email pipeline monitoring, multi-folder checkpoints, error queues, and lifecycle audit." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handlePoll, disabled: isPolling, className: "gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-4 w-4 ${isPolling ? "animate-spin" : ""}` }),
        isPolling ? "Scanning all folders..." : "Poll All Folders Now"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "health", className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid grid-cols-4 w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "health", children: "Pipeline Health" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "errors", children: "Processing Errors" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "search", children: "Admin Email Search" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "tickets", children: "Support Tickets" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "health", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PipelineHealthTab, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "errors", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProcessingErrorsTab, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "search", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmailSearchTab, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "tickets", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TicketsListTab, {}) })
    ] })
  ] });
}
const Route$1B = createFileRoute()({
  head: () => ({
    meta: [
      { title: "Email Pipeline Health — BHS Support" },
      { name: "robots", content: "noindex,nofollow" }
    ]
  }),
  component: InboxManagementPage
});
const $$splitComponentImporter$U = () => import("./admin.invoices-Cw6juhe7.mjs");
const Route$1A = createFileRoute()({
  beforeLoad: async () => {
    const {
      supabase: supabase2
    } = await import("./client-BX5UfqqR.mjs");
    const {
      data: {
        user
      }
    } = await supabase2.auth.getUser();
    if (!user) throw redirect({
      to: "/admin-login"
    });
    const {
      data
    } = await supabase2.from("user_roles").select("role").eq("user_id", user.id).in("role", ["admin", "super_admin", "finance", "accounts"]);
    if (!data || data.length === 0) throw redirect({
      to: "/admin/my-work"
    });
  },
  head: () => ({
    meta: [{
      title: "Invoices — Udyam Ops OS"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$U, "component")
});
const $$splitComponentImporter$T = () => import("./admin.leads-BFsOu0JM.mjs");
const Route$1z = createFileRoute()({
  component: lazyRouteComponent($$splitComponentImporter$T, "component")
});
const $$splitComponentImporter$S = () => import("./admin.live-calls-CabEAbAR.mjs");
const Route$1y = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Live Calls & IVR — BHS CRM"
    }, {
      name: "description",
      content: "CallerDesk live calls and administrator IVR planning for Business Help Services."
    }, {
      property: "og:title",
      content: "Live Calls & IVR — BHS CRM"
    }, {
      property: "og:description",
      content: "CallerDesk call monitoring and securely saved IVR drafts."
    }, {
      property: "og:type",
      content: "website"
    }, {
      name: "twitter:card",
      content: "summary"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$S, "component")
});
const $$splitComponentImporter$R = () => import("./admin.my-performance-Bfr2j4mG.mjs");
const Route$1x = createFileRoute()({
  head: () => ({
    meta: [{
      title: "My Activity & Performance — Business Help CRM"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$R, "component")
});
const $$splitComponentImporter$Q = () => import("./admin.my-work-BIkApTVq.mjs");
const Route$1w = createFileRoute()({
  head: () => ({
    meta: [{
      title: "My Work — Udyam Ops OS"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$Q, "component")
});
const $$splitComponentImporter$P = () => import("./admin.notifications-CcV5a6IU.mjs");
const Route$1v = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Notifications — Udyam Ops OS"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$P, "component")
});
const $$splitComponentImporter$O = () => import("./admin.orders-BFsOu0JM.mjs");
const Route$1u = createFileRoute()({
  component: lazyRouteComponent($$splitComponentImporter$O, "component")
});
const $$splitComponentImporter$N = () => import("./admin.payment-audit-CsWTkI_K.mjs");
const Route$1t = createFileRoute()({
  component: lazyRouteComponent($$splitComponentImporter$N, "component")
});
const $$splitComponentImporter$M = () => import("./admin.payments-BVDo1nzX.mjs");
const Route$1s = createFileRoute()({
  beforeLoad: async () => {
    const {
      supabase: supabase2
    } = await import("./client-BX5UfqqR.mjs");
    const {
      data: {
        user
      }
    } = await supabase2.auth.getUser();
    if (!user) throw redirect({
      to: "/admin-login"
    });
    const {
      data
    } = await supabase2.from("user_roles").select("role").eq("user_id", user.id).in("role", ["admin", "super_admin", "finance", "accounts"]);
    if (!data || data.length === 0) throw redirect({
      to: "/admin/my-work"
    });
  },
  head: () => ({
    meta: [{
      title: "Payments — Udyam Ops OS"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$M, "component")
});
const $$splitComponentImporter$L = () => import("./admin.performance-B9PxE23z.mjs");
const Route$1r = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Employee Activity & Performance Command Center — Business Help CRM"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  beforeLoad: async () => {
    const {
      supabase: supabase2
    } = await import("./client-BX5UfqqR.mjs");
    const {
      data: u
    } = await supabase2.auth.getUser();
    if (!u.user) throw redirect({
      to: "/admin-login"
    });
    const {
      data: rows
    } = await supabase2.from("user_roles").select("role").eq("user_id", u.user.id);
    const roles = (rows ?? []).map((r) => r.role);
    if (!roles.includes("admin") && !roles.includes("super_admin") && !roles.includes("manager")) {
      throw redirect({
        to: "/admin/my-performance"
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$L, "component")
});
const $$splitComponentImporter$K = () => import("./admin.permissions-BOsCFjVy.mjs");
const Route$1q = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Permissions — Udyam Ops OS"
    }, {
      name: "description",
      content: "Manage per-employee module and service permissions."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$K, "component")
});
const $$splitComponentImporter$J = () => import("./admin.pipeline-DfoeGO7t.mjs");
const Route$1p = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Application Pipeline — Udyam Ops OS"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$J, "component")
});
const $$splitComponentImporter$I = () => import("./admin.quarantine-BKdKatYG.mjs");
const Route$1o = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Email Pipeline Health — BHS Support"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$I, "component")
});
const $$splitComponentImporter$H = () => import("./admin.refunds-Bc-rAvj8.mjs");
const Route$1n = createFileRoute()({
  beforeLoad: async () => {
    const {
      supabase: supabase2
    } = await import("./client-BX5UfqqR.mjs");
    const {
      data: {
        user
      }
    } = await supabase2.auth.getUser();
    if (!user) throw redirect({
      to: "/admin-login"
    });
    const {
      data
    } = await supabase2.from("user_roles").select("role").eq("user_id", user.id);
    const roles = (data ?? []).map((r) => r.role);
    if (!roles.some((r) => ["admin", "super_admin", "finance", "operations", "support", "manager", "executive", "accounts"].includes(r))) {
      throw redirect({
        to: "/admin/my-work"
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$H, "component")
});
const $$splitComponentImporter$G = () => import("./admin.reports-BiIVAZhx.mjs");
const Route$1m = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Reports — Udyam Ops OS"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$G, "component")
});
const $$splitComponentImporter$F = () => import("./admin.review-HnZA7igS.mjs");
const Route$1l = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Document Review — Udyam Ops OS"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  beforeLoad: async () => {
    const {
      supabase: supabase2
    } = await import("./client-BX5UfqqR.mjs");
    const {
      data: u
    } = await supabase2.auth.getUser();
    if (!u.user) throw redirect({
      to: "/admin-login"
    });
    const {
      data: rows
    } = await supabase2.from("user_roles").select("role").eq("user_id", u.user.id);
    const roles = (rows ?? []).map((r) => r.role);
    if (!roles.includes("admin") && !roles.includes("super_admin")) {
      throw redirect({
        to: "/admin/my-work"
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$F, "component")
});
const $$splitComponentImporter$E = () => import("./admin.seo-C94fpOwu.mjs");
const Route$1k = createFileRoute()({
  component: lazyRouteComponent($$splitComponentImporter$E, "component")
});
const $$splitComponentImporter$D = () => import("./admin.services-BFsOu0JM.mjs");
const Route$1j = createFileRoute()({
  component: lazyRouteComponent($$splitComponentImporter$D, "component")
});
const $$splitComponentImporter$C = () => import("./admin.sessions-CExWnOdd.mjs");
const Route$1i = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Employee Sessions & Security Center — Admin"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$C, "component")
});
const $$splitComponentImporter$B = () => import("./admin.settings-B-9pWKWE.mjs");
const Route$1h = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Settings — Udyam Ops OS"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$B, "component")
});
const $$splitComponentImporter$A = () => import("./admin.submissions-T7T1w1ST.mjs");
const Route$1g = createFileRoute()({
  component: lazyRouteComponent($$splitComponentImporter$A, "component")
});
const $$splitComponentImporter$z = () => import("./admin.super-CdBekGKV.mjs");
const searchSchema = object({
  preset: fallback(_enum(["today", "yesterday", "7d", "15d", "30d", "mtd", "custom"]), "today").default("today"),
  from: fallback(string().optional(), void 0).optional(),
  to: fallback(string().optional(), void 0).optional()
});
const Route$1f = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Super Admin — Udyam Ops OS"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  validateSearch: zodValidator(searchSchema),
  beforeLoad: async () => {
    const {
      supabase: supabase2
    } = await import("./client-BX5UfqqR.mjs");
    const {
      data: {
        user
      }
    } = await supabase2.auth.getUser();
    if (!user) throw redirect({
      to: "/admin-login"
    });
    const {
      data
    } = await supabase2.from("user_roles").select("role").eq("user_id", user.id);
    if (!data?.some((r) => r.role === "super_admin")) {
      throw redirect({
        to: "/admin/dashboard"
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$z, "component")
});
const $$splitComponentImporter$y = () => import("./admin.tasks-Bs-kdqwF.mjs");
const Route$1e = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Tasks — Udyam Ops OS"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  beforeLoad: async () => {
    const {
      supabase: supabase2
    } = await import("./client-BX5UfqqR.mjs");
    const {
      data: u
    } = await supabase2.auth.getUser();
    if (!u.user) throw redirect({
      to: "/admin-login"
    });
    const {
      data: rows
    } = await supabase2.from("user_roles").select("role").eq("user_id", u.user.id);
    const roles = (rows ?? []).map((r) => r.role);
    if (!roles.includes("admin") && !roles.includes("super_admin")) {
      throw redirect({
        to: "/admin/my-work"
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$y, "component")
});
const $$splitComponentImporter$x = () => import("./admin.team-orders-ClQU5toD.mjs");
const Route$1d = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Team Orders — Udyam Ops OS"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$x, "component")
});
const $$splitComponentImporter$w = () => import("./admin.training-DlYdduh_.mjs");
const Route$1c = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Training — Udyam Ops OS"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$w, "component")
});
const $$splitComponentImporter$v = () => import("./admin.users-Dojbrk6A.mjs");
const Route$1b = createFileRoute()({
  beforeLoad: async () => {
    const {
      supabase: supabase2
    } = await import("./client-BX5UfqqR.mjs");
    const {
      data: {
        user
      }
    } = await supabase2.auth.getUser();
    if (!user) throw redirect({
      to: "/admin-login"
    });
    const {
      data
    } = await supabase2.from("user_roles").select("role").eq("user_id", user.id).in("role", ["admin", "super_admin"]);
    if (!data || data.length === 0) throw redirect({
      to: "/admin/my-work"
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$v, "component")
});
const $$splitComponentImporter$u = () => import("./admin.websites-BASr95V0.mjs");
const Route$1a = createFileRoute()({
  component: lazyRouteComponent($$splitComponentImporter$u, "component")
});
const $$splitComponentImporter$t = () => import("./admin.whatsapp-templates-tNto7aoS.mjs");
const Route$19 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "WhatsApp Templates — Udyam Ops OS"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$t, "component")
});
const $$splitComponentImporter$s = () => import("./admin.zoho-export-CCZPLDc_.mjs");
const Route$18 = createFileRoute()({
  beforeLoad: async () => {
    const {
      supabase: supabase2
    } = await import("./client-BX5UfqqR.mjs");
    const {
      data: {
        user
      }
    } = await supabase2.auth.getUser();
    if (!user) throw redirect({
      to: "/admin-login"
    });
    const {
      data
    } = await supabase2.from("user_roles").select("role").eq("user_id", user.id).in("role", ["admin", "super_admin", "finance", "accounts"]);
    if (!data || data.length === 0) throw redirect({
      to: "/admin/my-work"
    });
  },
  head: () => ({
    meta: [{
      title: "Zoho Books Export — Udyam Ops OS"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$s, "component")
});
const Route$17 = createFileRoute()({
  server: {
    handlers: {
      GET: async () => new Response(JSON.stringify({ ok: true, service: "businesshelpservices-api" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store"
        }
      })
    }
  }
});
const $$splitNotFoundComponentImporter = () => import("./app._token-CWfUkoZh.mjs");
const $$splitErrorComponentImporter$1 = () => import("./app._token-DdDN3PUJ.mjs");
const $$splitComponentImporter$r = () => import("./app._token-8V9_Yeg0.mjs");
const Route$16 = createFileRoute()({
  component: lazyRouteComponent($$splitComponentImporter$r, "component"),
  head: () => ({
    meta: [{
      title: "Application link · Business Help Services"
    }]
  }),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter$1, "errorComponent"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
const $$splitComponentImporter$q = () => import("./auth.callback-CWtvnPwi.mjs");
const Route$15 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Signing in — Business Help Services"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  ssr: false,
  component: lazyRouteComponent($$splitComponentImporter$q, "component")
});
function redactEmail$1(email) {
  if (!email) return "***";
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return "***";
  return `${localPart[0]}***@${domain}`;
}
const Route$14 = createFileRoute()({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const supabaseUrl = "https://epqxycwzreezbleqlgob.supabase.co";
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!supabaseServiceKey) {
          return Response.json({ error: "Server configuration error" }, { status: 500 });
        }
        const url2 = new URL(request.url);
        const token = url2.searchParams.get("token");
        if (!token) {
          return Response.json({ error: "Token is required" }, { status: 400 });
        }
        const supabase2 = createClient(supabaseUrl, supabaseServiceKey);
        const { data: tokenRecord, error: lookupError } = await supabase2.from("email_unsubscribe_tokens").select("*").eq("token", token).maybeSingle();
        if (lookupError || !tokenRecord) {
          return Response.json({ error: "Invalid or expired token" }, { status: 404 });
        }
        if (tokenRecord.used_at) {
          return Response.json({ valid: false, reason: "already_unsubscribed" });
        }
        return Response.json({ valid: true });
      },
      POST: async ({ request }) => {
        const supabaseUrl = "https://epqxycwzreezbleqlgob.supabase.co";
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!supabaseServiceKey) {
          return Response.json({ error: "Server configuration error" }, { status: 500 });
        }
        const url2 = new URL(request.url);
        let token = url2.searchParams.get("token");
        const contentType = request.headers.get("content-type") ?? "";
        if (contentType.includes("application/x-www-form-urlencoded")) {
          const formText = await request.text();
          const params = new URLSearchParams(formText);
          if (!params.get("List-Unsubscribe")) {
            const formToken = params.get("token");
            if (formToken) {
              token = formToken;
            }
          }
        } else {
          try {
            const body = await request.json();
            if (body.token) {
              token = body.token;
            }
          } catch {
          }
        }
        if (!token) {
          return Response.json({ error: "Token is required" }, { status: 400 });
        }
        const supabase2 = createClient(supabaseUrl, supabaseServiceKey);
        const { data: tokenRecord, error: lookupError } = await supabase2.from("email_unsubscribe_tokens").select("*").eq("token", token).maybeSingle();
        if (lookupError || !tokenRecord) {
          return Response.json({ error: "Invalid or expired token" }, { status: 404 });
        }
        if (tokenRecord.used_at) {
          return Response.json({ success: false, reason: "already_unsubscribed" });
        }
        const { data: updated, error: updateError } = await supabase2.from("email_unsubscribe_tokens").update({ used_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("token", token).is("used_at", null).select().maybeSingle();
        if (updateError) {
          console.error("Failed to mark token as used", { error: updateError, token });
          return Response.json({ error: "Failed to process unsubscribe" }, { status: 500 });
        }
        if (!updated) {
          return Response.json({ success: false, reason: "already_unsubscribed" });
        }
        const { error: suppressError } = await supabase2.from("suppressed_emails").upsert(
          { email: tokenRecord.email.toLowerCase(), reason: "unsubscribe" },
          { onConflict: "email" }
        );
        if (suppressError) {
          console.error("Failed to suppress email", {
            error: suppressError,
            email_redacted: redactEmail$1(tokenRecord.email)
          });
          return Response.json({ error: "Failed to process unsubscribe" }, { status: 500 });
        }
        console.log("Email unsubscribed", {
          email_redacted: redactEmail$1(tokenRecord.email)
        });
        return Response.json({ success: true });
      }
    }
  }
});
const $$splitComponentImporter$p = () => import("./payment-failed._leadCode-CBff8FAy.mjs");
const Route$13 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Payment Failed — Business Help Services"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }, {
      name: "referrer",
      content: "no-referrer"
    }]
  }),
  validateSearch: (s) => ({
    reason: typeof s.reason === "string" ? s.reason : void 0
  }),
  component: lazyRouteComponent($$splitComponentImporter$p, "component")
});
const $$splitComponentImporter$o = () => import("./payment-pending._leadCode-BsH_EYud.mjs");
const Route$12 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Confirming Payment — Business Help Services"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }, {
      name: "referrer",
      content: "no-referrer"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$o, "component")
});
const $$splitComponentImporter$n = () => import("./payment._leadCode-CgBD_pSK.mjs");
const Route$11 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Your Application Is Ready — Business Help Services"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }, {
      name: "referrer",
      content: "no-referrer"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$n, "component")
});
const $$splitComponentImporter$m = () => import("./processing._leadCode-CxIpwlvd.mjs");
const Route$10 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Processing Your Application — Please Wait"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }, {
      name: "referrer",
      content: "no-referrer"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$m, "component")
});
const Route$$ = createFileRoute()({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const orderId = params.orderId;
        const home = new Response(null, { status: 302, headers: { location: "/" } });
        if (!/^[0-9a-f-]{36}$/i.test(orderId)) return home;
        try {
          const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
          const { data: app, error } = await supabaseAdmin.from("applications").select("lead_id").eq("id", orderId).maybeSingle();
          if (error) console.error("[resume] order lookup failed", error.message);
          const leadId = app?.lead_id ?? null;
          if (!leadId) return home;
          const { data: lead } = await supabaseAdmin.from("leads").select("lead_code").eq("id", leadId).maybeSingle();
          const leadCode = lead?.lead_code ?? null;
          if (!leadCode) return home;
          return new Response(null, {
            status: 302,
            headers: { location: `/onboarding/${encodeURIComponent(leadCode)}` }
          });
        } catch (e) {
          console.error("[resume] redirect failed", e);
          return home;
        }
      }
    }
  }
});
const $$splitComponentImporter$l = () => import("./success._leadCode-BVSzgv4M.mjs");
const Route$_ = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Payment Successful — Business Help Services"
    }, {
      name: "description",
      content: "Your payment was received successfully."
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }, {
      name: "referrer",
      content: "no-referrer"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const oauth = async () => {
  const {
    supabase: supabase2
  } = await import("./client-BX5UfqqR.mjs");
  return supabase2.auth.oauth;
};
const $$splitErrorComponentImporter = () => import("../_._lovable.oauth.consent-BPR4EvfC.mjs");
const $$splitComponentImporter$k = () => import("../_._lovable.oauth.consent-D7drLX5e.mjs");
const Route$Z = createFileRoute()({
  ssr: false,
  validateSearch: (s) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : ""
  }),
  beforeLoad: async ({
    search,
    location
  }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const {
      supabase: supabase2
    } = await import("./client-BX5UfqqR.mjs");
    const {
      data
    } = await supabase2.auth.getSession();
    const next = location.pathname + location.searchStr;
    if (!data.session) throw redirect({
      to: "/admin-login",
      search: {
        next
      }
    });
  },
  loader: async ({
    location
  }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id");
    const {
      data,
      error
    } = await (await oauth()).getAuthorizationDetails(authorizationId);
    if (error) throw error;
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({
      href: immediate
    });
    return data;
  },
  component: lazyRouteComponent($$splitComponentImporter$k, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
const Route$Y = createFileRoute()({
  server: {
    handlers: {
      ANY: async () => new Response("Not Found", {
        status: 404,
        headers: { "Content-Type": "text/plain" }
      })
    }
  }
});
const Route$X = createFileRoute()({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/admin/orders/$orderId", params: { orderId: params.applicationId } });
  }
});
const $$splitComponentImporter$j = () => import("./admin.complaints._complaintId-Bn-CojAy.mjs");
const Route$W = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Complaint Details — Udyam Ops OS"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./admin.customers._customerId-CaJUopSF.mjs");
const Route$V = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Customer Profile — CRM"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./admin.finance.gst-DXdqtK0b.mjs");
const Route$U = createFileRoute()({
  beforeLoad: async () => {
    const {
      supabase: supabase2
    } = await import("./client-BX5UfqqR.mjs");
    const {
      data: {
        user
      }
    } = await supabase2.auth.getUser();
    if (!user) throw redirect({
      to: "/admin-login"
    });
    const {
      data
    } = await supabase2.from("user_roles").select("role").eq("user_id", user.id).in("role", ["admin", "super_admin", "finance", "accounts"]);
    if (!data || data.length === 0) throw redirect({
      to: "/admin/my-work"
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./admin.finance.settlements-Bc-t7S3L.mjs");
const Route$T = createFileRoute()({
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./admin.help.email-matrix-DVVpCaEh.mjs");
const Route$S = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Email & Status Matrix — Udyam Ops OS"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./admin.leads.index-DnFL9krh.mjs");
const Route$R = createFileRoute()({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./admin.leads._leadId-DB_N-JSE.mjs");
const Route$Q = createFileRoute()({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const VISIBLE_SERVICE_DOMAIN = "udyamadhar.in";
function isVisibleService(s) {
  return s?.is_active !== false && s?.website?.domain === VISIBLE_SERVICE_DOMAIN;
}
const CLOSED_FS = /* @__PURE__ */ new Set(["application_rejected", "certificate_rejected", "order_closed", "cancelled"]);
const COMPLETED_FS = /* @__PURE__ */ new Set(["consultation_completed", "order_completed", "completed", "certificate_ready", "certificate_delivered", "certificate_uploaded", "service_completed", "application_approved", "approved"]);
const EXCEPTION_STAGES = ["refund_requested", "refunded", "uninterested"];
function isNeedsActionOrder(row) {
  if (row.is_terminal) return false;
  if (row.customer_resumed_pending) return true;
  if (row.is_callback_scheduled || row.callback_reminder && !row.callback_reminder.is_due) return false;
  if (row.is_hot) return true;
  const fs = String(row.fulfillment_status ?? "").toLowerCase();
  const stage = String(row.stage ?? "").toLowerCase();
  const os = String(row.order_status ?? "").toUpperCase();
  const ws = String(row.workflow_status ?? "").toLowerCase();
  if (stage === "completed" || stage === "closed" || COMPLETED_FS.has(fs) || CLOSED_FS.has(fs)) return false;
  if (isTechnicalDelayOrder(row) || isCustomerDelayOrder(row)) return false;
  if (Boolean(row.form_link_sent_at) || fs === "form_not_submitted" || stage === "form_not_submitted" && os !== "REOPENED" && fs !== "order_reopened" && ws !== "order_reopened" || fs === "awaiting_customer_form" || fs === "waiting_for_customer_submission" || fs === "form_link_sent" || fs === "form_pending" || stage === "form_not_submitted" && Boolean(row.form_link_sent_at)) {
    return false;
  }
  const progressedStages = /* @__PURE__ */ new Set(["submitted_to_govt", "under_processing", "under_review", "certificate_ready", "certificate_delivered", "certificate_uploaded", "consultation_completed", "refunded", "refund_requested", "application_rejected", "certificate_rejected", "verification_pending", "documents_received", "government_processing"]);
  if (progressedStages.has(stage) || progressedStages.has(fs)) return false;
  if (row.in_range_action_taken || row.action_count && row.action_count > 0) {
    return false;
  }
  const isCurrentlyReopened = stage === "order_reopened" || fs === "order_reopened" || ws === "order_reopened" || os === "REOPENED";
  if (isCurrentlyReopened || row.is_hot) return true;
  return stage === "lead_received" || stage === "payment_done" || stage === "form_submitted" || stage === "form_not_submitted" || stage === "order_reopened" || fs === "order_received" || fs === "payment_done" || fs === "form_submitted";
}
function isCustomerDelayOrder(row) {
  const fs = String(row.fulfillment_status ?? "").toLowerCase();
  const stage = String(row.stage ?? "").toLowerCase();
  if (row.is_terminal || stage === "completed" || stage === "closed" || COMPLETED_FS.has(fs) || CLOSED_FS.has(fs)) return false;
  const ws = String(row.workflow_status ?? "").toLowerCase();
  const os = String(row.order_status ?? "").toUpperCase();
  const cbChannel = String(row.callback_reminder?.remarks?.channel ?? "").toLowerCase();
  const cbReason = String(row.callback_reminder?.remarks?.reason ?? "").toLowerCase();
  const cbKind = String(row.callback_reminder?.remarks?.kind ?? "").toLowerCase();
  const schedulerType = String(row.callback_reminder?.scheduler_type ?? "").toLowerCase();
  const reasonCat = String(row.callback_reminder?.remarks?.reasonCategory ?? "").toUpperCase();
  return stage === "customer_delay" || fs === "customer_delay" || fs === "customer_hold" || ws === "customer_delay" || ws === "waiting_for_customer" || ws === "waiting_for_documents" || ws === "customer_non_responsive" || ws === "external_dependency" || os === "CUSTOMER_HOLD" || cbChannel === "customer_delay" || cbReason === "customer_delay" || cbKind === "customer_delay" || cbKind === "external_dependency" || schedulerType === "customer_delay_reminder" || schedulerType === "customer_hold_reminder" || schedulerType === "customer_side_delay" || reasonCat === "A" || Boolean(row.customer_hold_started_at);
}
function isTechnicalDelayOrder(row) {
  const fs = String(row.fulfillment_status ?? "").toLowerCase();
  const stage = String(row.stage ?? "").toLowerCase();
  if (row.is_terminal || stage === "completed" || stage === "closed" || COMPLETED_FS.has(fs) || CLOSED_FS.has(fs)) return false;
  if (isCustomerDelayOrder(row)) return false;
  const ws = String(row.workflow_status ?? "").toLowerCase();
  const os = String(row.order_status ?? "").toUpperCase();
  const cbChannel = String(row.callback_reminder?.remarks?.channel ?? "").toLowerCase();
  const cbReason = String(row.callback_reminder?.remarks?.reason ?? "").toLowerCase();
  const cbKind = String(row.callback_reminder?.remarks?.kind ?? "").toLowerCase();
  const schedulerType = String(row.callback_reminder?.scheduler_type ?? "").toLowerCase();
  const reasonCat = String(row.callback_reminder?.remarks?.reasonCategory ?? "").toUpperCase();
  return stage === "technical_delay" || fs === "technical_delay" || fs === "technical_hold" || ws === "technical_delay" || ws === "technical_hold" || ws === "government_portal_pending" || os.includes("TECHNICAL_HOLD") || cbChannel === "technical_delay" || cbReason === "technical_delay" || cbKind === "technical_delay" || schedulerType === "technical_hold_reminder" || schedulerType === "our_side_delay" || reasonCat === "B" || Boolean(row.technical_hold_started_at) && !Boolean(row.customer_hold_started_at);
}
function bucketOfRow(row, todayIst) {
  const fs = String(row.fulfillment_status ?? "").toLowerCase();
  if (EXCEPTION_STAGES.includes(row.stage)) return "exception";
  if (CLOSED_FS.has(fs) || row.stage === "closed") return "closed";
  if (COMPLETED_FS.has(fs) || row.stage === "completed") return "completed";
  if (row.is_hot && !row.in_range_action_taken && !(row.action_count && row.action_count > 0)) {
    return "hot_orders";
  }
  if (row.customer_resumed_pending) return "needs_action";
  if (row.is_callback_scheduled || row.callback_reminder && !row.callback_reminder.is_due) return "reminders";
  if (isCustomerDelayOrder(row)) return "customer_delay";
  if (isTechnicalDelayOrder(row)) return "technical_delay";
  const curToday = istDateKey(/* @__PURE__ */ new Date());
  const rowDate = istDateKey(row.created_at);
  if (rowDate && rowDate < curToday && isNeedsActionOrder(row)) {
    return "backlog";
  }
  if (isNeedsActionOrder(row)) {
    return "needs_action";
  }
  return "pending";
}
function isPendingRow(row) {
  const b = bucketOfRow(row);
  return b === "pending" || b === "needs_action" || b === "backlog";
}
const listOrdersV2 = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  page: number$1().int().min(1).default(1),
  pageSize: number$1().int().min(1).max(100).default(50),
  fulfillmentStatus: string().optional(),
  serviceId: string().optional(),
  assignedTo: string().optional(),
  paymentStatus: string().optional(),
  dateFrom: string().optional(),
  dateTo: string().optional(),
  search: string().max(120).optional(),
  bucket: string().optional().default("all"),
  stage: string().optional(),
  actionStatus: string().optional().default("all"),
  pendingAge: string().optional(),
  customDays: string().optional(),
  sortField: _enum(["created_at", "stage", "stage_journey"]).optional().default("created_at"),
  sortOrder: _enum(["asc", "desc"]).optional().default("desc"),
  viewMode: _enum(["self", "team"]).optional().default("self")
}).parse(i ?? {})).handler(createSsrRpc("2127d0ea2e52451bb93b757bd02a315019800baabc585ac98f871e0270d3040a"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  employeeId: string().uuid(),
  page: number$1().int().min(1).default(1),
  pageSize: number$1().int().min(1).max(50).default(20)
}).parse(i ?? {})).handler(createSsrRpc("e82451722893ca5dfec67fd8c60d44dfa9517426a964d54353200dd9b1ac0b81"));
const getOrderDetailV2 = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid()
}).parse(i)).handler(createSsrRpc("b52c83dc1ea228ab0f2bdd6fb3c20ddbeeee51a1a45bd88de8fa945a6178feee"));
const getOrderTimelineEvents = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid()
}).parse(i)).handler(createSsrRpc("d34c7c83506c44f2c86116d6dcd7dfcdc4b6cfb60731a7bf41577677c9c2ea57"));
const getOrderTickets = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid(),
  customerId: string().uuid().nullable().optional()
}).parse(i)).handler(createSsrRpc("3420fec0092851628e781c482bc7e6a0cf27053e8d404f90be37e64553baccd3"));
const updateOrderAssignee = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid(),
  assignedTo: string().uuid().nullable()
}).parse(i)).handler(createSsrRpc("68d63119ba6cd5a50d733a3ee802e67886b18e4148b5a9bc3e62b254909dba49"));
const updateFulfillmentStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid(),
  toStatus: string(),
  note: string().max(2e3).optional(),
  // Allow a single-step backward move (revert). One stage only,
  // never from `completed` or `cancelled`.
  allowBackward: boolean().optional(),
  // Admin/super-admin override: skip the strict stepwise map so any
  // stage can be set. Verified server-side against the caller's role.
  adminOverride: boolean().optional(),
  // Required when transitioning to `completed`
  certificateDocumentId: string().uuid().optional(),
  certificateNumber: string().trim().min(1).max(120).optional(),
  completionNotes: string().trim().max(2e3).optional(),
  ccEmail: string().trim().optional().refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: "Please provide a valid CC email address."
  })
}).parse(i)).handler(createSsrRpc("77bbb9ae007f0bc781f5f1500403ece1573cf472e5e4b0edad5f831634dab4ff"));
const resendOrderCertificate = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid(),
  ccEmail: string().trim().email("Invalid CC email address").optional().or(literal("")).nullable()
}).parse(i)).handler(createSsrRpc("87abae69d90f0e807c2d1f89044dcec39780a543c9398637920979f6ad01302c"));
const MAX_DOC_BYTES = 15 * 1024 * 1024;
const requestOrderDocumentUpload = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid(),
  docType: string().trim().min(1).max(60),
  fileName: string().trim().min(1).max(200),
  mimeType: string().trim().min(1).max(120),
  sizeBytes: number$1().int().min(1).max(MAX_DOC_BYTES)
}).parse(i)).handler(createSsrRpc("7b30f69ea58599893f4a8ae2d88f5c7e20e2da37171fdf46b91d756116d300c9"));
const confirmOrderDocumentUpload = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid(),
  docType: string().trim().min(1).max(60),
  filePath: string().min(1).max(400),
  fileName: string().min(1).max(200),
  mimeType: string().min(1).max(120),
  sizeBytes: number$1().int().min(1).max(MAX_DOC_BYTES)
}).parse(i)).handler(createSsrRpc("d470933a0c8489fb0aff43b9f366a84315b763108e87b734e4c1b3ce27d9a9c4"));
const getOrderDocumentSignedUrl = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  path: string().min(1)
}).parse(i)).handler(createSsrRpc("8c2424cad7224077f54cca04271460d5d1dae95781478ce2b14087821a6617b2"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid(),
  note: string().trim().min(1).max(2e3)
}).parse(i)).handler(createSsrRpc("21aebf8dd4084e78572d702968cc6c7c7e6519e3b21c0a398283cd18bd8a4ff9"));
const ChangeServiceInput = object({
  orderId: string().uuid(),
  newServiceId: string().uuid()
});
const changeOrderService = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => ChangeServiceInput.parse(i)).handler(createSsrRpc("2e3406b16d6176e31753371c6512f018b272d89c1be77cab76ec23942270547c"));
const resendServiceChangeEmail = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => object({
  orderId: string().uuid()
}).parse(d)).handler(createSsrRpc("36fe73f03f0fe1aadf51dfa318bb4e0541ed55e116c9240ad693dabb665e67ec"));
const LEAD_STATUS_ENUM = ["new_lead", "contacted", "payment_pending", "payment_successful", "under_process", "completed", "closed", "refund_requested", "lead_created", "details_pending", "documents_pending", "under_review"];
const LeadUpdateSchema = object({
  id: string().uuid(),
  status: _enum(LEAD_STATUS_ENUM).optional(),
  name: string().optional(),
  email: string().email().optional(),
  mobile: string().optional(),
  state: string().optional(),
  language: string().optional(),
  lead_source: string().optional(),
  notes: string().optional(),
  assigned_to: string().uuid().nullable().optional(),
  remarks: string().optional(),
  service: string().optional(),
  base_amount: number$1().optional(),
  gst_amount: number$1().optional(),
  total_amount: number$1().optional()
});
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => LeadUpdateSchema.parse(i)).handler(createSsrRpc("4b001e5e7dbd41692f9695e2f6f1eda68a486b5e3a85f6b46d4c928fd6aa6795"));
const changeLeadService = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator(object({
  leadId: string().uuid(),
  serviceId: string().uuid().optional(),
  serviceCode: string().optional()
})).handler(createSsrRpc("45c7f1f3bbc294efd23f478be9f714fd5f1e4339c0f9634d8ffb2370e7a36c2d"));
const getLeadSourceBreakdown = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("611e4af203d52cd6595714fc80edd7570de11f68a88fd6fde9abebd848099257"));
const listLeads = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator(object({
  page: number$1().default(1),
  pageSize: number$1().default(25),
  search: string().optional(),
  status: _enum(LEAD_STATUS_ENUM).optional(),
  source: string().optional(),
  service: string().optional(),
  assignee: string().optional(),
  // uuid | "__unassigned" | "__me"
  websiteId: string().uuid().optional(),
  dateFrom: string().optional(),
  dateTo: string().optional()
})).handler(createSsrRpc("20feec4db495a4bb5829af8534c5b4c6b0ea27b979eb2c2834f9fc68da1ddcdb"));
const getLead = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator(object({
  id: string().uuid()
})).handler(createSsrRpc("624ea81e2a4e7330514cfa25ce58d1944815b8d2f90fcf6d333d7374ac8128f0"));
const findLeadByCodeOrId = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator(object({
  query: string().min(2).max(64)
})).handler(createSsrRpc("4f168db81722574bd917a9a8b9e1cdba1291319190a80a5eeddff0316ae3b635"));
const addLeadNote = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator(object({
  lead_id: string().uuid(),
  note: string().min(1)
})).handler(createSsrRpc("3552731b48e30d18773c88684b1e29bde958f33f1e44a004bc7bdc5622c7742c"));
const listStaff = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("e6ef5c4dabe8c6f5fea11a7ae1bc18460ce831300a1e241fea9b11d92196a99b"));
const listAssignmentStaff = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("5ad03f3cade89ac9422743d46e470efa32b5665b6e3a16024389d1d7b70c5eab"));
const listAllHistoricalStaff = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("2b937f8919d0a16dac3ca86da131dc8df532bfad6a82d6fe51c24c3cf2b55d61"));
const getLeadCounts = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("961f27d6ee17bbb447cce182ae91e3206b3bb364961e06ec23c085c50b896dd9"));
const AddLeadSchema = object({
  name: string().trim().min(2),
  email: string().trim().email(),
  mobile: string().trim().regex(/^[6-9]\d{9}$/, "Mobile must be a 10-digit Indian number"),
  state: string().trim().min(2),
  district: string().trim().optional(),
  language: string().trim().min(2).default("en"),
  service: string().trim().min(2),
  lead_source: string().trim().default("manual"),
  base_amount: number$1().nonnegative().default(0),
  gst_amount: number$1().nonnegative().default(0),
  total_amount: number$1().nonnegative().default(0),
  notes: string().optional(),
  assigned_to: string().uuid().nullable().optional(),
  website_id: string().uuid().optional()
});
const addLead = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => AddLeadSchema.parse(i)).handler(createSsrRpc("dd7725c6ee45b6eb20e71b48e9095a6feef3b9b04429dba5308a67bd37a667bb"));
const UpdateAssigneeSchema = object({
  leadId: string().uuid(),
  assignedTo: string().uuid().nullable()
});
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => UpdateAssigneeSchema.parse(i)).handler(createSsrRpc("9846c6ab10efb3dc263bff2994c13dd6c80f0613da6b7d2ebdbf5cb70b95ec11"));
createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  page: number$1().int().min(1).default(1),
  pageSize: number$1().int().min(1).max(100).default(25),
  status: string().optional(),
  paymentStatus: string().optional(),
  search: string().max(120).optional(),
  assignedTo: string().uuid().optional()
}).parse(i ?? {})).handler(createSsrRpc("da04f7605b8d75776e008917b637993f670a179601f8bb45bbbb2a61b081fa31"));
createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  applicationId: string().uuid()
}).parse(i)).handler(createSsrRpc("64ae407a1e5233c74d20c6bdaf32e0824eaf0f950b6414e7d8a6d718fe3245be"));
createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  applicationId: string().uuid()
}).parse(i)).handler(createSsrRpc("398e0d96e203242f9cabb83e9eac3c7532f0d2eea7a160c86b4de72db491ecd3"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  applicationId: string().uuid(),
  note: string().trim().min(1).max(2e3)
}).parse(i)).handler(createSsrRpc("70599394c8c56d39dde4c378981899313a160cfe44b83594118b1e148e43290b"));
const BulkAssignInput = object({
  applicationIds: array(string().uuid()).min(1),
  assignedTo: string().uuid().nullable()
});
const bulkAssignOrders = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => BulkAssignInput.parse(i)).handler(createSsrRpc("33fa09ec64b82a5b2724c5ab6baf7bd8de0c4e0ca64d10803f3aea8437be610e"));
const getOrderAssignmentHistory = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  orderId: string().uuid()
}).parse(i)).handler(createSsrRpc("f89ae9f1db3c5ef0f51b2c9e0578f8de83470985d7547a7ab3a2818f75ce9621"));
const listAssignmentHistoryAdmin = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  page: number$1().int().min(1).default(1),
  pageSize: number$1().int().min(1).max(100).default(30),
  search: string().optional(),
  employeeId: string().optional(),
  previousEmployeeId: string().optional(),
  newEmployeeId: string().optional(),
  changeType: string().optional(),
  dateFrom: string().optional(),
  dateTo: string().optional()
}).parse(i ?? {})).handler(createSsrRpc("7f2244ed856e42b971ee04c118cf8233bc171fc09764a3e88d588f3e23ffd9d5"));
const getAssignmentOperationalMetrics = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("426dc8982165cb56585502cfa8624b1abfbf84bb14875001b82612faca3f7119"));
const createEmployeeLeave = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  employeeId: string().uuid(),
  startTime: string(),
  endTime: string(),
  reason: string().optional().default("Staff on scheduled leave"),
  autoReassign: boolean().default(true)
}).parse(i)).handler(createSsrRpc("44a247c443a8eff6f2a9767e8dc03f66b30578339a63f95b57919120b951f5a4"));
const cancelEmployeeLeave = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  leaveId: string().uuid()
}).parse(i)).handler(createSsrRpc("5988fb6c503a67ea25dccc8a4628ecf3a9e30600c19e3155e4836ab212bc61e6"));
const listEmployeeLeaves = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("7546255aaf3b239be1bd0df753c380337fb8555a475ea5ad788a76e44a2b3cff"));
const triggerEmployeeReassignment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  employeeId: string().uuid(),
  reason: string().min(1),
  changeType: _enum(["AUTO_UNAVAILABLE", "AUTO_LEAVE", "AUTO_INACTIVITY"]).default("AUTO_UNAVAILABLE")
}).parse(i)).handler(createSsrRpc("6cc2097d0c981c4eababa1c6615b3e3558cf8cab084772c94c8408e7475ec53a"));
const autoDistributeSelectedOrders = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  applicationIds: array(string().uuid()).min(1),
  reason: string().optional(),
  targetEmployeeIds: array(string().uuid()).optional()
}).parse(i)).handler(createSsrRpc("f52e1267030f91f5a09e1f66ae38caf9bdd9a6e4210d17cc03b77e191b4da030"));
const getEmployeePerformanceCommandCenter = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  dateFilter: _enum(["today", "yesterday", "7d", "15d", "30d", "this_month", "custom"]).default("today"),
  customStart: string().optional(),
  customEnd: string().optional(),
  employeeId: string().optional().nullable(),
  serviceId: string().optional().nullable(),
  stage: string().optional().nullable(),
  status: string().optional().nullable()
}).parse(i)).handler(createSsrRpc("4c41cbcbfaa0ed2e5189bf3b32a548657f33502a5dc5dca5cf012b9f7b7f0593"));
const getEmployeeDetailPerformance = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  employeeId: string().uuid(),
  dateFilter: _enum(["today", "yesterday", "7d", "15d", "30d", "this_month", "custom"]).default("today"),
  customStart: string().optional(),
  customEnd: string().optional()
}).parse(i)).handler(createSsrRpc("5cbb7ac77801eef299d532ea798efce8698c17e40ab46cdcf77d3530e92cc30d"));
const getMyPerformanceDashboard = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  dateFilter: _enum(["today", "yesterday", "7d", "15d", "30d", "this_month"]).default("today"),
  customStart: string().optional(),
  customEnd: string().optional(),
  employeeId: string().optional()
}).parse(i)).handler(createSsrRpc("4b718af2058457ad4352a3b88dfe6629eef8a95235577be72c15d0e7c8ef1f31"));
const getLiveActivityFeed = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  limit: number$1().int().min(5).max(100).default(30),
  employeeId: string().optional(),
  filter: _enum(["human", "system", "all"]).default("human")
}).parse(i)).handler(createSsrRpc("1934e5defc2efa8e0e45da99bf77a3bf6dc43528f0e508418d4b51ed05bca4af"));
const getEmployeeMetricDrilldown = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  employeeId: string().optional().nullable(),
  metric: _enum(["assigned", "worked", "actions", "customerDelays", "technicalDelays", "hotOrders", "completed", "closed"]),
  dateFilter: _enum(["today", "yesterday", "7d", "15d", "30d", "this_month", "custom"]).default("today"),
  customStart: string().optional(),
  customEnd: string().optional()
}).parse(i)).handler(createSsrRpc("c3702d027355198bf7e1301017e87d122daf1cd7acaa27bc291cf0abb92416b5"));
const Checkbox = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Checkbox$1,
  {
    ref,
    className: cn(
      "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckboxIndicator, { className: cn("grid place-content-center text-current"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) })
  }
));
Checkbox.displayName = Checkbox$1.displayName;
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DayPicker,
    {
      showOutsideDays,
      className: cn(
        "bg-background group/calendar p-3 [--cell-size:2.25rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent select-none",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      ),
      captionLayout,
      formatters: {
        formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
        ...formatters
      },
      classNames: {
        root: cn("w-fit", defaultClassNames.root),
        months: cn("relative flex flex-col gap-6 md:flex-row md:gap-8", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-3", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1 z-10 pointer-events-none px-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-8 w-8 select-none p-0 aria-disabled:opacity-30 pointer-events-auto rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors shadow-xs",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-8 w-8 select-none p-0 aria-disabled:opacity-30 pointer-events-auto rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors shadow-xs",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-9 w-full items-center justify-center px-8 text-sm font-bold text-slate-800 tracking-tight",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-9 w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn("bg-popover absolute inset-0 opacity-0", defaultClassNames.dropdown),
        caption_label: cn(
          "select-none font-bold text-slate-800 text-sm",
          captionLayout === "label" ? "text-sm font-bold text-slate-800" : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("grid grid-cols-7 w-full border-b border-slate-100 pb-1 mb-1", defaultClassNames.weekdays),
        weekday: cn(
          "text-slate-400 select-none text-[11px] font-bold uppercase text-center h-7 flex items-center justify-center tracking-wider",
          defaultClassNames.weekday
        ),
        week: cn("grid grid-cols-7 w-full gap-x-0 gap-y-1", defaultClassNames.week),
        week_number_header: cn("w-9 select-none", defaultClassNames.week_number_header),
        week_number: cn(
          "text-muted-foreground select-none text-[0.8rem]",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative h-9 w-full select-none p-0 text-center flex items-center justify-center data-[range-middle=true]:bg-blue-50/80 data-[range-start=true]:bg-blue-50/80 data-[range-start=true]:rounded-l-lg data-[range-end=true]:bg-blue-50/80 data-[range-end=true]:rounded-r-lg data-[preview-middle=true]:bg-blue-50/60 data-[preview-start=true]:bg-blue-50/60 data-[preview-start=true]:rounded-l-lg data-[preview-end=true]:bg-blue-50/60 data-[preview-end=true]:rounded-r-lg",
          defaultClassNames.day
        ),
        range_start: cn("bg-blue-50/80 rounded-l-lg", defaultClassNames.range_start),
        range_middle: cn("bg-blue-50/80 text-blue-900 font-medium", defaultClassNames.range_middle),
        range_end: cn("bg-blue-50/80 rounded-r-lg", defaultClassNames.range_end),
        today: cn(
          "font-bold text-blue-600 underline underline-offset-4 decoration-2 decoration-blue-500",
          defaultClassNames.today
        ),
        outside: cn(
          "text-slate-300 opacity-40 pointer-events-none",
          defaultClassNames.outside
        ),
        disabled: cn("text-slate-300 pointer-events-none cursor-not-allowed font-normal line-through decoration-slate-200", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames
      },
      components: {
        Root: ({ className: className2, rootRef, ...props2 }) => {
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-slot": "calendar", ref: rootRef, className: cn(className2), ...props2 });
        },
        Chevron: ({ className: className2, orientation, ...props2 }) => {
          if (orientation === "left") {
            return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: cn("size-4", className2), ...props2 });
          }
          if (orientation === "right") {
            return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: cn("size-4", className2), ...props2 });
          }
          return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: cn("size-4", className2), ...props2 });
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props2 }) => {
          return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { ...props2, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex size-9 items-center justify-center text-center", children }) });
        },
        ...components
      },
      ...props
    }
  );
}
function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);
  const isRangeStart = Boolean(modifiers.range_start || modifiers.preview_start);
  const isRangeEnd = Boolean(modifiers.range_end || modifiers.preview_end);
  const isRangeMiddle = Boolean(modifiers.range_middle || modifiers.preview_middle);
  const isSingle = Boolean(modifiers.selected && !isRangeStart && !isRangeEnd && !isRangeMiddle);
  let srLabel;
  try {
    const formattedDate = day.date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      weekday: "long"
    });
    if (isRangeStart && isRangeEnd) {
      srLabel = `${formattedDate}, selected start and end date`;
    } else if (isRangeStart) {
      srLabel = `${formattedDate}, selected start date`;
    } else if (isRangeEnd) {
      srLabel = `${formattedDate}, selected end date`;
    } else if (isRangeMiddle) {
      srLabel = `${formattedDate}, within selected range`;
    } else {
      srLabel = formattedDate;
    }
  } catch {
    srLabel = void 0;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Button,
    {
      ref,
      variant: "ghost",
      size: "icon",
      "aria-label": srLabel,
      "aria-selected": Boolean(modifiers.selected || isRangeStart || isRangeEnd || isRangeMiddle),
      "data-day": day.date.toLocaleDateString(),
      "data-selected-single": isSingle,
      "data-range-start": isRangeStart,
      "data-range-end": isRangeEnd,
      "data-range-middle": isRangeMiddle,
      "data-preview-start": modifiers.preview_start,
      "data-preview-end": modifiers.preview_end,
      "data-preview-middle": modifiers.preview_middle,
      className: cn(
        "data-[selected-single=true]:bg-blue-600 data-[selected-single=true]:text-white data-[selected-single=true]:hover:bg-blue-700 data-[selected-single=true]:shadow-sm data-[range-middle=true]:bg-transparent data-[range-middle=true]:text-blue-900 data-[range-middle=true]:hover:bg-blue-100/70 data-[range-middle=true]:rounded-none data-[range-start=true]:bg-blue-600 data-[range-start=true]:text-white data-[range-start=true]:hover:bg-blue-700 data-[range-start=true]:shadow-sm data-[range-end=true]:bg-blue-600 data-[range-end=true]:text-white data-[range-end=true]:hover:bg-blue-700 data-[range-end=true]:shadow-sm data-[preview-start=true]:bg-blue-500 data-[preview-start=true]:text-white data-[preview-end=true]:bg-blue-500 data-[preview-end=true]:text-white group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex h-9 w-9 items-center justify-center font-semibold text-xs leading-none data-[range-end=true]:rounded-lg data-[range-start=true]:rounded-lg data-[preview-end=true]:rounded-lg data-[preview-start=true]:rounded-lg group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[2px] transition-all",
        defaultClassNames.day,
        className
      ),
      ...props
    }
  );
}
const Popover = Root2$1;
const PopoverTrigger = Trigger$1;
const PopoverContent = reactExports.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = Content2.displayName;
const DEFAULT_DATE_PRESETS = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "7d", label: "Last 7 Days" },
  { key: "15d", label: "Last 15 Days" },
  { key: "30d", label: "Last 30 Days" },
  { key: "this_week", label: "This Week" },
  { key: "last_week", label: "Last Week" },
  { key: "this_month", label: "This Month" },
  { key: "last_month", label: "Last Month" },
  { key: "this_fy", label: "This FY" },
  { key: "custom", label: "Custom Range" }
];
function getPresetRange(key2) {
  const now = /* @__PURE__ */ new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  switch (key2) {
    case "today":
      return { from: today, to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59) };
    case "yesterday": {
      const y = subDays(today, 1);
      return { from: y, to: new Date(y.getFullYear(), y.getMonth(), y.getDate(), 23, 59, 59) };
    }
    case "7d":
      return { from: subDays(today, 6), to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59) };
    case "15d":
      return { from: subDays(today, 14), to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59) };
    case "30d":
      return { from: subDays(today, 29), to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59) };
    case "this_week": {
      const start = startOfWeek(today, { weekStartsOn: 1 });
      return { from: start, to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59) };
    }
    case "last_week": {
      const prevWeekDate = subDays(today, 7);
      const start = startOfWeek(prevWeekDate, { weekStartsOn: 1 });
      const end = endOfWeek(prevWeekDate, { weekStartsOn: 1 });
      return { from: start, to: new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59) };
    }
    case "this_month": {
      const start = startOfMonth(today);
      return { from: start, to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59) };
    }
    case "last_month": {
      const prevMonth = subMonths(today);
      const start = startOfMonth(prevMonth);
      const end = endOfMonth(prevMonth);
      return { from: start, to: new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59) };
    }
    case "this_fy": {
      const year = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
      const start = new Date(year, 3, 1);
      return { from: start, to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59) };
    }
    case "custom":
    default:
      return { from: subDays(today, 29), to: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59) };
  }
}
function DateRangePicker({
  value,
  onChange,
  preset = "custom",
  onPresetChange,
  presets = DEFAULT_DATE_PRESETS,
  className,
  align = "start",
  placeholder = "Select date range"
}) {
  const [open, setOpen] = reactExports.useState(false);
  const triggerRef = reactExports.useRef(null);
  const [activePreset, setActivePreset] = reactExports.useState(preset);
  const [draftRange, setDraftRange] = reactExports.useState(() => {
    if (value?.from || value?.to) {
      return { from: value.from, to: value.to };
    }
    return getPresetRange(preset);
  });
  const [hoverDate, setHoverDate] = reactExports.useState(null);
  const [month, setMonth] = reactExports.useState(() => {
    const targetDate = value?.to ?? /* @__PURE__ */ new Date();
    return subMonths(targetDate);
  });
  reactExports.useEffect(() => {
    if (open) return;
    setActivePreset(preset);
    if (preset !== "custom") {
      const calc = getPresetRange(preset);
      setDraftRange({ from: calc.from, to: calc.to });
    } else if (value?.from || value?.to) {
      setDraftRange({ from: value.from, to: value.to });
    } else {
      setDraftRange(void 0);
    }
  }, [preset, value?.from?.getTime(), value?.to?.getTime(), open]);
  const handleOpenChange = (nextOpen) => {
    if (nextOpen) {
      setActivePreset(preset);
      if (preset !== "custom") {
        const calc = getPresetRange(preset);
        setDraftRange({ from: calc.from, to: calc.to });
        setMonth(subMonths(calc.to));
      } else if (value?.from || value?.to) {
        setDraftRange({ from: value.from, to: value.to });
        setMonth(value.to ? subMonths(value.to) : subMonths(/* @__PURE__ */ new Date()));
      } else {
        setDraftRange(void 0);
        setMonth(subMonths(/* @__PURE__ */ new Date()));
      }
      setHoverDate(null);
      setOpen(true);
    } else {
      handleCancel();
    }
  };
  const handleSelectPreset = (key2) => {
    setActivePreset(key2);
    setHoverDate(null);
    if (key2 !== "custom") {
      const computed = getPresetRange(key2);
      setDraftRange({ from: computed.from, to: computed.to });
      setMonth(subMonths(computed.to));
    }
  };
  const handleDayClick = (clickedDate) => {
    setActivePreset("custom");
    if (!draftRange?.from || draftRange.from && draftRange.to) {
      setDraftRange({ from: clickedDate, to: void 0 });
      setHoverDate(null);
    } else {
      const start = draftRange.from;
      if (isBefore(clickedDate, start)) {
        setDraftRange({ from: clickedDate, to: start });
      } else {
        setDraftRange({ from: start, to: clickedDate });
      }
      setHoverDate(null);
    }
  };
  const handleMouseLeaveCalendar = () => {
    setHoverDate(null);
  };
  const handleReset = () => {
    setDraftRange(void 0);
    setHoverDate(null);
    setActivePreset("custom");
  };
  const handleCancel = () => {
    if (preset !== "custom") {
      const calc = getPresetRange(preset);
      setDraftRange({ from: calc.from, to: calc.to });
    } else if (value?.from || value?.to) {
      setDraftRange({ from: value.from, to: value.to });
    } else {
      setDraftRange(void 0);
    }
    setActivePreset(preset);
    setHoverDate(null);
    setOpen(false);
    triggerRef.current?.focus();
  };
  const handleApply = () => {
    if (draftRange?.from) {
      const from = draftRange.from;
      const to = draftRange.to || draftRange.from;
      const toEnd = new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59);
      onChange?.({ from, to: toEnd }, activePreset);
      onPresetChange?.(activePreset);
    }
    setOpen(false);
    triggerRef.current?.focus();
  };
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };
  const selectedRangeForDisplay = reactExports.useMemo(() => {
    if (draftRange?.from && draftRange?.to) {
      return { from: draftRange.from, to: draftRange.to };
    }
    if (draftRange?.from && hoverDate) {
      const from = isBefore(hoverDate, draftRange.from) ? hoverDate : draftRange.from;
      const to = isBefore(hoverDate, draftRange.from) ? draftRange.from : hoverDate;
      return { from, to };
    }
    if (draftRange?.from) {
      return { from: draftRange.from, to: draftRange.from };
    }
    return void 0;
  }, [draftRange?.from, draftRange?.to, hoverDate]);
  const daysCount = reactExports.useMemo(() => {
    if (draftRange?.from && draftRange?.to) {
      return differenceInDays(draftRange.to, draftRange.from) + 1;
    }
    if (draftRange?.from && hoverDate) {
      const from = isBefore(hoverDate, draftRange.from) ? hoverDate : draftRange.from;
      const to = isBefore(hoverDate, draftRange.from) ? draftRange.from : hoverDate;
      return differenceInDays(to, from) + 1;
    }
    return 0;
  }, [draftRange?.from, draftRange?.to, hoverDate]);
  const instructionText = reactExports.useMemo(() => {
    if (!draftRange?.from) {
      return "Select start date";
    }
    if (draftRange.from && !draftRange.to) {
      return "Select end date";
    }
    return "Review your date range, then click Apply Filter";
  }, [draftRange?.from, draftRange?.to]);
  const displayLabel = reactExports.useMemo(() => {
    if (preset !== "custom") {
      const pObj = presets.find((p) => p.key === preset);
      if (pObj) {
        if (value?.from && value?.to) {
          return `${pObj.label} (${format(value.from, "d MMM")} – ${format(value.to, "d MMM")})`;
        }
        return pObj.label;
      }
    }
    if (value?.from && value?.to) {
      return `${format(value.from, "d MMM yyyy")} — ${format(value.to, "d MMM yyyy")}`;
    }
    return placeholder;
  }, [preset, presets, value?.from, value?.to, placeholder]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("inline-flex items-center", className), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open, onOpenChange: handleOpenChange, modal: true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        ref: triggerRef,
        variant: "outline",
        role: "combobox",
        "aria-expanded": open,
        "aria-label": "Select date range",
        className: cn(
          "h-9 px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center gap-2",
          open && "border-blue-500 ring-2 ring-blue-500/20"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar$1, { className: "size-3.5 text-slate-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[280px]", children: displayLabel })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      PopoverContent,
      {
        align,
        onKeyDown: handleKeyDown,
        onFocusOutside: (e) => e.preventDefault(),
        className: "w-auto p-0 rounded-2xl border border-slate-200/80 bg-white shadow-2xl overflow-hidden z-50 min-w-[340px] md:min-w-[700px]",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sr-only", "aria-live": "polite", "aria-atomic": "true", children: instructionText }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full md:w-48 bg-slate-50/70 border-b md:border-b-0 md:border-r border-slate-100 p-3 flex flex-col justify-between shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2.5 py-1 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400", children: "Quick Presets" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-row md:flex-col gap-1 overflow-x-auto no-scrollbar md:overflow-visible pb-1 md:pb-0", children: presets.map((p) => {
                const isActive = activePreset === p.key;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleSelectPreset(p.key),
                    className: cn(
                      "w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center justify-between",
                      isActive ? "bg-blue-600 text-white shadow-xs font-bold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                    ),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: p.label }),
                      isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3 shrink-0 hidden md:block" })
                    ]
                  },
                  p.key
                );
              }) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-white", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: cn(
                          "px-2.5 py-1 rounded-lg font-semibold border transition-colors",
                          draftRange?.from ? "bg-blue-50 text-blue-900 border-blue-200" : "bg-slate-100 text-slate-500 border-slate-200/60"
                        ),
                        children: draftRange?.from ? format(draftRange.from, "MMM d, yyyy") : "Start Date"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 font-medium", children: "to" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: cn(
                          "px-2.5 py-1 rounded-lg font-semibold border transition-colors",
                          draftRange?.to ? "bg-blue-50 text-blue-900 border-blue-200" : "bg-slate-100 text-slate-500 border-slate-200/60"
                        ),
                        children: draftRange?.to ? format(draftRange.to, "MMM d, yyyy") : draftRange?.from ? hoverDate ? format(hoverDate, "MMM d, yyyy") : "Select end date" : "End Date"
                      }
                    )
                  ] }),
                  daysCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100", children: [
                    daysCount,
                    " ",
                    daysCount === 1 ? "day" : "days"
                  ] })
                ] }),
                draftRange?.from && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: handleReset,
                    className: "text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 hover:bg-slate-100 px-2 py-1 rounded-md transition-colors font-medium",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "size-3" }),
                      " Reset"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "p-4 bg-white flex justify-center",
                  onMouseLeave: handleMouseLeaveCalendar,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Calendar,
                    {
                      mode: "range",
                      selected: selectedRangeForDisplay,
                      onDayClick: handleDayClick,
                      numberOfMonths: 2,
                      month,
                      onMonthChange: setMonth,
                      showOutsideDays: false,
                      disabled: { after: /* @__PURE__ */ new Date() },
                      className: "p-0 font-sans",
                      modifiers: {
                        range_start: draftRange?.from ? [draftRange.from] : [],
                        range_end: draftRange?.to ? [draftRange.to] : [],
                        preview_start: draftRange?.from && !draftRange?.to && hoverDate && isBefore(hoverDate, draftRange.from) ? [hoverDate] : [],
                        preview_end: draftRange?.from && !draftRange?.to && hoverDate && !isBefore(hoverDate, draftRange.from) ? [hoverDate] : []
                      }
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-slate-500 font-medium hidden sm:inline", children: instructionText }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 ml-auto", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "ghost",
                      size: "sm",
                      onClick: handleCancel,
                      className: "text-xs font-semibold text-slate-600 hover:text-slate-900 h-8 px-3 rounded-lg",
                      children: "Cancel"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      onClick: handleApply,
                      disabled: !draftRange?.from,
                      className: "text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white h-8 px-4 rounded-lg shadow-xs flex items-center gap-1.5 disabled:opacity-50",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-3.5" }),
                        " Apply Filter"
                      ]
                    }
                  )
                ] })
              ] })
            ] })
          ] })
        ]
      }
    )
  ] }) });
}
const Select = Select$1;
const SelectGroup = SelectGroup$1;
const SelectValue = SelectValue$1;
const SelectTrigger = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SelectTrigger$1,
  {
    ref,
    className: cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectIcon, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectTrigger$1.displayName;
const SelectScrollUpButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectScrollUpButton$1,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
const SelectScrollDownButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectScrollDownButton$1,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
const SelectContent = reactExports.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectPortal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SelectContent$1,
  {
    ref,
    className: cn(
      "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SelectViewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectContent$1.displayName;
const SelectLabel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectLabel$1,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectLabel$1.displayName;
const SelectItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SelectItem$1,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItemIndicator, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectItem$1.displayName;
const SelectSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectSeparator$1,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectSeparator$1.displayName;
const ROLE_VALUES = ASSIGNABLE_ROLES;
const EMPLOYMENT_STATUS_VALUES = ["ACTIVE", "INACTIVE", "SUSPENDED", "TERMINATED", "ARCHIVED"];
const listStaffUsers = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("16b48c19c873a3820188a883fc9714851723be9892c780834083f3dfabad21c4"));
const getWorkforceDashboardMetrics = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("9086494cebbe0ce49af5ad30994e07139bf1702db7d73aea84fd989a88ffdd95"));
const InviteInput = object({
  full_name: string().trim().min(1).max(120),
  email: string().trim().email().max(255),
  mobile: string().trim().max(20).optional().nullable(),
  smartflo_agent_id: string().trim().max(100).optional().nullable(),
  role: _enum(ROLE_VALUES),
  department: string().trim().max(120).optional().nullable(),
  max_workload: number$1().int().min(5).max(200).default(50),
  auto_assign_enabled: boolean().default(false),
  // New employees default to OFF per spec!
  password: string().min(8).max(72).optional()
});
const inviteEmployee = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => InviteInput.parse(i)).handler(createSsrRpc("509d2bd4378ad9d098bd782e350146f68fa8ba764960488fb8e180072ebcc666"));
const UpdateInput = object({
  user_id: string().uuid(),
  full_name: string().trim().min(1).max(120).optional(),
  mobile: string().trim().max(20).optional().nullable(),
  smartflo_agent_id: string().trim().max(100).optional().nullable(),
  role: _enum(ROLE_VALUES).optional(),
  department: string().trim().max(120).optional().nullable(),
  joining_date: string().trim().max(20).optional().nullable(),
  max_workload: number$1().int().min(5).max(200).optional(),
  auto_assign_enabled: boolean().optional()
});
const updateEmployee = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => UpdateInput.parse(i)).handler(createSsrRpc("acdc84c5b6654c7e1618a2b180126a2ad9b2910aeb3e10dcd17fd575a48a74b5"));
const EmploymentStatusInput = object({
  user_id: string().uuid(),
  status: _enum(EMPLOYMENT_STATUS_VALUES),
  reason: string().optional()
});
const setEmploymentStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => EmploymentStatusInput.parse(i)).handler(createSsrRpc("1447999af53c2f01ede2170946a3a4ec8292344b67bd085b52b27aedeb2d87c5"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  user_id: string().uuid(),
  enabled: boolean()
}).parse(i)).handler(createSsrRpc("d9d55c1ca43dacb36fc0449eea5f535b04bc1af8d112c9b1f19574f972c083e1"));
const archiveEmployee = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  user_id: string().uuid(),
  reason: string().optional()
}).parse(i)).handler(createSsrRpc("cd400d41658f23e803b7f6688b2ab0148e33b17225845ce91427c788162419c9"));
const deleteEmployee = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  user_id: string().uuid()
}).parse(i)).handler(createSsrRpc("a6d9530ee14b15af1f81b1edf893a9451d0052e52fc04788d6074693bd70857e"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  user_id: string().uuid(),
  is_active: boolean()
}).parse(i)).handler(createSsrRpc("160e215610bb38261254077ccd1b7868655ea22735a5cc5f0c6f552c81e98589"));
const resetEmployeePassword = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  user_id: string().uuid(),
  new_password: string().min(8).max(72)
}).parse(i)).handler(createSsrRpc("5f54c01c40533c5893e3147e411a98b6337aba4a6b82dc6725404c01e116b4e8"));
const grantRole = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  user_id: string().uuid(),
  role: _enum(ROLE_VALUES)
}).parse(i)).handler(createSsrRpc("73d3cf99b38a1733357a6235415e0959e91e3ffdecbb230c73f1925718ee9090"));
const revokeRole = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  user_id: string().uuid(),
  role: _enum(ROLE_VALUES)
}).parse(i)).handler(createSsrRpc("0bc3099bda84fb4eac018557f525133d2dba8b74cef9bde593056ebf8b39db50"));
const getEmployeeWorkAccess = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  user_id: string().uuid()
}).parse(i)).handler(createSsrRpc("f44d566350427ee1369a974c32a3d66e3de1be5fb11479cde11092b1faa428fa"));
const setEmployeeWorkAccess = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  user_id: string().uuid(),
  work: object({
    "work.leads": boolean().default(false),
    "work.orders": boolean().default(false),
    "work.support": boolean().default(false),
    "work.finance": boolean().default(false)
  }),
  websites: array(string().uuid()).default([]),
  services: array(string().uuid()).default([])
}).parse(i)).handler(createSsrRpc("0a2a20e39134d06d5b5766c1ca724ce3765278e9dcd94def11e9276d82f13c18"));
const getMyStaffRoles = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("07e98faa67ee2e14380a5485f7dcbfa3db6a48d37fdad1fa8084acd7a60f7bf9"));
function useRole() {
  const fetchRoles = useServerFn(getMyStaffRoles);
  const { data, isLoading } = useQuery({
    queryKey: ["myStaffRoles"],
    queryFn: () => fetchRoles(),
    staleTime: 5 * 60 * 1e3
  });
  const roles = data?.roles ?? [];
  return {
    userId: data?.userId ?? null,
    loading: isLoading,
    roles,
    displayName: data?.displayName ?? null,
    has: (r) => roles.includes(r),
    hasAny: (rs) => rs.some((r) => roles.includes(r)),
    access: (m) => bestAccess(roles, m),
    can: (m) => canSeeModule(roles, m),
    canApproveRefund: () => canApproveRefund(roles),
    canSeeMoney: () => canSeeMoney(roles),
    hideMoney: () => hideMoneyFor(roles)
  };
}
function usePermissions() {
  const fn = useServerFn(getMyPermissions);
  const q = useQuery({
    queryKey: ["my-permissions"],
    queryFn: () => fn(),
    staleTime: 6e4
  });
  const perms = q.data;
  function can(moduleKey, action = "view") {
    if (!perms) return false;
    if (perms.isAdmin) return true;
    const m = perms.modules[moduleKey] ?? (moduleKey === "leads" ? perms.modules["work.leads"] : moduleKey === "work.leads" ? perms.modules["leads"] : moduleKey === "orders" ? perms.modules["work.orders"] : moduleKey === "work.orders" ? perms.modules["orders"] : void 0);
    if (!m) return false;
    return !!m[action];
  }
  function scopeIds(moduleKey) {
    if (!perms || perms.isAdmin) return { all: true, websites: [], categories: [], services: [] };
    const m = perms.modules[moduleKey];
    if (!m || m.scopeAll) return { all: true, websites: [], categories: [], services: [] };
    const websites = [];
    const categories = [];
    const services = [];
    for (const s of m.scopes) {
      if (s.serviceId) services.push(s.serviceId);
      else if (s.categoryId) categories.push(s.categoryId);
      else if (s.websiteId) websites.push(s.websiteId);
    }
    return { all: false, websites, categories, services };
  }
  return { perms, can, scopeIds, isLoading: q.isLoading };
}
function useRealtimeTable(table, onChange, opts) {
  reactExports.useEffect(() => {
    const schema = opts?.schema ?? "public";
    let cancelled = false;
    let channel = null;
    (async () => {
      const { data } = await supabase.auth.getUser();
      const uid = data.user?.id;
      if (!uid || cancelled) return;
      const topic = `user:${uid}:${schema}:${table}:${opts?.filter ?? "all"}:${Math.random().toString(36).slice(2)}`;
      channel = supabase.channel(topic).on(
        "postgres_changes",
        { event: "*", schema, table, ...opts?.filter ? { filter: opts.filter } : {} },
        () => onChange()
      ).subscribe();
    })();
    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, [table, opts?.filter, opts?.schema]);
}
const scrollPositions = /* @__PURE__ */ new Map();
function usePreserveScroll(key2, isDataReady = true) {
  reactExports.useEffect(() => {
    if (!isDataReady) return;
    const container = document.getElementById("admin-main-scroll");
    const savedScrollTop = scrollPositions.get(key2);
    if (container && savedScrollTop !== void 0 && savedScrollTop > 0) {
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => {
          if (container) container.scrollTop = savedScrollTop;
        });
        return () => cancelAnimationFrame(raf2);
      });
      return () => cancelAnimationFrame(raf1);
    }
  }, [key2, isDataReady]);
  reactExports.useEffect(() => {
    const container = document.getElementById("admin-main-scroll");
    if (!container) return;
    const handleScroll = () => {
      scrollPositions.set(key2, container.scrollTop);
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      if (container) scrollPositions.set(key2, container.scrollTop);
      container.removeEventListener("scroll", handleScroll);
    };
  }, [key2]);
}
const moduleStates = /* @__PURE__ */ new Map();
function saveModuleFilterState(key2, state) {
  moduleStates.set(key2, { ...moduleStates.get(key2), ...state });
}
function getModuleFilterState(key2) {
  return moduleStates.get(key2);
}
function clearModuleFilterState(key2) {
  moduleStates.delete(key2);
  scrollPositions.delete(key2);
}
const STORAGE_KEY$1 = "crm_financial_privacy";
const FINANCIAL_PRIVACY_MASK = "••••••";
function formatINRRaw(value, isPrivacyEnabled = false, options) {
  const prefix = options?.prefix ?? "₹";
  const suffix = options?.suffix ?? "";
  if (isPrivacyEnabled) {
    return `${prefix}${FINANCIAL_PRIVACY_MASK}${suffix}`;
  }
  if (value == null || value === "") {
    return `${prefix}0${suffix}`;
  }
  const num = typeof value === "number" ? value : Number(value);
  if (isNaN(num)) {
    return `${prefix}0${suffix}`;
  }
  const maxDigits = options?.maximumFractionDigits ?? 0;
  const minDigits = options?.minimumFractionDigits ?? 0;
  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits
  }).format(num);
  return `${prefix}${formatted}${suffix}`;
}
function formatShortINRRaw(value, isPrivacyEnabled = false, options) {
  const prefix = options?.prefix ?? "₹";
  if (isPrivacyEnabled) {
    return `${prefix}${FINANCIAL_PRIVACY_MASK}`;
  }
  if (value == null || value === "") {
    return `${prefix}0`;
  }
  const num = typeof value === "number" ? value : Number(value);
  if (isNaN(num)) {
    return `${prefix}0`;
  }
  if (num >= 1e7) {
    return `${prefix}${(num / 1e7).toFixed(2)}Cr`;
  }
  if (num >= 1e5) {
    return `${prefix}${(num / 1e5).toFixed(2)}L`;
  }
  if (num >= 1e3) {
    return `${prefix}${(num / 1e3).toFixed(1)}k`;
  }
  return `${prefix}${Math.round(num)}`;
}
function formatFinancialAmountRaw(value, isPrivacyEnabled = false, options) {
  if (options?.isShort) {
    return formatShortINRRaw(value, isPrivacyEnabled, { prefix: options.prefix });
  }
  return formatINRRaw(value, isPrivacyEnabled, options);
}
function maskFinancialAmountRaw(value, isPrivacyEnabled = false, maskPlaceholder = FINANCIAL_PRIVACY_MASK) {
  if (isPrivacyEnabled) {
    return maskPlaceholder;
  }
  return value != null ? String(value) : "—";
}
const FinancialVisibilityContext = reactExports.createContext(null);
function FinancialVisibilityProvider({ children }) {
  const [isFinancialPrivacyEnabled, setIsFinancialPrivacyEnabled] = reactExports.useState(false);
  reactExports.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY$1);
      if (stored !== null) {
        setIsFinancialPrivacyEnabled(stored === "true");
      }
    } catch {
    }
  }, []);
  const setFinancialPrivacy = reactExports.useCallback((enabled) => {
    setIsFinancialPrivacyEnabled(enabled);
    try {
      localStorage.setItem(STORAGE_KEY$1, enabled ? "true" : "false");
    } catch {
    }
  }, []);
  const toggleFinancialPrivacy = reactExports.useCallback(() => {
    setFinancialPrivacy(!isFinancialPrivacyEnabled);
  }, [isFinancialPrivacyEnabled, setFinancialPrivacy]);
  const formatINR = reactExports.useCallback(
    (value2, options) => {
      return formatINRRaw(value2, isFinancialPrivacyEnabled, options);
    },
    [isFinancialPrivacyEnabled]
  );
  const formatShortINR = reactExports.useCallback(
    (value2, options) => {
      return formatShortINRRaw(value2, isFinancialPrivacyEnabled, options);
    },
    [isFinancialPrivacyEnabled]
  );
  const formatFinancialAmount = reactExports.useCallback(
    (value2, options) => {
      return formatFinancialAmountRaw(value2, isFinancialPrivacyEnabled, options);
    },
    [isFinancialPrivacyEnabled]
  );
  const maskAmount = reactExports.useCallback(
    (value2, maskPlaceholder) => {
      return maskFinancialAmountRaw(value2, isFinancialPrivacyEnabled, maskPlaceholder);
    },
    [isFinancialPrivacyEnabled]
  );
  const value = reactExports.useMemo(
    () => ({
      isFinancialPrivacyEnabled,
      toggleFinancialPrivacy,
      setFinancialPrivacy,
      formatINR,
      formatShortINR,
      formatFinancialAmount,
      maskAmount
    }),
    [
      isFinancialPrivacyEnabled,
      toggleFinancialPrivacy,
      setFinancialPrivacy,
      formatINR,
      formatShortINR,
      formatFinancialAmount,
      maskAmount
    ]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FinancialVisibilityContext.Provider, { value, children });
}
function useFinancialVisibility() {
  const ctx = reactExports.useContext(FinancialVisibilityContext);
  if (!ctx) {
    return {
      isFinancialPrivacyEnabled: false,
      toggleFinancialPrivacy: () => {
      },
      setFinancialPrivacy: () => {
      },
      formatINR: (v, opts) => formatINRRaw(v, false, opts),
      formatShortINR: (v, opts) => formatShortINRRaw(v, false, opts),
      formatFinancialAmount: (v, opts) => formatFinancialAmountRaw(v, false, opts),
      maskAmount: (v, mask) => maskFinancialAmountRaw(v, false, mask)
    };
  }
  return ctx;
}
const STORAGE_KEY = "crm_dashboard_privacy_mode";
const DASHBOARD_PRIVACY_MASK = "•••";
const DashboardPrivacyContext = reactExports.createContext(null);
function DashboardPrivacyProvider({ children }) {
  const [isPrivacyEnabled, setIsPrivacyEnabled] = reactExports.useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });
  reactExports.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setIsPrivacyEnabled(stored === "true");
      }
    } catch {
    }
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue !== null) {
        setIsPrivacyEnabled(e.newValue === "true");
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);
  const setPrivacy = reactExports.useCallback((enabled) => {
    setIsPrivacyEnabled(enabled);
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? "true" : "false");
      window.dispatchEvent(new CustomEvent("dashboard-privacy-changed", { detail: { enabled } }));
    } catch {
    }
  }, []);
  const togglePrivacy = reactExports.useCallback(() => {
    setPrivacy(!isPrivacyEnabled);
  }, [isPrivacyEnabled, setPrivacy]);
  const maskValue = reactExports.useCallback(
    (value2, maskPlaceholder = DASHBOARD_PRIVACY_MASK) => {
      if (isPrivacyEnabled) {
        return maskPlaceholder;
      }
      if (value2 == null) return "—";
      return typeof value2 === "number" ? value2.toLocaleString("en-IN") : String(value2);
    },
    [isPrivacyEnabled]
  );
  const value = reactExports.useMemo(
    () => ({
      isPrivacyEnabled,
      togglePrivacy,
      setPrivacy,
      maskValue
    }),
    [isPrivacyEnabled, togglePrivacy, setPrivacy, maskValue]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardPrivacyContext.Provider, { value, children });
}
function useDashboardPrivacy() {
  const ctx = reactExports.useContext(DashboardPrivacyContext);
  const role = useRole();
  const userPerms = usePermissions();
  const isSuperAdmin = role.has("super_admin") || role.has("super");
  const isAdminUser = isSuperAdmin || role.has("admin") || Boolean(userPerms.perms?.isAdmin);
  if (!ctx || !role.loading && !isAdminUser) {
    return {
      isPrivacyEnabled: false,
      togglePrivacy: () => {
      },
      setPrivacy: () => {
      },
      maskValue: (v) => v != null ? String(v) : "—"
    };
  }
  return ctx;
}
const Route$P = createFileRoute()({
  validateSearch: (search) => ({
    filter: typeof search.filter === "string" ? search.filter : void 0,
    preset: typeof search.preset === "string" ? search.preset : void 0,
    dateFrom: typeof search.dateFrom === "string" ? search.dateFrom : void 0,
    dateTo: typeof search.dateTo === "string" ? search.dateTo : void 0,
    stage: typeof search.stage === "string" ? search.stage : void 0,
    search: typeof search.search === "string" ? search.search : void 0
  }),
  head: () => ({ meta: [{ title: "Orders — Udyam Ops OS" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: OrdersListPage
});
const BUCKET_CARDS = [
  {
    id: "all",
    label: "ALL ORDERS",
    subtitle: "All in Range",
    icon: LayoutGrid,
    adminOnly: true
  },
  {
    id: "needs_action",
    label: "NEEDS ACTION",
    subtitle: "Needs Action",
    icon: Inbox,
    tone: "rose"
  },
  {
    id: "idle_time",
    label: "IDLE TIME",
    subtitle: "Action Pace Timer",
    icon: Timer,
    badge: {
      text: "Live",
      pillClass: "bg-emerald-500 text-white font-bold"
    },
    tone: "amber"
  },
  {
    id: "hot_orders",
    label: "HOT ORDERS",
    subtitle: "<15m Critical SLA",
    icon: Flame,
    badge: {
      text: "Due Now",
      pillClass: "bg-rose-500 text-white font-bold"
    },
    tone: "rose"
  },
  {
    id: "backlog",
    label: "BACKLOG",
    subtitle: "Oldest Untouched",
    icon: Clock,
    badge: {
      text: "Oldest First",
      pillClass: "bg-amber-600 text-white font-bold"
    },
    tone: "amber"
  },
  {
    id: "technical_delay",
    label: "TECHNICAL DELAY",
    subtitle: "NIC/Gov Portal Down",
    icon: Server,
    tone: "sky"
  },
  {
    id: "reminders",
    label: "CALL BACK SCHEDULED",
    subtitle: "Active Callbacks",
    icon: PhoneForwarded,
    badge: {
      text: "Active",
      pillClass: "bg-blue-600 text-white font-bold"
    },
    tone: "indigo"
  },
  {
    id: "customer_delay",
    label: "CUSTOMER DELAY",
    subtitle: "Pending OTP/Docs",
    icon: UserX,
    tone: "amber"
  },
  {
    id: "pending",
    label: "ACTION TAKEN",
    subtitle: "In-Progress & Delays",
    icon: Hourglass,
    tone: "amber"
  },
  {
    id: "completed",
    label: "COMPLETED",
    subtitle: "Fulfilled in range",
    icon: CircleCheck,
    tone: "emerald"
  },
  {
    id: "closed",
    label: "CLOSED",
    subtitle: "Archived in range",
    icon: CheckCheck
  },
  {
    id: "pending_orders",
    label: "PENDING ORDERS",
    subtitle: "Action + Callback + Delay",
    icon: Hourglass,
    tone: "indigo"
  }
];
const STAGE_FILTER_OPTIONS = [
  { id: "all", label: "All Stages", tone: "slate" },
  { id: "payment_done", label: "Incomplete Form", tone: "emerald" },
  { id: "form_not_submitted", label: "Form Not Submitted Delay", tone: "amber" },
  { id: "order_reopened", label: "Order Reopened", tone: "violet" },
  { id: "form_submitted", label: "Form Submitted", tone: "indigo" },
  { id: "technical_delay", label: "Technical Delay", tone: "sky" },
  { id: "customer_delay", label: "Customer Delay", tone: "amber" },
  { id: "submitted_to_govt", label: "Submitted to Govt", tone: "indigo" },
  { id: "certificate_ready", label: "Certificate Ready", tone: "emerald" },
  { id: "completed", label: "Completed", tone: "emerald" },
  { id: "closed", label: "Order Closed", tone: "rose" }
];
const PENDING_AGE_OPTIONS = [
  { id: "any", label: "Any age" },
  { id: "1", label: "1 day+ pending" },
  { id: "2", label: "2 days+ pending" },
  { id: "3", label: "3 days+ pending" },
  { id: "7", label: "7 days+ pending" },
  { id: "custom", label: "Custom days…" }
];
const RANGE_PRESETS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7d", label: "7 days" },
  { value: "15d", label: "15 days" },
  { value: "30d", label: "30 days" },
  { value: "mtd", label: "This month" },
  { value: "custom", label: "Custom" }
];
function daysSince(iso) {
  if (!iso) return 0;
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return 0;
  return Math.max(0, Math.floor((Date.now() - t) / 864e5));
}
function OrderIdleTimerKpiCard({
  latestActionAt,
  latestActionLabel,
  latestActionOrderCode,
  isActive,
  onClick
}) {
  const [elapsedMs, setElapsedMs] = reactExports.useState(
    () => latestActionAt ? Math.max(0, Date.now() - new Date(latestActionAt).getTime()) : 0
  );
  reactExports.useEffect(() => {
    if (!latestActionAt) {
      setElapsedMs(0);
      return;
    }
    const tick = () => {
      setElapsedMs(Math.max(0, Date.now() - new Date(latestActionAt).getTime()));
    };
    tick();
    const interval = setInterval(tick, 1e3);
    return () => clearInterval(interval);
  }, [latestActionAt]);
  const seconds = Math.floor(elapsedMs / 1e3);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const { isPrivacyEnabled } = useDashboardPrivacy();
  const displayTime = isPrivacyEnabled ? "••m ••s" : !latestActionAt ? "0m 00s" : hours > 0 ? `${hours}h ${String(minutes % 60).padStart(2, "0")}m ${String(seconds % 60).padStart(2, "0")}s` : `${minutes}m ${String(seconds % 60).padStart(2, "0")}s`;
  const isHealthy = !latestActionAt || minutes < 15;
  const isAttention = Boolean(latestActionAt && minutes >= 15 && minutes < 60);
  const toneCls = isHealthy ? "bg-emerald-600 text-white font-bold" : isAttention ? "bg-amber-600 text-white font-bold" : "bg-rose-600 text-white font-bold";
  const statusText = !latestActionAt ? "Ready" : isHealthy ? "Active" : isAttention ? "Idle" : "Away";
  const containerBg = isActive ? isHealthy ? "bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm ring-2 ring-emerald-300" : isAttention ? "bg-amber-50 border-amber-500 text-amber-950 shadow-sm ring-2 ring-amber-300" : "bg-rose-50 border-rose-500 text-rose-950 shadow-sm ring-2 ring-rose-300" : isHealthy ? "bg-emerald-50/50 border-emerald-200/90 text-emerald-950 hover:bg-emerald-50 hover:border-emerald-300" : isAttention ? "bg-amber-50/50 border-amber-200/90 text-amber-950 hover:bg-amber-50 hover:border-amber-300" : "bg-rose-50/50 border-rose-200/90 text-rose-950 hover:bg-rose-50 hover:border-rose-300";
  const headerCls = isHealthy ? "text-emerald-700 font-bold" : isAttention ? "text-amber-800 font-bold" : "text-rose-700 font-bold";
  const iconCls = isHealthy ? "text-emerald-600" : isAttention ? "text-amber-700" : "text-rose-600";
  const timerCls = isHealthy ? "text-emerald-950 font-bold" : isAttention ? "text-amber-950 font-bold" : "text-rose-950 font-bold";
  const subtitleCls = isHealthy ? "text-emerald-700/80" : isAttention ? "text-amber-700/80" : "text-rose-700/80";
  const subtitleText = isPrivacyEnabled ? "Live employee timer" : latestActionLabel ? `Since ${latestActionLabel}${latestActionOrderCode ? ` (#${latestActionOrderCode})` : ""}` : "Live employee timer";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick,
      className: cn(
        "flex flex-col justify-between p-2.5 rounded-xl min-h-[88px] border transition-all duration-150 cursor-pointer select-none text-left group shadow-xs hover:shadow-sm",
        containerBg
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-1 w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex h-2 w-2 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isHealthy ? "bg-emerald-400" : isAttention ? "bg-amber-400" : "bg-rose-400") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("relative inline-flex rounded-full h-2 w-2", isHealthy ? "bg-emerald-500" : isAttention ? "bg-amber-500" : "bg-rose-500") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("text-[10px] font-bold tracking-wider uppercase truncate", headerCls), title: "Idle Time", children: "IDLE TIME" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: cn("w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110", iconCls) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between gap-1 mt-1 w-full min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("font-mono text-base font-black tracking-tight whitespace-nowrap leading-none", timerCls), children: displayTime }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("text-[8.5px] font-bold px-1.5 py-0.5 rounded leading-none shrink-0 whitespace-nowrap shadow-2xs", toneCls), children: statusText })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("text-[9.5px] font-medium truncate mt-1 leading-tight", subtitleCls), title: subtitleText, children: subtitleText })
      ]
    }
  );
}
function OrdersListPage({ mode = "self" }) {
  const isTeam = mode === "team";
  const listFn = useServerFn(listOrdersV2);
  const assignStaffFn = useServerFn(listAssignmentStaff);
  const historicalStaffFn = useServerFn(listAllHistoricalStaff);
  const svcFn = useServerFn(listServices);
  const getMyPerfFn = useServerFn(getMyPerformanceDashboard);
  const role = useRole();
  const userPerms = usePermissions();
  const isAdmin = role.hasAny(["admin", "super_admin"]) || Boolean(userPerms.perms?.isAdmin);
  const isManager = role.has("manager");
  const canManageOrders = isAdmin || isManager;
  const isPrivileged = isAdmin || isManager || isTeam;
  const hideMoney = role.hideMoney();
  const { isPrivacyEnabled } = useDashboardPrivacy();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const storageKey = isTeam ? "admin.team-orders" : "admin.orders";
  const savedState = reactExports.useMemo(() => getModuleFilterState(storageKey), [storageKey]);
  const todayKey = reactExports.useMemo(() => istDateKey(/* @__PURE__ */ new Date()), []);
  const [datePreset, setDatePreset] = reactExports.useState(() => {
    if (savedState?.datePreset) return savedState.datePreset;
    if (savedState?.dateFrom && savedState.dateFrom !== todayKey) return "custom";
    return "today";
  });
  const [fulfillmentStatus, setFulfillmentStatus] = reactExports.useState(savedState?.fulfillmentStatus ?? "all");
  const [serviceId, setServiceId] = reactExports.useState(savedState?.serviceId ?? "all");
  const [assignedTo, setAssignedTo] = reactExports.useState(() => {
    if (isTeam) {
      return savedState?.assignedTo && savedState.assignedTo !== role.userId ? savedState.assignedTo : "all";
    }
    if (!isAdmin && isManager) {
      if (savedState?.assignedTo && savedState.assignedTo !== "all") {
        return savedState.assignedTo;
      }
      return role.userId || "all";
    }
    return savedState?.assignedTo ?? "all";
  });
  reactExports.useEffect(() => {
    if (isTeam) {
      if (role.userId && assignedTo === role.userId) setAssignedTo("all");
      return;
    }
    if (!isAdmin && isManager && role.userId && assignedTo === "all") {
      setAssignedTo(role.userId);
    }
  }, [isTeam, isAdmin, isManager, role.userId, assignedTo]);
  const selectedEmployeeId = canManageOrders && assignedTo && assignedTo !== "all" && assignedTo !== "unassigned" ? assignedTo : void 0;
  const { data: myPerfData } = useQuery({
    queryKey: ["employee.my-performance", "today", selectedEmployeeId ?? "self"],
    queryFn: () => getMyPerfFn({ data: { dateFilter: "today", employeeId: selectedEmployeeId } }),
    refetchInterval: 15e3,
    staleTime: 1e4
  });
  const actionMetrics = myPerfData?.actionResponseMetrics;
  const latestActionAt = actionMetrics?.latestActionAt;
  const latestActionLabel = actionMetrics?.latestActionLabel;
  const latestActionOrderCode = actionMetrics?.latestActionOrderCode;
  const [paymentStatus, setPaymentStatus] = reactExports.useState(savedState?.paymentStatus ?? "all");
  const [actionStatusFilter, setActionStatusFilter] = reactExports.useState(savedState?.actionStatusFilter ?? "all");
  const [stageFilter, setStageFilter] = reactExports.useState(savedState?.stageFilter ?? "all");
  const [dateFrom, setDateFrom] = reactExports.useState(savedState?.dateFrom ?? todayKey);
  const [dateTo, setDateTo] = reactExports.useState(savedState?.dateTo ?? todayKey);
  const [bucket, setBucket] = reactExports.useState(() => {
    if (!isAdmin && savedState?.bucket === "all") return "needs_action";
    return savedState?.bucket ?? (isAdmin ? "all" : "needs_action");
  });
  const [pendingAge, setPendingAge] = reactExports.useState(savedState?.pendingAge ?? "any");
  const [customDays, setCustomDays] = reactExports.useState(savedState?.customDays ?? "");
  const [sortField, setSortField] = reactExports.useState(savedState?.sortField ?? "created_at");
  const [sortOrder, setSortOrder] = reactExports.useState(savedState?.sortOrder ?? "desc");
  const [page, setPage] = reactExports.useState(savedState?.page ?? 1);
  const pageSize = 50;
  const isInitialMount = reactExports.useRef(true);
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
  reactExports.useEffect(() => {
    saveModuleFilterState(storageKey, {
      datePreset,
      fulfillmentStatus,
      serviceId,
      assignedTo,
      paymentStatus,
      actionStatusFilter,
      stageFilter,
      dateFrom,
      dateTo,
      bucket,
      pendingAge,
      customDays,
      sortField,
      sortOrder,
      page
    });
  }, [storageKey, datePreset, fulfillmentStatus, serviceId, assignedTo, paymentStatus, actionStatusFilter, stageFilter, dateFrom, dateTo, bucket, pendingAge, customDays, sortField, sortOrder, page]);
  reactExports.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setPage(1);
  }, [fulfillmentStatus, serviceId, assignedTo, paymentStatus, actionStatusFilter, stageFilter, dateFrom, dateTo, bucket, pendingAge, customDays, sortField, sortOrder]);
  const routerState = useRouterState({ select: (s) => s.location.search ?? {} });
  const routeSearch = routerState ?? {};
  const lastProcessedSearchRef = reactExports.useRef("");
  reactExports.useEffect(() => {
    const searchSerialized = JSON.stringify(routeSearch ?? {});
    if (lastProcessedSearchRef.current === searchSerialized) {
      return;
    }
    lastProcessedSearchRef.current = searchSerialized;
    if (Object.keys(routeSearch ?? {}).length === 0) return;
    if (routeSearch.filter) {
      switch (routeSearch.filter) {
        case "pending":
          setBucket("pending");
          break;
        case "closed":
          setBucket("closed");
          break;
        case "completed":
          setBucket("completed");
          break;
        case "delayed_3d":
          setBucket("pending");
          setPendingAge("3");
          break;
        case "delayed_7d":
          setBucket("pending");
          setPendingAge("7");
          break;
        case "not_contacted":
          setBucket("needs_action");
          break;
        case "not_contacted_5h":
          setBucket("needs_action");
          break;
        case "technical_delay":
          setStageFilter("technical_delay");
          break;
        case "customer_delay":
          setStageFilter("customer_delay");
          break;
        case "form_not_submitted":
          setStageFilter("form_not_submitted");
          break;
      }
    }
    if (routeSearch.preset) {
      if (["today", "yesterday", "7d", "15d", "30d", "mtd", "custom"].includes(routeSearch.preset)) {
        applyDatePreset(routeSearch.preset);
      }
    }
    if (routeSearch.dateFrom) setDateFrom(routeSearch.dateFrom);
    if (routeSearch.dateTo) setDateTo(routeSearch.dateTo);
    if (routeSearch.stage) setStageFilter(routeSearch.stage);
  }, [routeSearch, applyDatePreset]);
  const dateRangeValue = reactExports.useMemo(() => ({
    from: dateFrom ? new Date(dateFrom.includes("T") ? dateFrom : `${dateFrom}T00:00:00+05:30`) : void 0,
    to: dateTo ? new Date(dateTo.includes("T") ? dateTo : `${dateTo}T23:59:59+05:30`) : void 0
  }), [dateFrom, dateTo]);
  const { data: assignStaffData } = useQuery({
    queryKey: ["admin.staff.assignment"],
    queryFn: () => assignStaffFn(),
    staleTime: 30 * 1e3
  });
  const { data: historicalStaffData } = useQuery({
    queryKey: ["admin.staff.historical"],
    queryFn: () => historicalStaffFn(),
    staleTime: 60 * 1e3
  });
  const assignStaffProfiles = reactExports.useMemo(() => {
    return assignStaffData?.profiles ?? [];
  }, [assignStaffData]);
  const { activeStaffList, inactiveStaffList } = reactExports.useMemo(() => {
    const hist = historicalStaffData?.profiles ?? [];
    const liveMap = new Map((assignStaffProfiles ?? []).map((s) => [s.id, s]));
    const active = [];
    const inactive = [];
    for (const h of hist) {
      const live = liveMap.get(h.id);
      const isAct = h.is_active !== false && h.employment_status !== "ARCHIVED" && h.employment_status !== "TERMINATED" && h.employment_status !== "INACTIVE";
      if (isAct) {
        active.push({
          ...h,
          presence_status: live?.presence_status ?? "OFFLINE",
          is_on_leave: live?.is_on_leave ?? false,
          is_eligible: live?.is_eligible ?? true,
          unavailability_reason: live?.unavailability_reason
        });
      } else {
        inactive.push(h);
      }
    }
    for (const s of assignStaffProfiles) {
      if (!active.some((a) => a.id === s.id) && !inactive.some((i) => i.id === s.id)) {
        active.push(s);
      }
    }
    if (role.userId && !active.some((a) => a.id === role.userId)) {
      active.push({
        id: role.userId,
        display_name: role.displayName || "My Profile",
        name: role.displayName || "My Profile"
      });
    }
    active.sort((a, b) => (a.display_name || a.name || "").localeCompare(b.display_name || b.name || ""));
    inactive.sort((a, b) => (a.display_name || a.name || "").localeCompare(b.display_name || b.name || ""));
    return { activeStaffList: active, inactiveStaffList: inactive };
  }, [historicalStaffData, assignStaffProfiles, role.userId, role.displayName]);
  const { data: svcData } = useQuery({
    queryKey: ["admin.services.list"],
    queryFn: () => svcFn(),
    staleTime: 5 * 60 * 1e3
  });
  const groupedServices = reactExports.useMemo(() => {
    const raw = svcData?.rows ?? [];
    const activeOnly = raw.filter((s) => isVisibleService(s));
    const map = /* @__PURE__ */ new Map();
    for (const s of activeOnly) {
      const webId = s.website_id || s.website?.id || "main";
      const webName = s.website?.name || s.website?.domain || "Main Website";
      const domain = s.website?.domain || "";
      if (!map.has(webId)) {
        map.set(webId, { websiteName: webName, domain, services: [] });
      }
      map.get(webId).services.push(s);
    }
    return Array.from(map.entries()).map(([id, group]) => ({
      id,
      ...group
    }));
  }, [svcData]);
  const queryPayload = reactExports.useMemo(() => ({
    page,
    pageSize,
    viewMode: mode,
    fulfillmentStatus: fulfillmentStatus === "all" ? void 0 : fulfillmentStatus,
    serviceId: serviceId === "all" ? void 0 : serviceId,
    assignedTo: assignedTo === "all" ? void 0 : assignedTo,
    paymentStatus: !isAdmin || paymentStatus === "all" ? void 0 : paymentStatus,
    dateFrom: (!isAdmin ? todayKey : dateFrom) || void 0,
    dateTo: (!isAdmin ? todayKey : dateTo) || void 0,
    bucket: !isAdmin && bucket === "all" ? "needs_action" : bucket || (isAdmin ? "all" : "needs_action"),
    stage: stageFilter === "all" ? void 0 : stageFilter,
    actionStatus: actionStatusFilter || "all",
    pendingAge: !isAdmin || pendingAge === "any" ? void 0 : pendingAge,
    customDays: (!isAdmin ? void 0 : customDays) || void 0,
    sortField,
    sortOrder,
    search: routeSearch.search || void 0
  }), [page, pageSize, mode, isAdmin, todayKey, fulfillmentStatus, serviceId, assignedTo, paymentStatus, dateFrom, dateTo, bucket, stageFilter, actionStatusFilter, pendingAge, customDays, sortField, sortOrder, routeSearch.search]);
  const normalizedFilter = reactExports.useMemo(() => normalizeOrdersFilter(queryPayload), [queryPayload]);
  const { data, isLoading, isFetching } = useQuery({
    queryKey: getOrdersQueryKey(normalizedFilter, page),
    queryFn: () => listFn({ data: queryPayload }),
    placeholderData: keepPreviousData,
    // Live updates arrive through realtime subscriptions below; no timed polling.
    staleTime: 3e4,
    refetchOnWindowFocus: true,
    gcTime: 10 * 60 * 1e3
  });
  const rows = data?.rows ?? [];
  const teamBreakdown = data?.teamBreakdown ?? [];
  const total = data?.total ?? 0;
  const counts = data?.counts ?? {
    all: 0,
    needs_action: 0,
    pending: 0,
    completed: 0,
    closed: 0,
    exception: 0,
    actionRequired: 0,
    processed: 0,
    reminders: 0,
    hot_orders: 0,
    technical_delay: 0,
    customer_delay: 0,
    totalAll: 0,
    pending_orders: 0
  };
  const ageBuckets = data?.ageBuckets ?? { d1: 0, d2: 0, d3: 0, d7: 0, older: 0 };
  usePreserveScroll(storageKey, !isLoading);
  const invalidateTimeoutRef = reactExports.useRef(null);
  const scheduleDebouncedInvalidation = reactExports.useCallback(() => {
    if (invalidateTimeoutRef.current) {
      clearTimeout(invalidateTimeoutRef.current);
    }
    invalidateTimeoutRef.current = setTimeout(() => {
      invalidateTimeoutRef.current = null;
      qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
    }, 6e3);
  }, [qc]);
  reactExports.useEffect(() => {
    return () => {
      if (invalidateTimeoutRef.current) {
        clearTimeout(invalidateTimeoutRef.current);
      }
    };
  }, []);
  useRealtimeTable("applications", scheduleDebouncedInvalidation);
  useRealtimeTable("payments", scheduleDebouncedInvalidation);
  useRealtimeTable("order_schedulers", scheduleDebouncedInvalidation);
  useRealtimeTable("order_callback_history", scheduleDebouncedInvalidation);
  useRealtimeTable("assignment_pool", () => {
    qc.invalidateQueries({ queryKey: ["admin.staff.assignment"] });
    scheduleDebouncedInvalidation();
  });
  reactExports.useEffect(() => {
    if (isFetching || !data) return;
    const totalPages = Math.ceil(total / pageSize);
    if (page >= totalPages) return;
    const t = setTimeout(() => {
      const nextPagePayload = { ...queryPayload, page: page + 1 };
      qc.prefetchQuery({
        queryKey: getOrdersQueryKey(normalizedFilter, page + 1),
        queryFn: () => listFn({ data: nextPagePayload }),
        staleTime: 30 * 1e3
      });
    }, 1500);
    return () => clearTimeout(t);
  }, [isFetching, data, page, total, queryPayload, normalizedFilter, qc, listFn, pageSize]);
  const bulkAssignFn = useServerFn(bulkAssignOrders);
  const autoDistributeFn = useServerFn(autoDistributeSelectedOrders);
  const [selectedOrderIds, setSelectedOrderIds] = reactExports.useState([]);
  const [assigningBusy, setAssigningBusy] = reactExports.useState(false);
  async function handleAutoDistribute() {
    if (!selectedOrderIds.length) return;
    setAssigningBusy(true);
    try {
      const res = await autoDistributeFn({
        data: {
          applicationIds: selectedOrderIds,
          reason: "Equally distributed by Admin across active staff"
        }
      });
      if (res.success) {
        toast.success(res.summaryMessage || `Equally distributed ${res.distributedCount} order(s)!`);
        setSelectedOrderIds([]);
        qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
        qc.invalidateQueries({ queryKey: ["admin.assignment.metrics"] });
        qc.invalidateQueries({ queryKey: ["admin.assignment.history"] });
      } else {
        toast.error(res.summaryMessage || "Failed to distribute orders");
      }
    } catch (e) {
      toast.error(e.message || "Failed to auto-distribute orders");
    } finally {
      setAssigningBusy(false);
    }
  }
  async function handleBulkReassign(targetStaffId) {
    if (!selectedOrderIds.length) return;
    if (targetStaffId === "auto_distribute") {
      return handleAutoDistribute();
    }
    setAssigningBusy(true);
    try {
      const assignedTo2 = targetStaffId === "unassign" ? null : targetStaffId;
      await bulkAssignFn({ data: { applicationIds: selectedOrderIds, assignedTo: assignedTo2 } });
      const staffObj = assignStaffProfiles.find((s) => s.id === targetStaffId);
      const name = targetStaffId === "unassign" ? "Unassigned" : staffObj?.display_name || staffObj?.name || staffObj?.email || "staff";
      toast.success(`Successfully reassigned ${selectedOrderIds.length} order(s) to ${name}`);
      setSelectedOrderIds([]);
      qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
      qc.invalidateQueries({ queryKey: ["admin.assignment.metrics"] });
      qc.invalidateQueries({ queryKey: ["admin.assignment.history"] });
    } catch (e) {
      toast.error(e.message || "Failed to reassign orders");
    } finally {
      setAssigningBusy(false);
    }
  }
  const isOtherEmployeeView = !isAdmin && isManager && Boolean(assignedTo && assignedTo !== "all" && assignedTo !== role.userId && !routeSearch.search);
  const showTeamEmployeeOrders = false;
  const colCount = isOtherEmployeeView ? 6 : 6 + (canManageOrders ? 2 : 0) + (hideMoney ? 0 : 1);
  const groups = reactExports.useMemo(() => {
    const g = /* @__PURE__ */ new Map();
    const list = bucket === "needs_action" ? rows.filter((r) => !r.is_hot) : rows;
    for (const r of list) {
      const rawKey = bucket === "completed" ? r.completed_at || r.created_at : bucket === "closed" ? r.closed_at || r.created_at : bucket === "pending" ? r.latest_action_at || r.created_at : r.created_at;
      const key2 = istDateKey(rawKey) || "Unknown";
      const arr = g.get(key2) ?? [];
      arr.push(r);
      g.set(key2, arr);
    }
    return Array.from(g.entries());
  }, [rows, bucket]);
  const hotRows = reactExports.useMemo(() => {
    return bucket === "needs_action" || bucket === "pending_orders" ? rows.filter((r) => r.is_hot) : [];
  }, [rows, bucket]);
  const isFilterActive = fulfillmentStatus !== "all" || serviceId !== "all" || assignedTo !== "all" || isAdmin && paymentStatus !== "all" || actionStatusFilter !== "all" || stageFilter !== "all" || isAdmin && (datePreset !== "today" || dateFrom !== "" && dateFrom !== todayKey || dateTo !== "" && dateTo !== todayKey) || isAdmin && pendingAge !== "any" || bucket !== (isAdmin ? "all" : "needs_action");
  const resetFilters = () => {
    setFulfillmentStatus("all");
    setServiceId("all");
    setAssignedTo("all");
    if (isAdmin) {
      setPaymentStatus("all");
      applyDatePreset("today");
      setPendingAge("any");
      setCustomDays("");
    }
    setActionStatusFilter("all");
    setStageFilter("all");
    setSortField("created_at");
    setSortOrder("desc");
    setBucket(isAdmin ? "all" : "needs_action");
    setPage(1);
  };
  reactExports.useEffect(() => {
    const handleReset = () => resetFilters();
    window.addEventListener("reset-orders-filters", handleReset);
    return () => window.removeEventListener("reset-orders-filters", handleReset);
  }, [isPrivileged]);
  const handleSortToggle = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => prev === "desc" ? "asc" : "desc");
    } else {
      setSortField(field);
      setSortOrder(field === "created_at" ? "desc" : "asc");
    }
  };
  if (!userPerms.isLoading && !userPerms.can("orders", "view")) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center bg-white rounded-xl border border-slate-200 space-y-3 my-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "size-10 text-rose-500 mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-slate-900", children: "Access Denied" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 max-w-md mx-auto", children: "You do not have permission to view the Orders module. Please contact your administrator if you need access." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight text-slate-900", children: isTeam ? "Team Orders" : "Orders" }),
          isFetching && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full animate-pulse", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3 animate-spin text-indigo-600" }),
            " Updating…"
          ] })
        ] }),
        isTeam && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: "Workforce order counts and status breakdown across other employees." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Tabs,
            {
              value: datePreset,
              onValueChange: (v) => applyDatePreset(v),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(TabsList, { className: "h-9", children: RANGE_PRESETS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                TabsTrigger,
                {
                  value: p.value,
                  className: "text-xs px-2.5",
                  children: p.label
                },
                p.value
              )) })
            }
          ),
          datePreset === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            DateRangePicker,
            {
              value: dateRangeValue,
              onChange: (range) => {
                if (!range.from) {
                  setDateFrom("");
                  setDateTo("");
                } else {
                  setDateFrom(istDateKey(range.from));
                  setDateTo(range.to ? istDateKey(range.to) : istDateKey(range.from));
                }
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => {
              qc.invalidateQueries({ queryKey: ["admin.orders.v2"] });
              toast.success("Refreshing orders…");
            },
            className: "h-9 gap-1.5 text-xs text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border-slate-200 shadow-2xs",
            title: "Refresh orders",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `size-3.5 ${isFetching && !isLoading ? "animate-spin text-indigo-600" : "text-slate-500"}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Refresh" })
            ]
          }
        ),
        (!isTeam ? canManageOrders : isAdmin) && isFilterActive && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: resetFilters,
            className: "inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "size-3.5" }),
              " Reset Filters"
            ]
          }
        )
      ] })
    ] }),
    (!isTeam ? canManageOrders : isAdmin) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-slate-200 bg-white p-2.5 sm:p-3 shadow-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-nowrap items-center gap-1.5 sm:gap-2 w-full min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: stageFilter, onValueChange: setStageFilter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 flex-[0.95] min-w-0 px-1.5 sm:px-2 xl:px-2.5 text-xs bg-slate-50/50 border-slate-200 [&_svg]:shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Stages" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "max-h-[300px]", children: STAGE_FILTER_OPTIONS.map((st) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: st.id, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 truncate", children: [
          st.id !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `size-2 shrink-0 rounded-full ${st.tone === "emerald" ? "bg-emerald-500" : st.tone === "amber" ? "bg-amber-500" : st.tone === "indigo" ? "bg-indigo-500" : st.tone === "violet" ? "bg-violet-500" : st.tone === "sky" ? "bg-sky-500" : st.tone === "rose" ? "bg-rose-500" : "bg-slate-400"}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: st.label })
        ] }) }, st.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: actionStatusFilter, onValueChange: setActionStatusFilter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 flex-[1] min-w-0 px-1.5 sm:px-2 xl:px-2.5 text-xs bg-slate-50/50 border-slate-200 [&_svg]:shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Action Status" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Action Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "hot_orders", children: "🔥 Hot Orders (Call Due Now)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "scheduled_callback", children: "⏱ Scheduled Callbacks" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "action_required", children: "Action Required (Red)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "processed", children: "Completed / Action Taken" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: serviceId, onValueChange: setServiceId, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 flex-[1.15] min-w-0 px-1.5 sm:px-2 xl:px-2.5 text-xs bg-slate-50/50 border-slate-200 [&_svg]:shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All services" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "max-h-[380px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", className: "font-bold text-slate-700", children: "All services" }),
          groupedServices.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectGroup, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectLabel, { className: "px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50/80 rounded-md my-1 flex items-center gap-1", children: "Udyam Aadhar Services" }),
            g.services.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.id, className: "pl-3 text-xs", children: s.service_name }, s.id))
          ] }, g.websiteName))
        ] })
      ] }),
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: paymentStatus, onValueChange: setPaymentStatus, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 flex-[0.85] min-w-0 px-1.5 sm:px-2 xl:px-2.5 text-xs bg-slate-50/50 border-slate-200 [&_svg]:shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Payment status" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All payments" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Paid", children: "Paid" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Partially Paid", children: "Partially Paid" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Pending", children: "Pending" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Refunded", children: "Refunded" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Failed", children: "Failed" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: fulfillmentStatus, onValueChange: setFulfillmentStatus, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 flex-[1.15] min-w-0 px-1.5 sm:px-2 xl:px-2.5 text-xs bg-slate-50/50 border-slate-200 [&_svg]:shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Fulfillment stage" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "max-h-[360px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Fulfillment Stages" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectGroup, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectLabel, { className: "text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1", children: "In Progress" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "order_received", children: "Incomplete Form" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "order_reopened", children: "Order Reopened" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "form_submitted", children: "Form Submitted" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "technical_delay", children: "Technical Delay" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "customer_delay", children: "Customer Delay" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "application_submitted", children: "Application Submitted (Govt)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "consultation_completed", children: "Consultation Completed" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectGroup, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectLabel, { className: "text-[10px] font-bold uppercase tracking-wider text-emerald-600 px-2 py-1", children: "Completed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "application_approved", children: "Application Approved" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "order_completed", children: "Order Completed" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectGroup, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectLabel, { className: "text-[10px] font-bold uppercase tracking-wider text-rose-600 px-2 py-1", children: "Closed / Cancelled" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "application_rejected", children: "Application Rejected" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "order_closed", children: "Order Closed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cancelled", children: "Cancelled" })
          ] })
        ] })
      ] }),
      isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("min-w-0 flex items-center gap-1", pendingAge === "custom" ? "flex-[1.05]" : "flex-[0.8]"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: pendingAge, onValueChange: (v) => setPendingAge(v), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 w-full min-w-0 px-1.5 sm:px-2 xl:px-2.5 text-xs bg-slate-50/50 border-slate-200 [&_svg]:shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Pending age" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: PENDING_AGE_OPTIONS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: o.id, children: o.label }, o.id)) })
        ] }),
        pendingAge === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            min: 1,
            value: customDays,
            onChange: (e) => setCustomDays(e.target.value),
            placeholder: "Days",
            className: "h-9 w-12 sm:w-14 shrink-0 px-1.5 text-xs bg-slate-50/50 border-slate-200"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: sortField === "created_at" ? sortOrder === "desc" ? "created_desc" : "created_asc" : sortField === "stage" ? sortOrder === "asc" ? "stage_asc" : "stage_desc" : "stage_journey_asc",
          onValueChange: (v) => {
            if (v === "created_desc") {
              setSortField("created_at");
              setSortOrder("desc");
            } else if (v === "created_asc") {
              setSortField("created_at");
              setSortOrder("asc");
            } else if (v === "stage_asc") {
              setSortField("stage");
              setSortOrder("asc");
            } else if (v === "stage_desc") {
              setSortField("stage");
              setSortOrder("desc");
            } else if (v === "stage_journey_asc") {
              setSortField("stage_journey");
              setSortOrder("asc");
            }
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectTrigger, { className: "h-9 flex-[1.05] min-w-0 px-1.5 sm:px-2 xl:px-2.5 text-xs bg-slate-50/50 border-slate-200 [&_svg]:shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "w-3.5 h-3.5 mr-1 text-slate-500 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Sort order" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "created_desc", children: bucket === "completed" ? "Latest Completed (Newest)" : bucket === "closed" ? "Latest Closed (Newest)" : bucket === "pending" || bucket === "idle_time" ? "Latest Action First (Newest)" : bucket === "customer_delay" || bucket === "technical_delay" ? "Latest Delay First (Newest)" : "Latest First (Newest)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "created_asc", children: bucket === "completed" ? "Older Completed (Oldest)" : bucket === "closed" ? "Older Closed (Oldest)" : bucket === "pending" || bucket === "idle_time" ? "Older Action First (Oldest)" : bucket === "customer_delay" || bucket === "technical_delay" ? "Older Delay First (Oldest)" : "Older First (Oldest)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "stage_asc", children: "Stage (A → Z)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "stage_desc", children: "Stage (Z → A)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "stage_journey_asc", children: "Stage (Journey Order)" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: assignedTo, onValueChange: setAssignedTo, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 flex-[1.05] min-w-0 px-1.5 sm:px-2 xl:px-2.5 text-xs bg-slate-50/50 border-slate-200 [&_svg]:shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: !isAdmin && isManager ? role.displayName || "My Orders" : "All assignees" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "max-h-[380px]", children: [
          isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", className: "font-bold text-slate-800", children: "All assignees" }),
          isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "unassigned", className: "text-slate-600", children: "Unassigned" }),
          activeStaffList.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectGroup, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectLabel, { className: "px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50/80 rounded-md my-1 flex items-center gap-1", children: [
              "🟢 Active Workforce (",
              activeStaffList.length,
              ")"
            ] }),
            activeStaffList.map((s) => {
              const isSelf = s.id === role.userId;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: s.id, className: "pl-3 text-xs", children: [
                s.display_name || s.full_name || s.name || s.email,
                isSelf ? " (You)" : ""
              ] }, s.id);
            })
          ] }),
          isAdmin && inactiveStaffList.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectGroup, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectLabel, { className: "px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50/80 rounded-md my-1 flex items-center gap-1", children: [
              "⚪ Inactive / Exited Staff (",
              inactiveStaffList.length,
              ")"
            ] }),
            inactiveStaffList.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.id, className: "pl-3 text-xs text-slate-600", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-1.5 w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s.display_name || s.name || s.email }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] text-rose-500 font-mono ml-1 uppercase", children: [
                "[",
                s.employment_status || "INACTIVE",
                "]"
              ] })
            ] }) }, s.id))
          ] })
        ] })
      ] })
    ] }) }),
    (isAdmin || !isTeam) && (bucket === "pending" || pendingAge !== "any") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/60 px-3.5 py-2 text-[11px] text-amber-900 shadow-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold uppercase tracking-wider text-[10px] text-amber-700", children: "Pending ageing" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AgeChip, { label: "< 1d", n: ageBuckets.d1 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AgeChip, { label: "1d+", n: ageBuckets.d2 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AgeChip, { label: "2d+", n: ageBuckets.d3 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AgeChip, { label: "3d+", n: ageBuckets.d7 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AgeChip, { label: "7d+", n: ageBuckets.older, tone: "rose" })
    ] }),
    (!isTeam || isAdmin) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
      "grid gap-2 w-full",
      isAdmin ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-12" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-11"
    ), children: (isAdmin ? BUCKET_CARDS : BUCKET_CARDS.filter((b) => !b.adminOnly)).map((b) => {
      const active = bucket === b.id;
      const countVal = Number(counts[b.id] ?? 0);
      const IconComponent = b.icon;
      if (b.id === "idle_time") {
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          OrderIdleTimerKpiCard,
          {
            latestActionAt,
            latestActionLabel,
            latestActionOrderCode,
            isActive: active,
            onClick: () => {
              setBucket("idle_time");
              setPage(1);
            }
          },
          "idle_time"
        );
      }
      let cardContainerCls = "bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50/70";
      let headerCls = "text-slate-500";
      let iconCls = "text-slate-400";
      let countCls = "text-slate-900";
      let subtitleCls = "text-slate-400";
      if (b.id === "needs_action") {
        cardContainerCls = active ? "bg-red-50 border-red-500 text-red-950 shadow-sm ring-2 ring-red-300" : "bg-red-50/40 border-red-200/80 text-red-950 hover:bg-red-50 hover:border-red-300";
        headerCls = "text-red-600 font-bold";
        iconCls = "text-red-500";
        countCls = "text-red-600";
        subtitleCls = "text-red-500/80";
      } else if (b.id === "hot_orders") {
        cardContainerCls = active ? "bg-rose-50 border-rose-400 text-rose-950 shadow-sm ring-2 ring-rose-300" : "bg-rose-50/70 border-rose-200/90 text-rose-950 hover:bg-rose-100/70 hover:border-rose-300";
        headerCls = "text-rose-600 font-bold";
        iconCls = "text-rose-600";
        countCls = "text-rose-700";
        subtitleCls = "text-rose-500/80";
      } else if (b.id === "reminders") {
        cardContainerCls = active ? "bg-indigo-50 border-indigo-400 text-indigo-950 shadow-sm ring-2 ring-indigo-300" : "bg-indigo-50/40 border-indigo-200/90 text-indigo-950 hover:bg-indigo-50/80 hover:border-indigo-300";
        headerCls = "text-indigo-600 font-bold";
        iconCls = "text-indigo-600";
        countCls = "text-indigo-950";
        subtitleCls = "text-indigo-600/70";
      } else if (b.id === "technical_delay") {
        cardContainerCls = active ? "bg-sky-100/80 border-sky-500 text-sky-950 shadow-sm ring-2 ring-sky-300" : "bg-sky-50/60 border-sky-200/90 text-sky-950 hover:bg-sky-100/60 hover:border-sky-300";
        headerCls = "text-sky-700 font-bold";
        iconCls = "text-sky-600";
        countCls = "text-sky-900";
        subtitleCls = "text-sky-600/80";
      } else if (b.id === "backlog") {
        cardContainerCls = active ? "bg-amber-100 border-amber-500 text-amber-950 shadow-sm ring-2 ring-amber-300" : "bg-amber-50/60 border-amber-200/90 text-amber-950 hover:bg-amber-100/60 hover:border-amber-300";
        headerCls = "text-amber-800 font-bold";
        iconCls = "text-amber-700";
        countCls = "text-amber-950";
        subtitleCls = "text-amber-700/80";
      } else if (b.id === "customer_delay") {
        cardContainerCls = active ? "bg-orange-50 border-orange-500 text-orange-950 shadow-sm ring-2 ring-orange-300" : "bg-orange-50/40 border-orange-200/80 text-orange-950 hover:bg-orange-50 hover:border-orange-300";
        headerCls = "text-orange-700 font-bold";
        iconCls = "text-orange-600";
        countCls = "text-orange-950";
        subtitleCls = "text-orange-600/70";
      } else if (b.id === "pending") {
        cardContainerCls = active ? "bg-amber-50 border-amber-500 text-amber-950 shadow-sm ring-2 ring-amber-300" : "bg-amber-50/50 border-amber-200/90 text-amber-950 hover:bg-amber-100/60 hover:border-amber-300";
        headerCls = "text-amber-700 font-bold";
        iconCls = "text-amber-600 animate-[spin_3s_ease-in-out_infinite]";
        countCls = "text-amber-950";
        subtitleCls = "text-amber-600/80";
      } else if (b.id === "completed") {
        cardContainerCls = active ? "bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm ring-2 ring-emerald-300" : "bg-emerald-50/40 border-emerald-200/80 text-emerald-950 hover:bg-emerald-50 hover:border-emerald-300";
        headerCls = "text-emerald-700 font-bold";
        iconCls = "text-emerald-600";
        countCls = "text-emerald-900";
        subtitleCls = "text-emerald-600/80";
      } else if (b.id === "closed") {
        cardContainerCls = active ? "bg-slate-200 border-slate-400 text-slate-900 shadow-sm ring-2 ring-slate-300" : "bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300";
        headerCls = "text-slate-600 font-bold";
        iconCls = "text-slate-500";
        countCls = "text-slate-800";
        subtitleCls = "text-slate-500";
      } else if (b.id === "pending_orders") {
        cardContainerCls = active ? "bg-purple-100 border-purple-500 text-purple-950 shadow-sm ring-2 ring-purple-300" : "bg-purple-50/70 border-purple-200/90 text-purple-950 hover:bg-purple-100/60 hover:border-purple-300";
        headerCls = "text-purple-700 font-bold";
        iconCls = "text-purple-600";
        countCls = "text-purple-950";
        subtitleCls = "text-purple-700/80";
      } else if (active) {
        cardContainerCls = "bg-slate-900 text-white border-slate-900 shadow-sm";
        headerCls = "text-slate-300";
        iconCls = "text-slate-300";
        countCls = "text-white";
        subtitleCls = "text-slate-400";
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => {
            setBucket(b.id);
            setPage(1);
          },
          className: cn(
            "flex flex-col justify-between p-2.5 rounded-xl min-h-[88px] border transition-all duration-150 cursor-pointer select-none text-left group shadow-xs hover:shadow-sm",
            cardContainerCls
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-1 w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 min-w-0", children: [
                b.id === "hot_orders" && countVal > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex h-2 w-2 shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-rose-600" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: cn("text-[10px] font-bold tracking-wider uppercase truncate", headerCls),
                    title: b.label,
                    children: b.shortLabel || b.label
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(IconComponent, { className: cn("w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110", iconCls) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1.5 mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("text-lg sm:text-xl font-black tracking-tight", countCls), children: isPrivacyEnabled ? "•••" : countVal.toLocaleString() }),
              b.id === "pending" && counts.pending_actions_total > countVal ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold px-1.5 py-0.5 rounded leading-none shrink-0 bg-purple-600 text-white shadow-2xs", title: `${counts.pending_actions_total} total manual actions performed across these orders`, children: isPrivacyEnabled ? "••• Actions" : `${counts.pending_actions_total} Actions` }) : b.badge ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("text-[9px] font-bold px-1.5 py-0.5 rounded leading-none shrink-0", b.badge.pillClass), children: b.badge.text }) : null
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: cn("text-[9.5px] font-medium truncate mt-1 leading-tight", subtitleCls),
                title: b.id === "pending" && counts.pending_actions_total > countVal ? `${countVal} unique orders · ${counts.pending_actions_total} total actions performed` : b.subtitle,
                children: isPrivacyEnabled && b.id === "pending" ? "Pending orders" : b.id === "pending" && counts.pending_actions_total > countVal ? `${counts.pending_actions_total} Total Actions` : b.subtitle
              }
            )
          ]
        },
        b.id
      );
    }) }),
    canManageOrders && selectedOrderIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-2 z-30 flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 text-sm font-medium", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-indigo-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full", children: selectedOrderIds.length }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: selectedOrderIds.length === 1 ? "Order Selected" : "Orders Selected" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: handleAutoDistribute,
            disabled: assigningBusy,
            className: "h-8 text-xs font-bold gap-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-xs border border-indigo-400/30 transition-all duration-150 active:scale-95",
            children: [
              assigningBusy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Scale, { className: "size-3.5" }),
              "Equally Distribute"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: (val) => handleBulkReassign(val), disabled: assigningBusy, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectTrigger, { className: "h-8 text-xs bg-slate-800 border-slate-700 text-white w-[190px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "size-3.5 mr-1.5 text-indigo-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: assigningBusy ? "Reassigning…" : "Reassign Staff…" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "auto_distribute", className: "font-semibold text-indigo-600 dark:text-indigo-400", children: "⚖️ Auto-Balance / Equally Distribute" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "unassign", children: "❌ Unassign Order" }),
            activeStaffList.map((s) => {
              const statusTag = s.is_on_leave ? " [🌴 On Leave]" : s.presence_status === "AVAILABLE" ? " [🟢 Online]" : s.presence_status === "IDLE" ? " [🟡 Idle]" : s.presence_status === "AWAY" ? " [🟠 Away]" : " [⚪ Offline]";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: s.id, children: [
                "👤 ",
                s.display_name || s.name || s.email,
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] opacity-75 font-mono ml-1", children: statusTag })
              ] }, s.id);
            })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            variant: "ghost",
            onClick: () => setSelectedOrderIds([]),
            className: "h-8 text-xs text-slate-300 hover:text-white hover:bg-slate-800",
            children: "Clear Selection"
          }
        )
      ] })
    ] }),
    isTeam && /* @__PURE__ */ jsxRuntimeExports.jsx(
      TeamWorkforceBreakdown,
      {
        teamBreakdown,
        isLoading,
        assignedTo,
        onSelectEmployee: (id) => {
          setPage(1);
          setSelectedOrderIds([]);
          setAssignedTo((prev) => prev === id ? "all" : id);
        }
      }
    ),
    (!isTeam || showTeamEmployeeOrders) && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      isTeam && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 px-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-semibold text-slate-700", children: [
          "Orders of",
          " ",
          teamBreakdown.find((m) => m.employeeId === assignedTo)?.name ?? "selected employee"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              setPage(1);
              setSelectedOrderIds([]);
              setAssignedTo("all");
            },
            className: "text-xs font-medium text-indigo-600 hover:underline",
            children: "Show whole team"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollableTable, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm min-w-[950px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-[10px] uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-200", children: [
          canManageOrders && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "w-10 px-3 py-2.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Checkbox,
            {
              checked: rows.length > 0 && selectedOrderIds.length === rows.length,
              onCheckedChange: (checked) => setSelectedOrderIds(checked ? rows.map((r) => r.id) : []),
              "aria-label": "Select all orders"
            }
          ) }),
          !isOtherEmployeeView && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-semibold px-3 py-2.5", children: "Order #" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "th",
            {
              onClick: () => handleSortToggle("created_at"),
              className: "text-left font-semibold px-3 py-2.5 cursor-pointer hover:bg-slate-100/80 transition-colors select-none group",
              title: `Click to toggle sorting by ${bucket === "completed" ? "Completed" : bucket === "closed" ? "Closed" : bucket === "pending" ? "Last Action" : bucket === "customer_delay" || bucket === "technical_delay" ? "Delay" : "Created"} time`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: bucket === "completed" ? "Completed" : bucket === "closed" ? "Closed" : bucket === "pending" ? "Last Action" : bucket === "customer_delay" || bucket === "technical_delay" ? "Delayed" : "Created" }),
                sortField === "created_at" ? sortOrder === "desc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "w-3 h-3 text-indigo-600" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "w-3 h-3 text-indigo-600" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "w-3 h-3 text-slate-300 group-hover:text-slate-500" })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-semibold px-3 py-2.5", children: isOtherEmployeeView ? "Customer Name" : "Customer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-semibold px-3 py-2.5", children: "Service" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-semibold px-3 py-2.5", children: "Action Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "th",
            {
              onClick: () => handleSortToggle("stage"),
              className: "text-left font-semibold px-3 py-2.5 cursor-pointer hover:bg-slate-100/80 transition-colors select-none group",
              title: "Click to toggle sorting by Stage",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Stage" }),
                sortField === "stage" ? sortOrder === "desc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "w-3 h-3 text-indigo-600" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "w-3 h-3 text-indigo-600" }) : sortField === "stage_journey" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "w-3 h-3 text-indigo-600" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "w-3 h-3 text-slate-300 group-hover:text-slate-500" })
              ] })
            }
          ),
          !isOtherEmployeeView && canManageOrders && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left font-semibold px-3 py-2.5", children: "Assigned" }),
          !isOtherEmployeeView && !hideMoney && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right font-semibold px-3 py-2.5", children: "Amount" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: colCount, className: "px-4 py-12 text-center text-slate-500", children: "Loading orders…" }) }),
          !isLoading && rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: colCount, className: "px-4 py-12 text-center text-slate-500", children: "No orders in this view." }) }),
          !isLoading && bucket === "hot_orders" && rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            OrderRow,
            {
              order: r,
              bucket,
              hideMoney,
              isAdmin: canManageOrders,
              isRestricted: isOtherEmployeeView,
              selected: selectedOrderIds.includes(r.id),
              onToggleSelect: (id, checked) => setSelectedOrderIds(
                (prev) => checked ? [...prev, id] : prev.filter((x) => x !== id)
              ),
              onOpen: isOtherEmployeeView ? () => {
              } : (id) => navigate({ to: `/admin/orders/${id}` })
            },
            r.id
          )),
          !isLoading && bucket === "needs_action" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            hotRows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              OrderRow,
              {
                order: r,
                bucket,
                hideMoney,
                isAdmin: canManageOrders,
                isRestricted: isOtherEmployeeView,
                selected: selectedOrderIds.includes(r.id),
                onToggleSelect: (id, checked) => setSelectedOrderIds(
                  (prev) => checked ? [...prev, id] : prev.filter((x) => x !== id)
                ),
                onOpen: isOtherEmployeeView ? () => {
                } : (id) => navigate({ to: `/admin/orders/${id}` })
              },
              r.id
            )),
            groups.map(([day, items]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "bg-slate-900 text-white border-b border-slate-800", children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: colCount, className: "px-3 py-2 text-[11px] font-semibold uppercase tracking-wider", children: formatDayHeader(day) }) }),
              items.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                OrderRow,
                {
                  order: r,
                  bucket,
                  hideMoney,
                  isAdmin: canManageOrders,
                  isRestricted: isOtherEmployeeView,
                  selected: selectedOrderIds.includes(r.id),
                  onToggleSelect: (id, checked) => setSelectedOrderIds(
                    (prev) => checked ? [...prev, id] : prev.filter((x) => x !== id)
                  ),
                  onOpen: isOtherEmployeeView ? () => {
                  } : (id) => navigate({ to: `/admin/orders/${id}` })
                },
                r.id
              ))
            ] }, `g-${day}`))
          ] }),
          !isLoading && bucket !== "hot_orders" && bucket !== "needs_action" && groups.map(([day, items]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "bg-slate-900 text-white border-b border-slate-800", children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: colCount, className: "px-3 py-2 text-[11px] font-semibold uppercase tracking-wider", children: formatDayHeader(day) }) }),
            items.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              OrderRow,
              {
                order: r,
                bucket,
                hideMoney,
                isAdmin: canManageOrders,
                isRestricted: isOtherEmployeeView,
                selected: selectedOrderIds.includes(r.id),
                onToggleSelect: (id, checked) => setSelectedOrderIds(
                  (prev) => checked ? [...prev, id] : prev.filter((x) => x !== id)
                ),
                onOpen: isOtherEmployeeView ? () => {
                } : (id) => navigate({ to: `/admin/orders/${id}` })
              },
              r.id
            ))
          ] }, `g-${day}`))
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "block md:hidden space-y-4", children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-sm text-slate-500 bg-white rounded-xl border border-slate-200", children: "Loading orders…" }),
        !isLoading && rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-sm text-slate-500 bg-white rounded-xl border border-slate-200", children: "No orders match the selected filters." }),
        !isLoading && bucket === "hot_orders" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: rows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          OrderCardMobile,
          {
            order: r,
            bucket,
            hideMoney,
            isAdmin: canManageOrders,
            isRestricted: isOtherEmployeeView,
            selected: selectedOrderIds.includes(r.id),
            onToggleSelect: (id, checked) => setSelectedOrderIds(
              (prev) => checked ? [...prev, id] : prev.filter((x) => x !== id)
            ),
            onOpen: isOtherEmployeeView ? () => {
            } : (id) => navigate({ to: `/admin/orders/${id}` })
          },
          r.id
        )) }),
        !isLoading && bucket === "needs_action" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5", children: [
          hotRows.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            OrderCardMobile,
            {
              order: r,
              bucket,
              hideMoney,
              isAdmin: canManageOrders,
              isRestricted: isOtherEmployeeView,
              selected: selectedOrderIds.includes(r.id),
              onToggleSelect: (id, checked) => setSelectedOrderIds(
                (prev) => checked ? [...prev, id] : prev.filter((x) => x !== id)
              ),
              onOpen: isOtherEmployeeView ? () => {
              } : (id) => navigate({ to: `/admin/orders/${id}` })
            },
            r.id
          )),
          groups.map(([day, items]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 z-10 bg-slate-900 text-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider rounded-lg shadow-xs", children: formatDayHeader(day) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: items.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              OrderCardMobile,
              {
                order: r,
                bucket,
                hideMoney,
                isAdmin: canManageOrders,
                isRestricted: isOtherEmployeeView,
                selected: selectedOrderIds.includes(r.id),
                onToggleSelect: (id, checked) => setSelectedOrderIds(
                  (prev) => checked ? [...prev, id] : prev.filter((x) => x !== id)
                ),
                onOpen: isOtherEmployeeView ? () => {
                } : (id) => navigate({ to: `/admin/orders/${id}` })
              },
              r.id
            )) })
          ] }, `m-g-${day}`))
        ] }),
        !isLoading && bucket !== "hot_orders" && bucket !== "needs_action" && groups.map(([day, items]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 z-10 bg-slate-900 text-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider rounded-lg shadow-xs", children: formatDayHeader(day) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: items.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            OrderCardMobile,
            {
              order: r,
              bucket,
              hideMoney,
              isAdmin: canManageOrders,
              isRestricted: isOtherEmployeeView,
              selected: selectedOrderIds.includes(r.id),
              onToggleSelect: (id, checked) => setSelectedOrderIds(
                (prev) => checked ? [...prev, id] : prev.filter((x) => x !== id)
              ),
              onOpen: isOtherEmployeeView ? () => {
              } : (id) => navigate({ to: `/admin/orders/${id}` })
            },
            r.id
          )) })
        ] }, `m-g-${day}`))
      ] }),
      total > pageSize && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-600 shadow-xs mt-2", children: [
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
          isPrivacyEnabled ? "•••" : total.toLocaleString("en-IN")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setPage((p) => Math.max(1, p - 1)),
              disabled: page <= 1 || isLoading,
              className: "inline-flex items-center gap-1 h-7 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "size-3.5" }),
                " Prev"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setPage((p) => p * pageSize < total ? p + 1 : p),
              disabled: page * pageSize >= total || isLoading,
              className: "inline-flex items-center gap-1 h-7 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium",
              children: [
                "Next ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3.5" })
              ]
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function EmployeeIdleTimerCell({
  latestActionAt,
  label = "Last action"
}) {
  const [elapsedMs, setElapsedMs] = reactExports.useState(
    () => latestActionAt ? Math.max(0, Date.now() - new Date(latestActionAt).getTime()) : 0
  );
  reactExports.useEffect(() => {
    if (!latestActionAt) {
      setElapsedMs(0);
      return;
    }
    const tick = () => {
      setElapsedMs(Math.max(0, Date.now() - new Date(latestActionAt).getTime()));
    };
    tick();
    const interval = setInterval(tick, 1e3);
    return () => clearInterval(interval);
  }, [latestActionAt]);
  const { isPrivacyEnabled } = useDashboardPrivacy();
  if (isPrivacyEnabled) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 font-mono text-[11px]", children: "••m" });
  }
  if (!latestActionAt) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 font-mono text-[11px]", children: "—" });
  }
  const seconds = Math.floor(elapsedMs / 1e3);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const displayTime = hours > 0 ? `${hours}h ${String(minutes % 60).padStart(2, "0")}m` : `${minutes}m ${String(seconds % 60).padStart(2, "0")}s`;
  const isHealthy = minutes < 15;
  const isAttention = minutes >= 15 && minutes < 60;
  const badgeCls = isHealthy ? "bg-emerald-50 text-emerald-700 border-emerald-200" : isAttention ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-rose-50 text-rose-700 border-rose-200";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: cn(
        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border",
        badgeCls
      ),
      title: `${label}: ${new Date(latestActionAt).toLocaleTimeString("en-IN")}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: cn(
              "size-1.5 rounded-full animate-pulse",
              isHealthy ? "bg-emerald-500" : isAttention ? "bg-amber-500" : "bg-rose-500"
            )
          }
        ),
        displayTime
      ]
    }
  );
}
function TeamWorkforceBreakdown({
  teamBreakdown,
  isLoading,
  assignedTo,
  onSelectEmployee
}) {
  const { isPrivacyEnabled } = useDashboardPrivacy();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:block rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-4 text-indigo-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-wider text-slate-700", children: "Workforce Order Counts & Status Overview" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-slate-200 bg-slate-50/70 text-[10px] font-bold text-slate-600 uppercase tracking-wider text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3.5 py-2.5", children: "Employee" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2.5 text-center text-violet-700", children: "Pending Orders" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2.5 text-center text-rose-600", children: "Needs Action" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2.5 text-center text-emerald-700", children: "Last Action" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2.5 text-center text-rose-600", children: "Hot Orders" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2.5 text-center text-amber-700", children: "Backlog" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2.5 text-center text-sky-700", children: "Technical Delay" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2.5 text-center text-indigo-700", children: "Callback Scheduled" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2.5 text-center text-amber-800", children: "Customer Delay" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2.5 text-center text-amber-600", children: "Action Taken" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2.5 text-center text-emerald-600", children: "Completed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2.5 text-center text-slate-600", children: "Closed" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-slate-100", children: [
          isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: 12, className: "px-4 py-12 text-center text-slate-500", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-5 animate-spin mx-auto mb-2 text-indigo-600" }),
            "Loading workforce counts…"
          ] }) }),
          !isLoading && teamBreakdown.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 12, className: "px-4 py-12 text-center text-slate-500", children: "No active employees found in this view." }) }),
          !isLoading && teamBreakdown.map((member) => {
            const pendingCount = member.pendingOrders ?? member.needsAction + member.callbackScheduled + member.technicalDelay;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: cn(
                  "hover:bg-slate-50/80 transition-colors",
                  assignedTo === member.employeeId && "bg-indigo-50/70 hover:bg-indigo-50"
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3.5 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-slate-800 whitespace-nowrap", children: member.name }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full font-bold text-xs",
                        pendingCount > 0 ? "bg-violet-100 text-violet-800 border border-violet-200" : "text-slate-400"
                      ),
                      children: isPrivacyEnabled ? "•••" : pendingCount
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full font-bold text-xs",
                        member.needsAction > 0 ? "bg-rose-100 text-rose-700" : "text-slate-400"
                      ),
                      children: isPrivacyEnabled ? "•••" : member.needsAction
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmployeeIdleTimerCell, { latestActionAt: member.latestActionAt }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full font-bold text-xs",
                        member.hotOrders > 0 ? "bg-rose-50 text-rose-700 border border-rose-200" : "text-slate-400"
                      ),
                      children: isPrivacyEnabled ? "•••" : member.hotOrders
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full font-bold text-xs",
                        member.backlog > 0 ? "bg-amber-100 text-amber-800" : "text-slate-400"
                      ),
                      children: isPrivacyEnabled ? "•••" : member.backlog
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: cn(
                        "inline-flex items-center px-1.5 py-0.5 rounded-md font-semibold text-xs",
                        member.technicalDelay > 0 ? "bg-sky-50 text-sky-700 border border-sky-200" : "text-slate-400"
                      ),
                      children: isPrivacyEnabled ? "•••" : member.technicalDelay
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: cn(
                        "inline-flex items-center px-1.5 py-0.5 rounded-md font-semibold text-xs",
                        member.callbackScheduled > 0 ? "bg-indigo-50 text-indigo-700 border border-indigo-200" : "text-slate-400"
                      ),
                      children: isPrivacyEnabled ? "•••" : member.callbackScheduled
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: cn(
                        "inline-flex items-center px-1.5 py-0.5 rounded-md font-semibold text-xs",
                        member.customerDelay > 0 ? "bg-amber-50 text-amber-800 border border-amber-200" : "text-slate-400"
                      ),
                      children: isPrivacyEnabled ? "•••" : member.customerDelay
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2.5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: cn(
                        "inline-flex items-center px-1.5 py-0.5 rounded-md font-semibold text-xs",
                        member.actionTaken > 0 ? "bg-amber-50 text-amber-700 font-bold" : "text-slate-400"
                      ),
                      children: isPrivacyEnabled ? "•••" : member.actionTaken
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2.5 text-center font-bold text-emerald-600", children: isPrivacyEnabled ? "•••" : member.completed }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2.5 text-center font-semibold text-slate-600", children: isPrivacyEnabled ? "•••" : member.closed })
                ]
              },
              member.employeeId
            );
          })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "block md:hidden space-y-3", children: [
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center text-sm text-slate-500 bg-white rounded-xl border border-slate-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-5 animate-spin mx-auto mb-2 text-indigo-600" }),
        "Loading workforce counts…"
      ] }),
      !isLoading && teamBreakdown.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-sm text-slate-500 bg-white rounded-xl border border-slate-200", children: "No active employees found in this view." }),
      !isLoading && teamBreakdown.map((member) => {
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: cn(
              "p-3.5 rounded-xl border bg-white space-y-2.5 shadow-2xs",
              assignedTo === member.employeeId ? "border-indigo-400 ring-1 ring-indigo-300" : "border-slate-200"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-slate-800 truncate", children: member.name }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 flex flex-col items-end gap-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmployeeIdleTimerCell, { latestActionAt: member.latestActionAt }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-6 gap-1 text-center text-xs pt-1.5 border-t border-slate-100", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-violet-50/70 p-1.5 rounded-lg border border-violet-200/60", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-violet-700 font-bold", children: "Pending" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-violet-800", children: isPrivacyEnabled ? "•••" : member.pendingOrders ?? member.needsAction + member.callbackScheduled + member.technicalDelay })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-rose-50/70 p-1.5 rounded-lg", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-rose-600 font-medium", children: "Needs Action" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-rose-700", children: isPrivacyEnabled ? "•••" : member.needsAction })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-rose-50/70 p-1.5 rounded-lg", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-rose-600 font-medium", children: "Hot" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-rose-700", children: isPrivacyEnabled ? "•••" : member.hotOrders })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-amber-50/70 p-1.5 rounded-lg", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-amber-700 font-medium", children: "Backlog" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-amber-800", children: isPrivacyEnabled ? "•••" : member.backlog })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-sky-50/70 p-1.5 rounded-lg", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-sky-700 font-medium", children: "Tech Delay" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sky-800", children: isPrivacyEnabled ? "•••" : member.technicalDelay })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-indigo-50/70 p-1.5 rounded-lg", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-indigo-700 font-medium", children: "Callback" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-indigo-800", children: isPrivacyEnabled ? "•••" : member.callbackScheduled })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-5 gap-1 text-center text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-amber-50/70 p-1.5 rounded-lg", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-amber-700 font-medium", children: "Cust Delay" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-amber-800", children: isPrivacyEnabled ? "•••" : member.customerDelay })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-amber-50/70 p-1.5 rounded-lg", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-amber-700 font-medium", children: "Action Taken" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-amber-800", children: isPrivacyEnabled ? "•••" : member.actionTaken })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-emerald-50/70 p-1.5 rounded-lg", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-emerald-700 font-medium", children: "Completed" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-emerald-800", children: isPrivacyEnabled ? "•••" : member.completed })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-50 p-1.5 rounded-lg", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-slate-600 font-medium", children: "Closed" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-slate-700", children: isPrivacyEnabled ? "•••" : member.closed })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-100 p-1.5 rounded-lg", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-slate-700 font-medium", children: "Total" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-slate-900", children: isPrivacyEnabled ? "•••" : member.total })
                ] })
              ] })
            ]
          },
          member.employeeId
        );
      })
    ] })
  ] });
}
function OrderActionHistoryBadge({ order }) {
  const history = order.action_history ?? [];
  const count = order.action_count ?? history.length;
  if (!count || count <= 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-no-row-click": true,
        onClick: (e) => e.stopPropagation(),
        className: cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors shadow-2xs cursor-pointer select-none shrink-0",
          count > 1 ? "bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100 hover:border-purple-400" : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
        ),
        title: `Click to view timeline of ${count} manual action${count === 1 ? "" : "s"} taken on this order`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "size-2.5 text-purple-600 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: count > 1 ? `${count} Actions` : "1 Action" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      PopoverContent,
      {
        "data-no-row-click": true,
        onClick: (e) => e.stopPropagation(),
        align: "start",
        className: "w-80 p-3 bg-white border border-slate-200 shadow-xl rounded-xl space-y-2.5 z-50 text-left",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-slate-100 pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-slate-900 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "size-3.5 text-purple-600" }),
              "Action Activity Timeline (",
              count,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-slate-400 font-semibold", children: order.application_code })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-60 overflow-y-auto space-y-2.5 pr-1 divide-y divide-slate-100", children: history.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 py-2", children: "Manual action recorded on order." }) : history.map((act, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 first:pt-0 space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[11px] gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-800", children: act.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-slate-400 shrink-0", children: [
                formatIST(act.created_at, { dateOnly: true }),
                " ",
                formatIST(act.created_at, { timeOnly: true })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-purple-700 font-medium", children: [
              "By ",
              act.staff_name || "Staff"
            ] }),
            act.note && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-100", children: act.note })
          ] }, act.id || idx)) })
        ]
      }
    )
  ] });
}
function renderCustomerName(customerName, isRestricted) {
  if (!customerName || !customerName.trim()) return "—";
  const trimmed = customerName.trim();
  if (!isRestricted) return trimmed;
  const firstSpaceIdx = trimmed.indexOf(" ");
  if (firstSpaceIdx === -1) {
    return trimmed;
  }
  const firstName = trimmed.slice(0, firstSpaceIdx);
  const secondName = trimmed.slice(firstSpaceIdx + 1).trim();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: firstName }),
    secondName ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "blur-[4px] select-none pointer-events-none opacity-60 inline-block ml-1", children: secondName }) : null
  ] });
}
function OrderCardMobile({
  order,
  bucket,
  hideMoney,
  isAdmin,
  isRestricted,
  selected,
  onToggleSelect,
  onOpen
}) {
  const stage = order.stage;
  const meta = STAGE_META[stage];
  const actionStatus = getOrderActionStatus(order);
  const { formatINR } = useFinancialVisibility();
  const { isPrivacyEnabled } = useDashboardPrivacy();
  const isCompletedView = bucket === "completed";
  const isClosedView = bucket === "closed";
  const dateToShow = isCompletedView ? order.completed_at || order.created_at : isClosedView ? order.closed_at || order.created_at : bucket === "pending" ? order.latest_action_at || order.created_at : order.created_at;
  const stageToneMap = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    blue: "bg-sky-50 text-sky-700 border-sky-200",
    sky: "bg-sky-50 text-sky-700 border-sky-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200"
  };
  const stageTone = stageToneMap[meta?.tone ?? "emerald"] ?? "bg-emerald-50 text-emerald-700 border-emerald-200";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      onClick: (e) => {
        if (isRestricted) return;
        if (e.target.closest("input,a,button,select,textarea,label,[data-no-row-click]")) return;
        onOpen(order.id);
      },
      className: `p-3.5 bg-white rounded-xl border shadow-xs transition-all space-y-2.5 ${isRestricted ? "cursor-default" : "active:bg-slate-50 cursor-pointer"} ${order.is_hot && !isRestricted ? "border-l-4 border-l-rose-500 bg-rose-50/25 border-rose-200" : selected ? "border-indigo-500 bg-indigo-50/40" : "border-slate-200 hover:border-slate-300"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-no-row-click": true, onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Checkbox,
              {
                checked: !!selected,
                onCheckedChange: (v) => onToggleSelect?.(order.id, !!v)
              }
            ) }),
            !isRestricted && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-bold text-slate-900", children: order.application_code }),
              order.ticket_source && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 text-[9px] font-bold", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LifeBuoy, { className: "size-2.5 text-purple-600" }),
                order.ticket_source.ticketNumber ? `Ticket #${order.ticket_source.ticketNumber}` : "From Ticket"
              ] }),
              order.is_hot && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded bg-rose-600 px-1.5 py-0.5 text-[9px] font-black uppercase text-white shadow-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-2.5" }),
                  " HOT ORDER NOW"
                ] }),
                order.hot_started_at && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200",
                    title: `Time since order became HOT / escalated: ${formatOrderAge(Date.now() - new Date(order.hot_started_at).getTime())}`,
                    children: formatOrderAge(Date.now() - new Date(order.hot_started_at).getTime())
                  }
                )
              ] }),
              !isCompletedView && !isClosedView && !order.is_terminal && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200",
                  title: `Time since order created: ${formatOrderAge(Date.now() - new Date(order.created_at).getTime())}`,
                  children: formatOrderAge(Date.now() - new Date(order.created_at).getTime())
                }
              )
            ] })
          ] }),
          !isRestricted && !hideMoney && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-900 text-sm", children: isPrivacyEnabled ? "₹••••" : formatINR(order.total_amount) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-slate-900", children: renderCustomerName(order.customer_name, isRestricted) }),
            !isRestricted && order.customer_mobile && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1.5 text-slate-500", children: [
              "(",
              order.customer_mobile,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-slate-400", children: [
            formatIST(dateToShow, { dateOnly: true }),
            " ",
            formatIST(dateToShow, { timeOnly: true }),
            " IST"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-700 font-medium", children: order.service_name ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
            order.is_hot ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300", children: order.fulfillment_status === "technical_delay" || order.callback_reminder?.remarks?.channel === "technical_delay" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { className: "size-3 text-rose-600" }),
              "Tech Delay Due"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneCall, { className: "size-3 text-rose-600" }),
              "Call Due Now"
            ] }) }) : order.is_callback_scheduled ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200", children: order.fulfillment_status === "technical_delay" || order.callback_reminder?.remarks?.channel === "technical_delay" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { className: "size-3 text-indigo-600" }),
              "Tech Delay Scheduled"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneForwarded, { className: "size-3 text-indigo-600" }),
              "Scheduled Callback"
            ] }) }) : actionStatus.tone === "red" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-1.5 rounded-full bg-rose-600 animate-pulse" }),
              actionStatus.label
            ] }) : actionStatus.tone === "green" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-1.5 rounded-full bg-emerald-500" }),
              actionStatus.label
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-sky-50 text-sky-700 border border-sky-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-1.5 rounded-full bg-sky-500" }),
              actionStatus.label
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${stageTone}`, children: meta?.label ?? stage }),
            !isRestricted && /* @__PURE__ */ jsxRuntimeExports.jsx(OrderActionHistoryBadge, { order })
          ] }),
          !isRestricted && isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-slate-500 font-medium", children: order.assigned_name ? `Assigned: ${order.assigned_name}` : "Unassigned" })
        ] })
      ]
    }
  );
}
function formatOrderAge(ms) {
  if (!Number.isFinite(ms) || ms < 0) return "just now";
  const s = Math.floor(ms / 1e3);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
function formatDayHeader(dayKey) {
  if (!dayKey || dayKey === "Unknown") return "UNKNOWN DATE";
  const todayKey = istDateKey(/* @__PURE__ */ new Date());
  const yestKey = istDateKey(new Date(Date.now() - 864e5));
  const d = new Date(dayKey.includes("T") ? dayKey : `${dayKey}T00:00:00+05:30`);
  const base = d.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
  if (dayKey === todayKey) return `${base} · TODAY`;
  if (dayKey === yestKey) return `${base} · YESTERDAY`;
  return base;
}
function getOrderActionStatus(order) {
  const fs = order.fulfillment_status ?? "order_received";
  const stage = order.stage;
  const greenStatuses = /* @__PURE__ */ new Set([
    "application_approved",
    "consultation_completed",
    "order_completed",
    "completed"
  ]);
  if (greenStatuses.has(fs) || stage === "completed" || Boolean(order.in_range_completed)) {
    return { label: "Order Completed", tone: "green" };
  }
  const closedStatuses = /* @__PURE__ */ new Set([
    "order_closed",
    "cancelled",
    "closed"
  ]);
  if (closedStatuses.has(fs) || stage === "closed" || Boolean(order.in_range_closed)) {
    return { label: "Order Closed", tone: "red" };
  }
  const isTechDelay = order.fulfillment_status === "technical_delay" || order.callback_reminder?.remarks?.channel === "technical_delay";
  if (order.is_hot && !order.in_range_action_taken && !(order.action_count && order.action_count > 0)) {
    return { label: isTechDelay ? "Tech Delay Due" : "Call Due Now", tone: "red" };
  }
  if (order.is_callback_scheduled) {
    return { label: isTechDelay ? "Tech Delay Scheduled" : "Scheduled Callback", tone: "blue" };
  }
  const blueStatuses = /* @__PURE__ */ new Set([
    "government_processing",
    "technical_delay",
    "customer_delay",
    "application_rejected",
    "certificate_rejected",
    "under_processing",
    "application_submitted",
    "verification_pending",
    "documents_received",
    "waiting_for_customer_submission",
    "awaiting_customer_form",
    "form_link_sent",
    "form_pending"
  ]);
  const blueStages = /* @__PURE__ */ new Set([
    "technical_delay",
    "customer_delay",
    "consultation_completed",
    "under_review",
    "in_progress",
    "submitted_to_govt",
    "under_processing",
    "certificate_ready",
    "refunded",
    "refund_requested"
  ]);
  if (Boolean(order.in_range_action_taken) || Boolean(order.action_count && order.action_count > 0) || blueStatuses.has(fs) || blueStages.has(stage) || Boolean(order.form_link_sent_at)) {
    return { label: "Action Taken", tone: "blue" };
  }
  return { label: "Action Required", tone: "red" };
}
function OrderRow({
  order,
  bucket,
  hideMoney,
  isAdmin,
  isRestricted,
  selected,
  onToggleSelect,
  onOpen
}) {
  const stage = order.stage;
  const meta = STAGE_META[stage];
  const { formatINR } = useFinancialVisibility();
  const { isPrivacyEnabled } = useDashboardPrivacy();
  const isCompletedView = bucket === "completed";
  const isClosedView = bucket === "closed";
  const isPendingActionView = bucket === "pending";
  const isCustomerDelayView = bucket === "customer_delay";
  const isTechnicalDelayView = bucket === "technical_delay";
  const dateToShow = isCompletedView ? order.completed_at || order.created_at : isClosedView ? order.closed_at || order.created_at : isPendingActionView ? order.latest_action_at || order.created_at : isCustomerDelayView ? order.customer_hold_started_at || order.latest_action_at || order.created_at : isTechnicalDelayView ? order.technical_hold_started_at || order.latest_action_at || order.created_at : order.created_at;
  const stageToneMap = {
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
    slate: "bg-slate-100 text-slate-700",
    blue: "bg-sky-50 text-sky-700",
    sky: "bg-sky-50 text-sky-700",
    indigo: "bg-indigo-50 text-indigo-700",
    violet: "bg-violet-50 text-violet-700"
  };
  const stageTone = stageToneMap[meta?.tone ?? "emerald"] ?? "bg-emerald-50 text-emerald-700";
  const actionStatus = getOrderActionStatus(order);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "tr",
    {
      className: `border-t border-slate-100 ${isRestricted ? "" : "hover:bg-slate-50/60 cursor-pointer"} ${order.is_hot && !isRestricted ? "border-l-4 border-l-rose-500 bg-rose-50/30 hover:bg-rose-50/50" : selected ? "bg-indigo-50/40" : ""}`,
      onClick: (e) => {
        if (isRestricted) return;
        if (e.target.closest("input,a,button,select,textarea,label,[data-no-row-click]")) return;
        const sel = typeof window !== "undefined" ? window.getSelection?.() : null;
        if (sel && sel.toString().trim().length > 0) return;
        onOpen(order.id);
      },
      children: [
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "w-10 px-3 py-2.5 text-center", "data-no-row-click": true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Checkbox,
          {
            checked: !!selected,
            onCheckedChange: (v) => onToggleSelect?.(order.id, !!v),
            "aria-label": `Select order ${order.application_code}`
          }
        ) }),
        !isRestricted && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2.5 font-mono text-[12px] whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-slate-900", children: order.application_code }),
            order.ticket_source && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 text-[9px] font-bold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LifeBuoy, { className: "size-2.5 text-purple-600" }),
              order.ticket_source.ticketNumber ? `Ticket #${order.ticket_source.ticketNumber}` : "From Ticket"
            ] })
          ] }),
          order.is_hot && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded bg-rose-600 px-1.5 py-0.5 text-[9px] font-black uppercase text-white shadow-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "size-2.5" }),
              " HOT ORDER NOW"
            ] }),
            order.hot_started_at && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200",
                title: `Time since order became HOT / escalated: ${formatOrderAge(Date.now() - new Date(order.hot_started_at).getTime())}`,
                children: formatOrderAge(Date.now() - new Date(order.hot_started_at).getTime())
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2.5 text-[11px] text-slate-600 whitespace-nowrap leading-tight", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: formatIST(dateToShow, { dateOnly: true }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-slate-400", children: [
              formatIST(dateToShow, { timeOnly: true }),
              " IST"
            ] })
          ] }),
          !isRestricted && !isCompletedView && !isClosedView && !order.is_terminal && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200",
              title: `Time since order created: ${formatOrderAge(Date.now() - new Date(order.created_at).getTime())}`,
              children: formatOrderAge(Date.now() - new Date(order.created_at).getTime())
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-2 py-2.5 min-w-[160px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-slate-900 leading-tight text-[13px]", children: renderCustomerName(order.customer_name, isRestricted) }),
          !isRestricted && order.customer_mobile && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-slate-500 mt-0.5", children: formatMobile55(order.customer_mobile) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2.5 text-slate-700 whitespace-nowrap text-[13px]", children: order.service_name ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2.5 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
          order.is_hot ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs", children: order.fulfillment_status === "technical_delay" || order.callback_reminder?.remarks?.channel === "technical_delay" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { className: "size-3 text-rose-600" }),
            "Tech Delay Due"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneCall, { className: "size-3 text-rose-600" }),
            "Call Due Now"
          ] }) }) : order.is_callback_scheduled ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200", children: order.fulfillment_status === "technical_delay" || order.callback_reminder?.remarks?.channel === "technical_delay" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { className: "size-3 text-indigo-600" }),
            "Tech Delay Scheduled"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneForwarded, { className: "size-3 text-indigo-600" }),
            "Scheduled Callback"
          ] }) }) : actionStatus.tone === "red" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-1.5 rounded-full bg-rose-600 animate-pulse" }),
            actionStatus.label
          ] }) : actionStatus.tone === "green" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-1.5 rounded-full bg-emerald-500" }),
            actionStatus.label
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-sky-50 text-sky-700 border border-sky-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-1.5 rounded-full bg-sky-500" }),
            actionStatus.label
          ] }),
          !isRestricted && /* @__PURE__ */ jsxRuntimeExports.jsx(OrderActionHistoryBadge, { order })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2.5 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${stageTone}`, children: meta?.label ?? stage }),
          !isRestricted && isPendingRow(order) && (() => {
            const d = daysSince(order.created_at);
            if (d < 1) return null;
            const tone = d >= 7 ? "bg-rose-50 text-rose-700 border-rose-200" : d >= 3 ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-slate-100 text-slate-600 border-slate-200";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                title: `Pending for ${d} day${d === 1 ? "" : "s"} (since order created)`,
                className: `inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${tone}`,
                children: [
                  d,
                  "d"
                ]
              }
            );
          })()
        ] }) }),
        !isRestricted && isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2.5 text-slate-600 whitespace-nowrap text-[12px]", children: order.assigned_name ?? "Unassigned" }),
        !isRestricted && !hideMoney && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2.5 text-right font-semibold text-slate-900 whitespace-nowrap text-[13px]", children: isPrivacyEnabled ? "₹••••" : formatINR(order.total_amount) })
      ]
    }
  );
}
function ScrollableTable({ children }) {
  const topRef = reactExports.useRef(null);
  const bottomRef = reactExports.useRef(null);
  const [width, setWidth] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const el = bottomRef.current;
    if (!el) return;
    const measure = () => {
      const t = el.querySelector("table");
      setWidth(t ? t.scrollWidth : 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (el.querySelector("table")) ro.observe(el.querySelector("table"));
    return () => ro.disconnect();
  }, [children]);
  const syncTop = () => {
    if (topRef.current && bottomRef.current) bottomRef.current.scrollLeft = topRef.current.scrollLeft;
  };
  const syncBottom = () => {
    if (topRef.current && bottomRef.current) topRef.current.scrollLeft = bottomRef.current.scrollLeft;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref: topRef,
        onScroll: syncTop,
        className: "overflow-x-auto overflow-y-hidden border-b border-slate-200 bg-slate-50/60",
        style: { height: 12 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width, height: 1 } })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: bottomRef, onScroll: syncBottom, className: "overflow-x-auto", children })
  ] });
}
function AgeChip({ label, n, tone = "amber" }) {
  const { isPrivacyEnabled } = useDashboardPrivacy();
  const cls = tone === "rose" ? "bg-rose-100 text-rose-800 border-rose-200" : "bg-white text-amber-900 border-amber-200";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-medium ${cls}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider opacity-70", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: isPrivacyEnabled ? "•••" : n })
  ] });
}
const Textarea = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { ref, className: cn(labelVariants(), className), ...props }));
Label.displayName = Root.displayName;
const $$splitComponentImporter$c = () => import("./admin.orders._orderId-C0WaHNH4.mjs");
const Route$O = createFileRoute()({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./admin.services.index-XNHlYK16.mjs");
const Route$N = createFileRoute()({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./admin.services._serviceCode-ChtoC_f9.mjs");
const Route$M = createFileRoute()({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./admin.submissions._submissionId-DnMXKeGv.mjs");
const Route$L = createFileRoute()({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./admin.support.tickets-BFsOu0JM.mjs");
const Route$K = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Support Tickets — BHS CRM"
    }, {
      name: "description",
      content: "Customer support ticket operations."
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const Route$J = createFileRoute()({
  beforeLoad: () => {
    throw redirect({ to: "/admin/support/tickets" });
  }
});
const Route$I = createFileRoute()({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/admin/support/tickets/$ticketId",
      params: { ticketId: params.ticketId }
    });
  }
});
const $$splitComponentImporter$7 = () => import("./admin.website-content._websiteId-CZglm0Ej.mjs");
const Route$H = createFileRoute()({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const FALLBACK_INTERNAL_EMAIL$2 = "help@businesshelpservices.com";
const ComplaintSchema = object({
  name: string().trim().min(2).max(120),
  email: string().trim().toLowerCase().email().max(160),
  mobile: string().trim().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile"),
  state: string().trim().optional().default("Not Provided"),
  language: string().trim().optional().default("English"),
  application_ref: string().trim().max(80).optional().default(""),
  message: string().trim().min(10).max(2e3)
});
function genComplaintNumber() {
  const d = /* @__PURE__ */ new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `CMP-${y}${m}-${rand}`;
}
const Route$G = createFileRoute()({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      }),
      POST: async ({ request }) => {
        const cors2 = {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        };
        let parsed;
        try {
          parsed = ComplaintSchema.parse(await request.json());
        } catch (e) {
          return new Response(
            JSON.stringify({ ok: false, error: e instanceof Error ? e.message : "Invalid input" }),
            { status: 400, headers: cors2 }
          );
        }
        const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
        const { resolveWebsiteIdFromRequest } = await import("./default-website.server-BIcPmBN6.mjs");
        const websiteId = await resolveWebsiteIdFromRequest(request);
        const since = new Date(Date.now() - 6e4).toISOString();
        const { data: recent } = await supabaseAdmin.from("leads").select("id").eq("email", parsed.email).eq("lead_source", "complaint_form").gte("created_at", since).limit(1).maybeSingle();
        let leadId;
        if (recent?.id) {
          leadId = recent.id;
        } else {
          const { data: lead, error: leadErr } = await supabaseAdmin.from("leads").insert({
            name: parsed.name,
            email: parsed.email,
            mobile: parsed.mobile,
            state: parsed.state || "Not Provided",
            language: parsed.language || "English",
            service: "Complaint",
            lead_source: "complaint_form",
            status: "lead_created",
            notes: parsed.message,
            total_amount: 0,
            gst_amount: 0,
            base_amount: 0,
            website_id: websiteId
          }).select("id").single();
          if (leadErr || !lead) {
            return new Response(
              JSON.stringify({ ok: false, error: "Could not save complaint. Please try again." }),
              { status: 500, headers: cors2 }
            );
          }
          leadId = lead.id;
        }
        const complaintNumber = genComplaintNumber();
        const submittedAt = (/* @__PURE__ */ new Date()).toISOString();
        const noteText = parsed.application_ref ? `Ref: ${parsed.application_ref}

${parsed.message}` : parsed.message;
        const { data: complaint, error: cErr } = await supabaseAdmin.from("complaints").insert({
          lead_id: leadId,
          complaint_number: complaintNumber,
          notes: noteText,
          description: parsed.message,
          status: "pending",
          submitted_at: submittedAt
        }).select("id, complaint_number").single();
        if (cErr || !complaint) {
          return new Response(
            JSON.stringify({ ok: false, error: "Could not save complaint. Please try again." }),
            { status: 500, headers: cors2 }
          );
        }
        await supabaseAdmin.from("activity_logs").insert({
          lead_id: leadId,
          activity_type: "complaint_submitted",
          activity_description: `Complaint ${complaint.complaint_number} submitted by ${parsed.name}`,
          metadata: { source: "complaint_form", complaint_id: complaint.id }
        });
        const adminTo = process.env.INTERNAL_NOTIFICATION_EMAIL || FALLBACK_INTERNAL_EMAIL$2;
        const origin = new URL(request.url).origin;
        try {
          const { enqueueFromTemplateInternal } = await import("./emails.server-BTJhg2a3.mjs");
          await enqueueFromTemplateInternal("complaint_admin_notification", adminTo, {
            complaint_number: complaint.complaint_number,
            customer_name: parsed.name,
            name: parsed.name,
            customer_email: parsed.email,
            email: parsed.email,
            customer_mobile: parsed.mobile,
            mobile: parsed.mobile,
            application_ref: parsed.application_ref || "—",
            message: parsed.message,
            admin_url: `${origin}/admin/complaints`
          }, {
            leadId
          });
        } catch {
        }
        return new Response(
          JSON.stringify({ ok: true, complaintNumber: complaint.complaint_number, submittedAt }),
          { status: 200, headers: cors2 }
        );
      }
    }
  }
});
const FALLBACK_INTERNAL_EMAIL$1 = "help@businesshelpservices.com";
const ContactSchema = object({
  name: string().trim().min(2).max(120),
  email: string().trim().toLowerCase().email().max(160),
  mobile: string().trim().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile"),
  state: string().trim().refine((v) => INDIAN_STATES.includes(v), "Invalid state"),
  language: string().trim().refine((v) => LANGUAGES.includes(v), "Invalid language"),
  message: string().trim().min(5).max(1e3)
});
const Route$F = createFileRoute()({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      }),
      POST: async ({ request }) => {
        const cors2 = {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        };
        let parsed;
        try {
          const body = await request.json();
          parsed = ContactSchema.parse(body);
        } catch (e) {
          return new Response(
            JSON.stringify({ ok: false, error: e instanceof Error ? e.message : "Invalid input" }),
            { status: 400, headers: cors2 }
          );
        }
        const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
        const { resolveWebsiteIdFromRequest } = await import("./default-website.server-BIcPmBN6.mjs");
        const websiteId = await resolveWebsiteIdFromRequest(request);
        const since = new Date(Date.now() - 6e4).toISOString();
        const { data: recent } = await supabaseAdmin.from("leads").select("id").eq("email", parsed.email).eq("lead_source", "contact_form").gte("created_at", since).limit(1).maybeSingle();
        let leadId;
        const submittedAt = (/* @__PURE__ */ new Date()).toISOString();
        if (recent?.id) {
          leadId = recent.id;
        } else {
          const { data: lead, error: leadErr } = await supabaseAdmin.from("leads").insert({
            name: parsed.name,
            email: parsed.email,
            mobile: parsed.mobile,
            state: parsed.state,
            language: parsed.language,
            service: "Contact Enquiry",
            lead_source: "contact_form",
            status: "lead_created",
            notes: parsed.message,
            total_amount: 0,
            gst_amount: 0,
            base_amount: 0,
            website_id: websiteId
          }).select("id").single();
          if (leadErr || !lead) {
            return new Response(
              JSON.stringify({ ok: false, error: "Could not save your enquiry. Please try again." }),
              { status: 500, headers: cors2 }
            );
          }
          leadId = lead.id;
          await supabaseAdmin.from("activity_logs").insert({
            lead_id: leadId,
            activity_type: "lead_created",
            activity_description: `Contact form submitted by ${parsed.name}`,
            metadata: { source: "contact_form" }
          });
        }
        const adminTo = process.env.INTERNAL_NOTIFICATION_EMAIL || FALLBACK_INTERNAL_EMAIL$1;
        try {
          const { enqueueFromTemplateInternal } = await import("./emails.server-BTJhg2a3.mjs");
          const commonVars = {
            name: parsed.name,
            customer_name: parsed.name,
            email: parsed.email,
            customer_email: parsed.email,
            mobile: parsed.mobile,
            customer_mobile: parsed.mobile,
            lead_code: "",
            order_number: "",
            message: parsed.message
          };
          await Promise.all([
            enqueueFromTemplateInternal("contact_acknowledgement", parsed.email, commonVars, {
              toName: parsed.name,
              leadId
            }),
            (async () => {
              await enqueueFromTemplateInternal("admin_new_lead", adminTo, commonVars, {
                leadId
              });
            })()
          ]);
        } catch {
        }
        return new Response(
          JSON.stringify({ ok: true, leadId, submittedAt }),
          { status: 200, headers: cors2 }
        );
      }
    }
  }
});
const FALLBACK_INTERNAL_EMAIL = "help@businesshelpservices.com";
const BASE = 99;
const GST = +(BASE * 0.18).toFixed(2);
const TOTAL = +(BASE + GST).toFixed(2);
const Schema$5 = object({
  name: string().trim().min(2).max(120),
  email: string().trim().toLowerCase().email().max(160),
  mobile: string().trim().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile"),
  state: string().trim().refine((v) => INDIAN_STATES.includes(v), "Invalid state"),
  language: string().trim().refine((v) => LANGUAGES.includes(v), "Invalid language"),
  problem: string().trim().min(10).max(2e3)
});
const Route$E = createFileRoute()({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      }),
      POST: async ({ request }) => {
        const cors2 = {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        };
        let parsed;
        try {
          parsed = Schema$5.parse(await request.json());
        } catch (e) {
          return new Response(
            JSON.stringify({ ok: false, error: e instanceof Error ? e.message : "Invalid input" }),
            { status: 400, headers: cors2 }
          );
        }
        const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
        const { resolveWebsiteIdFromRequest } = await import("./default-website.server-BIcPmBN6.mjs");
        const websiteId = await resolveWebsiteIdFromRequest(request);
        let leadId;
        let leadCode;
        {
          const { data: lead, error } = await supabaseAdmin.from("leads").insert({
            name: parsed.name,
            email: parsed.email,
            mobile: parsed.mobile,
            state: parsed.state,
            language: parsed.language,
            service: "Expert Consultation",
            lead_source: "talk_to_expert",
            status: "lead_created",
            notes: parsed.problem,
            base_amount: BASE,
            gst_amount: GST,
            total_amount: TOTAL,
            website_id: websiteId
          }).select("id, lead_code").single();
          if (error || !lead) {
            return new Response(
              JSON.stringify({ ok: false, error: "Could not save your request. Please try again." }),
              { status: 500, headers: cors2 }
            );
          }
          leadId = lead.id;
          leadCode = lead.lead_code ?? null;
          try {
            const { autoAssignLeadOrOrder } = await import("./auto-assign.server-D-MYRWKz.mjs");
            await autoAssignLeadOrOrder({ leadId });
          } catch (assignErr) {
            console.error("[talk-to-expert] Auto-assign error:", assignErr);
          }
          await supabaseAdmin.from("activity_logs").insert({
            lead_id: leadId,
            activity_type: "lead_created",
            activity_description: `Talk-to-Expert request from ${parsed.name}`,
            metadata: { source: "talk_to_expert", problem: parsed.problem }
          });
        }
        const adminTo = process.env.INTERNAL_NOTIFICATION_EMAIL || FALLBACK_INTERNAL_EMAIL;
        const origin = new URL(request.url).origin;
        try {
          const { enqueueFromTemplateInternal } = await import("./emails.server-BTJhg2a3.mjs");
          const vars = {
            name: parsed.name,
            customer_name: parsed.name,
            email: parsed.email,
            customer_email: parsed.email,
            mobile: parsed.mobile,
            customer_mobile: parsed.mobile,
            problem: parsed.problem,
            lead_id: leadId,
            lead_code: leadCode ?? "",
            service_name: "Talk to Expert Consultation",
            total_amount: TOTAL,
            admin_url: `${origin}/admin/leads/${leadId}`
          };
          await enqueueFromTemplateInternal("talk_to_expert_request_admin", adminTo, vars, {
            leadId
          });
          await enqueueFromTemplateInternal("talk_to_expert_request_customer", parsed.email, vars, {
            toName: parsed.name,
            leadId
          }).catch(() => void 0);
        } catch {
        }
        const { issueCustomerToken } = await import("./customer-access.server-C_oBiISE.mjs");
        const accessToken = await issueCustomerToken(leadId, "co", { reason: "talk_to_expert" });
        return new Response(
          JSON.stringify({ ok: true, leadCode, accessToken, totalAmount: TOTAL }),
          { status: 200, headers: cors2 }
        );
      }
    }
  }
});
const $$splitComponentImporter$6 = () => import("./apply._leadCode.summary-D8WCcpMv.mjs");
const Route$D = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Your Application Is Ready — Business Help Services"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }, {
      name: "referrer",
      content: "no-referrer"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
function parseSuppressionPayload(body) {
  const parsed = JSON.parse(body);
  if (!parsed.data) {
    throw new Error("Missing data field in payload");
  }
  const data = parsed.data;
  if (!data.email || !data.reason) {
    throw new Error("Missing required fields: email, reason");
  }
  return data;
}
function mapReasonToStatus(reason) {
  switch (reason) {
    case "bounce":
      return "bounced";
    case "complaint":
      return "complained";
    default:
      return "suppressed";
  }
}
function mapReasonToMessage(reason) {
  switch (reason) {
    case "bounce":
      return "Permanent bounce — email address is invalid or rejected";
    case "complaint":
      return "Spam complaint — recipient marked email as spam";
    case "unsubscribe":
      return "Recipient unsubscribed";
    default:
      return "Email suppressed";
  }
}
const Route$C = createFileRoute()({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.LOVABLE_API_KEY;
        const supabaseUrl = "https://epqxycwzreezbleqlgob.supabase.co";
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!apiKey || !supabaseUrl || !supabaseServiceKey) {
          console.error("Missing required environment variables");
          return Response.json({ error: "Server configuration error" }, { status: 500 });
        }
        let payload;
        try {
          const verified = await verifyWebhookRequest({
            req: request,
            secret: apiKey,
            parser: parseSuppressionPayload
          });
          payload = verified.payload;
        } catch (error) {
          if (error instanceof WebhookError) {
            switch (error.code) {
              case "invalid_signature":
                console.error("Invalid webhook signature");
                return Response.json({ error: "Invalid signature" }, { status: 401 });
              case "stale_timestamp":
                console.error("Stale webhook timestamp");
                return Response.json({ error: "Stale timestamp" }, { status: 401 });
              case "invalid_payload":
              case "invalid_json":
                console.error("Invalid payload", { code: error.code });
                return Response.json({ error: "Invalid payload" }, { status: 400 });
              default:
                console.error("Webhook verification failed", {
                  code: error.code,
                  message: error.message
                });
                return Response.json({ error: "Verification failed" }, { status: 401 });
            }
          }
          console.error("Unexpected error during verification", { error });
          return Response.json({ error: "Internal error" }, { status: 500 });
        }
        const supabase2 = createClient(supabaseUrl, supabaseServiceKey);
        const normalizedEmail = payload.email.toLowerCase();
        const { error: suppressError } = await supabase2.from("suppressed_emails").upsert(
          {
            email: normalizedEmail,
            reason: payload.reason,
            metadata: payload.metadata ?? null
          },
          { onConflict: "email" }
        );
        if (suppressError) {
          console.error("Failed to upsert suppressed email", {
            error: suppressError,
            email_redacted: normalizedEmail[0] + "***@" + normalizedEmail.split("@")[1]
          });
          return Response.json({ error: "Failed to write suppression" }, { status: 500 });
        }
        const sendLogStatus = mapReasonToStatus(payload.reason);
        const sendLogMessage = mapReasonToMessage(payload.reason);
        const { error: insertError } = await supabase2.from("email_send_log").insert({
          message_id: payload.message_id ?? null,
          template_name: "system",
          recipient_email: normalizedEmail,
          status: sendLogStatus,
          error_message: sendLogMessage,
          metadata: payload.metadata ?? null
        });
        if (insertError) {
          console.warn("Failed to insert email_send_log", {
            error: insertError
          });
        }
        console.log("Suppression processed", {
          email_redacted: normalizedEmail[0] + "***@" + normalizedEmail.split("@")[1],
          reason: payload.reason,
          is_retry: payload.is_retry,
          retry_count: payload.retry_count,
          has_message_id: !!payload.message_id
        });
        return Response.json({ success: true });
      }
    }
  }
});
const $$splitComponentImporter$5 = () => import("./onboarding._leadCode.index-CXKxgR7W.mjs");
const Route$B = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Complete your application — Business Help Services"
    }, {
      name: "description",
      content: "Complete your Business Help Services application details and activities."
    }, {
      property: "og:title",
      content: "Complete your application — Business Help Services"
    }, {
      property: "og:description",
      content: "Complete your Business Help Services application details and activities."
    }, {
      property: "og:type",
      content: "website"
    }, {
      name: "twitter:card",
      content: "summary"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }, {
      name: "referrer",
      content: "no-referrer"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./onboarding._leadCode.documents-D9a0Y2fW.mjs");
const Route$A = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Upload documents — Business Help Services"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }, {
      name: "referrer",
      content: "no-referrer"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./onboarding._leadCode.done-Du2KMg8D.mjs");
const Route$z = createFileRoute()({
  validateSearch: (s) => object({
    help: number().optional()
  }).parse(s),
  head: () => ({
    meta: [{
      title: "Form Submitted Successfully — Business Help Services"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }, {
      name: "referrer",
      content: "no-referrer"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./admin.services.forms._serviceCode-Df5-E-5y.mjs");
const Route$y = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Service Form Builder — Business Help Services"
    }, {
      name: "description",
      content: "Configure service application questions and document requirements."
    }, {
      property: "og:title",
      content: "Service Form Builder — Business Help Services"
    }, {
      property: "og:description",
      content: "Configure service application questions and document requirements."
    }, {
      property: "og:type",
      content: "website"
    }, {
      name: "twitter:card",
      content: "summary"
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./admin.support.tickets.index-BLwr9Qtf.mjs");
const Route$x = createFileRoute()({
  validateSearch: (search) => ({
    bucket: typeof search.bucket === "string" ? search.bucket : void 0,
    status: typeof search.status === "string" ? search.status : void 0,
    responseState: typeof search.responseState === "string" ? search.responseState : void 0,
    priority: typeof search.priority === "string" ? search.priority : void 0,
    assignedTo: typeof search.assignedTo === "string" ? search.assignedTo : void 0,
    serviceId: typeof search.serviceId === "string" ? search.serviceId : void 0,
    stage: typeof search.stage === "string" ? search.stage : void 0,
    search: typeof search.search === "string" ? search.search : void 0,
    dateFrom: typeof search.dateFrom === "string" ? search.dateFrom : void 0,
    dateTo: typeof search.dateTo === "string" ? search.dateTo : void 0,
    preset: typeof search.preset === "string" ? search.preset : void 0,
    isStarred: typeof search.isStarred === "boolean" ? search.isStarred : search.isStarred === "true" ? true : void 0,
    folderId: typeof search.folderId === "string" ? search.folderId : void 0
  }),
  head: () => ({
    meta: [{
      title: "Support Tickets Operations — BHS CRM"
    }, {
      name: "description",
      content: "Dense operational support ticket management."
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./admin.support.tickets._ticketId-CbLSTXN6.mjs");
const Route$w = createFileRoute()({
  head: ({
    params
  }) => ({
    meta: [{
      title: `Ticket ${params.ticketId.slice(0, 8)} — BHS CRM`
    }, {
      name: "description",
      content: "Support ticket workspace."
    }, {
      name: "robots",
      content: "noindex,nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const Route$v = createFileRoute()({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.CRON_SECRET;
        const header = request.headers.get("authorization") || "";
        const apikey = request.headers.get("apikey") || "";
        const token = header.startsWith("Bearer ") ? header.slice(7) : apikey;
        if (!secret || token !== secret) {
          return new Response("Unauthorized", { status: 401 });
        }
        const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
        const { data: rows, error } = await supabaseAdmin.from("invoices").select("id, payment_id, invoice_number").not("payment_id", "is", null).order("issued_at", { ascending: true });
        if (error) return new Response(error.message, { status: 500 });
        const invoicesMod = await import("./invoices.functions-CoU4f0R2.mjs");
        const generateAndStore = invoicesMod.__regenerateForMaintenance ?? invoicesMod.generateAndStore;
        const actor = { id: null, label: "maintenance-bulk-regenerate" };
        let regenerated = 0;
        const failed = [];
        for (const r of rows ?? []) {
          try {
            await generateAndStore(r.payment_id, actor);
            regenerated++;
          } catch (e) {
            failed.push({
              id: r.id,
              invoice_number: r.invoice_number ?? null,
              error: e instanceof Error ? e.message : String(e)
            });
          }
        }
        return Response.json({
          ok: true,
          total: (rows ?? []).length,
          regenerated,
          failed_count: failed.length,
          failed
        });
      }
    }
  }
});
const BUCKET$1 = "documents";
const Route$u = createFileRoute()({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const splat = String(params._splat || "").trim();
        if (!splat || splat.includes("..")) {
          return new Response("Not found", { status: 404 });
        }
        const name = splat.startsWith("audio/") ? splat.slice(6) : splat;
        if (!/^[A-Za-z0-9._-]{1,120}\.(mp3|wav|ogg|m4a|aac)$/.test(name) || name.startsWith(".")) {
          return new Response("Not found", { status: 404 });
        }
        const path = `audio/${name}`;
        try {
          const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
          const { data, error } = await supabaseAdmin.storage.from(BUCKET$1).download(path);
          if (error || !data) {
            const { data: signed } = await supabaseAdmin.storage.from(BUCKET$1).createSignedUrl(path, 60 * 60);
            if (signed?.signedUrl) {
              return new Response(null, {
                status: 302,
                headers: {
                  Location: signed.signedUrl,
                  "Cache-Control": "public, max-age=3600"
                }
              });
            }
            return new Response("Audio file not found", { status: 404 });
          }
          let contentType = "audio/mpeg";
          if (path.endsWith(".wav")) contentType = "audio/wav";
          else if (path.endsWith(".ogg")) contentType = "audio/ogg";
          else if (path.endsWith(".m4a")) contentType = "audio/mp4";
          else if (path.endsWith(".aac")) contentType = "audio/aac";
          return new Response(data, {
            status: 200,
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=86400, immutable",
              "Accept-Ranges": "bytes"
            }
          });
        } catch (err) {
          console.error("[AudioRoute] error serving audio:", err);
          return new Response("Internal server error", { status: 500 });
        }
      }
    }
  }
});
const MAX_REMINDERS_PER_COMPLAINT = 3;
const Route$t = createFileRoute()({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apikey = request.headers.get("apikey");
        const expected = process.env.CRON_SECRET;
        if (!apikey || !expected || apikey !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }
        const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
        const { enqueueFromTemplateInternal } = await import("./emails.server-BTJhg2a3.mjs");
        const now = (/* @__PURE__ */ new Date()).toISOString();
        const { data: breaching } = await supabaseAdmin.from("complaints").select("id, complaint_number, lead_id, severity, category, sla_due_at").lt("sla_due_at", now).is("breached_at", null).not("status", "in", "(resolved,closed)").limit(200);
        const breachedIds = (breaching ?? []).map((c) => c.id);
        if (breachedIds.length) {
          await supabaseAdmin.from("complaints").update({ breached_at: now }).in("id", breachedIds);
        }
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1e3).toISOString();
        const { data: openBreached } = await supabaseAdmin.from("complaints").select("id, complaint_number, lead_id, severity, category, sla_due_at, last_reminded_at, reminder_count").not("breached_at", "is", null).not("status", "in", "(resolved,closed)").lt("reminder_count", MAX_REMINDERS_PER_COMPLAINT).or(`last_reminded_at.is.null,last_reminded_at.lt.${dayAgo}`).limit(100);
        let queued = 0;
        let skippedDisabled = 0;
        for (const c of openBreached ?? []) {
          const { data: lead } = await supabaseAdmin.from("leads").select("email, name").eq("id", c.lead_id).single();
          if (!lead?.email) continue;
          try {
            const result = await enqueueFromTemplateInternal(
              "complaint_sla_breach",
              lead.email,
              {
                customerName: lead.name ?? "Customer",
                complaintNumber: c.complaint_number ?? c.id.slice(0, 8),
                severity: (c.severity ?? "normal").toString().toUpperCase()
              },
              { toName: lead.name ?? void 0, leadId: c.lead_id }
            );
            if (!result) {
              skippedDisabled += 1;
              continue;
            }
          } catch {
            continue;
          }
          await supabaseAdmin.from("complaints").update({ last_reminded_at: now, reminder_count: (c.reminder_count ?? 0) + 1 }).eq("id", c.id);
          queued += 1;
        }
        return Response.json({
          ok: true,
          newly_breached: breachedIds.length,
          alerts_queued: queued,
          skipped_template_disabled: skippedDisabled
        });
      }
    }
  }
});
const Route$s = createFileRoute()({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = request.headers.get("apikey");
        const expected = process.env.CRON_SECRET;
        if (!apiKey || !expected || apiKey !== expected) {
          return new Response(JSON.stringify({ error: "unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
          });
        }
        try {
          const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
          const now = /* @__PURE__ */ new Date();
          const dayAgo = new Date(now.getTime() - 24 * 3600 * 1e3);
          const { data: orders } = await supabaseAdmin.from("applications").select("id, assigned_to, order_status, updated_at, created_at, application_code").not("assigned_to", "is", null).in("order_status", [
            "NEW_ORDER",
            "OUR_SIDE_DELAY",
            "HIGH_PRIORITY",
            "CUSTOMER_HOLD",
            "WAITING_CUSTOMER_INFO",
            "COMPLETED",
            "CERTIFICATE_ISSUED"
          ]).gte("updated_at", dayAgo.toISOString()).limit(2e3);
          const buckets = /* @__PURE__ */ new Map();
          for (const r of orders || []) {
            const b = buckets.get(r.assigned_to) || { open: 0, completed: 0, onOurSide: 0 };
            if (r.order_status === "COMPLETED" || r.order_status === "CERTIFICATE_ISSUED") {
              b.completed++;
            } else {
              b.open++;
              if (r.order_status === "OUR_SIDE_DELAY" || r.order_status === "HIGH_PRIORITY") {
                b.onOurSide++;
              }
            }
            buckets.set(r.assigned_to, b);
          }
          const rows = [];
          for (const [userId, b] of buckets.entries()) {
            rows.push({
              user_id: userId,
              kind: "daily_digest",
              title: `Daily digest — ${b.open} open, ${b.completed} completed (24h)`,
              body: `You have ${b.onOurSide} orders pending on our side. ${b.completed} completed in the last 24 hours.`,
              href: `/admin/orders`,
              entity_kind: "digest"
            });
          }
          if (rows.length > 0) {
            await supabaseAdmin.from("notifications").insert(rows);
          }
          return new Response(JSON.stringify({ ok: true, sent: rows.length }), {
            headers: { "Content-Type": "application/json" }
          });
        } catch (e) {
          console.error("[daily-digest] failed", e);
          return new Response(
            JSON.stringify({ ok: false, error: e.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      }
    }
  }
});
const APP_ORIGIN$3 = process.env.APP_BASE_URL || "https://everythinghappensqindiaserver4cored.lovable.app";
const MAX_REMINDERS = 3;
const MIN_GAP_HOURS = 24;
const Route$r = createFileRoute()({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apikey = request.headers.get("apikey");
        const expected = process.env.CRON_SECRET;
        if (!apikey || !expected || apikey !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }
        const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
        const { enqueueFromTemplateInternal } = await import("./emails.server-BTJhg2a3.mjs");
        const cutoff = new Date(Date.now() - MIN_GAP_HOURS * 36e5).toISOString();
        const { data: leads, error } = await supabaseAdmin.from("leads").select("id, lead_code, name, email, service, onboarding_reminder_count, onboarding_reminded_at").eq("status", "payment_successful").lt("onboarding_reminder_count", MAX_REMINDERS).or(`onboarding_reminded_at.is.null,onboarding_reminded_at.lte.${cutoff}`).limit(100);
        if (error) {
          return Response.json({ ok: false, error: error.message }, { status: 500 });
        }
        let enqueued = 0;
        let skipped = 0;
        for (const lead of leads ?? []) {
          const { data: sub } = await supabaseAdmin.from("onboarding_submissions").select("status").eq("lead_id", lead.id).maybeSingle();
          if (sub?.status === "submitted") {
            skipped++;
            continue;
          }
          if (!lead.email || !lead.lead_code) {
            skipped++;
            continue;
          }
          try {
            await enqueueFromTemplateInternal(
              "onboarding_reminder",
              lead.email,
              {
                name: lead.name ?? "",
                lead_code: lead.lead_code,
                service: lead.service ?? "",
                onboarding_url: `${APP_ORIGIN$3}/onboarding/${encodeURIComponent(lead.lead_code)}`
              },
              { toName: lead.name ?? void 0, leadId: lead.id }
            );
            await supabaseAdmin.from("leads").update({
              onboarding_reminded_at: (/* @__PURE__ */ new Date()).toISOString(),
              onboarding_reminder_count: (lead.onboarding_reminder_count ?? 0) + 1
            }).eq("id", lead.id);
            enqueued++;
          } catch (e) {
            console.error("[onboarding-reminders] enqueue failed", { leadId: lead.id, e });
          }
        }
        return Response.json({ ok: true, candidates: leads?.length ?? 0, enqueued, skipped });
      }
    }
  }
});
const Route$q = createFileRoute()({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.CRON_SECRET;
        const auth = request.headers.get("authorization") ?? "";
        const apikey = request.headers.get("apikey") ?? "";
        if (!secret || auth !== `Bearer ${secret}` && apikey !== secret) {
          return new Response("Unauthorized", { status: 401 });
        }
        try {
          const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
          const { verifyPayUPayment } = await import("./payu.server-3jw08lkR.mjs");
          const { finalizePaidPayment } = await import("./finalize-paid.server-CnNMG_m8.mjs");
          const cutOff = new Date(Date.now() - 1 * 6e4).toISOString();
          const lookback = new Date(Date.now() - 30 * 24 * 36e5).toISOString();
          const { data: candidates } = await supabaseAdmin.from("payments").select("id, transaction_id, razorpay_order_id, status").eq("gateway_name", "payu").in("status", ["created", "attempted"]).lt("created_at", cutOff).gt("created_at", lookback).limit(100);
          const results = [];
          for (const p of candidates ?? []) {
            const txnid = p.transaction_id || p.razorpay_order_id;
            if (!txnid) continue;
            try {
              const verified = await verifyPayUPayment(txnid);
              const status = String(verified?.status ?? "").trim().toLowerCase();
              const unmapped = String(verified?.unmappedstatus ?? "").trim().toLowerCase();
              const success = status === "success" || unmapped === "captured";
              const failure = status === "failure" || status === "failed" || ["bounced", "dropped", "failed", "usercancelled"].includes(unmapped);
              if (success) {
                await supabaseAdmin.from("payments").update({
                  status: "paid",
                  payment_date: (/* @__PURE__ */ new Date()).toISOString(),
                  webhook_received_at: (/* @__PURE__ */ new Date()).toISOString(),
                  razorpay_payment_id: verified?.mihpayid ? String(verified.mihpayid) : null,
                  payu_mihpayid: verified?.mihpayid ? String(verified.mihpayid) : null,
                  payu_bank_ref_num: verified?.bank_ref_num ? String(verified.bank_ref_num) : null,
                  raw_response: { verified_payment: verified, source: "cron-reconcile" }
                }).eq("id", p.id);
                const r = await finalizePaidPayment(p.id, {
                  source: "cron",
                  txnid,
                  mihpayid: verified?.mihpayid ? String(verified.mihpayid) : null
                });
                results.push({ id: p.id, status: "paid", applicationId: r.applicationId });
              } else if (failure) {
                await supabaseAdmin.from("payments").update({
                  status: "failed",
                  raw_response: { verified_payment: verified, source: "cron-reconcile" }
                }).eq("id", p.id);
                await supabaseAdmin.from("leads").update({ status: "payment_pending", lead_status_v2: "payment_failed" }).eq("id", (await supabaseAdmin.from("payments").select("lead_id").eq("id", p.id).single()).data?.lead_id ?? "");
                results.push({ id: p.id, status: "failed" });
              } else {
                results.push({ id: p.id, status: "still_pending", gatewayStatus: status || unmapped });
              }
            } catch (e) {
              console.error("[payu-reconcile] verify failed", { id: p.id, txnid, error: e });
              results.push({ id: p.id, error: e instanceof Error ? e.message : String(e) });
            }
          }
          return Response.json({ ok: true, scanned: candidates?.length ?? 0, results });
        } catch (err) {
          console.error("[payu-reconcile] failed", err);
          return Response.json({ ok: false, error: String(err) }, { status: 500 });
        }
      },
      GET: async () => Response.json({ ok: true, hint: "POST to run" })
    }
  }
});
const Route$p = createFileRoute()({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apikey = request.headers.get("apikey") || request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
        const expected = process.env.CRON_SECRET;
        if (!apikey || !expected || apikey !== expected) {
          return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
          });
        }
        try {
          const { pollZohoInbox } = await import("./inbox-matcher.server-90b1dcqx.mjs");
          const result = await pollZohoInbox({ limit: 50 });
          if (result.errors > 0) {
            return new Response(JSON.stringify({ ok: false, ...result }), {
              status: 500,
              headers: { "Content-Type": "application/json" }
            });
          }
          return Response.json({ ok: true, ...result });
        } catch (e) {
          const message = e instanceof Error ? e.message : "unknown";
          console.error("[cron:poll-zoho-inbox] failed", message);
          return new Response(JSON.stringify({ ok: false, error: message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    }
  }
});
const Route$o = createFileRoute()({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apikey = request.headers.get("apikey");
        const expected = process.env.CRON_SECRET;
        if (!apikey || !expected || apikey !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }
        try {
          const { processQueueInternal } = await import("./emails.server-BTJhg2a3.mjs");
          const result = await processQueueInternal(50);
          return Response.json({ ok: true, ...result });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "unknown";
          return Response.json({ ok: false, error: msg }, { status: 500 });
        }
      }
    }
  }
});
const Route$n = createFileRoute()({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apikey = request.headers.get("apikey") || request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
        const expected = process.env.CRON_SECRET;
        if (!apikey || !expected || apikey !== expected) {
          return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
          });
        }
        try {
          const { fireDueSchedulers } = await import("./schedulers.server-BPR-45Y2.mjs");
          const result = await fireDueSchedulers();
          return Response.json({ ok: true, ...result });
        } catch (e) {
          const message = e instanceof Error ? e.message : "unknown";
          console.error("[cron:schedulers-tick] failed", message);
          return new Response(JSON.stringify({ ok: false, error: message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    }
  }
});
const Route$m = createFileRoute()({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apikey = request.headers.get("apikey");
        const expected = process.env.CRON_SECRET;
        if (!apikey || !expected || apikey !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }
        try {
          const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
          const { enqueueFromTemplateInternal } = await import("./emails.server-BTJhg2a3.mjs");
          const { SUPPORT_EMAIL, COMPANY_NAME } = await import("./brand-DLB0j9eh.mjs");
          const nowIso = (/* @__PURE__ */ new Date()).toISOString();
          const { data: due, error } = await supabaseAdmin.from("workflow_reminders").select("*").eq("status", "pending").lte("due_at", nowIso).order("due_at", { ascending: true }).limit(50);
          if (error) throw new Error(error.message);
          let processed = 0;
          let sent = 0;
          const NEXT_KIND = {
            followup_3d: null,
            followup_5d: null,
            followup_7d: null,
            custom: null,
            pending_closure_followup: null,
            internal_review: null
          };
          for (const r of due ?? []) {
            processed++;
            try {
              const isAutoClose = r.kind === "pending_closure_followup";
              if (isAutoClose) {
                const { autoCloseOverdueOrder } = await import("./auto-close.server-DpoJMDPx.mjs");
                const result = await autoCloseOverdueOrder(r.application_id, "customer_delay");
                if (!result.ok && result.skipped !== "resolved") {
                  throw new Error(`Customer-delay close failed: ${result.skipped}`);
                }
                await supabaseAdmin.from("workflow_reminders").update({ status: "sent", sent_at: nowIso, error: null }).eq("id", r.id);
                if (result.ok && result.emailQueued) sent++;
                continue;
              }
              await supabaseAdmin.from("workflow_reminders").update({ status: "sent", sent_at: nowIso }).eq("id", r.id);
              const { data: app } = await supabaseAdmin.from("applications").select("id, lead_id, application_code, workflow_status, order_status, fulfillment_status").eq("id", r.application_id).maybeSingle();
              if (!app) continue;
              const skipWorkflow = ["processing_resumed", "completed", "closed", "cancelled", "refund_closed"].includes(app.workflow_status);
              const skipOrder = ["CLOSED", "COMPLETED", "REFUND_PROCESSED"].includes(app.order_status);
              const skipFulfillment = ["order_closed", "order_completed", "cancelled"].includes(app.fulfillment_status);
              if (skipWorkflow || skipOrder || skipFulfillment) {
                continue;
              }
              const { data: lead } = await supabaseAdmin.from("leads").select("name, email, service").eq("id", app.lead_id).maybeSingle();
              const effectiveTemplate = r.template_code;
              if (effectiveTemplate && lead?.email) {
                const payload = r.payload ?? {};
                const allowedTemplates = /* @__PURE__ */ new Set([
                  "order_confirmation",
                  "welcome_and_form_link",
                  "bhs_e003_customer_delay",
                  "bhs_e004_our_side_delay",
                  "order_closure_confirmation",
                  "order_completed",
                  "talk_to_expert_completed",
                  "support_ticket_reply",
                  "support_ticket_closed",
                  "support_ticket_closed_final",
                  "refund_processed_confirmation",
                  "bhs_e012_submitted_to_govt",
                  "E010"
                ]);
                if (allowedTemplates.has(String(effectiveTemplate))) {
                  await enqueueFromTemplateInternal(
                    effectiveTemplate,
                    lead.email,
                    {
                      customer_name: lead.name ?? "Customer",
                      customerName: lead.name ?? "Customer",
                      customer_email: lead.email ?? "",
                      order_id: app.application_code ?? "",
                      order_number: app.application_code ?? "",
                      orderNumber: app.application_code ?? "",
                      service_name: lead.service ?? "",
                      reason: payload.reason ?? "Customer delay unresolved within the 8-hour window",
                      reason_block: payload.reason_block ?? payload.reason ?? "Customer delay unresolved within the 8-hour window",
                      closure_reason: payload.closure_reason ?? payload.reason ?? "Customer delay unresolved within the 8-hour window",
                      employee_remarks: payload.employee_remarks ?? payload.customer_note ?? payload.internal_note ?? "—",
                      closure_date: (/* @__PURE__ */ new Date()).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }),
                      date: (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN"),
                      company_name: COMPANY_NAME,
                      support_email: SUPPORT_EMAIL,
                      fromName: process.env.ZOHO_FROM_NAME || "Udyam Support"
                    },
                    { toName: lead.name ?? void 0, leadId: app.lead_id ?? void 0, applicationId: app.id }
                  );
                  sent++;
                  await supabaseAdmin.from("workflow_events").insert({
                    application_id: app.id,
                    lead_id: app.lead_id,
                    event_type: "followup_email_sent",
                    title: `Automated follow-up sent (${r.kind})`,
                    description: null,
                    customer_visible: false,
                    actor_name: "System",
                    is_system: true,
                    metadata: { reminder_id: r.id, template: effectiveTemplate }
                  });
                }
              }
              if (r.kind === "internal_review") {
                const payload = r.payload ?? {};
                if (r.assigned_to) {
                  await supabaseAdmin.from("notifications").insert({
                    user_id: r.assigned_to,
                    title: `Internal delay review due — ${payload.reason ?? "review"}`,
                    body: `Order ${app.application_code ?? ""} needs an internal review.`,
                    kind: "workflow_internal_review",
                    link_to: `/admin/orders/${app.id}`
                  });
                }
                await supabaseAdmin.from("workflow_events").insert({
                  application_id: app.id,
                  lead_id: app.lead_id,
                  event_type: "internal_review_due",
                  title: "Internal delay review due",
                  description: payload.reason ?? null,
                  customer_visible: false,
                  actor_name: "System",
                  is_system: true,
                  metadata: { reminder_id: r.id }
                });
              }
              const next = NEXT_KIND[r.kind];
              if (next) {
                const dueAt = new Date(Date.now() + next.daysFromNow * 86400 * 1e3).toISOString();
                await supabaseAdmin.from("workflow_reminders").insert({
                  application_id: app.id,
                  lead_id: app.lead_id,
                  kind: next.kind,
                  template_code: next.tplCode,
                  due_at: dueAt,
                  assigned_to: r.assigned_to,
                  status: "pending",
                  payload: r.payload,
                  created_by: r.created_by
                });
              }
            } catch (innerErr) {
              console.error("[workflow-cron] reminder failed", r.id, innerErr);
              await supabaseAdmin.from("workflow_reminders").update({ status: "failed", error: String(innerErr) }).eq("id", r.id);
            }
          }
          return Response.json({ ok: true, processed, sent });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "unknown";
          return Response.json({ ok: false, error: msg }, { status: 500 });
        }
      }
    }
  }
});
const Route$l = createFileRoute()({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.CRON_SECRET;
        const auth = request.headers.get("authorization") ?? "";
        const apikey = request.headers.get("apikey") ?? "";
        if (!secret || auth !== `Bearer ${secret}` && apikey !== secret) {
          return new Response("Unauthorized", { status: 401 });
        }
        const { tickDueTimers } = await import("./engine.server-Clp4bFRY.mjs");
        try {
          const result = await tickDueTimers();
          return Response.json({ ok: true, ...result });
        } catch (err) {
          console.error("[workflow-tick] failed", err);
          return Response.json({ ok: false, error: String(err) }, { status: 500 });
        }
      },
      GET: async () => Response.json({ ok: true, hint: "POST to run" })
    }
  }
});
const Route$k = createFileRoute()({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apikey = request.headers.get("apikey") || request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
        const expected = process.env.CRON_SECRET;
        if (!apikey || !expected || apikey !== expected) {
          return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
          });
        }
        try {
          const { reassignProlongedUnavailableStaff } = await import("./assignment-engine.server--SlhbLzd.mjs");
          const result = await reassignProlongedUnavailableStaff();
          return Response.json({ ok: true, ...result });
        } catch (e) {
          const message = e instanceof Error ? e.message : "unknown";
          console.error("[cron:workforce-reassign-tick] failed", message);
          return new Response(JSON.stringify({ ok: false, error: message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
      },
      GET: async () => Response.json({ ok: true, hint: "POST with CRON_SECRET to run" })
    }
  }
});
async function probe(dc) {
  const accountsHost = `https://accounts.zoho.${dc}`;
  const mailHost = `https://mail.zoho.${dc}`;
  const out = { dc, accountsHost, mailHost };
  const params = new URLSearchParams({
    refresh_token: process.env.ZOHO_MAIL_REFRESH_TOKEN ?? "",
    client_id: process.env.ZOHO_MAIL_CLIENT_ID ?? "",
    client_secret: process.env.ZOHO_MAIL_CLIENT_SECRET ?? "",
    grant_type: "refresh_token"
  });
  const tokRes = await fetch(`${accountsHost}/oauth/v2/token?${params.toString()}`, {
    method: "POST"
  });
  const tokBody = await tokRes.text();
  out.refresh = {
    status: tokRes.status,
    body: tokBody.slice(0, 300)
  };
  let accessToken = null;
  try {
    const parsed = JSON.parse(tokBody);
    accessToken = parsed.access_token ?? null;
    out.refresh.scope = parsed.scope;
  } catch {
  }
  if (!accessToken) return out;
  const accRes = await fetch(`${mailHost}/api/accounts`, {
    headers: { Authorization: `Zoho-oauthtoken ${accessToken}` }
  });
  const accBody = await accRes.text();
  out.accounts = {
    status: accRes.status,
    body_preview: accBody.slice(0, 400)
  };
  try {
    const parsed = JSON.parse(accBody);
    out.accounts.accountIds = (parsed.data ?? []).map((a) => ({
      accountId: a.accountId,
      primaryEmailAddress: a.primaryEmailAddress,
      mailboxAddress: a.mailboxAddress
    }));
  } catch {
  }
  return out;
}
const Route$j = createFileRoute()({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apikey = request.headers.get("apikey") || request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
        const expected = process.env.CRON_SECRET;
        if (!apikey || !expected || apikey !== expected) {
          return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
          });
        }
        const env = {
          ZOHO_MAIL_DC: process.env.ZOHO_MAIL_DC ?? null,
          ZOHO_MAIL_ACCOUNT_ID: process.env.ZOHO_MAIL_ACCOUNT_ID ?? null,
          has_ZOHO_MAIL_CLIENT_ID: Boolean(process.env.ZOHO_MAIL_CLIENT_ID),
          has_ZOHO_MAIL_CLIENT_SECRET: Boolean(process.env.ZOHO_MAIL_CLIENT_SECRET),
          has_ZOHO_MAIL_REFRESH_TOKEN: Boolean(process.env.ZOHO_MAIL_REFRESH_TOKEN)
        };
        const results = { env };
        for (const dc of ["in", "com", "eu"]) {
          try {
            results[dc] = await probe(dc);
          } catch (e) {
            results[dc] = { error: e.message };
          }
        }
        return Response.json({ ok: true, results });
      }
    }
  }
});
const BUCKET = "form-assets";
const Route$i = createFileRoute()({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const splat = String(params._splat || "").trim();
        if (!splat || splat.includes("..")) {
          return new Response("Not found", { status: 404 });
        }
        const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
        const { data: signed, error } = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(splat, 60 * 10);
        if (error || !signed?.signedUrl) {
          return new Response("File not available.", { status: 404 });
        }
        return new Response(null, {
          status: 302,
          headers: { Location: signed.signedUrl, "Cache-Control": "no-store" }
        });
      }
    }
  }
});
const GST_DOMAIN$1 = "gstcertificate.in";
const cors$1 = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
};
const Schema$4 = object({
  name: string().trim().min(2).max(120),
  email: string().trim().toLowerCase().email().max(160),
  mobile: string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  state: string().trim().refine((v) => INDIAN_STATES.includes(v), "Invalid state"),
  language: string().trim().refine((v) => LANGUAGES.includes(v), "Invalid language"),
  service: string().trim().min(2).max(200),
  notes: string().trim().max(2e3).optional(),
  source_page: string().trim().max(300).optional()
});
function siteOrigin(request) {
  return process.env["GST_SITE_URL"] || process.env["APP_BASE_URL"] || new URL(request.url).origin;
}
const Route$h = createFileRoute()({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      }),
      POST: async ({ request }) => {
        let input;
        try {
          input = Schema$4.parse(await request.json());
        } catch (e) {
          return new Response(
            JSON.stringify({ ok: false, error: e instanceof Error ? e.message : "Invalid input" }),
            { status: 400, headers: cors$1 }
          );
        }
        try {
          const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
          const { data: site } = await supabaseAdmin.from("websites").select("id").eq("domain", GST_DOMAIN$1).maybeSingle();
          if (!site?.id) {
            return new Response(JSON.stringify({ ok: false, error: "Website not configured" }), {
              status: 404,
              headers: cors$1
            });
          }
          const { data: services, error: svcErr } = await supabaseAdmin.from("services").select("id, service_code, service_name, base_amount, gst_amount, total_amount, is_active").eq("website_id", site.id).eq("is_active", true);
          if (svcErr) throw new Error(svcErr.message);
          const wanted = input.service.toLowerCase();
          const service = (services ?? []).find(
            (s) => String(s.service_code).toLowerCase() === wanted || String(s.service_name).toLowerCase() === wanted
          );
          if (!service) {
            return new Response(
              JSON.stringify({ ok: false, error: "Selected service is not available." }),
              { status: 400, headers: cors$1 }
            );
          }
          const baseAmount = Number(service.base_amount);
          const gstAmount = Number(service.gst_amount);
          const totalAmount = Number(service.total_amount);
          let customerId = null;
          const { data: cid, error: custErr } = await supabaseAdmin.rpc("find_or_create_customer", {
            p_name: input.name,
            p_email: input.email,
            p_mobile: input.mobile,
            p_state: input.state,
            p_language: input.language
          });
          if (custErr) console.error("[gst/lead] find_or_create_customer:", custErr.message);
          else customerId = cid ?? null;
          const { data: lead, error } = await supabaseAdmin.from("leads").insert({
            name: input.name,
            email: input.email,
            mobile: input.mobile,
            state: input.state,
            language: input.language,
            service: service.service_name,
            service_id: service.id,
            base_amount: baseAmount,
            gst_amount: gstAmount,
            total_amount: totalAmount,
            status: "new_lead",
            lead_source: input.source_page ? `Website | ${input.source_page.split("?")[0].slice(0, 120)}` : "gstcertificate.in",
            notes: input.notes ?? null,
            customer_id: customerId,
            website_id: site.id
          }).select("id, lead_code").single();
          if (error || !lead?.lead_code) {
            throw new Error(error?.message ?? "Could not save the lead");
          }
          try {
            const { autoAssignLeadOrOrder } = await import("./auto-assign.server-D-MYRWKz.mjs");
            await autoAssignLeadOrOrder({ leadId: lead.id, serviceId: service.id });
          } catch (assignErr) {
            console.error("[gst/lead] auto-assign:", assignErr);
          }
          try {
            const { emitToRole } = await import("./emit.server-OhKEr4hO.mjs");
            for (const role of ["admin", "super_admin"]) {
              await emitToRole(role, {
                kind: "form_submitted",
                title: "New GST Lead Received",
                body: `${input.name} (${service.service_name}) — ${input.mobile}`,
                href: `/admin/leads/${lead.id}`,
                entityKind: "lead",
                entityId: lead.id
              });
            }
          } catch (e) {
            console.error("[gst/lead] notify:", e);
          }
          const { secureCustomerUrl } = await import("./customer-access.server-C_oBiISE.mjs");
          const paymentUrl = await secureCustomerUrl(siteOrigin(request), `/payment/${encodeURIComponent(lead.lead_code)}`, lead.id, "co", "gst_lead");
          return new Response(
            JSON.stringify({
              ok: true,
              leadCode: lead.lead_code,
              service: service.service_name,
              baseAmount,
              gstAmount,
              totalAmount,
              paymentUrl
            }),
            { status: 200, headers: cors$1 }
          );
        } catch (e) {
          console.error("[gst/lead]", e);
          return new Response(
            JSON.stringify({ ok: false, error: "Could not submit your request. Please try again." }),
            { status: 500, headers: cors$1 }
          );
        }
      }
    }
  }
});
const GST_DOMAIN = "gstcertificate.in";
const cors = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
};
const Route$g = createFileRoute()({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      }),
      GET: async () => {
        try {
          const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
          const { data: site } = await supabaseAdmin.from("websites").select("id").eq("domain", GST_DOMAIN).maybeSingle();
          if (!site?.id) {
            return new Response(JSON.stringify({ ok: false, error: "Website not configured" }), {
              status: 404,
              headers: cors
            });
          }
          const { data, error } = await supabaseAdmin.from("services").select("service_code, service_name, description, base_amount, gst_amount, total_amount, expected_processing_days, sort_order").eq("website_id", site.id).eq("is_active", true).order("sort_order", { ascending: true });
          if (error) throw new Error(error.message);
          const services = (data ?? []).map((s) => ({
            code: s.service_code,
            name: s.service_name,
            description: s.description ?? null,
            baseAmount: Number(s.base_amount),
            gstAmount: Number(s.gst_amount),
            totalAmount: Number(s.total_amount),
            processingDays: s.expected_processing_days ?? null
          }));
          return new Response(JSON.stringify({ ok: true, services }), { status: 200, headers: cors });
        } catch (e) {
          console.error("[gst/services]", e);
          return new Response(JSON.stringify({ ok: false, error: "Could not load services" }), {
            status: 500,
            headers: cors
          });
        }
      }
    }
  }
});
const Route$f = createFileRoute()({
  server: {
    handlers: {
      GET: async () => {
        return new Response(
          "Public invoice access disabled. Customer tax invoices are delivered directly via email attachment.",
          { status: 403, headers: { "Content-Type": "text/plain" } }
        );
      }
    }
  }
});
const siteCors = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept"
};
const siteOptions = () => new Response(null, { status: 204, headers: siteCors });
function siteJson(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: siteCors });
}
function normalizeDomain(raw) {
  return String(raw ?? "").trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0].split(":")[0].replace(/^www\./, "");
}
function resolveDomain(request, explicit) {
  const d = normalizeDomain(explicit);
  if (d) return d;
  const origin = request.headers.get("origin") || request.headers.get("referer");
  return normalizeDomain(origin);
}
async function loadSite(domain) {
  if (!domain) return null;
  const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
  const { data } = await supabaseAdmin.from("websites").select(
    "id, name, domain, brand_name, company_name, legal_entity, support_email, support_phone, whatsapp_number, business_hours, primary_color, logo_asset_url, favicon_asset_url, sample_certificate_asset_url, legal_footer_line, postal_address, gtag_id, google_site_verification, is_active, is_primary, payments_enabled"
  ).eq("domain", domain).maybeSingle();
  return data && data.is_active !== false ? data : null;
}
const Route$e = createFileRoute()({
  server: {
    handlers: {
      OPTIONS: async () => siteOptions(),
      HEAD: async ({ request }) => {
        const site = await loadSite(resolveDomain(request, new URL(request.url).searchParams.get("domain")));
        return new Response(null, { status: site ? 200 : 404 });
      },
      GET: async ({ request }) => {
        try {
          const site = await loadSite(resolveDomain(request, new URL(request.url).searchParams.get("domain")));
          if (!site) return siteJson({ ok: false, error: "Website not configured" }, 404);
          const { is_active: _a, ...brand } = site;
          const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
          const [blocksRes, navRes] = await Promise.all([
            supabaseAdmin.from("site_content_blocks").select("block_key, content, sort_order").eq("website_id", site.id).eq("is_active", true).order("sort_order"),
            supabaseAdmin.from("site_nav_items").select("label, path, nav_group, open_in_new, sort_order").eq("website_id", site.id).eq("is_active", true).order("sort_order")
          ]);
          const blocks = {};
          for (const b of blocksRes.data ?? []) blocks[b.block_key] = b.content;
          const text = (k) => {
            const c = blocks[k];
            if (typeof c === "string") return c || null;
            return c && typeof c.text === "string" && c.text.trim() ? c.text : null;
          };
          const nav = navRes.data ?? [];
          const content = {
            blocks,
            header_brand_title: text("header.brand_title"),
            header_brand_subtitle: text("header.brand_subtitle"),
            header_center_title: text("header.center_title"),
            header_center_subtitle: text("header.center_subtitle"),
            footer_brand_heading: text("footer.brand_heading"),
            footer_contact_name: text("footer.contact_name"),
            nav: {
              header: nav.filter((n) => n.nav_group === "header"),
              footer: nav.filter((n) => n.nav_group !== "header")
            }
          };
          return siteJson({ ok: true, ...brand, ...content, brand, website: brand, content });
        } catch (e) {
          console.error("[site/brand]", e);
          return siteJson({ ok: false, error: "Could not load website" }, 500);
        }
      }
    }
  }
});
const Schema$3 = object({
  name: string().trim().min(2, "Enter your name").max(120),
  email: string().trim().toLowerCase().email("Enter a valid email").max(160),
  mobile: string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  state: string().trim().max(80),
  language: string().trim().max(40),
  service: string().trim().min(1, "Select a service").max(200),
  notes: string().trim().max(2e3).optional(),
  source_page: string().trim().max(300).optional()
});
const pick = (o, ...keys) => {
  for (const k of keys) {
    const v = o[k];
    if (v !== void 0 && v !== null && String(v).trim() !== "") return String(v);
  }
  return void 0;
};
async function readBody(request) {
  const ct = request.headers.get("content-type") || "";
  if (ct.includes("application/json")) return await request.json() ?? {};
  if (ct.includes("form")) return Object.fromEntries((await request.formData()).entries());
  const text = await request.text();
  try {
    return JSON.parse(text);
  } catch {
    return Object.fromEntries(new URLSearchParams(text).entries());
  }
}
const matchList = (list, v) => list.find((x) => x.toLowerCase() === v.toLowerCase()) ?? v;
const Route$d = createFileRoute()({
  server: {
    handlers: {
      OPTIONS: async () => siteOptions(),
      POST: async ({ request }) => {
        let raw;
        try {
          raw = await readBody(request);
        } catch {
          return siteJson({ ok: false, success: false, error: "Invalid request" }, 400);
        }
        if (pick(raw, "company_website", "website_url_hp")) return siteJson({ ok: true, success: true });
        const mobileRaw = (pick(raw, "mobile", "phone", "mobile_no", "mobileNo", "phone_number") ?? "").replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
        const parsed = Schema$3.safeParse({
          name: pick(raw, "name", "applicant_name", "applicantName", "full_name", "fullName"),
          email: pick(raw, "email", "email_address"),
          mobile: mobileRaw,
          state: pick(raw, "state") ?? "",
          language: pick(raw, "language", "lang") ?? "English",
          service: pick(raw, "service", "service_code", "serviceCode", "service_id", "serviceId", "service_name", "serviceName"),
          notes: pick(raw, "notes", "message"),
          source_page: pick(raw, "source_page", "sourcePage", "page", "source")
        });
        if (!parsed.success) {
          const msg = parsed.error.issues[0]?.message ?? "Invalid input";
          return siteJson({ ok: false, success: false, error: msg, message: msg }, 400);
        }
        const input = parsed.data;
        const state = matchList(INDIAN_STATES, input.state);
        const language = matchList(LANGUAGES, input.language);
        try {
          const domain = resolveDomain(request, pick(raw, "domain", "website", "site"));
          const site = await loadSite(domain);
          if (!site) return siteJson({ ok: false, success: false, error: "Website not configured" }, 404);
          const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
          const { data: services, error: svcErr } = await supabaseAdmin.from("services").select("id, service_code, service_name, base_amount, gst_amount, total_amount").eq("website_id", site.id).eq("is_active", true);
          if (svcErr) throw new Error(svcErr.message);
          const wanted = input.service.toLowerCase();
          const service = (services ?? []).find(
            (s) => String(s.id).toLowerCase() === wanted || String(s.service_code).toLowerCase() === wanted || String(s.service_name).toLowerCase() === wanted
          );
          if (!service) {
            return siteJson({ ok: false, success: false, error: "Selected service is not available." }, 400);
          }
          let customerId = null;
          const { data: cid, error: custErr } = await supabaseAdmin.rpc("find_or_create_customer", {
            p_name: input.name,
            p_email: input.email,
            p_mobile: input.mobile,
            p_state: state,
            p_language: language
          });
          if (custErr) console.error("[site/lead] find_or_create_customer:", custErr.message);
          else customerId = cid ?? null;
          const { data: lead, error } = await supabaseAdmin.from("leads").insert({
            name: input.name,
            email: input.email,
            mobile: input.mobile,
            state,
            language,
            service: service.service_name,
            service_id: service.id,
            base_amount: Number(service.base_amount),
            gst_amount: Number(service.gst_amount),
            total_amount: Number(service.total_amount),
            status: "new_lead",
            lead_source: input.source_page ? `Website | ${input.source_page.split("?")[0].slice(0, 120)}` : site.domain,
            notes: input.notes ?? null,
            customer_id: customerId,
            website_id: site.id
          }).select("id, lead_code, public_ref").single();
          if (error || !lead?.lead_code) throw new Error(error?.message ?? "Could not save the lead");
          try {
            const { autoAssignLeadOrOrder } = await import("./auto-assign.server-D-MYRWKz.mjs");
            await autoAssignLeadOrOrder({ leadId: lead.id, serviceId: service.id });
          } catch (e) {
            console.error("[site/lead] auto-assign:", e);
          }
          try {
            const { emitToRole } = await import("./emit.server-OhKEr4hO.mjs");
            for (const role of ["admin", "super_admin"]) {
              await emitToRole(role, {
                kind: "form_submitted",
                title: "New Website Lead Received",
                body: `${input.name} (${service.service_name}) — ${input.mobile} · ${site.domain}`,
                href: `/admin/leads/${lead.id}`,
                entityKind: "lead",
                entityId: lead.id
              });
            }
          } catch (e) {
            console.error("[site/lead] notify:", e);
          }
          const paymentsEnabled = site.payments_enabled !== false;
          const { secureCustomerUrl } = await import("./customer-access.server-C_oBiISE.mjs");
          let paymentUrl;
          let checkoutToken = null;
          if (site.is_primary) {
            const base = process.env["APP_BASE_URL"] || new URL(request.url).origin;
            paymentUrl = await secureCustomerUrl(base, `/payment/${encodeURIComponent(lead.lead_code)}`, lead.id, "co", "site_lead");
          } else {
            const g = await import("./guard.server-DxovqIcG.mjs");
            checkoutToken = await g.issueCheckoutToken(lead.lead_code, site.id);
            const ref = encodeURIComponent(String(lead.public_ref ?? lead.lead_code));
            const frag = new URLSearchParams({ lc: lead.lead_code, ct: checkoutToken, pe: paymentsEnabled ? "1" : "0" });
            paymentUrl = `https://${site.domain}/processing?ref=${ref}#${frag.toString()}`;
          }
          return siteJson({
            ok: true,
            success: true,
            leadCode: lead.lead_code,
            lead_code: lead.lead_code,
            service: service.service_name,
            baseAmount: Number(service.base_amount),
            gstAmount: Number(service.gst_amount),
            totalAmount: Number(service.total_amount),
            paymentUrl,
            payment_url: paymentUrl,
            redirectUrl: paymentUrl,
            paymentsEnabled,
            payments_enabled: paymentsEnabled,
            checkoutToken,
            checkout_token: checkoutToken
          });
        } catch (e) {
          console.error("[site/lead]", e);
          return siteJson(
            { ok: false, success: false, error: "Could not submit your application. Please try again." },
            500
          );
        }
      }
    }
  }
});
const Route$c = createFileRoute()({
  server: {
    handlers: {
      OPTIONS: async () => siteOptions(),
      GET: async ({ request }) => {
        try {
          const site = await loadSite(resolveDomain(request, new URL(request.url).searchParams.get("domain")));
          if (!site) return siteJson({ ok: false, error: "Website not configured" }, 404);
          const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
          const { data, error } = await supabaseAdmin.from("services").select("id, service_code, service_name, description, base_amount, gst_amount, total_amount, expected_processing_days, sort_order").eq("website_id", site.id).eq("is_active", true).order("sort_order", { ascending: true });
          if (error) throw new Error(error.message);
          const services = (data ?? []).map((s) => ({
            id: s.id,
            code: s.service_code,
            service_code: s.service_code,
            name: s.service_name,
            service_name: s.service_name,
            description: s.description ?? null,
            baseAmount: Number(s.base_amount),
            gstAmount: Number(s.gst_amount),
            totalAmount: Number(s.total_amount),
            base_amount: Number(s.base_amount),
            gst_amount: Number(s.gst_amount),
            total_amount: Number(s.total_amount),
            processingDays: s.expected_processing_days ?? null
          }));
          return siteJson({ ok: true, services });
        } catch (e) {
          console.error("[site/services]", e);
          return siteJson({ ok: false, error: "Could not load services" }, 500);
        }
      }
    }
  }
});
const Schema$2 = object({
  name: string().trim().min(2).max(120),
  email: string().trim().toLowerCase().email().max(160),
  mobile: string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  state: string().trim().refine((v) => INDIAN_STATES.includes(v), "Invalid state"),
  language: string().trim().refine((v) => LANGUAGES.includes(v), "Invalid language"),
  service: string().trim().min(1).max(200),
  consent: literal(true, { message: "Consent is required to proceed" }),
  source_page: string().trim().max(300).optional(),
  notes: string().trim().max(2e3).optional(),
  // Honeypot: real users never fill this. Bots usually do.
  company_website: string().max(200).optional()
});
const Route$b = createFileRoute()({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        const g = await import("./guard.server-DxovqIcG.mjs");
        const { origin } = await g.resolveCallerWebsite(request);
        return g.preflight(origin, "POST");
      },
      POST: async ({ request }) => {
        const g = await import("./guard.server-DxovqIcG.mjs");
        const { website, origin } = await g.resolveCallerWebsite(request);
        if (!website) {
          return g.jsonError(403, "ORIGIN_NOT_ALLOWED", "This origin is not authorised.", null);
        }
        if (!g.rateLimit(g.clientKey(request, "leads"), 8, 6e4)) {
          return g.jsonError(429, "RATE_LIMITED", "Too many submissions. Please wait a minute.", origin);
        }
        let input;
        try {
          input = Schema$2.parse(await request.json());
        } catch (e) {
          const message = e instanceof ZodError ? e.issues[0]?.message ?? "Please check the details you entered." : "Please check the details you entered.";
          return g.jsonError(400, "VALIDATION_FAILED", message, origin);
        }
        if (input.company_website) {
          return g.jsonOk({ lead_code: null, checkout_token: null }, origin);
        }
        try {
          const { createApiLead } = await import("./leads.server-BvcrgwZl.mjs");
          const result = await createApiLead(website.id, website.domain, {
            name: input.name,
            email: input.email,
            mobile: input.mobile,
            state: input.state,
            language: input.language,
            service: input.service,
            source_page: input.source_page,
            notes: input.notes
          });
          const token = await g.issueCheckoutToken(result.leadCode, website.id);
          return g.jsonOk(
            {
              lead_code: result.leadCode,
              checkout_token: token,
              expires_in: 3600,
              service: result.service,
              pricing: { ...result.pricing, currency: "INR" },
              next_url: `/processing/${result.leadCode}#t=${result.accessToken}`
            },
            origin
          );
        } catch (e) {
          const code = e?.code;
          if (code === "SERVICE_UNAVAILABLE") {
            return g.jsonError(400, code, "Selected service is not available.", origin);
          }
          console.error("[api/v1/leads]", e);
          return g.jsonError(500, "SERVER_ERROR", "Could not submit your request. Please try again.", origin);
        }
      }
    }
  }
});
const Route$a = createFileRoute()({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        const g = await import("./guard.server-DxovqIcG.mjs");
        const { origin } = await g.resolveCallerWebsite(request);
        return g.preflight(origin, "GET");
      },
      GET: async ({ request }) => {
        const g = await import("./guard.server-DxovqIcG.mjs");
        const { website, origin } = await g.resolveCallerWebsite(request);
        if (!website) {
          return g.jsonError(403, "ORIGIN_NOT_ALLOWED", "This origin is not authorised.", null, "GET");
        }
        if (!g.rateLimit(g.clientKey(request, "services"), 60, 6e4)) {
          return g.jsonError(429, "RATE_LIMITED", "Too many requests. Please slow down.", origin, "GET");
        }
        try {
          const { listWebsiteServices } = await import("./leads.server-BvcrgwZl.mjs");
          const rows = await listWebsiteServices(website.id);
          return g.jsonOk(
            {
              website: {
                domain: website.domain,
                name: website.brand_name || website.name || website.domain
              },
              services: rows.map((s) => ({
                code: s.service_code,
                name: s.service_name,
                description: s.description ?? null,
                base_amount: Number(s.base_amount),
                gst_amount: Number(s.gst_amount),
                total_amount: Number(s.total_amount),
                processing_days: s.expected_processing_days ?? null
              }))
            },
            origin,
            "GET"
          );
        } catch (e) {
          console.error("[api/v1/services]", e);
          return g.jsonError(500, "SERVER_ERROR", "Could not load services.", origin, "GET");
        }
      }
    }
  }
});
const Route$9 = createFileRoute()({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const returnNonce2 = new URL(request.url).searchParams.get("r");
        const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
        const { getOrderStatus } = await import("./cashfree.server-DDK211Dz.mjs");
        const url2 = new URL(request.url);
        const orderId = url2.searchParams.get("order_id") || url2.searchParams.get("orderId");
        if (!orderId) {
          return await redirectToPending$2("unknown", returnNonce2);
        }
        const { data: payment } = await supabaseAdmin.from("payments").select("id, lead_id, status, amount, payment_account_id, leads:lead_id (lead_code)").or(`transaction_id.eq.${orderId},razorpay_order_id.eq.${orderId}`).maybeSingle();
        const leadCode = payment?.leads?.lead_code || orderId.replace(/^CF-/, "").split("-")[0] || orderId;
        if (payment?.status === "paid") {
          return await redirectToSuccess$2(leadCode, returnNonce2);
        }
        try {
          if (!payment) return await redirectToPending$2(leadCode, returnNonce2);
          const { credsForPayment } = await import("./cashfree-accounts.server-guyWBqWD.mjs");
          const creds = await credsForPayment(payment.payment_account_id);
          const cfOrder = await getOrderStatus(orderId, creds);
          const paidAmount = Number(cfOrder.order_amount ?? 0);
          const isSuccess = cfOrder.order_status === "PAID" && Math.abs(paidAmount - Number(payment.amount)) <= 0.01;
          if (isSuccess && payment) {
            await supabaseAdmin.from("payments").update({
              status: "paid",
              payment_date: (/* @__PURE__ */ new Date()).toISOString(),
              raw_response: cfOrder,
              webhook_received_at: (/* @__PURE__ */ new Date()).toISOString()
            }).eq("id", payment.id);
            const { finalizePaidPayment } = await import("./finalize-paid.server-CnNMG_m8.mjs");
            await finalizePaidPayment(payment.id, {
              source: "webhook",
              txnid: orderId
            });
            return await redirectToSuccess$2(leadCode, returnNonce2);
          } else if (cfOrder.order_status === "EXPIRED" || cfOrder.order_status === "TERMINATED") {
            if (payment) {
              await supabaseAdmin.from("payments").update({ status: "failed", raw_response: cfOrder }).eq("id", payment.id);
            }
            return await redirectToFailure$2(leadCode, `Payment ${cfOrder.order_status.toLowerCase()}`, returnNonce2);
          }
        } catch (e) {
          console.error("[cashfree-get] verification failed", { orderId, error: e });
        }
        return await redirectToPending$2(leadCode, returnNonce2);
      },
      POST: async ({ request }) => {
        const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
        const { verifyWebhookSignature, getOrderStatus } = await import("./cashfree.server-DDK211Dz.mjs");
        const rawBody = await request.text();
        const signature = request.headers.get("x-webhook-signature") || "";
        const timestamp = request.headers.get("x-webhook-timestamp") || "";
        let payload = {};
        try {
          payload = JSON.parse(rawBody);
        } catch {
          return new Response("Invalid JSON payload", { status: 400 });
        }
        const orderId = payload?.data?.order?.order_id || payload?.order_id;
        const paymentStatus = payload?.data?.payment?.payment_status || payload?.type;
        if (!orderId) {
          return new Response("Missing order_id", { status: 400 });
        }
        let { data: payment } = await supabaseAdmin.from("payments").select("id, lead_id, application_id, status, amount, payment_account_id").or(`transaction_id.eq.${orderId},razorpay_order_id.eq.${orderId}`).maybeSingle();
        console.log("[cashfree-return-debug]", {
          orderId,
          noncePresent: !!returnNonce,
          paymentFound: !!payment,
          paymentId: payment?.id ?? null,
          leadId: payment?.lead_id ?? null
        });
        if (!payment) {
          console.error("[cashfree-webhook] Payment row not found for orderId:", orderId);
          return new Response("Payment not found", { status: 200 });
        }
        const { credsForPayment } = await import("./cashfree-accounts.server-guyWBqWD.mjs");
        let creds;
        try {
          creds = await credsForPayment(payment.payment_account_id);
        } catch (e) {
          console.error("[cashfree-webhook] account resolution failed", { orderId, error: String(e) });
          return new Response("Account unavailable", { status: 500 });
        }
        let signatureVerified = false;
        if (signature && timestamp) {
          try {
            signatureVerified = await verifyWebhookSignature(timestamp, rawBody, signature, creds.clientSecret);
            if (!signatureVerified) {
              console.error("[cashfree-webhook] Signature verification failed");
              return new Response("Invalid signature", { status: 400 });
            }
          } catch (e) {
            console.error("[cashfree-webhook] Signature check error", e);
            return new Response("Signature check failed", { status: 400 });
          }
        }
        if (payment.status === "paid") {
          return new Response("OK", { status: 200 });
        }
        const isSuccess = paymentStatus === "SUCCESS" || paymentStatus === "PAYMENT_SUCCESS_WEBHOOK" || payload?.data?.order?.order_status === "PAID";
        let verifiedSuccess = false;
        if (isSuccess && signatureVerified) {
          verifiedSuccess = true;
        } else {
          try {
            const cfOrder = await getOrderStatus(orderId, creds);
            if (cfOrder.order_status === "PAID") {
              const paidAmount = Number(cfOrder.order_amount ?? payment.amount);
              if (Math.abs(paidAmount - Number(payment.amount)) <= 0.01) {
                verifiedSuccess = true;
              } else {
                console.error("[cashfree-webhook] Amount mismatch", {
                  orderId,
                  paidAmount,
                  expected: payment.amount
                });
              }
            }
          } catch (e) {
            console.error("[cashfree-webhook] API verification check failed", e);
          }
        }
        if (verifiedSuccess) {
          const cfPaymentId = payload?.data?.payment?.cf_payment_id || payload?.data?.payment?.payment_gateway_details?.gateway_order_id || null;
          await supabaseAdmin.from("payments").update({
            status: "paid",
            razorpay_payment_id: cfPaymentId ? String(cfPaymentId) : null,
            payment_date: (/* @__PURE__ */ new Date()).toISOString(),
            webhook_response: payload,
            webhook_received_at: (/* @__PURE__ */ new Date()).toISOString()
          }).eq("id", payment.id);
          try {
            const { finalizePaidPayment } = await import("./finalize-paid.server-CnNMG_m8.mjs");
            await finalizePaidPayment(payment.id, {
              source: "webhook",
              txnid: orderId
            });
          } catch (e) {
            console.error("[cashfree-webhook] Post-paid finalization failed", e);
          }
          return new Response("OK", { status: 200 });
        }
        const isFailed = paymentStatus === "FAILED" || paymentStatus === "PAYMENT_FAILED_WEBHOOK" || paymentStatus === "USER_DROPPED";
        if (isFailed && signatureVerified) {
          await supabaseAdmin.from("payments").update({
            status: "failed",
            webhook_response: payload,
            webhook_received_at: (/* @__PURE__ */ new Date()).toISOString()
          }).eq("id", payment.id);
          await supabaseAdmin.from("leads").update({ status: "payment_pending", lead_status_v2: "payment_failed" }).eq("id", payment.lead_id);
        }
        return new Response("OK", { status: 200 });
      }
    }
  }
});
const APP_ORIGIN$2 = process.env.APP_BASE_URL || process.env.PUBLIC_SITE_URL || "https://udyamadhar.in";
async function redirectToSuccess$2(leadCode, nonce) {
  const { gatewayReturnRedirect } = await import("./customer-access.server-C_oBiISE.mjs");
  return gatewayReturnRedirect(leadCode, "success", APP_ORIGIN$2, void 0, nonce);
}
async function redirectToPending$2(leadCode, nonce) {
  const { gatewayReturnRedirect } = await import("./customer-access.server-C_oBiISE.mjs");
  return gatewayReturnRedirect(leadCode, "payment-pending", APP_ORIGIN$2, void 0, nonce);
}
async function redirectToFailure$2(leadCode, reason, nonce) {
  const { gatewayReturnRedirect } = await import("./customer-access.server-C_oBiISE.mjs");
  return gatewayReturnRedirect(leadCode, "payment-failed", APP_ORIGIN$2, { reason }, nonce);
}
const Route$8 = createFileRoute()({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const returnNonce2 = new URL(request.url).searchParams.get("r");
        const { callOrderStatusApi, decryptResponse, getCcavCreds, normalizeCcavStatus, parseCcavPayload } = await import("./ccavenue.server-DLXDMTcZ.mjs");
        let creds;
        try {
          creds = getCcavCreds();
        } catch (e) {
          console.error("[ccavenue] not configured", e);
          return new Response("Gateway not configured", { status: 500 });
        }
        const form = await readFormFields$1(request);
        if (!form) {
          return new Response("Unsupported payload", { status: 400 });
        }
        const encResp = form.get("encResp")?.toString() ?? "";
        if (!encResp) {
          return new Response("Missing encResp", { status: 400 });
        }
        let payload;
        try {
          const decrypted = decryptResponse(encResp, creds.workingKey);
          payload = parseCcavPayload(decrypted);
        } catch (e) {
          console.error("[ccavenue] decrypt failed", e);
          return new Response("Invalid payload", { status: 400 });
        }
        const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
        const orderId = payload.order_id || payload.merchant_param0 || "";
        const trackingId = payload.tracking_id || payload.reference_no || "";
        const orderStatus = payload.order_status || payload.status || "";
        const amount = payload.amount || payload.mer_amount || "";
        const failureMessage = payload.failure_message || payload.status_message || "";
        const leadCodeFromParam = payload.merchant_param3 || "";
        if (!orderId) {
          return new Response("Missing order_id", { status: 400 });
        }
        const accept = request.headers.get("accept") ?? "";
        const isBrowser = accept.includes("text/html");
        const { data: payment } = await supabaseAdmin.from("payments").select("id, lead_id, application_id, status, amount").or(`transaction_id.eq.${orderId},razorpay_order_id.eq.${orderId}`).maybeSingle();
        if (!payment) {
          console.error("[ccavenue] payment row missing", { orderId });
          return isBrowser ? await redirectToPending$1(leadCodeFromParam || orderId, returnNonce2) : new Response("payment-not-found", { status: 200 });
        }
        let normalized = normalizeCcavStatus(orderStatus);
        const amountMismatch = Boolean(amount) && Number(amount) !== Number(payment.amount);
        let reconciliationFailed = false;
        if (amountMismatch || normalized === "attempted" || normalized === "created") {
          try {
            const reconciled = await callOrderStatusApi(orderId);
            console.info("[ccavenue] reconciled", {
              orderId,
              postedStatus: orderStatus,
              reconciledStatus: reconciled.status
            });
            normalized = reconciled.status;
            if (reconciled.amount) payload.amount = reconciled.amount;
            if (reconciled.bankRefNo) payload.bank_ref_no = reconciled.bankRefNo;
            if (reconciled.trackingId && !payload.tracking_id) {
              payload.tracking_id = reconciled.trackingId;
            }
            payload._reconciled = JSON.stringify(reconciled.raw);
          } catch (e) {
            reconciliationFailed = true;
            console.error("[ccavenue] status api lookup failed", { orderId, error: e });
          }
        }
        if (amountMismatch && reconciliationFailed && normalized === "paid") {
          console.error("[ccavenue] amount mismatch unverified, holding as attempted", {
            orderId,
            postedAmount: amount,
            expectedAmount: payment.amount
          });
          normalized = "attempted";
        }
        if (payment.status === "paid") {
          try {
            const { finalizePaidPayment } = await import("./finalize-paid.server-CnNMG_m8.mjs");
            await finalizePaidPayment(payment.id, {
              source: "webhook",
              txnid: orderId,
              mihpayid: trackingId || null
            });
          } catch (e) {
            console.error("[ccavenue] paid payment finalization retry failed", e);
          }
          return isBrowser ? await redirectToSuccess$1(leadCodeFromParam || orderId, returnNonce2) : new Response("OK", { status: 200 });
        }
        const newStatus = normalized === "paid" ? "paid" : normalized === "failed" ? "failed" : "attempted";
        const rawPayload = {};
        form.forEach((v, k) => {
          rawPayload[k] = typeof v === "string" ? v : "[file]";
        });
        console.info("[ccavenue] callback decision", {
          orderId,
          leadCode: leadCodeFromParam || null,
          isBrowser,
          postedStatus: orderStatus,
          normalized,
          newStatus
        });
        const { error: paymentUpdateError } = await supabaseAdmin.from("payments").update({
          status: newStatus,
          razorpay_payment_id: trackingId || null,
          payment_date: newStatus === "paid" ? (/* @__PURE__ */ new Date()).toISOString() : null,
          webhook_response: rawPayload,
          raw_response: { tracking_id: trackingId, order_status: orderStatus, ...payload }
        }).eq("id", payment.id);
        if (paymentUpdateError) {
          console.error("[ccavenue] payment update failed", { orderId, error: paymentUpdateError });
          return isBrowser ? await redirectToPending$1(leadCodeFromParam || orderId, returnNonce2) : new Response("payment-update-failed", { status: 200 });
        }
        if (newStatus === "paid") {
          try {
            const { finalizePaidPayment } = await import("./finalize-paid.server-CnNMG_m8.mjs");
            await finalizePaidPayment(payment.id, {
              source: "webhook",
              txnid: orderId,
              mihpayid: trackingId || null
            });
          } catch (e) {
            console.error("[ccavenue] post-payment workflow failed", e);
          }
          return isBrowser ? await redirectToSuccess$1(leadCodeFromParam || orderId, returnNonce2) : new Response("OK", { status: 200 });
        }
        if (newStatus === "failed") {
          await supabaseAdmin.from("leads").update({ status: "payment_pending" }).eq("id", payment.lead_id);
          return isBrowser ? await redirectToFailure$1(leadCodeFromParam || orderId, failureMessage || "Payment failed", returnNonce2) : new Response("OK", { status: 200 });
        }
        return isBrowser ? await redirectToPending$1(leadCodeFromParam || orderId, returnNonce2) : new Response("OK", { status: 200 });
      }
    }
  }
});
const APP_ORIGIN$1 = process.env.APP_BASE_URL || process.env.PUBLIC_SITE_URL || "https://udyamadhar.in";
async function redirectToSuccess$1(leadCode, nonce) {
  const { gatewayReturnRedirect } = await import("./customer-access.server-C_oBiISE.mjs");
  return gatewayReturnRedirect(leadCode, "success", APP_ORIGIN$1, void 0, nonce);
}
async function redirectToPending$1(leadCode, nonce) {
  const { gatewayReturnRedirect } = await import("./customer-access.server-C_oBiISE.mjs");
  return gatewayReturnRedirect(leadCode, "payment-pending", APP_ORIGIN$1, void 0, nonce);
}
async function redirectToFailure$1(leadCode, reason, nonce) {
  const { gatewayReturnRedirect } = await import("./customer-access.server-C_oBiISE.mjs");
  return gatewayReturnRedirect(leadCode, "payment-failed", APP_ORIGIN$1, { reason }, nonce);
}
async function readFormFields$1(request) {
  const ct = (request.headers.get("content-type") ?? "").toLowerCase();
  try {
    if (ct.includes("multipart/form-data") || ct.includes("application/x-www-form-urlencoded")) {
      const fd = await request.formData();
      const params = new URLSearchParams();
      for (const [k, v] of fd.entries()) params.append(k, typeof v === "string" ? v : "");
      return params;
    }
    const body = await request.text();
    if (!body) return new URLSearchParams();
    if (ct.includes("application/json") || body.trimStart().startsWith("{")) {
      const json2 = JSON.parse(body);
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(json2)) params.append(k, v == null ? "" : String(v));
      return params;
    }
    return new URLSearchParams(body);
  } catch {
    return null;
  }
}
const Route$7 = createFileRoute()({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const returnNonce2 = new URL(request.url).searchParams.get("r");
        const { computeResponseHash, getPayUCreds, verifyPayUPayment } = await import("./payu.server-3jw08lkR.mjs");
        let creds;
        try {
          creds = getPayUCreds();
        } catch (e) {
          console.error("[payu] not configured", e);
          return new Response("Gateway not configured", { status: 500 });
        }
        const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
        const form = await readFormFields(request);
        if (!form) {
          return new Response("Unsupported payload", { status: 400 });
        }
        const get = (k) => form.get(k)?.toString() ?? "";
        const fields = {
          key: get("key"),
          txnid: get("txnid"),
          amount: get("amount"),
          productinfo: get("productinfo"),
          firstname: get("firstname"),
          email: get("email"),
          status: get("status"),
          udf1: get("udf1"),
          udf2: get("udf2"),
          udf3: get("udf3"),
          udf4: get("udf4"),
          udf5: get("udf5")
        };
        const receivedHash = get("hash");
        const additionalCharges = get("additionalCharges");
        let mihpayid = get("mihpayid");
        let bankrefnum = get("bankrefnum");
        const normalizedStatus = normalizePayUStatus(fields.status);
        const accept = request.headers.get("accept") ?? "";
        const isBrowser = accept.includes("text/html");
        if (!receivedHash || !fields.txnid) {
          return new Response("Invalid payload", { status: 400 });
        }
        let verifiedPayment = null;
        const expected = computeResponseHash({
          ...fields,
          salt: creds.salt,
          additionalCharges: additionalCharges || void 0
        });
        const hashMatches = expected.toLowerCase() === receivedHash.toLowerCase();
        if (!hashMatches) {
          try {
            verifiedPayment = await verifyPayUPayment(fields.txnid);
          } catch (e) {
            console.error("[payu] verification lookup failed after hash mismatch", { txnid: fields.txnid, error: e });
          }
          if (!isPayUSuccess(verifiedPayment)) {
            console.error("[payu] hash mismatch", { txnid: fields.txnid });
            return isBrowser ? await redirectToPending(get("udf3") || fields.txnid, returnNonce2) : new Response("hash-mismatch", { status: 200 });
          }
          console.warn("[payu] callback hash mismatch but PayU verification confirms success", { txnid: fields.txnid });
        }
        if (!verifiedPayment && shouldVerifyWithPayU(normalizedStatus)) {
          try {
            verifiedPayment = await verifyPayUPayment(fields.txnid);
            console.info("[payu] verify_payment result", {
              txnid: fields.txnid,
              postedStatus: fields.status,
              verifiedStatus: verifiedPayment?.status,
              verifiedUnmappedStatus: verifiedPayment?.unmappedstatus,
              mihpayid: verifiedPayment?.mihpayid
            });
          } catch (e) {
            console.error("[payu] verification lookup failed", { txnid: fields.txnid, postedStatus: fields.status, error: e });
          }
        }
        let payment = (await supabaseAdmin.from("payments").select("id, lead_id, application_id, status, amount").or(`transaction_id.eq.${fields.txnid},razorpay_order_id.eq.${fields.txnid}`).maybeSingle()).data;
        if (!payment && (fields.udf1 || fields.udf3)) {
          const leadId = fields.udf1;
          const leadCode = fields.udf3;
          const { data: targetLead } = await supabaseAdmin.from("leads").select("id, lead_code").or(`id.eq.${leadId || "invalid-uuid"},lead_code.eq.${leadCode || "invalid-code"}`).maybeSingle();
          if (targetLead) {
            const payAmt = Number(fields.amount || 0);
            const baseAmt = Math.round(payAmt / 1.18 * 100) / 100;
            const gstAmt = Math.round((payAmt - baseAmt) * 100) / 100;
            const { data: createdPmt } = await supabaseAdmin.from("payments").insert({
              lead_id: targetLead.id,
              gateway_name: "payu",
              transaction_id: fields.txnid,
              razorpay_order_id: fields.txnid,
              amount: payAmt,
              base_amount: baseAmt,
              gst_amount: gstAmt,
              currency: "INR",
              status: "created",
              idempotency_key: `payu:${fields.txnid}`
            }).select("id, lead_id, application_id, status, amount").maybeSingle();
            if (createdPmt) payment = createdPmt;
          }
        }
        if (!payment) {
          console.error("[payu] payment row missing even after lead lookup", fields.txnid);
          return isBrowser ? await redirectToPending(get("udf3") || fields.txnid, returnNonce2) : new Response("payment-not-found", { status: 200 });
        }
        if (Number(fields.amount) !== Number(payment.amount)) {
          console.warn("[payu] amount mismatch", {
            txnid: fields.txnid,
            expected: payment.amount,
            received: fields.amount
          });
        }
        if (payment.status === "paid") {
          try {
            const { finalizePaidPayment } = await import("./finalize-paid.server-CnNMG_m8.mjs");
            await finalizePaidPayment(payment.id, {
              source: "webhook",
              txnid: fields.txnid,
              mihpayid: mihpayid || null
            });
          } catch (e) {
            console.error("[payu] paid payment finalization retry failed", e);
          }
          return isBrowser ? await redirectToSuccess(get("udf3") || fields.txnid, returnNonce2) : new Response("OK", { status: 200 });
        }
        const verifiedSuccess = isPayUSuccess(verifiedPayment);
        const verifiedFailure = isPayUFailure(verifiedPayment);
        if (verifiedPayment?.mihpayid && !mihpayid) mihpayid = String(verifiedPayment.mihpayid);
        if (verifiedPayment?.bank_ref_num && !bankrefnum) bankrefnum = String(verifiedPayment.bank_ref_num);
        const safeVerifiedPayment = verifiedPayment ? JSON.parse(JSON.stringify(verifiedPayment)) : null;
        const newStatus = verifiedSuccess || normalizedStatus === "success" || normalizedStatus === "captured" ? "paid" : verifiedFailure ? "failed" : "attempted";
        const rawPayload = {};
        form.forEach((v, k) => {
          rawPayload[k] = typeof v === "string" ? v : "[file]";
        });
        console.info("[payu] callback decision", {
          txnid: fields.txnid,
          leadCode: get("udf3") || null,
          isBrowser,
          hashMatches,
          expectedHashPrefix: expected.slice(0, 12),
          receivedHashPrefix: receivedHash.slice(0, 12),
          postedStatus: fields.status,
          normalizedStatus,
          verifiedSuccess,
          verifiedFailure,
          newStatus
        });
        const { error: paymentUpdateError } = await supabaseAdmin.from("payments").update({
          status: newStatus,
          razorpay_payment_id: mihpayid || null,
          razorpay_signature: receivedHash,
          payment_date: newStatus === "paid" ? (/* @__PURE__ */ new Date()).toISOString() : null,
          webhook_response: rawPayload,
          raw_response: { mihpayid, bankrefnum, ...fields, verified_payment: safeVerifiedPayment },
          payu_mihpayid: mihpayid || null,
          payu_mode: get("mode") || null,
          payu_bank_ref_num: bankrefnum || null,
          payu_net_amount_debit: get("net_amount_debit") ? Number(get("net_amount_debit")) : null,
          payu_error_message: get("error_Message") || get("field9") || null,
          webhook_received_at: (/* @__PURE__ */ new Date()).toISOString(),
          is_test_payment: (await import("./payu.server-3jw08lkR.mjs")).PAYU_MODE !== "live"
        }).eq("id", payment.id);
        if (paymentUpdateError) {
          console.error("[payu] payment update failed", { txnid: fields.txnid, error: paymentUpdateError });
          await logWebhookError("payu", paymentUpdateError.message, rawPayload);
          return isBrowser ? await redirectToPending(get("udf3") || fields.txnid, returnNonce2) : new Response("payment-update-failed", { status: 200 });
        }
        if (newStatus === "paid") {
          try {
            const { finalizePaidPayment } = await import("./finalize-paid.server-CnNMG_m8.mjs");
            await finalizePaidPayment(payment.id, {
              source: "webhook",
              txnid: fields.txnid,
              mihpayid: mihpayid || null
            });
          } catch (e) {
            console.error("[payu] post-payment workflow failed", e);
            await logWebhookError("payu", `post-paid: ${e instanceof Error ? e.message : "unknown"}`, rawPayload);
          }
          return isBrowser ? await redirectToSuccess(get("udf3") || fields.txnid, returnNonce2) : new Response("OK", { status: 200 });
        }
        if (newStatus === "failed") {
          await supabaseAdmin.from("leads").update({ status: "payment_pending", lead_status_v2: "payment_failed" }).eq("id", payment.lead_id);
          await supabaseAdmin.from("payment_links").update({ status: "failed" }).eq("lead_id", payment.lead_id).eq("status", "pending");
          return isBrowser ? await redirectToFailure(get("udf3") || fields.txnid, "Payment failed", returnNonce2) : new Response("OK", { status: 200 });
        }
        return isBrowser ? await redirectToPending(get("udf3") || fields.txnid, returnNonce2) : new Response("OK", { status: 200 });
      }
    }
  }
});
async function logWebhookError(webhookType, errorMessage, payload) {
  try {
    const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
    await supabaseAdmin.from("webhook_error_log").insert({
      webhook_type: webhookType,
      error_message: errorMessage.slice(0, 2e3),
      raw_payload: payload
    });
  } catch (e) {
    console.error("[webhook] error-log insert failed", e);
  }
}
const APP_ORIGIN = process.env.APP_BASE_URL || process.env.PUBLIC_SITE_URL || "https://udyamadhar.in";
async function redirectToSuccess(leadCode, nonce) {
  const { gatewayReturnRedirect } = await import("./customer-access.server-C_oBiISE.mjs");
  return gatewayReturnRedirect(leadCode, "success", APP_ORIGIN, void 0, nonce);
}
async function redirectToPending(leadCode, nonce) {
  const { gatewayReturnRedirect } = await import("./customer-access.server-C_oBiISE.mjs");
  return gatewayReturnRedirect(leadCode, "payment-pending", APP_ORIGIN, void 0, nonce);
}
async function redirectToFailure(leadCode, reason, nonce) {
  const { gatewayReturnRedirect } = await import("./customer-access.server-C_oBiISE.mjs");
  return gatewayReturnRedirect(leadCode, "payment-failed", APP_ORIGIN, { reason }, nonce);
}
function isPayUSuccess(payment) {
  const status = normalizePayUStatus(payment?.status);
  const unmapped = normalizePayUStatus(payment?.unmappedstatus);
  return status === "success" || unmapped === "captured";
}
function isPayUFailure(payment) {
  const status = normalizePayUStatus(payment?.status);
  const unmapped = normalizePayUStatus(payment?.unmappedstatus);
  return status === "failure" || status === "failed" || ["bounced", "dropped", "failed", "usercancelled"].includes(unmapped);
}
function normalizePayUStatus(value) {
  return String(value ?? "").trim().toLowerCase();
}
function shouldVerifyWithPayU(status) {
  return status === "success" || status === "failure" || status === "failed" || status === "";
}
async function readFormFields(request) {
  const ct = (request.headers.get("content-type") ?? "").toLowerCase();
  try {
    if (ct.includes("multipart/form-data") || ct.includes("application/x-www-form-urlencoded")) {
      const fd = await request.formData();
      const params = new URLSearchParams();
      for (const [k, v] of fd.entries()) params.append(k, typeof v === "string" ? v : "");
      return params;
    }
    const body = await request.text();
    if (!body) return new URLSearchParams();
    if (ct.includes("application/json") || body.trimStart().startsWith("{")) {
      const json2 = JSON.parse(body);
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(json2)) params.append(k, v == null ? "" : String(v));
      return params;
    }
    return new URLSearchParams(body);
  } catch {
    return null;
  }
}
const MAX_RETRIES = 5;
const DEFAULT_BATCH_SIZE = 10;
const DEFAULT_SEND_DELAY_MS = 200;
const DEFAULT_AUTH_TTL_MINUTES = 15;
const DEFAULT_TRANSACTIONAL_TTL_MINUTES = 60;
function isRateLimited(error) {
  if (error && typeof error === "object" && "status" in error) {
    return error.status === 429;
  }
  return error instanceof Error && error.message.includes("429");
}
function isForbidden(error) {
  if (error && typeof error === "object" && "status" in error) {
    return error.status === 403;
  }
  return error instanceof Error && error.message.includes("403");
}
function getRetryAfterSeconds(error) {
  if (error && typeof error === "object" && "retryAfterSeconds" in error) {
    return error.retryAfterSeconds ?? 60;
  }
  return 60;
}
async function moveToDlq(supabase2, queue, msg, reason) {
  const payload = msg.message;
  await supabase2.from("email_send_log").insert({
    message_id: payload.message_id,
    template_name: payload.label || queue,
    recipient_email: payload.to,
    status: "dlq",
    error_message: reason
  });
  const { error } = await supabase2.rpc("move_to_dlq", {
    source_queue: queue,
    dlq_name: `${queue}_dlq`,
    message_id: msg.msg_id,
    payload
  });
  if (error) {
    console.error("Failed to move message to DLQ", { queue, msg_id: msg.msg_id, reason, error });
  }
}
const Route$6 = createFileRoute()({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.LOVABLE_API_KEY;
        const supabaseUrl = "https://epqxycwzreezbleqlgob.supabase.co";
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!apiKey || !supabaseUrl || !supabaseServiceKey) {
          console.error("Missing required environment variables");
          return Response.json(
            { error: "Server configuration error" },
            { status: 500 }
          );
        }
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const token = authHeader.slice("Bearer ".length).trim();
        if (token !== supabaseServiceKey) {
          return Response.json({ error: "Forbidden" }, { status: 403 });
        }
        const supabase2 = createClient(supabaseUrl, supabaseServiceKey);
        const { data: state } = await supabase2.from("email_send_state").select("retry_after_until, batch_size, send_delay_ms, auth_email_ttl_minutes, transactional_email_ttl_minutes").single();
        if (state?.retry_after_until && new Date(state.retry_after_until) > /* @__PURE__ */ new Date()) {
          return Response.json({ skipped: true, reason: "rate_limited" });
        }
        const batchSize = state?.batch_size ?? DEFAULT_BATCH_SIZE;
        const sendDelayMs = state?.send_delay_ms ?? DEFAULT_SEND_DELAY_MS;
        const ttlMinutes = {
          auth_emails: state?.auth_email_ttl_minutes ?? DEFAULT_AUTH_TTL_MINUTES,
          transactional_emails: state?.transactional_email_ttl_minutes ?? DEFAULT_TRANSACTIONAL_TTL_MINUTES
        };
        let totalProcessed = 0;
        for (const queue of ["auth_emails", "transactional_emails"]) {
          const { data: messages, error: readError } = await supabase2.rpc("read_email_batch", {
            queue_name: queue,
            batch_size: batchSize,
            vt: 30
          });
          if (readError) {
            console.error("Failed to read email batch", { queue, error: readError });
            continue;
          }
          if (!messages?.length) continue;
          const messageIds = Array.from(
            new Set(
              messages.map(
                (msg) => msg?.message?.message_id && typeof msg.message.message_id === "string" ? msg.message.message_id : null
              ).filter((id) => Boolean(id))
            )
          );
          const failedAttemptsByMessageId = /* @__PURE__ */ new Map();
          if (messageIds.length > 0) {
            const { data: failedRows, error: failedRowsError } = await supabase2.from("email_send_log").select("message_id").in("message_id", messageIds).eq("status", "failed");
            if (failedRowsError) {
              console.error("Failed to load failed-attempt counters", {
                queue,
                error: failedRowsError
              });
            } else {
              for (const row of failedRows ?? []) {
                const messageId = row?.message_id;
                if (typeof messageId !== "string" || !messageId) continue;
                failedAttemptsByMessageId.set(
                  messageId,
                  (failedAttemptsByMessageId.get(messageId) ?? 0) + 1
                );
              }
            }
          }
          for (let i = 0; i < messages.length; i++) {
            const msg = messages[i];
            const payload = msg.message;
            const failedAttempts = payload?.message_id && typeof payload.message_id === "string" ? failedAttemptsByMessageId.get(payload.message_id) ?? 0 : msg.read_ct ?? 0;
            const queuedAt = payload.queued_at ?? msg.enqueued_at;
            if (queuedAt) {
              const ageMs = Date.now() - new Date(queuedAt).getTime();
              const maxAgeMs = ttlMinutes[queue] * 60 * 1e3;
              if (ageMs > maxAgeMs) {
                console.warn("Email expired (TTL exceeded)", {
                  queue,
                  msg_id: msg.msg_id,
                  queued_at: queuedAt,
                  ttl_minutes: ttlMinutes[queue]
                });
                await moveToDlq(supabase2, queue, msg, `TTL exceeded (${ttlMinutes[queue]} minutes)`);
                continue;
              }
            }
            if (failedAttempts >= MAX_RETRIES) {
              await moveToDlq(supabase2, queue, msg, `Max retries (${MAX_RETRIES}) exceeded (attempted ${failedAttempts} times)`);
              continue;
            }
            if (payload.message_id) {
              const { data: alreadySent } = await supabase2.from("email_send_log").select("id").eq("message_id", payload.message_id).eq("status", "sent").maybeSingle();
              if (alreadySent) {
                console.warn("Skipping duplicate send (already sent)", {
                  queue,
                  msg_id: msg.msg_id,
                  message_id: payload.message_id
                });
                const { error: dupDelError } = await supabase2.rpc("delete_email", {
                  queue_name: queue,
                  message_id: msg.msg_id
                });
                if (dupDelError) {
                  console.error("Failed to delete duplicate message from queue", { queue, msg_id: msg.msg_id, error: dupDelError });
                }
                continue;
              }
            }
            try {
              await sendLovableEmail(
                {
                  run_id: payload.run_id,
                  to: payload.to,
                  from: payload.from,
                  sender_domain: payload.sender_domain,
                  subject: payload.subject,
                  html: payload.html,
                  text: payload.text,
                  purpose: payload.purpose,
                  label: payload.label,
                  idempotency_key: payload.idempotency_key,
                  unsubscribe_token: payload.unsubscribe_token,
                  message_id: payload.message_id
                },
                { apiKey, sendUrl: process.env.LOVABLE_SEND_URL }
              );
              await supabase2.from("email_send_log").insert({
                message_id: payload.message_id,
                template_name: payload.label || queue,
                recipient_email: payload.to,
                status: "sent"
              });
              const { error: delError } = await supabase2.rpc("delete_email", {
                queue_name: queue,
                message_id: msg.msg_id
              });
              if (delError) {
                console.error("Failed to delete sent message from queue", { queue, msg_id: msg.msg_id, error: delError });
              }
              totalProcessed++;
            } catch (error) {
              const errorMsg = error instanceof Error ? error.message : String(error);
              console.error("Email send failed", {
                queue,
                msg_id: msg.msg_id,
                read_ct: msg.read_ct,
                failed_attempts: failedAttempts,
                error: errorMsg
              });
              if (isRateLimited(error)) {
                await supabase2.from("email_send_log").insert({
                  message_id: payload.message_id,
                  template_name: payload.label || queue,
                  recipient_email: payload.to,
                  status: "failed",
                  error_message: errorMsg.slice(0, 1e3)
                });
                const retryAfterSecs = getRetryAfterSeconds(error);
                await supabase2.from("email_send_state").update({
                  retry_after_until: new Date(
                    Date.now() + retryAfterSecs * 1e3
                  ).toISOString(),
                  updated_at: (/* @__PURE__ */ new Date()).toISOString()
                }).eq("id", 1);
                return Response.json({ processed: totalProcessed, stopped: "rate_limited" });
              }
              if (isForbidden(error)) {
                await moveToDlq(supabase2, queue, msg, errorMsg.slice(0, 1e3));
                return Response.json({ processed: totalProcessed, stopped: "forbidden" });
              }
              await supabase2.from("email_send_log").insert({
                message_id: payload.message_id,
                template_name: payload.label || queue,
                recipient_email: payload.to,
                status: "failed",
                error_message: errorMsg.slice(0, 1e3)
              });
              if (payload?.message_id && typeof payload.message_id === "string") {
                failedAttemptsByMessageId.set(payload.message_id, failedAttempts + 1);
              }
            }
            if (i < messages.length - 1) {
              await new Promise((r) => setTimeout(r, sendDelayMs));
            }
          }
        }
        return Response.json({ processed: totalProcessed });
      }
    }
  }
});
const Route$5 = createFileRoute()({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) {
          return Response.json(
            { error: "Server configuration error" },
            { status: 500 }
          );
        }
        const authHeader = request.headers.get("Authorization");
        const token = authHeader?.replace(/^Bearer\s+/i, "");
        if (token !== apiKey) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { render } = await import("../_libs/react-email__components.mjs");
        const templateNames = Object.keys(TEMPLATES);
        const results = [];
        for (const name of templateNames) {
          const entry = TEMPLATES[name];
          const displayName = entry.displayName || name;
          if (!entry.previewData) {
            results.push({
              templateName: name,
              displayName,
              subject: "",
              html: "",
              status: "preview_data_required"
            });
            continue;
          }
          try {
            const html = await render(
              reactExports.createElement(entry.component, entry.previewData)
            );
            const resolvedSubject = typeof entry.subject === "function" ? entry.subject(entry.previewData) : entry.subject;
            results.push({
              templateName: name,
              displayName,
              subject: resolvedSubject,
              html,
              status: "ready"
            });
          } catch (err) {
            console.error("Failed to render template for preview", {
              template: name,
              error: err
            });
            results.push({
              templateName: name,
              displayName,
              subject: "",
              html: "",
              status: "render_failed",
              errorMessage: err instanceof Error ? err.message : String(err)
            });
          }
        }
        return Response.json({ templates: results });
      }
    }
  }
});
const SITE_NAME = "everythinghappensqindiaserver4cored";
const SENDER_DOMAIN = "notify.mail.businesshelpservices.com";
const FROM_DOMAIN = "notify.mail.businesshelpservices.com";
function redactEmail(email) {
  if (!email) return "***";
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return "***";
  return `${localPart[0]}***@${domain}`;
}
function generateToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
const Route$4 = createFileRoute()({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabaseUrl = "https://epqxycwzreezbleqlgob.supabase.co";
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!supabaseServiceKey) {
          console.error("Missing required environment variables");
          return Response.json(
            { error: "Server configuration error" },
            { status: 500 }
          );
        }
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const token = authHeader.slice("Bearer ".length).trim();
        const supabase2 = createClient(supabaseUrl, supabaseServiceKey);
        const { data: { user }, error: authError } = await supabase2.auth.getUser(token);
        if (authError || !user) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        let templateName;
        let recipientEmail;
        let idempotencyKey;
        let messageId;
        let templateData = {};
        try {
          const body = await request.json();
          templateName = body.templateName || body.template_name;
          recipientEmail = body.recipientEmail || body.recipient_email;
          messageId = crypto.randomUUID();
          idempotencyKey = body.idempotencyKey || body.idempotency_key || messageId;
          if (body.templateData && typeof body.templateData === "object") {
            templateData = body.templateData;
          }
        } catch {
          return Response.json(
            { error: "Invalid JSON in request body" },
            { status: 400 }
          );
        }
        if (!templateName) {
          return Response.json(
            { error: "templateName is required" },
            { status: 400 }
          );
        }
        const template = TEMPLATES[templateName];
        if (!template) {
          console.error("Template not found in registry", { templateName });
          return Response.json(
            {
              error: `Template '${templateName}' not found. Available: ${Object.keys(TEMPLATES).join(", ")}`
            },
            { status: 404 }
          );
        }
        const effectiveRecipient = template.to || recipientEmail;
        if (!effectiveRecipient) {
          return Response.json(
            {
              error: "recipientEmail is required (unless the template defines a fixed recipient)"
            },
            { status: 400 }
          );
        }
        const { data: suppressed, error: suppressionError } = await supabase2.from("suppressed_emails").select("id").eq("email", effectiveRecipient.toLowerCase()).maybeSingle();
        if (suppressionError) {
          console.error("Suppression check failed — refusing to send", {
            error: suppressionError,
            recipient_redacted: redactEmail(effectiveRecipient)
          });
          return Response.json(
            { error: "Failed to verify suppression status" },
            { status: 500 }
          );
        }
        if (suppressed) {
          await supabase2.from("email_send_log").insert({
            message_id: messageId,
            template_name: templateName,
            recipient_email: effectiveRecipient,
            status: "suppressed"
          });
          console.log("Email suppressed", {
            templateName,
            recipient_redacted: redactEmail(effectiveRecipient)
          });
          return Response.json({ success: false, reason: "email_suppressed" });
        }
        const normalizedEmail = effectiveRecipient.toLowerCase();
        let unsubscribeToken;
        const { data: existingToken, error: tokenLookupError } = await supabase2.from("email_unsubscribe_tokens").select("token, used_at").eq("email", normalizedEmail).maybeSingle();
        if (tokenLookupError) {
          console.error("Token lookup failed", {
            error: tokenLookupError,
            email_redacted: redactEmail(normalizedEmail)
          });
          await supabase2.from("email_send_log").insert({
            message_id: messageId,
            template_name: templateName,
            recipient_email: effectiveRecipient,
            status: "failed",
            error_message: "Failed to look up unsubscribe token"
          });
          return Response.json(
            { error: "Failed to prepare email" },
            { status: 500 }
          );
        }
        if (existingToken && !existingToken.used_at) {
          unsubscribeToken = existingToken.token;
        } else if (!existingToken) {
          unsubscribeToken = generateToken();
          const { error: tokenError } = await supabase2.from("email_unsubscribe_tokens").upsert(
            { token: unsubscribeToken, email: normalizedEmail },
            { onConflict: "email", ignoreDuplicates: true }
          );
          if (tokenError) {
            console.error("Failed to create unsubscribe token", {
              error: tokenError
            });
            await supabase2.from("email_send_log").insert({
              message_id: messageId,
              template_name: templateName,
              recipient_email: effectiveRecipient,
              status: "failed",
              error_message: "Failed to create unsubscribe token"
            });
            return Response.json(
              { error: "Failed to prepare email" },
              { status: 500 }
            );
          }
          const { data: storedToken, error: reReadError } = await supabase2.from("email_unsubscribe_tokens").select("token").eq("email", normalizedEmail).maybeSingle();
          if (reReadError || !storedToken) {
            console.error("Failed to read back unsubscribe token after upsert", {
              error: reReadError,
              email_redacted: redactEmail(normalizedEmail)
            });
            await supabase2.from("email_send_log").insert({
              message_id: messageId,
              template_name: templateName,
              recipient_email: effectiveRecipient,
              status: "failed",
              error_message: "Failed to confirm unsubscribe token storage"
            });
            return Response.json(
              { error: "Failed to prepare email" },
              { status: 500 }
            );
          }
          unsubscribeToken = storedToken.token;
        } else {
          console.warn("Unsubscribe token already used but email not suppressed", {
            email_redacted: redactEmail(normalizedEmail)
          });
          await supabase2.from("email_send_log").insert({
            message_id: messageId,
            template_name: templateName,
            recipient_email: effectiveRecipient,
            status: "suppressed",
            error_message: "Unsubscribe token used but email missing from suppressed list"
          });
          return Response.json({ success: false, reason: "email_suppressed" });
        }
        const { render } = await import("../_libs/react-email__components.mjs");
        const element = reactExports.createElement(template.component, templateData);
        const html = await render(element);
        const plainText = await render(element, { plainText: true });
        const resolvedSubject = typeof template.subject === "function" ? template.subject(templateData) : template.subject;
        await supabase2.from("email_send_log").insert({
          message_id: messageId,
          template_name: templateName,
          recipient_email: effectiveRecipient,
          status: "pending"
        });
        const { error: enqueueError } = await supabase2.rpc("enqueue_email", {
          queue_name: "transactional_emails",
          payload: {
            message_id: messageId,
            to: effectiveRecipient,
            from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
            sender_domain: SENDER_DOMAIN,
            subject: resolvedSubject,
            html,
            text: plainText,
            purpose: "transactional",
            label: templateName,
            idempotency_key: idempotencyKey,
            unsubscribe_token: unsubscribeToken,
            queued_at: (/* @__PURE__ */ new Date()).toISOString()
          }
        });
        if (enqueueError) {
          console.error("Failed to enqueue email", {
            error: enqueueError,
            templateName,
            recipient_redacted: redactEmail(effectiveRecipient)
          });
          await supabase2.from("email_send_log").insert({
            message_id: messageId,
            template_name: templateName,
            recipient_email: effectiveRecipient,
            status: "failed",
            error_message: "Failed to enqueue email"
          });
          return Response.json(
            { error: "Failed to enqueue email" },
            { status: 500 }
          );
        }
        console.log("Transactional email enqueued", {
          templateName,
          recipient_redacted: redactEmail(effectiveRecipient)
        });
        return Response.json({ success: true, queued: true });
      }
    }
  }
});
const headers = { "Content-Type": "application/json", "Cache-Control": "no-store" };
const RANK = { ringing: 0, answered: 1, ended: 2, missed: 2 };
const json = (b, status = 200) => new Response(JSON.stringify(b), { status, headers });
const ts = (v) => {
  if (!v) return null;
  const d = /* @__PURE__ */ new Date(v.replace(/n(?=\d{2}:)/, " ").replace(" ", "T") + "+05:30");
  return isNaN(d.getTime()) ? null : d.toISOString();
};
async function handle(request) {
  const cd = await import("./callerdesk.server-CUv6QXrh.mjs");
  if (!cd.verifyCallerDesk(request)) return json({ error: "unauthorized" }, 401);
  let input;
  try {
    const url2 = new URL(request.url);
    input = Object.fromEntries(url2.searchParams);
    delete input.token;
    if (request.method === "POST") {
      const raw = await request.text();
      if (raw.length > 2e4) return json({ ok: false, error: "payload_too_large" }, 413);
      const ct = request.headers.get("content-type") ?? "";
      const parsed = ct.includes("json") ? raw ? JSON.parse(raw) : {} : Object.fromEntries(new URLSearchParams(raw));
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return json({ ok: false, error: "malformed_payload" }, 400);
      input = { ...input, ...parsed };
      delete input.token;
    }
  } catch {
    return json({ ok: false, error: "malformed_payload" }, 400);
  }
  try {
    const { normalizeIndianMobile, dbLookup } = await import("./phone.server-hLkvO94r.mjs");
    const { pick: pick2 } = cd;
    const sid = cd.callSid(input);
    const campid = cd.campaignId(input);
    if (!sid && !campid) return json({ ok: false, error: "missing_call_id" }, 400);
    const direction = cd.callerDeskDirection(input);
    console.log(JSON.stringify({ event: "callerdesk_event_type", type: String(cd.pick(input, "type", "Type") ?? "none").slice(0, 20) }));
    const outbound = direction === "outbound";
    const status = cd.mapCallerDeskStatus(input);
    console.log(JSON.stringify({ event: "callerdesk_call_event", status, outbound, has_sid: !!sid, has_camp: !!campid, fields: Object.keys(input).sort() }));
    const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
    const db = supabaseAdmin;
    let existing = null;
    if (sid) ({ data: existing } = await db.from("telephony_calls").select("*").eq("call_id", sid).maybeSingle());
    if (!existing && campid) {
      ({ data: existing } = await db.from("telephony_calls").select("*").eq("provider", "callerdesk").or(`ref_id.eq.${campid},call_id.eq.${campid}`).order("started_at", { ascending: false }).limit(1).maybeSingle());
    }
    if (!existing && direction === "outbound") {
      const customer = normalizeIndianMobile(pick2(input, "DestinationNumber", "DialWhomNumber"));
      if (customer) {
        const since = new Date(Date.now() - cd.WEBRTC_MATCH_WINDOW_MS).toISOString();
        const { data: cands } = await db.from("telephony_calls").select("*").eq("provider", "callerdesk").like("call_id", "webrtc:%").is("provider_uuid", null).eq("called_number", customer).gte("started_at", since).limit(3);
        existing = cd.pickWebRtcCandidate(cands ?? []);
      }
    }
    if (!existing && direction === "inbound") {
      const customer = normalizeIndianMobile(pick2(input, "SourceNumber"));
      if (customer) {
        const since = new Date(Date.now() - cd.WEBRTC_MATCH_WINDOW_MS).toISOString();
        const { data: cands } = await db.from("telephony_calls").select("*").eq("provider", "callerdesk").eq("direction", "inbound").like("call_id", "webrtc:in:%").is("provider_uuid", null).eq("caller_number", customer).gte("started_at", since).limit(3);
        existing = cd.pickWebRtcCandidate(cands ?? []);
      }
    }
    if (!existing && !direction) return json({ ok: false, error: "unknown_direction" }, 400);
    if (existing && (RANK[existing.status] ?? -1) >= RANK[status]) {
      const enrich = status === "ended" || status === "missed" ? cd.reportEnrichment(existing, input) : {};
      if (sid && String(existing.call_id).startsWith("webrtc:") && !existing.provider_uuid) {
        enrich.provider_uuid = sid;
        const { data: clash } = await db.from("telephony_calls").select("id").eq("call_id", sid).maybeSingle();
        if (!clash) enrich.call_id = sid;
      }
      if (!Object.keys(enrich).length) return json({ ok: true, duplicate: true });
      const { error: error2 } = await db.from("telephony_calls").update({ ...enrich, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", existing.id);
      if (error2) throw error2;
      return json({ ok: true, enriched: Object.keys(enrich) });
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const row = { status, last_event: status, updated_at: now };
    if (sid && (!existing || existing.call_id !== sid)) {
      const { data: clash } = await db.from("telephony_calls").select("id").eq("call_id", sid).maybeSingle();
      if (!clash) row.call_id = sid;
      row.provider_uuid = sid;
    }
    if (!existing) {
      const customerRaw = outbound ? pick2(input, "DestinationNumber", "DialWhomNumber") : pick2(input, "SourceNumber");
      const mobile = normalizeIndianMobile(customerRaw);
      Object.assign(row, {
        provider: "callerdesk",
        direction,
        ref_id: campid,
        caller_number: outbound ? pick2(input, "SourceNumber") : mobile ?? customerRaw,
        called_number: outbound ? mobile ?? customerRaw : pick2(input, "DestinationNumber"),
        started_at: ts(pick2(input, "StartTime")) ?? now
      });
      if (!row.call_id) row.call_id = campid ?? sid;
      if (mobile) {
        try {
          const m = await dbLookup(mobile);
          Object.assign(row, { customer_id: m.customerId, lead_id: m.leadId, application_id: m.applicationId });
          if (outbound) row.employee_id = m.employeeId;
        } catch {
        }
      }
    }
    const agent = normalizeIndianMobile(pick2(input, "DialWhomNumber"));
    const agentEmail = pick2(input, "agent_email", "AgentEmail")?.trim().toLowerCase() ?? null;
    if ((existing?.direction ?? direction) === "inbound") {
      let pid = null;
      if (agent) {
        row.agent_id = agent;
        const { data: p } = await db.from("profiles").select("id").ilike("mobile", `%${agent}`).limit(1).maybeSingle();
        pid = p?.id ?? null;
      }
      if (!pid && agent) {
        const { data: accs } = await db.from("employee_telephony_accounts").select("employee_id").eq("provider", "callerdesk").eq("status", "active").ilike("sip_username", `%${agent}`).limit(2);
        if (accs?.length === 1) pid = accs[0].employee_id;
      }
      if (!pid && agentEmail && /^[^\s@]+@[^\s@]+$/.test(agentEmail)) {
        const { data: p } = await db.from("profiles").select("id").eq("email", agentEmail).limit(2);
        if (p?.length === 1) pid = p[0].id;
      }
      if (pid) row.employee_id = pid;
      console.log(JSON.stringify({ event: "callerdesk_agent_match", by: pid ? agent && !agentEmail ? "mobile" : "mobile_or_email" : "none", has_agent_email: !!agentEmail }));
    }
    if ((status === "answered" || status === "ended") && !existing?.answered_at) {
      const answeredAt = ts(pick2(input, "LegB_Picked_time"));
      if (answeredAt || status === "answered") row.answered_at = answeredAt ?? now;
    }
    if (status === "ended" || status === "missed") {
      Object.assign(row, cd.reportEnrichment(existing ?? {}, input));
      if (!row.ended_at && !existing?.ended_at) row.ended_at = now;
    }
    const { error } = existing ? await db.from("telephony_calls").update(row).eq("id", existing.id) : await db.from("telephony_calls").upsert(row, { onConflict: "call_id" });
    if (error) throw error;
    return json({ ok: true });
  } catch (e) {
    console.log(JSON.stringify({ event: "callerdesk_call_event", error: e?.message }));
    return json({ ok: false, error: "processing_failed" }, 500);
  }
}
const Route$3 = createFileRoute()({
  server: { handlers: { POST: ({ request }) => handle(request), GET: ({ request }) => handle(request) } }
});
const Schema$1 = object({
  lead_code: string().trim().min(3).max(80),
  checkout_token: string().trim().min(10).max(600)
});
const Route$2 = createFileRoute()({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        const g = await import("./guard.server-DxovqIcG.mjs");
        const { origin } = await g.resolveCallerWebsite(request);
        return g.preflight(origin, "POST");
      },
      POST: async ({ request }) => {
        const g = await import("./guard.server-DxovqIcG.mjs");
        const { website, origin } = await g.resolveCallerWebsite(request);
        if (!website) {
          return g.jsonError(403, "ORIGIN_NOT_ALLOWED", "This origin is not authorised.", null);
        }
        if (!g.rateLimit(g.clientKey(request, "summary"), 60, 6e4)) {
          return g.jsonError(429, "RATE_LIMITED", "Too many requests. Please slow down.", origin);
        }
        let input;
        try {
          input = Schema$1.parse(await request.json());
        } catch {
          return g.jsonError(400, "VALIDATION_FAILED", "Invalid request.", origin);
        }
        const claims = await g.verifyCheckoutToken(input.checkout_token, input.lead_code);
        if (!claims) {
          return g.jsonError(401, "INVALID_TOKEN", "This checkout session has expired.", origin);
        }
        try {
          const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
          const { data: lead } = await supabaseAdmin.from("leads").select(
            "id, lead_code, name, email, mobile, state, service, service_id, base_amount, gst_amount, total_amount, status, lead_status_v2, website_id"
          ).eq("lead_code", input.lead_code).maybeSingle();
          if (!lead || lead.website_id !== claims.w) {
            return g.jsonError(404, "NOT_FOUND", "Application not found.", origin);
          }
          const { data: pendingLink } = await supabaseAdmin.from("payment_links").select("amount").eq("lead_id", lead.id).eq("status", "pending").order("created_at", { ascending: false }).limit(1).maybeSingle();
          const pendingAmount = Number(pendingLink?.amount ?? 0);
          const hasPendingLink = pendingAmount > 0;
          const { data: paid } = await supabaseAdmin.from("payments").select("id").eq("lead_id", lead.id).eq("status", "paid").limit(1).maybeSingle();
          const awaitingTopUp = hasPendingLink || lead.status === "payment_pending" || lead.lead_status_v2 === "payment_pending";
          const isPaid = !!paid && !awaitingTopUp;
          const totalAmount = hasPendingLink ? pendingAmount : Number(lead.total_amount ?? 0);
          const baseAmount = hasPendingLink ? Math.round(totalAmount / 1.18 * 100) / 100 : Number(lead.base_amount ?? 0);
          const gstAmount = hasPendingLink ? Math.round((totalAmount - baseAmount) * 100) / 100 : Number(lead.gst_amount ?? 0);
          const { data: gateways } = await supabaseAdmin.from("payment_gateways").select("name, display_name, config, priority").eq("is_enabled", true).order("priority", { ascending: true });
          const { applyWebsiteGateways } = await import("./website-gateways-jUN09uZm.mjs");
          const { websiteGatewayRules } = await import("./website-gateways.server-BkGrEQ88.mjs");
          const siteList = applyWebsiteGateways(
            (gateways ?? []).map((row) => ({ row, name: String(row.name), isDefault: Boolean(row.config?.is_default) })),
            await websiteGatewayRules(lead.website_id)
          );
          const gatewayList = siteList.map(({ row, isDefault }) => {
            const config = row.config ?? {};
            return {
              code: row.name,
              name: row.display_name,
              description: config.description ?? null,
              logo_url: config.logo_url ?? null,
              is_default: isDefault
            };
          });
          const { data: siteRow } = await supabaseAdmin.from("websites").select("payments_enabled").eq("id", lead.website_id).maybeSingle();
          return g.jsonOk(
            {
              payments_enabled: siteRow?.payments_enabled !== false,
              lead: {
                lead_code: lead.lead_code,
                // Masked — enough for the customer to recognise their own
                // application, useless to anyone guessing lead codes.
                name_masked: g.maskName(lead.name),
                email_masked: g.maskEmail(lead.email),
                mobile_masked: g.maskMobile(lead.mobile),
                state: lead.state,
                service_name: lead.service,
                status: lead.status,
                is_paid: isPaid
              },
              pricing: {
                base_amount: baseAmount,
                gst_amount: gstAmount,
                total_amount: totalAmount,
                is_top_up: hasPendingLink,
                currency: "INR"
              },
              gateways: gatewayList,
              default_gateway: gatewayList.find((x) => x.is_default)?.code ?? gatewayList[0]?.code ?? null
            },
            origin
          );
        } catch (e) {
          console.error("[api/v1/applications/summary]", e);
          return g.jsonError(500, "SERVER_ERROR", "Could not load this application.", origin);
        }
      }
    }
  }
});
const Schema = object({
  lead_code: string().trim().min(3).max(80),
  checkout_token: string().trim().min(10).max(600),
  gateway_code: string().trim().min(2).max(40).optional()
});
const Route$1 = createFileRoute()({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        const g = await import("./guard.server-DxovqIcG.mjs");
        const { origin } = await g.resolveCallerWebsite(request);
        return g.preflight(origin, "POST");
      },
      POST: async ({ request }) => {
        const g = await import("./guard.server-DxovqIcG.mjs");
        const { website, origin } = await g.resolveCallerWebsite(request);
        if (!website) {
          return g.jsonError(403, "ORIGIN_NOT_ALLOWED", "This origin is not authorised.", null);
        }
        if (!g.rateLimit(g.clientKey(request, "initiate"), 20, 6e4)) {
          return g.jsonError(429, "RATE_LIMITED", "Too many attempts. Please wait a moment.", origin);
        }
        let input;
        try {
          input = Schema.parse(await request.json());
        } catch {
          return g.jsonError(400, "VALIDATION_FAILED", "Invalid request.", origin);
        }
        const claims = await g.verifyCheckoutToken(input.checkout_token, input.lead_code);
        if (!claims) {
          return g.jsonError(401, "INVALID_TOKEN", "This checkout session has expired.", origin);
        }
        try {
          const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
          const { data: lead } = await supabaseAdmin.from("leads").select("id, lead_code, website_id").eq("lead_code", input.lead_code).maybeSingle();
          if (!lead || lead.website_id !== claims.w) {
            return g.jsonError(404, "NOT_FOUND", "Application not found.", origin);
          }
          const { data: siteRow } = await supabaseAdmin.from("websites").select("payments_enabled").eq("id", lead.website_id).maybeSingle();
          if (siteRow && siteRow.payments_enabled === false) {
            return g.jsonError(403, "PAYMENTS_DISABLED", "Payments are currently not being accepted on this website.", origin);
          }
          let chosen = (input.gateway_code ?? "").trim().toLowerCase();
          if (!chosen) {
            const { data: gws } = await supabaseAdmin.from("payment_gateways").select("name, config").eq("is_enabled", true).order("priority", { ascending: true });
            const { applyWebsiteGateways } = await import("./website-gateways-jUN09uZm.mjs");
            const { websiteGatewayRules } = await import("./website-gateways.server-BkGrEQ88.mjs");
            const site = applyWebsiteGateways((gws ?? []).map((x) => ({ name: String(x.name), isDefault: Boolean(x.config?.is_default) })), await websiteGatewayRules(lead.website_id));
            const gw = site.find((x) => x.isDefault) ?? null;
            if (!gw?.name) {
              return g.jsonError(503, "NO_GATEWAY", "No payment option is currently available.", origin);
            }
            chosen = String(gw.name).toLowerCase();
          }
          if (chosen.includes("cashfree")) chosen = "cashfree";
          else if (chosen.includes("payu")) chosen = "payu";
          else if (chosen.includes("ccavenue")) chosen = "ccavenue";
          const { data: enabled } = await supabaseAdmin.from("payment_gateways").select("name").eq("name", chosen).eq("is_enabled", true).maybeSingle();
          if (!enabled) {
            return g.jsonError(400, "GATEWAY_UNAVAILABLE", "That payment option is not available.", origin);
          }
          if (chosen === "payu") {
            const { buildPayUOrder } = await import("./payu-order.server-B8pgZD7o.mjs");
            const order = await buildPayUOrder(input.lead_code);
            return g.jsonOk(
              {
                gateway: "payu",
                mode: "form_post",
                payment_id: order.paymentId,
                action_url: order.actionUrl,
                method: "POST",
                fields: order.fields,
                amount: order.totalAmount
              },
              origin
            );
          }
          if (chosen === "ccavenue") {
            const { buildCcavenueOrderForLead } = await import("./ccavenue-order.server-ChP8K_DF.mjs");
            const order = await buildCcavenueOrderForLead(input.lead_code);
            return g.jsonOk(
              {
                gateway: "ccavenue",
                mode: "form_post",
                payment_id: order.paymentId,
                action_url: order.actionUrl,
                method: "POST",
                fields: order.fields,
                amount: order.totalAmount
              },
              origin
            );
          }
          if (chosen === "cashfree") {
            const { buildCashfreeOrder } = await import("./cashfree-order.server-CW9tOEeO.mjs");
            const access = await import("./customer-access.server-C_oBiISE.mjs");
            const returnNonce2 = access.newReturnNonce();
            const order = await buildCashfreeOrder(input.lead_code, returnNonce2);
            await access.saveReturnContext(order.paymentId, access.normalizeReturnOrigin(origin), returnNonce2);
            return g.jsonOk(
              {
                gateway: "cashfree",
                mode: "sdk",
                payment_id: order.paymentId,
                payment_session_id: order.paymentSessionId ?? null,
                is_prod: order.isProd ?? false,
                amount: order.totalAmount
              },
              origin
            );
          }
          return g.jsonError(400, "GATEWAY_UNAVAILABLE", "That payment option is not available.", origin);
        } catch (e) {
          const message = e instanceof Error ? e.message : "Could not start the payment.";
          const safe = /already been paid|disabled|not found|not available/i.test(message);
          if (!safe) console.error("[api/v1/payments/initiate]", e);
          return g.jsonError(
            safe ? 400 : 500,
            safe ? "NOT_ALLOWED" : "SERVER_ERROR",
            safe ? message : "Could not start the payment. Please try again.",
            origin
          );
        }
      }
    }
  }
});
const Route = createFileRoute()({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        const g = await import("./guard.server-DxovqIcG.mjs");
        const { origin } = await g.resolveCallerWebsite(request);
        return g.preflight(origin, "GET");
      },
      GET: async ({ request, params }) => {
        const g = await import("./guard.server-DxovqIcG.mjs");
        const { website, origin } = await g.resolveCallerWebsite(request);
        if (!website) {
          return g.jsonError(403, "ORIGIN_NOT_ALLOWED", "This origin is not authorised.", null, "GET");
        }
        if (!g.rateLimit(g.clientKey(request, "status"), 120, 6e4)) {
          return g.jsonError(429, "RATE_LIMITED", "Too many requests.", origin, "GET");
        }
        const leadCode = String(params.leadCode ?? "").trim();
        const token = new URL(request.url).searchParams.get("token");
        if (!leadCode || leadCode.length > 80) {
          return g.jsonError(400, "VALIDATION_FAILED", "Invalid reference.", origin, "GET");
        }
        const claims = await g.verifyCheckoutToken(token, leadCode);
        if (!claims) {
          return g.jsonError(401, "INVALID_TOKEN", "This session has expired.", origin, "GET");
        }
        try {
          const { supabaseAdmin } = await import("./client.server-3kDCe7R3.mjs");
          const { data: lead } = await supabaseAdmin.from("leads").select("id, lead_code, status, website_id").eq("lead_code", leadCode).maybeSingle();
          if (!lead || lead.website_id !== claims.w) {
            return g.jsonError(404, "NOT_FOUND", "Application not found.", origin, "GET");
          }
          const { data: payment } = await supabaseAdmin.from("payments").select("status, gateway_name, amount, payment_date").eq("lead_id", lead.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
          const { data: application } = await supabaseAdmin.from("applications").select("application_code").eq("lead_id", lead.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
          const isPaid = payment?.status === "paid";
          let nextUrl = `/payment/${lead.lead_code}`;
          if (isPaid) {
            const { issueCustomerToken } = await import("./customer-access.server-C_oBiISE.mjs");
            nextUrl = `/onboarding/${lead.lead_code}#t=${await issueCustomerToken(lead.id, "ob", { reason: "api_v1_paid" })}`;
          }
          return g.jsonOk(
            {
              lead_code: lead.lead_code,
              is_paid: isPaid,
              status: lead.status,
              payment_status: payment?.status ?? "none",
              gateway: payment?.gateway_name ?? null,
              amount: payment?.amount ? Number(payment.amount) : null,
              paid_at: payment?.payment_date ?? null,
              order_code: application?.application_code ?? null,
              next_url: nextUrl
            },
            origin,
            "GET"
          );
        } catch (e) {
          console.error("[api/v1/payments/status]", e);
          return g.jsonError(500, "SERVER_ERROR", "Could not check the payment status.", origin, "GET");
        }
      }
    }
  }
});
const IndexRoute = Route$2y.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$2z
});
const SplatRoute = Route$2x.update({
  id: "/$",
  path: "/$",
  getParentRoute: () => Route$2z
});
const AboutRoute = Route$2w.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$2z
});
const AboutUsRoute = Route$2v.update({
  id: "/about-us",
  path: "/about-us",
  getParentRoute: () => Route$2z
});
const AdminRoute = Route$2u.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$2z
});
const AdminLoginRoute = Route$2t.update({
  id: "/admin-login",
  path: "/admin-login",
  getParentRoute: () => Route$2z
});
const AmlAntiFraudPolicyRoute = Route$2s.update({
  id: "/aml-anti-fraud-policy",
  path: "/aml-anti-fraud-policy",
  getParentRoute: () => Route$2z
});
const ComplaintRoute = Route$2r.update({
  id: "/complaint",
  path: "/complaint",
  getParentRoute: () => Route$2z
});
const ComplaintGrievancePolicyRoute = Route$2q.update({
  id: "/complaint-grievance-policy",
  path: "/complaint-grievance-policy",
  getParentRoute: () => Route$2z
});
const ComplianceStatementRoute = Route$2p.update({
  id: "/compliance-statement",
  path: "/compliance-statement",
  getParentRoute: () => Route$2z
});
const ConsentAcknowledgmentRoute = Route$2o.update({
  id: "/consent-acknowledgment",
  path: "/consent-acknowledgment",
  getParentRoute: () => Route$2z
});
const ContactRoute = Route$2n.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$2z
});
const ContactUsRoute = Route$2m.update({
  id: "/contact-us",
  path: "/contact-us",
  getParentRoute: () => Route$2z
});
const CookiePolicyRoute = Route$2l.update({
  id: "/cookie-policy",
  path: "/cookie-policy",
  getParentRoute: () => Route$2z
});
const DisclaimerRoute = Route$2k.update({
  id: "/disclaimer",
  path: "/disclaimer",
  getParentRoute: () => Route$2z
});
const DownloadUdyamCertificateRoute = Route$2j.update({
  id: "/download-udyam-certificate",
  path: "/download-udyam-certificate",
  getParentRoute: () => Route$2z
});
const GrievanceRedressalPolicyRoute = Route$2i.update({
  id: "/grievance-redressal-policy",
  path: "/grievance-redressal-policy",
  getParentRoute: () => Route$2z
});
const ImportantNoticeRoute = Route$2h.update({
  id: "/important-notice",
  path: "/important-notice",
  getParentRoute: () => Route$2z
});
const IndexDothtmlRoute = Route$2g.update({
  id: "/index.html",
  path: "/index.html",
  getParentRoute: () => Route$2z
});
const LlmsFullDottxtRoute = Route$2f.update({
  id: "/llms-full.txt",
  path: "/llms-full.txt",
  getParentRoute: () => Route$2z
});
const LlmsDottxtRoute = Route$2e.update({
  id: "/llms.txt",
  path: "/llms.txt",
  getParentRoute: () => Route$2z
});
const McpRoute = Route$2d.update({
  id: "/mcp",
  path: "/mcp",
  getParentRoute: () => Route$2z
});
const MigrateUdyogAadhaarToUdyamRoute = Route$2c.update({
  id: "/migrate-udyog-aadhaar-to-udyam",
  path: "/migrate-udyog-aadhaar-to-udyam",
  getParentRoute: () => Route$2z
});
const MsmeRegistrationFeeRoute = Route$2b.update({
  id: "/msme-registration-fee",
  path: "/msme-registration-fee",
  getParentRoute: () => Route$2z
});
const NewUdyamRegistrationRoute = Route$2a.update({
  id: "/new-udyam-registration",
  path: "/new-udyam-registration",
  getParentRoute: () => Route$2z
});
const NoticeRoute = Route$29.update({
  id: "/notice",
  path: "/notice",
  getParentRoute: () => Route$2z
});
const OtherProblemRoute = Route$28.update({
  id: "/other-problem",
  path: "/other-problem",
  getParentRoute: () => Route$2z
});
const PaymentNoticeRoute = Route$27.update({
  id: "/payment-notice",
  path: "/payment-notice",
  getParentRoute: () => Route$2z
});
const PaymentNoticeServiceAcknowledgmentRoute = Route$26.update({
  id: "/payment-notice-service-acknowledgment",
  path: "/payment-notice-service-acknowledgment",
  getParentRoute: () => Route$2z
});
const PricingTransparencyRoute = Route$25.update({
  id: "/pricing-transparency",
  path: "/pricing-transparency",
  getParentRoute: () => Route$2z
});
const PrivacyPolicyRoute = Route$24.update({
  id: "/privacy-policy",
  path: "/privacy-policy",
  getParentRoute: () => Route$2z
});
const RefundCancellationPolicyRoute = Route$23.update({
  id: "/refund-cancellation-policy",
  path: "/refund-cancellation-policy",
  getParentRoute: () => Route$2z
});
const RobotsDottxtRoute = Route$22.update({
  id: "/robots.txt",
  path: "/robots.txt",
  getParentRoute: () => Route$2z
});
const SeoAdminRoute = Route$21.update({
  id: "/seo-admin",
  path: "/seo-admin",
  getParentRoute: () => Route$2z
});
const ServiceDeliveryPolicyRoute = Route$20.update({
  id: "/service-delivery-policy",
  path: "/service-delivery-policy",
  getParentRoute: () => Route$2z
});
const SitemapDotxmlRoute = Route$1$.update({
  id: "/sitemap.xml",
  path: "/sitemap.xml",
  getParentRoute: () => Route$2z
});
const TalkToExpertRoute = Route$1_.update({
  id: "/talk-to-expert",
  path: "/talk-to-expert",
  getParentRoute: () => Route$2z
});
const TermsConditionsRoute = Route$1Z.update({
  id: "/terms-conditions",
  path: "/terms-conditions",
  getParentRoute: () => Route$2z
});
const UnauthorizedRoute = Route$1Y.update({
  id: "/unauthorized",
  path: "/unauthorized",
  getParentRoute: () => Route$2z
});
const UpdateUdyamCertificateRoute = Route$1X.update({
  id: "/update-udyam-certificate",
  path: "/update-udyam-certificate",
  getParentRoute: () => Route$2z
});
const VerifyUdyamCertificateRoute = Route$1W.update({
  id: "/verify-udyam-certificate",
  path: "/verify-udyam-certificate",
  getParentRoute: () => Route$2z
});
const Char91DotmcpChar93ListToolsRoute = Route$1V.update({
  id: "/.mcp/list-tools",
  path: "/.mcp/list-tools",
  getParentRoute: () => Route$2z
});
const Char91DotwellKnownChar93OauthProtectedResourceRoute = Route$1U.update({
  id: "/.well-known/oauth-protected-resource",
  path: "/.well-known/oauth-protected-resource",
  getParentRoute: () => Route$2z
});
const AdminIndexRoute = Route$1T.update({
  id: "/",
  path: "/",
  getParentRoute: () => AdminRoute
});
const AdminActivityRoute = Route$1S.update({
  id: "/activity",
  path: "/activity",
  getParentRoute: () => AdminRoute
});
const AdminApplicationsRoute = Route$1R.update({
  id: "/applications",
  path: "/applications",
  getParentRoute: () => AdminRoute
});
const AdminAssignmentHistoryRoute = Route$1Q.update({
  id: "/assignment-history",
  path: "/assignment-history",
  getParentRoute: () => AdminRoute
});
const AdminAttendanceRoute = Route$1P.update({
  id: "/attendance",
  path: "/attendance",
  getParentRoute: () => AdminRoute
});
const AdminAuditRoute = Route$1O.update({
  id: "/audit",
  path: "/audit",
  getParentRoute: () => AdminRoute
});
const AdminCannedResponsesRoute = Route$1N.update({
  id: "/canned-responses",
  path: "/canned-responses",
  getParentRoute: () => AdminRoute
});
const AdminCertificatesRoute = Route$1M.update({
  id: "/certificates",
  path: "/certificates",
  getParentRoute: () => AdminRoute
});
const AdminComplaintsRoute = Route$1L.update({
  id: "/complaints",
  path: "/complaints",
  getParentRoute: () => AdminRoute
});
const AdminCustomersRoute = Route$1K.update({
  id: "/customers",
  path: "/customers",
  getParentRoute: () => AdminRoute
});
const AdminDashboardRoute = Route$1J.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AdminRoute
});
const AdminDisputeManagerRoute = Route$1I.update({
  id: "/dispute-manager",
  path: "/dispute-manager",
  getParentRoute: () => AdminRoute
});
const AdminDocumentsRoute = Route$1H.update({
  id: "/documents",
  path: "/documents",
  getParentRoute: () => AdminRoute
});
const AdminEmailTemplatesRoute = Route$1G.update({
  id: "/email-templates",
  path: "/email-templates",
  getParentRoute: () => AdminRoute
});
const AdminEmailsRoute = Route$1F.update({
  id: "/emails",
  path: "/emails",
  getParentRoute: () => AdminRoute
});
const AdminEmployeesRoute = Route$1E.update({
  id: "/employees",
  path: "/employees",
  getParentRoute: () => AdminRoute
});
const AdminFinanceRoute = Route$1D.update({
  id: "/finance",
  path: "/finance",
  getParentRoute: () => AdminRoute
});
const AdminGatewaysRoute = Route$1C.update({
  id: "/gateways",
  path: "/gateways",
  getParentRoute: () => AdminRoute
});
const AdminInboxManagementRoute = Route$1B.update({
  id: "/inbox-management",
  path: "/inbox-management",
  getParentRoute: () => AdminRoute
});
const AdminInvoicesRoute = Route$1A.update({
  id: "/invoices",
  path: "/invoices",
  getParentRoute: () => AdminRoute
});
const AdminLeadsRoute = Route$1z.update({
  id: "/leads",
  path: "/leads",
  getParentRoute: () => AdminRoute
});
const AdminLiveCallsRoute = Route$1y.update({
  id: "/live-calls",
  path: "/live-calls",
  getParentRoute: () => AdminRoute
});
const AdminMyPerformanceRoute = Route$1x.update({
  id: "/my-performance",
  path: "/my-performance",
  getParentRoute: () => AdminRoute
});
const AdminMyWorkRoute = Route$1w.update({
  id: "/my-work",
  path: "/my-work",
  getParentRoute: () => AdminRoute
});
const AdminNotificationsRoute = Route$1v.update({
  id: "/notifications",
  path: "/notifications",
  getParentRoute: () => AdminRoute
});
const AdminOrdersRoute = Route$1u.update({
  id: "/orders",
  path: "/orders",
  getParentRoute: () => AdminRoute
});
const AdminPaymentAuditRoute = Route$1t.update({
  id: "/payment-audit",
  path: "/payment-audit",
  getParentRoute: () => AdminRoute
});
const AdminPaymentsRoute = Route$1s.update({
  id: "/payments",
  path: "/payments",
  getParentRoute: () => AdminRoute
});
const AdminPerformanceRoute = Route$1r.update({
  id: "/performance",
  path: "/performance",
  getParentRoute: () => AdminRoute
});
const AdminPermissionsRoute = Route$1q.update({
  id: "/permissions",
  path: "/permissions",
  getParentRoute: () => AdminRoute
});
const AdminPipelineRoute = Route$1p.update({
  id: "/pipeline",
  path: "/pipeline",
  getParentRoute: () => AdminRoute
});
const AdminQuarantineRoute = Route$1o.update({
  id: "/quarantine",
  path: "/quarantine",
  getParentRoute: () => AdminRoute
});
const AdminRefundsRoute = Route$1n.update({
  id: "/refunds",
  path: "/refunds",
  getParentRoute: () => AdminRoute
});
const AdminReportsRoute = Route$1m.update({
  id: "/reports",
  path: "/reports",
  getParentRoute: () => AdminRoute
});
const AdminReviewRoute = Route$1l.update({
  id: "/review",
  path: "/review",
  getParentRoute: () => AdminRoute
});
const AdminSeoRoute = Route$1k.update({
  id: "/seo",
  path: "/seo",
  getParentRoute: () => AdminRoute
});
const AdminServicesRoute = Route$1j.update({
  id: "/services",
  path: "/services",
  getParentRoute: () => AdminRoute
});
const AdminSessionsRoute = Route$1i.update({
  id: "/sessions",
  path: "/sessions",
  getParentRoute: () => AdminRoute
});
const AdminSettingsRoute = Route$1h.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => AdminRoute
});
const AdminSubmissionsRoute = Route$1g.update({
  id: "/submissions",
  path: "/submissions",
  getParentRoute: () => AdminRoute
});
const AdminSuperRoute = Route$1f.update({
  id: "/super",
  path: "/super",
  getParentRoute: () => AdminRoute
});
const AdminTasksRoute = Route$1e.update({
  id: "/tasks",
  path: "/tasks",
  getParentRoute: () => AdminRoute
});
const AdminTeamOrdersRoute = Route$1d.update({
  id: "/team-orders",
  path: "/team-orders",
  getParentRoute: () => AdminRoute
});
const AdminTrainingRoute = Route$1c.update({
  id: "/training",
  path: "/training",
  getParentRoute: () => AdminRoute
});
const AdminUsersRoute = Route$1b.update({
  id: "/users",
  path: "/users",
  getParentRoute: () => AdminRoute
});
const AdminWebsitesRoute = Route$1a.update({
  id: "/websites",
  path: "/websites",
  getParentRoute: () => AdminRoute
});
const AdminWhatsappTemplatesRoute = Route$19.update({
  id: "/whatsapp-templates",
  path: "/whatsapp-templates",
  getParentRoute: () => AdminRoute
});
const AdminZohoExportRoute = Route$18.update({
  id: "/zoho-export",
  path: "/zoho-export",
  getParentRoute: () => AdminRoute
});
const ApiHealthRoute = Route$17.update({
  id: "/api/health",
  path: "/api/health",
  getParentRoute: () => Route$2z
});
const AppTokenRoute = Route$16.update({
  id: "/app/$token",
  path: "/app/$token",
  getParentRoute: () => Route$2z
});
const AuthCallbackRoute = Route$15.update({
  id: "/auth/callback",
  path: "/auth/callback",
  getParentRoute: () => Route$2z
});
const EmailUnsubscribeRoute = Route$14.update({
  id: "/email/unsubscribe",
  path: "/email/unsubscribe",
  getParentRoute: () => Route$2z
});
const PaymentFailedLeadCodeRoute = Route$13.update({
  id: "/payment-failed/$leadCode",
  path: "/payment-failed/$leadCode",
  getParentRoute: () => Route$2z
});
const PaymentPendingLeadCodeRoute = Route$12.update({
  id: "/payment-pending/$leadCode",
  path: "/payment-pending/$leadCode",
  getParentRoute: () => Route$2z
});
const PaymentLeadCodeRoute = Route$11.update({
  id: "/payment/$leadCode",
  path: "/payment/$leadCode",
  getParentRoute: () => Route$2z
});
const ProcessingLeadCodeRoute = Route$10.update({
  id: "/processing/$leadCode",
  path: "/processing/$leadCode",
  getParentRoute: () => Route$2z
});
const ResumeOrderIdRoute = Route$$.update({
  id: "/resume/$orderId",
  path: "/resume/$orderId",
  getParentRoute: () => Route$2z
});
const SuccessLeadCodeRoute = Route$_.update({
  id: "/success/$leadCode",
  path: "/success/$leadCode",
  getParentRoute: () => Route$2z
});
const DotlovableOauthConsentRoute = Route$Z.update({
  id: "/.lovable/oauth/consent",
  path: "/.lovable/oauth/consent",
  getParentRoute: () => Route$2z
});
const Char91DotmcpChar93InvokeToolToolRoute = Route$Y.update({
  id: "/.mcp/invoke-tool/$tool",
  path: "/.mcp/invoke-tool/$tool",
  getParentRoute: () => Route$2z
});
const AdminApplicationsApplicationIdRoute = Route$X.update({
  id: "/$applicationId",
  path: "/$applicationId",
  getParentRoute: () => AdminApplicationsRoute
});
const AdminComplaintsComplaintIdRoute = Route$W.update({
  id: "/$complaintId",
  path: "/$complaintId",
  getParentRoute: () => AdminComplaintsRoute
});
const AdminCustomersCustomerIdRoute = Route$V.update({
  id: "/$customerId",
  path: "/$customerId",
  getParentRoute: () => AdminCustomersRoute
});
const AdminFinanceGstRoute = Route$U.update({
  id: "/gst",
  path: "/gst",
  getParentRoute: () => AdminFinanceRoute
});
const AdminFinanceSettlementsRoute = Route$T.update({
  id: "/settlements",
  path: "/settlements",
  getParentRoute: () => AdminFinanceRoute
});
const AdminHelpEmailMatrixRoute = Route$S.update({
  id: "/help/email-matrix",
  path: "/help/email-matrix",
  getParentRoute: () => AdminRoute
});
const AdminLeadsIndexRoute = Route$R.update({
  id: "/",
  path: "/",
  getParentRoute: () => AdminLeadsRoute
});
const AdminLeadsLeadIdRoute = Route$Q.update({
  id: "/$leadId",
  path: "/$leadId",
  getParentRoute: () => AdminLeadsRoute
});
const AdminOrdersIndexRoute = Route$P.update({
  id: "/",
  path: "/",
  getParentRoute: () => AdminOrdersRoute
});
const AdminOrdersOrderIdRoute = Route$O.update({
  id: "/$orderId",
  path: "/$orderId",
  getParentRoute: () => AdminOrdersRoute
});
const AdminServicesIndexRoute = Route$N.update({
  id: "/",
  path: "/",
  getParentRoute: () => AdminServicesRoute
});
const AdminServicesServiceCodeRoute = Route$M.update({
  id: "/$serviceCode",
  path: "/$serviceCode",
  getParentRoute: () => AdminServicesRoute
});
const AdminSubmissionsSubmissionIdRoute = Route$L.update({
  id: "/$submissionId",
  path: "/$submissionId",
  getParentRoute: () => AdminSubmissionsRoute
});
const AdminSupportTicketsRoute = Route$K.update({
  id: "/support/tickets",
  path: "/support/tickets",
  getParentRoute: () => AdminRoute
});
const AdminTicketsIndexRoute = Route$J.update({
  id: "/tickets/",
  path: "/tickets/",
  getParentRoute: () => AdminRoute
});
const AdminTicketsTicketIdRoute = Route$I.update({
  id: "/tickets/$ticketId",
  path: "/tickets/$ticketId",
  getParentRoute: () => AdminRoute
});
const AdminWebsiteContentWebsiteIdRoute = Route$H.update({
  id: "/website-content/$websiteId",
  path: "/website-content/$websiteId",
  getParentRoute: () => AdminRoute
});
const ApiPublicComplaintRoute = Route$G.update({
  id: "/api/public/complaint",
  path: "/api/public/complaint",
  getParentRoute: () => Route$2z
});
const ApiPublicContactRoute = Route$F.update({
  id: "/api/public/contact",
  path: "/api/public/contact",
  getParentRoute: () => Route$2z
});
const ApiPublicTalkToExpertRoute = Route$E.update({
  id: "/api/public/talk-to-expert",
  path: "/api/public/talk-to-expert",
  getParentRoute: () => Route$2z
});
const ApplyLeadCodeSummaryRoute = Route$D.update({
  id: "/apply/$leadCode/summary",
  path: "/apply/$leadCode/summary",
  getParentRoute: () => Route$2z
});
const LovableEmailSuppressionRoute = Route$C.update({
  id: "/lovable/email/suppression",
  path: "/lovable/email/suppression",
  getParentRoute: () => Route$2z
});
const OnboardingLeadCodeIndexRoute = Route$B.update({
  id: "/onboarding/$leadCode/",
  path: "/onboarding/$leadCode/",
  getParentRoute: () => Route$2z
});
const OnboardingLeadCodeDocumentsRoute = Route$A.update({
  id: "/onboarding/$leadCode/documents",
  path: "/onboarding/$leadCode/documents",
  getParentRoute: () => Route$2z
});
const OnboardingLeadCodeDoneRoute = Route$z.update({
  id: "/onboarding/$leadCode/done",
  path: "/onboarding/$leadCode/done",
  getParentRoute: () => Route$2z
});
const AdminServicesFormsServiceCodeRoute = Route$y.update({
  id: "/forms/$serviceCode",
  path: "/forms/$serviceCode",
  getParentRoute: () => AdminServicesRoute
});
const AdminSupportTicketsIndexRoute = Route$x.update({
  id: "/",
  path: "/",
  getParentRoute: () => AdminSupportTicketsRoute
});
const AdminSupportTicketsTicketIdRoute = Route$w.update({
  id: "/$ticketId",
  path: "/$ticketId",
  getParentRoute: () => AdminSupportTicketsRoute
});
const ApiPublicAdminRegenerateInvoicesRoute = Route$v.update({
  id: "/api/public/admin/regenerate-invoices",
  path: "/api/public/admin/regenerate-invoices",
  getParentRoute: () => Route$2z
});
const ApiPublicAudioSplatRoute = Route$u.update({
  id: "/api/public/audio/$",
  path: "/api/public/audio/$",
  getParentRoute: () => Route$2z
});
const ApiPublicCronComplaintsSlaRoute = Route$t.update({
  id: "/api/public/cron/complaints-sla",
  path: "/api/public/cron/complaints-sla",
  getParentRoute: () => Route$2z
});
const ApiPublicCronDailyDigestRoute = Route$s.update({
  id: "/api/public/cron/daily-digest",
  path: "/api/public/cron/daily-digest",
  getParentRoute: () => Route$2z
});
const ApiPublicCronOnboardingRemindersRoute = Route$r.update({
  id: "/api/public/cron/onboarding-reminders",
  path: "/api/public/cron/onboarding-reminders",
  getParentRoute: () => Route$2z
});
const ApiPublicCronPayuReconcileRoute = Route$q.update({
  id: "/api/public/cron/payu-reconcile",
  path: "/api/public/cron/payu-reconcile",
  getParentRoute: () => Route$2z
});
const ApiPublicCronPollZohoInboxRoute = Route$p.update({
  id: "/api/public/cron/poll-zoho-inbox",
  path: "/api/public/cron/poll-zoho-inbox",
  getParentRoute: () => Route$2z
});
const ApiPublicCronProcessEmailsRoute = Route$o.update({
  id: "/api/public/cron/process-emails",
  path: "/api/public/cron/process-emails",
  getParentRoute: () => Route$2z
});
const ApiPublicCronSchedulersTickRoute = Route$n.update({
  id: "/api/public/cron/schedulers-tick",
  path: "/api/public/cron/schedulers-tick",
  getParentRoute: () => Route$2z
});
const ApiPublicCronWorkflowRemindersRoute = Route$m.update({
  id: "/api/public/cron/workflow-reminders",
  path: "/api/public/cron/workflow-reminders",
  getParentRoute: () => Route$2z
});
const ApiPublicCronWorkflowTickRoute = Route$l.update({
  id: "/api/public/cron/workflow-tick",
  path: "/api/public/cron/workflow-tick",
  getParentRoute: () => Route$2z
});
const ApiPublicCronWorkforceReassignTickRoute = Route$k.update({
  id: "/api/public/cron/workforce-reassign-tick",
  path: "/api/public/cron/workforce-reassign-tick",
  getParentRoute: () => Route$2z
});
const ApiPublicCronZohoDiagnoseRoute = Route$j.update({
  id: "/api/public/cron/zoho-diagnose",
  path: "/api/public/cron/zoho-diagnose",
  getParentRoute: () => Route$2z
});
const ApiPublicFormAssetSplatRoute = Route$i.update({
  id: "/api/public/form-asset/$",
  path: "/api/public/form-asset/$",
  getParentRoute: () => Route$2z
});
const ApiPublicGstLeadRoute = Route$h.update({
  id: "/api/public/gst/lead",
  path: "/api/public/gst/lead",
  getParentRoute: () => Route$2z
});
const ApiPublicGstServicesRoute = Route$g.update({
  id: "/api/public/gst/services",
  path: "/api/public/gst/services",
  getParentRoute: () => Route$2z
});
const ApiPublicInvoiceLeadCodeRoute = Route$f.update({
  id: "/api/public/invoice/$leadCode",
  path: "/api/public/invoice/$leadCode",
  getParentRoute: () => Route$2z
});
const ApiPublicSiteBrandRoute = Route$e.update({
  id: "/api/public/site/brand",
  path: "/api/public/site/brand",
  getParentRoute: () => Route$2z
});
const ApiPublicSiteLeadRoute = Route$d.update({
  id: "/api/public/site/lead",
  path: "/api/public/site/lead",
  getParentRoute: () => Route$2z
});
const ApiPublicSiteServicesRoute = Route$c.update({
  id: "/api/public/site/services",
  path: "/api/public/site/services",
  getParentRoute: () => Route$2z
});
const ApiPublicV1LeadsRoute = Route$b.update({
  id: "/api/public/v1/leads",
  path: "/api/public/v1/leads",
  getParentRoute: () => Route$2z
});
const ApiPublicV1ServicesRoute = Route$a.update({
  id: "/api/public/v1/services",
  path: "/api/public/v1/services",
  getParentRoute: () => Route$2z
});
const ApiPublicWebhooksCashfreeRoute = Route$9.update({
  id: "/api/public/webhooks/cashfree",
  path: "/api/public/webhooks/cashfree",
  getParentRoute: () => Route$2z
});
const ApiPublicWebhooksCcavenueRoute = Route$8.update({
  id: "/api/public/webhooks/ccavenue",
  path: "/api/public/webhooks/ccavenue",
  getParentRoute: () => Route$2z
});
const ApiPublicWebhooksPayuRoute = Route$7.update({
  id: "/api/public/webhooks/payu",
  path: "/api/public/webhooks/payu",
  getParentRoute: () => Route$2z
});
const LovableEmailQueueProcessRoute = Route$6.update({
  id: "/lovable/email/queue/process",
  path: "/lovable/email/queue/process",
  getParentRoute: () => Route$2z
});
const LovableEmailTransactionalPreviewRoute = Route$5.update({
  id: "/lovable/email/transactional/preview",
  path: "/lovable/email/transactional/preview",
  getParentRoute: () => Route$2z
});
const LovableEmailTransactionalSendRoute = Route$4.update({
  id: "/lovable/email/transactional/send",
  path: "/lovable/email/transactional/send",
  getParentRoute: () => Route$2z
});
const ApiPublicTelephonyCallerdeskEventsRoute = Route$3.update({
  id: "/api/public/telephony/callerdesk/events",
  path: "/api/public/telephony/callerdesk/events",
  getParentRoute: () => Route$2z
});
const ApiPublicV1ApplicationsSummaryRoute = Route$2.update({
  id: "/api/public/v1/applications/summary",
  path: "/api/public/v1/applications/summary",
  getParentRoute: () => Route$2z
});
const ApiPublicV1PaymentsInitiateRoute = Route$1.update({
  id: "/api/public/v1/payments/initiate",
  path: "/api/public/v1/payments/initiate",
  getParentRoute: () => Route$2z
});
const ApiPublicV1PaymentsLeadCodeStatusRoute = Route.update({
  id: "/api/public/v1/payments/$leadCode/status",
  path: "/api/public/v1/payments/$leadCode/status",
  getParentRoute: () => Route$2z
});
const AdminApplicationsRouteChildren = {
  AdminApplicationsApplicationIdRoute
};
const AdminApplicationsRouteWithChildren = AdminApplicationsRoute._addFileChildren(AdminApplicationsRouteChildren);
const AdminComplaintsRouteChildren = {
  AdminComplaintsComplaintIdRoute
};
const AdminComplaintsRouteWithChildren = AdminComplaintsRoute._addFileChildren(
  AdminComplaintsRouteChildren
);
const AdminCustomersRouteChildren = {
  AdminCustomersCustomerIdRoute
};
const AdminCustomersRouteWithChildren = AdminCustomersRoute._addFileChildren(
  AdminCustomersRouteChildren
);
const AdminFinanceRouteChildren = {
  AdminFinanceGstRoute,
  AdminFinanceSettlementsRoute
};
const AdminFinanceRouteWithChildren = AdminFinanceRoute._addFileChildren(
  AdminFinanceRouteChildren
);
const AdminLeadsRouteChildren = {
  AdminLeadsLeadIdRoute,
  AdminLeadsIndexRoute
};
const AdminLeadsRouteWithChildren = AdminLeadsRoute._addFileChildren(
  AdminLeadsRouteChildren
);
const AdminOrdersRouteChildren = {
  AdminOrdersOrderIdRoute,
  AdminOrdersIndexRoute
};
const AdminOrdersRouteWithChildren = AdminOrdersRoute._addFileChildren(
  AdminOrdersRouteChildren
);
const AdminServicesRouteChildren = {
  AdminServicesServiceCodeRoute,
  AdminServicesIndexRoute,
  AdminServicesFormsServiceCodeRoute
};
const AdminServicesRouteWithChildren = AdminServicesRoute._addFileChildren(
  AdminServicesRouteChildren
);
const AdminSubmissionsRouteChildren = {
  AdminSubmissionsSubmissionIdRoute
};
const AdminSubmissionsRouteWithChildren = AdminSubmissionsRoute._addFileChildren(AdminSubmissionsRouteChildren);
const AdminSupportTicketsRouteChildren = {
  AdminSupportTicketsTicketIdRoute,
  AdminSupportTicketsIndexRoute
};
const AdminSupportTicketsRouteWithChildren = AdminSupportTicketsRoute._addFileChildren(AdminSupportTicketsRouteChildren);
const AdminRouteChildren = {
  AdminActivityRoute,
  AdminApplicationsRoute: AdminApplicationsRouteWithChildren,
  AdminAssignmentHistoryRoute,
  AdminAttendanceRoute,
  AdminAuditRoute,
  AdminCannedResponsesRoute,
  AdminCertificatesRoute,
  AdminComplaintsRoute: AdminComplaintsRouteWithChildren,
  AdminCustomersRoute: AdminCustomersRouteWithChildren,
  AdminDashboardRoute,
  AdminDisputeManagerRoute,
  AdminDocumentsRoute,
  AdminEmailTemplatesRoute,
  AdminEmailsRoute,
  AdminEmployeesRoute,
  AdminFinanceRoute: AdminFinanceRouteWithChildren,
  AdminGatewaysRoute,
  AdminInboxManagementRoute,
  AdminInvoicesRoute,
  AdminLeadsRoute: AdminLeadsRouteWithChildren,
  AdminLiveCallsRoute,
  AdminMyPerformanceRoute,
  AdminMyWorkRoute,
  AdminNotificationsRoute,
  AdminOrdersRoute: AdminOrdersRouteWithChildren,
  AdminPaymentAuditRoute,
  AdminPaymentsRoute,
  AdminPerformanceRoute,
  AdminPermissionsRoute,
  AdminPipelineRoute,
  AdminQuarantineRoute,
  AdminRefundsRoute,
  AdminReportsRoute,
  AdminReviewRoute,
  AdminSeoRoute,
  AdminServicesRoute: AdminServicesRouteWithChildren,
  AdminSessionsRoute,
  AdminSettingsRoute,
  AdminSubmissionsRoute: AdminSubmissionsRouteWithChildren,
  AdminSuperRoute,
  AdminTasksRoute,
  AdminTeamOrdersRoute,
  AdminTrainingRoute,
  AdminUsersRoute,
  AdminWebsitesRoute,
  AdminWhatsappTemplatesRoute,
  AdminZohoExportRoute,
  AdminIndexRoute,
  AdminHelpEmailMatrixRoute,
  AdminSupportTicketsRoute: AdminSupportTicketsRouteWithChildren,
  AdminTicketsTicketIdRoute,
  AdminWebsiteContentWebsiteIdRoute,
  AdminTicketsIndexRoute
};
const AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  SplatRoute,
  AboutRoute,
  AboutUsRoute,
  AdminRoute: AdminRouteWithChildren,
  AdminLoginRoute,
  AmlAntiFraudPolicyRoute,
  ComplaintRoute,
  ComplaintGrievancePolicyRoute,
  ComplianceStatementRoute,
  ConsentAcknowledgmentRoute,
  ContactRoute,
  ContactUsRoute,
  CookiePolicyRoute,
  DisclaimerRoute,
  DownloadUdyamCertificateRoute,
  GrievanceRedressalPolicyRoute,
  ImportantNoticeRoute,
  IndexDothtmlRoute,
  LlmsFullDottxtRoute,
  LlmsDottxtRoute,
  McpRoute,
  MigrateUdyogAadhaarToUdyamRoute,
  MsmeRegistrationFeeRoute,
  NewUdyamRegistrationRoute,
  NoticeRoute,
  OtherProblemRoute,
  PaymentNoticeRoute,
  PaymentNoticeServiceAcknowledgmentRoute,
  PricingTransparencyRoute,
  PrivacyPolicyRoute,
  RefundCancellationPolicyRoute,
  RobotsDottxtRoute,
  SeoAdminRoute,
  ServiceDeliveryPolicyRoute,
  SitemapDotxmlRoute,
  TalkToExpertRoute,
  TermsConditionsRoute,
  UnauthorizedRoute,
  UpdateUdyamCertificateRoute,
  VerifyUdyamCertificateRoute,
  Char91DotmcpChar93ListToolsRoute,
  Char91DotwellKnownChar93OauthProtectedResourceRoute,
  ApiHealthRoute,
  AppTokenRoute,
  AuthCallbackRoute,
  EmailUnsubscribeRoute,
  PaymentFailedLeadCodeRoute,
  PaymentPendingLeadCodeRoute,
  PaymentLeadCodeRoute,
  ProcessingLeadCodeRoute,
  ResumeOrderIdRoute,
  SuccessLeadCodeRoute,
  DotlovableOauthConsentRoute,
  Char91DotmcpChar93InvokeToolToolRoute,
  ApiPublicComplaintRoute,
  ApiPublicContactRoute,
  ApiPublicTalkToExpertRoute,
  ApplyLeadCodeSummaryRoute,
  LovableEmailSuppressionRoute,
  OnboardingLeadCodeDocumentsRoute,
  OnboardingLeadCodeDoneRoute,
  OnboardingLeadCodeIndexRoute,
  ApiPublicAdminRegenerateInvoicesRoute,
  ApiPublicAudioSplatRoute,
  ApiPublicCronComplaintsSlaRoute,
  ApiPublicCronDailyDigestRoute,
  ApiPublicCronOnboardingRemindersRoute,
  ApiPublicCronPayuReconcileRoute,
  ApiPublicCronPollZohoInboxRoute,
  ApiPublicCronProcessEmailsRoute,
  ApiPublicCronSchedulersTickRoute,
  ApiPublicCronWorkflowRemindersRoute,
  ApiPublicCronWorkflowTickRoute,
  ApiPublicCronWorkforceReassignTickRoute,
  ApiPublicCronZohoDiagnoseRoute,
  ApiPublicFormAssetSplatRoute,
  ApiPublicGstLeadRoute,
  ApiPublicGstServicesRoute,
  ApiPublicInvoiceLeadCodeRoute,
  ApiPublicSiteBrandRoute,
  ApiPublicSiteLeadRoute,
  ApiPublicSiteServicesRoute,
  ApiPublicV1LeadsRoute,
  ApiPublicV1ServicesRoute,
  ApiPublicWebhooksCashfreeRoute,
  ApiPublicWebhooksCcavenueRoute,
  ApiPublicWebhooksPayuRoute,
  LovableEmailQueueProcessRoute,
  LovableEmailTransactionalPreviewRoute,
  LovableEmailTransactionalSendRoute,
  ApiPublicTelephonyCallerdeskEventsRoute,
  ApiPublicV1ApplicationsSummaryRoute,
  ApiPublicV1PaymentsInitiateRoute,
  ApiPublicV1PaymentsLeadCodeStatusRoute
};
const routeTree = Route$2z._addFileChildren(rootRouteChildren)._addFileTypes();
const routeTree_gen = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  routeTree
}, Symbol.toStringTag, { value: "Module" }));
if (typeof window !== "undefined") {
  const RELOAD_KEY = "chunk-reload-at";
  const recover = () => {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0);
    if (Date.now() - last < 1e4) return;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
    window.location.reload();
  };
  const isChunkError = (msg) => !!msg && (msg.includes("Failed to fetch dynamically imported module") || msg.includes("error loading dynamically imported module") || msg.includes("Importing a module script failed"));
  window.addEventListener("vite:preloadError", () => recover());
  window.addEventListener("error", (e) => {
    if (isChunkError(e.message)) recover();
  });
  window.addEventListener("unhandledrejection", (e) => {
    const reason = e.reason;
    if (isChunkError(typeof reason === "string" ? reason : reason?.message)) {
      recover();
    }
  });
}
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Textarea as $,
  ArticlePageLayout as A,
  BLOCKS$5 as B,
  listEmployeeLeaves as C,
  listStaffUsers as D,
  createEmployeeLeave as E,
  cancelEmployeeLeave as F,
  triggerEmployeeReassignment as G,
  Button as H,
  Input as I,
  Select as J,
  SelectTrigger as K,
  LeadForm as L,
  SelectValue as M,
  SelectContent as N,
  SelectItem as O,
  Dialog as P,
  DialogContent as Q,
  Route$2x as R,
  SeoContentPage as S,
  TrustBlock as T,
  DialogHeader as U,
  DialogTitle as V,
  Label as W,
  DialogFooter as X,
  useFinancialVisibility as Y,
  Route$1J as Z,
  useRole as _,
  cn as a,
  TabsContent as a$,
  DateRangePicker as a0,
  Badge as a1,
  getMyPerformanceDashboard as a2,
  useRealtimeTable as a3,
  Tabs as a4,
  TabsList as a5,
  TabsTrigger as a6,
  isVisibleService as a7,
  getEmployeePerformanceCommandCenter as a8,
  getLiveActivityFeed as a9,
  Route$28 as aA,
  resendOrderCertificate as aB,
  DialogTrigger as aC,
  Checkbox as aD,
  usePermissions as aE,
  Route$16 as aF,
  Route$V as aG,
  requestOrderDocumentUpload as aH,
  confirmOrderDocumentUpload as aI,
  formatMobile55 as aJ,
  Route$M as aK,
  Route$H as aL,
  listStaff as aM,
  Route$x as aN,
  SelectGroup as aO,
  SelectLabel as aP,
  useBlockItems as aQ,
  useBrand as aR,
  certImg as aS,
  UdyamRegistrationsSections as aT,
  Route$w as aU,
  getOrderDocumentSignedUrl as aV,
  buttonVariants as aW,
  getWorkforceDashboardMetrics as aX,
  archiveEmployee as aY,
  deleteEmployee as aZ,
  setEmploymentStatus as a_,
  getEmployeeMetricDrilldown as aa,
  getEmployeeDetailPerformance as ab,
  InboxManagementPage as ac,
  Route$1f as ad,
  OrdersListPage as ae,
  grantRole as af,
  revokeRole as ag,
  SiteShell as ah,
  useAccessToken as ai,
  Route$13 as aj,
  captureAccessToken as ak,
  pickAccessToken as al,
  markConversionOnce as am,
  Route$Z as an,
  oauth as ao,
  listServices as ap,
  upsertService as aq,
  deleteService as ar,
  DialogDescription as as,
  Route$L as at,
  readAccessToken as au,
  Route$z as av,
  Route$y as aw,
  Route$2t as ax,
  safeNext as ay,
  certImg$1 as az,
  trackEvent as b,
  inviteEmployee as b0,
  updateEmployee as b1,
  getEmployeeWorkAccess as b2,
  setEmployeeWorkAccess as b3,
  resetEmployeePassword as b4,
  Route$W as b5,
  Popover as b6,
  PopoverTrigger as b7,
  PopoverContent as b8,
  Calendar as b9,
  getOrderTickets as bA,
  Route$O as bB,
  updateOrderAssignee as bC,
  router as bD,
  listLeads as ba,
  getLeadCounts as bb,
  getLeadSourceBreakdown as bc,
  usePreserveScroll as bd,
  getLead as be,
  addLead as bf,
  findLeadByCodeOrId as bg,
  useDashboardPrivacy as bh,
  changeLeadService as bi,
  Route$Q as bj,
  addLeadNote as bk,
  clearModuleFilterState as bl,
  DashboardPrivacyProvider as bm,
  FinancialVisibilityProvider as bn,
  getOrderAssignmentHistory as bo,
  getOrderDetailV2 as bp,
  updateFulfillmentStatus as bq,
  changeOrderService as br,
  resendServiceChangeEmail as bs,
  Table as bt,
  TableHeader as bu,
  TableRow as bv,
  TableHead as bw,
  TableBody as bx,
  TableCell as by,
  getOrderTimelineEvents as bz,
  cfToSeoPageData as c,
  Route$2j as d,
  Route$2c as e,
  BLOCKS$4 as f,
  BLOCKS$3 as g,
  Route$2a as h,
  BLOCKS$2 as i,
  useServerFn as j,
  checkIsAdmin as k,
  upsertSeoPage as l,
  listAllSeoPages as m,
  getSitemapPageManagerData as n,
  deleteSeoPage as o,
  storeAccessToken as p,
  Route$1X as q,
  BLOCKS$1 as r,
  submitAllPagesToSitemap as s,
  titleize as t,
  useOptionalBrand as u,
  Route$1W as v,
  BLOCKS as w,
  getMyStaffRoles as x,
  getAssignmentOperationalMetrics as y,
  listAssignmentHistoryAdmin as z
};
