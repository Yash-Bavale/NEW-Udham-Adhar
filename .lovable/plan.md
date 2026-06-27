## Problem

For `UA-2026-007641` (Download Udyam Certificate) the workspace's Form Submission panel shows only Applicant Name, Registered Mobile, Registered Email — **no Udyam Registration Number**. Reason: in the stored submission, `udyam_number` is an empty string (the customer saved the form as `draft` without entering it; the value shown in the screenshot is just the input placeholder, not real data). The panel's render loop filters out any field whose value is `undefined / null / ""`, so the missing field disappears entirely instead of showing as blank.

This makes staff think we didn't capture the field at all. The fix is to mirror the form: every schema field, in the same order as the form, always visible — with a `—` placeholder when empty.

## Change (UI only — frontend)

`src/components/admin/FormSubmissionPanel.tsx`

1. In `groupFieldsBySection` keep current ordering (already mirrors the schema → mirrors the form). No change there.
2. In the body render (`sections.map(...)`):
   - **Remove the `visible = section.fields.filter(...)` empty-value filter.** Render every field in the section.
   - Show empty values as `—` (the existing `mask()` already returns `—` for null/empty, so it just works once filtering is removed).
   - Drop the `if (!visible.length) return null` early-out so a section with all-empty values still renders its header.
3. In "Copy All Details": keep filtering empties out of the clipboard text (staff don't want to paste blanks to customers). Only the on-screen render changes.
4. No schema, server, or DB changes. `download-udyam-certificate` schema already has the correct fields in the correct order: Applicant Name → Udyam Registration Number → Registered Mobile Number → Registered Email ID.

## Out of scope

- The `aadhaar_mobile` value under "Other fields" — that key comes from the public landing form and isn't part of the service schema. Leaving it where it is.
- The submission's `draft` status / why the customer didn't fill the field — that's a customer behaviour issue, not a UI bug.

## Verification

Reload `/admin/orders/<orderId>` for the same order. The Form Submission panel should list, in form order:

```
Applicant Name           Udyam Registration Number
shailini ben             —
Registered Mobile Number Registered Email ID
9913235755               jontipatel94@gmail.com
```

Repeat against a fully-filled submission to confirm filled values still render normally.
