import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/important-notice")({
  head: () => ({
    meta: [
      { title: "Important Notice — Udyam Registration Consultancy" },
      { name: "description", content: "Important notice and disclaimer regarding the consultancy services offered on this website." },
      { property: "og:title", content: "Important Notice" },
      { property: "og:description", content: "Important notice and disclaimer from Business Help Services." },
    ],
  }),
  component: () => (
    <PageHero title="Important Notice">
      <p>
        <strong>Business Help Services</strong> is a private consultancy and
        assistance service provider and is <strong>not affiliated with,
        authorized by, endorsed by, or associated with any government
        authority or department.</strong>
      </p>
      <p>
        All charges collected on this website are strictly consultancy and
        assistance service fees, and not any government fee. Government
        registration on the official Udyam portal is free of cost.
      </p>
      <p>
        By submitting your details on this website you acknowledge the above
        and agree to our Terms &amp; Conditions, Privacy Policy, Refund &amp;
        Cancellation Policy, Disclaimer, and Pricing Transparency.
      </p>
    </PageHero>
  ),
});
