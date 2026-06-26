import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-status.html?raw";

export const Route = createFileRoute("/udyam-certificate-status")({
  head: () => ({
    meta: [
      { title: "Udyam Certificate Status | Check MSME Registration Online" },
      { name: "description", content: "Udyam Certificate Status allows entrepreneurs to quickly verify the current status of their MSME registration online. By entering your Udyam Number, PAN,..." },
      { property: "og:title", content: "Udyam Certificate Status | Check MSME Registration Online" },
      { property: "og:description", content: "Udyam Certificate Status allows entrepreneurs to quickly verify the current status of their MSME registration online. By entering your Udyam Number, PAN,..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/udyam-certificate-status" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Certificate Status" linkTitle="Udyam Certificate Status | Check MSME Registration Online" content={`Udyam Certificate Status allows entrepreneurs to quickly verify the current status of their MSME registration online. By entering your Udyam Number, PAN, or Aadhaar-linked details, you can check if your certificate is active, pending, or requires updates. Ensuring an up-to-date certificate is crucial for eligibility to government subsidies, bank loans, tenders, and MSME schemes. The verification process is secure, digital, and paperless, providing instant confirmation. Step-by-step instructions make it easy for business owners to monitor and maintain compliance. Regularly checking Udyam Certificate Status helps micro, small, and medium enterprises avoid delays in accessing official benefits and maintain uninterrupted business operations.`} html={html} />,
});
