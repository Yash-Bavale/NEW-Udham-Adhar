import { j as jsxRuntimeExports } from "../_libs/react.mjs";
const SplitErrorComponent = ({
  error
}) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-sm text-red-700", children: [
  "Admin error: ",
  error.message,
  " ",
  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "ml-2 underline", onClick: () => window.location.reload(), children: "Reload" })
] });
export {
  SplitErrorComponent as errorComponent
};
