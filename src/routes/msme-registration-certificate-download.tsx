import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-registration-certificate-download.html?raw";

export const Route = createFileRoute("/msme-registration-certificate-download")({
    head: () => ({
    meta: [
      { title: "MSME Registration Certificate Download" },
      { name: "description", content: "Expert consultancy assistance for msme registration certificate download. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "MSME Registration Certificate Download" },
      { property: "og:description", content: "Expert consultancy assistance for msme registration certificate download. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-registration-certificate-download" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Registration Certificate Download" linkTitle="MSME Registration Certificate Download – Get Udyam Certificate PDF" html={html} />,
});
