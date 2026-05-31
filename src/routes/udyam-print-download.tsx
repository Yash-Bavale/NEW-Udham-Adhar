import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-print-download.html?raw";

export const Route = createFileRoute("/udyam-print-download")({
    head: () => ({
    meta: [
      { title: "Udyam Print Download | Download & Print MSME Certificate" },
      { name: "description", content: "Expert consultancy assistance for udyam print download | download & print msme certificate. Get help with Udyam/MSME registration, updates and certificates a..." },
      { property: "og:title", content: "Udyam Print Download | Download & Print MSME Certificate" },
      { property: "og:description", content: "Expert consultancy assistance for udyam print download | download & print msme certificate. Get help with Udyam/MSME registration, updates and certificates a..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-print-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Print Download | Download & Print MSME Certificate" html={html} />,
});
