import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/msme-registration-charges.html?raw";

export const Route = createFileRoute("/msme-registration-charges")({
    head: () => ({
    meta: [
      { title: "MSME Registration Charges - Is MSME Registration Paid?" },
      { name: "description", content: "Expert consultancy assistance for msme registration charges - is msme registration paid?. Get help with Udyam/MSME registration, updates and certificates acr..." },
      { property: "og:title", content: "MSME Registration Charges - Is MSME Registration Paid?" },
      { property: "og:description", content: "Expert consultancy assistance for msme registration charges - is msme registration paid?. Get help with Udyam/MSME registration, updates and certificates acr..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/msme-registration-charges" },
    ],
  }),
  component: () => <SeoLandingPage title="MSME Registration Charges" linkTitle="MSME Registration Charges - Is MSME Registration Paid?" html={html} />,
});
