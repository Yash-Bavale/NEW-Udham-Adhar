import { useEffect, useRef } from "react";
import { recordEmployeeHeartbeat } from "@/lib/crm/employee-presence.functions";
import { useRouterState } from "@tanstack/react-router";

function getBrowserInfo(): { browser: string; os: string; deviceType: string } {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return { browser: "Chrome", os: "Windows", deviceType: "Desktop" };
  }

  const ua = navigator.userAgent;
  let browser = "Chrome";
  if (ua.includes("Firefox/")) browser = "Firefox";
  else if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("Safari/") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Chrome/")) browser = "Chrome";

  let os = "Windows";
  if (ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

  let deviceType = "Desktop";
  if (/Mobi|Android|iPhone|iPad/i.test(ua)) deviceType = "Mobile";

  return { browser, os, deviceType };
}

function getOrCreateSessionId(): string {
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

export function useEmployeePresence(options?: {
  currentModule?: string;
  currentOrderId?: string | null;
  currentOrderCode?: string | null;
  lastActionText?: string | null;
}) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const lastActivityRef = useRef<number>(Date.now());
  const activeSecondsRef = useRef<number>(0);
  const idleSecondsRef = useRef<number>(0);
  const awaySecondsRef = useRef<number>(0);
  const statusRef = useRef<"ACTIVE" | "IDLE" | "AWAY" | "OFFLINE">("ACTIVE");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sessionId = getOrCreateSessionId();
    const { browser, os, deviceType } = getBrowserInfo();

    // Reset activity timer on CRM user interaction
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
      }
    };

    window.addEventListener("pointerdown", handleUserActivity, { passive: true });
    window.addEventListener("keydown", handleUserActivity, { passive: true });
    window.addEventListener("click", handleUserActivity, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 1-second ticker for precise duration accumulation
    const ticker = setInterval(() => {
      const now = Date.now();
      const inactiveMs = now - lastActivityRef.current;

      if (document.visibilityState === "hidden") {
        statusRef.current = "AWAY";
        awaySecondsRef.current += 1;
      } else if (inactiveMs > 5 * 60 * 1000) {
        // > 5 minutes without interaction -> IDLE
        statusRef.current = "IDLE";
        idleSecondsRef.current += 1;
      } else {
        statusRef.current = "ACTIVE";
        activeSecondsRef.current += 1;
      }
    }, 1000);

    // Heartbeat every 30 seconds
    const sendHeartbeat = async () => {
      const activeDelta = activeSecondsRef.current;
      const idleDelta = idleSecondsRef.current;
      const awayDelta = awaySecondsRef.current;

      activeSecondsRef.current = 0;
      idleSecondsRef.current = 0;
      awaySecondsRef.current = 0;

      try {
        const res = await recordEmployeeHeartbeat({
          data: {
            sessionId,
            presenceStatus: statusRef.current,
            currentPage: currentPath,
            currentModule: options?.currentModule || (currentPath.includes("order") ? "Orders" : currentPath.includes("support") || currentPath.includes("ticket") ? "Support" : "CRM"),
            currentOrderId: options?.currentOrderId ?? null,
            currentOrderCode: options?.currentOrderCode ?? null,
            lastActionText: options?.lastActionText ?? null,
            activeSecondsDelta: activeDelta,
            idleSecondsDelta: idleDelta,
            awaySecondsDelta: awayDelta,
            browser,
            os,
            deviceType,
            ipAddress: "103.21.58.92",
          },
        });

        if (res && res.terminated) {
          alert("Your active session has been terminated by an administrator.");
          const { supabase } = await import("@/integrations/supabase/client");
          await supabase.auth.signOut();
          window.location.href = "/admin-login";
        }
      } catch (err) {
        // Non-blocking telemetry error
      }
    };

    // Initial heartbeat
    void sendHeartbeat();
    const heartbeatTimer = setInterval(sendHeartbeat, 30_000);

    return () => {
      clearInterval(ticker);
      clearInterval(heartbeatTimer);
      window.removeEventListener("pointerdown", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [currentPath, options?.currentModule, options?.currentOrderId, options?.currentOrderCode, options?.lastActionText]);
}
