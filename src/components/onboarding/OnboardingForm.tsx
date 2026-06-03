import { useEffect, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { FieldDef, OnboardingSchema } from "@/lib/onboarding/schemas";
import { NicCodePicker } from "./NicCodePicker";

const inputCls =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow";

type SaveState = "idle" | "saving" | "saved" | "error";

export function OnboardingForm({
  schema,
  initial,
  busy,
  onSubmit,
  onSubmitted,
  onSaveDraft,
}: {
  schema: OnboardingSchema;
  initial: Record<string, string>;
  busy: boolean;
  onSubmit: (data: Record<string, string>) => Promise<void> | void;
  onSubmitted?: () => Promise<void> | void;
  onSaveDraft?: (data: Record<string, string>) => Promise<void> | void;
}) {
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [err, setErr] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Debounced autosave
  const timer = useRef<number | null>(null);
  const lastSavedJson = useRef<string>(JSON.stringify(initial));
  const lastInitialJson = useRef<string>(JSON.stringify(initial));
  const onSaveDraftRef = useRef(onSaveDraft);
  const mounted = useRef(false);

  useEffect(() => {
    onSaveDraftRef.current = onSaveDraft;
  }, [onSaveDraft]);

  useEffect(() => {
    const nextInitialJson = JSON.stringify(initial);
    if (nextInitialJson === lastInitialJson.current) return;
    lastInitialJson.current = nextInitialJson;
    lastSavedJson.current = nextInitialJson;
    mounted.current = false;
    setValues(initial);
    setErr(null);
    setSubmitSuccess(false);
    setSaveState("idle");
    setSavedAt(null);
  }, [initial]);

  useEffect(() => {
    if (!onSaveDraftRef.current) return;
    if (busy) {
      if (timer.current) window.clearTimeout(timer.current);
      return;
    }
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const current = JSON.stringify(values);
    if (current === lastSavedJson.current) return;

    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      try {
        setSaveState("saving");
        await onSaveDraftRef.current?.(values);
        lastSavedJson.current = current;
        setSavedAt(Date.now());
        setSaveState("saved");
      } catch {
        setSaveState("error");
      }
    }, 1500);

    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [values, busy]);

  function update(k: string, v: string) {
    setValues((s) => ({ ...s, [k]: v }));
  }

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    if (timer.current) window.clearTimeout(timer.current);
    setErr(null);
    setSubmitSuccess(false);
    try {
      await onSubmit(values);
      setSubmitSuccess(true);
      setSaveState("saved");
      setSavedAt(Date.now());
      await new Promise((resolve) => window.setTimeout(resolve, 450));
      await onSubmitted?.();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not save. Please try again.");
      setSubmitSuccess(false);
    }
  }

  return (
    <form onSubmit={handle} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        {schema.fields.map((f) => (
          <FieldRenderer
            key={f.key}
            field={f}
            value={values[f.key] ?? ""}
            allValues={values}
            onChange={(v) => update(f.key, v)}
          />
        ))}
      </div>

      {err && (
        <div className="rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm px-3 py-2">
          {err}
        </div>
      )}

      {submitSuccess && !err && (
        <div className="rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-sm px-3 py-2 flex items-center gap-2">
          <Check className="w-4 h-4" /> Details submitted successfully. Opening next step…
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row gap-3 justify-between items-stretch sm:items-center pt-2">
        <SaveIndicator state={saveState} savedAt={savedAt} />
        <button
          type="submit"
          disabled={busy || submitSuccess}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-navy hover:bg-brand-navy-deep text-white font-semibold px-8 py-2.5 transition-colors disabled:opacity-60"
        >
          {(busy || submitSuccess) && <Loader2 className="w-4 h-4 animate-spin" />}
          {busy || submitSuccess ? "Opening next step…" : "Save & Continue"}
        </button>
      </div>
    </form>
  );
}

function SaveIndicator({ state, savedAt }: { state: SaveState; savedAt: number | null }) {
  const [, force] = useState(0);
  // Tick once a minute so the relative timestamp stays fresh
  useEffect(() => {
    const id = window.setInterval(() => force((n) => n + 1), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const rel = savedAt ? relativeTime(savedAt) : null;

  return (
    <div className="text-xs text-muted-foreground flex items-center gap-1.5 min-h-[20px]">
      <AnimatePresence mode="wait">
        {state === "saving" && (
          <motion.span
            key="saving"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1.5"
          >
            <Loader2 className="w-3 h-3 animate-spin" /> Saving draft…
          </motion.span>
        )}
        {state === "saved" && rel && (
          <motion.span
            key="saved"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1.5 text-emerald-600"
          >
            <Check className="w-3 h-3" /> Saved {rel}
          </motion.span>
        )}
        {state === "error" && (
          <motion.span
            key="error"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-destructive"
          >
            Couldn't autosave — your edits stay on this page.
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function relativeTime(ts: number) {
  const s = Math.round((Date.now() - ts) / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  return `${Math.round(m / 60)}h ago`;
}

function FieldRenderer({
  field,
  value,
  allValues,
  onChange,
}: {
  field: FieldDef;
  value: string;
  allValues: Record<string, string>;
  onChange: (v: string) => void;
}) {
  const colSpan = field.type === "textarea" || field.type === "nic" ? "md:col-span-2" : "";
  const common = {
    id: `f-${field.key}`,
    name: field.key,
    required: field.required,
    placeholder: field.placeholder,
    maxLength: field.maxLength,
    pattern: field.pattern,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      onChange(e.target.value),
    className: inputCls,
  };

  const activityRaw = field.activityFrom ? allValues[field.activityFrom] : undefined;
  const activity =
    activityRaw === "Manufacturing" || activityRaw === "Services" || activityRaw === "Trading"
      ? activityRaw
      : null;

  return (
    <div className={colSpan}>
      <label htmlFor={common.id} className="block text-sm font-semibold text-foreground mb-1.5">
        {field.label}
        {field.required && <span className="text-destructive"> *</span>}
      </label>
      {field.type === "textarea" ? (
        <textarea {...common} rows={3} />
      ) : field.type === "select" ? (
        <select {...common} defaultValue={value || ""}>
          <option value="" disabled>
            Select…
          </option>
          {(field.options ?? []).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : field.type === "nic" ? (
        <NicCodePicker
          id={common.id}
          value={value}
          onChange={onChange}
          digits={field.nicDigits ?? 5}
          activity={activity}
          required={field.required}
        />
      ) : (
        <input type={field.type} {...common} />
      )}
      {field.help && <p className="mt-1 text-xs text-muted-foreground">{field.help}</p>}
    </div>
  );
}
