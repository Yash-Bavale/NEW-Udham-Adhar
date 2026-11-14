import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { j as useServerFn, H as Button, W as Label, J as Select, K as SelectTrigger, M as SelectValue, N as SelectContent, O as SelectItem, I as Input } from "./router-QgJicixe.mjs";
import { a as getAppSettings, g as getGlobalReminderSoundSettings, b as getCallbackReminderPresetSettings, c as updateCustomerDelayAutocloseMinutes, d as updateSoundSettings, e as saveCallbackReminderPresetSettings, u as uploadAlertAudioFile, D as DEFAULT_CALLBACK_PRESET_CONFIG } from "./app-settings.functions-ChQcgAgv.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-CjqxMl2c.mjs";
import { S as Switch } from "./switch-DIr13Mej.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { p as playNotificationSound } from "./useNotifications-DFr-oGCL.mjs";
import { a5 as Volume2, aA as Upload, a2 as Play, bn as Music, E as Check, C as Clock, L as LoaderCircle, ao as Sparkles, z as Calendar, T as Timer } from "../_libs/lucide-react.mjs";
function minutesToHHMM(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
function hhmmToMinutes(v) {
  const m = /^(\d{1,3}):([0-5]?\d)$/.exec(v.trim());
  if (!m) return null;
  const mins = Number(m[1]) * 60 + Number(m[2]);
  if (mins < 1 || mins > 10080) return null;
  return mins;
}
function AppSettingsCard() {
  const fetchSettings = useServerFn(getAppSettings);
  const fetchGlobalSound = useServerFn(getGlobalReminderSoundSettings);
  const fetchPresetsFn = useServerFn(getCallbackReminderPresetSettings);
  const saveMinutes = useServerFn(updateCustomerDelayAutocloseMinutes);
  const saveSound = useServerFn(updateSoundSettings);
  const savePresetsFn = useServerFn(saveCallbackReminderPresetSettings);
  const uploadAudio = useServerFn(uploadAlertAudioFile);
  const [value, setValue] = reactExports.useState("08:00");
  const [callbackPresets, setCallbackPresets] = reactExports.useState(DEFAULT_CALLBACK_PRESET_CONFIG);
  const [savingPresets, setSavingPresets] = reactExports.useState(false);
  const [leadsToast, setLeadsToast] = reactExports.useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("udyam.toast.leads") !== "false";
  });
  const [ordersToast, setOrdersToast] = reactExports.useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("udyam.toast.orders") !== "false";
  });
  const [leadsSound, setLeadsSound] = reactExports.useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("udyam.sound.leads") !== "false";
  });
  const [ordersSound, setOrdersSound] = reactExports.useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("udyam.sound.orders") !== "false";
  });
  const [leadsRingtone, setLeadsRingtone] = reactExports.useState(() => {
    if (typeof window === "undefined") return "chime";
    return localStorage.getItem("udyam.sound.leads_ringtone") || "chime";
  });
  const [leadsCustomUrl, setLeadsCustomUrl] = reactExports.useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("udyam.sound.leads_custom_url") || "";
  });
  const [ordersRingtone, setOrdersRingtone] = reactExports.useState(() => {
    if (typeof window === "undefined") return "bell";
    return localStorage.getItem("udyam.sound.orders_ringtone") || "bell";
  });
  const [ordersCustomUrl, setOrdersCustomUrl] = reactExports.useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("udyam.sound.orders_custom_url") || "";
  });
  const [leadFileName, setLeadFileName] = reactExports.useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("udyam.sound.leads_file_name") || "";
  });
  const [orderFileName, setOrderFileName] = reactExports.useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("udyam.sound.orders_file_name") || "";
  });
  const leadFileRef = reactExports.useRef(null);
  const orderFileRef = reactExports.useRef(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const [savingSound, setSavingSound] = reactExports.useState(false);
  const [uploadingLead, setUploadingLead] = reactExports.useState(false);
  const [uploadingOrder, setUploadingOrder] = reactExports.useState(false);
  reactExports.useEffect(() => {
    let cancelled = false;
    Promise.allSettled([fetchSettings(), fetchGlobalSound(), fetchPresetsFn()]).then(([settingsRes, soundRes, presetsRes]) => {
      if (cancelled) return;
      if (settingsRes.status === "fulfilled") {
        setValue(minutesToHHMM(settingsRes.value.customerDelayAutocloseMinutes));
      }
      if (presetsRes.status === "fulfilled") {
        setCallbackPresets(presetsRes.value);
      }
      if (soundRes.status === "fulfilled") {
        const s = soundRes.value;
        if (s.leadsSoundEnabled !== void 0) setLeadsSound(s.leadsSoundEnabled);
        if (s.ordersSoundEnabled !== void 0) setOrdersSound(s.ordersSoundEnabled);
        if (s.leadsToastEnabled !== void 0) setLeadsToast(s.leadsToastEnabled);
        if (s.ordersToastEnabled !== void 0) setOrdersToast(s.ordersToastEnabled);
        if (s.leadsRingtone) setLeadsRingtone(s.leadsRingtone);
        if (s.leadsCustomUrl) setLeadsCustomUrl(s.leadsCustomUrl);
        if (s.leadsCustomName) setLeadFileName(s.leadsCustomName);
        if (s.ordersRingtone) setOrdersRingtone(s.ordersRingtone);
        if (s.ordersCustomUrl) setOrdersCustomUrl(s.ordersCustomUrl);
        if (s.ordersCustomName) setOrderFileName(s.ordersCustomName);
        localStorage.setItem("udyam.sound.leads", String(s.leadsSoundEnabled !== false));
        localStorage.setItem("udyam.sound.orders", String(s.ordersSoundEnabled !== false));
        localStorage.setItem("udyam.toast.leads", String(s.leadsToastEnabled !== false));
        localStorage.setItem("udyam.toast.orders", String(s.ordersToastEnabled !== false));
        if (s.leadsRingtone) localStorage.setItem("udyam.sound.leads_ringtone", s.leadsRingtone);
        if (s.leadsCustomUrl) localStorage.setItem("udyam.sound.leads_custom_url", s.leadsCustomUrl);
        if (s.leadsCustomName) localStorage.setItem("udyam.sound.leads_file_name", s.leadsCustomName);
        if (s.ordersRingtone) localStorage.setItem("udyam.sound.orders_ringtone", s.ordersRingtone);
        if (s.ordersCustomUrl) localStorage.setItem("udyam.sound.orders_custom_url", s.ordersCustomUrl);
        if (s.ordersCustomName) localStorage.setItem("udyam.sound.orders_file_name", s.ordersCustomName);
      }
    }).catch(() => toast.error("Failed to load settings")).finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [fetchSettings, fetchGlobalSound, fetchPresetsFn]);
  async function onSaveCallbackPresets() {
    setSavingPresets(true);
    try {
      await savePresetsFn({ data: callbackPresets });
      toast.success("✅ Callback reminder duration presets saved & synced company-wide!");
    } catch (e) {
      toast.error(e.message || "Failed to save callback presets");
    } finally {
      setSavingPresets(false);
    }
  }
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
      toast.error(e.message || "Failed to save");
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
          leadsToastEnabled: leadsToast,
          ordersToastEnabled: ordersToast,
          leadsRingtone,
          leadsCustomUrl,
          leadsCustomName: leadFileName,
          ordersRingtone,
          ordersCustomUrl,
          ordersCustomName: orderFileName
        }
      });
      localStorage.setItem("udyam.sound.leads", String(leadsSound));
      localStorage.setItem("udyam.sound.orders", String(ordersSound));
      localStorage.setItem("udyam.toast.leads", String(leadsToast));
      localStorage.setItem("udyam.toast.orders", String(ordersToast));
      localStorage.setItem("udyam.sound.leads_ringtone", leadsRingtone);
      localStorage.setItem("udyam.sound.leads_custom_url", leadsCustomUrl);
      localStorage.setItem("udyam.sound.leads_file_name", leadFileName);
      localStorage.setItem("udyam.sound.orders_ringtone", ordersRingtone);
      localStorage.setItem("udyam.sound.orders_custom_url", ordersCustomUrl);
      localStorage.setItem("udyam.sound.orders_file_name", orderFileName);
      toast.success("Notification sound & Screen toast settings saved & synced company-wide!");
    } catch (e) {
      toast.error(e.message || "Failed to save sound settings");
    } finally {
      setSavingSound(false);
    }
  }
  const handleLeadFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Audio file size should be less than 10MB");
      return;
    }
    setUploadingLead(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const dataUrl = evt.target?.result;
      if (dataUrl) {
        try {
          const res = await uploadAudio({
            data: {
              fileName: file.name,
              base64Data: dataUrl,
              target: "lead"
            }
          });
          setLeadsCustomUrl(res.url);
          setLeadsRingtone("custom");
          setLeadFileName(file.name);
          localStorage.setItem("udyam.sound.leads_custom_url", res.url);
          localStorage.setItem("udyam.sound.leads_ringtone", "custom");
          localStorage.setItem("udyam.sound.leads_file_name", file.name);
          toast.success(`Uploaded & synced Lead MP3 ringtone: ${file.name}`);
          playNotificationSound("preview", "custom", res.url);
        } catch (err) {
          setLeadsCustomUrl(dataUrl);
          setLeadsRingtone("custom");
          setLeadFileName(file.name);
          localStorage.setItem("udyam.sound.leads_custom_url", dataUrl);
          localStorage.setItem("udyam.sound.leads_ringtone", "custom");
          localStorage.setItem("udyam.sound.leads_file_name", file.name);
          toast.success(`Applied Lead MP3 ringtone: ${file.name}`);
          playNotificationSound("preview", "custom", dataUrl);
        } finally {
          setUploadingLead(false);
        }
      }
    };
    reader.onerror = () => {
      setUploadingLead(false);
      toast.error("Failed to read audio file");
    };
    reader.readAsDataURL(file);
  };
  const handleOrderFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Audio file size should be less than 10MB");
      return;
    }
    setUploadingOrder(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const dataUrl = evt.target?.result;
      if (dataUrl) {
        try {
          const res = await uploadAudio({
            data: {
              fileName: file.name,
              base64Data: dataUrl,
              target: "order"
            }
          });
          setOrdersCustomUrl(res.url);
          setOrdersRingtone("custom");
          setOrderFileName(file.name);
          localStorage.setItem("udyam.sound.orders_custom_url", res.url);
          localStorage.setItem("udyam.sound.orders_ringtone", "custom");
          localStorage.setItem("udyam.sound.orders_file_name", file.name);
          toast.success(`Uploaded & synced Order MP3 ringtone: ${file.name}`);
          playNotificationSound("preview", "custom", res.url);
        } catch (err) {
          setOrdersCustomUrl(dataUrl);
          setOrdersRingtone("custom");
          setOrderFileName(file.name);
          localStorage.setItem("udyam.sound.orders_custom_url", dataUrl);
          localStorage.setItem("udyam.sound.orders_ringtone", "custom");
          localStorage.setItem("udyam.sound.orders_file_name", file.name);
          toast.success(`Applied Order MP3 ringtone: ${file.name}`);
          playNotificationSound("preview", "custom", dataUrl);
        } finally {
          setUploadingOrder(false);
        }
      }
    };
    reader.onerror = () => {
      setUploadingOrder(false);
      toast.error("Failed to read audio file");
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "h-4 w-4 text-amber-500" }),
          "Notification Sound & Custom Ringtones"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: onSaveSoundSettings, disabled: loading || savingSound, size: "sm", children: savingSound ? "Saving…" : "Save Sound Settings" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold text-slate-900 flex items-center gap-2", children: "📢 New Lead Notification Sound" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "Alert sound played when a new lead arrives or is assigned" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: leadsSound, onCheckedChange: setLeadsSound, disabled: loading })
          ] }),
          leadsSound && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-3 space-y-3 border-t border-slate-200/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-12 gap-3 items-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-5 space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-slate-700", children: "Lead Ringtone Tone" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: leadsRingtone, onValueChange: (v) => setLeadsRingtone(v), disabled: loading, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select tone..." }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "chime", children: "🎵 Standard Double Chime" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "bell", children: "🔔 Resonant Bell Ring" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "alert", children: "🚨 High Alert Alarm" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ding", children: "🎶 Soft Marimba Ding" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "soft", children: "🔉 Gentle Double Pulse" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "custom", children: "🎼 Custom MP3 File / Audio" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-4 flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "file",
                    ref: leadFileRef,
                    onChange: handleLeadFileUpload,
                    accept: "audio/mp3,audio/mpeg,audio/wav,audio/*",
                    className: "hidden"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    onClick: () => leadFileRef.current?.click(),
                    className: "w-full gap-1.5 bg-white text-xs",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5 text-slate-600" }),
                      " Upload Lead MP3 File"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: handleTestLeadSound, className: "w-full gap-1.5 bg-white text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-3.5 w-3.5 fill-current text-amber-500" }),
                " Test Lead Sound"
              ] }) })
            ] }),
            leadsRingtone === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 bg-white p-2.5 rounded-lg border border-slate-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-slate-700 flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Music, { className: "h-3.5 w-3.5 text-amber-500" }),
                  leadFileName ? `MP3 File: ${leadFileName}` : "Direct MP3 Data URL / Link"
                ] }),
                leadsCustomUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-emerald-600 font-semibold flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3" }),
                  " Ready"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: leadsCustomUrl,
                  onChange: (e) => {
                    setLeadsCustomUrl(e.target.value);
                    localStorage.setItem("udyam.sound.leads_custom_url", e.target.value);
                  },
                  placeholder: "Upload MP3 file above or paste MP3 URL here (https://.../lead.mp3)",
                  className: "text-xs font-mono bg-slate-50"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-3 border-t border-slate-200/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-slate-800 flex items-center gap-1.5", children: "💬 Lead Screen Toast Popup (Bottom-Right Corner)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-500", children: "Show notification banner popup at the bottom right corner inside CRM when new lead arrives" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: leadsToast, onCheckedChange: setLeadsToast, disabled: loading })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold text-slate-900 flex items-center gap-2", children: "📦 New Order Notification Sound" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "Alert sound played when a new order arrives or status updates" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: ordersSound, onCheckedChange: setOrdersSound, disabled: loading })
          ] }),
          ordersSound && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-3 space-y-3 border-t border-slate-200/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-12 gap-3 items-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-5 space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-slate-700", children: "Order Ringtone Tone" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: ordersRingtone, onValueChange: (v) => setOrdersRingtone(v), disabled: loading, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "bg-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select tone..." }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "chime", children: "🎵 Standard Double Chime" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "bell", children: "🔔 Resonant Bell Ring" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "alert", children: "🚨 High Alert Alarm" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ding", children: "🎶 Soft Marimba Ding" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "soft", children: "🔉 Gentle Double Pulse" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "custom", children: "🎼 Custom MP3 File / Audio" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-4 flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "file",
                    ref: orderFileRef,
                    onChange: handleOrderFileUpload,
                    accept: "audio/mp3,audio/mpeg,audio/wav,audio/*",
                    className: "hidden"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    onClick: () => orderFileRef.current?.click(),
                    className: "w-full gap-1.5 bg-white text-xs",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5 text-slate-600" }),
                      " Upload Order MP3 File"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: handleTestOrderSound, className: "w-full gap-1.5 bg-white text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-3.5 w-3.5 fill-current text-indigo-500" }),
                " Test Order Sound"
              ] }) })
            ] }),
            ordersRingtone === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 bg-white p-2.5 rounded-lg border border-slate-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-slate-700 flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Music, { className: "h-3.5 w-3.5 text-indigo-500" }),
                  orderFileName ? `MP3 File: ${orderFileName}` : "Direct MP3 Data URL / Link"
                ] }),
                ordersCustomUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-emerald-600 font-semibold flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3" }),
                  " Ready"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: ordersCustomUrl,
                  onChange: (e) => {
                    setOrdersCustomUrl(e.target.value);
                    localStorage.setItem("udyam.sound.orders_custom_url", e.target.value);
                  },
                  placeholder: "Upload MP3 file above or paste MP3 URL here (https://.../order.mp3)",
                  className: "text-xs font-mono bg-slate-50"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-3 border-t border-slate-200/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-slate-800 flex items-center gap-1.5", children: "💬 Order Screen Toast Popup (Bottom-Right Corner)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-500", children: "Show notification banner popup at the bottom right corner inside CRM when new order arrives or updates" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: ordersToast, onCheckedChange: setOrdersToast, disabled: loading })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "Upload any MP3 audio file directly from your computer or choose built-in ringtone chimes for lead & order alerts." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border border-slate-200 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base text-slate-900 font-bold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5 text-blue-600" }),
            "Customer Callback Reminder Duration Presets"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              onClick: onSaveCallbackPresets,
              disabled: loading || savingPresets,
              className: "gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs",
              children: savingPresets ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }),
                " Saving…"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" }),
                " Save Callback Presets"
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-1", children: "Configure the default time options (Minutes & Hours) displayed in the “Schedule Customer Callback & Reminder” popup dialog across all employee workspaces." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-bold text-slate-800 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Slot 1: Quick" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-blue-600 font-mono font-bold", children: "Minutes" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 1,
                  max: 1440,
                  value: callbackPresets.quickMinutes,
                  onChange: (e) => setCallbackPresets((prev) => ({
                    ...prev,
                    quickMinutes: Math.max(1, Number(e.target.value) || 1)
                  })),
                  disabled: loading,
                  className: "bg-white font-mono text-xs"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-slate-500", children: "Mins" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-slate-500", children: [
              "Button label: ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-slate-800", children: [
                "+",
                callbackPresets.quickMinutes,
                " Mins"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 p-3 rounded-xl bg-blue-50/50 border border-blue-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-bold text-blue-950 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Slot 2: Recommended" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-blue-700 font-mono font-bold", children: "Hours" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 0.1,
                  step: 0.5,
                  max: 72,
                  value: callbackPresets.recommendedHours,
                  onChange: (e) => setCallbackPresets((prev) => ({
                    ...prev,
                    recommendedHours: Math.max(0.1, Number(e.target.value) || 1)
                  })),
                  disabled: loading,
                  className: "bg-white font-mono text-xs"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-slate-500", children: "Hours" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-slate-500", children: [
              "Button label: ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-slate-800", children: [
                callbackPresets.recommendedHours,
                " ",
                callbackPresets.recommendedHours === 1 ? "Hour" : "Hours"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-bold text-slate-800 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Slot 3: Afternoon" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-blue-600 font-mono font-bold", children: "Hours" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 0.1,
                  step: 0.5,
                  max: 72,
                  value: callbackPresets.afternoonHours ?? callbackPresets.eveningHours ?? 3,
                  onChange: (e) => setCallbackPresets((prev) => {
                    const v = Math.max(0.1, Number(e.target.value) || 1);
                    return { ...prev, afternoonHours: v, eveningHours: v };
                  }),
                  disabled: loading,
                  className: "bg-white font-mono text-xs"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-slate-500", children: "Hours" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-slate-500", children: [
              "Button label: ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-slate-800", children: [
                callbackPresets.afternoonHours ?? callbackPresets.eveningHours ?? 3,
                " ",
                (callbackPresets.afternoonHours ?? callbackPresets.eveningHours ?? 3) === 1 ? "Hour" : "Hours"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-bold text-slate-800 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Slot 4: Before Shift End" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-blue-600 font-mono font-bold", children: "Hours" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 0.1,
                  step: 0.5,
                  max: 72,
                  value: callbackPresets.beforeShiftEndHours ?? callbackPresets.laterTodayHours ?? 4,
                  onChange: (e) => setCallbackPresets((prev) => {
                    const v = Math.max(0.1, Number(e.target.value) || 1);
                    return { ...prev, beforeShiftEndHours: v, laterTodayHours: v };
                  }),
                  disabled: loading,
                  className: "bg-white font-mono text-xs"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-slate-500", children: "Hours" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-slate-500", children: [
              "Button label: ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-slate-800", children: [
                callbackPresets.beforeShiftEndHours ?? callbackPresets.laterTodayHours ?? 4,
                " ",
                (callbackPresets.beforeShiftEndHours ?? callbackPresets.laterTodayHours ?? 4) === 1 ? "Hour" : "Hours"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-bold text-slate-800 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Slot 5: Tomorrow" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-blue-600 font-mono font-bold", children: "HH:MM" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "time",
                value: callbackPresets.tomorrowDefaultTime,
                onChange: (e) => setCallbackPresets((prev) => ({
                  ...prev,
                  tomorrowDefaultTime: e.target.value || "10:30"
                })),
                disabled: loading,
                className: "bg-white font-mono text-xs"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-slate-500", children: [
              "Trigger time: ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-slate-800", children: [
                callbackPresets.tomorrowDefaultTime,
                " Tomorrow"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-slate-900 rounded-xl text-white space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs font-semibold text-slate-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-3.5 text-teal-400" }),
              "Live Preview of Dialog Buttons (Section 2)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-slate-400", children: "Preview only" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 sm:grid-cols-6 gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 rounded-lg bg-slate-800 text-center border border-slate-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase font-semibold text-slate-400", children: "Quick" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-bold text-white", children: [
                "+",
                callbackPresets.quickMinutes,
                " Mins"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 rounded-lg bg-blue-600 text-center border border-blue-500 text-white font-bold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase font-semibold text-blue-100", children: "Recommended" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-bold", children: [
                callbackPresets.recommendedHours,
                " ",
                callbackPresets.recommendedHours === 1 ? "Hour" : "Hours"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 rounded-lg bg-slate-800 text-center border border-slate-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase font-semibold text-slate-400", children: "Afternoon" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-bold text-white", children: [
                callbackPresets.afternoonHours ?? callbackPresets.eveningHours ?? 3,
                " ",
                (callbackPresets.afternoonHours ?? callbackPresets.eveningHours ?? 3) === 1 ? "Hour" : "Hours"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 rounded-lg bg-slate-800 text-center border border-slate-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase font-semibold text-slate-400", children: "Before Shift End" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-bold text-white", children: [
                callbackPresets.beforeShiftEndHours ?? callbackPresets.laterTodayHours ?? 4,
                " ",
                (callbackPresets.beforeShiftEndHours ?? callbackPresets.laterTodayHours ?? 4) === 1 ? "Hour" : "Hours"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 rounded-lg bg-slate-800 text-center border border-slate-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] uppercase font-semibold text-slate-400", children: "Tomorrow" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-white", children: callbackPresets.tomorrowDefaultTime })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 rounded-lg bg-slate-800 text-center border border-slate-700 flex flex-col items-center justify-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-3 text-slate-400 mb-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-white", children: "Custom" })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "h-4 w-4" }),
        "Timers & Auto-close"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cust-delay-autoclose", children: "Customer Delay auto-close (HH:MM, business hours)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "cust-delay-autoclose",
              value,
              onChange: (e) => setValue(e.target.value),
              placeholder: "08:00",
              disabled: loading,
              className: "max-w-[140px] font-mono"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: onSaveMinutes, disabled: loading || saving, children: saving ? "Saving…" : "Save" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Applies to newly-triggered Customer Delays. Existing timers continue on their original schedule. Also auto-resolves when the customer replies (opens a ticket) or the order is restarted. Range 00:01 – 168:00." })
      ] }) })
    ] })
  ] });
}
export {
  AppSettingsCard as A
};
