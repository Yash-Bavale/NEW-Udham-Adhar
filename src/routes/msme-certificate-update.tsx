import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-certificate-update.html?raw";

export const Route = createFileRoute("/msme-certificate-update")({
  head: () => ({
    meta: [
      { title: "MSME certificate update — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Expert consultancy assistance for MSME certificate update. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "MSME certificate update — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Expert consultancy assistance for MSME certificate update. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-certificate-update" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME certificate update" linkTitle="MSME certificate update" html={html} />,
});
