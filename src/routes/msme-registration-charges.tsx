import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-registration-charges.html?raw";

export const Route = createFileRoute("/msme-registration-charges")({
  head: () => ({
    meta: [
      { title: "MSME Registration Charges - Is MSME Registration Paid?" },
      { name: "description", content: "MSME registration charges refer to the cost of registering a business on the Udyam portal. The government provides this service entirely free of charge, with no registration fees or hidden costs. This policy encourages entrepreneurs and small business owners to formalize their micro, small, or medium enterprises,..." },
      { property: "og:title", content: "MSME Registration Charges - Is MSME Registration Paid?" },
      { property: "og:description", content: "MSME registration charges refer to the cost of registering a business on the Udyam portal. The government provides this service entirely free of charge, with no registration fees or hidden costs. This policy encourages entrepreneurs and small business owners to formalize their micro, small, or medium enterprises,..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-registration-charges" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME registration charges" linkTitle="MSME Registration Charges - Is MSME Registration Paid?" html={html} />,
});
