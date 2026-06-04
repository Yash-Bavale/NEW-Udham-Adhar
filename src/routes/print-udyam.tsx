import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/print-udyam.html?raw";

export const Route = createFileRoute("/print-udyam")({
  head: () => ({
    meta: [
      { title: "Print Udyam — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Print Udyam provides a secure and user-friendly way to print your MSME certificate after downloading it from the official Udyam portal. By entering your Udyam Number and verifying via OTP, you can access the certificate in PDF format, ready for printing. The certificate is essential for government tenders, bank..." },
      { property: "og:title", content: "Print Udyam — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Print Udyam provides a secure and user-friendly way to print your MSME certificate after downloading it from the official Udyam portal. By entering your Udyam Number and verifying via OTP, you can access the certificate in PDF format, ready for printing. The certificate is essential for government tenders, bank..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/print-udyam" },
    ],
  }),
  component: () => <SeoLandingPage title="Print Udyam" linkTitle="Print Udyam" html={html} />,
});
