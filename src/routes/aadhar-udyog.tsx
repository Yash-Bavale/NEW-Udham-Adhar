import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhar-udyog.html?raw";

export const Route = createFileRoute("/aadhar-udyog")({
  head: () => ({
    meta: [
      { title: "Aadhar Udyog - Aadhaar Based Udyog Aadhar Registration" },
      { name: "description", content: "Aadhar Udyog refers to the Aadhaar-based MSME registration mechanism that simplifies the authentication and verification process for entrepreneurs registering their businesses under government norms. This system connects an individual’s Aadhaar number directly with their MSME application, ensuring secure and fast..." },
      { property: "og:title", content: "Aadhar Udyog - Aadhaar Based Udyog Aadhar Registration" },
      { property: "og:description", content: "Aadhar Udyog refers to the Aadhaar-based MSME registration mechanism that simplifies the authentication and verification process for entrepreneurs registering their businesses under government norms. This system connects an individual’s Aadhaar number directly with their MSME application, ensuring secure and fast..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/aadhar-udyog" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhar Udyog" linkTitle="Aadhar Udyog - Aadhaar Based Udyog Aadhar Registration" html={html} />,
});
