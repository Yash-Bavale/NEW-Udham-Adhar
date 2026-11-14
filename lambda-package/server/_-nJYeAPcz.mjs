import { j as jsxRuntimeExports } from "./_libs/react.mjs";
const SplitErrorComponent = ({
  error
}) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl px-4 py-20 text-center", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold", children: "Something went wrong" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: String(error) }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", className: "mt-6 inline-block text-primary underline", children: "Return to homepage" })
] });
export {
  SplitErrorComponent as errorComponent
};
