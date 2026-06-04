import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhar-udyam-download.html?raw";

export const Route = createFileRoute("/aadhar-udyam-download")({
  head: () => ({
    meta: [
      { title: "Aadhar Udyam download — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Aadhar Udyam download. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Aadhar Udyam download — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Aadhar Udyam download. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/aadhar-udyam-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhar Udyam download" linkTitle="Aadhar Udyam download" html={html} />,
});
