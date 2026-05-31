import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-download.html?raw";

export const Route = createFileRoute("/udyam-certificate-download")({
    head: () => ({
    meta: [
      { title: "Udyam Certificate Download - Instant MSME Certificate Ac..." },
      { name: "description", content: "Expert consultancy assistance for udyam certificate download - instant msme certificate ac.... Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "Udyam Certificate Download - Instant MSME Certificate Ac..." },
      { property: "og:description", content: "Expert consultancy assistance for udyam certificate download - instant msme certificate ac.... Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-certificate-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Certificate Download - Instant MSME Certificate Access" html={html} />,
});
