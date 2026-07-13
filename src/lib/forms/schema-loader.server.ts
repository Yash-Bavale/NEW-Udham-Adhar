// Server-only: load a service form schema from DB, fall back to the TS registry.
// Keeps the existing OnboardingSchema shape so renderer + validator don't change.

import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  getSchema as getTsSchema,
  type OnboardingSchema,
  type FieldDef,
  type DocDef,
} from "@/lib/onboarding/schemas";

type DbSchemaRow = {
  title: string;
  description: string | null;
  schema: { fields?: FieldDef[]; sections?: Array<{ key: string; label: string; fields: FieldDef[] }> } | null;
  documents: DocDef[] | null;
};

function normalize(row: DbSchemaRow, fallback: OnboardingSchema): OnboardingSchema {
  // Support either flat `fields` or sectioned schema; flatten sections for legacy renderer.
  let fields: FieldDef[] = [];
  if (row.schema?.fields?.length) {
    fields = row.schema.fields;
  } else if (row.schema?.sections?.length) {
    fields = row.schema.sections.flatMap((s) => s.fields);
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
      required: field.required ?? fallbackField.required,
    };
  });

  return {
    title: row.title || fallback.title,
    description: row.description ?? fallback.description,
    fields: normalizedFields,
    documents: row.documents ?? fallback.documents,
  };
}

export async function loadServiceSchema(serviceCode: string): Promise<OnboardingSchema> {
  const fallback = getTsSchema(serviceCode);
  try {
    const { data } = await supabaseAdmin
      .from("service_form_schemas")
      .select("title, description, schema, documents")
      .eq("service_code", serviceCode)
      .eq("is_active", true)
      .order("version", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!data) return fallback;
    return normalize(data as DbSchemaRow, fallback);
  } catch (e) {
    console.error("loadServiceSchema fallback:", e);
    return fallback;
  }
}
