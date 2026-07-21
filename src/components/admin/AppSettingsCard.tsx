// Super-admin settings card: customer-delay auto-close duration.
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getAppSettings, updateCustomerDelayAutocloseMinutes } from "@/lib/settings/app-settings.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Timer } from "lucide-react";

function minutesToHHMM(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
function hhmmToMinutes(v: string): number | null {
  const m = /^(\d{1,3}):([0-5]?\d)$/.exec(v.trim());
  if (!m) return null;
  const mins = Number(m[1]) * 60 + Number(m[2]);
  if (mins < 15 || mins > 10080) return null;
  return mins;
}

export function AppSettingsCard() {
  const fetchSettings = useServerFn(getAppSettings);
  const saveMinutes = useServerFn(updateCustomerDelayAutocloseMinutes);
  const [value, setValue] = useState("08:00");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  async function onSave() {
    const mins = hhmmToMinutes(value);
    if (mins === null) {
      toast.error("Enter time as HH:MM (min 00:15, max 168:00)");
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

  return (
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
            <Button onClick={onSave} disabled={loading || saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Applies to newly-triggered Customer Delays. Existing timers continue on their original schedule. Range 00:15 – 168:00.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
