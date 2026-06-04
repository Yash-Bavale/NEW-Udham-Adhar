import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-number.html?raw";

export const Route = createFileRoute("/udyam-registration-number")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Number - Unique MSME Identification Code" },
      { name: "description", content: "The Udyam registration number is a unique identification code issued to each business after successful registration as an MSME on the official Udyam..." },
      { property: "og:title", content: "Udyam Registration Number - Unique MSME Identification Code" },
      { property: "og:description", content: "The Udyam registration number is a unique identification code issued to each business after successful registration as an MSME on the official Udyam..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-registration-number" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Registration Number" linkTitle="Udyam Registration Number - Unique MSME Identification Code" content={`The Udyam registration number is a unique identification code issued to each business after successful registration as an MSME on the official Udyam portal. This number acts as permanent proof of your business’s Micro, Small, or Medium Enterprise status and is essential for accessing government schemes, subsidies, collateral-free loans, priority lending, and participation in procurement tenders. The Udyam registration number ensures credibility and authenticity, enabling businesses to operate formally while complying with government regulations. Once assigned, it remains valid throughout the lifetime of the business and is linked with a digitally signed Udyam certificate that can be downloaded anytime from the portal. Using this number, banks, clients, and government authorities can verify your MSME registration instantly, eliminating the need for repetitive documentation. The unique registration ID also facilitates business growth by providing access to various financial and operational support programs designed for small and medium enterprises. Whether you are a startup or an established business, having a Udyam registration number enhances your market credibility, ensures eligibility for government benefits, and simplifies interactions with institutions that require verified MSME status.`} html={html} />,
});
