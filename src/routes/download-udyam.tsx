import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/download-udyam.html?raw";

export const Route = createFileRoute("/download-udyam")({
    head: () => ({
    meta: [
      { title: "Udyam Free Registration - No Charges for MSME Registration" },
      { name: "description", content: "Expert consultancy assistance for udyam free registration - no charges for msme registration. Get help with Udyam/MSME registration, updates and certificates..." },
      { property: "og:title", content: "Udyam Free Registration - No Charges for MSME Registration" },
      { property: "og:description", content: "Expert consultancy assistance for udyam free registration - no charges for msme registration. Get help with Udyam/MSME registration, updates and certificates..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/download-udyam" },
    ],
  }),
  component: () => <SeoLandingPage title="Download Udyam" linkTitle="Udyam Free Registration - No Charges for MSME Registration" html={html} />,
});
