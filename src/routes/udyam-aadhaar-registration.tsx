import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhaar-registration.html?raw";

export const Route = createFileRoute("/udyam-aadhaar-registration")({
  head: () => ({
    meta: [
      { title: "Udyam Aadhaar registration — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam Aadhaar registration. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Aadhaar registration — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam Aadhaar registration. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-aadhaar-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhaar registration" linkTitle="Udyam Aadhaar registration" html={html} />,
});
