import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-udyam-download.html?raw";

export const Route = createFileRoute("/msme-udyam-download")({
    head: () => ({
    meta: [
      { title: "MSME Udyam Download - Download MSME Certificate Online" },
      { name: "description", content: "Expert consultancy assistance for msme udyam download - download msme certificate online. Get help with Udyam/MSME registration, updates and certificates acr..." },
      { property: "og:title", content: "MSME Udyam Download - Download MSME Certificate Online" },
      { property: "og:description", content: "Expert consultancy assistance for msme udyam download - download msme certificate online. Get help with Udyam/MSME registration, updates and certificates acr..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-udyam-download" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Udyam Download" linkTitle="MSME Udyam Download - Download MSME Certificate Online" html={html} />,
});
