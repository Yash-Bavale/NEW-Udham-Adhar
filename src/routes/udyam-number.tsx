import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-number.html?raw";

export const Route = createFileRoute("/udyam-number")({
  head: () => ({
    meta: [
      { title: "Udyam Number - Unique MSME Registration ID
Meta Description: The Udyam number is a unique registration ID assigned to businesses upon successful MSME registration through the official Udyam portal. This number acts as permanent proof of the enterprise’s Micro, Small, or Medium status and is essential for accessing government benefits, including priority sector lending, interest-free or collateral-free loans, subsidies, and participation in procurement tenders. The Udyam number is linked to a digitally signed MSME certificate that can be downloaded anytime online, ensuring credibility and authenticity for financial institutions, clients, and government authorities. The unique registration ID allows businesses to formalize operations, comply with regulations, and maintain uninterrupted eligibility for government programs aimed at promoting MSME growth. Entrepreneurs and businesses can also use the Udyam number to update details, access schemes, and enhance market presence while leveraging financial and operational benefits designed to strengthen the MSME ecosystem." },
      { name: "description", content: "Expert consultancy assistance for Udyam number. Get help with Udyam/MSME registration, updates and certificates across India." },
      { property: "og:title", content: "Udyam Number - Unique MSME Registration ID
Meta Description: The Udyam number is a unique registration ID assigned to businesses upon successful MSME registration through the official Udyam portal. This number acts as permanent proof of the enterprise’s Micro, Small, or Medium status and is essential for accessing government benefits, including priority sector lending, interest-free or collateral-free loans, subsidies, and participation in procurement tenders. The Udyam number is linked to a digitally signed MSME certificate that can be downloaded anytime online, ensuring credibility and authenticity for financial institutions, clients, and government authorities. The unique registration ID allows businesses to formalize operations, comply with regulations, and maintain uninterrupted eligibility for government programs aimed at promoting MSME growth. Entrepreneurs and businesses can also use the Udyam number to update details, access schemes, and enhance market presence while leveraging financial and operational benefits designed to strengthen the MSME ecosystem." },
      { property: "og:description", content: "Expert consultancy assistance for Udyam number. Get help with Udyam/MSME registration, updates and certificates across India." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-number" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam number" linkTitle="Udyam Number - Unique MSME Registration ID
Meta Description: The Udyam number is a unique registration ID assigned to businesses upon successful MSME registration through the official Udyam portal. This number acts as permanent proof of the enterprise’s Micro, Small, or Medium status and is essential for accessing government benefits, including priority sector lending, interest-free or collateral-free loans, subsidies, and participation in procurement tenders. The Udyam number is linked to a digitally signed MSME certificate that can be downloaded anytime online, ensuring credibility and authenticity for financial institutions, clients, and government authorities. The unique registration ID allows businesses to formalize operations, comply with regulations, and maintain uninterrupted eligibility for government programs aimed at promoting MSME growth. Entrepreneurs and businesses can also use the Udyam number to update details, access schemes, and enhance market presence while leveraging financial and operational benefits designed to strengthen the MSME ecosystem." html={html} />,
});
