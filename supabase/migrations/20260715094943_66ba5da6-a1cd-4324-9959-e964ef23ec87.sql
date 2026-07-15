INSERT INTO public.email_templates (code, name, subject, body_html, body_text, description, variables, is_enabled, is_system, category, sr_no, dispatch_mode)
VALUES (
  'E011',
  'E011 – Technical Delay Resolved – Order Resumed',
  'Good News: Your Order is Back on Track – Order No. {{order_number}}',
  '<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Your Order is Back on Track – Order No. {{order_number}}</title></head>
<body style="margin:0; padding:0; background:#F2F4F7; font-family:Arial, Helvetica, sans-serif; color:#1F2937;">
<!-- From: help@businesshelpservices.com | Display Name: Care | Business Help Services | Subject: Good News: Your Order is Back on Track – Order No. {{order_number}} -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2F4F7; padding:24px 0;">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.06);">
      <tr><td style="background:#0F766E; color:#ffffff; padding:20px 28px; font-size:18px; font-weight:600;">Business Help Services</td></tr>
      <tr><td style="padding:28px;">
        <p style="margin:0 0 12px; font-size:15px;">Dear {{customer_name}},</p>
        <p style="margin:0 0 12px; font-size:14px; line-height:1.55;">Great news — the technical issue that was holding up your order <strong>{{order_number}}</strong> has been fully resolved, and we have resumed processing.</p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0; background:#F0FDF4; border-left:3px solid #16A34A; border-radius:4px;">
          <tr><td style="padding:12px 16px; font-size:13px; color:#166534;">
            <strong>Resolved on:</strong> {{resolved_at}}
          </td></tr>
        </table>
        <p style="margin:0 0 12px; font-size:14px; line-height:1.55;">Our team is now actively working on your application again, and we will keep you posted at every next step until completion. No action is required from your side at the moment.</p>
        <p style="margin:0 0 12px; font-size:14px; line-height:1.55;">Thank you for your patience and continued trust in us.</p>
        <p style="margin:20px 0 4px; font-size:14px;">Warm regards,</p>
        <p style="margin:0; font-size:14px;"><strong>{{executive_name}}</strong><br/>Business Help Services</p>
      </td></tr>
      <tr><td style="background:#F9FAFB; padding:14px 28px; font-size:11px; color:#6B7280; text-align:center;">This is an automated update for order {{order_number}}. Please do not reply to this address for other queries.</td></tr>
    </table>
  </td></tr>
</table>
</body></html>',
  'Dear {{customer_name}},

Great news — the technical issue that was holding up your order {{order_number}} has been fully resolved, and we have resumed processing.

Resolved on: {{resolved_at}}

Our team is now actively working on your application again, and we will keep you posted at every next step. No action is required from your side.

Thank you for your patience.

Warm regards,
{{executive_name}}
Business Help Services',
  'Sent to the customer when a technical (our-side) delay is resolved and the order is resumed.',
  ARRAY['customer_name','order_number','resolved_at','executive_name']::text[],
  true,
  true,
  'order_lifecycle',
  11,
  'auto'
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  subject = EXCLUDED.subject,
  body_html = EXCLUDED.body_html,
  body_text = EXCLUDED.body_text,
  description = EXCLUDED.description,
  variables = EXCLUDED.variables,
  updated_at = now();