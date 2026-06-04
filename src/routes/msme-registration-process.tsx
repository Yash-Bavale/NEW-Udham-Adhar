import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-registration-process.html?raw";

export const Route = createFileRoute("/msme-registration-process")({
  head: () => ({
    meta: [
      { title: "MSME Registration Process — Udyam / MSME Consultancy Help" },
      { name: "description", content: "The MSME registration process provides a step-by-step guide to register micro, small, or medium enterprises through the Udyam portal. Entrepreneurs can register online using Aadhaar-based verification, submit basic business information, and obtain a unique Udyam Registration Number along with a digitally signed..." },
      { property: "og:title", content: "MSME Registration Process — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "The MSME registration process provides a step-by-step guide to register micro, small, or medium enterprises through the Udyam portal. Entrepreneurs can register online using Aadhaar-based verification, submit basic business information, and obtain a unique Udyam Registration Number along with a digitally signed..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-registration-process" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Registration Process" linkTitle="MSME Registration Process" html={html} />,
});
