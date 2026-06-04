import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-number-verify.html?raw";

export const Route = createFileRoute("/udyam-registration-number-verify")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Number Verify — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam Registration Number Verify. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Registration Number Verify — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam Registration Number Verify. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-registration-number-verify" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Registration Number Verify" linkTitle="Udyam Registration Number Verify" html={html} />,
});
