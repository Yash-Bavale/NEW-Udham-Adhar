import { supabaseAdmin } from "./client.server-3kDCe7R3.mjs";
import { getSchema, withSectionHeadings } from "./schemas-DClqju6h.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function normalize(row, fallback) {
  let fields = [];
  if (row.schema?.sections?.length) {
    fields = withSectionHeadings(row.schema.sections);
  } else if (row.schema?.fields?.length) {
    fields = row.schema.fields;
  } else {
    fields = fallback.fields;
  }
  const fallbackByKey = new Map(fallback.fields.map((f) => [f.key, f]));
  const normalizedFields = fields.map((field) => {
    const fallbackField = fallbackByKey.get(field.key);
    if (fallbackField?.type !== "nic") return field;
    return {
      ...field,
      ...fallbackField,
      label: field.label || fallbackField.label,
      required: field.required ?? fallbackField.required
    };
  });
  const sampleUrl = row.schema?.meta?.sample_form_url ?? fallback.sample_form_url;
  const sampleLabel = row.schema?.meta?.sample_form_label ?? fallback.sample_form_label ?? "Download Standard Form";
  const baseInstructions = fallback.documentsInstructions;
  const documentsInstructions = baseInstructions || sampleUrl ? {
    lines: baseInstructions?.lines ?? [],
    downloadUrl: sampleUrl ?? baseInstructions?.downloadUrl,
    downloadLabel: sampleLabel ?? baseInstructions?.downloadLabel
  } : void 0;
  return {
    title: row.title || fallback.title,
    description: row.description ?? fallback.description,
    fields: normalizedFields,
    documents: row.documents ?? fallback.documents,
    documentsInstructions,
    sample_form_url: sampleUrl,
    sample_form_label: sampleLabel
  };
}
async function loadServiceSchema(serviceCode) {
  const fallback = getSchema(serviceCode);
  try {
    const { data } = await supabaseAdmin.from("service_form_schemas").select("title, description, schema, documents").eq("service_code", serviceCode).eq("is_active", true).order("version", { ascending: false }).limit(1).maybeSingle();
    if (!data) return fallback;
    return normalize(data, fallback);
  } catch (e) {
    console.error("loadServiceSchema fallback:", e);
    return fallback;
  }
}
export {
  loadServiceSchema
};
