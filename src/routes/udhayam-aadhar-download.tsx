import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udhayam-aadhar-download.html?raw";

export const Route = createFileRoute("/udhayam-aadhar-download")({
    head: () => ({
    meta: [
      { title: "Udhayam Aadhar Download | MSME Udyam Certificate PDF" },
      { name: "description", content: "Expert consultancy assistance for udhayam aadhar download | msme udyam certificate pdf. Get help with Udyam/MSME registration, updates and certificates acros..." },
      { property: "og:title", content: "Udhayam Aadhar Download | MSME Udyam Certificate PDF" },
      { property: "og:description", content: "Expert consultancy assistance for udhayam aadhar download | msme udyam certificate pdf. Get help with Udyam/MSME registration, updates and certificates acros..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udhayam-aadhar-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udhayam Aadhar Download" linkTitle="Udhayam Aadhar Download | MSME Udyam Certificate PDF" html={html} />,
});
