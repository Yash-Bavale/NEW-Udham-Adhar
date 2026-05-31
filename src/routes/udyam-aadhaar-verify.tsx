import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhaar-verify.html?raw";

export const Route = createFileRoute("/udyam-aadhaar-verify")({
    head: () => ({
    meta: [
      { title: "Udyam Aadhaar Verify" },
      { name: "description", content: "Expert consultancy assistance for udyam aadhaar verify. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Aadhaar Verify" },
      { property: "og:description", content: "Expert consultancy assistance for udyam aadhaar verify. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-aadhaar-verify" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhaar Verify | Check MSME Business Help Services Status" html={html} />,
});
