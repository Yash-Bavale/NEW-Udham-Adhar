import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/complaint-grievance-policy")({
  head: () => ({
    meta: [
      { title: "Complaint & Grievance Policy — Udyam Registration Consultancy" },
      { name: "description", content: "How to raise a complaint or grievance regarding our Udyam Registration consultancy services." },
      { property: "og:title", content: "Complaint & Grievance Policy" },
      { property: "og:description", content: "Complaint and grievance redressal policy for Business Help Services." },
    ],
  }),
  component: () => (
    <PageHero title="Complaint & Grievance Policy">
      <p>
        We take customer feedback seriously. If you have a complaint or
        grievance regarding any service or transaction, please write to{" "}
        <a href="mailto:support@udyamadhar.in">support@udyamadhar.in</a> with
        your registered mobile, email and a description of the issue.
      </p>
      <ul>
        <li>Acknowledgement: within 24 working hours.</li>
        <li>First response / resolution attempt: within 3 working days.</li>
        <li>Final resolution: typically within 7–10 working days, depending on complexity.</li>
      </ul>
      <p>
        Note: government portal processing timelines are outside our control —
        refer to our Refund &amp; Cancellation Policy for refund eligibility.
      </p>
      <p className="text-sm text-muted-foreground">Full policy content will be ported from the existing site.</p>
    </PageHero>
  ),
});
