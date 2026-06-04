import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-download.html?raw";

export const Route = createFileRoute("/udyam-certificate-download")({
  head: () => ({
    meta: [
      { title: "Udyam Certificate Download - Instant MSME Certificate Access" },
      { name: "description", content: "Udyam certificate download is an essential feature of the official Udyam registration portal, allowing MSME-registered businesses to access their digitally verified Udyam certificate anytime they require it. Once a business completes registration by providing Aadhaar details and basic enterprise information, the..." },
      { property: "og:title", content: "Udyam Certificate Download - Instant MSME Certificate Access" },
      { property: "og:description", content: "Udyam certificate download is an essential feature of the official Udyam registration portal, allowing MSME-registered businesses to access their digitally verified Udyam certificate anytime they require it. Once a business completes registration by providing Aadhaar details and basic enterprise information, the..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-certificate-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam certificate download" linkTitle="Udyam Certificate Download - Instant MSME Certificate Access" html={html} />,
});
