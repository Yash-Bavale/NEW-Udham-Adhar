import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/download-udyam-certificate.html?raw";

export const Route = createFileRoute("/download-udyam-certificate")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Certificate Download — Get a Copy with Consultancy Help" },
      { name: "description", content: "Lost your Udyam certificate? Get assistance to download a fresh signed copy of your Business Help Services certificate." },
      { property: "og:title", content: "Download Udyam Certificate Online" },
      { property: "og:description", content: "Download a copy of your Business Help Services certificate with consultancy assistance." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/download-udyam-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Download Udyam Certificate" html={html} />,
});
