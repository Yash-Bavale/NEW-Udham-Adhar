const STORAGE_KEY = "bhs_reminder_sound_settings";
const DEFAULT_SOUND_SETTINGS = {
  enabled: true,
  tone: "chime",
  volume: 0.8,
  desktopNotifications: true,
  customAudioUrl: null,
  customAudioName: null
};
let inMemorySettings = { ...DEFAULT_SOUND_SETTINGS };
let preloadedAudio = null;
let currentPreloadedUrl = null;
let globalAudioCtx = null;
function getOrCreateAudioContext() {
  if (typeof window === "undefined") return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!globalAudioCtx || globalAudioCtx.state === "closed") {
    globalAudioCtx = new AudioCtx();
  }
  if (globalAudioCtx.state === "suspended") {
    globalAudioCtx.resume().catch(() => {
    });
  }
  return globalAudioCtx;
}
if (typeof window !== "undefined") {
  const unlockAudio = () => {
    try {
      const ctx = getOrCreateAudioContext();
      if (ctx && ctx.state === "suspended") {
        ctx.resume().catch(() => {
        });
      }
      if (preloadedAudio) {
        preloadedAudio.load();
      }
    } catch {
    }
  };
  window.addEventListener("pointerdown", unlockAudio, { passive: true });
  window.addEventListener("keydown", unlockAudio, { passive: true });
  window.addEventListener("click", unlockAudio, { passive: true });
}
function preloadAudio(url) {
  if (typeof window === "undefined" || !url) {
    preloadedAudio = null;
    currentPreloadedUrl = null;
    return;
  }
  if (currentPreloadedUrl === url && preloadedAudio) {
    return;
  }
  try {
    const audio = new Audio(url);
    audio.preload = "auto";
    audio.load();
    preloadedAudio = audio;
    currentPreloadedUrl = url;
  } catch (err) {
    console.warn("[preloadAudio] failed to preload:", err);
  }
}
function getSoundSettings() {
  if (typeof window === "undefined") return DEFAULT_SOUND_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      inMemorySettings = { ...DEFAULT_SOUND_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {
  }
  return inMemorySettings;
}
function syncGlobalSoundSettings(settings) {
  const current = getSoundSettings();
  const updated = { ...current, ...settings };
  inMemorySettings = updated;
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (err) {
    console.warn("[syncGlobalSoundSettings] localStorage sync warn:", err);
  }
  if (updated.customAudioUrl) {
    preloadAudio(updated.customAudioUrl);
  }
  return updated;
}
function saveSoundSettings(settings) {
  return syncGlobalSoundSettings(settings);
}
function playReminderSound(toneOverride, volumeOverride, customUrlOverride) {
  if (typeof window === "undefined") return;
  const settings = getSoundSettings();
  if (!settings.enabled && toneOverride === void 0) return;
  const tone = toneOverride ?? settings.tone;
  const volume = volumeOverride !== void 0 ? volumeOverride : settings.volume;
  const customUrl = customUrlOverride !== void 0 ? customUrlOverride : settings.customAudioUrl;
  const clampedVolume = Math.max(0, Math.min(1, volume));
  if (tone === "custom" && customUrl) {
    try {
      const audio = new Audio(customUrl);
      audio.volume = clampedVolume;
      const playPromise = audio.play();
      if (playPromise !== void 0) {
        playPromise.catch((err) => {
          console.warn("[playReminderSound] custom audio play failed, falling back to chime:", err);
          playSynthesizedTone("chime", clampedVolume);
        });
      }
      return;
    } catch (err) {
      console.warn("[playReminderSound] custom audio error:", err);
      playSynthesizedTone("chime", clampedVolume);
      return;
    }
  }
  playSynthesizedTone(tone === "custom" ? "chime" : tone, clampedVolume);
}
function playSynthesizedTone(tone, volume) {
  try {
    const ctx = getOrCreateAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {
      });
    }
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), ctx.currentTime);
    masterGain.connect(ctx.destination);
    const now = ctx.currentTime;
    switch (tone) {
      case "bell": {
        const freqs = [880, 1760, 2640];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now);
          const decay = 1.2 - idx * 0.3;
          gain.gain.setValueAtTime(0.3 / (idx + 1), now);
          gain.gain.exponentialRampToValueAtTime(1e-4, now + decay);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + decay);
        });
        break;
      }
      case "digital_ring": {
        [0, 0.18].forEach((startTime) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "square";
          osc.frequency.setValueAtTime(1046.5, now + startTime);
          gain.gain.setValueAtTime(0.2, now + startTime);
          gain.gain.exponentialRampToValueAtTime(1e-3, now + startTime + 0.12);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now + startTime);
          osc.stop(now + startTime + 0.12);
        });
        break;
      }
      case "radar": {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(1e-4, now + 0.7);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.7);
        break;
      }
      case "soft_ping": {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, now);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.4);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
      }
      case "chime":
      default: {
        const notes = [
          { freq: 659.25, time: 0, dur: 0.5 },
          { freq: 830.61, time: 0.12, dur: 0.6 },
          { freq: 987.77, time: 0.24, dur: 0.8 }
        ];
        notes.forEach(({ freq, time, dur }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + time);
          gain.gain.setValueAtTime(0.3, now + time);
          gain.gain.exponentialRampToValueAtTime(1e-4, now + time + dur);
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
async function showDesktopNotification(title, options, onClickUrl) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  const settings = getSoundSettings();
  if (!settings.desktopNotifications) return;
  if (Notification.permission === "default") {
    try {
      await Notification.requestPermission();
    } catch {
    }
  }
  if (Notification.permission === "granted") {
    try {
      const notif = new Notification(title, {
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        requireInteraction: true,
        ...options
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
export {
  playReminderSound as a,
  showDesktopNotification as b,
  saveSoundSettings as c,
  getSoundSettings as g,
  preloadAudio as p,
  syncGlobalSoundSettings as s
};
