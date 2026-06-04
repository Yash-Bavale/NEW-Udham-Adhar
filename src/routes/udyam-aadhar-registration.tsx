import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhar-registration.html?raw";

export const Route = createFileRoute("/udyam-aadhar-registration")({
  head: () => ({
    meta: [
      { title: "Udyam Aadhar registration — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam Aadhar registration. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Aadhar registration — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam Aadhar registration. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-aadhar-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhar registration" linkTitle="Udyam Aadhar registration" html={html} />,
});
