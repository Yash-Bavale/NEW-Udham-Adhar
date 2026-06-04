import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-certificate-download.html?raw";

export const Route = createFileRoute("/udyog-aadhar-certificate-download")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhar certificate download — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyog Aadhar certificate download. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyog Aadhar certificate download — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyog Aadhar certificate download. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhar-certificate-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar certificate download" linkTitle="Udyog Aadhar certificate download" html={html} />,
});
