import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/free-msme-registration-certificate-download.html?raw";

export const Route = createFileRoute("/free-msme-registration-certificate-download")({
  head: () => ({
    meta: [
      { title: "Free MSME registration certificate download — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for Free MSME registration certificate download. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Free MSME registration certificate download — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for Free MSME registration certificate download. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/free-msme-registration-certificate-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Free MSME registration certificate download" linkTitle="Free MSME registration certificate download" html={html} />,
});
