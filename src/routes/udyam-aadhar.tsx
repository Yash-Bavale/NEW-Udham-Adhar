import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhar.html?raw";

export const Route = createFileRoute("/udyam-aadhar")({
  head: () => ({
    meta: [
      { title: "Udyam Aadhar - Aadhaar-based MSME Registration" },
      { name: "description", content: "Udyam Aadhar refers to the Aadhaar-based MSME registration process available on the government’s official Udyam portal, created to streamline verification and eliminate paperwork for business owners. By linking an entrepreneur’s Aadhaar number with their MSME application, the registration becomes simple, fast, and..." },
      { property: "og:title", content: "Udyam Aadhar - Aadhaar-based MSME Registration" },
      { property: "og:description", content: "Udyam Aadhar refers to the Aadhaar-based MSME registration process available on the government’s official Udyam portal, created to streamline verification and eliminate paperwork for business owners. By linking an entrepreneur’s Aadhaar number with their MSME application, the registration becomes simple, fast, and..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-aadhar" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhar" linkTitle="Udyam Aadhar - Aadhaar-based MSME Registration" html={html} />,
});
