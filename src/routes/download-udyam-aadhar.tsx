import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/download-udyam-aadhar.html?raw";

export const Route = createFileRoute("/download-udyam-aadhar")({
    head: () => ({
    meta: [
      { title: "Download Udyam Aadhar Certificate | MSME Certificate Online" },
      { name: "description", content: "Expert consultancy assistance for download udyam aadhar certificate | msme certificate online. Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "Download Udyam Aadhar Certificate | MSME Certificate Online" },
      { property: "og:description", content: "Expert consultancy assistance for download udyam aadhar certificate | msme certificate online. Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/download-udyam-aadhar" },
    ],
  }),
  component: () => <SeoLandingPage title="Download Udyam Aadhar Certificate | MSME Certificate Online" html={html} />,
});
