import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udham-aadhar-download.html?raw";

export const Route = createFileRoute("/udham-aadhar-download")({
  head: () => ({
    meta: [
      { title: "Udham Aadhar Download — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Udham Aadhar Download allows registered MSMEs to retrieve their official certificate through the government’s Udyam portal. Entrepreneurs enter their registration number and verify through OTP to download a digitally signed PDF. The certificate confirms MSME status and is required for bank loans, subsidies,..." },
      { property: "og:title", content: "Udham Aadhar Download — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Udham Aadhar Download allows registered MSMEs to retrieve their official certificate through the government’s Udyam portal. Entrepreneurs enter their registration number and verify through OTP to download a digitally signed PDF. The certificate confirms MSME status and is required for bank loans, subsidies,..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udham-aadhar-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udham Aadhar Download" linkTitle="Udham Aadhar Download" html={html} />,
});
