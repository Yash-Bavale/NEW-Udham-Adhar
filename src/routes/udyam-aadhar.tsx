import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhar.html?raw";

export const Route = createFileRoute("/udyam-aadhar")({
  head: () => ({
    meta: [
      { title: "Udyam Aadhar — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam Aadhar. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Aadhar — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam Aadhar. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-aadhar" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhar" linkTitle="Udyam Aadhar" html={html} />,
});
