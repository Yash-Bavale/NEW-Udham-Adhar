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

export function playLeadRingSound() {
  try {
    if (typeof window === "undefined") return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;
    // Tone 1 (Ding)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.setValueAtTime(880, now + 0.12); // A5

    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.linearRampToValueAtTime(0.35, now + 0.03);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.41);

    // Tone 2 (Dong - second ring after 450ms)
    const now2 = now + 0.45;
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(659.25, now2); // E5
    osc2.frequency.setValueAtTime(987.77, now2 + 0.12); // B5

    gain2.gain.setValueAtTime(0.001, now2);
    gain2.gain.linearRampToValueAtTime(0.4, now2 + 0.03);
    gain2.gain.exponentialRampToValueAtTime(0.001, now2 + 0.45);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now2);
    osc2.stop(now2 + 0.46);

    osc2.onended = () => ctx.close().catch(() => {});
  } catch {
    // Ignore audio autoplay restrictions if user hasn't interacted yet
  }
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
      if (typeof window === "undefined" || !("Notification" in window)) return;
      
      // Auto-request permission if still default
      let currentPermission = Notification.permission;
      if (currentPermission === "default") {
        currentPermission = await Notification.requestPermission();
        setPermission(currentPermission);
      }
      
      if (currentPermission !== "granted") return;

      try {
        const reg = await navigator.serviceWorker.ready;
        if (reg && reg.active) {
          reg.active.postMessage({ type: "notify", payload });
        } else {
          new Notification(payload.title, { body: payload.body, tag: payload.tag, icon: "/favicon.ico" });
        }
      } catch {
        try {
          new Notification(payload.title, { body: payload.body, tag: payload.tag, icon: "/favicon.ico" });
        } catch { /* noop */ }
      }
    },
    [],
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
