import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-register-certificate-download.html?raw";

export const Route = createFileRoute("/udyam-register-certificate-download")({
    head: () => ({
    meta: [
      { title: "Udyam Register Certificate Download - Download MSME Cert..." },
      { name: "description", content: "Expert consultancy assistance for udyam register certificate download - download msme cert.... Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "Udyam Register Certificate Download - Download MSME Cert..." },
      { property: "og:description", content: "Expert consultancy assistance for udyam register certificate download - download msme cert.... Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-register-certificate-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Register Certificate Download" linkTitle="Udyam Register Certificate Download - Download MSME Certificate Online" html={html} />,
});
