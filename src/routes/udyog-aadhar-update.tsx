import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-update.html?raw";

export const Route = createFileRoute("/udyog-aadhar-update")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhar update — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyog Aadhar update. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyog Aadhar update — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyog Aadhar update. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhar-update" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar update" linkTitle="Udyog Aadhar update" html={html} />,
});
