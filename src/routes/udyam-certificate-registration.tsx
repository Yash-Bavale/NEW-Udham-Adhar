import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-registration.html?raw";

export const Route = createFileRoute("/udyam-certificate-registration")({
  head: () => ({
    meta: [
      { title: "Udyam certificate registration — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam certificate registration. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam certificate registration — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam certificate registration. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-certificate-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam certificate registration" linkTitle="Udyam certificate registration" html={html} />,
});
