import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-registration-free.html?raw";

export const Route = createFileRoute("/msme-registration-free")({
  head: () => ({
    meta: [
      { title: "MSME Registration Free — Udyam / MSME Consultancy Help" },
      { name: "description", content: "MSME registration on the Udyam portal is completely free, with no fees or hidden charges. Entrepreneurs can register their micro, small, or medium enterprises online using Aadhaar authentication. Upon registration, businesses receive an instant, digitally signed Udyam Certificate, proving their MSME status. This..." },
      { property: "og:title", content: "MSME Registration Free — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "MSME registration on the Udyam portal is completely free, with no fees or hidden charges. Entrepreneurs can register their micro, small, or medium enterprises online using Aadhaar authentication. Upon registration, businesses receive an instant, digitally signed Udyam Certificate, proving their MSME status. This..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-registration-free" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Registration Free" linkTitle="MSME Registration Free" html={html} />,
});
