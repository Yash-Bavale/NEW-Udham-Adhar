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

function playSingleRing(ctx: AudioContext, startOffset: number) {
  const now = ctx.currentTime + startOffset;
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(587.33, now);
  osc1.frequency.setValueAtTime(880, now + 0.12);
  gain1.gain.setValueAtTime(0.001, now);
  gain1.gain.linearRampToValueAtTime(0.9, now + 0.03);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.46);

  const now2 = now + 0.5;
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(659.25, now2);
  osc2.frequency.setValueAtTime(987.77, now2 + 0.12);
  gain2.gain.setValueAtTime(0.001, now2);
  gain2.gain.linearRampToValueAtTime(1.0, now2 + 0.03);
  gain2.gain.exponentialRampToValueAtTime(0.001, now2 + 0.5);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(now2);
  osc2.stop(now2 + 0.51);
}

export function playLeadRingSound() {
  try {
    if (typeof window === "undefined") return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    // Loud ring, repeats 3x (~1.45s per ring).
    const CYCLE = 1.45;
    playSingleRing(ctx, 0);
    playSingleRing(ctx, CYCLE);
    playSingleRing(ctx, CYCLE * 2);
    setTimeout(() => { ctx.close().catch(() => {}); }, CYCLE * 3 * 1000 + 200);
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
