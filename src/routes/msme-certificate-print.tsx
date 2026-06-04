import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-certificate-print.html?raw";

export const Route = createFileRoute("/msme-certificate-print")({
  head: () => ({
    meta: [
      { title: "MSME Certificate Print — Udyam / MSME Consultancy Help" },
      { name: "description", content: "MSME Certificate Print allows registered businesses to download and print their official Udyam certificate directly from the government portal. Using your Udyam Registration Number and OTP verification, you can securely access a PDF copy of your MSME certificate anytime. The document is essential for availing..." },
      { property: "og:title", content: "MSME Certificate Print — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "MSME Certificate Print allows registered businesses to download and print their official Udyam certificate directly from the government portal. Using your Udyam Registration Number and OTP verification, you can securely access a PDF copy of your MSME certificate anytime. The document is essential for availing..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-certificate-print" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Certificate Print" linkTitle="MSME Certificate Print" html={html} />,
});
