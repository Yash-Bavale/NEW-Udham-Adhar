import { createFileRoute } from "@tanstack/react-router";
import { ServicePageLayout } from "@/components/site/ServicePageLayout";

export const Route = createFileRoute("/other-problem")({
  head: () => ({
    meta: [
      { title: "Other Udyam Problems — Forgot OTP, Mobile, PAN/Aadhaar Issues" },
      { name: "description", content: "Help with forgotten registered mobile/email, PAN/Aadhaar name mismatch, and other Business Help Services issues." },
      { property: "og:title", content: "Other Business Help Services Problems" },
      { property: "og:description", content: "Get consultancy help for forgotten OTP, mobile/email recovery, PAN/Aadhaar corrections, and more." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/other-problem" },
    ],
  }),
  component: () => (
    <ServicePageLayout title="Other Udyam Problems">
      <p>We assist with a range of common Business Help Services problems:</p>
      <ul>
        <li>Forgot Registered Mobile / Email</li>
        <li>Correct PAN / Aadhaar Name in Udyam</li>
        <li>OTP not received during registration / update</li>
        <li>NIC activity mismatch</li>
        <li>General queries — "Talk to Expert" service</li>
      </ul>
    </ServicePageLayout>
  ),
});
