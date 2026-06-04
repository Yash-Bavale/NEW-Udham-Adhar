import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-free-registration.html?raw";

export const Route = createFileRoute("/udyog-aadhar-free-registration")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhar free registration — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyog Aadhar free registration. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyog Aadhar free registration — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyog Aadhar free registration. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhar-free-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar free registration" linkTitle="Udyog Aadhar free registration" html={html} />,
});
