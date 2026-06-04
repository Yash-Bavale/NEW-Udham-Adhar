import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/download-udyam.html?raw";

export const Route = createFileRoute("/download-udyam")({
  head: () => ({
    meta: [
      { title: "Udyam Free Registration - No Charges for MSME Registration" },
      { name: "description", content: "Download Udyam refers to accessing your official MSME registration certificate online through the government’s Udyam portal. The registration and certificate download are completely free, with no charges or hidden fees. Entrepreneurs and business owners can obtain a digitally signed certificate that serves as proof..." },
      { property: "og:title", content: "Udyam Free Registration - No Charges for MSME Registration" },
      { property: "og:description", content: "Download Udyam refers to accessing your official MSME registration certificate online through the government’s Udyam portal. The registration and certificate download are completely free, with no charges or hidden fees. Entrepreneurs and business owners can obtain a digitally signed certificate that serves as proof..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/download-udyam" },
    ],
  }),
  component: () => <SeoLandingPage title="Download Udyam" linkTitle="Udyam Free Registration - No Charges for MSME Registration" html={html} />,
});
