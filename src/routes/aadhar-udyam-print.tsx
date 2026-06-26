import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhar-udyam-print.html?raw";

export const Route = createFileRoute("/aadhar-udyam-print")({
  head: () => ({
    meta: [
      { title: "Aadhar Udyam Print | Print MSME Udyam Certificate" },
      { name: "description", content: "Aadhar Udyam Print allows entrepreneurs to print their Udyam certificate using Aadhaar-based OTP verification from the official portal. After successful..." },
      { property: "og:title", content: "Aadhar Udyam Print | Print MSME Udyam Certificate" },
      { property: "og:description", content: "Aadhar Udyam Print allows entrepreneurs to print their Udyam certificate using Aadhaar-based OTP verification from the official portal. After successful..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/aadhar-udyam-print" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhar Udyam Print" linkTitle="Aadhar Udyam Print | Print MSME Udyam Certificate" content={`Aadhar Udyam Print allows entrepreneurs to print their Udyam certificate using Aadhaar-based OTP verification from the official portal. After successful verification, the certificate PDF can be downloaded and printed for official use in banks, tenders, or subsidy applications. The process is fast, secure, and entirely digital, ensuring uninterrupted access to MSME documentation. This method simplifies certificate retrieval and printing, making it convenient for both new and established enterprises. Keeping a printed copy ensures compliance with MSME norms and helps businesses maintain credibility while accessing government benefits. Step-by-step guidance ensures a smooth printing experience with accurate results.`} html={html} />,
});
