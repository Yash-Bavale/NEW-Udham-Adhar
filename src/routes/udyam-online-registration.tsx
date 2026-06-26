import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingPage } from "@/components/site/SeoLandingPage";
import html from "@/content/wp/udyam-online-registration.html?raw";

export const Route = createFileRoute("/udyam-online-registration")({
  head: () => ({
    meta: [
      { title: "Udyam Online Registration - Quick MSME Registration Process" },
      { name: "description", content: "Udyam online registration is the official government platform for digitally registering your business as a micro, small, or medium enterprise. The process..." },
      { property: "og:title", content: "Udyam Online Registration - Quick MSME Registration Process" },
      { property: "og:description", content: "Udyam online registration is the official government platform for digitally registering your business as a micro, small, or medium enterprise. The process..." },
    ],
    links: [
      { rel: "canonical", href: "https://udyamadhar.in/udyam-online-registration" },
    ],
  }),
  component: () => <SeoLandingPage title="Udyam online registration" linkTitle="Udyam Online Registration - Quick MSME Registration Process" content={`Udyam online registration is the official government platform for digitally registering your business as a micro, small, or medium enterprise. The process is fully paperless, free, and requires only basic business information along with Aadhaar verification. Upon completion, businesses receive a unique Udyam Registration Number and a digitally signed MSME certificate instantly, which serves as legal proof of their status and eligibility for government schemes. Udyam online registration unlocks multiple benefits, including access to collateral-free loans, interest subsidies, technology support, participation in procurement tenders, and eligibility for various subsidy programs aimed at fostering growth. The portal ensures a secure, reliable, and user-friendly registration experience for startups, entrepreneurs, and established businesses, allowing them to formalize operations efficiently. It also integrates with PAN and GST databases to maintain accurate business classification and prevent duplication. The digital nature of Udyam online registration allows businesses to download certificates anytime, update enterprise information seamlessly, and stay compliant with government regulations. By completing Udyam online registration, businesses enhance credibility with banks, clients, and government agencies while gaining access to essential support for long-term growth, financial stability, and operational expansion in India’s competitive business environment.`} html={html} />,
});
