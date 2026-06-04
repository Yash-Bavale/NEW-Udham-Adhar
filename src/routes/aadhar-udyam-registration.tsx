import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/aadhar-udyam-registration.html?raw";

export const Route = createFileRoute("/aadhar-udyam-registration")({
  head: () => ({
    meta: [
      { title: "Aadhar Udyam Registration - Access MSME Certificate" },
      { name: "description", content: "Aadhar Udyam registration is the process of linking your Aadhaar number with your MSME registration on the Udyam portal. This process ensures secure,..." },
      { property: "og:title", content: "Aadhar Udyam Registration - Access MSME Certificate" },
      { property: "og:description", content: "Aadhar Udyam registration is the process of linking your Aadhaar number with your MSME registration on the Udyam portal. This process ensures secure,..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.everythinghappens.in/aadhar-udyam-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Aadhar Udyam registration" linkTitle="Aadhar Udyam Registration - Access MSME Certificate" content={`Aadhar Udyam registration is the process of linking your Aadhaar number with your MSME registration on the Udyam portal. This process ensures secure, fast, and paperless registration. Once completed, the business receives a digitally signed MSME certificate, confirming its official status as a micro, small, or medium enterprise. The registration enables access to government schemes, financial assistance, subsidies, loans, and priority procurement benefits. Aadhaar linkage simplifies verification, supports easy future updates, and enhances credibility with banks and government authorities. By completing Aadhar Udyam registration, businesses gain formal recognition, ensure compliance, and maintain uninterrupted eligibility for all benefits provided under India’s MSME support programs, promoting sustainable growth and operational efficiency.`} html={html} />,
});
