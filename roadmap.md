# Roadmap

- [x] Add a government-style NIC activity list: first selection saved automatically, Add Activity saves further selections, visible to staff
- [x] Make the main NIC search clearly labeled and allow numbered 2-, 4-, and 5-digit selections without inventing narrower codes
- [x] Add a single government-style NIC activity search above the 2/4/5-digit fields and autofill them on selection
- [x] Preserve all failed emails (74 held safely, no loss, no duplicates)
- [x] Add ZeptoMail as a sending option (templates, queue, schedules untouched)
- [ ] Switch sending to ZeptoMail — blocked: need ZeptoMail send token + verified sender address
- [ ] Release the 74 held emails in batches after the switch and verify delivery
- [ ] Smartflo config: agent_id column (done), listStaffUsers mapping (done), secrets SMARTFLO_WEBHOOK_SECRET/FALLBACK_TYPE/FALLBACK_ID (pending user form), webhook portal config answer (done), verify + publish
- [x] Rebuild dispute PDF output as exact selected email printouts plus selected invoice, without the summary/evidence cover or evidence branding
- [x] Customer Document Merge (service toggle + Merge PDF on order)
