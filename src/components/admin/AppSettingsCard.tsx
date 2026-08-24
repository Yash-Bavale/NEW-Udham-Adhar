import { useEffect, useState, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getAppSettings, updateCustomerDelayAutocloseMinutes, updateSoundSettings } from "@/lib/settings/app-settings.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Timer, Volume2, VolumeX, Bell, Play, Upload, Music, Check } from "lucide-react";
import { playNotificationSound, type RingtoneTone } from "@/hooks/useNotifications";

function minutesToHHMM(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
function hhmmToMinutes(v: string): number | null {
  const m = /^(\d{1,3}):([0-5]?\d)$/.exec(v.trim());
  if (!m) return null;
  const mins = Number(m[1]) * 60 + Number(m[2]);
  if (mins < 1 || mins > 10080) return null;
  return mins;
}

export function AppSettingsCard() {
  const fetchSettings = useServerFn(getAppSettings);
  const saveMinutes = useServerFn(updateCustomerDelayAutocloseMinutes);
  const saveSound = useServerFn(updateSoundSettings);

  const [value, setValue] = useState("08:00");
  const [leadsSound, setLeadsSound] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("udyam.sound.leads") !== "false";
  });
  const [ordersSound, setOrdersSound] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("udyam.sound.orders") !== "false";
  });
  const [leadsRingtone, setLeadsRingtone] = useState<RingtoneTone>(() => {
    if (typeof window === "undefined") return "chime";
    return (localStorage.getItem("udyam.sound.leads_ringtone") as RingtoneTone) || "chime";
  });
  const [leadsCustomUrl, setLeadsCustomUrl] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("udyam.sound.leads_custom_url") || "";
  });
  const [ordersRingtone, setOrdersRingtone] = useState<RingtoneTone>(() => {
    if (typeof window === "undefined") return "bell";
    return (localStorage.getItem("udyam.sound.orders_ringtone") as RingtoneTone) || "bell";
  });
  const [ordersCustomUrl, setOrdersCustomUrl] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("udyam.sound.orders_custom_url") || "";
  });

  const [leadFileName, setLeadFileName] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("udyam.sound.leads_file_name") || "";
  });
  const [orderFileName, setOrderFileName] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("udyam.sound.orders_file_name") || "";
  });

  const leadFileRef = useRef<HTMLInputElement>(null);
  const orderFileRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSound, setSavingSound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchSettings()
      .then((s) => {
        if (cancelled) return;
        setValue(minutesToHHMM(s.customerDelayAutocloseMinutes));
      })
      .catch(() => toast.error("Failed to load settings"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [fetchSettings]);

  async function onSaveMinutes() {
    const mins = hhmmToMinutes(value);
    if (mins === null) {
      toast.error("Enter time as HH:MM (min 00:01, max 168:00)");
      return;
    }
    setSaving(true);
    try {
      await saveMinutes({ data: { minutes: mins } });
      toast.success(`Customer-delay auto-close set to ${minutesToHHMM(mins)} (business hours)`);
    } catch (e) {
      toast.error((e as Error).message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function onSaveSoundSettings() {
    setSavingSound(true);
    try {
      await saveSound({
        data: {
          leadsSoundEnabled: leadsSound,
          ordersSoundEnabled: ordersSound,
          leadsRingtone,
          leadsCustomUrl,
          ordersRingtone,
          ordersCustomUrl,
        },
      });

      // Update local storage for active browser tab
      localStorage.setItem("udyam.sound.leads", String(leadsSound));
      localStorage.setItem("udyam.sound.orders", String(ordersSound));
      localStorage.setItem("udyam.sound.leads_ringtone", leadsRingtone);
      localStorage.setItem("udyam.sound.leads_custom_url", leadsCustomUrl);
      localStorage.setItem("udyam.sound.orders_ringtone", ordersRingtone);
      localStorage.setItem("udyam.sound.orders_custom_url", ordersCustomUrl);

      toast.success("Notification sound & MP3 ringtones saved!");
    } catch (e) {
      toast.error((e as Error).message || "Failed to save sound settings");
    } finally {
      setSavingSound(false);
    }
  }

  const handleLeadFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Audio file size should be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      if (dataUrl) {
        setLeadsCustomUrl(dataUrl);
        setLeadsRingtone("custom");
        setLeadFileName(file.name);
        localStorage.setItem("udyam.sound.leads_custom_url", dataUrl);
        localStorage.setItem("udyam.sound.leads_ringtone", "custom");
        localStorage.setItem("udyam.sound.leads_file_name", file.name);
        toast.success(`Uploaded Lead MP3 ringtone: ${file.name}`);
        playNotificationSound("preview", "custom", dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOrderFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Audio file size should be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      if (dataUrl) {
        setOrdersCustomUrl(dataUrl);
        setOrdersRingtone("custom");
        setOrderFileName(file.name);
        localStorage.setItem("udyam.sound.orders_custom_url", dataUrl);
        localStorage.setItem("udyam.sound.orders_ringtone", "custom");
        localStorage.setItem("udyam.sound.orders_file_name", file.name);
        toast.success(`Uploaded Order MP3 ringtone: ${file.name}`);
        playNotificationSound("preview", "custom", dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTestLeadSound = () => {
    playNotificationSound("preview", leadsRingtone, leadsCustomUrl);
    toast.info(`Playing preview for Lead Sound (${leadsRingtone})`);
  };

  const handleTestOrderSound = () => {
    playNotificationSound("preview", ordersRingtone, ordersCustomUrl);
    toast.info(`Playing preview for Order Sound (${ordersRingtone})`);
  };

  return (
    <div className="space-y-6">
      {/* Sound Settings Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Volume2 className="h-4 w-4 text-amber-500" />
            Notification Sound &amp; Custom Ringtones
          </CardTitle>
          <Button onClick={onSaveSoundSettings} disabled={loading || savingSound} size="sm">
            {savingSound ? "Saving…" : "Save Sound Settings"}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* LEADS SOUND CONFIGURATION */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  📢 New Lead Notification Sound
                </Label>
                <p className="text-xs text-slate-500">Alert sound played when a new lead arrives or is assigned</p>
              </div>
              <Switch checked={leadsSound} onCheckedChange={setLeadsSound} disabled={loading} />
            </div>

            {leadsSound && (
              <div className="pt-3 space-y-3 border-t border-slate-200/80">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-5 space-y-1">
                    <Label className="text-xs font-medium text-slate-700">Lead Ringtone Tone</Label>
                    <Select value={leadsRingtone} onValueChange={(v) => setLeadsRingtone(v as RingtoneTone)} disabled={loading}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select tone..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chime">🎵 Standard Double Chime</SelectItem>
                        <SelectItem value="bell">🔔 Resonant Bell Ring</SelectItem>
                        <SelectItem value="alert">🚨 High Alert Alarm</SelectItem>
                        <SelectItem value="ding">🎶 Soft Marimba Ding</SelectItem>
                        <SelectItem value="soft">🔉 Gentle Double Pulse</SelectItem>
                        <SelectItem value="custom">🎼 Custom MP3 File / Audio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-4 flex gap-2">
                    <input
                      type="file"
                      ref={leadFileRef}
                      onChange={handleLeadFileUpload}
                      accept="audio/mp3,audio/mpeg,audio/wav,audio/*"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => leadFileRef.current?.click()}
                      className="w-full gap-1.5 bg-white text-xs"
                    >
                      <Upload className="h-3.5 w-3.5 text-slate-600" /> Upload Lead MP3 File
                    </Button>
                  </div>

                  <div className="md:col-span-3">
                    <Button type="button" variant="outline" size="sm" onClick={handleTestLeadSound} className="w-full gap-1.5 bg-white text-xs">
                      <Play className="h-3.5 w-3.5 fill-current text-amber-500" /> Test Lead Sound
                    </Button>
                  </div>
                </div>

                {leadsRingtone === "custom" && (
                  <div className="space-y-1.5 bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700 flex items-center gap-1.5">
                        <Music className="h-3.5 w-3.5 text-amber-500" />
                        {leadFileName ? `MP3 File: ${leadFileName}` : "Direct MP3 Data URL / Link"}
                      </span>
                      {leadsCustomUrl && <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1"><Check className="h-3 w-3" /> Ready</span>}
                    </div>
                    <Input
                      value={leadsCustomUrl}
                      onChange={(e) => {
                        setLeadsCustomUrl(e.target.value);
                        localStorage.setItem("udyam.sound.leads_custom_url", e.target.value);
                      }}
                      placeholder="Upload MP3 file above or paste MP3 URL here (https://.../lead.mp3)"
                      className="text-xs font-mono bg-slate-50"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ORDERS SOUND CONFIGURATION */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  📦 New Order Notification Sound
                </Label>
                <p className="text-xs text-slate-500">Alert sound played when a new order arrives or status updates</p>
              </div>
              <Switch checked={ordersSound} onCheckedChange={setOrdersSound} disabled={loading} />
            </div>

            {ordersSound && (
              <div className="pt-3 space-y-3 border-t border-slate-200/80">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-5 space-y-1">
                    <Label className="text-xs font-medium text-slate-700">Order Ringtone Tone</Label>
                    <Select value={ordersRingtone} onValueChange={(v) => setOrdersRingtone(v as RingtoneTone)} disabled={loading}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select tone..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chime">🎵 Standard Double Chime</SelectItem>
                        <SelectItem value="bell">🔔 Resonant Bell Ring</SelectItem>
                        <SelectItem value="alert">🚨 High Alert Alarm</SelectItem>
                        <SelectItem value="ding">🎶 Soft Marimba Ding</SelectItem>
                        <SelectItem value="soft">🔉 Gentle Double Pulse</SelectItem>
                        <SelectItem value="custom">🎼 Custom MP3 File / Audio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-4 flex gap-2">
                    <input
                      type="file"
                      ref={orderFileRef}
                      onChange={handleOrderFileUpload}
                      accept="audio/mp3,audio/mpeg,audio/wav,audio/*"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => orderFileRef.current?.click()}
                      className="w-full gap-1.5 bg-white text-xs"
                    >
                      <Upload className="h-3.5 w-3.5 text-slate-600" /> Upload Order MP3 File
                    </Button>
                  </div>

                  <div className="md:col-span-3">
                    <Button type="button" variant="outline" size="sm" onClick={handleTestOrderSound} className="w-full gap-1.5 bg-white text-xs">
                      <Play className="h-3.5 w-3.5 fill-current text-indigo-500" /> Test Order Sound
                    </Button>
                  </div>
                </div>

                {ordersRingtone === "custom" && (
                  <div className="space-y-1.5 bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700 flex items-center gap-1.5">
                        <Music className="h-3.5 w-3.5 text-indigo-500" />
                        {orderFileName ? `MP3 File: ${orderFileName}` : "Direct MP3 Data URL / Link"}
                      </span>
                      {ordersCustomUrl && <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1"><Check className="h-3 w-3" /> Ready</span>}
                    </div>
                    <Input
                      value={ordersCustomUrl}
                      onChange={(e) => {
                        setOrdersCustomUrl(e.target.value);
                        localStorage.setItem("udyam.sound.orders_custom_url", e.target.value);
                      }}
                      placeholder="Upload MP3 file above or paste MP3 URL here (https://.../order.mp3)"
                      className="text-xs font-mono bg-slate-50"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500">
            Upload any MP3 audio file directly from your computer or choose built-in ringtone chimes for lead & order alerts.
          </p>
        </CardContent>
      </Card>

      {/* Auto-close Timers Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Timer className="h-4 w-4" />
            Timers &amp; Auto-close
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="cust-delay-autoclose">Customer Delay auto-close (HH:MM, business hours)</Label>
            <div className="flex gap-2">
              <Input
                id="cust-delay-autoclose"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="08:00"
                disabled={loading}
                className="max-w-[140px] font-mono"
              />
              <Button onClick={onSaveMinutes} disabled={loading || saving}>
                {saving ? "Saving…" : "Save"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Applies to newly-triggered Customer Delays. Existing timers continue on their original schedule. Also auto-resolves when the customer replies (opens a ticket) or the order is restarted. Range 00:01 – 168:00.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
