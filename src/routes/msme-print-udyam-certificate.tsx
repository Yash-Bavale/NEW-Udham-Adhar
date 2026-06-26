import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-print-udyam-certificate.html?raw";

export const Route = createFileRoute("/msme-print-udyam-certificate")({
  head: () => ({
    meta: [
      { title: "MSME Print Udyam Certificate | Download & Print Online" },
      { name: "description", content: "MSME Print Udyam Certificate allows registered businesses to download and print their official Udyam certificate for banking, tenders, subsidies, and..." },
      { property: "og:title", content: "MSME Print Udyam Certificate | Download & Print Online" },
      { property: "og:description", content: "MSME Print Udyam Certificate allows registered businesses to download and print their official Udyam certificate for banking, tenders, subsidies, and..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/msme-print-udyam-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Print Udyam Certificate" linkTitle="MSME Print Udyam Certificate | Download & Print Online" content={`MSME Print Udyam Certificate allows registered businesses to download and print their official Udyam certificate for banking, tenders, subsidies, and other government schemes. By entering your Udyam Number and completing OTP verification, the PDF certificate becomes instantly available for printing. The portal ensures a fast, secure, and paperless process, making it convenient for entrepreneurs. Step-by-step instructions guide users through downloading and printing the certificate correctly. Maintaining a printed copy ensures compliance with MSME regulations, access to financial programs, and recognition of enterprise status. MSME Print Udyam Certificate is designed for hassle-free certificate management, enabling small and medium enterprises to operate smoothly.`} html={html} />,
});
