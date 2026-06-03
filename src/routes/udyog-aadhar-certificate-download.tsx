import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhar-certificate-download.html?raw";

export const Route = createFileRoute("/udyog-aadhar-certificate-download")({
    head: () => ({
    meta: [
      { title: "Udyog Aadhar Certificate Download - Get Your Old MSME Do..." },
      { name: "description", content: "Expert consultancy assistance for udyog aadhar certificate download - get your old msme do.... Get help with Udyam/MSME registration, updates and certificate..." },
      { property: "og:title", content: "Udyog Aadhar Certificate Download - Get Your Old MSME Do..." },
      { property: "og:description", content: "Expert consultancy assistance for udyog aadhar certificate download - get your old msme do.... Get help with Udyam/MSME registration, updates and certificate..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhar-certificate-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhar Certificate Download - Get Your Old MSME Document" html={html} />,
});
