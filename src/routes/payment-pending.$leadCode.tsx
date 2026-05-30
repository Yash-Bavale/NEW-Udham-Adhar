import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/payment-pending/$leadCode")({
  head: () => ({
    meta: [
      { title: "Request Received — Payment Will Be Initiated Shortly" },
      { name: "description", content: "Your request has been recorded. Our team will contact you to complete the payment." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: PendingPage,
});

function PendingPage() {
  const { leadCode } = Route.useParams();
  return (
    <PageHero title="Request Received">
      <p>
        Thank you — your details have been recorded successfully. Online payment
        is currently being configured, so our team will contact you on your
        registered mobile or email shortly to share the payment link and begin
        processing.
      </p>
      <p>
        Your reference number is{" "}
        <strong className="font-mono text-brand-navy">{leadCode}</strong>.
        Please save it for any future communication.
      </p>
      <p>
        <Link to="/">Back to Home</Link> · <Link to="/contact">Contact Us</Link>
      </p>
    </PageHero>
  );
}
