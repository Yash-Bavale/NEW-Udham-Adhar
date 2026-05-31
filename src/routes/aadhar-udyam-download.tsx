import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhar-udyam-download.html?raw";

export const Route = createFileRoute("/aadhar-udyam-download")({
    head: () => ({
    meta: [
      { title: "Aadhar Udyam Download - Download Aadhaar Linked MSME Cer..." },
      { name: "description", content: "Expert consultancy assistance for aadhar udyam download - download aadhaar linked msme cer.... Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "Aadhar Udyam Download - Download Aadhaar Linked MSME Cer..." },
      { property: "og:description", content: "Expert consultancy assistance for aadhar udyam download - download aadhaar linked msme cer.... Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/aadhar-udyam-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhar Udyam Download - Download Aadhaar Linked MSME Certifi" html={html} />,
});
