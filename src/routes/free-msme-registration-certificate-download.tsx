import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/free-msme-registration-certificate-download.html?raw";

export const Route = createFileRoute("/free-msme-registration-certificate-download")({
    head: () => ({
    meta: [
      { title: "MSME Registration Certificate Download - Get Your Certif..." },
      { name: "description", content: "Expert consultancy assistance for msme registration certificate download - get your certif.... Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "MSME Registration Certificate Download - Get Your Certif..." },
      { property: "og:description", content: "Expert consultancy assistance for msme registration certificate download - get your certif.... Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/free-msme-registration-certificate-download" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Registration Certificate Download - Get Your Certificate Online" html={html} />,
});
