import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Udyam Registration Consultancy" },
      { name: "description", content: "About Business Help Services — a private consultancy assisting MSMEs with Udyam Registration." },
      { property: "og:title", content: "About Us — Udyam Registration Consultancy" },
      { property: "og:description", content: "Learn about Business Help Services and our Udyam Registration consultancy assistance." },
    ],
  }),
  component: () => (
    <PageHero title="About Us">
      <p>
        <strong>Business Help Services</strong> is a private consultancy that
        helps Indian micro, small and medium enterprises navigate the Udyam
        Registration process end-to-end. We assist with new registrations,
        certificate updates, downloads, Udyog Aadhaar migration, mobile/email
        recovery, and PAN/Aadhaar corrections.
      </p>
      <p>
        We are <strong>not affiliated with, authorized by, endorsed by, or
        associated with any government authority or department</strong>. All
        charges collected on this website are strictly consultancy and
        assistance service fees, not any government fee.
      </p>
      <p>
        Ready to begin? <Link to="/">Apply on the homepage</Link> or{" "}
        <Link to="/contact">contact us</Link>.
      </p>
    </PageHero>
  ),
});
