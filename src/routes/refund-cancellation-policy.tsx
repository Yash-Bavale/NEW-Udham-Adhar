import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/refund-cancellation-policy")({
  head: () => ({
    meta: [
      { title: "Refund & Cancellation Policy — Udyam Registration Consultancy" },
      { name: "description", content: "Refund and cancellation policy for Udyam Registration consultancy services." },
      { property: "og:title", content: "Refund & Cancellation Policy" },
      { property: "og:description", content: "When and how refunds may be issued for consultancy fees." },
    ],
  }),
  component: () => (
    <PageHero title="Refund & Cancellation Policy">
      <p>
        Charges paid on this website are consultancy and assistance service
        fees. Refund eligibility depends on the stage of work performed and
        cooperation provided (such as supplying correct information, documents,
        and OTP/verification inputs on time).
      </p>
      <p className="text-sm text-muted-foreground">
        Full refund policy content will be ported from udyamadhar.in/refund-cancellation-policy.
      </p>
    </PageHero>
  ),
});
