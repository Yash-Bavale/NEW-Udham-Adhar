import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhar-udyog-registration.html?raw";

export const Route = createFileRoute("/aadhar-udyog-registration")({
  head: () => ({
    meta: [
      { title: "Aadhar Udyog registration — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Aadhar Udyog registration. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Aadhar Udyog registration — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Aadhar Udyog registration. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/aadhar-udyog-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhar Udyog registration" linkTitle="Aadhar Udyog registration" html={html} />,
});
