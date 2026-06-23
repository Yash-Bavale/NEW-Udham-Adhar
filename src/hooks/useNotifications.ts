// Browser push/local notifications (Final_CRM Part E).
// Registers /sw.js, owns permission state, and exposes a notify() helper.
// Notifications are triggered locally from realtime events (no VAPID/Web Push
// server) so they work without backend keys yet still feel like push to staff.
import { useCallback, useEffect, useState } from "react";

const LS_KEY = "udyam.notifications.dismissed";

type Permission = NotificationPermission | "unsupported";

export interface NotifyPayload {
  title: string;
  body?: string;
  url?: string;
  tag?: string;
}

export function useNotifications() {
  const [permission, setPermission] = useState<Permission>("default");
  const [registered, setRegistered] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setPermission("unsupported");
      return;
    }
    setPermission(Notification.permission);
    setDismissed(localStorage.getItem(LS_KEY) === "1");

    navigator.serviceWorker
      .register("/sw.js")
      .then(() => setRegistered(true))
      .catch(() => setRegistered(false));
  }, []);

  const request = useCallback(async () => {
    if (!("Notification" in window)) return "unsupported" as const;
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  const dismissBanner = useCallback(() => {
    localStorage.setItem(LS_KEY, "1");
    setDismissed(true);
  }, []);

  const notify = useCallback(
    async (payload: NotifyPayload) => {
      if (permission !== "granted") return;
      try {
        const reg = await navigator.serviceWorker.ready;
        reg.active?.postMessage({ type: "notify", payload });
      } catch {
        // Fallback to direct Notification if SW unavailable.
        try {
          new Notification(payload.title, { body: payload.body, tag: payload.tag });
        } catch { /* noop */ }
      }
    },
    [permission],
  );

  return {
    permission,
    registered,
    supported: permission !== "unsupported",
    canPrompt: permission === "default",
    granted: permission === "granted",
    dismissed,
    request,
    dismissBanner,
    notify,
  };
}
