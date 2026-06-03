import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-reprint.html?raw";

export const Route = createFileRoute("/udyam-reprint")({
    head: () => ({
    meta: [
      { title: "Udyam Reprint Certificate | Reprint MSME Certificate Online" },
      { name: "description", content: "Expert consultancy assistance for udyam reprint certificate | reprint msme certificate online. Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "Udyam Reprint Certificate | Reprint MSME Certificate Online" },
      { property: "og:description", content: "Expert consultancy assistance for udyam reprint certificate | reprint msme certificate online. Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-reprint" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Reprint" linkTitle="Udyam Reprint Certificate | Reprint MSME Certificate Online" html={html} />,
});
