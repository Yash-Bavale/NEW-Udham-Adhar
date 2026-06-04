import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/print-udyam-certificate-download.html?raw";

export const Route = createFileRoute("/print-udyam-certificate-download")({
  head: () => ({
    meta: [
      { title: "Print Udyam Certificate Download — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Print Udyam Certificate Download provides a quick, secure way to download and print your MSME certificate through Aadhaar-based verification. By entering your Udyam Number, completing OTP verification, and downloading the PDF, businesses obtain a valid certificate for banking, tenders, and government schemes. The..." },
      { property: "og:title", content: "Print Udyam Certificate Download — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Print Udyam Certificate Download provides a quick, secure way to download and print your MSME certificate through Aadhaar-based verification. By entering your Udyam Number, completing OTP verification, and downloading the PDF, businesses obtain a valid certificate for banking, tenders, and government schemes. The..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/print-udyam-certificate-download" },
    ],
  }),
  component: () => <SeoLandingPage title="Print Udyam Certificate Download" linkTitle="Print Udyam Certificate Download" html={html} />,
});
