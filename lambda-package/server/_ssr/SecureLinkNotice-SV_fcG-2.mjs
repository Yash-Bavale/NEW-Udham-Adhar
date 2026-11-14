import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { j as useServerFn } from "./router-QgJicixe.mjs";
import { a as requestSecureLink } from "./customer-access.functions-N17nWKMW.mjs";
import { w as ShieldCheck, L as LoaderCircle } from "../_libs/lucide-react.mjs";
function SecureLinkNotice({ leadCode, message }) {
  const send = useServerFn(requestSecureLink);
  const [state, setState] = reactExports.useState("idle");
  async function onSend() {
    setState("sending");
    try {
      await send({ data: { leadCode } });
    } catch {
    }
    setState("sent");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[60vh] flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md w-full rounded-2xl border border-border bg-card p-8 text-center shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "mx-auto h-10 w-10 text-primary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-xl font-bold text-foreground", children: "Please open your secure link" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: message ?? "For your privacy, this page only opens from the secure link we email you. Use the latest link in your email, or ask us to send a new one." }),
    state === "sent" ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 rounded-lg bg-muted p-3 text-sm text-foreground", children: "If this application exists, a new secure link has been sent to the email address on file." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: onSend,
        disabled: state === "sending",
        className: "mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60",
        children: [
          state === "sending" && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
          "Email me a secure link"
        ]
      }
    )
  ] }) });
}
export {
  SecureLinkNotice as S
};
