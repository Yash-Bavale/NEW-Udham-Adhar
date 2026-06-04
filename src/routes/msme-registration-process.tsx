import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-registration-process.html?raw";

export const Route = createFileRoute("/msme-registration-process")({
  head: () => ({
    meta: [
      { title: "MSME Registration Process – Step-by-Step Guide for Udyam MSME Registration" },
      { name: "description", content: "The MSME registration process provides a step-by-step guide to register micro, small, or medium enterprises through the Udyam portal. Entrepreneurs can..." },
      { property: "og:title", content: "MSME Registration Process – Step-by-Step Guide for Udyam MSME Registration" },
      { property: "og:description", content: "The MSME registration process provides a step-by-step guide to register micro, small, or medium enterprises through the Udyam portal. Entrepreneurs can..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-registration-process" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Registration Process" linkTitle="MSME Registration Process – Step-by-Step Guide for Udyam MSME Registration" content={`The MSME registration process provides a step-by-step guide to register micro, small, or medium enterprises through the Udyam portal. Entrepreneurs can register online using Aadhaar-based verification, submit basic business information, and obtain a unique Udyam Registration Number along with a digitally signed MSME certificate instantly. The process is paperless, free, and secure, requiring minimal documentation while ensuring authenticity and compliance. Following this process allows businesses to access government schemes, financial assistance, loans, and priority in procurement tenders. It also enables updates, modifications, and verification of registration details. MSME registration strengthens credibility with banks, financial institutions, and government authorities, helping startups and established enterprises maximize government benefits, grow sustainably, and participate confidently in India’s competitive market.`} html={html} />,
});
