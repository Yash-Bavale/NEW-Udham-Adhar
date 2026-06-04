import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/download-udyam.html?raw";

export const Route = createFileRoute("/download-udyam")({
  head: () => ({
    meta: [
      { title: "Download Udyam — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Download Udyam. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Download Udyam — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Download Udyam. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/download-udyam" },
    ],
  }),
  component: () => <SeoLandingPage title="Download Udyam" linkTitle="Download Udyam" html={html} />,
});
