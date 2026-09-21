import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';

export type ActionType =
  | 'ORDER_ASSIGNED'
  | 'ORDER_REASSIGNED'
  | 'ORDER_OPENED'
  | 'CALL_ATTEMPTED'
  | 'CALL_CONNECTED'
  | 'CUSTOMER_CONTACTED'
  | 'CUSTOMER_DELAY_ADDED'
  | 'TECHNICAL_DELAY_ADDED'
  | 'CUSTOMER_DELAY_RESUMED'
  | 'TECHNICAL_DELAY_RESUMED'
  | 'CALLBACK_SCHEDULED'
  | 'CALLBACK_COMPLETED'
  | 'FORM_REVIEWED'
  | 'FORM_REQUESTED'
  | 'DOCUMENT_REVIEWED'
  | 'DOCUMENT_REQUESTED'
  | 'PAYMENT_VERIFIED'
  | 'PROCESSING_STARTED'
  | 'PROCESSING_UPDATED'
  | 'CERTIFICATE_GENERATED'
  | 'CERTIFICATE_DELIVERED'
  | 'ORDER_COMPLETED'
  | 'ORDER_CLOSED'
  | 'ORDER_REOPENED'
  | 'TICKET_REPLIED'
  | 'TICKET_CREATED'
  | 'HOT_ORDER_ADDED'
  | 'HOT_ORDER_REMOVED'
  | 'INTERNAL_NOTE_ADDED'
  | 'STATUS_CHANGED'
  | 'STAGE_CHANGED';

export interface LogActionParams {
  orderId: string;
  leadId?: string | null;
  customerId?: string | null;
  employeeId?: string | null;
  employeeName?: string | null;
  employeeRole?: string | null;
  actionType: ActionType;
  previousStatus?: string | null;
  newStatus?: string | null;
  previousStage?: string | null;
  newStage?: string | null;
  notes?: string | null;
  source?: 'employee' | 'admin' | 'super_admin' | 'system' | 'customer';
  customMetadata?: Record<string, any>;
  supabase?: any;
}

/**
 * Format date to IST string
 */
function getIstString(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Centralized audit logger for employee actions on orders.
 * Computes latency intervals and SLA adherence automatically.
 */
export async function logEmployeeOrderAction(params: LogActionParams): Promise<{ success: boolean; actionId?: string; error?: string }> {
  try {
    const {
      orderId,
      leadId,
      customerId,
      employeeId,
      employeeName,
      employeeRole,
      actionType,
      previousStatus,
      newStatus,
      previousStage,
      newStage,
      notes,
      source = 'employee',
      customMetadata = {},
      supabase,
    } = params;

    if (!orderId) {
      console.warn('[logEmployeeOrderAction] Skipping log: missing orderId');
      return { success: false, error: 'Missing orderId' };
    }

    const client = supabase;
    if (!client) {
      console.warn('[logEmployeeOrderAction] No Supabase client provided');
      return { success: false, error: 'No Supabase client' };
    }

    const now = new Date();
    const nowIso = now.toISOString();
    const nowIst = getIstString(now);

    // 1. Fetch the order metadata for assignment timestamp and SLA references
    const { data: order } = await client
      .from('orders')
      .select('id, assigned_to, assigned_at, created_at, is_hot, status, stage, customer_id, lead_id')
      .eq('id', orderId)
      .maybeSingle();

    // 2. Fetch the most recent prior action on this order to calculate time spent since previous action
    const { data: lastAction } = await client
      .from('order_action_logs')
      .select('created_at')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let timeSpentSinceAssignmentMs: number | null = null;
    if (order?.assigned_at) {
      const assignedTime = new Date(order.assigned_at).getTime();
      timeSpentSinceAssignmentMs = Math.max(0, now.getTime() - assignedTime);
    }

    let timeSpentSincePreviousActionMs: number | null = null;
    if (lastAction?.created_at) {
      const prevActionTime = new Date(lastAction.created_at).getTime();
      timeSpentSincePreviousActionMs = Math.max(0, now.getTime() - prevActionTime);
    }

    // 3. Compute SLA Status
    // First-Action / Response SLA: 2 hours (7200000 ms) from assignment
    // Hot Order Action SLA: 30 minutes (1800000 ms)
    // General Completion SLA: 24 hours (86400000 ms)
    let slaStatus: 'COMPLIANT' | 'AT_RISK' | 'BREACHED' = 'COMPLIANT';
    let isSlaBreached = false;

    if (order?.is_hot) {
      if (timeSpentSinceAssignmentMs !== null) {
        if (timeSpentSinceAssignmentMs > 1800000) { // > 30 mins
          slaStatus = 'BREACHED';
          isSlaBreached = true;
        } else if (timeSpentSinceAssignmentMs > 1200000) { // > 20 mins
          slaStatus = 'AT_RISK';
        }
      }
    } else if (actionType === 'ORDER_COMPLETED' || actionType === 'ORDER_CLOSED') {
      if (timeSpentSinceAssignmentMs !== null && timeSpentSinceAssignmentMs > 86400000) {
        slaStatus = 'BREACHED';
        isSlaBreached = true;
      }
    } else {
      if (timeSpentSinceAssignmentMs !== null) {
        if (timeSpentSinceAssignmentMs > 7200000) { // > 2 hours
          slaStatus = 'BREACHED';
          isSlaBreached = true;
        } else if (timeSpentSinceAssignmentMs > 5400000) { // > 1.5 hours
          slaStatus = 'AT_RISK';
        }
      }
    }

    // 4. Resolve Employee Name if missing but employeeId provided
    let finalEmpName = employeeName;
    let finalEmpRole = employeeRole;
    if (employeeId && (!finalEmpName || !finalEmpRole)) {
      const { data: profile } = await client
        .from('profiles')
        .select('id, full_name, email, role')
        .eq('id', employeeId)
        .maybeSingle();

      if (profile) {
        finalEmpName = finalEmpName || profile.full_name || profile.email || 'Employee';
        finalEmpRole = finalEmpRole || profile.role || 'employee';
      }
    }

    // 5. Insert into order_action_logs
    const insertPayload = {
      order_id: orderId,
      lead_id: leadId || order?.lead_id || null,
      customer_id: customerId || order?.customer_id || null,
      employee_id: employeeId || order?.assigned_to || null,
      employee_name: finalEmpName || 'Admin / System',
      employee_role: finalEmpRole || 'system',
      action_type: actionType,
      previous_status: previousStatus || null,
      new_status: newStatus || order?.status || null,
      previous_stage: previousStage || null,
      new_stage: newStage || order?.stage || null,
      timestamp: nowIso,
      created_at_ist: nowIst,
      time_spent_since_assignment_ms: timeSpentSinceAssignmentMs,
      time_spent_since_previous_action_ms: timeSpentSincePreviousActionMs,
      sla_status: slaStatus,
      is_sla_breached: isSlaBreached,
      notes: notes || null,
      source: source,
      metadata: customMetadata,
      created_at: nowIso,
    };

    const { data: inserted, error: insertErr } = await client
      .from('order_action_logs')
      .insert(insertPayload)
      .select('id')
      .single();

    if (insertErr) {
      console.error('[logEmployeeOrderAction] Error logging order action:', insertErr);
      return { success: false, error: insertErr.message };
    }

    return { success: true, actionId: inserted?.id };
  } catch (err: any) {
    console.error('[logEmployeeOrderAction] Unexpected error:', err);
    return { success: false, error: err.message || 'Unknown error' };
  }
}
