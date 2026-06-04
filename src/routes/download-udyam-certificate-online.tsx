import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/download-udyam-certificate-online.html?raw";

export const Route = createFileRoute("/download-udyam-certificate-online")({
  head: () => ({
    meta: [
      { title: "Download Udyam Certificate Online — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Downloading your Udyam Certificate is a fast, secure, and paperless process available through the official government portal. Entrepreneurs can enter their Udyam Registration Number, complete OTP verification, and instantly access a digitally signed PDF certificate. This official document serves as proof of MSME..." },
      { property: "og:title", content: "Download Udyam Certificate Online — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Downloading your Udyam Certificate is a fast, secure, and paperless process available through the official government portal. Entrepreneurs can enter their Udyam Registration Number, complete OTP verification, and instantly access a digitally signed PDF certificate. This official document serves as proof of MSME..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/download-udyam-certificate-online" },
    ],
  }),
  component: () => <SeoLandingPage title="Download Udyam Certificate Online" linkTitle="Download Udyam Certificate Online" html={html} />,
});
