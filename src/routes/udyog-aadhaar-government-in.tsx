import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-government-in.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-government-in")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar Government In — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Udyog Aadhaar Government Portal was the previous system used for MSME registration in India. It allowed businesses to obtain a Udyog Aadhaar Number (UAN), serving as official proof of enterprise status. While the system is still recognized, it has been replaced by the modern Udyam portal, which provides faster,..." },
      { property: "og:title", content: "Udyog Aadhaar Government In — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Udyog Aadhaar Government Portal was the previous system used for MSME registration in India. It allowed businesses to obtain a Udyog Aadhaar Number (UAN), serving as official proof of enterprise status. While the system is still recognized, it has been replaced by the modern Udyam portal, which provides faster,..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyog-aadhaar-government-in" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar Government In" linkTitle="Udyog Aadhaar Government In" html={html} />,
});
