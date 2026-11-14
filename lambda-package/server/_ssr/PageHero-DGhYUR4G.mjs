import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { LEGAL_ENTITY, COMPANY_NAME, SUPPORT_EMAIL, BASE_URL, SITE_NAME } from "./brand-DLB0j9eh.mjs";
import { L as LeadForm, T as TrustBlock, u as useOptionalBrand } from "./router-QgJicixe.mjs";
const certImg = "/images/udyam-registration-certificate.png";
const proseClasses = "p-6 md:p-10 space-y-4 text-foreground/85 text-[15px] leading-relaxed [&_h2]:font-display [&_h2]:text-foreground [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-6 [&_h3]:font-display [&_h3]:text-foreground [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-5 [&_h4]:font-display [&_h4]:text-foreground [&_h4]:text-base [&_h4]:font-semibold [&_h4]:mt-5 [&_a]:text-brand-navy [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 [&_p]:my-3 [&_strong]:text-foreground [&_table]:w-full [&_th]:text-left [&_th,&_td]:border [&_th,&_td]:border-border [&_th,&_td]:px-2 [&_th,&_td]:py-1";
function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function useBrandedHtml(html) {
  const brand = useOptionalBrand();
  if (!brand) return html;
  const pairs = [
    [LEGAL_ENTITY, brand.legalEntity],
    [COMPANY_NAME, brand.companyName],
    [SUPPORT_EMAIL, brand.supportEmail],
    [BASE_URL, brand.baseUrl],
    ["udyamadhar.in", brand.domain],
    [SITE_NAME, brand.siteName]
  ];
  let out = html;
  for (const [from, to] of pairs) {
    if (!to || from === to) continue;
    out = out.replace(new RegExp(escapeRe(from), "g"), to);
  }
  return out;
}
const H1_BLOCK_RE = /(?:<a\b[^>]*>\s*)?<h1\b[^>]*>([\s\S]*?)<\/h1\s*>(?:\s*<\/a>)?/gi;
const plain = (s) => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
function firstH1Text(html) {
  const m = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1\s*>/i);
  return m ? plain(m[1]) : "";
}
function stripH1Blocks(html) {
  return html.replace(H1_BLOCK_RE, "");
}
function WpPage({
  title,
  html,
  legal,
  withForm
}) {
  const embedded = firstH1Text(html);
  const heading = embedded && embedded.length > title.length ? embedded : title;
  const branded = useBrandedHtml(stripH1Blocks(html));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    withForm ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        id: "lead-form",
        className: "mx-auto max-w-7xl px-4 py-6 md:py-8 grid gap-6 lg:grid-cols-2 items-start",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LeadForm, { title: heading }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card shadow-sm overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-form-header text-white text-center py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold font-display", children: "Sample Certificate" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: certImg,
                  alt: "Sample Udyam Adhar Certificate",
                  width: 800,
                  height: 1035,
                  className: "w-full h-auto rounded-md border border-border",
                  loading: "eager"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-center text-sm text-muted-foreground", children: "Note: Sample Udyam Adhar Certificate shown for reference purposes only." })
            ] })
          ] })
        ]
      }
    ) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-5xl px-4 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card shadow-sm overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-form-header text-white text-center py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl md:text-3xl font-bold font-display", children: heading }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: proseClasses, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { dangerouslySetInnerHTML: { __html: branded } }) })
    ] }) }),
    withForm ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrustBlock, {}) : null
  ] });
}
export {
  WpPage as W
};
