import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhaar-udyam.html?raw";

export const Route = createFileRoute("/aadhaar-udyam")({
  head: () => ({
    meta: [
      { title: "Aadhaar Udyam - Aadhaar Based MSME Registration Verification
Meta Description: Aadhaar Udyam is the process of linking an entrepreneur’s Aadhaar number with their MSME registration to facilitate secure, fast, and paperless verification. This Aadhaar-based system allows businesses to obtain a digitally signed MSME certificate instantly, confirming legal recognition as a micro, small, or medium enterprise. The linkage simplifies future updates, renewals, and verification for banks, financial institutions, and government authorities. By completing Aadhaar Udyam registration, businesses gain access to government schemes, loans, subsidies, and participation in procurement tenders. The digital process ensures compliance, credibility, and uninterrupted access to benefits, supporting startups, small businesses, and medium enterprises in operational growth, market expansion, and long-term sustainability." },
      { name: "description", content: "Expert consultancy assistance for Aadhaar Udyam. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Aadhaar Udyam - Aadhaar Based MSME Registration Verification
Meta Description: Aadhaar Udyam is the process of linking an entrepreneur’s Aadhaar number with their MSME registration to facilitate secure, fast, and paperless verification. This Aadhaar-based system allows businesses to obtain a digitally signed MSME certificate instantly, confirming legal recognition as a micro, small, or medium enterprise. The linkage simplifies future updates, renewals, and verification for banks, financial institutions, and government authorities. By completing Aadhaar Udyam registration, businesses gain access to government schemes, loans, subsidies, and participation in procurement tenders. The digital process ensures compliance, credibility, and uninterrupted access to benefits, supporting startups, small businesses, and medium enterprises in operational growth, market expansion, and long-term sustainability." },
      { property: "og:description", content: "Expert consultancy assistance for Aadhaar Udyam. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/aadhaar-udyam" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhaar Udyam" linkTitle="Aadhaar Udyam - Aadhaar Based MSME Registration Verification
Meta Description: Aadhaar Udyam is the process of linking an entrepreneur’s Aadhaar number with their MSME registration to facilitate secure, fast, and paperless verification. This Aadhaar-based system allows businesses to obtain a digitally signed MSME certificate instantly, confirming legal recognition as a micro, small, or medium enterprise. The linkage simplifies future updates, renewals, and verification for banks, financial institutions, and government authorities. By completing Aadhaar Udyam registration, businesses gain access to government schemes, loans, subsidies, and participation in procurement tenders. The digital process ensures compliance, credibility, and uninterrupted access to benefits, supporting startups, small businesses, and medium enterprises in operational growth, market expansion, and long-term sustainability." html={html} />,
});
