import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-print-with-annexure.html?raw";

export const Route = createFileRoute("/udyam-print-with-annexure")({
    head: () => ({
    meta: [
      { title: "Udyam Print With Annexure | Download Full MSME Certificate" },
      { name: "description", content: "Expert consultancy assistance for udyam print with annexure | download full msme certificate. Get help with Udyam/MSME registration, updates and certificates..." },
      { property: "og:title", content: "Udyam Print With Annexure | Download Full MSME Certificate" },
      { property: "og:description", content: "Expert consultancy assistance for udyam print with annexure | download full msme certificate. Get help with Udyam/MSME registration, updates and certificates..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-print-with-annexure" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Print With Annexure" linkTitle="Udyam Print With Annexure | Download Full MSME Certificate" html={html} />,
});
