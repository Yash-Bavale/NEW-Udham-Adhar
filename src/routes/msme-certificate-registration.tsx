import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-certificate-registration.html?raw";

export const Route = createFileRoute("/msme-certificate-registration")({
  head: () => ({
    meta: [
      { title: "MSME certificate registration — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for MSME certificate registration. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "MSME certificate registration — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for MSME certificate registration. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-certificate-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME certificate registration" linkTitle="MSME certificate registration" html={html} />,
});
