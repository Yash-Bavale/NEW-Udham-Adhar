import { useEffect, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { INDIA_STATES, type FieldDef, type OnboardingSchema } from "@/lib/onboarding/schemas";
import { INDIA_DISTRICTS } from "@/lib/onboarding/india-districts";
import { NicCodePicker } from "./NicCodePicker";

const UPPERCASE_FIELDS = new Set([
  "bank_ifsc",
  "udyam_number",
  "uam_number",
  "pan_number",
  "pan_holder_pan",
  "gstin",
]);

const TITLECASE_FIELDS = new Set([
  "applicant_name",
  "pan_holder_name",
  "authorized_person_name",
  "bank_name",
  "branch_name",
  "enterprise_name",
  "organisation_name",
  "address_flat",
  "address_premises",
  "address_village",
  "address_block",
  "address_road",
  "city",
]);

const PRESERVE_UPPER = new Set([
  "PVT","LTD","LLP","HUF","OPC","INC","CO","PLC","LLC","SSI","MSME","IT","BPO","KPO","HR","R&D","II","III","IV","VI","VII","VIII","IX","XI","XII",
]);

function toTitleCase(input: string): string {
  if (!input) return input;
  return input
    .toLowerCase()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) =>
      word
        .split("-")
        .map((seg) => {
          const upper = seg.toUpperCase();
          if (PRESERVE_UPPER.has(upper)) return upper;
          if (!seg) return seg;
          return seg.charAt(0).toUpperCase() + seg.slice(1);
        })
        .join("-"),
    )
    .join(" ");
}

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
  submitLabel = "Save & Continue",
  submittingLabel = "Opening next step…",
  successMessage = "Details submitted successfully. Opening next step…",
}: {
  schema: OnboardingSchema;
  initial: Record<string, string>;
  busy: boolean;
  onSubmit: (data: Record<string, string>) => Promise<void> | void;
  onSubmitted?: () => Promise<void> | void;
  onSaveDraft?: (data: Record<string, string>) => Promise<void> | void;
  submitLabel?: string;
  submittingLabel?: string;
  successMessage?: string;
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
    setValues((s) => {
      const next = { ...s, [k]: v };
      // When state changes, clear district so a stale value can't remain.
      if (k === "state" && s.state !== v) next.district = "";
      return next;
    });
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
          <Check className="w-4 h-4" /> {successMessage}
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
          {busy || submitSuccess ? submittingLabel : submitLabel}
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
  const id = `f-${field.key}`;
  const isState = field.key === "state";
  const isPincode = field.key === "pincode" || field.pattern === "^\\d{6}$";
  const isMobile = field.type === "tel" && field.pattern === "^[6-9]\\d{9}$";
  const isAadhaar = field.pattern === "^\\d{12}$";
  const isPan = field.pattern === "^[A-Z]{5}\\d{4}[A-Z]$";

  // Map (rawValue) -> (storedValue). Lets us auto-uppercase PAN / digits-only Aadhaar etc.
  const transform = (raw: string): string => {
    if (isPincode) return raw.replace(/\D/g, "").slice(0, 6);
    if (isMobile) return raw.replace(/\D/g, "").slice(0, 10);
    if (isAadhaar) return raw.replace(/\D/g, "").slice(0, 12);
    if (isPan) return raw.toUpperCase().replace(/\s/g, "").slice(0, 10);
    return raw;
  };

  const common = {
    id,
    name: field.key,
    required: field.required,
    placeholder: field.placeholder,
    maxLength: field.maxLength,
    pattern: field.pattern,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      onChange(transform(e.target.value)),
    className: inputCls,
  };

  const activityRaw = field.activityFrom ? allValues[field.activityFrom] : undefined;
  const activity =
    activityRaw === "Manufacturing" || activityRaw === "Services" || activityRaw === "Trading"
      ? activityRaw
      : null;

  // Decide input mode + html type so mobile keyboards match.
  let htmlType: string = field.type;
  let inputMode: React.HTMLAttributes<HTMLInputElement>["inputMode"] | undefined;
  if (isPincode || isMobile || isAadhaar) {
    htmlType = "tel";
    inputMode = "numeric";
  } else if (field.type === "number") {
    inputMode = "decimal";
  } else if (isPan) {
    htmlType = "text";
  }

  return (
    <div className={colSpan}>
      <label htmlFor={id} className="block text-sm font-semibold text-foreground mb-1.5">
        {field.label}
        {field.required && <span className="text-destructive"> *</span>}
      </label>
      {field.type === "textarea" ? (
        <textarea {...common} rows={3} />
      ) : isState ? (
        <select {...common}>
          <option value="" disabled>
            Select state…
          </option>
          {INDIA_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      ) : field.type === "select" ? (
        <select {...common}>
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
          id={id}
          value={value}
          onChange={onChange}
          digits={field.nicDigits ?? 5}
          activity={activity}
          required={field.required}
        />
      ) : (
        <input
          type={htmlType}
          inputMode={inputMode}
          autoCapitalize={isPan ? "characters" : undefined}
          autoComplete={isMobile ? "tel" : field.type === "email" ? "email" : undefined}
          {...common}
        />
      )}
      {field.help && <p className="mt-1 text-xs text-muted-foreground">{field.help}</p>}
    </div>
  );
}
