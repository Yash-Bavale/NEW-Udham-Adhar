## Plan: stop hiding customer name, number, and email

1. **Restore contact visibility in the Talk-to-Expert order view**
   - Keep the Talk-to-Expert conversion card as the primary action.
   - Add an always-visible customer contact card directly beside/near it showing full customer name, mobile, and email with copy/call/WhatsApp/email actions.
   - This will remain visible even while onboarding/fulfillment panels are hidden for unconverted Talk-to-Expert orders.

2. **Fix order detail fallback data**
   - In the order detail header/action bar/customer mini-profile, use customer values first and lead values as fallback for name, mobile, and email.
   - Current order page already receives lead contact data, but the side customer card only displays `customer.primary_mobile/email`, so it can look hidden when the customer record is incomplete.

3. **Fix order list contact completeness**
   - Include lead email/mobile in the order-list rollup so rows can show customer contact reliably even if the customer profile fields are missing.
   - Keep financial fields hidden for operations/support exactly as requested; only contact information is restored.

4. **Verify**
   - Check `/admin/orders/083d3e35-8484-4567-b867-0b8b9e249498` and confirm name, number, and email are visible while the Talk-to-Expert service panel remains visible.
   - Check the orders list still hides payment/invoice details for non-finance roles but does not hide customer contact fields.