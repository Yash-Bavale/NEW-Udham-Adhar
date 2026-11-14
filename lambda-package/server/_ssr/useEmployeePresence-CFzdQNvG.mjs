import { r as reactExports } from "../_libs/react.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BO-AEXHh.mjs";
import { c as createServerFn } from "./server-BFjd5iLF.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CWWVaY7_.mjs";
import { b as useRouterState } from "../_libs/tanstack__react-router.mjs";
import { o as object, n as number, s as string, _ as _enum, r as record, d as any } from "../_libs/zod.mjs";
const recordHeartbeat = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  sessionId: string().min(1),
  presenceStatus: _enum(["ACTIVE", "IDLE", "AWAY", "OFFLINE"]),
  currentPage: string().default("/admin"),
  currentModule: string().default("General"),
  currentOrderId: string().uuid().nullable().optional(),
  currentOrderCode: string().nullable().optional(),
  lastActionText: string().nullable().optional(),
  activeSecondsDelta: number().int().nonnegative().default(0),
  idleSecondsDelta: number().int().nonnegative().default(0),
  awaySecondsDelta: number().int().nonnegative().default(0),
  browser: string().default("Chrome"),
  browserVersion: string().nullable().optional(),
  os: string().default("Windows"),
  deviceType: string().default("Desktop")
}).parse(i)).handler(createSsrRpc("8c50e4b184a9242cfa93c769a651c3c143078de3153178a016cf1c8a2a872e92"));
const logLoginAttempt = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  sessionId: string().min(1),
  loginMethod: _enum(["password", "google"]).default("password"),
  browser: string().default("Chrome"),
  browserVersion: string().nullable().optional(),
  os: string().default("Windows"),
  deviceType: string().default("Desktop")
}).parse(i)).handler(createSsrRpc("00c97d8be02d8b1fc19f0a6d3a703142cafd52f92e2c47730b5fcc43a526750e"));
const verifyGoogleStaffAccess = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("4239650687724d39355ca31c904d3d50b8f52f2aab7656030e4ad420d2d85bf3"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  sessionId: string().min(1)
}).parse(i)).handler(createSsrRpc("e32ba0e0b922ed15816a88dc599cbb4cb3ebd86f92c5c7497ba65be3f3abb840"));
const listEmployeeSessionsAdmin = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  statusFilter: _enum(["all", "active", "idle", "away", "offline"]).default("all"),
  searchQuery: string().optional().default(""),
  limit: number().int().min(1).max(200).default(50)
}).parse(i)).handler(createSsrRpc("dfc8827427f508213ef859dcf3ff5322fbb0315ce988f62b9a4d225f8b5f00a4"));
const forceLogoutSessionAdmin = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  sessionId: string().min(1),
  reason: string().default("Force logged out by administrator")
}).parse(i)).handler(createSsrRpc("a1710990f8c46ca07241f6449d89b9872f8207edabe560fd0fd03015131b3a67"));
const forceLogoutAllSessionsAdmin = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  employeeId: string().uuid(),
  reason: string().default("Force logged out of all devices by administrator")
}).parse(i)).handler(createSsrRpc("0bab5649c0dce6e11c70bbe53573667f8649ef75ff6566b7acbebd24f0762b94"));
const getEmployeeSecurityDetailAdmin = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  employeeId: string().uuid()
}).parse(i)).handler(createSsrRpc("f238b499d9b67901c07679f4b77a6fab3088b18854776eb76b1205e72407e1df"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => object({
  sessionId: string().optional().nullable(),
  actionType: string().min(1),
  orderId: string().uuid().optional().nullable(),
  ticketId: string().uuid().optional().nullable(),
  previousStatus: string().optional().nullable(),
  newStatus: string().optional().nullable(),
  previousStage: string().optional().nullable(),
  newStage: string().optional().nullable(),
  metadata: record(string(), any()).default({})
}).parse(i)).handler(createSsrRpc("2797683dbec91af8c1fe604362b9345b671544f8480685016f0b41b5b4ccc971"));
createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("fb4a0b8d71dcf2c85d64454ce89c6338feaca0ce0e6dc5af787d571444e3c27e"));
function getBrowserInfo() {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return { browser: "Chrome", os: "Windows", deviceType: "Desktop" };
  }
  const ua = navigator.userAgent;
  let browser = "Chrome";
  let browserVersion;
  if (ua.includes("Firefox/")) {
    browser = "Firefox";
    browserVersion = ua.split("Firefox/")[1]?.split(" ")[0];
  } else if (ua.includes("Edg/")) {
    browser = "Edge";
    browserVersion = ua.split("Edg/")[1]?.split(" ")[0];
  } else if (ua.includes("Safari/") && !ua.includes("Chrome")) {
    browser = "Safari";
    browserVersion = ua.split("Version/")[1]?.split(" ")[0];
  } else if (ua.includes("Chrome/")) {
    browser = "Chrome";
    browserVersion = ua.split("Chrome/")[1]?.split(" ")[0];
  }
  let os = "Windows";
  if (ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  let deviceType = "Desktop";
  if (/Mobi|Android|iPhone|iPad/i.test(ua)) deviceType = "Mobile";
  return { browser, browserVersion, os, deviceType };
}
function getOrCreateSessionId() {
  if (typeof window === "undefined") return "sess_default";
  try {
    let sid = window.sessionStorage.getItem("crm_employee_session_id");
    if (!sid) {
      sid = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      window.sessionStorage.setItem("crm_employee_session_id", sid);
    }
    return sid;
  } catch {
    return `sess_${Date.now()}`;
  }
}
function useEmployeePresence(options) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const optionsRef = reactExports.useRef(options);
  optionsRef.current = options;
  const currentPathRef = reactExports.useRef(currentPath);
  currentPathRef.current = currentPath;
  const lastActivityRef = reactExports.useRef(Date.now());
  const activeSecondsRef = reactExports.useRef(0);
  const idleSecondsRef = reactExports.useRef(0);
  const awaySecondsRef = reactExports.useRef(0);
  const statusRef = reactExports.useRef("ACTIVE");
  reactExports.useEffect(() => {
    if (typeof window === "undefined") return;
    const sessionId = getOrCreateSessionId();
    const { browser, browserVersion, os, deviceType } = getBrowserInfo();
    const handleUserActivity = () => {
      lastActivityRef.current = Date.now();
      if (document.visibilityState === "visible") {
        statusRef.current = "ACTIVE";
      }
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        statusRef.current = "AWAY";
      } else {
        lastActivityRef.current = Date.now();
        statusRef.current = "ACTIVE";
        void sendHeartbeat();
      }
    };
    const handleFocus = () => {
      lastActivityRef.current = Date.now();
      statusRef.current = "ACTIVE";
      void sendHeartbeat();
    };
    window.addEventListener("pointerdown", handleUserActivity, { passive: true });
    window.addEventListener("keydown", handleUserActivity, { passive: true });
    window.addEventListener("click", handleUserActivity, { passive: true });
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    const ticker = setInterval(() => {
      const now = Date.now();
      const inactiveMs = now - lastActivityRef.current;
      if (document.visibilityState === "hidden") {
        statusRef.current = "AWAY";
        awaySecondsRef.current += 1;
      } else if (inactiveMs > 10 * 60 * 1e3) {
        statusRef.current = "IDLE";
        idleSecondsRef.current += 1;
      } else {
        statusRef.current = "ACTIVE";
        activeSecondsRef.current += 1;
      }
    }, 1e3);
    const sendHeartbeat = async () => {
      const activeDelta = activeSecondsRef.current;
      const idleDelta = idleSecondsRef.current;
      const awayDelta = awaySecondsRef.current;
      activeSecondsRef.current = 0;
      idleSecondsRef.current = 0;
      awaySecondsRef.current = 0;
      const path = currentPathRef.current || "/admin";
      const opts = optionsRef.current;
      try {
        const res = await recordHeartbeat({
          data: {
            sessionId,
            presenceStatus: statusRef.current,
            currentPage: path,
            currentModule: opts?.currentModule || (path.includes("order") ? "Orders" : path.includes("support") || path.includes("ticket") ? "Support" : path.includes("lead") ? "Leads" : "General"),
            currentOrderId: opts?.currentOrderId ?? null,
            currentOrderCode: opts?.currentOrderCode ?? null,
            lastActionText: opts?.lastActionText ?? null,
            activeSecondsDelta: activeDelta,
            idleSecondsDelta: idleDelta,
            awaySecondsDelta: awayDelta,
            browser,
            browserVersion,
            os,
            deviceType
          }
        });
        if (res && res.terminated) {
          alert(res.logout_reason || "Your active session has been terminated by an administrator.");
          const { supabase } = await import("./client-BX5UfqqR.mjs");
          try {
            window.sessionStorage.removeItem("crm_employee_session_id");
          } catch {
          }
          await supabase.auth.signOut({ scope: "local" });
          window.location.href = "/admin-login";
        }
      } catch (err) {
        console.warn("[EmployeePresence] Heartbeat error:", err);
      }
    };
    void sendHeartbeat();
    const heartbeatTimer = setInterval(sendHeartbeat, 3e4);
    return () => {
      clearInterval(ticker);
      clearInterval(heartbeatTimer);
      window.removeEventListener("pointerdown", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
}
export {
  listEmployeeSessionsAdmin as a,
  forceLogoutAllSessionsAdmin as b,
  getEmployeeSecurityDetailAdmin as c,
  forceLogoutSessionAdmin as f,
  getOrCreateSessionId as g,
  logLoginAttempt as l,
  useEmployeePresence as u,
  verifyGoogleStaffAccess as v
};
