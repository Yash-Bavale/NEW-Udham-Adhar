import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as LeadForm, T as TrustBlock } from "./router-QgJicixe.mjs";
const certImg = "/images/udyam-registration-certificate.png";
const indiaMapImg = "/images/india-map.png";
function Block({ b }) {
  switch (b.type) {
    case "p":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "my-3 leading-relaxed", children: b.text });
    case "h2":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-8 font-display text-brand-navy-deep text-2xl font-bold", children: b.text });
    case "h3":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-6 font-display text-foreground text-lg font-semibold", children: b.text });
    case "ul":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "my-3 list-disc pl-6 space-y-1", children: b.items.map((it, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: it }, i)) });
    case "ol":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "my-3 list-decimal pl-6 space-y-1", children: b.items.map((it, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: it }, i)) });
    case "note":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "my-4 rounded-md border-l-4 border-amber-500 bg-amber-50 p-4 text-sm text-amber-950", children: b.text });
    case "table":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-4 overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "bg-muted/60", children: b.headers.map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: "border border-border px-3 py-2 text-left font-semibold",
            children: h
          },
          i
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: b.rows.map((row, ri) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "odd:bg-card even:bg-muted/20", children: row.map((c, ci) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            className: "border border-border px-3 py-2 align-top",
            children: c
          },
          ci
        )) }, ri)) })
      ] }) });
    case "faq":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "my-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("dl", { className: "space-y-4", children: b.items.map((it, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-lg border border-border bg-card p-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "font-display text-base font-semibold text-foreground", children: it.q }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "mt-2 text-[15px] leading-relaxed text-foreground/85", children: it.a })
          ]
        },
        i
      )) }) });
  }
}
function RichServicePage({
  h1,
  intro,
  blocks = [],
  longDescriptionHtml,
  serviceTitle
}) {
  const normH1 = (h1 ?? "").trim().toLowerCase();
  const normIntro = (intro ?? "").trim().toLowerCase();
  const showIntro = normIntro && normIntro !== normH1;
  let cleanHtml = longDescriptionHtml;
  if (cleanHtml && normH1) {
    cleanHtml = cleanHtml.replace(
      /^\s*<h[12][^>]*>(.*?)<\/h[12]>/i,
      (match, p1) => {
        const headingText = p1.replace(/<[^>]+>/g, "").trim().toLowerCase();
        if (headingText === normH1 || normH1.includes(headingText) || headingText.includes(normH1)) {
          return "";
        }
        return match;
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 py-6 md:py-8 grid gap-6 lg:grid-cols-2 items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LeadForm, { title: serviceTitle }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card shadow-sm overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-form-header text-white text-center py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold font-display", children: "Sample Certificate" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: certImg,
              alt: "Sample Udyam Registration Certificate",
              className: "w-full h-auto rounded-md border border-border",
              loading: "eager",
              fetchPriority: "high"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-center text-sm text-slate-950", children: "Note: Sample Udyam Certificate shown for reference purposes only." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 text-center text-2xl font-bold text-brand-navy-deep", children: "Udyam Registration Services Across India" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: indiaMapImg,
          alt: "India map showing pan-India Udyam registration assistance",
          className: "mx-auto h-auto w-full max-w-3xl",
          loading: "lazy"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "w-full bg-white border-y border-border py-10 md:py-14 my-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 text-foreground/90 text-[15px]", children: [
      h1 && /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-brand-navy-deep text-3xl md:text-4xl font-bold leading-tight", children: h1 }),
      showIntro && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-base leading-relaxed text-foreground/85", children: intro }),
      cleanHtml ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "space-y-4 text-foreground/90 text-[15px] [&_h1]:font-display [&_h1]:text-brand-navy-deep [&_h1]:text-3xl [&_h1]:md:text-4xl [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:mb-6 [&_h2]:font-display [&_h2]:text-brand-navy-deep [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-border/50 [&_h3]:font-display [&_h3]:text-foreground [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3 [&_h4]:font-display [&_h4]:text-foreground [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:mt-4 [&_h4]:mb-2 [&_p]:my-3.5 [&_p]:leading-relaxed [&_p]:text-foreground/85 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4 [&_ol]:space-y-2 [&_a]:text-brand-navy [&_a]:font-medium [&_a]:underline [&_a]:hover:text-brand-navy-deep [&_strong]:font-semibold [&_strong]:text-foreground [&_blockquote]:border-l-4 [&_blockquote]:border-brand-navy [&_blockquote]:bg-muted/30 [&_blockquote]:p-4 [&_blockquote]:rounded-r-md [&_blockquote]:italic [&_blockquote]:my-4",
          dangerouslySetInnerHTML: { __html: cleanHtml }
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: blocks.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Block, { b }, i)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TrustBlock, {})
  ] });
}
export {
  RichServicePage as R
};
