import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-certificate.html?raw";

export const Route = createFileRoute("/udyog-aadhar-certificate")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhar Certificate - Old MSME Registration Document" },
      { name: "description", content: "The Udyog Aadhar certificate was issued under India’s previous MSME registration system and served as the official proof of a business’s micro, small, or medium enterprise status. This certificate helped enterprises access various government benefits, including loans, interest subsidies, procurement opportunities,..." },
      { property: "og:title", content: "Udyog Aadhar Certificate - Old MSME Registration Document" },
      { property: "og:description", content: "The Udyog Aadhar certificate was issued under India’s previous MSME registration system and served as the official proof of a business’s micro, small, or medium enterprise status. This certificate helped enterprises access various government benefits, including loans, interest subsidies, procurement opportunities,..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhar-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar Certificate" linkTitle="Udyog Aadhar Certificate - Old MSME Registration Document" html={html} />,
});
