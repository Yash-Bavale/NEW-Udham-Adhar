import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { j as useServerFn } from "./router-QgJicixe.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { b as browserPhone } from "./browser-phone-bus-CwJqzKkc.mjs";
import { L as LoaderCircle, N as PhoneCall, $ as Headset } from "../_libs/lucide-react.mjs";
import { o as object, s as string } from "../_libs/zod.mjs";
const Input = object({
  destination: string().min(6).max(20),
  customerId: string().uuid().nullable().optional(),
  leadId: string().uuid().nullable().optional(),
  applicationId: string().uuid().nullable().optional()
});
const initiateClickToCall = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => Input.parse(i)).handler(createSsrRpc("164d8ff79d8fc1ec17a4d9e9a666155e25c71f0f5d6495888c8f4284785af090"));
function CallButton({ mobile, customerId, leadId, applicationId, className, label = "Phone callback", compact }) {
  const call = useServerFn(initiateClickToCall);
  const qc = useQueryClient();
  const [busy, setBusy] = reactExports.useState(false);
  const phoneReady = reactExports.useSyncExternalStore(browserPhone.subscribe, browserPhone.isReady, () => false);
  if (!mobile) return null;
  async function onClick() {
    if (busy) return;
    setBusy(true);
    try {
      const r = await call({
        data: {
          destination: String(mobile),
          customerId: customerId ?? null,
          leadId: leadId ?? null,
          applicationId: applicationId ?? null
        }
      });
      toast.success(r?.alreadyInProgress ? "This call is already in progress" : "Calling customer… answer your phone first");
      qc.invalidateQueries({ queryKey: ["my-call-state"] });
    } catch (e) {
      toast.error(e?.message || "Could not start the call");
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick,
        disabled: busy,
        title: "Rings your CallerDesk phone first, then connects the customer",
        className: className ?? `inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 ${compact ? "py-1" : "py-1.5"} text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition`,
        children: [
          busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneCall, { className: "size-3.5" }),
          busy ? "Calling…" : label
        ]
      }
    ),
    phoneReady ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        title: "Call from the CRM browser phone (headset)",
        onClick: () => {
          if (!browserPhone.dial({ number: String(mobile), customerId, leadId, applicationId })) toast.error("Browser phone is not ready");
        },
        className: `inline-flex items-center justify-center gap-1.5 rounded-lg border border-input bg-background px-3 ${compact ? "py-1" : "py-1.5"} text-xs font-semibold hover:bg-accent transition`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Headset, { className: "size-3.5" }),
          "Browser call"
        ]
      }
    ) : null
  ] });
}
export {
  CallButton as C
};
