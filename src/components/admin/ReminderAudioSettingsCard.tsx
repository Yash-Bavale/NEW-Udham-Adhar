import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Volume2, VolumeX, Play, Bell, BellRing, Flame, Sparkles, Check } from "lucide-react";
import { SectionCard } from "@/components/admin/ui";
import {
  getSoundSettings,
  saveSoundSettings,
  playReminderSound,
  showDesktopNotification,
  type SoundTone,
  type SoundSettings,
} from "@/lib/audio/reminder-sounds";

const SOUND_OPTIONS: { id: SoundTone; label: string; description: string }[] = [
  { id: "chime", label: "Harmonic Chime (Default)", description: "3-note melodic chime (pleasant & clear)" },
  { id: "bell", label: "Crystal Bell", description: "High-resonance ringing alert bell" },
  { id: "digital_ring", label: "Digital Ring", description: "Urgent dual-pulse digital beep" },
  { id: "radar", label: "Radar Pulse", description: "Modern sweeping radar ping" },
  { id: "soft_ping", label: "Soft Ping", description: "Subtle non-intrusive soft tone" },
];

export function ReminderAudioSettingsCard() {
  const [settings, setSettings] = useState<SoundSettings>(getSoundSettings);
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setHasPermission(Notification.permission === "granted");
    }
  }, []);

  const update = (partial: Partial<SoundSettings>) => {
    const updated = saveSoundSettings(partial);
    setSettings(updated);
    toast.success("Sound settings saved");
  };

  const handleTest = (tone?: SoundTone) => {
    playReminderSound(tone ?? settings.tone, settings.volume);
    toast.info(`Playing preview for ${tone ?? settings.tone}`);
  };

  const requestPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return toast.error("Desktop notifications are not supported in this browser");
    }
    const res = await Notification.requestPermission();
    setHasPermission(res === "granted");
    if (res === "granted") {
      toast.success("Desktop notifications enabled!");
      showDesktopNotification("🔥 Hot Order Alerts Enabled", {
        body: "You will now receive desktop popup notifications when a customer callback is due.",
      });
    } else {
      toast.error("Notification permission denied in browser");
    }
  };

  return (
    <SectionCard
      title="🔔 Order Callback & Hot Order Audio Alerts"
      action={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleTest()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 border border-indigo-200 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition cursor-pointer shadow-2xs"
          >
            <Play className="size-3.5" /> Test Sound Alert
          </button>
        </div>
      }
    >
      <div className="p-5 space-y-6 text-slate-800">
        <div className="text-xs text-slate-600">
          Configure the sound and screen notifications triggered on employee laptops whenever a customer callback reminder ends and the order transitions into a <b className="text-rose-600">🔥 Hot Order</b>.
        </div>

        {/* 1. Tone Selector */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Alert Sound Tone
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SOUND_OPTIONS.map((opt) => {
              const isSelected = settings.tone === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    update({ tone: opt.id });
                    playReminderSound(opt.id, settings.volume);
                  }}
                  className={`relative flex flex-col justify-between rounded-xl border p-3.5 transition cursor-pointer select-none ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs"
                      : "border-slate-200 bg-slate-50/40 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isSelected ? "text-blue-950" : "text-slate-800"}`}>
                        {opt.label}
                      </span>
                      {isSelected && <Check className="size-4 text-blue-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {opt.description}
                    </p>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTest(opt.id);
                      }}
                      className="inline-flex items-center gap-1 rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700 hover:bg-slate-100 shadow-2xs"
                    >
                      <Play className="size-2.5" /> Play
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Volume Slider & Enable Toggle */}
        <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                {settings.volume === 0 || !settings.enabled ? <VolumeX className="size-4 text-slate-400" /> : <Volume2 className="size-4 text-slate-700" />}
                Alert Volume ({Math.round(settings.volume * 100)}%)
              </label>
              <button
                type="button"
                onClick={() => update({ enabled: !settings.enabled })}
                className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  settings.enabled ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                }`}
              >
                {settings.enabled ? "Sound: ON" : "Sound: MUTED"}
              </button>
            </div>

            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.volume}
              onChange={(e) => update({ volume: parseFloat(e.target.value) })}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <BellRing className="size-4 text-slate-700" />
                Browser Desktop Notifications
              </label>
              {hasPermission ? (
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Allowed
                </span>
              ) : (
                <button
                  type="button"
                  onClick={requestPermission}
                  className="rounded bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-blue-700"
                >
                  Enable Notifications
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-500">
              Allows the browser to pop up system banner alerts when callbacks are due, even if you are working on another tab or window.
            </p>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
