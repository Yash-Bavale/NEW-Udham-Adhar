import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-reg-certificate.html?raw";

export const Route = createFileRoute("/udyam-reg-certificate")({
  head: () => ({
    meta: [
      { title: "Udyam Reg Certificate - Download MSME Registration Certificate" },
      { name: "description", content: "The Udyam reg certificate is the official proof issued by the Government of India confirming that a business is registered under the MSME category. It is generated instantly upon completing the registration process on the Udyam portal, where entrepreneurs submit their basic business information and Aadhaar details..." },
      { property: "og:title", content: "Udyam Reg Certificate - Download MSME Registration Certificate" },
      { property: "og:description", content: "The Udyam reg certificate is the official proof issued by the Government of India confirming that a business is registered under the MSME category. It is generated instantly upon completing the registration process on the Udyam portal, where entrepreneurs submit their basic business information and Aadhaar details..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-reg-certificate" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Reg Certificate" linkTitle="Udyam Reg Certificate - Download MSME Registration Certificate" html={html} />,
});
