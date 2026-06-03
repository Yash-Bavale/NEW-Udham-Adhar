import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-download.html?raw";

export const Route = createFileRoute("/udyam-registration-download")({
    head: () => ({
    meta: [
      { title: "Download - Get MSME Certificate Online" },
      { name: "description", content: "Expert consultancy assistance for download - get msme certificate online. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Download - Get MSME Certificate Online" },
      { property: "og:description", content: "Expert consultancy assistance for download - get msme certificate online. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-registration-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Registration Download" html={html} />,
});
