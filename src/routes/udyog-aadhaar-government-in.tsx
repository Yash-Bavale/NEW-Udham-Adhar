import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyog-aadhaar-government-in.html?raw";

export const Route = createFileRoute("/udyog-aadhaar-government-in")({
  head: () => ({
    meta: [
      { title: "Udyog Aadhaar Government Portal – MSME Registration Details" },
      { name: "description", content: "Udyog Aadhaar Government Portal was the previous system used for MSME registration in India. It allowed businesses to obtain a Udyog Aadhaar Number (UAN),..." },
      { property: "og:title", content: "Udyog Aadhaar Government Portal – MSME Registration Details" },
      { property: "og:description", content: "Udyog Aadhaar Government Portal was the previous system used for MSME registration in India. It allowed businesses to obtain a Udyog Aadhaar Number (UAN),..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/udyog-aadhaar-government-in" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyog Aadhaar Government In" linkTitle="Udyog Aadhaar Government Portal – MSME Registration Details" content={`Udyog Aadhaar Government Portal was the previous system used for MSME registration in India. It allowed businesses to obtain a Udyog Aadhaar Number (UAN), serving as official proof of enterprise status. While the system is still recognized, it has been replaced by the modern Udyam portal, which provides faster, paperless, and digitally signed MSME certificates. Entrepreneurs can still verify or update old UAN records online, but migrating to Udyam is recommended to enjoy enhanced digital services, instant certificate issuance, and seamless access to government schemes, loans, subsidies, and procurement benefits. The portal supported startups, small businesses, and medium enterprises in formalizing operations, accessing financial assistance, and maintaining compliance with government regulations.`} html={html} />,
});
