import { useState } from "react";
import type { FieldDef, OnboardingSchema } from "@/lib/onboarding/schemas";

const inputCls =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

export function OnboardingForm({
  schema,
  initial,
  busy,
  onSubmit,
  onSaveDraft,
}: {
  schema: OnboardingSchema;
  initial: Record<string, string>;
  busy: boolean;
  onSubmit: (data: Record<string, string>) => Promise<void> | void;
  onSaveDraft?: (data: Record<string, string>) => Promise<void> | void;
}) {
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [err, setErr] = useState<string | null>(null);

  function update(k: string, v: string) {
    setValues((s) => ({ ...s, [k]: v }));
  }

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      await onSubmit(values);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not save. Please try again.");
    }
  }

  return (
    <form onSubmit={handle} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        {schema.fields.map((f) => (
          <FieldRenderer key={f.key} field={f} value={values[f.key] ?? ""} onChange={(v) => update(f.key, v)} />
        ))}
      </div>

      {err && (
        <div className="rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm px-3 py-2">
          {err}
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-2">
        {onSaveDraft && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onSaveDraft(values)}
            className="rounded-full border border-border bg-background hover:bg-muted text-foreground font-medium px-6 py-2.5 transition-colors disabled:opacity-60"
          >
            Save draft
          </button>
        )}
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-brand-navy hover:bg-brand-navy-deep text-white font-semibold px-8 py-2.5 transition-colors disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save & Continue"}
        </button>
      </div>
    </form>
  );
}

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: string;
  onChange: (v: string) => void;
}) {
  const colSpan = field.type === "textarea" ? "md:col-span-2" : "";
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
  return (
    <div className={colSpan}>
      <label htmlFor={common.id} className="block text-sm font-semibold text-foreground mb-1.5">
        {field.label}
        {field.required && <span className="text-destructive"> *</span>}
      </label>
      {field.type === "textarea" ? (
        <textarea {...common} rows={3} />
      ) : field.type === "select" ? (
        <select {...common} defaultValue="">
          <option value="" disabled>
            Select…
          </option>
          {(field.options ?? []).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input type={field.type} {...common} />
      )}
      {field.help && <p className="mt-1 text-xs text-muted-foreground">{field.help}</p>}
    </div>
  );
}
