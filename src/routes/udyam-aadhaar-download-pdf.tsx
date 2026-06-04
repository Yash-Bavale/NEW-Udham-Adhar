import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-aadhaar-download-pdf.html?raw";

export const Route = createFileRoute("/udyam-aadhaar-download-pdf")({
  head: () => ({
    meta: [
      { title: "Udyam Aadhaar Download PDF – Get Your MSME Certificate" },
      { name: "description", content: "Udyam Aadhaar Download PDF allows registered businesses to access their official MSME certificate digitally in PDF format through the Udyam portal. Using..." },
      { property: "og:title", content: "Udyam Aadhaar Download PDF – Get Your MSME Certificate" },
      { property: "og:description", content: "Udyam Aadhaar Download PDF allows registered businesses to access their official MSME certificate digitally in PDF format through the Udyam portal. Using..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-aadhaar-download-pdf" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam Aadhaar Download PDF" linkTitle="Udyam Aadhaar Download PDF – Get Your MSME Certificate" content={`Udyam Aadhaar Download PDF allows registered businesses to access their official MSME certificate digitally in PDF format through the Udyam portal. Using your unique URN and mobile OTP verification, you can download your certificate instantly for printing or storage. The PDF serves as official proof of MSME status and is essential for accessing government loans, subsidies, tenders, and financial schemes. This process is secure, fast, paperless, and available 24/7, enabling entrepreneurs to maintain compliance, showcase credibility, and leverage all benefits associated with Udyam registration. The digital format ensures convenience for both startups and established enterprises.`} html={html} />,
});
