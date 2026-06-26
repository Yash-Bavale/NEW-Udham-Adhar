import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-cer.html?raw";

export const Route = createFileRoute("/msme-cer")({
  head: () => ({
    meta: [
      { title: "MSME Cer Download | Udyam MSME Certificate Online" },
      { name: "description", content: "MSME Cer refers to the official MSME certificate obtained through Udyam Registration. Entrepreneurs can quickly download it online using Aadhaar-based OTP..." },
      { property: "og:title", content: "MSME Cer Download | Udyam MSME Certificate Online" },
      { property: "og:description", content: "MSME Cer refers to the official MSME certificate obtained through Udyam Registration. Entrepreneurs can quickly download it online using Aadhaar-based OTP..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/msme-cer" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Cer" linkTitle="MSME Cer Download | Udyam MSME Certificate Online" content={`MSME Cer refers to the official MSME certificate obtained through Udyam Registration. Entrepreneurs can quickly download it online using Aadhaar-based OTP verification. This certificate confirms enterprise classification as micro, small, or medium and is required for government tenders, subsidies, and financial assistance. The download process is fast, secure, paperless, and available 24/7. No additional login or documents are required. MSME Cer helps businesses maintain compliance, enhance credibility, and access government schemes efficiently. By keeping a digital or printed copy, enterprises ensure uninterrupted eligibility for loans, subsidies, and operational support programs, supporting growth and recognition.`} html={html} />,
});
