import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhaar-registration.html?raw";

export const Route = createFileRoute("/udyam-aadhaar-registration")({
  head: () => ({
    meta: [
      { title: "Udyam Aadhaar Registration - Link Aadhaar for MSME Registration" },
      { name: "description", content: "Udyam Aadhaar registration is the official process of linking an entrepreneur’s Aadhaar number with their MSME registration on the Udyam portal. This Aadhaar linkage ensures secure, fast, and paperless registration, allowing businesses to complete the process without submitting physical documents. Once registration..." },
      { property: "og:title", content: "Udyam Aadhaar Registration - Link Aadhaar for MSME Registration" },
      { property: "og:description", content: "Udyam Aadhaar registration is the official process of linking an entrepreneur’s Aadhaar number with their MSME registration on the Udyam portal. This Aadhaar linkage ensures secure, fast, and paperless registration, allowing businesses to complete the process without submitting physical documents. Once registration..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-aadhaar-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhaar registration" linkTitle="Udyam Aadhaar Registration - Link Aadhaar for MSME Registration" html={html} />,
});
