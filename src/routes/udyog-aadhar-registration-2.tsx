import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-registration-2.html?raw";

export const Route = createFileRoute("/udyog-aadhar-registration-2")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhar registration — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyog Aadhar registration. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyog Aadhar registration — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyog Aadhar registration. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhar-registration-2" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar registration" linkTitle="Udyog Aadhar registration" html={html} />,
});
