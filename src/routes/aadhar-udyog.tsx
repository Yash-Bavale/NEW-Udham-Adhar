import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhar-udyog.html?raw";

export const Route = createFileRoute("/aadhar-udyog")({
  head: () => ({
    meta: [
      { title: "Aadhar Udyog — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Aadhar Udyog. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Aadhar Udyog — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Aadhar Udyog. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/aadhar-udyog" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhar Udyog" linkTitle="Aadhar Udyog" html={html} />,
});
