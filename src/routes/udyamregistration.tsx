import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyamregistration.html?raw";

export const Route = createFileRoute("/udyamregistration")({
  head: () => ({
    meta: [
      { title: "Udyamregistration — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyamregistration. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyamregistration — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyamregistration. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyamregistration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyamregistration" linkTitle="Udyamregistration" html={html} />,
});
