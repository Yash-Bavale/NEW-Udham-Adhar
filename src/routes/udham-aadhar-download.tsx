import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udham-aadhar-download.html?raw";

export const Route = createFileRoute("/udham-aadhar-download")({
  head: () => ({
    meta: [
      { title: "Udham Aadhar Download | Get Udyam Certificate Online" },
      { name: "description", content: "Udham Aadhar Download allows registered MSMEs to retrieve their official certificate through the government’s Udyam portal. Entrepreneurs enter their..." },
      { property: "og:title", content: "Udham Aadhar Download | Get Udyam Certificate Online" },
      { property: "og:description", content: "Udham Aadhar Download allows registered MSMEs to retrieve their official certificate through the government’s Udyam portal. Entrepreneurs enter their..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udham-aadhar-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Udham Aadhar Download" linkTitle="Udham Aadhar Download | Get Udyam Certificate Online" content={`Udham Aadhar Download allows registered MSMEs to retrieve their official certificate through the government’s Udyam portal. Entrepreneurs enter their registration number and verify through OTP to download a digitally signed PDF. The certificate confirms MSME status and is required for bank loans, subsidies, tenders, and government schemes. The process is fully digital, secure, and paperless, providing instant access anytime. Keeping a copy ensures compliance with MSME norms, credibility with financial institutions, and eligibility for various government benefits. Udham Aadhar Download supports smooth business operations, formal recognition, and uninterrupted access to programs designed for micro, small, and medium enterprises.`} html={html} />,
});
