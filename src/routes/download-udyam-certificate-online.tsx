import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/download-udyam-certificate-online.html?raw";

export const Route = createFileRoute("/download-udyam-certificate-online")({
    head: () => ({
    meta: [
      { title: "Download Udyam Certificate Online" },
      { name: "description", content: "Expert consultancy assistance for download udyam certificate online. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Download Udyam Certificate Online" },
      { property: "og:description", content: "Expert consultancy assistance for download udyam certificate online. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/download-udyam-certificate-online" },
    ],
  }),
  component: () => <SeoLandingPage title="Download Udyam Certificate Online | Get MSME Certificate PDF" html={html} />,
});
