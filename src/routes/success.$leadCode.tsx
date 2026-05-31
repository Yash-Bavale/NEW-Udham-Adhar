import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/success/$leadCode")({
  head: () => ({
    meta: [
      { title: "Payment Successful — Business Help Services Consultancy" },
      { name: "description", content: "Your consultancy fee has been received. Our team will contact you shortly." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { leadCode } = Route.useParams();
  return (
    <PageHero title="Payment Successful">
      <p>
        Thank you — your consultancy fee has been received and your request has
        been confirmed.
      </p>
      <p>
        Your reference number is{" "}
        <strong className="font-mono text-brand-navy">{leadCode}</strong>.
        Please save it for any future communication.
      </p>
      <p>
        Our team will contact you on your registered mobile or email within one
        working day to collect the remaining details and begin processing.
      </p>
      <p>
        <Link to="/">Back to Home</Link> · <Link to="/contact">Contact Us</Link>
      </p>
    </PageHero>
  );
}
