import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-download.html?raw";

export const Route = createFileRoute("/udyam-registration-download")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Download - Get MSME Certificate Online" },
      { name: "description", content: "Udyam registration download allows entrepreneurs and business owners to instantly access and retrieve their official MSME certificate online from the government’s Udyam portal. After successfully completing the registration process, which involves providing basic business details and Aadhaar-based verification, the..." },
      { property: "og:title", content: "Udyam Registration Download - Get MSME Certificate Online" },
      { property: "og:description", content: "Udyam registration download allows entrepreneurs and business owners to instantly access and retrieve their official MSME certificate online from the government’s Udyam portal. After successfully completing the registration process, which involves providing basic business details and Aadhaar-based verification, the..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-registration-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Registration Download" linkTitle="Udyam Registration Download - Get MSME Certificate Online" html={html} />,
});
