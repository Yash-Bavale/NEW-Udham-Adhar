import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-adhar-2.html?raw";

export const Route = createFileRoute("/udyam-adhar-2")({
  head: () => ({
    meta: [
      { title: "Udyam Adhar Registration | New MSME Registration Online" },
      { name: "description", content: "Udyam Adhar refers to the government’s new MSME registration system, replacing Udyog Aadhaar. Businesses can register online using Aadhaar authentication..." },
      { property: "og:title", content: "Udyam Adhar Registration | New MSME Registration Online" },
      { property: "og:description", content: "Udyam Adhar refers to the government’s new MSME registration system, replacing Udyog Aadhaar. Businesses can register online using Aadhaar authentication..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/udyog-aadhaar" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Adhar" linkTitle="Udyam Adhar Registration | New MSME Registration Online" content={`Udyam Adhar refers to the government’s new MSME registration system, replacing Udyog Aadhaar. Businesses can register online using Aadhaar authentication to obtain a unique Udyam Number and digitally signed MSME certificate. This process is completely digital, paperless, and free of cost. The Udyam Adhar system provides eligibility for government loans, subsidies, and financial schemes while allowing easy updates, verification, and certificate downloads. Startups and established businesses benefit from simplified compliance, faster registration, and instant digital recognition. Udyam Adhar ensures uninterrupted access to government programs, enhances credibility, and enables formal recognition of micro, small, and medium enterprises across India.`} html={html} />,
});
