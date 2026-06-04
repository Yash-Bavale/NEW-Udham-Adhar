import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-pan-registration.html?raw";

export const Route = createFileRoute("/udyam-pan-registration")({
  head: () => ({
    meta: [
      { title: "Udyam PAN Registration | Link PAN With MSME Udyam Certificate" },
      { name: "description", content: "Udyam PAN Registration allows businesses to link their PAN details with the official MSME Udyam certificate. This integration ensures accurate enterprise..." },
      { property: "og:title", content: "Udyam PAN Registration | Link PAN With MSME Udyam Certificate" },
      { property: "og:description", content: "Udyam PAN Registration allows businesses to link their PAN details with the official MSME Udyam certificate. This integration ensures accurate enterprise..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/udyam-pan-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam PAN Registration" linkTitle="Udyam PAN Registration | Link PAN With MSME Udyam Certificate" content={`Udyam PAN Registration allows businesses to link their PAN details with the official MSME Udyam certificate. This integration ensures accurate enterprise identification, eligibility for government benefits, and access to bank loans or subsidies. The process is secure, digital, and fully online, requiring Aadhaar and PAN details along with OTP verification. Linking PAN with Udyam registration prevents discrepancies, ensures regulatory compliance, and makes business records ready for government audits. Step-by-step instructions guide users through linking PAN to the Udyam certificate easily. Maintaining PAN integration with Udyam Registration strengthens credibility and provides seamless access to MSME schemes and tenders.`} html={html} />,
});
