// Web Audio API synthesized sound generator & custom audio file upload support.
// 100% reliable in modern browsers with support for custom uploaded audio (.mp3, .wav, .ogg, etc.)

export type SoundTone = "chime" | "bell" | "digital_ring" | "radar" | "soft_ping" | "custom";

export interface SoundSettings {
  enabled: boolean;
  tone: SoundTone;
  volume: number; // 0.0 to 1.0
  desktopNotifications: boolean;
  customAudioUrl?: string | null;
  customAudioName?: string | null;
}

const STORAGE_KEY = "bhs_reminder_sound_settings";

export const DEFAULT_SOUND_SETTINGS: SoundSettings = {
  enabled: true,
  tone: "chime",
  volume: 0.8,
  desktopNotifications: true,
  customAudioUrl: null,
  customAudioName: null,
};

export function getSoundSettings(): SoundSettings {
  if (typeof window === "undefined") return DEFAULT_SOUND_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SOUND_SETTINGS;
    return { ...DEFAULT_SOUND_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SOUND_SETTINGS;
  }
}

export function saveSoundSettings(settings: Partial<SoundSettings>): SoundSettings {
  const current = getSoundSettings();
  const updated = { ...current, ...settings };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("[saveSoundSettings] failed to persist:", err);
  }
  return updated;
}

/**
 * Play a sound tone (either custom uploaded audio file or synthesized Web Audio tone).
 */
export function playReminderSound(toneOverride?: SoundTone, volumeOverride?: number) {
  if (typeof window === "undefined") return;

  const settings = getSoundSettings();
  if (!settings.enabled && toneOverride === undefined) return;

  const tone = toneOverride ?? settings.tone;
  const volume = volumeOverride !== undefined ? volumeOverride : settings.volume;

  // 1. If custom uploaded audio is selected and available
  if (tone === "custom" && settings.customAudioUrl) {
    try {
      const audio = new Audio(settings.customAudioUrl);
      audio.volume = Math.max(0, Math.min(1, volume));
      audio.play().catch((err) => {
        console.warn("[playReminderSound] custom audio failed to play, falling back to chime:", err);
        playSynthesizedTone("chime", volume);
      });
      return;
    } catch (err) {
      console.warn("[playReminderSound] custom audio error:", err);
    }
  }

  // 2. Otherwise play synthesized tone
  playSynthesizedTone(tone === "custom" ? "chime" : tone, volume);
}

/**
 * Synthesize audio tones using the Web Audio API.
 */
function playSynthesizedTone(tone: Exclude<SoundTone, "custom">, volume: number) {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), ctx.currentTime);
    masterGain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (tone) {
      case "bell": {
        // High resonance crystal bell tone
        const freqs = [880, 1760, 2640];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now);

          const decay = 1.2 - idx * 0.3;
          gain.gain.setValueAtTime(0.3 / (idx + 1), now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + decay);
        });
        break;
      }

      case "digital_ring": {
        // Urgent 2-beep digital alert
        [0, 0.18].forEach((startTime) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "square";
          osc.frequency.setValueAtTime(1046.5, now + startTime); // C6

          gain.gain.setValueAtTime(0.2, now + startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, now + startTime + 0.12);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now + startTime);
          osc.stop(now + startTime + 0.12);
        });
        break;
      }

      case "radar": {
        // Modern radar ping
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.35); // A5

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.7);
        break;
      }

      case "soft_ping": {
        // Gentle soft ping
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, now); // C5

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
      }

      case "chime":
      default: {
        // 3-note ascending melodic chime (E5 -> G#5 -> B5)
        const notes = [
          { freq: 659.25, time: 0, dur: 0.5 },
          { freq: 830.61, time: 0.12, dur: 0.6 },
          { freq: 987.77, time: 0.24, dur: 0.8 },
        ];

        notes.forEach(({ freq, time, dur }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + time);

          gain.gain.setValueAtTime(0.3, now + time);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now + time);
          osc.stop(now + time + dur);
        });
        break;
      }
    }
  } catch (err) {
    console.warn("[playReminderSound] audio error:", err);
  }
}

/**
 * Trigger a native browser notification if granted.
 */
export async function showDesktopNotification(title: string, options?: NotificationOptions, onClickUrl?: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;

  const settings = getSoundSettings();
  if (!settings.desktopNotifications) return;

  if (Notification.permission === "default") {
    try {
      await Notification.requestPermission();
    } catch {}
  }

  if (Notification.permission === "granted") {
    try {
      const notif = new Notification(title, {
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        requireInteraction: true,
        ...options,
      });

      if (onClickUrl) {
        notif.onclick = () => {
          window.focus();
          window.location.href = onClickUrl;
          notif.close();
        };
      }
    } catch (err) {
      console.warn("[showDesktopNotification] notification error:", err);
    }
  }
}
