import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhaar-verify.html?raw";

export const Route = createFileRoute("/udyam-aadhaar-verify")({
  head: () => ({
    meta: [
      { title: "Udyam Aadhaar Verify | Check MSME Udyam Registration Status" },
      { name: "description", content: "Udyam Aadhaar Verify allows businesses to confirm their MSME registration status through the official Udyam portal. By entering your Udyam Number or..." },
      { property: "og:title", content: "Udyam Aadhaar Verify | Check MSME Udyam Registration Status" },
      { property: "og:description", content: "Udyam Aadhaar Verify allows businesses to confirm their MSME registration status through the official Udyam portal. By entering your Udyam Number or..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-aadhaar-verify" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhaar Verify" linkTitle="Udyam Aadhaar Verify | Check MSME Udyam Registration Status" content={`Udyam Aadhaar Verify allows businesses to confirm their MSME registration status through the official Udyam portal. By entering your Udyam Number or Aadhaar-linked details, you can instantly check if your certificate is valid and up to date. Verification ensures eligibility for government schemes, bank loans, tenders, and subsidies. The process is secure, digital, and paperless, providing entrepreneurs with quick access to official records. Step-by-step instructions guide users through verification without errors. Regularly verifying your Udyam Aadhaar helps maintain compliance with MSME regulations and ensures uninterrupted access to financial and government benefits. This tool is essential for micro, small, and medium enterprises to stay legally recognized and ready for business operations.`} html={html} />,
});
