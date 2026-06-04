import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-cer.html?raw";

export const Route = createFileRoute("/msme-cer")({
  head: () => ({
    meta: [
      { title: "MSME Cer — Udyam / MSME Consultancy Help" },
      { name: "description", content: "MSME Cer refers to the official MSME certificate obtained through Udyam Registration. Entrepreneurs can quickly download it online using Aadhaar-based OTP verification. This certificate confirms enterprise classification as micro, small, or medium and is required for government tenders, subsidies, and financial..." },
      { property: "og:title", content: "MSME Cer — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "MSME Cer refers to the official MSME certificate obtained through Udyam Registration. Entrepreneurs can quickly download it online using Aadhaar-based OTP verification. This certificate confirms enterprise classification as micro, small, or medium and is required for government tenders, subsidies, and financial..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-cer" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Cer" linkTitle="MSME Cer" html={html} />,
});
