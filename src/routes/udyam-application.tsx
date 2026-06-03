import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-application.html?raw";

export const Route = createFileRoute("/udyam-application")({
    head: () => ({
    meta: [
      { title: "Udyam Application Online" },
      { name: "description", content: "Expert consultancy assistance for udyam application online. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Application Online" },
      { property: "og:description", content: "Expert consultancy assistance for udyam application online. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-application" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Application Online | Apply for MSME Registration (Udyam Portal)" html={html} />,
});
