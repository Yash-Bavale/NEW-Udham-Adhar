import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhaar-verify.html?raw";

export const Route = createFileRoute("/udyam-aadhaar-verify")({
  head: () => ({
    meta: [
      { title: "Udyam Aadhaar Verify — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam Aadhaar Verify. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Aadhaar Verify — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam Aadhaar Verify. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-aadhaar-verify" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhaar Verify" linkTitle="Udyam Aadhaar Verify" html={html} />,
});
