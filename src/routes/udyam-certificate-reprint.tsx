import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-reprint.html?raw";

export const Route = createFileRoute("/udyam-certificate-reprint")({
  head: () => ({
    meta: [
      { title: "Udyam Certificate Reprint | Download MSME Certificate Again" },
      { name: "description", content: "Udyam Certificate Reprint allows businesses to download and reprint their MSME certificate from the official Udyam portal if the original copy is lost or..." },
      { property: "og:title", content: "Udyam Certificate Reprint | Download MSME Certificate Again" },
      { property: "og:description", content: "Udyam Certificate Reprint allows businesses to download and reprint their MSME certificate from the official Udyam portal if the original copy is lost or..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/udyam-certificate-reprint" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Certificate Reprint" linkTitle="Udyam Certificate Reprint | Download MSME Certificate Again" content={`Udyam Certificate Reprint allows businesses to download and reprint their MSME certificate from the official Udyam portal if the original copy is lost or misplaced. By entering your Udyam Number and verifying via OTP, entrepreneurs can instantly access a secure PDF for printing and official use. The certificate is required for loans, government tenders, subsidies, and compliance with MSME regulations. The reprint process is digital, fast, and paperless, ensuring convenience and security. Step-by-step instructions make the process hassle-free. Reprinting your Udyam Certificate ensures continuous access to official documentation, helping micro, small, and medium enterprises stay compliant and ready for all business operations.`} html={html} />,
});
