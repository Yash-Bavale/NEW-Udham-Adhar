import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-pan-registration.html?raw";

export const Route = createFileRoute("/udyam-pan-registration")({
    head: () => ({
    meta: [
      { title: "Udyam PAN Registration" },
      { name: "description", content: "Expert consultancy assistance for udyam pan registration. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam PAN Registration" },
      { property: "og:description", content: "Expert consultancy assistance for udyam pan registration. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-pan-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam PAN Registration | Link PAN With MSME Udyam Certificat" html={html} />,
});
