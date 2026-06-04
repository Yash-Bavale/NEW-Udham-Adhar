import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-register-certificate-download.html?raw";

export const Route = createFileRoute("/udyam-register-certificate-download")({
  head: () => ({
    meta: [
      { title: "Udyam register certificate download — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Udyam register certificate download. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam register certificate download — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Udyam register certificate download. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-register-certificate-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam register certificate download" linkTitle="Udyam register certificate download" html={html} />,
});
