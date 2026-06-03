import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-card-download.html?raw";

export const Route = createFileRoute("/udyam-card-download")({
    head: () => ({
    meta: [
      { title: "Udyam Card Download – Get Your MSME Certificate Online" },
      { name: "description", content: "Expert consultancy assistance for udyam card download – get your msme certificate online. Get help with Udyam/MSME registration, updates and certificates acr..." },
      { property: "og:title", content: "Udyam Card Download – Get Your MSME Certificate Online" },
      { property: "og:description", content: "Expert consultancy assistance for udyam card download – get your msme certificate online. Get help with Udyam/MSME registration, updates and certificates acr..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-card-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Card Download" linkTitle="Udyam Card Download – Get Your MSME Certificate Online" html={html} />,
});
