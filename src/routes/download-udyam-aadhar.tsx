import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/download-udyam-aadhar.html?raw";

export const Route = createFileRoute("/download-udyam-aadhar")({
  head: () => ({
    meta: [
      { title: "Download Udyam Aadhar Certificate | MSME Certificate Online" },
      { name: "description", content: "Downloading Udyam Aadhaar certificate allows entrepreneurs to access their official MSME registration document in PDF format through the Udyam portal. By..." },
      { property: "og:title", content: "Download Udyam Aadhar Certificate | MSME Certificate Online" },
      { property: "og:description", content: "Downloading Udyam Aadhaar certificate allows entrepreneurs to access their official MSME registration document in PDF format through the Udyam portal. By..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/download-udyam-aadhar" },
    ],
  }),
  component: () => <SeoLandingPage title="Download Udyam Aadhar" linkTitle="Download Udyam Aadhar Certificate | MSME Certificate Online" content={`Downloading Udyam Aadhaar certificate allows entrepreneurs to access their official MSME registration document in PDF format through the Udyam portal. By entering the Udyam Number and completing OTP verification, businesses receive a digitally signed certificate that serves as legal proof of their micro, small, or medium enterprise status. This certificate is required for government tenders, loans, and subsidies. The process is fast, secure, paperless, and available online at any time. Storing a digital or printed copy ensures compliance, credibility, and uninterrupted access to government benefits. The Udyam Aadhaar certificate simplifies business documentation, formalizes registration, and supports financial and operational growth.`} html={html} />,
});
