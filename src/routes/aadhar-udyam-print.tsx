import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhar-udyam-print.html?raw";

export const Route = createFileRoute("/aadhar-udyam-print")({
  head: () => ({
    meta: [
      { title: "Aadhar Udyam Print — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Aadhar Udyam Print allows entrepreneurs to print their Udyam certificate using Aadhaar-based OTP verification from the official portal. After successful verification, the certificate PDF can be downloaded and printed for official use in banks, tenders, or subsidy applications. The process is fast, secure, and..." },
      { property: "og:title", content: "Aadhar Udyam Print — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Aadhar Udyam Print allows entrepreneurs to print their Udyam certificate using Aadhaar-based OTP verification from the official portal. After successful verification, the certificate PDF can be downloaded and printed for official use in banks, tenders, or subsidy applications. The process is fast, secure, and..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/aadhar-udyam-print" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhar Udyam Print" linkTitle="Aadhar Udyam Print" html={html} />,
});
