import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-adhar-download.html?raw";

export const Route = createFileRoute("/udyam-adhar-download")({
    head: () => ({
    meta: [
      { title: "Udyam Adhar Download | Get MSME Udyam Certificate Online" },
      { name: "description", content: "Expert consultancy assistance for udyam adhar download | get msme udyam certificate online. Get help with Udyam/MSME registration, updates and certificates a..." },
      { property: "og:title", content: "Udyam Adhar Download | Get MSME Udyam Certificate Online" },
      { property: "og:description", content: "Expert consultancy assistance for udyam adhar download | get msme udyam certificate online. Get help with Udyam/MSME registration, updates and certificates a..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-adhar-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Adhar Download" linkTitle="Udyam Adhar Download | Get MSME Udyam Certificate Online" html={html} />,
});
