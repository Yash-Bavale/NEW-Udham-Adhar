import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udham-aadhar-download.html?raw";

export const Route = createFileRoute("/udham-aadhar-download")({
  head: () => ({
    meta: [
      { title: "Udham Aadhar Download — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udham Aadhar Download. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udham Aadhar Download — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udham Aadhar Download. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udham-aadhar-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udham Aadhar Download" linkTitle="Udham Aadhar Download" html={html} />,
});
