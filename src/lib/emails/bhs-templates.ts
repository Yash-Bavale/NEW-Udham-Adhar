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
  /** E001 — Payment received / order confirmation + tax invoice (auto from payment webhook). */
  E001_PAYMENT_RECEIVED: 'order_confirmation',
  /** E002 — Order completed + certificate delivery (auto). */
  E002_ORDER_COMPLETED: 'order_completed',
  /** E003 — Form link / info request (manual: Send/Resend Form Link). */
  E003_FORM_LINK: 'welcome_and_form_link',
  /** E004 — Customer-side delay hold intimation (auto when customer-side delay logged). */
  E004_CUSTOMER_DELAY: 'bhs_e003_customer_delay',
  /** E005 — Our-side delay hold intimation (auto when internal/our-side delay logged). */
  E005_OUR_SIDE_DELAY: 'bhs_e004_our_side_delay',
  /** E006 — Final order closure (auto after delay grace window elapses without response). */
  E006_ORDER_CLOSED: 'order_closure_confirmation',
  /** E007 — Talk-to-expert consultation completed (auto on consultation done). */
  E007_TALK_TO_EXPERT: 'talk_to_expert_completed',
  /** E008 — Support ticket reply with reason (manual from support panel). */
  E008_TICKET_REPLY: 'support_ticket_reply',
  /** E009 — Support ticket resolved (auto on resolve). */
  E009_TICKET_RESOLVED: 'support_ticket_closed',
  /** E010 — Support ticket final closure (auto on close). */
  E010_TICKET_CLOSED_FINAL: 'support_ticket_closed_final',
  /** E011 — Refund approved & processed (auto). */
  E011_REFUND_PROCESSED: 'refund_processed_confirmation',
  /** E012 — Application submitted to Government portal, pending response (auto). */
  E012_SUBMITTED_TO_GOVT: 'bhs_e012_submitted_to_govt',
} as const;

export type BhsEmailCode = keyof typeof BHS_EMAILS;

