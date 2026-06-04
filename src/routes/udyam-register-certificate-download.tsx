import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-register-certificate-download.html?raw";

export const Route = createFileRoute("/udyam-register-certificate-download")({
  head: () => ({
    meta: [
      { title: "Udyam Register Certificate Download - Download MSME Certificate Online" },
      { name: "description", content: "Udyam register certificate download allows businesses to retrieve their MSME registration certificate instantly from the official Udyam portal. The certificate serves as legal proof of the enterprise’s micro, small, or medium status, enabling access to government schemes, subsidies, loans, and participation in..." },
      { property: "og:title", content: "Udyam Register Certificate Download - Download MSME Certificate Online" },
      { property: "og:description", content: "Udyam register certificate download allows businesses to retrieve their MSME registration certificate instantly from the official Udyam portal. The certificate serves as legal proof of the enterprise’s micro, small, or medium status, enabling access to government schemes, subsidies, loans, and participation in..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-register-certificate-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam register certificate download" linkTitle="Udyam Register Certificate Download - Download MSME Certificate Online" html={html} />,
});
