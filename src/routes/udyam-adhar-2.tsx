import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-adhar-2.html?raw";

export const Route = createFileRoute("/udyam-adhar-2")({
    head: () => ({
    meta: [
      { title: "Udyam Adhar" },
      { name: "description", content: "Expert consultancy assistance for udyam adhar. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Adhar" },
      { property: "og:description", content: "Expert consultancy assistance for udyam adhar. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-adhar-2" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Adhar Udyam Adhar Registration | New MSME Registration Online" html={html} />,
});
