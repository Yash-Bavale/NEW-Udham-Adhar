import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhaar-download-pdf.html?raw";

export const Route = createFileRoute("/udyam-aadhaar-download-pdf")({
  head: () => ({
    meta: [
      { title: "Udyam Aadhaar Download PDF — Udyam / MSME Consultancy Help" },
      { name: "description", content: "Udyam Aadhaar Download PDF allows registered businesses to access their official MSME certificate digitally in PDF format through the Udyam portal. Using your unique URN and mobile OTP verification, you can download your certificate instantly for printing or storage. The PDF serves as official proof of MSME status..." },
      { property: "og:title", content: "Udyam Aadhaar Download PDF — Udyam / MSME Consultancy Help" },
      { property: "og:description", content: "Udyam Aadhaar Download PDF allows registered businesses to access their official MSME certificate digitally in PDF format through the Udyam portal. Using your unique URN and mobile OTP verification, you can download your certificate instantly for printing or storage. The PDF serves as official proof of MSME status..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-aadhaar-download-pdf" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhaar Download PDF" linkTitle="Udyam Aadhaar Download PDF" html={html} />,
});
