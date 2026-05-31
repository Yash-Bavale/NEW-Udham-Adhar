import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-download.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-download")({
    head: () => ({
    meta: [
      { title: "Udyog Aadhaar Download | Old UAN Certificate Online" },
      { name: "description", content: "Expert consultancy assistance for udyog aadhaar download | old uan certificate online. Get help with Udyam/MSME registration, updates and certificates across..." },
      { property: "og:title", content: "Udyog Aadhaar Download | Old UAN Certificate Online" },
      { property: "og:description", content: "Expert consultancy assistance for udyog aadhaar download | old uan certificate online. Get help with Udyam/MSME registration, updates and certificates across..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhaar-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar Download | Old UAN Certificate Online" html={html} />,
});
