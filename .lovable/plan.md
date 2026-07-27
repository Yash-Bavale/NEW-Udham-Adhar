## What you need to do first

### 1. Create your destination Supabase project
1. Sign in to your own Supabase account.
2. Create a new project and save its database password in your password manager.
3. Do not create tables or import anything yet.
4. Do not paste the service-role key, database password, or access token into chat.

### 2. Request the supported source export
In this Lovable project, open **Cloud → Overview → Advanced settings → Export data** and request an export. Download it when Lovable notifies you that it is ready.

This is the supported way to extract the managed database. The source service-role key and database password are intentionally unavailable and are not needed for this migration.

### 3. Return with these two items
- Upload the downloaded Cloud export to this chat.
- Tell me that the destination project is created.

I will then open the appropriate secure connection/secret flow for the destination credentials. You will enter private values there, not in chat or source code.

## What I will do after that

### 4. Rebuild the destination backend
- Recreate the confirmed **74 public tables**, **80 public functions**, enums, sequences, indexes, triggers, grants, and RLS policies from the project migrations and source inventory.
- Recreate the private `documents`, `form-assets`, and `invoices` storage buckets and access policies.
- Recreate realtime publication coverage for the required CRM tables.
- Adapt queues, scheduled jobs, email processing, callbacks, and Cloud-specific infrastructure for the destination.

### 5. Move the data
- Import data in foreign-key-safe order while preserving lead IDs, order IDs, codes, timestamps, invoices, tickets, refunds, workflows, and audit history.
- Reset database sequences so future generated codes cannot collide.
- Compare source/destination row counts and run orphan and relationship checks.

### 6. Move authentication
- Recreate user identities and preserve an old-to-new user-ID map.
- Remap profiles, `user_roles`, assignments, ownership, audit actors, and other user-linked rows.
- Existing password hashes cannot be transferred; users will receive invitations or use password reset in the destination.
- Reconfigure email/password, Google sign-in, redirect URLs, and MCP OAuth.

### 7. Move storage files
- Create a complete manifest for documents, form assets, and invoices.
- Download source objects through authenticated application access and upload them to matching destination paths.
- Verify signed downloads, document previews, invoice access, and database file references.

### 8. Reconnect the app
- Point the browser and server clients to the destination project.
- Enter the destination service-role key only as a protected server secret.
- Re-enter external runtime secrets that cannot be exported.
- Update MCP issuer settings, scheduled callback URLs, webhooks, email queue dispatch, and any hardcoded backend references.

### 9. Validate and cut over
- Test login, roles, leads, orders, onboarding, payments, refunds, tickets, uploads, invoices, email, realtime alerts, dashboards, and MCP tools.
- Use a short write freeze for the final delta transfer.
- Switch production only after validation succeeds and retain the old backend temporarily for rollback.

## Important boundaries
- I cannot retrieve or expose Lovable Cloud’s service-role key, database password, or hidden backend login because Lovable Cloud does not make them available.
- I can perform the migration without that source key using the supported export, checked-in migrations, authenticated application access for files, and secure destination credentials.
- Do not delete or disable Lovable Cloud until the destination is fully validated.