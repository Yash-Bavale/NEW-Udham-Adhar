import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-apply.html?raw";

export const Route = createFileRoute("/udyam-certificate-apply")({
  head: () => ({
    meta: [
      { title: "Udyam Certificate Apply - How to Apply for MSME Certificate" },
      { name: "description", content: "Udyam certificate apply is the official process for obtaining your MSME certificate online through the Udyam portal. Businesses can submit basic details..." },
      { property: "og:title", content: "Udyam Certificate Apply - How to Apply for MSME Certificate" },
      { property: "og:description", content: "Udyam certificate apply is the official process for obtaining your MSME certificate online through the Udyam portal. Businesses can submit basic details..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/udyam-certificate-apply" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam certificate apply" linkTitle="Udyam Certificate Apply - How to Apply for MSME Certificate" content={`Udyam certificate apply is the official process for obtaining your MSME certificate online through the Udyam portal. Businesses can submit basic details such as name, address, activity type, and Aadhaar information for verification. The application is completely free, paperless, and instant once processed. Upon approval, the digitally signed MSME certificate serves as proof of enterprise registration, enabling businesses to access government schemes, financial assistance, priority lending, and participation in procurement tenders. The process ensures compliance with regulations, simplifies verification by banks and authorities, and strengthens credibility with clients and partners. By applying for the Udyam certificate, startups, small businesses, and medium enterprises gain formal recognition and eligibility for financial and operational support programs designed to foster business growth, innovation, and market competitiveness in India.`} html={html} />,
});
