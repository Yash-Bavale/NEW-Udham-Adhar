import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-certificate-download-pdf.html?raw";

export const Route = createFileRoute("/udyam-certificate-download-pdf")({
  head: () => ({
    meta: [
      { title: "Udyam Certificate Download PDF — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Downloading Udyam Certificate PDF allows businesses to access their official MSME registration certificate instantly through the government portal. Using your Udyam Number and OTP verification, you can retrieve a digitally signed PDF for printing or storage. This certificate serves as legal proof of enterprise..." },
      { property: "og:title", content: "Udyam Certificate Download PDF — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Downloading Udyam Certificate PDF allows businesses to access their official MSME registration certificate instantly through the government portal. Using your Udyam Number and OTP verification, you can retrieve a digitally signed PDF for printing or storage. This certificate serves as legal proof of enterprise..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-certificate-download-pdf" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Certificate Download PDF" linkTitle="Udyam Certificate Download PDF" html={html} />,
});
