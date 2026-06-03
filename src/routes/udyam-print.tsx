import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-print.html?raw";

export const Route = createFileRoute("/udyam-print")({
    head: () => ({
    meta: [
      { title: "Udyam Print Certificate | Download & Print MSME Certificate" },
      { name: "description", content: "Expert consultancy assistance for udyam print certificate | download & print msme certificate. Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "Udyam Print Certificate | Download & Print MSME Certificate" },
      { property: "og:description", content: "Expert consultancy assistance for udyam print certificate | download & print msme certificate. Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-print" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Print" linkTitle="Udyam Print Certificate | Download & Print MSME Certificate" html={html} />,
});
