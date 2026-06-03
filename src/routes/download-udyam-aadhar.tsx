import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/download-udyam-aadhar.html?raw";

export const Route = createFileRoute("/download-udyam-aadhar")({
    head: () => ({
    meta: [
      { title: "Udyam Registration Certificate Download | MSME Certificate Online" },
      { name: "description", content: "Expert consultancy assistance for udyam registration certificate download | msme certificate online. Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "Udyam Registration Certificate Download | MSME Certificate Online" },
      { property: "og:description", content: "Expert consultancy assistance for udyam registration certificate download | msme certificate online. Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/download-udyam-aadhar" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Registration Certificate Download | MSME Certificate Online" html={html} />,
});
