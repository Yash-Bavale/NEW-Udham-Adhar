import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { isUserAdmin } from "@/lib/audit";

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
    totalLeads: number;
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
    const isAdmin = await isUserAdmin(supabase, userId);

    // "Act now" = fresh orders with no employee action yet (S01/S02 or legacy order_received/null)
    const ACT_NOW_STATUSES = ["order_received", "S01", "S02", "awaiting_customer_form"];

    const [appsRes, assignedAppsCountRes, docsRes, leadsRes, totalLeadsRes, notifRes] = await Promise.all([
      supabase
        .from("applications")
        .select(
          "id, application_code, application_status, fulfillment_status, form_status, document_status, created_at, updated_at, lead:leads!fk_applications_lead(id, name, email, mobile, service)"
        )
        .eq("assigned_to", userId)
        .order("updated_at", { ascending: true })
        .limit(100),
      supabase
        .from("applications")
        .select("id", { count: "exact", head: true })
        .eq("assigned_to", userId),
      isAdmin
        ? supabase
            .from("documents")
            .select("id, doc_type, file_name, uploaded_at, lead_id, application_id")
            .eq("status", "pending")
            .order("uploaded_at", { ascending: true })
            .limit(50)
        : Promise.resolve({ data: [], error: null } as any),
      // Active = not-yet-contacted leads only (new/lead_created), oldest first so urgent ones surface
      supabase
        .from("leads")
        .select("id, lead_code, name, email, mobile, service, status, created_at")
        .eq("assigned_to", userId)
        .in("status", ["lead_created", "new_lead"])
        .order("created_at", { ascending: true })
        .limit(50),
      supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("assigned_to", userId),
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
        assignedApps: assignedAppsCountRes.count ?? apps.length,
        orderReceived: apps.filter((a) => ACT_NOW_STATUSES.includes(a.fulfillment_status ?? "order_received")).length,
        pendingDocs: docs.length,
        assignedLeads: leads.length,
        totalLeads: totalLeadsRes.count ?? 0,
        unreadNotifications: notifRes.count ?? 0,
        slaRisk,
      },
      assignedApplications: apps,
      pendingDocuments: docs,
      assignedLeads: leads,
    };
  });

