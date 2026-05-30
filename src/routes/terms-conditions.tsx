import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/terms-conditions")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Udyam Registration Consultancy" },
      { name: "description", content: "Terms and conditions governing the use of Udyam Registration consultancy services on this website." },
      { property: "og:title", content: "Terms & Conditions" },
      { property: "og:description", content: "Terms and conditions for Business Help Services." },
    ],
  }),
  component: () => (
    <PageHero title="Terms & Conditions">
      <p>
        By using this website and submitting any details, you agree to these
        Terms &amp; Conditions, our Privacy Policy, Refund &amp; Cancellation
        Policy, Disclaimer, Pricing Transparency statement, and Consents &amp;
        Acknowledgements.
      </p>
      <p className="text-sm text-muted-foreground">
        Full terms content will be ported verbatim from the existing site at udyamadhar.in/terms-conditions.
      </p>
    </PageHero>
  ),
});
