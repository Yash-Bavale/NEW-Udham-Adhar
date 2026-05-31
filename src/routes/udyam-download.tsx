import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-download.html?raw";

export const Route = createFileRoute("/udyam-download")({
    head: () => ({
    meta: [
      { title: "Udyam Download - Download MSME Registration Certificate" },
      { name: "description", content: "Expert consultancy assistance for udyam download - download msme registration certificate. Get help with Udyam/MSME registration, updates and certificates ac..." },
      { property: "og:title", content: "Udyam Download - Download MSME Registration Certificate" },
      { property: "og:description", content: "Expert consultancy assistance for udyam download - download msme registration certificate. Get help with Udyam/MSME registration, updates and certificates ac..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Download - Download MSME Registration Certificate" html={html} />,
});
