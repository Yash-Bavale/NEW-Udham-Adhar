import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-download.html?raw";

export const Route = createFileRoute("/udyog-aadhar-download")({
    head: () => ({
    meta: [
      { title: "Udyog Aadhar Download - Get Your Old MSME Certificate" },
      { name: "description", content: "Expert consultancy assistance for udyog aadhar download - get your old msme certificate. Get help with Udyam/MSME registration, updates and certificates acro..." },
      { property: "og:title", content: "Udyog Aadhar Download - Get Your Old MSME Certificate" },
      { property: "og:description", content: "Expert consultancy assistance for udyog aadhar download - get your old msme certificate. Get help with Udyam/MSME registration, updates and certificates acro..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhar-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar Download - Get Your Old MSME Certificate" html={html} />,
});
