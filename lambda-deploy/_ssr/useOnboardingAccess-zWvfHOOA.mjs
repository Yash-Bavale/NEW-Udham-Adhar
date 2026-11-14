import { r as reactExports } from "../_libs/react.mjs";
import { j as useServerFn, ak as captureAccessToken, au as readAccessToken, p as storeAccessToken } from "./router-QgJicixe.mjs";
import { e as exchangeOnboardingAccess } from "./customer-access.functions-N17nWKMW.mjs";
function useOnboardingAccess(leadCode) {
  const exchange = useServerFn(exchangeOnboardingAccess);
  const [token, setToken] = reactExports.useState(void 0);
  reactExports.useEffect(() => {
    let cancelled = false;
    captureAccessToken(leadCode);
    const ob = readAccessToken(leadCode, "ob");
    if (ob) {
      setToken(ob);
      return;
    }
    const co = readAccessToken(leadCode, "co");
    if (!co) {
      setToken(null);
      return;
    }
    exchange({ data: { leadCode, accessToken: co } }).then((r) => {
      if (cancelled) return;
      if (r.ok && r.accessToken) {
        storeAccessToken(leadCode, r.accessToken);
        setToken(r.accessToken);
      } else setToken(null);
    }).catch(() => !cancelled && setToken(null));
    return () => {
      cancelled = true;
    };
  }, [leadCode, exchange]);
  return token;
}
export {
  useOnboardingAccess as u
};
