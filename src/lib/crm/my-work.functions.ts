import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type WorkApplication = {
  id: string;
  application_code: string | null;
  application_status: string;
  fulfillment_status: string | null;
  form_status: string;
  document_status: string;
  created_at: string;
  updated_at: string;
  lead: { id: string; name: string; email: string; mobile: string; service: string } | null;
};


export type WorkLead = {
  id: string;
  lead_code: string | null;
  name: string;
  email: string;
  mobile: string;
  service: string;
  status: string;
  created_at: string;
};

export type WorkDocument = {
  id: string;
  doc_type: string;
  file_name: string;
  uploaded_at: string;
  lead_id: string;
  application_id: string | null;
};

export type MyWorkSummary = {
  counters: {
    assignedApps: number;
    orderReceived: number;
    pendingDocs: number;
    assignedLeads: number;
    unreadNotifications: number;
    slaRisk: number;
  };
  assignedApplications: WorkApplication[];
  pendingDocuments: WorkDocument[];
  assignedLeads: WorkLead[];
};


const SLA_HOURS = 48; // app stale after 48h without movement

export const getMyWorkSummary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<MyWorkSummary> => {
    const { supabase, userId } = context;

    const [appsRes, docsRes, leadsRes, notifRes] = await Promise.all([
      supabase
        .from("applications")
        .select(
          "id, application_code, application_status, form_status, document_status, created_at, updated_at, lead:leads!fk_applications_lead(id, name, email, mobile, service)"
        )
        .eq("assigned_to", userId)
        .order("updated_at", { ascending: true })
        .limit(50),
      supabase
        .from("documents")
        .select("id, doc_type, file_name, uploaded_at, lead_id, application_id")
        .eq("status", "pending")
        .order("uploaded_at", { ascending: true })
        .limit(50),
      supabase
        .from("leads")
        .select("id, lead_code, name, email, mobile, service, status, created_at")
        .eq("assigned_to", userId)
        .in("status", ["lead_created", "new_lead", "payment_successful", "details_pending", "payment_pending"])
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .is("read_at", null),
    ]);

    if (appsRes.error) throw new Error(appsRes.error.message);
    if (docsRes.error) throw new Error(docsRes.error.message);
    if (leadsRes.error) throw new Error(leadsRes.error.message);
    if (notifRes.error) throw new Error(notifRes.error.message);

    const apps = (appsRes.data ?? []) as unknown as WorkApplication[];
    const docs = (docsRes.data ?? []) as unknown as WorkDocument[];
    const leads = (leadsRes.data ?? []) as unknown as WorkLead[];

    const slaThreshold = Date.now() - SLA_HOURS * 3600 * 1000;
    const slaRisk = apps.filter(
      (a) => new Date(a.updated_at).getTime() < slaThreshold && a.application_status !== "completed"
    ).length;

    return {
      counters: {
        assignedApps: apps.length,
        pendingDocs: docs.length,
        assignedLeads: leads.length,
        unreadNotifications: notifRes.count ?? 0,
        slaRisk,
      },
      assignedApplications: apps,
      pendingDocuments: docs,
      assignedLeads: leads,
    };
  });
