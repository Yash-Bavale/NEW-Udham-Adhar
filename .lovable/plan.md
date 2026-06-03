Add `udyam-reg-certificate` (Official MSME Registration Website) as a child link under the **Udyamregistration** parent group in the footer.

Currently `udyam-reg-certificate` is the slug for the standalone "Official MSME Registration Website" parent group (group #6). The user wants it to also appear as a child under the "Udyamregistration" parent group.

Change:
- File: `src/components/site/Footer.tsx`
- In the `CATEGORIES` array, under the `udyamregistration` entry, append `"udyam-reg-certificate"` to the `childSlugs` array (currently ends with `"udyam-aadhar"`).

The "Official MSME Registration Website" parent group remains unchanged, so the page is reachable from both places.