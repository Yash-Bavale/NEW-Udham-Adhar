import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-registration-process.html?raw";

export const Route = createFileRoute("/msme-registration-process")({
    head: () => ({
    meta: [
      { title: "Udyog Aadhar Registration " },
      { name: "description", content: "Expert consultancy assistance for udyog aadhar registration . Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyog Aadhar Registration " },
      { property: "og:description", content: "Expert consultancy assistance for udyog aadhar registration . Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-registration-process" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar Registration " html={html} />,
});
