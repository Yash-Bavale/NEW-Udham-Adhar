import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhar-udyam.html?raw";

export const Route = createFileRoute("/aadhar-udyam")({
  head: () => ({
    meta: [
      { title: "Aadhar Udyam - Aadhaar Linked MSME Registration" },
      { name: "description", content: "Aadhar Udyam refers to the Aadhaar-linked MSME registration process conducted through the official Udyam portal, designed to help business owners register..." },
      { property: "og:title", content: "Aadhar Udyam - Aadhaar Linked MSME Registration" },
      { property: "og:description", content: "Aadhar Udyam refers to the Aadhaar-linked MSME registration process conducted through the official Udyam portal, designed to help business owners register..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/aadhar-udyam" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhar Udyam" linkTitle="Aadhar Udyam - Aadhaar Linked MSME Registration" content={`Aadhar Udyam refers to the Aadhaar-linked MSME registration process conducted through the official Udyam portal, designed to help business owners register quickly, securely, and without paperwork. By connecting the entrepreneur’s Aadhaar number directly with the registration application, the system enables instant verification through OTP authentication, ensuring accuracy and legitimacy. This Aadhaar-linked registration method eliminates complicated documentation, physical verification, or lengthy procedures, making it ideal for new entrepreneurs and small businesses seeking a simple and efficient way to gain official MSME recognition. Once the Aadhaar-based verification is complete, the business receives its Udyam Registration Number along with a digital certificate that serves as lifelong proof of MSME status. This certificate grants access to a wide variety of benefits—including priority sector lending, collateral-free loans, interest subsidies, government schemes, and tender opportunities—that help small enterprises grow and operate effectively. Aadhar Udyam provides a reliable and transparent registration method by automatically cross-checking business information with government databases such as PAN and GST, ensuring proper classification and compliance. The system also makes it easy for entrepreneurs to update business information, download their MSME certificate, and track eligibility for various schemes. This Aadhaar-enabled process empowers small businesses by simplifying formal registration, strengthening credibility, and providing a gateway to financial support and developmental opportunities. Whether transitioning from Udyog Aadhaar or registering for the first time, Aadhar Udyam ensures an efficient, secure, and user-friendly experience that supports the long-term growth and stability of India’s MSME sector.`} html={html} />,
});
