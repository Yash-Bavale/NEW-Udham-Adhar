import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-application.html?raw";

export const Route = createFileRoute("/udyam-application")({
  head: () => ({
    meta: [
      { title: "Udyam Application — Udyam / MSME Consultancy Help" },
      { name: "description", content: "The Udyam Application online portal simplifies MSME registration for micro, small, and medium enterprises in India. Entrepreneurs can apply using their Aadhaar number and basic business information to obtain a unique Udyam Registration Number instantly. The process is completely digital, paperless, and free of..." },
      { property: "og:title", content: "Udyam Application — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "The Udyam Application online portal simplifies MSME registration for micro, small, and medium enterprises in India. Entrepreneurs can apply using their Aadhaar number and basic business information to obtain a unique Udyam Registration Number instantly. The process is completely digital, paperless, and free of..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-application" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Application" linkTitle="Udyam Application" html={html} />,
});
