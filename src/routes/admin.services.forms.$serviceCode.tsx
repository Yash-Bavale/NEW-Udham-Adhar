import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowUp, ArrowDown, Plus, Trash2, Eye, Save, History } from "lucide-react";
import {
  getBuilderSchema,
  getBuilderSchemaVersion,
  saveBuilderSchema,
  type BuilderSaveInput,
} from "@/lib/crm/form-builder.functions";
import { getSchema as getFallbackSchema } from "@/lib/onboarding/schemas";
import { OnboardingForm } from "@/components/onboarding/OnboardingForm";

export const Route = createFileRoute("/admin/services/forms/$serviceCode")({
  head: () => ({
    meta: [{ title: "Form Builder — Admin" }],
  }),
  component: FormBuilderPage,
});

type Field = BuilderSaveInput["sections"][number]["fields"][number];
type Section = BuilderSaveInput["sections"][number];
type Doc = BuilderSaveInput["documents"][number];

const FIELD_TYPES: Field["type"][] = [
  "text", "email", "tel", "number", "date", "select", "textarea", "nic", "plants", "section",
];

const NEW_FIELD: Record<Field["type"], () => Field> = {
  text: () => ({ key: newKey("field"), label: "New text field", type: "text" }),
  email: () => ({ key: newKey("email"), label: "Email", type: "email" }),
  tel: () => ({ key: newKey("mobile"), label: "Mobile", type: "tel", pattern: "^[6-9]\\d{9}$" }),
  number: () => ({ key: newKey("number"), label: "Number", type: "number" }),
  date: () => ({ key: newKey("date"), label: "Date", type: "date" }),
  select: () => ({ key: newKey("select"), label: "Select", type: "select", options: ["Option 1", "Option 2"] }),
  textarea: () => ({ key: newKey("notes"), label: "Notes", type: "textarea" }),
  nic: () => ({ key: newKey("nic"), label: "NIC Code", type: "nic", nicDigits: 5, activityFrom: "major_activity" }),
  plants: () => ({ key: newKey("plants"), label: "Plants / Units", type: "plants" }),
  section: () => ({ key: newKey("section"), label: "Section header", type: "section" }),
};

function newKey(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 7)}`;
}

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 60) || "field";
}

function FormBuilderPage() {
  const { serviceCode } = Route.useParams();
  const loadFn = useServerFn(getBuilderSchema);
  const saveFn = useServerFn(saveBuilderSchema);
  const loadVersionFn = useServerFn(getBuilderSchemaVersion);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["builder", serviceCode],
    queryFn: () => loadFn({ data: { service_code: serviceCode } }),
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sections, setSections] = useState<Section[]>([]);
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [selected, setSelected] = useState<{ s: number; f: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Hydrate from DB or fall back to TS registry
  useEffect(() => {
    if (!data) return;
    const active = data.active;
    if (active) {
      setTitle(active.title || "");
      setDescription(active.description || "");
      setDocuments(Array.isArray(active.documents) ? (active.documents as Doc[]) : []);
      const schemaAny = active.schema as { sections?: Section[]; fields?: Field[] } | null;
      if (schemaAny?.sections?.length) {
        setSections(schemaAny.sections);
      } else if (schemaAny?.fields?.length) {
        setSections(flatFieldsToSections(schemaAny.fields));
      } else {
        setSections([{ key: "default", label: "Details", fields: [] }]);
      }
    } else {
      // Fall back to TS registry so admin can begin from the existing form
      const fb = getFallbackSchema(serviceCode);
      setTitle(fb.title);
      setDescription(fb.description);
      setDocuments(fb.documents.map((d) => ({ key: d.key, label: d.label, required: d.required, help: d.help })));
      setSections(flatFieldsToSections(fb.fields as unknown as Field[]));
    }
  }, [data, serviceCode]);

  const previewSchema = useMemo(() => {
    const fields = sections.flatMap((s) => s.fields);
    return { title, description, fields: fields as unknown as ReturnType<typeof getFallbackSchema>["fields"], documents: documents as unknown as ReturnType<typeof getFallbackSchema>["documents"] };
  }, [sections, documents, title, description]);

  const activeField: Field | null =
    selected && sections[selected.s]?.fields[selected.f] ? sections[selected.s].fields[selected.f] : null;

  function updateField(patch: Partial<Field>) {
    if (!selected) return;
    setSections((prev) => {
      const copy = prev.map((s) => ({ ...s, fields: [...s.fields] }));
      copy[selected.s].fields[selected.f] = { ...copy[selected.s].fields[selected.f], ...patch };
      return copy;
    });
  }

  function moveField(s: number, f: number, dir: -1 | 1) {
    setSections((prev) => {
      const copy = prev.map((sec) => ({ ...sec, fields: [...sec.fields] }));
      const arr = copy[s].fields;
      const j = f + dir;
      if (j < 0 || j >= arr.length) return prev;
      [arr[f], arr[j]] = [arr[j], arr[f]];
      return copy;
    });
    if (selected?.s === s && selected.f === f) setSelected({ s, f: f + dir });
  }

  function deleteField(s: number, f: number) {
    setSections((prev) => {
      const copy = prev.map((sec) => ({ ...sec, fields: [...sec.fields] }));
      copy[s].fields.splice(f, 1);
      return copy;
    });
    setSelected(null);
  }

  function addField(s: number, type: Field["type"]) {
    setSections((prev) => {
      const copy = prev.map((sec) => ({ ...sec, fields: [...sec.fields] }));
      copy[s].fields.push(NEW_FIELD[type]());
      return copy;
    });
  }

  function addSection() {
    setSections((prev) => [...prev, { key: `sec_${prev.length + 1}`, label: `New Section ${prev.length + 1}`, fields: [] }]);
  }

  function moveSection(s: number, dir: -1 | 1) {
    setSections((prev) => {
      const j = s + dir;
      if (j < 0 || j >= prev.length) return prev;
      const copy = [...prev];
      [copy[s], copy[j]] = [copy[j], copy[s]];
      return copy;
    });
  }

  function deleteSection(s: number) {
    if (!confirm("Delete this section and all its fields?")) return;
    setSections((prev) => prev.filter((_, i) => i !== s));
    setSelected(null);
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      await saveFn({
        data: {
          service_code: serviceCode,
          title,
          description,
          sections,
          documents,
        },
      });
      await refetch();
      alert("Saved as new version");
    } catch (e) {
      setSaveError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function restoreVersion(id: string) {
    if (!confirm("Load this version into the editor? Save afterwards to publish it as a new version.")) return;
    const { row } = await loadVersionFn({ data: { id } });
    if (!row) return;
    setTitle(row.title || "");
    setDescription(row.description || "");
    setDocuments(Array.isArray(row.documents) ? (row.documents as Doc[]) : []);
    const schemaAny = row.schema as { sections?: Section[]; fields?: Field[] } | null;
    if (schemaAny?.sections?.length) setSections(schemaAny.sections);
    else if (schemaAny?.fields?.length) setSections(flatFieldsToSections(schemaAny.fields));
    setShowHistory(false);
  }

  if (isLoading) return <div className="p-6 text-slate-500">Loading…</div>;

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <Link to="/admin/services" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900">
            <ArrowLeft className="size-4" /> Back to Services
          </Link>
          <span className="text-slate-300">/</span>
          <div>
            <div className="text-xs text-slate-500">Form Builder</div>
            <div className="font-mono text-sm">{serviceCode}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowHistory(true)} className="inline-flex items-center gap-1 rounded border px-3 py-1.5 text-sm">
            <History className="size-4" /> History ({data?.versions.length ?? 0})
          </button>
          <button onClick={() => setShowPreview(true)} className="inline-flex items-center gap-1 rounded border px-3 py-1.5 text-sm">
            <Eye className="size-4" /> Preview
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-sm disabled:opacity-50"
          >
            <Save className="size-4" /> {saving ? "Saving…" : "Save new version"}
          </button>
        </div>
      </div>

      {saveError && <div className="rounded border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{saveError}</div>}

      {/* Form meta */}
      <div className="rounded-lg border bg-white p-4 space-y-3">
        <label className="block text-sm">
          <div className="text-xs text-slate-500 mb-1">Form title</div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded border px-3 py-2" />
        </label>
        <label className="block text-sm">
          <div className="text-xs text-slate-500 mb-1">Description</div>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full rounded border px-3 py-2" />
        </label>
      </div>

      {/* 3-col layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_320px] gap-4">
        {/* Palette */}
        <aside className="rounded-lg border bg-white p-3 h-fit sticky top-4">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Add field</div>
          <div className="space-y-1">
            {FIELD_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => addField(sections.length ? sections.length - 1 : 0, t)}
                disabled={!sections.length}
                className="w-full text-left rounded border px-2 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50"
              >
                + {t}
              </button>
            ))}
          </div>
          <button onClick={addSection} className="mt-3 w-full rounded bg-slate-900 text-white px-2 py-1.5 text-sm">
            + New Section
          </button>
        </aside>

        {/* Canvas */}
        <div className="space-y-4">
          {sections.map((sec, si) => (
            <div key={si} className="rounded-lg border bg-white">
              <div className="flex items-center gap-2 border-b px-3 py-2 bg-slate-50">
                <input
                  value={sec.label}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSections((prev) => prev.map((s, i) => (i === si ? { ...s, label: val } : s)));
                  }}
                  className="flex-1 rounded border px-2 py-1 text-sm font-medium bg-white"
                />
                <button onClick={() => moveSection(si, -1)} className="p-1 hover:bg-slate-200 rounded" title="Move up"><ArrowUp className="size-4" /></button>
                <button onClick={() => moveSection(si, 1)} className="p-1 hover:bg-slate-200 rounded" title="Move down"><ArrowDown className="size-4" /></button>
                <button onClick={() => deleteSection(si)} className="p-1 hover:bg-rose-100 text-rose-600 rounded" title="Delete section"><Trash2 className="size-4" /></button>
              </div>
              <div className="divide-y">
                {sec.fields.map((f, fi) => {
                  const isSel = selected?.s === si && selected.f === fi;
                  return (
                    <div
                      key={fi}
                      onClick={() => setSelected({ s: si, f: fi })}
                      className={`px-3 py-2 cursor-pointer flex items-center gap-2 ${isSel ? "bg-blue-50" : "hover:bg-slate-50"}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">{f.label || "(untitled)"}</span>
                          {f.required && <span className="text-rose-600 text-xs">*</span>}
                          <span className="text-[10px] uppercase tracking-wide bg-slate-100 text-slate-600 px-1.5 rounded">{f.type}</span>
                        </div>
                        <div className="text-xs text-slate-400 font-mono truncate">{f.key}</div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); moveField(si, fi, -1); }} className="p-1 hover:bg-slate-200 rounded"><ArrowUp className="size-3.5" /></button>
                      <button onClick={(e) => { e.stopPropagation(); moveField(si, fi, 1); }} className="p-1 hover:bg-slate-200 rounded"><ArrowDown className="size-3.5" /></button>
                      <button onClick={(e) => { e.stopPropagation(); deleteField(si, fi); }} className="p-1 hover:bg-rose-100 text-rose-600 rounded"><Trash2 className="size-3.5" /></button>
                    </div>
                  );
                })}
                <div className="px-3 py-2 flex flex-wrap gap-1">
                  {FIELD_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => addField(si, t)}
                      className="rounded border px-2 py-0.5 text-xs hover:bg-slate-50"
                    >
                      <Plus className="size-3 inline" /> {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Documents */}
          <div className="rounded-lg border bg-white">
            <div className="border-b px-3 py-2 bg-slate-50 flex items-center justify-between">
              <div className="font-medium text-sm">Required Documents</div>
              <button
                onClick={() => setDocuments((d) => [...d, { key: newKey("doc"), label: "New document", required: false }])}
                className="rounded border px-2 py-1 text-xs"
              >+ Document</button>
            </div>
            <div className="divide-y">
              {documents.map((d, i) => (
                <div key={i} className="px-3 py-2 grid grid-cols-12 gap-2 items-center">
                  <input
                    value={d.label}
                    onChange={(e) => setDocuments((docs) => docs.map((x, j) => j === i ? { ...x, label: e.target.value } : x))}
                    placeholder="Label"
                    className="col-span-5 rounded border px-2 py-1 text-sm"
                  />
                  <input
                    value={d.key}
                    onChange={(e) => setDocuments((docs) => docs.map((x, j) => j === i ? { ...x, key: slugify(e.target.value) } : x))}
                    placeholder="key"
                    className="col-span-3 rounded border px-2 py-1 text-sm font-mono"
                  />
                  <label className="col-span-2 text-xs flex items-center gap-1">
                    <input type="checkbox" checked={!!d.required} onChange={(e) => setDocuments((docs) => docs.map((x, j) => j === i ? { ...x, required: e.target.checked } : x))} />
                    Required
                  </label>
                  <button onClick={() => setDocuments((docs) => docs.filter((_, j) => j !== i))} className="col-span-2 text-rose-600 text-xs hover:underline">Remove</button>
                </div>
              ))}
              {documents.length === 0 && <div className="px-3 py-4 text-xs text-slate-400 text-center">No documents required</div>}
            </div>
          </div>
        </div>

        {/* Settings panel */}
        <aside className="rounded-lg border bg-white p-3 h-fit sticky top-4">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Field settings</div>
          {!activeField && <div className="text-sm text-slate-400">Select a field to edit</div>}
          {activeField && (
            <div className="space-y-3">
              <Tf label="Label" value={activeField.label} onChange={(v) => updateField({ label: v })} />
              <Tf
                label="Key (used in data)"
                value={activeField.key}
                mono
                onChange={(v) => updateField({ key: slugify(v) })}
              />
              <label className="block text-sm">
                <div className="text-xs text-slate-500 mb-1">Type</div>
                <select
                  value={activeField.type}
                  onChange={(e) => updateField({ type: e.target.value as Field["type"] })}
                  className="w-full rounded border px-2 py-1.5 text-sm"
                >
                  {FIELD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
              {activeField.type !== "section" && activeField.type !== "plants" && (
                <label className="text-sm flex items-center gap-2">
                  <input type="checkbox" checked={!!activeField.required} onChange={(e) => updateField({ required: e.target.checked })} />
                  Required
                </label>
              )}
              {["text", "email", "tel", "number", "textarea"].includes(activeField.type) && (
                <>
                  <Tf label="Placeholder" value={activeField.placeholder ?? ""} onChange={(v) => updateField({ placeholder: v || undefined })} />
                  <Tf label="Max length" value={String(activeField.maxLength ?? "")} onChange={(v) => updateField({ maxLength: v ? Number(v) : undefined })} />
                  <Tf label="Regex pattern" value={activeField.pattern ?? ""} mono onChange={(v) => updateField({ pattern: v || undefined })} />
                </>
              )}
              {activeField.type === "select" && (
                <label className="block text-sm">
                  <div className="text-xs text-slate-500 mb-1">Options (one per line)</div>
                  <textarea
                    rows={6}
                    value={(activeField.options ?? []).join("\n")}
                    onChange={(e) => updateField({ options: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
                    className="w-full rounded border px-2 py-1.5 text-sm font-mono"
                  />
                </label>
              )}
              {activeField.type === "nic" && (
                <>
                  <label className="block text-sm">
                    <div className="text-xs text-slate-500 mb-1">NIC digits</div>
                    <select
                      value={activeField.nicDigits ?? 5}
                      onChange={(e) => updateField({ nicDigits: Number(e.target.value) as 2 | 4 | 5 })}
                      className="w-full rounded border px-2 py-1.5 text-sm"
                    >
                      <option value={2}>2</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </select>
                  </label>
                  <Tf label="Activity source field key" mono value={activeField.activityFrom ?? ""} onChange={(v) => updateField({ activityFrom: v || undefined })} />
                </>
              )}
              <Tf label="Help text" value={activeField.help ?? ""} onChange={(v) => updateField({ help: v || undefined })} />
            </div>
          )}
        </aside>
      </div>

      {/* Preview modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPreview(false)}>
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">Preview</div>
              <button onClick={() => setShowPreview(false)} className="text-slate-500">✕</button>
            </div>
            <OnboardingForm
              schema={previewSchema}
              initial={{}}
              busy={false}
              onSubmit={async () => alert("Preview only — not saved")}
            />
          </div>
        </div>
      )}

      {/* History drawer */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowHistory(false)}>
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b flex items-center justify-between">
              <div className="font-semibold">Version history</div>
              <button onClick={() => setShowHistory(false)} className="text-slate-500">✕</button>
            </div>
            <div className="divide-y">
              {data?.versions.map((v) => (
                <div key={v.id} className="p-3 flex items-center gap-3">
                  <div className="flex-1">
                    <div className="text-sm font-medium">v{v.version} {v.is_active && <span className="ml-2 text-emerald-700 text-xs">ACTIVE</span>}</div>
                    <div className="text-xs text-slate-500 truncate">{v.title}</div>
                    <div className="text-[11px] text-slate-400">{new Date(v.updated_at).toLocaleString()}</div>
                  </div>
                  <button onClick={() => restoreVersion(v.id)} className="text-xs rounded border px-2 py-1 hover:bg-slate-50">Load</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function flatFieldsToSections(fields: Field[]): Section[] {
  const secs: Section[] = [];
  let current: Section | null = null;
  for (const f of fields) {
    if (f.type === "section") {
      current = { key: f.key, label: f.label, fields: [] };
      secs.push(current);
    } else {
      if (!current) {
        current = { key: "default", label: "Details", fields: [] };
        secs.push(current);
      }
      current.fields.push(f);
    }
  }
  return secs.length ? secs : [{ key: "default", label: "Details", fields }];
}

function Tf({ label, value, onChange, mono }: { label: string; value: string; onChange: (v: string) => void; mono?: boolean }) {
  return (
    <label className="block text-sm">
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded border px-2 py-1.5 text-sm ${mono ? "font-mono" : ""}`}
      />
    </label>
  );
}
