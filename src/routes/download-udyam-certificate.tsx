import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/download-udyam-certificate.html?raw";

export const Route = createFileRoute("/download-udyam-certificate")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Certificate Download — Get a Copy with Consultancy Help" },
      { name: "description", content: "Lost your Udyam certificate? Get assistance to download a fresh signed copy of your Udyam Adhar certificate." },
      { property: "og:title", content: "Udyam Registration Certificate Download" },
      { property: "og:description", content: "Download a copy of your Udyam Adhar certificate with consultancy assistance." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/download-udyam-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Download Udyam Certificate" linkTitle="Download Udyam" html={html} />,
});
