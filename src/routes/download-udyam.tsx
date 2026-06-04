import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/download-udyam.html?raw";

export const Route = createFileRoute("/download-udyam")({
  head: () => ({
    meta: [
      { title: "Udyam Free Registration - No Charges for MSME Registration" },
      { name: "description", content: "Download Udyam refers to accessing your official MSME registration certificate online through the government’s Udyam portal. The registration and..." },
      { property: "og:title", content: "Udyam Free Registration - No Charges for MSME Registration" },
      { property: "og:description", content: "Download Udyam refers to accessing your official MSME registration certificate online through the government’s Udyam portal. The registration and..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/download-udyam" },
    ],
  }),
  component: () => <SeoLandingPage title="Download Udyam" linkTitle="Udyam Free Registration - No Charges for MSME Registration" content={`Download Udyam refers to accessing your official MSME registration certificate online through the government’s Udyam portal. The registration and certificate download are completely free, with no charges or hidden fees. Entrepreneurs and business owners can obtain a digitally signed certificate that serves as proof of micro, small, or medium enterprise status. The certificate enables eligibility for government schemes, financial assistance, subsidies, and priority sector procurement opportunities. The download process is paperless, secure, and available 24/7, allowing businesses to store or print it for official purposes. By downloading Udyam, startups and established enterprises gain instant recognition, credibility, and access to a variety of support programs aimed at fostering business growth, expansion, and sustainability.`} html={html} />,
});
