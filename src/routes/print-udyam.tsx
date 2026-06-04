import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/print-udyam.html?raw";

export const Route = createFileRoute("/print-udyam")({
  head: () => ({
    meta: [
      { title: "Print Udyam Certificate | MSME Certificate Print Online" },
      { name: "description", content: "Print Udyam provides a secure and user-friendly way to print your MSME certificate after downloading it from the official Udyam portal. By entering your..." },
      { property: "og:title", content: "Print Udyam Certificate | MSME Certificate Print Online" },
      { property: "og:description", content: "Print Udyam provides a secure and user-friendly way to print your MSME certificate after downloading it from the official Udyam portal. By entering your..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/print-udyam" },
    ],
  }),
  component: () => <SeoLandingPage title="Print Udyam" linkTitle="Print Udyam Certificate | MSME Certificate Print Online" content={`Print Udyam provides a secure and user-friendly way to print your MSME certificate after downloading it from the official Udyam portal. By entering your Udyam Number and verifying via OTP, you can access the certificate in PDF format, ready for printing. The certificate is essential for government tenders, bank loans, and subsidy applications. The process is entirely digital and paperless, allowing businesses to maintain compliance and credibility. Entrepreneurs can print the certificate multiple times if required, ensuring uninterrupted access to official documentation. This guide provides clear, step-by-step instructions for hassle-free printing of your Udyam certificate, making it convenient for daily business operations.`} html={html} />,
});
