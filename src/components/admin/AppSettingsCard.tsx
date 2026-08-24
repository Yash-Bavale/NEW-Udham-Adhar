import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getAppSettings, updateCustomerDelayAutocloseMinutes, updateSoundSettings } from "@/lib/settings/app-settings.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Timer, Volume2, VolumeX, Bell, Play } from "lucide-react";
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
  const [leadsSound, setLeadsSound] = useState(true);
  const [ordersSound, setOrdersSound] = useState(true);
  const [leadsRingtone, setLeadsRingtone] = useState<RingtoneTone>("chime");
  const [leadsCustomUrl, setLeadsCustomUrl] = useState("");
  const [ordersRingtone, setOrdersRingtone] = useState<RingtoneTone>("bell");
  const [ordersCustomUrl, setOrdersCustomUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSound, setSavingSound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchSettings()
      .then((s) => {
        if (cancelled) return;
        setValue(minutesToHHMM(s.customerDelayAutocloseMinutes));
        setLeadsSound(s.leadsSoundEnabled);
        setOrdersSound(s.ordersSoundEnabled);
        setLeadsRingtone((s.leadsRingtone as RingtoneTone) || "chime");
        setLeadsCustomUrl(s.leadsCustomUrl || "");
        setOrdersRingtone((s.ordersRingtone as RingtoneTone) || "bell");
        setOrdersCustomUrl(s.ordersCustomUrl || "");

        // Sync local storage for active browser session
        localStorage.setItem("udyam.sound.leads", String(s.leadsSoundEnabled));
        localStorage.setItem("udyam.sound.orders", String(s.ordersSoundEnabled));
        localStorage.setItem("udyam.sound.leads_ringtone", s.leadsRingtone || "chime");
        localStorage.setItem("udyam.sound.leads_custom_url", s.leadsCustomUrl || "");
        localStorage.setItem("udyam.sound.orders_ringtone", s.ordersRingtone || "bell");
        localStorage.setItem("udyam.sound.orders_custom_url", s.ordersCustomUrl || "");
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

      toast.success("Notification sound & custom ringtones saved for employees!");
    } catch (e) {
      toast.error((e as Error).message || "Failed to save sound settings");
    } finally {
      setSavingSound(false);
    }
  }

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
              <div className="pt-2 grid grid-cols-1 md:grid-cols-12 gap-3 items-end border-t border-slate-200/80">
                <div className="md:col-span-4 space-y-1">
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
                      <SelectItem value="custom">🎼 Custom MP3 File / URL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {leadsRingtone === "custom" && (
                  <div className="md:col-span-5 space-y-1">
                    <Label className="text-xs font-medium text-slate-700">Lead Custom MP3 Audio File URL</Label>
                    <Input
                      value={leadsCustomUrl}
                      onChange={(e) => setLeadsCustomUrl(e.target.value)}
                      placeholder="https://.../lead-alert.mp3 or /sounds/lead.mp3"
                      className="bg-white text-xs font-mono"
                    />
                  </div>
                )}

                <div className={leadsRingtone === "custom" ? "md:col-span-3" : "md:col-span-8"}>
                  <Button type="button" variant="outline" size="sm" onClick={handleTestLeadSound} className="w-full gap-1.5 bg-white">
                    <Play className="h-3.5 w-3.5 fill-current text-amber-500" /> Test Lead Ringtone
                  </Button>
                </div>
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
              <div className="pt-2 grid grid-cols-1 md:grid-cols-12 gap-3 items-end border-t border-slate-200/80">
                <div className="md:col-span-4 space-y-1">
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
                      <SelectItem value="custom">🎼 Custom MP3 File / URL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {ordersRingtone === "custom" && (
                  <div className="md:col-span-5 space-y-1">
                    <Label className="text-xs font-medium text-slate-700">Order Custom MP3 Audio File URL</Label>
                    <Input
                      value={ordersCustomUrl}
                      onChange={(e) => setOrdersCustomUrl(e.target.value)}
                      placeholder="https://.../order-alert.mp3 or /sounds/order.mp3"
                      className="bg-white text-xs font-mono"
                    />
                  </div>
                )}

                <div className={ordersRingtone === "custom" ? "md:col-span-3" : "md:col-span-8"}>
                  <Button type="button" variant="outline" size="sm" onClick={handleTestOrderSound} className="w-full gap-1.5 bg-white">
                    <Play className="h-3.5 w-3.5 fill-current text-indigo-500" /> Test Order Ringtone
                  </Button>
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500">
            Super Admin can set distinct ringtones for leads and orders or input custom MP3 audio links for employee notification chimes.
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
