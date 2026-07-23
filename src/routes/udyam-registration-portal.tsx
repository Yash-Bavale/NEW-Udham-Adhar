import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-registration-portal.html?raw";

export const Route = createFileRoute("/udyam-registration-portal")({
  head: () => ({
    meta: [
      { title: "Udyam Registration Portal - Official MSME Registration Website" },
      { name: "description", content: "The Udyam registration portal is the official government website for MSME registration, providing a comprehensive, secure, and user-friendly platform for..." },
      { property: "og:title", content: "Udyam Registration Portal - Official MSME Registration Website" },
      { property: "og:description", content: "The Udyam registration portal is the official government website for MSME registration, providing a comprehensive, secure, and user-friendly platform for..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/udyam-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam registration portal" linkTitle="Udyam Registration Portal - Official MSME Registration Website" content={`The Udyam registration portal is the official government website for MSME registration, providing a comprehensive, secure, and user-friendly platform for businesses to register, update information, and download certificates. Designed for micro, small, and medium enterprises, the portal simplifies the registration process through Aadhaar-based verification, eliminating paperwork and manual approvals. By using the portal, entrepreneurs can receive a unique Udyam Registration Number and a digitally signed MSME certificate instantly, serving as official proof of business status. The portal allows businesses to access multiple government benefits, including collateral-free loans, interest subsidies, priority lending, technology support, reimbursement schemes, and eligibility for government tenders. The Udyam registration portal is accessible from anywhere, at any time, ensuring convenience, reliability, and compliance. Startups, small enterprises, and established businesses can complete registration, download certificates, and update their details quickly, making the portal a single-stop solution for all MSME-related needs. By streamlining registration, verification, and certification processes, the portal helps businesses enhance credibility, participate in government schemes, and leverage financial and operational support for long-term growth, competitiveness, and sustainability in India’s dynamic market ecosystem.`} html={html} />,
});
