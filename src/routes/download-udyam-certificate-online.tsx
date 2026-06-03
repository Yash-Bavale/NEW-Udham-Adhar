import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/download-udyam-certificate-online.html?raw";

export const Route = createFileRoute("/download-udyam-certificate-online")({
    head: () => ({
    meta: [
      { title: "Udyam Registration Certificate Download" },
      { name: "description", content: "Expert consultancy assistance for udyam registration certificate download. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Registration Certificate Download" },
      { property: "og:description", content: "Expert consultancy assistance for udyam registration certificate download. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/download-udyam-certificate-online" },
    ],
  }),
  component: () => <SeoLandingPage title="Download Udyam" html={html} />,
});
