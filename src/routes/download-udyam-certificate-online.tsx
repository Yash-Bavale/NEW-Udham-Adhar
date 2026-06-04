import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/download-udyam-certificate-online.html?raw";

export const Route = createFileRoute("/download-udyam-certificate-online")({
  head: () => ({
    meta: [
      { title: "Download Udyam Certificate Online — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Download Udyam Certificate Online. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Download Udyam Certificate Online — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Download Udyam Certificate Online. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/download-udyam-certificate-online" },
    ],
  }),
  component: () => <SeoLandingPage title="Download Udyam Certificate Online" linkTitle="Download Udyam Certificate Online" html={html} />,
});
