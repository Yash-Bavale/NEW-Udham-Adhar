# Stabilize failed email delivery

## What is happening
Zoho is temporarily blocking outgoing mail with `550 5.4.6 Unusual sending activity`. The app is healthy, but its retry detector does not recognize this exact Zoho wording, so failed emails are retried too quickly and increase pressure on the mailbox.

## Changes
- Recognize Zoho's exact unusual-activity and “try after sometime” responses as a provider block.
- Pause processing after the first blocked send and defer that email without consuming another retry attempt.
- Keep all currently failed emails queued for automatic recovery; do not delete or duplicate them.
- Verify the email worker builds and that no unrelated email, order, lead, or support behavior changes.

## Action still needed outside the app
Zoho controls the temporary sender restriction. After the cooldown, the app will retry safely. If Zoho continues blocking the mailbox, the account owner must review the mailbox's outgoing limits/security alert with Zoho. Separately, branded Lovable email delivery is not configured in this workspace, so Zoho remains the only active sender.
