import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Udyam Registration Consultancy" },
      { name: "description", content: "Contact Business Help Services for Udyam Registration consultancy assistance." },
      { property: "og:title", content: "Contact Us — Udyam Registration Consultancy" },
      { property: "og:description", content: "Reach out to Business Help Services for help with your Udyam Registration." },
    ],
  }),
  component: () => (
    <PageHero title="Contact Us">
      <p>For consultancy assistance and queries:</p>
      <ul>
        <li>Email: <a href="mailto:support@udyamadhar.in">support@udyamadhar.in</a></li>
        <li>Hours: Monday – Saturday, 10:00 AM – 7:00 PM IST</li>
      </ul>
      <p>
        For a new application or a service request, please use the
        <a href="/"> Udyam Registration form on our homepage</a> — our team will
        contact you on the mobile/email you submit.
      </p>
    </PageHero>
  ),
});
