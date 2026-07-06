/**
 * BHS v2 PRD Email Registry (E001–E012)
 *
 * Maps the PRD's canonical email codes to the actual `email_templates.code`
 * rows in the DB. This lets action-panel code stay decoupled from the
 * physical template names (some E-codes reuse older templates).
 *
 * Every entry is a template that MUST exist in `public.email_templates`.
 * Enable / disable each template from Admin → Emails; all BHS v2 templates
 * ship disabled by default so nothing fires until the copy is reviewed.
 */
export const BHS_EMAILS = {
  /** E001 — Payment received / order confirmation (auto from PayU webhook). */
  E001_PAYMENT_RECEIVED: 'order_confirmation',
  /** E002 — Form link / info request (Send/Resend Form Link action). */
  E002_FORM_LINK: 'welcome_and_form_link',
  /** E003 — Customer-side delay notice (starts Scheduler 2). */
  E003_CUSTOMER_DELAY: 'bhs_e003_customer_delay',
  /** E004 — Order auto-closed after 8 business hours of no reply. */
  E004_ORDER_AUTO_CLOSED: 'order_closure_confirmation',
  /** E005 — Manual reminder from Employee Action Panel. */
  E005_MANUAL_REMINDER: 'bhs_e005_manual_reminder',
  /** E006 — Order completed + certificate delivery. */
  E006_ORDER_COMPLETED: 'order_completed',
  /** E007 — Feedback follow-up (post-completion nudge). */
  E007_FEEDBACK: 'bhs_e007_feedback',
  /** E008 — Ticket closed with reply. */
  E008_TICKET_CLOSED_REPLY: 'support_ticket_closed',
  /** E009 — Ticket closed – final (no further action). */
  E009_TICKET_CLOSED_FINAL: 'support_ticket_closed_final',
  /** E010 — Ticket auto-close notice (24h business time after last reply). */
  E010_TICKET_AUTOCLOSE: 'bhs_e010_ticket_autoclose',
  /** E011 — Refund processed. */
  E011_REFUND_PROCESSED: 'refund_processed_confirmation',
  /** E012 — Submitted to government portal. */
  E012_SUBMITTED_TO_GOVT: 'bhs_e012_submitted_to_govt',
} as const;

export type BhsEmailCode = keyof typeof BHS_EMAILS;
