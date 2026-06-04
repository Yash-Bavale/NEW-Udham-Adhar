import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-udyog-aadhar.html?raw";

export const Route = createFileRoute("/msme-udyog-aadhar")({
  head: () => ({
    meta: [
      { title: "MSME Udyog Aadhar — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for MSME Udyog Aadhar. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "MSME Udyog Aadhar — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for MSME Udyog Aadhar. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-udyog-aadhar" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Udyog Aadhar" linkTitle="MSME Udyog Aadhar" html={html} />,
});
