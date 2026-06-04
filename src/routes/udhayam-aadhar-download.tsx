import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udhayam-aadhar-download.html?raw";

export const Route = createFileRoute("/udhayam-aadhar-download")({
  head: () => ({
    meta: [
      { title: "Udhayam Aadhar Download — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udhayam Aadhar Download. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udhayam Aadhar Download — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udhayam Aadhar Download. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udhayam-aadhar-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udhayam Aadhar Download" linkTitle="Udhayam Aadhar Download" html={html} />,
});
