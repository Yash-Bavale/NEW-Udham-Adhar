import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-registration-charges.html?raw";

export const Route = createFileRoute("/msme-registration-charges")({
  head: () => ({
    meta: [
      { title: "MSME Registration Charges - Is MSME Registration Paid?" },
      { name: "description", content: "MSME registration charges refer to the cost of registering a business on the Udyam portal. The government provides this service entirely free of charge,..." },
      { property: "og:title", content: "MSME Registration Charges - Is MSME Registration Paid?" },
      { property: "og:description", content: "MSME registration charges refer to the cost of registering a business on the Udyam portal. The government provides this service entirely free of charge,..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/msme-registration-charges" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME registration charges" linkTitle="MSME Registration Charges - Is MSME Registration Paid?" content={`MSME registration charges refer to the cost of registering a business on the Udyam portal. The government provides this service entirely free of charge, with no registration fees or hidden costs. This policy encourages entrepreneurs and small business owners to formalize their micro, small, or medium enterprises, unlocking access to government benefits such as loans, subsidies, interest-free credit, and priority procurement opportunities. MSME registration requires only Aadhaar-based verification and basic business information, making the process simple, fast, and paperless. By registering without paying any charges, businesses can enhance credibility, maintain compliance with government regulations, and ensure uninterrupted eligibility for support programs designed to promote business growth, sustainability, and competitiveness across India. ---`} html={html} />,
});
