import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-number-verify.html?raw";

export const Route = createFileRoute("/udyam-registration-number-verify")({
    head: () => ({
    meta: [
      { title: "Number Verify | MSME Certificate Validati" },
      { name: "description", content: "Expert consultancy assistance for number verify | msme certificate validati. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Number Verify | MSME Certificate Validati" },
      { property: "og:description", content: "Expert consultancy assistance for number verify | msme certificate validati. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-registration-number-verify" },
    ],
  }),
  component: () => <SeoLandingPage title="Business Help Services Number Verify | MSME Certificate Validati" html={html} />,
});
