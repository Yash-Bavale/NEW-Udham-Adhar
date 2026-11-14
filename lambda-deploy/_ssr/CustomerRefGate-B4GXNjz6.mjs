import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { i as useParams } from "../_libs/tanstack__react-router.mjs";
import { j as useServerFn, ak as captureAccessToken, al as pickAccessToken } from "./router-QgJicixe.mjs";
import { r as resolveCustomerRef, c as customerRefForCode } from "./customer-access.functions-N17nWKMW.mjs";
const LeadCodeCtx = reactExports.createContext("");
const useCustomerLeadCode = () => reactExports.useContext(LeadCodeCtx);
const REF_RE = /^[a-f0-9]{32}$/;
const CODE_RE = /^[A-Za-z]{2}-\d{4}-\d{6}$/;
const cacheKey = (code) => `bhs_ref:${code.toUpperCase()}`;
const useIso = typeof window === "undefined" ? reactExports.useEffect : reactExports.useLayoutEffect;
function swapUrl(from, to) {
  const { pathname, search, hash } = window.location;
  const next = pathname.replace(encodeURIComponent(from), to).replace(from, to);
  if (next !== pathname) window.history.replaceState(window.history.state, "", next + search + hash);
}
function CustomerRefGate({ children }) {
  const { leadCode: param = "" } = useParams({ strict: false });
  const isRef = REF_RE.test(param);
  const [code, setCode] = reactExports.useState(isRef ? null : param);
  const resolve = useServerFn(resolveCustomerRef);
  const refFor = useServerFn(customerRefForCode);
  reactExports.useEffect(() => {
    if (!isRef) {
      setCode(param);
      return;
    }
    let live = true;
    setCode(null);
    resolve({ data: { ref: param } }).then((r) => {
      if (!live) return;
      if (r.leadCode) {
        try {
          sessionStorage.setItem(cacheKey(r.leadCode), param);
        } catch {
        }
      }
      setCode(r.leadCode ?? "XX-0000-000000");
    }).catch(() => live && setCode("XX-0000-000000"));
    return () => {
      live = false;
    };
  }, [param, isRef, resolve]);
  useIso(() => {
    if (isRef || !CODE_RE.test(param) || typeof window === "undefined") return;
    let cached = null;
    try {
      cached = sessionStorage.getItem(cacheKey(param));
    } catch {
    }
    if (cached) {
      swapUrl(param, cached);
      return;
    }
    captureAccessToken(param);
    const token = pickAccessToken(param, ["ob", "co"]);
    if (!token) return;
    refFor({ data: { leadCode: param, accessToken: token } }).then((r) => {
      if (!r.ref) return;
      try {
        sessionStorage.setItem(cacheKey(param), r.ref);
      } catch {
      }
      swapUrl(param, r.ref);
    }).catch(() => {
    });
  }, [param, isRef, refFor]);
  if (!code) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-xl px-4 py-20 text-center text-sm text-muted-foreground", children: "Loading…" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(LeadCodeCtx.Provider, { value: code, children });
}
export {
  CustomerRefGate as C,
  useCustomerLeadCode as u
};
