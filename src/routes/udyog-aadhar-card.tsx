import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-card.html?raw";

export const Route = createFileRoute("/udyog-aadhar-card")({
    head: () => ({
    meta: [
      { title: "Udyog Aadhar Card - Old MSME Registration Document" },
      { name: "description", content: "Expert consultancy assistance for udyog aadhar card - old msme registration document. Get help with Udyam/MSME registration, updates and certificates across ..." },
      { property: "og:title", content: "Udyog Aadhar Card - Old MSME Registration Document" },
      { property: "og:description", content: "Expert consultancy assistance for udyog aadhar card - old msme registration document. Get help with Udyam/MSME registration, updates and certificates across ..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhar-card" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar Card - Old MSME Registration Document" html={html} />,
});
